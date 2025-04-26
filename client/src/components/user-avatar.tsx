import { Link } from "wouter";
import { User } from "@shared/schema";
import { useState } from "react";
import { 
  Avatar, 
  AvatarFallback 
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";

interface UserAvatarProps {
  user: User;
}

export function UserAvatar({ user }: UserAvatarProps) {
  const { logoutMutation } = useAuth();
  const [open, setOpen] = useState(false);
  
  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };
  
  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    window.location.href = '/'; // Reload the page after logout
  };
  
  return (
    <div className="relative z-10">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center space-x-1 bg-black bg-opacity-20 rounded-full pl-1 pr-2 py-1 hover:bg-opacity-30 transition duration-200">
            <Avatar className="h-8 w-8 border-2 border-accent">
              <AvatarFallback className="bg-accent text-white">
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="h-4 w-4 text-gray-200" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 glass bg-black bg-opacity-80 backdrop-blur border-accent">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-white">{user.username}</p>
              <p className="text-xs leading-none text-gray-400">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/profile">
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-accent hover:bg-opacity-20"
              onClick={() => setOpen(false)}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer text-red-500 hover:text-red-400 hover:bg-red-900 hover:bg-opacity-20"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}