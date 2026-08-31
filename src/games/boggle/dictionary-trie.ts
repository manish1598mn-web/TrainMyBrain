/**
 * Boggle Trie Dictionary & High-Speed Prefix Index
 */

export class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
  word?: string;
}

export class BoggleTrie {
  root: TrieNode = new TrieNode();
  size: number = 0;

  insert(word: string): void {
    const cleanWord = word.toUpperCase().trim();
    if (cleanWord.length < 3) return;

    let curr = this.root;
    for (let i = 0; i < cleanWord.length; i++) {
      const char = cleanWord[i];
      let next = curr.children.get(char);
      if (!next) {
        next = new TrieNode();
        curr.children.set(char, next);
      }
      curr = next;
    }
    if (!curr.isEndOfWord) {
      curr.isEndOfWord = true;
      curr.word = cleanWord;
      this.size++;
    }
  }

  isWord(word: string): boolean {
    const cleanWord = word.toUpperCase().trim();
    let curr = this.root;
    for (let i = 0; i < cleanWord.length; i++) {
      const char = cleanWord[i];
      const next = curr.children.get(char);
      if (!next) return false;
      curr = next;
    }
    return curr.isEndOfWord;
  }

  hasPrefix(prefix: string): boolean {
    const cleanPrefix = prefix.toUpperCase().trim();
    let curr = this.root;
    for (let i = 0; i < cleanPrefix.length; i++) {
      const char = cleanPrefix[i];
      const next = curr.children.get(char);
      if (!next) return false;
      curr = next;
    }
    return true;
  }
}

/**
 * Curated High-Frequency English & Banking Vocabulary for Boggle (3-8 letters)
 */
