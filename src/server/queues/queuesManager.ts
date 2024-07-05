import { sendEmailQueue } from '@/server/messaging/queues/sendEmailQueue'
import { bindAssetQueue } from '../assets/queues/bindAssetQueue'

export const queues = [sendEmailQueue, bindAssetQueue]

interface IQueues<PayloadType> {
  enqueue: (action: string, payload: PayloadType) => Promise<void>
  call: (action: string, payload: PayloadType) => Promise<void>
  queueName: string
}

class QueuesManager {
  private readonly queueProvidersMap = new Map<string, IQueues<unknown>>()

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  constructor(queues: IQueues<any>[]) {
    queues.forEach((queue) => this.registerQueue(queue))
  }

  async call<PayloadType>(
    queueName: string,
    action: string,
    payload: PayloadType,
  ) {
    const queue = this.queueProvidersMap.get(queueName)
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`)
    }

    return await queue.call(action, payload)
  }

  private registerQueue(queue: IQueues<unknown>) {
    const name = queue.queueName
    if (this.queueProvidersMap.has(name)) {
      throw new Error(`Queue ${name} already registered`)
    }
    this.queueProvidersMap.set(name, queue)
  }
}

const queuesManager = new QueuesManager(queues)
export { queuesManager }
