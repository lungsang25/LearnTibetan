import React, { useEffect, useState } from "react";
import { useBoundStore } from "~/hooks/useBoundStore";
import type { MatchPairsProblem } from "~/utils/lessonProblems";
import { useTibetanAudio } from "~/utils/playTibetanAudio";
import type { ProblemProps } from "../LessonShell";
import { ProblemLayout } from "../LessonShell";

type Side = "left" | "right";

/**
 * Tap a Tibetan item and its match. `selectedAnswers` holds the indices of
 * matched pairs; the problem is answered once every pair is matched.
 */
export const MatchPairs = ({
  problem,
  selectedAnswers,
  setSelectedAnswers,
  ...props
}: ProblemProps & {
  problem: MatchPairsProblem;
  selectedAnswers: number[];
  setSelectedAnswers: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const audio = useTibetanAudio();
  const recordCharacterAnswer = useBoundStore((x) => x.recordCharacterAnswer);
  const [selected, setSelected] = useState<{ side: Side; pair: number } | null>(
    null,
  );
  const [wrong, setWrong] = useState<{ side: Side; pair: number }[]>([]);

  useEffect(() => {
    if (wrong.length === 0) return;
    const timeout = setTimeout(() => setWrong([]), 600);
    return () => clearTimeout(timeout);
  }, [wrong]);

  const onTap = (side: Side, pair: number) => {
    if (selectedAnswers.includes(pair)) return;
    if (side === "left") audio.play(problem.pairs[pair]?.audioId);
    if (!selected || selected.side === side) {
      setSelected({ side, pair });
      return;
    }
    if (selected.pair === pair) {
      setSelectedAnswers((matched) => [...matched, pair]);
    } else {
      const leftPair = side === "left" ? pair : selected.pair;
      const leftId = problem.pairs[leftPair]?.id;
      if (leftId && problem.characterIds?.includes(leftId)) {
        recordCharacterAnswer(leftId, false);
      }
      setWrong([selected, { side, pair }]);
    }
    setSelected(null);
  };

  const itemClassName = (side: Side, pair: number) => {
    const base =
      "flex min-h-[64px] items-center justify-center rounded-xl border-2 border-b-4 px-3 py-2 transition";
    if (selectedAnswers.includes(pair)) {
      return `${base} cursor-default border-gray-200 text-gray-200`;
    }
    if (wrong.some((w) => w.side === side && w.pair === pair)) {
      return `${base} border-red-300 bg-red-100 text-red-500`;
    }
    if (selected?.side === side && selected.pair === pair) {
      return `${base} border-blue-300 bg-blue-100 text-blue-400`;
    }
    return `${base} cursor-pointer border-gray-200 text-gray-700 hover:bg-gray-100`;
  };

  return (
    <ProblemLayout {...props} title="Tap the matching pairs">
      <div className="grid w-full grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {problem.pairs.map((pair, i) => (
            <button
              key={pair.id}
              className={itemClassName("left", i)}
              disabled={selectedAnswers.includes(i)}
              onClick={() => onTap("left", i)}
            >
              <span
                className={
                  pair.tibetan.length > 2
                    ? "font-tibetan text-2xl"
                    : "font-tibetan text-4xl"
                }
                lang="bo"
              >
                {pair.tibetan}
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {problem.rightOrder.map((i) => {
            const pair = problem.pairs[i];
            if (!pair) return null;
            return (
              <button
                key={pair.id}
                className={itemClassName("right", i)}
                disabled={selectedAnswers.includes(i)}
                onClick={() => onTap("right", i)}
              >
                <span className="text-lg font-bold">{pair.text}</span>
              </button>
            );
          })}
        </div>
      </div>
    </ProblemLayout>
  );
};
