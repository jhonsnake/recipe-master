```typescript
"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface CustomUnit {
  id?: string
  name: string
  amount: number
}

interface Ingredient {
  id: string
  name: string
  description: string
  imageUrl?: string
  baseUnit: string
  calories: number
  carbs: number
  fiber: number
  sugar: number
  totalFat: number
  protein: number
  customUnits: CustomUnit[]
}

const standardUnits = [
  { value: "gramos", label: "Gramos (g)" },
  { value: "mililitros", label: "Mililitros (ml)" },
  { value: "unidades", label: "Unidades (u)" },
  { value: "kilogramos", label: "Kilogramos (kg)" },
  { value: "litros", label: "Litros (l)" },
  { value: "onzas", label: "Onzas (oz)" },
  { value: "libras", label: "Libras (lb)" },
]

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [customUnits, setCustomUnits] = useState<CustomUnit[]>([{ name: "", amount: 0 }])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchIngredients()
  }, [])

  const fetchIngredients = async () => {
    try {
      const response = await fetch('/api/ingredients')
      const data = await response.json()
      setIngredients(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar los ingredientes",
        variant: "destructive",
      })
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addCustomUnit = () => {
    setCustomUnits([...customUnits, { name: "", amount: 0 }])
  }

  const removeCustomUnit = (index: number) => {
    setCustomUnits(customUnits.filter((_, i) => i !== index))
  }

  const updateCustomUnit = (index: number, field: keyof CustomUnit, value: string | number) => {
    const newUnits = [...customUnits]
    newUnits[index] = { ...newUnits[index], [field]: value }
    setCustomUnits(newUnits)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    let imageUrl = formData.get("imageUrl") as string
    
    if (selectedImage) {
      const imageFormData = new FormData()
      imageFormData.append("image", selectedImage)
      
      try {
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        })
        
        if (!uploadResponse.ok) throw new Error("Error al subir la imagen")
        
        const { url } = await uploadResponse.json()
        imageUrl = url
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al subir la imagen",
          variant: "destructive",
        })
        return
      }
    }
    
    // Filter out empty custom units
    const validCustomUnits = customUnits.filter(unit => unit.name && unit.amount > 0)
    
    const ingredientData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      imageUrl,
      baseUnit: formData.get("baseUnit") as string,
      calories: parseFloat(formData.get("calories") as string),
      carbs: parseFloat(formData.get("carbs") as string),
      fiber: parseFloat(formData.get("fiber") as string),
      sugar: parseFloat(formData.get("sugar") as string),
      totalFat: parseFloat(formData.get("totalFat") as string),
      protein: parseFloat(formData.get("protein") as string),
      customUnits: validCustomUnits
    }

    try {
      if (editingIngredient) {
        const response = await fetch(`/api/ingredients/${editingIngredient.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ingredientData),
        })
        
        if (!response.ok) throw new Error("Error al actualizar el ingrediente")
        
        const updatedIngredient = await response.json()
        setIngredients(ingredients.map(ing => 
          ing.id === editingIngredient.id ? updatedIngredient : ing
        ))
        
        toast({
          title: "Ingrediente actualizado",
          description: "El ingrediente se ha actualizado correctamente",
        })
      } else {
        const response = await fetch("/api/ingredients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ingredientData),
        })
        
        if (!response.ok) throw new Error("Error al crear el ingrediente")
        
        const newIngredient = await response.json()
        setIngredients([...ingredients, newIngredient])
        
        toast({
          title: "Ingrediente creado",
          description: "El nuevo ingrediente se ha creado correctamente",
        })
      }
      
      setIsAddDialogOpen(false)
      setEditingIngredient(null)
      setSelectedImage(null)
      setImagePreview(null)
      setCustomUnits([{ name: "", amount: 0 }])
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al procesar el ingrediente",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/ingredients/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) throw new Error("Error al eliminar el ingrediente")
      
      setIngredients(ingredients.filter(ing => ing.id !== id))
      
      toast({
        title: "Ingrediente eliminado",
        description: "El ingrediente se ha eliminado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al eliminar el ingrediente",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient)
    setCustomUnits(ingredient.customUnits.length > 0 ? ingredient.customUnits : [{ name: "", amount: 0 }])
    setIsAddDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ingredientes</h1>
          <p className="text-muted-foreground">
            Gestiona tus ingredientes y su información nutricional
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Ingrediente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingIngredient ? "Editar Ingrediente" : "Añadir Ingrediente"}
                </DialogTitle>
                <DialogDescription>
                  Complete los detalles del ingrediente a continuación
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingIngredient?.name}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingIngredient?.description}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Imagen</Label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Subir Imagen
                      </Button>
                      <span className="text-sm text-muted-foreground">o</span>
                      <Input
                        name="imageUrl"
                        type="url"
                        placeholder="URL de la imagen"
                        defaultValue={editingIngredient?.imageUrl}
                      />
                    </div>
                    {(imagePreview || editingIngredient?.imageUrl) && (
                      <div className="relative w-40 h-40">
                        <Image
                          src={imagePreview || editingIngredient?.imageUrl || ''}
                          alt="Preview"
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="baseUnit">Unidad Base</Label>
                  <Select name="baseUnit" defaultValue={editingIngredient?.baseUnit || "gramos"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {standardUnits.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Unidades Personalizadas</Label>
                    <Button type="button" variant="outline" onClick={addCustomUnit}>
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir Unidad
                    </Button>
                  </div>
                  {customUnits.map((unit, index) => (
                    <div key={index} className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Label>Nombre</Label>
                        <Input
                          value={unit.name}
                          onChange={(e) => updateCustomUnit(index, 'name', e.target.value)}
                          placeholder="ej: Taza"
                        />
                      </div>
                      <div className="flex-1">
                        <Label>Equivalencia</Label>
                        <Input
                          type="number"
                          value={unit.amount}
                          onChange={(e) => updateCustomUnit(index, 'amount', parseFloat(e.target.value))}
                          placeholder="ej: 250"
                        />
                      </div>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeCustomUnit(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="calories">Calorías (por 100g)</Label>
                    <Input
                      id="calories"
                      name="calories"
                      type="number"
                      step="0.1"
                      defaultValue={editingIngredient?.calories || 0}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="carbs">Carbohidratos (g)</Label>
                    <Input
                      id="carbs"
                      name="carbs"
                      type="number"
                      step="0.1"
                      defaultValue={editingIngredient?.carbs || 0}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fiber">Fibra (g)</Label>
                    <Input
                      id="fiber"
                      name="fiber"
                      type="number"
                      step="0.1"
                      defaultValue={editingIngredient?.fiber || 0}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sugar">Azúcares (g)</Label>
                    <Input
                      id="sugar"
                      name="sugar"
                      type="number"
                      step="0.1"
                      defaultValue={editingIngredient?.sugar || 0}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="totalFat">Grasas totales (g)</Label>
                    <Input
                      id="totalFat"
                      name="totalFat"
                      type="number"
                      step="0.1"
                      defaultValue={editingIngredient?.totalFat || 0}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="protein">Proteínas (g)</Label>
                    <Input
                      id="protein"
                      name="protein"
                      type="number"
                      step="0.1"
                      defaultValue={editingIngredient?.protein || 0}
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingIngredient ? "Guardar Cambios" : "Añadir Ingrediente"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ingredients.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6 text-center text-muted-foreground">
              No hay ingredientes añadidos aún
            </CardContent>
          </Card>
        ) : (
          ingredients.map((ingredient) => (
            <Card key={ingredient.id}>
              <CardHeader>
                {ingredient.imageUrl && (
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={ingredient.imageUrl}
                      alt={ingredient.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
                <CardTitle className="flex justify-between items-center">
                  {ingredient.name}
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(ingredient)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(ingredient.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>{ingredient.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm">
                    <span className="font-medium">Unidad base:</span> {ingredient.baseUnit}
                    {ingredient.customUnits.length > 0 && (
                      <div className="mt-2">
                        <span className="font-medium">Unidades personalizadas:</span>
                        <ul className="mt-1 space-y-1">
                          {ingredient.customUnits.map((unit) => (
                            <li key={unit.id}>
                              1 {unit.name} = {unit.amount} {ingredient.baseUnit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Calorías: {ingredient.calories}kcal</div>
                    <div>Carbohidratos: {ingredient.carbs}g</div>
                    <div>Fibra: {ingredient.fiber}g</div>
                    <div>Azúcares: {ingredient.sugar}g</div>
                    <div>Grasas: {ingredient.totalFat}g</div>
                    <div>Proteínas: {ingredient.protein}g</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
```