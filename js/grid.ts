import { Entity } from "./entity.js";
import * as glm from './gl-matrix/index.js'
import { Shader } from "./shader.js";

export class Grid extends Entity {

    drawDebugGrid: boolean;
    gridVolumeCenter: vec3;
    vertexDebugMap: Map<string, number>
    vertexMap: Map<string, number>
    debugIndices: number[];
    gridIndices: number[];

    constructor(
        scalingMatrix: mat4 = glm.mat4.create(),
        positionTranslationMatrix: mat4 = glm.mat4.create(),
        rotationMatrix: mat4 = glm.mat4.create(),
        globalTransformMatrix: mat4 = glm.mat4.create(),
    ) {
        super();
        this.scalingMatrix = scalingMatrix;
        this.positionTranslationMatrix = positionTranslationMatrix;
        this.rotationMatrix = rotationMatrix;
        this.globalTransformMatrix = globalTransformMatrix;

        //grid is going to be 4x4x10, where the center is our origin.
        this.drawDebugGrid = true; //TODO change
        this.gridVolumeCenter = glm.vec3.fromValues(0, 0, 0);
        this.vertexData = [];
        this.indices = [];
        this.gridIndices = [];
        this.debugIndices = [];
        this.colors = [];
        this.vertexDebugMap = new Map();
        this.vertexMap = new Map();

        let i = 0;
        for (let x = 2; x >= -2; x--) {
            for (let y = 5; y >= -5; y--) {
                for (let z = 2; z >= -2; z--) {
                    this.vertexData.push(x, y, z);
                    this.colors.push(1.0, 1.0, 1.0);
                    this.vertexDebugMap.set(
                        glm.vec3.str(glm.vec3.fromValues(x, y, z)),
                        i
                    );
                    if (x == -2 || y == -5 || z == -2)
                        this.vertexMap.set(
                            glm.vec3.str(glm.vec3.fromValues(x, y, z)),
                            i
                        );

                    i++;
                }
            }
        }

        console.log(this.vertexMap)
        for (let x = 2; x >= -2; x--) {
            for (let y = 5; y >= -5; y--) {
                for (let z = 2; z >= -2; z--) {
                    const curVertexStr = glm.vec3.str(glm.vec3.fromValues(x, y, z));
                    const x1 = glm.vec3.str(glm.vec3.fromValues(x + 1, y, z));
                    const x2 = glm.vec3.str(glm.vec3.fromValues(x - 1, y, z));
                    const y1 = glm.vec3.str(glm.vec3.fromValues(x, y + 1, z));
                    const y2 = glm.vec3.str(glm.vec3.fromValues(x, y - 1, z));
                    const z1 = glm.vec3.str(glm.vec3.fromValues(x, y, z - 1));
                    const z2 = glm.vec3.str(glm.vec3.fromValues(x, y, z + 1));
                    const v1 = this.vertexMap.get(curVertexStr);


                    if (this.vertexDebugMap.has(x1)) {
                        const v2 = this.vertexDebugMap.get(x1)
                        this.debugIndices.push(v1, v2);
                    }
                    if (this.vertexDebugMap.has(x2)) {
                        const v2 = this.vertexDebugMap.get(x2)
                        this.debugIndices.push(v1, v2);
                    }
                    if (this.vertexDebugMap.has(y1)) {
                        const v2 = this.vertexDebugMap.get(y1)
                        this.debugIndices.push(v1, v2);
                    }
                    if (this.vertexDebugMap.has(y2)) {
                        const v2 = this.vertexDebugMap.get(y2)
                        this.debugIndices.push(v1, v2);
                    }
                    if (this.vertexDebugMap.has(z1)) {
                        const v2 = this.vertexDebugMap.get(z1)
                        this.debugIndices.push(v1, v2);
                    }
                    if (this.vertexDebugMap.has(z2)) {
                        const v2 = this.vertexDebugMap.get(z2)
                        this.debugIndices.push(v1, v2);
                    }

                    if (!this.vertexMap.has(curVertexStr)) continue;
                    //for non-debug grid
                    if (this.vertexMap.has(x1)) {
                        const v2 = this.vertexMap.get(x1)
                        this.gridIndices.push(v1, v2);
                    }
                    if (this.vertexMap.has(x2)) {
                        const v2 = this.vertexMap.get(x2)
                        this.gridIndices.push(v1, v2);
                    }
                    if (this.vertexMap.has(y1)) {
                        const v2 = this.vertexMap.get(y1)
                        this.gridIndices.push(v1, v2);
                    }
                    if (this.vertexMap.has(y2)) {
                        const v2 = this.vertexMap.get(y2)
                        this.gridIndices.push(v1, v2);
                    }
                    if (this.vertexMap.has(z1)) {
                        const v2 = this.vertexMap.get(z1)
                        this.gridIndices.push(v1, v2);
                    }
                    if (this.vertexMap.has(z2)) {
                        const v2 = this.vertexMap.get(z2)
                        this.gridIndices.push(v1, v2);
                    }
                }
            }
        }
        this.indices = this.gridIndices;
    }

    toggleDebugGrid() {
        this.drawDebugGrid = !this.drawDebugGrid;
        //TODO: make it proper
    }

    draw(gl: WebGL2RenderingContext, shader: Shader) {
        this.update(gl, shader);

        // Bind VAO
        gl.bindVertexArray(this.vaoIndex);

        // Draw
        gl.drawElements(
            gl.LINES,
            this.indices.length,
            gl.UNSIGNED_SHORT, // <- because we used Uint16Array before 
            0 // Offset, 0 means we're not skipping anything
        );
    }
    update(gl: WebGL2RenderingContext, shader: Shader) {
        const modelMatrix = glm.mat4.create();

        glm.mat4.multiply(
            modelMatrix,
            this.rotationMatrix,
            modelMatrix
        );

        glm.mat4.multiply(
            modelMatrix,
            this.scalingMatrix,
            modelMatrix
        ); // Scales the object

        glm.mat4.multiply(
            modelMatrix,
            this.positionTranslationMatrix,
            modelMatrix
        ); // Puts the object in the right position

        glm.mat4.multiply(
            modelMatrix,
            this.globalTransformMatrix,
            modelMatrix
        );


        gl.uniformMatrix4fv(
            shader.u_locModelViewTansform,
            false,
            modelMatrix
        );


    }
}