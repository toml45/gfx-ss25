import * as glm from './gl-matrix/index.js';

export class Camera {
    viewMatrix: mat4;
    eye: vec3 = glm.vec3.fromValues(0.0, 0.0, 10.0);

    constructor() {
        this.viewMatrix = this.initViewMatrix(this.eye);
    }
    
    /**
     * Initializes the camera's view matrix based on the eye position
     * (camera location).
     * 
     * @param {vec3} eye - The camera's position in 3D space.
     * @returns {mat4} The view matrix.
     */
    initViewMatrix(eye: vec3) {
        const viewMatrix = glm.mat4.create();
        const target = glm.vec3.create();
        glm.vec3.add(target, eye, glm.vec3.fromValues(0, 0, -1));
        glm.mat4.lookAt(viewMatrix, eye, target, [0, 1, 0]);

        return viewMatrix;
    }
   
    translate(translationVector: vec3) {
        glm.mat4.translate(
            this.viewMatrix,
            this.viewMatrix,
            translationVector
        )
    }
}