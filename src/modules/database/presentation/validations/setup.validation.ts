import z from "zod";

export const setupValidation = z.object({
  type: z.literal("postgres"),
  host: z.string().min(1, "Host es requerido"),
  port: z.coerce.number(),
  database: z.string().min(1, "Nombre de base de datos es requerido"),
  user: z.string().min(1, "Nombre de usuario es requerido"),
  password: z.string().min(1, "Contraseña es requerida"),
  ssl: z.boolean().default(false),
});