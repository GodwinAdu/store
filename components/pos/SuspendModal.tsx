"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSignIcon, HandCoins, Pause, PlusCircle } from "lucide-react"
import useCart from "@/lib/hooks/use-cart"
import { toast } from "../ui/use-toast"
import { playWarningSound } from "@/lib/audio"

const SuspendModal = () => {
  const cart = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleProceedClick = () => {
    if (cart.cartItems.length === 0) {
      playWarningSound();
       toast({
        title: "Warning !...",
        description: "Cart is empty. No Product to suspend.",
        variant:"warning"
      })
    } else {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (

    <>
      
<Button onClick={handleProceedClick} className="bg-orange-500 hover:bg-orange-700" size="sm"><Pause className="mr-2 w-4 h-4" />Suspend</Button> 
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-2">Edit profile</h2>
            <p className="mb-4">Make changes to your profile here. Click save when you're done.</p>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name
                </label>
                <input
                  id="name"
                  defaultValue="Pedro Duarte"
                  className="col-span-3 border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="username" className="text-right">
                  Username
                </label>
                <input
                  id="username"
                  defaultValue="@peduarte"
                  className="col-span-3 border border-gray-300 p-2 rounded"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleClose}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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

