import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8")
) as Record<string, unknown>;
const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
const koreanReadme = readFileSync(
  new URL("../README.ko.md", import.meta.url),
  "utf8"
);
const searchGrowthNotes = readFileSync(
  new URL("../docs/search-growth-implementation.md", import.meta.url),
  "utf8"
);
const inquiryUrl =
  "https://kim3310-doeon-kim-portfolio.pages.dev/?offer=multi-cli-pilot&inquiry=agent-reliability-audit#private-inquiry";

describe("distribution claims", () => {
  it("does not present an unpublished package as npm-installable", () => {
    expect(packageJson.private).toBe(true);
    expect(readme).not.toContain("npm install -g multi-cli-pilot");
    expect(koreanReadme).not.toContain("npm install -g multi-cli-pilot");
  });

  it("keeps search-growth lead capture on the central private inquiry route", () => {
    expect(searchGrowthNotes).toContain(inquiryUrl);
    expect(searchGrowthNotes).toContain("central private inquiry route");
    expect(searchGrowthNotes).toContain("offer=multi-cli-pilot");
    expect(searchGrowthNotes).toContain("inquiry=agent-reliability-audit");
    expect(searchGrowthNotes).not.toContain("GitHub Issue Form");
  });
});
