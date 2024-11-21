import Image from "next/image";
import Link from "next/link";

import logoImg from '@/assets/pokeapi.png'

export function Navbar() {
  return (
    <div className="h-14 p-2 flex items-center justify-center bg-poke-red shadow-[0_4px_50px_#ef5350]">
      <Link href="/">
        <Image src={logoImg} alt="Logo pokeapi" width={100} height={36} />
      </Link>
    </div>
  )
}