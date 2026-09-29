import { ConceptShape } from "@/visuals/shared/concept-mark";

export default function StarSticker() {
  return (
    <svg
      role="img"
      aria-label="Ngôi sao"
      viewBox="0 0 100 100"
      className="h-auto w-full max-w-32"
    >
      <ConceptShape color="lime" cx={50} cy={52} r={46} />
    </svg>
  );
}
