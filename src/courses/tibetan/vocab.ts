export type TibetanWord = {
  /** Stable key, also used as the audio filename: public/audio/tibetan/<id>.mp3 */
  id: string;
  tibetan: string;
  phonetic: string;
  english: string;
  /** Emoji shown on picture-choice exercises. */
  icon?: string;
};

export type TibetanSentence = {
  id: string;
  tibetan: string;
  phonetic: string;
  english: string;
  /** Word-bank tiles, in order, for "Write this in Tibetan". */
  tibetanTiles: string[];
  /** Word-bank tiles, in order, for "Write this in English". */
  englishTiles: string[];
};

export const words: TibetanWord[] = [
  // Greetings
  {
    id: "tashi-delek",
    tibetan: "བཀྲ་ཤིས་བདེ་ལེགས།",
    phonetic: "tashi delek",
    english: "hello",
    icon: "👋",
  },
  {
    id: "thukje-che",
    tibetan: "ཐུགས་རྗེ་ཆེ།",
    phonetic: "thukje che",
    english: "thank you",
    icon: "🙏",
  },
  {
    id: "kale-phe",
    tibetan: "ག་ལེ་ཕེབས།",
    phonetic: "kale phe",
    english: "goodbye (to someone leaving)",
    icon: "🚶",
  },
  {
    id: "kale-shu",
    tibetan: "ག་ལེ་བཞུགས།",
    phonetic: "kale shu",
    english: "goodbye (to someone staying)",
    icon: "🏠",
  },
  // Pronouns and basics
  { id: "nga", tibetan: "ང་", phonetic: "nga", english: "I" },
  { id: "khyerang", tibetan: "ཁྱེད་རང་", phonetic: "khyerang", english: "you" },
  { id: "yin", tibetan: "ཡིན།", phonetic: "yin", english: "am / is" },
  {
    id: "yakpo",
    tibetan: "ཡག་པོ་",
    phonetic: "yakpo",
    english: "good",
    icon: "👍",
  },
  {
    id: "bopa",
    tibetan: "བོད་པ་",
    phonetic: "böpa",
    english: "Tibetan (person)",
  },
  {
    id: "loptruk",
    tibetan: "སློབ་ཕྲུག་",
    phonetic: "lopthruk",
    english: "student",
    icon: "🧑‍🎓",
  },
  // Family
  {
    id: "ama",
    tibetan: "ཨ་མ་",
    phonetic: "ama",
    english: "mother",
    icon: "👩",
  },
  {
    id: "pala",
    tibetan: "པ་ལགས་",
    phonetic: "pala",
    english: "father",
    icon: "👨",
  },
  { id: "bu", tibetan: "བུ་", phonetic: "bu", english: "boy", icon: "👦" },
  {
    id: "bumo",
    tibetan: "བུ་མོ་",
    phonetic: "bumo",
    english: "girl",
    icon: "👧",
  },
  // Food and drink
  { id: "chu", tibetan: "ཆུ་", phonetic: "chu", english: "water", icon: "💧" },
  { id: "ja", tibetan: "ཇ་", phonetic: "ja", english: "tea", icon: "🍵" },
  { id: "sho", tibetan: "ཞོ་", phonetic: "sho", english: "yogurt", icon: "🥛" },
  {
    id: "khalak",
    tibetan: "ཁ་ལག་",
    phonetic: "khalak",
    english: "food",
    icon: "🍲",
  },
  {
    id: "momo",
    tibetan: "མོག་མོག་",
    phonetic: "momo",
    english: "dumplings",
    icon: "🥟",
  },
  // Numbers
  {
    id: "chik",
    tibetan: "གཅིག་",
    phonetic: "chik",
    english: "one",
    icon: "1️⃣",
  },
  { id: "nyi", tibetan: "གཉིས་", phonetic: "nyi", english: "two", icon: "2️⃣" },
  {
    id: "sum",
    tibetan: "གསུམ་",
    phonetic: "sum",
    english: "three",
    icon: "3️⃣",
  },
  { id: "shi", tibetan: "བཞི་", phonetic: "shi", english: "four", icon: "4️⃣" },
  {
    id: "nga-five",
    tibetan: "ལྔ་",
    phonetic: "nga",
    english: "five",
    icon: "5️⃣",
  },
];

export const sentences: TibetanSentence[] = [
  {
    id: "s-tashi-delek",
    tibetan: "བཀྲ་ཤིས་བདེ་ལེགས།",
    phonetic: "tashi delek",
    english: "Hello",
    tibetanTiles: ["བཀྲ་ཤིས་", "བདེ་ལེགས།"],
    englishTiles: ["Hello"],
  },
  {
    id: "s-thukje-che",
    tibetan: "ཐུགས་རྗེ་ཆེ།",
    phonetic: "thukje che",
    english: "Thank you",
    tibetanTiles: ["ཐུགས་རྗེ་", "ཆེ།"],
    englishTiles: ["Thank", "you"],
  },
  {
    id: "s-nga-bopa-yin",
    tibetan: "ང་བོད་པ་ཡིན།",
    phonetic: "nga böpa yin",
    english: "I am Tibetan",
    tibetanTiles: ["ང་", "བོད་པ་", "ཡིན།"],
    englishTiles: ["I", "am", "Tibetan"],
  },
  {
    id: "s-nga-loptruk-yin",
    tibetan: "ང་སློབ་ཕྲུག་ཡིན།",
    phonetic: "nga lopthruk yin",
    english: "I am a student",
    tibetanTiles: ["ང་", "སློབ་ཕྲུག་", "ཡིན།"],
    englishTiles: ["I", "am", "a", "student"],
  },
  {
    id: "s-khyerang-bopa-yinpe",
    tibetan: "ཁྱེད་རང་བོད་པ་ཡིན་པས།",
    phonetic: "khyerang böpa yinpe",
    english: "Are you Tibetan?",
    tibetanTiles: ["ཁྱེད་རང་", "བོད་པ་", "ཡིན་པས།"],
    englishTiles: ["Are", "you", "Tibetan?"],
  },
  {
    id: "s-ja-yakpo-duk",
    tibetan: "ཇ་ཡག་པོ་འདུག",
    phonetic: "ja yakpo duk",
    english: "The tea is good",
    tibetanTiles: ["ཇ་", "ཡག་པོ་", "འདུག"],
    englishTiles: ["The", "tea", "is", "good"],
  },
  {
    id: "s-ama-yakpo-duk",
    tibetan: "ཨ་མ་ཡག་པོ་འདུག",
    phonetic: "ama yakpo duk",
    english: "Mother is well",
    tibetanTiles: ["ཨ་མ་", "ཡག་པོ་", "འདུག"],
    englishTiles: ["Mother", "is", "well"],
  },
  {
    id: "s-chu-nang-rok",
    tibetan: "ཆུ་གནང་རོགས།",
    phonetic: "chu nang rok",
    english: "Please give me water",
    tibetanTiles: ["ཆུ་", "གནང་", "རོགས།"],
    englishTiles: ["Please", "give", "me", "water"],
  },
];

export const wordById = (id: string): TibetanWord => {
  const word = words.find((w) => w.id === id);
  if (!word) throw new Error(`Unknown Tibetan word: ${id}`);
  return word;
};

export const sentenceById = (id: string): TibetanSentence => {
  const sentence = sentences.find((s) => s.id === id);
  if (!sentence) throw new Error(`Unknown Tibetan sentence: ${id}`);
  return sentence;
};
