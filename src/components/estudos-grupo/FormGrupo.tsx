import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ADMINISTRADORAS } from '@/types/gruposConsorcio';
import { MonthYearCalendar } from '@/components/ui/month-year-calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  administradora: z.string().min(1, 'Selecione uma administradora'),
  numero_grupo: z.string().min(1, 'Número do grupo é obrigatório'),
  prazo_meses: z.coerce.number().min(1, 'Prazo deve ser maior que 0'),
  capacidade_cotas: z.coerce.number().min(1, 'Capacidade deve ser maior que 0'),
  participantes_atual: z.coerce.number().min(0, 'Participantes deve ser maior ou igual a 0'),
  data_inicio: z.date({ message: 'Data de início é obrigatória' }),
  data_fim: z.date({ message: 'Data de fim é obrigatória' })
}).refine((data) => data.data_fim > data.data_inicio, {
  message: 'Data de fim deve ser posterior à data de início',
  path: ['data_fim']
});

type FormValues = z.infer<typeof formSchema>;

interface FormGrupoProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditMode?: boolean;
}

export function FormGrupo({ 
  defaultValues, 
  onSubmit, 
  onCancel, 
  isLoading,
  isEditMode = false
}: FormGrupoProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      administradora: '',
      numero_grupo: '',
      prazo_meses: 0,
      capacidade_cotas: 0,
      participantes_atual: 0
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="administradora"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Administradora</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isEditMode}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ADMINISTRADORAS.map((adm) => (
                      <SelectItem key={adm} value={adm}>
                        {adm}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isEditMode && (
                  <p className="text-xs text-muted-foreground">
                    Este campo não pode ser alterado após criação
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numero_grupo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do Grupo</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: 6660" 
                    {...field}
                    disabled={isEditMode}
                  />
                </FormControl>
                {isEditMode && (
                  <p className="text-xs text-muted-foreground">
                    Este campo não pode ser alterado após criação
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prazo_meses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo (meses)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="Ex: 120" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacidade_cotas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacidade de Cotas (Total)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="Ex: 4000" {...field} />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Capacidade total do grupo (não muda)
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="participantes_atual"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Participantes Atuais</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="Ex: 255" {...field} />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Quantidade de pessoas no grupo atualmente
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_inicio"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Início</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <MonthYearCalendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_fim"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Fim</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <MonthYearCalendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Grupo'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
