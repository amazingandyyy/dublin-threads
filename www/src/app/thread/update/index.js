import Header from '../header'
import Bottom from '../bottom'

function mainEmoji(n) {
  const d = ['📣', '🤩']
  return d[n%d.length+0]
}

function PostBody({data}) {
  if(typeof data.val === 'string') {
    return (
      <p>Change <span>{data.path[1]}</span> from <span className='opacity-50 line-through'>{data.oldVal}</span> to <i>{data.val}</i> in the project details.
      </p>
    )
  }
  return (<p>Updated details</p>)
}

export default function ({ data }) {
  console.log("updates!", data)

  return <div>
    <Header data={data} />
    <PostBody data={data} />
    <Bottom data={data} />
  </div>
}
