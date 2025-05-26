import * as glm from "./gl-matrix/index.js";

const main = async () => {
    const projectionMatrix = glm.mat4.create();
    const viewMatrix = glm.mat4.create();

    const canvas: HTMLCanvasElement | null = document.querySelector("#glcanvas");

    if (canvas === null) {
        console.log("No canvas element was found");
        return;
    }

    const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2");
    if (gl === null) {
        console.log(
            "Unable to initialize WebGL. Your browser or machine may not support it."
        );
        return;
    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const sBase = new Shader("basic"); //TODO: load shader
    await sBase.loadAndCompile(gl);

    function generatePlane() {
        return new Shape(
            [
                -8.0, -3.0, -8.0,
                -8.0, -3.0, 8.0,
                8.0, -3.0, -8.0,
                8.0, -3.0, 8.0,
            ],
            [
                0, 1, 2,
                2, 3, 1
            ],
            [
                0.5, 0.5, 0.5,
                0.5, 0.5, 0.5,
                0.5, 0.5, 0.5,
                0.5, 0.5, 0.5
            ],
            glm.mat4.create(),
            [
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
            ]
        );
    }

    //NOTE: to emit typescript error about Offscreencanvas
    const cv = gl.canvas as HTMLCanvasElement;
    glm.mat4.perspective( //TODO: change to orthographic
        projectionMatrix, // Output
        (45 * Math.PI) / 180, // Field of view in radians
        cv.clientWidth / cv.clientHeight, // Aspect ratio
        0.1, // Near
        100.0 // Far
    );

    const draw = (_: any) => {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); 

        sBase.bind(gl);
        sBase.uniformMatrices(gl, projectionMatrix, viewMatrix);

        //TODO: draw objects


        window.requestAnimationFrame(draw);

    }
}