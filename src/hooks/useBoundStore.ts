import dayjs from "dayjs";
import { useEffect, useState } from "react";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import type { PersistStorage } from "zustand/middleware";
import { persist } from "zustand/middleware";
import type { CharacterSlice } from "~/stores/createCharacterStore";
import { createCharacterSlice } from "~/stores/createCharacterStore";
import type { GoalXpSlice } from "~/stores/createGoalXpStore";
import { createGoalXpSlice } from "~/stores/createGoalXpStore";
import type { LanguageSlice } from "~/stores/createLanguageStore";
import { createLanguageSlice } from "~/stores/createLanguageStore";
import type { LessonSlice } from "~/stores/createLessonStore";
import { createLessonSlice } from "~/stores/createLessonStore";
import type { LingotSlice } from "~/stores/createLingotStore";
import { createLingotSlice } from "~/stores/createLingotStore";
import type { SoundSettingsSlice } from "~/stores/createSoundSettingsStore";
import { createSoundSettingsSlice } from "~/stores/createSoundSettingsStore";
import type { StreakSlice } from "~/stores/createStreakStore";
import {
  createStreakSlice,
  getCurrentStreak,
} from "~/stores/createStreakStore";
import type { UserSlice } from "~/stores/createUserStore";
import { createUserSlice } from "~/stores/createUserStore";
import type { XpSlice } from "~/stores/createXpStore";
import { createXpSlice } from "~/stores/createXpStore";
import type { DateString } from "~/utils/dateString";
import languages from "~/utils/languages";

type BoundState = CharacterSlice &
  GoalXpSlice &
  LanguageSlice &
  LessonSlice &
  LingotSlice &
  SoundSettingsSlice &
  StreakSlice &
  UserSlice &
  XpSlice;

export type BoundStateCreator<SliceState> = StateCreator<
  BoundState,
  [],
  [],
  SliceState
>;

/** The data fields saved to localStorage (functions are rebuilt on load). */
type PersistedState = Pick<
  BoundState,
  | "characterStrength"
  | "goalXp"
  | "language"
  | "lessonsCompletedByLanguage"
  | "lingots"
  | "soundEffects"
  | "speakingExercises"
  | "listeningExercises"
  | "activeDays"
  | "name"
  | "username"
  | "joinedAt"
  | "loggedIn"
  | "xpByDate"
>;

type SerializedState = Omit<
  PersistedState,
  "activeDays" | "joinedAt" | "language"
> & {
  activeDays: DateString[];
  joinedAt: string;
  languageCode: string;
};

// `activeDays` is a Set and `joinedAt` a dayjs object, so they are converted
// to plain JSON on the way in and out.
const storage: PersistStorage<PersistedState> = {
  getItem: (name) => {
    const raw = localStorage.getItem(name);
    if (!raw) return null;
    const { state, version } = JSON.parse(raw) as {
      state: SerializedState;
      version?: number;
    };
    const { languageCode, activeDays, joinedAt, ...rest } = state;
    return {
      version,
      state: {
        ...rest,
        activeDays: new Set(activeDays),
        joinedAt: dayjs(joinedAt),
        language:
          languages.find((l) => l.code === languageCode) ?? languages[6],
      },
    };
  },
  setItem: (name, { state, version }) => {
    const { language, activeDays, joinedAt, ...rest } = state;
    const serialized: SerializedState = {
      ...rest,
      activeDays: [...activeDays],
      joinedAt: joinedAt.toISOString(),
      languageCode: language.code,
    };
    localStorage.setItem(name, JSON.stringify({ state: serialized, version }));
  },
  removeItem: (name) => localStorage.removeItem(name),
};

export const useBoundStore = create<BoundState>()(
  persist(
    (...args) => ({
      ...createCharacterSlice(...args),
      ...createGoalXpSlice(...args),
      ...createLanguageSlice(...args),
      ...createLessonSlice(...args),
      ...createLingotSlice(...args),
      ...createSoundSettingsSlice(...args),
      ...createStreakSlice(...args),
      ...createUserSlice(...args),
      ...createXpSlice(...args),
    }),
    {
      name: "learn-tibetan",
      storage,
      // Rehydrated from _app after mount, so server and first client render match.
      skipHydration: true,
      partialize: (state): PersistedState => ({
        characterStrength: state.characterStrength,
        goalXp: state.goalXp,
        language: state.language,
        lessonsCompletedByLanguage: state.lessonsCompletedByLanguage,
        lingots: state.lingots,
        soundEffects: state.soundEffects,
        speakingExercises: state.speakingExercises,
        listeningExercises: state.listeningExercises,
        activeDays: state.activeDays,
        name: state.name,
        username: state.username,
        joinedAt: state.joinedAt,
        loggedIn: state.loggedIn,
        xpByDate: state.xpByDate,
      }),
      merge: (persisted, current) => {
        const state = { ...current, ...(persisted as Partial<PersistedState>) };
        // The saved streak may be stale if days have passed since the last visit.
        return { ...state, streak: getCurrentStreak(state.activeDays) };
      },
    },
  ),
);

/** False until saved progress has been loaded from localStorage. */
export const useHasHydrated = (): boolean => {
  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    setHasHydrated(useBoundStore.persist.hasHydrated());
    return useBoundStore.persist.onFinishHydration(() => setHasHydrated(true));
  }, []);
  return hasHydrated;
};
