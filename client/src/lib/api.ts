export class ApiError extends Error {
  details: Record<string, string>;

  constructor(message: string, details: Record<string, string> = {}) {
    super(message);
    this.details = details;
  }
}

export async function postJson<T>(url: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Impossible de joindre le serveur. Vérifiez votre connexion.");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(data?.error ?? "Une erreur est survenue.", data?.details);
  }
  return data as T;
}
