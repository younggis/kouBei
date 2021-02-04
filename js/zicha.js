var zichaSceneList = [];
var zichaSceneSelcectList = [];
var chartObj = {};
var switchFlog = true;
var recentSummaryIndex = 0;
var echartData = [];
//场景游标
var recentSceneIndex = -1;
var beforeClickSceneIndex = -1;
var beforeClickName = '';
var nerName = "";
var rencentSceneName = "全部";

//地市游标
var recentCityIndex = -1;
var beforeClickCityIndex = -1;
var recentCityName = "全省";

var totolKeyData = [];

window.onresize = function() {
	chartObj['cccp-chart'].resize();
}

$("body").click(function(e) {
	e.stopPropagation();
	if(!$(e.target.parentElement).hasClass('map-search')) {
		$(".map-serach-dl").hide();
	}
})

function changeBc(index) {
	$($('.zicha-city')[index]).toggleClass('mapbc-' + index);
	$($('.zicha-city')[index]).toggleClass('mapbc-active-' + index);
	$('.zicha-city').each((i, item) => {
		if(i != index) {
			$(item).addClass('mapbc-' + i);
			$(item).removeClass('mapbc-active-' + i);
		}
	});
	if(index != recentCityIndex) {
		recentCityName = $($('.zicha-city')[index]).text();
		recentCityIndex = index;
		initDataPart(recentCityName, '全部', '全部');
		requestScene(recentCityName, '全部', '全部');
	} else {
		recentCityName = '全省';
		recentCityIndex = -1;
		initDataPart('全省', '全部', '全部');
		requestScene('全省', '全部', '全部');
	}
}

function changeChildScene() {
	$('.map-serach-dl').css('display', 'block');
	let key = $('#map-serach').val();
	$$('scene/search', {
		time: dealDate($('#time').val()),
		key: key,
		city: recentCityName,
		scene: rencentSceneName,
	}, function(result) {
		let html = ''
		$('.map-serach-dl').html('');
		totolKeyData = result
		if(result && result.length) {
			for(let i = 0; i < result.length; i++) {
				let classText = '';
				if(i % 2 == 0) {
					classText = 'even';
				};
				let label = result[i].city + '→' + result[i].scene + '→';
				let subScene = result[i].subScene.split(key);
				let sceneLabel = subScene.join('<span style="color:#4192F7;">' + key + '</span>');
				let finalLabel = label + sceneLabel;
				html += `<dt class="map-serach-dt ${classText}" index="${i}">${finalLabel}</dt>`;
			};
		} else {
			html = `<dt class="map-serach-nodata-dt even">无数据...</dt>`
		}
		$('.map-serach-dl').html(html);
		$('.map-serach-dt').on('click', function() {
			let index = $(this).attr('index');
			$('#map-serach').val(totolKeyData[index].subScene);
			$('.map-serach-dl').css('display', 'none');
			requestScene(totolKeyData[index].city, totolKeyData[index].scene, totolKeyData[index].subScene);
		})

	})
}

function addList(data) {
	$('#zicha-list').html('');
	let html = '';
	for(let i = 0; i < data.length; i++) {
		let classText = '';
		if(i % 2 == 1) {
			classText = 'even';
		}
		data[i] = handleNull(data[i]);
		html +=
			`
			<li class="zicha-cell-row ${classText}">
				<div class="zicha-cell-1 cell-6">${data[i]['a_03']}</div>
				<div class="zicha-cell-1 cell-4 top-center">${data[i]['a_05']}</div>
			</li>
		`;
	}
	$('#zicha-list').html(html);
}

