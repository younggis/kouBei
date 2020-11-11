function init() {
	var userid = getvl('user');
	if (!userid) {
		alert('请从四川移动网优大数据管理平台进入！');
		return;
	}
	getUserId("UserCity", {
		user: userid
	}, function(data) {
		let citylist = [];
		for (var i = 0; i < data.length; i++) {
			var value = data[i]['EnumName'];
			if (data[i]['EnumName'] == '全部') continue;
			citylist.push({
				label: data[i]['EnumName'],
				value: value
			})
		}
		_addOption('city', citylist);
		$$('Scene/sceneList', {}, function(result) {
			let scenelist = [{
				label: '全场景',
				value: '全场景'
			}];
			for (var i = 0; i < result.length; i++) {
				scenelist.push({
					label: result[i],
					value: result[i]
				})
			}
			_addOption('scene', scenelist);
			setTimeout(() => {
				executeQuery();
			}, 200)
		})
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
}

function executeQuery() {
	let city = $("#city").val();
	let scene = $("#scene").val();
	let rangeTime = $('#dayBeg').val();
	let index = rangeTime.indexOf('~');

	let parames = {
		city: city,
		scene: scene,
		sTime: $.trim(rangeTime.substring(0, index - 1)).replace(/-/g, ''),
		eTime: $.trim(rangeTime.substring(index + 1, rangeTime.length)).replace(/-/g, ''),
	}

	$$('Scene/periodicityList', parames, function(result) {
		var csData = {
			xData: [],
			seriesData: [],
			yName: '',
			seriesName: '场景评分'
		};
		var caData = {
			xData: [],
			seriesData: [],
			yName: '',
			seriesName: '投诉分析'
		};
		var wocaData = {
			xData: [],
			seriesData: [],
			yName: '',
			seriesName: '工单闭合分析(%)'
		};
		//新增
		var cmtData = {
			xData: [],
			seriesData: [],
			yName: '',
			seriesName: '小区退服'
		};
		var hlaData = {
			xData: [],
			seriesData: [],
			yName: '',
			seriesName: '高负荷分析'
		};
		var wsaData = {
			xData: [],
			yName: '',
			seriesData1: [],
			seriesData2: [],
			seriesData3: [],
			seriesName1: '客户满意度',
			seriesName2: '基础网络',
			seriesName3: '网络感知',
		}
		for (var i = 0; i < result.length; i++) {
			csData.xData.push(result[i].date_id.split(' ')[0]);
			caData.xData.push(result[i].date_id.split(' ')[0]);
			wocaData.xData.push(result[i].date_id.split(' ')[0]);
			wsaData.xData.push(result[i].date_id.split(' ')[0]);
			//新增
			cmtData.xData.push(result[i].date_id.split(' ')[0]);
			hlaData.xData.push(result[i].date_id.split(' ')[0]);
			//--------------------------------------------------
			cmtData.seriesData.push(result[i].tuifu_num);
			hlaData.seriesData.push(result[i].gfh_num)
			csData.seriesData.push(result[i].current_week_score);
			caData.seriesData.push(result[i].current_week_ts_num);
			wocaData.seriesData.push(result[i].bihuan_rate);
			wsaData.seriesData1.push(result[i].quality_rate);
			wsaData.seriesData2.push(result[i].base_net_rate);
			wsaData.seriesData3.push(result[i].net_preption_rate);
		}

		barEch(csChart, csData);
		barEch(caChart, caData);
		barEch(wocaChart, wocaData);
		barEchs(wsaChart, wsaData);
		//新增
		barEch(cmtChart, cmtData);
		barEch(hlaChart, hlaData);
		//------------------------
	})
}

var csChart = echarts.init(document.getElementById('cjScore'));
var caChart = echarts.init(document.getElementById('comAna'));
var wocaChart = echarts.init(document.getElementById('workOrderCloseAna'));
var wsaChart = echarts.init(document.getElementById('wdScoreAna'));
//新增
var cmtChart = echarts.init(document.getElementById('community'));
var hlaChart = echarts.init(document.getElementById('highLoadAna'));
//------------------------------------------------------------------

function barEch(chart, data) {
	var option = {
		color: ['#78ACEC'],
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		grid: {
			left: 4,
			right: 0,
			bottom: 0,
			top: 30,
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
			name: data.yName,
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
		series: {
			name: data.seriesName,
			type: 'bar',
			barWidth: data.barWidth || 20,
			data: data.seriesData,
			itemStyle: {
				normal: {
					barBorderRadius: [7, 7, 0, 0]
				}
			}

		}
	};
	chart.setOption(option, true);
}



function barEchs(chart, data) {
	var option = {
		color: ['#E6746E', '#F6A472', '#EECF00'],
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
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
			name: '',
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
		series: [{
				name: data.seriesName1,
				type: 'bar',
				barGap: 2,
				barWidth: data.barWidth || '4%',
				data: data.seriesData1,
				itemStyle: {
					normal: {
						barBorderRadius: [7, 7, 0, 0]
					}
				}

			}, {
				name: data.seriesName2,
				type: 'bar',
				barGap: 2,
				barWidth: data.barWidth || '4%',
				data: data.seriesData2,
				itemStyle: {
					normal: {
						barBorderRadius: [7, 7, 0, 0]
					}
				}
			}, {
				name: data.seriesName3,
				type: 'bar',
				barGap: 2,
				barWidth: data.barWidth || '4%',
				data: data.seriesData3,
				itemStyle: {
					normal: {
						barBorderRadius: [7, 7, 0, 0]
					}
				}
			},
		]
	};
	chart.setOption(option, true);
}

window.onresize = function() {
	csChart.resize();
	caChart.resize();
	wocaChart.resize();
	wsaChart.resize();
}
