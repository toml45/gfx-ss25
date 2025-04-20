precision mediump float;

uniform vec3 u_lightPos;

varying vec3 v_vertexPos;
varying vec3 v_vertexNormal;
varying vec4 v_vertexColor;

void main() {
    
    vec3 to_light;
    vec3 vertex_normal;
    float cos_angle;

    to_light = u_lightPos - v_vertexPos;
    to_light = normalize( to_light );

    vertex_normal = normalize( v_vertexNormal );

    cos_angle = dot(vertex_normal, to_light);
    cos_angle = clamp(cos_angle, 0.0, 1.0);

    gl_FragColor = vec4(vec3(v_vertexColor) * cos_angle, v_vertexColor.a);

}