import Dashboard from "@/components/Dashboard"
import { calculateSalesForMonth, calculateSalesWithoutThisMonth, calculateTotalRevenue } from "@/lib/actions/dashboard.actions"
import { currentProfile } from "@/lib/helpers/current-user"


const page = async () => {
    const monthSales = await calculateSalesForMonth()
    const prevSales = await calculateSalesWithoutThisMonth()
    const revenue = await calculateTotalRevenue()
    const user = await currentProfile()
    console.log(revenue, "total revenue")
    console.log(prevSales, "previous month sales")
    console.log(monthSales, "month sales")
    return (
        <>
            <Dashboard user={user} revenue={revenue} monthSales={monthSales}  prevSales={prevSales} />
        </>
    )
}

export default page
