/* 
 * Options file
 */

"use strict";

var options = {
    controlsSection: ['getUpSection', 'getDownSection', 'getBgSection', 'getMainSettingsSection', 'getCopy', 'getDel']
    , colorGrid: [
        { name: 'bg-1', title: 'Background', styleProperty: 'background-color:'
            , domIdentif: '.bg-1', darkColor: '#353B4A', lightColor: '#ffffff', domIdentifPreloader: ' #preloader'}
        , { name: 'font-color', title: 'Font color', styleProperty: 'color:'
            , domIdentif: '', darkColor: '#ffffff', lightColor: '#444444'}
        , { name: 'highliht-text', title: 'Highlight text', styleProperty: 'color:'
            , domIdentif: 'mark', darkColor: '#000000', lightColor: '#000000'}
        , { name: 'highliht-background', title: 'Highlight background', styleProperty: 'background-color:'
            , domIdentif: 'mark', darkColor: '#ffff60', lightColor: '#ffff60'}
        , { name: 'h1', title: 'H1 color', styleProperty: 'color:'
            , domIdentif: 'h1', darkColor: '#ffffff', lightColor: '#222222' }
        , { name: 'h2', title: 'H2 color', styleProperty: 'color:'
            , domIdentif: 'h2', darkColor: '#ffffff', lightColor: '#444444' }
        , { name: 'h3', title: 'H3 color', styleProperty: 'color:'
            , domIdentif: 'h3', darkColor: '#ffffff', lightColor: '#444444' }
        , { name: 'h4', title: 'H4 color', styleProperty: 'color:'
            , domIdentif: 'h4', darkColor: '#ffffff', lightColor: '#555555' }
        , { name: 'separator', title: 'Separator', styleProperty: 'border-color:'
            , domIdentif: ['.sep-b:after', '.sep-full-b:after', ' hr', ' .border-box'], darkColor: '#777777', lightColor: '#eeeeee' }
        , { name: 'link-color', title: 'Link', styleProperty: 'color:'
            , domIdentif: ['a:not(.btn):not(.gallery-box):not(.goodshare)', 'a.btn-link'], darkColor: '#ffffff', lightColor: '#222'}
        , { name: 'link-hover-color', title: 'Link hover', styleProperty: 'color:'
            , domIdentif: 'a:not(.btn):not(.gallery-box):not(.goodshare):hover', darkColor: '#f4f4f4', lightColor: '#00a7ff'}
        , { name: 'btn-primary-color', title: 'Primary button', styleProperty: 'background-color:'
            , domIdentif: '.btn-primary', darkColor: '#07bcf7', lightColor: '#07bcf7'}
        , { name: 'btn-primary-hover-color', title: 'Primary button hover', styleProperty: 'background-color:'
            , domIdentif: '.btn-primary:hover', darkColor: '#039dd0', lightColor: '#039dd0'}
        , { name: 'btn-def-color', title: 'Default button', styleProperty: 'color:'
            , domIdentif: '.btn-default', darkColor: '#ffffff', lightColor: '#555555'}
        , { name: 'btn-def-hover-color', title: 'Default button hover', styleProperty: 'color:'
            , domIdentif: '.btn-default:hover', darkColor: '#eeeeee', lightColor: '#222222'}
        , { name: 'icons', title: 'Icons color', styleProperty: 'color:'
            , domIdentif: 'i.icon-color', darkColor: '#FFFFFF', lightColor: '#aaaaaa'}
        , { name: 'carousel-nav', title: 'Carousel navigation', styleProperty: 'border-color:'
            , domIdentif: ['.owl-next', '.owl-prev', '.owl-dot'], darkColor: '#FFFFFF', lightColor: '#444444'}
        , { name: 'gallery-item-bg', title: 'Gallery item background', styleProperty: 'background:'
            , domIdentif: '.gallery-box', darkColor: '#353B4A', lightColor: '#FFFFFF'}
        , { name: 'gallery-item-color', title: 'Gallery item font color', styleProperty: 'color:'
            , domIdentif: '.gallery-box', darkColor: '#FFFFFF', lightColor: '#222222'}
        , { name: 'preloader-color', title: 'Preloader color', styleProperty: 'border-color:'
            , domIdentif: '#preloader div', darkColor: '#f3f3f3!important', lightColor: '#888888!important'}
    ]
    , typographyGrid: [
        { domIdentif: ['/*body*/'], fontSize: '15px', styleprop: {fontStyle: 'inherit', fontWeight: '400', textTransform: 'inherit', fontFamily: 'Open Sans'}}
        , { domIdentif: 'h1', fontSize: '72px', styleprop: {fontStyle: 'inherit', fontWeight: '100', textTransform: 'inherit', fontFamily: 'Roboto'}}
        , { domIdentif: 'h2', fontSize: '36px', styleprop: {fontStyle: 'inherit', fontWeight: '200', textTransform: 'inherit', fontFamily: 'Nunito Sans'}}
        , { domIdentif: 'h3', fontSize: '26px', styleprop: {fontStyle: 'inherit', fontWeight: '300', textTransform: 'inherit', fontFamily: 'Nunito Sans'}}
        , { domIdentif: 'h4', fontSize: '20px', styleprop: {fontStyle: 'inherit', fontWeight: '300', textTransform: 'inherit', fontFamily: 'Nunito Sans'}}
    ]
    , editElementsList: [
        {
            group: 'button'
            , mode: 'edit-elements'
            , btnContlType: 'wrap'
            , domIdentif: ['.btn:not(button)']
            , positionControl: 'outside-top'
            , controlsElement: ['getButtonSettings', 'getStaticLink', 'getElementSettings', 'getCopyElement', 'getDelElement']
        }
        , {
            group: 'link'
            , mode: 'edit-elements'
            , btnContlType: 'wrap'
            , domIdentif: ['a.spr-option-link']
            , positionControl: 'outside-top'
            , controlsElement: ['getStaticLink', 'getElementSettings']
        }
        , {
            group: 'link-del'
            , mode: 'edit-elements'
            , btnContlType: 'wrap'
            , domIdentif: ['.spr-option-link-del', '.content-icon']
            , positionControl: 'outside-top'
            , controlsElement: ['getLink', 'getElementSettings', 'getDelElement']
        }
        , {
            group: 'form-button'
            , mode: 'edit-elements'
            , btnContlType: 'wrap'
            , domIdentif: ['.contact_form [type=submit]', '.subscribe_form [type=submit]']
            , positionControl: 'outside-top'
            , controlsElement: ['getButtonSettings']
        }
        , {
            group: 'images'
            , mode: 'edit-elements'
            , domIdentif: ['img:not(.spr-option-imgsettings):not(.spr-option-img-nosettings):not(.content-img)']
            , positionControl: 'inside-top'
            , controlsElement: ['getImageSettings', 'getLink', 'getElementSettings', 'getCopyElement', 'getDelElement']
        }
        , {
            group: 'imagesInLink'
            , mode: 'edit-elements'
            , domIdentif: ['.spr-option-link-img']
            , positionControl: 'inside-top ctrl-top-left'
            , controlsElement: ['getImageSettings', 'getStaticLink', 'getElementSettings', 'getCopyElement', 'getDelElement']
        }
        , {
            group: 'content-images'
            , mode: 'edit-elements'
            , domIdentif: ['img.spr-option-imgsettings', 'img.content-img']
            , positionControl: 'inside-top'
            , controlsElement: ['getImageSettings', 'getLink', 'getElementSettings', 'getDelElement']
        }
        , {
            group: 'iframe'
            , mode: 'edit-elements'
            , domIdentif: ['.video-iframe']
            , positionControl: 'outside-top'
            , controlsElement: ['getVideoLink', 'getElementSettings', 'getCopyElement', 'getDelElement']
        }
        , {
            group: 'contactform'
            , mode: 'edit-elements'
            , editType: '-form'
            , domIdentif: ['form.contact_form']
            , positionControl: 'outside-top'
            , controlsElement: ['getFormPSuccess', 'getFormPError', 'getFormSettings', 'getElementSettings', 'getCopyElement', 'getDelElement']
        }
        , {
            group: 'subscribeform'
            , mode: 'edit-elements'
            , editType: '-form'
            , domIdentif: ['form.subscribe_form']
            , positionControl: 'outside-top'
            , controlsElement: ['getFormPSuccess', 'getFormPError', 'getSubscribeFormSettings', 'getElementSettings', 'getCopyElement', 'getDelElement']
        }
        , {
            group: 'icons'
            , mode: 'edit-typography'
            , btnContlType: 'wrap'
            , editType: '-icons'
            , domIdentif: ['i', 'a[class*=icon-]']
            , positionControl: 'outside-top'
            , controlsElement: ['getIconsCheck']
        }
        , {
            group: 'text'
            , mode: 'edit-elements'
            , domIdentif: ['p', '.text-list li', '.text-icon-list li']
            , positionControl: 'outside-top'
            , controlsElement: ['getCopyElement', 'getElementSettings', 'getDelElement']
        }
        , {
            group: 'h'
            , mode: 'edit-elements'
            , domIdentif: ['h1', 'h2', 'h3', 'h4:not(.spr-option-no)']
            , positionControl: 'outside-top'
            , controlsElement: ['getElementH', 'getElementSettings', 'getCopyElement', 'getDelElement']
        }
        , {
            group: 'element-copy-del'
            , mode: 'edit-elements'
            , domIdentif: ['.spr-option-copy-del', '.content-box', '.team-box', '.price-box', '.icons-row i', '.nav > li', '.nav li ul li']
            , positionControl: 'outside-top'
            , controlsElement: ['getCopyElement', 'getElementSettings', 'getDelElement']
        }
        , {
            group: 'element-copy-del-item'
            , mode: 'edit-elements'
            , domIdentif: ['.spr-gallery .item:not(.spr-option-link-img)']
            , positionControl: 'inside-top'
            , controlsElement: ['getCopyElement', 'getElementSettings', 'getDelElement']
        }
        , {
            group: 'element-del'
            , mode: 'edit-elements'
            , domIdentif: ['.share-list li', '.spr-option-del']
            , positionControl: 'outside-top'
            , controlsElement: ['getDelElement']
        }
        , {
            group: 'linkItem'
            , mode: 'edit-elements'
            , domIdentif: ['.social-list li']
            , positionControl: 'outside-top'
            , controlsElement: ['getLink', 'getCopyElement', 'getDelElement']
        }
        , {
            group: 'span'
            , mode: 'edit-typography'
            , editType: '-typography'
            , domIdentif: ['span.spr-option-textedit', '.fullwidth-grid .caption', '.text-list li']
            , positionControl: 'outside-top'
            , controlsElement: ['getTextBold', 'getTextItalic', 'getTextUpper', 'getTextUnderline', 'getTextStrikethrough', 'getTextMarker', 'getTextLink']
        }
        , {
            group: 'btn-span'
            , mode: 'edit-typography'
            , editType: '-typography'
            , domIdentif: ['span.spr-option-textedit-link', '.gallery-box span.caption', '.gallery-box span.desc']
            , positionControl: 'outside-top'
            , controlsElement: ['getTextBold', 'getTextItalic', 'getTextUpper', 'getTextUnderline', 'getTextStrikethrough', 'getTextMarker']
        }
        , {
            group: 'text'
            , mode: 'edit-typography'
            , editType: '-typography'
            , domIdentif: ['p', 'small', 'h1', 'h2', 'h3', 'h4']
            , positionControl: 'outside-top'
            , controlsElement: ['getTextBold', 'getTextItalic', 'getTextUpper', 'getTextUnderline', 'getTextStrikethrough', 'getTextMarker', 'getTextLink', 'getTextAlignLeft', 'getTextAlignCenter', 'getTextAlignRight']
        }
        , {
            group: 'divbackground'
            , mode: 'edit-elements'
            , domIdentif: ['.half-container-left:not(.g-map)', '.half-container-right:not(.g-map)']
            , positionControl: 'outside-top'
            , controlsElement: ['getBgDiv']
        }
        , {
            group: 'modalbackground'
            , mode: 'edit-sections'
            , domIdentif: ['.modal-content']
            , positionControl: 'flex-center popup-bg'
            , controlsElement: ['getBgPopup']
        }
        , {
            group: 'map'
            , mode: 'edit-elements'
            , domIdentif: ['.g-map']
            , positionControl: 'outside-top'
            , controlsElement: ['getGMapSettings', 'getCopyElement', 'getDelElement']
        }
    ]
    , popupContent: {
        success: '<div class="modal-dialog">'
        + '<div class="modal-content text-center">'
        + '<div class="modal-header">'
        + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
        + '</div>'
        + '<div class="modal-body">'
        + '<i class="content-icon icon icon-checkmark-circle icon-size-xl icon-color mb-50"></i>'
        + '<h3 class="mb-25 mailchimp-data-message">Your message was sent successfully!</h3>'
        + '<p class="mb-50">In our work we try to use only the most modern, convenient and interesting solutions. We want the template you downloaded look unique and new for such a long time as it is possible. Our elements have no excessive gloss, but they are always actual.</p>'
        + '<a href="#" class="btn btn-default">Download</a>'
        + '</div>'
        + '<div class="bg bg-type-cover"></div>'
        + '</div>'
        + '</div>'
        , error: '<div class="modal-dialog">'
        + '<div class="modal-content text-center">'
        + '<div class="modal-header">'
        + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
        + '</div>'
        + '<div class="modal-body">'
        + '<i class="content-icon icon icon-warning icon-size-xl icon-color mb-50"></i>'
        + '<h3 class="mb-25">Oops! Something went wrong!</h3>'
        + '<p class="mb-50">In our work we try to use only the most modern, convenient and interesting solutions. We want the template you downloaded look unique and new for such a long time as it is possible. Our elements have no excessive gloss, but they are always actual.</p>'
        + '<a href="#" class="btn btn-danger">Ask support</a>'
        + '</div>'
        + '<div class="bg bg-type-cover"></div>'
        + '</div>'
        + '</div>'
        , successStyle: '\n\tbackground-image: url(images/gallery/bg-modal-success.jpg);\n\topacity:0.25;'
        , errorStyle: '\n\tbackground-image: url(images/gallery/bg-modal-error.jpg);\n\topacity:0.1;'
    }
    , gmapScript: '\nvar lightOpts = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];'
    + '\nvar darkOpts = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];'
    + '\nvar dreamOpts = [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}];'
    + '\nvar appleOpts = [{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f1df"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#d0e3b4"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#bde6ab"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe15f"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efd151"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#cfb2db"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a2daf2"}]}];'
    + '\nvar monoOpts = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#4f595d"},{"visibility":"on"}]}];'
    + '\nvar cleanOpts = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#6195a0"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#e6f3d6"},{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#f4d2c5"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#f4f4f4"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#787878"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#eaf6f8"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#eaf6f8"}]}];'
    + '\nvar nightOpts = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}];'
    + '\nfunction initialize() {'
    + '\n\tvar map;'
    + '\n\tvar MY_MAPTYPE_ID = \'custom_style\';'
    + '\n\tvar mapOptions = {'
    + '\n\t    zoom: 14,'
    + '\n\t    scrollwheel: false,'
    + '\n\t    //draggable: false,'
    + '\n\t    panControl: false,'
    + '\n\t    mapTypeControl: false,'
    + '\n\t    streetViewControl: false,'
    + '\n\t    center: new google.maps.LatLng(40.748659, -73.985705),'
    + '\n\t    mapTypeControlOptions: {'
    + '\n\t        mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]'
    + '\n\t    },'
    + '\n\t    mapTypeId: MY_MAPTYPE_ID'
    + '\n\t};'
    + '\n\tmap = new google.maps.Map(document.getElementById(\'map\'), mapOptions);'
    + '\n\tvar contentString = \'<div id="content"> Address <br> Phone <br> Work Hours</div>\';'
    + '\n\tvar infowindow = new google.maps.InfoWindow({'
    + '\n\t    content: contentString'
    + '\n\t});'
    + '\n\tvar myLatLng = new google.maps.LatLng(40.748659, -73.985705);'
    + '\n\tvar marker = new google.maps.Marker({'
    + '\n\t    position: myLatLng,'
    + '\n\t    map: map,'
    + '\n\t    animation: google.maps.Animation.DROP'
    + '\n\t});'
    + '\n\tmarker.addListener(\'click\', function () {'
    + '\n\t    infowindow.open(map, marker);'
    + '\n\t});'
    + '\n\tvar styledMapOptions = {'
    + '\n\t    name: \'Custom Style\''
    + '\n\t};'
    + '\n\tvar customMapType = new google.maps.StyledMapType(dreamOpts, styledMapOptions);'
    + '\n\tmap.mapTypes.set(MY_MAPTYPE_ID, customMapType);'
    + '\n}'
    + '\ninitialize();'
    , baseFilesForProject: {
        css: [
            'bootstrap.css'
            , 'icons.css'
            , 'style.css'
        ]
        , js: [
            'jquery-2.1.4.min.js'
            , 'bootstrap.min.js'
        ]
        , fonts: [
            'iconfont.eot'
            , 'iconfont.svg'
            , 'iconfont.ttf'
            , 'iconfont.woff'
        ]
        , plugins: [
            'https://maps.googleapis.com/maps/api/js?key=AIzaSyCByts0vn5uAYat3aXEeK0yWL7txqfSMX8'
            , 'https://cdn.jsdelivr.net/jquery.goodshare.js/3.2.8/goodshare.min.js'
        ]
    }
};