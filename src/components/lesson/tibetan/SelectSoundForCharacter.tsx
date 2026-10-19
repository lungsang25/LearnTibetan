import React from "react";
import type { SelectSoundForCharacterProblem } from "~/utils/lessonProblems";
import { useTibetanAudio } from "~/utils/playTibetanAudio";
import type { ProblemProps } from "../LessonShell";
import { AudioButton, ProblemLayout } from "../LessonShell";

/** See a Tibetan letter or word, pick its sound or meaning. */
export const SelectSoundForCharacter = ({
  problem,
  selectedAnswer,
  setSelectedAnswer,
  ...props
}: ProblemProps & {
  problem: SelectSoundForCharacterProblem;
  selectedAnswer: number | null;
  setSelectedAnswer: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const audio = useTibetanAudio();

  return (
    <ProblemLayout {...props} title={problem.prompt}>
      <div className="flex w-full items-center justify-center gap-4">
        {audio.enabled && problem.audioId && (
          <AudioButton onClick={() => audio.play(problem.audioId)} />
        )}
        <div
          className={
            problem.tibetan.length > 2
              ? "font-tibetan text-5xl text-gray-700"
              : "font-tibetan text-8xl text-gray-700"
          }
          lang="bo"
        >
          {problem.tibetan}
        </div>
      </div>
      <div className="flex w-full flex-col gap-3" role="radiogroup">
        {problem.options.map((option, i) => (
          <div
            key={option.id}
            className={
              i === selectedAnswer
                ? "flex cursor-pointer items-center gap-3 rounded-xl border-2 border-b-4 border-blue-300 bg-blue-100 p-4 text-blue-400"
                : "flex cursor-pointer items-center gap-3 rounded-xl border-2 border-b-4 border-gray-200 p-4 text-gray-700 hover:bg-gray-100"
            }
            role="radio"
            aria-checked={i === selectedAnswer}
            tabIndex={0}
            onClick={() => {
              setSelectedAnswer(i);
              audio.play(option.audioId);
            }}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-gray-200 text-sm text-gray-400">
              {i + 1}
            </span>
            <span className="text-lg font-bold">{option.text}</span>
          </div>
        ))}
      </div>
    </ProblemLayout>
  );
};
