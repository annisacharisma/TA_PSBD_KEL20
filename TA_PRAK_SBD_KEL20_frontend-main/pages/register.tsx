import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import api from "../lib/axios";

export default function Register() {
  const [nama_karyawan, setNamaKaryawan] = useState<string>(""); // Ganti nama menjadi nama_karyawan
  const [username, setUsername] = useState<string>(""); // Ganti email menjadi username
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { nama_karyawan, username, password }); // Sesuaikan dengan field backend
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-black text-2xl font-bold mb-6 text-center">
          Register
        </h1>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nama Karyawan" // Sesuaikan placeholder
              value={nama_karyawan}
              onChange={(e) => setNamaKaryawan(e.target.value)}
              className="text-black w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username" // Sesuaikan placeholder
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-black w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
            Register
          </button>
        </form>
        <p className="text-black mt-4 text-center">
          Sudah punya akun?{" "}
          <Link href="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
