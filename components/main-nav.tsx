"use client";
import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { Category } from "@/types";

interface MainNavProps {
  data: Category[];
}

export const MainNav = ({ data }: MainNavProps) => {
  const pathName = usePathname();
  const routes = data.map((item) => ({
    href: `/category/${item.id}`,
    label: item.name,
    active: pathName === `/category/${item.id}`,
  }));
  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 ">
      {routes.map((route) => (
        <Link key={route.href} href={route.href}
        className={cn('text-sm font-medium transition-colors hover:text-black', 
        route.active ? 'text-black' : 'text-neutral-5--')}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};
