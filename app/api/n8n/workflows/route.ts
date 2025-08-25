import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// n8n workflow templates based on the blueprint
const WORKFLOW_TEMPLATES = {
  chat: {
    name: 'Chat Agent Template',
    description: 'Basic conversational AI with custom prompts',
    workflow: {
      meta: {
        instanceId: 'n8n-instance'
      },
      nodes: [
        {
          id: 'webhook',
          name: 'Webhook',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [240, 300],
          parameters: {
            httpMethod: 'POST',
            path: 'chat-agent',
            responseMode: 'onReceived'
          }
        },
        {
          id: 'normalize',
          name: 'Normalize Input',
          type: 'n8n-nodes-base.set',
          typeVersion: 1,
          position: [460, 300],
          parameters: {
            values: {
              string: [
                {
                  name: 'user_input',
                  value: '={{$json.body.message || $json.message}}'
                },
                {
                  name: 'user_id',
                  value: '={{$json.body.user_id || $json.headers["x-user-id"]}}'
                }
              ]
            }
          }
        },
        {
          id: 'prompt-builder',
          name: 'Build Prompt',
          type: 'n8n-nodes-base.code',
          typeVersion: 1,
          position: [680, 300],
          parameters: {
            jsCode: `
return [{
  system: "You are a helpful, concise AI assistant. Answer clearly and be helpful.",
  messages: [
    { role: 'system', content: "You are a helpful, concise AI assistant. Answer clearly and be helpful." },
    { role: 'user', content: $input.all()[0].json.user_input }
  ]
}]
            `
          }
        },
        {
          id: 'llm-call',
          name: 'OpenAI Chat',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 3,
          position: [900, 300],
          parameters: {
            url: 'https://api.openai.com/v1/chat/completions',
            method: 'POST',
            headers: {
              'Authorization': 'Bearer {{$credentials.openAiApi.apiKey}}',
              'Content-Type': 'application/json'
            },
            body: {
              model: 'gpt-4o-mini',
              messages: '={{$json.messages}}',
              temperature: 0.2,
              max_tokens: 1000
            }
          }
        },
        {
          id: 'extract-response',
          name: 'Extract Response',
          type: 'n8n-nodes-base.set',
          typeVersion: 1,
          position: [1120, 300],
          parameters: {
            values: {
              string: [
                {
                  name: 'response',
                  value: '={{$json.choices[0].message.content}}'
                }
              ]
            }
          }
        },
        {
          id: 'respond',
          name: 'Respond',
          type: 'n8n-nodes-base.respondToWebhook',
          typeVersion: 1,
          position: [1340, 300],
          parameters: {
            respondWith: 'json',
            responseBody: '={{"reply": $json.response, "status": "success"}}'
          }
        }
      ],
      connections: {
        'Webhook': {
          main: [
            [
              {
                node: 'Normalize Input',
                type: 'main',
                index: 0
              }
            ]
          ]
        },
        'Normalize Input': {
          main: [
            [
              {
                node: 'Build Prompt',
                type: 'main',
                index: 0
              }
            ]
          ]
        },
        'Build Prompt': {
          main: [
            [
              {
                node: 'OpenAI Chat',
                type: 'main',
                index: 0
              }
            ]
          ]
        },
        'OpenAI Chat': {
          main: [
            [
              {
                node: 'Extract Response',
                type: 'main',
                index: 0
              }
            ]
          ]
        },
        'Extract Response': {
          main: [
            [
              {
                node: 'Respond',
                type: 'main',
                index: 0
              }
            ]
          ]
        }
      }
    }
  },
  rag: {
    name: 'RAG Agent Template',
    description: 'Retrieval-augmented generation with vector search',
    workflow: {
      // RAG workflow template would go here
      meta: { instanceId: 'n8n-instance' },
      nodes: [], // Simplified for now
      connections: {}
    }
  },
  tools: {
    name: 'Tool-Using Agent Template',
    description: 'Function-calling agent with external integrations',
    workflow: {
      // Tools workflow template would go here
      meta: { instanceId: 'n8n-instance' },
      nodes: [], // Simplified for now
      connections: {}
    }
  },
  supervisor: {
    name: 'Multi-Agent Supervisor Template',
    description: 'Orchestrates multiple specialist agents',
    workflow: {
      // Supervisor workflow template would go here
      meta: { instanceId: 'n8n-instance' },
      nodes: [], // Simplified for now
      connections: {}
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, user_id, name, description } = await request.json()

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user profile to check permissions
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user_id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user can create this type of agent
    const planLimits: Record<string, string[]> = {
      free: ['chat'],
      pro: ['chat', 'rag'],
      business: ['chat', 'rag', 'tools'],
      enterprise: ['chat', 'rag', 'tools', 'supervisor']
    }

    if (!planLimits[(profile as any).role as string]?.includes(type)) {
      return NextResponse.json(
        { error: 'Plan upgrade required for this agent type' },
        { status: 403 }
      )
    }

    // Get the template
    const template = WORKFLOW_TEMPLATES[type as keyof typeof WORKFLOW_TEMPLATES]
    if (!template) {
      return NextResponse.json(
        { error: 'Invalid workflow type' },
        { status: 400 }
      )
    }

    // Here you would integrate with n8n API to create the actual workflow
    // For now, we'll simulate the creation
    const workflowId = `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const webhookUrl = `${process.env.N8N_WEBHOOK_BASE_URL}/webhook/${workflowId}`

    // Store workflow metadata in your database
    const { data: workflow, error } = await (supabase as any)
      .from('workflows')
      .insert({
        id: workflowId,
        user_id,
        name: name || template.name,
        description: description || template.description,
        type,
        status: 'inactive',
        webhook_url: webhookUrl,
        n8n_workflow_id: workflowId,
        template_used: type,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating workflow record:', error)
      return NextResponse.json(
        { error: 'Failed to create workflow' },
        { status: 500 }
      )
    }

    // Track usage
    await (supabase as any)
      .from('usage_logs')
      .insert({
        user_id,
        action: `workflow_created_${type}`,
        created_at: new Date().toISOString()
      })

    return NextResponse.json({
      id: workflowId,
      name: workflow?.name || template.name,
      description: workflow?.description || template.description,
      type,
      status: 'inactive',
      webhookUrl,
      created_at: new Date().toISOString(),
      execution_count: 0
    })

  } catch (error) {
    console.error('Error creating workflow:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user's workflows
    const { data: workflows, error } = await (supabase as any)
      .from('workflows')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching workflows:', error)
      return NextResponse.json(
        { error: 'Failed to fetch workflows' },
        { status: 500 }
      )
    }

    return NextResponse.json(workflows || [])

  } catch (error) {
    console.error('Error fetching workflows:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
