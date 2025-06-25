import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OMNIDIMENSION_API_KEY
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  
const { command, conversationHistory = [] } = body

  type ConversationMessage = { type: string; content: string };

  try {
    const messages = [
      ...(conversationHistory as ConversationMessage[]).map((m: ConversationMessage) => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content
      }) as { role: 'user' | 'assistant'; content: string }),
      { role: 'user', content: command } as { role: 'user'; content: string }
    ]

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or 'gpt-3.5-turbo'
      messages,
      temperature: 0.7
    })

    const reply = chatCompletion.choices[0].message.content

    return NextResponse.json({
      message: reply,
      metadata: { source: 'openai' }
    })
  } catch (err: any) {
    console.error("AI Route Error:", err)
    return NextResponse.json({
      message: "Failed to get response from AI.",
      metadata: { error: true }
    }, { status: 500 })
  }
}
