"use client";

import Link from "next/link";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

interface NavbarItem {
  href: string;
  children: React.ReactNode;
}

interface NavbarSidebarProps {
  items: NavbarItem[];
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export const NavbarSidebar = ({
  items,
  open,
  onOpenChangeAction,
}: NavbarSidebarProps) => {
  const trpc = useTRPC();
  const { data: session } = useQuery(trpc.auth.session.queryOptions());

  return (
    <Sheet open={open} onOpenChange={onOpenChangeAction}>
      <SheetContent side="left" className="gap-0 transition-none">
        <SheetHeader className="border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {items.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-semibold"
              onClick={() => onOpenChangeAction(false)}
            >
              {item.children}
            </Link>
          ))}
          <div className="border-t">
            {session?.user ? (
              <Link
                href="/admin"
                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-semibold"
                onClick={() => onOpenChangeAction(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-semibold"
                  onClick={() => onOpenChangeAction(false)}
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-semibold"
                  onClick={() => onOpenChangeAction(false)}
                >
                  Start selling
                </Link>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
