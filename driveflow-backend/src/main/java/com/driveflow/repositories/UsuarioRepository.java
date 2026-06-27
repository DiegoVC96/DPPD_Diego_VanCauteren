package com.driveflow.repositories;

import com.driveflow.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByEmailIgnoreCase(String email);

    java.util.Optional<Usuario> findByEmailIgnoreCase(String email);
}
