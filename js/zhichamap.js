let map = null;
let warnLayer = null;
let heatmapLayer = null;
let sectorLayer = null;
let sceneLayer = null;

let format = new ol.format.WKT(); //数据格式转换

let allData = [];

function initMap() {
	map = new ol.Map({
		layers: [],
		target: 'map',
		interactions: ol.interaction.defaults({
			altShiftDragRotate: false,
			pinchRotate: false
		}),
		view: new ol.View({
			center: ol.proj.transform([103.06327, 30.66074], 'EPSG:4326', 'EPSG:3857'),
			zoom: 6,
			maxZoom: 18,
			minZoom: 4
		})
	});
	sceneLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: []
		})
	});
	map.addLayer(sceneLayer);
	heatmapLayer = new ol.layer.Heatmap({
		source: new ol.source.Vector({
			features: []
		})
	});
	map.addLayer(heatmapLayer);
	warnLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: []
		})
	});
	map.addLayer(warnLayer);
	sectorLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: []
		})
	});
	map.addLayer(sectorLayer);

	let roadLayer = new ol.layer.Tile({
		title: "3857底图",
		source: new ol.source.XYZ({
			url: baseUrl + 'Handler/Utils.ashx?method=baiduMap&x={x}&y={y}&z={z}'
		})
	});
	map.addLayer(roadLayer);

	//	map.on("moveend", function(e) {
	//		var zoom = map.getView().getZoom(); //获取当前地图的缩放级别
	//		if(zoom >= 8) {
	//			vectorLayer.setVisible(false);
	//			labelLayer.setVisible(false);
	//			roadLayer.setVisible(true);
	//			sceneLayer.setVisible(true);
	//			locLayer.setVisible(true);
	//			$('#legend').hide();
	//			$('#legend1').show();
	//		} else {
	//			roadLayer.setVisible(false);
	//			sceneLayer.setVisible(false);
	//			locLayer.setVisible(true);
	//			vectorLayer.setVisible(true);
	//			labelLayer.setVisible(true);
	//			$('#legend1').hide();
	//			$('#legend').show();
	//		}
	//	});

	map.on('dblclick', function(evt) {
		let feature = map.forEachFeatureAtPixel(evt.pixel,
			function(feature) {
				return feature;
			});
		if(feature) {
			map.getView().animate({
				center: evt.coordinate
			}, {
				zoom: 8
			})
			let attributes = feature.getProperties();
			$$('Scene/citysubSceneList', {
				city: attributes['name'],
				scene: $('.imgSit.active').attr('scene_name')
			}, function(result) {
				allData = result;
				addSceneLayer(result);
			})
		}
		return false;
	})

}

function addSceneLayer(data) {
	sceneLayer.getSource().clear();
	locLayer.getSource().clear();
	if(!data) return;
	let features = [];
	let scene_name = $('.imgSit.active').attr('scene_name');
	for(let i = 0; i < data.length; i++) {
		if(!data[i]['wkt']) continue;
		if(scene_name) {
			if(data[i]['scene_name'] != scene_name) continue;
		}
		let feature = format.readFeature(data[i]['wkt']);

		let wkt = format.writeFeature(feature, {
			dataProjection: 'EPSG:3857',
			featureProjection: 'EPSG:4326'
		});
		let transfeature = format.readFeature(wkt);
		transfeature.setProperties(data[i]);

		let centroid = null;
		if(data[i]['wkt'].indexOf('MULTIPOLYGON') > -1) {
			centroid = turf.toMercator(turf.centroid(turf.multiPolygon(feature.getGeometry().getCoordinates()))).geometry.coordinates;
		} else {
			centroid = turf.toMercator(turf.centroid(turf.polygon(feature.getGeometry().getCoordinates()))).geometry.coordinates;
		}
		let centerfeature = new ol.Feature(new ol.geom.Point(centroid));

		let color = '#F7C7C9';
		let imgurl = 'img/normal.png';
		if(data[i]['week_source'] < 60) {
			color = '#F10808';
			//imgurl='img/red.png';
		} else if(data[i]['week_source'] >= 60 && data[i]['week_source'] < 70) {
			color = '#FD931A';
			//imgurl='img/orange.png';
		} else if(data[i]['week_source'] >= 70 && data[i]['week_source'] < 80) {
			color = '#FEEE24';
			//imgurl='img/yellow.png';
		} else if(data[i]['week_source'] >= 80 && data[i]['week_source'] < 90) {
			color = '#4190F7';
			//imgurl='img/blue.png';
		} else {
			color = '#90F741';
			//imgurl='img/green.png';
		}
		let iconstyle = new ol.style.Style({
			image: new ol.style.Icon(({
				scale: 0.1,
				anchor: [0.3, 1],
				anchorXUnits: 'fraction',
				anchorYUnits: 'fraction',
				src: imgurl
			}))
		});
		let style = new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: [255, 255, 255, 1],
				width: 1
			}),
			fill: new ol.style.Fill({
				color: color
			}),
			text: new ol.style.Text({
				textAlign: 'center',
				textBaseline: 'middle',
				offsetY: 12,
				font: 'normal 12px 微软雅黑',
				text: data[i]['sub_scene_name'],
				fill: new ol.style.Fill({
					color: '#999999'
				})
			})
		});
		centerfeature.setStyle(iconstyle);
		sceneLayer.getSource().addFeature(centerfeature)
		transfeature.setStyle(style);
		features.push(transfeature);
	}
	sceneLayer.getSource().addFeatures(features)
}

function addCityLayer(data) {
	defaultLayer();
	let features = vectorLayer.getSource().getFeatures();
	for(let i = 0; i < features.length; i++) {
		let property = features[i].getProperties();
		for(let j = 0; j < data.length; j++) {
			if(data[j]['city_name'] == property['name']) {
				let color = '#F7C7C9';
				if(data[j]['sub_scene_bad_rate'] < 10) {
					color = '#D4FFD5';
				} else if(data[j]['sub_scene_bad_rate'] >= 10 && data[j]['sub_scene_bad_rate'] < 20) {
					color = '#DEECFF';
				} else if(data[j]['sub_scene_bad_rate'] >= 20 && data[j]['sub_scene_bad_rate'] < 30) {
					color = '#FFFFC6';
				} else if(data[j]['sub_scene_bad_rate'] >= 30 && data[j]['sub_scene_bad_rate'] < 50) {
					color = '#FFE6BE';
				} else {
					color = '#F7C7C9';
				}
				let style = new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: '#4192F7',
						width: 0.5
					}),
					fill: new ol.style.Fill({
						color: color
					})
				});
				features[i].setStyle(style);
			}
		}
	}
}

function clearLayer() {
	if(!map) return;
	sceneLayer.getSource().clear();
	defaultLayer();
	map.getView().animate({
		center: ol.proj.transform([103.06327, 30.66074], 'EPSG:4326', 'EPSG:3857')
	}, {
		zoom: 6
	})
}

function defaultLayer() {
	let features = vectorLayer.getSource().getFeatures();
	for(let i = 0; i < features.length; i++) {
		let style = new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: '#4192F7',
				width: 1
			}),
			fill: new ol.style.Fill({
				color: [222, 236, 255, 1]
			})
		});
		features[i].setStyle(style);
	}
}

function transform(coordinates) {
	for(let i = 0; i < coordinates.length; i++) {
		for(let j = 0; j < coordinates[i].length; j++) {
			for(let k = 0; k < coordinates[i][j].length; k++) {
				let coordinate = coordinates[i][j][k];
				coordinates[i][j][k] = ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:3857');
			}
		}
	}
	return coordinates[0];
}