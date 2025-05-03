"use client";
import { useState } from "react";
import { Filter, Plus, Search, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useSizes } from "@/hooks/crm/share-sizes-context";
import { useColors } from "@/hooks/crm/share-colors-context";

export default function ProductsPage() {
  // data
  const [products, setProduct] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const allSizes = useSizes();
  const allColors = useColors();

  // other states
  const [open, setOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <div className="h-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Dialog>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details for your new product. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="sizes">Sizes</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter product description"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Low Stock">Low Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Product Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="border rounded-md p-2 w-24 h-24 flex items-center justify-center">
                      <Image
                        src={"/placeholder.svg"}
                        alt="Product preview"
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </div>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Colors Tab */}
            <TabsContent value="colors" className="py-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Available Colors</h3>
                  <span className="text-sm text-muted-foreground">
                    withlngth selected
                  </span>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`color-`} />
                    <div className="w-6 h-6 rounded border"></div>
                    <Label htmlFor={`color-`} className="flex-1">
                      color name
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      color code
                    </span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground italic">
                  No colors selected. This product will not have color options.
                </div>
              </div>
            </TabsContent>

            {/* Sizes Tab */}
            <TabsContent value="sizes" className="py-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Available Sizes</h3>
                  <span className="text-sm text-muted-foreground">
                    withlength selected
                  </span>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`size-`} />
                    <div className="w-8 h-8 rounded border flex items-center justify-center font-medium">
                      size code
                    </div>
                    <Label htmlFor={`size-`} className="flex-1">
                      size name
                    </Label>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground italic">
                  No sizes selected. This product will not have size options.
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button">Save Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Status</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* product list */}
          <div className="rounded-md border">
            <div className="bg-muted p-3 grid grid-cols-12 font-medium">
              <div className="col-span-1">Image</div>
              <div className="col-span-2">Name</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-1">Price</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Options</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {products && products.length > 0 ? (
              products.map((item,index) => (
                <div key={index} className="divide-y">
                  <div className="p-3 grid grid-cols-12 items-center">
                    <div className="col-span-1">
                      <Image
                        src={"/placeholder.svg"}
                        alt="img"
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="col-span-2 font-medium">{item.name}</div>
                    <div className="col-span-3 truncate">{item.description}</div>
                    <div className="col-span-1">${item.price}</div>
                    <div className="col-span-2">
                      <span>status</span>
                    </div>
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                        {item.colors.length}
                        </span>
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                        {item.sizes.length}
                        </span>
                        <div className="flex gap-1 mt-1">
                          <div className="w-4 h-4 rounded-full border">
                            color cirucle
                          </div>
                          <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[10px]">
                            +color of productlength
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Currently No Products Avalibles</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
