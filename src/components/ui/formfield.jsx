import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
// Componentes de Formulário
const BaseFormField = ({ control, name, label, type = "text", placeholder, ...props }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input type={type} placeholder={placeholder} {...field} {...props} />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

const SelectFormField = ({ control, name, label, options, placeholder, disabled }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={disabled}
                >
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}
    />
);

const IconSelector = ({ control, name, label, options, form }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <div className="space-y-4">
                        <div className="flex gap-2 flex-wrap">
                            {options.map(opt => {
                                const Icon = opt.icon;
                                return (
                                    <button
                                        type="button"
                                        key={opt.value}
                                        onClick={() => field.onChange(opt.value)}
                                        className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-center ${field.value === opt.value ? 'bg-[#133D86] text-white border-[#133D86] scale-110 shadow-lg' : 'bg-white text-[#133D86] border-gray-200 hover:bg-[#e6eefc]'} `}
                                        title={opt.label}
                                        style={{
                                            backgroundColor: field.value === opt.value ? form.watch("color") : 'white',
                                            color: field.value === opt.value ? 'white' : form.watch("color"),
                                            borderColor: field.value === opt.value ? form.watch("color") : '#e5e7eb'
                                        }}
                                    >
                                        <Icon className="h-6 w-6" />
                                    </button>
                                );
                            })}
                        </div>
                        <FormField
                            control={control}
                            name="color"
                            render={({ field: colorField }) => (
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium">
                                        Cor do Ícone:
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="color"
                                            {...colorField}
                                            className="w-12 h-8 p-0 rounded border cursor-pointer"
                                            style={{
                                                backgroundColor: 'transparent',
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {colorField.value}
                                    </span>
                                </div>
                            )}
                        />
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

const MultiSelectFormField = ({ control, name, label, options, placeholder, disabled, maxSelections = 5 }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <div className="space-y-2">
                    <Select
                        onValueChange={(value) => {
                            const currentValues = field.value || [];
                            if (currentValues.length < maxSelections) {
                                if (!currentValues.includes(value)) {
                                    field.onChange([...currentValues, value]);
                                }
                            }
                        }}
                        disabled={disabled || (field.value?.length || 0) >= maxSelections}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem 
                                    key={option.value} 
                                    value={option.value}
                                    disabled={field.value?.includes(option.value)}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2">
                        {field.value?.map((value) => {
                            const option = options.find(opt => opt.value === value);
                            return (
                                <Badge 
                                    key={value} 
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    {option?.label}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            field.onChange(field.value.filter(v => v !== value));
                                        }}
                                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            );
                        })}
                    </div>
                    {(field.value?.length || 0) >= maxSelections && (
                        <p className="text-sm text-muted-foreground">
                            Máximo de {maxSelections} disciplinas atingido
                        </p>
                    )}
                </div>
                <FormMessage />
            </FormItem>
        )}
    />
);

export { BaseFormField, SelectFormField, IconSelector, MultiSelectFormField };