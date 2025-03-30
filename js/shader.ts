//TODO: look at these 2 fujncs
import * as glm from "./gl-matrix/index.js";

/**
 * Creates and compiles a shader (vertex or fragment) from source code.
 * 
 * @param {WebGL2RenderingContext} gl - The WebGL context.
 * @param {GLenum} type - The type of shader
 * @param {string} source - The GLSL source code for the shader.
 * @returns {WebGLShader} The compiled shader.
 */
const createShader = (gl: WebGL2RenderingContext, type:GLenum, source:string) => {
    const shader = gl.createShader(type);

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

export class Shader {
    name: string = '';
    program: WebGLProgram = null; 
    locACoord = -1; // loc of vertex coordinates attribute
    locAColor = -1; // location of vertex color attribute
    locUTransform: WebGLUniformLocation = null; // TODO: (understand) location of the model transformation matrix
    locPTransform: WebGLUniformLocation = null; // location of the projection matrix
    locVTransform: WebGLUniformLocation = null; // TODO: (understand) location of view matrix
    globTransform: WebGLUniformLocation = null;

    constructor(name: string) {
        this.name = name;
    }

    /**
     * Loads, compiles, and links the vertex and fragment shaders from
     * external files.
     * 
     * @param {WebGL2RenderingContext} gl - The WebGL context.
     */
    async loadAndCompile(gl: WebGL2RenderingContext) {
        const vertShaderSrc = await fetch(`shaders/${this.name}.vert`).then(r => r.text());
        const vertShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);


        const fragShaderSrc = await fetch(`shaders/${this.name}.frag`)
            .then(r => r.text());
        const fragShader = createShader(
            gl,
            gl.FRAGMENT_SHADER,
            fragShaderSrc
        );

        this.program = createProgram(gl, vertShader, fragShader);
        
        //attributes to shader
        this.locACoord = gl.getAttribLocation(
            this.program,
            "a_coords"
        );

        this.locAColor = gl.getAttribLocation(
            this.program,
            "a_color"
        );

        //uniforms to shader
        this.locUTransform = gl.getUniformLocation(
            this.program,
            "u_modelView"
        ); // can be null 

        this.globTransform = gl.getUniformLocation(
            this.program,
            "u_globalTransform"
        ); // can be null 

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
    uniformMatrices(gl: WebGL2RenderingContext, projectionMatrix: mat4, viewMatrix: mat4, globT: mat4){
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

        gl.uniformMatrix4fv(
            this.globTransform,
            false,
            globT
        );
    }


    /**
     * Activate the shader program
     * @param {WebGL2RenderingContext} gl
    */
    bind(gl: WebGL2RenderingContext){
        gl.useProgram(this.program);
    }
}