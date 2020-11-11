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
		$$('Scene/sceneList', {}, function(result) {
			let scenelist = [];
			for(var i = 0; i < result.length; i++) {
				if(i == 0) {
					//getSubScene(result[i]);
				}
				scenelist.push({
					label: result[i],
					value: result[i]
				})
			}
			_addOption('scene', scenelist);
			__addOption('multiscene', scenelist);
			setTimeout(() => {
				executeQuery();
			}, 200)
			layerForm.on('select(scene)', function(data) {
				//getSubScene(data.value);
			})
		})
	})

	layerForm.on('select(lfWd)', function(data) {
		let weidu = data.value;
		if(weidu == 'city') {
			$('.scene').hide();
			$('.subscene').hide();
			$('.multiscene').hide();
			$('.city').show();
		} else if(weidu == 'scene') {
			$('.scene').hide();
			$('.subscene').hide();
			$('.city').hide();
			$('.multiscene').show();
		} else if(weidu == 'subscene') {
			$('.city').hide();
			$('.multiscene').hide();
			$('.scene').show();
			$('.subscene').show();
		}
	})
	layerDate.render({
		elem: '#dayBeg',
		max: 0,
		value: forwardTime(-720) + " ~ " + forwardTime(),
		range: '~',
		done: function(value, date, endDate) {

		}
	});
	$('#seaBtn').on('click', function() {
		executeQuery();
	})
	
	layerForm.on('select(subscene)', function(data) {
		$("#HandoverCompany").val(data.value);
		$("#subscene").next().find("dl").css({
			"display": "none"
		});
		layerForm.render();

	})
	
	let cpLock = false;
	$('#HandoverCompany').on('compositionstart', function() {
		cpLock = true;
	});
	$('#HandoverCompany').on('compositionend', function() {
		cpLock = false;
		search()
	});

	$('#HandoverCompany').on('input', function() {
		if(!cpLock) {
			search()
		}
	});
}

function search() {
	let key = $('#HandoverCompany').val();
	let city = $('#city').val();
	let scene = $('#scene').val();
	if(key) {
		_$$_('Scene/searchSubScene', {
			city: '', //city,
			scene:scene,
			key: key
		}, function(result) {
			let sublist = [];
			for(var i = 0; i < result.length; i++) {
				sublist.push({
					label: result[i],
					value: result[i]
				})
			}
			_addOption('subscene', sublist);
			$("#subscene").next().find("dl").css({
				"display": "block"
			});
		})
	}
}
function getSubScene(key) {
	$$('Scene/searchSubScene', {
		key: key
	}, function(result) {
		let scenelist = [];
		for(var i = 0; i < result.length; i++) {
			scenelist.push({
				label: result[i],
				value: result[i]
			})
		}
		_addOption('subscene', scenelist);
	})
}

var chartA = echarts.init(document.getElementById('chartA'));
var chartB = echarts.init(document.getElementById('chartB'));
var chartC = echarts.init(document.getElementById('chartC'));
var chartD = echarts.init(document.getElementById('chartD'));
var chartE = echarts.init(document.getElementById('chartE'));
var chartF = echarts.init(document.getElementById('chartF'));
var chartG = echarts.init(document.getElementById('chartG'));
var chartH = echarts.init(document.getElementById('chartH'));
var chartI = echarts.init(document.getElementById('chartI'));
var chartJ = echarts.init(document.getElementById('chartJ'));

