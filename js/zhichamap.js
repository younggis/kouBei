let map = null;
let warnLayer = [];

let warnlocLayer = null;
let heatmapLayer = null;
let sectorLayer = null;
let sceneLayer = null;
let overlayer = null;
let highlightLayer = null;
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
	overlayer = new ol.Overlay({
		element: document.getElementById('popup'),
		autoPan: false,
		autoPanAnimation: {
			duration: 250
		}
	});
	map.addOverlay(overlayer);
	let closer = document.getElementById('popup-closer');
	if(closer) {
		closer.addEventListener('click', () => {
			overlayer.setPosition(undefined);
			closer.blur();
			return false;
		})
	}

	let roadLayer = new ol.layer.Tile({
		title: "3857底图",
		source: new ol.source.XYZ({
			url: baseUrl + 'Handler/Utils.ashx?method=baiduMap&x={x}&y={y}&z={z}'
		})
	});
	map.addLayer(roadLayer);
	sceneLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: []
		})
	});
	map.addLayer(sceneLayer);
	heatmapLayer = new ol.layer.Heatmap({
		source: new ol.source.Vector({
			features: []
		}),
		blur: 10,
		radius: 2,
		opacity: 0.8,
		weight: function(feature) {
			return feature.get('a6');
		},
	});
	map.addLayer(heatmapLayer);

	sectorLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: [],
		}),
		style: new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: [255, 255, 255, 1],
				width: 1
			}),
			fill: new ol.style.Fill({
				color: [0, 255, 0, 0.6]
			})
		})
	});
	map.addLayer(sectorLayer);

	warnlocLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: []
		}),
		style: new ol.style.Style({
			image: new ol.style.Icon(({
				scale: 1,
				anchor: [0.5, 1],
				anchorXUnits: 'fraction',
				anchorYUnits: 'fraction',
				src: 'img/loc_active.png'
			}))
		})
	});
	map.addLayer(warnlocLayer);

	highlightLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: []
		})
	});
	map.addLayer(highlightLayer);

	map.on("moveend", function(e) {
		overlayer.setPosition(undefined);

		var zoom = map.getView().getZoom(); //获取当前地图的缩放级别
		if(zoom < 14) {
			sectorLayer.setVisible(false);
		} else {
			sectorLayer.setVisible(true);
		}
		if(zoom < 12) {
			sceneLayer.setVisible(false);
		} else {
			sceneLayer.setVisible(true);
		}

		if(zoom < 8) {
			heatmapLayer.setVisible(false);
			warnlocLayer.setVisible(false);

			for(var i = 0; i < warnLayer.length; i++) {
				if(warnLayer[i]) {
					warnLayer[i].setOffset([0, 0]);
				}
			}
		} else {
			heatmapLayer.setVisible(true);
			warnlocLayer.setVisible(true);

			if(zoom < 8) {
				heatmapLayer.setBlur(10);
				heatmapLayer.setRadius(2);
			} else if(zoom >= 8 && zoom < 14) {
				heatmapLayer.setBlur(8);
				heatmapLayer.setRadius(3);
			} else {
				heatmapLayer.setBlur(6);
				heatmapLayer.setRadius(4);
			}

			for(var i = 0; i < warnLayer.length; i++) {
				if(warnLayer[i]) {
					warnLayer[i].setOffset([10000, 10000]);
				}
			}
		}
	})

	map.on('click', function(evt) {
		highlightLayer.getSource().clear();

		let feature = map.forEachFeatureAtPixel(evt.pixel,
			function(feature) {
				return feature;
			});
		if(feature) {
			var properties = feature.getProperties();
			var layertype = properties['layertype'];
			if(layertype) {
				var geotype = feature.getGeometry().getType().toUpperCase();
				if(geotype == 'POINT') {
					var tempfeature = new ol.Feature(feature.getGeometry());
					tempfeature.setProperties(properties);
					tempfeature.setStyle(new ol.style.Style({
						image: new ol.style.Icon(({
							scale: 1,
							anchor: [0.5, 1],
							anchorXUnits: 'fraction',
							anchorYUnits: 'fraction',
							src: 'img/loc.png'
						}))
					}))
					highlightLayer.getSource().addFeature(tempfeature);
				} else {
					var tempfeature = new ol.Feature(feature.getGeometry());
					tempfeature.setProperties(properties);
					tempfeature.setStyle(new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: [255, 255, 255, 1],
							width: 1
						}),
						fill: new ol.style.Fill({
							color: [0, 255, 255, 1]
						})
					}))
					highlightLayer.getSource().addFeature(tempfeature);
				}
			}

			if(layertype == 'sector') {
				var cgi = properties['a5'];
				$$('scene/CellInfo', {
					time: dealDate($('#time').val()),
					cgi: cgi
				}, function(result) {
					if(!result) return;
					result = handleNull(result);
					let html = '';
					var is_maxuse = result['is_maxuse'] ? '是' : '否';
					var is_dsl = result['is_dsl'] ? '是' : '否';
					html += '<p><span>小区名称：</span>' + result['cell_name'] + '</p>';
					html += '<p><span>制式：</span>' + result['type'] + '</p>';
					html += '<p><span>覆盖类型：</span>' + result['COVER_TYPE'] + '</p>';
					html += '<p><span>流量：</span>' + result['liuliang_GB'] + 'GB</p>';
					html += '<p><span>VOLTE话务量：</span>' + result['ERAB_NBRMEANESTAB_1'] + 'ERL</p>';
					html += '<p><span>高利用率：</span>' + result['maxuse'] + '%</p>';
					html += '<p><span>是否高利用率小区：</span>' + is_maxuse + '</p>';
					html += '<p><span>VOLTE掉话率：</span>' + result['EU0205'] + '%</p>';
					html += '<p><span>低感知速率：</span>' + result['EU0536'] + 'Mbps</p>';
					html += '<p><span>是否低感知小区：</span>' + is_dsl + '</p>';
					let coordinates = evt.coordinate;
					let content = document.getElementById('popup-content');
					content.innerHTML = html;
					overlayer.setPosition(coordinates);
				})
			} else if(layertype == 'scene') {
				var city = properties['a6'];
				var scene = properties['a7'];
				var subScene = properties['a1'];

				$$('scene/SceneInfo', {
					time: dealDate($('#time').val()),
					city: city,
					scene: scene,
					subScene: subScene
				}, function(result) {
					if(!result) return;
					result = handleNull(result);
					let html = '';

					var is_yj = result['is_yj'] ? '是' : '否';
					html += '<p><span>场景名称：</span>' + result['import_scene'] + '</p>';
					html += '<p><span>子场景名称：</span>' + result['scene_name'] + '</p>';
					html += '<p><span>地市：</span>' + result['city_name'] + '</p>';
					html += '<p><span>是否预警：</span>' + is_yj + '</p>';
					html += '<p><span>流量：</span>' + result['liuliang_GB'] + 'GB</p>';
					html += '<p><span>VOLTE话务量：</span>' + result['ERAB_NBRMEANESTAB_1'] + 'ERL</p>';
					html += '<p><span>高利用率小区占比：</span>' + result['maxuse_rate'] + '%</p>';
					html += '<p><span>VOLTE掉话率：</span>' + result['EU0205'] + '%</p>';
					html += '<p><span>低感知小区占比：</span>' + result['is_dsl_rate'] + '%</p>';
					html += '<p><span>投诉个数：</span>' + result['tousu_total'] + '</p>';
					let coordinates = evt.coordinate;
					let content = document.getElementById('popup-content');
					content.innerHTML = html;
					overlayer.setPosition(coordinates);
				})
			} else {
				overlayer.setPosition(undefined);
			}
		} else {
			overlayer.setPosition(undefined);
		}
	})
}

