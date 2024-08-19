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
import { playErrorSound, playSuccessSound, playWarningSound } from "@/lib/audio";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { createSale } from "@/lib/actions/sale.actions";

const date = new Date().toLocaleDateString();
interface ProceedProps {
  total: number;
  items: number;
  accounts: { _id: string; accountName: string, balance: number }[];
  customer: string
}

const ProceedModal = ({ total, items, accounts, customer }: ProceedProps) => {
  const cart = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [receive, setReceive] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const [billingAddress, setBillingAddress] = useState('walk in customer')
  const [shippingAddress, setShippingAddress] = useState('walk in customer')
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState<string>('');
  const invoiceRef = useRef(null);

  const router = useRouter();

  const findPrice = (prices: { name: string, price: number }[], unit: string) => {
    const priceObj = prices?.find((price) => price.name === unit);
    return priceObj ? priceObj.price : 0;
  };

  useEffect(() => {
    calculateBalanceAndChange();
  }, [receive]);

  const calculateBalanceAndChange = () => {
    const receivedAmount = isNaN(receive) ? 0 : receive;
    const newBalance = receivedAmount - total;
    setBalance(receivedAmount > 0 ? newBalance : 0);
    setChange(newBalance >= 0 ? newBalance : 0);
  };

  const handleProceedClick = () => {
    if (cart.cartItems.length === 0) {
      playWarningSound();
      toast({
        title: "Warning !...",
        description: "Cart is empty. Add some items to proceed to payment.",
        variant: "warning",
      });
    } else {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handlePrint = () => {
    if (invoiceRef.current) {
      const printContents = invoiceRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
  
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload()
    } else {
      console.error("Invoice reference is not set.");
    }
  };
  

  const handlePayment = async () => {
    const values = {
      customer,
      accountId: accountId,
      description: description,
      paymentMethod: paymentMethod,
      products: cart.cartItems.map(cartItem => ({
        productId: cartItem.item._id,
        unit: cartItem.unit,
        quantity: cartItem.quantity,
        price: findPrice(cartItem.item.prices, cartItem?.unit as string) * cartItem.quantity,
      })),
      totalAmount: total,
      saleDate: date,
      billingAddress: billingAddress,
      shippingAddress: shippingAddress,
    };
    if (receive < total) {
      playWarningSound();
      toast({
        title: "Warning!",
        description: "Received amount is less than total amount. Please enter a valid amount.",
        variant: "warning",
      });
      return
    }
    try {
      await createSale(values);
      playSuccessSound();
      cart.clearCart();
      setIsOpen(false);
      handlePrint();
    } catch (error) {
      playErrorSound()
      toast({
        title: "Something went wrong",
        description: "Please try again later...",
        variant: "destructive",
      });

    }
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
                          onChange={(e) =>
                            setReceive(parseInt(e.target.value) || 0)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="account">Accounts: *</Label>
                      <Select value={accountId} onValueChange={(value) => setAccountId(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {accounts.map((account) => (
                              <SelectItem key={account._id} value={account._id}>
                                {account.accountName}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="payment-method">Payment Method: *</Label>
                      <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select</SelectLabel>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="momo">MoMo</SelectItem>
                            <SelectItem value="others">Others</SelectItem>
                            <SelectItem value="pre-other">Pre-Order</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <Label htmlFor="receive">Payment Note: *</Label>
                    <Textarea
                      className="h-32"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="A little description about payment (Optional)"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                    <div className="space-y-4">
                      <Label htmlFor="receive">Billing Address</Label>
                      <Input
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                      />
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="receive">Shipping Address</Label>
                      <Input
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                      />
                    </div>
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
                    <h2 className="text-xl">Gh {total.toFixed(2)}</h2>
                  </div>
                  <Separator className="my-4" />
                  <div className="text-white font-bold">
                    <p className="text-lg">Total Paying:</p>
                    <h2 className="text-xl">
                      Gh {receive === 0 ? total.toFixed(2) : receive.toFixed(2)}
                    </h2>
                  </div>
                  <Separator className="my-4" />
                  <div className="text-white font-bold">
                    <p className="text-lg">Change Return:</p>
                    <h2 className="text-xl">Gh {change.toFixed(2)}</h2>
                  </div>
                  <Separator className="my-4" />
                  <div className="text-white font-bold">
                    <p className="text-lg">Balance:</p>
                    <h2 className="text-xl">Gh {balance.toFixed(2)}</h2>
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
              <Button onClick={() => handlePayment()} className="bg-green-500 hover:bg-green-700" size="sm">
                Finalize Payment
              </Button>
            </div>
            
            
          </div>
        </div>
      )}
       <div className="hidden">
        <div ref={invoiceRef}>
          <div className="max-w-[600px] mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">My Company</h2>
                <p>123 Main St</p>
                <p>City, State ZIP</p>
                <p>(123) 456-7890</p>
              </div>
              <div>
                <p className="font-bold">INVOICE</p>
                <p>Invoice #: 123456</p>
                <p>Date: {date}</p>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">BILL TO:</p>
                <p>{billingAddress}</p>
              </div>
              <div>
                <p className="font-bold">SHIP TO:</p>
                <p>{shippingAddress}</p>
              </div>
            </div>
            <Separator />
            <div>
              <table className="w-full border-collapse border border-gray-400">
                <thead>
                  <tr>
                    <th className="border border-gray-400 px-4 py-2">Item</th>
                    <th className="border border-gray-400 px-4 py-2">Unit</th>
                    <th className="border border-gray-400 px-4 py-2">Quantity</th>
                    <th className="border border-gray-400 px-4 py-2">Unit Price</th>
                    <th className="border border-gray-400 px-4 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.cartItems.map((cartItem, index) => (
                    <tr key={index}>
                      <td className="border border-gray-400 px-4 py-2">{cartItem.item.name}</td>
                      <td className="border border-gray-400 px-4 py-2">{cartItem.unit}</td>
                      <td className="border border-gray-400 px-4 py-2">{cartItem.quantity}</td>
                      <td className="border border-gray-400 px-4 py-2">
                        {findPrice(cartItem.item.prices, cartItem.unit as string)}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {findPrice(cartItem.item.prices, cartItem.unit as string) * cartItem.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Separator />
            <div className="flex justify-end items-center">
              <div>
                <p>Subtotal: ${total.toFixed(2)}</p>
                <p>Tax (10%): ${(total * 0.1).toFixed(2)}</p>
                <p className="font-bold">Total: ${(total + total * 0.1).toFixed(2)}</p>
              </div>
            </div>
            <Separator />
            <div className="text-center">
              <p>Thank you for your business!</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProceedModal;
