import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class Map extends Component {
  @service router;
  @tracked selectedLocation;

  onClick(itemToCompare) {
    if (this.selectedLocation === itemToCompare) {
      console.log('Double Clicked: ' + this.selectedLocation);
      if (this.selectedLocation == "Lao People's Democratic Republic") {
        this.router.transitionTo('add', 'Laos');
      } else if (this.selectedLocation == 'Palestinian Territories') {
        this.router.transitionTo('add', 'Palestine');
      } else {
        this.router.transitionTo('add', this.selectedLocation);
      }
    } else {
      this.selectedLocation = itemToCompare;
      console.log('Selected Location: ' + this.selectedLocation);
    }
  }

  @action
  async initializeMap() {
    var map = L.map('map').setView([37.8, -96], 4); // focuses on us

    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    var statesData = await fetch('/us-states.json').then((res) => res.json()); // GeoJSON data in public folder, got from github
    L.geoJson(statesData).addTo(map); //adds geojson to map for every state

    // adds color based on density
    function getColor(d) {
      return d > 1000
        ? '#97b6e8'
        : d > 500
          ? '#5b8bd9'
          : d > 200
            ? '#5b8bd9'
            : d > 100
              ? '#79a1e0'
              : d > 50
                ? '#3f77d1'
                : d > 20
                  ? '#2f6bcc'
                  : d > 10
                    ? '#2e66bf'
                    : '#285cb0';
    }

    function style(feature) {
      return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
      };
    }

    L.geoJson(statesData, { style: style }).addTo(map); //colors the map in

    // This section defines interaction
    var geojson;

    function highlightFeature(e) {
      //mouseover event, highlights the state
      var layer = e.target;

      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7,
      });

      layer.bringToFront();
    }

    function resetHighlight(e) {
      //mouseout
      geojson.resetStyle(e.target);
    }

    const clickAndzoomToFeature = (e) => {
      map.fitBounds(e.target.getBounds());

      this.onClick(e.target.feature.properties.name);
    };

    function onEachFeature(feature, layer) {
      // setting each listener
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: clickAndzoomToFeature,
      });
    }

    geojson = L.geoJson(statesData, {
      //applying it to the map
      style: style,
      onEachFeature: onEachFeature,
    }).addTo(map);
  }

  @action
  currentLocation() {
    const element = document.getElementById('currentLocation');
    element.innerText = this.selectedLocation;
  }

  @action
  initGlobe() {
    //https://www.amcharts.com/demos/rotate-globe-to-a-selected-country/
    am5.ready(
      function () {
        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new('chartdiv');

        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([am5themes_Animated.new(root)]);

        // Create the map chart
        // https://www.amcharts.com/docs/v5/charts/map-chart/
        var chart = root.container.children.push(
          am5map.MapChart.new(root, {
            panX: 'rotateX',
            panY: 'rotateY',
            projection: am5map.geoOrthographic(),
            paddingBottom: 20,
            paddingTop: 20,
            paddingLeft: 20,
            paddingRight: 20,
          }),
        );

        // Create main polygon series for countries
        // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
        var polygonSeries = chart.series.push(
          am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            fill: am5.color(0x88abe3), // Color of the countries
            stroke: am5.color(0x285cb0), // color of the country borders
          }),
        );

        polygonSeries.mapPolygons.template.setAll({
          tooltipText: '{name}',
          toggleKey: 'active',
          interactive: true,
        });

        polygonSeries.mapPolygons.template.states.create('hover', {
          fill: root.interfaceColors.get('primaryButtonHover'),
        });

        polygonSeries.mapPolygons.template.states.create('active', {
          fill: root.interfaceColors.get('primaryButtonHover'),
        });

        // Create series for background fill
        // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
        var backgroundSeries = chart.series.push(
          am5map.MapPolygonSeries.new(root, {}),
        );
        backgroundSeries.mapPolygons.template.setAll({
          fill: root.interfaceColors.get('alternativeBackground'),
          fillOpacity: 0.1,
          strokeOpacity: 0,
        });
        backgroundSeries.data.push({
          geometry: am5map.getGeoRectangle(90, 180, -90, -180),
        });

        var graticuleSeries = chart.series.unshift(
          am5map.GraticuleSeries.new(root, {
            step: 10,
          }),
        );

        graticuleSeries.mapLines.template.set('strokeOpacity', 0.1);

        // Set up events
        var previousPolygon;

        polygonSeries.mapPolygons.template.on(
          'active',
          function (active, target) {
            if (previousPolygon && previousPolygon != target) {
              previousPolygon.set('active', false);
            }
            if (target.get('active')) {
              selectCountry(target.dataItem.get('id'));
              this.onClick(
                polygonSeries.getDataItemById(target.dataItem.get('id'))
                  .dataContext.name,
              );
              this.currentLocation();
            }
            previousPolygon = target;
          }.bind(this),
        );

        function selectCountry(id) {
          var dataItem = polygonSeries.getDataItemById(id); //dataItem.dataContext.id gets the country code

          var target = dataItem.get('mapPolygon');
          if (target) {
            var centroid = target.geoCentroid();
            if (centroid) {
              chart.animate({
                key: 'rotationX',
                to: -centroid.longitude,
                duration: 1500,
                easing: am5.ease.inOut(am5.ease.cubic),
              });
              chart.animate({
                key: 'rotationY',
                to: -centroid.latitude,
                duration: 1500,
                easing: am5.ease.inOut(am5.ease.cubic),
              });
            }
          }
        }

        // Uncomment this to pre-center the globe on a country when it loads
        //polygonSeries.events.on("datavalidated", function() {
        //  selectCountry("AU");
        //});

        // Make stuff animate on load
        chart.appear(1000, 100);
      }.bind(this),
    ); // end am5.ready()
  }
}
