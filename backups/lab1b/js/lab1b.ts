import * as glm from "./gl-matrix/index.js";
import { Shader } from "./shader.js";
import { Camera } from "./camera.js";
import { CoordinateVisual, Shape } from "./shapes.js";
import { OBJParser } from "./objParser.js";
import { Mode } from "./input.js";
import { InputHandler } from "./input.js";

export class Scene {
    plane: Shape;
    objects: Shape[];
    light: vec3;
    constructor(plane: Shape, objects: Shape[], light: vec3) {
        this.plane = plane;
        this.objects = objects;
        this.light = light;
    }
}

const main = async () => {
    const camera = new Camera();
    const projectionMatrix = glm.mat4.create();
    const globalTransformationMatrix = glm.mat4.create();
    const updatedViewMatrix = glm.mat4.create();
    const globalCoordSystem = new CoordinateVisual();
    const shaderMap = new Map<String, Shader>();

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

    const gd = new Shader("gouraud_diffuse");
    const gs = new Shader("gouraud_specular");
    const pd = new Shader("phong_diffuse");
    const ps = new Shader("phong_specular");
    const sBase = new Shader("basic");
    await gd.loadAndCompile(gl);
    await gs.loadAndCompile(gl);
    await pd.loadAndCompile(gl);
    await ps.loadAndCompile(gl);
    await sBase.loadAndCompile(gl);

    shaderMap.set('gouraud_diffuse', gd)
    shaderMap.set('gouraud_specular', gs)
    shaderMap.set('phong_diffuse', pd)
    shaderMap.set('phong_specular', ps)

    // Load models
    const cube = await fetch('/sampleModels/cube.obj')
        .then(response => response.text());
    const teapot = await fetch('/sampleModels/teapot.obj')
        .then(response => response.text());
    const bunny = await fetch('/sampleModels/bunny.obj')
        .then(response => response.text());
    const tetrahedron = await fetch('/sampleModels/tetrahedron.obj')
        .then(response => response.text());

    const teapotShape = OBJParser.parseOBJ(teapot);

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

    const depthTextureSize = 1024;

    const depthTextureBuffer = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, depthTextureBuffer);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.DEPTH_COMPONENT24,
        depthTextureSize,
        depthTextureSize,
        0,
        gl.DEPTH_COMPONENT,
        gl.UNSIGNED_INT,
        null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const light: vec3 = glm.vec3.fromValues(0, 10, 0);
    const objects: Shape[] = [];

    objects.push(OBJParser.parseOBJ(bunny));
    objects[0].translate([-3.0, 2.5, 0.0]); // Move it to the correct pos

    objects.push(OBJParser.parseOBJ(cube));
    objects[1].translate([0.0, 2.5, 0.0]);

    objects.push(OBJParser.parseOBJ(bunny));
    objects[2].translate([3.0, 2.5, 0.0]);

    objects.push(OBJParser.parseOBJ(teapot));
    objects[3].translate([-3.0, 0.0, 0.0]);

    objects.push(teapotShape);
    objects[0].translate([0.0, 0.0, 0.0]);

    objects.push(OBJParser.parseOBJ(tetrahedron));
    objects[5].translate([3.0, 0.0, 0.0]);

    objects.push(OBJParser.parseOBJ(teapot));
    objects[6].translate([-3.0, -2.5, 0.0]);

    objects.push(OBJParser.parseOBJ(teapot));
    objects[7].translate([0.0, -2.5, 0.0]);

    objects.push(OBJParser.parseOBJ(teapot));
    objects[8].translate([3.0, -2.5, 0.0]);

    const scene: Scene = new Scene(generatePlane(), objects, light);

    const inputHandler = new InputHandler(canvas, camera, scene, shaderMap, gl);

    // Build VAOs for all object and WCS visual with base shader
    globalCoordSystem.initializeBuffersAndVAO(gl, sBase);
    for (const eachObject of objects) {
        eachObject.initializeBuffersAndVAO(gl, inputHandler.getCurrentShader());
    }
    scene.plane.initializeBuffersAndVAO(gl, inputHandler.getCurrentShader());


    //NOTE: to emit typescript error about Offscreencanvas
    const cv = gl.canvas as HTMLCanvasElement;
    glm.mat4.perspective(
        projectionMatrix, // Output
        (45 * Math.PI) / 180, // Field of view in radians
        cv.clientWidth / cv.clientHeight, // Aspect ratio
        0.1, // Near
        100.0 // Far
    );

    const lightProjectionMatrix = glm.mat4.create();
    glm.mat4.perspective(
        lightProjectionMatrix, // Output
        (45 * Math.PI) / 180, // Field of view in radians
        1024 / 1024, // Aspect ratio
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


        // Draw all the objects and WCS
        if (inputHandler.getMode() == Mode.GLOBAL) {
            sBase.bind(gl);
            sBase.uniformMatrices(gl, projectionMatrix, updatedViewMatrix);
            globalCoordSystem.draw(gl, sBase);
        }

        if (inputHandler.getShadowState()) {

            const depthFrameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, depthFrameBuffer);
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl.DEPTH_ATTACHMENT,
                gl.TEXTURE_2D,
                depthTextureBuffer,
                0
            );

            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            for (const eachObject of objects) {
                eachObject.initializeBuffersAndVAO(gl, sBase);
            }
            scene.plane.initializeBuffersAndVAO(gl, sBase);

            sBase.bind(gl);
            gl.bindFramebuffer(gl.FRAMEBUFFER, depthFrameBuffer);
            gl.viewport(0, 0, 1024, 1024); //TODO: check
            gl.clear(gl.DEPTH_BUFFER_BIT);
            const lightViewMatrix = glm.mat4.create()

            const target = glm.vec3.create();
            const lightNorm = glm.vec3.create();
            glm.vec3.normalize(lightNorm, light);
            glm.vec3.sub(target, scene.light, lightNorm);
            //im not sure if this is needed but i get the target to the center with lenght 1
            glm.mat4.lookAt(
                lightViewMatrix,
                scene.light,
                target,
                glm.vec3.fromValues(0, 0, 1),
            );

            sBase.uniformMatrices(gl, lightProjectionMatrix, lightViewMatrix);
            for (const eachObject of objects) {
                eachObject.draw(gl, sBase);
            }
            scene.plane.draw(gl, sBase);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            //----------------------------END OF SHADOWMAP STUFF---------------------------------
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            for (const eachObject of objects) {
                eachObject.initializeBuffersAndVAO(gl, inputHandler.getCurrentShader());
            }
            scene.plane.initializeBuffersAndVAO(gl, inputHandler.getCurrentShader());

            inputHandler.bindCurrentShader();
            inputHandler.getCurrentShader().uniformMatrices(gl, projectionMatrix, updatedViewMatrix);


            const lightViewProjectionMatrix = glm.mat4.create();
            glm.mat4.multiply(lightViewProjectionMatrix, lightViewMatrix, lightViewProjectionMatrix);
            glm.mat4.multiply(lightViewProjectionMatrix, lightProjectionMatrix, lightViewProjectionMatrix);

            gl.uniformMatrix4fv(inputHandler.getCurrentShader().locUShadowMapTransform, false, lightViewProjectionMatrix);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, depthTextureBuffer);
            gl.uniform1i(inputHandler.getCurrentShader().locUShadowMapSampler, 0);
        }
        else {

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            for (const eachObject of objects) {
                eachObject.initializeBuffersAndVAO(gl, inputHandler.getCurrentShader());
            }

            inputHandler.bindCurrentShader();
            inputHandler.getCurrentShader().uniformMatrices(gl, projectionMatrix, updatedViewMatrix);

            const lightViewProjectionMatrix = glm.mat4.create();

            gl.uniformMatrix4fv(inputHandler.getCurrentShader().locUShadowMapTransform, false, lightViewProjectionMatrix);

        }
        gl.uniform3fv(inputHandler.getCurrentShader().locLightPos, scene.light);


        let i = 0;
        for (const eachObject of objects) {
            if (inputHandler.getSelectedObject() == i && inputHandler.getMode() == Mode.OBJECT) {
                eachObject.draw(gl, inputHandler.getCurrentShader(), true);
            } else {
                eachObject.draw(gl, inputHandler.getCurrentShader());
            }
            i++;
        }
        scene.plane.draw(gl, inputHandler.getCurrentShader());

        window.requestAnimationFrame(draw);
    };

    window.requestAnimationFrame(draw);
};


main();
