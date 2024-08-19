import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,

  PlusCircle,

  Users,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import TransactionSale from "./TransactionSale"

const Dashboard = ({monthSales,prevSales,revenue,user}) => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex justify-between items-center">
        <div className="">
          <h2 className="font-bold text-lg">Welcome Back , <span className="text-green-500">{user?.username || null}</span></h2>
        </div>
        <div className=" flex gap-4 ml-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/dashboard/accounts`} className={cn(buttonVariants({ size: "sm" }), "h-7 gap-1")}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Account
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Account</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">&#8373; {revenue}</div>
            <p className="text-xs text-muted-foreground py-1">
              +From all you Accounts
            </p>
            
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sales
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">&#8373; {monthSales}</div>
            <p className="text-xs text-muted-foreground py-1">
              +&#8373;{prevSales} from prev month
            </p>
            <div className="flex gap-4 text-sm py-1">
              <h3 className="font-bold">Total :</h3>
              <p>&#8373;{monthSales + prevSales}</p>
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground py-1">
              0 from prev month
            </p>
            <div className="flex gap-4 text-sm py-1">
              <h3 className="font-bold">Total :</h3>
              <p>2626</p>
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">&#8373; 0</div>
            <p className="text-xs text-muted-foreground py-1">
            - &#8373;0 prev month
            </p>
            <div className="flex gap-4 text-sm py-1">
              <h3 className="font-bold">Total :</h3>
              <p>&#8373;2626</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <TransactionSale />
    </main>
  )
}

export default Dashboard
