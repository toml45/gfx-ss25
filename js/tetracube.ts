import { Cube } from "./cube.js";
import * as glm from "./gl-matrix/index.js";
import { translate } from "./gl-matrix/mat2d.js";
import { Shader } from "./shader.js";

export enum TetracubeType {
    I, O, L, T, N, TOWER_RIGHT, TOWER_LEFT, TRIPOD
}

export class Tetracube {
    cubes: Cube[];
    type: TetracubeType;
    color: vec3;

    constructor(type: TetracubeType) {
        this.color = glm.vec3.fromValues(
            Math.random(),
            Math.random(),
            Math.random()
        );
        this.cubes = [];
        this.cubes.push(new Cube(this.color));
        this.cubes.push(new Cube(this.color));
        this.cubes.push(new Cube(this.color));
        this.cubes.push(new Cube(this.color));

        switch (type) {
            case TetracubeType.I:
                this.cubes[1].initTranslate([1.0, 0.0, 0.0]);
                this.cubes[2].initTranslate([2.0, 0.0, 0.0]);
                this.cubes[3].initTranslate([3.0, 0.0, 0.0]);
                for (const cube of this.cubes) {
                    cube.globalTranslate([-1.5, 5.5, -0.5]);
                }
                break;
            case TetracubeType.O:
                this.cubes[1].initTranslate([0.0, 1.0, 0.0]);
                this.cubes[2].initTranslate([1.0, 0.0, 0.0]);
                this.cubes[3].initTranslate([1.0, 1.0, 0.0]);
                for (const cube of this.cubes) {
                    cube.globalTranslate([-0.5, 5.5, -0.5]);
                }
                break;
            case TetracubeType.L:
                this.cubes[1].initTranslate([1.0, 0.0, 0.0]);
                this.cubes[2].initTranslate([2.0, 0.0, 0.0]);
                this.cubes[3].initTranslate([2.0, 1.0, 0.0]);
                for (const cube of this.cubes) {
                    cube.globalTranslate([-1.5, 5.5, -0.5]);
                }
                break;
            case TetracubeType.T:
                this.cubes[1].initTranslate([1.0, 0.0, 0.0]);
                this.cubes[2].initTranslate([1.0, 1.0, 0.0]);
                this.cubes[3].initTranslate([2.0, 0.0, 0.0]);
                for (const cube of this.cubes) {
                    cube.globalTranslate([-1.5, 5.5, -0.5]);
                }
                break;
            case TetracubeType.N:
                this.cubes[1].initTranslate([1.0, 0.0, 0.0]);
                this.cubes[2].initTranslate([1.0, 1.0, 0.0]);
                this.cubes[3].initTranslate([2.0, 1.0, 0.0]);
                for (const cube of this.cubes) {
                    cube.globalTranslate([-0.5, 5.5, -0.5]);
                }
                break;
            case TetracubeType.TOWER_RIGHT:
                this.cubes[1].initTranslate([1.0, 0.0, 0.0]);
                this.cubes[2].initTranslate([1.0, 0.0, 1.0]);
                this.cubes[3].initTranslate([1.0, 1.0, 1.0]);
                for (const cube of this.cubes) {
                    cube.globalTranslate([-0.5, 5.5, -0.5]);
                }
                break;
            case TetracubeType.TOWER_LEFT:
                this.cubes[1].initTranslate([0.0, 0.0, 1.0]);
                this.cubes[2].initTranslate([0.0, 1.0, 1.0]);
                this.cubes[3].initTranslate([1.0, 0.0, 0.0]);
                for (const cube of this.cubes) {
                    cube.globalTranslate([-0.5, 5.5, -0.5]);
                }
                break;
            case TetracubeType.TRIPOD:
                this.cubes[1].initTranslate([1.0, 0.0, 0.0]);
                this.cubes[2].initTranslate([1.0, 1.0, 0.0]);
                this.cubes[3].initTranslate([1.0, 0.0, -1.0]);
                for (const cube of this.cubes) {
                    cube.globalTranslate([-0.5, 5.5, 0.5]);
                }
                break;
        }

    }

