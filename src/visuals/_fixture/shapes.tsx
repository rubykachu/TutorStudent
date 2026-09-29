import { ConceptShape } from "@/visuals/shared/concept-mark";

// Region ids must match the `regions` declared for this visual in the registry.
// Each region is drawn in the concept colour whose marker is that shape.
export default function Shapes() {
  return (
    <svg
      role="img"
      aria-label="Một hình tròn, một hình vuông và một hình tam giác"
      viewBox="0 0 300 100"
      className="h-auto w-full max-w-96"
    >
      <ConceptShape data-region="circle" color="blue" cx={50} cy={50} r={40} />
      <ConceptShape
        data-region="square"
        color="amber"
        cx={150}
        cy={50}
        r={45}
      />
      <ConceptShape
        data-region="triangle"
        color="violet"
        cx={250}
        cy={50}
        r={42}
      />
    </svg>
  );
}
