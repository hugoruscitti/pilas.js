/**
 * Representa una entidad dentro del motor, como un actor por ejemplo.
 *
 * Esta interfaz no se utiliza de forma directa, sino que solamente sirve
 * para agrupar todos los datos referidos a una entidad.
 *
 */
interface Entity {
  nombre: string,
  id: number,
  x: number,
  y: number,
  sprite_id?: string,
  scale_x: number,
  scale_y: number,
  rotation: number,
  anchor_x: number,
  anchor_y: number,
  image: string,
  scripts?: any
}
