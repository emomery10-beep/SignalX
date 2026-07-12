// Research & writing published on /research.
//
// To add a paper: drop the PDF in /public/research/ and add an entry below.
// Newest first — the page renders them in array order. Each paper also gets its
// own detail page at /research/<slug> (see app/research/[slug]).

export interface ResearchPaper {
  slug: string
  title: string
  type: string          // e.g. "Systematic Review", "Working Paper", "Essay"
  date: string          // human-readable, e.g. "July 2026"
  length?: string       // e.g. "~11,700 words"
  summary: string       // 1–3 sentences, plain language (used on the list card)
  abstract: string      // full abstract — real on-page text for SEO + AI citation
  keyFindings: string[] // the paper's main takeaways, in plain language
  tags: string[]
  file: string          // path under /public, e.g. "/research/xxx.pdf"
}

// The author entity. `sameAs` should hold public profile URLs (LinkedIn,
// Google Scholar, ORCID, etc.) — they strengthen how strongly search engines
// and AI answer engines tie this work to Idarus specifically. Add real URLs
// only; leave the array empty rather than guessing.
export const AUTHOR = {
  name: 'Idarus Ali',
  firstName: 'Idarus',
  role: 'Founder, AskBiz',
  email: 'idarus@askbiz.co',
  image: '/images/founder.jpg',
  credentials: ['BSc Computer Science', 'MA Applied Linguistics'],
  sameAs: [] as string[],
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
    abstract:
      "Micro informal enterprises employ the majority of Kenya's working population, yet most of them do not grow. They persist. This review asks why, and it reads the evidence through a survival-and-poverty lens rather than a growth one. Following a structured, PRISMA-informed protocol, it synthesises peer-reviewed studies, national statistics, and grey literature on Kenya's micro informal sector — the jua kali artisans, street vendors, mama mbogas, kiosk owners, and boda boda operators who make up the country's real labour market. Three findings stand out. First, the sector is defined by survivalist logic: most firms exist to smooth household consumption, not to accumulate capital, and their scale reflects risk management, not a lack of ambition. Second, the binding constraints are structural and mutually reinforcing — thin capital, unsafe savings, insecure trading space, harassment by county enforcement, and near-total exclusion from social protection. Third, the interventions promoted as solutions, from mobile money to state credit, have delivered real but uneven gains; mobile money moved households out of poverty, while flagship state credit largely financed consumption and defaulted. The review concludes that formalisation, framed as registration, misreads the problem. What survivalist enterprise needs first is security — of savings, of space, and of income against shocks. Policy that starts there will do more for the poor than policy that starts with a licence.",
    keyFindings: [
      'The sector runs on survival, not growth. Most micro informal firms exist to keep a household fed, not to build capital — so their small size reflects rational risk management, not a lack of ambition.',
      'Unsafe savings bind harder than scarce credit. A safe place to store money raises investment more than a loan does; credit pushed at a household with no buffer tends to become consumption, and then debt.',
      'Insecure trading space is economic policy, not just urban management. Harassment, eviction, and extortion by county enforcement act as a regressive tax and stop vendors investing in their own pitches.',
      'The poorest firms are the most exposed to shocks and the least insured. With only about a tenth of the population covered by any contributory social protection, the firm itself becomes the household’s only shock absorber.',
      'What works is security, not registration. Mobile money and safe savings cut poverty by making households more resilient, while flagship state credit (the Hustler Fund) largely financed consumption and defaulted.',
    ],
    tags: ['Informal economy', 'Kenya', 'Micro-enterprise', 'Poverty', 'Livelihoods'],
    file: '/research/surviving-on-the-margins.pdf',
  },
]

export function getPaper(slug: string): ResearchPaper | undefined {
  return RESEARCH_PAPERS.find((p) => p.slug === slug)
}
