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
import { ArrowDown, ArrowUp } from "lucide-react";
// import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface DelegationData {
  direction_provinciale_name: string;
  pourcentage_global: number;
  [key: string]: string | number; // For dynamic product columns
}

interface ProductDistribution {
  "Direction Provinciale": string;
  "Quantité attribuée": number;
  "Quantité distribuée": number;
  "Taux (%)": number;
}

type SortDirection = "asc" | "desc" | null;

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
  const [distributionData, setDistributionData] = useState<
    ProductDistribution[]
  >([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [averagePercentage, setAveragePercentage] = useState(0);
  const [totalDistributionPercentage, setTotalDistributionPercentage] =
    useState(0);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();

        // Handle the new API response structure
        setData(result.productStats || result);

        // Sort the distribution data initially
        const distributionStats = result.productDistribution || [];
        const sortedDistributionData = [...distributionStats].sort((a, b) => {
          return b["Taux (%)"] - a["Taux (%)"]; // Initial descending sort
        });
        setDistributionData(sortedDistributionData);

        // Calculate average percentage
        const statsData = result.productStats || result;
        const totalPercentage = statsData.reduce(
          (sum: number, item: DelegationData) => sum + item.pourcentage_global,
          0
        );
        setAveragePercentage(totalPercentage / statsData.length);

        // Calculate total distribution percentage
        const totalDistributionRate = distributionStats.reduce(
          (sum: number, item: ProductDistribution) => sum + item["Taux (%)"],
          0
        );
        setTotalDistributionPercentage(
          totalDistributionRate / distributionStats.length
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to apply color classes based on percentage value
  const getPercentageClass = (percentage: number) => {
    if (percentage === 0) {
      return "text-red-500 font-bold"; // Red
    } else if (percentage >= 100 && percentage < 101) {
      return "text-emerald-600 font-bold"; // Green
    } else if (percentage >= 101) {
      return "text-amber-600 font-bold"; // Orange
    } else {
      return "text-blue-600 font-semibold"; // Blue
    }
  };

  // Function to apply background color classes based on percentage value
  /*const getPercentageBgClass = (percentage: number) => {
    if (percentage === 0) {
      return "bg-red-50 dark:bg-red-950/20";
    } else if (percentage >= 100 && percentage < 101) {
      return "bg-emerald-50 dark:bg-emerald-950/20";
    } else if (percentage >= 101) {
      return "bg-amber-50 dark:bg-amber-950/20";
    } else {
      return "bg-blue-50 dark:bg-blue-950/20";
    }
  };*/

  // Function to sort distribution data by rate
  const sortDistributionData = () => {
    const newSortDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newSortDirection);

    const sortedData = [...distributionData].sort((a, b) => {
      if (newSortDirection === "asc") {
        return a["Taux (%)"] - b["Taux (%)"];
      } else {
        return b["Taux (%)"] - a["Taux (%)"];
      }
    });

    setDistributionData(sortedData);
  };

  /*const chartData = distributionData.slice(0, 10).map((item) => ({
    name: item["Direction Provinciale"],
    taux: item["Taux (%)"],
  }));*/

  /*const productChartData = productNames.map((product) => {
    const total = data.reduce(
      (sum, item) => sum + (Number(item[product]) || 0),
      0
    );
    const average = data.length > 0 ? total / data.length : 0;
    return {
      product,
      average: Number(average.toFixed(2)),
    };
  });*/

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
          </div>
          <p className="text-muted-foreground font-medium text-lg">
            Chargement des données...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/*
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">
              Moyenne Globale
            </div>
            <div
              className={
                getPercentageClass(averagePercentage) + " text-3xl font-bold"
              }
            >
              {averagePercentage.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">
              Distribution Totale
            </div>
            <div
              className={
                getPercentageClass(totalDistributionPercentage) +
                " text-3xl font-bold"
              }
            >
              {totalDistributionPercentage.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">
              Directions Provinciales
            </div>
            <div className="text-3xl font-bold">{data.length}</div>
          </CardContent>
        </Card>
      </div>*/}

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Directions - Taux de Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                taux: {
                  label: "Taux (%)",
                  color: "hsl(217, 91%, 60%)",
                },
              }}
              className="h-[350px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    style={{ fontSize: "12px", fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis style={{ fontSize: "12px", fill: "hsl(var(--muted-foreground))" }} />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
                  <Bar dataKey="taux" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} activeBar={false} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moyenne par Produit</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                average: {
                  label: "Moyenne (%)",
                  color: "hsl(217, 91%, 60%)",
                },
              }}
              className="h-[350px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productChartData} margin={{ top: 10, right: 20, left: 10, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="product"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    style={{ fontSize: "12px", fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis style={{ fontSize: "12px", fill: "hsl(var(--muted-foreground))" }} />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
                  <Bar dataKey="average" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} activeBar={false} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div> */}

      <Card>
        <CardHeader>
          <CardTitle>Détails des réceptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold sticky left-0 bg-background">
                    Direction Provinciale
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Pourcentages Totaux
                  </TableHead>
                  {productNames.map((product) => (
                    <TableHead
                      key={product}
                      className="font-semibold text-center min-w-[110px]"
                    >
                      {product}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium sticky left-0 bg-background">
                      {item.direction_provinciale_name}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={
                          getPercentageClass(item.pourcentage_global) +
                          " font-bold"
                        }
                      >
                        {item.pourcentage_global.toFixed(2)}%
                      </span>
                    </TableCell>
                    {productNames.map((product) => (
                      <TableCell key={product} className="text-center">
                        <span
                          className={
                            getPercentageClass(Number(item[product])) +
                            " font-semibold"
                          }
                        >
                          {typeof item[product] === "number"
                            ? `${item[product].toFixed(2)}%`
                            : "N/A"}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {distributionData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pourcentage de Reception Global par Province</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">
                    Direction Provinciale
                  </TableHead>
                  <TableHead
                    className="font-semibold cursor-pointer"
                    onClick={sortDistributionData}
                  >
                    <div className="flex items-center gap-2">
                      Taux (%)
                      {sortDirection === "asc" && (
                        <ArrowUp className="h-4 w-4" />
                      )}
                      {sortDirection === "desc" && (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {distributionData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {item["Direction Provinciale"]}
                    </TableCell>
                    <TableCell>
                      <span className={getPercentageClass(item["Taux (%)"])}>
                        {item["Taux (%)"].toFixed(2)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 p-4 bg-muted rounded-lg flex justify-between items-center">
              <span className="font-medium">
                Pourcentage total des distributions
              </span>
              <span
                className={
                  getPercentageClass(totalDistributionPercentage) +
                  " text-2xl font-bold"
                }
              >
                {totalDistributionPercentage.toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>
      )}
      {/*
      <Card>
        <CardHeader>
          <CardTitle>Résumé Global</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-muted rounded-lg text-center">
            <div className="text-sm text-muted-foreground mb-2">
              Pourcentage total des réceptions de toutes les directions
              provinciales
            </div>
            <div
              className={
                getPercentageClass(averagePercentage) + " text-4xl font-bold"
              }
            >
              {averagePercentage.toFixed(2)}%
            </div>
          </div>
        </CardContent>
      </Card>
      */}
    </div>
  );
}
