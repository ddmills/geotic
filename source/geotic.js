let _id = 0;
const id = () => ++_id;

const hash = (n) => n.sort((a, b) => a > b).join('$');
const remove = (a, v) => a.splice(a.indexOf(v), 1);
const getComponent = (n) => components.get(n) || newComponent(n);

const tags = new Map();
const entities = [];
const components = new Map();

class Tag {
  constructor(n) {
    this.na = n;
    this.en = [];
    entities.forEach(e => this.match(e));
  }
  match(e) {
    let k = Object.keys(e.c);
    for (let n of this.na) {
      if (!k.includes(n)) return false;
    }
    this.en.push(e);
  }
  onAdd(e, c) {
    c in this.na && this.en.push(e);
  }
  onRem(e, c) {
    this.na.includes(c) && remove(this.en, e);
  }
  static get(n) {
    let h = hash(n);
    return tags.has(h) ? tags.get(h) : Tag.make(n, h);
  }
  static make(n, h) {
    const t = new Tag(n);
    tags.set(h, t);
    return t;
  }
}

class Entity {
  constructor(id) {
    this.c = {};
    this.id = id;
  }
  add(n, ...a) {
    this.c[n] = getComponent(n)(this, ...a);
    this.c[n].mount && this.c[n].mount(this);
    tags.forEach(t => t.onAdd(this, n));
    return this.c[n];
  }
  remove(n, ...a) {
    if (!this.c[n]) return;
    this.c[n].unmount && this.c[n].unmount(this, ...a);
    delete this.c[n];
    tags.forEach(t => t.onRem(this, n));
  }
}

const newComponent = (n) => {
  components.set(n, (entity) => {});
  return c;
}

export const component = (n, d) => components.set(n, d);
export const findByComponent = (...n) => Tag.get(n).en;
export const entity = () => {
  let e = new Entity(id());
  entities.push(e);
  tags.forEach(t => t.match(e));
  return e;
}

export default { entity, component, findByComponent }
