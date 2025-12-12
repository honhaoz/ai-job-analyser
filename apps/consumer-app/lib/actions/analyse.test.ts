import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("openai", () => ({
  default: class MockOpenAI {
    chat = {
      completions: {
        create: vi.fn(),
      },
    };
  },
}));

describe("analyseJDAction", () => {
  let analyseJDAction: typeof import("./analyse").analyseJDAction;

  beforeEach(async () => {
    vi.clearAllMocks();
    const actionModule = await import("./analyse");
    analyseJDAction = actionModule.analyseJDAction;
  });

  it("should return error for invalid job description", async () => {
    const formData = new FormData();
    formData.append("jobDescription", "short");

    const result = await analyseJDAction(formData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid job description");
  });

  it("should return success with AI result for valid job description", async () => {
    const formData = new FormData();
    formData.append(
      "jobDescription",
      "Valid job description with more than ten characters",
    );

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

    const result = await analyseJDAction(formData);

    expect(result.success).toBe(false);
    expect(result.error).toBe(
      "Failed Zod validation to analyse job description",
    );
  });
});
