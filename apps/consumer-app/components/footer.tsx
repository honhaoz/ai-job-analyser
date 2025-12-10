"use client";
import { cn } from "@/lib/utils/styling-merger";
import Link from "next/link";
import { Fragment } from "react";

export const Footer = () => {
  const linkList = [
    { href: "/about", label: "About", id: "footer-about" },
    {
      href: "https://github.com/honhaoz",
      label: "GitHub",
      external: true,
      id: "footer-github",
    },
    { href: "/contact", label: "Contact", id: "footer-contact" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 text-sm text-gray-600">
          {linkList.map((link, index) => (
            <Fragment key={link.id}>
              {link.external ? (
                <Link
                  href={link.href}
                  className={cn("hover:text-blue-500")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </Link>
              ) : (
                <Link href={link.href} className={cn("hover:text-blue-500")}>
                  {link.label}
                </Link>
              )}
              {index < linkList.length - 1 && (
                <span className="hidden sm:inline text-gray-300">|</span>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
};
