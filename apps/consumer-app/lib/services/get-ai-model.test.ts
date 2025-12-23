import { describe, it, expect, beforeEach, vi } from "vitest";

const mockCreate = vi.fn();

vi.mock("openai", () => {
  return {
    default: class MockOpenAI {
      constructor(_opts?: unknown) {}
      chat = {
        completions: {
          create: (...args: unknown[]) => mockCreate(...args),
        },
      };
    },
  };
});

describe("getAiModel (via analyseJD)", () => {
  let analyseJD: typeof import("./ai").analyseJD;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockCreate.mockReset();
    vi.unstubAllEnvs();

    // Re-import to ensure it reads fresh env each test
    const mod = await import("./ai");
    analyseJD = mod.analyseJD;
  });

  function mockOkResponse() {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              hardSkills: ["Skill1"],
              softSkills: ["Skill2"],
              resumeImprovements: ["Improve x", "Improve y", "Improve z"],
              coverLetterSnippet: "Snippet",
            }),
          },
        },
      ],
    });
  }

  it("development + ollama uses LOCAL_DEV_AI_MODEL", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("LOCAL_DEV_AI_MODEL", "mistral:latest");
    // base URL/API key not used by our mock, but leave unset
    mockOkResponse();

    await analyseJD("Some sufficiently long job description text");

    expect(mockCreate).toHaveBeenCalled();
    const firstArg = mockCreate.mock.calls[0][0];
    expect(firstArg.model).toBe("mistral:latest");
  });

  it("development + openai uses default when LOCAL_DEV_AI_MODEL is unset", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("DEV_AI_PROVIDER", "openai");
    vi.stubEnv("OPENAI_API_KEY", "sk-test");
    mockOkResponse();

    await analyseJD("Another job description long enough");

    const firstArg = mockCreate.mock.calls[0][0];
    expect(firstArg.model).toBe("gpt-4o-mini");
  });

  it("production uses gpt-4o-mini", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("OPENAI_API_KEY", "sk-prod");
    mockOkResponse();

    await analyseJD("Production path job description text");

    const firstArg = mockCreate.mock.calls[0][0];
    expect(firstArg.model).toBe("gpt-4o-mini");
  });

  it("development + ollama without LOCAL_DEV_AI_MODEL throws", async () => {
    vi.stubEnv("NODE_ENV", "development");
    // no LOCAL_DEV_AI_MODEL
    mockOkResponse();

    await expect(analyseJD("Long enough text")).rejects.toThrow(
      /LOCAL_DEV_AI_MODEL environment variable is not set/i,
    );
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("development + openai without OPENAI_API_KEY throws", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("DEV_AI_PROVIDER", "openai");
    // no OPENAI_API_KEY
    mockOkResponse();

    await expect(analyseJD("Long enough text")).rejects.toThrow(
      /OPENAI_API_KEY is required for DEV_AI_PROVIDER=openai/i,
    );
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
