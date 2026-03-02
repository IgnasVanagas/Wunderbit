import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import logoWordmarkOrange from '../branding/wb-orange_1@4x.png';
import logoWordmarkWhite from '../branding/wb-white_1@4x.png';
import logoMarkWhite from '../branding/w-white_1@4x.png';

type Language = 'en' | 'lt';

const LANGUAGES: Array<{ code: Language; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'lt', label: 'LT' }
] as const;

const NAV_ITEMS = [
  { href: '#intro', label: { en: 'Overview', lt: 'Apžvalga' } },
  { href: '#showcase', label: { en: 'Client Wins', lt: 'Rezultatai' } },
  { href: '#story', label: { en: 'Offer', lt: 'Pasiūlymas' } },
  { href: '#type', label: { en: 'Method', lt: 'Metodika' } },
  { href: '#contact', label: { en: 'Contact', lt: 'Kontaktai' } }
] as const;

const HERO_CONTENT = {
  badge: { en: 'Private revenue atelier', lt: 'Privati pajamų studija' },
  title: {
    en: 'Elite digital experiences that convert decisive leads.',
    lt: 'Elitinės skaitmeninės patirtys, kurios paverčia apsisprendusius klientus.'
  },
  lead: {
    en: 'We partner with founders who treat attention as capital. Our team engineers premium funnels, sharpens messaging, and trains yours to sustain disciplined momentum.',
    lt: 'Dirbame su vadovais, kurie dėmesį laiko kapitalu. Kuriame premium piltuvus, aštriname žinutes ir apmokome jūsų komandą išlaikyti disciplinuotą tempą.'
  },
  actions: [
    {
      href: '#contact',
      label: {
        en: 'Start the executive diagnostic',
        lt: 'Pradėti vadovų diagnostiką'
      }
    },
    {
      href: '#showcase',
      label: {
        en: 'See recent wins',
        lt: 'Peržiūrėti laimėjimus'
      }
    }
  ],
  card: {
    kicker: { en: 'Reserved capacity', lt: 'Rezervuota galia' },
    title: { en: 'Conversion blueprints for the few', lt: 'Konversijų planai išrinktiesiems' },
    body: {
      en: 'Victory belongs to brands willing to choreograph every touchpoint.',
      lt: 'Pergalė priklauso prekių ženklams, kurie režisuoja kiekvieną sąlytį.'
    },
    list: [
      {
        en: 'Luxury positioning sprints',
        lt: 'Prabangos pozicionavimo sprintai'
      },
      {
        en: 'Executive enablement rituals',
        lt: 'Vadovų įgalinimo ritualai'
      },
      {
        en: 'Deal visibility dashboards',
        lt: 'Sandorių matomumo suvestinės'
      }
    ],
    ribbon: {
      en: 'Wunderbit private revenue lab',
      lt: 'Wunderbit privati pajamų laboratorija'
    }
  }
} as const;

const HERO_METRICS = [
  {
    label: {
      en: 'Qualified leads in 90 days',
      lt: 'Kvalifikuoti kontaktai per 90 dienų'
    },
    value: {
      en: '3.4x lift',
      lt: '3,4 karto augimas'
    }
  },
  {
    label: {
      en: 'Average deal size',
      lt: 'Vidutinė sandorio vertė'
    },
    value: {
      en: '+48% premium',
      lt: '+48 % aukštesnė vertė'
    }
  },
  {
    label: {
      en: 'Sales cycle reduction',
      lt: 'Pardavimų ciklo sutrumpėjimas'
    },
    value: {
      en: '-27 days',
      lt: '-27 dienos'
    }
  }
] as const;

const HERO_PILLARS = [
  {
    title: {
      en: 'Private funnel architecture',
      lt: 'Privati piltuvėlio architektūra'
    },
    description: {
      en: 'Bespoke lead journeys engineered for high-consideration purchases.',
      lt: 'Individualūs klientų keliai, sukurti didelės vertės sprendimams.'
    }
  },
  {
    title: { en: 'Executive enablement', lt: 'Vadovų įgalinimas' },
    description: {
      en: 'Playbooks, scripts, and rituals that keep senior teams accountable.',
      lt: 'Vadovų komandas laikantys atsakomybėje planai, skriptai ir ritualai.'
    }
  },
  {
    title: { en: 'Measurement with meaning', lt: 'Sąmoningas matavimas' },
    description: {
      en: 'North-star dashboards and weekly reviews tied to revenue outcomes.',
      lt: 'Svarbiausi rodiklių skydai ir savaitinės apžvalgos, susietos su pajamomis.'
    }
  }
] as const;

const HERO_MARQUEE = {
  en: ['Elite conversion', 'Private funnels', 'Luxury positioning', 'Vilnius excellence'],
  lt: ['Elitinė konversija', 'Privatūs piltuvai', 'Prabangos pozicionavimas', 'Vilniaus meistrystė']
} as const;

const HEADER_CTA = { en: 'Start a project', lt: 'Pradėti projektą' } as const;

const SHOWCASE_ITEMS = [
  {
    theme: 'theme-orbit',
    tag: { en: 'Wealth tech', lt: 'Finansų technologijos' },
    title: 'Siena Capital',
    copy: {
      en: 'Tripled UHNW consultations in eight weeks with a concierge-grade booking flow.',
      lt: 'Per aštuonias savaites tris kartus padidinome itin turtingų klientų konsultacijas sukūrę konsjeržo lygio registracijos procesą.'
    },
    bullets: [
      { en: 'Private scoring portal for advisors', lt: 'Privatus konsultantų vertinimo portalas' },
      { en: 'Luxury nurture journeys with scarcity cues', lt: 'Prabangūs išlaikymo keliai su išskirtinumo signalais' },
      { en: 'Executive dashboard for daily deal health', lt: 'Vadovų suvestinė kasdienei sandorių būklei' }
    ]
  },
  {
    theme: 'theme-ember',
    tag: { en: 'Luxury retail', lt: 'Prabangios mažmena' },
    title: 'Velvet Atelier',
    copy: {
      en: 'Grew premium conversion by 61% through narrative-led ecommerce and VIP care.',
      lt: 'Padidinome premium konversiją 61 %, sukūrę pasakojimu paremtą el. prekybą ir VIP aptarnavimą.'
    },
    bullets: [
      { en: 'High-touch clienteling CRM', lt: 'Asmeninis klientų CRM' },
      { en: 'Story-driven launch playbooks', lt: 'Pasakojimu paremti paleidimo scenarijai' },
      { en: 'Mobile-first VIP checkout', lt: 'Mobilus VIP atsiskaitymas' }
    ]
  },
  {
    theme: 'theme-atelier',
    tag: { en: 'B2B SaaS', lt: 'B2B SaaS' },
    title: 'Northwind Ops',
    copy: {
      en: 'Cut onboarding time in half by aligning product tours, coaching, and enablement.',
      lt: 'Perpus sutrumpinome įkėlimą suderinę produkto pristatymus, mokymus ir įgalinimą.'
    },
    bullets: [
      { en: 'Deal-desk workflow automation', lt: 'Sandorių vadybos automatizacija' },
      { en: 'Signals-based success coaching', lt: 'Signalais paremta sėkmės konsultacija' },
      { en: 'Executive KPI command center', lt: 'Vadovų KPI valdymo centras' }
    ]
  },
  {
    theme: 'theme-lucent',
    tag: { en: 'Hospitality', lt: 'Svetingumas' },
    title: 'Meridian Suites',
    copy: {
      en: 'Raised direct bookings 44% by mirroring the premium stay across every touchpoint.',
      lt: 'Padidinome tiesioginius užsakymus 44 %, visus kontaktus suderinę su premium viešnage.'
    },
    bullets: [
      { en: 'Personalized itinerary builder', lt: 'Personalizuotas maršrutų planuotojas' },
      { en: 'Real-time status messaging', lt: 'Pranešimai realiu laiku' },
      { en: 'Mobile concierge microsite', lt: 'Mobilus konsjeržo mikro puslapis' }
    ]
  }
] as const;

const SHOWCASE_IMAGES = [
  {
    src: '/assets/55-Xw1gOa4Q.png',
    href: 'https://55projektai.lt/',
    alt: { en: 'Leadership summit strategy board', lt: 'Lyderystės strategijos lenta' }
  },
  {
    src: '/assets/currus-DHJaXZGE.png',
    href: 'https://currus.lt/',
    alt: { en: 'Premium hospitality lobby experience', lt: 'Prabangaus svetingumo fojė patirtis' }
  },
  {
    src: '/assets/faster-Bb2VbFfk.png',
    href: 'https://faster.fitness/',
    alt: { en: 'Revenue team aligning launch data', lt: 'Pajamų komanda derina paleidimo duomenis' }
  },
  {
    src: '/assets/kaliadziuk-BzMTc9yp.png',
    href: 'https://kaliadziuk.lt/lt',
    alt: { en: 'Executive working session details', lt: 'Vadovų darbo sesijos detalės' }
  }
] as const;

