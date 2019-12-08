let positionStack = [];
let currentPosition;
let cylinderRadiusTop = .5;
let cylinderRadiusBottom = .5;
let cylinderHeight = 5;
let radialSegments = 32;
let rules = { 
				"F":"F[-F][+F][/F][*F]"
			}
let branches = [];

function setOriginalLocation(location)
{
	currentPosition = location;
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
			default:
				currentPosition = currentPosition;
		}

		newAxiom = newAxiom + ((rules[axiom[i]] == null) ? axiom[i] : rules[axiom[i]]);
				
	}

	generateLSystem(newAxiom, generation - 1);
}

function createBranch(direction)
{
	let branchGeometry = new THREE.CylinderGeometry(cylinderRadiusTop, cylinderRadiusBottom, cylinderHeight, radialSegments);
	let branchMaterial = new THREE.MeshBasicMaterial({color: 0x32a952});
    let branch = new THREE.Mesh(branchGeometry, branchMaterial);

	branch.position.set(currentPosition.x, currentPosition.y, currentPosition.z);
    switch(direction)
    {
    	case 1:
    		branch.material.color.setHex(0xff0000); // Red
    		//branch = branch.rotateY(Math.PI / 2);
    		branch.position.set(branch.position.x, branch.position.y + (cylinderHeight / 4), branch.position.z);
    		currentPosition = new THREE.Vector3(branch.position.x, branch.position.y + (cylinderHeight / 4), branch.position.z);
    	break;
    	case 2:
    		branch.material.color.setHex(0x0022ff); // Blue
    		branch = branch.rotateX((Math.PI / 3));
    		branch.position.set(branch.position.x, branch.position.y + (cylinderHeight / 2), branch.position.z + (cylinderHeight / 2));
    		currentPosition = new THREE.Vector3(branch.position.x, branch.position.y + (cylinderHeight / 2), branch.position.z + (cylinderHeight / 2));
    	break;
    	case 3:
    		branch.material.color.setHex(0xfff200); // Yellow
    		branch = branch.rotateX(-(Math.PI / 3));
    		branch.position.set(branch.position.x, branch.position.y + (cylinderHeight / 2), branch.position.z - (cylinderHeight / 2));
    		currentPosition = new THREE.Vector3(branch.position.x, branch.position.y + (cylinderHeight / 2), branch.position.z - (cylinderHeight / 2));
    	break;
    	case 4:
    		branch.material.color.setHex(0xb85fb8); // Purple
    		branch = branch.rotateZ(-(Math.PI / 3));
    		branch = branch.rotateY((Math.PI / 2));
    		branch.position.set(branch.position.x + (cylinderHeight / 2), branch.position.y + (cylinderHeight / 2), branch.position.z);
    		currentPosition = new THREE.Vector3(branch.position.x + (cylinderHeight / 2), branch.position.y + (cylinderHeight / 2), branch.position.z);
    	break;
    	case 5:
    		branch.material.color.setHex(0x784c17); // Brown
    		branch = branch.rotateZ((Math.PI / 3));
    		branch = branch.rotateY((Math.PI / 2));
    		branch.position.set(branch.position.x - (cylinderHeight / 2), branch.position.y + (cylinderHeight / 2), branch.position.z);
    		currentPosition = new THREE.Vector3(branch.position.x - (cylinderHeight / 2), branch.position.y + (cylinderHeight / 2), branch.position.z);
    	default:
    		branch = branch;
    }

    branches.push(branch);
}

function getBranches()
{
	return branches;
}