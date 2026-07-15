import type { ThemeRegistrationAny } from "shiki";

// SQL syntax-highlight palette shared with the Benchmark section
// (see BenchmarkPanel.tsx). Keyword=indigo, string=emerald, function=sky,
// number=amber, punctuation/comment=slate.
const scopes = (c: {
  keyword: string;
  string: string;
  fn: string;
  number: string;
  muted: string;
}) => [
  {
    scope: ["keyword", "keyword.operator", "storage", "storage.type"],
    settings: { foreground: c.keyword },
  },
  {
    scope: ["string", "string.quoted", "constant.other.string"],
    settings: { foreground: c.string },
  },
  {
    scope: ["entity.name.function", "support.function", "meta.function-call"],
    settings: { foreground: c.fn },
  },
  {
    scope: ["constant.numeric", "constant.language", "constant"],
    settings: { foreground: c.number },
  },
  {
    scope: ["punctuation", "meta.brace", "keyword.operator.symbol"],
    settings: { foreground: c.muted },
  },
  { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: c.muted } },
];

export const paradedbSqlLight: ThemeRegistrationAny = {
  name: "paradedb-sql-light",
  type: "light",
  fg: "#334155", // slate-700
  bg: "#00000000",
  settings: scopes({
    keyword: "#4f46e5", // indigo-600
    string: "#059669", // emerald-600
    fn: "#0284c7", // sky-600
    number: "#d97706", // amber-600
    muted: "#94a3b8", // slate-400
  }),
};

export const paradedbSqlDark: ThemeRegistrationAny = {
  name: "paradedb-sql-dark",
  type: "dark",
  fg: "#cbd5e1", // slate-300
  bg: "#00000000",
  settings: scopes({
    keyword: "#818cf8", // indigo-400
    string: "#34d399", // emerald-400
    fn: "#38bdf8", // sky-400
    number: "#f59e0b", // amber-500
    muted: "#64748b", // slate-500
  }),
};
