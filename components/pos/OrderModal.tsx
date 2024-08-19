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
import { DollarSignIcon, HandCoins, PlusCircle, ShoppingBagIcon, X } from "lucide-react";
import useCart from "@/lib/hooks/use-cart";
import { toast } from "../ui/use-toast";
import { playErrorSound, playSuccessSound, playWarningSound } from "@/lib/audio";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { createSale } from "@/lib/actions/sale.actions";
import { createOrder } from "@/lib/actions/order.actions";

const date = new Date().toLocaleDateString();
interface ProceedProps {
  total: number;
  items: number;
  accounts: { _id: string; accountName: string, balance: number }[];
  customer: string
}

const OrderModal = ({ total, accounts, customer }: ProceedProps) => {
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

  const handleOrder = async () => {
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
      billingAddress: billingAddress,
      shippingAddress: shippingAddress,
    };
    try {
      await createOrder(values);
      playSuccessSound();
      cart.clearCart();
      setIsOpen(false);
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
      <Button onClick={handleProceedClick} className="bg-indigo-500 hover:bg-indigo-700" size="sm"><ShoppingBagIcon className="mr-2 w-4 h-4" />Order</Button> 
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg h-[80%] w-[80%] mx-auto my-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold mb-2">Proceed Order</h2>
              <button aria-label="button-close" className="" onClick={handleClose}>
                <X className="w-3 h-3" />
              </button>
            </div>
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
          
            <div className="flex gap-4 justify-end py-4">
              <Button onClick={handleClose} className="bg-red-500 hover:bg-red-700" size="sm">
                Cancel
              </Button>
              <Button onClick={handleOrder} className="bg-green-500 hover:bg-green-700" size="sm">
                Order Now
              </Button>
            </div>
            
            
          </div>
        </div>
      )}
      
    </>
  );
};

export default OrderModal;



