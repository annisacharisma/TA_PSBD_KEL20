// pages/mobil.tsx
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import api from "../lib/axios";
import MobilCard from "../components/MobilCard";
import Navbar from "../components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Tambahkan Input dari UI library
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Trash2, X } from "lucide-react"; // Tambahkan ikon X untuk reset

interface Mobil {
  id_mobil: number;
  merk: string;
  model: string;
  tahun: number;
  gambar: string;
  harga_sewa_per_hari: number;
}

export default function Mobil() {
  const [mobils, setMobils] = useState<Mobil[]>([]);
  const [merk, setMerk] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [tahun, setTahun] = useState<number>(0);
  const [gambar, setGambar] = useState<string>("");
  const [hargaSewaPerHari, setHargaSewaPerHari] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] =
    useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [mobilIdToDelete, setMobilIdToDelete] = useState<number | null>(null);
  // State untuk filter
  const [filterMerk, setFilterMerk] = useState<string>("");
  const [filterModel, setFilterModel] = useState<string>("");
  const router = useRouter();

  const fetchMobils = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/mobil");
      console.log("API Response from /mobil:", res.data);
      if (typeof res.data === "string") {
        console.error("Received HTML instead of JSON:", res.data);
        throw new Error("Invalid response format");
      }
      const data = Array.isArray(res.data) ? res.data : [];
      console.log("Set mobils to:", data);
      setMobils(data);
    } catch (error) {
      console.error("Error fetching mobils:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchMobils();
  }, [fetchMobils]);

  const validateInputs = () => {
    if (!merk || merk.trim() === "") {
      return "Merk mobil tidak boleh kosong.";
    }
    if (!model || model.trim() === "") {
      return "Model mobil tidak boleh kosong.";
    }
    if (tahun <= 0 || tahun > new Date().getFullYear()) {
      return `Tahun harus antara 1 dan ${new Date().getFullYear()}.`;
    }
    if (!gambar || !gambar.startsWith("http")) {
      return "Link gambar harus valid (dimulai dengan http).";
    }
    if (hargaSewaPerHari <= 0) {
      return "Harga sewa per hari harus lebih dari 0.";
    }
    return null;
  };

  const handleAddMobil = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await api.post("/mobil", {
        merk,
        model,
        tahun,
        gambar,
        harga_sewa_per_hari: hargaSewaPerHari,
      });
      console.log("Add mobil response:", response.data);
      await fetchMobils();
      setMerk("");
      setModel("");
      setTahun(0);
      setGambar("");
      setHargaSewaPerHari(0);
      setIsCardOpen(false);
    } catch (error) {
      console.error("Error adding mobil:", error);
      setError("Gagal menambahkan mobil. Silakan coba lagi.");
    }
  };

  const handleDelete = async (id: number) => {
    setMobilIdToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (mobilIdToDelete === null) return;
    try {
      await api.delete(`/mobil/soft/${mobilIdToDelete}`);
      setMobils(mobils.filter((m) => m.id_mobil !== mobilIdToDelete));
      setIsDeleteConfirmOpen(false);
      setMobilIdToDelete(null);
    } catch (error) {
      console.error(error);
      setError("Gagal menghapus mobil. Silakan coba lagi.");
      setIsDeleteConfirmOpen(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setMobilIdToDelete(null);
  };

  const handleEdit = (updatedMobil: Mobil) => {
    setMobils(
      mobils.map((m) =>
        m.id_mobil === updatedMobil.id_mobil ? updatedMobil : m
      )
    );
  };

  const handleLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const cancelLogout = () => {
    setIsLogoutConfirmOpen(false);
  };

  const handleCancel = () => {
    setMerk("");
    setModel("");
    setTahun(0);
    setGambar("");
    setHargaSewaPerHari(0);
    setIsCardOpen(false);
    setError(null);
  };

  // Fungsi untuk mereset filter
  const resetFilters = () => {
    setFilterMerk("");
    setFilterModel("");
  };

  // Filter mobil berdasarkan merk dan model
  const filteredMobils = mobils.filter((mobil) => {
    const matchesMerk = filterMerk
      ? mobil.merk.toLowerCase().includes(filterMerk.toLowerCase())
      : true;
    const matchesModel = filterModel
      ? mobil.model.toLowerCase().includes(filterModel.toLowerCase())
      : true;
    return matchesMerk && matchesModel;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogout={handleLogout} />
      <div className="pt-20 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="my-7 flex justify-between items-center">
            <Button
              onClick={() => setIsCardOpen(true)}
              className="bg-blue-500 text-white p-5 rounded-xl hover:bg-blue-600">
              Tambah Mobil
            </Button>
            <Button
              onClick={() => router.push("/trash")}
              className="bg-gray-500 text-white p-5 rounded-xl hover:bg-gray-600 flex items-center">
              <Trash2 className="w-5 h-5 mr-2" />
              Sampah
            </Button>
          </div>

          {/* Filter Section */}
          <div className="my-7 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter Merk
              </label>
              <Input
                type="text"
                placeholder="Masukkan merk mobil"
                value={filterMerk}
                onChange={(e) => setFilterMerk(e.target.value)}
                className="text-black w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter Model
              </label>
              <Input
                type="text"
                placeholder="Masukkan model mobil"
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                className="text-black w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={resetFilters}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center"
                disabled={!filterMerk && !filterModel} // Disable jika tidak ada filter
              >
                <X className="w-4 h-4 mr-2" />
                Reset Filter
              </Button>
            </div>
          </div>

          {isCardOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Tambah Mobil</CardTitle>
                  <CardDescription>
                    Tambahkan mobil baru dengan mudah.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <form onSubmit={handleAddMobil}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Merk Mobil
                        </label>
                        <input
                          type="text"
                          placeholder="Masukkan merk mobil"
                          value={merk}
                          onChange={(e) => setMerk(e.target.value)}
                          className="text-black w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Model Mobil
                        </label>
                        <input
                          type="text"
                          placeholder="Masukkan model mobil"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          className="text-black w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Tahun
                        </label>
                        <input
                          type="number"
                          placeholder="Masukkan tahun"
                          value={tahun}
                          onChange={(e) =>
                            setTahun(
                              e.target.value ? parseInt(e.target.value) : 0
                            )
                          }
                          className="text-black w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Link Gambar
                        </label>
                        <input
                          type="text"
                          placeholder="Masukkan link gambar"
                          value={gambar}
                          onChange={(e) => setGambar(e.target.value)}
                          className="text-black w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Harga Sewa Per Hari
                        </label>
                        <input
                          type="number"
                          placeholder="Masukkan harga sewa per hari"
                          value={hargaSewaPerHari}
                          onChange={(e) =>
                            setHargaSewaPerHari(
                              e.target.value ? parseFloat(e.target.value) : 0
                            )
                          }
                          className="text-black w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <CardFooter className="mt-6 flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="border-gray-300 text-gray-700 hover:bg-gray-100">
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-black text-white hover:bg-gray-800">
                        Tambah
                      </Button>
                    </CardFooter>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {isLogoutConfirmOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Konfirmasi Logout</CardTitle>
                  <CardDescription>
                    Apakah Anda yakin ingin logout?
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={cancelLogout}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    Batal
                  </Button>
                  <Button
                    onClick={confirmLogout}
                    className="bg-red-500 text-white hover:bg-red-600">
                    Logout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {isDeleteConfirmOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Konfirmasi Hapus Mobil</CardTitle>
                  <CardDescription>
                    Mobil ini akan dipindahkan ke sampah. Anda dapat
                    memulihkannya nanti.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={cancelDelete}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    Batal
                  </Button>
                  <Button
                    onClick={confirmDelete}
                    className="bg-red-500 text-white hover:bg-red-600">
                    Hapus
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredMobils.length > 0 ? (
              filteredMobils.map((mobil) => (
                <MobilCard
                  key={mobil.id_mobil}
                  mobil={mobil}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))
            ) : (
              <p className="text-center col-span-3 text-gray-500">
                Tidak ada mobil yang sesuai dengan filter.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}