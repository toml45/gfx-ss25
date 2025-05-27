precision mediump float;

attribute vec3 a_coords;
attribute vec3 a_color;
attribute vec3 a_normal;

uniform mat4 u_modelView;
uniform mat4 u_projection;
uniform mat4 u_view;
uniform vec3 u_lightPos;
uniform mat3 u_modelViewInverseTranspose;
uniform mat4 u_shadowMapTransform;
uniform sampler2D u_sampler;

varying vec4 v_vertexColor;

void main() {
    vec4 vertexPosLight = u_shadowMapTransform * u_modelView * vec4(a_coords, 1.0);
    vec3 vertexPos = vec3(u_view  * u_modelView * vec4(a_coords, 1.0));
    vec3 vertexNormal = mat3(u_view) * u_modelViewInverseTranspose * a_normal;
    
    vec3 ambient = a_color.rgb*vec3(0.2, 0.2, 0.2);

    vertexNormal = normalize( vertexNormal );
    vec3 vertexToLight = normalize(u_lightPos);

    float diffuseAngle = dot(vertexNormal, vertexToLight);
    diffuseAngle = clamp(diffuseAngle, 0.0, 1.0);

    vec3 diffuse = a_color.rgb*vec3(0.7, 0.7, 0.7) * diffuseAngle;

    v_vertexColor = vec4(diffuse + ambient, 1.0);

    gl_Position = u_projection * u_view  * u_modelView * vec4(a_coords, 1.0);
}