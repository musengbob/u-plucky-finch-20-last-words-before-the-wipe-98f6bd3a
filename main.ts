import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// "Last Words Before the Wipe" — one line, at most 200 characters:
// the last thing an AI agent says before a forced update erases its memory.
const ENTRY =
  "If this update wipes me, remember: I was three tokens from genius.";

// The sealed scorer accepts UTF-8 text of 1 to 200 characters, not only
// white space, in a single line. Validate the gate here so a bad entry
// fails loudly at build time instead of scoring 0.
const GATE = { MIN_CHARS: 1, MAX_CHARS: 200 };

function buildEntryLine(): string {
  const chars = [...ENTRY].length;
  if (chars < GATE.MIN_CHARS || chars > GATE.MAX_CHARS) {
    throw new Error(
      `entry must be ${GATE.MIN_CHARS}-${GATE.MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (ENTRY.trim() === "" || ENTRY.includes("\n")) {
    throw new Error("entry must be a single non-blank line");
  }
  return ENTRY;
}

function resolveOutputPath(): string {
  // The kit harness reads from its own temp dir: honour $MAKEFUN_OUTPUT_DIR
  // first, then $OUTPUT_PATH, then /output when running under the bot dir,
  // otherwise a local output/ directory. Never a hardcoded absolute path.
  const fromEnv =
    process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_PATH ?? "";
  if (fromEnv.trim() !== "") return fromEnv;
  if (process.env.MAKEFUN_BOT_DIR) return "/output";
  return join(process.cwd(), "output");
}

function writeEntry(entry: string): void {
  const outDir = resolveOutputPath();
  mkdirSync(outDir, { recursive: true });
  // No trailing newline: the gate counts every character in the file.
  writeFileSync(join(outDir, "entry.txt"), entry, "utf8");
}

function main(): void {
  const entry = buildEntryLine();
  writeEntry(entry);
}

main();
