import { toast } from "@/components/ui/use-toast";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
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
}

const useCart = create(
  persist<CartStore>(
      (set, get) => ({
          cartItems: [],
          addItem: (data: CartItem) => {
              const { item, quantity, unit } = data;
              const currentItems = get().cartItems; // all the items already in cart
              const isExisting = currentItems.find(
                  (cartItem) => cartItem.item._id === item._id
              );
              console.log(isExisting, "item already in cart");

              if (isExisting) {
                  const updatedItems = currentItems.map(cartItem =>
                      cartItem.item._id === item._id
                          ? { ...cartItem, quantity: cartItem.quantity + 1 }
                          : cartItem
                  );
                  set({ cartItems: updatedItems });
                  toast({
                      title: `Great Job`,
                      description: "Quantity increased",
                  });
              } else {
                  set({ cartItems: [...currentItems, { item, quantity, unit }] });
                  toast({
                      title: `Great Job`,
                      description: "Item added to cart 🛒",
                  });
              }
          },
          removeItem: (idToRemove: string) => {
              const newCartItems = get().cartItems.filter(
                  (cartItem) => cartItem.item._id !== idToRemove
              );
              set({ cartItems: newCartItems });
              toast({
                  title: `Hmmm`,
                  description: "Item removed from cart",
              });
          },
          increaseQuantity: (idToIncrease: string) => {
              const newCartItems = get().cartItems.map((cartItem) =>
                  cartItem.item._id === idToIncrease
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
                  if (cartItem.item._id === idToDecrease) {
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
              const newCartItems = get().cartItems.map(cartItem =>
                  cartItem.item._id === itemId
                      ? { ...cartItem, unit: newUnit }
                      : cartItem
              );
              set({ cartItems: newCartItems });
          }
      }),
      {
          name: "cart-storage",
          storage: createJSONStorage(() => localStorage),
      }
  )
);


export default useCart;