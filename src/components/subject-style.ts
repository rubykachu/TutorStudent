import { BookOpen, Calculator, Globe, type LucideIcon } from "lucide-react";
import type { Subject } from "@/schema/content";

type SubjectColor = Subject["color"];

// Keyed by the subject's colour token, the closed set a subject may use, so
// adding a colour to the schema fails type-checking here until it is styled.
// Class names are spelled out in full because Tailwind only generates
// utilities it can find as literal strings in the source.
export const SUBJECT_STYLES: Readonly<
  Record<SubjectColor, { bg: string; text: string; icon: LucideIcon }>
> = {
  math: {
    bg: "bg-subject-math",
    text: "text-subject-math",
    icon: Calculator,
  },
  literature: {
    bg: "bg-subject-literature",
    text: "text-subject-literature",
    icon: BookOpen,
  },
  geography: {
    bg: "bg-subject-geography",
    text: "text-subject-geography",
    icon: Globe,
  },
};
