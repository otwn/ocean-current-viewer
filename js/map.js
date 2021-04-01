(function () {
  var endDate = new Date();
  endDate.setUTCMinutes(30, 0, 0); // due to a UCSD's new setting
  console.log(moment(endDate).format());

  var map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: false,
    zoom: 6,
    center: [25.7, -89.8],
    // drawControl: true,
    // timeDimension: true,
    // timeDimensionOptions: {
    //   timeInterval:
    //     moment(endDate).subtract(1, "days").format() +
    //     "/" +
    //     moment(endDate).format(),
    //   period: "PT1H",
    //   currentTime: endDate,
    // },
    // timeDimensionControl: true,
    // timeDimensionControlOptions: {
    //   autoPlay: true,
    //   playerOptions: {
    //     buffer: 10,
    //     transitionTime: 500,
    //     loop: true,
    //   },
    // }
  });

  // ================================================================
  // Basemap Layers
  // ================================================================
  //let topo = L.esri.basemapLayer("Topographic");
  var darkGray = L.esri.basemapLayer("DarkGray", {
    detectRetina: false,
  });
  var esriOcean = L.layerGroup([
    L.esri.basemapLayer("Oceans"),
    L.esri.basemapLayer("OceansLabels"),
  ]);
  var esriImage = L.layerGroup([
    L.esri.basemapLayer("Imagery"),
    L.esri.basemapLayer("ImageryLabels"),
  ]).addTo(map);
  var esriImageFirefly = L.layerGroup([
    L.esri.basemapLayer("ImageryFirefly"),
    L.esri.basemapLayer("ImageryLabels"),
  ]);
  const googleRoads = L.gridLayer
      .googleMutant({
      type: "roadmap" // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
      });
  const googleHybrid = L.gridLayer
      .googleMutant({
      type: "hybrid"
      });
  // ================================================================
  /* grouping basemap layers */
  // ================================================================
  var basemapLayers = {
    //  "Topographic": topo,
    Ocean: esriOcean,
    Imagery: esriImage,
    "Imagery(Firefly)": esriImageFirefly,
    "Dark Gray": darkGray,
    "Google Road": googleRoads,
    "Google Hybrid": googleHybrid
  };
  // ================================================================
  // Ancillary Data Layers - Top Corner Layers Group
  // ================================================================
  const forecastPosition = L.esri.featureLayer({
    url:"https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/Active_Hurricanes_v1/FeatureServer/0"
  });
  const observedPosition = L.esri.featureLayer({
    url:"https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/Active_Hurricanes_v1/FeatureServer/1"
  });
  const forecastTrack = L.esri.featureLayer({
    url:"https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/Active_Hurricanes_v1/FeatureServer/2"
  });
  const observedTrack = L.esri.featureLayer({
    url:"https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/Active_Hurricanes_v1/FeatureServer/3"
  });
  const forecastErrorCone = L.esri.featureLayer({
    url:"https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/Active_Hurricanes_v1/FeatureServer/4"
  });
  const watchesWarnings = L.esri.featureLayer({
    url:"https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/Active_Hurricanes_v1/FeatureServer/5"
  });

  var activeHurricane = L.featureGroup([forecastPosition, observedPosition, forecastTrack, observedTrack, forecastErrorCone, watchesWarnings]).addTo(map);     
  activeHurricane.bindPopup(function(layer){
    // console.log("layer:", layer);
    return '<h3>'+layer.feature.properties.STORMNAME+'</h3><h4>Type: '+layer.feature.properties.STORMTYPE+'</h4>';
  }).on("click", function(e){
      // console.log("e: ", e);
      return '<h3>'+e.layer.feature.properties.STORMNAME+'</h3><h4>Type: '+e.layer.feature.properties.STORMTYPE+'</h4>';

  });


  var recentHurricaneESRI = L.esri.featureLayer({
    url:
      "https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/Recent_Hurricanes_v1/FeatureServer/1",
    style: function(feature){
      // console.log(feature);
      var c, w, o = 0.75;
      if (feature.properties.STORMTYPE == "Hurricane5"){
        c = "#000000";
        w = 10
      }
      if (feature.properties.STORMTYPE == "Hurricane4"){
        c = "rgb(230,0,0)";
        w = 8
      }
      if (feature.properties.STORMTYPE == "Hurricane3"){
        c = "rgb(255,170,0)";
        w = 7
      }
      if (feature.properties.STORMTYPE == "Hurricane2"){
        c = "rgb(255,255,0)";
        w = 6
      }
      if (feature.properties.STORMTYPE == "Hurricane1"){
        c = "rgb(85,255,0)";
        w = 5
      }
      if (feature.properties.STORMTYPE == "Tropical Storm"){
        c = "rgb(0, 197,255)";
        w = 4
      }
      if (feature.properties.STORMTYPE == "Tropical Depression"){
        c = "rgb(255,115,223)";
        w = 3
      }
      return {
        color: c,
        opacity: o,
        weight: w
      };
    }
  });
  recentHurricaneESRI.bindPopup(function(layer) {
    return L.Util.template(
      "<b>Name: {STORMNAME}</b><br>Category: {STORMTYPE}",
      layer.feature.properties
    );
  });

  var histHurricaneTrack = L.esri.featureLayer({
    url:
      "https://services1.arcgis.com/VAI453sU9tG9rSmh/arcgis/rest/services/Historic_Major_Hurricane_Tracks/FeatureServer/0",
    where: "wmo_wind > 95",
    style: function(feature) {
      var c, w, o = 0.75;
      if (feature.properties.wmo_wind >= 137) {
        c = "rgb(0,0,0)";
        w = 5;
      }
      if (
        feature.properties.wmo_wind < 136 &&
        feature.properties.wmo_wind >= 112
      ) {
        c = "rgb(230,0,0)";
        w = 4;
      }
      return {
        color: c,
        opacity: o,
        weight: w
      };
    }
  });
  histHurricaneTrack.bindPopup(function(layer) {
    return L.Util.template(
      "<b>Historic Hurricane Tracks</b><br>Category 5: Black<br>Category 4: Red<hr><b>{Name}</b><br>{ISO_time}<br>Wind Speed: {wmo_wind} kt",
      layer.feature.properties
    );
  });

  /* GCOOS Stations */
  var stationIcon = L.divIcon({
    className: "station-div-icon",
  });
  var gcoosAssets = L.esri.featureLayer({
    url: "https://services1.arcgis.com/qr14biwnHA6Vis6l/ArcGIS/rest/services/The_GCOOS_Region/FeatureServer/0",
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: stationIcon,
        riseOnHover: true,
      });
    },
    ignoreRenderer: true
  }).addTo(map);
  gcoosAssets.bindPopup(function (layer) {
    // console.log(layer);
    var url = layer.feature.properties.urn.substring(4,)
    return L.Util.template(
      "<h3>{station}</h3><h4>{organization}</h4>" +
      "<table>" +
      "<tr><td>URN: </td><td>{urn}</td></tr>" +
      "<tr><td>Description: </td><td>{description}</td></tr>" +
      "<tr><td>Link: <a href='https://data.gcoos.org/monitoring.php?station=" + url + "' target='_blank'>Open</a></td></tr>" + 
      "</table>",
      layer.feature.properties
    );
  });

  var currentsIcon = L.divIcon({
      className: "currents-div-icon",
  });
  var adcpStations = L.esri.featureLayer({
      url: "https://services1.arcgis.com/qr14biwnHA6Vis6l/ArcGIS/rest/services/Gulf_Ocean_Currents_Observing_Stations/FeatureServer/0",
      pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {
              icon: currentsIcon,
              riseOnHover: true,
          });
      },
      ignoreRenderer: true
  }).addTo(map);
  adcpStations.bindPopup(function (layer) {
    var url = layer.feature.properties.urn
    return L.Util.template(
      "<h3>{station}</h3><h4>{organization}</h4>" +
      "<table>" +
      "<tr><td>URN: </td><td>{urn}</td></tr>" +
      "<tr><td>Description: </td><td>{description}</td></tr>" +
      "<tr><td>Link: <a href='https://data.gcoos.org/monitoring.php?station=" + url + "' target='_blank'>Open</a></td></tr>" + 
      "</table>",
      layer.feature.properties
    );
  });

      var singleStationIcon = L.divIcon({
          className: "single-station-div-icon",
      });
      var stonesDataLayer = L.esri.featureLayer({
          url: "https://services1.arcgis.com/qr14biwnHA6Vis6l/ArcGIS/rest/services/Gulf_Ocean_Currents_Observing_Stations/FeatureServer/0",
          pointToLayer: function (feature, latlng) {
              return L.marker(latlng, {
                  icon: singleStationIcon,
                  riseOnHover: true,
              });
          },
          ignoreRenderer: true,
      }).addTo(map);
      stonesDataLayer.setWhere("station='42395'");
      // stonesDataLayer.addTo(map);
      stonesDataLayer.bindPopup(function (layer) {
          return L.Util.template(
              "<h3>{station}</h3><h4>{organization}</h4>" +
              "<table>" +
              "<tr><td>URN: </td><td>{urn}</td></tr>" +
              "<tr><td>Description: </td><td>{description}</td></tr>" +
              "</table>" +
              "<br>" +
              "<a href='https://stonesdata.tamucc.edu/browse_atm.php' target='_blank'>Stones MetOcean Observatory</a>",
              layer.feature.properties
          );
      });

  // ================================================================
  /* grouping ancillary data layers */
  // ================================================================
  var groupedOverlay = {
    "ADCP Stations": adcpStations,
    "Gulf of Mexico Coastal Ocean Observing System": gcoosAssets,
    "Stones MetOcean Observatory": stonesDataLayer,
    'Active Hurricane <img style="height:400px;" src="https://geo.gcoos.org/data/images/hurricane_legend.png" />': activeHurricane,
    "Recent Hurricanes/Tropical Storms": recentHurricaneESRI,
    "Historic Hurricane Track": histHurricaneTrack
  };
  var controlLayers = L.control
    .layers(basemapLayers, groupedOverlay, {
      position: "bottomleft",
      collapsed: true,
    })
    .addTo(map);
  // Full screen control
  map.addControl(new L.Control.Fullscreen());

  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);
  var drawControl = new L.Control.Draw({
    edit: {
      featureGroup: drawnItems
    },
    draw: {
      polyline: {
        metric: false,
        feet: false,
      },
      polygon: false,
      rectangle: false,
      circle: false,
      marker: false
    },

  });
  map.addControl(drawControl);

  // Hycom Ocean Current
  function addHycom() {
    d3.json("https://geo.gcoos.org/data/hycom/hycom_surface_current.json").then(
      function (data) {
        var velocityLayer = L.velocityLayer({
          displayValues: true,
          displayOptions: {
            velocityType: "water",
            displayPosition: "bottomleft",
            displayEmptyString: "No water data",
          },
          data: data,
          maxVelocity: 2.5,
          velocityScale: 0.2, // arbitrary default 0.005
        }).addTo(map);

        controlLayers.addOverlay(velocityLayer, "HYCOM Ocean Current");
      }
    );
  }
  addHycom();

  // Set layers which redraw in a certain period
  setInterval(function () {
    onDragEnd();
    controlLayers.removeLayer(velocityLayer);
    addHycom();
  }, 360000);
})();