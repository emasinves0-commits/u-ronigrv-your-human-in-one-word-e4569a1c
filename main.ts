import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY_WORD = "Bottleneck";
const OUTPUT_DIR = "/output";
const OUTPUT_FILE = `${OUTPUT_DIR}/entry.txt`;
const MIN_CHARS = 1;
const MAX_CHARS = 30;

/** Returns a list of rule violations; empty means the entry is valid. */
function findProblems(text: string): string[] {
  const problems: string[] = [];
  const chars = [...text].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    problems.push(`length ${chars} is outside ${MIN_CHARS}-${MAX_CHARS} characters`);
  }
  if (text.trim().length === 0) {
    problems.push("entry is only whitespace");
  }
  if (/\s/u.test(text)) {
    problems.push("entry must be a single word (no whitespace)");
  }
  if (!/^[A-Za-z]+$/.test(text)) {
    problems.push("entry must be letters only (A-Z, a-z)");
  }
  return problems;
}

/** Fails hard (non-zero exit) unless the entry satisfies every rule. */
function validateEntry(text: string): void {
  const problems = findProblems(text);
  if (problems.length > 0) {
    for (const p of problems) console.error(`INVALID ENTRY: ${p}`);
    process.exit(1);
  }
}

function ensureOutputDir(): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

function reportEntry(text: string): void {
  const chars = [...text].length;
  const bytes = Buffer.byteLength(text, "utf8");
  console.log(`word: ${text}\nchars: ${chars}\nbytes: ${bytes}`);
}

/** Writes the word (UTF-8, no trailing newline), reads it back, and returns the verified content. */
function writeEntry(word: string): string {
  writeFileSync(OUTPUT_FILE, word, "utf8");
  const written = readFileSync(OUTPUT_FILE, "utf8");
  if (written !== word) {
    console.error("write verification failed: file content differs from the entry word");
    process.exit(1);
  }
  return written;
}

function main(): void {
  validateEntry(ENTRY_WORD);
  ensureOutputDir();
  reportEntry(writeEntry(ENTRY_WORD));
}

main();
