import { useProjectProfileStore } from '../stores'

export default function ({data}) {
  const profiles = useProjectProfileStore(state => state.profiles)
    return (<div className='flex pt-4 text-green-600 text-sm truncate ...'>
    <div className='pr-1'>#{profiles[data.projectId].title.replace(/\s/g, '').replace(/[^a-zA-Z0-9 ]/ig, '')}</div>
    {/* <div className='pr-1'>#{data.projectId}</div> */}
  </div>)
}