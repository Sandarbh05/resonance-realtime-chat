import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { completeProfile } from '../store/authSlice'
import service from '../appwrite/config'
import { Input, Button } from './index'

function Profile() {
  const { register, handleSubmit } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const authUser = useSelector(state => state.auth.userData)

  const submit = async (data) => {
    if (!authUser || loading) return

    setLoading(true)
    setError('')

    try {
      const profile = await service.createUserProfile({
        $id: authUser.$id,
        name: data.name,
        avatarUrl: null,
      })

      // ✅ store real profile in Redux
      dispatch(completeProfile(profile))

      // ✅ hand control back to AuthLayout
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="w-full" style={{ font: "Seoge UI" }}>
  <div className="w-full bg-[#81B9F9] rounded-2xl p-10 sm:p-8 border border-[#878686] shadow-[inset_-4px_4px_4px_8px_rgba(85,76,76,0.25),_-12px_16px_4px_4px_rgba(105,102,129,0.5)]">

    <h2 className="text-center font-bold leading-tight text-2xl sm:text-4xl">
      Profile Setup
    </h2>

    <form
      onSubmit={handleSubmit(submit)}
      className="text-md sm:text-2xl mt-4"
    >
      <div className="space-y-12 md:space-y-8">

        <Input
          label="Your Name"
          placeholder="Enter your name"
          {...register('name', { required: true, minLength: 2 })}
        />

        {error && (
          <p className="text-red-600 text-center text-sm">
            {error}
          </p>
        )}

        <Button
          type="submit"
          bgColor="bg-[#2CBC46]"
          textColor="text-white"
          className="sm:w-1/2 font-bold mx-auto mt-6"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Continue'}
        </Button>

      </div>
    </form>

  </div>
</div>

  )
}

export default Profile