function addSceneLayer(data) {
	sceneLayer.getSource().clear();
	warnlocLayer.getSource().clear();
	for(var i = 0; i < warnLayer.length; i++) {
		if(warnLayer[i]) {
			warnLayer[i].setPosition(undefined);
		}
	}
	warnLayer = [];
	if(!data) return;
	let features = [],
		_features = [];
	var warns = [];
	for(let i = 0; i < data.length; i++) {
		if(data[i]['a5']) {
			let feature = format.readFeature(data[i]['a5']);
			let wkt = format.writeFeature(feature, {
				dataProjection: 'EPSG:3857',
				featureProjection: 'EPSG:4326'
			});
			let transfeature = format.readFeature(wkt);

			var color = [6, 159, 8, 0.6];
			if(data[i]['a2']) color = [178, 23, 2, 0.6];

			var style = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: [255, 255, 255, 1],
					width: 1
				}),
				fill: new ol.style.Fill({
					color: color
				})
			})
			transfeature.set('layertype', 'scene');
			transfeature.setStyle(style);
			transfeature.setProperties(data[i]);
			features.push(transfeature);

			if(data[i]['a2']) {
				if(data[i]['a3'] && data[i]['a4']) {
					let centroid = ol.proj.transform([data[i]['a3'], data[i]['a4']], 'EPSG:4326', 'EPSG:3857');
					var element = document.createElement("div");
					element.className = "point_animation";
					var p = document.createElement("p");
					var span = document.createElement("span");
					span.setAttribute('lon', centroid[0]);
					span.setAttribute('lat', centroid[1]);
					element.appendChild(p);
					element.appendChild(span);
					var point_overlay = new ol.Overlay({
						element: element,
						positioning: 'center-center',
					});
					map.addOverlay(point_overlay);
					point_overlay.setPosition(centroid);
					warnLayer.push(point_overlay);

					var _feature = new ol.Feature(new ol.geom.Point(centroid));
					_feature.set('layertype', 'scene');
					_feature.setProperties(data[i]);
					_features.push(_feature);

				}
			}
		} else {
			if(data[i]['a2']) {
				if(data[i]['a3'] && data[i]['a4']) {
					let centroid = ol.proj.transform([data[i]['a3'], data[i]['a4']], 'EPSG:4326', 'EPSG:3857');
					var element = document.createElement("div");
					element.className = "point_animation";
					var p = document.createElement("p");
					var span = document.createElement("span");
					span.setAttribute('lon', centroid[0]);
					span.setAttribute('lat', centroid[1]);

					element.appendChild(p);
					element.appendChild(span);
					var point_overlay = new ol.Overlay({
						element: element,
						positioning: 'center-center',
					});
					map.addOverlay(point_overlay);
					point_overlay.setPosition(centroid);
					warnLayer.push(point_overlay);
					var _feature = new ol.Feature(new ol.geom.Point(centroid));
					_feature.set('layertype', 'scene');
					_feature.setProperties(data[i]);
					_features.push(_feature);
				}
			}
		}
	}
	sceneLayer.getSource().addFeatures(features);
	warnlocLayer.getSource().addFeatures(_features);

	$('.ol-overlay-container span').on('click', function() {
		var x = parseFloat($(this).attr('lon'));
		var y = parseFloat($(this).attr('lat'));
		map.getView().animate({
			center: [x, y]
		}, {
			zoom: 15
		});
	})
}

