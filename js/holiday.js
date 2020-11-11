let holidayList = {};

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
		$$('Scene/holidayList', {}, function(result) {
			holidayList = result;
			let timelist = [];
			let holiday = result.holiday;
			let year = result.year;
			for(var i = 0; i < year.length; i++) {
				if(i == 0) {
					getSubHoliday(year[i]);
				}
				timelist.push({
					label: year[i],
					value: year[i]
				})
			}
			for(var i = 0; i < holiday.length; i++) {
				if(timelist.length == 0) {
					if(i == 0) {
						getSubHoliday(holiday[i]);
					}
				}
				timelist.push({
					label: holiday[i],
					value: holiday[i]
				})
			}
			_addOption('yearStr', timelist);
			setTimeout(() => {
				executeQuery();
			}, 200)
			layerForm.on('select(yearStr)', function(data) {
				getSubHoliday(data.value);
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
	$('#seaBtn').on('click', function() {
		executeQuery();
	})

	$('.tabChoice li').click(function() {
		$(this).siblings('li').removeClass("active");
		$(this).addClass("active");
	});

	$('.tabChoiceCity li').on('click', function() {
		fillChartCity('全省');
	})
	$('.tabChoiceCJ li').on('click', function() {
		fillChartScene();
	})
	$('.tabChoiceZC li').on('click', function() {
		fillChartZCScene();
	})
}

function getSubHoliday(data) {
	let holiday = holidayList.holiday;
	let year = holidayList.year;
	if(holiday.includes(data)) {
		let timelist = [];
		for(var i = 0; i < year.length; i++) {
			timelist.push({
				label: year[i],
				value: year[i]
			})
		}
		__addOption('holidayStr', timelist);
	}
	if(year.includes(data)) {
		let timelist = [];
		for(var i = 0; i < holiday.length; i++) {
			timelist.push({
				label: holiday[i],
				value: holiday[i]
			})
		}
		__addOption('holidayStr', timelist);
	}
}
let allData = {};

function executeQuery() {
	let holiday = holidayList.holiday;
	let year = holidayList.year;
	let city = $("#city").val();
	let yearStr = $("#yearStr").val();
	let holidayStr = $('#holidayStr').next().find('.xm-input').attr('title');
	let params = {
		city: city
	};
	if(year.includes(yearStr)) {
		params.yearStr = yearStr;
		params.holidayStr = holidayStr;
	} else {
		params.holidayStr = yearStr;
		params.yearStr = holidayStr;
	}
	$$('Scene/holidaySummary', params, function(result) {
		allData = result;
		fillChartCity(city);
		fillChartScene();
		fillChartZCScene();
		queryTable();
	})
}

var ctChart = echarts.init(document.getElementById('cityTotal'));
var cjTotalChart = echarts.init(document.getElementById('cjTotal'));
var czChart = echarts.init(document.getElementById('cjZc'));

function fillChartCity(city) {
	let field = $('.tabChoiceCity .active').attr('name');
	if(city == '全省') {
		$('.chart').hide();
		$('.tabChoiceCity').show();
		$('#cityTotal').show();
		let label = [];
		let series = [];
		let legend = [];
		let data = allData.city;
		for(let i = 0; i < data.length; i++) {
			label.push(data[i]['cityName']);
			let cityData = data[i]['cityData'];
			for(let j = 0; j < cityData.length; j++) {
				if(!series[j]) {
					series[j] = {
						type: 'bar',
						name:cityData[j]['holiday_name'],
						data: [],
						barWidth: 6,
						itemStyle: {
							normal: {
								barBorderRadius: [7, 7, 0, 0]
							}
						}
					};
					legend.push(cityData[j]['holiday_name'])
				}
				series[j].data.push(cityData[j][field]);
			}

		}
		barEchs(ctChart, {
			xData: label,
			series: series,
			legData: legend
		});
	} else {
		$('.tabChoiceCity').hide();
		$('#cityTotal').hide();
		$('.chart').show();
		let labels = ['高负荷', '高干扰', '高掉话', '高丢包', '低接通', '利用率', '流量(GB)', 'VoLTE话务量/ERL'];
		let fileds = ['gaofuhe_num', 'gaoganrao_num', 'is_gaodiaohua', 'is_gaodiubao', 'is_dijietong', 'usemax', 'total_gprs', 'volte_dijietong'];
		let chartIds = ['chartA', 'chartB', 'chartC', 'chartD', 'chartE', 'chartF', 'chartG', 'chartH'];

		let data = allData.city;

		for(let i = 0; i < labels.length; i++) {
			let series = [];
			let legend = [];
			let cityData=data[0]['cityData'];
			for(let j = 0; j < cityData.length; j++) {
				if(!series[j]) {
					series[j] = {
						type: 'bar',
						name:cityData[j]['holiday_name'],
						data: [],
						barWidth: 6,
						itemStyle: {
							normal: {
								barBorderRadius: [7, 7, 0, 0]
							}
						}
					};
					legend.push(cityData[j]['holiday_name']);
				}
				series[j].data.push(cityData[j][fileds[i]]);
			}
			let chart = echarts.init(document.getElementById(chartIds[i]));
			barEchs(chart, {
				xData: labels[i],
				series: series,
				legData: legend
			});
		}
	}
}

function fillChartScene() {
	let field = $('.tabChoiceCJ .active').attr('name');
	let label = [];
	let series = [];
	let legend = [];
	let data = allData.scene;
	for(let i = 0; i < data.length; i++) {
		label.push(data[i]['sceneName']);
		let sceneData = data[i]['sceneData'];
		for(let j = 0; j < sceneData.length; j++) {
			if(!series[j]) {
				series[j] = {
					type: 'bar',
					name:sceneData[j]['holiday_name'],
					data: [],
					barWidth: 6,
					itemStyle: {
						normal: {
							barBorderRadius: [7, 7, 0, 0]
						}
					}
				};
				legend.push(sceneData[j]['holiday_name'])
			}
			series[j].data.push(sceneData[j][field]);
		}

	}
	barEchs(cjTotalChart, {
		xData: label,
		series: series,
		legData: legend
	});
}

function fillChartZCScene() {
	let field = $('.tabChoiceZC .active').attr('name');
	let label = [];
	let series = [];
	let legend = [];
	let data = allData.scene;
	for(let i = 0; i < data.length; i++) {
		label.push(data[i]['sceneName']);
		let sceneData = data[i]['sceneData'];
		for(let j = 0; j < sceneData.length; j++) {
			if(!series[j]) {
				series[j] = {
					type: 'bar',
					name:sceneData[j]['holiday_name'],
					data: [],
					barWidth: 6,
					itemStyle: {
						normal: {
							barBorderRadius: [7, 7, 0, 0]
						}
					}
				};
				legend.push(sceneData[j]['holiday_name'])
			}
			series[j].data.push(sceneData[j][field]);
		}

	}
	barEchs(czChart, {
		xData: label,
		series: series,
		legData: legend
	});
}

function barEchs(chart, data) {
	console.log(data.legData)
	var option = {
		color: ['#E6746E', '#F6A472', '#EECF00', '#65DCA6', '#68C7DA'],
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		legend: {
			data: data.legData,
			right: 0,
			top: 0,
			itemWidth: 10,
			itemHeight: 10,
			icon: 'circle'
		},
		grid: {
			left: 4,
			right: 0,
			bottom: 0,
			top: 14,
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

			data: data.xData
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
		series: data.series
	};
	chart.setOption(option, true);
}

let isPageJump = false;
function queryTable(pageindex) {
	let holiday = holidayList.holiday;
	let year = holidayList.year;
	let city = $("#city").val();
	let yearStr = $("#yearStr").val();
	let holidayStr = $('#holidayStr').next().find('.xm-input').attr('title');
	let params = {
		city: city
	};
	if(year.includes(yearStr)) {
		params.yearStr = yearStr;
		params.holidayStr = holidayStr;
	} else {
		params.holidayStr = yearStr;
		params.yearStr = holidayStr;
	}
	if(pageindex == undefined) {
		isPageJump = false;
		pageindex = 1;
	}
	params.pageIndex = pageindex;
	params.pageSize = tableNumber;
	$$('Scene/holidayDetail', params, (result) => {
		renderTable(result);
	})
}

function renderTable(result){
	layerTable.render({
		elem: '#subScenDataTab',
		data: result.data ? result.data : [],
		page: false,
		limit: 15,
		cols: holidayConfig,
		even: true
	});
	if(isPageJump) return;

	if(result.pageCount < 2) {
		$('#page').hide();
	} else {
		$('#page').show();
	}
	layerPage.render({
		elem: 'page',
		limit: tableNumber,
		layout: ['prev', 'page', 'next', 'count'],
		count: result.totalCount, //数据总数
		jump: function(obj, first) {
			if(!first) {
				isPageJump = true;
				queryTable(obj.curr)
			}
		}
	});
}

$('.imgBtn').click(function() {
	window.open(baseUrl + 'Scene/ExportHoliday?city=' + $('.cjCity').val() + '&yearStr=' + $('.yearSingle').val() + '&holidayStr=' + formSelects.value('holidayM', 'valStr'));

});

window.onresize = function() {
	ctChart.resize();
	cjTotalChart.resize();
	czChart.resize();
}