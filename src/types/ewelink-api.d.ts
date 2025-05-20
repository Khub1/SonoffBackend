declare module "ewelink-api" {
  interface EwelinkCredentials {
    email?: string;
    password?: string;
    region?: string;
    at?: string;
    apiKey?: string;
  }

  class ewelink {
    constructor(credentials: EwelinkCredentials);
    getDevices(): Promise<unknown[] | { error: number; msg: string }>;
  }

  export = ewelink;
}