/**
* fdev 核心层
* @author 	yaosl<shengliang.yaosl@alibaba-inc.com>
* @link    http://fd.aliued.cn/fdevlib/
* @update   Denis 2011.12.14    提供测试配置的占位
* @update Denis 2012.03.22 默认提供FD.sys命名空间
* @update Denis 2012.04.22 String.cut方法优化
* @update Denis 2012.06.08 用户登录id相关的cookie值使用UTF8编码方式
*/

/** YUI 2.8.1 **/
if(typeof YAHOO=="undefined"||!YAHOO) { var YAHOO={}; } YAHOO.namespace=function () { var A=arguments,E=null,C,B,D;for(C=0;C<A.length;C=C+1) { D=(""+A[C]).split(".");E=YAHOO;for(B=(D[0]=="YAHOO")?1:0;B<D.length;B=B+1) { E[D[B]]=E[D[B]]||{};E=E[D[B]]; } } return E; };YAHOO.log=function (D,A,C) { var B=YAHOO.widget.Logger;if(B&&B.log) { return B.log(D,A,C); } else { return false; } };YAHOO.register=function (A,E,D) { var I=YAHOO.env.modules,B,H,G,F,C;if(!I[A]) { I[A]={ versions: [],builds: [] }; } B=I[A];H=D.version;G=D.build;F=YAHOO.env.listeners;B.name=A;B.version=H;B.build=G;B.versions.push(H);B.builds.push(G);B.mainClass=E;for(C=0;C<F.length;C=C+1) { F[C](B); } if(E) { E.VERSION=H;E.BUILD=G; } else { YAHOO.log("mainClass is undefined for module "+A,"warn"); } };YAHOO.env=YAHOO.env||{ modules: [],listeners: [] };YAHOO.env.getVersion=function (A) { return YAHOO.env.modules[A]||null; };YAHOO.env.ua=function () { var D=function (H) { var I=0;return parseFloat(H.replace(/\./g,function () { return (I++ ==1)?"":"."; })); },G=navigator,F={ ie: 0,opera: 0,gecko: 0,webkit: 0,mobile: null,air: 0,caja: 0,secure: false,os: null },C=navigator&&navigator.userAgent,E=window&&window.location,B=E&&E.href,A;F.secure=B&&(B.toLowerCase().indexOf("https")===0);if(C) { if((/windows|win32/i).test(C)) { F.os="windows"; } else { if((/macintosh/i).test(C)) { F.os="macintosh"; } } if((/KHTML/).test(C)) { F.webkit=1; } A=C.match(/AppleWebKit\/([^\s]*)/);if(A&&A[1]) { F.webkit=D(A[1]);if(/ Mobile\//.test(C)) { F.mobile="Apple"; } else { A=C.match(/NokiaN[^\/]*/);if(A) { F.mobile=A[0]; } } A=C.match(/AdobeAIR\/([^\s]*)/);if(A) { F.air=A[0]; } } if(!F.webkit) { A=C.match(/Opera[\s\/]([^\s]*)/);if(A&&A[1]) { F.opera=D(A[1]);A=C.match(/Opera Mini[^;]*/);if(A) { F.mobile=A[0]; } } else { A=C.match(/MSIE\s([^;]*)/);if(A&&A[1]) { F.ie=D(A[1]); } else { A=C.match(/Gecko\/([^\s]*)/);if(A) { F.gecko=1;A=C.match(/rv:([^\s\)]*)/);if(A&&A[1]) { F.gecko=D(A[1]); } } } } } } return F; } ();(function () { YAHOO.namespace("util","widget","example");if("undefined"!==typeof YAHOO_config) { var B=YAHOO_config.listener,A=YAHOO.env.listeners,D=true,C;if(B) { for(C=0;C<A.length;C++) { if(A[C]==B) { D=false;break; } } if(D) { A.push(B); } } } })();YAHOO.lang=YAHOO.lang||{};(function () { var B=YAHOO.lang,A=Object.prototype,H="[object Array]",C="[object Function]",G="[object Object]",E=[],F=["toString","valueOf"],D={ isArray: function (I) { return A.toString.apply(I)===H; },isBoolean: function (I) { return typeof I==="boolean"; },isFunction: function (I) { return (typeof I==="function")||A.toString.apply(I)===C; },isNull: function (I) { return I===null; },isNumber: function (I) { return typeof I==="number"&&isFinite(I); },isObject: function (I) { return (I&&(typeof I==="object"||B.isFunction(I)))||false; },isString: function (I) { return typeof I==="string"; },isUndefined: function (I) { return typeof I==="undefined"; },_IEEnumFix: (YAHOO.env.ua.ie)?function (K,J) { var I,M,L;for(I=0;I<F.length;I=I+1) { M=F[I];L=J[M];if(B.isFunction(L)&&L!=A[M]) { K[M]=L; } } } :function () { },extend: function (L,M,K) { if(!M||!L) { throw new Error("extend failed, please check that "+"all dependencies are included."); } var J=function () { },I;J.prototype=M.prototype;L.prototype=new J();L.prototype.constructor=L;L.superclass=M.prototype;if(M.prototype.constructor==A.constructor) { M.prototype.constructor=M; } if(K) { for(I in K) { if(B.hasOwnProperty(K,I)) { L.prototype[I]=K[I]; } } B._IEEnumFix(L.prototype,K); } },augmentObject: function (M,L) { if(!L||!M) { throw new Error("Absorb failed, verify dependencies."); } var I=arguments,K,N,J=I[2];if(J&&J!==true) { for(K=2;K<I.length;K=K+1) { M[I[K]]=L[I[K]]; } } else { for(N in L) { if(J||!(N in M)) { M[N]=L[N]; } } B._IEEnumFix(M,L); } },augmentProto: function (L,K) { if(!K||!L) { throw new Error("Augment failed, verify dependencies."); } var I=[L.prototype,K.prototype],J;for(J=2;J<arguments.length;J=J+1) { I.push(arguments[J]); } B.augmentObject.apply(this,I); },dump: function (I,N) { var K,M,P=[],Q="{...}",J="f(){...}",O=", ",L=" => ";if(!B.isObject(I)) { return I+""; } else { if(I instanceof Date||("nodeType" in I&&"tagName" in I)) { return I; } else { if(B.isFunction(I)) { return J; } } } N=(B.isNumber(N))?N:3;if(B.isArray(I)) { P.push("[");for(K=0,M=I.length;K<M;K=K+1) { if(B.isObject(I[K])) { P.push((N>0)?B.dump(I[K],N-1):Q); } else { P.push(I[K]); } P.push(O); } if(P.length>1) { P.pop(); } P.push("]"); } else { P.push("{");for(K in I) { if(B.hasOwnProperty(I,K)) { P.push(K+L);if(B.isObject(I[K])) { P.push((N>0)?B.dump(I[K],N-1):Q); } else { P.push(I[K]); } P.push(O); } } if(P.length>1) { P.pop(); } P.push("}"); } return P.join(""); },substitute: function (Y,J,R) { var N,M,L,U,V,X,T=[],K,O="dump",S=" ",I="{",W="}",Q,P;for(;;) { N=Y.lastIndexOf(I);if(N<0) { break; } M=Y.indexOf(W,N);if(N+1>=M) { break; } K=Y.substring(N+1,M);U=K;X=null;L=U.indexOf(S);if(L> -1) { X=U.substring(L+1);U=U.substring(0,L); } V=J[U];if(R) { V=R(U,V,X); } if(B.isObject(V)) { if(B.isArray(V)) { V=B.dump(V,parseInt(X,10)); } else { X=X||"";Q=X.indexOf(O);if(Q> -1) { X=X.substring(4); } P=V.toString();if(P===G||Q> -1) { V=B.dump(V,parseInt(X,10)); } else { V=P; } } } else { if(!B.isString(V)&&!B.isNumber(V)) { V="~-"+T.length+"-~";T[T.length]=K; } } Y=Y.substring(0,N)+V+Y.substring(M+1); } for(N=T.length-1;N>=0;N=N-1) { Y=Y.replace(new RegExp("~-"+N+"-~"),"{"+T[N]+"}","g"); } return Y; },trim: function (I) { try { return I.replace(/^\s+|\s+$/g,""); } catch(J) { return I; } },merge: function () { var L={},J=arguments,I=J.length,K;for(K=0;K<I;K=K+1) { B.augmentObject(L,J[K],true); } return L; },later: function (P,J,Q,L,M) { P=P||0;J=J||{};var K=Q,O=L,N,I;if(B.isString(Q)) { K=J[Q]; } if(!K) { throw new TypeError("method undefined"); } if(O&&!B.isArray(O)) { O=[L]; } N=function () { K.apply(J,O||E); };I=(M)?setInterval(N,P):setTimeout(N,P);return { interval: M,cancel: function () { if(this.interval) { clearInterval(I); } else { clearTimeout(I); } } }; },isValue: function (I) { return (B.isObject(I)||B.isString(I)||B.isNumber(I)||B.isBoolean(I)); } };B.hasOwnProperty=(A.hasOwnProperty)?function (I,J) { return I&&I.hasOwnProperty(J); } :function (I,J) { return !B.isUndefined(I[J])&&I.constructor.prototype[J]!==I[J]; };D.augmentObject(B,D,true);YAHOO.util.Lang=B;B.augment=B.augmentProto;YAHOO.augment=B.augmentProto;YAHOO.extend=B.extend; })();YAHOO.register("yahoo",YAHOO,{ version: "2.8.1",build: "19" });
(function () {
    YAHOO.env._id_counter=YAHOO.env._id_counter||0;var E=YAHOO.util,L=YAHOO.lang,m=YAHOO.env.ua,A=YAHOO.lang.trim,d={},h={},N=/^t(?:able|d|h)$/i,X=/color$/i,K=window.document,W=K.documentElement,e="ownerDocument",n="defaultView",v="documentElement",t="compatMode",b="offsetLeft",P="offsetTop",u="offsetParent",Z="parentNode",l="nodeType",C="tagName",O="scrollLeft",i="scrollTop",Q="getBoundingClientRect",w="getComputedStyle",a="currentStyle",M="CSS1Compat",c="BackCompat",g="class",F="className",J="",B=" ",s="(?:^|\\s)",k="(?= |$)",U="g",p="position",f="fixed",V="relative",j="left",o="top",r="medium",q="borderLeftWidth",R="borderTopWidth",D=m.opera,I=m.webkit,H=m.gecko,T=m.ie;E.Dom={ CUSTOM_ATTRIBUTES: (!W.hasAttribute)?{ "for": "htmlFor","class": F}:{ "htmlFor": "for","className": g },DOT_ATTRIBUTES: {},get: function (z) { var AB,x,AA,y,Y,G;if(z) { if(z[l]||z.item) { return z; } if(typeof z==="string") { AB=z;z=K.getElementById(z);G=(z)?z.attributes:null;if(z&&G&&G.id&&G.id.value===AB) { return z; } else { if(z&&K.all) { z=null;x=K.all[AB];for(y=0,Y=x.length;y<Y;++y) { if(x[y].id===AB) { return x[y]; } } } } return z; } if(YAHOO.util.Element&&z instanceof YAHOO.util.Element) { z=z.get("element"); } if("length" in z) { AA=[];for(y=0,Y=z.length;y<Y;++y) { AA[AA.length]=E.Dom.get(z[y]); } return AA; } return z; } return null; },getComputedStyle: function (G,Y) { if(window[w]) { return G[e][n][w](G,null)[Y]; } else { if(G[a]) { return E.Dom.IE_ComputedStyle.get(G,Y); } } },getStyle: function (G,Y) { return E.Dom.batch(G,E.Dom._getStyle,Y); },_getStyle: function () { if(window[w]) { return function (G,y) { y=(y==="float")?y="cssFloat":E.Dom._toCamel(y);var x=G.style[y],Y;if(!x) { Y=G[e][n][w](G,null);if(Y) { x=Y[y]; } } return x; }; } else { if(W[a]) { return function (G,y) { var x;switch(y) { case "opacity": x=100;try { x=G.filters["DXImageTransform.Microsoft.Alpha"].opacity; } catch(z) { try { x=G.filters("alpha").opacity; } catch(Y) { } } return x/100;case "float": y="styleFloat";default: y=E.Dom._toCamel(y);x=G[a]?G[a][y]:null;return (G.style[y]||x); } }; } } } (),setStyle: function (G,Y,x) { E.Dom.batch(G,E.Dom._setStyle,{ prop: Y,val: x }); },_setStyle: function () { if(T) { return function (Y,G) { var x=E.Dom._toCamel(G.prop),y=G.val;if(Y) { switch(x) { case "opacity": if(L.isString(Y.style.filter)) { Y.style.filter="alpha(opacity="+y*100+")";if(!Y[a]||!Y[a].hasLayout) { Y.style.zoom=1; } } break;case "float": x="styleFloat";default: Y.style[x]=y; } } else { } }; } else { return function (Y,G) { var x=E.Dom._toCamel(G.prop),y=G.val;if(Y) { if(x=="float") { x="cssFloat"; } Y.style[x]=y; } else { } }; } } (),getXY: function (G) { return E.Dom.batch(G,E.Dom._getXY); },_canPosition: function (G) { return (E.Dom._getStyle(G,"display")!=="none"&&E.Dom._inDoc(G)); },_getXY: function () { if(K[v][Q]) { return function (y) { var z,Y,AA,AF,AE,AD,AC,G,x,AB=Math.floor,AG=false;if(E.Dom._canPosition(y)) { AA=y[Q]();AF=y[e];z=E.Dom.getDocumentScrollLeft(AF);Y=E.Dom.getDocumentScrollTop(AF);AG=[AB(AA[j]),AB(AA[o])];if(T&&m.ie<8) { AE=2;AD=2;AC=AF[t];if(m.ie===6) { if(AC!==c) { AE=0;AD=0; } } if((AC===c)) { G=S(AF[v],q);x=S(AF[v],R);if(G!==r) { AE=parseInt(G,10); } if(x!==r) { AD=parseInt(x,10); } } AG[0]-=AE;AG[1]-=AD; } if((Y||z)) { AG[0]+=z;AG[1]+=Y; } AG[0]=AB(AG[0]);AG[1]=AB(AG[1]); } else { } return AG; }; } else { return function (y) { var x,Y,AA,AB,AC,z=false,G=y;if(E.Dom._canPosition(y)) { z=[y[b],y[P]];x=E.Dom.getDocumentScrollLeft(y[e]);Y=E.Dom.getDocumentScrollTop(y[e]);AC=((H||m.webkit>519)?true:false);while((G=G[u])) { z[0]+=G[b];z[1]+=G[P];if(AC) { z=E.Dom._calcBorders(G,z); } } if(E.Dom._getStyle(y,p)!==f) { G=y;while((G=G[Z])&&G[C]) { AA=G[i];AB=G[O];if(H&&(E.Dom._getStyle(G,"overflow")!=="visible")) { z=E.Dom._calcBorders(G,z); } if(AA||AB) { z[0]-=AB;z[1]-=AA; } } z[0]+=x;z[1]+=Y; } else { if(D) { z[0]-=x;z[1]-=Y; } else { if(I||H) { z[0]+=x;z[1]+=Y; } } } z[0]=Math.floor(z[0]);z[1]=Math.floor(z[1]); } else { } return z; }; } } (),getX: function (G) { var Y=function (x) { return E.Dom.getXY(x)[0]; };return E.Dom.batch(G,Y,E.Dom,true); },getY: function (G) { var Y=function (x) { return E.Dom.getXY(x)[1]; };return E.Dom.batch(G,Y,E.Dom,true); },setXY: function (G,x,Y) { E.Dom.batch(G,E.Dom._setXY,{ pos: x,noRetry: Y }); },_setXY: function (G,z) { var AA=E.Dom._getStyle(G,p),y=E.Dom.setStyle,AD=z.pos,Y=z.noRetry,AB=[parseInt(E.Dom.getComputedStyle(G,j),10),parseInt(E.Dom.getComputedStyle(G,o),10)],AC,x;if(AA=="static") { AA=V;y(G,p,AA); } AC=E.Dom._getXY(G);if(!AD||AC===false) { return false; } if(isNaN(AB[0])) { AB[0]=(AA==V)?0:G[b]; } if(isNaN(AB[1])) { AB[1]=(AA==V)?0:G[P]; } if(AD[0]!==null) { y(G,j,AD[0]-AC[0]+AB[0]+"px"); } if(AD[1]!==null) { y(G,o,AD[1]-AC[1]+AB[1]+"px"); } if(!Y) { x=E.Dom._getXY(G);if((AD[0]!==null&&x[0]!=AD[0])||(AD[1]!==null&&x[1]!=AD[1])) { E.Dom._setXY(G,{ pos: AD,noRetry: true }); } } },setX: function (Y,G) { E.Dom.setXY(Y,[G,null]); },setY: function (G,Y) { E.Dom.setXY(G,[null,Y]); },getRegion: function (G) { var Y=function (x) { var y=false;if(E.Dom._canPosition(x)) { y=E.Region.getRegion(x); } else { } return y; };return E.Dom.batch(G,Y,E.Dom,true); },getClientWidth: function () { return E.Dom.getViewportWidth(); },getClientHeight: function () { return E.Dom.getViewportHeight(); },getElementsByClassName: function (AB,AF,AC,AE,x,AD) { AF=AF||"*";AC=(AC)?E.Dom.get(AC):null||K;if(!AC) { return []; } var Y=[],G=AC.getElementsByTagName(AF),z=E.Dom.hasClass;for(var y=0,AA=G.length;y<AA;++y) { if(z(G[y],AB)) { Y[Y.length]=G[y]; } } if(AE) { E.Dom.batch(Y,AE,x,AD); } return Y; },hasClass: function (Y,G) { return E.Dom.batch(Y,E.Dom._hasClass,G); },_hasClass: function (x,Y) { var G=false,y;if(x&&Y) { y=E.Dom._getAttribute(x,F)||J;if(Y.exec) { G=Y.test(y); } else { G=Y&&(B+y+B).indexOf(B+Y+B)> -1; } } else { } return G; },addClass: function (Y,G) { return E.Dom.batch(Y,E.Dom._addClass,G); },_addClass: function (x,Y) { var G=false,y;if(x&&Y) { y=E.Dom._getAttribute(x,F)||J;if(!E.Dom._hasClass(x,Y)) { E.Dom.setAttribute(x,F,A(y+B+Y));G=true; } } else { } return G; },removeClass: function (Y,G) { return E.Dom.batch(Y,E.Dom._removeClass,G); },_removeClass: function (y,x) {
        var Y=false,AA,z,G;if(y&&x) {
            AA=E.Dom._getAttribute(y,F)||J;E.Dom.setAttribute(y,F,AA.replace(E.Dom._getClassRegex(x),J));z=E.Dom._getAttribute(y,F);if(AA!==z) {
                E.Dom.setAttribute(y,F,A(z));Y=true;if(E.Dom._getAttribute(y,F)==="") {
                    G=(y.hasAttribute&&y.hasAttribute(g))?g:F;
                    y.removeAttribute(G);
                }
            }
        } else { } return Y;
    },replaceClass: function (x,Y,G) { return E.Dom.batch(x,E.Dom._replaceClass,{ from: Y,to: G }); },_replaceClass: function (y,x) { var Y,AB,AA,G=false,z;if(y&&x) { AB=x.from;AA=x.to;if(!AA) { G=false; } else { if(!AB) { G=E.Dom._addClass(y,x.to); } else { if(AB!==AA) { z=E.Dom._getAttribute(y,F)||J;Y=(B+z.replace(E.Dom._getClassRegex(AB),B+AA)).split(E.Dom._getClassRegex(AA));Y.splice(1,0,B+AA);E.Dom.setAttribute(y,F,A(Y.join(J)));G=true; } } } } else { } return G; },generateId: function (G,x) { x=x||"yui-gen";var Y=function (y) { if(y&&y.id) { return y.id; } var z=x+YAHOO.env._id_counter++;if(y) { if(y[e]&&y[e].getElementById(z)) { return E.Dom.generateId(y,z+x); } y.id=z; } return z; };return E.Dom.batch(G,Y,E.Dom,true)||Y.apply(E.Dom,arguments); },isAncestor: function (Y,x) { Y=E.Dom.get(Y);x=E.Dom.get(x);var G=false;if((Y&&x)&&(Y[l]&&x[l])) { if(Y.contains&&Y!==x) { G=Y.contains(x); } else { if(Y.compareDocumentPosition) { G=!!(Y.compareDocumentPosition(x)&16); } } } else { } return G; },inDocument: function (G,Y) { return E.Dom._inDoc(E.Dom.get(G),Y); },_inDoc: function (Y,x) { var G=false;if(Y&&Y[C]) { x=x||Y[e];G=E.Dom.isAncestor(x[v],Y); } else { } return G; },getElementsBy: function (Y,AF,AB,AD,y,AC,AE) { AF=AF||"*";AB=(AB)?E.Dom.get(AB):null||K;if(!AB) { return []; } var x=[],G=AB.getElementsByTagName(AF);for(var z=0,AA=G.length;z<AA;++z) { if(Y(G[z])) { if(AE) { x=G[z];break; } else { x[x.length]=G[z]; } } } if(AD) { E.Dom.batch(x,AD,y,AC); } return x; },getElementBy: function (x,G,Y) { return E.Dom.getElementsBy(x,G,Y,null,null,null,true); },batch: function (x,AB,AA,z) { var y=[],Y=(z)?AA:window;x=(x&&(x[C]||x.item))?x:E.Dom.get(x);if(x&&AB) { if(x[C]||x.length===undefined) { return AB.call(Y,x,AA); } for(var G=0;G<x.length;++G) { y[y.length]=AB.call(Y,x[G],AA); } } else { return false; } return y; },getDocumentHeight: function () { var Y=(K[t]!=M||I)?K.body.scrollHeight:W.scrollHeight,G=Math.max(Y,E.Dom.getViewportHeight());return G; },getDocumentWidth: function () { var Y=(K[t]!=M||I)?K.body.scrollWidth:W.scrollWidth,G=Math.max(Y,E.Dom.getViewportWidth());return G; },getViewportHeight: function () { var G=self.innerHeight,Y=K[t];if((Y||T)&&!D) { G=(Y==M)?W.clientHeight:K.body.clientHeight; } return G; },getViewportWidth: function () { var G=self.innerWidth,Y=K[t];if(Y||T) { G=(Y==M)?W.clientWidth:K.body.clientWidth; } return G; },getAncestorBy: function (G,Y) { while((G=G[Z])) { if(E.Dom._testElement(G,Y)) { return G; } } return null; },getAncestorByClassName: function (Y,G) { Y=E.Dom.get(Y);if(!Y) { return null; } var x=function (y) { return E.Dom.hasClass(y,G); };return E.Dom.getAncestorBy(Y,x); },getAncestorByTagName: function (Y,G) { Y=E.Dom.get(Y);if(!Y) { return null; } var x=function (y) { return y[C]&&y[C].toUpperCase()==G.toUpperCase(); };return E.Dom.getAncestorBy(Y,x); },getPreviousSiblingBy: function (G,Y) { while(G) { G=G.previousSibling;if(E.Dom._testElement(G,Y)) { return G; } } return null; },getPreviousSibling: function (G) { G=E.Dom.get(G);if(!G) { return null; } return E.Dom.getPreviousSiblingBy(G); },getNextSiblingBy: function (G,Y) { while(G) { G=G.nextSibling;if(E.Dom._testElement(G,Y)) { return G; } } return null; },getNextSibling: function (G) { G=E.Dom.get(G);if(!G) { return null; } return E.Dom.getNextSiblingBy(G); },getFirstChildBy: function (G,x) { var Y=(E.Dom._testElement(G.firstChild,x))?G.firstChild:null;return Y||E.Dom.getNextSiblingBy(G.firstChild,x); },getFirstChild: function (G,Y) { G=E.Dom.get(G);if(!G) { return null; } return E.Dom.getFirstChildBy(G); },getLastChildBy: function (G,x) { if(!G) { return null; } var Y=(E.Dom._testElement(G.lastChild,x))?G.lastChild:null;return Y||E.Dom.getPreviousSiblingBy(G.lastChild,x); },getLastChild: function (G) { G=E.Dom.get(G);return E.Dom.getLastChildBy(G); },getChildrenBy: function (Y,y) { var x=E.Dom.getFirstChildBy(Y,y),G=x?[x]:[];E.Dom.getNextSiblingBy(x,function (z) { if(!y||y(z)) { G[G.length]=z; } return false; });return G; },getChildren: function (G) { G=E.Dom.get(G);if(!G) { } return E.Dom.getChildrenBy(G); },getDocumentScrollLeft: function (G) { G=G||K;return Math.max(G[v].scrollLeft,G.body.scrollLeft); },getDocumentScrollTop: function (G) { G=G||K;return Math.max(G[v].scrollTop,G.body.scrollTop); },insertBefore: function (Y,G) { Y=E.Dom.get(Y);G=E.Dom.get(G);if(!Y||!G||!G[Z]) { return null; } return G[Z].insertBefore(Y,G); },insertAfter: function (Y,G) { Y=E.Dom.get(Y);G=E.Dom.get(G);if(!Y||!G||!G[Z]) { return null; } if(G.nextSibling) { return G[Z].insertBefore(Y,G.nextSibling); } else { return G[Z].appendChild(Y); } },getClientRegion: function () { var x=E.Dom.getDocumentScrollTop(),Y=E.Dom.getDocumentScrollLeft(),y=E.Dom.getViewportWidth()+Y,G=E.Dom.getViewportHeight()+x;return new E.Region(x,y,G,Y); },setAttribute: function (Y,G,x) { E.Dom.batch(Y,E.Dom._setAttribute,{ attr: G,val: x }); },_setAttribute: function (x,Y) { var G=E.Dom._toCamel(Y.attr),y=Y.val;if(x&&x.setAttribute) { if(E.Dom.DOT_ATTRIBUTES[G]) { x[G]=y; } else { G=E.Dom.CUSTOM_ATTRIBUTES[G]||G;x.setAttribute(G,y); } } else { } },getAttribute: function (Y,G) { return E.Dom.batch(Y,E.Dom._getAttribute,G); },_getAttribute: function (Y,G) { var x;G=E.Dom.CUSTOM_ATTRIBUTES[G]||G;if(Y&&Y.getAttribute) { x=Y.getAttribute(G,2); } else { } return x; },_toCamel: function (Y) { var x=d;function G(y,z) { return z.toUpperCase(); } return x[Y]||(x[Y]=Y.indexOf("-")=== -1?Y:Y.replace(/-([a-z])/gi,G)); },_getClassRegex: function (Y) { var G;if(Y!==undefined) { if(Y.exec) { G=Y; } else { G=h[Y];if(!G) { Y=Y.replace(E.Dom._patterns.CLASS_RE_TOKENS,"\\$1");G=h[Y]=new RegExp(s+Y+k,U); } } } return G; },_patterns: { ROOT_TAG: /^body|html$/i,CLASS_RE_TOKENS: /([\.\(\)\^\$\*\+\?\|\[\]\{\}\\])/g },_testElement: function (G,Y) { return G&&G[l]==1&&(!Y||Y(G)); },_calcBorders: function (x,y) { var Y=parseInt(E.Dom[w](x,R),10)||0,G=parseInt(E.Dom[w](x,q),10)||0;if(H) { if(N.test(x[C])) { Y=0;G=0; } } y[0]+=G;y[1]+=Y;return y; }
    };var S=E.Dom[w];if(m.opera) { E.Dom[w]=function (Y,G) { var x=S(Y,G);if(X.test(G)) { x=E.Dom.Color.toRGB(x); } return x; }; } if(m.webkit) { E.Dom[w]=function (Y,G) { var x=S(Y,G);if(x==="rgba(0, 0, 0, 0)") { x="transparent"; } return x; }; } if(m.ie&&m.ie>=8&&K.documentElement.hasAttribute) { E.Dom.DOT_ATTRIBUTES.type=true; }
})();YAHOO.util.Region=function (C,D,A,B) {
    this.top=C;this.y=C;this[1]=C;this.right=D;this.bottom=A;this.left=B;this.x=B;this[0]=B;
    this.width=this.right-this.left;this.height=this.bottom-this.top;
};YAHOO.util.Region.prototype.contains=function (A) { return (A.left>=this.left&&A.right<=this.right&&A.top>=this.top&&A.bottom<=this.bottom); };YAHOO.util.Region.prototype.getArea=function () { return ((this.bottom-this.top)*(this.right-this.left)); };YAHOO.util.Region.prototype.intersect=function (E) { var C=Math.max(this.top,E.top),D=Math.min(this.right,E.right),A=Math.min(this.bottom,E.bottom),B=Math.max(this.left,E.left);if(A>=C&&D>=B) { return new YAHOO.util.Region(C,D,A,B); } else { return null; } };YAHOO.util.Region.prototype.union=function (E) { var C=Math.min(this.top,E.top),D=Math.max(this.right,E.right),A=Math.max(this.bottom,E.bottom),B=Math.min(this.left,E.left);return new YAHOO.util.Region(C,D,A,B); };YAHOO.util.Region.prototype.toString=function () { return ("Region {"+"top: "+this.top+", right: "+this.right+", bottom: "+this.bottom+", left: "+this.left+", height: "+this.height+", width: "+this.width+"}"); };YAHOO.util.Region.getRegion=function (D) { var F=YAHOO.util.Dom.getXY(D),C=F[1],E=F[0]+D.offsetWidth,A=F[1]+D.offsetHeight,B=F[0];return new YAHOO.util.Region(C,E,A,B); };YAHOO.util.Point=function (A,B) { if(YAHOO.lang.isArray(A)) { B=A[1];A=A[0]; } YAHOO.util.Point.superclass.constructor.call(this,B,A,B,A); };YAHOO.extend(YAHOO.util.Point,YAHOO.util.Region);(function () { var B=YAHOO.util,A="clientTop",F="clientLeft",J="parentNode",K="right",W="hasLayout",I="px",U="opacity",L="auto",D="borderLeftWidth",G="borderTopWidth",P="borderRightWidth",V="borderBottomWidth",S="visible",Q="transparent",N="height",E="width",H="style",T="currentStyle",R=/^width|height$/,O=/^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i,M={ get: function (X,Z) { var Y="",a=X[T][Z];if(Z===U) { Y=B.Dom.getStyle(X,U); } else { if(!a||(a.indexOf&&a.indexOf(I)> -1)) { Y=a; } else { if(B.Dom.IE_COMPUTED[Z]) { Y=B.Dom.IE_COMPUTED[Z](X,Z); } else { if(O.test(a)) { Y=B.Dom.IE.ComputedStyle.getPixel(X,Z); } else { Y=a; } } } } return Y; },getOffset: function (Z,e) { var b=Z[T][e],X=e.charAt(0).toUpperCase()+e.substr(1),c="offset"+X,Y="pixel"+X,a="",d;if(b==L) { d=Z[c];if(d===undefined) { a=0; } a=d;if(R.test(e)) { Z[H][e]=d;if(Z[c]>d) { a=d-(Z[c]-d); } Z[H][e]=L; } } else { if(!Z[H][Y]&&!Z[H][e]) { Z[H][e]=b; } a=Z[H][Y]; } return a+I; },getBorderWidth: function (X,Z) { var Y=null;if(!X[T][W]) { X[H].zoom=1; } switch(Z) { case G: Y=X[A];break;case V: Y=X.offsetHeight-X.clientHeight-X[A];break;case D: Y=X[F];break;case P: Y=X.offsetWidth-X.clientWidth-X[F];break; } return Y+I; },getPixel: function (Y,X) { var a=null,b=Y[T][K],Z=Y[T][X];Y[H][K]=Z;a=Y[H].pixelRight;Y[H][K]=b;return a+I; },getMargin: function (Y,X) { var Z;if(Y[T][X]==L) { Z=0+I; } else { Z=B.Dom.IE.ComputedStyle.getPixel(Y,X); } return Z; },getVisibility: function (Y,X) { var Z;while((Z=Y[T])&&Z[X]=="inherit") { Y=Y[J]; } return (Z)?Z[X]:S; },getColor: function (Y,X) { return B.Dom.Color.toRGB(Y[T][X])||Q; },getBorderColor: function (Y,X) { var Z=Y[T],a=Z[X]||Z.color;return B.Dom.Color.toRGB(B.Dom.Color.toHex(a)); } },C={};C.top=C.right=C.bottom=C.left=C[E]=C[N]=M.getOffset;C.color=M.getColor;C[G]=C[P]=C[V]=C[D]=M.getBorderWidth;C.marginTop=C.marginRight=C.marginBottom=C.marginLeft=M.getMargin;C.visibility=M.getVisibility;C.borderColor=C.borderTopColor=C.borderRightColor=C.borderBottomColor=C.borderLeftColor=M.getBorderColor;B.Dom.IE_COMPUTED=C;B.Dom.IE_ComputedStyle=M; })();(function () { var C="toString",A=parseInt,B=RegExp,D=YAHOO.util;D.Dom.Color={ KEYWORDS: { black: "000",silver: "c0c0c0",gray: "808080",white: "fff",maroon: "800000",red: "f00",purple: "800080",fuchsia: "f0f",green: "008000",lime: "0f0",olive: "808000",yellow: "ff0",navy: "000080",blue: "00f",teal: "008080",aqua: "0ff" },re_RGB: /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,re_hex: /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,re_hex3: /([0-9A-F])/gi,toRGB: function (E) { if(!D.Dom.Color.re_RGB.test(E)) { E=D.Dom.Color.toHex(E); } if(D.Dom.Color.re_hex.exec(E)) { E="rgb("+[A(B.$1,16),A(B.$2,16),A(B.$3,16)].join(", ")+")"; } return E; },toHex: function (H) { H=D.Dom.Color.KEYWORDS[H]||H;if(D.Dom.Color.re_RGB.exec(H)) { var G=(B.$1.length===1)?"0"+B.$1:Number(B.$1),F=(B.$2.length===1)?"0"+B.$2:Number(B.$2),E=(B.$3.length===1)?"0"+B.$3:Number(B.$3);H=[G[C](16),F[C](16),E[C](16)].join(""); } if(H.length<6) { H=H.replace(D.Dom.Color.re_hex3,"$1$1"); } if(H!=="transparent"&&H.indexOf("#")<0) { H="#"+H; } return H.toLowerCase(); } }; } ());YAHOO.register("dom",YAHOO.util.Dom,{ version: "2.8.1",build: "19" });YAHOO.util.CustomEvent=function (D,C,B,A,E) { this.type=D;this.scope=C||window;this.silent=B;this.fireOnce=E;this.fired=false;this.firedWith=null;this.signature=A||YAHOO.util.CustomEvent.LIST;this.subscribers=[];if(!this.silent) { } var F="_YUICEOnSubscribe";if(D!==F) { this.subscribeEvent=new YAHOO.util.CustomEvent(F,this,true); } this.lastError=null; };YAHOO.util.CustomEvent.LIST=0;YAHOO.util.CustomEvent.FLAT=1;YAHOO.util.CustomEvent.prototype={ subscribe: function (B,C,D) { if(!B) { throw new Error("Invalid callback for subscriber to '"+this.type+"'"); } if(this.subscribeEvent) { this.subscribeEvent.fire(B,C,D); } var A=new YAHOO.util.Subscriber(B,C,D);if(this.fireOnce&&this.fired) { this.notify(A,this.firedWith); } else { this.subscribers.push(A); } },unsubscribe: function (D,F) { if(!D) { return this.unsubscribeAll(); } var E=false;for(var B=0,A=this.subscribers.length;B<A;++B) { var C=this.subscribers[B];if(C&&C.contains(D,F)) { this._delete(B);E=true; } } return E; },fire: function () { this.lastError=null;var H=[],A=this.subscribers.length;var D=[].slice.call(arguments,0),C=true,F,B=false;if(this.fireOnce) { if(this.fired) { return true; } else { this.firedWith=D; } } this.fired=true;if(!A&&this.silent) { return true; } if(!this.silent) { } var E=this.subscribers.slice();for(F=0;F<A;++F) { var G=E[F];if(!G) { B=true; } else { C=this.notify(G,D);if(false===C) { if(!this.silent) { } break; } } } return (C!==false); },notify: function (F,C) { var B,H=null,E=F.getScope(this.scope),A=YAHOO.util.Event.throwErrors;if(!this.silent) { } if(this.signature==YAHOO.util.CustomEvent.FLAT) { if(C.length>0) { H=C[0]; } try { B=F.fn.call(E,H,F.obj); } catch(G) { this.lastError=G;if(A) { throw G; } } } else { try { B=F.fn.call(E,this.type,C,F.obj); } catch(D) { this.lastError=D;if(A) { throw D; } } } return B; },unsubscribeAll: function () { var A=this.subscribers.length,B;for(B=A-1;B> -1;B--) { this._delete(B); } this.subscribers=[];return A; },_delete: function (A) { var B=this.subscribers[A];if(B) { delete B.fn;delete B.obj; } this.subscribers.splice(A,1); },toString: function () { return "CustomEvent: "+"'"+this.type+"', "+"context: "+this.scope; } };YAHOO.util.Subscriber=function (A,B,C) { this.fn=A;this.obj=YAHOO.lang.isUndefined(B)?null:B;this.overrideContext=C; };YAHOO.util.Subscriber.prototype.getScope=function (A) { if(this.overrideContext) { if(this.overrideContext===true) { return this.obj; } else { return this.overrideContext; } } return A; };YAHOO.util.Subscriber.prototype.contains=function (A,B) { if(B) { return (this.fn==A&&this.obj==B); } else { return (this.fn==A); } };YAHOO.util.Subscriber.prototype.toString=function () { return "Subscriber { obj: "+this.obj+", overrideContext: "+(this.overrideContext||"no")+" }"; };if(!YAHOO.util.Event) {
    YAHOO.util.Event=function () {
        var G=false,H=[],J=[],A=0,E=[],B=0,C={ 63232: 38,63233: 40,63234: 37,63235: 39,63276: 33,63277: 34,25: 9 },D=YAHOO.env.ua.ie,F="focusin",I="focusout";return { POLL_RETRYS: 500,POLL_INTERVAL: 40,EL: 0,TYPE: 1,FN: 2,WFN: 3,UNLOAD_OBJ: 3,ADJ_SCOPE: 4,OBJ: 5,OVERRIDE: 6,CAPTURE: 7,lastError: null,isSafari: YAHOO.env.ua.webkit,webkit: YAHOO.env.ua.webkit,isIE: D,_interval: null,_dri: null,_specialTypes: { focusin: (D?"focusin":"focus"),focusout: (D?"focusout":"blur") },DOMReady: false,throwErrors: false,startInterval: function () { if(!this._interval) { this._interval=YAHOO.lang.later(this.POLL_INTERVAL,this,this._tryPreloadAttach,null,true); } },onAvailable: function (Q,M,O,P,N) { var K=(YAHOO.lang.isString(Q))?[Q]:Q;for(var L=0;L<K.length;L=L+1) { E.push({ id: K[L],fn: M,obj: O,overrideContext: P,checkReady: N }); } A=this.POLL_RETRYS;this.startInterval(); },onContentReady: function (N,K,L,M) { this.onAvailable(N,K,L,M,true); },onDOMReady: function () { this.DOMReadyEvent.subscribe.apply(this.DOMReadyEvent,arguments); },_addListener: function (M,K,V,P,T,Y) { if(!V||!V.call) { return false; } if(this._isValidCollection(M)) { var W=true;for(var Q=0,S=M.length;Q<S;++Q) { W=this.on(M[Q],K,V,P,T)&&W; } return W; } else { if(YAHOO.lang.isString(M)) { var O=this.getEl(M);if(O) { M=O; } else { this.onAvailable(M,function () { YAHOO.util.Event._addListener(M,K,V,P,T,Y); });return true; } } } if(!M) { return false; } if("unload"==K&&P!==this) { J[J.length]=[M,K,V,P,T];return true; } var L=M;if(T) { if(T===true) { L=P; } else { L=T; } } var N=function (Z) { return V.call(L,YAHOO.util.Event.getEvent(Z,M),P); };var X=[M,K,V,N,L,P,T,Y];var R=H.length;H[R]=X;try { this._simpleAdd(M,K,N,Y); } catch(U) { this.lastError=U;this.removeListener(M,K,V);return false; } return true; },_getType: function (K) { return this._specialTypes[K]||K; },addListener: function (M,P,L,N,O) { var K=((P==F||P==I)&&!YAHOO.env.ua.ie)?true:false;return this._addListener(M,this._getType(P),L,N,O,K); },addFocusListener: function (L,K,M,N) { return this.on(L,F,K,M,N); },removeFocusListener: function (L,K) { return this.removeListener(L,F,K); },addBlurListener: function (L,K,M,N) { return this.on(L,I,K,M,N); },removeBlurListener: function (L,K) { return this.removeListener(L,I,K); },removeListener: function (L,K,R) { var M,P,U;K=this._getType(K);if(typeof L=="string") { L=this.getEl(L); } else { if(this._isValidCollection(L)) { var S=true;for(M=L.length-1;M> -1;M--) { S=(this.removeListener(L[M],K,R)&&S); } return S; } } if(!R||!R.call) { return this.purgeElement(L,false,K); } if("unload"==K) { for(M=J.length-1;M> -1;M--) { U=J[M];if(U&&U[0]==L&&U[1]==K&&U[2]==R) { J.splice(M,1);return true; } } return false; } var N=null;var O=arguments[3];if("undefined"===typeof O) { O=this._getCacheIndex(H,L,K,R); } if(O>=0) { N=H[O]; } if(!L||!N) { return false; } var T=N[this.CAPTURE]===true?true:false;try { this._simpleRemove(L,K,N[this.WFN],T); } catch(Q) { this.lastError=Q;return false; } delete H[O][this.WFN];delete H[O][this.FN];H.splice(O,1);return true; },getTarget: function (M,L) { var K=M.target||M.srcElement;return this.resolveTextNode(K); },resolveTextNode: function (L) { try { if(L&&3==L.nodeType) { return L.parentNode; } } catch(K) { } return L; },getPageX: function (L) { var K=L.pageX;if(!K&&0!==K) { K=L.clientX||0;if(this.isIE) { K+=this._getScrollLeft(); } } return K; },getPageY: function (K) { var L=K.pageY;if(!L&&0!==L) { L=K.clientY||0;if(this.isIE) { L+=this._getScrollTop(); } } return L; },getXY: function (K) { return [this.getPageX(K),this.getPageY(K)]; },getRelatedTarget: function (L) {
            var K=L.relatedTarget;if(!K) {
                if(L.type=="mouseout") {
                    K=L.toElement;
                } else { if(L.type=="mouseover") { K=L.fromElement; } }
            } return this.resolveTextNode(K);
        },getTime: function (M) { if(!M.time) { var L=new Date().getTime();try { M.time=L; } catch(K) { this.lastError=K;return L; } } return M.time; },stopEvent: function (K) { this.stopPropagation(K);this.preventDefault(K); },stopPropagation: function (K) { if(K.stopPropagation) { K.stopPropagation(); } else { K.cancelBubble=true; } },preventDefault: function (K) { if(K.preventDefault) { K.preventDefault(); } else { K.returnValue=false; } },getEvent: function (M,K) { var L=M||window.event;if(!L) { var N=this.getEvent.caller;while(N) { L=N.arguments[0];if(L&&Event==L.constructor) { break; } N=N.caller; } } return L; },getCharCode: function (L) { var K=L.keyCode||L.charCode||0;if(YAHOO.env.ua.webkit&&(K in C)) { K=C[K]; } return K; },_getCacheIndex: function (M,P,Q,O) { for(var N=0,L=M.length;N<L;N=N+1) { var K=M[N];if(K&&K[this.FN]==O&&K[this.EL]==P&&K[this.TYPE]==Q) { return N; } } return -1; },generateId: function (K) { var L=K.id;if(!L) { L="yuievtautoid-"+B;++B;K.id=L; } return L; },_isValidCollection: function (L) { try { return (L&&typeof L!=="string"&&L.length&&!L.tagName&&!L.alert&&typeof L[0]!=="undefined"); } catch(K) { return false; } },elCache: {},getEl: function (K) { return (typeof K==="string")?document.getElementById(K):K; },clearCache: function () { },DOMReadyEvent: new YAHOO.util.CustomEvent("DOMReady",YAHOO,0,0,1),_load: function (L) { if(!G) { G=true;var K=YAHOO.util.Event;K._ready();K._tryPreloadAttach(); } },_ready: function (L) { var K=YAHOO.util.Event;if(!K.DOMReady) { K.DOMReady=true;K.DOMReadyEvent.fire();K._simpleRemove(document,"DOMContentLoaded",K._ready); } },_tryPreloadAttach: function () { if(E.length===0) { A=0;if(this._interval) { this._interval.cancel();this._interval=null; } return; } if(this.locked) { return; } if(this.isIE) { if(!this.DOMReady) { this.startInterval();return; } } this.locked=true;var Q=!G;if(!Q) { Q=(A>0&&E.length>0); } var P=[];var R=function (T,U) { var S=T;if(U.overrideContext) { if(U.overrideContext===true) { S=U.obj; } else { S=U.overrideContext; } } U.fn.call(S,U.obj); };var L,K,O,N,M=[];for(L=0,K=E.length;L<K;L=L+1) { O=E[L];if(O) { N=this.getEl(O.id);if(N) { if(O.checkReady) { if(G||N.nextSibling||!Q) { M.push(O);E[L]=null; } } else { R(N,O);E[L]=null; } } else { P.push(O); } } } for(L=0,K=M.length;L<K;L=L+1) { O=M[L];R(this.getEl(O.id),O); } A--;if(Q) { for(L=E.length-1;L> -1;L--) { O=E[L];if(!O||!O.id) { E.splice(L,1); } } this.startInterval(); } else { if(this._interval) { this._interval.cancel();this._interval=null; } } this.locked=false; },purgeElement: function (O,P,R) { var M=(YAHOO.lang.isString(O))?this.getEl(O):O;var Q=this.getListeners(M,R),N,K;if(Q) { for(N=Q.length-1;N> -1;N--) { var L=Q[N];this.removeListener(M,L.type,L.fn); } } if(P&&M&&M.childNodes) { for(N=0,K=M.childNodes.length;N<K;++N) { this.purgeElement(M.childNodes[N],P,R); } } },getListeners: function (M,K) { var P=[],L;if(!K) { L=[H,J]; } else { if(K==="unload") { L=[J]; } else { K=this._getType(K);L=[H]; } } var R=(YAHOO.lang.isString(M))?this.getEl(M):M;for(var O=0;O<L.length;O=O+1) { var T=L[O];if(T) { for(var Q=0,S=T.length;Q<S;++Q) { var N=T[Q];if(N&&N[this.EL]===R&&(!K||K===N[this.TYPE])) { P.push({ type: N[this.TYPE],fn: N[this.FN],obj: N[this.OBJ],adjust: N[this.OVERRIDE],scope: N[this.ADJ_SCOPE],index: Q }); } } } } return (P.length)?P:null; },_unload: function (R) { var L=YAHOO.util.Event,O,N,M,Q,P,S=J.slice(),K;for(O=0,Q=J.length;O<Q;++O) { M=S[O];if(M) { K=window;if(M[L.ADJ_SCOPE]) { if(M[L.ADJ_SCOPE]===true) { K=M[L.UNLOAD_OBJ]; } else { K=M[L.ADJ_SCOPE]; } } M[L.FN].call(K,L.getEvent(R,M[L.EL]),M[L.UNLOAD_OBJ]);S[O]=null; } } M=null;K=null;J=null;if(H) { for(N=H.length-1;N> -1;N--) { M=H[N];if(M) { L.removeListener(M[L.EL],M[L.TYPE],M[L.FN],N); } } M=null; } L._simpleRemove(window,"unload",L._unload); },_getScrollLeft: function () { return this._getScroll()[1]; },_getScrollTop: function () { return this._getScroll()[0]; },_getScroll: function () { var K=document.documentElement,L=document.body;if(K&&(K.scrollTop||K.scrollLeft)) { return [K.scrollTop,K.scrollLeft]; } else { if(L) { return [L.scrollTop,L.scrollLeft]; } else { return [0,0]; } } },regCE: function () { },_simpleAdd: function () { if(window.addEventListener) { return function (M,N,L,K) { M.addEventListener(N,L,(K)); }; } else { if(window.attachEvent) { return function (M,N,L,K) { M.attachEvent("on"+N,L); }; } else { return function () { }; } } } (),_simpleRemove: function () { if(window.removeEventListener) { return function (M,N,L,K) { M.removeEventListener(N,L,(K)); }; } else { if(window.detachEvent) { return function (L,M,K) { L.detachEvent("on"+M,K); }; } else { return function () { }; } } } ()
        };
    } ();(function () {
        var EU=YAHOO.util.Event;EU.on=EU.addListener;EU.onFocus=EU.addFocusListener;EU.onBlur=EU.addBlurListener;
        if(EU.isIE) { if(self!==self.top) { document.onreadystatechange=function () { if(document.readyState=="complete") { document.onreadystatechange=null;EU._ready(); } }; } else { YAHOO.util.Event.onDOMReady(YAHOO.util.Event._tryPreloadAttach,YAHOO.util.Event,true);var n=document.createElement("p");EU._dri=setInterval(function () { try { n.doScroll("left");clearInterval(EU._dri);EU._dri=null;EU._ready();n=null; } catch(ex) { } },EU.POLL_INTERVAL); } } else { if(EU.webkit&&EU.webkit<525) { EU._dri=setInterval(function () { var rs=document.readyState;if("loaded"==rs||"complete"==rs) { clearInterval(EU._dri);EU._dri=null;EU._ready(); } },EU.POLL_INTERVAL); } else { EU._simpleAdd(document,"DOMContentLoaded",EU._ready); } } EU._simpleAdd(window,"load",EU._load);EU._simpleAdd(window,"unload",EU._unload);EU._tryPreloadAttach();
    })();
} YAHOO.util.EventProvider=function () { };YAHOO.util.EventProvider.prototype={ __yui_events: null,__yui_subscribers: null,subscribe: function (A,C,F,E) { this.__yui_events=this.__yui_events||{};var D=this.__yui_events[A];if(D) { D.subscribe(C,F,E); } else { this.__yui_subscribers=this.__yui_subscribers||{};var B=this.__yui_subscribers;if(!B[A]) { B[A]=[]; } B[A].push({ fn: C,obj: F,overrideContext: E }); } },unsubscribe: function (C,E,G) { this.__yui_events=this.__yui_events||{};var A=this.__yui_events;if(C) { var F=A[C];if(F) { return F.unsubscribe(E,G); } } else { var B=true;for(var D in A) { if(YAHOO.lang.hasOwnProperty(A,D)) { B=B&&A[D].unsubscribe(E,G); } } return B; } return false; },unsubscribeAll: function (A) {
    return this.unsubscribe(A);
},createEvent: function (B,G) { this.__yui_events=this.__yui_events||{};var E=G||{},D=this.__yui_events,F;if(D[B]) { } else { F=new YAHOO.util.CustomEvent(B,E.scope||this,E.silent,YAHOO.util.CustomEvent.FLAT,E.fireOnce);D[B]=F;if(E.onSubscribeCallback) { F.subscribeEvent.subscribe(E.onSubscribeCallback); } this.__yui_subscribers=this.__yui_subscribers||{};var A=this.__yui_subscribers[B];if(A) { for(var C=0;C<A.length;++C) { F.subscribe(A[C].fn,A[C].obj,A[C].overrideContext); } } } return D[B]; },fireEvent: function (B) { this.__yui_events=this.__yui_events||{};var D=this.__yui_events[B];if(!D) { return null; } var A=[];for(var C=1;C<arguments.length;++C) { A.push(arguments[C]); } return D.fire.apply(D,A); },hasEvent: function (A) { if(this.__yui_events) { if(this.__yui_events[A]) { return true; } } return false; }
};(function () { var A=YAHOO.util.Event,C=YAHOO.lang;YAHOO.util.KeyListener=function (D,I,E,F) { if(!D) { } else { if(!I) { } else { if(!E) { } } } if(!F) { F=YAHOO.util.KeyListener.KEYDOWN; } var G=new YAHOO.util.CustomEvent("keyPressed");this.enabledEvent=new YAHOO.util.CustomEvent("enabled");this.disabledEvent=new YAHOO.util.CustomEvent("disabled");if(C.isString(D)) { D=document.getElementById(D); } if(C.isFunction(E)) { G.subscribe(E); } else { G.subscribe(E.fn,E.scope,E.correctScope); } function H(O,N) { if(!I.shift) { I.shift=false; } if(!I.alt) { I.alt=false; } if(!I.ctrl) { I.ctrl=false; } if(O.shiftKey==I.shift&&O.altKey==I.alt&&O.ctrlKey==I.ctrl) { var J,M=I.keys,L;if(YAHOO.lang.isArray(M)) { for(var K=0;K<M.length;K++) { J=M[K];L=A.getCharCode(O);if(J==L) { G.fire(L,O);break; } } } else { L=A.getCharCode(O);if(M==L) { G.fire(L,O); } } } } this.enable=function () { if(!this.enabled) { A.on(D,F,H);this.enabledEvent.fire(I); } this.enabled=true; };this.disable=function () { if(this.enabled) { A.removeListener(D,F,H);this.disabledEvent.fire(I); } this.enabled=false; };this.toString=function () { return "KeyListener ["+I.keys+"] "+D.tagName+(D.id?"["+D.id+"]":""); }; };var B=YAHOO.util.KeyListener;B.KEYDOWN="keydown";B.KEYUP="keyup";B.KEY={ ALT: 18,BACK_SPACE: 8,CAPS_LOCK: 20,CONTROL: 17,DELETE: 46,DOWN: 40,END: 35,ENTER: 13,ESCAPE: 27,HOME: 36,LEFT: 37,META: 224,NUM_LOCK: 144,PAGE_DOWN: 34,PAGE_UP: 33,PAUSE: 19,PRINTSCREEN: 44,RIGHT: 39,SCROLL_LOCK: 145,SHIFT: 16,SPACE: 32,TAB: 9,UP: 38 }; })();YAHOO.register("event",YAHOO.util.Event,{ version: "2.8.1",build: "19" });YAHOO.register("yahoo-dom-event",YAHOO,{ version: "2.8.1",build: "19" });

/** YUI selector,自行修复了ie8下兼容模式判断失误造成的bug **/
(function () { var a=YAHOO.util;a.Selector={ _foundCache: [],_regexCache: {},_re: { nth: /^(?:([-]?\d*)(n){1}|(odd|even)$)*([-+]?\d*)$/,attr: /(\[.*\])/g,urls: /^(?:href|src)/ },document: window.document,attrAliases: {},shorthand: { "\\#(-?[_a-z]+[-\\w]*)": "[id=$1]","\\.(-?[_a-z]+[-\\w]*)": "[class~=$1]" },operators: { "=": function (b,c) { return b===c },"!=": function (b,c) { return b!==c },"~=": function (b,d) { var c=" ";return (c+b+c).indexOf((c+d+c))> -1 },"|=": function (b,c) { return b===c||b.slice(0,c.length+1)===c+"-" },"^=": function (b,c) { return b.indexOf(c)===0 },"$=": function (b,c) { return b.slice(-c.length)===c },"*=": function (b,c) { return b.indexOf(c)> -1 },"": function (b,c) { return b } },pseudos: { root: function (b) { return b===b.ownerDocument.documentElement },"nth-child": function (b,c) { return a.Selector._getNth(b,c) },"nth-last-child": function (b,c) { return a.Selector._getNth(b,c,null,true) },"nth-of-type": function (b,c) { return a.Selector._getNth(b,c,b.tagName) },"nth-last-of-type": function (b,c) { return a.Selector._getNth(b,c,b.tagName,true) },"first-child": function (b) { return a.Selector._getChildren(b.parentNode)[0]===b },"last-child": function (c) { var b=a.Selector._getChildren(c.parentNode);return b[b.length-1]===c },"first-of-type": function (b,c) { return a.Selector._getChildren(b.parentNode,b.tagName)[0] },"last-of-type": function (c,d) { var b=a.Selector._getChildren(c.parentNode,c.tagName);return b[b.length-1] },"only-child": function (c) { var b=a.Selector._getChildren(c.parentNode);return b.length===1&&b[0]===c },"only-of-type": function (b) { return a.Selector._getChildren(b.parentNode,b.tagName).length===1 },empty: function (b) { return b.childNodes.length===0 },not: function (b,c) { return !a.Selector.test(b,c) },contains: function (b,d) { var c=b.innerText||b.textContent||"";return c.indexOf(d)> -1 },checked: function (b) { return b.checked===true } },test: function (f,d) { f=a.Selector.document.getElementById(f)||f;if(!f) { return false } var c=d?d.split(","):[];if(c.length) { for(var e=0,b=c.length;e<b;++e) { if(a.Selector._test(f,c[e])) { return true } } return false } return a.Selector._test(f,d) },_test: function (d,g,f,e) { f=f||a.Selector._tokenize(g).pop()||{};if(!d.tagName||(f.tag!=="*"&&d.tagName!==f.tag)||(e&&d._found)) { return false } if(f.attributes.length) { var b,h,c=a.Selector._re.urls;if(!d.attributes||!d.attributes.length) { return false } for(var j=0,l;l=f.attributes[j++];) { h=(c.test(l[0]))?2:0;b=d.getAttribute(l[0],h);if(b===null||b===undefined) { return false } if(a.Selector.operators[l[1]]&&!a.Selector.operators[l[1]](b,l[2])) { return false } } } if(f.pseudos.length) { for(var j=0,k=f.pseudos.length;j<k;++j) { if(a.Selector.pseudos[f.pseudos[j][0]]&&!a.Selector.pseudos[f.pseudos[j][0]](d,f.pseudos[j][1])) { return false } } } return (f.previous&&f.previous.combinator!==",")?a.Selector._combinators[f.previous.combinator](d,f):true },filter: function (e,d) { e=e||[];var g,c=[],h=a.Selector._tokenize(d);if(!e.item) { for(var f=0,b=e.length;f<b;++f) { if(!e[f].tagName) { g=a.Selector.document.getElementById(e[f]);if(g) { e[f]=g } else { } } } } c=a.Selector._filter(e,a.Selector._tokenize(d)[0]);return c },_filter: function (e,g,h,d) { var c=h?null:[],j=a.Selector._foundCache;for(var f=0,b=e.length;f<b;f++) { if(!a.Selector._test(e[f],"",g,d)) { continue } if(h) { return e[f] } if(d) { if(e[f]._found) { continue } e[f]._found=true;j[j.length]=e[f] } c[c.length]=e[f] } return c },query: function (c,d,e) { var b=a.Selector._query(c,d,e);return b },_query: function (h,n,o,f) { var q=(o)?null:[],e;if(!h) { return q } var d=h.split(",");if(d.length>1) { var p;for(var j=0,k=d.length;j<k;++j) { p=a.Selector._query(d[j],n,o,true);q=o?p:q.concat(p) } a.Selector._clearFoundCache();return q } if(n&&!n.nodeName) { n=a.Selector.document.getElementById(n);if(!n) { return q } } n=n||a.Selector.document;if(n.nodeName!=="#document") { a.Dom.generateId(n);h=n.tagName+"#"+n.id+" "+h;e=n;n=n.ownerDocument } var m=a.Selector._tokenize(h);var l=m[a.Selector._getIdTokenIndex(m)],b=[],c,g=m.pop()||{};if(l) { c=a.Selector._getId(l.attributes) } if(c) { e=e||a.Selector.document.getElementById(c);if(e&&(n.nodeName==="#document"||a.Dom.isAncestor(n,e))) { if(a.Selector._test(e,null,l)) { if(l===g) { b=[e] } else { if(l.combinator===" "||l.combinator===">") { n=e } } } } else { return q } } if(n&&!b.length) { b=n.getElementsByTagName(g.tag) } if(b.length) { q=a.Selector._filter(b,g,o,f) } return q },_clearFoundCache: function () { var f=a.Selector._foundCache;for(var c=0,b=f.length;c<b;++c) { try { delete f[c]._found } catch(d) { f[c].removeAttribute("_found") } } f=[] },_getRegExp: function (d,b) { var c=a.Selector._regexCache;b=b||"";if(!c[d+b]) { c[d+b]=new RegExp(d,b) } return c[d+b] },_getChildren: function () { if(document.documentElement.children&&document.documentElement.children.tags) { return function (c,b) { return (b)?c.children.tags(b):c.children||[] } } else { return function (f,c) { var e=[],g=f.childNodes;for(var d=0,b=g.length;d<b;++d) { if(g[d].tagName) { if(!c||g[d].tagName===c) { e.push(g[d]) } } } return e } } } (),_combinators: { " ": function (c,b) { while((c=c.parentNode)) { if(a.Selector._test(c,"",b.previous)) { return true } } return false },">": function (c,b) { return a.Selector._test(c.parentNode,null,b.previous) },"+": function (d,c) { var b=d.previousSibling;while(b&&b.nodeType!==1) { b=b.previousSibling } if(b&&a.Selector._test(b,null,c.previous)) { return true } return false },"~": function (d,c) { var b=d.previousSibling;while(b) { if(b.nodeType===1&&a.Selector._test(b,null,c.previous)) { return true } b=b.previousSibling } return false } },_getNth: function (d,o,q,h) { a.Selector._re.nth.test(o);var m=parseInt(RegExp.$1,10),c=RegExp.$2,j=RegExp.$3,k=parseInt(RegExp.$4,10)||0,p=[],f;var l=a.Selector._getChildren(d.parentNode,q);if(j) { m=2;f="+";c="n";k=(j==="odd")?1:0 } else { if(isNaN(m)) { m=(c)?1:0 } } if(m===0) { if(h) { k=l.length-k+1 } if(l[k-1]===d) { return true } else { return false } } else { if(m<0) { h=!!h;m=Math.abs(m) } } if(!h) { for(var e=k-1,g=l.length;e<g;e+=m) { if(e>=0&&l[e]===d) { return true } } } else { for(var e=l.length-k,g=l.length;e>=0;e-=m) { if(e<g&&l[e]===d) { return true } } } return false },_getId: function (c) { for(var d=0,b=c.length;d<b;++d) { if(c[d][0]=="id"&&c[d][1]==="=") { return c[d][2] } } },_getIdTokenIndex: function (d) { for(var c=0,b=d.length;c<b;++c) { if(a.Selector._getId(d[c].attributes)) { return c } } return -1 },_patterns: { tag: /^((?:-?[_a-z]+[\w-]*)|\*)/i,attributes: /^\[([-a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^\]]*?)['"]?\]/i,pseudos: /^:([-\w]+)(?:\(['"]?(.+)['"]?\))*/i,combinator: /^\s*([>+~]|\s)\s*/ },_tokenize: function (b) { var d={},h=[],i,g=false,f=a.Selector._patterns,c;b=a.Selector._replaceShorthand(b);do { g=false;for(var e in f) { if(YAHOO.lang.hasOwnProperty(f,e)) { if(e!="tag"&&e!="combinator") { d[e]=d[e]||[] } if((c=f[e].exec(b))) { g=true;if(e!="tag"&&e!="combinator") { if(e==="attributes"&&c[1]==="id") { d.id=c[3] } d[e].push(c.slice(1)) } else { d[e]=c[1] } b=b.replace(c[0],"");if(e==="combinator"||!b.length) { d.attributes=a.Selector._fixAttributes(d.attributes);d.pseudos=d.pseudos||[];d.tag=d.tag?d.tag.toUpperCase():"*";h.push(d);d={ previous: d} } } } } } while(g);return h },_fixAttributes: function (c) { var d=a.Selector.attrAliases;c=c||[];for(var e=0,b=c.length;e<b;++e) { if(d[c[e][0]]) { c[e][0]=d[c[e][0]] } if(!c[e][1]) { c[e][1]="" } } return c },_replaceShorthand: function (c) { var d=a.Selector.shorthand;var e=c.match(a.Selector._re.attr);if(e) { c=c.replace(a.Selector._re.attr,"REPLACED_ATTRIBUTE") } for(var g in d) { if(YAHOO.lang.hasOwnProperty(d,g)) { c=c.replace(a.Selector._getRegExp(g,"gi"),d[g]) } } if(e) { for(var f=0,b=e.length;f<b;++f) { c=c.replace("REPLACED_ATTRIBUTE",e[f]) } } return c } };if(YAHOO.env.ua.ie&&((!document.documentMode&&YAHOO.env.ua.ie<8)||document.documentMode<8)) { a.Selector.attrAliases["class"]="className";a.Selector.attrAliases["for"]="htmlFor" } })();YAHOO.register("selector",YAHOO.util.Selector,{ version: "2.8.1",build: "19" });

/** YUI event-mouseenter **/
(function () { var B=YAHOO.util.Event,G=YAHOO.lang,E=B.addListener,F=B.removeListener,C=B.getListeners,D=[],H={ mouseenter: "mouseover",mouseleave: "mouseout" },A=function (N,M,L) { var J=B._getCacheIndex(D,N,M,L),I,K;if(J>=0) { I=D[J]; } if(N&&I) { K=F.call(B,I[0],M,I[3]);if(K) { delete D[J][2];delete D[J][3];D.splice(J,1); } } return K; };G.augmentObject(B._specialTypes,H);G.augmentObject(B,{ _createMouseDelegate: function (I,J,K) { return function (Q,M) { var P=this,L=B.getRelatedTarget(Q),O,N;if(P!=L&&!YAHOO.util.Dom.isAncestor(P,L)) { O=P;if(K) { if(K===true) { O=J; } else { O=K; } } N=[Q,P,J];if(M) { N.splice(2,0,M); } return I.apply(O,N); } }; },addListener: function (M,L,K,N,O) { var I,J;if(H[L]) { I=B._createMouseDelegate(K,N,O);I.mouseDelegate=true;D.push([M,L,K,I]);J=E.call(B,M,L,I); } else { J=E.apply(B,arguments); } return J; },removeListener: function (L,K,J) { var I;if(H[K]) { I=A.apply(B,arguments); } else { I=F.apply(B,arguments); } return I; },getListeners: function (N,M) { var L=[],P,K=(M==="mouseover"||M==="mouseout"),O,J,I;if(M&&(K||H[M])) { P=C.call(B,N,this._getType(M));if(P) { for(J=P.length-1;J> -1;J--) { I=P[J];O=I.fn.mouseDelegate;if((H[M]&&O)||(K&&!O)) { L.push(I); } } } } else { L=C.apply(B,arguments); } return (L&&L.length)?L:null; } },true);B.on=B.addListener; } ());YAHOO.register("event-mouseenter",YAHOO.util.Event,{ version: "2.8.1",build: "19" });

/** YUI event-delegate **/
(function () { var A=YAHOO.util.Event,C=YAHOO.lang,B=[],D=function (H,E,F) { var G;if(!H||H===F) { G=false; } else { G=YAHOO.util.Selector.test(H,E)?H:D(H.parentNode,E,F); } return G; };C.augmentObject(A,{ _createDelegate: function (F,E,G,H) { return function (I) { var J=this,N=A.getTarget(I),L=E,P=(J.nodeType===9),Q,K,O,M;if(C.isFunction(E)) { Q=E(N); } else { if(C.isString(E)) { if(!P) { O=J.id;if(!O) { O=A.generateId(J); } M=("#"+O+" ");L=(M+E).replace(/,/gi,(","+M)); } if(YAHOO.util.Selector.test(N,L)) { Q=N; } else { if(YAHOO.util.Selector.test(N,((L.replace(/,/gi," *,"))+" *"))) { Q=D(N,L,J); } } } } if(Q) { K=Q;if(H) { if(H===true) { K=G; } else { K=H; } } return F.call(K,I,Q,J,G); } }; },delegate: function (F,J,L,G,H,I) { var E=J,K,M;if(C.isString(G)&&!YAHOO.util.Selector) { return false; } if(J=="mouseenter"||J=="mouseleave") { if(!A._createMouseDelegate) { return false; } E=A._getType(J);K=A._createMouseDelegate(L,H,I);M=A._createDelegate(function (P,O,N) { return K.call(O,P,N); },G,H,I); } else { M=A._createDelegate(L,G,H,I); } B.push([F,E,L,M]);return A.on(F,E,M); },removeDelegate: function (F,J,I) { var K=J,H=false,G,E;if(J=="mouseenter"||J=="mouseleave") { K=A._getType(J); } G=A._getCacheIndex(B,F,K,I);if(G>=0) { E=B[G]; } if(F&&E) { H=A.removeListener(E[0],E[1],E[3]);if(H) { delete B[G][2];delete B[G][3];B.splice(G,1); } } return H; } }); } ());YAHOO.register("event-delegate",YAHOO.util.Event,{ version: "2.8.1",build: "19" });


/** 全局变量定义 **/
var FDEV=YAHOO, 	//FDEV总体封装，所有的应用层方法都不应该暴露底层的YAHOO核心
	FYU=FDEV.util,
	FYD=FYU.Dom,
	FYE=FYU.Event,
	FYS=FYU.Selector.query, //请注意FYS直接定义到YAHOO.util.Selector.query而非YAHOO.util.selector上
	FYG=FYD.get,
	FTA=function (iterable) {
	    if(!iterable) return []; //如果不是队列无法转换则直接发回一个空数组
	    if('toArray' in Object(iterable)) return iterable.toArray(); //如果对象自身就存在toArray方法则直接调用该方法转化
	    var len=iterable.length||0,res=new Array(len);
	    while(len--) {
	        res[len]=iterable[len];
	    }
	    return res;
	};

/** '$'的扩展(因为模板的原因“$”只能用在外链的js中，在页面中直接写js时不可用$，必须采用其替代方式) **/
var $Y=YAHOO.util,
	$D=$Y.Dom,
	$E=$Y.Event,
	$$=$Y.Selector.query,
	$=$D.get, 	//以上部分是对YAHOO方法的重新封装，不能使用$符时可用上面的全局方法(比如$ = FYG，$D= FYD)代替
/*仿prototype库创建的$A方法，可见队列转化成数组，从而拥有一些列数组拥有的特殊(包括下面扩展的)功能*/
	$A=FTA;

/** 创建FD下的命名空间 **/
var FD=YAHOO.namespace('FD');
FD.namespace=function () {
    var args=Array.prototype.slice.call(arguments,0),i;
    for(i=0;i<args.length;++i) {
        if(args[i].indexOf('FD')!=0) {
            args[i]='FD.'+args[i];
        }
    }
    return YAHOO.namespace.apply(null,args);
}
FD.namespace('core','util','widget', 'FD.sys');

/** Array 原型扩展 **/
/* 以下部分实现javascript 1.6的新特性,参见：https://developer.mozilla.org/en/New_in_JavaScript_1.6 */
/*
* @method  indexOf 返回指定对象在数组中内第一次出现位置
* @param {Object} obj 指定的对象
* @param {Object} fromIndex 开始寻找的位置，省略默认从0开始，负数从后面开始寻找
* @return {Number} 对象所在位置，不存在则返回-1
*/
if(!Array.prototype.indexOf) {
    Array.prototype.indexOf=function (obj,fromIndex) {
        if(fromIndex==null) {
            fromIndex=0;
        } else if(fromIndex<0) {
            fromIndex=Math.max(0,this.length+fromIndex);
        }
        for(var i=fromIndex;i<this.length;i++) {
            if(this[i]===obj)
                return i;
        }
        return -1;
    };
}

/*
* @method lastIndexOf 返回指定对象在数组中内最后一次出现位置
* @param {Object} fromIndex 开始寻找的位置，省略默认从0开始，负数从后面开始寻找
* @return {Number} 对象所在位置，不存在则返回-1
*/
if(!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf=function (obj,fromIndex) {
        if(fromIndex==null) {
            fromIndex=this.length-1;
        } else if(fromIndex<0) {
            fromIndex=Math.max(0,this.length+fromIndex);
        }
        for(var i=fromIndex;i>=0;i--) {
            if(this[i]===obj)
                return i;
        }
        return -1;
    };
}

/*
* @method forEach 为数组中的每一个对象绑定事件 
* @param {Function} f 需要绑定的事件
* @param {Object} obj 所邦绑定事件的宿主对象
*/
if(!Array.prototype.forEach) {
    Array.prototype.forEach=function (f,obj) {
        for(var i=0,len=this.length;i<len;++i) {
            f.call(obj,this[i],i,this);
        }
    };
}

/*
* @method filter 遍历数组，将符合判断函数要求的对象组合生成一个新的数组
* @param {Function} f 判断函数
* @param {Object} obj 判断函数执行时的宿主对象
* @return {Array} 符合判断要求生成的新数组
*/
if(!Array.prototype.filter) {
    Array.prototype.filter=function (f,obj) {
        var res=[];
        for(var i=0,len=this.length;i<len;++i) {
            if(f.call(obj,this[i],i,this)) {
                res.push(this[i]);
            }
        }
        return res;
    };
}

/*
* @method map 遍历数组执行所给的函数，将返回结果生成一个新的数组
* @param {Function} f 需要执行的函数
* @param {Object} obj 函数执行时的宿主对象
* @return {Array} 函数执行后生成的新数组
*/
if(!Array.prototype.map) {
    Array.prototype.map=function (f,obj) {
        var res=[];
        for(var i=0,len=this.length;i<len;++i) {
            res.push(f.call(obj,this[i],i,this));
        }
        return res;
    }
}

/*
* @method some 判断数组中是否存在一些对象满足所给函数的要求
* @param {Function} f 需要执行的判断函数
* @param {Object} obj 函数执行时的宿主对象
* @return {Boolean} 判断结果
*/
if(!Array.prototype.some) {
    Array.prototype.some=function (f,obj) {
        for(var i=0,len=this.length;i<len;++i) {
            if(f.call(obj,this[i],i,this)) {
                return true;
            }
        }
        return false;
    };
}

/*
* @method every 判断数组中是否所有对象都满足所给函数的要求
* @param {Function} f 需要执行的判断函数
* @param {Object} obj 函数执行时的宿主对象
* @return {Boolean} 判断结果
*/
if(!Array.prototype.every) {
    Array.prototype.every=function (f,obj) {
        for(var i=0,len=this.length;i<len;++i) {
            if(!f.call(obj,this[i],i,this)) {
                return false;
            }
        }
        return true;
    };
}

/* 以下部分为常用方法的扩展 */
/*
* @method contains 判断数组中是否存在所给定的对象
* @param {Object} obj 函数执行时的宿主对象
* @return {Boolean} 判断结果，存在为true，不存在为false
*/
Array.prototype.contains=function (obj) {
    return this.indexOf(obj)!= -1;
}

/*
* @method insertAt 判断数组某一位前插入给定对象
* @param {Object} obj 需要插入的对象
* @param {Number} i 需要插入的位置
* @return {Array} 插入对象后的数组
*/
Array.prototype.insertAt=function (obj,i) {
    i=i||0;
    this.splice(i,0,obj);
}

/*
* @method insertBefore 在数组的某个对象前插入新的对象
* @param {Object} obj 需要插入的对象
* @param {Object} obj2 在该对象前插入
* @return {Array} 插入对象后的数组
*/
Array.prototype.insertBefore=function (obj,obj2) {
    var i=this.indexOf(obj2);
    if(i== -1) {
        this.push(obj);
    } else {
        this.splice(i,0,obj);
    }
}

/*
* @method removeAt 删除数组中的第n个对象
* @param {Number} i 要删除的对象的位数
* @return {Array} 删除对象后的数组
*/
Array.prototype.removeAt=function (i) {
    this.splice(i,1);
}

/*
* @method remove 删除数组中的某个给定对象
* @param {Object} obj 要删除的对象
* @return {Array} 删除对象后的数组
*/
Array.prototype.remove=function (obj) {
    var i=this.indexOf(obj);
    if(i!= -1) this.splice(i,1);
}

/*
* @method del 删除数组中的第n个对象后的新数组(不影响老数组)
* @param {Number} i 要删除的对象的位数
* @return {Array} 删除某对象后的组成的新数组
*/
Array.prototype.del=function (i) {
    if(i<0) return this;
    return this.slice(0,i).concat(this.slice(i+1,this.length));
}


/** String 原型扩展 **/
/*
* @method toQueryParams 将“a=1&b=2&c=3”转化为{a=1,b=2,c=3}的hash对象
* @return {Object} 转化过的hash对象
*/
if(!String.prototype.toQueryParams) {
    String.prototype.toQueryParams=function () {
        var hash={};
        var params=this.split('&');
        var rd=/([^=]*)=(.*)/;
        for(var j=0;j<params.length;j++) {
            var match=rd.exec(params[j]);
            if(!match) continue;
            var key=decodeURIComponent(match[1]);
            var value=match[2]?decodeURIComponent(match[2]):undefined;
            if(hash[key]!==undefined) {
                if(hash[key].constructor!=Array)
                    hash[key]=[hash[key]];
                if(value)
                    hash[key].push(value);
            } else {
                hash[key]=value;
            }
        }
        return hash;
    }
}

/*
* @method trim 删除字符串头尾的空格
* @return {String} 
*/
if(!String.prototype.trim) {
    String.prototype.trim=function () {
        var re=/(^[\u3000\s]+)|([\u3000\s]+$)/g;
        return function () { return this.replace(re,''); };
    } ();
}

/*
* @method replaceAll 替换字符串中所有匹配的字符(串)
* @param {String} from 需要被替换的字符(串)
* @param {String} to 要被替换成的字符(串)
* @return {String} 
*/
if(!String.prototype.replaceAll) {
    String.prototype.replaceAll=function (from,to) {
        return this.replace(new RegExp(from,'gm'),to);
    }
}

/*
* @method lenB 返回字符串的长度，其中中文字占2个单位
* @return {Number} 字符串中字符的个数(中文字算2个)
*/
if(!String.prototype.lenB) {
    String.prototype.lenB=function () {
        return this.replace(/[^\x00-\xff]/g,'**').length;
    }
}

/*
* @method cut 按指定字节长度截取字符串，如截取半个汉字则舍弃
* @return {String} 
*/
if(!String.prototype.cut) {
    String.prototype.cut=function (len, ext) {
        var val=this;
        if(val=='undefined') return '';
        var cl=0;
        len=parseInt(len);
        if(val.lenB()<=len) return val;
        for(var i=0;i<val.length;i++) {
            var code=val.charCodeAt(i);
            if(code<0||code>255) { cl+=2 } else { cl++ }
            if(cl>len) { return val.substr(0,i==0?i=1:i) + (ext || ''); }
        }
        return '';
    }
}

/** 修复ie0.009和ff0.495的类似bug **/
(function () {
    var toFixed=Number.prototype.toFixed;
    Number.prototype.toFixed=function (fractionDigits) {
        var tmp=this,pre=Math.pow(10,fractionDigits||0);
        tmp*=pre;
        //tmp=toFixed.call(tmp,fractionDigits);
        tmp=Math.round(tmp);
        tmp/=pre;
        return toFixed.call(tmp,fractionDigits);
    };
})();
/** 以下位FD.common 常用方法扩展 **/
FD.common={
    /**
     * 建议的cookie获取方法
     * @param {Object} key
     * @param {object} options
     */
    cookie:function(key, options){
        options || (options = {});
        var code = options.raw ? function(s){
            return s;
        } : unescape;
        var value = document.cookie.match('(?:^|;)\\s*' + key + '=([^;]*)');
        return value ? code(value[1]) : '';	
    },
    /**
    * 移除文字前后的空白字符
    * @method trim
    * @param {String} str 
    * @deprecated 使用String.prototpye.trim()来替代
    */
    trim: function (str) {
        return str.replace(/(^\s*)|(\s*$)/g,'');
    },

    /**
    * 编码HTML (from prototype framework 1.4)
    * @method escapeHTML
    * @param {Object} str
    */
    escapeHTML: function (str) {
        var div=document.createElement('div');
        var text=document.createTextNode(str);
        div.appendChild(text);
        return div.innerHTML;
    },

    /**
    * 解码HTML (from prototype framework 1.4)
    * @method unescapeHTML
    * @param {Object} str
    */
    unescapeHTML: function (str) {
        var div=document.createElement('div');
        div.innerHTML=str.replace(/<\/?[^>]+>/gi,'');
        return div.childNodes[0]?div.childNodes[0].nodeValue:'';
    },

    /**
    * 删除字符串中的(x)html中的标签信息
    * @method stripTags
    * @param {Object} str
    */
    stripTags: function (str) {
        return str.replace(/<\/?[^>]+>/gi,'');
    },

    /**
    * 转换 NodeList 或者 arguments 为数组
    * @method toArray
    * @param {Object} list
    * @param {Object} start
    * @return {Array} 转换后的数组，如果start大于list的容量，返回空数组
    */
    toArray: function (list,start) {
        var array=[];
        for(var i=start||0;i<list.length;i++) {
            array[array.length]=list[i];
        }
        return array;
    },

    /**
    * 复制配置属性给某对象，如果对象已存在该配置，不进行覆盖
    * @param {Object} obj 目标对象 
    * @param {Object} config 包含属性/参数 对象
    */
    applyIf: function (obj,config) {
        if(obj&&config&&typeof config=='object') {
            for(var p in config) {
                if(!YAHOO.lang.hasOwnProperty(obj,p))
                    obj[p]=config[p];
            }
        }
        return obj;
    },

    /**
    * 复制配置属性给某对象，如果对象已存在该配置，将被覆盖为新属性
    * @param {Object} obj 目标对象 
    * @param {Object} config 包含属性/参数 对象
    */
    apply: function (obj,config) {
        if(obj&&config&&typeof config=='object') {
            for(var p in config)
                obj[p]=config[p];
        }
        return obj;
    },
    /**
    * 新开窗口或者当前窗口打开(默认新开窗口),解决IE下referrer丢失的问题
    * @param {String} url
    * @argument {String} 新开窗口or当前窗口 _self|_blank
    */
    goTo: function (url) {
        var a=null,
			bd=null,
			b='_blank',
	    	target=arguments[1]==b?b:'_self';
		if(document.all){
			a = document.createElement('a'),
			bd = document.body;
			if(!a.click) {
				return window.open(url,target);
			}
			a.setAttribute('target',target);
			a.setAttribute('href',url);
			a.style.display='none';
			if(!bd) return;
			bd.appendChild(a);
			a.click();
			if(target==b) {
				setTimeout(function () {
					try {
						bd.removeChild(a);
					}catch(e){}
				},500);
			}
		}else{
			return window.open(url,target);
		}	
        
    },

    /**
    * 模仿数组的concat()方法，主要针对使用document.getElementsByTagName("input")这种方法拿到的数组
    * @param 任意多个Array()类型的数组，或者长得像数组的Objcet()
    * @return (Array)
    */
    concat: function () {
        var args=arguments;
        var arr=[],l,n;
        outer: for(var i=0,l=args.length;i<l;i++) {
            inner: for(var j=0,n=args[i].length;j<n;j++) {
                arr.push(args[i][j]);
            }
        }
        return arr;
    },

    /**
    * 获取form表单的action 属性值
    * @param (String|Object) form ——表单对象或form表单id
    * @return (String)
    */
    getFormAction: function (form) {
        form=FYG(form);
        if(form&&form.tagName.toLowerCase()=='form') {
            return form.attributes.getNamedItem('action').value;
        }
        return null;
    },

    /**
    * 将form表单下的input select textarea控件的name 和 value 值组成的键值对 name=value 用特定连接符连成字符串，第一个键值对前无连接符，如果传入第二个参数为键值对组成的json对象，会一并将json里的键值对连接起来。
    * @param (String|Object) form ——表单对象或form表单id
    * @param (Json Object) jsn ——{key1:"value1",key2:"value2"} 简单的键值对组成的json对象，要求键值为字符串。
    * @param (String) sign ——连接符号
    * @return (String)
    */
    formSerialize: function (form,jsn,sign) {
        form=FYG(form);
        sign=sign||'&';
        var str='';
        if(form&&form.tagName.toLowerCase()=='form') {
            var inps=form.getElementsByTagName('input');
            var sels=form.getElementsByTagName('select');
            var texs=form.getElementsByTagName('textarea');
            inps=FD.common.concat(inps,sels,texs);
            var i=inps.length;
            while(i-- >0) {
				//2011.05.09 Denis 增加判断
				if(inps[i].tagName.toLowerCase() === 'input' && 'checkboxradio'.lastIndexOf(inps[i].type) > -1 && !inps[i].checked) {
					continue;
				}
                var tmp=inps[i].name+'='+encodeURIComponent(inps[i].value);
                if(str=='') {
                    str+=tmp;
                } else {
                    str+=sign+tmp;
                }
            }
        }
        if(YAHOO.lang.isObject(jsn)) {
            for(var e in jsn) {
                var tmp=e+'='+encodeURIComponent(jsn[e]);
                if(str=='') {
                    str+=tmp;
                } else {
                    str+=sign+tmp;
                }
            }
        }
        return str;
    },

    /**
    * 将返回{success:[true|false]} 字符串转成json对象
    * @param (String) str ——json格式的字符串
    * @return (Json Object)
    */
    parse: function (str) {
        var jsn;
        try {
            jsn=YAHOO.lang.JSON.parse(str);
        } catch(x) {
            try {
                eval('jsn = '+str);
            } catch(e) {

            }
        }
        return jsn;
    },

    /**
    * 切换样式
    * @method toggleClass
    */
    toggleClass: function (o,class1,class2) {
        var o=$(o);
        if($D.hasClass(o,class1)) {
            $D.removeClass(o,class1);
            $D.addClass(o,class2);
        } else {
            $D.addClass(o,class1);
            $D.removeClass(o,class2);
        }
    },
    /**
    * A reusable empty function
    * @property
    * @type Function
    */
    emptyFn: function () { },
    _guid: 1,
    guid: function () {
        return this._guid++;
    },

    /*
    * integrate Get.script & Connect.asyncRequest!
    * @ param method    GET POST or JSONP
    * @ param url       request url
    * @ param configs   when AJAX define 'onSuccess' replace 'success', 'onFailure' & 'onTimeout' replace 'failure'
    *                   when JSONP define 'ns' 'strNS' 'fn' & 'key' if nesessary
    * @ param parameters    the parameters send to server, when AJAX this param can use String, otherwise Object
    */
    request: function (method,url,configs,parameters) {
        var emptyFn=this.emptyFn,
            hash=function (o) {
                var res=[],p;
                for(p in o) {
                    if(FDEV.lang.isArray(o[p])) {
                        for(var i=0,j=o[p].length;i<j;i++)
                            res.push(p+'='+o[p][i]+'');
                    } else
                        res.push(p+'='+o[p]+'');
                }
                return res.join('&');
            },op={
                cache: false,
                timeout: 10000
            };
        configs=configs||{};
        this.apply(op,configs);
        parameters=parameters||{};
        method=method.toUpperCase();
        if(method=='JSONP') {
            //set default configs
            if(configs.onCallback) {
                if(!op.ns) {
                    op.ns=window;
                    op.strNS=null;
                }
                if(!op.fn) op.fn='rnd';
                if(!op.cache) op.fn=op.fn+new Date().getTime()+this.guid();
                if(!op.key) op.key='callback';
            }
            op.attributes=op.attributes||{};
            if(!op.attributes.charset) op.attributes.charset=op.charset||'gbk';
            if(op.attributes.async!==false) op.attributes.async=true;
            //rewrite handler
            op.onSuccess=function (o) {
                if(configs.onSuccess) configs.onSuccess.call(this,o);
                //if FF or Opera, wrong http request will tirgger onTimerout, manually trigger onTimeout in other browsers
                //invalid in request Multiple resource
                if(configs.onCallback&&op.ns[op.fn]!=null&&op.ns[op.fn]!=emptyFn)
                    FDEV.lang.later(op.timeout,this,op.onTimeout,o);
            };
            op.onFailure=function (o) {
                if(configs.onFailure) configs.onFailure.call(this,o);
                if(configs.onCallback) op.ns[op.fn]=emptyFn;
            };
            op.onTimeout=function (o) {
                if(configs.onTimeout) configs.onTimeout.call(this,o);
                if(configs.onCallback) op.ns[op.fn]=emptyFn;
            };
            //define callback handler
            if(configs.onCallback) {
                op.ns[op.fn]=function (o) {
                    configs.onCallback.call(configs.scope||this,o);
                    op.ns[op.fn]=emptyFn;
                };
                parameters[op.key]=(op.strNS?op.strNS+'.':'')+op.fn;
            }
            var param=hash(parameters);
            if(param) {
                var parts=url.split('?');
                url=[url,param].join(parts.length>1?'&':'?');
            }
            return FDEV.util.Get.script(url,op);
        } else {
            if(configs.onSuccess) op.success=function (o) {
                configs.onSuccess.call(this,o);
            };
            op.failure=function (o) {
                if(o.status== -1) {
                    if(configs.onTimeout) configs.onTimeout.call(this,o);
                } else {
                    if(configs.onFailure) configs.onFailure.call(this,o);
                }
            };
            var param=(FDEV.lang.isObject(parameters)?this.formSerialize(null,parameters):parameters),data;
            if(param) {
                if(method=='GET') {
                    var parts=url.split('?');
                    url=[url,param].join(parts.length>1?'&':'?');
                } else
                    data=param;
            }
            return FDEV.util.Connect.asyncRequest(method,url,op,data);
        }
    }
};
/*__last_loginid__在ie6下不正确订正(开发在cookie中增加__cn_logon_id__字段)*/
(function(){
    //当前登录的ID
    FD.common.loginId = decodeURIComponent(FD.common.cookie('__cn_logon_id__', {raw:true}));
    //当前是否有登录用户
    FD.common.isLogin = (FD.common.loginId !== '' ? true : false);
    //上一次登录的ID
    FD.common.lastLoginId = decodeURIComponent(FD.common.cookie('__last_loginid__', {raw:true}));
})();

//设定FD的版本号
FD.version='3.2.2010-8-31';
//测试配置占位
FD.test = {};
