import { describe, test, expect } from 'vitest'; 
import { z } from 'zod';

const esquemaRegistroTest = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6, { message: "Criterio Core: La contraseña debe contener al menos 6 caracteres" })
});

describe('🛡️ Auditoría del Esquema de Validación Zod (Registro)', () => {

  test('✓ Debería dar por válido un payload corporativo correcto', () => {
    const payloadValido = {
      nombre: "Carlos",
      apellido: "Pérez",
      email: "carlos.perez@gmail.com",
      password: "admin123_Secure"
    };

    const resultado = esquemaRegistroTest.safeParse(payloadValido);
    expect(resultado.success).toBe(true);
  });

  test('❌ Debería congelar el envío si la contraseña tiene menos de 6 caracteres', () => {
    const payloadInvalido = {
      nombre: "Carlos",
      apellido: "Pérez",
      email: "carlos.perez@gmail.com",
      password: "12345" 
    };

    const resultado = esquemaRegistroTest.safeParse(payloadInvalido);
    
    expect(resultado.success).toBe(false);
    
    const errorPassword = resultado.error.format().password?._errors[0];
    expect(errorPassword).toContain("al menos 6 caracteres");
  });
});
