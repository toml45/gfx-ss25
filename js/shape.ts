import * as glm from "./gl-matrix/index.js";
import { Shader } from "./shader.js"

export class CoordinateVisual{
    vertexData = [
        0, 0, 0,
        1, 0, 0,

        0, 0, 0,
        0, 1, 0,

        0, 0, 0,
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
    scalingMatrix: mat4;
    positionTranslationMatrix: mat4;
    vaoIndex: WebGLVertexArrayObject; 

    constructor () { 
        this.scalingMatrix = glm.mat4.create();
        this.positionTranslationMatrix = glm.mat4.create();
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

    /**
    * @param {WebGL2RenderingContext} gl
    */
    createAndBindVAO(gl: WebGL2RenderingContext) {
        this.vaoIndex = gl.createVertexArray();
        gl.bindVertexArray(this.vaoIndex);
    }

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
        gl.enableVertexAttribArray(shader.locACoord);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        gl.vertexAttribPointer(
            shader.locACoord, 
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
        gl.enableVertexAttribArray(shader.locAColor);

        gl.vertexAttribPointer(
            shader.locAColor,
            3, // size for one color, vec3
            gl.FLOAT, // specify the data type of our coords
            false,
            0, // stride * sizeof float
            0 // offset * sizeof float
        );
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
            this.scalingMatrix,
            modelMatrix
        ); // Scales the object

        glm.mat4.multiply(
            modelMatrix,
            this.positionTranslationMatrix,
            modelMatrix
        ); // Puts the object in the right position

        gl.uniformMatrix4fv(
            shader.locUTransform,
            false,
            modelMatrix
        );
    }

    translate(translationVector: vec3) {
        glm.mat4.translate(
            this.positionTranslationMatrix,
            this.positionTranslationMatrix,
            translationVector
        )
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
            gl.LINES, // <- indexBuffer contains triangles
            this.indices.length,
            gl.UNSIGNED_SHORT, // <- because we used Uint16Array before 
            0 // Offset, 0 means we're not skipping anything
        );
    }
}

export class Shape {
    vertexData: number[];
    indices: number[];
    colors: number[];
    boundingBoxTransform: mat4;
    scalingMatrix: mat4;
    positionTranslationMatrix: mat4;
    vaoIndex: WebGLVertexArrayObject = null; // index of Vertex Array Object
    rotationMatrix: mat4;

    coordSystem: CoordinateVisual;

    constructor (vertexData: number[], indices: number[], colors: number[], boundingBoxTransform: mat4){ //TODO: find out what these are
        this.vertexData = vertexData;
        this.indices = indices;
        this.colors = colors;
        this.boundingBoxTransform = boundingBoxTransform;
        this.scalingMatrix = glm.mat4.create();
        this.positionTranslationMatrix = glm.mat4.create();
        this.coordSystem = new CoordinateVisual();
        this.rotationMatrix = glm.mat4.create();
    }

    /**
    * @param {WebGL2RenderingContext} gl
    * @param {Shader} shader
    */
    initializeBuffersAndVAO(gl: WebGL2RenderingContext, shader: Shader) {
        // Create our vertex array object
        this.coordSystem.initializeBuffersAndVAO(gl, shader);
        this.createAndBindVAO(gl);

        // These steps are recorded into our VAO
        this.createAndBindVertexBuffer(gl);
        this.enableAndBindVertexAttribs(gl, shader);
        this.createAndBindColorBuffer(gl);
        this.enableAndBindColorAttribs(gl, shader);
        this.createAndBindIndexBuffer(gl);
    }

    /**
    * @param {WebGL2RenderingContext} gl
    */
    createAndBindVAO(gl: WebGL2RenderingContext) {
        this.vaoIndex = gl.createVertexArray();
        gl.bindVertexArray(this.vaoIndex);
    }

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
        gl.enableVertexAttribArray(shader.locACoord);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        gl.vertexAttribPointer(
            shader.locACoord, 
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
        gl.enableVertexAttribArray(shader.locAColor);

        gl.vertexAttribPointer(
            shader.locAColor,
            3, // size for one color, vec3
            gl.FLOAT, // specify the data type of our coords
            false,
            0, // stride * sizeof float
            0 // offset * sizeof float
        );
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
        ); // Bounding box centering/scaling
 
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

        gl.uniformMatrix4fv(
            shader.locUTransform,
            false,
            modelMatrix
        );
    }

    translate(translationVector: vec3) {
        glm.mat4.translate(
            this.positionTranslationMatrix,
            this.positionTranslationMatrix,
            translationVector
        )
        //NOTE?
        this.coordSystem.translate(translationVector);
    }

    /**
    * @param {WebGL2RenderingContext} gl
    * @param {Shader} shader
    */
    draw(gl: WebGL2RenderingContext, shader: Shader, drawCoords: boolean = false) {
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
        if(drawCoords){

            this.coordSystem.draw(gl, shader);
        }
    }
}
