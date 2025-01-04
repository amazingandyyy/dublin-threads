'use client'
import { timeSince } from '../utils'
import { LinkIcon } from '@heroicons/react/24/outline'

export default function CommunityPost ({ data }) {
  const { content, postType, author, externalLink, createdAt, imageUrls, preview } = data

  // For news posts, extract title and description from content
  const newsContent = postType === 'news' ? content.split('\n').filter(Boolean) : []
  const newsTitle = newsContent[0]
  const newsDescription = newsContent[1]

  return (
    <div className='bg-white rounded-none sm:rounded-xl border-y sm:border border-gray-100'>
      <div className='px-3 sm:px-4 py-3 sm:py-4'>
        {/* Post Header */}
        <div className='flex items-center justify-between gap-2 mb-3'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-gray-900'>{author}</span>
            <span className='text-xs text-gray-500'>•</span>
            <span className='text-xs text-gray-500'>{timeSince(createdAt)} ago</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className={`text-xs font-medium px-2 py-1 rounded-md ${
              postType === 'news' 
                ? 'bg-blue-50 text-blue-600'
                : 'bg-green-50 text-green-600'
            }`}>
              {postType === 'news' ? 'News' : 'Opinion'}
            </span>
          </div>
        </div>

        {/* Opinion Content - Show before preview */}
        {postType === 'personal_opinion' && (
          <div className='text-gray-800 whitespace-pre-wrap mb-4'>{content}</div>
        )}

        {/* Link Preview - for both news and opinion posts */}
        {externalLink && (
          <div className='mb-4'>
            {/* For news posts, use the extracted title/description */}
            {postType === 'news' ? (
              <>
                {imageUrls?.length > 0 && (
                  <div className='aspect-video w-full bg-gray-100 relative overflow-hidden rounded-lg mb-3'>
                    <img
                      src={imageUrls[0]}
                      alt={newsTitle}
                      className='absolute inset-0 w-full h-full object-cover'
                    />
                  </div>
                )}
                <h3 className='font-medium text-gray-900 mb-2'>{newsTitle}</h3>
                {newsDescription && (
                  <p className='text-sm text-gray-600 mb-2'>{newsDescription}</p>
                )}
              </>
            ) : preview ? (
              // For opinion posts with preview data
              <>
                {preview.image && (
                  <div className='aspect-video w-full bg-gray-100 relative overflow-hidden rounded-lg mb-3'>
                    <img
                      src={preview.image}
                      alt={preview.title || 'Link preview'}
                      className='absolute inset-0 w-full h-full object-cover'
                    />
                  </div>
                )}
                {preview.title && (
                  <h3 className='font-medium text-gray-900 mb-2'>{preview.title}</h3>
                )}
                {preview.description && (
                  <p className='text-sm text-gray-600 mb-2'>{preview.description}</p>
                )}
              </>
            ) : null}

            {/* Source Link */}
            <a 
              href={externalLink}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700'
            >
              <LinkIcon className='w-4 h-4' />
              <span className='underline underline-offset-2'>
                {postType === 'news' ? 'Source' : 'Reference'}
              </span>
            </a>
          </div>
        )}

        {/* News Content - Show content for news posts if no preview */}
        {postType === 'news' && !externalLink && (
          <div className='text-gray-800 whitespace-pre-wrap'>{content}</div>
        )}
      </div>
    </div>
  )
} 
