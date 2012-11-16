var fdTableSort={regExp_Currency:/^[Ј$ЂҐ¤]/,regExp_Number:/^(\-)?[0-9]+(\.[0-9]*)?$/,pos:-1,uniqueHash:1,thNode:null,tableCache:{},tableId:null,addEvent:function(e,t,n){if(e.attachEvent){e["e"+t+n]=n;e[t+n]=function(){e["e"+t+n](window.event)};e.attachEvent("on"+t,e[t+n])}else e.addEventListener(t,n,false)},stopEvent:function(e){e=e||window.event;if(e.stopPropagation){e.stopPropagation();e.preventDefault()}return false},init:function(){if(!document.getElementsByTagName)return;var e=document.getElementsByTagName("table");var t,n,r,i,s,o,u,a;s=document.createElement("a");s.href="#";s.onkeypress=fdTableSort.keyWrapper;o=document.createElement("span");for(var f=0,l;l=e[f];f++){n=fdTableSort.getTableHeaders(l);t=false;u=l.className.search(/sortable-onload-([0-9]+)/)!=-1?parseInt(l.className.match(/sortable-onload-([0-9]+)/)[1])-1:-1;showArrow=l.className.search(/no-arrow/)==-1;if(l.id&&l.id in fdTableSort.tableCache)delete fdTableSort.tableCache[l.id];for(var c=0,h;h=n[c];c++){if(h.className&&h.className.match("sortable")){h.className=h.className.replace(/forwardSort|reverseSort/,"");if(c==u)t=h;r=fdTableSort.getInnerText(h);while(h.firstChild)h.removeChild(h.firstChild);i=s.cloneNode(true);i.appendChild(document.createTextNode(r));i.title="Sort on "+r;s.onclick=h.onclick=fdTableSort.clickWrapper;h.appendChild(i);if(showArrow)h.appendChild(o.cloneNode(false));var p="fd-column-"+c;h.className=h.className.replace(/fd-identical|fd-not-identical/,"").replace(p,"")+" "+p}}if(t){fdTableSort.thNode=t;fdTableSort.initSort()}}},getTableHeaders:function(e){var t;var n=e.getElementsByTagName("thead");if(n&&n.length){n=n[0];t=n.getElementsByTagName("tr");t=t[t.length-1].getElementsByTagName("th")}else{t=e.getElementsByTagName("th")}return t},clickWrapper:function(e){e=e||window.event;if(fdTableSort.thNode==null){fdTableSort.thNode=this;fdTableSort.addSortActiveClass();setTimeout("fdTableSort.initSort()",5)}return fdTableSort.stopEvent(e)},keyWrapper:function(e){e=e||window.event;var t=e.keyCode!=null?e.keyCode:e.charCode;if(t==13){var n=this;while(n.tagName.toLowerCase()!="th")n=n.parentNode;fdTableSort.thNode=n;fdTableSort.addSortActiveClass();setTimeout("fdTableSort.initSort()",5);return fdTableSort.stopEvent(e)}return true},jsWrapper:function(e,t){var n=document.getElementById(e);fdTableSort.thNode=n.getElementsByTagName("th")[t];if(!fdTableSort.thNode||fdTableSort.thNode.className.search(/fd-column/)==-1)return false;fdTableSort.addSortActiveClass();fdTableSort.initSort()},addSortActiveClass:function(){if(fdTableSort.thNode==null)return;fdTableSort.addClass(fdTableSort.thNode,"sort-active");fdTableSort.addClass(document.getElementsByTagName("body")[0],"sort-active");if("sortInitiatedCallback"in window)sortInitiatedCallback()},removeSortActiveClass:function(){fdTableSort.removeClass(fdTableSort.thNode,"sort-active");fdTableSort.removeClass(document.getElementsByTagName("body")[0],"sort-active");if("sortCompleteCallback"in window)sortCompleteCallback()},addClass:function(e,t){if((new RegExp("(^|\\s)"+t+"(\\s|$)")).test(e.className))return;e.className+=(e.className?" ":"")+t},removeClass:function(e,t){e.className=!t?"":e.className.replace(new RegExp("(^|\\s*\\b[^-])"+t+"($|\\b(?=[^-]))","g"),"")},prepareTableData:function(e){if(!e.id)e.id="fd-table-"+fdTableSort.uniqueHash++;var t=[];var n=e.getElementsByTagName("tbody");n=n.length?n[0]:e;var r=n.getElementsByTagName("tr");var i=fdTableSort.getTableHeaders(e);var s=r.length;var o=i.length;var t=[];var u=new Array(o);var a=new Array(o);var f,l,c,h,p,d,v;var m=0;for(v=0;v<s;v++){f=r[v];if(f.getElementsByTagName("th").length>0||f.parentNode&&f.parentNode.tagName.toLowerCase()=="tfoot")continue;t[m]=[];p=f.getElementsByTagName("td");for(d=0;d<o;d++){c=i[d];if(c.className.search(/sortable/)==-1)continue;l=p[d];h=fdTableSort.getInnerText(l)+" ";h=h.replace(/^\s+/,"").replace(/\s+$/,"");if(c.className.search(/sortable-date/)!=-1){h=fdTableSort.dateFormat(h)}else if(c.className.search(/sortable-numeric|sortable-currency/)!=-1){h=parseFloat(h.replace(/[^0-9\.\-]/g,""));if(isNaN(h))h=""}else if(c.className.search(/sortable-text/)!=-1){h=h.toLowerCase()}else if(c.className.search(/sortable-([a-zA-Z\_]+)/)!=-1){if(c.className.match(/sortable-([a-zA-Z\_]+)/)[1]+"PrepareData"in window){h=window[c.className.match(/sortable-([a-zA-Z\_]+)/)[1]+"PrepareData"](l,h)}}else{if(h!=""){fdTableSort.removeClass(c,"sortable");if(fdTableSort.dateFormat(h)!=0){fdTableSort.addClass(c,"sortable-date");h=fdTableSort.dateFormat(h)}else if(h.search(fdTableSort.regExp_Number)!=-1||h.search(fdTableSort.regExp_Currency)!=-1){fdTableSort.addClass(c,"sortable-numeric");h=parseFloat(h.replace(/[^0-9\.\-]/g,""));if(isNaN(h))h=""}else{fdTableSort.addClass(c,"sortable-text");h=h.toLowerCase()}}}if(m>0&&a[d]!=h){u[d]=false}a[d]=h;t[m][d]=h}t[m][o]=f;m++}var g=e.className.search(/colstyle-([\S]+)/)!=-1?e.className.match(/colstyle-([\S]+)/)[1]:false;var y=e.className.search(/rowstyle-([\S]+)/)!=-1?e.className.match(/rowstyle-([\S]+)/)[1]:false;fdTableSort.tableCache[e.id]={data:t,pos:-1,identical:u,colStyle:g,rowStyle:y,noArrow:e.className.search(/no-arrow/)!=-1}},initSort:function(){var e;var t=fdTableSort.thNode;var n=fdTableSort.thNode;while(n.tagName.toLowerCase()!="table"&&n.parentNode){n=n.parentNode}if(!n.id||!(n.id in fdTableSort.tableCache)){fdTableSort.prepareTableData(n)}fdTableSort.tableId=n.id;fdTableSort.pos=t.className.match(/fd-column-([0-9]+)/)[1];var r=fdTableSort.tableCache[n.id];var i=r.pos;var s=r.data;var o=r.colStyle;var u=r.rowStyle;var a=s.length;var f=s[0].length-1;var l=r.identical[fdTableSort.pos]==false?false:true;var c=r.noArrow;if(i!=fdTableSort.pos&&i!=-1){var h=t.parentNode.getElementsByTagName("th")[i];fdTableSort.removeClass(h,"forwardSort");fdTableSort.removeClass(h,"reverseSort");if(!c){e=h.getElementsByTagName("span")[0];while(e.firstChild)e.removeChild(e.firstChild)}}var p="forwardSort";if(i==fdTableSort.pos&&!l){s.reverse();p=t.className.search(/reverseSort/)!=-1?"forwardSort":"reverseSort"}else{fdTableSort.tableCache[n.id].pos=fdTableSort.pos;if(!l){if(t.className.match(/sortable-numeric|sortable-currency|sortable-date/)){s.sort(fdTableSort.sortNumeric)}else if(t.className.match("sortable-text")){s.sort(fdTableSort.sortText)}else if(t.className.search(/sortable-([a-zA-Z\_]+)/)!=-1&&t.className.match(/sortable-([a-zA-Z\_]+)/)[1]in window){s.sort(window[t.className.match(/sortable-([a-zA-Z\_]+)/)[1]])}}}fdTableSort.removeClass(t,"forwardSort");fdTableSort.removeClass(t,"reverseSort");fdTableSort.addClass(t,p);if(!c){var d=t.className.search(/forwardSort/)!=-1?" ↓":" ↑";e=t.getElementsByTagName("span")[0];while(e.firstChild)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(d))}if(!u&&!o&&l){fdTableSort.removeSortActiveClass();fdTableSort.thNode=null;return}var v=n.getElementsByTagName("tbody");v=v.length?v[0]:n;var m,g;for(var y=0;y<a;y++){g=s[y][f];if(o){if(i!=-1){fdTableSort.removeClass(g.getElementsByTagName("td")[i],o)}fdTableSort.addClass(g.getElementsByTagName("td")[fdTableSort.pos],o)}if(!l){if(u){if(y%2)fdTableSort.addClass(g,u);else fdTableSort.removeClass(g,u)}v.appendChild(g)}}fdTableSort.removeSortActiveClass();fdTableSort.thNode=null},getInnerText:function(e){if(typeof e=="string"||typeof e=="undefined")return e;if(e.innerText)return e.innerText;var t="",n;for(n=e.firstChild;n;n=n.nextSibling){if(n.nodeType==3)t+=n.nodeValue;else if(n.nodeType==1)t+=fdTableSort.getInnerText(n)}return t},dateFormat:function(e){var t,n,r,i;if(e.match(/^(0[1-9]|1[012])([- \/.])(0[1-9]|[12][0-9]|3[01])([- \/.])(\d\d?\d\d)$/)){i=e.match(/^(0[1-9]|1[012])([- \/.])(0[1-9]|[12][0-9]|3[01])([- \/.])(\d\d?\d\d)$/);t=i[5];n=i[1];r=i[3]}else if(e.match(/^(0[1-9]|[12][0-9]|3[01])([- \/.])(0[1-9]|1[012])([- \/.])(\d\d?\d\d)$/)){i=e.match(/^(0[1-9]|[12][0-9]|3[01])([- \/.])(0[1-9]|1[012])([- \/.])(\d\d?\d\d)$/);t=i[5];n=i[3];r=i[1]}else if(e.match(/^(\d\d?\d\d)([- \/.])(0[1-9]|1[012])([- \/.])(0[1-9]|[12][0-9]|3[01])$/)){i=e.match(/^(\d\d?\d\d)([- \/.])(0[1-9]|1[012])([- \/.])(0[1-9]|[12][0-9]|3[01])$/);t=i[1];n=i[3];r=i[5]}else return 0;if(n.length==1)n="0"+n;if(r.length==1)r="0"+r;if(t.length==1)t="0"+t;if(t.length!=4)t=parseInt(t)<50?"20"+t:"19"+t;return t+n+r},sortDate:function(e,t){var n=e[fdTableSort.pos];var r=t[fdTableSort.pos];return n-r},sortNumeric:function(e,t){var n=e[fdTableSort.pos];var r=t[fdTableSort.pos];if(n===""&&!isNaN(r))return-1;else if(r===""&&!isNaN(n))return 1;else if(n==r)return 0;return n-r},sortText:function(e,t){var n=e[fdTableSort.pos];var r=t[fdTableSort.pos];if(n==r)return 0;if(n<r)return-1;return 1}};fdTableSort.addEvent(window,"load",fdTableSort.init)