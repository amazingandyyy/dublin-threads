import { useArchiveImage } from '@/utils'

const PostImages = ({ data, original = '', thumbnail = '' }) => {
  const src = original || data.val?.original
  return (<div>
    <p>Added a new image to the project!</p>
    <div className='flex mt-2 flex-row overflow-x-hidden'>
      <img
        style={{ height: '100%' }}
        src={useArchiveImage(src)}
        alt={'broken image'}
        onError={(err) => console.log(src, 'image is broken', err)}
      />
    </div>
  </div>)
}

const PostDocs = ({ data, url = '' }) => {
  url = url || data.val.url
  return (<div className='w-full'>
  <p>Just uploaded a new document</p>
  <br />
  <a href={url} target='_blank' className='text-green-800' rel="noreferrer">
    <div className='max-w-xs md:max-w-full inlin-block break-words truncate ... text-ellipsis'>📁 {data.val.name || 'Document'}</div>
  </a>
  </div>)
}

function PostCard ({ children }) {
  return (<div className='bg-white bg-opacity-0 m-2 rounded-2xl my-2 p-6 shadow-box'>{children}</div>)
}

export {
  PostCard,
  PostImages,
  PostDocs
}
