let _id = 0;
const id = () => ++_id;

const hash = (n) => n.sort((a, b) => a > b).join('$');
const remove = (a, v) => a.splice(a.indexOf(v), 1);
const getComponent = (n) => components.get(n) || newComponent(n);

const sigs = new Map();
const tsigs = new Map();
const tags = new Map();
const entities = [];
const components = new Map();


class Signature {
  constructor(n) {
    this.na = n;
    this.en = [];
    entities.forEach(e => this.onAdd(e));
  }
  match(e) {
    let k = Object.keys(e.c);
    for (let n of this.na) {
      if (!k.includes(n)) return false;
    }
    return true;
  }
  onAdd(e) {
    if (this.en.includes(e)) return;
    this.match(e) && this.en.push(e);
  }
  onRem(e, c) {
    this.na.includes(c) && remove(this.en, e);
  }
  static get(n) {
    let h = hash(n);
    return sigs.has(h) ? sigs.get(h) : Signature.make(n, h);
  }
  static make(n, h) {
    const t = new Signature(n);
    sigs.set(h, t);
    return t;
  }
}

class TagSignature extends Signature {
  match(e) {
    let k = Object.keys(e.t);
    for (let n of this.na) {
      if (!k.includes(n)) return false;
    }
    this.en.push(e);
  }
  static get(n) {
    let h = hash(n);
    return tsigs.has(h) ? tsigs.get(h) : TagSignature.make(n, h);
  }
  static make(n, h) {
    const t = new TagSignature(n);
    tsigs.set(h, t);
    return t;
  }
}


class Entity {
  constructor(id) {
    this.c = {};
    this.t = {};
    this.id = id;
  }
  add(n, ...a) {
    this.c[n] = getComponent(n)(this, ...a);
    this.c[n].mount && this.c[n].mount(this);
    sigs.forEach(s => s.onAdd(this));
    return this;
  }
  remove(n, ...a) {
    if (!this.c[n]) return;
    this.c[n].unmount && this.c[n].unmount(this, ...a);
    delete this.c[n];
    sigs.forEach(t => t.onRem(this, n));
    return this;
  }
  tag(n, a = {}) {
    const t = getTag(n);
    Object.assign(t, a);
    if (n in this.t) return this;
    this.t[n] = t;
    tsigs.forEach(t => t.onAdd(this));
    return this;
  }
  untag(n) {
    if (!this.t[n]) return;
    delete this.t[n];
    tsigs.forEach(t => t.onRem(this, n));
    return this;
  }
}

const newComponent = (n) => {
  const c = (entity) => {};
  components.set(n, c);
  return c;
}

const newTag = (n) => {
  const t = {};
  tags.set(n, t);
  return t;
}

export const getTag = (n) => tags.get(n) || newTag(n);
export const component = (n, d) => components.set(n, d);
export const findByComponent = (...n) => Signature.get(n).en;
export const findById = (id) => entities.find(e => e.id === id);
export const entity = () => {
  let e = new Entity(id());
  entities.push(e);
  sigs.forEach(t => t.match(e));
  return e;
}

export const findByTag = (...n) => TagSignature.get(n).en;

export default {
  entity,
  getTag,
  findById,
  findByTag,
  component,
  findByComponent
};
