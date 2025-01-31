"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import clsx from "clsx";

interface DelegationData {
    delegation_name: string;
    pourcentage_global: number;
    [key: string]: string | number; // For dynamic product columns
}

const productNames = [
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
    const [data, setData] = useState<DelegationData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api");
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fonction pour appliquer les classes de couleur en fonction de la valeur du pourcentage
    const getPercentageClass = (percentage: number) => {
        if (percentage === 0) {
            return "text-red-600"; // Rouge
        } else if (percentage === 100) {
            return "text-green-600"; // Vert
        } else {
            return "text-blue-500"; // bleu
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Delegation</TableHead>
                                    {productNames.map((product) => (
                                        <TableHead key={product}>{product}</TableHead>
                                    ))}
                                    <TableHead>Pourcentages Totals</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.delegation_name}</TableCell>
                                        {productNames.map((product) => (
                                            <TableCell key={product}>
                                                {typeof item[product] === "number"
                                                    ? `${item[product].toFixed(2)}%`
                                                    : "N/A"}
                                            </TableCell>
                                        ))}
                                        <TableCell className={clsx(getPercentageClass(item.pourcentage_global))}>
                                            {item.pourcentage_global.toFixed(2)}%
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
