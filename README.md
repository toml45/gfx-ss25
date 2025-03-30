# Lab 1a

## Claim
- T1 implemented
- T2 implemented
- T3 implemented
    - a) implemented
    - b) implemented
    - c) implemented
    - d) implemented
- T4 implemented (partially)
    - NOTE: the OBJ parser is fit for only the sampleModels shown. There are multiple other keywords from the obj parser that I did not implement (most obvious example vt, but we have no textures yet, so I left it unimplemented). I don't know to what extent we're supposed to implement the OBJ Parser, therefore I marked it as partially implemenented.

## Tested environments
Browsers tested on:
- Chrome `Version 134.0.6998.178 (Official Build) (64-bit)`
- Firefox `136.0.4 (64-bit)`
Developed and Tested on a Windows 10 22H2 with WSL2


## Additional and general remarks
The tsconfig i compiled the code with is included
All I did to run the code was:
`$tsc`
`$python3 -m http.server`
#### Notes
- I scaled the bunny by default by 8, as it is a tiny model. Because of how I implemented the LCS lines, it also scales them too.
- OBJParser is left as a class, in case I need to extend/add to it.
