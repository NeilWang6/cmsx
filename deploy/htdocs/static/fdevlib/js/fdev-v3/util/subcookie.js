/**
 * 前端专用cookie操作相关
 * 基于fdev-v3
 *
 * @author Edgar <mail@edgarhoo.net>
 * @version 1.0.110317
 */

(function(){
    //定义前端专用cookie: alicnweb
    var ALICNWEB = 'alicnweb',
    ERRORCOOKIE = 'alicnwb',
	is1688 = /\b1688\.com$/.test(window.location.hostname),
    L = FDEV.lang,
    C = FD.common,
    optionsDefault = {
        path: '/',
        domain: is1688?'1688.com':'alibaba.com',
        expires: new Date('January 1, 2050')
    },
    
    //取得alicnweb的值并返回对象值
    getSubCookieHash = function(){
        var hashParts = C.cookie(ALICNWEB).split('|'),
            hashPart = null,
            hash = {};
        
        //去除错误cookie START
        if ( document.cookie.indexOf(ERRORCOOKIE) !== -1 ){
            setCookie( {}, {}, ERRORCOOKIE );
        }
        //END
        //if (name.length > 0) {
            for (var i = 0, len = hashParts.length; i < len; ++i) {
                if (hashParts[i].indexOf('=') !== -1){
                    hashPart = hashParts[i].split('=');
                    hash[unescape(hashPart[0])] = unescape(hashPart[1]);
                }
            }
        //}
        return hash;
    },
    //设置alicnweb
    setCookie = function( hash, config ){
        var subArr = [], subStr, cookieStr, options = optionsDefault;
        for (var key in hash) {
            if ( L.hasOwnProperty( hash, key ) ) {
                subArr.push(escape(key) + '=' + escape(String(hash[key])));
            }
        }
        subStr = subArr.join('|');
        cookieStr = ALICNWEB + "=" + escape(subStr);
        
        //去除错误cookie START
        if ( arguments[2] === ERRORCOOKIE ){
            cookieStr = cookieStr.replace( ALICNWEB, ERRORCOOKIE );
            config.expires = new Date(0);
        }
        //END
        if ( L.isObject( config ) ){
            options = FD.common.apply( options, config );
        }
        
        if (options.expires instanceof Date) {
            cookieStr += "; expires=" + options.expires.toUTCString();
        }
        if ( L.isNumber(options.expires) && options.expires !== 0) {
            var date = new Date();
            date.setTime(date.getTime() + (options.expires*24*60*60*1000));
            cookieStr += "; expires=" + date.toUTCString();
        }
        if (options.path !== '') {
            cookieStr += "; path=" + options.path;
        }
        if (options.domain !== '') {
            cookieStr += "; domain=" + options.domain;
        }
        if (options.secure === true) {
            cookieStr += "; secure";
        }
        
        document.cookie = cookieStr;
    },
    isString = function( name ){
        return ( !L.isString( name ) || name === '' ) ? false : true;
    };
    
    L.augmentObject( FD.common, {
        //取得子cookie值
        getSubCookie: function( name ){
            if ( !isString( name ) ){
                return;
            }
            var hash = getSubCookieHash();
            if( hash !== null ) {
                return hash[name] ? hash[name] : null;
            }
            return null;
        },
        //设置子cookie值
        setSubCookie: function( name, value ){
            if ( !isString( name ) || !isString( value ) ){
                return;
            }
            var hash = getSubCookieHash();
            
            hash[name] = value;
            
            setCookie( hash, arguments[2] );
        },
        //删除子cookie
        removeSubCookie: function( name ){
            if ( !isString( name ) ){
                return;
            }
            //获取该cookie的所有子cookie
            var hash = getSubCookieHash();
            if ( L.isObject( hash ) && L.hasOwnProperty( hash, name ) ) {
                delete hash[name]; 	//如果存在该子cookie则将其删除
                return setCookie( hash, arguments[1] );
            }
        }
    } );

})();
