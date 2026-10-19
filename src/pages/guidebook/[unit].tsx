import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { AudioButton } from "~/components/lesson/LessonShell";
import { CloseSvg } from "~/components/Svgs";
import { getTibetanUnitGuide } from "~/courses/tibetan/lessons";
import { tibetanUnits } from "~/courses/tibetan/units";
import { useTibetanAudio } from "~/utils/playTibetanAudio";

/** Key letters and phrases for a Tibetan unit, like Duolingo's guidebook. */
const Guidebook: NextPage = () => {
  const router = useRouter();
  const audio = useTibetanAudio();
  const unitNumber = Number(router.query.unit);
  const unit = tibetanUnits.find((u) => u.unitNumber === unitNumber);

  if (!router.isReady) return null;

  if (!unit) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-gray-500">Unit not found</p>
        <Link href="/learn" className="font-bold uppercase text-blue-400">
          Back to learning
        </Link>
      </main>
    );
  }

  const { characters, words, sentences } = getTibetanUnitGuide(unitNumber);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-4 py-6">
      <header className="flex items-center gap-4">
        <Link href="/learn" className="text-gray-400">
          <CloseSvg />
          <span className="sr-only">Back to learning</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-700">
            Unit {unit.unitNumber} guidebook
          </h1>
          <p className="text-gray-500">{unit.description}</p>
        </div>
      </header>

      {characters.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-gray-700">Letters</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {characters.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-2xl border-2 border-gray-200 p-3"
              >
                {audio.enabled && (
                  <AudioButton size="sm" onClick={() => audio.play(c.id)} />
                )}
                <span className="font-tibetan text-4xl" lang="bo">
                  {c.char}
                </span>
                <span className="font-bold text-gray-500">{c.phonetic}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {words.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-gray-700">Key words</h2>
          <ul className="flex flex-col divide-y-2 divide-gray-100 rounded-2xl border-2 border-gray-200">
            {words.map((w) => (
              <PhraseRow
                key={w.id}
                tibetan={w.tibetan}
                phonetic={w.phonetic}
                english={w.english}
                onPlay={audio.enabled ? () => audio.play(w.id) : undefined}
              />
            ))}
          </ul>
        </section>
      )}

      {sentences.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-gray-700">Key phrases</h2>
          <ul className="flex flex-col divide-y-2 divide-gray-100 rounded-2xl border-2 border-gray-200">
            {sentences.map((s) => (
              <PhraseRow
                key={s.id}
                tibetan={s.tibetan}
                phonetic={s.phonetic}
                english={s.english}
                onPlay={audio.enabled ? () => audio.play(s.id) : undefined}
              />
            ))}
          </ul>
        </section>
      )}
    </main>
  );
};

export default Guidebook;

const PhraseRow = ({
  tibetan,
  phonetic,
  english,
  onPlay,
}: {
  tibetan: string;
  phonetic: string;
  english: string;
  onPlay?: () => void;
}) => (
  <li className="flex items-center gap-4 p-4">
    {onPlay && <AudioButton size="sm" onClick={onPlay} />}
    <div className="flex flex-col">
      <span className="font-tibetan text-2xl text-gray-700" lang="bo">
        {tibetan}
      </span>
      <span className="text-sm text-gray-400">{phonetic}</span>
    </div>
    <span className="ml-auto text-right text-gray-600">{english}</span>
  </li>
);
