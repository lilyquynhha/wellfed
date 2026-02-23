"use client";

import { Menu } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <Link
          href={item.url}
          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {item.title}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      className="flex min-w-80 flex-row gap-4 rounded-md p-3 no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default function Navbar() {
  const supabase = createClient();
  const router = useRouter();

  const notLoggedInMenu = [
    { title: "Home", url: "/" },
    { title: "Create a Food", url: "/my-foods/create" },
    { title: "Create a Meal/Recipe", url: "/my-creations/create" },
  ];

  const loggedInMenu = [
    { title: "Home", url: "/" },
    {
      title: "My Foods",
      url: "#",
      items: [
        {
          title: "View All Foods",
          url: "/my-foods/all",
        },
        {
          title: "Create a Food",
          url: "/my-foods/create",
        },
      ],
    },
    {
      title: "My Creations",
      url: "#",
      items: [
        {
          title: "View All Creations",
          url: "/my-creations/all",
        },
        {
          title: "Create a Meal/Recipe",
          url: "/my-creations/create",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
    },
  ];
  const [user, setUser] = useState<User | null>();
  const [currentMenu, setCurrentMenu] = useState(notLoggedInMenu);

  const logOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/auth/login");
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setCurrentMenu(session?.user ? loggedInMenu : notLoggedInMenu);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <section className="p-6 mx-auto max-w-6xl">
      {/* Desktop Menu */}
      <nav className="hidden items-center justify-between md:flex">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/icon.svg" className="max-h-8" alt="logo" />
            <span className="text-lg font-semibold tracking-tighter">
              WellFed
            </span>
          </Link>
          <div className="flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {currentMenu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex gap-2">
          {user ? (
            <>
              <Button
                size="sm"
                onClick={() => {
                  logOut();
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              {" "}
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="block md:hidden">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/icon.svg" className="max-h-8" alt="logo" />
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2">
                    <img src="/icon.svg" className="max-h-8" alt="logo" />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 p-4">
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col gap-4"
                >
                  {currentMenu.map((item) => renderMobileMenuItem(item))}
                </Accordion>

                <div className="flex flex-col gap-3">
                  {user ? (
                    <>
                      <Button
                        onClick={() => {
                          logOut();
                        }}
                      >
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline">
                        <Link href="/auth/login">Login</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/auth/sign-up">Sign up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
}