const OFFER_POINTS = [
  {
    heading: { en: 'Only for market shapers', lt: 'Tik rinkos formuotojams' },
    body: {
      en: 'We partner with leaders who protect their time, demand discretion, and invest in premium perception.',
      lt: 'Dirbame su lyderiais, kurie saugo savo laiką, vertina diskretiškumą ir investuoja į premium įvaizdį.'
    }
  },
  {
    heading: { en: 'Lead systems that close', lt: 'Uždarančios piltuvų sistemos' },
    body: {
      en: 'Positioning, paid, outbound, and nurture move in concert to convert high-consideration buyers.',
      lt: 'Pozicionavimas, reklama, outbound ir palaikymas veikia kartu, kad įtikintų aukštos vertės pirkėjus.'
    }
  },
  {
    heading: { en: 'Lithuanian roots, global reach', lt: 'Lietuviškos šaknys, pasaulinis mastas' },
    body: {
      en: 'Vilnius-based, trusted by international brands seeking discreet acceleration and measurable growth.',
      lt: 'Įsikūrę Vilniuje, dirbame su tarptautiniais prekių ženklais, siekiančiais diskretiško ir pamatuojamo augimo.'
    }
  }
] as const;

const METHOD_STEPS = [
  {
    phase: { en: '01. Evidence sprint', lt: '01. Įrodymų sprintas' },
    detail: {
      en: 'Within 14 days we audit funnels, messaging, and ops to surface the leaks blocking premium buyers.',
      lt: 'Per 14 dienų audituojame piltuvus, žinutes ir operacijas, kad rastume kliūtis, stabdančias premium pirkėjus.'
    }
  },
  {
    phase: { en: '02. Signature architecture', lt: '02. Parašas architektūroje' },
    detail: {
      en: 'We design scarcity-backed journeys, revenue dashboards, and enablement rituals for your team.',
      lt: 'Kuriame retumu paremtus kelius, pajamų suvestines ir komandos ritualus.'
    }
  },
  {
    phase: { en: '03. Launch and refine', lt: '03. Paleidimas ir tobulinimas' },
    detail: {
      en: 'Weekly partner sessions align experiments, track impact, and keep momentum disciplined.',
      lt: 'Savaitiniai partnerių susitikimai derina eksperimentus, matuoja poveikį ir išlaiko discipliną.'
    }
  },
  {
    phase: { en: '04. Scale with confidence', lt: '04. Skaluokite užtikrintai' },
    detail: {
      en: 'We coach internal teams to own the system while remaining on call for premium enhancements.',
      lt: 'Mokome vidines komandas valdyti sistemą ir liekame pasiekiami premium patobulinimams.'
    }
  }
] as const;

const METHOD_DELIVERABLES = [
  { en: 'Executive conversion dashboard', lt: 'Vadovų konversijų suvestinė' },
  { en: 'Premium messaging frameworks', lt: 'Premium žinučių struktūros' },
  { en: 'Revenue enablement scripts', lt: 'Pajamų įgalinimo skriptai' },
  { en: '90-day acceleration roadmap', lt: '90 dienų spartinimo planas' }
] as const;

const METHOD_CARD = {
  heading: { en: 'What you receive', lt: 'Ką gaunate' },
  note: {
    en: 'Guided by a senior partner each week.',
    lt: 'Kiekvieną savaitę dirbame su vyresniuoju partneriu.'
  }
} as const;

const SHOWCASE_COPY = {
  eyebrow: { en: 'Client wins', lt: 'Rezultatai' },
  heading: {
    en: 'Lead systems engineered for premium revenue',
    lt: 'Premium pajamoms sukurti piltuvai'
  },
  body: {
    en: 'We design, launch, and scale high-consideration funnels that protect brand equity while compounding pipeline.',
    lt: 'Kuriame, paleidžiame ir plečiame aukštos vertės piltuvus, kurie saugo prekės ženklo prestižą ir didina pardavimo vamzdyną.'
  }
} as const;

const OFFER_INTRO = {
  eyebrow: { en: 'Offer', lt: 'Pasiūlymas' },
  heading: {
    en: 'Premium growth reserved for committed teams',
    lt: 'Premium augimas skiriamas įsipareigojusioms komandoms'
  },
  body: {
    en: 'We collaborate with founders and marketing leaders prepared to invest in rare, defensible experiences.',
    lt: 'Dirbame su vadovais ir marketingo lyderiais, pasirengusiais investuoti į retas, apsaugomas patirtis.'
  },
  quote: {
    en: 'Victory favours brands who treat attention as an asset.',
    lt: 'Pergalė lydi ženklus, kurie dėmesį laiko turtu.'
  },
  note: {
    en: 'Sessions run in English or Lithuanian—your choice.',
    lt: 'Sesijas vedame anglų arba lietuvių kalba – pagal jūsų pasirinkimą.'
  }
} as const;

const OFFER_CTA = { en: 'Request a private proposal', lt: 'Paprašyti privataus pasiūlymo' } as const;

const METHOD_INTRO = {
  eyebrow: { en: 'Method', lt: 'Metodika' },
  heading: {
    en: 'Four disciplined moves to unlock premium demand',
    lt: 'Keturi disciplinuoti žingsniai premium paklausai atrakinti'
  },
  body: {
    en: 'Evidence, architecture, launch, and scale—each stage is accountable to measurable revenue.',
    lt: 'Įrodymai, architektūra, paleidimas ir mastelis – kiekvienas etapas siejamas su pamatuojamomis pajamomis.'
  }
} as const;

type QuestionnairePhase = 'A' | 'B' | 'C';
type QuestionnaireQuestionType = 'single' | 'text' | 'scale';

type QuestionnaireQuestion = {
  id: string;
  phase: QuestionnairePhase;
  type: QuestionnaireQuestionType;
  required?: boolean;
  dependsOn?: {
    questionId: string;
    values: string[];
  };
  prompt: Record<Language, string>;
  helpText?: Record<Language, string>;
  placeholder?: Record<Language, string>;
  options?: Array<{ value: string; label: Record<Language, string> }>;
};

const QUESTIONNAIRE_COPY = {
  eyebrow: { en: 'Questionnaire', lt: 'Klausimynas' },
  heading: {
    en: 'Project Questionnaire',
    lt: 'Projekto klausimynas'
  },
  body: {
    en: 'Answer the questions below and we will prepare a tailored solution proposal.',
    lt: 'Atsakykite į žemiau pateiktus klausimus ir paruošime jums individualų sprendimo pasiūlymą.'
  },
  stepLabel: { en: 'Step', lt: 'Žingsnis' },
  requiredHint: {
    en: 'Please answer to continue.',
    lt: 'Norėdami tęsti, pateikite atsakymą.'
  },
  prev: { en: 'Previous', lt: 'Atgal' },
  next: { en: 'Next', lt: 'Toliau' },
  submit: { en: 'Submit questionnaire', lt: 'Pateikti klausimyną' },
  successTitle: {
    en: 'Thank you. Your questionnaire has been received.',
    lt: 'Ačiū. Jūsų klausimynas sėkmingai gautas.'
  },
  successBody: {
    en: 'Our team will review your answers and contact you with next steps.',
    lt: 'Mūsų komanda peržiūrės jūsų atsakymus ir susisieks su tolimesniais žingsniais.'
  },
  backHome: { en: 'Back to home', lt: 'Grįžti į pradžią' },
  switchQuestionnaire: { en: 'Switch questionnaire', lt: 'Keisti klausimyną' }
} as const;

const QUESTIONNAIRE_HUB_COPY = {
  eyebrow: { en: 'Questionnaire', lt: 'Klausimynas' },
  heading: {
    en: 'Choose your questionnaire',
    lt: 'Pasirinkite klausimyną'
  },
  body: {
    en: 'Pick the flow that best matches your situation and we will follow up with next steps.',
    lt: 'Pasirinkite jums tinkamiausią eigą ir susisieksime su tolimesniais žingsniais.'
  },
  phaseAAction: { en: 'Open discovery questionnaire', lt: 'Atidaryti diagnostikos klausimyną' },
  phaseBAction: { en: 'Open project questionnaire', lt: 'Atidaryti projekto klausimyną' },
  phaseCAction: { en: 'Open strategic questionnaire', lt: 'Atidaryti strateginį klausimyną' }
} as const;

