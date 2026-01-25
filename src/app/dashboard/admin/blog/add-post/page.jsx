'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PostForm from './PostForm'
import toast from 'react-hot-toast'

export default function AddPostPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success) {
        toast.success('Post created successfully!')
        router.push('/dashboard/admin/blog')
      } else {
        toast.error(data.message || 'Failed to create post')
      }
    } catch (error) {
      console.error('Failed to create post:', error)
      toast.error('An error occurred while creating the post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Create New Post</h1>
          <p className="text-gray-600 mt-2">Add a new blog post to your website</p>
        </div>
        <button
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
        >
          ← Back
        </button>
      </div>

      <PostForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        mode="create"
      />
    </div>
  )
}