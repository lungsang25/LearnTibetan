import React, { useEffect } from "react";
import type { IntroCharacterProblem } from "~/utils/lessonProblems";
import { useTibetanAudio } from "~/utils/playTibetanAudio";
import type { ProblemProps } from "../LessonShell";
import { AudioButton, ProblemLayout } from "../LessonShell";

/** "New letter!" / "New word!" teaching card. It is not graded. */
export const IntroCharacter = ({
  problem,
  ...props
}: ProblemProps & { problem: IntroCharacterProblem }) => {
  const audio = useTibetanAudio();
  const { play } = audio;

  useEffect(() => {
    play(problem.audioId);
  }, [play, problem.audioId]);

  return (
    <ProblemLayout
      {...props}
      title={
        <span className="uppercase tracking-wide text-[#ce82ff]">
          {problem.title}
        </span>
      }
      footer={
        <section className="border-gray-200 sm:border-t-2 sm:p-10">
          <div className="mx-auto flex max-w-5xl sm:justify-end">
            <button
              className="grow rounded-2xl border-b-4 border-green-600 bg-green-500 p-3 font-bold uppercase text-white transition hover:brightness-105 sm:min-w-[150px] sm:max-w-fit sm:grow-0"
              onClick={props.onFinish}
            >
              Continue
            </button>
          </div>
        </section>
      }
    >
      <div className="flex w-full flex-col items-center gap-6 rounded-3xl border-2 border-b-4 border-gray-200 px-6 py-10">
        <div
          className="font-tibetan text-8xl text-gray-700 sm:text-9xl"
          lang="bo"
        >
          {problem.tibetan}
        </div>
        <div className="flex items-center gap-3">
          {audio.enabled && (
            <AudioButton onClick={() => audio.play(problem.audioId)} />
          )}
          <div className="text-3xl font-bold text-gray-700">
            {problem.phonetic}
          </div>
        </div>
        {problem.meaning && (
          <div className="text-xl text-gray-500">“{problem.meaning}”</div>
        )}
        {problem.note && (
          <div className="font-tibetan text-gray-400">{problem.note}</div>
        )}
      </div>
    </ProblemLayout>
  );
};
