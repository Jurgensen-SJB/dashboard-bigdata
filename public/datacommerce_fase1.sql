-- =====================================================
-- DataCommerce Analytics S.A.S. - Modelo de análisis comercial
-- Motor: PostgreSQL (Supabase)
-- Periodo de datos: enero - diciembre de 2025 (12 meses)
-- =====================================================

-- Limpieza para poder re-ejecutar el script
DROP TABLE IF EXISTS detalle_venta, ventas, productos, categorias,
                     clientes, vendedores, ciudades CASCADE;

-- =====================================================
-- 1. CREACIÓN DE TABLAS
-- =====================================================

CREATE TABLE ciudades (
    id_ciudad     INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre        VARCHAR(60)  NOT NULL UNIQUE,
    departamento  VARCHAR(60)  NOT NULL,
    latitud       NUMERIC(9,6) NOT NULL,
    longitud      NUMERIC(9,6) NOT NULL
);

CREATE TABLE categorias (
    id_categoria  INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre        VARCHAR(60)  NOT NULL UNIQUE,
    descripcion   VARCHAR(150)
);

CREATE TABLE productos (
    id_producto   INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre        VARCHAR(100) NOT NULL UNIQUE,
    id_categoria  INT          NOT NULL,
    precio_venta  NUMERIC(12,2) NOT NULL CHECK (precio_venta > 0),
    costo         NUMERIC(12,2) NOT NULL CHECK (costo > 0),
    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

CREATE TABLE clientes (
    id_cliente      INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    documento       VARCHAR(15)  NOT NULL UNIQUE,
    nombre          VARCHAR(100) NOT NULL,
    email           VARCHAR(120) NOT NULL UNIQUE,
    id_ciudad       INT          NOT NULL,
    fecha_registro  DATE         NOT NULL,
    CONSTRAINT fk_cliente_ciudad
        FOREIGN KEY (id_ciudad) REFERENCES ciudades(id_ciudad)
);

CREATE TABLE vendedores (
    id_vendedor    INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    documento      VARCHAR(15)  NOT NULL UNIQUE,
    nombre         VARCHAR(100) NOT NULL,
    email          VARCHAR(120) NOT NULL UNIQUE,
    id_ciudad      INT          NOT NULL,   -- ciudad sede del vendedor
    fecha_ingreso  DATE         NOT NULL,
    CONSTRAINT fk_vendedor_ciudad
        FOREIGN KEY (id_ciudad) REFERENCES ciudades(id_ciudad)
);

CREATE TABLE ventas (
    id_venta     INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_cliente   INT  NOT NULL,
    id_vendedor  INT  NOT NULL,
    id_ciudad    INT  NOT NULL,             -- ciudad donde se realizó la venta
    fecha_venta  DATE NOT NULL,
    CONSTRAINT fk_venta_cliente
        FOREIGN KEY (id_cliente)  REFERENCES clientes(id_cliente),
    CONSTRAINT fk_venta_vendedor
        FOREIGN KEY (id_vendedor) REFERENCES vendedores(id_vendedor),
    CONSTRAINT fk_venta_ciudad
        FOREIGN KEY (id_ciudad)   REFERENCES ciudades(id_ciudad)
);

CREATE TABLE detalle_venta (
    id_detalle       INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_venta         INT NOT NULL,
    id_producto      INT NOT NULL,
    cantidad         INT NOT NULL CHECK (cantidad > 0),
    precio_unitario  NUMERIC(12,2) NOT NULL CHECK (precio_unitario > 0),
    CONSTRAINT fk_detalle_venta
        FOREIGN KEY (id_venta)    REFERENCES ventas(id_venta),
    CONSTRAINT fk_detalle_producto
        FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    CONSTRAINT uq_venta_producto UNIQUE (id_venta, id_producto)
);

-- =====================================================
-- 2. INSERCIÓN DE DATOS (100% ficticios)
-- Los IDs se generan solos en el orden de inserción (1, 2, 3...)
-- =====================================================

INSERT INTO ciudades (nombre, departamento, latitud, longitud) VALUES
('Bogotá',       'Cundinamarca',       4.711000, -74.072100),  -- 1
('Medellín',     'Antioquia',          6.244200, -75.581200),  -- 2
('Cali',         'Valle del Cauca',    3.451600, -76.532000),  -- 3
('Barranquilla', 'Atlántico',         10.968500, -74.781300),  -- 4
('Cúcuta',       'Norte de Santander', 7.893900, -72.507800),  -- 5
('Bucaramanga',  'Santander',          7.119300, -73.122700),  -- 6
('Cartagena',    'Bolívar',           10.391000, -75.479400),  -- 7
('Pereira',      'Risaralda',          4.813300, -75.696100);  -- 8

INSERT INTO categorias (nombre, descripcion) VALUES
('Tecnología', 'Equipos electrónicos y accesorios'),
('Hogar',      'Electrodomésticos y textiles para el hogar'),
('Moda',       'Ropa, calzado y accesorios'),
('Deportes',   'Artículos deportivos y fitness'),
('Oficina',    'Mobiliario y papelería de oficina');

INSERT INTO productos (nombre, id_categoria, precio_venta, costo) VALUES
('Portátil 15 pulgadas 8GB',     1, 2200000, 1750000),
('Smartphone gama media 128GB',  1,  900000,  700000),
('Audífonos Bluetooth',          1,  120000,   70000),
('Licuadora 600W',               2,  180000,  120000),
('Freidora de aire 4L',          2,  320000,  210000),
('Juego de sábanas queen',       2,  150000,   85000),
('Jean clásico hombre',          3,  130000,   70000),
('Chaqueta impermeable',         3,  240000,  140000),
('Zapatillas casuales',          3,  280000,  160000),
('Bicicleta MTB rin 26',         4,  850000,  620000),
('Balón de fútbol',              4,   90000,   50000),
('Pesas ajustables 20kg',        4,  210000,  130000),
('Silla ergonómica',             5,  450000,  300000),
('Escritorio ajustable',         5,  600000,  410000),
('Resma de papel carta x10',     5,  140000,  105000);

INSERT INTO clientes (documento, nombre, email, id_ciudad, fecha_registro) VALUES
('1010101001', 'Valentina Torres',  'valentina.torres@example.com',  1, '2024-03-10'),  --  1 Bogotá
('1010101002', 'Santiago Gómez',    'santiago.gomez@example.com',    1, '2024-04-22'),  --  2 Bogotá
('1010101003', 'Mariana Londoño',   'mariana.londono@example.com',   2, '2024-02-14'),  --  3 Medellín
('1010101004', 'Felipe Restrepo',   'felipe.restrepo@example.com',   2, '2024-06-03'),  --  4 Medellín
('1010101005', 'Juliana Cardona',   'juliana.cardona@example.com',   3, '2024-05-18'),  --  5 Cali
('1010101006', 'Carlos Arias',      'carlos.arias@example.com',      4, '2024-01-27'),  --  6 Barranquilla
('1010101007', 'Paola Sánchez',     'paola.sanchez@example.com',     5, '2024-07-05'),  --  7 Cúcuta
('1010101008', 'Luis Contreras',    'luis.contreras@example.com',    5, '2024-08-12'),  --  8 Cúcuta
('1010101009', 'Natalia Duarte',    'natalia.duarte@example.com',    6, '2024-04-30'),  --  9 Bucaramanga
('1010101010', 'Esteban Herrera',   'esteban.herrera@example.com',   7, '2024-09-01'),  -- 10 Cartagena
('1010101011', 'Isabela Marín',     'isabela.marin@example.com',     8, '2024-06-15'),  -- 11 Pereira
('1010101012', 'Mateo Vargas',      'mateo.vargas@example.com',      1, '2024-10-20');  -- 12 Bogotá

INSERT INTO vendedores (documento, nombre, email, id_ciudad, fecha_ingreso) VALUES
('2020202001', 'Camila Rojas',      'camila.rojas@datacommerce.example',      1, '2023-02-01'),  -- 1 sede Bogotá
('2020202002', 'Andrés Pardo',      'andres.pardo@datacommerce.example',      2, '2022-08-15'),  -- 2 sede Medellín
('2020202003', 'Laura Mejía',       'laura.mejia@datacommerce.example',       3, '2024-01-10'),  -- 3 sede Cali
('2020202004', 'Jorge Villamizar',  'jorge.villamizar@datacommerce.example',  5, '2023-06-05'),  -- 4 sede Cúcuta
('2020202005', 'Daniela Ortega',    'daniela.ortega@datacommerce.example',    4, '2024-03-20'),  -- 5 sede Barranquilla
('2020202006', 'Sebastián Cruz',    'sebastian.cruz@datacommerce.example',    6, '2024-09-01');  -- 6 sede Bucaramanga

-- (id_cliente, id_vendedor, id_ciudad_de_la_venta, fecha)
-- Cartagena (7) la atiende Daniela (Barranquilla) y Pereira (8) la atiende Laura (Cali)
INSERT INTO ventas (id_cliente, id_vendedor, id_ciudad, fecha_venta) VALUES
( 1, 1, 1, '2025-01-08'),  --  1
( 3, 2, 2, '2025-01-15'),  --  2
( 7, 4, 5, '2025-02-04'),  --  3
( 6, 5, 4, '2025-02-18'),  --  4
( 5, 3, 3, '2025-03-06'),  --  5
( 9, 6, 6, '2025-03-20'),  --  6
( 2, 1, 1, '2025-04-10'),  --  7
(10, 5, 7, '2025-04-24'),  --  8
( 4, 2, 2, '2025-05-08'),  --  9
( 1, 1, 1, '2025-05-22'),  -- 10
( 8, 4, 5, '2025-06-12'),  -- 11
(11, 3, 8, '2025-06-26'),  -- 12
(12, 1, 1, '2025-07-10'),  -- 13
( 3, 2, 2, '2025-07-24'),  -- 14
( 6, 5, 4, '2025-08-07'),  -- 15
( 7, 4, 5, '2025-08-21'),  -- 16
( 5, 3, 3, '2025-09-11'),  -- 17
( 9, 6, 6, '2025-09-25'),  -- 18
( 2, 1, 1, '2025-10-09'),  -- 19
(10, 5, 7, '2025-10-23'),  -- 20
( 8, 4, 5, '2025-11-14'),  -- 21
( 1, 1, 1, '2025-11-28'),  -- 22
( 6, 5, 4, '2025-11-29'),  -- 23
(12, 1, 1, '2025-12-05'),  -- 24
( 7, 4, 5, '2025-12-12'),  -- 25
( 3, 2, 2, '2025-12-19');  -- 26

INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES
( 1,  1, 1, 2200000),
( 2,  2, 1,  900000),
( 2,  3, 1,  120000),
( 3, 13, 2,  450000),
( 4,  5, 1,  320000),
( 4,  4, 1,  180000),
( 5, 10, 1,  850000),
( 6,  8, 1,  240000),
( 6,  9, 1,  280000),
( 7,  2, 2,  900000),
( 8,  6, 2,  150000),
( 8, 11, 3,   90000),
( 9,  1, 1, 2200000),
( 9,  3, 2,  120000),
(10, 14, 1,  600000),
(10, 13, 1,  450000),
(11, 12, 1,  210000),
(12,  7, 3,  130000),
(13,  5, 2,  320000),
(14, 10, 1,  850000),
(15,  1, 1, 2200000),
(16, 15, 5,  140000),
(16, 14, 1,  600000),
(17,  9, 2,  280000),
(18,  2, 1,  900000),
(19,  3, 2,  120000),
(19, 12, 1,  210000),
(20,  8, 1,  240000),
(21, 13, 1,  450000),
(22,  1, 2, 2200000),
(23, 10, 1,  850000),
(23, 11, 2,   90000),
(24,  4, 2,  180000),
(25,  2, 1,  900000),
(26, 14, 1,  600000);
