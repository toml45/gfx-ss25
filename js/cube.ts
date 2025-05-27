import * as glm from "./gl-matrix/index.js";
import { Shader } from "./shader.js";
import { Entity } from "./entity.js";



export class Cube extends Entity {
    static cubeVertexData = [
        // Vertex Data
        -0.5, 0.5, 0.5,
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,

        -0.500000, 0.500000, - 0.500000,
        0.500000, - 0.500000, - 0.500000,
        -0.500000, - 0.500000, - 0.500000,

        0.500000, 0.500000, -0.500000,
        0.500000, -0.500000, 0.500000,
        0.500000, -0.500000, -0.500000,

        0.500000, 0.500000, 0.500000,
        - 0.500000, - 0.500000, 0.500000,
        0.500000, - 0.500000, 0.500000,

        0.500000, - 0.500000, - 0.500000,
        - 0.500000, - 0.500000, 0.500000,
        - 0.500000, - 0.500000, - 0.500000,

        - 0.500000, 0.500000, - 0.500000,
        0.500000, 0.500000, 0.500000,
        0.500000, 0.500000, - 0.500000,

        - 0.500000, 0.500000, 0.500000,
        - 0.500000, 0.500000, - 0.500000,
        - 0.500000, - 0.500000, - 0.500000,

        - 0.500000, 0.500000, - 0.500000,
        0.500000, 0.500000, - 0.500000,
        0.500000, - 0.500000, - 0.500000,

        0.500000, 0.500000, - 0.500000,
        0.500000, 0.500000, 0.500000,
        0.500000, - 0.500000, 0.500000,

        0.500000, 0.500000, 0.500000,
        -0.500000, 0.500000, 0.500000,
        -0.500000, - 0.500000, 0.500000,

        0.500000, - 0.500000, - 0.500000,
        0.500000, - 0.500000, 0.500000,
        -0.500000, - 0.500000, 0.500000,

        -0.500000, 0.500000, - 0.500000,
        -0.500000, 0.500000, 0.500000,
        0.500000, 0.500000, 0.500000,
    ];
    static cubeNormalData = [
        - 1.0000, 0.0000, 0.0000,
        - 1.0000, 0.0000, 0.0000,
        - 1.0000, 0.0000, 0.0000,

        0.0000, 0.0000, -1.0000,
        0.0000, 0.0000, -1.0000,
        0.0000, 0.0000, -1.0000,

        1.0000, 0.0000, 0.0000,
        1.0000, 0.0000, 0.0000,
        1.0000, 0.0000, 0.0000,

        0.0000, 0.0000, 1.0000,
        0.0000, 0.0000, 1.0000,
        0.0000, 0.0000, 1.0000,

        0.0000, -1.0000, 0.0000,
        0.0000, -1.0000, 0.0000,
        0.0000, -1.0000, 0.0000,

        0.0000, 1.0000, 0.0000,
        0.0000, 1.0000, 0.0000,
        0.0000, 1.0000, 0.0000,

        - 1.0000, 0.0000, 0.0000,
        - 1.0000, 0.0000, 0.0000,
        - 1.0000, 0.0000, 0.0000,

        0.0000, 0.0000, -1.0000,
        0.0000, 0.0000, -1.0000,
        0.0000, 0.0000, -1.0000,

        1.0000, 0.0000, 0.0000,
        1.0000, 0.0000, 0.0000,
        1.0000, 0.0000, 0.0000,

        0.0000, 0.0000, 1.0000,
        0.0000, 0.0000, 1.0000,
        0.0000, 0.0000, 1.0000,

        0.0000, -1.0000, 0.0000,
        0.0000, -1.0000, 0.0000,
        0.0000, -1.0000, 0.0000,

        0.0000, 1.0000, 0.0000,
        0.0000, 1.0000, 0.0000,
        0.0000, 1.0000, 0.0000,
    ];


    normalData: number[];
    boundingBoxTransform: mat4;
    //coordSystem: CoordinateVisual;
    globalTranslationMatrix: mat4;

    constructor(
        color: vec3,
    ) {
        super();

        this.vertexData = Cube.cubeVertexData;
        this.boundingBoxTransform = glm.mat4.create(); //TODO: will i do anything with this?
        this.scalingMatrix = glm.mat4.create();
        this.positionTranslationMatrix = glm.mat4.create();
        this.rotationMatrix = glm.mat4.create();
        this.globalTransformMatrix = glm.mat4.create();
        this.globalTranslationMatrix = glm.mat4.create();
        this.normalData = Cube.cubeNormalData;
        this.indices = [];
        this.colors = [];

        for (let i = 0; i < this.vertexData.length; i++) {
            this.indices.push(i);
            this.colors.push(color[0], color[1], color[2]);
        }
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
            this.boundingBoxTransform,
            modelMatrix
        ); // Bounding box centering/scaling

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

        const modelInverseTranspose: mat3 = glm.mat3.create();
        glm.mat3.normalFromMat4(modelInverseTranspose, modelMatrix);

        gl.uniformMatrix3fv(
            shader.u_locMVInverseTranspose,
            false,
            modelInverseTranspose
        );

    }

    /**
    * @param {WebGL2RenderingContext} gl
    * @param {Shader} shader
    */
    initializeBuffersAndVAO(gl: WebGL2RenderingContext, shader: Shader) {
        //this.coordSystem.initializeBuffersAndVAO(gl, shader);
        // Create our vertex array object
        this.createAndBindVAO(gl);

        // These steps are recorded into our VAO
        this.createAndBindVertexBuffer(gl);
        this.enableAndBindVertexAttribs(gl, shader);
        this.createAndBindNormalBuffer(gl);
        this.enableAndBindNormalAttribs(gl, shader);
        this.createAndBindColorBuffer(gl);
        this.enableAndBindColorAttribs(gl, shader);
        this.createAndBindIndexBuffer(gl);
    }

    /**
    * @param {WebGL2RenderingContext} gl
    */
    createAndBindNormalBuffer(gl: WebGL2RenderingContext) {
        const normalBuffer = gl.createBuffer();
        // we use ARRAY_BUFFER for coordinates
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        // Store the data in the buffer
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.normalData),
            gl.STATIC_DRAW
        );
    }

    /**
    * @param {WebGL2RenderingContext} gl
    * @param {Shader} shader
    */
    enableAndBindNormalAttribs(gl: WebGL2RenderingContext, shader: Shader) {
        gl.enableVertexAttribArray(shader.a_locVertexNormal);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        gl.vertexAttribPointer(
            shader.a_locVertexNormal,
            3,        // 3 components per iteration, vec3
            gl.FLOAT, // the data is 32bit floats
            false,    // don't normalize the data
            0,        // 0 = move forward size * sizeof(type) each iteration to get the next position
            0         // start at the beginning of the buffer
        );
    }

    /**
    * @param {WebGL2RenderingContext} gl
    * @param {Shader} shader
    */
    draw(gl: WebGL2RenderingContext, shader: Shader, drawCoords = false) {
        this.update(gl, shader);

        // Bind VAO
        gl.bindVertexArray(this.vaoIndex);

        // Draw
        gl.drawElements(
            gl.TRIANGLES, // <- indexBuffer contains triangles
            this.indices.length,
            gl.UNSIGNED_SHORT, // <- because we used Uint16Array before 
            0 // Offset, 0 means we're not skipping anything
        );
        //if (drawCoords)
        //    this.coordSystem.draw(gl, shader);
    }

}