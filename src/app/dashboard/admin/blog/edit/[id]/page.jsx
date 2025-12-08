'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PostForm from '../../add-post/PostForm'

// Mock post data - in a real app, fetch from API
const mockPost = {
  id: 1,
  title: 'Getting Started with Next.js 14',
  excerpt: 'Learn how to build modern web applications using Next.js 14 with the new App Router and server components.',
  content: `<h2>Introduction to Next.js 14</h2>
    <p>Next.js 14 brings significant improvements to the framework, making it even more powerful for building modern web applications.</p>
    
    <h3>Key Features</h3>
    <ul>
      <li><strong>App Router:</strong> Stable and production-ready with improved performance</li>
      <li><strong>Server Components:</strong> Reduced JavaScript bundle sizes</li>
      <li><strong>Enhanced Caching:</strong> Better performance out of the box</li>
      <li><strong>Partial Prerendering:</strong> Experimental feature for dynamic content</li>
    </ul>
    
    <h3>Getting Started</h3>
    <p>To create a new Next.js 14 project:</p>
    <pre><code>npx create-next-app@latest my-app</code></pre>`,
  category: 'Technology',
  status: 'published',
  author: 'John Doe',
  tags: 'nextjs, react, web-development, javascript',
  featuredImagePreview: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
  metaTitle: 'Getting Started with Next.js 14 - Complete Guide',
  metaDescription: 'Learn how to build modern web applications using Next.js 14 with our complete beginner guide.',
  slug: 'getting-started-with-nextjs-14',
  enableComments: true,
  featuredPost: true,
  pinToTop: false,
  createdAt: '2024-01-15',
  updatedAt: '2024-01-15',
  views: 1250,
  comments: 24
}

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [post, setPost] = useState(null)

  useEffect(() => {
    // Simulate fetching post data
    const fetchPost = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      setPost(mockPost)
      setIsLoading(false)
    }
    
    fetchPost()
  }, [postId])

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Updating post:', { ...formData, id: postId })
    alert('Post updated successfully!')
    router.push('/posts')
  }

  const handleCancel = () => {
    router.back()
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
          onClick={() => router.push('/posts')}
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
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
              ID: {postId}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/pages/blog/${postId}`)}
            className="px-4 py-2 bg-[#1F3A34] hover:bg-[#1F3A34] text-white rounded-lg transition duration-200"
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