const sceneList = [{
		name: '地铁',
		url: 'img/images/ditie.png'
	},
	{
		name: '停车场',
		url: 'img/images/tingche.png'
	}, {
		name: '服务区',
		url: 'img/images/fuwuqu.png'
	},
	{
		name: '政府办公区',
		url: 'img/images/zhengfu.png'
	},

	{
		name: '场馆',
		url: 'img/images/changguan.png'
	}, {
		name: '疾控中心',
		url: 'img/images/jikong.png'
	}, {
		name: '高速',
		url: 'img/images/gaosu.png'
	}, {
		name: '高铁',
		url: 'img/images/gaotie.png'
	}, {
		name: '高校',
		url: 'img/images/gaoxiao.png'
	}, {
		name: '机场',
		url: 'img/images/jichang.png'
	}, {
		name: '交通枢纽',
		url: 'img/images/jiaotongshuniu.png'
	}, {
		name: '酒店',
		url: 'img/images/jiudian.png'
	},
	{
		name: '居民区',
		url: 'img/images/jumingqu.png'
	},
	{
		name: '美景',
		url: 'img/images/meijing.png'
	}, {
		name: '美食',
		url: 'img/images/food.png'
	}, {
		name: '商业区',
		url: 'img/images/shangyequ.png'
	}, {
		name: '医院',
		url: 'img/images/yiyuan.png'
	}, {
		name: '城区干道',
		url: 'img/images/gandao.png'
	}, {
		name: '底商',
		url: 'img/images/dishang.png'
	},{
		name: '公园',
		url: 'img/images/gongyuan.png'
	}
]

