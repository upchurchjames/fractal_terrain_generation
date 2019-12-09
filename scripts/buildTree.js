let positionStack = [];
let currentPosition;

let cylinderRadiusTopTrunk = .02;
let cylinderRadiusBottomTrunk = .2;
let cylinderRadiusTopBranch = .05;
let cylinderRadiusBottomBranch = .06;

let branchHeight = 1.5;
let trunkHeight = 10.0;
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

function createBranch(direction)
{
	let branchGeometry;
	var temp = angle;
	angle = angle + Math.random() * 1;

	if(direction == 1)
		branchGeometry = new THREE.CylinderGeometry(cylinderRadiusTopTrunk * 2.0, cylinderRadiusBottomTrunk * 2.0, trunkHeight, radialSegments);
	else
		branchGeometry = new THREE.CylinderGeometry(cylinderRadiusTopBranch, cylinderRadiusBottomBranch, branchHeight, radialSegments);

	let branchMaterial = new THREE.MeshBasicMaterial( { map: bark_texture });
    let branch = new THREE.Mesh(branchGeometry, branchMaterial);

	branch.position.set(currentPosition.x, currentPosition.y, currentPosition.z);
    switch(direction)
    {
    	case 1:
    		branch.material.color.setHex(0xff0000); // Red

    		var x = branch.position.x;
    		var y = branch.position.y + (branchHeight / 2.0);
    		var z = branch.position.z;

    		branch.position.set(x, y, z);
    		currentPosition = new THREE.Vector3(x, y + branchHeight / 2.0, z);
    	break;
    	case 2:
    		branch.material.color.setHex(0x0022ff); // Blue

				branch = branch.rotateX(angle);

    		var x = branch.position.x;
    		var y = branch.position.y + ((branchHeight / 2.0) * Math.cos(angle));
    		var z = branch.position.z + ((branchHeight / 2.0) * Math.sin(angle));

    		branch.position.set(x, y, z);
    		currentPosition = new THREE.Vector3(x, y, z);
    	break;
    	case 3:
    		branch.material.color.setHex(0xfff200); // Yellow

				branch = branch.rotateX(-angle);

    		var x = branch.position.x;
    		var y = branch.position.y + ((branchHeight / 2.0) * Math.cos(angle));
    		var z = branch.position.z - ((branchHeight / 2.0) * Math.sin(angle));

				branch.position.set(x, y, z);
    		currentPosition = new THREE.Vector3(x, y, z);
    	break;
    	case 4:
    		branch.material.color.setHex(0xb85fb8); // Purple

				branch = branch.rotateZ(-angle);
				branch = branch.rotateY((Math.PI / 2.0));

    		var x = branch.position.x + ((branchHeight / 2.0) * Math.sin(angle));
    		var y = branch.position.y + ((branchHeight / 2.0) * Math.cos(angle));
    		var z = branch.position.z;

				branch.position.set(x, y, z);
    		currentPosition = new THREE.Vector3(x, y, z);
    	break;
    	case 5:
    		branch.material.color.setHex(0x784c17); // Brown

				branch = branch.rotateZ(angle);
				branch = branch.rotateY((Math.PI / 2.0));

    		var x = branch.position.x - ((branchHeight / 2.0) * Math.sin(angle));
    		var y = branch.position.y + ((branchHeight / 2.0) * Math.cos(angle));
    		var z = branch.position.z;

    		branch.position.set(x, y, z);
    		currentPosition = new THREE.Vector3(x, y, z);
    	default:
    		branch = branch;
    }

    branches.push(branch);
		angle = temp;
}

function getBranches()
{
	return branches;
}
