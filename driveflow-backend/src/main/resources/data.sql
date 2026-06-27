-- POBLAR MAESTRO DE CATEGORÍAS 
INSERT IGNORE INTO categorias (id, nombre, descripcion, url_imagen) VALUES 
(1, 'Sedán', 'Autos compactos y confortables ideales para viajes ejecutivos y trayectos urbanos.', 'https://cdn-icons-png.flaticon.com/512/55/55283.png'),
(2, 'SUV', 'Vehículos utilitarios deportivos, espaciosos y potentes para terrenos exigentes.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnz6BL--0W-Y59oicSjzr59H7jBFZbFxbWQ7gIxGsoQA&s=10'),
(3, 'Deportivos', 'Modelos exóticos de alta gama, ingeniería avanzada y máxima velocidad.', 'https://cdn-icons-png.flaticon.com/512/55/55168.png'),
(4, 'Eléctricos', 'Ecomovilidad de vanguardia silenciosa con motorización 100% eléctrica.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYNJtKD2dZ0VNvj8GIhW0RgpUIfw6nLmhUUrqKgO_5Ww&s=10');


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
(1, 'https://acroadtrip.blob.core.windows.net/catalogo-imagenes/s/RT_V_55247b2a36b74b1c9f6761c7b4bdefe9.jpg'),
(2, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRanMOSazguMqItUrwHD_uAjFugxTMTlzDqkgbrxQsrU3_x3VMfWecqn8e-&s=10'),
(3, 'https://assets.volkswagen.com/is/image/volkswagenag/VW%20VENTO%20LATINNCAP%2025_1?Zml0PWNyb3AsMSZmbXQ9cG5nJndpZD04MDAmYWxpZ249MC4wMCwwLjAwJmJmYz1vZmYmYzRiMA=='),
(4, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq1X9sNY4KLUXiRqJIXlDr_KCglcuQK3DmpeHEYQmLATwwbiqkqZRzokA&s=10'),
(5, 'https://www.mercedes-benz.com.ar/content/dam/hq/passengercars/cars/c-class/c-class-saloon-w206-pi/modeloverview/06-2022/images/mercedes-benz-c-class-w206-modeloverview-696x392-06-2022.png'),
(6, 'https://media.toyota.com.ar/49dc02b3-68a5-489c-acec-a44839efcde8.jpeg'),
(7, 'https://www.autodrive.com.ar/images/Compass_Limited_Carbon_Black2022.jpg'),
(8, 'https://www.ford.com.ar/content/dam/Ford/website-assets/latam/ar/nameplate/territory/2025/models/titanium/billboard/far-nueva-territory-model-titanium-billboard.jpg'),
(9, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGWKk5rzOvYG4oe84RTmFc5tqZGt2LTnY2cvXiPzSuK1n8NQ_73LcwObAc&s=10'),
(10, 'https://acnews.blob.core.windows.net/imgnews/medium/NAZ_e03c5e94ce8f420d910b85173a69bbf2.webp'),
(11, 'https://acnews.blob.core.windows.net/imgnews/medium/NAZ_6f813f44cdde438e8386b9f742988b44.jpg'),
(12, 'https://acnews.blob.core.windows.net/imgnews/large/NAZ_af1ff17ccc3b4231b8825e4b9ebe1659.jpg'),
(13, 'https://resizer.iproimg.com/unsafe/768x/filters:format(webp):quality(75):max_bytes(102400)/https://assets.iprofesional.com/assets/jpg/2013/03/375884.jpg'),
(14, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu_k4XP-H691hptBxXFkkt6kQlvdaNzhxegeNEpphYh9gTigrwEYy2i3XN&s=10'),
(15, 'https://acnews.blob.core.windows.net/imgnews/large/NAZ_df48b53d9c044d6e8d3fa85e40a31508.jpg'),
(16, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpxNyFYYFfC4yQzEnnJBFAVV6uI1wZ4EU-qnHEhuCPQjpESbHO-hbu85Op&s=10'),
(17, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyLX2yMVC9rT2N2eLtri0Hf9-CM0iRKJN01Ozge-3PLVVIvYc7bavQqGft&s=10'),
(18, 'https://acnews.blob.core.windows.net/imggallery/800x600/GAZ_e94a0dd9f5b54e4fa917ed216a1972cf.jpg'),
(19, 'https://a.storyblok.com/f/322327/2586x1449/7569dfbed6/taycan-4s.jpg/m/865x486/smart/filters:format(webp)?dpl=dpl_9A8NYGWRmqpWWWcRFM6yoioLrazQ'),
(20, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwBkLGSxb3or7_2q7Zva22lW-zj2vroukfCn__ZUMwAg&s=10');

-- INSERTAR CARACTERÍSTICAS DE PRUEBA
INSERT IGNORE INTO caracteristicas (id, nombre, url_imagen) VALUES 
(1, 'Aire Acondicionado', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbNPjsJLK_jx0BoE2ZOBDiR-RjAzKIGjDP_ne7r2O3iQ&s=10'),
(2, 'Conexión WiFi', 'https://static.vecteezy.com/system/resources/thumbnails/007/882/232/small/wifi-icon-style-free-vector.jpg'),
(3, 'Navegador GPS', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBkFNWd2xjX526STpfALT6-FYNbK54UJQZtW9nQk97IA&s=10'),
(4, 'Caja Automática', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfnOIW-USIIPLKxoTrvVWDTBuFnmd385fJJs6VMn5oUw&s=10');

