// components/Navbar.tsx
import Link from "next/link"; // Import Link for navigation
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-black text-3xl font-bold">20s Car Rental</h1>
        <div className="flex items-center space-x-6">
          {/* Navigation Links */}
          <Link href="/mobil">
            <span className="text-black text-sm hover:text-blue-500 cursor-pointer">
              Mobil
            </span>
          </Link>
          <Link href="/karyawan">
            <span className="text-black text-sm  hover:text-blue-500 cursor-pointer">
              Karyawan
            </span>
          </Link>
          <Link href="/customer">
            <span className="text-black text-sm  hover:text-blue-500 cursor-pointer">
              Customer
            </span>
          </Link>
          <Link href="/pembayaran">
            <span className="text-black text-sm  hover:text-blue-500 cursor-pointer">
              Pembayaran
            </span>
          </Link>
          <Link href="/rental">
            <span className="text-black text-sm  hover:text-blue-500 cursor-pointer">
              Rental
            </span>
          </Link>
          {/* Logout Button */}
          <Button
            onClick={onLogout}
            className="bg-red-500 text-white hover:bg-red-600">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
