# Lab 1b

## Claim
- T1 implemented
- T2 implemented
- T3 implemented
- T4 implemented 
- T5 implemented
- B1 implemented

## Tested environments
Browsers tested on:
- Firefox `137.0.2 (64-bit)`
Developed and Tested on a Windows 11 23H2 with WSL2


## Additional and general remarks
The tsconfig i compiled the code with is included
All I did to run the code was:
`$tsc`
`$python3 -m http.server`
#### Notes
- the tetrahedron obejct appears weird, i think because of the normal averaging the face under doesnt get that much "weight" in the normals. I opened it in blender and the averaged normals looked almost flat with the face.
- to get out of "light mode" either clicking space or a number gets you out of the mode.
- to toggle shadows for every shader click "Q" (uppercase, i did not use 'h' since it clashes with a rotation)
- on my laptop i noticed some lag when using phong and shadows, it doesnt perform great, i bind the VAOs every frame
##### Resources i used for the shadows part
https://webgl2fundamentals.org/webgl/lessons/webgl-shadows.html to see how the code would look like for webgl2 (i wasted tons of time to realise that you cant use gl.LINEAR with the depth texture in webgl2)
https://learnwebgl.brown37.net/11_advanced_rendering/shadows.html for the general approach