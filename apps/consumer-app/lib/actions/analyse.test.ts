import { describe, it, expect, beforeEach, vi } from "vitest";

const mockCreate = vi.fn();

vi.mock("openai", () => ({
  default: class MockOpenAI {
    chat = {
      completions: {
        create: (...args: unknown[]) => mockCreate(...args),
      },
    };
  },
}));

describe("analyseJDAction", () => {
  let analyseJDAction: typeof import("./analyse").analyseJDAction;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockCreate.mockReset();
    vi.unstubAllEnvs();
    const actionModule = await import("./analyse");
    analyseJDAction = actionModule.analyseJDAction;
  });

  it("should return error for invalid job description", async () => {
    const formData = new FormData();
    formData.append("jobDescription", "short");
    formData.append("isPrivacyAccepted", "true");

    const result = await analyseJDAction(formData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid job description");
  });

  it("should return error when privacy policy is not accepted", async () => {
    const formData = new FormData();
    formData.append(
      "jobDescription",
      "Valid job description with more than ten characters",
    );
    formData.append("isPrivacyAccepted", "false");

    const result = await analyseJDAction(formData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Privacy policy must be accepted");
  });

  it("should return success with AI result for valid job description", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("LOCAL_DEV_AI_MODEL", "mistral:latest");
    vi.stubEnv("OLLAMA_BASE_URL", "http://localhost:11434/v1");

    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              hardSkills: ["JavaScript", "React"],
              softSkills: ["Communication"],
              resumeImprovements: [
                "Add project metrics",
                "Highlight leadership",
                "Tailor to role",
              ],
              coverLetterSnippet: "Excited to contribute to your team.",
            }),
          },
        },
      ],
    });

    const formData = new FormData();
    formData.append(
      "jobDescription",
      "Valid job description with more than ten characters",
    );
    formData.append("isPrivacyAccepted", "true");

    const result = await analyseJDAction(formData);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data).toHaveProperty("hardSkills");
    expect(result.data).toHaveProperty("softSkills");
    expect(result.data).toHaveProperty("resumeImprovements");
    expect(result.data).toHaveProperty("coverLetterSnippet");
  });

  it("should handle missing job description field", async () => {
    const formData = new FormData();
    formData.append("isPrivacyAccepted", "true");

    const result = await analyseJDAction(formData);

    expect(result.success).toBe(false);
    expect(result.error).toBe(
      "Failed Zod validation to analyse job description",
    );
  });
});
