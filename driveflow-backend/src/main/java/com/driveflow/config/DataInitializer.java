package com.driveflow.config;

import com.driveflow.models.Rol;
import com.driveflow.models.Usuario;
import com.driveflow.repositories.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
    
        java.util.Optional<Usuario> adminOpt = usuarioRepository.findByEmailIgnoreCase("admin@driveflow.com");
    
        if (adminOpt.isPresent()) {
            Usuario adminExistente = adminOpt.get();
            adminExistente.setRol(Rol.ADMINISTRADOR); 
            adminExistente.setPassword(passwordEncoder.encode("admin123")); 
            usuarioRepository.save(adminExistente);
            System.out.println("🔄 Rango del Administrador Maestro verificado y restaurado a ADMINISTRADOR en XAMPP.");
        } else {
            Usuario nuevoAdmin = new Usuario();
            nuevoAdmin.setNombre("Admin");
            nuevoAdmin.setApellido("Maestro");
            nuevoAdmin.setEmail("admin@driveflow.com");
            nuevoAdmin.setPassword(passwordEncoder.encode("admin123"));
            nuevoAdmin.setRol(Rol.ADMINISTRADOR);
            usuarioRepository.save(nuevoAdmin);
            System.out.println("✅ Administrador Maestro creado nativamente con BCrypt.");
        }

        if (!usuarioRepository.existsByEmailIgnoreCase("carlos@ejemplo.com")) {
            Usuario cliente = new Usuario();
            cliente.setNombre("Carlos");
            cliente.setApellido("Gómez");
            cliente.setEmail("carlos@ejemplo.com");
            cliente.setPassword(passwordEncoder.encode("user123"));
            cliente.setRol(Rol.CLIENTE);
            usuarioRepository.save(cliente);
        }
    }
}
