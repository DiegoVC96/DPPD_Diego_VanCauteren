package com.driveflow.controllers;

import com.driveflow.models.Reserva;
import com.driveflow.repositories.ReservaRepository;
import com.driveflow.repositories.UsuarioRepository;
import com.driveflow.repositories.VehiculoRepository;
import com.driveflow.services.ReservaService;
import com.driveflow.services.EmailReservaService;

import org.springframework.http.HttpStatus;
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
    private final UsuarioRepository uRepository;
    private final VehiculoRepository vRepository;
    private final ReservaService rService;
    private final EmailReservaService emailReservaService;

    public ReservaController(ReservaRepository rRepository, UsuarioRepository uRepository, VehiculoRepository vRepository, ReservaService rService, EmailReservaService emailReservaService) {
        this.rRepository = rRepository;
        this.uRepository = uRepository;
        this.vRepository = vRepository;
        this.rService = rService;
        this.emailReservaService = emailReservaService;
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

    @PostMapping
    public ResponseEntity<?> registrarNuevaReserva(@RequestBody java.util.Map<String, Object> payload) {
        try {
            com.driveflow.models.Reserva nueva = new com.driveflow.models.Reserva();
            nueva.setFechaInicio(java.time.LocalDate.parse((String) payload.get("fechaInicio")));
            nueva.setFechaFin(java.time.LocalDate.parse((String) payload.get("fechaFin")));
            nueva.setTelefonoContacto((String) payload.get("telefono"));
            nueva.setCiudadRetiro((String) payload.get("ciudadRetiro"));
        
            com.driveflow.models.Vehiculo v = vRepository.findById(Long.valueOf((Integer) payload.get("vehiculoId"))).orElseThrow();
            com.driveflow.models.Usuario u = uRepository.findById(Long.valueOf((Integer) payload.get("usuarioId"))).orElseThrow();
    
            nueva.setVehiculo(v);
            nueva.setUsuario(u);
        
            com.driveflow.models.Reserva reservaGuardada = rService.registrarContratoReserva(nueva);
        
            emailReservaService.enviarCorreoConfirmacionReserva(reservaGuardada);
        
            return ResponseEntity.status(HttpStatus.CREATED).body(java.util.Map.of("mensaje", "Reserva confirmada de forma exitosa."));
        
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("mensaje", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(java.util.Map.of("mensaje", "No se pudo procesar la transacción local."));
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<java.util.List<com.driveflow.models.Reserva>> listarHistorialUsuario(
        @PathVariable Long usuarioId,
        @RequestHeader("Authorization") String authHeader
    ) {
        return ResponseEntity.ok(rRepository.findByUsuarioIdOrderByFechaInicioDesc(usuarioId));
    }
}
