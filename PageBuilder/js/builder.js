/*
 * @autor: MultiFour
 * @version: 1.0.0
 */

"use strict";

var EditorText = function(el) {
    var _this = this;

    this._DOMIdentif = el.tagName.toLowerCase();
    this._DOMEditingEl = el;
    this.wrapContainer = el.parentElement.parentElement;
    this.overflow = null;
    var content = el.innerHTML;
    this.href = '';

    this.mouseEnter = function() {
        if (document.querySelector('.edit-typography') && !_this._triggerMouseEnter) {
            this.setAttribute('contenteditable', 'true');

            _this.overflow = controls.findParent(_this.wrapContainer, ['navbar-off-canvas']);

            if (_this.wrapContainer && _this.wrapContainer.tagName === 'A'){
                _this.href = _this.wrapContainer.href;
                _this.wrapContainer.removeAttribute('href');
            }

            var magnific = el.querySelector('.single-iframe-popup');
            if (magnific) {
                builder.editingText = true;
            }

            content = el.innerHTML;

            _this._triggerMouseEnter = true;
        }
    };

    this.clickIngalleryEditTagA = function (e) {
        if (document.querySelector('.edit-typography')) {
            e.preventDefault();
            e.stopImmediatePropagation();
            el.style.overflow = 'visible';
            this.style.zIndex = '10';
        }
    };

    this.mouseUp = function (e) {
        if (_this._triggerMouseEnter) {
            _this._showActiveButton(this, el.parentElement.children[1]);
        }
    };

    this.keyDown = function(e) {
        _this._eventKeyboard(_this, e, el);
    };

    this.mouseLeave = function(e){
        if (document.querySelector('.edit-typography')) {
            if (_this._triggerMouseEnter) {
                if (_this._DOMEditingEl.parentElement) {
                    var wrapControl = _this._DOMEditingEl.parentElement.children[1];
                    wrapControl.removeAttribute('style');
                    if (wrapControl.lastChild.classList.contains('arrow')) {
                        wrapControl.removeChild(wrapControl.lastChild);
                    }
                    if (_this.wrapContainer && _this.wrapContainer.tagName === 'A') {
                        _this.wrapContainer.style.removeProperty('z-index');
                        _this.wrapContainer.setAttribute('href', _this.href);
                    }
                }

                if (_this._triggerChangeText) {
                    var newContent = el.innerHTML;
                    builder.setStep(function () {
                        _this._changeContent(_this, el, content, newContent);
                    });
                    _this._triggerChangeText = false;
                }

                if (el.hasAttribute('contenteditable')) {
                    el.removeAttribute('contenteditable');
                }

                _this._triggerMouseEnter = false;
                builder.editingText = false;
            }
        }
    };

    this.paste = function(e) {
        e = e.originalEvent || e;
        e.preventDefault();
        var cnt = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, cnt);
    };

    el.addEventListener('mouseenter', _this.mouseEnter);

    if (_this.wrapContainer && _this.wrapContainer.tagName === 'A'){
        _this.wrapContainer.addEventListener('click', _this.clickIngalleryEditTagA );
    }

    el.addEventListener('mouseup', _this.mouseUp);

    el.addEventListener('keydown', _this.keyDown);

    el.parentElement.addEventListener('mouseleave', _this.mouseLeave);

    el.addEventListener('paste', _this.paste);
};

