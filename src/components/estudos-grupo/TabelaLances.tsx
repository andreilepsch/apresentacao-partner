import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { TIPOS_LANCE } from '@/types/gruposConsorcio';

interface TabelaLancesProps {
  data: {
    [key: string]: {
      ofertados: number;
      contemplacoes: number;
      percentual: number;
    };
  };
  onChange?: (field: string, value: number) => void;
  readOnly?: boolean;
}

export function TabelaLances({ data, onChange, readOnly = false }: TabelaLancesProps) {
  const getLanceKey = (tipo: string): string => {
    const map: { [key: string]: string } = {
      'Sorteio': 'sorteio',
      'Lance Fixo I': 'lance_fixo_i',
      'Lance Fixo II': 'lance_fixo_ii',
      'Lance Livre': 'lance_livre',
      'Lance Limitado': 'lance_limitado'
    };
    return map[tipo] || '';
  };

  const calculateTotal = () => {
    const keys = TIPOS_LANCE.map(getLanceKey);
    return {
      ofertados: keys.reduce((sum, key) => sum + (data[key]?.ofertados || 0), 0),
      contemplacoes: keys.reduce((sum, key) => sum + (data[key]?.contemplacoes || 0), 0),
      percentual: keys.length > 0 
        ? keys.reduce((sum, key) => sum + (data[key]?.percentual || 0), 0) / keys.length 
        : 0
    };
  };

  const total = calculateTotal();

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-rc-primary hover:bg-rc-primary">
            <TableHead className="text-white font-semibold">Tipo de Lance</TableHead>
            <TableHead className="text-white font-semibold text-center">Quant. Lances Ofertados</TableHead>
            <TableHead className="text-white font-semibold text-center">Quant. Contemplações</TableHead>
            <TableHead className="text-white font-semibold text-center">Percentual de Lance Vencedor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {TIPOS_LANCE.map((tipo) => {
            const key = getLanceKey(tipo);
            const lanceData = data[key] || { ofertados: 0, contemplacoes: 0, percentual: 0 };

            return (
              <TableRow key={tipo}>
                <TableCell className="font-medium">{tipo}</TableCell>
                <TableCell className="text-center">
                  {readOnly ? (
                    <span>{lanceData.ofertados}</span>
                  ) : (
                    <Input
                      type="number"
                      min="0"
                      value={lanceData.ofertados}
                      onChange={(e) => onChange?.(`${key}_ofertados`, parseInt(e.target.value) || 0)}
                      className="text-center max-w-[120px] mx-auto"
                    />
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {readOnly ? (
                    <span>{lanceData.contemplacoes}</span>
                  ) : (
                    <Input
                      type="number"
                      min="0"
                      value={lanceData.contemplacoes}
                      onChange={(e) => onChange?.(`${key}_contemplacoes`, parseInt(e.target.value) || 0)}
                      className="text-center max-w-[120px] mx-auto"
                    />
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {readOnly ? (
                    <span>{lanceData.percentual.toFixed(2)}%</span>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={lanceData.percentual}
                        onChange={(e) => onChange?.(`${key}_percentual`, parseFloat(e.target.value) || 0)}
                        className="text-center max-w-[120px]"
                      />
                      <span>%</span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow className="bg-muted/50 font-semibold">
            <TableCell>TOTAL</TableCell>
            <TableCell className="text-center">{total.ofertados}</TableCell>
            <TableCell className="text-center">{total.contemplacoes}</TableCell>
            <TableCell className="text-center">{total.percentual.toFixed(2)}%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
