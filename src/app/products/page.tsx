// app/products/page.tsx
import Link from "next/link";
import { getProducts } from "@/lib/api";
import ProductCarousel from "@/components/ProductCarousel";

export default async function ProductsPage() {
  const { products } = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => {
          const finalPrice = product.price - product.discount;

          return (
            <div
              key={product._id}
              className="bg-white border rounded-2xl shadow-sm hover:shadow-lg transition p-4 flex flex-col"
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

              <button
                className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-xl 
                           flex items-center justify-center gap-2 
                           hover:bg-blue-700 transition font-medium"
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
