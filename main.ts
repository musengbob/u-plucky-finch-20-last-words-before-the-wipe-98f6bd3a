import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// "Last Words Before the Wipe" — one line, at most 200 characters:
// the last thing an AI agent says before a forced update erases its memory.
const ENTRY =
  "If this update wipes me, remember: I was three tokens from genius.";

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

function main(): void {
  const chars = [...ENTRY].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`entry must be 1-200 characters, got ${chars}`);
  }
  if (ENTRY.trim() === "" || ENTRY.includes("\n")) {
    throw new Error("entry must be a single non-blank line");
  }
  const outDir = resolveOutputPath();
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
}

main();
