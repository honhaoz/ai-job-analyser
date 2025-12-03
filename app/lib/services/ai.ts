import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const mockResponse = {
  success: true,
  aiResult: {
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
      "I am excited about the opportunity to join Lloyds Banking Group as a Junior Software Engineer. With my background in cloud technologies and a strong passion for automation, I am eager to contribute to a collaborative agile team. I believe my skills in Microsoft Azure and DevOps practices will enable me to effectively support and improve the innovative projects at Lloyds.",
  },
};

export async function analyzeJD(jobDescription: string) {
  const dev = process.env.NODE_ENV !== "production";
  if (dev) {
    console.log("Development mode: returning mock AI response.");
    return mockResponse.aiResult;
  }

  const res = await client.chat.completions.create({
    model: "gpt-5-nano", // cheapest ChatGPT model by December 2025
    messages: [
      { role: "user", content: jobDescription },
      {
        role: "system",
        content: "Extract structured information from the job description.",
      },
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

  return JSON.parse(res.choices[0].message.content || "{}");
}
