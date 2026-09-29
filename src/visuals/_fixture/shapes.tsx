import { ConceptShape } from "@/visuals/shared/concept-mark";
import { Region, RegionSvg } from "@/visuals/shared/region";

// Region ids must match the `regions` declared for this visual in the registry.
// Each region is drawn in the concept colour whose marker is that shape, and
// the shapes sit far enough apart that their tap rings never touch.
export default function Shapes() {
  return (
    <RegionSvg
      label="Một hình tròn, một hình vuông và một hình tam giác"
      viewBox="0 0 360 100"
      className="h-auto w-full max-w-md"
    >
      <Region id="circle" label="Hình tròn">
        <ConceptShape color="blue" cx={60} cy={50} r={40} />
      </Region>
      <Region id="square" label="Hình vuông">
        <ConceptShape color="amber" cx={180} cy={50} r={45} />
      </Region>
      <Region id="triangle" label="Hình tam giác">
        <ConceptShape color="violet" cx={300} cy={50} r={42} />
      </Region>
    </RegionSvg>
  );
}