    static spawn(gl: WebGL2RenderingContext, shader: Shader): Tetracube {
        const type: TetracubeType = Math.floor(Math.random() * 8) as TetracubeType;
        const tetracube = new Tetracube(type);
        tetracube.initializeBuffersAndVAO(gl, shader);
        return tetracube;
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
            cube.globalTranslate([0, -unit, 0]);
        }
    }

    checkGravityCollision() { //TODO: should take array of cubes to comp with.
        for (const cube of this.cubes) {
            if (cube.getY() < -5 + 0.5) { //should snap
                const t = Math.abs(-4.5 - cube.getY())
                for (const c of this.cubes) { //TODO: find a better way to do this
                    c.initTranslate([0, t, 0])
                }
                return true;
            }
        }
        return false;
    }

    toCubes(): Cube[] {
        return this.cubes;
    }

    _checkColl(vec1: vec3, vec2: vec3) {
        if (Math.abs(vec1[1] - vec2[1]) < 1)
            if (Math.abs(vec1[0] - vec2[0]) < 1)
                if (Math.abs(vec1[2] - vec2[2]) < 1)
                    return true;
        return false;
    }

    checkCubeGravityCollision(cubes: Cube[]) {
        //incredibly inefficient
        for (const c1 of this.cubes) {
            for (const c2 of cubes) {
                if (this._checkColl(c1.getFullPos(), c2.getFullPos())) {
                    const t = 1 - Math.abs(c1.getY() - c2.getY())
                    for (const c of this.cubes) { //TODO: find a better way to do this
                        c.globalTranslate([0, t, 0])
                    }
                    return true;
                }
            }
        }
        return false;
    }

    checkNewPos(trCubePos: vec3, cubes: Cube[]) {
        if (trCubePos[1] < -4.5)
            return true;
        if (trCubePos[0] > 1.5 || trCubePos[0] < -1.5)
            return true;
        if (trCubePos[2] > 1.5 || trCubePos[2] < -1.5)
            return true;
        for (const c of cubes) {
            if (this._checkColl(trCubePos, c.getFullPos())) {
                return true;
            }
        }
        return false;
    }

    //-----movement------
    globalTranslate(translationVector: vec3, cubes: Cube[] = []) {

        for (const cube of this.cubes) {
            const cubePos: vec3 = cube.getFullPos();
            const trCubePos = glm.vec3.create();
            glm.vec3.add(trCubePos, cubePos, translationVector);
            if (this.checkNewPos(trCubePos, cubes))
                return;
        }
        for (const cube of this.cubes) {
            cube.globalTranslate(translationVector);
        }
    }

    rotateX(clockwise: number, cubes: Cube[]) { //should be only 1 or -1, 1 cw, -1 ccw
        for (const cube of this.cubes) {
            const globalTransformCopy = glm.mat4.create();
            glm.mat4.copy(globalTransformCopy, cube.globalTransformMatrix);
            glm.mat4.rotateX(
                globalTransformCopy,
                globalTransformCopy,
                (-1 * clockwise * Math.PI) / 2
            )
            const newModelViewMatrix = glm.mat4.create();
            glm.mat4.copy(
                newModelViewMatrix,
                cube.getModelViewWithCustomGlobalTransform(globalTransformCopy)
            )
            const newCubePos = glm.vec3.create();
            glm.mat4.getTranslation(newCubePos, newModelViewMatrix);
            //we got the new rotated position, now theres two options, either we have space to kick
            //or we do not have any space at all, so we just ignore the rotation
            if (this.checkNewPos(newCubePos, cubes))
                return;

        }

        for (const cube of this.cubes) {
            glm.mat4.rotateX(
                cube.globalTransformMatrix,
                cube.globalTransformMatrix,
                (-1 * clockwise * Math.PI) / 2
            )
        }
    }
    rotateY(clockwise: number, cubes: Cube[]) {
        for (const cube of this.cubes) {
            const globalTransformCopy = glm.mat4.create();
            glm.mat4.copy(globalTransformCopy, cube.globalTransformMatrix);
            glm.mat4.rotateY(
                globalTransformCopy,
                globalTransformCopy,
                (-1 * clockwise * Math.PI) / 2
            )
            const newModelViewMatrix = glm.mat4.create();
            glm.mat4.copy(
                newModelViewMatrix,
                cube.getModelViewWithCustomGlobalTransform(globalTransformCopy)
            )
            const newCubePos = glm.vec3.create();
            glm.mat4.getTranslation(newCubePos, newModelViewMatrix);
            //we got the new rotated position, now theres two options, either we have space to kick
            //or we do not have any space at all, so we just ignore the rotation
            if (this.checkNewPos(newCubePos, cubes))
                return;

        }
        for (const cube of this.cubes) {
            glm.mat4.rotateY(
                cube.globalTransformMatrix,
                cube.globalTransformMatrix,
                (-1 * clockwise * Math.PI) / 2
            )
        }
    }
    rotateZ(clockwise: number, cubes: Cube[]) {
        for (const cube of this.cubes) {
            const globalTransformCopy = glm.mat4.create();
            glm.mat4.copy(globalTransformCopy, cube.globalTransformMatrix);
            glm.mat4.rotateZ(
                globalTransformCopy,
                globalTransformCopy,
                (-1 * clockwise * Math.PI) / 2
            )
            const newModelViewMatrix = glm.mat4.create();
            glm.mat4.copy(
                newModelViewMatrix,
                cube.getModelViewWithCustomGlobalTransform(globalTransformCopy)
            )
            const newCubePos = glm.vec3.create();
            glm.mat4.getTranslation(newCubePos, newModelViewMatrix);
            //we got the new rotated position, now theres two options, either we have space to kick
            //or we do not have any space at all, so we just ignore the rotation
            if (this.checkNewPos(newCubePos, cubes))
                return;

        }
        for (const cube of this.cubes) {
            glm.mat4.rotateZ(
                cube.globalTransformMatrix,
                cube.globalTransformMatrix,
                (-1 * clockwise * Math.PI) / 2
            )
        }
    }

    snapToBottom(cubes: Cube[]) {
        //incredibly inefficient
        let closestTetracube: Cube = null;
        let closestCube: Cube = null;
        let minDistance = 10e9;
        for (const c1 of this.cubes) {
            for (const c2 of cubes) {
                if (Math.abs(c1.getX() - c2.getX()) < 1)
                    if (Math.abs(c1.getZ() - c2.getZ()) < 1) {
                        const dy = Math.abs(c1.getY() - c2.getY())
                        if (dy < minDistance) {
                            closestTetracube = c1;
                            closestCube = c2;
                            minDistance = dy;
                        }
                    }
            }
        }

        if (closestTetracube === null) {
            let lowestCube = 10e9;
            for (const c of this.cubes) {
                if (c.getY() < lowestCube)
                    lowestCube = c.getY();
            }
            console.log(lowestCube)
            const t = Math.abs(lowestCube + 4.5);
            console.log(`to floor: ${t}`);
            this.globalTranslate([0, -t, 0]);
            return;
        }

        const t = Math.abs(closestCube.getY() - closestTetracube.getY()) - 1;
        console.log(`to othercube: ${t}`);

        this.globalTranslate([0, -t, 0]);

    }
}
