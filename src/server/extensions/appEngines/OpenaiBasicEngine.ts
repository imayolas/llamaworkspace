import { env } from '@/env.mjs'
import {
  AbstractAppEngine,
  type AppEngineRuntimeContext,
} from '@/server/ai/lib/BaseEngine'
import { CustomTextStreamResponse } from '@/server/ai/lib/CustomTextStreamResponse'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export class OpenaiBasicEngine extends AbstractAppEngine {
  getName() {
    return 'OpenaiBasicEngine'
  }

  async run(ctx: AppEngineRuntimeContext) {
    const openai = new OpenAI({
      apiKey: env.INTERNAL_OPENAI_API_KEY,
    })

    const stream = CustomTextStreamResponse(
      {
        threadId: '123',
        messageId: '123',
      },
      { onToken: () => {}, onFinal: () => {} },
      async ({
        threadId,
        messageId,
        sendMessage,
        sendTextMessage,
        sendDataMessage,
        forwardStream,
      }) => {
        const aiResponse = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Say "yo yo yo soy Juaaaan"!' }],
          stream: true,
          max_tokens: 10,
        })

        for await (const message of aiResponse) {
          const text = message.choices[0]?.delta.content
          if (text) {
            sendTextMessage(text)
          }
        }
      },
    )
    const headers = {
      'Content-Type': 'text/plain; charset=utf-8',
    }
    return new NextResponse(stream, { headers })
  }
}
