import * as glm from "./gl-matrix/index.js";
import { Shader } from "./shader.js";
import { Camera } from "./camera.js";
import { CoordinateVisual, Shape } from "./shapes.js";
import { OBJParser } from "./objParser.js";

const generateSquare = () => {
    return new Shape(
        [
            // Vertex Data
            -0.5, -0.5, 0.5, //0 bot left front
             0.5, -0.5, 0.5, //1 bot right front
             0.5,  0.5, 0.5, //2 top right front
            -0.5,  0.5, 0.5, //3 top left front

            -0.5, -0.5, -0.5, //4 bot left back
             0.5, -0.5, -0.5, //5 bot right back
             0.5,  0.5, -0.5, //6 top right back
            -0.5,  0.5, -0.5, //7 top left back

            -0.5, -0.5,  0.5, //0 bot left front
             0.5, -0.5,  0.5, //1 bot right front
             0.5,  0.5,  0.5, //2 top right front
            -0.5,  0.5,  0.5, //3 top left front

            -0.5, -0.5, -0.5, //4 bot left back
             0.5, -0.5, -0.5, //5 bot right back
             0.5,  0.5, -0.5, //6 top right back
            -0.5,  0.5, -0.5, //7 top left back

            -0.5, -0.5,  0.5, //0 bot left front
             0.5, -0.5,  0.5, //1 bot right front
             0.5,  0.5,  0.5, //2 top right front
            -0.5,  0.5,  0.5, //3 top left front

            -0.5, -0.5, -0.5, //4 bot left back
             0.5, -0.5, -0.5, //5 bot right back
             0.5,  0.5, -0.5, //6 top right back
            -0.5,  0.5, -0.5, //7 top left back
        ],
        [
            // Indices
            //front face
            0, 1, 2, 
            2, 3, 0,
            //back face
            4, 5, 6, 
            6, 7, 4,
            //left face
            8, 12, 15, 
            15, 11, 8,
            //right face
            9, 13, 14, 
            14, 10, 9,
            //bottom face
            16, 17, 21, 
            21, 20, 16,
            //top face
            19, 18, 22, 
            22, 23, 19,
        ],
        [
            // Color
            // front n back
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,

            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            //left n right
            0.0, 1.0, 0.0,
            1.0, 0.0, 1.0, //
            1.0, 0.0, 1.0, //
            0.0, 1.0, 0.0,

            0.0, 1.0, 0.0,
            1.0, 0.0, 1.0, //
            1.0, 0.0, 1.0, //
            0.0, 1.0, 0.0,

            // top n bottom
            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            0.0, 1.0, 1.0, //
            0.0, 1.0, 1.0, //

            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            0.0, 1.0, 1.0, //
            0.0, 1.0, 1.0, //
        ],
        glm.mat4.create()
    );
};

const generatePyramid = () => {
    return new Shape(
        [
            // Vertex Data
            -0.5, -0.5, -0.5, //0 top-down bottom left
            0.5, -0.5, -0.5, //1 top-down bottom right
            0.5, -0.5, 0.5, //2 top-down top right
            -0.5, -0.5, 0.5, //3 top-down top left

            -0.5, -0.5, -0.5, //4 top-down bottom left
            0.5, -0.5, -0.5, //5 top-down bottom right
            0.0, 0.5, 0.0, //6 pyramid peak

            0.5, -0.5, -0.5, //7 top-down bottom right
            0.5, -0.5, 0.5, //8 top-down top right
            0.0, 0.5, 0.0, //9 pyramid peak

            0.5, -0.5, 0.5, //10 top-down top right
            -0.5, -0.5, 0.5, //11 top-down top left
            0.0, 0.5, 0.0, //12 pyramid peak

            -0.5, -0.5, -0.5, //13 top-down bottom left
            -0.5, -0.5, 0.5, //14 top-down top left
            0.0, 0.5, 0.0, //15 pyramid peak
        ],
        [
            // Indices
            // base
            0, 1, 2, 
            2, 3, 0,
            //sides
            4, 5, 6, 
            7, 8, 9, 
            10, 11, 12, 
            13, 14, 15,
        ],
        [
            // Color
            //base
            1.0, 0.0, 0.0, 
            1.0, 0.0, 0.0, 
            1.0, 0.0, 0.0, 
            1.0, 0.0, 0.0,

            //all sides
            0.0, 1.0, 0.0, 
            0.0, 1.0, 0.0, 
            0.0, 1.0, 0.0,

            0.0, 0.0, 1.0, 
            0.0, 0.0, 1.0, 
            0.0, 0.0, 1.0,

            1.0, 0.0, 1.0, 
            1.0, 0.0, 1.0, 
            1.0, 0.0, 1.0,

            1.0, 1.0, 0.0, 
            1.0, 1.0, 0.0, 
            1.0, 1.0, 0.0,
        ],
        glm.mat4.create()
    );
};

