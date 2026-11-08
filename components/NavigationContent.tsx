import React, { type ElementType, type ReactNode } from 'react';
import Mark from './Mark';

const LEFT = [
  { label: 'Grammatik', href: '/grammatik' },
  { label: 'Texter', href: '/texter' },
  { label: 'Runor', href: '/runor' },
  { label: 'Resursbibliotek', href: '/resurser' },
];
const RIGHT = [
  { label: 'Ordbok', href: '/ordbok' },
  { label: 'Kontakt', href: '/kontakt' },
];

/** Shared markup for Next pages and independently hosted static dictionary articles. */
export default function NavigationContent({
  active, homeOrigin = '', LinkComponent = 'a', bookmarkControl,
}: {
  active?: string;
  homeOrigin?: string;
  LinkComponent?: ElementType;
  bookmarkControl?: ReactNode;
}) {
  const links = (items: typeof LEFT) => items.map(({ label, href }) => (
    <LinkComponent key={href} href={`${homeOrigin}${href}`}
      className={`nav-link ${active === href ? 'underline underline-offset-4' : ''}`}
      aria-current={active === href ? 'page' : undefined}>
      {label}
    </LinkComponent>
  ));
  return (
    <header className="start-nav">
      <nav className="start-lankar" aria-label="Huvudnavigering">{links(LEFT)}</nav>
      <LinkComponent href={`${homeOrigin}/`} className="start-marke" aria-label="Fornsvenska Studielabbet">
        <Mark /><span className="display">Fornsvenska</span>
      </LinkComponent>
      <nav className="start-lankar start-lankar-hoger items-center" aria-label="Övrigt">
        {bookmarkControl}{links(RIGHT)}
      </nav>
    </header>
  );
}
