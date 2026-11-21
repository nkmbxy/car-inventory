import type { Car, CarInput } from "./types";

const BASE = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/cars`;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new Error("Can't reach the server. Check that the API is running.");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Something went wrong. Please try again.");
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const carApi = {
  list: () => request<Car[]>(""),
  create: (data: CarInput) =>
    request<Car>("", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: CarInput) =>
    request<Car>(`/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: number) => request<void>(`/${id}`, { method: "DELETE" }),
};
