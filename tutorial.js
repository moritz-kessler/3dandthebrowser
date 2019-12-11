//----- Part03: Setup -----

// Camera ( fov, aspect, near, far )
camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
camera.position.set( 0, 0, 10 );

// Scene - our stage which will display all objects we put into it
scene = new THREE.Scene();
//scene.fog = new THREE.FogExp2( 0xecf0f1, 0.035 );

// Root - our container for all 3D objects
root = new THREE.Object3D();
scene.add( root );

// Create the renderer, set a background color, append it to our HTML
renderer = new THREE.WebGLRenderer( /*{ antialias: true }*/ );
renderer.setClearColor( 0xecf0f1 );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//----------

//----- Part04: Trigger rendering -----

// calling the render function of our renderer object
renderer.render( scene, camera );

//----------

//----- Part05: Load our model -----
var loader = new THREE.GLTFLoader();
var selected3DModel;
loader.load( './meshes/mysteryBox.glb', function ( gltf ) {
	console.log(gltf);

	// set the size of the scene
	gltf.scene.scale.x = gltf.scene.scale.y = gltf.scene.scale.z = 2;
	gltf.scene.traverse( function ( child ) {
		// find the root object of the scene
		if( child.name === "root" ){
			selected3DModel = child;
		}
	} );

	root.add( gltf.scene );
	root.updateMatrix();
} );

//----------

//----- Part06: Let there be light! -----

//Lights

// add an ambient light (this will tint the complete scene with a color)
// there is usually only one ambient light in the scene
lights.ambient = new THREE.AmbientLight( 0xcccccc );
scene.add( lights.ambient );

// add a point light (This object emits light in a certain radius)
// it is common to have multiple point lights in a scene
// PointLight( color, intensity, distance )
lights.point[0] = new THREE.PointLight( 0xaaaaaa, 1, 100 );
lights.point[0].position.set( 0, 0, 10 );
scene.add( lights.point[0] );

//----------

//----- Part07: Add some movement -----

if(!!selected3DModel){
	selected3DModel.rotateY(Math.PI/1000);
}

//----------

//----- Part08: Add some interactivity -----

//Controls
controls = new THREE.OrbitControls( camera );

//----------

//----- Part09: Stop moving on interaction -----

//check if controls are inactive
if( controls.state == controls.STATES.NONE ){
	if(!!selected3DModel){
		selected3DModel.rotateY(Math.PI/1000);
	}
}

//----------

// ----- Part10: Change material properties -----

// is the child a mesh?
if ( child.isMesh ) {
	if(child.name === "worldSphere"){
		child.material.wireframe = true;
	}else if(child.name === "sphere"){
		child.material.transparent = true;
		child.material.opacity = 0.95;
	}
}

//----------

// ----- Part10.5: Change material properties -----

// is the child a mesh?
if ( child.isMesh ) {
	if(child.name === "worldSphere"){
		child.material.wireframe = true;
	}else if(child.name === "sphere"){
		child.material.transparent = true;
		child.material.opacity = 0.95;
	}else if(child.name === "mysteryBox"){
		child.material.color = new THREE.Color( 0x111111 );
		child.material.metallness = 1;
		child.material.roughness = 0.05;
		child.material.envMap = envMap;
		child.material.aoMapIntensity = 0;
	}
}

//----------

// ----- Part11: Add dynamic resizing to our scene -----

renderer.setSize( window.innerWidth, window.innerHeight );
//camera.aspect = window.innerWidth / window.innerHeight;
//camera.updateProjectionMatrix();

//----------

// ----- Part12: Change the position and rotation of our point light to follow the camera -----

lights.point[0].rotation.copy( camera.rotation );
lights.point[0].position.copy( camera.position );

//----------



// add environment map
var path = 'textures/cube/Bridge2/';
var format = '.jpg';
envMap = new THREE.CubeTextureLoader().load( [
	path + 'posx' + format, path + 'negx' + format,
	path + 'posy' + format, path + 'negy' + format,
	path + 'posz' + format, path + 'negz' + format
] );
//scene.background = envMap;

//----------



// load globe model
var loader = new THREE.GLTFLoader();
//var selected3DModel;
loader.load( './meshes/globus.glb', function ( gltf ) {
	console.log(gltf);

	gltf.scene.scale.x = gltf.scene.scale.y = gltf.scene.scale.z = 0.2;
	gltf.scene.traverse( function ( child ) {
		// Is the child a mesh?
		if ( child.isMesh ) {
			/*
			if(child.name === "globus_low"){
				selected3DModel = child;
				child.rotation.z = 0.349066;
				child.position.x -= 0.29;
				child.position.y -= .05;
			}
			*/
			child.material.envMap = envMap;
			//child.material.envMapIntensity = 0;
			child.material.aoMapIntensity = 0;
		}
	} );

	root.add( gltf.scene );
	root.updateMatrix();
} );

//----------
