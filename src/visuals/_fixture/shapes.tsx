// Region ids must match the `regions` declared for this visual in the registry.
export default function Shapes() {
  return (
    <svg
      role="img"
      aria-label="Một hình tròn, một hình vuông và một hình tam giác"
      viewBox="0 0 300 100"
      className="h-auto w-full max-w-96"
    >
      <circle
        data-region="circle"
        cx={50}
        cy={50}
        r={40}
        className="fill-concept-blue"
      />
      <rect
        data-region="square"
        x={110}
        y={10}
        width={80}
        height={80}
        className="fill-concept-violet"
      />
      <polygon
        data-region="triangle"
        points="250,10 290,90 210,90"
        className="fill-concept-teal"
      />
    </svg>
  );
}
