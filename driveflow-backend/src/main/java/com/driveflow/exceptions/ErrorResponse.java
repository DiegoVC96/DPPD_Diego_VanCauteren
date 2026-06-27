package com.driveflow.exceptions;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponse(
    int status,
    String mensaje,
    LocalDateTime timestamp,
    Map<String, String> erroresValidacion // Mensaje de error específico
) {
    // Constructor secundario conveniente para errores simples sin validación de campos
    public ErrorResponse(int status, String mensaje) {
        this(status, mensaje, LocalDateTime.now(), null);
    }
}
