'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';

const PRIMARY_NAV = [
  { href: '/planner', label: 'วางแผน' },
  { href: '/explore', label: 'สำรวจ' },
  { href: '/portfolios', label: 'พอร์ตแนะนำ' },
];

const TOOLS_NAV = [
  { href: '/analyzer', label: 'วิเคราะห์สินทรัพย์' },
  { href: '/compare', label: 'เปรียบเทียบ' },
  { href: '/simulator', label: 'จำลอง DCA' },
  { href: '/backtest', label: 'Backtest ย้อนหลัง' },
];

const MORE_NAV = [
  { href: '/alerts', label: 'แจ้งเตือนราคา' },
  { href: '/how-to-buy', label: 'วิธีซื้อ' },
  { href: '/learn', label: 'เรียนรู้ DCA' },
  { href: '/quiz', label: 'ทดสอบความรู้' },
  { href: '/glossary', label: 'คลังศัพท์' },
];

const ALL_NAV = [
  { href: '/', label: 'หน้าแรก' },
  ...PRIMARY_NAV,
  ...TOOLS_NAV,
  ...MORE_NAV,
];

export default function Header() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function isActive(href: string) {
    return href === '/' ? pathname === '/' : pathname.startsWith(href);
  }

  const linkClass = (href: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive(href)
        ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
    }`;

  const isToolsActive = TOOLS_NAV.some((item) => isActive(item.href));

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/LogoDCA.png" alt="DCA Logo" width={36} height={36} className="h-9 w-9" />
          <span className="text-xl font-black tracking-tight text-cyan-700 dark:text-cyan-400">DCA</span>
          <span className="hidden text-sm text-slate-500 dark:text-slate-400 sm:inline">แนะนำการลงทุน</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {PRIMARY_NAV.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass(href)}>{label}</Link>
          ))}

          <div ref={toolsRef} className="relative">
            <button
              type="button"
              onClick={() => setToolsOpen((v) => !v)}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isToolsActive
                  ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
              aria-expanded={toolsOpen}
              aria-label="เครื่องมือ"
            >
              เครื่องมือ
              <svg className={`h-3.5 w-3.5 transition ${toolsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {toolsOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                {TOOLS_NAV.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setToolsOpen(false)}
                    className={`block px-4 py-2.5 text-sm transition ${
                      isActive(href)
                        ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {MORE_NAV.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass(href)}>{label}</Link>
          ))}
          <ThemeToggle theme={theme} toggle={toggle} />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle theme={theme} toggle={toggle} />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label={menuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-slate-200 bg-white px-5 pb-4 pt-2 dark:border-slate-700 dark:bg-slate-900 md:hidden">
          <p className="px-3 pb-1 pt-2 text-xs font-semibold text-slate-400 dark:text-slate-500">หลัก</p>
          {[{ href: '/', label: 'หน้าแรก' }, ...PRIMARY_NAV].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive(href)
                  ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {label}
            </Link>
          ))}
          <p className="px-3 pb-1 pt-3 text-xs font-semibold text-slate-400 dark:text-slate-500">เครื่องมือ</p>
          {TOOLS_NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive(href)
                  ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {label}
            </Link>
          ))}
          <p className="px-3 pb-1 pt-3 text-xs font-semibold text-slate-400 dark:text-slate-500">อื่นๆ</p>
          {MORE_NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive(href)
                  ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function ThemeToggle({ theme, toggle }: { theme: string; toggle: () => void }) {
  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
      aria-label={theme === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
    >
      {theme === 'dark' ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}
