import { describe, it, expect } from "vitest";
import { validateJobDescription } from "./validators";

describe("validateJobDescription", () => {
  it("should return true for valid job descriptions", () => {
    const validDescription =
      "Software Engineer position requiring 5 years experience";
    expect(validateJobDescription(validDescription)).toBe(true);
  });

  it("should return false for empty strings", () => {
    expect(validateJobDescription("")).toBe(false);
  });

  it("should return false for strings with 10 or fewer characters", () => {
    expect(validateJobDescription("Short")).toBe(false);
    expect(validateJobDescription("Ten chars!")).toBe(false);
  });

  it("should return true for strings with more than 10 characters", () => {
    expect(validateJobDescription("More than ten characters")).toBe(true);
  });

  it("should handle very long job descriptions", () => {
    const longDescription = "a".repeat(10000);
    expect(validateJobDescription(longDescription)).toBe(true);
  });
});
