'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="main-container inner flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          {/* Surgical Fix: Using your transparent 96x96 PNG for maximum clarity 
            and updating Alt text to the new brand 'BitFlow'.
          */}
          <Image 
            src="/favicon-96x96.png" 
            alt="BitFlow Pro logo" 
            width={32} 
            height={32} 
            className="rounded-md"
          />
          <span className="text-xl font-bold tracking-tight">BitFlow</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className={cn('nav-link text-sm font-medium transition-colors hover:text-primary', {
              'text-foreground': pathname === '/',
              'text-muted-foreground': pathname !== '/',
            })}
          >
            Home
          </Link>

          {/* Placeholder for your upcoming Search functionality */}
          <div className="hidden md:block">
             <p className="text-sm text-muted-foreground cursor-not-allowed">Search</p>
          </div>

          <Link
            href="/coins"
            className={cn('nav-link text-sm font-medium transition-colors hover:text-primary', {
              'text-foreground': pathname === '/coins',
              'text-muted-foreground': pathname !== '/coins',
            })}
          >
            All Coins
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;