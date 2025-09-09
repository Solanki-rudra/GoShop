import { getProduct } from "@/lib/api";
import ProductCarousel from "@/components/ProductCarousel";

export default async function Page({ params }: { params: { id: string } }) {
  const { product } = await getProduct(params.id);
  const finalPrice = product.price - product.discount;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Carousel / Media */}
        <div>
          <ProductCarousel product={product} />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Price Section */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-green-600">
                ₹{finalPrice}
              </span>
              {product.discount > 0 && (
                <span className="ml-3 text-lg text-gray-500 line-through">
                  ₹{product.price}
                </span>
              )}
              {product.discount > 0 && (
                <span className="ml-3 text-sm font-medium text-green-600">
                  {Math.round((product.discount / product.price) * 100)}% off
                </span>
              )}
            </div>

            {/* Stock & Category */}
            <p className="mb-2">
              <span className="font-semibold">Stock:</span>{" "}
              {product.stock > 0 ? (
                <span className="text-green-600">In Stock ({product.stock})</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Category:</span> {product.category}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
              Add to Cart
            </button>
            <button className="flex-1 px-6 py-3 rounded-xl border border-gray-400 hover:bg-gray-100 font-medium transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* More Images / Gallery */}
      {product.images.length > 1 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">More Images</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.slice(1).map((img: string, i: number) => (
              <div
                key={i}
                className="relative w-32 h-32 flex-shrink-0 border rounded-lg overflow-hidden"
              >
                <img
                  src={img}
                  alt={`${product.name}-${i}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