const CONTACT_COPY = {
  eyebrow: { en: 'Contact', lt: 'Kontaktai' },
  heading: { en: "Let’s build something great", lt: 'Sukurkime kažką ypatingo' },
  body: {
    en: "Tell us about your project, goals, or requirements. We’re here to help you grow.",
    lt: 'Papasakokite apie savo projektą, tikslus ar reikalavimus. Esame čia, kad padėtume jums augti.'
  },
  consultation: { en: '60-minute free consultation — no payment required', lt: '60 minučių nemokama konsultacija — mokėti nereikia' },
  emailLabel: { en: 'Work email', lt: 'Darbo el. paštas' },
  emailPlaceholder: { en: 'hello@brand.com', lt: 'hello@brand.com' },
  messageLabel: { en: 'Project details', lt: 'Projekto detalės' },
  messagePlaceholder: { en: 'Website redesign, new e-shop, SEO services...', lt: 'Svetainės atnaujinimas, nauja el. parduotuvė, SEO paslaugos...' },
  submit: { idle: { en: 'Send message', lt: 'Siųsti žinutę' }, success: { en: 'Message sent', lt: 'Žinutė išsiųsta' } },
  meta: { en: 'Wunderbit Digital · Global', lt: 'Wunderbit Digital · Pasaulis' }
} as const;

const QUESTIONNAIRE_PHASES: Record<
  QuestionnairePhase,
  {
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
  }
> = {
  A: {
    title: {
      en: 'Business Process Efficiency Audit',
      lt: 'Verslo procesų efektyvumo auditas'
    },
    subtitle: {
      en: 'Discovery questionnaire',
      lt: 'Verslo diagnostika'
    }
  },
  B: {
    title: {
      en: 'Project questionnaire',
      lt: 'Projekto klausimynas'
    },
    subtitle: {
      en: 'Project intake',
      lt: 'Projekto įvertinimas'
    }
  },
  C: {
    title: {
      en: 'Strategic project questionnaire',
      lt: 'Strateginis projekto klausimynas'
    },
    subtitle: {
      en: 'Comprehensive project classification',
      lt: 'Išsamus projekto klasifikavimas'
    }
  }
};

