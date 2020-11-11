let timeList = {};
let flag = 2;
//第三方页面跳入
let isJump=false;

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

			$$('Scene/hourSceneList', {}, function(result) {
				let scenelist_1 = [];
				for (var i = 0; i < result.length; i++) {
					scenelist_1.push({
						label: result[i],
						value: result[i]
					})
				}
				_addOption('scene_1', scenelist_1);

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
						adjustPage();
						executeQuery();
					}, 200)
				})
			})
		})
	})
	$('.groupBtn .btn').click(function() {
		$(".groupBtn .btn").removeClass("active");
		$(this).addClass("active");
		flag = parseInt($(this).attr('num'));
		let timelist = [];
		let data = timeList.scene;

		$('.iszhicha').hide();
		$('.isComplation').hide();
		$('.scene').hide();
		$('.subscene').hide();
		$('.scene-1').hide();
		$('.subscene-1').hide();
		
		if (flag == 1) {
			$('.scene').hide();
			$('.subscene').hide();
			data = timeList.city;
		} else if (flag == 2) {
			$('.scene').show();
			$('.subscene').hide();
			data = timeList.scene;
		} else if (flag == 3) {
			$('.scene').show();
			$('.subscene').show();
			data = timeList.subScene;
		} else if (flag == 4) {
			$('.scene').show();
			$('.subscene').show();
			data = timeList.cell;
		} else if (flag == 5) {
			$('.scene-1').show();
			$('.subscene-1').show();
			$('.iszhicha').show();
			$('.isComplation').show();
			data = timeList.hourTime;
		}
		for (var i = 0; i < data.length; i++) {
			timelist.push({
				label: flag == 5 ?data[i].substring(0, 13):data[i].substring(0, 10),
				value: flag == 5 ?data[i].substring(0, 13):data[i].substring(0, 10),
			})
		}
		_addOption('time', timelist);
	})
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
	layerForm.on('select(subscene_1)', function(data) {
		$("#HandoverCompany_1").val(data.value);
		$("#subscene_1").next().find("dl").css({
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
		if (!cpLock) {
			search()
		}
	});
	
	let cpLock_1 = false;
	$('#HandoverCompany_1').on('compositionstart', function() {
		cpLock_1 = true;
	});
	$('#HandoverCompany_1').on('compositionend', function() {
		cpLock_1 = false;
		search_1()
	});
	
	$('#HandoverCompany_1').on('input', function() {
		if (!cpLock_1) {
			search_1()
		}
	});
}
function adjustPage(){
	var params=getIframeParams('ifrm', 'isBad');
	if(params){
		isBad = params['name'];
		var time = getIframeParams('ifrm', 'time')['name'];
		var city = getIframeParams('ifrm', 'city')['name'];
		var scene = getIframeParams('ifrm', 'scene')['name'];
		var subScene = getIframeParams('ifrm', 'subScene')['name'];
		var isComplation = getIframeParams('ifrm', 'isComplation')['name'];
		if(isBad){
			isJump=true;
			flag=5;
			$('.scene').hide();
			$('.subscene').hide();
			$('.scene-1').show();
			$('.subscene-1').show();
			$('.iszhicha').show();
			$('.isComplation').show();
			
			$('.groupBtn .btn').siblings('p').removeClass('active');
			$($('.groupBtn .btn')[4]).addClass('active');
			var data=timeList.hourTime;
			var timelist=[];
			for (var i = 0; i < data.length; i++) {
				timelist.push({
					label: flag == 5 ?data[i].substring(0, 13):data[i].substring(0, 10),
					value: flag == 5 ?data[i].substring(0, 13):data[i].substring(0, 10),
				})
			}
			_addOption('time', timelist);
			
			
			$('#time').val(time);
			$('#city').val(city);
			$('#scene_1').val(scene);
			$('#subscene_1').val(subScene);
			$('#HandoverCompany_1').val(subScene);
			$('#iszhicha').val(isBad);
			$('#isComplation').val(isComplation);
			layerForm.render();
		}
	}
}

function search_1() {
	let key = $('#HandoverCompany_1').val();
	let scene = $('#scene_1').val();
	if (scene == '全场景') scene = '';
	if (key) {
		_$$_('Scene/searchHourSubSceneList', {
			scene: scene,
			key: key
		}, function(result) {
			let sublist = [];
			for (var i = 0; i < result.length; i++) {
				sublist.push({
					label: result[i],
					value: result[i]
				})
			}
			_addOption('subscene_1', sublist);
			$("#subscene_1").next().find("dl").css({
				"display": "block"
			});
		})
	}
}
function search() {
	let key = $('#HandoverCompany').val();
	let city = $('#city').val();
	let scene = $('#scene').val();
	if (city == '全省') city = '';
	if (scene == '全场景') scene = '';
	if (key) {
		_$$_('Scene/searchSubScene', {
			city: city,
			scene: scene,
			key: key
		}, function(result) {
			let sublist = [];
			for (var i = 0; i < result.length; i++) {
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

$('.imgBtn').click(function() {
	
	if (flag == 1) {
		window.open(baseUrl + 'Scene/ExportData?time=' + $('.timeLH').val().replace(/-/g, '') + '&city=' + $('.cjCity').val() +
			'&flag=1');
	} else if (flag == 2) {
		window.open(baseUrl + 'Scene/ExportData?time=' + $('.timeLH').val().replace(/-/g, '') + '&city=' + $('.cjCity').val() +
			'&scene=' + $('.cjSelSingle').val() + '&flag=2');
	}else if (flag == 5){
		let time = $('#time').val().replace(/-/g, '').replace(/ /g, '');
		let city = $('#city').val();
		let scene = $('#scene_1').val();
		let subScene = $("#HandoverCompany_1").val();
		let isBad = $("#iszhicha").val();
		let isComplation = $("#isComplation").val();
		
		window.open(baseUrl + 'Scene/hourSceneCellPage?city=' + city + '&time=' + time+ '&scene=' + scene+ '&subScene=' + subScene+ '&isBad='+isBad+ '&isComplation='+isComplation);
	} else {
		window.open(baseUrl + 'Scene/ExportData?time=' + $('.timeLH').val().replace(/-/g, '') + '&city=' + $('.cjCity').val() +
			'&scene=' + $('.cjSelSingle').val() + '&flag=' + flag + '&subscene=');
	}

});
let isPageJump = false;

function executeQuery(pageindex) {
	
	renderTotalTable({
		data:null
	})
	let time = $('#time').val().replace(/-/g, '').replace(/ /g, '');
	let city = $('#city').val();
	
	if (pageindex == undefined) {
		isPageJump = false;
		pageindex = 1;
	}
	
	if(flag==5){
		let scene = $('#scene_1').val();
		let subscene = $("#HandoverCompany_1").val();
		let isBad = $("#iszhicha").val();
		let isComplation = $("#isComplation").val();
		let params = {
			time: time,
			city: city,
			scene: scene,
			subscene: subscene,
			isBad: isBad,
			isComplation: isComplation,
			pageIndex: pageindex,
			pageSize: tableNumber
		}
		$$('Scene/hourSceneCellPage', params, (result) => {
			renderTotalTable(result);
		})
	}else{
		let scene = $('#scene').val();
		let subscene = $("#HandoverCompany").val();
		let params = {
			time: time,
			city: city,
			scene: scene,
			subscene: subscene,
			flag: flag,
			pageIndex: pageindex,
			pageSize: tableNumber
		}
		$$('Scene/dataPage', params, (result) => {
			renderTotalTable(result);
		})
	}
}

function renderTotalTable(result) {
	let config = cityConfig;
	if (flag == 3) {
		config = subsceneConfig;
	} else if (flag == 4) {
		config = cellConfig;
	} else if (flag == 5) {
		config = guaranteeConfig;
	}
	layerTable.render({
		elem: '#cjCityTab',
		data: result.data ? result.data : [],
		page: false,
		limit: 15,
		cols: config,
		even: true
	});
	if (isPageJump) return;

	if (result.pageCount < 2) {
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
			if (!first) {
				isPageJump = true;
				executeQuery(obj.curr)
			}
		}
	});
}
