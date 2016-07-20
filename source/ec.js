let id = 0;
const hash = (n) => n.sort((a, b) => a > b).join('$');
const remove = (a, v) => a.splice(a.indexOf(v), 1);
const intersects = (a, b) => {
  for (let k of a) {
    if (b.includes(k)) return true;
  }
  return false;
}


export const withComponents = (...n) => getTag(n).en;

const tags = new Map();
const entities = [];
const components = new Map();

export const getTag = (n) => {
  let h = hash(n);
  return tags.has(h) ? tags.get(h) : makeTag(n, h);
}

const makeTag = (n, h) => {
  const t = new tag(n);
  tags.set(h, t);
  return t;
}

class tag {
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
    c in this.na && remove(this.en, e);
  }
}

export const component = (n, d) => {
  d.name = n;
  components.set(n, d);
}

export const newComponent = (c) => {
  components.set(c.name, c);
  return c;
}

export const getComponent = (n) => {
  if (components.has(n)) {
    return components.get(n);
  }
  return newComponent(n)
  components.set(c.name, c);
  return c;
}


const add = (e, n) => {
  let c = getComponent(n);
  e.c[n] = c;
  tags.forEach(t => t.onAdd(e, c.name));
  return e;
}

export class entity {
  constructor() { this.c = {} }
  add(n) {
    add(this, n);
    return this;
  }
}

export const addEntity = (e) => {
  e.id = `e${++id}`;
  entities.push(e);
  tags.forEach(t => t.match(e));
}

export const find = {
  entities: {
    with: {
      components: (...n) => getTag(n).en
    }
  },
  tag: (...n) => getTag(n)
}
