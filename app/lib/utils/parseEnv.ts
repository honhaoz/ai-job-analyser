/**
 * Parse environment variable string to its inferred type
 * Automatically converts strings to their most appropriate type:
 * - "true"/"false"/"yes"/"no" -> boolean
 * - "123", "3.14", "-10" -> number
 * - "a,b,c" -> string[] (if contains comma)
 * - Otherwise -> string
 *
 * @example
 * parseEnv("true")      // true
 * parseEnv("123")       // 123
 * parseEnv("3.14")      // 3.14
 * parseEnv("a,b,c")     // ["a", "b", "c"]
 * parseEnv("hello")     // "hello"
 * parseEnv(undefined)   // undefined
 */
export function parseEnv(value?: string): unknown {
  const trimmed = value?.trim();
  if (trimmed === undefined || trimmed === "") {
    return undefined;
  }

  // Boolean
  const lower = trimmed.toLowerCase();
  if (lower === "true" || lower === "yes") return true;
  if (lower === "false" || lower === "no") return false;

  if (!Number.isNaN(Number(trimmed))) return Number(trimmed);

  // String (default)
  return trimmed;
}