function addScene(data) {
	$('.scene-font').each((index, item) => {
		$(item).html = '';
		let html = '';
		if(index < data.length) {
			let a = (data[index]['num'] == null ? '--' : data[index]['num']);
			let b = (data[index]['is_yj'] == null ? '--' : data[index]['is_yj']);
			let c = (data[index]['a_04'] == null ? '--' : data[index]['a_04']);
			let list = sceneBgList.filter(item => {
				return item.name == data[index]['import_scene']
			});
			if(list.length) {
				let bgClass = list[0].activeIcon;
				let bgClassActive = list[0].activeIcon + '_active'
				let name = list[0].name;
				html =
					`
				<div class="layui-col-md4 h100  ${recentSceneIndex == index?bgClassActive:bgClass} scene-common" name="${name}" index="${index}"></div>
				<div class="layui-col-md8 h100">
					<div class="scene-box">
						<div class="scene-index">
							<span>子场景数量：</span><span class="color-blue">${a}</span>
						</div>
						<div class="scene-index">
							<span>质差场景数：</span><span class="color-green">${b}</span>
						</div>
						<div class="scene-index">
							<span>超长超频质差场景数：</span><span class="color-red">${c}</span>
						</div>
					</div>
				</div>
				`;
				$(item).html(html);
			}

		}
	});
	$('.scene-common').on('click', function() {
		let name = $(this).attr('name');
		let city = $("#city").val();
		let index = $(this).attr('index');
		if(index != recentSceneIndex) {
			beforeClickSceneIndex = recentSceneIndex;
			beforeClickName = nerName;
			nerName = name;
			rencentSceneName = name;
			recentSceneIndex = index;
			$($('.scene-common')[beforeClickSceneIndex]).toggleClass('scene-' + swicthClass(beforeClickName) + '_active',
				false);
			$(this).toggleClass('scene-' + swicthClass(name) + '_active', true);
			initDataPart(city, name, '全部');
			requestScene(city, name, '全部');
		} else {
			beforeClickSceneIndex = -1;
			beforeClickName = '';
			nerName = '';
			recentSceneIndex = -1;
			rencentSceneName = '全部';
			$(this).toggleClass('scene-' + swicthClass(name) + '_active', false);
			initDataPart(city, '全部', '全部');
			requestScene(city, '全部', '全部');
		}
	})
}

function swicthClass(name) {
	let className = "";
	switch(name) {
		case '地铁':
			className = "ditie";
			break;
		case '停车场':
			className = "tingche";
			break;
		case '服务区':
			className = "fuwuqu";
			break;
		case '政府办公区':
			className = "zhengfu";
			break;
		case '场馆':
			className = "changguan";
			break;
		case '疾控中心':
			className = "jikong";
			break;
		case '高速':
			className = "gaosu";
			break;
		case '高校':
			className = "gaoxiao";
			break;
		case '机场':
			className = "jichang";
			break;
		case '高铁':
			className = "gaotie";
			break;
		case '交通枢纽':
			className = "jiaotongshuniu";
			break;
		case '酒店':
			className = "jiudian";
			break;
		case '居民区':
			className = "jumingqu";
			break;
		case '美景':
			className = "meijing";
			break;
		case '商业区':
			className = "shangyequ";
			break;
		case '美食':
			className = "food";
			break;
		case '医院':
			className = "yiyuan";
			break;
		case '城区干道':
			className = "gandao";
			break;
		case '底商':
			className = "dishang";
			break;
		case '公园':
			className = "gongyuan";
			break;
		case '美食商业区':
			className = "foodshangyequ";
			break;
		case '绕城高速出口':
			className = "gaosuchukou";
			break
	}
	return className
}

