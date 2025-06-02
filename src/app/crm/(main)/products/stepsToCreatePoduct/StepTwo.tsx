import { useGetColorQuery } from "@/app/crm/redux/services/colorApi";
import Loader from "@/app/Loader";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

function StepTwo() {
  const {
    data: allColors,
    isSuccess: isSuccessColor,
    isLoading: isLoadingColor,
    isError: isColorError,
  } = useGetColorQuery();

    if (isColorError) {
    throw new Error("Failed Getting Colors");
  }

  const {
    setValue,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();

  // Watch RHF field directly and treat as single source of truth
  const watchedColors = watch("colors") || [];

  // Ensure RHF has an initial value on first mount
  useEffect(() => {
    const current = getValues("colors");
    if (!current || !Array.isArray(current)) {
      setValue("colors", []);
    }
  }, []);

  // Manually update `colors` field when checkbox toggles
  const handleToggle = (id: number, checked: boolean) => {
    const current = getValues("colors") || [];
    const updated = checked
      ? [...current, id]
      : current.filter((itemId:number) => itemId !== id);

    setValue("colors", updated);
    trigger("colors");
  };

  return (
    <TabsContent value="colors" className="py-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Available Colors</h3>
          <span className="text-sm text-muted-foreground">
            {watchedColors.length} selected
          </span>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoadingColor ? (
            <Loader />
          ) : isSuccessColor && allColors.colors.length > 0 ? (
            allColors.colors.map((item:Colors) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${item.id}`}
                  checked={watchedColors.includes(item.id)}
                  onCheckedChange={(checked) => {
                    handleToggle(item.id, checked === true);
                  }}
                />
                <div
                  className="w-6 h-6 rounded border"
                  style={{ background: item.code || "#ffffff" }}
                ></div>
                <Label htmlFor={`color-${item.id}`} className="flex-1">
                  {item.name}
                </Label>
                <span className="text-xs text-muted-foreground">
                  {item.code}
                </span>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground italic">
              Currently No Colors Provided
            </div>
          )}
        </div>
      </div>
      {errors.colors && typeof errors.colors.message === "string" && (
        <p className="text-red-500">{errors.colors?.message}</p>
      )}
    </TabsContent>
  );
}

export default StepTwo;
