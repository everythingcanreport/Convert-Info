function getCookie(e){for(var o=e+"=",n=document.cookie.split(";"),t=0;t<n.length;t++){for(var i=n[t];" "==i.charAt(0);)i=i.substring(1);if(0==i.indexOf(o))return i.substring(o.length,i.length)}return""}function writeStories(){require(["menu/menu"],function(e){e.writeStories()})}function manageStories(){require(["menu/menu"],function(e){e.manageStories()})}function onClickLoginFacebook(){navigator.userAgent.match("CriOS")?window.open("https://www.facebook.com/dialog/oauth?client_id=1032633966817570&redirect_uri="+document.location.href+"&scope=email,public_profile&response_type=none","",!0):FB.login(null,{scope:"email,public_profile"})}function renderData(e){e&&e.rows&&(e.rows.forEach(function(e,o){var n=new Date(e.CreatedDate),t=n.getDate()<=9?"0"+n.getDate():n.getDate(),i=n.getMonth()+1<=9?"0"+(n.getMonth()+1):n.getMonth()+1,a=n.getFullYear(),c=t+"/"+i+"/"+a,r='<a class="ui pink font-ribbon ribbon large label">Ngôn tình</a>',s='<span title="Thời gian sáng tác" class="float-right media-time font-ribbon home-date">'+c+"</span>",l=e&&e.FileUploads&&e.FileUploads[0]?e.FileUploads[0].FileLocation:null,u=l?'<div class="ui small image"><a href="/'+e.SpeakingUrl+'" class="ui image"title="'+e.Title+'" alt="truyện ngắn ailee phan"><img alt="truyện ngắn ailee phan" class="height-image-home" src="/download-background/'+l+'"/></a></div>':"",d=e&&e.Title&&e.Title&&0!==e.Title.length?'<h1 class="ui pink header"><div class="content"><span class="font-header capitalize"><a href="/'+e.SpeakingUrl+'" title="'+e.Title+'">'+e.Title+'</a></span><span class="sub header font-author" title="Tác giả">'+(e&&e.AuthorName?e.AuthorName:"")+"</span></div></h1>":"",g='<div class="description"><p class="font-content">'+e.ShortContent+'</p><a href="/'+e.SpeakingUrl+'"class = "ui mini pink button font-button" title="'+e.Title+'">Chi tiết</a></div>';$(".home-main").append('<div class="ui segment">'+r+s+'<div class="ui very relaxed items"><div class="item">'+u+'<div class="content">'+d+g+"</div></div></div></div>")}),appending=!1,rows+=e.rows.length)}$(".connected").dropdown();var cookieAvatar=getCookie("cookieAvatar"),cookieProfile=getCookie("cookieProfile");cookieAvatar&&cookieProfile&&(cookieAvatar=JSON.parse(cookieAvatar),cookieProfile=JSON.parse(cookieProfile),cookieProfile.name&&$(".connected-name").text(cookieProfile.name),$(".connected-avatar").attr("src",cookieAvatar.url),$(".loader").removeClass("active"),$(".connected").removeClass("hide"),$(".unknown").addClass("hide"));var cookieMenu=getCookie("cookieMenu");if(cookieMenu){cookieMenu=JSON.parse(cookieMenu),$(".connected-menu").empty();var menus=null;menus=cookieMenu.isAdmin?[{Name:"Thêm mới truyện",icon:"write",func:"writeStories();"},{Name:"Quản lí truyện",icon:"book",func:"manageStories();"},{Name:"Thoát",icon:"key",func:"FB.logout();"}]:[{Name:"Thoát",icon:"key",func:"FB.logout()"}],menus.forEach(function(e,o){$(".connected-menu").append('<a class="item" onClick="'+e.func+'"><i class="'+e.icon+' icon"></i>'+e.Name+"</a>")}),$(".loader").removeClass("active"),$(".connected").removeClass("hide"),$(".unknown").addClass("hide")}define(function(e){var o=e("fbPlugin/init"),n=e("fbPlugin/login_event"),t=e("fbPlugin/logout_event"),i=e("fbPlugin/status_change");window.fbAsyncInit=function(){o(),FB.getLoginStatus(function(e){"object"==typeof e&&"connected"===e.status||($(".menu-loader").removeClass("active"),$(".connected").addClass("hide"),$(".unknown").removeClass("hide"))}),FB.Event.subscribe("auth.login",n),FB.Event.subscribe("auth.logout",t),FB.Event.subscribe("auth.statusChange",i)},function(e,o,n){var t,i=e.getElementsByTagName(o)[0];e.getElementById(n)||(t=e.createElement(o),t.id=n,t.src="//connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v2.6&appId=1032633966817570",i.parentNode.insertBefore(t,i))}(document,"script","facebook-jssdk");var a=new Date,c=$(".home-date-hidden").val();c&&(a=new Date(c));var r=a.getDate()<=9?"0"+a.getDate():a.getDate(),s=a.getMonth()+1<=9?"0"+(a.getMonth()+1):a.getMonth()+1,l=a.getFullYear(),u=r+"/"+s+"/"+l;$(".home-date").text(""),$(".home-date").append(u)});var rows=5,count=$(".home-count").val(),appending=!1,oldPosition=0;window.scrollTo(0,0),$(document).scroll(function(){$(window).scrollTop()+$(window).height()+400>=$(document).height()&&$(window).scrollTop()+$(window).height()>=oldPosition&&count>rows&&!appending&&(appending=!0,require(["common/listStories"],function(e){var o={Limit:5,Offset:rows,Filter:[{Stories:{Show:"Y"}}]};$(".home-loader").addClass("active"),e(o).then(function(e){$(".home-loader").removeClass("active"),renderData(e)},function(e){$(".home-loader").removeClass("active")})})),oldPosition=$(window).scrollTop()+$(window).height()});