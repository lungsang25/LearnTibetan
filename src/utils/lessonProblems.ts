export type Select1Of3Problem = {
  type: "SELECT_1_OF_3";
  question: string;
  /** A string icon is rendered as an emoji. */
  answers: readonly {
    icon: JSX.Element | string;
    name: string;
    hint?: string;
  }[];
  correctAnswer: number;
  /** Set when the answer names are Tibetan script. */
  answerLang?: "bo";
};

export type WriteInEnglishProblem = {
  type: "WRITE_IN_ENGLISH";
  question: string;
  questionHint?: string;
  questionLang?: "bo";
  audioId?: string;
  answerTiles: readonly string[];
  correctAnswer: readonly number[];
};

export type WriteInTibetanProblem = {
  type: "WRITE_IN_TIBETAN";
  question: string;
  answerTiles: readonly string[];
  correctAnswer: readonly number[];
};

export type IntroCharacterProblem = {
  type: "INTRO_CHARACTER";
  title: string;
  tibetan: string;
  phonetic: string;
  meaning?: string;
  note?: string;
  audioId: string;
};

export type SelectCharacterForSoundProblem = {
  type: "SELECT_CHARACTER_FOR_SOUND";
  prompt: string;
  target: string;
  audioId?: string;
  options: readonly { id: string; tibetan: string }[];
  correctAnswer: number;
  characterId?: string;
};

export type SelectSoundForCharacterProblem = {
  type: "SELECT_SOUND_FOR_CHARACTER";
  prompt: string;
  tibetan: string;
  audioId?: string;
  options: readonly { id: string; text: string; audioId?: string }[];
  correctAnswer: number;
  characterId?: string;
};

export type MatchPairsProblem = {
  type: "MATCH_PAIRS";
  pairs: readonly {
    id: string;
    tibetan: string;
    text: string;
    audioId?: string;
  }[];
  /** Display order of the right-hand column (indices into `pairs`). */
  rightOrder: readonly number[];
  /** Character ids to credit in the Characters tab when this is completed. */
  characterIds?: readonly string[];
};

export type LessonProblem =
  | Select1Of3Problem
  | WriteInEnglishProblem
  | WriteInTibetanProblem
  | IntroCharacterProblem
  | SelectCharacterForSoundProblem
  | SelectSoundForCharacterProblem
  | MatchPairsProblem;

export type AnswerState = {
  /** Chosen option, for single-choice problems. */
  selectedAnswer: number | null;
  /** Chosen tiles in order (word banks), or matched pair indices (match pairs). */
  selectedAnswers: number[];
};

const numbersEqual = (a: readonly number[], b: readonly number[]): boolean => {
  return a.length === b.length && a.every((_, i) => a[i] === b[i]);
};

/** Teaching cards are shown but never graded. */
export const isGraded = (problem: LessonProblem): boolean =>
  problem.type !== "INTRO_CHARACTER";

export const isAnswerSelected = (
  problem: LessonProblem,
  { selectedAnswer, selectedAnswers }: AnswerState,
): boolean => {
  switch (problem.type) {
    case "SELECT_1_OF_3":
    case "SELECT_CHARACTER_FOR_SOUND":
    case "SELECT_SOUND_FOR_CHARACTER":
      return selectedAnswer !== null;
    case "WRITE_IN_ENGLISH":
    case "WRITE_IN_TIBETAN":
      return selectedAnswers.length > 0;
    case "MATCH_PAIRS":
      return selectedAnswers.length === problem.pairs.length;
    case "INTRO_CHARACTER":
      return true;
  }
};

export const isAnswerCorrect = (
  problem: LessonProblem,
  { selectedAnswer, selectedAnswers }: AnswerState,
): boolean => {
  switch (problem.type) {
    case "SELECT_1_OF_3":
    case "SELECT_CHARACTER_FOR_SOUND":
    case "SELECT_SOUND_FOR_CHARACTER":
      return selectedAnswer === problem.correctAnswer;
    case "WRITE_IN_ENGLISH":
    case "WRITE_IN_TIBETAN":
      return numbersEqual(selectedAnswers, problem.correctAnswer);
    case "MATCH_PAIRS":
      return selectedAnswers.length === problem.pairs.length;
    case "INTRO_CHARACTER":
      return true;
  }
};

/** Text shown as "Correct solution" and on the review scorecard. */
export const correctResponse = (problem: LessonProblem): string => {
  switch (problem.type) {
    case "SELECT_1_OF_3":
      return problem.answers[problem.correctAnswer]?.name ?? "";
    case "SELECT_CHARACTER_FOR_SOUND":
      return problem.options[problem.correctAnswer]?.tibetan ?? "";
    case "SELECT_SOUND_FOR_CHARACTER":
      return problem.options[problem.correctAnswer]?.text ?? "";
    case "WRITE_IN_ENGLISH":
    case "WRITE_IN_TIBETAN":
      return problem.correctAnswer
        .map((i) => problem.answerTiles[i])
        .join(problem.type === "WRITE_IN_TIBETAN" ? "" : " ");
    case "MATCH_PAIRS":
      return problem.pairs.map((p) => `${p.tibetan} = ${p.text}`).join(", ");
    case "INTRO_CHARACTER":
      return problem.tibetan;
  }
};

export const yourResponse = (
  problem: LessonProblem,
  { selectedAnswer, selectedAnswers }: AnswerState,
): string => {
  switch (problem.type) {
    case "SELECT_1_OF_3":
      return problem.answers[selectedAnswer ?? 0]?.name ?? "";
    case "SELECT_CHARACTER_FOR_SOUND":
      return problem.options[selectedAnswer ?? 0]?.tibetan ?? "";
    case "SELECT_SOUND_FOR_CHARACTER":
      return problem.options[selectedAnswer ?? 0]?.text ?? "";
    case "WRITE_IN_ENGLISH":
    case "WRITE_IN_TIBETAN":
      return selectedAnswers
        .map((i) => problem.answerTiles[i])
        .join(problem.type === "WRITE_IN_TIBETAN" ? "" : " ");
    case "MATCH_PAIRS":
    case "INTRO_CHARACTER":
      return correctResponse(problem);
  }
};

export const questionText = (problem: LessonProblem): string => {
  switch (problem.type) {
    case "SELECT_1_OF_3":
    case "WRITE_IN_ENGLISH":
    case "WRITE_IN_TIBETAN":
      return problem.question;
    case "SELECT_CHARACTER_FOR_SOUND":
      return `${problem.prompt}: "${problem.target}"`;
    case "SELECT_SOUND_FOR_CHARACTER":
      return `${problem.prompt}: ${problem.tibetan}`;
    case "MATCH_PAIRS":
      return "Tap the matching pairs";
    case "INTRO_CHARACTER":
      return problem.title;
  }
};

/** Character ids whose strength should change when this problem is checked. */
export const trackedCharacterIds = (problem: LessonProblem): string[] => {
  switch (problem.type) {
    case "SELECT_CHARACTER_FOR_SOUND":
    case "SELECT_SOUND_FOR_CHARACTER":
      return problem.characterId ? [problem.characterId] : [];
    case "MATCH_PAIRS":
      return [...(problem.characterIds ?? [])];
    default:
      return [];
  }
};
