import * as glm from './gl-matrix/index.js';

class Camera {
    eye = glm.vec3.fromValues(0.0, 0.0, 10.0);

    constructor() {
        this.viewMatrix = this.initViewMatrix(this.eye);
    }

    initViewMatrix(eye: ) {
        const viewMatrix = glm.mat4.create();
        const target = glm.vec3.create();
        glm.vec3.add(target, eye, glm.vec3.fromValues);

        return viewMatrix;
    }
}