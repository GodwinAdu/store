import { toast } from "@/components/ui/use-toast";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

interface CartItem {
  id: string; // Unique identifier for each cart item
  item: any;
  quantity: number;
  unit?: string; // ? means optional
}

interface CartStore {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (idToRemove: string) => void;
  increaseQuantity: (idToIncrease: string) => void;
  decreaseQuantity: (idToDecrease: string) => void;
  clearCart: () => void;
  updateUnit: (itemId: string, newUnit: string) => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      cartItems: [],
      addItem: (data: CartItem) => {
        const { item, quantity, unit } = data;
        const newCartItem: CartItem = {
          id: uuidv4(), // Generate a unique ID for each cart item
          item,
          quantity,
          unit,
        };
        const currentItems = get().cartItems;
        set({ cartItems: [...currentItems, newCartItem] });
        toast({
          title: `Great Job`,
          description: "Item added to cart 🛒",
        });
      },
      removeItem: (idToRemove: string) => {
        const newCartItems = get().cartItems.filter(
          (cartItem) => cartItem.id !== idToRemove
        );
        set({ cartItems: newCartItems });
        toast({
          title: `Hmmm`,
          description: "Item removed from cart",
        });
      },
      increaseQuantity: (idToIncrease: string) => {
        const newCartItems = get().cartItems.map((cartItem) =>
          cartItem.id === idToIncrease
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        set({ cartItems: newCartItems });
        toast({
          title: `Great`,
          description: "Quantity increased",
        });
      },
      decreaseQuantity: (idToDecrease: string) => {
        const newCartItems = get().cartItems.map((cartItem) => {
          if (cartItem.id === idToDecrease) {
            const newQuantity = Math.max(cartItem.quantity - 1, 1); // Ensure quantity doesn't go below 1
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        });
        set({ cartItems: newCartItems });
        toast({
          title: `Oops`,
          description: "Quantity decreased",
        });
      },
      clearCart: () => set({ cartItems: [] }),
      updateUnit: (itemId: string, newUnit: string) => {
        const newCartItems = get().cartItems.map((cartItem) =>
          cartItem.id === itemId ? { ...cartItem, unit: newUnit } : cartItem
        );
        set({ cartItems: newCartItems });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
