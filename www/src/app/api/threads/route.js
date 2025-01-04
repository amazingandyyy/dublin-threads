import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST (req) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { content, type, author = 'anonymous' } = await req.json()

    if (!content || !type) {
      return NextResponse.json(
        { error: 'Content and type are required' },
        { status: 400 }
      )
    }

    if (!['news', 'personal_opinion'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either "news" or "personal_opinion"' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          content,
          type,
          author,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE (req) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
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
