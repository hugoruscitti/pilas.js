/**
 * Escape the given `html`.
 *
 * @example
 *     utils.escape('<script></script>')
 *     // => '&lt;script&gt;&lt;/script&gt;'
 *
 * @param {String} html string to be escaped
 * @return {String} escaped html
 * @api public
 */
interface Entity {
  name: string,
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
