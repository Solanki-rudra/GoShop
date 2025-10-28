// app/favorites/page.tsx

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getFavorites, addToCart, toggleFavorite } from "@/lib/api"; // Use getFavorites
import ProductCarousel from "@/components/ProductCarousel";
import { useCustNotification } from "@/context/NotificationProvider";
import Spinner from "@/components/Spinner";
import { Button } from "antd";

export default function FavoritesPage() {
  const custNotification = useCustNotification();
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await getFavorites(); // Fetch favorite products
        setFavoriteProducts(response?.favorites || []);
      } catch (error: any) {
        custNotification.error(error?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ======================
  // Handle Add to Cart (Identical to ProductsPage)
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
      await toggleFavorite(productId);
      
      // ✅ Key Change: When a user unfavorites an item on this page,
      // we remove it from the list instead of just toggling its icon.
      setFavoriteProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
      custNotification.success("Removed from favorites");
    } catch (err: any) {
      custNotification.error(err.message || "Failed to update favorites");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Favorites</h1>

      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product: any) => {
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
                          {Math.round(
                            (product.discount / product.price) * 100
                          )}
                          % off
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    disabled={isLoading}
                    onClick={() => handleAddToCart(product._id)}
                    className="w-[200px] bg-blue-600 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition font-medium disabled:opacity-50"
                  >
                    {isLoading ? "Adding..." : "Add to Cart"}
                  </button>
                <Button
                  onClick={() => handleToggleFavorite(product._id)}
                >
                  ❤️
                </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">You have no favorite items yet.</p>
          <Link href="/products">
            <span className="mt-4 inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition">
              Explore Products
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}