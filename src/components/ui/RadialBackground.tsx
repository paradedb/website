import classNameFunc from "classnames";

export default function RadialBackground({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={classNameFunc(
        "mask pointer-events-none absolute -z-10 select-none bg-indigo-200 bg-opacity-70",
        className,
      )}
      aria-hidden="true"
    ></div>
  );
}
