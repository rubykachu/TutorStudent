import { PowerText } from "@/visuals/shared/power-text";
import { CubeBlocks, SquareTiles } from "./blocks";

const SIDE = 3;

// Recap of the names: 3² as a square of tiles ("bình phương") next to 3³ as
// a cube of small cubes ("lập phương").
export default function TomTatHinh() {
  const items = [
    {
      exponent: 2,
      name: "3 bình phương",
      picture: <SquareTiles side={SIDE} label="Hình vuông cạnh 3, có 9 ô" />,
    },
    {
      exponent: 3,
      name: "3 lập phương",
      picture: (
        <CubeBlocks
          side={SIDE}
          label="Hình lập phương cạnh 3, có 27 khối nhỏ"
        />
      ),
    },
  ];
  return (
    <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
      {items.map((item) => (
        <figure
          key={item.exponent}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-36 md:w-44 [&>svg]:h-auto [&>svg]:w-full">
            {item.picture}
          </div>
          <figcaption className="flex flex-col items-center">
            <PowerText
              base={SIDE}
              exponent={item.exponent}
              className="font-heading text-title font-bold md:text-title-lg"
            />
            <span className="text-body md:text-body-lg">{item.name}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
