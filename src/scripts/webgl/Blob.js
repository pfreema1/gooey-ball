// https://steemit.com/utopian-io/@clayjohn/learning-3d-graphics-with-three-js-or-dynamic-geometry

import * as THREE from 'three';
import noise from '../utils/perlin.js';
import customNormalVert from '../../shaders/customNormal.vert';
import customNormalFrag from '../../shaders/customNormal.frag';
import TweenMax from 'TweenMax';

const map = THREE.Math.mapLinear;

export default class Blob {
  constructor(pane, params) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      20
    );
    this.camera.position.z = 4.5;

    this.geo = new THREE.SphereGeometry(1, 128, 128);
    // this.material = new THREE.MeshNormalMaterial();
    this.material = new THREE.ShaderMaterial({
      fragmentShader: customNormalFrag,
      vertexShader: customNormalVert,
      uniforms: {
        scale: {
          value: 0.36
        },
        power: {
          value: 2.39
        }
      }
    });

    this.sphere = new THREE.Mesh(this.geo, this.material);

    this.scene.add(this.sphere);

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.renderTarget = new THREE.WebGLRenderTarget(this.width, this.height);

    this.k = 1; // number of spikeys
    this.atten = 0.3; // strength of spikeys

    // this.setupPane(pane, params);

    this.goalPos = {
      x: null,
      y: null
    };

    this.setupMouseListener();
  }

  setupMouseListener() {
    this.mouse = {
      x: null,
      y: null
    };
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  onMouseMove({ clientX, clientY }) {
    this.mouse.x = (clientX / this.width) * 2 - 1;
    this.mouse.y = -(clientY / this.height) * 2 + 1;

    this.k = map(this.mouse.x, -1, 1, -4, 4);
    this.atten = map(this.mouse.x, -1, 1, -1, 1);

    this.goalPos.x = map(this.mouse.x, -1, 1, -0.2, 0.2);
    this.goalPos.y = map(this.mouse.y, -1, 1, -0.2, 0.2);
  }

  setupPane(pane, params) {
    this.pane = pane;
    this.PARAMS = params;

    this.pane
      .addInput(this.PARAMS, 'blobScale', {
        min: 0.0,
        max: 3.0
      })
      .on('change', value => {
        this.material.uniforms.scale.value = value;
      });

    this.pane
      .addInput(this.PARAMS, 'blobPower', {
        min: 0.0,
        max: 10.0
      })
      .on('change', value => {
        this.material.uniforms.power.value = value;
      });
  }

  moveSphereToGoalPos() {
    // let moveSpeed = 0.002;

    // if (this.sphere.position.x < this.goalPos.x - moveSpeed) {
    //   this.sphere.position.x += moveSpeed;
    // } else if (this.sphere.position.x > this.goalPos.x) {
    //   this.sphere.position.x -= moveSpeed;
    // }

    TweenMax.to(this.sphere.position, 5.5, {
      x: this.goalPos.x,
      y: this.goalPos.y
      //   ease: Circ.easeInOut
    });
  }

  update() {
    let time = performance.now() * 0.001;
    this.moveSphereToGoalPos();

    // go through vertices and reposition them
    for (let i = 0; i < this.sphere.geometry.vertices.length; i++) {
      let p = this.sphere.geometry.vertices[i];
      p.normalize().multiplyScalar(
        1 +
          this.atten *
            noise.perlin3(p.x * this.k, p.y * this.k, p.z * this.k + time)
      );
    }

    this.sphere.geometry.computeVertexNormals();
    this.sphere.geometry.normalsNeedUpdate = true;
    this.sphere.geometry.verticesNeedUpdate = true;
  }
}
