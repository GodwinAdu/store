"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

import { Pause } from "lucide-react"
import useCart from "@/lib/hooks/use-cart"
import { toast } from "../ui/use-toast"
import { playWarningSound } from "@/lib/audio"
import { Textarea } from "../ui/textarea"
import { createSuspend } from "@/lib/actions/suspend.actions"
import { findPrice } from "@/lib/utils"
import { createOrder } from "@/lib/actions/order.actions"

const SuspendModal = () => {
  const cart = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false);

  const handleProceedClick = () => {
    if (cart.cartItems.length === 0) {
      playWarningSound();
      toast({
        title: "Warning !...",
        description: "Cart is empty. No Product to suspend.",
        variant: "warning"
      })
    } else {
      setIsOpen(true);
    }
  };

  const handleSuspend = async () => {
    try {
      const values = {
        products: cart.cartItems.map(cartItem => ({
          productId: cartItem.item._id,
          unit: cartItem.unit,
          quantity: cartItem.quantity,
          price: findPrice(cartItem.item.prices, cartItem.unit as string) * cartItem.quantity,
        })),
        message
      }
      setIsLoading(true);
      await createOrder(values)
      setMessage('')
      toast({
        title: "Success!",
        description: "Sales suspended successfully.",
      })
      cart.clearCart();

    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to suspend sales. Please try again.",
        variant: "destructive"
      })

    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  return (

    <>

      <Button onClick={handleProceedClick} className="bg-orange-500 hover:bg-orange-700" size="sm"><Pause className="mr-2 w-4 h-4" />Suspend</Button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[95%] max-w-2xl">
            <h2 className="text-lg font-bold mb-2">Suspend Sales</h2>
            <p className="mb-4">Make changes to your profile here. Click save when you're done.</p>
            <div className="grid gap-4 py-4">
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Add suspend note (Optional)" />

            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleClose}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button onClick={handleSuspend} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SuspendModal

