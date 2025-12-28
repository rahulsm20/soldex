import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./dark-mode";

const Navbar = () => {
  return (
    <nav className="navbar flex items-center justify-between bg-zinc-100 dark:bg-zinc-950 p-5 border-b border-zinc-800 mb-10">
      <Image src="/favicon.ico" alt="Logo" width={20} height={20} />
      <ul className="flex gap-5 items-center">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/transactions">Transactions</Link>
        </li>
        <li>
          <ModeToggle />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
