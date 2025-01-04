'use client'
import { timeSince } from '../utils'
import { LinkIcon } from '@heroicons/react/24/outline'

export default function CommunityPost ({ data }) {
  const { content, postType, author, externalLink, createdAt, imageUrls, preview, comments = [] } = data

  // For news posts, extract title and description from content
  const newsContent = postType === 'news' ? content.split('\n').filter(Boolean) : []
  const newsTitle = newsContent[0]
  const newsDescription = newsContent[1]

  return (
    <div className='bg-white rounded-none sm:rounded-xl border-y sm:border border-gray-100 hover:border-gray-200 transition-colors duration-200'>
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
        {comments?.length > 0 && (
          <div className='mt-6 pt-6 border-t border-gray-100'>
            <div className='text-sm font-medium text-gray-500 mb-4'>
              {comments.length} Opinion{comments.length > 1 ? 's' : ''}
            </div>
            <div className='space-y-4'>
              {comments.map(comment => (
                <div key={comment.id} className='bg-gray-50 rounded-lg p-4'>
                  <div className='flex items-center justify-between gap-2 mb-2'>
                    <span className='text-sm font-medium text-gray-900'>{comment.author}</span>
                    <span className='text-xs text-gray-500'>{timeSince(comment.createdAt)} ago</span>
                  </div>
                  <div className='text-gray-800 whitespace-pre-wrap text-[15px] leading-relaxed'>{comment.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
