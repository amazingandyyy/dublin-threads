import { ChatBubbleLeftIcon, NewspaperIcon, LinkIcon } from '@heroicons/react/24/outline'
import { timeSince } from '../utils'

export default function CommunityPost ({ post }) {
  const { content, type, author, externalLink, createdAt, imageUrls } = post

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      {/* Post Type Badge */}
      <div className="flex items-center gap-2 mb-3">
        <div 
          className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full
            ${type === 'news'
              ? 'bg-blue-50 text-blue-700'
              : 'bg-green-50 text-green-700'
            }`}
        >
          {type === 'news' 
            ? (
              <>
                <NewspaperIcon className="w-3.5 h-3.5" />
                News
              </>
              ) 
            : (
              <>
                <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                Opinion
              </>
              )}
        </div>
      </div>

      {/* Post Content */}
      <div className="space-y-3">
        {/* Images */}
        {imageUrls?.length > 0 && (
          <div className="aspect-video w-full bg-gray-100 relative overflow-hidden rounded-lg">
            <img 
              src={imageUrls[0]} 
              alt={content}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        {/* Text Content */}
        <div className="text-gray-800">
          {content}
        </div>

        {/* External Link */}
        {externalLink && (
          <a
            href={externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-sm group
              ${type === 'news'
                ? 'text-blue-600 hover:text-blue-700'
                : 'text-green-600 hover:text-green-700'
              }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span className="underline underline-offset-2">
              {type === 'news' ? 'Source' : 'Reference'}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5">
              <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
            </svg>
          </a>
        )}
      </div>

      {/* Post Metadata */}
      <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
        <div>
          Posted by <span className="font-medium text-gray-700">{author}</span>
        </div>
        <div>
          {timeSince(createdAt)}
        </div>
      </div>
    </div>
  )
} 
