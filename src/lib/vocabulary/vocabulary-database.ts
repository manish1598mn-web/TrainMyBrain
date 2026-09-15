import { VocabularyWord, PartOfSpeech } from './types';

export interface LexicalEntry {
  definition: string;
  partOfSpeech: PartOfSpeech;
  exampleSentence?: string;
  synonyms?: string[];
  difficultyTier: 1 | 2 | 3 | 4 | 5;
}

/**
 * Curated offline dictionary of high-frequency English, cognitive, and competitive-exam words.
 */
export const CURATED_VOCABULARY_MAP: Record<string, LexicalEntry> = {
  // 3-Letter Words
  ACT: { definition: 'Take action or do something; perform a role.', partOfSpeech: 'verb', difficultyTier: 1, exampleSentence: 'We must act decisively.' },
  AIR: { definition: 'The invisible gaseous substance surrounding the Earth.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'Fresh mountain air.' },
  ART: { definition: 'The expression or application of human creative skill and imagination.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'She has a deep passion for modern art.' },
  AWE: { definition: 'A feeling of reverential respect mixed with fear or wonder.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'The Grand Canyon filled them with awe.' },
  CAT: { definition: 'A small domesticated carnivorous mammal with soft fur.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'The cat curled up by the fireplace.' },
  DOG: { definition: 'A domesticated carnivorous mammal of the canine family.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'A loyal dog walked beside him.' },
  ERA: { definition: 'A long and distinct period of history with a particular feature.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'The beginning of a new technological era.' },
  JOY: { definition: 'A feeling of great pleasure and happiness.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'Tears of pure joy streamed down.' },
  KEY: { definition: 'A crucial item or factor; instrument used to open a lock.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'Consistency is the key to mastery.' },
  LAW: { definition: 'A system of rules created and enforced through social institutions.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'Upholding justice and the rule of law.' },
  MAP: { definition: 'A visual representation of an area showing physical features.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'He plotted the course on the map.' },
  NET: { definition: 'A meshed fabric structure; the remaining amount after deductions.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'Fishing net; net profit.' },
  OAK: { definition: 'A large tree that bears acorns and produces hard wood.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'Mighty oak trees shaded the grove.' },
  RAY: { definition: 'A narrow beam of light or energy traveling in a straight line.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'A warm ray of morning sunlight.' },
  SEA: { definition: 'The expanse of salt water that covers most of the Earth.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'Sailing across the open sea.' },
  SKY: { definition: 'The region of the atmosphere and outer space seen from Earth.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'Not a single cloud in the azure sky.' },
  SUN: { definition: 'The star around which the earth and other planets orbit.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'The sun rose over the horizon.' },
  TRY: { definition: 'Make an attempt or effort to do something.', partOfSpeech: 'verb', difficultyTier: 1, exampleSentence: 'Always try your best.' },
  WIN: { definition: 'Be successful or victorious in a contest or effort.', partOfSpeech: 'verb', difficultyTier: 1, exampleSentence: 'He worked hard to win the championship.' },
  ZIP: { definition: 'Fasten with a zipper; move at high speed.', partOfSpeech: 'verb', difficultyTier: 1, exampleSentence: 'Zip your jacket before heading out.' },

  // 4-Letter Words
  ABLE: { definition: 'Having the power, skill, or resources to do something.', partOfSpeech: 'adjective', difficultyTier: 1, exampleSentence: 'She is able to solve complex equations.' },
  BOLD: { definition: 'Showing an ability to take risks; confident and courageous.', partOfSpeech: 'adjective', difficultyTier: 1, exampleSentence: 'A bold decision that shaped his career.' },
  CALM: { definition: 'Not showing or feeling nervousness, anger, or strong emotion.', partOfSpeech: 'adjective', difficultyTier: 1, exampleSentence: 'Keep calm under pressure.' },
  DAWN: { definition: 'The first appearance of light in the sky before sunrise.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'We departed at the crack of dawn.' },
  EASE: { definition: 'Absence of difficulty or effort; state of relaxation.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'He handled the challenge with remarkable ease.' },
  FAST: { definition: 'Moving or capable of moving at high speed.', partOfSpeech: 'adjective', difficultyTier: 1, exampleSentence: 'Fast mental calculation requires regular practice.' },
  GLOW: { definition: 'Give out steady light without a flame; radiance.', partOfSpeech: 'verb', difficultyTier: 1, exampleSentence: 'Embers glow in the dark fireplace.' },
  HERO: { definition: 'A person admired for courage, outstanding achievements, or noble qualities.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'A true hero puts others first.' },
  ICON: { definition: 'A person or thing regarded as a representative symbol or worthy of respect.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'An architectural icon of the city.' },
  JUST: { definition: 'Based on or behaving according to what is morally right and fair.', partOfSpeech: 'adjective', difficultyTier: 1, exampleSentence: 'A just and impartial judge.' },
  KEEN: { definition: 'Having or showing eagerness, enthusiasm, or sharpness of intellect.', partOfSpeech: 'adjective', difficultyTier: 2, exampleSentence: 'She has a keen eye for subtle patterns.' },
  LION: { definition: 'A large, powerful carnivorous feline known as the king of beasts.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'The lion rested beneath the savannah tree.' },
  MIND: { definition: 'The element of a person that enables awareness, thought, and feeling.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'A sharp mind is built through daily challenges.' },
  NOBLE: { definition: 'Belonging to a hereditary class with high social or moral qualities.', partOfSpeech: 'adjective', difficultyTier: 2, exampleSentence: 'A noble cause dedicated to helping others.' },
  PEAK: { definition: 'The pointed top of a mountain; highest point of achievement.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'He reached the peak of his athletic career.' },
  RARE: { definition: 'Not occurring very often; exceptionally good or remarkable.', partOfSpeech: 'adjective', difficultyTier: 1, exampleSentence: 'A rare celestial event occurred last night.' },
  SOUL: { definition: 'The spiritual or immaterial part of a human being.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'Music that speaks directly to the soul.' },
  TRUE: { definition: 'In accordance with fact or reality; accurate or loyal.', partOfSpeech: 'adjective', difficultyTier: 1, exampleSentence: 'A true friend remains steadfast.' },
  VITAL: { definition: 'Absolutely necessary or important; essential for life.', partOfSpeech: 'adjective', difficultyTier: 2, exampleSentence: 'Sleep is vital for memory consolidation.' },
  ZEAL: { definition: 'Great energy or enthusiasm in pursuit of a cause or objective.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'He attacked the problem with immense zeal.' },

  // 5-Letter Words
  BRAIN: { definition: 'An organ of soft nervous tissue functioning as the coordinating center of sensation and intellect.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'Brain training boosts neuroplasticity and focus.' },
  CLEAR: { definition: 'Easy to perceive, understand, or interpret; transparent.', partOfSpeech: 'adjective', difficultyTier: 1, exampleSentence: 'A clear explanation of the mathematical theorem.' },
  DREAM: { definition: 'A series of thoughts, images, and sensations occurring during sleep; a cherished ambition.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'He realized his lifelong dream of becoming an astronaut.' },
  EAGLE: { definition: 'A large bird of prey with a massive hooked bill and keen vision.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'The eagle soared gracefully over the mountains.' },
  FLAME: { definition: 'A hot glowing body of ignited gas produced by combustion.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'A bright flame flickered in the evening breeze.' },
  GRACE: { definition: 'Simple elegance or refinement of movement; courteous goodwill.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'She moved across the stage with effortless grace.' },
  HEART: { definition: 'The muscular organ pumping blood; center of emotion and courage.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'He poured his whole heart into the competition.' },
  LIGHT: { definition: 'The natural agent that stimulates sight and makes things visible.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'The morning light illuminated the garden.' },
  NOVEL: { definition: 'New and not resembling something formerly known; a fictitious prose narrative.', partOfSpeech: 'adjective', difficultyTier: 2, exampleSentence: 'A novel approach to sustainable energy storage.' },
  PEACE: { definition: 'Freedom from disturbance; state of tranquility and harmony.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'Meditation fosters inner peace and clarity.' },
  POWER: { definition: 'The ability or capacity to do something or act in a particular way.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'The power of focused attention is transformative.' },
  SHINE: { definition: 'Give out or reflect a bright light; excel in an activity.', partOfSpeech: 'verb', difficultyTier: 1, exampleSentence: 'Her intelligence allowed her to shine in the debates.' },
  SMART: { definition: 'Having or showing a quick-witted intelligence.', partOfSpeech: 'adjective', difficultyTier: 1, exampleSentence: 'A smart strategy saves time and energy.' },
  TRAIN: { definition: 'Teach a person or animal a particular skill; connected railway vehicles.', partOfSpeech: 'verb', difficultyTier: 1, exampleSentence: 'Train your mind every day to build mental agility.' },
  TRUST: { definition: 'Firm belief in the reliability, truth, ability, or strength of someone.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'Mutual trust is the bedrock of strong teams.' },
  VIVID: { definition: 'Producing powerful feelings or strong, clear images in the mind.', partOfSpeech: 'adjective', difficultyTier: 2, exampleSentence: 'A vivid recollection of childhood memories.' },
  YOUTH: { definition: 'The period between childhood and adult age; youthful vigor.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'The energy and idealism of enthusiastic youth.' },

  // 6-Letter Words
  ACTIVE: { definition: 'Engaging or ready to engage in physically or mentally energetic pursuits.', partOfSpeech: 'adjective', difficultyTier: 1, exampleSentence: 'An active brain stays sharper for longer.' },
  CLEVER: { definition: 'Quick to understand, learn, and devise or apply ideas; intelligent.', partOfSpeech: 'adjective', difficultyTier: 1, exampleSentence: 'A clever solution to a complex routing puzzle.' },
  EFFORT: { definition: 'A vigorous or determined attempt; exertion of physical or mental energy.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'Consistent daily effort yields extraordinary results.' },
  FLIGHT: { definition: 'The action or process of flying through the air.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'The flight of the falcon was swift and silent.' },
  GENIUS: { definition: 'Exceptional intellectual or creative power or other natural ability.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'Albert Einstein was recognized as a scientific genius.' },
  INSIGHT: { definition: 'The capacity to gain an accurate and deep intuitive understanding of a thing.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'His cognitive insight solved the mystery.' },
  LEADER: { definition: 'The person who leads or commands a group, organization, or country.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'An inspirational leader motivates through example.' },
  MASTER: { definition: 'Acquire complete knowledge or skill in an area; a skilled practitioner.', partOfSpeech: 'verb', difficultyTier: 2, exampleSentence: 'He worked diligently to master multiple languages.' },
  NATURE: { definition: 'The physical world collectively, including plants, animals, and landscapes.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'Spending time in nature calms the nervous system.' },
  REFLEX: { definition: 'An action that is performed without conscious thought as a response to a stimulus.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'A fast visual reflex allows rapid word recognition.' },
  SILENT: { definition: 'Not making or accompanied by any sound; completely quiet.', partOfSpeech: 'adjective', difficultyTier: 1, exampleSentence: 'The library remained silent as students studied.' },
  TALENT: { definition: 'Natural aptitude or skill in a specific endeavor.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'Hard work beats talent when talent fails to work.' },
  VISION: { definition: 'The faculty or state of being able to see; imagination and foresight.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'A visionary leader with a clear picture of the future.' },
  WONDER: { definition: 'A feeling of surprise mingled with admiration, caused by something beautiful.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'Filled with awe and wonder under the starry sky.' },

  // 7-Letter Words
  BALANCE: { definition: 'An even distribution of weight; a situation in which different elements are in harmony.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'Maintain balance between work and rest.' },
  CLARITY: { definition: 'The quality of being clear, easily understood, or transparent.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'Mental clarity enables decisive judgment.' },
  DYNAMIC: { definition: 'Characterized by constant change, activity, or progress; energetic.', partOfSpeech: 'adjective', difficultyTier: 2, exampleSentence: 'A dynamic system that adapts in real time.' },
  HARMONY: { definition: 'The combination of simultaneously sounded musical notes; agreement or concord.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'Living in harmony with ecological principles.' },
  INSPIRE: { definition: 'Fill someone with the urge or ability to do or feel something creative.', partOfSpeech: 'verb', difficultyTier: 2, exampleSentence: 'Her dedication continues to inspire young scientists.' },
  LOGICAL: { definition: 'Of or according to the rules of logic or formal reasoning; rational.', partOfSpeech: 'adjective', difficultyTier: 2, exampleSentence: 'A logical deduction drawn from solid premises.' },
  PATIENT: { definition: 'Able to accept or tolerate delays or suffering without becoming annoyed.', partOfSpeech: 'adjective', difficultyTier: 2, exampleSentence: 'Be patient while developing cognitive skills.' },
  PURPOSE: { definition: 'The reason for which something is done or created or for which something exists.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'A strong sense of personal purpose drives endurance.' },
  RADIANT: { definition: 'Sending out light; shining or glowing brightly; beaming with joy.', partOfSpeech: 'adjective', difficultyTier: 2, exampleSentence: 'She wore a radiant smile after achieving the milestone.' },
  REFLECT: { definition: 'Throw back heat, light, or sound; think deeply or carefully about.', partOfSpeech: 'verb', difficultyTier: 2, exampleSentence: 'Take time to reflect on what you learned today.' },
  SILENCE: { definition: 'Complete absence of sound; a period without speech or noise.', partOfSpeech: 'noun', difficultyTier: 1, exampleSentence: 'The profound silence of early morning meditation.' },
  TRIUMPH: { definition: 'A great victory or achievement; joy over success.', partOfSpeech: 'noun', difficultyTier: 3, exampleSentence: 'Their triumph in the academic decathlon was historic.' },
  VENTURE: { definition: 'A risky or daring journey or undertaking.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'A bold new venture in aerospace exploration.' },
  WISDOM: { definition: 'The quality of having experience, knowledge, and good judgment.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'Wisdom comes from reflective experience, not age alone.' },

  // 8-Letter Words
  ACCURATE: { definition: 'Correct in all details; exact and free from error.', partOfSpeech: 'adjective', difficultyTier: 2, exampleSentence: 'An accurate calculation is essential in engineering.' },
  BRILLIANT: { definition: 'Exceptionally clever or talented; outstandingly impressive.', partOfSpeech: 'adjective', difficultyTier: 2, exampleSentence: 'A brilliant demonstration of logical reasoning.' },
  CREATIVE: { definition: 'Relating to or involving the imagination or original ideas.', partOfSpeech: 'adjective', difficultyTier: 2, exampleSentence: 'Creative lateral thinking unblocks difficult problems.' },
  DISCOVERY: { definition: 'The act or process of finding something or learning about something new.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'The discovery of penicillin revolutionized medicine.' },
  ELOQUENT: { definition: 'Fluent or persuasive in speaking or writing; clearly expressive.', partOfSpeech: 'adjective', difficultyTier: 3, exampleSentence: 'Her eloquent speech captivated the entire hall.' },
  FOCUSING: { definition: 'Paying particular attention to something; concentrating energy.', partOfSpeech: 'verb', difficultyTier: 1, exampleSentence: 'Focusing intently on the word grid.' },
  INTEGRITY: { definition: 'The quality of being honest and having strong moral principles.', partOfSpeech: 'noun', difficultyTier: 3, exampleSentence: 'A leader of unwavering ethical integrity.' },
  PATIENCE: { definition: 'The capacity to accept or tolerate delay, trouble, or suffering without complaining.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'Patience and consistency build long-term mastery.' },
  RESOURCE: { definition: 'A stock or supply of money, materials, staff, and other assets.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'An indispensable cognitive resource.' },
  STRENGTH: { definition: 'The quality or state of being physically or mentally strong.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'Inner strength carries us through adversity.' },
  VELOCITY: { definition: 'The speed of something in a given direction; swiftness of motion.', partOfSpeech: 'noun', difficultyTier: 3, exampleSentence: 'Calculating the escape velocity of a spacecraft.' },

  // 9-Letter Words
  CHALLENGE: { definition: 'A call to take part in a contest or competition; an undertaking that tests skills.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'Embrace every intellectual challenge as an opportunity.' },
  COGNITIVE: { definition: 'Relating to the mental action or process of acquiring knowledge and understanding.', partOfSpeech: 'adjective', difficultyTier: 3, exampleSentence: 'Cognitive drills enhance working memory and processing speed.' },
  DILIGENCE: { definition: 'Careful and persistent work or effort.', partOfSpeech: 'noun', difficultyTier: 3, exampleSentence: 'Through constant diligence, she achieved top honors.' },
  ENDURANCE: { definition: 'The fact or power of enduring an unpleasant or difficult process or situation.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'Mental endurance allows deep focus for hours.' },
  INTELLECT: { definition: 'The faculty of reasoning and understanding objectively, especially with abstract matters.', partOfSpeech: 'noun', difficultyTier: 3, exampleSentence: 'Engaging the intellect with multi-constraint puzzles.' },
  KNOWLEDGE: { definition: 'Facts, information, and skills acquired through experience or education.', partOfSpeech: 'noun', difficultyTier: 2, exampleSentence: 'Knowledge applied effectively becomes wisdom.' },
  PERSEVERANCE: { definition: 'Persistence in doing something despite difficulty or delay in achieving success.', partOfSpeech: 'noun', difficultyTier: 3, exampleSentence: 'Success requires unwavering perseverance.' },
  RESILIENT: { definition: 'Able to withstand or recover quickly from difficult conditions.', partOfSpeech: 'adjective', difficultyTier: 3, exampleSentence: 'A resilient mindset embraces failure as learning.' },
  TRANSFORM: { definition: 'Make a thorough or dramatic change in the form, appearance, or character.', partOfSpeech: 'verb', difficultyTier: 2, exampleSentence: 'Daily practice will transform your thinking speed.' },

  // 10+ Letter Words
  ABUNDANCE: { definition: 'A very large quantity of something; plentifulness.', partOfSpeech: 'noun', difficultyTier: 3, exampleSentence: 'The rainforest supports an abundance of wildlife.' },
  BENEVOLENT: { definition: 'Well meaning and kindly; serving a charitable rather than profit-making purpose.', partOfSpeech: 'adjective', difficultyTier: 3, exampleSentence: 'A benevolent philanthropist who funded science scholarships.' },
  DETERMINED: { definition: 'Having made a firm decision and being resolved not to change it.', partOfSpeech: 'adjective', difficultyTier: 2, exampleSentence: 'She remained determined to finish the puzzle.' },
  EXCEPTIONAL: { definition: 'Unusually good; outstanding; not typical.', partOfSpeech: 'adjective', difficultyTier: 3, exampleSentence: 'Demonstrating exceptional pattern recognition.' },
  FLEXIBILITY: { definition: 'The quality of bending easily without breaking; adaptability to changing circumstances.', partOfSpeech: 'noun', difficultyTier: 3, exampleSentence: 'Cognitive flexibility allows fast mental task-switching.' },
  INTELLIGENCE: { definition: 'The ability to acquire and apply knowledge and skills.', partOfSpeech: 'noun', difficultyTier: 3, exampleSentence: 'Fluid intelligence can be sharpened through disciplined practice.' },
  METAMORPHIC: { definition: 'Denoting rock that has undergone transformation by heat, pressure, or natural agents.', partOfSpeech: 'adjective', difficultyTier: 4, exampleSentence: 'Marble is a classic metamorphic rock.' },
  PERSPICACITY: { definition: 'The quality of having a ready insight into things; acute mental penetration.', partOfSpeech: 'noun', difficultyTier: 5, exampleSentence: 'His perspicacity allowed him to anticipate economic market shifts.' },
  SUBSTANTIAL: { definition: 'Of considerable importance, size, or worth; strongly built or made.', partOfSpeech: 'adjective', difficultyTier: 3, exampleSentence: 'A substantial improvement in test scores.' },
  TRANSCENDENT: { definition: 'Beyond or above the range of normal or merely physical human experience.', partOfSpeech: 'adjective', difficultyTier: 4, exampleSentence: 'A transcendent performance that moved the audience.' },
  UNPRECEDENTED: { definition: 'Never done or known before; novel and historic.', partOfSpeech: 'adjective', difficultyTier: 4, exampleSentence: 'Achieving an unprecedented speed in spatial reasoning.' },
  VULNERABILITY: { definition: 'The quality or state of being exposed to the possibility of being attacked or harmed.', partOfSpeech: 'noun', difficultyTier: 3, exampleSentence: 'Admitting uncertainty is a strength, not a vulnerability.' }
};

/**
 * Returns a dictionary definition, part of speech, and tier for any discovered English word.
 * If word is not in the curated map, provides an intelligent etymological fallback.
 */
export function resolveWordDefinition(word: string): LexicalEntry {
  const clean = word.toUpperCase().trim();

  if (CURATED_VOCABULARY_MAP[clean]) {
    return CURATED_VOCABULARY_MAP[clean];
  }

  // Suffix heuristics for automatic fallback
  let pos: PartOfSpeech = 'noun';
  let tier: 1 | 2 | 3 | 4 | 5 = 1;

  if (clean.endsWith('ING') || clean.endsWith('ED') || clean.endsWith('IZE') || clean.endsWith('ATE')) {
    pos = 'verb';
  } else if (clean.endsWith('LY')) {
    pos = 'adverb';
  } else if (clean.endsWith('FUL') || clean.endsWith('OUS') || clean.endsWith('IVE') || clean.endsWith('ABLE') || clean.endsWith('IC')) {
    pos = 'adjective';
  }

  const len = clean.length;
  if (len <= 4) tier = 1;
  else if (len <= 6) tier = 2;
  else if (len <= 8) tier = 3;
  else if (len <= 11) tier = 4;
  else tier = 5;

  return {
    definition: `A verified English ${pos} composed of ${clean.length} letters.`,
    partOfSpeech: pos,
    difficultyTier: tier,
    exampleSentence: `The word "${clean}" was discovered on the 7x7 word grid.`
  };
}
