import { chunk, sample, shuffle } from "~/utils/array-utils";
import type {
  IntroCharacterProblem,
  LessonProblem,
  MatchPairsProblem,
  SelectCharacterForSoundProblem,
  SelectSoundForCharacterProblem,
  WriteInEnglishProblem,
  WriteInTibetanProblem,
} from "~/utils/lessonProblems";
import type { TibetanCharacter } from "./alphabet";
import { characterById, consonants, vowels } from "./alphabet";
import { tibetanUnits } from "./units";
import type { TibetanSentence, TibetanWord } from "./vocab";
import { sentenceById, sentences, wordById, words } from "./vocab";

type LessonDef =
  | { kind: "letters"; characterIds: string[] }
  | { kind: "words"; wordIds: string[]; sentenceIds: string[] }
  | { kind: "review"; unitNumber: number };

const lessonDefs: Record<string, LessonDef> = {
  "letters-1": { kind: "letters", characterIds: ["ka", "kha", "ga", "nga"] },
  "letters-2": { kind: "letters", characterIds: ["ca", "cha", "ja", "nya"] },
  "letters-3": { kind: "letters", characterIds: ["ta", "tha", "da", "na"] },
  "letters-4": { kind: "letters", characterIds: ["pa", "pha", "ba", "ma"] },
  "letters-5": { kind: "letters", characterIds: ["tsa", "tsha", "dza", "wa"] },
  "letters-6": { kind: "letters", characterIds: ["zha", "za", "achung", "ya"] },
  "letters-7": { kind: "letters", characterIds: ["ra", "la", "sha", "sa"] },
  "letters-8": { kind: "letters", characterIds: ["ha", "a"] },
  "vowels-1": {
    kind: "letters",
    characterIds: ["vowel-i", "vowel-u", "vowel-e", "vowel-o"],
  },
  greetings: {
    kind: "words",
    wordIds: ["tashi-delek", "thukje-che", "kale-phe", "kale-shu"],
    sentenceIds: ["s-tashi-delek", "s-thukje-che"],
  },
  pronouns: {
    kind: "words",
    wordIds: ["nga", "khyerang", "yin", "bopa"],
    sentenceIds: ["s-nga-bopa-yin", "s-khyerang-bopa-yinpe"],
  },
  intro: {
    kind: "words",
    wordIds: ["loptruk", "yakpo"],
    sentenceIds: ["s-nga-loptruk-yin", "s-nga-bopa-yin"],
  },
  "practice-3": { kind: "review", unitNumber: 3 },
  family: {
    kind: "words",
    wordIds: ["ama", "pala", "bu", "bumo"],
    sentenceIds: ["s-ama-yakpo-duk"],
  },
  food: {
    kind: "words",
    wordIds: ["chu", "ja", "sho", "khalak", "momo"],
    sentenceIds: ["s-ja-yakpo-duk", "s-chu-nang-rok"],
  },
  numbers: {
    kind: "words",
    wordIds: ["chik", "nyi", "sum", "shi", "nga-five"],
    sentenceIds: [],
  },
  "review-1": { kind: "review", unitNumber: 1 },
  "review-2": { kind: "review", unitNumber: 2 },
  "review-3": { kind: "review", unitNumber: 3 },
  "review-4": { kind: "review", unitNumber: 4 },
};

const REVIEW_LENGTH = 10;

// ---------- Letters ----------

/** Letters the learner has already met, used for wrong options. */
const letterPool = (chars: TibetanCharacter[]): TibetanCharacter[] => {
  const first = chars[0];
  if (first?.kind === "vowel") return vowels;
  const lastIndex = Math.max(
    ...chars.map((c) => consonants.findIndex((x) => x.id === c.id)),
  );
  return consonants.slice(0, Math.max(lastIndex + 1, 4));
};

const introLetter = (c: TibetanCharacter): IntroCharacterProblem => ({
  type: "INTRO_CHARACTER",
  title: c.kind === "vowel" ? "New vowel sign!" : "New letter!",
  tibetan: c.char,
  phonetic: c.phonetic,
  note: c.note,
  audioId: c.id,
});

const selectLetterForSound = (
  c: TibetanCharacter,
  pool: TibetanCharacter[],
): SelectCharacterForSoundProblem => {
  const options = shuffle([
    c,
    ...sample(
      pool.filter((x) => x.id !== c.id),
      3,
    ),
  ]);
  return {
    type: "SELECT_CHARACTER_FOR_SOUND",
    prompt: "Select the correct character for",
    target: c.phonetic,
    audioId: c.id,
    options: options.map((o) => ({ id: o.id, tibetan: o.char })),
    correctAnswer: options.indexOf(c),
    characterId: c.id,
  };
};

