import {
  Atom,
  Compass,
  Gem,
  type LucideIcon,
  Moon,
  Orbit,
  Rocket,
  Satellite,
  Sparkles,
  Sprout,
  Star,
  Sun,
  Telescope,
} from "lucide-react";

// One space-themed icon per grade, from a seedling at grade 1 to a telescope
// at grade 12 (the order follows `GRADES`); a grade past the list falls back
// to a star.
const GRADE_ICONS: readonly LucideIcon[] = [
  Sprout,
  Star,
  Moon,
  Sun,
  Rocket,
  Orbit,
  Satellite,
  Sparkles,
  Atom,
  Compass,
  Gem,
  Telescope,
];

export function gradeIcon(grade: number): LucideIcon {
  return GRADE_ICONS[grade - 1] ?? Star;
}