const QUESTIONNAIRE_QUESTIONS: QuestionnaireQuestion[] = [
  {
    id: 'phaseA_timeSink',
    phase: 'A',
    type: 'single',
    prompt: {
      en: 'Which activity consumes the most time for your team?',
      lt: 'Kokia veikla jūsų komandai atima daugiausia laiko?'
    },
    options: [
      {
        value: 'repeated-questions',
        label: {
          en: 'Answering repetitive client questions',
          lt: 'Atsakinėjimas į pasikartojančius klientų klausimus'
        }
      },
      {
        value: 'manual-data-entry',
        label: {
          en: 'Manual data entry',
          lt: 'Duomenų vedimas rankiniu būdu'
        }
      },
      {
        value: 'cold-outreach',
        label: {
          en: 'Cold prospecting',
          lt: 'Šaltų kontaktų paieška'
        }
      },
      {
        value: 'invoice-doc-management',
        label: {
          en: 'Invoice and document management',
          lt: 'Sąskaitų ir dokumentų valdymas'
        }
      }
    ]
  },
  {
    id: 'phaseA_website_score',
    phase: 'A',
    type: 'scale',
    prompt: {
      en: 'How would you rate your current website on a scale from 1 to 10?',
      lt: 'Kaip vertinate savo dabartinę svetainę skalėje nuo 1 iki 10?'
    },
    helpText: {
      en: '1 = It is only a business card. 10 = It is our main sales engine.',
      lt: '1 = Tai tik vizitinė kortelė. 10 = Tai pagrindinis mūsų pardavimų įrankis.'
    }
  },
  {
    id: 'phaseA_247_answers',
    phase: 'A',
    type: 'single',
    prompt: {
      en: 'Can a potential client visiting your website get answers 24/7 without your direct involvement?',
      lt: 'Ar jūsų svetainėje apsilankęs potencialus klientas gali gauti atsakymus į klausimus 24/7 be jūsų įsikišimo?'
    },
    options: [
      { value: 'yes', label: { en: 'Yes', lt: 'Taip' } },
      { value: 'no', label: { en: 'No', lt: 'Ne' } },
      {
        value: 'want-ai-assistant',
        label: {
          en: 'We would like to implement an AI assistant',
          lt: 'Norėtume įdiegti AI asistentą'
        }
      }
    ]
  },
  {
    id: 'phaseA_inquiry_time',
    phase: 'A',
    type: 'single',
    prompt: {
      en: 'How much time do you typically spend processing one new inquiry?',
      lt: 'Kiek vidutiniškai laiko sugaištate apdorodami vieną naują užklausą?'
    },
    options: [
      { value: 'under-5', label: { en: '<5 min', lt: '<5 min' } },
      { value: '5-30', label: { en: '5–30 min', lt: '5–30 min' } },
      { value: 'over-60', label: { en: 'Over 1 hour', lt: 'Virš valandos' } },
      {
        value: 'not-systemized',
        label: {
          en: 'The process is not systemized',
          lt: 'Procesas nėra sistemizuotas'
        }
      }
    ]
  },
  {
    id: 'phaseA_day_change',
    phase: 'A',
    type: 'text',
    prompt: {
      en: 'If your website started automatically qualifying clients and booking meetings tomorrow, how would that change your workday?',
      lt: 'Jei rytoj jūsų svetainė pradėtų automatiškai kvalifikuoti klientus ir registruoti juos susitikimams, kaip tai pakeistų jūsų darbo dieną?'
    },
    placeholder: {
      en: 'Share the impact on your time, team focus, and sales process…',
      lt: 'Aprašykite poveikį jūsų laikui, komandos fokusui ir pardavimų procesui…'
    }
  },
  {
    id: 'phaseA_tools',
    phase: 'A',
    type: 'text',
    prompt: {
      en: 'Which digital tools are currently your operational backbone? (e.g., CRM, Slack, Excel, specialized tools)',
      lt: 'Kokie skaitmeniniai įrankiai šiuo metu yra jūsų „stuburas“? (Pvz., CRM, Slack, Excel, specializuotos programos)'
    },
    placeholder: {
      en: 'List tools and systems your team uses every day…',
      lt: 'Išvardykite įrankius ir sistemas, kurias komanda naudoja kasdien…'
    }
  },
  {
    id: 'phaseB_goal',
    phase: 'B',
    type: 'single',
    prompt: {
      en: 'What is your main business ambition this year?',
      lt: 'Kokia jūsų verslo pagrindinė ambicija šiais metais?'
    },
    options: [
      {
        value: 'web-design',
        label: {
          en: 'Top-level digital image (Web Design)',
          lt: 'Aukščiausio lygio skaitmeninis įvaizdis (Web Design)'
        }
      },
      {
        value: 'ecommerce-leadgen',
        label: {
          en: 'A more efficient sales channel (E-commerce / Lead Gen)',
          lt: 'Efektyvesnis pardavimų kanalas (E-komercija / Lead Gen)'
        }
      },
      {
        value: 'web-app-systems',
        label: {
          en: 'Digitalizing internal processes (Web app / Systems)',
          lt: 'Vidinių procesų skaitmenizavimas (Web aplikacija / Sistemos)'
        }
      }
    ]
  },
  {
    id: 'phaseB_current_state',
    phase: 'B',
    type: 'single',
    prompt: {
      en: 'What is your current online situation?',
      lt: 'Kokia jūsų dabartinė situacija internete?'
    },
    options: [
      {
        value: 'no-website',
        label: {
          en: 'We do not have a website yet — starting from zero.',
          lt: 'Svetainės neturime – pradedame nuo nulio.'
        }
      },
      {
        value: 'outdated-website',
        label: {
          en: 'We have a website, but it is outdated and not doing its job.',
          lt: 'Svetainė yra, bet ji pasenusi ir neatlieka savo funkcijos.'
        }
      },
      {
        value: 'slow-system',
        label: {
          en: 'We have a system, but it is slow or processes are still manual.',
          lt: 'Turime sistemą, bet ji veikia lėtai arba procesai vis tiek vyksta rankiniu būdu.'
        }
      }
    ]
  },
  {
    id: 'phaseB_timeline',
    phase: 'B',
    type: 'single',
    prompt: {
      en: 'When do you plan to start the new project?',
      lt: 'Kada planuojate startuoti su nauju projektu?'
    },
    options: [
      {
        value: 'urgent',
        label: {
          en: 'Urgently (needed yesterday)',
          lt: 'Skubiai (reikia vakar)'
        }
      },
      {
        value: '1-3-months',
        label: {
          en: 'Soon (within 1–3 months)',
          lt: 'Artimiausiu metu (per 1–3 mėn.)'
        }
      },
      {
        value: 'exploring',
        label: {
          en: 'We are only exploring options for now',
          lt: 'Kol kas tik domimės galimybėmis'
        }
      }
    ]
  },
  {
    id: 'phaseB_email',
    phase: 'B',
    type: 'text',
    prompt: {
      en: 'How can we contact you to discuss the solution? Email:',
      lt: 'Kaip galėčiau su jumis susisiekti ir aptarti sprendimą? El. paštas:'
    },
    placeholder: {
      en: 'name@company.com',
      lt: 'vardas@imone.lt'
    }
  },
  {
    id: 'phaseB_phone',
    phase: 'B',
    type: 'text',
    required: false,
    prompt: {
      en: 'Phone (optional):',
      lt: 'Telefonas (nebūtinas):'
    },
    placeholder: {
      en: '+370...',
      lt: '+370...'
    }
  },
  {
    id: 'phaseC_archetype',
    phase: 'C',
    type: 'single',
    prompt: {
      en: 'Stage 1 — Project classification: what are we planning to build?',
      lt: '1 etapas — Projekto klasifikacija: ką planuojame kurti?'
    },
    options: [
      {
        value: 'representational',
        label: {
          en: 'Representational website / Portfolio',
          lt: 'Reprezentacinė svetainė / Portfolio'
        }
      },
      {
        value: 'services-portal',
        label: {
          en: 'Business services portal',
          lt: 'Verslo paslaugų portalas'
        }
      },
      {
        value: 'web-application',
        label: {
          en: 'Web application / Custom system',
          lt: 'Web aplikacija / Individuali sistema'
        }
      },
      {
        value: 'ecommerce',
        label: {
          en: 'E-commerce project',
          lt: 'E-komercijos projektas'
        }
      }
    ]
  },
  {
    id: 'phaseC_business_problem',
    phase: 'C',
    type: 'text',
    prompt: {
      en: 'Stage 2 — Main challenge: what core business issue should this project solve?',
      lt: '2 etapas — Problema: kokį pagrindinį verslo iššūkį šis projektas turi išspręsti?'
    },
    placeholder: {
      en: 'Describe the business bottleneck this project must remove…',
      lt: 'Aprašykite pagrindinę verslo kliūtį, kurią projektas turi pašalinti…'
    }
  },
  {
    id: 'phaseC_success_metric',
    phase: 'C',
    type: 'text',
    prompt: {
      en: 'How will we measure success after 6 months?',
      lt: 'Sėkmės rodiklis: kaip po 6 mėnesių pamatuosime, kad projektas buvo sėkmingas?'
    },
    placeholder: {
      en: 'Examples: +20% inquiries, -30% support calls…',
      lt: 'Pvz.: +20 % užklausų, -30 % aptarnavimo skambučių…'
    }
  },
  {
    id: 'phaseC_audience',
    phase: 'C',
    type: 'text',
    prompt: {
      en: 'Who is your ideal client and what are their core pain points?',
      lt: 'Auditorija: kas yra jūsų idealus klientas ir kokie jo pagrindiniai „skausmo taškai“?'
    },
    placeholder: {
      en: 'Describe target segments, decision factors, and pains…',
      lt: 'Aprašykite segmentus, sprendimo motyvus ir „skausmus“…'
    }
  },
  {
    id: 'phaseC_competition',
    phase: 'C',
    type: 'text',
    prompt: {
      en: 'Name 3 competitors. What frustrates you in their digital presence?',
      lt: 'Konkurencija: nurodykite 3 konkurentus. Kas jų skaitmeniniame įvaizdyje jus erzina?'
    },
    placeholder: {
      en: 'Competitor names + notes on weak points…',
      lt: 'Konkurentų pavadinimai + pastebėjimai apie silpnąsias vietas…'
    }
  },
  {
    id: 'phaseC_repr_content_volume',
    phase: 'C',
    type: 'single',
    dependsOn: {
      questionId: 'phaseC_archetype',
      values: ['representational']
    },
    prompt: {
      en: 'Stage 3 — Representational site: how many projects will be showcased?',
      lt: '3 etapas — Reprezentacinė svetainė: kiek projektų/darbų bus eksponuojama?'
    },
    options: [
      { value: 'up-to-10', label: { en: 'Up to 10', lt: 'Iki 10' } },
      { value: '10-30', label: { en: '10–30', lt: '10–30' } },
      { value: '30-plus', label: { en: '30+', lt: '30+' } }
    ]
  },
  {
    id: 'phaseC_repr_filters',
    phase: 'C',
    type: 'single',
    dependsOn: {
      questionId: 'phaseC_archetype',
      values: ['representational']
    },
    prompt: {
      en: 'Is project filtering needed (by year, type, client)?',
      lt: 'Ar reikalingas projektų filtravimas (pagal metus, tipą, klientą)?'
    },
    options: [
      { value: 'yes', label: { en: 'Yes', lt: 'Taip' } },
      { value: 'no', label: { en: 'No', lt: 'Ne' } }
    ]
  },
  {
    id: 'phaseC_repr_structure',
    phase: 'C',
    type: 'single',
    dependsOn: {
      questionId: 'phaseC_archetype',
      values: ['representational']
    },
    prompt: {
      en: 'Should it be a single-page narrative or a classic multi-page structure?',
      lt: 'Ar tai bus vieno puslapio (single-page) pasakojimas, ar klasikinė daugiasluoksnė svetainė?'
    },
    options: [
      {
        value: 'single-page',
        label: { en: 'Single-page narrative', lt: 'Vieno puslapio pasakojimas' }
      },
      {
        value: 'multi-page',
        label: { en: 'Classic multi-page', lt: 'Klasikinė daugiasluoksnė svetainė' }
      }
    ]
  },
  {
    id: 'phaseC_services_tree',
    phase: 'C',
    type: 'text',
    dependsOn: {
      questionId: 'phaseC_archetype',
      values: ['services-portal']
    },
    prompt: {
      en: 'Stage 3 — Service portal: how many service categories/subcategories do you have?',
      lt: '3 etapas — Verslo paslaugų svetainė: kiek paslaugų kategorijų ir subkategorijų turite?'
    },
    placeholder: {
      en: 'List your service structure…',
      lt: 'Išvardykite paslaugų medį…'
    }
  },
  {
    id: 'phaseC_services_conversion_tools',
    phase: 'C',
    type: 'single',
    dependsOn: {
      questionId: 'phaseC_archetype',
      values: ['services-portal']
    },
    prompt: {
      en: 'Which conversion tools are required?',
      lt: 'Kokie konversijos įrankiai reikalingi?'
    },
    options: [
      {
        value: 'calendar',
        label: { en: 'Calendar integration (e.g., Calendly)', lt: 'Kalendoriaus integracija (pvz., Calendly)' }
      },
      {
        value: 'forms',
        label: { en: 'Inquiry forms', lt: 'Užklausų formos' }
      },
      {
        value: 'live-chat',
        label: { en: 'Live chat', lt: 'Gyvas pokalbis (Live Chat)' }
      }
    ]
  },
  {
    id: 'phaseC_services_content_flow',
    phase: 'C',
    type: 'single',
    dependsOn: {
      questionId: 'phaseC_archetype',
      values: ['services-portal']
    },
    prompt: {
      en: 'Do you plan to run a regular blog/news section?',
      lt: 'Ar planuojate naujienų skiltį / blogą reguliariai komunikacijai?'
    },
    options: [
      { value: 'yes', label: { en: 'Yes', lt: 'Taip' } },
      { value: 'no', label: { en: 'No', lt: 'Ne' } }
    ]
  },
  {
    id: 'phaseC_app_roles',
    phase: 'C',
    type: 'text',
    dependsOn: {
      questionId: 'phaseC_archetype',
      values: ['web-application']
    },
    prompt: {
      en: 'Stage 3 — Web app: list all user roles and what each role should see/do.',
      lt: '3 etapas — Web aplikacija: išvardinkite roles ir ką kiekviena rolė turėtų matyti/daryti.'
    },
    placeholder: {
      en: 'Client, manager, super-admin…',
      lt: 'Klientas, vadybininkas, super-admin…'
    }
  },
  {
    id: 'phaseC_app_core',
    phase: 'C',
    type: 'single',
    dependsOn: {
      questionId: 'phaseC_archetype',
      values: ['web-application']
    },
    prompt: {
      en: 'What is the functional core of the system?',
      lt: 'Kas yra sistemos funkcinis branduolys?'
    },
    options: [
      {
        value: 'data-analysis',
        label: { en: 'Data analysis', lt: 'Duomenų analizė' }
      },
      {
        value: 'automated-calculation',
        label: { en: 'Automated calculations', lt: 'Automatizuotas skaičiavimas' }
      },
      {
        value: 'document-generation',
        label: { en: 'Document generation', lt: 'Dokumentų generavimas' }
      },
      {
        value: 'self-service',
        label: { en: 'Self-service portal', lt: 'Savitarnos kabinetas' }
      }
    ]
  },
  {
    id: 'phaseC_app_security',
    phase: 'C',
    type: 'text',
    dependsOn: {
      questionId: 'phaseC_archetype',
      values: ['web-application']
    },
    prompt: {
      en: 'Are 2FA, IP restrictions, or specific encryption standards required?',
      lt: 'Ar reikalinga 2FA, IP ribojimai ar specifiniai duomenų šifravimo standartai?'
    },
    placeholder: {
      en: 'List security/compliance requirements…',
      lt: 'Išvardykite saugumo ir atitikties reikalavimus…'
    }
  },
  {
    id: 'phaseC_ecom_focus',
    phase: 'C',
    type: 'text',
    dependsOn: {
      questionId: 'phaseC_archetype',
      values: ['ecommerce']
    },
    prompt: {
      en: 'Stage 3 — E-commerce: what is your product catalog structure and complexity?',
      lt: '3 etapas — E-komercija: kokia jūsų produktų katalogo struktūra ir sudėtingumas?'
    },
    placeholder: {
      en: 'Categories, variants, bundles, subscriptions…',
      lt: 'Kategorijos, variantai, rinkiniai, prenumeratos…'
    }
  },
  {
    id: 'phaseC_ecom_checkout',
    phase: 'C',
    type: 'text',
    dependsOn: {
      questionId: 'phaseC_archetype',
      values: ['ecommerce']
    },
    prompt: {
      en: 'Which checkout and payment flows are required?',
      lt: 'Kokie atsiskaitymo ir mokėjimo scenarijai reikalingi?'
    },
    placeholder: {
      en: 'Payment providers, shipping logic, invoicing…',
      lt: 'Mokėjimų tiekėjai, pristatymo logika, sąskaitos…'
    }
  },
  {
    id: 'phaseC_ecom_growth',
    phase: 'C',
    type: 'text',
    dependsOn: {
      questionId: 'phaseC_archetype',
      values: ['ecommerce']
    },
    prompt: {
      en: 'What retention and growth mechanics do you need?',
      lt: 'Kokius išlaikymo ir augimo mechanizmus planuojate?'
    },
    placeholder: {
      en: 'Loyalty, upsells, abandoned cart, remarketing…',
      lt: 'Lojalumas, upsell, apleistas krepšelis, remarketingas…'
    }
  },
  {
    id: 'phaseC_brand_identity',
    phase: 'C',
    type: 'single',
    prompt: {
      en: 'Stage 4 — Brand identity status:',
      lt: '4 etapas — Identitetas:'
    },
    options: [
      {
        value: 'full-brandbook',
        label: { en: 'We have a complete brandbook', lt: 'Turime visą prekės ženklo knygą (Brandbook)' }
      },
      {
        value: 'logo-only',
        label: { en: 'Only logo exists, style system is needed', lt: 'Turime tik logotipą, reikia papildomo stiliaus kūrimo' }
      },
      {
        value: 'from-scratch',
        label: { en: 'No assets, we need strategic branding from zero', lt: 'Neturime nieko, reikės kurti nuo nulio (Strateginis brandingas)' }
      }
    ]
  },
  {
    id: 'phaseC_visual_assets',
    phase: 'C',
    type: 'single',
    prompt: {
      en: 'Visual content availability:',
      lt: 'Vizualinis turinys:'
    },
    options: [
      {
        value: 'own-pro-material',
        label: { en: 'We have professional photos/videos', lt: 'Turime savo profesionalią medžiagą (nuotraukas, video)' }
      },
      {
        value: 'stock-search',
        label: { en: 'Use paid stock (agency handles sourcing)', lt: 'Naudosime mokamas stock nuotraukas (Agentūra atlieka paiešką)' }
      },
      {
        value: 'production-needed',
        label: { en: 'Need photo/video production', lt: 'Reikalinga fotosesija ir video gamyba (Wunderbit paslaugos)' }
      }
    ]
  },
  {
    id: 'phaseC_copy_assets',
    phase: 'C',
    type: 'single',
    prompt: {
      en: 'Text content readiness:',
      lt: 'Tekstinis turinys:'
    },
    options: [
      {
        value: 'ready-seo-copy',
        label: { en: 'We provide complete SEO-optimized copy', lt: 'Pateiksime pilnai paruoštus ir SEO optimizuotus tekstus' }
      },
      {
        value: 'drafts-editing',
        label: { en: 'We have drafts that need editing', lt: 'Turime juodraščius, reikės jų sutvarkymo/redagavimo' }
      },
      {
        value: 'copywriting-from-zero',
        label: { en: 'Need professional SEO copywriting from zero', lt: 'Reikės profesionalaus SEO copywritingo nuo nulio' }
      }
    ]
  },
  {
    id: 'phaseC_integrations',
    phase: 'C',
    type: 'text',
    prompt: {
      en: 'Stage 5 — List all systems that must be integrated (CRM, Pipedrive, Stripe, accounting, external APIs).',
      lt: '5 etapas — Ekosistema: įrašykite visas sistemas, kurios turi būti sujungtos su svetaine (CRM, Pipedrive, Stripe, buhalterija, išoriniai API).'
    },
    placeholder: {
      en: 'Integration list with priorities…',
      lt: 'Integracijų sąrašas su prioritetais…'
    }
  },
  {
    id: 'phaseC_seo_ambition',
    phase: 'C',
    type: 'single',
    prompt: {
      en: 'SEO ambition level:',
      lt: 'SEO ambicija:'
    },
    options: [
      {
        value: 'basic-tech-seo',
        label: { en: 'Basic technical setup', lt: 'Bazinis techninis paruošimas (Standartinė atitiktis)' }
      },
      {
        value: 'max-seo-package',
        label: { en: 'Maximum SEO package', lt: 'Maksimalus SEO paketas (Raktažodžių tyrimas, turinio strategija, pozicijų sekimas)' }
      }
    ]
  },
  {
    id: 'phaseC_multilingual',
    phase: 'C',
    type: 'text',
    prompt: {
      en: 'How many languages are required and who handles professional translation (client or Wunderbit)?',
      lt: 'Daugiakalbiškumas: kiek kalbų reikės ir kas atliks profesionalų vertimą (Klientas ar Wunderbit)?'
    },
    placeholder: {
      en: 'Language count + translation ownership…',
      lt: 'Kalbų skaičius + vertimo atsakomybė…'
    }
  },
  {
    id: 'phaseC_accessibility',
    phase: 'C',
    type: 'single',
    prompt: {
      en: 'Must the website comply with WCAG 2.2 AA?',
      lt: 'Ar svetainė turi atitikti WCAG 2.2 AA standartus?'
    },
    helpText: {
      en: 'Typically required for public sector and many EU-funded projects.',
      lt: 'Dažnai privaloma viešajam sektoriui ir ES projektams.'
    },
    options: [
      { value: 'required', label: { en: 'Yes, required', lt: 'Taip, privaloma' } },
      { value: 'not-required', label: { en: 'Not required', lt: 'Neprivaloma' } },
      { value: 'unsure', label: { en: 'Not sure yet', lt: 'Dar nežinome' } }
    ]
  },
  {
    id: 'phaseC_decision_makers',
    phase: 'C',
    type: 'text',
    prompt: {
      en: 'Stage 6 — Who is responsible for interim approvals and final acceptance?',
      lt: '6 etapas — Sprendimų priėmėjai: kas atsakingas už tarpinius patvirtinimus ir galutinį priėmimą?'
    },
    placeholder: {
      en: 'List roles/names and approval sequence…',
      lt: 'Išvardykite roles/vardus ir tvirtinimo eigą…'
    }
  },
  {
    id: 'phaseC_deadline',
    phase: 'C',
    type: 'text',
    prompt: {
      en: 'Deadline: when must the project go live, and is this date flexible?',
      lt: 'Terminas: kada projektas privalo startuoti ir ar ši data lanksti?'
    },
    placeholder: {
      en: 'Target launch date + flexibility constraints…',
      lt: 'Pageidaujama starto data + lankstumo ribos…'
    }
  },
  {
    id: 'phaseC_budget_range',
    phase: 'C',
    type: 'single',
    prompt: {
      en: 'Budget: choose your investment range',
      lt: 'Biudžetas: pasirinkite investicijų rėmus'
    },
    options: [
      { value: 'up-to-5k', label: { en: 'Up to €5,000', lt: 'Iki €5,000' } },
      { value: '5k-15k', label: { en: '€5,000 – €15,000', lt: '€5,000 – €15,000' } },
      { value: '15k-30k', label: { en: '€15,000 – €30,000', lt: '€15,000 – €30,000' } },
      { value: '30k-plus', label: { en: '€30,000+', lt: '€30,000+' } }
    ]
  },
  {
    id: 'phaseC_contact_name',
    phase: 'C',
    type: 'text',
    prompt: {
      en: 'Contact details: full name',
      lt: 'Kontaktiniai duomenys: vardas ir pavardė'
    },
    placeholder: {
      en: 'Name Surname',
      lt: 'Vardas Pavardė'
    }
  },
  {
    id: 'phaseC_contact_company',
    phase: 'C',
    type: 'text',
    prompt: {
      en: 'Company',
      lt: 'Įmonė'
    },
    placeholder: {
      en: 'Company name',
      lt: 'Įmonės pavadinimas'
    }
  },
  {
    id: 'phaseC_contact_role',
    phase: 'C',
    type: 'text',
    prompt: {
      en: 'Position / role',
      lt: 'Pareigos'
    },
    placeholder: {
      en: 'CEO, Marketing lead, Product owner…',
      lt: 'CEO, Marketingo vadovas, Produkto vadovas…'
    }
  },
  {
    id: 'phaseC_contact_email',
    phase: 'C',
    type: 'text',
    prompt: {
      en: 'Email',
      lt: 'El. paštas'
    },
    placeholder: {
      en: 'name@company.com',
      lt: 'vardas@imone.lt'
    }
  },
  {
    id: 'phaseC_contact_phone',
    phase: 'C',
    type: 'text',
    required: false,
    prompt: {
      en: 'Phone (optional)',
      lt: 'Tel. numeris (nebūtinas)'
    },
    placeholder: {
      en: '+370...',
      lt: '+370...'
    }
  }
];

