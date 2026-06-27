-- POBLAR MAESTRO DE CATEGORÍAS (Sprint 2 - US #12)
INSERT IGNORE INTO categorias (id, nombre, descripcion, icono) VALUES 
(1, 'Sedán', 'Autos compactos y confortables ideales para viajes ejecutivos y trayectos urbanos.', 'Car'),
(2, 'SUV', 'Vehículos utilitarios deportivos, espaciosos y potentes para terrenos exigentes.', 'Compass'),
(3, 'Deportivos', 'Modelos exóticos de alta gama, ingeniería avanzada y máxima velocidad.', 'Gauge'),
(4, 'Eléctricos', 'Ecomovilidad de vanguardia silenciosa con motorización 100% eléctrica.', 'Zap');


-- POBLAR 20 VEHÍCULOS DISTRIBUIDOS EN LAS 4 CATEGORÍAS
INSERT IGNORE INTO vehiculos (id, nombre, descripcion, precio_por_dia, categoria_id) VALUES
-- CATEGORÍA 1: SEDANES (IDs 1 al 5)
(1, 'Toyota Corolla Hybrid 2026', 'Sedán ejecutivo con motorización híbrida autorrecargable, climatizador bizona y sistemas de asistencia Toyota Safety Sense.', 45000.00, 1),
(2, 'Honda Civic Turbo Plus', 'Diseño deportivo aerodinámico con transmisión CVT de última generación, tapizado de cuero y pantalla de 9 pulgadas.', 48000.00, 1),
(3, 'Volkswagen Vento GLI', 'Sedán de altas prestaciones con motor 2.0 TSI de 230 CV, caja automática DSG y tablero digital Active Info Display.', 65000.00, 1),
(4, 'BMW Serie 3 320i Sport', 'Sofisticación y tracción trasera alemana. Equipado con live cockpit profesional y acabados interiores en aluminio.', 95000.00, 1),
(5, 'Mercedes-Benz Clase C 200', 'Lujo refinado con tecnología Mild Hybrid de 48V, asistente de voz MBUX inteligente y techo corredizo panorámico.', 110000.00, 1),

-- CATEGORÍA 2: SUVs (IDs 6 al 10)
(6, 'Toyota SW4 Diamond', 'SUV todoterreno con tres filas de asientos para 7 pasajeros, tracción 4x4 real y sistema de audio premium JBL.', 85000.00, 2),
(7, 'Jeep Compass Limited T270', 'Motor turbo nafta eficiente, techo solar panorámico doble, tracción delantera inteligente y control de crucero adaptativo.', 58000.00, 2),
(8, 'Ford Territory Titanium', 'Espacio interior de nivel superior, panel de instrumentos digital de 12 pulgadas, cámaras 360 grados y estacionamiento asistido.', 62000.00, 2),
(9, 'Honda CR-V Advanced', 'SUV icónica con tracción integral AWD, seguridad Honda Sensing y máxima comodidad en rutas de larga distancia.', 72000.00, 2),
(10, 'Audi Q5 Sportback Quattro', 'Silueta coupé deportiva con tracción integral Quattro permanente, luces Matrix LED y suspensión neumática regulable.', 130000.00, 2),

-- CATEGORÍA 3: DEPORTIVOS (IDs 11 al 15)
(11, 'Ford Mustang Mach 1', 'Leyenda americana con motor V8 de 5.0L y 475 CV, escape deportivo adaptativo y llantas de aleación exclusivas.', 150000.00, 3),
(12, 'Porsche 911 Carrera S', 'Ingeniería alemana mítica. Motor bóxer biturbo, aceleración de 0 a 100 km/h en 3.7 segundos y paquete Chrono Sport.', 280000.00, 3),
(13, 'Chevrolet Camaro SS V8', 'Muscle car de diseño imponente con 461 CV, frenos de competición Brembo de alta resistencia y Head-Up Display en parabrisas.', 140000.00, 3),
(14, 'Audi R8 V10 Performance', 'Superdeportivo puro con motor central aspirado, chasis de aluminio ultra-liviano y tracción Quattro de alta competición.', 350000.00, 3),
(15, 'Toyota GR Yaris Rally', 'Auténtico vehículo de competición homologado para la calle. Motor turbo de 3 cilindros, tracción total GR-Four y caja manual.', 98000.00, 3),

-- CATEGORÍA 4: ELÉCTRICOS (IDs 16 al 20)
(16, 'Tesla Model 3 Long Range', 'Autonomía líder de hasta 600 km, conducción autónoma Autopilot, aceleración instantánea y pantalla central táctil total.', 120000.00, 4),
(17, 'Nissan Leaf Tekna 40kWh', 'El vehículo eléctrico más probado del mundo, equipado con sistema e-Pedal para conducción con un solo pie y frenado regenerativo.', 42000.00, 4),
(18, 'Audi e-tron Sportback', 'SUV de lujo 100% eléctrica con espejos retrovisores virtuales por cámara, tracción Quattro eléctrica y carga ultra-rápida.', 185000.00, 4),
(19, 'Porsche Taycan 4S', 'Deportivo eléctrico puro con arquitectura de 800 voltios, diseño de cabina futurista y aceleración sin interrupciones.', 310000.00, 4),
(20, 'Volvo XC40 Recharge Pure', 'Seguridad sueca con motorización eléctrica doble, tracción AWD, sistema operativo Android Automotive integrado y techo solar.', 89000.00, 4);

-- ENLAZAR MÍNIMO UNA IMAGEN PUBLICITARIA DE ALTA RESOLUCIÓN POR CADA VEHÍCULO
INSERT IGNORE INTO vehiculo_imagenes (vehiculo_id, url_imagen) VALUES
(1, 'https://unsplash.com'),
(2, 'https://unsplash.com'),
(3, 'https://unsplash.com'),
(4, 'https://unsplash.com'),
(5, 'https://unsplash.com'),
(6, 'https://unsplash.com'),
(7, 'https://unsplash.com'),
(8, 'https://unsplash.com'),
(9, 'https://unsplash.com'),
(10, 'https://unsplash.com'),
(11, 'https://unsplash.com'),
(12, 'https://unsplash.com'),
(13, 'https://unsplash.com'),
(14, 'https://unsplash.com'),
(15, 'https://unsplash.com'),
(16, 'https://unsplash.com'),
(17, 'https://unsplash.com'),
(18, 'https://unsplash.com'),
(19, 'https://unsplash.com'),
(20, 'https://unsplash.com');

-- INSERTAR CARACTERÍSTICAS DE PRUEBA
INSERT IGNORE INTO caracteristicas (id, nombre, url_imagen) VALUES 
(1, 'Aire Acondicionado', 'https://flaticon.com'),
(2, 'Conexión WiFi', 'https://flaticon.com'),
(3, 'Navegador GPS', 'https://flaticon.com'),
(4, 'Caja Automática', 'https://flaticon.com');

