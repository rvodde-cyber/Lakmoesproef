import { describe, expect, it } from "vitest";
import { questions } from "../data/questions";
import { calculateLitmus, calculateScore, getLowScoringQuestionEntries, LOW_SCORE_MAX_ON_SCALE_5 } from "./assessment";

describe("calculateScore", () => {
  it("returns 0 when not all questions answered", () => {
    const score = calculateScore({ 1: 5, 2: 4 }, 21);
    expect(score).toBe(0);
  });

  it("returns full score for all 5 answers", () => {
    const answers = Object.fromEntries(Array.from({ length: 21 }, (_, i) => [i + 1, 5]));
    const score = calculateScore(answers, 21);
    expect(score).toBe(100);
  });
});

describe("getLowScoringQuestionEntries", () => {
  it("lists questions at or below the low-score threshold", () => {
    const answers = Object.fromEntries(questions.map((q) => [q.id, q.id <= 3 ? 2 : 5])) as Record<number, number>;
    const low = getLowScoringQuestionEntries(answers, questions);
    expect(low.length).toBeGreaterThan(0);
    expect(low.every((x) => x.value <= LOW_SCORE_MAX_ON_SCALE_5)).toBe(true);
  });
});

describe("calculateLitmus", () => {
  it("uses neutral color before answers", () => {
    const result = calculateLitmus({}, 0, 21);
    expect(result.liquidColor).toContain("hsl");
    expect(result.fillRatio).toBe(0);
  });

  it("gets redder when low answers (1-2) increase", () => {
    const mostlyHigh = calculateLitmus({ 1: 5, 2: 4, 3: 3, 4: 5 }, 4, 21);
    const manyLow = calculateLitmus({ 1: 1, 2: 2, 3: 1, 4: 5 }, 4, 21);
    expect(mostlyHigh.liquidColor).not.toEqual(manyLow.liquidColor);
    expect(manyLow.statusLabel).toContain("1 of 2");
  });
});
