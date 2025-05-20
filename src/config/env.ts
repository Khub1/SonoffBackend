import * as dotenv from "dotenv";

dotenv.config();

console.log("Loaded environment variables:", {
  EWELINK_USER: process.env.EWELINK_USER,
  EWELINK_PASSWORD: process.env.EWELINK_PASSWORD,
  EWELINK_REGION: process.env.EWELINK_REGION,
  MSSQL_HOST: process.env.MSSQL_HOST,
  MSSQL_PORT: process.env.MSSQL_PORT,
  MSSQL_USER: process.env.MSSQL_USER,
  MSSQL_DATABASE: process.env.MSSQL_DATABASE,
  INTERVALO: process.env.INTERVALO,
});

export const config = {
  ewelinkUser: process.env.EWELINK_USER || "iot.maehara@yemita.com.py ",
  ewelinkPassword: process.env.EWELINK_PASSWORD || "Vm$$123456",
  ewelinkRegion: process.env.EWELINK_REGION || "us",
  mssqlHost: process.env.MSSQL_HOST || "localhost",
  mssqlPort: parseInt(process.env.MSSQL_PORT || "1433"),
  mssqlUser: process.env.MSSQL_USER || "",
  mssqlPassword: process.env.MSSQL_PASSWORD || "",
  mssqlDatabase: process.env.MSSQL_DATABASE || "",
  intervalo: parseInt(process.env.INTERVALO || "300000"),
};