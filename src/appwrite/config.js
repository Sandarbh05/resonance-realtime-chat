/* eslint-disable no-useless-catch */
import conf from "../conf/conf.js";
import {Client, ID, TablesDB, Storage, Query} from "appwrite";

export class Service{

    client=new Client();
    
    tablesDB;

    bucket;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        
        this.tablesDB=new TablesDB(this.client);
        this.bucket=new Storage(this.client);
    }

    //Services :

    //User-related Services :

    // Create user profile (after signup)
    async createUserProfile(authUser){
        if (!authUser || !authUser.$id) {
            throw new Error("Invalid authUser passed to createUserProfile");
        }
        try {
        // check if user already exists
            return await this.tablesDB.getRow(
            conf.appwriteDatabaseId,
            conf.appwriteUsersId,
            authUser.$id
            );
        } catch (error) {
        // user does not exist → create
            if (error.code === 404) {
            return await this.tablesDB.createRow({
                databaseId: conf.appwriteDatabaseId,    
                tableId: conf.appwriteUsersId,
                rowId: authUser.$id, // SAME AS AUTH ID
                data: {
                name: authUser.name || "Anonymous",
                avatarUrl: null,
                lastSeen: Date.now(),
                },
            });
            }   
            throw error;
        }
    }

    //Get user profile
    async getUserProfile(userId){
        if(!userId){
            throw new Error("getUserProfile :: userId is required.")
        }

        try {
            return await this.tablesDB.getRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteUsersId,
                rowId: userId,
        })
        } catch (error) {
            if(error.code===404){
                return null; //user profile not found
            }
            throw error;
        }
    }
    

    //Room-related Services :

    //Create Private Rooms
    async createPrivateRoom(userIdA, userIdB){
        if(!userIdA || !userIdB){
            throw new Error("createPrivateRoom :: both userIds are required")
        }

        if(userIdA === userIdB){
            throw new Error("createPrivateRoom :: cannot create room with self")
        }

        //deterministic order : 
        const members = [userIdA, userIdB].sort();

        try {
            //1)Check if DM already exists : 
            const existing= await this.tablesDB.listRows({
                databaseId : conf.appwriteDatabaseId,
                tableId : conf.appwriteRoomsId,
                queries : [
                    Query.equal("isGroup", false),
                    Query.contains("members", members[0]),
                    Query.contains("members", members[1]),
                ]
            })
            
            if(existing.rows.length>0){
                return existing.rows[0]; //reuse existing DM
            }

            //Otherwise --> 2)Create new private room :
            return await this.tablesDB.createRow({
                databaseId : conf.appwriteDatabaseId,
                tableId : conf.appwriteRoomsId,
                rowId: ID.unique(),
                data : {
                    name : null,
                    isGroup : false,
                    members,
                    lastMessageId : null,
                    updatedAt : Date.now(),
                },
            });

        } catch (error) {
            throw error;
        }
    }

    //Create Group Rooms :
    // async createGroupRoom({name, creatorId}){
    //     if(!name || !creatorId){
    //         throw new Error("createGroupRoom :: name and creatorId are required")
    //     }

    //     try {
    //         return await this.tablesDB.createRow({
    //             databaseId : conf.appwriteDatabaseId,
    //             tableId : conf.appwriteRoomsId,
    //             rowId : ID.unique(),
    //             data : {
    //                 name, 
    //                 isGroup: true,
    //                 members : [creatorId], //Creator is the first member
    //                 lastMessageId : null,
    //                 updatedAt : Date.now(),
    //             },
    //         })
    //     } catch (error) {
    //         throw error 
    //     }
    // }
    async createGroupRoom({ name, creatorId }) {
    if (!name || !creatorId) {
        throw new Error("createGroupRoom :: name and creatorId required")
    }

    return await this.tablesDB.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteRoomsId,
        rowId: ID.unique(),
        data: {
        name,
        isGroup: true,
        members: [creatorId],
        admins: [creatorId],     // 🔑 ADMIN SYSTEM
        lastMessageId: null,
        updatedAt: Date.now(),
        },
    })
    }


    //Add user to Group DMs :
    // Add user to group room
    async addUserToRoom({ roomId, userId }) {
        if (!roomId || !userId) {
            throw new Error("addUserToRoom :: roomId and userId required")
        }

        try { 
            const room = await this.tablesDB.getRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteRoomsId,
                rowId: roomId,
            })

            if (!room.isGroup) {
                throw new Error("Cannot add users to private room")
            }

            if (room.members.includes(userId)) {
                return room // already member
            }

            return await this.tablesDB.updateRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteRoomsId,
                rowId: roomId,
                data: {
                    members: [...room.members, userId],
                    updatedAt: Date.now(),
                },
            })
        } catch (error) {
            throw error
        }
    }


    //Get User Rooms
    async getUserRooms(userId){
        if (!userId) {
            throw new Error("getUserRooms :: userId is required");
        }

        try {
            const result = await this.tablesDB.listRows({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteRoomsId,
            queries: [
                Query.contains("members", userId),
                Query.orderDesc("updatedAt"),
            ],
        });
        return result.rows;
        } catch (error) {
            throw error;
        }
    }

    //Get Room Members 
    async getRoomMembers(roomId){
        if(!roomId){
            throw new Error("getRoomMembers :: roomId is required")
        }

        try {
            const room=await this.tablesDB.getRow({
                databaseId : conf.appwriteDatabaseId,
                tableId : conf.appwriteRoomsId,
                rowId : roomId,
            });

            return room.members; //string[]

        } catch (error) {
            throw error;
        }
    }

    //Get Room Details :
    async getRoom(roomId) {
        if (!roomId) {
            throw new Error("getRoom :: roomId is required")
        }

        try {
            return await this.tablesDB.getRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteRoomsId,
                rowId: roomId,
            })
        } catch (error) {
            throw error
        }
    }


    //Message-related Services :

    //Send Message
    async sendMessage({roomId, senderId, text="", attachments=[]}){
        if(!roomId || !senderId){
            throw new Error("sendMessage :: roomId and senderId are required")
        }

        if(!text && !attachments){
            throw new Error("sendMessage :: message can be empty")
        }
        try {
            //1) Create Message
            const message=await this.tablesDB.createRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteMessagesId,
                rowId : ID.unique(),
                data : {
                    roomId,
                    senderId,
                    text,
                    attachments,
                    readBy: senderId,
                    $createdAt: Date.now(),
                }
            })

            //2) Update Room Metadata
            await this.tablesDB.updateRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteRoomsId,
                rowId: roomId,
                data : {
                    lastMessageId : message.$id,
                    $updatedAt : Date.now(),
                },
            });
            return message;
        } catch (error) {
            throw error;
        }
    }

    //Get Room Messages 
    async getRoomMessages(roomId, limit=50){
        if(!roomId){
            throw new Error("getRoomMessages :: roomId is required")
        }

        try {
            const result=await this.tablesDB.listRows({
                databaseId : conf.appwriteDatabaseId,
                tableId : conf.appwriteMessagesId,
                queries : [
                    Query.equal("roomId", roomId),
                    Query.orderAsc("$createdAt"),
                    Query.limit(limit),
                ],
            });
            return result.rows //always an array

        } catch (error) {
            throw error;
        }
    }

    //Mark Message Read
    async markMessageRead(messageId, userId){
        if(!userId || !messageId){
            throw new Error("markMessageRead :: messageId and userId are required")
        }

        try {
            //1) Fetch Message
            const message=await this.tablesDB.getRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteMessagesId,
                rowId: messageId,
            })

            //2) Already marked read --> Do nothing
            if(message.readBy.includes(userId)){
                return message;
            }

            //3) Update Readby Array
            const updated=await this.tablesDB.updateRow({
                readBy : [message.readyBy, userId],
            },
        );
        return updated;
        } catch (error) {
            throw error;
        }
    }

    //SUBSCRIPTION MODEL --> FOR REALTIME UPDATES : 
    subscribeToRoomMessages(roomId, callback) {
        if (!roomId) {
            throw new Error("subscribeToRoomMessages :: roomId is required");
        }

        const channel = `databases.${conf.appwriteDatabaseId}.tables.${conf.appwriteMessagesId}.rows`;

        return this.client.subscribe(channel, (event) => {
            const payload = event.payload;

            // Only messages of this room
            if (payload.roomId === roomId) {
            callback(event);
            }
        });
    }

    // 🔔 Subscribe to room changes (DMs, groups, membership, updates)
    subscribeToUserRooms(userId, callback) {
        if (!userId) {
            throw new Error("subscribeToUserRooms :: userId is required")
        }

        const channel = `databases.${conf.appwriteDatabaseId}.tables.${conf.appwriteRoomsId}.rows`

        return this.client.subscribe(channel, (event) => {
            const payload = event.payload

            // Only react to rooms where this user is a member
            if (payload?.members?.includes(userId)) {
                callback(event)
            }
        })
    }



}

const service = new Service();
export default service;

