//项目统一路径
// const baseUrl="http://223.86.3.47:28080/api/";
const baseUrl="http://10.110.39.173:8080/api/";
var layerLayer = null;
var layerDate = null;
var layerForm = null;
var layerElement = null;
var layerTable = null;
var layerPage = null;
var layerUpload = null;
var formSelects = null;

var loadinglayer; //loading覆盖层

let tableNumber = 14;

$(function() {
	let screenheight = document.documentElement.clientHeight;

	if (screenheight > 768) {
		tableNumber = Math.floor((screenheight - 240) / 38);
	} else {
		tableNumber = Math.floor((screenheight - 210) / 38);
	}


	layui.use(['form', 'laydate', 'layer', 'element', 'table', 'laypage', 'upload'], function() {
		layerLayer = layui.layer;
		layerDate = layui.laydate;
		layerForm = layui.form;
		layerElement = layui.element;
		layerTable = layui.table;
		layerPage = layui.laypage;
		layerUpload = layui.upload;
		formSelects = layui.formSelects;
		if ((typeof init) === 'function') {
			init();
		}
	})
});

function getUserId(url, data, callBack) {
	startLoad();
	$.ajax({
		type: "get",
		url: baseUrl+"User/" + url,
		data: data,
		dataType: 'json',
		timeout: 60000,
		success: function(result) {
			endLoad(loadinglayer);
			if (result.Status == 200) {
				callBack(result.Data);
			} else {
				layerLayer.msg('请求失败', {
					icon: 5
				});
			}

		},
		error: function(error) {
			endLoad(loadinglayer);
			errorBack();
		}
	});
}
//开始加载
function startLoad() {
	loadinglayer = layerLayer.load(0, {
		shade: [0.5, '#000'] //0.1透明度的白色背景
	});
}
//结束加载
function endLoad(idx) {
	layerLayer.close(loadinglayer);
}

function $$(url, data, callBack) {
	startLoad();
	$.ajax({
		type: "get",
		url: baseUrl + url,
		data: data,
		dataType: 'json',
		timeout: 200000,
		success: function(result) {
			endLoad(loadinglayer);
			if (result.Status == 200) {
				callBack(handleNullData(result.Data));
			} else {
				layerLayer.msg(result.Message, {
					icon: 5
				});
			}
		},
		error: function(error) {
			endLoad(loadinglayer);
			errorBack(error);
		}
	});
}

function _$$_(url, data, callBack) {
	$.ajax({
		type: "get",
		url: baseUrl + url,
		data: data,
		dataType: 'json',
		timeout: 2000,
		success: function(result) {
			if (result.Status == 200) {
				callBack(handleNullData(result.Data));
			} else {
				//				layerLayer.msg('请求失败', {
				//					icon: 5
				//				});
			}
		},
		error: function(error) {
			errorBack(error);
		}
	});
}

function handleNullData(data) {
	if (!data) return null;
	if (data.hasOwnProperty('data')) {
		for (var i = 0; i < data.data.length; i++) {
			for (var field in data.data[i]) {
				if (data.data[i][field] == 'NULL' || data.data[i][field] == 'null') {
					data.data[i][field] = '';
				}
			}
		}
	} else {
		for (var i = 0; i < data.length; i++) {
			for (var field in data[i]) {
				if (data[i][field] == 'NULL' || data[i][field] == 'null') {
					data[i][field] = '';
				}
			}
		}
	}
	return data;
}

function handleNull(data) {
	for (let i in data) {
		if (data[i] == null || data[i] == undefined) {
			data[i] = '--';
		}
	}
	return data;
}

function $$$(url, data, callBack) {
	startLoad();
	$.ajax({
		type: "post",
		url: baseUrl + url,
		data: data,
		dataType: 'json',
		timeout: 200000,
		success: function(result) {
			endLoad(loadinglayer);
			callBack(result.Data);
		},
		error: function(error) {
			endLoad(loadinglayer);
			errorBack(error);
		}
	});
}
/****
 * 时间戳转时间
 */
function formatDateTime(inputTime) {
	var date = new Date(inputTime);
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	var second = date.getSeconds();
	minute = minute < 10 ? ('0' + minute) : minute;
	second = second < 10 ? ('0' + second) : second;
	return y + '-' + m + '-' + d + ' ' + ' ' + h + ':' + minute + ':' + second;
}
//请求出错
function errorBack() {
	layerLayer.msg('网络出错！', {
		icon: 5
	});
}
//下载文件
function downFile(url, data) {
	var fields = [];
	var params = '';
	for (var i in data) {
		fields.push(i)
	}
	for (var i = 0; i < fields.length; i++) {
		if (i == 0) {
			params += '?' + fields[i] + '=' + data[fields[i]];
		} else {
			params += '&' + fields[i] + '=' + data[fields[i]];
		}
	}
	window.open(baseUrl + url + params, '_blank')
}
//获取当前url中参数
function getvl(name, url) {
	var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
	if (!url) {
		url = encodeURI(parent.location.href); //location.href
	}
	if (reg.test(url)) {
		var title = RegExp.$2.replace(/\+/g, " ");
		var uriToStr = decodeURI(decodeURI(title));
		return uriToStr;
	}
	return "";
}

