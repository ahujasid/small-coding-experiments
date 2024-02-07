import React, { useRef, useEffect } from 'react';
   
import * as THREE from 'three';
import { WebGLRenderer, CircleGeometry, MeshBasicMaterial } from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { Figure } from "./Figure";

import { BloomEffect, EffectComposer, EffectPass, RenderPass, GodRaysEffect } from "postprocessing";
import { LightSource } from "./LightSource";





import { isMobile, isTablet, isBrowser } from 'react-device-detect';

export default function Art() {
	const mount = useRef(null);

	useEffect(() => {
	
		let paused = false;



		let scene = new THREE.Scene();
		let camera = new THREE.PerspectiveCamera(
		  60,
		  mount.current.clientWidth / mount.current.clientHeight,
		  1,
		  1000
		);
		camera.position.set(5, 0, 20);
		let renderer = new THREE.WebGLRenderer({
		  powerPreference: "high-performance",
		  antialias: false,
		  stencil: false,
		  depth: false
		});
		renderer.setSize(mount.current.clientWidth, mount.current.clientHeight);
		document.body.appendChild(renderer.domElement);
		window.addEventListener("resize", onResize, false);
		
		// new OrbitControls(camera, renderer.domElement);
		
		let light = new LightSource();
		light.position.set(2, 0, -10);
		scene.add(light);
		
		let figure = new Figure();
		scene.add(figure);
		
		let composer = new EffectComposer(renderer);
		composer.addPass(new RenderPass(scene, camera));
		let gre = new GodRaysEffect(camera, light, {
		  height: 480,
		  kernelSize: 2,
		  density: 1,
		  decay: 0.9,
		  weight: 0.5,
		  exposure: 0.3,
		  samples: 20,
		  clampMax: 0.95
		});
		composer.addPass(new EffectPass(camera, gre));
		
		let clock = new THREE.Clock();


		animate();	
	

		// ================= ANIMATE =================

		function animate() {
	

				requestAnimationFrame(animate);
		
		

			render();
		}

		// ================= RENDER =================

		function render() {
			// renderer.render(scene, camera);
			let t = clock.getElapsedTime();
			light.userData.time.value = t;
			light.position.x = Math.cos(t) * 4;
			light.position.y = Math.sin(t * 0.6) * 4;

		
			composer.render();
		}

		// render();

	

		// ================= EVENT HANDLING =================

		// function onMouseMove(event) {
		// 	mouse.x = event.clientX - windowHalf.x;
		// 	mouse.y = event.clientY - windowHalf.y;
		// }

		function onResize(event) {
			var newWidth = mount.current.clientWidth;
			var newHeight = mount.current.clientHeight;
			// var newWidth = window.innerWidth;
			// var newHeight = window.innerHeight;

			camera.aspect = newWidth / newHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(newWidth, newHeight);
		}
	},[])





	// === THREE.JS CODE END ===

	return <div ref={mount} style={{ width: `100vw`, height: `100vh` }} />;
}
