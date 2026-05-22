import { describe, expect, it } from "vitest";
import {
  assembleNoteToMarkdown,
  parseNoteFromMarkdown,
  OBSIDIAN_ONLY_META_KEYS
} from "./noteDocument.js";
import { readTagsFromMeta, patchMetaRecord } from "./meta.js";

describe("parseNoteFromMarkdown / assembleNoteToMarkdown", () => {
  it("round-trip avec tags et kanban", () => {
    const raw = `---
status: en cours
kanban_order: 0
tags:
  - Robin
---
# Titre

Corps de la note.
`;
    const parsed = parseNoteFromMarkdown(raw);
    expect(parsed.body).toContain("# Titre");
    expect(parsed.body).not.toMatch(/^---/m);
    expect(parsed.meta.status).toBe("en cours");
    expect(parsed.meta.kanban_order).toBe(0);
    expect(readTagsFromMeta(parsed.meta)).toEqual(["Robin"]);

    const assembled = assembleNoteToMarkdown(parsed.body, parsed.meta);
    const again = parseNoteFromMarkdown(assembled);
    expect(again.meta.status).toBe("en cours");
    expect(readTagsFromMeta(again.meta)).toEqual(["Robin"]);
    expect(again.body.trim()).toBe(parsed.body.trim());
  });

  it("exclut markpadShare du meta collab", () => {
    const raw = `---
markpadShare:
  roomId: abc
status: todo
---
Body
`;
    const parsed = parseNoteFromMarkdown(raw);
    expect(parsed.meta.markpadShare).toBeUndefined();
    expect(parsed.meta.status).toBe("todo");
    expect(OBSIDIAN_ONLY_META_KEYS.has("markpadShare")).toBe(true);
  });

  it("note sans frontmatter", () => {
    const parsed = parseNoteFromMarkdown("Just text\n");
    expect(parsed.meta).toEqual({});
    expect(parsed.body).toBe("Just text\n");
  });
});

describe("patchMetaRecord", () => {
  it("met à jour status et tags", () => {
    const next = patchMetaRecord(
      { status: "a", tags: ["x"] },
      { status: "b", tags: ["y", "z"], old: undefined }
    );
    expect(next.status).toBe("b");
    expect(next.tags).toEqual(["y", "z"]);
    expect(next.old).toBeUndefined();
  });
});
