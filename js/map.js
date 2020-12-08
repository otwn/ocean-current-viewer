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

  // var proxy = "proxy.php";
  // var hf6kmWMS =
  //   "https://hfrnet-tds.ucsd.edu/thredds/wms/HFR/USEGC/6km/hourly/GNOME/HFRADAR,_US_East_and_Gulf_Coast,_6km_Resolution,_Hourly_RTV_(GNOME)_best.ncd";
  // var hfradar6kmLayer = L.nonTiledLayer.wms(hf6kmWMS, {
  //   layers: "surface_sea_water_velocity",
  //   format: "image/png",
  //   transparent: true,
  //   styles: "linevec/rainbow",
  //   markerscale: 15,
  //   markerspacing: 6,
  //   numcolorbands: 10,
  //   abovemaxcolor: "extend",
  //   belowmincolor: "extend",
  //   colorscalerange: "0,1.5",
  //   attribution: "HF RADAR",
  // });
  // var tdhfradar6kmLayer = L.timeDimension.layer
  //   .wms(hfradar6kmLayer, {
  //     proxy: proxy,
  //     cache: 25,
  //     cacheBackward: 25,
  //     cacheForward: 25,
  //     updateTimeDimension: false,
  //   })
  //   .addTo(map);

  // // HFRadar 2km Hourly
  // var hf2kmWMS =
  //   "https://hfrnet-tds.ucsd.edu/thredds/wms/HFR/USEGC/2km/hourly/GNOME/HFRADAR,_US_East_and_Gulf_Coast,_2km_Resolution,_Hourly_RTV_(GNOME)_best.ncd";
  // var hfradar2kmLayer = L.nonTiledLayer.wms(hf2kmWMS, {
  //   layers: "surface_sea_water_velocity",
  //   format: "image/png",
  //   transparent: true,
  //   styles: "linevec/rainbow",
  //   markerscale: 15,
  //   markerspacing: 6,
  //   numcolorbands: 10,
  //   abovemaxcolor: "extend",
  //   belowmincolor: "extend",
  //   colorscalerange: "0,1.5",
  //   attribution: "HF RADAR",
  // });
  // var tdhfradar2kmLayer = L.timeDimension.layer.wms(hfradar2kmLayer, {
  //   proxy: proxy,
  //   cache: 25,
  //   cacheBackward: 25,
  //   cacheForward: 25,
  //   updateTimeDimension: false,
  // });

  // // HFRadar 1km Hourly
  // var hf1kmWMS =
  //   "https://hfrnet-tds.ucsd.edu/thredds/wms/HFR/USEGC/1km/hourly/GNOME/HFRADAR,_US_East_and_Gulf_Coast,_1km_Resolution,_Hourly_RTV_(GNOME)_best.ncd";
  // var hfradar1kmLayer = L.nonTiledLayer.wms(hf1kmWMS, {
  //   layers: "surface_sea_water_velocity",
  //   format: "image/png",
  //   transparent: true,
  //   styles: "linevec/rainbow",
  //   markerscale: 15,
  //   markerspacing: 6,
  //   numcolorbands: 10,
  //   abovemaxcolor: "extend",
  //   belowmincolor: "extend",
  //   colorscalerange: "0,1.5",
  //   attribution: "HF RADAR",
  // });
  // var tdhfradar1kmLayer = L.timeDimension.layer.wms(hfradar1kmLayer, {
  //   proxy: proxy,
  //   cache: 25,
  //   cacheBackward: 25,
  //   cacheForward: 25,
  //   updateTimeDimension: false,
  // });

  var activeHurricane = L.esri.dynamicMapLayer({
    url: "https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer",
    opacity: 0.9
  });

  var activeHurricaneESRI = L.esri.dynamicMapLayer({
    url: "https://utility.arcgis.com/usrsvcs/servers/6c6699e853424b22a8618f00d8e0cf81/rest/services/LiveFeeds/Hurricane_Active/MapServer",
    f: "image/png",
    transparent: true,
    opacity: 0.7,
  });
  activeHurricaneESRI.bindPopup(function (error, featureCollection) {
    if (error || featureCollection.features.length === 0) {
      return false;
    } else {
      console.log(featureCollection);
      ppt = featureCollection.features[2].properties;
      popup =
        "Name: " +
        ppt.STORMNAME +
        "<br>" +
        "Storm Type: " +
        ppt.STORMTYPE +
        "<br>" +
        "Storm ID: " +
        ppt.STORMID +
        "<br>" +
        "Date: " +
        ppt.DTG +
        "<br>" +
        "Intensity: " +
        ppt.INTENSITY +
        " knots<br>" +
        ppt.INTENSITY * 1.151 +
        " mph/ " +
        ppt.INTENSITY * 1.852 +
        " kmh <br>" +
        "Latitude/Longitude: " +
        ppt.LAT +
        "/" +
        ppt.LON +
        "<br>";
      return popup;
    }
  });

  var recentHurricaneESRI = L.esri.dynamicMapLayer({
    url: "https://utility.arcgis.com/usrsvcs/servers/c10892ebdbf8428e939f601c2acae7e4/rest/services/LiveFeeds/Hurricane_Recent/MapServer",
    f: "image/png",
  });
  recentHurricaneESRI.bindPopup(function (error, featureCollection) {
    if (error || featureCollection.features.length === 0) {
      return false;
    } else {
      console.log(featureCollection);
      ppt = featureCollection.features[2].properties;
      popup =
        "Name: " +
        ppt.STORMNAME +
        "<br>" +
        "Storm Type: " +
        ppt.STORMTYPE +
        "<br>" +
        "Storm ID: " +
        ppt.STORMID +
        "<br>" +
        "Date: " +
        ppt.DTG +
        "<br>" +
        "Intensity: " +
        ppt.INTENSITY +
        " knots<br>" +
        ppt.INTENSITY * 1.151 +
        " mph/ " +
        ppt.INTENSITY * 1.852 +
        " kmh <br>" +
        "Latitude/Longitude: " +
        ppt.LAT +
        "/" +
        ppt.LON +
        "<br>";
      return popup;
    }
  });

  var histHurricaneTrack = L.esri.featureLayer({
    url: "https://services1.arcgis.com/VAI453sU9tG9rSmh/arcgis/rest/services/Historic_Major_Hurricane_Tracks/FeatureServer/0",
    where: "wmo_wind > 95",
    style: function (feature) {
      var c,
        w,
        o = 0.75;

      if (feature.properties.wmo_wind >= 137) {
        c = "#FF0000";
        w = 5;
      }
      if (
        feature.properties.wmo_wind < 136 &&
        feature.properties.wmo_wind >= 112
      ) {
        c = "#FFEB00";
        w = 3;
      }
      return {
        color: c,
        opacity: o,
        weight: w,
      };
    },
  });
  histHurricaneTrack.bindPopup(function (layer) {
    return L.Util.template(
      "<b>Historic Major Hurricane Tracks</b><hr><b>{Name}</b><br>{ISO_time}<br>Wind Speed: {wmo_wind} kt",
      layer.feature.properties
    );
  });

  var currentsNOAA = L.esri.dynamicMapLayer({
    url: "https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/guidance_model_ocean_grtofs_time/MapServer",
  });

  var stationIcon = L.divIcon({
    className: "station-div-icon",
  });
  var gcoosAssets = L.esri.featureLayer({
    url: "https://gis.gcoos.org/arcgis/rest/services/Stations/The_GCOOS_Region/FeatureServer/0",
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: stationIcon,
        riseOnHover: true,
      });
    },
  });
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
  var adcpStations = L.esri
    .featureLayer({
      url: "https://services1.arcgis.com/qr14biwnHA6Vis6l/ArcGIS/rest/services/Gulf_Ocean_Currents_Observing_Stations/FeatureServer/0",
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: currentsIcon,
          riseOnHover: true,
        });
      },
    })
    .addTo(map);
  adcpStations.bindPopup(function (layer) {
    return L.Util.template(
      "<h2>{station}</h2><h3>{organization}</h3>" +
      "<table>" +
      "<tr><td>URN: </td><td>{urn}</td></tr>" +
      "<tr><td>Description: </td><td>{description}</td></tr>" +
      "<tr><td>Link: <a href='https://data.gcoos.org/monitoring.php?station={urn}' target='_blank'>Open</a></td></tr>" + 
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
  });
  stonesDataLayer.setWhere("station='42395'");
  stonesDataLayer.bindPopup(function (layer) {
    return L.Util.template(
      "<h2>{station}</h2><h3>{organization}</h3>" +
      "<table>" +
      "<tr><td>URN: </td><td>{urn}</td></tr>" +
      "<tr><td>Description: </td><td>{description}</td></tr>" +
      "</table>" +
      "<br>" +
      "<a href='https://stonesdata.tamucc.edu/browse_atm.php' target='_blank'>Stones MetOcean Observatory</a>",
      layer.feature.properties
    );
  });
  stonesDataLayer.addTo(map);

  // ================================================================
  /* grouping ancillary data layers */
  // ================================================================
  var groupedOverlay = {
    "ADCP Stations": adcpStations,
    "Gulf of Mexico Coastal Ocean Observing System": gcoosAssets,
    "Stones MetOcean Observatory": stonesDataLayer,
    "Current Hurricane (<a href='https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer/legend' target='_blank'>*legend</a>)": activeHurricane,
    "Recent Hurricanes/Tropical Storms": recentHurricaneESRI,
    "Historic Hurricane Track: H4(Yellow), H5(Red)": histHurricaneTrack,
    "NOAA NWS NCEP Global Real-Time Ocean Forecast System (RTOFS) (<a href='https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/guidance_model_ocean_grtofs_time/MapServer' target='_blank'>*background</a>)": currentsNOAA,
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
          velocityScale: 0.1, // arbitrary default 0.005
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