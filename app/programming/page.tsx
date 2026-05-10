"use client";

import { useState, useEffect, useRef, useCallback, forwardRef, memo } from "react";
import dynamic from "next/dynamic";
import styles from "./programming.module.css";
import Terminal from "./Terminal"

const MarkdownRenderer = dynamic(() => import("./MarkdownRenderer"), { ssr: false });

// ── Types ────────────────────────────────────────────────────────────────────
interface GHRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  default_branch: string;
  language: string | null;
  topics: string[];
}

interface Project {
  id: string;
  name: string;
  github: string;
  description: string;
  tags: string[];
  branch: string;
  notes?: string;
  blog?: string;
}

async function fetchRepoReadme(project: Project): Promise<string> {
  const urls = [
    `https://raw.githubusercontent.com/Jeet-Bubna/${project.id}/${project.branch}/README.md`,
    `https://raw.githubusercontent.com/Jeet-Bubna/${project.id}/main/README.md`,
    `https://raw.githubusercontent.com/Jeet-Bubna/${project.id}/master/README.md`,
  ];
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (r.ok) return await r.text();
    } catch { /* try next */ }
  }
  return "# No README\n\nThis project does not have a README yet.";
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Programming() {
  const [projects, setProjects]       = useState<Project[]>([]);
  const [reposLoading, setReposLoading] = useState(true);
  const [activeId, setActiveId]       = useState<string | null>(null);

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Fetch repos once — this state never changes again after load
  useEffect(() => {
    fetch("https://api.github.com/users/Jeet-Bubna/repos?per_page=100&sort=updated")
      .then((r) => r.json())
      .then((data: GHRepo[]) => {
        setProjects(data.map((r) => ({
          id: r.name,
          name: r.name.replace(/[-_]/g, " "),
          github: r.html_url,
          description: r.description ?? "",
          tags: [...(r.topics ?? []), r.language].filter(Boolean) as string[],
          branch: r.default_branch,
        })));
        setReposLoading(false);
      })
      .catch(() => setReposLoading(false));
  }, []);

  const handleNavigate = useCallback((id: string) => {
    const el = cardRefs.current[id];
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }, []);

  const handleActivate = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  return (
    <main className={styles.main}>

      {/* HERO */}
      <section className={styles.hero}>
        <img src="/programming-hero.png" alt="Programming" className={styles.heroBg} />
      </section>

      {/* RASPBERRY PI */}
      <section className={styles.piSection}>
        <div className={styles.piLeft}>
          <h2 className={styles.piHeading}>Sponsored by my raspberry</h2>
          <p className={styles.piBody}>
            The entire website is run and operated by me and my raspberry Pi, on my home
            network using cloudflare&apos;s dynamic routing. Read the blog over here:
          </p>i
          <p className={styles.piLink}>
            (link here – if ur seeing this please contact me as I have forgot to paste it here)
          </p>
        </div>
        <div className={styles.piRight}>
          <img src="/raspberry.jpg" alt="Raspberry Pi setup" className={styles.piImage} />
        </div>
      </section>

      {/* TERMINAL — isolated component, its input state never bubbles up */}
      <Terminal
        projects={projects}
        reposLoading={reposLoading}
        onNavigate={handleNavigate}
        onActivate={handleActivate}
      />

      {/* PROJECT CARDS */}
      <section className={styles.cardsSection}>
        <h2 className={styles.cardsSectionTitle}>/ projects</h2>
        {reposLoading && <p className={styles.loadingText}>Loading repositories…</p>}
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            active={activeId === project.id}
            ref={(el: HTMLDivElement | null) => { cardRefs.current[project.id] = el; }}
          />
        ))}
      </section>

    </main>
  );
}

// ── Project Card — memoized so active highlight doesn't re-render all cards ──
const ProjectCard = memo(forwardRef<HTMLDivElement, { project: Project; active: boolean }>(
  ({ project, active }, ref) => {
    const [readme, setReadme]               = useState<string | null>(null);
    const [readmeLoading, setReadmeLoading] = useState(true);
    const [notesOpen, setNotesOpen]         = useState(false);

    useEffect(() => {
      fetchRepoReadme(project).then((text) => {
        setReadme(text);
        setReadmeLoading(false);
      });
    }, [project]);

    return (
      <div ref={ref} className={`${styles.card} ${active ? styles.cardActive : ""}`}>

        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{project.name}</h3>
          <div className={styles.cardLinks}>
            <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
              GitHub ↗
            </a>
            {project.blog && (
              <a href={project.blog} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
                Blog ↗
              </a>
            )}
          </div>
        </div>

        {project.description && (
          <p className={styles.cardDesc}>{project.description}</p>
        )}

        {project.tags.length > 0 && (
          <div className={styles.cardTags}>
            {project.tags.map((t) => <span key={t} className={styles.cardTag}>{t}</span>)}
          </div>
        )}

        {project.notes && (
          <div className={styles.notesSection}>
            <button className={styles.notesToggle} onClick={() => setNotesOpen((o) => !o)}>
              <span>{notesOpen ? "▲" : "▼"}</span> Exploration Notes
            </button>
            {notesOpen && (
              <div className={styles.notesBody}>
                <p className={styles.notesText}>{project.notes}</p>
              </div>
            )}
          </div>
        )}

        <div className={styles.readmeSection}>
          <div className={styles.readmeHeader}>
            <span className={styles.readmeLabel}>README.md</span>
          </div>
          <div className={styles.readmeBody}>
            {readmeLoading
              ? <span className={styles.readmeLoading}>Fetching README…</span>
              : readme
                ? <MarkdownRenderer content={readme} />
                : null
            }
          </div>  
        </div>
      </div>
    );
  }
));
ProjectCard.displayName = "ProjectCard";