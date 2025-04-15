/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/karyawan.tsx
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import api from "../lib/axios";
import Navbar from "../components/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Karyawan {
  id_karyawan: number;
  nama_karyawan: string;
  username: string;
}

export default function Karyawan() {
  const [karyawans, setKaryawans] = useState<Karyawan[]>([]);
  const [filteredKaryawans, setFilteredKaryawans] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [selectedKaryawan, setSelectedKaryawan] = useState<Karyawan | null>(
    null
  );
  const [newNamaKaryawan, setNewNamaKaryawan] = useState<string>("");
  const [newUsername, setNewUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const router = useRouter();

  const fetchKaryawans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/karyawan");
      setKaryawans(res.data);
      setFilteredKaryawans(res.data);
    } catch (error) {
      console.error("Error fetching karyawans:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchKaryawans();
  }, [fetchKaryawans]);

  useEffect(() => {
    const filtered = karyawans.filter((karyawan) =>
      karyawan.nama_karyawan.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredKaryawans(filtered);
    setCurrentPage(1);
  }, [filter, karyawans]);

  const handleAddKaryawan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", {
        nama_karyawan: newNamaKaryawan,
        username: newUsername,
        password: newPassword,
      });
      setNewNamaKaryawan("");
      setNewUsername("");
      setNewPassword("");
      setIsAddModalOpen(false);
      fetchKaryawans();
    } catch (error: any) {
      console.error("Error adding karyawan:", error);
      if (error.response && error.response.data.message) {
        alert(error.response.data.message); // Display backend error message (e.g., duplicate username)
      } else {
        alert("Gagal menambahkan karyawan");
      }
    }
  };

  const handleEditKaryawan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKaryawan) return;
    try {
      await api.put(`/auth/karyawan/${selectedKaryawan.id_karyawan}`, {
        nama_karyawan: newNamaKaryawan,
        username: newUsername,
        password: newPassword || undefined, // Only include password if provided
      });
      setNewNamaKaryawan("");
      setNewUsername("");
      setNewPassword("");
      setIsEditModalOpen(false);
      setSelectedKaryawan(null);
      fetchKaryawans();
    } catch (error: any) {
      console.error("Error editing karyawan:", error);
      if (error.response && error.response.data.message) {
        alert(error.response.data.message); // Display backend error message
      } else {
        alert("Gagal mengedit karyawan");
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedKaryawan) return;
    try {
      await api.delete(`/auth/karyawan/${selectedKaryawan.id_karyawan}`);
      setIsDeleteConfirmOpen(false);
      setSelectedKaryawan(null);
      fetchKaryawans();
    } catch (error) {
      console.error("Error deleting karyawan:", error);
      alert("Gagal menghapus karyawan");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKaryawans.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredKaryawans.length / itemsPerPage);

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
      <div className="pt-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6 mt-4">
            <Input
              placeholder="Filter nama karyawan..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-1/3"
            />
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setIsAddModalOpen(true)}>
              Tambah Karyawan
            </Button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Karyawan</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((karyawan) => (
                    <TableRow key={karyawan.id_karyawan}>
                      <TableCell>{karyawan.nama_karyawan}</TableCell>
                      <TableCell>{karyawan.username}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          className="mr-2"
                          onClick={() => {
                            setSelectedKaryawan(karyawan);
                            setNewNamaKaryawan(karyawan.nama_karyawan);
                            setNewUsername(karyawan.username);
                            setNewPassword("");
                            setIsEditModalOpen(true);
                          }}>
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setSelectedKaryawan(karyawan);
                            setIsDeleteConfirmOpen(true);
                          }}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Tidak ada data karyawan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              {filteredKaryawans.length} data karyawan.
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}>
                Previous
              </Button>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          </div>

          {/* Add Karyawan Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Tambah Karyawan</CardTitle>
                  <CardDescription>Tambahkan karyawan baru.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddKaryawan}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Nama Karyawan
                        </label>
                        <Input
                          placeholder="Masukkan nama karyawan"
                          value={newNamaKaryawan}
                          onChange={(e) => setNewNamaKaryawan(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Username
                        </label>
                        <Input
                          placeholder="Masukkan username"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <Input
                          type="password"
                          placeholder="Masukkan password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <CardFooter className="mt-6 flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Tambah</Button>
                    </CardFooter>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Edit Karyawan Modal */}
          {isEditModalOpen && selectedKaryawan && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Edit Karyawan</CardTitle>
                  <CardDescription>Edit data karyawan.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEditKaryawan}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Nama Karyawan
                        </label>
                        <Input
                          placeholder="Masukkan nama karyawan"
                          value={newNamaKaryawan}
                          onChange={(e) => setNewNamaKaryawan(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Username
                        </label>
                        <Input
                          placeholder="Masukkan username"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Password (kosongkan jika tidak ingin mengubah)
                        </label>
                        <Input
                          type="password"
                          placeholder="Masukkan password baru"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <CardFooter className="mt-6 flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Simpan</Button>
                    </CardFooter>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          {isDeleteConfirmOpen && selectedKaryawan && (
            <AlertDialog
              open={isDeleteConfirmOpen}
              onOpenChange={setIsDeleteConfirmOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Hapus Karyawan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus karyawan{" "}
                    {selectedKaryawan.nama_karyawan}? Tindakan ini tidak dapat
                    dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => setIsDeleteConfirmOpen(false)}>
                    Batal
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600">
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
