import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "./route";
import { analyzeJD } from "@/lib/services/ai";
import { validateJobDescription } from "@/lib/utils/validators";

// Mock the dependencies
vi.mock("@/lib/services/ai");
vi.mock("@/lib/utils/validators");

describe("/api/analyse POST", () => {
  const mockAnalyzeJD = analyzeJD as any;
  const mockValidateJobDescription = validateJobDescription as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 for invalid job description", async () => {
    mockValidateJobDescription.mockReturnValue(false);

    const mockRequest = {
      json: async () => ({ jobDescription: "short" }),
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid job description");
  });

  it("should return 200 with AI result for valid job description", async () => {
    const mockAIResult = {
      hardSkills: ["JavaScript", "React"],
      softSkills: ["Communication"],
      resumeImprovements: ["Add more details"],
      coverLetterSnippet: "I am excited to apply...",
    };

    mockValidateJobDescription.mockReturnValue(true);
    mockAnalyzeJD.mockResolvedValue(mockAIResult);

    const mockRequest = {
      json: async () => ({
        jobDescription: "Valid job description with more than ten characters",
      }),
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.aiResult).toEqual(mockAIResult);
  });

  it("should return 500 on server error", async () => {
    mockValidateJobDescription.mockReturnValue(true);
    mockAnalyzeJD.mockRejectedValue(new Error("OpenAI API error"));

    const mockRequest = {
      json: async () => ({ jobDescription: "Valid job description" }),
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Server error");
    expect(data.details).toBe("OpenAI API error");
  });

  it("should handle malformed JSON request", async () => {
    const mockRequest = {
      json: async () => {
        throw new Error("Invalid JSON");
      },
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Server error");
  });
});
