import {
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from "react";
export default function LegalArticle({
  headings,
  children,
}: {
  headings: string[];
  children: ReactNode;
}) {
  let index = 0;
  return (
    <div className="kr-legal-grid">
      <nav className="kr-legal-nav" aria-label="Daftar isi">
        <p className="kr-eyebrow mb-5">Dalam halaman ini</p>
        <ol className="space-y-4 text-xs kr-muted">
          {headings.map((h, i) => (
            <li key={h}>
              <a href={"#bagian-" + (i + 1)}>
                {i + 1}. {h}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <article className="space-y-9 text-sm leading-7 text-foreground/70">
        {Children.map(children, (c) => {
          if (isValidElement(c) && c.type === "section") {
            index++;
            return cloneElement(
              c as ReactElement<{ id?: string; className?: string }>,
              { id: "bagian-" + index, className: "scroll-mt-28" },
            );
          }
          return c;
        })}
      </article>
    </div>
  );
}
