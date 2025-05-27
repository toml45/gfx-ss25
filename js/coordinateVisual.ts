import * as glm from "./gl-matrix/index.js";
import { Shader } from "./shader.js";
import { Entity } from './entity.js'

export class CoordinateVisual extends Entity {
    vertexData = [
        -1, 0, 0,
        1, 0, 0,

        0, -1, 0,
        0, 1, 0,

        0, 0, -1,
        0, 0, 1
    ]
    indices = [
        0, 1,
        2, 3,
        4, 5
    ];
    colors = [
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,

        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,

        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0
    ];

    globalTranslationMatrix: mat4;
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
        this.globalTranslationMatrix = glm.mat4.create()
    }

    /**
     * Update the model matrix and send it to the shader program
     * @param {WebGL2RenderingContext} gl
     * @param {Shader} shader
    */
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

        glm.mat4.multiply(
            modelMatrix,
            this.globalTranslationMatrix,
            modelMatrix
        );

        gl.uniformMatrix4fv(
            shader.u_locModelViewTansform,
            false,
            modelMatrix
        );
    }

    /**
    * @param {WebGL2RenderingContext} gl
    * @param {Shader} shader
    */
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
}