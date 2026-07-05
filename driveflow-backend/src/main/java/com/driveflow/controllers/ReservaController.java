package com.driveflow.controllers;

import com.driveflow.models.Reserva;
import com.driveflow.repositories.ReservaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservaController {

    private final ReservaRepository rRepository;

    public ReservaController(ReservaRepository rRepository) {
        this.rRepository = rRepository;
    }

    @GetMapping("/ocupadas/{vehiculoId}")
    public ResponseEntity<List<String>> obtenerFechasOcupadas(@PathVariable Long vehiculoId) {
        List<Reserva> reservas = rRepository.findByVehiculoId(vehiculoId);
        List<String> fechasBloqueadas = new ArrayList<>();

        for (Reserva res : reservas) {
            LocalDate actual = res.getFechaInicio();
            LocalDate fin = res.getFechaFin();
            while (!actual.isAfter(fin)) {
                fechasBloqueadas.add(actual.toString());
                actual = actual.plusDays(1);
            }
        }
        return ResponseEntity.ok(fechasBloqueadas);
    }
}
