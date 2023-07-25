import Image from './image'

const PostImages = ({ data, original = '', thumbnail = '' }) => {
  return (<div>
    <p>Added a new image to the project!</p>
    <div className='flex mt-2 flex-row overflow-x-scroll'>
      <Image
        width='550px'
        style={{ height: '100%' }}
        original={original || data.val?.original}
        thumbnail={thumbnail || data.val?.thumbnail}
        alt={data.projectId}
      />
    </div>
  </div>)
}

const PostDocs = ({ data, url = '' }) => {
  url = url || data.val.url
  return (<div className='flex flex-col w-full'>
  <p>Just uploaded a new document</p>
  <br />
  <a href={url} target='_blank' className='text-green-800 truncate ...' rel="noreferrer">
    <p className='truncate ...'>📁 {data.val.name || Document}</p>
  </a>
  </div>)
}

function PostCard ({ children }) {
  return (<div className='bg-white md:rounded-lg my-2 self-stretch border-[1.5px] p-4'>{children}</div>)
}

export {
  PostCard,
  PostImages,
  PostDocs
}
