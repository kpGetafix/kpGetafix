// Manage core logic by this variable
var Settlement = [];
Settlement.in_array = function(needle,
 haystack, strict = false)
{
	var key = '';
	// we prevent the double check (strict && arr[key] === ndl) || 
	// (!strict && arr[key] == ndl)
	// in just one for, in order to improve the performance 
	// deciding wich type of comparation will do before walk array
	if (strict)
	{
		for (key in haystack)
		{
			if (haystack[key] === needle)
			{
				return true;
			}
		}
	}
	else
	{
		for (key in haystack)
		{
			if (haystack[key] == needle)
			{
				return true;
			}
		}
	}
	return false;
}
Settlement.array_keys = function(input, search_value, argStrict)
{

	var search = typeof search_value !== 'undefined',
		tmp_arr = [],
		strict = !!argStrict,
		include = true,
		key = '';

	for (key in input)
	{
		if (input.hasOwnProperty(key))
		{
			include = true;
			if (search)
			{
				if (strict && input[key] !== search_value)
				{
					include = false;
				}
				else if (input[key] != search_value)
				{
					include = false;
				}
			}
			if (include)
			{
				tmp_arr[tmp_arr.length] = key;
			}
		}
	}
  	// Normal array converting into object 
	return Object.assign({}, tmp_arr);
}
// ------------------------
// Function : default_key
// This is an alternate function which 
// is find default key of map.
// We assume that passing parameter is a 
// Object of javascript.
Settlement.default_key = function (obj) {
	var result = 0;
	Object.entries(obj).map(item => {
		// It's not 100 % accurate when 
		// given key = 1 or key = "1" 
		// both same in javascript.
		// Or key is an string in javascript object.
		const num = Number(item[0]);
	    // Check key is integer and key 
    	// is not less than result
	  	if(Number.isInteger(num) && 
    		num >= result)
    	{
    		// Get new key
    		result = num + 1;
    	}
	})
	// Important set empty 
	// when access [][] 
	// array of array.
	obj[result] = {};
	return result;
}
Settlement.implode = function(glue, pieces)
{
	
	var	retVal = '';
	var	tGlue = '';
	if (arguments.length === 1)
	{
		pieces = glue;
		glue = '';
	}
	if (typeof pieces === 'object')
	{
		if (Object.prototype.toString.call(pieces) === '[object Array]')
		{
			return pieces.join(glue);
		}
		for (const i in pieces)
		{
			retVal += tGlue + pieces[i];
			tGlue = glue;
		}
		return retVal;
	}
	return pieces;
}
//---------------------------------
// kalkicode.com 
// These methods have not been changed by our tools.
// file_get_contents
// json_decode
// http_response_code
// header
// validate
// curl_init
// json_encode
// curl_setopt_array
// curl_exec
// curl_close
// main
//----------------------------

/**
 * Email to Slack
 *
 * @author Mehdi Chaouch (@MehdiChch)
 * @license MIT
 * @see https://github.com/mehdichaouch/email-to-slack
 */
function validate()
{
    json = json_decode(file_get_contents('php://input'), true);
    if ('message' != json['event']['type']) {
        http_response_code(422);
        // event type must be `message`
        exit;
    }
    appId = json['api_app_id'] === _ENV['APP_ID'];
    token = json['token'] === _ENV['VERIFICATION_TOKEN'];
    teamId = json['team_id'] === _ENV['TEAM_ID'];
    channel = typeof json['event']['channel'] !== 'undefined' && json['event']['channel'] === _ENV['USLACKBOT_CHANNEL'];
    user = typeof json['event']['user'] !== 'undefined' && 'USLACKBOT' === json['event']['user'];
    subtype = typeof json['event']['subtype'] !== 'undefined' && 'file_share' === json['event']['subtype'];
    error = '';
    if (appId && token && teamId && channel && user && subtype) {
        return true;
    } else if (!appId) {
        error = 'APP_ID is not right!';
    } else if (!token) {
        error = 'TOKEN is not right!';
    } else if (!teamId) {
        error = 'TEAM_ID is not right!';
    } else if (!channel) {
        error = 'USLACKBOT channel is not right!';
    } else {
        if (Settlement.in_array('X-Slack-Retry-Num', _SERVER)) {
            http_response_code(409);
            exit('Duplicate');
        }
    }
    http_response_code(400);
    exit(error);
}
function main()
{
    if ('GET' === _SERVER['REQUEST_METHOD']) {
        header('Location: //github.com/mehdichaouch/email-to-slack', true, 303);
        // RTFM
        exit;
    }
    if ('POST' === _SERVER['REQUEST_METHOD']) {
        json = json_decode(file_get_contents('php://input'), true);
        if (Settlement.in_array('challenge', Settlement.array_keys(json))) {
            header('Content-Type: text/plain');
            exit(json['challenge']);
        }
        if (validate()) {
            email = json['event']['files'][0];
            allTo = {};
            foreach (email['to'] as emailTo) {
                k__1 = Settlement.default_key(allTo);
                allTo[k__1] = emailTo['original'];
            }
            data = {'text':'','attachments':{0:{'fallback':'An email was sent by '+email['from'][0]['original'],'color':'#d32600','pretext':'','author_name':email['from'][0]['original'],'author_link':'http://gmail.com/','author_icon':'','title':email['title'],'title_link':'http://gmail.com/','text':email['plain_text'],'fields':{},'footer':'Sent to : '+Settlement.implode(', ', allTo),'footer_icon':'','ts':email['timestamp']}}};
            allCc = {};
            foreach (email['cc'] as emailCc) {
                k__1 = Settlement.default_key(allCc);
                allCc[k__1] = emailCc['original'];
            }
            if (allCc = Settlement.implode(', ', allCc)) {
                k__1 = Settlement.default_key(data['attachments'][0]['fields']);
                data['attachments'][0]['fields'][k__1] = {'title':'cc','value':allCc};
            }
            if (email['attachments']) {
                k__1 = Settlement.default_key(data['attachments'][0]['fields']);
                data['attachments'][0]['fields'][k__1] = {'title':'','value':'This email also has attachments','short':false};
            }
            curl = curl_init();
            curl_setopt_array(curl, {CURLOPT_URL:_ENV['INCOMING_WEBHOOK_URL'],CURLOPT_RETURNTRANSFER:true,CURLOPT_ENCODING:'',CURLOPT_MAXREDIRS:10,CURLOPT_TIMEOUT:0,CURLOPT_FOLLOWLOCATION:true,CURLOPT_HTTP_VERSION:CURL_HTTP_VERSION_1_1,CURLOPT_CUSTOMREQUEST:'POST',CURLOPT_POSTFIELDS:json_encode(data),CURLOPT_HTTPHEADER:{0:'Content-Type: application/json'}});
            response = curl_exec(curl);
            curl_close(curl);
            http_response_code(200);
            exit('ok');
        } else {
            http_response_code(401);
            exit('Bad request');
        }
    }
}
main();