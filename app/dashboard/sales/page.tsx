import Header from '@/components/Header'
import { DataTable } from '@/components/table/DataTable'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { fetchAllBrands } from '@/lib/actions/brand.actions'
import { fetchAllCategories } from '@/lib/actions/category.actions'

const page = async () => {
  const brands = await fetchAllBrands() || [];
  const categories = await fetchAllCategories() || [];
  return (
    <>
      <div className="flex justify-between items-center px-3">
        <Header title="All Sales" />
        <div className="flex gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/dashboard/sales/create`} className={cn(buttonVariants({ size: "sm" }), "h-7 gap-1")}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Sales
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Sales</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
         
        </div>
      </div>
      <Separator />
      {/* <DataTable searchKey='username' data={data} columns={columns} /> */}
      <div className="">
        {/* <ProductGrid brands={brands} categories={categories} /> */}
      </div>
    </>
  )
}

export default page
