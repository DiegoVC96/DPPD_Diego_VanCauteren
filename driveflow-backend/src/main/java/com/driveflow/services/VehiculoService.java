package com.driveflow.services;

import com.driveflow.dtos.VehiculoRequestDTO;
import com.driveflow.exceptions.NombreDuplicadoException;
import com.driveflow.exceptions.RecursoNoEncontradoException;
import com.driveflow.models.Vehiculo;
import com.driveflow.repositories.VehiculoRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

@Service
public class VehiculoService {

    private final VehiculoRepository vehiculoRepository;

    public VehiculoService(VehiculoRepository vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }

    @Transactional
    public Vehiculo actualizar(Long id, VehiculoRequestDTO dto) {
        // 1. Verificar si el auto existe
        Vehiculo vehiculoExistente = vehiculoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se puede editar: El vehículo con ID " + id + " no existe."));

        // 2. Si cambia el nombre, validar que el nuevo nombre no esté duplicado
        if (!vehiculoExistente.getNombre().equalsIgnoreCase(dto.nombre()) && 
            vehiculoRepository.existsByNombreIgnoreCase(dto.nombre())) {
            throw new NombreDuplicadoException("El nombre '" + dto.nombre() + "' ya está siendo utilizado por otro vehículo.");
        }

        // 3. Modificar la entidad JPA
        vehiculoExistente.setNombre(dto.nombre());
        vehiculoExistente.setDescripcion(dto.descripcion());
        vehiculoExistente.setPrecioPorDia(dto.precioPorDia());
        vehiculoExistente.setImagenes(dto.imagenes());

        // 4. Guardar cambios en XAMPP
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
    public Page<Vehiculo> obtenerVehiculosPaginados(Pageable pageable) {
        // Ejecuta una consulta paginada eficiente en la base de datos de XAMPP
        Page<Vehiculo> paginaResultado = vehiculoRepository.findAll(pageable);
        
        // Convertimos el contenido a una lista mutable para poder desordenarla aleatoriamente
        List<Vehiculo> contenidoAleatorio = new ArrayList<>(paginaResultado.getContent());
        Collections.shuffle(contenidoAleatorio);
        
        // Retornamos un nuevo objeto Page con los datos barajados pero manteniendo los metadatos correctos
        return new PageImpl<>(
                contenidoAleatorio, 
                pageable, 
                paginaResultado.getTotalElements()
        );
    }

    @Transactional(readOnly = true)
    public Vehiculo buscarPorId(Long id) {
        return vehiculoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("El vehículo con ID " + id + " no existe."));
    }

    @Transactional(readOnly = true)
    public List<Vehiculo> obtenerVehiculosAleatoriosHome() {
        List<Vehiculo> todos = vehiculoRepository.findAll();
        
        // 1. Garantiza aleatoriedad impredecible mezclando en memoria
        Collections.shuffle(todos);
        
        // 2. Extrae como máximo 10 elementos únicos (sin repetir)
        int limite = Math.min(todos.size(), 10);
        return todos.subList(0, limite);
    }

    @Transactional
    public Vehiculo registrarVehiculo(VehiculoRequestDTO dto) {
        // Validación de negocio solicitada en la User Story #3
        if (vehiculoRepository.existsByNombreIgnoreCase(dto.nombre())) {
            throw new NombreDuplicadoException("El nombre del vehículo '" + dto.nombre() + "' ya está en uso.");
        }

        Vehiculo vehiculo = new Vehiculo();
        vehiculo.setNombre(dto.nombre());
        vehiculo.setDescripcion(dto.descripcion());
        vehiculo.setPrecioPorDia(dto.precioPorDia());
        vehiculo.setImagenes(dto.imagenes());

        return vehiculoRepository.save(vehiculo);
    }
}
