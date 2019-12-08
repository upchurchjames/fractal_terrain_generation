let positionStack = [];
let currentPosition = new THREE.Vector3(0, 0, 0);
let cylinderRadiusTop = .5;
let cylinderRadiusBottom = .5;
let cylinderHeight = 5;
let radialSegments = 32;
let rules = { 
				"F":"F[-F][+F][/F][*F]"
			}

function generateLSystem(axiom, scene, generation)
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
				createBranch(1, scene);
			break;
			case "-":
				createBranch(2, scene);
			break;
			case "+":
				createBranch(3, scene);
			break;
			case "/":
				createBranch(4, scene);
			break;
			case "*":
				createBranch(5, scene);
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

	generateLSystem(newAxiom, scene, generation - 1);
}

function createBranch(direction, scene)
{
	let branchGeometry = new THREE.CylinderGeometry(cylinderRadiusTop, cylinderRadiusBottom, cylinderHeight, radialSegments);
	let branchMaterial = new THREE.MeshBasicMaterial({color: 0x32a952});
    let branch = new THREE.Mesh(branchGeometry, branchMaterial);

	branch.position.set(currentPosition.x, currentPosition.y, currentPosition.z);
    switch(direction)
    {
    	case 1:
    		branch.material.color.setHex(0xff0000); // Red
    		branch = branch.rotateX(Math.PI / 2);
    		branch.position.set(branch.position.x, branch.position.y, branch.position.z + (cylinderHeight / 4));
    		currentPosition = new THREE.Vector3(branch.position.x, branch.position.y, branch.position.z + (cylinderHeight / 4));
    	break;
    	case 2:
    		branch.material.color.setHex(0x0022ff); // Blue
    		branch = branch.rotateX((Math.PI / 2) + (Math.PI / 3));
    		branch.position.set(branch.position.x, branch.position.y - (cylinderHeight / 2), branch.position.z + (cylinderHeight / 2));
    		currentPosition = new THREE.Vector3(branch.position.x, branch.position.y - (cylinderHeight / 2), branch.position.z + (cylinderHeight / 2));
    	break;
    	case 3:
    		branch.material.color.setHex(0xfff200); // Yellow
    		branch = branch.rotateX((Math.PI / 2) - (Math.PI / 3));
    		branch.position.set(branch.position.x, branch.position.y + (cylinderHeight / 2), branch.position.z + (cylinderHeight / 2));
    		currentPosition = new THREE.Vector3(branch.position.x, branch.position.y + (cylinderHeight / 2), branch.position.z + (cylinderHeight / 2));
    	break;
    	case 4:
    		branch.material.color.setHex(0xb85fb8); // Purple
    		branch = branch.rotateZ((Math.PI / 2));
    		branch = branch.rotateX((Math.PI / 2) + (Math.PI / 3));
    		branch.position.set(branch.position.x + (cylinderHeight / 2), branch.position.y, branch.position.z + (cylinderHeight / 2));
    		currentPosition = new THREE.Vector3(branch.position.x + (cylinderHeight / 2), branch.position.y, branch.position.z + (cylinderHeight / 2));
    	break;
    	case 5:
    		branch.material.color.setHex(0x784c17); // Brown
    		branch = branch.rotateZ((Math.PI / 2));
    		branch = branch.rotateX((Math.PI / 2) - (Math.PI / 3));
    		branch.position.set(branch.position.x - (cylinderHeight / 2), branch.position.y, branch.position.z + (cylinderHeight / 2));
    		currentPosition = new THREE.Vector3(branch.position.x - (cylinderHeight / 2), branch.position.y, branch.position.z + (cylinderHeight / 2));
    	default:
    		branch = branch;
    }

    scene.add(branch);
}