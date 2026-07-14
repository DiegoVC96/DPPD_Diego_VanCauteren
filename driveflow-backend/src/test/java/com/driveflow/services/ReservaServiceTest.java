package com.driveflow.services;

import com.driveflow.models.Reserva;
import com.driveflow.models.Vehiculo;
import com.driveflow.repositories.ReservaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservaServiceTest {

    @Mock
    private ReservaRepository reservaRepository;

    @InjectMocks
    private ReservaService reservaService;

    private Vehiculo vehiculoPrueba;
    private Reserva reservaExistente;

    @BeforeEach
    void iniciarConfiguracion() {
        vehiculoPrueba = new Vehiculo();
        vehiculoPrueba.setId(1L);
        vehiculoPrueba.setNombre("Tesla Model S");

        // Simulacion de una reserva existente del 10 al 15 de Julio de 2026
        reservaExistente = new Reserva();
        reservaExistente.setId(1L);
        reservaExistente.setVehiculo(vehiculoPrueba);
        reservaExistente.setFechaInicio(LocalDate.of(2026, 7, 10));
        reservaExistente.setFechaFin(LocalDate.of(2026, 7, 15));
    }

    @Test
    @DisplayName("✓ Debería guardar la reserva si las fechas están completamente libres")
    void guardarReservaExitosa() {
        Reserva nuevaReserva = new Reserva();
        nuevaReserva.setVehiculo(vehiculoPrueba);
        nuevaReserva.setFechaInicio(LocalDate.of(2026, 7, 18));
        nuevaReserva.setFechaFin(LocalDate.of(2026, 7, 22));

        when(reservaRepository.findByVehiculoId(1L)).thenReturn(List.of(reservaExistente));
        when(reservaRepository.save(nuevaReserva)).thenReturn(nuevaReserva);

        Reserva resultado = reservaService.registrarContratoReserva(nuevaReserva);

        assertNotNull(resultado);
        verify(reservaRepository, times(1)).save(nuevaReserva);
    }

    @Test
    @DisplayName("❌ Debería lanzar excepción si las fechas se solapan de forma concurrente")
    void fallarPorSolapamientoCronologico() {
        Reserva reservaConflictiva = new Reserva();
        reservaConflictiva.setVehiculo(vehiculoPrueba);
        reservaConflictiva.setFechaInicio(LocalDate.of(2026, 7, 12));
        reservaConflictiva.setFechaFin(LocalDate.of(2026, 7, 14));

        when(reservaRepository.findByVehiculoId(1L)).thenReturn(List.of(reservaExistente));

        IllegalArgumentException excepcion = assertThrows(IllegalArgumentException.class, () -> {
            reservaService.registrarContratoReserva(reservaConflictiva);
        });

        assertTrue(excepcion.getMessage().contains("Conflicto Cronológico"));
        verify(reservaRepository, never()).save(any(Reserva.class)); 
    }
}
