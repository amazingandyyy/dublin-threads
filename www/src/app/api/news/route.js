import { NextResponse } from 'next/server'

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID

export async function GET (request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const pageSize = searchParams.get('pageSize') || 10

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    // Build search URL with fewer restrictions
    const searchUrl = 'https://customsearch.googleapis.com/customsearch/v1?' +
      `key=${GOOGLE_API_KEY}&` +
      `cx=${GOOGLE_CSE_ID}&` +
      `q=${encodeURIComponent(query)}&` +
      `num=${pageSize}&` +
      'dateRestrict=m12' // Extend to last 12 months

    const response = await fetch(searchUrl)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch news')
    }

    // Transform Google results to match our news format
    const articles = (data.items || []).map(item => ({
      source: {
        name: item.displayLink
      },
      title: item.title,
      description: item.snippet,
      url: item.link,
      urlToImage: item.pagemap?.cse_image?.[0]?.src || item.pagemap?.metatags?.[0]?.['og:image'],
      publishedAt: item.pagemap?.metatags?.[0]?.['article:published_time'] || new Date().toISOString(),
      content: item.snippet,
      relevanceScore: 3 // Default score for matched results
    }))

    return NextResponse.json({
      status: 'ok',
      totalResults: articles.length,
      articles
    })
  } catch (error) {
    console.error('❌ Google Search API Error:', {
      error: error.message,
      stack: error.stack
    })
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    )
  }
} 
