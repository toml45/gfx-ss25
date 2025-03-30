import * as glm from './gl-matrix/index.js';
import {Shape} from './shape.js';

export class OBJParser{
    static parseOBJ(obj: string): Shape{
        let vertexData: number[] = [];
        let normals: number[] = [];
        let indices: number[] = [];
        let colors: number[] = [];
        let boundingBoxTransform: mat4;

        const lines = obj.split('\n');
        for(const line of lines){
            const inputs = line.split(' ');
            switch(inputs[0]){
                case "v":
                    vertexData.push(parseFloat(inputs[1]));
                    vertexData.push(parseFloat(inputs[2]));
                    vertexData.push(parseFloat(inputs[3]));
                    break;
                case "vn":
                    normals.push(parseFloat(inputs[1]));
                    normals.push(parseFloat(inputs[2]));
                    normals.push(parseFloat(inputs[3]));
                    break;
                case "f":
                    for(let i = 1; i < 4; i++){ //assume we only have 3 vertices
                        const faceData = inputs[i].split('/');
                        const vertexCoord = parseFloat(faceData[0])-1;
                        indices.push(vertexCoord);

                        colors.push(1.0);
                        colors.push(0.0);
                        colors.push(0.0);
                    }
                    break;
                default:
                    console.log(`UNSUPPORTED: ${line}`)
            }
        }
        return new Shape(
            vertexData,
            indices,
            colors,
            glm.mat4.create()
        );
    }


}