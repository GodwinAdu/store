import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { fetchAllSales } from '@/lib/actions/sale.actions'
import moment from 'moment'
import History from '../lib/models/history.models';
import { fetchAllHistories } from '@/lib/actions/history.actions'
import HistoryModal from './HistoryModal'

const TransactionSale = async () => {
    const transactions = await fetchAllSales() || []
    const histories = await fetchAllHistories() || []
    return (
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>
                            Recent transactions from your store.
                        </CardDescription>
                    </div>
                    <Button asChild size="sm" className="ml-auto gap-1">
                        <Link href="#">
                            View All
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="max-h-80 overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead className="text-right">Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...transactions].reverse().map((transaction) => (
                                <TableRow key={transaction._id}>
                                    <TableCell>
                                        <div className="font-medium">{transaction.customer}</div>
                                    </TableCell>
                                    <TableCell className="text-right">{moment(transaction.createdAt).fromNow()}</TableCell>
                                    <TableCell className="text-right">&#8373;{transaction.totalAmount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-5">
                <CardHeader>
                    <CardTitle>Recent History</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-8 max-h-80 overflow-y-auto">
                    {[...histories].reverse().map((history) => (
                        <HistoryModal key={history._id} history={history} />
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

export default TransactionSale
