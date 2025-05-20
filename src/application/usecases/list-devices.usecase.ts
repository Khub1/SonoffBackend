import { Device } from "../../domain/entities/device";

export class ListDevicesUseCase {
  constructor(
    private getDevices: () => Promise<Device[] | { error: number; msg: string }>
  ) {}

  async execute(): Promise<void> {
    try {
      const devices = await this.getDevices();
      if (!Array.isArray(devices)) {
        console.error(`eWeLink API error: ${devices.msg} (${devices.error})`);
        return;
      }
      //console.log("Dispositivos obtenidos:", devices);
    } catch (error) {
      console.error("Error listing devices:", error);
    }
  }
}