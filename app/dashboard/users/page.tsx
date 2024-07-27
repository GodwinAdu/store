import Header from '@/components/Header'
import { DataTable } from '@/components/table/DataTable'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { columns } from './_components/column'
import { fetchAllUsers } from '@/lib/actions/user.actions'

const page = async () => {
  const data = await fetchAllUsers() || [];
  return (
    <>
      <div className="flex justify-between items-center px-3">
        <Header title="Manage Users" />
        <div className="flex gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/dashboard/users/create`} className={cn(buttonVariants({ size: "sm" }), "h-7 gap-1")}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add User
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create User</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Separator />
      <DataTable searchKey='username' data={data} columns={columns} />
    </>
  )
}

export default page