function executeQuery() {
	let weidu = $("#wd").val();
	let city = $("#city").val();
	let subscene = $("#subscene").val();
	let multiscene = $('#multiscene').next().find('.xm-input').attr('title');
	let rangeTime = $('#dayBeg').val();
	let index = rangeTime.indexOf('~');

	let parames = {
		flag: weidu,
		sTime: $.trim(rangeTime.substring(0, index - 1)).replace(/-/g, ''),
		eTime: $.trim(rangeTime.substring(index + 1, rangeTime.length)).replace(/-/g, ''),
	}
	if(weidu == 'city') {
		parames.key = city;
		$('#parentName').text('地市');
		$('#childName').text('场景名称');
	} else if(weidu == 'scene') {
		parames.key = multiscene;
		$('#parentName').text('场景名称');
		$('#childName').text('子场景名称');
	} else if(weidu == 'subscene') {
		parames.key = subscene;
		$('#parentName').text('子场景名称');
		$('#childName').text('小区名称');
	}
	clearChart();
	$$('Scene/dimensionList', parames, function(result) {
		if(!result) return;
		if(result.source) {
			if(weidu == 'city') {
				fillFullScene(result.source)
			} else if(weidu == 'scene'){
				if(multiscene.split(',').length > 1) {
					fillFullScene(result.source,true)
				} else {
					fillSingleScene(result.source[0],true)
				}
			}else{
				fillSingleScene({
					sceneData:result.source
				})
			}
		}
		if(result.five) {
			let radarData = handleNull(result.five);
			radarChart([radarData.quality_rate, radarData.base_net_rate, radarData.net_preption_rate]);
			$('#quality_rate').text(radarData.quality_rate + '%');
			$('#base_net_rate').text(radarData.base_net_rate + '%');
			$('#net_preption_rate').text(radarData.net_preption_rate + '%');
		}
		if(result.top){
			fillList(handleNull(result.top));
		}
	})
}

function fillList(data) {
	$('#subscenelist').html('');
	let html = '';
	for(let i = 0; i < data.length; i++) {
		let classText = '';
		if(i % 2 == 1) {
			classText = 'even';
		}
		data[i]=handleNull(data[i])
		html += `
			<li class="row ${classText}">
				<div class="cell cell-5">${data[i]['parentName']}</div>
				<div class="cell cell-5">${data[i]['childName']}</div>
			</li>
		`;
	}
	$('#subscenelist').html(html);
}

