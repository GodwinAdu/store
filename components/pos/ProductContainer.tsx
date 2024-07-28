"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BrandSelection from "../commons/BrandSelection";
import CategorySelection from "../commons/CategorySelection";
import { fetchProductInfinity } from "@/lib/actions/product.actions";
import ProductCard from "./ProductCard";
import { Separator } from "../ui/separator";

const ProductContainer = ({ brands, categories }) => {
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver>();

    const limit = 20;
    const productSet = useRef(new Set()); // Track unique product IDs

    const lastProductElementRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetchProductInfinity(page, limit);
                console.log(response,"response: ");
                const newProducts = response.products.filter(product => !productSet.current.has(product._id));

                // Add new product IDs to the set
                newProducts.forEach(product => productSet.current.add(product._id));

                setProducts((prevProducts) => [...prevProducts, ...newProducts]);
                setHasMore(newProducts.length > 0);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page]);

    return (
        <div className="rounded-lg bg-gray-200 h-full overflow-auto p-4">
            <div className="bg-gray-200 p-4 sticky top-0 z-30">
                <form className="grid grid-cols-2 gap-4">
                    <div>
                        <BrandSelection SelectedBrand={(value) => setSelectedBrand(value)} brands={brands} />
                    </div>
                    <div>
                        <CategorySelection SelectedCategory={(value) => setSelectedCategory(value)} categories={categories} />
                    </div>
                </form>
            </div>
            <div className="overflow-auto max-h-[75%] p-4 bg-transparent rounded-lg">
                <h2 className="text-lg font-bold mb-4">Products</h2>
                <Separator />
                <div className="grid grid-cols-3 gap-4">
                    {products.map((product, index) => {
                        if (products.length === index + 1) {
                            return <div ref={lastProductElementRef} key={product._id}><ProductCard product={product} /></div>;
                        } else {
                            return <ProductCard key={product._id} product={product} />;
                        }
                    })}
                    {loading && <p>Loading...</p>}
                </div>
            </div>
        </div>
    );
};

export default ProductContainer;
