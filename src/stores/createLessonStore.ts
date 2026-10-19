import { getUnits } from "~/utils/units";
import type { BoundStateCreator } from "~/hooks/useBoundStore";

export type LessonSlice = {
  /** Keyed by language code so each course keeps its own path progress. */
  lessonsCompletedByLanguage: Record<string, number>;
  lessonsCompleted: () => number;
  increaseLessonsCompleted: (by?: number) => void;
  jumpToUnit: (unitNumber: number) => void;
};

export const createLessonSlice: BoundStateCreator<LessonSlice> = (
  set,
  get,
) => ({
  lessonsCompletedByLanguage: {},
  lessonsCompleted: () =>
    get().lessonsCompletedByLanguage[get().language.code] ?? 0,
  increaseLessonsCompleted: (by = 1) =>
    set(({ lessonsCompletedByLanguage, language }) => ({
      lessonsCompletedByLanguage: {
        ...lessonsCompletedByLanguage,
        [language.code]: (lessonsCompletedByLanguage[language.code] ?? 0) + by,
      },
    })),
  jumpToUnit: (unitNumber: number) =>
    set(({ lessonsCompletedByLanguage, language }) => {
      const lessonsPerTile = 4;
      const totalLessonsToJumpToUnit = getUnits(language.code)
        .filter((unit) => unit.unitNumber < unitNumber)
        .map((unit) => unit.tiles.length * lessonsPerTile)
        .reduce((a, b) => a + b, 0);
      return {
        lessonsCompletedByLanguage: {
          ...lessonsCompletedByLanguage,
          [language.code]: Math.max(
            lessonsCompletedByLanguage[language.code] ?? 0,
            totalLessonsToJumpToUnit,
          ),
        },
      };
    }),
});
