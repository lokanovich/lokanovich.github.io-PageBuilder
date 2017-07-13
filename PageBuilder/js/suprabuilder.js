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
    currentVersion: 265
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
            }, true);
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

                if (btnInGroup !== 'fontFamily')
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
                            _this._style.html.innerHTML = style.replace(arg.ptrnHeight, '$1 ' + arg.fontHeight.value + ';');
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
                    if (weight === 'lighter' || weight === 'inherit' || (weight*1 < 400 && weight*1 > 200)) {
                        light = ' light';
                    } else if (weight*1 < 201 && weight*1 > 100) {
                        light = ' extra-light';
                    } else if (weight !== 'bold' && weight*1 < 101) {
                        light = ' thin';
                    }
                    arg.button.children[0].innerHTML = styleEl[2] + light;
                    arg.button.style.fontFamily = styleEl[2];
                    arg.button.style.fontWeight = weight;
                    arg.button.dataset.value = styleEl[2];
                    arg.button.dataset.weight = (weight !== 'bold') ? weight : '400';
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

            _this.stylingWrapParent(li);

        });
    }
    /**
     * for styling parent elements without buttons control
     * @param li
     * @private
     */
    , stylingWrapParent: function(li) {
        var _this = this;
        var elements = li.querySelectorAll('.buttons-control, .buttons-control-form');
        Array.prototype.forEach.call(elements, function(el){
            var parent = controls.findParent(el.parentElement.parentElement, ['buttons-control', 'buttons-control-form']);
            if (parent) {
                el.classList.add('child-event');

                el.addEventListener('mouseenter', _this._eventMoseEnterOnChildActive.bind(parent));

                el.addEventListener('mouseleave', _this._evetnMoseLeaveOnChildActive.bind(parent));
            }
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
            if (el.parentElement.className.search(/buttons-control.*/i) === -1
                && !el.classList.contains('g-map')
            ) {
                _this.setPosition(el, wrap, elementStylePosition, 1);
                el.style.position = 'static';
            } else if ( el.parentElement.className.search(/buttons-control.*/i) === -1
                && el.classList.contains('g-map')
                && /half-container-[^\s]/i.test(el.className)) {
                _this.setPosition(el, wrap, elementStylePosition, 1);
                el.style.position = 'relative';
                el.style.left = '0';
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

        var smooth = container.querySelectorAll('a.smooth');
        Array.prototype.forEach.call(smooth, function (a) {
            $(a ).smoothScroll({speed: 800});
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
                key: 'video-key',
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
                    + '\n//delete'
                    + '\n,'
                    + 'disableOn: function() {'
                    + 'if(builder.editingText) {'
                    + 'return false;'
                    + '}'
                    + 'return true;'
                    + '}'
                    + '\n//deleteend'
                    + '\n});'
                    + '\n//magnificend';
            }
        }
    }
    , applyMagnificPopupImage: function(DOMEelement) {
        var _this = this;
        if (DOMEelement.tagName !== 'A') DOMEelement = DOMEelement.parentElement;
        if (DOMEelement.tagName === 'A'
            && DOMEelement.href.search(/\.(png|jpg|jpeg|gif|svg)/i) !== -1) {
            if (!DOMEelement.classList.contains('single-image-popup')) DOMEelement.classList.add('single-image-popup');
            if (DOMEelement.classList.contains('smooth')) DOMEelement.classList.remove('smooth');
            $(DOMEelement).magnificPopup({
                type: 'image',
                key: 'some-key',
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
                    + '\n$(\'.single-image-popup\').magnificPopup({'
                    + '\n\ttype: \'image\''
                    + '\n//delete'
                    + '\n,'
                    + 'disableOn: function() {'
                    + 'if(builder.editingText) {'
                    + 'return false;'
                    + '}'
                    + 'return true;'
                    + '}'
                    + '\n//deleteend'
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
