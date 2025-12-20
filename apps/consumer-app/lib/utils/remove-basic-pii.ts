import { removePII } from "@coffeeandfun/remove-pii";
import { AnalysedJD } from "../services/ai";

const HIGH_PRIVACY_CONFIG = {
  email: { remove: true, replacement: "[email]" },
  phone: { remove: true, replacement: "[phone]" },
  ssn: { remove: true, replacement: "[ssn]" },
  creditCard: { remove: true, replacement: "[creditCard]" },
  address: { remove: true, replacement: "[address]" },
  passport: { remove: true, replacement: "[passport]" },
  driversLicense: { remove: true, replacement: "[driversLicense]" },
  ipAddress: { remove: true, replacement: "[ipAddress]" },
  zipCode: { remove: true, replacement: "[zipCode]" },
  bankAccount: { remove: true, replacement: "[bankAccount]" },
  url: { remove: true, replacement: "[url]" },
  dateOfBirth: { remove: true, replacement: "[dateOfBirth]" },
};

export function removeBasicPII(text: string): string {
  return removePII(text, HIGH_PRIVACY_CONFIG).trim();
}

export function sanitiseAnalysedJD(data: AnalysedJD): AnalysedJD {
  const clean = (s: string | null | undefined): string => {
    if (s === null || s === undefined) return "";
    return removeBasicPII(s);
  };
  const cleanArray = (arr: string[]) =>
    Array.isArray(arr) ? arr.map((v) => clean(v)) : [];

  return {
    hardSkills: cleanArray(data.hardSkills),
    softSkills: cleanArray(data.softSkills),
    resumeImprovements: cleanArray(data.resumeImprovements),
    coverLetterSnippet: clean(data.coverLetterSnippet),
  };
}
