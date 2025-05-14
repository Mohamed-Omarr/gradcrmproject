"use client";
import { useEffect, useState } from "react";
import { Filter, Plus, Search, Pencil, Trash2} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import StepOne from "./stepsToCreatePoduct/StepOne";
import StepThree from "./stepsToCreatePoduct/StepThree";
import StepTwo from "./stepsToCreatePoduct/StepTwo";
import axiosAdmin from "@/lib/axios/axiosAdmin";
import { useAdminInfo } from "@/hooks/crm/share-admin-context";
import { useColors } from "@/hooks/crm/share-colors-context";
import isEqual from "lodash.isequal";
import { useRouter } from "next/navigation";

const Step_One_Schema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  price: z.coerce.number().gt(0, "Price must be greater than 0"),
  quantity: z.coerce.number().int().gt(0, "Quantity must be greater than 0"),
  categoryId: z.coerce.number().int().gt(0, "Category Required "),
  image: z.any().refine(
    (fileList) => {
      return fileList instanceof FileList && fileList[0] instanceof File;
    },
    {
      message: "Image is required",
    }
  ),
});

const Step_Two_Schema = z.object({
  colors: z.array(z.number()).min(1, "Please select at least one color."),
});

const Step_Three_Schema = z.object({
  sizes: z.array(z.number()).min(1, "Please select at least one size."),
});

const steps = [
  { component: StepOne, schema: Step_One_Schema },
  { component: StepTwo, schema: Step_Two_Schema },
  { component: StepThree, schema: Step_Three_Schema },
];

