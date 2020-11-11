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
		_addOption('cityChoice', citylist);

		$$('Scene/dataTimeList', {}, function(result) {
			timeList = result;
			let timelist = [];
			let data = result.hourTime;
			for (var i = 0; i < data.length; i++) {
				timelist.push({
					label: data[i].substring(0, 13),
					value: data[i].substring(0, 13)
				})
			}
			_addOption('time', timelist);
			setTimeout(() => {
				executeQuery();
			}, 200)
		})
	})
	$("#seaBtn").on('click', function() {
		executeQuery();
	})
	$("#download").on('click', function() {
		executeDownload();
	})
	$('.addBtn').on('click', function() {
		$('.app').show()
	})
	$('#cancel').on('click', function() {
		$('.app').hide()
	})
	$('#sure').on('click', function() {
		executeQuery();
		$('.app').hide()
	})
	$('.exportPoint').on('click', function() {
		let city = $("#cityChoice").val();
		let time = $('#time').val().replace(/-/g, '');
		downFile("Scene/ExportHourCityScene", {
			city: city,
			time:time
		})
	})
}

function executeQuery() {

	$('#totallist').html('');
	$('#titleList').html('');
	renderList('xnlist',[]);
	renderList('tslist',[]);
	
	if(chartA){
		chartA.clear();
	}

	let city = $("#cityChoice").val();
	let time = $('#time').val() ||'';
	if(!time)return;
	time=time.replace(/-/g, '').replace(/ /g, '');
	let html = ""

	if (!city) return;
	$$('Scene/hourSummary', {
		city: city,
		time: time,
		sceneStr: '' //scenes.join(',')
	}, (result) => {
		//if (!result) return;

		addTitle(result);
		
		$$('Scene/hourSceneDataList', {
			city: city,
			time: time
		}, (data) => {

			let html = '';
			for (let i = 0; i < data.length; i++) {
				let classText = '';
				if (i % 2 == 1) {
					classText = 'even';
				}
				data[i] = handleNull(data[i]);
				html +=
					`
					<li class="au-row ${classText}">
						<div class="cell cell-0-8">${data[i]['time']}</div>
						<div class="cell cell-0-8">${data[i]['city']}</div>
						<div class="cell cell-0-8">${data[i]['a01']}</div>
						<div class="cell cell-0-8">${data[i]['a02']}</div>
						<div class="cell cell-0-8">${data[i]['a03']}</div>
						<div class="cell cell-0-8">${data[i]['a04']}</div>
						<div class="cell cell-0-8">${data[i]['a05']}</div>
						<div class="cell cell-1-5">${data[i]['a06']}</div>
						<div class="cell cell-1-5">${data[i]['a07']}</div>
					</li>
				`;
			}
			$('#totallist').html(html);
		})
	})
}

var chartA = echarts.init(document.getElementById('map'));


function addTitle(data) {
	let html = '';
	$('#titleList').html('');
	if(!data || !data.length)return;
	let index = 0;
	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < sceneList.length; j++) {
			if (sceneList[j]['name'] == data[i]['scene']) {
				data[i] = handleNull(data[i])
				
				let xn_change = data[i]['a03'];
				let xn_class = 'pink';
				let xn_url = 'img/redArrow.png';
				if (xn_change > 0) {
					xn_url = 'img/greenArrow.png';
					xn_class = 'green';
				} else if (xn_change == 0) {
					xn_url = 'img/fair.png';
					xn_change = '0';
				}

				let ts_change = data[i]['a04'];
				let ts_class = 'pink';
				let ts_url = 'img/redArrow.png';
				if (ts_change > 0) {
					ts_url = 'img/greenArrow.png';
					ts_class = 'green';
				} else if (ts_change == 0) {
					ts_url = 'img/fair.png';
					ts_change = '0';
				}
				let styleText = '';
				if (i > 11) {
					styleText = 'style="display:none;"'
				}
				html +=
					`
					<div class="layui-col-md2" ${styleText}>
						<div class="sixSit">
							<img class="fl imgSit" scene=${data[i]['scene']} src="${sceneList[j]['url']}" />
							<div class="wordDes fr">
								<div class="layui-clear mt7">
									<p class="fl">性能质差场景数：<span>${data[i]['a01']}</span></p>
									<a class="fr"><img src="${xn_url}"/>${xn_change}</a>
								</div>
								<div class="layui-clear mt7">
									<p class="fl">投诉质差场景数：<span>${data[i]['a02']}</span></p>
									<a class="fr"><img src="${ts_url}"/>${ts_change}</a>
								</div>
	
							</div>
						</div>
					</div>
				`;
			}
		}
	}
	$('#titleList').html(html);

	$('#titleList .imgSit').on('click', function() {
		let scene = $(this).attr('scene');
		let imgs = $('#titleList .imgSit');
		for (let i = 0; i < imgs.length; i++) {
			let url = $($('#titleList .imgSit')[i]).attr('src');
			url = url.replace('_active', '');
			$($('#titleList .imgSit')[i]).attr('src', url);
			$($('#titleList .imgSit')[i]).removeClass('active');
		}
		let curr_url = $(this).attr('src');
		curr_url = curr_url.replace('.png', '_active.png');
		$(this).attr('src', curr_url)
		$(this).addClass('active');
		
		requestTable(scene);
		requestChart(scene);
	})
	if (data.length > 0) {
		$($('#titleList .imgSit')[0]).click();
	}
}

