'use client'
import { useState, useEffect } from 'react'
import { ChatBubbleLeftIcon, NewspaperIcon, LinkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { timeSince } from '../utils'

export default function CreatePost ({ onPostCreated }) {
  const [content, setContent] = useState('')
  const [type, setType] = useState('news')
  const [author, setAuthor] = useState('anonymous')
  const [externalLink, setExternalLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [duplicatePost, setDuplicatePost] = useState(null)
  const [manualImageUrl, setManualImageUrl] = useState('')

  // Clean URL by removing query strings
  const cleanUrl = (url) => {
    try {
      const urlObj = new URL(url)
      urlObj.search = '' // Remove query parameters
      return urlObj.toString()
    } catch (e) {
      return url
    }
  }

  // Fetch preview and check duplicates when URL changes
  useEffect(() => {
    const fetchPreviewAndCheck = async () => {
      if (!externalLink || !externalLink.match(/^https?:\/\/.+/)) {
        setDuplicatePost(null)
        return
      }
      
      setIsLoadingPreview(true)
      setError(null)
      try {
        const cleanedUrl = cleanUrl(externalLink)

        // Check for duplicates first
        if (type === 'news') {
          const dupResponse = await fetch('/api/posts/check-duplicate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: cleanedUrl })
          })
          
          if (!dupResponse.ok) throw new Error('Failed to check for duplicates')
          
          const dupData = await dupResponse.json()
          if (dupData.isDuplicate) {
            setDuplicatePost(dupData.existingPost)
            setError(`Thanks for sharing! But looks like someone already shared this article ${timeSince(dupData.existingPost.created_at)}`)
            setIsLoadingPreview(false)
            return
          } else {
            setDuplicatePost(null)
          }
        }

        // Fetch preview if no duplicates
        const response = await fetch('/api/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: cleanedUrl })
        })
        
        if (!response.ok) throw new Error('Failed to fetch preview')
        
        const data = await response.json()
        setPreview(data)
        if (type === 'news') {
          // Combine title and description for news posts
          const newsContent = [
            data.title || '',
            '', // Empty line between title and description
            data.description || ''
          ].filter(Boolean).join('\n')
          setContent(newsContent)
        }
      } catch (err) {
        console.error('Error:', err)
        setPreview(null)
        if (!error) setError(err.message)
      } finally {
        setIsLoadingPreview(false)
      }
    }

    const debounceTimer = setTimeout(fetchPreviewAndCheck, 500)
    return () => clearTimeout(debounceTimer)
  }, [externalLink, type])

  // Handle type switching
  const handleTypeSwitch = (newType) => {
    setType(newType)
    setError(null)
    setDuplicatePost(null)
    if (newType === 'news') {
      setContent('')
      setExternalLink('')
      setPreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (type === 'news' && duplicatePost) {
      setError('This news has already been shared')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const cleanedUrl = cleanUrl(externalLink)
      const imageUrls = preview?.image ? [preview.image] : manualImageUrl ? [manualImageUrl] : []
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          type,
          author,
          externalLink: cleanedUrl || null,
          preview: preview || null,
          imageUrls
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
      setType('news')
      setAuthor('anonymous')
      setExternalLink('')
      setPreview(null)
      setDuplicatePost(null)
      setManualImageUrl('')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Post Type Selector */}
      <div className="flex gap-3 p-1.5 hidden">
        <button
          type="button"
          onClick={() => handleTypeSwitch('personal_opinion')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden
            ${
              type === 'personal_opinion'
                ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 text-green-600 shadow-md shadow-green-100'
                : 'bg-gray-50 text-gray-500 hover:text-green-600 hover:shadow-sm hover:bg-gradient-to-br hover:from-green-50/50 hover:to-emerald-50/50'
            }`}
        >
          <div
            className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_10%,_transparent_70%)] from-green-100/80 opacity-0 transition-opacity duration-300 ${
              type === 'personal_opinion'
                ? 'opacity-100'
                : 'group-hover:opacity-60'
            }`}
          />
          <ChatBubbleLeftIcon
            className={`w-4 h-4 transition-all duration-300 ${
              type === 'personal_opinion'
                ? 'scale-110 text-green-500'
                : 'group-hover:scale-110'
            }`}
          />
          <span className="relative">Opinion</span>
        </button>
        <button
          type="button"
          onClick={() => handleTypeSwitch('news')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden
            ${
              type === 'news'
                ? 'bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 text-blue-600 shadow-md shadow-blue-100'
                : 'bg-gray-50 text-gray-500 hover:text-blue-600 hover:shadow-sm hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-sky-50/50'
            }`}
        >
          <div
            className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_10%,_transparent_70%)] from-blue-100/80 opacity-0 transition-opacity duration-300 ${
              type === 'news' ? 'opacity-100' : 'group-hover:opacity-60'
            }`}
          />
          <NewspaperIcon
            className={`w-4 h-4 transition-all duration-300 ${
              type === 'news'
                ? 'scale-110 text-blue-500'
                : 'group-hover:scale-110'
            }`}
          />
          <span className="relative">News/Link</span>
        </button>
      </div>

      {/* Content Input - Only show for personal opinion */}
      {type === 'personal_opinion' && (
        <div className="relative group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-[3px] focus:ring-green-500/10 focus:border-green-500/50 transition-all duration-300 min-h-[120px] resize-none bg-white/50 backdrop-blur-sm shadow-sm"
            placeholder="Share your thoughts..."
            required
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-green-500/3 to-blue-500/3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
        </div>
      )}

      {/* External Link Input */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 ml-1">
          <LinkIcon className="w-3.5 h-3.5" />
          {type === 'news' ? 'News/Article URL' : 'Reference Link (optional)'}
          {type === 'news' && <span className="text-red-500">*</span>}
        </div>
        <div className="relative group">
          <input
            type="url"
            value={externalLink}
            onChange={(e) => setExternalLink(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-[3px] transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm
              ${
                error && type === 'news' && (!externalLink || duplicatePost)
                  ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500/50'
                  : type === 'news'
                  ? 'border-gray-200 focus:ring-blue-500/10 focus:border-blue-500/50'
                  : 'border-gray-200 focus:ring-green-500/10 focus:border-green-500/50'
              }`}
            placeholder="https://..."
            pattern="https?://.*"
            required={type === 'news'}
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/3 to-blue-600/3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
        </div>

        {/* URL Preview */}
        {isLoadingPreview && (
          <div className="mt-3 animate-pulse flex items-center gap-2 text-sm text-gray-400">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading preview...
          </div>
        )}

        {preview && !isLoadingPreview && !duplicatePost && (
          <div className="mt-3 rounded-lg border border-gray-200 overflow-hidden bg-white/50 backdrop-blur-sm">
            {(preview.image || manualImageUrl) && (
              <div className="aspect-video w-full bg-gray-100 relative overflow-hidden">
                <img
                  src={preview.image || manualImageUrl}
                  alt={preview.title || 'Article preview'}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '';
                    if (manualImageUrl) {
                      setError('Invalid image URL. Please check the URL and try again.');
                      setManualImageUrl('');
                    }
                  }}
                />
              </div>
            )}
            <div className="p-3">
              <h3 className="font-medium text-gray-900 line-clamp-2">
                {preview.title}
              </h3>
              {preview.description && (
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {preview.description}
                </p>
              )}
              <div className="mt-2 text-xs text-gray-400 truncate">
                {externalLink && (() => {
                  try {
                    return new URL(externalLink).hostname
                  } catch (e) {
                    return 'Invalid URL'
                  }
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Manual Image URL Input - Show when preview exists but has no image */}
        {preview && !preview.image && !isLoadingPreview && !duplicatePost && (
          <div className="mt-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 ml-1">
              <LinkIcon className="w-3.5 h-3.5" />
              Add Image URL (optional)
            </div>
            <div className="relative group">
              <input
                type="url"
                value={manualImageUrl}
                onChange={(e) => setManualImageUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-[3px] focus:ring-blue-500/10 focus:border-blue-500/50 transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm"
                placeholder="https://... (image URL)"
                pattern="https?://.*"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/3 to-blue-600/3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
            </div>
          </div>
        )}
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
              className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-[3px] focus:ring-green-500/10 focus:border-green-500/50 transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm"
              placeholder="Your name"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-green-500/3 to-blue-500/3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
          </div>
        </div>

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !content ||
            (type === 'news' && (!externalLink || duplicatePost))
          }
          className={`px-8 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
            ${
              isSubmitting ||
              !content ||
              (type === 'news' && (!externalLink || duplicatePost))
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
        <div className="text-sm text-amber-600 flex items-start gap-2 bg-amber-50/80 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-amber-100">
          <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </form>
  )
} 
