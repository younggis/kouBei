/*yangtao
 * @2018.10.23
 */
var sectorHelper = (function() {
	var sectorHelper = {};

	/*生成单个扇形
	 * @point 圆心
	 * @distance 扇形半径
	 * @stangle 起始角度
	 * @angle 扇形角度
	 * @attributes 属性
	 */
	sectorHelper.createSingleSector = function(point, distance, stangle, angle) {
		var coordinates = structureSector(point, distance, stangle, angle);
		return coordinates;
	}

	/*构造扇形
	 * @point 圆心
	 * @distance 扇形半径
	 * @stangle 起始角度
	 * @angle 扇形角度
	 */
	var structureSector = function(point, distance, stangle, angle) {
		var ShanXingR = distance/1000.0;
		var circleR = 0.05;
		var ShanXingAngel = 50;
		var ShanXingPointNum = 50;
		var CirclePointNum = 360;
		var rad = Math.PI / 180;
		var CutRad = 2.5

		var converted = ol.proj.transform([point.x, point.y], 'EPSG:4326', 'EPSG:3857');
		var x = converted[0];
		var y = converted[1];
		
		if(angle >= 360) {//室内
			var coordinates = [];
			for(var i = stangle; i < angle + 1; i++) {
				if(i > 360) i = i % 360;
				var rad_t = i * Math.PI / 180;
				var _x = x + (distance * Math.cos(rad_t));
				var _y = y + (distance * Math.sin(rad_t));
				coordinates.push([_x, _y])
			}
			return coordinates;
		}
		var p_lon = point.x;
		var p_lat = point.y;
		var ShanXingPerPointAngel = ShanXingAngel / ShanXingPointNum;
		var rdloncos = 111.319 * Math.cos(p_lat * rad)
		var coordinates = [
			[x, y]
		];
		
		for(var i = 0; i < angle + 1; i++) {
			if(!stangle) stangle = 0;
			var currentAngel = stangle - ShanXingAngel/2+ShanXingPerPointAngel*i;
			if(currentAngel > 360) currentAngel = currentAngel - 360;
			var rslonX = ShanXingR * Math.sin(currentAngel * rad)
			var rslatX = ShanXingR * Math.cos(currentAngel * rad)
			var lonX = p_lon + (rslonX / rdloncos)
			var latX = p_lat + rslatX / 111.319;
			var converted_t = ol.proj.transform([lonX, latX], 'EPSG:4326', 'EPSG:3857');
			coordinates.push(converted_t);
		}
		coordinates.push([x, y]);
		return coordinates;
	}
	return sectorHelper;
})()