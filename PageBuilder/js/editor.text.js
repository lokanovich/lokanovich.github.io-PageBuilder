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

            var magnific = el.querySelector('.single-iframe-popup, .single-image-popup');
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
                    if (wrapControl.classList.contains('anim')) {
                        wrapControl.classList.remove('anim');
                    }
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
                        wrapControl.style.left = left + (widthWindow - 10 - rightBControl) + 'px';
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
                wrapControl.classList.add('anim');
            } else {
                var wrapControl = _this._DOMEditingEl.parentElement.children[1];
                wrapControl.removeAttribute('style');
                if (wrapControl.classList.contains('anim')) {
                    wrapControl.classList.remove('anim');
                }
            }
        } else {
            var wrapControl = _this._DOMEditingEl.parentElement.children[1];
            wrapControl.removeAttribute('style');
            if (wrapControl.classList.contains('anim')) {
                wrapControl.classList.remove('anim');
            }
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
                    for (var i = 0; i < baseNode.length; i++) {
                        fragment.appendChild(baseNode[i].cloneNode(true));
                    }
                    this._range.insertNode(fragment);
                    this._range.selectNodeContents(fragment);
                } else if (node.childNodes.length > 1) {
                    var fragment = document.createDocumentFragment();
                    while(node.childNodes.length > 0) {
                        fragment.appendChild(node.childNodes[0]);
                    }
                    this._range.insertNode(fragment);
                    this._range.selectNodeContents(nodePrev);
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