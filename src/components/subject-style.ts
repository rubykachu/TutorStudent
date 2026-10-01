import {
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import type { Subject } from "@/schema/content";

type SubjectColor = Subject["color"];
type SubjectIcon = Subject["icon"];

// Keyed by the palette token and icon name a subject picks in
// content/subjects.json, the closed sets of the schema, so adding one to the
// schema fails type-checking here until it is styled. Class names are
// spelled out in full because Tailwind only generates utilities it can find
// as literal strings in the source.
const COLOR_CLASSES: Readonly<
  Record<SubjectColor, { bg: string; text: string; border: string }>
> = {
  blue: {
    bg: "bg-subject-blue",
    text: "text-subject-blue",
    border: "border-subject-blue",
  },
  terracotta: {
    bg: "bg-subject-terracotta",
    text: "text-subject-terracotta",
    border: "border-subject-terracotta",
  },
  teal: {
    bg: "bg-subject-teal",
    text: "text-subject-teal",
    border: "border-subject-teal",
  },
  amber: {
    bg: "bg-subject-amber",
    text: "text-subject-amber",
    border: "border-subject-amber",
  },
  violet: {
    bg: "bg-subject-violet",
    text: "text-subject-violet",
    border: "border-subject-violet",
  },
};

const ICONS: Readonly<Record<SubjectIcon, LucideIcon>> = {
  calculator: Calculator,
  "book-open": BookOpen,
  globe: Globe,
  landmark: Landmark,
  "flask-conical": FlaskConical,
};

export function subjectStyle(subject: Pick<Subject, "color" | "icon">) {
  return { ...COLOR_CLASSES[subject.color], icon: ICONS[subject.icon] };
}
