const conf={
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId:  String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId:  String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteUsersId:  String(import.meta.env.VITE_APPWRITE_USERS_TABLE_ID),
    appwriteRoomsId:  String(import.meta.env.VITE_APPWRITE_ROOMS_TABLE_ID),
    appwriteMessagesId:  String(import.meta.env.VITE_APPWRITE_MESSAGES_TABLE_ID),
    appwriteBucketId:  String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
} 
export default conf;