package com.driveflow.services;

import com.driveflow.dtos.LoginRequestDTO;
import com.driveflow.dtos.UsuarioRequestDTO;
import com.driveflow.exceptions.CredencialesInvalidadException;
import com.driveflow.exceptions.NombreDuplicadoException;
import com.driveflow.models.Rol;
import com.driveflow.models.Usuario;
import com.driveflow.repositories.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    private final PasswordEncoder passwordEncoder;

    private final EmailService emailService;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public Usuario registrarUsuario(UsuarioRequestDTO dto) {
        if (usuarioRepository.existsByEmailIgnoreCase(dto.email())) {
            throw new NombreDuplicadoException("El correo electrónico '" + dto.email() + "' ya está registrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(dto.nombre());
        usuario.setApellido(dto.apellido());
        usuario.setEmail(dto.email());
        usuario.setPassword(passwordEncoder.encode(dto.password()));

        Usuario guardado = usuarioRepository.save(usuario);

        // REQUERIMIENTO: El correo electrónico de confirmación se envía inmediatamente después del éxito
        emailService.enviarCorreoConfirmacion(guardado.getNombre(), guardado.getApellido(), guardado.getEmail());

        return guardado;
    }

    @Transactional(readOnly = true)
    public Usuario autenticarUsuario(LoginRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(dto.email())
                .orElseThrow(() -> new CredencialesInvalidadException("El correo electrónico o la contraseña son incorrectos."));

        if (!passwordEncoder.matches(dto.password(), usuario.getPassword())) {
            throw new CredencialesInvalidadException("El correo electrónico o la contraseña son incorrectos.");
        }

        return usuario;
    }

    @Transactional(readOnly = true)
    public java.util.List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    @Transactional
    public Usuario modificarRol(Long id, Rol nuevoRol) {
        Usuario usuarioDestino = usuarioRepository.findById(id)
            .orElseThrow(() -> new com.driveflow.exceptions.RecursoNoEncontradoException("Usuario no encontrado"));

        if (usuarioDestino.getId() == 1L || usuarioDestino.getEmail().equalsIgnoreCase("admin@driveflow.com")) {
            throw new IllegalArgumentException("Operación denegada: Las cuentas de administración raíz no pueden revocar sus propios privilegios.");
        }
    
        usuarioDestino.setRol(nuevoRol);
        return usuarioRepository.save(usuarioDestino);
    }

}
