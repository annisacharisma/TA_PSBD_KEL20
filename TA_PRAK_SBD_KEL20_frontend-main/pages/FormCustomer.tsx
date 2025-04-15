import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FormPemesanan() {
  const router = useRouter();
  const { id_mobil } = router.query;

  const [formData, setFormData] = useState({
    nama: "",
    ktp: "",
    alamat: "",
    no_telp: "",
    id_mobil: id_mobil || "",
    tgl_sewa: "",
    tgl_kembali: "",
    tanggal_bayar: "",
    total_biaya: "",
    metode_bayar: ""
  });

  useEffect(() => {
    if (id_mobil) {
      setFormData(prev => ({ ...prev, id_mobil: id_mobil as string }));
    }
  }, [id_mobil]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (value: string) => {
    setFormData({ ...formData, metode_bayar: value });
  };

  const handleSubmit = async () => {
    const res = await api.post("/customer-rental", formData);
    const id_rental = res.data.id_rental;
    router.push(`/KonfirmasiCustomer?id=${id_rental}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">📝 Form Pemesanan & Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nama">Nama Lengkap</Label>
            <Input name="nama" id="nama" placeholder="Masukkan nama lengkap" onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="ktp">Nomor KTP</Label>
            <Input name="ktp" id="ktp" placeholder="Masukkan no KTP" onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="alamat">Alamat Rumah</Label>
            <Input name="alamat" id="alamat" placeholder="Masukkan alamat" onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="no_telp">No Telepon</Label>
            <Input name="no_telp" id="no_telp" placeholder="Masukkan no telepon" onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="tgl_sewa">Tanggal Sewa</Label>
            <Input type="date" name="tgl_sewa" id="tgl_sewa" onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="tgl_kembali">Tanggal Kembali</Label>
            <Input type="date" name="tgl_kembali" id="tgl_kembali" onChange={handleChange} />
          </div>
          <hr className="my-2" />
          <div>
            <Label htmlFor="tanggal_bayar">Tanggal Bayar</Label>
            <Input type="date" name="tanggal_bayar" id="tanggal_bayar" onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="total_biaya">Total Biaya</Label>
            <Input name="total_biaya" id="total_biaya" placeholder="Contoh: 1500000" onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="metode_bayar">Metode Bayar</Label>
            <Select onValueChange={handleSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih metode pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Transfer Bank">Transfer Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => router.push("/PageCustomer")}>Cancel</Button>
            <Button onClick={handleSubmit}>Lanjutkan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
