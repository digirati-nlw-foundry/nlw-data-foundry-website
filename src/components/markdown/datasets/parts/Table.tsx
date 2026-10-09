import type { ReactNode } from "react";

export type Column = { label: string; numeric?: boolean };

export function Table({
  children,
  columns,
  label,
}: {
  children: ReactNode;
  columns: Column[];
  label: string;
}) {
  return (
    <div className="dsb-table-wrap">
      <table aria-label={label}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                className={column.numeric ? "dsb-num" : undefined}
                key={column.label}
                scope="col"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
