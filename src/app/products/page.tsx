"use client";
import React, { useEffect, useState } from "react";
import sanityClient from "@sanity/client";
import Image from "next/image";

import { Josefin_Sans} from "next/font/google";
import Navbar from "../components/navbar";
import Navbar2 from "../components/navbar2";

const josefin1 = Josefin_Sans({
  subsets: ["latin"],
});

const sanity = sanityClient({
  projectId: "tgfvld8n",
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: true,
});

interface Product {
  _id: string;
  name: string; 
  price: number;
  description: string;
  discountPercentage: number;
  imageUrl: string;
  tags: string[];
}

const ProductCards: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const query = `
        *[_type == "product"] {
          _id,
          name,  // Changed from 'title' to 'name'
          price,
          description,
          discountPercentage,
          "imageUrl": image.asset->url,
          tags
        }
      `;
      const data = await sanity.fetch(query);
      console.log("Fetched data:", data);
      setProducts(data);
    } catch (error) {
      console.error("Error while fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md">
                  No Image Available
                </div>
              )}

              <div className="mt-4 p-2">
                <h2 className="text-lg font-semibold">{product.name}</h2> 
                <p className="text-slate-800 mt-2 text-sm">
                  {product.description.length > 100
                    ? product.description.substring(0, 100) + "..."
                    : product.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-slate-600 font-bold">${product.price}</p>
                    {product.discountPercentage > 0 && (
                      <p className="text-sm text-green-400">
                        {product.discountPercentage}% OFF
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-slate-200 text-black rounded-full px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Loading products...</p>
        )}
      </div>
    </div>
  );
};

export default ProductCards;