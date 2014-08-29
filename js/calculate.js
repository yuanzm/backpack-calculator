$(function() {
	$("#calculate").click(function() {
		calculate.init();
	});
});
//背包算法
function knapsack(a, limitW,limit) {
	var totV = 0, maxV = 0.00; //totV定义最大价值，maxV定义最大重量
	var option = [],cop = []; //option为数字对应的下标
	var N = a.length;
	for(var i = 0;i < a.length;i++) {
		totV += a[i].value;
	}

	function find(i, tw, tv) {
		var k;
		//考虑物品i放入背包的情况
		if ((parseFloat(tw) + parseFloat(a[i].weight)).toFixed(2) <= parseFloat(limitW)) {
			cop[i] = a[i].index;
			if ((parseFloat(tw) + parseFloat(a[i].weight)).toFixed(2) == parseFloat(limitW)) {
				var count = 0;
				for (var j = 0;j < cop.length;j++) {
					if (cop[j] > 0) {
						count++;
					}
				}
				if (count <= limit) {
					var temp = 0.00;
					var tempArray = [];
					for (var j = 0;j < cop.length;j++) {
						if (cop[j] > 0) {
							tempArray.push(cop[j]);
							temp = (parseFloat(temp) +  parseFloat(a[cop[j] - 1].weight)).toFixed(2);
						}
					}
					if (temp == limitW) {
						$("#all").append("<span class = 'ans'>" + tempArray + "<br></span>");
					}
				}
			}
			if (i < N - 1) {
				find(i + 1, (parseFloat(tw) + parseFloat(a[i].weight)).toFixed(2), tv);
			}
		}
		//考虑物品i不放入背包的情况，此状态可以剪掉部分节点
		if (tv - a[i].value > maxV) {
			cop[i] = 0;
			if (i < N - 1) {
				find(i + 1, parseFloat(tw).toFixed(2), tv - a[i].value);
			}
		}
	}
	find(0.00, 0.00, totV);
}

calculate ={
	pattern : /,/g, //正则匹配字符串中的逗号
	init: function() {
		this.initWindow();
		if (this.handleValid()) {
			this.calcul();
			if ($(".ans").length == 0) {
				$("#all").append("<span class = 'ans'>没有找到哦<br></span>");
			}
		}
	},
	initWindow: function() {
		$(".ans").remove();
		$(".input-tips").text("");
	},
	calcul: function() {
		var a = [],b = [];
		var count = 1;
		var numbers = $("#numbers").val().split("\n");
		var answer = parseFloat($("#answer").val()).toFixed(2);
		var limitNum = $("#limit").val().length > 0?parseFloat($("#limit").val()):numbers.length;
		for(var i = 0;i < numbers.length;i++) {
			if (numbers[i] != '') {
				var numVal = numbers[i].trim().replace(this.pattern,"");
				if (parseFloat(numVal).toFixed(2) == answer) {
					b.push(i + 1);
				}
				a.push({
					weight: parseFloat(numVal).toFixed(2),
					value: 1,
					index: count
				});
				count++;
			}
		}
		if (a.length > 0) {
			knapsack(a, answer,limitNum);
		}
		if (b.length > 0) {
			$("#equal-score").append("<span class = 'ans'>"+ b +"<br></span>");
		}
	},
	handleValid: function() {
		var inputTip = valid.validEmpty();
		var validArray = valid.validData();
		var scoreTip = valid.validScore();
		if (inputTip != "") {
			$(".input-tips").text(inputTip);
			return false;
		}
		if (inputTip == "" && validArray.length > 0) {
			$(".input-tips").text("您输入数据的第 " + validArray + " 项不是整数或者小数" );
			$("#answer").focus();
			return false;
		}
		if (inputTip == "" && scoreTip != ""){
			$(".input-tips").text(scoreTip);
			return false;
		}
		return true;
	}
}
var valid = {
	pattern : /,/g, //正则匹配字符串中的逗号
	isFloat: /^\d+(\.\d+)?$/,
	isInt: /^[0-9]*[1-9][0-9]*$/,
	validEmpty: function() {
		var tip = "";
		var answer = $("#answer").val();
		var numbers = $("#numbers").val();
		if (numbers.length > 0 && answer == "") {
			tip = "请输入您希望得到的结果";
		}
		if (numbers == "" && answer.length > 0) {
			tip = "请输入您希望统计的数据";
		}
		return tip;
	},
	validData: function() {
		var wrongIndex = [];
		var numbers = $("#numbers").val().split("\n");
		for (var i = 0;i < numbers.length;i++) {
			var tempVal = numbers[i];
			if (tempVal.length > 0) {
				var numVal = tempVal.trim().replace(this.pattern,"");
				if(!this.isInt.test(numVal) && !this.isFloat.test(numVal)) {
					wrongIndex.push(i + 1);
				}
			}
		}
		return wrongIndex;
	},
	validScore: function() {
		var tip = "";
		var answer = $("#answer").val();
		if (answer != "") {
			if (!(this.isInt.test(answer)) && !(this.isFloat.test(answer))) {
				tip = "您希望得到的结果必须是整数或者小数";
			}
		}
		return tip;
	}
}