function showEchart(id, xData, ydata, unit, chartObj) {
	let option = {

		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "line",
			},
		},
		grid: {
			left: 20,
			right: 20,
			bottom: 10,
			top: 70,
			containLabel: true,
		},
		xAxis: [{
			type: "category",
			data: xData,
			axisLine: {
				show: true,
				lineStyle: {
					color: "#999999"
				}
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				color: "#999999",
				rotate: 30,
				interval: 0,
				fontSize: 12,
				rotate: 90,
				formatter: function(value, index) {
					let list = value.split(':');
					if(list[1] == "00") {
						return value;
					} else {
						return ''
					}
				},
			},

		}],
		yAxis: [{
			type: "value",
			// minInterval: 1,
			axisLine: {
				show: false,
			},
			axisTick: {
				show: false,
			},
			splitLine: {
				lineStyle: {
					color: "#E7E7E7",
				},
			},
			axisLabel: {
				fontSize: 12,
				color: "#999999",
				formatter: unit == '%' ? "{value}%" : "{value}",
			},
			name: unit == '%' ? "" : "单位/" + unit,
			nameTextStyle: {
				align: 'center',
				fontSize: 12,
				color: '#999999'
			}
		}],
		series: {
			type: 'line',
			data: ydata,
			type: "line",
			symbol: "none",
			sampling: "average",
			smooth: true,
			itemStyle: {
				color: "rgba(65, 146, 247, 1)",
			},
			areaStyle: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: "rgba(65, 146, 247, 0.6)",
					},
					{
						offset: 1,
						color: "rgba(65, 146, 247, 0)",
					},
				]),
			},

		},
	};
	if(!chartObj[id]) {
		chartObj[id] = echarts.init(document.getElementById(id));
		chartObj[id].setOption(option);
	} else {
		chartObj[id].setOption(option, true);
	}
	chartObj[id].resize();
}

function initData(city) {
	let flog = (city == '全省' && switchFlog) ? 1 : 2;
	$$('scene/badQualitySummary_new', {
		time: dealDate($('#time').val()),
		city: city,
		flag: flog,
	}, function(result) {
		if(flog == 1) {
			$(".city-detail").css('display', 'block');
			$('.city-scene').css('display', 'none');
			// $('.zicha-addBtn').css('display', 'none');
			$(".index-font").each((index, item) => {
				let data = result.dataList.filter(i => {
					return i['city_name'] == $(item).find('.zicha-city').text();
				});
				$(item).find('.color-blue').text((!data.length || data[0]['num'] == null) ? '--' : data[0]['num']);
				$(item).find('.color-green').text((!data.length || data[0]['is_yj'] == null) ? '--' : data[0]['is_yj']);
				$(item).find('.color-red').text((!data.length || data[0]['a_04'] == null) ? '--' : data[0]['a_04']);
				if($(item).find('.zicha-city').hasClass('mapbc-active-' + index)) {
					$(item).find('.zicha-city').removeClass('mapbc-active-' + index);
					$(item).find('.zicha-city').addClass('mapbc-' + index);
				}
			});
		} else {
			$(".city-detail").css('display', 'none');
			$('.city-scene').css('display', 'block');
			// $('.zicha-addBtn').css('display', 'block');
			zichaSceneList = result.dataList;
			addScene(zichaSceneList);
			// zichaSceneSelcectList = zichaSceneList;
			// initSceneSelect(zichaSceneSelcectList);
		}
		$('.zhicha-tips').html(result.tips)
	})
}

function dealData(data) {
	return data == null ? '--' : data;
}

function dealDate1(time) {
	let list = time.split(' ');
	return list[1].split(':')[0] + ':' + list[1].split(':')[1];
}

function dealSummaryIndex(indexList) {
	let unitList = ['GB', 'ERL', '%', '%', '%', '次'];
	let indexlabel = ['流量', 'VOLTE话务量', '高利用率小区数占比', 'volte掉话率', '低感知小区数占比', '投诉量']
	$('#zhicha-index').empty();
	let html = '';
	for(var i = 0; i < 6; i++) {
		html =
			`
			<div class="layui-col-md4 h50 zhicha-cursor">
		    	<div class="bg-index h100  ${recentSummaryIndex == i?'active-index':''}">
		   		   <div class="index-box">
		   			    <div class="index-num">${indexList[i]}<span class="index-unit">${indexList[i]=='--'?'':unitList[i]}</span></div>
		   			    <div class="index-label">${indexlabel[i]}</div>
		   		   </div>
		   	    </div>
			</div>
		   	`;
		$('#zhicha-index').append(html)
	};
	$(".bg-index").on('click', function() {
		$('.bg-index').each((index, item) => {
			$(item).removeClass('active-index')
		});
		$(this).addClass('active-index');
		let label = $(this).find('.index-label').text();
		recentSummaryIndex = indexlabel.indexOf(label);
		if(echartData.length) {
			$('.chart-nodata').css('display', 'none');
			$('.chart-box').css('display', 'block');
			dealChartData()
		} else {
			$('.chart-nodata').css('display', 'block');
			$('.chart-box').css('display', 'none');
		}
	});
}

