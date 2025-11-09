"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGlobalStore } from "@/store/useGlobalStore";
import { BellIcon, MegaphoneOffIcon, MoreVerticalIcon } from "lucide-react";
import { useEffect, useState } from "react";

const NoNewNotifications = () => {
    return (
        <div className="p-4 text-center text-sm text-muted-foreground py-8">
            <MegaphoneOffIcon className="mx-auto mb-2 w-6 h-6 opacity-50" />
            <p>No new notifications</p>
        </div>
    )
}

const NotificationDropdown = () => {
    const { activeTeam } = useGlobalStore((state) => state);
    const [activeTab, setActiveTab] = useState('Personal');
    const [tabs, setTabs] = useState<string[]>(['Personal']);
    const [notifications, setNotifications] = useState(false);

    useEffect(() => {
        if (activeTeam) {
            setTabs(['Team', 'Personal']);
            setActiveTab('Team');
            return;
        }
        setTabs(['Personal']);
        setActiveTab('Personal');
    }, [activeTeam]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="mr-3 relative">
                    <Badge className="shadow-none rounded-full aspect-square absolute -top-2 -right-2 p-1.5 text-xs flex items-center justify-center text-white">
                        1
                    </Badge>
                    <Button variant='outline' size='icon' className="shadow-none">
                        <BellIcon className="w-4 h-4" />
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto sm:w-80" align="end">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <DropdownMenuLabel className="p-0">
                        <div className="flex items-center gap-2">
                            <TabsList className="w-full bg-accent flex items-center justify-between">
                                {tabs.map((tab) => (
                                    <TabsTrigger key={tab} className="flex-1 text-center" value={tab}>
                                        {tab}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' size='icon' className="rounded-lg shadow-none">
                                        <MoreVerticalIcon className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        Only unread
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Mark all as read
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Clear all notifications
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <TabsContent value="Team">
                        {notifications ? (
                            <div className="p-4 text-sm text-muted-foreground">
                            </div>
                        ) : (
                            <NoNewNotifications />
                        )}
                    </TabsContent>
                    <TabsContent value="Personal">
                        {notifications ? (
                            <div className="p-4 text-sm text-muted-foreground">
                            </div>
                        ) : (
                            <NoNewNotifications />
                        )}
                    </TabsContent>
                </Tabs>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default NotificationDropdown