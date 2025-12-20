import { describe, it, expect, beforeEach, vi } from "vitest";
import { analyseJD } from "./ai";

const mockCreate = vi.fn();

vi.mock("openai", () => {
  return {
    default: class MockOpenAI {
      chat = {
        completions: {
          create: (...args: unknown[]) => mockCreate(...args),
        },
      };
    },
  };
});

describe("analyseJD", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockClear();
  });

  it("should return mock data in development mode", async () => {
    const result = await analyseJD("Test job description");

    expect(result).toHaveProperty("hardSkills");
    expect(result).toHaveProperty("softSkills");
    expect(result).toHaveProperty("resumeImprovements");
    expect(result).toHaveProperty("coverLetterSnippet");
    expect(Array.isArray(result.hardSkills)).toBe(true);
    expect(Array.isArray(result.softSkills)).toBe(true);
  });

  it("should call OpenAI API in production mode", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              hardSkills: ["JavaScript", "React", "Node.js"],
              softSkills: ["Communication", "Teamwork"],
              resumeImprovements: [
                "Add more project details",
                "Highlight leadership experience",
                "Include metrics and achievements",
              ],
              coverLetterSnippet: "I am excited to apply for this position...",
            }),
          },
        },
      ],
    };

    mockCreate.mockResolvedValue(mockResponse);

    const result = await analyseJD(
      "Software Engineer position requiring JavaScript skills",
    );

    expect(mockCreate).toHaveBeenCalled();
    expect(result.hardSkills).toEqual(["JavaScript", "React", "Node.js"]);
    expect(result.softSkills).toEqual(["Communication", "Teamwork"]);
    expect(result.resumeImprovements).toHaveLength(3);
  });

  it("should handle OpenAI API errors", async () => {
    vi.stubEnv("NODE_ENV", "production");

    mockCreate.mockRejectedValue(new Error("API quota exceeded"));

    await expect(analyseJD("Test job description")).rejects.toThrow(
      /Failed to analyse job description with AI/i,
    );
  });

  it("should handle invalid JSON response", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const mockResponse = {
      choices: [
        {
          message: {
            content: "Invalid JSON response",
          },
        },
      ],
    };

    mockCreate.mockResolvedValue(mockResponse);

    await expect(analyseJD("Test job description")).rejects.toThrow();
  });

  it("should handle empty response", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const mockResponse = {
      choices: [
        {
          message: {
            content: "",
          },
        },
      ],
    };

    mockCreate.mockResolvedValue(mockResponse);

    const result = await analyseJD("Test job description");

    expect(result).toEqual({});
  });
});
