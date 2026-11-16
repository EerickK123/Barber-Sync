export enum DeviceType {
  IOS = "ios",
  ANDROID = "android",
  WEB = "web",
}

export interface RegisterPushTokenDTO {
  token: string;
  deviceType: DeviceType;
}