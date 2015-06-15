var http = require("http");
var fs = require('fs');
var server = new http.Server();
server.listen(8000);
server.on('request',function(request,response){
	var url = require('url').parse(request.url);
	var filename = url.pathname.substring(1);
	var type;
	switch(filename.substring(filename.lastIndexOf('.')+1)){
		case "html":
		case "htm":
			type = "text/html;charset=UTF-8";break;
		case "js":
			type = "application/javascript;charset=UTF-8";break;
		case "css":
			type = "text/css;charset=UTF-8";break;
		case "txt":
			type = "text/plain;charset=UTF-8";break;
		case "manifest":
			type = "text/cache-manifest;charset=UTF-8";break;
		default:
			type = "application/octet-stream";break;
	}
	fs.readFile(filename,function(err,content){
		if(err){
			response.writeHead(404,{
				"Content-Type":"text/plain;charset=UTF-8"
			});
			response.write(err.message);
			response.end();
		}
		else{
			response.writeHead(200,{"Content-Type":type});
			response.write(content);
			response.end();
		}
	});
});
/*function checkOut(margin){
	if(margin==0){
		return 0;
	}else if(margin==1){
		return 1;
	}else if((margin+1)<margin){
		return 0;
	}
};
function rowCarousel(ul){
	var x = parseInt(ul.css('marginTop')),
		flag = checkOut(x)||0;
    if((x>-110||x==0)&&flag==0){
        x-=1;
        ul.css('marginTop',x+'px');
    }else if(x==-110){
        flag=1;
        x+=1;
        ul.css('marginTop',x+'px');
    }else if((x>-110&&x<0)&&flag==1){
        x+=1;
        ul.css('marginTop',x+'px');
    }else if(x==0){
        flag=0;
        x-=1;
        ul.css('marginTop',x+'px');
    }else{
        return 0;
    }
}*/
