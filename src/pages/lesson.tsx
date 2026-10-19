import type { NextPage } from "next";
import type { ParsedUrlQuery } from "querystring";
import React, { useRef, useState } from "react";
import { AppleSvg, BoySvg, WomanSvg } from "~/components/Svgs";
import { useBoundStore } from "~/hooks/useBoundStore";
import { useRouter } from "next/router";
import type { QuestionResult } from "~/components/lesson/LessonShell";
import {
  LessonComplete,
  LessonFastForwardEndFail,
  LessonFastForwardEndPass,
  LessonFastForwardStart,
} from "~/components/lesson/LessonShell";
import { ProblemSelect1Of3 } from "~/components/lesson/ProblemSelect1Of3";
import { ProblemWriteInEnglish } from "~/components/lesson/ProblemWriteInEnglish";
import { IntroCharacter } from "~/components/lesson/tibetan/IntroCharacter";
import { MatchPairs } from "~/components/lesson/tibetan/MatchPairs";
import { SelectCharacterForSound } from "~/components/lesson/tibetan/SelectCharacterForSound";
import { SelectSoundForCharacter } from "~/components/lesson/tibetan/SelectSoundForCharacter";
import { generateCharacterPractice } from "~/courses/tibetan/generateCharacterPractice";
import {
  getTibetanLessonProblems,
  getTibetanReviewProblems,
  getTibetanUnitTestProblems,
} from "~/courses/tibetan/lessons";
import { tibetanUnits } from "~/courses/tibetan/units";
import type {
  LessonProblem,
  Select1Of3Problem,
  WriteInEnglishProblem,
} from "~/utils/lessonProblems";
import {
  correctResponse,
  isAnswerCorrect as checkAnswer,
  isAnswerSelected as checkAnswerSelected,
  isGraded,
  questionText,
  trackedCharacterIds,
  yourResponse,
} from "~/utils/lessonProblems";

const lessonProblem1: Select1Of3Problem = {
  type: "SELECT_1_OF_3",
  question: `Which one of these is "the apple"?`,
  answers: [
    { icon: <AppleSvg />, name: "la manzana" },
    { icon: <BoySvg />, name: "el niño" },
    { icon: <WomanSvg />, name: "la mujer" },
  ],
  correctAnswer: 0,
};

const lessonProblem2: WriteInEnglishProblem = {
  type: "WRITE_IN_ENGLISH",
  question: "El niño",
  answerTiles: ["woman", "milk", "water", "I", "The", "boy"],
  correctAnswer: [4, 5],
};

const lessonProblems: LessonProblem[] = [lessonProblem1, lessonProblem2];

const lessonsPerTile = 4;

/** Picks the Tibetan problems for the lesson the URL asks for. */
const buildTibetanProblems = (
  query: ParsedUrlQuery,
  lessonsCompleted: number,
  characterStrength: Record<string, number>,
): LessonProblem[] => {
  if ("characters" in query) {
    return generateCharacterPractice(characterStrength);
  }

  const fastForwardUnit = Number(query["fast-forward"]);
  if ("fast-forward" in query && !isNaN(fastForwardUnit)) {
    return getTibetanUnitTestProblems(fastForwardUnit);
  }

  const tiles = tibetanUnits.flatMap((unit) =>
    unit.tiles.map((tile, tileIndex) => ({
      unitNumber: unit.unitNumber,
      tileIndex,
      lessonId: tile.type === "treasure" ? undefined : tile.lessonId,
    })),
  );
  const tilesCompleted = Math.floor(lessonsCompleted / lessonsPerTile);

  // The practice button on the learn page: review everything unlocked so far.
  if ("practice" in query && !("unit" in query)) {
    const lessonIds = tiles
      .slice(0, tilesCompleted + 1)
      .flatMap((t) => (t.lessonId ? [t.lessonId] : []))
      .filter((id) => !id.startsWith("review-") && !id.startsWith("practice-"));
    return lessonIds.length > 0
      ? getTibetanReviewProblems(lessonIds)
      : getTibetanLessonProblems("letters-1", 1);
  }

  const requested = tiles.findIndex(
    (t) =>
      t.unitNumber === Number(query.unit) && t.tileIndex === Number(query.tile),
  );
  const tileIndex = requested === -1 ? tilesCompleted : requested;
  const lessonId = tiles[tileIndex]?.lessonId ?? "letters-1";
  // How many times the active tile has been done; finished tiles skip intros.
  const round =
    "practice" in query || tileIndex < tilesCompleted
      ? lessonsPerTile
      : tileIndex === tilesCompleted
        ? lessonsCompleted % lessonsPerTile
        : 0;
  return getTibetanLessonProblems(lessonId, round);
};

const Lesson: NextPage = () => {
  const router = useRouter();
  const language = useBoundStore((x) => x.language);

  if (!router.isReady) return null;

  const isTibetan = language.code === "bo";
  return (
    <LessonRunner
      // A different URL or course starts a fresh lesson.
      key={`${language.code}:${router.asPath}`}
      isTibetan={isTibetan}
    />
  );
};

export default Lesson;

