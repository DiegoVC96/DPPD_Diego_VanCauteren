package com.driveflow.repositories;

import com.driveflow.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByEmailIgnoreCase(String email);
    java.util.Optional<Usuario> findByEmailIgnoreCase(String email);
    @Modifying
    @Query(value = "INSERT IGNORE INTO usuarios_favoritos (usuario_id, vehiculo_id) VALUES (:usuarioId, :vehiculoId)", nativeQuery = true)
    void insertarFavoritoNativo(@Param("usuarioId") Long usuarioId, @Param("vehiculoId") Long vehiculoId);
    @Modifying
    @Query(value = "DELETE FROM usuarios_favoritos WHERE usuario_id = :usuarioId AND vehiculo_id = :vehiculoId", nativeQuery = true)
    void eliminarFavoritoNativo(@Param("usuarioId") Long usuarioId, @Param("vehiculoId") Long vehiculoId);
    @org.springframework.data.jpa.repository.Query(value = 
    "SELECT v.* FROM vehiculos v INNER JOIN usuarios_favoritos uf ON v.id = uf.vehiculo_id WHERE uf.usuario_id = :usuarioId", 
    nativeQuery = true)
    java.util.List<com.driveflow.models.Vehiculo> obtenerVehiculosFavoritosReales(@Param("usuarioId") Long usuarioId);

}

