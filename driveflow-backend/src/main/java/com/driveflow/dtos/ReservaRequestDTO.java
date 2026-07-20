package com.driveflow.dtos;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReservaRequestDTO {
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Long vehiculoId;
    private Long usuarioId;
    private String telefono;
    private String ciudadRetiro;
}
