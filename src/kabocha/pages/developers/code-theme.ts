import type { ThemeRegistration } from "shiki";

export const CODE_THEME_NAME = "kabocha";
export const CODE_FOREGROUND = "#f0f0f0";

export const kabochaCodeTheme: ThemeRegistration = {
  name: CODE_THEME_NAME,
  type: "dark",
  fg: CODE_FOREGROUND,
  bg: "#0d0d0d",
  settings: [
    { settings: { foreground: CODE_FOREGROUND, background: "#0d0d0d" } },
    {
      scope: ["comment", "punctuation.definition.comment", "string.comment"],
      settings: { foreground: "#7d7d7d" },
    },
    {
      scope: [
        "keyword",
        "storage",
        "storage.type",
        "storage.modifier",
        "keyword.control",
        "keyword.operator.new",
        "keyword.other",
        "variable.language",
      ],
      settings: { foreground: "#00c853" },
    },
    {
      scope: ["string", "string.quoted", "string.unquoted", "punctuation.definition.string"],
      settings: { foreground: "#a8e6b0" },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.character.escape", "constant.other"],
      settings: { foreground: "#ffd93d" },
    },
    {
      scope: [
        "entity.name.type",
        "entity.name.class",
        "entity.name.struct",
        "entity.name.enum",
        "entity.name.namespace",
        "support.class",
        "support.type",
      ],
      settings: { foreground: "#7ee0a0" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call.generic",
        "entity.name.function.macro",
        "entity.name.command",
        "support.function.builtin",
      ],
      settings: { foreground: "#8ab4ff" },
    },
    {
      scope: ["support.type.property-name", "entity.name.tag", "entity.other.attribute-name", "meta.object-literal.key"],
      settings: { foreground: "#a5d6a7" },
    },
    {
      scope: ["punctuation", "meta.brace", "keyword.operator"],
      settings: { foreground: "#b8b8b8" },
    },
  ],
};
