import { useState, useEffect } from 'react';
import { loadProgress, type ProgressStore } from '../lib/progress';
import { TOPIC_META } from '../lib/topics';
import { withBase } from '../lib/paths';

export default function TopicGrid() {
  const [progress, setProgress] = useState<ProgressStore>({});

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
      {(Object.entries(TOPIC_META) as [string, { label: string; examWeight: string }][]).map(([slug, meta]) => {
        const tp      = progress[slug];
        const done    = tp?.completed ?? false;
        const lastPct = done && tp.lastScore !== null && tp.lastTotal !== null
          ? Math.round((tp.lastScore! / tp.lastTotal!) * 100)
          : null;
        const passed  = lastPct !== null && lastPct >= 60;

        return (
          <a
            key={slug}
            href={withBase(`/topics/${slug}`)}
            className="topic-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.875rem',
              background: 'var(--color-surface-elevated)',
              border: `1px solid ${done ? 'rgba(201,151,74,0.2)' : 'rgba(201,151,74,0.1)'}`,
              borderRadius: '0.5rem',
              padding: '1.5rem',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-card)',
              minHeight: '6rem',
            }}
          >
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                lineHeight: 1.3,
                marginBottom: '0.4rem',
              }}>
                {meta.label}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--color-brand-500)',
                fontWeight: 500,
                letterSpacing: '0.04em',
              }}>
                {meta.examWeight} of exam
              </div>
            </div>

            {/* Progress footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {lastPct !== null ? (
                <>
                  {/* Inline score bar */}
                  <div style={{ flex: 1, height: '3px', background: 'var(--color-surface-base)', borderRadius: '2px', marginRight: '0.75rem', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${lastPct}%`,
                      background: passed
                        ? 'linear-gradient(to right, rgba(74,222,128,0.5), #4ade80)'
                        : 'linear-gradient(to right, rgba(248,113,113,0.5), #f87171)',
                      borderRadius: '2px',
                    }} />
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: passed ? '#4ade80' : '#f87171',
                    flexShrink: 0,
                  }}>
                    {lastPct}%
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', letterSpacing: '0.04em' }}>
                  Not attempted
                </span>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
}
