import {
  AbstractAppEngine,
  AppEngineCallbacks,
  type AppEngineParams,
} from '@/server/ai/lib/AbstractAppEngine'

import { safeReadableStreamPipe } from '@/lib/streamUtils'
import { z } from 'zod'
import { tempAppEngineRunner } from './tempAppEngineRunner'

const payloadSchema = z.object({
  // assistantId: z.string(),
})

type DefaultAppEginePayload = z.infer<typeof payloadSchema>

export class DefaultAppEngine extends AbstractAppEngine {
  getName() {
    return 'default'
  }

  async run(
    ctx: AppEngineParams<DefaultAppEginePayload>,
    callbacks: AppEngineCallbacks,
  ) {
    const { messages, app, chat, appConfigVersion } = ctx

    const response = await tempAppEngineRunner({
      providerSlug: 'openai',
      messages,
      model: 'gpt-3.5-turbo',
      providerKVs: {},
    })

    if (!response.body) {
      throw new Error('Response body is missing in AppEngineResponseStream')
    }

    return safeReadableStreamPipe(response.body, {
      onChunk: async (chunk) => {
        const value = new TextDecoder().decode(chunk)
        console.log('chunk:', value)
        await Promise.resolve(callbacks.onToken(value.trim().slice(3, -1))) // slice(2) to remove the leading '0:"' and the trailing '"' from vercel AI
      },
      onError: async (error) => {
        await Promise.resolve(callbacks.onError(error))
      },
      onEnd: async (fullMessage) => {
        const value = fullMessage.map((chunk) =>
          new TextDecoder().decode(chunk).trim().slice(3, -1),
        )
        await Promise.resolve(callbacks.onEnd(value.join('')))
      },
    })
  }
}
