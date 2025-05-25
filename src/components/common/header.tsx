"use client";
import { useUser } from "@clerk/nextjs";
import { InboxIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useTheme } from "next-themes";
import { SignOutButton } from '@clerk/nextjs'


export default function Header({ }) {
    const { user } = useUser();
    const { setTheme, theme } = useTheme()
    const themes = ['light', 'dark', 'system'];

    return (
        <div className="flex items-center justify-between h-min pr-3 py-3 overflow-x-auto gap-x-8 pl-4 border-b border-base-200 bg-base-50 overflow-hidden">
            <div className="flex items-center text-sm">
                <Link href="dashboard" className="items-center justify-center flex-shrink-0 hidden md:flex">
                    <Image src="/logo-light.png" alt="Logo" width={32} height={32} />
                </Link>
            </div>
            <div className="flex items-center text-sm gap-2">
                <Button variant={'outline'} size={'sm'}>Feedback</Button>
                <Button variant={'ghost'} size={'icon'}>
                    <InboxIcon className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="rounded-full w-8 h-8 flex items-center justify-center cursor-pointer overflow-hidden">
                            {user?.imageUrl &&
                                <Image src={user?.imageUrl} alt="Logo" width={32} height={32} />
                            }
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col items-start">
                                <p>{user?.username}</p>
                                <p className="text-xs text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Settings
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>
                                Themes
                            </DropdownMenuLabel>
                            <RadioGroup defaultValue={theme}>
                                {themes.map((theme) => (
                                    <DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
                                        <RadioGroupItem value={theme} id={`r-${theme}`} />
                                        <Label htmlFor={`r-${theme}`}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</Label>
                                    </DropdownMenuItem>
                                ))}
                            </RadioGroup>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <SignOutButton />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}