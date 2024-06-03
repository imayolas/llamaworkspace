import type { PrismaClientOrTrxClient } from '@/shared/globalTypes'
import { StreamingTextResponse } from 'ai'
import { BaseAppEngine } from './BaseEngine'

export class AppEngineRunner {
  constructor(
    private readonly prisma: PrismaClientOrTrxClient,
    private readonly engines: BaseAppEngine[],
  ) {}

  async call(chatId: string) {
    let engineName = await this.getEngineNameFromChatId(chatId)
    engineName = 'OpenaiAssistantsEngine'

    if (!engineName) {
      throw new Error('EngineName not found')
    }

    const engine = this.getEngineByName(engineName)

    const stream = await engine.run()
    const headers = {
      'Content-Type': 'text/event-stream',
    }

    return new StreamingTextResponse(stream, { headers })
  }

  private getEngineByName(name: string) {
    const engine = this.engines.find((engine) => engine.getName() === name)
    if (!engine) {
      throw new Error(`Engine ${name} not found`)
    }
    return engine
  }

  private async getEngineNameFromChatId(chatId: string) {
    const chat = await this.prisma.chat.findUniqueOrThrow({
      where: {
        id: chatId,
      },
      include: {
        app: true,
      },
    })

    return chat.app.gptEngine
  }
}
