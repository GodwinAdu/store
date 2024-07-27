"use client";

import { useContext, useEffect, useState } from "react";
import { Copy, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { DeleteDialog } from "@/components/DeleteDialog";
import { deleteUser } from "@/lib/actions/user.actions";
import { deleteUnit } from "@/lib/actions/unit.actions";
import { playErrorSound, playSuccessSound } from "@/lib/audio";




interface CellActionProps {
    data: any;
}

export const CellAction: React.FC<CellActionProps> = ({
    data,
}) => {
    const router = useRouter();
    const params = useParams();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const id: string = params.adminId as string;
    const schoolId = params.schoolId as string;




    const handleDelete = async (id: string) => {
        try {
            setLoading(true);
            await deleteUnit(id);
            playSuccessSound();

            router.refresh();
            toast({
                title: "Deleted successfully",
                description: "You've delete User successfully",
            });
        } catch (error: any) {
            playErrorSound()
            toast({
                title: "Something Went Wrong",
                description: "Please try again later",
                variant: "destructive",
            });
        } finally {
            setOpen(false);
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
                    <Link
                        href={`/dashboard/products/units/${data?._id}`}
                    >
                        <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Update
                        </DropdownMenuItem>
                    </Link>

                    <DropdownMenuItem
                        onClick={(e) => { e.preventDefault(); setDeleteDialogOpen(true); }}
                    >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
            {isDeleteDialogOpen && (
                <DeleteDialog
                    id={data?._id}
                    isDeleteDialogOpen={isDeleteDialogOpen}
                    title="Are you sure you want to delete Unit?"
                    description="This action cannot be undone. Are you sure you want to proceed?"
                    onCancel={() => setDeleteDialogOpen(false)}
                    onContinue={handleDelete}
                />
            )}
        </>
    );
};
