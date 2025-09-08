// app/products/page.tsx
import { BASE_URL } from "@/config/api";
import Image from "next/image";
import Link from "next/link";

const getProducts = async () => {
    const res = await fetch(`${BASE_URL}/api/products`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
};

export default async function ProductsPage() {
    const { products } = await getProducts();

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Products</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product: any) => (
                    <Link key={product._id} href={`/products/${product._id}`}>
                        <div
                            key={product._id}
                            className="border rounded-2xl shadow-sm hover:shadow-lg transition p-4"
                        >
                            <div className="relative w-full h-56 mb-4">
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover rounded-xl"
                                />
                            </div>

                            <h2 className="text-lg font-semibold">{product.name}</h2>

                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold">₹{product.price}</span>
                                {product.discount > 0 && (
                                    <span className="text-sm text-green-600">
                                        -₹{product.discount}
                                    </span>
                                )}
                            </div>
                            <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
                                Add to Cart
                            </button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
