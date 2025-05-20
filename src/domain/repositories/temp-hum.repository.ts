import { TempHumRecord } from "../entities/temp-hum-record";

export interface ITempHumRepository {
  save(record: TempHumRecord): Promise<void>;
}