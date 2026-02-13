import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input, Logo } from './index'
import authService from '../appwrite/auth'
import { useForm } from 'react-hook-form'

function Login() {
  const { register, handleSubmit } = useForm()
  const [error, setError] = useState('')

  const login = async (data) => {
    setError('')
    try {
      await authService.login(data)

      // 🔑 HARD RELOAD → App.jsx rehydrates auth + profile
      window.location.replace('/')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="w-full" style={{ font: "Seoge UI" }}>
  <div className="w-full bg-[#81B9F9] rounded-2xl p-10 sm:p-8 border border-[#878686] shadow-[inset_-4px_4px_4px_8px_rgba(85,76,76,0.25),_-12px_16px_4px_4px_rgba(105,102,129,0.5)]">

    <h2 className="text-center font-bold leading-tight text-2xl sm:text-4xl">
      Sign in to your account
    </h2>

    <p className="mt-2 text-center text-lg sm:text-base text-black">
      Don&apos;t have an account?{" "}
      <Link
        to="/signup"
        className="font-medium hover:underline text-[#8375F9]"
      >
        Sign Up
      </Link>
    </p>

    {error && (
      <p className="text-red-600 mt-6 text-center">
        {error}
      </p>
    )}

    <form
      onSubmit={handleSubmit(login)}
      className="text-md sm:text-2xl mt-10"
    >
      <div className="space-y-12 md:space-y-14">

        <Input
          placeholder="Enter your email id"
          label="Email:"
          type="email"
          {...register('email', { required: true })}
        />

        <Input
          placeholder="Enter your password"
          label="Password:"
          type="password"
          {...register('password', { required: true })}
        />

        <Button
          type="submit"
          bgColor="bg-[#2CBC46]"
          textColor="text-white"
          className="sm:w-1/2 font-bold mx-auto mt-6"
        >
          Sign in
        </Button>

      </div>
    </form>

  </div>
</div>

  )
}

export default Login
