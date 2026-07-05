package com.driveflow.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vehiculos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // unique = true delega la restricción también a nivel de base de datos
    @Column(nullable = false, unique = true, length = 100)
    private String nombre;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false, name = "precio_por_dia")
    private BigDecimal precioPorDia;

    // Relación uno a muchos para soportar una o más imágenes por producto
    @ElementCollection
    @CollectionTable(name = "vehiculo_imagenes", joinColumns = @JoinColumn(name = "vehiculo_id"))
    @Column(name = "url_imagen", nullable = false, columnDefinition = "TEXT")
    private List<String> imagenes = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = true) 
    private Categoria categoria;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "vehiculo_caracteristicas",
        joinColumns = @JoinColumn(name = "vehiculo_id"),
        inverseJoinColumns = @JoinColumn(name = "caracteristica_id")
    )
    private List<Caracteristica> caracteristicas = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "vehiculo", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private java.util.List<Politica> politicas = new java.util.ArrayList<>();

}
