"use client";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

const CheckboxGroup = ({
  label,
  value,
  name,
  options,
  selectedValues,
  setSelectedValues,
  setValue,
  trigger,
  error,
}) => {
  useEffect(() => {
    setValue(name, selectedValues);
    trigger(name); // Trigger validation on change
  }, [selectedValues]);

  const handleToggle = (id) => {
    setSelectedValues((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <TabsContent value={value} className="py-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{label}</h3>
          <span className="text-sm text-muted-foreground">
          {selectedValues.length} selected
          </span>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt: any) => (
            <div key={opt.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${value}-${opt.id}`}
                checked={selectedValues.includes(opt.id)}
                onChange={() => handleToggle(opt.id)}
              />
              <div className="w-8 h-8 rounded border flex items-center justify-center font-medium">
                {opt.code}
              </div>
              <Label htmlFor={`${value}-${opt.id}`} className="flex-1">
                {opt.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <p className="text-red-500">{error}</p>
    </TabsContent>
  );
};

export default CheckboxGroup;