function dealChartData() {
	let xdata = [];
	let ydata = [];
	let propertyList = ['liuliang_GB', 'ERAB_NBRMEANESTAB_1', 'maxuse_rate', 'EU0205', 'is_dsl_rate', 'tousu_total'];
	let unitList = ['GB', 'ERL', '%', '%', '%', '次'];
	echartData.forEach((item, index) => {
		xdata.push(dealDate1(item.time));
		ydata.push(item[propertyList[recentSummaryIndex]]);
	})
	$('.chart-nodata').css('display', 'none');
	$('.chart-box').css('display', 'block');
	showEchart('cccp-chart', xdata, ydata, unitList[recentSummaryIndex], chartObj);
}

function initDataPart(city, scene, subScene) {
	$$('scene/badQualityQuota_new', {
		time: dealDate($('#time').val()),
		city: city,
		scene: scene,
		subScene: subScene
	}, function(result) {
		console.log(result)
		if(!result) {
			$('#zicha-list').css('display', 'none');
			$('.top-nodata').css('display', 'block');
			dealSummaryIndex(['--', '--', '--', '--', '--', '--']);
			return
		}
		if(result.top && result.top.length) {
			$('#zicha-list').css('display', 'block');
			$('.top-nodata').css('display', 'none');
			addList(result.top);
		} else {
			$('#zicha-list').css('display', 'none');
			$('.top-nodata').css('display', 'block');
		}
		if(result.summary) {
			let indexList = [dealData(result.summary['liuliang_GB']), dealData(result.summary['ERAB_NBRMEANESTAB_1']),
				dealData(
					result.summary[
						'maxuse_rate']), dealData(result.summary['EU0205']), dealData(result.summary['is_dsl_rate']), dealData(
					result.summary['tousu_total'])
			];
			dealSummaryIndex(indexList)
		} else {
			dealSummaryIndex(['--', '--', '--', '--', '--', '--'])
		}

		if(result.timeList && result.timeList.length) {
			echartData = result.timeList;
			dealChartData();
		} else {
			echartData = [];
			$('.chart-nodata').css('display', 'block');
			$('.chart-box').css('display', 'none');
		}

	})
}

