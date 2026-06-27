package com.driveflow.repositories;

import com.driveflow.models.Caracteristica;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaracteristicaRepository extends JpaRepository<Caracteristica, Long> {
    boolean existsByNombreIgnoreCase(String nombre);
}
