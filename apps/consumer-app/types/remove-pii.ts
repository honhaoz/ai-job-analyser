declare module "@coffeeandfun/remove-pii" {
  export type RemovePIIOptions = Record<string, unknown>;
  export function removePII(text: string, options?: RemovePIIOptions): string;
}
