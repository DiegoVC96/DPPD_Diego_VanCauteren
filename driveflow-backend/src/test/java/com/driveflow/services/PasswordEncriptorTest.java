package com.driveflow.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

class PasswordEncriptorTest {

    private BCryptPasswordEncoder passwordEncoder;
    private final String passwordTextoPlano = "DriveFlow2026!";

    @BeforeEach
    void configurarEncoder() {
        passwordEncoder = new BCryptPasswordEncoder();
    }

    @Test
    @DisplayName("✓ Debería generar un hash BCrypt de 60 caracteres y ocultar la clave original")
    void verificarHashingDeContrasena() {
        String hashGenerado = passwordEncoder.encode(passwordTextoPlano);

        assertNotNull(hashGenerado, "El hash generado no puede ser nulo.");
        assertEquals(60, hashGenerado.length(), "Criterio Core: Un hash BCrypt válido debe medir exactamente 60 caracteres.");
        assertNotEquals(passwordTextoPlano, hashGenerado, "Vulnerabilidad: El hash nunca debe coincidir con el texto plano.");
        assertTrue(hashGenerado.startsWith("$2a$") || hashGenerado.startsWith("$2b$"), "El prefijo del hash debe coincidir con el estándar robusto de BCrypt.");
    }

    @Test
    @DisplayName("✓ Debería validar credenciales correctas y rechazar claves alteradas")
    void verificarCoincidenciaDeHash() {
        String hashGenerado = passwordEncoder.encode(passwordTextoPlano);

        assertTrue(passwordEncoder.matches(passwordTextoPlano, hashGenerado), "El validador debería dar pase libre a la contraseña correcta.");
        assertFalse(passwordEncoder.matches("Driveflow2026!", hashGenerado), "El validador debe bloquear el acceso si cambia una sola mayúscula.");
        assertFalse(passwordEncoder.matches("123456", hashGenerado), "El validador debe rechazar de forma absoluta contraseñas incorrectas o genéricas.");
    }
}
