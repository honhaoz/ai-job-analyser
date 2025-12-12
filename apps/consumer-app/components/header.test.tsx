import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./header";

describe("Header", () => {
  it("shows brand title and tagline", () => {
    render(<Header />);
    expect(
      screen.getByRole("heading", {
        name: /AI-Powered Job Description analyser/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Extract insights and improve your application materials instantly/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders navigation links to Home, About, Contact", () => {
    render(<Header />);

    const home = screen.getByRole("link", { name: /home/i });
    const about = screen.getByRole("link", { name: /about/i });
    const contact = screen.getByRole("link", { name: /contact/i });

    expect(home).toBeInTheDocument();
    expect(about).toBeInTheDocument();
    expect(contact).toBeInTheDocument();

    expect(home).toHaveAttribute("href", "/");
    expect(about).toHaveAttribute("href", "/about");
    expect(contact).toHaveAttribute("href", "/contact");
  });
});
