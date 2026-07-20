import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
const canvas = document.getElementById("bg");

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050510);

scene.fog = new THREE.FogExp2(0x050510,0.025);

const camera = new THREE.PerspectiveCamera(
60,
window.innerWidth/window.innerHeight,
0.1,
1000
);

camera.position.set(0,2,10);

const renderer = new THREE.WebGLRenderer({
canvas,
antialias:true,
alpha:true,
powerPreference:"high-performance"
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

renderer.setSize(window.innerWidth,window.innerHeight);

renderer.shadowMap.enabled=true;

renderer.shadowMap.type=THREE.PCFSoftShadowMap;

renderer.outputColorSpace=THREE.SRGBColorSpace;

const ambient=new THREE.AmbientLight(0xffffff,.55);

scene.add(ambient);

const light1=new THREE.PointLight(0x8b5cf6,250);

light1.position.set(6,8,6);

scene.add(light1);

const light2=new THREE.PointLight(0x4f46e5,180);

light2.position.set(-8,-3,-6);

scene.add(light2);

const light3=new THREE.DirectionalLight(0xffffff,.7);

light3.position.set(10,20,15);

light3.castShadow=true;

scene.add(light3);

const grid=new THREE.GridHelper(
120,
120,
0x4422ff,
0x111122
);

grid.material.opacity=.12;

grid.material.transparent=true;

grid.position.y=-2;

scene.add(grid);

const geometry=new THREE.IcosahedronGeometry(1.5,2);

const material=new THREE.MeshPhysicalMaterial({
color:0x8b5cf6,
metalness:1,
roughness:.05,
transmission:.1,
clearcoat:1,
emissive:0x5522ff,
emissiveIntensity:.6
});

const core=new THREE.Mesh(
geometry,
material
);

scene.add(core);

const ringGeometry=new THREE.TorusGeometry(
2.5,
.05,
32,
200
);

const ringMaterial=new THREE.MeshBasicMaterial({
color:0x8b5cf6
});

const ring=new THREE.Mesh(
ringGeometry,
ringMaterial
);

ring.rotation.x=Math.PI/2;

scene.add(ring);

const mouse={
x:0,
y:0
};

window.addEventListener("mousemove",e=>{

mouse.x=(e.clientX/window.innerWidth)*2-1;

mouse.y=-(e.clientY/window.innerHeight)*2+1;

});

window.addEventListener("resize",()=>{

camera.aspect=window.innerWidth/window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth,window.innerHeight);

renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

});

const clock=new THREE.Clock();

function animate(){

requestAnimationFrame(animate);

const t=clock.getElapsedTime();

core.rotation.x=t*.35;

core.rotation.y=t*.6;

core.position.y=Math.sin(t)*.35;

ring.rotation.z=t*.25;

ring.rotation.y=t*.18;

camera.position.x+=((mouse.x*2)-camera.position.x)*.03;

camera.position.y+=((mouse.y*1.5)+2-camera.position.y)*.03;

camera.lookAt(0,0,0);

renderer.render(scene,camera);

}

animate();

window.addEventListener("load",()=>{

const loading=document.getElementById("loading");

setTimeout(()=>{

loading.style.opacity="0";

loading.style.pointerEvents="none";

setTimeout(()=>{

loading.remove();

},600);

},1200);

});
const particleCount=3500;

const particleGeometry=new THREE.BufferGeometry();

const particlePositions=new Float32Array(particleCount*3);

const particleSizes=new Float32Array(particleCount);

for(let i=0;i<particleCount;i++){

const i3=i*3;

particlePositions[i3]=(Math.random()-.5)*180;

particlePositions[i3+1]=(Math.random()-.5)*120;

particlePositions[i3+2]=(Math.random()-.5)*180;

particleSizes[i]=Math.random();

}

particleGeometry.setAttribute(
"position",
new THREE.BufferAttribute(particlePositions,3)
);

particleGeometry.setAttribute(
"size",
new THREE.BufferAttribute(particleSizes,1)
);

const particleMaterial=new THREE.PointsMaterial({
color:0x9b6cff,
size:.12,
transparent:true,
opacity:.9,
depthWrite:false,
blending:THREE.AdditiveBlending
});

const particles=new THREE.Points(
particleGeometry,
particleMaterial
);

scene.add(particles);

const cubes=[];

for(let i=0;i<30;i++){

const cube=new THREE.Mesh(

new THREE.BoxGeometry(
Math.random()*0.4+.2,
Math.random()*0.4+.2,
Math.random()*0.4+.2
),

new THREE.MeshPhysicalMaterial({

color:Math.random()>.5?0x8b5cf6:0x4f46e5,

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

speed:Math.random()*.5+.2,

offset:Math.random()*10

};

scene.add(cube);

cubes.push(cube);

}

const cursorLight=new THREE.PointLight(
0xaa66ff,
50,
12
);

scene.add(cursorLight);

window.addEventListener("mousemove",e=>{

cursorLight.position.x=((e.clientX/window.innerWidth)-.5)*12;

cursorLight.position.y=-((e.clientY/window.innerHeight)-.5)*7;

cursorLight.position.z=4;

});

window.addEventListener("scroll",()=>{

const scroll=window.scrollY;

camera.position.z=10+scroll*.003;

camera.rotation.z=scroll*.00015;

});
