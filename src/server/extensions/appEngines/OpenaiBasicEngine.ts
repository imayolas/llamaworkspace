import { env } from '@/env.mjs'
import {
  AbstractAppEngine,
  type AppEngineRuntimeContext,
} from '@/server/ai/lib/BaseEngine'
import { CustomTextStreamResponse } from '@/server/ai/lib/CustomTextStreamResponse'
import { OpenAIStream } from 'ai'
import OpenAI from 'openai'

export class OpenaiBasicEngine extends AbstractAppEngine {
  getName() {
    return 'OpenaiBasicEngine'
  }

  async run(ctx: AppEngineRuntimeContext) {
    const openai = new OpenAI({
      // This needs to be provided at runtime
      apiKey: env.INTERNAL_OPENAI_API_KEY,
    })

    // All This needs to be provided at runtime
    // const aiResponse = await openai.chat.completions.create({
    //   model: 'gpt-3.5-turbo',
    //   messages: [{ role: 'user', content: 'Say "soy paco el engine basico"!' }],
    //   stream: true,
    //   max_tokens: 10,
    // })
    // return OpenAIStream(aiResponse)
    return CustomTextStreamResponse(
      {
        threadId: '123',
        messageId: '123',
      },
      { onToken: () => {}, onFinal: () => {} },
      async ({
        threadId,
        messageId,
        sendMessage,
        sendDataMessage,
        forwardStream,
      }) => {
        const aiResponse = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'user', content: 'Say "soy paco el engine basico"!' },
          ],
          stream: true,
          max_tokens: 10,
        })

        const stream = OpenAIStream(aiResponse)

        const reader = stream.getReader()

        await reader.read().then(({ done, value }) => {
          if (done) {
            // controller.close()
            // void onFinal?.(fullResponse)
            return
          }

          const chunkText = new TextDecoder().decode(value)
          console.log('chunkText', chunkText)
          const parsed = chunkText.split('\n')

          const dataEvents = parsed.filter((line) => line.startsWith('data: '))

          const textArr = dataEvents.flatMap((dataEvent) => {
            const item = dataEvent.replace('data: ', '').replace('\r', '')

            const jsonified = JSON.parse(item) as { text: string }

            return jsonified.text
          })

          // Get the data and send it to the browser via the controller
          const response = textArr.join('')
          // void payload?.onToken?.(response)
          // fullResponse += response
          sendMessage({
            id: messageId,
            role: 'assistant',
            content: { type: 'text', text: { value: parsed } },
          })
        })

        new ReadableStream({
          start(controller) {
            let fullResponse = ''
            function push() {
              return reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close()
                  // void onFinal?.(fullResponse)
                  return
                }

                const chunkText = new TextDecoder().decode(value)
                console.log('chunkText', chunkText)
                const parsed = chunkText.split('\n')

                const dataEvents = parsed.filter((line) =>
                  line.startsWith('data: '),
                )

                const textArr = dataEvents.flatMap((dataEvent) => {
                  const item = dataEvent.replace('data: ', '').replace('\r', '')

                  const jsonified = JSON.parse(item) as { text: string }

                  return jsonified.text
                })

                // Get the data and send it to the browser via the controller
                const response = textArr.join('')
                // void payload?.onToken?.(response)
                fullResponse += response
                controller.enqueue(new TextEncoder().encode(response))
                void push()
              })
            }

            void push()
          },
        })

        for await (const message of aiResponse) {
          console.log('message', message)
          sendMessage({
            id: messageId,
            role: 'assistant',
            content: message,
          })
        }
      },
    )
  }
}
