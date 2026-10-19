import type { Unit } from "~/utils/units";

export const tibetanUnits: readonly Unit[] = [
  {
    unitNumber: 1,
    description: "Learn the letters ཀ – མ",
    backgroundColor: "bg-[#58cc02]",
    textColor: "text-[#58cc02]",
    borderColor: "border-[#46a302]",
    tiles: [
      { type: "star", description: "Letters ཀ ཁ ག ང", lessonId: "letters-1" },
      { type: "star", description: "Letters ཅ ཆ ཇ ཉ", lessonId: "letters-2" },
      { type: "treasure" },
      { type: "book", description: "Letters ཏ ཐ ད ན", lessonId: "letters-3" },
      { type: "star", description: "Letters པ ཕ བ མ", lessonId: "letters-4" },
      { type: "trophy", description: "Unit 1 review", lessonId: "review-1" },
    ],
  },
  {
    unitNumber: 2,
    description: "Letters ཙ – ཨ and vowel signs",
    backgroundColor: "bg-[#ce82ff]",
    textColor: "text-[#ce82ff]",
    borderColor: "border-[#a568cc]",
    tiles: [
      {
        type: "fast-forward",
        description: "Letters ཙ ཚ ཛ ཝ",
        lessonId: "letters-5",
      },
      { type: "star", description: "Letters ཞ ཟ འ ཡ", lessonId: "letters-6" },
      { type: "book", description: "Letters ར ལ ཤ ས", lessonId: "letters-7" },
      { type: "treasure" },
      { type: "star", description: "Letters ཧ ཨ", lessonId: "letters-8" },
      {
        type: "dumbbell",
        description: "Vowel signs ཨི ཨུ ཨེ ཨོ",
        lessonId: "vowels-1",
      },
      { type: "trophy", description: "Unit 2 review", lessonId: "review-2" },
    ],
  },
  {
    unitNumber: 3,
    description: "Greet people, introduce yourself",
    backgroundColor: "bg-[#00cd9c]",
    textColor: "text-[#00cd9c]",
    borderColor: "border-[#00a47d]",
    tiles: [
      {
        type: "fast-forward",
        description: "Hello and thank you",
        lessonId: "greetings",
      },
      { type: "star", description: "I and you", lessonId: "pronouns" },
      { type: "treasure" },
      { type: "book", description: "Introduce yourself", lessonId: "intro" },
      {
        type: "dumbbell",
        description: "Personalized practice",
        lessonId: "practice-3",
      },
      { type: "trophy", description: "Unit 3 review", lessonId: "review-3" },
    ],
  },
  {
    unitNumber: 4,
    description: "Family, food and numbers",
    backgroundColor: "bg-[#ff9600]",
    textColor: "text-[#ff9600]",
    borderColor: "border-[#cc7900]",
    tiles: [
      { type: "fast-forward", description: "Family", lessonId: "family" },
      { type: "star", description: "Food and drink", lessonId: "food" },
      { type: "treasure" },
      { type: "book", description: "Numbers 1 – 5", lessonId: "numbers" },
      { type: "trophy", description: "Unit 4 review", lessonId: "review-4" },
    ],
  },
];
