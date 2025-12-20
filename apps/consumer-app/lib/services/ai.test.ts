import { describe, it, expect, beforeEach, vi } from "vitest";
import { analyseJD, sanitizeAnalysedJD } from "./ai";

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

  it("should sanitize PII from AI output", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const mockResponseWithPII = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              hardSkills: [
                "JavaScript john@example.com",
                "React 555-123-4567",
                "Node.js",
              ],
              softSkills: ["Communication john@example.com", "Teamwork"],
              resumeImprovements: [
                "Contact me at jane@corp.com",
                "My phone is 123-456-7890",
              ],
              coverLetterSnippet:
                "Reach me: name, john@example.com, 123-456-7890",
            }),
          },
        },
      ],
    };
    mockCreate.mockResolvedValue(mockResponseWithPII);

    const result = await analyseJD("JD with potential PII");

    expect(mockCreate).toHaveBeenCalled();
    expect(result.hardSkills).toEqual([
      "JavaScript [email]",
      "React [phone]",
      "Node.js",
    ]);
    expect(result.softSkills).toEqual(["Communication [email]", "Teamwork"]);
    expect(result.resumeImprovements).toEqual([
      "Contact me at [email]",
      "My phone is [phone]",
    ]);
    expect(result.coverLetterSnippet).toBe("Reach me: name, [email], [phone]");
  });
});

