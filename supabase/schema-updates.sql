-- Actualizar la tabla personas para agregar los nuevos campos
ALTER TABLE personas 
ADD COLUMN ta_edificio TEXT,
ADD COLUMN id_persona TEXT,
ADD COLUMN tiene_vehiculo BOOLEAN DEFAULT FALSE,
ADD COLUMN tipo_vehiculo TEXT CHECK (tipo_vehiculo IS NULL OR tipo_vehiculo IN ('Carro', 'Moto')),
ADD COLUMN placa_vehiculo TEXT;

-- Actualizar la restricción de tipo_movimiento en la tabla movimientos
ALTER TABLE movimientos 
DROP CONSTRAINT movimientos_tipo_movimiento_check;

ALTER TABLE movimientos 
ADD CONSTRAINT movimientos_tipo_movimiento_check 
CHECK (tipo_movimiento IN ('Entrada', 'Salida', 'Transferencia', 'Mantenimiento', 'Baja', 'Préstamo', 'Devolución préstamo', 'Devolución egreso'));
