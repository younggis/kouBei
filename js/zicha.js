function changeBc(index) {
	$($('.zicha-city')[index]).toggleClass('mapbc-' + index);
	$($('.zicha-city')[index]).toggleClass('mapbc-active-' + index);
	$('.zicha-city').each((i, item) => {
		if (i != index) {
			$(item).addClass('mapbc-' + i);
			$(item).removeClass('mapbc-active-' + i);
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
				<div class="zicha-cell-1 cell-4">${data[i]['name']}</div>
				<div class="zicha-cell-1 cell-1">${data[i]['city']}</div>
				<div class="zicha-cell-2 cell-2-5">${data[i]['poperty']}</div>
				<div class="zicha-cell-2 cell-2-5">${data[i]['frequency']}</div>
			</li>
		`;
	}
	$('#zicha-list').html(html);

}

function addScene(data) {
	console.log(data);
	$('.scene-font').each((index, item) => {
		$(item).html = '';
		let html = '';
		let bgClass = sceneBgList.filter(item =>{
			return item.name == data[index]
		})[0].activeIcon;
		console.log(bgClass);
		html =
			`
		<div class="layui-col-md4 h100  ${bgClass} scene-common"></div>
		<div class="layui-col-md8 h100">
			<div class="scene-box">
				<div class="scene-index">
					<span>子场景数量：</span><span class="color-blue"></span>
				</div>
				<div class="scene-index">
					<span>质差场景数：</span><span class="color-green"></span>
				</div>
				<div class="scene-index">
					<span>超长超频质差场景数：</span><span class="color-red"></span>
				</div>
			</div>
		</div>
		`;
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
		$$('Scene/dataTimeList', {}, function(result) {
			timeList = result;
			let timelist = [];
			let data = result.scene;
			for (var i = 0; i < data.length; i++) {
				timelist.push({
					label: data[i].substring(0, 10),
					value: data[i].substring(0, 10)
				})
			}
			_addOption('time', timelist);
			setTimeout(() => {
				// executeQuery();
			}, 200)
		})
	});
	let data = [{
			name: 'S9成映高速',
			city: '成都',
			poperty: '高速',
			frequency: '89'
		},
		{
			name: 'S9成映高速',
			city: '成都',
			poperty: '高速',
			frequency: '89'
		},
		{
			name: 'S9成映高速',
			city: '成都',
			poperty: '高速',
			frequency: '89'
		},
		{
			name: 'S9成映高速',
			city: '成都',
			poperty: '高速',
			frequency: '89'
		},
		{
			name: 'S9成映高速',
			city: '成都',
			poperty: '高速',
			frequency: '89'
		},
		{
			name: 'S9成映高速',
			city: '成都',
			poperty: '高速',
			frequency: '89'
		},
		{
			name: 'S9成映高速',
			city: '成都',
			poperty: '高速',
			frequency: '89'
		},
		{
			name: 'S9成映高速',
			city: '成都',
			poperty: '高速',
			frequency: '89'
		},
		{
			name: 'S9成映高速',
			city: '成都',
			poperty: '高速',
			frequency: '89'
		},
		{
			name: 'S9成映高速',
			city: '成都',
			poperty: '高速',
			frequency: '89'
		},
	]
	addList(data);


	var xData = ['成都', '天府新区', '绵阳', '自贡', '攀枝花', '泸州', '德阳', '遂宁', '广元', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '雅安', '达州',
		'巴中', '资阳', '阿坝', '甘孜', '凉山'
	];
	let a = [],
		b = [];
	var chartObj = {};
	for (let i = 0; i < 22; i++) {
		a.push(Math.random() * (0 - 100) + 100);
		b.push(Math.random() * (0 - 100) + 100);
	}
	showEchart('zccj-chart', xData, a, '#31D3D7', chartObj);
	showEchart('cccp-chart', xData, b, '#F68B71', chartObj);

    var zichaSceneList = ["疾控中心", "服务区", "商业区", "高铁", "居民区", "地铁", "高速", "高校", "政府办公区", "医院", "底商", "停车场"];

	layerForm.on('select(city)', function(data) {
		if (data.value != '全省') {
			$(".city-detail").css('display', 'none');
			$('.city-scene').css('display', 'block');
			addScene(zichaSceneList)
		} else {
			$(".city-detail").css('display', 'block');
			$('.city-scene').css('display', 'none')
		}
	});


}
