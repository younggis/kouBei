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
		_addOption('cityChoice', citylist);

		$$('Scene/sceneList', {}, function(result) {
			addSceneList(result);

			$$('Scene/dataTimeList', {}, function(result) {
				timeList = result;
				let timelist = [];
				let data = result.scene;
				for(var i = 0; i < data.length; i++) {
					timelist.push({
						label: data[i].substring(0, 10),
						value: data[i].substring(0, 10)
					})
				}
				_addOption('time', timelist);
				setTimeout(() => {
					executeQuery();
				}, 200)
			})
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
		downFile("Scene/ExportCityScene", {
			city: city
		})
	})

	initMap()
}

function executeQuery() {
	let city = $("#cityChoice").val();
	let time = $('#time').val().replace(/-/g, '');
	clearLayer();
	let html = ""
	let items = $('#queryList .active');
	let scenes = [];
	for(let i = 0; i < items.length; i++) {
		scenes.push($(items[i]).attr('name'));
	}

	if(!city) return;
	$$('Scene/citySceneList', {
		city: city,
		time: time,
		scene: scenes.join(',')
	}, (result) => {
		if(!result) return;
		addCityLayer(result.city);

		addTitle(result.detail);
		let summary = result.summary;
		addList(summary.top)
		renderChart(summary.five)
		html += "<p>" + result.tips + "</p>"
		$("#content").html(html)
	})
}

function renderChart(data) {
	$('#quality_rate').html(data['quality_rate'] + '%');
	//$('#rongliang_rate').html(data['rongliang_rate'] + '%');
	//$('#ganrao_rate').html(data['ganrao_rate'] + '%');
	$('#base_net_rate').html(data['base_net_rate'] + '%');
	$('#net_preption_rate').html(data['net_preption_rate'] + '%');

	chart([data['quality_rate'], data['base_net_rate'], data['net_preption_rate']])
}

function addList(data) {
	$('#subscenelist').html('');
	let html = '';
	for(let i = 0; i < data.length; i++) {
		let classText = '';
		if(i % 2 == 1) {
			classText = 'even';
		}
		data[i] = handleNull(data[i]);
		html += `
			<li class="row ${classText}">
				<div class="cell cell-4">${data[i]['sub_scene_name']}</div>
				<div class="cell cell-2">${data[i]['city_name']}</div>
				<div class="cell cell-2">${data[i]['scene_name']}</div>
				<div class="cell cell-2">${data[i]['current_week_score']}</div>
			</li>
		`;
	}
	$('#subscenelist').html(html);

}

function addSceneList(data) {
	$('#queryList').html('');
	for(let i = 0; i < data.length; i++) {
		for(let j = 0; j < sceneList.length; j++) {
			if(sceneList[j]['name'] == data[i]) {
				let btnhtml = '';
				if(i > 13) {
					btnhtml = `
						<div class="layui-col-md3" name="${sceneList[j]['name']}">
							<img src="${sceneList[j]['url'].replace('.png', '') + '_unactive.png'}">
						</div>
						`;
				} else {
					btnhtml = `
						<div class="layui-col-md3 active"  name="${sceneList[j]['name']}">
							<img src="${sceneList[j]['url']}">
						</div>
						`;
				}

				$('#queryList').append(btnhtml)
			}
		}
	}
	$('#queryList .layui-col-md3').on('click', function() {
		let items = $('#queryList .layui-col-md3');
		let num = $('#queryList .active').length;
		if($(this).hasClass('active')) {
			let curr_url = $(this).find('img').attr('src');
			curr_url = curr_url.replace('.png', '_unactive.png');
			$(this).find('img').attr('src', curr_url)
			$(this).removeClass('active');

			//			for(let i = 0; i < items.length; i++) {
			//				if($(items[i]).attr('name') == $(this).attr('name')) {
			//					$($('#titleList .layui-col-md2')[i]).hide()
			//				}
			//			}
		} else {
			if(num < 12) {
				let curr_url = $(this).find('img').attr('src');
				curr_url = curr_url.replace('_unactive.png', '.png');
				$(this).find('img').attr('src', curr_url)
				$(this).addClass('active');

				//				for(let i = 0; i < items.length; i++) {
				//					if($(items[i]).attr('name') == $(this).attr('name')) {
				//						$($('#titleList .layui-col-md2')[i]).show()
				//					}
				//				}
			}
		}
	})
}