const cityConfig = [
	[{
			field: 'date_id',
			title: '日期',
			minWidth: 124,
			toolbar: '#barDemo'
		}, {
			field: 'city_name',
			title: '地市',
			width: 114
		}, {
			field: 'scene_name',
			title: '场景',
			width: 114
		}, {
			field: 'sub_scene_name_num',
			title: '子场景',
			width: 157
		}, {
			field: 'plan_num',
			title: '规划站点数',
			width: 140
		}, {
			field: 'opened_num',
			title: '开通站点数',
			width: 134
		}, {
			field: 'open_rate',
			title: '规划达成率',
			width: 157
		}, {
			field: 'total_cgi_num',
			title: '现网小区数',
			width: 157
		}, {
			field: 'is_exists_alarm',
			title: '故障小区数',
			width: 147
		}, {
			field: 'good_cell_rate',
			title: '小区完好率',
			width: 147
		}, {
			field: 'current_week_score',
			title: '平均得分（周粒度）',
			minWidth: 104,
		}, {
			field: 'last_week_bad_scene_num',
			title: '上周质差场景数（<80）',
			width: 114
		}, {
			field: 'current_week_bad_scene_num',
			title: '本周质差场景数（<80）',
			width: 114
		}, {
			field: 'bodong_rate',
			title: '较上周增幅（降幅）',
			width: 157
		}, {
			field: 'total_workorder_num',
			title: '派发工单数',
			width: 147
		}, {
			field: 'bihuan_num',
			title: '工单闭环数',
			width: 147
		}, {
			field: 'bihuan_rate',
			title: '闭环占比',
			width: 147
		}, {
			field: 'sheji_cell_num',
			title: '派发工单涉及小区数',
			width: 147
		}

		, {
			field: 'fugai_num',
			title: '覆盖类问题工单数',
			width: 147
		}, {
			field: 'rongliang_num',
			title: '容量类问题工单数',
			width: 147
		}, {
			field: 'ganrao_num',
			title: '干扰类问题工单数',
			width: 147
		}, {
			field: 'qita_num',
			title: '其它类问题工单数',
			width: 147
		}, {
			field: 'last_week_ts_num',
			title: '上周投诉总量（只包含4G且匹配到CGI的投诉）',
			width: 147
		}, {
			field: 'current_week_ts_num',
			title: '本周投诉总量（只包含4G且匹配到CGI的投诉）',
			width: 147
		}, {
			field: 'bodong_num',
			title: '较上周波动',
			width: 147
		}, {
			field: 'ts_voice_num',
			title: '用户投诉分类-语音',
			width: 147
		}, {
			field: 'ts_net_num',
			title: '用户投诉分类-上网',
			width: 147
		}, {
			field: 'ts_cover_num',
			title: '用户投诉分类-覆盖',
			width: 147
		}, {
			field: 'ts_qita_num',
			title: '用户投诉分类-其他',
			width: 147
		}, {
			field: 'ts_net_problem_num',
			title: '投诉匹配现网网络问题数',
			width: 147
		}, {
			field: 'reason_parameter_num',
			title: '投诉原因分类-参数问题',
			width: 147
		}, {
			field: 'reason_ddd_num',
			title: '投诉原因分类-端到端问题',
			width: 147
		}, {
			field: 'reason_cover_num',
			title: '投诉原因分类-覆盖问题',
			width: 147
		}, {
			field: 'reason_disturb_num',
			title: '投诉原因分类-干扰问题',
			width: 147
		}, {
			field: 'reason_capacity_num',
			title: '投诉原因分类-容量问题',
			width: 147
		}, {
			field: 'reason_alarm_num',
			title: '投诉原因分类-故障问题',
			width: 147
		}, {
			field: 'reason_quality_num',
			title: '投诉原因分类-质量问题',
			width: 147
		}, {
			field: 'rrc_connmax',
			title: 'RRC连接最大数',
			width: 147
		}, {
			field: 'RRC_ConnMean',
			title: 'RRC连接平均数',
			width: 147
		}, {
			field: 'RRC_EFFECTIVECONNMAX',
			title: '有效RRC连接最大数',
			width: 147
		}, {
			field: 'RRC_EFFECTIVECONNMEAN',
			title: '有效RRC连接平均数',
			width: 147
		}, {
			field: 'ERAB_NBRMEANESTAB_1',
			title: 'VoLTE语音话务量(爱尔兰)',
			width: 147
		}, {
			field: 'EU0544',
			title: '空口上行业务量(流量MB)',
			width: 147
		}, {
			field: 'EU0545',
			title: '空口下行业务量(流量MB)',
			width: 147
		}

		, {
			field: 'total_gprs',
			title: 'LTE总流量(流量MB)',
			width: 147
		}, {
			field: 'sub_scene_bad_num',
			title: '场景质差小区数',
			width: 147
		}, {
			field: 'sub_scene_bad_rate',
			title: '场景质差小区占比',
			width: 147
		}, {
			field: 'alarm_level',
			title: '告警级别',
			width: 147
		}, {
			field: 'tuifu_num',
			title: '退服小区数',
			width: 147
		}, {
			field: 'scene_cgi_num',
			title: '场景小区数',
			width: 147
		}, {
			field: 'tuifu_rate',
			title: '退服占比',
			width: 147
		}

		, {
			field: 'effective_js_num',
			title: '有效建设站点',
			width: 147
		}, {
			field: 'total_js_num',
			title: '总建设站点',
			width: 147
		}, {
			field: 'effective_js_rate',
			title: '有效开通率',
			width: 147
		}, {
			field: 'total_gzwy_num',
			title: '规建维优数',
			width: 147
		}, {
			field: 'score_bodong',
			title: '与上周比得分波动值',
			width: 147
		}, {
			field: 'bad_scene_num_bodong',
			title: '质差小区波动数',
			width: 147
		}, {
			field: 'problem_cell_num',
			title: '问题小区数',
			width: 147
		}, {
			field: 'w2_score',
			title: '上二周得分',
			width: 147
		}, {
			field: 'w3_score',
			title: '上三周得分',
			width: 147
		}, {
			field: 'is_zc_cgi',
			title: '是否质差场景',
			width: 147
		}, {
			field: 'is_top_zc',
			title: '是否TOP质差场景',
			width: 147
		}, {
			field: 'cccp_cgi_num',
			title: '超长超频小区数',
			width: 147
		}, {
			field: 'last_week_cccp_cgi_num',
			title: '上周超长超频小区数',
			width: 147
		}, {
			field: 'cccp_cgi_num_bodong',
			title: '较上周波动(超长超频)',
			width: 147
		}, {
			field: 'net_preption_score',
			title: '网络感知得分',
			width: 147
		}, {
			field: 'net_preption_full_score',
			title: '网络感知满分',
			width: 147
		}, {
			field: 'net_preption_rate',
			title: '网络感知得分率',
			width: 147
		}, {
			field: 'lw_net_preption_score',
			title: '网络感知上周得分',
			width: 147
		}, {
			field: 'net_preption_score_bodong',
			title: '较上周波动(网络感知)',
			width: 147
		},
		{
			field: 'base_net_score',
			title: '基础网络得分',
			width: 147
		}, {
			field: 'base_net_full_score',
			title: '基础网络满分',
			width: 147
		}, {
			field: 'base_net_rate',
			title: '基础网络得分率',
			width: 147
		}, {
			field: 'lw_base_net_score',
			title: '基础网络上周得分',
			width: 147
		}, {
			field: 'base_net_score_bodong',
			title: '较上周波动(基础网络)',
			width: 147
		}, {
			field: 'gfh_num',
			title: '高负荷小区数',
			width: 147
		}, {
			field: 'lw_gfh_num',
			title: '上周高负荷小区数',
			width: 147
		}, {
			field: 'gfh_num_bodong',
			title: '较上周波动(高负荷)',
			width: 147
		}, {
			field: 'exists_myd_problem_nums',
			title: '存在客户满意度问题问题小区数',
			width: 147
		}, {
			field: 'exists_netprecption_problem_nums',
			title: '网络感知问题小区数',
			width: 147
		}, {
			field: 'exists_basenet_problem_nums',
			title: '基础网络问题小区数',
			width: 147
		}, {
			field: 'exists_4gnet_problem_nums',
			title: '匹配4G网络类小区数',
			width: 147
		}, {
			field: 'top_zc_list',
			title: 'top质差小区得分清单',
			width: 147
		}, {
			field: 'avg_w4_score',
			title: '近4周平均得分',
			width: 147
		}, {
			field: 'last_week_score',
			title: '上一周得分',
			width: 147
		}, {
			field: 'quality_score',
			title: '客户满意度得分（投诉)',
			width: 147
		}, {
			field: 'quality_full_score',
			title: '客户满意度满分（投诉)',
			width: 147
		}, {
			field: 'quality_rate',
			title: '客户满意度得分率（投诉)',
			width: 147
		}, {
			field: 'lw_quality_score',
			title: '客户满意度上周得分（投诉)',
			width: 147
		}, {
			field: 'quality_score_bodong',
			title: '较上周波动（投诉)',
			width: 147
		}, {
			field: 'bihuan_sub_scene_nums',
			title: '闭环子场景数',
			width: 147
		}, {
			field: 'new_bad_sub_scene_nums',
			title: '新增质差子场景数',
			width: 147
		}, {
			field: 'zhicha_nums',
			title: '质差子场景数',
			width: 147
		}
	]
];

