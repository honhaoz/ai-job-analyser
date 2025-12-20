import { describe, it, expect } from "vitest";
import type { AnalysedJD } from "../services/ai";
import { sanitiseAnalysedJD } from "./remove-basic-pii";

describe("sanitiseAnalysedJD (integration with real remove-pii)", () => {
  it("replaces emails, phones, and urls; trims whitespace", () => {
    const input: AnalysedJD = {
      hardSkills: [
        "JavaScript john@example.com",
        "React 555-123-4567",
        "Node.js  ",
      ],
      softSkills: ["Communication jane@corp.com", "Teamwork (123) 456-7890"],
      resumeImprovements: [
        "Contact me at jane@corp.com",
        "My phone is 123-456-7890",
        "See https://example.com",
      ],
      coverLetterSnippet:
        "  Reach: john@example.com, 123-456-7890 and https://example.com  ",
    };

    const out = sanitiseAnalysedJD(input);

    expect(out.hardSkills).toEqual([
      "JavaScript [email]",
      "React [phone]",
      "Node.js",
    ]);
    expect(out.softSkills).toEqual([
      "Communication [email]",
      "Teamwork [phone]",
    ]);
    expect(out.resumeImprovements).toEqual([
      "Contact me at [email]",
      "My phone is [phone]",
      "See [url]",
    ]);
    expect(out.coverLetterSnippet).toBe("Reach: [email], [phone] and [url]");
  });

  it("does not mutate the original input object", () => {
    const original: AnalysedJD = {
      hardSkills: [" Skill A  "],
      softSkills: ["  Skill B"],
      resumeImprovements: ["  Add metrics  "],
      coverLetterSnippet: "  Hello  ",
    };

    const snapshot = JSON.parse(JSON.stringify(original));
    // run
    const out = sanitiseAnalysedJD(original);

    // verify output changed appropriately
    expect(out.hardSkills[0]).toBe("Skill A");
    expect(out.softSkills[0]).toBe("Skill B");
    expect(out.resumeImprovements[0]).toBe("Add metrics");
    expect(out.coverLetterSnippet).toBe("Hello");

    // original untouched
    expect(original).toEqual(snapshot);
  });

  it("is resilient to null/undefined fields", () => {
    const input = {
      hardSkills: null,
      softSkills: undefined,
      resumeImprovements: ["  Keep concise  "],
      coverLetterSnippet: undefined,
    } as unknown as AnalysedJD;

    const out = sanitiseAnalysedJD(input);

    expect(out.hardSkills).toEqual([]);
    expect(out.softSkills).toEqual([]);
    expect(out.resumeImprovements).toEqual(["Keep concise"]);
    expect(out.coverLetterSnippet).toBe("");
  });

  it("leaves non-PII text unchanged apart from trimming", () => {
    const input: AnalysedJD = {
      hardSkills: ["TypeScript  "],
      softSkills: ["  Collaboration"],
      resumeImprovements: ["No PII here"],
      coverLetterSnippet: "  Enthusiastic and proactive  ",
    };

    const out = sanitiseAnalysedJD(input);
    expect(out.hardSkills).toEqual(["TypeScript"]);
    expect(out.softSkills).toEqual(["Collaboration"]);
    expect(out.resumeImprovements).toEqual(["No PII here"]);
    expect(out.coverLetterSnippet).toBe("Enthusiastic and proactive");
  });
});
