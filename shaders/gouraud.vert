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

uniform vec3 u_diffuseComponent;
uniform vec3 u_ambientComponent;
uniform vec3 u_specularComponent;

varying vec4 v_vertexColor;

void main() {
    vec3 vertexPos = vec3(u_view  * u_modelView * vec4(a_coords, 1.0));
    vec3 vertexNormal = mat3(u_view) * u_modelViewInverseTranspose * a_normal;
    
    vec3 ambient = a_color.rgb*u_ambientComponent;

    vertexNormal = normalize( vertexNormal );
    vec3 vertexToLight = normalize(u_lightPos);
    vec3 vertexToEye = normalize(-1.0*vertexPos); //view space so camera always at 0

    float diffuseAngle = dot(vertexNormal, vertexToLight);
    diffuseAngle = clamp(diffuseAngle, 0.0, 1.0);

    vec3 reflector = normalize(reflect(vertexToLight, vertexNormal)); //-1 so the vec is incident
    float specularAngle = dot(reflector, vertexToEye);
    specularAngle = clamp(specularAngle, 0.0, 1.0);
    
    vec3 diffuse = a_color.rgb*u_diffuseComponent * diffuseAngle;
    vec3 specular = vec3(1.0, 1.0, 1.0) * pow(specularAngle, 20.0) * u_specularComponent; //specular intensity

    v_vertexColor = vec4(diffuse + ambient + specular, 1.0);

    gl_Position = u_projection * u_view  * u_modelView * vec4(a_coords, 1.0);
}