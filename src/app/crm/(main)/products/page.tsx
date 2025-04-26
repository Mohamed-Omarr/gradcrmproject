"use client";
import { Filter, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useEffect, useMemo, useState } from "react";
import axiosAdmin from "@/lib/axios/axiosAdmin";
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import { useAdminInfo } from "@/hooks/share-admin-context";

export default function Products() {
  const [getName, setGetName] = useState<string>("");
  const [getDesc, setGetDesc] = useState<string>("");
  const [getPrice, setGetPrice] = useState<number>(0);
  const [getQty, setGetQty] = useState<number>(1);
  const [openPopUp, setOpenPopUp] = useState<boolean>(false);
  const [productData, setProduct] = useState<Product[] | []>([]);
  const [categoryData, setCategories] = useState<Category[] | []>([]);
  const [update, setUpdate] = useState<boolean>(false);
  const [updateFollowingId, setUpdateFollowingId] = useState<
    number | undefined
  >(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentCategoryName, setCurrentCategoryName] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [stockStatus, setStockStatus] = useState<string>("All");
  const admin_info = useAdminInfo();

  const get_category_data = async () => {
    try {
      const res = await axiosAdmin.get("crm/category/categoryMethods");
      setCategories(res.data.categories);
    } catch (err) {
      toastingError(err);
    }
  };

  const get_product_data = async () => {
    try {
      const res = await axiosAdmin.get("crm/product/productMethods");
      setProduct(res.data.products);
    } catch (err) {
      toastingError(err);
    }
  };

  const handleSelectCategory = (value: string) => {
    setSelectedCategoryName(value);

    const scanValue = categoryData.find((item) => item.name === value);
    if (scanValue) {
      setSelectedCategoryId(scanValue.id);
    } else {
      throw new Error("Failed to find the id of selected category");
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const res = await axiosAdmin.post("crm/product/productMethods", {
        name: getName,
        description: getDesc,
        price: getPrice,
        qty: getQty,
        ownerId: admin_info?.id,
        categoryId: selectedCategoryId,
      });
      if (productData && productData.length === 0) {
        setProduct((prev) => [...prev, res.data.createdProduct]);
      } else if (productData) {
        setProduct((prev) => [...prev, res.data.createdProduct]);
      } else {
        setProduct(res.data.createdProduct); // Ensure it's an array
      }

      setOpenPopUp(false);
      toastingSuccess(res);

      // changing the state to default
      setSelectedCategoryId(null);
      setSelectedCategoryName("");
      setGetName("");
      setGetDesc("");
      setGetPrice(0);
      setGetQty(1);
    } catch (err) {
      toastingError(err);
    }
  };

  const onDelete = async (itemId: number) => {
    try {
      const res = await axiosAdmin.delete("crm/product/productMethods", {
        data: {
          id: itemId,
          ownerId: admin_info?.id,
        },
      });
      setProduct((prev) => prev.filter((product) => product.id !== itemId));
      toastingSuccess(res);
    } catch (err) {
      toastingError(err);
    }
  };

  const onUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const res = await axiosAdmin.patch("crm/product/productMethods", {
        id: updateFollowingId,
        ownerId: admin_info?.id,
        name: getName,
        description: getDesc,
        price: getPrice,
        qty: getQty,
        categoryId: selectedCategoryId,
      });

      setProduct((prev) =>
        prev.map((product) =>
          product.id === updateFollowingId
            ? { ...product, ...res.data.updatedProduct } // Correctly spread properties of updatedProduct
            : product
        )
      );

      setOpenPopUp(false);
      toastingSuccess(res);

      // changing the state to default
      setUpdate(false);
      setUpdateFollowingId(undefined);
      setSelectedCategoryId(null);
      setCurrentCategoryName("");
      setSelectedCategoryName("");
      setGetName("");
      setGetDesc("");
      setGetPrice(0);
      setGetQty(1);
    } catch (err) {
      toastingError(err);
    }
  };

  useEffect(() => {
    get_product_data();
    get_category_data();
  }, []);

  // handling filter product
  const filteredProducts = useMemo(() => {
    if (!productData || productData.length === 0) return [];

    // search filter
    let result = productData.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.category.name?.toLowerCase().includes(searchTerm)
    );

    // stock status filter
    switch (stockStatus) {
      case "High In Stock":
        result = result.filter((product) => product.qty > 50);
        break;

      case "Low In Stock":
        result = result.filter(
          (product) => product.qty <= 50 && product.qty > 0
        );
        break;

      case "Null In Stock":
        result = result.filter((product) => product.qty === 0);
        break;

      case "All":
        break;
      default:
        setStockStatus("All");
        break;
    }

    return result;
  }, [productData, searchTerm, stockStatus]);

  return (
    <div className="h-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>

        <Dialog
          open={openPopUp}
          onOpenChange={(isOpen) => {
            setOpenPopUp(isOpen);
            if (!isOpen) {
              setUpdate(false);
              setUpdateFollowingId(undefined);
              setSelectedCategoryId(null);
              setCurrentCategoryName("");
              setSelectedCategoryName("");
              setGetName("");
              setGetDesc("");
              setGetPrice(0);
              setGetQty(1);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={update ? onUpdate : onSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {update ? "Edit The Product " : "Add New Product"}
                </DialogTitle>
                <DialogDescription>
                  {update
                    ? "Edit the details of your exits Product. Click update when you are done. "
                    : "Fill in the details for your new Product. Click save when you are done."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Enter Product name"
                    value={getName}
                    onChange={(e) => setGetName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter Product description"
                    required
                    value={getDesc}
                    onChange={(e) => setGetDesc(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price"> Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    required
                    placeholder="Enter Product price"
                    value={getPrice}
                    onChange={(e) => setGetPrice(Number(e.target.value))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity"> Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    required
                    placeholder="Enter Product quantity"
                    value={getQty}
                    onChange={(e) => setGetQty(Number(e.target.value))}
                  />
                </div>
                {categoryData && categoryData.length > 0 && !update ? (
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      required
                      value={selectedCategoryName}
                      onValueChange={handleSelectCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryData
                          .filter((x: Category) => x.name && x.id && x.stock)
                          .map((item) => (
                            <SelectItem key={item.id} value={item.name}>
                              {item.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="status">Category</Label>
                    <div className="flex items-center justify-between gap-2">
                      <Select
                        required
                        value={selectedCategoryName}
                        onValueChange={handleSelectCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={currentCategoryName} />
                        </SelectTrigger>
                        {categoryData && categoryData.length > 0 && (
                          <SelectContent>
                            {categoryData
                              .filter(
                                (x: Category) =>
                                  x.name !== currentCategoryName &&
                                  x.id &&
                                  x.stock?.name
                              )
                              .map((item) => (
                                <SelectItem key={item.id} value={item.name}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            {categoryData
                              .filter(
                                (x: Category) =>
                                  x.id && x.name === currentCategoryName
                              )
                              .map((item) => (
                                <SelectItem
                                  key={item.id}
                                  value={item.name}
                                  className="bg-black text-white font-semibold"
                                >
                                  default: {item.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        )}
                      </Select>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="!justify-center">
                {update ? (
                  <Button type="submit">Update Product</Button>
                ) : (
                  <Button type="submit">Add Product</Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Product..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              />
            </div>
            <div className="flex gap-2">
              <Select
                defaultValue="All"
                onValueChange={setStockStatus}
                value={stockStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>{stockStatus}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="High In Stock">High In Stock</SelectItem>
                  <SelectItem value="Low In Stock">Low In Stock</SelectItem>
                  <SelectItem value="Null In Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <div className="bg-muted p-3 grid grid-cols-12 font-medium justify-items-center">
              <div className="col-span-1">Name</div>
              <div className="col-span-5">Description</div>
              <div className="col-span-1">Price</div>
              <div className="col-span-1">Quantity</div>
              <div className="col-span-1">Category</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Action</div>
            </div>

            <div className="divide-y max-h-[400px] overflow-y-scroll">
              {filteredProducts &&
                filteredProducts.length > 0 &&
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-3 grid grid-cols-12 items-center justify-items-center"
                  >
                    <div className="col-span-1 font-medium">{product.name}</div>
                    <div className="col-span-5 truncate">
                      {product.description}
                    </div>
                    <div className="col-span-1 font-medium">
                      {product.price}
                    </div>
                    <div className="col-span-1 font-medium">{product.qty}</div>
                    <div className="col-span-1">{product.category.name}</div>
                    <div className="col-span-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.qty === 0
                            ? "bg-red-100 text-red-800" // Empty in stock (Red)
                            : product.qty > 50
                            ? "bg-green-100 text-green-800" // High in stock (Green)
                            : "bg-yellow-100 text-yellow-800" // Low in stock (Yellow)
                        }`}
                      >
                        {product.qty === 0
                          ? "Null in Stock"
                          : product.qty > 50
                          ? "High in Stock"
                          : "Low in Stock"}
                      </span>
                    </div>
                    <div className="col-span-2 gap-2">
                      <button
                        onClick={() => {
                          setUpdate(true);
                          setOpenPopUp(true);
                          setUpdateFollowingId(product.id);
                          setCurrentCategoryName(product.category.name);
                          setGetName(product.name);
                          setGetPrice(product.price);
                          setGetQty(product.qty);
                          setSelectedCategoryId(product.categoryId);
                          if (typeof product.description === "string")
                            return setGetDesc(product.description);
                        }}
                      >
                        Edit
                      </button>

                      <button onClick={() => onDelete(product.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

{
  /* <span
className={`px-2 py-1 rounded-full text-xs font-medium ${
  product.status === "In Stock"
    ? "bg-green-100 text-green-800"
    : product.status === "Low Stock"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800"
}`}
>
{product.status}
</span> */
}
