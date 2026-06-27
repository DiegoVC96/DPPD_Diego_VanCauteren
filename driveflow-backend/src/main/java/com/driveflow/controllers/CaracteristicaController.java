package com.driveflow.controllers;

import com.driveflow.models.Caracteristica;
import com.driveflow.repositories.CaracteristicaRepository;
import com.driveflow.exceptions.NombreDuplicadoException;
import com.driveflow.exceptions.RecursoNoEncontradoException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/caracteristicas")
@CrossOrigin(origins = "http://localhost:5173")
public class CaracteristicaController {

    private final CaracteristicaRepository caracteristicaRepository;

    public CaracteristicaController(CaracteristicaRepository caracteristicaRepository) {
        this.caracteristicaRepository = caracteristicaRepository;
    }

    @GetMapping
    public ResponseEntity<List<Caracteristica>> listarTodas() {
        return ResponseEntity.ok(caracteristicaRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Caracteristica> crear(@Valid @RequestBody Caracteristica caracteristica) {
        if (caracteristicaRepository.existsByNombreIgnoreCase(caracteristica.getNombre())) {
            throw new NombreDuplicadoException("La característica '" + caracteristica.getNombre() + "' ya existe.");
        }
        return new ResponseEntity<>(caracteristicaRepository.save(caracteristica), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Caracteristica> actualizar(@PathVariable Long id, @Valid @RequestBody Caracteristica datos) {
        Caracteristica existente = caracteristicaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Característica no encontrada"));
        existente.setNombre(datos.getNombre());
        existente.setUrlImagen(datos.getUrlImagen());
        return ResponseEntity.ok(caracteristicaRepository.save(existente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!caracteristicaRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Característica no encontrada");
        }
        caracteristicaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
