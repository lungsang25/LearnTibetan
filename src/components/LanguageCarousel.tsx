import Link from "next/link";
import React from "react";
import type { TibetanDialect } from "~/courses/tibetan/dialects";
import { tibetanDialects } from "~/courses/tibetan/dialects";
import { useBoundStore } from "~/hooks/useBoundStore";
import languages from "~/utils/languages";

const tibetan = languages.find((language) => language.code === "bo");

/** Home-page bar listing the three Tibetan dialect regions. */
export const LanguageCarousel = () => {
  return (
    <article className="absolute bottom-0 left-0 right-0 hidden h-20 items-center justify-center bg-[#0a4a82] text-white md:flex">
      <div className="flex w-full max-w-5xl items-center justify-center gap-16">
        {tibetanDialects.map((dialect) => (
          <DialectItem key={dialect.id} dialect={dialect} />
        ))}
      </div>
    </article>
  );
};

const DialectItem = ({ dialect }: { dialect: TibetanDialect }) => {
  const setLanguage = useBoundStore((x) => x.setLanguage);

  const content = (
    <>
      <span
        className={`flex h-10 min-w-[48px] items-center justify-center rounded-lg border-2 border-b-4 border-white px-2 font-tibetan text-base ${dialect.backgroundColor}`}
        lang="bo"
      >
        {dialect.tibetan}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-bold uppercase">{dialect.name}</span>
        {!dialect.available && (
          <span className="text-xs font-bold uppercase text-white/50">
            Coming soon
          </span>
        )}
      </span>
    </>
  );

  if (!dialect.available || !tibetan) {
    return (
      <div className="flex items-center gap-3 opacity-60" aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link
      className="flex items-center gap-3 transition hover:brightness-110"
      href="/learn"
      onClick={() => setLanguage(tibetan)}
    >
      {content}
    </Link>
  );
};
