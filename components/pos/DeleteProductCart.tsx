import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import useCart from "@/lib/hooks/use-cart"
import { Delete, DeleteIcon, Trash2 } from "lucide-react"
const DeleteProductCart = ({ product }: { product: any }) => {
    const cart = useCart()
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button aria-label="delete-button" className=" p-1 bg-red-500 text-white rounded">
                    <Trash2 className="w-4 h-4" />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. Product will be removed from Cart.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => cart.removeItem(product.item._id)} className="bg-red-500 hover:bg-red-700">Remove</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteProductCart
