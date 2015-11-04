var React = require('react');
var L = require('leaflet');
var cluster = require('leaflet.markercluster');
var d3 = require('d3');
var topojson = require('topojson');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SidebarConstants = require('../constants/SidebarConstants');
var MapConstants = require('../constants/MapConstants');

var AppStore = require('../stores/AppStore');

var SocketActions = require('../actions/SocketActions');
var PlantActions = require('../actions/PlantActions');
var SupplierActions = require('../actions/SupplierActions');
var ApiActions = require('../actions/ApiActions');

function checkVisible(object){
    if(window.localStorage.getItem( object + 'Visible') !== null){
        return window.localStorage.getItem(object + 'Visible') === 'true'
    }else{
        var key = object + 'Visible';
        window.localStorage.setItem(key, true);
        return true
    }
}


var Map = React.createClass({

    plantsShow: checkVisible('plants'),

    supplierShow: checkVisible('suppliers'),

	countries: null,

    countryLayer: null,

    activeCountry: null,

    regionLayer: null,

    plantsLayer: null,

    suppliersLayer: null,

    active: null,

    activeType: '',

    activeName: '',

    plantIcon: L.icon({
	    iconUrl: 'resources/images/plant.png',
	    iconSize:     [50, 50],
	    iconAnchor:   [12, 41],
	    popupAnchor:  [-3, -76]
	}),

	activePlantIcon: L.icon({
	    iconUrl: 'resources/images/activeplant.png',
	    iconSize:     [50, 50],
	    iconAnchor:   [12, 41],
	    popupAnchor:  [-3, -76]
	}),

	supplierIcon: L.icon({
	    iconUrl: 'resources/images/supplier.png',
	    iconSize:     [50, 50],
	    iconAnchor:   [12, 41],
	    popupAnchor:  [-3, -76]
	}),

	activeSupplierIcon: L.icon({
	    iconUrl: 'resources/images/activesupplier.png',
	    iconSize:     [50, 50],
	    iconAnchor:   [12, 41],
	    popupAnchor:  [-3, -76]
	}),

	style: function(feature) {
        return {
            fillColor: '#296291',
            weight: 2,
            opacity: 1,
            color: '#000',
            dashArray: '3',
            fillOpacity: 0.7
        };
    },

    // Load map objects

	loadRegions: function(countryName){
		var me = this;
        d3.json("resources/data/region/" + countryName + ".json", function(error, country) {

            if(error){
                return false;
            }

            me.regionLayer = L.geoJson(topojson.feature(country, country.objects.country).features, {
                style: me.style,
                onEachFeature: function(feature, layer) {
		            layer
		            	.bindPopup("<span class='trigger'>" + feature.properties.name + "</span>")
			            .on({
			                click: me.regionClick
			            });
		        },
                filter: function(feature, layer){
                    return feature.properties.status == 'available'
                }
            }).addTo(me.map);

        });

    },

    loadPlants: function(stateName){

    	var me = this;

        d3.json("resources/data/geo/plants/" + stateName + ".json", function(error, plants) {

            if(error){
                return false;
            }

            me.plantsLayer = new L.MarkerClusterGroup();
            for(var i=0; i< plants.length; i++){
                var coordinates = plants[i]['coordinates'];
                var title = plants[i]['name'];
                var id = plants[i]['id'];
                var marker = L.marker([coordinates[1], coordinates[0]], {icon: me.plantIcon, title: title, id: id})
                    .bindPopup("<span class='trigger'>" + title + "</span>", {offset: L.point(10, -29)})
                    .on('click', me.plantClick)
                me.plantsLayer.addLayer(marker);
            }

            me.map.addLayer(me.plantsLayer);

        });

    },

    loadSuppliers: function(stateName){

    	var me = this;

        d3.json("resources/data/geo/suppliers/" + stateName + ".json", function(error, plants) {

            if(error){
                return false;
            }

            me.suppliersLayer = new L.MarkerClusterGroup();
            for(var i=0; i< plants.length; i++){
                var coordinates = plants[i]['coordinates'];
                var title = plants[i]['name'];
                var id = plants[i]['id'];
                var marker = L.marker([coordinates[1], coordinates[0]], {icon: me.supplierIcon, title: title, id: id})
                    .bindPopup("<span class='trigger'>" + title + "</span>", {offset: L.point(10, -29)})
                    .on('click', me.supplierClick)
                me.suppliersLayer.addLayer(marker);
            }

            me.map.addLayer(me.suppliersLayer);

        });
    },

	//Remove layers

	removeRegions: function(){
		if(this.regionLayer) this.regionLayer.clearLayers();
	},

	removePlants: function(){
		if(this.plantsLayer) this.plantsLayer.clearLayers();
	},

	removeSuppliers: function(){
		if(this.suppliersLayer) this.suppliersLayer.clearLayers();
	},

	//Click calbacks

    countryClick: function(e){
    	var me = this;
    	if(me.activeCountry) me.activeCountry.addTo(me.map);

        me.activeCountry =  me.countryLayer.getLayer(e.target._leaflet_id);

        me.map.fitBounds(e.target.getBounds());

        me.map.removeLayer(me.countryLayer.getLayer(e.target._leaflet_id));

        me.removeRegions();
        me.removePlants();
        me.removeSuppliers();

        var countryName = e.target.feature.properties.name.toLowerCase();

        me.activeType = 'country';
        me.activename = countryName;

        me.loadRegions(countryName);

        var popup = L.popup();

        popup
		    .setLatLng(e.latlng)
		    .setContent("<span class='trigger'>" + countryName + "</span>")
		    .openOn(me.map);

        me.changeState({
        	title: countryName,
            type: 'area',
            help: 'country'
        });

        if(AppStore.isAuth() && !window.localStorage.getItem('countryHelp')){
            SocketActions.emit('getHelp', 'country');
            window.localStorage.setItem('countryHelp', true);
        }

        ApiActions.loadArea('country', countryName);

    },

    regionClick: function(e){
    	var me = this;
		if(me.active){
            d3.select(me.active).classed('active', false);
        }
        var target = e.layer || e.target;
        var clicked = target._container.getElementsByTagName('path')[0];

        d3.select(clicked).classed('active', true);
        me.active = clicked;
        me.activeRegion = e.target.feature.properties.name.toLowerCase();

        me.map.fitBounds(e.target.getBounds());

        var regionName = e.target.feature.properties.name.toLowerCase().replace(/\s/g, '');

        me.activeType = 'region';
        me.activeName = regionName;

        me.removePlants();
        me.removeSuppliers();

        if (me.plantsShow) me.loadPlants(regionName);
        if (me.supplierShow) me.loadSuppliers(regionName);

        this.changeState({
        	title: e.target.feature.properties.name,
            type: 'area',
            help: 'region'
        });

        if(AppStore.isAuth() && !window.localStorage.getItem('regionHelp')){
            SocketActions.emit('getHelp', 'region');
            window.localStorage.setItem('regionHelp', true);
        }

        ApiActions.loadArea('regions', regionName);
    },

    plantClick: function(e){
		var me = this;

    	for(var i in me.plantsLayer._featureGroup._layers){

            if(me.plantsLayer._featureGroup._layers.hasOwnProperty(i)){
                me.plantsLayer._featureGroup._layers[i].setIcon(me.plantIcon);
            }
        }

        e.target.setIcon(me.activePlantIcon);

        if(AppStore.isAuth() && !window.localStorage.getItem('plantHelp')){
            SocketActions.emit('getHelp', 'plant');
            window.localStorage.setItem('plantHelp', true);
        }

        PlantActions.show(e.target.options.title);
        SocketActions.emit("getPlant", e.target.options.id);

    },

    supplierClick: function(e){
    	var me = this;

    	for(var i in me.suppliersLayer._featureGroup._layers){
            if(me.suppliersLayer._featureGroup._layers.hasOwnProperty(i)){
                me.suppliersLayer._featureGroup._layers[i].setIcon(me.supplierIcon);
            }
        }

        e.target.setIcon(me.activeSupplierIcon);

        if(AppStore.isAuth() && !window.localStorage.getItem('supplierHelp')){
            SocketActions.emit('getHelp', 'supplier');
            window.localStorage.setItem('supplierHelp', true);
        }

        SupplierActions.show(e.target.options.title);
        SocketActions.emit("getSupplier", e.target.options.id);
    },

	toGlobal: function(){
		var me = this;

		if (me.activeCountry) me.activeCountry.addTo(me.map);

        this.changeState({
            help: 'global'
        });

        me.removeRegions();
        me.removePlants();
        me.removeSuppliers();
        me.map.fitBounds(me.bounds);
	},

    changeVisible: function(data){
        var me = this;

        if(data.plant !== undefined) me.plantsShow = data['plant'];
        if(data.supplier !== undefined) me.supplierShow = data['supplier'];

        if (me.activeType == 'region'){
            if(me.plantsShow){
				me.removePlants();
                me.loadPlants(me.activeName);
            }else{
                me.removePlants();
            }

            if(me.supplierShow){
				me.removeSuppliers();
                me.loadSuppliers(me.activeName)
            }else{
                me.removeSuppliers();
            }
        }

    },

    test: function(){
        this.changeVisible({
            plant: true,
            supplier: true
        })
    },

	changeState: function(state){
		AppDispatcher.dispatch({
            action: SidebarConstants.SIDEBAR_CHANGE,
            data: state
        });
	},

	openSidebar: function(){
		AppDispatcher.dispatch({
            action: SidebarConstants.SIDEBAR_CHANGE,
            data: {
            	visible: 'visible'
            }
        });
	},

    componentDidMount: function() {

        var me = this;

        document.getElementById('map').addEventListener('click', function(e){
            if ('trigger'.indexOf(e.target.classList) > -1){
                me.openSidebar();
                document.getElementsByClassName('leaflet-popup-close-button')[0].click();
            }
        });

    	var southWest = L.latLng(-90, 180),
            northEast = L.latLng(90, -180);
        this.bounds = L.latLngBounds(southWest, northEast);


        var map = this.map = L.map(this.getDOMNode(), {
            minZoom: 2,
            maxZoom: 18,
            maxBounds: this.bounds,
            zoomControl: false,
            layers: [
                L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		            id: 'examples.map-i875mjb7'
		        })
            ],
            attributionControl: false
        });

        var MapControl = L.Control.extend({
            options: {
                position: 'bottomright'
            },

            onAdd: function (map) {
                var controlDiv = L.DomUtil.create('div', 'map-control visible-control');
                L.DomEvent
                    .addListener(controlDiv, 'click', function (e) {
                        var cont = document.getElementsByClassName('map-control')[0];
                        if(cont.classList.contains('active')){
                            cont.classList.remove('active');
                        }else{
                            cont.classList.add('active');
                        }
                    });



                var plantClassActive = window.localStorage.getItem('plantsVisible') === 'true' ? ' active':'';
                var supplierClassActive = window.localStorage.getItem('suppliersVisible') === 'true' ? ' active':'';

                var plantClass = 'btn-float action-button btn2 icon-plant' + plantClassActive;
                var supplierClass = 'btn-float action-button btn3 icon-logistics' + supplierClassActive;

                var plants = L.DomUtil.create('button', plantClass, controlDiv);
                var suppliers = L.DomUtil.create('button', supplierClass, controlDiv);

                var global = L.DomUtil.create('button', 'btn-float action-button icon-global btn1', controlDiv);
                var help = L.DomUtil.create('button', 'btn-float action-button icon-help btn4', controlDiv);
                var main = L.DomUtil.create('button', 'btn-float main-button icon-setting', controlDiv);


                L.DomEvent.addListener(plants, 'click', function(e){
                    e.stopPropagation();
                    var plantsVisible = window.localStorage.getItem('plantsVisible') === 'true';
                    if(e.target.classList.contains('active')){
                        e.target.classList.remove('active');
                    }else{
                        e.target.classList.add('active');
                    }
                    window.localStorage.setItem('plantsVisible', !plantsVisible);
                    me.changeVisible({
                        plant: !plantsVisible
                    })
                });
                L.DomEvent.addListener(suppliers, 'click', function(e){
                    e.stopPropagation();
                    var suppliersVisible = window.localStorage.getItem('suppliersVisible') === 'true';
                    if(e.target.classList.contains('active')){
                        e.target.classList.remove('active');
                    }else{
                        e.target.classList.add('active');
                    }
                    window.localStorage.setItem('suppliersVisible', !suppliersVisible);
                    me.changeVisible({
                        supplier: !suppliersVisible
                    })
                });

                L.DomEvent.addListener(help, 'click', function(e){
                    SocketActions.emit('getHelp', 'global');
                });

                L.DomEvent.addListener(global, 'click', me.toGlobal);
                return controlDiv;
            }
        });

        map.addControl(new MapControl());


        d3.json("resources/data/geo/world-topo-min.json", function(error, world) {
            countries = L.geoJson(topojson.feature(world, world.objects.countries).features, {
                style: me.style,
                onEachFeature: function(feature, layer){

		            layer
			            .bindPopup("<span class='trigger'>" + feature.properties.name + "</span>", {offset: L.point(10, -29)})
			            .on({
			                click: me.countryClick
			            });

		            layer.addTo(map);
		        },
                filter: function(feature, layer){
                    return feature.properties.status == 'available'
                }
            });

            var res = [];

            for (var key in countries._layers) {
                if (countries._layers.hasOwnProperty(key)) {
                    res.push(countries._layers[key]);
                }
            }

            me.countryLayer = L.layerGroup(res);

        });

        map.fitWorld();


        if(AppStore.isAuth() && !window.localStorage.getItem('globalHelp')){
            SocketActions.emit('getHelp', 'global');
            window.localStorage.setItem('globalHelp', true);
        }

    },
    componentWillUnmount: function() {
        this.map = null;
    },

    render: function() {
        return (
        	<div className='map custom-popup' id="map">

        	</div>
        );
    }
});

module.exports = Map;