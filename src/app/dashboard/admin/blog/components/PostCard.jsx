import Link from 'next/link'
import toast from 'react-hot-toast'

export default function PostCard({ post }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDelete = async () => {

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/${post._id}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )

      const data = await res.json()

      if (data.success) {
        toast.success('Post deleted successfully!')
        window.location.reload()
      } else {
        toast.error(data.message || 'Failed to delete post')
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
      toast.error('An error occurred while deleting the post')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
            <p className="text-sm text-gray-500 mb-2">
              Created: {formatDate(post.createdAt)} | Updated: {formatDate(post.updatedAt)}
            </p>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                post.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </span>
              {post.category && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {post.category}
                </span>
              )}
              {post.tags && post.tags.length > 0 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                  {post.tags.length} tag{post.tags.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Link 
              href={`/pages/blog/${post._id}`} 
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View
            </Link>
            <Link 
              href={`/dashboard/admin/blog/edit/${post._id}`} 
              className="bg-[#004087] hover:bg-[#004087] text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
            <button 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
        <p className="text-gray-600 line-clamp-2 mb-4">{post.excerpt}</p>

        {/* Author info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {post.author?.avatar && (
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                />
              )}
              <div>
                <span className="text-sm font-medium text-gray-700">
                  {post.author?.name || 'Unknown Author'}
                </span>
                {post.author?.email && (
                  <span className="text-xs text-gray-500 block">{post.author.email}</span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-1">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}