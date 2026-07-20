import * as THREE from "three";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

import { gsap } from "three/addons/libs/gsap.module.js";

const canvas = document.getElementById("bg");


const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050510);

scene.fog = new THREE.FogExp2(
0x050510,
0.025
);



const camera = new THREE.PerspectiveCamera(
60,
window.innerWidth / window.innerHeight,
0.1,
1000
);

camera.position.set(
0,
2,
10
);


// CINEMATIC CAMERA SYSTEM

const cameraPositions = {

hero:{
position:{
x:0,
y:2,
z:10
},
look:{
x:0,
y:0,
z:0
}
},


projects:{
position:{
x:0,
y:3,
z:6
},
look:{
x:0,
y:0,
z:-4
}
},


skills:{
position:{
x:5,
y:4,
z:8
},
look:{
x:0,
y:1,
z:0
}
},


contact:{
position:{
x:-4,
y:2,
z:7
},
look:{
x:0,
y:0,
z:0
}

}

};



function moveCamera(section){

const target =
cameraPositions[section];


if(!target) return;


gsap.to(
camera.position,
{

x:target.position.x,

y:target.position.y,

z:target.position.z,

duration:2,

ease:"power3.inOut"

}

);


gsap.to(
camera.rotation,
{

x:0,

y:0,

z:0,

duration:2,

ease:"power3.inOut"

}

);

}




const renderer = new THREE.WebGLRenderer({

canvas,

antialias:true,

alpha:true,

powerPreference:"high-performance"

});


renderer.setPixelRatio(
Math.min(window.devicePixelRatio,2)
);

renderer.setSize(
window.innerWidth,
window.innerHeight
);


renderer.shadowMap.enabled=true;

renderer.shadowMap.type=
THREE.PCFSoftShadowMap;


renderer.outputColorSpace=
THREE.SRGBColorSpace;


const composer = new EffectComposer(renderer);


composer.addPass(
new RenderPass(
scene,
camera
)
);



const bloom = new UnrealBloomPass(

new THREE.Vector2(
window.innerWidth,
window.innerHeight
),

1.15,

0.5,

0.2

);


composer.addPass(bloom);




const ambient =
new THREE.AmbientLight(
0xffffff,
0.55
);


scene.add(ambient);



const light1 =
new THREE.PointLight(
0x8b5cf6,
250
);


light1.position.set(
6,
8,
6
);


scene.add(light1);



const light2 =
new THREE.PointLight(
0x4f46e5,
180
);


light2.position.set(
-8,
-3,
-6
);


scene.add(light2);



const light3 =
new THREE.DirectionalLight(
0xffffff,
0.7
);


light3.position.set(
10,
20,
15
);


scene.add(light3);




const grid =
new THREE.GridHelper(
120,
120,
0x4422ff,
0x111122
);


grid.material.opacity=.12;

grid.material.transparent=true;

grid.position.y=-2;


scene.add(grid);




const coreGeometry =
new THREE.IcosahedronGeometry(
1.5,
2
);



const coreMaterial =
new THREE.MeshPhysicalMaterial({

color:0x8b5cf6,

metalness:1,

roughness:.05,

transmission:.1,

clearcoat:1,

emissive:0x5522ff,

emissiveIntensity:.6

});



const core =
new THREE.Mesh(
coreGeometry,
coreMaterial
);



scene.add(core);




const ring =
new THREE.Mesh(

new THREE.TorusGeometry(
2.5,
0.05,
32,
200
),

new THREE.MeshBasicMaterial({

color:0x8b5cf6

})

);



ring.rotation.x =
Math.PI/2;


scene.add(ring);




const mouse = {

x:0,

y:0

};



window.addEventListener(
"mousemove",
e=>{

mouse.x =
(e.clientX/window.innerWidth)*2-1;


mouse.y =
-(e.clientY/window.innerHeight)*2+1;

});
const particleCount = 3500;

const particleGeometry =
new THREE.BufferGeometry();

const particlePositions =
new Float32Array(
particleCount * 3
);


for(let i=0;i<particleCount;i++){

const i3=i*3;

particlePositions[i3] =
(Math.random()-.5)*180;

particlePositions[i3+1] =
(Math.random()-.5)*120;

particlePositions[i3+2] =
(Math.random()-.5)*180;

}


particleGeometry.setAttribute(
"position",
new THREE.BufferAttribute(
particlePositions,
3
)
);


const particleMaterial =
new THREE.PointsMaterial({

color:0x9b6cff,

size:.12,

transparent:true,

opacity:.9,

depthWrite:false,

blending:
THREE.AdditiveBlending

});


