import { Fragment, type ReactNode } from "react";

/* Lightweight inline formatter: **bold** and `code`. */
export function formatInline(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(<Fragment key={i++}>{text.slice(last, m.index)}</Fragment>);
    const tok = m[0];
    if (tok.startsWith("**")) {
      nodes.push(
        <strong key={i++} className="font-semibold text-light">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else {
      nodes.push(
        <code key={i++} className="rounded bg-ink-deep/70 px-[5px] py-[1px] font-mono text-[0.9em] text-gold">
          {tok.slice(1, -1)}
        </code>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(<Fragment key={i++}>{text.slice(last)}</Fragment>);
  return nodes;
}
