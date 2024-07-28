"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSignIcon, HandCoins, PlusCircle, X } from "lucide-react"
import useCart from "@/lib/hooks/use-cart"
import { toast } from "../ui/use-toast"
import { playWarningSound } from "@/lib/audio"
import { Card, CardContent } from "../ui/card"

const ProceedModal = () => {
  const cart = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleProceedClick = () => {
    if (cart.cartItems.length === 0) {
      playWarningSound();
      toast({
        title: "Warning !...",
        description: "Cart is empty. Add some items to proceed to payment.",
        variant: "warning"
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
      <Button
        onClick={handleProceedClick}
        className="bg-green-500 hover:bg-green-700"
        size="sm"
      >
        <HandCoins className="mr-2 w-4 h-4" />
        Proceed Payment
      </Button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg h-[80%] w-[80%]  mx-auto my-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold mb-2">Proceed Payment</h2>
              <button aria-label="button-close" className="" onClick={handleClose}><X className="w-3 h-3" /></button>
            </div>
            <div className="flex gap-2">
              <h3 className="font-bold">Account Balance:</h3>
              <p className="text-green-500">Gh 0.00</p>
            </div>
            <div className="grid grid-col-1 md:grid-cols-4 gap-4">
              <Card className="col-span-3 py-4">
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 py-5">
                  <div>
                    <Label htmlFor="search">Amount: *</Label>
                    <Input
                      type="text"
                      id="search"
                      placeholder="Eg.Product Name/SKU/Barcode"

                    />
                  </div>
                  <div className="">
                    <Label htmlFor="search">Amount: *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a fruit" />
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
                  <div className="">
                    <Label htmlFor="search">Amount: *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a fruit" />
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
                </CardContent>
              </Card>
              <Card className="bg-orange-300">
                <CardContent>

                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProceedModal
