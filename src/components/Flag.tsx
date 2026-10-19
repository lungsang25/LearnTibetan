import type { StaticImageData } from "next/image";
import _flagsSvg from "../../public/flags.svg";
import _tibetFlagSvg from "../../public/flags/tibet.svg";
import type { Language } from "~/utils/languages";

const flagsSvg = _flagsSvg as StaticImageData;
const tibetFlagSvg = _tibetFlagSvg as StaticImageData;

export const Flag = ({
  language,
  width = 84,
}: {
  language: Language;
  width?: number;
}) => {
  const height = width * (19.3171 / 24);
  // The flag sprite has no Tibetan flag, so it has its own file.
  if (language.code === "bo") {
    return (
      <svg viewBox="0 0 82 66" style={{ height, width }}>
        <image href={tibetFlagSvg.src} width="82" height="66"></image>
      </svg>
    );
  }
  return (
    <svg viewBox={language.viewBox} style={{ height, width }}>
      <image
        height={flagsSvg.height}
        href={flagsSvg.src}
        width={flagsSvg.width}
      ></image>
    </svg>
  );
};
