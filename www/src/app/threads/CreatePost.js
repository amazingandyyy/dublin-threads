'use client'
import { useState } from 'react'
import { ChatBubbleLeftIcon, NewspaperIcon, LinkIcon } from '@heroicons/react/24/outline'

export default function CreatePost ({ onPostCreated }) {
  const [content, setContent] = useState('')
  const [type, setType] = useState('personal_opinion')
  const [author, setAuthor] = useState('anonymous')
  const [externalLink, setExternalLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          type,
          author,
          externalLink: externalLink || null
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create post')
      }

      const newPost = await response.json()
      onPostCreated?.(newPost)

      // Clear form after successful submission
      setContent('')
      setType('personal_opinion')
      setAuthor('anonymous')
      setExternalLink('')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <form onSubmit={handleSubmit}>
        {/* Post Type Selector */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setType('personal_opinion')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${type === 'personal_opinion'
                ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
          >
            <ChatBubbleLeftIcon className="w-4 h-4" />
            Opinion
          </button>
          <button
            type="button"
            onClick={() => setType('news')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${type === 'news'
                ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
          >
            <NewspaperIcon className="w-4 h-4" />
            News
          </button>
        </div>

        {/* Content Input */}
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
            rows="4"
            placeholder={type === 'news' ? 'Share news about Dublin...' : 'Share your thoughts about Dublin...'}
            required
          />
        </div>

        {/* External Link Input - For both types */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
            <LinkIcon className="w-3.5 h-3.5" />
            {type === 'news' ? 'Source Link' : 'Reference Link'}
            {type === 'news' && <span className="text-red-500">*</span>}
          </div>
          <input
            type="url"
            value={externalLink}
            onChange={(e) => setExternalLink(e.target.value)}
            className={`w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 transition-all duration-200
              ${error && type === 'news' && !externalLink
                ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                : type === 'news'
                  ? 'border-gray-200 focus:ring-blue-500/20 focus:border-blue-500'
                  : 'border-gray-200 focus:ring-green-500/20 focus:border-green-500'
              }`}
            placeholder="https://..."
            pattern="https?://.*"
            required={type === 'news'}
          />
        </div>

        {/* Author Input */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1.5">
              Posted by
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
              placeholder="Your name"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !content || (type === 'news' && !externalLink)}
            className={`px-6 py-1.5 rounded-md text-sm font-medium transition-all duration-200
              ${isSubmitting || !content || (type === 'news' && !externalLink)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : type === 'news'
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow'
              }`}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>

        {error && (
          <div className="mt-3 text-sm text-red-600 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
      </form>
    </div>
  )
} 
