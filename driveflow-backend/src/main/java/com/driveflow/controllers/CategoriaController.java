package com.driveflow.controllers;

import com.driveflow.models.Categoria;
import com.driveflow.repositories.CategoriaRepository;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;

    // Inyección limpia por constructor
    public CategoriaController(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @GetMapping
    public ResponseEntity<List<Categoria>> listarTodas() {
        return ResponseEntity.ok(categoriaRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> crearCategoria(@Valid @RequestBody com.driveflow.dtos.CategoriaRequestDTO dto) {
        if (categoriaRepository.findAll().stream().anyMatch(c -> c.getNombre().equalsIgnoreCase(dto.nombre()))) {
            return ResponseEntity.status(409).body(java.util.Map.of("mensaje", "La categoría '" + dto.nombre() + "' ya existe."));
        }

        com.driveflow.models.Categoria nuevaCat = new com.driveflow.models.Categoria();
        nuevaCat.setNombre(dto.nombre());
        nuevaCat.setDescripcion(dto.descripcion());
        nuevaCat.setUrlImagen(dto.urlImagen());
        nuevaCat.setIcono(dto.icono());

        return new ResponseEntity<>(categoriaRepository.save(nuevaCat), org.springframework.http.HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCategoria(
        @PathVariable Long id, 
        @jakarta.validation.Valid @RequestBody com.driveflow.dtos.CategoriaRequestDTO dto
    ) {
        com.driveflow.models.Categoria existente = categoriaRepository.findById(id)
            .orElseThrow(() -> new com.driveflow.exceptions.RecursoNoEncontradoException("Categoría no encontrada"));

        existente.setNombre(dto.nombre());
        existente.setDescripcion(dto.descripcion());
        existente.setUrlImagen(dto.urlImagen());
        existente.setIcono(dto.icono());

        return ResponseEntity.ok(categoriaRepository.save(existente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCategoria(@PathVariable Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new com.driveflow.exceptions.RecursoNoEncontradoException("Categoría no encontrada");
        }
        try {
            categoriaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (org.springframework.dao.DataIntegrityViolationException ex) {
            return ResponseEntity.status(409).body(java.util.Map.of(
                "mensaje", "No se puede eliminar la categoría porque existen vehículos asociados a ella actualmente."
            ));
        }
    }
}
