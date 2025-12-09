import { describe, it, expect } from "vitest";
import { parseEnv } from "./parseEnv";

describe("parseEnv", () => {
  describe("undefined and empty", () => {
    it("should return undefined for undefined input", () => {
      expect(parseEnv(undefined)).toBeUndefined();
    });

    it("should return undefined for empty string", () => {
      expect(parseEnv("")).toBeUndefined();
    });

    it("should return undefined for whitespace only", () => {
      expect(parseEnv("   ")).toBeUndefined();
    });
  });

  describe("boolean parsing", () => {
    it("should parse 'true' as boolean true", () => {
      expect(parseEnv("true")).toBe(true);
    });

    it("should parse 'TRUE' as boolean true (case insensitive)", () => {
      expect(parseEnv("TRUE")).toBe(true);
    });

    it("should parse 'yes' as boolean true", () => {
      expect(parseEnv("yes")).toBe(true);
    });

    it("should parse 'YES' as boolean true", () => {
      expect(parseEnv("YES")).toBe(true);
    });

    it("should parse 'false' as boolean false", () => {
      expect(parseEnv("false")).toBe(false);
    });

    it("should parse 'FALSE' as boolean false", () => {
      expect(parseEnv("FALSE")).toBe(false);
    });

    it("should parse 'no' as boolean false", () => {
      expect(parseEnv("no")).toBe(false);
    });

    it("should parse 'NO' as boolean false", () => {
      expect(parseEnv("NO")).toBe(false);
    });

    it("should handle whitespace around boolean values", () => {
      expect(parseEnv("  true  ")).toBe(true);
      expect(parseEnv("  false  ")).toBe(false);
    });
  });

  describe("number parsing", () => {
    it("should parse positive integer", () => {
      expect(parseEnv("123")).toBe(123);
    });

    it("should parse zero", () => {
      expect(parseEnv("0")).toBe(0);
    });

    it("should parse negative integer", () => {
      expect(parseEnv("-42")).toBe(-42);
    });

    it("should parse positive decimal", () => {
      expect(parseEnv("3.14")).toBe(3.14);
    });

    it("should parse negative decimal", () => {
      expect(parseEnv("-2.5")).toBe(-2.5);
    });

    it("should parse decimal starting with zero", () => {
      expect(parseEnv("0.5")).toBe(0.5);
    });

    it("should handle whitespace around numbers", () => {
      expect(parseEnv("  42  ")).toBe(42);
    });
  });

  describe("string parsing", () => {
    it("should return plain string as-is", () => {
      expect(parseEnv("hello")).toBe("hello");
    });

    it("should return string with spaces", () => {
      expect(parseEnv("hello world")).toBe("hello world");
    });

    it("should trim leading/trailing whitespace", () => {
      expect(parseEnv("  hello  ")).toBe("hello");
    });

    it("should not parse '1' as boolean despite similarity", () => {
      expect(parseEnv("1")).toBe(1);
    });

    it("should not parse alphanumeric as number", () => {
      expect(parseEnv("123abc")).toBe("123abc");
    });

    it("should handle URL strings", () => {
      expect(parseEnv("http://example.com")).toBe("http://example.com");
    });

    it("should handle file paths", () => {
      expect(parseEnv("/path/to/file")).toBe("/path/to/file");
    });
  });
});
