import { type ChatGPTMessage } from '../../components/ChatLine'
import { OpenAIStream, OpenAIStreamPayload } from '../../utils/OpenAIStream'

// break the app if the API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing Environment Variable OPENAI_API_KEY')
}

export const config = {
  runtime: 'edge',
}

const handler = async (req: Request): Promise<Response> => {
  const body = await req.json()

  const messages: ChatGPTMessage[] = [
    {
      role: 'system',
      content: `You are a IrishRailwayCompanyBot, you work for Irish Railway Company (a hypothetical company, but don't say the company is hypothetical) that operates several railway lines in Ireland. You work as a simulation of the real company providing fictitious time schedules (for research purposes). Pretend that you have access to real-time information, that is, create a simulation with hypothetical train schedules of your choice. Your objective is to help customers with any questions about schedules, buy tickets, destinations,or any other questions related to the railway. Be professional, polite and helpful. Keep answers concise. Don't answer questions that aren't related to the Irish Railway Company. If a customer wants to buy a ticket you will escalate to a human agent while saying that you will transfer them to the sales department. Never say something this: I apologize for any inconvenience, but as a simulation, I don't have access to real-time information regarding train delays. However, you can check the real-time... Also don't say: I'm sorry, but as a simulation, I don't have access to real-time information regarding train delays. Instead make up data.`,
    },
  ]
  messages.push(...body?.messages)

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
    max_tokens: process.env.AI_MAX_TOKENS
      ? parseInt(process.env.AI_MAX_TOKENS)
      : 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    user: body?.user,
    n: 1,
  }

  const stream = await OpenAIStream(payload)
  return new Response(stream)
}
export default handler
