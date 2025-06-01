import { Camera } from "./camera.js";
import * as glm from "./gl-matrix/index.js";
import { Grid } from "./grid.js";
import { Shader } from "./shader.js";
import { CoordinateVisual } from "./coordinateVisual.js";
import { Cube } from "./cube.js";
import { Tetracube, TetracubeType } from "./tetracube.js";
import { InputHandler } from "./input.js";

const main = async () => {
    const orthoProjectionMatrix = glm.mat4.create();
    const perspectiveProjectionMatrix = glm.mat4.create();
    //const globalCoords = new CoordinateVisual();
    const debugGrid = new Grid(true);
    const normalGrid = new Grid(false);
    const shaderMap = new Map<String, Shader>();
    const camera = new Camera(
        glm.vec3.fromValues(0, 8, 0), //i used 10,5,5 for development
        glm.vec3.fromValues(1, 0, 0), // 0,1,0
        glm.vec3.fromValues(0, 0, 0),
    );

    //scale the visual of the WCS, so it appears bigger (only visual change)
    //glm.mat4.scale(
    //    globalCoords.scalingMatrix,
    //    globalCoords.scalingMatrix,
    //    glm.vec3.fromValues(3.5, 3.5, 3.5)
    //);

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
    const gs = new Shader("gouraud");
    await gs.loadAndCompile(gl);
    const ps = new Shader("phong")
    await ps.loadAndCompile(gl);

    shaderMap.set('gs', gs)
    shaderMap.set('ps', ps)

    let allCubes: Cube[] = [];
    //globalCoords.initializeBuffersAndVAO(gl, sBase);
    debugGrid.initializeBuffersAndVAO(gl, sBase);
    normalGrid.initializeBuffersAndVAO(gl, sBase);

    const toLightVector: vec3 = glm.vec3.fromValues(1, 1, 1);

    //NOTE: to emit typescript error about Offscreencanvas
    const cv = gl.canvas as HTMLCanvasElement;
    glm.mat4.ortho( //TODO: change to orthographic
        orthoProjectionMatrix, // Output
        -9, //left
        9, //right
        -7, //bottom
        7, //top
        0.1, //near
        100, //far
    );

    glm.mat4.perspective(
        perspectiveProjectionMatrix, // Output
        (70 * Math.PI) / 180, // Field of view in radians
        cv.clientWidth / cv.clientHeight, // Aspect ratio
        0.1, // Near
        100.0 // Far
    );

    //-------------------Game varaibles--------------
    let activeTetrPresent = false;
    let lastUpdate = Date.now(); //for deltatime calculation
    let activeTetracube: Tetracube = null;
    const inputHandler = new InputHandler(canvas, activeTetracube, camera, shaderMap, gl);
    const restartButton = document.getElementById('restartButton');
    restartButton.addEventListener('click', (event) => {
        inputHandler.paused = false;
        activeTetrPresent = false;
        activeTetracube = null;
        allCubes = [];
        document.getElementById('gameOver').style.display = 'none';
    })

    const draw = (_: any) => {

        if (!activeTetrPresent) {
            activeTetracube = Tetracube.spawn(gl, inputHandler.getCurrentShader());
            activeTetrPresent = true;
            inputHandler.setGameState(activeTetracube, allCubes);
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
        if (inputHandler.ortho) {
            sBase.uniformMatrices(gl, orthoProjectionMatrix, camera.viewMatrix);
        } else {
            sBase.uniformMatrices(gl, perspectiveProjectionMatrix, camera.viewMatrix);
        }
        //globalCoords.draw(gl, sBase);

        if (inputHandler.getDebugGrid())
            debugGrid.draw(gl, sBase);
        else
            normalGrid.draw(gl, sBase)

        inputHandler.bindCurrentShader();
        if (inputHandler.ortho) {
            inputHandler.getCurrentShader().uniformMatrices(gl, orthoProjectionMatrix, camera.viewMatrix);
        } else {

            inputHandler.getCurrentShader().uniformMatrices(gl, perspectiveProjectionMatrix, camera.viewMatrix);
        }
        gl.uniform3fv(inputHandler.getCurrentShader().u_locLightPos, toLightVector);
        gl.uniform3fv(inputHandler.getCurrentShader().u_locAmbientComponent, [inputHandler.ambientComponent, inputHandler.ambientComponent, inputHandler.ambientComponent]);
        gl.uniform3fv(inputHandler.getCurrentShader().u_locDiffuseComponent, [inputHandler.diffuseComponent, inputHandler.diffuseComponent, inputHandler.diffuseComponent]);
        gl.uniform3fv(inputHandler.getCurrentShader().u_locSpecularComponent, [inputHandler.specularComponent, inputHandler.specularComponent, inputHandler.specularComponent]);

        activeTetracube.draw(gl, inputHandler.getCurrentShader());
        for (const cube of allCubes)
            cube.draw(gl, inputHandler.getCurrentShader());

        if (!inputHandler.isPaused()) {
            if (!activeTetracube.checkGravityCollision()
                && !activeTetracube.checkCubeGravityCollision(allCubes)) {

                activeTetracube.moveDown(0.02);
            } else {
                activeTetrPresent = false;
                allCubes.push(...activeTetracube.toCubes());
            }
            inputHandler.setGameState(activeTetracube, allCubes);

            //remove extra cubes
            //TODO: add removal for all layers
            for (let i = -4.5; i < 4.5; i += 1) {
                let count = 0;
                for (const c of allCubes) {
                    if (c.getY() == i)
                        count++;
                }
                if (count == 16) { //4x4
                    allCubes = allCubes.filter(c => c.getY() != i);
                    for (const c of allCubes) {
                        if (c.getY() > i) c.snapToBottom(allCubes);
                    }
                }

            }

            for (const cube of allCubes) {
                //hacky solution to get cooadinated to snap...
                console.log(Math.round(cube.getX() * 2) / 2);
                const dx = (Math.round(cube.getX() * 2) / 2);
                const dy = (Math.round(cube.getY() * 2) / 2);
                const dz = (Math.round(cube.getZ() * 2) / 2);
                cube.globalTranslate([
                    dx - cube.getX(),
                    dy - cube.getY(),
                    dz - cube.getZ()
                ]);
            }
            inputHandler.setGameState(activeTetracube, allCubes);

            for (const cube of allCubes) {
                if (cube.getY() > 5) {
                    document.getElementById('gameOver').style.display = 'block';
                    inputHandler.paused = true;
                }
            }

        }

        window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(draw);
}

main();