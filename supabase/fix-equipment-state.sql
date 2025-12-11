-- Crear una función para actualizar el estado de un equipo basado en su último movimiento
CREATE OR REPLACE FUNCTION update_equipment_state_from_last_movement()
RETURNS TRIGGER AS $$
DECLARE
  last_movement RECORD;
  new_state TEXT;
BEGIN
  -- Buscar el último movimiento para este equipo
  SELECT * INTO last_movement
  FROM movimientos
  WHERE equipo_id = OLD.equipo_id
  ORDER BY fecha_movimiento DESC
  LIMIT 1;
  
  -- Determinar el nuevo estado basado en el último movimiento
  IF last_movement IS NULL THEN
    new_state := 'Disponible'; -- Si no hay movimientos, el equipo está disponible
  ELSE
    CASE last_movement.tipo_movimiento
      WHEN 'Entrada' THEN new_state := 'Disponible';
      WHEN 'Salida' THEN new_state := 'Asignado';
      WHEN 'Transferencia' THEN new_state := 'Asignado';
      WHEN 'Mantenimiento' THEN new_state := 'En mantenimiento';
      WHEN 'Baja' THEN new_state := 'Dado de baja';
      ELSE new_state := 'Disponible';
    END CASE;
  END IF;
  
  -- Actualizar el estado del equipo
  UPDATE equipos
  SET estado = new_state
  WHERE id = OLD.equipo_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Crear un trigger que se ejecute después de eliminar un movimiento
DROP TRIGGER IF EXISTS after_movement_delete ON movimientos;
CREATE TRIGGER after_movement_delete
AFTER DELETE ON movimientos
FOR EACH ROW
EXECUTE FUNCTION update_equipment_state_from_last_movement();

-- Corregir inconsistencias existentes en la base de datos
DO $$
DECLARE
  equipo_record RECORD;
  last_movement RECORD;
  new_state TEXT;
BEGIN
  FOR equipo_record IN SELECT * FROM equipos WHERE estado = 'Asignado' LOOP
    -- Verificar si realmente tiene un movimiento de asignación
    SELECT * INTO last_movement
    FROM movimientos
    WHERE equipo_id = equipo_record.id
    ORDER BY fecha_movimiento DESC
    LIMIT 1;
    
    IF last_movement IS NULL THEN
      -- No hay movimientos, debería estar disponible
      UPDATE equipos SET estado = 'Disponible' WHERE id = equipo_record.id;
    ELSIF last_movement.tipo_movimiento NOT IN ('Salida', 'Transferencia') THEN
      -- El último movimiento no es de asignación
      CASE last_movement.tipo_movimiento
        WHEN 'Entrada' THEN new_state := 'Disponible';
        WHEN 'Mantenimiento' THEN new_state := 'En mantenimiento';
        WHEN 'Baja' THEN new_state := 'Dado de baja';
        ELSE new_state := 'Disponible';
      END CASE;
      
      UPDATE equipos SET estado = new_state WHERE id = equipo_record.id;
    END IF;
  END LOOP;
END $$;

-- Actualizar la vista equipment_with_assignments para manejar mejor las inconsistencias
CREATE OR REPLACE VIEW equipment_with_assignments AS
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
  END
WHERE
  -- Asegurar que los equipos con estado 'Asignado' realmente tengan una asignación
  (e.estado = 'Asignado' AND m.id IS NOT NULL) OR e.estado != 'Asignado';
