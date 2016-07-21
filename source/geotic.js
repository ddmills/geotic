let _id = 0;
const id = () => ++_id;

const hash = (n) => n.sort((a, b) => a > b).join('$');
const remove = (a, v) => a.splice(a.indexOf(v), 1);
const getComponent = (n) => components.get(n) || newComponent(n);
const clone = (o) => JSON.parse(JSON.stringify(o));
let sigs = new Map();
let tsigs = new Map();
let tags = new Map();
let entities = [];
let components = new Map();

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
  serialize() {
    return {
      id: this.id,
      tags: Object.keys(this.t),
      components: (() => {
        const s = [];
        for (let n of Object.keys(this.c)) {
          s.push({
            name: n,
            value: (this.c[n].serialize ? this.c[n].serialize() : clone(this.c[n]))
          });
        }
        return s;
      })()
    };
  }
  static deserialize(d) {
    const e = entity(d.id);
    d.tags.forEach(t => e.tag(t));
    d.components.forEach(c => {
      let m = getComponent(c.name);
      if (m.deserialize) {
        attachTo(e, c.name, m.deserialize(e, c.value));
      } else {
        if (typeof c.value !== 'object') {
          attachTo(e, c.name, c.value);
          return
        }
        const ins = m(e) || {};
        Object.assign(ins, c.value);
        attachTo(e, c.name, ins);
      }
    });
  }
  add(n, ...a) {
    attachTo(this, n, getComponent(n)(this, ...a));
    return this;
  }
  remove(n, ...a) {
    if (!this.c[n]) return;
    this.c[n].unmount && this.c[n].unmount(this, ...a);
    delete this.c[n];
    sigs.forEach(t => t.onRem(this, n));
    return this;
  }
  has(n) {
    return (!!this.c[n]);
  }
  destroy() {
    destroy(this);
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

const attachTo = (e, n, c) => {
  e.c[n] = c;
  c.mount && c.mount(e);
  sigs.forEach(s => s.onAdd(e));
}

const newComponent = (n) => {
  const c = (entity) => {};
  components.set(n, c);
  return c;
}

const newTag = (n) => {
  let t = {};
  tags.set(n, t);
  return t;
}

const szTags = () => {
  return [...tags].map(v => {
    return {
      name: v[0],
      value: v[1].serialize ? v[1].serialize() : clone(v[1])
    };
  });
}

const szEnts = () => entities.map(e => e.serialize());
export const getTag = (n) => tags.get(n) || newTag(n);
export const component = (n, d) => components.set(n, d);
export const findByComponent = (...n) => Signature.get(n).en;
export const findByTag = (...n) => TagSignature.get(n).en;
export const findById = (id) => entities.find(e => e.id === id);
export const serialize = () => ({ tags: szTags(), entities: szEnts() });
export const entity = (i = false) => {
  let e = new Entity(i || id());
  entities.push(e);
  sigs.forEach(t => t.match(e));
  return e;
}

export const deserialize = (data) => {
  data.tags.forEach(t => Object.assign(getTag(t.name), t.value));
  data.entities.forEach(e => Entity.deserialize(e));
}

export const destroy = (e) => {
  for (let n of Object.keys(e.c)) e.remove(n);
  for (let t of Object.keys(e.t)) e.untag(t);
  remove(entities, e);
}

export const clear = () => {
  entities.forEach(e => e.destroy());
  sigs = new Map();
  tsigs = new Map();
  tags = new Map();
  entities = [];
}

export default {
  clear,
  entity,
  getTag,
  destroy,
  findById,
  findByTag,
  serialize,
  deserialize,
  component,
  findByComponent
};