/*
    取得目标iframe src所包含的参数
    @param iframeId - 目标iframe的id
    @return Object 参数名值对，｛参数名:参数值,……｝
*/
function getIframeParams(iframeId, name) {
	var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
	var ele = window.parent.document.getElementById(iframeId);
	if(ele) {
		var arr = ele.contentWindow.location.search.match(reg);
		if(arr != null) {
			return {
				name: decodeURI(arr[0].substring(arr[0].search("=") + 1))
			}
		}
	}
	return null;
}

//select动态添加option
function _addOption(id, data) {
	$("#" + id).html('');
	for (var i = 0; i < data.length; i++) {
		var html = '';
		if (i == 0) {
			html = "<option selected value='" + data[i]['value'] + "'>" + data[i]['label'] + "</option>";
		} else {
			html = "<option value='" + data[i]['value'] + "'>" + data[i]['label'] + "</option>";
		}
		$("#" + id).append(html);
	}
	layerForm.render();
}
function __addOption(id, data) {
	$("#" + id).html('');
	for (var i = 0; i < data.length; i++) {
		var html = '';
		if (i == 0) {
			html = "<option selected value='" + data[i]['value'] + "'>" + data[i]['label'] + "</option>";
		} else {
			html = "<option value='" + data[i]['value'] + "'>" + data[i]['label'] + "</option>";
		}
		$("#" + id).append(html);
	}
	formSelects.render("#" + id);
}
/**
 * 得到当前时间
 * 
 * **/
function getCurrentTime() {
	var myDate = new Date();
	myDate.setHours(myDate.getHours());
	var month = (myDate.getMonth() + 1);
	var date = myDate.getDate();
	var hour = myDate.getHours();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (date >= 1 && date <= 9) {
		date = "0" + date;
	}
	if (hour <= 9) {
		hour = "0" + hour;
	}
	var timestr = myDate.getFullYear() + month + date + hour + '0000';
	return timestr;
}
function forwardTime(step) {
	let date = new Date();
	if(step) {
		date.setHours(date.getHours() + step) //小时
	}
	let seperator1 = "-";
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let strDate = date.getDate();
	let hour = date.getHours();
	let minutes = date.getMinutes();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	if(hour >= 0 && hour <= 9) {
		hour = "0" + hour;
	}
	if(minutes >= 0 && minutes <= 9) {
		minutes = "0" + minutes;
	}
	let currentdate = year + seperator1 + month + seperator1 + strDate;
	return currentdate;
}
function isCanReply(value, times) {
	var date = getFullTime(value);
	for (var i = 0; i < times.length; i++) {
		var item = getFullTime(times[i]['time']);
		if (date == item) return times[i]['canReply'];
	}
}

function dateInEnum(value, times) {
	var date = getFullTime(value);
	for (var i = 0; i < times.length; i++) {
		var item = getFullTime(times[i]);
		if (date == item) return true;
	}
	return false;
}

function disableControl(times) {
	var tds = $('.layui-laydate tbody td');
	for (var i = 0; i < tds.length; i++) {
		var item = $($('.layui-laydate tbody td')[i]).attr('lay-ymd');
		var isable = dateInEnum(item, times);
		if (!isable) {
			$($('.layui-laydate tbody td')[i]).addClass('laydate-disabled')
		} else {
			$($('.layui-laydate tbody td')[i]).removeClass('laydate-disabled')
		}
	}
}

function getFullTime(timestr) {
	var date = timestr ? new Date(timestr) : new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	var hour = date.getHours();
	var minutes = date.getMinutes();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	if (hour >= 0 && hour <= 9) {
		hour = "0" + hour;
	}
	if (minutes >= 0 && minutes <= 9) {
		minutes = "0" + minutes;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate;
	return currentdate;
}

//按属性排序
function computetop(order, sortBy) {
	var ordAlpah = (order == 'asc') ? '>' : '<';
	var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
	return sortFun;
}

function excludeSpecial(s) {
	// 去掉转义字符    
	s = s.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
	// 去掉特殊字符    
	s = s.replace(/[\@\#\$\%\^\&\*\(\)\{\}\:\"\L\<\>\?\[\]]/);
	return s;
};
//深拷贝
function deepCopy(obj) {
	var result = Array.isArray(obj) ? [] : {};
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (typeof obj[key] === 'object' && obj[key] !== null) {
				result[key] = deepCopy(obj[key]); //递归复制
			} else {
				result[key] = obj[key];
			}
		}
	}
	return result;
}
function cloneobj(obj) {
	var str, newobj = obj.constructor === Array ? [] : {};
	if(typeof obj !== 'object') {
		return;
	} else if(window.JSON) {
		str = JSON.stringify(obj), //系列化对象
			newobj = JSON.parse(str); //还原
	} else {
		for(var i in obj) {
			newobj[i] = typeof obj[i] === 'object' ?
				cloneObj(obj[i]) : obj[i];
		}
	}
	return newobj;
}