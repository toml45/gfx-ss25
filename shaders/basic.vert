precision mediump float;

attribute vec3 a_coords;
attribute vec3 a_color;
attribute vec3 a_normal;

uniform mat4 u_modelView;
uniform mat4 u_projection;
uniform mat4 u_view;

varying vec4 v_vertexColor;

void main() {
    // i take the normal for 0 reason here because i also pass normals when i pass shapes
    // compiler optimizes a_normal if its not used
    vec3 test = normalize(a_normal);
    v_vertexColor = vec4(a_color + test*0.0, 1.0);
    gl_Position = u_projection * u_view  * u_modelView * vec4(a_coords, 1.0);
}