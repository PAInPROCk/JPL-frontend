const host = window.location.hostname;

export const API_BASE_URL = `http://${host}:5000`;

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${API_BASE_URL}/${path}`;
};