const particles =
new THREE.Points(
particleGeometry,
particleMaterial
);


scene.add(particles);




const cubes=[];


for(let i=0;i<30;i++){

const cube =
new THREE.Mesh(

new THREE.BoxGeometry(
Math.random()*.5+.2,
Math.random()*.5+.2,
Math.random()*.5+.2
),


new THREE.MeshPhysicalMaterial({

color:
Math.random()>.5
?
0x8b5cf6
:
0x4f46e5,


metalness:1,

roughness:.1,


transparent:true,

opacity:.8,


emissive:0x5522ff,

emissiveIntensity:.6

})

);



cube.position.set(

(Math.random()-.5)*35,

(Math.random()-.5)*18,

(Math.random()-.5)*35

);



cube.rotation.set(

Math.random()*Math.PI,

Math.random()*Math.PI,

Math.random()*Math.PI

);



cube.userData={

speed:
Math.random()*.5+.2,


offset:
Math.random()*10

};



scene.add(cube);


cubes.push(cube);


}




const projectGroup =
new THREE.Group();


scene.add(projectGroup);



const projectMeshes=[];



const projects=[

{
name:"Combat Framework",
color:0x8b5cf6
},

{
name:"Inventory System",
color:0x4f46e5
},

{
name:"RTS AI",
color:0xa855f7
},

{
name:"Traffic AI",
color:0x6366f1
}

];



projects.forEach(
(project,index)=>{

const fontLoader = new FontLoader();

fontLoader.load(
"https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
(font)=>{


projects.forEach((project,index)=>{


const textGeometry =
new TextGeometry(
project.name,
{

font:font,

size:.35,

depth:.05,

curveSegments:12,

bevelEnabled:true,

bevelThickness:.01,

bevelSize:.01,

bevelSegments:3

}
);



textGeometry.center();



const textMaterial =
new THREE.MeshPhysicalMaterial({

color:0xffffff,

emissive:0x8b5cf6,

emissiveIntensity:.8,

metalness:.5,

roughness:.2

});



const text =
new THREE.Mesh(
textGeometry,
textMaterial
);



text.position.set(

(index-1.5)*3.5,

Math.sin(index)*.8+1,

-4

);



text.userData={

speed:
Math.random()*.5+.5,

offset:
Math.random()*5

};



projectGroup.add(text);



});



});

const panel =
new THREE.Mesh(

new THREE.BoxGeometry(
2.8,
1.5,
0.08
),


new THREE.MeshPhysicalMaterial({

color:project.color,

metalness:.8,

roughness:.15,

transparent:true,

opacity:.85,

emissive:project.color,

emissiveIntensity:.5

})

);



panel.position.set(

(index-1.5)*3.5,

Math.sin(index)*.8,

-4

);



panel.userData={

name:project.name,

speed:
Math.random()*.5+.5,

offset:
Math.random()*5,

hover:false

};



projectGroup.add(panel);


projectMeshes.push(panel);




const glow =
new THREE.Mesh(

new THREE.BoxGeometry(
3,
1.7,
0.03
),

new THREE.MeshBasicMaterial({

color:project.color,

transparent:true,

opacity:.12

})

);



glow.position.copy(
panel.position
);


glow.position.z-=.05;


projectGroup.add(glow);


});




const raycaster =
new THREE.Raycaster();


const pointer =
new THREE.Vector2();



window.addEventListener(
"mousemove",
e=>{


pointer.x =
(e.clientX/window.innerWidth)*2-1;


pointer.y =
-(e.clientY/window.innerHeight)*2+1;


});




const cursorLight =
new THREE.PointLight(
0xaa66ff,
50,
12
);


scene.add(cursorLight);



window.addEventListener(
"mousemove",
e=>{


cursorLight.position.x =
((e.clientX/window.innerWidth)-.5)*12;


cursorLight.position.y =
-((e.clientY/window.innerHeight)-.5)*7;


cursorLight.position.z=4;


});
const clock = new THREE.Clock();

document.querySelectorAll("nav a")
.forEach(link=>{

link.addEventListener(
"click",
()=>{

const section =
link
.getAttribute("href")
.replace("#","");


if(section==="hero")
moveCamera("hero");


if(section==="projects")
moveCamera("projects");


if(section==="skills")
moveCamera("skills");


if(section==="contact")
moveCamera("contact");

});

});

