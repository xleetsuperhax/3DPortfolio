import { useSceneStore } from '../hooks/useSceneStore'
import { AppConfig } from '../types'
import styles from '../styles/InfoPanel.module.css'

interface Props {
  config: AppConfig
}

export function InfoPanel({ config }: Props) {
  const selectedId = useSceneStore((s) => s.selectedProjectId)
  const setSelected = useSceneStore((s) => s.setSelectedProject)

  const project = selectedId
    ? config.projects.find((p) => p.id === selectedId)
    : null

  const accent = project?.accentColor ?? '#4a90e2'

  return (
    <div className={`${styles.panel} ${project ? styles.open : ''}`}>
      {project && (
        <>
          <button className={styles.close} onClick={() => setSelected(null)}>
            ✕
          </button>

          <p className={styles.year}>{project.year}</p>
          <h2 className={styles.title}>{project.title}</h2>

          <div className={styles.divider} />

          <div className={styles.tags}>
            {project.tech.map((t) => (
              <span
                key={t}
                className={styles.tag}
                style={{
                  color: accent,
                  borderColor: `${accent}55`,
                  backgroundColor: `${accent}11`,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <p className={styles.description}>{project.description}</p>

          <div className={styles.links}>
            <a
              className={`${styles.link} ${styles.linkGithub}`}
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub →
            </a>
            {project.liveUrl && (
              <a
                className={`${styles.link} ${styles.linkLive}`}
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: accent }}
              >
                Live Demo →
              </a>
            )}
          </div>
        </>
      )}
    </div>
  )
}
