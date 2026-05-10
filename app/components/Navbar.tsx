// components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-12 py-6 bg-[#d1d5db] mb-2">
      {/* Minimal Logo */}
      <div className="text-2xl font-bold tracking-tighter text-black">
        <Link href="/">
          JB
        </Link>
      </div>

      {/* Nav Links - Using standard sans-serif to contrast your stylized Title fonts */}
      <div className="hidden md:flex space-x-12 items-center">
        <Link href="/programming" className="text-sm uppercase tracking-widest hover:opacity-50 transition-opacity font-medium">
          Programming
        </Link>
        <Link href="/contact" className="text-sm uppercase tracking-widest hover:opacity-50 transition-opacity font-medium">
          Contact
        </Link>
        
        {/* Bordered Button */}
        <Link 
          href="https://github.com/Jeet-Bubna" 
          className="px-6 py-2 border border-black text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all"
        >
          Github
        </Link>
      </div>
    </nav>
  );
}