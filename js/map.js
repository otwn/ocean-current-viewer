(function () {
  var map = L.map("map", {
    zoomControl: false,
    //scrollWheelZoom: false,
    zoom: 6,
    center: [25.7, -89.8]
  });

  // ================================================================
  // Basemap Layers
  // ================================================================
  //let topo = L.esri.basemapLayer("Topographic");
  var darkGray = L.esri.basemapLayer("DarkGray", {
    detectRetina: false
  });
  var esriOcean = L.layerGroup([
    L.esri.basemapLayer("Oceans"),
    L.esri.basemapLayer("OceansLabels")
  ]);
  var esriImage = L.layerGroup([
    L.esri.basemapLayer("Imagery"),
    L.esri.basemapLayer("ImageryLabels")
  ]);
  var esriImageFirefly = L.layerGroup([
    L.esri.basemapLayer("ImageryFirefly"),
    L.esri.basemapLayer("ImageryLabels")
  ]).addTo(map);

  // ================================================================
  /* grouping basemap layers */
  // ================================================================
  var basemapLayers = {
    //  "Topographic": topo,
    Ocean: esriOcean,
    Imagery: esriImage,
    "Imagery(Firefly)": esriImageFirefly,
    "Dark Gray": darkGray
  };
  // ================================================================
  // Ancillary Data Layers - Top Corner Layers Group
  // ================================================================
  var currentsNOAA = L.esri.dynamicMapLayer({
    url: "https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/guidance_model_ocean_grtofs_time/MapServer"
  });

  var stationIcon = L.divIcon({
    className: "station-div-icon"
  });

  var gcoosAssets = L.esri.featureLayer({
    url: "https://gis.gcoos.org/arcgis/rest/services/Stations/The_GCOOS_Region/FeatureServer/0",
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: stationIcon,
        riseOnHover: true
      });
    }
  });
  gcoosAssets.bindPopup(function (layer) {
    return L.Util.template(
      "<h2>{station}</h2><h3>{organization}</h3>" +
      "<table>" +
      "<tr><td>URN: </td><td>{urn}</td></tr>" +
      "<tr><td>Description: </td><td>{description}</td></tr>" +
      "</table>",
      layer.feature.properties
    );
  });

  var currentsIcon = L.divIcon({
    className: "currents-div-icon"
  });
  var adcpStations = L.esri
    .featureLayer({
      url: "https://services1.arcgis.com/qr14biwnHA6Vis6l/ArcGIS/rest/services/Gulf_Ocean_Currents_Observing_Stations/FeatureServer/0",
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: currentsIcon,
          riseOnHover: true
        });
      }
    }).addTo(map);
  adcpStations.bindPopup(function (layer) {
    return L.Util.template(
      "<h1>{station}</h1><h2>{organization}</h2>" +
      "<table>" +
      "<tr><td>URN: </td><td>{urn}</td></tr>" +
      "<tr><td>Description: </td><td>{description}</td></tr>" +
      "</table>",
      layer.feature.properties
    );
  });

  var singleStationIcon = L.divIcon({
    className: "single-station-div-icon"
  });
  // var singleStation = [];
  // var resultLayer = L.esri
  //   .query({
  //     url: "https://gis.gcoos.org/arcgis/rest/services/Stations/The_GCOOS_Region/FeatureServer/0"
  //   })
  //   .where("station='42395'")
  //   .run(function (error, oneStation) {
  //     singleStation = L.geoJSON(oneStation, {
  //       pointToLayer: function (feature, latlng) {
  //         return L.marker(latlng, {
  //           icon: singleStationIcon
  //         });
  //       }
  //     });
  //     singleStation.bindPopup(function (layer) {
  //       return L.Util.template(
  //         "<h1>{station}</h1><h2>{organization}</h2>" +
  //         "<table>" +
  //         "<tr><td>URN: </td><td>{urn}</td></tr>" +
  //         "<tr><td>Description: </td><td>{description}</td></tr>" +
  //         "</table>",
  //         layer.feature.properties
  //       );
  //     });
  //   });
  var stonesDataLayer = L.esri
    .featureLayer({
      url: "https://services1.arcgis.com/qr14biwnHA6Vis6l/ArcGIS/rest/services/Gulf_Ocean_Currents_Observing_Stations/FeatureServer/0",
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: singleStationIcon,
          riseOnHover: true
        });
      }
    });
  stonesDataLayer.setWhere("station='42395'");
  stonesDataLayer.addTo(map);
  stonesDataLayer.bindPopup(function (layer) {
    return L.Util.template(
      "<h1>{station}</h1><h2>{organization}</h2>" +
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
    "Gulf of Mexico Coastal Ocean Observation System": gcoosAssets,
    "Stones MetOcean Observatory": stonesDataLayer,
    "NOAA NWS NCEP Global Real-Time Ocean Forecast System (RTOFS)": currentsNOAA,
  };
  var controlLayers = L.control
    .layers(basemapLayers, groupedOverlay, {
      position: "bottomleft",
      collapsed: true
    })
    .addTo(map);
  // Full screen control
  map.addControl(new L.Control.Fullscreen());

  // Hycom Ocean Current
  function addHycom() {
    d3.json("https://geo.gcoos.org/data/hycom/hycom_surface_current.json").then(
      function (data) {
        var velocityLayer = L.velocityLayer({
          displayValues: true,
          displayOptions: {
            velocityType: "water",
            displayPosition: "bottomleft",
            displayEmptyString: "No water data"
          },
          data: data,
          maxVelocity: 2.5,
          velocityScale: 0.1 // arbitrary default 0.005
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