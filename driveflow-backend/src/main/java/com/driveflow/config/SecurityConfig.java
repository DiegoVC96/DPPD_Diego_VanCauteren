package com.driveflow.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Desactivar CSRF ya que estamos usando una API REST de tipo Stateless
            .csrf(AbstractHttpConfigurer::disable)
            
            // 2. Configurar las reglas de autorización de las rutas obligatorias
            .authorizeHttpRequests(auth -> auth
                // Apertura total y pública para los controladores del catálogo de DriveFlow
                .requestMatchers("/api/vehiculos/**").permitAll() 
                // Cualquier otra petición interna requerirá autenticación posterior
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
