import * as glm from "./gl-matrix/index.js";
import { Shader } from "./shader.js";
import { Entity } from "./entity.js";

export class Shape {
    vertexData: number[];
    indices: number[];
    colors: number[];

    scalingMatrix: mat4;
    positionTranslationMatrix: mat4;
    rotationMatrix: mat4;
    globalTransformationmatrix: mat4;
    vaoIndex: WebGLVertexArrayObject = null;

    constructor() { }
}