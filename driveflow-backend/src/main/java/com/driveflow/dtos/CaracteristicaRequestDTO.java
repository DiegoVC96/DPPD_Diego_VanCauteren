package com.driveflow.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CaracteristicaRequestDTO(
    @NotBlank(message = "El nombre de la característica es obligatorio")
    @Size(min = 3, max = 50, message = "El nombre debe tener entre 3 and 50 caracteres")
    String nombre,

    @NotBlank(message = "La descripción es obligatoria")
    @Size(min = 10, max = 255, message = "La descripción debe tener entre 10 and 255 caracteres")
    String descripcion,

    @NotBlank(message = "La URL de la imagen representativa es obligatoria")
    String urlImagen,

    @NotBlank(message = "El nombre del ícono vectorial es obligatorio")
    String icono
) {}