function fillFullScene(result,isbar) {
	let label = [];
	let seriesA = [],
		seriesB = [],
		seriesC = [],
		seriesD = [],
		seriesE = [],
		seriesF1 = [],
		seriesF2 = [],
		seriesG = [],
		seriesH = [],
		seriesI = [];
	let legend = [];
	for(let i = 0; i < result.length; i++) {
		label.push(result[i]['sceneName']);
		let sceneData = result[i]['sceneData'];
		let lineConfig = {
			type: 'line',
			symbol: 'none',
			smooth: true,
			data: []
		};
		let barConfig = {
			type: 'bar',
			data: [],
			barWidth: 10,
			itemStyle: {
				normal: {
					barBorderRadius: [7, 7, 0, 0]
				}
			}
		};
		for(let j = 0; j < sceneData.length; j++) {
			let name = sceneData[j]['date_id'].substring(0, 10).replace(/-/g, '')
			lineConfig.name = name;
			barConfig.name = name;
			if(!seriesA[j]) {
				seriesA[j] =isbar?cloneobj(barConfig): cloneobj(lineConfig);
				legend.push(sceneData[j]['date_id'].substring(0, 10).replace(/-/g, ''))
			}
			seriesA[j]['data'].push(sceneData[j]['current_week_score']);
			if(!seriesB[j]) {
				seriesB[j] =isbar?cloneobj(barConfig): cloneobj(lineConfig);
			}
			seriesB[j]['data'].push(sceneData[j]['current_week_bad_scene_num']);
			if(!seriesC[j]) {
				seriesC[j] = cloneobj(barConfig);
			}
			seriesC[j]['data'].push(sceneData[j]['is_exists_alarm']);
			if(!seriesD[j]) {
				seriesD[j] = cloneobj(barConfig);
			}
			seriesD[j]['data'].push(sceneData[j]['total_gzwy_num']);
			if(!seriesE[j]) {
				seriesE[j] =isbar?cloneobj(barConfig): cloneobj(lineConfig);
			}
			seriesE[j]['data'].push(sceneData[j]['open_rate']);
			if(!seriesF1[j]) {
				seriesF1[j] = cloneobj(barConfig);
				seriesF1[j].yAxisIndex = 0;
			}
			seriesF1[j]['data'].push(sceneData[j]['no_effective_js_num']);

			if(!seriesF2[j]) {
				seriesF2[j] = cloneobj(lineConfig);
				seriesF2[j].yAxisIndex = 1;
			}
			seriesF2[j]['data'].push(sceneData[j]['effective_js_rate']);

			if(!seriesG[j]) {
				seriesG[j] = cloneobj(barConfig);
			}
			seriesG[j]['data'].push(sceneData[j]['tuifu_rate']);
			if(!seriesH[j]) {
				seriesH[j] = cloneobj(lineConfig);
			}
			seriesH[j]['data'].push(sceneData[j]['bihuan_rate']);
			if(!seriesI[j]) {
				seriesI[j] =cloneobj(barConfig);
			}
			seriesI[j]['data'].push(sceneData[j]['ts_net_problem_num']);
		}
	}
	
	isbar?barEch(chartA, {
		xAxis: label,
		legend: legend,
		serData: seriesA
	}):afFun(chartA, {
		xAxis: label,
		legend: legend,
		serData: seriesA
	})
	
	isbar?barEch(chartB, {
		xAxis: label,
		legend: legend,
		serData: seriesB
	}):afFun(chartB, {
		xAxis: label,
		legend: legend,
		serData: seriesB
	})
	barEch(chartC, {
		xAxis: label,
		legend: legend,
		serData: seriesC
	})
	barEch(chartD, {
		xAxis: label,
		legend: legend,
		serData: seriesD
	})
	isbar?barEch(chartE, {
		xAxis: label,
		legend: legend,
		serData: seriesE
	}):afFun(chartE, {
		xAxis: label,
		legend: legend,
		serData: seriesE
	})
	
	waveFun({
		xAxis: label,
		serData: seriesF1.concat(seriesF2)
	})
	barEch(chartG, {
		xAxis: label,
		legend: legend,
		serData: seriesG
	})
	afFun(chartH, {
		xAxis: label,
		legend: legend,
		serData: seriesH
	})
	barEch(chartI, {
		xAxis: label,
		legend: legend,
		serData: seriesI
	})
}

