"use client";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Edit, Plus, PlusCircle, ShoppingBag } from "lucide-react";
import ProductContainer from "./ProductContainer";
import useCart from "@/lib/hooks/use-cart";
import { useCallback, useEffect, useState } from "react";
import UnitSelection from "../commons/UnitSelection";
import DeleteProductCart from "./DeleteProductCart";
import CancelModal from "./CancelModal";
import AddProductModal from "./AddProductModal";
import ExpensesModal from "./ExpensesModal";
import ProceedModal from "./ProceedModal";
import TransactionModal from "./TransactionModal";
import SuspendModal from "./SuspendModal";
import { Label } from '@/components/ui/label';
import { Input } from "../ui/input";
import { format } from "date-fns";
import { cn, debounce } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { fetchProductByNameSkuOrBarcode } from "@/lib/actions/product.actions";
import { toast } from "../ui/use-toast";
import { playErrorSound, playSuccessSound } from "@/lib/audio";
import { v4 as uuidv4 } from "uuid";

// Define the type for the selectedUnits state
type SelectedUnitsType = {
    [name: string]: string;
};

const PosContent = ({ brands, categories, units }) => {
    const cart = useCart();
    const [date, setDate] = useState(new Date());
    const [customer, setCustomer] = useState('Walk in Customer');
    const [searchQuery, setSearchQuery] = useState('');
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [shippingCharge, setShippingCharge] = useState(0);
    const [selectedUnit, setSelectedUnit] = useState<SelectedUnitsType>('');
    const [quantity, setQuantity] = useState(1)

    const findPrice = (prices: any[], unitId: string) => {
        const priceObj = prices?.find(price => price.name === unitId);
        return priceObj ? priceObj.price : 0;
    };


    const handleIncreaseQuantity = (productId: string) => {
        cart.increaseQuantity(productId);
    };

    const handleDecreaseQuantity = (productId: string) => {
        cart.decreaseQuantity(productId);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const debouncedFetchProduct = useCallback(
        debounce(async (query: string) => {
            if (query.trim().length >= 2) {
                try {
                    const product = await fetchProductByNameSkuOrBarcode(query.trim());
                    if (product) {
                        playSuccessSound()
                        cart.addItem({
                            id: uuidv4(),
                            item: product,
                            quantity,
                            unit:product.prices[0].name
                        });
                        setSearchQuery("")
                    }
                } catch (error) {
                    console.error("Error searching for product:", error);
                    playErrorSound()
                    setSearchQuery("")
                    toast({
                        title: "Product not found",
                        description: "Product not found. Please try again.",
                        variant: "destructive",
                    })
                }
            }
        }, 400), // Adjust the delay as needed
        []
    );

    useEffect(() => {
        debouncedFetchProduct(searchQuery);
    }, [searchQuery, debouncedFetchProduct]);

    // useEffect(() => {
    //     const fetchProduct = async () => {
    //         if (searchQuery.trim().length >= 2) {
    //             try {
    //                 const product = await fetchProductByNameSkuOrBarcode(searchQuery.trim());
    //                 console.log(product, "search product")
    //                 if (product) {
    //                     cart.addItem({
    //                         item: product,
    //                         quantity
    //                     });
    //                     setSearchQuery("")
    //                 }
    //             } catch (error) {
    //                 console.error("Error searching for product:", error);
    //             }
    //         }
    //     };

    //     fetchProduct();
    // }, [searchQuery]);


    
    const total = cart.cartItems.reduce((acc, cartItem) => {
        return acc + findPrice(cartItem.item.prices, cartItem.unit) * cartItem.quantity;
    }, 0);
    const totalRounded = parseFloat(total.toFixed(2));
    const overallTotal = (totalRounded + shippingCharge + tax) - discount;
    const overallRounded = parseFloat(overallTotal.toFixed(2));

    return (
        <>
            <div className="h-full relative">
                <div className="flex-1 md:overflow-hidden h-full">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-8 h-full p-4">
                        <div className="col-span-3 rounded-lg bg-gray-200 h-full relative px-4">
                            <div className="bg-gray-200 p-4 sticky top-0 z-30">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="customer">Customer Name</Label>
                                        <Input
                                            type="text"
                                            id="customer"
                                            value={customer}
                                            onChange={(e) => setCustomer(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="search">Search Product</Label>
                                        <Input
                                            type="text"
                                            id="search"
                                            placeholder="product(barcode or sku) "
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="date">Sales Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute overflow-auto w-[96%] max-h-[75%] h-full p-4 bg-transparent rounded-lg">
                                <h2 className="text-lg font-bold mb-4 border-b-2">Products In Cart</h2>
                                {cart.cartItems.length === 0 && (
                                    <div className="w-full mt-24 flex justify-center">
                                        <div className="p-6">
                                            <div className="flex flex-col items-center gap-4 items-center">
                                                <h3 className="font-semibold text-xl md:text-3xl flex gap-2">Empty <ShoppingBag className="w-8 h-8" /></h3>
                                                <p className="text-center">No product added yet. Start to add for more sales</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <ul className="space-y-4">
                                    {cart.cartItems.map((product) => {

                                        return (
                                            <li key={product.item._id} className="p-4 flex justify-around items-center bg-gray-100 rounded-lg shadow">
                                                <div className="text-sm space-y-1">
                                                    <h2 className="font-semibold">{product.item.name}</h2>
                                                    <p className="text-xs text-gray-500">({product.item.sku})</p>
                                                </div>
                                                <div className="flex flex-col gap-2 items-center space-x-2 text-sm">
                                                    <div className="flex gap-4">
                                                        <button
                                                            onClick={() => handleDecreaseQuantity(product.id)}
                                                            className="px-2 py-1 bg-gray-300 rounded"
                                                        >
                                                            -
                                                        </button>
                                                        <p>Quantity: {product.quantity}</p>
                                                        <button
                                                            onClick={() => handleIncreaseQuantity(product.id)}
                                                            className="px-2 py-1 bg-gray-300 rounded"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <div>
                                                    <UnitSelection
                                                            selectedUnit={product.unit || product.item.prices[0]?.name}
                                                            units={product.item.prices}
                                                            onUnitChange={(value) => {
                                                                cart.updateUnit(product.id, value);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-sm">Subtotal: <span className="font-extrabold">Gh{product.quantity * findPrice(product.item.prices, (selectedUnit || product.unit as string))}</span></p>
                                                <DeleteProductCart itemId={product.id} />
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div className="bg-transparent rounded-lg absolute bottom-0 w-[96%] flex flex-col gap-4">
                                <div className="flex justify-around items-center">
                                    <div className="flex gap-2 text-sm">
                                        <h3 className="font-bold">Items:</h3>
                                        <p>{cart.cartItems.length}</p>
                                    </div>
                                    <div className="flex text-sm gap-2">
                                        <h3 className="font-bold">Total:</h3>
                                        <p>Gh{totalRounded}.00</p>
                                    </div>
                                </div>
                                <div className="flex justify-around items-center">
                                    <div className="flex gap-2 text-sm">
                                        <h3 className="font-bold">Discount(-):</h3>
                                        <button><Edit className="w-4 h-4" /></button>
                                        <p>000</p>
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        <h3 className="font-bold">Order Tax(+):</h3>
                                        <button><Edit className="w-4 h-4" /></button>
                                        <p>000</p>
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        <h3 className="font-bold">Shipping(+):</h3>
                                        <button><Edit className="w-4 h-4" /></button>
                                        <p>000</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <ProductContainer brands={brands} categories={categories} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center px-4 pb-2">
                <div className="flex gap-4 items-center">
                    <SuspendModal />
                    <ProceedModal products={cart.cartItems} total={overallRounded} items={cart.cartItems.length} />
                    <CancelModal />
                    <div>
                        <p className="font-bold">Total Payable: <span className="text-green-500">Gh{overallRounded}.00</span></p>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <ExpensesModal />
                    <TransactionModal />
                </div>
            </div>
        </>
    );
};

export default PosContent;
