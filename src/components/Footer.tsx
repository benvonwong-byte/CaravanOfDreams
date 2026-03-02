import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-charcoal-700 text-cream-300 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-serif text-2xl text-cream-200 mb-4">
              Caravan of Dreams
            </h3>
            <p className="text-cream-400 text-sm leading-relaxed">
              Since 1991, a space for feeding curiosity and nourishing
              possibility — in the heart of the East Village.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-cream-200 uppercase tracking-wider mb-4">
              Navigate
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/events', label: 'Events' },
                { href: '/host', label: 'Host an Event' },
                { href: '/space', label: 'The Space' },
                { href: '/menu', label: 'Menu' },
                { href: '/about', label: 'About' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-400 hover:text-terracotta-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-cream-200 uppercase tracking-wider mb-4">
              Find Us
            </h4>
            <address className="not-italic text-sm text-cream-400 leading-relaxed">
              405 E 6th Street<br />
              New York, NY 10009<br />
              Between 1st Ave &amp; Ave A
            </address>
          </div>
        </div>

        <div className="border-t border-charcoal-600 mt-12 pt-8 text-center">
          <p className="font-serif text-lg text-cream-300">
            Eat. Dream. Build.
          </p>
        </div>
      </div>
    </footer>
  )
}
