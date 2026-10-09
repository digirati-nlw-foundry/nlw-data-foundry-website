import { type ReactNode, useId } from "react";
import "../blocks.css";

/** Shared block frame: opts out of host prose styles and adds the eyebrow heading. */
export function Section({
  children,
  className = "",
  title,
}: {
  children: ReactNode;
  className?: string;
  title: string;
}) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className={`dsb not-prose ${className}`.trim()}
    >
      <h2 className="dsb-title" id={id}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Empty({ message }: { message: string }) {
  return <p className="dsb-empty">{message}</p>;
}
