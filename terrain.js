"use strict";
let scene, camera, renderer, cameraControls;
let object, objectRotation;
let keyLight, fillLight, backLight;
let terrain;

let width = 50;
let length = 50;
let segmentLength = 64;

let WIDTH  = window.innerWidth;
let HEIGHT = window.innerHeight;


function init() {
  scene = new THREE.Scene();
  initRenderer();
  initScene();
  eventHandlers();
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0x888888, 1);
  document.body.appendChild(renderer.domElement);
}

function initScene() {

  initCamera();
  let textureLoader = new THREE.TextureLoader();
  let rock_texture = textureLoader.load('./textures/rock.jpg');
  let grass_texture = textureLoader.load('./textures/grass.jpg');
  let sky_background = textureLoader.load('./textures/sky.jpg', (texture) => {scene.background = texture;});
  let geometry = new THREE.PlaneGeometry(width, length, segmentLength, segmentLength);
  let index = 0;
  let heightMap = TerrainGeneration(segmentLength, 15)

  let up = new THREE.Vector3(0,1,0);
  let uniforms = {
    upDirection: {
      value: up
    },
    rock: {
      type: "t",
      value: new THREE.TextureLoader().load("./textures/rock.jpg", function(texture){render();})
    },
    grass: {
      type: "t",
      value: new THREE.TextureLoader().load("./textures/grass.jpg", function(texture){render();})
    }
  };

  for(var i = 0; i <= segmentLength; i++)
  {
    for(var j = 0; j <= segmentLength; j++)
    {
      geometry.vertices[index].z = heightMap[i][j];
      index++;
    }
  }

  let material = new THREE.MeshBasicMaterial( { map: grass_texture } );

  let material2 = new THREE.RawShaderMaterial({
    fragmentShader: document.getElementById('fragShader').textContent,
    vertexShader:   document.getElementById('vertexShader').textContent,
    uniforms: uniforms
  });

  let plane = new THREE.Mesh(geometry, material);
  scene.fog = new THREE.FogExp2(0xffffff, .02);


  scene.add(plane);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 1, 100000);
  camera.position.set(0, 5, 5);
  camera.lookAt(scene.position);
  cameraControls = new THREE.OrbitControls (
    camera, renderer.domElement
  );
  cameraControls.addEventListener("change",
    function(){
      camera.updateProjectionMatrix();
      render();
    }
  );
}

function render() {
  renderer.render(scene, camera);
}

function eventHandlers() {
  handleWindowResize();
  handleCameraChange();
}

function handleWindowResize(){
  window.addEventListener (
    "resize",
    function () {
      WIDTH = window.innerWidth ;
      HEIGHT = window.innerHeight;
      renderer.setSize(WIDTH,HEIGHT);
      camera.aspect = WIDTH/HEIGHT;
      camera.updateProjectionMatrix();
      render();
    }
  );
}

function handleCameraChange() {
  cameraControls.addEventListener("change",
    function() {
      camera.updateProjectionMatrix();
      render();
    }
  );
}

function TerrainGeneration(segments, smoothingFactor) {
	let terrain = new Array();

	// internal functions
	_init = function() {
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

init();
render();
