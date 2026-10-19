import { type AppType } from "next/dist/shared/lib/utils";
import localFont from "next/font/local";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useBoundStore, useHasHydrated } from "~/hooks/useBoundStore";

import "~/styles/globals.css";

// Tibetan-script subset of Noto Serif Tibetan (see src/fonts/README.md). The
// unicode-range keeps Latin text on the system font, and the browser only
// downloads the file on pages that actually show Tibetan.
const tibetanFont = localFont({
  src: "../fonts/NotoSerifTibetan-Tibetan.woff2",
  weight: "100 900",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0F00-0FFF, U+25CC" }],
});

/** Pages that don't read saved progress and can render before it loads. */
const staticPages = ["/", "/register", "/forgot-password"];

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  const hasHydrated = useHasHydrated();

  useEffect(() => {
    void useBoundStore.persist.rehydrate();
  }, []);

  return (
    <>
      <Head>
        <title>Tiblingo</title>
        <meta
          name="description"
          content="Tiblingo: the free, fun way to learn Tibetan"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0A0" />
        <link rel="manifest" href="/app.webmanifest" />
      </Head>
      <style jsx global>{`
        :root {
          --font-tibetan: ${tibetanFont.style.fontFamily};
        }
      `}</style>
      {hasHydrated || staticPages.includes(router.pathname) ? (
        <Component {...pageProps} />
      ) : null}
    </>
  );
};

export default MyApp;
