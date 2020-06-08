var loaded = false;
const LOADER = document.getElementById('js-loader');
const DRAG_NOTICE = document.getElementById('js-drag-notice');

let scene;

var wrapp = document.getElementById('wrapp');

const canvas = document.querySelector('#c');

const BACKGROUND_COLOR = 0x4f4f4f;

var TRAY;
const PICKER = document.getElementById('pick-part');

var colors = colorsNonMetal;

var katana;

var hemiLight;


function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(BACKGROUND_COLOR);

    camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight, 1, 5000);
    
    camera.rotation.y = 45/180*Math.PI;
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 50;    
    
    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );

    hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 5);
    hemiLight.position.set( 0, 15, 0 );  

    scene.add( hemiLight );
    

    light1 = new THREE.DirectionalLight(0xc4c4c4,1);
    light1.position.set(10,3,20);
     scene.add(light1);

    light2 = new THREE.DirectionalLight(0xc4c4c4,1);
    light2.position.set(-10,3,20);
    scene.add(light2);

    light3 = new THREE.DirectionalLight(0xc4c4c4,1);
    light3.position.set(10,3,-20);
    scene.add(light3);
    
    light4 = new THREE.DirectionalLight(0xc4c4c4,1);
    light4.position.set(-10,3,-20);
    scene.add(light4);
  

    renderer = new THREE.WebGLRenderer({canvas, antialias:true});

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    controls.addEventListener('change', renderer);

//controls.update() must be called after any manual changes to the camera's transform
    controls.update()
    camera.position.set( 0, 0, 50 );

    renderer.setSize(window.innerWidth, window.innerHeight);
    wrapp.appendChild(renderer.domElement);


    let loader = new THREE.GLTFLoader();
    loader.load('models/katana/Katana_3e.gltf', function(obj) {
      
        katana = obj.scene.children[0];
        katana.scale.set(1, 1, 1);
        katana.position.set(0, 0, 0);
        
        kataParts = katana.children[0].children[0].children[0];       

       scene.add(katana);
       LOADER.remove();
       animate();
       
       
    }, undefined, function(error) {
        console.error(error)
      }
    );
    
}

function animate() {
 
  renderer.render(scene,camera);  
 

  requestAnimationFrame(animate);
  if (resizeRendererToDisplaySize(renderer)) {

    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  if (katana != null && loaded == false) {
    
    DRAG_NOTICE.classList.add('start');
  }
  
  

  
}

init();


PICKER.addEventListener('change', function() {
    var metalCheck = PICKER[this.selectedIndex].getAttribute('metal');
    var metalCols = document.getElementById('slide_metal');
    var nonmetalCols = document.getElementById('slide_nonmetal');
    
    if (metalCheck === "false"){        
        metalCols.classList.add('hidden');
        nonmetalCols.classList.remove('hidden');

        colors = colorsNonMetal;
        
    } else {
        metalCols.classList.remove('hidden');
        nonmetalCols.classList.add('hidden');
        colors = colorsMetal;
    }  
      
    
})



function buildColors(colors) {
    
    for (let [i, color] of colors.entries()) {
      let swatch = document.createElement('div');
      swatch.classList.add('tray__swatch');
    if (colors.length < 6 ){
       TRAY = document.getElementById('slide_metal');
    }else {
       TRAY = document.getElementById('slide_nonmetal');
    }
            
      if (color.texture)
      {
        swatch.style.backgroundImage = "url(" + color.texture + ")";   
      } else
      {
        swatch.style.background = "#" + color.color;
      }
  
      swatch.setAttribute('data-key', i);
      TRAY.append(swatch);
    }

    
  }
  
  
  buildColors(colorsNonMetal);
  buildColors(colorsMetal);



function buildPartPicker(parts){
    for (let part of parts){
        var option = document.createElement('option');
        option.setAttribute('value', part.part);
        option.innerHTML = part.name;
        option.setAttribute('metal', part.metal)
        PICKER.append(option);
     }
    }
    buildPartPicker(parts);

  const swatches = document.querySelectorAll(".tray__swatch");

for (const swatch of swatches) {
  swatch.addEventListener('click', selectSwatch);
}

function selectSwatch(e) {
    let color = colors[parseInt(e.target.dataset.key)];
   

   var new_clr = parseInt('0x' + color.color);   
   setMaterial(katana, PICKER.value, new_clr);
}

function setMaterial(parent, type, new_clr) {
    
    
    parent.traverse((o) => {        
      
     if (o instanceof THREE.Mesh && o.name != null) {      
      console.log(o.name) 
      if (o.name == type) {    
          
            var mtl = o.material.clone();
            mtl.color.setHex(new_clr);
            mtl.metalness = 1;
           
            mtl.blending = THREE.CustomBlending;
            o.material = mtl;
          
       
        }
     }
   });
  }


  let initRotate = 0;

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    var width = wrapp.offsetWidth;
    var height = wrapp.offsetHeight;
    var canvasPixelWidth = canvas.width / window.devicePixelRatio;
    var canvasPixelHeight = canvas.height / window.devicePixelRatio;
  
    const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      
      renderer.setSize(width, height, false);
    }
    return needResize;
  }



