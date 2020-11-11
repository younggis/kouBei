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
		$$('Scene/monitorTimeList', {}, function(result) {
			let timelist = [];
			for(var i = 0; i < result.length; i++) {
				timelist.push({
					label: result[i].substring(0, 10),
					value: result[i].substring(0, 10)
				})
			}
			_addOption('time', timelist);
			$$('Scene/sceneList', {}, function(result) {
				let scenelist = [{
					label: '全场景',
					value: '全场景'
				}];
				for(var i = 0; i < result.length; i++) {
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
	})
	$$('Scene/monitorDetailTimeList', {}, function(result) {
		let timelist = [];
		for(var i = 0; i < result.length; i++) {
			timelist.push({
				label: result[i].substring(0, 10),
				value: result[i].substring(0, 10)
			})
		}
		_addOption('exporttime', timelist);
		_addOption('importtime', timelist);
	})

	$('#seaBtn').click(function() {
		executeQuery();
	})

	$('.downMB').click(function() {
		downFile('template/monitor.csv', {});
	})

	layerUpload.render({
		elem: '#upFile',
		url: baseUrl + 'Scene/ImportMonitor',
		accept: 'file' //普通文件
			,
		exts: 'csv',
		data: {
			time: $('.timeEx2').val()
		},
		done: function(res) {
			console.log(res);
		},
		error: function(index, upload) {
			//当上传失败时，你可以生成一个“重新上传”的按钮，点击该按钮时，执行 upload() 方法即可实现重新上传
			console.log(index);
			console.log(upload);

		}
	});

	$('.exportData').click(function() {
		layerLayer.open({
			type: 1,
			title: '导出网元明细',
			closeBtn: false,
			area: ['540px', '360px'],
			shade: 0.8,
			id: 'LAY_layuipro',
			btn: [' 导 出 ', ' 取 消 '],
			btnAlign: 'c',
			moveType: 1,
			content: $("#exDataHtml"),
			success: function(layero) {},
			yes: function(index, layero) {
				window.open(baseUrl + 'Scene/ExportMonitor?time=' + $('.timeEx').val());
				$('#exDataHtml').hide();
				layerLayer.close(index); //如果设定了yes回调，需进行手工关闭
			},
			btn2: function(index, layero) {
				layerLayer.close(index);
				$('#exDataHtml').hide();
				return false;
			}
		});

	});

	$('.inData').click(function() {
		layerLayer.open({
			type: 1,
			title: '导入网元清单',
			closeBtn: false,
			area: ['720px', '360px'],
			shade: 0.8,
			id: 'LAY',
			btn: ['上 传 ', ' 关 闭 '],
			btnAlign: 'c',
			moveType: 1,
			content: $("#inDataHtml"),
			yes: function(index, layero) {
				var formData = new FormData();
				formData.append("file", document.getElementById("addFile").files[0]);
				formData.append("time", $('.timeEx2').val());
				$.ajax({
					url: baseUrl + 'Scene/ImportMonitor',
					type: "POST",
					async: false,
					data: formData,
					processData: false,
					contentType: false,
					beforeSend: function() {},
					success: function(data) {
						$('#inDataHtml').hide();
						layerLayer.close(index); //如果设定了yes回调，需进行手工关闭
					}
				});

			},
			btn2: function(index, layero) {
				$('#inDataHtml').hide();
				layerLayer.close(index);
			}
		});

	});
}

var p6eChart = echarts.init(document.getElementById('page6Ech'));

function barEch(chart, data) {
	var option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		grid: {
			left: 4,
			right: 0,
			bottom: 4,
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
				show: false,
				lineStyle: {
					color: '#999'
				}
			},
			axisLabel: {
				textStyle: {
					color: '#fff'
				}
			},

			data: data.xData
		},
		yAxis: {
			type: 'value',
			name: '个',
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
					color: '#fff'
				}
			},
			axisTick: {
				show: false
			},
		},
		series: {
			name: data.seriesName,
			type: 'bar',
			barWidth: data.barWidth || '20%',
			data: data.seriesData,
			itemStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: '#5C3FE5'
					}, {
						offset: 1,
						color: '#7041F7'
					}]),
					barBorderRadius: [7, 7, 0, 0]
				}
			}

		}
	};
	chart.setOption(option, true);
}

function executeQuery() {
	$('.word1').html('--');
	$('.word2').html('--');
	$('.word3').html('--');
	$('.word4').html('--');
	$('.word5').html('--');
	$('.word6').html('--');
	$('.word7').html('--');
	let time = $('#time').val().replace(/-/g, '');
	let scene = $('#scene').val();
	let city = $('#city').val();
	$$("Scene/monitor", {
		time: time,
		city: city,
		scene: scene
	}, function(result) {
		if(result.summary) {
			result.summary=handleNull(result.summary);
			$('.word1').html(result.summary.current_scene_num);
			$('.word2').html(result.summary.add_scene_num);
			$('.word3').html(result.summary.current_cgi_num);
			$('.word4').html(result.summary.add_cgi_num);
			$('.word5').html(result.summary.reduce_cgi_num);
			$('.word6').html(result.summary.add_cgi_sub_scene_num);
			$('.word7').html(result.summary.reduce_cgi_sub_scene_num);
		}
		var myData = {
			xData: [],
			seriesData: [],
			yName: '个',
			seriesName: '场景分析'
		};
		for(var i = 0; i < result.list.length; i++) {
			myData.xData.push(result.list[i].scene_name);
			myData.seriesData.push(result.list[i].cell_num);

		}
		barEch(p6eChart, myData);
	})
}

window.onresize = function() {
	p6eChart.resize();

}