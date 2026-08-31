/**
 * Comprehensive Lexical Database & Multi-Tier Linguistic Taxonomy
 * 
 * Tiers:
 * Tier 1: 4–8 letters (Common but non-trivial, foundational cognitive vocabulary)
 * Tier 2: 9–12 letters (Competitive-exam vocabulary)
 * Tier 3: 12–15 letters (Intermediate academic vocabulary)
 * Tier 4/5: 15+ letters (Advanced & high-difficulty multi-property vocabulary)
 */

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'pronoun'
  | 'interjection';

export interface LexicalWord {
  word: string;
  length: number;
  partOfSpeech: PartOfSpeech;
  tier: 1 | 2 | 3 | 4 | 5;
  definition: string;
  synonyms: string[];
  antonyms: string[];
  nearDistractors: string[]; // Confusable words or semantically close words
  category: string;
  exampleSentence: string;
}

export interface ParonymPair {
  wordA: string;
  wordB: string;
  posA: PartOfSpeech;
  posB: PartOfSpeech;
  definitionA: string;
  definitionB: string;
  sentenceA: string;
  sentenceB: string;
}

export interface GrammarClassPool {
  nouns: string[];
  verbs: string[];
  adjectives: string[];
  adverbs: string[];
  prepositions: string[];
  conjunctions: string[];
  pronouns: string[];
  interjections: string[];
}

export const GRAMMAR_CLASS_WORDS: GrammarClassPool = {
  nouns: [
    'PROFIT', 'INCOME', 'ASSET', 'DEFICIT', 'STABILITY', 'ABUNDANCE', 'EQUILIBRIUM',
    'FACTOR', 'BALANCE', 'ACCOUNT', 'CREDIT', 'INTEREST', 'MOMENTUM', 'CAPITAL',
    'PARADIGM', 'CRITERIA', 'CONSENSUS', 'AUTHENTICATION', 'IMPLEMENTATION', 'TRANSFORMATION'
  ],
  verbs: [
    'EXPAND', 'REDUCE', 'ASSIST', 'PERMIT', 'ACCELERATE', 'DIMINISH', 'CONTEMPLATE',
    'SCRUTINIZE', 'VINDICATE', 'ARTICULATE', 'FLUCTUATE', 'FACILITATE', 'ELABORATE',
    'DIFFERENTIATE', 'CONSOLIDATE', 'STABILIZE', 'COMMUNICATE', 'INTERNATIONALIZE'
  ],
  adjectives: [
    'RAPID', 'ANNUAL', 'STABLE', 'SECURE', 'NARROW', 'FORMAL', 'LUCID', 'ACCURATE',
    'BENEFICIAL', 'ABUNDANT', 'METICULOUS', 'INEVITABLE', 'PRAGMATIC', 'RESILIENT',
    'COMPREHENSIVE', 'EXTRAORDINARY', 'INDISPENSABLE', 'UNPRECEDENTED', 'UNCHARACTERISTIC'
  ],
  adverbs: [
    'RAPIDLY', 'ANNUALLY', 'SWIFTLY', 'PRECISELY', 'METICULOUSLY', 'SUBSTANTIALLY',
    'PRAGMATICALLY', 'RELUCTANTLY', 'CONSISTENTLY', 'SPORADICALLY', 'MAGNANIMOUSLY',
    'NONCHALANTLY', 'UNCOMPROMISINGLY', 'INTERMITTENTLY', 'INDISPUTABLY'
  ],
  prepositions: [
    'THROUGHOUT', 'REGARDING', 'CONCERNING', 'DESPITE', 'UNDERNEATH', 'BESIDES',
    'NOTWITHSTANDING', 'ALONGSIDE', 'BEYOND', 'TOWARDS', 'BETWIXT', 'UPON'
  ],
  conjunctions: [
    'ALTHOUGH', 'NEVERTHELESS', 'WHEREBY', 'WHEREAS', 'FURTHERMORE', 'CONSEQUENTLY',
    'PROVIDED', 'UNLESS', 'INASMUCH', 'THEREFORE', 'WHILST', 'HOWEVER'
  ],
  pronouns: [
    'EVERYBODY', 'THEMSELVES', 'WHOSOEVER', 'WHICHEVER', 'EACHOTHER', 'ONEANOTHER',
    'ANYBODY', 'SOMEONE', 'EVERYONE', 'OURSELVES', 'WHOMSOEVER'
  ],
  interjections: [
    'BRAVO', 'ALAS', 'BEHOLD', 'EUREKA', 'GREETINGS', 'HOORAY', 'KUDOS'
  ]
};

