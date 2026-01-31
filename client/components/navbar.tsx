"use client";

import { ArrowUpDown, Github, Home, LucideProps } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { ModeToggle } from "./dark-mode";
import { Separator } from "./ui/separator";

//---------------------------------------
const LinkItem = ({
  item,
  currPage,
}: {
  item: {
    name: string;
    href: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    target?: string;
  };
  currPage: string;
}) => {
  const isActive = currPage === item.href;
  return (
    <div
      key={item.name}
      title={item.name}
      className={
        isActive
          ? "text-purple-400  border-purple-400 p-1 border-b-2"
          : "hover:border-b-2 p-1 hover:border-purple-400 hover:text-purple-400"
      }
    >
      <Link
        title={item.name}
        href={item.href}
        className="flex gap-2 items-center"
        target={item.target}
      >
        <span className="hidden md:block">{item.name}</span>
        <item.icon className="w-4 h-4" />
      </Link>
    </div>
  );
};

//---------------------------------------

const Navbar = () => {
  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Mint Transactions", href: "/transactions", icon: ArrowUpDown },
    {
      name: "Github",
      href: "https://github.com/rahulsm20/soldex",
      icon: Github,
      target: "_blank",
    },
    // {
    //   name: "API",
    //   href: "https://api.soldex.dev/docs",
    //   icon: ArrowUpRight,
    //   target: "_blank",
    // },
  ];
  const pathname = usePathname();
  return (
    <nav className="flex z-50 backdrop-blur-xl items-center justify-between bg-none py-2 px-4 text-sm border-b border-zinc-300 dark:border-zinc-800">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/favicon.ico"
          className="hidden dark:block"
          alt="Logo-dark"
          width={20}
          height={20}
        />
        <Image
          src="/book-open-check.png"
          className="block dark:hidden"
          alt="Logo-light"
          width={20}
          height={20}
        />
        <span className="font-semibold text-lg">Soldex</span>
      </Link>
      <section className="flex gap-5 items-center">
        {navItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <LinkItem item={item} currPage={pathname} />
            <Separator orientation="vertical" className="h-3" />
          </div>
        ))}
        <div>
          <ModeToggle />
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
