package com.driveflow.services;

import com.driveflow.dtos.ReservaRequestDTO;
import com.driveflow.exceptions.ConflictoCronologicoException;
import com.driveflow.exceptions.EntidadNoEncontradaException;
import com.driveflow.models.Reserva;
import com.driveflow.models.Usuario;
import com.driveflow.models.Vehiculo;
import com.driveflow.repositories.ReservaRepository;
import com.driveflow.repositories.UsuarioRepository;
import com.driveflow.repositories.VehiculoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ReservaService {

    private final ReservaRepository rRepository;
    private final VehiculoRepository vRepository;
    private final UsuarioRepository uRepository;

    public ReservaService(ReservaRepository rRepository, VehiculoRepository vRepository, UsuarioRepository uRepository) {
        this.rRepository = rRepository;
        this.vRepository = vRepository;
        this.uRepository = uRepository;
    }

    @Transactional(readOnly = true)
    public List<Reserva> obtenerPorUsuario(Long usuarioId) {
        if (!uRepository.existsById(usuarioId)) {
            throw new EntidadNoEncontradaException("El usuario con ID " + usuarioId + " no existe en XAMPP.");
        }
        return rRepository.findByUsuarioIdOrderByFechaInicioDesc(usuarioId);
    }

    @Transactional(readOnly = true)
    public List<String> obtenerFechasOcupadas(Long vehiculoId) {
        if (!vRepository.existsById(vehiculoId)) {
            throw new EntidadNoEncontradaException("El vehículo especificado no existe.");
        }
        List<Reserva> reservas = rRepository.findByVehiculoId(vehiculoId);
        java.util.List<String> fechasBloqueadas = new java.util.ArrayList<>();
        for (Reserva res : reservas) {
            java.time.LocalDate actual = res.getFechaInicio();
            while (!actual.isAfter(res.getFechaFin())) {
                fechasBloqueadas.add(actual.toString());
                actual = actual.plusDays(1);
            }
        }
        return fechasBloqueadas;
    }

    @Transactional
    public Reserva procesarContratoReserva(ReservaRequestDTO dto) {
        Vehiculo v = vRepository.findById(dto.getVehiculoId())
                .orElseThrow(() -> new EntidadNoEncontradaException("Vehículo comercial no localizado."));
        Usuario u = uRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new EntidadNoEncontradaException("Cuenta de usuario inexistente."));

        List<Reserva> existentes = rRepository.findByVehiculoId(dto.getVehiculoId());
        boolean seSolapa = existentes.stream().anyMatch(r -> 
            (dto.getFechaInicio().isBefore(r.getFechaFin()) || dto.getFechaInicio().isEqual(r.getFechaFin())) &&
            (dto.getFechaFin().isAfter(r.getFechaInicio()) || dto.getFechaFin().isEqual(r.getFechaInicio()))
        );

        if (seSolapa) {
            throw new ConflictoCronologicoException("Conflicto Cronológico: El auto ya se encuentra rentado en ese período.");
        }

        Reserva nueva = new Reserva();
        nueva.setFechaInicio(dto.getFechaInicio());
        nueva.setFechaFin(dto.getFechaFin());
        nueva.setTelefonoContacto(dto.getTelefono());
        nueva.setCiudadRetiro(dto.getCiudadRetiro());
        nueva.setVehiculo(v);
        nueva.setUsuario(u);

        return rRepository.save(nueva);
    }
}
