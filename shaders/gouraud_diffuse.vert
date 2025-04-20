precision mediump float;

attribute vec3 a_coords;
attribute vec3 a_color;
attribute vec3 a_normal;

uniform mat4 u_modelView;
uniform mat4 u_projection;
uniform mat4 u_view;
uniform vec3 u_lightPos;

varying vec4 v_vertexColor;
varying vec3 v_vertexPos;
varying vec3 v_vertexNormal;

void main() {
    v_vertexColor = vec4(a_color, 1.0);
    v_vertexNormal = vec3(u_view * u_modelView * vec4(a_normal, 0.0));
    gl_Position = u_projection * u_view  * u_modelView * vec4(a_coords, 1.0);
}