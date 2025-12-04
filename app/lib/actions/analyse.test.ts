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

vi.mock("@/lib/services/ai");
vi.mock("@/lib/utils/validators");

const { analyzeJD } = await import("@/lib/services/ai");
const { validateJobDescription } = await import("@/lib/utils/validators");
const { analyzeJobDescription } = await import("./analyse");

describe("analyzeJobDescription", () => {
  const mockAnalyzeJD = vi.mocked(analyzeJD);
  const mockValidateJobDescription = vi.mocked(validateJobDescription);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return error for invalid job description", async () => {
    mockValidateJobDescription.mockReturnValue(false);

    const formData = new FormData();
    formData.append("jobDescription", "short");

    const result = await analyzeJobDescription(formData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid job description");
    expect(mockAnalyzeJD).not.toHaveBeenCalled();
  });

  it("should return success with AI result for valid job description", async () => {
    const mockAIResult = {
      hardSkills: ["JavaScript", "React"],
      softSkills: ["Communication"],
      resumeImprovements: [
        "Add more details",
        "Highlight achievements",
        "Include metrics",
      ],
      coverLetterSnippet: "I am excited to apply...",
    };

    mockValidateJobDescription.mockReturnValue(true);
    mockAnalyzeJD.mockResolvedValue(mockAIResult);

    const formData = new FormData();
    formData.append(
      "jobDescription",
      "Valid job description with more than ten characters"
    );

    const result = await analyzeJobDescription(formData);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockAIResult);
    expect(mockValidateJobDescription).toHaveBeenCalledWith(
      "Valid job description with more than ten characters"
    );
    expect(mockAnalyzeJD).toHaveBeenCalledWith(
      "Valid job description with more than ten characters"
    );
  });

  it("should handle AI service errors", async () => {
    mockValidateJobDescription.mockReturnValue(true);
    mockAnalyzeJD.mockRejectedValue(new Error("OpenAI API error"));

    const formData = new FormData();
    formData.append("jobDescription", "Valid job description");

    const result = await analyzeJobDescription(formData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to analyze job description");
  });

  it("should handle missing job description field", async () => {
    const formData = new FormData();

    const result = await analyzeJobDescription(formData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to analyze job description");
  });

  it("should handle zod validation errors", async () => {
    const formData = new FormData();
    formData.append("jobDescription", 123 as any); // Invalid type

    const result = await analyzeJobDescription(formData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to analyze job description");
  });
});
