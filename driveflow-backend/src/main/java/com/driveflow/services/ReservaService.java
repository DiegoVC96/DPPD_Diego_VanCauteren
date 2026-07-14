package com.driveflow.services;

import com.driveflow.models.Reserva;
import com.driveflow.repositories.ReservaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;

    public ReservaService(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    @Transactional
    public Reserva registrarContratoReserva(Reserva nueva) {
        List<Reserva> existentes = reservaRepository.findByVehiculoId(nueva.getVehiculo().getId());

        boolean seSolapa = existentes.stream().anyMatch(r -> 
            (nueva.getFechaInicio().isBefore(r.getFechaFin()) || nueva.getFechaInicio().isEqual(r.getFechaFin())) &&
            (nueva.getFechaFin().isAfter(r.getFechaInicio()) || nueva.getFechaFin().isEqual(r.getFechaInicio()))
        );

        if (seSolapa) {
            throw new IllegalArgumentException("Conflicto Cronológico: El vehículo ya se encuentra alquilado en el rango de fechas seleccionado. Por favor, escoja otro período en el calendario.");
        }

        return reservaRepository.save(nueva);
    }
}
