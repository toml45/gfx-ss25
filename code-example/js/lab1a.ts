import * as glm from './gl-matrix/index.js';

/**
 * Creates and compiles a shader (vertex or fragment) from source code.
 * 
 * @param {WebGL2RenderingContext} gl - The WebGL context.
 * @param {GLenum} type - The type of shader
 * @param {string} source - The GLSL source code for the shader.
 * @returns {WebGLShader} The compiled shader.
 */
const createShader = (gl: WebGL2RenderingContext, type: GLenum, source: string) => {
    const shader: WebGLShader | null = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Check if the shader compiled successfully
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
}

/**
 * Links a vertex and fragment shader to create a WebGL program.
 * 
 * @param {WebGL2RenderingContext} gl - The WebGL context.
 * @param {WebGLShader} vertexShader - The compiled vertex shader.
 * @param {WebGLShader} fragmentShader - The compiled fragment shader.
 * @returns {WebGLProgram} The linked program.
 */
const createProgram = (gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // Checks if the linking worked
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
}

class Camera {
    eye = glm.vec3.fromValues(0.0, 0.0, 10.0);

    constructor() {
        this.viewMatrix = this.initViewMatrix(this.eye);
    }

    /**
     * Initializes the camera's view matrix based on the eye position
     * (camera location).
     * 
     * @param {vec3} eye - The camera's position in 3D space.
     * @returns {mat4} The view matrix.
     */
    initViewMatrix(eye) {
        const viewMatrix = glm.mat4.create();
        const target = glm.vec3.create();
        glm.vec3.add(target, eye, glm.vec3.fromValues(0, 0, -1));
        glm.mat4.lookAt(viewMatrix, eye, target, [0, 1, 0]);

        return viewMatrix;
    }
}

class Shader {
    // Fields
    name = '';
    program = -1;
    locACoord = -1; // Location of vertex coordinates attribute
    locAColor = -1; // Location of vertex color attribute
    locUTransform = -1; // Location of the model transformation matrix
    locPTransform = -1; // Location of the projection matrix
    locVTransform = -1; // Location of the view matrix

    constructor(name) {
        this.name = name;
    }

    /**
     * Loads, compiles, and links the vertex and fragment shaders from
     * external files.
     * 
     * @param {WebGL2RenderingContext} gl - The WebGL context.
     */
    async loadAndCompile(gl) {
        const vertShaderSrc = await fetch(`shaders/${this.name}.vert`)
            .then(r => r.text());
        const vertShader = createShader(
            gl,
            gl.VERTEX_SHADER,
            vertShaderSrc
        );

        const fragShaderSrc = await fetch(`shaders/${this.name}.frag`)
            .then(r => r.text());
        const fragShader = createShader(
            gl,
            gl.FRAGMENT_SHADER,
            fragShaderSrc
        );

        this.program = createProgram(
            gl,
            vertShader,
            fragShader
        );

        // Get attribute locations from the shader program
        this.locACoord = gl.getAttribLocation(
            this.program,
            "a_coords"
        );

        this.locAColor = gl.getAttribLocation(
            this.program,
            "a_color"
        );

        // Get uniform locations from the shader program
        this.locUTransform = gl.getUniformLocation(
            this.program,
            "u_transform"
        )


        this.locPTransform = gl.getUniformLocation(
            this.program,
            "u_projection"
        );

        this.locVTransform = gl.getUniformLocation(
            this.program,
            "u_view"
        );
    }

    /**
     * Passes the projection and view matrices to the shader program.
     * 
     * @param {WebGL2RenderingContext} gl - The WebGL context.
     * @param {mat4} projectionMatrix - The projection matrix.
     * @param {mat4} viewMatrix - The view matrix.
     */
    uniformMatrices(gl, projectionMatrix, viewMatrix) {
        gl.uniformMatrix4fv(
            this.locPTransform,
            false,
            projectionMatrix
        );

        gl.uniformMatrix4fv(
            this.locVTransform,
            false,
            viewMatrix
        );
    }

    /**
     * Activate the shader program
     * @param {WebGL2RenderingContext} gl
    */
    bind(gl) {
        gl.useProgram(this.program);
    }
}

class Shape {
    vertexData;
    indices;
    colors;
    boundingBoxTransform;
    scalingMatrix;
    positionTranslationMatrix;
    vaoIndex = -1; // index of Vertex Array Object

    constructor(vertexData, indices, colors, boundingBoxTransform) {
        this.vertexData = vertexData;
        this.indices = indices;
        this.colors = colors
        this.scalingMatrix = glm.mat4.create();
        this.positionTranslationMatrix = glm.mat4.create();
        this.boundingBoxTransform = boundingBoxTransform;
    }

