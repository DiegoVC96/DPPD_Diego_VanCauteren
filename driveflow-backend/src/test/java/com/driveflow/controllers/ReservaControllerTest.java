package com.driveflow.controllers;

import com.driveflow.dtos.ReservaRequestDTO;
import com.driveflow.exceptions.ConflictoCronologicoException;
import com.driveflow.models.Reserva;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservaControllerTest {

    @Mock
    private com.driveflow.services.ReservaService reservaService;

    @Mock
    private com.driveflow.services.EmailReservaService emailService;

    @InjectMocks
    private ReservaController reservaController;

    private ReservaRequestDTO dtoValido;

    @BeforeEach
    void configurarDto() {
        dtoValido = new ReservaRequestDTO();
        dtoValido.setFechaInicio(LocalDate.of(2026, 8, 1));
        dtoValido.setFechaFin(LocalDate.of(2026, 8, 5));
        dtoValido.setVehiculoId(1L);
        dtoValido.setUsuarioId(2L);
        dtoValido.setTelefono("+54 11 1234-5678");
        dtoValido.setCiudadRetiro("Mendoza");
    }

    @Test
    @DisplayName("✓ Debería retornar HTTP 201 CREATED si el DTO relacional es procesado con éxito")
    void registrarReservaExitosa() {
        when(reservaService.procesarContratoReserva(any(ReservaRequestDTO.class))).thenReturn(new Reserva());
        doNothing().when(emailService).enviarCorreoConfirmacionReserva(any(Reserva.class));

        ResponseEntity<?> respuesta = reservaController.registrarReserva(dtoValido);

        assertEquals(HttpStatus.CREATED, respuesta.getStatusCode());
        assertNotNull(respuesta.getBody());
        
        Map<?, ?> body = (Map<?, ?>) respuesta.getBody();
        assertEquals("Reserva confirmada de forma exitosa.", body.get("mensaje"));
        verify(reservaService, times(1)).procesarContratoReserva(any(ReservaRequestDTO.class));
    }

    @Test
    @DisplayName("❌ Debería retornar HTTP 400 BAD REQUEST ante excepciones de conflicto cronológico")
    void registrarReservaFallida() {
        when(reservaService.procesarContratoReserva(any(ReservaRequestDTO.class)))
                .thenThrow(new ConflictoCronologicoException("Conflicto Cronológico: El auto ya se encuentra rentado"));

        ConflictoCronologicoException excepcion = assertThrows(ConflictoCronologicoException.class, () -> {
            reservaController.registrarReserva(dtoValido);
        });

        assertEquals("Conflicto Cronológico: El auto ya se encuentra rentado", excepcion.getMessage());
        verify(reservaService, times(1)).procesarContratoReserva(any(ReservaRequestDTO.class));
        verify(emailService, never()).enviarCorreoConfirmacionReserva(any(Reserva.class)); // El correo jamás se envía si falla
    }
}
