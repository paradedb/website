type Row = {
  label: string;
  color: string;
  values: (string | number)[];
};

export function PerformanceTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: Row[];
}) {
  const gridTemplateColumns = `1.4fr repeat(${columns.length - 1}, 1fr)`;
  const minWidth = Math.max(680, columns.length * 110);

  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-neutral-200 bg-white text-sm dark:border-slate-800 dark:bg-slate-950">
      <div style={{ minWidth: `${minWidth}px` }}>
        <div
          className="grid border-b border-neutral-200 bg-neutral-50 px-4 py-2 font-mono text-xs uppercase tracking-wide text-neutral-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
          style={{ gridTemplateColumns }}
        >
          {columns.map((col) => (
            <div key={col}>{col}</div>
          ))}
        </div>
        {rows.map((row, i) => {
          const isLast = i === rows.length - 1;
          return (
            <div
              key={row.label}
              className={
                isLast
                  ? "grid items-center px-4 py-3 font-mono"
                  : "grid items-center border-b border-neutral-100 px-4 py-3 font-mono dark:border-slate-800"
              }
              style={{ gridTemplateColumns }}
            >
              <div className="font-semibold" style={{ color: row.color }}>
                {row.label}
              </div>
              {row.values.map((v, j) => (
                <div key={j} className="tabular-nums">
                  {v}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
