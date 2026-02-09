import React, { useState } from 'react'
import authService from '../appwrite/auth'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Logo } from './index'
import { useForm } from 'react-hook-form'

function Signup() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { register, handleSubmit } = useForm()

  const create = async (data) => {
    setError('')
    try {
      await authService.createAccount(data)
      // ✅ Account + session created
      // ❌ NO Redux dispatch
      // ❌ NO profile logic
      window.location.replace('/')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center text-2xl" style={{font: "Seoge UI"}}>
      <div className="mx-auto bg-[#81B9F9] rounded-[20px] px-4 py-2 border border-[#878686] shadow-[inset_-4px_4px_4px_8px_rgba(85,76,76,0.25),_-12px_16px_4px_4px_rgba(105,102,129,0.5)]">
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
          </span>
        </div>  

        <h2 className="text-center font-bold leading-tight text-3xl">
          Signup to create account
        </h2>

        <p className="mt-2 text-center text-lg text-black">
          Already have an account?{' '}
          <Link to="/login" className="font-medium hover:underline text-[#8375F9]">
            Sign In
          </Link>
        </p>

        {error && (
          <p className="text-red-600 mt-8 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit(create)}>
          <div className="flex flex-col space-y-5">
            <Input
              className="inline-block w-[30vw] border-none rounded-[100px]"
              placeholder="Enter your name"
              label="Full name:"
              {...register('name', { required: true })}
            />

            <Input
              className="inline-block w-[30vw] border-none rounded-lg"
              placeholder="Enter your email id"
              label="Email:"
              type="email"  
              {...register('email', { required: true })}
            />

            <Input
              className="inline-block w-[30vw] border-none rounded-[100px]"
              placeholder="Enter your password"
              label="Password:"
              type="password"
              {...register('password', { required: true })}
            />

            <Button type="submit" bgColor="bg-[#2CBC46]" textColor="text-white" className="inline-block w-[16vw] h-[8vh] mx-auto font-bold ">
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