const subsceneConfig = [
	[{
			field: 'date_id',
			title: '日期',
			minWidth: 124,
			toolbar: '#barDemo'
		}, {
			field: 'city_name',
			title: '地市',
			width: 114
		}, {
			field: 'scene_name',
			title: '场景',
			width: 114
		}, {
			field: 'sub_scene_name',
			title: '子场景',
			width: 157
		}, {
			field: 'sub_scene_name_level2',
			title: '子场景2',
			width: 157
		}

		, {
			field: 'plan_num',
			title: '规划站点数',
			width: 140
		}, {
			field: 'opened_num',
			title: '开通站点数',
			width: 134
		}, {
			field: 'open_rate',
			title: '规划达成率',
			width: 157
		}, {
			field: 'total_cgi_num',
			title: '现网小区数',
			width: 157
		}, {
			field: 'is_exists_alarm',
			title: '故障小区数',
			width: 147
		}, {
			field: 'good_cell_rate',
			title: '小区完好率',
			width: 147
		}

		, {
			field: 'last_week_score',
			title: '上周得分',
			width: 147
		}, {
			field: 'current_week_score',
			title: '本周得分',
			width: 147
		}, {
			field: 'is_two_week_over_80',
			title: '是否连续两周≥80',
			width: 147
		}, {
			field: 'bodong_rate',
			title: '较上周增幅（降幅）',
			width: 157
		}, {
			field: 'total_workorder_num',
			title: '派发工单数',
			width: 140
		}, {
			field: 'bihuan_num',
			title: '工单闭环数',
			width: 134
		}, {
			field: 'bihuan_rate',
			title: '闭环占比',
			width: 157
		}

		, {
			field: 'sheji_cell_num',
			title: '派发工单涉及小区数',
			width: 157
		}, {
			field: 'fugai_num',
			title: '覆盖类问题工单数',
			width: 157
		}, {
			field: 'rongliang_num',
			title: '容量类问题工单数',
			width: 157
		}, {
			field: 'ganrao_num',
			title: '干扰类问题工单数',
			width: 157
		}, {
			field: 'qita_num',
			title: '其它类问题工单数',
			width: 157
		}, {
			field: 'last_week_ts_num',
			title: '上周投诉总量（只包含4G且匹配到CGI的投诉）',
			width: 157
		}, {
			field: 'current_week_ts_num',
			title: '本周投诉总量（只包含4G且匹配到CGI的投诉）',
			width: 157
		}, {
			field: 'bodong_num',
			title: '较上周波动',
			width: 157
		}, {
			field: 'ts_voice_num',
			title: '用户投诉分类-语音',
			width: 157
		}, {
			field: 'ts_net_num',
			title: '用户投诉分类-上网',
			width: 157
		}, {
			field: 'ts_cover_num',
			title: '用户投诉分类-覆盖',
			width: 157
		}, {
			field: 'ts_qita_num',
			title: '用户投诉分类-其他',
			width: 157
		}, {
			field: 'ts_net_problem_num',
			title: '投诉匹配现网网络问题数',
			width: 157
		}, {
			field: 'reason_parameter_num',
			title: '投诉原因分类-参数问题',
			width: 157
		}, {
			field: 'reason_ddd_num',
			title: '投诉原因分类-端到端问题',
			width: 157
		}, {
			field: 'reason_cover_num',
			title: '投诉原因分类-覆盖问题',
			width: 157
		}, {
			field: 'reason_disturb_num',
			title: '投诉原因分类-干扰问题',
			width: 157
		}, {
			field: 'reason_capacity_num',
			title: '投诉原因分类-容量问题',
			width: 157
		}, {
			field: 'reason_alarm_num',
			title: '投诉原因分类-故障问题',
			width: 157
		}, {
			field: 'reason_quality_num',
			title: '投诉原因分类-质量问题',
			width: 157
		}, {
			field: 'rrc_connmax',
			title: 'RRC连接最大数',
			width: 157
		}, {
			field: 'RRC_ConnMean',
			title: 'RRC连接平均数',
			width: 157
		}, {
			field: 'RRC_EFFECTIVECONNMAX',
			title: '有效RRC连接最大数',
			width: 157
		}, {
			field: 'RRC_EFFECTIVECONNMEAN',
			title: '有效RRC连接平均数',
			width: 157
		}, {
			field: 'ERAB_NBRMEANESTAB_1',
			title: 'VoLTE语音话务量(爱尔兰)',
			width: 157
		}

		, {
			field: 'EU0544',
			title: '空口上行业务量(流量MB)',
			width: 147
		}, {
			field: 'EU0545',
			title: '空口下行业务量(流量MB)',
			width: 147
		}

		, {
			field: 'total_gprs',
			title: 'LTE总流量(流量MB)',
			width: 147
		}, {
			field: 'fugai_rate',
			title: '覆盖占比',
			width: 147
		}, {
			field: 'ganrao_rate',
			title: '干扰占比',
			width: 147
		}, {
			field: 'rongliang_rate',
			title: '容量占比',
			width: 147
		}, {
			field: 'ganzhi_rate',
			title: '感知占比',
			width: 147
		}

		, {
			field: 'tousu_rate',
			title: '投诉占比',
			width: 147
		}, {
			field: 'w2_score',
			title: '上二周得分',
			width: 147
		}, {
			field: 'w3_score',
			title: '上三周得分',
			width: 147
		}, {
			field: 'is_zc_cgi',
			title: '是否为质差场景',
			width: 147
		}, {
			field: 'is_top_zc',
			title: '是否为TOP质差场景',
			width: 147
		}, {
			field: 'cccp_cgi_num',
			title: '超长超频小区数',
			width: 147
		}, {
			field: 'last_week_cccp_cgi_num',
			title: '上周超长超频小区数',
			width: 147
		}, {
			field: 'cccp_cgi_num_bodong',
			title: '较上周波动(超长超频)',
			width: 147
		}, {
			field: 'net_preption_score',
			title: '网络感知得分',
			width: 147
		}, {
			field: 'net_preption_full_score',
			title: '网络感知满分',
			width: 147
		}, {
			field: 'net_preption_rate',
			title: '网络感知得分率',
			width: 147
		}, {
			field: 'lw_net_preption_score',
			title: '网络感知上周得分',
			width: 147
		}, {
			field: 'net_preption_score_bodong',
			title: '较上周波动(网络感知)',
			width: 147
		}, {
			field: 'base_net_score',
			title: '基础网络得分',
			width: 147
		}, {
			field: 'base_net_full_score',
			title: '基础网络满分',
			width: 147
		}, {
			field: 'base_net_rate',
			title: '基础网络得分率',
			width: 147
		}, {
			field: 'lw_base_net_score',
			title: '基础网络上周得分',
			width: 147
		}, {
			field: 'base_net_score_bodong',
			title: '较上周波动(基础网络)',
			width: 147
		}, {
			field: 'gfh_num',
			title: '高负荷小区数',
			width: 147
		}, {
			field: 'lw_gfh_num',
			title: '上周高负荷小区数',
			width: 147
		}, {
			field: 'gfh_num_bodong',
			title: '较上周波动(高负荷)',
			width: 147
		}, {
			field: 'exists_myd_problem_nums',
			title: '存在客户满意度问题问题小区数',
			width: 147
		}, {
			field: 'exists_netprecption_problem_nums',
			title: '网络感知问题小区数',
			width: 147
		}, {
			field: 'exists_basenet_problem_nums',
			title: '基础网络问题小区数',
			width: 147
		}, {
			field: 'exists_4gnet_problem_nums',
			title: '匹配4G网络类小区数',
			width: 147
		}, {
			field: 'top_zc_list',
			title: 'top质差小区得分清单',
			width: 147
		}, {
			field: 'avg_w4_score',
			title: '近4周平均得分',
			width: 147
		}, {
			field: 'quality_score',
			title: '客户满意度得分（投诉)',
			width: 147
		}, {
			field: 'quality_full_score',
			title: '客户满意度满分（投诉)',
			width: 147
		}, {
			field: 'quality_rate',
			title: '客户满意度得分率（投诉)',
			width: 147
		}, {
			field: 'lw_quality_score',
			title: '客户满意度上周得分（投诉)',
			width: 147
		}, {
			field: 'quality_score_bodong',
			title: '较上周波动（投诉)',
			width: 147
		},
	]
];

const cellConfig = [
	[{
			field: 'date_id',
			title: '日期',
			minWidth: 124,
			toolbar: '#barDemo'
		}

		, {
			field: 'cgi',
			title: 'CGI',
			width: 114
		}, {
			field: 'city_name',
			title: '地市',
			width: 114
		}, {
			field: 'scene_name',
			title: '场景',
			width: 114
		}, {
			field: 'sub_scene_name',
			title: '子场景',
			width: 157
		}, {
			field: 'sub_scene_name_level2',
			title: '子场景2',
			width: 157
		}

		, {
			field: 'is_exists_alarm',
			title: '是否存在故障',
			width: 140
		}, {
			field: 'total_workorder_num',
			title: '派发工单数',
			width: 140
		}, {
			field: 'bihuan_num',
			title: '工单闭环数',
			width: 134
		}, {
			field: 'fugai_num',
			title: '派发覆盖类问题工单数',
			width: 147
		}

		, {
			field: 'rongliang_num',
			title: '派发容量类问题工单数',
			width: 147
		}, {
			field: 'ganrao_num',
			title: '派发干扰类问题工单数',
			width: 147
		}, {
			field: 'qita_num',
			title: '派发其它类问题工单数',
			width: 147
		}, {
			field: 'last_week_ts_num',
			title: '上周投诉总量（只包含4G且匹配到CGI的投诉）',
			width: 147
		}, {
			field: 'current_week_ts_num',
			title: '本周投诉总量（只包含4G且匹配到CGI的投诉）',
			minWidth: 104,
		}, {
			field: 'capare',
			title: '较上周波动',
			width: 114
		}

		, {
			field: 'ts_voice_num',
			title: '用户投诉分类-语音',
			width: 114
		}, {
			field: 'ts_net_num',
			title: '用户投诉分类-上网',
			width: 157
		}

		, {
			field: 'ts_cover_num',
			title: '用户投诉分类-覆盖',
			width: 157
		}, {
			field: 'ts_qita_num',
			title: '用户投诉分类-其他',
			width: 147
		}, {
			field: 'ts_net_problem_num',
			title: '投诉匹配现网网络问题数',
			width: 147
		}, {
			field: 'reason_parameter_num',
			title: '投诉原因分类-参数问题',
			width: 147
		}, {
			field: 'reason_ddd_num',
			title: '投诉原因分类-端到端问题',
			width: 147
		}, {
			field: 'reason_cover_num',
			title: '投诉原因分类-覆盖问题',
			width: 147
		}, {
			field: 'reason_disturb_num',
			title: '投诉原因分类-干扰问题',
			width: 147
		}, {
			field: 'reason_capacity_num',
			title: '投诉原因分类-容量问题',
			width: 147
		}, {
			field: 'reason_alarm_num',
			title: '投诉原因分类-故障问题',
			width: 147
		}, {
			field: 'reason_quality_num',
			title: '投诉原因分类-质量问题',
			width: 147
		}

		, {
			field: 'cover_num_110_CMCCAll_MRO',
			title: '移动有效覆盖采样点个数(-110dBm)',
			width: 147
		}, {
			field: 'total_num_CMCCAll_MRO',
			title: '移动采样点个数',
			width: 147
		}, {
			field: 'rrc_connmax',
			title: 'RRC连接最大数',
			width: 147
		}, {
			field: 'is_gfh',
			title: '高负荷小区',
			width: 147
		}, {
			field: 'EU0544',
			title: '空口上行业务量(流量MB)',
			width: 147
		}, {
			field: 'EU0545',
			title: '空口下行业务量(流量MB)',
			width: 147
		}

		, {
			field: 'ENBHN01_ZERO_SIX',
			title: 'CQI0-6数的和',
			width: 147
		}, {
			field: 'ENBHN01_TOTAL',
			title: 'CQI0-15数的和',
			width: 147
		}, {
			field: 'enbhn17',
			title: '小区PRB上行平均干扰电平',
			width: 147
		}, {
			field: 'EU0113',
			title: '无线接通率(QCI=1)',
			width: 147
		}, {
			field: 'eu0204',
			title: '无线掉线率',
			width: 147
		}, {
			field: 'EU0416',
			title: 'VOLTE上行丢包率',
			width: 147
		}, {
			field: 'EU0417',
			title: 'VOLTE下行丢包率',
			width: 147
		}, {
			field: 'EU0536',
			title: '下行用户平均速率',
			width: 147
		}, {
			field: 'is_weak_cover',
			title: '是否为MR弱覆盖率小区',
			width: 147
		}, {
			field: 'is_low_cqi',
			title: '是否为低CQI占比小区',
			width: 147
		}, {
			field: 'is_high_disturb',
			title: '是否为干扰小区',
			width: 147
		}, {
			field: 'is_dijietong',
			title: '是否为低无线接通小区',
			width: 147
		}

		, {
			field: 'is_gaodiaoxian',
			title: '是否为高掉线小区',
			width: 147
		}, {
			field: 'is_up_diubao',
			title: '是否为高上行丢包小区',
			width: 147
		}, {
			field: 'is_down_diubao',
			title: '是否为高下行丢包小区',
			width: 147
		}, {
			field: 'is_xxpjsl',
			title: '是否为低下行用户平均速率小区',
			width: 147
		}, {
			field: 'RRC_ConnMean',
			title: 'RRC连接平均数',
			width: 147
		}, {
			field: 'RRC_EFFECTIVECONNMAX',
			title: '有效RRC连接最大数',
			width: 147
		}, {
			field: 'RRC_EFFECTIVECONNMEAN',
			title: '有效RRC连接平均数',
			width: 147
		}, {
			field: 'ERAB_NBRMEANESTAB_1',
			title: 'VoLTE语音话务量(爱尔兰)',
			width: 147
		}, {
			field: 'total_gprs',
			title: 'LTE总流量(流量MB)',
			width: 147
		}, {
			field: 'total_score',
			title: '小区得分',
			width: 147
		}, {
			field: 'is_problem_cell',
			title: '是否问题小区',
			width: 147
		}, {
			field: 'COVER_TYPE',
			title: '覆盖类型',
			width: 147
		}, {
			field: 'cover_rate_110_CMCCAll_MRO',
			title: 'MR覆盖率(%)',
			width: 147
		}, {
			field: 'EU0205',
			title: 'VOLTE掉话率',
			width: 147
		}, {
			field: 'is_volte_gaodiaohua',
			title: '是否为VOLTE高掉话小区',
			width: 147
		}, {
			field: 'low_cqi_rate',
			title: '低CQI占比',
			width: 147
		}, {
			field: 'net_preption_score',
			title: '网络感知得分',
			width: 147
		}, {
			field: 'net_preption_full_score',
			title: '网络感知满分',
			width: 147
		}, {
			field: 'net_preption_rate',
			title: '网络感知得分率',
			width: 147
		}, {
			field: 'base_net_score',
			title: '基础网络得分',
			width: 147
		}, {
			field: 'base_net_full_score',
			title: '基础网络满分',
			width: 147
		}, {
			field: 'base_net_rate',
			title: '基础网络得分率',
			width: 147
		}, {
			field: 'is_exists_myd_problem',
			title: '是否存在客户满意度问题',
			width: 147
		}, {
			field: 'exists_preption_num',
			title: '存在几类网络感知问题',
			width: 147
		}, {
			field: 'exists_basenet_num',
			title: '存在几类基础网络问题',
			width: 147
		}, {
			field: 'is_cccp_cgi',
			title: '是否超长超频小区',
			width: 147
		}, {
			field: 'quality_score',
			title: '客户满意度得分（投诉)',
			width: 147
		}, {
			field: 'quality_full_score',
			title: '客户满意度满分（投诉)',
			width: 147
		}, {
			field: 'quality_rate',
			title: '客户满意度得分率（投诉)',
			width: 147
		}
	]
];