enum Mode {
    OBJECT,
    GLOBAL,
    CAMERA
}

const main = async () => {
    const camera = new Camera();
    const projectionMatrix = glm.mat4.create();
    const globalTransformationMatrix = glm.mat4.create();
    const updatedViewMatrix = glm.mat4.create();
    const globT = glm.mat4.create();
    const globalCoordSystem = new CoordinateVisual();

    let selectedObject = -1;
    let mode = Mode.CAMERA;

    //scale the visual of the WCS, so it appears bigger (only visual change)
    glm.mat4.scale(
        globalCoordSystem.scalingMatrix,
        globalCoordSystem.scalingMatrix,
        glm.vec3.fromValues(3.5, 3.5, 3.5)
    );


    const canvas: HTMLCanvasElement | null =
        document.querySelector("#glcanvas");
    if (canvas === null) {
        console.log("No canvas element was found");
        return;
    }

    const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2");
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); 

    if (gl === null) {
        console.log(
            "Unable to initialize WebGL. Your browser or machine may not support it."
        );
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Load shaders
    const sBase = new Shader("basic");
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

    objects.push(generatePyramid());
    objects[0].translate([-3.0, 2.5, 0.0]); // Move it to the correct pos

    objects.push(bunnyShape);
    objects[1].translate([0.0, 2.5, 0.0]);

    objects.push(teapotShape);
    objects[2].translate([3.0, 2.5, 0.0]);

    objects.push(tetrahedronShape);
    objects[3].translate([-3.0, 0.0, 0.0]);

    objects.push(cubeShape);
    objects[4].translate([0.0, 0.0, 0.0]);

    objects.push(generateSquare());
    objects[5].translate([3.0, 0.0, 0.0]);

    objects.push(generateSquare());
    objects[6].translate([-3.0, -2.5, 0.0]);

    objects.push(generateSquare());
    objects[7].translate([0.0, -2.5, 0.0]);

    objects.push(generatePyramid());
    objects[8].translate([3.0, -2.5, 0.0]);

    // Build VAOs for all objects and WCS visual with base shader
    globalCoordSystem.initializeBuffersAndVAO(gl, sBase);
    for (const eachObject of objects) {
        eachObject.initializeBuffersAndVAO(gl, sBase);
    }

    // variables to help out with camera movement
    let cameraDelta: vec2 = glm.vec2.create();
    let drag: boolean = false;

    //set up camera movement
    canvas.addEventListener("mousedown", (event) => {
        if (mode != Mode.CAMERA)
            return;

        if (drag == false) {
            const rect = canvas.getBoundingClientRect();
            cameraDelta[0] = event.clientX - rect.left;
            cameraDelta[1] = event.clientY - rect.top;

            //console.log(`Mouse down at (${mouseDownCoord})`);
        }
        drag = true;
    });

    canvas.addEventListener("mouseup", (event) => {
        if (mode != Mode.CAMERA)
            return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        console.log(`Mouse up at (${x}, ${y})`);
        drag = false;
        cameraDelta = glm.vec2.create();
    });

    canvas.addEventListener("mousemove", (event) => {
        if (mode != Mode.CAMERA)
            return;
        if (drag) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const currentPos = glm.vec2.fromValues(x, y);
            const result: vec2 = glm.vec2.create();
            glm.vec2.subtract(result, cameraDelta, currentPos);
            camera.translate(
                glm.vec3.fromValues(
                    result[0]*-0.01, 
                    result[1]*0.01, 
                    0
                )
            );
            glm.vec2.copy(cameraDelta, currentPos);
        }

        //console.log(`Mouse up at (${x}, ${y})`);
    });

    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowUp":
                if (mode == Mode.CAMERA) {
                    cameraDelta[1] += 10;
                }
                else if (mode == Mode.OBJECT){
                    objects[selectedObject].translate(
                        glm.vec3.fromValues(0.0, 0.05, 0.0)
                    );
                }
                else if (mode == Mode.GLOBAL){
                    for(const object of objects){
                        object.translate(
                            glm.vec3.fromValues(0.0, 0.05, 0.0)
                        );
                    }
                }
                else{
                    console.log("WARNING: else block should never be called")
                }
                break;
            case "ArrowDown":
                if (mode == Mode.CAMERA) {
                    cameraDelta[1] -= 10;
                }
                else if (mode == Mode.OBJECT){
                    objects[selectedObject].translate(
                        glm.vec3.fromValues(0.0, -0.05, 0.0)
                    );
                }
                else if (mode == Mode.GLOBAL){
                    for(const object of objects){
                        object.translate(
                            glm.vec3.fromValues(0.0, -0.05, 0.0)
                        );
                    }
                }
                else{
                    console.log("WARNING: else block should never be called")
                }
                break;
            case "ArrowLeft":
                if (mode == Mode.CAMERA) {
                    cameraDelta[0] -= 10;
                }
                else if (mode == Mode.OBJECT){
                    objects[selectedObject].translate(
                        glm.vec3.fromValues(-0.05, 0.0, 0.0)
                    );
                }
                else if (mode == Mode.GLOBAL){
                    for(const object of objects){
                        object.translate(
                            glm.vec3.fromValues(-0.05, 0.0, 0.0)
                        );
                    }
                }
                else{
                    console.log("WARNING: else block should never be called")
                }
                break;
            case "ArrowRight":
                if (mode == Mode.CAMERA) {
                    cameraDelta[0] += 10;
                }
                else if (mode == Mode.OBJECT){
                    objects[selectedObject].translate(
                        glm.vec3.fromValues(0.05, 0.0, 0.0)
                    );
                }
                else if (mode == Mode.GLOBAL){
                    for(const object of objects){
                        object.translate(
                            glm.vec3.fromValues(0.05, 0.0, 0.0)
                        );
                    }
                }
                else{
                    console.log("WARNING: else block should never be called");
                }
                break;
            case ",":
                if (mode == Mode.OBJECT){
                    objects[selectedObject].translate(
                        glm.vec3.fromValues(0.0, 0.0, 0.05)
                    );
                }
                else if (mode == Mode.GLOBAL){
                    for(const object of objects){
                        object.translate(
                            glm.vec3.fromValues(0.0, 0.0, 0.05)
                        );
                    }
                }
                else{
                    console.log("WARNING: camera mode comma not supported");
                }
                break;
            case ".":
                if (mode == Mode.OBJECT){
                    objects[selectedObject].translate(
                        glm.vec3.fromValues(0.0, 0.0, -0.05)
                    );
                }
                else if (mode == Mode.GLOBAL){
                    for(const object of objects){
                        object.translate(
                            glm.vec3.fromValues(0.0, 0.0, -0.05)
                        );
                    }
                }
                else{
                    console.log("WARNING: camera mode dot not supported");
                }
                break;
            default:
                break;
        }
        if (mode==Mode.CAMERA) {
            camera.translate(
                glm.vec3.fromValues(
                    cameraDelta[0] * -0.01,
                    cameraDelta[1] * -0.01,
                    0
                )
            );
        }
        cameraDelta = glm.vec2.create();
    });

    //NOTE: not the best idea, but I'll separate the event listeners a bit on context
    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "1":
                mode = Mode.OBJECT;
                selectedObject = 0;
                break;
            case "2":
                mode = Mode.OBJECT;
                selectedObject = 1;
                break;
            case "3":
                mode = Mode.OBJECT;
                selectedObject = 2;
                break;
            case "4":
                mode = Mode.OBJECT;
                selectedObject = 3;
                break;
            case "5":
                mode = Mode.OBJECT;
                selectedObject = 4;
                break;
            case "6":
                mode = Mode.OBJECT;
                selectedObject = 5;
                break;
            case "7":
                mode = Mode.OBJECT;
                selectedObject = 6;
                break;
            case "8":
                mode = Mode.OBJECT;
                selectedObject = 7;
                break;
            case "9":
                mode = Mode.OBJECT;
                selectedObject = 8;
                break;
            case "0":
                mode = Mode.GLOBAL;
                selectedObject = -1;
                break;
            case " ":
                mode = Mode.CAMERA;
            case "a":
                if (mode==Mode.OBJECT){
                    glm.mat4.scale(
                        objects[selectedObject].scalingMatrix,
                        objects[selectedObject].scalingMatrix,
                        glm.vec3.fromValues(0.9, 1.0, 1.0)
                    );
                }
                else if(mode==Mode.GLOBAL){
                    glm.mat4.scale(
                        globT, 
                        globT, 
                        glm.vec3.fromValues(0.9, 1.0, 1.0)
                    );
                }
                break;
            case "A":
                if (mode==Mode.OBJECT){
                    glm.mat4.scale(
                        objects[selectedObject].scalingMatrix,
                        objects[selectedObject].scalingMatrix,
                        glm.vec3.fromValues(1.1, 1.0, 1.0)
                    );
                }
                else if(mode==Mode.GLOBAL){
                    glm.mat4.scale(
                        globT, 
                        globT, 
                        glm.vec3.fromValues(1.1, 1.0, 1.0)
                    );
                }
                break;
            case "b":
                if (mode==Mode.OBJECT){
                    glm.mat4.scale(
                        objects[selectedObject].scalingMatrix,
                        objects[selectedObject].scalingMatrix,
                        glm.vec3.fromValues(1.0, 0.9, 1.0)
                    );
                }
                else if(mode==Mode.GLOBAL){
                    glm.mat4.scale(
                        globT, 
                        globT, 
                        glm.vec3.fromValues(1.0, 0.9, 1.0)
                    );
                }
                break;
            case "B":
                if (mode==Mode.OBJECT){
                    glm.mat4.scale(
                        objects[selectedObject].scalingMatrix,
                        objects[selectedObject].scalingMatrix,
                        glm.vec3.fromValues(1.0, 1.1, 1.0)
                    );
                }
                else if(mode==Mode.GLOBAL){
                    glm.mat4.scale(
                        globT, 
                        globT, 
                        glm.vec3.fromValues(1.0, 1.1, 1.0)
                    );
                }
                break;
            case "c":
                if (mode==Mode.OBJECT){
                    glm.mat4.scale(
                        objects[selectedObject].scalingMatrix,
                        objects[selectedObject].scalingMatrix,
                        glm.vec3.fromValues(1.0, 1.0, 0.9)
                    );
                }
                else if(mode==Mode.GLOBAL){
                    glm.mat4.scale(
                        globT, 
                        globT, 
                        glm.vec3.fromValues(1.0, 1.0, 0.9)
                    );
                }
                break;
            case "C":
                if (mode==Mode.OBJECT){
                    glm.mat4.scale(
                        objects[selectedObject].scalingMatrix,
                        objects[selectedObject].scalingMatrix,
                        glm.vec3.fromValues(1.0, 1.0, 1.1)
                    );
                }
                else if(mode==Mode.GLOBAL){
                    glm.mat4.scale(
                        globT, 
                        globT, 
                        glm.vec3.fromValues(1.0, 1.0, 1.1)
                    );
                }
                break;
            case "i":
                if(mode == Mode.OBJECT){
                    glm.mat4.rotateX(
                        objects[selectedObject].rotationMatrix,
                        objects[selectedObject].rotationMatrix,
                        -5 * Math.PI/180.0
                    );
                } else if(mode==Mode.GLOBAL){
                    glm.mat4.rotateX(
                        globT, 
                        globT, 
                        (-5 * Math.PI) / 180.0
                    ); 
                }
                break;
            case "k":
                if(mode == Mode.OBJECT){
                    glm.mat4.rotateX(
                        objects[selectedObject].rotationMatrix,
                        objects[selectedObject].rotationMatrix,
                        5 * Math.PI/180.0
                    );
                } else if(mode==Mode.GLOBAL){
                    glm.mat4.rotateX(
                        globT, 
                        globT, 
                        (5 * Math.PI) / 180.0
                    ); 
                }
                break;
            case "o":
                if(mode == Mode.OBJECT){
                    glm.mat4.rotateY(
                        objects[selectedObject].rotationMatrix,
                        objects[selectedObject].rotationMatrix,
                        -5 * Math.PI/180.0
                    );
                } else if(mode==Mode.GLOBAL){
                    glm.mat4.rotateY(
                        globT, 
                        globT, 
                        (-5 * Math.PI) / 180.0
                    ); 
                }
                break;
            case "u":
                if(mode == Mode.OBJECT){
                    glm.mat4.rotateY(
                        objects[selectedObject].rotationMatrix,
                        objects[selectedObject].rotationMatrix,
                        5 * Math.PI/180.0
                    );
                } else if(mode==Mode.GLOBAL){
                    glm.mat4.rotateY(
                        globT, 
                        globT, 
                        (5 * Math.PI) / 180.0
                    ); 
                }
                break;
            case "l":
                if(mode == Mode.OBJECT){
                    glm.mat4.rotateZ(
                        objects[selectedObject].rotationMatrix,
                        objects[selectedObject].rotationMatrix,
                        -5 * Math.PI/180.0
                    );
                } else if(mode==Mode.GLOBAL){
                    glm.mat4.rotateZ(
                        globT, 
                        globT, 
                        (-5 * Math.PI) / 180.0
                    ); 
                }
                break;
            case "j":
                if(mode == Mode.OBJECT){
                    glm.mat4.rotateZ(
                        objects[selectedObject].rotationMatrix,
                        objects[selectedObject].rotationMatrix,
                        5 * Math.PI/180.0
                    );
                } else if(mode==Mode.GLOBAL){
                    glm.mat4.rotateZ(
                        globT, 
                        globT, 
                        (5 * Math.PI) / 180.0
                    ); 
                }
                break;
            default:
                break;
        
        }
        for(const obj of objects){
            glm.mat4.copy(
                obj.globalTransformMatrix,
                globT
            );
        }
    });

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

        // Draw all the objects and WCS
        if(mode==Mode.GLOBAL){
            globalCoordSystem.draw(gl, sBase);
        }
        let i = 0;
        for (const eachObject of objects) {
            if (selectedObject == i && mode ==Mode.OBJECT) {
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
