package com.driveflow.dtos;

import com.driveflow.models.Rol;

public record UsuarioResponseDTO(
    Long id,
    String nombre,
    String apellido,
    String email,
    Rol rol
) {}
