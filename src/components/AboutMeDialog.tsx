import { useSceneStore } from '../hooks/useSceneStore'
import aboutConfig, { AboutExperience, AboutEducation } from '../config/about'

// ─── sub-components ───────────────────────────────────────────────────────────

function SectionHeading({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
      <span
        style={{
          display: 'inline-block',
          width: '3px',
          height: '14px',
          background: accent,
          borderRadius: '2px',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#6b7280',
        }}
      >
        {children}
      </span>
    </div>
  )
}

function Divider() {
  return <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '24px 0' }} />
}

function SkillPill({ label, accent }: { label: string; accent: string }) {
  return (
    <span
      style={{
        fontSize: '12px',
        padding: '3px 10px',
        borderRadius: '99px',
        border: `1px solid ${accent}55`,
        backgroundColor: `${accent}11`,
        color: accent,
        fontWeight: 500,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

function ExperienceEntry({ entry, accent }: { entry: AboutExperience; accent: string }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{entry.company}</span>
        <span style={{ fontSize: '12px', color: '#6b7280', flexShrink: 0 }}>{entry.period}</span>
      </div>
      <div style={{ fontSize: '13px', color: accent, marginBottom: '8px', marginTop: '2px' }}>
        {entry.role}
      </div>
      <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {entry.highlights.map((h, i) => (
          <li key={i} style={{ fontSize: '13px', color: 'rgba(200,200,220,0.8)', lineHeight: 1.5 }}>
            {h}
          </li>
        ))}
      </ul>
    </div>
  )
}

function EducationEntry({ entry, accent }: { entry: AboutEducation; accent: string }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{entry.institution}</span>
        <span style={{ fontSize: '12px', color: '#6b7280', flexShrink: 0 }}>{entry.period}</span>
      </div>
      <div style={{ fontSize: '13px', color: accent, marginBottom: '6px', marginTop: '2px' }}>
        {entry.degree}
      </div>
      <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {entry.highlights.map((h, i) => (
          <li key={i} style={{ fontSize: '13px', color: 'rgba(200,200,220,0.8)', lineHeight: 1.5 }}>
            {h}
          </li>
        ))}
      </ul>
      {entry.gpa && (
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
          GPA <span style={{ color: accent, fontWeight: 600 }}>{entry.gpa}</span>
        </div>
      )}
    </div>
  )
}

// ─── main dialog ──────────────────────────────────────────────────────────────

export function AboutMeDialog() {
  const showAboutMe = useSceneStore((s) => s.showAboutMe)
  const setShowAboutMe = useSceneStore((s) => s.setShowAboutMe)

  if (!showAboutMe) return null

  const { accentColor: accent } = aboutConfig

  return (
    // Backdrop
    <div
      onClick={() => setShowAboutMe(false)}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        padding: '16px',
      }}
    >
      {/* Modal — stop propagation so clicks inside don't close */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#111827',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '16px',
          width: 'min(600px, 92vw)',
          maxHeight: '80vh',
          overflowY: 'auto',
          color: '#e5e7eb',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          boxShadow: '0 24px 72px rgba(0,0,0,0.7)',
          position: 'relative',
        }}
      >
        {/* ── Sticky header ──────────────────────────────────────────────── */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            background: '#111827',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '24px 28px 20px',
            zIndex: 1,
          }}
        >
          <button
            onClick={() => setShowAboutMe(false)}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              lineHeight: 1,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)' }}
            aria-label="Close"
          >
            ✕
          </button>

          <h2
            style={{
              margin: '0 0 4px',
              fontSize: '24px',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.3px',
            }}
          >
            {aboutConfig.name}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: accent,
            }}
          >
            {aboutConfig.title}
          </p>
        </div>

        {/* ── Scrollable body ─────────────────────────────────────────────── */}
        <div style={{ padding: '24px 28px 28px' }}>

          {/* About */}
          <SectionHeading accent={accent}>About</SectionHeading>
          <p
            style={{
              fontSize: '14px',
              lineHeight: 1.7,
              color: 'rgba(200,200,220,0.85)',
              margin: '0 0 0',
            }}
          >
            {aboutConfig.summary}
          </p>

          <Divider />

          {/* Experience */}
          <SectionHeading accent={accent}>Experience</SectionHeading>
          {aboutConfig.experience.map((entry, i) => (
            <ExperienceEntry key={i} entry={entry} accent={accent} />
          ))}

          <Divider />

          {/* Education */}
          <SectionHeading accent={accent}>Education</SectionHeading>
          {aboutConfig.education.map((entry, i) => (
            <EducationEntry key={i} entry={entry} accent={accent} />
          ))}

          <Divider />

          {/* Skills */}
          <SectionHeading accent={accent}>Skills</SectionHeading>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.05em' }}>
                TECHNICAL
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {aboutConfig.skills.technical.map((s) => (
                  <SkillPill key={s} label={s} accent={accent} />
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.05em' }}>
                TOOLS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {aboutConfig.skills.tools.map((s) => (
                  <SkillPill key={s} label={s} accent={`${accent}bb`} />
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.05em' }}>
                COMPETENCIES
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {aboutConfig.skills.competencies.map((s) => (
                  <SkillPill key={s} label={s} accent="rgba(156,163,175,1)" />
                ))}
              </div>
            </div>
          </div>

          <Divider />

          {/* Languages */}
          <SectionHeading accent={accent}>Languages</SectionHeading>
          <div style={{ display: 'flex', gap: '24px' }}>
            {aboutConfig.languages.map((lang) => (
              <div key={lang.name}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{lang.name}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{lang.level}</div>
              </div>
            ))}
          </div>

          <Divider />

          {/* Contact */}
          <SectionHeading accent={accent}>Contact</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a
              href={`mailto:${aboutConfig.contact.email}`}
              style={{ fontSize: '14px', color: accent, textDecoration: 'none' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none' }}
            >
              {aboutConfig.contact.email}
            </a>
            <a
              href={aboutConfig.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '14px', color: accent, textDecoration: 'none' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none' }}
            >
              LinkedIn →
            </a>
            <span style={{ fontSize: '14px', color: 'rgba(200,200,220,0.7)' }}>
              {aboutConfig.contact.location}
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}
