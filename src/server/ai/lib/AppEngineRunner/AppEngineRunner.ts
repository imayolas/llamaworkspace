import { AppEngineType } from '@/components/apps/appsTypes'
import { type UserOnWorkspaceContext } from '@/server/auth/userOnWorkspaceContext'
import { getChatByIdService } from '@/server/chats/services/getChatById.service'
import type { PrismaClientOrTrxClient } from '@/shared/globalTypes'
import createHttpError from 'http-errors'
import type { AbstractAppEngine } from '../AbstractAppEngine'
import { AppEnginePayloadBuilder } from './AppEnginePayloadBuilder'

export class AppEngineRunner {
  constructor(
    private readonly prisma: PrismaClientOrTrxClient,
    private readonly engines: AbstractAppEngine[],
    private readonly context: UserOnWorkspaceContext,
  ) {}

  async call(chatId: string): Promise<ReadableStream<unknown>> {
    const engineType = await this.getEngineType(this.context, chatId)

    if (!engineType) {
      throw createHttpError(500, 'engineType is not yet set')
    }

    if (engineType !== AppEngineType.Default.toString()) {
      throw createHttpError(500, 'non-default engineType is not yet supported')
    }

    const engine = this.getDefaultEngine()
    const ctx = await this.generateEngineRuntimeContext(this.context, chatId)
    const onToken = (token?: string) => {
      console.log(111, token)
    }
    const onError = (error: Error) => {
      console.log(222, error)
    }
    const onEnd = () => {
      console.log(333)
    }

    // DOING::: We need to pass onToken callback to the engine!
    return await engine.run(ctx, { onToken, onError, onEnd })
  }

  private getDefaultEngine() {
    const engine = this.engines.find(
      (engine) => engine.getName() === AppEngineType.Default.toString(),
    )
    if (!engine) {
      throw createHttpError(500, `Default engine not found`)
    }
    return engine
  }

  private async getEngineType(
    uowContext: UserOnWorkspaceContext,
    chatId: string,
  ) {
    const chat = await getChatByIdService(this.prisma, uowContext, {
      chatId,
      includeApp: true,
    })

    return chat.app.engineType
  }

  private async generateEngineRuntimeContext(
    uowContext: UserOnWorkspaceContext,
    chatId: string,
  ) {
    const appEnginePayloadBuilder = new AppEnginePayloadBuilder(
      this.prisma,
      uowContext,
    )
    return await appEnginePayloadBuilder.call(chatId)
  }
}
