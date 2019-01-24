//Markers

    const markColors = {1: '#4E91BE', 2: '#F99E4C'}

    var customizedIcon;
    var GEOJSON;


    var originalGeoJsonURL = "data/uploadedFile.geojson";


    $.getJSON(originalGeoJsonURL, function(data){
        GEOJSON  = data;
    });









    function customizeMarker(color){
        const myCustomColour = color

        const markerNarrativeHtmlStyles = `
                                      background-color: ${myCustomColour};
                                      width: 1.2rem;
                                      height: 1.2rem;
                                      display: b·rem;
                                      top: -1.2rem;
                                      position: relative;
                                      border-radius: 3rem 3rem 0;
                                      transform: rotate(45deg);
                                      border: 0.5px solid #FFFFFF
                                  `

        var icon = L.divIcon({
                                  className: "my-custom-pin",
                                  iconAnchor: [0, 24],
                                  labelAnchor: [-6, 0],
                                  popupAnchor: [0, -36],
                                  html: `<span style="${markerNarrativeHtmlStyles}" />`
                                })

        return icon;
    }



    //Clusters: 1 for residence, 2 for events
    function initialMarkerClusters(type){

        var uniqueClass;

        var groupToReturn = new L.markerClusterGroup({
                                spiderfyOnMaxZoom: true,
                                showCoverageOnHover: true,
                                zoomToBoundsOnClick: true,
                                // maxClusterRadius: 120,
                                singleMarkerMode: false,
                                iconCreateFunction: function(cluster){
                                    count = 0;
                                    cluster.getAllChildMarkers().forEach(function(child){
                                        count = (type == 1) ? (count + parseInt(child.feature.properties.Count)) : (count + 1);
                                        // if(!count){
                                        //     console.log(child.feature.properties)
                                        // }

                                    });
                                    return L.divIcon({
                                        className:`marker-cluster ${uniqueClass}`,
                                        iconSize: new L.Point(40,40),
                                        html: `<div><span >` + count + '</span></div>'
                                    });
                                }
                            })

        switch (type) {
            case 1:
                uniqueClass = "marker-cluster-large";
                groupToReturn.options.maxClusterRadius = 120;
                break;
            case 2:
                uniqueClass = "marker-cluster-large_nav";
                groupToReturn.options.maxClusterRadius = 1;
        }

        return groupToReturn;
    }




    function renderPinsFromURL(accommodation_markers, geoJsonURL){
        customizedIcon = customizeMarker(markColors[1]);

        $.getJSON(geoJsonURL, function(data){
            var geojson = L.geoJson(
                                data,
                                {
                                    onEachFeature: function(feature,layer){
                                        layer.bindPopup("<b>Address:  </b>" + feature.properties.address + "<br>" + "<b>No. of Students:  </b>" + feature.properties.Count);
                                    },
                                    pointToLayer: function (feature, latlng) {
                                        return L.marker(latlng, {icon: customizedIcon});
                                    }
                            });

            accommodation_markers.clearLayers();
            accommodation_markers.addLayer(geojson);
            map.addLayer(accommodation_markers);
        })
    }

    function renderPinsFromJson(accommodation_markers, geoJson){
        customizedIcon = customizeMarker(markColors[1]);

        var geojson = L.geoJson(
                            geoJson,
                            {
                                onEachFeature: function(feature,layer){
                                    layer.bindPopup("<b>Address:  </b>" + feature.properties.address + "<br>" + "<b>No. of Students:  </b>" + feature.properties.Count);
                                },
                                pointToLayer: function (feature, latlng) {
                                    return L.marker(latlng, {icon: customizedIcon});
                                }
                        });

        accommodation_markers.clearLayers();
        accommodation_markers.addLayer(geojson);
        map.addLayer(accommodation_markers);
    }



    // function renderNarrativePins(event_markers, geoJsonURL){
    //     customizedIcon = customizeMarker(markColors[2]);
    //
    //     $.getJSON(geoJsonURL, function(data){
    //         var geojson = L.geoJson(data, {
    //                                         onEachFeature: function(feature,layer){
    //                                             let val_date = feature.properties.Date;
    //                                             let val_text = feature.properties.Text;
    //                                             let val_keywords = feature.properties.Keywords;
    //                                             let val_img = feature.properties['Local_Image'];
    //
    //                                             if (val_date != ""){
    //                                                 val_date = "<b>Date: </b>" + val_date + "<br>";
    //                                             }
    //
    //                                             if (val_text != ""){
    //                                                 val_text = "<b>Text: </b>" + val_text  + "<br>";
    //                                             }
    //
    //                                             if (val_keywords != ""){
    //                                                 val_keywords = "<b>Keywords: </b>" + val_keywords + "<br>";
    //                                             }
    //
    //                                             if (val_img != ""){
    //                                                 val_img = '<img src="' + val_img + '"  style="max-width:250; max-height:200" />';
    //                                             }
    //
    //                                             layer.bindPopup("<b>Address:  </b>" + feature.properties.Address + "<br>" + val_date + val_text + val_keywords + val_img);
    //                                         },
    //
    //                                         pointToLayer: function (feature, latlng) {
    //                                             return L.marker(latlng, {icon: customizedIcon});
    //                                         }
    //                                 });
    //         event_markers.addLayer(geojson);
    //         map.addLayer(event_markers);
    //     });
    //
    // }



    //Slider
    $( function() {
        // config opaque slider
        $( "#slider-opaque" ).slider({
            range: false,
            min: 0,
            max: 1,
            step: 0.1,
            value: 1,

            slide: function( event, ui ) {
                let opaque = ui.value;

                $( "#opacity" ).val( opaque );
                a2_1916_02.setOpacity(opaque);
            }
        });
        //initial display
        $( "#opacity" ).val("1");


        // config time range slider
        $( "#slider-range" ).slider({
            range: true,
            min: 1853, //change to year 1853
            max: 1973, //change to year 1973
            values: [ 1853, 1973 ], //change to year 1853 - 1973

            // Every time slider is slided, the map should be refreshed
            slide: function( event, ui ) {

                var newGeoJson = {
                    "type" : "Feature Collection",
                    "features": []
                };
                let startYear = ui.values[ 0 ];
                let endYear = ui.values[ 1 ];

                $( "#amount" ).val( startYear + " - " + endYear );

                for (let i = 0; i < GEOJSON["features"].length; i++){
                    if (GEOJSON["features"][i]["properties"]["Date"] >= startYear && GEOJSON["features"][i]["properties"]["Date"] <= endYear) {  // will change "id" to "year"
                        newGeoJson["features"].push(GEOJSON["features"][i])
                    }
                }
                renderPinsFromJson(accommodation_markers,newGeoJson);
            }
        });
        //initial display
        $( "#amount" ).val(
             $( "#slider-range" ).slider( "values", 0 ) + " - " + $( "#slider-range" ).slider( "values", 1 )
        );
    } );


    // RENDER THE MAP

    // Rheagan's piece: use a variable for the 1920 tile set
    var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });


    var map = L.map('map', {
        layers: [OpenStreetMap_BlackAndWhite]
    });



    // zoom and center in The pace
    map.setView([42.2718, -83.7436], 14);

    // cluster points on the map
    var accommodation_markers = initialMarkerClusters(1);
    // var event_markers = initialMarkerClusters(2);
    var markers = {
                    "accommodation_markers": accommodation_markers,
                    // "event_markers": event_markers
                }

    //GET THE INITIAL PINS
    renderPinsFromURL(accommodation_markers, originalGeoJsonURL);

    // renderNarrativePins(event_markers, "data/final_narrative_data.geojson");



    d3.selectAll("input[type=checkbox]").on("change", function(d) {

        var showPins = this.checked;
        var theMarker = markers[this.value];

        if(showPins){
            map.addLayer(theMarker);
        } else{
            map.removeLayer(theMarker);
        }
    });