export const PARONYM_PAIRS: ParonymPair[] = [
  {
    wordA: 'PRINCIPAL',
    wordB: 'PRINCIPLE',
    posA: 'noun',
    posB: 'noun',
    definitionA: 'The main financial sum invested or the head of an institution',
    definitionB: 'A fundamental truth, doctrine, or moral rule',
    sentenceA: 'The ___ sum invested in bonds compounds interest quarterly.',
    sentenceB: 'He refused to compromise on his ethical ___.'
  },
  {
    wordA: 'AFFECT',
    wordB: 'EFFECT',
    posA: 'verb',
    posB: 'noun',
    definitionA: 'To have an active influence or produce a change upon',
    definitionB: 'A change that is a result or consequence of an action',
    sentenceA: 'Interest rate fluctuations directly ___ economic growth.',
    sentenceB: 'The positive ___ of the stimulus was visible immediately.'
  },
  {
    wordA: 'COMPLIMENT',
    wordB: 'COMPLEMENT',
    posA: 'noun',
    posB: 'verb',
    definitionA: 'A polite expression of praise, admiration, or congratulation',
    definitionB: 'To add to in a way that enhances or completes',
    sentenceA: 'The auditor gave a sincere ___ on our reporting accuracy.',
    sentenceB: 'Analytical rigor will ___ creative problem solving.'
  },
  {
    wordA: 'DISCREET',
    wordB: 'DISCRETE',
    posA: 'adjective',
    posB: 'adjective',
    definitionA: 'Careful and prudent in speech or actions to avoid offense',
    definitionB: 'Individually separate, distinct, and detached',
    sentenceA: 'We maintained a ___ silence regarding ongoing merger talks.',
    sentenceB: 'The algorithm breaks calculations into ___ numeric chunks.'
  },
  {
    wordA: 'EMINENT',
    wordB: 'IMMINENT',
    posA: 'adjective',
    posB: 'adjective',
    definitionA: 'Famous, respected, and distinguished within a sphere',
    definitionB: 'About to happen; looming or impending',
    sentenceA: 'The keynote was delivered by an ___ neuroscientist.',
    sentenceB: 'The launch is ___ and will deploy within moments.'
  }
];