function addTitle(data) {
	let html = '';
	$('#titleList').html('');
	$('#firstline').html('');
	$('#secondline').html('');
	$('#thirdline').html('');

	$('.single-scene').hide();
	$('.situComp').show();

	let index = 0;
	for(let i = 0; i < data.length; i++) {
		for(let j = 0; j < sceneList.length; j++) {
			if(sceneList[j]['name'] == data[i]['scene_name']) {
				data[i] = handleNull(data[i])
				let level = data[i]['alarm_level'];
				let classText = '';
				if(level == '高危预警') {
					classText = 'pink';
				} else if(level == '良好') {
					classText = 'blue';
				} else if(level == '一般') {
					classText = 'yellow';
				} else if(level == '优秀') {
					classText = 'green';
				} else if(level == '预警') {
					classText = 'orange';
				}
				let score_change = '--';
				if(!isNaN(data[i]['score_bodong'])) {
					score_change = parseFloat(data[i]['score_bodong'].toFixed(1));
				}
				let score_class = 'pink';
				let score_url = 'img/redArrow.png';
				if(score_change > 0) {
					score_url = 'img/greenArrow.png';
					score_class = 'green';
				} else if(score_change == 0) {
					score_url = 'img/fair.png';
					score_change = '0';
				}
				let score_change2 = '--';
				if(!isNaN(data[i]['bodong_num'])) {
					score_change2 = parseInt(data[i]['bodong_num']);
				}
				let score_class2 = 'pink';
				let score_url2 = 'img/redArrow.png';
				if(score_change2 > 0) {
					score_url2 = 'img/greenArrow.png';
					score_class2 = 'green';
				} else if(score_change2 == 0) {
					score_url2 = 'img/fair.png';
					score_change2 = '0';
				}

				let scene_change = data[i]['bad_scene_num_bodong'];
				let scene_class = 'pink';
				let scene_url = 'img/redArrow.png';
				if(scene_change > 0) {
					scene_url = 'img/greenArrow.png';
					scene_class = 'green';
				} else if(scene_change == 0) {
					scene_url = 'img/fair.png';
					scene_change = '0';
				}
				let styleText = '';
				if(i > 11) {
					styleText = 'style="display:none;"'
				}
				html += `
					<div class="layui-col-md2" ${styleText}>
						<div class="sixSit">
							<img class="fl imgSit" scene_name=${data[i]['scene_name']} src="${sceneList[j]['url']}" />
							<div class="wordDes fr">
								<div class="layui-clear">
									<p class="fl"><span class="ft19">${data[i]['current_week_score']}</span>分</p>
									<p class="fr">
										<span class="${classText} fl">${data[i]['alarm_level']}</span>
										<a class="fr ${score_class}"><img src="${score_url}"/>${score_change}</a>
									</p>
								</div>
								<div class="layui-clear mt7">
									<p class="fl">质差场景数：<span>${data[i]['current_week_bad_scene_num']}</span></p>
									<a class="fr ${scene_class}"><img src="${scene_url}"/>${scene_change}</a>
								</div>
	
							</div>
						</div>
					</div>
				`;

				let backurl = sceneList[j]['url'].replace('.png', '') + '_icon.png'
				let linehtml = `<li style='width:100%;height:50px;font-size:14px;line-height:45px;'>
				<div style="background: url(${backurl}) no-repeat left center;height:40px;width:10%;" class = 'fl'></div>
				<div class = 'fl'style = 'width:40%;'>${data[i]['scene_name']}</div>
				<div class='fl'style='width:25%;' >${data[i]['current_week_ts_num']}</div>
				<div class='fl'style='width:25%;background:url(${score_url2}) no-repeat left 0px top 20px;;'>${Math.abs(data[i]['bodong_num']) }</div>
				</li>`;
				if(index < 12) {
					$('#firstline').append(linehtml)
				}
				// 				else if(index < 10 && index >= 5) {
				// 					$('#secondline').append(linehtml)
				// 				} else if(index < 15 && index >= 10) {
				// 					$('#thirdline').append(linehtml)
				// 				}
				index++;
			}
		}

	}
	$('#titleList').html(html);
	$('#titleList .imgSit').on('click', function() {
		let scene_name = $(this).attr('scene_name');
		let imgs = $('#titleList .imgSit');
		for(let i = 0; i < imgs.length; i++) {
			let url = $($('#titleList .imgSit')[i]).attr('src');
			url = url.replace('_active', '');
			$($('#titleList .imgSit')[i]).attr('src', url);

			$($('#titleList .imgSit')[i]).removeClass('active');
		}
		let curr_url = $(this).attr('src');
		curr_url = curr_url.replace('.png', '_active.png');
		$(this).attr('src', curr_url)
		$(this).addClass('active');

		//$('.situComp').hide();
		$('.single-scene').show();

		for(let i = 0; i < data.length; i++) {
			if(scene_name == data[i]['scene_name']) {
				addList(data[i].subSceneList)
				renderChart(data[i])
				fillTousuList(data[i]);
				let curr_font_url = curr_url.replace('_active', '_font');
				$('.sc_icon').find('img').attr('src', curr_font_url);
				$('.sc_name').text(scene_name);
				$('.sc_num').text(data[i]['current_week_ts_num']);
			}
		}
		addSceneLayer(allData)
	})

	//addUnTitle();
}

