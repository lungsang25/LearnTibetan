import type { BoundStateCreator } from "~/hooks/useBoundStore";

export type CharacterSlice = {
  /** 0–1 per Tibetan character id; 1 means mastered. */
  characterStrength: Record<string, number>;
  recordCharacterAnswer: (id: string, correct: boolean) => void;
};

// Rounded so repeated +0.2 steps land exactly on 1 (mastered).
const clamp = (x: number) =>
  Math.min(1, Math.max(0, Math.round(x * 100) / 100));

export const createCharacterSlice: BoundStateCreator<CharacterSlice> = (
  set,
) => ({
  characterStrength: {},
  recordCharacterAnswer: (id: string, correct: boolean) =>
    set(({ characterStrength }) => ({
      characterStrength: {
        ...characterStrength,
        [id]: clamp((characterStrength[id] ?? 0) + (correct ? 0.2 : -0.1)),
      },
    })),
});
