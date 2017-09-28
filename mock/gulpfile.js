var gulp = require('gulp');
var webserver = require('gulp-webserver');
var urlTool = require('url');
var qs = require('qs');

var dataBase = {
    goodslist:[
        {
            name:'zhangsan',
           	password:112233
        },
        {
            name:'lisi',
            password:123123
        }
    ],
    users:[
    	{
    		userName:'zhangsan',
           	password:112233
    	},
    	{
    		userName:'lisi',
           	password:445566
    	}
    ],
    home:'<html><meta charset="utf-8"; /> <style> div{background:red}</style> <div>这是首页</div></html>'
};



function login(userName,password){
    var exist = false;
    var success = false;
    var users = dataBase['users'];
    for(var i = 0,length = users.length ;i < length ; i++){
        if(userName ==  users[i].userName){
            exist = true;
            if(users[i].password == password){
                success = true;
            }
            break;
        }
    }
    return exist ? {success:success} : exist;
}


gulp.task('mockServer',function(){
	gulp.src('.')
        .pipe(webserver({
            port:3000,
            middleware:function(req,res,next){
            	res.setHeader('Access-Control-Allow-Origin','*');
            	var method = req.method;
            	var urlObj = urlTool.parse(req.url);
            	var pathname = urlObj.pathname;
            	var getParams = urlObj.query;

                if(method === 'GET'){
                	switch(pathname){
                		case '/goodslist':
                		res.setHeader('content-type','application/json;charset=utf-8');
                		res.write(JSON.stringify(dataBase['goodslist']));
                		res.end();
                		break;

                		case '/users':
                		res.setHeader('content-type','application/json;charset=utf-8');
                		res.write(JSON.stringify(dataBase['users']));
                		res.end();
                		break;

                		default:
                		res.end('连接失败');
                		break;

                	}
                }else if(method === 'POST'){
                	var postParams = '';
                    req.on('data',function(chunk){
                        postParams += chunk;
                    })

                    req.on('end',function(){
                    	var postParamsObj = qs.parse(postParams);
                    	switch(pathname){
                    		case '/login':
                    		res.setHeader('content-type','application/json;charset=utf-8');
                            var exist = login(postParamsObj.userName,postParamsObj.password);
                            
                            if(exist){
                                if(exist.success){
                                	var data = {
                                		message:'load is success'
                                	}
                                	res.write(JSON.stringify(data));
                                }else{
                                    var error = {
                                		message:'password is error'
                                	}
                                	res.write(JSON.stringify(error));
                                }
                            }else{
                                res.write('userName is noneentity')
                            }
                               
                            res.end();
                    		break;
                    		case '/register':
                    		break;
                    		default:
                    		res.end();
                    		break;
                    	}
                    })

                	
                }else if(method === 'OPTIONS'){

                }

            }
        }))
});
gulp.task('default',['mockServer'])