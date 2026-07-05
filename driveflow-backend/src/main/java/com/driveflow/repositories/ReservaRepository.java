package com.driveflow.repositories;

import com.driveflow.models.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByVehiculoId(Long vehiculoId);
}
