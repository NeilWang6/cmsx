/**
 * @package opensearch.preview
 * @author  Edgar Hoo
 * @version 0.100908
 */
(function( S ){
    S.preview = {
        init: function(){
            this.createThemeStyle();
            this.changeThemeStyle();
            this.displayData();
            this.displayParams();
            this.cleanData();
        },
        createThemeStyle: function(){
            var themeName = $('theme').value,
                jsUrl = 'http://style.c.aliimg.com/js/sys/opensearch/themes/'+themeName+'.js',
                cssUrl = 'http://style.c.aliimg.com/css/sys/opensearch/themes/'+themeName+'.css';
            
            if ( !$('js-theme') ){
                var script = document.createElement('script');
                script.id = 'js-theme';
                script.type = 'text/javascript';
                script.src = jsUrl;
                document.body.appendChild( script );
            }
            
            if ( !$('css-theme') ){
                var link = document.createElement('link');
                link.id = 'css-theme';
                link.rel = 'stylesheet';
                link.href = cssUrl;
                document.getElementsByTagName('head')[0].appendChild( link );
            }
        },
        changeThemeStyle: function(){
            var _this = this, theme = $('theme').value;
            $E.addListener( 'theme', 'change', function(){
                if ( S.themeData[theme] ){
                    _this.deleteThemeStyle();
                    _this.deleteThemeParams();
                    _this.createThemeParams();
                    _this.createThemeStyle();
                }
            });
        },
        deleteThemeStyle: function(){
            if ( $('js-theme') ) this.removeElement('js-theme');
            if ( $('css-theme') ) this.removeElement('css-theme');
        },
        deleteThemeParams: function(){
            var privates = $$('.private'),
                _this = this;
            privates.forEach(function( el, i, arr ){
                _this.removeElement(el);
            });
        },
        createThemeParams: function(){
            var theme = $('theme').value;
            for ( var i = 0, l = S.themeData[theme].length; i < l; i++ ){
                this.createThemeParamItem( S.themeData[theme][i] );
            }
        },
        createThemeParamItem: function( item ){
            switch( item.tag ){
                case 'input':
                    this.createThemeparamInput( item );
                    break;
                case 'select':
                    this.createThemeparamSelect( item );
                    break;
            }
        },
        createThemeparamInput: function( item ){
            var li = document.createElement('li');
            li.className = 'private';
            li.innerHTML = '<label for="'+item.name+'">'+item.name+'</label>\n'+
                '<input type='+item.data.type+' name="'+item.name+'" value="'+item.defaultValue+'" id="'+item.name+'" class="theme" data-default="'+item.defaultValue+'"/>';
            $('theme-config-lsit').appendChild(li);
        },
        createThemeparamSelect: function( item ){
            var li = document.createElement('li');
            li.className = 'private';
            li.innerHTML = '<label for="'+item.name+'">'+item.name+'</label>\n'+
                '<select name="'+item.name+'" id="'+item.name+'" class="theme" data-default="'+item.defaultValue+'">'+this.createThemeparamOption( item.data )+'</select>';
            $('theme-config-lsit').appendChild(li);
        },
        createThemeparamOption: function( options ){
            var ops = [];
            for ( var i = 0, l = options.length; i < l; i++ ){
                ops.push('<option value="'+options[i].value+'">'+options[i].title+'</option>');
            }
            return ops.join('');
        },
        displayData: function(){
            var _this = this;
            $E.addListener( 'preview', 'click', function(){
                _this.createContainerBox();
                _this.insertParams();
            });
        },
        displayParams: function(){
            var output = $('output-params');
            $E.addListener( 'getParams', 'click', function(){
                if ( output.innerHTML !== '' ){
                    $D.addClass( output, 'display' );
                } else {
                    output.innerHTML = 'Please click the "Preview" button first!';
                    $D.addClass( output, 'display' );
                }
            });
        },
        cleanData: function(){
            $E.addListener( 'cleanData', 'click', function(){
                $('preview-box').innerHTML = '';
                $D.removeClass( 'output-params', 'display' );
                $('output-params').innerHTML = '';
            });
        },
        createContainerBox: function(){
            var id = $('containerId').value || 'openSearchPreview';
            if ( $(id)){
                this.removeElement(id);
            }
            var div = document.createElement('div');
            div.id = id;
            $('preview-box').appendChild(div);
        },
        insertParams: function(){
            if ( $('js-params') ){
                this.removeElement('js-params');
            }
            var output = $('output-params'),
                theme = $('theme').value;
            if ( output.className === 'display' ){
                $D.removeClass( output, 'display' );
            }
            var script = document.createElement('script');
            script.id = 'js-params';
            script.type = 'text/javascript';
            script.innerHTML = output.innerHTML = this.getValue();
            output.innerHTML = '&lt;link href="http://style.c.aliimg.com/css/lib/fdev-v3/fdev.css" rel="stylesheet"/>\n'
                               + '&lt;link href="http://style.c.aliimg.com/css/app/operation/global/v2.css" rel="stylesheet"/>\n'
                               + '&lt;link href="http://style.c.aliimg.com/css/sys/opensearch/themes/'+theme+'.css" rel="stylesheet"/>\n\n'
                               + '&lt;script src="http://style.c.aliimg.com/js/lib/fdev-v3/core/fdev-min.js" type="text/javascript">&lt;/script>\n'
                               + '&lt;script src="http://style.c.aliimg.com/js/lib/fdev-v3/core/yui/get-min.js" type="text/javascript">&lt;/script>\n'
                               + '&lt;script src="http://style.c.aliimg.com/js/sys/opensearch/core/opensearch.js" type="text/javascript">&lt;/script>\n'
                               + '&lt;script src="http://style.c.aliimg.com/js/sys/opensearch/themes/'+theme+'.js" type="text/javascript">&lt;/script>\n\n'
                               + '&lt;script type="text/javascript">\n'
                               + output.innerHTML
                               + '\n&lt;/script>';
            document.body.appendChild( script );
        },
        getValue: function(){
            var openSearchParams = [],
                openSearchObj = {},
                themeParams = [],
                themeObj = {},
                inputs = $$('#opensearch-form input'),
                selects = $$('#opensearch-form select');
            
            for ( var i = 0, l = selects.length; i < l; i++ ){
                var name = selects[i].name,
                    value = FDEV.lang.trim( selects[i].value );
                if ( value !== $D.getAttribute( selects[i], 'data-default' ) ){
                    if ( selects[i].className !== 'theme' ){
                        openSearchParams.push( name );
                        openSearchObj[ name ] = value;
                    } else {
                        themeParams.push( name );
                        themeObj[ name ] = value;
                    }
                }
            }
                
            for ( var i = 0, l = inputs.length; i < l; i++ ){
                var name = inputs[i].name,
                    value = FDEV.lang.trim( inputs[i].value );
                if ( value !== $D.getAttribute( inputs[i], 'data-default' ) ){
                    if ( inputs[i].className !== 'theme' ){
                        openSearchParams.push( name );
                        openSearchObj[ name ] = value;
                    } else {
                        themeParams.push( name );
                        themeObj[ name ] = value;
                    }
                }
            }
            
            var paramCopy = openSearchParams.slice(0);
            
            for ( var i = 0, l = openSearchParams.length; i < l; i++ ){
                var p = openSearchParams[i];
                if ( openSearchObj[p] === '' ){
                    var j = paramCopy.indexOf(p);
                    paramCopy.splice( j, 1 );
                    //valueCopy.splice( i, 1 );
                    delete openSearchObj[p];
                }
            }
            openSearchParams = paramCopy;

            var paramsTemp = [], themeTemp = [], today = new Date(),
                t = today.getDate()+''+today.getDay()+''+today.getMinutes()+''+today.getSeconds();
            
            paramsTemp.push( "\n\t'returnJsonObjectName':'openSearch"+t+"'");
            
            for ( var i = 0, l = openSearchParams.length; i < l; i++ ){
                var p = openSearchParams[i];
                paramsTemp.push( "\n\t'"+p+"':'"+openSearchObj[p]+"'" );
            }
            
            for ( var i = 0, l = themeParams.length; i < l; i++ ){
                var p = themeParams[i];
                themeTemp.push( "\n\t'"+p+"':'"+themeObj[p]+"'" );
            }
            
            var paramsResult = 'FD.sys.opensearch.Ao({'+paramsTemp.join(',')+'\n},{'+themeTemp.join(',')+'\n}).use(FD.sys.opensearch.preview'+t+');';
            
            return paramsResult;
        },
        removeElement: function( node ){
            var child = ( typeof node === 'string' ) ? $(node) : node;
            var parent = child.parentNode;
            if ( parent ){
                parent.removeChild( child );
            }
        },
        end:0
    };
    
    $E.onDOMReady(function(){
        S.preview.init();
    });
})(FD.sys.opensearch);