import * as glm from './gl-matrix/index.js';

const createShader = (gl: WebGL2RenderingContext, type: GLenum, source: string) => {
    const shader = gl.createShader(type); //frag or vert shader create with type

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
}

const createProgram = (gl: WebGL2RenderingContext, vert: WebGLShader, frag: WebGLShader) => {

    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    // Checks if the linking worked
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
}


export class Shader {
    name: string;
    program: WebGLProgram = null;
    a_locVertexCoord = -1; // loc of vertex coordinates attribute
    a_locVertexColor = -1; // location of vertex color attribute
    a_locVertexNormal = -1;
    u_locLightPos: WebGLUniformLocation = null;
    u_locModelViewTansform: WebGLUniformLocation = null;
    u_locMVInverseTranspose: WebGLUniformLocation = null;
    u_locProjectionTransform: WebGLUniformLocation = null;
    u_locViewTransform: WebGLUniformLocation = null;
    u_globalTransform: WebGLUniformLocation = null;

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
        this.a_locVertexCoord = gl.getAttribLocation(
            this.program,
            "a_coords"
        );

        this.a_locVertexColor = gl.getAttribLocation(
            this.program,
            "a_color"
        );

        this.a_locVertexNormal = gl.getAttribLocation(
            this.program,
            "a_normal"
        );

        //uniforms to shader
        this.u_locModelViewTansform = gl.getUniformLocation(
            this.program,
            "u_modelView"
        ); // can be null 

        this.u_locMVInverseTranspose = gl.getUniformLocation(
            this.program,
            "u_modelViewInverseTranspose"
        );

        this.u_locProjectionTransform = gl.getUniformLocation(
            this.program,
            "u_projection"
        );

        this.u_locViewTransform = gl.getUniformLocation(
            this.program,
            "u_view"
        );

        this.u_locLightPos = gl.getUniformLocation(
            this.program,
            "u_lightPos"
        )


    }

    /**
     * Passes the projection and view matrices to the shader program.
     * 
     * @param {WebGL2RenderingContext} gl - The WebGL context.
     * @param {mat4} projectionMatrix - The projection matrix.
     * @param {mat4} viewMatrix - The view matrix.
     */
    uniformMatrices(gl: WebGL2RenderingContext, projectionMatrix: mat4, viewMatrix: mat4) {
        gl.uniformMatrix4fv(
            this.u_locProjectionTransform,
            false,
            projectionMatrix
        );

        gl.uniformMatrix4fv(
            this.u_locViewTransform,
            false,
            viewMatrix
        );
    }

    /**
     * Activate the shader program
     * @param {WebGL2RenderingContext} gl
    */
    bind(gl: WebGL2RenderingContext) {
        gl.useProgram(this.program);
    }

}