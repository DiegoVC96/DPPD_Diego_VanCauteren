package com.driveflow.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "puntuaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Puntuacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int estrellas; 

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "fecha_publicacion", nullable = false)
    private LocalDate fechaPublicacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehiculo_id", nullable = false)
    @JsonBackReference
    private Vehiculo vehiculo;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
}
