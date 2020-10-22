# Geoversity LifeChanger Maps
[See the sample map page here](https://urspatial.redlands.edu/apps/panama/lifechangermap/lcmap.html)
## Adding a map to a page
Add references to the Esri jsapi and the lifechanger (lc) links (along with your own)
```
<!-- Esri references -->
<link rel="stylesheet" href="https://js.arcgis.com/4.17/esri/themes/light/main.css">
<script src="https://js.arcgis.com/4.17/"></script>
<!-- MVP Lifechanger references -->
<link rel="stylesheet" href="assets/css/lcMap.css">
<script src="assets/js/lcMap.js"></script>
<!-- Your own page references -->
<link rel="stylesheet" href="assets/css/app.css">
```
You can define any div element as the container for the scene/map. The div can have any css styling that you want (size, borders, etc). You'll just need to set the id of the div in the mvpMap object (mvpMap.sceneDiv). The default name is mapView (so maybe use that to start).
```
<div id="mapView"></div>
```
That's it! You should now have a working map/scene on your page!  
Now let's look at a couple methods I've made for interacting with the map.
## Interacting with the map  
The mvpMap object in lcMap.js has references to the **Scene** and **SceneView** objects from Esri's javascript api to interact with the map in any number of ways but I've created 2 simple methods for working with your list of trails and facilities - showTrail() and showFacility().  
Both methods have the same parameters
```
showTrail(id,highlight,zoom,popup)
showFacility(id,highlight,zoom,popup)
```
- id: (*string*) - trail or facility id (id convention TBD)  
- highlight (*true*/false*) - Highlight the feature (default: true)  
- zoom (*true*/false*) - Zoom to the feature (default: true)  
- popup (object {title,content) - Title is string displayed at the top of the popup, content is the main body of the popup as a string and can be formatted with html.  

Sample
```
mvpMap.showTrail('LaBonita'); //highlights and zooms with no popup
mvpMap.showTrail('LaZahina',true,true,{title:'La Zahina Ridge',content:'Some content for this trail'}); //highlights and zooms with a simple popup
mvpMap.showTrail('LaZahina',true,true,{title:'La Zahina Ridge',content:'Some content as html.<br><b>See I can put html in here!</b><img width=\'100%\' src=\'https://earthtrain.org/en/assets/imgs/gallerias/00_mvp-tour/normal/2%20view%20south%20of%20centro%20mamoni.jpg\'>'}); //highlights and zooms with an html-formatted popup
```
