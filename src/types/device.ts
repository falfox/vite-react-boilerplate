export interface Device {
  id: string
  identifier: string;
  ipAddress: string;
  model: string;
  status: "connected" | "connecting" | "disconnected";
}
