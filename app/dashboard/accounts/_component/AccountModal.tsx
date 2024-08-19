"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { createAccount } from "@/lib/actions/account.actions";



const formSchema = z.object({
    accountName: z.string().min(1, {
        message: "name must be at least 2 characters.",
    }),
    balance: z.coerce.number()
});

export function AccountModal() {
    const router = useRouter();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accountName: "",
            balance: 0

        },
    });

    const { isSubmitting } = form.formState;

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createAccount(values);

            form.reset();
            toast({
                title: "New Account created",
                description: "New Account was added successfully...",
            });
            router.refresh();
        } catch (error: any) {
            console.log("error happened while creating Account", error);
            toast({
                title: "Something went wrong",
                description: "Please try again later...",
                variant: "destructive",
            });
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="gap-1 h-7">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        New Account
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Account</DialogTitle>
                    <DialogDescription>
                        Create Account for new transactions.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="accountName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter Account Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Eg. Account name ...." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="balance"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter Opening Balance</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Amount" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end">
                                <Button disabled={isSubmitting} type="submit">{isSubmitting ? "Saving ..." : "Save"}</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}


