export type TibetanCharacterKind = "consonant" | "vowel" | "punctuation";

export type TibetanCharacter = {
  /** Stable key, also used as the audio filename: public/audio/tibetan/<id>.mp3 */
  id: string;
  char: string;
  phonetic: string;
  kind: TibetanCharacterKind;
  /** Row in the traditional grid (consonants are taught 4 per row). */
  row: number;
  note?: string;
};

const consonantRows: [string, string, string?][][] = [
  [
    ["ka", "ཀ"],
    ["kha", "ཁ"],
    ["ga", "ག"],
    ["nga", "ང"],
  ],
  [
    ["ca", "ཅ"],
    ["cha", "ཆ"],
    ["ja", "ཇ"],
    ["nya", "ཉ"],
  ],
  [
    ["ta", "ཏ"],
    ["tha", "ཐ"],
    ["da", "ད"],
    ["na", "ན"],
  ],
  [
    ["pa", "པ"],
    ["pha", "ཕ"],
    ["ba", "བ"],
    ["ma", "མ"],
  ],
  [
    ["tsa", "ཙ"],
    ["tsha", "ཚ"],
    ["dza", "ཛ"],
    ["wa", "ཝ"],
  ],
  [
    ["zha", "ཞ"],
    ["za", "ཟ"],
    ["achung", "འ", "'a"],
    ["ya", "ཡ"],
  ],
  [
    ["ra", "ར"],
    ["la", "ལ"],
    ["sha", "ཤ"],
    ["sa", "ས"],
  ],
  [
    ["ha", "ཧ"],
    ["a", "ཨ"],
  ],
];

export const consonants: TibetanCharacter[] = consonantRows.flatMap(
  (row, rowIndex) =>
    row.map(([id, char, phonetic]) => ({
      id,
      char,
      phonetic: phonetic ?? id,
      kind: "consonant" as const,
      row: rowIndex,
    })),
);

export const vowels: TibetanCharacter[] = [
  { id: "vowel-i", char: "ཨི", phonetic: "i", note: "gigu  ི" },
  { id: "vowel-u", char: "ཨུ", phonetic: "u", note: "zhabkyu  ུ" },
  { id: "vowel-e", char: "ཨེ", phonetic: "e", note: "drengbu  ེ" },
  { id: "vowel-o", char: "ཨོ", phonetic: "o", note: "naro  ོ" },
].map((vowel) => ({ ...vowel, kind: "vowel" as const, row: 0 }));

export const punctuation: TibetanCharacter[] = [
  {
    id: "tsheg",
    char: "་",
    phonetic: "tsheg",
    note: "Separates syllables",
  },
  {
    id: "shad",
    char: "།",
    phonetic: "shad",
    note: "Ends a sentence or clause",
  },
].map((mark) => ({ ...mark, kind: "punctuation" as const, row: 0 }));

export const allCharacters: TibetanCharacter[] = [
  ...consonants,
  ...vowels,
  ...punctuation,
];

export const characterById = (id: string): TibetanCharacter => {
  const character = allCharacters.find((c) => c.id === id);
  if (!character) throw new Error(`Unknown Tibetan character: ${id}`);
  return character;
};
