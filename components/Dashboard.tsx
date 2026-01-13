"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        <p className="text-lg text-red-600">Erreur: {error}</p>
      </div>
    );
  }

  // Group data by delegation
  const groupedData = data.reduce((acc, row) => {
    if (!acc[row.delegation_name]) {
      acc[row.delegation_name] = {
        pourcentage_global: row.pourcentage_global,
        produits: [],
      };
    }
    acc[row.delegation_name].produits.push(row);
    return acc;
  }, {} as Record<string, { pourcentage_global: number; produits: DataRow[] }>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedData).map(([delegationName, delegationData]) => (
        <Card key={delegationName}>
          <CardHeader>
            <CardTitle>{delegationName}</CardTitle>
            <CardDescription>
              Pourcentage global:{" "}
              {delegationData.pourcentage_global?.toFixed(2) || 0}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead className="text-right">Quantité prévue</TableHead>
                  <TableHead className="text-right">Quantité reçue</TableHead>
                  <TableHead className="text-right">Pourcentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {delegationData.produits.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">
                      {row.produit_name}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.quantite_prevue}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.quantite_totale}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          row.pourcentage >= 100
                            ? "text-green-600 font-semibold"
                            : ""
                        }
                      >
                        {row.pourcentage?.toFixed(2) || 0}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
