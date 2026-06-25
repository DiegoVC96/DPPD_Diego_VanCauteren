package com.driveflow.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Habilita explícitamente el origen de tu puerto de Vite
        config.setAllowedOrigins(Collections.singletonList("http://localhost:5173"));
        
        // Permite credenciales, cabeceras y todos los métodos operativos requeridos
        config.setAllowCredentials(true);
        config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setMaxAge(3600L); // Cachea la negociación de seguridad por 1 hora

        // Aplica esta directiva de red de forma global a todas las rutas de la API
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
