'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
      {/* Decorative Neon Top Bar */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
      
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
             <div className="absolute -inset-1 bg-cyan-500 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
             <Image 
                src="/favicon-96x96.png" 
                alt="BitFlow logo" 
                width={32} 
                height={32} 
                className="relative rounded-lg border border-white/10"
              />
          </div>
          <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            BIT<span className="text-cyan-400">FLOW</span>
          </span>
        </Link>

        <nav className="flex items-center gap-8">
          {[
            { name: 'Home', href: '/' },
            { name: 'All Coins', href: '/coins' }
          ].map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'relative text-sm font-bold transition-all duration-300 hover:text-white uppercase tracking-widest',
                  isActive ? 'text-cyan-400' : 'text-zinc-500'
                )}
              >
                {item.name}
                {isActive && (
                  <span className="absolute -bottom-[22px] left-0 w-full h-[2px] bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
                )}
              </Link>
            );
          })}
          
          <div className="bg-zinc-900/50 border border-white/5 px-4 py-1.5 rounded-full flex items-center gap-2 group cursor-pointer hover:border-cyan-500/50 transition-all">
             <span className="text-xs text-zinc-500 group-hover:text-cyan-400">Search</span>
             <kbd className="text-[10px] bg-zinc-800 px-1.5 rounded text-zinc-400 group-hover:text-cyan-300">⌘K</kbd>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;