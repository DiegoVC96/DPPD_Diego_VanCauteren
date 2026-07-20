package com.driveflow.controllers;

import com.driveflow.dtos.PuntuacionRequestDTO;
import com.driveflow.models.Puntuacion;
import com.driveflow.services.PuntuacionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/puntuaciones")
@CrossOrigin(origins = "http://localhost:5173")
public class PuntuacionController {

    private final PuntuacionService pService;

    public PuntuacionController(PuntuacionService pService) {
        this.pService = pService;
    }

    @GetMapping("/vehiculo/{vehiculoId}")
    public ResponseEntity<List<Puntuacion>> listarPorVehiculo(@PathVariable Long vehiculoId) {
        return ResponseEntity.ok(pService.obtenerPorVehiculo(vehiculoId));
    }

    @PostMapping("/vehiculo/{vehiculoId}/usuario/{usuarioId}")
    public ResponseEntity<?> registrar(@PathVariable Long vehiculoId, @PathVariable Long usuarioId, @RequestBody PuntuacionRequestDTO dto) {
        pService.registrarReseña(vehiculoId, usuarioId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("mensaje", "Reseña publicada con éxito."));
    }
}
