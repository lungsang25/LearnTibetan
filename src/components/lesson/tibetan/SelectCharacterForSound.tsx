import React, { useEffect } from "react";
import type { SelectCharacterForSoundProblem } from "~/utils/lessonProblems";
import { useTibetanAudio } from "~/utils/playTibetanAudio";
import type { ProblemProps } from "../LessonShell";
import { AudioButton, ProblemLayout } from "../LessonShell";

/** Hear / read a sound or meaning, pick the Tibetan letter or word. */
export const SelectCharacterForSound = ({
  problem,
  selectedAnswer,
  setSelectedAnswer,
  ...props
}: ProblemProps & {
  problem: SelectCharacterForSoundProblem;
  selectedAnswer: number | null;
  setSelectedAnswer: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const audio = useTibetanAudio();
  const { play } = audio;

  useEffect(() => {
    play(problem.audioId);
  }, [play, problem.audioId]);

  return (
    <ProblemLayout
      {...props}
      title={
        <span className="flex flex-wrap items-center gap-3">
          {audio.enabled && problem.audioId && (
            <AudioButton onClick={() => audio.play(problem.audioId)} />
          )}
          <span>
            {problem.prompt} “{problem.target}”
          </span>
        </span>
      }
    >
      <div
        className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4"
        role="radiogroup"
      >
        {problem.options.map((option, i) => (
          <div
            key={option.id}
            className={
              i === selectedAnswer
                ? "flex cursor-pointer items-center justify-center rounded-xl border-2 border-b-4 border-blue-300 bg-blue-100 px-4 py-6 text-blue-400"
                : "flex cursor-pointer items-center justify-center rounded-xl border-2 border-b-4 border-gray-200 px-4 py-6 text-gray-700 hover:bg-gray-100"
            }
            role="radio"
            aria-checked={i === selectedAnswer}
            tabIndex={0}
            onClick={() => setSelectedAnswer(i)}
          >
            <span
              className={
                option.tibetan.length > 2
                  ? "font-tibetan text-3xl"
                  : "font-tibetan text-6xl"
              }
              lang="bo"
            >
              {option.tibetan}
            </span>
          </div>
        ))}
      </div>
    </ProblemLayout>
  );
};
