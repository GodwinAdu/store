import { Button } from "@/components/ui/button";
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, DollarSignIcon, HandCoins, PlusCircle, Rabbit } from "lucide-react";
import { Separator } from "../ui/separator";
import { fetchPosTransaction } from "@/lib/actions/sale.actions";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import moment from "moment";
import Transaction from '../../lib/models/transaction.models';

interface TransactionProps {
  _id: string;
  customer: string;
  createdAt: Date;
  totalAmount: number;
  invoiceNo: string;
  createdBy: {
    username: string;
  }
}
const TransactionModal = () => {
  const [transactions, setTransactions] = useState<TransactionProps[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPosTransaction();
        setTransactions(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch transactions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  console.log(transactions, "transaction");
  const total = transactions.reduce((total, transaction) => total + transaction.totalAmount, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-700" size="sm">
          <Clock className="mr-2 w-4 h-4" />
          Recent Transactions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[90%] flex flex-col">
        <DialogHeader>
          <DialogTitle>Today Transactions</DialogTitle>
          <Separator className="my-4" />
        </DialogHeader>
        {transactions.length === 0 && !isLoading && (
          <div className="w-full flex-grow flex justify-center items-center">
            <div className="flex flex-col items-center">
              <Rabbit className="w-24 h-24" />
              <p>Please check back later or start making sales</p>
              <p>No transaction found for today</p>
            </div>
          </div>
        )}
        {transactions.length > 0 && !isLoading && (
          <Table>
            <TableCaption>A list of your recent Sales.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Customer</TableHead>
                <TableHead>Invoice No.</TableHead>
                <TableHead>Sale Date</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...transactions].reverse().map((transaction) => (
                <TableRow key={transaction._id} className="text-xs">
                  <TableCell className="w-56 text-sm">{transaction.customer}</TableCell>
                  <TableCell className="text-xs">{transaction.invoiceNo}</TableCell>
                  <TableCell>{moment(transaction.createdAt).fromNow()}</TableCell>
                  <TableCell>{transaction.createdBy.username}</TableCell>
                  <TableCell className="text-right font-bold">Gh{transaction.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total Sales For Today</TableCell>
                <TableCell className="text-right">Gh{total}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
