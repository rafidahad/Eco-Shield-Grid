// TypeScript interfaces for ESP32 telemetry payloads

export interface StorageHubPayload {
  internal_temp_c: number;
  internal_pressure_hpa: number;
  external_temp_c: number;
  fan_active: boolean;
  pump_active: boolean;
}

export interface FieldMonitorPayload {
  air_quality_ppm: number;
  soil_moisture_percent: number;
  ambient_temp_c: number;
  ambient_humidity: number;
}

export type TelemetryPayload = StorageHubPayload | FieldMonitorPayload;

export interface TelemetryRecord {
  id: string;
  nodeId: string;
  payload: TelemetryPayload;
  createdAt: string;
}

export interface NodeWithTelemetry {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  telemetry: TelemetryRecord[];
}

export interface IngestPayload {
  node_id: string;
  [key: string]: unknown;
}
