import { Cube } from "./cube.js";
import * as glm from "./gl-matrix/index.js";
import { Shader } from "./shader.js";

export enum TetracubeType {
    I, O, L, T, N, TOWER_RIGHT, TOWER_LEFT, TRIPOD
}

export class Tetracube {
    cubes: Cube[];
    type: TetracubeType;
    color: vec3;

    constructor(type: TetracubeType) {
        this.color = glm.vec3.create();
        glm.vec3.random(this.color, 1); //wont give all colors but should be ok
        this.cubes = [];
        this.cubes.push(new Cube(this.color));
        this.cubes.push(new Cube(this.color));
        this.cubes.push(new Cube(this.color));
        this.cubes.push(new Cube(this.color));

        switch (type) {
            case TetracubeType.I:
                this.cubes[1].translate([1.0, 0.0, 0.0]);
                this.cubes[2].translate([2.0, 0.0, 0.0]);
                this.cubes[3].translate([3.0, 0.0, 0.0]);
                break;
            case TetracubeType.O:
                this.cubes[1].translate([0.0, 1.0, 0.0]);
                this.cubes[2].translate([1.0, 0.0, 0.0]);
                this.cubes[3].translate([1.0, 1.0, 0.0]);
                break;
            case TetracubeType.L:
                this.cubes[1].translate([1.0, 0.0, 0.0]);
                this.cubes[2].translate([2.0, 0.0, 0.0]);
                this.cubes[3].translate([2.0, 1.0, 0.0]);
                break;
            case TetracubeType.T:
                this.cubes[1].translate([1.0, 0.0, 0.0]);
                this.cubes[2].translate([1.0, 1.0, 0.0]);
                this.cubes[3].translate([2.0, 0.0, 0.0]);
                break;
            case TetracubeType.N:
                this.cubes[1].translate([1.0, 0.0, 0.0]);
                this.cubes[2].translate([1.0, 1.0, 0.0]);
                this.cubes[3].translate([2.0, 1.0, 0.0]);
                break;
            case TetracubeType.TOWER_RIGHT:
                this.cubes[1].translate([1.0, 0.0, 0.0]);
                this.cubes[2].translate([1.0, 0.0, 1.0]);
                this.cubes[3].translate([1.0, 1.0, 1.0]);
                break;
            case TetracubeType.TOWER_LEFT:
                this.cubes[1].translate([0.0, 0.0, 1.0]);
                this.cubes[2].translate([0.0, 1.0, 1.0]);
                this.cubes[3].translate([1.0, 0.0, 0.0]);
                break;
            case TetracubeType.TRIPOD:
                this.cubes[1].translate([1.0, 0.0, 0.0]);
                this.cubes[2].translate([1.0, 1.0, 0.0]);
                this.cubes[3].translate([1.0, 0.0, -1.0]);
                break;
        }

    }

    initializeBuffersAndVAO(gl: WebGL2RenderingContext, shader: Shader) {
        for (const cube of this.cubes) {
            cube.initializeBuffersAndVAO(gl, shader);
        }
    }

    draw(gl: WebGL2RenderingContext, shader: Shader) {
        for (const cube of this.cubes) {
            cube.draw(gl, shader);
        }
    }

    moveDown(unit: number) { //rename this horrendous thing
        for (const cube of this.cubes) {
            cube.translate([0, -unit, 0]);
        }
    }

    checkGravityCollision() { //TODO: should take array of cubes to comp with.
        for (const cube of this.cubes) {
            if (cube.getY() <= -5 + 0.5) { //should snap
                return true;
            }
        }
        return false;
    }
}
