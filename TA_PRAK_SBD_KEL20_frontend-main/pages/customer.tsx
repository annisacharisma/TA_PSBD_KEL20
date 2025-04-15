/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/customer.tsx
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

interface Customer {
  id_cust: number;
  nama_cust: string;
  alamat_cust: string;
  telp_cust: string;
  no_ktp: string;
}

export default function Customer() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newNamaCust, setNewNamaCust] = useState<string>("");
  const [newAlamatCust, setNewAlamatCust] = useState<string>("");
  const [newTelpCust, setNewTelpCust] = useState<string>("");
  const [newNoKtp, setNewNoKtp] = useState<string>("");
  const router = useRouter();

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/customer");
      setCustomers(res.data);
      setFilteredCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    const filtered = customers.filter((customer) =>
      customer.nama_cust.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setCurrentPage(1);
  }, [filter, customers]);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/customer", {
        nama_cust: newNamaCust,
        alamat_cust: newAlamatCust,
        telp_cust: newTelpCust,
        no_ktp: newNoKtp,
      });
      setNewNamaCust("");
      setNewAlamatCust("");
      setNewTelpCust("");
      setNewNoKtp("");
      setIsAddModalOpen(false);
      fetchCustomers();
    } catch (error: any) {
      console.error("Error adding customer:", error);
      if (error.response && error.response.data.message) {
        alert(error.response.data.message); // Display backend error message (e.g., duplicate phone or KTP)
      } else {
        alert("Gagal menambahkan customer");
      }
    }
  };

  const handleEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    try {
      await api.put(`/customer/${selectedCustomer.id_cust}`, {
        nama_cust: newNamaCust,
        alamat_cust: newAlamatCust,
        telp_cust: newTelpCust,
        no_ktp: newNoKtp,
      });
      setNewNamaCust("");
      setNewAlamatCust("");
      setNewTelpCust("");
      setNewNoKtp("");
      setIsEditModalOpen(false);
      setSelectedCustomer(null);
      fetchCustomers();
    } catch (error: any) {
      console.error("Error editing customer:", error);
      if (error.response && error.response.data.message) {
        alert(error.response.data.message); // Display backend error message (e.g., duplicate phone or KTP)
      } else {
        alert("Gagal mengedit customer");
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedCustomer) return;
    try {
      await api.delete(`/customer/${selectedCustomer.id_cust}`);
      setIsDeleteConfirmOpen(false);
      setSelectedCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Gagal menghapus customer");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

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
              placeholder="Filter nama customer..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-1/3"
            />
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setIsAddModalOpen(true)}>Tambah Customer</Button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Customer</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>No Telepon</TableHead>
                  <TableHead>No KTP</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((customer) => (
                    <TableRow key={customer.id_cust}>
                      <TableCell>{customer.nama_cust}</TableCell>
                      <TableCell>{customer.alamat_cust}</TableCell>
                      <TableCell>{customer.telp_cust}</TableCell>
                      <TableCell>{customer.no_ktp}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          className="mr-2"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setNewNamaCust(customer.nama_cust);
                            setNewAlamatCust(customer.alamat_cust);
                            setNewTelpCust(customer.telp_cust);
                            setNewNoKtp(customer.no_ktp);
                            setIsEditModalOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setIsDeleteConfirmOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Tidak ada data customer.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              {filteredCustomers.length} data customer.
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Add Customer Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Tambah Customer</CardTitle>
                  <CardDescription>Tambahkan customer baru.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCustomer}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Nama Customer
                        </label>
                        <Input
                          placeholder="Masukkan nama customer"
                          value={newNamaCust}
                          onChange={(e) => setNewNamaCust(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Alamat
                        </label>
                        <Input
                          placeholder="Masukkan alamat customer"
                          value={newAlamatCust}
                          onChange={(e) => setNewAlamatCust(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          No Telepon
                        </label>
                        <Input
                          placeholder="Masukkan nomor telepon"
                          value={newTelpCust}
                          onChange={(e) => setNewTelpCust(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          No KTP
                        </label>
                        <Input
                          placeholder="Masukkan nomor KTP"
                          value={newNoKtp}
                          onChange={(e) => setNewNoKtp(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <CardFooter className="mt-6 flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Tambah</Button>
                    </CardFooter>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Edit Customer Modal */}
          {isEditModalOpen && selectedCustomer && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Edit Customer</CardTitle>
                  <CardDescription>Edit data customer.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEditCustomer}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Nama Customer
                        </label>
                        <Input
                          placeholder="Masukkan nama customer"
                          value={newNamaCust}
                          onChange={(e) => setNewNamaCust(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Alamat
                        </label>
                        <Input
                          placeholder="Masukkan alamat customer"
                          value={newAlamatCust}
                          onChange={(e) => setNewAlamatCust(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          No Telepon
                        </label>
                        <Input
                          placeholder="Masukkan nomor telepon"
                          value={newTelpCust}
                          onChange={(e) => setNewTelpCust(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          No KTP
                        </label>
                        <Input
                          placeholder="Masukkan nomor KTP"
                          value={newNoKtp}
                          onChange={(e) => setNewNoKtp(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <CardFooter className="mt-6 flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditModalOpen(false)}
                      >
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
          {isDeleteConfirmOpen && selectedCustomer && (
            <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Hapus Customer</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus customer {selectedCustomer.nama_cust}?
                    Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsDeleteConfirmOpen(false)}>
                    Batal
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
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