function init() {
	
	var userid = getvl('user');
	if(!userid) {
		alert('请从四川移动网优大数据管理平台进入！');
		return;
	}
	getUserId("UserCity", {
		user: userid
	}, function(data) {
		let citylist = [];
		for(var i = 0; i < data.length; i++) {
			var value = data[i]['EnumName'];
			if(data[i]['EnumName'] == '全部') continue;
			citylist.push({
				label: data[i]['EnumName'],
				value: value
			})
		}
		_addOption('city', citylist);
		$$('scene/badQualityTimeList', {}, function(result) {
			timeList = result;
			let timelist = [];
			let data = result;
			for(var i = 0; i < data.length; i++) {
				timelist.push({
					label: data[i],
					value: data[i]
				})
			}
			_addOption('time', timelist);
			let city = $("#city").val();
			initData(city);
			initDataPart(city, '全部', '全部');
			requestScene(city, '全部', '全部');
		})
	});

	layerForm.on('switch(switchTest)', function(data) {
		switchFlog = !switchFlog;
		initData('全省');
	})

	layerForm.on('select(city)', function(data) {
		if(data.value != '全省') {
			$(".zicha-swicth .layui-form-switch").css('display', 'none');
		} else {
			$(".zicha-swicth .layui-form-switch").css('display', 'block');
		}
	});
	$("#seaBtn").on('click', function() {
		let city = $("#city").val();
		initData(city);
		initDataPart(city, '全部', '全部');
		requestScene(city, '全部', '全部');
	})

	$('.zicha-addBtn').on('click', function() {
		$('.zicha-app').show();
	})
	$('#zicha-cancel').on('click', function() {
		$('.zicha-app').hide()
	})
	$('#zicha-sure').on('click', function() {
		$('.zicha-app').hide();

		let index = 0;
		let items = $('#zhichaSceneSelect .layui-col-md3.active');
		let scenes = [];
		for(var i = 0; i < items.length; i++) {
			scenes.push($(items[i]).attr('name'));
		}
		let data = [];
		data = zichaSceneList.filter(item => {
			return scenes.indexOf(item['a_05']) != -1;
		});
		zichaSceneSelcectList = data;
		addScene(data);
	})
	//    $('.zicha-imgBtn').on('click',function(){
	// })

	$('#explain').on('click', function() {
		layer.open({
			type: 1,
			title: false,
			closeBtn: 1,
			area: ['720px', '480px'],
			shadeClose: true,
			content: $('#explainlayer')
		});
	})

	initMap()

}

function requestScene(city, scene, subScene) {
	$$('scene/badQualityQuotaMap_new', {
		time: dealDate($('#time').val()),
		city: city,
		scene: scene,
		subScene: subScene
	}, function(result) {
		addSceneLayer(result['scene']);
		addSectorLayer(result['cell']);
	})
}

function initSceneSelect(data) {
	$('#zhichaSceneSelect').html('');
	for(let i = 0; i < data.length; i++) {
		for(let j = 0; j < sceneList.length; j++) {
			if(sceneList[j]['name'] == data[i]['import_scene']) {
				let btnhtml = '';
				if(i > 11) {
					btnhtml =
						`
						<div class="layui-col-md3" name="${sceneList[j]['name']}">
							<img src="${sceneList[j]['url'].replace('.png', '') + '_unactive.png'}">
						</div>
						`;
				} else {
					btnhtml =
						`
						<div class="layui-col-md3 active"  name="${sceneList[j]['name']}">
							<img src="${sceneList[j]['url']}">
						</div>
						`;
				}
				$('#zhichaSceneSelect').append(btnhtml)
			}
		}
	};
	$('#zhichaSceneSelect .layui-col-md3').on('click', function() {
		let items = $('#zhichaSceneSelect .layui-col-md3');
		let num = $('#zhichaSceneSelect .active').length;
		if($(this).hasClass('active')) {
			let curr_url = $(this).find('img').attr('src');
			curr_url = curr_url.replace('.png', '_unactive.png');
			$(this).find('img').attr('src', curr_url)
			$(this).removeClass('active');

		} else {
			if(num < 12) {
				let curr_url = $(this).find('img').attr('src');
				curr_url = curr_url.replace('_unactive.png', '.png');
				$(this).find('img').attr('src', curr_url)
				$(this).addClass('active');
			} else {
				layerLayer.open({
					type: 1,
					// offset: ['500px', '50px'],
					content: '<div style="padding: 20px 100px;">最多支持选中12个场景！</div>',
					btn: '确定',
					btnAlign: 'c', //按钮居中
					shade: 0, //不显示遮罩
					yes: function() {
						layerLayer.closeAll();
					}
				});
			}
		}
	})

}

function dealDate(date) {
	let list = date.split(' ');
	let a1 = list[0].replace(/-/g, '');
	let a2 = list[1].replace(/:/g, '');
	return a1 + a2;
}

function initEchartData(data, mark) {
	let xData = [];
	let seriesData1 = [];
	let seriesData2 = [];
	data.forEach(item => {
		xData.push(item[mark]);
		seriesData1.push(item['a_03']);
		seriesData2.push(item['a_04']);
	});
}