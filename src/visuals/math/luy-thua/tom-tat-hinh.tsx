import { PowerText } from "@/visuals/shared/power-text";
import { CubeBlocks, SquareTiles } from "./blocks";

// The names side by side: a² as a square of tiles ("bình phương") next to a³
// as a cube of small cubes ("lập phương").
export function SquareAndCube({ side }: { side: number }) {
  const items = [
    {
      exponent: 2,
      name: `${side} bình phương`,
      picture: (
        <SquareTiles
          side={side}
          label={`Hình vuông cạnh ${side}, có ${side ** 2} ô`}
        />
      ),
    },
    {
      exponent: 3,
      name: `${side} lập phương`,
      picture: (
        <CubeBlocks
          side={side}
          label={`Hình lập phương cạnh ${side}, có ${side ** 3} khối nhỏ`}
        />
      ),
    },
  ];
  return (
    <div className="flex justify-center gap-x-4 md:gap-x-10">
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
              base={side}
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