const selectSoundForLetter = (
  c: TibetanCharacter,
  pool: TibetanCharacter[],
): SelectSoundForCharacterProblem => {
  const options = shuffle([
    c,
    ...sample(
      pool.filter((x) => x.id !== c.id),
      3,
    ),
  ]);
  return {
    type: "SELECT_SOUND_FOR_CHARACTER",
    prompt: "What sound does this make?",
    tibetan: c.char,
    options: options.map((o) => ({
      id: o.id,
      text: o.phonetic,
      audioId: o.id,
    })),
    correctAnswer: options.indexOf(c),
    characterId: c.id,
  };
};

const matchLetters = (chars: TibetanCharacter[]): MatchPairsProblem => {
  const pairs = shuffle(chars).map((c) => ({
    id: c.id,
    tibetan: c.char,
    text: c.phonetic,
    audioId: c.id,
  }));
  return {
    type: "MATCH_PAIRS",
    pairs,
    rightOrder: shuffle(pairs.map((_, i) => i)),
    characterIds: chars.map((c) => c.id),
  };
};

/** Round 0 teaches the letters; later rounds only quiz them. */
export const letterProblems = (
  characterIds: string[],
  round: number,
): LessonProblem[] => {
  const chars = characterIds.map(characterById);
  const pool = letterPool(chars);
  // Pad the match exercise with earlier letters so it always has 4+ pairs.
  const matchChars = [
    ...chars,
    ...sample(
      pool.filter((p) => !chars.includes(p)),
      Math.max(0, 4 - chars.length),
    ),
  ];

  if (round === 0) {
    return [
      ...chunk(chars, 2).flatMap((group) => [
        ...group.map(introLetter),
        ...group.map((c, i) =>
          i % 2 === 0
            ? selectLetterForSound(c, pool)
            : selectSoundForLetter(c, pool),
        ),
      ]),
      matchLetters(matchChars),
    ];
  }
  return [
    ...shuffle(chars).map((c) => selectLetterForSound(c, pool)),
    ...shuffle(chars).map((c) => selectSoundForLetter(c, pool)),
    matchLetters(matchChars),
  ];
};

// ---------- Words and sentences ----------

const introWord = (w: TibetanWord): IntroCharacterProblem => ({
  type: "INTRO_CHARACTER",
  title: "New word!",
  tibetan: w.tibetan,
  phonetic: w.phonetic,
  meaning: w.english,
  audioId: w.id,
});

const otherWords = (w: TibetanWord, lessonWords: TibetanWord[]) => {
  const distinct = (x: TibetanWord) =>
    x.id !== w.id && x.english !== w.english && x.tibetan !== w.tibetan;
  const fromLesson = lessonWords.filter(distinct);
  const fromCourse = words.filter(
    (x) => distinct(x) && !fromLesson.includes(x),
  );
  return [...shuffle(fromLesson), ...shuffle(fromCourse)];
};

const quizWord = (
  w: TibetanWord,
  lessonWords: TibetanWord[],
  variant: number,
): LessonProblem => {
  if (variant % 2 === 0 && w.icon) {
    const options = shuffle([
      w,
      ...otherWords(w, lessonWords)
        .filter((x) => x.icon)
        .slice(0, 2),
    ]);
    return {
      type: "SELECT_1_OF_3",
      question: `Which one of these is "${w.english}"?`,
      answers: options.map((o) => ({
        icon: o.icon ?? "",
        name: o.tibetan,
        hint: o.phonetic,
      })),
      correctAnswer: options.indexOf(w),
      answerLang: "bo",
    };
  }
  const options = shuffle([w, ...otherWords(w, lessonWords).slice(0, 3)]);
  if (variant % 2 === 0) {
    return {
      type: "SELECT_SOUND_FOR_CHARACTER",
      prompt: "What does this mean?",
      tibetan: w.tibetan,
      audioId: w.id,
      options: options.map((o) => ({ id: o.id, text: o.english })),
      correctAnswer: options.indexOf(w),
    };
  }
  return {
    type: "SELECT_CHARACTER_FOR_SOUND",
    prompt: "Select the correct word for",
    target: w.english,
    options: options.map((o) => ({ id: o.id, tibetan: o.tibetan })),
    correctAnswer: options.indexOf(w),
  };
};

const matchWords = (lessonWords: TibetanWord[]): MatchPairsProblem => {
  const chosen = [
    ...lessonWords,
    ...sample(
      words.filter((w) => !lessonWords.includes(w)),
      Math.max(0, 4 - lessonWords.length),
    ),
  ].slice(0, 5);
  const pairs = shuffle(chosen).map((w) => ({
    id: w.id,
    tibetan: w.tibetan,
    text: w.english,
    audioId: w.id,
  }));
  return {
    type: "MATCH_PAIRS",
    pairs,
    rightOrder: shuffle(pairs.map((_, i) => i)),
  };
};

