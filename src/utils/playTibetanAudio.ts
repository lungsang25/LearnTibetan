import { useCallback } from "react";
import { useBoundStore } from "~/hooks/useBoundStore";

/** Recordings live at public/audio/tibetan/<id>.mp3 (see the README there). */
export const tibetanAudioSrc = (id: string) => `/audio/tibetan/${id}.mp3`;

/** Ids with no recording yet, so we don't keep requesting them. */
const missingAudio = new Set<string>();

export const playTibetanAudio = (id: string): void => {
  if (missingAudio.has(id)) return;
  const audio = new Audio(tibetanAudioSrc(id));
  audio.addEventListener("error", () => missingAudio.add(id));
  // Rejects when the file is missing or autoplay is blocked; the phonetic
  // text is always shown, so silence is an acceptable fallback.
  audio.play().catch(() => undefined);
};

/** Audio is off when "Listening exercises" is off in settings. */
export const useTibetanAudio = () => {
  const enabled = useBoundStore((x) => x.listeningExercises);
  const play = useCallback(
    (id: string | undefined) => {
      if (enabled && id) playTibetanAudio(id);
    },
    [enabled],
  );
  return { enabled, play };
};
