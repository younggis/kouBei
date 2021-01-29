var zichaSceneList = [];
var zichaSceneSelcectList = [];
var chartObj = {};
var switchFlog = true;

function changeBc(index) {
	$($('.zicha-city')[index]).toggleClass('mapbc-' + index);
	$($('.zicha-city')[index]).toggleClass('mapbc-active-' + index);
	$('.zicha-city').each((i, item) => {
		if (i != index) {
			$(item).addClass('mapbc-' + i);
			$(item).removeClass('mapbc-active-' + i);
		}
	});
	let city = $($('.zicha-city')[index]).text();
	let time = dealDate($('#time').val());
	$$('scene/badQualitySummary', {
		time: time,
		city: city
	}, function(result) {
		if (result.dataList.length) {
			initEchartData(result.dataList, 'a_05');
		}
	})

}

function addList(data) {
	$('#zicha-list').html('');
	let html = '';
	for (let i = 0; i < data.length; i++) {
		let classText = '';
		if (i % 2 == 1) {
			classText = 'even';
		}
		data[i] = handleNull(data[i]);
		html +=
			`
			<li class="zicha-cell-row ${classText}">
				<div class="zicha-cell-1 cell-4">${data[i]['a_03']}</div>
				<div class="zicha-cell-1 cell-1">${data[i]['a_01']}</div>
				<div class="zicha-cell-2 cell-2-5">${data[i]['a_02']}</div>
				<div class="zicha-cell-2 cell-2-5">${data[i]['a_04']}</div>
			</li>
		`;
	}
	$('#zicha-list').html(html);

}

function addScene(data) {
	$('.scene-font').each((index, item) => {
		$(item).html = '';
		let html = '';
		if (index < data.length) {
			let a = (data[index]['a_02'] == null ? '-' : data[index]['a_02']);
			let b = (data[index]['a_03'] == null ? '-' : data[index]['a_03']);
			let c = (data[index]['a_04'] == null ? '-' : data[index]['a_04']);
			let bgClass = sceneBgList.filter(item => {
				return item.name == data[index]['a_05']
			})[0].activeIcon;
			html =
				`
			<div class="layui-col-md4 h100  ${bgClass} scene-common"></div>
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
		}
		$(item).html(html);
	})
}


function showEchart(id, xData, data, color, chartObj) {
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
			},
		}, ],
		yAxis: [{
			type: "value",
			minInterval: 1,
			axisLine: {
				show: false,
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				fontSize: 12,
				color: "#999999",
			},
			splitLine: {
				lineStyle: {
					color: "#E9ECF0",
				},
			},
		}],
		series: {
			type: 'bar',
			data: data,
			itemStyle: {
				color: color,
				barBorderRadius: [2, 2, 0, 0]
			},
			barWidth: 6

		},
	};
	if (!chartObj[id]) {
		chartObj[id] = echarts.init(document.getElementById(id));
		chartObj[id].setOption(option);
	} else {
		chartObj[id].setOption(option, true);
	}
	chartObj[id].resize();
}



function initData(city) {
	$$('scene/badQualitySummary', {
		time: dealDate($('#time').val()),
		city: city
	}, function(result) {
		var totalData = result;
		addList(totalData.top);
		if (city == '全省') {
			if (switchFlog) {
				$(".city-detail").css('display', 'none');
				$('.city-scene').css('display', 'block');
				$('.zicha-addBtn').css('display', 'block');
				zichaSceneList = totalData.dataList;
				addScene(zichaSceneList);
				zichaSceneSelcectList = zichaSceneList;
				initSceneSelect(zichaSceneSelcectList);
				initEchartData(totalData.dataList, 'a_05');
			} else {
				$(".city-detail").css('display', 'block');
				$('.city-scene').css('display', 'none');
				$('.zicha-addBtn').css('display', 'none');
				$(".index-font").each((index, item) => {
					let data = totalData.dataList.filter(i => {
						return i['a_01'] == $(item).find('.zicha-city').text();
					});
					$(item).find('.color-blue').text(data[0]['a_02'] == null ? '-' : data[0]['a_02']);
					$(item).find('.color-green').text(data[0]['a_03'] == null ? '-' : data[0]['a_03']);
					$(item).find('.color-red').text(data[0]['a_04'] == null ? '-' : data[0]['a_04']);
					if ($(item).find('.zicha-city').hasClass('mapbc-active-' + index)) {
						$(item).find('.zicha-city').removeClass('mapbc-active-' + index);
						$(item).find('.zicha-city').addClass('mapbc-' + index);
					}
				});
				initEchartData(totalData.dataList, 'a_01');
			}

		} else {
			$(".city-detail").css('display', 'none');
			$('.city-scene').css('display', 'block');
			$('.zicha-addBtn').css('display', 'block');
			zichaSceneList = totalData.dataList;
			addScene(zichaSceneList);
			zichaSceneSelcectList = zichaSceneList;
			initSceneSelect(zichaSceneSelcectList);
			initEchartData(totalData.dataList, 'a_05');
		};
	})
}



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
		$$('scene/badQualityTimeList', {}, function(result) {
			timeList = result;
			let timelist = [];
			let data = result;
			for (var i = 0; i < data.length; i++) {
				timelist.push({
					label: data[i],
					value: data[i]
				})
			}
			_addOption('time', timelist);
			let city = $("#city").val();
			initData(city);
		})
	});

	layerForm.on('switch(switchTest)', function(data) {
		switchFlog = !switchFlog;
		initData('全省');
	})

	layerForm.on('select(city)', function(data) {
		if (data.value != '全省') {
			$(".zicha-swicth .layui-form-switch").css('display','none');
		} else {
			$(".zicha-swicth .layui-form-switch").css('display','block');
		}
	});
	$("#seaBtn").on('click', function() {
		let city = $("#city").val();
		initData(city);
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
		for (var i = 0; i < items.length; i++) {
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
	
	initMap()

}

function initSceneSelect(data) {
	$('#zhichaSceneSelect').html('');
	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < sceneList.length; j++) {
			if (sceneList[j]['name'] == data[i]['a_05']) {
				let btnhtml = '';
				if (i > 11) {
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
		if ($(this).hasClass('active')) {
			let curr_url = $(this).find('img').attr('src');
			curr_url = curr_url.replace('.png', '_unactive.png');
			$(this).find('img').attr('src', curr_url)
			$(this).removeClass('active');

		} else {
			if (num < 12) {
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
	// showEchart('zccj-chart', xData, seriesData1, '#31D3D7', chartObj);
	showEchart('cccp-chart', xData, seriesData2, '#F68B71', chartObj);
}
