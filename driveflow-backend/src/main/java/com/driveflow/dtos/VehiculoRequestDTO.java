package com.driveflow.dtos;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public record VehiculoRequestDTO(
    @NotBlank(message = "El nombre del vehículo es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    String nombre,

    @NotBlank(message = "La descripción es obligatoria")
    @Size(min = 10, message = "La descripción debe tener al menos 10 caracteres")
    String descripcion,

    @NotNull(message = "El precio por día es obligatorio")
    @Positive(message = "El precio por día debe ser un valor positivo")
    BigDecimal precioPorDia,

    @NotEmpty(message = "Debe registrar al menos una imagen para el vehículo")
    List<String> imagenes,

    Long categoriaId,

    List<Long> caracteristicasIds
) {}