const holidayConfig = [
	[{
			field: 'year_time',
			title: '年日期',
			minWidth: 124
		}, {
			field: 'holiday_name',
			title: '节假日名称',
			width: 114
		}, {
			field: 'city_name',
			title: '地市',
			width: 114
		}, {
			field: 'scene_name',
			title: '场景',
			width: 114
		}, {
			field: 'sub_scene_name',
			title: '子场景',
			width: 157
		}

		, {
			field: 'gaofuhe_num',
			title: '高负荷小区数',
			width: 140
		}, {
			field: 'gaoganrao_num',
			title: '高干扰小区数',
			width: 134
		}, {
			field: 'is_gaodiaohua',
			title: '高掉话小区数',
			width: 157
		}, {
			field: 'is_gaodiubao',
			title: '高丢包小区数',
			width: 157
		}, {
			field: 'is_dijietong',
			title: '地接通小区数',
			width: 147
		}

		, {
			field: 'usemax',
			title: '无线利用率',
			width: 147
		}, {
			field: 'total_gprs',
			title: '总流量(GB)',
			minWidth: 104,
		}, {
			field: 'volte_dijietong',
			title: 'volte低接通小区数',
			width: 114
		}

		, {
			field: 'volte_gaodiaohua',
			title: 'volte高掉话小区数',
			width: 114
		}, {
			field: 'low_esrvcc_num',
			title: 'esrvcc低切换小区数',
			width: 157
		}

		, {
			field: 'rrc_connmax',
			title: 'RRC连接最大数',
			width: 147
		}, {
			field: 'RRC_ConnMean',
			title: 'RRC连接平均数',
			width: 147
		}, {
			field: 'RRC_EFFECTIVECONNMAX',
			title: '有效RRC连接最大数',
			width: 147
		}, {
			field: 'RRC_EFFECTIVECONNMEAN',
			title: '有效RRC连接平均数',
			width: 147
		}

		, {
			field: 'ERAB_NBRMEANESTAB_1',
			title: 'VoLTE语音话务量(爱尔兰)',
			width: 147
		}, {
			field: 'EU0544',
			title: '空口上行业务量(流量MB)',
			width: 147
		}, {
			field: 'EU0545',
			title: '空口下行业务量(流量MB)',
			width: 147
		}

		, {
			field: 'gaofen_num',
			title: '满意度调查高分客户涉及次数(语音)',
			width: 147
		}, {
			field: 'difen_num',
			title: '满意度调查低分客户涉及次数(语音)',
			width: 147
		}, {
			field: 'chaodifen_num',
			title: '满意度调查超低分客户涉及次数(语音)',
			width: 147
		}

	]
];


