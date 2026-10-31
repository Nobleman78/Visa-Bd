export interface Testimonial {
  id: string;
  name: string;
  role: string;
  visaType: string;
  country: string;
  flag: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Md. Jaman Sheikh',
    role: 'Automotive Technician',
    visaType: 'Specified Skilled Worker (SSW-1)',
    country: 'Japan',
    flag: '🇯🇵',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'VisaBD handled my entire Japanese SSW file from Prometric skill test registration to COE release in Tokyo. Their case officer guided me step by step with zero hidden costs.',
    date: '15 Oct 2026'
  },
  {
    id: 'test-2',
    name: 'Sabrina Hossain',
    role: 'Full-Stack Software Engineer',
    visaType: 'Chancenkarte (Opportunity Card)',
    country: 'Germany',
    flag: '🇩🇪',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'I was overwhelmed by German points assessment and blocked account paperwork. VisaBD prepared my dossier so cleanly that my visa was stamped within 3 weeks of my embassy interview.',
    date: '02 Oct 2026'
  },
  {
    id: 'test-3',
    name: 'Tanvir Ahmed',
    role: 'Construction Supervisor',
    visaType: 'EU Work Authorization (Schengen)',
    country: 'Romania',
    flag: '🇷🇴',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'From work permit to police clearance and VFS submission, everything was completed transparently. Now working in Bucharest with employer-provided housing. Highly recommended agency!',
    date: '28 Sep 2026'
  },
  {
    id: 'test-4',
    name: 'Arifur Rahman',
    role: 'Digital Marketing Strategist',
    visaType: '5-Year Green Residence Visa',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'Secured my UAE Green Visa in under 18 days. The live tracking portal kept me updated throughout the medical fitness and Emirates ID biometrics steps in Dubai.',
    date: '10 Sep 2026'
  }
];
