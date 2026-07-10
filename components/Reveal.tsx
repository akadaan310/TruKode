"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

type RevealProps = {
  /** Element to render (default: div) */
  as?: ElementType;
  /** transition-delay in seconds, mirrors the staggered reveals in the design */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  id?: string;
};

/**
 * Scroll-reveal wrapper. Replicates the original `[data-reveal]` +
 * IntersectionObserver behaviour: fades/rises in when scrolled into view,
 * with a 2.2s fallback so nothing stays hidden.
 */
export function Reveal({
  as,
  delay = 0,
  className = "",
  style,
  children,
  ...rest
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.classList.add("tk-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("tk-in");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);

    const fallback = window.setTimeout(() => el.classList.add("tk-in"), 2200);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`tk-reveal ${className}`.trim()}
      style={{
        transitionDelay: delay ? `${delay}s` : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
