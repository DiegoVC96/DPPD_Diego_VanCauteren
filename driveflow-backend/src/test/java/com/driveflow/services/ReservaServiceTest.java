package com.driveflow.services;

import com.driveflow.dtos.ReservaRequestDTO;
import com.driveflow.exceptions.ConflictoCronologicoException;
import com.driveflow.models.Reserva;
import com.driveflow.models.Usuario;
import com.driveflow.models.Vehiculo;
import com.driveflow.repositories.ReservaRepository;
import com.driveflow.repositories.UsuarioRepository;
import com.driveflow.repositories.VehiculoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservaServiceTest {

    @Mock
    private ReservaRepository reservaRepository;

    @Mock
    private VehiculoRepository vehiculoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private ReservaService reservaService;

    private Vehiculo vehiculoPrueba;
    private Usuario usuarioPrueba;
    private Reserva reservaExistente;
    private ReservaRequestDTO dtoValido;

    @BeforeEach
    void iniciarConfiguracion() {
        vehiculoPrueba = new Vehiculo();
        vehiculoPrueba.setId(1L);
        vehiculoPrueba.setNombre("Tesla Model S");
        usuarioPrueba = new Usuario();
        usuarioPrueba.setId(2L);
        usuarioPrueba.setEmail("cliente@driveflow.com");
        reservaExistente = new Reserva();
        reservaExistente.setId(1L);
        reservaExistente.setVehiculo(vehiculoPrueba);
        reservaExistente.setUsuario(usuarioPrueba);
        reservaExistente.setFechaInicio(LocalDate.of(2026, 7, 10));
        reservaExistente.setFechaFin(LocalDate.of(2026, 7, 15));
        dtoValido = new ReservaRequestDTO();
        dtoValido.setVehiculoId(1L);
        dtoValido.setUsuarioId(2L);
        dtoValido.setFechaInicio(LocalDate.of(2026, 7, 18));
        dtoValido.setFechaFin(LocalDate.of(2026, 7, 22));
        dtoValido.setTelefono("+54 11 1234-5678");
        dtoValido.setCiudadRetiro("Buenos Aires");
    }

    @Test
    @DisplayName("✓ Debería guardar la reserva si las fechas del DTO están completamente libres")
    void guardarReservaExitosa() {
        when(vehiculoRepository.findById(1L)).thenReturn(Optional.of(vehiculoPrueba));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(usuarioPrueba));
        when(reservaRepository.findByVehiculoId(1L)).thenReturn(List.of(reservaExistente));
        when(reservaRepository.save(any(Reserva.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Reserva resultado = reservaService.procesarContratoReserva(dtoValido);

        assertNotNull(resultado);
        assertEquals(LocalDate.of(2026, 7, 18), resultado.getFechaInicio());
        assertEquals(LocalDate.of(2026, 7, 22), resultado.getFechaFin());
        verify(reservaRepository, times(1)).save(any(Reserva.class));
    }

    @Test
    @DisplayName("❌ Debería lanzar ConflictoCronologicoException ante solapamientos de días")
    void fallarPorSolapamientoCronologico() {
        dtoValido.setFechaInicio(LocalDate.of(2026, 7, 12));
        dtoValido.setFechaFin(LocalDate.of(2026, 7, 14));

        when(vehiculoRepository.findById(1L)).thenReturn(Optional.of(vehiculoPrueba));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(usuarioPrueba));
        when(reservaRepository.findByVehiculoId(1L)).thenReturn(List.of(reservaExistente));

        ConflictoCronologicoException excepcion = assertThrows(ConflictoCronologicoException.class, () -> {
            reservaService.procesarContratoReserva(dtoValido);
        });

        assertTrue(excepcion.getMessage().contains("Conflicto Cronológico"));
        verify(reservaRepository, never()).save(any(Reserva.class)); 
    }
}
