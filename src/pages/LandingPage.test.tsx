import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LandingPage } from "./LandingPage";

describe("LandingPage", () => {
  it("toont titel, ondertitel en Start-link naar /keuze", () => {
    render(<LandingPage />);

    expect(screen.getByRole("heading", { level: 1, name: "De Morele Lakmoesproef" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "Meet hoe de medewerkers van uw organisatie de ethische cultuur ervaren in ongeveer 10 minuten.",
      ),
    ).toBeInTheDocument();
    const start = screen.getByRole("link", { name: /Start/i });
    expect(start).toHaveAttribute("href", "/keuze");
    expect(document.title).toBe("De Morele Lakmoesproef");
  });
});
