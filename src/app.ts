import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import earcut from "earcut";
import { Tools, Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, Sound, StandardMaterial, Color3, Texture, Vector4, Animation, SceneLoader } from "@babylonjs/core";

class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", 0, 0, 0, Vector3.Zero(), scene);
        camera.setPosition(new Vector3(20, 20, 20))
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(0, 1, 1), scene);
        camera.attachControl(canvas, true);
        
        let faceUV = [];
        faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
        faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
        faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
        faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
        
        // var box: Mesh = MeshBuilder.CreateBox("box", {width: 1, height: 1.1, depth: 1}, scene);
        var box: Mesh = MeshBuilder.CreateBox("box", {faceUV: faceUV, wrap: true}, scene);
        box.position.y = 0.5;
        const boxMat = new StandardMaterial("boxMat", scene);
        boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/cubehouse.png", scene);
        box.material = boxMat;
        
        const roof = MeshBuilder.CreateCylinder("root", {diameter: 1.3, height: 1.2, tessellation: 3})
        roof.scaling.x = 0.75;
        roof.rotation.z = Math.PI / 2;
        roof.position.y = 1.22;
        const roofMat = new StandardMaterial("roofMat", scene);
        roofMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg", scene)
        roof.material = roofMat;
        // box.rotation.y = Math.PI / 4;
        // box.rotation.y = Tools.ToRadians(45)
        
        // const ground: Mesh = MeshBuilder.CreateGround("ground", {width:10, height:10});
        // const groundMat = new StandardMaterial("groundMat", scene);
        // groundMat.diffuseColor = new Color3(0.3, 0.5, 0);
        // ground.material = groundMat;

        // const sound = new Sound("kangaroo", "./Kangaroo.mp3", scene,  null, {
            //     loop: true,
            //     autoplay: true
            // })
            
        //base
        const outline = [
            new Vector3(-0.3, 0, -0.1),
            new Vector3(0.2, 0, -0.1)
        ]

        //curved front
        for (let i = 0; i < 20; i++) {
            outline.push(new Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1))
        }

        //top
        outline.push(new Vector3(0, 0, 0.1))
        outline.push(new Vector3(-0.3, 0, 0.1))

        let carFaceUV = [];
        faceUV[0] = new Vector4(0, 0.5, 0.38, 1);
        faceUV[1] = new Vector4(0, 0, 1, 0.5);
        faceUV[2] = new Vector4(0.38, 1, 0, 0.5);
    
        //material
        const carMat = new StandardMaterial("carMat", scene);
        carMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/car.png", scene);
    
        const car = MeshBuilder.ExtrudePolygon("car", {shape: outline, depth: 0.2, faceUV: faceUV, wrap: true}, scene, earcut);
        car.material = carMat;
        car.rotation.x = Math.PI * 3 / 2;

        //wheel face UVs
        const wheelUV = [];
        wheelUV[0] = new Vector4(0, 0, 1, 1);
        wheelUV[1] = new Vector4(0, 0.5, 0, 0.5);
        wheelUV[2] = new Vector4(0, 0, 1, 1);
        //car material
        const wheelMat = new StandardMaterial("wheelMat", scene);
        wheelMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/wheel.png", scene);
        const wheelRB = MeshBuilder.CreateCylinder("wheelRB", {diameter: 0.125, height: 0.05})
        wheelRB.material = wheelMat;
        wheelRB.parent = car;
        wheelRB.position.z = -0.1;
        wheelRB.position.x = -0.2;
        wheelRB.position.y = 0.035;

        const wheelRF = wheelRB.clone("wheelRF");
        wheelRF.position.x = 0.1;

        const wheelLB = wheelRB.clone("wheelLB");
        wheelLB.position.y = -0.2 - 0.035;

        const wheelLF = wheelRF.clone("wheelLF");
        wheelLF.position.y = -0.2 - 0.035;

        const animWheel = new Animation("wheelAnimation", "rotation.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)

        const wheelKeys = [];
        //At the animation key 0, the value of rotation.y is 0
        wheelKeys.push({
            frame: 0,
            value: 0
        });

        //At the animation key 30, (after 1 sec since animation fps = 30) the value of rotation.y is 2PI for a complete rotation
        wheelKeys.push({
            frame: 30,
            value: 2 * Math.PI
        });

        animWheel.setKeys(wheelKeys);
        wheelLB.animations = [];
        wheelLB.animations.push(animWheel);
        animWheel.setKeys(wheelKeys);
        wheelLF.animations = [];
        wheelLF.animations.push(animWheel);
        animWheel.setKeys(wheelKeys);
        wheelRB.animations = [];
        wheelRB.animations.push(animWheel);
        animWheel.setKeys(wheelKeys);
        wheelRF.animations = [];
        wheelRF.animations.push(animWheel);
        scene.beginAnimation(wheelLB, 0, 30, true);
        scene.beginAnimation(wheelLF, 0, 30, true);
        scene.beginAnimation(wheelRB, 0, 30, true);
        scene.beginAnimation(wheelRF, 0, 30, true);


        const animCar = new Animation("carAnimation", "position.x", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
        const carKeys = [];

        carKeys.push({
            frame: 0,
            value: -4
        })

        carKeys.push({
            frame: 150,
            value: 4
        })

        carKeys.push({
            frame: 210,
            value: 4
        })

        animCar.setKeys(carKeys)

        car.animations = []
        car.animations.push(animCar)

        scene.beginAnimation(car, 0, 210, true)
        // SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "car.babylon").then(() => {
        //     const wheelRB = scene.getMeshByName("wheelRB");
        //     const wheelRF = scene.getMeshByName("wheelRF");
        //     const wheelLB = scene.getMeshByName("wheelLB");
        //     const wheelLF = scene.getMeshByName("wheelLF");

        //     scene.beginAnimation(wheelRB, 0, 30, true);
        //     scene.beginAnimation(wheelRF, 0, 30, true);
        //     scene.beginAnimation(wheelLB, 0, 30, true);
        //     scene.beginAnimation(wheelLF, 0, 30, true);
        // })


        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });
        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
            engine.resize();
        });

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }
}
new App();
