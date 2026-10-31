export interface WorkVisa {
  id: string;
  /** URL-friendly slug: used in /visa/[country]/[slug] */
  slug: string;
  /** URL-friendly country segment: lowercase with hyphens */
  countrySlug: string;
  country: string;
  countryCode: string; // ISO 2-letter
  flag: string;
  region: 'Asia' | 'Middle East' | 'Europe' | 'Africa' | 'Americas';
  visaTitle: string;
  categoryTag: string;
  badge?: string;
  processingTime: string;
  averageSalary: string;
  validity: string;
  minEducation: string;
  languageRequirement: string;
  govtFee: string;
  serviceFee: string;
  currency: string;
  image: string;
  overview: string;
  keyBenefits: string[];
  eligibilityChecklist: string[];
  requiredDocuments: string[];
  applicationStages: string[];
}

export const REGIONS = ['All', 'Asia', 'Middle East', 'Europe', 'Africa', 'Americas'] as const;

export const WORK_VISAS: WorkVisa[] = [
  {
    id: 'japan-ssw',
    slug: 'specified-skilled-worker-visa',
    countrySlug: 'japan',
    country: 'Japan',
    countryCode: 'jp',
    flag: '🇯🇵',
    region: 'Asia',
    visaTitle: 'Specified Skilled Worker (SSW-1 & SSW-2)',
    categoryTag: 'High Demand',
    badge: 'PR Pathway',
    processingTime: '6 - 8 Weeks',
    averageSalary: '¥240,000 - ¥360,000 / mo',
    validity: '5 Years (SSW-1) / Indefinite (SSW-2)',
    minEducation: 'HSC / Diploma or equivalent',
    languageRequirement: 'JLPT N4 or JFT-Basic A2',
    govtFee: '¥4,000 (approx. ৳3,400)',
    serviceFee: '৳45,000',
    currency: 'JPY',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    overview: 'Japan’s SSW visa allows foreign skilled workers to fill critical shortages across 14 vital industries including Nursing Care, Food Service, Construction, Manufacturing, and Agriculture.',
    keyBenefits: [
      'Direct Japanese employment contract with full health insurance and pension',
      'Option to bring family upon transition to SSW-2',
      'Clear roadmap to Permanent Residency (Eijuken) in Japan',
      'Overtime pay and standard Japanese annual bonuses'
    ],
    eligibilityChecklist: [
      'Must pass the Industry Skills Test (Prometric Examination in BD/India)',
      'JLPT N4 or JFT-Basic A2 Japanese Language proficiency certificate',
      'Age between 18 and 45 years',
      'Clean criminal record and standard medical fitness clearance'
    ],
    requiredDocuments: [
      'Valid biometric passport (at least 18 months validity)',
      'Prometric Skills Evaluation Test Certificate',
      'JLPT/JFT-Basic Language Certificate',
      'Curriculum Vitae (Rirekisho) formatted to Japanese embassy standard',
      'Police Clearance Certificate with Foreign Ministry attestation',
      'Medical clearance certificate from approved diagnostic center'
    ],
    applicationStages: [
      'Job Matching & Japanese Employer Interview',
      'Certificate of Eligibility (COE) filing with Immigration Services Agency of Japan',
      'COE Issuance & Document Translation into Japanese',
      'Embassy of Japan Visa Stamping & Pre-Departure Briefing'
    ]
  },
  {
    id: 'malaysia-single-entry-business-visa-express',
    slug: 'malaysia-single-entry-business-visa-express',
    countrySlug: 'malaysia',
    country: 'Malaysia',
    countryCode: 'my',
    flag: '🇲🇾',
    region: 'Asia',
    visaTitle: 'Malaysia Single Entry Work Visa – Express',
    categoryTag: 'Work Visa',
    badge: 'e-Visa',
    processingTime: '5 - 7 Working Days',
    averageSalary: 'Not applicable for work visa',
    validity: '180 Days',
    minEducation: 'Not specified',
    languageRequirement: 'Not specified',
    govtFee: '৳4,250 Visa fee',
    serviceFee: '৳500 Management Fee + ৳98 Platform Fee',
    currency: 'BDT',
    image: 'https://visaboo.com/img/c-malaysia.jpg',
    overview: 'The Malaysia Single Entry Work Visa – Express is an e-Visa for work-related travel to Malaysia. It is valid for 180 days, allows a maximum stay of 30 days per entry, and is normally issued within 5–7 working days after all documents are complete.',
    keyBenefits: [
      'Online e-Visa for Malaysia business travel',
      'Visa validity of 180 days',
      'Maximum stay of 30 days per single entry',
      'Express processing of 5–7 working days after documents are complete'
    ],
    eligibilityChecklist: [
      'Passport valid for at least 6 months from the date of travel',
      'Passport must contain 2 blank pages',
      'Each stay in Malaysia can be up to 30 days per entry',
      'A clear colour passport scan can be submitted instead of the physical passport for an e-Visa'
    ],
    requiredDocuments: [
      'Passport valid for at least 6 months, with 2 blank pages',
      'Recent passport-size photo (35 × 50 mm, white background) Optional',
      'Invitation letter from the host company in Malaysia Optional',
      'Trade licence copy with English translation Optional',
      'Bank statement for the last 6 months Optional',
      'Confirmed return air ticket and hotel booking Optional',
      'Business owner: trade licence, company bank statement, letterhead pad and visiting card',
      'Job holder: No Objection Certificate (NOC), office ID and last 3 months salary slips',
      'Travelling with family: marriage certificate and birth certificates for accompanying children',
      'Previous Malaysia visa copies, if travelled there before Optional',
      'Yellow fever vaccination certificate, if arriving from an affected country Optional'
    ],
    applicationStages: [
      'Prepare the passport scan, photograph and supporting business documents',
      'Submit the Malaysia Single Entry Work Visa e-Visa application',
      'Processing and verification normally takes 5–7 working days',
      'Receive the approved e-Visa for a validity of 180 days and a maximum stay of 30 days per entry'
    ]
  },
  {
    id: 'germany-opportunity-card',
    slug: 'chancenkarte-opportunity-card',
    countrySlug: 'germany',
    country: 'Germany',
    countryCode: 'de',
    flag: '🇩🇪',
    region: 'Europe',
    visaTitle: 'Chancenkarte (Opportunity Card) & EU Blue Card',
    categoryTag: 'Fast-Track',
    badge: 'No Job Offer Needed',
    processingTime: '4 - 6 Weeks',
    averageSalary: '€3,800 - €5,600 / mo',
    validity: '1 Year (Job Search) -> Multi-year Residence',
    minEducation: 'Bachelors Degree or Recognized Vocational Training',
    languageRequirement: 'German A1 or English B2',
    govtFee: '€75 (approx. ৳9,800)',
    serviceFee: '৳55,000',
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80',
    overview: 'The German Opportunity Card (Chancenkarte) uses a points-based system enabling skilled professionals to enter Germany for up to 1 year to secure qualified employment, with part-time work permitted during the search.',
    keyBenefits: [
      'Enter Germany legally without requiring a preliminary job offer',
      'Permission to work part-time (up to 20 hours/week) during job search',
      'Automatic transition to EU Blue Card upon securing a qualifying contract',
      'Permanent residency eligibility after only 21-27 months'
    ],
    eligibilityChecklist: [
      'Minimum of 6 points scored on the Chancenkarte scoring rubric',
      'Recognized university degree or 2-year accredited vocational credential',
      'Proof of sufficient funds (Blocked account / Sperrkonto or Declaration of Commitment)',
      'Health insurance valid for the full stay in Germany'
    ],
    requiredDocuments: [
      'Passport valid for at least 12 months with 2 blank pages',
      'Anabin database degree recognition printout or ZAB evaluation',
      'Blocked bank account proof (€1,027/month living expense guarantee)',
      'Official German A1 or English B2 certificate (Goethe, TELC, IELTS, TOEFL)',
      'European Europass CV and Motivational Cover Letter'
    ],
    applicationStages: [
      'Points Calculation & Academic Credential Assessment',
      'Blocked Account Setup & Document Dossier Preparation',
      'German Embassy / VFS Global Visa Appointment',
      'Arrival in Germany, Local Registration (Anmeldung) & Job Hunt'
    ]
  },
  {
    id: 'uae-green-visa',
    slug: 'green-golden-residence-visa',
    countrySlug: 'united-arab-emirates',
    country: 'United Arab Emirates',
    countryCode: 'ae',
    flag: '🇦🇪',
    region: 'Middle East',
    visaTitle: 'Green Residence Visa & Golden Visa',
    categoryTag: 'Self-Sponsored',
    badge: 'Tax Free Income',
    processingTime: '2 - 3 Weeks',
    averageSalary: 'AED 12,000 - AED 28,000 / mo',
    validity: '5 to 10 Years Renewable',
    minEducation: 'Bachelor’s degree or specialized diploma',
    languageRequirement: 'English (Professional working proficiency)',
    govtFee: 'AED 2,280 (approx. ৳74,000)',
    serviceFee: '৳40,000',
    currency: 'AED',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    overview: 'The UAE Green Visa allows high-skilled workers, freelancers, and technicians to live and work in Dubai and Abu Dhabi for 5 years without requiring an Emirati employer sponsor.',
    keyBenefits: [
      'Completely self-sponsored with no employer restrictions',
      'Sponsor spouse, children (up to 25 years old), and parents easily',
      'Grace period of up to 6 months in UAE upon permit expiration to renew',
      '100% tax-free personal income and world-class healthcare'
    ],
    eligibilityChecklist: [
      'Freelancer permit from Ministry of Human Resources (MOHRE) OR High-Skilled Employment',
      'Minimum monthly income equivalent to AED 15,000 over past 2 years',
      'Attested educational certificate by UAE Embassy',
      'Valid medical fitness test conducted in UAE'
    ],
    requiredDocuments: [
      'Original Passport + Color Copy',
      'UAE Embassy Attested Degree Certificate',
      'Bank Statements verifying personal earnings',
      'Digital passport-sized photograph with white background',
      'UAE Entry Permit and Health Insurance policy'
    ],
    applicationStages: [
      'MOHRE Freelance / Skill Approval Application',
      'Entry Permit Issuance (60-day visa to enter UAE)',
      'Medical Screening & Emirates ID Biometrics in Dubai',
      'Digital Residence Visa Stamped & Delivery of 5-Year Card'
    ]
  },
  {
    id: 'uk-skilled-worker',
    slug: 'skilled-worker-visa',
    countrySlug: 'united-kingdom',
    country: 'United Kingdom',
    countryCode: 'gb',
    flag: '🇬🇧',
    region: 'Europe',
    visaTitle: 'Skilled Worker Visa (Tier 2 / NHS Health & Care)',
    categoryTag: 'Premier',
    badge: 'Family Included',
    processingTime: '3 - 5 Weeks',
    averageSalary: '£38,700 - £65,000 / yr',
    validity: 'Up to 5 Years',
    minEducation: 'A-Level / Bachelor’s Degree or Trade Certification',
    languageRequirement: 'IELTS for UKVI (Level B1 minimum)',
    govtFee: '£719 - £1,420 + Immigration Health Surcharge',
    serviceFee: '৳60,000',
    currency: 'GBP',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    overview: 'The UK Skilled Worker route allows individuals to come to the UK to work for an approved Home Office sponsor in an eligible occupation code with high earning potential.',
    keyBenefits: [
      'Direct employment with approved UK corporate or NHS healthcare sponsor',
      'Bring spouse and dependent children under 18 years old',
      'Free schooling for children and access to NHS healthcare system',
      'Eligibility to apply for Indefinite Leave to Remain (ILR) after 5 years'
    ],
    eligibilityChecklist: [
      'Valid Certificate of Sponsorship (CoS) from a licensed UK employer',
      'Job on the eligible occupation code list matching salary thresholds',
      'Proven knowledge of English (IELTS Life Skills or General UKVI B1)',
      'Clean TB clearance test from IOM approved medical facility'
    ],
    requiredDocuments: [
      'Certificate of Sponsorship (CoS) reference number',
      'IELTS for UKVI test report',
      'Tuberculosis (TB) test certificate from IOM',
      'Criminal record certificate (for healthcare, education and social sectors)',
      'Bank statements proving £1,270 maintenance funds (unless sponsor certifies)'
    ],
    applicationStages: [
      'UK Employer CoS Allocation & Salary Verification',
      'Online Home Office Application & VFS UK Priority Biometrics',
      'Decision Processing (3-5 weeks standard, 5 days priority)',
      'Vignette Stamping & BRP / Digital eVisa Collection upon UK Arrival'
    ]
  },
  {
    id: 'singapore-ep',
    slug: 'employment-pass-s-pass',
    countrySlug: 'singapore',
    country: 'Singapore',
    countryCode: 'sg',
    flag: '🇸🇬',
    region: 'Asia',
    visaTitle: 'Employment Pass (EP) & COMPASS S-Pass',
    categoryTag: 'Asia Hub',
    badge: 'Fast Processing',
    processingTime: '3 - 4 Weeks',
    averageSalary: 'S$5,500 - S$11,000 / mo',
    validity: '2 Years (Initial) / 3 Years (Renewal)',
    minEducation: 'Degree from recognized university',
    languageRequirement: 'English (Corporate working level)',
    govtFee: 'S$300 (approx. ৳27,000)',
    serviceFee: '৳50,000',
    currency: 'SGD',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    overview: 'Singapore’s premier work pass for managers, executives, and specialized tech professionals. Evaluated through the COMPASS point framework rewarding qualified foreign talents.',
    keyBenefits: [
      'Unmatched career trajectory in Southeast Asia’s financial & tech capital',
      'Eligible to sponsor dependents (DP) for spouse and children',
      'Predictable Ministry of Manpower (MOM) processing within 20 working days',
      'Clear pathway to Singapore Permanent Residence (PR) after 2-3 years'
    ],
    eligibilityChecklist: [
      'Minimum monthly qualifying salary of S$5,000 (S$5,500 in financial sector)',
      'Pass COMPASS points assessment (at least 40 points across salary, qualifications, diversity)',
      'Recognized degree verified through DataFlow / MOM background check',
      'Formal job offer from an ACRA registered Singapore firm'
    ],
    requiredDocuments: [
      'Valid Passport with minimum 6 months validity',
      'Third-party academic background screening verification report',
      'Detailed resume and corporate job offer letter',
      'Company letter explaining business rationale for the foreign hire'
    ],
    applicationStages: [
      'COMPASS Pre-Assessment & Academic Background Verification',
      'MOM EP Online Submission by Sponsoring Entity',
      'In-Principle Approval (IPA) Letter Issuance',
      'Arrival in Singapore & Biometrics at MOM Employment Pass Services Centre'
    ]
  },
  {
    id: 'romania-work-permit',
    slug: 'eu-work-authorization-aviz-de-munca',
    countrySlug: 'romania',
    country: 'Romania',
    countryCode: 'ro',
    flag: '🇷🇴',
    region: 'Europe',
    visaTitle: 'EU Work Authorization (Aviz de Munca) & Type D/AM',
    categoryTag: 'Entry to EU',
    badge: 'Schengen Country',
    processingTime: '8 - 10 Weeks',
    averageSalary: '€950 - €1,600 / mo + Housing',
    validity: '1 Year Renewable up to 5 Years',
    minEducation: 'SSC / Vocational Technical Certificate',
    languageRequirement: 'Basic English or Romanian (Not mandatory for all roles)',
    govtFee: '€120 (approx. ৳15,500)',
    serviceFee: '৳38,000',
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=800&q=80',
    overview: 'As Romania is now integrated into the European Schengen zone, this work permit provides legal residence, work authorization, and freedom of movement across Schengen territories.',
    keyBenefits: [
      'Official EU Schengen work permit with employer-provided accommodation',
      'High demand for drivers, chefs, construction workers, and factory operators',
      'Straightforward medical and background clearance',
      'Permanent EU residency eligibility after 5 continuous years'
    ],
    eligibilityChecklist: [
      'No previous deportation record from any EU/Schengen member state',
      'Clean criminal background certificate (police clearance)',
      'Basic medical fitness for designated physical or technical labor',
      'Age between 20 and 50 years'
    ],
    requiredDocuments: [
      'Original Passport valid for at least 2 years',
      'Police Clearance Certificate attested by Ministry of Foreign Affairs',
      'Medical examination certificate proving fitness for work',
      'Passport-size photographs (35mm x 45mm white background)'
    ],
    applicationStages: [
      'Work Authorization (Aviz de Munca) approval by Romanian Immigration Inspectorate (IGI)',
      'Submission to Romanian Embassy in New Delhi / Dhaka Consular Office',
      'Long-Stay Type D Visa Stamping',
      'Arrival in Bucharest & Issuance of Permis de Sedere (Residence Card)'
    ]
  },
  {
    id: 'canada-lmia-work',
    slug: 'lmia-work-permit-global-talent',
    countrySlug: 'canada',
    country: 'Canada',
    countryCode: 'ca',
    flag: '🇨🇦',
    region: 'Americas',
    visaTitle: 'LMIA Work Permit & Global Talent Stream',
    categoryTag: 'High Quality',
    badge: 'Express Entry Points',
    processingTime: '8 - 12 Weeks',
    averageSalary: 'CAD $55,000 - $95,000 / yr',
    validity: '2 to 3 Years Renewable',
    minEducation: 'Bachelor’s degree or certified trade diploma',
    languageRequirement: 'IELTS General (CLB 5 minimum)',
    govtFee: 'CAD $155 + Biometrics CAD $85',
    serviceFee: '৳65,000',
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80',
    overview: 'Canada’s Temporary Foreign Worker Program (TFWP) allows Canadian companies with positive LMIA to hire skilled specialists, engineers, and healthcare staff with direct points toward PR.',
    keyBenefits: [
      'Earn 50 to 200 extra Comprehensive Ranking System (CRS) points for Express Entry',
      'Spousal Open Work Permit allows spouse to work for any employer in Canada',
      'Children attend publicly funded Canadian elementary and secondary schools for free',

    ],
    eligibilityChecklist: [
      'Valid Positive Labour Market Impact Assessment (LMIA) or LMIA-exempt job offer',
      'Proof of work experience matching National Occupational Classification (NOC / TEER)',
      'Upfront medical exam performed by an IRCC Panel Physician',
      'IELTS General training certificate'
    ],
    requiredDocuments: [
      'LMIA approval letter and signed employment contract',
      'Educational Credential Assessment (ECA) report from WES',
      'Police clearance certificates from every country lived in for > 6 months',
      'Reference letters documenting 2+ years of relevant employment experience'
    ],
    applicationStages: [
      'LMIA Advertising & Filing with Employment and Social Development Canada (ESDC)',
      'Online IRCC Portal Visa Application & VFS Biometrics',
      'Passport Transmission & Port of Entry (POE) Letter of Introduction',
      'Work Permit Printed at Canadian Border Airport upon Landing'
    ]
  },
  {
    id: 'saudi-work-visa',
    slug: 'professional-work-visa-svp',
    countrySlug: 'saudi-arabia',
    country: 'Saudi Arabia',
    countryCode: 'sa',
    flag: '🇸🇦',
    region: 'Middle East',
    visaTitle: 'Professional Work Visa & Skill Verification (SVP)',
    categoryTag: 'Rapid Approval',
    badge: 'Vision 2030',
    processingTime: '2 - 4 Weeks',
    averageSalary: 'SAR 6,500 - SAR 18,000 / mo',
    validity: '1 to 2 Years Renewable (Iqama)',
    minEducation: 'Relevant Technical Certification / Bachelor Degree',
    languageRequirement: 'English or Arabic',
    govtFee: 'SAR 2,000 (approx. ৳64,000)',
    serviceFee: '৳35,000',
    currency: 'SAR',
    image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=800&q=80',
    overview: 'In line with Saudi Vision 2030 megaprojects (NEOM, Red Sea, Riyadh Metro), Saudi Arabia has modernized its work visas under Qiwa and Takamol skill verification programs.',
    keyBenefits: [
      'Full employer sponsorship with provided medical coverage and housing allowance',
      'Transferable Iqama under updated Saudi Labor Law without Exit-Reentry bottlenecks',
      'Tax-free earnings with high savings potential',
      'Convenient proximity and direct flights from South Asia'
    ],
    eligibilityChecklist: [
      'Pass Takamol Skill Verification Program (SVP) computer and practical test',
      'GAMCA approved medical test clearance certificate',
      'Verified degree/diploma attested by Saudi Cultural Office & MOFA',
      'Valid Qiwa electronic job contract'
    ],
    requiredDocuments: [
      'Original Passport valid for minimum 1 year',
      'GAMCA Medical Fitness Certificate (FIT status)',
      'Takamol Skill Verification Certificate',
      'Electronic Wakala and Qiwa employment agreement copy',
      'Police Clearance Certificate'
    ],
    applicationStages: [
      'Qiwa Electronic Contract Signing & Takamol Test',
      'GAMCA Medical Checkup & Biometric Registration',
      'Saudi Embassy Visa Stamping (Tafweed E-Visa)',
      'Flight Departure & Issuance of Iqama Residency Card'
    ]
  }
];

