"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, PlusCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import MultiText from "@/components/commons/MultiText"
import { createUnit } from '@/lib/actions/unit.actions';
import { CreateUnit } from "./CreateUnit"
import { CreateCategory } from "./CreateCategories"
import { CreateBrand } from "./CreateBrand"
import { playErrorSound, playSuccessSound } from "@/lib/audio"
import { toast } from "@/components/ui/use-toast"
import { createProduct } from "@/lib/actions/product.actions"
import { usePathname, useRouter } from "next/navigation"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    brandId: z.string(),
    categoryId: z.string(),
    expiryDate: z.date().optional(),
    barcode: z.string(),
    sku: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    color: z.array(z.string()).optional(),
    size: z.array(z.string()).optional(),
    cost: z.coerce.number(),
    quantity: z.coerce.number(),
    prices: z.array(z.object({
        name: z.string(),
        price: z.coerce.number(),
    })),
    taxes: z.array(z.object({
        name: z.string(),
        amount: z.coerce.number()
    })).optional(),
})

interface ProductProps {
    categories: any[];
    brands: any[];
    units: any[];
}
const ProductForm = ({ categories, brands, units }: ProductProps) => {
    const router = useRouter();
    const path = usePathname();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            brandId: "",
            categoryId: "",
            barcode: "",
            sku: "",
            tags: [],
            color: [],
            size: [],
            cost: 0,
            quantity: 0,
            prices: [{ name: "", price: 0 }],
            taxes: [{ name: "", amount: 0 }],
        },
    })

    const { fields: taxFields, append: appendTax, remove: removeTax } = useFieldArray({
        name: "taxes",
        control: form.control,
    });

    const { fields: priceFields, append: appendPrice, remove: removePrice } = useFieldArray({
        name: "prices",
        control: form.control,
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values)
            await createProduct(values, path);
            playSuccessSound();
            form.reset();
            router.push(`/dashboard/products`);
            toast({
                title: "Created successfully",
                description: "New product was added successfully...",
            })

        } catch (error) {
            playErrorSound();
            toast({
                title: "Error",
                description: "An error occurred while creating the product. Please try again.",
                variant: "destructive"
            })
        }
    }
    return (
        <Card>
            <CardContent className="py-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5  py-5">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter product name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="brandId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Brand</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a brand" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {brands?.map((brand) => (
                                                        <SelectItem key={brand._id} value={brand._id}>
                                                            {brand.name}
                                                        </SelectItem>
                                                    ))}
                                                    <CreateBrand />
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories?.map((category) => (
                                                        <SelectItem key={category._id} value={category._id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                    <CreateCategory />
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="expiryDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Expiry Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                " pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date (Optional)</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sku"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>SKU</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Add product SKU" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="barcode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Barcode</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Add product Barcode" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Tags</FormLabel>
                                            <FormControl>
                                                <MultiText
                                                    placeholder="Add some tags (Optional)"
                                                    value={field.value ?? []} // Provide default empty array if undefined
                                                    onChange={(tag) =>
                                                        field.onChange([...field.value ?? [], tag])
                                                    }
                                                    onRemove={(tagToRemove) =>
                                                        field.onChange([
                                                            ...(field.value ?? []).filter(
                                                                (tag) => tag !== tagToRemove
                                                            ),
                                                        ])
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-1" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="color"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Color</FormLabel>
                                            <FormControl>
                                                <MultiText
                                                    placeholder="Add some colors (Optional)"
                                                    value={field.value ?? []} // Provide default empty array if undefined
                                                    onChange={(color) =>
                                                        field.onChange([...field?.value ?? [], color])
                                                    }
                                                    onRemove={(tagToRemove) =>
                                                        field.onChange([
                                                            ...(field.value ?? []).filter(
                                                                (tag) => tag !== tagToRemove
                                                            ),
                                                        ])
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-1" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="size"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Size</FormLabel>
                                            <FormControl>
                                                <MultiText
                                                    placeholder="Add product sizes (Optional)"
                                                    value={field.value ?? []} // Provide default empty array if undefined
                                                    onChange={(size) =>
                                                        field.onChange([...field.value ?? [], size])
                                                    }
                                                    onRemove={(tagToRemove) =>
                                                        field.onChange([
                                                            ...(field.value ?? []).filter(
                                                                (tag) => tag !== tagToRemove
                                                            ),
                                                        ])
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-1" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="A little description about product (Optional)" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Taxes (Optional)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {taxFields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                            <FormField
                                                control={form.control}
                                                name={`taxes.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className={cn(index !== 0 && "sr-only")}>Tax Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter tax name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="flex gap-5 items-center">
                                                <FormField
                                                    control={form.control}
                                                    name={`taxes.${index}.amount`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className={cn(index !== 0 && "sr-only")}>Tax Amount</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" placeholder="Enter tax amount" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                {index !== 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => removeTax(index)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => appendTax({ name: "", amount: 0 })}
                                    >
                                        Add Tax
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Price</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {priceFields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                           <FormField
                                                    control={form.control}
                                                    name={`prices.${index}.name`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className={cn(index !== 0 && "sr-only")}>Name</FormLabel>
                                                            <FormControl>
                                                                <Input type="text" placeholder="Eg. Piece, Single etch" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            <div className="flex gap-5 items-center">
                                                <FormField
                                                    control={form.control}
                                                    name={`prices.${index}.price`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className={cn(index !== 0 && "sr-only")}>Price</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" min={1} {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                {index !== 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => removePrice(index)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => appendPrice({ name: "", price: 0 })}
                                    >
                                        Add Price
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="flex justify-end">

                            <Button type="submit">New Product</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default ProductForm
