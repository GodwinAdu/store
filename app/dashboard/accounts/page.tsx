import Header from '@/components/Header'
import { Separator } from '@/components/ui/separator'
import { AccountModal } from './_component/AccountModal'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { DataTable } from '@/components/table/DataTable'
import { columns } from './_component/column'
import { getAllAccounts } from '@/lib/actions/account.actions'



const page = async () => {

  const data = await getAllAccounts() || [];

  return (
    <>
      <div className="flex justify-between items-center px-3">
        <Header title="Manage Account" />
        <div className="flex gap-4">
          <AccountModal />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/dashboard/accounts/expenses`} className={cn(buttonVariants({ size: "sm" }), "h-7 gap-1")}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Expenses
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Expenses</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/dashboard/accounts/income`} className={cn(buttonVariants({ size: "sm" }), "h-7 gap-1")}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Income
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Income</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>


      <Separator />
      <DataTable searchKey='accountName' data={data} columns={columns} />
    </>
  )
}

export default page
