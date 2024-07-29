    "use client";

    import { useCallback, useEffect, useRef, useState } from "react";
    import BrandSelection from "../commons/BrandSelection";
    import CategorySelection from "../commons/CategorySelection";
    import { fetchProductInfinity } from "@/lib/actions/product.actions";
    import ProductCard from "./ProductCard";
    import { Separator } from "../ui/separator";
    import { Switch } from "../ui/switch";
    import {
        Tooltip,
        TooltipContent,
        TooltipProvider,
        TooltipTrigger,
    } from "@/components/ui/tooltip";
    import { Input } from "../ui/input";
    import { debounce } from "@/lib/utils";
    import { useRouter } from "next/navigation";

    // Define types for props and state
    interface Product {
        _id: string;
        name: string;
        sku: string;
        imageUrl: string;
        prices: {
            name: string;
            price: number
        }[]
    }

    interface ProductContainerProps {
        brands: string[];
        categories: string[];
    }

    const ProductContainer: React.FC<ProductContainerProps> = ({ brands, categories }) => {
        const [selectedBrand, setSelectedBrand] = useState<string>("");
        const [selectedCategory, setSelectedCategory] = useState<string>("");
        const [products, setProducts] = useState<Product[]>([]);
        const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
        const [page, setPage] = useState<number>(1);
        const [loading, setLoading] = useState<boolean>(false);
        const [hasMore, setHasMore] = useState<boolean>(true);
        const observer = useRef<IntersectionObserver | null>(null);
        const [checking, setChecking] = useState<boolean>(() => {
            const savedChecking = localStorage.getItem('checking');
            return savedChecking ? JSON.parse(savedChecking) : false;
        });
        const [searchQuery, setSearchQuery] = useState<string>("");

        const router = useRouter();

        const limit = 100;
        const productSet = useRef<Set<string>>(new Set()); // Track unique product IDs

        const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
        };

        const filterProducts = useCallback((query: string) => {
            if (query.trim().length >= 2) {
                const filtered = products.filter(product =>
                    product.name.toLowerCase().includes(query.trim().toLowerCase())
                );
                setFilteredProducts(filtered);
            } else {
                setFilteredProducts(products);
            }
        }, [products]);

        useEffect(() => {
            filterProducts(searchQuery);
        }, [searchQuery, filterProducts]);

        const lastProductElementRef = useCallback((node: HTMLDivElement) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        }, [loading, hasMore]);

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetchProductInfinity(page, limit);
                const newProducts = response.products.filter((product: Product) => !productSet.current.has(product._id));

                // Add new product IDs to the set
                newProducts.forEach((product: Product) => productSet.current.add(product._id));

                setProducts((prevProducts) => [...prevProducts, ...newProducts]);
                setFilteredProducts((prevProducts) => [...prevProducts, ...newProducts]);
                setHasMore(newProducts.length > 0);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchProducts();
        }, [page]);

        const handleSwitchChange = (checked: boolean) => {
            setChecking(checked);
            if (typeof window !== "undefined") {
                localStorage.setItem('checking', JSON.stringify(checked));
            }
        };


        return (
            <div className="rounded-lg bg-gray-200 h-full overflow-auto p-4">
                <div className="bg-gray-200 p-4 sticky top-0 z-30">
                    <div className="flex gap-4 items-center">
                        {checking ? (
                            <div className="w-full flex gap-4">
                                <div>
                                    <BrandSelection SelectedBrand={(value) => setSelectedBrand(value)} brands={brands} />
                                </div>
                                <div>
                                    <CategorySelection SelectedCategory={(value) => setSelectedCategory(value)} categories={categories} />
                                </div>
                            </div>
                        ) : (
                            <div className="w-full">
                                <Input
                                    type="text"
                                    id="search"
                                    placeholder="Search product by name/sku/barcode"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        )}
                        <div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="bg-white p-1 shadow-lg rounded-md items-center text-center">
                                            <Switch checked={checking} onCheckedChange={handleSwitchChange} />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Filter Products by Brand name and Category</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
                <div className="overflow-auto max-h-[75%] p-4 bg-transparent rounded-lg">
                    <h2 className="text-lg font-bold mb-4">Products</h2>
                    <Separator />
                    <div className="grid grid-cols-4 gap-4">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => {
                                if (filteredProducts.length === index + 1) {
                                    return <div ref={lastProductElementRef} key={product._id}><ProductCard product={product} /></div>;
                                } else {
                                    return <ProductCard key={product._id} product={product} />;
                                }
                            })
                        ) : (
                            <p className="w-full text-center font-bold columns-4">No products found</p>
                        )}
                        {loading && <p>Loading...</p>}
                    </div>
                </div>
            </div>
        );
    };

    export default ProductContainer;
