import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={120} height={100} />
        </Link>
        <div className="flex items-center gap-5 text-black">
          {session ? (
            <>
              <Link href="/startup/create">
                <span>Create</span>
              </Link>
              <button onClick={() => signOut()}>Sign Out</button>
              <Link href={`/user/${session.user.id}`}>
                <span>{session.user.name}</span>
              </Link>
            </>
          ) : (
            <button onClick={() => signIn("google")}>Sign In</button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
