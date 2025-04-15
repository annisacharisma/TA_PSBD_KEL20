/* eslint-disable @next/next/no-img-element */
// pages/trash.tsx
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import api from "../lib/axios";
import Navbar from "../components/Navbar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Mobil {
  id_mobil: number;
  merk: string;
  model: string;
  tahun: number;
  gambar: string;
  harga_sewa_per_hari: number;
}

export default function Trash() {
  const [trashedMobils, setTrashedMobils] = useState<Mobil[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] =
    useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] =
    useState<boolean>(false);
  const [mobilIdToDelete, setMobilIdToDelete] = useState<number | null>(null);
  const [mobilIdToRestore, setMobilIdToRestore] = useState<number | null>(null);
  const router = useRouter();

  const fetchTrashedMobils = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/mobil/trash");
      console.log("API Response from /mobil/trash:", res.data);
      if (typeof res.data === "string") {
        console.error("Received HTML instead of JSON:", res.data);
        throw new Error("Invalid response format");
      }
      const data = Array.isArray(res.data) ? res.data : [];
      console.log("Set trashed mobils to:", data);
      setTrashedMobils(data);
    } catch (error) {
      console.error("Error fetching trashed mobils:", error);
      setError("Gagal memuat data sampah. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrashedMobils();
  }, [fetchTrashedMobils]);

  const handleRestore = (id: number) => {
    setMobilIdToRestore(id);
    setIsRestoreConfirmOpen(true);
  };

  const confirmRestore = async () => {
    if (mobilIdToRestore === null) return;
    try {
      await api.put(`/mobil/restore/${mobilIdToRestore}`);
      setTrashedMobils(
        trashedMobils.filter((m) => m.id_mobil !== mobilIdToRestore)
      );
      setIsRestoreConfirmOpen(false);
      setMobilIdToRestore(null);
    } catch (error) {
      console.error("Error restoring mobil:", error);
      setIsRestoreConfirmOpen(false);
      setError("Gagal memulihkan mobil. Silakan coba lagi.");
    }
  };

  const cancelRestore = () => {
    setIsRestoreConfirmOpen(false);
    setMobilIdToRestore(null);
  };

  const handleHardDelete = (id: number) => {
    setMobilIdToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmHardDelete = async () => {
    if (mobilIdToDelete === null) return;
    try {
      await api.delete(`/mobil/hard/${mobilIdToDelete}`);
      setTrashedMobils(
        trashedMobils.filter((m) => m.id_mobil !== mobilIdToDelete)
      );
      setIsDeleteConfirmOpen(false);
      setMobilIdToDelete(null);
    } catch (error) {
      console.error("Error permanently deleting mobil:", error);
      setIsDeleteConfirmOpen(false);
      setError("Gagal menghapus mobil secara permanen. Silakan coba lagi.");
    }
  };

  const cancelHardDelete = () => {
    setIsDeleteConfirmOpen(false);
    setMobilIdToDelete(null);
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
          <div className="my-7">
            <Button
              onClick={() => router.push("/mobil")}
              className="bg-blue-500 text-white p-5 rounded-xl hover:bg-blue-600 flex items-center">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali ke Mobil
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
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

          {isRestoreConfirmOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Konfirmasi Pemulihan Mobil</CardTitle>
                  <CardDescription>
                    Apakah Anda yakin ingin memulihkan mobil ini? Mobil akan
                    kembali ke daftar mobil aktif.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={cancelRestore}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    Batal
                  </Button>
                  <Button
                    onClick={confirmRestore}
                    className="bg-green-500 text-white hover:bg-green-600">
                    Pulihkan
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {isDeleteConfirmOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Konfirmasi Hapus Permanen</CardTitle>
                  <CardDescription>
                    Apakah Anda yakin ingin menghapus mobil ini secara permanen?
                    Tindakan ini tidak dapat dibatalkan.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={cancelHardDelete}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    Batal
                  </Button>
                  <Button
                    onClick={confirmHardDelete}
                    className="bg-red-500 text-white hover:bg-red-600">
                    Hapus Permanen
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trashedMobils.length > 0 ? (
              trashedMobils.map((mobil) => (
                <div
                  key={mobil.id_mobil}
                  className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={mobil.gambar}
                    alt={`${mobil.merk} ${mobil.model}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">
                      {mobil.merk} {mobil.model}
                    </h3>
                    <p className="text-gray-600">Tahun: {mobil.tahun}</p>
                    <p className="text-gray-600">
                      Harga Sewa: Rp{" "}
                      {mobil.harga_sewa_per_hari.toLocaleString()}/hari
                    </p>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleRestore(mobil.id_mobil)}
                        className="text-green-500 border-green-500 hover:bg-green-50">
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Recover
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleHardDelete(mobil.id_mobil)}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Hard Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3 text-gray-500">
                Sampah kosong.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
