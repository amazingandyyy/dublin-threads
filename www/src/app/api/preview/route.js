import { NextResponse } from 'next/server'
import { parse } from 'node-html-parser'

export async function POST (req) {
  try {
    const { url } = await req.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Fetch the webpage
    const response = await fetch(url)
    const html = await response.text()
    const root = parse(html)

    // Extract metadata
    const preview = {
      title: root.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
             root.querySelector('title')?.text || '',
      description: root.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                  root.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      image: root.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
             root.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || ''
    }

    return NextResponse.json(preview)
  } catch (error) {
    console.error('Error fetching preview:', error)
    return NextResponse.json({ error: 'Failed to fetch preview' }, { status: 500 })
  }
} 
