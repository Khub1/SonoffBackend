export interface TempHumRecord {
  fecha: string;
  device_name: string;
  device_id: string;
  temp: number | null;
  hum: number | null;
}