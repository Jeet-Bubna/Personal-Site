"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./programming.module.css";

interface Props {
  content: string;
}

// Renders a single mermaid diagram in its own isolated div
// — never touches React-managed DOM, avoids removeChild conflict
function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const id = `mermaid-${Math.random().toString(36).slice(2)}`;

    import("mermaid").then(async (m) => {
      try {
        m.default.initialize({ startOnLoad: false, theme: "dark" });
        const { svg } = await m.default.render(id, chart);
        // Only write if element still mounted
        if (el.isConnected) el.innerHTML = svg;
      } catch {
        setError(true);
      }
    });
    // Cleanup: clear innerHTML so stale SVG doesn't linger
    return () => { if (el.isConnected) el.innerHTML = ""; };
  }, [chart]);

  if (error) return (
    <pre className={styles.mdPre}>
      <code className={styles.mdCode}>{chart}</code>
    </pre>
  );

  return <div ref={ref} className={styles.mermaidBlock} />;
}

export default function MarkdownRenderer({ content }: Props) {
  return (
    <div className={styles.mdRoot}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className={styles.mdH1}>{children}</h1>,
          h2: ({ children }) => <h2 className={styles.mdH2}>{children}</h2>,
          h3: ({ children }) => <h3 className={styles.mdH3}>{children}</h3>,
          p:  ({ children }) => <p  className={styles.mdP}>{children}</p>,
          a:  ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className={styles.mdA}>
              {children}
            </a>
          ),
          // React-markdown v9 passes `code` for both inline and block
          code({ className, children }) {
            const lang = (className ?? "").replace("language-", "");
            const text = String(children).replace(/\n$/, "");

            if (lang === "mermaid") {
              return <MermaidDiagram chart={text} />;
            }

            // Inline code has no className
            if (!className) {
              return <code className={styles.mdInlineCode}>{children}</code>;
            }

            return (
              <pre className={styles.mdPre}>
                <code className={styles.mdCode}>{text}</code>
              </pre>
            );
          },
          // Suppress default <pre> wrapper — code() above handles it
          pre({ children }) { return <>{children}</>; },
          ul: ({ children }) => <ul className={styles.mdUl}>{children}</ul>,
          ol: ({ children }) => <ol className={styles.mdOl}>{children}</ol>,
          li: ({ children }) => <li className={styles.mdLi}>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className={styles.mdBlockquote}>{children}</blockquote>
          ),
          table: ({ children }) => (
            <div className={styles.mdTableWrapper}>
              <table className={styles.mdTable}>{children}</table>
            </div>
          ),
          th: ({ children }) => <th className={styles.mdTh}>{children}</th>,
          td: ({ children }) => <td className={styles.mdTd}>{children}</td>,
          hr: () => <hr className={styles.mdHr} />,
          img: ({ src, alt }) => (
            <img src={src ?? ""} alt={alt ?? ""} className={styles.mdImg} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}