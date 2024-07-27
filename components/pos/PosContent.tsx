"use client"
import { Button } from "@/components/ui/button";
import { Clock, DollarSignIcon, Edit, HandCoins, Pause, Plus, PlusCircle } from "lucide-react";
import ProductContainer from "./ProductContainer";
import useCart from "@/lib/hooks/use-cart";
import { useState } from "react";

const PosContent = ({ brands, categories }) => {
    const cart = useCart();

    const handleIncreaseQuantity = (productId) => {
        cart.increaseQuantity(productId);
    };

    const handleDecreaseQuantity = (productId) => {
        cart.decreaseQuantity(productId);
    };

    const total = cart.cartItems.reduce((acc, cartItem) => acc + cartItem.item.prices[0].price * cartItem.quantity, 0);
    const totalRounded = parseFloat(total.toFixed(2));

    return (
        <>
            <div className="h-full relative">
                <div className="flex-1 md:overflow-hidden h-full">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 h-full p-4">
                        <div className="col-span-2 rounded-lg bg-gray-200 h-full relative px-4">
                            <div className="bg-gray-200 p-4 sticky top-0 z-30">
                                <form className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="walkInCustomer">
                                            Walk-in Customer
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="walkInCustomer"
                                            type="text"
                                            placeholder="Enter customer name"
                                        />
                                    </div>
                                    <div className=" relative">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="searchProduct">
                                            Search Product
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="searchProduct"
                                            type="text"
                                            placeholder="Eg. Name/SKU/Barcode"
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-9 right-3 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-700"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transactionDate">
                                            Date
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="transactionDate"
                                            type="date"
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="absolute overflow-auto w-[96%] max-h-[75%] h-full p-4 bg-transparent rounded-lg">
                                <h2 className="text-lg font-bold mb-4 border-b-2">Products In Cart</h2>
                                {cart.cartItems.length === 0 && (
                                    <div className="w-full mt-24 flex justify-center">
                                        <div className="p-6">
                                            <div className="flex flex-col items-center gap-4">
                                                <h3 className="font-semibold text-xl md:text-3xl">Oops! Its Empty</h3>
                                                <p className="text-center">No product added yet. Start to add for more sales</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <ul className="space-y-4">
                                    {cart?.cartItems.map((product) => (
                                        <li key={product?.item?._id} className="p-4 flex justify-around items-center bg-gray-100 rounded-lg shadow">
                                            <div className="text-sm">
                                                <h2 className=" font-semibold">{product?.item?.name}</h2>
                                                <p>{product.item.sku}</p>
                                            </div>
                                            <div className="flex flex-col gap-2 items-center space-x-2 text-sm">
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => handleDecreaseQuantity(product.item._id)}
                                                        className="px-2 py-1 bg-gray-300 rounded"
                                                    >
                                                        -
                                                    </button>
                                                    <p>Quantity: {product.quantity}</p>
                                                    <button
                                                        onClick={() => handleIncreaseQuantity(product.item._id)}
                                                        className="px-2 py-1 bg-gray-300 rounded"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="">
                                                    <select name="cars" id="cars" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                                        <option value="volvo">Volvo</option>
                                                        <option value="saab">Saab</option>
                                                        <option value="mercedes">Mercedes</option>
                                                        <option value="audi">Audi</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <p className="text-sm">Subtotal: ${product.quantity * product.item.price}</p>
                                            <button onClick={()=> cart.removeItem(product.item._id)} className=" p-2 bg-red-500 text-white rounded">
                                                Cancel
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-transparent rounded-lg absolute bottom-0 w-[96%] flex flex-col gap-4">
                                <div className="flex justify-around items-center">
                                    <div className="flex gap-2 text-sm">
                                        <h3 className="font-bold">Items:</h3>
                                        <p className="">{cart.cartItems.length}</p>
                                    </div>
                                    <div className="flex text-sm gap-2">
                                        <h3 className="font-bold">Total:</h3>
                                        <p className="">{totalRounded}.00</p>
                                    </div>
                                </div>
                                <div className="flex justify-around items-center">
                                    <div className="flex gap-2 text-sm">
                                        <h3 className="font-bold">Discount(-):</h3>
                                        <button><Edit className="w-4 h-4" /></button>
                                        <p className=""> 000</p>
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        <h3 className="font-bold">Order Tax(+):</h3>
                                        <button><Edit className="w-4 h-4" /></button>
                                        <p className=""> 000</p>
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        <h3 className="font-bold">Shipping(+):</h3>
                                        <button><Edit className="w-4 h-4" /></button>
                                        <p className=""> 000</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ProductContainer brands={brands} categories={categories} />
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center px-4 pb-2">
                <div className="flex gap-4 items-center">
                    <Button variant="outline" size="sm"><PlusCircle className="mr-2 w-4 h-4" />New Product</Button>
                    <Button className="bg-orange-500 hover:bg-orange-700" size="sm"><Pause className="mr-2 w-4 h-4" />Suspend</Button>
                    <Button className="bg-green-500 hover:bg-green-700" size="sm"><HandCoins className="mr-2 w-4 h-4" />Proceed Payment</Button>
                    <Button variant="destructive" size="sm">Cancel</Button>
                    <div className="">
                        <p className="font-bold">Total Payable: <span className="text-green-500">0</span></p>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <Button size="sm"><DollarSignIcon className="mr-2 w-4 h-4" />Expenses</Button>
                    <Button className="bg-blue-500 hover:bg-blue-700" size="sm"><Clock className="mr-2 w-4 h-4" />Recent Transactions</Button>
                </div>
            </div>
        </>
    );
};

export default PosContent;
