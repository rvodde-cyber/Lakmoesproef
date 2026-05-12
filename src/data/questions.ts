export type Question = {
  id: number;
  title: string;
  subtitle: string;
  explanation: string;
};

export const QUESTIONS_PER_PAGE = 3;
export const INSTRUMENT_VERSION = "v1.1";

export const PAGE_CAPTIONS = [
  "Richting, voorbeeld en psychologische veiligheid",
  "Waarden, transparantie en aanspreekcultuur",
  "Leren, rechtvaardigheid en inclusie",
  "Eigenaarschap, stakeholders en lange termijn",
  "Samenwerken, signaleren en morele reflectie",
  "Vakmanschap, grenzen en datagedreven verbeteren",
  "Menselijke maat, externe verantwoording en verbeterkracht",
] as const;

export const PAGE_IMAGE_PATHS = [
  "/question-block-1.svg",
  "/question-block-2.svg",
  "/question-block-3.svg",
  "/question-block-4.svg",
  "/question-block-5.svg",
  "/question-block-6.svg",
  "/question-block-7.svg",
] as const;

export const questions: Question[] = [
  { id: 1, title: "Ethische visie", subtitle: "Richting en betekenis", explanation: "In welke mate is de missie concreet verbonden aan maatschappelijke waarde en verantwoord handelen?" },
  { id: 2, title: "Leiderschap als voorbeeld", subtitle: "Walk the talk", explanation: "In welke mate laten leidinggevenden in keuzes en gedrag zien wat zij van professionals verwachten?" },
  { id: 3, title: "Psychologische veiligheid", subtitle: "Ruimte om te spreken", explanation: "In welke mate ervaren medewerkers veiligheid om fouten, twijfels en zorgen bespreekbaar te maken?" },
  { id: 4, title: "Waarden in besluitvorming", subtitle: "Meer dan KPI's", explanation: "In welke mate worden waarden zichtbaar meegewogen naast kosten, snelheid en resultaat?" },
  { id: 5, title: "Transparantie", subtitle: "Uitlegbaar handelen", explanation: "In welke mate zijn besluiten navolgbaar en helder onderbouwd voor medewerkers en stakeholders?" },
  { id: 6, title: "Aanspreekcultuur", subtitle: "Constructieve correctie", explanation: "In welke mate spreken collega's elkaar professioneel aan op gedrag en verantwoordelijkheid?" },
  { id: 7, title: "Leren van fouten", subtitle: "Van incident naar leren", explanation: "In welke mate worden incidenten structureel geanalyseerd en omgezet in betere werkwijzen?" },
  { id: 8, title: "Rechtvaardigheid", subtitle: "Eerlijk en consistent", explanation: "In welke mate zijn kansen, beoordeling en beloning binnen teams rechtvaardig ingericht?" },
  { id: 9, title: "Inclusie", subtitle: "Diversiteit benutten", explanation: "In welke mate worden verschillende perspectieven actief betrokken in overleg en besluitvorming?" },
  { id: 10, title: "Eigenaarschap", subtitle: "Verantwoordelijkheid op elk niveau", explanation: "In welke mate ervaren professionals dat zij zelf een verantwoordelijkheid dragen voor de ethische kwaliteit van hun werkzaamheden?" },
  { id: 11, title: "Stakeholderperspectief", subtitle: "Brede impact", explanation: "In welke mate worden effecten op klanten, burgers en partners expliciet meegewogen?" },
  { id: 12, title: "Lange termijn", subtitle: "Duurzame keuzes", explanation: "In welke mate kiest de organisatie voor duurzame oplossingen boven korte-termijnwinst?" },
  { id: 13, title: "Samenwerking", subtitle: "Silo's doorbreken", explanation: "In welke mate werken teams en afdelingen integraal samen aan gedeelde waarden en doelen?" },
  { id: 14, title: "Signalering en opvolging", subtitle: "Melden heeft effect", explanation: "In welke mate worden signalen over risico's en misstanden tijdig en aantoonbaar opgevolgd?" },
  { id: 15, title: "Morele reflectie", subtitle: "Tijd voor beraad", explanation: "In welke mate bestaat er structureel ruimte voor ethische reflectie op complexe casuistiek?" },
  { id: 16, title: "Vakmanschap", subtitle: "Kennis en competenties", explanation: "In welke mate worden medewerkers getraind in morele oordeelsvorming en professioneel handelen?" },
  { id: 17, title: "Heldere grenzen", subtitle: "Normen en consequenties", explanation: "In welke mate zijn gedragsnormen, grensoverschrijding en consequenties expliciet en bekend?" },
  { id: 18, title: "Datagedreven verbeteren", subtitle: "Meten is leren", explanation: "In welke mate gebruikt de organisatie betrouwbare data om ethisch werken gericht te versterken?" },
  { id: 19, title: "Menselijke maat", subtitle: "Mensen boven systeemdruk", explanation: "In welke mate blijft de menselijke maat leidend in beleid, uitvoering en klantcontact?" },
  { id: 20, title: "Externe verantwoording", subtitle: "Open naar buiten", explanation: "In welke mate legt de organisatie actief verantwoording af over ethische keuzes en impact?" },
  { id: 21, title: "Verbeterkracht", subtitle: "Van scan naar uitvoering", explanation: "In welke mate worden inzichten uit metingen vertaald naar duidelijke acties en eigenaarschap?" },
];
