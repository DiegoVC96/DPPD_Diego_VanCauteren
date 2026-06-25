package com.driveflow.controllers;

import com.driveflow.dtos.VehiculoRequestDTO;
import com.driveflow.models.Vehiculo;
import com.driveflow.services.VehiculoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/vehiculos")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class VehiculoController {

    private final VehiculoService vehiculoService;

    public VehiculoController(VehiculoService vehiculoService) {
        this.vehiculoService = vehiculoService;
    }

    // Endpoint para la User Story Bonus #1
    @PutMapping("/{id}")
    public ResponseEntity<Vehiculo> actualizarVehiculo(
            @PathVariable Long id, 
            @Valid @RequestBody VehiculoRequestDTO dto
    ) {
        Vehiculo vehiculoActualizado = vehiculoService.actualizar(id, dto);
        return ResponseEntity.ok(vehiculoActualizado);
    }

    // Endpoint para la User Story #11
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarVehiculo(@PathVariable Long id) {
        vehiculoService.eliminarPorId(id);
        return ResponseEntity.noContent().build(); // Retorna un estado HTTP 244 (No Content)
    }

    // Endpoint para la User Story #5
    @GetMapping("/{id}")
    public ResponseEntity<Vehiculo> obtenerVehiculoPorId(@PathVariable Long id) {
        Vehiculo vehiculo = vehiculoService.buscarPorId(id);
        return ResponseEntity.ok(vehiculo);
    }

    // Endpoint de la US #4 actualizado para soportar la US #8 (Paginación)
    @GetMapping("/paginados")
    public ResponseEntity<Page<Vehiculo>> listarVehiculosPaginados(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Vehiculo> resultado = vehiculoService.obtenerVehiculosPaginados(pageable);
        return ResponseEntity.ok(resultado);
    }

    @PostMapping
    public ResponseEntity<Vehiculo> crearVehiculo(@Valid @RequestBody VehiculoRequestDTO dto) {
        Vehiculo nuevoVehiculo = vehiculoService.registrarVehiculo(dto);
        return new ResponseEntity<>(nuevoVehiculo, HttpStatus.CREATED);
    }
}
