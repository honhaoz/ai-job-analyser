import { removeBasicPII } from "./remove-basic-pii";
import { describe, it, expect } from "vitest";
import type { AnalysedJD } from "../services/ai";
import { sanitiseAnalysedJD } from "./remove-basic-pii";

describe("removeBasicPII (integration with real library)", () => {
  it("replaces emails, phones and urls, and trims whitespace", () => {
    const input =
      "  Contact: john.doe@example.com, (123) 456-7890, https://example.com  ";
    const out = removeBasicPII(input);
    expect(out).toBe("Contact: [email], [phone], [url]");
  });

  it("handles common phone formats", () => {
    const a = removeBasicPII("Call me at 555-123-4567");
    const b = removeBasicPII("Call me at (555) 123-4567");
    const c = removeBasicPII("Call me at +15551234567");
    expect(a).toBe("Call me at [phone]");
    expect(b).toBe("Call me at [phone]");
    // E.164 format should be detected by the library
    expect(c).toBe("Call me at [phone]");
  });

  it("is idempotent (second pass doesn't change result)", () => {
    const first = removeBasicPII(
      "Email john@example.com and site https://example.com",
    );
    const second = removeBasicPII(first);
    expect(second).toBe(first);
  });

  it("returns empty string for empty/whitespace input", () => {
    expect(removeBasicPII("   ")).toBe("");
    expect(removeBasicPII("")).toBe("");
  });

  it("leaves non-PII text unchanged except for trimming", () => {
    const input = "  Just some regular content without identifiers  ";
    const out = removeBasicPII(input);
    expect(out).toBe("Just some regular content without identifiers");
  });
});

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
