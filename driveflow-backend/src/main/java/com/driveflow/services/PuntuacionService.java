package com.driveflow.services;

import com.driveflow.dtos.PuntuacionRequestDTO;
import com.driveflow.exceptions.EntidadNoEncontradaException;
import com.driveflow.models.Puntuacion;
import com.driveflow.models.Usuario;
import com.driveflow.models.Vehiculo;
import com.driveflow.repositories.PuntuacionRepository;
import com.driveflow.repositories.UsuarioRepository;
import com.driveflow.repositories.VehiculoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class PuntuacionService {

    private final PuntuacionRepository pRepository;
    private final VehiculoRepository vRepository;
    private final UsuarioRepository uRepository;

    public PuntuacionService(PuntuacionRepository pRepository, VehiculoRepository vRepository, UsuarioRepository uRepository) {
        this.pRepository = pRepository;
        this.vRepository = vRepository;
        this.uRepository = uRepository;
    }

    @Transactional(readOnly = true)
    public List<Puntuacion> obtenerPorVehiculo(Long vehiculoId) {
        return pRepository.findByVehiculoIdOrderByFechaPublicacionDesc(vehiculoId);
    }

    @Transactional
    public Puntuacion registrarReseña(Long vehiculoId, Long usuarioId, PuntuacionRequestDTO dto) {
        Vehiculo v = vRepository.findById(vehiculoId).orElseThrow(() -> new EntidadNoEncontradaException("Vehículo no hallado."));
        Usuario u = uRepository.findById(usuarioId).orElseThrow(() -> new EntidadNoEncontradaException("Usuario no hallado."));

        Puntuacion nueva = new Puntuacion();
        nueva.setEstrellas(dto.getEstrellas());
        nueva.setComentario(dto.getComentario());
        nueva.setFechaPublicacion(LocalDate.now());
        nueva.setVehiculo(v);
        nueva.setUsuario(u);

        return pRepository.save(nueva);
    }
}
