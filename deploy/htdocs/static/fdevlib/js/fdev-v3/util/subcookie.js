/**
 * ǰ��ר��cookie�������
 * ����fdev-v3
 *
 * @author Edgar <mail@edgarhoo.net>
 * @version 1.0.110317
 */

(function(){
    //����ǰ��ר��cookie: alicnweb
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
    
    //ȡ��alicnweb��ֵ�����ض���ֵ
    getSubCookieHash = function(){
        var hashParts = C.cookie(ALICNWEB).split('|'),
            hashPart = null,
            hash = {};
        
        //ȥ������cookie START
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
    //����alicnweb
    setCookie = function( hash, config ){
        var subArr = [], subStr, cookieStr, options = optionsDefault;
        for (var key in hash) {
            if ( L.hasOwnProperty( hash, key ) ) {
                subArr.push(escape(key) + '=' + escape(String(hash[key])));
            }
        }
        subStr = subArr.join('|');
        cookieStr = ALICNWEB + "=" + escape(subStr);
        
        //ȥ������cookie START
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
        //ȡ����cookieֵ
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
        //������cookieֵ
        setSubCookie: function( name, value ){
            if ( !isString( name ) || !isString( value ) ){
                return;
            }
            var hash = getSubCookieHash();
            
            hash[name] = value;
            
            setCookie( hash, arguments[2] );
        },
        //ɾ����cookie
        removeSubCookie: function( name ){
            if ( !isString( name ) ){
                return;
            }
            //��ȡ��cookie��������cookie
            var hash = getSubCookieHash();
            if ( L.isObject( hash ) && L.hasOwnProperty( hash, name ) ) {
                delete hash[name]; 	//������ڸ���cookie����ɾ��
                return setCookie( hash, arguments[1] );
            }
        }
    } );

})();
