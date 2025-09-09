import { getProduct } from "@/lib/api";
import Image from "next/image";



export default async function Page({ params }: { params: { id: string } }) {
  const { product } = await getProduct(params.id);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Product Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative w-full h-96">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain rounded-lg"
          />
        </div>
        <div className="flex flex-col justify-between">
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="mb-4">
              <span className="text-2xl font-semibold text-green-600">
                ₹{product.price - product.discount}
              </span>
              {product.discount > 0 && (
                <span className="text-gray-500 line-through ml-3">₹{product.price}</span>
              )}
            </div>

            <p className="mb-2">
              <span className="font-semibold">Stock:</span> {product.stock}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Category:</span> {product.category}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Add to Cart
            </button>
            <button className="px-6 py-2 rounded-lg border border-gray-400 hover:bg-gray-100">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Extra product gallery */}
      {product.images.length > 1 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">More Images</h2>
          <div className="flex gap-4">
            {product.images.slice(1).map((img: string, i: number) => (
              <div key={i} className="relative w-32 h-32 border rounded-lg">
                <Image
                  src={img}
                  alt={`${product.name}-${i}`}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
