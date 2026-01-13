import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: "172.16.20.111",
      user: "usr_opramadan",
      password: "EN*8sQ47sWJ*SIC57",
      database: "entraide_opramadan_db",
    });

    const [results] = await connection.execute(`
            SELECT
                d.libelle AS delegation_name,
                p.libelle AS produit_name,
                dp.quantite_prevue,
                COALESCE(SUM(rd.quantite), 0) AS quantite_totale,
                ROUND(
                    (COALESCE(SUM(rd.quantite), 0) / NULLIF(dp.quantite_prevue, 0)) * 100,
                    2
                ) AS pourcentage,
                g.pourcentage_global
            FROM delegations d
            JOIN delegation_produits dp
                ON dp.delegation_id = d.id
               AND dp.deleted_at IS NULL
            JOIN produits p
                ON p.id = dp.produit_id
               AND p.operation_id = 2
               AND p.deleted_at IS NULL
            LEFT JOIN receptions r
                ON r.delegation_id = d.id
               AND r.operation_id = 2
               AND r.deleted_at IS NULL
            LEFT JOIN reception_details rd
                ON rd.reception_id = r.id
               AND rd.produit_id = dp.produit_id
               AND rd.deleted_at IS NULL
            LEFT JOIN (
                SELECT
                    dp2.delegation_id,
                    ROUND(
                        AVG(
                            (COALESCE(rt.quantite_totale, 0) / NULLIF(dp2.quantite_prevue, 0)) * 100
                        ),
                        2
                    ) AS pourcentage_global
                FROM delegation_produits dp2
                JOIN produits p2
                    ON p2.id = dp2.produit_id
                   AND p2.operation_id = 2
                   AND p2.deleted_at IS NULL
                LEFT JOIN (
                    SELECT
                        r.delegation_id,
                        rd.produit_id,
                        SUM(rd.quantite) AS quantite_totale
                    FROM receptions r
                    JOIN reception_details rd
                        ON rd.reception_id = r.id
                       AND rd.deleted_at IS NULL
                    WHERE r.operation_id = 2
                      AND r.deleted_at IS NULL
                    GROUP BY r.delegation_id, rd.produit_id
                ) rt
                    ON rt.delegation_id = dp2.delegation_id
                   AND rt.produit_id = dp2.produit_id
                WHERE dp2.deleted_at IS NULL
                GROUP BY dp2.delegation_id
            ) g
                ON g.delegation_id = d.id
            WHERE d.deleted_at IS NULL
            GROUP BY
                d.id, d.libelle,
                p.id, p.libelle,
                dp.quantite_prevue,
                g.pourcentage_global
        `);

    await connection.end();

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
