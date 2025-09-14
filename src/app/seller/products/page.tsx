"use client";
import { CustomModal } from "@/components/customModel";
import ProductCarousel from "@/components/ProductCarousel";
import Spinner from "@/components/Spinner";
import { useCustNotification } from "@/context/NotificationProvider";
import { deleteProduct, getProducts } from "@/lib/api";
import { getUserFromLocalStorage } from "@/lib/clientAuth";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import AddEditProductModel from "@/components/AddEditProductModel";

// A simple card to display product info
const SellerProductCard = ({
  product,
  onDelete,
  onEdit,
}: {
  product: any;
  onDelete: (id: string) => void;
  onEdit: (product: any) => void;
}) => {
  const finalPrice = product.price - product.discount;
  return (
    <div className="bg-white border rounded-2xl shadow-sm transition-shadow hover:shadow-lg p-4 flex flex-col">
      <div>
        <ProductCarousel product={product} />
      </div>
      <div className="flex-1 flex flex-col">
        <h2 className="text-lg font-medium text-gray-800 line-clamp-2">
          {product.name}
        </h2>
        <div className="mt-2">
          <span className="text-xl font-bold text-gray-900">₹{finalPrice}</span>
          {product.discount > 0 && (
            <span className="text-sm line-through text-gray-500 ml-2">
              ₹{product.price}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">Stock: {product.stock}</p>
      </div>
      <div className="flex justify-between items-center mt-4 border-t pt-3">
        <Button onClick={() => onEdit(product)}>Edit</Button>
        <Button danger onClick={() => onDelete(product._id)}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default function SellerProductsPage() {
  const custNotification = useCustNotification();
  const user = getUserFromLocalStorage();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // modal states for Add/Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const fetchProducts = async (sellerId: string) => {
    try {
      const response = await getProducts(sellerId);
      setProducts(response?.products || []);
      custNotification.success("Products fetched successfully!");
    } catch (error: any) {
      if (!error.message.includes("No products found")) {
        custNotification.error(error?.message || "Something went wrong");
      } else {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchProducts(user?._id);
    } else {
      setLoading(false);
    }
  }, []);

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete);
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete));
      custNotification.success("Product deleted successfully!");
    } catch (err: any) {
      custNotification.error(err.message || "Failed to delete product");
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null); // 👈 clear product for new
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    if (user?._id) fetchProducts(user._id);
  };

  if (loading) return <Spinner />;

  if (!user) {
    return (
      <div className="text-center py-20">
        <p>Please log in to manage your products.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Delete confirmation modal */}
      <CustomModal
        isOpen={isDeleteModalOpen}
        title="Confirm Deletion"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      >
        <p>
          Are you sure you want to delete this product? This action cannot be
          undone.
        </p>
      </CustomModal>

      {/* Add/Edit modal */}
      <AddEditProductModel
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleSuccess}
        product={editingProduct}
      />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Products</h1>
        <Button type="primary" ghost onClick={handleAddProduct}>
          Add New Product
        </Button>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <SellerProductCard
              key={product._id}
              product={product}
              onDelete={handleDeleteClick}
              onEdit={handleEditProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-600">You haven't added any products yet.</p>
          <p className="text-gray-500 mt-2">
            Click "Add New Product" to get started!
          </p>
        </div>
      )}
    </div>
  );
}
