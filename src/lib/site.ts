import type { Locale, LocalizedLink, LocalizedString } from "./i18n";

export interface NavItem {
  slug: string;
  label: LocalizedString;
}

export interface FooterColumn {
  title: LocalizedString;
  links: LocalizedLink[];
}

export const siteTitle: LocalizedString = {
  en: "NLW Data Foundry",
  cy: "Ffowndri Data LlGC",
};

export const siteTagline: LocalizedString = {
  en: "Structured cultural datasets, exhibitions, and reuse guidance from the National Library of Wales.",
  cy: "Setiau data diwylliannol strwythuredig, arddangosfeydd, a chanllawiau ailddefnyddio gan Lyfrgell Genedlaethol Cymru.",
};

export const localeNames: Record<Locale, LocalizedString> = {
  en: { en: "English", cy: "English" },
  cy: { en: "Cymraeg", cy: "Cymraeg" },
};

export const navItems: NavItem[] = [
  { slug: "", label: { en: "Home", cy: "Hafan" } },
  { slug: "data", label: { en: "Data", cy: "Data" } },
  { slug: "search", label: { en: "Search", cy: "Chwilio" } },
  {
    slug: "using-the-data",
    label: { en: "Using the Data", cy: "Defnyddio’r Data" },
  },
  {
    slug: "policies-governance",
    label: { en: "Policies & Governance", cy: "Polisïau a Llywodraethu" },
  },
  {
    slug: "case-studies",
    label: { en: "Case Studies", cy: "Astudiaethau Achos" },
  },
  {
    slug: "help-support",
    label: { en: "Help & Support", cy: "Cymorth a Chefnogaeth" },
  },
  { slug: "about", label: { en: "About", cy: "Amdanom ni" } },
];

export const footerColumns: FooterColumn[] = [
  {
    title: { en: "Contact", cy: "Cysylltu" },
    links: [
      {
        href: "mailto:enquiry@library.wales",
        label: { en: "enquiry@library.wales", cy: "enquiry@library.wales" },
      },
      {
        href: "tel:+441970632800",
        label: { en: "+44 (0)1970 632 800", cy: "+44 (0)1970 632 800" },
      },
      {
        href: "https://www.library.wales/visit-us/contact-us",
        label: {
          en: "National Library of Wales contact page",
          cy: "Tudalen gyswllt Llyfrgell Genedlaethol Cymru",
        },
      },
    ],
  },
  {
    title: { en: "Explore", cy: "Archwilio" },
    links: [
      {
        href: "/en/data",
        label: { en: "Browse all data", cy: "Pori'r holl ddata" },
      },
      {
        href: "/en/case-studies",
        label: { en: "Case studies", cy: "Astudiaethau achos" },
      },
    ],
  },
  {
    title: { en: "Using the data", cy: "Defnyddio’r data" },
    links: [
      {
        href: "/en/using-the-data/getting-started",
        label: { en: "Getting started", cy: "Cychwyn arni" },
      },
      {
        href: "/en/using-the-data/how-to-cite-the-data",
        label: { en: "How to cite the data", cy: "Sut i ddyfynnu’r data" },
      },
      {
        href: "/en/policies-governance/licensing",
        label: { en: "Licensing", cy: "Trwyddedu" },
      },
    ],
  },
];

export const legalLinks: LocalizedLink[] = [
  {
    href: "https://www.library.wales/index.php?id=355",
    label: { en: "Cookies", cy: "Cwcis" },
  },
  {
    href: "https://www.library.wales/index.php?id=4221",
    label: { en: "Privacy", cy: "Preifatrwydd" },
  },
  {
    href: "https://www.library.wales/index.php?id=462",
    label: { en: "Copyright", cy: "Hawlfraint" },
  },
  {
    href: "https://www.library.wales/index.php?id=12766",
    label: { en: "Accessibility", cy: "Hygyrchedd" },
  },
];

export const homeCopy = {
  eyebrow: {
    en: "National Library of Wales",
    cy: "Llyfrgell Genedlaethol Cymru",
  },
  title: {
    en: "Discover structured cultural data built for research, storytelling, and reuse.",
    cy: "Darganfyddwch ddata diwylliannol strwythuredig wedi’i lunio ar gyfer ymchwil, adrodd straeon, ac ailddefnyddio.",
  },
  summary: {
    en: "Browse bilingual dataset records, view curated exhibitions, and move from discovery to citation without leaving the platform.",
    cy: "Pori cofnodion setiau data dwyieithog, gweld arddangosfeydd wedi’u curadu, a symud o ddarganfod i ddyfynnu heb adael y llwyfan.",
  },
  searchLabel: {
    en: "Search NLW Data",
    cy: "Chwilio Data LlGC",
  },
  searchPlaceholder: {
    en: "Search for a term, collection, or place",
    cy: "Chwiliwch am derm, casgliad, neu le",
  },
  featuredDatasets: {
    en: "Featured datasets",
    cy: "Setiau data dan sylw",
  },
  featuredExhibitions: {
    en: "Featured exhibitions",
    cy: "Arddangosfeydd dan sylw",
  },
  ctaTitle: {
    en: "Join Torf and help shape future datasets.",
    cy: "Ymunwch â Torf a helpu i lunio setiau data’r dyfodol.",
  },
  ctaBody: {
    en: "Volunteer-led projects sit behind many Foundry releases. Follow the platform, explore the collections, and get in touch if you want to collaborate.",
    cy: "Mae prosiectau a arweinir gan wirfoddolwyr y tu ôl i lawer o gyhoeddiadau’r Ffowndri. Dilynwch y llwyfan, archwiliwch y casgliadau, a chysylltwch os hoffech gydweithio.",
  },
  ctaLabel: {
    en: "Contact the team",
    cy: "Cysylltu â’r tîm",
  },
};
