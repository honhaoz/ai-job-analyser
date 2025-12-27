"use client";
import { cn } from "@/lib/utils/styling-merger";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();

  const linkList = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
  ];
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link href="/">
            <h1 className="text-blue-700 text-3xl font-semibold hover:text-blue-800 transition-colors">
              AI-Powered Job Description analyser
            </h1>
            <p className="text-gray-600 mt-1">
              Extract insights and improve your application materials instantly
            </p>
          </Link>
          <nav className="flex gap-6" aria-label="Main navigation">
            {linkList.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "hover:text-blue-500",
                  pathname === link.href &&
                    "text-blue-700 font-medium underline",
                )}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
