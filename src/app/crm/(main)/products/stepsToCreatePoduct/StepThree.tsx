import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { useSizes } from "@/hooks/crm/share-sizes-context";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

function StepThree() {
  const allSizes = useSizes(); // array of { id, name, code }
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
      : current.filter((itemId) => itemId !== id);

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
          {allSizes && allSizes.length > 0 ? (
            allSizes.map((item) => (
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
      {errors.sizes && typeof errors.sizes.message === "string" && <p className="text-red-500">{errors.sizes.message}</p>}
    </TabsContent>
  );
}

export default StepThree;
