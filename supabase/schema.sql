-- Crear tabla de equipos
CREATE TABLE equipos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('Disponible', 'Asignado', 'En mantenimiento', 'Dado de baja')),
  marca TEXT,
  modelo TEXT,
  numero_serie TEXT,
  fecha_adquisicion DATE,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de personas
CREATE TABLE personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  departamento TEXT,
  cargo TEXT,
  email TEXT,
  telefono TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de movimientos
CREATE TABLE movimientos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipo_id UUID NOT NULL REFERENCES equipos(id),
  tipo_movimiento TEXT NOT NULL CHECK (tipo_movimiento IN ('Entrada', 'Salida', 'Transferencia', 'Mantenimiento', 'Baja')),
  fecha_movimiento TIMESTAMP WITH TIME ZONE NOT NULL,
  persona_id UUID REFERENCES personas(id),
  persona_origen_id UUID REFERENCES personas(id),
  persona_destino_id UUID REFERENCES personas(id),
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear vista para contar equipos por estado
CREATE VIEW equipment_counts_by_status AS
SELECT 
  estado,
  COUNT(*) as cantidad
FROM 
  equipos
GROUP BY 
  estado
ORDER BY 
  cantidad DESC;

-- Crear vista para contar equipos por tipo
CREATE VIEW equipment_counts_by_type AS
SELECT 
  tipo,
  COUNT(*) as cantidad
FROM 
  equipos
GROUP BY 
  tipo
ORDER BY 
  cantidad DESC;

-- Crear vista para equipos con asignaciones
CREATE VIEW equipment_with_assignments AS
SELECT 
  e.*,
  p.id as persona_id,
  p.nombre as persona_nombre,
  p.apellido as persona_apellido,
  p.departamento as persona_departamento,
  p.cargo as persona_cargo,
  p.email as persona_email,
  p.telefono as persona_telefono,
  m.id as ultimo_movimiento_id,
  m.fecha_movimiento as ultimo_movimiento_fecha,
  m.tipo_movimiento as ultimo_movimiento_tipo
FROM 
  equipos e
LEFT JOIN LATERAL (
  SELECT m.*
  FROM movimientos m
  WHERE m.equipo_id = e.id AND m.tipo_movimiento IN ('Salida', 'Transferencia')
  ORDER BY m.fecha_movimiento DESC
  LIMIT 1
) m ON true
LEFT JOIN personas p ON 
  CASE 
    WHEN m.tipo_movimiento = 'Salida' THEN m.persona_id = p.id
    WHEN m.tipo_movimiento = 'Transferencia' THEN m.persona_destino_id = p.id
    ELSE false
  END;

-- Crear vista para historial de movimientos
CREATE VIEW equipment_movement_history AS
SELECT 
  m.id,
  m.equipo_id,
  e.codigo as equipo_codigo,
  e.nombre as equipo_nombre,
  m.tipo_movimiento,
  m.fecha_movimiento,
  m.persona_id,
  p1.nombre as persona_nombre,
  p1.apellido as persona_apellido,
  m.persona_origen_id,
  p2.nombre as persona_origen_nombre,
  p2.apellido as persona_origen_apellido,
  m.persona_destino_id,
  p3.nombre as persona_destino_nombre,
  p3.apellido as persona_destino_apellido,
  m.notas
FROM 
  movimientos m
JOIN 
  equipos e ON m.equipo_id = e.id
LEFT JOIN 
  personas p1 ON m.persona_id = p1.id
LEFT JOIN 
  personas p2 ON m.persona_origen_id = p2.id
LEFT JOIN 
  personas p3 ON m.persona_destino_id = p3.id;

-- Crear triggers para actualizar el campo updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_equipos_modtime
BEFORE UPDATE ON equipos
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_personas_modtime
BEFORE UPDATE ON personas
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_movimientos_modtime
BEFORE UPDATE ON movimientos
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
