"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataRow {
  delegation_name: string;
  produit_name: string;
  quantite_prevue: number;
  quantite_totale: number;
  pourcentage: number;
  pourcentage_global: number;
}

const PRODUCT_COLUMNS = [
  "Sac Recyclable",
  "Carte",
  "Sucre",
  "Thé",
  "Farine",
  "Huile",
  "Tomate",
  "Lentille",
  "Pate",
  "Lait",
  "Riz",
];

export default function Dashboard() {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pivotData = () => {
    const delegationMap = new Map<
      string,
      { products: Record<string, number>; pourcentage_global: number }
    >();

    data.forEach((row) => {
      if (!delegationMap.has(row.delegation_name)) {
        delegationMap.set(row.delegation_name, {
          products: {},
          pourcentage_global: row.pourcentage_global || 0,
        });
      }
      const delegation = delegationMap.get(row.delegation_name)!;
      delegation.products[row.produit_name] = row.pourcentage || 0;
    });

    // Sort delegations alphabetically
    return Array.from(delegationMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, data]) => ({
        delegation_name: name,
        ...data,
      }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-lg">Chargement des données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-lg text-destructive">Erreur: {error}</p>
      </div>
    );
  }

  const tableData = pivotData();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[140px]">Delegation</TableHead>
                {PRODUCT_COLUMNS.map((product) => (
                  <TableHead key={product} className="text-center min-w-[90px]">
                    {product}
                  </TableHead>
                ))}
                <TableHead className="text-center min-w-[140px]">
                  Percentages Totals
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.delegation_name}>
                  <TableCell className="font-medium">
                    {row.delegation_name}
                  </TableCell>
                  {PRODUCT_COLUMNS.map((product) => (
                    <TableCell key={product} className="text-center">
                      {(row.products[product] ?? 0).toFixed(2)}%
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-medium">
                    {row.pourcentage_global.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