export default function ProductsPage() {
  // data
  const [products, setProduct] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const adminInfo = useAdminInfo();
  const availableColors = useColors();
  
  // other states
  const [open, setOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updateFollowingProduct, setUpdateFollowingProduct] = useState<
    Product | undefined
  >(undefined);

  // Form State
  const [stepsIndex, setStepIndex] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const CombinedSchema =
    Step_One_Schema.merge(Step_Two_Schema).merge(Step_Three_Schema);

  const methods = useForm({
    resolver: zodResolver(CombinedSchema),
    mode: "onChange",
  });
  const {
    trigger,
    reset,
    watch,
    getValues,
    formState: { isValid  },
  } = methods;
 
  const stepFields = [
    ["name", "description", "price", "quantity", "image", "categoryId"], // Step 1
    ["colors"], // Step 2
    ["sizes"], // Step 3
  ];

const onNext = async () => {
  const fields = stepFields[stepsIndex];
  const fieldResults = {};

  // Validate each field individually and store result
  for (const field of fields) {
    const result = await trigger(field);
    fieldResults[field] = result;
  }

  console.log("Validation Results:", fieldResults);
  console.log("Form Values:", getValues());

  // Determine if all fields are valid
  const allValid = Object.values(fieldResults).every(Boolean);

  if (allValid) {
    setStepIndex((prev) => prev + 1);
  }
};

  const router = useRouter();
  const onSubmit = async (data: any) => {
    setIsSubmit(true);

    try {
      const {
        name,
        description,
        price,
        quantity,
        image,
        colors,
        sizes,
        categoryId,
      } = data;

      const formData = new FormData();
      formData.append("ownerId", adminInfo?.id);
      formData.append("categoryId", categoryId);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("qty", quantity);

      formData.append("thumbnail", image[0]); // image should be a FileList or [File]

      if (!isEditing) {
        const creating = await axiosAdmin
          .post("product/otherProductMethods", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((x) => {
            axiosAdmin.post("product/attributes/colorOfProductMethods", {
              colorIds: JSON.stringify(colors),
              productId: x.data.createdProduct.id,
            });
            axiosAdmin.post("product/attributes/sizeOfProductMethods", {
              sizeIds: JSON.stringify(sizes),
              productId: x.data.createdProduct.id,
            });
            return x;
          });

        toastingSuccess(creating,router.refresh);
        setProduct(creating.data.products);
      } else {
        formData.append("id", updateFollowingProduct.id); // <- extend like this

        await axiosAdmin.patch("product/attributes/colorOfProductMethods", {
          colorIds: JSON.stringify(colors),
          productId: 37,
        });

        await axiosAdmin.patch("product/attributes/sizeOfProductMethods", {
          sizeIds: JSON.stringify(sizes),
          productId: 37,
        });

        // now update the main product
        const res = await axiosAdmin.patch(
          "product/otherProductMethods",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toastingSuccess(res,router.refresh);

        setProduct(res.data.updatedProduct);
      }
    } catch (err) {
      toastingError(err);
    } finally {
      setOpen(false);
      setIsSubmit(false);
      setStepIndex(0);
      setIsEditing(false);
      setUpdateFollowingProduct(undefined);
      reset({
        name: undefined,
        description: undefined,
        price: undefined,
        quantity: undefined,
        colors: undefined,
        image: undefined,
        sizes: undefined,
        categoryId: undefined,
      });
    }
  };

  const onDelete = async (productId: number) => {
    try {
      const res = await axiosAdmin.delete("product/productMethods", {
        data: {
          id: productId,
          ownerId: adminInfo?.id,
        },
      });
      toastingSuccess(res,router.refresh);
    } catch (err) {
      toastingError(err);
    }
  };

  // fetch data product & category
  const fetchProduct = async () => {
    try {
      const res = await axiosAdmin.get("product/productMethods");
      setProduct(res.data.products);
      toastingSuccess(res);
    } catch (err) {
      toastingError(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosAdmin.get("category/categoryMethods");
      setCategories(res.data.categories);
      toastingSuccess(res);
    } catch (err) {
      toastingError(err);
    }
  };

  useEffect(() => {
    Promise.all([fetchProduct(), fetchCategories()]);
  }, []);

  if (!adminInfo) return alert("no admin info");

  const handleUpdate = (currentData: Product) => {
    setIsEditing(true);
    setUpdateFollowingProduct(currentData);
    setOpen(true);
    reset({
      name: currentData.name,
      description: currentData.description,
      price: currentData.price,
      quantity: currentData.qty,
      image: currentData.thumbnail,
      categoryId: currentData.categoryId,
      colors: currentData.colors.map((color) => color.id),
      sizes: currentData.sizes.map((size) => size.id),
    });
  };

  const StepComponent = steps[stepsIndex].component;
  const watched = watch();
  const simplifiedWatched = {
    name: watched.name,
    description: watched.description,
    price: Number(watched.price),
    quantity: Number(watched.quantity),
    categoryId: Number(watched.categoryId),
    colors: watched.colors?.sort(),
    sizes: watched.sizes?.sort(),
    // Don't include `image`
  };
  
  const simplifiedOriginal = updateFollowingProduct && {
    name: updateFollowingProduct.name,
    description: updateFollowingProduct.description,
    price: updateFollowingProduct.price,
    quantity: updateFollowingProduct.qty,
    categoryId: updateFollowingProduct.categoryId,
    colors: updateFollowingProduct.colors.map((c) => c.id).sort(),
    sizes: updateFollowingProduct.sizes.map((s) => s.id).sort(),
  };
  const hasChanges = !isEqual(simplifiedWatched, simplifiedOriginal);
  
  return (
    <FormProvider {...methods}>
      <div className="h-full space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Products</h1>

          <Dialog
            open={open}
            onOpenChange={(isOpen) => {
              setOpen(isOpen);
              setUpdateFollowingProduct(undefined);
              setStepIndex(0);
              setIsEditing(false);
              reset({
                name: undefined,
                description: undefined,
                price: undefined,
                quantity: undefined,
                colors: undefined,
                image: undefined,
                sizes: undefined,
                categoryId: undefined,
              });
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details for your new product. Click save when
                    you're done.
                  </DialogDescription>
                </DialogHeader>

                <Tabs
                  value={["basic", "colors", "sizes"][stepsIndex]}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      disabled={true}
                      value="basic"
                      className={stepsIndex === 0 ? "bg-muted  text-black" : ""}
                    >
                      Basic Info
                    </TabsTrigger>
                    <TabsTrigger
                      disabled={true}
                      value="colors"
                      className={stepsIndex === 1 ? "bg-muted  text-black" : ""}
                    >
                      Colors
                    </TabsTrigger>
                    <TabsTrigger
                      disabled={true}
                      value="sizes"
                      className={stepsIndex === 2 ? "bg-muted  text-black" : ""}
                    >
                      Sizes
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value={["basic", "colors", "sizes"][stepsIndex]}>
                    <StepComponent cate={categories} />
                  </TabsContent>
                </Tabs>

                {stepsIndex < 2 ? (
                  <Button type="button" onClick={onNext}>
                    Next
                  </Button>
                ) : isEditing ? (
                  <>
                    <Button type="submit" disabled={!hasChanges || isSubmit}>
                      {isSubmit ? "Save": "Saving"}
                    </Button>

                    <Button type="button" onClick={() => setOpen(false)}>
                      close
                    </Button>
                  </>
                ) : (
                  <Button type="submit" disabled={!isValid || isSubmit}>
                    {isSubmit ? "Save": "Saving"}
                  </Button>
                )}
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
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
                products.map((item, index) => (
                  <div key={index} className="divide-y">
                    <div className="p-3 grid grid-cols-12 items-center">
                      <div className="col-span-1">
                        <Image
                          src={item.thumbnail}
                          alt="img"
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="col-span-2 font-medium">{item.name}</div>
                      <div className="col-span-3 truncate">
                        {item.description}
                      </div>
                      <div className="col-span-1">${item.price}</div>
                      <div className="col-span-2">
                        <span>status</span>
                      </div>
                      <div className="col-span-2">
                        <div className="flex flex-wrap gap-1">
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                            {item.colors.length} colors
                          </span>
                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                            {item.sizes.length} sizes
                          </span>
                          {item.colors && item.colors.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {item.colors.slice(0, 3).map((colorId) => {
                                const color = availableColors.find(
                                  (c) => c.id === colorId.id
                                );
                                return color ? (
                                  <div
                                    key={color.id}
                                    className="w-4 h-4 rounded-full border"
                                    style={{ backgroundColor: color.code }}
                                    title={color.name}
                                  ></div>
                                ) : null;
                              })}
                              {item.colors.length > 3 && (
                                <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[10px]">
                                  +{item.colors.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-1 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => {
                              handleUpdate(item);
                            }}
                            variant="ghost"
                            size="icon"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            onClick={() => onDelete(item.id)}
                            variant="ghost"
                            size="icon"
                          >
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
    </FormProvider>
  );
}
