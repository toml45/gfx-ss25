import { Camera } from "./camera.js";
import * as glm from "./gl-matrix/index.js";
import { Grid } from "./grid.js";
import { Shader } from "./shader.js";
import { CoordinateVisual } from "./coordinateVisual.js";
import { Cube } from "./cube.js";
import { Tetracube, TetracubeType } from "./tetracube.js";

const main = async () => {
    const projectionMatrix = glm.mat4.create();
    const viewMatrix = glm.mat4.create();
    const globalCoords = new CoordinateVisual();
    const grid = new Grid();
    const camera = new Camera(
        glm.vec3.fromValues(10, 5, 5.0),
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

    const sBase = new Shader("basic");
    await sBase.loadAndCompile(gl);
    const gd = new Shader("gouraud_diffuse");
    await gd.loadAndCompile(gl);

    const allCubes: Cube[] = [];
    globalCoords.initializeBuffersAndVAO(gl, sBase);
    grid.initializeBuffersAndVAO(gl, sBase);

    const toLightVector: vec3 = glm.vec3.fromValues(1, 1, 1);

    //NOTE: to emit typescript error about Offscreencanvas
    const cv = gl.canvas as HTMLCanvasElement;
    glm.mat4.ortho( //TODO: change to orthographic
        projectionMatrix, // Output
        -9, //left
        9, //right
        -7, //bottom
        7, //top
        0.1, //near
        100, //far
    );

    //-------------------Game varaibles--------------
    let activeTetrPresent = false;
    let lastUpdate = Date.now(); //for deltatime calculation
    let activeTetracube: Tetracube = null;

    const draw = (_: any) => {

        if (!activeTetrPresent) {
            activeTetracube = Tetracube.spawn(gl, gd);
            activeTetrPresent = true;
        }

        const now = Date.now();
        const deltaTime = now - lastUpdate;
        lastUpdate = now;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); 

        sBase.bind(gl);
        sBase.uniformMatrices(gl, projectionMatrix, camera.viewMatrix);
        globalCoords.draw(gl, sBase);
        grid.draw(gl, sBase);

        gd.bind(gl);
        gd.uniformMatrices(gl, projectionMatrix, camera.viewMatrix);
        gl.uniform3fv(gd.u_locLightPos, toLightVector);
        activeTetracube.draw(gl, gd);
        for (const cube of allCubes)
            cube.draw(gl, gd);

        if (!activeTetracube.checkGravityCollision() && !activeTetracube.checkCubeGravityCollision(allCubes)) {
            activeTetracube.moveDown(0.04);
        } else {
            activeTetrPresent = false;
            allCubes.push(...activeTetracube.toCubes());
        }
        console.log(allCubes);
        //console.log(testTetracube.cubes[0].getY());

        window.requestAnimationFrame(draw);

    }
    window.requestAnimationFrame(draw);
}

main();