export const HELIOS_ROUTES = {
  dashboard: "/",
  runDetail: (id: string) => `/runs/${id}`,
} as const;
