import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import CarImage from "../../../../../../public/Forza-Horizon-5-Release-Date-How-to-pre-order-Download-Size-Everything-you-must-know.jpg";
import { useGetCategoriesQuery } from "@/app/crm/redux/services/categoryApi";
import Loader from "@/app/Loader";

function StepOne() {
  const {
    data: cate,
    isSuccess: isSuccessCategory,
    isLoading: isLoadingCategory,
    isError: isCategoryError,
  } = useGetCategoriesQuery();

  if (isCategoryError) {
    throw new Error("Failed Getting Categories");
  }

  const [MainImage, setMainImage] = useState<string | null>(null);

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];

    if (file) {
      const previewImage = URL.createObjectURL(file);
      setMainImage(previewImage);
    }
  };

  return (
    <TabsContent value="basic" className="space-y-4 py-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            {...register("name")}
            id="name"
            name="name"
            placeholder="Enter product name"
            required
          />
        </div>
        {errors.name && typeof errors.name.message == "string" && (
          <p> {errors.name.message} </p>
        )}

        <div className="grid gap-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            {...register("price")}
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            required
          />
        </div>
        {errors.price && typeof errors.price.message == "string" && (
          <p> {errors.price.message} </p>
        )}

        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            {...register("quantity")}
            id="quantity"
            name="quantity"
            type="number"
            step="1"
            min="1"
            placeholder="0"
            required
          />
        </div>
        {errors.quantity && typeof errors.quantity.message == "string" && (
          <p> {errors.quantity.message} </p>
        )}

        {isLoadingCategory ? (
          <Loader />
        ) : isSuccessCategory && cate.categories.length > 0 ? (
          <div className="grid gap-2">
            <Label htmlFor="categoryId">Category</Label>
            <select
              {...register("categoryId")}
              id="categoryId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {cate.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p>No Category</p>
        )}

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            {...register("description")}
            id="description"
            name="description"
            placeholder="Enter product description"
            required
          />
        </div>
        {errors.description &&
          typeof errors.description.message == "string" && (
            <p> {errors.description.message} </p>
          )}

        <div className="grid gap-2">
          <Label htmlFor="image">Product Image</Label>
          <div className="flex items-center gap-4">
            <div className="border rounded-md p-2 w-24 h-24 flex items-center justify-center">
              <Image
                src={MainImage || CarImage}
                alt="Product preview"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <Input
              {...register("image")}
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="flex-1"
            />
          </div>
        </div>
        {errors.image && typeof errors.image.message == "string" && (
          <p> {errors.image.message} </p>
        )}
      </div>
    </TabsContent>
  );
}

export default StepOne;
