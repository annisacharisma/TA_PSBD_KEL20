// pages/PageCustomer.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../lib/axios";
import { Button } from "@/components/ui/button";

interface Mobil {
  id_mobil: number;
  merk: string;
  model: string;
  tahun: number;
  harga_sewa_per_hari: number;
  gambar: string;
}

export default function KatalogMobil() {
  const [mobilList, setMobilList] = useState<Mobil[]>([]);
  const router = useRouter();

  useEffect(() => {
    api.get("/customer-mobil").then((res) => setMobilList(res.data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">🚘 Katalog Mobil</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mobilList.map((mobil) => (
          <div
            key={mobil.id_mobil}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
          >
            <img
              src={mobil.gambar}
              alt={`${mobil.merk} ${mobil.model}`}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold text-center">{mobil.merk} {mobil.model}</h2>
            <p className="text-gray-600 mt-1">Tahun: {mobil.tahun}</p>
            <p className="text-gray-800 font-semibold mt-1">Harga: Rp{mobil.harga_sewa_per_hari.toLocaleString("id-ID")}</p>

            <Button
              className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => router.push(`/FormCustomer?id_mobil=${mobil.id_mobil}`)}
            >
              Pesan Sekarang
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
