"use client"
import useCart from '@/lib/hooks/use-cart';
import Image from 'next/image';
import React, { useState } from 'react';


// types/Product.ts
export interface Product {
    _id: string;
    name: string;
    sku: string;
    imageUrl: string;
    prices:{
        name: string;
        price: number;
    }[]
}


interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [quantity, setQuantity] = useState(1)
    const cart = useCart()
    return (
        <button onClick={() => {
            cart.addItem({
                item: product,
                quantity,
                unit:product.prices[0].name
            })
        }} className="bg-white shadow-md rounded-lg p-1">
            <Image
                src="/placeholder.jpg"
                alt={product.name}
                width={100}
                height={100}
                className="w-24 h-16 object-cover rounded-md mb-1 mx-auto"
            />
            <h2 className="text-[12px] font-bold mb-2">{product.name}</h2>
            <p className="text-[10px] text-gray-500">SKU: {product.sku}</p>
        </button>
    );
};

export default ProductCard;
