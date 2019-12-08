let terrain;
let width = 256;
let length = 256;
let segmentLength = 512;

//
// function vertexShader() {
//   return `
//     precision highp float;
//
//     attribute mat4 projectionMatrix;
//     attribute mat4 modelViewMatrix;
//     attribute vec3 position;
//     attribute vec3 normal;
//     attribute vec2 uv;
//
//     varying vec2 vUV;
//
//     void main() {
//       vUV = uv;
//       vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
//
//       gl_Position = projectionMatrix * modelViewPosition;
//     }
//   `;
// }
//
// function fragmentShader() {
//   return `
//     precision highp float;
//
//     uniform sampler2D rock;
//     uniform sampler2D grass;
//     uniform sampler2D snow;
//
//     varying vec2 vUV;
//
//     void main() {
//
//       gl_FragColor = vec4(.5, .4, 0, 1.0);
//     }
//   `;
// }

// function initScene() {
//
//   initCamera();
//   let textureLoader = new THREE.TextureLoader();
//   let rock_texture = textureLoader.load('./textures/rock2.jpg');
//   let grass_texture = textureLoader.load('./textures/grass.jpg');
//   let snow_texture = textureLoader.load('./textures/snow.jpg');
//   let trump_texture = textureLoader.load('./textures/trump-angry.jpg');
//
//   let geometry = new THREE.PlaneGeometry(width, length, segmentLength, segmentLength);
//   let index = 0;
//   let heightMap = TerrainGeneration(segmentLength, 20)
//
//   // let up = new THREE.Vector3(0,1,0);
//   // let uniforms = {
//   //   upDirection: {
//   //     value: up
//   //   },
//   //   rock: {
//   //     type: "t",
//   //     value: new THREE.TextureLoader().load("./textures/rock.jpg", function(texture){render();})
//   //   },
//   //   grass: {
//   //     type: "t",
//   //     value: new THREE.TextureLoader().load("./textures/grass.jpg", function(texture){render();})
//   //   },
//   //   snow: {
//   //     type: "t",
//   //     value: new THREE.TextureLoader().load("./textures/snow.jpg", function(texture){render();})
//   //   }
//   // };
//
//   for(var i = 0; i <= segmentLength; i++)
//   {
//     for(var j = 0; j <= segmentLength; j++)
//     {
//       geometry.vertices[index].z = heightMap[i][j];
//       index++;
//     }
//   }
//
//   let material = new THREE.MeshBasicMaterial( { map: trump_texture } );
//
//   // let material2 = new THREE.RawShaderMaterial({
//   //   fragmentShader: fragmentShader(),
//   //   vertexShader:   vertexShader(),
//   //   uniforms: uniforms
//   // });
//
//   let plane = new THREE.Mesh(geometry, material);
//
//   plane.rotation.x = THREE.Math.degToRad(-90);
//   plane.position.set(0, -30, -15);
//
//   scene.add(plane);
// }

function TerrainGeneration(segments, smoothingFactor) {
	let terrain = new Array();

	// internal functions
	var _init = function() {
		terrain = new Array();
		for(var i = 0; i <= segments; i++) {
			terrain[i] = new Array();
			for(var j = 0; j <= segments; j++) {
				terrain[i][j] = 0;
			}
		}
	};

	function diamondSquare() {
		_init();

		var size = segments+1;
		for(var length = segments; length >= 2; length /= 2) {
			var half = length/2;
			smoothingFactor /= 2;

			// generate the new square values
			for(var x = 0; x < segments; x += length) {
				for(var y = 0; y < segments; y += length) {
					var average = terrain[x][y]+ // top left
					terrain[x+length][y]+ // top right
					terrain[x][y+length]+ // lower left
					terrain[x+length][y+length]; // lower right
					average /= 4;
					average += 2*smoothingFactor*Math.random()-smoothingFactor;

					terrain[x+half][y+half] = average;
				}
			}

			// generate the diamond values
			for(var x = 0; x < segments; x += half) {
				for(var y = (x+half)%length; y < segments; y += length) {
					var average = terrain[(x-half+size)%size][y]+ // middle left
							terrain[(x+half)%size][y]+ // middle right
							terrain[x][(y+half)%size]+ // middle top
							terrain[x][(y-half+size)%size]; // middle bottom
					average /= 4;
					average += 2*smoothingFactor*Math.random()-smoothingFactor;

					terrain[x][y] = average;

					// values on the top and right edges
					if(x === 0)
						terrain[segments][y] = average;
					if(y === 0)
						terrain[x][segments] = average;
				}
			}
		}

		return terrain;
	};

  return diamondSquare();
};
