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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { useAdminInfo } from "@/hooks/crm/share-admin-context";
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import {
  useCreateStockMutation,
  useDeleteStockMutation,
  useGetStocksQuery,
  useUpdateStockMutation,
} from "../../redux/services/stockApi";
import { useGetCategoriesQuery } from "../../redux/services/categoryApi";
import Loader from "@/app/Loader";

export default function Stocks() {
  const [getName, setGetName] = useState<string>("");
  const [getDesc, setGetDesc] = useState<string>("");
  const [openPopUp, setOpenPopUp] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);
  const [updateFollowingId, setUpdateFollowingId] = useState<
    number | undefined
  >(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [currentCategoryName, setCurrentCategoryName] = useState<string>("");
  useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined);

  const admin_info = useAdminInfo();

  // get data through rtq
  const {
    data: stockData,
    isSuccess: isSuccessStock,
    isLoading: isGettingStockData,
    isError: isStockError,
  } = useGetStocksQuery();
  
  const {
    data: categoryData,
    isSuccess: isSuccessCategory,
    isLoading: isLoadingCategory,
    isError: isCategoryError,
  } = useGetCategoriesQuery();

  const [createStock,{isLoading:isCreating}] = useCreateStockMutation();
  const [deleteStock,{isLoading:isDeleting}] = useDeleteStockMutation();
  const [updateStock,{isLoading:isUpdating}] = useUpdateStockMutation();

  const isLoading =  isGettingStockData || isCreating || isDeleting || isUpdating

  if (isCategoryError) {
    throw new Error("Failed Getting Categories");
  }

  if (isStockError) {
    throw new Error("Failed Getting Stocks");
  }

  const handleSelectCategory = (value: string) => {
    setSelectedCategoryName(value);

    const scanValue =
      isSuccessCategory &&
      categoryData.categories.find((item) => item.name === value);
    if (scanValue) {
      setSelectedCategoryId(scanValue.id);
    } else {
      throw new Error("Failed to find the id of selected category");
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    const item = {
      name: getName,
      description: getDesc,
      ownerId: admin_info?.id,
      categoryId: selectedCategoryId,
    };
    const res = await createStock(item);
    if (res.data) {
      toastingSuccess(res.data.message);
      setOpenPopUp(false);
      // changing state to default
      setSelectedCategoryName("");
      setSelectedCategoryId(undefined);
      setGetName("");
      setGetDesc("");
    } else {
      toastingError(res.error);
    }
  };

  const onDelete = async (itemId: number) => {
    const item = {
      id: itemId,
      ownerId: admin_info?.id,
    };
    const res = await deleteStock(item);
    if (res.data) {
      toastingSuccess(res.data.message);
    } else {
      toastingError(res.error);
    }
  };

  const onUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    const item = {
      id: updateFollowingId,
      ownerId: admin_info?.id,
      name: getName,
      description: getDesc,
      categoryId: selectedCategoryId,
    };
    const res = await updateStock(item);

    if (res.data) {
      toastingSuccess(res.data.message);
      setOpenPopUp(false);
      // changing state to default
      setUpdate(false);
      setUpdateFollowingId(undefined);
      setCurrentCategoryName("");
      setSelectedCategoryName("");
      setSelectedCategoryId(undefined);
      setGetName("");
      setGetDesc("");
    } else {
      toastingError(res.error);
    }
  };

  const filteredStocks = useMemo(() => {
    if (!isSuccessStock || !stockData.stocks) return [];

    const term = searchTerm.toLowerCase();

    return stockData.stocks.filter(
      (stock) =>
        stock.name.toLowerCase().includes(term) ||
        stock.description?.toLowerCase().includes(term)
    );
  }, [isSuccessStock, stockData, searchTerm]);

  return (
    <div className="h-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stocks</h1>

        <Dialog
          open={openPopUp}
          onOpenChange={(isOpen) => {
            setOpenPopUp(isOpen);
            if (!isOpen) {
              setUpdate(false);
              setUpdateFollowingId(undefined);
              setCurrentCategoryName("");
              setSelectedCategoryName("");
              setSelectedCategoryId(undefined);
              setGetName("");
              setGetDesc("");
            }
          }}
        >
          <DialogTrigger asChild>
            <Button disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Stock
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={update ? onUpdate : onSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {update ? "Edit The Stock " : "Add New Stock"}
                </DialogTitle>
                <DialogDescription>
                  {update
                    ? "Edit the details of your exits Stock. Click update when you are done. "
                    : "Fill in the details for your new Stock. Click save when you are done."}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Stock Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Enter Stock name"
                    value={getName}
                    onChange={(e) => setGetName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter Stock description"
                    required
                    value={getDesc}
                    onChange={(e) => setGetDesc(e.target.value)}
                  />
                </div>

                {isLoadingCategory ? (
                  <Loader />
                ) : isSuccessCategory &&
                  categoryData.categories.length > 0 &&
                  !update ? (
                  <div className="grid gap-2">
                    <Label htmlFor="status">Category</Label>
                    <Select
                      required
                      value={selectedCategoryName}
                      onValueChange={handleSelectCategory}
                      defaultValue=""
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryData.categories
                          .filter((x: Category) => x.name && x.id && !x.stock)
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

                        {isSuccessCategory &&
                          categoryData.categories.length > 0 && (
                            <SelectContent>
                              {categoryData.categories
                                .filter(
                                  (x: Category) => x.name && x.id && !x.stock
                                )
                                .map((item) => (
                                  <SelectItem key={item.id} value={item.name}>
                                    {item.name}
                                  </SelectItem>
                                ))}
                              {categoryData.categories
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
                  <Button type="submit">Update Stock</Button>
                ) : (
                  <Button type="submit">Add Stock</Button>
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
                placeholder="Search Stock..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <div className="bg-muted p-3 grid grid-cols-14 font-medium justify-items-center">
              <div className="col-span-3">Name</div>
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Total Items</div>
              <div className="col-span-2">Action</div>
            </div>

            <div className="divide-y max-h-[400px] overflow-y-scroll">
              {isLoading ? (
                <Loader />
              ) : (
                filteredStocks.length > 0 &&
                filteredStocks.map((stock) => (
                  <div
                    key={stock.id}
                    className="p-3 grid grid-cols-14 items-center justify-items-center"
                  >
                    <div className="col-span-3 font-medium">{stock.name}</div>
                    <div className="col-span-5 truncate">
                      {stock.description}
                    </div>
                    <div className="col-span-2">{stock.category.name}</div>
                    <div className="col-span-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          stock.category.products === undefined
                            ? "bg-red-100 text-red-800" // Empty in stock (Red)
                            : "bg-yellow-100 text-yellow-800" // Low in stock (Yellow)
                        }`}
                      >
                        {stock.category.products === undefined
                          ? "No Items"
                          : stock.category.products?.length}
                      </span>
                    </div>
                    <div className="col-span-2 gap-2">
                      <button
                        onClick={() => {
                          setUpdate(true);
                          setOpenPopUp(true);
                          setUpdateFollowingId(stock.id);
                          setCurrentCategoryName(stock.category.name);
                          setGetName(stock.name);
                          setSelectedCategoryId(stock.categoryId);
                          if (typeof stock.description === "string")
                            return setGetDesc(stock.description);
                        }}
                      >
                        Edit
                      </button>

                      <button onClick={() => onDelete(stock.id)}>Delete</button>
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
