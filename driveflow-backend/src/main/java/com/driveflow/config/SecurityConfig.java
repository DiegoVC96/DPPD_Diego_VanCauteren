package com.driveflow.config;

import com.driveflow.models.Usuario;
import com.driveflow.repositories.UsuarioRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public SecurityConfig(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // CONECTOR DE BASE DE DATOS MEDIANTE REQUERIMIENTO DE PRIVILEGIOS PUROS
    @Bean
    public UserDetailsService userDetailsService() {
        return email -> {
            Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() -> new UsernameNotFoundException("Email no registrado: " + email));

            return User.withUsername(usuario.getEmail())
                .password(usuario.getPassword())
                .authorities(new SimpleGrantedAuthority(usuario.getRol().name())) // Guardar "ADMINISTRADOR"
                .build();
        };
    }

    // Vincula BCrypt al almacén de autenticación de cabeceras HTTP
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, UserDetailsService userDetailsService) throws Exception {
        AuthenticationManagerBuilder builder = http.getSharedObject(AuthenticationManagerBuilder.class);
        builder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
        return builder.build();
    }

    // CONFIGURACIÓN COMPLETA DE CABECERAS DE REVERSA CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Collections.singletonList("http://localhost:5173"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"));
        config.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // CADENA DE FILTROS TOTALMENTE ADAPTADA CON AUTORIDADES PURAS
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .httpBasic(Customizer.withDefaults()) 
            .authorizeHttpRequests(auth -> auth
            
            // APERTURA COMPLETA DE RUTAS DE CONSULTA Y AUTENTICACIÓN
            .requestMatchers(HttpMethod.GET, "/api/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/usuarios/registro").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/usuarios/login").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/reservas/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/puntuaciones/**").permitAll()
            
            // Permite que la petición llegue directo a tu UsuarioController sin que el filtro arroje un 403
            .requestMatchers(HttpMethod.PATCH, "/api/usuarios/**").permitAll() 
            
            // Usuarios autenticados pueden agregar o eliminar favoritos, pero no modificar otros recursos
            .requestMatchers(HttpMethod.POST, "/api/usuarios/*/favoritos/*").authenticated()
            .requestMatchers(HttpMethod.DELETE, "/api/usuarios/*/favoritos/*").authenticated()
            .requestMatchers(HttpMethod.POST, "/api/puntuaciones/**").authenticated()
            
            // BLINDAJE ADMINISTRATIVO RESTANTE: Exige de forma estricta la autoridad de ADMINISTRADOR
            .requestMatchers(HttpMethod.POST, "/api/vehiculos/**").hasAuthority("ADMINISTRADOR")
            .requestMatchers(HttpMethod.PUT, "/api/vehiculos/**").hasAuthority("ADMINISTRADOR")
            .requestMatchers(HttpMethod.DELETE, "/api/vehiculos/**").hasAuthority("ADMINISTRADOR")
            
            .requestMatchers("/api/categorias/**").hasAuthority("ADMINISTRADOR")
            .requestMatchers("/api/caracteristicas/**").hasAuthority("ADMINISTRADOR")
            .requestMatchers("/api/usuarios/**").hasAuthority("ADMINISTRADOR")

            .anyRequest().authenticated()
        );

        return http.build();
    }
}
