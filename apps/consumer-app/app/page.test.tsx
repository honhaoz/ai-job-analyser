import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./page";
import { analyseJDAction } from "@/lib/actions/analyse";

vi.mock("@/lib/actions/analyse");

describe("Home Page", () => {
  it("should render the privacy warning banner", () => {
    render(<Home />);

    expect(screen.getByText(/Privacy Notice:/i)).toBeInTheDocument();
    expect(
      screen.getByText(/This tool uses OpenAI's API/i),
    ).toBeInTheDocument();
  });

  it("should render the job description textarea", () => {
    render(<Home />);

    const textarea = screen.getByLabelText(/Paste job description here/i);
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("placeholder");
  });

  it("should render the privacy checkbox", () => {
    render(<Home />);

    const checkbox = screen.getByRole("checkbox", {
      name: /I confirm that I have read and understood the Privacy Policy/i,
    });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it("should have the analyse button disabled when privacy checkbox is not checked", () => {
    render(<Home />);

    const textarea = screen.getByLabelText(/Paste job description here/i);
    fireEvent.change(textarea, {
      target: { value: "Software Engineer position" },
    });

    const button = screen.getByRole("button", { name: /Analyse/i });
    expect(button).toBeDisabled();
  });

  it("should enable the analyse button when privacy checkbox is checked and text is entered", () => {
    render(<Home />);

    const textarea = screen.getByLabelText(/Paste job description here/i);
    const checkbox = screen.getByRole("checkbox", {
      name: /I confirm that I have read and understood the Privacy Policy/i,
    });

    fireEvent.change(textarea, {
      target: { value: "Software Engineer position" },
    });
    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    const button = screen.getByRole("button", { name: /Analyse/i });
    expect(button).not.toBeDisabled();
  });

  it("should keep the button disabled if checkbox is checked but no text is entered", () => {
    render(<Home />);

    const checkbox = screen.getByRole("checkbox", {
      name: /I confirm that I have read and understood the Privacy Policy/i,
    });
    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    const button = screen.getByRole("button", { name: /Analyse/i });
    expect(button).toBeDisabled();
  });

  it("should update character count when text is entered", () => {
    render(<Home />);

    const textarea = screen.getByLabelText(/Paste job description here/i);
    fireEvent.change(textarea, { target: { value: "Hello" } });

    expect(screen.getByText(/5 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/✓ Ready to analyse/i)).toBeInTheDocument();
  });

  it("should show character count as 0 initially", () => {
    render(<Home />);

    expect(screen.getByText(/0 characters/i)).toBeInTheDocument();
    expect(screen.queryByText(/✓ Ready to analyse/i)).not.toBeInTheDocument();
  });

  it("should render privacy policy link in checkbox label", () => {
    render(<Home />);

    const links = screen.getAllByRole("link", { name: /Privacy Policy/i });
    expect(links.length).toBe(2);

    // Check the checkbox label link
    const checkboxLink = links.find(
      (link) => link.closest("label")?.htmlFor === "privacy-accept",
    );
    expect(checkboxLink).toHaveAttribute("href", "/privacy");
  });

  it("should call analyseJDAction when form is submitted with valid data", async () => {
    const mockResponse = {
      success: true,
      data: {
        hardSkills: ["JavaScript", "React"],
        softSkills: ["Communication"],
        resumeImprovements: ["Add more details"],
        coverLetterSnippet: "I am excited to apply...",
      },
    };

    vi.mocked(analyseJDAction).mockResolvedValue(mockResponse);

    render(<Home />);

    const textarea = screen.getByLabelText(/Paste job description here/i);
    const checkbox = screen.getByRole("checkbox", {
      name: /I confirm that I have read and understood the Privacy Policy/i,
    });
    const button = screen.getByRole("button", { name: /Analyse/i });

    fireEvent.change(textarea, {
      target: { value: "Looking for a React developer" },
    });
    fireEvent.click(checkbox);
    fireEvent.click(button);

    await waitFor(() => {
      expect(analyseJDAction).toHaveBeenCalled();
    });
  });

  it("should display results after successful analysis", async () => {
    const mockResponse = {
      success: true,
      data: {
        hardSkills: ["JavaScript", "React"],
        softSkills: ["Communication"],
        resumeImprovements: ["Add more details"],
        coverLetterSnippet: "I am excited to apply...",
      },
    };

    vi.mocked(analyseJDAction).mockResolvedValue(mockResponse);

    render(<Home />);

    const textarea = screen.getByLabelText(/Paste job description here/i);
    const checkbox = screen.getByRole("checkbox", {
      name: /I confirm that I have read and understood the Privacy Policy/i,
    });
    const button = screen.getByRole("button", { name: /Analyse/i });

    fireEvent.change(textarea, {
      target: { value: "Looking for a React developer" },
    });
    fireEvent.click(checkbox);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Analysis Results/i)).toBeInTheDocument();
      expect(screen.getByText(/Hard Skills/i)).toBeInTheDocument();
      expect(screen.getByText(/Soft Skills/i)).toBeInTheDocument();
    });
  });

  it("should display error message when analysis fails", async () => {
    const mockResponse = {
      success: false,
      error: "Analysis failed",
      data: null,
    };

    vi.mocked(analyseJDAction).mockResolvedValue(mockResponse);

    render(<Home />);

    const textarea = screen.getByLabelText(/Paste job description here/i);
    const checkbox = screen.getByRole("checkbox", {
      name: /I confirm that I have read and understood the Privacy Policy/i,
    });
    const button = screen.getByRole("button", { name: /Analyse/i });

    fireEvent.change(textarea, {
      target: { value: "Looking for a React developer" },
    });
    fireEvent.click(checkbox);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Analysis failed/i)).toBeInTheDocument();
    });
  });

  it("should show placeholder message when no analysis has been done", () => {
    render(<Home />);

    expect(
      screen.getByText(/Paste a job description above and click "Analyse"/i),
    ).toBeInTheDocument();

    const textarea = screen.getByLabelText(/Paste job description here/i);
    fireEvent.change(textarea, {
      target: { value: "Looking for a React developer" },
    });

    expect(
      screen.getByText(/Looking for a React developer/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Paste a job description above and click "Analyse"/i),
    ).toBeInTheDocument();
  });

  it("should disable button and show 'Analysing...' text while analysing", async () => {
    vi.mocked(analyseJDAction).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                success: true,
                data: {
                  hardSkills: [],
                  softSkills: [],
                  resumeImprovements: [],
                  coverLetterSnippet: "",
                },
              }),
            100,
          ),
        ),
    );

    render(<Home />);

    const textarea = screen.getByLabelText(/Paste job description here/i);
    const checkbox = screen.getByRole("checkbox", {
      name: /I confirm that I have read and understood the Privacy Policy/i,
    });

    fireEvent.change(textarea, {
      target: { value: "Looking for a React developer" },
    });
    fireEvent.click(checkbox);

    const button = screen.getByRole("button", { name: /Analyse/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Analysing\.\.\./i)).toBeInTheDocument();
      const analysingButton = screen.getByRole("button", {
        name: /Analysing\.\.\./i,
      });
      expect(analysingButton).toBeDisabled();
    });
  });

  it("should allow unchecking the privacy checkbox", () => {
    render(<Home />);

    const checkbox = screen.getByRole("checkbox", {
      name: /I confirm that I have read and understood the Privacy Policy/i,
    });

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
