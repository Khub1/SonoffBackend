import ewelink from "ewelink-api";
import { Device } from "../../domain/entities/device";
import { config } from "../../config/env";

interface EwelinkConfig {
  email: string;
  password: string;
  region?: string;
  at?: string;
  apiKey?: string;
}

export class EwelinkClient {
  private connection: ewelink | null = null;
  private credentials: EwelinkConfig;

  constructor() {
    this.credentials = {
      email: config.ewelinkUser,
      password: config.ewelinkPassword,
      region: config.ewelinkRegion,
    };
  }

  private initializeConnection() {
    this.connection = new ewelink(this.credentials);
  }

  async getDevices(): Promise<Device[]> {
    try {
      this.initializeConnection();
      const devices = await this.connection!.getDevices();
      return devices as Device[];
    } catch (error) {
      console.error("eWeLink API Error:", error);
      throw error; // Re-throw the error after logging
    } finally {
      // Clean up the connection to allow garbage collection
      this.connection = null;
    }
  }
}