"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, addToCart, toggleFavorite } from "@/lib/api";
import ProductCarousel from "@/components/ProductCarousel";
import { useCustNotification } from "@/context/NotificationProvider";
import Spinner from "@/components/Spinner";
import { Button } from "antd";

export default function ProductsPage() {
  const custNotification = useCustNotification();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await getProducts();
        setProducts(response?.products || []);
      } catch (error: any) {
        custNotification.error(error?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ======================
  // Handle Add to Cart
  // ======================
  const handleAddToCart = async (productId: string) => {
    try {
      setLoadingProductId(productId);
      await addToCart(productId, 1);
      custNotification.success("Added to cart!");
    } catch (err: any) {
      custNotification.error(err.message || "Failed to add to cart");
    } finally {
      setLoadingProductId(null);
    }
  };

  // ======================
  // Handle Toggle Favorite
  // ======================
const handleToggleFavorite = async (productId: string) => {
    try {
      // Optimistic update for instant UI feedback
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, isFavorite: !p.isFavorite } : p
        )
      );

      // Call the API
      const res = await toggleFavorite(productId);

      // ✅ Key Change: Sync state with the definitive response from the backend.
      // The API now returns { isFavorite: boolean }, which is much cleaner.
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, isFavorite: res.isFavorite } : p
        )
      );
    } catch (err: any) {
      custNotification.error(err.message || "Failed to update favorites");
      // Optional: Revert optimistic update on error
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, isFavorite: !p.isFavorite } : p
        )
      );
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => {
          const finalPrice = product.price - product.discount;
          const isLoading = loadingProductId === product._id;

          return (
            <div
              key={product._id}
              className="bg-white border rounded-2xl shadow-sm hover:shadow-lg transition p-4 flex flex-col relative"
            >

              <Link href={`/products/${product._id}`}>
                <ProductCarousel product={product} />
              </Link>
              <div className="flex-1 flex flex-col">
                <Link href={`/products/${product._id}`}>
                  <h2 className="text-lg font-medium text-gray-800 line-clamp-2 hover:text-blue-600">
                    {product.name}
                  </h2>
                </Link>

                <div className="mt-2">
                  <span className="text-xl font-bold text-gray-900">
                    ₹{finalPrice}
                  </span>

                  {product.discount > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm line-through text-gray-500">
                        ₹{product.price}
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        {Math.round((product.discount / product.price) * 100)}% off
                      </span>
                    </div>
                  )}
                </div>
              </div>

             <div className="flex justify-between items-center mt-3">

               <Button
               type="primary"
                disabled={isLoading}
                onClick={() => handleAddToCart(product._id)}
              >
                {isLoading ? "Adding..." : "Add to Cart"}
              </Button>
                <Button
                  onClick={() => handleToggleFavorite(product._id)}
                >
                  {product?.isFavorite ? "❤️" : "🤍"}
                </Button>
             </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
