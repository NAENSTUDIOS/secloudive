export const serviceName = 'secloudive-api';

export function createHealthResponse() {
  return {
    service: serviceName,
    status: 'ok' as const,
  };
}
