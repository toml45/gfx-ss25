import * as glm from "./gl-matrix/index.js";
import { Shader } from "./shader.js"

export abstract class Entity {
    vertexData: number[];
    indices: number[];
    colors: number[];
    scalingMatrix: mat4;
    positionTranslationMatrix: mat4;
    rotationMatrix: mat4;
    globalTransformMatrix: mat4;
    vaoIndex: WebGLVertexArrayObject = null;

    constructor() {
    }

    /**
    * @param {WebGL2RenderingContext} gl
    * @param {Shader} shader
    */
    initializeBuffersAndVAO(gl: WebGL2RenderingContext, shader: Shader) {
        // Create our vertex array object
        this.createAndBindVAO(gl);

        // These steps are recorded into our VAO
        this.createAndBindVertexBuffer(gl);
        this.enableAndBindVertexAttribs(gl, shader);
        this.createAndBindColorBuffer(gl);
        this.enableAndBindColorAttribs(gl, shader);
        this.createAndBindIndexBuffer(gl);

    }

    createAndBindVAO(gl: WebGL2RenderingContext) {
        this.vaoIndex = gl.createVertexArray();
        gl.bindVertexArray(this.vaoIndex);
    }

    //TODO: translate function is horrid, do we need?

    /**
    * @param {WebGL2RenderingContext} gl
    */
    createAndBindVertexBuffer(gl: WebGL2RenderingContext) {
        const vertexBuffer = gl.createBuffer();
        // we use ARRAY_BUFFER for coordinates
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // Store the data in the buffer
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.vertexData),
            gl.STATIC_DRAW
        );
    }

    /**
    * @param {WebGL2RenderingContext} gl
    */
    createAndBindIndexBuffer(gl: WebGL2RenderingContext) {
        const indexBuffer = gl.createBuffer();
        // we use ELEMENT_ARRAY_BUFFER for indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        // Store the data in the buffer
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.indices), // gl.UNSIGNED_SHORT
            gl.STATIC_DRAW
        );
    }

    /**
    * @param {WebGL2RenderingContext} gl
    * @param {Shader} shader
    */
    enableAndBindVertexAttribs(gl: WebGL2RenderingContext, shader: Shader) {
        gl.enableVertexAttribArray(shader.a_locVertexCoord);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        gl.vertexAttribPointer(
            shader.a_locVertexCoord,
            3,        // 3 components per iteration, vec3
            gl.FLOAT, // the data is 32bit floats
            false,    // don't normalize the data
            0,        // 0 = move forward size * sizeof(type) each iteration to get the next position
            0         // start at the beginning of the buffer
        );
    }


    /**
    * @param {WebGL2RenderingContext} gl
    */
    createAndBindColorBuffer(gl: WebGL2RenderingContext) {
        const colorBuffer = gl.createBuffer();
        // We use ARRAY_BUFFER for colors
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        // Store the data in the buffer
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.colors),
            gl.STATIC_DRAW
        );
    }


    /**
    * @param {WebGL2RenderingContext} gl
    * @param {Shader} shader
    */
    enableAndBindColorAttribs(gl: WebGL2RenderingContext, shader: Shader) {
        gl.enableVertexAttribArray(shader.a_locVertexColor);

        gl.vertexAttribPointer(
            shader.a_locVertexColor,
            3, // size for one color, vec3
            gl.FLOAT, // specify the data type of our coords
            false,
            0, // stride * sizeof float
            0 // offset * sizeof float
        );
    }

    initTranslate(translationVector: vec3) {
        glm.mat4.translate(
            this.positionTranslationMatrix,
            this.positionTranslationMatrix,
            translationVector
        )
    }

    /**
     * Update the model matrix and send it to the shader program
     * @param {WebGL2RenderingContext} gl
     * @param {Shader} shader
    */
    abstract update(gl: WebGL2RenderingContext, shader: Shader): void;


    /**
    * @param {WebGL2RenderingContext} gl
    * @param {Shader} shader
    */
    abstract draw(gl: WebGL2RenderingContext, shader: Shader): void;
}