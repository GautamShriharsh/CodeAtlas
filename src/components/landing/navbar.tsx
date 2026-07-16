"use client";

import { SignInButton, useUser } from "@clerk/nextjs";

import { Button } from "./ui/button";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Architecture", href: "#architecture" },
  { label: "Get Started", href: "#getStarted" },
];

export function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-neutral-900 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          className="text-md flex items-center gap-2 font-semibold tracking-tight text-neutral-100"
        >
          CodeAtlas
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-neutral-500 transition-colors hover:text-neutral-200"
            >
              {item.label}
            </a>
          ))}
        </div>

        {isSignedIn ? (
          <Button className="hover:cursor-pointer" href="/dashboard">Dashboard</Button>
        ) : (
          <SignInButton mode="modal">
            <Button className="hover:cursor-pointer">Sign In</Button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
}
