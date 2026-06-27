package com.driveflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync 
public class DriveflowBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(DriveflowBackendApplication.class, args);
    }
}
