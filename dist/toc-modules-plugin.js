var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "typedoc/dist/lib/utils", "typedoc/dist/lib/output/components", "typedoc/dist/lib/output/events", "typedoc/dist/lib/models", "typedoc/dist/lib/output/models/NavigationItem"], factory);
    }
})(function (require, exports) {
    "use strict";
    var TocModulesPlugin_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TocModulesPlugin = void 0;
    const utils_1 = require("typedoc/dist/lib/utils");
    const components_1 = require("typedoc/dist/lib/output/components");
    const events_1 = require("typedoc/dist/lib/output/events");
    const models_1 = require("typedoc/dist/lib/models");
    const NavigationItem_1 = require("typedoc/dist/lib/output/models/NavigationItem");
    /**
     * A plugin that lists modules as top-level entries in the table of contents for the current page.
     *
     * This plugin overwrites the [[PageEvent.toc]] property.
     */
    let TocModulesPlugin = TocModulesPlugin_1 = class TocModulesPlugin extends components_1.RendererComponent {
        /**
         * Create a new TocModulesPlugin instance.
         */
        initialize() {
            this.listenTo(this.owner, {
                [events_1.PageEvent.BEGIN]: this.onRendererBeginPage
            });
        }
        /**
         * Triggered before a document will be rendered.
         *
         * @param page  An event object describing the current render operation.
         */
        onRendererBeginPage(page) {
            let model = page.model;
            const trail = [];
            while (model !== page.project) {
                const isModule = model.kindOf(models_1.ReflectionKind.SomeModule);
                trail.unshift(model);
                model = model.parent;
                if (isModule) {
                    break;
                }
            }
            page.toc = new NavigationItem_1.NavigationItem();
            TocModulesPlugin_1.buildToc(model, trail, page.toc);
        }
        /**
         * Create a toc navigation item structure.
         *
         * @param model   The models whose children should be written to the toc.
         * @param trail   Defines the active trail of expanded toc entries.
         * @param parent  The parent [[NavigationItem]] the toc should be appended to.
         */
        static buildToc(model, trail, parent) {
            const index = trail.indexOf(model);
            const children = model["children"] || [];
            if (index < trail.length - 1 && children.length > 40) {
                const child = trail[index + 1];
                const item = NavigationItem_1.NavigationItem.create(child, parent, true);
                item.isInPath = true;
                item.isCurrent = false;
                TocModulesPlugin_1.buildToc(child, trail, item);
            }
            else {
                children.forEach((child) => {
                    const item = NavigationItem_1.NavigationItem.create(child, parent, true);
                    if (trail.includes(child)) {
                        item.isInPath = true;
                        item.isCurrent = trail[trail.length - 1] === child;
                        TocModulesPlugin_1.buildToc(child, trail, item);
                    }
                });
            }
        }
    };
    TocModulesPlugin = TocModulesPlugin_1 = __decorate([
        utils_1.Component({ name: "toc-modules" })
    ], TocModulesPlugin);
    exports.TocModulesPlugin = TocModulesPlugin;
});
