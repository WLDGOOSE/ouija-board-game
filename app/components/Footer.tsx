import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-12 text-gray-400 text-sm">
      <p>© {new Date().getFullYear()} Ouija Board Experience - For entertainment purposes only</p>
      <div className="flex justify-center space-x-4 mt-2">
        <Link href="/about" className="hover:text-amber-400">About</Link>
        <Link href="/privacy" className="hover:text-amber-400">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-amber-400">Terms of Use</Link>
      </div>
    </footer>
  );
}