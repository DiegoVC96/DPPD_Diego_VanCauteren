package com.driveflow.controllers;

import com.driveflow.dtos.UsuarioRequestDTO;
import com.driveflow.models.Rol;
import com.driveflow.models.Usuario;
import com.driveflow.repositories.UsuarioRepository;
import com.driveflow.services.EmailService;
import com.driveflow.services.UsuarioService;
import jakarta.validation.Valid;
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
    public ResponseEntity<Usuario> registrar(@Valid @RequestBody UsuarioRequestDTO dto) {
        Usuario nuevoUsuario = usuarioService.registrarUsuario(dto);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@Valid @RequestBody com.driveflow.dtos.LoginRequestDTO dto) {
        Usuario usuarioAutenticado = usuarioService.autenticarUsuario(dto);
        return ResponseEntity.ok(usuarioAutenticado);
    }

    @GetMapping
    public ResponseEntity<java.util.List<Usuario>> listarTodosLosUsuarios() {
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }

    @PatchMapping("/{id}/cambiar-rol")
    public ResponseEntity<Usuario> cambiarRolUsuario(@PathVariable Long id, @RequestParam Rol nuevoRol) {
        Usuario usuarioActualizado = usuarioService.modificarRol(id, nuevoRol);
        return ResponseEntity.ok(usuarioActualizado);
    }

    @PostMapping("/reenviar-confirmacion")
    public ResponseEntity<java.util.Map<String, String>> reenviarConfirmacion(@RequestParam String email) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email.trim())
            .orElseThrow(() -> new com.driveflow.exceptions.RecursoNoEncontradoException("El correo ingresado no corresponde a un usuario registrado."));
    
        emailService.enviarCorreoConfirmacion(usuario.getNombre(), usuario.getApellido(), usuario.getEmail());
    
        return ResponseEntity.ok(java.util.Map.of("mensaje", "Solicitud procesada. El correo de confirmación ha sido reenviado."));
    }
    
}
