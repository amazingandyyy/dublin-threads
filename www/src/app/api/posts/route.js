import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET () {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST (req) {
  try {
    const { content, type, author = 'anonymous', externalLink = null, preview = null, imageUrls = [] } = await req.json()

    console.log('Received request data:', { content, type, author, externalLink, preview, imageUrls })

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    if (type === 'news' && !externalLink) {
      return NextResponse.json({ error: 'Source link is required for news posts' }, { status: 400 })
    }

    if (externalLink && !externalLink.match(/^https?:\/\/.+/)) {
      return NextResponse.json({ error: 'External link must be a valid URL starting with http:// or https://' }, { status: 400 })
    }

    // Prepare data for database insert using snake_case
    const postData = {
      content,
      type, // Keep original type (news/opinion)
      author,
      external_link: externalLink,
      image_urls: Array.isArray(imageUrls) ? imageUrls : imageUrls ? [imageUrls] : [],
      active: true
    }

    console.log('Creating post with data:', JSON.stringify(postData, null, 2))

    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('Created post:', JSON.stringify(data, null, 2))
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

export async function DELETE (req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const body = await req.json()
    const { password } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // Verify admin password
    if (password !== 'yes') {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Instead of deleting, we'll set active to false
    const { error } = await supabase
      .from('posts')
      .update({ active: false })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deactivating post:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
