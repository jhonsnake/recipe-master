import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany({
      include: {
        customUnits: true
      }
    })
    return NextResponse.json(ingredients)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener ingredientes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const ingredient = await prisma.ingredient.create({
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
          create: data.customUnits || []
        }
      },
      include: {
        customUnits: true
      }
    })
    return NextResponse.json(ingredient)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear ingrediente' },
      { status: 500 }
    )
  }
}