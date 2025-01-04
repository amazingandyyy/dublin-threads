import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Clean URL by removing query strings
const cleanUrl = (url) => {
  try {
    const urlObj = new URL(url)
    urlObj.search = '' // Remove query parameters
    return urlObj.toString()
  } catch (e) {
    return url
  }
}

export async function POST (req) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const cleanedUrl = cleanUrl(url)

    // Check for existing posts with the same external link
    const { data, error } = await supabase
      .from('posts')
      .select('id, created_at')
      .eq('external_link', cleanedUrl)
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw error
    }

    return NextResponse.json({ isDuplicate: !!data, existingPost: data || null })
  } catch (error) {
    console.error('Error checking duplicate:', error)
    return NextResponse.json({ error: 'Failed to check duplicate' }, { status: 500 })
  }
} 
