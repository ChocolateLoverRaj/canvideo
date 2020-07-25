Canvideo uses ESModules. It is recommended that you also use ESModules. You can still use canvideo with CommonJS, because it is converted into a CommonJS file using rollup. You don't have to do anything different with the path. 

ESModule: import { Video } from 'canvideo';
CommonJS: const { Video } = require('canvideo');