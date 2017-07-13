/*
 * @autor: MultiFour
 * @version: 1.0.0
 */

"use strict";

var Modal = function(id, type, targetObject) {
    var _this = this;


    var footer = document.getElementById('modal-container');
    var modal = this._modal(id, type);
    this._selfDOM = modal;
    footer.appendChild(modal);

    this._targetObject = targetObject;

    this._title.innerHTML = '';
    this._body.innerHTML = '';
    this._footer.innerHTML = '';

    this['_getModal' + type](_this);

    $(modal).on('hidden.bs.modal', function() {
        modal.parentElement.removeChild(modal);
    });

    return modal;
};

Modal.prototype = {
    _selfDOM: null

    , _header: null
    , _title: null
    , _body: null
    , _footer: null

    , _elements: null
    , _elementsGallery: null

    , _countDropDown: 0

    , _targetObject: null

    /**
     * Creatig modal dialog
     * @param id
     * @returns {Element}
     * @private
     */
    , _modal: function(id, type) {
        var classModal = type === 'ButtonSettings' ? builder.defaultStyleType + '-modal' : '';
        var modal = document.createElement('div');
        modal.className = 'modal fade flex-center ' + classModal;
        modal.id = id;
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('role', 'dialog');

        var content = '<div class="modal-dialog" role="document">'
            + '<div class="modal-content">'
            + '<div class="modal-header">'
            + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><i class="icon-cross"></i></button>'
            + '<div class="modal-title">Modal title</div>'
            + '</div>'
            + '<div class="modal-body clearfix">'
            + '</div>'
            + '<div class="modal-footer">'
            + '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>'
            + '</div>'
            + '</div>'
            + '<div class="modal-preloader">'
            + '<div class="wrapper">'
            + '<div class="timer"><div class="arrow_sec"></div><div class="arrow_min"></div></div>'
            + '</div>'
            + '</div>'
            + '</div>';

        modal.innerHTML = content;

        this._header = modal.querySelector('.modal-header');
        this._title = this._header.querySelector('.modal-title');
        this._body = modal.querySelector('.modal-body');
        this._footer = modal.querySelector('.modal-footer');

        return modal;
    }
    /**
     * Constructor for elements of modal
     * @param arrElements
     * @param classSide
     * @private
     */
    , _constructModalBody: function(arrElements, classSide) {
        var elements = this._getElements(arrElements);

        if (this._elements) {
            for (var attrname in elements) {
                this._elements[attrname] = elements[attrname];
            }
        } else {
            this._elements = elements;
        }

        var side = document.createElement('div');
        side.className = classSide;

        for (var element in elements) {
            side.appendChild(elements[element]);
        }

        this._body.appendChild(side);
    }
    /**
     * Create elements for modal from arrElements
     * @param arrElements {Array} function names
     * @returns {Array} elements for modals
     * @private
     */
    , _getElements: function(arrElements) {
        var _this = this;
        var arr = {};

        arrElements.forEach(function(element) {
            if (typeof element === 'string') {
                arr[element] = _this['_' + element]();
            } else {
                arr[element.name] = _this['_' + element.func](element.args);
            }
        });

        return arr;
    }
    /**
     * -------------------------------------------- Part - create modal elements ------------------------------------
     */
    /**
     * 
     * @param {type} args
     * @returns {HTMLElement}
     * @private
     */
    , _choiceElement: function(args) {
        var _this = this;
        var cElement = document.createElement('div');
        cElement.className = 'item clearfix';
        if (args.buttons && Array.isArray(args.buttons)) {
            args.buttons.forEach(function(element){
                var item = document.createElement('div');
                item.className = element.className;
                item.innerHTML = '<i class="ok supra icon-check2"></i>'
                    + '<span class="bg-white-circle"></span>'
                    + element.html
                    + '<div class="wrap"></div>';

                cElement.appendChild(item);

                item.addEventListener('click', _this._choosen);
                if (args.callback) item.addEventListener('click', args.callback);
            });
        } else {
            cElement.innerHTML = '<div class="' + args.className + '">'
                + '<i class="ok supra icon-check2"></i>'
                + '<span class="bg-white-circle"></span>'
                + args.html
                + '<div class="wrap"></div>'
                + '</div>';
            cElement.children[0].addEventListener('click', _this._choosen);
        }

        return cElement;
    }
    /**
     * 
     * @private
     */
    , _choosen: function() {
        var choosen = this.parentElement.querySelector('.choosen');
        if (choosen) {
            choosen.classList.remove('choosen');
        }
        this.classList.add('choosen');
    }
    /**
     * 
     * @param args {Obj}
     * @returns {HTMLElement}
     * @private
     */
    , _inputImage: function(args) {
        var _this = this;
        args.elClass = args.elClass || '';
        var item = document.createElement('div');
        item.className = 'item clearfix nofloat nopadding ' + args.elClass;
        item.innerHTML = '<label>' + args.title + '</label>'
            + '<input type="text" class="choice-images" />'
            + '<i class="supra icon-folder-picture"></i>';

        item.querySelector('i').addEventListener('click', function() {
            var modGallery = new Modal('supra-modal-gallery', 'Gallery', {
                parentModal: _this
                , targetElement: item
                , type: args.type || 'normal'
            });
        });

        return item;
    }
    /**
     *
     * @param args
     * @returns {Element}
     * @private
     */
    , _inputImageForVideo:  function(args) {
        var _this = this;
        args.elClass = args.elClass || '';
        var item = document.createElement('div');
        item.className = 'item clearfix nofloat nopadding ' + args.elClass;
        item.innerHTML = '<label>' + args.title + '</label>'
            + '<input type="text" class="choice-images" />'
            + '<i class="supra icon-folder-picture"></i>';

        item.querySelector('i').addEventListener('click', function() {
            var modGallery = new Modal('supra-modal-gallery', 'GalleryVideo', {
                parentModal: _this
                , targetElement: item
                , type: args.type
            });
        });

        return item;
    }
    /**
     *
     * @param args {Obj}
     * @returns {HTMLElement}
     * @private
     */
    , _inputVideo: function(args) {
        var _this = this;
        args.elClass = args.elClass || '';
        var item = document.createElement('div');
        item.className = 'item clearfix nofloat nopadding ' + args.elClass;
        item.innerHTML = '<label>' + args.title + '</label>'
            + '<input type="text" class="choice-videos" data-type="' + args.type + '"/>'
            + '<i class="supra icon-folder-film"></i>';

        item.querySelector('i').addEventListener('click', function() {
            var modGallery = new Modal('supra-modal-gallery', 'GalleryVideo', {
                parentModal: _this
                , targetElement: item
                , type: args.type
            });
        });

        return item;
    }
    /**
     * 
     * @returns {HTMLElement}
     * @private
     */
    , _separator: function() {
        var separator = document.createElement('div');
        separator.className = 'separator-or';
        separator.innerHTML = '<hr>'
            + '<div class="wrap flex-center">'
            + '<span class="flex-center">OR</span>'
            + '</div>';
        return separator;
    }
    /**
     * 
     * @param {type} dropDown
     * @private
     */
    , _addEventListToDropdown: function(dropDown) {
        var options = dropDown.querySelectorAll('li a');
        var button = dropDown.querySelector('.dropdown button');
        Array.prototype.forEach.call(options, function(element){
            element.addEventListener('click', function(e){
                e.preventDefault();
                var val = element.innerHTML;
                button.dataset.value = replaceSpace(firstDown(val));
                button.querySelector('span').innerHTML = val;

                var eventCheckSelect = new CustomEvent(
                    'supra.check.select'
                    , {'detail': val}
                );
                dropDown.dispatchEvent(eventCheckSelect);
            });
        });
    }
    /**
     * 
     * @param {type} args
     * @returns {Modal.prototype._dropDown.dropDown|Element}
     * @private
     */
    , _dropDown: function(args) {
        var dropDown = document.createElement('div');
        var classItem = args.outerClass ? '' + args.outerClass : '';
        dropDown.className = 'item clearfix' + classItem;
        var ul = '<ul class="dropdown-menu" aria-labelledby="dropdownMenu' + this._countDropDown + '">';
        args.menu.forEach(function(element) {
            ul += '<li><a href="#">' + firstUp(element) + '</a></li>';
        });
        ul += '</ul>';

        var visibleCValue = args.menu[0] ? firstUp(args.menu[0]) : '';
        var curentValue = args.menu[0] ? args.menu[0] : '';
        var callBackVal = '';
        if (args.callback !== undefined) callBackVal = args.callback();
        if (callBackVal !== '') {
            var curentValue = callBackVal;
            visibleCValue = firstUp(curentValue);
        }

        curentValue = replaceSpace(curentValue);

        var title = args.title !== '' ? '<label>' + args.title + '</label>' : '';

        dropDown.innerHTML = title
            + '<div class="dropdown">'
            + '<button class="supra-btn btn-default dropdown-toggle ' + args.elClass + '" ' +
            'type="button" id="dropdownMenu' + this._countDropDown + '"' +
            'data-toggle="dropdown" ' +
            'aria-haspopup="true" aria-expanded="false"' +
            'data-value="' + curentValue + '">'
            + '<span>' + visibleCValue + '</span>'
            +' <i class="icon-chevron-down-small"></i>'
            + '</button>'
            + ul
            + '</div>';

        this._addEventListToDropdown(dropDown);


        this._countDropDown ++;

        return dropDown;
    }
    /**
     * 
     * @param {type} args
     * @returns {Modal.prototype._switch.sw|Element}
     * @private
     */
    , _switch: function(args) {
        var sw = document.createElement('div');
        sw.className = 'item clearfix ' + args.elClass;
        var check = args.checked ? 'switch-on' : 'switch-off';
        var checkedInput = args.checked ? 'checked' : '';
        sw.innerHTML = '<div class="switch-group ' + args.type + '">' +
            '<label>' + args.title + '</label>' +
            '<div class="switch ' + check + '">'
            + '<input type="checkbox" name="switch" ' + checkedInput + '/>'
            + '<div class="wrap clearfix">'
            + '<span class="flex-center">ON</span>'
            + '<span class="switch-label flex-center"></span>'
            + '<span class="flex-center">OFF</span>'
            + '</div>'
            + '</div>' +
            '</div>';

        if (args.callback) args.callback(sw);

        return sw;
    }
    /**
     * 
     * @param {type} args
     * @returns {Modal.prototype._radio.radioGroup|Element}
     * @private
     */
    , _radio: function(args) {
        var radioGroup = document.createElement('div');
        radioGroup.className = 'item clearfix ' + args.marginTop;
        var items = '';
        args.items.forEach(function(name, indx) {
            var checked = indx === 0 ? 'checked' : '';
            items += '<label class="radio-inline">'
                + '<input type="radio" name="radio" value="' + name.toLowerCase().replace(/ /ig, '-') + '" ' + checked + '>'
                + '<span class="lbl">' + name + '</span>'
                + '</label>';
        });
        var title = args.title !== undefined && args.title !== '' ? '<label>' + args.title + '</label>' : '' ;
        radioGroup.innerHTML = title
            + '<div class="supra radio nomargintop">'
            + items
            + '</div>';

        return radioGroup;
    }
    /**
     * 
     * @param {type} args
     * @returns {Modal.prototype._checkbox.checkbox|Element}
     * @private
     */
    , _checkbox: function(args) {
        var checkbox = document.createElement('div');
        checkbox.className = 'item clearfix';
        checkbox.innerHTML = '<div class="supra checkbox">'
            + '<label>'
            + '<input type="checkbox" name="check">'
            + '<span class="lbl">' + args.name + '</span>'
            + '</label>'
            + '</div>';
        checkbox.querySelector('input').checked = args.checked;
        return checkbox;
    }
    /**
     * 
     * @param {type} args
     * @returns {Modal.prototype._figure.figure|Element}
     * @private
     */
    , _figure: function(args) {
        var _this = this;
        var figure = document.createElement('div');
        figure.className = 'item clearfix';
        figure.innerHTML = '<figure>'
            + '<div class="wrap-hover flex-center">'
            + '<img src="" alt="image" />'
            + '<div class="img" style="display: none;"></div>'
            + '<div class="bg-test bg"></div>'
            + '<i class="supra icon-folder-picture flex-center before-square"></i>'
            + '</div>'
            + '<figcaption>600x800</figcaption>'
            + '</figure>';

        figure.querySelector('i').addEventListener('click', function() {
            var modGallery = new Modal('supra-modal-gallery', 'Gallery', {
                parentModal: _this
                , targetElement: args.callback()
                , type: 'normal'
            });
        });

        var img = figure.querySelector('img');
        var figcaption = figure.querySelector('figcaption');
        img.addEventListener('load', function() {
            if (args.section) {
                var widthSection = args.section.getBoundingClientRect().width;
                var ptWidth = Math.round(this.naturalWidth / widthSection * 100);
                var divImg = figure.querySelector('.img');

                divImg.dataset.percent = ptWidth;
                if (args.sizeAuto) {
                    divImg.style.backgroundSize = ptWidth + '% auto';
                    divImg.style.webkitBackgroundSize = ptWidth + '% auto';
                }
            }
            figcaption.innerHTML = this.naturalWidth + 'x' + this.naturalHeight;
        });

        return figure;
    }
    /**
     * 
     * @param {type} args
     * @returns {Modal.prototype._inputText.input|Element}
     * @private
     */
    , _inputText: function(args) {
        var input = document.createElement('div');
        args.elClass = args.elClass || '';
        args.value = args.value || '';
        args.disabled = args.disabled || '';
        args.placeholder = args.placeholder || '';
        input.className = 'item clearfix nopadding nofloat ' + args.elClass;

        var title = args.title !== '' ? '<label>' + args.title + '</label>' : '';
        input.innerHTML = title
            + '<input type="text" class="choice-text ' + '" '
            + 'placeholder="' + args.placeholder + '" '
            + 'value="' + args.value +'" '
            + args.disabled + '>';
        return input;
    }
    /**
     * 
     * @param {type} args
     * @returns {Modal.prototype._inputRange.range|Element}
     * @private
     */
    , _inputRange: function(args) {
        var range = document.createElement('div');
        args.elClass = args.elClass || '';
        range.className = 'item clearfix ' + args.elClass;
        var title = args.title && args.title !== '' ? '<label>' + args.title + '</label>' : '';
        var opacity = args.opacity();
        if (opacity) {
            range.innerHTML = title + '<input type="range" value="' + opacity*100 + '"/>';
        } else {
            range.innerHTML = '<input type="range" value="100"/>';
        }

        return range;
    }
    /**
     * 
     * @returns {Modal.prototype._pageSettinsButton.btnGroup|Element}
     * @private
     */
    , _pageSettinsButton: function() {
        var btnGroup = document.createElement('div');
        btnGroup.className = 'item clearfix';

        btnGroup.innerHTML = '<div class="btn-group gray-buttons-group" role="group" aria-label="...">'
            + '<button id="general" type="button" '
            + 'class="supra-btn btn-default-dark col-sm-4 col-md-4 col-lg-4 active">General</button>'
            + '<button id="seo" type="button" '
            + 'class="supra-btn btn-default-dark col-sm-4 col-md-4 col-lg-4">SEO</button>'
            + '<button id="s-preloader" type="button" '
            + 'class="supra-btn btn-default-dark col-sm-4 col-md-4 col-lg-4">Preloader</button>'
            + '</div>';

        var buttons = btnGroup.querySelectorAll('button');
        Array.prototype.forEach.call(buttons, function(element) {
            element.addEventListener('click', function() {
                builder.selection(this);
                var parent = controls.findParent(this, ['btn-page-control']);
                var className = parent.className;
                var pattern = new RegExp('(general|seo|s-preloader)','i');
                if (parent) parent.className = className.replace(pattern, this.id);
            });
        });
        return btnGroup;
    }
    /**
     * 
     * @param {type} args
     * @returns {Modal.prototype._textArea.textArea|Element}
     * @private
     */
    , _textArea: function(args) {
        var textArea = document.createElement('div');
        textArea.className = 'item clearfix' + args.elClass;

        textArea.innerHTML = '<div class="">'
            + '<label>' + args.title + '</label>'
            + '<textarea>' + args.value + '</textarea>'
            + '</div>';

        return textArea;
    }
    /**
     * 
     * @param {type} args
     * @returns {Modal.prototype._description.p|Element}
     * @private
     */
    , _description: function(args) {
        var p = document.createElement('div');
        p.className = 'item clearfix';

        p.innerHTML = '<p>' + args.value + '</p>';

        return p;
    }
    /**
     *
     * @param {type} args
     * @returns {Modal.prototype._label.l|Element}
     * @private
     */
    , _label: function(args) {
        var l = document.createElement('label');
        var classItem = args.outerClass ? ' ' + args.outerClass : '';
        l.className = 'item clearfix lbl' + classItem;

        l.innerHTML = args.value;

        return l;
    }
    /**
     * 
     * @param {type} args
     * @returns {Modal.prototype._preloaderType.preloader|Element}
     * @private
     */
    , _preloaderType: function(args) {
        var _this = this;
        var preloader = document.createElement('div');
        preloader.id = 'prev-preload';
        preloader.className = 'item icons clearfix';

        preloader.innerHTML = '<label>' + args.title + '</label>';

        args.html.forEach(function(element, indx){
            preloader.appendChild(_this._preloaderItem(_this, element, args.dataName[indx], args.active));
        });

        return preloader;
    }
    /**
     * This function called from this._getModalGallery(), this._getModalGalleryVideo()
     * and this._getModalIconsGallery()
     * @param {type} args
     * @returns {Modal.prototype._galleryItems.gallery|Element}
     * @private
     */
    , _galleryItems: function(args) {
        var _this = this;
        var gallery = document.createElement('div');
        gallery.className = 'item ' + args.className + ' clearfix';
        if (args.className === 'gallery'&& args.type !== 'jpg') {
            args.data.forEach(function (element) {
                gallery.appendChild(_this._getItemForGallery(element.name
                    , element.width
                    , element.height
                    , './images/gallery/' + element.name
                    , null
                    , element.srcset
                ));
            });
        } else if (args.className === 'gallery' && args.type === 'jpg') {
            args.data.forEach(function (element) {
                gallery.appendChild(_this._getItemForGallery(element.name
                    , element.width
                    , element.height
                    , './video/gallery/' + element.name));
            });
        } else if (args.className === 'gallery-video') {
            args.data.forEach(function (element) {
                gallery.appendChild(_this._getItemForGalleryVideo(element.name
                    , element.width
                    , element.height
                    , './video/gallery/' + element.name));
            });
        } else {
            args.data.forEach(function (element) {
                gallery.appendChild(_this._getItemForIconsGallery(element));
            });
        }

        return gallery;
    }
    /**
     * 
     * @param {type} _this
     * @param {type} el
     * @param {type} dataName
     * @param {type} activeItem
     * @returns {Modal.prototype._preloaderItem.item|Element}
     * @private
     */
    , _preloaderItem: function(_this, el, dataName, activeItem) {
        var item = document.createElement('div');
        var active = dataName === activeItem ? ' active' : '';
        item.dataset.value = dataName;
        item.className = 'choice-element flex-center flex-column' + active;
        item.innerHTML = el + '<i class="ok supra icon-check2"></i><span class="bg-white-circle"></span>';

        item.addEventListener('click', function(){
            builder.selection(this);
            if (this.querySelector('.icon-picture')) {
                _this._body.classList.add('show-input-img');
            } else {
                if (_this._body.classList.contains('show-input-img')) {
                    _this._body.classList.remove('show-input-img');
                }
            }
        });

        return item;
    }
    /**
     * 
     * @param {type} _this
     * @returns {Modal.prototype._upload.upload|Element}
     * @private
     */
    , _upload: function(_this) {
        var upload = document.createElement('div');
        upload.className = 'upload';
        upload.innerHTML = '<button><i class="icon-cloud-upload"></i>Upload</button>'
            + '<input type="file" name="image" />';
        var inputFile = upload.querySelector('input');
        upload.querySelector('button').addEventListener('click', function() {
            if (typeof download === 'function') {
                inputFile.click();
            } else {
                var downloadButton = document.querySelector('.btn-success.download');
                var modal = new Modal('supra-modal', 'Demo', downloadButton);
                $(modal).modal('show');
            }
        });
        inputFile.addEventListener('change', function() {

            if (inputFile.files && inputFile.files[0]) {
                var images = _this._elementsGallery;
                var nameFile = replaceSpace(inputFile.files[0].name);
                var nameTrigger = false;
                //var index = 1;

                var form = new FormData();
                form.append('data', inputFile.files[0]);
                form.append('name_file', nameFile);
                builder.ajax(form, 'addgallery');

                images.forEach(function(element) {
                    if (nameFile === element.name) {
                        nameTrigger = true;
                    }
                });
                
                if (!nameTrigger) {
                    var reader = new FileReader();
                    reader.readAsDataURL(inputFile.files[0]);

                    reader.addEventListener('load', function(e) {
                        var gallery = _this._body.querySelector('.item.gallery');
                        var image = new Image();
                        image.src = e.target.result;

                        image.addEventListener('load', function() {
                            var newElement = _this._getItemForGallery(
                                nameFile
                                , this.naturalWidth
                                , this.naturalHeight
                                , e.target.result
                                , './images/gallery/' + nameFile);

                            gallery.appendChild(newElement);

                            builder.selection(newElement);

                            var body = gallery.parentElement.parentElement;
                            var heightBody = body.getBoundingClientRect().height;
                            var heightGalleryWrapper = gallery.getBoundingClientRect().height;

                            body.scrollTop = heightGalleryWrapper - heightBody;
                        });
                    });
                } else {
                    
                    var nameId = /[^./]+\./i.test(nameFile) ? nameFile.match(/([^./]+)\./i)[1].toLowerCase() : '';
                    if (nameId !== '') {
                        
                        var gallery = _this._body.querySelector('.item.gallery');
                        var body = gallery.parentElement.parentElement;
                        var choosenEelement = body.querySelector('[data-id=' + nameId + ']');
                        if (choosenEelement) {
                            var img = choosenEelement.querySelector('img');
                            var imgSrc = clearTimeStamp(img.getAttribute('src'));
                            
                            imgSrc += '?t=' + Date.now();
                            img.setAttribute('src', imgSrc);
                            choosenEelement.dataset.src = imgSrc;
                            
                            builder.selection(choosenEelement);
                            var scrollTopBody = body.scrollTop;
                            var positionTopBody = body.getBoundingClientRect().top;
                            var positionChEl = choosenEelement.getBoundingClientRect().top;

                            body.scrollTop = scrollTopBody + positionChEl - positionTopBody;
                        }
                    }
                }
            }
        });

        return upload;
    }
    /**
     *
     * @param {type} _this
     * @returns {Modal.prototype._upload.upload|Element}
     * @private
     */
    , _uploadVideo: function(_this, type) {
        var upload = document.createElement('div');
        upload.className = 'upload';
        upload.innerHTML = '<button><i class="icon-cloud-upload"></i>Upload</button>'
            + '<input type="file" name="image" accept=".' + type + '"/>';
        var inputFile = upload.querySelector('input');
        upload.querySelector('button').addEventListener('click', function() {
            if (typeof download === 'function') {
                inputFile.click();
            } else {
                var downloadButton = document.querySelector('.btn-success.download');
                var modal = new Modal('supra-modal', 'Demo', downloadButton);
                $(modal).modal('show');
            }
        });
        inputFile.addEventListener('change', function() {

            if (inputFile.files && inputFile.files[0]) {
                var itemsGallery = _this._elementsGallery;
                var nameFile = replaceSpace(inputFile.files[0].name);
                var nameTrigger = false;
                var index = 1;

                itemsGallery.forEach(function (element) {
                    if (nameFile === element.name) {
                        nameTrigger = true;
                    }
                });

                var form = new FormData();
                form.append('data', inputFile.files[0]);
                form.append('name_file', nameFile);
                builder.ajax(form, 'addgalleryvideo', function(data) {
                    var error = JSON.parse(data).error;
                    if (error) {
                        var modal = new Modal('supra-modal', 'Attention', {response: error});
                        $(modal).modal('show');
                    } else if (!nameTrigger) {
                        if (type === 'jpg') {
                            var reader = new FileReader();
                            reader.readAsDataURL(inputFile.files[0]);

                            reader.addEventListener('load', function(e) {
                                var gallery = _this._body.querySelector('.item.gallery');
                                var image = new Image();
                                image.src = e.target.result;

                                image.addEventListener('load', function() {

                                    gallery.appendChild(_this._getItemForGallery(
                                        nameFile
                                        , this.naturalWidth
                                        , this.naturalHeight
                                        , e.target.result
                                        , './video/gallery/' + nameFile)
                                    );
                                });
                            });
                        } else {
                            var gallery = _this._body.querySelector('.item.gallery-video');
                            gallery.appendChild(_this._getItemForGalleryVideo(
                                nameFile
                                , ''
                                , ''
                                , './video/gallery/' + nameFile)
                            );
                        }
                    }
                });
            }
        });

        return upload;
    }
    /**
     * 
     * @param {type} name
     * @param {type} width
     * @param {type} height
     * @param {type} src
     * @param {type} path
     * @returns {Modal.prototype._getItemForGallery.item|Element}
     * @private
     */
    , _getItemForGallery: function(name, width, height, src, path, srcset) {
        var path = path || src;
        var item = document.createElement('figure');
        var _this = this;
        var nameId = /[^.]+\./i.test(name) ? name.match(/([^.]+)\./i)[1].toLowerCase() : '';
        item.className = 'col-lg-2 selecting-item';
        item.dataset.src = path;
        item.dataset.id = nameId;

        var image = new Image();
        image.src = src;
        image.setAttribute('alt', 'section');
        if (srcset) {
            srcset = './images/gallery/' + srcset;
            //image.setAttribute('srcset', srcset);
            item.dataset.srcset = srcset;
        }
        var format = 1.085;
        if (window.innerWidth < 501) format = 0.75;
        if (!/\.svg/.test(src)) {
            this._imageSizig(width, height, format, image);

            item.innerHTML = '<div class="wrap-hover flex-center">'
                + '<i class="icon-check flex-center"></i>'
                + '</div>'
                + '<figcaption>'
                + '<p>' + clearTimeStamp(name) + '</p>'
                + '<p>' + width + 'x' + height + '</p>'
                + '</figcaption>';

            item.querySelector('.wrap-hover').appendChild(image);

            item.addEventListener('click', function () {
                builder.selection(this);
            });
        } else {
            var image = new Image();
            image.src = src;

            image.addEventListener('load', function() {
                _this._imageSizig(this.naturalWidth, this.naturalHeight, format, image);

                item.innerHTML = '<div class="wrap-hover flex-center">'
                    + '<i class="icon-check flex-center"></i>'
                    + '</div>'
                    + '<figcaption>'
                    + '<p>' + name + '</p>'
                    + '<p>' + this.naturalWidth + 'x' + this.naturalHeight + '</p>'
                    + '</figcaption>';

                item.querySelector('.wrap-hover').appendChild(image);

                item.addEventListener('click', function () {
                    builder.selection(this);
                });
            });
        }

        return item;
    }
    /**
     *
     * @param {type} name
     * @param {type} src
     * @param {type} path
     * @returns {Modal.prototype._getItemForGallery.item|Element}
     * @private
     */
    , _getItemForGalleryVideo: function(name, width, height, path) {
        var nameId = /[^.]+\./i.test(name) ? name.match(/([^.]+)\./i)[1].toLowerCase() : '';
        var item = document.createElement('div');
        item.className = 'col-lg-2 selecting-item video-item';
        item.dataset.src = path;
        item.dataset.id = nameId;

        var content = '<span class="icon-clapboard-play flex-center"></span>';
        if (width !== '' && height !== '') {
            content = '';
            var image = new Image();
            image.src = path.match(/\.[^.]*/i)[0] + '.jpg';
            image.setAttribute('alt', 'section');
            var format = 1.085;
            if (window.innerWidth < 501) format = 0.75;
            this._imageSizig(width, height, format, image);
        }

        item.innerHTML = '<div class="wrap-hover flex-center">'
            + '<i class="icon-check flex-center"></i>'
            + content
            + '</div>'
            + '<p class="name-video">' + name + '</p>';

        if (width !== '' && height !== '') {
            item.querySelector('.wrap-hover').appendChild(image);
        }

        item.addEventListener('click', function(){
            builder.selection(this);
        });

        return item;
    }
    /**
     * 
     * @param {type} icon
     * @returns {Modal.prototype._getItemForIconsGallery.item|Element}
     * @private
     */
    , _getItemForIconsGallery: function(icon) {
        var item = document.createElement('div');
        item.className = 'ico choice-element flex-center';

        item.innerHTML = '<i class="ok supra icon-check2"></i>'
            + '<span class="bg-white-circle"></span>'
            + '<i class="' + icon.slice(1) + '"></i>';

        item.addEventListener('click', function(){
            builder.selection(this);
        });
        return item;
    }
    /**
     * 
     * @param {type} width
     * @param {type} height
     * @param {type} format
     * @param {type} DOMimage
     * @returns {undefined}
     * @private
     */
    , _imageSizig: function(width, height, format, DOMimage) {
        if (height <= width && (width/height) > format) {
            DOMimage.style.width = '100%';
        } else {
            DOMimage.style.height = '100%';
            DOMimage.style.width = 'auto';
        }
    }
    /**
     * 
     * @param {type} classButton
     * @param {type} nameButton
     * @param {type} callback
     * @returns {Modal.prototype._getButton.button|Element}
     * @private
     */
    , _getButton: function(classButton, nameButton, callback) {
        var button = document.createElement('button');
        button.className = classButton;
        button.setAttribute('type', 'button');
        button.innerHTML = nameButton;

        button.addEventListener('click', function() {
            callback();
        });

        return button;
    }
    , _colorpickerDouble: function(args) {
        args.elClass = args.elClass || '';
        var item = document.createElement('div');
        item.className = 'item clearfix nofloat nopadding ' + args.elClass;
        var cp1 = document.createElement('input');
        cp1.setAttribute('type', 'text');
        cp1.setAttribute('name', 'colorpicker_main');
        cp1.value = args.callback()[0];
        var cp2 = document.createElement('input');
        cp2.setAttribute('type', 'text');
        cp2.setAttribute('name', 'colorpicker_grnt');
        cp2.value = args.callback()[1];

        item.appendChild(cp1);
        item.appendChild(cp2);

        $(this._selfDOM).on('show.bs.modal', function() {
            $(cp1).spectrum({
                color: args.callback()[0]
                , showPalette: true
                , preferredFormat: "hex"
                , allowEmpty: false
                , localStorageKey: "spectrum.homepage"
                , change: args.chengeMain
                , hide: args.cancel
            });

            $(cp2).spectrum({
                color: args.callback()[2]
                , showPalette: true
                , preferredFormat: "hex"
                , allowEmpty: false
                , localStorageKey: "spectrum.homepage"
                , change: args.chengeGrnt
                , hide: args.cancel
            });
        });

        return item;
    }
    /**
     * -------------------------------------------- Part - create modal type ----------------------------------------
     */

    /**
     * To create modal dialog for tuning section, nav and popus background
     */
    
    /**
     * 
     * @private
     */
    , _getModalSectionBg: function (_this) {
        var li = this._targetObject;
        var bgStyleSelector = '#' + li.children[0].id + ' .bg';
        var section = li.children[0];
        var classParallax = '';
        var bg = section.querySelector('.bg');
        var video = null;
        if (bg && bg.classList.contains('bg-video') && $(bg).data('vide')) {
            var videPath = $(bg).data('vide').path;
            var poster = videPath.jpg;
            if (!poster)
                poster = bg.dataset.videBg.match(/jpg:\s*([^,\s]*)/)[1] ? bg.dataset.videBg.match(/jpg:\s*([^,\s]*)(?:\.jpg)?/)[1] : '';
            video = {
                mp4: videPath.mp4
                , ogv: videPath.ogv
                , poster: poster.replace(/\.jpg/, '')
            };
        } else if (bg && bg.classList.contains('bg-video')) {
            video = {
                mp4: bg.dataset.videBg.match(/mp4:\s*([^,\s]*)/)[1] ? bg.dataset.videBg.match(/mp4:\s*([^,\s]*)(?:\.mp4)?/)[1].replace(/\.mp4/, '') : ''
                , ogv: bg.dataset.videBg.match(/ogv:\s*([^,\s]*)/)[1] ? bg.dataset.videBg.match(/ogv:\s*([^,\s]*)(?:\.ogv)?/)[1].replace(/\.ogv/, '') : ''
                , poster: bg.dataset.videBg.match(/jpg:\s*([^,\s]*)/)[1] ? bg.dataset.videBg.match(/jpg:\s*([^,\s]*)(?:\.jpg)?/)[1].replace(/\.jpg/, '') : ''
            };
        }

        this._title.innerHTML = '<h4>Background settings</h4>';

        this._elements = null;

        
        var style = li.querySelector('style').innerHTML;
        var navBg = '';
        // for navigations
        if (li.classList.contains('nav')) {
            section = section.querySelector('.nav-bg');
            bgStyleSelector = '.nav-bg';
            navBg = '\\s.nav-bg';
        }
        var bgStyleColor = '';
        var classBg = section.className.match('bg-([0-9]{1})-color-(light|dark)');
        if (classBg) {
            bgStyleColor = 'Default color ' + classBg[2];
        } else {
            bgStyleColor = 'Default color light';
        }

        var gradientColor1 = builder._style.styleItems.light[0].lightColor;
        var gradientColor2 = builder._style.styleItems.dark[0].darkColor;

        var patternStyleSize = new RegExp(bgStyleSelector + '\\s?\{[\\s\\S]*?background-size:\\s*([^;]*);', 'im');
        var bgOptions = style.match(patternStyleSize);
        var patternStylePosition = new RegExp(bgStyleSelector + '\\s?\{[\\s\\S]*?background-position:\\s*([^;]*);', 'im');
        var position = style.match(patternStylePosition);
        var patternStyleRepeat = new RegExp(bgStyleSelector + '\\s?\{[\\s\\S]*?background-repeat:\\s*([^;]*);', 'im');
        var repeat = style.match(patternStyleRepeat);
        var patternStyleGradient = new RegExp('#' + li.children[0].id + navBg + '\\s?\{[\\s\\S]*?background:\\s*([^;]*);', 'im');
        var gradient = style.match(patternStyleGradient);
        if (gradient) {
            var colors = gradient[1].match(/.*?(#[^\s,)]*).*?(#[^\s,)]*)/i);
            if (colors) {
                gradientColor1 = colors[1];
                gradientColor2 = colors[2];
            }
            if (gradient[1].match(/linear-gradient\(to bottom/i)) {
                bgStyleColor = 'Vertical gradient';
            } else if (gradient[1].match(/linear-gradient\(to right/i)) {
                bgStyleColor = 'Horizontal gradient';
            } else if (gradient[1].match(/radial-gradient\(circle/i)) {
                bgStyleColor = 'Radial gradient';
            } else if (gradient[1].match(/linear-gradient\(135deg/i)) {
                bgStyleColor = 'Angle gradient';
            } else {
                bgStyleColor = 'Solid color';
                gradientColor1 = gradient[1];
            }
        }

        if (!li.classList.contains('nav')) {
            _this._constructModalBody([
                    {
                        name: 'radio'
                        , func: 'radio'
                        , args: {
                        items: ['Image background', 'Video background', 'None']
                        , marginTop: ''
                    }
                    }
                ], 'col-sm-12 col-md-12 col-lg-12 nopadding radio-control'
            );

            var WidthVal = 'auto';
            var HeightVal = 'auto';

            if (bgOptions && (bgOptions[1] !== 'auto' || bgOptions[1] !== 'cover')) {
                WidthVal = bgOptions && bgOptions[1].match(/([0-9]*(?:px|%)|auto)\s/i)
                    ? bgOptions[1].match(/([0-9]*(?:px|%)|auto)\s/i)[1] : 'auto';
            }

            if (bgOptions && (bgOptions[1] !== 'auto' || bgOptions[1] !== 'cover')) {
                HeightVal = bgOptions && bgOptions[1].match(/\s([0-9]*(?:px|%)|auto)/i)
                    ? bgOptions[1].match(/\s([0-9]*(?:px|%)|auto)/i)[1] : 'auto';
            }

            _this._constructModalBody([
                    {
                        name: 'inputImage'
                        , func: 'inputImage'
                        , args: {
                        title: 'Background path'
                        , elClass: 'col-sm-10 col-md-10 col-lg-10'
                        , type: 'normal'
                    }
                    }
                    , {
                        name: 'BgStyle'

                        , func: 'dropDown'
                        , args: {
                            menu: ['cover', 'auto', 'contain', 'custom (width x height)']
                            , title: 'Background size:'
                            , elClass: 'col-sm-10 col-md-10 col-lg-10'
                            , callback: function() {
                                if (bgOptions && (bgOptions[1] === 'auto' || bgOptions[1] === 'cover' || bgOptions[1] === 'contain')) {
                                    return  bgOptions ? bgOptions[1] : 'Auto';
                                } else if (bgOptions) {
                                    _this._body.classList.add('show-custom-size');
                                    return  bgOptions ? 'Custom (width x height)' : 'Auto';
                                }

                                return  'Auto';
                            }
                        }
                    }
                    , {
                        name: 'Width'
                        , func: 'inputText'
                        , args: {
                            title: ''
                            , value: WidthVal
                            , elClass: 'col-sm-4 col-md-4 col-lg-4 margin-right-20 float-left custom-size'
                        }
                    }
                    , {
                        name: 'Height'
                        , func: 'inputText'
                        , args: {
                            title: ''
                            , value: HeightVal
                            , elClass: 'col-sm-4 col-md-4 col-lg-4 custom-size'
                        }
                    }
                    , {
                        name: 'BgRepeat'
                        , func: 'dropDown'
                        , args: {
                            menu: [
                                'None'
                                , 'Repeat'
                                , 'Repeat x'
                                , 'Repeat y'
                            ]
                            , title: 'Background repeat:'
                            , elClass: 'col-sm-10 col-md-10 col-lg-10'
                            , callback: function() {
                                if (repeat && repeat[1] === 'no-repeat') {
                                    return 'none';
                                }
                                return repeat ? repeat[1] : 'none';
                            }
                        }
                    }
                    , {
                        name: 'label'
                        , func: 'label'
                        , args: {
                            value: 'Background position:'
                        }
                    }
                    , {
                        name: 'BgPositionLR'
                        , func: 'dropDown'
                        , args: {
                            menu: [
                                'left'
                                , 'center'
                                , 'right'
                            ]
                            , title: ''
                            , outerClass: ' col-sm-4 col-md-4 col-lg-4 nopadding double-dropdown margin-right-20 inline-b nofloat'
                            , callback: function() {
                                if (position && position[1].split(' ')[1]) {
                                    return position[1].split(' ')[1];
                                }
                                return 'center';
                            }
                        }
                    }
                    , {
                        name: 'BgPositionTB'
                        , func: 'dropDown'
                        , args: {
                            menu: [
                                'top'
                                , 'center'
                                , 'Bottom'
                            ]
                            , title: ''
                            , outerClass: ' col-sm-4 col-md-4 col-lg-4 nopadding double-dropdown inline-b nofloat'
                            , callback: function() {
                                if (position && position[1].split(' ')[0]) {
                                    return position[1].split(' ')[0];
                                }
                                return 'center';
                            }
                        }
                    }
                ], 'col-sm-6 col-md-6 col-lg-6 nopadding image-background'
            );

            _this._constructModalBody([
                {
                    name: 'inputVideoMp4'
                    , func: 'inputVideo'
                    , args: {
                    title: 'MP4 video path'
                    , elClass: 'col-sm-10 col-md-10 col-lg-10'
                    , type: 'mp4'
                }
                }
                , {
                    name: 'inputVideoOgv'
                    , func: 'inputVideo'
                    , args: {
                    title: 'OGV video path'
                    , elClass: 'col-sm-10 col-md-10 col-lg-10'
                    , type: 'ogv'
                }
                }
                , {
                    name: 'inputImagePoster'
                    , func: 'inputVideo'
                    , args: {
                        title: 'Poster path (.jpg only)'
                        , elClass: 'col-sm-10 col-md-10 col-lg-10 video'
                        , type: 'jpg'
                    }
                }
                ], 'col-sm-6 col-md-6 col-lg-6 nopadding video-background'
            );
        }

        var patternOpacity = new RegExp(bgStyleSelector + '[\\s]*\{[\\s\\S]*?opacity:[\\s]*([^;]*)', 'im');
        var opacity = style.match(patternOpacity);
        var opacityLabel = opacity ? opacity[1] : 1;

        var figureMode = '';
        if (li.classList.contains('nav'))  {
            figureMode = ' nav-pr-bg';
        }

        _this._constructModalBody([
                {
                    name: 'figure'
                    , func: 'figure'
                    , args: {
                        callback: function() {
                            return _this._elements.inputImage;
                        }
                    , section: section
                    , sizeAuto: !bgOptions || (bgOptions && bgOptions[1] === 'auto')
                }
                }
                , {
                    name: 'inputRange'
                    , func: 'inputRange'
                    , args: {
                        title: 'Opacity (<span class="opacity">' + Math.round(opacityLabel*100) + '</span>%):'
                        , elClass: 'range'
                        , opacity: function() {
                            return opacity ? opacity[1] : 100;
                        }
                    }
                }

            ], 'col-sm-6 col-md-6 col-lg-6 nopadding preview-bg image-background video-background none float-right' + figureMode
        );

        var colorBlockClass = 'col-sm-6 col-md-6 col-lg-6 color-block nopadding image-background video-background none';
        var nomargin = '';
        if (li.classList.contains('nav'))  {
            colorBlockClass = 'col-sm-6 col-md-6 col-lg-6 color-block nopadding hide-switch';
            nomargin = ' nomargintop';
        }

        _this._constructModalBody([
            , {
                name: 'BgColor'
                , func: 'dropDown'
                , args: {
                    menu: [
                        'Default color light'
                        , 'Default color dark'
                        , 'Solid color'
                        , 'Radial gradient'
                        , 'Vertical gradient'
                        , 'Horizontal gradient'
                        , 'Angle gradient'
                    ]
                    , title: 'Background color:'
                    , elClass: 'col-sm-10 col-md-10 col-lg-10'
                    , outerClass: nomargin
                    , callback: function() {
                        return  bgStyleColor;
                    }
                }
            }
            , {
                name: 'colorpicker'
                , func: 'colorpickerDouble'
                , args: {
                    elClass: 'colorpicker two-cp'
                    , callback: function() {
                        return [
                            gradientColor1
                            , gradientColor2
                        ];
                    }
                    , chengeMain: function(color) {
                        var cp = _this._elements.colorpicker;
                        var bgColor2 = cp.querySelector('[name=colorpicker_grnt]').value;
                        _this._chengeCstmColor(color.toHexString(), bgColor2);
                    }
                    , chengeGrnt: function(color) {
                        var cp = _this._elements.colorpicker;
                        var bgColor1 = cp.querySelector('[name=colorpicker_main]').value;
                        _this._chengeCstmColor(bgColor1, color.toHexString());
                    }
                    , cancel: function() {
                        var cp = _this._elements.colorpicker;
                        var bgColor1 = cp.querySelector('[name=colorpicker_main]');
                        var bgColor2 = cp.querySelector('[name=colorpicker_grnt]');
                        bgColor1.value = $(bgColor1).spectrum("get");
                        bgColor2.value = $(bgColor2).spectrum("get");
                        _this._chengeCstmColor(bgColor1.value, bgColor2.value);
                    }
                }
            },
            {
                name: 'parallax'
                , func: 'switch'
                , args: {
                title: 'Parallax'
                , type: ''
                , checked: li.classList.contains('parallax')
                , elClass: classParallax + ' none'
                , callback: function (sw) {
                    sw.querySelector('.switch').addEventListener('click', function (e) {
                        e.preventDefault();
                        if (this.classList.contains('switch-on')) {
                            this.classList.remove('switch-on');
                            this.classList.add('switch-off');
                            this.querySelector('input').removeAttribute('checked');
                        } else {
                            this.classList.remove('switch-off');
                            this.classList.add('switch-on');
                            this.querySelector('input').setAttribute('checked', '');
                        }
                    });
                }
            }
            }
            ], colorBlockClass
        );

        var img = _this._elements.figure.querySelector('img');
        var divImg = _this._elements.figure.querySelector('.img');
        divImg.style.display = 'block';

        $(_this._selfDOM).on('shown.bs.modal', function() {
            var widthSection = section.getBoundingClientRect().width;
            var widthModal = _this._elements.figure.getBoundingClientRect().width;
            var percentWidth =  Math.round(widthModal / widthSection * 100);
            var heightSection = section.getBoundingClientRect().height;
            var heightModal = heightSection * (percentWidth/100);
            var wrap = _this._elements.figure.querySelector('.wrap-hover');
            wrap.style.height = heightModal + 'px';
        });

        var patternImage = new RegExp(bgStyleSelector + ' ?\{[\\s\\n\\t]*background-image:\\s*url\\(\'?/?([^\']*)\'?\\);', 'im');

        var src = (style.match(patternImage) && style.match(patternImage)[1] !== '') ? style.match(patternImage)[1] : '';

        if (!li.classList.contains('nav')) {
            _this._elements.inputImage.querySelector('input').value = clearTimeStamp(src);
            _this._elements.inputVideoMp4.querySelector('input').value = video && video.mp4 ? './' + video.mp4 + '.mp4' : '';
            _this._elements.inputVideoOgv.querySelector('input').value = video && video.ogv ? './' + video.ogv + '.ogv' : '';
            _this._elements.inputImagePoster.querySelector('input').value = video && video.poster ? './' + video.poster + '.jpg' : '';

            var radio = _this._elements.radio.querySelectorAll('.radio-inline input');
            var wrapHover = _this._elements.figure.querySelector('.wrap-hover');
            var i = _this._elements.figure.querySelector('.before-square');
            //var iVideo = document.createElement('i');
            //iVideo.className = 'supra icon-folder-film flex-center before-square';
            //iVideo.querySelector('i').addEventListener('click', function() {
            //    var modGallery = new Modal('supra-modal-gallery', 'GalleryVideo', {
            //        parentModal: _this
            //        , targetElement: item
            //        , type: args.type
            //    });
            //});
            var imageStyle = '';
            var colorBlock = _this._body.querySelector('.color-block');
            var colorPicker = _this._body.querySelector('.color-block button');

            if (src !== '' && !video) {
                _this._elements.radio.parentElement.classList.add('image-background');
                _this._elements.radio.querySelector('[value=image-background]').checked = true;
                if (!wrapHover.querySelector('.img')) wrapHover.appendChild(divImg);
                //if (wrapHover.querySelector('.icon-folder-film.before-square')) wrapHover.removeChild(iVideo);
                if (!wrapHover.querySelector('.icon-folder-picture.before-square')) wrapHover.appendChild(i);
                divImg.style.backgroundImage = imageStyle;
                divImg.className = 'img';
                divImg.innerHTML = '';
            } else if (src === '' && video) {
                _this._elements.radio.parentElement.classList.add('video-background');
                _this._elements.radio.querySelector('[value=video-background]').checked = true;
                $(_this._selfDOM).on('shown.bs.modal', function() {
                    setTimeout(function() {
                        $(divImg).vide({
                            mp4: video.mp4 ? video.mp4 : '',
                            ogv: video.ogv ? video.ogv : '',
                            poster: video.poster ? video.poster : ''
                        }, {posterType: 'jpg'});
                    }, 400);
                });
                if (!wrapHover.querySelector('.img')) wrapHover.appendChild(divImg);
                if (wrapHover.querySelector('.icon-folder-picture.before-square')) wrapHover.removeChild(i);
                //if (!wrapHover.querySelector('.icon-folder-film.before-square')) wrapHover.appendChild(iVideo);
                divImg.classList.add('bg-video');
                if (divImg.style.backgroundImage !== '')
                    imageStyle = divImg.style.backgroundImage;
                divImg.style.backgroundImage = '';
            } else {
                _this._elements.radio.parentElement.classList.add('none');
                _this._elements.radio.querySelector('[value=none]').checked = true;
                if (wrapHover.querySelector('.img')) wrapHover.removeChild(divImg);
                if (wrapHover.querySelector('.icon-folder-picture.before-square')) wrapHover.removeChild(i);
                //if (wrapHover.querySelector('.icon-folder-film.before-square')) wrapHover.removeChild(iVideo);
                divImg.className = 'img';
                divImg.innerHTML = '';
                _this._elements.BgColor.parentElement.classList.add('nomargintop');
            }

            //if (src === '' && !video) {
            //    colorPicker.className = 'supra-btn btn-default dropdown-toggle col-sm-10 col-md-10 col-lg-10';
            //    colorBlock.className = 'col-sm-6 col-md-6 col-lg-6 color-block nopadding image-background video-background none';
            //} else {
            //    colorPicker.className = 'supra-btn btn-default dropdown-toggle col-sm-10 col-md-10 col-lg-10';
            //    colorBlock.className = 'col-sm-6 col-md-6 col-lg-6 color-block nopadding image-background video-background none';
            //}

            Array.prototype.forEach.call(radio, function(item) {
                item.addEventListener('change', function(e) {
                    e.preventDefault();
                    var radioControl = controls.findParent(this, ['radio-control']);
                    radioControl.className = radioControl.className.replace(/(image-background|video-background|none)/i, '');
                    radioControl.classList.add(this.value);

                    switch (this.value) {
                        case 'none':
                            if (wrapHover.querySelector('.img')) wrapHover.removeChild(divImg);
                            if (wrapHover.querySelector('.before-square')) wrapHover.removeChild(i);
                            divImg.className = 'img';
                            divImg.innerHTML = '';
                            break;
                        case 'video-background':
                            if (!wrapHover.querySelector('.img')) wrapHover.appendChild(divImg);
                            if (wrapHover.querySelector('.before-square')) wrapHover.removeChild(i);
                            divImg.classList.add('bg-video');
                            if (!$.vide) vide_run();
                            if (video) {
                                $(divImg).vide({
                                    mp4: video.mp4 ? video.mp4 : '',
                                    ogv: video.ogv ? video.ogv : '',
                                    poster: video.poster ? video.poster : ''
                                }, {posterType: 'jpg'});
                            }
                            if (divImg.style.backgroundImage !== '')
                                imageStyle = divImg.style.backgroundImage;
                            divImg.style.backgroundImage = '';

                            break;
                        case 'image-background':
                        default:
                            if (!wrapHover.querySelector('.img')) wrapHover.appendChild(divImg);
                            if (!wrapHover.querySelector('.before-square')) wrapHover.appendChild(i);
                            divImg.style.backgroundImage = imageStyle;
                            divImg.className = 'img';
                            divImg.innerHTML = '';
                            break;
                    }
                    
                    if (this.value === 'none') {
                        //colorPicker.className = 'supra-btn btn-default dropdown-toggle col-sm-10 col-md-10 col-lg-10';
                        //colorBlock.className = 'col-sm-6 col-md-6 col-lg-6 color-block nopadding image-background video-background none';
                        if (!_this._elements.BgColor.parentElement.classList.contains('nomargintop')) {
                            _this._elements.BgColor.parentElement.classList.add('nomargintop');
                        }
                    } else {
                        //colorPicker.className = 'supra-btn btn-default dropdown-toggle col-sm-5 col-md-5 col-lg-5';
                        //colorBlock.className = 'col-sm-12 col-md-12 col-lg-12 color-block nopadding image-background video-background none';
                        if (_this._elements.BgColor.parentElement.classList.contains('nomargintop')) {
                            _this._elements.BgColor.parentElement.classList.remove('nomargintop');
                        }
                    }
                });
            });

            if (src !== '') {
                img.src = src;
                divImg.style.backgroundImage = 'url(\'' + src + '\')';
            }


            if (repeat && repeat[1] === 'none') {
                divImg.style.backgroundRepeat = 'no-repeat';
                divImg.style.webkitBackgroundRepeat = 'no-repeat';
            } else {
                divImg.style.backgroundRepeat = repeat ? repeat[1].replace(/\s/, '-') : 'no-repeat';
                divImg.style.webkitBackgroundRepeat = repeat ? repeat[1].replace(/\s/, '-') : 'no-repeat';
            }
            if (bgOptions && bgOptions[1] !== 'auto' && bgOptions[1] !== 'cover' && bgOptions[1] !== 'contain') {
                _this._setCostomSizeOnFigure(bgOptions[1].split(' ')[0], bgOptions[1].split(' ')[1], divImg, section);
            } else if (bgOptions && (bgOptions[1] === 'cover' || bgOptions[1] === 'contain')) {
                divImg.style.backgroundSize = bgOptions[1];
            }
            if (position) {
                divImg.style.backgroundPosition = position[1];
            }

            var widthEl = _this._elements.Width.querySelector('input');
            var heightEl = _this._elements.Height.querySelector('input');

            widthEl.addEventListener('blur', _this._setCostomSizeOnFigure.bind(_this, widthEl, heightEl, divImg, section));
            heightEl.addEventListener('blur', _this._setCostomSizeOnFigure.bind(_this, widthEl, heightEl, divImg, section));

            var bgStyle = _this._elements.BgStyle;
            bgStyle.addEventListener('supra.check.select', function (e) {
                if (e.detail.toLowerCase() === 'auto') {
                    divImg.style.backgroundSize = divImg.dataset.percent + '% auto';
                    divImg.style.webkitBackgroundSize = divImg.dataset.percent + '% auto';
                } else if (e.detail.toLowerCase() === 'custom (width x height)') {
                    _this._body.classList.add('show-custom-size');
                    _this._setCostomSizeOnFigure(widthEl, heightEl, divImg, section);
                } else {
                    divImg.style.backgroundSize = e.detail.toLowerCase();
                    divImg.style.webkitBackgroundSize = e.detail.toLowerCase();
                }

                if (e.detail.toLowerCase() !== 'custom (width x height)'
                    && _this._body.classList.contains('show-custom-size')) {
                    _this._body.classList.remove('show-custom-size');
                }
            });

            var bgPositionLR = _this._elements.BgPositionLR;
            bgPositionLR.addEventListener('supra.check.select', function (e) {
                var TB = bgPositionTB.querySelector('.dropdown button').dataset.value.toLowerCase();
                divImg.style.backgroundPosition = TB + ' ' + e.detail.toLowerCase();
            });
            var bgPositionTB = _this._elements.BgPositionTB;
            bgPositionTB.addEventListener('supra.check.select', function (e) {
                var LR = bgPositionLR.querySelector('.dropdown button').dataset.value.toLowerCase();
                divImg.style.backgroundPosition = e.detail.toLowerCase() + ' ' + LR;
            });

            var bgRepeat = _this._elements.BgRepeat;
            bgRepeat.addEventListener('supra.check.select', function (e) {
                if (e.detail.toLowerCase() === 'none') {
                    divImg.style.backgroundRepeat = 'no-repeat';
                    divImg.style.webkitBackgroundRepeat = 'no-repeat';
                } else {
                    divImg.style.backgroundRepeat = e.detail.toLowerCase().replace(/\s/, '-');
                    divImg.style.webkitBackgroundRepeat = e.detail.toLowerCase().replace(/\s/, '-');
                }
            });

            divImg.style.opacity = opacity ? opacity[1] : 1;

            var range = _this._elements.inputRange.querySelector('input');
            var opacityLabel = _this._elements.inputRange.querySelector('label .opacity');
            range.addEventListener('input', function () {
                divImg.style.opacity = this.value / 100;
                opacityLabel.innerHTML = Math.round(this.value);
            });

            range.addEventListener('change', function () {
                divImg.style.opacity = this.value / 100;
                opacityLabel.innerHTML = Math.round(this.value);
            });
        }

        var background = this._elements.figure.querySelector('.bg-test');
        var bgClassName = section.className.match(/bg-.-color-(light|dark)/i);
        var cp = _this._elements.colorpicker;
        if (bgClassName) background.classList.add(bgClassName[0]);
        var bgElementColor = _this._elements.BgColor;

        _this._setColor(_this, bgStyleColor.toLowerCase(), gradientColor1, gradientColor2, cp, background);

        bgElementColor.addEventListener('supra.check.select', function(e) {
            var bgColor1 = cp.querySelector('[name=colorpicker_main]').value;
            var bgColor2 = cp.querySelector('[name=colorpicker_grnt]').value;

            _this._setColor(_this, e.detail.toLowerCase(), bgColor1, bgColor2, cp, background);

            if (e.detail.toLowerCase() !== 'solid color'
                && e.detail.toLowerCase() !== 'default color light'
                && e.detail.toLowerCase() !== 'default color dark'
            ) {
                if (!cp.classList.contains('two-cp')) {
                    cp.classList.add('two-cp');
                    cp.className = cp.className.replace(/\sone-cp/i, '');
                }
            }
        });

        if (li.classList.contains('nav')) {
            background.style.opacity = opacity ? opacity[1] : 1;

            var range = _this._elements.inputRange.querySelector('input');
            var opacityLabel = _this._elements.inputRange.querySelector('label .opacity');
            range.addEventListener('input', function () {
                background.style.opacity = this.value / 100;
                opacityLabel.innerHTML = this.value;
            });

            range.addEventListener('chenge', function () {
                background.style.opacity = this.value / 100;
                opacityLabel.innerHTML = this.value;
            });

            var hover = _this._elements.figure.querySelector('i');
            hover.style.display = 'none';
        }

        var argsSave = {
            image: _this._elements.inputImage ? _this._elements.inputImage.querySelector('input').value : ''
            , bgColor: _this._elements.BgColor.querySelector('button').dataset.value.toLowerCase().replace(/_/ig, ' ')
            , bgStyle: _this._elements.BgStyle ? _this._elements.BgStyle.querySelector('.dropdown button').dataset.value.toLowerCase() : ''
            , bgRepeat: _this._elements.BgRepeat ? _this._elements.BgRepeat.querySelector('.dropdown button').dataset.value.toLowerCase() : ''
            , bgWidth: _this._elements.Width ? _this._elements.Width.querySelector('input').value.toLowerCase() : ''
            , bgHeight: _this._elements.Height ? _this._elements.Height.querySelector('input').value.toLowerCase() : ''
            , bgPTB: _this._elements.BgPositionTB ? _this._elements.BgPositionTB.querySelector('.dropdown button').dataset.value.toLowerCase() : ''
            , bgPLR: _this._elements.BgPositionLR ? _this._elements.BgPositionLR.querySelector('.dropdown button').dataset.value.toLowerCase() : ''
            , bgColor1: _this._elements.colorpicker ? _this._elements.colorpicker.querySelector('[name=colorpicker_main]').value : ''
            , bgColor2: _this._elements.colorpicker ? _this._elements.colorpicker.querySelector('[name=colorpicker_grnt]').value : ''
            , parallax: _this._elements.parallax ? _this._elements.parallax.querySelector('input').checked : ''
            , range: _this._elements.inputRange.querySelector('input').value / 100
            , bgMp4: _this._elements.inputVideoMp4 ? _this._elements.inputVideoMp4.querySelector('input').value : ''
            , bgOgv: _this._elements.inputVideoOgv ? _this._elements.inputVideoOgv.querySelector('input').value : ''
            , bgPoster: _this._elements.inputImagePoster ? _this._elements.inputImagePoster.querySelector('input').value : ''
            , radio: _this._elements.radio ? _this._elements.radio.querySelector('.radio-inline input:checked').value : ''
        };

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {
            var args = {
                image: _this._elements.inputImage ? _this._elements.inputImage.querySelector('input').value : ''
                , bgColor: _this._elements.BgColor.querySelector('button').dataset.value.toLowerCase().replace(/_/ig, ' ')
                , bgStyle: _this._elements.BgStyle ? _this._elements.BgStyle.querySelector('.dropdown button').dataset.value.toLowerCase() : ''
                , bgRepeat: _this._elements.BgRepeat ? _this._elements.BgRepeat.querySelector('.dropdown button').dataset.value.toLowerCase() : ''
                , bgWidth: _this._elements.Width ? _this._elements.Width.querySelector('input').value.toLowerCase() : ''
                , bgHeight: _this._elements.Height ? _this._elements.Height.querySelector('input').value.toLowerCase() : ''
                , bgPTB: _this._elements.BgPositionTB ? _this._elements.BgPositionTB.querySelector('.dropdown button').dataset.value.toLowerCase() : ''
                , bgPLR: _this._elements.BgPositionLR ? _this._elements.BgPositionLR.querySelector('.dropdown button').dataset.value.toLowerCase() : ''
                , bgColor1: _this._elements.colorpicker ? _this._elements.colorpicker.querySelector('[name=colorpicker_main]').value : ''
                , bgColor2: _this._elements.colorpicker ? _this._elements.colorpicker.querySelector('[name=colorpicker_grnt]').value : ''
                , parallax: _this._elements.parallax ? _this._elements.parallax.querySelector('input').checked : ''
                , range: _this._elements.inputRange.querySelector('input').value / 100
                , bgMp4: _this._elements.inputVideoMp4 ? _this._elements.inputVideoMp4.querySelector('input').value : ''
                , bgOgv: _this._elements.inputVideoOgv ? _this._elements.inputVideoOgv.querySelector('input').value : ''
                , bgPoster: _this._elements.inputImagePoster ? _this._elements.inputImagePoster.querySelector('input').value : ''
                , radio: _this._elements.radio ? _this._elements.radio.querySelector('.radio-inline input:checked').value : ''
            };

            _this._applySectionBg(_this, li, args, argsSave);

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     * 
     * @private
     */ 
    , _applySectionBg: function(_this, li, args, argsSave) {
        args.image = builder.replaceQuotes(args.image) + '?t=' + Date.now();
        if (li.classList.contains('nav')) {
            var style = li.querySelector('style');
            var i = 0;
            while(li.children[i].nodeName !== 'STYLE') {
                if (i === 0) {
                    var section = li.children[i].querySelector('.nav-bg');
                    var bgStyleSelectorGradient = '#' + li.children[i].id + ' \.nav-bg';
                } else {
                    var section = li.children[i];
                    var bgStyleSelectorGradient = section.id ? '#' + section.id : '\.off-canvas-overlay';
                }
                var patternGradient = new RegExp('(' + bgStyleSelectorGradient + ' ?\{)([^\}]*)(\})', 'im');
                _this._applyGradientForNavbar(_this, li, args, style, patternGradient, bgStyleSelectorGradient, section);
                i++;
            }
            
            var dropDown = li.querySelectorAll('#navbar ul.nav ul');
            if (dropDown) {
                Array.prototype.forEach.call(dropDown, function(el){
                    var bgStyleSelectorGradient = '#' + li.children[0].id + ' ul\.nav ul';
                    var patternGradient = new RegExp('(' + bgStyleSelectorGradient + ' ?\{)([^\}]*)(\})', 'im');
                    _this._applyGradientForNavbarDropDown(_this, li, args, style, patternGradient, bgStyleSelectorGradient, el);
                });
            }

            var bgStyleSelector = '.nav-bg';
            var pattern = new RegExp('(' + bgStyleSelector + ' ?\{)([^\}]*)(\})', 'im');

            if (style.innerHTML.search(pattern) !== -1) {
                style.innerHTML = style.innerHTML.replace(pattern, '$1'
                    + '$2\topacity: ' + args.range + ';\n$3');
            } else {
                style.innerHTML = bgStyleSelector + ' {\n '
                    + '\topacity: ' + args.range + ';\n'
                    + '}'
                    + style.innerHTML;
            }
        } else {
            var section = li.children[0];
            var bg = section.querySelector('.bg');
            var style = li.querySelector('style');
            var script = li.querySelector('script');
            var bgStyleSelector = '#' + li.children[0].id + ' .bg';
            var bgStyleSelectorGradient = '#' + li.children[0].id;

            var pattern = new RegExp('(' + bgStyleSelector + ' ?\{)([^\}]*)(\})', 'im');
            var patternGradient = new RegExp('(' + bgStyleSelectorGradient + ' ?\{)([^\}]*)(\})', 'im');

            if (args.radio === 'image-background') {
                if (bg.classList.contains('bg-video')) {
                    bg.classList.remove('bg-video');
                    delete bg.dataset.videBg;
                    delete bg.dataset.videOptions;
                    if ($(bg).data('vide'))
                        $(bg).data('vide').destroy();
                    script.innerHTML = script.innerHTML.replace(/\/\/delete[\s\S]*\/\/deleteend/i, '');
                }

                var bgOptionSize = args.bgStyle;
                if (args.bgStyle === 'custom_(width_x_height)') {
                    var bgWidth = args.bgWidth.match(/([0-9]*?(?:px|%)|auto)/i)
                        ? args.bgWidth.match(/([0-9]*?(?:px|%)|auto)/i)[1] : 'auto';
                    var bgHeight = args.bgHeight.match(/([0-9]*?(?:px|%)|auto)/i)
                        ? args.bgHeight.match(/([0-9]*?(?:px|%)|auto)/i)[1] : 'auto';
                    bgOptionSize = bgWidth + ' ' + bgHeight;
                }
                var bgOptionRepeat = 'no-repeat';
                if (args.bgRepeat !== 'none') {
                    bgOptionRepeat = args.bgRepeat.replace(/_/g, '-');
                }
                var position = args.bgPTB + ' ' + args.bgPLR;

                if (style.innerHTML.search(pattern) !== -1) {
                    style.innerHTML = style.innerHTML.replace(pattern, '$1'
                        + _this._getSectionBgStyle(args.image, bgOptionSize, bgOptionRepeat, args.range, position)
                        + '$3');
                } else {
                    style.innerHTML = '\n' + bgStyleSelector + ' {'
                        + _this._getSectionBgStyle(args.image, bgOptionSize, bgOptionRepeat, args.range, position)
                        + '}\n'
                        + li.children[1].innerHTML;
                }
            } else if (args.radio === 'video-background') {
                if (style.innerHTML.search(pattern) !== -1) {
                    style.innerHTML = style.innerHTML.replace(pattern, '$1'
                        + '\n\topacity: ' + args.range + ';\n'
                        + '$3');
                } else {
                    style.innerHTML = '\n' + bgStyleSelector + ' {'
                        + '\n\topacity: ' + args.range + ';\n'
                        + '}\n'
                        + li.children[1].innerHTML;
                }

                if (!bg.classList.contains('bg-video')) {
                    bg.classList.add('bg-video');
                    script.innerHTML += '//delete\nvide_run();\n//deleteend';
                } else if ($(bg).data('vide')) {
                    $(bg).data('vide').destroy();
                } else {
                    bg.innerHTML = '';
                }
                bg.dataset.videBg = 'mp4: ' + args.bgMp4.slice(2) + ', ogv: '
                    + args.bgOgv.slice(2) + ', jpg: ' + args.bgPoster.slice(2);
                bg.dataset.videOptions = 'posterType: jpg';
                $(bg).vide({
                    mp4: args.bgMp4.slice(2),
                    ogv: args.bgOgv.slice(2),
                    poster: args.bgPoster.slice(2)
                }, {posterType: 'jpg'});
            } else {
                if (style.innerHTML.search(pattern) !== -1) {
                    style.innerHTML = style.innerHTML.replace(pattern, '');
                }

                if (bg.classList.contains('bg-video')) {
                    bg.classList.remove('bg-video');
                    if ($(bg).data('vide'))
                        $(bg).data('vide').destroy();
                    delete bg.dataset.videBg;
                    delete bg.dataset.videOptions;
                    script.innerHTML = script.innerHTML.replace(/\/\/delete[\s\S]*\/\/deleteend/i, '');
                }
            }


            if (args.parallax) {
                if (!li.classList.contains('parallax')) {
                    li.classList.add('parallax');

                    if (!bg.classList.contains('parallax-bg')) {
                        bg.classList.add('parallax-bg');
                    }
                    bg.dataset.topBottom = 'transform:translate3d(0px, 25%, 0px)';
                    bg.dataset.bottomTop = 'transform:translate3d(0px, -25%, 0px)';
                    if (skr) {
                        skr.refresh();
                    }
                }
            } else {
                if (li.classList.contains('parallax')) {
                    li.classList.remove('parallax');
                    bg.removeAttribute('style');
                    delete bg.dataset.topBottom;
                    delete bg.dataset.bottomTop;
                    bg.classList.remove('skrollable');
                    bg.classList.remove('skrollable-between');
                    bg.classList.remove('parallax-bg');
                    if (skr) skr.refresh();
                }
            }

            _this._applyGradientForNavbar(_this, li, args, style, patternGradient, bgStyleSelectorGradient, section);
        }
        builder.setStep(function () {
            _this._applySectionBg(_this, li, argsSave, args);
        });
    }
    /**
     *
     * @private
     */
    , _applyGradientForNavbar: function(_this, li, args, style, patternGradient, bgStyleSelectorGradient, section) {
        var gradient = '';
        switch (args.bgColor) {
            case 'solid color':
                gradient = args.bgColor1;
                break;
            case 'radial gradient':
                gradient = 'radial-gradient(circle, ' + args.bgColor1 + ' 30%, ' + args.bgColor2 + ' 70%)';
                break;
            case 'vertical gradient':
                gradient = 'linear-gradient(to bottom, ' + args.bgColor1 + ', ' + args.bgColor2 + ')';
                break;
            case 'horizontal gradient':
                gradient = 'linear-gradient(to right, ' + args.bgColor1 + ', ' + args.bgColor2 + ')';
                break;
            case 'angle gradient':
                gradient = 'linear-gradient(135deg, ' + args.bgColor1 + ', ' + args.bgColor2 + ')';
                break;
            case 'default color light':
            case 'default color dark':
            default :
                _this._chooseBgColor(args.bgColor.split(' '), section);
                style.innerHTML = style.innerHTML.replace(patternGradient, '');
                break;
        }

        if (style.innerHTML.search(patternGradient) !== -1 && gradient !== '') {
            style.innerHTML = style.innerHTML.replace(patternGradient, '$1'
                + '\n\tbackground: ' + gradient + ';\n'
                + '$3');
        } else if (gradient !== '') {
            style.innerHTML = '\n' + bgStyleSelectorGradient + ' {'
                + '\n\tbackground: ' + gradient + ';\n'
                + '}\n'
                + style.innerHTML;
        }
    }
    /**
     *
     * @private
     */
    , _applyGradientForNavbarDropDown: function(_this, li, args, style, patternGradient, bgStyleSelectorGradient, el) {
        var gradient = '';
        switch (args.bgColor) {
            case 'solid color':
                gradient = args.bgColor1;
                break;
            case 'radial gradient':
            case 'vertical gradient':
            case 'horizontal gradient':
            case 'angle gradient':
                gradient = args.bgColor2;
                break;
            case 'default color light':
            case 'default color dark':
            default :
                _this._chooseBgColor(args.bgColor.split(' '), el);
                style.innerHTML = style.innerHTML.replace(patternGradient, '');
                break;
        }

        if (style.innerHTML.search(patternGradient) !== -1 && gradient !== '') {
            style.innerHTML = style.innerHTML.replace(patternGradient, '$1'
                + '\n\tbackground: ' + gradient + ';\n'
                + '$3');
        } else if (gradient !== '') {
            style.innerHTML = '\n' + bgStyleSelectorGradient + ' {'
                + '\n\tbackground: ' + gradient + ';\n'
                + '}\n'
                + style.innerHTML;
        }
    }
    /**
     *
     * @private
     */
    , _setColor: function(_this, mode, bgColor1, bgColor2, cp, background) {
        switch (mode) {
            case 'solid color':
                background.style.background = bgColor1;
                if (!cp.classList.contains('one-cp')) {
                    cp.classList.add('one-cp');
                    cp.className = cp.className.replace(/\stwo-cp/i, '');
                }

                break;
            case 'radial gradient':
                background.style.background = 'radial-gradient(circle, ' + bgColor1 + ' 30%, ' + bgColor2 + ' 70%)';
                break;
            case 'vertical gradient':
                background.style.background = 'linear-gradient(to bottom, ' + bgColor1 + ', ' + bgColor2 + ')';
                break;
            case 'horizontal gradient':
                background.style.background = 'linear-gradient(to right, ' + bgColor1 + ', ' + bgColor2 + ')';
                break;
            case 'angle gradient':
                background.style.background = 'linear-gradient(135deg, ' + bgColor1 + ', ' + bgColor2 + ')';
                break;
            case 'default color light':
            case 'default color dark':
            default :
                background.style.removeProperty('background');
                var bgColor = mode.split(' ');

                _this._chooseBgColor(bgColor, background);

                cp.className = cp.className.replace(/\s(two-cp|one-cp)/i, '');
                break;
        }
    }
    /**
     *
     * @private
     */
    , _chengeCstmColor: function(c1, c2) {
        var background = this._elements.figure.querySelector('.bg-test');
        var bgElementColor = this._elements.BgColor.querySelector('button').dataset.value.toLowerCase();
        switch (bgElementColor) {
            case 'radial_gradient':
                background.style.background = 'radial-gradient(circle, ' + c1 + ' 30%, ' + c2 + ' 70%)';
                break;
            case 'vertical_gradient':
                background.style.background = 'linear-gradient(to bottom, ' + c1 + ', ' + c2 + ')';
                break;
            case 'horizontal_gradient':
                background.style.background = 'linear-gradient(to right, ' + c1 + ', ' + c2 + ')';
                break;
            case 'angle_gradient':
                background.style.background = 'linear-gradient(135deg, ' + c1 + ', ' + c2 + ')';
                break;
            case 'solid_color':
                background.style.background = c1;
                break;
        }
    }
    /**
     *
     * @private
     */
    , _chooseBgColor: function(bgColor, bg) {
        bg.className = bg.className.replace(/bg-.-color-(light|dark)/i, '');
        bg.classList.add('bg-1-color-' + bgColor[2]);
    }
    /**
     *
     * @private
     */
    , _getModalPopupBg: function (_this) {
        var li = this._targetObject;
        var bgStyleSelector = '#' + li.children[0].id + ' .bg';
        var section = li.children[0];
        var classParallax = '';

        //for popups
        if (controls.findParent(li, ['modal-dialog'])) {
            li = builder.editingSectionForm;
            var popup = controls.findParent(this._targetObject, ['modal']);
            bgStyleSelector = '#' + popup.id + ' .bg';
            section = this._targetObject;
            classParallax = 'hide';
        }
        this._title.innerHTML = '<h4>Background settings</h4>';

        this._elements = null;


        var style = li.querySelector('style').innerHTML;

        var bgStyleColor = '';
        var classBg = section.className.match('bg-([0-9]{1})-color-(light|dark)');
        if (classBg) {
            bgStyleColor = 'Default color ' + classBg[2];
        } else {
            bgStyleColor = 'Default color light';
        }

        var patternStyleSize = new RegExp(bgStyleSelector + '\\s?\{[ \\n\\t\\ra-z0-9:()\'\\/.;_-]*background-size:\\s*([^;]*);', 'im');
        var bgOptions = style.match(patternStyleSize);
        var patternStyleRepeat = new RegExp(bgStyleSelector + '\\s?\{[ \\n\\t\\ra-z0-9:()\'\\/.;_-]*background-repeat:\\s*([^;]*);', 'im');
        var repeat = style.match(patternStyleRepeat);

        _this._constructModalBody([
                {
                    name: 'inputImage'
                    , func: 'inputImage'
                    , args: {
                    title: 'Background path'
                    , elClass: 'col-sm-10 col-md-10 col-lg-10'
                    , type: 'normal'
                }
                }
                , {
                    name: 'BgStyle'

                    , func: 'dropDown'
                    , args: {
                        menu: ['cover', 'auto', 'contain', 'repeat']
                        , title: 'Background style:'
                        , elClass: 'col-sm-10 col-md-10 col-lg-10'
                        , callback: function() {
                            if (repeat && repeat[1] === 'repeat') {
                                return repeat[1];
                            }
                            return  bgOptions ? bgOptions[1] : 'Auto';
                        }
                    }
                }
                , {
                    name: 'BgColor'
                    , func: 'dropDown'
                    , args: {
                        menu: [
                            'Default color light'
                            , 'Default color dark'
                        ]
                        , title: 'Background color:'
                        , elClass: 'col-sm-10 col-md-10 col-lg-10'
                        , callback: function() {
                            return  bgStyleColor;
                        }
                    }
                },
                {
                    name: 'parallax'
                    , func: 'switch'
                    , args: {
                    title: 'Parallax'
                    , type: ''
                    , checked: li.classList.contains('parallax')
                    , elClass: classParallax
                    , callback: function (sw) {
                        sw.querySelector('.switch').addEventListener('click', function (e) {
                            e.preventDefault();
                            if (this.classList.contains('switch-on')) {
                                this.classList.remove('switch-on');
                                this.classList.add('switch-off');
                                this.querySelector('input').removeAttribute('checked');
                            } else {
                                this.classList.remove('switch-off');
                                this.classList.add('switch-on');
                                this.querySelector('input').setAttribute('checked', '');
                            }
                        });
                    }
                }
                }
            ], 'col-sm-6 col-md-6 col-lg-6 nopadding'
        );

        var patternOpacity = new RegExp(bgStyleSelector + '\\s*{[ \\n\\t\\ra-z0-9:()\'\\/.;_-]*opacity:\\s*([^;]*)', 'im');
        var opacity = style.match(patternOpacity);

        _this._constructModalBody([
                {
                    name: 'figure'
                    , func: 'figure'
                    , args: {
                    callback: function() {
                        return _this._elements.inputImage;
                    }
                    , section: section
                    , sizeAuto: !bgOptions || (bgOptions && bgOptions[1] === 'auto')
                }
                }
                , {
                    name: 'inputRange'
                    , func: 'inputRange'
                    , args: {
                        opacity: function() {
                            return opacity ? opacity[1] : 1;
                        }
                    }
                }

            ], 'col-sm-6 col-md-6 col-lg-6 nopadding preview-bg'
        );

        var img = _this._elements.figure.querySelector('img');
        var divImg = _this._elements.figure.querySelector('.img');
        divImg.style.display = 'block';

        $(_this._selfDOM).on('shown.bs.modal', function() {
            var widthSection = section.getBoundingClientRect().width;
            var widthModal = _this._elements.figure.getBoundingClientRect().width;
            var percentWidth =  Math.round(widthModal / widthSection * 100);
            var heightSection = section.getBoundingClientRect().height;
            var heightModal = heightSection * (percentWidth/100);
            var wrap = _this._elements.figure.querySelector('.wrap-hover');
            wrap.style.height = heightModal + 'px';
        });

        var patternImage = new RegExp(bgStyleSelector + ' ?\{[ \\n\\t\\ra-z0-9:()\'\\/.;_-]*background-image:\\s*url\\(\'?/?([^\']*)\'?\\);', 'im');

        var src = (style.match(patternImage) && style.match(patternImage)[1] !== '') ? style.match(patternImage)[1] : '';

        _this._elements.inputImage.querySelector('input').value = clearTimeStamp(src);

        if (src !== '') {
            img.src = src;
            divImg.style.backgroundImage = 'url(\'' + src + '\')';
        }

        if (repeat && repeat[1] === 'repeat') {
            divImg.style.backgroundRepeat = 'repeat';
            divImg.style.webkitBackgroundRepeat = 'repeat';
        } else {
            divImg.style.backgroundRepeat = 'no-repeat';
            divImg.style.webkitBackgroundRepeat = 'no-repeat';
        }
        if (bgOptions && bgOptions[1] !== 'auto') {
            divImg.style.backgroundSize = bgOptions[1];
            divImg.style.webkitBackgroundSize = bgOptions[1];
        }

        var bgStyle = _this._elements.BgStyle;
        bgStyle.addEventListener('supra.check.select', function (e) {
            if (e.detail.toLowerCase() === 'repeat') {
                divImg.style.backgroundRepeat = 'repeat';
                divImg.style.webkitBackgroundRepeat = 'repeat';
            } else {
                divImg.style.backgroundRepeat = 'no-repeat';
                divImg.style.webkitBackgroundRepeat = 'no-repeat';
            }
            if (e.detail.toLowerCase() === 'auto' || e.detail.toLowerCase() === 'repeat') {
                divImg.style.backgroundSize = divImg.dataset.percent + '% auto';
                divImg.style.webkitBackgroundSize = divImg.dataset.percent + '% auto';
            } else {
                divImg.style.backgroundSize = e.detail.toLowerCase();
                divImg.style.webkitBackgroundSize = e.detail.toLowerCase();
            }
        });

        divImg.style.opacity = opacity ? opacity[1] : 1;

        var range = _this._elements.inputRange.querySelector('input');
        range.addEventListener('input', function () {
            divImg.style.opacity = this.value / 100;
        });



        var background = this._elements.figure.querySelector('.bg-test');
        var bgClassName = section.className.match(/bg-.-color-(light|dark)/i);
        if (bgClassName) background.classList.add(bgClassName[0]);
        var bgElementColor = _this._elements.BgColor;
        bgElementColor.addEventListener('supra.check.select', function(e) {
            var bgColor = e.detail.toLowerCase().split(' ');

            _this._chooseBgColor(bgColor, background);
        });

        var argsSave = {
            image: _this._elements.inputImage ? _this._elements.inputImage.querySelector('input').value : ''
            , bgColor: _this._elements.BgColor.querySelector('button').dataset.value.toLowerCase().split('_')
            , bgStyle: _this._elements.BgStyle ? _this._elements.BgStyle.querySelector('.dropdown button').dataset.value.toLowerCase() : ''
            , parallax: _this._elements.parallax ? _this._elements.parallax.querySelector('input').checked : ''
            , range: _this._elements.inputRange.querySelector('input').value / 100
        };

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {
            var args = {
                image: _this._elements.inputImage ? _this._elements.inputImage.querySelector('input').value : ''
                , bgColor: _this._elements.BgColor.querySelector('button').dataset.value.toLowerCase().split('_')
                , bgStyle: _this._elements.BgStyle ? _this._elements.BgStyle.querySelector('.dropdown button').dataset.value.toLowerCase() : ''
                , parallax: _this._elements.parallax ? _this._elements.parallax.querySelector('input').checked : ''
                , range: _this._elements.inputRange.querySelector('input').value / 100
            };

            _this._applyPopupBg(_this, li, args, argsSave);

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     *
     * @private
     */
    , _applyPopupBg: function(_this, li, args, argsSave) {
        args.image = builder.replaceQuotes(args.image)  + '?t=' + Date.now();
        var bgStyleSelector = '#' + li.children[0].id + ' .bg';
        var section = li.children[0];
        if (controls.findParent(this._targetObject, ['modal-dialog'])) {
            var popup = controls.findParent(this._targetObject, ['modal']);
            bgStyleSelector = '#' + popup.id + ' .bg';
            section = this._targetObject;

        }
        var pattern = new RegExp('(' + bgStyleSelector + ' ?\{)([^\}]*)(\})', 'im');
        var bgOptionSize = args.bgStyle;
        var bgOptionRepeat = 'no-repeat';
        if (args.bgStyle === 'repeat') {
            bgOptionSize = 'auto';
            bgOptionRepeat = args.bgStyle;
        }
        var style = li.querySelector('style');

        if (style.innerHTML.search(pattern) !== -1) {
            style.innerHTML = style.innerHTML.replace(pattern, '$1'
                + _this._getBgStyle(args.image, bgOptionSize, bgOptionRepeat, args.range)
                + '$3');
        } else {
            style.innerHTML = '\n' + bgStyleSelector + ' {'
                + _this._getBgStyle(args.image, bgOptionSize, bgOptionRepeat, args.range)
                + '}\n'
                + li.children[1].innerHTML;
        }

        _this._chooseBgColor(args.bgColor, section);
        var bg = section.querySelector('.bg');

        if (args.parallax) {
            if (!li.classList.contains('parallax')) {
                li.classList.add('parallax');

                if (!bg.classList.contains('parallax-bg')) {
                    bg.classList.add('parallax-bg');
                }
                bg.dataset.topBottom = 'transform:translate3d(0px, 25%, 0px)';
                bg.dataset.bottomTop = 'transform:translate3d(0px, -25%, 0px)';
                if (skr) {
                    skr.refresh();
                }
            }
        } else {
            if (li.classList.contains('parallax')) {
                li.classList.remove('parallax');
                bg.removeAttribute('style');
                for (var indx in bg.dataset) {
                    delete bg.dataset[indx];
                }
                bg.classList.remove('skrollable');
                bg.classList.remove('skrollable-between');
                bg.classList.remove('parallax-bg');
                if (skr) skr.refresh();
            }
        }
        builder.setStep(function () {
            _this._applySectionBg(_this, li, argsSave, args);
        });
    }
    /**
     * 
     * @private
     */ 
    , _getModalSectionSettings: function (_this) {
        var li = _this._targetObject;
        var section = li.children[0];

        this._title.innerHTML = '<h4>Section settings</h4>';

        this._elements = null;

        _this._constructModalBody([
                {
                    name: 'PadTop'
                    , func: 'dropDown'
                    , args: {
                    menu: ['0px', '25px', '50px', '75px', '100px', '125px', '150px', '200px', '250px', '300px', '350px', '400px']
                    , title: 'Padding top:'
                    , elClass: 'col-sm-12 col-md-12 col-lg-12'
                    , callback: function() {
                        var section = _this._targetObject.children[0];
                        var cNameTop = section.className.match(/pt-([^ ]*)/i);
                        return  cNameTop ? cNameTop[1] + 'px' : '0px';
                    }
                }
                }
                , {
                    name: 'PadBottom'
                    , func: 'dropDown'
                    , args: {
                        menu: ['0px', '25px', '50px', '75px', '100px', '125px', '150px', '200px', '250px', '300px', '350px', '400px']
                        , title: 'Padding bottom:'
                        , elClass: 'col-sm-12 col-md-12 col-lg-12'
                        , callback: function() {
                            var section = _this._targetObject.children[0];
                            var cNameBottom = section.className.match(/pb-([^ ]*)/i);
                            return  cNameBottom ? cNameBottom[1] + 'px' : '0px';
                        }
                    }
                }
            ], 'col-sm-6 col-md-6 col-lg-6 section-set-dropdown'
        );

        var skin = false;
        if (section.classList.contains('dark')) {
            skin = true;
        }

        var separator = false;
        if (section.classList.contains('separator-bottom')) {
            separator = true;
        }

        _this._constructModalBody([
            {
                name: 'separator'
                , func: 'dropDown'
                , args: {
                    title: 'Separator:'
                    , menu: ['None', 'Content width', 'Screen width']
                    , elClass: 'separator'
                    , callback: function() {
                        if (section.className.search(/sep-/) !== -1) {
                            var classSep = section.className.match(/sep-[^\s]*/);
                            if (classSep[0] === 'sep-b') {
                                return 'content width';
                            } else {
                                return 'screen width';
                            }
                        }
                        return 'none';
                    }
                }
            }
            , {
                name: 'skin'
                , func: 'switch'
                , args: {
                    title: 'Dark skin:'
                    , type: ''
                    , checked: skin
                    , callback: function(sw) {
                        sw.querySelector('.switch').addEventListener('click', function(e) {
                            e.preventDefault();
                            if (this.classList.contains('switch-on')) {
                                this.classList.remove('switch-on');
                                this.classList.add('switch-off');
                                this.querySelector('input').removeAttribute('checked');
                            } else {
                                this.classList.remove('switch-off');
                                this.classList.add('switch-on');
                                this.querySelector('input').setAttribute('checked' , '');
                            }
                        });
                    }
                }
            }

            ], 'col-sm-6 col-md-6 col-lg-6 nopadding section-settings'
        );

        var argsSave = {
            paddingTop: _this._elements.PadTop.querySelector('button').dataset.value
            , paddingBottom: _this._elements.PadBottom.querySelector('button').dataset.value
            , skin: _this._elements.skin.querySelector('input').checked
            , separator: _this._elements.separator.querySelector('.dropdown button').dataset.value.replace(/_/i, ' ')
        };

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {
            var args = {
                paddingTop: _this._elements.PadTop.querySelector('button').dataset.value
                , paddingBottom: _this._elements.PadBottom.querySelector('button').dataset.value
                , skin: _this._elements.skin.querySelector('input').checked
                , separator: _this._elements.separator.querySelector('.dropdown button').dataset.value.replace(/_/i, ' ')
            };

            _this._applySectionSettings(_this, li, args, argsSave);

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     * 
     * @private
     */ 
    , _applySectionSettings: function(_this, li, args, argsSave) {
        var section = li.children[0];
        var cNameTop = section.className.match(/pt-[^ ]*/i);
        var cNameBottom = section.className.match(/pb-[^ ]*/i);
        if (cNameTop && cNameTop[0] !== undefined) {
            section.classList.remove(cNameTop[0]);
        }
        section.classList.add('pt-' + args.paddingTop.substr(0, args.paddingTop.length-2));


        if (cNameBottom && cNameBottom[0] !== undefined) {
            section.classList.remove(cNameBottom[0]);
        }
        section.classList.add('pb-' + args.paddingBottom.substr(0, args.paddingBottom.length-2));

        if (li.style.position === 'fixed') {
            setTimeout(function() {
                li.style.height = li.children[0].getBoundingClientRect().height + 'px';
            },600);
        }
        var i = 0;
        while (li.children[i].nodeName !== 'STYLE') {
            _this._skinCheck(_this, args.skin, li.children[i], 'light', 'dark',' light|^light', ' dark|^dark');
            i++;
        }

        var form = li.querySelector('form');
        if (form) {
            var success = document.getElementById(section.id + '-success');
            var error = document.getElementById(section.id + '-error');
            if (success) {
                _this._skinCheck(_this, args.skin, success, 'light', 'dark',' light|^light', ' dark|^dark');
            }

            if (error) {
                _this._skinCheck(_this, args.skin, error, 'light', 'dark',' light|^light', ' dark|^dark');
            }

        }

        if (args.separator) {
            if (section.className.search(/sep-/) !== -1) {
                var classSep = section.className.match(/sep-[^\s]*/);
                section.classList.remove(classSep[0]);
            }
            if (args.separator === 'content width') {
                section.classList.add('sep-b');
            } else if (args.separator === 'screen width') {
                section.classList.add('sep-full-b');
            }
        }

        builder.setStep(function () {
            _this._applySectionSettings(_this, li, argsSave, args);
        });
    }
    /**
     * 
     * @private
     */ 
    , _getModalNavSectionSettings: function (_this) {
        var li = _this._targetObject;
        var section = li.children[0];

        this._title.innerHTML = '<h4>Navigation settings</h4>';

        this._elements = null;

        var skin = false;
        if (section.classList.contains('dark')) {
            skin = true;
        }

        _this._constructModalBody([
                {
                    name: 'type'
                    , func: 'dropDown'
                    , args: {
                    title: 'Type:'
                    , menu: [
                          'Default'
                        , 'Absolute'
                        , 'Absolute - double padding'
                        , 'Fixed'
                        , 'Fixed - slide start'
                        , 'Fixed - transperent start'
                        , 'Fixed - transparent and double padding start'
                    ]
                    , elClass: 'col-sm-12 col-md-10 col-lg-10'
                    , callback: function() {
                        var patternNavbar = new RegExp('navbar-[^\\s]*[\\s]*' , 'ig');
                        var patternNav = new RegExp('nav-[^\\s]*[\\s]*' , 'ig');
                        var matchNavbar = section.className.match(patternNavbar);
                        var matchNav = section.className.match(patternNav);
                        if (matchNavbar) {
                            switch (matchNavbar[0].trim()) {
                                case 'navbar-absolute-top':
                                    if (!matchNav) {
                                        return 'absolute';
                                    } else if (matchNav[0].trim() === 'nav-start-double-pad') {
                                        return 'absolute - double padding';
                                    }
                                    break;
                                case 'navbar-fixed-top':
                                    if (!matchNav) {
                                        return 'fixed';
                                    } else if (matchNav[0].trim() === 'nav-start-hide') {
                                        return 'fixed - slide start';
                                    } else if (matchNav[0].trim() === 'nav-start-hide-bg') {
                                        if (matchNav[1] && matchNav[1].trim() === 'nav-start-double-pad') {
                                            return 'fixed - transparent and double padding start';
                                        }
                                        return 'fixed - transperent start';
                                    }
                                    break;
                            }
                        }
                        return 'default';
                    }
                }
                }
                , {
                    name: 'skin'
                    , func: 'switch'
                    , args: {
                        title: 'Dark skin:'
                        , type: ''
                        , checked: skin
                        , callback: function(sw) {
                            sw.querySelector('.switch').addEventListener('click', function(e) {
                                e.preventDefault();
                                if (this.classList.contains('switch-on')) {
                                    this.classList.remove('switch-on');
                                    this.classList.add('switch-off');
                                    this.querySelector('input').removeAttribute('checked');
                                } else {
                                    this.classList.remove('switch-off');
                                    this.classList.add('switch-on');
                                    this.querySelector('input').setAttribute('checked' , '');
                                }
                            });
                        }
                    }
                }

            ], 'col-sm-12 col-md-12 col-lg-12 nopadding item-width-50 item-margin-top-0'
        );

        var argsSave = {
              skin: _this._elements.skin.querySelector('input').checked
            , type: _this._elements.type.querySelector('.dropdown button').dataset.value.replace(/_/ig, ' ')
        };

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {
            var args = {
                skin: _this._elements.skin.querySelector('input').checked
                , type: _this._elements.type.querySelector('.dropdown button').dataset.value.replace(/_/ig, ' ')
            };

            _this._applyNavSectionSettings(_this, li, args, argsSave);

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     * 
     * @private
     */ 
    , _applyNavSectionSettings: function(_this, li, args, argsSave) {
        var section = li.children[0];

        var i = 0;
        while (li.children[i].nodeName !== 'STYLE') {
            _this._skinCheck(_this, args.skin, li.children[i], 'light', 'dark',' light|^light', ' dark|^dark');
            i++;
        }

        if (args.type) {
            var triggerScroll = false;
            window.removeEventListener('scroll', builder.listenerSrcollTopForNav);
            section.style.transition = 'all 0s ease 0s';
            var patternNavbar = new RegExp('navbar-[^\\s]*[\\s]*' , 'ig');
            var patternNav = new RegExp('nav-[^\\s]*[\\s]*' , 'ig');
            section.className = section.className.replace(patternNavbar, '').trim();
            section.className = section.className.replace(patternNav, '').trim();
            switch (args.type) {
                case 'absolute':
                    section.className = section.className + ' navbar-absolute-top';
                    break;
                case 'absolute - double padding':
                    section.className = section.className + ' navbar-absolute-top nav-start-double-pad';
                    break;
                case 'fixed':
                    section.className = section.className + ' navbar-fixed-top';
                    break;
                case 'fixed - slide start':
                    section.className = section.className + ' navbar-fixed-top nav-start-hide';
                    break;
                case 'fixed - transperent start':
                    section.className = section.className + ' navbar-fixed-top nav-start-hide-bg';
                    break;
                case 'fixed - transparent and double padding start':
                    section.className = section.className + ' navbar-fixed-top nav-start-hide-bg nav-start-double-pad';
                    triggerScroll = true;
                    window.section = section;
                    break;
            }
            var position = window.getComputedStyle(section, null).getPropertyValue("position");

            li.removeAttribute('style');
            builder.setPosition(section, li, position, 1095);

            if (args.type === 'absolute' || args.type === 'absolute - double padding') {
                li.style.left = '50px';
            }

            var k = 1;

            if (section.className.search(/nav-start-double-pad/) !== -1) k = 3;
            var heightLi = section.getBoundingClientRect().height * k;
            li.style.height = heightLi + 'px';

            setTimeout(function(){
                section.style.removeProperty('transition');
            }, 100);

            if (triggerScroll) {
                window.addEventListener('scroll', builder.listenerSrcollTopForNav);
            }
        }

        builder.setStep(function () {
            _this._applyNavSectionSettings(_this, li, argsSave, args);
        });
    }
    /**
     * 
     * @private
     */ 
    , _skinCheck: function(_this, skin, element, light, dark, pLight, pDark) {
        pLight = pLight || light;
        pDark = pDark || dark;
        if (element.tagName === 'NAV' && light !== 'light') element = element.querySelector('.nav-bg');
        if (skin) {
            if (element.className.search(RegExp(pLight, 'i')) !== -1) {
                element.className = element.className.replace(RegExp(pLight + '\\s*', 'i'), ' ');
            }
            element.classList.add(dark);
        } else {
            if (element.className.search(RegExp(pDark, 'i')) !== -1) {
                element.className = element.className.replace(RegExp(pDark + '\\s*', 'i'), ' ');
            }
            element.classList.add(light);
        }
    }
    /**
     * This function called from this._inputImage()
     * @private
     */ 
    , _getModalGallery: function (_this) {
        this._title.innerHTML = '<h4>Choose image</h4>';
        this._title.appendChild(this._upload(_this));
        this._elementsGallery = null;

        var form = new FormData();
        form.append('type', this._targetObject.type);
        builder.ajax(form, 'getgallery', function(data) {
            data = JSON.parse(data);
            _this._constructModalBody([
                    {
                        name: 'gallery'
                        , func: 'galleryItems'
                        , args: {data: data.gallery, className: 'gallery'}
                    }
                ], 'col-sm-12 col-md-12 col-lg-12 nopadding'
            );
            _this._elementsGallery = data.gallery;
        });

        var modalPreloader = _this._targetObject.parentModal._selfDOM.querySelector('.modal-preloader');
        modalPreloader.classList.toggle('active');

        var modalG = $(_this._selfDOM).modal('show');

        modalG.on('shown.bs.modal', function(){
            modalPreloader.classList.toggle('active');
            var body = _this._body;
            var nameFile = _this._targetObject.targetElement.querySelector('input').value;
            var nameId = /images.*\/[^./]+\./i.test(nameFile) ? nameFile.match(/images.*\/([^./]+)\./i)[1].toLowerCase() : '';
            if (nameId !== '') {

                var choosenEelement = body.querySelector('[data-id=' + nameId + ']');
                if (choosenEelement) {
                    builder.selection(choosenEelement);
                    var gallery = body.querySelector('.item.gallery');
                    var scrollTopBody = body.scrollTop;
                    var positionTopBody = body.getBoundingClientRect().top;
                    var positionChEl = choosenEelement.getBoundingClientRect().top;

                    body.scrollTop = scrollTopBody + positionChEl - positionTopBody;
                }
            }
        });

        this._body.classList.add('height-500');

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {
            if (_this._elements.gallery.getElementsByClassName('active')) {
                var modal = _this._targetObject;
                var selectedImg = _this._elements.gallery.getElementsByClassName('active')[0];
                if (selectedImg) {
                    var src = selectedImg.dataset.src;
                    var postfix = '';
                    if (modal.targetElement.classList.contains('retina')) {
                        postfix += ' 2x';
                    } else {
                        var retinaInput = modal.targetElement.parentElement.querySelector('.retina input.choice-images');
                        if (retinaInput && selectedImg.dataset.srcset) {
                            retinaInput.value =
                                selectedImg.dataset.srcset + ' 2x';
                        } else if (retinaInput) {
                            retinaInput.value = '';
                        }
                    }
                    modal.targetElement.querySelector('input').value = clearTimeStamp(src) + postfix;
                    var figure = modal.parentModal._elements.figure;
                    if (figure) {
                        var img = figure.querySelector('img');
                        var divImg = figure.querySelector('.img');

                        if (modal.targetElement.classList.contains('video')) {
                            var $video = $(figure).find('.bg-video');
                            var dataVide = $video.data('vide');
                            var mp4 = dataVide.path.mp4;
                            var ogv = dataVide.path.ogv;
                            $video.data('vide').destroy();
                            $video.vide({
                                mp4: mp4,
                                ogv: ogv,
                                poster: src.slice(2)
                            }, {posterType: 'jpg'});
                        } else {
                            img.src = src;
                            //if (selectedImg.dataset.srcset) {
                            //    img.setAttribute('srcset', selectedImg.dataset.srcset + ' 2x');
                            //} else {
                            //    img.removeAttribute('srcset');
                            //}
                            divImg.style.backgroundImage = 'url(\'' + src + '\')';
                        }
                    }
                }
            }

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);

    }
    /**
     *
     * @private
     */
    , _getModalGalleryVideo: function (_this) {
        this._title.innerHTML = '<h4>Choose video</h4>';
        var className = 'gallery-video';
        if (_this._targetObject.type === 'jpg') {
            this._title.innerHTML = '<h4>Choose poster</h4>';
            className = 'gallery';
        }
        this._title.appendChild(this._uploadVideo(_this, _this._targetObject.type));
        this._elementsGallery = null;

        var form = new FormData();
        form.append('data', _this._targetObject.type);
        builder.ajax(form, 'getgalleryvideo', function(data) {
            data = JSON.parse(data);
            _this._constructModalBody([
                    {
                        name: 'gallery'
                        , func: 'galleryItems'
                        , args: {data: data.gallery, className: className, type: _this._targetObject.type}
                    }
                ], 'col-sm-12 col-md-12 col-lg-12 nopadding'
            );
            _this._elementsGallery = data.gallery;
        });

        var modalPreloader = _this._targetObject.parentModal._selfDOM.querySelector('.modal-preloader');
        modalPreloader.classList.toggle('active');

        var modalG = $(_this._selfDOM).modal('show');

        modalG.on('shown.bs.modal', function(){
            modalPreloader.classList.toggle('active');

            var body = _this._body;
            var nameFile = _this._targetObject.targetElement.querySelector('input').value;
            var nameId = /video.*\/[^./]+\./i.test(nameFile) ? nameFile.match(/video.*\/([^./]+)\./i)[1].toLowerCase() : '';

            if (nameId !== '') {
                var choosenEelement = body.querySelector('[data-id=' + nameId + ']');
                if (choosenEelement) {
                    builder.selection(choosenEelement);
                    var gallery = body.querySelector('.item.gallery');
                    var scrollTopBody = body.scrollTop;
                    var positionTopBody = body.getBoundingClientRect().top;
                    var positionChEl = choosenEelement.getBoundingClientRect().top;

                    body.scrollTop = scrollTopBody + positionChEl - positionTopBody;
                }
            }
        });

        this._body.classList.add('height-500');

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {
            if (_this._elements.gallery.getElementsByClassName('active')) {
                var modal = _this._targetObject;
                var selectedVideo = _this._elements.gallery.getElementsByClassName('active')[0];
                if (selectedVideo) {
                    var src = selectedVideo.dataset.src;
                    var postfix = '';
                    modal.targetElement.querySelector('input').value = src + postfix;
                    var figure = modal.parentModal._elements.figure;
                    if (figure) {
                        var $video = $(figure).find('.bg-video');
                        var dataVide = $video.data('vide');
                        var mp4 = dataVide ? dataVide.path.mp4 : '';
                        var ogv = dataVide ? dataVide.path.ogv : '';
                        var poster = dataVide ? dataVide.path.poster : '';
                        if ($video.data('vide'))
                            $video.data('vide').destroy();
                        if (_this._targetObject.type === 'mp4') {
                            $video.vide({
                                mp4: src.slice(2),
                                ogv: ogv,
                                poster: poster
                            }, {posterType: 'jpg'});
                        } else if (_this._targetObject.type === 'ogv') {
                            $video.vide({
                                mp4: mp4,
                                ogv: src.slice(2),
                                poster: poster
                            }, {posterType: 'jpg'});
                        } else {
                            $video.vide({
                                mp4: mp4,
                                ogv: ogv,
                                poster: src.slice(2)
                            }, {posterType: 'jpg'});
                        }
                    }
                }
            }

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);

    }
    /**
     * 
     * @private
     */ 
    , _getModalIconsGallery: function (_this) {
        this._title.innerHTML = '<h4>Choose icon</h4>';
        this._elementsGallery = null;

        builder.ajax(null, 'geticonsgallery', function(data) {
            data = JSON.parse(data);
            _this._constructModalBody([
                    {
                        name: 'gallery'
                        , func: 'galleryItems'
                        , args: {data: data.iconsGallery[0], className: 'icons'}
                    }
                ], 'col-sm-12 col-md-12 col-lg-12 padding-top-10'
            );
            _this._elementsGallery = data.gallery;
            var icon = _this._targetObject;
            var body = _this._body;
            var nameId = /icon-(?!size|position)[^\s]+/i.test(icon.className) ? icon.className.match(/icon-(?!size|position)[^\s]+/i)[0].toLowerCase() : '';
            if (nameId !== '') {
                var choosenEelement = body.querySelector('.' + nameId);
                if (choosenEelement) {
                    choosenEelement = choosenEelement.parentElement;
                    builder.selection(choosenEelement);
                    var gallery = body.querySelector('.item.gallery');
                    var scrollTopBody = body.scrollTop;
                    var positionTopBody = body.getBoundingClientRect().top;
                    var positionChEl = choosenEelement.getBoundingClientRect().top;

                    body.scrollTop = scrollTopBody + positionChEl - positionTopBody - 10;
                }
            }
        });

        this._header.style.paddingBottom = '19px';
        this._body.classList.add('height-500');
        this._body.classList.add('margin-top--10');

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {
            if (_this._elements.gallery.getElementsByClassName('active')) {
                var icon = _this._targetObject;
                var newIconClass = _this._elements.gallery.querySelectorAll('.active i')[1].className;
                var className = icon.className;
                _this._applyIconsGallery(_this, icon, newIconClass, className);
            }

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     * 
     * @private
     */ 
    , _applyIconsGallery: function(_this, icon, newIconClass, className) {
        var pattern = new RegExp('icon-(?!size|position|color)[^ ]*','i');
        icon.className = className.replace(pattern, newIconClass);

        builder.setStep(function() {
            _this._applyIconsGallery(_this, icon, className, newIconClass);
        });
    }
    /**
     * 
     * @private
     */ 
    , _getModalDelete: function(_this) {
        _this._header.innerHTML = '<h5 class="text-center">Are you sure you want to delete this section?</h5>';
        _this._body.classList.add('nopadding');

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-danger', 'Delete', function() {
            var page = _this._targetObject.page;
            var section = _this._targetObject.section;

            page.deleteSection(section);

            if (AOS) AOS.refresh();

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     * 
     * @private
     */ 
    , _getModalDeleteElement: function(_this) {
        _this._header.innerHTML = '<h5 class="text-center">Are you sure you want to delete this element?</h5>';
        _this._body.classList.add('nopadding');

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-danger', 'Delete', function() {
            var DOMElement = _this._targetObject;

            builder.getActivePageObject().deleteElement(DOMElement);

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     * 
     * @private
     */ 
    , _getModalDeleteProject: function(_this) {
        _this._header.innerHTML = '<h5 class="text-center">If you start new project, current project will be deleted. Are you sure you want to start new project?</h5>';
        _this._body.classList.add('nopadding');

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-primary', 'Start new project', function() {

            builder.createNewProject();

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     * 
     * @private
     */ 
    , _getModalReplace: function(_this) {
        var page = _this._targetObject;
        var key = Object.keys(page.sections[builder.sectionClicked.dataset.group])[0];
        //var section = page.sections[builder.sectionClicked.dataset.group][key].html;
        var section = page.getDOMSelf().querySelector('#' + key).parentElement;

        var nameSection = 'footer';
        if (section.classList.contains('nav') && builder) {
            nameSection = 'header';
        }

        _this._header.innerHTML = '<h5 class="flex-center">You can add only one navigation per page.</h5>'
            + '<h5 class="flex-center">Do you want raplace ' + nameSection + '?</h5>';
        _this._body.classList.add('nopadding');

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-danger', 'Replace', function() {

            page.deleteSection(section, null, null, 'replace');
            if (document.body.classList.contains('off-canvas-active')) {
                document.body.classList.remove('off-canvas-active');
            }

            if (section.classList.contains('nav') && builder) {
                page.addSection(builder.sectionClicked, 'nav', builder.defaultStyleType);
            } else if (section.classList.contains('footer') && builder) {
                page.addSection(builder.sectionClicked, 'footer', builder.defaultStyleType);
            }

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     * 
     * @private
     */ 
    , _getModalButtonSettings: function(_this) {
        var button = _this._targetObject;

        this._title.innerHTML = '<h4>Button settings</h4>';

        this._elements = null;

        var patternDef = new RegExp('(\\.' + builder.defaultStyleType + '-modal .choice-element .btn-default [\\s\\t\\w#.-]*{[\\s\\n\\t]*)'
            + '.*[\\s\\n\\t]*border-color:\\s*([^;]*)[^}]*(})', 'im');
        var defColor = builder.modalContainerStyleHtml.innerHTML.match(patternDef);
        var classBgDefButton = defColor[2] === '#ffffff' ? 'dark' : '';
        var patternPrm = new RegExp('(\\.' + builder.defaultStyleType + '-modal .choice-element .btn-primary [\\s\\t\\w#.-]*{[\\s\\n\\t]*)'
            + '.*[\\s\\n\\t]*border-color:\\s*([^;]*)[^}]*(})', 'im');
        var prmColor = builder.modalContainerStyleHtml.innerHTML.match(patternPrm);
        var classBgPrimButton = prmColor[2] === '#ffffff' ? 'dark' : '';
        var arsButton = [
            {
                className: 'choice-element'
                , btnClass: 'btn-success'
            }
            , {
                className: 'choice-element ' + classBgPrimButton
                , btnClass: 'btn-primary'
            }
            , {
                className: 'choice-element'
                , btnClass: 'btn-danger'
            }
            , {
                className: 'choice-element'
                , btnClass: 'btn-warning'
            }
            , {
                className: 'choice-element'
                , btnClass: 'btn-info'
            }
            , {
                className: 'choice-element'
                , btnClass: 'btn-link'
            }
            , {
                className: 'choice-element ' + classBgDefButton
                , btnClass: 'btn-default'
            }
            , {
                className: 'choice-element'
                , btnClass: 'btn-image'
                , html: '<i class="icon-picture"></i><span>Image</span>'
            }
        ];

        arsButton.forEach(function(element) {
            var content = element.html || 'Text';
            var classImageBtn = element.btnClass === 'btn-image' ? ' flex-center flex-column' : '';
            element.html = '<div class="btn ' + element.btnClass + classImageBtn +'">' + content + '</div>';
            if (button.classList.contains(element.btnClass)) {
                element.className += ' choosen';
            }
        });
        
        if (button.classList.contains('btn-image')) {
            _this._body.classList.add('show-input-img');
        }

        _this._constructModalBody([
                {
                    name: 'button'
                    , func: 'choiceElement'
                    , args: {
                        buttons: arsButton
                        , callback: function() {
                            if (this.querySelector('.btn-image')) {
                                _this._body.classList.add('show-input-img');
                            } else {
                                if (_this._body.classList.contains('show-input-img')) {
                                    _this._body.classList.remove('show-input-img');
                                }
                            }
                        }
                    }

                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding btn-image-control margin-bottom--20'
        );

        _this._constructModalBody([
                {
                    name: 'size'
                    , func: 'dropDown'
                    , args: {
                        menu: ['Large', 'Default', 'Small', 'Extra small']
                        , title: 'Button size:'
                        , elClass: 'col-sm-11 col-md-11 col-lg-11'
                        , callback: function() {
                            if (button.className.search(/btn-lg/i) !== -1) {
                                return 'Large';
                            } else if (button.className.search(/btn-sm/i) !== -1) {
                                return 'Small';
                            } else if (button.className.search(/btn-xs/i) !== -1) {
                                return 'Extra small';
                            } else {
                                return 'Default';
                            }
                        }
                    }
                }
                , {
                    name: 'icons'
                    , func: 'dropDown'
                    , args: {
                        menu: ['none', 'Left side', 'Right side']
                        , title: 'Icon:'
                        , elClass: 'col-sm-11 col-md-11 col-lg-11'
                        , callback: function() {
                            if (button.firstChild.tagName === 'I') {
                                return 'left side';
                            } else if (button.lastChild.tagName === 'I') {
                                return 'right side';
                            } else {
                                return 'none';
                            }
                        }
                    }
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding btn-image-control hide-setting-btn-html'
        );

        _this._constructModalBody([
                {
                    name: 'inputImage'
                    , func: 'inputImage'
                    , args: {
                    title: 'Image path'
                    , elClass: 'col-sm-12 col-md-10 col-lg-10'
                    , type: 'normal'
                }
                }
                , {
                    name: 'inputImageRetina'
                    , func: 'inputImage'
                    , args: {
                        title: 'Retina image path'
                        , elClass: 'col-sm-12 col-md-10 col-lg-10 retina'
                        , type: 'retina'
                    }
                }
                , {
                    name: 'inputText'
                    , func: 'inputText'
                    , args: {
                        title: 'Image Alt'
                        , elClass: 'col-sm-12 col-md-10 col-lg-10'
                    }
                }
            ], 'col-sm-6 col-md-6 col-lg-6 nopadding pre-input-img height-240'
        );

        _this._constructModalBody([
                {
                    name: 'figure'
                    , func: 'figure'
                    , args: {
                    callback: function() {
                        return _this._elements.inputImage;
                    }
                }
                }
            ], 'col-sm-6 col-md-6 col-lg-6 nopadding pre-input-img height-240'
        );

        var image = button.querySelector('img');

        var inputImage = _this._elements.inputImage.querySelector('input');
        var inputRetina = _this._elements.inputImageRetina.querySelector('input');
        var inputRetinaBeforSetNewValue = '';
        var figure = _this._elements.figure.querySelector('img');

        if (inputImage) {
            inputImage.value = image ? clearTimeStamp(image.getAttribute('src')) : './images/apple-badge-small.png';
        }
        if (inputRetina) {
            inputRetina.value = image ? clearTimeStamp(image.getAttribute('srcset')) : '';
            inputRetinaBeforSetNewValue = inputRetina.value;
        }
        if (figure) {
            figure.src = image ? image.getAttribute('src') : './images/apple-badge-small.png';
            if (image && image.getAttribute('srcset'))
                figure.setAttribute('srcset', image.getAttribute('srcset'));
        }
        _this._elements.inputText.querySelector('input').value = image ? image.alt : '';

        //var className = '';

        //if (_this._elements.button.querySelector('.choosen .btn')) {
        //    className = _this._elements.button.querySelector('.choosen .btn').className;
        //}

        var className = button.className;

        var triggerIconsChange = false;
        var icons = _this._elements.icons;
        icons.addEventListener('supra.check.select', function (e) {
            triggerIconsChange = true;
        });

        var argsSave = {
            className: className
            , size: _this._elements.size.querySelector('.dropdown button').dataset.value.replace(/_/i, ' ').toLowerCase()
            , inputImage: inputImage.value
            , inputRetina: inputRetina.value
            , icons: _this._elements.icons.querySelector('.dropdown button').dataset.value.replace(/_/ig, ' ').toLowerCase()
            , contentSave: button.innerHTML
            , triggerIC: triggerIconsChange
        };

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {

            var chooseBtnPostfix = 'default';

            if (_this._elements.button.querySelector('.choosen .btn')) {
                chooseBtnPostfix = _this._elements.button.querySelector('.choosen .btn').className;
                chooseBtnPostfix = chooseBtnPostfix.match(/btn-(success|primary|danger|warning|info|link|default|image)/i)[1];
            }

            var className = button.className.replace(/btn-(success|primary|danger|warning|info|link|default|image)/i,
                'btn-' + chooseBtnPostfix);

            var args = {
                className: className.replace(/btn-(?:lg|sm|xs)/, '').trim()
                , size: _this._elements.size.querySelector('.dropdown button').dataset.value.replace(/_/ig, ' ').toLowerCase()
                , inputImage: inputImage.value
                , inputRetina: inputRetina.value
                , icons: _this._elements.icons.querySelector('.dropdown button').dataset.value.replace(/_/ig, ' ').toLowerCase()
                , contentSave: null
                , triggerIC: triggerIconsChange
            };

            _this._applyButtonSettings(_this, button, args, argsSave);

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     * 
     * @private
     */ 
    , _applyButtonSettings: function(_this, button, args, argsSave) {
        
        if (args.className.search(/btn-image/) !== -1) {
            var img = new Image();
            img.src = args.inputImage  + '?t=' + Date.now();
            img.className = 'spr-option-img-nosettings';
            img.setAttribute('srcset', args.inputRetina.replace(/\s2x/, '?t=' + Date.now() + ' 2x'));
            button.innerHTML = '';
            button.appendChild(img);
            args.className = 'btn btn-image';
        } else if (button.classList.contains('btn-image')) {
            var span = document.createElement('span');
            span.classList.add('spr-option-textedit');
            span.innerHTML = 'Text';
            button.innerHTML = '';
            button.appendChild(span);
        }
        
        if (args.className.search(/btn-image/) === -1) {
            switch (args.size) {
                case 'large':
                    args.className += ' btn-lg';
                    break;
                case 'small':
                    args.className += ' btn-sm';
                    break;
                case 'extra small':
                    args.className += ' btn-xs';
                    break;
            }
            if (args.contentSave) {
                button.innerHTML = args.contentSave;
            } else {
                if (args.triggerIC) {
                    var oldI = button.querySelector('i');
                    if (oldI) button.removeChild(oldI);
                    var i = document.createElement('i');
                    i.className = 'icon-plus-circle';
                    switch (args.icons) {
                        case 'left side':
                            i.className += ' icon-position-left icon-size-m';
                            var next = button.firstChild;
                            button.insertBefore(i, next);
                            break;
                        case 'right side':
                            i.className += ' icon-position-right icon-size-m';
                            button.appendChild(i);
                            break;
                    }
                }
            }
        }
        
        if (button.classList.contains('btn-block')) args.className += ' btn-block';
        
        button.className = args.className;

        builder.setStep(function () {
            _this._applyButtonSettings(_this, button, argsSave, args);
        });
    }
    /**
     * 
     * @private
     */ 
    , _getModalImageSettings: function(_this) {
        var image = _this._targetObject;
        if (image.nodeName.toLowerCase() !== 'img') {
            image = _this._targetObject.querySelector('img');
        }

        this._title.innerHTML = '<h4>Image settings</h4>';

        this._elements = null;

        _this._constructModalBody([
                {
                    name: 'inputImage'
                    , func: 'inputImage'
                    , args: {
                    title: 'Image path'
                    , elClass: 'col-sm-10 col-md-10 col-lg-10'
                    , type: 'normal'
                }
                }
                , {
                    name: 'inputImageRetina'
                    , func: 'inputImage'
                    , args: {
                        title: 'Retina image path'
                        , elClass: 'col-sm-10 col-md-10 col-lg-10 retina'
                        , type: 'retina'
                    }
                }
                , {
                    name: 'inputText'
                    , func: 'inputText'
                    , args: {
                        title: 'Image Alt'
                        , elClass: 'col-sm-10 col-md-10 col-lg-10'
                    }
                }
            ], 'col-sm-6 col-md-6 col-lg-6 nopadding'
        );

        _this._constructModalBody([
                {
                    name: 'figure'
                    , func: 'figure'
                    , args: {
                    callback: function() {
                        return _this._elements.inputImage;
                    }
                }
                }
            ], 'col-sm-6 col-md-6 col-lg-6 nopadding'
        );

        var inputImage = _this._elements.inputImage.querySelector('input');
        var inputRetina = _this._elements.inputImageRetina.querySelector('input');
        var inputRetinaBeforSetNewValue = '';
        var figure = _this._elements.figure.querySelector('img');

        if (inputImage) {
            inputImage.value = image.getAttribute('src');
        }
        if (inputRetina) {
            inputRetina.value = clearTimeStamp(image.getAttribute('srcset'));
            inputRetinaBeforSetNewValue = inputRetina.value;
        }
        if (figure) {
            figure.src = clearTimeStamp(image.getAttribute('src'));
        }
        _this._elements.inputText.querySelector('input').value = image.alt;

        var argsSave = {
            inputImage: builder.replaceQuotes(_this._elements.inputImage.querySelector('input').value)
            , inputRetina: builder.replaceQuotes(_this._elements.inputImageRetina.querySelector('input').value)
            , inputRetinaBeforSetNewValue: inputRetinaBeforSetNewValue
            , alt: _this._elements.inputText.querySelector('input').value
        };

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {
            var args = {
                inputImage: builder.replaceQuotes(_this._elements.inputImage.querySelector('input').value)
                , inputRetina: builder.replaceQuotes(_this._elements.inputImageRetina.querySelector('input').value)
                , inputRetinaBeforSetNewValue: inputRetinaBeforSetNewValue
                , alt: _this._elements.inputText.querySelector('input').value
            };

            _this._applyImageSettings(_this, image, args, argsSave);

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     * 
     * @private
     */ 
    , _applyImageSettings: function(_this, image, args, argsSave) {

        image.src = args.inputImage + '?t=' + Date.now();
        //TODO: check this condition
        //if (args.inputRetina !== '' && args.inputRetina !== args.inputRetinaBeforSetNewValue) {
        if (args.inputRetina !== '') {
            image.setAttribute('srcset', args.inputRetina.replace(/\s2x/, '?t=' + Date.now() + ' 2x'));
        } else {
            image.setAttribute('srcset', '');
        }
        image.alt = args.alt;

        //this necessary for gallery
        var owl = controls.findParent(_this._targetObject, ['spr-gallery']);
        if (owl) {
            $(owl).trigger('refresh.owl.carousel');
        }

        builder.setStep(function () {
            _this._applyImageSettings(_this, image, argsSave, args);
        });
    }
    /**
     * 
     * @private
     */ 
    , _getModalGMapSettings: function(_this) {
        this._title.innerHTML = '<h4>Map settings</h4>';

        this._elements = null;

        var script = _this._targetObject.script.innerHTML;
        var funcId = _this._targetObject.map.id.replace(/-/ig, '_');
        
        var contextStart = funcId + '\\([\\n\\s\\w\\/;:\'"#(){}\\[\\]\\|$@!?\\=+,.<>-]*';
        var contextEnd = '[\\n\\s\\w\\/;:\'"#(){}\\[\\]\\|$@!?\\=+,.<>-]*' + funcId + '\\(';

        var patternLatitude = new RegExp(contextStart + 'google\\.maps\\.LatLng\\(([^,]*)' + contextEnd, 'im');
        var currentLatitude = script.match(patternLatitude)[1];

        _this._constructModalBody([
                {
                    name: 'latitude'
                    , func: 'inputText'
                    , args: {
                        title: 'Latitude:'
                        , value: currentLatitude
                        , elClass: 'col-sm-11 col-md-11 col-lg-11'
                    }
                }
            ], 'col-sm-3 col-md-3 col-lg-3 nopadding'
        );

        var patternLongitude = new RegExp(contextStart + 'google\\.maps\\.LatLng\\([^,]*,\\s([^)]*)' + contextEnd, 'im');
        var currentLongitude = script.match(patternLongitude)[1];

        _this._constructModalBody([
                {
                    name: 'longitude'
                    , func: 'inputText'
                    , args: {
                        title: 'Longitude:'
                        , value: currentLongitude
                        , elClass: 'col-sm-11 col-md-11 col-lg-11 '
                    }
                }
            ], 'col-sm-3 col-md-3 col-lg-3 nopadding item-margin-top-0'
        );

        var arrZoom = [];
        for (var i = 1; i < 19; i++) {
            arrZoom.push(i + '');
        }

        var patternZoom = new RegExp(contextStart + 'zoom:\\s*([^,]*)' + contextEnd, 'im');
        var currentZoom = script.match(patternZoom)[1];

        _this._constructModalBody([
                {
                    name: 'zoom'
                    , func: 'dropDown'
                    , args: {
                        menu: arrZoom
                        , title: 'Zoom:'
                        , elClass: 'col-sm-11 col-md-11 col-lg-11'
                        , callback: function() {
                            return currentZoom;
                        }
                    }
                }
            ], 'col-sm-3 col-md-3 col-lg-3 nopadding item-margin-top-0'
        );

        var ptternStyle = new RegExp('var\\s*([^\\s]*)*\\s*=\\s*\\[','ig');
        var arrStyles = script.match(ptternStyle);
        var menuForStyle = [];
        arrStyles.forEach(function(style) {
            menuForStyle.push(style.match(/var\s([^\s]*)/i)[1]);
        });

        var patternCurStyle = new RegExp(contextStart + 'google\\.maps\\.StyledMapType\\(([^,]*)' + contextEnd, 'im');
        var currentStyle = script.match(patternCurStyle)[1];

        _this._constructModalBody([
                {
                    name: 'style'
                    , func: 'dropDown'
                    , args: {
                    menu: menuForStyle
                    , title: 'Color style:'
                    , elClass: 'col-sm-11 col-md-11 col-lg-11'
                    , callback: function() {
                        return currentStyle;
                    }
                }
                }
            ], 'col-sm-3 col-md-3 col-lg-3 nopadding item-margin-top-0'
        );

        var patternMarker = new RegExp(contextStart + 'var contentString = \'\\s*([^\']*)'+ contextEnd, 'im');
        var currentMarker = script.match(patternMarker)[1];

        _this._constructModalBody([
                {
                    name: 'marker'
                    , func: 'textArea'
                    , args: {
                    title: 'Marker popup content'
                    , elClass: 'col-sm-12 col-md-12 col-lg-12 nopadding-right-10'
                    , value: htmlencode(currentMarker)
                }
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding'
        );

        var argsSave = {
            latitude: builder.replaceQuotes(_this._elements.latitude.querySelector('input').value)
            , longitude: builder.replaceQuotes(_this._elements.longitude.querySelector('input').value)
            , zoom: _this._elements.zoom.querySelector('.dropdown button').dataset.value.replace(/_/ig, ' ')
            , marker: _this._elements.marker.querySelector('textarea').value
            , style: firstDown(_this._elements.style.querySelector('.dropdown button').dataset.value.replace(/_/ig, ' '))
            , contextStart: contextStart
            , contextEnd: contextEnd
        };

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {
            var args = {
                latitude: builder.replaceQuotes(_this._elements.latitude.querySelector('input').value)
                , longitude: builder.replaceQuotes(_this._elements.longitude.querySelector('input').value)
                , zoom: _this._elements.zoom.querySelector('.dropdown button').dataset.value.replace(/_/ig, ' ')
                , marker: _this._elements.marker.querySelector('textarea').value
                , style: firstDown(_this._elements.style.querySelector('.dropdown button').dataset.value.replace(/_/ig, ' '))
                , contextStart: contextStart
                , contextEnd: contextEnd
            };

            _this._applyGMapSettings(_this, args, argsSave);

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     * 
     * @private
     */ 
    , _applyGMapSettings: function(_this, args, argsSave) {
        
        var li = _this._targetObject.li;
        var scriptLi = li.querySelector('script');
        var script = scriptLi.innerHTML;

        var patternLatLng = new RegExp('(google\\.maps\\.LatLng\\()[^,]*,\\s*[^)]*(\\))', 'img');
        var patternContext = new RegExp('(' + args.contextStart + args.contextEnd + ')', 'im');
        var context = script.match(patternContext)[0];
        context = context.replace(patternLatLng, '$1' + args.latitude + ', ' + args.longitude + '$2');
        script = script.replace(patternContext, context);

        var patternZoom = new RegExp('(' + args.contextStart + 'zoom:\\s*)[^,]*(' + args.contextEnd + ')', 'im');
        script = script.replace(patternZoom, '$1' + args.zoom + '$2');

        var patternMarker = new RegExp('(' + args.contextStart + 'var contentString = \'\\s*)[^\']*(\'' + args.contextEnd + ')', 'im');
        script = script.replace(patternMarker, '$1' + htmldecode(args.marker) + '$2');

        var patternCurStyle = new RegExp('(' + args.contextStart + 'google\\.maps\\.StyledMapType\\()[^,]*(' + args.contextEnd + ')', 'im');
        script = script.replace(patternCurStyle, '$1' + args.style + '$2');

        scriptLi.innerHTML = script;

        builder.reloadScript(li);

        _this._targetObject.map.style.position = 'relative';
        _this._targetObject.map.style.left = '0';

        builder.setStep(function () {
            _this._applyGMapSettings(_this, argsSave, args);
        });
    }
    /**
     * 
     * @private
     */ 
    , _getModalLinkSettings: function(_this) {
        var Target = _this._targetObject;
        var DOMEelement = _this._targetObject.element;

        var valueHref = DOMEelement.getAttribute('href') || '';
        var valueTarget = DOMEelement.target || '';

        if (Target.editor) {
            var editorAnchor = window.getSelection().anchorNode.parentNode;
            valueHref = editorAnchor.getAttribute('href') || '';
            valueTarget = editorAnchor.target || '';
        }

        this._title.innerHTML = '<h4>Link settings</h4>';

        this._elements = null;

        _this._constructModalBody([
                {
                    name: 'radio'
                    , func: 'radio'
                    , args: {
                    items: ['External', 'Section', 'Other page', 'Image', 'Video popup']
                    , marginTop: ''
                }
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding radio-control external'
        );

        _this._constructModalBody([
                {
                    name: 'inputText'
                    , func: 'inputText'
                    , args: {
                    title: ''
                    , elClass: 'col-sm-12 col-md-12 col-lg-12'
                    , placeholder: 'http://exemple.com'
                    , value: valueHref
                }
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding external'
        );

        var menuSections = [];
        var page = builder.getActivePageObject();
        for (var group in page.sections) {
            for(var section in page.sections[group]) {
                menuSections.push(section);
            }
        }

        _this._constructModalBody([
                {
                    name: 'section1'
                    , func: 'dropDown'
                    , args: {
                    menu: menuSections
                    , title: ''
                    , elClass: 'col-sm-12 col-md-12 col-lg-12'
                }
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding section'
        );

        var menuPages = [];
        var pages = builder.getPagesArray();
        pages.forEach(function(element) {
            menuPages.push(element.getPageName());
        });

        _this._constructModalBody([
                {
                    name: 'page'
                    , func: 'dropDown'
                    , args: {
                    menu: menuPages
                    , title: ''
                    , elClass: 'col-sm-12 col-md-12 col-lg-12'
                    , callback: function() {
                        return builder.getActivePageObject().getPageName();
                    }
                }
                }
            ], 'col-sm-6 col-md-6 col-lg-6 nopadding-right-10 other-page'
        );

        _this._constructModalBody([
                {
                    name: 'inputImage'
                    , func: 'inputImage'
                    , args: {
                    title: ''
                    , elClass: 'col-sm-12 col-md-12 col-lg-12'
                }
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding image'
        );

        _this._constructModalBody([
                {
                    name: 'section2'
                    , func: 'dropDown'
                    , args: {
                    menu: menuSections
                    , title: ''
                    , elClass: 'col-sm-12 col-md-12 col-lg-12'
                }
                }
            ], 'col-sm-6 col-md-6 col-lg-6 nopadding other-page'
        );

        _this._constructModalBody([
                {
                    name: 'target'
                    , func: 'checkbox'
                    , args: {
                    name: 'Open in new tab'
                    , checked: valueTarget === '_blank' ? true : false
                }
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding field-checkbox external'
        );

        _this._constructModalBody([
            {
                name: 'videoLink'
                , func: 'inputText'
                , args: {
                    title: 'Iframe source URL'
                    , elClass: 'col-sm-12 col-md-12 col-lg-12'
                    , placeholder: 'https://vimeo.com/123395658'
                    , value: valueHref
                }
            }
            , {
                name: 'description'
                , func: 'description'
                , args: {
                    value: 'Examples:<br>'
                            + 'Vimeo: https://vimeo.com/123395658<br>'
                            + 'Youtube: https://www.youtube.com/watch?v=JLhbTGzE6MA'
                }
            }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding video-popup'
        );

        var radio = _this._elements.radio.querySelectorAll('.radio-inline input');
        Array.prototype.forEach.call(radio, function(item) {
            item.addEventListener('change', function(e) {
                e.preventDefault();
                var radioControl = controls.findParent(this, ['radio-control']);
                var checkbox = controls.findParent(_this._elements.target, ['field-checkbox']);
                radioControl.className = radioControl.className.replace(/(external|section|other-page|image|video-popup)/i, '');
                checkbox.className = checkbox.className.replace(/(external|section|other-page|image|video-popup)/i, '');
                radioControl.classList.add(this.value);
                if (this.value === 'external' || this.value === 'other-page') {
                    checkbox.classList.add(this.value);
                } else {
                    _this._elements.target.querySelector('input').checked = false;
                }
            });
        });

        var patternHref = new RegExp('([\\w._-]*)?\\/?#?([\\w_-]*)?', 'i');
        var patternHrefVideo = new RegExp('(vimeo\\.com|youtube\\.com)', 'i');
        var patternHrefImage = new RegExp('\\.(png|jpg|jpeg|gif|svg)', 'i');
        //var attrHref = DOMEelement.getAttribute('href') || '';
        var attrHref = valueHref;
        var parseHref = attrHref.match(patternHref);
        var parseHrefVideo = attrHref.match(patternHrefVideo);
        var parseHrefImage = attrHref.match(patternHrefImage);

        if (!parseHrefVideo && !parseHrefImage && parseHref && parseHref[1]) {
            var pagesNames = builder.getPagesNamesArray();
            var triggerPage = false;
            pagesNames.forEach(function(name) {
                if (parseHref[1].replace(/.html/, '') === name) triggerPage = true;
            });
            if (triggerPage) {
                radio[2].checked = true;
                _this._elements.page.querySelector('.dropdown button').dataset.value = parseHref[1].replace(/.html/, '');
                _this._elements.page.querySelector('.dropdown button span').innerHTML = firstUp(parseHref[1].replace(/.html/, ''));
                _this._elements.section2.querySelector('.dropdown button').dataset.value = parseHref[2];
                _this._elements.section2.querySelector('.dropdown button span').innerHTML = firstUp(parseHref[2]);
                _this._setTypeLink(radio[2], true);
            }
        } else if (!parseHrefVideo && !parseHrefImage && parseHref && parseHref[2]) {
            radio[1].checked = true;
            _this._elements.section1.querySelector('.dropdown button').dataset.value = parseHref[2];
            _this._elements.section1.querySelector('.dropdown button span').innerHTML = firstUp(parseHref[2]);
            _this._setTypeLink(radio[1]);
            _this._elements.target.querySelector('input').checked = false;
        } else if (parseHrefVideo) {
            radio[4].checked = true;
            _this._setTypeLink(radio[4]);
        } else if (parseHrefImage) {
            radio[3].checked = true;
            _this._setTypeLink(radio[3]);
            _this._elements.inputImage.querySelector('input').value = clearTimeStamp(valueHref);
        }

        if (DOMEelement.target === '_blank') {
            _this._elements.target.querySelector('input').checked = true;
        }

        _this._elements.page.addEventListener('supra.check.select', function(e) {
            pages.forEach(function(page) {
                if (page.getPageName() === e.detail.toLowerCase()) {
                    var sectionUl = _this._elements.section2.querySelector('ul');
                    sectionUl.innerHTML = '';
                    var valueDropDown = false;
                    for (var group in page.sections) {
                        for(var section in page.sections[group]) {
                            if (!valueDropDown) {
                                valueDropDown = true;
                                var button = _this._elements.section2.querySelector('button');
                                var val = section;
                                button.dataset.value = replaceSpace(val.toLowerCase());
                                button.querySelector('span').innerHTML = val;
                            }
                            var li = document.createElement('li');
                            var a = document.createElement('a');
                            li.appendChild(a);
                            a.innerHTML = section;
                            sectionUl.appendChild(li);
                        }
                    }

                    _this._addEventListToDropdown(_this._elements.section2);
                }
            });
        });

        var argsSave = {
            link: DOMEelement.href
            , targetLink: DOMEelement.target || '_self'
        };

        if (_this._targetObject.mode === 'static') {
            this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';
        } else {
            var unlink = this._getButton('supra-btn btn-danger', 'Unlink', function () {
                if (DOMEelement.nodeName === 'A') {
                    _this._removeLink(_this, DOMEelement);
                    if (Target.button.classList.contains('active'))
                        Target.button.classList.remove('active');
                } else if (Target.editor && Target.button.classList.contains('active')) {
                    var nav = controls.findParent(DOMEelement, ['nav']);
                    var ul = null;
                    if (nav) {
                        ul = controls.findParent( DOMEelement, [ 'ul' ] );
                        ul.style.display = 'block';
                        ul.style.visibility = 'visible';

                        setTimeout(function(){
                            Target.editor.removeLink(Target.button);

                            ul.style.removeProperty('display');
                            ul.style.removeProperty('visibility');
                        },400);

                    } else {
                        Target.editor.removeLink( Target.button );
                    }
                }

                $(_this._selfDOM).modal('hide');
            });

            this._footer.appendChild(unlink);
        }

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {

            var radio = _this._elements.radio.querySelector('.radio-inline input:checked').value;

            var link = builder.replaceQuotes(_this._elements.inputText.querySelector('input').value);
            var targetLink = _this._elements.target.querySelector('input').checked ? '_blank' : '_self';
            if (radio === 'section') {
                link = '#' + _this._elements.section1.querySelector('.dropdown button').dataset.value;
            } else if (radio === 'other-page') {
                var page = _this._elements.page.querySelector('.dropdown button').dataset.value + '.html';
                var section = _this._elements.section2.querySelector('.dropdown button').dataset.value;
                link = page + '#' + section;
            } else if (radio === 'video-popup') {
                link = builder.replaceQuotes(_this._elements.videoLink.querySelector('input').value);
            } else if (radio === 'image') {
                link = builder.replaceQuotes(_this._elements.inputImage.querySelector('input').value);
                link += '?t=' + Date.now();
            }
            
            var owl = controls.findParent(DOMEelement, ['spr-gallery', 'gallery']);
            var li = controls.findParent(DOMEelement, ['section-item']);
            var script = li.querySelector('script');
                
            if (Target.editor) {
                var nav = controls.findParent(DOMEelement, ['nav']);
                var ul = null;
                var anchor = null;
                if (nav) {
                    ul = controls.findParent(DOMEelement, ['ul']);
                    ul.style.display = 'inline-block';
                    ul.style.visibility = 'visible';
                    
                    setTimeout(function(){
                        if (Target.button.classList.contains('active') && editorAnchor.nodeName !== "A") {
                            Target.editor.removeLink(Target.button);
                        } else if (editorAnchor.nodeName === "A") {
                            Target.editor.removeLink(Target.button);
                            anchor = _this._setLink(_this, DOMEelement, link, targetLink, Target.editor, Target.button);

                        } else {
                            anchor = _this._setLink(_this, DOMEelement, link, targetLink, Target.editor, Target.button);
                        }
                        
                        if (anchor && radio === 'video-popup') {
                            builder.applyMagnificPopup(anchor);
                        }

                        if (anchor && radio === 'image') {
                            builder.applyMagnificPopupImage(anchor);
                        }
                    
                        ul.style.removeProperty('display');
                        ul.style.removeProperty('visibility');
                    },400);
                } else {
                
                    if (Target.button.classList.contains('active') && editorAnchor.nodeName !== "A") {
                        Target.editor.removeLink(Target.button);
                    } else if (editorAnchor.nodeName === "A") {
                        Target.editor.removeLink(Target.button);
                        anchor = Target.editor.setLink(Target.button, link, targetLink);
                    } else {
                        anchor = Target.editor.setLink(Target.button, link, targetLink);
                    }

                    if (anchor && radio === 'video-popup') {
                        builder.applyMagnificPopup(anchor);
                    }

                    if (anchor && radio === 'image') {
                        builder.applyMagnificPopupImage(anchor);
                    }
                }

            } else {

                if (DOMEelement.nodeName === 'A') {
                    var args = {
                        link: link
                        , targetLink: targetLink
                    };

                    _this._changeLink(_this, DOMEelement, args, argsSave);
                } else {
                    _this._setLink(_this, DOMEelement, link, targetLink);
                }

                if (!Target.button.classList.contains('active'))
                    Target.button.classList.add('active');

                if (radio === 'video-popup' && !owl) {
                    builder.applyMagnificPopup(DOMEelement);
                }

                if (radio === 'image' && !owl) {
                    builder.applyMagnificPopupImage(DOMEelement);
                }
                
                if (owl && (radio === 'video-popup' || radio === 'image')) {
                    if (script.innerHTML.search(/magnificPopup/m) !== -1) {
                        if (DOMEelement.classList.contains('external')) DOMEelement.classList.remove('external');

                        $(owl).magnificPopup({
                            delegate: 'a:not(.external)', // the selector for gallery item
                            type: 'image',
                            gallery: {
                                enabled: true
                            },
                            image: {
                                titleSrc: function (item) {
                                    return item.el.find('span.caption').text();
                                }
                            }
                        });

                        if (!DOMEelement.classList.contains('mfp-iframe') && radio === 'video-popup') {
                            DOMEelement.classList.add( 'mfp-iframe' );
                        } else if (DOMEelement.classList.contains('mfp-iframe') && radio !== 'video-popup') {
                            DOMEelement.classList.remove( 'mfp-iframe' );
                        }
                    }
                }
            }

            //this necessary for gallery
            if (owl && owl.classList.contains('spr-gallery')) {
                $(owl).trigger('refresh.owl.carousel');
            }

            //this necessary for video
            if (radio !== 'video-popup' && radio !== 'image' && !owl) {
                if (DOMEelement.classList.contains('single-iframe-popup')) DOMEelement.classList.remove('single-iframe-popup');
                if (DOMEelement.classList.contains('single-image-popup')) DOMEelement.classList.remove('single-image-popup');
                script.innerHTML = script.innerHTML.replace(/\n?\/\/magnific[\s\S]*?\/\/magnificend/im, '');

                if ($(DOMEelement).data('magnificPopup') !== undefined) {
                    $( DOMEelement ).data( 'magnificPopup' ).disableOn = function () {
                        return false;
                    };
                }
            } else if (radio !== 'video-popup' && radio !== 'image' && owl) {
                if (!DOMEelement.classList.contains('external')) DOMEelement.classList.add('external');
            }

            if (radio === 'video-popup' || radio === 'image') {
                if ($(DOMEelement).data('magnificPopup') !== undefined) {
                    $( DOMEelement ).data( 'magnificPopup' ).disableOn = function () {
                        if ( _this.editingText ) {
                            return false;
                        }
                        return true;
                    };
                }
            }

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     * 
     * @private
     */ 
    , _changeLink: function(_this, DOMEelement, args, argsSave) {
        DOMEelement.href = args.link;
        DOMEelement.target = args.targetLink;
        DOMEelement.classList.add('smooth');

        $(DOMEelement).smoothScroll({speed: 800});

        builder.setStep(function () {
            _this._changeLink(_this, DOMEelement, argsSave, args);
        });
    }
    /**
     * 
     * @private
     */ 
    , _setLink: function(_this, DOMEelement, link, targetLink, editor, tbutton) {
        //this condition need for the history
        if (DOMEelement.tagName === 'A' && !editor) {
            var args = {
                link: link
                , targetLink: targetLink
            };
            var argsSave = {
                link: DOMEelement.getAttribute( 'href' )
                , targetLink: DOMEelement.target
            };
            _this._changeLink( _this, DOMEelement, args, argsSave );
        } else if (editor) {
            var anchor = document.createElement('a');
            anchor.setAttribute('href', link);
            anchor.setAttribute('target', targetLink);
            anchor.appendChild(DOMEelement.childNodes[0]);
            anchor.classList.add('smooth');
            DOMEelement.appendChild(anchor);
            $(anchor).smoothScroll({speed: 800});

            builder.setStep(function() {
                editor.removeLink(tbutton);
            });
            return anchor;
        } else {
            var a = document.createElement('a');
            a.href = link;
            a.target = targetLink;
            a.classList.add('smooth');
            a.className = DOMEelement.className;
            DOMEelement.removeAttribute('class');
            DOMEelement.parentElement.insertBefore(a, DOMEelement);
            a.wrap(DOMEelement);
            var style = DOMEelement.getAttribute('style');
            a.setAttribute('style', style);
            DOMEelement.removeAttribute('style');

            //TODO: check this part
            //if (DOMEelement.classList.contains('slide-photo')) {
            //    a.classList.add('slide-photo');
                //a.style.position = 'static';
                //DOMEelement.classList.remove('slide-photo');
                //DOMEelement.removeAttribute('style');
            //}
            controls.rebuildControl(a.parentElement);

            $(a).smoothScroll({speed: 800});

            builder.setStep(function() {
                // anchor element need to be inner element of 'a'
                // , because 'a' element will be removed and not have children elements
                _this._removeLink(_this, DOMEelement.parentElement);
            });
        }

    }
    /**
     * 
     * @private
     */ 
    , _setTypeLink: function(radio, chbx) {
        var _this = this;
        var radioControl = controls.findParent(radio, ['radio-control']);
        var checkbox = controls.findParent(_this._elements.target, ['field-checkbox']);
        radioControl.className = radioControl.className.replace(/(external|section|other-page|image|video-popup)/i, '');
        checkbox.className = checkbox.className.replace(/(external|section|other-page|image|video-popup)/i, '');
        radioControl.classList.add(radio.value);
        if (chbx) checkbox.classList.add(radio.value);
    }
    /**
     * 
     * @private
     */ 
    , _removeLink: function(_this, a) {
        var DOMElement = a.children[0];
        var gallery = controls.findParent(a, ['spr-gallery']);
        var link = a.getAttribute('href');
        var target = a.target;
        if (DOMElement && !gallery && DOMElement.nodeName !== 'SPAN') {
            a.removeAttribute('href');
            a.removeAttribute('target');
            for (var i = 0; i < a.attributes.length; i++)
            {
                var attr = a.attributes[i];
                DOMElement.setAttribute(attr.name, attr.value);
            }
            a.unWrapOne('save-style');
            if (DOMElement.classList.contains('smooth')) {
                DOMElement.classList.remove('smooth');
            }
        } else {
            DOMElement = a;
            a.href = '/';
            a.target = '_self';
        }

        controls.rebuildControl(DOMElement.parentElement);

        builder.setStep(function() {
            _this._setLink(_this, DOMElement, link, target);
        });
    }
    /**
     * 
     * @private
     */ 
    , _getModalVideoLinkSettings: function(_this) {
        var DOMEelement = _this._targetObject.element;

        var valueSrc = DOMEelement.src || '';

        this._title.innerHTML = '<h4>Link settings</h4>';

        this._elements = null;

        _this._constructModalBody([
                {
                    name: 'videoLink'
                    , func: 'inputText'
                    , args: {
                    title: 'Iframe source URL'
                    , elClass: 'col-sm-12 col-md-12 col-lg-12'
                    , placeholder: 'https://vimeo.com/123395658'
                    , value: valueSrc
                }
                }
                , {
                    name: 'description'
                    , func: 'description'
                    , args: {
                        value: 'Examples:<br>'
                        + 'Vimeo: https://vimeo.com/123395658<br>'
                        + 'Youtube: https://www.youtube.com/watch?v=JLhbTGzE6MA'
                    }
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding'
        );

        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var argsSave = {
            link: builder.replaceQuotes(_this._elements.videoLink.querySelector('input').value)
        };

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {

            var args = {
                link: builder.replaceQuotes(_this._elements.videoLink.querySelector('input').value)
            };

            if (args.link.search(/player\.vimeo\.com|embed/i) === -1) {
                _this._applyVideoLinkSettings(_this, DOMEelement, args, argsSave, false);
            }

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     * 
     * @private
     */ 
    , _applyVideoLinkSettings: function(_this, DOMEelement, args, argsSave, saved) {

        if (saved) {
            DOMEelement.src = args.link;
            saved = false;
        } else {
            var id = _this._getVideoId;
            var videoDomain = _this._getVideoDomain;

            DOMEelement.src = videoDomain(args.link) + id(args.link);
            saved = true;
        }

        builder.setStep(function() {
            _this._applyVideoLinkSettings(_this, DOMEelement, argsSave, args, saved);
        });
    }
    /**
     * 
     * @private
     */ 
    , _getVideoId: function (url) {
        var m = url.match(/(vimeo\.com.*\/([0-9]*)|youtube\.com\/watch\?v=(.*))/);
        if (m) {
            if (m[2] !== undefined) {
                return m[2];
            }
            return m[3];
        }
        return null;
    }
    /**
     * 
     * @private
     */ 
    , _getVideoDomain: function(url) {
        var m = url.match(/(vimeo\.com)|(youtube\.com)/);
        if (m) {
            if (m[1] !== undefined) {
                return 'https://player.vimeo.com/video/';
            }
            return 'https://www.youtube.com/embed/';
        }
    }
    /**
     *
     * @private
     */
    , _getModalElementSettings: function (_this) {
        var li = _this._targetObject.li;
        var section = li.children[0];
        var element = _this._targetObject.element;
        var elementStyleMargin = element.parentElement.style.margin.match(/([^\s]*)\s*([^\s]*)\s*([^\s]*)\s*([^\s]*)/);
        var cNameTop = element.className.match(/mt-([^ ]*)/i);
        var cNameBottom = element.className.match(/mb-([^ ]*)/i);

        var typesAnimation = ['none','fade','fade-up','fade-down','fade-left','fade-right','fade-up-right'
            ,'fade-up-left','fade-down-right','fade-down-left'
            ,'flip-up','flip-down','flip-left','flip-right'
            ,'slide-up','slide-down','slide-left','slide-right'
            ,'zoom-in','zoom-in-up','zoom-in-down','zoom-in-left','zoom-in-right','zoom-out'
            ,'zoom-out-up','zoom-out-down','zoom-out-left','zoom-out-right','stretch-left','stretch-right','stretch-top','stretch-bottom'];
        
        var dataEasing = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'ease-in-back'
                        , 'ease-out-back', 'ease-in-out-back', 'ease-in-sine', 'ease-out-sine'
                        , 'ease-in-out-sine', 'ease-in-quad', 'ease-out-quad', 'ease-in-out-quad'
                        , 'ease-in-cubic', 'ease-in-cubic', 'ease-out-cubic', 'ease-in-out-cubic'
                        , 'ease-in-quart', 'ease-out-quart', 'ease-in-out-quart'];

        this._title.innerHTML = '<h4>Element settings</h4>';

        this._elements = null;

        _this._constructModalBody([
                {
                    name: 'MarTop'
                    , func: 'dropDown'
                    , args: {
                    menu: ['---', '0px', '5px', '10px', '15px', '20px', '25px', '30px', '40px', '50px', '60px', '75px', '100px', '125px', '150px', '200px', '250px', '300px']
                    , title: 'Margin top:'
                    , elClass: 'col-sm-12 col-md-12 col-lg-12'
                    , callback: function() {
//                        return  elementStyleMargin[1] ? elementStyleMargin[1] : '0px';
                        var mTop = '---';
                        if (cNameTop && cNameTop[1] !== undefined) {
                            mTop = cNameTop[1] + 'px';
                        }
                        return mTop;
                    }
                }
                }
                , {
                    name: 'MarBottom'
                    , func: 'dropDown'
                    , args: {
                        menu: ['---', '0px', '5px', '10px', '15px', '20px', '25px', '30px', '40px', '50px', '60px', '75px', '100px', '125px', '150px', '200px', '250px', '300px']
                        , title: 'Margin bottom:'
                        , elClass: 'col-sm-12 col-md-12 col-lg-12'
                        , callback: function() {
//                            var marginBottom = elementStyleMargin[3] ? elementStyleMargin[3] : '0px';
//                            if (elementStyleMargin[3] === '' && elementStyleMargin[2] !== '')
//                                marginBottom = elementStyleMargin[1];
//                            return  marginBottom;
                            var mBottom = '---';
                            if (cNameBottom && cNameBottom[1] !== undefined) {
                                mBottom = cNameBottom[1] + 'px';
                            }
                            return mBottom;
                        }
                    }
                }
            ], 'col-sm-6 col-md-6 col-lg-6 section-set-dropdown'
        );

        var duration = element.dataset.aosDuration;
        var delay = element.dataset.aosDelay;

        _this._constructModalBody([
            {
                name: 'animation'
                , func: 'dropDown'
                , args: {
                title: 'Animation:'
                , menu: typesAnimation
                , elClass: 'col-sm-12 col-md-12 col-lg-12'
                , callback: function() {
                    var type = element.dataset.aos;
                    return type ? type : 'none';
                }
            }
            }
            , {
                name: 'easing'
                , func: 'dropDown'
                , args: {
                title: 'Timing function:'
                , menu: dataEasing
                , elClass: 'col-sm-12 col-md-12 col-lg-12'
                , callback: function() {
                    var type = element.dataset.aosEasing;
                    return type ? type : 'none';
                }
            }
            }
            , {
            name: 'duration'
            , func: 'inputText'
            , args: {
                title: 'Duration:'
                , elClass: 'col-sm-3 col-md-3 col-lg-3 float-left duration'
                , placeholder: ''
                , value: duration ? duration : ''
            }
            }
            , {
                name: 'delay'
                , func: 'inputText'
                , args: {
                    title: 'Delay:'
                    , elClass: 'col-sm-3 col-md-3 col-lg-3 float-left delay'
                    , placeholder: ''
                    , value: delay ? delay : ''
                }
            }
            , {
                name: 'repeat'
                , func: 'dropDown'
                , args: {
                    title: 'Repeat:'
                    , menu: ['Once', 'Every']
                    , outerClass: 'col-sm-6 col-md-6 col-lg-6 nopadding repeat-aos'
                    , elClass: 'col-sm-12 col-md-12 col-lg-12'
                    , callback: function() {
                        var once = 'Every';
                        if (element.dataset.aosOnce) once = 'Once';
                        return once;
                    }
                }
            }
            ], 'col-sm-6 col-md-6 col-lg-6 nopadding section-settings'
        );

        if (!element.dataset.aos) {
            _this._triggerDisabledAnimationParams(true);
        }

        _this._elements.animation.addEventListener('supra.check.select', function(e){
            if (e.detail.toLowerCase() === 'none') {
                _this._triggerDisabledAnimationParams(true);
            } else {
                _this._triggerDisabledAnimationParams(false);
            }
        });
        var marginLeft = elementStyleMargin[4] ? elementStyleMargin[4] : elementStyleMargin[1];
        if (elementStyleMargin[4] === '' && elementStyleMargin[2] !== '') {
            marginLeft = elementStyleMargin[2];
        }
        
        var argsSave = {
            marginTop: _this._elements.MarTop.querySelector('button').dataset.value
            , marginBottom: _this._elements.MarBottom.querySelector('button').dataset.value
            , animation: _this._elements.animation.querySelector('.dropdown button').dataset.value.replace(/_/i, ' ').toLowerCase()
            , easing: _this._elements.easing.querySelector('.dropdown button').dataset.value.replace(/_/i, ' ').toLowerCase()
            , duration: _this._elements.duration.querySelector('input').value.replace(/[^0-9]/, '')
            , delay: _this._elements.delay.querySelector('input').value.replace(/[^0-9]/, '')
            , repeat: _this._elements.repeat.querySelector('.dropdown button').dataset.value.replace(/_/i, ' ').toLowerCase()
            , maginRight: elementStyleMargin[2] ? elementStyleMargin[2] : elementStyleMargin[1]
            , maginLeft: marginLeft
        };

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {
            var args = {
                marginTop: _this._elements.MarTop.querySelector('button').dataset.value
                , marginBottom: _this._elements.MarBottom.querySelector('button').dataset.value
                , animation: _this._elements.animation.querySelector('.dropdown button').dataset.value.replace(/_/i, ' ').toLowerCase()
                , easing: _this._elements.easing.querySelector('.dropdown button').dataset.value.replace(/_/i, ' ').toLowerCase()
                , duration: _this._elements.duration.querySelector('input').value.replace(/[^0-9]/, '')
                , delay: _this._elements.delay.querySelector('input').value.replace(/[^0-9]/, '')
                , repeat: _this._elements.repeat.querySelector('.dropdown button').dataset.value.replace(/_/i, ' ').toLowerCase()
                , maginRight: elementStyleMargin[2] ? elementStyleMargin[2] : '0px'
                , maginLeft: marginLeft
            };

            _this._applyElementSettings(_this, li, args, argsSave);

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     *
     * @private
     */
    , _applyElementSettings: function(_this, li, args, argsSave) {
        var el = _this._targetObject.element;

        var cNameTop = el.className.match(/mt-[^ ]*/i);
        var cNameBottom = el.className.match(/mb-[^ ]*/i);
        if (cNameTop && cNameTop[0] !== undefined) {
            el.classList.remove(cNameTop[0]);
        }
        if (args.marginTop !== '---') 
            el.classList.add('mt-' + args.marginTop.substr(0, args.marginTop.length-2));


        if (cNameBottom && cNameBottom[0] !== undefined) {
            el.classList.remove(cNameBottom[0]);
        }
        if (args.marginBottom !== '---')
            el.classList.add('mb-' + args.marginBottom.substr(0, args.marginBottom.length-2));

        var display = el.style.display;
        el.style.removeProperty('display');
        var displayOrigin = window.getComputedStyle(el, null).getPropertyValue('display');
        if (displayOrigin !== 'block' && !el.classList.contains('inline-block')) {
            el.classList.add('inline-block');
        }
        el.style.display = display;

        el.style.removeProperty('margin');
        var margin = window.getComputedStyle(el, null).getPropertyValue('margin');
        var elementStyleMargin = margin.match(/([^\s]*)\s*([^\s]*)\s*([^\s]*)\s*([^\s]*)/);
        var mTop = args.marginTop;
        var mBottom = args.marginBottom;
        if (args.marginTop === '---') {
            mTop = elementStyleMargin[1] ? elementStyleMargin[1] : '0px';
        }
        if (args.marginBottom === '---') {
            mBottom = elementStyleMargin[3] ? elementStyleMargin[3] : '0px';
            if (elementStyleMargin[3] === '' && elementStyleMargin[2] !== '')
                mBottom = elementStyleMargin[1];
            if (elementStyleMargin[2] === '' && elementStyleMargin[1] !== '')
                mBottom = elementStyleMargin[1];
        }
        el.parentElement.style.margin = mTop + ' ' + args.maginRight + ' ' + mBottom + ' ' + args.maginLeft;
        el.style.margin = '0';
        
        if (el.className.match(/(\s?aos-[^\s]*)+/i)) {
            el.className = el.className.replace(/(\s?aos-[^\s]*)+/ig, '').trim();
            if (el.className === '') el.removeAttribute('class');
        }

        if (args.animation !== 'none') {
            el.style.transition = '';

            el.dataset.aos = args.animation;

            if (AOS) {
                setTimeout(function(){
                    AOS.refresh();
                }, args.duration);
            }
        } else {
            delete el.dataset.aos;
        }
        
        if (args.animation !== 'none' && args.easing !== '') {
            el.dataset.aosEasing = args.easing;
        } else {
            delete el.dataset.aosEasing;
        }

        if (args.animation !== 'none' && args.repeat === 'once') {
            el.dataset.aosOnce = 'true';
        } else {
            if (el.dataset.aosOnce)
                delete el.dataset.aosOnce;
        }

        if (args.duration !== '') {
            el.dataset.aosDuration = args.duration;
        } else {
            delete el.dataset.aosDuration;
        }

        if (args.delay !== '') {
            el.dataset.aosDelay = args.delay;
        } else {
            delete el.dataset.aosDelay;
        }

        builder.setStep(function () {
            _this._applyElementSettings(_this, li, argsSave, args);
        });
    }
    /**
     *
     * @private
     */
    , _triggerDisabledAnimationParams: function(check) {
        var duration = this._elements.duration.querySelector('input');
        var delay = this._elements.delay.querySelector('input');
        if (check) {
            duration.setAttribute('disabled', 'true');
            duration.value = '';
            delay.setAttribute('disabled', 'true');
            delay.value = '';
            this._elements.repeat.querySelector('.dropdown button').classList.add('disabled');
            this._elements.easing.querySelector('.dropdown button').classList.add('disabled');
        } else {
            var repeat = this._elements.repeat.querySelector('.dropdown button');
            var easing = this._elements.easing.querySelector('.dropdown button');
            duration.removeAttribute('disabled');
            duration.value = 500;
            delay.removeAttribute('disabled');
            delay.value = 0;
            if (repeat.classList.contains('disabled'))
                repeat.classList.remove('disabled');
            if (easing.classList.contains('disabled'))
                easing.classList.remove('disabled');
        }
    }
    /**
     * 
     * 
     */ 
    , _getModalPageSettings: function(_this) {
        var page = _this._targetObject.page;
        _this._title.innerHTML = '<h4>Page settings</h4>';

        _this._constructModalBody([
                {
                    name: 'buttonGroup'
                    , func: 'pageSettinsButton'
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding btn-page-control general'
        );

        _this._constructModalBody([
                {
                    name: 'name'
                    , func: 'inputText'
                    , args: {
                    title: 'Name'
                    , elClass: 'col-sm-12 col-md-12 col-lg-12'
                    , placeholder: 'Index'
                    , value: page.getPageName()
                }
                }
                , {
                    name: 'title'
                    , func: 'inputText'
                    , args: {
                        title: 'Title'
                        , elClass: 'col-sm-12 col-md-12 col-lg-12'
                        , placeholder: 'Title'
                        , value: page.getPageTitle()
                    }
                }
                , {
                    name: 'skin'
                    , func: 'switch'
                    , args: {
                        title: 'Default Dark skin'
                        , type: 'gray'
                        , checked: page.getDOMSelf().classList.contains('dark-page')
                        , callback: function(sw) {
                            sw.querySelector('.switch').addEventListener('click', function(e) {
                                e.preventDefault();
                                if (this.classList.contains('switch-on')) {
                                    this.classList.remove('switch-on');
                                    this.classList.add('switch-off');
                                    this.querySelector('input').removeAttribute('checked');
                                } else {
                                    this.classList.remove('switch-off');
                                    this.classList.add('switch-on');
                                    this.querySelector('input').setAttribute('checked' , '');
                                }
                            });
                        }
                    }
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding general'
        );

        _this._constructModalBody([
                {
                    name: 'textAreaDesc'
                    , func: 'textArea'
                    , args: {
                    title: 'Meta Description'
                    , elClass: 'col-sm-6 col-md-6 col-lg-6 nopadding-right-10'
                    , value: page.getMetaDes()
                }
                }
                , {
                    name: 'textAreaKeyw'
                    , func: 'textArea'
                    , args: {
                        title: 'Meta Keywords'
                        , elClass: 'col-sm-6 col-md-6 col-lg-6 nopadding-left-10'
                        , value: page.getMetaKey()
                    }
                }
                , {
                    name: 'textAreaJs'
                    , func: 'textArea'
                    , args: {
                        title: 'Included JavaScript (Google Analitics e.t.c.)'
                        , elClass: 'col-sm-12 col-md-12 col-lg-12 nopadding'
                        , value: page.getJs()
                    }
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding seo'
        );

        _this._constructModalBody([
                {
                    name: 'preloaderType'
                    , func: 'preloaderType'
                    , args: {
                    title: 'Preloader type'
                    , elClass: 'col-sm-12 col-md-12 col-lg-12'
                    , html: [
                        'None'
                        , '<i class="icon-picture"></i><span>Image</span>'
                        , '<div class="clock"><div class="arrow_sec"></div><div class="arrow_min"></div></div>'
                        , '<div class="circles"><div class="bounce1"></div>'
                            + '<div class="bounce2"></div><div class="bounce3"></div></div>'
                    ]
                    , dataName: ['none', 'img', 'anim_clock', 'anim_jp']
                    , active: page.preloader ? page.preloader.name : 'none'
                }
                }
                , {
                    name: 'inputImage'
                    , func: 'inputImage'
                    , args: {
                        title: 'Image path'
                        , elClass: 'col-sm-12 col-md-12 col-lg-12 pre-input-img'
                        , type: 'normal'
                    }
                }
                , {
                    name: 'inputImageRetina'
                    , func: 'inputImage'
                    , args: {
                        title: 'Retina image path'
                        , elClass: 'col-sm-12 col-md-12 col-lg-12 pre-input-img retina'
                        , type: 'retina'
                    }
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding s-preloader'
        );

        if (page.preloader && page.preloader.name === 'img') {
            var src = page.preloader.html.match(/src="([^"]*)"/i)[1];
            var srcset = page.preloader.html.match(/srcset="([^"]*)"/i)[1];
            this._elements.inputImage.querySelector('input').value = clearTimeStamp(src);
            this._elements.inputImageRetina.querySelector('input').value = clearTimeStamp(srcset);
            this._body.classList.add('show-input-img');
        }


        var preloader = _this._elements.preloaderType.querySelector('.active');

        var argsSave = {
            pageName: _this._elements.name.querySelector('input').value
            , pageTitle: _this._elements.title.querySelector('input').value
            , skin: _this._elements.skin.querySelector('input').checked
            , description: _this._elements.textAreaDesc.querySelector('textarea').value
            , keywords: _this._elements.textAreaKeyw.querySelector('textarea').value
            , js: _this._elements.textAreaJs.querySelector('textarea').value
            , preloader: preloader
            , imgPath: _this._elements.inputImage.querySelector('input').value
            , retinaPath: _this._elements.inputImageRetina.querySelector('input').value
            , preloaderHtml: preloader ? preloader.innerHTML : ''
        };

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {

            preloader = _this._elements.preloaderType.querySelector('.active');

            var args = {
                pageName: _this._elements.name.querySelector('input').value
                , pageTitle: _this._elements.title.querySelector('input').value
                , skin: _this._elements.skin.querySelector('input').checked
                , description: _this._elements.textAreaDesc.querySelector('textarea').value
                , keywords: _this._elements.textAreaKeyw.querySelector('textarea').value
                , js: _this._elements.textAreaJs.querySelector('textarea').value
                , preloader: preloader
                , imgPath: _this._elements.inputImage.querySelector('input').value
                , retinaPath: _this._elements.inputImageRetina.querySelector('input').value
            };

            _this._applyPageSettings(_this, page, args, argsSave);

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     * 
     * @private
     */  
    , _applyPageSettings: function(_this, page, args, argsSave) {
        if (args.pageName.charAt(0).search(/[0-9]/) !== -1) {
            args.pageName = 'p-' + args.pageName;
        }
        page.setPageName(args.pageName.toLowerCase());
        builder.setPageItemsName(args.pageName.toLowerCase(), _this._targetObject.pageItem);
        page.setPageTitle(args.pageTitle);
        _this._skinCheck(_this, args.skin, page.getDOMSelf(), 'light-page', 'dark-page');

        page.setMetaDes(args.description);
        page.setMetaKey(args.keywords);
        page.setJs(args.js);

        if (args.preloader) {
            switch (args.preloader.dataset.value) {
                case 'img':
                    var img = '<img src="'
                        + builder.replaceQuotes(args.imgPath) + '?t=' + Date.now() + '" srcset="'
                        + builder.replaceQuotes(args.retinaPath).replace(/\s2x/, '?t=' + Date.now() + ' 2x') + '" alt="preloader image"/>';
                    page.preloader = {
                        name: args.preloader.dataset.value
                        , html: '<div id="preloader">' + img + '</div>'
                    };
                    break;
                case 'anim_clock':
                    page.preloader = {
                        name: args.preloader.dataset.value
                        , html: '<div id="preloader"><div class="clock"><div class="arrow_sec"></div><div class="arrow_min"></div></div></div>'
                    };
                    break;
                case 'anim_jp':
                    page.preloader = {
                        name: args.preloader.dataset.value
                        , html: '<div id="preloader"><div class="circles"><div class="bounce1"></div>'
                        + '<div class="bounce2"></div><div class="bounce3"></div></div></div>'
                    };
                    break;
                case 'none':
                default:
                    page.preloader = {
                        name: args.preloader.dataset.value
                        , html: ''
                    };
                    break;
            }
        } else {
            page.preloader = null;
        }

        builder.setStep(function() {
            _this._applyPageSettings(_this, page, argsSave, args);
        });
    }
    /**
     * 
     * @private
     */ 
    , _getModalFormSettings: function (_this) {
        var form = _this._targetObject;
        var li = controls.findParent(form, ['section-item']);
        var section = li.children[0];
        var subject = builder.forms[section.id].settings ? builder.forms[section.id].settings.subject : '';
        var address = builder.forms[section.id].settings ? builder.forms[section.id].settings.email : '';

        this._title.innerHTML = '<h4>Contact form settings</h4>';

        this._elements = null;

        _this._constructModalBody([
                {
                    name: 'subject'
                    , func: 'inputText'
                    , args: {
                    title: 'Subject'
                    , elClass: 'col-sm-12 col-md-12 col-lg-12'
                    , value: subject
                    , placeholder: 'Enter email subject'
                }
                }
                , {
                    name: 'eMail'
                    , func: 'inputText'
                    , args: {
                        title: 'Email address'
                        , elClass: 'col-sm-12 col-md-12 col-lg-12'
                        , value: address
                        , placeholder: 'Enter email address'
                    }
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding'
        );

        _this._constructModalBody([
                {
                    name: 'radio'
                    , func: 'radio'
                    , args: {
                        title: 'Confirm method'
                        , items: ['None', 'Popups', 'Redirect']
                        , marginTop: ''
                    }
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding radio-control none'
        );

        _this._constructModalBody([
                {
                    name: 'description'
                    , func: 'description'
                    , args: {
                        value: 'If you use confirmation type with popups, after successful sending'
                        + ' of message your user will see popups with confirm information (on error popup if'
                        + ' somesing do wrong). Customize popups you can in elements mode.'
                    }
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding item-margin-top-0 popups'
        );

        _this._constructModalBody([
                {
                    name: 'redirectLink'
                    , func: 'inputText'
                    , args: {
                        title: ''
                        , elClass: 'col-sm-12 col-md-12 col-lg-12'
                        , placeholder: 'http://URL.com'
                        , value: builder.forms[section.id].rLink ? builder.forms[section.id].rLink : ''
                    }
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding item-margin-top-0 redirect'
        );

        _this._constructModalBody([
                {
                    name: 'target'
                    , func: 'checkbox'
                    , args: {
                    name: 'Open in new tab'
                    , checked: builder.forms[section.id].target === '_blank' ? true : false
                }
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding field-checkbox item-margin-top-0 redirect'
        );

        var radio = _this._elements.radio.querySelectorAll('.radio-inline input');
        Array.prototype.forEach.call(radio, function(item) {
            item.addEventListener('change', function(e) {
                e.preventDefault();
                _this._changeConfirmMode(this);
            });
        });

        switch (builder.forms[section.id].mode) {
            case 'popups':
                radio[1].checked = true;
                _this._changeConfirmMode(radio[1]);
                break;
            case 'redirect':
                radio[2].checked = true;
                _this._changeConfirmMode(radio[2]);
                break;
        }

        if (builder.forms[section.id].target === '_blank') {
            _this._elements.target.querySelector('input').checked = true;
        }

        var argsSave = {
            subject: _this._elements.subject.querySelector('input').value
            , address: _this._elements.eMail.querySelector('input').value
            , radio: _this._elements.radio.querySelector('.radio-inline input:checked').value
            , rLink: _this._elements.redirectLink.querySelector('input').value
            , target: _this._elements.target.querySelector('input').checked
        };

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {

            var args = {
                subject: _this._elements.subject.querySelector('input').value
                , address: _this._elements.eMail.querySelector('input').value
                , radio: _this._elements.radio.querySelector('.radio-inline input:checked').value
                , rLink: _this._elements.redirectLink.querySelector('input').value
                , target: _this._elements.target.querySelector('input').checked
            };

            _this._applyFormSettings(_this, subject, address, args, argsSave);

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     * 
     * @private
     */ 
    , _changeConfirmMode: function(radioInput) {
        var _this = this;
        var radioControl = controls.findParent(radioInput, ['radio-control']);
        var checkbox = controls.findParent(_this._elements.target, ['field-checkbox']);
        radioControl.className = radioControl.className.replace(/(none|popups|redirect)/i, '');
        checkbox.className = checkbox.className.replace(/(none|popups|redirect)/i, '');
        radioControl.classList.add(radioInput.value);
        if (radioInput.value === 'redirect') {
            checkbox.classList.add(radioInput.value);
        } else {
            _this._elements.target.querySelector('input').checked = false;
        }
    }
    /**
     * 
     * @private
     */ 
    , _applyFormSettings: function(_this, subject, address, args, argsSave) {
        var form = _this._targetObject;
        var li = controls.findParent(form, ['section-item']);
        var section = li.children[0];
        var script = li.querySelector('script');

        builder.forms[section.id].settings = {
            subject: args.subject
            , email: args.address
            , type: 'contact'
            , id: form.id
        };

        var patternSuccess = new RegExp('success:\\s*function\\s*\\(.*\\)\\s*{[^}]*}', 'im');
        var patternError = new RegExp('error:\\s*function\\s*\\(.*\\)\\s*{[^}]*}', 'im');
        var patternOpenWindow = new RegExp('(\\$\\(\'#' + section.id + '-form\'\\)\\.submit\\(function\\s*\\(\\)\\s*{)', 'i');
        var patternErrorValid = new RegExp('(\\/\\/if data was invalidated)', 'im');
        var patternLClick = new RegExp('\\$\\(\'#' + section.id + '-form \\[type=submit\\]\'\\)\\.on\\(\'click\'[\\n\\s\\w\\/;:\'"#(){}\\[\\]\\|$@!?\\=+,.-]*\'_blank\'\\);\\n}\\);\\n', 'im');
        var patternCloseWindow = new RegExp('\\n\\t\\twindow\\.wBlank\\.close\\(\\);\\n', 'img');
        
        var successCode = 'success: function () {'
            + '\n\t$(\'#' + section.id + '-form\').find(\'[type=submit]\').button(\'complete\');'
            + '\n}';
        var errorCode = 'error: function () {'
            + '\n\t$(\'#' + section.id + '-form\').find(\'[type=submit]\').button(\'reset\');'
            + '\n}';

        var target = args.target ? '_blank' : '_self';

        var lineRedirect = '\t\twindow.open(\'' + args.rLink + '\',\'_self\');\n';
        var closeWindowCode = '';

        if (target === '_blank') {
            lineRedirect = '\t\twindow.wBlank.location = \'' + args.rLink + '\';\n';
            closeWindowCode = '\n\t\twindow.wBlank.close();\n';
            if (script.innerHTML.search(patternLClick) === -1) {
                var openWindowCode = '$(\'#' + section.id + '-form [type=submit]\').on(\'click\', function() {\n'
                    + '\t\twindow.wBlank = window.open(\'\',\'_blank\');\n'
                    + '});\n';
                script.innerHTML = script.innerHTML.replace(patternOpenWindow, openWindowCode + '$1');
                script.innerHTML = script.innerHTML.replace(patternErrorValid, '$1' + closeWindowCode);
            }
        } else {
            script.innerHTML = script.innerHTML.replace(patternLClick, '');
            script.innerHTML = script.innerHTML.replace(patternCloseWindow, '');
        }

        switch (args.radio) {
            case 'popups':
                successCode = 'success: function () {\n'
                    + '\t\t$(\'#' + section.id + '-form\').find(\'[type=submit]\').button(\'complete\');\n'
                    + '\t\t//Use modal popups to display messages\n'
                    + '\t\t$(document).find(\'#' + section.id + '-success\').modal(\'show\');\n'
                    + '\t}';
                errorCode = 'error: function () {\n'
                    + '\t\t$(\'#' + section.id + '-form\').find(\'[type=submit]\').button(\'reset\');\n'
                    + '\t\t//Use modal popups to display messages\n'
                    + '\t\t$(document).find(\'#' + section.id + '-error\').modal(\'show\');\n'
                    + '\t}';
                break;

            case 'redirect':
                successCode = 'success: function () {\n'
                    + '\t\t$(\'#' + section.id + '-form\').find(\'[type=submit]\').button(\'complete\');\n'
                    + '\t\t//Use modal popups to display messages\n'
                    + lineRedirect
                    + '\t}';
                errorCode = 'error: function () {\n'
                    + closeWindowCode
                    + '\t}';
                builder.forms[section.id].rLink = args.rLink;
                builder.forms[section.id].target = target;
                break;
        }

        builder.forms[section.id].mode = args.radio;

        script.innerHTML = script.innerHTML.replace(patternSuccess, successCode);
        script.innerHTML = script.innerHTML.replace(patternError, errorCode);

        builder.setStep(function() {
            _this._applyFormSettings(_this, subject, address, argsSave, args);
        });
    }
    /**
     * 
     * @private
     */ 
    , _getModalSubscribeFormSettings: function (_this) {
        var form = _this._targetObject;
        var li = controls.findParent(form, ['section-item']);
        var section = li.children[0];
        var apiKey = builder.forms[section.id].settings ? builder.forms[section.id].settings.apiKey : '';
        var listId = builder.forms[section.id].settings ? builder.forms[section.id].settings.listId : '';

        this._title.innerHTML = '<h4>Subscribe form settings</h4>';

        this._elements = null;

        _this._constructModalBody([
                {
                    name: 'apiKey'
                    , func: 'inputText'
                    , args: {
                    title: 'Mailchimp API Key'
                    , elClass: 'col-sm-12 col-md-12 col-lg-12'
                    , value: apiKey
                    , placeholder: 'Enter your mailchimp API Key'
                }
                }
                , {
                    name: 'listId'
                    , func: 'inputText'
                    , args: {
                        title: 'Mailchimp List ID'
                        , elClass: 'col-sm-12 col-md-12 col-lg-12'
                        , value: listId
                        , placeholder: 'Enter your mailchimp List ID'
                    }
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding'
        );

        var argsSave = {
            apiKey: _this._elements.apiKey.querySelector('input').value
            , listId: _this._elements.listId.querySelector('input').value
        };

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {

            var args = {
                apiKey: _this._elements.apiKey.querySelector('input').value
                , listId: _this._elements.listId.querySelector('input').value
            };

            _this._applySubscribeFormSettings(_this, args, argsSave);

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     * 
     * @private
     */ 
    , _applySubscribeFormSettings: function(_this, args, argsSave) {
        var form = _this._targetObject;
        var li = controls.findParent(form, ['section-item']);
        var section = li.children[0];
        var script = li.querySelector('script');

        builder.forms[section.id].settings = {
            apiKey: args.apiKey
            , listId: args.listId
            , type: 'subscribe'
            , id: form.id
        };

        var patternSuccess = new RegExp('#modalSubscribeSuccess', 'img');
        var patternError = new RegExp('#modalSubscribeError', 'img');

        var successCode = '#' + section.id + '-success';
        var errorCode = '#' + section.id + '-error';

        script.innerHTML = script.innerHTML.replace(patternSuccess, successCode);
        script.innerHTML = script.innerHTML.replace(patternError, errorCode);

        builder.setStep(function() {
            _this._applySubscribeFormSettings(_this, argsSave, args);
        });
    }
    /**
     * 
     * @private
     */ 
    , _getModalDivBg: function (_this) {
        var divBackground = this._targetObject;
        this._title.innerHTML = '<h4>Background settings</h4>';

        this._elements = null;

        var li = controls.findParent(divBackground, ['section-item']);
        var className = divBackground.className.match(/half-container-\w*/)[0];
        var section = li.children[0];
        var style = li.querySelector('style').innerHTML;

        var patternStyleSize = new RegExp(section.id + '\\s*\\.' + className + '\\s*{[\\s\\S]*?background-size:\\s*([^;]*);', 'im');
        var bgOptions = style.match(patternStyleSize);
        var patternStyleRepeat = new RegExp(section.id + '\\s*\\.' + className + '\\s*{[\\s\\S]*?background-repeat:\\s*([^;]*);', 'im');
        var repeat = style.match(patternStyleRepeat);

        _this._constructModalBody([
                {
                    name: 'inputImage'
                    , func: 'inputImage'
                    , args: {
                        title: 'Background path'
                        , elClass: 'col-sm-10 col-md-10 col-lg-10'
                        , type: 'normal'
                    }
                }
                , {
                    name: 'BgStyle'

                    , func: 'dropDown'
                    , args: {
                        menu: ['cover', 'auto', 'contain', 'repeat']
                        , title: 'Background style:'
                        , elClass: 'col-sm-10 col-md-10 col-lg-10'
                        , callback: function() {
                            if (repeat && repeat[1] === 'repeat') {
                                return repeat[1];
                            }
                            return  bgOptions ? bgOptions[1] : 'Auto';
                        }
                    }
                }
            ], 'col-sm-6 col-md-6 col-lg-6 nopadding'
        );

        var patternOpacity = new RegExp(section.id + '\\s*\\.' + className + '\\s*{[\\s\\S]*?opacity:[\\s]*([^;]*)', 'im');
        var opacity = style.match(patternOpacity);
        var opacityLabel = opacity ? opacity[1] : 1;

        _this._constructModalBody([
                {
                    name: 'figure'
                    , func: 'figure'
                    , args: {
                    callback: function() {
                        return _this._elements.inputImage;
                    }
                    , section: divBackground
                    , sizeAuto: !bgOptions || (bgOptions && bgOptions[1] === 'auto')
                }
                }
                , {
                    name: 'inputRange'
                    , func: 'inputRange'
                    , args: {
                        title: 'Opacity (<span class="opacity">' + Math.round(opacityLabel*100) + '</span>%):'
                        , opacity: function() {
                            return opacity ? opacity[1] : 100;
                        }
                    }
                }

            ], 'col-sm-6 col-md-6 col-lg-6 nopadding preview-bg'
        );

        var img = _this._elements.figure.querySelector('img');
        var divImg = _this._elements.figure.querySelector('.img');
        divImg.style.display = 'block';

        $(_this._selfDOM).on('shown.bs.modal', function() {
            var widthDivBg = divBackground.getBoundingClientRect().width;
            var widthModal = _this._elements.figure.getBoundingClientRect().width;
            var percentWidth =  Math.round(widthModal / widthDivBg * 100);
            var heightDivBg = divBackground.getBoundingClientRect().height;
            var heightModal = heightDivBg * (percentWidth/100);
            var wrap = _this._elements.figure.querySelector('.wrap-hover');
            wrap.style.height = heightModal + 'px';
        });

        var patternImage = new RegExp(section.id + '\\s*\\.' + className + '\\s*{[\\s\\S]*?background-image:\\s*url\\(\'?/?([^\']*)\'?\\);', 'im');

        var src = (style.match(patternImage) && style.match(patternImage)[1] !== '') ? style.match(patternImage)[1] : '';

        _this._elements.inputImage.querySelector('input').value = clearTimeStamp(src);

        if (src !== '') {
            img.src = src;
            divImg.style.backgroundImage = 'url(\'' + src + '\')';
        }

        if (repeat && repeat[1] === 'repeat') {
            divImg.style.backgroundRepeat = 'repeat';
            divImg.style.webkitBackgroundRepeat = 'repeat';
        } else {
            divImg.style.backgroundRepeat = 'no-repeat';
            divImg.style.webkitBackgroundRepeat = 'no-repeat';
        }
        if (bgOptions && bgOptions[1] !== 'auto') {
            divImg.style.backgroundSize = bgOptions[1];
            divImg.style.webkitBackgroundSize = bgOptions[1];
        }

        var bgStyle = _this._elements.BgStyle;
        bgStyle.addEventListener('supra.check.select', function (e) {
            if (e.detail.toLowerCase() === 'repeat') {
                divImg.style.backgroundRepeat = 'repeat';
                divImg.style.webkitBackgroundRepeat = 'repeat';
            } else {
                divImg.style.backgroundRepeat = 'no-repeat';
                divImg.style.webkitBackgroundRepeat = 'no-repeat';
            }
            if (e.detail.toLowerCase() === 'auto' || e.detail.toLowerCase() === 'repeat') {
                divImg.style.backgroundSize = divImg.dataset.percent + '% auto';
                divImg.style.webkitBackgroundSize = divImg.dataset.percent + '% auto';
            } else {
                divImg.style.backgroundSize = e.detail.toLowerCase();
                divImg.style.webkitBackgroundSize = e.detail.toLowerCase();
            }
        });

        divImg.style.opacity = opacity ? opacity[1] : 1;
        divImg.style.backgroundPosition = window.getComputedStyle(divBackground, null).getPropertyValue("background-position");

        var range = _this._elements.inputRange.querySelector('input');
        var opacityLabel = _this._elements.inputRange.querySelector('label .opacity');
        range.addEventListener('input', function () {
            divImg.style.opacity = this.value / 100;
            opacityLabel.innerHTML = Math.round(this.value);
        });

        range.addEventListener('change', function () {
            divImg.style.opacity = this.value / 100;
            opacityLabel.innerHTML = Math.round(this.value);
        });

        var background = this._elements.figure.querySelector('.bg-test');
        var bgClassName = section.className.match(/bg-.-color-(light|dark)/i);
        if (bgClassName) background.classList.add(bgClassName[0]);

        var argsSave = {
            image: _this._elements.inputImage ? _this._elements.inputImage.querySelector('input').value : ''
            , bgStyle: _this._elements.BgStyle ? _this._elements.BgStyle.querySelector('.dropdown button').dataset.value.toLowerCase() : ''
            , range: _this._elements.inputRange.querySelector('input').value / 100
        };

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {
            var args = {
                image: _this._elements.inputImage ? _this._elements.inputImage.querySelector('input').value : ''
                , bgStyle: _this._elements.BgStyle ? _this._elements.BgStyle.querySelector('.dropdown button').dataset.value.toLowerCase() : ''
                , range: _this._elements.inputRange.querySelector('input').value / 100
            };

            _this._applyDivBg(_this, divBackground, args, argsSave);

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     * 
     * @private
     */ 
    , _applyDivBg: function(_this, divBackground, args, argsSave) {
        args.image = builder.replaceQuotes(args.image) + '?t=' + Date.now();
        var li = controls.findParent(divBackground, ['section-item']);
        var className = divBackground.className.match(/half-container-\w*/)[0];
        var section = li.children[0];
        var style = li.querySelector('style');

        var pattern = new RegExp('(' + '#' + section.id + '\\s*\\.' + className + '\\s*{)([^\}]*)(\})', 'im');
        var bgOptionSize = args.bgStyle;
        var bgOptionRepeat = 'no-repeat';
        if (args.bgStyle === 'repeat') {
            bgOptionSize = 'auto';
            bgOptionRepeat = args.bgStyle;
        }

        if (style.innerHTML.search(pattern) !== -1) {
            style.innerHTML = style.innerHTML.replace(pattern, '$1'
                + _this._getBgStyle(args.image, bgOptionSize, bgOptionRepeat, args.range)
                + '$3');
        } else {
            style.innerHTML = '\n#' + section.id + ' .' + className + ' {'
                + _this._getBgStyle(args.image, bgOptionSize, bgOptionRepeat, args.range)
                + '}\n'
                + li.children[1].innerHTML;
        }

        builder.setStep(function () {
            _this._applyDivBg(_this, divBackground, argsSave, args);
        });
    }
    /**
     *
     * @private
     */
    , _getModalDemo: function (_this) {
        this._header.innerHTML = "<h5 class=\"text-center\">You're using demo version, download feature is only available in the full version of the builder.</h5>";
        _this._body.classList.add('nopadding');

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-success', 'Buy full version', function() {

            window.location = _this._targetObject.dataset.href || window.location.href;

            $(_this._selfDOM).modal('hide');
        });
        this._footer.appendChild(apply);
    }
    /**
     *
     * @private
     */
    , _getModalAttention: function (_this) {
        this._header.innerHTML = "<h5 class=\"text-center\">" + _this._targetObject.response + "</h5>";
        _this._body.classList.add('nopadding');

        //this is need to create new button because modal-footer will be overloaded
        this._footer.classList.add('one-button');
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Ok</button>';
    }
    /**
     * --------------------------------------- Some helpful functions --------------------------------------------
     */
    , _getBgStyle: function(image, bgOptionSize, bgOptionRepeat, opacityVal) {
        return '\n\tbackground-image: url(\''
            + image
            + '\');\n'
            + '\tbackground-size: ' + bgOptionSize + ';\n'
            + '\t-webkit-background-size: ' + bgOptionSize + ';\n'
            + '\tbackground-repeat: ' + bgOptionRepeat + ';\n'
            + '\t-webkit-background-repeat: ' + bgOptionRepeat + ';\n'
            + '\topacity: ' + opacityVal + ';\n';
    }
    , _getSectionBgStyle: function(image, bgOptionSize, bgOptionRepeat, opacityVal, position) {
        return '\n\tbackground-image: url(\''
            + image
            + '\');\n'
            + '\tbackground-size: ' + bgOptionSize + ';\n'
            + '\t-webkit-background-size: ' + bgOptionSize + ';\n'
            + '\tbackground-repeat: ' + bgOptionRepeat + ';\n'
            + '\t-webkit-background-repeat: ' + bgOptionRepeat + ';\n'
            + '\tbackground-position: ' + position + ';\n'
            + '\topacity: ' + opacityVal + ';\n';
    }
    , _setCostomSizeOnFigure: function(widthEl, heightEl, divImg, section) {
        var w = widthEl.value || widthEl
            ,h = heightEl.value || heightEl;
        var width = w.match(/(([0-9]*?)(px|%)|auto)/i);
        var height = h.match(/(([0-9]*?)(px|%)|auto)/i);
        var sectionBRect = section.getBoundingClientRect();
        var widthSection = sectionBRect.width;
        var heightSection = sectionBRect.height;
        if (width && height) {
            w =width ? width[1] : 'auto';
            h =height ? height[1] : 'auto';
            if (widthEl.value)
                widthEl.value = w;
            if (heightEl.value)
                heightEl.value = h;
            if (width[3] === 'px')
                w = width[2]/widthSection * 100 + '%';
            if (height[3] === 'px')
                h = height[2]/heightSection * 100 + '%';

            divImg.style.backgroundSize = w + ' ' + h;
            divImg.style.backgroundSize = w + ' ' + h;
        }
    }
};