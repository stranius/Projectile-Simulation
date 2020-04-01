# Projectile-Simulation
Displaying a simple simulation of projectile motion with objects of different masses.

### Rundown
The project is built using html canvas and javascript. It also lets you select and change a handful of inputs, being what object you are launching, how much force to apply to the object at launch, the angle at which to launch the object, and weather or not to display a grid for reference while launching.

There are two javascript files for the project, one being just for setting up the simulation and controlling the inputs, and the other being for a couple of classes I made, one to run and handle all basic processes of the simulation and one for representing an object in the simulation space *(for example, the ground, slingshot, and projectile)*.

### Specifics
The simulation has a few different forces acting on it, relating to forces in the real world. In this simulation, there are 3 forces that act on the projectile while the simulation is active: gravity, aerodynamic drag, and friction.

Each object that you can select has a different mass and therefore the physics applied to that object on launch alter its projection.