function fillTousuList(data) {
	$('#firstline').html('')
	for(let j = 0; j < sceneList.length; j++) {
		if(sceneList[j]['name'] == data['scene_name']) {
			let score_change2 = '--';
			if(!isNaN(data['bodong_num'])) {
				score_change2 = parseInt(data['bodong_num']);
			}
			let score_class2 = 'pink';
			let score_url2 = 'img/redArrow.png';
			if(score_change2 > 0) {
				score_url2 = 'img/greenArrow.png';
				score_class2 = 'green';
			} else if(score_change2 == 0) {
				score_url2 = 'img/fair.png';
				score_change2 = '0';
			}
			let backurl = sceneList[j]['url'].replace('.png', '') + '_icon.png';
			let linehtml = `<li style='width:100%;height:50px;font-size:14px;line-height:45px;'>
				<div style="background: url(${backurl}) no-repeat left center;height:40px;width:10%;" class = 'fl'></div>
				<div class = 'fl'style = 'width:40%;'>${data['scene_name']}</div>
				<div class='fl'style='width:25%;' >${data['current_week_ts_num']}</div>
				<div class='fl'style='width:25%;background:url(${score_url2}) no-repeat left 0px top 20px;;'>${Math.abs(data['bodong_num']) }</div>
				</li>`;
			$('#firstline').append(linehtml)
		}
	}
}

function addUnTitle(length) {
	let html = '';
	if(!length) length = 12;
	for(let i = 0; i < length; i++) {
		html += `
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

//
//!function(){
//var laydate = layui.laydate,
//  table = layui.table,
//  form = layui.form,
//  $ = layui.jquery;
//
//  /*$(".exportPoint").hover(function(){
//  	$('.mySel').show();
//  },function(){
//  	$('.mySel').hide();
//  }});
//*/
//  $(".imgDiv").hover(
//    function(){
//      $('.mySel').show();
//    } ,
//    function(){
//      $('.mySel').hide();
//    } 
//  ) ;
//
//  $("#layerAdd img").click(function(){
//  	var src = $(this).attr('src');
//  	var attrSrc = $(this).attr('attrSrc');
//  	$(this).attr('src',attrSrc);
//  	$(this).attr('attrSrc',src);
//  });
//
//  $('.addBtn').click(function(){
//  	$('.app').show();
//  });
//
//	table.render({
//	    elem: '#tabTop10'
//	   /* ,url:'/demo/table/user/'*/
//	   ,skin:'nob'
//	    ,cols: [[
//	      {field:'id', title: '名称'}
//	      ,{field:'username', title: '地市'}
//	      ,{field:'sex',title: '属性'}
//	      ,{field:'city', title: '得分'}
//	       
//	    ]]
//	    ,page: true
//	  });
//
//	var scoreEch = echarts.init(document.getElementById('score5'));
//	var ldOption = {
//	    tooltip: {
//	        trigger: 'axis'
//	    },
//	    radar: [
//	        {
//	            indicator: [
//	                {text: '覆盖', max: 100},
//	                {text: '容量', max: 100},
//	                {text: '干扰', max: 100},
//	                {text: '投诉', max: 100},
//	                {text: '感知', max: 100}
//	            ],
//	            radius: 64,
//	            center: ['27%','57%'],
//	        }
//	    ],
//	    series: [
//	        {
//	            type: 'radar',
//	             tooltip: {
//	                trigger: 'item'
//	            },
//	            itemStyle: {
//	                normal: {
//	                    areaStyle: {type: 'default'},
//	                    color: '#4192F7'
//	                }
//	            },
//	            data: [
//	                {
//	                    value: [60,73,85,40,90],
//	                    name: '维度'
//	                }
//	            ]
//	        }
//	    ]
//	};
//	scoreEch.setOption(ldOption);
//
//	window.onresize = function(){
//	  //drChart.resize();
//	 /* accrChart.resize();
//	  apChart.resize();
//    swoChart.resize();
//    crChart.resize(); 
//    arChart.resize(); */
//  }
//}();