function animate(){

requestAnimationFrame(animate);


const t =
clock.getElapsedTime();



core.rotation.x =
t * .35;


core.rotation.y =
t * .6;


core.position.y =
Math.sin(t)*.35;



ring.rotation.z =
t*.25;


ring.rotation.y =
t*.18;



camera.position.x +=
(
(mouse.x*2) -
camera.position.x
)
*.03;


camera.position.y +=
(
(mouse.y*1.5+2) -
camera.position.y
)
*.03;


camera.lookAt(
0,
0,
0
);




particles.rotation.y +=
0.0005;


particles.rotation.x +=
0.0002;




for(const cube of cubes){


cube.rotation.x +=
0.004 *
cube.userData.speed;


cube.rotation.y +=
0.006 *
cube.userData.speed;



cube.position.y =
Math.sin(
t+
cube.userData.offset
)
*2;


}





raycaster.setFromCamera(
pointer,
camera
);



const hits =
raycaster.intersectObjects(
projectMeshes
);



projectMeshes.forEach(card=>{

card.userData.hover=false;

});



if(hits.length){

hits[0].object.userData.hover=true;

}




projectMeshes.forEach(card=>{


if(card.userData.hover){


card.scale.lerp(

new THREE.Vector3(
1.15,
1.15,
1.15
),

0.1

);


card.material.emissiveIntensity=1.2;


}

else{


card.scale.lerp(

new THREE.Vector3(
1,
1,
1
),

0.1

);


card.material.emissiveIntensity=.5;


}



card.rotation.y += .003;



card.position.y =
Math.sin(
t*
card.userData.speed+
card.userData.offset
)
*.3;



});




light1.intensity =
250+
Math.sin(t*2)*40;


light2.intensity =
180+
Math.cos(t*1.5)*30;



ring.scale.setScalar(

1+
Math.sin(t*2)*.05

);



core.material.emissiveIntensity =

0.5+
Math.sin(t*3)*0.25;



projectGroup.children.forEach(object=>{

if(object.geometry instanceof THREE.BufferGeometry){

object.rotation.y =
Math.sin(t*.5)*.05;

}

});

composer.render();


}


animate();

document.querySelectorAll("nav a")
.forEach(link=>{

link.addEventListener(
"click",
()=>{

const section =
link
.getAttribute("href")
.replace("#","");


if(section==="hero")
moveCamera("hero");


if(section==="projects")
moveCamera("projects");


if(section==="skills")
moveCamera("skills");


if(section==="contact")
moveCamera("contact");

});

});




window.addEventListener(
"resize",
()=>{


camera.aspect =
window.innerWidth /
window.innerHeight;


camera.updateProjectionMatrix();



renderer.setSize(
window.innerWidth,
window.innerHeight
);



renderer.setPixelRatio(
Math.min(
window.devicePixelRatio,
2
)
);



composer.setSize(
window.innerWidth,
window.innerHeight
);



bloom.setSize(
window.innerWidth,
window.innerHeight
);


});






let scrollTarget=0;


window.addEventListener(
"scroll",
()=>{

scrollTarget =
window.scrollY;

});

const cursor =
document.querySelector(".cursor");


const cursorGlow =
document.querySelector(".cursorGlow");


window.addEventListener(
"mousemove",
e=>{


cursor.style.left =
e.clientX+"px";


cursor.style.top =
e.clientY+"px";



cursorGlow.style.left =
e.clientX+"px";


cursorGlow.style.top =
e.clientY+"px";


});

function updateScrollCamera(){


camera.position.z +=
(
10 + scrollTarget*.003
-
camera.position.z
)
*.02;


requestAnimationFrame(
updateScrollCamera
);


}


updateScrollCamera();






window.addEventListener(
"load",
()=>{

document
.getElementById("viewProjects")
.addEventListener(
"click",
()=>{

moveCamera("projects");


document
.getElementById("projects")
.scrollIntoView({
behavior:"smooth"
});

});

const loading =
document.getElementById(
"loading"
);



if(loading){


setTimeout(()=>{


loading.style.opacity="0";

loading.style.pointerEvents="none";


setTimeout(()=>{

loading.remove();

},600);


},1200);


}


});

const revealObjects =
document.querySelectorAll(
".card,.glass,.skills div,.contactBox"
);


const observer =
new IntersectionObserver(
(entries)=>{

entries.forEach(entry=>{


if(entry.isIntersecting){

entry.target.style.opacity="1";

entry.target.style.transform=
"translateY(0)";

}

});


},
{
threshold:.2
}
);



revealObjects.forEach(el=>{

el.style.opacity="0";

el.style.transform=
"translateY(50px)";

el.style.transition=
"1s";


observer.observe(el);

});
