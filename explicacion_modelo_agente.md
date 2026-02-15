# Explicación del Modelo de Agente (Agent)

El modelo `Agent` dentro del sistema del museo representa a los **actores externos** que interactúan con la colección. A diferencia del modelo `User`, que representa a las personas que tienen acceso al software (administradores, empleados), los Agentes son entidades o personas con las que se realizan transacciones de piezas.

## Propósito

Su función principal es identificar quién es el responsable, origen o destino de un **Movimiento** (`Movement`) de una pieza del museo.

## Atributos Principales

- `unique_id`: Un identificador único para el agente (puede ser una cédula, RIF o código interno).
- `name_legal_entity`: El nombre oficial de la persona, institución o entidad.
- `agent_type`: Clasificación del agente (Persona, Entidad, Institución).
- `representative_name`: Nombre de la persona de contacto o representante legal.
- `email`, `phone`, `address`: Datos de contacto para comunicación y localización.

## Relación con otros Modelos

- **Movimientos (`Movements`)**: Un Agente tiene muchos movimientos. Cada vez que una pieza entra o sale del museo, se asocia a un Agente para saber quién entregó o quién recibió la pieza.

## Ejemplo de Uso

Si el museo decide prestar una pintura a una **Institución** (por ejemplo, "Museo de Bellas Artes"), se crea un registro de Agente para esa institución. Luego, se registra un movimiento de salida donde el `agent_id` apunta a dicho Agente.

---

_Este documento fue generado para explicar la arquitectura de datos del sistema de gestión del museo._
