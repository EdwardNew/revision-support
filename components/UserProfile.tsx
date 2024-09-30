"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
import { logout } from "@/app/login/auth.action";

type UserProfileProps = {
    username: string;
};

export function UserProfile({ username }: UserProfileProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    Welcome, {username} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem className="p-0">
                    <Button
                        variant="ghost"
                        onClick={async () => {
                            await logout();
                        }}
                    >
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
