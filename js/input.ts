import { Camera } from "./camera";
import { Entity } from "./entity";
import * as glm from "./gl-matrix/index.js";

export enum Mode {
    OBJECT,
    GLOBAL,
    CAMERA,
    LIGHT
}

export class InputHandler {
    private drag: boolean = false;
    private cameraDelta: vec2 = glm.vec2.create();
    private selectedObject = -1;
    private globT = glm.mat4.create();

    objects: Entity[];
    camera: Camera;
    canvas: HTMLCanvasElement;
    mode: Mode;

    constructor(
        canvas: HTMLCanvasElement,
        camera: Camera,
        objects: Entity[],
        mode = Mode.CAMERA
    ) {
        this.canvas = canvas;
        this.mode = mode;
        this.objects = objects;
        this.camera = camera;
        this.addEventHandlers();
    }

    private addEventHandlers() {
        this.canvas.addEventListener("mousedown", this.mousedown);
        this.canvas.addEventListener("mouseup", this.mouseup);
        this.canvas.addEventListener("mousemove", this.mousemove);

        document.addEventListener("keydown", this.keydownModeConfig);
        document.addEventListener("keydown", this.keydownCamera);
        document.addEventListener("keydown", this.keydownObject);
        document.addEventListener("keydown", this.keydownGlobal);
        document.addEventListener("keydown", this.keydownLight);
    }


    mousedown = (event: MouseEvent) => {
        if (this.mode != Mode.CAMERA)
            return;

        if (this.drag == false) {
            const rect = this.canvas.getBoundingClientRect();
            this.cameraDelta[0] = event.clientX - rect.left;
            this.cameraDelta[1] = event.clientY - rect.top;

            //console.log(`Mouse down at (${mouseDownCoord})`);
        }
        this.drag = true;
    }

    mouseup = (event: MouseEvent) => {
        if (this.mode != Mode.CAMERA)
            return;

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        //console.log(`Mouse up at (${x}, ${y})`);
        this.drag = false;
        this.cameraDelta = glm.vec2.create();
    }

    mousemove = (event: MouseEvent) => {
        if (this.mode != Mode.CAMERA)
            return;
        if (this.drag) {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const currentPos = glm.vec2.fromValues(x, y);
            const result: vec2 = glm.vec2.create();
            glm.vec2.subtract(result, this.cameraDelta, currentPos);
            this.camera.translate(
                glm.vec3.fromValues(
                    result[0] * -0.01,
                    result[1] * 0.01,
                    0
                )
            );
            glm.vec2.copy(this.cameraDelta, currentPos);
        }


    }

    keydownModeConfig = (event: KeyboardEvent) => {
        switch (event.key) {
            case "1":
                this.mode = Mode.OBJECT;
                this.selectedObject = 0;
                break;
            case "2":
                this.mode = Mode.OBJECT;
                this.selectedObject = 1;
                break;
            case "3":
                this.mode = Mode.OBJECT;
                this.selectedObject = 2;
                break;
            case "4":
                this.mode = Mode.OBJECT;
                this.selectedObject = 3;
                break;
            case "5":
                this.mode = Mode.OBJECT;
                this.selectedObject = 4;
                break;
            case "6":
                this.mode = Mode.OBJECT;
                this.selectedObject = 5;
                break;
            case "7":
                this.mode = Mode.OBJECT;
                this.selectedObject = 6;
                break;
            case "8":
                this.mode = Mode.OBJECT;
                this.selectedObject = 7;
                break;
            case "9":
                this.mode = Mode.OBJECT;
                this.selectedObject = 8;
                break;
            case "0":
                this.mode = Mode.GLOBAL;
                this.selectedObject = -1;
                break;

            case " ":
                this.mode = Mode.CAMERA;
                break;

            case "L":
                this.mode = Mode.LIGHT;
                break;
            default:
                break;
        }
    }

