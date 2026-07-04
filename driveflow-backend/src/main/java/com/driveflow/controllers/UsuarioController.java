package com.driveflow.controllers;

import com.driveflow.dtos.LoginRequestDTO;
import com.driveflow.dtos.UsuarioRequestDTO;
import com.driveflow.dtos.UsuarioResponseDTO;
import com.driveflow.models.Usuario;
import com.driveflow.repositories.UsuarioRepository;
import com.driveflow.services.EmailService;
import com.driveflow.services.UsuarioService;
import jakarta.validation.Valid;

import java.util.stream.Collectors;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;

    public UsuarioController(UsuarioService usuarioService, UsuarioRepository usuarioRepository, EmailService emailService) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }

    @PostMapping("/registro")
    public ResponseEntity<UsuarioResponseDTO> registrar(@Valid @RequestBody UsuarioRequestDTO dto) {
        Usuario usuario = usuarioService.registrarUsuario(dto);
        UsuarioResponseDTO respuesta = new UsuarioResponseDTO(
            usuario.getId(), usuario.getNombre(), usuario.getApellido(), usuario.getEmail(), usuario.getRol()
        );
        return new ResponseEntity<>(respuesta, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        Usuario usuario = usuarioService.autenticarUsuario(dto);
        UsuarioResponseDTO respuesta = new UsuarioResponseDTO(
            usuario.getId(), usuario.getNombre(), usuario.getApellido(), usuario.getEmail(), usuario.getRol()
        );
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodosLosUsuarios() {
        List<UsuarioResponseDTO> lista = usuarioService.obtenerTodos().stream()
                .map(u -> new UsuarioResponseDTO(u.getId(), u.getNombre(), u.getApellido(), u.getEmail(), u.getRol()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @PatchMapping("/{id}/cambiar-rol")
    public ResponseEntity<UsuarioResponseDTO> cambiarRolUsuario(@PathVariable Long id, @RequestParam com.driveflow.models.Rol nuevoRol) {
        Usuario usuario = usuarioService.modificarRol(id, nuevoRol);
        UsuarioResponseDTO respuesta = new UsuarioResponseDTO(
            usuario.getId(), usuario.getNombre(), usuario.getApellido(), usuario.getEmail(), usuario.getRol()
        );
        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/reenviar-confirmacion")
    public ResponseEntity<java.util.Map<String, String>> reenviarConfirmacion(@RequestParam String email) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email.trim())
            .orElseThrow(() -> new com.driveflow.exceptions.RecursoNoEncontradoException("El correo ingresado no corresponde a un usuario registrado."));
    
        emailService.enviarCorreoConfirmacion(usuario.getNombre(), usuario.getApellido(), usuario.getEmail());
    
        return ResponseEntity.ok(java.util.Map.of("mensaje", "Solicitud procesada. El correo de confirmación ha sido reenviado."));
    }
    
}
