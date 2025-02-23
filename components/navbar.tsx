import { items } from "@/lib/constants";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 py-4 px-4 bg-black/40 backdrop-blur-lg flex items-center border-b-[1px] border-neutral-900 justify-between z-50 text-white">
      <aside className="flex items-baseline gap-[2px]">
        <p className="text-3xl font-bold">Port</p>
        <Image
          src="/logo.png"
          alt="app logo"
          width={35}
          height={35}
          className="shadow-sm"
        />
        <p className="text-3xl font-bold">Folio</p>
      </aside>
      <nav className="absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] hidden md:block">
        <ul className="flex gap-5 items-center">
          {items.map((item, idx) => (
            <li key={idx}>
              <Link href={item.link}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <aside className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            {/* Wire up user */}
            {true ? "Upcoming" : "Get Started"}
          </span>
        </Link>
        {/* WIP Wire up User */}
        <MenuIcon className="md:hidden" />
      </aside>
    </header>
  );
};

export default Navbar;
