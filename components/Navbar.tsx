"use client";
import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import {
  Bell,
  CalculatorIcon,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Search,
  ShoppingCart,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/input";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import SidebarLinks from "./SidebarLink";
import { DropdownLinks } from "./DropdownLinks";
import Calculator from "./Calculator"; // Import the Calculator component
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import NotificationsDropdown from "./Notification";
import FullScreenButton from "./FullScreen";


const Navbar = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const idPattern = /^[0-9a-fA-F]{24}$|^[0-9]+$/; // Pattern to match common IDs

  const generateBreadcrumbItems = () => {
    const filteredSegments = pathSegments.filter(
      (segment) => !idPattern.test(segment)
    );

    return filteredSegments.map((segment, index) => {
      const href = "/" + filteredSegments.slice(0, index + 1).join("/");
      const isLast = index === filteredSegments.length - 1;
      return (
        <React.Fragment key={href}>
          <BreadcrumbItem>
            {isLast ? (
              <BreadcrumbPage>{segment}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link href={href}>{segment}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {!isLast && <BreadcrumbSeparator />}
        </React.Fragment>
      );
    });
  };

  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <>
      <header className="sticky backdrop-blur-lg shadow-lg top-0 z-30 flex w-full h-14 py-3 items-center gap-4 border-b bg-background px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <SidebarLinks />
        <Breadcrumb className="hidden md:flex gap-6">
          <BreadcrumbList>{generateBreadcrumbItems()}</BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-2 ml-auto">
          <DropdownLinks />
          <div className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
                    variant="outline"
                    size="icon"
                    className="ml-2"
                  >
                    <CalculatorIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Calculator</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {isCalculatorOpen && (
              <div className="absolute right-0 mt-2 w-64">
                <Calculator />
              </div>
            )}
          </div>
          <FullScreenButton />
        </div>
        <div className="relative ml-auto flex-1 md:grow-0">

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  variant="outline"
                  size="icon"
                  className="ml-2"
                >
                  <Bell />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New Messages</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>


          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-64">
              <NotificationsDropdown />
            </div>
          )}

        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <Image
                src="/placeholder-user.jpg"
                width={36}
                height={36}
                alt="Avatar"
                className="rounded-full"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </header>
    </>
  );
};

export default Navbar;