EditorText.prototype = {
    _range: null
    , _currentNode: null
    , _startOffset: null
    , _triggerChangeText: false
    , _triggerMouseEnter: false

    , _showActiveButton: function(element, wrapControls) {
        var _this = this;
        var select = window.getSelection();
        this._range = select.getRangeAt(0);
        if (builder.main.querySelector('.edit-typography')
            && element.tagName !== 'I'
            && !navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|IEMobile/i)
            && this._range.startOffset !== this._range.endOffset
        ) {
            var activeButtons = wrapControls.querySelectorAll('.active');

            Array.prototype.forEach.call(activeButtons, function (element) {
                element.classList.remove('active');
            });

            var textAlign = element.className.match(/text-([^ ]*)/i);
            if (textAlign) {
                switch (textAlign[1]) {
                    case 'left':
                        wrapControls.querySelector('button.left').classList.add('active');
                        break;
                    case 'center':
                        wrapControls.querySelector('button.center').classList.add('active');
                        break;
                    case 'right':
                        wrapControls.querySelector('button.right').classList.add('active');
                        break;
                }
            }



            var parentNodeSelect = select.anchorNode.parentNode;
            var style = parentNodeSelect.nodeName.toLowerCase();
            var activeStyles = [{style: style, nodeSelect: parentNodeSelect}];
            while (style !== this._DOMIdentif) {
                parentNodeSelect = parentNodeSelect.parentNode;
                style = parentNodeSelect.nodeName.toLowerCase();
                activeStyles.push({style: style, nodeSelect: parentNodeSelect});
            }
            activeStyles.forEach(function (element) {
                switch (element.style) {
                    case 'strong':
                        wrapControls.querySelector('button.strong').classList.add('active');
                        break;
                    case 'em':
                        wrapControls.querySelector('button.em').classList.add('active');
                        break;
                    case 'span':
                        if(element.nodeSelect.classList.contains('text-uppercase'))
                            wrapControls.querySelector('button.upper').classList.add('active');
                        break;
                    case 'mark':
                        wrapControls.querySelector('button.mark').classList.add('active');
                        break;
                    case 'ins':
                        wrapControls.querySelector('button.ins').classList.add('active');
                        break;
                    case 'del':
                        wrapControls.querySelector('button.del').classList.add('active');
                        break;
                    case 'a':
                        wrapControls.querySelector('button.link').classList.add('active');
                        break;
                }
            });

            if (this._range.cloneContents().hasChildNodes()) {
                var rangeBounding = this._range.getBoundingClientRect();
                var topRange = rangeBounding.top;
                var leftRange = rangeBounding.left;
                var bottomRange = rangeBounding.bottom;
                var widthRange = rangeBounding.width;

                var wrapControl = this._DOMEditingEl.parentElement.children[1];
                if (wrapControl.lastChild.classList.contains('arrow')) {
                    wrapControl.removeChild(wrapControl.lastChild);
                }
                var arrow = document.createElement('div');
                arrow.className = 'arrow';

                var buttonControls = this._DOMEditingEl.parentElement;
                var topElement = buttonControls.getBoundingClientRect().top;
                var leftElement = buttonControls.getBoundingClientRect().left;

                var owlStage = controls.findParent(this._DOMEditingEl, ['owl-stage-outer']);
                var owlStageTop = 0;
                if (owlStage) owlStageTop = owlStage.getBoundingClientRect().top;


                var widthWindow = window.innerWidth;

                var topKoef = 0;
                if (_this.overflow) {
                    var owerflowBounding = _this.overflow.getBoundingClientRect();
                    var widthOverflow = owerflowBounding.width;
                    var leftOverflow = owerflowBounding.left;
                    wrapControl.style.width = widthOverflow - 30 + 'px';
                    wrapControl.style.display = 'block';
                    topKoef = 42;
                    arrow.style.top = topKoef + 'px';
                }

                var top = topRange - topElement - 10;
                if (top < 0) {
                    top = topRange - topElement + 2;
                }

                top = top - topKoef;

                var boundingControl = wrapControl.getBoundingClientRect();
                var widthControl = boundingControl.width;

                wrapControl.style.height = '5px';

                if (topElement < 52 || topElement < (owlStageTop + 52)) {
                    if (wrapControl.classList.contains('outside-top')) {
                        wrapControl.classList.remove('outside-top');
                        wrapControl.classList.add('inside-top');
                    }
                    wrapControl.style.padding = '5px';
                    top = bottomRange - topElement;
                    arrow.style.borderBottom = '5px solid rgba(0,0,0,0.9)';
                    arrow.style.borderTop = 'none';
                    arrow.style.top = '0px';
                }
                var left = leftRange - leftElement + (widthRange / 2) - (widthControl / 2);
                wrapControl.style.top = top + 'px';
                wrapControl.style.left = left + 'px';

                var owlStageOuter = controls.findParent(wrapControl, ['owl-stage-outer']);
                var owlStageOuterLeft = 0;
                var owlStageOuterRight = widthWindow;
                if (owlStageOuter) {
                    var owlStageOuterRect = owlStageOuter.getBoundingClientRect();
                    owlStageOuterLeft = owlStageOuterRect.left;
                    owlStageOuterRight = owlStageOuterRect.right;
                }
                var firstChildWC = wrapControl.querySelector('button.supra-btn:first-child');
                var lastChildWC = wrapControl.querySelector('button.supra-btn:last-child');
                var leftBControl = firstChildWC.getBoundingClientRect().left;
                var rightBControl = lastChildWC.getBoundingClientRect().right;

                if (leftBControl < 50 || (leftBControl - owlStageOuterLeft) < 10) {
                    var leftControl = wrapControl.getBoundingClientRect().left;
                    wrapControl.style.left = 10 - Math.abs(leftControl - leftBControl) + 'px';
                    arrow.style.right = 'auto';
                    arrow.style.left = leftRange - leftElement + (widthRange / 2) + 'px';
                    arrow.style.margin = '0';
                }

                if (rightBControl > (widthWindow - 50) || (rightBControl > owlStageOuterRight)) {
                    if (owlStageOuter) {
                        wrapControl.style.left = left + (owlStageOuterRight - 10 - rightBControl) + 'px';
                    } else {
                        wrapControl.style.left = left + (widthWindow - 60 - rightBControl) + 'px';
                    }
                    leftBControl = firstChildWC.getBoundingClientRect().left;
                    arrow.style.right = 'auto';
                    arrow.style.left = leftRange - leftBControl + (widthRange / 2) + 'px';
                    arrow.style.margin = '0';
                }

                if (_this.overflow) {
                    if (wrapControl.classList.contains('outside-top')) {
                        wrapControl.classList.remove('outside-top');
                        wrapControl.classList.add('inside-top');
                    }
                    top = bottomRange - topElement;
                    wrapControl.style.top = top + 'px';
                    wrapControl.style.left = (leftOverflow - leftElement + 15) + 'px';
                    wrapControl.style.height = (topKoef + 5) + 'px';
                    wrapControl.style.padding = '5px';
                    arrow.style.borderBottom = '5px solid rgba(0,0,0,0.9)';
                    arrow.style.borderTop = 'none';
                    arrow.style.top = '0px';
                    arrow.style.left = leftRange - leftOverflow + (widthRange / 2) - 15 + 'px';
                    arrow.style.margin = '0';
                }

                wrapControl.appendChild(arrow);

                wrapControl.style.visibility = 'visible';
                wrapControl.style.opacity = 1;
            } else {
                var wrapControl = _this._DOMEditingEl.parentElement.children[1];
                wrapControl.removeAttribute('style');
            }
        } else {
            var wrapControl = _this._DOMEditingEl.parentElement.children[1];
            wrapControl.removeAttribute('style');
        }
    }
    /**
     * onKeydown
     * @param _this
     * @param e {Event} onKeydown
     * @param element {HTMLElement} editing
     * @private
     */
    , _eventKeyboard: function(_this, e, element) {
        if (!(e.keyCode === 13 && element.tagName === 'SPAN')) {
            _this._triggerChangeText = true;
        }
        if (e.keyCode === 13 && element.tagName === 'SPAN') {
            e.preventDefault();
            e.stopPropagation();
        } else if (e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            _this._setEnterInEndLine(element);
        } else if (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) {
            if (_this._triggerMouseEnter) {
                e.preventDefault();
                e.stopPropagation();
                var select = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(element);
                select.removeAllRanges();
                select.addRange(range);
                _this._showActiveButton(element, element.parentElement.children[1]);
            }
        }
    }
    , _setEnterInEndLine: function(element) {
        var select = window.getSelection();
        if (select.anchorNode.length === select.anchorOffset
            || select.anchorNode === element) {
            var range = document.createRange();
            var br = document.createElement('br');
            var br2 = document.createElement('br');
            var fragment = document.createDocumentFragment();
            fragment.appendChild(br2);
            if (select.anchorNode === element) {
                var node = select.anchorNode;
                var next = element.childNodes[select.anchorOffset - 1].nextSibling;
            } else {
                var next = select.anchorNode.nextSibling;
                var node = select.anchorNode.parentNode;
            }

            if ((next && next.tagName !== 'BR') || !next) {
                fragment.appendChild(br);
            }

            if (next) {
                node.insertBefore(fragment, next);
            } else {
                node.appendChild(fragment);
            }
            range.setStartAfter(br2);
            range.setEndAfter(br2);
            range.collapse(false);
            select.removeAllRanges();
            select.addRange(range);
        } else {
            document.execCommand('insertHTML', false, '<br>');
        }
    }
    /**
     * History point
     * @param _this
     * @param el
     * @param content
     * @param newContent
     * @private
     */
    , _changeContent: function(_this, el, content, newContent) {
        el.innerHTML = content;
        builder.setStep(function () {
            _this._changeContent(_this, el, newContent, content);
        });
    }
    /**
     * Change style selection text
     * @param button
     * @param tagName
     * @param className
     * @param href
     * @param targetLink
     * @private
     */
    , _setNode: function(button, tagName, className, href, targetLink) {
        var _this = this;
        if (this._range) {
            var select = window.getSelection();
            select.removeAllRanges();
            select.addRange(this._range);
            var valElBefore = _this._DOMEditingEl.innerHTML;
            var insertText = this._range.extractContents();

            var node = document.createElement(tagName);
            if (className) node.className = className;
            if (href) {
                node.href = href;
                node.target = targetLink;
                node.classList.add('smooth');
                $(node).smoothScroll({speed: 800});
            }
            node.appendChild(insertText);
            this._range.insertNode(node);
            this._range.selectNodeContents(node);
            select.removeAllRanges();
            select.addRange(this._range);

            button.classList.add('active');

            var valElAfter = _this._DOMEditingEl.innerHTML;

            builder.setStep(function() {
                _this._setNodePoint(_this, valElBefore, valElAfter);
            });

            return node;
        }
    }
    , _removeNode: function(button, tagName) {
        var _this = this;
        if (this._range) {
            var select = window.getSelection();
            select.removeAllRanges();
            select.addRange(this._range);
            var valElBefore = _this._DOMEditingEl.innerHTML;
            var anhor = select.anchorNode;
            var node = select.anchorNode.parentNode;
            var nodePrev = anhor;

            while (node.nodeName.toLowerCase() !== tagName) {
                nodePrev = nodePrev.parentNode;
                node = node.parentNode;
            }

            var nextNode = node.nextSibling;
            var parent = node.parentNode;
            parent.removeChild(node);

            if (parent.tagName.toLowerCase() !== this._DOMIdentif) {
                if (nextNode) {
                    parent.insertBefore(nodePrev, nextNode);
                } else {
                    parent.appendChild(nodePrev);
                }
                this._range.selectNodeContents(anhor.parentElement);
            } else {
                var baseNode = anhor.parentElement.childNodes;
                if (baseNode.length > 1) {
                    var fragment = document.createDocumentFragment();
                    for (var i=0; i < baseNode.length; i++) {
                        fragment.appendChild(baseNode[i].cloneNode(true));
                    }
                    this._range.insertNode(fragment);
                    this._range.selectNodeContents(fragment);
                } else {
                    this._range.insertNode(nodePrev);
                    this._range.selectNodeContents(nodePrev);
                }
            }
            try {
                select.removeAllRanges();
                select.addRange(this._range);
            }
            catch (e) {}

            button.classList.remove('active');
            button.blur();

            var valElAfter = _this._DOMEditingEl.innerHTML;

            builder.setStep(function() {
                _this._setNodePoint(_this, valElBefore, valElAfter);
            });
        }
    }
    /**
     * History poin
     * @param _this
     * @param valElBefore {string}
     * @param valElAfter {string}
     * @private
     */
    , _setNodePoint: function(_this, valElBefore, valElAfter) {
        _this._DOMEditingEl.innerHTML = valElBefore;

        builder.setStep(function() {
            _this._setNodePoint(_this, valElAfter, valElBefore);
        });
    }
    , setTextAlign: function(DOM, button, className) {
        var _this = this;
        var textAlign = DOM.className.match(/text-([^ ]*)/i);
        if (textAlign) {
            DOM.classList.remove(textAlign[0]);
            button.parentElement.querySelector('.' + textAlign[1]).classList.remove('active');
        }
        DOM.classList.add(className);
        button.classList.add('active');

        builder.setStep(function() {
            _this.removeTextAlign(DOM, button, className);
        });
    }
    , removeTextAlign: function(DOM, button, className) {
        var _this = this;
        DOM.classList.remove(className);
        button.classList.remove('active');
        button.blur();

        builder.setStep(function() {
            _this.setTextAlign(DOM, button, className);
        });
    }
    , setBold: function(button) {
        this._setNode(button, 'strong');
    }
    , removeBold: function(button) {
        this._removeNode(button, 'strong');
    }
    , setItalic: function(button) {
        this._setNode(button, 'em');
    }
    , removeItalic: function(button) {
        this._removeNode(button, 'em');
    }
    , setMarker: function(button) {
        this._setNode(button, 'mark');
    }
    , removeMarker: function(button) {
        this._removeNode(button, 'mark');
    }
    , setUnderline: function(button) {
        this._setNode(button, 'ins');
    }
    , removeUnderline: function(button) {
        this._removeNode(button, 'ins');
    }
    , setStrikethrough: function(button) {
        this._setNode(button, 'del');
    }
    , removeStrikethrough: function(button) {
        this._removeNode(button, 'del');
    }
    , setUpper: function(button) {
        this._setNode(button, 'span', 'text-uppercase');
    }
    , removeUpper: function(button) {
        this._removeNode(button, 'span');
    }
    , setLink: function(button, href, targetLink) {
        return this._setNode(button, 'a', null, href, targetLink);
    }
    , removeLink: function(button) {
        this._removeNode(button, 'a');
    }
    , setTextAlignLeft: function(DOM, button) {
        this.setTextAlign(DOM, button, 'text-left');
    }
    , removeTextAlignLeft: function(DOM, button) {
        this.removeTextAlign(DOM, button, 'text-left');
    }
    , setTextAlignCenter: function(DOM, button) {
        this.setTextAlign(DOM, button, 'text-center');
    }
    , removeTextAlignCenter: function(DOM, button) {
        this.removeTextAlign(DOM, button, 'text-center');
    }
    , setTextAlignRight: function(DOM, button) {
        this.setTextAlign(DOM, button, 'text-right');
    }
    , removeTextAlignRight: function(DOM, button) {
        this.removeTextAlign(DOM, button, 'text-right');
    }
};

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
                item.innerHTML = '<i class="ok icon-check"></i>'
                    + '<span class="bg-white-circle"></span>'
                    + element.html
                    + '<div class="wrap"></div>';

                cElement.appendChild(item);

                item.addEventListener('click', _this._choosen);
                if (args.callback) item.addEventListener('click', args.callback);
            });
        } else {
            cElement.innerHTML = '<div class="' + args.className + '">'
                + '<i class="ok icon-check"></i>'
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
        item.innerHTML = el + '<i class="ok icon-check"></i><span class="bg-white-circle"></span>';

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
                var index = 1;

                var form = new FormData();
                form.append('data', inputFile.files[0]);
                form.append('name_file', nameFile);
                builder.ajax(form, 'addgallery');

                images.forEach(function(element) {
                    if (nameFile === element.name) {
                        var nameArr = nameFile.split('.');
                        if (index > 1) {
                            var reg = /^(.*)(_[0-9]?)$/;
                            nameFile = nameArr[0].replace(reg, '$1_' + index + '.' + nameArr[1]);
                        } else {
                            nameFile = nameArr[0] + '_' + index + '.' + nameArr[1];
                        }
                        index++;
                    }
                });
                var reader = new FileReader();
                reader.readAsDataURL(inputFile.files[0]);

                reader.addEventListener('load', function(e) {
                    var gallery = _this._body.querySelector('.item.gallery');
                    var image = new Image();
                    image.src = e.target.result;

                    image.addEventListener('load', function() {

                        gallery.appendChild(_this._getItemForGallery(nameFile
                            , this.naturalWidth
                            , this.naturalHeight
                            , e.target.result
                            , './images/gallery/' + replaceSpace(inputFile.files[0].name)));
                    });
                });
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
                var images = _this._elementsGallery;
                var nameFile = replaceSpace(inputFile.files[0].name);
                var index = 1;

                var form = new FormData();
                form.append('data', inputFile.files[0]);
                form.append('name_file', nameFile);
                builder.ajax(form, 'addgalleryvideo', function(data) {
                    var error = JSON.parse(data).error;
                    if (error) {
                        var modal = new Modal('supra-modal', 'Attention', {response: error});
                        $(modal).modal('show');
                    } else {
                        if (type === 'jpg') {
                            images.forEach(function (element) {
                                if (nameFile === element.name) {
                                    var nameArr = nameFile.split('.');
                                    if (index > 1) {
                                        var reg = /^(.*)(_[0-9]?)$/;
                                        nameFile = nameArr[0].replace(reg, '$1_' + index + '.' + nameArr[1]);
                                    } else {
                                        nameFile = nameArr[0] + '_' + index + '.' + nameArr[1];
                                    }
                                    index++;
                                }
                            });

                            var reader = new FileReader();
                            reader.readAsDataURL(inputFile.files[0]);

                            reader.addEventListener('load', function(e) {
                                var gallery = _this._body.querySelector('.item.gallery');
                                var image = new Image();
                                image.src = e.target.result;

                                image.addEventListener('load', function() {

                                    gallery.appendChild(_this._getItemForGallery(nameFile
                                        , this.naturalWidth
                                        , this.naturalHeight
                                        , e.target.result
                                        , './video/gallery/' + replaceSpace(inputFile.files[0].name)));
                                });
                            });
                        } else {
                            var gallery = _this._body.querySelector('.item.gallery-video');
                            gallery.appendChild(_this._getItemForGalleryVideo(nameFile
                                , './video/gallery/' + replaceSpace(inputFile.files[0].name)));
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
        item.className = 'col-lg-2 selecting-item';
        item.dataset.src = path;

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
        this._imageSizig(width, height, format, image);

        item.innerHTML = '<div class="wrap-hover flex-center">'
            + '<i class="icon-check flex-center"></i>'
            + '</div>'
            + '<figcaption>'
            + '<p>' + name + '</p>'
            + '<p>' + width + 'x' + height + '</p>'
            + '</figcaption>';

        item.querySelector('.wrap-hover').appendChild(image);

        item.addEventListener('click', function(){
            builder.selection(this);
        });

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
        var item = document.createElement('div');
        item.className = 'col-lg-2 selecting-item video-item';
        item.dataset.src = path;

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

        item.innerHTML = '<i class="ok icon-check"></i>'
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

            ], 'col-sm-6 col-md-6 col-lg-6 nopadding preview-bg image-background video-background none float-right'
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
            _this._elements.inputImage.querySelector('input').value = src;
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
        args.image = builder.replaceQuotes(args.image);
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
            if (controls.findParent(this._targetObject, ['modal-dialog'])) {
                var popup = controls.findParent(this._targetObject, ['modal']);
                bgStyleSelector = '#' + popup.id + ' .bg';
                section = this._targetObject;

            }
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
                    , elClass: 'col-sm-9 col-md-9 col-lg-9'
                    , type: 'normal'
                }
                }
                , {
                    name: 'BgStyle'

                    , func: 'dropDown'
                    , args: {
                        menu: ['cover', 'auto', 'contain', 'repeat']
                        , title: 'Background style:'
                        , elClass: 'col-sm-9 col-md-9 col-lg-9'
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
                        , elClass: 'col-sm-9 col-md-9 col-lg-9'
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

        var patternOpacity = new RegExp(bgStyleSelector + '[\\s]*\{[ \\n\\t\\ra-z0-9:()\'\\/.;_-]*opacity:[\\s]*([^;]*)', 'im');
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
                            return opacity;
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

        _this._elements.inputImage.querySelector('input').value = src;

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
        args.image = builder.replaceQuotes(args.image);
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
                    menu: ['0px', '25px', '50px', '75px', '100px', '125px', '150px', '200px', '250px']
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
                        menu: ['0px', '25px', '50px', '75px', '100px', '125px', '150px', '200px', '250px']
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
            $(_this._selfDOM).modal('show');
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
                    modal.targetElement.querySelector('input').value = src + postfix;
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
            $(_this._selfDOM).modal('show');
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
            inputImage.value = image ? image.getAttribute('src') : './images/apple-badge-small.png';
        }
        if (inputRetina) {
            inputRetina.value = image ? image.getAttribute('srcset') : '';
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

            var className = '';

            if (_this._elements.button.querySelector('.choosen .btn')) {
                className = _this._elements.button.querySelector('.choosen .btn').className;
            }

            var args = {
                className: className
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
            img.src = args.inputImage;
            img.className = 'spr-option-img-nosettings';
            img.setAttribute('srcset', args.inputRetina);
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
                    , elClass: 'col-sm-9 col-md-9 col-lg-9'
                    , type: 'normal'
                }
                }
                , {
                    name: 'inputImageRetina'
                    , func: 'inputImage'
                    , args: {
                        title: 'Retina image path'
                        , elClass: 'col-sm-9 col-md-9 col-lg-9 retina'
                        , type: 'retina'
                    }
                }
                , {
                    name: 'inputText'
                    , func: 'inputText'
                    , args: {
                        title: 'Image Alt'
                        , elClass: 'col-sm-9 col-md-9 col-lg-9'
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
            inputRetina.value = image.getAttribute('srcset');
            inputRetinaBeforSetNewValue = inputRetina.value;
        }
        if (figure) {
            figure.src = image.getAttribute('src');
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

        image.src = args.inputImage;

        if (args.inputRetina !== '' && args.inputRetina !== args.inputRetinaBeforSetNewValue) {
            image.setAttribute('srcset', args.inputRetina);
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
            ], 'col-sm-3 col-md-3 col-lg-3 nopadding'
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
                    items: ['External link', 'Section link', 'Other page link', 'Video popup']
                    , marginTop: ''
                }
                }
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding radio-control external-link'
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
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding external-link'
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
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding section-link'
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
            ], 'col-sm-6 col-md-6 col-lg-6 nopadding-right-10 other-page-link'
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
            ], 'col-sm-6 col-md-6 col-lg-6 nopadding other-page-link'
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
            ], 'col-sm-12 col-md-12 col-lg-12 nopadding field-checkbox external-link'
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
                radioControl.className = radioControl.className.replace(/(external-link|section-link|other-page-link|video-popup)/i, '');
                checkbox.className = checkbox.className.replace(/(external-link|section-link|other-page-link|video-popup)/i, '');
                radioControl.classList.add(this.value);
                if (this.value === 'external-link' || this.value === 'other-page-link') {
                    checkbox.classList.add(this.value);
                } else {
                    _this._elements.target.querySelector('input').checked = false;
                }
            });
        });

        var patternHref = new RegExp('([\\w._-]*)?\\/?#?([\\w_-]*)?', 'i');
        var patternHrefVideo = new RegExp('(vimeo\\.com|youtube\\.com)', 'i');
        //var attrHref = DOMEelement.getAttribute('href') || '';
        var attrHref = valueHref;
        var parseHref = attrHref.match(patternHref);
        var parseHrefVideo = attrHref.match(patternHrefVideo);

        if (!parseHrefVideo && parseHref && parseHref[1]) {
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
        } else if (!parseHrefVideo && parseHref && parseHref[2]) {
            radio[1].checked = true;
            _this._elements.section1.querySelector('.dropdown button').dataset.value = parseHref[2];
            _this._elements.section1.querySelector('.dropdown button span').innerHTML = firstUp(parseHref[2]);
            _this._setTypeLink(radio[1]);
            _this._elements.target.querySelector('input').checked = false;
        } else if (parseHrefVideo) {
            radio[3].checked = true;
            _this._setTypeLink(radio[3]);
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
                    Target.editor.removeLink(Target.button);
                }

                $(_this._selfDOM).modal('hide');
            });

            this._footer.appendChild(unlink);
        }

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {

            var radio = _this._elements.radio.querySelector('.radio-inline input:checked').value;

            var link = builder.replaceQuotes(_this._elements.inputText.querySelector('input').value);
            var targetLink = _this._elements.target.querySelector('input').checked ? '_blank' : '_self';
            if (radio === 'section-link') {
                link = '#' + _this._elements.section1.querySelector('.dropdown button').dataset.value;
            } else if (radio === 'other-page-link') {
                var page = _this._elements.page.querySelector('.dropdown button').dataset.value + '.html';
                var section = _this._elements.section2.querySelector('.dropdown button').dataset.value;
                link = page + '#' + section;
            } else if (radio === 'video-popup') {
                link = builder.replaceQuotes(_this._elements.videoLink.querySelector('input').value);
            }

            if (Target.editor) {
                var anchor = null;
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

                if (radio === 'video-popup') {
                    builder.applyMagnificPopup(DOMEelement);
                }
            }

            //this necessary for gallery
            var owl = controls.findParent(DOMEelement, ['spr-gallery']);
            if (owl) {
                $(owl).trigger('refresh.owl.carousel');
            }

            //this necessary for video
            if (radio !== 'video-popup') {
                if (DOMEelement.classList.contains('single-iframe-popup')) DOMEelement.classList.remove('single-iframe-popup');
                var li = controls.findParent(DOMEelement, ['section-item']);
                var script = li.querySelector('script');
                script.innerHTML = script.innerHTML.replace(/\n?\/\/magnific[\s\S]*?\/\/magnificend/im, '');
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
    , _setLink: function(_this, DOMEelement, link, targetLink) {
        if (DOMEelement.tagName === 'A') {
            var args = {
                link: link
                , targetLink: targetLink
            };
            var argsSave = {
                link: DOMEelement.getAttribute('href')
                , targetLink: DOMEelement.target
            };
            _this._changeLink(_this, DOMEelement, args, argsSave);
        } else {
            var a = document.createElement('a');
            a.href = link;
            a.target = targetLink;
            a.classList.add('smooth');
            DOMEelement.parentElement.insertBefore(a, DOMEelement);
            a.wrap(DOMEelement);
            if (DOMEelement.classList.contains('slide-photo')) {
                a.classList.add('slide-photo');
                a.style.position = 'static';
                DOMEelement.classList.remove('slide-photo');
                DOMEelement.removeAttribute('style');
            }
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
        radioControl.className = radioControl.className.replace(/(external-link|section-link|other-page-link|video-popup)/i, '');
        checkbox.className = checkbox.className.replace(/(external-link|section-link|other-page-link|video-popup)/i, '');
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
            a.unWrapOne();
        } else {
            DOMElement = a;
            a.href = '/';
            a.target = '_self';
        }

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

        var typesAnimation = ['none','fade','fade-up','fade-down','fade-left','fade-right','fade-up-right'
            ,'fade-up-left','fade-down-right','fade-down-left'
            ,'flip-up','flip-down','flip-left','flip-right'
            ,'slide-up','slide-down','slide-left','slide-right'
            ,'zoom-in','zoom-in-up','zoom-in-down','zoom-in-left','zoom-in-right','zoom-out'
            ,'zoom-out-up','zoom-out-down','zoom-out-left','zoom-out-right'];

        this._title.innerHTML = '<h4>Element settings</h4>';

        this._elements = null;

        _this._constructModalBody([
                {
                    name: 'MarTop'
                    , func: 'dropDown'
                    , args: {
                    menu: ['0px', '25px', '50px', '75px', '100px', '120px']
                    , title: 'Margin top:'
                    , elClass: 'col-sm-12 col-md-12 col-lg-12'
                    , callback: function() {
                        return  elementStyleMargin[1] ? elementStyleMargin[1] : '0px';
                    }
                }
                }
                , {
                    name: 'MarBottom'
                    , func: 'dropDown'
                    , args: {
                        menu: ['0px', '25px', '50px', '75px', '100px', '120px']
                        , title: 'Margin bottom:'
                        , elClass: 'col-sm-12 col-md-12 col-lg-12'
                        , callback: function() {
                            var marginBottom = elementStyleMargin[3] ? elementStyleMargin[3] : '0px';
                            if (elementStyleMargin[3] === '' && elementStyleMargin[2] !== '')
                                marginBottom = elementStyleMargin[1];
                            return  marginBottom;
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
        var marginLeft = elementStyleMargin[4] ? elementStyleMargin[4] : '0px';
        if (elementStyleMargin[3] === '' && elementStyleMargin[2] !== '') {
            marginLeft = elementStyleMargin[2];
        }

        var argsSave = {
            marginTop: _this._elements.MarTop.querySelector('button').dataset.value
            , marginBottom: _this._elements.MarBottom.querySelector('button').dataset.value
            , animation: _this._elements.animation.querySelector('.dropdown button').dataset.value.replace(/_/i, ' ').toLowerCase()
            , duration: _this._elements.duration.querySelector('input').value.replace(/[^0-9]/, '')
            , delay: _this._elements.delay.querySelector('input').value.replace(/[^0-9]/, '')
            , repeat: _this._elements.repeat.querySelector('.dropdown button').dataset.value.replace(/_/i, ' ').toLowerCase()
            , maginRight: elementStyleMargin[2] ? elementStyleMargin[2] : '0px'
            , maginLeft: marginLeft
        };

        //this is need to create new button because modal-footer will be overloaded
        this._footer.innerHTML = '<button type="button" class="supra-btn btn-default" data-dismiss="modal">Cancel</button>';

        var apply = this._getButton('supra-btn btn-primary', 'Apply', function() {
            var args = {
                marginTop: _this._elements.MarTop.querySelector('button').dataset.value
                , marginBottom: _this._elements.MarBottom.querySelector('button').dataset.value
                , animation: _this._elements.animation.querySelector('.dropdown button').dataset.value.replace(/_/i, ' ').toLowerCase()
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
        el.classList.add('mt-' + args.marginTop.substr(0, args.marginTop.length-2));


        if (cNameBottom && cNameBottom[0] !== undefined) {
            el.classList.remove(cNameBottom[0]);
        }
        el.classList.add('mb-' + args.marginBottom.substr(0, args.marginBottom.length-2));

        el.parentElement.style.margin = args.marginTop + ' ' + args.maginRight + ' ' + args.marginBottom + ' ' + args.maginLeft;

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

        if (args.repeat === 'once') {
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
        } else {
            var repeat = this._elements.repeat.querySelector('.dropdown button');
            duration.removeAttribute('disabled');
            duration.value = 500;
            delay.removeAttribute('disabled');
            delay.value = 0;
            if (repeat.classList.contains('disabled'))
                repeat.classList.remove('disabled');
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
            this._elements.inputImage.querySelector('input').value = src;
            this._elements.inputImageRetina.querySelector('input').value = srcset;
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
                        + builder.replaceQuotes(args.imgPath) + '" srcset="'
                        + builder.replaceQuotes(args.retinaPath) + '" alt="preloader image"/>';
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
                    , elClass: 'col-sm-9 col-md-9 col-lg-9'
                    , type: 'normal'
                }
                }
                , {
                    name: 'BgStyle'

                    , func: 'dropDown'
                    , args: {
                        menu: ['cover', 'auto', 'contain', 'repeat']
                        , title: 'Background style:'
                        , elClass: 'col-sm-9 col-md-9 col-lg-9'
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

        _this._elements.inputImage.querySelector('input').value = src;

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
        args.image = builder.replaceQuotes(args.image);
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

/*
 * @autor: MultiFour
 * @version: 1.0.0
 */


"use strict";

/**
 * controls object contains tools for creating and working the controls buttons
 */
var controls = {
    /**
     *
     * @param _this
     * @param classButton {string}
     * @param classIcon {string} icon into button
     * @param Obj {HTMLElement} editing element on current page
     * @param ObjControl {object} EditorText or some else
     * @returns {Element}
     * @private
     */
    _button: function(_this, classButton, classIcon, Obj, ObjControl) {
        var button = document.createElement('button');
        button.className = classButton;
        button.setAttribute('type', 'button');
        var icon = document.createElement('i');
        icon.className = classIcon;
        button.appendChild(icon);

        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            _this.doThis(Obj, ObjControl, this);
        });

        return button;
    }
    , _getPositionInGallery: function(element, owl) {
        var countScreen = owl.querySelectorAll('.owl-item.active').length;
        var countItems = owl.querySelectorAll('.owl-item:not(.cloned)').length;
        var arr = owl.querySelectorAll('.owl-item');
        if (arr.length !== countItems) arr = Array.prototype.slice.call(arr, countScreen);
        var index = null;
        Array.prototype.forEach.call(arr, function(el, indx) {
            if (el === element) {
                index = indx;
            }
        });

        return index > (countItems - 1) ? index - countItems - 1 : index;
    }
    /**
     * History poin
     * @param li {HTMLElement}
     * @private
     */
    , _moveUp: function(li) {
        if (li.previousSibling
            && !li.previousSibling.classList.contains('nav')
            && !li.classList.contains('footer')) {
            li.parentNode.insertBefore(li, li.previousSibling);

            builder.setStep(function() {
                controls._moveDown(li);
            });
        }
    }
    /**
     * History poin
     * @param li {HTMLElement}
     * @private
     */
    , _moveDown: function(li) {
        if (li.nextSibling
            && !li.nextSibling.classList.contains('footer')
            && !li.classList.contains('nav')) {
            li.parentNode.insertBefore(li, li.nextSibling.nextSibling);

            builder.setStep(function() {
                controls._moveUp(li);
            });
        }
    }
    /**
     * Find paren element for child el
     * @param el {HTMLElement}
     * @param arrClassName {Array} exemple ['buttons-control', 'buttons-control-form']
     * @returns {*} HTMLElement or NULL
     */
    , findParent: function(el, arrClassName) {
        var DOM = el;
        for (var indx in arrClassName) {
            while (DOM !== null && !DOM.classList.contains(arrClassName[indx])) {
                DOM = DOM.parentElement;
            }
            if (DOM === null && arrClassName.length > (indx+1)) {
                DOM = el;
            } else {
                break;
            }
        }
        return DOM;
    }
    , getUpSection: {
        html: function(li) {
            var unactive = '';
            if (li.classList.contains('nav') || li.classList.contains('footer')) unactive = ' unactive';
            return controls._button(this, 'supra-btn btn-control-1' + unactive, 'supra icon-arrow-up', li);
        }
        , doThis: function(li) {
            controls._moveUp(li);
            builder.reloadScript(li);
            if (AOS) AOS.refresh();
        }
    }
    , getDownSection: {
        html: function(li) {
            var unactive = '';
            if (li.classList.contains('nav') || li.classList.contains('footer')) unactive = ' unactive';
            return controls._button(this, 'supra-btn btn-control-1' + unactive, 'supra icon-arrow-down', li);
        }
        , doThis: function(li) {
            controls._moveDown(li);
            builder.reloadScript(li);
            if (AOS) AOS.refresh();
        }
    }
    , getBgSection: {
        html: function(li) {
            return controls._button(this, 'supra-btn btn-control-1', 'supra icon-section-bg', li);
        }
        , doThis: function(li) {
            var modal = new Modal('supra-modal', 'SectionBg', li);
            $(modal).modal('show');
        }
    }
    , getMainSettingsSection: {
        html: function(li) {
            return controls._button(this, 'supra-btn btn-control-1', 'supra icon-equalizer', li);
        }
        , doThis: function(li) {
            if (li.dataset.group === "navigations") {
                var modal = new Modal('supra-modal', 'NavSectionSettings', li);
                $(modal).modal('show');
            } else {
                var modal = new Modal('supra-modal', 'SectionSettings', li);
                $(modal).modal('show');
            }
        }
    }
    , getCopy: {
        html: function(li) {
            var unactive = '';
            if (li.classList.contains('nav') || li.classList.contains('footer')) unactive = ' unactive';
            return controls._button(this, 'supra-btn btn-control-1' + unactive, 'supra icon-copy', li);
        }
        , doThis: function(li) {
            if (!li.classList.contains('nav') && !li.classList.contains('footer')) {
                if (li.querySelector('.spr-gallery')) {
                    var cloneSection = builder.cloneOwlGallery(li);
                    builder.reloadScript(li);
                } else {

                    var cloneSection = li.cloneNode(true);
                    li.parentNode.insertBefore(cloneSection, li.nextSibling);
                }

                var bg = cloneSection.querySelector('.parallax-bg');
                if (bg) {
                    bg.removeAttribute('style');
                    if (skr) skr.refresh();
                }

                var pageObj = builder.getActivePageObject();

                builder.setStep(function () {
                    pageObj.deleteSection(cloneSection);
                });

                controls.rebuildControl(cloneSection);
                pageObj.addSectionToDataPage(cloneSection);

                var form = cloneSection.querySelector('form');
                if (form) {
                    builder.addNewForm(form, cloneSection.children[0], li.children[0].id);
                }

                var maps = cloneSection.querySelectorAll('.g-map');
                if (maps) {
                    Array.prototype.forEach.call(maps, function(map){
                        var oldId = map.id;
                        var id = builder.addNewGMap(map, cloneSection.children[0]);
                        builder.changeIdGMapInScript(cloneSection.querySelector('script'), oldId, id);
                        builder.reloadScript(cloneSection.parentElement);
                    });
                }

                builder.listenerSectionsMouseDown(null, cloneSection.lastChild);
                if (AOS) AOS.refresh();
            }
        }
    }
    , getDel: {
        html: function(li) {
            return controls._button(this, 'supra-btn btn-control-2', 'supra icon-trash2', li);
        }
        , doThis: function(li) {
            if (builder) {
                var modal = new Modal('supra-modal', 'Delete', {
                        page: builder.getActivePageObject()
                        , section: li
                    }
                );
                $(modal).modal('show');
            }
        }
    }
    , getButtonSettings: {
        html: function(Obj) {
            return controls._button(this, 'supra-btn btn-control-1', 'supra icon-pencil', Obj);
        }
        , doThis: function(Obj) {
            var modal = new Modal('supra-modal', 'ButtonSettings', Obj);
            $(modal).modal('show');
        }
    }
    , getImageSettings: {
        html: function(Obj) {
            return controls._button(this, 'supra-btn btn-control-1', 'supra icon-picture', Obj);
        }
        , doThis: function(Obj) {
            if (Obj.classList.contains('spr-option-link-img')) Obj = Obj.querySelector('img');
            var modal = new Modal('supra-modal', 'ImageSettings', Obj);
            $(modal).modal('show');
        }
    }
    , getGMapSettings: {
        html: function(Obj) {
            return controls._button(this, 'supra-btn btn-control-1', 'supra icon-map-marker', Obj);
        }
        , doThis: function(Obj) {
            var li = controls.findParent(Obj, ['section-item']);
            var modal = new Modal('supra-modal', 'GMapSettings', {
                script: li.querySelector('script')
                , li: li
                , map: Obj
            });
            $(modal).modal('show');
        }
    }
    , getElementH: {
        html: function(Obj) {
            var h = Obj.tagName.match(/h([1-4])/i);
            var buttons = document.createDocumentFragment();
            if (h) {
                for(var i = 1; i <= 4; i++) {
                    var active = '';
                    if (i == h[1])
                        active = ' active';
                    buttons.appendChild(controls._button(this, 'supra-btn btn-control-1 h-element' + active, 'supra icon-h' + i, Obj, {n: 'H' + i}));
                }
            }
            return buttons;
        }
        , doThis: function(Obj, H) {
            if (Obj.tagName !== H.n) {
                var prevTimeMark = Date.now();
                var CTimeMark = Date.now()+1;
                var h = document.createElement(H.n);
                var parent = Obj.parentElement.parentElement;
                h.innerHTML = Obj.innerHTML;
                Obj.parentElement.insertBefore(h, Obj);
                for (var index = Obj.attributes.length - 1; index >= 0; --index) {
                    h.attributes.setNamedItem(Obj.attributes[index].cloneNode());
                }
                Obj.classList.add('spr-tm-' + prevTimeMark);
                if (h.className.match(/(\s?spr-[^\s]*)+/i)) {
                    h.className = h.className.replace(/(\s?spr-[^\s]*)+/ig, '').trim();
                }
                h.classList.add('spr-tm-' + CTimeMark);
                Obj.parentElement.removeChild(Obj);
                controls.rebuildControl(parent);

                builder.setStep(function() {
                    controls.historyElementH(Obj.tagName, h, Obj, parent, CTimeMark, prevTimeMark);
                });
            }
        }
    }
    , getElementSettings: {
        html: function(Obj) {
            return controls._button(this, 'supra-btn btn-control-1', 'supra icon-equalizer', Obj);
        }
        , doThis: function(Obj) {
            var li = controls.findParent(Obj, ['section-item', 'modal-dialog']);
            var modal = new Modal('supra-modal', 'ElementSettings', {
                li: li
                , element: Obj
            });
            $(modal).modal('show');
        }
    }
    , getLink: {
        html: function(Obj) {
            var active = '';
            var link = Obj;
            //<a><img></a> or <a><i></i></a>
            if (Obj.tagName !== 'A' && Obj.parentElement.parentElement.tagName === 'A') link = Obj.parentElement.parentElement;
            //<li><a></a></li>
            if (Obj.tagName !== 'A' && Obj.children[0] && Obj.children[0].tagName === 'A') link = Obj.children[0];
            if (link.tagName === 'A') active = ' active';
            return controls._button(this, 'supra-btn btn-control-1' + active, 'supra icon-link2', Obj);
        }
        , doThis: function(Obj, x, button) {
            if (Obj.nodeName === 'LI') Obj = Obj.children[0];
            var modal = new Modal('supra-modal', 'LinkSettings', {element: Obj, button: button});
            $(modal).modal('show');
        }
    }
    , getStaticLink: {
        html: function(Obj) {
            var active = '';
            var link = Obj;
            //<a><img></a> or <a><i></i></a>
            if (Obj.tagName !== 'A' && Obj.parentElement.parentElement.tagName === 'A') link = Obj.parentElement.parentElement;
            //<li><a></a></li>
            if (Obj.tagName !== 'A' && Obj.children[0] && Obj.children[0].tagName === 'A') link = Obj.children[0];
            if (link.tagName === 'A') active = ' active';
            return controls._button(this, 'supra-btn btn-control-1' + active, 'supra icon-link2', Obj);
        }
        , doThis: function(Obj, x, button) {
            if (Obj.nodeName === 'LI') Obj = Obj.children[0];
            var modal = new Modal('supra-modal', 'LinkSettings', {element: Obj, button: button, mode: 'static'});
            $(modal).modal('show');
        }
    }
    , getVideoLink: {
        html: function(Obj) {
            var active = '';
            if (Obj.nodeName === 'DIV') Obj = Obj.children[0];
            if (Obj.nodeName === 'IFRAME' && Obj.src.search(/player\.vimeo\.com|embed/i) !== -1) active = ' active';
            return controls._button(this, 'supra-btn btn-control-1' + active, 'supra icon-link2', Obj);
        }
        , doThis: function(Obj, x, button) {
            var modal = new Modal('supra-modal', 'VideoLinkSettings', {element: Obj, button: button});
            $(modal).modal('show');
        }
    }
    , getFormSettings: {
        html: function(Obj) {
            return controls._button(this, 'supra-btn btn-control-1', 'supra icon-envelope-open', Obj);
        }
        , doThis: function(Obj) {
            var modal = new Modal('supra-modal', 'FormSettings', Obj);
            $(modal).modal('show');
        }
    }
    , getSubscribeFormSettings: {
        html: function(Obj) {
            return controls._button(this, 'supra-btn btn-control-1', 'supra icon-envelope-open', Obj);
        }
        , doThis: function(Obj) {
            var modal = new Modal('supra-modal', 'SubscribeFormSettings', Obj);
            $(modal).modal('show');
        }
    }
    , getCopyElement: {
        html: function(Obj) {
            return controls._button(this, 'supra-btn btn-control-1', 'supra icon-copy', Obj);
        }
        , doThis: function(Obj) {
            var wrap = controls.findParent(Obj, ['buttons-control', 'buttons-control-form']);
            var clone = wrap.cloneNode(true);
            var owlItem = controls.findParent(Obj, ['owl-item']);

            if (owlItem && Obj.classList.contains('item')) {
                var li = controls.findParent(Obj, ['section-item']);
                var script = li.querySelector('script');
                var owl = controls.findParent(owlItem, ['spr-gallery']);
                var cloneOwl = owl.cloneNode(true);
                builder.removeOwlSuperstructure(cloneOwl);

                var position = controls._getPositionInGallery(owlItem, owl);
                var newOwlItem = document.createElement('div');
                newOwlItem.className = 'owl-item';
                var item = owlItem.children[0].cloneNode(true);
                newOwlItem.appendChild(item);
                if (script.innerHTML.search(/magnificPopup/m) !== -1) {
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
                }
                $(owl).trigger('add.owl.carousel', [$(newOwlItem), position]).trigger('refresh.owl.carousel');
                clone = item;
            } else if (Obj.classList.contains('g-map')) {
                var oldId = Obj.id;
                var li = controls.findParent(Obj, ['section-item']);
                var script = li.querySelector('script');
                var id = builder.addNewGMap(Obj, li.children[0]);
                builder.copyFunctionInitGmap(script, oldId, id);
                wrap.parentNode.insertBefore(clone, wrap.nextSibling);
                builder.reloadScript(li);
            } else {
                wrap.parentNode.insertBefore(clone, wrap.nextSibling);
            }
            var child = clone.children[0];
            controls.rebuildControl(clone);

            controls.changePropertyMargin(Obj, wrap);
            controls.changePropertyMargin(child, clone);

            var pageObj = builder.getActivePageObject();

            builder.setStep(function() {
                pageObj.deleteElement(child);
            });
        }
    }
    , getDelElement: {
        html: function(Obj) {
            return controls._button(this, 'supra-btn btn-control-2', 'supra icon-trash2', Obj);
        }
        , doThis: function(Obj) {
            if (builder) {
                var modal = new Modal('supra-modal', 'DeleteElement', Obj);
                $(modal).modal('show');
            }
        }
    }
    , getIconsCheck: {
        html: function(Obj) {
            return controls._button(this, 'supra-btn btn-control-1', 'supra icon-icons', Obj);
        }
        , doThis: function(Obj) {
            var modal = new Modal('supra-modal', 'IconsGallery', Obj);
            $(modal).modal('show');
        }
    }
    , getTextBold: {
        html: function(Obj, editorText) {
            return controls._button(this, 'supra-btn btn-control-1 strong', 'supra icon-bold', Obj, editorText);
        }
        , doThis: function(Obj, editorText, button) {
            if (button.classList.contains('active')) {
                editorText.removeBold(button);
            } else {
                editorText.setBold(button);
            }
        }
    }
    , getTextItalic: {
        html: function(Obj, editorText) {
            return controls._button(this, 'supra-btn btn-control-1 em', 'supra icon-italic', Obj, editorText);
        }
        , doThis: function(Obj, editorText, button) {
            if (button.classList.contains('active')) {
                editorText.removeItalic(button);
            } else {
                editorText.setItalic(button);
            }
        }
    }
    , getTextUpper: {
        html: function(Obj, editorText) {
            return controls._button(this, 'supra-btn btn-control-1 upper', 'supra icon-text-size', Obj, editorText);
        }
        , doThis: function(Obj, editorText, button) {
            if (button.classList.contains('active')) {
                editorText.removeUpper(button);
            } else {
                editorText.setUpper(button);
            }
        }
    }
    , getTextMarker: {
        html: function(Obj, editorText) {
            return controls._button(this, 'supra-btn btn-control-1 mark', 'supra icon-highlight', Obj, editorText);
        }
        , doThis: function(Obj, editorText, button) {
            if (button.classList.contains('active')) {
                editorText.removeMarker(button);
            } else {
                editorText.setMarker(button);
            }
        }
    }
    , getTextUnderline: {
        html: function(Obj, editorText) {
            return controls._button(this, 'supra-btn btn-control-1 ins', 'supra icon-underline', Obj, editorText);
        }
        , doThis: function(Obj, editorText, button) {
            if (button.classList.contains('active')) {
                editorText.removeUnderline(button);
            } else {
                editorText.setUnderline(button);
            }
        }
    }
    , getTextStrikethrough: {
        html: function(Obj, editorText) {
            return controls._button(this, 'supra-btn btn-control-1 del', 'supra icon-strikethrough', Obj, editorText);
        }
        , doThis: function(Obj, editorText, button) {
            if (button.classList.contains('active')) {
                editorText.removeStrikethrough(button);
            } else {
                editorText.setStrikethrough(button);
            }
        }
    }
    , getTextLink: {
        html: function(Obj, editorText) {
            return controls._button(this, 'supra-btn btn-control-1 link', 'supra icon-link2', Obj, editorText);
        }
        , doThis: function(Obj, editorText, button) {
            var modal = new Modal('supra-modal', 'LinkSettings', {
                element: Obj,
                editor: editorText,
                button: button
            });
            $(modal).modal('show');
        }
    }
    , getTextAlignLeft: {
        html: function(Obj, editorText) {
            return controls._button(this, 'supra-btn btn-control-1 left', 'supra icon-text-align-left', Obj, editorText);
        }
        , doThis: function(Obj, editorText, button) {
            if (button.classList.contains('active')) {
                editorText.removeTextAlignLeft(Obj, button);
            } else {
                editorText.setTextAlignLeft(Obj, button);
            }
        }
    }
    , getTextAlignCenter: {
        html: function(Obj, editorText) {
            return controls._button(this, 'supra-btn btn-control-1 center', 'supra icon-text-align-center', Obj, editorText);
        }
        , doThis: function(Obj, editorText, button) {
            if (button.classList.contains('active')) {
                editorText.removeTextAlignCenter(Obj, button);
            } else {
                editorText.setTextAlignCenter(Obj, button);
            }
        }
    }
    , getTextAlignRight: {
        html: function(Obj, editorText) {
            return controls._button(this, 'supra-btn btn-control-1 right', 'supra icon-text-align-right', Obj, editorText);
        }
        , doThis: function(Obj, editorText, button) {
            if (button.classList.contains('active')) {
                editorText.removeTextAlignRight(Obj, button);
            } else {
                editorText.setTextAlignRight(Obj, button);
            }
        }
    }
    , getBgDiv: {
        html: function(Obj) {
            return controls._button(this, 'supra-btn btn-control-1', 'supra icon-section-bg', Obj);
        }
        , doThis: function(Obj) {
            var modal = new Modal('supra-modal', 'DivBg', Obj);
            $(modal).modal('show');
        }
    }
    , getFormPSuccess: {
        html: function(Obj) {
            return controls._button(this, 'supra-btn btn-control-1', 'supra icon-clipboard-check', Obj);
        }
        , doThis: function(Obj) {
            var modal = controls._preparePopupFormToEdit(Obj, 'success');
            $(modal).modal('show');
        }
    }
    , getFormPError: {
        html: function(Obj) {
            return controls._button(this, 'supra-btn btn-control-1', 'supra icon-clipboard-alert', Obj);
        }
        , doThis: function(Obj) {
            var modal = controls._preparePopupFormToEdit(Obj, 'error');
            $(modal).modal('show');
        }
    }
    , historyElementH: function(tag, Obj, prevObj, parent, CTimeMark, prevTimeMark) {
        if (!Obj.parentElement || !Obj.parentElement.parentElement) {
            Obj = parent.querySelector('.spr-tm-' + CTimeMark)
        }
        parent = Obj.parentElement && Obj.parentElement.parentElement ?
            Obj.parentElement.parentElement : parent;
        Obj.parentElement.insertBefore(prevObj, Obj);
        Obj.parentElement.removeChild(Obj);

        var currPageObj = builder.getActivePageObject();
        var editType = currPageObj.getDOMSelf().className.match(/edit-([^ ]*).*/i);
        if (editType && editType[0] !== 'edit-elements') {
            prevObj.removeAttribute('style');
        } else {
            controls.rebuildControl(parent);
        }

        builder.setStep(function() {
            controls.historyElementH(Obj.tagName, prevObj, Obj, parent, prevTimeMark, CTimeMark);
        });
    }
    , getBgPopup: {
        html: function(li) {
            return controls._button(this, 'supra-btn btn-control-1', 'supra icon-section-bg', li);
        }
        , doThis: function(li) {
            var modal = new Modal('supra-modal', 'PopupBg', li);
            $(modal).modal('show');
        }
    }
    /**
     * To insert new modal form to containner #modal-form-container to edit
     * @param Obj {HTMLElement} editing form
     * @param postfix {string}
     * @returns {HTMLElement}
     * @private
     */
    , _preparePopupFormToEdit: function(Obj, postfix) {
        builder.editingSectionForm = controls.findParent(Obj, ['section-item']);
        var section = builder.editingSectionForm.children[0];
        var sectionId = section.id;
        var modalFormContainer = document.getElementById('modal-form-container');

        //if (section.classList.contains('dark')) {
        //    if (modalFormContainer.classList.contains('light')) {
        //        modalFormContainer.classList.remove('light')
        //    }
        //    modalFormContainer.classList.add('dark');
        //} else {
        //    if (modalFormContainer.classList.contains('dark')) {
        //        modalFormContainer.classList.remove('dark')
        //    }
        modalFormContainer.classList.add('light');
        //}

        var modal = this.getPopupForm(section, postfix);

        $(modal).on('shown.bs.modal', function () {
            builder._setControlsElement(null, 'edit-elements');
            builder.activeFormModal = modal;
        });

        $(modal).on('hidden.bs.modal', function () {

            $(modal).off('shown.bs.modal');
            $(modal).off('hidden.bs.modal');

            builder.clearControlElements(modal);

            builder.activeFormModal = null;
        });

        return modal;
    }
    /**
     * To create confirmation popup form for contact and subscribe forms
     * @param section {HTMLElement}
     * @param postfix {string}
     * @returns {HTMLElement}
     */
    , getPopupForm: function(section, postfix) {
        var modal = null;
        var sectionId = section.id;
        var modeStyle = 'light';
        //if (section.classList.contains('dark')) modeStyle = 'dark';

        if (builder.forms[sectionId]
            && builder.forms[sectionId].popupsForForm
            && builder.forms[sectionId].popupsForForm[postfix]) {
            var modalId = builder.forms[sectionId].popupsForForm[postfix];
            modal = document.getElementById(modalId);
        } else {
            modal = document.createElement('div');
            modal.className = 'modal fade modal-confirm flex-center ' + modeStyle;
            modal.id = sectionId + '-' + postfix;
            modal.setAttribute('tabindex', '-1');
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-hidden', 'true');
            modal.innerHTML = options.popupContent[postfix];
            modal.style.display = 'none';

            var style = builder.editingSectionForm.querySelector('style');
            style.innerHTML += '\n'
                + '#' + modal.id + ' .bg {'
                + options.popupContent[postfix + 'Style']
                + '\n}';

            var script = builder.editingSectionForm.querySelector('script');


            if (!builder.forms[sectionId].popupsForForm) {
                builder.forms[sectionId].popupsForForm = {};
            }
            builder.forms[sectionId].popupsForForm[postfix] = modal.id;

            builder.modalFormContainer.appendChild(modal);
        }

        return modal;
    }
    /**
     * Creage group button control according to arrControl
     * @param arrControl {Array} setting in options
     * @param Obj {HTMLElement} For which creating group button control
     * @param className {string}
     * @param ObjControl {object} EditorText or some else
     * @returns {Element}
     */
    , getGroupControl: function(arrControl, Obj, className, ObjControl) {
        var _this = this;
        var buttonGroup = document.createElement('div');
        buttonGroup.className = className;
        buttonGroup.dataset.controls = JSON.stringify(arrControl);
        buttonGroup.setAttribute('role', 'group');
        buttonGroup.dataset.objControl = ObjControl ? 'editor-text' : '';

        if (arrControl) {
            arrControl.forEach(function (element) {
                buttonGroup.appendChild(_this[element].html(Obj, ObjControl));
            });
        }

        return buttonGroup;
    }
    , changePropertyMargin: function(child, wrap) {
        var margin = child.style.margin;
        child.style.transition = 'all 0s ease 0s';
        child.style.removeProperty('width');
        child.style.removeProperty('margin');
        var computedElStyle = window.getComputedStyle(child,null);
        wrap.style.margin = '0';
        var elementStyleMarginTop = computedElStyle.getPropertyValue("margin-top");
        var elementStyleMarginRight = computedElStyle.getPropertyValue("margin-right");
        var elementStyleMarginBottom = computedElStyle.getPropertyValue("margin-bottom");
        var elementStyleMarginLeft = computedElStyle.getPropertyValue("margin-left");

        wrap.style.marginTop = elementStyleMarginTop;
        wrap.style.marginRight = elementStyleMarginRight;
        wrap.style.marginBottom = elementStyleMarginBottom;
        wrap.style.marginLeft = elementStyleMarginLeft;
        child.style.margin = margin;
        if (child.tagName !== 'I' && child.tagName !== 'IMG') {
            child.style.width = '100%';
        }
        setTimeout(function () {
            child.style.removeProperty('transition');
        }, 10);
    }
    /**
     * to build control buttons for elements anew
     * @param wrap
     */
    , rebuildControl: function(wrap) {
        var _this = this;
        var wrapControl = wrap.querySelectorAll('.wrap-control, .wrap-control-element');
        Array.prototype.forEach.call(wrapControl, function(element) {
            var arrControl = JSON.parse(element.dataset.controls);
            var parent = element.parentElement;
            var el = parent.children[0];
            var ObjControl = null;

            if (element.dataset.objControl === 'editor-text') {
                ObjControl = new EditorText(el);
            }

            if (element.classList.contains('wrap-control')) {
                el = parent;
            } else {
                var section = _this.findParent(parent, ['section-item', 'modal-dialog']);
                _this.correctingPosition(parent, section);
            }

            parent.removeChild(element);
            parent.appendChild(controls.getGroupControl(arrControl, el, element.className, ObjControl));
        });
    }
    , correctingPosition: function(wrap, section) {
        if (!wrap.classList.contains('buttons-control-typography')) {
            wrap.addEventListener('mouseenter', function(e) {
                controls.listenerCorrectingPosition(this, e, section);
            });
            wrap.addEventListener('touchstart', function(e) {
                controls.listenerCorrectingPosition(this, e, section);
            });
        }
    }
    , listenerCorrectingPosition: function(wrap, e, section) {
        var wrapControls = wrap.children[wrap.children.length - 1];
        var display = window.getComputedStyle(wrapControls, null).getPropertyValue("display");
        if (display !== 'none') {
            wrapControls.removeAttribute('style');
            var topButtonsControl = 42;

            var top = wrapControls.querySelector('button.supra-btn:first-child').getBoundingClientRect().top;
            var right = wrapControls.querySelector('button.supra-btn:last-child').getBoundingClientRect().right;

            var topSection = section.getBoundingClientRect().top;

            var elBounding = wrap.children[0].getBoundingClientRect();
            var heightElement = elBounding.height;
            var rightElement = elBounding.right;
            var windowsWidth = window.innerWidth;

            var condition = top < topSection || top < 0;

            var owlStage = this.findParent(wrap, ['owl-stage-outer']);
            var nav = builder.main.querySelector('.navbar');
            if (this.findParent(wrap, ['modal-dialog'])) {
                condition = !wrap.lastChild.classList.contains('popup-bg') && top < 0;
            } else if (owlStage) {
                var topOwlStage = owlStage.getBoundingClientRect().top;
                condition = top < topOwlStage;
            } else if (nav && !this.findParent(wrap, ['navbar'])) {
                var topNav = nav.getBoundingClientRect().bottom;
                condition = top < topNav;
            }

            if (condition) {
                if (wrap.lastChild.classList.contains('inside-top')) {
                    wrapControls.style.top = (heightElement - topButtonsControl) + 'px';
                } else {
                    wrapControls.style.top = (heightElement + topButtonsControl) + 'px';
                }
            }
            if (wrap.children[0].className.search(/half-container/) !== -1) {
                if (topSection < 0) {
                    wrapControls.style.top = (heightElement) + 'px';
                } else {
                    wrapControls.style.top = '42px';
                }
            }
            if (windowsWidth - right < 20) {
                wrapControls.style.marginLeft = (rightElement - right) + 'px';
            }
        }
    }
};

/*
 * @autor: MultiFour
 * @version: 1.0.0
 */

"use strict";

var Page = function(name, id, context, mode, targetPageObj) {
    var _this = this;
    this.sections = {};
    this.html = '';
    this.htmlDOM = null;
    this.preloader = null;
    this.load = true;
    this.id = 0;

    switch (mode) {
        case 'copy':
            _this._copy(targetPageObj, name, id);
            break;
        case 'load':
            _this._load(context, name, id);
            break;
        default :
            _this._createPage(context, name, id);
            break;
    }

    this._title = name;
    this._name = toPageName(name);
    this._className = replaceSpace(name);
    this._metaDes = '';
    this._metaKey = '';
    this._metaJs = '';
};

Page.prototype = {

    _selfDOM: null
    , _name: ''
    , _className: ''
    , _title: ''
    , _defaultStyle: 'light-page loading'
    , _metaDes: ''
    , _metaKey: ''
    , _metaJs: ''

    /**
     * Create new Page object which is copy of targetPageObj
     * @param targetPageObj
     * @param name
     * @param id
     * @private
     */
    , _copy: function(targetPageObj, name, id) {
        var _this = this;
        var targetPage = targetPageObj.getDOMSelf();
        var oldPageName = replaceSpace(targetPageObj.getPageName());
        var page = targetPage.cloneNode(true);
        this._selfDOM = page;
        page.classList.remove(oldPageName);
        page.classList.add(name);
        page.dataset.id = id;
        this.id = id;
        page.dataset.name = name;
        if (page.classList.contains('spr-active-page')) {
            page.classList.remove('spr-active-page');
        }

        this.setMetaDes(targetPageObj.getMetaDes());
        this.setMetaKey(targetPageObj.getMetaKey());
        this.setJs(targetPageObj.getJs());
        this.preloader = builder.cloneObject(targetPageObj.preloader);
        var liArray = page.querySelectorAll('.section-item');

        if (page.innerHTML === '' && targetPageObj.htmlDOM) {
            _this.htmlDOM = targetPageObj.htmlDOM.cloneNode(true);
            var buffer = document.createElement('div');
            buffer.appendChild(_this.htmlDOM);
            _this.html = buffer.innerHTML;
            liArray = buffer.querySelectorAll('.section-item');
        } else {
            _this.moveChildrenToHtmlDOM(page);
        }

        Array.prototype.forEach.call(liArray, function (li) {
            _this.addSectionToDataPage(li);
        });

        var next = targetPage.nextElementSibling;
        var parent = targetPage.parentElement;
        parent.insertBefore(page, next);
    }
    /**
     * Create new Page object which is loaded from storaje or project.supra
     * @param context
     * @param name
     * @param id
     * @private
     */
    , _load: function(context, name, id) {
        var targetPage = context.querySelector('.' + name);
        var page = targetPage;
        page.dataset.id = id;
        this.id = id;
        this._selfDOM = page;
        var animations = page.querySelectorAll('.aos-animate');
        Array.prototype.forEach.call(animations, function(el) {
            if (el.classList.contains('aos-animate')) {
                el.classList.remove('aos-animate')
            }
        });
    }
    /**
     * Create new Page object
     * @param context
     * @param name
     * @param id
     * @private
     */
    , _createPage: function(context, name, id) {
        var page = document.createElement('ul');
        page.style.minHeight = window.innerHeight + 'px';
        this._selfDOM = page;
        page.className = name + ' ' +  this._defaultStyle;
        page.dataset.id = id;
        this.id = id;
        page.dataset.name = name;
        context.appendChild(page);
        page.innerHTML = '<div class="wrap-drag flex-center">'
            + '<p><i class="icon-reply"></i>Start creating pages by dragging/clicking sections from the left panel</p>'
            + '</div>';
        if (id > 0) {
            this.moveChildrenToHtmlDOM(page);
            this.load = true;
        }
    }
    /**
     * Add section to page
     * @param sectionsItem {HTMLElement} from right submenu
     * @param className {string}
     * @param defaultStyleType {string}
     * @param li {HTMLElement}
     * @param next {HTMLElement} section after new section
     */
    , addSection: function(sectionsItem, className, defaultStyleType, li, next) {
        var _this = this;
        var triggerCElements = false;
        if (!li) {
            li = _this._createSection(sectionsItem, className, defaultStyleType, next);
            triggerCElements = true;
        }

        var section = li.children[0];

        this.addSectionToDataPage(li);

        if (triggerCElements && section.id.search(/--/) === -1) {
            _this.sections[li.dataset.group][section.id].modal = [];
            var modals = li.querySelectorAll('.modal');
            if (modals) {
                Array.prototype.forEach.call(modals, function(modal){
                    builder.modalContainer.appendChild(modal);
                    _this.sections[li.dataset.group][section.id].modal.push(modal.id);
                });
            }
        } else if (triggerCElements && section.id.search(/--/) !== -1) {
            var modals = li.querySelectorAll('.modal');
            if (modals) {
                Array.prototype.forEach.call(modals, function(modal){
                    modal.parentElement.removeChild(modal);
                });
            }
        }

        if (triggerCElements) {
            var form = section.querySelector('form');
            if (form) {
                builder.addNewForm(form, section);
            }

            var map = section.querySelector('.g-map');
            if (map) {
                var id = builder.addNewGMap(map, section, li.querySelector('script'));
                builder.changeIdGMapInScript(li.querySelector('script'), id);
            }
        }

        var position = window.getComputedStyle(section, null).getPropertyValue("position");
        if (position === "fixed" || position === "absolute") {
            builder.setPosition(section, li, position, 1095);
            var heightLi = window.getComputedStyle(section, null).getPropertyValue("height");
            li.style.height = heightLi;
        }

        if (li.classList.contains('nav')) {
            _this._selfDOM.dataset.nav = 1;
        } else if (li.classList.contains('footer')) {
            _this._selfDOM.dataset.footer = 1;
        }

        if (!builder.triggerImport) {
            var currPageObj = _this;
            var activeItem = builder.getActivePageItem(currPageObj.id);
            var parent = li.parentElement;
            var next = li.nextElementSibling;
            builder.setStep( function() {
                var currentPageObj = builder.getActivePageObject();
                if (currPageObj && currPageObj.id !== currentPageObj.id ) {
                    builder.chengeActivePage(currPageObj, activeItem, currPageObj.id)
                }
                if (builder.activeFormModal) {
                    $(builder.activeFormModal).modal('hide');
                    builder.activeFormModal.style.display = 'none';
                }
                _this.deleteSection(li, parent, next);
            });
        }

        builder.sectionClicked = null;
    }
    /**
     * Creating new section. Content will be extracted from sectionsPreview
     * @param sectionsItem
     * @param className
     * @param defaultStyleType
     * @param next
     * @returns {Element}
     * @private
     */
    , _createSection: function(sectionsItem, className, defaultStyleType, next) {
        var _this = this;
        var li = document.createElement('li');
        li.className = 'section-item ' + className;
        li.dataset.group = sectionsItem.dataset.group;
        li.dataset.img = sectionsItem.querySelector('img').src;
        li.innerHTML = sectionsPreview[sectionsItem.dataset.group].sections[sectionsItem.dataset.id].html;

        var section = li.children[0];

        if (defaultStyleType !== ''
            && !section.classList.contains('light')
            && !section.classList.contains('dark')) section.classList.add(defaultStyleType);

        var style = document.createElement('style');
        style.innerHTML = sectionsPreview[sectionsItem.dataset.group].sections[sectionsItem.dataset.id].style;
        li.appendChild(style);

        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        var overAllJs = sectionsPreview[sectionsItem.dataset.group].overallJs;
        if (overAllJs) {
            script.innerHTML = "//delete\n"
                + "setTimeout(function(){"
                + sectionsPreview[sectionsItem.dataset.group].overallJs
                + "\n}, 2);\n"
                + "//deleteend";
        }
        var sectionScript = sectionsPreview[sectionsItem.dataset.group].sections[sectionsItem.dataset.id].script || '';
        var startTimeOut = "//delete\n"
            + "setTimeout(function(){\n"
            + "//deleteend\n";
        var endTimeOut = "\n//delete\n"
            + "}, 2);\n"
            + "//deleteend";
        if (sectionScript.search(/owlCarousel/im) === -1) {
            startTimeOut = endTimeOut = '';
        }
        script.innerHTML += "\n"
            + startTimeOut
            + sectionScript
            + endTimeOut;
        li.appendChild(script);

        var wrapControls = controls.getGroupControl(
            options.controlsSection
            , li
            , 'btn-group flex-center wrap-control'
        );
        li.appendChild(wrapControls);

        builder.listenerSectionsMouseDown(null, wrapControls);

        if (className === 'nav' && this._selfDOM.querySelector('li')) {
            this._selfDOM.insertBefore(li, this._selfDOM.querySelector('li'));
        } else if (next) {
            this._selfDOM.insertBefore(li, next);
        } else if (className === '' && this._selfDOM.querySelector('li.footer')) {
            this._selfDOM.insertBefore(li, this._selfDOM.querySelector('li.footer'));
        } else {
            this._selfDOM.appendChild(li);
        }

        if (li.querySelector('.parallax-bg')) {
            li.classList.add('parallax');
            var bg = li.querySelector('.bg');
            bg.dataset.topBottom = 'transform:translate3d(0px, 25%, 0px)';
            bg.dataset.bottomTop = 'transform:translate3d(0px, -25%, 0px)';
            if (skr) {
                skr.refresh();
            }
        }

        return li;
    }
    /**
     *
     * @param li {HTMLElement} current section
     * @param parent {HTMLElement} page
     * @param next {HTMLElement} next section
     */
    , deleteSection: function(li, parent, next, mode) {
        var _this = this;
        var section = li.children[0];
        var sectionGroup = li.dataset.group;

        if (li.classList.contains('nav')) {
            _this._selfDOM.dataset.nav = 0;
        } else if (li.classList.contains('footer')) {
            _this._selfDOM.dataset.footer = 0;
        }

        var formConfirms = null;
        var modals = {};
        var form = section.querySelector('form');
        if (form) {
            formConfirms = builder.forms[section.id];
            if (builder.forms[section.id].popupsForForm) {
                for (var popup in builder.forms[section.id].popupsForForm) {
                    var modalId = builder.forms[section.id].popupsForForm[popup];
                    var modal = document.getElementById(modalId);
                    modals[popup] = modal;
                    builder.modalFormContainer.removeChild(modal);
                }
            }

            delete builder.forms[section.id];
        }

        var parent = parent || li.parentElement;
        var next = next || li.nextElementSibling;

        var currPageObj = _this;
        var activeItem = builder.getActivePageItem(currPageObj.id);

        builder.setStep( function() {

            var currentPageObj = builder.getActivePageObject();
            if (currPageObj && currPageObj.id !== currentPageObj.id ) {
                builder.chengeActivePage(currPageObj, activeItem, currPageObj.id);
            }

            builder.removeWrapDrag();
            if (next) {
                parent.insertBefore(li, next);
            } else {
                parent.appendChild(li);
            }
            _this.addSection(null, null, null, li);
            controls.rebuildControl(li);
            builder._refreshParallax(li);
            builder._reloadVideoBg(li, 'run');
            builder.listenerSectionsMouseDown(null, li.lastChild);
            if (formConfirms) {
                builder.forms[section.id] = formConfirms;
                if (Object.keys(modals).length > 0) {
                    for (var popup in modals) {
                        builder.modalFormContainer.appendChild(modals[popup]);
                    }
                }
            }
        });

        parent.removeChild(li);

        delete this.sections[sectionGroup][section.id];
        if (Object.keys(this.sections[sectionGroup]).length === 0) {
            delete this.sections[sectionGroup];
        }

        if (this._selfDOM.innerHTML.trim() === '' && mode !== 'replace') {
            builder.addWrapDrag();
        }
    }
    /**
     *
     * @param DOM {HTMLElement}
     */
    , deleteElement: function(DOM, wrap) {
        var _this = this;
        var ElForDel = DOM;
        var delFuncGMap = '';
        var script = null;

        var nextElement = DOM.nextElementSibling;
        if (DOM.parentElement.className.search(/buttons-control/i) !== -1) {
            ElForDel = DOM.parentElement;
            wrap = DOM.parentElement;
            nextElement = ElForDel.nextElementSibling ? ElForDel.nextElementSibling.children[0] : null;
        }
        //if (ElForDel.parentElement.className.search(/buttons-control/i) !== -1) ElForDel = ElForDel.parentElement;
        var parent = ElForDel.parentElement;
        var next = ElForDel.nextElementSibling;

        var owlItem = controls.findParent(DOM, ['owl-item']);
        if (owlItem && DOM.classList.contains('item')) {
            var owl = controls.findParent(owlItem, ['spr-gallery']);
            var position = controls._getPositionInGallery(owlItem, owl);
            $(owl).trigger('del.owl.carousel', position).trigger('refresh.owl.carousel');
        }

        if (DOM.classList.contains('g-map')) {
            var li = controls.findParent(DOM, ['section-item']);
            script = li.querySelector('script');
            delFuncGMap = builder.deleteFunctionInitGmap(script, DOM.id);
        }

        var currPageObj = _this;
        var activeItem = builder.getActivePageItem(currPageObj.id);

        builder.setStep(function() {
            var ElForAppend = DOM;
            var mode = document.querySelector('aside.left nav li.active').id;
            if (mode !== 'default-styles') {
                ElForAppend.removeAttribute('style');
                next = nextElement;
            } else {
                ElForAppend = wrap;
                if (wrap.children.length < 2) {
                    wrap.appendChild(DOM);
                    next = next.parentElement;
                }
            }
            var currentPageObj = builder.getActivePageObject();
            if (currPageObj && currPageObj.id !== currentPageObj.id ) {
                builder.chengeActivePage(currPageObj, activeItem, currPageObj.id)
            }
            if (owlItem && DOM.classList.contains('item')) {
                var newOwlItem = document.createElement('div');
                newOwlItem.className = 'owl-item';
                var item = document.createElement('div');
                item.className = 'item';
                item.appendChild(ElForAppend);
                newOwlItem.appendChild(item);
                $(owl).trigger('add.owl.carousel', [$(newOwlItem), position]).trigger('refresh.owl.carousel');
            } else {
                if (delFuncGMap !== '' && script) {
                    script.innerHTML += delFuncGMap;
                }
                if (parent) {
                    if (next) {
                        parent.insertBefore(ElForAppend, next);
                    } else {
                        parent.appendChild(ElForAppend);
                    }
                }

                if (mode === 'default-styles') {
                    controls.rebuildControl(ElForAppend);
                }

            }


            var currPageObjS = _this;
            var activeItemS = builder.getActivePageItem(currPageObjS.id);

            builder.setStep(function() {
                var currentPageObj = builder.getActivePageObject();
                if (currPageObjS && currPageObjS.id !== currentPageObj.id ) {
                    builder.chengeActivePage(currPageObjS, activeItemS, currPageObjS.id)
                }
                currPageObjS.deleteElement(DOM, wrap);
            });
        });

        ElForDel.parentElement.removeChild(ElForDel);
    }
    /**
     *
     * @param li {HTMLElement}
     */
    , addSectionToDataPage: function(li) {
        var section = li.children[0];
        var group = li.dataset.group;
        var style = li.querySelector('style');
        if (this.sections[group] === undefined) {
            this.sections[group] = {};
        }

        while (this.sections[group][section.id] !== undefined) {
            var args = section.id.split('--');
            if (args[1]) {
                section.id = args[0] + '--' + ((args[1] * 1) + 1);
            } else {
                section.id = args[0] + '--0';
            }

        }
        if (section.id.split('--')[1]) {
            var pattern = new RegExp('#' + section.id.split('--')[0] + '(--[0-9]*)?\\s', 'gim');
            style.innerHTML = style.innerHTML.replace(pattern, '#' + section.id + ' ');
        }

        builder.sectionsName.push(section.id);

        if (this.sections[group][section.id] === undefined) {
            this.sections[group][section.id] = {};
        }
        this.sections[group][section.id].html = li;
    }
    , getDOMSelf: function() {
        return this._selfDOM;
    }
    , getPageName: function() {
        return this._name;
    }
    , setPageName: function(newName, encode) {
        if (!encode)
            newName = htmlencode(newName);
        else newName = newName;
        this._selfDOM.classList.remove(this._className);
        this._name = newName;
        newName = replaceSpace(newName);
        this._className = newName;
        this._selfDOM.classList.add(newName);
        this._selfDOM.dataset.name = newName;
    }
    , getMetaDes: function() {
        return this._metaDes;
    }
    , setMetaDes: function(metaDes, encode) {
        if (!encode)
            this._metaDes = htmlencode(metaDes);
        else this._metaDes = metaDes;
    }
    , getMetaKey: function() {
        return this._metaKey;
    }
    , setMetaKey: function(metaKey, encode) {
        if (!encode)
            this._metaKey = htmlencode(metaKey);
        else this._metaKey = metaKey;
    }
    , getJs: function() {
        return this._metaJs;
    }
    , setJs: function(metaJs, encode) {
        if (!encode)
            this._metaJs = htmlencode(metaJs);
        else this._metaJs = metaJs;
    }
    , getPageTitle: function() {
        return this._title;
    }
    , setPageTitle: function(newTitle, encode) {
        if (!encode)
            this._title = htmlencode(newTitle);
        else this._title = newTitle;
        if (this._selfDOM.classList.contains('spr-active-page'))
            document.title = this._title;
    }
    , moveChildrenToHtmlDOM: function(page) {
        var animations = page.querySelectorAll('.aos-animate');
        Array.prototype.forEach.call(animations, function(el) {
            if (el.classList.contains('aos-animate')) {
                el.classList.remove('aos-animate')
            }
        });
        var vides = page.querySelectorAll('.bg-video');
        if (vides) {
            Array.prototype.forEach.call(vides, function (vide, indx) {
                if ($(vide).data('vide')) {
                    $(vide).data('vide').destroy();
                } else {
                    var video = vide.querySelector('video');
                    if (video) video.pause();
                }
            });
        }
        this.html = page.innerHTML;
        var childrenPage = document.createDocumentFragment();
        while (page.children.length > 0) {
            childrenPage.appendChild(page.children[0]);
        }
        this.htmlDOM = childrenPage;
        this.load = false;
    }
    , extractContent: function() {
        var _this = this;
        if (_this.load) {
            var buffer = document.createElement('div');
            buffer.innerHTML = _this.html;
            _this.moveChildrenToHtmlDOM(buffer);
            _this.load = false;
            _this._selfDOM.appendChild(_this.htmlDOM);
            builder.clearGalleryOnPage(_this._selfDOM);
            builder.reloadScript(_this._selfDOM);
        } else {
            _this._selfDOM.appendChild(_this.htmlDOM);
        }
    }
};

/*
 * @autor: MultiFour
 * @version: 1.0.0
 */

"use strict";

var Suprabuilder = function() {
    var _this = this;

    this.main = document.querySelector('.main');
    this.main.style.minHeight = window.innerHeight + 'px';
    /**
     * Create index page
     */
    this._pages.push(new Page('index', 0, this.main));
    this._pages[this._idActivePage].getDOMSelf().classList.add('edit-sections');
    this._pages[this._idActivePage].getDOMSelf().classList.add('spr-active-page');
    this._pages[this._idActivePage].getDOMSelf().classList.add('light-page');
    /**
     * Init left navigations
     */
    _this._leftNav = document.querySelector('aside.left nav');
    _this._leftNav.items = [];
    var leftNavButtons = _this._leftNav.querySelectorAll('li');
    Array.prototype.forEach.call(leftNavButtons, function(element){
        if (element.id !=="" && document.querySelector('aside.control-panel .' + element.id) !== null) {
            _this._leftNav.items.push({
                leftNavButton: element
                , rightcontrol: document.querySelector('aside.control-panel .' + element.id)
            });
        }
    });

    this._leftNav.items[0].leftNavButton.classList.add('active');
    this._leftNav.items[0].rightcontrol.classList.add('show');

    this._selectionNavLeftBtn();

    this._undo = _this._leftNav.querySelector('li.undo');
    this._redo = _this._leftNav.querySelector('li.redo');
    this._selectionNavUndo();
    this._selectionNavRedo();

    /**
     * Init right side
     */
    this._controlPanel.self = document.querySelector('aside.control-panel');
    this._controlPanel.title = this._controlPanel.self.querySelector('.title');
    this._controlPanel.sections = {self: document.querySelector('aside.add-sections-items')};
    this._showHideControlPanel();

    /**
     * Init sections
     */
    this._controlPanel.sections.items = this._controlPanel.sections.self.querySelectorAll('ul li');
    this._controlPanel.controlMenu = this._controlPanel.self.querySelector('.sections');
    this._selectionSectionsItem();
    this._selectionControlMenuItem();

    /**
     * Init style
     */
    this._controlPanel.style = {self: this._controlPanel.self.querySelector('.default-styles')};
    this._controlPanel.style.spectrum = _this._controlPanel.style.self.querySelectorAll('ul li .spectrum');
    this._controlPanel.style.btnApply = _this._controlPanel.style.self.querySelector('button.apply');
    this._controlPanel.style.btnGroupStyle = _this._controlPanel.style.self.querySelectorAll('.btn-group button');
    this._controlPanel.style.ul = _this._controlPanel.style.self.querySelectorAll('ul');
    this._style.html = this.main.querySelector('style');
    this._initStyle();
    this._selectionGroupButtonStyle();
    this._applyStyle();

    /**
     * Init typography
     */
    this._controlPanel.typography = {self: this._controlPanel.self.querySelector('.typography')};
    this._controlPanel.typography.items = this._controlPanel.typography.self.querySelectorAll('li .item');
    this._controlPanel.typography.btnApply = _this._controlPanel.typography.self.querySelector('button.apply');
    this._initTypography();
    this._selectionFonts();
    this._selectionFontStyle();
    this._applyTypography();

    /**
     * Init project page
     */
    this._controlPanel.ProjectPages = {self: this._controlPanel.self.querySelector('.project-pages')};
    this._addProjectPagesToRightSide();
    this._callNewProject();
    this._callExport();
    this._callImport();
    this._callDownload();


    /**
     * Init message box
     */
    this._messageBox();


    window.addEventListener('load', function(){


        if(!window.localStorage.version
            || window.localStorage.version*1 < _this.currentVersion*1) {

            delete window.localStorage.project;
            window.localStorage.version = _this.currentVersion;
            removePreloader();
        }

        /**
         * Load project
         */
        if(window.localStorage.project) {
            try {
                _this._loadProject(window.localStorage.project);
            }
            catch(e) {
                delete window.localStorage.project;
                _this._error = true;
                location.reload();
            }
        } else {
            document.title = _this.getActivePageObject().getPageTitle();
        }

        /**
         * Save current project
         */
        if (window.onbeforeunload === undefined) {
            document.querySelector('html').addEventListener('mouseleave', function(){
                if (_this.sectionsName.length > 0) {
                    _this._prepareContentPagesToSave();
                }
            });
        } else {
            window.onbeforeunload = function() {
                if (_this.sectionsName.length > 0 && !_this._error) {
                    _this._prepareContentPagesToSave();
                }

                if (navigator.userAgent.match(/MSIE|Trident|Edge|IEMobile/)) {
                    var message = "This project is not saved.";
                    return message;
                } else {
                    return null;
                }
            };
        }
    });

    this.modalContainer = document.getElementById('modal-project-container');
    this.modalFormContainer = document.getElementById('modal-form-container');
};

Suprabuilder.prototype = {
    currentVersion: 261
    , _leftNav: {}
    , _controlPanel: {}
    , _fixedRightSide: false
    , main: null
    , wrapDrag: null
    , _triggerDownload: false
    , _triggerExport: false
    , _triggerImport: false
    , _triggerElementEnter: false

    /**
     * Variables for drag & drop sections
     */
    , _dropImg: null
    , _dropX: 0
    , _dropY: 0
    , _touchY: 0
    , sectionClicked: null
    , _nextPageForHistory: null
    , _triggerClickSection: false
    , _sectionDropped: false
    , _touch: false
    , _markerSection: null
    , _triggerMoveSectionInMain: false
    , _triggerClickSectionInMain: false
    , _lockEndDrag: false
    , _draggableSection: null
    , _elCurGrabbing: null

    // for work with magnific if mode is 'edit-typography'
    , editingText: false


    , sectionsName: []
    , _pages: []
    , _idActivePage: 0
    , _triggerInitProject: false
    , gMaps: []

    /**
     * Forms
     */
    , activeFormModal: null
    , editingForm: null
    , forms: {}


    , _style: {}
    , defaultStyleType: 'light'
    , editingStyle: 'light'
    , modalContainerStyleHtml: null
    , arrayFontsOnProject: []

    /**
     * Hystory project
     */
    , arrayPrevStep: []
    , arrayNextStep: []
    , triggerUndo: false
    , triggerRedo: false
    , triggerImport: false

    , _arrEditorText: []
    , _arrListenersEditElement: []

    /**
     * Indicating existence some applications in project
     */
    , _videoBg: false
    , _owlGallery: false
    , _formSection: false
    , _smooth: false
    , _parallax: false
    , _magnific: false
    , _aos: false

    , _magnificScript: ''

    , _error: false


    /**
     * evetns for styling parent elements
     */
    , _eventMoseEnterOnChildActive: function(e) {
        var parent = this;
        parent.classList.add('child-active');
    }
    , _evetnMoseLeaveOnChildActive: function(e) {
        var parent = this;
        if (parent.classList.contains('child-active')) {
            parent.classList.remove('child-active');
        }
    }
    /**
     * ------------------------------ Selecting items into navigations or buttons of group --------------------------
     */

    /**
     * @param item {HTMLElement} element which will be activated
     * @param className {string} class of element which will be deactivated
     * @public
     */
    , selection: function(item, className, classActive) {
        classActive = classActive || 'active';
        className = className || '.active';
        if (!item.classList.contains(classActive)) {
            if (item.parentElement.querySelector(className)) {
                item.parentElement.querySelector(className).classList.remove(classActive);
            }
            item.classList.add(classActive);
        }
    }
    /**
     * @param item {HTMLElement} element which will be activated or deactivated
     * @private
     */
    , _selectionWithSelfUnactive: function(item) {
        if (!item.classList.contains('active')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
            item.blur();
        }
    }
    /**
     *
     * @private
     */
    , _selectionNavLeftBtn: function() {
        var _this = this;
        this._leftNav.items.forEach(function(element){
            element.leftNavButton.addEventListener('click', function(){
                element.rightcontrol.parentElement.querySelector('.show:not(aside)').classList.remove('show');
                element.rightcontrol.classList.add('show');
                _this.selectionEditMode(this.id);
                _this._controlPanel.title.children[0].innerHTML = firstUp(this.id.replace(/-/i, ' '));

                if (window.innerWidth < 1025 && this.classList.contains('active')) {
                    if (_this._controlPanel.self.parentElement.classList.contains('thin')) {
                        _this._showControlPanel(_this);
                    } else {
                        _this._hideControlPanel(_this);
                    }
                } else if (window.innerWidth < 1025
                    && !this.classList.contains('active')) {
                    _this._showControlPanel(_this);
                }

                _this.selection(this);
            });
        });
        _this._touchHideControlPanel();
    }
    /**
     * @param mode {string} mode of editing
     * @public
     */
    , selectionEditMode: function(mode) {
        var _this = this;
        var pageObj = _this.getActivePageObject();
        var page = pageObj.getDOMSelf();
        var pageName = replaceSpace(pageObj.getPageName());
        var modalFormContainer = document.getElementById('modal-form-container');
        _this.clearControlElements(page);
        _this.clearControlElements(modalFormContainer);
        switch (mode) {
            case 'sections':
                _this._chengePageMode(page, 'edit-sections');
                document.addEventListener('mousemove', _this.listenerDocumentMousemove);
                document.addEventListener('mouseup', _this.listenerDocumentMouseUp);
                document.addEventListener('touchend', _this.listenerDocumentTouchend);
                _this._setControlsElement(null, 'edit-sections');
                break;

            case 'default-styles':
                _this._chengePageMode(page, 'edit-elements');
                _this._setControlsElement(pageName, 'edit-elements');
                break;

            case 'typography':
                _this._chengePageMode(page, 'edit-typography');
                _this._setControlsElement(pageName, 'edit-typography');
                break;

            case 'project-pages':
                _this._chengePageMode(page, 'edit-project-page');

                var ul =  _this._controlPanel.ProjectPages.self.querySelector('ul');
                if (!ul.classList.contains('scrl')) {
                    ul.classList.add('scrl');
                    var top = _this._controlPanel.title.getBoundingClientRect().bottom;
                    var bottom = _this._controlPanel.self.querySelector('.btn-ex-im-d').getBoundingClientRect().top;
                    var pageItem = ul.children[ul.children.length - 1];
                    var pageItemHeight = pageItem.clientHeight;
                    ul.style.height = bottom - top - pageItemHeight + 'px';
                    $(ul).niceScroll({cursorcolor: "#555555", cursorborder: "1px solid #555555", autohidemode: "scroll", hidecursordelay: 0});
                    _this._pinBottom(_this, pageItem);
                }
                break;
        }

        if ( mode !== 'sections') {
            if (_this._controlPanel.sections.self.classList.contains('show')
                && window.innerWidth > 500) {
                _this._hideSections(_this);
            }

            document.removeEventListener('mousemove', _this.listenerDocumentMousemove);
            document.removeEventListener('mouseup', _this.listenerDocumentMouseUp);
            document.removeEventListener('touchend', _this.listenerDocumentTouchend);
        }

        if (mode !== '') {
            var childEvents = document.querySelectorAll('.child-event');
            Array.prototype.forEach.call(childEvents, function(el){
                if (_this._eventMoseEnterOnChildActive)
                    el.removeEventListener('mouseenter', _this._eventMoseEnterOnChildActive);
                if (_this._evetnMoseLeaveOnChildActive)
                    el.removeEventListener('mouseleave', _this._evetnMoseLeaveOnChildActive);
            });
        }
    }
    /**
     * @param page {HTMLElement}
     * @param className {string} class mame according to mode editing
     * @private
     */
    , _chengePageMode: function(page, className) {
        var modalFormContainer = document.getElementById('modal-form-container');
        if (page.className.search(/edit-/i) === -1) {
            page.classList.add(className);
            modalFormContainer.classList.add(className);
        } else {
            var editType = page.className.match(/edit-([^ ]*).*/i);
            page.classList.remove('edit-' + editType[1]);
            page.classList.add(className);
            if (modalFormContainer.className.search(/edit-/i) !== -1) {
                modalFormContainer.classList.remove('edit-' + editType[1]);
            }
            modalFormContainer.classList.add(className);
        }

        // crutch for owl for editing text inside owl item
        window.disMouseDrag = false;

        if (className === 'edit-typography') {
            window.disMouseDrag = true;
        }
    }
    , _showHideControlPanel: function() {
        var _this = this;
        function is_touch_device() {
            try {
                document.createEvent("TouchEvent");
                return false;
            } catch (e) {
                return false;
            }
        }
        if (!('ontouchstart' in window) && !navigator.maxTouchPoints) {
            this._controlPanel.self.addEventListener('mouseout', function (e) {
                /**
                 * need to use event mouseout and checking right for Safari
                 */
                var right = null;
                if (_this._controlPanel.sections.self.classList.contains('show')) {
                    right = _this._controlPanel.sections.self.getBoundingClientRect().right - 10;
                } else {
                    right = this.getBoundingClientRect().right - 10;
                }
                var boundingSect = _this._controlPanel.sections.self.getBoundingClientRect();
                var top = boundingSect.top;
                var bottom = boundingSect.bottom;
                if (e.clientX >= right || e.clientY <= top || e.clientY >= bottom) {
                    _this._hideControlPanel(_this);
                }
            });
            this._leftNav.parentElement.addEventListener('mouseover', function () {
                _this._showControlPanel(_this);
            });
            _this._controlPanel.self.querySelector('i.bookmark').addEventListener('click', function () {
                if (!_this._controlPanel.self.classList.contains('pin')) {
                    _this._controlPanel.self.classList.add('pin');
                    _this._fixedRightSide = true;
                } else {
                    _this._controlPanel.self.classList.remove('pin');
                    _this._fixedRightSide = false;
                }
            });
        }
    }
    , _showControlPanel: function(_this) {
        if (_this._controlPanel.self.parentElement.classList.contains('thin')) {
            _this._controlPanel.self.parentElement.classList.remove('thin');
            setTimeout(function(){
                $('aside.control-panel').getNiceScroll().resize();
            }, 800);
        }
    }
    , _hideControlPanel: function(_this) {
        if (!_this._controlPanel.self.parentElement.classList.contains('thin')
            && !_this._fixedRightSide
        ) {
            if (_this._controlPanel.sections.self.querySelector('.active')) {
                _this._controlPanel.sections.self.querySelector('.active').classList.remove('active');
            }
            _this._controlPanel.self.parentElement.classList.add('thin');
            if (window.innerWidth > 500) {
                if (_this._controlPanel.sections.self.classList.contains('show')) {
                    _this._hideSections(_this);
                    _this._fixedRightSide = false;
                }
            }
        }
    }
    , _touchHideControlPanel: function() {
        var _this = this;
        this.main.addEventListener('touchstart', function() {
            _this._hideControlPanel(_this);
        });
    }
    /**
     * Selecting items of section group
     * @private
     */
    , _selectionControlMenuItem: function() {
        var _this = this;
        var sectionsNavItems = _this._controlPanel.controlMenu.querySelectorAll('ul li');
        Array.prototype.forEach.call(sectionsNavItems, function(element, indx, arr) {
            element.addEventListener('click', function() {
                var navItem = this;
                Array.prototype.forEach.call(_this._controlPanel.sections.items, function(element) {
                    if (element.dataset.group === navItem.innerHTML.toLowerCase()) {
                        element.style.display = 'flex';
                    } else {
                        element.style.display = 'none';
                    }
                });

                if (!_this._controlPanel.sections.self.classList.contains('show')) {
                    _this._controlPanel.sections.self.classList.add('show');
                }

                if (window.innerWidth < 501) {
                    var liForSections = _this._controlPanel.controlMenu.querySelector('li.nopadding');
                    if (!liForSections) {
                        liForSections = document.createElement('li');
                        liForSections.className = 'nopadding';
                        liForSections.appendChild(_this._controlPanel.sections.self);
                    } else {
                        liForSections.style.height = '0';
                    }
                    if (navItem.classList.contains('active')) {
                        liForSections.style.height = '0';
                        navItem.classList.remove('active');
                    } else {
                        _this._controlPanel.controlMenu.insertBefore(liForSections, navItem.nextSibling);
                        liForSections.style.height = _this._controlPanel.sections.self.getBoundingClientRect().height + 'px';
                        _this.selection(this);
                    }
                    setTimeout(function(){
                        $('aside.control-panel').getNiceScroll().resize();
                    }, 800);
                } else {
                    _this.selection(this);
                }
            });
        });

        _this._controlPanel.sections.self.addEventListener('mouseout', function(e){
            /**
             * need to use event mouseout and checking left/right for Safari
             */
            var right = this.getBoundingClientRect().right;
            var boundingSect = _this._controlPanel.sections.self.getBoundingClientRect();
            var top = boundingSect.top;
            var bottom = boundingSect.bottom;
            if ((e.clientX >= right || e.clientY <= top || e.clientY >= bottom)
                && _this._controlPanel.sections.self.classList.contains('show')
                && !_this._fixedRightSide
                && window.innerWidth > 500) {
                _this._hideSections(_this);

                _this._hideControlPanel(_this);

            }
        });
    }
    /**
     * add section from section group menu
     * @private
     */
    , _selectionSectionsItem: function() {
        var _this = this;
        _this._controlPanel.sections.self.addEventListener('mousedown', function(e) {
            e.preventDefault();
            if (!_this.touch && _this.detectLeftButton(e)) {
                _this._eventStartDrag(_this, e);
                document.addEventListener('mouseup', _this.listenerDocumentMouseUp);
            }
        });
        _this._controlPanel.sections.self.addEventListener('touchstart', function(e) {
            _this.touch = true;
            _this._touchY = e.changedTouches[0].pageY;
            _this._eventStartDrag(_this, e);
            document.addEventListener('touchend', _this.listenerDocumentTouchend);
        });

        _this._controlPanel.sections.self.addEventListener('mouseout', function(e) {
            e.preventDefault();
            if (_this._triggerClickSection && !_this._sectionDropped) {
                var sectionImg = e.target.parentElement.querySelector('img');
                _this._createSectionPreview(sectionImg.src);
                _this._sectionDropped = true;
                document.addEventListener('mousemove', _this.listenerDocumentMousemove);
            }
        });

    }
    /**
     * ---------------------------------- Part listeners of events ----------------------------------------------------
     */
    , listenerDocumentMousemove: function(e) {
        builder._eventMoveDrag(builder, e);
        builder._eventMoveDragSection(builder, e);
    }
    , listenerDocumentMouseUp: function(e) {
        builder._eventEndDrag(builder);
    }
    , listenerDocumentTouchend: function(e) {
        if (Math.abs(builder._touchY - e.changedTouches[0].pageY) < 10) {
            e.preventDefault();
            builder._eventEndDrag(builder);
        }
    }
    , listenerStartDragSection: function(e) {
        builder.eventStartDragSection(e, this);
    }
    , listenerSectionsMouseDown: function(page, wrapC) {
        var _this = this;
        if (page) {
            var wraps = page.querySelectorAll('li.section-item > .wrap-control');
            Array.prototype.forEach.call(wraps, function (wrapControls) {
                wrapControls.removeEventListener('mousedown', _this.listenerStartDragSection);
                wrapControls.addEventListener('mousedown', _this.listenerStartDragSection);
            });
        } else if (wrapC) {
            wrapC.removeEventListener('mousedown', _this.listenerStartDragSection);
            wrapC.addEventListener('mousedown', _this.listenerStartDragSection);
        }
    }
    /**
     * Start drag section from section group menu
     * @param _this
     * @param e
     * @private
     */
    , _eventStartDrag: function(_this, e) {
        var target = e.target || e.srcElement;
        var element = target.parentElement;
        var body = document.querySelector('body');
        body.classList.add('cursor-grab');
        target.classList.add('cursor-grab');
        _this._elCurGrabbing = target;
        if (element.tagName === 'LI'
            && element.classList.contains('wrap-hover')
            && !_this._triggerClickSection
            && !_this._lockEndDrag) {

            _this._triggerClickSection = true;
            _this.sectionClicked = element;
            _this._createMarkerSection();
            _this._nextForDropped = null;
        }
    }
    /**
     * Move dragable section by main it was dragged from section group menu
     * @param _this
     * @param e
     * @private
     */
    , _eventMoveDrag: function(_this, e) {
        if (_this._dropImg && _this._sectionDropped) {
            _this._dropImg.style.left = e.clientX - 105 + 'px';
            _this._dropImg.style.top = e.clientY - 10 + 'px';
            _this._dropImg.style.display = 'none';
            var li = controls.findParent(document.elementFromPoint(e.clientX, e.clientY), ['section-item']);
            _this._dropImg.style.display = 'block';
            if (li) {
                _this._setPositionMarkerSection(e, _this.sectionClicked, li);
            } else if (_this.getActivePageObject().getDOMSelf().classList.contains('loading')) {
                _this.removeWrapDrag();
                _this.getActivePageObject().getDOMSelf().appendChild(_this._markerSection);
            }
            if (window.innerWidth > 500 && !_this._fixedRightSide) {
                _this._hideSections(_this);
                _this._hideControlPanel(_this);
            };
        }
    }
    /**
     * Start drag section by page
     * @param e
     * @param wrap
     * @private
     */
    , eventStartDragSection: function(e, wrap) {
        var _this = this;
        e.preventDefault();
        if (e.target === wrap && e.button === 0 && !_this._lockEndDrag) {
            _this._triggerClickSectionInMain = true;
            var li = controls.findParent(wrap, ['section-item']);

            _this._draggableSection = li;
            _this._dropX = e.clientX;
            _this._dropY = e.clientY;
            document.addEventListener('mousemove', _this.listenerDocumentMousemove);
            document.addEventListener('mouseup', _this.listenerDocumentMouseUp);

            document.body.classList.add('cursor-grab');
            wrap.classList.add('cursor-grab');
            _this._elCurGrabbing = wrap;
        }
    }
    /**
     * Move draggable section by main if it was dragged by main
     * @param e
     * @private
     */
    , _eventMoveDragSection: function(_this, e) {
        if (_this._triggerClickSectionInMain
            && (Math.abs(_this._dropX - e.clientX) > 15 ||
            Math.abs(_this._dropY - e.clientY) > 15 ) ) {
            if (_this._dropImg) _this._dropImg.style.display = 'none';
            var li = controls.findParent(document.elementFromPoint(e.clientX, e.clientY), ['section-item']);
            if (_this._dropImg) _this._dropImg.style.display = 'block';
            if (li) {

                if (!_this._triggerMoveSectionInMain && !_this._lockEndDrag) {

                    _this._createMarkerSection();
                    _this._createSectionPreview(_this._draggableSection.dataset.img);

                    var next = _this._draggableSection.nextSibling;
                    var parent = _this._draggableSection.parentElement;
                    if (parent) {
                        parent.removeChild(_this._draggableSection);
                        if (next) {
                            parent.insertBefore(_this._markerSection, next);
                        } else {
                            parent.appendChild(_this._markerSection);
                        }
                        _this._triggerMoveSectionInMain = true;
                        li = next;
                        _this._nextPageForHistory = next;
                    }
                }

                if (li) {
                    _this._setPositionMarkerSection(e, _this._draggableSection, li);
                }
            }

            _this._dropImg.style.left = e.clientX - 105 + 'px';
            _this._dropImg.style.top = e.clientY - 10 + 'px';
        }
    }
    , _createMarkerSection: function() {
        var _this = this;
        _this._markerSection = document.createElement('div');
        _this._markerSection.className = 'marker-section';
    }
    , _eventEndDrag: function(_this) {
        var body = document.querySelector('body');

        if (_this._dropImg
            && !_this._sectionDropped
            && !_this._triggerClickSectionInMain
            && !_this._lockEndDrag) {
            _this._dropImg = null;
        }

        if ((_this._sectionDropped || _this._triggerMoveSectionInMain) && !_this._lockEndDrag) {

            _this._sectionDropped = false;
            _this._lockEndDrag = true;

            _this._nextForDropped = _this._markerSection.nextSibling;
            var parent = _this._markerSection.parentElement;

            /**
             * Animate hide section preview
             */

            var boundingMarkerS = _this._markerSection.getBoundingClientRect();
            var top = boundingMarkerS.top;
            var left = boundingMarkerS.left;
            var width = boundingMarkerS.width;

            _this._dropImg.classList.add('drop');
            _this._dropImg.style.left = left + 'px';
            _this._dropImg.style.width = width + 'px';
            _this._dropImg.style.top = top + 'px';
            _this._dropImg.style.opacity = '0';

            if (parent) {
                parent.removeChild(_this._markerSection);
                _this._markerSection = null;

                setTimeout(function() {
                    if (_this._triggerMoveSectionInMain) {

                        if (_this._nextForDropped) {
                            parent.insertBefore(_this._draggableSection, _this._nextForDropped);
                        } else {
                            parent.appendChild(_this._draggableSection);
                        }

                        _this._refreshParallax(_this._draggableSection);

                        var currPageObj = _this.getActivePageObject();
                        var activeItem = _this.getActivePageItem(currPageObj.id);

                        _this._reloadVideoBg(currPageObj.getDOMSelf(), 'run');

                        _this.setStep(function () {
                            var currentPageObj = _this.getActivePageObject();
                            if (currPageObj && currPageObj.id !== currentPageObj.id ) {
                                _this.chengeActivePage(currPageObj, activeItem, currPageObj.id)
                            }
                            _this.setPoinDragMoveSection(_this._draggableSection, parent, _this._nextPageForHistory);
                        });

                        _this._triggerMoveSectionInMain = false;
                    } else {
                        _this._refreshParallax(_this.getActivePageObject().getDOMSelf());
                    }
                }, 200);
            }

            setTimeout(function() {

                if (_this._dropImg) {
                    body.removeChild(_this._dropImg);
                    _this._dropImg = null;
                }
                _this._lockEndDrag = false;

                if (AOS) AOS.refresh();
            }, 400);
        }

        _this._triggerClickSectionInMain = false;

        if (_this._triggerClickSection) {
            _this._triggerClickSection = false;
            _this._beforeAddSection(_this);
        }
        if (body.classList.contains('cursor-grab')) {
            body.classList.remove('cursor-grab');
        }
        if (_this._elCurGrabbing && _this._elCurGrabbing.classList.contains('cursor-grab')) {
            _this._elCurGrabbing.classList.remove('cursor-grab');
        }
        _this._sectionDropped = false;

        document.removeEventListener('mousemove', _this.listenerDocumentMousemove);
        document.removeEventListener('mouseup', _this.listenerDocumentMouseUp);
        document.removeEventListener('touchend', _this.listenerDocumentTouchend);
    }
    /**
     * Create and append section preview to body
     * @param src {string}
     * @private
     */
    , _createSectionPreview: function(src) {
        var _this = this;
        var body = document.querySelector('body');

        _this._dropImg = document.createElement('img');
        _this._dropImg.src = src;
        _this._dropImg.className = 'preview-section-on-drag';

        body.appendChild(_this._dropImg);
    }
    /**
     * @param e {Object}: evetn mousemove
     * @param dragSection {HTMLElement}
     * @param li {HTMLElement}: section that is under position mouse
     * @private
     */
    , _setPositionMarkerSection: function(e, dragSection, li) {
        var _this = this;
        var boundingLi = li.getBoundingClientRect();
        var height = boundingLi.height;
        var top = boundingLi.top;
        if (e.clientY < top + (height / 2)
            && dragSection.dataset.group !== 'navigations'
            && dragSection.dataset.group !== 'footers'
        ) {
            if (li.dataset.group !== 'navigations') {
                li.parentElement.insertBefore(_this._markerSection, li);
            } else {
                li.parentElement.insertBefore(_this._markerSection, li.nextSibling);
            }
        } else if (
            dragSection.dataset.group !== 'navigations'
            && dragSection.dataset.group !== 'footers'
        ) {
            if (li.dataset.group !== 'footers') {
                li.parentElement.insertBefore(_this._markerSection, li.nextSibling);
            } else {
                li.parentElement.insertBefore(_this._markerSection, li);
            }
        } else if (dragSection.dataset.group === 'navigations') {
            li.parentElement.insertBefore(_this._markerSection, li.parentElement.firstChild);
        } else if (dragSection.dataset.group === 'footers') {
            li.parentElement.appendChild(_this._markerSection);
        }
    }
    /**
     * History point
     * @param li {HTMLElement}
     * @param parent {HTMLElement} is page
     * @param next {HTMLElement}
     * @public
     */
    , setPoinDragMoveSection: function(li, parent, next) {
        var _this = this;
        var nextS = li.nextSibling;

        if (next) {
            parent.insertBefore(li, next);
        } else {
            parent.appendChild(li);
        }

        controls.rebuildControl(li);
        _this.listenerSectionsMouseDown(null, li.lastChild);

        var currPageObj = _this.getActivePageObject();
        var activeItem = _this.getActivePageItem(currPageObj.id);

        _this.setStep(function() {
            var currentPageObj = _this.getActivePageObject();
            if (currPageObj && currPageObj.id !== currentPageObj.id ) {
                _this.chengeActivePage(currPageObj, activeItem, currPageObj.id);
            }
            _this.setPoinDragMoveSection(li, parent, nextS);
        });
    }
    , _beforeAddSection: function(_this) {
        var sectionGroup = _this.sectionClicked.dataset.group;

        _this.removeWrapDrag();

        var pageObj = _this.getActivePageObject();
        var activePage = pageObj.getDOMSelf();

        if (_this.sectionClicked) {
            if (sectionGroup === 'navigations'
                && activePage.dataset.nav !== '1') {

                pageObj.addSection(_this.sectionClicked, 'nav', _this.defaultStyleType, null, _this._nextForDropped);
            } else if (sectionGroup === 'navigations'
                && activePage.dataset.nav === '1') {

                var modal = new Modal('supra-modal', 'Replace'
                    , pageObj);
                $(modal).modal('show');
                return;
            } else if (sectionGroup === 'footers'
                && activePage.dataset.footer !== '1') {

                pageObj.addSection(_this.sectionClicked, 'footer', _this.defaultStyleType, null, _this._nextForDropped);
            } else if (sectionGroup === 'footers'
                && activePage.dataset.footer === '1') {

                var modal = new Modal('supra-modal', 'Replace'
                    , pageObj);
                $(modal).modal('show');
                return;
            } else {
                pageObj.addSection(_this.sectionClicked, '', _this.defaultStyleType, null, _this._nextForDropped);
            }
        }
    }
    /**
     * --------------------------------- Part of builder - working with style -----------------------------------------
     */
    , _initStyle: function() {
        var _this = this;
        var defaultStyle = '';
        _this.modalContainerStyleHtml = document.createElement('style');
        document.getElementById('modal-container').appendChild(_this.modalContainerStyleHtml);
        _this._style.styleItems = {};
        _this._style.html.innerHTML = '';
        Array.prototype.forEach.call(_this._controlPanel.style.ul, function(ul) {
            _this._style.styleItems[ul.id] = _this.cloneObject(options.colorGrid);
            _this._style.styleItems[ul.id].forEach(function(element) {
                var li = document.createElement('li');
                li.innerHTML = '<label>' + element.title + '</label>';
                var input = document.createElement('input');
                input.setAttribute('type', 'text');
                input.className = 'spectrum';
                li.appendChild(input);
                ul.appendChild(li);

                $(input).spectrum({
                    color: element[ul.id + 'Color'].replace(/!important/i, '')
                    , showPalette: true
                    , preferredFormat: "hex"
                    , allowEmpty: false
                    , localStorageKey: "spectrum.homepage"
                });

                var domIdentif = element.domIdentif;

                if (!Array.isArray(domIdentif)) domIdentif = domIdentif.replace(/\\/i, '');

                if (element.name === 'bg-1'
                    || element.name === 'bg-2'
                    || element.name === 'bg-3'
                ) {
                    defaultStyle += domIdentif + '-color-' + ul.id + ' {\n'
                        + element.styleProperty + ' ' + element[ul.id + 'Color'] + ';\n'
                        + '}\n';
                    if (element.name === 'bg-1') {
                        defaultStyle += '.' + ul.id + '-page' + element.domIdentifPreloader + ' {\n'
                            + element.styleProperty + ' ' + element[ul.id + 'Color'] + ';\n'
                            + '}\n';
                        defaultStyle += '.' + ul.id + '-page {\n'
                            + element.styleProperty + ' ' + element[ul.id + 'Color'] + ';\n'
                            + '}\n';
                    }
                } else if (element.name === 'preloader-color') {
                    defaultStyle += '.' + ul.id + '-page ' + domIdentif + ' {\n'
                        + element.styleProperty + ' ' + element[ul.id + 'Color'] + ';\n'
                        + '}\n';
                    defaultStyle += '.' + ul.id + '-page ' + domIdentif + ' div {\n'
                        + 'background-color: ' + element[ul.id + 'Color'] + ';\n'
                        + '}\n';
                } else if (element.name === 'btn-def-color' || element.name === 'btn-def-hover-color'
                    || element.name === 'btn-primary-color' || element.name === 'btn-primary-hover-color') {
                    _this._style.html.innerHTML += '.' + ul.id + ' ' + domIdentif + ' {\n'
                        + element.styleProperty + ' ' + element[ul.id + 'Color'] + ';\n'
                        + 'border-color: ' + element[ul.id + 'Color'] + ';\n'
                        + '}\n';
                    _this.modalContainerStyleHtml.innerHTML += '.' + ul.id + '-modal .choice-element' + ' ' + domIdentif + ' {\n'
                        + element.styleProperty + ' ' + element[ul.id + 'Color'] + ';\n'
                        + 'border-color: ' + element[ul.id + 'Color'] + ';\n'
                        + '}\n';
                } else {
                    if (!Array.isArray(domIdentif)) {
                        _this._style.html.innerHTML += '.' + ul.id + ' ' + domIdentif + ' {\n'
                            + element.styleProperty + ' ' + element[ul.id + 'Color'] + ';\n'
                            + '}\n';
                    } else {
                        domIdentif.forEach(function(style) {
                            var space = element.name === 'separator' ? '' : ' ';
                            _this._style.html.innerHTML += '.' + ul.id + space + style + ' {\n'
                                + element.styleProperty + ' ' + element[ul.id + 'Color'] + ';\n'
                                + '}\n';
                        });
                    }
                }

                element.html = input;
            });
        });

        _this._style.html.innerHTML = "/* --------------- Color Style ------------------ */\n"
            + defaultStyle
            + _this._style.html.innerHTML;

    }
    , _loadStyle: function() {
        var _this = this;
        _this._readWriteColorStyle(_this, 'read', function(arg){
            var style = _this._style.html.innerHTML;
            var i = 3;
            if (arg.element.name === 'preloader-color'
                || arg.element.name === 'btn-def-color'
                || arg.element.name === 'btn-def-hover-color'
                || arg.element.name === 'btn-primary-color'
                || arg.element.name === 'btn-primary-hover-color') {
                i = 4;
            }
            arg.element[arg.typeStyle + 'Color'] = style.match(arg.pattern) ? style.match(arg.pattern)[i] : '#ffffff';
            $(arg.element.html).spectrum(
                'set'
                , arg.element[arg.typeStyle + 'Color']
            );

            var replaces = '';
            if (arg.element.name === 'btn-def-color' || arg.element.name === 'btn-def-hover-color') {
                replaces = 'color:' + arg.element[arg.typeStyle + 'Color'] + ';\n'
                    + 'border-color:' + arg.element[arg.typeStyle + 'Color'] + ';\n';
            } else if (arg.element.name === 'btn-primary-color' || arg.element.name === 'btn-primary-hover-color') {
                replaces = 'background-color:' + arg.element[arg.typeStyle + 'Color'] + ';\n'
                    + 'border-color:' + arg.element[arg.typeStyle + 'Color'] + ';\n';
            }
            if (replaces !== '') {
                var mCS = _this.modalContainerStyleHtml.innerHTML;
                _this.modalContainerStyleHtml.innerHTML = mCS.replace(
                    arg.patternModal
                    , '$1' + replaces + '$4'
                );
            }
        });
    }
    , _selectionGroupButtonStyle: function() {
        var _this = this;
        Array.prototype.forEach.call(_this._controlPanel.style.btnGroupStyle, function(element) {
            element.addEventListener('click', function() {
                if (_this.editingStyle !== this.dataset.id) {
                    _this._controlPanel.style.self.querySelector('ul.active').classList.remove('active');
                    _this._controlPanel.style.self.querySelector('ul#' + this.dataset.id).classList.add('active');
                    _this.editingStyle = this.dataset.id;
                    _this.selection(this);
                }
            });
        });
    }
    , _applyStyle: function() {
        var _this = this;
        _this._controlPanel.style.btnApply.addEventListener('click', function() {
            var styleSave = _this._style.html.innerHTML;

            _this._readWriteColorStyle(_this, 'write', function(arg){
                var style = _this._style.html.innerHTML;
                var end = arg.element.name === 'preloader-color' ? '!important$5' : '$4';
                var replaces = arg.element[arg.typeStyle + 'Color'];
                var triggerButton = false;
                if (arg.element.name === 'btn-def-color' || arg.element.name === 'btn-def-hover-color') {
                    replaces = 'color: ' + arg.element[arg.typeStyle + 'Color'] + ';\n'
                        + 'border-color: ' + arg.element[arg.typeStyle + 'Color'] + ';\n';
                    triggerButton = true;
                    end = '$5';
                } else if (arg.element.name === 'btn-primary-color' || arg.element.name === 'btn-primary-hover-color') {
                    replaces = 'background-color: ' + arg.element[arg.typeStyle + 'Color'] + ';\n'
                        + 'border-color: ' + arg.element[arg.typeStyle + 'Color'] + ';\n';
                    triggerButton = true;
                    end = '$5';
                }
                _this._style.html.innerHTML = style.replace(
                    arg.pattern
                    , '$1' + replaces + end
                );

                if (triggerButton) {
                    var mCS = _this.modalContainerStyleHtml.innerHTML;
                    _this.modalContainerStyleHtml.innerHTML = mCS.replace(
                        arg.patternModal
                        , '$1' + replaces + '$4'
                    );
                }
            });

            _this.setStep(function() {
                _this._setPointStyle(_this, styleSave);
            });
        });
    }
    , _setPointStyle: function(_this, style) {
        var styleSave = _this._style.html.innerHTML;

        _this._style.html.innerHTML = style;

        _this._loadStyle();

        _this.setStep(function() {
            _this._setPointStyle(_this, styleSave);
        });
    }
    , _readWriteColorStyle: function(_this, mode, callback) {
        var flags = 'im';
        for (var typeStyle in _this._style.styleItems) {
            _this._style.styleItems[typeStyle].forEach(function (element) {

                if (mode === 'write') {
                    element[typeStyle + 'Color'] = element.html.value;
                    flags = 'img';
                }
                var arg = {
                    element: element
                    , typeStyle: typeStyle
                };
                if (element[typeStyle + 'Color'] !== '') {
                    if (element.name === 'bg-1'
                        || element.name === 'bg-2'
                        || element.name === 'bg-3'
                    ) {
                        var pageBackground = '';
                        if (element.name === 'bg-1') pageBackground = '|.' + typeStyle + '-page|.' + typeStyle + '-page\\s*' + element.domIdentifPreloader;
                        arg.pattern = new RegExp('((\\' + addSleshes(element.domIdentif) + '-color-' + typeStyle + pageBackground + ')[\\s\\t]*{[\\s\\n\\t]*'
                            + element.styleProperty + '\\s*)([^;]*)(;)', flags);
                        callback(arg);
                    } else if (element.name === 'preloader-color') {
                        arg.pattern = new RegExp('((\\.' + typeStyle + '\\s*' + addSleshes(element.domIdentif) + '|\\.' + typeStyle + '-page\\s*' + addSleshes(element.domIdentif) + ')[\\s\\t\\w]*{[\\s\\n\\t]*'
                            + '(' + element.styleProperty + '|background-color:)\\s*)([^;]*)(?:!important)(;)', flags);
                        callback(arg);
                    } else if (element.name === 'btn-def-color' || element.name === 'btn-primary-color') {
                        arg.pattern = new RegExp('((\\.' + typeStyle + '\\s*' + addSleshes(element.domIdentif) + '|\\.' + typeStyle + '-page\\s*' + addSleshes(element.domIdentif) + ')[^:][\\s\\t\\w]*{[\\s\\n\\t]*)'
                            + '(' + element.styleProperty + '|border-color:)\\s*([^;]*)[^}]*(})', flags);
                        arg.patternModal = new RegExp('(\\.' + typeStyle + '-modal .choice-element' + addSleshes(element.domIdentif) + '[^:][\\s\\t\\w]*{[\\s\\n\\t]*)'
                            + '(' + element.styleProperty + '|border-color:)\\s*([^;]*)[^}]*(})', 'img');
                        callback(arg);
                    } else if (element.name === 'btn-def-hover-color' || element.name === 'btn-primary-hover-color') {
                        arg.pattern = new RegExp('((\\.' + typeStyle + '\\s*' + addSleshes(element.domIdentif) + '|\\.' + typeStyle + '-page\\s*' + addSleshes(element.domIdentif) + ')[\\s\\t\\w]*{[\\s\\n\\t]*)'
                            + '(' + element.styleProperty + '|border-color:)\\s*([^;]*)[^}]*(})', flags);
                        arg.patternModal = new RegExp('(\\.' + typeStyle + '-modal .choice-element' + addSleshes(element.domIdentif) + '[\\s\\t\\w]*{[\\s\\n\\t]*)'
                            + '(' + element.styleProperty + '|border-color:)\\s*([^;]*)[^}]*(})', 'img');
                        callback(arg);
                    } else {
                        if (!Array.isArray(element.domIdentif)) {
                            arg.pattern = new RegExp('((\\.' + typeStyle + '\\s*' + addSleshes(element.domIdentif) + '|\\.' + typeStyle + '-page\\s*' + addSleshes(element.domIdentif) + ')[\\s\\t\\w]*{[\\s\\n\\t]*'
                                + element.styleProperty + '\\s*)([^;]*)(;)', flags);
                            callback(arg);
                        } else {
                            element.domIdentif.forEach(function (item) {
                                arg.pattern = new RegExp('((\\.' + typeStyle + '\\s*' + addSleshes(item) + '|\\.' + typeStyle + '-page\\s*' + addSleshes(item) + ')[\\s\\t]*{[\\s\\n\\t]*'
                                    + element.styleProperty + '\\s*)([^;]*)(;)', flags);
                                callback(arg);
                            });
                        }
                    }
                }
            });
        }
    }
    /**
     * --------------------------------- Part of builder - working with typography ------------------------------------
     */
    , _initTypography: function() {
        var _this = this;
        var tItems = _this._controlPanel.typography.items;

        var style = _this._style.html.innerHTML;
        style += "\n/* ------------------ Typography --------------------- */\n";

        options.typographyGrid.forEach(function(typographyItem, indx) {
            var button = tItems[indx].querySelector('.dropdown button');
            var option = tItems[indx].querySelector('li:first-child a');

            tItems[indx].dataset.id = indx;
            var elSelector = '';
            if (Array.isArray(typographyItem.domIdentif)) {
                typographyItem.domIdentif.forEach(function(el, indx){
                    var comma = "";
                    if (indx > 0) comma = ", ";

                    elSelector += comma + ".font-style-supra " + el;
                });
            } else {
                elSelector = ".font-style-supra " + typographyItem.domIdentif;
            }

            var fontFamily = typographyItem.styleprop.fontFamily !== '' ?
                typographyItem.styleprop.fontFamily : option.dataset.value;

            var fontWeight = typographyItem.styleprop.fontWeight !== '' ?
                typographyItem.styleprop.fontWeight : option.dataset.weight;

            var light = '';
            if (fontWeight*1 < 400 && fontWeight*1 > 200) {
                light = ' light';
            } else if (fontWeight*1 < 201 && fontWeight*1 > 100) {
                light = ' extra-light';
            } else if (fontWeight*1 < 101) {
                light = ' thin';
            }

            if (_this.arrayFontsOnProject.indexOf(fontFamily + ':' + fontWeight) === -1) {
                _this.arrayFontsOnProject.push(fontFamily + ':' + fontWeight);
            }
            button.children[0].innerHTML = fontFamily + light;
            button.style.fontFamily = fontFamily;
            button.dataset.value = fontFamily;
            button.dataset.weight = fontWeight;
            button.style.fontWeight = fontWeight;

            var fontHeight = typographyItem.fontSize;
            tItems[indx].querySelector('input[type=text]').value = fontHeight;
            style += elSelector + " {\n\tfont-family: '" + fontFamily + "';"
                + "\n\tfont-size: " + fontHeight + ";";

            var btnsInGroup = typographyItem.styleprop;
            for (var btnInGroup in btnsInGroup) {
                var fontStyle = btnsInGroup[btnInGroup];
                var styleProp = 'font-weight';
                if (btnInGroup === 'textTransform') {
                    styleProp = 'text-transform';
                } else if (btnInGroup === 'fontStyle') {
                    styleProp = 'font-style';
                }

                style += "\n\t" + styleProp + ": " + fontStyle + ";";

                if (fontStyle !== 'inherit') {

                    switch (styleProp) {
                        case 'font-weight':
                            var bold = tItems[indx].querySelector('button.bold');
                            if (fontStyle === 'bold') bold.classList.add('active');
                            break;
                        case 'font-style':
                            var italic = tItems[indx].querySelector('button.italic');
                            italic.classList.add('active');
                            break;
                        case 'text-transform':
                            var uppercase = tItems[indx].querySelector('button.uppercase');
                            uppercase.classList.add('active');
                            break;
                    }
                }
            }
            style += "\n}\n";
        });
        _this._style.html.innerHTML = style;
    }
    , _selectionFonts: function() {
        var _this = this;
        var items = _this._controlPanel.typography.items;
        Array.prototype.forEach.call(items, function(item) {
            var options = item.querySelectorAll('li a');
            var button = item.querySelector('.dropdown button');
            Array.prototype.forEach.call(options, function(element){
                element.addEventListener('click', function(e){
                    e.preventDefault();
                    button.dataset.value = element.dataset.value;
                    button.dataset.weight = element.dataset.weight;
                    button.style.fontFamily = element.style.fontFamily;
                    button.style.fontWeight = element.dataset.weight;
                    button.querySelector('span').innerHTML = element.innerHTML;
                });
            });
            var input = item.querySelector('input');
            $(input).mask('000px', {reverse: true});
        });
    }
    , _selectionFontStyle: function() {
        var _this = this;
        var items = _this._controlPanel.typography.items;
        Array.prototype.forEach.call(items, function(item) {
            var groupButtons = item.querySelectorAll('.btn-group button');
            Array.prototype.forEach.call(groupButtons, function(element){
                element.addEventListener('click', function(e){
                    e.preventDefault();
                    _this._selectionWithSelfUnactive(this);
                });
            });
        });
    }
    , _applyTypography: function() {
        var _this = this;
        this._controlPanel.typography.btnApply.addEventListener('click', function() {
            var styleSave = _this._style.html.innerHTML;
            _this.arrayFontsOnProject = [];
            _this._readWriteTypographyStyle(_this, 'write', function(arg) {
                var style = _this._style.html.innerHTML;
                switch (arg.option) {
                    case 'font_family':
                        _this._style.html.innerHTML = style.replace(
                            arg.pattern
                            , '$1 \'' + arg.button.dataset.value + '\';'
                        );
                        if (_this.arrayFontsOnProject.indexOf(arg.button.dataset.value + ':' + arg.button.dataset.weight) === -1) {
                            _this.arrayFontsOnProject.push(arg.button.dataset.value + ':' + arg.button.dataset.weight);
                        }
                        break;
                    case 'font_height':
                        if (arg.fontHeight.value !== '') {
                            _this._style.html.innerHTML = style.replace(arg.ptrnHeight, '$1' + arg.fontHeight.value + ';');
                        }
                        break;
                    case 'font_style':
                        var fontStyle = arg.btnInGroup.dataset.style;
                        if (!arg.btnInGroup.classList.contains('active')) {
                            fontStyle = arg.fontStyleDefault;
                            if (arg.styleProp === 'font-weight') {
                                fontStyle = arg.button.dataset.weight;
                            }
                        }
                        _this._style.html.innerHTML = style.replace(arg.ptrnStyle, '$1 ' + fontStyle + ';');
                        break;
                }
            });

            _this.setStep(function() {
                _this._setPointTypography(_this, styleSave);
            });
        });
    }
    /**
     * History point
     * @param _this
     * @param style {string} saved style options
     * @private
     */
    , _setPointTypography: function(_this, style) {
        var styleSave = _this._style.html.innerHTML;

        _this._style.html.innerHTML = style;

        _this._loadTypography();

        _this.setStep(function() {
            _this._setPointTypography(_this, styleSave);
        });
    }
    , _loadTypography: function() {
        var _this = this;
        _this.arrayFontsOnProject = [];
        this._readWriteTypographyStyle(this, 'read', function(arg){
            var style = _this._style.html.innerHTML;
            switch (arg.option) {
                case 'font_family':
                    var styleEl = style.match(arg.pattern) || 'lato';
                    var weight = style.match(arg.ptrnWeight) ? style.match(arg.ptrnWeight)[2] : 300;
                    var light = '';
                    if (weight === 'lighter' || weight === 'inherit' || (weight*1 < 400 && weight*1 > 100)) {
                        light = ' light';
                    } else if (weight !== 'bold' && weight*1 < 101) {
                        light = ' thin';
                    }
                    arg.button.children[0].innerHTML = styleEl[2] + light;
                    arg.button.style.fontFamily = styleEl[2];
                    arg.button.style.fontWeight = weight;
                    arg.button.dataset.value = styleEl[2];
                    arg.button.dataset.weight = (weight !== 'bold' && weight*1 < 400) ? '300' : '400';
                    if (_this.arrayFontsOnProject.indexOf(styleEl[2] + ':' + arg.button.dataset.weight) === -1) {
                        _this.arrayFontsOnProject.push(styleEl[2] + ':' + arg.button.dataset.weight);
                    }
                    break;
                case 'font_height':
                    if (style.search(arg.ptrnHeight) !== -1) {
                        arg.fontHeight.value = style.match(arg.ptrnHeight)[2];
                    } else {
                        arg.fontHeight.value = arg.defaultFontSize;
                    }
                    break;
                case 'font_style':
                    if (style.match(arg.ptrnStyle) && style.match(arg.ptrnStyle)[2] !== arg.fontStyleDefault) {
                        if (arg.styleProp === 'font-weight'
                            && (style.match(arg.ptrnStyle)[2] === 'bold' || style.match(arg.ptrnStyle)[2]*1 > 400)) {
                            arg.btnInGroup.classList.add('active');
                        } else if (arg.styleProp !== 'font-weight') {
                            arg.btnInGroup.classList.add('active');
                        }
                    } else {
                        if (arg.btnInGroup.classList.contains('active')) {
                            arg.btnInGroup.classList.remove('active');
                        }
                    }
                    break;
            }
        });
    }
    , _readWriteTypographyStyle: function (_this, mode, callback) {
        var flags = 'im';
        if (mode === 'write') {
            flags = 'img';
        }
        var items = _this._controlPanel.typography.items;
        Array.prototype.forEach.call(items, function(item, tId) {
            var button = item.querySelector('.dropdown button');
            var arg = {
                button: button
            };
            var domIdentif = options.typographyGrid[tId].domIdentif;
            var elSelector = '';
            if (Array.isArray(domIdentif)) {
                domIdentif.forEach(function(el, indx){
                    var comma = "";
                    if (indx > 0) comma = ", ";
                    elSelector += comma + ".font-style-supra " + el;
                });
            } else {
                elSelector = ".font-style-supra " + domIdentif;
            }
            elSelector = addSleshes(elSelector);
            //font family
            arg.pattern = new RegExp('([^\\w]' + elSelector + '\\s*{[\\s\\S]*?'
                + 'font-family:)\\s*\'?([^\';]*)\'?(;)', flags);
            arg.ptrnWeight = new RegExp('([^\\w]' + elSelector + '[\\s]*{[\\s\\S]*?'
                + 'font-weight\\s*:)\\s*([^;]*)(;)', flags);
            arg.option = 'font_family';
            callback(arg);


            //font Height
            arg.fontHeight = item.querySelector('input[type=text]');
            arg.ptrnHeight = new RegExp('([^\\w]' + elSelector + '\\s*{[\\s\\S]*?'
                + 'font-size:)\\s*([^;]*)(;)', flags);
            arg.defaultFontSize = options.typographyGrid[tId].fontSize;
            arg.option = 'font_height';
            callback(arg);


            //font style
            var btnsInGroup = item.querySelectorAll('button:not(.dropdown-toggle)');
            Array.prototype.forEach.call(btnsInGroup, function(btnInGroup) {
                var style = _this._style.html.innerHTML;
                if (btnInGroup) {
                    var fontStyle = btnInGroup.dataset.style;
                    var styleProp = 'font-weight';
                    if (fontStyle === 'uppercase') {
                        styleProp = 'text-transform';
                    } else if (fontStyle === 'italic') {
                        styleProp = 'font-style';
                    }
                    arg.ptrnStyle = new RegExp('([^\\w]' + elSelector + '[\\s]*{[\\s\\S]*?'
                        + styleProp + ':)\\s*([^;]*)(;)', flags);
                    var fs = styleProp.split('-');
                    arg.fontStyleDefault = options.typographyGrid[item.dataset.id].styleprop[fs[0] + firstUp(fs[1])];
                    arg.btnInGroup = btnInGroup;
                    arg.fontStyle = fontStyle;
                    arg.styleProp = styleProp;
                    arg.option = 'font_style';
                    callback(arg);
                }
            });
        });
    }
    /**
     * --------------------------------- Part of builder - working with pages of project -----------------------------
     */
    , _addProjectPagesToRightSide: function() {
        var _this = this;
        var li = _this._controlPanel.ProjectPages.self.querySelectorAll('li');
        var buttonAdd = li[li.length-1];

        _this._pages.forEach(function(element, indx){
            var pageName = element.getPageName();
            var ativePageName = _this._pages[_this._idActivePage].getPageName();
            _this._addPageNavItem(_this, buttonAdd, pageName, indx, ativePageName);
        });
        if (!_this._triggerInitProject) {
            buttonAdd.addEventListener('click', function(){
                var names = _this.getPagesNamesArray();
                var name = _this.uniqueName('page', names);
                _this._addNewPage(_this, this, name);

                _this._pinBottom(_this, this);
            });
            _this._triggerInitProject = true;
        }

    }
    /**
     *
     * @param _this
     * @param addButton {HTMLElement} button 'Add new page' on right side
     * @param name {string} name of page
     * @private
     */
    , _addNewPage: function(_this, addButton, name) {
        var indx = _this._pages.length;

        var pageItem = _this._addPageNavItem(_this, addButton, name, indx);

        _this._pages.push(new Page(name, indx,  this.main));

        builder.setStep(function(){
            _this._deletePage(_this, pageItem, _this._pages[indx].getDOMSelf());
            var mode = document.querySelector('aside.left nav li.active').id;
            _this.selectionEditMode(mode);
        });
    }
    /**
     *
     * @param _this
     * @param targetPageObj {Page} Object Page (page.js)
     * @param addButton {HTMLElement} button 'Add new page' on right side
     * @param oldPageName {string} name of page which to copy
     * @private
     */
    , _copyPage: function(_this, targetPageObj, addButton, oldPageName) {
        var copy = oldPageName.split('-');
        var names = _this.getPagesNamesArray();
        if (copy[0] === 'copy') {
            var name = _this.uniqueName(oldPageName, names);
        } else {
            var name = _this.uniqueName('copy-' + oldPageName, names);
        }

        var indx = _this._pages.length;
        var pageItem = _this._addPageNavItem(_this, addButton, toPageName(name), indx);

        var newPageObj = new Page(name, indx,  this.main, 'copy', targetPageObj);
        var newPage = newPageObj.getDOMSelf();
        _this._pages.push(newPageObj);

        builder.setStep(function(){
            _this._deletePage(_this, pageItem, newPage);
            var mode = document.querySelector('aside.left nav li.active').id;
            _this.selectionEditMode(mode);
        });
    }
    /**
     *
     * @param _this
     * @param pageItem {HTMLElement} button wich conteins current page name on right side
     * @param targetPage {HTMLElement} page which should be deleted
     * @private
     */
    , _deletePage: function(_this, pageItem, targetPage) {
        var nextPageItem = pageItem.nextSibling;
        var parent = targetPage.parentNode;
        var nextPage = targetPage.nextSibling;
        if (targetPage.classList.contains('spr-active-page')) {
            if (nextPage) {
                _this._setActivePage(_this, nextPage, nextPageItem);
                document.title = _this.getActivePageObject().getPageTitle();
            } else {
                var beforePage = targetPage.previousSibling;
                var beforePageItem = pageItem.previousSibling;
                _this._setActivePage(_this, beforePage, beforePageItem);
                document.title = _this.getActivePageObject().getPageTitle();
            }
        }
        var targetPageObj = _this._pages[targetPage.dataset.id];
        if (targetPage.classList.contains('spr-active-page')) {
            targetPageObj.moveChildrenToHtmlDOM(targetPage);
        }
        delete _this._pages[targetPage.dataset.id];
        parent.removeChild(targetPage);
        pageItem.parentNode.removeChild(pageItem);

        _this.setStep(function() {
            targetPage.innerHTML = '';
            if (nextPage) {
                parent.insertBefore(targetPage, nextPage);
            } else {
                parent.appendChild(targetPage);
            }
            var indx = targetPage.dataset.id*1;
            var del = _this._pages[indx] === undefined ? 1 : 0;
            _this._pages.splice(indx,del,targetPageObj);
            controls.rebuildControl(targetPage);
            _this.listenerSectionsMouseDown(targetPage);
            nextPageItem.parentNode.insertBefore(pageItem, nextPageItem);
            if (pageItem.classList.contains('active')) {
                pageItem.classList.remove('active');
                targetPage.classList.remove('active');
            }
            _this.chengeActivePage(targetPageObj, pageItem, indx);
            var mode = document.querySelector('aside.left nav li.active').id;
            _this.selectionEditMode(mode);

            builder.setStep(function(){
                _this._deletePage(_this, pageItem, targetPage);
                var mode = document.querySelector('aside.left nav li.active').id;
                _this.selectionEditMode(mode);
            });
        });
    }
    /**
     *
     * @param _this
     * @param page {HTMLElement} page which should be active
     * @param pageItem {HTMLElement} button on right side which should be active
     * @private
     */
    , _setActivePage: function(_this, page, pageItem) {
        var idPage = page.dataset.id;
        page.classList.add('spr-active-page');
        _this._idActivePage = idPage;

        var beforePageOBJ = _this._pages[idPage];
        beforePageOBJ.extractContent();

        pageItem.classList.add('active');
        controls.rebuildControl(page);
        _this._refreshParallax(page);
        _this._reloadMagnific(page);
        _this.listenerSectionsMouseDown(page);
        _this._reloadVideoBg(page, 'run');
    }
    /**
     * Add button to right side which will be accorded with the new page
     * @param _this
     * @param before {HTMLElement} button before which need to set new pageItem
     * @param pageName {string} name of new page
     * @param indx {number} position on _this._pages array
     * @param ativePageName {string} current page name which active
     * @private
     */
    , _addPageNavItem: function(_this, before, pageName, indx, ativePageName) {
        var pageItem = document.createElement('li');
        ativePageName = ativePageName || 'index';
        if (pageName === ativePageName) pageItem.className = 'active';
        pageItem.innerHTML = '<span>' + firstUp(pageName) + '</span>'
            + '<div class="control-wrap">'
            + '<i class="supra icon-equalizer"></i>'
            + '<i class="supra icon-copy"></i>'
            + '<i class="supra icon-trash2"></i>'
            + '</div>';
        pageItem.dataset.id = indx;
        var settings = pageItem.querySelector('.icon-equalizer');
        var copy = pageItem.querySelector('.icon-copy');
        var del = pageItem.querySelector('.icon-trash2');

        pageItem.addEventListener('click', function(){
            if (!this.classList.contains('active')) {
                var targetPageObj = _this._pages[indx];
                _this.chengeActivePage(targetPageObj, this, indx);
            }
        });

        settings.addEventListener('click', function(e) {
            e.stopPropagation();
            var targetPage = _this._pages[indx].getDOMSelf();
            var modal = new Modal('supra-modal', 'PageSettings', { page: _this._pages[targetPage.dataset.id], pageItem: pageItem});
            $(modal).modal('show');
        });

        copy.addEventListener('click', function(e){
            e.stopPropagation();
            var targetPageObj = _this._pages[indx];
            _this._copyPage(
                _this
                , targetPageObj
                , pageItem.nextSibling
                , replaceSpace(pageItem.children[0].innerHTML.toLowerCase())
            );

            var li = _this._controlPanel.ProjectPages.self.querySelectorAll('li');
            var buttonAdd = li[li.length-1];
            _this._pinBottom(_this, buttonAdd);
        });

        del.addEventListener('click', function(e){
            e.stopPropagation();
            if (pageName !== 'index') {
                var targetPage = _this._pages[indx].getDOMSelf();
                _this._deletePage(_this, pageItem, targetPage);
                var li = _this._controlPanel.ProjectPages.self.querySelectorAll('li');
                var buttonAdd = li[li.length-1];
                _this._pinBottom(_this, buttonAdd);
            }
        });

        before.parentNode.insertBefore(pageItem, before);

        return pageItem;
    }
    /**
     * Fixes the addButton on bottom when quantity pageItems is out of sight
     * @param _this
     * @param buttonAdd {HTMLElement} button 'Add new page' on right side
     * @private
     */
    , _pinBottom: function(_this, buttonAdd) {
        var bottom = _this._controlPanel.self.querySelector('.btn-ex-im-d').getBoundingClientRect().top;
        var pageItemHeight = buttonAdd.clientHeight;
        var b = buttonAdd.previousSibling.getBoundingClientRect().bottom + pageItemHeight*2+5;
        buttonAdd.classList[b > bottom ? 'add' : 'remove']('pin-bottom');
        if (b > bottom) {
            buttonAdd.style.top = bottom - pageItemHeight + 'px';
        } else {
            buttonAdd.style.top = 'auto';
        }
    }
    /**
     * Prepage content
     * @param mode {string} have value 'no-storage' or NULL
     * @return {object} data saved project
     */
    , _prepareContentPagesToSave: function(mode) {
        var _this = this;
        if (builder.activeFormModal) {
            $(builder.activeFormModal).modal('hide');
            builder.activeFormModal.style.display = 'none';
        }
        var main = _this.main.cloneNode(true);
        _this.clearControlElements(main);
        var sectionsName = JSON.stringify(_this.sectionsName);
        var pagesStorageObj = JSON.stringify(_this._pages);
        var projectData = JSON.stringify(main.innerHTML);
        var modalContainer = JSON.stringify(_this.modalContainer.innerHTML);
        var modalFormContainer = JSON.stringify(_this.modalFormContainer.innerHTML);
        var forms = JSON.stringify(_this.forms);
        var video_bg = JSON.stringify(_this._videoBg);
        var gallery = JSON.stringify(_this._owlGallery);
        var form_section = JSON.stringify(_this._formSection);
        var smooth = JSON.stringify(_this._smooth);
        var parallax = JSON.stringify(_this._parallax);
        var gMaps = JSON.stringify(_this.gMaps);
        var data = {
            sectionsName: sectionsName
            , pagesStorageObj: pagesStorageObj
            , projectData: projectData
            , modalContainer: modalContainer
            , modalFormContainer: modalFormContainer
            , forms: forms
            , video_bg: video_bg
            , gallery: gallery
            , form_section: form_section
            , smooth: smooth
            , parallax: parallax
            , gMaps: gMaps
        };
        data = JSON.stringify(data);
        try {
            if (mode !== 'no-storage') {
                delete window.localStorage.project;
                window.localStorage.project = data;
            }
        }
        catch (e) {}

        return data;
    }
    /**
     * Return current page object
     * @return {Page}
     */
    , getActivePageObject: function() {
        return this._pages[this._idActivePage];
    }
    /**
     * Return pageItem of project pages panel that suit current active page
     * @return {HTMLElement}
     */
    , getActivePageItem: function(id) {
        var pageItems = this._controlPanel.ProjectPages.self.querySelectorAll('ul li');
        var pageItem = pageItems[0];
        Array.prototype.forEach.call(pageItems, function(item){
            if (item.dataset.id*1 === id*1) pageItem = item;
        });
        return pageItem;
    }
    /**
     * Chenge actve page
     * @param targetPageObj {Page} page's object which need to be activated
     * @param pageItem {HTMLElement} button on right side
     * @param indx {number} position on _this._pages array
     * @public
     */
    , chengeActivePage: function(targetPageObj, pageItem, indx) {
        var _this = this;
        var targetPage = targetPageObj.getDOMSelf();
        var activePageObj = _this.getActivePageObject();
        var activePage = activePageObj.getDOMSelf();

        if (targetPage.classList.contains('spr-active-page')) {
            targetPage.classList.remove('spr-active-page');
        }
        _this.selection(targetPage, 'ul.spr-active-page', 'spr-active-page');
        _this._idActivePage = indx;
        _this.selection(pageItem);

        activePageObj.moveChildrenToHtmlDOM(activePage);
        targetPageObj.extractContent();
        document.title = targetPageObj.getPageTitle();
        controls.rebuildControl(targetPage);
        _this._refreshParallax(targetPage);
        _this._reloadMagnific(targetPage);
        _this.listenerSectionsMouseDown(targetPage);
        _this._reloadVideoBg(targetPage, 'run');
    }
    , getPagesArray: function() {
        return this._pages;
    }
    , getPagesNamesArray: function() {
        var names = [];
        this._pages.forEach(function(element){
            names.push(replaceSpace(element.getPageName()));
        });

        return names;
    }
    , setPageItemsName: function(name, pageItem) {
        pageItem.children[0].innerHTML = firstUp(name);
    }
    /**
     * --------------------------------- Part of builder - working with elements of sections --------------------------
     */

    /**
     * Set wrapper on editing element which contains control buttons
     * @param pageName {string}
     * @param mode {string} editing mode which to set on left side
     */
    , _setControlsElement: function (pageName, mode) {
        var _this = this;
        var sectionsPage = pageName ? '.' + pageName + ' > li, ': '';
        var sections = document.querySelectorAll(sectionsPage + '#modal-form-container');
        Array.prototype.forEach.call(sections, function(li) {
            options.editElementsList.forEach(function(editElement) {
                if (mode === editElement.mode) {
                    var editType = editElement.editType || '';
                    var classNameAdd = ' ' + editElement.positionControl;

                    if (Array.isArray(editElement.domIdentif)) {
                        editElement.domIdentif.forEach(function (domIdentif) {
                            if (domIdentif !== '') {
                                var elements = li.querySelectorAll(domIdentif);

                                Array.prototype.forEach.call(elements, function (el) {

                                    if (el.className.search(/supra/i) === -1
                                        && !el.classList.contains('upper-text')
                                        && el.parentElement.className.search('buttons-control') === -1) {
                                        if (editElement.btnContlType !== 'nowrap') {
                                            var wrap = _this._createControlElements(editElement, domIdentif, editType, classNameAdd, li, el);
                                            if (window.innerWidth <= 1024 && editElement.mode !== 'edit-typography') {
                                                el.addEventListener('touchstart', _this.elTouchDisable);
                                                el.addEventListener('touchend', _this.elTouchDisable);
                                            }
                                            //this is need for visible position buttons control
                                            controls.correctingPosition(wrap, li);

                                        } else {
                                            _this._wrapEvventMouseEnterEditEelement =
                                                _this._eventMouseEnterEditEelement.bind(_this, li, editElement, classNameAdd, el);
                                            el.addEventListener('mouseenter', _this._wrapEvventMouseEnterEditEelement);

                                            _this._arrListenersEditElement.push({
                                                el: el
                                                , func: _this._wrapEvventMouseEnterEditEelement
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });

            /**
             * for styling parent elements without buttons control
             * @type {NodeList}
             */
            var elements = li.querySelectorAll('.buttons-control, .buttons-control-form');
            Array.prototype.forEach.call(elements, function(el){
                var parent = controls.findParent(el.parentElement.parentElement, ['buttons-control', 'buttons-control-form']);
                if (parent) {
                    el.classList.add('child-event');

                    el.addEventListener('mouseenter', _this._eventMoseEnterOnChildActive.bind(parent));

                    el.addEventListener('mouseleave', _this._evetnMoseLeaveOnChildActive.bind(parent));
                }
            });
        });
    }
    /**
     * For setting control element if btnContlType is 'nowrap' in options
     * @param li {HTMLElement}
     * @param editElement {Object} parameter of options
     * @param classNameAdd {String}
     * @param el {HTMLElement}
     */
    , _eventMouseEnterEditEelement: function(li, editElement, classNameAdd, el, e) {
        var _this = this;
        if (!_this._triggerElementEnter) {
            el.classList.add('outline-control');
            var controlGroup = controls.getGroupControl(
                editElement.controlsElement
                , el
                , 'btn-group wrap-control-element' + classNameAdd
                , null
            );

            var boundingEl = el.getBoundingClientRect();
            var boundingLi = li.getBoundingClientRect();
            var topEl = boundingEl.top;
            var bottomEl = boundingEl.bottom;
            var leftEl = boundingEl.left;
            var rightEl = boundingEl.right;
            var topLi = boundingLi.top;
            var leftLi = boundingLi.left;

            var absoluteTop = topEl - topLi;
            var absoluteLeft = leftEl - leftLi;

            controlGroup.style.top = absoluteTop + 'px';
            controlGroup.style.left = absoluteLeft + 'px';
            controlGroup.style.display = 'block';
            controlGroup.style.opacity = '1';
            li.appendChild(controlGroup);

            var conditionMouseOut = {
                first: function(e, args){
                    return e.clientX >= args.right || e.clientY >= args.bottom || e.clientX <= args.left
                }
                , second: function (e, args) {
                    return e.clientY <= args.top
                }
            };

            var boundigCB = controlGroup.lastChild.getBoundingClientRect();
            var heightControlBtn = boundigCB.height;
            var widthControlBtn = boundigCB.width;

            //correcting vertical position btn control
            if ((topEl - heightControlBtn) < 0) {
                controlGroup.style.top = bottomEl - topLi + heightControlBtn;
                conditionMouseOut = {
                    first: function(e, args){
                        return e.clientX >= args.right || e.clientY <= args.top || e.clientX <= args.left
                    }
                    , second: function (e, args) {
                        return e.clientY >= args.bottom
                    }
                };
            }

            //correcting horizontal position btn control
            if (window.innerWidth <= (leftEl + widthControlBtn*controlGroup.children.length)) {
                controlGroup.style.left = (rightEl - leftLi - widthControlBtn*controlGroup.children.length) + 'px';
            }

            _this._triggerElementEnter = true;

            _this._wrapEvetMouseOutEditElement =
                _this._evetMouseOutEditElement.bind(_this, li, controlGroup, conditionMouseOut, el);
            document.addEventListener('mouseout', _this._wrapEvetMouseOutEditElement);
        }
    }
    /**
     *
     * @param li {HTMLElement}
     * @param controlGroup {HTMLElement}
     * @param el {HTMLElement}
     * @param e {Event}
     */
    , _evetMouseOutEditElement: function(li, controlGroup, conditionMouseOut, el, e) {
        var _this = this;
        if (_this._triggerElementEnter) {
            var boundingEl = el.getBoundingClientRect();
            var args = {
                top: boundingEl.top
                , right: boundingEl.right
                , bottom: boundingEl.bottom
                , left: boundingEl.left
            };

            if (conditionMouseOut.first(e, args) && controlGroup) {
                if (el.classList.contains('outline-control')) {
                    el.classList.remove('outline-control');
                }
                li.removeChild(controlGroup);
                _this._triggerElementEnter = false;
                document.removeEventListener('mouseout', _this._wrapEvetMouseOutEditElement);
            } else if (conditionMouseOut.second(e, args)) {
                _this._triggerElementEnter = false;

                document.removeEventListener('mouseout', _this._wrapEvetMouseOutEditElement);

                _this._wrapEvetMouseOutEditElement = function (controlGroup, el, e) {
                    var boundingCG = controlGroup.children[0].getBoundingClientRect();
                    var topCG = boundingCG.top;
                    var rightCG = controlGroup.lastChild.getBoundingClientRect().right;
                    var bottomCG = boundingCG.bottom;
                    var leftCG = boundingCG.left;
                    if (e.clientY <= topCG || e.clientX >=rightCG || e.clientY >= bottomCG || e.clientX <= leftCG) {
                        if (el.classList.contains('outline-control')) {
                            el.classList.remove('outline-control');
                        }
                        li.removeChild(controlGroup);
                        document.removeEventListener('mouseout', _this._wrapEvetMouseOutEditElement);
                    }
                }.bind(_this, controlGroup, el);

                document.addEventListener('mouseout', _this._wrapEvetMouseOutEditElement);

            }
        }
    }
    /**
     * For setting control element if btnContlType is't 'nowrap' in options
     * @param editElement {Object} parameter of options
     * @param domIdentif {String} parameter of options
     * @param editType {String} parameter of options
     * @param classNameAdd {String}
     * @param li {HTMLElement}
     * @param el {HTMLElement}
     */
    , _createControlElements: function(editElement, domIdentif, editType, classNameAdd, li, el) {
        var _this = this;
        var postfixWrap = editElement.controlsElement;
        var ObjControl = null;
        var wrap = document.createElement('div');
        wrap.className = 'buttons-control' + editType;

        var Obj = el;

        if (domIdentif.search(/img/) !== -1) {
            el.addEventListener('load', function() {
                //this is need for visible position buttons control
                var boundingElem = el.getBoundingClientRect();
                var heightElement = boundingElem.height;
                var widthElement = boundingElem.width;
                if ((heightElement < 50 || widthElement < 180) && classNameAdd === ' flex-center') {
                    var buttonGroup = wrap.querySelector('.flex-center');
                    buttonGroup.classList.remove('flex-center');
                    buttonGroup.classList.add('outside-top');
                }
            });

            if (el.parentElement.nodeName === 'A') {
                el = el.parentElement;
                Obj = el;
            }

            if (el.parentElement.parentElement.classList.contains('owl-item')) {
                ObjControl = li.children[0];
            }
        }

        this._setPropertyForWrapper(el, wrap, editElement.editType);

        wrap.wrap(el);

        if (el.tagName !== 'I' && el.tagName !== 'IMG') {
            el.style.width = '100%';

            var owlItem = controls.findParent(el, ['owl-item']);
            if (owlItem && el.classList.contains('item')) {
                el.style.height = owlItem.getBoundingClientRect().height + 'px';
            }
        }


        if (editElement.editType === '-typography'
            && el.nodeName !== 'A') {
            ObjControl = new EditorText(el);
            _this._arrEditorText.push({
                el: el
                , editor: ObjControl
            });
        }

        wrap.appendChild(controls.getGroupControl(
            postfixWrap
            , Obj
            , 'btn-group wrap-control-element' + classNameAdd
            , ObjControl
            )
        );

        if (controls.findParent(el, ['navbar-off-canvas'])) {
            wrap.querySelector('.wrap-control-element').classList.add('flex-wrap-control');
        }

        return wrap;
    }
    , _setPropertyForWrapper: function(el, wrap, editType) {
        var _this = this;
        var computedElStyle = window.getComputedStyle(el,null);
        var elementStyleDisplay = computedElStyle.getPropertyValue("display");
        var elementStylePosition = computedElStyle.getPropertyValue("position");
        var elementStyleMarginTop = computedElStyle.getPropertyValue("margin-top");
        var elementStyleMarginRight = computedElStyle.getPropertyValue("margin-right");
        var elementStyleMarginBottom = computedElStyle.getPropertyValue("margin-bottom");
        var elementStyleMarginLeft = computedElStyle.getPropertyValue("margin-left");

        wrap.style.marginTop = elementStyleMarginTop;
        wrap.style.marginRight = elementStyleMarginRight;
        wrap.style.marginBottom = elementStyleMarginBottom;
        wrap.style.marginLeft = elementStyleMarginLeft;
        if (!el.classList.contains('aos-init')) {
            el.style.transition = 'all 0s ease 0s';
        }
        el.style.margin = 0;
        wrap.style.display = elementStyleDisplay !== 'inline' ? elementStyleDisplay: 'inline-block';
        //TODO: check this property
        if (el.nodeName === 'IMG') wrap.style.display = 'inline-block';

        if (el.className.search(/half-container/) !== -1) el.style.height = '100%';

        if (elementStylePosition === 'static') {
            var computedStyle = window.getComputedStyle(el, null);
            var elementStyleFloat = computedStyle.getPropertyValue("float");
            var style = wrap.getAttribute('style');
            wrap.setAttribute('style', style + 'float: ' + elementStyleFloat + ';');

        } else {
            if (el.parentElement.className.search(/buttons-control.*/i) === -1) {
                _this.setPosition(el, wrap, elementStylePosition, 1);
                el.style.position = 'static';
            }
        }

        if (elementStyleDisplay === 'inline' || elementStyleDisplay === 'inline-block') {
            // cheking editType need for edit type -icons -typography
            if (el.nodeName === 'A' || (el.nodeName === 'I' && !editType)) {
                el.style.display = 'block';
            } else {
                el.style.display = 'inline-block';
            }
            el.style.minWidth = el.nodeName === 'I' ? 'none' : '15px';
        }
    }
    , setPosition: function(el, wrap, elementStylePosition, zIndex) {
        var computedStyle = window.getComputedStyle(el, null);
        var elementStyleTop = computedStyle.getPropertyValue("top");
        var elementStyleRight = computedStyle.getPropertyValue("right");
        var elementStyleBottom = computedStyle.getPropertyValue("bottom");
        var elementStyleLeft = computedStyle.getPropertyValue("left");
        var elementStyleFloat = computedStyle.getPropertyValue("float");

        wrap.style.position = elementStylePosition;
        wrap.style.top = elementStyleTop;
        wrap.style.right = elementStyleRight;
        wrap.style.bottom = elementStyleBottom;
        wrap.style.left = elementStyleLeft;
        wrap.style.zIndex = zIndex;
        var style = wrap.getAttribute('style');
        wrap.setAttribute('style', style + 'float: ' + elementStyleFloat + ';');
    }
    , clearControlElements: function(page) {
        var _this = this;
        var wraps = page.querySelectorAll('.buttons-control, .buttons-control-form, .buttons-control-typography, .buttons-control-icons');
        Array.prototype.forEach.call(wraps, function(element) {
            _this.clearEditElement(element);
        });

        if (_this._arrEditorText.length > 0) {
            _this._arrEditorText.forEach(function (editor) {
                editor.el.removeEventListener('mouseenter', editor.editor.mouseEnter);
                editor.el.parentElement.removeEventListener('click', editor.editor.clickIngalleryEditTagA);
                editor.el.removeEventListener('mouseup', editor.editor.mouseUp);
                editor.el.removeEventListener('touchend', editor.editor.touchEnd);
                editor.el.removeEventListener('keydown', editor.editor.keyDown);
                editor.el.removeEventListener('mouseleave', editor.editor.mouseLeave);
                editor.el.removeEventListener('paste', editor.editor.paste);
            });
        }

        if (_this._arrListenersEditElement.length > 0) {
            _this._arrListenersEditElement.forEach(function (listenter) {
                listenter.el.removeEventListener('mouseenter', listenter.func);
            });
        }

        var maps = page.querySelectorAll('.g-map');
        if (maps) {
            Array.prototype.forEach.call(maps, function(map){
                var li = controls.findParent(map, ['section-item']);
                map.innerHTML = '';
                map.removeAttribute('style');
                _this.reloadScript(li);
            });
        }

        _this._arrEditorText = [];
        _this._arrListenersEditElement = [];
    }
    , clearEditElement: function(element) {
        var btnControl = element.lastChild;
        element.children[0].removeEventListener('touchstart', this.elTouchDisable);
        element.children[0].removeAttribute('style');
        element.removeChild(btnControl);
        element.unWrapOne();
    }
    , elTouchDisable: function(e) {
        if (e.type === 'touchstart') {
            builder._dropY = e.changedTouches[0].pageY;
        } else if (e.type === 'touchend'
            && builder._dropY === e.changedTouches[0].pageY) {
            e.preventDefault();
        }
    }
    /**
     * --------------------------------- Part of builder - working with project -------------------------------------
     */
    , _callNewProject: function() {
        var exportButton = this._controlPanel.ProjectPages.self.querySelector('.new-project');
        exportButton.addEventListener('click', function() {
            var modal = new Modal('supra-modal', 'DeleteProject', null);
            $(modal).modal('show');
        });
    }
    , createNewProject: function() {
        var _this = this;
        var dataSave = document.createDocumentFragment();
        while(_this.main.children[0]) {
            dataSave.appendChild(_this.main.children[0]);
        }
        _this.main.innerHTML = '<style></style>';
        var pagesSave = _this.cloneObject(_this._pages);
        var ul = this._controlPanel.ProjectPages.self.querySelector('ul');
        var pageItems = ul.querySelectorAll('li');
        for (var i = 0; i < pageItems.length - 1; i++) {
            pageItems[i].parentNode.removeChild(pageItems[i]);
        }
        _this._pages = [];
        _this.forms = {};
        _this.sectionsName = [];
        _this.gMaps = [];
        _this.arrayFontsOnProject = [];
        _this._idActivePage = 0;
        _this._pages.push(new Page('index', 0, _this.main));
        _this._pages[_this._idActivePage].getDOMSelf().classList.add('edit-sections');
        _this._pages[_this._idActivePage].getDOMSelf().classList.add('spr-active-page');
        _this._pages[_this._idActivePage].getDOMSelf().classList.add('light-page');
        _this.main.children[0].innerHTML = '';
        _this._style.html = _this.main.children[0];
        Array.prototype.forEach.call(_this._controlPanel.style.ul, function(ul) {
            ul.innerHTML = '';
        });
        _this._addProjectPagesToRightSide();
        _this._initStyle();
        var spOptions = _this.main.querySelectorAll('.sp-container');
        Array.prototype.forEach.call(spOptions, function(el){
            el.parentElement.removeChild(el);
        });
        _this._initTypography();

        document.title = _this.getActivePageObject().getPageTitle();

        _this.setStep(function(){
            _this.main.innerHTML = '';
            _this.main.appendChild(dataSave);
            _this._pages = pagesSave;

            _this.setStep(function () {
                _this.createNewProject();
            });
        });
    }
    , _callExport: function() {
        var _this = this;
        var exportButton = this._controlPanel.ProjectPages.self.querySelector('.export');
        exportButton.addEventListener('click', function() {
            if (!_this._triggerExport) {
                _this._triggerExport = true;
                if (_this.sectionsName.length > 0) {

                    var data = _this._prepareContentPagesToSave();
                    var form = new FormData();
                    form.append('data', data);
                    _this.ajax(form, 'export', function (data) {
                        var data = JSON.parse(data);

                        window.downloadFile(baseUri + 'tmp/' + data.file, data.file);
                        setTimeout(function(){
                            _this._triggerExport = false;
                        },2000);
                    });
                }
            }
        });
    }
    , _callImport: function() {
        var _this = this;
        var importButton = this._controlPanel.ProjectPages.self.querySelector('.import');
        importButton.addEventListener('click', function() {
            if (!_this._triggerImport) {
                _this._triggerImport = true;
                var inputFile = document.createElement('input');
                inputFile.setAttribute("type", "file");
                inputFile.setAttribute("name", 'data');
                inputFile.style.display = 'none';
                document.body.appendChild(inputFile);
                inputFile.addEventListener('change', function () {
                    if (inputFile.files && inputFile.files[0]) {
                        var nameFile = inputFile.files[0].name;
                        var form = new FormData();
                        form.append('data', inputFile.files[0]);
                        form.append('name_file', nameFile);
                        _this.ajax(form, 'import', function (data) {
                            var datas = _this._prepareContentPagesToSave('no-storage');

                            _this._loadProject(data, 'load');
                            document.body.removeChild(inputFile);

                            builder.setStep(function () {
                                _this._loadProject(datas, 'import');
                            });
                        });
                    }
                });
                inputFile.click();
                setTimeout(function(){
                    _this._triggerImport = false;
                },2000);
            }
        });

    }
    , _loadProject: function(data, mode) {
        var _this = this;
        var data = JSON.parse(data);

        var pagesStorageObj = JSON.parse(data.pagesStorageObj);
        var projectData = JSON.parse(data.projectData);
        var modalContainer = JSON.parse(data.modalContainer);
        var modalFormContainer = JSON.parse(data.modalFormContainer);
        var forms = data.forms ? JSON.parse(data.forms): [];
        var gMaps = data.gMaps ? JSON.parse(data.gMaps): [];

        _this.sectionsName = JSON.parse(data.sectionsName);
        _this._videoBg = JSON.parse(data.video_bg);
        _this._owlGallery = JSON.parse(data.gallery);
        _this._formSection = JSON.parse(data.form_section);
        _this._smooth = JSON.parse(data.smooth);
        _this._parallax = JSON.parse(data.parallax);

        _this.triggerImport = true;

        var modeEdit = 'edit-sections';

        if (mode === 'load') modeEdit = 'edit-project-page';

        if (mode === 'import') {
            modeEdit = 'edit-project-page';
            var datas = _this._prepareContentPagesToSave('no-storage');
            builder.setStep(function(){
                _this._loadProject(datas, 'import');
            });
        }

        _this.main.innerHTML = '';

        if (typeof projectData === 'string') {
            _this.main.innerHTML = projectData;
        } else {
            _this.main.appendChild(projectData);
        }

        var sections = _this.main.querySelectorAll('ul.spr-active-page > li');
        var timeLoading = sections.length * 2;
        loadPreloader.style.transition = 'width ' + (timeLoading/2) + 's ease-out';
        loadPreloader.style.width = '100%';
        setTimeout(function(){
            removePreloader();
        }, timeLoading*500);

        _this.clearGalleryOnPage(_this.main);
        var ul = this._controlPanel.ProjectPages.self.querySelector('ul');
        var pageItems = ul.querySelectorAll('li');
        for (var i = 0; i < pageItems.length - 1; i++) {
            pageItems[i].parentNode.removeChild(pageItems[i]);
        }
        var pages = _this.main.parentElement.querySelectorAll('.main > ul');
        var activePage = _this.main.parentElement.querySelector('.main > ul.spr-active-page');
        _this._pages = [];

        pagesStorageObj = pagesStorageObj.filter(function(Obj){
            return Obj;
        });

        _this._style.html = _this.main.children[0];

        Array.prototype.forEach.call(pages, function (page, indx) {

            var i = 0;
            while (pagesStorageObj[i].id !== page.dataset.id*1) {
                i++;
            }
            var pageStgObj = pagesStorageObj[i];

            _this._pages.push(new Page(page.dataset.name, _this._pages.length, _this.main, 'load'));

            var pageObj = _this._pages[indx];

            _this._stopFormValidation(page);

            pageObj.setPageTitle(pageStgObj._title, true);
            pageObj.setMetaDes(pageStgObj._metaDes, true);
            pageObj.setMetaKey(pageStgObj._metaKey, true);
            pageObj.setJs(pageStgObj._metaJs, true);
            pageObj.preloader = pageStgObj.preloader;

            pageObj.sections = pageStgObj.sections;
            pageObj.html = pageStgObj.html;

            _this._reloadVideoBg(page);
        });

        _this.modalContainer.innerHTML = modalContainer;
        _this.modalFormContainer.innerHTML = modalFormContainer;
        _this.forms = forms;
        _this.gMaps = gMaps;

        _this.reloadScript(activePage);
        controls.rebuildControl(activePage);
        _this._chengePageMode(activePage, modeEdit);
        _this.listenerSectionsMouseDown(activePage);
        _this._clearNavigation(activePage);
        _this._idActivePage = activePage.dataset.id;

        _this._addProjectPagesToRightSide();

        _this._style.html = _this.main.children[0];
        _this._loadStyle();
        _this._loadTypography();

        _this._reloadMagnific(activePage);
        setTimeout(function() {
            _this._refreshParallax(activePage);
        }, 1000);

        document.title = _this.getActivePageObject().getPageTitle();

        _this.triggerImport = false;
    }
    , _callDownload: function() {
        var _this = this;
        var downloadButton = this._controlPanel.ProjectPages.self.querySelector('.download');
        downloadButton.addEventListener('click', function () {
            if (typeof download === 'function') {
                download(_this);
            } else {
                var modal = new Modal('supra-modal', 'Demo', downloadButton);
                $(modal).modal('show');
            }
        });
    }
    /**
     * --------------------------------- Part of builder - include some applications in project ---------------------
     */
    , _findElForOptions: function(DOM) {
        var _this = this;
        var options = DOM.querySelectorAll('.bg-video, .spr-gallery, form, .parallax, .single-iframe-popup, .smooth, .spr-magnific, [data-aos]');
        Array.prototype.forEach.call(options, function(el) {
            if (el.classList.contains('bg-video')) {
                _this._videoBg = true;
            }
            if (el.classList.contains('spr-gallery')) {
                _this._owlGallery = true;
                //_this._magnific = true;
                //_this._setMagnificScript(true);
            }
            if (el.tagName === 'FORM') {
                _this._formSection = true;
            }
            if (el.classList.contains('parallax')) {
                _this._parallax = true;
            }
            if (el.classList.contains('smooth')) {
                _this._smooth = true;
            }
            if (el.classList.contains('single-iframe-popup') || el.classList.contains('spr-magnific')) {
                _this._magnific = true;
                _this._setMagnificScript(true);
            }
            if (el.dataset.aos) {
                _this._aos = true;
            }
        });
    }
    /**
     * Reset indicators existence some applications in project
     * @private
     */
    , _resetIndExist: function() {
        this._videoBg = false;
        this._owlGallery = false;
        this._formSection = false;
        this._parallax = false;
        this._smooth = false;
        this._magnific = false;
        this._setMagnificScript(false);
    }
    , _setMagnificScript: function(arg) {
        if (arg) {
            this._magnificScript = '\n$(\'.single-iframe-popup\').magnificPopup({'
                + '\n\ttype: \'iframe\','
                + '\n\tiframe: {'
                + '\n\t\tpatterns: {'
                + '\n\t\t\tyoutube: {'
                + '\n\t\t\t\tindex: \'www.youtube.com/\','
                + '\n\t\t\t\tid: \'v=\','
                + '\n\t\t\t\tsrc: \'https://www.youtube.com/embed/%id%?autoplay=1\''
                + '\n\t\t\t}'
                + '\n\t\t\t, vimeo: {'
                + '\n\t\t\t\tindex: \'vimeo.com/\','
                + '\n\t\t\t\tid: \'/\','
                + '\n\t\t\t\tsrc: \'https://player.vimeo.com/video/%id%?autoplay=1\''
                + '\n\t\t\t}'
                + '\n\t\t}'
                + '\n\t}'
                + '\n});';
        } else {
            this._magnificScript = '';
        }
    }
    , _reloadMagnific: function(page) {
        var _this = this;
        var magnific = page.querySelectorAll('.single-iframe-popup');
        if (magnific) {
            Array.prototype.forEach.call(magnific, function(anchor) {
                _this.applyMagnificPopup(anchor);
            });
        }

    }
    , _reloadVideoBg: function (page, mode) {
        var vides = page.querySelectorAll('.bg-video');
        if (vides) {
            Array.prototype.forEach.call(vides, function (vide, indx) {
                if (mode === 'run') {
                    if ($(vide).data('vide')) {
                        $(vide).data('vide').destroy();
                    }
                    vide.innerHTML = '';
                    $(vide).vide();
                } else if (mode === 'reload') {
                    var video = vide.querySelector('video');
                    if (video.paused)
                        video.play();

                } else if (mode === 'clear') {
                    vide.innerHTML = '';
                }
            });
        }
    }
    /**
     * --------------------------------- Part of builder - history project ------------------------------------------
     */
    , _selectionNavUndo: function() {
        var _this = this;
        _this._undo.addEventListener('click', function() {
            var head = _this.arrayPrevStep.length - 1;
            if (head !== -1) {
                _this.triggerUndo = true;
                _this.arrayPrevStep[head]();
                _this.arrayPrevStep = _this.arrayPrevStep.slice(0, head);
                if (_this.arrayPrevStep.length === 0
                    && !_this._undo.classList.contains('unactive')) {
                    _this._undo.classList.add('unactive');
                }
            }
        });
    }
    , _selectionNavRedo: function() {
        var _this = this;
        _this._redo.addEventListener('click', function() {
            var head = _this.arrayNextStep.length - 1;
            if (head !== -1) {
                _this.triggerRedo = true;
                _this.arrayNextStep[head]();
                _this.arrayNextStep = _this.arrayNextStep.slice(0, head);
                if (_this.arrayNextStep.length === 0
                    && !_this._redo.classList.contains('unactive')) {
                    _this._redo.classList.add('unactive');
                }
            }
        });
    }
    , setStep: function(func) {
        if (this.triggerUndo) {
            this.arrayNextStep.push(func);

            if (this._redo.classList.contains('unactive')) {
                this._redo.classList.remove('unactive');
            }
        } else {
            if (!this.triggerRedo) this.arrayNextStep = [];
            this.arrayPrevStep.push(func);

            if (this.arrayPrevStep.length > 20) {
                this.arrayPrevStep.shift();
            }

            if (this._undo.classList.contains('unactive')) {
                this._undo.classList.remove('unactive');
            }
            if (this.arrayNextStep.length < 1) {
                this._redo.classList.add('unactive');
            }
        }

        this.triggerUndo = false;
        this.triggerRedo = false;
    }
    /**
     * --------------------------------- Part of builder - some helpful functions -------------------------------------
     */
    , cloneOwlGallery: function(container) {
        var cloneSection = container.cloneNode(true);
        var gallery = cloneSection.querySelector('.spr-gallery');
        if (gallery) {
            var newGallery = gallery.cloneNode(true);
            this.removeOwlSuperstructure(newGallery);
            gallery.parentNode.insertBefore(newGallery, gallery);
            gallery.parentNode.removeChild(gallery);
            container.parentNode.insertBefore(cloneSection, container.nextSibling);
        }
        return cloneSection;
    }
    , clearGalleryOnPage: function(page) {
        var _this = this;
        var gallerys = page.querySelectorAll('.spr-gallery');
        Array.prototype.forEach.call(gallerys, function (gallery) {
            _this.removeOwlSuperstructure(gallery);
        });
    }
    , removeOwlSuperstructure: function(gallery) {
        gallery.classList.remove('owl-carousel');
        gallery.classList.remove('owl-theme');
        gallery.classList.remove('owl-loaded');
        var items = gallery.querySelectorAll('.owl-item:not(.cloned) .item');
        gallery.innerHTML = '';
        Array.prototype.forEach.call(items, function(element) {
            gallery.appendChild(element);
        });
    }
    , reloadScript: function(container) {
        var scripts = container.querySelectorAll('script');
        Array.prototype.forEach.call(scripts, function (script) {
            var scriptHtml = script.innerHTML;
            var newScript = document.createElement('script');
            newScript.setAttribute('type', 'text/javascript');
            var next = script.nextSibling;
            var parent = script.parentElement;
            parent.removeChild(script);
            if (next) {
                parent.insertBefore(newScript, next);
            } else {
                parent.appendChild(newScript);
            }
            newScript.innerHTML = scriptHtml;
        });
    }
    , _refreshParallax: function(target) {
        var _this = this;
        var bgArray = target.querySelectorAll('.parallax-bg');
        if (skr && bgArray) {
            Array.prototype.forEach.call(bgArray, function(bg){
                _this._clearParallaxSuperstructure(bg);
            });
            skr.refresh();
        }
    }
    , _clearParallaxSuperstructure: function(page) {
        var bgArray = page.querySelectorAll('.parallax-bg');
        Array.prototype.forEach.call(bgArray, function(parallaxBg){
            parallaxBg.classList.remove('skrollable');
            parallaxBg.classList.remove('skrollable-between');
            parallaxBg.removeAttribute('style');
        });

    }
    /**
     * Remove class show-menu and adapt height wrapper of nav
     * @param page {HTMLElement}
     * @private
     */
    , _clearNavigation: function(page) {
        var menu = page.querySelector('nav');
        if (menu) {
            if (menu.classList.contains('show-menu')) {
                menu.classList.remove('show-menu');
            }
            if (menu.className.search(/navbar-fixed-top nav-start-hide-bg nav-start-double-pad/) !== -1) {
                window.section = menu;
                window.addEventListener('scroll', builder.listenerSrcollTopForNav);
            }

            setTimeout(function () {
                var k = 1;
                if (menu.className.search(/nav-start-double-pad/) !== -1) k = 3;
                var heightLi = menu.getBoundingClientRect().height * k;
                menu.parentElement.style.height = heightLi + 'px';
            }, 500);
        }
    }
    /**
     * Stop validotion
     * @param page {HTMLElement}
     * @private
     */
    , _stopFormValidation: function(page) {
        var forms = page.querySelectorAll('form');
        Array.prototype.forEach.call(forms, function(form){
            form.querySelector('button[type=submit]').addEventListener('click', function(e){
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            });
        });
    }
    /**
     * Set height wrapper of nav
     */
    , listenerSrcollTopForNav: function() {
        if (window.scrollY > 180) {
            window.section.parentElement.style.height = '60px';
        } else {
            window.section.parentElement.style.height = '180px';
        }
    }
    , _clearOptionClasses: function(page) {
        var options = page.querySelectorAll('[class*=spr-], [class*=aos-]');
        Array.prototype.forEach.call(options, function(el) {
            if (el.className.match(/(\s?spr-[^\s]*)+/i)) {
                el.className = el.className.replace(/(\s?spr-[^\s]*)+/ig, '').trim();
                if (el.className === '') el.removeAttribute('class');
            }
            if (el.className.match(/(\s?aos-[^\s]*)+/i)) {
                el.className = el.className.replace(/(\s?aos-[^\s]*)+/ig, '').trim();
                if (el.className === '') el.removeAttribute('class');
            }
        });
    }
    , uniqueName: function(name, arrNames) {
        arrNames = arrNames.sort(function(a, b){
            if (a.split('--')[1] && b.split('--')[1] && a.split('--')[1]*1 > b.split('--')[1]*1) {
                return 1;
            } else if (a.split('--')[1] && b.split('--')[1] && a.split('--')[1]*1 < b.split('--')[1]*1) {
                return -1;
            } else if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            }

            return 0;
        });

        arrNames.forEach(function(itemName){
            var newName = name.split('--');
            if (newName[1] && itemName === name) {
                name = newName[0] + '--' + ((newName[1] * 1) + 1);
            } else if (itemName === name) {
                name = newName[0] + '--0';
            }
        });

        return name;
    }
    , applyMagnificPopup: function(DOMEelement) {
        var _this = this;
        if (DOMEelement.tagName !== 'A') DOMEelement = DOMEelement.parentElement;
        if (DOMEelement.tagName === 'A'
            && DOMEelement.href.search(/player\.vimeo\.com|embed/i) === -1
            && DOMEelement.href.search(/vimeo\.com|youtube\.com/i) !== -1) {
            if (!DOMEelement.classList.contains('single-iframe-popup')) DOMEelement.classList.add('single-iframe-popup');
            if (DOMEelement.classList.contains('smooth')) DOMEelement.classList.remove('smooth');
            $(DOMEelement).magnificPopup({
                type: 'iframe',
                iframe: {
                    patterns: {
                        youtube: {
                            index: 'www.youtube.com/',
                            id: 'v=',
                            src: 'https://www.youtube.com/embed/%id%?autoplay=1'

                        }
                        , vimeo: {

                            index: 'vimeo.com/',
                            id: '/',
                            src: 'https://player.vimeo.com/video/%id%?autoplay=1'
                        }
                    }
                },
                disableOn: function() {
                    if(_this.editingText) {
                        return false;
                    }
                    return true;
                }
            });

            var li = controls.findParent(DOMEelement, ['section-item']);
            var script = li.querySelector('script');
            if (script.innerHTML.search(/\/\/magnific/im) === -1) {
                script.innerHTML += '\n//magnific'
                    + '\n//------------------------------------------------------------------------'
                    + '\n//                    MAGNIFIC POPUP(LIGHTBOX) SETTINGS'
                    + '\n//------------------------------------------------------------------------'
                    + '\n'
                    + '\n$(\'.single-iframe-popup\').magnificPopup({'
                    + '\n\ttype: \'iframe\''
                    + '\n});'
                    + '\n//magnificend';
            }
        }
    }
    /**
     * Adding new form to forms data and set new form id
     * @param form {HTMLElement}
     * @param section {HTMLElement}
     */
    , addNewForm: function(form, section, oldSection) {
        var condition = oldSection ? '#' + oldSection + '-form' : '\\.(?:contact|subscribe)_form';
        form.id = section.id + '-form';
        this.forms[section.id] = {};

        var script = section.parentElement.querySelector('script');
        var patternForm = new RegExp(condition, 'img');
        script.innerHTML = script.innerHTML.replace(patternForm, '#' + section.id + '-form');

        form.querySelector('button[type=submit]').addEventListener('click', function(e){
            e.stopPropagation();
            e.preventDefault();
        });
    }
    /**
     * Adding new google map to gMaps data and set new id
     * @param gMap {HTMLElement}
     * @param section {HTMLElement}
     */
    , addNewGMap: function(gMap, section) {
        var id = section.id.split('--')[0] + '-map';
        id = this.uniqueName(id, this.gMaps);
        gMap.id = id;

        this.gMaps.push(id);
        return id;
    }
    /**
     *
     * @param script {HTMLElement}
     * @param id {string}
     * @param newId {string}
     */
    , changeIdGMapInScript: function(script, id, newId) {
        newId = newId || id;
        var funcId = newId.replace(/-/ig, '_');
        var oldId = id.replace(/-/ig, '_');

        var patternMapId = new RegExp('(google\\.maps\\.Map\\(document\\.getElementById\\(\')(?:' + id + '|map)','im');
        var patternMapFuncInit = new RegExp('(initialize)(?:_' + oldId + '\\s*\\(|\\s*\\()','img');
        script.innerHTML = script.innerHTML.replace(patternMapFuncInit, '$1_' + funcId + '(');
        script.innerHTML = script.innerHTML.replace(patternMapId, '$1' + newId);
    }
    /**
     *
     * @param script {HTMLElement}
     * @param id {string}
     * @param newId {string}
     */
    , copyFunctionInitGmap: function(script, id, newId) {
        var funcId = newId.replace(/-/ig, '_');
        var oldId = id.replace(/-/ig, '_');

        var contextStart = funcId + '\\([\\s\\S]*?';
        var contextEnd = '[\\s\\S]*?' + funcId + '\\(';

        var patternMapFuncInit = new RegExp('(initialize)(_' + oldId + '.*{)([\\s\\S]*?)(initialize)(_' + oldId + '.*)(\\(\\);)','im');
        var init = script.innerHTML.match(patternMapFuncInit);
        script.innerHTML = script.innerHTML.replace(patternMapFuncInit, '$1$2$3$4$5$6\n\nfunction '
            + init[1] + '_' + funcId + '() {\n' + init[3] + init[4] + '_' + funcId + init[6]);

        var patternMapId = new RegExp('(' + contextStart + 'google\\.maps\\.Map\\(document\\.getElementById\\(\')[^\']*(' + contextEnd + ')','im');
        script.innerHTML = script.innerHTML.replace(patternMapId, '$1' + newId + '$2');
    }
    /**
     *
     * @param script {HTMLElement}
     * @param id {string}
     */
    , deleteFunctionInitGmap: function(script, id) {
        var funcId = id.replace(/-/ig, '_');

        var contextStart = funcId + '\\([\\s\\S]*?';
        var contextEnd = funcId + '\\(\\);';

        var patternMapFuncInit = new RegExp('function[\\w\\s]*' + contextStart + contextEnd,'im');
        var match = script.innerHTML.match(patternMapFuncInit);
        script.innerHTML = script.innerHTML.replace(patternMapFuncInit, '');
        return match;
    }
    , count: 0
    , cloneObject: function(Obj) {
        var _this = this;
        this.count++;
        if (Obj instanceof Array) {
            var clone = [];
            Obj.forEach(function(el, item){
                clone[item] = _this._checkElmtsForCloneObj(_this, el);
            });
        } else {
            var clone = {};
            for (var item in Obj) {
                clone[item] = _this._checkElmtsForCloneObj(_this, Obj[item]);
            }
        }

        return clone;
    }
    , _checkElmtsForCloneObj: function(_this, Obj) {
        var result = null;
        if (Obj instanceof HTMLElement || Obj instanceof DocumentFragment)
            result = Obj;
        else if (Obj instanceof Array)
            result = cloneArray(Obj);
        else if (Obj && typeof(Obj) === "object")
            result = _this.cloneObject(Obj);
        else
            result = Obj;
        return result;
    }
    , replaceQuotes: function(string) {
        return string.replace(/['"]+/ig, "");
    }
    , _messageBox: function() {
        var message = document.querySelector('.message');
        message.querySelector('i').addEventListener('click', function() {
            message.parentElement.removeChild(message);
        });
    }
    , removeWrapDrag: function() {
        var _this = this;
        var page = _this.getActivePageObject().getDOMSelf();
        var drag = document.querySelector('.wrap-drag');
        if(drag) {
            page.removeChild(drag);
            page.classList.remove('loading');
        }
    }
    , addWrapDrag: function() {
        var page = this.getActivePageObject().getDOMSelf();
        page.classList.add('loading');
        page.innerHTML = '<div class="wrap-drag flex-center">'
            + '<p><i class="icon-reply"></i>Start creating pages by dragging/clicking sections from the left panel</p>'
            + '</div>';
    }
    , _hideSections: function(_this) {
        _this._controlPanel.sections.self.classList.remove('show');
        document.body.classList.add('add-s-i-hide');
        setTimeout(function() {
            if (document.body.classList.contains('add-s-i-hide')) {
                document.body.classList.remove('add-s-i-hide');
            }
        }, 800);
    }
    , detectLeftButton: function(evt) {
        evt = evt || window.event;
        if ("buttons" in evt) {
            return evt.buttons == 1;
        }
        var button = evt.which || evt.button;
        return button == 1;
    }
    , ajax: function(form, urlAjax, callback) {
        var xhr = new XMLHttpRequest();
        var method = 'POST';
        var url = baseUri + 'ajax.php?mode=' + urlAjax;
        xhr.open(method, url, true);
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (xhr.status == 200) {
                    if (callback) callback(xhr.responseText);
                }
                else {
                    var res = "There was a problem with the request " + xhr.status;
                    alert(res);
                }
            }
        };
        xhr.send(form);
    }
};



/*
 * @autor: MultiFour
 * @version: 1.0.0
 */

"use strict";

/* --------------------------------------------- Preloader ------------------------------------------------------- */
var loadPreloader = document.querySelector('.progress .load');
var baseUri = location.protocol + '//' + location.hostname + location.pathname;
function removePreloader() {
    var preloader = document.querySelector('.supra-preloader');
    var body = document.querySelector('body');
    body.classList.add('run');
    setTimeout(function () {
        if (preloader && preloader.parentElement) {
            preloader.parentElement.removeChild(preloader);
        }
    }, 1600);
    AOS.init({
        easing: 'ease-in-out-sine'
    });
}


/* ----------------------------------------------- Init Builder --------------------------------------------------- */

var builder = null;

var skr = null;

document.addEventListener('DOMContentLoaded', function(){
    builder = new Suprabuilder();

    if (!navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|IEMobile/)) {
        skr = skrollr.init(
            {
                smoothScrolling: false
                , forceHeight: false
                , mobileDeceleration: 0.004
            }
        );
    }
});

window.addEventListener('load',function(){
    setTimeout(function(){
        $('aside.control-panel').niceScroll({cursorcolor: "#555555", cursorborder: "1px solid #555555", autohidemode: "scroll", hidecursordelay: 0});
        $('aside.add-sections-items').niceScroll({cursorcolor: "#555555", cursorborder: "1px solid #555555", autohidemode: "scroll", hidecursordelay: 0});
    }, 1600);

    if (!window.localStorage.project) {
        loadPreloader.style.width = '100%';
        removePreloader();
    }
});

/* --------------------------------------------- LIBRARY --------------------------------------------------------- */
window.downloadFile = function(sUrl, fileName) {
    if (window.downloadFile.isChrome || window.downloadFile.isSafari) {
        var link = document.createElement('a');
        link.href = sUrl;

        if (link.download !== undefined){
            link.download = fileName;
        }

        if (document.createEvent) {
            var e = document.createEvent('MouseEvents');
            e.initEvent('click' ,true ,true);
            link.dispatchEvent(e);
            return true;
        }
    } else {
        var query = '?download';
        window.open(sUrl + query);
    }
};
window.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') != -1;
window.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') != -1;
/**
 * wrap only one elements
 * @param elms {HTMLElement}
 */
HTMLElement.prototype.wrap = function(elms) {
    var child = this;

    var parent  = elms.parentNode;
    var sibling = elms.nextSibling;

    child.appendChild(elms);

    if (sibling) {
        parent.insertBefore(child, sibling);
    } else {
        parent.appendChild(child);
    }
};
/**
 * unwrap only one elements
 */
HTMLElement.prototype.unWrapOne = function(mode) {
    var child = this.children[0];

    var parent = this.parentElement;
    var sibling = this.nextSibling;

    try {
        if (child.hasAttribute('style') && mode !== 'save-style') {
            child.removeAttribute('style');
        }
    }
    catch (e) {
        console.log(this, child);
    }


    if (sibling) {
        parent.insertBefore(child, sibling);
    } else {
        parent.appendChild(child);
    }
    parent.removeChild(this);
};

function firstUp(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function firstDown(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

function replaceSpace(str) {
    return str.replace(/\s/ig, '_');
}

function toPageName(str) {
    return str.replace(/_/ig, ' ');
}

function cloneArray(arr) {
    return arr.slice(0, arr.length);
}

function htmlencode(str) {
    return str.replace(/[&<>"']/g, function($0) {
        return "&" + {"&":"amp", "<":"lt", ">":"gt", '"':"quot", "'":"#39"}[$0] + ";";
    });
}

function htmldecode(str) {
    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, function($0) {
        return {"&amp;":"&", "&lt;":"<", "&gt;":">", '&quot;':"\"", "&#39;":"'"}[$0];
    });
}

function addSleshes(str) {
    return str.replace(/[\*\(\)]/g, function($0) {
        return {"*":"\\*", "(":"\\(", ")":"\\)"}[$0];
    });
}

function getDomPath(el) {
    var stack = [];
    while ( el.parentNode != null && !el.classList.contains('section-item')) {
        var sibCount = 0;
        var sibIndex = 0;
        if (!el.classList.contains('buttons-control')) {
            var elBase = el;
            if (el.parentElement.classList.contains('buttons-control')) {
                elBase = el.parentElement;
            }
            for (var i = 0; i < elBase.parentNode.childNodes.length; i++) {
                var sib = elBase.parentNode.childNodes[i];
                if (sib.nodeName == elBase.nodeName) {
                    if (sib === elBase) {
                        sibIndex = sibCount;
                    }
                    sibCount++;
                }
            }
            if (el.hasAttribute('id') && el.id != '') {
                stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
            } else if (sibCount > 1) {
                stack.unshift(el.nodeName.toLowerCase() + ':nth-child(' + (sibIndex + 1) + ')');
            } else {
                stack.unshift(el.nodeName.toLowerCase());
            }
        }
        el = el.parentNode;
    }

    return stack.join(' > ');
}

//crutch for ie
(function () {
    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();