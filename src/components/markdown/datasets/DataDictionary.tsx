import { getDataDictionaries } from "./data";
import { useDatasetBlockLanguage, useDatasetBlockText } from "./i18n";
import { Empty, Section } from "./parts/Section";
import { Table } from "./parts/Table";
import type { DatasetBlockProps } from "./types";

export function DataDictionary({
  frontmatter,
  language: languageProp,
}: DatasetBlockProps) {
  const language = useDatasetBlockLanguage(languageProp);
  const text = useDatasetBlockText(language);
  const entries = getDataDictionaries(frontmatter);

  return (
    <Section title={text("dataDictionary")}>
      {entries.length === 0 ? (
        <Empty message={text("noSchema")} />
      ) : (
        <div>
          {entries.map((entry) => {
            const columns = Object.entries(entry.schema);
            return (
              <details
                key={entry.filename}
                open={entries.length === 1 ? true : undefined}
              >
                <summary>
                  <span className="dsb-mono">{entry.filename}</span>
                  <span className="dsb-muted">
                    {text.count("columns", columns.length)}
                  </span>
                </summary>
                <div className="dsb-panel">
                  {entry.tableIdentifier ? (
                    <p className="dsb-muted">
                      {text("queryableTable")}:{" "}
                      <code className="dsb-mono">{entry.tableIdentifier}</code>
                    </p>
                  ) : null}
                  <Table
                    columns={[
                      { label: text("columnName") },
                      { label: text("dataType") },
                    ]}
                    label={entry.filename}
                  >
                    {columns.map(([column, type]) => (
                      <tr key={column}>
                        <td className="dsb-mono">{column}</td>
                        <td>
                          <span className="dsb-badge">{type}</span>
                        </td>
                      </tr>
                    ))}
                  </Table>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </Section>
  );
}
