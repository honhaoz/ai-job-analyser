import { beforeEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

beforeEach(() => {
  (process.env as NodeJS.ProcessEnv & { NODE_ENV: string }).NODE_ENV = "test";
});
