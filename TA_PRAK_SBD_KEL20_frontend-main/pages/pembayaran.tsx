// pages/pembayaran.tsx
import { format } from "date-fns";
import { id } from "date-fns/locale";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Pembayaran {
  id_pembayaran: number;
  tanggal_bayar: string;
  total_biaya: number;
  metode_bayar: string;
}

export default function Pembayaran() {
  const [pembayarans, setPembayarans] = useState<Pembayaran[]>([]);
  const [filteredPembayarans, setFilteredPembayarans] = useState<Pembayaran[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [selectedPembayaran, setSelectedPembayaran] =
    useState<Pembayaran | null>(null);
  const [newTanggalBayar, setNewTanggalBayar] = useState<string>("");
  const [newTotalBiaya, setNewTotalBiaya] = useState<string>("");
  const [newMetodeBayar, setNewMetodeBayar] = useState<string>("");
  const router = useRouter();

  const fetchPembayarans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/pembayaran");
      setPembayarans(res.data);
      setFilteredPembayarans(res.data);
    } catch (error) {
      console.error("Error fetching pembayarans:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchPembayarans();
  }, [fetchPembayarans]);

  useEffect(() => {
    const filtered = pembayarans.filter((pembayaran) =>
      pembayaran.metode_bayar.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredPembayarans(filtered);
    setCurrentPage(1);
  }, [filter, pembayarans]);

  const handleAddPembayaran = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/pembayaran", {
        tanggal_bayar: newTanggalBayar,
        total_biaya: parseFloat(newTotalBiaya),
        metode_bayar: newMetodeBayar,
      });
      setNewTanggalBayar("");
      setNewTotalBiaya("");
      setNewMetodeBayar("");
      setIsAddModalOpen(false);
      fetchPembayarans();
    } catch (error) {
      console.error("Error adding pembayaran:", error);
      alert("Gagal menambahkan pembayaran");
    }
  };

  const handleEditPembayaran = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPembayaran) return;
    try {
      await api.put(`/pembayaran/${selectedPembayaran.id_pembayaran}`, {
        tanggal_bayar: newTanggalBayar,
        total_biaya: parseFloat(newTotalBiaya),
        metode_bayar: newMetodeBayar,
      });
      setNewTanggalBayar("");
      setNewTotalBiaya("");
      setNewMetodeBayar("");
      setIsEditModalOpen(false);
      setSelectedPembayaran(null);
      fetchPembayarans();
    } catch (error) {
      console.error("Error editing pembayaran:", error);
      alert("Gagal mengedit pembayaran");
    }
  };

  const handleDelete = async () => {
    if (!selectedPembayaran) return;
    try {
      await api.delete(`/pembayaran/${selectedPembayaran.id_pembayaran}`);
      setIsDeleteConfirmOpen(false);
      setSelectedPembayaran(null);
      fetchPembayarans();
    } catch (error) {
      console.error("Error deleting pembayaran:", error);
      alert("Gagal menghapus pembayaran");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPembayarans.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPembayarans.length / itemsPerPage);

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
              placeholder="Filter metode bayar..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-1/3"
            />
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setIsAddModalOpen(true)}>
              Tambah Pembayaran
            </Button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal Bayar</TableHead>
                  <TableHead>Metode Bayar</TableHead>
                  <TableHead>Total Biaya</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((pembayaran) => (
                    <TableRow key={pembayaran.id_pembayaran}>
                      <TableCell>
                        {format(new Date(pembayaran.tanggal_bayar), "dd MMMM yyyy", { locale: id })}
                      </TableCell>
                      <TableCell>{pembayaran.metode_bayar}</TableCell>
                      <TableCell>
                        Rp {pembayaran.total_biaya.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          className="mr-2"
                          onClick={() => {
                            setSelectedPembayaran(pembayaran);
                            setNewTanggalBayar(pembayaran.tanggal_bayar);
                            setNewTotalBiaya(pembayaran.total_biaya.toString());
                            setNewMetodeBayar(pembayaran.metode_bayar);
                            setIsEditModalOpen(true);
                          }}>
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setSelectedPembayaran(pembayaran);
                            setIsDeleteConfirmOpen(true);
                          }}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Tidak ada data pembayaran.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              {filteredPembayarans.length} data pembayaran.
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

          {/* Add Pembayaran Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Tambah Pembayaran</CardTitle>
                  <CardDescription>Tambahkan pembayaran baru.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddPembayaran}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Tanggal Bayar
                        </label>
                        <Input
                          type="date"
                          value={newTanggalBayar}
                          onChange={(e) => setNewTanggalBayar(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Total Biaya
                        </label>
                        <Input
                          type="number"
                          placeholder="Masukkan total biaya"
                          value={newTotalBiaya}
                          onChange={(e) => setNewTotalBiaya(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Metode Bayar
                        </label>
                        <Select
                          onValueChange={(value) => setNewMetodeBayar(value)}
                          value={newMetodeBayar}
                          required>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih metode bayar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Credit Card">
                              Credit Card
                            </SelectItem>
                            <SelectItem value="Bank Transfer">
                              Bank Transfer
                            </SelectItem>
                          </SelectContent>
                        </Select>
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

          {/* Edit Pembayaran Modal */}
          {isEditModalOpen && selectedPembayaran && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Edit Pembayaran</CardTitle>
                  <CardDescription>Edit data pembayaran.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEditPembayaran}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Tanggal Bayar
                        </label>
                        <Input
                          type="date"
                          value={newTanggalBayar}
                          onChange={(e) => setNewTanggalBayar(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Total Biaya
                        </label>
                        <Input
                          type="number"
                          placeholder="Masukkan total biaya"
                          value={newTotalBiaya}
                          onChange={(e) => setNewTotalBiaya(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Metode Bayar
                        </label>
                        <Select
                          onValueChange={(value) => setNewMetodeBayar(value)}
                          value={newMetodeBayar}
                          required>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih metode bayar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Credit Card">
                              Credit Card
                            </SelectItem>
                            <SelectItem value="Bank Transfer">
                              Bank Transfer
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
          {isDeleteConfirmOpen && selectedPembayaran && (
            <AlertDialog
              open={isDeleteConfirmOpen}
              onOpenChange={setIsDeleteConfirmOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Konfirmasi Hapus Pembayaran
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus pembayaran pada tanggal{" "}
                    {selectedPembayaran.tanggal_bayar}? Tindakan ini tidak dapat
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