const guaranteeConfig = [
	[{
		field: 'TIME',
		title: '时间',
		width: 140
	}, {
		field: 'REGION_NAME',
		title: '地市',
		width: 80
	}, {
		field: 'CITY_NAME',
		title: '区县',
		width: 80
	}, {
		field: 'scene_name_2',
		title: '一级场景',
		width: 120
	}, {
		field: 'scene_name_3',
		title: '二级场景',
		width: 180
	}, {
		field: 'cell_id',
		title: 'CGI',
		width: 170
	}, {
		field: 'ENBAJ02',
		title: '小区名称',
		width: 160
	}, {
		field: 'EU0103',
		title: '无线接通率',
		width: 120
	}, {
		field: 'EU0104',
		title: 'E-RAB建立成功率(QCI=1)',
		width: 170
	}, {
		field: 'EU0113',
		title: 'Volte接通率',
		width: 120
	}, {
		field: 'EU0224',
		title: '无线掉线率',
		width: 120
	}, {
		field: 'EU0205',
		title: 'Volte掉线率',
		width: 160
	}, {
		field: 'EU0306_ESRVCC',
		title: 'eSRVCC切换成功率',
		width: 160
	}, {
		field: 'RRC_EFFECTIVECONNMEAN',
		title: '小区内的平均用户数',
		width: 160
	}, {
		field: 'RRC_EFFECTIVECONNMAX',
		title: '小区内的最大用户数',
		width: 160
	}, {
		field: 'ERAB_NBRMEANESTAB_1',
		title: 'VoLTE语音话务量(爱尔兰)',
		width: 180
	}, {
		field: 'PDCP_UPOCTUL',
		title: '小区用户面上行字节数（KB）',
		width: 180
	}, {
		field: 'PDCP_UPOCTDL',
		title: '小区用户面下行字节数（KB）',
		width: 180
	}, {
		field: 'ENBHA03',
		title: 'RRC连接平均数',
		width: 160
	}, {
		field: 'rrc_connmax',
		title: 'RRC连接最大数',
		width: 120
	}, {
		field: 'is_gfh',
		title: '高负荷小区',
		width: 120
	}, {
		field: 'is_dropline_erl',
		title: '掉话率大于5%且话务量大于1erl的小区',
		width: 220
	}, {
		field: 'is_erl',
		title: '话务量大于1ERL小区',
		width: 160
	}, {
		field: 'is_online_erl',
		title: 'VoLTE接通率<95%且话务量>1爱尔兰的小区',
		width: 220
	}, {
		field: 'is_esrvcc_flag',
		title: 'eSRVCC切换成功率<95%且失败次数>5次的小区',
		width: 220
	}, {
		field: 'EU0416',
		title: 'VOLTE上行丢包率',
		width: 120
	}, {
		field: 'EU0417',
		title: 'VOLTE下行丢包率',
		width: 120
	}, {
		field: 'is_EU0416',
		title: 'VOLTE上行丢包率＞1%且话务量>1爱尔兰的小区',
		width: 220
	}, {
		field: 'is_EU0417',
		title: 'VOLTE下行丢包率＞1%且话务量>1爱尔兰的小区',
		width: 220
	}, {
		field: 'is_zhicha',
		title: '是否质差小区',
		width: 120
	}, {
		field: 'tousu_num',
		title: '投诉数量',
		width: 120
	}]
];


