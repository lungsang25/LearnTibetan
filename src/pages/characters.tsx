import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { BottomBar } from "~/components/BottomBar";
import { LeftBar } from "~/components/LeftBar";
import { RightBar } from "~/components/RightBar";
import { TopBar } from "~/components/TopBar";
import type { TibetanCharacter } from "~/courses/tibetan/alphabet";
import { consonants, punctuation, vowels } from "~/courses/tibetan/alphabet";
import { MASTERED_STRENGTH } from "~/courses/tibetan/generateCharacterPractice";
import { useBoundStore } from "~/hooks/useBoundStore";
import { useTibetanAudio } from "~/utils/playTibetanAudio";

/** Duolingo-style "Characters" tab for the Tibetan course. */
const Characters: NextPage = () => {
  const router = useRouter();
  const languageCode = useBoundStore((x) => x.language.code);

  // The tab only exists for Tibetan.
  useEffect(() => {
    if (languageCode !== "bo") void router.replace("/learn");
  }, [languageCode, router]);

  if (languageCode !== "bo") return null;

  return (
    <>
      <TopBar />
      <LeftBar selectedTab="Characters" />
      <div className="flex justify-center gap-3 pt-14 sm:p-6 sm:pt-10 md:ml-24 lg:ml-64 lg:gap-12">
        <div className="flex w-full max-w-2xl flex-col gap-10 px-4 py-6 sm:px-0">
          <header className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-3xl font-bold text-gray-700">
              Let’s learn Tibetan letters!
            </h1>
            <p className="text-lg text-gray-500">
              Get to know the 30 consonants and 4 vowel signs of the Tibetan
              alphabet.
            </p>
            <Link
              href="/lesson?characters"
              className="mt-2 w-full rounded-2xl border-b-4 border-green-600 bg-green-500 p-3 text-center font-bold uppercase text-white transition hover:brightness-105 sm:w-80"
            >
              Learn the letters
            </Link>
          </header>

          <CharacterSection
            title="Consonants"
            subtitle="ཀ་ཁ་ག་ང་ · read left to right, 4 per row"
            characters={consonants}
          />
          <CharacterSection
            title="Vowel signs"
            subtitle="Written above or below a letter, shown here on ཨ"
            characters={vowels}
          />
          <CharacterSection
            title="Punctuation"
            subtitle="Marks between syllables and sentences"
            characters={punctuation}
            showStrength={false}
          />
        </div>
        <RightBar />
      </div>
      <div className="pt-[90px]"></div>
      <BottomBar selectedTab="Characters" />
    </>
  );
};

export default Characters;

const CharacterSection = ({
  title,
  subtitle,
  characters,
  showStrength = true,
}: {
  title: string;
  subtitle: string;
  characters: TibetanCharacter[];
  showStrength?: boolean;
}) => {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
        <p className="text-gray-400">{subtitle}</p>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            showStrength={showStrength}
          />
        ))}
      </div>
    </section>
  );
};

const CharacterCard = ({
  character,
  showStrength,
}: {
  character: TibetanCharacter;
  showStrength: boolean;
}) => {
  const strength = useBoundStore((x) => x.characterStrength[character.id] ?? 0);
  const audio = useTibetanAudio();
  const mastered = strength >= MASTERED_STRENGTH;

  return (
    <button
      className={[
        "flex flex-col items-center gap-1 rounded-2xl border-2 border-b-4 px-1 pb-3 pt-2 transition hover:bg-gray-100",
        mastered ? "border-yellow-400" : "border-gray-200",
      ].join(" ")}
      onClick={() => audio.play(character.id)}
      title={character.note}
    >
      <span
        className="font-tibetan text-4xl text-gray-700 sm:text-5xl"
        lang="bo"
      >
        {character.char}
      </span>
      <span className="text-sm font-bold text-gray-400">
        {character.phonetic}
      </span>
      {showStrength && (
        <div
          className="h-2 w-3/4 rounded-full bg-gray-200"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={strength}
          aria-label={`${character.phonetic} strength`}
        >
          <div
            className={[
              "h-full rounded-full transition-all",
              mastered ? "bg-yellow-400" : "bg-[#1cb0f6]",
            ].join(" ")}
            style={{ width: `${strength * 100}%` }}
          ></div>
        </div>
      )}
    </button>
  );
};
