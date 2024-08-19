"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Copy,
    Edit,
    Eye,
    LucideReceiptRussianRuble,
    MonitorPauseIcon,
    MoreHorizontal,
    Trash,
    Undo2Icon,
    CheckCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { DeleteDialog } from "@/components/DeleteDialog";

import { playErrorSound, playSuccessSound } from "@/lib/audio";
import { updateSalesReturn, updateSalesSuspend } from "@/lib/actions/sale.actions";

interface CellActionProps {
    data: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isSuspendDialogOpen, setSuspendDialogOpen] = useState(false);
    const [isReturnDialogOpen, setReturnDialogOpen] = useState(false);
    const [isCompleteDialogOpen, setCompleteDialogOpen] = useState(false);

    const handleAction = async (action: () => Promise<void>, successMessage: string, errorMessage: string) => {
        try {
            setLoading(true);
            await action();
            playSuccessSound();
            toast({
                title: successMessage,
                description: `You've ${successMessage.toLowerCase()} successfully`,
            });
            router.refresh();  // Instead of window.location.reload();
        } catch (error: any) {
            playErrorSound();
            toast({
                title: "Something Went Wrong",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => setCompleteDialogOpen(true)}
                            className="text-green-500"
                        >
                            <CheckCircleIcon className="mr-2 h-4 w-4" />Proceed
                        </DropdownMenuItem>
                
                    <DropdownMenuItem
                        onClick={() => setDeleteDialogOpen(true)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {isDeleteDialogOpen && (
                <DeleteDialog
                    id={data._id}
                    isDeleteDialogOpen={isDeleteDialogOpen}
                    title="Are you sure you want to delete this item?"
                    description="This action cannot be undone. Are you sure you want to proceed?"
                    onCancel={() => setDeleteDialogOpen(false)}
                    onContinue={() => handleAction(() => deleteBrand(data._id), "Deleted successfully", "Failed to delete")}
                />
            )}
            {isCompleteDialogOpen && (
                <DeleteDialog
                    id={data._id}
                    isDeleteDialogOpen={isCompleteDialogOpen}
                    title="Are you sure you want to mark this sale as complete?"
                    description="This action cannot be undone. Are you sure you want to proceed?"
                    onCancel={() => setCompleteDialogOpen(false)}
                // onContinue={() => handleAction(() => updateSalesComplete(data._id), "Completed successfully", "Failed to complete")}
                />
            )}
        </>
    );
};
