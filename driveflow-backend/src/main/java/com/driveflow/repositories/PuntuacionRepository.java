package com.driveflow.repositories;

import com.driveflow.models.Puntuacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PuntuacionRepository extends JpaRepository<Puntuacion, Long> {
    List<Puntuacion> findByVehiculoIdOrderByFechaPublicacionDesc(Long vehiculoId);
}
