# Lab 1b

## Claim
- T1 implemented
- T2 implemented
- T3 implemented
- T4 implemented 
- T5 partially-implemented: mouse scrollwheel movement is missing
- T6 implemented
- B1 implemented

## Tested environments
Browsers tested on:
- Chrome `Version 136.0.7103.114`
Developed and Tested on a Windows 10 22H2 with WSL2


## Additional and general remarks
The tsconfig i compiled the code with is included
All I did to run the code was:
`$tsc`
`$python3 -m http.server`
#### Notes
- i am not sure if the collision detection works perfectly, i did not test it thoroughly
- the code is extremely inefficient
- rotations that would lead to out of bounds cubes are ignored
