export type Equipment = {
  id: string
  codigo: string
  nombre: string
  tipo: string
  estado: "Disponible" | "Asignado" | "En mantenimiento" | "Dado de baja"
  marca: string
  modelo: string
  numero_serie: string
  fecha_adquisicion: string
  notas: string
  created_at: string
  updated_at: string
}

export type Person = {
  id: string
  nombre: string
  apellido: string
  departamento: string
  cargo: string
  email: string
  telefono: string
  ta_edificio: string
  id_persona: string
  tiene_vehiculo: boolean
  tiene_carro: boolean
  tiene_moto: boolean
  placa_carro: string
  placa_moto: string
  created_at: string
  updated_at: string
}

export type Movement = {
  id: string
  equipo_id: string
  persona_id: string | null
  tipo_movimiento:
    | "Entrada"
    | "Salida"
    | "Transferencia"
    | "Mantenimiento"
    | "Baja"
    | "Préstamo"
    | "Devolución préstamo"
    | "Devolución egreso"
  fecha_movimiento: string
  notas: string
  created_at: string
  updated_at: string
  persona_origen_id: string | null
  persona_destino_id: string | null
}

export type EquipmentWithAssignment = Equipment & {
  persona?: Person | null
  ultimo_movimiento?: Movement | null
}

export type EquipmentCountByStatus = {
  estado: string
  cantidad: number
}

export type EquipmentCountByType = {
  tipo: string
  cantidad: number
}
