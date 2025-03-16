// Initialize WebGL
function initWebGL(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const gl = canvas.getContext("webgl");
    if (!gl) {
        console.error("WebGL not supported");
        return null;
    }
    return gl;
}

// Create shaders
function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Create and link shader program
function createProgram(gl: WebGLRenderingContext, vertexShaderSrc: string, fragmentShaderSrc: string): WebGLProgram | null {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program link error:", gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

// Vertex and Fragment Shaders
const vertexShaderSrc = `
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
`;

const fragmentShaderSrc = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);  // Red color
    }
`;

// Initialize WebGL and draw the triangle
function drawTriangle() {
    const gl = initWebGL("webglCanvas");
    if (!gl) return;

    // Define triangle vertices
    const vertices = new Float32Array([
        0.0,  0.5,  // Top
       -0.5, -0.5,  // Bottom left
        0.5, -0.5   // Bottom right
    ]);

    // Create vertex buffer
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Create shader program
    const program = createProgram(gl, vertexShaderSrc, fragmentShaderSrc);
    if (!program) return;

    gl.useProgram(program);

    // Get attribute location and enable it
    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Clear and draw
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// Run when the page loads
window.onload = drawTriangle;