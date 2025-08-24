"use client";

import TeamsDropdown from "@/components/teams/TeamsDropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useStore } from "@/store/useStore";
import { SignOutButton, useClerk, useUser } from "@clerk/nextjs";
import { MessageSquare, User } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export default function Header({ }) {
    const { user } = useUser();
    const { teams, activeProject } = useStore((state) => state);
    const { openUserProfile } = useClerk();
    const { setTheme, theme } = useTheme()

    const themes = ['light', 'dark', 'system'];


    return (
        <div className="fixed w-full flex items-center justify-between h-16 px-4 border-b bg-background z-10">
            <div className="flex items-center gap-6">
                <Link href={teams.length ? `/${teams[0].id}` : "/teams"} className="flex items-center gap-2">
                    <Image
                        src="/logo-light.png"
                        alt="Logo"
                        width={32}
                        height={32}
                        className=""
                    />
                </Link>

                <TeamsDropdown />
                {activeProject ? (
                    <span className="flex items-center gap-1">
                        <span className="mr-2">/</span>
                        <span className="text-sm font-medium text-ellipsis max-w-32 overflow-hidden line-clamp-1">{activeProject.name}</span>
                    </span>
                ) : null}
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 w-8 sm:w-auto">
                    <MessageSquare className="w-4 h-4 mx-2 sm:ml-0" />
                    <p className="hidden sm:block">Feedback</p>
                </Button>
                {/* <NotificationInbox /> */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                            {user?.imageUrl ? (
                                <Image
                                    src={user.imageUrl}
                                    alt="Profile"
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                            ) : (
                                <User className="w-4 h-4" />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64" align="end">
                        <DropdownMenuLabel className="p-0">
                            <div className="flex flex-col px-2 py-1.5">
                                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                                <p className="text-xs text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => openUserProfile()}>
                                <div className="flex items-center cursor-pointer">
                                    <User className="w-4 h-4 mr-2" />
                                    Account Settings
                                </div>
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem asChild>
                                <Link href="/account/preferences" className="flex items-center">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Preferences
                                </Link>
                            </DropdownMenuItem> */}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-xs text-muted-foreground tracking-wider font-medium">
                                Theme
                            </DropdownMenuLabel>
                            <div className="px-2 py-1">
                                <RadioGroup value={theme} onValueChange={setTheme} className="space-y-1">
                                    {themes.map((themeOption) => (
                                        <div key={themeOption} className="flex items-center space-x-2">
                                            <RadioGroupItem value={themeOption} id={`theme-${themeOption}`} />
                                            <Label htmlFor={`theme-${themeOption}`} className="text-sm">
                                                {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <SignOutButton>
                                <button className="flex items-center w-full text-left">
                                    Sign out
                                </button>
                            </SignOutButton>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

    )
}