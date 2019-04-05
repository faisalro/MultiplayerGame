// See the JQuery documentation at ... 
// http://api.jquery.com/
// http://learn.jquery.com/
// See my JQuery and Ajax notes 

// f(message, success)
import jQuery from 'jquery';
window.jQuery = jQuery;
const $ = window.$;
export function api_login(user, password, f){
	(function ($) {
		$(document).ready(function(){

		$.ajax({ 
			method: "POST", 
			url: "/api/login", 
			contentType:"application/json; charset=utf-8",
			dataType: "json", 
			data: JSON.stringify({ "user": user , "password": password })
		}).done(function(data, text_status, jqXHR){
			f(data, true);
		}).fail(function(err){
			let response = {};
			if("responseJSON" in err)response = err.responseJSON;
			else response = { error: { "Server Error" : err.status } };
			f(response, false);
		});

	  });
	})(jQuery);
	
}
// f(message, success)
export function api_register(data, f){
	(function ($) {
		$(document).ready(function(){

		if(data.user==""){
			f({"error":{ "name": "name is required"}}, false);
			return;
		}
		$.ajax({ 
			method: "POST", 
			url: "/api/user/"+data.user, 
			contentType:"application/json; charset=utf-8",
			dataType: "json", 
			data: JSON.stringify(data)
		}).done(function(data, text_status, jqXHR){
			console.log(text_status); 
			console.log(jqXHR.status); 
			f(data, true);
		}).fail(function(err){
			let response = {};
			if("responseJSON" in err)response = err.responseJSON;
			else response = { error: { "Server Error" : err.status } };
			if("db" in response.error && response.error.db=="SQLITE_CONSTRAINT: UNIQUE constraint failed: user.user"){
				response.error.db="user already taken";
			}
			f(response, false);
		});

	  });
	})(jQuery);
	
}

// f(message, success)
export function api_profile(data, f, credentials){
	(function ($) {
		$(document).ready(function(){

		data.credentials = credentials;
		data.user = credentials.user;
		$.ajax({ 
			method: "PUT", 
			url: "/api/user/"+data.user, 
			contentType:"application/json; charset=utf-8",
			dataType: "json", 
			data: JSON.stringify(data)
		}).done(function(data, text_status, jqXHR){
			console.log(text_status); 
			console.log(jqXHR.status); 
			f(data, true);
		}).fail(function(err){
			let response = {};
			if("responseJSON" in err)response = err.responseJSON;
			else response = { error: { "Server Error" : err.status } };
			f(response, false);
		});

	  });
	})(jQuery);
	
}

// f(message, success)
export function api_profile_load(f, credentials){
	(function ($) {
		$(document).ready(function(){

		var data = { "credentials" : credentials };
		$.ajax({ 
			method: "GET", 
			url: "/api/user/"+credentials.user, 
			dataType: "json", 
			data: { "password" : credentials.password } // send URL encoded credentials
		}).done(function(data, text_status, jqXHR){
			console.log(text_status); 
			console.log(jqXHR.status); 
			f(data, true);
		}).fail(function(err){
			let response = {};
			if("responseJSON" in err)response = err.responseJSON;
			else response = { error: { "Server Error" : err.status } };
			f(response, false);
		});

	  });
	})(jQuery);
	
}

