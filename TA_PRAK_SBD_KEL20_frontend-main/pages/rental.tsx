// pages/rental.tsx
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

interface Rental {
  id_rental: number;
  nama_mobil: string;
  gambar: string;
  tanggal_bayar: string;
  total_biaya: number;
  metode_bayar: string;
  tanggal_sewa: string;
  tanggal_kembali: string;
  status_transaksi: string;
  nama_cust: string;
  nama_karyawan: string;
}

interface Mobil {
  id_mobil: number;
  merk: string;
  model: string;
}

interface Customer {
  id_cust: number;
  nama_cust: string;
}

interface Karyawan {
  id_karyawan: number;
  nama_karyawan: string;
}

interface Pembayaran {
  id_pembayaran: number;
  tanggal_bayar: string;
  total_biaya: number;
  metode_bayar: string;
}

export default function Rental() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [filteredRentals, setFilteredRentals] = useState<Rental[]>([]);
  const [mobils, setMobils] = useState<Mobil[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [karyawans, setKaryawans] = useState<Karyawan[]>([]);
  const [pembayarans, setPembayarans] = useState<Pembayaran[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [newIdCust, setNewIdCust] = useState<string>("");
  const [newIdMobil, setNewIdMobil] = useState<string>("");
  const [newIdKaryawan, setNewIdKaryawan] = useState<string>("");
  const [newIdPembayaran, setNewIdPembayaran] = useState<string>("");
  const [newTanggalSewa, setNewTanggalSewa] = useState<string>("");
  const [newTanggalKembali, setNewTanggalKembali] = useState<string>("");
  const [newStatusTransaksi, setNewStatusTransaksi] = useState<string>("");
  const router = useRouter();

  const fetchRentals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/rental/details");
      setRentals(res.data);
      setFilteredRentals(res.data);
    } catch (error) {
      console.error("Error fetching rentals:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchRelatedData = useCallback(async () => {
    try {
      const [mobilsRes, customersRes, karyawansRes, pembayaransRes] =
        await Promise.all([
          api.get("/mobil"),
          api.get("/customer"),
          api.get("/auth/karyawan"),
          api.get("/pembayaran"),
        ]);
      setMobils(mobilsRes.data);
      setCustomers(customersRes.data);
      setKaryawans(karyawansRes.data);
      setPembayarans(pembayaransRes.data);
    } catch (error) {
      console.error("Error fetching related data:", error);
    }
  }, []);

  useEffect(() => {
    fetchRentals();
    fetchRelatedData();
  }, [fetchRentals, fetchRelatedData]);

  useEffect(() => {
    const filtered = rentals.filter((rental) =>
      rental.status_transaksi.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredRentals(filtered);
    setCurrentPage(1);
  }, [filter, rentals]);

  const handleAddRental = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/rental", {
        id_cust: parseInt(newIdCust),
        id_mobil: parseInt(newIdMobil),
        id_karyawan: parseInt(newIdKaryawan),
        id_pembayaran: parseInt(newIdPembayaran),
        tanggal_sewa: newTanggalSewa,
        tanggal_kembali: newTanggalKembali,
        status_transaksi: newStatusTransaksi,
      });
      setNewIdCust("");
      setNewIdMobil("");
      setNewIdKaryawan("");
      setNewIdPembayaran("");
      setNewTanggalSewa("");
      setNewTanggalKembali("");
      setNewStatusTransaksi("");
      setIsAddModalOpen(false);
      fetchRentals();
    } catch (error) {
      console.error("Error adding rental:", error);
      alert("Gagal menambahkan rental");
    }
  };

  const handleEditRental = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRental) return;
    try {
      await api.put(`/rental/${selectedRental.id_rental}`, {
        id_cust: parseInt(newIdCust),
        id_mobil: parseInt(newIdMobil),
        id_karyawan: parseInt(newIdKaryawan),
        id_pembayaran: parseInt(newIdPembayaran),
        tanggal_sewa: newTanggalSewa,
        tanggal_kembali: newTanggalKembali,
        status_transaksi: newStatusTransaksi,
      });
      setNewIdCust("");
      setNewIdMobil("");
      setNewIdKaryawan("");
      setNewIdPembayaran("");
      setNewTanggalSewa("");
      setNewTanggalKembali("");
      setNewStatusTransaksi("");
      setIsEditModalOpen(false);
      setSelectedRental(null);
      fetchRentals();
    } catch (error) {
      console.error("Error editing rental:", error);
      alert("Gagal mengedit rental");
    }
  };

  const handleDelete = async () => {
    if (!selectedRental) return;
    try {
      await api.delete(`/rental/${selectedRental.id_rental}`);
      setIsDeleteConfirmOpen(false);
      setSelectedRental(null);
      fetchRentals();
    } catch (error) {
      console.error("Error deleting rental:", error);
      alert("Gagal menghapus rental");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRentals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRentals.length / itemsPerPage);

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
              placeholder="Filter status transaksi..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-1/3"
            />
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => setIsAddModalOpen(true)}>
              Tambah Rental
            </Button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status Transaksi</TableHead>
                  <TableHead>Nama Mobil</TableHead>
                  <TableHead>Total Biaya</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((rental) => (
                    <TableRow key={rental.id_rental}>
                      <TableCell>{rental.status_transaksi}</TableCell>
                      <TableCell>{rental.nama_mobil}</TableCell>
                      <TableCell>
                        Rp {rental.total_biaya.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          className="mr-2"
                          onClick={() => {
                            setSelectedRental(rental);
                            setIsDetailsModalOpen(true);
                          }}>
                          Details
                        </Button>
                        <Button
                          variant="outline"
                          className="mr-2"
                          onClick={() => {
                            setSelectedRental(rental);
                            setNewIdCust(
                              rental.nama_cust ? rental.nama_cust : ""
                            );
                            setNewIdMobil(
                              rental.nama_mobil ? rental.nama_mobil : ""
                            );
                            setNewIdKaryawan(
                              rental.nama_karyawan ? rental.nama_karyawan : ""
                            );
                            setNewIdPembayaran(
                              rental.total_biaya
                                ? rental.total_biaya.toString()
                                : ""
                            );
                            setNewTanggalSewa(rental.tanggal_sewa);
                            setNewTanggalKembali(rental.tanggal_kembali);
                            setNewStatusTransaksi(rental.status_transaksi);
                            setIsEditModalOpen(true);
                          }}>
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setSelectedRental(rental);
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
                      Tidak ada data rental.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              {filteredRentals.length} data rental.
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

          {/* Add Rental Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Tambah Rental</CardTitle>
                  <CardDescription>Tambahkan rental baru.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddRental}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Customer
                        </label>
                        <Select
                          onValueChange={(value) => setNewIdCust(value)}
                          value={newIdCust}
                          required>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih customer" />
                          </SelectTrigger>
                          <SelectContent>
                            {customers.map((customer) => (
                              <SelectItem
                                key={customer.id_cust}
                                value={customer.id_cust.toString()}>
                                {customer.nama_cust}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Mobil
                        </label>
                        <Select
                          onValueChange={(value) => setNewIdMobil(value)}
                          value={newIdMobil}
                          required>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih mobil" />
                          </SelectTrigger>
                          <SelectContent>
                            {mobils.map((mobil) => (
                              <SelectItem
                                key={mobil.id_mobil}
                                value={mobil.id_mobil.toString()}>
                                {mobil.merk} {mobil.model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Karyawan
                        </label>
                        <Select
                          onValueChange={(value) => setNewIdKaryawan(value)}
                          value={newIdKaryawan}
                          required>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih karyawan" />
                          </SelectTrigger>
                          <SelectContent>
                            {karyawans.map((karyawan) => (
                              <SelectItem
                                key={karyawan.id_karyawan}
                                value={karyawan.id_karyawan.toString()}>
                                {karyawan.nama_karyawan}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Pembayaran
                        </label>
                        <Select
                          onValueChange={(value) => setNewIdPembayaran(value)}
                          value={newIdPembayaran}
                          required>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih pembayaran" />
                          </SelectTrigger>
                          <SelectContent>
                            {pembayarans.map((pembayaran) => (
                              <SelectItem
                                key={pembayaran.id_pembayaran}
                                value={pembayaran.id_pembayaran.toString()}>
                                Rp {pembayaran.total_biaya} -{" "}
                                {pembayaran.metode_bayar}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Tanggal Sewa
                        </label>
                        <Input
                          type="date"
                          value={newTanggalSewa}
                          onChange={(e) => setNewTanggalSewa(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Tanggal Kembali
                        </label>
                        <Input
                          type="date"
                          value={newTanggalKembali}
                          onChange={(e) => setNewTanggalKembali(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Status Transaksi
                        </label>
                        <Select
                          onValueChange={(value) =>
                            setNewStatusTransaksi(value)
                          }
                          value={newStatusTransaksi}
                          required>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status transaksi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Success">Success</SelectItem>
                            <SelectItem value="Processing">
                              Processing
                            </SelectItem>
                            <SelectItem value="Failed">Failed</SelectItem>
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

          {/* Edit Rental Modal */}
          {isEditModalOpen && selectedRental && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Edit Rental</CardTitle>
                  <CardDescription>Edit data rental.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEditRental}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Customer
                        </label>
                        <Select
                          onValueChange={(value) => setNewIdCust(value)}
                          value={newIdCust}
                          required>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih customer" />
                          </SelectTrigger>
                          <SelectContent>
                            {customers.map((customer) => (
                              <SelectItem
                                key={customer.id_cust}
                                value={customer.id_cust.toString()}>
                                {customer.nama_cust}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Mobil
                        </label>
                        <Select
                          onValueChange={(value) => setNewIdMobil(value)}
                          value={newIdMobil}
                          required>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih mobil" />
                          </SelectTrigger>
                          <SelectContent>
                            {mobils.map((mobil) => (
                              <SelectItem
                                key={mobil.id_mobil}
                                value={mobil.id_mobil.toString()}>
                                {mobil.merk} {mobil.model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Karyawan
                        </label>
                        <Select
                          onValueChange={(value) => setNewIdKaryawan(value)}
                          value={newIdKaryawan}
                          required>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih karyawan" />
                          </SelectTrigger>
                          <SelectContent>
                            {karyawans.map((karyawan) => (
                              <SelectItem
                                key={karyawan.id_karyawan}
                                value={karyawan.id_karyawan.toString()}>
                                {karyawan.nama_karyawan}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Pembayaran
                        </label>
                        <Select
                          onValueChange={(value) => setNewIdPembayaran(value)}
                          value={newIdPembayaran}
                          required>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih pembayaran" />
                          </SelectTrigger>
                          <SelectContent>
                            {pembayarans.map((pembayaran) => (
                              <SelectItem
                                key={pembayaran.id_pembayaran}
                                value={pembayaran.id_pembayaran.toString()}>
                                Rp {pembayaran.total_biaya} -{" "}
                                {pembayaran.metode_bayar}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Tanggal Sewa
                        </label>
                        <Input
                          type="date"
                          value={newTanggalSewa}
                          onChange={(e) => setNewTanggalSewa(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Tanggal Kembali
                        </label>
                        <Input
                          type="date"
                          value={newTanggalKembali}
                          onChange={(e) => setNewTanggalKembali(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Status Transaksi
                        </label>
                        <Select
                          onValueChange={(value) =>
                            setNewStatusTransaksi(value)
                          }
                          value={newStatusTransaksi}
                          required>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status transaksi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Success">Success</SelectItem>
                            <SelectItem value="Processing">
                              Processing
                            </SelectItem>
                            <SelectItem value="Failed">Failed</SelectItem>
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

          {/* Details Rental Modal */}
          {isDetailsModalOpen && selectedRental && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Card className="w-full max-w-sm relative">
                <CardHeader className="flex justify-between items-center p-3">
                  <div>
                    <CardTitle className="text-lg">Detail Rental</CardTitle>
                    <CardDescription className="text-xs">
                      Informasi lengkap rental.
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-gray-500 hover:text-gray-700 p-1"
                    onClick={() => setIsDetailsModalOpen(false)}>
                    ✕
                  </Button>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-2 text-sm">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        ID Rental
                      </label>
                      <p>{selectedRental.id_rental}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Nama Mobil
                      </label>
                      <p>{selectedRental.nama_mobil}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Gambar
                      </label>
                      {selectedRental.gambar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={selectedRental.gambar}
                          alt={selectedRental.nama_mobil}
                          className="w-20 h-20 object-cover"
                        />
                      ) : (
                        <p className="text-xs">Tidak ada gambar</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Tanggal Bayar
                      </label>
                      <p> 
                        {selectedRental.tanggal_bayar
                        ? new Intl.DateTimeFormat("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(selectedRental.tanggal_bayar))
                        : "Tidak tersedia"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Total Biaya
                      </label>
                      <p>Rp {selectedRental.total_biaya.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Metode Bayar
                      </label>
                      <p>{selectedRental.metode_bayar}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Tanggal Sewa
                      </label>
                      <p>
                        {selectedRental.tanggal_sewa
                        ? new Intl.DateTimeFormat("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(selectedRental.tanggal_sewa))
                        : "Tidak tersedia"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Tanggal Kembali
                      </label>
                      <p>
                        {selectedRental.tanggal_kembali
                        ? new Intl.DateTimeFormat("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(selectedRental.tanggal_sewa))
                        : "Tidak tersedia"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Status Transaksi
                      </label>
                      <p>{selectedRental.status_transaksi}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Nama Customer
                      </label>
                      <p>{selectedRental.nama_cust || "Tidak ada customer"}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Nama Karyawan
                      </label>
                      <p>
                        {selectedRental.nama_karyawan || "Tidak ada karyawan"}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end p-3">
                  <Button
                    variant="outline"
                    className="text-sm px-3 py-1"
                    onClick={() => setIsDetailsModalOpen(false)}>
                    Tutup
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          {isDeleteConfirmOpen && selectedRental && (
            <AlertDialog
              open={isDeleteConfirmOpen}
              onOpenChange={setIsDeleteConfirmOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Hapus Rental</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus rental untuk mobil{" "}
                    {selectedRental.nama_mobil}? Tindakan ini tidak dapat
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