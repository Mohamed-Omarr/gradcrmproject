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
import { useMemo, useState } from "react";
import { useAdminInfo } from "@/hooks/crm/share-admin-context";
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../../redux/services/categoryApi";
import Loader from "@/app/Loader";

export default function Categories() {
  const [getName, setGetName] = useState<string>("");
  const [getDesc, setGetDesc] = useState<string>("");
  const [openPopUp, setOpenPopUp] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);
  const [updateFollowingId, setUpdateFollowingId] = useState<
    number | undefined
  >(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const admin_info = useAdminInfo();

  // get data through rtq
  const { data, isLoading:isGettingData, isSuccess } = useGetCategoriesQuery();

  const [createCategory,{isLoading:isCreating}] = useCreateCategoryMutation();
  const [deleteCategory,{isLoading:isDeleting}] = useDeleteCategoryMutation();
  const [updateCategory,{isLoading:isUpdating}] = useUpdateCategoryMutation();

  const isLoading = isGettingData || isCreating || isDeleting || isUpdating

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    const itemData = {
      name: getName,
      description: getDesc,
      ownerId: admin_info?.id,
    };
    const res = await createCategory(itemData);
    if (res.data) {
      toastingSuccess(res.data.message);
      setOpenPopUp(false);
      setGetName("");
      setGetDesc("");
    } else {
      toastingError(res.error);
    }
  };

  const onDelete = async (itemId: number) => {
    const itemData = {
      id: itemId,
      ownerId: admin_info?.id,
    };
    const res = await deleteCategory(itemData);
    if (res.data) {
      toastingSuccess(res.data.message);
    } else {
      toastingError(res.error);
    }
  };

  const onUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    const itemData = {
      id: updateFollowingId,
      ownerId: admin_info?.id,
      name: getName,
      description: getDesc,
    };
    const res = await updateCategory(itemData);

    if (res.data) {
      setOpenPopUp(false);
      setUpdate(false);
      setUpdateFollowingId(undefined);
      setGetName("");
      setGetDesc("");
      toastingSuccess(res.data.message);
    } else {
      toastingError(res.error);
    }
  };

  const filteredCategories = useMemo(() => {
    if (!isSuccess || !data.categories) return [];

    const term = searchTerm.toLowerCase();

    return data.categories.filter(
      (category) =>
        category.name.toLowerCase().includes(term) ||
        category.description?.toLowerCase().includes(term)
    );
  }, [isSuccess, data, searchTerm]);

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
              setUpdateFollowingId(undefined);
              setGetName("");
              setGetDesc("");
            }
          }}
        >
          <DialogTrigger asChild>
            <Button disabled={isLoading}>
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
              {isLoading ? (
                <Loader />
              ) : (
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
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