const sceneBgList = [{
		name: '地铁',
		activeIcon: 'scene-ditie',
		icon: ''
	},
	{
		name: '停车场',
		url: 'img/images/tingche.png',
		activeIcon: 'scene-tingche',
		icon: ''
	}, {
		name: '服务区',
		url: 'img/images/fuwuqu.png',
		activeIcon: 'scene-fuwuqu',
		icon: ''

	},
	{
		name: '政府办公区',
		url: 'img/images/zhengfu.png',
		activeIcon: 'scene-zhengfu',
		icon: ''
	},
	{
		name: '场馆',
		url: 'img/images/changguan.png',
		activeIcon: 'scene-changguan',
		icon: ''
	}, {
		name: '疾控中心',
		url: 'img/images/jikong.png',
		activeIcon: 'scene-jikong',
		icon: ''
	}, {
		name: '高速',
		url: 'img/images/gaosu.png',
		activeIcon: 'scene-gaosu',
		icon: ''
	}, {
		name: '高铁',
		url: 'img/images/gaotie.png',
		activeIcon: 'scene-gaotie',
		icon: ''
	}, {
		name: '高校',
		url: 'img/images/gaoxiao.png',
		activeIcon: 'scene-gaoxiao',
		icon: ''
	}, {
		name: '机场',
		url: 'img/images/jichang.png',
		activeIcon: 'scene-jichang',
		icon: ''
	}, {
		name: '交通枢纽',
		url: 'img/images/jiaotongshuniu.png',
		activeIcon: 'scene-jiaotongshuniu',
		icon: ''
	}, {
		name: '酒店',
		url: 'img/images/jiudian.png',
		activeIcon: 'scene-jiudian',
		icon: ''
	},
	{
		name: '居民区',
		url: 'img/images/jumingqu.png',
		activeIcon: 'scene-jumingqu',
		icon: ''
	},
	{
		name: '美景',
		url: 'img/images/meijing.png',
		activeIcon: 'scene-meijing',
		icon: ''
	}, {
		name: '美食',
		url: 'img/images/food.png',
		activeIcon: 'scene-food',
		icon: ''
	}, {
		name: '商业区',
		url: 'img/images/shangyequ.png',
		activeIcon: 'scene-shangyequ',
		icon: ''
	}, {
		name: '医院',
		url: 'img/images/yiyuan.png',
		activeIcon: 'scene-yiyuan',
		icon: ''
	}, {
		name: '城区干道',
		url: 'img/images/gandao.png',
		activeIcon: 'scene-gandao',
		icon: ''
	}, {
		name: '底商',
		url: 'img/images/dishang.png',
		activeIcon: 'scene-dishang',
		icon: ''
	},
	{
		name: '公园',
		url: 'img/images/gongyuan.png',
		activeIcon: 'scene-gongyuan',
		icon: ''
	},
	{
		name: '美食商业区',
		url: 'img/images/foodshangyequ.png',
		activeIcon: 'scene-foodshangyequ',
		icon: ''
	},
	{
		name: '绕城高速出口',
		url: 'img/images/gaosuchukou.png',
		activeIcon: 'scene-gaosuchukou',
		icon: ''
	}
]

