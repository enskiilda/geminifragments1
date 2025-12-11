import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { API_KEYS } from './api-keys'

export type LLMModel = {
  id: string
  name: string
  provider: string
  providerId: string
}

export type LLMModelConfig = {
  model?: string
  apiKey?: string
  baseURL?: string
  temperature?: number
  topP?: number
  topK?: number
  frequencyPenalty?: number
  presencePenalty?: number
  maxTokens?: number
}

export function getModelClient(model: LLMModel, config: LLMModelConfig) {
  const { id: modelNameString, providerId } = model
  const { apiKey, baseURL } = config

  if (providerId !== 'google') {
    throw new Error(`Unsupported provider: ${providerId}`)
  }

  return createGoogleGenerativeAI({ apiKey: apiKey || API_KEYS.GEMINI, baseURL })(modelNameString)
}