    keydownCamera = (event: KeyboardEvent) => {
        if (this.mode != Mode.CAMERA) return;

        switch (event.key) {

            case "ArrowUp":
                this.cameraDelta[1] += 10;
                break;

            case "ArrowDown":
                this.cameraDelta[1] -= 10;
                break;

            case "ArrowLeft":
                this.cameraDelta[0] -= 10;
                break;

            case "ArrowRight":
                this.cameraDelta[0] += 10;
                break;

            default:
                break;
        }

        this.camera.translate(
            glm.vec3.fromValues(
                this.cameraDelta[0] * -0.01,
                this.cameraDelta[1] * -0.01,
                0
            )
        );
        //glm.vec2.zero(this.cameraDelta);
        this.cameraDelta = glm.vec2.create();
    }

    keydownObject = (event: KeyboardEvent) => {
        if (this.mode != Mode.OBJECT) return;

        const i = this.selectedObject;
        switch (event.key) {
            // ----------- TRANSLATING -----------------
            case "ArrowUp":
                this.objects[i].translate(
                    glm.vec3.fromValues(0.0, 0.05, 0.0)
                );
                break;

            case "ArrowDown":
                this.objects[i].translate(
                    glm.vec3.fromValues(0.0, -0.05, 0.0)
                );
                break;

            case "ArrowLeft":
                this.objects[i].translate(
                    glm.vec3.fromValues(-0.05, 0.0, 0.0)
                );
                break;

            case "ArrowRight":
                this.objects[i].translate(
                    glm.vec3.fromValues(0.05, 0.0, 0.0)
                );
                break;

            case ",":
                this.objects[i].translate(
                    glm.vec3.fromValues(0.0, 0.0, 0.05)
                );
                break;

            case ".":
                this.objects[i].translate(
                    glm.vec3.fromValues(0.0, 0.0, -0.05)
                );
                break;

            // ----------- SCALING -----------------
            case "a":
                glm.mat4.scale(
                    this.objects[i].scalingMatrix,
                    this.objects[i].scalingMatrix,
                    glm.vec3.fromValues(0.9, 1.0, 1.0)
                );
                break;

            case "A":
                glm.mat4.scale(
                    this.objects[i].scalingMatrix,
                    this.objects[i].scalingMatrix,
                    glm.vec3.fromValues(1.1, 1.0, 1.0)
                );
                break;

            case "b":
                glm.mat4.scale(
                    this.objects[i].scalingMatrix,
                    this.objects[i].scalingMatrix,
                    glm.vec3.fromValues(1.0, 0.9, 1.0)
                );
                break;

            case "B":
                glm.mat4.scale(
                    this.objects[i].scalingMatrix,
                    this.objects[i].scalingMatrix,
                    glm.vec3.fromValues(1.0, 1.1, 1.0)
                );
                break;

            case "c":
                glm.mat4.scale(
                    this.objects[i].scalingMatrix,
                    this.objects[i].scalingMatrix,
                    glm.vec3.fromValues(1.0, 1.0, 0.9)
                );
                break;

            case "C":
                glm.mat4.scale(
                    this.objects[i].scalingMatrix,
                    this.objects[i].scalingMatrix,
                    glm.vec3.fromValues(1.0, 1.0, 1.1)
                );
                break;

            // ----------- ROTATING -----------------
            case "i":
                glm.mat4.rotateX(
                    this.objects[i].rotationMatrix,
                    this.objects[i].rotationMatrix,
                    -5 * Math.PI / 180.0
                );
                break;

            case "k":
                glm.mat4.rotateX(
                    this.objects[i].rotationMatrix,
                    this.objects[i].rotationMatrix,
                    5 * Math.PI / 180.0
                );
                break;

            case "o":
                glm.mat4.rotateY(
                    this.objects[i].rotationMatrix,
                    this.objects[i].rotationMatrix,
                    -5 * Math.PI / 180.0
                );
                break;

            case "u":
                glm.mat4.rotateY(
                    this.objects[i].rotationMatrix,
                    this.objects[i].rotationMatrix,
                    5 * Math.PI / 180.0
                );
                break;

            case "l":
                glm.mat4.rotateZ(
                    this.objects[i].rotationMatrix,
                    this.objects[i].rotationMatrix,
                    -5 * Math.PI / 180.0
                );
                break;

            case "j":
                glm.mat4.rotateZ(
                    this.objects[i].rotationMatrix,
                    this.objects[i].rotationMatrix,
                    5 * Math.PI / 180.0
                );
                break;

            default:
                break;
        }
    }

