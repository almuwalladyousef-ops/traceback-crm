import { DEFAULT_AGENT_MODEL } from "@crm/db/settings";
import { defineAgent, defineDynamic } from "eve";
import { z } from "zod";
import { selectedModel } from "../../lib/model";
import { NVIDIA, nvidiaModel } from "../../lib/nvidia";

export default defineAgent({
	description:
		"Turn one private CRM builder-chat request into a validated, reviewable team-agent version without deploying it.",
	model: defineDynamic({
		fallback: nvidiaModel() ?? DEFAULT_AGENT_MODEL.id,
		events: {
			"session.started": () => (nvidiaModel() ? null : selectedModel()),
		},
	}),
	outputSchema: z.object({
		status: z.literal("draft_ready"),
		summary: z.string().min(1).max(1000),
		agentId: z.string().min(1),
		versionId: z.string().min(1),
	}),
	modelContextWindowTokens: nvidiaModel()
		? NVIDIA.contextWindowTokens
		: DEFAULT_AGENT_MODEL.contextWindowTokens,
	limits: {
		maxInputTokensPerSession: 100_000,
		maxOutputTokensPerSession: 10_000,
		sessionTimeoutMs: 24 * 60 * 60 * 1000,
	},
});
