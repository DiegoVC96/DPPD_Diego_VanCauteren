package com.driveflow.exceptions;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponse(
    int status,
    String mensaje,
    LocalDateTime timestamp,
    Map<String, String> erroresValidacion 
) {
    public ErrorResponse(int status, String mensaje) {
        this(status, mensaje, LocalDateTime.now(), null);
    }
}
