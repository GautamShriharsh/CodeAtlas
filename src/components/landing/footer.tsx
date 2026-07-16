import { FiGithub } from 'react-icons/fi'

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Architecture', href: '#architecture' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    title: 'Developer',
    links: [
      { label: 'Portfolio', href: 'https://shriharsh-portfolio.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/GautamShriharsh' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shriharsh-gautam' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-neutral-900 px-5 pb-8 pt-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* CodeAtlas */}
          <div>
            <a
              href="#top"
              className="text-md flex items-center gap-2 font-semibold tracking-tight text-neutral-100"
            >
              CodeAtlas
            </a>

            <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-500">
              A quiet, complete understanding of the systems you build.
            </p>
          </div>

          {/* Product + Developer */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                {group.title}
              </h3>

              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={
                        link.href.startsWith('http')
                          ? 'noopener noreferrer'
                          : undefined
                      }
                      className="text-sm text-neutral-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-neutral-900 pt-7 text-xs text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 CodeAtlas. All rights reserved.</p>

          <a
            href="https://github.com/GautamShriharsh/codeatlas"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="transition-colors hover:text-neutral-300"
          >
            <FiGithub className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}