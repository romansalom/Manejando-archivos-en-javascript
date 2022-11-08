const fs = require('fs');

class Contenedor {
  /** @typedef {{id: number, [key: string]: string}} CustomObject */

  filename = '';

  /** @param {string} filename */
  constructor(filename) {
    this.filename = filename ?? 'data.json'
    fs.writeFileSync(this.filename, '[]')
  }

  /** 
   * @param {CustomObject} object
   * @returns {Promise<number>}
   */
  async save(object) {
    const objects = await this.getAll();

    const id = (objects[objects.length - 1]?.id ?? 0) + 1

    const objectToSave = { id, ...object };
    const objectsToSave = JSON.stringify([ ...objects, objectToSave ])

    try {
      await fs.promises.writeFile(this.filename, objectsToSave)
      return id;
    } catch (error) {
      throw new Error(error);
    }

  }

  /** 
   * @param {number} id
   * @returns {Promise<CustomObject>} 
   */
  async getById(id) {
    const objects = await this.getAll()
    return objects.find(object => object.id === id);
  }
  
  /** 
   * @returns {Promise<CustomObject[]>}
   */
  async getAll() {
    try {
      const objects = await fs.promises.readFile(this.filename)
      return JSON.parse(objects)
    } catch (error) {
      throw new Error(error);
    }
  }
  
  /** 
   * @param {number} id
   */
  async deleteById(id) {
    const objects = await this.getAll();
    const newObjectsArray = objects.filter(object => object.id !== id)

    try {
      await fs.promises.writeFile(this.filename, JSON.stringify(newObjectsArray))
    } catch (error) {
      throw new Error(error);
    }

  }
  
  
  async deleteAll() {
    try {
      await fs.promises.writeFile(this.filename, '[]')
    } catch (error) {
      throw new Error(error);
    }
  }
}

(async () => {
  const contenedor = new Contenedor('data.json')

  const program1 = await contenedor.save({ name: 'Nike sb dunk PRM halloween', fecha: ' 31 de octubre 2021' })
  console.log(`The program has been created successfully with id ${program1}`)

  const program2 = await contenedor.save({ name: 'Air Jordan 1 High lost and founds', fecha: '15 de noviembre 2022' })
  console.log(`The program has been created successfully with id ${program2}`)

  const program3 = await contenedor.save({ name: 'Air Max Bacon ', fecha: '13 de Eenero 2019' })
  console.log(`The program has been created successfully with id ${program3}`)

  console.log(await contenedor.getAll())
  console.log(await contenedor.getById(3))

  await contenedor.deleteById(2)
  console.log(await contenedor.getAll())

  await contenedor.deleteAll()
  console.log(await contenedor.getAll())
})()