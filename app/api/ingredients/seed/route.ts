```typescript
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const exampleIngredients = [
  {
    name: "Arroz blanco",
    description: "Arroz blanco de grano largo",
    imageUrl: "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&q=80&w=800",
    baseUnit: "gramos",
    calories: 130,
    carbs: 28,
    fiber: 0.6,
    sugar: 0.1,
    totalFat: 0.3,
    protein: 2.7,
    customUnits: [
      { name: "Taza", amount: 200 },
      { name: "Cucharada", amount: 15 }
    ]
  },
  {
    name: "Leche entera",
    description: "Leche de vaca entera",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800",
    baseUnit: "mililitros",
    calories: 61,
    carbs: 4.8,
    fiber: 0,
    sugar: 4.8,
    totalFat: 3.3,
    protein: 3.2,
    customUnits: [
      { name: "Taza", amount: 250 },
      { name: "Vaso", amount: 200 }
    ]
  },
  {
    name: "Huevo",
    description: "Huevo de gallina mediano",
    imageUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&q=80&w=800",
    baseUnit: "unidades",
    calories: 72,
    carbs: 0.6,
    fiber: 0,
    sugar: 0.6,
    totalFat: 4.8,
    protein: 6.3,
    customUnits: []
  },
  {
    name: "Harina de trigo",
    description: "Harina de trigo todo uso",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800",
    baseUnit: "gramos",
    calories: 364,
    carbs: 76,
    fiber: 2.7,
    sugar: 0.3,
    totalFat: 1,
    protein: 10,
    customUnits: [
      { name: "Taza", amount: 120 },
      { name: "Cucharada", amount: 8 }
    ]
  }
]

export async function POST() {
  try {
    // Delete existing ingredients
    await prisma.ingredient.deleteMany()
    
    // Create new ingredients with their custom units
    const ingredients = await Promise.all(
      exampleIngredients.map(async (data) => {
        return prisma.ingredient.create({
          data: {
            name: data.name,
            description: data.description,
            imageUrl: data.imageUrl,
            baseUnit: data.baseUnit,
            calories: data.calories,
            carbs: data.carbs,
            fiber: data.fiber,
            sugar: data.sugar,
            totalFat: data.totalFat,
            protein: data.protein,
            customUnits: {
              create: data.customUnits
            }
          },
          include: {
            customUnits: true
          }
        })
      })
    )

    return NextResponse.json({
      message: "Ingredientes de ejemplo creados correctamente",
      count: ingredients.length
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear ingredientes de ejemplo' },
      { status: 500 }
    )
  }
}
```