export const LEXICAL_DATASET: LexicalWord[] = [
  // =========================================================================
  // TIER 1: 4–8 Letters (Foundational, Non-Trivial Cognitive Vocabulary)
  // =========================================================================
  {
    word: 'RAPID',
    length: 5,
    partOfSpeech: 'adjective',
    tier: 1,
    definition: 'Happening in a brief period of time; fast and swift',
    synonyms: ['SWIFT', 'SPEEDY', 'PROMPT', 'QUICK', 'FLEET'],
    antonyms: ['SLUGGISH', 'SLOW', 'LEISURELY', 'DELAYED', 'TARDY'],
    nearDistractors: ['STABLE', 'SECURE', 'ANNUAL', 'NARROW', 'RIGID'],
    category: 'speed',
    exampleSentence: 'The startup achieved rapid growth in quarterly revenues.'
  },
  {
    word: 'ANNUAL',
    length: 6,
    partOfSpeech: 'adjective',
    tier: 1,
    definition: 'Occurring once every year; yearly',
    synonyms: ['YEARLY', 'PERIODIC', 'REGULAR'],
    antonyms: ['PERENNIAL', 'IRREGULAR', 'SPORADIC'],
    nearDistractors: ['ACTUAL', 'MANUAL', 'MUTUAL', 'CASUAL'],
    category: 'time',
    exampleSentence: 'The bank released its annual financial disclosure statement.'
  },
  {
    word: 'STABLE',
    length: 6,
    partOfSpeech: 'adjective',
    tier: 1,
    definition: 'Not likely to change, fail, or fluctuate; firmly established',
    synonyms: ['STEADY', 'SECURE', 'FIRM', 'CONSTANT', 'FIXED'],
    antonyms: ['VOLATILE', 'UNSTABLE', 'ERRATIC', 'SHAKY', 'FICKLE'],
    nearDistractors: ['ABLE', 'TABLE', 'CABLE', 'SUBTLE'],
    category: 'state',
    exampleSentence: 'A stable monetary policy encourages long-term investments.'
  },
  {
    word: 'PROFIT',
    length: 6,
    partOfSpeech: 'noun',
    tier: 1,
    definition: 'Financial gain when returns exceed operational costs',
    synonyms: ['GAIN', 'SURPLUS', 'RETURN', 'YIELD'],
    antonyms: ['LOSS', 'DEFICIT', 'EXPENSE', 'DEBT'],
    nearDistractors: ['PROPHET', 'PROOF', 'PROFILE', 'PORTAL'],
    category: 'finance',
    exampleSentence: 'Operational efficiency drove higher net profit this fiscal year.'
  },
  {
    word: 'DECLINE',
    length: 7,
    partOfSpeech: 'verb',
    tier: 1,
    definition: 'To become smaller, fewer, or less; or to politely refuse',
    synonyms: ['DECREASE', 'DIMINISH', 'DWINDLE', 'DROP', 'REFUSE'],
    antonyms: ['INCREASE', 'GROW', 'EXPAND', 'RISE', 'ACCEPT'],
    nearDistractors: ['RECLINE', 'INCLINE', 'DEFINE', 'COMBINE'],
    category: 'change',
    exampleSentence: 'Production defects began to decline after systematic testing.'
  },
  {
    word: 'PERMIT',
    length: 6,
    partOfSpeech: 'verb',
    tier: 1,
    definition: 'To give authorization or consent for something to occur',
    synonyms: ['ALLOW', 'AUTHORIZE', 'ENABLE', 'SANCTION', 'LET'],
    antonyms: ['FORBID', 'PROHIBIT', 'BAN', 'PREVENT', 'DISALLOW'],
    nearDistractors: ['PURSUIT', 'PERMITTED', 'PREVENT', 'SUBMIT'],
    category: 'authority',
    exampleSentence: 'The regulations permit access only to verified personnel.'
  },
  {
    word: 'SECURE',
    length: 6,
    partOfSpeech: 'adjective',
    tier: 1,
    definition: 'Fixed or fastened so as not to give way, become loose, or be lost',
    synonyms: ['SAFE', 'PROTECTED', 'STABLE', 'SHIELDED', 'FORTIFIED'],
    antonyms: ['VULNERABLE', 'UNSAFE', 'EXPOSED', 'PRECARIOUS'],
    nearDistractors: ['SEDUCE', 'SEVERE', 'SINCERE', 'SECTOR'],
    category: 'safety',
    exampleSentence: 'Strong cryptographic hashing ensures secure client sessions.'
  },
  {
    word: 'ASSIST',
    length: 6,
    partOfSpeech: 'verb',
    tier: 1,
    definition: 'To help someone typically by doing a share of the work',
    synonyms: ['HELP', 'AID', 'SUPPORT', 'BACK', 'SUCCOR'],
    antonyms: ['HINDER', 'OBSTRUCT', 'IMPEDE', 'THWART', 'BLOCK'],
    nearDistractors: ['RESIST', 'INSIST', 'PERSIST', 'CONSIST'],
    category: 'support',
    exampleSentence: 'Automated diagnostics assist engineers in resolving bottlenecks.'
  },
  {
    word: 'FACTOR',
    length: 6,
    partOfSpeech: 'noun',
    tier: 1,
    definition: 'A circumstance, fact, or influence that contributes to a result',
    synonyms: ['ELEMENT', 'COMPONENT', 'VARIABLE', 'ASPECT', 'AGENT'],
    antonyms: ['RESULT', 'WHOLE'],
    nearDistractors: ['SECTOR', 'VECTOR', 'TRACTOR', 'ACTOR'],
    category: 'logic',
    exampleSentence: 'Working memory capacity is a primary factor in arithmetic speed.'
  },
  {
    word: 'IMPACT',
    length: 6,
    partOfSpeech: 'noun',
    tier: 1,
    definition: 'The marked effect or influence of an action or event',
    synonyms: ['EFFECT', 'INFLUENCE', 'CONSEQUENCE', 'IMPRESSION'],
    antonyms: ['CAUSE', 'ORIGIN'],
    nearDistractors: ['COMPACT', 'INTACT', 'EXTRACT', 'CONTRACT'],
    category: 'cause_effect',
    exampleSentence: 'Cognitive training exerts a profound impact on focus duration.'
  },
  {
    word: 'LUCID',
    length: 5,
    partOfSpeech: 'adjective',
    tier: 1,
    definition: 'Expressed clearly; easy to understand and rational',
    synonyms: ['CLEAR', 'COHERENT', 'TRANSPARENT', 'EVIDENT', 'EXPLICIT'],
    antonyms: ['OBSCURE', 'AMBIGUOUS', 'CONFUSING', 'VAGUE', 'MURKY'],
    nearDistractors: ['LURID', 'LIQUID', 'LACKING', 'LUXURY'],
    category: 'clarity',
    exampleSentence: 'Her lucid explanation made the algorithmic proof effortless to follow.'
  },
  {
    word: 'NARROW',
    length: 6,
    partOfSpeech: 'adjective',
    tier: 1,
    definition: 'Of small width in relation to length; limited in extent or scope',
    synonyms: ['CONFINED', 'TIGHT', 'SLENDER', 'RESTRICTED'],
    antonyms: ['BROAD', 'WIDE', 'EXPANSIVE', 'EXTENSIVE'],
    nearDistractors: ['MARROW', 'BARROW', 'ARROW', 'SPARROW'],
    category: 'spatial',
    exampleSentence: 'The candidate was chosen by a narrow margin of votes.'
  },
  {
    word: 'FORMAL',
    length: 6,
    partOfSpeech: 'adjective',
    tier: 1,
    definition: 'Done in accordance with rules of convention or etiquette',
    synonyms: ['OFFICIAL', 'CONVENTIONAL', 'LEGAL', 'CEREMONIAL'],
    antonyms: ['INFORMAL', 'CASUAL', 'UNOFFICIAL', 'RELAXED'],
    nearDistractors: ['NORMAL', 'FORMAT', 'FORMER', 'CORDIAL'],
    category: 'structure',
    exampleSentence: 'The committee published its formal evaluation guidelines.'
  },

  // =========================================================================
  // TIER 2: 9–12 Letters (Competitive Exam Vocabulary)
  // =========================================================================
  {
    word: 'ABUNDANCE',
    length: 9,
    partOfSpeech: 'noun',
    tier: 2,
    definition: 'A very large quantity of something; overflowing supply',
    synonyms: ['PLENTY', 'PROFUSION', 'WEALTH', 'OPULENCE', 'SURPLUS'],
    antonyms: ['SCARCITY', 'DEARTH', 'PAUCITY', 'DEFICIT', 'LACK'],
    nearDistractors: ['ABUNDANT', 'REDUNDANCE', 'RELUCTANCE', 'IMPORTANCE'],
    category: 'quantity',
    exampleSentence: 'The harvest generated an abundance of grain for export.'
  },
  {
    word: 'SUBSTANTIAL',
    length: 11,
    partOfSpeech: 'adjective',
    tier: 2,
    definition: 'Of considerable importance, size, or worth; strongly built',
    synonyms: ['CONSIDERABLE', 'SIGNIFICANT', 'WEIGHTY', 'EXTENSIVE', 'AMPLE'],
    antonyms: ['INSIGNIFICANT', 'NEGLIGIBLE', 'MINIMAL', 'TRIVIAL', 'SLIGHT'],
    nearDistractors: ['SUBSTANTIVE', 'SUBSTITUTE', 'SUSTAINABLE', 'SUBMISSIVE'],
    category: 'magnitude',
    exampleSentence: 'The upgrade delivered a substantial boost to processing speed.'
  },
  {
    word: 'SIGNIFICANT',
    length: 11,
    partOfSpeech: 'adjective',
    tier: 2,
    definition: 'Sufficiently great or important to be worthy of attention',
    synonyms: ['NOTABLE', 'MOMENTOUS', 'CRITICAL', 'MEANINGFUL', 'VITAL'],
    antonyms: ['INSIGNIFICANT', 'MINOR', 'TRIVIAL', 'MEANINGLESS'],
    nearDistractors: ['MAGNIFICENT', 'SPECIFIC', 'INSUFFICIENT', 'EFFICIENT'],
    category: 'importance',
    exampleSentence: 'Statistical analysis revealed a significant positive correlation.'
  },
  {
    word: 'METICULOUS',
    length: 10,
    partOfSpeech: 'adjective',
    tier: 2,
    definition: 'Showing great attention to detail; very careful and precise',
    synonyms: ['DILIGENT', 'SCRUPULOUS', 'PAINSTAKING', 'EXACT', 'RIGOROUS'],
    antonyms: ['SLOPPY', 'CARELESS', 'NEGLIGENT', 'HAPHAZARD', 'CURSORY'],
    nearDistractors: ['MALICIOUS', 'RIDICULOUS', 'MIRACULOUS', 'LUDICROUS'],
    category: 'precision',
    exampleSentence: 'The software architecture underwent meticulous safety audits.'
  },
  {
    word: 'INEVITABLE',
    length: 10,
    partOfSpeech: 'adjective',
    tier: 2,
    definition: 'Certain to happen; impossible to avoid or evade',
    synonyms: ['UNAVOIDABLE', 'INESCAPABLE', 'INEXORABLE', 'CERTAIN', 'SURE'],
    antonyms: ['AVOIDABLE', 'PREVENTABLE', 'EVADABLE', 'UNCERTAIN'],
    nearDistractors: ['INIMITABLE', 'INHABITABLE', 'INVALID', 'INVINCIBLE'],
    category: 'certainty',
    exampleSentence: 'With exponential compounding, higher mastery scores are inevitable.'
  },
  {
    word: 'EQUILIBRIUM',
    length: 11,
    partOfSpeech: 'noun',
    tier: 2,
    definition: 'A state in which opposing forces or influences are balanced',
    synonyms: ['BALANCE', 'SYMMETRY', 'STABILITY', 'POISE', 'PARITY'],
    antonyms: ['IMBALANCE', 'DISEQUILIBRIUM', 'INSTABILITY', 'ASYMMETRY'],
    nearDistractors: ['EQUIVOCAL', 'EQUIVALENT', 'EQUINOX', 'DELIRIUM'],
    category: 'physics_state',
    exampleSentence: 'The torque scale reached equilibrium when both moments balanced.'
  },
  {
    word: 'PRAGMATIC',
    length: 9,
    partOfSpeech: 'adjective',
    tier: 2,
    definition: 'Dealing with things sensibly and realistically based on practical results',
    synonyms: ['PRACTICAL', 'REALISTIC', 'RATIONAL', 'SENSIBLE', 'UTILITY'],
    antonyms: ['IDEALISTIC', 'IMPRACTICAL', 'VISIONARY', 'DOGMATIC'],
    nearDistractors: ['DRAMATIC', 'PNEUMATIC', 'DOGMATIC', 'PARADIGMATIC'],
    category: 'philosophy',
    exampleSentence: 'A pragmatic engineering solution values robust uptime over theory.'
  },
  {
    word: 'ACCELERATE',
    length: 10,
    partOfSpeech: 'verb',
    tier: 2,
    definition: 'To increase speed or cause a process to occur sooner',
    synonyms: ['EXPEDITE', 'QUICKEN', 'HASTEN', 'FORWARD', 'STIMULATE'],
    antonyms: ['DECELERATE', 'DELAY', 'RETARD', 'OBSTRUCT', 'BRAKE'],
    nearDistractors: ['ACCUMULATE', 'ACCENTUATE', 'CELEBRATE', 'AGGRAVATE'],
    category: 'motion',
    exampleSentence: 'Soroban flash arithmetic exercises accelerate working memory recall.'
  },

  // =========================================================================
  // TIER 3: 12–15 Letters (Intermediate Academic & Multi-Property)
  // =========================================================================
  {
    word: 'COMPREHENSIVE',
    length: 13,
    partOfSpeech: 'adjective',
    tier: 3,
    definition: 'Complete; including or dealing with all or nearly all elements',
    synonyms: ['EXHAUSTIVE', 'INCLUSIVE', 'ALL-EMBRACING', 'THOROUGH', 'GLOBAL'],
    antonyms: ['PARTIAL', 'INCOMPLETE', 'LIMITED', 'NARROW', 'RESTRICTED'],
    nearDistractors: ['COMPREHENSIBLE', 'APPREHENSIVE', 'COMPETITIVE', 'COMPENSATION'],
    category: 'scope',
    exampleSentence: 'The suite executes a comprehensive battery of 55 automated tests.'
  },
  {
    word: 'EXTRAORDINARY',
    length: 13,
    partOfSpeech: 'adjective',
    tier: 3,
    definition: 'Very unusual, remarkable, or exceptional beyond common standard',
    synonyms: ['EXCEPTIONAL', 'REMARKABLE', 'OUTSTANDING', 'PHENOMENAL', 'RARE'],
    antonyms: ['ORDINARY', 'COMMON', 'AVERAGE', 'CONVENTIONAL', 'TYPICAL'],
    nearDistractors: ['ORDINARY', 'EXTRATERRITORIAL', 'EXTRAVAGANT', 'EXTRAVERSION'],
    category: 'quality',
    exampleSentence: 'Grandmaster players display extraordinary focus and precision.'
  },
  {
    word: 'CONTRADICTORY',
    length: 13,
    partOfSpeech: 'adjective',
    tier: 3,
    definition: 'Mutually opposed or inconsistent in statement or principle',
    synonyms: ['INCONSISTENT', 'CONFLICTING', 'OPPOSING', 'PARADOXICAL'],
    antonyms: ['CONSISTENT', 'HARMONIOUS', 'COMPATIBLE', 'CONCORDANT'],
    nearDistractors: ['CONTRIBUTORY', 'PREDICTABLE', 'CONTRACTED', 'DEDICATORY'],
    category: 'logic',
    exampleSentence: 'The witness provided contradictory statements during the audit.'
  },
  {
    word: 'INDISPENSABLE',
    length: 13,
    partOfSpeech: 'adjective',
    tier: 3,
    definition: 'Absolutely necessary; essential and incapable of being omitted',
    synonyms: ['ESSENTIAL', 'VITAL', 'CRUCIAL', 'IMPERATIVE', 'PIVOTAL'],
    antonyms: ['DISPENSABLE', 'SUPERFLUOUS', 'REDUNDANT', 'OPTIONAL'],
    nearDistractors: ['DISPENSABLE', 'INDEFENSIBLE', 'INADMISSIBLE', 'INCOMPRESSIBLE'],
    category: 'necessity',
    exampleSentence: 'A Prefix Trie is an indispensable data structure for O(L) Boggle lookup.'
  },
  {
    word: 'TRANSFORMATION',
    length: 14,
    partOfSpeech: 'noun',
    tier: 3,
    definition: 'A marked change in form, nature, character, or function',
    synonyms: ['CONVERSION', 'METAMORPHOSIS', 'RESTRUCTURING', 'MUTATION'],
    antonyms: ['STAGNATION', 'PRESERVATION', 'PERSISTENCE'],
    nearDistractors: ['TRANSACTION', 'TRANSPORTATION', 'TRANSLATION', 'TRANSCRIPTION'],
    category: 'evolution',
    exampleSentence: 'The platform overhaul represented a complete digital transformation.'
  },
  {
    word: 'UNPRECEDENTED',
    length: 13,
    partOfSpeech: 'adjective',
    tier: 3,
    definition: 'Never done or known before; without previous example or parallel',
    synonyms: ['NOVEL', 'UNMATCHED', 'UNPARALLELED', 'GROUNDBREAKING', 'PIONEERING'],
    antonyms: ['PRECEDENTED', 'FAMILIAR', 'STANDARD', 'TRADITIONAL'],
    nearDistractors: ['UNPRETENTIOUS', 'UNPREDICTED', 'UNPREPARED', 'UNPROSECUTED'],
    category: 'novelty',
    exampleSentence: 'The dataset achieved an unprecedented accuracy rating of 99.8%.'
  },

  // =========================================================================
  // TIER 4/5: 15+ Letters (Advanced Multi-Property & High-Difficulty)
  // =========================================================================
  {
    word: 'UNCHARACTERISTIC',
    length: 16,
    partOfSpeech: 'adjective',
    tier: 4,
    definition: 'Not typical of a particular person, thing, or standard behavior',
    synonyms: ['ATYPICAL', 'ABNORMAL', 'UNUSUAL', 'ANOMALOUS', 'UNCONVENTIONAL'],
    antonyms: ['CHARACTERISTIC', 'TYPICAL', 'NORMAL', 'REPRESENTATIVE'],
    nearDistractors: ['CHARACTERISTIC', 'UNCHARITABLE', 'UNCOMPROMISING', 'UNCOMFORTABLE'],
    category: 'character',
    exampleSentence: 'The calculation error was completely uncharacteristic of his high mastery.'
  },
  {
    word: 'INCOMPREHENSIBLE',
    length: 16,
    partOfSpeech: 'adjective',
    tier: 4,
    definition: 'Not able to be understood or mentally grasped; baffling',
    synonyms: ['UNFATHOMABLE', 'ENIGMATIC', 'OBSCURE', 'BAFFLING', 'OPAQUE'],
    antonyms: ['COMPREHENSIBLE', 'INTELLIGIBLE', 'CLEAR', 'TRANSPARENT'],
    nearDistractors: ['COMPREHENSIBLE', 'INCOMPATIBLE', 'INCOMPETENT', 'INCOMPLETE'],
    category: 'clarity',
    exampleSentence: 'Without structured constraints, chaotic puzzles become incomprehensible.'
  },
  {
    word: 'INTERCHANGEABLE',
    length: 15,
    partOfSpeech: 'adjective',
    tier: 4,
    definition: 'Apparently identical or capable of being exchanged without difference',
    synonyms: ['EQUIVALENT', 'SYNONYMOUS', 'COMMUTATIVE', 'CONVERTIBLE'],
    antonyms: ['DISTINCT', 'UNIQUE', 'DIFFERENT', 'NONINTERCHANGEABLE'],
    nearDistractors: ['INTERCHANGE', 'INTERCONNECTED', 'INTERMEDIARY', 'INTERRUPTIBLE'],
    category: 'equivalence',
    exampleSentence: 'Standardized modules are fully interchangeable across all game engines.'
  },
  {
    word: 'MISINTERPRETATION',
    length: 17,
    partOfSpeech: 'noun',
    tier: 5,
    definition: 'The action of understanding or explaining something incorrectly',
    synonyms: ['MISUNDERSTANDING', 'MISCONCEPTION', 'FALLACY', 'ERROR'],
    antonyms: ['CLARITY', 'COMPREHENSION', 'ACCURACY', 'UNDERSTANDING'],
    nearDistractors: ['INTERPRETATION', 'MISREPRESENTATION', 'MISINFORMATION', 'INTERVENTION'],
    category: 'cognition',
    exampleSentence: 'Clear prompt formulations prevent misinterpretation under time pressure.'
  },
  {
    word: 'COUNTERPRODUCTIVE',
    length: 17,
    partOfSpeech: 'adjective',
    tier: 5,
    definition: 'Having the opposite of the desired effect; defeating the primary purpose',
    synonyms: ['HARMFUL', 'DETRIMENTAL', 'DISADVANTAGEOUS', 'INEFFECTIVE'],
    antonyms: ['PRODUCTIVE', 'CONSTRUCTIVE', 'BENEFICIAL', 'FRUITFUL'],
    nearDistractors: ['PRODUCTIVE', 'UNPRODUCTIVE', 'REPRODUCTIVE', 'COUNTERBALANCED'],
    category: 'efficacy',
    exampleSentence: 'Excessive visual clutter is counterproductive to rapid word recognition.'
  },
  {
    word: 'DISPROPORTIONATE',
    length: 16,
    partOfSpeech: 'adjective',
    tier: 5,
    definition: 'Too large or too small in comparison with something else; out of balance',
    synonyms: ['ASYMMETRIC', 'UNBALANCED', 'UNEQUAL', 'INORDINATE', 'EXCESSIVE'],
    antonyms: ['PROPORTIONATE', 'BALANCED', 'COMMENSURATE', 'EQUAL'],
    nearDistractors: ['PROPORTIONATE', 'DISPASSIONATE', 'DISAPPROBATION', 'DISPROPORTION'],
    category: 'proportion',
    exampleSentence: 'A disproportionate penalty for single typos undermines user engagement.'
  }
];
