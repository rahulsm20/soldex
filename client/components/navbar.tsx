import { ArrowUpDown, ArrowUpRight, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./dark-mode";

const Navbar = () => {
  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Transactions", href: "/transactions", icon: ArrowUpDown },
    {
      name: "Github",
      href: "https://github.com/rahulsm20/soldex",
      icon: ArrowUpRight,
      target: "_blank",
    },
  ];

  return (
    <nav className="flex sticky top-0 z-50 backdrop-blur-xl items-center justify-between bg-none py-2 px-4 text-sm border-b border-zinc-300 dark:border-zinc-800 mb-10">
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
      <ul className="flex gap-5 items-center">
        {navItems.map((item) => (
          <li key={item.name} title={item.name}>
            <Link
              href={item.href}
              className="flex gap-2 items-center"
              target={item.target}
            >
              <span className="hidden md:block">{item.name}</span>
              <item.icon className="w-4 h-4" />
            </Link>
          </li>
        ))}
        <li>
          <ModeToggle />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
