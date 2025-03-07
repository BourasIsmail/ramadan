import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function GET() {
    try {
        const connection = await mysql.createConnection({
            host: "172.16.20.111",
            user: "usr_opramadan",
            password: "EN*8sQ47sWJ*SIC57",
            database: "entraide_opramadan_db",
        })

        // Execute the first query (existing)
        const [productStats] = await connection.execute(`
            SELECT d.libelle                                                                                      AS delegation_name,
                   ROUND((SUM(CASE WHEN p.libelle = 'Sac Recyclable' THEN IFNULL(rd.quantite_totale, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Sac Recyclable' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Sac Recyclable\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Carte' THEN IFNULL(rd.quantite_totale, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Carte' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Carte\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Sucre' THEN IFNULL(rd.quantite_totale, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Sucre' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Sucre\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Thé' THEN IFNULL(rd.quantite_totale, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Thé' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Thé\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Farine' THEN IFNULL(rd.quantite_totale, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Farine' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Farine\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Huile' THEN IFNULL(rd.quantite_totale, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Huile' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Huile\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Tomate' THEN IFNULL(rd.quantite_totale, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Tomate' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Tomate\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Lentille' THEN IFNULL(rd.quantite_totale, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Lentille' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Lentille\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Pate' THEN IFNULL(rd.quantite_totale, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Pate' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Pate\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Lait' THEN IFNULL(rd.quantite_totale, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Lait' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Lait\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Riz' THEN IFNULL(rd.quantite_totale, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Riz' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Riz\`,
                   ROUND(
                           (
                               ROUND((SUM(CASE
                                              WHEN p.libelle = 'Sac Recyclable'
                                                  THEN IFNULL(rd.quantite_totale, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Sac Recyclable' THEN dp.quantite_prevue END),
                                             0)) * 100, 2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Carte' THEN IFNULL(rd.quantite_totale, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Carte' THEN dp.quantite_prevue END), 0)) * 100,
                                     2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Sucre' THEN IFNULL(rd.quantite_totale, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Sucre' THEN dp.quantite_prevue END), 0)) * 100,
                                     2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Thé' THEN IFNULL(rd.quantite_totale, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Thé' THEN dp.quantite_prevue END), 0)) * 100,
                                     2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Farine' THEN IFNULL(rd.quantite_totale, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Farine' THEN dp.quantite_prevue END), 0)) * 100,
                                     2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Huile' THEN IFNULL(rd.quantite_totale, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Huile' THEN dp.quantite_prevue END), 0)) * 100,
                                     2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Tomate' THEN IFNULL(rd.quantite_totale, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Tomate' THEN dp.quantite_prevue END), 0)) * 100,
                                     2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Lentille' THEN IFNULL(rd.quantite_totale, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Lentille' THEN dp.quantite_prevue END), 0)) *
                                     100, 2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Pate' THEN IFNULL(rd.quantite_totale, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Pate' THEN dp.quantite_prevue END), 0)) * 100,
                                     2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Lait' THEN IFNULL(rd.quantite_totale, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Lait' THEN dp.quantite_prevue END), 0)) * 100,
                                     2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Riz' THEN IFNULL(rd.quantite_totale, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Riz' THEN dp.quantite_prevue END), 0)) * 100, 2)
                               ) / 11, 2
                   )                                                                                              AS pourcentage_global
            FROM delegations d
                     JOIN delegation_produits dp ON dp.delegation_id = d.id
                     JOIN produits p ON p.id = dp.produit_id
                     LEFT JOIN (SELECT r.delegation_id,
                                       rd.produit_id,
                                       SUM(rd.quantite) as quantite_totale
                                FROM reception_details rd
                                         JOIN receptions r ON r.id = rd.reception_id
                                WHERE r.deleted_at IS NULL
                                GROUP BY r.delegation_id, rd.produit_id) rd
                               ON rd.delegation_id = d.id AND rd.produit_id = dp.produit_id
            GROUP BY d.id, d.libelle
            ORDER BY d.libelle ASC;
        `)

        // Execute the second query (new)
        const [productDistribution] = await connection.execute(`
            SELECT 
                d.libelle as 'Délégation', 
                COALESCE(dp.quantite_prevue, 0) as "Quantité attribuée", 
                COALESCE(SUM(di.quantite), 0) as "Quantité distribuée",
                ROUND(
                    (COALESCE(SUM(di.quantite), 0) / NULLIF(COALESCE(dp.quantite_prevue, 0), 0)) * 100, 
                    2
                ) as "Taux (%)"
            FROM 
                delegations d 
                LEFT JOIN distributions di ON d.id = di.delegation_id 
                JOIN delegation_produits dp ON dp.delegation_id = d.id 
            WHERE 
                dp.produit_id = 2 
            GROUP BY 
                d.libelle, dp.quantite_prevue;
        `)

        await connection.end()

        // Return both query results
        return NextResponse.json({
            productStats,
            productDistribution
        })
    } catch (error) {
        console.error("Error fetching data:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}