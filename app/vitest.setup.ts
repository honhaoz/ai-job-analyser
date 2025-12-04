import { beforeEach } from "vitest";

beforeEach(() => {
  (process.env as NodeJS.ProcessEnv & { NODE_ENV: string }).NODE_ENV = "test";
});
