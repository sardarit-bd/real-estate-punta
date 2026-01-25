'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PostForm from '../../add-post/PostForm'
import toast from 'react-hot-toast'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [post, setPost] = useState(null)

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    try {
      setIsLoading(true)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/${postId}`,
        {
          credentials: 'include'
        }
      )

      const data = await res.json()

      if (data.success) {
        // Format data for PostForm
        const formattedPost = {
          title: data.data.title,
          excerpt: data.data.excerpt,
          content: data.data.content,
          category: data.data.category,
          status: data.data.status,
          tags: data.data.tags.join(', '), // Convert array to comma-separated string
          featuredImage: data.data.featuredImage || ''
        }
        setPost(formattedPost)
      } else {
        toast.error('Post not found')
        router.push('/dashboard/admin/blog')
      }
    } catch (error) {
      console.error('Failed to fetch post:', error)
      toast.error('Failed to load post')
      router.push('/dashboard/admin/blog')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/${postId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(formData)
        }
      )

      const data = await res.json()

      if (data.success) {
        toast.error('Post updated successfully!')
        router.push('/dashboard/admin/blog')
      } else {
        toast.error(data.message || 'Failed to update post')
      }
    } catch (error) {
      console.error('Failed to update post:', error)
      toast.error('An error occurred while updating the post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/admin/blog')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#103B29] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post data...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Post not found</h2>
        <button
          onClick={() => router.push('/dashboard/admin/blog')}
          className="text-[#103B29] hover:text-[#0c2d20] font-medium"
        >
          ← Back to Posts
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Edit Post</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-600">Editing: {post.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/pages/blog/${postId}`)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition duration-200"
          >
            View Post
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>

      <PostForm
        initialData={post}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        mode="edit"
      />
    </div>
  )
}