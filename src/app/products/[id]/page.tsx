"use client";

import { getProduct, toggleFavorite, addToCart } from "@/lib/api";
import ProductCarousel from "@/components/ProductCarousel";
import { useCustNotification } from "@/context/NotificationProvider";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { Button } from "antd";

export default function Page({ params }: { params: { id: string } }) {
  const custNotification = useCustNotification();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await getProduct(params?.id);
        // ✅ Key Change: The `isFavorite` property is now part of the product object
        setProduct(response?.product || null);
      } catch (error: any) {
        custNotification.error(error?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, [params?.id]);

  if (loading || !product) return <Spinner />;

  const finalPrice = product.price - product.discount;

  // ======================
  // Toggle Favorite
  // ======================
  const handleToggleFavorite = async () => {
    if (!product) return;
    try {
      // Optimistic update for instant UI feedback
      setProduct((prev: any) => ({ ...prev, isFavorite: !prev.isFavorite }));

      const res = await toggleFavorite(product._id);

      // ✅ Key Change: Sync with the definitive boolean response from the API.
      setProduct((prev: any) =>
        prev ? { ...prev, isFavorite: res.isFavorite } : prev
      );
      custNotification.success(
        res.isFavorite ? "Added to favorites" : "Removed from favorites"
      );
    } catch (err: any) {
      custNotification.error(err.message || "Failed to update favorites");
      // Optional: Revert optimistic update on error
      setProduct((prev: any) => ({ ...prev, isFavorite: !prev.isFavorite }));
    }
  };


  // ======================
  // Handle Add to Cart
  // ======================
  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, 1);
      custNotification.success("Added to cart!");
    } catch (err: any) {
      custNotification.error(err.message || "Failed to add to cart");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Carousel / Media */}
        <div className="relative">
          <ProductCarousel product={product} />

        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl m-0 font-bold text-gray-800">
                {product.name}
              </h1>
              {/* Heart Icon */}
              <Button
                onClick={handleToggleFavorite}
                type="text"
              >
                {product.isFavorite ? "❤️" : "🤍"}
              </Button>
            </div>
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Price Section */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-green-600">
                ₹{finalPrice}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="ml-3 text-lg text-gray-500 line-through">
                    ₹{product.price}
                  </span>
                  <span className="ml-3 text-sm font-medium text-green-600">
                    {Math.round((product.discount / product.price) * 100)}% off
                  </span>
                </>
              )}
            </div>

            {/* Stock & Category */}
            <p className="mb-2">
              <span className="font-semibold">Stock:</span>{" "}
              {product.stock > 0 ? (
                <span className="text-green-600">
                  In Stock ({product.stock})
                </span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Category:</span>{" "}
              {product.category}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
