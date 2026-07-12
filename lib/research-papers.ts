// Research & writing published on /research.
//
// To add a paper: drop the PDF in /public/research/ and add an entry below.
// Newest first — the page renders them in array order.

export interface ResearchPaper {
  slug: string
  title: string
  type: string          // e.g. "Systematic Review", "Working Paper", "Essay"
  date: string          // human-readable, e.g. "July 2026"
  length?: string       // e.g. "~11,700 words"
  summary: string       // 1–3 sentences, plain language
  tags: string[]
  file: string          // path under /public, e.g. "/research/xxx.pdf"
}

export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    slug: 'surviving-on-the-margins',
    title:
      'Surviving on the Margins: A Structured Systematic Review of Micro Informal Business, Poverty, and Livelihoods in Kenya',
    type: 'Systematic Review',
    date: 'July 2026',
    length: '~11,700 words',
    summary:
      'Most Kenyans who work run a micro informal business — a stall, a kiosk, a boda boda — and most of them do not grow. They survive. This review reads the evidence through a survival-and-poverty lens and argues that what these firms need first is security of savings, of trading space, and of income, not formal registration.',
    tags: ['Informal economy', 'Kenya', 'Micro-enterprise', 'Poverty', 'Livelihoods'],
    file: '/research/surviving-on-the-margins.pdf',
  },
]
