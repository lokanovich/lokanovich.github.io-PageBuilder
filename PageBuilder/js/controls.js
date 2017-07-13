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
     * @param arrElIdentif {Array} exemple ['buttons-control', 'buttons-control-form', 'ul']
     * @returns {*} HTMLElement or NULL
     */
    , findParent: function(el, arrElIdentif) {
        var DOM = el;
        for (var indx in arrElIdentif) {
            while (DOM !== null && !DOM.classList.contains(arrElIdentif[indx])) {
                DOM = DOM.parentElement;
            }
            
            if (DOM === null) {
                DOM = el;
                while (DOM !== null && DOM.tagName.toLowerCase() !== arrElIdentif[indx]) {
                    DOM = DOM.parentElement;
                }
                if (DOM === null && arrElIdentif.length > (indx+1)) {
                    DOM = el;
                } else {
                    break;
                }
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
                var item = owlItem.children[0].cloneNode(true);
                var newOwlItem = item;
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

            builder.stylingWrapParent(clone);

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