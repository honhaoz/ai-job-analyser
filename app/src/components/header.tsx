"use client";
import { cn } from "@/lib/utils/styling-merger";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="cursor-pointer">
            <h1 className="text-blue-700 text-3xl font-semibold">
              AI-Powered Job Description analyser
            </h1>
            <p className="text-gray-600 mt-1">
              Extract insights and improve your application materials instantly
            </p>
          </div>
          <nav className="flex gap-6">
            <Link
              href="/"
              className={cn(
                "hover:text-blue-500",
                pathname === "/" && "text-blue-700 font-medium"
              )}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={cn(
                "hover:text-blue-500",
                pathname === "/about" && "text-blue-700 font-medium"
              )}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={cn(
                "hover:text-blue-500",
                pathname === "/contact" && "text-blue-700 font-medium"
              )}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
