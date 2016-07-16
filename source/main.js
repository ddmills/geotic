'use strict';

import World from './World';
import Entity from './Entity';
import System from './System';
import Library from './Library';
import Component from './Component';
import EntityList from './EntityList';
import SignatureList from './SignatureList';


let entityList = new EntityList();
let signatureList = new SignatureList(entityList);

let world = new World(entityList, signatureList);
let entity = new Entity(25);
let component = new Component();
let system = new System();

world.addEntity(entity);
world.addSystem(system);

world.update();
entity.addComponent(component);
world.update();
entity.removeComponent(component);
world.update();
