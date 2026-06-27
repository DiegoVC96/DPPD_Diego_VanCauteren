package com.driveflow.repositories;

import com.driveflow.models.Vehiculo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {
    boolean existsByNombreIgnoreCase(String nombre);
    Page<Vehiculo> findByCategoriaIdIn(List<Long> categoriaIds, Pageable pageable);
}
