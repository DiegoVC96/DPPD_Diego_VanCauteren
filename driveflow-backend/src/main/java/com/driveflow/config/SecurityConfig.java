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

    @Bean
    public UserDetailsService userDetailsService() {
        return email -> {
            Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() -> new UsernameNotFoundException("Email no registrado: " + email));

            return User.withUsername(usuario.getEmail())
                .password(usuario.getPassword())
                .authorities(new SimpleGrantedAuthority(usuario.getRol().name())) 
                .build();
        };
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, UserDetailsService userDetailsService) throws Exception {
        AuthenticationManagerBuilder builder = http.getSharedObject(AuthenticationManagerBuilder.class);
        builder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
        return builder.build();
    }

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

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            // 🔓 Endpoints Públicos de Consulta 
            .requestMatchers(HttpMethod.GET, "/api/vehiculos/**", "/api/categorias/**", "/api/puntuaciones/vehiculo/**", "/api/reservas/ocupadas/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/usuarios/registro", "/api/usuarios/login").permitAll()
            
            // 🛡️ Endpoints Privados Protegidos (USER)
            .requestMatchers(HttpMethod.POST, "/api/reservas/**").authenticated()
            .requestMatchers(HttpMethod.GET, "/api/reservas/usuario/**").authenticated()
            .requestMatchers(HttpMethod.POST, "/api/puntuaciones/**").authenticated()
            .requestMatchers(HttpMethod.POST, "/api/usuarios/*/favoritos/**").authenticated()
            .requestMatchers(HttpMethod.DELETE, "/api/usuarios/*/favoritos/**").authenticated()
            
            // 👑 Endpoints Restringidos (ADMIN)
            .requestMatchers(HttpMethod.POST, "/api/vehiculos/**", "/api/categorias/**").hasAuthority("ADMINISTRADOR")
            .requestMatchers(HttpMethod.DELETE, "/api/categorias/**").hasAuthority("ADMINISTRADOR")
            .requestMatchers(HttpMethod.GET, "/api/usuarios/**").hasAuthority("ADMINISTRADOR")
            
            .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());
        return http.build();
    }

}
