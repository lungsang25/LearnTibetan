import type { LessonProblem } from "~/utils/lessonProblems";
import { consonants, vowels } from "./alphabet";
import { letterProblems } from "./lessons";

export const MASTERED_STRENGTH = 1;

/**
 * "Learn the letters" on the Characters tab: practise the 4 weakest letters,
 * introducing them first if they have never been practised.
 */
export const generateCharacterPractice = (
  characterStrength: Record<string, number>,
): LessonProblem[] => {
  const strengthOf = (id: string) => characterStrength[id] ?? 0;
  // Letters and vowel signs are practised separately so options stay comparable.
  const unmasteredConsonants = consonants.filter(
    (c) => strengthOf(c.id) < MASTERED_STRENGTH,
  );
  const group =
    unmasteredConsonants.length > 0 ||
    vowels.every((v) => strengthOf(v.id) >= MASTERED_STRENGTH)
      ? consonants
      : vowels;
  const weakest = [...group]
    .sort((a, b) => strengthOf(a.id) - strengthOf(b.id))
    .slice(0, 4);
  const isNew = weakest.some((c) => strengthOf(c.id) === 0);
  return letterProblems(
    weakest.map((c) => c.id),
    isNew ? 0 : 1,
  );
};
