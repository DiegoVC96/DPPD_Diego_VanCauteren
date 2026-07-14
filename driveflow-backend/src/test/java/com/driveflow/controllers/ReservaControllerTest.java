package com.driveflow.controllers;

import com.driveflow.models.Reserva;
import com.driveflow.models.Usuario;
import com.driveflow.models.Vehiculo;
import com.driveflow.repositories.UsuarioRepository;
import com.driveflow.repositories.VehiculoRepository;
import com.driveflow.services.ReservaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservaControllerTest {

    @Mock
    private ReservaService reservaService;

    @Mock
    private VehiculoRepository vehiculoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private ReservaController reservaController;

    private Map<String, Object> payloadValido;

    @BeforeEach
    void configurarPayload() {
        payloadValido = new HashMap<>();
        payloadValido.put("fechaInicio", "2026-08-01");
        payloadValido.put("fechaFin", "2026-08-05");
        payloadValido.put("vehiculoId", 1);
        payloadValido.put("usuarioId", 2);
        payloadValido.put("telefono", "+54 11 1234-5678");
        payloadValido.put("ciudadRetiro", "Mendoza");
    }

    @Test
    @DisplayName("✓ Debería retornar HTTP 201 CREATED si el payload relacional es correcto")
    void registrarNuevaReservaExitosa() {
        when(vehiculoRepository.findById(1L)).thenReturn(Optional.of(new Vehiculo()));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(new Usuario()));
        when(reservaService.registrarContratoReserva(any(Reserva.class))).thenReturn(new Reserva());

        ResponseEntity<?> respuesta = reservaController.registrarNuevaReserva(payloadValido);

        assertEquals(HttpStatus.CREATED, respuesta.getStatusCode());
        assertNotNull(respuesta.getBody());
        
        Map<?, ?> body = (Map<?, ?>) respuesta.getBody();
        assertEquals("Reserva confirmada de forma exitosa.", body.get("mensaje"));
    }

    @Test
    @DisplayName("❌ Debería retornar HTTP 400 BAD REQUEST ante solapamientos concurrentes")
    void registrarNuevaReservaFallida() {
        when(vehiculoRepository.findById(1L)).thenReturn(Optional.of(new Vehiculo()));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(new Usuario()));
        
        when(reservaService.registrarContratoReserva(any(Reserva.class)))
                .thenThrow(new IllegalArgumentException("Conflicto Cronológico: El vehículo ya se encuentra alquilado"));

        ResponseEntity<?> respuesta = reservaController.registrarNuevaReserva(payloadValido);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertNotNull(respuesta.getBody());
        
        Map<?, ?> body = (Map<?, ?>) respuesta.getBody();
        assertEquals("Conflicto Cronológico: El vehículo ya se encuentra alquilado", body.get("mensaje"));
    }
}
