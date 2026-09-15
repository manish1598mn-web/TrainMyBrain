/**
 * Comprehensive English Grammar & Linguistic Mastery Database
 * 
 * 4 Distinct Cognitive Difficulty Tiers:
 * - Tier 1 (Levels 1–10): Beginner (Class 6–10 Student Level)
 *   Everyday articles (a, an, the), basic prepositions (in, on, at, under, by), foundational tenses, simple subject-verb agreement.
 * - Tier 2 (Levels 11–25): Intermediate (Class 11–12 & Graduate Level / SAT / IELTS / Competitive Exams)
 *   Advanced prepositions (between vs among, beside vs besides), compound agreement (either/or, neither/nor), conditionals, active/passive voice, sentence error spotting.
 * - Tier 3 (Levels 26–50): Expert (Post-Graduate / GMAT / GRE / CAT / Higher Studies)
 *   Subjunctive mood, negative inversion, dangling & misplaced modifiers, parallel structure, subtle paronyms (compliment vs complement).
 * - Tier 4 (Levels 51–99+): Top 1% Global English Grammar Experts
 *   Cleft sentences, absolute constructions, restrictive vs non-restrictive relative clauses, formal prepositional idioms (acquiesce in, averse to), archaic subjunctive, semantic shift traps.
 * 
 * Standardized to exactly 5 options per question (A, B, C, D, E).
 */

export type GrammarCategory =
  | 'articles'
  | 'prepositions'
  | 'tenses'
  | 'subject_verb_agreement'
  | 'sentence_error'
  | 'sentence_arrangement'
  | 'usage_rules'
  | 'paronyms'
  | 'advanced_syntax';

export interface GrammarQuestionItem {
  id: string;
  tier: 1 | 2 | 3 | 4;
  category: GrammarCategory;
  modeBadge: string;
  prompt: string;
  subPrompt?: string;
  options: [string, string, string, string, string]; // Exactly 5 options
  correctAnswer: string;
  explanation: string;
  primaryWords: string[]; // For session-level zero word repetition
  targetResponseTimeMs: number;
}

