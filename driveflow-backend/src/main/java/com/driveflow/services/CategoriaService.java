package com.driveflow.services;

import com.driveflow.dtos.CategoriaRequestDTO;
import com.driveflow.exceptions.NombreDuplicadoException;
import com.driveflow.exceptions.RecursoNoEncontradoException;
import com.driveflow.models.Categoria;
import com.driveflow.repositories.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public List<Categoria> obtenerTodasLasCategorias() {
        return categoriaRepository.findAll();
    }

    @Transactional
    public Categoria registrarCategoria(CategoriaRequestDTO dto) {
        if (categoriaRepository.findAll().stream().anyMatch(c -> c.getNombre().equalsIgnoreCase(dto.nombre()))) {
            throw new NombreDuplicadoException("La categoría '" + dto.nombre() + "' ya se encuentra registrada.");
        }
        Categoria nueva = new Categoria();
        nueva.setNombre(dto.nombre());
        nueva.setDescripcion(dto.descripcion());
        nueva.setUrlImagen(dto.urlImagen());
        nueva.setIcono(dto.icono());
        return categoriaRepository.save(nueva);
    }

    @Transactional
    public Categoria modificarCategoria(Long id, CategoriaRequestDTO dto) {
        Categoria existente = categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoría no encontrada con el ID: " + id));
        existente.setNombre(dto.nombre());
        existente.setDescripcion(dto.descripcion());
        existente.setUrlImagen(dto.urlImagen());
        existente.setIcono(dto.icono());
        return categoriaRepository.save(existente);
    }

    @Transactional
    public void darDeBajaCategoria(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Categoría no encontrada con el ID: " + id);
        }
        categoriaRepository.deleteById(id);
    }
}
