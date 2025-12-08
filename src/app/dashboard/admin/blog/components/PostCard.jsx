import Link from 'next/link'

export default function PostCard({ post }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
            <p className="text-sm text-gray-500 mb-2">Created: {post.createdAt} | Updated: {post.updatedAt}</p>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </span>
              {post.category && (
                <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
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
              href={`/pages/blog/${post.id}`} 
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View
            </Link>
            <Link 
              href={`/dashboard/admin/blog/edit/${post.id}`} 
              className="bg-[#103B29] hover:bg-[#103B29] text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
        <p className="text-gray-600 line-clamp-2 mb-4">{post.excerpt}</p>
        
        {/* Stats row */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          {post.views !== undefined && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {post.views} views
            </div>
          )}
          {post.comments !== undefined && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {post.comments} comments
            </div>
          )}
          {post.readTime && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.readTime} min read
            </div>
          )}
        </div>

        {/* Author and date info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {post.authorAvatar && (
                <img 
                  src={post.authorAvatar} 
                  alt={post.author} 
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <div>
                <span className="text-sm font-medium text-gray-700">{post.author}</span>
                <span className="text-xs text-gray-500 block">{post.createdAt}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              {post.featured && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                  Featured
                </span>
              )}
              {post.pinned && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                  Pinned
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}