    keydownGlobal = (event: KeyboardEvent) => {
        if (this.mode != Mode.GLOBAL) return;

        switch (event.key) {
            // --------------- TRANSLATION ---------------
            case "ArrowUp":
                for (const object of this.objects) {
                    object.translate(
                        glm.vec3.fromValues(0.0, 0.05, 0.0)
                    );
                }
                break;

            case "ArrowDown":
                for (const object of this.objects) {
                    object.translate(
                        glm.vec3.fromValues(0.0, -0.05, 0.0)
                    );
                }
                break;

            case "ArrowLeft":
                for (const object of this.objects) {
                    object.translate(
                        glm.vec3.fromValues(-0.05, 0.0, 0.0)
                    );
                }
                break;

            case "ArrowRight":
                for (const object of this.objects) {
                    object.translate(
                        glm.vec3.fromValues(0.05, 0.0, 0.0)
                    );
                }
                break;

            case ",":
                for (const object of this.objects) {
                    object.translate(
                        glm.vec3.fromValues(0.0, 0.0, 0.05)
                    );
                }
                break;

            case ".":
                for (const object of this.objects) {
                    object.translate(
                        glm.vec3.fromValues(0.0, 0.0, -0.05)
                    );
                }
                break;

            // --------------- SCALING ---------------
            case "a":
                glm.mat4.scale(
                    this.globT,
                    this.globT,
                    glm.vec3.fromValues(0.9, 1.0, 1.0)
                );
                break;

            case "A":
                glm.mat4.scale(
                    this.globT,
                    this.globT,
                    glm.vec3.fromValues(1.1, 1.0, 1.0)
                );
                break;

            case "b":
                glm.mat4.scale(
                    this.globT,
                    this.globT,
                    glm.vec3.fromValues(1.0, 0.9, 1.0)
                );
                break;

            case "B":
                glm.mat4.scale(
                    this.globT,
                    this.globT,
                    glm.vec3.fromValues(1.0, 1.1, 1.0)
                );
                break;

            case "c":
                glm.mat4.scale(
                    this.globT,
                    this.globT,
                    glm.vec3.fromValues(1.0, 1.0, 0.9)
                );
                break;

            case "C":
                glm.mat4.scale(
                    this.globT,
                    this.globT,
                    glm.vec3.fromValues(1.0, 1.0, 1.1)
                );
                break;

            // --------------- ROTATION ---------------
            case "i":
                glm.mat4.rotateX(
                    this.globT,
                    this.globT,
                    (-5 * Math.PI) / 180.0
                );
                break;

            case "k":
                glm.mat4.rotateX(
                    this.globT,
                    this.globT,
                    (5 * Math.PI) / 180.0
                );
                break;

            case "o":
                glm.mat4.rotateY(
                    this.globT,
                    this.globT,
                    (-5 * Math.PI) / 180.0
                );
                break;

            case "u":
                glm.mat4.rotateY(
                    this.globT,
                    this.globT,
                    (5 * Math.PI) / 180.0
                );
                break;

            case "l":
                glm.mat4.rotateZ(
                    this.globT,
                    this.globT,
                    (-5 * Math.PI) / 180.0
                );
                break;

            case "j":
                glm.mat4.rotateZ(
                    this.globT,
                    this.globT,
                    (5 * Math.PI) / 180.0
                );
                break;

            default:
                break;

        }
        // TODO: this is probably a terrible way of doing this
        for (const obj of this.objects) {
            glm.mat4.copy(
                obj.globalTransformMatrix,
                this.globT
            );
        }
    }


    keydownLight = (event: KeyboardEvent) => {

    }

    getMode(): Mode { return this.mode; }
    getSelectedObject() { return this.selectedObject; }
} 
