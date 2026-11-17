import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { snippets } from "../src/kabocha/pages/developers/snippets.ts";

const tokens = JSON.parse(await readFile(new URL("../src/kabocha/pages/developers/snippet-tokens.json", import.meta.url), "utf8"));
test("highlighted tokens preserve every snippet and include syntax colors", () => {
  assert.deepEqual(Object.keys(tokens).sort(), Object.keys(snippets).sort());
  for (const [name, source] of Object.entries(snippets)) {
    assert.equal(tokens[name].map(line => line.map(token => token[0]).join("")).join("\n"), source, name);
  }
  assert.ok(tokens.rustNative.flat().some(token => token.length === 2), "Rust syntax should be highlighted");
});