function fillSingleScene(result,isbar) {
	if(!result) return;
	let label = [];
	
	let legend = [];

	let sceneData = result['sceneData'];
	if(!sceneData)return;
	let lineConfig = {
		type: 'line',
		symbol: 'none',
		smooth: true,
		data: []
	};
	let barConfig = {
		type: 'bar',
		data: [],
		barWidth: 10,
		itemStyle: {
			normal: {
				barBorderRadius: [7, 7, 0, 0]
			}
		}
	};
	let seriesA = isbar?cloneobj(barConfig): cloneobj(lineConfig),
		seriesB = isbar?cloneobj(barConfig): cloneobj(lineConfig),
		seriesC = cloneobj(barConfig),
		seriesD = cloneobj(barConfig),
		seriesE = isbar?cloneobj(barConfig): cloneobj(lineConfig),
		seriesF1 = cloneobj(barConfig),
		seriesF2 = cloneobj(lineConfig),
		seriesG = cloneobj(barConfig),
		seriesH = cloneobj(lineConfig),
		seriesI = cloneobj(barConfig);

	for(let j = 0; j < sceneData.length; j++) {
		let name = sceneData[j]['date_id'].substring(0, 10).replace(/-/g, '');
		label.push(name);
		lineConfig.name = name;
		barConfig.name = name;

		seriesA['data'].push(sceneData[j]['current_week_score']);
		seriesB['data'].push(sceneData[j]['current_week_bad_scene_num']);
		seriesC['data'].push(sceneData[j]['is_exists_alarm']);
		seriesD['data'].push(sceneData[j]['total_gzwy_num']);
		seriesE['data'].push(sceneData[j]['open_rate']);
		seriesF1.yAxisIndex = 0;
		seriesF1['data'].push(sceneData[j]['no_effective_js_num']);
		seriesF2.yAxisIndex = 1;
		seriesF2['data'].push(sceneData[j]['effective_js_rate']);
		seriesG['data'].push(sceneData[j]['tuifu_rate']);
		seriesH['data'].push(sceneData[j]['bihuan_rate']);
		seriesI['data'].push(sceneData[j]['ts_net_problem_num']);
	}
	isbar?barEch(chartA, {
		xAxis: label,
		legend: legend,
		serData: seriesA
	}):afFun(chartA, {
		xAxis: label,
		legend: legend,
		serData: seriesA
	})
	isbar?barEch(chartB, {
		xAxis: label,
		legend: legend,
		serData: seriesB
	}):afFun(chartB, {
		xAxis: label,
		legend: legend,
		serData: seriesB
	})
	barEch(chartC, {
		xAxis: label,
		legend: legend,
		serData: seriesC
	})
	barEch(chartD, {
		xAxis: label,
		legend: legend,
		serData: seriesD
	})
	isbar?barEch(chartE, {
		xAxis: label,
		legend: legend,
		serData: seriesE
	}):afFun(chartE, {
		xAxis: label,
		legend: legend,
		serData: seriesE
	})
	waveFun({
		xAxis: label,
		serData: [seriesF1, seriesF2]
	})
	barEch(chartG, {
		xAxis: label,
		legend: legend,
		serData: seriesG
	})
	afFun(chartH, {
		xAxis: label,
		legend: legend,
		serData: seriesH
	})
	barEch(chartI, {
		xAxis: label,
		legend: legend,
		serData: seriesI
	})
}

function clearChart() {
	fillList([]);
	radarChart([]);
	$('#fugai_rate').text('%');
	$('#rongliang_rate').text('%');
	$('#ganrao_rate').text('%');
	$('#tousu_rate').text('%');
	$('#ganzhi_rate').text('%');
	let label = [];
	let legend = [];
	let seriesA = [],
		seriesB = [],
		seriesC = [],
		seriesD = [],
		seriesE = [],
		seriesF1 = [],
		seriesF2 = [],
		seriesG = [],
		seriesH = [],
		seriesI = [];
	afFun(chartA, {
		xAxis: label,
		legend: legend,
		serData: seriesA
	})
	afFun(chartB, {
		xAxis: label,
		legend: legend,
		serData: seriesB
	})
	barEch(chartC, {
		xAxis: label,
		legend: legend,
		serData: seriesC
	})
	barEch(chartD, {
		xAxis: label,
		legend: legend,
		serData: seriesD
	})
	afFun(chartE, {
		xAxis: label,
		legend: legend,
		serData: seriesE
	})
	waveFun({
		xAxis: label,
		serData: []
	})
	barEch(chartG, {
		xAxis: label,
		legend: legend,
		serData: seriesG
	})
	afFun(chartH, {
		xAxis: label,
		legend: legend,
		serData: seriesH
	})
	barEch(chartI, {
		xAxis: label,
		legend: legend,
		serData: seriesI
	})
}

function afFun(chart, data) {
	chart.clear();
	var afOption = {
		color: ['#4192F7', '#F6A472', '#EECF00', '#65DCA6', '#68C7DA'],
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			right: 0,
			top: 0,
			data: data.legend
		},
		grid: {
			top: '14%',
			left: '3%',
			right: '3%',
			bottom: '1%',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			axisPointer: {
				type: 'shadow'
			},
			axisLine: {
				lineStyle: {
					color: '#cdcdcd'
				}
			},
			axisLabel: {
				interval: 0,
				textStyle: {
					color: '#777'
				}
			},
			axisTick: {
				show: false
			},
			data: data.xAxis
		}],
		yAxis: [{
			type: 'value',
//			name: 'TB',
			nameTextStyle: {
				color: '#000'
			},
			axisLine: {
				show: false,
				lineStyle: {
					color: '#cdcdcd'
				}
			},
			axisLabel: {
				textStyle: {
					color: '#777'
				}
			},
			splitLine: {
				show: false
			},
			axisTick: {
				show: false
			},
		}],
		series: data.serData
	};
	chart.setOption(afOption);
}

