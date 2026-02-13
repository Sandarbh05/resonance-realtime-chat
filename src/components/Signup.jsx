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
    <div className="w-full" style={{font: "Seoge UI"}}>
      <div className="w-full bg-[#81B9F9] rounded-2xl p-8 sm:p-6 border border-[#878686] shadow-[inset_-4px_4px_4px_8px_rgba(85,76,76,0.25),_-12px_16px_4px_4px_rgba(105,102,129,0.5)]">
        <h2 className="text-center font-bold leading-tight text-2xl sm:text-4xl">
          Signup to create account
        </h2>

        <p className="mt-2 text-center text-lg sm:text-base text-black">
          Already have an account?{' '}
          <Link to="/login" className="font-medium hover:underline text-[#8375F9]">
            Sign In
          </Link>
        </p>

        {error && (
          <p className="text-red-600 mt-8 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit(create)} className="text-md sm:text-2xl mt-4 md:mt-0">
          <div className="space-y-4 md:space-y-8">
            <Input
              className=""
              placeholder="Enter your name"
              label="Full name:"
              {...register('name', { required: true })} 
            />

            <Input
              className=""
              placeholder="Enter your email id"
              label="Email:"
              type="email"  
              {...register('email', { required: true })}
            />

            <Input
              className="" 
              placeholder="Enter your password"
              label="Password:"
              type="password"
              {...register('password', { required: true })}
            />

            <Button type="submit" bgColor="bg-[#2CBC46]" textColor="text-white" className="sm:w-1/2 font-bold mx-auto mt-6">
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
