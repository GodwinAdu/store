"use client"

import Calculator from '@/components/Calculator'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CalculatorIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import FullScreenButton from '../FullScreen'
import { DropdownLinks } from '../DropdownLinks'

const Nav = ({user}:{user:any}) => {
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
    return (
        <>
            <nav className='w-full h-14 shadow-lg bg-black flex justify-between items-center px-4 '>
                <div className="text-white">
                    Welcome <span className='text-orange-600'>{user?.username}</span>
                </div>
                <div className="flex gap-4 ">
                <DropdownLinks />
                    <FullScreenButton />
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
                            <div className="absolute z-50 right-0 mt-2 w-64">
                                <Calculator />
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
                </div>
            </nav>
        </>
    )
}

export default Nav
