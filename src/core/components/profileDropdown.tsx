import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SignOutButton, useClerk, useUser } from "@clerk/nextjs";
import { User } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";


const ProfileDropdown = () => {
    const { user } = useUser();
    const { openUserProfile } = useClerk();
    const { setTheme, theme } = useTheme();
    const themes = ['light', 'dark', 'system'];

    return (
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
    )
}

export default ProfileDropdown