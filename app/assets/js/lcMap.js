var mvpMap = {
    sceneDiv: "mapView",
    scene: {},
    view: {},
    showTrail: null,
    showFacility: null

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
        var scene, view, layerViews, highlightedTrail, highlightedFacility;
        var showTrail, showFacility;
        initPage();
        initMap();
        mvpMap.scene = scene;
        mvpMap.view = view;
        mvpMap.showTrail = showTrail;
        mvpMap.showFacility = showFacility;

        function initPage() {
            var topoBtn = document.createElement("div");
            topoBtn.id = "baseTopo";
            topoBtn.className = "basemapButton"
            topoBtn.innerHTML = "Topographic";
            document.getElementById(mapView.sceneDiv).appendChild(topoBtn);
            var imgBtn = document.createElement("div");
            imgBtn.id = "baseImagery";
            imgBtn.className = "basemapButton"
            imgBtn.innerHTML = "Imagery";
            document.getElementById(mapView.sceneDiv).appendChild(imgBtn);

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
                container: mapView.sceneDiv,
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
                    //
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

            showTrail = function (id, highlight = true, zoom = true, popup = null) {
                var targetLayer;
                var whereClause;

                targetLayer = layerViews["Mamoni Valley Trails"];
                //whereClause = "Name = '" + id + "'";
                whereClause = "TrailID = '" + id + "'";
                targetLayer.queryFeatures({
                    where: whereClause,
                    returnGeometry: true
                }).then(function (results) {
                    if (highlightedTrail) {
                        highlightedTrail.remove();
                    }
                    if (results.features.length > 0) {
                        if (highlight == true) {
                            highlightedTrail = targetLayer.highlight(results.features);
                        }

                        if (zoom == true) {
                            view.goTo({
                                //target: results.features,
                                tilt: 65,
                                target: results.features[0].geometry.extent.expand(1.07)
                            }, {
                                speedFactor: 0.5
                            });
                        }
                        if (popup) {
                            var trailGeom = results.features[0].geometry;
                            view.popup.open({

                                title: popup.title,
                                location: trailGeom.getPoint(0, Math.round(trailGeom.paths[0].length / 2)),
                                content: popup.content
                            });

                        }
                    }
                })

            }
            showFacility = function (id, highlight = true, zoom = true, popup = null) {
                var targetLayer;
                var whereClause;

                targetLayer = layerViews["Life Changer Lodging Facilities"];
                //whereClause = "Name = '" + id + "'";
                whereClause = "FacilityID = '" + id + "'";
                targetLayer.queryFeatures({
                    where: whereClause,
                    returnGeometry: true
                }).then(function (results) {
                    if (highlightedFacility) {
                        highlightedFacility.remove();
                    }
                    if (results.features.length > 0) {
                        if (highlight == true) {
                            highlightedFacility = targetLayer.highlight(results.features);
                        }

                        if (zoom == true) {
                            view.goTo({
                                target: results.features,
                                tilt: 65,
                                zoom: 17
                            }, {
                                speedFactor: 0.5
                            });
                        }
                        if (popup) {
                            view.popup.open({

                                title: popup.title,
                                location: results.features[0].geometry,
                                content: popup.content
                            });
                        }
                    }
                })

            }
        }


        function setBasemap(basemap) {
            if (basemap == "topo") {
                getLayer("Mamoni Terrain").visible = true;
                getLayer("World Hillshade").visible = true;
                getLayer("World Terrain Base").visible = true;
                getLayer("Mamoni Drone Imagery (2017-2019)").visible = false;
                getLayer("World Imagery").visible = false;
                domClass.add("baseTopo", "active");
                domClass.remove("baseImagery", "active");
            } else if (basemap == "imagery") {
                getLayer("Mamoni Terrain").visible = false;
                getLayer("World Hillshade").visible = false;
                getLayer("World Terrain Base").visible = false;
                getLayer("Mamoni Drone Imagery (2017-2019)").visible = true;
                getLayer("World Imagery").visible = true;
                domClass.remove("baseTopo", "active");
                domClass.add("baseImagery", "active");
            }
        }

        function getLayer(title) {
            for (let i = 0; i < scene.allLayers.items.length; i++) {
                if (scene.allLayers.items[i].title.toLowerCase() == title.toLowerCase()) {
                    scene.allLayers.items[i].outFields = "*";
                    return scene.allLayers.items[i]
                }
            }
            return null;
        }
    });