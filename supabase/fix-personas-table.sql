-- Script para verificar y corregir la estructura de la tabla personas

-- Añadir columnas faltantes si no existen
DO $$
BEGIN
    -- Verificar y añadir id_persona
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'personas' AND column_name = 'id_persona') THEN
        ALTER TABLE personas ADD COLUMN id_persona TEXT;
    END IF;

    -- Verificar y añadir ta_edificio
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'personas' AND column_name = 'ta_edificio') THEN
        ALTER TABLE personas ADD COLUMN ta_edificio TEXT;
    END IF;

    -- Verificar y añadir tiene_vehiculo
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'personas' AND column_name = 'tiene_vehiculo') THEN
        ALTER TABLE personas ADD COLUMN tiene_vehiculo BOOLEAN DEFAULT FALSE;
    END IF;

    -- Verificar y añadir tiene_carro
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'personas' AND column_name = 'tiene_carro') THEN
        ALTER TABLE personas ADD COLUMN tiene_carro BOOLEAN DEFAULT FALSE;
    END IF;

    -- Verificar y añadir tiene_moto
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'personas' AND column_name = 'tiene_moto') THEN
        ALTER TABLE personas ADD COLUMN tiene_moto BOOLEAN DEFAULT FALSE;
    END IF;

    -- Verificar y añadir placa_carro
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'personas' AND column_name = 'placa_carro') THEN
        ALTER TABLE personas ADD COLUMN placa_carro TEXT;
    END IF;

    -- Verificar y añadir placa_moto
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'personas' AND column_name = 'placa_moto') THEN
        ALTER TABLE personas ADD COLUMN placa_moto TEXT;
    END IF;
END $$;

-- Verificar la estructura actualizada
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_name = 'personas'
ORDER BY 
  ordinal_position;
