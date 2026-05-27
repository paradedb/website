import { Badge } from "./Badge";

const IsometricStackIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" fill="none" {...props}>
    <path
      d="M17 25 32 33.5 17 42 2 33.5 17 25Z"
      fill="#E0E7FF"
      stroke="#4F46E5"
      strokeWidth="2.25"
      strokeLinejoin="round"
    />
    <path
      d="M2 33.5 17 42v17L2 50.5v-17Z"
      fill="#A5B4FC"
      stroke="#4F46E5"
      strokeWidth="2.25"
      strokeLinejoin="round"
    />
    <path
      d="M32 33.5 17 42v17l15-8.5v-17Z"
      fill="#818CF8"
      stroke="#4F46E5"
      strokeWidth="2.25"
      strokeLinejoin="round"
    />
    <path
      d="M47 25 62 33.5 47 42 32 33.5 47 25Z"
      fill="#E0E7FF"
      stroke="#4F46E5"
      strokeWidth="2.25"
      strokeLinejoin="round"
    />
    <path
      d="M32 33.5 47 42v17l-15-8.5v-17Z"
      fill="#A5B4FC"
      stroke="#4F46E5"
      strokeWidth="2.25"
      strokeLinejoin="round"
    />
    <path
      d="M62 33.5 47 42v17l15-8.5v-17Z"
      fill="#818CF8"
      stroke="#4F46E5"
      strokeWidth="2.25"
      strokeLinejoin="round"
    />
    <path
      d="M32 1.5 47 10 32 18.5 17 10 32 1.5Z"
      fill="#C7D2FE"
      stroke="#4F46E5"
      strokeWidth="2.25"
      strokeLinejoin="round"
    />
    <path
      d="M17 10 32 18.5v15L17 25V10Z"
      fill="#818CF8"
      stroke="#4F46E5"
      strokeWidth="2.25"
      strokeLinejoin="round"
    />
    <path
      d="M47 10 32 18.5v15L47 25V10Z"
      fill="#6366F1"
      stroke="#4F46E5"
      strokeWidth="2.25"
      strokeLinejoin="round"
    />
  </svg>
);

const ReliableDatastoreIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" fill="none" {...props}>
    <g transform="rotate(-45 32 32)">
      <circle cx="24" cy="32" r="18" fill="#C7D2FE" />
      <circle cx="40" cy="32" r="18" fill="#A5B4FC" />
      <path
        d="M32 15.9A18 18 0 0 1 32 48.1A18 18 0 0 1 32 15.9Z"
        fill="#4338CA"
        fillOpacity="0.62"
      />
      <circle
        cx="24"
        cy="32"
        r="18"
        fill="none"
        stroke="#4F46E5"
        strokeWidth="2.25"
      />
      <circle
        cx="40"
        cy="32"
        r="18"
        fill="none"
        stroke="#4F46E5"
        strokeWidth="2.25"
      />
    </g>
  </svg>
);

const textWallIcons = {
  stack: IsometricStackIcon,
  reliableDatastore: ReliableDatastoreIcon,
};

type TextWallRowData = {
  title: string;
  heading: string;
  body: string;
  icon: keyof typeof textWallIcons;
};

type TextWallRowProps = TextWallRowData & {
  solidTopDivider?: boolean;
};

const textWallRows = [
  {
    title: "Move faster with less",
    heading:
      "Adding search or analytics has always meant babysitting more production systems.",
    body: "What if operational data didn't have to be copied across a patchwork of services?",
    icon: "stack",
  },
  {
    title: "Any schema, any workload",
    heading:
      "Dedicated search engines were not built to handle relational data.",
    body: "ParadeDB is built as an extension on top of Postgres. This means it inherits Postgres' OLTP performance, ACID guarantees, and transaction safety.",
    icon: "reliableDatastore",
  },
] satisfies TextWallRowData[];

function TextWallRow({
  title,
  heading,
  body,
  icon,
  solidTopDivider = false,
}: TextWallRowProps) {
  const Icon = textWallIcons[icon];

  return (
    <div className="relative grid md:grid-cols-2">
      <div
        className={
          solidTopDivider
            ? "pointer-events-none absolute inset-x-0 top-0 h-px bg-[#d7d4cf] dark:bg-slate-800"
            : "pointer-events-none absolute inset-x-0 top-0 h-px bg-[repeating-linear-gradient(to_right,#d7d4cf_0_8px,transparent_8px_18px)] dark:bg-[repeating-linear-gradient(to_right,#1e293b_0_8px,transparent_8px_18px)]"
        }
      />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-[repeating-linear-gradient(to_bottom,#d7d4cf_0_8px,transparent_8px_18px)] dark:bg-[repeating-linear-gradient(to_bottom,#1e293b_0_8px,transparent_8px_18px)] md:block" />
      <div className="flex flex-col gap-6 px-6 pt-12 pb-16 sm:px-8 md:flex-row md:gap-8 md:px-12 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24">
        <Icon className="mt-1 size-10 shrink-0 sm:size-12" aria-hidden="true" />
        <h3 className="max-w-md text-3xl font-semibold leading-tight tracking-tighter sm:text-4xl">
          {title}
        </h3>
      </div>

      <div className="relative px-6 pt-12 pb-16 sm:px-8 md:px-12 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[repeating-linear-gradient(to_right,#d7d4cf_0_8px,transparent_8px_18px)] dark:bg-[repeating-linear-gradient(to_right,#1e293b_0_8px,transparent_8px_18px)] md:hidden" />
        <h4 className="max-w-2xl text-xl font-medium leading-tight tracking-tighter sm:text-2xl">
          {heading}
        </h4>
        <p className="mt-6 max-w-2xl text-xl font-medium leading-tight tracking-tighter text-[#77736d] dark:text-slate-400 sm:text-2xl">
          {body}
        </p>
      </div>
    </div>
  );
}

export default function TextWall() {
  return (
    <section className="w-full bg-[#ebe9e5] text-[#1d1d1b] dark:bg-slate-950 dark:text-white">
      <div className="relative mx-auto max-w-[1440px] px-4 md:px-12">
        <div className="absolute inset-y-0 left-4 z-30 w-px bg-[#d7d4cf] pointer-events-none dark:bg-slate-800 md:left-12" />
        <div className="absolute inset-y-0 right-4 z-30 w-px bg-[#d7d4cf] pointer-events-none dark:bg-slate-800 md:right-12" />

        <div className="px-6 pt-20 pb-8 sm:px-8 sm:pt-24 md:px-12 md:pt-28 lg:pt-32">
          <Badge className="mb-6">Benefits</Badge>
          <h2 className="homepage-section-title max-w-5xl text-3xl leading-[1.02] md:text-6xl">
            Focus on <span className="text-highlight-blink">building features</span>,<br/>not ETL pipelines.
          </h2>
        </div>

        {textWallRows.map((row, index) => (
          <TextWallRow
            key={row.title}
            {...row}
            solidTopDivider={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
