import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
export { BaseFormField, SelectFormField, IconSelector };