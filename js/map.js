(function() {
  const map = L.map("map", {
    zoomControl: false,
    //scrollWheelZoom: false,
    zoom: 6,
    center: [25.7, -89.8]
  });

  // ================================================================
  // Basemap Layers
  // ================================================================
  //let topo = L.esri.basemapLayer("Topographic");
  let darkGray = L.esri.basemapLayer("DarkGray", {
    detectRetina: false
  });
  let esriOcean = L.layerGroup([
    L.esri.basemapLayer("Oceans"),
    L.esri.basemapLayer("OceansLabels")
  ]);
  let esriImage = L.layerGroup([
    L.esri.basemapLayer("Imagery"),
    L.esri.basemapLayer("ImageryLabels")
  ]);
  let esriImageFirefly = L.layerGroup([
    L.esri.basemapLayer("ImageryFirefly"),
    L.esri.basemapLayer("ImageryLabels")
  ]).addTo(map);

  // ================================================================
  /* grouping basemap layers */
  // ================================================================
  const basemapLayers = {
    //  "Topographic": topo,
    Ocean: esriOcean,
    Imagery: esriImage,
    "Imagery(Firefly)": esriImageFirefly,
    "Dark Gray": darkGray
  };
  // ================================================================
  // Ancillary Data Layers - Top Corner Layers Group
  // ================================================================
  var windESRI = L.esri.dynamicMapLayer({
    url:
      "https://utility.arcgis.com/usrsvcs/servers/f986fb492f2347d8b077df0236229db0/rest/services/LiveFeeds/NOAA_METAR_current_wind_speed_direction/MapServer",
    opacity: 0.8,
    f: "image/png"
  });

  var activeHurricaneESRI = L.esri.dynamicMapLayer({
    url:
      "https://utility.arcgis.com/usrsvcs/servers/6c6699e853424b22a8618f00d8e0cf81/rest/services/LiveFeeds/Hurricane_Active/MapServer",
    f: "image/png"
  });

  var recentHurricaneESRI = L.esri.dynamicMapLayer({
    url:
      "https://utility.arcgis.com/usrsvcs/servers/c10892ebdbf8428e939f601c2acae7e4/rest/services/LiveFeeds/Hurricane_Recent/MapServer",
    f: "image/png"
  });

  var nrl26cIsotherm = L.tileLayer
    .wms("http://gcoos-mdv.gcoos.org:8080/ncWMS/wms", {
      layers: "NRL_MEAN/Isotherm",
      format: "image/png",
      transparent: true,
      attribution: "GCOOS-RA, NRL",
      opacity: 0.7
    })
    .addTo(map);

  var ssh = L.tileLayer.wms("http://gcoos-mdv.gcoos.org:8080/ncWMS/wms", {
    layers: "EDDY_SSH/ssh",
    format: "image/png",
    transparent: true,
    attribution: "GCOOS-RA, NRL",
    opacity: 0.7
  });

  var currentsNOAA = L.esri.dynamicMapLayer({
    url:
      "https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/guidance_model_ocean_grtofs_time/MapServer"
  });

  var stationIcon = L.divIcon({
    className: "station-div-icon"
  });

  var gcoosAssets = L.esri
    .featureLayer({
      url:
        "https://gis.gcoos.org/arcgis/rest/services/Stations/The_GCOOS_Region/FeatureServer/0",
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {
          icon: stationIcon,
          riseOnHover: true
        });
      }
    })
    .addTo(map);
  gcoosAssets.bindPopup(function(layer) {
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
      url:
        "https://services1.arcgis.com/qr14biwnHA6Vis6l/ArcGIS/rest/services/Gulf_Ocean_Currents_Observing_Stations/FeatureServer/0",
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {
          icon: currentsIcon,
          riseOnHover: true
        });
      }
    })
    .addTo(map);
  adcpStations.bindPopup(function(layer) {
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
  var result = L.esri
    .query({
      url:
        "https://services1.arcgis.com/qr14biwnHA6Vis6l/arcgis/rest/services/GCOOS_Assets_2019_Unique_Stations/FeatureServer/0"
    })
    .where("station='42395'")
    .run(function(error, oneStation) {
      var singleStation = L.geoJSON(oneStation, {
        pointToLayer: function(feature, latlng) {
          return L.marker(latlng, {
            icon: singleStationIcon
          });
        }
      }).addTo(map);
      singleStation.bindPopup(function(layer) {
        return L.Util.template(
          "<h1>{station}</h1><h2>{organization}</h2>" +
            "<table>" +
            "<tr><td>URN: </td><td>{urn}</td></tr>" +
            "<tr><td>Description: </td><td>{description}</td></tr>" +
            "</table>",
          layer.feature.properties
        );
      });
    });

  // ================================================================
  /* grouping ancillary data layers */
  // ================================================================
  const groupedOverlay = {
    "GCOOS Assets 2019": gcoosAssets,
    "ADCP Stations": adcpStations,
    "Active Hurricane": activeHurricaneESRI,
    "Wind Speed": windESRI,
    "NRL Depth 26C Isotherm<a href='http://gcoos-mdv.gcoos.org:8080/ncWMS/godiva2.html?layer=NRL_MEAN/Isotherm&bbox=-98.0,18.0,-79.5145715943338,30.96001434326172' target='_blank'>**</a>": nrl26cIsotherm,
    "Sea Surface Height<a href='http://gcoos-mdv.gcoos.org:8080/ncWMS/godiva2.html?layer=EDDY_SSH/ssh&bbox=-180.0,-66.0,180.0,66.0' target='_blank'>**</a>": ssh,
    "NOAA NWS NCEP Global Real-Time Ocean Forecast System (RTOFS)": currentsNOAA
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
      function(data) {
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
  setInterval(function() {
    onDragEnd();
    controlLayers.removeLayer(velocityLayer);
    addHycom();
  }, 360000);
})();
