import { Device } from "../entities/device";

export interface IDeviceRepository {
  saveOrUpdate(device: Device): Promise<void>;
}