function requestTable(scene) {
	renderList('xnlist',[])
	renderList('tslist',[])
	
	let city = $("#cityChoice").val();
	let time = $('#time').val().replace(/-/g, '').replace(/ /g, '');
	$$('Scene/hourTopList', {
		city: city,
		time: time,
		scene: scene,
		flag:1
	}, (result) => {
		renderList('xnlist',result)
	})
	$$('Scene/hourTopList', {
		city: city,
		time: time,
		scene: scene,
		flag:2
	}, (result) => {
		renderList('tslist',result)
	})
}
function requestChart(scene) {
	let city = $("#cityChoice").val();
	let time = $('#time').val().replace(/-/g, '').replace(/ /g, '');
	$$('Scene/hourSimSceneList', {
		city: city,
		time: time,
		scene: scene
	}, (result) => {
		let data={
			xn:[],
			ts:[],
			label:[]
		};
		for(var i=0;i<result.length;i++){
			data.label.push(result[i]['time'].substring(11,16));
			data.xn.push(result[i]['a01']);
			data.ts.push(result[i]['a02']);
		}
		renderChart(chartA, data);
	})
}
function renderList(id, data) {
	$('#' + id).html('');
	let html = '';
	for (let i = 0; i < data.length; i++) {
		let classText = '';
		if (i % 2 == 1) {
			classText = 'even';
		}
		data[i] = handleNull(data[i]);
		data[i]['index'] = data[i]['rate'];
		html +=
			`
			<li class="row ${classText}">
				<div class="cell cell-4 ref-1">${data[i]['subScene']}</div>
				<div class="cell cell-2 ref-2">${data[i]['city']}</div>
				<div class="cell cell-2 ref-3">${data[i]['scene']}</div>
				<div class="cell cell-2 ref-4">${data[i]['index']}%</div>
			</li>
		`;
	}
	$('#' + id).html(html);
	
	$('#'+id+' li').on('click',function(){
		let city = $(this).find('.ref-2').text();
		let time = $('#time').val();
		let scene = $(this).find('.ref-3').text();
		let subScene = $(this).find('.ref-1').text();
		if(id=='xnlist'){
			window.parent.changeMenu(time, city, scene,subScene,1,0);
		}else{
			window.parent.changeMenu(time, city, scene,subScene,0,1);
		}
		
	})
}
	
function renderChart(chart, data) {
	chart.clear();
	var afOption = {
		color: ['#4192F7', '#E16F6F'],
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			right: 0,
			top: 0,
			itemHeight: 0,
			data: ['性能', '投诉']
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
			data: data.label
		}],
		yAxis: [{
			type: 'value',
			splitNumber: 3,
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
		series: [{
					name: '性能',
					type: 'line',
					symbol: 'none',
					smooth: true,
					stack: '性能',
					data: data.xn
				},
				{
					name: '投诉',
					type: 'line',
					symbol: 'none',
					smooth: true,
					stack: '投诉',
					data: data.ts
				}
			]
	};
	chart.setOption(afOption);
}

function addUnTitle(length) {
	let html = '';
	if (!length) length = 12;
	for (let i = 0; i < length; i++) {
		html +=
			`
		<div class="layui-col-md2">
			<div class="sixSit">
				<div class="add-box">
					<img src="img/addBtn.png" />
				</div>
			</div>
		</div>
		`;
	}
	$('#titleList').append(html);
}

function chart(data) {
	var scoreEch = echarts.init(document.getElementById('score5'));
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
			radius: window.screen.width > 1366 ? 96 : 40,
			center: ['50%', '45%'],
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
	scoreEch.setOption(ldOption);
}
