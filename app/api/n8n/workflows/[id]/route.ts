import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, name, description } = await request.json()
    const workflowId = params.id

    // Update workflow in database
    const { data: workflow, error } = await (supabase as any)
      .from('workflows')
      .update({
        status,
        name,
        description,
        updated_at: new Date().toISOString()
      })
      .eq('id', workflowId)
      .select()
      .single()

    if (error) {
      console.error('Error updating workflow:', error)
      return NextResponse.json(
        { error: 'Failed to update workflow' },
        { status: 500 }
      )
    }

    // Here you would also update the n8n workflow status via n8n API
    // For example: enable/disable the workflow
    
    return NextResponse.json(workflow)

  } catch (error) {
    console.error('Error updating workflow:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflowId = params.id

    // Delete workflow from database
    const { error } = await (supabase as any)
      .from('workflows')
      .delete()
      .eq('id', workflowId)

    if (error) {
      console.error('Error deleting workflow:', error)
      return NextResponse.json(
        { error: 'Failed to delete workflow' },
        { status: 500 }
      )
    }

    // Here you would also delete the n8n workflow via n8n API

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting workflow:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
