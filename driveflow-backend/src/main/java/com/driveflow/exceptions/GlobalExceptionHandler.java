package com.driveflow.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice 
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> manejarErroresValidacion(MethodArgumentNotValidException ex) {
        Map<String, String> mapaErrores = new HashMap<>();
        
        // Mapeamos cada campo fallido con su respectivo mensaje
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String nombreCampo = ((FieldError) error).getField();
            String mensajeError = error.getDefaultMessage();
            mapaErrores.put(nombreCampo, mensajeError);
        });

        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Error de validación en los datos enviados",
            LocalDateTime.now(),
            mapaErrores
        );

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // 2. Captura de errores de lógica de negocio personalizados (Ej: Recursos no encontrados)
    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> manejarRecursoNoEncontrado(RecursoNoEncontradoException ex) {
        ErrorResponse error = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // 3. Captura genérica de errores internos del servidor
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> manejarErroresGlobales(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Ocurrió un error interno en el servidor. Por favor, intente más tarde."
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(NombreDuplicadoException.class)
    public org.springframework.http.ResponseEntity<ErrorResponse> manejarNombreDuplicado(NombreDuplicadoException ex) {
        ErrorResponse error = new ErrorResponse(org.springframework.http.HttpStatus.CONFLICT.value(), ex.getMessage());
        return new org.springframework.http.ResponseEntity<>(error, org.springframework.http.HttpStatus.CONFLICT);
    }

}
