import OpenAI from "openai";
import { removePII } from "@coffeeandfun/remove-pii";
import { parseEnv } from "../utils/parse-env";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export type AnalysedJD = {
  hardSkills: string[];
  softSkills: string[];
  resumeImprovements: string[];
  coverLetterSnippet: string;
};

export const mockResponse: AnalysedJD = {
  hardSkills: [
    "Microsoft Azure",
    "Google Cloud Platform",
    "Azure WAF",
    "Google Cloud Armor",
    "Google Model Armor",
    "VPCSC",
    "Azure Firewall",
    "Google VPC Firewall",
    "Azure NGFW",
    "Google Cloud NGFW",
    "GitHub",
    "Terraform",
    "Azure Policy",
    "Google Organization Policy",
    "Infrastructure as Code",
    "DevOps",
    "Continuous Integration",
    "Continuous Delivery",
    "Agile development",
    "Jira",
    "Confluence",
  ],
  softSkills: [
    "Self-starter",
    "Ability to learn quickly",
    "Listening skills",
    "Respect for others' views",
    "Communication",
    "Problem-solving",
    "Environmental awareness",
    "Teamwork",
    "Passion for automation",
  ],
  resumeImprovements: [
    "Highlight experience with cloud technologies",
    "Emphasize agile team collaboration",
    "Showcase personal development pursuits and learning initiatives",
  ],
  coverLetterSnippet:
    "I am excited about the opportunity to join {{company}} as a Junior Software Engineer. With my background in cloud technologies and a strong passion for automation, I am eager to contribute to a collaborative agile team. I believe my skills in Microsoft Azure and DevOps practices will enable me to effectively support and improve the innovative projects at {{company}}.",
};

const highPrivacy = {
  email: { remove: true, replacement: "[email]" },
  phone: { remove: true, replacement: "[phone]" },
  ssn: { remove: true, replacement: "[ssn]" },
  creditCard: { remove: true, replacement: "[creditCard]" },
  address: { remove: true, replacement: "[address]" },
  passport: { remove: true, replacement: "[passport]" },
  driversLicense: { remove: true, replacement: "[driversLicense]" },
  ipAddress: { remove: true, replacement: "[ipAddress]" },
  zipCode: { remove: true, replacement: "[zipCode]" },
  bankAccount: { remove: true, replacement: "[bankAccount]" },
  url: { remove: true, replacement: "[url]" },
  dateOfBirth: { remove: true, replacement: "[dateOfBirth]" },
};

function sanitizeAnalysedJD(data: AnalysedJD): AnalysedJD {
  const clean = (s: string) => removePII(s, highPrivacy).trim();
  const cleanArray = (arr: string[]) =>
    Array.isArray(arr) ? arr.map((v) => clean(v)) : [];

  return {
    hardSkills: cleanArray(data.hardSkills),
    softSkills: cleanArray(data.softSkills),
    resumeImprovements: cleanArray(data.resumeImprovements),
    coverLetterSnippet: clean(data.coverLetterSnippet),
  };
}

export async function analyseJD(jobDescription: string): Promise<AnalysedJD> {
  const dev = process.env.NODE_ENV !== "production";
  const enableAIInDev = !!parseEnv(process.env.ENABLE_AI_IN_DEV);
  if (dev && !enableAIInDev) {
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Development mode: returning mock AI response.");
    return mockResponse;
  }
  // Sanitize the incoming job description to remove any PII before sending to OpenAI
  const sanitizedJD = removePII(jobDescription, highPrivacy);
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

${sanitizedJD}
`;

  try {
    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
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
      return JSON.parse("{}");
    }
    const parsed = JSON.parse(content);
    return sanitizeAnalysedJD(parsed);
  } catch (_error) {
    // TODO: Log the error details for debugging, GDPR compliant logging
    throw new Error("Failed to analyse job description with AI");
  }
}
export default {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.openai.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  reactCompiler: true,
} satisfies import("next").NextConfig;