function barEch(chart, data) {
	chart.clear();
	var option = {
		color: ['#4192F7', '#F6A472', '#EECF00', '#65DCA6', '#68C7DA'],
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		legend: {
			right: 0,
			top: 0,
			data: data.legend
		},
		grid: {
			top: '14%',
			left: '3%',
			right: '3%',
			bottom: '1%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			axisTick: {
				show: false,
				alignWithLabel: false
			},
			axisLine: {
				lineStyle: {
					color: '#aaa'
				}
			},

			data: data.xAxis
		},
		yAxis: {
			type: 'value',
//			name: '个',
			splitLine: {
				show: false
			},
			axisLine: {
				show: false,
				lineStyle: {
					color: '#aaa'
				}
			},
			axisLabel: {
				formatter: '{value}',
				textStyle: {
					color: '#828282'
				}
			},
			axisTick: {
				show: false
			},
		},
		series: data.serData
	};
	chart.setOption(option, true);
}

function radarChart(data) {
	chartJ.clear();
	var ldOption = {
		tooltip: {
			trigger: 'axis'
		},
		radar: [{
			indicator: [{
					text: '客户满意度',
					max: 150
				},
				{
					text: '基础网络',
					max: 150
				},
				{
					text: '网络感知',
					max: 150
				}
			],
			radius: 50,
			center: ['50%', '44%'],
		}],
		series: [{
			type: 'radar',
			tooltip: {
				trigger: 'item'
			},
			itemStyle: {
				normal: {
					areaStyle: {
						type: 'default'
					},
					color: '#4192F7'
				}
			},
			data: [{
				value: data,
				name: '维度'
			}]
		}]
	};
	chartJ.setOption(ldOption);
}

function waveFun(myData) {
	chartF.clear();
	var waveOption = {
		color: ['#78ACEC', '#4192F7'],
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				crossStyle: {
					color: 'red'
				},
				label: {
					color: '#000'
				}
			}
		},
		grid: {
			top: '14%',
			left: '3%',
			right: '3%',
			bottom: '1%',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			data: myData.xAxis,

			axisPointer: {
				type: 'shadow'
			},
			axisLine: {
				lineStyle: {
					color: '#cdcdcd'
				}
			},
			axisLabel: {
				textStyle: {
					color: '#777'
				}
			},
			axisTick: {
				show: false
			}
		}],
		yAxis: [{
				type: 'value',
				//				name: '超工期未开通量',
				nameTextStyle: {
					color: '#000'
				},
				axisLine: {
					show: false,
					lineStyle: {
						color: '#cdcdcd'
					}
				},
				axisLabel: {
					textStyle: {
						color: '#777'
					}
				},
				splitLine: {
					show: false
				},
				axisTick: {
					show: false
				}
			},
			{
				type: 'value',
				name: '%',
				nameTextStyle: {
					color: '#000'
				},
				axisLine: {
					show: false,
					lineStyle: {
						color: '#cdcdcd'
					}
				},
				axisLabel: {
					textStyle: {
						color: '#777'
					}
				},
				splitLine: {
					show: false
				},
				axisTick: {
					show: false
				}
			}
		],
		series: myData.serData
	};

	chartF.setOption(waveOption);

}

window.onresize = function() {
	chartA.resize();
	chartB.resize();
	chartC.resize();
	chartD.resize();
	chartE.resize();
	chartF.resize();
	chartG.resize();
	chartH.resize();
	chartI.resize();
	chartJ.resize();
}