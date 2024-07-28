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
const CancelModal = () => {
  const cart = useCart()
  return (
      <AlertDialog>
          <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">Cancel</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. Continue to cancel Sales?.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={()=>cart.clearCart()} className="bg-red-500 hover:bg-red-700">Ok</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
  )
}

export default CancelModal