/** Shuffles the correct tiles in with distractors and records their order. */
const wordBank = (
  correctTiles: string[],
  distractorSource: string[],
): { answerTiles: string[]; correctAnswer: number[] } => {
  const distractors = sample(
    [...new Set(distractorSource)].filter((t) => !correctTiles.includes(t)),
    3,
  );
  const tagged = shuffle([
    ...correctTiles.map((text, order) => ({ text, order })),
    ...distractors.map((text) => ({ text, order: -1 })),
  ]);
  return {
    answerTiles: tagged.map((t) => t.text),
    correctAnswer: correctTiles.map((_, order) =>
      tagged.findIndex((t) => t.order === order),
    ),
  };
};

const writeInEnglish = (s: TibetanSentence): WriteInEnglishProblem => ({
  type: "WRITE_IN_ENGLISH",
  question: s.tibetan,
  questionHint: s.phonetic,
  questionLang: "bo",
  audioId: s.id,
  ...wordBank(
    s.englishTiles,
    sentences.filter((x) => x !== s).flatMap((x) => x.englishTiles),
  ),
});

const writeInTibetan = (s: TibetanSentence): WriteInTibetanProblem => ({
  type: "WRITE_IN_TIBETAN",
  question: s.english,
  ...wordBank(
    s.tibetanTiles,
    sentences.filter((x) => x !== s).flatMap((x) => x.tibetanTiles),
  ),
});

const wordProblems = (
  wordIds: string[],
  sentenceIds: string[],
  round: number,
): LessonProblem[] => {
  const lessonWords = wordIds.map(wordById);
  const lessonSentences = sentenceIds.map(sentenceById);
  const sentenceProblems = shuffle(
    lessonSentences.flatMap((s) => [writeInEnglish(s), writeInTibetan(s)]),
  );

  if (round === 0) {
    return [
      ...chunk(lessonWords, 2).flatMap((group) => [
        ...group.map(introWord),
        ...group.map((w, i) => quizWord(w, lessonWords, i)),
      ]),
      matchWords(lessonWords),
      ...sentenceProblems,
    ];
  }
  return [
    ...shuffle(lessonWords).map((w, i) => quizWord(w, lessonWords, i + round)),
    matchWords(lessonWords),
    ...sentenceProblems,
  ];
};

// ---------- Public API ----------

const unitLessonIds = (unitNumber: number): string[] => {
  const unit = tibetanUnits.find((u) => u.unitNumber === unitNumber);
  return (unit?.tiles ?? []).flatMap((tile) =>
    tile.type !== "treasure" &&
    tile.lessonId &&
    lessonDefs[tile.lessonId]?.kind !== "review"
      ? [tile.lessonId]
      : [],
  );
};

/** A mixed, intro-free set of problems drawn from several lessons. */
export const getTibetanReviewProblems = (
  lessonIds: string[],
  count = REVIEW_LENGTH,
): LessonProblem[] => {
  const pool = lessonIds.flatMap((id) => getTibetanLessonProblems(id, 4));
  return sample(pool, count);
};

/**
 * Problems for one tile. `round` is how many times this tile has already been
 * completed (0–3); new letters and words are only introduced on round 0.
 */
export const getTibetanLessonProblems = (
  lessonId: string,
  round: number,
): LessonProblem[] => {
  const def = lessonDefs[lessonId];
  if (!def) return [];
  switch (def.kind) {
    case "letters":
      return letterProblems(def.characterIds, round);
    case "words":
      return wordProblems(def.wordIds, def.sentenceIds, round);
    case "review":
      return getTibetanReviewProblems(unitLessonIds(def.unitNumber));
  }
};

/** The "jump here?" test for a unit covers everything before it. */
export const getTibetanUnitTestProblems = (
  unitNumber: number,
): LessonProblem[] => {
  const lessonIds = tibetanUnits
    .filter((u) => u.unitNumber < unitNumber)
    .flatMap((u) => unitLessonIds(u.unitNumber));
  return getTibetanReviewProblems(
    lessonIds.length > 0 ? lessonIds : unitLessonIds(unitNumber),
  );
};

/** Everything a unit teaches, for its guidebook page. */
export const getTibetanUnitGuide = (unitNumber: number) => {
  const defs = unitLessonIds(unitNumber).flatMap((id) => {
    const def = lessonDefs[id];
    return def ? [def] : [];
  });
  return {
    characters: defs.flatMap((d) =>
      d.kind === "letters" ? d.characterIds.map(characterById) : [],
    ),
    words: defs.flatMap((d) =>
      d.kind === "words" ? d.wordIds.map(wordById) : [],
    ),
    sentences: [
      ...new Set(
        defs.flatMap((d) => (d.kind === "words" ? d.sentenceIds : [])),
      ),
    ].map(sentenceById),
  };
};
