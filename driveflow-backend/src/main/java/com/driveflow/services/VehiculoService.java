package com.driveflow.services;

import com.driveflow.dtos.VehiculoRequestDTO;
import com.driveflow.exceptions.NombreDuplicadoException;
import com.driveflow.exceptions.RecursoNoEncontradoException;
import com.driveflow.models.Caracteristica;
import com.driveflow.models.Categoria;
import com.driveflow.models.Vehiculo;
import com.driveflow.repositories.CaracteristicaRepository;
import com.driveflow.repositories.CategoriaRepository;
import com.driveflow.repositories.VehiculoRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VehiculoService {

    private final CaracteristicaRepository caracteristicaRepository;

    private final VehiculoRepository vehiculoRepository;

    private final CategoriaRepository categoriaRepository;

    public VehiculoService(VehiculoRepository vehiculoRepository, CategoriaRepository categoriaRepository, CaracteristicaRepository caracteristicaRepository) {
        this.vehiculoRepository = vehiculoRepository;
        this.categoriaRepository = categoriaRepository;
        this.caracteristicaRepository = caracteristicaRepository;
    }

    @Transactional
    public Vehiculo actualizar(Long id, VehiculoRequestDTO dto) {
        // Verificar si el auto existe
        Vehiculo vehiculoExistente = vehiculoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se puede editar: El vehículo con ID " + id + " no existe."));

        // Si cambia el nombre, validar que el nuevo nombre no esté duplicado
        if (!vehiculoExistente.getNombre().equalsIgnoreCase(dto.nombre()) &&
            vehiculoRepository.existsByNombreIgnoreCase(dto.nombre())) {
            throw new NombreDuplicadoException("El nombre '" + dto.nombre() + "' ya está siendo utilizado por otro vehículo.");
        }

        if (dto.categoriaId() != null) {
            Categoria cat = categoriaRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new RecursoNoEncontradoException("La categoría especificada no existe."));
            vehiculoExistente.setCategoria(cat);
        }

        if (dto.caracteristicasIds() != null) {
            List<Caracteristica> lista = caracteristicaRepository.findAllById(dto.caracteristicasIds());
            vehiculoExistente.setCaracteristicas(lista);
        }

        // Modificar la entidad JPA
        vehiculoExistente.setNombre(dto.nombre());
        vehiculoExistente.setDescripcion(dto.descripcion());
        vehiculoExistente.setPrecioPorDia(dto.precioPorDia());
        vehiculoExistente.setImagenes(dto.imagenes());

        // Guardar cambios
        return vehiculoRepository.save(vehiculoExistente);
    }

    @Transactional
    public void eliminarPorId(Long id) {
        // Validación de existencia antes de borrar
        if (!vehiculoRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("No se puede eliminar: El vehículo con ID " + id + " no existe.");
        }
        vehiculoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<Vehiculo> obtenerVehiculosPaginadosFiltrados(List<Long> categoriaIds, Pageable pageable, boolean esAdmin) {
        if (categoriaIds != null && !categoriaIds.isEmpty()) {
            return vehiculoRepository.findByCategoriaIdIn(categoriaIds, pageable);
        }
    
        if (esAdmin) {
            return vehiculoRepository.findAll(pageable);
        }
    
        return vehiculoRepository.findAllAleatoriosPaginados(pageable);
    }

    @Transactional(readOnly = true)
    public Vehiculo buscarPorId(Long id) {
        return vehiculoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("El vehículo con ID " + id + " no existe."));
    }

    @Transactional
    public Vehiculo registrarVehiculo(VehiculoRequestDTO dto) {
        // Validación de negocio solicitada en la User Story #3
        if (vehiculoRepository.existsByNombreIgnoreCase(dto.nombre())) {
            throw new NombreDuplicadoException("El nombre del vehículo '" + dto.nombre() + "' ya está en uso.");
        }

        Vehiculo vehiculo = new Vehiculo();
        if (dto.categoriaId() != null) {
            Categoria cat = categoriaRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new RecursoNoEncontradoException("La categoría especificada no existe."));
            vehiculo.setCategoria(cat);
        }

        if (dto.caracteristicasIds() != null) {
            List<Caracteristica> lista = caracteristicaRepository.findAllById(dto.caracteristicasIds());
            vehiculo.setCaracteristicas(lista);
        }

        vehiculo.setNombre(dto.nombre());
        vehiculo.setDescripcion(dto.descripcion());
        vehiculo.setPrecioPorDia(dto.precioPorDia());
        vehiculo.setImagenes(dto.imagenes());

        return vehiculoRepository.save(vehiculo);
    }
}
