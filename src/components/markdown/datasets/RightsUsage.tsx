import { getDatasetRights } from "./data";
import { useDatasetBlockLanguage, useDatasetBlockText } from "./i18n";
import { Section } from "./parts/Section";
import type { DatasetBlockProps } from "./types";

const isUrl = (value: string) => /^https?:\/\/\S+$/.test(value);
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function Linkify({ value }: { value: string }) {
  if (isUrl(value)) {
    return (
      <a href={value} rel="noreferrer noopener">
        {value}
      </a>
    );
  }
  if (isEmail(value)) {
    return <a href={`mailto:${value}`}>{value}</a>;
  }
  return <>{value}</>;
}

function WarningIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}

export function RightsUsage({
  frontmatter,
  language: languageProp,
}: DatasetBlockProps) {
  const language = useDatasetBlockLanguage(languageProp);
  const text = useDatasetBlockText(language);
  const rights = getDatasetRights(frontmatter);

  return (
    <Section className="dsb-rights" title={text("rightsUsage")}>
      <div>
        <h3>{text("license")}</h3>
        <p>
          {rights.license ? (
            <Linkify value={rights.license} />
          ) : (
            <span className="dsb-muted">{text("noLicense")}</span>
          )}
        </p>
      </div>

      {rights.reuseGuidance ? (
        <div>
          <h3>{text("reuseGuidance")}</h3>
          <p>{rights.reuseGuidance}</p>
        </div>
      ) : null}

      {rights.citation ? (
        <div>
          <h3>{text("citation")}</h3>
          <blockquote className="dsb-quote">{rights.citation}</blockquote>
        </div>
      ) : null}

      {rights.contact ? (
        <div>
          <h3>{text("contact")}</h3>
          <p>
            <Linkify value={rights.contact} />
          </p>
        </div>
      ) : null}

      {rights.sensitivityNotice ? (
        <div className="dsb-notice" role="note">
          <WarningIcon />
          <div>
            <h3>{text("sensitivityNotice")}</h3>
            <p>{rights.sensitivityNotice}</p>
          </div>
        </div>
      ) : null}
    </Section>
  );
}
