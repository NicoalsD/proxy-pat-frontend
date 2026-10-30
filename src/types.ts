export type Status = "SUCCESS" | "ERROR";

export interface LogEntry {
  requestId: string;
  serviceId: string;
  operation: string;
  durationMs: number;
  status: Status;
  timestamp: string;
  params: unknown[];
  result: unknown;
  error: string | null;
}

export interface LogPage {
  items: LogEntry[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

export interface ServiceSummary {
  serviceId: string;
  totalCalls: number;
  errorRate: number;
  avgDurationMs: number;
}

export interface Summary {
  generatedAt: string;
  services: ServiceSummary[];
}

export interface Filters {
  service: string;
  status: string;
  from: string;
  to: string;
}
