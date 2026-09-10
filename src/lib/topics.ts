export const TOPICS = [
  'ethical-professional-standards',
  'quantitative-methods',
  'economics',
  'financial-statement-analysis',
  'corporate-issuers',
  'equity-investments',
  'fixed-income',
  'derivatives',
  'alternative-investments',
  'portfolio-management',
] as const;

export type TopicSlug = (typeof TOPICS)[number];

export const TOPIC_META: Record<TopicSlug, { label: string; examWeight: string }> = {
  'ethical-professional-standards': { label: 'Ethical & Professional Standards', examWeight: '15–20%' },
  'quantitative-methods':           { label: 'Quantitative Methods',             examWeight: '8–12%'  },
  'economics':                      { label: 'Economics',                         examWeight: '8–12%'  },
  'financial-statement-analysis':   { label: 'Financial Statement Analysis',      examWeight: '13–17%' },
  'corporate-issuers':              { label: 'Corporate Issuers',                 examWeight: '8–12%'  },
  'equity-investments':             { label: 'Equity Investments',                examWeight: '10–12%' },
  'fixed-income':                   { label: 'Fixed Income',                      examWeight: '10–12%' },
  'derivatives':                    { label: 'Derivatives',                       examWeight: '5–8%'   },
  'alternative-investments':        { label: 'Alternative Investments',           examWeight: '5–8%'   },
  'portfolio-management':           { label: 'Portfolio Management',              examWeight: '5–8%'   },
};