export const BOGGLE_WORD_LIST: string[] = [
  // 3-Letter Words
  'ACT', 'AGE', 'AIR', 'ALL', 'AND', 'ANT', 'ANY', 'APE', 'APT', 'ARC', 'ARE', 'ARM', 'ART', 'ASH', 'ASK', 'AWE',
  'BAD', 'BAG', 'BAN', 'BAR', 'BAT', 'BAY', 'BED', 'BEE', 'BEG', 'BET', 'BID', 'BIG', 'BIN', 'BIT', 'BOY', 'BUS', 'BUT', 'BUY',
  'CAN', 'CAP', 'CAR', 'CAT', 'COW', 'CRY', 'CUP', 'CUT',
  'DAY', 'DIE', 'DIG', 'DOG', 'DOT', 'DRY', 'DUE',
  'EAR', 'EAT', 'EGG', 'EGO', 'END', 'ERA', 'EVE', 'EYE',
  'FAN', 'FAR', 'FAT', 'FEE', 'FEW', 'FIT', 'FLY', 'FOG', 'FOR', 'FOX', 'FUN', 'FUR',
  'GAP', 'GAS', 'GEL', 'GET', 'GOD', 'GUN', 'GUT', 'GUY',
  'HAT', 'HEN', 'HER', 'HEY', 'HID', 'HIM', 'HIT', 'HOT', 'HOW', 'HUT',
  'ICE', 'ILL', 'INK', 'INN', 'ION',
  'JAR', 'JAW', 'JET', 'JOB', 'JOY',
  'KEY', 'KID', 'KIT',
  'LAB', 'LAP', 'LAW', 'LAY', 'LED', 'LEG', 'LET', 'LID', 'LIE', 'LIP', 'LOG', 'LOT', 'LOW',
  'MAD', 'MAN', 'MAP', 'MAT', 'MAY', 'MEN', 'MET', 'MIX', 'MOM', 'MUD', 'MUG',
  'NET', 'NEW', 'NOD', 'NOT', 'NOW', 'NUT',
  'OAK', 'OAR', 'ODD', 'OFF', 'OIL', 'OLD', 'ONE', 'OUR', 'OUT', 'OWL',
  'PAD', 'PAN', 'PAY', 'PEA', 'PEN', 'PET', 'PIG', 'PIN', 'PIT', 'POT',
  'RAG', 'RAM', 'RAN', 'RAP', 'RAT', 'RAW', 'RAY', 'RED', 'RIB', 'RID', 'RIM', 'RIP', 'ROD', 'ROW', 'RUB', 'RUG', 'RUN',
  'SAD', 'SAG', 'SAT', 'SAW', 'SAY', 'SEA', 'SEE', 'SET', 'SEW', 'SHE', 'SHY', 'SIN', 'SIP', 'SIR', 'SIT', 'SIX', 'SKI', 'SKY', 'SON', 'SOY', 'SPY', 'SUM', 'SUN',
  'TAB', 'TAG', 'TAN', 'TAP', 'TAR', 'TAX', 'TEA', 'TEN', 'THE', 'TIE', 'TIN', 'TIP', 'TOE', 'TOP', 'TOY', 'TRY', 'TUB', 'TWO',
  'URN', 'USE',
  'VAN', 'VAT', 'VET', 'VIA',
  'WAR', 'WAY', 'WEB', 'WET', 'WHO', 'WHY', 'WIN', 'WON',
  'YES', 'YET', 'YOU',
  'ZIP', 'ZOO',

  // 4-Letter Words
  'ABLE', 'ACHE', 'ACID', 'AGED', 'AIDE', 'ALLY', 'ALSO', 'AMID', 'ARCH', 'AREA', 'ARMY', 'ATOM', 'AUNT', 'AUTO',
  'BABY', 'BACK', 'BAIL', 'BAKE', 'BALD', 'BALL', 'BAND', 'BANK', 'BARE', 'BARK', 'BARN', 'BASE', 'BATH', 'BEAM', 'BEAN', 'BEAR', 'BEAT', 'BEER', 'BELL', 'BELT', 'BEND', 'BENT', 'BEST', 'BETA', 'BIKE', 'BILL', 'BIND', 'BIRD', 'BITE', 'BLOW', 'BLUE', 'BOAT', 'BODY', 'BOIL', 'BOLD', 'BOLT', 'BOMB', 'BOND', 'BONE', 'BOOK', 'BOOM', 'BOOT', 'BORE', 'BORN', 'BOSS', 'BOTH', 'BOWL', 'BULK', 'BULL', 'BURN', 'BURY', 'BUSH', 'BUSY',
  'CAFE', 'CAGE', 'CAKE', 'CALL', 'CALM', 'CAMP', 'CANE', 'CAPE', 'CARD', 'CARE', 'CASH', 'CAST', 'CAVE', 'CELL', 'CHAT', 'CHEF', 'CHIN', 'CHIP', 'CITY', 'CLAP', 'CLAY', 'CLIP', 'CLUB', 'COAL', 'COAT', 'CODE', 'COIN', 'COLD', 'COME', 'COOK', 'COOL', 'COPE', 'COPY', 'CORE', 'CORN', 'COST', 'CRAB', 'CRAM', 'CREW', 'CROP', 'CROW', 'CURE',
  'DARE', 'DARK', 'DART', 'DASH', 'DATA', 'DATE', 'DAWN', 'DEAD', 'DEAF', 'DEAL', 'DEAN', 'DEAR', 'DEBT', 'DECK', 'DEED', 'DEEP', 'DEER', 'DEMO', 'DENT', 'DENY', 'DESK', 'DIAL', 'DIET', 'DIRT', 'DISK', 'DIVE', 'DOCK', 'DOLL', 'DOME', 'DOOR', 'DOSE', 'DOWN', 'DRAG', 'DRAW', 'DREW', 'DROP', 'DRUG', 'DRUM', 'DUAL', 'DUCK', 'DUST', 'DUTY',
  'EACH', 'EARL', 'EARN', 'EASE', 'EAST', 'EASY', 'EDGE', 'EDIT', 'EMIT', 'EPIC', 'EVEN', 'EVER', 'EVIL', 'EXAM', 'EXIT',
  'FACE', 'FACT', 'FADE', 'FAIL', 'FAIR', 'FALL', 'FAME', 'FARM', 'FAST', 'FATE', 'FEAR', 'FEAT', 'FEED', 'FEEL', 'FEET', 'FELL', 'FELT', 'FILE', 'FILL', 'FILM', 'FIND', 'FINE', 'FIRE', 'FIRM', 'FISH', 'FIST', 'FLAG', 'FLAT', 'FLED', 'FLEW', 'FLIP', 'FLOW', 'FOAM', 'FOIL', 'FOLD', 'FOLK', 'FOND', 'FONT', 'FOOD', 'FOOL', 'FOOT', 'FORK', 'FORM', 'FORT', 'FOUR', 'FREE', 'FROG', 'FROM', 'FUEL', 'FULL', 'FUND', 'FUSE',
  'GAIN', 'GAME', 'GANG', 'GATE', 'GEAR', 'GENE', 'GIFT', 'GIRL', 'GIVE', 'GLAD', 'GLOW', 'GOAL', 'GOAT', 'GOLD', 'GOLF', 'GONE', 'GOOD', 'GRAB', 'GRID', 'GRIN', 'GRIP', 'GROW', 'GULF',
  'HAIL', 'HAIR', 'HALF', 'HALL', 'HALT', 'HAND', 'HANG', 'HARD', 'HARM', 'HATE', 'HAVE', 'HAWK', 'HEAD', 'HEAL', 'HEAR', 'HEAT', 'HELD', 'HELL', 'HELP', 'HERD', 'HERO', 'HIDE', 'HIGH', 'HIKE', 'HILL', 'HINT', 'HIRE', 'HOLD', 'HOLE', 'HOME', 'HOOD', 'HOOK', 'HOPE', 'HORN', 'HOST', 'HOUR', 'HUGE', 'HUNT', 'HURT',
  'ICON', 'IDEA', 'IDLE', 'INCH', 'INFO', 'INTO', 'IRON', 'ITEM',
  'JAIL', 'JOIN', 'JOKE', 'JUMP', 'JURY', 'JUST',
  'KEEN', 'KEEP', 'KEPT', 'KICK', 'KILL', 'KIND', 'KING', 'KISS', 'KITE', 'KNEE', 'KNEW', 'KNIT', 'KNOT', 'KNOW',
  'LACK', 'LADY', 'LAID', 'LAKE', 'LAMP', 'LAND', 'LANE', 'LAST', 'LATE', 'LEAD', 'LEAF', 'LEAK', 'LEAN', 'LEAP', 'LEFT', 'LEND', 'LESS', 'LIFE', 'LIFT', 'LIKE', 'LIMB', 'LIME', 'LINE', 'LINK', 'LION', 'LIST', 'LIVE', 'LOAD', 'LOAN', 'LOCK', 'LOGO', 'LONG', 'LOOK', 'LORD', 'LOSE', 'LOSS', 'LOST', 'LOUD', 'LOVE', 'LUCK', 'LUNG',
  'MADE', 'MAIL', 'MAIN', 'MAKE', 'MALL', 'MANY', 'MARK', 'MASK', 'MASS', 'MATE', 'MATH', 'MEAL', 'MEAN', 'MEAT', 'MEET', 'MELT', 'MEMO', 'MEND', 'MENU', 'MILD', 'MILE', 'MILK', 'MILL', 'MIND', 'MINE', 'MINT', 'MISS', 'MIST', 'MODE', 'MOOD', 'MOON', 'MORE', 'MOST', 'MOVE', 'MUCH', 'MUST', 'MUTE',
  'NAIL', 'NAME', 'NAVY', 'NEAR', 'NEAT', 'NECK', 'NEED', 'NEST', 'NEWS', 'NEXT', 'NICE', 'NINE', 'NODE', 'NONE', 'NOON', 'NOSE', 'NOTE',
  'OATH', 'OBEY', 'ODDS', 'ONCE', 'ONLY', 'ONTO', 'OPEN', 'ORAL', 'OVER',
  'PACE', 'PACK', 'PAGE', 'PAID', 'PAIN', 'PAIR', 'PALE', 'PALM', 'PARK', 'PART', 'PASS', 'PAST', 'PATH', 'PEAK', 'PEER', 'PEST', 'PICK', 'PILE', 'PILL', 'PINE', 'PINK', 'PIPE', 'PLAN', 'PLAY', 'PLEA', 'PLOT', 'PLUG', 'PLUS', 'POEM', 'POET', 'POLE', 'POLL', 'POOL', 'POOR', 'POPE', 'PORK', 'PORT', 'POST', 'POUR', 'PRAY', 'PULL', 'PUMP', 'PURE', 'PUSH',
  'RACE', 'RAID', 'RAIL', 'RAIN', 'RANK', 'RARE', 'RATE', 'READ', 'REAL', 'REAP', 'REAR', 'REED', 'RELY', 'RENT', 'REST', 'RICE', 'RICH', 'RIDE', 'RING', 'RIOT', 'RIPE', 'RISE', 'RISK', 'ROAD', 'ROAR', 'ROCK', 'ROLE', 'ROLL', 'ROOF', 'ROOM', 'ROOT', 'ROPE', 'ROSE', 'RUIN', 'RULE', 'RUSH', 'RUST',
  'SAFE', 'SAID', 'SAIL', 'SALE', 'SALT', 'SAME', 'SAND', 'SAVE', 'SCAN', 'SEAL', 'SEAM', 'SEAT', 'SEED', 'SEEK', 'SEEM', 'SEEN', 'SELF', 'SELL', 'SEND', 'SENT', 'SHIP', 'SHOE', 'SHOP', 'SHOT', 'SHOW', 'SHUT', 'SICK', 'SIDE', 'SIGH', 'SIGN', 'SILK', 'SITE', 'SIZE', 'SKIN', 'SLAP', 'SLID', 'SLIM', 'SLIP', 'SLOT', 'SLOW', 'SNAP', 'SNOW', 'SOAP', 'SOIL', 'SOLD', 'SOLE', 'SOME', 'SONG', 'SOON', 'SORE', 'SOUL', 'SOUP', 'SOUR', 'SPAM', 'SPAN', 'SPIN', 'SPOT', 'STAR', 'STAY', 'STEM', 'STEP', 'STOP', 'SUCH', 'SUIT', 'SURE', 'SWAP', 'SWIM',
  'TAIL', 'TAKE', 'TALE', 'TALK', 'TALL', 'TANK', 'TAPE', 'TASK', 'TEAM', 'TEAR', 'TELL', 'TEND', 'TERM', 'TEST', 'TEXT', 'THAT', 'THEM', 'THEN', 'THEY', 'THIN', 'THIS', 'THOU', 'THUS', 'TIDE', 'TIDY', 'TIED', 'TIER', 'TILE', 'TILL', 'TIME', 'TINY', 'TOLL', 'TONE', 'TOOK', 'TOOL', 'TOPS', 'TORE', 'TORN', 'TOUR', 'TOWN', 'TRAP', 'TRAY', 'TREE', 'TRIP', 'TRUE', 'TUBE', 'TUNE', 'TURN', 'TWIN', 'TYPE',
  'UNIT', 'UPON', 'URGE', 'USER',
  'VAIN', 'VARY', 'VAST', 'VEIL', 'VEIN', 'VENT', 'VERB', 'VERY', 'VEST', 'VETO', 'VIEW', 'VINE', 'VOID', 'VOLT', 'VOTE',
  'WAGE', 'WAIT', 'WAKE', 'WALK', 'WALL', 'WANT', 'WARD', 'WARM', 'WARN', 'WASH', 'WAVE', 'WEAK', 'WEAR', 'WEED', 'WEEK', 'WELL', 'WENT', 'WERE', 'WEST', 'WHAT', 'WHEN', 'WHOM', 'WIDE', 'WIFE', 'WILD', 'WILL', 'WIND', 'WINE', 'WING', 'WIPE', 'WIRE', 'WISE', 'WISH', 'WITH', 'WOKE', 'WOLF', 'WOOD', 'WOOL', 'WORD', 'WORE', 'WORK', 'WORM', 'WORN', 'WRAP',
  'YARD', 'YEAR', 'YOGA', 'YOUR',
  'ZERO', 'ZONE',

  // 5-Letter Words
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADAPT', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN', 'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE', 'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGEL', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE', 'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARRAY', 'ARROW', 'ASIDE', 'ASSET', 'AUDIO', 'AUDIT', 'AVOID', 'AWARD', 'AWARE',
  'BADGE', 'BAKER', 'BASIC', 'BASIN', 'BASIS', 'BEACH', 'BEGAN', 'BEGIN', 'BEING', 'BELOW', 'BENCH', 'BIRTH', 'BLACK', 'BLAME', 'BLANK', 'BLAST', 'BLEED', 'BLEND', 'BLESS', 'BLIND', 'BLOCK', 'BLOOD', 'BOARD', 'BOAST', 'BONUS', 'BOOST', 'BOUND', 'BRAIN', 'BRAND', 'BREAD', 'BREAK', 'BREED', 'BRIEF', 'BRING', 'BROAD', 'BROWN', 'BUILD', 'BUILT', 'BUNCH', 'BUYER',
  'CABLE', 'CABIN', 'CANDY', 'CARGO', 'CARRY', 'CAUSE', 'CHAIN', 'CHAIR', 'CHART', 'CHASE', 'CHEAP', 'CHECK', 'CHEST', 'CHIEF', 'CHILD', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR', 'CLERK', 'CLICK', 'CLIFF', 'CLIMB', 'CLOCK', 'CLOSE', 'CLOTH', 'CLOUD', 'COACH', 'COAST', 'COLOR', 'COUNT', 'COURT', 'COVER', 'CRAFT', 'CRANE', 'CRASH', 'CRAWL', 'CRAZY', 'CREAM', 'CREEK', 'CRIME', 'CRISIS', 'CROSS', 'CROWD', 'CROWN', 'CRUDE', 'CRUSH', 'CYCLE',
  'DAILY', 'DANCE', 'DEATH', 'DEBIT', 'DECAY', 'DELAY', 'DELTA', 'DENSE', 'DEPTH', 'DEVIL', 'DIARY', 'DIGIT', 'DIRTY', 'DISCO', 'DITCH', 'DIVER', 'DODGE', 'DOUBT', 'DRAFT', 'DRAIN', 'DRAKE', 'DRAMA', 'DRANK', 'DRAWN', 'DREAM', 'DRESS', 'DRIFT', 'DRILL', 'DRINK', 'DRIVE', 'DROVE', 'DYING',
  'EAGER', 'EARLY', 'EARTH', 'EIGHT', 'ELDER', 'ELECT', 'ELITE', 'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'EQUIP', 'ERROR', 'ESSAY', 'EVENT', 'EVERY', 'EXACT', 'EXIST', 'EXTRA',
  'FAINT', 'FAITH', 'FALSE', 'FAULT', 'FAVOR', 'FEAST', 'FIBER', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT', 'FINAL', 'FIRST', 'FIXED', 'FLAME', 'FLASH', 'FLEET', 'FLESH', 'FLOAT', 'FLOCK', 'FLOOD', 'FLOOR', 'FLOUR', 'FLOWN', 'FLUID', 'FLUSH', 'FOCUS', 'FORCE', 'FORGE', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRAUD', 'FRESH', 'FRONT', 'FROST', 'FRUIT',
  'GAUGE', 'GIANT', 'GIVEN', 'GLASS', 'GLOVE', 'GRACE', 'GRADE', 'GRAIN', 'GRAND', 'GRANT', 'GRAPE', 'GRAPH', 'GRASP', 'GRASS', 'GRAVE', 'GREAT', 'GREEK', 'GREEN', 'GREET', 'GRIEF', 'GRILL', 'GRIND', 'GROSS', 'GROUP', 'GROVE', 'GROWN', 'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'GUILT',
  'HABIT', 'HANDY', 'HAPPY', 'HARSH', 'HASTE', 'HAVEN', 'HEART', 'HEAVY', 'HEDGE', 'HELLO', 'HENCE', 'HONEY', 'HONOR', 'HORSE', 'HOTEL', 'HOUSE', 'HUMAN', 'HUMOR', 'HURRY',
  'IDEAL', 'IMAGE', 'INDEX', 'INNER', 'INPUT', 'ISSUE',
  'JELLY', 'JEWEL', 'JOINT', 'JUDGE', 'JUICE',
  'KNIFE', 'KNOCK', 'KNOWN',
  'LABEL', 'LABOR', 'LARGE', 'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN', 'LEASE', 'LEAST', 'LEAVE', 'LEGAL', 'LEMON', 'LEVEL', 'LEVER', 'LIGHT', 'LIMIT', 'LINEN', 'LINKS', 'LITER', 'LIVER', 'LOCAL', 'LODGE', 'LOGIC', 'LOOSE', 'LOVER', 'LOWER', 'LOYAL', 'LUCKY', 'LUNCH',
  'MAGIC', 'MAJOR', 'MAKER', 'MANGO', 'MARCH', 'MATCH', 'MAYOR', 'MEDIA', 'MERIT', 'METAL', 'METER', 'MIDST', 'MIGHT', 'MINER', 'MINOR', 'MINUS', 'MIXED', 'MODEL', 'MODEM', 'MONEY', 'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVIE', 'MUSIC',
  'NAIVE', 'NERVE', 'NIGHT', 'NOBLE', 'NOISE', 'NORTH', 'NOTED', 'NOVEL', 'NURSE',
  'OCCUR', 'OCEAN', 'OFFER', 'OFTEN', 'ONION', 'ONSET', 'OPERA', 'ORBIT', 'ORDER', 'ORGAN', 'OTHER', 'OUGHT', 'OUTER', 'OWNER',
  'PANEL', 'PANIC', 'PAPER', 'PARTY', 'PASTA', 'PATCH', 'PAUSE', 'PEACE', 'PEARL', 'PENNY', 'PHASE', 'PHONE', 'PHOTO', 'PIANO', 'PIECE', 'PILOT', 'PINCH', 'PITCH', 'PIVOT', 'PIZZA', 'PLACE', 'PLAIN', 'PLANE', 'PLANT', 'PLATE', 'PLAZA', 'PLEAD', 'PLUCK', 'POINT', 'POLAR', 'POUND', 'POWER', 'PRESS', 'PRICE', 'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRIZE', 'PROBE', 'PRONE', 'PROOF', 'PROSE', 'PROUD', 'PROVE', 'PULSE', 'PUPIL', 'PURSE',
  'QUEEN', 'QUERY', 'QUEST', 'QUICK', 'QUIET', 'QUITE', 'QUOTE',
  'RADAR', 'RADIO', 'RAISE', 'RALLY', 'RANCH', 'RANGE', 'RAPID', 'RATIO', 'REACH', 'REACT', 'READY', 'REALM', 'REBEL', 'REFER', 'REIGN', 'RELAX', 'RELAY', 'RELIC', 'RENEW', 'REPAY', 'REPLY', 'RESET', 'RIDER', 'RIDGE', 'RIGHT', 'RIGID', 'RISKY', 'RIVAL', 'RIVER', 'ROBOT', 'ROCKY', 'ROGUE', 'ROUGH', 'ROUND', 'ROUTE', 'ROYAL', 'RULER', 'RURAL',
  'SADLY', 'SAINT', 'SALAD', 'SALES', 'SALON', 'SAUCE', 'SCALE', 'SCARE', 'SCARF', 'SCENE', 'SCENT', 'SCOPE', 'SCORE', 'SCOUT', 'SCRAP', 'SCREW', 'SEIZE', 'SENSE', 'SERVE', 'SEVEN', 'SHADE', 'SHAFT', 'SHAKE', 'SHALL', 'SHAME', 'SHAPE', 'SHARE', 'SHARK', 'SHARP', 'SHEEP', 'SHEER', 'SHEET', 'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHIRT', 'SHOCK', 'SHOOT', 'SHORE', 'SHORT', 'SHOWN', 'SIGHT', 'SKILL', 'SKIRT', 'SKULL', 'SLAVE', 'SLEEP', 'SLICE', 'SLIDE', 'SLOPE', 'SMART', 'SMELL', 'SMILE', 'SMOKE', 'SNAKE', 'SOLAR', 'SOLID', 'SOLVE', 'SORRY', 'SOUND', 'SOUTH', 'SPACE', 'SPARE', 'SPARK', 'SPEAK', 'SPEED', 'SPELL', 'SPEND', 'SPICE', 'SPIKE', 'SPINE', 'SPITE', 'SPLIT', 'SPOIL', 'SPOKE', 'SPORT', 'STAFF', 'STAGE', 'STAIN', 'STAIR', 'STAKE', 'STALE', 'STAMP', 'STAND', 'STARE', 'START', 'STATE', 'STEAM', 'STEEL', 'STEEP', 'STEER', 'STICK', 'STIFF', 'STILL', 'STOCK', 'STONE', 'STOOD', 'STOOL', 'STORM', 'STORY', 'STRAP', 'STRAW', 'STRIP', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUPER', 'SURGE', 'SWEAR', 'SWEAT', 'SWEEP', 'SWEET', 'SWELL', 'SWIFT', 'SWORD',
  'TABLE', 'TASTE', 'TEACH', 'TEETH', 'TEMPO', 'TENSE', 'TENTH', 'THANK', 'THEFT', 'THEME', 'THICK', 'THIEF', 'THIGH', 'THING', 'THINK', 'THIRD', 'THORN', 'THOSE', 'THREE', 'THREW', 'THROW', 'THUMB', 'TIGER', 'TIGHT', 'TIMER', 'TIRED', 'TITLE', 'TODAY', 'TOKEN', 'TOOTH', 'TOPIC', 'TORCH', 'TOTAL', 'TOUCH', 'TOUGH', 'TOWEL', 'TOWER', 'TOXIC', 'TRACE', 'TRACK', 'TRACT', 'TRADE', 'TRAIL', 'TRAIN', 'TRAIT', 'TRANS', 'TRASH', 'TREAT', 'TREND', 'TRIAL', 'TRIBE', 'TRICK', 'TRIED', 'TROOP', 'TRUCK', 'TRULY', 'TRUNK', 'TRUST', 'TRUTH', 'TWICE', 'TWIST',
  'UNCLE', 'UNDER', 'UNION', 'UNITE', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USAGE', 'USUAL', 'UTTER',
  'VAGUE', 'VALID', 'VALUE', 'VALVE', 'VAPOR', 'VAULT', 'VENUE', 'VERGE', 'VIDEO', 'VIRAL', 'VIRUS', 'VISIT', 'VITAL', 'VIVID', 'VOCAL', 'VOICE', 'VOTER',
  'WAGON', 'WAIST', 'WASTE', 'WATCH', 'WATER', 'WEARY', 'WEAVE', 'WEDGE', 'WEIGH', 'WHALE', 'WHEAT', 'WHEEL', 'WHERE', 'WHICH', 'WHILE', 'WHITE', 'WHOLE', 'WHOSE', 'WIDOW', 'WIDTH', 'WINDY', 'WOMAN', 'WOMEN', 'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH', 'WOUND', 'WRIST', 'WRITE', 'WRONG', 'WROTE',
  'YACHT', 'YIELD', 'YOUNG', 'YOUTH',

  // 6+ Letter High-Yield Words
  'ACCOUNT', 'BALANCE', 'CAPITAL', 'DEPOSIT', 'FINANCE', 'INTEREST', 'INVEST', 'MARKET', 'PROFIT', 'REVENUE', 'SAVINGS', 'TRADING',
  'ACCURATE', 'BENEFIT', 'CREATIVE', 'DECISION', 'DISCOVER', 'ECONOMY', 'FORECAST', 'HORIZON', 'INSIGHT', 'JUSTICE', 'KNOWLEDGE',
  'LOGICAL', 'MASTERY', 'NETWORK', 'OPINION', 'PARTNER', 'QUALITY', 'RELIABLE', 'STRATEGY', 'TRIUMPH', 'UNIVERSE', 'VENTURE'
];

// Initialize and populate singleton Trie
export const boggleTrie = new BoggleTrie();
for (const word of BOGGLE_WORD_LIST) {
  boggleTrie.insert(word);
}
