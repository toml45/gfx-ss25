import * as glm from './gl-matrix/index.js'

export class Camera {
    viewMatrix: mat4;
    eye: vec3;
    perspectiveProjectionMatrix: mat4;
    orthographicProjectionMatrix: mat4;
    zoomFactor = 0;

    constructor(eye: vec3, up: vec3, target: vec3) {
        this.eye = eye;
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


}