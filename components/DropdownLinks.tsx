"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DoorOpen, Icon } from "lucide-react"

type Checked = DropdownMenuCheckboxItemProps["checked"]

export function DropdownLinks() {


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline"><DoorOpen /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="py-4">

        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
