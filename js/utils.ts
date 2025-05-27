import * as glm from './gl-matrix/index.js';
import { Cube } from './cube.js';


/*
export const parseOBJSmoothNormals = (obj: string, color: vec3): Cube => {

    let vertexMap: Map<number, vec3[]> = new Map();

    let vertexData: number[] = [];
    let normalData: number[] = [];

    let vertexes: number[] = [];
    let normals: number[] = [];
    let indices: number[] = [];
    let colors: number[] = [];

    const lines = obj.split('\n');
    let index = 0;
    for (const line of lines) {
        const inputs = line.split(' ');
        switch (inputs[0]) {
            case "v":
                vertexes.push(parseFloat(inputs[1]));
                vertexes.push(parseFloat(inputs[2]));
                vertexes.push(parseFloat(inputs[3]));
                break;
            case "vn":
                //currently we do nothing with the normals
                normals.push(parseFloat(inputs[1]));
                normals.push(parseFloat(inputs[2]));
                normals.push(parseFloat(inputs[3]));
                break;
            case "f":
                for (let i = 1; i < 4; i++) { //assume we only have 3 vertices
                    const faceData = inputs[i].split('/');
                    const vertexCoord = parseFloat(faceData[0]) - 1;
                    const normalCoord = parseFloat(faceData[2]) - 1;

                    const normal = glm.vec3.fromValues(
                        normals[normalCoord * 3],
                        normals[normalCoord * 3 + 1],
                        normals[normalCoord * 3 + 2]
                    );

                    indices.push(vertexCoord)
                    if (!vertexMap.has(vertexCoord)) {
                        vertexMap.set(vertexCoord, [normal])
                    } else {
                        //console.log('dupe found');
                        const arr = vertexMap.get(vertexCoord);
                        arr.push(normal);
                    }

                    colors.push(0.0);
                    colors.push(1.0);
                    colors.push(0.0);
                }
                break;
            default:
                console.log(`UNSUPPORTED: ${line}`)
        }
    }
    for (let i = 0; i < vertexes.length / 3; i += 1) {

        //console.log(vertex);
        const normals: vec3[] = vertexMap.get(i);
        //console.log(vertexes);
        //console.log(vertexMap);
        //console.log(normals);
        const averageNormal = glm.vec3.create();
        for (const normal of normals) {
            glm.vec3.add(averageNormal, averageNormal, normal);
        }
        glm.vec3.scale(averageNormal, averageNormal, 1 / normals.length);
        normalData.push(averageNormal[0]);
        normalData.push(averageNormal[1]);
        normalData.push(averageNormal[2]);
    }
    return new Cube(
        vertexes,
        indices,
        normalData,
        color,
        glm.mat4.create(),
    );
}*/

export const parseOBJCube = (obj: string, color: vec3): any => {

    let vertexData: number[] = [];
    let normalData: number[] = [];

    let vertexes: number[] = [];
    let normals: number[] = [];
    let indices: number[] = [];
    let colors: number[] = [];

    const lines = obj.split('\n');
    let index = 0;
    for (const line of lines) {
        const inputs = line.split(' ');
        switch (inputs[0]) {
            case "v":
                vertexes.push(parseFloat(inputs[1]));
                vertexes.push(parseFloat(inputs[2]));
                vertexes.push(parseFloat(inputs[3]));
                break;
            case "vn":
                //currently we do nothing with the normals
                normals.push(parseFloat(inputs[1]));
                normals.push(parseFloat(inputs[2]));
                normals.push(parseFloat(inputs[3]));
                break;
            case "f":
                for (let i = 1; i < 4; i++) { //assume we only have 3 vertices
                    const faceData = inputs[i].split('/');
                    const vertexCoord = parseFloat(faceData[0]) - 1;
                    const normalCoord = parseFloat(faceData[2]) - 1;

                    const vertex = glm.vec3.fromValues(
                        vertexes[vertexCoord * 3],
                        vertexes[vertexCoord * 3 + 1],
                        vertexes[vertexCoord * 3 + 2]
                    );
                    const normal = glm.vec3.fromValues(
                        normals[normalCoord * 3],
                        normals[normalCoord * 3 + 1],
                        normals[normalCoord * 3 + 2]
                    );

                    vertexData.push(vertex[0], vertex[1], vertex[2]);
                    normalData.push(normal[0], normal[1], normal[2]);
                    indices.push(index);
                    index++;
                }
                break;
            default:
                console.log(`UNSUPPORTED: ${line}`)
        }
    }
    return ({
        vertexData: vertexData,
        indices: indices,
        normalData: normalData,
    }
    )
}