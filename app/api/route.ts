import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function GET() {
    try {
        const connection = await mysql.createConnection({
            host: "172.16.20.111",
            user: "admin",
            password: "EN*qZ5Qwz*SIC",
            database: "entraide_opramadan_db",
        })

        const [rows] = await connection.execute(`
            SELECT d.libelle                                                                                      AS delegation_name,
                   ROUND((SUM(CASE WHEN p.libelle = 'Sac Recyclable' THEN IFNULL(rd.quantite, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Sac Recyclable' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Sac Recyclable\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Carte' THEN IFNULL(rd.quantite, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Carte' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Carte\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Sucre' THEN IFNULL(rd.quantite, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Sucre' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Sucre\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Thé' THEN IFNULL(rd.quantite, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Thé' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Thé\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Farine' THEN IFNULL(rd.quantite, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Farine' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Farine\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Huile' THEN IFNULL(rd.quantite, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Huile' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Huile\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Tomate' THEN IFNULL(rd.quantite, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Tomate' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Tomate\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Lentille' THEN IFNULL(rd.quantite, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Lentille' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Lentille\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Pate' THEN IFNULL(rd.quantite, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Pate' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Pate\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Lait' THEN IFNULL(rd.quantite, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Lait' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Lait\`,
                   ROUND((SUM(CASE WHEN p.libelle = 'Riz' THEN IFNULL(rd.quantite, 0) END) /
                          NULLIF(SUM(CASE WHEN p.libelle = 'Riz' THEN dp.quantite_prevue END), 0)) * 100,
                         2)                                                                                       AS \`Riz\`,
                   ROUND(
                           (
                               ROUND((SUM(CASE WHEN p.libelle = 'Sac Recyclable' THEN IFNULL(rd.quantite, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Sac Recyclable' THEN dp.quantite_prevue END),
                                             0)) * 100, 2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Carte' THEN IFNULL(rd.quantite, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Carte' THEN dp.quantite_prevue END), 0)) * 100,
                                     2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Sucre' THEN IFNULL(rd.quantite, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Sucre' THEN dp.quantite_prevue END), 0)) * 100,
                                     2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Thé' THEN IFNULL(rd.quantite, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Thé' THEN dp.quantite_prevue END), 0)) * 100,
                                     2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Farine' THEN IFNULL(rd.quantite, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Farine' THEN dp.quantite_prevue END), 0)) * 100,
                                     2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Huile' THEN IFNULL(rd.quantite, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Huile' THEN dp.quantite_prevue END), 0)) * 100,
                                     2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Tomate' THEN IFNULL(rd.quantite, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Tomate' THEN dp.quantite_prevue END), 0)) * 100,
                                     2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Lentille' THEN IFNULL(rd.quantite, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Lentille' THEN dp.quantite_prevue END), 0)) *
                                     100, 2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Pate' THEN IFNULL(rd.quantite, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Pate' THEN dp.quantite_prevue END), 0)) * 100,
                                     2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Lait' THEN IFNULL(rd.quantite, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Lait' THEN dp.quantite_prevue END), 0)) * 100,
                                     2) +
                               ROUND((SUM(CASE WHEN p.libelle = 'Riz' THEN IFNULL(rd.quantite, 0) END) /
                                      NULLIF(SUM(CASE WHEN p.libelle = 'Riz' THEN dp.quantite_prevue END), 0)) * 100, 2)
                               ) / 11, 2
                   )                                                                                              AS pourcentage_global
            FROM delegations d
                     JOIN delegation_produits dp ON dp.delegation_id = d.id
                     JOIN produits p ON p.id = dp.produit_id
                     LEFT JOIN reception_details rd ON rd.produit_id = dp.produit_id
                AND rd.reception_id IN (SELECT r.id
                                        FROM receptions r
                                        WHERE r.delegation_id = d.id)
            GROUP BY d.id, d.libelle
            ORDER BY \`delegation_name\` ASC
      `)

        await connection.end()

        return NextResponse.json(rows)
    } catch (error) {
        console.error("Error fetching data:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

