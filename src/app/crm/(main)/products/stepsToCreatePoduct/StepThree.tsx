import { useGetSizeQuery } from "@/app/crm/redux/services/sizeApi";
import Loader from "@/app/Loader";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

function StepThree() {
  const {
    data: allSizes,
    isSuccess: isSuccessSize,
    isLoading: isLoadingSize,
    isError: isSizeError,
  } = useGetSizeQuery();

  if (isSizeError) {
    throw new Error("Failed Getting Sizes");
  }
  
  const {
    setValue,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();

  // Watch RHF field directly and treat as single source of truth
  const watchedSizes = watch("sizes") || [];

  // Ensure RHF has an initial value on first mount
  useEffect(() => {
    const current = getValues("sizes");
    if (!current || !Array.isArray(current)) {
      setValue("sizes", []);
    }
  }, []);

  // Manually update `sizes` field when checkbox toggles
  const handleToggle = (id: number, checked: boolean) => {
    const current = getValues("sizes") || [];
    const updated = checked
      ? [...current, id]
      : current.filter((itemId: number) => itemId !== id);

    setValue("sizes", updated);
    trigger("sizes");
  };

  return (
    <TabsContent value="sizes" className="py-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Available Sizes</h3>
          <span className="text-sm text-muted-foreground">
            {watchedSizes.length} selected
          </span>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoadingSize ? (
            <Loader />
          ) : isSuccessSize && allSizes.sizes.length > 0 ? (
            allSizes.sizes.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${item.id}`}
                  checked={watchedSizes.includes(item.id)}
                  onCheckedChange={(checked) =>
                    handleToggle(item.id, checked === true)
                  }
                />
                <div className="w-8 h-8 rounded border flex items-center justify-center font-medium">
                  {item.code}
                </div>
                <Label htmlFor={`size-${item.id}`} className="flex-1">
                  {item.name}
                </Label>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground italic">
              Currently No Sizes Provided
            </div>
          )}
        </div>
      </div>
      {errors.sizes && typeof errors.sizes.message === "string" && (
        <p className="text-red-500">{errors.sizes.message}</p>
      )}
    </TabsContent>
  );
}

export default StepThree;
