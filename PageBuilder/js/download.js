function download(_this) {
    if (!_this._triggerDownload) {
        _this._triggerDownload = true;
        var data = {};
        data.pages = [];

        var footer = document.createElement('footer');
        var styleMain = _this.main.children[0].innerHTML;

        _this._pages.forEach(function (pObj, indx) {
            var pageName = replaceSpace(pObj.getPageName());
            var sectionNames = {};
            var js = "\"use strict\";\n";
            var style = '';
            var contentJs = '';
            if (pObj.preloader && pObj.preloader.html) {
                js += "\n $(window).load(function () {\n"
                    + "\t//------------------------------------------------------------------------\n"
                    + "\t//						PRELOADER SCRIPT\n"
                    + "\t//------------------------------------------------------------------------\n"
                    + "\t$(\"#preloader\").delay(400).fadeOut(\"slow\"); // will fade out the white DIV that covers the website.\n"
                    + "\t$(\"#preloader .clock\").fadeOut(); // will first fade out the loading animation\n"
                    + "});\n";
            }

            for (var group in pObj.sections) {
                sectionNames[group] = [];
                for (var name in pObj.sections[group]) {
                    sectionNames[group].push(name.split('--')[0]);
                }
            }
            var body = document.createElement('body');
            var modalContainer = document.createElement('div');
            modalContainer.className = 'modal-container';
            var container = document.createElement('div');
            // if a left bar of navigation is exist than container id need to be named "wrap"
            container.id = 'wrap';

            var page = pObj.getDOMSelf().cloneNode(true);
            if (_this._idActivePage * 1 !== indx) {
                page.innerHTML = pObj.html;
            }

            _this._findElForOptions(page);
            _this.clearGalleryOnPage(page);
            _this._clearOptionClasses(page);
            _this.clearControlElements(page);
            _this._reloadVideoBg(page, 'clear');

            if (_this._formSection) {
                var forms = page.querySelectorAll('form');
                Array.prototype.forEach.call(forms, function (form) {
                    var li = controls.findParent(form, ['section-item']);
                    var section = li.children[0];
                    if (form && (_this.forms[section.id].mode === 'popups'
                        || (form.classList.contains('subscribe_form')))) {
                        builder.editingSectionForm = li;
                        modalContainer.appendChild(controls.getPopupForm(section, 'success').cloneNode(true));
                        modalContainer.appendChild(controls.getPopupForm(section, 'error').cloneNode(true));
                        modalContainer.innerHTML = modalContainer.innerHTML.replace(/<(?!\/)/g, '\n\t\t\t<') + '\n\t\t';
                        if (form.classList.contains('subscribe_form')) {
                            var script = li.querySelector('script');
                            var patternSuccess = new RegExp('success:\\s*function\\s*\\(.*\\)\\s*{[^}]*}', 'im');
                            var patternError = new RegExp('error:\\s*function\\s*\\(.*\\)\\s*{[^}]*}', 'im');
                            var patternForm = new RegExp('\\.subscribe_form', 'img');
                            var successCode = 'success: function (data) {\n'
                                + '\t\t$(\'.subscribe_form\').find(\'.subscribe_submit\').button(\'reset\');\n'
                                + '\t\t//Use modal popups to display messages\n'
                                + '\t\t$(\'#' + section.id + '-success .mailchimp-data-message\').html(data);\n'
                                + '\t\t$(document).find(\'#' + section.id + '-success\').modal(\'show\');\n'
                                + '\t}';
                            var errorCode = 'error: function () {\n'
                                + '\t\t$(\'.subscribe_form\').find(\'.subscribe_submit\').button(\'reset\');\n'
                                + '\t\t//Use modal popups to display messages\n'
                                + '\t\t$(document).find(\'#' + section.id + '-error\').modal(\'show\');\n'
                                + '\t}';
                            script.innerHTML = script.innerHTML.replace(patternSuccess, successCode);
                            script.innerHTML = script.innerHTML.replace(patternError, errorCode);
                            script.innerHTML = script.innerHTML.replace(patternForm, '#' + section.id + '-form');
                        }
                    }
                });

            }

            var sections = page.querySelectorAll('ul.' + pageName + ' > li');

            if (sections) {
                Array.prototype.forEach.call(sections, function (li) {
                    if (li.querySelector('.spr-gallery')) {
                        li = _this.cloneOwlGallery(li);
                    }
                    var cloneSection = li.children[0];
                    if (pObj.sections &&
                        pObj.sections[li.dataset.group] &&
                        pObj.sections[li.dataset.group][cloneSection.id] &&
                        pObj.sections[li.dataset.group][cloneSection.id].modal !== undefined) {
                        pObj.sections[li.dataset.group][cloneSection.id].modal.forEach(function (modalId) {
                            var modal = _this.modalContainer.querySelector('#' + modalId);
                            modalContainer.appendChild(modal.cloneNode(true));
                        });
                    }
                    if (li.dataset.group === "navigations") {
                        var nav = li.querySelector('.show-menu');
                        if (nav) nav.classList.remove('show-menu');
                        while (li.children[0].tagName !== "STYLE") {
                            body.appendChild(li.children[0]);
                        }
                    } else {
                        container.appendChild(cloneSection);
                        //container.innerHTML = '\n' + cloneSection.outerHTML.replace(/<(?!\/)/g, '\t\t<') + '\n';
                    }


                    var maps = cloneSection.querySelectorAll('.g-map');
                    Array.prototype.forEach.call(maps, function (map) {
                        map.innerHTML = '';
                        map.removeAttribute('style');
                    });
                    style += li.querySelector('style').innerHTML;
                    contentJs += li.querySelector('script').innerHTML.replace(/\/\/delete[\n\s\w\/;:'"#(){}\[\]\|$@!?\\=+<>,.-]*?\/\/deleteend|\/\/magnific(?!end)|\/\/magnificend/img, '') || '';
                });
            }

            if (contentJs !== '') {
                js += "\ndocument.addEventListener('DOMContentLoaded', function() {\n"
                    + contentJs
                    + "\n});\n";
            }

            container.innerHTML = '\n' + container.innerHTML.replace(/((?:\n|^)\s*)</g, '$1\t\t\t<') + '\n\t\t';
            body.innerHTML += '\t\t' + container.outerHTML + '\n';
            body.innerHTML += '\t\t' + footer.outerHTML + '\n';
            body.innerHTML += '\t\t' + modalContainer.outerHTML;

            if (_this._parallax) {
                _this._clearParallaxSuperstructure(body);
            }

            data.pages.push({
                page_name: pageName
                , sections: sectionNames
                , content: body.innerHTML
                , style_options: page.className.match(/dark-page|light-page/i)[0]
                , title: pObj.getPageTitle()
                , meta_description: pObj.getMetaDes()
                , meta_keywords: pObj.getMetaKey()
                , preloader: (pObj.preloader && pObj.preloader.html) ? pObj.preloader.html : ''
                , js: js + htmldecode(pObj.getJs())
                , style: style
            });
        });

        var jsOverAll = '';

        if (_this._smooth) {
            jsOverAll += "window.addEventListener('load', function() {"
                + "\n\t$('a.smooth').smoothScroll({speed: 800});"
                + "\n});";
        }

        if (_this._parallax) {
            jsOverAll += "\nwindow.addEventListener('load', function() {"
                + "\nif (!navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|IEMobile/i)) {"
                + "\n\tvar skr = skrollr.init("
                + "\n\t\t{"
                + "\n\t\tsmoothScrolling: false"
                + "\n\t\t, forceHeight: false"
                + "\n\t\t, mobileDeceleration: 0.004"
                + "\n\t\t}"
                + "\n\t\t);"
                + "\n\t}"
                + "\n});";
        }

        if (_this._aos) {
            jsOverAll += "\nAOS.init({"
                + "\n\teasing: 'ease-in-out-sine'"
                + "\n});";
        }

        data.style = styleMain;
        data.video_bg = _this._videoBg;
        data.gallery = _this._owlGallery;
        data.form_section = _this._formSection;
        data.smooth = _this._smooth;
        data.parallax = _this._parallax;
        data.magnific = _this._magnific;
        data.aos = _this._aos;
        data.js_over_all = jsOverAll + '\n' + _this._magnificScript;
        data.forms = _this.forms;
        data.fonts_project = _this.arrayFontsOnProject;
        data.baseFilesForProject = options.baseFilesForProject;

        var form = new FormData();
        form.append('data', JSON.stringify(data));
        _this.ajax(form, 'download', function (data) {
            var data = JSON.parse(data);
            window.downloadFile(baseUri + 'tmp/' + data.file, data.file);
            setTimeout(function () {
                _this._triggerDownload = false;
            }, 2000);
            _this._resetIndExist();
        });
    }
}