const FOOTER_COPY = {
  tagline: {
    en: 'Private revenue lab for premium brands.',
    lt: 'Privati pajamų laboratorija premium ženklams.'
  }
} as const;

function App() {
  const appRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const navListRef = useRef<HTMLUListElement | null>(null);
  const navToggleRef = useRef<HTMLButtonElement | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('#intro');
  const [questionnaireStep, setQuestionnaireStep] = useState(0);
  const [questionnaireSubmitted, setQuestionnaireSubmitted] = useState(false);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, string>>({});
  const [showValidation, setShowValidation] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>();
  const pointerMoveRef = useRef<(event: PointerEvent) => void>();

  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const getText = <T extends Record<Language, string>>(value: T) => value[language];

  const routePhase: QuestionnairePhase | null = (() => {
    if (typeof window === 'undefined') return null;
    if (window.location.pathname === '/questionnaire/discovery') return 'A';
    if (window.location.pathname === '/questionnaire/project') return 'B';
    if (window.location.pathname === '/questionnaire/strategy') return 'C';
    return null;
  })();

  const questionnaireQuestions = useMemo(() => {
    if (!routePhase) return [];

    return QUESTIONNAIRE_QUESTIONS.filter((question) => {
      if (question.phase !== routePhase) return false;
      if (!question.dependsOn) return true;

      const dependencyAnswer = questionnaireAnswers[question.dependsOn.questionId] ?? '';
      return question.dependsOn.values.includes(dependencyAnswer);
    });
  }, [routePhase, questionnaireAnswers]);

  const totalQuestionnaireSteps = questionnaireQuestions.length;
  const activeQuestion = questionnaireQuestions[questionnaireStep] ?? null;
  const activeAnswer = activeQuestion ? questionnaireAnswers[activeQuestion.id] ?? '' : '';
  const isRequiredQuestion = activeQuestion ? activeQuestion.required !== false : true;
  const canProceed = isRequiredQuestion ? activeAnswer.trim().length > 0 : true;
  const isLastQuestion = questionnaireStep === totalQuestionnaireSteps - 1;

  useEffect(() => {
    if (!routePhase || totalQuestionnaireSteps === 0) return;
    setQuestionnaireStep((previousStep) => Math.min(previousStep, totalQuestionnaireSteps - 1));
  }, [routePhase, totalQuestionnaireSteps]);

  useEffect(() => {
    if (routePhase) return;
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false
    } as any);

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);

    const setHeaderState = (scrollValue: number) => {
      if (!headerRef.current) return;
      headerRef.current.classList.toggle('is-scrolled', scrollValue > 24);
    };

    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      setHeaderState(scroll);
    });

    const handleAnchor = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
      if (!target) return;
      const hash = target.getAttribute('href');
      if (!hash || hash.length <= 1) return;
      const section = document.querySelector(hash);
      if (!section) return;
      event.preventDefault();
      setNavOpen(false);
      lenis.scrollTo(section as HTMLElement, { offset: -140 });
    };

    document.addEventListener('click', handleAnchor);

  let ctx: any = null;
  const pendingAdds: Array<() => void> = [];

  ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      gsap.utils.toArray<HTMLElement>('[data-animate]').forEach((node: HTMLElement) => {
        gsap.from(node, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: node,
            start: 'top 70%'
          }
        });
      });

      const sections = gsap.utils.toArray<HTMLElement>('section[data-section]');

      sections.forEach((section: HTMLElement) => {
        const id = `#${section.id}`;
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id)
        });
      });

      if (sections[0]) setActiveSection(`#${sections[0].id}`);

      const panoramaTrack = document.querySelector('.panorama-track');
      const panoramaSection = document.querySelector('.section-panorama');

      if (panoramaTrack && panoramaSection) {
        const tween = gsap.to(panoramaTrack, {
          x: () => {
            const max = (panoramaTrack as HTMLElement).scrollWidth - window.innerWidth;
            return max > 0 ? -max : 0;
          },
          ease: 'none',
          scrollTrigger: {
            trigger: panoramaSection,
            start: 'top top',
            end: () => `+=${Math.max(1, (panoramaTrack as HTMLElement).scrollWidth - window.innerWidth)}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true
          }
        });

        const refreshHandler = () => tween.scrollTrigger?.refresh();
        window.addEventListener('resize', refreshHandler);

        ScrollTrigger.addEventListener('refreshInit', refreshHandler);

        pendingAdds.push(() => {
          window.removeEventListener('resize', refreshHandler);
          ScrollTrigger.removeEventListener('refreshInit', refreshHandler);
        });
      }

      if (!reduceMotion) {
        const heroTimeline = gsap.timeline({ delay: 0.2 });
        heroTimeline
          .from('[data-hero="badge"]', { y: 24, opacity: 0, duration: 0.6, ease: 'power3.out' })
          .from('[data-hero="title"]', { y: 28, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
          .from('[data-hero="lead"]', { y: 24, opacity: 0, duration: 0.65, ease: 'power3.out' }, '-=0.4')
          .from('[data-hero="actions"]', { y: 22, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
          .from('[data-hero="metrics"] div', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out', stagger: 0.12 }, '-=0.4')
          .from('[data-hero="card"]', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5');

        const marqueeTrack = document.querySelector('.hero-marquee .marquee-track');
        if (marqueeTrack) {
          gsap.to(marqueeTrack, {
            xPercent: -50,
            ease: 'none',
            duration: 24,
            repeat: -1
          });
        }

        const gradient = document.querySelector('.hero-gradient');
        if (gradient && window.matchMedia('(pointer: fine)').matches) {
          const handlePointerMove = (event: PointerEvent) => {
            const x = ((event.clientX / window.innerWidth) - 0.5) * 80;
            const y = ((event.clientY / window.innerHeight) - 0.5) * 60;
            gsap.to(gradient, { x, y, duration: 1.2, ease: 'power3.out' });
          };
          pointerMoveRef.current = handlePointerMove;
          window.addEventListener('pointermove', handlePointerMove, { passive: true });
        }
      }
  }, appRef.current ?? undefined);

  // attach any pending cleanup handlers into the GSAP context now it's available
  if (ctx && pendingAdds.length) {
    pendingAdds.forEach((fn) => ctx.add(fn));
  }

    const scrollTriggerRefresh = () => {

      const updater = (lenis as any).update;

      if (typeof updater === 'function') {

        updater.call(lenis);

      }

    };
    ScrollTrigger.addEventListener('refresh', scrollTriggerRefresh);

    return () => {
      document.removeEventListener('click', handleAnchor);
      pointerMoveRef.current && window.removeEventListener('pointermove', pointerMoveRef.current as EventListener);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (lenis) lenis.destroy();
      ctx.revert();
      ScrollTrigger.removeEventListener('refresh', scrollTriggerRefresh);
      ScrollTrigger.killAll();
    };
  }, [routePhase]);

  useEffect(() => {
    if (routePhase) return;
    if (!navOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;
      if (!navRef.current || !navToggleRef.current) return;
      if (navRef.current.contains(targetNode) || navToggleRef.current.contains(targetNode)) return;
      setNavOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [navOpen, routePhase]);

  useEffect(() => {
    if (routePhase) return;
    if (!navOpen) return;
    const focusable = navListRef.current?.querySelectorAll<HTMLAnchorElement>('a');
    focusable?.[0]?.focus();
  }, [navOpen, routePhase]);

  useEffect(() => {
    setQuestionnaireStep(0);
    setQuestionnaireSubmitted(false);
    setQuestionnaireAnswers({});
    setShowValidation(false);
  }, [routePhase]);

  const handleQuestionnaireSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeQuestion) return;
    if (!canProceed) {
      setShowValidation(true);
      return;
    }
    setQuestionnaireSubmitted(true);
  };

  const handleAnswerChange = (value: string) => {
    if (!activeQuestion) return;
    setQuestionnaireAnswers((previous) => ({
      ...previous,
      [activeQuestion.id]: value
    }));
    setShowValidation(false);
  };

  const handleNextStep = () => {
    if (!activeQuestion) return;
    if (!canProceed) {
      setShowValidation(true);
      return;
    }
    if (isLastQuestion) return;
    setQuestionnaireStep((previous) => previous + 1);
    setShowValidation(false);
  };

  const handlePreviousStep = () => {
    if (questionnaireStep === 0) return;
    setQuestionnaireStep((previous) => previous - 1);
    setShowValidation(false);
  };

  if (routePhase && activeQuestion) {
    return (
      <div>
        <div className="global-backdrop" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />

        <header className="site-header is-scrolled">
          <div className="container header-row">
            <a className="brand" href="/" aria-label="Wunderbit home">
              <img src={logoWordmarkOrange} alt="Wunderbit" width={132} height={32} />
            </a>
            <div className="header-controls header-controls--push">
              <div className="language-toggle" role="radiogroup" aria-label="Site language">
                {LANGUAGES.map(({ code, label }) => (
                  <button
                    key={code}
                    type="button"
                    className={`language-toggle__btn${language === code ? ' is-active' : ''}`}
                    aria-pressed={language === code ? 'true' : 'false'}
                    onClick={() => setLanguage(code)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <a className="btn btn-ghost" href="/">{getText(QUESTIONNAIRE_COPY.backHome)}</a>
            </div>
          </div>
        </header>

        <main>
          <section className="section section-contact" id="contact" aria-labelledby="contact-title">
            <div className="container" data-animate>
              <div className="questionnaire-shell">
                <div className="questionnaire-header">
                  <span className="eyebrow">{getText(QUESTIONNAIRE_COPY.eyebrow)}</span>
                  <h2 id="contact-title">{getText(QUESTIONNAIRE_PHASES[routePhase].title)}</h2>
                  <p>{getText(QUESTIONNAIRE_COPY.body)}</p>
                </div>

                {questionnaireSubmitted ? (
                  <div className="questionnaire-success" role="status" aria-live="polite">
                    <h3>{getText(QUESTIONNAIRE_COPY.successTitle)}</h3>
                    <p>{getText(QUESTIONNAIRE_COPY.successBody)}</p>
                  </div>
                ) : (
                  <form className="questionnaire-form" onSubmit={handleQuestionnaireSubmit}>
                    <div className="questionnaire-progress">
                      <div className="questionnaire-progress__meta">
                        <span>{getText(QUESTIONNAIRE_PHASES[routePhase].subtitle)}</span>
                        <span>{`${getText(QUESTIONNAIRE_COPY.stepLabel)} ${questionnaireStep + 1}/${totalQuestionnaireSteps}`}</span>
                      </div>
                      <div className="questionnaire-progress__track" aria-hidden="true">
                        <span className={`questionnaire-progress__fill is-step-${questionnaireStep + 1}`} />
                      </div>
                    </div>

                    <article className="questionnaire-question">
                      <h3>{getText(activeQuestion.prompt)}</h3>
                      {activeQuestion.helpText && <p className="questionnaire-help">{getText(activeQuestion.helpText)}</p>}

                      {activeQuestion.type === 'single' && (
                        <div className="questionnaire-options" role="radiogroup" aria-label={getText(activeQuestion.prompt)}>
                          {activeQuestion.options?.map((option) => {
                            const isSelected = activeAnswer === option.value;

                            return (
                              <button
                                key={option.value}
                                className={`questionnaire-option${isSelected ? ' is-selected' : ''}`}
                                type="button"
                                aria-pressed={isSelected ? 'true' : 'false'}
                                onClick={() => handleAnswerChange(option.value)}
                              >
                                {getText(option.label)}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {activeQuestion.type === 'scale' && (
                        <div className="questionnaire-scale" role="radiogroup" aria-label={getText(activeQuestion.prompt)}>
                          {Array.from({ length: 10 }, (_, index) => {
                            const value = String(index + 1);
                            const isSelected = activeAnswer === value;

                            return (
                              <button
                                key={value}
                                className={`questionnaire-scale__item${isSelected ? ' is-selected' : ''}`}
                                type="button"
                                aria-pressed={isSelected ? 'true' : 'false'}
                                onClick={() => handleAnswerChange(value)}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {activeQuestion.type === 'text' && (
                        <label className="questionnaire-text-label">
                          <span className="sr-only">{getText(activeQuestion.prompt)}</span>
                          <textarea
                            rows={4}
                            value={activeAnswer}
                            placeholder={activeQuestion.placeholder ? getText(activeQuestion.placeholder) : ''}
                            onChange={(event) => handleAnswerChange(event.target.value)}
                          />
                        </label>
                      )}

                      {!canProceed && showValidation && (
                        <p className="questionnaire-required">{getText(QUESTIONNAIRE_COPY.requiredHint)}</p>
                      )}
                    </article>

                    <div className="questionnaire-nav">
                      <button
                        className="btn btn-ghost"
                        type="button"
                        onClick={handlePreviousStep}
                        disabled={questionnaireStep === 0}
                      >
                        {getText(QUESTIONNAIRE_COPY.prev)}
                      </button>

                      {isLastQuestion ? (
                        <button className="btn btn-solid" type="submit" disabled={!canProceed}>
                          {getText(QUESTIONNAIRE_COPY.submit)}
                        </button>
                      ) : (
                        <button className="btn btn-solid" type="button" onClick={handleNextStep} disabled={!canProceed}>
                          {getText(QUESTIONNAIRE_COPY.next)}
                        </button>
                      )}
                    </div>
                  </form>
                )}

                <div className="contact-meta" aria-hidden="true">
                  <span>© {currentYear} Wunderbit</span>
                  <span>{getText(QUESTIONNAIRE_PHASES[routePhase].title)}</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div ref={appRef}>
      <div className="global-backdrop" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <header ref={headerRef} className="site-header" data-scrolled="false">
        <div className="container header-row">
          <a className="brand" href="#intro" aria-label="Wunderbit home">
            <img src={logoWordmarkOrange} alt="Wunderbit" width={132} height={32} />
          </a>
          <nav ref={navRef} className={`primary-nav${navOpen ? ' open' : ''}`} aria-label="Primary navigation">
            <button
              ref={navToggleRef}
              className="nav-toggle"
              aria-expanded={navOpen ? 'true' : 'false'}
              aria-controls="nav-list"
              type="button"
              onClick={() => setNavOpen((prevOpen: boolean) => !prevOpen)}
            >
              <span className="sr-only">Menu</span>
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </button>
            <ul id="nav-list" ref={navListRef} className="nav-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a href={item.href} aria-current={activeSection === item.href ? 'true' : undefined}>
                    {getText(item.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="header-controls">
            <div className="language-toggle" role="radiogroup" aria-label="Site language">
              {LANGUAGES.map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  className={`language-toggle__btn${language === code ? ' is-active' : ''}`}
                  aria-pressed={language === code ? 'true' : 'false'}
                  onClick={() => setLanguage(code)}
                >
                  {label}
                </button>
              ))}
            </div>
            <a className="btn btn-outline" href="#contact">{getText(HEADER_CTA)}</a>
          </div>
        </div>
      </header>

      <aside className="side-dots" aria-label="Section navigation">
        {NAV_ITEMS.map((item) => (
          <a
            key={`dot-${item.href}`}
            href={item.href}
            className={`dot${activeSection === item.href ? ' is-active' : ''}`}
            aria-label={getText(item.label)}
          />
        ))}
      </aside>

      <main id="smooth-wrapper">
        <div id="smooth-content">
          <section className="section hero" id="intro" data-section>
            <div className="hero-sheen" aria-hidden="true" />
            <div className="container hero-grid">
              <div className="hero-copy" data-animate>
                <span className="hero-badge" data-hero="badge">{getText(HERO_CONTENT.badge)}</span>
                <h1 data-hero="title">{getText(HERO_CONTENT.title)}</h1>
                <p data-hero="lead">{getText(HERO_CONTENT.lead)}</p>
                <div className="hero-actions" data-hero="actions">
                  {HERO_CONTENT.actions.map((action) => (
                    <a key={action.href} className={`btn ${action.href === '#contact' ? 'btn-solid' : 'btn-ghost'}`} href={action.href}>
                      {getText(action.label)}
                    </a>
                  ))}
                </div>
                <dl className="hero-metrics" data-hero="metrics">
                  {HERO_METRICS.map((metric) => (
                    <div key={metric.label.en}>
                      <dt>{getText(metric.label)}</dt>
                      <dd>{getText(metric.value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="hero-media" data-animate>
                <div className="hero-capsule">
                  <div className="hero-gradient" aria-hidden="true" />
                  <div className="hero-card" data-hero="card">
                    <span className="card-kicker">{getText(HERO_CONTENT.card.kicker)}</span>
                    <h3>{getText(HERO_CONTENT.card.title)}</h3>
                    <p>{getText(HERO_CONTENT.card.body)}</p>
                    <ul className="card-list">
                      {HERO_CONTENT.card.list.map((item) => (
                        <li key={item.en}>{getText(item)}</li>
                      ))}
                    </ul>
                    <div className="card-ribbon">
                      <img src={logoWordmarkWhite} alt="W mark" width={32} height={32} />
                      <span>{getText(HERO_CONTENT.card.ribbon)}</span>
                    </div>
                  </div>
                  <div className="hero-pulses" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className="hero-stack" data-animate>
                  {HERO_PILLARS.map((pillar) => (
                    <div key={pillar.title.en} className="hero-pill">
                      <strong>{getText(pillar.title)}</strong>
                      <p>{getText(pillar.description)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="hero-marquee" aria-hidden="true">
              <div className="marquee-track">
                {[...Array(2)]
                  .flatMap(() => HERO_MARQUEE[language])
                  .map((phrase, index) => (
                    <span key={`${phrase}-${index}`}>{phrase}</span>
                  ))}
              </div>
            </div>
          </section>

          <section className="section section-panorama" id="showcase" aria-label="Showcase" data-section>
            <div className="container section-head">
              <div data-animate>
                <span className="eyebrow">{getText(SHOWCASE_COPY.eyebrow)}</span>
                <h2>{getText(SHOWCASE_COPY.heading)}</h2>
              </div>
              <p data-animate>{getText(SHOWCASE_COPY.body)}</p>
            </div>
            <div className="panorama">
              <div className="panorama-track">
                {SHOWCASE_ITEMS.map((item) => (
                  <article key={item.title} className={`panorama-card ${item.theme}`} data-animate>
                    <div className="card-inner">
                      <span className="card-tag">{getText(item.tag)}</span>
                      <h3>{item.title}</h3>
                      <p>{getText(item.copy)}</p>
                      <ul>
                        {item.bullets.map((bullet) => (
                          <li key={bullet.en}>{getText(bullet)}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
                {SHOWCASE_IMAGES.map((img, k) => (
                  <article key={`img-${k}`} className="panorama-card panorama-image" data-animate>
                    <div className="card-inner image-inner">
                      <a href={img.href} target="_blank" rel="noopener noreferrer">
                        <img
                          src={img.src}
                          alt={getText(img.alt)}
                          loading="lazy"
                          width={1200}
                          height={800}
                          style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section section-offer" id="story" data-section>
            <div className="container offer-grid">
              <div className="offer-intro" data-animate>
                <span className="eyebrow">{getText(OFFER_INTRO.eyebrow)}</span>
                <h2>{getText(OFFER_INTRO.heading)}</h2>
                <p>{getText(OFFER_INTRO.body)}</p>
                <p className="offer-quote">{getText(OFFER_INTRO.quote)}</p>
              </div>
              <div className="offer-points">
                {OFFER_POINTS.map((point) => (
                  <article key={point.heading.en} data-animate>
                    <h3>{getText(point.heading)}</h3>
                    <p>{getText(point.body)}</p>
                  </article>
                ))}
                <div className="offer-cta" data-animate>
                  <a className="btn btn-solid" href="#contact">{getText(OFFER_CTA)}</a>
                  <p>{getText(OFFER_INTRO.note)}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section section-method" id="type" data-section>
            <div className="container method-grid">
              <div className="method-intro" data-animate>
                <span className="eyebrow">{getText(METHOD_INTRO.eyebrow)}</span>
                <h2>{getText(METHOD_INTRO.heading)}</h2>
                <p>{getText(METHOD_INTRO.body)}</p>
              </div>
              <div className="method-steps" data-animate>
                <ol>
                  {METHOD_STEPS.map((step) => (
                    <li key={step.phase.en}>
                      <h3>{getText(step.phase)}</h3>
                      <p>{getText(step.detail)}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="method-proof" data-animate>
                <div className="method-card">
                  <h3>{getText(METHOD_CARD.heading)}</h3>
                  <ul>
                    {METHOD_DELIVERABLES.map((deliverable) => (
                      <li key={deliverable.en}>{getText(deliverable)}</li>
                    ))}
                  </ul>
                  <p className="method-note">{getText(METHOD_CARD.note)}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section section-contact" id="contact" aria-labelledby="contact-title" data-section>
            <div className="container" data-animate>
              <div className="questionnaire-shell">
                <div className="questionnaire-header">
                  <span className="eyebrow">{getText(CONTACT_COPY.eyebrow)}</span>
                  <h2 id="contact-title">{getText(CONTACT_COPY.heading)}</h2>
                  <p>{getText(CONTACT_COPY.body)}</p>
                  <p className="contact-consultation">{getText(CONTACT_COPY.consultation)}</p>
                </div>

                <form
                  className="contact-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                >
                  <label>
                    <span>{getText(CONTACT_COPY.emailLabel)}</span>
                    <input
                      type="email"
                      placeholder={getText(CONTACT_COPY.emailPlaceholder)}
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                    />
                  </label>

                  <label>
                    <span>{getText(CONTACT_COPY.messageLabel)}</span>
                    <textarea
                      placeholder={getText(CONTACT_COPY.messagePlaceholder)}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                    />
                  </label>

                  <button className="btn btn-solid" type="submit">
                    {contactSubmitted ? getText(CONTACT_COPY.submit.success) : getText(CONTACT_COPY.submit.idle)}
                  </button>
                </form>

                <div className="contact-meta">
                  <span>© {currentYear} Wunderbit</span>
                  <span>{getText(CONTACT_COPY.meta)}</span>
                  <span>
                    <a href="mailto:ignas@wunderbit.lt">ignas@wunderbit.lt</a>
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <img src={logoMarkWhite} alt="Wunderbit monogram" width={44} height={44} />
            <p>{getText(FOOTER_COPY.tagline)}</p>
            <p className="footer-contact-meta">Wunderbit Digital · Global · <a href="mailto:ignas@wunderbit.lt">ignas@wunderbit.lt</a></p>
          </div>
          <ul className="footer-links">
            {NAV_ITEMS.map((item) => (
              <li key={`footer-${item.href}`}>
                <a href={item.href}>{getText(item.label)}</a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;
