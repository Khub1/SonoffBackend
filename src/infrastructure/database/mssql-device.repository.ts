import * as sql from "mssql";
import { Device } from "../../domain/entities/device";
import { IDeviceRepository } from "../../domain/repositories/device.repository";
import { getMssqlPool } from "./mssql-client";

export class MssqlDeviceRepository implements IDeviceRepository {
  async saveOrUpdate(device: Device): Promise<void> {
    const pool = await getMssqlPool();
    try {
      const result = await pool
        .request()
        .input("device_id", sql.VarChar, device.deviceid)
        .query(
          "SELECT * FROM prm_devices WHERE device_id = @device_id"
        );

      const battery = device.params.battery ?? null;
      const parentDevice = device.params.parentid ?? null;

      if (result.recordset.length === 0) {
        await pool
          .request()
          .input("device_name", sql.VarChar, device.name)
          .input("device_id", sql.VarChar, device.deviceid)
          .input("battery", sql.Int, battery)
          .input("parent_device", sql.VarChar, parentDevice)
          .query(
            "INSERT INTO prm_devices (device_name, device_id, battery, parent_device) VALUES (@device_name, @device_id, @battery, @parent_device)"
          );
      } else {
        await pool
          .request()
          .input("battery", sql.Int, battery)
          .input("parent_device", sql.VarChar, parentDevice)
          .input("device_id", sql.VarChar, device.deviceid)
          .query(
            "UPDATE prm_devices SET battery = @battery, parent_device = @parent_device WHERE device_id = @device_id"
          );
      }
    } catch (error) {
      console.error("Error en MssqlDeviceRepository:", error);
      throw error;
    } finally {
      await pool.close();
    }
  }
}