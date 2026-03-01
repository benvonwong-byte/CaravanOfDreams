import Link from 'next/link'
import { MobileNav } from './MobileNav'

const navLinks = [
  { href: '/events', label: 'Events' },
  { href: '/host', label: 'Host' },
  { href: '/space', label: 'The Space' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
]

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream-200/90 backdrop-blur-sm border-b border-charcoal-100">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl text-charcoal-700 hover:text-terracotta-500 transition-colors"
        >
          Caravan of Dreams
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-charcoal-500 hover:text-terracotta-500 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <MobileNav links={navLinks} />
      </nav>
    </header>
  )
}
