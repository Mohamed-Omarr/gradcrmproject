"use client";

import {
  Palette,
  Ruler,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useAdminInfo } from "@/hooks/crm/share-admin-context";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess";
import {
  useCreateSizeMutation,
  useDeleteSizeMutation,
  useGetSizeQuery,
  useUpdateSizeMutation,
} from "@/app/crm/redux/services/sizeApi";
import {
  useCreateColorMutation,
  useDeleteColorMutation,
  useGetColorQuery,
  useUpdateColorMutation,
} from "@/app/crm/redux/services/colorApi";
import Loader from "@/app/Loader";

export default function AttributesPage() {
  const {
    data: allSizes,
    isSuccess: isSuccessSize,
    isLoading: isLoadingSize,
    isError: isSizeError,
  } = useGetSizeQuery();

  const {
    data: allColors,
    isSuccess: isSuccessColor,
    isLoading: isLoadingColor,
    isError: isColorError,
  } = useGetColorQuery();

  if (isSizeError) {
    throw new Error("Failed Getting Sizes");
  }

  if (isColorError) {
    throw new Error("Failed Getting Colors");
  }

  const [createSizes, { isLoading: isLoadingCreatingSize }] =
    useCreateSizeMutation();
  const [deleteSizes] = useDeleteSizeMutation();
  const [updateSizes, { isLoading: isLoadingUpdateSize }] =
    useUpdateSizeMutation();

  const [createColors, { isLoading: isLoadingCreatingColor }] =
    useCreateColorMutation();
  const [deleteColors] = useDeleteColorMutation();
  const [updateColors, { isLoading: isLoadingUpdateColor }] =
    useUpdateColorMutation();

  const admin_info = useAdminInfo();
  const [activeTab, setActiveTab] = useState<string>("Colors");
  // color section
  const [isEditingColor, setIsEditingColor] = useState<boolean>(false);
  const [colorName, setColorName] = useState<string>("");
  const [colorCode, setColorCode] = useState<string>("");
  const [colorId, setColorId] = useState<number | undefined>(undefined);

  // size section
  const [isEditingSize, setIsEditingSize] = useState<boolean>(false);
  const [sizeName, setSizeName] = useState<string>("");
  const [sizeCode, setSizeCode] = useState<string>("");
  const [sizeId, setSizeId] = useState<number | undefined>(undefined);

  if (!admin_info) {
    return toastingError("Admin Info Not Exit");
  }

  // color section
  const createColor = async () => {
    const item = {
      name: colorName,
      code: colorCode,
      ownerId: admin_info.id,
    };
    const res = await createColors(item);

    if (res.data) {
      colorReset();
      toastingSuccess(res.data.message);
    } else {
      toastingError(res.error);
    }
  };

  const updateColor = async () => {
    const item = {
      id: colorId,
      name: colorName,
      code: colorCode,
      ownerId: admin_info.id,
    };
    const res = await updateColors(item);
    if (res.data) {
      colorReset();
      toastingSuccess(res.data.message);
    } else {
      toastingError(res.error);
    }
  };

  const deleteColor = async (itemId: number) => {
    const item = {
      id: itemId,
      ownerId: admin_info.id,
    };
    const res = await deleteColors(item);
    if (res.data) {
      toastingSuccess(res.data.message);
    } else {
      toastingError(res.error);
    }
  };

  const colorReset = () => {
    setColorName("");
    setColorCode("");
    setColorId(undefined);
    setIsEditingColor(false);
    return null;
  };

  const activeToUpdateColor = (data: Colors) => {
    setIsEditingColor(true);
    setColorName(data.name);
    setColorCode(data.code);
    setColorId(data.id);
    return null;
  };

  // size section
  const createSize = async () => {
    const item = {
      name: sizeName,
      code: sizeCode,
      ownerId: admin_info.id,
    };
    const res = await createSizes(item);
    if (res.data) {
      sizeReset();
      toastingSuccess(res.data.message);
    } else {
      toastingError(res.error);
    }
  };

  const updateSize = async () => {
    const item = {
      id: sizeId,
      name: sizeName,
      code: sizeCode,
      ownerId: admin_info.id,
    };
    const res = await updateSizes(item);
    if (res.data) {
      sizeReset();
      toastingSuccess(res.data.message);
    } else {
      toastingError(res.error);
    }
  };

  const deleteSize = async (itemId: number) => {
    const item = {
      id: itemId,
      ownerId: admin_info.id,
    };
    const res = await deleteSizes(item);
    if (res.data) {
      toastingSuccess(res.data.message);
    } else {
      toastingError(res.error);
    }
  };

  const sizeReset = () => {
    setSizeName("");
    setSizeCode("");
    setSizeId(undefined);
    setIsEditingSize(false);
    return null;
  };

  const activeToUpdateSize = (data: Sizes) => {
    setIsEditingSize(true);
    setSizeName(data.name);
    setSizeCode(data.code);
    setSizeId(data.id);
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Product Attributes</h1>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("Colors")}
            className={cn(
              "px-4 py-2 text-sm font-medium  text-foreground",
              activeTab === "Colors" && "border-b-2 border-primary"
            )}
          >
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Colors
            </div>
          </button>
          <button
            onClick={() => setActiveTab("Sizes")}
            className={cn(
              "px-4 py-2 text-sm font-medium  text-foreground",
              activeTab === "Sizes" && "border-b-2 border-primary"
            )}
          >
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Sizes
            </div>
          </button>
        </div>
      </div>

      {activeTab === "Colors" ? (
        // colors section
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Color</CardTitle>
              <CardDescription>
                Add a new color option for your products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="color-name">Color Name</Label>
                  <Input
                    id="color-name"
                    placeholder="e.g. Navy Blue"
                    value={colorName}
                    onChange={(e) => setColorName(e.target.value)}
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label htmlFor="color-hex">Color Code (HEX)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color-hex"
                      placeholder="#000000"
                      value={colorCode}
                      onChange={(e) => setColorCode(e.target.value)}
                    />
                    <div
                      className="w-10 h-10 rounded border"
                      style={{ background: colorCode || "#ffff" }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  {!isEditingColor ? (
                    <Button
                      disabled={isLoadingCreatingColor}
                      onClick={() => createColor()}
                    >
                      {isLoadingCreatingColor ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      Add Color
                    </Button>
                  ) : (
                    <div>
                      <Button
                        disabled={isLoadingUpdateColor}
                        onClick={() => updateColor()}
                      >
                        {isLoadingUpdateColor ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        Update Color
                      </Button>

                      <Button onClick={() => colorReset()}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
              <CardDescription>
                Manage your product color options
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingColor ? (
                <Loader />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Color</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>HEX Code</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isSuccessColor &&
                      allColors.colors.map((color, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <div
                              className="w-8 h-8 rounded border"
                              style={{ background: color.code || "#ffff" }}
                            ></div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {color.name}
                          </TableCell>
                          <TableCell>{color.code}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                onClick={() => activeToUpdateColor(color)}
                                variant="ghost"
                                size="icon"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => deleteColor(color.id)}
                                variant="ghost"
                                size="icon"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        // sizes section
        <div className="space-y-6 mt-10">
          <Card>
            <CardHeader>
              <CardTitle>Add New Size</CardTitle>
              <CardDescription>
                Add a new size option for your products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="size-name">Size Name</Label>
                  <Input
                    id="size-name"
                    placeholder="e.g. Extra Large"
                    value={sizeName}
                    onChange={(e) => setSizeName(e.target.value)}
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label htmlFor="size-code">Size Code</Label>
                  <Input
                    id="size-code"
                    placeholder="e.g. XL"
                    value={sizeCode}
                    onChange={(e) => setSizeCode(e.target.value)}
                  />
                </div>
                <div className="flex items-end gap-2">
                  {!isEditingSize ? (
                    <Button
                      disabled={isLoadingCreatingSize}
                      onClick={() => createSize()}
                    >
                      {isLoadingCreatingSize ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      Add Size
                    </Button>
                  ) : (
                    <div>
                      <Button
                        disabled={isLoadingUpdateSize}
                        onClick={() => updateSize()}
                      >
                        {isLoadingUpdateSize ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        Update Size
                      </Button>

                      <Button onClick={() => sizeReset()}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sizes</CardTitle>
              <CardDescription>
                Manage your product size options
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSize ? (
                <Loader />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isSuccessSize &&
                      allSizes.sizes.map((size, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{size.code}</TableCell>
                          <TableCell className="font-medium">
                            {size.name}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                onClick={() => activeToUpdateSize(size)}
                                variant="ghost"
                                size="icon"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => deleteSize(size.id)}
                                variant="ghost"
                                size="icon"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
