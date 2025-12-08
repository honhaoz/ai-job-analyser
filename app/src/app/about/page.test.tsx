import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "./page";

describe("About Page", () => {
  it("should render the hero section with main heading", () => {
    render(<About />);

    expect(
      screen.getByRole("heading", { name: /about our platform/i, level: 1 })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/AI-Powered Job Description Analyser helps job seekers/i)
    ).toBeInTheDocument();
  });

  it("should render the mission statement section", () => {
    render(<About />);

    expect(
      screen.getByRole("heading", { name: /our mission/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /We believe that finding the right job shouldn't be overwhelming/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/By leveraging cutting-edge AI technology/i)
    ).toBeInTheDocument();
  });

  it("should render all four feature cards", () => {
    render(<About />);

    expect(
      screen.getByRole("heading", { name: /why choose us\?/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /AI-Powered Analysis/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Tailored Suggestions/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Instant Results/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Privacy Focused/i })
    ).toBeInTheDocument();
  });

  it("should render feature descriptions", () => {
    render(<About />);

    expect(
      screen.getByText(/Our advanced AI technology extracts key skills/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Get personalised resume tips and cover letter snippets/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/No waiting around/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Your data is processed securely/i)
    ).toBeInTheDocument();
  });

  it("should render the how it works section with all steps", () => {
    render(<About />);

    expect(
      screen.getByRole("heading", { name: /how it works/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Paste Job Description/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /AI Analysis/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Get Results/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Apply With Confidence/i })
    ).toBeInTheDocument();
  });

  it("should render step numbers in correct order", () => {
    render(<About />);

    const stepNumbers = screen.getAllByText(/^[1-4]$/);
    expect(stepNumbers).toHaveLength(4);
    expect(stepNumbers[0]).toHaveTextContent("1");
    expect(stepNumbers[1]).toHaveTextContent("2");
    expect(stepNumbers[2]).toHaveTextContent("3");
    expect(stepNumbers[3]).toHaveTextContent("4");
  });

  it("should render step descriptions", () => {
    render(<About />);

    expect(
      screen.getByText(/Copy and paste any job description into our analyser/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Our AI processes the text to extract key skills/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Receive extracted skills, resume tips/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Use the insights to tailor your application/i)
    ).toBeInTheDocument();
  });

  it("should render the team section", () => {
    render(<About />);

    expect(
      screen.getByRole("heading", { name: /Built for Job Seekers/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /We're a team of developers, designers, and career professionals/i
      )
    ).toBeInTheDocument();
  });

  it("should render all major sections in correct order", () => {
    render(<About />);

    const headings = screen.getAllByRole("heading");
    const headingTexts = headings.map((h) => h.textContent);

    expect(headingTexts[0]).toMatch(/About Our Platform/i);
    expect(headingTexts[1]).toMatch(/Our Mission/i);
    expect(headingTexts[2]).toMatch(/Why Choose Us/i);
    expect(headingTexts).toContain("How It Works");
    expect(headingTexts).toContain("Built for Job Seekers");
  });

  it("should have proper accessibility with heading hierarchy", () => {
    render(<About />);

    const h1 = screen.getByRole("heading", { level: 1 });
    const h2Headings = screen.getAllByRole("heading", { level: 2 });
    const h3Headings = screen.getAllByRole("heading", { level: 3 });

    expect(h1).toBeInTheDocument();
    expect(h2Headings.length).toBeGreaterThan(0);
    expect(h3Headings.length).toBeGreaterThan(0);
  });
});
