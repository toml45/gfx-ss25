import * as glm from './gl-matrix/index.js'
import { Shader } from './shader.js'
import { Camera } from './camera.js'
import { Shape } from './shape.js'

const generateSquare = () => {
    return new Shape(
        [   // Vertex Data
            -0.5, -0.5, 0.0,
             0.5, -0.5, 0.0,
             0.5,  0.5, 0.0,
            -0.5,  0.5, 0.0
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

const main = async() => {
    const camera = new Camera();
    const projectionMatrix = glm.mat4.create();
    const globalTransformationMatrix = glm.mat4.create();
    const updatedViewMatrix = glm.mat4.create();

    const canvas: HTMLCanvasElement | null = document.querySelector("#glcanvas");
    if (canvas === null) {
        console.log("No canvas element was found");
        return;
    }

    const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2");
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // NOTE: what does this do?

    if (gl === null) {
        console.log("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

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
    const objects: Shape[] = [];

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

        // Draw all the objects
        for (const eachObject of objects) {
            eachObject.draw(gl, sBase);
        }

        window.requestAnimationFrame(draw);
    };

    window.requestAnimationFrame(draw);
}

main();