"use client";

import { useState, useRef, useCallback, useEffect, memo } from "react";
import styles from "./programming.module.css";

interface Project {
  id: string;
  name: string;
}

interface TerminalLine {
  type: "input" | "output" | "error" | "system";
  text: string;
}

interface Props {
  projects: Project[];
  reposLoading: boolean;
  onNavigate: (id: string) => void;
  onActivate: (id: string) => void;
}

const HELP_LINES = [
  "  ls              — list all projects",
  "  cd <id>         — scroll to & highlight a project",
  "  cat readme      — show README of last cd'd project",
  "  help            — show this message",
  "  clear           — clear terminal",
];

async function fetchReadmePreview(id: string, branch: string): Promise<string> {
  const urls = [
    `https://raw.githubusercontent.com/Jeet-Bubna/${id}/${branch}/README.md`,
    `https://raw.githubusercontent.com/Jeet-Bubna/${id}/main/README.md`,
    `https://raw.githubusercontent.com/Jeet-Bubna/${id}/master/README.md`,
  ];
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (r.ok) return await r.text();
    } catch { /* try next */ }
  }
  return "No README found.";
}

function Terminal({ projects, reposLoading, onNavigate, onActivate }: Props) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "system", text: "Jeet-Bubna@pi:~ $ boot sequence complete." },
    { type: "system", text: "Fetching repositories from GitHub..." },
    { type: "system", text: "" },
  ]);
  const [input, setInput]           = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx]       = useState(-1);
  const [focused, setFocused]       = useState(false);
  const [activeId, setActiveId]     = useState<string | null>(null);
  const [activeBranch, setActiveBranch] = useState("main");

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef  = useRef<HTMLDivElement>(null);

  // Notify parent when repos load so terminal can update its prompt
  useEffect(() => {
    if (!reposLoading && projects.length > 0) {
      setLines((l) => [
        ...l,
        { type: "system", text: `Loaded ${projects.length} repositories. Type 'help' or 'ls'.` },
        { type: "system", text: "" },
      ]);
    }
  }, [reposLoading, projects.length]);

  // Auto-scroll
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  const push = useCallback((...newLines: TerminalLine[]) => {
    setLines((l) => [...l, ...newLines]);
  }, []);

  const runCommand = useCallback(async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    setCmdHistory((h) => [cmd, ...h]);
    setHistIdx(-1);
    push({ type: "input", text: `Jeet-Bubna@pi:~ $ ${cmd}` });

    const parts = cmd.split(/\s+/);
    const verb  = parts[0].toLowerCase();

    if (verb === "clear") { setLines([]); return; }

    if (verb === "help") {
      push(
        { type: "output", text: "Commands:" },
        ...HELP_LINES.map((t) => ({ type: "output" as const, text: t })),
        { type: "output", text: "" }
      );
      return;
    }

    if (verb === "ls") {
      if (reposLoading) { push({ type: "output", text: "Still loading..." }); return; }
      push(
        { type: "output", text: `${projects.length} projects:` },
        ...projects.map((p) => ({ type: "output" as const, text: `  · ${p.id}` })),
        { type: "output", text: "" }
      );
      return;
    }

    if (verb === "cd") {
      const query = parts.slice(1).join(" ").toLowerCase();
      const project = projects.find(
        (p) => p.id.toLowerCase() === query || p.name.toLowerCase() === query
      );
      if (!project) {
        push({ type: "error", text: `cd: no such project: '${parts.slice(1).join(" ")}'. Try 'ls'.` });
        return;
      }
      setActiveId(project.id);
      onActivate(project.id);
      onNavigate(project.id);
      push(
        { type: "output", text: `→ ${project.name}` },
        { type: "output", text: "" }
      );
      return;
    }

    if (verb === "cat" && parts[1]?.toLowerCase() === "readme") {
      if (!activeId) {
        push({ type: "error", text: "No project selected. Use 'cd <id>' first." });
        return;
      }
      push({ type: "output", text: `Reading ${activeId}/README.md…` });
      const text = await fetchReadmePreview(activeId, activeBranch);
      const preview = text.split("\n").slice(0, 30);
      push(
        { type: "output", text: "─".repeat(50) },
        ...preview.map((t) => ({ type: "output" as const, text: t })),
        ...(text.split("\n").length > 30
          ? [{ type: "output" as const, text: "… (see full README in the card below)" }]
          : []),
        { type: "output", text: "─".repeat(50) },
        { type: "output", text: "" }
      );
      return;
    }

    push({ type: "error", text: `command not found: ${verb}. Type 'help'.` });
  }, [projects, reposLoading, activeId, activeBranch, onActivate, onNavigate, push]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(next);
      setInput(cmdHistory[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : cmdHistory[next]);
    }
  };

  return (
    <section className={styles.terminalSection}>
      <img src="/terminal-bg.png" alt="" className={styles.terminalBg} />
      <div className={styles.terminalOverlay} />
      <div className={styles.terminalWindow} onClick={() => inputRef.current?.focus()}>

        <div className={styles.terminalBar}>
          <span className={styles.terminalTab}>Command Prompt</span>
          <span className={styles.terminalTabInactive} />
          <div className={styles.terminalControls}>
            <span className={styles.terminalBtn}>─</span>
            <span className={styles.terminalBtn}>□</span>
            <span className={styles.terminalBtnClose}>✕</span>
          </div>
        </div>

        <div className={styles.terminalBody} ref={bodyRef}>
          {lines.map((line, i) => (
            <div key={i} className={`${styles.terminalLine} ${styles[`line-${line.type}`]}`}>
              {line.text || "\u00a0"}
            </div>
          ))}

          <div className={styles.inputRow}>
            <span className={styles.prompt}>Jeet-Bubna@pi:~ $&nbsp;</span>
            <div className={styles.inputWrapper}>
              {/* hidden sizer mirrors the input value so the box grows with content */}
              <span className={styles.inputSizer} aria-hidden="true">
                {input || " "}
              </span>
              <input
                ref={inputRef}
                className={styles.terminalInput}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
              <span className={`${styles.terminalCursor} ${focused ? styles.cursorActive : ""}`}>█</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(Terminal);