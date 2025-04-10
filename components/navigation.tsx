"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CookingPot, Users, ShoppingBasket, Carrot } from "lucide-react"

const navigation = [
  {
    name: "Ingredientes",
    href: "/ingredients",
    icon: Carrot
  },
  {
    name: "Recetas",
    href: "/recipes",
    icon: CookingPot
  },
  {
    name: "Personas",
    href: "/people",
    icon: Users
  },
  {
    name: "Planificador",
    href: "/planner",
    icon: ShoppingBasket
  }
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <CookingPot className="h-6 w-6" />
              <span className="text-lg font-bold">Gestor de Recetas</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.name}
                  variant={pathname.startsWith(item.href) ? "default" : "ghost"}
                  asChild
                >
                  <Link href={item.href} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}