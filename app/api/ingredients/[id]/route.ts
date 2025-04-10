import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: params.id },
      include: {
        customUnits: true
      }
    })
    if (!ingredient) {
      return NextResponse.json(
        { error: 'Ingrediente no encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(ingredient)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener ingrediente' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    // First, delete all existing custom units
    await prisma.customUnit.deleteMany({
      where: { ingredientId: params.id }
    })
    
    // Then update the ingredient with new data
    const ingredient = await prisma.ingredient.update({
      where: { id: params.id },
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
      { error: 'Error al actualizar ingrediente' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.ingredient.delete({
      where: { id: params.id }
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar ingrediente' },
      { status: 500 }
    )
  }
}