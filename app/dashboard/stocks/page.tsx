import Header from '@/components/Header'
import { DataTable } from '@/components/table/DataTable'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'

import { fetchAllBrands } from '@/lib/actions/brand.actions'
import { fetchAllCategories } from '@/lib/actions/category.actions'
import StockGrid from './_components/StockGrid'

const page = async () => {
  const brands = await fetchAllBrands() || [];
  const categories = await fetchAllCategories() || [];
  return (
    <>
      <div className="flex justify-between items-center px-3">
        <Header title="Add Product Stocks" />

      </div>
      <Separator />
      {/* <DataTable searchKey='username' data={data} columns={columns} /> */}
      <div className="">
        <StockGrid brands={brands} categories={categories} />
      </div>
    </>
  )
}

export default page