export const POPULAR_COUNTRIES_BY_REGION = {
  Asia: [
    { name: 'Japan', code: 'jp', flag: '🇯🇵', desc: 'SSW Skilled Worker & Tech Engineers' },
    { name: 'Singapore', code: 'sg', flag: '🇸🇬', desc: 'Employment Pass & COMPASS S-Pass' },
    { name: 'Malaysia', code: 'my', flag: '🇲🇾', desc: 'Category I-III Professional Pass' },
    { name: 'South Korea', code: 'kr', flag: '🇰🇷', desc: 'E-7 Professional & E-9 Skilled' },
  ],
  'Middle East': [
    { name: 'United Arab Emirates', code: 'ae', flag: '🇦🇪', desc: 'Green Visa & 10-Year Golden Visa' },
    { name: 'Saudi Arabia', code: 'sa', flag: '🇸🇦', desc: 'Vision 2030 Professional Visa' },
    { name: 'Qatar', code: 'qa', flag: '🇶🇦', desc: 'Work Residence Permit' },
    { name: 'Oman', code: 'om', flag: '🇴🇲', desc: 'Specialized Labor & Executive Pass' },
  ],
  Europe: [
    { name: 'United Kingdom', code: 'gb', flag: '🇬🇧', desc: 'Skilled Worker & NHS Healthcare' },
    { name: 'Germany', code: 'de', flag: '🇩🇪', desc: 'Chancenkarte & EU Blue Card' },
    { name: 'Romania', code: 'ro', flag: '🇷🇴', desc: 'Schengen EU Work Authorization' },
    { name: 'Italy', code: 'it', flag: '🇮🇹', desc: 'Decreto Flussi & Tech Visas' },
    { name: 'France', code: 'fr', flag: '🇫🇷', desc: 'Talent Passport & High Skill Permit' },
  ],
  Africa: [
    { name: 'South Africa', code: 'za', flag: '🇿🇦', desc: 'Critical Skills Work Visa' },
    { name: 'Egypt', code: 'eg', flag: '🇪🇬', desc: 'Expatriate Work Permit' },
    { name: 'Mauritius', code: 'mu', flag: '🇲🇺', desc: 'Occupation Permit (Investor/Expert)' },
  ],
  Americas: [
    { name: 'Canada', code: 'ca', flag: '🇨🇦', desc: 'LMIA Work Permit & Global Talent' },
    { name: 'United States', code: 'us', flag: '🇺🇸', desc: 'H-1B Specialty & EB-3 Pathways' },
    { name: 'Australia', code: 'au', flag: '🇦🇺', desc: 'Subclass 482 & Employer Sponsored' },
  ]
};
