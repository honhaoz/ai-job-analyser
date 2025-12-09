"use client";
import { cn } from "@/lib/utils/styling-merger";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Footer = () => {
  const linkList = [
    { href: "/about", label: "About" },
    { href: "https://github.com/honhaoz", label: "GitHub", external: true },
    { href: "/contact", label: "Contact" },
  ];
  const pathname = usePathname();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 text-sm text-gray-600">
          {linkList.map((link, index) => (
            <>
              <Link
                key={link.href}
                href={link.href}
                className={cn("hover:text-blue-500")}
              >
                {link.label}
              </Link>
              {index < linkList.length - 1 && (
                <span className="hidden sm:inline text-gray-300">|</span>
              )}
            </>
          ))}
        </div>
      </div>
    </footer>
  );
};
