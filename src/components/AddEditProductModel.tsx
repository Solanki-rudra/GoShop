"use client";
import { PRODUCT_CATEGORIES } from "@/constants/enum";
import { useCustNotification } from "@/context/NotificationProvider";
import { createProduct, updateProduct } from "@/lib/api";
import { getUserFromLocalStorage } from "@/lib/clientAuth";
import { Button } from "antd";
import { useEffect, useState } from "react";

const FormInput = ({ id, label, ...props }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const FormTextArea = ({ id, label, ...props }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      id={id}
      {...props}
      rows={4}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

export default function AddEditProductModel({
  isOpen,
  onClose,
  onSuccess,
  product, // 👈 optional product for editing
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any;
}) {
  const custNotification = useCustNotification();
  const user = getUserFromLocalStorage();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "0",
    stock: "1",
    category: PRODUCT_CATEGORIES[0],
    images: "",
    video: "",
  });

  // 👇 prefill data when editing
  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        price: String(product.price),
        discount: String(product.discount ?? 0),
        stock: String(product.stock ?? 1),
        images: (product.images || []).join(", "),
        video: product.video || "",
      });
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      custNotification.error("You must be logged in.");
      return;
    }
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount),
        stock: parseInt(formData.stock, 10),
        images: formData.images
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url),
        sellerId: user._id,
      };

      if (product?._id) {
        await updateProduct(product._id, productData);
        custNotification.success("Product updated successfully!");
      } else {
        await createProduct(productData);
        custNotification.success("Product created successfully!");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      custNotification.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          {product ? "Edit Product" : "Add New Product"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput id="name" name="name" label="Product Name" value={formData.name} onChange={handleChange} required />
          <FormTextArea id="description" name="description" label="Description" value={formData.description} onChange={handleChange} required />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput id="price" name="price" label="Price (₹)" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} required />
            <FormInput id="discount" name="discount" label="Discount (₹)" type="number" min="0" step="0.01" value={formData.discount} onChange={handleChange} />
            <FormInput id="stock" name="stock" label="Stock" type="number" min="1" value={formData.stock} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <FormTextArea id="images" name="images" label="Image URLs (comma-separated)" value={formData.images} onChange={handleChange} />
          <FormInput id="video" name="video" label="Video URL (Optional)" value={formData.video} onChange={handleChange} />

          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={onClose} disabled={loading}>Cancel</Button>
            <Button htmlType="submit" type="primary" disabled={loading}>
              {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
