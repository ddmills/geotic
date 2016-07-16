'use strict';

import Library from './Library';
import Component from './Component';
import SignatureList from './SignatureList';
import EntityList from './EntityList';
import Entity from './Entity';
import System from './System';
import World from './World';


let entityList = new EntityList();
let signatureList = new SignatureList(entityList);

let world = new World(entityList, signatureList);
let entity = new Entity(25);
let component = new Component();
let system = new System();

entity.addComponent(component);
world.addEntity(entity);
world.addSystem(system);


world.update();
