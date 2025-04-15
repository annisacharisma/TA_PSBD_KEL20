/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";

interface Mobil {
  id_mobil: number;
  merk: string;
  model: string;
  tahun: number;
  gambar: string;
  harga_sewa_per_hari: number;
}

interface MobilCardProps {
  mobil: Mobil;
  onEdit: (updatedMobil: Mobil) => void;
  onDelete: (id: number) => void;
}

export default function MobilCard({ mobil, onEdit, onDelete }: MobilCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMobil, setEditedMobil] = useState({ ...mobil });

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/mobil/${mobil.id_mobil}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ⬅ untuk autentikasi
        },
        body: JSON.stringify({
          ...editedMobil,
          harga_sewa_per_hari: parseFloat(String(editedMobil.harga_sewa_per_hari).replace(',', '.')),
        }),
      });

      if (response.ok) {
        onEdit(editedMobil);
        setIsEditing(false);
      } else {
        const errText = await response.text();
        console.error("Gagal update mobil:", errText);
        alert("Update gagal: " + errText);
      }
    } catch (error) {
      console.error("Error updating mobil:", error);
      alert("Terjadi kesalahan saat mengupdate mobil.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">
      {isEditing ? (
        <>
          <Input
            value={editedMobil.merk}
            onChange={(e) => setEditedMobil({ ...editedMobil, merk: e.target.value })}
            className="mb-2"
            placeholder="Merk"
          />
          <Input
            value={editedMobil.model}
            onChange={(e) => setEditedMobil({ ...editedMobil, model: e.target.value })}
            className="mb-2"
            placeholder="Model"
          />
          <Input
            type="number"
            value={editedMobil.tahun}
            onChange={(e) => setEditedMobil({ ...editedMobil, tahun: parseInt(e.target.value) })}
            className="mb-2"
            placeholder="Tahun"
          />
          <Input
            value={editedMobil.gambar}
            onChange={(e) => setEditedMobil({ ...editedMobil, gambar: e.target.value })}
            className="mb-2"
            placeholder="URL Gambar"
          />
          <Input
            value={String(editedMobil.harga_sewa_per_hari)}
            onChange={(e) =>
              setEditedMobil({ ...editedMobil, harga_sewa_per_hari: parseFloat(e.target.value.replace(',', '.')) })
            }
            className="mb-2"
            placeholder="Harga Sewa per Hari"
          />
          <div className="flex gap-2">
            <Button onClick={handleSave}>Simpan</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Batal</Button>
          </div>
        </>
      ) : (
        <>
          <img src={mobil.gambar} alt={mobil.model} className="w-full h-48 object-cover" />
          <h2 className="text-xl font-semibold">{mobil.merk} {mobil.model}</h2>
          <p>Tahun: {mobil.tahun}</p>
          <p>Harga: Rp{mobil.harga_sewa_per_hari.toLocaleString()}</p>
          <div className="flex gap-2 mt-2">
            <Button onClick={() => setIsEditing(true)}><Pencil size={16} /> Edit</Button>
            <Button variant="destructive" onClick={() => onDelete(mobil.id_mobil)}><Trash2 size={16} /> Hapus</Button>
          </div>
        </>
      )}
    </div>
  );
}
