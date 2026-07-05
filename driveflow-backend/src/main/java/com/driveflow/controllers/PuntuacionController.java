package com.driveflow.controllers;

import com.driveflow.models.Puntuacion;
import com.driveflow.models.Usuario;
import com.driveflow.models.Vehiculo;
import com.driveflow.repositories.PuntuacionRepository;
import com.driveflow.repositories.UsuarioRepository;
import com.driveflow.repositories.VehiculoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/puntuaciones")
@CrossOrigin(origins = "http://localhost:5173")
public class PuntuacionController {

    private final PuntuacionRepository pRepository;
    private final VehiculoRepository vRepository;
    private final UsuarioRepository uRepository;

    public PuntuacionController(PuntuacionRepository pRepository, VehiculoRepository vRepository, UsuarioRepository uRepository) {
        this.pRepository = pRepository;
        this.vRepository = vRepository;
        this.uRepository = uRepository;
    }

    @GetMapping("/vehiculo/{vehiculoId}")
    public ResponseEntity<List<Puntuacion>> listarPorVehiculo(@PathVariable Long vehiculoId) {
        return ResponseEntity.ok(pRepository.findByVehiculoIdOrderByFechaPublicacionDesc(vehiculoId));
    }

    @PostMapping("/vehiculo/{vehiculoId}/usuario/{usuarioId}")
    public ResponseEntity<?> registrarPuntuacion(
            @PathVariable Long vehiculoId,
            @PathVariable Long usuarioId,
            @RequestBody Map<String, Object> payload
    ) {
        Vehiculo vehiculo = vRepository.findById(vehiculoId).orElseThrow();
        Usuario usuario = uRepository.findById(usuarioId).orElseThrow();

        Puntuacion nueva = new Puntuacion();
        nueva.setEstrellas((Integer) payload.get("estrellas"));
        nueva.setComentario((String) payload.get("comentario"));
        nueva.setFechaPublicacion(LocalDate.now()); 
        nueva.setVehiculo(vehiculo);
        nueva.setUsuario(usuario);

        pRepository.save(nueva);
        return new ResponseEntity<>(Map.of("mensaje", "Reseña publicada."), HttpStatus.CREATED);
    }
}
