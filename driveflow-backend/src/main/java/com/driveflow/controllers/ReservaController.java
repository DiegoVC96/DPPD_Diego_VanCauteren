package com.driveflow.controllers;

import com.driveflow.dtos.ReservaRequestDTO;
import com.driveflow.models.Reserva;
import com.driveflow.services.ReservaService;
import com.driveflow.services.EmailReservaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservaController {

    private final ReservaService rService;
    private final EmailReservaService emailService;

    public ReservaController(ReservaService rService, EmailReservaService emailService) {
        this.rService = rService;
        this.emailService = emailService;
    }

    @GetMapping("/ocupadas/{vehiculoId}")
    public ResponseEntity<List<String>> obtenerFechasOcupadas(@PathVariable Long vehiculoId) {
        return ResponseEntity.ok(rService.obtenerFechasOcupadas(vehiculoId));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Reserva>> listarHistorial(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(rService.obtenerPorUsuario(usuarioId));
    }

    @PostMapping
    public ResponseEntity<?> registrarReserva(@RequestBody ReservaRequestDTO dto) {
        Reserva guardada = rService.procesarContratoReserva(dto);
        emailService.enviarCorreoConfirmacionReserva(guardada); // Despacho asíncrono US #35
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("mensaje", "Reserva confirmada de forma exitosa."));
    }
}
