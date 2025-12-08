'use client'

import { useState, useMemo } from 'react'
import Link from "next/link"
import PostCard from "./components/PostCard"

// Mock data
const mockPosts = [
  {
    id: 1,
    title: 'Getting Started with Next.js 14',
    excerpt: 'Learn how to build modern web applications using Next.js 14 with the new App Router and server components...',
    status: 'published',
    category: 'Technology',
    author: 'John Doe',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    tags: ['nextjs', 'react', 'web'],
    views: 1250,
    comments: 24,
    readTime: '5 min',
    featured: false,
    pinned: false
  },
  {
    id: 2,
    title: 'Mastering Tailwind CSS',
    excerpt: 'Advanced techniques and best practices for using Tailwind CSS in your projects...',
    status: 'published',
    category: 'Web Design',
    author: 'Jane Smith',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14',
    tags: ['tailwind', 'css', 'design'],
    views: 890,
    comments: 18,
    readTime: '8 min',
    featured: false,
    pinned: true
  },
  {
    id: 3,
    title: 'The Future of Web Development',
    excerpt: 'Exploring upcoming trends and technologies in web development...',
    status: 'draft',
    category: 'Technology',
    author: 'Alex Johnson',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13',
    tags: ['future', 'trends', 'ai'],
    views: 0,
    comments: 0,
    readTime: '10 min',
    featured: false,
    pinned: false
  },
  {
    id: 4,
    title: 'Building Accessible Web Applications',
    excerpt: 'A comprehensive guide to creating web applications that are accessible to everyone...',
    status: 'published',
    category: 'Accessibility',
    author: 'Sam Wilson',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
    tags: ['accessibility', 'a11y', 'web'],
    views: 650,
    comments: 12,
    readTime: '12 min',
    featured: false,
    pinned: false
  },
  {
    id: 5,
    title: 'React Hooks Deep Dive',
    excerpt: 'Understanding React Hooks and how to use them effectively in your applications...',
    status: 'published',
    category: 'Technology',
    author: 'John Doe',
    createdAt: '2024-01-11',
    updatedAt: '2024-01-11',
    tags: ['react', 'hooks', 'javascript'],
    views: 2100,
    comments: 42,
    readTime: '15 min',
    featured: false,
    pinned: false
  },
  {
    id: 6,
    title: 'TypeScript for React Developers',
    excerpt: 'Learn how to use TypeScript effectively with React for better type safety...',
    status: 'published',
    category: 'Technology',
    author: 'Jane Smith',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    tags: ['typescript', 'react', 'web'],
    views: 1800,
    comments: 31,
    readTime: '20 min',
    featured: false,
    pinned: false
  },
  {
    id: 7,
    title: 'Building REST APIs with Node.js',
    excerpt: 'A complete guide to building RESTful APIs using Node.js and Express...',
    status: 'draft',
    category: 'Backend',
    author: 'Alex Johnson',
    createdAt: '2024-01-09',
    updatedAt: '2024-01-09',
    tags: ['nodejs', 'api', 'backend'],
    views: 0,
    comments: 0,
    readTime: '25 min',
    featured: false,
    pinned: false
  },
  {
    id: 8,
    title: 'Database Design Best Practices',
    excerpt: 'Learn the best practices for designing scalable and efficient databases...',
    status: 'published',
    category: 'Database',
    author: 'Sam Wilson',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
    tags: ['database', 'sql', 'design'],
    views: 950,
    comments: 15,
    readTime: '18 min',
    featured: false,
    pinned: false
  },
  {
    id: 9,
    title: 'Web Performance Optimization',
    excerpt: 'Techniques and tools to optimize your website for better performance...',
    status: 'published',
    category: 'Performance',
    author: 'John Doe',
    createdAt: '2024-01-07',
    updatedAt: '2024-01-07',
    tags: ['performance', 'web', 'optimization'],
    views: 1100,
    comments: 22,
    readTime: '14 min',
    featured: false,
    pinned: true
  },
  {
    id: 10,
    title: 'Mobile First Design Approach',
    excerpt: 'Learn why mobile-first design is important and how to implement it...',
    status: 'published',
    category: 'Web Design',
    author: 'Jane Smith',
    createdAt: '2024-01-06',
    updatedAt: '2024-01-06',
    tags: ['mobile', 'design', 'responsive'],
    views: 780,
    comments: 19,
    readTime: '9 min',
    featured: false,
    pinned: false
  },
]

const ITEMS_PER_PAGE = 6
const CATEGORIES = ['All', 'Technology', 'Web Design', 'Accessibility', 'Backend', 'Database', 'Performance']
const STATUS_OPTIONS = ['All', 'published', 'draft']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title-asc', label: 'Title (A-Z)' },
  { value: 'title-desc', label: 'Title (Z-A)' },
  { value: 'popular', label: 'Most Popular' },
]

export default function PostsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [showFeatured, setShowFeatured] = useState(false)
  const [showPinned, setShowPinned] = useState(false)

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    let filtered = [...mockPosts]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        post.author.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Status filter
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(post => post.status === selectedStatus)
    }

    // Featured filter
    if (showFeatured) {
      filtered = filtered.filter(post => post.featured)
    }

    // Pinned filter
    if (showPinned) {
      filtered = filtered.filter(post => post.pinned)
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case 'title-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'title-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'popular':
        filtered.sort((a, b) => b.views - a.views)
        break
      default:
        break
    }

    return filtered
  }, [searchQuery, selectedCategory, selectedStatus, sortBy, showFeatured, showPinned])

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedStatus('All')
    setSortBy('newest')
    setShowFeatured(false)
    setShowPinned(false)
    setCurrentPage(1)
  }

  // Calculate stats
  const stats = {
    total: mockPosts.length,
    published: mockPosts.filter(p => p.status === 'published').length,
    draft: mockPosts.filter(p => p.status === 'draft').length,
    featured: mockPosts.filter(p => p.featured).length,
    pinned: mockPosts.filter(p => p.pinned).length,
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Blog Posts</h1>
          <p className="text-gray-600">Manage your blog posts and content</p>
        </div>
        <Link 
          href="/dashboard/admin/blog/add-post" 
          className="bg-[#103B29] hover:bg-[#0c2d20] text-white px-6 py-3 rounded-lg font-medium transition duration-200 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Post
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Posts</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">{stats.published}</div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
          <div className="text-sm text-gray-600">Drafts</div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Filters & Search</h2>
          <button
            onClick={resetFilters}
            className="text-sm text-gray-600 hover:text-[#103B29] flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Posts
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search by title, content, tags..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#103B29] focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#103B29] focus:border-transparent"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#103B29] focus:border-transparent"
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#103B29] focus:border-transparent"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredPosts.length}</span> posts
              {filteredPosts.length !== mockPosts.length && (
                <span className="ml-2">(filtered from {mockPosts.length} total)</span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {paginatedPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 mb-8">
            {paginatedPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-[#103B29] text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
          <button
            onClick={resetFilters}
            className="bg-[#103B29] hover:bg-[#0c2d20] text-white px-6 py-2 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}