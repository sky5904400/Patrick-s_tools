import Link from "next/link";

// Small fixed "back to home" pill shown on every tool page; `className` sets its theme colors.
export default function BackHomeLink({ className }: { className: string }) {
  return (
    <Link
      href="/"
      className={`fixed top-4 left-4 z-40 rounded-full px-4 py-1.5 text-sm font-semibold shadow-md backdrop-blur-md transition hover:-translate-x-0.5 ${className}`}
    >
      ← 回首頁
    </Link>
  );
}
