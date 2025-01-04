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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Post Type Selector */}
      <div className="flex gap-3 p-1.5">
        <button
          type="button"
          onClick={() => setType('personal_opinion')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden
            ${type === 'personal_opinion'
              ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 text-green-600 shadow-md shadow-green-100'
              : 'bg-gray-50 text-gray-500 hover:text-green-600 hover:shadow-sm hover:bg-gradient-to-br hover:from-green-50/50 hover:to-emerald-50/50'
            }`}
        >
          <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_10%,_transparent_70%)] from-green-100/80 opacity-0 transition-opacity duration-300 ${type === 'personal_opinion' ? 'opacity-100' : 'group-hover:opacity-60'}`} />
          <ChatBubbleLeftIcon className={`w-4 h-4 transition-all duration-300 ${type === 'personal_opinion' ? 'scale-110 text-green-500' : 'group-hover:scale-110'}`} />
          <span className="relative">Opinion</span>
        </button>
        <button
          type="button"
          onClick={() => setType('news')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden
            ${type === 'news'
              ? 'bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 text-blue-600 shadow-md shadow-blue-100'
              : 'bg-gray-50 text-gray-500 hover:text-blue-600 hover:shadow-sm hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-sky-50/50'
            }`}
        >
          <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_10%,_transparent_70%)] from-blue-100/80 opacity-0 transition-opacity duration-300 ${type === 'news' ? 'opacity-100' : 'group-hover:opacity-60'}`} />
          <NewspaperIcon className={`w-4 h-4 transition-all duration-300 ${type === 'news' ? 'scale-110 text-blue-500' : 'group-hover:scale-110'}`} />
          <span className="relative">News</span>
        </button>
      </div>

      {/* Content Input */}
      <div className="relative group">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-[3px] focus:ring-green-500/10 focus:border-green-500/50 transition-all duration-300 min-h-[120px] resize-none bg-white/50 backdrop-blur-sm shadow-sm"
          placeholder={type === 'news' ? 'Share news about Dublin...' : 'Share your thoughts about Dublin...'}
          required
        />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-green-500/3 to-blue-500/3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
      </div>

      {/* External Link Input */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 ml-1">
          <LinkIcon className="w-3.5 h-3.5" />
          {type === 'news' ? 'Source Link' : 'Reference Link (optional)'}
          {type === 'news' && <span className="text-red-500">*</span>}
        </div>
        <div className="relative group">
          <input
            type="url"
            value={externalLink}
            onChange={(e) => setExternalLink(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-[3px] transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm
              ${error && type === 'news' && !externalLink
                ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500/50'
                : type === 'news'
                  ? 'border-gray-200 focus:ring-blue-500/10 focus:border-blue-500/50'
                  : 'border-gray-200 focus:ring-green-500/10 focus:border-green-500/50'
              }`}
            placeholder="https://..."
            pattern="https?://.*"
            required={type === 'news'}
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-green-500/3 to-blue-500/3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
        </div>
      </div>

      {/* Author Input and Submit Button */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-2 ml-1">
            Posted by
          </label>
          <div className="relative group">
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-[3px] focus:ring-green-500/10 focus:border-green-500/50 transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm"
              placeholder="Your name"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-green-500/3 to-blue-500/3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !content || (type === 'news' && !externalLink)}
          className={`px-8 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
            ${isSubmitting || !content || (type === 'news' && !externalLink)
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : type === 'news'
                ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/25'
                : 'bg-gradient-to-r from-green-500 via-green-600 to-green-500 text-white hover:shadow-lg hover:shadow-green-500/25'
            }`}
        >
          {isSubmitting ? 'Sharing...' : 'Share!'}
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-600 flex items-center gap-2 bg-red-50/80 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-red-100">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </form>
  )
} 
