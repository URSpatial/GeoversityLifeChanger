var mvpMap = {
    scene: {},
    view: {},
    goTo: {},
    select: {}
}


var coreLayerNames = {
    lcTrails: "Life Changer Trails",
    lcLodging: "Life Changer Lodging Facilities",
    allTrails: "Mamoni Valley Trails",
    terrain: "Mamoni Terrain"
}
require([
        "esri/Map",
        "esri/WebScene",
        "esri/views/SceneView",
        "esri/layers/ElevationLayer",
        "esri/layers/BaseElevationLayer",
        "dojo/dom-construct",
        "dojo/dom",
        "dojo/dom-class",
        "dojo/on",
        "dojo/dom-style"
    ],
    function (Map, WebScene, SceneView, ElevationLayer, BaseElevationLayer, domConstruct, dom, domClass, on, domStyle) {
        var scene, view, layerViews, highlight;
        var goTo, select;
        initPage();
        initMap();
        mvpMap.scene = scene;
        mvpMap.view = view;
        mvpMap.goTo = goTo;
        mvpMap.select = select;

        function initPage() {
            var topoBtn = document.createElement("div");
            topoBtn.id = "baseTopo";
            topoBtn.className = "basemapButton"
            topoBtn.innerHTML = "Topographic";
            document.getElementById("mapView").appendChild(topoBtn);
            var imgBtn = document.createElement("div");
            imgBtn.id = "baseImagery";
            imgBtn.className = "basemapButton"
            imgBtn.innerHTML = "Imagery";
            document.getElementById("mapView").appendChild(imgBtn);

            //         var toggleBase =domConstruct.create("div", {
            //             id: "toggleBase"
            //         }, "mapView");
            // toggleBase.
        }

        function initMap() {
            layerViews = {};
            var map = new Map({
                basemap: "topo-vector",
                ground: "world-elevation"
            });
            scene = new WebScene({
                portalItem: {
                    id: "045500bd82e840c0b59a4f5a5ed1deb7"
                }
            });
            view = new SceneView({
                container: "mapView",
                map: scene,
                camera: {
                    heading: 2.157,
                    position: {
                        latitude: 9.009871459861527,
                        longitude: -79.20158654500605,
                        z: 17982.256798780523
                    },
                    tilt: 60
                },
                highlightOptions: {
                    haloOpacity: .7,
                    color: [255, 255, 0]
                },
                environment: {
                    atmosphereEnabled: true,
                    atmosphere: {
                        quality: "high"
                    }
                }
            });

            view.when(function () {
                setBasemap("topo");
                var baseTopo = dom.byId("baseTopo");
                var baseImagery = dom.byId("baseImagery");
                on(baseTopo, "click", function (evt) {
                    setBasemap("topo");

                });
                on(baseImagery, "click", function (evt) {
                    setBasemap("imagery");

                });

                view.on("layerview-create", function (event) {
                    //layerViews[event.layer.id] = event.layerView;
                });
            });
            scene.when(function () {


                var coreLayerProps = Object.keys(coreLayerNames);
                for (i = 0; i < coreLayerProps.length; i++) {
                    var lyrName = coreLayerNames[coreLayerProps[i]];
                    var lyr = getLayer(lyrName);
                    view.whenLayerView(lyr).then(function (layerView) {
                        layerViews[layerView.layer.title] = layerView;
                    })

                }




            });
            goTo = function (layer, id) {
                var targetLayer;
                var whereClause;
                if (layer == "trails") {
                    // goToLayers.push(layerViews["Life Changer Trails"]);
                    targetLayer = layerViews["Mamoni Valley Trails"];
                    whereClause = "Name LIKE '%" + id + "%'";
                }

                targetLayer.queryFeatures({
                    where: whereClause,
                    returnGeometry: true
                }).then(function (results) {
                    view.goTo(results.features, {
                        speedFactor: 0.5
                    });
                })

            }
            select = function (layer, id, goTo = true) {
                var targetLayer;
                var whereClause;
                if (layer == "trails") {
                    // goToLayers.push(layerViews["Life Changer Trails"]);
                    targetLayer = layerViews["Mamoni Valley Trails"];
                    whereClause = "Name LIKE '%" + id + "%'";
                }
                targetLayer.queryFeatures({
                    where: whereClause,
                    returnGeometry: true
                }).then(function (results) {
                    if (highlight) {
                        highlight.remove();
                    }
                    highlight = targetLayer.highlight(results.features);
                    if (goTo = true) {
                        view.goTo({
                            target: results.features,
                            tilt: 65
                        }, {
                            speedFactor: 0.5
                        });
                    }
                })

            }
        }


        function setBasemap(basemap) {
            if (basemap == "topo") {

                getLayer("Mamoni Terrain").visible = true;
                getLayer("World Hillshade").visible = true;
                getLayer("World Terrain Base").visible = true;
                //getLayer("Pansharpened Satellite Imagery - Feb 7, 2011 (GeoEye DigitalGlobe)").visible = false;
                getLayer("Mamoni Drone Imagery (2017-2019)").visible = false;
                getLayer("World Imagery").visible = false;
                domClass.add("baseTopo", "active");
                domClass.remove("baseImagery", "active");

            } else if (basemap == "imagery") {
                getLayer("Mamoni Terrain").visible = false;
                getLayer("World Hillshade").visible = false;
                getLayer("World Terrain Base").visible = false;
                //getLayer("Pansharpened Satellite Imagery - Feb 7, 2011 (GeoEye DigitalGlobe)").visible = false;
                getLayer("Mamoni Drone Imagery (2017-2019)").visible = true;
                getLayer("World Imagery").visible = true;
                domClass.remove("baseTopo", "active");
                domClass.add("baseImagery", "active");
            }
        }

        function getLayer(title) {
            for (let i = 0; i < scene.allLayers.items.length; i++) {
                if (scene.allLayers.items[i].title.toLowerCase() == title.toLowerCase()) {
                    return scene.allLayers.items[i]
                }
            }
            return null;
        }
    });