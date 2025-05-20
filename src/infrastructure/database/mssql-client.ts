import * as sql from "mssql";
import { config } from "../../config/env";

export async function getMssqlPool(): Promise<sql.ConnectionPool> {
  const pool = new sql.ConnectionPool({
    server: config.mssqlHost,
    port: config.mssqlPort,
    user: config.mssqlUser,
    password: config.mssqlPassword,
    database: config.mssqlDatabase,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  });
  await pool.connect();
  return pool;
}

export async function createTables(): Promise<void> {
  const pool = await getMssqlPool();
  try {
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'prm_devices')
      CREATE TABLE prm_devices (
        id INT IDENTITY(1,1) PRIMARY KEY,
        device_name VARCHAR(100),
        device_id VARCHAR(100),
        parent_device VARCHAR(100),
        battery INT NULL
      )
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'reg_temp_hum')
      CREATE TABLE reg_temp_hum (
        id INT IDENTITY(1,1) PRIMARY KEY,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        device_name VARCHAR(100),
        device_id VARCHAR(100),
        temp DECIMAL(5,2) NULL,
        hum DECIMAL(5,2) NULL
      )
    `);
    console.log("Tablas creadas exitosamente");
  } catch (error) {
    console.error("Error al crear tablas:", error);
  } finally {
    await pool.close();
  }
}

// Run table creation if executed directly
if (require.main === module) {
  createTables();
}