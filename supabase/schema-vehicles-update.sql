-- Modificar la tabla personas para permitir múltiples vehículos
ALTER TABLE personas 
DROP COLUMN tipo_vehiculo;

-- Agregar columnas separadas para cada tipo de vehículo
ALTER TABLE personas 
ADD COLUMN tiene_carro BOOLEAN DEFAULT FALSE,
ADD COLUMN tiene_moto BOOLEAN DEFAULT FALSE,
ADD COLUMN placa_carro TEXT,
ADD COLUMN placa_moto TEXT;

-- Migrar datos existentes (esto debe ejecutarse en producción)
UPDATE personas 
SET tiene_carro = TRUE, placa_carro = placa_vehiculo 
WHERE tiene_vehiculo = TRUE AND tipo_vehiculo = 'Carro';

UPDATE personas 
SET tiene_moto = TRUE, placa_moto = placa_vehiculo 
WHERE tiene_vehiculo = TRUE AND tipo_vehiculo = 'Moto';