    /**
    * @param {WebGL2RenderingContext} gl
    */
    initializeBuffersAndVAO(gl, shader) {
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
    createAndBindVAO(gl) {
        this.vaoIndex = gl.createVertexArray();
        gl.bindVertexArray(this.vaoIndex);
    }

    /**
    * @param {WebGL2RenderingContext} gl
    */
    createAndBindVertexBuffer(gl) {
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
    createAndBindIndexBuffer(gl) {
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
    */
    createAndBindColorBuffer(gl) {
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
    */
    enableAndBindVertexAttribs(gl, shader) {
        gl.enableVertexAttribArray(shader.locACoord);

        // Specify coordinate formate for vertex shader attribute
        gl.vertexAttribPointer(
            shader.locACoord,
            3, // size for one coordinate, vec3
            gl.FLOAT, // specify the data type of our coords
            false,
            0, // stride * sizeof float
            0 // offset
        );
    }

    /**
    * @param {WebGL2RenderingContext} gl
    */
    enableAndBindColorAttribs(gl, shader) {
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
    */
    update(gl, shader) {
        const modelMatrix = glm.mat4.create();

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

    translate(translationVector) {
        glm.mat4.translate(
            this.positionTranslationMatrix,
            this.positionTranslationMatrix,
            translationVector
        )
    }

    /**
    * @param {WebGL2RenderingContext} gl
    */
    draw(gl, shader) {
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
    }
}

//const generateFromOBJFile = (objFile) => {
//    const objParser = new OBJParser();
//    const objData = objParser.parse(objFile);
//
//    const colorsArray = [
//        [136.0 / 255.0, 213.0 / 255.0, 213.0 / 255.0],
//        [136.0 / 255.0, 213.0 / 255.0, 213.0 / 255.0],
//        [136.0 / 255.0, 213.0 / 255.0, 213.0 / 255.0]
//    ]
//
//    const colors = [];
//
//    for (let i = 0; i < objData.vertices.length / 3; i++) {
//        const color = colorsArray[i % 3]; // cycle through the colorsArray
//        colors.push(
//            ...color
//        );
//    }
//    
//    return new Shape(
//        objData.vertices,
//        objData.indices,
//        colors,
//        objData.boundingBoxTransform
//    );
//}

const generateSquare = () => {
    return new Shape(
        [   // Vertex Data
            -0.5, -0.5, 0.0,
            0.5, -0.5, 0.0,
            0.5, 0.5, 0.0,
            -0.5, 0.5, 0.0
        ],
        [   // Indices
            0, 2, 1,
            0, 2, 3
        ],
        [   // Color
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0
        ],
        glm.mat4.create()
    )
}

const main = async () => {
    const camera = new Camera();
    const projectionMatrix = glm.mat4.create();
    const globalTransformationMatrix = glm.mat4.create();
    const updatedViewMatrix = glm.mat4.create();

    const canvas = document.querySelector("#glcanvas");

    /**
     * @type {WebGL2RenderingContext}
    */
    const gl = canvas.getContext("webgl2");

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Check if WebGL is available in the browser
    if (gl === null) {
        console.log("WebGL is not available in this browser");
        return;
    }

    // Load shaders
    const sBase = new Shader("basic");
    await sBase.loadAndCompile(gl);

    // Load models
    //const cube = await fetch('/sampleModels/cube.obj')
    //    .then(response => response.text());
    //const teapot = await fetch('/sampleModels/teapot.obj')
    //    .then(response => response.text());
    //const bunny = await fetch('/sampleModels/bunny.obj')
    //    .then(response => response.text());
    //const tetrahedron = await fetch('/sampleModels/tetrahedron.obj')
    //    .then(response => response.text());

    // Initialize objects
    const objects = [];

    objects.push(generateSquare());
    objects[0].translate([-3.0, 2.5, 0.0]); // Move it to the correct pos

    objects.push(generateSquare());
    objects[1].translate([0.0, 2.5, 0.0])

    objects.push(generateSquare());
    objects[2].translate([3.0, 2.5, 0.0])

    objects.push(generateSquare());
    objects[3].translate([-3.0, 0.0, 0.0])

    objects.push(generateSquare());
    objects[4].translate([0.0, 0.0, 0.0])

    objects.push(generateSquare());
    objects[5].translate([3.0, 0.0, 0.0])

    objects.push(generateSquare());
    objects[6].translate([-3.0, -2.5, 0.0])

    objects.push(generateSquare());
    objects[7].translate([0.0, -2.5, 0.0])

    objects.push(generateSquare());
    objects[8].translate([3.0, -2.5, 0.0])

    // Build VAOs for all objects with base shader
    for (const eachObject of objects) {
        eachObject.initializeBuffersAndVAO(gl, sBase);
    }

    glm.mat4.perspective(
        projectionMatrix, // Output
        (45 * Math.PI) / 180, // Field of view in radians
        gl.canvas.clientWidth / gl.canvas.clientHeight, // Aspect ratio
        0.1, // Near
        100.0 // Far
    );

    const draw = (_) => {
        // Clear the screen with black color
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        //gl.clear(gl.COLOR_BUFFER_BIT);

        // Clear the color and depth buffers
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        glm.mat4.multiply(
            updatedViewMatrix,
            camera.viewMatrix,
            globalTransformationMatrix
        );

        sBase.bind(gl);
        sBase.uniformMatrices(gl, projectionMatrix, updatedViewMatrix);

        // Draw all the objects
        for (const eachObject of objects) {
            eachObject.draw(gl, sBase);
        }

        window.requestAnimationFrame(draw);
    };

    window.requestAnimationFrame(draw);
}

main();