describe("sanitizeAnalysedJD", () => {
  it("should sanitize PII from all fields with valid data", () => {
    const input = {
      hardSkills: ["JavaScript", "React with john@example.com"],
      softSkills: ["Communication", "Call 555-123-4567"],
      resumeImprovements: ["Add email jane@corp.com", "Phone: 123-456-7890"],
      coverLetterSnippet: "Contact: john@example.com or 555-123-4567",
    };

    const result = sanitizeAnalysedJD(input);

    expect(result.hardSkills).toEqual(["JavaScript", "React with [email]"]);
    expect(result.softSkills).toEqual(["Communication", "Call [phone]"]);
    expect(result.resumeImprovements).toEqual([
      "Add email [email]",
      "Phone: [phone]",
    ]);
    expect(result.coverLetterSnippet).toBe("Contact: [email] or [phone]");
  });

  it("should handle null values gracefully", () => {
    const input = {
      hardSkills: null as unknown as string[],
      softSkills: null as unknown as string[],
      resumeImprovements: null as unknown as string[],
      coverLetterSnippet: null as unknown as string,
    };

    const result = sanitizeAnalysedJD(input);

    expect(result.hardSkills).toEqual([]);
    expect(result.softSkills).toEqual([]);
    expect(result.resumeImprovements).toEqual([]);
    expect(result.coverLetterSnippet).toBe("");
  });

  it("should handle undefined values gracefully", () => {
    const input = {
      hardSkills: undefined as unknown as string[],
      softSkills: undefined as unknown as string[],
      resumeImprovements: undefined as unknown as string[],
      coverLetterSnippet: undefined as unknown as string,
    };

    const result = sanitizeAnalysedJD(input);

    expect(result.hardSkills).toEqual([]);
    expect(result.softSkills).toEqual([]);
    expect(result.resumeImprovements).toEqual([]);
    expect(result.coverLetterSnippet).toBe("");
  });

  it("should handle empty strings", () => {
    const input = {
      hardSkills: ["", "JavaScript", ""],
      softSkills: [""],
      resumeImprovements: ["", "", ""],
      coverLetterSnippet: "",
    };

    const result = sanitizeAnalysedJD(input);

    expect(result.hardSkills).toEqual(["", "JavaScript", ""]);
    expect(result.softSkills).toEqual([""]);
    expect(result.resumeImprovements).toEqual(["", "", ""]);
    expect(result.coverLetterSnippet).toBe("");
  });

  it("should handle empty arrays", () => {
    const input = {
      hardSkills: [],
      softSkills: [],
      resumeImprovements: [],
      coverLetterSnippet: "Test snippet",
    };

    const result = sanitizeAnalysedJD(input);

    expect(result.hardSkills).toEqual([]);
    expect(result.softSkills).toEqual([]);
    expect(result.resumeImprovements).toEqual([]);
    expect(result.coverLetterSnippet).toBe("Test snippet");
  });

  it("should handle malformed data structures (non-array for array fields)", () => {
    const input = {
      hardSkills: "not an array" as unknown as string[],
      softSkills: 123 as unknown as string[],
      resumeImprovements: { key: "value" } as unknown as string[],
      coverLetterSnippet: "Valid string",
    };

    const result = sanitizeAnalysedJD(input);

    expect(result.hardSkills).toEqual([]);
    expect(result.softSkills).toEqual([]);
    expect(result.resumeImprovements).toEqual([]);
    expect(result.coverLetterSnippet).toBe("Valid string");
  });

  it("should trim whitespace from strings", () => {
    const input = {
      hardSkills: ["  JavaScript  ", "React   "],
      softSkills: ["   Communication"],
      resumeImprovements: ["Improvement 1   ", "  Improvement 2  "],
      coverLetterSnippet: "   Cover letter with spaces   ",
    };

    const result = sanitizeAnalysedJD(input);

    expect(result.hardSkills).toEqual(["JavaScript", "React"]);
    expect(result.softSkills).toEqual(["Communication"]);
    expect(result.resumeImprovements).toEqual([
      "Improvement 1",
      "Improvement 2",
    ]);
    expect(result.coverLetterSnippet).toBe("Cover letter with spaces");
  });

  it("should sanitize multiple types of PII in a single string", () => {
    const input = {
      hardSkills: ["Skill with email@test.com and 123-456-7890"],
      softSkills: ["Soft skill"],
      resumeImprovements: ["Visit http://example.com or email test@site.org"],
      coverLetterSnippet:
        "My SSN is 123-45-6789 and credit card 4111-1111-1111-1111",
    };

    const result = sanitizeAnalysedJD(input);

    expect(result.hardSkills[0]).toContain("[email]");
    expect(result.hardSkills[0]).toContain("[phone]");
    expect(result.resumeImprovements[0]).toContain("[url]");
    expect(result.resumeImprovements[0]).toContain("[email]");
    expect(result.coverLetterSnippet).toContain("[ssn]");
    expect(result.coverLetterSnippet).toContain("[creditCard]");
  });

  it("should handle strings with special characters", () => {
    const input = {
      hardSkills: ["C++", "Node.js", "React@18"],
      softSkills: ["Problem-solving!", "Team@work"],
      resumeImprovements: ["Use #hashtags", "Apply @mentions"],
      coverLetterSnippet: "Skills: C#, F#, and more!",
    };

    const result = sanitizeAnalysedJD(input);

    expect(result.hardSkills).toEqual(["C++", "Node.js", "React@18"]);
    expect(result.softSkills).toEqual(["Problem-solving!", "Team@work"]);
    expect(result.resumeImprovements).toEqual([
      "Use #hashtags",
      "Apply @mentions",
    ]);
    expect(result.coverLetterSnippet).toBe("Skills: C#, F#, and more!");
  });

  it("should handle arrays with mixed content types", () => {
    const input = {
      hardSkills: ["JavaScript", "", "   ", "Python with email@test.com"],
      softSkills: ["Communication", "Leadership"],
      resumeImprovements: ["", "Improvement", "  "],
      coverLetterSnippet: "Normal cover letter",
    };

    const result = sanitizeAnalysedJD(input);

    expect(result.hardSkills).toEqual([
      "JavaScript",
      "",
      "",
      "Python with [email]",
    ]);
    expect(result.softSkills).toEqual(["Communication", "Leadership"]);
    expect(result.resumeImprovements).toEqual(["", "Improvement", ""]);
    expect(result.coverLetterSnippet).toBe("Normal cover letter");
  });
});
