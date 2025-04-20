import * as glm from "./gl-matrix/index.js";
import { Shader } from "./shader.js";
import { Camera } from "./camera.js";
import { CoordinateVisual, Shape } from "./shapes.js";
import { OBJParser } from "./objParser.js";
import { Mode } from "./input.js";
import { InputHandler } from "./input.js";


const main = async () => {
    const camera = new Camera();
    const projectionMatrix = glm.mat4.create();
    const globalTransformationMatrix = glm.mat4.create();
    const updatedViewMatrix = glm.mat4.create();
    const globalCoordSystem = new CoordinateVisual();

    //scale the visual of the WCS, so it appears bigger (only visual change)
    glm.mat4.scale(
        globalCoordSystem.scalingMatrix,
        globalCoordSystem.scalingMatrix,
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

    // Load shaders
    const sBase = new Shader("gouraud_diffuse");
    //const sBase = new Shader("basic");
    await sBase.loadAndCompile(gl);

    // Load models
    const cube = await fetch('/sampleModels/cube.obj')
        .then(response => response.text());
    const teapot = await fetch('/sampleModels/teapot.obj')
        .then(response => response.text());
    const bunny = await fetch('/sampleModels/bunny.obj')
        .then(response => response.text());
    const tetrahedron = await fetch('/sampleModels/tetrahedron.obj')
        .then(response => response.text());

    const cubeShape = OBJParser.parseOBJ(cube);
    const teapotShape = OBJParser.parseOBJ(teapot);
    const bunnyShape = OBJParser.parseOBJ(bunny);
    const tetrahedronShape = OBJParser.parseOBJ(tetrahedron);

    //bunny is too small, therefore scale
    glm.mat4.scale(
        bunnyShape.scalingMatrix,
        bunnyShape.scalingMatrix,
        glm.vec3.fromValues(8, 8, 8)
    );

    // Initialize objects
    const objects: Shape[] = [];

    /*
    objects.push(generatePyramid());
    objects[0].translate([-3.0, 2.5, 0.0]); // Move it to the correct pos

    objects.push(bunnyShape);
    objects[1].translate([0.0, 2.5, 0.0]);

    objects.push(teapotShape);
    objects[2].translate([3.0, 2.5, 0.0]);

    objects.push(tetrahedronShape);
    objects[3].translate([-3.0, 0.0, 0.0]);
    */

    objects.push(teapotShape);
    objects[0].translate([0.0, 0.0, 0.0]);
    glm.mat4.scale(
        objects[0].scalingMatrix,
        objects[0].scalingMatrix,
        glm.vec3.fromValues(3, 3, 3)
    );

    /*
    objects.push(generateCube());
    objects[5].translate([3.0, 0.0, 0.0]);

    objects.push(generateCube());
    objects[6].translate([-3.0, -2.5, 0.0]);

    objects.push(generateCube());
    objects[7].translate([0.0, -2.5, 0.0]);

    objects.push(generatePyramid());
    objects[8].translate([3.0, -2.5, 0.0]);
    */

    // Build VAOs for all objects and WCS visual with base shader
    globalCoordSystem.initializeBuffersAndVAO(gl, sBase);
    for (const eachObject of objects) {
        eachObject.initializeBuffersAndVAO(gl, sBase);
    }

    const inputHandler = new InputHandler(canvas, camera, objects);

    //NOTE: to emit typescript error about Offscreencanvas
    const cv = gl.canvas as HTMLCanvasElement;
    glm.mat4.perspective(
        projectionMatrix, // Output
        (45 * Math.PI) / 180, // Field of view in radians
        cv.clientWidth / cv.clientHeight, // Aspect ratio
        0.1, // Near
        100.0 // Far
    );

    const draw = (_: any) => {
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
        gl.uniform3fv(sBase.locLightPos, glm.vec3.fromValues(0, 10, 0));

        // Draw all the objects and WCS
        if (inputHandler.getMode() == Mode.GLOBAL) {
            globalCoordSystem.draw(gl, sBase);
        }
        let i = 0;
        for (const eachObject of objects) {
            if (inputHandler.getSelectedObject() == i && inputHandler.getMode() == Mode.OBJECT) {
                eachObject.draw(gl, sBase, true);
            } else {
                eachObject.draw(gl, sBase);
            }
            i++;
        }

        window.requestAnimationFrame(draw);
    };

    window.requestAnimationFrame(draw);
};

main();
