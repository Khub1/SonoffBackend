import ewelink from "ewelink-api";
import { Device } from "../../domain/entities/device";
import { config } from "../../config/env";

// Define the type for the connection configuration
interface EwelinkConfig {
  email: string;
  password: string;
  region?: string;
  at?: string;
  apiKey?: string;
}

export class EwelinkClient {
  private connection: ewelink;

  constructor() {
    const credentials: EwelinkConfig = {
      email: config.ewelinkUser,
      password: config.ewelinkPassword,
      region: config.ewelinkRegion,
    };

    console.log("Initializing eWeLink with config:", credentials);
    this.connection = new ewelink(credentials);
  }

  async getDevices(): Promise<Device[] | { error: number; msg: string }> {
    try {
      const devices = await this.connection.getDevices();
      //console.log("eWeLink API response:", devices);
      return devices as Device[];
    } catch (error: any) {
      console.error("Error fetching devices from eWeLink:", error);
      return { error: error?.error || 500, msg: error?.msg || "Unknown error" };
    }
  }
}