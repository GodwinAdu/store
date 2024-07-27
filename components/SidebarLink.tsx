import { Home, LineChart, Package, Package2, Settings, ShoppingCart, Users2, DollarSign, FileText, BarChart, Laptop, HandCoins, PanelLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Sheet, SheetTrigger, SheetContent } from './ui/sheet';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';

const SidebarLinks = () => {
  const pathname = usePathname();

  const sidebarLinks = [
    { title: "Dashboard", path: "/dashboard/id", icon: <Home />, roleField: "dashboard" },
    { title: "Users", path: "/dashboard/id/users", icon: <Users2 />, roleField: "users" },
    { title: "POS", path: "/pos", icon: <Laptop />, roleField: "pos" },
    { title: "Products", path: "/dashboard/id/products", icon: <Package />, roleField: "products" },
    { title: "Purchases", path: "/dashboard/id/purchases", icon: <HandCoins />, roleField: "products" },
    { title: "Sales", path: "/dashboard/id/sales", icon: <DollarSign />, roleField: "sales" },
    { title: "Orders", path: "/dashboard/id/orders", icon: <ShoppingCart />, roleField: "orders" },
    { title: "Expenses", path: "/dashboard/id/expenses", icon: <FileText />, roleField: "expenses" },
    { title: "Stocks", path: "/dashboard/id/stocks", icon: <Package2 />, roleField: "stocks" },
    { title: "Reports", path: "/dashboard/id/reports", icon: <BarChart />, roleField: "reports" },
  ];

  // Function to filter out IDs from the path
  const removeIdsFromPath = (path:any) => {
    const idPattern = /^[0-9a-fA-F]{24}$|^[0-9]+$/;
    return path.split('/').filter((segment:any) => !idPattern.test(segment)).join('/');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          {sidebarLinks.map((link, index) => {
            const cleanedPath = removeIdsFromPath(link.path);
            const cleanedCurrentPath = removeIdsFromPath(pathname);
            const isActive = cleanedPath === cleanedCurrentPath;

            return (
              <Link
                key={index}
                href={link.path}
                className={`flex items-center gap-4 px-2.5 ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {link.icon}
                {link.title}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default SidebarLinks;
