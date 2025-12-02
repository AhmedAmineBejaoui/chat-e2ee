const buildDefaultServerURL = (): string => {
  if (typeof window === "undefined") {
    return "https://localhost:3001";
  }
  const { protocol, hostname } = window.location;
  const formattedHost = hostname.includes(":") ? `[${hostname}]` : hostname;
  return `${protocol}//${formattedHost}:3001`;
};

const resolveServerURL = (): string => {
  if (process.env.REACT_APP_SERVER_URL) {
    return process.env.REACT_APP_SERVER_URL;
  }
  if (typeof window !== "undefined" && process.env.NODE_ENV !== "development") {
    return `${window.location.protocol}//${window.location.hostname}`;
  }
  return buildDefaultServerURL();
};

export const getServerURL = (): string => resolveServerURL().replace(/\/$/, "");

export { buildDefaultServerURL, resolveServerURL };

