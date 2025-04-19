"use client";
import { Plus, Search } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axiosClient from "@/lib/axiosClient";
import { useAdminInfo } from "@/hooks/share-admin-context";
import { toastingSuccess } from "@/lib/crm_api_toast/toastingSuccess";
import { toastingError } from "@/lib/crm_api_toast/toastingErrors";

export default function Categories() {
  const [getName, setGetName] = useState<string>("");
  const [getDesc, setGetDesc] = useState<string>("");
  const [openPopUp, setOpenPopUp] = useState<boolean>(false);
  const [categoryData, setCategories] = useState<Category[] | []>([]);
  const [update, setUpdate] = useState<boolean>(false);
  const [updateFollowingId, setUpdateFollowingId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const admin_info = useAdminInfo();

  const get_category_data = async () => {
    try {
      const res = await axiosClient.get("crm/category/categoryMethods");
      setCategories(res.data.categories);
    } catch (err) {
      toastingError(err);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const res = await axiosClient.post("crm/category/categoryMethods", {
        name: getName,
        description: getDesc,
        ownerId: admin_info?.id,
      });
      // setCategories((prev) => [...prev, res.data.createdCategory]);
      if (categoryData && categoryData.length === 0) {
        setCategories((prev) => [...prev, res.data.createdCategory]);
      } else if (categoryData && categoryData.length > 0) {
        setCategories((prev) => [...prev, res.data.createdCategory]);
      } else {
        setCategories(res.data.createdCategory);
        window.location.reload();
      }
      toastingSuccess(res);
      setOpenPopUp(false);
      setGetName("");
      setGetDesc("");
    } catch (err) {
      toastingError(err);
    }
  };

  const onDelete = async (itemId: string) => {
    try {
      const res = await axiosClient.delete("crm/category/categoryMethods", {
        data: {
          id: itemId,
          ownerId: admin_info?.id,
        },
      });
      setCategories((prev) => prev.filter((product) => product.id !== itemId));
      toastingSuccess(res);
    } catch (err) {
      toastingError(err);
    }
  };

  const onUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const res = await axiosClient.patch("crm/category/categoryMethods", {
        id: updateFollowingId,
        ownerId: admin_info?.id,
        name: getName,
        description: getDesc,
      });
      setCategories((prev) =>
        prev.map((product) =>
          product.id === updateFollowingId
            ? { ...product, name: getName, description: getDesc }
            : product
        )
      );
      setUpdateFollowingId(null);
      setGetName("");
      setGetDesc("");
      toastingSuccess(res);
      setOpenPopUp(false);
      setUpdate(false);
    } catch (err) {
      toastingError(err);
    }
  };

  const filteredCategories =
    categoryData && categoryData.length > 0
      ? categoryData.filter(
          (category) =>
            category.name.toLowerCase().includes(searchTerm) ||
            category.description?.toLowerCase().includes(searchTerm)
        )
      : categoryData;

  useEffect(() => {
    get_category_data();
  }, []);

  return (
    <div className="h-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>

        <Dialog
          open={openPopUp}
          onOpenChange={(isOpen) => {
            setOpenPopUp(isOpen);
            if (update) {
              setUpdate(false);
              setUpdateFollowingId(null);
              setGetName("");
              setGetDesc("");
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={update ? onUpdate : onSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {update ? "Edit The Category " : "Add New Category"}
                </DialogTitle>
                <DialogDescription>
                  {update
                    ? "Edit the details of your exits category. Click update when you are done. "
                    : "Fill in the details for your new category. Click save when you are done."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Enter category name"
                    value={getName}
                    onChange={(e) => setGetName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter category description"
                    required
                    value={getDesc}
                    onChange={(e) => setGetDesc(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="!justify-center">
                {update ? (
                  <Button type="submit">Update Category</Button>
                ) : (
                  <Button type="submit">Save Category</Button>
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
                placeholder="Search category..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <div className="bg-muted p-3 grid grid-cols-12 font-medium justify-items-center">
              <div className="col-span-3">Name</div>
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Stock</div>
              <div className="col-span-2">Action</div>
            </div>

            <div className="divide-y max-h-[400px] overflow-y-scroll">
              {filteredCategories &&
                filteredCategories.length > 0 &&
                filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="p-3 grid grid-cols-12 items-center justify-items-center"
                  >
                    <div className="col-span-3 font-medium">
                      {category.name}
                    </div>
                    <div className="col-span-5 truncate">
                      {category.description}
                    </div>
                    <div className="col-span-2">
                      {!category.stock?.name ? "no stock" : category.stock.name}
                    </div>
                    <div className="col-span-2 gap-2">
                      <button
                        onClick={() => {
                          setUpdateFollowingId(category.id);
                          setUpdate(true);
                          setOpenPopUp(true);
                          setGetName(category.name);
                          if (typeof category.description === "string")
                            return setGetDesc(category.description);
                        }}
                      >
                        Edit
                      </button>

                      <button onClick={() => onDelete(category.id)}>
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
