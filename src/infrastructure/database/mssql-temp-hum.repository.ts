import * as sql from "mssql";
import { TempHumRecord } from "../../domain/entities/temp-hum-record";
import { ITempHumRepository } from "../../domain/repositories/temp-hum.repository";
import { getMssqlPool } from "./mssql-client";

export class MssqlTempHumRepository implements ITempHumRepository {
  async save(record: TempHumRecord): Promise<void> {
    const pool = await getMssqlPool();
    try {
      await pool
        .request()
        .input("fecha", sql.VarChar, record.fecha)
        .input("device_name", sql.VarChar, record.device_name)
        .input("device_id", sql.VarChar, record.device_id)
        .input("temp", sql.Decimal(5, 2), record.temp)
        .input("hum", sql.Decimal(5, 2), record.hum)
        .query(
          "INSERT INTO reg_temp_hum (fecha, device_name, device_id, temp, hum) VALUES (@fecha, @device_name, @device_id, @temp, @hum)"
        );
    } catch (error) {
      console.error("Error en MssqlTempHumRepository:", error);
      throw error;
    } finally {
      await pool.close();
    }
  }
}