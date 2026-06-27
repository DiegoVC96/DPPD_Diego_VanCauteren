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
    
    // 1. FORZADO INTEGRAL DEL ADMINISTRADOR MAESTRO (Elimina el rol de Cliente)
    java.util.Optional<Usuario> adminOpt = usuarioRepository.findByEmailIgnoreCase("admin@driveflow.com");
    
    if (adminOpt.isPresent()) {
        Usuario adminExistente = adminOpt.get();
        // Si por error quedó guardado como cliente, esta línea lo repara de inmediato en XAMPP
        adminExistente.setRol(Rol.ADMINISTRADOR); 
        adminExistente.setPassword(passwordEncoder.encode("admin123")); // Asegura el Hash perfecto
        usuarioRepository.save(adminExistente);
        System.out.println("🔄 Rango del Administrador Maestro verificado y restaurado a ADMINISTRADOR en XAMPP.");
    } else {
        // Si no existía por el TRUNCATE, lo crea de forma limpia
        Usuario nuevoAdmin = new Usuario();
        nuevoAdmin.setNombre("Admin");
        nuevoAdmin.setApellido("Maestro");
        nuevoAdmin.setEmail("admin@driveflow.com");
        nuevoAdmin.setPassword(passwordEncoder.encode("admin123"));
        nuevoAdmin.setRol(Rol.ADMINISTRADOR);
        usuarioRepository.save(nuevoAdmin);
        System.out.println("✅ Administrador Maestro creado nativamente con BCrypt.");
    }

    // 2. Inicialización limpia del Cliente de Pruebas
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
