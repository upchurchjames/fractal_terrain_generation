let positionStack = [];
let currentPosition;
let cylinderRadiusTop = .5;
let cylinderRadiusBottom = .5;
let cylinderHeight = 5.0;
let radialSegments = 32.0;
let rules = { 
				"F":"[-[-][+][/][*]][+[-][+][/][*]][/[-][+][/][*]][*[-][+][/][*]]",
				"-":"-[-][+][/][*]",
				"+":"+[-][+][/][*]",
				"/":"/[-][+][/][*]",
				"*":"*[-][+][/][*]"
			}
let branches = [];
let textureLoader;
let barkTexture;
let angle = Math.PI / 3;

function initTree(location)
{
	currentPosition = location;
	textureLoader = new THREE.TextureLoader();
    bark_texture = textureLoader.load('./textures/bark.jpg');
}

function generateLSystem(axiom, generation)
{
	if(generation <= 0)
	{
		return;
	}

	var newAxiom = "";
	var i;
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
			case "/":
				createBranch(4);
			break;
			case "*":
				createBranch(5);
			break;
			case "[":
				positionStack.push(currentPosition);
			break;
			case "]":
				currentPosition = positionStack.pop();
				break;
			default:
				currentPosition = currentPosition;
		}

		newAxiom = newAxiom + ((rules[axiom[i]] == null) ? axiom[i] : rules[axiom[i]]);
				
	}

	generateLSystem(newAxiom, generation - 1);
}
// "F[-F][+F][/F][*F]"
// "[-F[-F][+F][/F][*F]]"
// "[+F[-F][+F][/F][*F]]"
// "[/F[-F][+F][/F][*F]]"
// "[*F[-F][+F][/F][*F]]"
function createBranch(direction)
{
	let branchGeometry;

	// if(direction == 1)
	// 	branchGeometry = new THREE.CylinderGeometry(cylinderRadiusTop * 2.0, cylinderRadiusBottom * 2.0, cylinderHeight, radialSegments);
	// else
		branchGeometry = new THREE.CylinderGeometry(cylinderRadiusTop, cylinderRadiusBottom, cylinderHeight, radialSegments);

	let branchMaterial = new THREE.MeshBasicMaterial( { map: bark_texture });
    let branch = new THREE.Mesh(branchGeometry, branchMaterial);

	branch.position.set(currentPosition.x, currentPosition.y, currentPosition.z);
    switch(direction)
    {
    	case 1:
    		branch.material.color.setHex(0xff0000); // Red
    		branch.position.set(branch.position.x, branch.position.y + (cylinderHeight / 2.0), branch.position.z);
    		currentPosition = new THREE.Vector3(branch.position.x, branch.position.y + (cylinderHeight / 2.0), branch.position.z);
    	break;
    	case 2:
    		branch.material.color.setHex(0x0022ff); // Blue
    		branch = branch.rotateX(angle);
    		branch.position.set(branch.position.x, branch.position.y + (cylinderHeight / 2.0), branch.position.z + ((cylinderHeight / 2.0) * Math.tan((Math.PI / 2) - angle)));
    		currentPosition = new THREE.Vector3(branch.position.x, branch.position.y + (cylinderHeight / 2.0), branch.position.z + ((cylinderHeight / 2.0) * Math.tan((Math.PI / 2) - angle)));
    	break;
    	case 3:
    		branch.material.color.setHex(0xfff200); // Yellow
    		branch = branch.rotateX(-(Math.PI / 3.0));
    		branch.position.set(branch.position.x, branch.position.y + (cylinderHeight / 2.0), branch.position.z - ((cylinderHeight / 2.0) * Math.tan((Math.PI / 2) - angle)));
    		currentPosition = new THREE.Vector3(branch.position.x, branch.position.y + (cylinderHeight / 2.0), branch.position.z - ((cylinderHeight / 2.0) * Math.tan((Math.PI / 2) - angle)));
    	break;
    	case 4:
    		branch.material.color.setHex(0xb85fb8); // Purple
    		branch = branch.rotateZ(-(Math.PI / 3.0));
    		branch = branch.rotateY((Math.PI / 2.0));
    		branch.position.set(branch.position.x + ((cylinderHeight / 2.0) * Math.tan((Math.PI / 2) - angle)), branch.position.y + (cylinderHeight / 2.0), branch.position.z);
    		currentPosition = new THREE.Vector3(branch.position.x + ((cylinderHeight / 2.0) * Math.tan((Math.PI / 2) - angle)), branch.position.y + (cylinderHeight / 2.0), branch.position.z);
    	break;
    	case 5:
    		branch.material.color.setHex(0x784c17); // Brown
    		branch = branch.rotateZ((Math.PI / 3.0));
    		branch = branch.rotateY((Math.PI / 2.0));
    		branch.position.set(branch.position.x - ((cylinderHeight / 2.0) * Math.tan((Math.PI / 2) - angle)), branch.position.y + (cylinderHeight / 2.0), branch.position.z);
    		currentPosition = new THREE.Vector3(branch.position.x - ((cylinderHeight / 2.0) * Math.tan((Math.PI / 2) - angle)), branch.position.y + (cylinderHeight / 2.0), branch.position.z);
    	default:
    		branch = branch;
    }

    branches.push(branch);
}

function getBranches()
{
	return branches;
}