// https://steemit.com/utopian-io/@clayjohn/learning-3d-graphics-with-three-js-or-dynamic-geometry

import * as THREE from 'three';
import noise from '../utils/perlin.js';
import customNormalVert from '../../shaders/customNormal.vert';
import customNormalFrag from '../../shaders/customNormal.frag';

export default class Blob {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      20
    );
    this.camera.position.z = 5;

    this.geo = new THREE.SphereGeometry(1, 128, 128);
    // this.material = new THREE.MeshNormalMaterial();
    this.material = new THREE.ShaderMaterial({
      fragmentShader: customNormalFrag,
      vertexShader: customNormalVert
    });

    this.sphere = new THREE.Mesh(this.geo, this.material);

    this.scene.add(this.sphere);

    this.renderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight
    );
  }

  update() {
    let time = performance.now() * 0.001;

    // go through vertices and reposition them
    let k = 1;
    for (let i = 0; i < this.sphere.geometry.vertices.length; i++) {
      let p = this.sphere.geometry.vertices[i];
      p.normalize().multiplyScalar(
        1 + 0.3 * noise.perlin3(p.x * k, p.y * k, p.z * k + time)
      );
    }

    this.sphere.geometry.computeVertexNormals();
    this.sphere.geometry.normalsNeedUpdate = true;
    this.sphere.geometry.verticesNeedUpdate = true;
  }
}
