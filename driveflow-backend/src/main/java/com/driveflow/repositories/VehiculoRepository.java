package com.driveflow.repositories;

import com.driveflow.models.Vehiculo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {
    boolean existsByNombreIgnoreCase(String nombre);
    Page<Vehiculo> findByCategoriaIdIn(List<Long> categoriaIds, Pageable pageable);
    @Query(value = "SELECT * FROM vehiculos ORDER BY RAND()", nativeQuery = true)
    Page<Vehiculo> findAllAleatoriosPaginados(Pageable pageable);
}
