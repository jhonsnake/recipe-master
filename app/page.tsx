import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CookingPot, Users, ShoppingBasket, Carrot } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const features = [
    {
      title: "Gestión de Ingredientes",
      description: "Administra ingredientes con unidades de medida personalizadas e información nutricional",
      icon: Carrot,
      href: "/ingredients"
    },
    {
      title: "Creación de Recetas",
      description: "Crea y gestiona recetas con cálculos nutricionales automáticos",
      icon: CookingPot,
      href: "/recipes"
    },
    {
      title: "Personas y Objetivos",
      description: "Seguimiento de objetivos y requerimientos nutricionales",
      icon: Users,
      href: "/people"
    },
    {
      title: "Planificación de Comidas",
      description: "Planifica comidas y genera listas de compras automáticamente",
      icon: ShoppingBasket,
      href: "/planner"
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Gestor de Recetas
        </h1>
        <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground">
          Aplicación moderna para gestión de recetas y nutrición con unidades de medida personalizadas,
          planificación de comidas y seguimiento nutricional.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col">
            <CardHeader>
              <feature.icon className="h-8 w-8 mb-2" />
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-end">
              <Button asChild className="w-full">
                <Link href={feature.href}>Comenzar</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}