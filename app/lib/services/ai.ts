import OpenAI from "openai";

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
    "I am excited about the opportunity to join Lloyds Banking Group as a Junior Software Engineer. With my background in cloud technologies and a strong passion for automation, I am eager to contribute to a collaborative agile team. I believe my skills in Microsoft Azure and DevOps practices will enable me to effectively support and improve the innovative projects at Lloyds.",
};

export async function analyseJD(jobDescription: string): Promise<AnalysedJD> {
  const dev = process.env.NODE_ENV !== "production";
  if (dev) {
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Development mode: returning mock AI response.");
    return mockResponse;
  }
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

${jobDescription}
`;

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

  return JSON.parse(res.choices[0].message.content || "{}");
}
