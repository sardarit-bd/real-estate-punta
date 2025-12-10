'use client'

import { useState } from 'react'
import RichTextEditor from '../components/RichTextEditor'
import CustomSelect from '@/components/dashboard/Admin/CustomSelect'

export default function PostForm({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  mode = 'create'
}) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'draft',
    author: 'Admin User',
    tags: '',
    featuredImage: null,
    featuredImagePreview: '',
    metaTitle: '',
    metaDescription: '',
    slug: '',
    enableComments: true,
    featuredPost: false,
    pinToTop: false,
    ...initialData
  })
  
  const [imageUploading, setImageUploading] = useState(false)

  // Options for dropdowns
  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'scheduled', label: 'Scheduled' }
  ]

  const categoryOptions = [
    { value: '', label: 'Select Category' },
    { value: 'technology', label: 'Technology' },
    { value: 'web-design', label: 'Web Design' },
    { value: 'accessibility', label: 'Accessibility' },
    { value: 'backend', label: 'Backend' },
    { value: 'database', label: 'Database' },
    { value: 'performance', label: 'Performance' },
    { value: 'business', label: 'Business' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'travel', label: 'Travel' },
    { value: 'food', label: 'Food' }
  ]

  const authorOptions = [
    { value: 'admin-user', label: 'Admin User' },
    { value: 'editor-1', label: 'Editor 1' },
    { value: 'editor-2', label: 'Editor 2' },
    { value: 'guest-author', label: 'Guest Author' }
  ]

  const visibilityOptions = [
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' },
    { value: 'password-protected', label: 'Password Protected' }
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file type
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPG, PNG, GIF, etc.)')
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setImageUploading(true)

    // In a real app, you would upload to a server/cloud storage
    // For demo, we'll create a local preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        featuredImage: file,
        featuredImagePreview: reader.result
      }))
      setImageUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      featuredImage: null,
      featuredImagePreview: ''
    }))
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
      .substring(0, 100)
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
      metaTitle: prev.metaTitle || title.substring(0, 60)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert('Please enter a post title')
      return
    }
    
    if (!formData.content.trim()) {
      alert('Please enter post content')
      return
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title Input */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-3">
              Post Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#103B29] focus:border-transparent text-lg"
              placeholder="Enter a compelling title for your post"
            />
            <p className="text-sm text-gray-500 mt-2">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Excerpt Input */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-800 mb-3">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#103B29] focus:border-transparent"
              placeholder="A brief summary of your post (appears in listings and social media)"
            />
            <p className="text-sm text-gray-500 mt-2">
              {formData.excerpt.length}/160 characters
            </p>
          </div>

          {/* Content Editor */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Content *
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Write your amazing content here..."
            />
          </div>

          {/* Featured Image Upload */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Featured Image
            </label>
            
            {formData.featuredImagePreview ? (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={formData.featuredImagePreview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  <p>File: {formData.featuredImage?.name || 'Existing image'}</p>
                  {formData.featuredImage?.size && (
                    <p>Size: {(formData.featuredImage.size / 1024 / 1024).toFixed(2)} MB</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-100 transition duration-200">
                <input
                  type="file"
                  id="featuredImage"
                  name="featuredImage"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="featuredImage" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-700 font-medium mb-2">
                      {imageUploading ? 'Uploading...' : 
                       formData.featuredImagePreview ? 'Change Image' : 'Upload Featured Image'}
                    </p>
                    <p className="text-sm text-gray-500">
                      JPG, PNG, GIF up to 5MB
                    </p>
                    <button
                      type="button"
                      onClick={() => document.getElementById('featuredImage').click()}
                      className="mt-4 px-4 py-2 bg-[#103B29] text-white rounded-lg hover:bg-[#0c2d20] transition duration-200"
                      disabled={imageUploading}
                    >
                      {imageUploading ? 'Uploading...' : 'Choose Image'}
                    </button>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar Settings */}
        <div className="space-y-8">
          {/* Publish Box */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {mode === 'create' ? 'Publish' : 'Update'}
            </h3>
            
            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <CustomSelect
                  value={formData.status}
                  options={statusOptions}
                  onChange={(value) => handleSelectChange('status', value)}
                  className="w-full"
                  variant="admin"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <CustomSelect
                  value={formData.category}
                  options={categoryOptions}
                  onChange={(value) => handleSelectChange('category', value)}
                  className="w-full"
                  variant="admin"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <CustomSelect
                  value={formData.author}
                  options={authorOptions}
                  onChange={(value) => handleSelectChange('author', value)}
                  className="w-full"
                  variant="admin"
                />
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#103B29] focus:border-transparent"
                  placeholder="tag1, tag2, tag3"
                />
                <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#103B29] hover:bg-[#0c2d20] text-white px-6 py-3 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-4 w-4 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {mode === 'create' ? 'Publishing...' : 'Updating...'}
                    </span>
                  ) : (
                    mode === 'create' ? 'Publish Now' : 'Update Post'
                  )}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  {mode === 'create' ? 'Save Draft' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  )
}