import { Device } from "../../domain/entities/device";
import { TempHumRecord } from "../../domain/entities/temp-hum-record";
import { IDeviceRepository } from "../../domain/repositories/device.repository";
import { ITempHumRepository } from "../../domain/repositories/temp-hum.repository";

export class RegisterDevicesUseCase {
  constructor(
    private deviceRepository: IDeviceRepository,
    private tempHumRepository: ITempHumRepository,
    private getDevices: () => Promise<Device[] | { error: number; msg: string }>
  ) {}

  async execute(): Promise<void> {
    const fecha = new Date();
    if (fecha.getMinutes() % 5 !== 0) {
      console.log(`No es hora de registrar a las ${fecha.toISOString()}`);
      return;
    }

    console.log(`Iniciando contacto con eWeLink a las ${fecha.toISOString()}`);
    try {
      const devices = await this.getDevices();
      if (!Array.isArray(devices)) {
        console.error(`eWeLink API error: ${devices.msg} (${devices.error})`);
        return;
      }
      if (devices.length === 0) {
        console.log("No se encontraron dispositivos");
        return;
      }
      console.log(`Contacto exitoso con eWeLink a las ${fecha.toISOString()}`);

      for (const device of devices) {
        if (device.type === "a4") {
          /*
          console.log(`Processing device ${device.name}:`, {
            deviceid: device.deviceid,
            params: device.params,
            online: device.online,
          });
          */

          const deviceToSave: Device = {
            ...device,
            params: {
              ...device.params,
              battery: device.online === true ? device.params.battery : null,
            },
          };

          await this.deviceRepository.saveOrUpdate(deviceToSave);

          const fechaDispositivo = new Date(fecha.getTime());
          if (typeof device.params.timeZone !== "number") {
            console.log(`TimeZone inválido para el dispositivo ${device.name}`);
            continue;
          }

          fechaDispositivo.setHours(
            fechaDispositivo.getHours() + device.params.timeZone
          );
          if (isNaN(fechaDispositivo.getTime())) {
            console.log(
              `Fecha inválida para el dispositivo ${device.name} después de ajustar timeZone`
            );
            continue;
          }

          fechaDispositivo.setSeconds(0);
          const fechaFormateada = fechaDispositivo
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

          let temp: number | null = null;
          let hum: number | null = null;

          if (device.online === true) {
            if (typeof device.params.temperature === "string") {
              const parsedTemp = parseFloat(device.params.temperature) / 100;
              if (!isNaN(parsedTemp)) {
                temp = Number(parsedTemp.toFixed(2));
              } else {
                console.log(`Temperatura inválida para ${device.name}: ${device.params.temperature}`);
              }
            } else {
              console.log(`Temperatura no es string para ${device.name}: ${device.params.temperature}`);
            }

            if (typeof device.params.humidity === "string") {
              const parsedHum = parseFloat(device.params.humidity) / 100;
              if (!isNaN(parsedHum)) {
                hum = Number(parsedHum.toFixed(2));
              } else {
                console.log(`Humedad inválida para ${device.name}: ${device.params.humidity}`);
              }
            } else {
              console.log(`Humedad no es string para ${device.name}: ${device.params.humidity}`);
            }

            if (temp !== null && (temp > 999.99 || temp < -999.99)) {
              console.log(`Temperatura fuera de rango para ${device.name}: ${temp}`);
              continue;
            }
            if (hum !== null && (hum > 999.99 || hum < -999.99)) {
              console.log(`Humedad fuera de rango para ${device.name}: ${hum}`);
              continue;
            }
          } else {
            console.log(`Device ${device.name} is offline, setting temp and hum to null`);
          }

          const record: TempHumRecord = {
            fecha: fechaFormateada,
            device_name: device.name,
            device_id: device.deviceid,
            temp,
            hum,
          };

          //console.log(`Saving record for ${device.name}:`, record);
          await this.tempHumRepository.save(record);
          //console.log(`Registro exitoso a las ${fecha.toISOString()} para ${device.name}`);
        }
      }
      console.log(
        `Fin de contacto con eWeLink a las ${fecha.toISOString()}. Esperando ${
          process.env.INTERVALO
            ? parseInt(process.env.INTERVALO) / 60000
            : 5
        } minutos para el próximo registro.`
      );
    } catch (error) {
      console.error("Error en registro:", error);
    }
  }
}