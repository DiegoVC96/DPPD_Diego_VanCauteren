package com.driveflow.repositories;

import com.driveflow.models.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {
    // Consulta optimizada para verificar existencia sin traer todo el objeto
    boolean existsByNombreIgnoreCase(String nombre);
}
