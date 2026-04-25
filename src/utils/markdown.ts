/**
 * Markdown frontmatter parser for prompt and workflow files.
 *
 * Splits a markdown document into its YAML frontmatter (between --- delimiters)
 * and the remaining body content.
 *
 * @module utils/markdown
 */

import YAML from "yaml";

export interface ParsedMarkdown<T = Record<string, unknown>> {
  frontmatter: T;
  body: string;
}

/**
 * Parse a markdown file with YAML frontmatter.
 * Expects the format:
 * ---
 * key: value
 * ---
 * # Body content
 */
export function parseMarkdownWithFrontmatter<T = Record<string, unknown>>(
  content: string,
): ParsedMarkdown<T> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return {
      frontmatter: {} as T,
      body: content.trim(),
    };
  }

  const [, yamlStr, body] = match;
  let frontmatter: T;
  try {
    frontmatter = YAML.parse(yamlStr ?? "") as T;
  } catch {
    frontmatter = {} as T;
  }

  return {
    frontmatter,
    body: body?.trim(),
  };
}
