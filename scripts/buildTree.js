let positionStack = [];
let rotationStack = [];
let translationStack = [];
let currentPosition;

let branchRadiusTop = .065;
let branchRadiusBottom = .07;

let branchHeight = .22;
let trunkHeight = .22;
let radialSegments = 32.0;
let rules = {
				"F":"F[-F][+F]"
				// "F":"[-[-][+][/][*]][+[-][+][/][*]][/[-][+][/][*]][*[-][+][/][*]]",
				// "-":"-[-][+][/][*]",
				// "+":"+[-][+][/][*]",
				// "/":"/[-][+][/][*]",
				// "*":"*[-][+][/][*]"
			}
let branches = [];
let textureLoader;
let barkTexture;
let angle = Math.PI/7;
let rotation = new THREE.Euler(0, 0, 0, 'XYZ');
let translation = new THREE.Vector3(0, (branchHeight / 2.0), 0);

function initTree(location)
{
	currentPosition = location;
	textureLoader = new THREE.TextureLoader();
    bark_texture = textureLoader.load('./textures/bark.jpg');
}

function generateLSystem(axiom, generation)
{
	var newAxiom = "";
	var i;
	// F[-F][+F][-F[-F][+F]][+F[-F][+F]]
	if(generation <= 0)
	{
		for(i = 0; i < axiom.length; i++)
		{
			switch(axiom[i])
			{
				case "F":
					createBranch(1);
					break;
				case "-":
					createBranch(2);
					break;
				case "+":
					createBranch(3);
					break;
				case "[":
					positionStack.push((new THREE.Vector3(0,0,0)).copy(currentPosition));
					rotationStack.push((new THREE.Euler(0, 0, 0, 'XYZ')).copy(rotation));
					translationStack.push((new THREE.Vector3(0,0,0)).copy(translation));
					break;
				case "]":
					currentPosition = positionStack.pop();
					rotation = rotationStack.pop();
					translation = translationStack.pop();
					break;
				default:
					currentPosition = currentPosition;
			}
		}

		return;
	}

	for(i = 0; i < axiom.length; i++)
	{
		newAxiom = newAxiom + ((rules[axiom[i]] == null) ? axiom[i] : rules[axiom[i]]);
	}

	generateLSystem(newAxiom, generation - 1);
}

function createBranch(direction)
{
	let branchGeometry;

	if (positionStack.length <= 1)
	{
		branchGeometry = new THREE.CylinderGeometry(branchRadiusTop,
																								branchRadiusBottom,
																								branchHeight,
																								radialSegments);
	}
	else if (positionStack.length <= 2)
	{
		branchGeometry = new THREE.CylinderGeometry(branchRadiusTop - .02,
																								branchRadiusBottom,
																								branchHeight,
																								radialSegments);
	}
	else if (positionStack.length <= 3)
	{
		branchGeometry = new THREE.CylinderGeometry(branchRadiusTop - Math.random()*.02,
																								branchRadiusBottom - Math.random()*.019,
																								branchHeight,
																								radialSegments);
	}
	else
	{
		branchGeometry = new THREE.CylinderGeometry(branchRadiusTop - Math.random()*.04,
																								branchRadiusBottom - Math.random()*.039,
																								branchHeight,
																								radialSegments);
	}
	let branchMaterial = new THREE.MeshBasicMaterial( { map: bark_texture });

  let branch = new THREE.Mesh(branchGeometry, branchMaterial);

	branch.position.set(currentPosition.x, currentPosition.y, currentPosition.z);
    switch(direction)
    {
    	case 1:
    		//branch.material.color.setHex(0xff0000); // Red

    		var x = branch.position.x + translation.x;
    		var y = branch.position.y + translation.y;
    		var z = branch.position.z + translation.z;

    		branch.position.set(x, y, z);
    		currentPosition = new THREE.Vector3(x + translation.x, y + translation.y, z + translation.z);
    		let matrix = branch.matrix;
    		branch.rotation.set(rotation.x, rotation.y, rotation.z, rotation.order);
    	break;
    	case 2:
    		//branch.material.color.setHex(0x0022ff); // Blue

    		rotation.x += angle;
    		rotation.order = "XYZ";
			branch.rotation.set(rotation.x, rotation.y, rotation.z, rotation.order);

    		var x = branch.position.x;
    		var y = branch.position.y + ((branchHeight / 2.0) * Math.cos(rotation.x));
    		var z = branch.position.z + ((branchHeight / 2.0) * Math.sin(rotation.x));

    		translation.y = ((branchHeight / 2.0) * Math.cos(rotation.x));
    		translation.z = ((branchHeight / 2.0) * Math.sin(rotation.x));

    		branch.position.set(x, y, z);
    		currentPosition = new THREE.Vector3(x, y + translation.y, z + translation.z);
    	break;
    	case 3:
    		//branch.material.color.setHex(0xfff200); // Yellow

    		rotation.x += (-angle);
    		rotation.order = "XYZ";
			branch.rotation.set(rotation.x, rotation.y, rotation.z, rotation.order);

    		var x = branch.position.x;
    		var y = branch.position.y + ((branchHeight / 2.0) * Math.cos(rotation.x));
    		var z = branch.position.z + ((branchHeight / 2.0) * Math.sin(rotation.x));

    		translation.y = ((branchHeight / 2.0) * Math.cos(rotation.x));
    		translation.z = ((branchHeight / 2.0) * Math.sin(rotation.x));

				branch.position.set(x, y, z);
    		currentPosition = new THREE.Vector3(x, y + translation.y, z + translation.z);
    	break;
    	default:
    		branch = branch;
    }
		branches.push(branch);
}

function getBranches()
{
	return branches;
}
