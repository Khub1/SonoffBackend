export interface Device {
  deviceid: string;
  name: string;
  type: string;
  online: boolean;
  params: {
    temperature?: number;
    humidity?: number;
    battery?: number | null;
    parentid?: string;
    timeZone?: number;
  };
}