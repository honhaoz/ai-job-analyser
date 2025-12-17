import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PrivacyPolicy from "./page";

describe("Privacy Policy Page", () => {
  it("renders the main title", () => {
    render(<PrivacyPolicy />);

    expect(
      screen.getByRole("heading", { name: /privacy policy/i }),
    ).toBeInTheDocument();
  });

  it("renders all key sections", () => {
    render(<PrivacyPolicy />);

    const sections = [
      /overview/i,
      /data collection and usage/i,
      /user responsibility/i,
      /third-party services/i,
      /data security/i,
      /intended use/i,
      /disclaimer/i,
      /changes to this policy/i,
      /contact/i,
    ];

    sections.forEach((s) => {
      expect(screen.getByRole("heading", { name: s })).toBeInTheDocument();
    });
  });

  it("mentions OpenAI integration and links to their privacy policy", () => {
    render(<PrivacyPolicy />);

    // Text mentioning OpenAI and analysis
    expect(screen.getAllByText(/openai/i).length).toBeGreaterThan(0);

    const links = screen.getAllByRole("link", { name: /openai/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    links.forEach((a) => {
      expect(a).toHaveAttribute(
        "href",
        "https://openai.com/policies/privacy-policy",
      );
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", expect.stringMatching(/noopener/i));
    });
  });

  it("shows the last updated date", () => {
    render(<PrivacyPolicy />);

    expect(
      screen.getByText(/last updated:\s*16\s+december\s+2025/i),
    ).toBeInTheDocument();
  });
});
