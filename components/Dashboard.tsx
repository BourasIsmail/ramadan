"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import clsx from "clsx"

interface DelegationData {
    delegation_name: string
    pourcentage_global: number
    [key: string]: string | number // For dynamic product columns
}

interface ProductDistribution {
    "Délégation": string
    "Quantité attribuée": number
    "Quantité distribuée": number
    "Taux (%)": number
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
]

export default function Dashboard() {
    const [data, setData] = useState<DelegationData[]>([])
    const [distributionData, setDistributionData] = useState<ProductDistribution[]>([])
    const [loading, setLoading] = useState(true)
    const [averagePercentage, setAveragePercentage] = useState(0)
    const [totalDistributionPercentage, setTotalDistributionPercentage] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api")
                if (!response.ok) {
                    throw new Error("Failed to fetch data")
                }
                const result = await response.json()

                // Handle the new API response structure
                setData(result.productStats || result)
                setDistributionData(result.productDistribution || [])

                // Calculate average percentage
                const statsData = result.productStats || result
                const totalPercentage = statsData.reduce(
                    (sum: number, item: DelegationData) => sum + item.pourcentage_global,
                    0
                )
                setAveragePercentage(totalPercentage / statsData.length)

                // Calculate total distribution percentage
                const distributionStats = result.productDistribution || []
                const totalDistributionRate = distributionStats.reduce(
                    (sum: number, item: ProductDistribution) => sum + item["Taux (%)"],
                    0
                )
                setTotalDistributionPercentage(totalDistributionRate / 82)
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Function to apply color classes based on percentage value
    const getPercentageClass = (percentage: number) => {
        if (percentage === 0) {
            return "text-red-600" // Red
        } else if (percentage >= 100 && percentage < 101) {
            return "text-green-600" // Green
        } else if (percentage >= 101) {
            return "text-orange-500" // Orange
        } else {
            return "text-blue-500" // Blue
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-4">
            {/* New Table for Product Distribution */}
            {distributionData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Distribution du Produit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="bg-gray-200 font-bold">Délégation</TableHead>
                                        <TableHead className="bg-gray-200 font-bold">Quantité attribuée</TableHead>
                                        <TableHead className="bg-gray-200 font-bold">Quantité distribuée</TableHead>
                                        <TableHead className="bg-gray-200 font-bold">Taux (%)</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {distributionData.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-bold text-purple-900">{item["Délégation"]}</TableCell>
                                            <TableCell>{item["Quantité attribuée"]}</TableCell>
                                            <TableCell>{item["Quantité distribuée"]}</TableCell>
                                            <TableCell className={clsx(getPercentageClass(item["Taux (%)"]))}>
                                                {item["Taux (%)"].toFixed(2)}%
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-4">
                            <div className={clsx("text-xl font-bold", getPercentageClass(totalDistributionPercentage))}>
                                Pourcentage total des distributions: {totalDistributionPercentage.toFixed(2)}%
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
            <Card>
                <CardHeader>
                    <CardTitle>Détails :</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="bg-gray-200 font-bold">Delegation</TableHead>
                                    <TableHead className="bg-gray-200 font-bold">pourcentages totaux</TableHead>
                                    {productNames.map((product) => (
                                        <TableHead key={product} className="bg-gray-200 font-bold">
                                            {product}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {data.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-bold text-purple-900">{item.delegation_name}</TableCell>
                                        <TableCell className={clsx(getPercentageClass(item.pourcentage_global))}>
                                            {item.pourcentage_global.toFixed(2)}%
                                        </TableCell>
                                        {productNames.map((product) => (
                                            <TableCell
                                                key={product}
                                                className={clsx(getPercentageClass(Number(item[product])), "text-center")}
                                            >
                                                {typeof item[product] === "number" ? `${item[product].toFixed(2)}%` : "N/A"}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>Résumé Global</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={clsx("text-2xl font-bold", getPercentageClass(averagePercentage))}>
                        Pourcentage total des récéptions de toutes les délégations: {averagePercentage.toFixed(2)}%
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}