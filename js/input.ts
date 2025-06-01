import { Camera } from "./camera";
import { Cube } from "./cube";
import { Entity } from "./entity";
import * as glm from "./gl-matrix/index.js";
import { Grid } from "./grid";
import { Shader } from "./shader";
import { Tetracube } from "./tetracube";

export class InputHandler {
    private drag: boolean = false;
    private horizontalDelta = 0;
    private currentShader: String;

    paused: boolean;
    activeTetracube: Tetracube;
    allCubes: Cube[];
    camera: Camera;
    canvas: HTMLCanvasElement;
    shadows: boolean = false;
    shaderMap: Map<String, Shader>;
    gl: WebGL2RenderingContext;
    debugGrid: boolean;
    ortho: boolean;

    ambientComponent: number;
    diffuseComponent: number;
    specularComponent: number;

    constructor(
        canvas: HTMLCanvasElement,
        activeTetracube: Tetracube,
        camera: Camera,
        shaderMap: Map<String, Shader>,
        gl: WebGL2RenderingContext,
        paused: boolean = false,
        debugGrid: boolean = false
    ) {

        this.canvas = canvas;
        this.activeTetracube = activeTetracube;
        this.camera = camera;
        this.shaderMap = shaderMap;
        this.gl = gl;
        this.addEventHandlers();
        this.paused = false;
        this.debugGrid = false;
        this.ortho = true;
        this.currentShader = 'gs'

        this.ambientComponent = 0.2;
        this.diffuseComponent = 0.7;
        this.specularComponent = 0.8;
    }

    keydownCamera = (event: KeyboardEvent) => {
        switch (event.key) {

            case "j":
                glm.mat4.rotateY(
                    this.camera.viewMatrix,
                    this.camera.viewMatrix,
                    5 * Math.PI / 180.0
                );
                break;

            case "l":
                glm.mat4.rotateY(
                    this.camera.viewMatrix,
                    this.camera.viewMatrix,
                    -5 * Math.PI / 180.0
                );
                break;

            case "i":
                glm.mat4.rotateX(
                    this.camera.viewMatrix,
                    this.camera.viewMatrix,
                    5 * Math.PI / 180.0
                );
                break;

            case "k":
                glm.mat4.rotateX(
                    this.camera.viewMatrix,
                    this.camera.viewMatrix,
                    -5 * Math.PI / 180.0
                );
                break;

            case "u":
                glm.mat4.rotateZ(
                    this.camera.viewMatrix,
                    this.camera.viewMatrix,
                    5 * Math.PI / 180.0
                );
                break;

            case "o":
                glm.mat4.rotateZ(
                    this.camera.viewMatrix,
                    this.camera.viewMatrix,
                    -5 * Math.PI / 180.0
                );
                break;

            case '+':
                glm.mat4.scale(
                    this.camera.viewMatrix,
                    this.camera.viewMatrix,
                    [1.05, 1.05, 1.05]
                );
                break;

            case '-':
                glm.mat4.scale(
                    this.camera.viewMatrix,
                    this.camera.viewMatrix,
                    [0.95, 0.95, 0.95]
                );

                break;

            default:
                break;
        }
    }

    private addEventHandlers() {
        this.canvas.addEventListener("mousedown", this.mousedown);
        this.canvas.addEventListener("mouseup", this.mouseup);
        this.canvas.addEventListener("mousemove", this.mousemove);

        document.addEventListener("keydown", this.keydownDebug);
        document.addEventListener("keydown", this.keydownGame);
        document.addEventListener("keydown", this.keydownCamera);
        document.addEventListener("keydown", this.keydownShader);

        const ambientSlider = document.getElementById('ambientSlider');
        const diffuseSlider = document.getElementById('diffuseSlider');
        const specularSlider = document.getElementById('specularSlider');

        ambientSlider.addEventListener('input', this.ambientSliderInput);
        diffuseSlider.addEventListener('input', this.diffuseSliderInput);
        specularSlider.addEventListener('input', this.specularSliderInput);
    }

    ambientSliderInput = (event: Event) => {
        this.ambientComponent = event.target.value; //no idea how to fix this ts error
    }
    diffuseSliderInput = (event: Event) => {
        this.diffuseComponent = event.target.value; //no idea how to fix this ts error
    }
    specularSliderInput = (event: Event) => {
        this.specularComponent = event.target.value; //no idea how to fix this ts error
    }

