# Fractal Terrain Generation

# Travis Kerr
# James Upchurch

# CAP 4720

* To run:
  * Open fractal_terrain_generation/index.html in a browser with WebGL enabled.
  
* Controls:
  * To move forward: Left-click mouse
  * To move backward: Right-click mouse
  * To turn: point mouse in desired direction
  
# Project Goal
The purpose of this project is to utilize fractal geometry to build algorithms that generate detailed landscapes and plant life, namely trees. The random midpoint displacement algorithm will be used to construct the terrain. The tree and plant generation will be handled using a Lindenmayer system to make them look natural.

# Random Midpoint Displacement Algorithm
This project demonstrates the use of the Random Midpoint Displacement Algorithm, or Diamond-Square Algorithm, to calculate stochastic, or probabilistic, landscapes. Each time the algorithm is run, an entirely different landscape will be generated. 

To begin the algorithm, a two-dimensional square array will be initialized with all zero elements and a length of 2N + 1, where N is an integer. Then, a 'square' step will begin. For a square step to execute, the average value of the four corners of the array will be computed, and a random displacement value will be added to the average. This will become the value, or height of the midpoint of the square. That signifies the end of the square step.

Once a square step terminates, a 'diamond' step begins. To calculate a diamond step, use the four corners of the square from the previous step. From each corner, find the average value of the elements that are halfway between the current corner and the closest visited array elements in each cardinal direction. Then, add a random displacement to that average. This modified average will become the value for the center point of the diamond. This concludes the diamond step.

As the algorithm finishes execution, it will return a two-dimensional array that stores values that will be used to alter the z-position of the vertices of a plane.

# Lindenmayer System
The project will also demonstrate the population of that landscape with fractally generated trees. These trees will be separated by a certain distance so that they do not interfere. They will also reference the height map of the landscape as most trees or plants must be close to the soil to grow.

The Lindenmayer system is used to replace characters of a string with another string. For example, the start string could be "F" and there is a rule for F, "F -> F[-F][+F]". Any "F" in the given string will be replaced by "F[-F][+F]". Each character can be given an instruction to draw a certain structure. "F" could stand for draw a line forward. A certain number of generations can be specified for the number of times the current string is traversed for rules to replace the specified characters. The instructions are not executed until the final generation. After the final string is traversed and all of the instructions are executed, the algorithm finishes.

# Resources
Free images from pexels.com for the texture of the trees, plants, and landscape will be used in this project

# Implementation
Shaders will be used for the texturization and lighting for the landscape, plants, and trees. The random midpoint displacement algorithm will be utilized to create the geometry of the landscape. The Lindenmayer system will be used to create the geometry for the trees and plants. The landscape, trees, and plants will all be generated in real time. There will be cameras giving the user an option to hover over the scene as everything is being generated.

# Custom Shaders
For this project, custom shaders were written to dynamically texture the plane. Using specific ranges, a grass texture was applied to the lowest areas of the generated height map, specifically those vertices with a height lower than 1.5. A rock texture was used for the medium to high values in the height map, between 1.5 and 2.25. A snow texture was used for the highest portions of the height map, with z-components higher than 2.25.

Fog was also incorporated into the project to mask the edge of the generated plane. Because custom shaders were used to texture the landscape, ThreeJS' fog material could not be applied to the landscape. Therefore, the custom shaders include calculations utilizing exponential fog to give the landscape a fog-like appearance to the scene. ThreeJS fog is still used to give the trees a fog-like appearance.
