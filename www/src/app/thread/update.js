export default function ({data}) {
  console.log('update', data)
  return <div>
    {data.op}
  </div>
}
