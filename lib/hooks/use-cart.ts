import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

interface CartItem {
  id: string;
  item: any;
  quantity: number;
  unit?: string;
}

interface CartStore {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (idToRemove: string) => void;
  increaseQuantity: (idToIncrease: string) => void;
  decreaseQuantity: (idToDecrease: string) => void;
  clearCart: () => void;
  updateUnit: (itemId: string, newUnit: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      cartItems: [],
      addItem: (data: CartItem) => {
        const { item, quantity, unit } = data;
        const currentItems = get().cartItems;

        const existingProduct = currentItems.find(cartItem => cartItem.item._id === item._id && cartItem.unit === unit);

        if (existingProduct) {
          const existingUnits = currentItems
            .filter(cartItem => cartItem.item._id === item._id)
            .map(cartItem => cartItem.unit);

          let unitToAdd = item.prices[0].name;
          for (let i = 0; i < item.prices.length; i++) {
            if (!existingUnits.includes(item.prices[i].name)) {
              unitToAdd = item.prices[i].name;
              break;
            }
          }

          if (existingUnits.length >= item.prices.length) {
            const primaryUnitIndex = currentItems.findIndex(cartItem => cartItem.item._id === item._id && cartItem.unit === item.prices[0].name);
            const newCartItems = currentItems.map((cartItem, index) =>
              index === primaryUnitIndex
                ? { ...cartItem, quantity: cartItem.quantity + quantity }
                : cartItem
            );
            set({ cartItems: newCartItems });
          } else {
            const newCartItem: CartItem = {
              id: uuidv4(),
              item,
              quantity,
              unit: unitToAdd,
            };
            set({ cartItems: [...currentItems, newCartItem] });
          }
        } else {
          const newCartItem: CartItem = {
            id: uuidv4(),
            item,
            quantity,
            unit: unit || item.prices[0].name,
          };
          set({ cartItems: [...currentItems, newCartItem] });
        }
      },
      removeItem: (idToRemove: string) => {
        const newCartItems = get().cartItems.filter(
          (cartItem) => cartItem.id !== idToRemove
        );
        set({ cartItems: newCartItems });
      },
      increaseQuantity: (idToIncrease: string) => {
        const newCartItems = get().cartItems.map((cartItem) =>
          cartItem.id === idToIncrease
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        set({ cartItems: newCartItems });
      },
      decreaseQuantity: (idToDecrease: string) => {
        const newCartItems = get().cartItems.map((cartItem) => {
          if (cartItem.id === idToDecrease) {
            const newQuantity = Math.max(cartItem.quantity - 1, 1);
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        });
        set({ cartItems: newCartItems });
      },
      clearCart: () => set({ cartItems: [] }),
      updateUnit: (itemId: string, newUnit: string) => {
        const newCartItems = get().cartItems.map((cartItem) =>
          cartItem.id === itemId ? { ...cartItem, unit: newUnit } : cartItem
        );
        set({ cartItems: newCartItems });
      },
      updateQuantity: (itemId: string, newQuantity: number) => {
        const newCartItems = get().cartItems.map((cartItem) =>
          cartItem.id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem
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
