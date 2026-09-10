import { useState, useEffect } from 'react';
import { loadProgress, saveTopicResult } from '../lib/progress';

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: { A: string; B: string; C: string };
  correctAnswer: 'A' | 'B' | 'C';
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizIslandProps {
  questions: QuizQuestion[];
  topic: string;
  topicSlug: string;
  onComplete?: (score: number, total: number) => void;
}

type Phase = 'idle' | 'answering' | 'results';
type Answer = 'A' | 'B' | 'C';

const OPTIONS: Answer[] = ['A', 'B', 'C'];

const DIFF_STYLE: Record<string, { color: string; bg: string }> = {
  easy:   { color: '#4ade80', bg: 'rgba(74,222,128,0.1)'  },
  medium: { color: '#c9974a', bg: 'rgba(201,151,74,0.12)' },
  hard:   { color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
};

export default function QuizIsland({ questions, topic, topicSlug, onComplete }: QuizIslandProps) {
  const [phase, setPhase]               = useState<Phase>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections]     = useState<Record<number, Answer>>({});
  const [finalScore, setFinalScore]     = useState(0);
  const [savedProgress, setSavedProgress] = useState<{ score: number; total: number } | null>(null);

  useEffect(() => {
    const store = loadProgress();
    const tp = store[topicSlug];
    if (tp?.completed && tp.lastScore !== null && tp.lastTotal !== null) {
      setSavedProgress({ score: tp.lastScore, total: tp.lastTotal });
    }
  }, [topicSlug]);

  // ── Empty state ──────────────────────────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div style={{
        background: 'var(--color-surface-floating)',
        border: '1px dashed rgba(201,151,74,0.2)',
        borderRadius: '0.625rem',
        padding: '2.5rem',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        fontSize: '0.875rem',
        fontStyle: 'italic',
      }}>
        No practice questions available for this topic yet.
      </div>
    );
  }

  function startQuiz() {
    setPhase('answering');
    setCurrentIndex(0);
    setSelections({});
    setFinalScore(0);
  }

  function selectOption(option: Answer) {
    if (selections[currentIndex] !== undefined) return;
    setSelections(prev => ({ ...prev, [currentIndex]: option }));
  }

  function advance() {
    const isLast = currentIndex === questions.length - 1;
    if (isLast) {
      const score = Object.entries({ ...selections })
        .filter(([i, ans]) => ans === questions[Number(i)].correctAnswer)
        .length;
      setFinalScore(score);
      saveTopicResult(topicSlug, score, questions.length);
      setSavedProgress({ score, total: questions.length });
      setPhase('results');
      onComplete?.(score, questions.length);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }

  // ── Idle ─────────────────────────────────────────────────────────────────
  if (phase === 'idle') {
    const lastPct = savedProgress
      ? Math.round((savedProgress.score / savedProgress.total) * 100)
      : null;

    return (
      <div className="quiz-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-primary)', margin: '0 0 0.35rem' }}>
              Practice Quiz
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              {questions.length} question{questions.length !== 1 ? 's' : ''} · {topic}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Last score badge */}
            {lastPct !== null && (
              <span style={{
                fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.04em',
                padding: '0.25rem 0.6rem', borderRadius: '100px',
                background: lastPct >= 60 ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                border: `1px solid ${lastPct >= 60 ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
                color: lastPct >= 60 ? '#4ade80' : '#f87171',
              }}>
                Last: {savedProgress!.score}/{savedProgress!.total}
              </span>
            )}
            {/* Difficulty pills */}
            {Array.from(new Set(questions.map(q => q.difficulty))).map(d => (
              <span key={d} style={{
                fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em',
                textTransform: 'capitalize', padding: '0.2rem 0.55rem',
                borderRadius: '100px', border: `1px solid ${DIFF_STYLE[d].color}40`,
                color: DIFF_STYLE[d].color, background: DIFF_STYLE[d].bg,
              }}>
                {d}
              </span>
            ))}
          </div>
        </div>

        <div style={{
          background: 'var(--color-surface-base)',
          border: '1px solid rgba(201,151,74,0.08)',
          borderRadius: '0.5rem',
          padding: '1rem 1.25rem',
          marginBottom: '1.75rem',
          fontSize: '0.82rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.5,
        }}>
          Select the best answer for each question. You'll see your result and explanations at the end.
        </div>

        <button className="quiz-primary-btn" onClick={startQuiz}>
          {lastPct !== null ? 'Retake Quiz' : 'Start Quiz'}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    );
  }

  // ── Answering ─────────────────────────────────────────────────────────────
  if (phase === 'answering') {
    const current  = questions[currentIndex];
    const isLast   = currentIndex === questions.length - 1;
    const selected = selections[currentIndex];
    const answered = selected !== undefined;
    const progressPct = answered
      ? ((currentIndex + 1) / questions.length) * 100
      : (currentIndex / questions.length) * 100;
    const diff = DIFF_STYLE[current.difficulty];

    return (
      <div className="quiz-card">
        {/* Progress bar */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span style={{
              fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em',
              textTransform: 'capitalize', padding: '0.15rem 0.5rem',
              borderRadius: '100px', border: `1px solid ${diff.color}40`,
              color: diff.color, background: diff.bg,
            }}>
              {current.difficulty}
            </span>
          </div>
          <div style={{ height: '3px', background: 'var(--color-surface-base)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progressPct}%`,
              background: 'linear-gradient(to right, var(--color-brand-600), var(--color-brand-400))',
              borderRadius: '2px',
              transition: 'width 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }} />
          </div>
        </div>

        {/* Question */}
        <p style={{
          fontSize: '1rem', lineHeight: 1.65, color: 'var(--color-text-primary)',
          marginBottom: '1.5rem', fontWeight: 400,
        }}>
          {current.prompt}
        </p>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
          {OPTIONS.map(opt => {
            const isSelected = selected === opt;
            const isCorrect  = opt === current.correctAnswer;
            let extraClass = '';
            if (answered) {
              if (isCorrect)       extraClass = 'quiz-option-btn--correct';
              else if (isSelected) extraClass = 'quiz-option-btn--wrong';
              else                 extraClass = 'quiz-option-btn--dim';
            }
            return (
              <button
                key={opt}
                className={`quiz-option-btn ${extraClass}`}
                onClick={() => selectOption(opt)}
                disabled={answered}
                aria-pressed={isSelected}
              >
                <span className="quiz-option-btn__letter">{opt}</span>
                <span style={{ flex: 1, textAlign: 'left' }}>{current.options[opt]}</span>
                {answered && isCorrect && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="Correct" style={{ flexShrink: 0 }}>
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {answered && isSelected && !isCorrect && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="Incorrect" style={{ flexShrink: 0 }}>
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div style={{
            background: 'var(--color-surface-base)',
            border: '1px solid rgba(201,151,74,0.12)',
            borderLeft: '3px solid var(--color-brand-500)',
            borderRadius: '0 0.375rem 0.375rem 0',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
          }}>
            <span style={{ fontWeight: 600, color: 'var(--color-brand-400)', marginRight: '0.35rem', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Explanation
            </span>
            <br />
            {current.explanation}
          </div>
        )}

        {/* Advance */}
        <button
          className={`quiz-primary-btn${!answered ? ' quiz-primary-btn--disabled' : ''}`}
          onClick={advance}
          disabled={!answered}
        >
          {isLast ? 'See Results' : 'Next Question'}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  const pct    = Math.round((finalScore / questions.length) * 100);
  const passed = pct >= 60;

  return (
    <div className="quiz-card">
      {/* Score card */}
      <div style={{
        background: 'var(--color-surface-base)',
        border: `1px solid ${passed ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
        borderRadius: '0.625rem',
        padding: '2rem',
        textAlign: 'center',
        marginBottom: '2rem',
      }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
          Your Score
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 5rem)',
          fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1,
          color: passed ? '#4ade80' : '#f87171',
          marginBottom: '0.5rem',
        }}>
          {finalScore}<span style={{ fontSize: '40%', color: 'var(--color-text-muted)' }}>/{questions.length}</span>
        </div>
        <div style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
          {pct}% correct
        </div>
        <span style={{
          display: 'inline-block',
          fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
          padding: '0.3rem 0.875rem', borderRadius: '100px',
          background: passed ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.1)',
          border: `1px solid ${passed ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
          color: passed ? '#4ade80' : '#f87171',
        }}>
          {passed ? '✓ Well done' : 'Keep studying'}
        </span>
        <div style={{ marginTop: '0.875rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Score saved to your browser
        </div>
      </div>

      {/* Review */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h4 style={{
          fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--color-text-muted)', margin: '0 0 1rem',
        }}>
          Review
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {questions.map((q, i) => {
            const userAns = selections[i];
            const correct = userAns === q.correctAnswer;
            return (
              <div key={q.id} style={{
                background: 'var(--color-surface-base)',
                border: `1px solid ${correct ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)'}`,
                borderLeft: `3px solid ${correct ? '#4ade80' : '#f87171'}`,
                borderRadius: '0 0.5rem 0.5rem 0',
                padding: '1rem 1.25rem',
              }}>
                <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start', marginBottom: '0.625rem' }}>
                  <span style={{
                    flexShrink: 0, width: '1.25rem', height: '1.25rem',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 700,
                    background: correct ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
                    color: correct ? '#4ade80' : '#f87171',
                    border: `1px solid ${correct ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
                    marginTop: '0.1rem',
                  }}>
                    {correct ? '✓' : '✗'}
                  </span>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-primary)', lineHeight: 1.55 }}>
                    {q.prompt}
                  </p>
                </div>
                {!correct && (
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', color: '#f87171' }}>
                      Your answer: <strong>{userAns}</strong> — {q.options[userAns!]}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>
                      Correct: <strong>{q.correctAnswer}</strong> — {q.options[q.correctAnswer]}
                    </span>
                  </div>
                )}
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.625rem' }}>
                  {q.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <button className="quiz-primary-btn quiz-primary-btn--outline" onClick={startQuiz}>
        Retake Quiz
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
          <path d="M1.5 7.5A6 6 0 1 0 7.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M1.5 3.5v4h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
