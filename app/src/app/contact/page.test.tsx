import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Contact from "./page";

describe("Contact Page", () => {
  it("should render the hero section with heading", () => {
    render(<Contact />);

    expect(
      screen.getByRole("heading", { name: /get in touch/i, level: 1 })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Have questions, feedback, or suggestions/i)
    ).toBeInTheDocument();
  });

  it("should render all four contact methods", () => {
    render(<Contact />);

    expect(
      screen.getByRole("heading", { name: /email us/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /github/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /linkedin/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /feedback/i })
    ).toBeInTheDocument();
  });

  it("should render contact descriptions", () => {
    render(<Contact />);

    expect(
      screen.getByText(/For general inquiries and support/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Contribute to our open source project/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Connect with us professionally/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Your feedback helps us improve/i)
    ).toBeInTheDocument();
  });

  it("should render email link with correct mailto href", () => {
    render(<Contact />);

    const emailLink = screen.getByRole("link", {
      name: /honghao@workmail\.com/i,
    });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:honghao@workmail.com");
  });

  it("should render GitHub link with correct href", () => {
    render(<Contact />);

    const githubLink = screen.getByRole("link", {
      name: /github\.com\/honhaoz/i,
    });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute("href", "https://github.com/honhaoz");
    expect(githubLink).toHaveAttribute("target", "_blank");
  });

  it("should render LinkedIn link with correct href", () => {
    render(<Contact />);

    const linkedinLink = screen.getByRole("link", {
      name: /linkedin\.com\/in\/honghaoz/i,
    });
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://linkedin.com/in/honghaoz"
    );
    expect(linkedinLink).toHaveAttribute("target", "_blank");
  });

  it("should render external links with target blank", () => {
    render(<Contact />);

    const externalLinks = screen.getAllByRole("link", {
      name: /github|linkedin/i,
    });
    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("should render FAQ section with heading", () => {
    render(<Contact />);

    expect(
      screen.getByRole("heading", { name: /frequently asked questions/i })
    ).toBeInTheDocument();
  });

  it("should render all FAQ questions", () => {
    render(<Contact />);

    expect(
      screen.getByRole("heading", { name: /is the service free\?/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /do you store my data\?/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /how accurate is the ai\?/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /can i suggest new features\?/i })
    ).toBeInTheDocument();
  });

  it("should render FAQ answers", () => {
    render(<Contact />);

    expect(
      screen.getByText(/Yes, our basic analyser is completely free to use/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /No, we don't store job descriptions or personal information/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Our AI is highly accurate and continuously improving/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Absolutely! We'd love to hear your ideas/i)
    ).toBeInTheDocument();
  });

  it("should render all major sections in correct order", () => {
    render(<Contact />);

    const headings = screen.getAllByRole("heading");
    const headingTexts = headings.map((h) => h.textContent);

    expect(headingTexts[0]).toMatch(/Get In Touch/i);
    expect(headingTexts).toContain("Email Us");
    expect(headingTexts).toContain("GitHub");
    expect(headingTexts).toContain("LinkedIn");
    expect(headingTexts).toContain("Feedback");
    expect(headingTexts).toContain("Frequently Asked Questions");
  });

  it("should have proper accessibility with heading hierarchy", () => {
    render(<Contact />);

    const h1 = screen.getByRole("heading", { level: 1 });
    const h2Headings = screen.getAllByRole("heading", { level: 2 });
    const h3Headings = screen.getAllByRole("heading", { level: 3 });

    expect(h1).toBeInTheDocument();
    expect(h2Headings.length).toBeGreaterThan(0);
    expect(h3Headings.length).toBeGreaterThan(0);
  });

  it("should render contact cards in a grid", () => {
    render(<Contact />);

    const contactMethods = [/email us/i, /github/i, /linkedin/i, /feedback/i];
    contactMethods.forEach((method) => {
      expect(screen.getByRole("heading", { name: method })).toBeInTheDocument();
    });
  });
});
