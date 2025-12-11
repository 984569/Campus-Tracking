-- Asegurarse de que las columnas necesarias existan
ALTER TABLE personas 
ADD COLUMN IF NOT EXISTS tiene_carro BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS tiene_moto BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS placa_carro TEXT,
ADD COLUMN IF NOT EXISTS placa_moto TEXT;

-- Asegurarse de que tiene_vehiculo exista
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'personas' AND column_name = 'tiene_vehiculo') THEN
    ALTER TABLE personas ADD COLUMN tiene_vehiculo BOOLEAN DEFAULT FALSE;
  END IF;
END $$;
