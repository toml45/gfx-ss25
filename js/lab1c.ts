import { Camera } from "./camera.js";
import * as glm from "./gl-matrix/index.js";
import { Shader } from "./shader.js";
import { CoordinateVisual } from "./shape.js";

const main = async () => {
    const projectionMatrix = glm.mat4.create();
    const viewMatrix = glm.mat4.create();
    const globalCoords = new CoordinateVisual();
    const camera = new Camera(
        glm.vec3.fromValues(5, 5, 8.0),
        glm.vec3.fromValues(0, 1, 0),
        glm.vec3.fromValues(0, 0, 0),
    );

    //scale the visual of the WCS, so it appears bigger (only visual change)
    glm.mat4.scale(
        globalCoords.scalingMatrix,
        globalCoords.scalingMatrix,
        glm.vec3.fromValues(3.5, 3.5, 3.5)
    );

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

    globalCoords.initializeBuffersAndVAO(gl, sBase);

    /*
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
    }*/

    //NOTE: to emit typescript error about Offscreencanvas
    const cv = gl.canvas as HTMLCanvasElement;
    glm.mat4.ortho( //TODO: change to orthographic
        projectionMatrix, // Output
        glm.vec3.fromValues(),//left
        glm.vec3.fromValues(),//right
        glm.vec3.fromValues(),//bottom
        glm.vec3.fromValues(),//top
        glm.vec3.fromValues(),//near
        glm.vec3.fromValues(),//far
    );

    const draw = (_: any) => {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); 

        sBase.bind(gl);
        sBase.uniformMatrices(gl, projectionMatrix, camera.viewMatrix);
        //TODO: draw objects
        globalCoords.draw(gl, sBase);


        window.requestAnimationFrame(draw);

    }
    window.requestAnimationFrame(draw);
}


main();