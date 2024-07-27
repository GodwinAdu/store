import Header from '@/components/Header'
import { DataTable } from '@/components/table/DataTable'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { fetchAllUsers } from '@/lib/actions/user.actions'
import Category from '../../../lib/models/category.models';
import ProductGrid from './_components/ProductGrid'
import { fetchAllBrands } from '@/lib/actions/brand.actions'
import { fetchAllCategories } from '@/lib/actions/category.actions'

const page = async () => {
  const brands = await fetchAllBrands() || [];
  const categories = await fetchAllCategories() || [];
  return (
    <>
      <div className="flex justify-between items-center px-3">
        <Header title="Manage Products" />
        <div className="flex gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/dashboard/products/create`} className={cn(buttonVariants({ size: "sm" }), "h-7 gap-1")}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Product
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Product</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/dashboard/products/category`} className={cn(buttonVariants({ size: "sm" }), "h-7 gap-1")}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Category
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Category</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/dashboard/products/brands`} className={cn(buttonVariants({ size: "sm" }), "h-7 gap-1")}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Brand
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Brand</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/dashboard/products/units`} className={cn(buttonVariants({ size: "sm" }), "h-7 gap-1")}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Unit
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Unit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Separator />
      {/* <DataTable searchKey='username' data={data} columns={columns} /> */}
      <div className="">
        <ProductGrid brands={brands} categories={categories} />
      </div>
    </>
  )
}

export default page
