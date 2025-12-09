import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";

describe("Footer", () => {
  it("renders all navigation links", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /contact/i })).toBeInTheDocument();
  });

  it("links point to the correct hrefs", () => {
    render(<Footer />);

    const about = screen.getByRole("link", { name: /about/i });
    const github = screen.getByRole("link", { name: /github/i });
    const contact = screen.getByRole("link", { name: /contact/i });

    expect(about).toHaveAttribute("href", "/about");
    expect(github).toHaveAttribute("href", "https://github.com/honhaoz");
    expect(contact).toHaveAttribute("href", "/contact");
  });

  it("renders separators between links on larger screens (markup present)", () => {
    render(<Footer />);
    const separators = screen.getAllByText("|");
    expect(separators.length).toBe(2);
  });

  it("does not set target on external link (current behavior)", () => {
    render(<Footer />);
    const github = screen.getByRole("link", { name: /github/i });
    expect(github).not.toHaveAttribute("target");
  });
});
