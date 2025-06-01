precision mediump float;

uniform vec3 u_diffuseComponent;
uniform vec3 u_ambientComponent;
uniform vec3 u_specularComponent;

uniform vec3 u_lightPos;
uniform mat4 u_shadowMapTransform;
uniform sampler2D u_sampler;

varying vec3 v_vertexPos;
varying vec3 v_vertexNormal;
varying vec4 v_vertexColor;
varying vec4 v_vertexPosLight;

void main() {

    vec3 ambient = v_vertexColor.rgb*u_ambientComponent;

    vec3 vertexNormal = normalize( v_vertexNormal );
    vec3 vertexToLight = normalize(u_lightPos);
    vec3 vertexToEye = normalize(-1.0*v_vertexPos); //view space so camera always at 0

    float diffuseAngle = dot(vertexNormal, vertexToLight);
    diffuseAngle = clamp(diffuseAngle, 0.0, 1.0);

    vec3 reflector = normalize(reflect(vertexToLight, vertexNormal)); //-1 so the vec is incident
    float specularAngle = dot(reflector, vertexToEye);
    specularAngle = clamp(specularAngle, 0.0, 1.0);

    vec3 diffuse = v_vertexColor.rgb*u_diffuseComponent * diffuseAngle;
    vec3 specular = vec3(1.0, 1.0, 1.0) * pow(specularAngle, 20.0) * u_specularComponent; //specular intensity is 0.8 and light color is white

    gl_FragColor  = vec4(diffuse + ambient + specular, 1.0);
}