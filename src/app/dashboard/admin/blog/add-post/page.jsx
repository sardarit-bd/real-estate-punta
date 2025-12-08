'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PostForm from './PostForm'

export default function AddPostPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Creating post:', formData)
    alert('Post created successfully!')
    router.push('/posts')
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