const zicakuConfig = [
	[{
		field: 'time',
		title: '时间',
		minWidth: 200,
	}, {
		field: 'a_02',
		title: '地市',
		align:'center',
		width: 114
	}, {
		field: 'a_03',
		title: '场景类别',
		align:'center',
		width: 114
	}, {
		field: 'a_04',
		title: '场景名称',
		width: 157
	}, {
		field: 'a_05',
		title: '小区数',
		width: 140
	}, {
		field: 'a_06',
		title: 'VOLTE高掉话小区占比是否超过门限值',
		width: 300,
		align:'center',
	}, {
		field: 'a_07',
		title: 'VOLTE低接通小区占比是否超过门限值',
		width: 300,
		align:'center',
	},{
		field: 'a_08',
		title: '低用户感知速率小区占比是否超过门限值',
		width: 300,
		align:'center',
	},{
		field: 'a_09',
		title: '上行高干扰小区占比是否超过门限值',
		width: 300,
		align:'center',
	},{
		field: 'a_10',
		title: '故障是否超过门限值',
		width: 157,
		align:'center',
	},{
		field: 'a_11',
		title: '投诉是否超过门限值',
		width: 157,
		align:'center',
	},{
		field: 'a_12',
		title: '触发时间',
		width: 200
	},{
		field: 'a_13',
		title: '触发时间列表',
		width: 200
	},{
		field: 'a_14',
		title: '短信发送时间',
		width: 200
	},{
		field: 'a_15',
		title: '是否闭环(连续12小时)',
		width: 200,
		align:'center',
	},{
		field: 'a_16',
		title: '闭环时间',
		width: 150
	}
	]
]

const zicaxiaoquConfig = [
	[{
		field: 'time',
		title: '时间',
		minWidth: 200,
	}, {
		field: 'a_02',
		title: '地市',
		width: 114,
		align:'center'
	}, {
		field: 'a_03',
		title: '场景类别',
		width: 114,
		align:'center'
	}, {
		field: 'a_04',
		title: '场景名称',
		width: 200
	}, {
		field: 'a_05',
		title: '小区名称',
		width: 200,
	}, {
		field: 'a_06',
		title: 'CGI',
		width: 200,
		align:'center'
	}, {
		field: 'a_07',
		title: '制式',
		width: 157,
		align:'center'
	},{
		field: 'a_08',
		title: 'VOLTE掉话率',
		width: 157,
		align:'center'
	},{
		field: 'a_09',
		title: '是否为VOLTE高掉话小区',
		width: 200,
		align:'center'
	},{
		field: 'a_10',
		title: 'VOLTE接通率',
		width: 157,
		align:'center'
	},{
		field: 'a_11',
		title: '是否为VOLTE低接通小区',
		width: 200,
		align:'center'
	},{
		field: 'a_12',
		title: '用户感知速率',
		width: 157,
		align:'center'
	},{
		field: 'a_13',
		title: '是否为低用户感知速率小区',
		width: 200,
		align:'center'
	},{
		field: 'a_14',
		title: '小区上行高干扰平均电平',
		width: 200,
		align:'center'
	},{
		field: 'a_15',
		title: '是否为行高干扰',
		width: 157,
		align:'center'
	},{
		field: 'a_16',
		title: '告警名称',
		width: 157
	},{
		field: 'a_17',
		title: '是否告警',
		width: 157,
		align:'center'
	},{
		field: 'a_18',
		title: '投诉量',
		width: 157,
		align:'center'
	},{
		field: 'a_19',
		title: '是否投诉',
		width: 157,
		align:'center'
	},{
		field: 'a_20',
		title: '是否质差小区',
		width: 157,
		align:'center'
	}
	]
]

const zicachangjingConfig = [
	[{
		field: 'time',
		title: '时间',
		minWidth: 200,
	}, {
		field: 'a_02',
		title: '地市',
		width: 114,
		align:'center',
	}, {
		field: 'a_03',
		title: '场景类别',
		width: 114,
		align:'center',
	}, {
		field: 'a_04',
		title: '场景名称',
		width: 200
	}, {
		field: 'a_05',
		title: '高掉话问题数',
		width: 140,
		align:'center',
	}, {
		field: 'a_06',
		title: '低接通问题数',
		width: 140,
		align:'center',
	}, {
		field: 'a_07',
		title: '高干扰问题数',
		width: 140,
		align:'center',
	},{
		field: 'a_08',
		title: '告警问题数',
		width: 140,
		align:'center',
	},{
		field: 'a_09',
		title: '投诉问题数',
		width: 140,
		align:'center',
	},{
		field: 'a_10',
		title: '低感知问题数',
		width: 140,
		align:'center',
	},{
		field: 'a_11',
		title: '场景数量',
		width: 140,
		align:'center',
	},{
		field: 'a_12',
		title: '是否高掉话',
		width: 150,
		align:'center',
	},{
		field: 'a_13',
		title: '是否地接通',
		width: 150,
		align:'center',
	},{
		field: 'a_14',
		title: '是否高干扰',
		width: 150,
		align:'center',
	},{
		field: 'a_15',
		title: '是否地感知',
		width: 150,
		align:'center',
	},{
		field: 'a_16',
		title: '是否告警问题',
		width: 157,
		align:'center',
	},{
		field: 'a_17',
		title: '是否投诉问题',
		width: 157,
		align:'center',
	}
	]
]