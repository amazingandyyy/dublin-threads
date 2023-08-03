'use client'

import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import { useProjectProfileStore } from '@/stores'
import './style.scss'

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts'

function ProjectStatus () {
  const [statusStats, setStatusStats] = useState([])
  const projectProfiles = useProjectProfileStore(state => state.profiles)
  const COLORS = ['#42e5ba', '#21735e', '#00C49F', '#123826', '#dbe73f']

  useEffect(() => {
    const r = _.chain(projectProfiles)
      .groupBy('status')
      .reduce((r, v, k) => {
        // k = (k === 'undefined') ? 'unkown' : k
        if (k !== 'undefined') {
          r.push({
            name: k, value: v.length
          })
        }
        return r
      }, []).value()
    console.log(r)
    setStatusStats(r)
  }, [projectProfiles])

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (<div className='flex flex-col'>
      <div className='self-start border-2 border-gray-800 text-gray-800 text-sm rounded-full px-3 mb-4'>Project Status</div>
      <ResponsiveContainer width={300} height='90%' className='shrink-0'>
        <PieChart>
          <Pie
            data={statusStats}
            cx={120}
            cy={200}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            nameKey="name"
            labelLine={false}
            label={renderCustomizedLabel}
            dataKey="value"
          >
            {statusStats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}>
              </Cell>
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>)
}

export default function Bento () {
  return (<>
      <div className='flex flex-col md:flex-row'>
        <div className='md:rounded-2xl system-card bg-white flex p-8 flex-col md:m-2 my-1 md:flex-none md:max-w-[300px]'>
          <ProjectStatus />
        </div>
      </div>
    </>)
}
