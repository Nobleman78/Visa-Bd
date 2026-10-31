export interface TrackingStage {
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface TrackedApplication {
  trackingId: string;
  applicantName: string;
  phone: string;
  destinationCountry: string;
  flag: string;
  visaCategory: string;
  assignedOfficer: {
    name: string;
    contact: string;
    role: string;
  };
  overallStatus: 'Under Document Verification' | 'Embassy Processing' | 'Approved & Stamped' | 'Ready for Collection';
  lastUpdated: string;
  estimatedCompletion: string;
  stages: TrackingStage[];
}

export const MOCK_APPLICATIONS: Record<string, TrackedApplication> = {
  'VBD-2026-89412': {
    trackingId: 'VBD-2026-89412',
    applicantName: 'Tariqul Islam',
    phone: '+8801712345678',
    destinationCountry: 'Japan',
    flag: '🇯🇵',
    visaCategory: 'Specified Skilled Worker (SSW-1)',
    assignedOfficer: {
      name: 'Md. Farhan Rahman',
      contact: '+880 1799 448822',
      role: 'Senior Tokyo Desk Case Officer'
    },
    overallStatus: 'Embassy Processing',
    lastUpdated: 'Today at 02:30 PM',
    estimatedCompletion: '14 Nov 2026',
    stages: [
      {
        title: 'Application & Dossier Submitted',
        description: 'Candidate documents, Prometric skills score, and JLPT N4 certificates received and checked for accuracy.',
        date: '12 Oct 2026',
        status: 'completed'
      },
      {
        title: 'Ministry Translation & Attestation',
        description: 'Official Japanese translation completed; attested by Bangladesh Ministry of Foreign Affairs (MOFA).',
        date: '18 Oct 2026',
        status: 'completed'
      },
      {
        title: 'Certificate of Eligibility (COE) Issued',
        description: 'COE approved by Tokyo Immigration Bureau; sent to Dhaka processing bureau.',
        date: '25 Oct 2026',
        status: 'completed'
      },
      {
        title: 'Embassy of Japan Biometrics & VFS Submission',
        description: 'Passport and original COE deposited with the Embassy of Japan consular section in Dhaka.',
        date: '28 Oct 2026',
        status: 'in_progress'
      },
      {
        title: 'Visa Stamped & Ready for Departure',
        description: 'Final sticker verification and dispatch of flight pre-departure orientation briefing packet.',
        date: 'Estimated 14 Nov 2026',
        status: 'pending'
      }
    ]
  },
  'VBD-2026-33901': {
    trackingId: 'VBD-2026-33901',
    applicantName: 'Nusrat Jahan',
    phone: '+8801812345678',
    destinationCountry: 'Germany',
    flag: '🇩🇪',
    visaCategory: 'Chancenkarte (Opportunity Card)',
    assignedOfficer: {
      name: 'Elena Schultz',
      contact: '+49 30 9928 110',
      role: 'EU Immigration Case Lead'
    },
    overallStatus: 'Approved & Stamped',
    lastUpdated: 'Yesterday at 05:15 PM',
    estimatedCompletion: 'Completed',
    stages: [
      {
        title: 'Points Verification & Anabin Credential Check',
        description: 'BSc Computer Science degree verified via Anabin H+ status; 7 points secured.',
        date: '02 Sep 2026',
        status: 'completed'
      },
      {
        title: 'Blocked Account (Sperrkonto) Confirmed',
        description: 'Proof of €12,324 maintenance funds validated via Expatrio/Fintiba.',
        date: '15 Sep 2026',
        status: 'completed'
      },
      {
        title: 'German Embassy Dhaka Interview',
        description: 'Interview and biometric enrollment completed at German Embassy Baridhara.',
        date: '05 Oct 2026',
        status: 'completed'
      },
      {
        title: 'Opportunity Card Visa Stamped',
        description: 'D-Visa stamped in passport. Ready for collection with travel insurance certificate.',
        date: '27 Oct 2026',
        status: 'completed'
      }
    ]
  }
};
