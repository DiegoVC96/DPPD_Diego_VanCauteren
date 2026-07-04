package com.driveflow.services;

import com.driveflow.dtos.CaracteristicaRequestDTO;
import com.driveflow.exceptions.NombreDuplicadoException;
import com.driveflow.exceptions.RecursoNoEncontradoException;
import com.driveflow.models.Caracteristica;
import com.driveflow.repositories.CaracteristicaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CaracteristicaService {

    private final CaracteristicaRepository caracteristicaRepository;

    public CaracteristicaService(CaracteristicaRepository caracteristicaRepository) {
        this.caracteristicaRepository = caracteristicaRepository;
    }

    @Transactional(readOnly = true)
    public List<Caracteristica> obtenerTodasLasCaracteristicas() {
        return caracteristicaRepository.findAll();
    }

    @Transactional
    public Caracteristica registrarCaracteristica(CaracteristicaRequestDTO dto) {
        if (caracteristicaRepository.findAll().stream().anyMatch(c -> c.getNombre().equalsIgnoreCase(dto.nombre()))) {
            throw new NombreDuplicadoException("La caracteristica '" + dto.nombre() + "' ya se encuentra registrada.");
        }
        Caracteristica nueva = new Caracteristica();
        nueva.setNombre(dto.nombre());
        nueva.setUrlImagen(dto.urlImagen());
        return caracteristicaRepository.save(nueva);
    }

    @Transactional
    public Caracteristica modificarCaracteristica(Long id, CaracteristicaRequestDTO dto) {
        Caracteristica existente = caracteristicaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Caracteristica no encontrada con el ID: " + id));
        existente.setNombre(dto.nombre());
        existente.setUrlImagen(dto.urlImagen());
        return caracteristicaRepository.save(existente);
    }

    @Transactional
    public void darDeBajaCaracteristica(Long id) {
        if (!caracteristicaRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Caracteristica no encontrada con el ID: " + id);
        }
        caracteristicaRepository.deleteById(id);
    }
}
