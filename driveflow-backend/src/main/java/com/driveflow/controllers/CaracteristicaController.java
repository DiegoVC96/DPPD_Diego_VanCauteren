package com.driveflow.controllers;

import com.driveflow.dtos.CaracteristicaRequestDTO;
import com.driveflow.models.Caracteristica;
import com.driveflow.services.CaracteristicaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/caracteristicas")
@CrossOrigin(origins = "http://localhost:5173")
public class CaracteristicaController {

    private final CaracteristicaService caracteristicaService;

    public CaracteristicaController(CaracteristicaService caracteristicaService) {
        this.caracteristicaService = caracteristicaService;
    }

    @GetMapping
    public ResponseEntity<List<Caracteristica>> listarTodas() {
        return ResponseEntity.ok(caracteristicaService.obtenerTodasLasCaracteristicas());
    }

    @PostMapping
    public ResponseEntity<Caracteristica> crear(@Valid @RequestBody CaracteristicaRequestDTO dto) {
        return new ResponseEntity<>(caracteristicaService.registrarCaracteristica(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Caracteristica> actualizar(@PathVariable Long id, @Valid @RequestBody CaracteristicaRequestDTO dto) {
        return ResponseEntity.ok(caracteristicaService.modificarCaracteristica(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        caracteristicaService.darDeBajaCaracteristica(id);
        return ResponseEntity.noContent().build();
    }
}