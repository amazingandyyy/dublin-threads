import Header from '../header'
import Bottom from '../bottom'
import {PostImages, PostDocs} from '../templates'

function mainEmoji(n) {
  const d = ['📣', '🤩']
  return d[n%d.length+0]
}

function PostBody({data}) {
  if(typeof data.val === 'string') {
    switch (data.path[0]) {
      case 'details':
        switch (data.path[1]) {
          case 'Project Planner':
            return (<p>Updated <span>{data.path[1]} {data.path[2]}</span> from <span className='opacity-50 line-through'>{data.oldVal}</span> to <i>{data.val}</i>.</p>)
          default:
            return (<p>Updated <span>{data.path[1]}</span> from <span className='opacity-50 line-through'>{data.oldVal}</span> to <i>{data.val}</i>.</p>)
        }
      case 'title':
        return (<p>Changed <span>{data.path[1]}</span> from <span className='opacity-50 line-through'>{data.oldVal}</span> to <i>{data.val}</i>.</p>)
      case 'status':
          return (<p>Moved <span>{data.path[1]}</span> from <span className='opacity-50 line-through'>{data.oldVal}</span> to <i>{data.val}</i>.</p>)
      case 'images':
        if(data.path[2] === 'original') {
          return (<div>
            <PostImages data={data} original={data.val} />
          </div>)
        }else{
          return <>goooood</>
        }
      // case 'geolocation':
      //   return (<p>Changed <span>location</span> from <span className='opacity-50 line-through'>{data.oldVal}</span> to <i>{data.val}</i>.</p>)
      case 'description':
        return (<p>{data.val}</p>)
      case 'docs':
        return (<PostDocs data={data} url={data.val} />)
      default:
        return (<p>Updated <span>{data.path[0]}</span> from <span className='opacity-50 line-through'>{data.oldVal}</span> to <i>{data.val}</i>.</p>)
    }
  }
  return (<p>Updated something</p>)
}

export default function ({ data }) {
  // console.log("updates!", data)

  if (data.path[0] !== 'location' || data.path[0] !== 'geolocation' || data.path[2] === 'thumbnail') {
    return <div>
      <Header data={data} />
      <PostBody data={data} />
      <Bottom data={data} />
    </div>
  }
  return <></>
}