export const GRAMMAR_QUESTIONS_DATASET: GrammarQuestionItem[] = [
  // ==========================================
  // TIER 1: BEGINNER (LEVELS 1–10) - CLASS 6–10
  // ==========================================

  // --- Articles (a, an, the, zero article) ---
  {
    id: 't1-art-01',
    tier: 1,
    category: 'articles',
    modeBadge: 'Articles (A/An/The)',
    prompt: 'Fill in the blank with the appropriate article:',
    subPrompt: 'He completed the marathon in _____ hour and twenty minutes.',
    options: ['a', 'an', 'the', 'some', 'no article needed'],
    correctAnswer: 'an',
    explanation: "\"Hour\" begins with a silent 'h', so the initial sound is a vowel sound /aʊər/, requiring 'an'.",
    primaryWords: ['HOUR', 'MARATHON', 'MINUTE'],
    targetResponseTimeMs: 2000
  },
  {
    id: 't1-art-02',
    tier: 1,
    category: 'articles',
    modeBadge: 'Articles (A/An/The)',
    prompt: 'Choose the correct article for this context:',
    subPrompt: 'Mount Everest is _____ highest mountain peak in the world.',
    options: ['a', 'an', 'the', 'any', 'no article needed'],
    correctAnswer: 'the',
    explanation: "Superlative adjectives (e.g. \"highest\", \"tallest\") always take the definite article 'the'.",
    primaryWords: ['EVEREST', 'HIGHEST', 'PEAK'],
    targetResponseTimeMs: 1800
  },
  {
    id: 't1-art-03',
    tier: 1,
    category: 'articles',
    modeBadge: 'Articles (A/An/The)',
    prompt: 'Select the correct article for the blank:',
    subPrompt: 'She wants to study at _____ university in Europe next summer.',
    options: ['an', 'a', 'the', 'that', 'no article needed'],
    correctAnswer: 'a',
    explanation: "\"University\" begins with a consonant sound /juː/ (like \"you\"), hence it takes 'a', not 'an'.",
    primaryWords: ['UNIVERSITY', 'EUROPE', 'STUDY'],
    targetResponseTimeMs: 2000
  },
  {
    id: 't1-art-04',
    tier: 1,
    category: 'articles',
    modeBadge: 'Articles (A/An/The)',
    prompt: 'Which article correctly completes this sentence?',
    subPrompt: '_____ Nile is the longest river on the African continent.',
    options: ['A', 'An', 'The', 'One', 'No article needed'],
    correctAnswer: 'The',
    explanation: "Names of major rivers (the Nile, the Amazon, the Thames) require the definite article 'the'.",
    primaryWords: ['NILE', 'LONGEST', 'RIVER'],
    targetResponseTimeMs: 1800
  },

  // --- Prepositions (in, on, at, under, by) ---
  {
    id: 't1-prep-01',
    tier: 1,
    category: 'prepositions',
    modeBadge: 'Preposition of Time',
    prompt: 'Fill in the blank with the correct preposition:',
    subPrompt: 'Our flight departs _____ 6:30 AM sharp tomorrow morning.',
    options: ['in', 'on', 'at', 'by', 'during'],
    correctAnswer: 'at',
    explanation: "Specific clock times (6:30 AM, noon, midnight) always take the preposition 'at'.",
    primaryWords: ['FLIGHT', 'DEPARTS', 'MORNING'],
    targetResponseTimeMs: 1800
  },
  {
    id: 't1-prep-02',
    tier: 1,
    category: 'prepositions',
    modeBadge: 'Preposition of Time',
    prompt: 'Choose the appropriate preposition:',
    subPrompt: 'We usually go for long family walks _____ Sunday afternoons.',
    options: ['at', 'in', 'on', 'with', 'from'],
    correctAnswer: 'on',
    explanation: "Specific days and dates (Sunday, Monday afternoon, July 4th) take the preposition 'on'.",
    primaryWords: ['SUNDAY', 'WALKS', 'AFTERNOON'],
    targetResponseTimeMs: 1800
  },
  {
    id: 't1-prep-03',
    tier: 1,
    category: 'prepositions',
    modeBadge: 'Preposition of Place',
    prompt: 'Select the correct preposition of place:',
    subPrompt: 'The frightened puppy hid _____ the wooden dining table.',
    options: ['over', 'under', 'between', 'during', 'through'],
    correctAnswer: 'under',
    explanation: "\"Under\" describes being vertically beneath or sheltered below an object like a table.",
    primaryWords: ['PUPPY', 'TABLE', 'DINING'],
    targetResponseTimeMs: 1800
  },
  {
    id: 't1-prep-04',
    tier: 1,
    category: 'prepositions',
    modeBadge: 'Preposition of Place',
    prompt: 'Fill in the blank with the proper preposition:',
    subPrompt: 'She was born _____ a picturesque small town in northern Italy.',
    options: ['at', 'on', 'in', 'onto', 'by'],
    correctAnswer: 'in',
    explanation: "Enclosed geographic areas, towns, cities, and countries take the preposition 'in'.",
    primaryWords: ['TOWN', 'ITALY', 'PICTURESQUE'],
    targetResponseTimeMs: 1800
  },

  // --- Subject-Verb Agreement (Beginner) ---
  {
    id: 't1-sva-01',
    tier: 1,
    category: 'subject_verb_agreement',
    modeBadge: 'Subject-Verb Agreement',
    prompt: 'Select the verb that correctly agrees with the subject:',
    subPrompt: 'Each of the students _____ given a new notebook on the first day.',
    options: ['were', 'was', 'are', 'have been', 'being'],
    correctAnswer: 'was',
    explanation: "\"Each\" is a singular indefinite pronoun and strictly takes a singular verb (\"was\").",
    primaryWords: ['STUDENT', 'NOTEBOOK', 'GIVEN'],
    targetResponseTimeMs: 2000
  },
  {
    id: 't1-sva-02',
    tier: 1,
    category: 'subject_verb_agreement',
    modeBadge: 'Subject-Verb Agreement',
    prompt: 'Choose the grammatically correct verb form:',
    subPrompt: 'A bouquet of yellow roses _____ placed on her study desk.',
    options: ['were', 'was', 'are', 'have', 'being'],
    correctAnswer: 'was',
    explanation: "The head subject is the singular noun \"bouquet\" (not the plural modifier \"roses\"), so it takes \"was\".",
    primaryWords: ['BOUQUET', 'ROSES', 'DESK'],
    targetResponseTimeMs: 2000
  },

  // --- Sentence Error Spotting (Beginner) ---
  {
    id: 't1-err-01',
    tier: 1,
    category: 'sentence_error',
    modeBadge: 'Sentence Error Spotting',
    prompt: 'Identify the part containing a grammatical error:',
    subPrompt: "She (A) don't like (B) chocolate ice cream (C) after dinner. (D)",
    options: ['(A) She', "(B) don't like", '(C) chocolate ice cream', '(D) after dinner', '(E) No error'],
    correctAnswer: "(B) don't like",
    explanation: "Third-person singular subject \"She\" requires the singular auxiliary \"doesn't like\", not \"don't like\".",
    primaryWords: ['CHOCOLATE', 'DINNER', 'CREAM'],
    targetResponseTimeMs: 2200
  },
  {
    id: 't1-err-02',
    tier: 1,
    category: 'sentence_error',
    modeBadge: 'Sentence Error Spotting',
    prompt: 'Find the erroneous segment in this sentence:',
    subPrompt: 'The two brothers (A) shared the prize (B) between all three (C) winners. (D)',
    options: ['(A) The two brothers', '(B) shared the prize', '(C) between all three', '(D) winners', '(E) No error'],
    correctAnswer: '(C) between all three',
    explanation: "When referring to more than two entities (\"three winners\"), use \"among\" instead of \"between\".",
    primaryWords: ['BROTHERS', 'PRIZE', 'WINNERS'],
    targetResponseTimeMs: 2200
  },

  // --- Sentence Arrangement (PQRS) (Beginner) ---
  {
    id: 't1-arr-01',
    tier: 1,
    category: 'sentence_arrangement',
    modeBadge: 'Sentence Arrangement',
    prompt: 'Arrange the jumbled parts to form a coherent sentence:',
    subPrompt: '[P] every morning  [Q] the chirping birds  [R] wake up  [S] the entire village',
    options: ['Q - R - S - P', 'P - Q - S - R', 'S - P - Q - R', 'R - Q - P - S', 'Q - P - R - S'],
    correctAnswer: 'Q - R - S - P',
    explanation: "\"The chirping birds [Q] wake up [R] the entire village [S] every morning [P]\" is syntactically coherent.",
    primaryWords: ['CHIRPING', 'VILLAGE', 'WAKE'],
    targetResponseTimeMs: 2500
  },

  // --- Usage Rules (Beginner) ---
  {
    id: 't1-use-01',
    tier: 1,
    category: 'usage_rules',
    modeBadge: 'Grammar Usage Rule',
    prompt: 'Which sentence correctly uses the preposition "AT"?',
    options: [
      'He arrived at London yesterday.',
      'She met me at the library entrance.',
      'They walked at the sunny beach.',
      'We live at Canada for five years.',
      'I woke up at the morning.'
    ],
    correctAnswer: 'She met me at the library entrance.',
    explanation: "'At' designates a specific point or exact spot (\"at the library entrance\"). Cities/countries take 'in'.",
    primaryWords: ['LIBRARY', 'ENTRANCE', 'ARRIVED'],
    targetResponseTimeMs: 2200
  },
  {
    id: 't1-use-02',
    tier: 1,
    category: 'usage_rules',
    modeBadge: 'Grammar Usage Rule',
    prompt: 'Which sentence correctly uses the indefinite article "AN"?',
    options: [
      'He is an honest police officer.',
      'She bought an unique painting.',
      'They saw an European tourist.',
      'We attended an one-day workshop.',
      'He carried an heavy backpack.'
    ],
    correctAnswer: 'He is an honest police officer.',
    explanation: "\"Honest\" has a silent 'h' and begins with the vowel sound /ɒ/, correctly taking 'an'.",
    primaryWords: ['POLICE', 'OFFICER', 'PAINTING'],
    targetResponseTimeMs: 2200
  },

  // ===============================================
  // TIER 2: INTERMEDIATE (LEVELS 11–25) - CLASS 11-12 & GRADUATE
  // ===============================================

  // --- Advanced Prepositions (between vs among, beside vs besides, due to) ---
  {
    id: 't2-prep-01',
    tier: 2,
    category: 'prepositions',
    modeBadge: 'Preposition Distinction',
    prompt: 'Fill in the blank with the correct preposition:',
    subPrompt: '_____ learning Spanish, she is also mastering German and Italian.',
    options: ['Beside', 'Besides', 'Between', 'Among', 'Despite of'],
    correctAnswer: 'Besides',
    explanation: "\"Besides\" means \"in addition to\" or \"as well as\", whereas \"beside\" strictly means \"by the side of\".",
    primaryWords: ['SPANISH', 'GERMAN', 'MASTERING'],
    targetResponseTimeMs: 2000
  },
  {
    id: 't2-prep-02',
    tier: 2,
    category: 'prepositions',
    modeBadge: 'Preposition of Cause',
    prompt: 'Select the grammatically sound prepositional phrase:',
    subPrompt: 'The outdoor concert was canceled _____ torrential rainfall and flash flooding.',
    options: ['due to', 'owing to', 'because', 'inspite', 'for reason'],
    correctAnswer: 'owing to',
    explanation: "Adverbial clause modifiers describing why an action was done (\"canceled...\") traditionally take \"owing to\".",
    primaryWords: ['CONCERT', 'TORRENTIAL', 'FLOODING'],
    targetResponseTimeMs: 2200
  },
  {
    id: 't2-prep-03',
    tier: 2,
    category: 'prepositions',
    modeBadge: 'Idiomatic Preposition',
    prompt: 'Choose the preposition that idiomatically complements the verb:',
    subPrompt: 'The principal congratulated the young scholar _____ her extraordinary achievement.',
    options: ['for', 'on', 'about', 'at', 'with'],
    correctAnswer: 'on',
    explanation: "Standard English idiom is \"to congratulate someone ON an accomplishment\" (not \"for\").",
    primaryWords: ['PRINCIPAL', 'SCHOLAR', 'ACHIEVEMENT'],
    targetResponseTimeMs: 2000
  },

  // --- Compound Subject-Verb Agreement (Either/Or, Neither/Nor, Along With) ---
  {
    id: 't2-sva-01',
    tier: 2,
    category: 'subject_verb_agreement',
    modeBadge: 'Correlative Agreement',
    prompt: 'Select the verb form that satisfies grammatical agreement:',
    subPrompt: 'Neither the team captain nor the players _____ willing to concede defeat.',
    options: ['was', 'were', 'is', 'has been', 'being'],
    correctAnswer: 'were',
    explanation: "With \"neither...nor\", the verb agrees with the subject closest to it (\"the players\" -> plural \"were\").",
    primaryWords: ['CAPTAIN', 'PLAYERS', 'CONCEDE'],
    targetResponseTimeMs: 2100
  },
  {
    id: 't2-sva-02',
    tier: 2,
    category: 'subject_verb_agreement',
    modeBadge: 'Intervening Phrase Agreement',
    prompt: 'Choose the correct verb for this sentence:',
    subPrompt: 'The CEO, along with several department heads, _____ attending the quarterly summit.',
    options: ['are', 'is', 'were', 'have been', 'being'],
    correctAnswer: 'is',
    explanation: "Phrases introduced by \"along with\", \"as well as\", or \"together with\" do not alter the singular subject (\"CEO\").",
    primaryWords: ['SUMMIT', 'QUARTERLY', 'DEPARTMENT'],
    targetResponseTimeMs: 2100
  },

  // --- Conditionals (Zero, 1st, 2nd, 3rd) ---
  {
    id: 't2-cond-01',
    tier: 2,
    category: 'tenses',
    modeBadge: 'Third Conditional',
    prompt: 'Complete the past unreal conditional sentence correctly:',
    subPrompt: 'If we had known about the severe blizzard warning, we _____ at home.',
    options: ['would stay', 'would have stayed', 'had stayed', 'will have stayed', 'stayed'],
    correctAnswer: 'would have stayed',
    explanation: "Third conditional structure: \"If + past perfect (had known), ... would have + past participle (would have stayed)\".",
    primaryWords: ['BLIZZARD', 'WARNING', 'STAYED'],
    targetResponseTimeMs: 2200
  },

  // --- Sentence Error Spotting (Intermediate) ---
  {
    id: 't2-err-01',
    tier: 2,
    category: 'sentence_error',
    modeBadge: 'Sentence Error Spotting',
    prompt: 'Spot the segment containing a grammatical error:',
    subPrompt: 'Scarcely had (A) he stepped outside (B) than the heavy thunderstorm (C) erupted. (D)',
    options: ['(A) Scarcely had', '(B) he stepped outside', '(C) than the heavy thunderstorm', '(D) erupted', '(E) No error'],
    correctAnswer: '(C) than the heavy thunderstorm',
    explanation: "\"Scarcely\" and \"Hardly\" correlate with \"when\" or \"before\", never \"than\" (which correlates with \"No sooner\").",
    primaryWords: ['SCARCELY', 'THUNDERSTORM', 'ERUPTED'],
    targetResponseTimeMs: 2400
  },
  {
    id: 't2-err-02',
    tier: 2,
    category: 'sentence_error',
    modeBadge: 'Sentence Error Spotting',
    prompt: 'Find the erroneous segment:',
    subPrompt: 'One of the most (A) influential researchers (B) have published (C) a groundbreaking study. (D)',
    options: ['(A) One of the most', '(B) influential researchers', '(C) have published', '(D) a groundbreaking study', '(E) No error'],
    correctAnswer: '(C) have published',
    explanation: "The subject is \"One\", which is singular and requires \"has published\", not \"have published\".",
    primaryWords: ['INFLUENTIAL', 'RESEARCHER', 'GROUNDBREAKING'],
    targetResponseTimeMs: 2300
  },

  // --- Sentence Arrangement (Intermediate) ---
  {
    id: 't2-arr-01',
    tier: 2,
    category: 'sentence_arrangement',
    modeBadge: 'Sentence Arrangement',
    prompt: 'Order the clauses into a coherent sentence:',
    subPrompt: '[P] to preserve cultural heritage  [Q] modern museums employ  [R] innovative digital archives  [S] for future generations',
    options: ['Q - R - P - S', 'P - S - Q - R', 'R - Q - P - S', 'S - Q - R - P', 'Q - P - R - S'],
    correctAnswer: 'Q - R - P - S',
    explanation: "\"Modern museums employ innovative digital archives to preserve cultural heritage for future generations.\"",
    primaryWords: ['MUSEUMS', 'HERITAGE', 'ARCHIVES'],
    targetResponseTimeMs: 2500
  },

  // --- Usage Rules (Intermediate) ---
  {
    id: 't2-use-01',
    tier: 2,
    category: 'usage_rules',
    modeBadge: 'Grammar Usage Rule',
    prompt: 'Which sentence correctly uses "BETWEEN"?',
    options: [
      'A dispute arose between the five committee members.',
      'The treaty was signed between the three neighboring nations.',
      'Negotiations took place between the union representatives and the board.',
      'Divide the candy between all the children in the classroom.',
      'He distributed the pamphlets between the crowd.'
    ],
    correctAnswer: 'Negotiations took place between the union representatives and the board.',
    explanation: "'Between' is used for two distinct parties or bilateral relations (\"the union representatives and the board\").",
    primaryWords: ['TREATY', 'COMMITTEE', 'NEGOTIATIONS'],
    targetResponseTimeMs: 2300
  },

  // ===========================================
  // TIER 3: EXPERT (LEVELS 26–50) - CAT / GMAT / GRE
  // ===========================================

  // --- Subjunctive Mood ---
  {
    id: 't3-subj-01',
    tier: 3,
    category: 'advanced_syntax',
    modeBadge: 'Mandative Subjunctive',
    prompt: 'Choose the verb form that strictly adheres to the mandative subjunctive mood:',
    subPrompt: 'The committee demanded that the regional director _____ immediate financial disclosures.',
    options: ['submits', 'submit', 'submitted', 'would submit', 'will submit'],
    correctAnswer: 'submit',
    explanation: "Verbs of urging/mandating (demand, insist, recommend) take the bare subjunctive (\"submit\", not \"submits\").",
    primaryWords: ['MANDATIVE', 'DIRECTOR', 'DISCLOSURE'],
    targetResponseTimeMs: 2200
  },
  {
    id: 't3-subj-02',
    tier: 3,
    category: 'advanced_syntax',
    modeBadge: 'Subjunctive Mood',
    prompt: 'Select the sentence that correctly employs the subjunctive mood:',
    options: [
      'I wish I was on a tropical island right now.',
      'It is crucial that each applicant be evaluated objectively.',
      'He insisted that she goes to the specialist immediately.',
      'The law requires that every citizen pays income taxes.',
      'If he was the president, he would lower tariffs.'
    ],
    correctAnswer: 'It is crucial that each applicant be evaluated objectively.',
    explanation: "Adjectives of necessity (crucial, vital, essential) trigger the bare subjunctive form (\"be evaluated\").",
    primaryWords: ['APPLICANT', 'EVALUATED', 'CRUCIAL'],
    targetResponseTimeMs: 2400
  },

  // --- Negative Inversion ---
  {
    id: 't3-inv-01',
    tier: 3,
    category: 'advanced_syntax',
    modeBadge: 'Negative Inversion',
    prompt: 'Select the grammatically inverted clause following the negative adverbial:',
    subPrompt: 'Seldom _____ such extraordinary resilience in the face of insurmountable adversity.',
    options: ['we have witnessed', 'have we witnessed', 'we witnessed', 'we had witnessed', 'did we witnessed'],
    correctAnswer: 'have we witnessed',
    explanation: "When negative or restrictive adverbs (seldom, rarely, never, scarcely) front a sentence, subject-auxiliary inversion is mandatory.",
    primaryWords: ['RESILIENCE', 'ADVERSITY', 'INSURMOUNTABLE'],
    targetResponseTimeMs: 2200
  },
  {
    id: 't3-inv-02',
    tier: 3,
    category: 'advanced_syntax',
    modeBadge: 'Negative Inversion',
    prompt: 'Complete the sentence with correct inverted syntax:',
    subPrompt: 'Not only _____ the groundbreaking theory, but she also validated it empirically.',
    options: [
      'she formulated',
      'did she formulate',
      'she had formulated',
      'was she formulated',
      'she did formulate'
    ],
    correctAnswer: 'did she formulate',
    explanation: "\"Not only\" at the start of a clause requires subject-auxiliary inversion: \"did she formulate\".",
    primaryWords: ['THEORY', 'EMPIRICALLY', 'FORMULATED'],
    targetResponseTimeMs: 2200
  },

  // --- Dangling & Misplaced Modifiers ---
  {
    id: 't3-mod-01',
    tier: 3,
    category: 'sentence_error',
    modeBadge: 'Dangling Modifier',
    prompt: 'Which sentence avoids the grammatical flaw of a dangling modifier?',
    options: [
      'Having finished the rigorous examination, the pencils were collected by the proctor.',
      'Walking down the cobblestone street, the historic cathedral caught our attention.',
      'Tired after a grueling flight, the hotel room was a welcome sight for the weary traveler.',
      'Having analyzed the quarterly metrics, the analyst presented the findings to the board.',
      'Baking in the oven for two hours, the aroma of the bread filled the entire kitchen.'
    ],
    correctAnswer: 'Having analyzed the quarterly metrics, the analyst presented the findings to the board.',
    explanation: "The introductory participial phrase \"Having analyzed...\" must logically modify the grammatical subject immediately following (\"the analyst\").",
    primaryWords: ['ANALYST', 'METRICS', 'FINDINGS'],
    targetResponseTimeMs: 2500
  },

  // --- Parallel Structure Violations ---
  {
    id: 't3-par-01',
    tier: 3,
    category: 'usage_rules',
    modeBadge: 'Parallel Structure',
    prompt: 'Identify the sentence demonstrating flawless grammatical parallelism:',
    options: [
      'The CEO aims to expand global market share, optimizing operational workflows, and reduce overhead.',
      'The CEO aims to expand global market share, optimize operational workflows, and reduce overhead.',
      'The CEO aims expanding global market share, to optimize operational workflows, and reduction of overhead.',
      'The CEO aims to expand global market share, for optimizing operational workflows, and overhead reduction.',
      'The CEO aims expansion of global market share, to optimize operational workflows, and reduce overhead.'
    ],
    correctAnswer: 'The CEO aims to expand global market share, optimize operational workflows, and reduce overhead.',
    explanation: "Parallel coordinate verbs governed by \"aims to\": [expand], [optimize], and [reduce].",
    primaryWords: ['WORKFLOWS', 'OVERHEAD', 'MARKET'],
    targetResponseTimeMs: 2400
  },

  // --- Confusable Paronyms (Expert) ---
  {
    id: 't3-paro-01',
    tier: 3,
    category: 'paronyms',
    modeBadge: 'Paronym Nuance',
    prompt: 'Choose the exact paronym that completes the sentence with semantic precision:',
    subPrompt: 'The artist felt that the custom oak frame would perfectly _____ the minimalist painting.',
    options: ['compliment', 'complement', 'compromise', 'contemplate', 'complicate'],
    correctAnswer: 'complement',
    explanation: "\"Complement\" means to enhance or complete something harmonious. \"Compliment\" means to praise.",
    primaryWords: ['MINIMALIST', 'PAINTING', 'FRAME'],
    targetResponseTimeMs: 2000
  },
  {
    id: 't3-paro-02',
    tier: 3,
    category: 'paronyms',
    modeBadge: 'Paronym Nuance',
    prompt: 'Select the correct word for the context:',
    subPrompt: 'The diplomat handled the confidential negotiations with exceptional _____ and discretion.',
    options: ['tact', 'tack', 'tract', 'tactile', 'tractable'],
    correctAnswer: 'tact',
    explanation: "\"Tact\" is skill and sensitivity in dealing with others or difficult issues.",
    primaryWords: ['DIPLOMAT', 'CONFIDENTIAL', 'DISCRETION'],
    targetResponseTimeMs: 2000
  },

  // ==========================================================
  // TIER 4: TOP 1% GLOBAL EXPERT (LEVELS 51–99+) - COGNITIVE MASTERY
  // ==========================================================

  // --- Absolute Constructions & Cleft Sentences ---
  {
    id: 't4-cleft-01',
    tier: 4,
    category: 'advanced_syntax',
    modeBadge: 'Cleft Construction',
    prompt: 'Identify the sentence exemplifying a grammatically flawless reverse it-cleft construction:',
    options: [
      'It was her indomitable perseverance that turned the tide of the campaign.',
      'Her indomitable perseverance was what it turned the tide of the campaign.',
      'It were her perseverance that had turned the tide of the campaign.',
      'That turned the tide of the campaign it was her indomitable perseverance.',
      'It had been her perseverance which turning the tide of the campaign.'
    ],
    correctAnswer: 'It was her indomitable perseverance that turned the tide of the campaign.',
    explanation: "A classic cleft sentence emphasizes an element using \"It + [be] + [focused element] + that/who + [clause]\".",
    primaryWords: ['PERSEVERANCE', 'INDOMITABLE', 'CAMPAIGN'],
    targetResponseTimeMs: 2400
  },
  {
    id: 't4-abs-01',
    tier: 4,
    category: 'advanced_syntax',
    modeBadge: 'Absolute Construction',
    prompt: 'Select the sentence with a grammatically authentic nominative absolute construction:',
    options: [
      'The storm having subsided, the rescue expedition resumed their ascent up the ridge.',
      'Having the storm subsided, the rescue expedition resumed their ascent up the ridge.',
      'The storm had subsided, so the rescue expedition resumed their ascent up the ridge.',
      'Subsided the storm, the rescue expedition resumed their ascent up the ridge.',
      'The storm having been subsided, the rescue expedition resumed their ascent.'
    ],
    correctAnswer: 'The storm having subsided, the rescue expedition resumed their ascent up the ridge.',
    explanation: "A nominative absolute consists of a noun (\"The storm\") and a participle (\"having subsided\") grammatically unattached to the main clause.",
    primaryWords: ['EXPEDITION', 'RIDGE', 'SUBSIDED'],
    targetResponseTimeMs: 2500
  },

  // --- Formal Prepositional Idioms (Top 1%) ---
  {
    id: 't4-prep-01',
    tier: 4,
    category: 'prepositions',
    modeBadge: 'Formal Prepositional Idiom',
    prompt: 'Which preposition idiomatically collocates with "acquiesce"?',
    subPrompt: 'The senator refused to acquiesce _____ the questionable procedural amendments.',
    options: ['to', 'in', 'with', 'at', 'into'],
    correctAnswer: 'in',
    explanation: "In formal standard English, the verb \"acquiesce\" idiomatically takes \"in\" (meaning to reluctantly accept without protest).",
    primaryWords: ['ACQUIESCE', 'SENATOR', 'AMENDMENTS'],
    targetResponseTimeMs: 2000
  },
  {
    id: 't4-prep-02',
    tier: 4,
    category: 'prepositions',
    modeBadge: 'Formal Prepositional Idiom',
    prompt: 'Select the preposition that correctly collocates with "averse":',
    subPrompt: 'The veteran statesman was completely averse _____ engaging in populist rhetoric.',
    options: ['to', 'from', 'with', 'against', 'towards'],
    correctAnswer: 'to',
    explanation: "The adjective \"averse\" (meaning having a strong disinclination) takes the preposition \"to\".",
    primaryWords: ['AVERSE', 'STATESMAN', 'POPULIST'],
    targetResponseTimeMs: 2000
  },

  // --- Restrictive vs. Non-Restrictive Relative Clauses ---
  {
    id: 't4-rel-01',
    tier: 4,
    category: 'usage_rules',
    modeBadge: 'Relative Clause Nuance',
    prompt: 'Which sentence correctly adheres to the stylistic distinction between restrictive "that" and non-restrictive "which"?',
    options: [
      'The manuscript, that was discovered in the monastery vault, dates back to the ninth century.',
      'The manuscript which was discovered in the monastery vault dates back to the ninth century.',
      'The manuscript, which was discovered in the monastery vault, dates back to the ninth century.',
      'The manuscript, whose discovered in the monastery vault, dates back to the ninth century.',
      'The manuscript that, was discovered in the monastery vault, dates back to the ninth century.'
    ],
    correctAnswer: 'The manuscript, which was discovered in the monastery vault, dates back to the ninth century.',
    explanation: "Non-restrictive relative clauses provide parenthetical, non-essential information and are bracketed by commas using \"which\".",
    primaryWords: ['MANUSCRIPT', 'MONASTERY', 'VAULT'],
    targetResponseTimeMs: 2600
  },

  // --- Semantic Shift & Confusable Traps (Top 1%) ---
  {
    id: 't4-sem-01',
    tier: 4,
    category: 'paronyms',
    modeBadge: 'Semantic Discrimination',
    prompt: 'Choose the word that strictly denotes impartial objectivity (free from personal bias or financial stake):',
    subPrompt: 'The legal proceedings required an entirely _____ magistrate to oversee the antitrust trial.',
    options: ['uninterested', 'disinterested', 'indifferent', 'apathetic', 'detachedly'],
    correctAnswer: 'disinterested',
    explanation: "\"Disinterested\" means impartial and unbiased. \"Uninterested\" means bored or lacking interest.",
    primaryWords: ['MAGISTRATE', 'ANTITRUST', 'PROCEEDINGS'],
    targetResponseTimeMs: 2100
  },
  {
    id: 't4-sem-02',
    tier: 4,
    category: 'paronyms',
    modeBadge: 'Semantic Discrimination',
    prompt: 'Fill in the blank with the word meaning "to openly disregard a law or rule":',
    subPrompt: 'The rebellious corporation chose to _____ the environmental regulations repeatedly.',
    options: ['flaunt', 'flout', 'forge', 'falter', 'foster'],
    correctAnswer: 'flout',
    explanation: "\"Flout\" means to openly disobey or disregard a law/convention. \"Flaunt\" means to show off ostentatiously.",
    primaryWords: ['CORPORATION', 'REGULATIONS', 'REBELLIOUS'],
    targetResponseTimeMs: 2000
  },

  // --- Complex Sentence Error (Top 1%) ---
  {
    id: 't4-err-01',
    tier: 4,
    category: 'sentence_error',
    modeBadge: 'Syntactic Error Spotting',
    prompt: 'Identify the segment containing an error in correlative conjunction parallelism:',
    subPrompt: 'The treaty (A) was designed not only (B) to stabilize regional borders (C) but also ensuring economic prosperity. (D)',
    options: ['(A) The treaty', '(B) was designed not only', '(C) to stabilize regional borders', '(D) but also ensuring economic prosperity', '(E) No error'],
    correctAnswer: '(D) but also ensuring economic prosperity',
    explanation: "Parallelism requires symmetrical structures: \"not only [to stabilize] ... but also [to ensure]\" (not \"ensuring\").",
    primaryWords: ['BORDERS', 'PROSPERITY', 'STABILIZE'],
    targetResponseTimeMs: 2500
  },
  {
    id: 't4-err-02',
    tier: 4,
    category: 'sentence_error',
    modeBadge: 'Syntactic Error Spotting',
    prompt: 'Identify the subtle grammatical flaw in this complex period:',
    subPrompt: 'Being that he was (A) an accomplished pianist, (B) his performance mesmerized (C) the entire auditorium. (D)',
    options: ['(A) Being that he was', '(B) an accomplished pianist', '(C) his performance mesmerized', '(D) the entire auditorium', '(E) No error'],
    correctAnswer: '(A) Being that he was',
    explanation: "\"Being that\" is a colloquial and grammatically incorrect causal subordinator in formal English; use \"Since\" or \"Because\".",
    primaryWords: ['PIANIST', 'MESMERIZED', 'AUDITORIUM'],
    targetResponseTimeMs: 2500
  }
];

/**
 * Returns questions filtered by tier
 */
export function getQuestionsByTier(tier: 1 | 2 | 3 | 4): GrammarQuestionItem[] {
  return GRAMMAR_QUESTIONS_DATASET.filter(q => q.tier === tier);
}
