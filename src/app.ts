import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Tools, Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, Sound, StandardMaterial, Color3, Texture, Vector4 } from "@babylonjs/core";

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
        
        const ground: Mesh = MeshBuilder.CreateGround("ground", {width:10, height:10});
        const groundMat = new StandardMaterial("groundMat", scene);
        groundMat.diffuseColor = new Color3(0.3, 0.5, 0);
        ground.material = groundMat;

        // const sound = new Sound("kangaroo", "./Kangaroo.mp3", scene,  null, {
            //     loop: true,
            //     autoplay: true
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
