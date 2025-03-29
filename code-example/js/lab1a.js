


//const generateFromOBJFile = (objFile) => {
//    const objParser = new OBJParser();
//    const objData = objParser.parse(objFile);
//
//    const colorsArray = [
//        [136.0 / 255.0, 213.0 / 255.0, 213.0 / 255.0],
//        [136.0 / 255.0, 213.0 / 255.0, 213.0 / 255.0],
//        [136.0 / 255.0, 213.0 / 255.0, 213.0 / 255.0]
//    ]
//
//    const colors = [];
//
//    for (let i = 0; i < objData.vertices.length / 3; i++) {
//        const color = colorsArray[i % 3]; // cycle through the colorsArray
//        colors.push(
//            ...color
//        );
//    }
//    
//    return new Shape(
//        objData.vertices,
//        objData.indices,
//        colors,
//        objData.boundingBoxTransform
//    );
//}

const generateSquare = () => {
    return new Shape(
        [   // Vertex Data
            -0.5, -0.5, 0.0,
             0.5, -0.5, 0.0,
             0.5,  0.5, 0.0,
            -0.5,  0.5, 0.0
        ],
        [   // Indices
            0, 2, 1,
            0, 2, 3
        ],
        [   // Color
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0
        ],
        glm.mat4.create()
    )
}

const main = async () => {



    // Check if WebGL is available in the browser
    if (gl === null) {
        console.log("WebGL is not available in this browser");
        return;
    }

    // Load shaders
    const sBase = new Shader("basic");
    await sBase.loadAndCompile(gl);

    // Load models
    //const cube = await fetch('/sampleModels/cube.obj')
    //    .then(response => response.text());
    //const teapot = await fetch('/sampleModels/teapot.obj')
    //    .then(response => response.text());
    //const bunny = await fetch('/sampleModels/bunny.obj')
    //    .then(response => response.text());
    //const tetrahedron = await fetch('/sampleModels/tetrahedron.obj')
    //    .then(response => response.text());

    // Initialize objects
    const objects = [];

    objects.push(generateSquare());
    objects[0].translate([-3.0, 2.5, 0.0]); // Move it to the correct pos

    objects.push(generateSquare());
    objects[1].translate([0.0, 2.5, 0.0])

    objects.push(generateSquare());
    objects[2].translate([3.0, 2.5, 0.0])

    objects.push(generateSquare());
    objects[3].translate([-3.0, 0.0, 0.0])

    objects.push(generateSquare());
    objects[4].translate([0.0, 0.0, 0.0])

    objects.push(generateSquare());
    objects[5].translate([3.0, 0.0, 0.0])

    objects.push(generateSquare());
    objects[6].translate([-3.0, -2.5, 0.0])

    objects.push(generateSquare());
    objects[7].translate([0.0, -2.5, 0.0])

    objects.push(generateSquare());
    objects[8].translate([3.0, -2.5, 0.0])

    // Build VAOs for all objects with base shader
    for (const eachObject of objects) {
        eachObject.initializeBuffersAndVAO(gl, sBase);
    }

    glm.mat4.perspective(
        projectionMatrix, // Output
        (45 * Math.PI) / 180, // Field of view in radians
        gl.canvas.clientWidth / gl.canvas.clientHeight, // Aspect ratio
        0.1, // Near
        100.0 // Far
    );

    const draw = (_) => {
        // Clear the screen with black color
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        //gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Clear the color and depth buffers
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
       
        glm.mat4.multiply(
            updatedViewMatrix,
            camera.viewMatrix,
            globalTransformationMatrix
        );

        sBase.bind(gl);
        sBase.uniformMatrices(gl, projectionMatrix, updatedViewMatrix);

        // Draw all the objects
        for (const eachObject of objects) {
            eachObject.draw(gl, sBase);
        }

        window.requestAnimationFrame(draw);
    };

    window.requestAnimationFrame(draw);
}

main();
