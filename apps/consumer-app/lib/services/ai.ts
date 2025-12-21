import OpenAI from "openai";
import { removeBasicPII, sanitiseAnalysedJD } from "../utils/remove-basic-pii";

export type AnalysedJD = {
  hardSkills: string[];
  softSkills: string[];
  resumeImprovements: string[];
  coverLetterSnippet: string;
};

export async function analyseJD(jobDescription: string): Promise<AnalysedJD> {
  const isDev = process.env.NODE_ENV !== "production";
  const devProvider = (process.env.DEV_AI_PROVIDER || "ollama").toLowerCase();
  const clientConfig: { baseURL?: string; apiKey?: string } = {
    apiKey: isDev
      ? devProvider === "openai"
        ? process.env.OPENAI_API_KEY
        : "ollama"
      : process.env.OPENAI_API_KEY,
  };

  if (isDev && devProvider !== "openai") {
    clientConfig.baseURL = process.env.OLLAMA_BASE_URL;
  }

  const client = new OpenAI(clientConfig);
  const aiModel: string = getAiModel(isDev, devProvider);

  // sanitise the incoming job description to remove any PII before sending to OpenAI
  const sanitisedJD = removeBasicPII(jobDescription);
  const systemPrompt = `
You are an AI that analyses job descriptions ONLY.
You must NOT output any personal data or sensitive information.
If the input contains names, emails, phone numbers, addresses, companies, or any identifiable information, REMOVE or generalize it.
Never reproduce the raw text of the input.
Always return anonymized, non-identifying results.
`;

  const userPrompt = `
Extract the hard skills, soft skills, resume improvements, 
and a 3–4 sentence cover letter snippet from the following job description:

${sanitisedJD}
`;

  try {
    const res = await client.chat.completions.create({
      model: aiModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "job_extraction",
          strict: true,
          schema: {
            type: "object",
            properties: {
              hardSkills: {
                type: "array",
                items: { type: "string" },
              },
              softSkills: {
                type: "array",
                items: { type: "string" },
              },
              resumeImprovements: {
                type: "array",
                items: { type: "string" },
                minItems: 3,
                maxItems: 5,
              },
              coverLetterSnippet: {
                type: "string",
              },
            },
            required: [
              "hardSkills",
              "softSkills",
              "resumeImprovements",
              "coverLetterSnippet",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    const content = res.choices?.[0]?.message?.content ?? "";
    if (!content.trim()) {
      return {
        hardSkills: [],
        softSkills: [],
        resumeImprovements: [],
        coverLetterSnippet: "",
      };
    }
    const parsed = JSON.parse(content);
    return sanitiseAnalysedJD(parsed);
  } catch (_error) {
    // TODO: Log the error details for debugging, GDPR compliant logging
    throw new Error("Failed to analyse job description with AI");
  }
}

function getAiModel(isDev: boolean, devProvider: string) {
  let aiModel: string;
  if (isDev) {
    if (devProvider === "openai") {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error(
          "OPENAI_API_KEY is required for DEV_AI_PROVIDER=openai",
        );
      }
      aiModel = process.env.LOCAL_DEV_AI_MODEL || "gpt-4o-mini";
    } else {
      if (!process.env.LOCAL_DEV_AI_MODEL) {
        throw new Error("LOCAL_DEV_AI_MODEL environment variable is not set");
      }
      aiModel = process.env.LOCAL_DEV_AI_MODEL;
    }
  } else {
    aiModel = "gpt-4o-mini";
  }
  return aiModel;
}