const LessonRunner = ({ isTibetan }: { isTibetan: boolean }) => {
  const router = useRouter();
  const recordCharacterAnswer = useBoundStore((x) => x.recordCharacterAnswer);

  // Built once per lesson; missed Tibetan problems are appended to the end.
  const [problems, setProblems] = useState<LessonProblem[]>(() => {
    if (!isTibetan) return lessonProblems;
    const { lessonsCompleted, characterStrength } = useBoundStore.getState();
    const built = buildTibetanProblems(
      router.query,
      lessonsCompleted(),
      characterStrength,
    );
    return built.length > 0 ? built : getTibetanLessonProblems("letters-1", 0);
  });
  const [initialProblemCount] = useState(problems.length);

  const [lessonProblem, setLessonProblem] = useState(0);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  const [incorrectAnswerCount, setIncorrectAnswerCount] = useState(0);
  const [introsSeen, setIntrosSeen] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<null | number>(null);
  const [correctAnswerShown, setCorrectAnswerShown] = useState(false);
  const [quitMessageShown, setQuitMessageShown] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const startTime = useRef(Date.now());
  const endTime = useRef(startTime.current + 1000 * 60 * 3 + 1000 * 33);

  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [reviewLessonShown, setReviewLessonShown] = useState(false);

  const problem =
    problems[lessonProblem] ?? problems[0] ?? (lessonProblem1 as LessonProblem);

  // Tibetan lessons finish when every problem is done; the demo needs 2 correct.
  const totalCorrectAnswersNeeded = isTibetan ? initialProblemCount : 2;
  const progressCount = correctAnswerCount + introsSeen;

  const [isStartingLesson, setIsStartingLesson] = useState(true);
  const hearts =
    "fast-forward" in router.query &&
    !isNaN(Number(router.query["fast-forward"]))
      ? 3 - incorrectAnswerCount
      : null;

  const answerState = { selectedAnswer, selectedAnswers };
  const isAnswerCorrect = checkAnswer(problem, answerState);

  const requeueProblem = () => {
    if (isTibetan) setProblems((problems) => [...problems, problem]);
  };

  const onCheckAnswer = () => {
    setCorrectAnswerShown(true);
    if (isAnswerCorrect) {
      setCorrectAnswerCount((x) => x + 1);
    } else {
      setIncorrectAnswerCount((x) => x + 1);
      requeueProblem();
    }
    for (const id of trackedCharacterIds(problem)) {
      recordCharacterAnswer(id, isAnswerCorrect);
    }
    setQuestionResults((questionResults) => [
      ...questionResults,
      {
        question: questionText(problem),
        yourResponse: yourResponse(problem, answerState),
        correctResponse: correctResponse(problem),
      },
    ]);
  };

  const onFinish = () => {
    if (!isGraded(problem)) setIntrosSeen((x) => x + 1);
    setSelectedAnswer(null);
    setSelectedAnswers([]);
    setCorrectAnswerShown(false);
    setLessonProblem((x) => (isTibetan ? x + 1 : (x + 1) % problems.length));
    endTime.current = Date.now();
  };

  const onSkip = () => {
    setSelectedAnswer(null);
    setCorrectAnswerShown(true);
    requeueProblem();
  };

  const unitNumber = Number(router.query["fast-forward"]);

  if (hearts !== null && hearts < 0 && !correctAnswerShown) {
    return (
      <LessonFastForwardEndFail
        unitNumber={unitNumber}
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
      />
    );
  }

  if (
    hearts !== null &&
    hearts >= 0 &&
    !correctAnswerShown &&
    progressCount >= totalCorrectAnswersNeeded
  ) {
    return (
      <LessonFastForwardEndPass
        unitNumber={unitNumber}
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
      />
    );
  }

  if (hearts !== null && isStartingLesson) {
    return (
      <LessonFastForwardStart
        unitNumber={unitNumber}
        setIsStartingLesson={setIsStartingLesson}
      />
    );
  }

  if (progressCount >= totalCorrectAnswersNeeded && !correctAnswerShown) {
    return (
      <LessonComplete
        correctAnswerCount={correctAnswerCount}
        incorrectAnswerCount={incorrectAnswerCount}
        startTime={startTime}
        endTime={endTime}
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
      />
    );
  }

  const problemProps = {
    correctAnswerCount: progressCount,
    totalCorrectAnswersNeeded,
    quitMessageShown,
    correctAnswerShown,
    setQuitMessageShown,
    isAnswerCorrect,
    isAnswerSelected: checkAnswerSelected(problem, answerState),
    correctAnswer: correctResponse(problem),
    onCheckAnswer,
    onFinish,
    onSkip,
    hearts,
  };

  switch (problem.type) {
    case "SELECT_1_OF_3": {
      return (
        <ProblemSelect1Of3
          key={lessonProblem}
          {...problemProps}
          problem={problem}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
        />
      );
    }

    case "WRITE_IN_ENGLISH":
    case "WRITE_IN_TIBETAN": {
      return (
        <ProblemWriteInEnglish
          key={lessonProblem}
          {...problemProps}
          problem={problem}
          selectedAnswers={selectedAnswers}
          setSelectedAnswers={setSelectedAnswers}
        />
      );
    }

    case "INTRO_CHARACTER": {
      return (
        <IntroCharacter
          key={lessonProblem}
          {...problemProps}
          problem={problem}
        />
      );
    }

    case "SELECT_CHARACTER_FOR_SOUND": {
      return (
        <SelectCharacterForSound
          key={lessonProblem}
          {...problemProps}
          problem={problem}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
        />
      );
    }

    case "SELECT_SOUND_FOR_CHARACTER": {
      return (
        <SelectSoundForCharacter
          key={lessonProblem}
          {...problemProps}
          problem={problem}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
        />
      );
    }

    case "MATCH_PAIRS": {
      return (
        <MatchPairs
          key={lessonProblem}
          {...problemProps}
          problem={problem}
          selectedAnswers={selectedAnswers}
          setSelectedAnswers={setSelectedAnswers}
        />
      );
    }
  }
};
