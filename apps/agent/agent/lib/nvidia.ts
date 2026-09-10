import "@crm/env/load";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModel } from "ai";

export const NVIDIA = {
	baseURL: "https://integrate.api.nvidia.com/v1",
	model: "nvidia/nemotron-3-super-120b-a12b",
	contextWindowTokens: 131_072,
} as const;

export function nvidiaModel(): LanguageModel | null {
	if (!process.env.NVIDIA_API_KEY) return null;
	return createOpenAICompatible({
		name: "nvidia",
		baseURL: NVIDIA.baseURL,
		apiKey: process.env.NVIDIA_API_KEY,
		includeUsage: true,
		transformRequestBody: (body) => ({
			...body,
			chat_template_kwargs: { enable_thinking: false },
		}),
	}).chatModel(process.env.NVIDIA_MODEL || NVIDIA.model);
}
