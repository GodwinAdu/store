"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSignIcon, HandCoins, PlusCircle, X } from "lucide-react";
import useCart from "@/lib/hooks/use-cart";
import { toast } from "../ui/use-toast";
import { playWarningSound } from "@/lib/audio";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

const date = new Date().toLocaleDateString();
const address = "123 Main Street, City, Country";

const ProceedModal = ({ total, items, products }: { total: number; items: number; products: any[] }) => {
  const cart = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [receive, setReceive] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const invoiceRef = useRef(null);

  const findPrice = (prices: any[], unit: string) => {
    const priceObj = prices?.find(price => price.name === unit);
    return priceObj ? priceObj.price : 0;
  };

  useEffect(() => {
    calculateBalanceAndChange();
  }, [receive]);

  const calculateBalanceAndChange = () => {
    const newBalance = receive - total;
    setBalance(newBalance);
    setChange(newBalance >= 0 ? newBalance : 0);
  };

  const handleProceedClick = () => {
    if (cart.cartItems.length === 0) {
      playWarningSound();
      toast({
        title: "Warning !...",
        description: "Cart is empty. Add some items to proceed to payment.",
        variant: "warning"
      });
    } else {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handlePrint = () => {
    const printContents = invoiceRef?.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    setIsOpen(false)
    cart.clearCart();
    window.location.reload();
  };

  return (
    <>
      <Button onClick={handleProceedClick} className="bg-green-500 hover:bg-green-700" size="sm">
        <HandCoins className="mr-2 w-4 h-4" />
        Proceed Payment
      </Button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg h-[80%] w-[80%] mx-auto my-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold mb-2">Proceed Payment</h2>
              <button aria-label="button-close" className="" onClick={handleClose}>
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-col-1 md:grid-cols-4 gap-4 py-5">
              <Card className="col-span-3 py-4">
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-5">
                    <div className="flex gap-2">
                      <div className="space-y-4">
                        <Label htmlFor="amount">Amount: *</Label>
                        <Input
                          type="text"
                          id="amount"
                          value={total}
                          disabled
                          readOnly
                          className="bg-gray-200"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label htmlFor="receive">Receive: *</Label>
                        <Input
                          type="number"
                          id="receive"
                          min={0}
                          value={receive}
                          onChange={(e) => setReceive(parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="account">Accounts: *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="payment-method">Payment Method: *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select</SelectLabel>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="others">Others</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <Label htmlFor="receive">Payment Note: *</Label>
                    <Textarea
                      className="h-56"
                      placeholder="A little description about payment (Optional)"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-orange-500">
                <CardContent className="mx-auto py-4 px-6">
                  <div className="text-white font-bold">
                    <p className="text-lg">Total Items:</p>
                    <h2 className="text-xl">{items}</h2>
                  </div>
                  <Separator className="my-4" />
                  <div className="text-white font-bold">
                    <p className="text-lg">Total Payable:</p>
                    <h2 className="text-xl">Gh {total}.00</h2>
                  </div>
                  <Separator className="my-4" />
                  <div className="text-white font-bold">
                    <p className="text-lg">Total Paying:</p>
                    <h2 className="text-xl">Gh {receive === 0 ? total : receive}.00</h2>
                  </div>
                  <Separator className="my-4" />
                  <div className="text-white font-bold">
                    <p className="text-lg">Change Return:</p>
                    <h2 className="text-xl">Gh {change}.00</h2>
                  </div>
                  <Separator className="my-4" />
                  <div className="text-white font-bold">
                    <p className="text-lg">Balance:</p>
                    <h2 className="text-xl">Gh {balance}.00</h2>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex gap-4 justify-end">
              <Button onClick={handleClose} className="bg-red-500 hover:bg-red-700" size="sm">
                Cancel
              </Button>
              <Button onClick={handlePrint} className="bg-blue-500 hover:bg-blue-700" size="sm">
                Print Invoice
              </Button>
              <Button onClick={handleClose} className="bg-green-500 hover:bg-green-700" size="sm">
                Finalize Payment
              </Button>
            </div>
            <div style={{ display: "none" }}>
              <div ref={invoiceRef}>
                <div id="invoice" className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg space-y-4">
                  <div className="text-center border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-700">Invoice</h2>
                    <p className="text-gray-500">Thank you for your purchase!</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-semibold text-gray-800">{date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-semibold text-gray-800">{address}</span>
                    </div>
                  </div>
                  <div className="border-t py-4">
                    <h3 className="text-lg font-bold text-gray-700">Products</h3>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2">Item</th>
                          <th className="py-2">Unit</th>
                          <th className="py-2">Quantity</th>
                          <th className="py-2">Unit Price</th>
                          <th className="py-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{product.item.name}</td>
                            <td className="py-2">{product.unit}</td>
                            <td className="py-2">{product.quantity}</td>
                            <td className="py-2">Gh {findPrice(product.item.prices, product.unit)}.00</td>
                            <td className="py-2">Gh {product.quantity * findPrice(product.item.prices, product.unit)}.00</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-semibold text-gray-800">{items}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Payable:</span>
                      <span className="font-semibold text-gray-800">Gh {total}.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Received:</span>
                      <span className="font-semibold text-gray-800">Gh {receive}.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Change Return:</span>
                      <span className="font-semibold text-gray-800">Gh {change}.00</span>
                    </div>
                  </div>
                  <div className="border-t pt-4 text-center">
                    <p className="text-gray-500">We hope to see you again soon!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProceedModal;
