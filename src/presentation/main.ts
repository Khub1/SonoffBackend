import { RegisterDevicesUseCase } from "../application/usecases/register-devices.usecase";
import { ListDevicesUseCase } from "../application/usecases/list-devices.usecase";
import { MssqlDeviceRepository } from "../infrastructure/database/mssql-device.repository";
import { MssqlTempHumRepository } from "../infrastructure/database/mssql-temp-hum.repository";
import { EwelinkClient } from "../infrastructure/ewelink/ewelink-client";
import { config } from "../config/env";

const ewelinkClient = new EwelinkClient();
const deviceRepository = new MssqlDeviceRepository();
const tempHumRepository = new MssqlTempHumRepository();

const registerDevicesUseCase = new RegisterDevicesUseCase(
  deviceRepository,
  tempHumRepository,
  () => ewelinkClient.getDevices()
);

const listDevicesUseCase = new ListDevicesUseCase(() =>
  ewelinkClient.getDevices()
);

async function main() {
  try {
    await registerDevicesUseCase.execute();
  } catch (error) {
    console.error("Error in main registration loop:", error);
  }
}

main();

setInterval(main, config.intervalo);

// List devices on startup with error handling
listDevicesUseCase.execute().catch((error) => {
  console.error("Failed to list devices on startup:", error);
});