export interface Story {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readingTime: string;
}

export const STORIES: Story[] = [
  {
    id: 'story-1',
    title: 'Japan Expands Specified Skilled Worker (SSW-2) Visas: Direct Path to Permanent Residency',
    slug: 'japan-expands-ssw2-visa-permanent-residency',
    category: 'Work Policy Updates',
    excerpt: 'The Japanese Immigration Services Agency has officially expanded the SSW-2 visa category across 11 additional sectors, granting indefinite renewals and family sponsorship rights.',
    content: `
Japan has taken a historic step to address its critical labor shortage by broadening the scope of the Specified Skilled Worker (SSW-2) visa. Previously restricted to only construction and shipbuilding, the second-tier status now encompasses 11 sectors including nursing care, hospitality, aviation ground handling, and agriculture.

### Key Milestones for Applicants:
- **Unlimited Visa Renewals:** Unlike SSW-1 which is capped at 5 years, SSW-2 allows perpetual renewals as long as employment is maintained.
- **Family Accompaniment:** Workers can now bring their spouses and dependent children to reside with them in Japan with access to Japanese national health insurance and public schooling.
- **Permanent Residency Timeline:** Time spent under SSW-2 counts towards the 10-year residency requirement for Japanese Permanent Residency (Eijuken), with expedited tracks available for high earners.

For skilled Bangladeshi and South Asian tradespeople and graduates, passing the JLPT N3/N4 along with the Prometric technical exam is now one of the highest-ROI career decisions for 2026.
    `,
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Md. Farhan Rahman',
      role: 'Senior Japanese Visa Consultant',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '28 Oct 2026',
    readingTime: '5 min read'
  },
  {
    id: 'story-2',
    title: 'How to Master the German Opportunity Card (Chancenkarte) Points Assessment',
    slug: 'master-german-opportunity-card-points-assessment',
    category: 'Job Seeker Guides',
    excerpt: 'A comprehensive checklist on how to accumulate the mandatory 6 points required to receive a 1-year job search visa in Germany without an existing contract.',
    content: `
Germany's modernized immigration framework offers skilled foreign nationals the **Chancenkarte** (Opportunity Card). Operating on a transparent scoring grid, candidates need at least 6 points to qualify for legal entry.

### Breakdown of Points:
1. **Academic or Professional Recognition (4 Points):** Full recognition of your degree or vocational diploma in Germany.
2. **Professional Experience (2–3 Points):** 2 to 5 years of experience in your field within the last 7 years.
3. **Language Competence (1–3 Points):** German A2 (1 pt), B1 (2 pts), B2 (3 pts), or English C1 (1 pt).
4. **Age Factor (1–2 Points):** Under 35 years old (2 pts), between 35 and 40 (1 pt).
5. **Shortage Occupations (1 Point):** IT, Engineering, Nursing, Mathematics, and Renewable Energy.

Candidates can work up to 20 hours per week while searching for permanent employment, providing financial stability during their relocation phase.
    `,
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Elena Schultz',
      role: 'EU Immigration Attorney',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '24 Oct 2026',
    readingTime: '4 min read'
  },
  {
    id: 'story-3',
    title: 'UK Skilled Worker Visa 2026: Salary Rules & Shortage Occupation Updates',
    slug: 'uk-skilled-worker-visa-salary-rules-shortage-list',
    category: 'Visa Regulations',
    excerpt: 'Crucial advice on meeting the updated £38,700 general salary threshold and how to take advantage of health & care sector exemptions.',
    content: `
The UK Home Office introduced significant updates to the Skilled Worker route. While the baseline salary threshold was raised, strategic exemptions still exist for key sectors.

### Critical Takeaways:
- **Health and Social Care Exemption:** Healthcare professionals, doctors, nurses, and laboratory analysts remain exempt from the £38,700 threshold and pay reduced application fees.
- **New Entrant Discounts:** If you are under 26 years old or transitioning from a UK Graduate Visa, a 30% reduction applies to the required going rate for your occupation code.
- **Sponsorship Verification:** Always verify whether your employer holds an active A-rated sponsor license before signing an employment contract.

Our agency performs complimentary verification of employer Certificate of Sponsorship (CoS) reference numbers to protect applicants from fraudulent hiring agencies.
    `,
    coverImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Barrister K. M. Huq',
      role: 'UK Immigration Solicitor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '19 Oct 2026',
    readingTime: '6 min read'
  },
  {
    id: 'story-4',
    title: 'UAE Green Visa vs. Golden Visa: Which Work Authorization Fits Your Profile?',
    slug: 'uae-green-visa-vs-golden-visa-comparison',
    category: 'Middle East Visas',
    excerpt: 'Comparing the 5-year Green Residence and 10-year Golden Visa: eligibility, minimum monthly income, family sponsorship, and freelancing allowances in Dubai.',
    content: `
The United Arab Emirates offers several attractive long-term residency permits designed to attract global technical talent, investors, and entrepreneurs without the traditional employer sponsorship bottleneck.

### 5-Year Green Residence Visa:
- Designed for freelancers, skilled employees, and self-employed professionals.
- Requires bachelor's degree and freelance permit from the Ministry of Human Resources and Emiratisation (MOHRE).
- Minimum annual earnings from self-employment of AED 360,000 across the past 2 years.

### 10-Year Golden Visa:
- Caters to top executives, software architects, real estate investors, and exceptional talents.
- Direct path to 10-year renewable residency with unlimited stays outside the UAE without permit nullification.
- Allows sponsoring unlimited domestic helpers, parents, and children of any age.
    `,
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Tariq Al-Mansoor',
      role: 'Gulf Corporate Mobility Advisor',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '14 Oct 2026',
    readingTime: '4 min read'
  },
  {
    id: 'story-5',
    title: '10 Documents Every First-Time Work Visa Applicant Forgets to Attest',
    slug: '10-documents-first-time-work-visa-applicant-forgets',
    category: 'Consular Checklist',
    excerpt: 'Avoid embassy rejection letters with this battle-tested checklist of notary stamps, ministry seals, and certified translation requirements.',
    content: `
Over 42% of visa delays and refusals stem not from applicant ineligibility, but from procedural errors in document legalizations.

### The Most Frequently Overlooked Requirements:
1. **MOFA Attestation Sequence:** Certificates must first be authenticated by your board/university, followed by the Ministry of Education, and lastly by the Ministry of Foreign Affairs (MOFA).
2. **Police Clearance Expiry Window:** Most embassies (including Germany, Japan, and Romania) mandate that police clearance certificates must be under 90 days old on the date of submission.
3. **Medical Center Accreditation:** Always ensure your pre-departure medical checkup is conducted strictly at an embassy-empowered diagnostic panel (e.g. GAMCA for Gulf states, IOM for UK/Canada).
4. **Certified Translation Discrepancies:** Name spellings on translated documents must strictly match the machine-readable zone (MRZ) of your passport.
    `,
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Advocate Shamsul Alam',
      role: 'Head of Consular Attestation',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '08 Oct 2026',
    readingTime: '5 min read'
  }
];
