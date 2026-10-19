export type TibetanDialect = {
  id: "utsang" | "kham" | "amdo";
  name: string;
  tibetan: string;
  /** Tile color in the home-page dialect bar. */
  backgroundColor: `bg-${string}`;
  /** Only dialects with lessons can be started; the course teaches Lhasa (Ü-Tsang). */
  available: boolean;
};

export const tibetanDialects: readonly TibetanDialect[] = [
  {
    id: "utsang",
    name: "Ü-Tsang",
    tibetan: "དབུས་གཙང་",
    backgroundColor: "bg-[#1cb0f6]",
    available: true,
  },
  {
    id: "kham",
    name: "Kham",
    tibetan: "ཁམས་",
    backgroundColor: "bg-[#ff4b4b]",
    available: false,
  },
  {
    id: "amdo",
    name: "Amdo",
    tibetan: "ཨ་མདོ་",
    backgroundColor: "bg-[#58cc02]",
    available: false,
  },
];