function addSectorLayer(data) {
	sectorLayer.getSource().clear();
	heatmapLayer.getSource().clear();
	if(!data) return;
	var features = [],
		_features = [];
	for(var i = 0; i < data.length; i++) {
		if(!data[i].a2 || !data[i].a3) continue;
		if(data[i].a2 > 180 || data[i].a2 < 0) continue;
		if(data[i].a3 > 180 || data[i].a3 < 0) continue;
		var point = [parseFloat(data[i].a2), parseFloat(data[i].a3)];
		var feature = null,
			_feature = null;
		if(data[i]['a1'] == '室内') {
			feature = new ol.Feature(new ol.geom.Polygon([sectorHelper.createSingleSector({
				x: point[0],
				y: point[1]
			}, 50, 0, 360)]));
		} else {
			feature = new ol.Feature(new ol.geom.Polygon([sectorHelper.createSingleSector({
				x: point[0],
				y: point[1]
			}, 50, parseInt(data[i]['a4']), 60)]));
		}
		feature.setProperties(handleNull(data[i]));
		feature.set('layertype', 'sector');
		features.push(feature);

		var _feature = new ol.Feature(new ol.geom.Point(ol.proj.transform(point, 'EPSG:4326', 'EPSG:3857')));
		_features.push(_feature);
	}
	sectorLayer.getSource().addFeatures(features);
	heatmapLayer.getSource().addFeatures(_features);

	setTimeout(() => {
		var size = map.getSize();
		if(sectorLayer.getSource().getFeatures().length) {
			var extent = sectorLayer.getSource().getExtent();
			map.getView().fit(extent, {
				size: [size[0] * 1.5, size[1] * 1.5]
			});
		}
	})
}