    mousedown = (event: MouseEvent) => {

        if (this.drag == false) {
            const rect = this.canvas.getBoundingClientRect();
            this.horizontalDelta = event.clientX - rect.left;

            //console.log(`Mouse down at (${mouseDownCoord})`);
        }
        this.drag = true;
    }

    mouseup = (event: MouseEvent) => {
        //console.log(`Mouse up at (${x}, ${y})`);
        this.drag = false;
        this.horizontalDelta = 0;
    }

    mousemove = (event: MouseEvent) => {
        if (this.drag) {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const result = this.horizontalDelta - x;

            glm.mat4.rotateY(
                this.camera.viewMatrix,
                this.camera.viewMatrix,
                result * -0.5 * Math.PI / 180.0
            );
            this.horizontalDelta = x;
        }


    }

    keydownDebug = (event: KeyboardEvent) => {
        switch (event.key) {
            case "p":
                this.paused = !this.paused;
                break;
            case "g":
                this.debugGrid = !this.debugGrid;
                break;
            case "v":
                this.ortho = !this.ortho;
            default:
                break;
        }
    }

    keydownGame = (event: KeyboardEvent) => {
        if (this.paused) return;
        switch (event.key) {
            case "w":
                this.activeTetracube.globalTranslate(
                    [0, 0, -1],
                    this.allCubes
                );
                break;
            case "ArrowUp":
                this.activeTetracube.globalTranslate(
                    [0, 0, -1],
                    this.allCubes
                );
                break;

            case "s":
                this.activeTetracube.globalTranslate(
                    [0, 0, 1],
                    this.allCubes
                );
                break;
            case "ArrowDown":
                this.activeTetracube.globalTranslate(
                    [0, 0, 1],
                    this.allCubes
                );
                break;

            case "a":
                this.activeTetracube.globalTranslate(
                    [1, 0, 0],
                    this.allCubes
                );
                break;
            case "ArrowLeft":
                this.activeTetracube.globalTranslate(
                    [1, 0, 0],
                    this.allCubes
                );
                break;

            case "d":
                this.activeTetracube.globalTranslate(
                    [-1, 0, 0],
                    this.allCubes
                );
                break;
            case "ArrowRight":
                this.activeTetracube.globalTranslate(
                    [-1, 0, 0],
                    this.allCubes
                );
                break;

            case " ":
                this.activeTetracube.snapToBottom(
                    this.allCubes
                )
                break;
            case "x":
                this.activeTetracube.rotateX(-1, this.allCubes);
                break;
            case "X":
                this.activeTetracube.rotateX(1, this.allCubes);
                break;
            case "y":
                this.activeTetracube.rotateY(-1, this.allCubes);
                break;
            case "Y":
                this.activeTetracube.rotateY(1, this.allCubes);
                break;
            case "z":
                this.activeTetracube.rotateZ(-1, this.allCubes);
                break;
            case "Z":
                this.activeTetracube.rotateZ(1, this.allCubes);
                break;
            default:
                break;
        }
    }

    //TODO: better way to handle this, this is out of place
    keydownShader = (event: KeyboardEvent) => {

        let shader: Shader = this.getCurrentShader();
        switch (event.key) {
            case 'f':
                if (this.currentShader === 'gs') {
                    console.log('switching to phong');
                    shader = this.shaderMap.get('ps');
                    this.currentShader = 'ps';
                } else {
                    console.log('switching to gouraud');
                    shader = this.shaderMap.get('gs');
                    this.currentShader = 'gs';
                }
                for (const cube of this.allCubes) {
                    cube.initializeBuffersAndVAO(this.gl, shader);
                }
                for (const cube of this.activeTetracube.toCubes())
                    cube.initializeBuffersAndVAO(this.gl, shader);
                shader.bind(this.gl);
                break;
            default:
                break;
        }
    }


    setGameState(activeTetracube: Tetracube, allCubes: Cube[]) {
        this.activeTetracube = activeTetracube;
        this.allCubes = allCubes;
    }
    isPaused() {
        return this.paused;
    }
    getDebugGrid() {
        return this.debugGrid;
    }

    bindCurrentShader() {
        this.shaderMap.get(this.currentShader).bind(this.gl);
    }
    getCurrentShader(): Shader { return this.shaderMap.get(this.currentShader); }
}