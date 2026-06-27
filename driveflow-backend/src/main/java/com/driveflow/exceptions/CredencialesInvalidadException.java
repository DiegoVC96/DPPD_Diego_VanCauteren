package com.driveflow.exceptions;

public class CredencialesInvalidadException extends RuntimeException {
    public CredencialesInvalidadException(String mensaje) {
        super(mensaje);
    }
}
