'use client'
import { timeSince } from '../utils'
import { LinkIcon, ChatBubbleLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function CommunityPost ({ data, onCommentAdded }) {
  const { id, content, postType, author, externalLink, createdAt, imageUrls, preview, comments = [] } = data
  
  // Ensure ID is a number
  const postId = Number(id)
  
  // Debug log to see the full data structure
  console.log('CommunityPost data:', {
    id: postId,
    type: typeof postId,
    commentsCount: comments.length
  })

  const [localComments, setLocalComments] = useState(comments)
  const [isCommenting, setIsCommenting] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [authorName, setAuthorName] = useState('anonymous')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDelete = async (commentId = null) => {
    const password = prompt('Enter admin password:')
    if (!password) return

    try {
      // Ensure we're using numeric IDs
      const targetId = commentId ? Number(commentId) : postId
      
      // Validate ID
      if (isNaN(targetId)) {
        console.error('Invalid ID:', { commentId, postId, targetId })
        throw new Error('Invalid ID')
      }

      const response = await fetch(`/api/posts?id=${targetId}&password=${encodeURIComponent(password)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete post')
      }

      if (commentId) {
        // Remove the comment from local state
        setLocalComments(prev => prev.filter(comment => Number(comment.id) !== targetId))
      } else {
        // Remove the post from view
        const postElement = document.getElementById(`post-${postId}`)
        if (postElement) {
          postElement.style.opacity = '0'
          setTimeout(() => postElement.remove(), 300)
        }
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert(error.message || 'Failed to delete post')
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: commentText,
          type: 'personal_opinion',
          externalLink,
          author: authorName.trim() || 'anonymous'
        })
      })

      if (!response.ok) throw new Error('Failed to post comment')

      const newComment = await response.json()
      // Format the comment to match the expected structure
      const formattedComment = {
        ...newComment,
        timestamp: new Date(newComment.created_at).getTime(),
        type: 'post',
        postType: 'personal_opinion',
        createdAt: newComment.created_at,
        imageUrls: Array.isArray(newComment.image_urls) ? newComment.image_urls : []
      }
      
      setLocalComments(prev => [...prev, formattedComment])
      if (onCommentAdded) {
        onCommentAdded(formattedComment)
      }
      setCommentText('')
      setIsCommenting(false)
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // For news posts, extract title and description from content
  const newsContent = postType === 'news' ? content.split('\n').filter(Boolean) : []
  const newsTitle = newsContent[0]
  const newsDescription = newsContent[1]

  return (
    <div id={`post-${id}`} className='bg-white rounded-none sm:rounded-xl border-y sm:border border-gray-100 hover:border-gray-200 transition-colors duration-200 transition-opacity duration-300'>
      <div className='px-3 sm:px-6 py-4 sm:py-5'>
        {/* Post Header */}
        <div className='flex items-center justify-between gap-2 mb-4'>
          <div className='flex items-center gap-2'>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              postType === 'news' 
                ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-500/20'
                : 'bg-green-50 text-green-600 ring-1 ring-green-500/20'
            }`}>
              {postType === 'news' ? 'News' : 'Opinion'}
            </span>
            <span className='text-sm font-medium text-gray-900'>{author}</span>
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => handleDelete()}
              className='p-0.5 text-gray-200'
              title='Delete post (Admin only)'
            >
              <XMarkIcon className='w-3 h-3' />
            </button>
            <span className='text-xs text-gray-500'>{timeSince(createdAt)} ago</span>
          </div>
        </div>

        {/* Opinion Content - Show before preview */}
        {postType === 'personal_opinion' && !externalLink && (
          <>
            <div className='text-gray-800 whitespace-pre-wrap mb-4 text-[15px] leading-relaxed'>{content}</div>
            {imageUrls?.length > 0 && (
              <div className='flex flex-wrap gap-2 mb-4'>
                {imageUrls.map((url, index) => (
                  <div key={index} className='w-32 h-32 bg-gray-100 relative overflow-hidden rounded-lg ring-1 ring-black/5'>
                    <div className='absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 to-gray-200' />
                    <img
                      src={url}
                      alt={`Image ${index + 1}`}
                      loading="lazy"
                      className='absolute inset-0 w-full h-full object-cover transition-all duration-500 blur-xl hover:blur-none'
                      onLoad={e => e.target.classList.remove('blur-xl')}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Link Preview - for both news and opinion posts */}
        {externalLink && (
          <div className='mb-4'>
            {/* For news posts, use the extracted title/description */}
            {postType === 'news' 
              ? (
                <>
                  {imageUrls?.length > 0 && (
                    <div className='flex flex-col gap-3 mb-4'>
                      {imageUrls.map((url, index) => (
                        <div key={index} className='aspect-video w-full bg-gray-100 relative overflow-hidden rounded-xl ring-1 ring-black/5'>
                          <div className='absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 to-gray-200' />
                          <img
                            src={url}
                            alt={`${newsTitle} - Image ${index + 1}`}
                            loading="lazy"
                            className='absolute inset-0 w-full h-full object-cover transition-all duration-500 blur-xl hover:blur-none'
                            onLoad={e => e.target.classList.remove('blur-xl')}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <h3 className='font-semibold text-gray-900 mb-2 text-lg leading-snug'>{newsTitle}</h3>
                  {newsDescription && (
                    <p className='text-[15px] text-gray-600 mb-3 leading-relaxed'>{newsDescription}</p>
                  )}
                </>
                ) 
              : preview 
                ? (
                  <>
                    {preview.image && (
                      <div className='aspect-video w-full bg-gray-100 relative overflow-hidden rounded-xl ring-1 ring-black/5 mb-3'>
                        <div className='absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 to-gray-200' />
                        <img
                          src={preview.image}
                          alt={preview.title || 'Link preview'}
                          loading="lazy"
                          className='absolute inset-0 w-full h-full object-cover transition-all duration-500 blur-xl hover:blur-none'
                          onLoad={e => e.target.classList.remove('blur-xl')}
                        />
                      </div>
                    )}
                    {preview.title && (
                      <h3 className='font-semibold text-gray-900 mb-2 text-lg leading-snug'>{preview.title}</h3>
                    )}
                    {preview.description && (
                      <p className='text-[15px] text-gray-600 mb-3 leading-relaxed'>{preview.description}</p>
                    )}
                  </>
                  ) 
                : null}

            {/* Source Link */}
            <a 
              href={externalLink}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 group'
            >
              <LinkIcon className='w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
              <span className='underline underline-offset-2'>
                {new URL(externalLink).hostname.replace('www.', '')}
              </span>
            </a>
          </div>
        )}

        {/* News Content - Show content for news posts if no preview */}
        {postType === 'news' && !externalLink && (
          <div className='text-[15px] text-gray-800 whitespace-pre-wrap leading-relaxed'>{content}</div>
        )}

        {/* Comments Section */}
        <div className='mt-6 pt-6 border-t border-gray-100'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2 text-sm font-medium text-gray-500'>
              <ChatBubbleLeftIcon className='w-4 h-4 text-gray-400' />
              {localComments.length} Opinion{localComments.length > 1 ? 's' : ''}
            </div>
            <button
              onClick={() => setIsCommenting(!isCommenting)}
              className='inline-flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium group'
            >
              <ChatBubbleLeftIcon className='w-4 h-4 transition-transform group-hover:-translate-y-0.5' />
              Add opinion
            </button>
          </div>

          {isCommenting && (
            <form onSubmit={handleSubmitComment} className='mb-6'>
              <div className='mb-3'>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value || 'anonymous')}
                  placeholder="Your name (optional)"
                  className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-[15px]'
                  disabled={isSubmitting}
                />
              </div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="What do you think about this? Share your perspective..."
                className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-[15px] leading-relaxed min-h-[100px] resize-none'
                disabled={isSubmitting}
              />
              <div className='flex justify-end gap-2 mt-2'>
                <button
                  type="button"
                  onClick={() => {
                    setIsCommenting(false)
                    setCommentText('')
                    setAuthorName('anonymous')
                  }}
                  className='px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900'
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className='inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
                  disabled={!commentText.trim() || isSubmitting}
                >
                  <ChatBubbleLeftIcon className='w-4 h-4' />
                  {isSubmitting ? 'Sharing...' : 'Share!'}
                </button>
              </div>
            </form>
          )}

          <div className='space-y-4'>
            {localComments
              .sort((a, b) => b.timestamp - a.timestamp)
              .map(comment => (
              <div key={comment.id} className='bg-gray-50 rounded-lg p-4 hover:bg-gray-100/80 transition-colors duration-200'>
                <div className='flex items-center justify-between gap-2 mb-2'>
                  <div className='flex items-center gap-2'>
                    <ChatBubbleLeftIcon className='w-3.5 h-3.5 text-gray-400' />
                    <span className='text-sm font-medium text-gray-900'>{comment.author}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className='p-0.5 text-gray-200'
                      title='Delete opinion (Admin only)'
                    >
                      <XMarkIcon className='w-2.5 h-2.5' />
                    </button>
                    <span className='text-xs text-gray-500'>{timeSince(comment.createdAt)} ago</span>
                  </div>
                </div>
                <div className='text-gray-800 whitespace-pre-wrap text-[15px] leading-relaxed'>{comment.content}</div>
              </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
} 
