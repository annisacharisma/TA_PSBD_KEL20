// pages/KonfirmasiCustomer.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../lib/axios";
import { Button } from "@/components/ui/button";

interface RentalData {
  id_rental: string;
  nama: string;
  id_mobil: number;
  tgl_sewa: string;
  tgl_kembali: string;
  status: string;
}

interface Mobil {
  merk: string;
  model: string;
  tahun: number;
}

export default function KonfirmasiPembayaran() {
  const router = useRouter();
  const { id } = router.query;

  const [rental, setRental] = useState<RentalData | null>(null);
  const [mobil, setMobil] = useState<Mobil | null>(null);

  useEffect(() => {
    if (typeof id === "string") {
      api.get(`/customer-rental/${id}`)
        .then((res) => {
          setRental(res.data);
          return api.get(`/customer-mobil/${res.data.id_mobil}`)
        })
        .then((res) => setMobil(res.data))
        .catch((err) => console.error("❌ Fetch error:", err));
    }
  }, [id]);

  const handleBayar = () => {
    alert("✅ Pembayaran berhasil! Terima kasih telah memesan 😊");
    router.push("/PageCustomer");
  };

  if (!rental || !mobil) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🧾 Konfirmasi Pemesanan</h1>
      <div className="space-y-2 mb-6">
        <p><strong>ID Rental:</strong> {rental.id_rental}</p>
        <p><strong>Nama:</strong> {rental.nama}</p>
        <p><strong>Mobil:</strong> {mobil.merk} {mobil.model} ({mobil.tahun})</p>
        <p><strong>Tanggal Sewa:</strong> {rental.tgl_sewa}</p>
        <p><strong>Tanggal Kembali:</strong> {rental.tgl_kembali}</p>
        <p><strong>Status:</strong> {rental.status}</p>
      </div>

      <Button onClick={handleBayar} className="bg-green-600 text-white px-6 py-2 rounded">
        Bayar Sekarang
      </Button>
    </div>
  );
}
