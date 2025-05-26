import * as glm from './gl-matrix/index.js'

export class Camera {
    viewMatrix: mat4;

    constructor(eye: vec3, up: vec3, target: vec3) {
        this.viewMatrix = glm.mat4.create();
        const toTarget = glm.vec3.create();
        glm.vec3.sub(toTarget, target, eye);
        glm.vec3.normalize(toTarget, toTarget);
        glm.mat4.lookAt(
            this.viewMatrix,
            eye,
            toTarget,
            up
        );

    }

    //TODO add transformation methods or perhaps do them immediately?
    //TODO add method to turn from projection to ortho
    //TODO getter for viewMatrix?

}