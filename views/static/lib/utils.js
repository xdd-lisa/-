define(function(){
	return {
		getQueryObj:function(){
			var strArr = location.search.slice(1).split("&");

			var result = {};

			for (var i = 0; i < strArr.length; i++) {
				result[strArr[i].split("=")[0]] = strArr[i].split("=")[1];
			}

			return result;
		},
		getQuery: function (key){
            return this.getQueryObj()[key];
        }
	}
})