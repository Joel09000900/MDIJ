import 'dotenv/config'

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback
  if (!value) throw new Error(`Variable d'environnement manquante : ${name}`)
  return value
}

export const config = {
  // 4001 par defaut : le 4000 est pris par l'API du projet OliKrys en developpement.
  port: Number(process.env.PORT ?? 4001),
  clientOrigins: required('CLIENT_ORIGIN', 'http://localhost:5174')
    .split(',')
    .map((o) => o.trim()),
  whatsappNumber: required('WHATSAPP_NUMBER', '2250702050284'),
  adminToken: process.env.ADMIN_TOKEN ?? '',
  adminPassword: process.env.ADMIN_PASSWORD ?? '',
  databaseUrl: required('DATABASE_URL'),
  isProd: process.env.NODE_ENV === 'production',
} as const
