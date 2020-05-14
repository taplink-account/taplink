/*! Buefy v0.8.6 | MIT License | github.com/buefy/buefy */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
  (global = global || self, factory(global.Buefy = {}, global.Vue));
}(this, function (exports, Vue) { 'use strict';

  Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      keys.push.apply(keys, Object.getOwnPropertySymbols(object));
    }

    if (enumerableOnly) keys = keys.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  /**
   * Get value of an object property/path even if it's nested
   */
  function getValueByPath(obj, path) {
    var value = path.split('.').reduce(function (o, i) {
      return o ? o[i] : null;
    }, obj);
    return value;
  }
  /**
   * Extension of indexOf method by equality function if specified
   */

  function indexOf(array, obj, fn) {
    if (!array) return -1;
    if (!fn || typeof fn !== 'function') return array.indexOf(obj);

    for (var i = 0; i < array.length; i++) {
      if (fn(array[i], obj)) {
        return i;
      }
    }

    return -1;
  }
  /**
  * Merge function to replace Object.assign with deep merging possibility
  */

  var isObject = function isObject(item) {
    return _typeof(item) === 'object' && !Array.isArray(item);
  };

  var mergeFn = function mergeFn(target, source) {
    var isDeep = function isDeep(prop) {
      return isObject(source[prop]) && target.hasOwnProperty(prop) && isObject(target[prop]);
    };

    var replaced = Object.getOwnPropertyNames(source).map(function (prop) {
      return _defineProperty({}, prop, isDeep(prop) ? mergeFn(target[prop], source[prop]) : source[prop]);
    }).reduce(function (a, b) {
      return _objectSpread2({}, a, {}, b);
    }, {});
    return _objectSpread2({}, target, {}, replaced);
  };

  var merge = mergeFn;
  /**
   * Mobile detection
   * https://www.abeautifulsite.net/detecting-mobile-devices-with-javascript
   */

  var isMobile = {
    Android: function Android() {
      return typeof window !== 'undefined' && window.navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function BlackBerry() {
      return typeof window !== 'undefined' && window.navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function iOS() {
      return typeof window !== 'undefined' && window.navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function Opera() {
      return typeof window !== 'undefined' && window.navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function Windows() {
      return typeof window !== 'undefined' && window.navigator.userAgent.match(/IEMobile/i);
    },
    any: function any() {
      return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
    }
  };
  function removeElement(el) {
    if (typeof el.remove !== 'undefined') {
      el.remove();
    } else if (typeof el.parentNode !== 'undefined') {
      el.parentNode.removeChild(el);
    }
  }

  var config = {
    defaultContainerElement: null,
    defaultIconPack: 'mdi',
    defaultIconComponent: null,
    defaultIconPrev: 'chevron-left',
    defaultIconNext: 'chevron-right',
    defaultDialogConfirmText: null,
    defaultDialogCancelText: null,
    defaultSnackbarDuration: 3500,
    defaultSnackbarPosition: null,
    defaultToastDuration: 2000,
    defaultToastPosition: null,
    defaultNotificationDuration: 2000,
    defaultNotificationPosition: null,
    defaultTooltipType: 'is-primary',
    defaultTooltipAnimated: false,
    defaultTooltipDelay: 0,
    defaultInputAutocomplete: 'on',
    defaultDateFormatter: null,
    defaultDateParser: null,
    defaultDateCreator: null,
    defaultDayNames: null,
    defaultMonthNames: null,
    defaultFirstDayOfWeek: null,
    defaultUnselectableDaysOfWeek: null,
    defaultTimeFormatter: null,
    defaultTimeParser: null,
    defaultModalCanCancel: ['escape', 'x', 'outside', 'button'],
    defaultModalScroll: null,
    defaultDatepickerMobileNative: true,
    defaultTimepickerMobileNative: true,
    defaultNoticeQueue: true,
    defaultInputHasCounter: true,
    defaultTaginputHasCounter: true,
    defaultUseHtml5Validation: true,
    defaultDropdownMobileModal: true,
    defaultFieldLabelPosition: null,
    defaultDatepickerYearsRange: [-100, 3],
    defaultDatepickerNearbyMonthDays: true,
    defaultDatepickerNearbySelectableMonthDays: false,
    defaultDatepickerShowWeekNumber: false,
    defaultTrapFocus: false,
    defaultButtonRounded: false,
    customIconPacks: null // TODO defaultTrapFocus to true in the next breaking change

  };
  var config$1 = config;
  var setOptions = function setOptions(options) {
    config = options;
  };

  var FormElementMixin = {
    props: {
      size: String,
      expanded: Boolean,
      loading: Boolean,
      rounded: Boolean,
      icon: String,
      iconPack: String,
      // Native options to use in HTML5 validation
      autocomplete: String,
      maxlength: [Number, String],
      useHtml5Validation: {
        type: Boolean,
        default: function _default() {
          return config$1.defaultUseHtml5Validation;
        }
      },
      validationMessage: String
    },
    data: function data() {
      return {
        isValid: true,
        isFocused: false,
        newIconPack: this.iconPack || config$1.defaultIconPack
      };
    },
    computed: {
      /**
       * Find parent Field, max 3 levels deep.
       */
      parentField: function parentField() {
        var parent = this.$parent;

        for (var i = 0; i < 3; i++) {
          if (parent && !parent.$data._isField) {
            parent = parent.$parent;
          }
        }

        return parent;
      },

      /**
       * Get the type prop from parent if it's a Field.
       */
      statusType: function statusType() {
        if (!this.parentField) return;
        if (!this.parentField.newType) return;

        if (typeof this.parentField.newType === 'string') {
          return this.parentField.newType;
        } else {
          for (var key in this.parentField.newType) {
            if (this.parentField.newType[key]) {
              return key;
            }
          }
        }
      },

      /**
       * Get the message prop from parent if it's a Field.
       */
      statusMessage: function statusMessage() {
        if (!this.parentField) return;
        return this.parentField.newMessage;
      },

      /**
       * Fix icon size for inputs, large was too big
       */
      iconSize: function iconSize() {
        switch (this.size) {
          case 'is-small':
            return this.size;

          case 'is-medium':
            return;

          case 'is-large':
            return this.newIconPack === 'mdi' ? 'is-medium' : '';
        }
      }
    },
    methods: {
      /**
       * Focus method that work dynamically depending on the component.
       */
      focus: function focus() {
        var _this = this;

        if (this.$data._elementRef === undefined) return;
        this.$nextTick(function () {
          var el = _this.$el.querySelector(_this.$data._elementRef);

          if (el) el.focus();
        });
      },
      onBlur: function onBlur($event) {
        this.isFocused = false;
        this.$emit('blur', $event);
        this.checkHtml5Validity();
      },
      onFocus: function onFocus($event) {
        this.isFocused = true;
        this.$emit('focus', $event);
      },
      getElement: function getElement() {
        return this.$el.querySelector(this.$data._elementRef);
      },
      setInvalid: function setInvalid() {
        var type = 'is-danger';
        var message = this.validationMessage || this.getElement().validationMessage;
        this.setValidity(type, message);
      },
      setValidity: function setValidity(type, message) {
        var _this2 = this;

        this.$nextTick(function () {
          if (_this2.parentField) {
            // Set type only if not defined
            if (!_this2.parentField.type) {
              _this2.parentField.newType = type;
            } // Set message only if not defined


            if (!_this2.parentField.message) {
              _this2.parentField.newMessage = message;
            }
          }
        });
      },

      /**
       * Check HTML5 validation, set isValid property.
       * If validation fail, send 'is-danger' type,
       * and error message to parent if it's a Field.
       */
      checkHtml5Validity: function checkHtml5Validity() {
        if (!this.useHtml5Validation) return;
        if (this.$refs[this.$data._elementRef] === undefined) return;

        if (!this.getElement().checkValidity()) {
          this.setInvalid();
          this.isValid = false;
        } else {
          this.setValidity(null, null);
          this.isValid = true;
        }

        return this.isValid;
      }
    }
  };

  var mdiIcons = {
    sizes: {
      'default': 'mdi-24px',
      'is-small': null,
      'is-medium': 'mdi-36px',
      'is-large': 'mdi-48px'
    },
    iconPrefix: 'mdi-'
  };

  var faIcons = function faIcons() {
    var faIconPrefix = config$1 && config$1.defaultIconComponent ? '' : 'fa-';
    return {
      sizes: {
        'default': faIconPrefix + 'lg',
        'is-small': null,
        'is-medium': faIconPrefix + '2x',
        'is-large': faIconPrefix + '3x'
      },
      iconPrefix: faIconPrefix,
      internalIcons: {
        'information': 'info-circle',
        'alert': 'exclamation-triangle',
        'alert-circle': 'exclamation-circle',
        'chevron-right': 'angle-right',
        'chevron-left': 'angle-left',
        'chevron-down': 'angle-down',
        'eye-off': 'eye-slash',
        'menu-down': 'caret-down',
        'menu-up': 'caret-up'
      }
    };
  };

  var getIcons = function getIcons() {
    var icons = {
      mdi: mdiIcons,
      fa: faIcons(),
      fas: faIcons(),
      far: faIcons(),
      fad: faIcons(),
      fab: faIcons(),
      fal: faIcons()
    };

    if (config$1 && config$1.customIconPacks) {
      icons = merge(icons, config$1.customIconPacks);
    }

    return icons;
  };

  //
  var script = {
    name: 'BIcon',
    props: {
      type: [String, Object],
      component: String,
      pack: String,
      icon: String,
      size: String,
      customSize: String,
      customClass: String,
      both: Boolean // This is used internally to show both MDI and FA icon

    },
    computed: {
      iconConfig: function iconConfig() {
        var allIcons = getIcons();
        return allIcons[this.newPack];
      },
      iconPrefix: function iconPrefix() {
        if (this.iconConfig && this.iconConfig.iconPrefix) {
          return this.iconConfig.iconPrefix;
        }

        return '';
      },

      /**
      * Internal icon name based on the pack.
      * If pack is 'fa', gets the equivalent FA icon name of the MDI,
      * internal icons are always MDI.
      */
      newIcon: function newIcon() {
        return "".concat(this.iconPrefix).concat(this.getEquivalentIconOf(this.icon));
      },
      newPack: function newPack() {
        return this.pack || config$1.defaultIconPack;
      },
      newType: function newType() {
        if (!this.type) return;
        var splitType = [];

        if (typeof this.type === 'string') {
          splitType = this.type.split('-');
        } else {
          for (var key in this.type) {
            if (this.type[key]) {
              splitType = key.split('-');
              break;
            }
          }
        }

        if (splitType.length <= 1) return;
        return "has-text-".concat(splitType[1]);
      },
      newCustomSize: function newCustomSize() {
        return this.customSize || this.customSizeByPack;
      },
      customSizeByPack: function customSizeByPack() {
        if (this.iconConfig && this.iconConfig.sizes) {
          if (this.size && this.iconConfig.sizes[this.size] !== undefined) {
            return this.iconConfig.sizes[this.size];
          } else if (this.iconConfig.sizes.default) {
            return this.iconConfig.sizes.default;
          }
        }

        return null;
      },
      useIconComponent: function useIconComponent() {
        return this.component || config$1.defaultIconComponent;
      }
    },
    methods: {
      /**
      * Equivalent icon name of the MDI.
      */
      getEquivalentIconOf: function getEquivalentIconOf(value) {
        // Only transform the class if the both prop is set to true
        if (!this.both) {
          return value;
        }

        if (this.iconConfig && this.iconConfig.internalIcons && this.iconConfig.internalIcons[value]) {
          return this.iconConfig.internalIcons[value];
        }

        return value;
      }
    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    var options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    var hook;

    if (moduleIdentifier) {
      // server build
      hook = function hook(context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function () {
        style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        var originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }

    return script;
  }

  var normalizeComponent_1 = normalizeComponent;

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{staticClass:"icon",class:[_vm.newType, _vm.size]},[(!_vm.useIconComponent)?_c('i',{class:[_vm.newPack, _vm.newIcon, _vm.newCustomSize, _vm.customClass]}):_c(_vm.useIconComponent,{tag:"component",class:[_vm.customClass],attrs:{"icon":[_vm.newPack, _vm.newIcon],"size":_vm.newCustomSize}})],1)};
  var __vue_staticRenderFns__ = [];

    /* style */
    const __vue_inject_styles__ = undefined;
    /* scoped */
    const __vue_scope_id__ = undefined;
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Icon = normalizeComponent_1(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      undefined,
      undefined
    );

  var script$1 = {
    name: 'BInput',
    components: _defineProperty({}, Icon.name, Icon),
    mixins: [FormElementMixin],
    inheritAttrs: false,
    props: {
      value: [Number, String],
      type: {
        type: String,
        default: 'text'
      },
      passwordReveal: Boolean,
      hasCounter: {
        type: Boolean,
        default: function _default() {
          return config$1.defaultInputHasCounter;
        }
      },
      customClass: {
        type: String,
        default: ''
      }
    },
    data: function data() {
      return {
        newValue: this.value,
        newType: this.type,
        newAutocomplete: this.autocomplete || config$1.defaultInputAutocomplete,
        isPasswordVisible: false,
        _elementRef: this.type === 'textarea' ? 'textarea' : 'input'
      };
    },
    computed: {
      computedValue: {
        get: function get() {
          return this.newValue;
        },
        set: function set(value) {
          this.newValue = value;
          this.$emit('input', value);
          !this.isValid && this.checkHtml5Validity();
        }
      },
      rootClasses: function rootClasses() {
        return [this.iconPosition, this.size, {
          'is-expanded': this.expanded,
          'is-loading': this.loading,
          'is-clearfix': !this.hasMessage
        }];
      },
      inputClasses: function inputClasses() {
        return [this.statusType, this.size, {
          'is-rounded': this.rounded
        }];
      },
      hasIconRight: function hasIconRight() {
        return this.passwordReveal || this.loading || this.statusTypeIcon;
      },

      /**
      * Position of the icon or if it's both sides.
      */
      iconPosition: function iconPosition() {
        if (this.icon && this.hasIconRight) {
          return 'has-icons-left has-icons-right';
        } else if (!this.icon && this.hasIconRight) {
          return 'has-icons-right';
        } else if (this.icon) {
          return 'has-icons-left';
        }
      },

      /**
      * Icon name (MDI) based on the type.
      */
      statusTypeIcon: function statusTypeIcon() {
        switch (this.statusType) {
          case 'is-success':
            return 'check';

          case 'is-danger':
            return 'alert-circle';

          case 'is-info':
            return 'information';

          case 'is-warning':
            return 'alert';
        }
      },

      /**
      * Check if have any message prop from parent if it's a Field.
      */
      hasMessage: function hasMessage() {
        return !!this.statusMessage;
      },

      /**
      * Current password-reveal icon name.
      */
      passwordVisibleIcon: function passwordVisibleIcon() {
        return !this.isPasswordVisible ? 'eye' : 'eye-off';
      },

      /**
      * Get value length
      */
      valueLength: function valueLength() {
        if (typeof this.computedValue === 'string') {
          return this.computedValue.length;
        } else if (typeof this.computedValue === 'number') {
          return this.computedValue.toString().length;
        }

        return 0;
      }
    },
    watch: {
      /**
      * When v-model is changed:
      *   1. Set internal value.
      */
      value: function value(_value) {
        this.newValue = _value;
      }
    },
    methods: {
      /**
      * Toggle the visibility of a password-reveal input
      * by changing the type and focus the input right away.
      */
      togglePasswordVisibility: function togglePasswordVisibility() {
        var _this = this;

        this.isPasswordVisible = !this.isPasswordVisible;
        this.newType = this.isPasswordVisible ? 'text' : 'password';
        this.$nextTick(function () {
          _this.$refs.input.focus();
        });
      },

      /**
      * Input's 'input' event listener, 'nextTick' is used to prevent event firing
      * before ui update, helps when using masks (Cleavejs and potentially others).
      */
      onInput: function onInput(event) {
        var _this2 = this;

        this.$nextTick(function () {
          if (event.target) {
            _this2.computedValue = event.target.value;
          }
        });
      }
    }
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"control",class:_vm.rootClasses},[(_vm.type !== 'textarea')?_c('input',_vm._b({ref:"input",staticClass:"input",class:[_vm.inputClasses, _vm.customClass],attrs:{"type":_vm.newType,"autocomplete":_vm.newAutocomplete,"maxlength":_vm.maxlength},domProps:{"value":_vm.computedValue},on:{"input":_vm.onInput,"blur":_vm.onBlur,"focus":_vm.onFocus}},'input',_vm.$attrs,false)):_c('textarea',_vm._b({ref:"textarea",staticClass:"textarea",class:[_vm.inputClasses, _vm.customClass],attrs:{"maxlength":_vm.maxlength},domProps:{"value":_vm.computedValue},on:{"input":_vm.onInput,"blur":_vm.onBlur,"focus":_vm.onFocus}},'textarea',_vm.$attrs,false)),_vm._v(" "),(_vm.icon)?_c('b-icon',{staticClass:"is-left",attrs:{"icon":_vm.icon,"pack":_vm.iconPack,"size":_vm.iconSize}}):_vm._e(),_vm._v(" "),(!_vm.loading && (_vm.passwordReveal || _vm.statusTypeIcon))?_c('b-icon',{staticClass:"is-right",class:{ 'is-clickable': _vm.passwordReveal },attrs:{"icon":_vm.passwordReveal ? _vm.passwordVisibleIcon : _vm.statusTypeIcon,"pack":_vm.iconPack,"size":_vm.iconSize,"type":!_vm.passwordReveal ? _vm.statusType : 'is-primary',"both":""},nativeOn:{"click":function($event){_vm.togglePasswordVisibility($event);}}}):_vm._e(),_vm._v(" "),(_vm.maxlength && _vm.hasCounter && _vm.type !== 'number')?_c('small',{staticClass:"help counter",class:{ 'is-invisible': !_vm.isFocused }},[_vm._v("\n        "+_vm._s(_vm.valueLength)+" / "+_vm._s(_vm.maxlength)+"\n    ")]):_vm._e()],1)};
  var __vue_staticRenderFns__$1 = [];

    /* style */
    const __vue_inject_styles__$1 = undefined;
    /* scoped */
    const __vue_scope_id__$1 = undefined;
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Input = normalizeComponent_1(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      undefined,
      undefined
    );

  var script$2 = {
    name: 'BAutocomplete',
    components: _defineProperty({}, Input.name, Input),
    mixins: [FormElementMixin],
    inheritAttrs: false,
    props: {
      value: [Number, String],
      data: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      field: {
        type: String,
        default: 'value'
      },
      keepFirst: Boolean,
      clearOnSelect: Boolean,
      openOnFocus: Boolean,
      customFormatter: Function
    },
    data: function data() {
      return {
        selected: null,
        hovered: null,
        isActive: false,
        newValue: this.value,
        newAutocomplete: this.autocomplete || 'off',
        isListInViewportVertically: true,
        hasFocus: false,
        _isAutocomplete: true,
        _elementRef: 'input'
      };
    },
    computed: {
      /**
       * White-listed items to not close when clicked.
       * Add input, dropdown and all children.
       */
      whiteList: function whiteList() {
        var whiteList = [];
        whiteList.push(this.$refs.input.$el.querySelector('input'));
        whiteList.push(this.$refs.dropdown); // Add all chidren from dropdown

        if (this.$refs.dropdown !== undefined) {
          var children = this.$refs.dropdown.querySelectorAll('*');
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var child = _step.value;
              whiteList.push(child);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        if (this.$parent.$data._isTaginput) {
          // Add taginput container
          whiteList.push(this.$parent.$el); // Add .tag and .delete

          var tagInputChildren = this.$parent.$el.querySelectorAll('*');
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = tagInputChildren[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var tagInputChild = _step2.value;
              whiteList.push(tagInputChild);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }

        return whiteList;
      },

      /**
       * Check if exists default slot
       */
      hasDefaultSlot: function hasDefaultSlot() {
        return !!this.$scopedSlots.default;
      },

      /**
       * Check if exists "empty" slot
       */
      hasEmptySlot: function hasEmptySlot() {
        return !!this.$slots.empty;
      },

      /**
       * Check if exists "header" slot
       */
      hasHeaderSlot: function hasHeaderSlot() {
        return !!this.$slots.header;
      },

      /**
       * Check if exists "footer" slot
       */
      hasFooterSlot: function hasFooterSlot() {
        return !!this.$slots.footer;
      }
    },
    watch: {
      /**
       * When dropdown is toggled, check the visibility to know when
       * to open upwards.
       */
      isActive: function isActive(active) {
        var _this = this;

        if (active) {
          this.calcDropdownInViewportVertical();
        } else {
          this.$nextTick(function () {
            return _this.setHovered(null);
          }); // Timeout to wait for the animation to finish before recalculating

          setTimeout(function () {
            _this.calcDropdownInViewportVertical();
          }, 100);
        }
      },

      /**
       * When updating input's value
       *   1. Emit changes
       *   2. If value isn't the same as selected, set null
       *   3. Close dropdown if value is clear or else open it
       */
      newValue: function newValue(value) {
        this.$emit('input', value); // Check if selected is invalid

        var currentValue = this.getValue(this.selected);

        if (currentValue && currentValue !== value) {
          this.setSelected(null, false);
        } // Close dropdown if input is clear or else open it


        if (this.hasFocus && (!this.openOnFocus || value)) {
          this.isActive = !!value;
        }
      },

      /**
       * When v-model is changed:
       *   1. Update internal value.
       *   2. If it's invalid, validate again.
       */
      value: function value(_value) {
        this.newValue = _value;
        !this.isValid && this.$refs.input.checkHtml5Validity();
      },

      /**
       * Select first option if "keep-first
       */
      data: function data(value) {
        // Keep first option always pre-selected
        if (this.keepFirst) {
          this.selectFirstOption(value);
        }
      }
    },
    methods: {
      /**
       * Set which option is currently hovered.
       */
      setHovered: function setHovered(option) {
        if (option === undefined) return;
        this.hovered = option;
      },

      /**
       * Set which option is currently selected, update v-model,
       * update input value and close dropdown.
       */
      setSelected: function setSelected(option) {
        var _this2 = this;

        var closeDropdown = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        if (option === undefined) return;
        this.selected = option;
        this.$emit('select', this.selected);

        if (this.selected !== null) {
          this.newValue = this.clearOnSelect ? '' : this.getValue(this.selected);
        }

        closeDropdown && this.$nextTick(function () {
          _this2.isActive = false;
        });
      },

      /**
       * Select first option
       */
      selectFirstOption: function selectFirstOption(options) {
        var _this3 = this;

        this.$nextTick(function () {
          if (options.length) {
            // If has visible data or open on focus, keep updating the hovered
            if (_this3.openOnFocus || _this3.newValue !== '' && _this3.hovered !== options[0]) {
              _this3.setHovered(options[0]);
            }
          } else {
            _this3.setHovered(null);
          }
        });
      },

      /**
       * Enter key listener.
       * Select the hovered option.
       */
      enterPressed: function enterPressed() {
        if (this.hovered === null) return;
        this.setSelected(this.hovered);
      },

      /**
       * Tab key listener.
       * Select hovered option if it exists, close dropdown, then allow
       * native handling to move to next tabbable element.
       */
      tabPressed: function tabPressed() {
        if (this.hovered === null) {
          this.isActive = false;
          return;
        }

        this.setSelected(this.hovered);
      },

      /**
       * Close dropdown if clicked outside.
       */
      clickedOutside: function clickedOutside(event) {
        if (this.whiteList.indexOf(event.target) < 0) this.isActive = false;
      },

      /**
       * Return display text for the input.
       * If object, get value from path, or else just the value.
       */
      getValue: function getValue(option) {
        if (option === null) return;

        if (typeof this.customFormatter !== 'undefined') {
          return this.customFormatter(option);
        }

        return _typeof(option) === 'object' ? getValueByPath(option, this.field) : option;
      },

      /**
       * Calculate if the dropdown is vertically visible when activated,
       * otherwise it is openened upwards.
       */
      calcDropdownInViewportVertical: function calcDropdownInViewportVertical() {
        var _this4 = this;

        this.$nextTick(function () {
          /**
          * this.$refs.dropdown may be undefined
          * when Autocomplete is conditional rendered
          */
          if (_this4.$refs.dropdown === undefined) return;

          var rect = _this4.$refs.dropdown.getBoundingClientRect();

          _this4.isListInViewportVertically = rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
        });
      },

      /**
       * Arrows keys listener.
       * If dropdown is active, set hovered option, or else just open.
       */
      keyArrows: function keyArrows(direction) {
        var sum = direction === 'down' ? 1 : -1;

        if (this.isActive) {
          var index = this.data.indexOf(this.hovered) + sum;
          index = index > this.data.length - 1 ? this.data.length : index;
          index = index < 0 ? 0 : index;
          this.setHovered(this.data[index]);
          var list = this.$refs.dropdown.querySelector('.dropdown-content');
          var element = list.querySelectorAll('a.dropdown-item:not(.is-disabled)')[index];
          if (!element) return;
          var visMin = list.scrollTop;
          var visMax = list.scrollTop + list.clientHeight - element.clientHeight;

          if (element.offsetTop < visMin) {
            list.scrollTop = element.offsetTop;
          } else if (element.offsetTop >= visMax) {
            list.scrollTop = element.offsetTop - list.clientHeight + element.clientHeight;
          }
        } else {
          this.isActive = true;
        }
      },

      /**
       * Focus listener.
       * If value is the same as selected, select all text.
       */
      focused: function focused(event) {
        if (this.getValue(this.selected) === this.newValue) {
          this.$el.querySelector('input').select();
        }

        if (this.openOnFocus) {
          this.isActive = true;

          if (this.keepFirst) {
            this.selectFirstOption(this.data);
          }
        }

        this.hasFocus = true;
        this.$emit('focus', event);
      },

      /**
      * Blur listener.
      */
      onBlur: function onBlur(event) {
        this.hasFocus = false;
        this.$emit('blur', event);
      },
      onInput: function onInput(event) {
        var currentValue = this.getValue(this.selected);
        if (currentValue && currentValue === this.newValue) return;
        this.$emit('typing', this.newValue);
      }
    },
    created: function created() {
      if (typeof window !== 'undefined') {
        document.addEventListener('click', this.clickedOutside);
        window.addEventListener('resize', this.calcDropdownInViewportVertical);
      }
    },
    beforeDestroy: function beforeDestroy() {
      if (typeof window !== 'undefined') {
        document.removeEventListener('click', this.clickedOutside);
        window.removeEventListener('resize', this.calcDropdownInViewportVertical);
      }
    }
  };

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"autocomplete control",class:{'is-expanded': _vm.expanded}},[_c('b-input',_vm._b({ref:"input",attrs:{"type":"text","size":_vm.size,"loading":_vm.loading,"rounded":_vm.rounded,"icon":_vm.icon,"icon-pack":_vm.iconPack,"maxlength":_vm.maxlength,"autocomplete":_vm.newAutocomplete,"use-html5-validation":_vm.useHtml5Validation},on:{"input":_vm.onInput,"focus":_vm.focused,"blur":_vm.onBlur},nativeOn:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"esc",27,$event.key)){ return null; }$event.preventDefault();_vm.isActive = false;},"keydown":[function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"tab",9,$event.key)){ return null; }_vm.tabPressed($event);},function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }$event.preventDefault();_vm.enterPressed($event);},function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"up",38,$event.key)){ return null; }$event.preventDefault();_vm.keyArrows('up');},function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"down",40,$event.key)){ return null; }$event.preventDefault();_vm.keyArrows('down');}]},model:{value:(_vm.newValue),callback:function ($$v) {_vm.newValue=$$v;},expression:"newValue"}},'b-input',_vm.$attrs,false)),_vm._v(" "),_c('transition',{attrs:{"name":"fade"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.isActive && (_vm.data.length > 0 || _vm.hasEmptySlot || _vm.hasHeaderSlot)),expression:"isActive && (data.length > 0 || hasEmptySlot || hasHeaderSlot)"}],ref:"dropdown",staticClass:"dropdown-menu",class:{ 'is-opened-top': !_vm.isListInViewportVertically }},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.isActive),expression:"isActive"}],staticClass:"dropdown-content"},[(_vm.hasHeaderSlot)?_c('div',{staticClass:"dropdown-item"},[_vm._t("header")],2):_vm._e(),_vm._v(" "),_vm._l((_vm.data),function(option,index){return _c('a',{key:index,staticClass:"dropdown-item",class:{ 'is-hovered': option === _vm.hovered },on:{"click":function($event){_vm.setSelected(option);}}},[(_vm.hasDefaultSlot)?_vm._t("default",null,{option:option,index:index}):_c('span',[_vm._v("\n                        "+_vm._s(_vm.getValue(option, true))+"\n                    ")])],2)}),_vm._v(" "),(_vm.data.length === 0 && _vm.hasEmptySlot)?_c('div',{staticClass:"dropdown-item is-disabled"},[_vm._t("empty")],2):_vm._e(),_vm._v(" "),(_vm.hasFooterSlot)?_c('div',{staticClass:"dropdown-item"},[_vm._t("footer")],2):_vm._e()],2)])])],1)};
  var __vue_staticRenderFns__$2 = [];

    /* style */
    const __vue_inject_styles__$2 = undefined;
    /* scoped */
    const __vue_scope_id__$2 = undefined;
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Autocomplete = normalizeComponent_1(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      undefined,
      undefined
    );

  var use = function use(plugin) {
    if (typeof window !== 'undefined' && window.Vue) {
      window.Vue.use(plugin);
    }
  };
  var registerComponent = function registerComponent(Vue, component) {
    Vue.component(component.name, component);
  };
  var registerComponentProgrammatic = function registerComponentProgrammatic(Vue, property, component) {
    if (!Vue.prototype.$buefy) Vue.prototype.$buefy = {};
    Vue.prototype.$buefy[property] = component;
  };

  var Plugin = {
    install: function install(Vue) {
      registerComponent(Vue, Autocomplete);
    }
  };
  use(Plugin);

  var script$3 = {
    name: 'BButton',
    components: _defineProperty({}, Icon.name, Icon),
    inheritAttrs: false,
    props: {
      type: [String, Object],
      size: String,
      label: String,
      iconPack: String,
      iconLeft: String,
      iconRight: String,
      rounded: {
        type: Boolean,
        default: function _default() {
          return config$1.defaultButtonRounded;
        }
      },
      loading: Boolean,
      outlined: Boolean,
      expanded: Boolean,
      inverted: Boolean,
      focused: Boolean,
      active: Boolean,
      hovered: Boolean,
      selected: Boolean,
      nativeType: {
        type: String,
        default: 'button',
        validator: function validator(value) {
          return ['button', 'submit', 'reset'].indexOf(value) >= 0;
        }
      },
      tag: {
        type: String,
        default: 'button',
        validator: function validator(value) {
          return ['button', 'a', 'input', 'router-link', 'nuxt-link', 'n-link', 'NuxtLink', 'NLink'].indexOf(value) >= 0;
        }
      }
    },
    computed: {
      iconSize: function iconSize() {
        if (!this.size || this.size === 'is-medium') {
          return 'is-small';
        } else if (this.size === 'is-large') {
          return 'is-medium';
        }

        return this.size;
      }
    }
  };

  /* script */
  const __vue_script__$3 = script$3;

  /* template */
  var __vue_render__$3 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(_vm.tag,_vm._b({tag:"component",staticClass:"button",class:[_vm.size, _vm.type, {
          'is-rounded': _vm.rounded,
          'is-loading': _vm.loading,
          'is-outlined': _vm.outlined,
          'is-fullwidth': _vm.expanded,
          'is-inverted': _vm.inverted,
          'is-focused': _vm.focused,
          'is-active': _vm.active,
          'is-hovered': _vm.hovered,
          'is-selected': _vm.selected
      }],attrs:{"type":_vm.nativeType},on:{"click":function($event){_vm.$emit('click', $event);}}},'component',_vm.$attrs,false),[(_vm.iconLeft)?_c('b-icon',{attrs:{"pack":_vm.iconPack,"icon":_vm.iconLeft,"size":_vm.iconSize}}):_vm._e(),_vm._v(" "),(_vm.label)?_c('span',[_vm._v(_vm._s(_vm.label))]):(_vm.$slots.default)?_c('span',[_vm._t("default")],2):_vm._e(),_vm._v(" "),(_vm.iconRight)?_c('b-icon',{attrs:{"pack":_vm.iconPack,"icon":_vm.iconRight,"size":_vm.iconSize}}):_vm._e()],1)};
  var __vue_staticRenderFns__$3 = [];

    /* style */
    const __vue_inject_styles__$3 = undefined;
    /* scoped */
    const __vue_scope_id__$3 = undefined;
    /* module identifier */
    const __vue_module_identifier__$3 = undefined;
    /* functional template */
    const __vue_is_functional_template__$3 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Button = normalizeComponent_1(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      undefined,
      undefined
    );

  var Plugin$1 = {
    install: function install(Vue) {
      registerComponent(Vue, Button);
    }
  };
  use(Plugin$1);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$4 = {
    name: 'BCheckbox',
    props: {
      value: [String, Number, Boolean, Function, Object, Array],
      nativeValue: [String, Number, Boolean, Function, Object, Array],
      indeterminate: Boolean,
      type: String,
      disabled: Boolean,
      required: Boolean,
      name: String,
      size: String,
      trueValue: {
        type: [String, Number, Boolean, Function, Object, Array],
        default: true
      },
      falseValue: {
        type: [String, Number, Boolean, Function, Object, Array],
        default: false
      }
    },
    data: function data() {
      return {
        newValue: this.value
      };
    },
    computed: {
      computedValue: {
        get: function get() {
          return this.newValue;
        },
        set: function set(value) {
          this.newValue = value;
          this.$emit('input', value);
        }
      }
    },
    watch: {
      /**
       * When v-model change, set internal value.
       */
      value: function value(_value) {
        this.newValue = _value;
      }
    },
    methods: {
      focus: function focus() {
        // MacOS FireFox and Safari do not focus when clicked
        this.$refs.input.focus();
      }
    }
  };

  /* script */
  const __vue_script__$4 = script$4;

  /* template */
  var __vue_render__$4 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('label',{ref:"label",staticClass:"b-checkbox checkbox",class:[_vm.size, { 'is-disabled': _vm.disabled }],attrs:{"disabled":_vm.disabled},on:{"click":_vm.focus,"keydown":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }$event.preventDefault();_vm.$refs.label.click();}}},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.computedValue),expression:"computedValue"}],ref:"input",attrs:{"type":"checkbox","disabled":_vm.disabled,"required":_vm.required,"name":_vm.name,"true-value":_vm.trueValue,"false-value":_vm.falseValue},domProps:{"indeterminate":_vm.indeterminate,"value":_vm.nativeValue,"checked":Array.isArray(_vm.computedValue)?_vm._i(_vm.computedValue,_vm.nativeValue)>-1:_vm._q(_vm.computedValue,_vm.trueValue)},on:{"click":function($event){$event.stopPropagation();},"change":function($event){var $$a=_vm.computedValue,$$el=$event.target,$$c=$$el.checked?(_vm.trueValue):(_vm.falseValue);if(Array.isArray($$a)){var $$v=_vm.nativeValue,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.computedValue=$$a.concat([$$v]));}else{$$i>-1&&(_vm.computedValue=$$a.slice(0,$$i).concat($$a.slice($$i+1)));}}else{_vm.computedValue=$$c;}}}}),_vm._v(" "),_c('span',{staticClass:"check",class:_vm.type}),_vm._v(" "),_c('span',{staticClass:"control-label"},[_vm._t("default")],2)])};
  var __vue_staticRenderFns__$4 = [];

    /* style */
    const __vue_inject_styles__$4 = undefined;
    /* scoped */
    const __vue_scope_id__$4 = undefined;
    /* module identifier */
    const __vue_module_identifier__$4 = undefined;
    /* functional template */
    const __vue_is_functional_template__$4 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Checkbox = normalizeComponent_1(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$4,
      __vue_script__$4,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$5 = {
    name: 'BCheckboxButton',
    props: {
      value: [String, Number, Boolean, Function, Object, Array],
      nativeValue: [String, Number, Boolean, Function, Object, Array],
      disabled: Boolean,
      required: Boolean,
      expanded: Boolean,
      name: String,
      size: String,
      type: {
        type: String,
        default: 'is-primary'
      }
    },
    data: function data() {
      return {
        newValue: this.value,
        isFocused: false
      };
    },
    computed: {
      computedValue: {
        get: function get() {
          return this.newValue;
        },
        set: function set(value) {
          this.newValue = value;
          this.$emit('input', value);
        }
      },
      checked: function checked() {
        if (Array.isArray(this.newValue)) {
          return this.newValue.indexOf(this.nativeValue) >= 0;
        }

        return this.newValue === this.nativeValue;
      }
    },
    watch: {
      /**
       * When v-model change, set internal value.
       */
      value: function value(_value) {
        this.newValue = _value;
      }
    },
    methods: {
      focus: function focus() {
        // MacOS FireFox and Safari do not focus when clicked
        this.$refs.input.focus();
      }
    }
  };

  /* script */
  const __vue_script__$5 = script$5;

  /* template */
  var __vue_render__$5 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"control",class:{ 'is-expanded': _vm.expanded }},[_c('label',{ref:"label",staticClass:"b-checkbox checkbox button",class:[_vm.checked ? _vm.type : null, _vm.size, {
              'is-disabled': _vm.disabled,
              'is-focused': _vm.isFocused
          }],attrs:{"disabled":_vm.disabled},on:{"click":_vm.focus,"keydown":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }$event.preventDefault();_vm.$refs.label.click();}}},[_vm._t("default"),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.computedValue),expression:"computedValue"}],ref:"input",attrs:{"type":"checkbox","disabled":_vm.disabled,"required":_vm.required,"name":_vm.name},domProps:{"value":_vm.nativeValue,"checked":Array.isArray(_vm.computedValue)?_vm._i(_vm.computedValue,_vm.nativeValue)>-1:(_vm.computedValue)},on:{"click":function($event){$event.stopPropagation();},"focus":function($event){_vm.isFocused = true;},"blur":function($event){_vm.isFocused = false;},"change":function($event){var $$a=_vm.computedValue,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=_vm.nativeValue,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.computedValue=$$a.concat([$$v]));}else{$$i>-1&&(_vm.computedValue=$$a.slice(0,$$i).concat($$a.slice($$i+1)));}}else{_vm.computedValue=$$c;}}}})],2)])};
  var __vue_staticRenderFns__$5 = [];

    /* style */
    const __vue_inject_styles__$5 = undefined;
    /* scoped */
    const __vue_scope_id__$5 = undefined;
    /* module identifier */
    const __vue_module_identifier__$5 = undefined;
    /* functional template */
    const __vue_is_functional_template__$5 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var CheckboxButton = normalizeComponent_1(
      { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
      __vue_inject_styles__$5,
      __vue_script__$5,
      __vue_scope_id__$5,
      __vue_is_functional_template__$5,
      __vue_module_identifier__$5,
      undefined,
      undefined
    );

  var Plugin$2 = {
    install: function install(Vue) {
      registerComponent(Vue, Checkbox);
      registerComponent(Vue, CheckboxButton);
    }
  };
  use(Plugin$2);

  var script$6 = {
    name: 'BCollapse',
    props: {
      open: {
        type: Boolean,
        default: true
      },
      animation: {
        type: String,
        default: 'fade'
      },
      ariaId: {
        type: String,
        default: ''
      },
      position: {
        type: String,
        default: 'is-top',
        validator: function validator(value) {
          return ['is-top', 'is-bottom'].indexOf(value) > -1;
        }
      }
    },
    data: function data() {
      return {
        isOpen: this.open
      };
    },
    watch: {
      open: function open(value) {
        this.isOpen = value;
      }
    },
    methods: {
      /**
      * Toggle and emit events
      */
      toggle: function toggle() {
        this.isOpen = !this.isOpen;
        this.$emit('update:open', this.isOpen);
        this.$emit(this.isOpen ? 'open' : 'close');
      }
    },
    render: function render(createElement) {
      var trigger = createElement('div', {
        staticClass: 'collapse-trigger',
        on: {
          click: this.toggle
        }
      }, this.$scopedSlots.trigger ? [this.$scopedSlots.trigger({
        open: this.isOpen
      })] : [this.$slots.trigger]);
      var content = createElement('transition', {
        props: {
          name: this.animation
        }
      }, [createElement('div', {
        staticClass: 'collapse-content',
        attrs: {
          'id': this.ariaId,
          'aria-expanded': this.isOpen
        },
        directives: [{
          name: 'show',
          value: this.isOpen
        }]
      }, this.$slots.default)]);
      return createElement('div', {
        staticClass: 'collapse'
      }, this.position === 'is-top' ? [trigger, content] : [content, trigger]);
    }
  };

  /* script */
  const __vue_script__$6 = script$6;

  /* template */

    /* style */
    const __vue_inject_styles__$6 = undefined;
    /* scoped */
    const __vue_scope_id__$6 = undefined;
    /* module identifier */
    const __vue_module_identifier__$6 = undefined;
    /* functional template */
    const __vue_is_functional_template__$6 = undefined;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Collapse = normalizeComponent_1(
      {},
      __vue_inject_styles__$6,
      __vue_script__$6,
      __vue_scope_id__$6,
      __vue_is_functional_template__$6,
      __vue_module_identifier__$6,
      undefined,
      undefined
    );

  var Plugin$3 = {
    install: function install(Vue) {
      registerComponent(Vue, Collapse);
    }
  };
  use(Plugin$3);

  var AM = 'AM';
  var PM = 'PM';
  var HOUR_FORMAT_24 = '24';
  var HOUR_FORMAT_12 = '12';

  var defaultTimeFormatter = function defaultTimeFormatter(date, vm) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var period = '';

    if (vm.hourFormat === HOUR_FORMAT_12) {
      period = ' ' + (hours < 12 ? AM : PM);

      if (hours > 12) {
        hours -= 12;
      } else if (hours === 0) {
        hours = 12;
      }
    }

    return vm.pad(hours) + ':' + vm.pad(minutes) + (vm.enableSeconds ? ':' + vm.pad(seconds) : '') + period;
  };

  var defaultTimeParser = function defaultTimeParser(timeString, vm) {
    if (timeString) {
      var am = false;

      if (vm.hourFormat === HOUR_FORMAT_12) {
        var dateString12 = timeString.split(' ');
        timeString = dateString12[0];
        am = dateString12[1] === AM;
      }

      var time = timeString.split(':');
      var hours = parseInt(time[0], 10);
      var minutes = parseInt(time[1], 10);
      var seconds = vm.enableSeconds ? parseInt(time[2], 10) : 0;

      if (isNaN(hours) || hours < 0 || hours > 23 || vm.hourFormat === HOUR_FORMAT_12 && (hours < 1 || hours > 12) || isNaN(minutes) || minutes < 0 || minutes > 59) {
        return null;
      }

      var d = null;

      if (vm.computedValue && !isNaN(vm.computedValue)) {
        d = new Date(vm.computedValue);
      } else {
        d = new Date();
        d.setMilliseconds(0);
      }

      d.setSeconds(seconds);
      d.setMinutes(minutes);

      if (vm.hourFormat === HOUR_FORMAT_12) {
        if (am && hours === 12) {
          hours = 0;
        } else if (!am && hours !== 12) {
          hours += 12;
        }
      }

      d.setHours(hours);
      return new Date(d.getTime());
    }

    return null;
  };

  var TimepickerMixin = {
    mixins: [FormElementMixin],
    inheritAttrs: false,
    props: {
      value: Date,
      inline: Boolean,
      minTime: Date,
      maxTime: Date,
      placeholder: String,
      editable: Boolean,
      disabled: Boolean,
      hourFormat: {
        type: String,
        default: HOUR_FORMAT_24,
        validator: function validator(value) {
          return value === HOUR_FORMAT_24 || value === HOUR_FORMAT_12;
        }
      },
      incrementMinutes: {
        type: Number,
        default: 1
      },
      incrementSeconds: {
        type: Number,
        default: 1
      },
      timeFormatter: {
        type: Function,
        default: function _default(date, vm) {
          if (typeof config$1.defaultTimeFormatter === 'function') {
            return config$1.defaultTimeFormatter(date);
          } else {
            return defaultTimeFormatter(date, vm);
          }
        }
      },
      timeParser: {
        type: Function,
        default: function _default(date, vm) {
          if (typeof config$1.defaultTimeParser === 'function') {
            return config$1.defaultTimeParser(date);
          } else {
            return defaultTimeParser(date, vm);
          }
        }
      },
      mobileNative: {
        type: Boolean,
        default: function _default() {
          return config$1.defaultTimepickerMobileNative;
        }
      },
      position: String,
      unselectableTimes: Array,
      openOnFocus: Boolean,
      enableSeconds: Boolean,
      defaultMinutes: Number,
      defaultSeconds: Number
    },
    data: function data() {
      return {
        dateSelected: this.value,
        hoursSelected: null,
        minutesSelected: null,
        secondsSelected: null,
        meridienSelected: null,
        _elementRef: 'input',
        AM: AM,
        PM: PM,
        HOUR_FORMAT_24: HOUR_FORMAT_24,
        HOUR_FORMAT_12: HOUR_FORMAT_12
      };
    },
    computed: {
      computedValue: {
        get: function get() {
          return this.dateSelected;
        },
        set: function set(value) {
          this.dateSelected = value;
          this.$emit('input', value);
        }
      },
      hours: function hours() {
        var hours = [];
        var numberOfHours = this.isHourFormat24 ? 24 : 12;

        for (var i = 0; i < numberOfHours; i++) {
          var value = i;
          var label = value;

          if (!this.isHourFormat24) {
            value = i + 1;
            label = value;

            if (this.meridienSelected === this.AM) {
              if (value === 12) {
                value = 0;
              }
            } else if (this.meridienSelected === this.PM) {
              if (value !== 12) {
                value += 12;
              }
            }
          }

          hours.push({
            label: this.formatNumber(label),
            value: value
          });
        }

        return hours;
      },
      minutes: function minutes() {
        var minutes = [];

        for (var i = 0; i < 60; i += this.incrementMinutes) {
          minutes.push({
            label: this.formatNumber(i, true),
            value: i
          });
        }

        return minutes;
      },
      seconds: function seconds() {
        var seconds = [];

        for (var i = 0; i < 60; i += this.incrementSeconds) {
          seconds.push({
            label: this.formatNumber(i, true),
            value: i
          });
        }

        return seconds;
      },
      meridiens: function meridiens() {
        return [AM, PM];
      },
      isMobile: function isMobile$1() {
        return this.mobileNative && isMobile.any();
      },
      isHourFormat24: function isHourFormat24() {
        return this.hourFormat === HOUR_FORMAT_24;
      }
    },
    watch: {
      hourFormat: function hourFormat() {
        if (this.hoursSelected !== null) {
          this.meridienSelected = this.hoursSelected >= 12 ? PM : AM;
        }
      },

      /**
       * When v-model is changed:
       *   1. Update internal value.
       *   2. If it's invalid, validate again.
       */
      value: {
        handler: function handler(value) {
          this.updateInternalState(value);
          !this.isValid && this.$refs.input.checkHtml5Validity();
        },
        immediate: true
      }
    },
    methods: {
      onMeridienChange: function onMeridienChange(value) {
        if (this.hoursSelected !== null) {
          if (value === PM) {
            this.hoursSelected += 12;
          } else if (value === AM) {
            this.hoursSelected -= 12;
          }
        }

        this.updateDateSelected(this.hoursSelected, this.minutesSelected, this.enableSeconds ? this.secondsSelected : 0, value);
      },
      onHoursChange: function onHoursChange(value) {
        if (!this.minutesSelected && typeof this.defaultMinutes !== 'undefined') {
          this.minutesSelected = this.defaultMinutes;
        }

        if (!this.secondsSelected && typeof this.defaultSeconds !== 'undefined') {
          this.secondsSelected = this.defaultSeconds;
        }

        this.updateDateSelected(parseInt(value, 10), this.minutesSelected, this.enableSeconds ? this.secondsSelected : 0, this.meridienSelected);
      },
      onMinutesChange: function onMinutesChange(value) {
        if (!this.secondsSelected && this.defaultSeconds) {
          this.secondsSelected = this.defaultSeconds;
        }

        this.updateDateSelected(this.hoursSelected, parseInt(value, 10), this.enableSeconds ? this.secondsSelected : 0, this.meridienSelected);
      },
      onSecondsChange: function onSecondsChange(value) {
        this.updateDateSelected(this.hoursSelected, this.minutesSelected, parseInt(value, 10), this.meridienSelected);
      },
      updateDateSelected: function updateDateSelected(hours, minutes, seconds, meridiens) {
        if (hours != null && minutes != null && (!this.isHourFormat24 && meridiens !== null || this.isHourFormat24)) {
          var time = null;

          if (this.computedValue && !isNaN(this.computedValue)) {
            time = new Date(this.computedValue);
          } else {
            time = new Date();
            time.setMilliseconds(0);
          }

          time.setHours(hours);
          time.setMinutes(minutes);
          time.setSeconds(seconds);
          this.computedValue = new Date(time.getTime());
        }
      },
      updateInternalState: function updateInternalState(value) {
        if (value) {
          this.hoursSelected = value.getHours();
          this.minutesSelected = value.getMinutes();
          this.secondsSelected = value.getSeconds();
          this.meridienSelected = value.getHours() >= 12 ? PM : AM;
        } else {
          this.hoursSelected = null;
          this.minutesSelected = null;
          this.secondsSelected = null;
          this.meridienSelected = AM;
        }

        this.dateSelected = value;
      },
      isHourDisabled: function isHourDisabled(hour) {
        var _this = this;

        var disabled = false;

        if (this.minTime) {
          var minHours = this.minTime.getHours();
          var noMinutesAvailable = this.minutes.every(function (minute) {
            return _this.isMinuteDisabledForHour(hour, minute.value);
          });
          disabled = hour < minHours || noMinutesAvailable;
        }

        if (this.maxTime) {
          if (!disabled) {
            var maxHours = this.maxTime.getHours();
            disabled = hour > maxHours;
          }
        }

        if (this.unselectableTimes) {
          if (!disabled) {
            var unselectable = this.unselectableTimes.filter(function (time) {
              if (_this.enableSeconds && _this.secondsSelected !== null) {
                return time.getHours() === hour && time.getMinutes() === _this.minutesSelected && time.getSeconds() === _this.secondsSelected;
              } else if (_this.minutesSelected !== null) {
                return time.getHours() === hour && time.getMinutes() === _this.minutesSelected;
              } else {
                return time.getHours() === hour;
              }
            });
            disabled = unselectable.length > 0;
          }
        }

        return disabled;
      },
      isMinuteDisabledForHour: function isMinuteDisabledForHour(hour, minute) {
        var disabled = false;

        if (this.minTime) {
          var minHours = this.minTime.getHours();
          var minMinutes = this.minTime.getMinutes();
          disabled = hour === minHours && minute < minMinutes;
        }

        if (this.maxTime) {
          if (!disabled) {
            var maxHours = this.maxTime.getHours();
            var maxMinutes = this.maxTime.getMinutes();
            disabled = hour === maxHours && minute > maxMinutes;
          }
        }

        return disabled;
      },
      isMinuteDisabled: function isMinuteDisabled(minute) {
        var _this2 = this;

        var disabled = false;

        if (this.hoursSelected !== null) {
          if (this.isHourDisabled(this.hoursSelected)) {
            disabled = true;
          } else {
            disabled = this.isMinuteDisabledForHour(this.hoursSelected, minute);
          }

          if (this.unselectableTimes) {
            if (!disabled) {
              var unselectable = this.unselectableTimes.filter(function (time) {
                if (_this2.enableSeconds && _this2.secondsSelected !== null) {
                  return time.getHours() === _this2.hoursSelected && time.getMinutes() === minute && time.getSeconds() === _this2.secondsSelected;
                } else {
                  return time.getHours() === _this2.hoursSelected && time.getMinutes() === minute;
                }
              });
              disabled = unselectable.length > 0;
            }
          }
        }

        return disabled;
      },
      isSecondDisabled: function isSecondDisabled(second) {
        var _this3 = this;

        var disabled = false;

        if (this.minutesSelected !== null) {
          if (this.isMinuteDisabled(this.minutesSelected)) {
            disabled = true;
          } else {
            if (this.minTime) {
              var minHours = this.minTime.getHours();
              var minMinutes = this.minTime.getMinutes();
              var minSeconds = this.minTime.getSeconds();
              disabled = this.hoursSelected === minHours && this.minutesSelected === minMinutes && second < minSeconds;
            }

            if (this.maxTime) {
              if (!disabled) {
                var maxHours = this.maxTime.getHours();
                var maxMinutes = this.maxTime.getMinutes();
                var maxSeconds = this.maxTime.getSeconds();
                disabled = this.hoursSelected === maxHours && this.minutesSelected === maxMinutes && second > maxSeconds;
              }
            }
          }

          if (this.unselectableTimes) {
            if (!disabled) {
              var unselectable = this.unselectableTimes.filter(function (time) {
                return time.getHours() === _this3.hoursSelected && time.getMinutes() === _this3.minutesSelected && time.getSeconds() === second;
              });
              disabled = unselectable.length > 0;
            }
          }
        }

        return disabled;
      },

      /*
      * Parse string into date
      */
      onChange: function onChange(value) {
        var date = this.timeParser(value, this);
        this.updateInternalState(date);

        if (date && !isNaN(date)) {
          this.computedValue = date;
        } else {
          // Force refresh input value when not valid date
          this.computedValue = null;
          this.$refs.input.newValue = this.computedValue;
        }
      },

      /*
      * Toggle timepicker
      */
      toggle: function toggle(active) {
        if (this.$refs.dropdown) {
          this.$refs.dropdown.isActive = typeof active === 'boolean' ? active : !this.$refs.dropdown.isActive;
        }
      },

      /*
      * Close timepicker
      */
      close: function close() {
        this.toggle(false);
      },

      /*
      * Call default onFocus method and show timepicker
      */
      handleOnFocus: function handleOnFocus() {
        this.onFocus();

        if (this.openOnFocus) {
          this.toggle(true);
        }
      },

      /*
      * Format date into string 'HH-MM-SS'
      */
      formatHHMMSS: function formatHHMMSS(value) {
        var date = new Date(value);

        if (value && !isNaN(date)) {
          var hours = date.getHours();
          var minutes = date.getMinutes();
          var seconds = date.getSeconds();
          return this.formatNumber(hours, true) + ':' + this.formatNumber(minutes, true) + ':' + this.formatNumber(seconds, true);
        }

        return '';
      },

      /*
      * Parse time from string
      */
      onChangeNativePicker: function onChangeNativePicker(event) {
        var date = event.target.value;

        if (date) {
          var time = null;

          if (this.computedValue && !isNaN(this.computedValue)) {
            time = new Date(this.computedValue);
          } else {
            time = new Date();
            time.setMilliseconds(0);
          }

          var t = date.split(':');
          time.setHours(parseInt(t[0], 10));
          time.setMinutes(parseInt(t[1], 10));
          time.setSeconds(t[2] ? parseInt(t[2], 10) : 0);
          this.computedValue = new Date(time.getTime());
        } else {
          this.computedValue = null;
        }
      },
      formatNumber: function formatNumber(value, prependZero) {
        return this.isHourFormat24 || prependZero ? this.pad(value) : value;
      },
      pad: function pad(value) {
        return (value < 10 ? '0' : '') + value;
      },

      /*
      * Format date into string
      */
      formatValue: function formatValue(date) {
        if (date && !isNaN(date)) {
          return this.timeFormatter(date, this);
        } else {
          return null;
        }
      },

      /**
       * Keypress event that is bound to the document.
       */
      keyPress: function keyPress(event) {
        // Esc key
        if (this.$refs.dropdown && this.$refs.dropdown.isActive && event.keyCode === 27) {
          this.toggle(false);
        }
      }
    },
    created: function created() {
      if (typeof window !== 'undefined') {
        document.addEventListener('keyup', this.keyPress);
      }
    },
    beforeDestroy: function beforeDestroy() {
      if (typeof window !== 'undefined') {
        document.removeEventListener('keyup', this.keyPress);
      }
    }
  };

  var findFocusable = function findFocusable(element) {
    if (!element) {
      return null;
    }

    return element.querySelectorAll("a[href],\n                                     area[href],\n                                     input:not([disabled]),\n                                     select:not([disabled]),\n                                     textarea:not([disabled]),\n                                     button:not([disabled]),\n                                     iframe,\n                                     object,\n                                     embed,\n                                     *[tabindex],\n                                     *[contenteditable]");
  };

  var onKeyDown;

  var bind = function bind(el, _ref) {
    var _ref$value = _ref.value,
        value = _ref$value === void 0 ? true : _ref$value;

    if (value) {
      var focusable = findFocusable(el);

      if (focusable && focusable.length > 0) {
        var firstFocusable = focusable[0];
        var lastFocusable = focusable[focusable.length - 1];

        onKeyDown = function onKeyDown(event) {
          if (event.target === firstFocusable && event.shiftKey && event.key === 'Tab') {
            event.preventDefault();
            lastFocusable.focus();
          } else if (event.target === lastFocusable && !event.shiftKey && event.key === 'Tab') {
            event.preventDefault();
            firstFocusable.focus();
          }
        };

        el.addEventListener('keydown', onKeyDown);
        firstFocusable.focus();
      }
    }
  };

  var unbind = function unbind(el) {
    el.removeEventListener('keydown', onKeyDown);
  };

  var directive = {
    bind: bind,
    unbind: unbind
  };

  //
  var DEFAULT_CLOSE_OPTIONS = ['escape', 'outside'];
  var script$7 = {
    name: 'BDropdown',
    directives: {
      trapFocus: directive
    },
    props: {
      value: {
        type: [String, Number, Boolean, Object, Array, Function],
        default: null
      },
      disabled: Boolean,
      hoverable: Boolean,
      inline: Boolean,
      position: {
        type: String,
        validator: function validator(value) {
          return ['is-top-right', 'is-top-left', 'is-bottom-left'].indexOf(value) > -1;
        }
      },
      mobileModal: {
        type: Boolean,
        default: function _default() {
          return config$1.defaultDropdownMobileModal;
        }
      },
      ariaRole: {
        type: String,
        default: ''
      },
      animation: {
        type: String,
        default: 'fade'
      },
      multiple: Boolean,
      trapFocus: {
        type: Boolean,
        default: config$1.defaultTrapFocus
      },
      closeOnClick: {
        type: Boolean,
        default: true
      },
      canClose: {
        type: [Array, Boolean],
        default: true
      },
      expanded: Boolean
    },
    data: function data() {
      return {
        selected: this.value,
        isActive: false,
        isHoverable: this.hoverable,
        _isDropdown: true // Used internally by DropdownItem

      };
    },
    computed: {
      rootClasses: function rootClasses() {
        return [this.position, {
          'is-disabled': this.disabled,
          'is-hoverable': this.hoverable,
          'is-inline': this.inline,
          'is-active': this.isActive || this.inline,
          'is-mobile-modal': this.isMobileModal,
          'is-expanded': this.expanded
        }];
      },
      isMobileModal: function isMobileModal() {
        return this.mobileModal && !this.inline && !this.hoverable;
      },
      cancelOptions: function cancelOptions() {
        return typeof this.canClose === 'boolean' ? this.canClose ? DEFAULT_CLOSE_OPTIONS : [] : this.canClose;
      },
      ariaRoleMenu: function ariaRoleMenu() {
        return this.ariaRole === 'menu' || this.ariaRole === 'list' ? this.ariaRole : null;
      }
    },
    watch: {
      /**
      * When v-model is changed set the new selected item.
      */
      value: function value(_value) {
        this.selected = _value;
      },

      /**
      * Emit event when isActive value is changed.
      */
      isActive: function isActive(value) {
        this.$emit('active-change', value);
      }
    },
    methods: {
      /**
      * Click listener from DropdownItem.
      *   1. Set new selected item.
      *   2. Emit input event to update the user v-model.
      *   3. Close the dropdown.
      */
      selectItem: function selectItem(value) {
        var _this = this;

        if (this.multiple) {
          if (this.selected) {
            var index = this.selected.indexOf(value);

            if (index === -1) {
              this.selected.push(value);
            } else {
              this.selected.splice(index, 1);
            }
          } else {
            this.selected = [value];
          }

          this.$emit('change', this.selected);
        } else {
          if (this.selected !== value) {
            this.selected = value;
            this.$emit('change', this.selected);
          }
        }

        this.$emit('input', this.selected);

        if (!this.multiple) {
          this.isActive = !this.closeOnClick;

          if (this.hoverable && this.closeOnClick) {
            this.isHoverable = false; // Timeout for the animation complete before destroying

            setTimeout(function () {
              _this.isHoverable = true;
            }, 250);
          }
        }
      },

      /**
      * White-listed items to not close when clicked.
      */
      isInWhiteList: function isInWhiteList(el) {
        if (el === this.$refs.dropdownMenu) return true;
        if (el === this.$refs.trigger) return true; // All chidren from dropdown

        if (this.$refs.dropdownMenu !== undefined) {
          var children = this.$refs.dropdownMenu.querySelectorAll('*');
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var child = _step.value;

              if (el === child) {
                return true;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        } // All children from trigger


        if (this.$refs.trigger !== undefined) {
          var _children = this.$refs.trigger.querySelectorAll('*');

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = _children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _child = _step2.value;

              if (el === _child) {
                return true;
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }

        return false;
      },

      /**
      * Close dropdown if clicked outside.
      */
      clickedOutside: function clickedOutside(event) {
        if (this.cancelOptions.indexOf('outside') < 0) return;
        if (this.inline) return;
        if (!this.isInWhiteList(event.target)) this.isActive = false;
      },

      /**
       * Keypress event that is bound to the document
       */
      keyPress: function keyPress(event) {
        // Esc key
        if (this.isActive && event.keyCode === 27) {
          if (this.cancelOptions.indexOf('escape') < 0) return;
          this.isActive = false;
        }
      },

      /**
      * Toggle dropdown if it's not disabled.
      */
      toggle: function toggle() {
        var _this2 = this;

        if (this.disabled) return;

        if (!this.isActive) {
          // if not active, toggle after clickOutside event
          // this fixes toggling programmatic
          this.$nextTick(function () {
            var value = !_this2.isActive;
            _this2.isActive = value; // Vue 2.6.x ???

            setTimeout(function () {
              return _this2.isActive = value;
            });
          });
        } else {
          this.isActive = !this.isActive;
        }
      }
    },
    created: function created() {
      if (typeof window !== 'undefined') {
        document.addEventListener('click', this.clickedOutside);
        document.addEventListener('keyup', this.keyPress);
      }
    },
    beforeDestroy: function beforeDestroy() {
      if (typeof window !== 'undefined') {
        document.removeEventListener('click', this.clickedOutside);
        document.removeEventListener('keyup', this.keyPress);
      }
    }
  };

  /* script */
  const __vue_script__$7 = script$7;

  /* template */
  var __vue_render__$6 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"dropdown",class:_vm.rootClasses},[(!_vm.inline)?_c('div',{ref:"trigger",staticClass:"dropdown-trigger",attrs:{"role":"button","aria-haspopup":"true"},on:{"click":_vm.toggle}},[_vm._t("trigger")],2):_vm._e(),_vm._v(" "),_c('transition',{attrs:{"name":_vm.animation}},[(_vm.isMobileModal)?_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.isActive),expression:"isActive"}],staticClass:"background",attrs:{"aria-hidden":!_vm.isActive}}):_vm._e()]),_vm._v(" "),_c('transition',{attrs:{"name":_vm.animation}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:((!_vm.disabled && (_vm.isActive || _vm.isHoverable)) || _vm.inline),expression:"(!disabled && (isActive || isHoverable)) || inline"},{name:"trap-focus",rawName:"v-trap-focus",value:(_vm.trapFocus),expression:"trapFocus"}],ref:"dropdownMenu",staticClass:"dropdown-menu",attrs:{"aria-hidden":!_vm.isActive}},[_c('div',{staticClass:"dropdown-content",attrs:{"role":_vm.ariaRoleMenu}},[_vm._t("default")],2)])])],1)};
  var __vue_staticRenderFns__$6 = [];

    /* style */
    const __vue_inject_styles__$7 = undefined;
    /* scoped */
    const __vue_scope_id__$7 = undefined;
    /* module identifier */
    const __vue_module_identifier__$7 = undefined;
    /* functional template */
    const __vue_is_functional_template__$7 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Dropdown = normalizeComponent_1(
      { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
      __vue_inject_styles__$7,
      __vue_script__$7,
      __vue_scope_id__$7,
      __vue_is_functional_template__$7,
      __vue_module_identifier__$7,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$8 = {
    name: 'BDropdownItem',
    props: {
      value: {
        type: [String, Number, Boolean, Object, Array, Function],
        default: null
      },
      separator: Boolean,
      disabled: Boolean,
      custom: Boolean,
      focusable: {
        type: Boolean,
        default: true
      },
      paddingless: Boolean,
      hasLink: Boolean,
      ariaRole: {
        type: String,
        default: ''
      }
    },
    computed: {
      anchorClasses: function anchorClasses() {
        return {
          'is-disabled': this.$parent.disabled || this.disabled,
          'is-paddingless': this.paddingless,
          'is-active': this.isActive
        };
      },
      itemClasses: function itemClasses() {
        return {
          'dropdown-item': !this.hasLink,
          'is-disabled': this.disabled,
          'is-paddingless': this.paddingless,
          'is-active': this.isActive,
          'has-link': this.hasLink
        };
      },
      ariaRoleItem: function ariaRoleItem() {
        return this.ariaRole === 'menuitem' || this.ariaRole === 'listitem' ? this.ariaRole : null;
      },

      /**
      * Check if item can be clickable.
      */
      isClickable: function isClickable() {
        return !this.$parent.disabled && !this.separator && !this.disabled && !this.custom;
      },
      isActive: function isActive() {
        if (this.$parent.selected === null) return false;
        if (this.$parent.multiple) return this.$parent.selected.indexOf(this.value) >= 0;
        return this.value === this.$parent.selected;
      }
    },
    methods: {
      /**
      * Click listener, select the item.
      */
      selectItem: function selectItem() {
        if (!this.isClickable) return;
        this.$parent.selectItem(this.value);
        this.$emit('click');
      }
    },
    created: function created() {
      if (!this.$parent.$data._isDropdown) {
        this.$destroy();
        throw new Error('You should wrap bDropdownItem on a bDropdown');
      }
    }
  };

  /* script */
  const __vue_script__$8 = script$8;

  /* template */
  var __vue_render__$7 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.separator)?_c('hr',{staticClass:"dropdown-divider"}):(!_vm.custom && !_vm.hasLink)?_c('a',{staticClass:"dropdown-item",class:_vm.anchorClasses,attrs:{"role":_vm.ariaRoleItem,"tabindex":_vm.focusable ? 0 : null},on:{"click":_vm.selectItem}},[_vm._t("default")],2):_c('div',{class:_vm.itemClasses,attrs:{"role":_vm.ariaRoleItem,"tabindex":_vm.focusable ? 0 : null},on:{"click":_vm.selectItem}},[_vm._t("default")],2)};
  var __vue_staticRenderFns__$7 = [];

    /* style */
    const __vue_inject_styles__$8 = undefined;
    /* scoped */
    const __vue_scope_id__$8 = undefined;
    /* module identifier */
    const __vue_module_identifier__$8 = undefined;
    /* functional template */
    const __vue_is_functional_template__$8 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var DropdownItem = normalizeComponent_1(
      { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
      __vue_inject_styles__$8,
      __vue_script__$8,
      __vue_scope_id__$8,
      __vue_is_functional_template__$8,
      __vue_module_identifier__$8,
      undefined,
      undefined
    );

  var script$9 = {
    name: 'BFieldBody',
    props: {
      message: {
        type: String
      },
      type: {
        type: [String, Object]
      }
    },
    render: function render(createElement) {
      var _this = this;

      return createElement('div', {
        attrs: {
          'class': 'field-body'
        }
      }, this.$slots.default.map(function (element) {
        // skip returns and comments
        if (!element.tag) {
          return element;
        }

        if (_this.message) {
          return createElement('b-field', {
            attrs: {
              message: _this.message,
              'type': _this.type
            }
          }, [element]);
        }

        return createElement('b-field', {
          attrs: {
            'type': _this.type
          }
        }, [element]);
      }));
    }
  };

  /* script */
  const __vue_script__$9 = script$9;

  /* template */

    /* style */
    const __vue_inject_styles__$9 = undefined;
    /* scoped */
    const __vue_scope_id__$9 = undefined;
    /* module identifier */
    const __vue_module_identifier__$9 = undefined;
    /* functional template */
    const __vue_is_functional_template__$9 = undefined;
    /* style inject */
    
    /* style inject SSR */
    

    
    var FieldBody = normalizeComponent_1(
      {},
      __vue_inject_styles__$9,
      __vue_script__$9,
      __vue_scope_id__$9,
      __vue_is_functional_template__$9,
      __vue_module_identifier__$9,
      undefined,
      undefined
    );

  var script$a = {
    name: 'BField',
    components: _defineProperty({}, FieldBody.name, FieldBody),
    props: {
      type: [String, Object],
      label: String,
      labelFor: String,
      message: [String, Array, Object],
      grouped: Boolean,
      groupMultiline: Boolean,
      position: String,
      expanded: Boolean,
      horizontal: Boolean,
      addons: {
        type: Boolean,
        default: true
      },
      customClass: String,
      labelPosition: {
        type: String,
        default: function _default() {
          return config$1.defaultFieldLabelPosition;
        }
      }
    },
    data: function data() {
      return {
        newType: this.type,
        newMessage: this.message,
        fieldLabelSize: null,
        _isField: true // Used internally by Input and Select

      };
    },
    computed: {
      rootClasses: function rootClasses() {
        return [this.newPosition, {
          'is-expanded': this.expanded,
          'is-grouped-multiline': this.groupMultiline,
          'is-horizontal': this.horizontal,
          'is-floating-in-label': this.hasLabel && !this.horizontal && this.labelPosition === 'inside',
          'is-floating-label': this.hasLabel && !this.horizontal && this.labelPosition === 'on-border'
        }, this.numberInputClasses];
      },

      /**
      * Correct Bulma class for the side of the addon or group.
      *
      * This is not kept like the others (is-small, etc.),
      * because since 'has-addons' is set automatically it
      * doesn't make sense to teach users what addons are exactly.
      */
      newPosition: function newPosition() {
        if (this.position === undefined) return;
        var position = this.position.split('-');
        if (position.length < 1) return;
        var prefix = this.grouped ? 'is-grouped-' : 'has-addons-';
        if (this.position) return prefix + position[1];
      },

      /**
      * Formatted message in case it's an array
      * (each element is separated by <br> tag)
      */
      formattedMessage: function formattedMessage() {
        if (typeof this.newMessage === 'string') {
          return this.newMessage;
        } else {
          var messages = [];

          if (Array.isArray(this.newMessage)) {
            this.newMessage.forEach(function (message) {
              if (typeof message === 'string') {
                messages.push(message);
              } else {
                for (var key in message) {
                  if (message[key]) {
                    messages.push(key);
                  }
                }
              }
            });
          } else {
            for (var key in this.newMessage) {
              if (this.newMessage[key]) {
                messages.push(key);
              }
            }
          }

          return messages.filter(function (m) {
            if (m) return m;
          }).join(' <br> ');
        }
      },
      hasLabel: function hasLabel() {
        return this.label || this.$slots.label;
      },
      numberInputClasses: function numberInputClasses() {
        if (this.$slots.default) {
          var numberinput = this.$slots.default.filter(function (node) {
            return node.tag && node.tag.toLowerCase().indexOf('numberinput') >= 0;
          })[0];

          if (numberinput) {
            var classes = ['has-numberinput'];
            var controlsPosition = numberinput.componentOptions.propsData.controlsPosition;
            var size = numberinput.componentOptions.propsData.size;

            if (controlsPosition) {
              classes.push("has-numberinput-".concat(controlsPosition));
            }

            if (size) {
              classes.push("has-numberinput-".concat(size));
            }

            return classes;
          }
        }

        return null;
      }
    },
    watch: {
      /**
      * Set internal type when prop change.
      */
      type: function type(value) {
        this.newType = value;
      },

      /**
      * Set internal message when prop change.
      */
      message: function message(value) {
        this.newMessage = value;
      }
    },
    methods: {
      /**
      * Field has addons if there are more than one slot
      * (element / component) in the Field.
      * Or is grouped when prop is set.
      * Is a method to be called when component re-render.
      */
      fieldType: function fieldType() {
        if (this.grouped) return 'is-grouped';
        var renderedNode = 0;

        if (this.$slots.default) {
          renderedNode = this.$slots.default.reduce(function (i, node) {
            return node.tag ? i + 1 : i;
          }, 0);
        }

        if (renderedNode > 1 && this.addons && !this.horizontal) {
          return 'has-addons';
        }
      }
    },
    mounted: function mounted() {
      if (this.horizontal) {
        // Bulma docs: .is-normal for any .input or .button
        var elements = this.$el.querySelectorAll('.input, .select, .button, .textarea, .b-slider');

        if (elements.length > 0) {
          this.fieldLabelSize = 'is-normal';
        }
      }
    }
  };

  /* script */
  const __vue_script__$a = script$a;

  /* template */
  var __vue_render__$8 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"field",class:[_vm.rootClasses, _vm.fieldType()]},[(_vm.horizontal)?_c('div',{staticClass:"field-label",class:[_vm.customClass, _vm.fieldLabelSize]},[(_vm.hasLabel)?_c('label',{staticClass:"label",class:_vm.customClass,attrs:{"for":_vm.labelFor}},[(_vm.$slots.label)?_vm._t("label"):[_vm._v(_vm._s(_vm.label))]],2):_vm._e()]):[(_vm.hasLabel)?_c('label',{staticClass:"label",class:_vm.customClass,attrs:{"for":_vm.labelFor}},[(_vm.$slots.label)?_vm._t("label"):[_vm._v(_vm._s(_vm.label))]],2):_vm._e()],_vm._v(" "),(_vm.horizontal)?_c('b-field-body',{attrs:{"message":_vm.newMessage ? _vm.formattedMessage : '',"type":_vm.newType}},[_vm._t("default")],2):[_vm._t("default")],_vm._v(" "),(_vm.newMessage && !_vm.horizontal)?_c('p',{staticClass:"help",class:_vm.newType,domProps:{"innerHTML":_vm._s(_vm.formattedMessage)}}):_vm._e()],2)};
  var __vue_staticRenderFns__$8 = [];

    /* style */
    const __vue_inject_styles__$a = undefined;
    /* scoped */
    const __vue_scope_id__$a = undefined;
    /* module identifier */
    const __vue_module_identifier__$a = undefined;
    /* functional template */
    const __vue_is_functional_template__$a = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Field = normalizeComponent_1(
      { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
      __vue_inject_styles__$a,
      __vue_script__$a,
      __vue_scope_id__$a,
      __vue_is_functional_template__$a,
      __vue_module_identifier__$a,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // These should match the variables in clockpicker.scss
  var indicatorSize = 40;
  var paddingInner = 5;
  var script$b = {
    name: 'BClockpickerFace',
    props: {
      pickerSize: Number,
      min: Number,
      max: Number,
      double: Boolean,
      value: Number,
      faceNumbers: Array,
      disabledValues: Function
    },
    data: function data() {
      return {
        isDragging: false,
        inputValue: this.value,
        prevAngle: 720
      };
    },
    computed: {
      /**
      * How many number indicators are shown on the face
      */
      count: function count() {
        return this.max - this.min + 1;
      },

      /**
      * How many number indicators are shown per ring on the face
      */
      countPerRing: function countPerRing() {
        return this.double ? this.count / 2 : this.count;
      },

      /**
      * Radius of the clock face
      */
      radius: function radius() {
        return this.pickerSize / 2;
      },

      /**
      * Radius of the outer ring of number indicators
      */
      outerRadius: function outerRadius() {
        return this.radius - paddingInner - indicatorSize / 2;
      },

      /**
      * Radius of the inner ring of number indicators
      */
      innerRadius: function innerRadius() {
        return Math.max(this.outerRadius * 0.6, this.outerRadius - paddingInner - indicatorSize); // 48px gives enough room for the outer ring of numbers
      },

      /**
      * The angle for each selectable value
      * For hours this ends up being 30 degrees, for minutes 6 degrees
      */
      degreesPerUnit: function degreesPerUnit() {
        return 360 / this.countPerRing;
      },

      /**
      * Used for calculating x/y grid location based on degrees
      */
      degrees: function degrees() {
        return this.degreesPerUnit * Math.PI / 180;
      },

      /**
      * Calculates the angle the clock hand should be rotated for the
      * selected value
      */
      handRotateAngle: function handRotateAngle() {
        var currentAngle = this.prevAngle;

        while (currentAngle < 0) {
          currentAngle += 360;
        }

        var targetAngle = this.calcHandAngle(this.displayedValue);
        var degreesDiff = this.shortestDistanceDegrees(currentAngle, targetAngle);
        var angle = this.prevAngle + degreesDiff;
        return angle;
      },

      /**
      * Determines how long the selector hand is based on if the
      * selected value is located along the outer or inner ring
      */
      handScale: function handScale() {
        return this.calcHandScale(this.displayedValue);
      },
      handStyle: function handStyle() {
        return {
          transform: "rotate(".concat(this.handRotateAngle, "deg) scaleY(").concat(this.handScale, ")"),
          transition: '.3s cubic-bezier(.25,.8,.50,1)'
        };
      },

      /**
      * The value the hand should be pointing at
      */
      displayedValue: function displayedValue() {
        return this.inputValue == null ? this.min : this.inputValue;
      }
    },
    watch: {
      value: function value(_value) {
        if (_value !== this.inputValue) {
          this.prevAngle = this.handRotateAngle;
        }

        this.inputValue = _value;
      }
    },
    methods: {
      isDisabled: function isDisabled(value) {
        return this.disabledValues && this.disabledValues(value);
      },

      /**
      * Calculates the distance between two points
      */
      euclidean: function euclidean(p0, p1) {
        var dx = p1.x - p0.x;
        var dy = p1.y - p0.y;
        return Math.sqrt(dx * dx + dy * dy);
      },
      shortestDistanceDegrees: function shortestDistanceDegrees(start, stop) {
        var modDiff = (stop - start) % 360;
        var shortestDistance = 180 - Math.abs(Math.abs(modDiff) - 180);
        return (modDiff + 360) % 360 < 180 ? shortestDistance * 1 : shortestDistance * -1;
      },

      /**
      * Calculates the angle of the line from the center point
      * to the given point.
      */
      coordToAngle: function coordToAngle(center, p1) {
        var value = 2 * Math.atan2(p1.y - center.y - this.euclidean(center, p1), p1.x - center.x);
        return Math.abs(value * 180 / Math.PI);
      },

      /**
      * Generates the inline style translate() property for a
      * number indicator, which determines it's location on the
      * clock face
      */
      getNumberTranslate: function getNumberTranslate(value) {
        var _this$getNumberCoords = this.getNumberCoords(value),
            x = _this$getNumberCoords.x,
            y = _this$getNumberCoords.y;

        return "translate(".concat(x, "px, ").concat(y, "px)");
      },

      /***
      * Calculates the coordinates on the clock face for a number
      * indicator value
      */
      getNumberCoords: function getNumberCoords(value) {
        var radius = this.isInnerRing(value) ? this.innerRadius : this.outerRadius;
        return {
          x: Math.round(radius * Math.sin((value - this.min) * this.degrees)),
          y: Math.round(-radius * Math.cos((value - this.min) * this.degrees))
        };
      },
      getFaceNumberClasses: function getFaceNumberClasses(num) {
        return {
          'active': num.value === this.displayedValue,
          'disabled': this.isDisabled(num.value)
        };
      },

      /**
      * Determines if a value resides on the inner ring
      */
      isInnerRing: function isInnerRing(value) {
        return this.double && value - this.min >= this.countPerRing;
      },
      calcHandAngle: function calcHandAngle(value) {
        var angle = this.degreesPerUnit * (value - this.min);
        if (this.isInnerRing(value)) angle -= 360;
        return angle;
      },
      calcHandScale: function calcHandScale(value) {
        return this.isInnerRing(value) ? this.innerRadius / this.outerRadius : 1;
      },
      onMouseDown: function onMouseDown(e) {
        e.preventDefault();
        this.isDragging = true;
        this.onDragMove(e);
      },
      onMouseUp: function onMouseUp() {
        this.isDragging = false;

        if (!this.isDisabled(this.inputValue)) {
          this.$emit('change', this.inputValue);
        }
      },
      onDragMove: function onDragMove(e) {
        e.preventDefault();
        if (!this.isDragging && e.type !== 'click') return;

        var _this$$refs$clock$get = this.$refs.clock.getBoundingClientRect(),
            width = _this$$refs$clock$get.width,
            top = _this$$refs$clock$get.top,
            left = _this$$refs$clock$get.left;

        var _ref = 'touches' in e ? e.touches[0] : e,
            clientX = _ref.clientX,
            clientY = _ref.clientY;

        var center = {
          x: width / 2,
          y: -width / 2
        };
        var coords = {
          x: clientX - left,
          y: top - clientY
        };
        var handAngle = Math.round(this.coordToAngle(center, coords) + 360) % 360;
        var insideClick = this.double && this.euclidean(center, coords) < (this.outerRadius + this.innerRadius) / 2 - 16;
        var value = Math.round(handAngle / this.degreesPerUnit) + this.min + (insideClick ? this.countPerRing : 0); // Necessary to fix edge case when selecting left part of max value

        if (handAngle >= 360 - this.degreesPerUnit / 2) {
          value = insideClick ? this.max : this.min;
        }

        this.update(value);
      },
      update: function update(value) {
        if (this.inputValue !== value && !this.isDisabled(value)) {
          this.prevAngle = this.handRotateAngle;
          this.inputValue = value;
          this.$emit('input', value);
        }
      }
    }
  };

  /* script */
  const __vue_script__$b = script$b;

  /* template */
  var __vue_render__$9 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"b-clockpicker-face",on:{"mousedown":_vm.onMouseDown,"mouseup":_vm.onMouseUp,"mousemove":_vm.onDragMove,"touchstart":_vm.onMouseDown,"touchend":_vm.onMouseUp,"touchmove":_vm.onDragMove}},[_c('div',{ref:"clock",staticClass:"b-clockpicker-face-outer-ring"},[_c('div',{staticClass:"b-clockpicker-face-hand",style:(_vm.handStyle)}),_vm._v(" "),_vm._l((_vm.faceNumbers),function(num,index){return _c('span',{key:index,staticClass:"b-clockpicker-face-number",class:_vm.getFaceNumberClasses(num),style:({ transform: _vm.getNumberTranslate(num.value) })},[_c('span',[_vm._v(_vm._s(num.label))])])})],2)])};
  var __vue_staticRenderFns__$9 = [];

    /* style */
    const __vue_inject_styles__$b = undefined;
    /* scoped */
    const __vue_scope_id__$b = undefined;
    /* module identifier */
    const __vue_module_identifier__$b = undefined;
    /* functional template */
    const __vue_is_functional_template__$b = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var ClockpickerFace = normalizeComponent_1(
      { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
      __vue_inject_styles__$b,
      __vue_script__$b,
      __vue_scope_id__$b,
      __vue_is_functional_template__$b,
      __vue_module_identifier__$b,
      undefined,
      undefined
    );

  var _components;
  var outerPadding = 12;
  var script$c = {
    name: 'BClockpicker',
    components: (_components = {}, _defineProperty(_components, ClockpickerFace.name, ClockpickerFace), _defineProperty(_components, Input.name, Input), _defineProperty(_components, Field.name, Field), _defineProperty(_components, Icon.name, Icon), _defineProperty(_components, Dropdown.name, Dropdown), _defineProperty(_components, DropdownItem.name, DropdownItem), _components),
    mixins: [TimepickerMixin],
    props: {
      pickerSize: {
        type: Number,
        default: 290
      },
      hourFormat: {
        type: String,
        default: '12',
        validator: function validator(value) {
          return value === '24' || value === '12';
        }
      },
      incrementMinutes: {
        type: Number,
        default: 5
      },
      autoSwitch: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        default: 'is-primary'
      },
      hoursLabel: {
        type: String,
        default: function _default() {
          return config$1.defaultClockpickerHoursLabel || 'Hours';
        }
      },
      minutesLabel: {
        type: String,
        default: function _default() {
          return config$1.defaultClockpickerMinutesLabel || 'Min';
        }
      }
    },
    data: function data() {
      return {
        isSelectingHour: true,
        isDragging: false,
        _isClockpicker: true
      };
    },
    computed: {
      hoursDisplay: function hoursDisplay() {
        if (this.hoursSelected == null) return '--';
        if (this.isHourFormat24) return this.pad(this.hoursSelected);
        var display = this.hoursSelected;
        if (this.meridienSelected === this.PM) display -= 12;
        if (display === 0) display = 12;
        return display;
      },
      minutesDisplay: function minutesDisplay() {
        return this.minutesSelected == null ? '--' : this.pad(this.minutesSelected);
      },
      minFaceValue: function minFaceValue() {
        return this.isSelectingHour && !this.isHourFormat24 && this.meridienSelected === this.PM ? 12 : 0;
      },
      maxFaceValue: function maxFaceValue() {
        return this.isSelectingHour ? !this.isHourFormat24 && this.meridienSelected === this.AM ? 11 : 23 : 59;
      },
      faceSize: function faceSize() {
        return this.pickerSize - outerPadding * 2;
      },
      faceDisabledValues: function faceDisabledValues() {
        return this.isSelectingHour ? this.isHourDisabled : this.isMinuteDisabled;
      }
    },
    methods: {
      onClockInput: function onClockInput(value) {
        if (this.isSelectingHour) {
          this.hoursSelected = value;
          this.onHoursChange(value);
        } else {
          this.minutesSelected = value;
          this.onMinutesChange(value);
        }
      },
      onClockChange: function onClockChange(value) {
        if (this.autoSwitch && this.isSelectingHour) {
          this.isSelectingHour = !this.isSelectingHour;
        }
      },
      onMeridienClick: function onMeridienClick(value) {
        if (this.meridienSelected !== value) {
          this.meridienSelected = value;
          this.onMeridienChange(value);
        }
      }
    }
  };

  /* script */
  const __vue_script__$c = script$c;

  /* template */
  var __vue_render__$a = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"b-clockpicker control",class:[_vm.size, _vm.type, {'is-expanded': _vm.expanded}]},[(!_vm.isMobile || _vm.inline)?_c('b-dropdown',{ref:"dropdown",attrs:{"position":_vm.position,"disabled":_vm.disabled,"inline":_vm.inline}},[(!_vm.inline)?_c('b-input',_vm._b({ref:"input",attrs:{"slot":"trigger","autocomplete":"off","value":_vm.formatValue(_vm.computedValue),"placeholder":_vm.placeholder,"size":_vm.size,"icon":_vm.icon,"icon-pack":_vm.iconPack,"loading":_vm.loading,"disabled":_vm.disabled,"readonly":!_vm.editable,"rounded":_vm.rounded,"use-html5-validation":_vm.useHtml5Validation},on:{"focus":_vm.handleOnFocus,"blur":function($event){_vm.onBlur() && _vm.checkHtml5Validity();}},nativeOn:{"click":function($event){$event.stopPropagation();_vm.toggle(true);},"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }_vm.toggle(true);},"change":function($event){_vm.onChangeNativePicker($event);}},slot:"trigger"},'b-input',_vm.$attrs,false)):_vm._e(),_vm._v(" "),_c('div',{staticClass:"card",attrs:{"disabled":_vm.disabled,"custom":""}},[(_vm.inline)?_c('header',{staticClass:"card-header"},[_c('div',{staticClass:"b-clockpicker-header card-header-title"},[_c('div',{staticClass:"b-clockpicker-time"},[_c('span',{staticClass:"b-clockpicker-btn",class:{ active: _vm.isSelectingHour },on:{"click":function($event){_vm.isSelectingHour = true;}}},[_vm._v(_vm._s(_vm.hoursDisplay))]),_vm._v(" "),_c('span',[_vm._v(":")]),_vm._v(" "),_c('span',{staticClass:"b-clockpicker-btn",class:{ active: !_vm.isSelectingHour },on:{"click":function($event){_vm.isSelectingHour = false;}}},[_vm._v(_vm._s(_vm.minutesDisplay))])]),_vm._v(" "),(!_vm.isHourFormat24)?_c('div',{staticClass:"b-clockpicker-period"},[_c('div',{staticClass:"b-clockpicker-btn",class:{ active: _vm.meridienSelected == _vm.AM },on:{"click":function($event){_vm.onMeridienClick(_vm.AM);}}},[_vm._v("am")]),_vm._v(" "),_c('div',{staticClass:"b-clockpicker-btn",class:{ active: _vm.meridienSelected == _vm.PM },on:{"click":function($event){_vm.onMeridienClick(_vm.PM);}}},[_vm._v("pm")])]):_vm._e()])]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"card-content"},[_c('div',{staticClass:"b-clockpicker-body",style:({ width: _vm.faceSize + 'px', height: _vm.faceSize + 'px' })},[(!_vm.inline)?_c('div',{staticClass:"b-clockpicker-time"},[_c('div',{staticClass:"b-clockpicker-btn",class:{ active: _vm.isSelectingHour },on:{"click":function($event){_vm.isSelectingHour = true;}}},[_vm._v(_vm._s(_vm.hoursLabel))]),_vm._v(" "),_c('span',{staticClass:"b-clockpicker-btn",class:{ active: !_vm.isSelectingHour },on:{"click":function($event){_vm.isSelectingHour = false;}}},[_vm._v(_vm._s(_vm.minutesLabel))])]):_vm._e(),_vm._v(" "),(!_vm.isHourFormat24 && !_vm.inline)?_c('div',{staticClass:"b-clockpicker-period"},[_c('div',{staticClass:"b-clockpicker-btn",class:{ active: _vm.meridienSelected == _vm.AM },on:{"click":function($event){_vm.onMeridienClick(_vm.AM);}}},[_vm._v(_vm._s(_vm.AM))]),_vm._v(" "),_c('div',{staticClass:"b-clockpicker-btn",class:{ active: _vm.meridienSelected == _vm.PM },on:{"click":function($event){_vm.onMeridienClick(_vm.PM);}}},[_vm._v(_vm._s(_vm.PM))])]):_vm._e(),_vm._v(" "),_c('b-clockpicker-face',{attrs:{"picker-size":_vm.faceSize,"min":_vm.minFaceValue,"max":_vm.maxFaceValue,"face-numbers":_vm.isSelectingHour ? _vm.hours : _vm.minutes,"disabled-values":_vm.faceDisabledValues,"double":_vm.isSelectingHour && _vm.isHourFormat24,"value":_vm.isSelectingHour ? _vm.hoursSelected : _vm.minutesSelected},on:{"input":_vm.onClockInput,"change":_vm.onClockChange}})],1)]),_vm._v(" "),(_vm.$slots.default !== undefined && _vm.$slots.default.length)?_c('footer',{staticClass:"b-clockpicker-footer card-footer"},[_vm._t("default")],2):_vm._e()])],1):_c('b-input',_vm._b({ref:"input",attrs:{"type":"time","autocomplete":"off","value":_vm.formatHHMMSS(_vm.computedValue),"placeholder":_vm.placeholder,"size":_vm.size,"icon":_vm.icon,"icon-pack":_vm.iconPack,"loading":_vm.loading,"max":_vm.formatHHMMSS(_vm.maxTime),"min":_vm.formatHHMMSS(_vm.minTime),"disabled":_vm.disabled,"readonly":false,"use-html5-validation":_vm.useHtml5Validation},on:{"focus":_vm.handleOnFocus,"blur":function($event){_vm.onBlur() && _vm.checkHtml5Validity();}},nativeOn:{"click":function($event){$event.stopPropagation();_vm.toggle(true);},"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }_vm.toggle(true);},"change":function($event){_vm.onChangeNativePicker($event);}}},'b-input',_vm.$attrs,false))],1)};
  var __vue_staticRenderFns__$a = [];

    /* style */
    const __vue_inject_styles__$c = undefined;
    /* scoped */
    const __vue_scope_id__$c = undefined;
    /* module identifier */
    const __vue_module_identifier__$c = undefined;
    /* functional template */
    const __vue_is_functional_template__$c = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Clockpicker = normalizeComponent_1(
      { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
      __vue_inject_styles__$c,
      __vue_script__$c,
      __vue_scope_id__$c,
      __vue_is_functional_template__$c,
      __vue_module_identifier__$c,
      undefined,
      undefined
    );

  var Plugin$4 = {
    install: function install(Vue) {
      registerComponent(Vue, Clockpicker);
    }
  };
  use(Plugin$4);

  var script$d = {
    name: 'BSelect',
    components: _defineProperty({}, Icon.name, Icon),
    mixins: [FormElementMixin],
    inheritAttrs: false,
    props: {
      value: {
        type: [String, Number, Boolean, Object, Array, Function],
        default: null
      },
      placeholder: String,
      multiple: Boolean,
      nativeSize: [String, Number]
    },
    data: function data() {
      return {
        selected: this.value,
        _elementRef: 'select'
      };
    },
    computed: {
      computedValue: {
        get: function get() {
          return this.selected;
        },
        set: function set(value) {
          this.selected = value;
          this.$emit('input', value);
          !this.isValid && this.checkHtml5Validity();
        }
      },
      spanClasses: function spanClasses() {
        return [this.size, this.statusType, {
          'is-fullwidth': this.expanded,
          'is-loading': this.loading,
          'is-multiple': this.multiple,
          'is-rounded': this.rounded,
          'is-empty': this.selected === null
        }];
      }
    },
    watch: {
      /**
      * When v-model is changed:
      *   1. Set the selected option.
      *   2. If it's invalid, validate again.
      */
      value: function value(_value) {
        this.selected = _value;
        !this.isValid && this.checkHtml5Validity();
      }
    }
  };

  /* script */
  const __vue_script__$d = script$d;

  /* template */
  var __vue_render__$b = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"control",class:{ 'is-expanded': _vm.expanded, 'has-icons-left': _vm.icon }},[_c('span',{staticClass:"select",class:_vm.spanClasses},[_c('select',_vm._b({directives:[{name:"model",rawName:"v-model",value:(_vm.computedValue),expression:"computedValue"}],ref:"select",attrs:{"multiple":_vm.multiple,"size":_vm.nativeSize},on:{"blur":function($event){_vm.$emit('blur', $event) && _vm.checkHtml5Validity();},"focus":function($event){_vm.$emit('focus', $event);},"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.computedValue=$event.target.multiple ? $$selectedVal : $$selectedVal[0];}}},'select',_vm.$attrs,false),[(_vm.placeholder)?[(_vm.computedValue == null)?_c('option',{attrs:{"disabled":"","hidden":""},domProps:{"value":null}},[_vm._v("\n                    "+_vm._s(_vm.placeholder)+"\n                ")]):_vm._e()]:_vm._e(),_vm._v(" "),_vm._t("default")],2)]),_vm._v(" "),(_vm.icon)?_c('b-icon',{staticClass:"is-left",attrs:{"icon":_vm.icon,"pack":_vm.iconPack,"size":_vm.iconSize}}):_vm._e()],1)};
  var __vue_staticRenderFns__$b = [];

    /* style */
    const __vue_inject_styles__$d = undefined;
    /* scoped */
    const __vue_scope_id__$d = undefined;
    /* module identifier */
    const __vue_module_identifier__$d = undefined;
    /* functional template */
    const __vue_is_functional_template__$d = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Select = normalizeComponent_1(
      { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
      __vue_inject_styles__$d,
      __vue_script__$d,
      __vue_scope_id__$d,
      __vue_is_functional_template__$d,
      __vue_module_identifier__$d,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$e = {
    name: 'BDatepickerTableRow',
    props: {
      selectedDate: {
        type: [Date, Array]
      },
      hoveredDateRange: Array,
      week: {
        type: Array,
        required: true
      },
      month: {
        type: Number,
        required: true
      },
      minDate: Date,
      maxDate: Date,
      disabled: Boolean,
      unselectableDates: Array,
      unselectableDaysOfWeek: Array,
      selectableDates: Array,
      events: Array,
      indicators: String,
      dateCreator: Function,
      nearbyMonthDays: Boolean,
      nearbySelectableMonthDays: Boolean,
      showWeekNumber: {
        type: Boolean,
        default: function _default() {
          return false;
        }
      },
      range: Boolean,
      multiple: Boolean,
      rulesForFirstWeek: {
        type: Number,
        default: function _default() {
          return 4;
        }
      },
      firstDayOfWeek: Number
    },
    methods: {
      firstWeekOffset: function firstWeekOffset(year, dow, doy) {
        // first-week day -- which january is always in the first week (4 for iso, 1 for other)
        var fwd = 7 + dow - doy; // first-week day local weekday -- which local weekday is fwd

        var firstJanuary = new Date(year, 0, fwd);
        var fwdlw = (7 + firstJanuary.getDay() - dow) % 7;
        return -fwdlw + fwd - 1;
      },
      daysInYear: function daysInYear(year) {
        return this.isLeapYear(year) ? 366 : 365;
      },
      isLeapYear: function isLeapYear(year) {
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
      },
      getSetDayOfYear: function getSetDayOfYear(input) {
        return Math.round((input - new Date(input.getFullYear(), 0, 1)) / 864e5) + 1;
      },
      weeksInYear: function weeksInYear(year, dow, doy) {
        var weekOffset = this.firstWeekOffset(year, dow, doy);
        var weekOffsetNext = this.firstWeekOffset(year + 1, dow, doy);
        return (this.daysInYear(year) - weekOffset + weekOffsetNext) / 7;
      },
      getWeekNumber: function getWeekNumber(mom) {
        var dow = this.firstDayOfWeek; // first day of week
        // Rules for the first week : 1 for the 1st January, 4 for the 4th January

        var doy = this.rulesForFirstWeek;
        var weekOffset = this.firstWeekOffset(mom.getFullYear(), dow, doy);
        var week = Math.floor((this.getSetDayOfYear(mom) - weekOffset - 1) / 7) + 1;
        var resWeek;
        var resYear;

        if (week < 1) {
          resYear = mom.getFullYear() - 1;
          resWeek = week + this.weeksInYear(resYear, dow, doy);
        } else if (week > this.weeksInYear(mom.getFullYear(), dow, doy)) {
          resWeek = week - this.weeksInYear(mom.getFullYear(), dow, doy);
          resYear = mom.getFullYear() + 1;
        } else {
          resYear = mom.getFullYear();
          resWeek = week;
        }

        return resWeek;
      },

      /*
      * Check that selected day is within earliest/latest params and
      * is within this month
      */
      selectableDate: function selectableDate(day) {
        var validity = [];

        if (this.minDate) {
          validity.push(day >= this.minDate);
        }

        if (this.maxDate) {
          validity.push(day <= this.maxDate);
        }

        if (this.nearbyMonthDays && !this.nearbySelectableMonthDays) {
          validity.push(day.getMonth() === this.month);
        }

        if (this.selectableDates) {
          for (var i = 0; i < this.selectableDates.length; i++) {
            var enabledDate = this.selectableDates[i];

            if (day.getDate() === enabledDate.getDate() && day.getFullYear() === enabledDate.getFullYear() && day.getMonth() === enabledDate.getMonth()) {
              return true;
            } else {
              validity.push(false);
            }
          }
        }

        if (this.unselectableDates) {
          for (var _i = 0; _i < this.unselectableDates.length; _i++) {
            var disabledDate = this.unselectableDates[_i];
            validity.push(day.getDate() !== disabledDate.getDate() || day.getFullYear() !== disabledDate.getFullYear() || day.getMonth() !== disabledDate.getMonth());
          }
        }

        if (this.unselectableDaysOfWeek) {
          for (var _i2 = 0; _i2 < this.unselectableDaysOfWeek.length; _i2++) {
            var dayOfWeek = this.unselectableDaysOfWeek[_i2];
            validity.push(day.getDay() !== dayOfWeek);
          }
        }

        return validity.indexOf(false) < 0;
      },

      /*
      * Emit select event with chosen date as payload
      */
      emitChosenDate: function emitChosenDate(day) {
        if (this.disabled) return;

        if (this.selectableDate(day)) {
          this.$emit('select', day);
        }
      },
      eventsDateMatch: function eventsDateMatch(day) {
        if (!this.events || !this.events.length) return false;
        var dayEvents = [];

        for (var i = 0; i < this.events.length; i++) {
          if (this.events[i].date.getDay() === day.getDay()) {
            dayEvents.push(this.events[i]);
          }
        }

        if (!dayEvents.length) {
          return false;
        }

        return dayEvents;
      },

      /*
      * Build classObject for cell using validations
      */
      classObject: function classObject(day) {
        function dateMatch(dateOne, dateTwo, multiple) {
          // if either date is null or undefined, return false
          // if using multiple flag, return false
          if (!dateOne || !dateTwo || multiple) {
            return false;
          }

          if (Array.isArray(dateTwo)) {
            return dateTwo.some(function (date) {
              return dateOne.getDate() === date.getDate() && dateOne.getFullYear() === date.getFullYear() && dateOne.getMonth() === date.getMonth();
            });
          }

          return dateOne.getDate() === dateTwo.getDate() && dateOne.getFullYear() === dateTwo.getFullYear() && dateOne.getMonth() === dateTwo.getMonth();
        }

        function dateWithin(dateOne, dates, multiple) {
          if (!Array.isArray(dates) || multiple) {
            return false;
          }

          return dateOne > dates[0] && dateOne < dates[1];
        }

        return {
          'is-selected': dateMatch(day, this.selectedDate) || dateWithin(day, this.selectedDate, this.multiple),
          'is-first-selected': dateMatch(day, Array.isArray(this.selectedDate) && this.selectedDate[0], this.multiple),
          'is-within-selected': dateWithin(day, this.selectedDate, this.multiple),
          'is-last-selected': dateMatch(day, Array.isArray(this.selectedDate) && this.selectedDate[1], this.multiple),
          'is-within-hovered-range': this.hoveredDateRange && this.hoveredDateRange.length === 2 && (dateMatch(day, this.hoveredDateRange) || dateWithin(day, this.hoveredDateRange)),
          'is-first-hovered': dateMatch(day, Array.isArray(this.hoveredDateRange) && this.hoveredDateRange[0]),
          'is-within-hovered': dateWithin(day, this.hoveredDateRange),
          'is-last-hovered': dateMatch(day, Array.isArray(this.hoveredDateRange) && this.hoveredDateRange[1]),
          'is-today': dateMatch(day, this.dateCreator()),
          'is-selectable': this.selectableDate(day) && !this.disabled,
          'is-unselectable': !this.selectableDate(day) || this.disabled,
          'is-invisible': !this.nearbyMonthDays && day.getMonth() !== this.month,
          'is-nearby': this.nearbySelectableMonthDays && day.getMonth() !== this.month
        };
      },
      setRangeHoverEndDate: function setRangeHoverEndDate(day) {
        if (this.range) {
          this.$emit('rangeHoverEndDate', day);
        }
      }
    }
  };

  /* script */
  const __vue_script__$e = script$e;

  /* template */
  var __vue_render__$c = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"datepicker-row"},[(_vm.showWeekNumber)?_c('a',{staticClass:"datepicker-cell is-week-number"},[_vm._v("\n        "+_vm._s(_vm.getWeekNumber(_vm.week[6]))+"\n    ")]):_vm._e(),_vm._v(" "),_vm._l((_vm.week),function(day,index){return [(_vm.selectableDate(day) && !_vm.disabled)?_c('a',{key:index,staticClass:"datepicker-cell",class:[_vm.classObject(day), {'has-event': _vm.eventsDateMatch(day)}, _vm.indicators],attrs:{"role":"button","href":"#","disabled":_vm.disabled},on:{"click":function($event){$event.preventDefault();_vm.emitChosenDate(day);},"keydown":[function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }$event.preventDefault();_vm.emitChosenDate(day);},function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"space",32,$event.key)){ return null; }$event.preventDefault();_vm.emitChosenDate(day);}],"mouseenter":function($event){_vm.setRangeHoverEndDate(day);}}},[_vm._v("\n            "+_vm._s(day.getDate())+"\n            "),(_vm.eventsDateMatch(day))?_c('div',{staticClass:"events"},_vm._l((_vm.eventsDateMatch(day)),function(event,index){return _c('div',{key:index,staticClass:"event",class:event.type})})):_vm._e()]):_c('div',{key:index,staticClass:"datepicker-cell",class:_vm.classObject(day)},[_vm._v("\n            "+_vm._s(day.getDate())+"\n        ")])]})],2)};
  var __vue_staticRenderFns__$c = [];

    /* style */
    const __vue_inject_styles__$e = undefined;
    /* scoped */
    const __vue_scope_id__$e = undefined;
    /* module identifier */
    const __vue_module_identifier__$e = undefined;
    /* functional template */
    const __vue_is_functional_template__$e = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var DatepickerTableRow = normalizeComponent_1(
      { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
      __vue_inject_styles__$e,
      __vue_script__$e,
      __vue_scope_id__$e,
      __vue_is_functional_template__$e,
      __vue_module_identifier__$e,
      undefined,
      undefined
    );

  var isDefined = function isDefined(d) {
    return d !== undefined;
  };

  var script$f = {
    name: 'BDatepickerTable',
    components: _defineProperty({}, DatepickerTableRow.name, DatepickerTableRow),
    props: {
      value: {
        type: [Date, Array]
      },
      dayNames: Array,
      monthNames: Array,
      firstDayOfWeek: Number,
      events: Array,
      indicators: String,
      minDate: Date,
      maxDate: Date,
      focused: Object,
      disabled: Boolean,
      dateCreator: Function,
      unselectableDates: Array,
      unselectableDaysOfWeek: Array,
      selectableDates: Array,
      nearbyMonthDays: Boolean,
      nearbySelectableMonthDays: Boolean,
      showWeekNumber: {
        type: Boolean,
        default: function _default() {
          return false;
        }
      },
      rulesForFirstWeek: {
        type: Number,
        default: function _default() {
          return 4;
        }
      },
      range: Boolean,
      multiple: Boolean
    },
    data: function data() {
      return {
        selectedBeginDate: undefined,
        selectedEndDate: undefined,
        hoveredEndDate: undefined,
        multipleSelectedDates: []
      };
    },
    computed: {
      visibleDayNames: function visibleDayNames() {
        var visibleDayNames = [];
        var index = this.firstDayOfWeek;

        while (visibleDayNames.length < this.dayNames.length) {
          var currentDayName = this.dayNames[index % this.dayNames.length];
          visibleDayNames.push(currentDayName);
          index++;
        }

        if (this.showWeekNumber) visibleDayNames.unshift('');
        return visibleDayNames;
      },
      hasEvents: function hasEvents() {
        return this.events && this.events.length;
      },

      /*
      * Return array of all events in the specified month
      */
      eventsInThisMonth: function eventsInThisMonth() {
        if (!this.events) return [];
        var monthEvents = [];

        for (var i = 0; i < this.events.length; i++) {
          var event = this.events[i];

          if (!event.hasOwnProperty('date')) {
            event = {
              date: event
            };
          }

          if (!event.hasOwnProperty('type')) {
            event.type = 'is-primary';
          }

          if (event.date.getMonth() === this.focused.month && event.date.getFullYear() === this.focused.year) {
            monthEvents.push(event);
          }
        }

        return monthEvents;
      },

      /*
      * Return array of all weeks in the specified month
      */
      weeksInThisMonth: function weeksInThisMonth() {
        var month = this.focused.month;
        var year = this.focused.year;
        var weeksInThisMonth = [];
        var startingDay = 1;

        while (weeksInThisMonth.length < 6) {
          var newWeek = this.weekBuilder(startingDay, month, year);
          weeksInThisMonth.push(newWeek);
          startingDay += 7;
        }

        return weeksInThisMonth;
      },
      hoveredDateRange: function hoveredDateRange() {
        if (!this.range) {
          return [];
        }

        if (!isNaN(this.selectedEndDate)) {
          return [];
        }

        if (this.hoveredEndDate < this.selectedBeginDate) {
          return [this.hoveredEndDate, this.selectedBeginDate].filter(isDefined);
        }

        return [this.selectedBeginDate, this.hoveredEndDate].filter(isDefined);
      }
    },
    methods: {
      /*
      * Emit input event with selected date as payload for v-model in parent
      */
      updateSelectedDate: function updateSelectedDate(date) {
        if (!this.range && !this.multiple) {
          this.$emit('input', date);
        } else if (this.range) {
          this.handleSelectRangeDate(date);
        } else if (this.multiple) {
          this.handleSelectMultipleDates(date);
        }
      },

      /*
      * If both begin and end dates are set, reset the end date and set the begin date.
      * If only begin date is selected, emit an array of the begin date and the new date.
      * If not set, only set the begin date.
      */
      handleSelectRangeDate: function handleSelectRangeDate(date) {
        if (this.selectedBeginDate && this.selectedEndDate) {
          this.selectedBeginDate = date;
          this.selectedEndDate = undefined;
        } else if (this.selectedBeginDate && !this.selectedEndDate) {
          if (this.selectedBeginDate > date) {
            this.selectedEndDate = this.selectedBeginDate;
            this.selectedBeginDate = date;
          } else {
            this.selectedEndDate = date;
          }

          this.$emit('input', [this.selectedBeginDate, this.selectedEndDate]);
        } else {
          this.selectedBeginDate = date;
        }
      },

      /*
      * If selected date already exists list of selected dates, remove it from the list
      * Otherwise, add date to list of selected dates
      */
      handleSelectMultipleDates: function handleSelectMultipleDates(date) {
        if (this.multipleSelectedDates.find(function (selectedDate) {
          return selectedDate.valueOf() === date.valueOf();
        })) {
          this.multipleSelectedDates = this.multipleSelectedDates.filter(function (selectedDate) {
            return selectedDate.valueOf() !== date.valueOf();
          });
        } else {
          this.multipleSelectedDates.push(date);
        }

        this.$emit('input', this.multipleSelectedDates);
      },

      /*
      * Return array of all days in the week that the startingDate is within
      */
      weekBuilder: function weekBuilder(startingDate, month, year) {
        var thisMonth = new Date(year, month);
        var thisWeek = [];
        var dayOfWeek = new Date(year, month, startingDate).getDay();
        var end = dayOfWeek >= this.firstDayOfWeek ? dayOfWeek - this.firstDayOfWeek : 7 - this.firstDayOfWeek + dayOfWeek;
        var daysAgo = 1;

        for (var i = 0; i < end; i++) {
          thisWeek.unshift(new Date(thisMonth.getFullYear(), thisMonth.getMonth(), startingDate - daysAgo));
          daysAgo++;
        }

        thisWeek.push(new Date(year, month, startingDate));
        var daysForward = 1;

        while (thisWeek.length < 7) {
          thisWeek.push(new Date(year, month, startingDate + daysForward));
          daysForward++;
        }

        return thisWeek;
      },
      eventsInThisWeek: function eventsInThisWeek(week) {
        return this.eventsInThisMonth.filter(function (event) {
          var stripped = new Date(Date.parse(event.date));
          stripped.setHours(0, 0, 0, 0);
          var timed = stripped.getTime();
          return week.some(function (weekDate) {
            return weekDate.getTime() === timed;
          });
        });
      },
      setRangeHoverEndDate: function setRangeHoverEndDate(day) {
        this.hoveredEndDate = day;
      }
    }
  };

  /* script */
  const __vue_script__$f = script$f;

  /* template */
  var __vue_render__$d = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{staticClass:"datepicker-table"},[_c('header',{staticClass:"datepicker-header"},_vm._l((_vm.visibleDayNames),function(day,index){return _c('div',{key:index,staticClass:"datepicker-cell"},[_vm._v("\n            "+_vm._s(day)+"\n        ")])})),_vm._v(" "),_c('div',{staticClass:"datepicker-body",class:{'has-events':_vm.hasEvents}},_vm._l((_vm.weeksInThisMonth),function(week,index){return _c('b-datepicker-table-row',{key:index,attrs:{"selected-date":_vm.value,"week":week,"month":_vm.focused.month,"min-date":_vm.minDate,"max-date":_vm.maxDate,"disabled":_vm.disabled,"unselectable-dates":_vm.unselectableDates,"unselectable-days-of-week":_vm.unselectableDaysOfWeek,"selectable-dates":_vm.selectableDates,"events":_vm.eventsInThisWeek(week),"indicators":_vm.indicators,"date-creator":_vm.dateCreator,"nearby-month-days":_vm.nearbyMonthDays,"nearby-selectable-month-days":_vm.nearbySelectableMonthDays,"show-week-number":_vm.showWeekNumber,"first-day-of-week":_vm.firstDayOfWeek,"rules-for-first-week":_vm.rulesForFirstWeek,"range":_vm.range,"hovered-date-range":_vm.hoveredDateRange,"multiple":_vm.multiple},on:{"select":_vm.updateSelectedDate,"rangeHoverEndDate":_vm.setRangeHoverEndDate}})}))])};
  var __vue_staticRenderFns__$d = [];

    /* style */
    const __vue_inject_styles__$f = undefined;
    /* scoped */
    const __vue_scope_id__$f = undefined;
    /* module identifier */
    const __vue_module_identifier__$f = undefined;
    /* functional template */
    const __vue_is_functional_template__$f = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var DatepickerTable = normalizeComponent_1(
      { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
      __vue_inject_styles__$f,
      __vue_script__$f,
      __vue_scope_id__$f,
      __vue_is_functional_template__$f,
      __vue_module_identifier__$f,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$g = {
    name: 'BDatepickerMonth',
    props: {
      value: Date,
      monthNames: Array,
      events: Array,
      indicators: String,
      minDate: Date,
      maxDate: Date,
      focused: Object,
      disabled: Boolean,
      dateCreator: Function,
      unselectableDates: Array,
      unselectableDaysOfWeek: Array,
      selectableDates: Array
    },
    computed: {
      hasEvents: function hasEvents() {
        return this.events && this.events.length;
      },

      /*
      * Return array of all events in the specified month
      */
      eventsInThisYear: function eventsInThisYear() {
        if (!this.events) return [];
        var yearEvents = [];

        for (var i = 0; i < this.events.length; i++) {
          var event = this.events[i];

          if (!event.hasOwnProperty('date')) {
            event = {
              date: event
            };
          }

          if (!event.hasOwnProperty('type')) {
            event.type = 'is-primary';
          }

          if (event.date.getFullYear() === this.focused.year) {
            yearEvents.push(event);
          }
        }

        return yearEvents;
      },
      monthDates: function monthDates() {
        var year = this.focused.year;
        var months = [];

        for (var i = 0; i < 12; i++) {
          var d = new Date(year, i, 1);
          d.setHours(0, 0, 0, 0);
          months.push(d);
        }

        return months;
      }
    },
    methods: {
      selectableDate: function selectableDate(day) {
        var validity = [];

        if (this.minDate) {
          validity.push(day >= this.minDate);
        }

        if (this.maxDate) {
          validity.push(day <= this.maxDate);
        }

        validity.push(day.getFullYear() === this.focused.year);

        if (this.selectableDates) {
          for (var i = 0; i < this.selectableDates.length; i++) {
            var enabledDate = this.selectableDates[i];

            if (day.getFullYear() === enabledDate.getFullYear() && day.getMonth() === enabledDate.getMonth()) {
              return true;
            } else {
              validity.push(false);
            }
          }
        }

        if (this.unselectableDates) {
          for (var _i = 0; _i < this.unselectableDates.length; _i++) {
            var disabledDate = this.unselectableDates[_i];
            validity.push(day.getFullYear() !== disabledDate.getFullYear() || day.getMonth() !== disabledDate.getMonth());
          }
        }

        if (this.unselectableDaysOfWeek) {
          for (var _i2 = 0; _i2 < this.unselectableDaysOfWeek.length; _i2++) {
            var dayOfWeek = this.unselectableDaysOfWeek[_i2];
            validity.push(day.getDay() !== dayOfWeek);
          }
        }

        return validity.indexOf(false) < 0;
      },
      eventsDateMatch: function eventsDateMatch(day) {
        if (!this.eventsInThisYear.length) return false;
        var monthEvents = [];

        for (var i = 0; i < this.eventsInThisYear.length; i++) {
          if (this.eventsInThisYear[i].date.getMonth() === day.getMonth()) {
            monthEvents.push(this.events[i]);
          }
        }

        if (!monthEvents.length) {
          return false;
        }

        return monthEvents;
      },

      /*
      * Build classObject for cell using validations
      */
      classObject: function classObject(day) {
        function dateMatch(dateOne, dateTwo) {
          // if either date is null or undefined, return false
          if (!dateOne || !dateTwo) {
            return false;
          }

          return dateOne.getFullYear() === dateTwo.getFullYear() && dateOne.getMonth() === dateTwo.getMonth();
        }

        return {
          'is-selected': dateMatch(day, this.value),
          'is-today': dateMatch(day, this.dateCreator()),
          'is-selectable': this.selectableDate(day) && !this.disabled,
          'is-unselectable': !this.selectableDate(day) || this.disabled
        };
      },

      /*
      * Emit select event with chosen date as payload
      */
      emitChosenDate: function emitChosenDate(day) {
        if (this.disabled) return;

        if (this.selectableDate(day)) {
          this.$emit('input', day);
        }
      }
    }
  };

  /* script */
  const __vue_script__$g = script$g;

  /* template */
  var __vue_render__$e = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{staticClass:"datepicker-table"},[_c('div',{staticClass:"datepicker-body",class:{'has-events':_vm.hasEvents}},[_c('div',{staticClass:"datepicker-months"},[_vm._l((_vm.monthDates),function(date,index){return [(_vm.selectableDate(date) && !_vm.disabled)?_c('a',{key:index,staticClass:"datepicker-cell",class:[
                          _vm.classObject(date),
                          {'has-event': _vm.eventsDateMatch(date)},
                          _vm.indicators
                      ],attrs:{"role":"button","href":"#","disabled":_vm.disabled},on:{"click":function($event){$event.preventDefault();_vm.emitChosenDate(date);},"keydown":[function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }$event.preventDefault();_vm.emitChosenDate(date);},function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"space",32,$event.key)){ return null; }$event.preventDefault();_vm.emitChosenDate(date);}]}},[_vm._v("\n                    "+_vm._s(_vm.monthNames[date.getMonth()])+"\n                    "),(_vm.eventsDateMatch(date))?_c('div',{staticClass:"events"},_vm._l((_vm.eventsDateMatch(date)),function(event,index){return _c('div',{key:index,staticClass:"event",class:event.type})})):_vm._e()]):_c('div',{key:index,staticClass:"datepicker-cell",class:_vm.classObject(date)},[_vm._v("\n                    "+_vm._s(_vm.monthNames[date.getMonth()])+"\n                ")])]})],2)])])};
  var __vue_staticRenderFns__$e = [];

    /* style */
    const __vue_inject_styles__$g = undefined;
    /* scoped */
    const __vue_scope_id__$g = undefined;
    /* module identifier */
    const __vue_module_identifier__$g = undefined;
    /* functional template */
    const __vue_is_functional_template__$g = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var DatepickerMonth = normalizeComponent_1(
      { render: __vue_render__$e, staticRenderFns: __vue_staticRenderFns__$e },
      __vue_inject_styles__$g,
      __vue_script__$g,
      __vue_scope_id__$g,
      __vue_is_functional_template__$g,
      __vue_module_identifier__$g,
      undefined,
      undefined
    );

  var _components$1;

  var defaultDateFormatter = function defaultDateFormatter(date, vm) {
    var targetDates = Array.isArray(date) ? date : [date];
    var dates = targetDates.map(function (date) {
      var yyyyMMdd = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
      var d = new Date(yyyyMMdd);
      return !vm.isTypeMonth ? d.toLocaleDateString() : d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit'
      });
    });
    return !vm.multiple ? dates.join(' - ') : dates.join(', ');
  };

  var defaultDateParser = function defaultDateParser(date, vm) {
    if (!vm.isTypeMonth) return new Date(Date.parse(date));

    if (date) {
      var s = date.split('/');
      var year = s[0].length === 4 ? s[0] : s[1];
      var month = s[0].length === 2 ? s[0] : s[1];

      if (year && month) {
        return new Date(parseInt(year, 10), parseInt(month - 1, 10), 1, 0, 0, 0, 0);
      }
    }

    return null;
  };

  var script$h = {
    name: 'BDatepicker',
    components: (_components$1 = {}, _defineProperty(_components$1, DatepickerTable.name, DatepickerTable), _defineProperty(_components$1, DatepickerMonth.name, DatepickerMonth), _defineProperty(_components$1, Input.name, Input), _defineProperty(_components$1, Field.name, Field), _defineProperty(_components$1, Select.name, Select), _defineProperty(_components$1, Icon.name, Icon), _defineProperty(_components$1, Dropdown.name, Dropdown), _defineProperty(_components$1, DropdownItem.name, DropdownItem), _components$1),
    mixins: [FormElementMixin],
    inheritAttrs: false,
    props: {
      value: {
        type: [Date, Array]
      },
      dayNames: {
        type: Array,
        default: function _default() {
          if (Array.isArray(config$1.defaultDayNames)) {
            return config$1.defaultDayNames;
          } else {
            return ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'S'];
          }
        }
      },
      monthNames: {
        type: Array,
        default: function _default() {
          if (Array.isArray(config$1.defaultMonthNames)) {
            return config$1.defaultMonthNames;
          } else {
            return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          }
        }
      },
      firstDayOfWeek: {
        type: Number,
        default: function _default() {
          if (typeof config$1.defaultFirstDayOfWeek === 'number') {
            return config$1.defaultFirstDayOfWeek;
          } else {
            return 0;
          }
        }
      },
      inline: Boolean,
      minDate: Date,
      maxDate: Date,
      focusedDate: Date,
      placeholder: String,
      editable: Boolean,
      disabled: Boolean,
      unselectableDates: Array,
      unselectableDaysOfWeek: {
        type: Array,
        default: function _default() {
          return config$1.defaultUnselectableDaysOfWeek;
        }
      },
      selectableDates: Array,
      dateFormatter: {
        type: Function,
        default: function _default(date, vm) {
          if (typeof config$1.defaultDateFormatter === 'function') {
            return config$1.defaultDateFormatter(date);
          } else {
            return defaultDateFormatter(date, vm);
          }
        }
      },
      dateParser: {
        type: Function,
        default: function _default(date, vm) {
          if (typeof config$1.defaultDateParser === 'function') {
            return config$1.defaultDateParser(date);
          } else {
            return defaultDateParser(date, vm);
          }
        }
      },
      dateCreator: {
        type: Function,
        default: function _default() {
          if (typeof config$1.defaultDateCreator === 'function') {
            return config$1.defaultDateCreator();
          } else {
            return new Date();
          }
        }
      },
      mobileNative: {
        type: Boolean,
        default: function _default() {
          return config$1.defaultDatepickerMobileNative;
        }
      },
      position: String,
      events: Array,
      indicators: {
        type: String,
        default: 'dots'
      },
      openOnFocus: Boolean,
      iconPrev: {
        type: String,
        default: config$1.defaultIconPrev
      },
      iconNext: {
        type: String,
        default: config$1.defaultIconNext
      },
      yearsRange: {
        type: Array,
        default: function _default() {
          return config$1.defaultDatepickerYearsRange;
        }
      },
      type: {
        type: String,
        validator: function validator(value) {
          return ['month'].indexOf(value) >= 0;
        }
      },
      nearbyMonthDays: {
        type: Boolean,
        default: function _default() {
          return config$1.defaultDatepickerNearbyMonthDays;
        }
      },
      nearbySelectableMonthDays: {
        type: Boolean,
        default: function _default() {
          return config$1.defaultDatepickerNearbySelectableMonthDays;
        }
      },
      showWeekNumber: {
        type: Boolean,
        default: function _default() {
          return config$1.defaultDatepickerShowWeekNumber;
        }
      },
      rulesForFirstWeek: {
        type: Number,
        default: function _default() {
          return 4;
        }
      },
      range: {
        type: Boolean,
        default: false
      },
      closeOnClick: {
        type: Boolean,
        default: true
      },
      multiple: {
        type: Boolean,
        default: false
      }
    },
    data: function data() {
      var focusedDate = (Array.isArray(this.value) ? this.value[0] : this.value) || this.focusedDate || this.dateCreator();
      return {
        dateSelected: this.value,
        focusedDateData: {
          month: focusedDate.getMonth(),
          year: focusedDate.getFullYear()
        },
        _elementRef: 'input',
        _isDatepicker: true
      };
    },
    computed: {
      computedValue: {
        get: function get() {
          return this.dateSelected;
        },
        set: function set(value) {
          this.updateInternalState(value);
          if (!this.multiple) this.togglePicker(false);
          this.$emit('input', value);
        }
      },

      /*
      * Returns an array of years for the year dropdown. If earliest/latest
      * dates are set by props, range of years will fall within those dates.
      */
      listOfYears: function listOfYears() {
        var latestYear = this.focusedDateData.year + this.yearsRange[1];

        if (this.maxDate && this.maxDate.getFullYear() < latestYear) {
          latestYear = Math.max(this.maxDate.getFullYear(), this.focusedDateData.year);
        }

        var earliestYear = this.focusedDateData.year + this.yearsRange[0];

        if (this.minDate && this.minDate.getFullYear() > earliestYear) {
          earliestYear = Math.min(this.minDate.getFullYear(), this.focusedDateData.year);
        }

        var arrayOfYears = [];

        for (var i = earliestYear; i <= latestYear; i++) {
          arrayOfYears.push(i);
        }

        return arrayOfYears.reverse();
      },
      showPrev: function showPrev() {
        if (!this.minDate) return false;

        if (this.isTypeMonth) {
          return this.focusedDateData.year <= this.minDate.getFullYear();
        }

        var dateToCheck = new Date(this.focusedDateData.year, this.focusedDateData.month);
        var date = new Date(this.minDate.getFullYear(), this.minDate.getMonth());
        return dateToCheck <= date;
      },
      showNext: function showNext() {
        if (!this.maxDate) return false;

        if (this.isTypeMonth) {
          return this.focusedDateData.year >= this.maxDate.getFullYear();
        }

        var dateToCheck = new Date(this.focusedDateData.year, this.focusedDateData.month);
        var date = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth());
        return dateToCheck >= date;
      },
      isMobile: function isMobile$1() {
        return this.mobileNative && isMobile.any();
      },
      isTypeMonth: function isTypeMonth() {
        return this.type === 'month';
      }
    },
    watch: {
      /**
      * When v-model is changed:
      *   1. Update internal value.
      *   2. If it's invalid, validate again.
      */
      value: function value(_value) {
        this.updateInternalState(_value);
        if (!this.multiple) this.togglePicker(false);
        !this.isValid && this.$refs.input.checkHtml5Validity();
      },
      focusedDate: function focusedDate(value) {
        if (value) {
          this.focusedDateData = {
            month: value.getMonth(),
            year: value.getFullYear()
          };
        }
      },

      /*
      * Emit input event on month and/or year change
      */
      'focusedDateData.month': function focusedDateDataMonth(value) {
        this.$emit('change-month', value);
      },
      'focusedDateData.year': function focusedDateDataYear(value) {
        this.$emit('change-year', value);
      }
    },
    methods: {
      /*
      * Parse string into date
      */
      onChange: function onChange(value) {
        var date = this.dateParser(value, this);

        if (date && (!isNaN(date) || Array.isArray(date) && date.length === 2 && !isNaN(date[0]) && !isNaN(date[1]))) {
          this.computedValue = date;
        } else {
          // Force refresh input value when not valid date
          this.computedValue = null;
          this.$refs.input.newValue = this.computedValue;
        }
      },

      /*
      * Format date into string
      */
      formatValue: function formatValue(value) {
        if (Array.isArray(value)) {
          var isArrayWithValidDates = Array.isArray(value) && value.every(function (v) {
            return !isNaN(v);
          });
          return isArrayWithValidDates ? this.dateFormatter(value, this) : null;
        }

        return value && !isNaN(value) ? this.dateFormatter(value, this) : null;
      },

      /*
      * Either decrement month by 1 if not January or decrement year by 1
      * and set month to 11 (December) or decrement year when 'month'
      */
      prev: function prev() {
        if (this.disabled) return;

        if (this.isTypeMonth) {
          this.focusedDateData.year -= 1;
        } else {
          if (this.focusedDateData.month > 0) {
            this.focusedDateData.month -= 1;
          } else {
            this.focusedDateData.month = 11;
            this.focusedDateData.year -= 1;
          }
        }
      },

      /*
      * Either increment month by 1 if not December or increment year by 1
      * and set month to 0 (January) or increment year when 'month'
      */
      next: function next() {
        if (this.disabled) return;

        if (this.isTypeMonth) {
          this.focusedDateData.year += 1;
        } else {
          if (this.focusedDateData.month < 11) {
            this.focusedDateData.month += 1;
          } else {
            this.focusedDateData.month = 0;
            this.focusedDateData.year += 1;
          }
        }
      },
      formatNative: function formatNative(value) {
        return this.isTypeMonth ? this.formatYYYYMM(value) : this.formatYYYYMMDD(value);
      },

      /*
      * Format date into string 'YYYY-MM-DD'
      */
      formatYYYYMMDD: function formatYYYYMMDD(value) {
        var date = new Date(value);

        if (value && !isNaN(date)) {
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var day = date.getDate();
          return year + '-' + ((month < 10 ? '0' : '') + month) + '-' + ((day < 10 ? '0' : '') + day);
        }

        return '';
      },

      /*
      * Format date into string 'YYYY-MM'
      */
      formatYYYYMM: function formatYYYYMM(value) {
        var date = new Date(value);

        if (value && !isNaN(date)) {
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          return year + '-' + ((month < 10 ? '0' : '') + month);
        }

        return '';
      },

      /*
      * Parse date from string
      */
      onChangeNativePicker: function onChangeNativePicker(event) {
        var date = event.target.value;
        this.computedValue = date ? new Date(date + 'T00:00:00') : null;
      },
      updateInternalState: function updateInternalState(value) {
        var currentDate = Array.isArray(value) ? !value.length ? this.dateCreator() : value[0] : !value ? this.dateCreator() : value;
        this.focusedDateData = {
          month: currentDate.getMonth(),
          year: currentDate.getFullYear()
        };
        this.dateSelected = value;
      },

      /*
      * Toggle datepicker
      */
      togglePicker: function togglePicker(active) {
        if (this.$refs.dropdown) {
          if (this.closeOnClick) {
            this.$refs.dropdown.isActive = typeof active === 'boolean' ? active : !this.$refs.dropdown.isActive;
          }
        }
      },

      /*
      * Call default onFocus method and show datepicker
      */
      handleOnFocus: function handleOnFocus(event) {
        this.onFocus(event);

        if (this.openOnFocus) {
          this.togglePicker(true);
        }
      },

      /*
      * Toggle dropdown
      */
      toggle: function toggle() {
        if (this.mobileNative && this.isMobile) {
          var input = this.$refs.input.$refs.input;
          input.focus();
          input.click();
          return;
        }

        this.$refs.dropdown.toggle();
      },

      /*
      * Avoid dropdown toggle when is already visible
      */
      onInputClick: function onInputClick(event) {
        if (this.$refs.dropdown.isActive) {
          event.stopPropagation();
        }
      },

      /**
       * Keypress event that is bound to the document.
       */
      keyPress: function keyPress(event) {
        // Esc key
        if (this.$refs.dropdown && this.$refs.dropdown.isActive && event.keyCode === 27) {
          this.togglePicker(false);
        }
      }
    },
    created: function created() {
      if (typeof window !== 'undefined') {
        document.addEventListener('keyup', this.keyPress);
      }
    },
    beforeDestroy: function beforeDestroy() {
      if (typeof window !== 'undefined') {
        document.removeEventListener('keyup', this.keyPress);
      }
    }
  };

  /* script */
  const __vue_script__$h = script$h;

  /* template */
  var __vue_render__$f = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"datepicker control",class:[_vm.size, {'is-expanded': _vm.expanded}]},[(!_vm.isMobile || _vm.inline)?_c('b-dropdown',{ref:"dropdown",attrs:{"position":_vm.position,"disabled":_vm.disabled,"inline":_vm.inline}},[(!_vm.inline)?_c('b-input',_vm._b({ref:"input",attrs:{"slot":"trigger","autocomplete":"off","value":_vm.formatValue(_vm.computedValue),"placeholder":_vm.placeholder,"size":_vm.size,"icon":_vm.icon,"icon-pack":_vm.iconPack,"rounded":_vm.rounded,"loading":_vm.loading,"disabled":_vm.disabled,"readonly":!_vm.editable,"use-html5-validation":_vm.useHtml5Validation},on:{"focus":_vm.handleOnFocus,"blur":_vm.onBlur},nativeOn:{"click":function($event){_vm.onInputClick($event);},"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }_vm.togglePicker(true);},"change":function($event){_vm.onChange($event.target.value);}},slot:"trigger"},'b-input',_vm.$attrs,false)):_vm._e(),_vm._v(" "),_c('b-dropdown-item',{attrs:{"disabled":_vm.disabled,"custom":""}},[_c('header',{staticClass:"datepicker-header"},[(_vm.$slots.header !== undefined && _vm.$slots.header.length)?[_vm._t("header")]:_c('div',{staticClass:"pagination field is-centered",class:_vm.size},[_c('a',{directives:[{name:"show",rawName:"v-show",value:(!_vm.showPrev && !_vm.disabled),expression:"!showPrev && !disabled"}],staticClass:"pagination-previous",attrs:{"role":"button","href":"#","disabled":_vm.disabled},on:{"click":function($event){$event.preventDefault();_vm.prev($event);},"keydown":[function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }$event.preventDefault();_vm.prev($event);},function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"space",32,$event.key)){ return null; }$event.preventDefault();_vm.prev($event);}]}},[_c('b-icon',{attrs:{"icon":_vm.iconPrev,"pack":_vm.iconPack,"both":"","type":"is-primary is-clickable"}})],1),_vm._v(" "),_c('a',{directives:[{name:"show",rawName:"v-show",value:(!_vm.showNext && !_vm.disabled),expression:"!showNext && !disabled"}],staticClass:"pagination-next",attrs:{"role":"button","href":"#","disabled":_vm.disabled},on:{"click":function($event){$event.preventDefault();_vm.next($event);},"keydown":[function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }$event.preventDefault();_vm.next($event);},function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"space",32,$event.key)){ return null; }$event.preventDefault();_vm.next($event);}]}},[_c('b-icon',{attrs:{"icon":_vm.iconNext,"pack":_vm.iconPack,"both":"","type":"is-primary is-clickable"}})],1),_vm._v(" "),_c('div',{staticClass:"pagination-list"},[_c('b-field',[(!_vm.isTypeMonth)?_c('b-select',{attrs:{"disabled":_vm.disabled,"size":_vm.size},model:{value:(_vm.focusedDateData.month),callback:function ($$v) {_vm.$set(_vm.focusedDateData, "month", $$v);},expression:"focusedDateData.month"}},_vm._l((_vm.monthNames),function(month,index){return _c('option',{key:month,domProps:{"value":index}},[_vm._v("\n                                    "+_vm._s(month)+"\n                                ")])})):_vm._e(),_vm._v(" "),_c('b-select',{attrs:{"disabled":_vm.disabled,"size":_vm.size},model:{value:(_vm.focusedDateData.year),callback:function ($$v) {_vm.$set(_vm.focusedDateData, "year", $$v);},expression:"focusedDateData.year"}},_vm._l((_vm.listOfYears),function(year){return _c('option',{key:year,domProps:{"value":year}},[_vm._v("\n                                    "+_vm._s(year)+"\n                                ")])}))],1)],1)])],2),_vm._v(" "),(!_vm.isTypeMonth)?_c('div',{staticClass:"datepicker-content"},[_c('b-datepicker-table',{attrs:{"day-names":_vm.dayNames,"month-names":_vm.monthNames,"first-day-of-week":_vm.firstDayOfWeek,"rules-for-first-week":_vm.rulesForFirstWeek,"min-date":_vm.minDate,"max-date":_vm.maxDate,"focused":_vm.focusedDateData,"disabled":_vm.disabled,"unselectable-dates":_vm.unselectableDates,"unselectable-days-of-week":_vm.unselectableDaysOfWeek,"selectable-dates":_vm.selectableDates,"events":_vm.events,"indicators":_vm.indicators,"date-creator":_vm.dateCreator,"type-month":_vm.isTypeMonth,"nearby-month-days":_vm.nearbyMonthDays,"nearby-selectable-month-days":_vm.nearbySelectableMonthDays,"show-week-number":_vm.showWeekNumber,"range":_vm.range,"multiple":_vm.multiple},on:{"close":function($event){_vm.togglePicker(false);}},model:{value:(_vm.computedValue),callback:function ($$v) {_vm.computedValue=$$v;},expression:"computedValue"}})],1):_c('div',[_c('b-datepicker-month',{attrs:{"month-names":_vm.monthNames,"min-date":_vm.minDate,"max-date":_vm.maxDate,"focused":_vm.focusedDateData,"disabled":_vm.disabled,"unselectable-dates":_vm.unselectableDates,"unselectable-days-of-week":_vm.unselectableDaysOfWeek,"selectable-dates":_vm.selectableDates,"events":_vm.events,"indicators":_vm.indicators,"date-creator":_vm.dateCreator},on:{"close":function($event){_vm.togglePicker(false);}},model:{value:(_vm.computedValue),callback:function ($$v) {_vm.computedValue=$$v;},expression:"computedValue"}})],1),_vm._v(" "),(_vm.$slots.default !== undefined && _vm.$slots.default.length)?_c('footer',{staticClass:"datepicker-footer"},[_vm._t("default")],2):_vm._e()])],1):_c('b-input',_vm._b({ref:"input",attrs:{"type":!_vm.isTypeMonth ? 'date' : 'month',"autocomplete":"off","value":_vm.formatNative(_vm.computedValue),"placeholder":_vm.placeholder,"size":_vm.size,"icon":_vm.icon,"icon-pack":_vm.iconPack,"loading":_vm.loading,"max":_vm.formatNative(_vm.maxDate),"min":_vm.formatNative(_vm.minDate),"disabled":_vm.disabled,"readonly":false,"use-html5-validation":_vm.useHtml5Validation},on:{"focus":_vm.onFocus,"blur":_vm.onBlur},nativeOn:{"change":function($event){_vm.onChangeNativePicker($event);}}},'b-input',_vm.$attrs,false))],1)};
  var __vue_staticRenderFns__$f = [];

    /* style */
    const __vue_inject_styles__$h = undefined;
    /* scoped */
    const __vue_scope_id__$h = undefined;
    /* module identifier */
    const __vue_module_identifier__$h = undefined;
    /* functional template */
    const __vue_is_functional_template__$h = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Datepicker = normalizeComponent_1(
      { render: __vue_render__$f, staticRenderFns: __vue_staticRenderFns__$f },
      __vue_inject_styles__$h,
      __vue_script__$h,
      __vue_scope_id__$h,
      __vue_is_functional_template__$h,
      __vue_module_identifier__$h,
      undefined,
      undefined
    );

  var Plugin$5 = {
    install: function install(Vue) {
      registerComponent(Vue, Datepicker);
    }
  };
  use(Plugin$5);

  var _components$2;
  var script$i = {
    name: 'BTimepicker',
    components: (_components$2 = {}, _defineProperty(_components$2, Input.name, Input), _defineProperty(_components$2, Field.name, Field), _defineProperty(_components$2, Select.name, Select), _defineProperty(_components$2, Icon.name, Icon), _defineProperty(_components$2, Dropdown.name, Dropdown), _defineProperty(_components$2, DropdownItem.name, DropdownItem), _components$2),
    mixins: [TimepickerMixin],
    inheritAttrs: false,
    data: function data() {
      return {
        _isTimepicker: true
      };
    },
    computed: {
      nativeStep: function nativeStep() {
        if (this.enableSeconds) return '1';
      }
    }
  };

  /* script */
  const __vue_script__$i = script$i;

  /* template */
  var __vue_render__$g = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"timepicker control",class:[_vm.size, {'is-expanded': _vm.expanded}]},[(!_vm.isMobile || _vm.inline)?_c('b-dropdown',{ref:"dropdown",attrs:{"position":_vm.position,"disabled":_vm.disabled,"inline":_vm.inline}},[(!_vm.inline)?_c('b-input',_vm._b({ref:"input",attrs:{"slot":"trigger","autocomplete":"off","value":_vm.formatValue(_vm.computedValue),"placeholder":_vm.placeholder,"size":_vm.size,"icon":_vm.icon,"icon-pack":_vm.iconPack,"loading":_vm.loading,"disabled":_vm.disabled,"readonly":!_vm.editable,"rounded":_vm.rounded,"use-html5-validation":_vm.useHtml5Validation},on:{"focus":_vm.handleOnFocus,"blur":function($event){_vm.onBlur() && _vm.checkHtml5Validity();}},nativeOn:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }_vm.toggle(true);},"change":function($event){_vm.onChange($event.target.value);}},slot:"trigger"},'b-input',_vm.$attrs,false)):_vm._e(),_vm._v(" "),_c('b-dropdown-item',{attrs:{"disabled":_vm.disabled,"custom":""}},[_c('b-field',{attrs:{"grouped":"","position":"is-centered"}},[_c('b-select',{attrs:{"disabled":_vm.disabled,"placeholder":"00"},nativeOn:{"change":function($event){_vm.onHoursChange($event.target.value);}},model:{value:(_vm.hoursSelected),callback:function ($$v) {_vm.hoursSelected=$$v;},expression:"hoursSelected"}},_vm._l((_vm.hours),function(hour){return _c('option',{key:hour.value,attrs:{"disabled":_vm.isHourDisabled(hour.value)},domProps:{"value":hour.value}},[_vm._v("\n                        "+_vm._s(hour.label)+"\n                    ")])})),_vm._v(" "),_c('span',{staticClass:"control is-colon"},[_vm._v(":")]),_vm._v(" "),_c('b-select',{attrs:{"disabled":_vm.disabled,"placeholder":"00"},nativeOn:{"change":function($event){_vm.onMinutesChange($event.target.value);}},model:{value:(_vm.minutesSelected),callback:function ($$v) {_vm.minutesSelected=$$v;},expression:"minutesSelected"}},_vm._l((_vm.minutes),function(minute){return _c('option',{key:minute.value,attrs:{"disabled":_vm.isMinuteDisabled(minute.value)},domProps:{"value":minute.value}},[_vm._v("\n                        "+_vm._s(minute.label)+"\n                    ")])})),_vm._v(" "),(_vm.enableSeconds)?[_c('span',{staticClass:"control is-colon"},[_vm._v(":")]),_vm._v(" "),_c('b-select',{attrs:{"disabled":_vm.disabled,"placeholder":"00"},nativeOn:{"change":function($event){_vm.onSecondsChange($event.target.value);}},model:{value:(_vm.secondsSelected),callback:function ($$v) {_vm.secondsSelected=$$v;},expression:"secondsSelected"}},_vm._l((_vm.seconds),function(second){return _c('option',{key:second.value,attrs:{"disabled":_vm.isSecondDisabled(second.value)},domProps:{"value":second.value}},[_vm._v("\n                            "+_vm._s(second.label)+"\n                        ")])}))]:_vm._e(),_vm._v(" "),(!_vm.isHourFormat24)?_c('b-select',{attrs:{"disabled":_vm.disabled},nativeOn:{"change":function($event){_vm.onMeridienChange($event.target.value);}},model:{value:(_vm.meridienSelected),callback:function ($$v) {_vm.meridienSelected=$$v;},expression:"meridienSelected"}},_vm._l((_vm.meridiens),function(meridien){return _c('option',{key:meridien,domProps:{"value":meridien}},[_vm._v("\n                        "+_vm._s(meridien)+"\n                    ")])})):_vm._e()],2),_vm._v(" "),(_vm.$slots.default !== undefined && _vm.$slots.default.length)?_c('footer',{staticClass:"timepicker-footer"},[_vm._t("default")],2):_vm._e()],1)],1):_c('b-input',_vm._b({ref:"input",attrs:{"type":"time","step":_vm.nativeStep,"autocomplete":"off","value":_vm.formatHHMMSS(_vm.computedValue),"placeholder":_vm.placeholder,"size":_vm.size,"icon":_vm.icon,"icon-pack":_vm.iconPack,"loading":_vm.loading,"max":_vm.formatHHMMSS(_vm.maxTime),"min":_vm.formatHHMMSS(_vm.minTime),"disabled":_vm.disabled,"readonly":false,"use-html5-validation":_vm.useHtml5Validation},on:{"focus":_vm.handleOnFocus,"blur":function($event){_vm.onBlur() && _vm.checkHtml5Validity();}},nativeOn:{"change":function($event){_vm.onChange($event.target.value);}}},'b-input',_vm.$attrs,false))],1)};
  var __vue_staticRenderFns__$g = [];

    /* style */
    const __vue_inject_styles__$i = undefined;
    /* scoped */
    const __vue_scope_id__$i = undefined;
    /* module identifier */
    const __vue_module_identifier__$i = undefined;
    /* functional template */
    const __vue_is_functional_template__$i = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Timepicker = normalizeComponent_1(
      { render: __vue_render__$g, staticRenderFns: __vue_staticRenderFns__$g },
      __vue_inject_styles__$i,
      __vue_script__$i,
      __vue_scope_id__$i,
      __vue_is_functional_template__$i,
      __vue_module_identifier__$i,
      undefined,
      undefined
    );

  var _components$3;
  var script$j = {
    name: 'BDatetimepicker',
    components: (_components$3 = {}, _defineProperty(_components$3, Datepicker.name, Datepicker), _defineProperty(_components$3, Timepicker.name, Timepicker), _components$3),
    mixins: [FormElementMixin],
    inheritAttrs: false,
    props: {
      value: {
        type: Date
      },
      editable: {
        type: Boolean,
        default: false
      },
      placeholder: String,
      disabled: Boolean,
      icon: String,
      iconPack: String,
      inline: Boolean,
      openOnFocus: Boolean,
      position: String,
      mobileNative: {
        type: Boolean,
        default: true
      },
      minDatetime: Date,
      maxDatetime: Date,
      datetimeFormatter: {
        type: Function
      },
      datetimeParser: {
        type: Function
      },
      datetimeCreator: {
        type: Function,
        default: function _default(date) {
          if (typeof config$1.defaultDatetimeCreator === 'function') {
            return config$1.defaultDatetimeCreator(date);
          } else {
            return date;
          }
        }
      },
      datepicker: Object,
      timepicker: Object
    },
    data: function data() {
      return {
        newValue: this.value
      };
    },
    computed: {
      computedValue: {
        get: function get() {
          return this.newValue;
        },
        set: function set(value) {
          if (value) {
            var val = new Date(value.getTime());

            if (this.newValue) {
              // restore time part
              if (value.getHours() === 0 && value.getMinutes() === 0 && value.getSeconds() === 0) {
                val.setHours(this.newValue.getHours(), this.newValue.getMinutes(), this.newValue.getSeconds(), 0);
              }
            } else {
              val = this.datetimeCreator(value);
            } // check min and max range


            if (this.minDatetime && val < this.minDatetime) {
              val = this.minDatetime;
            } else if (this.maxDatetime && val > this.maxDatetime) {
              val = this.maxDatetime;
            }

            this.newValue = new Date(val.getTime());
          } else {
            this.newValue = value;
          }

          this.$emit('input', this.newValue);
        }
      },
      isMobile: function isMobile$1() {
        return this.mobileNative && isMobile.any();
      },
      minDate: function minDate() {
        if (!this.minDatetime) return null;
        return new Date(this.minDatetime.getFullYear(), this.minDatetime.getMonth(), this.minDatetime.getDate(), 0, 0, 0, 0);
      },
      maxDate: function maxDate() {
        if (!this.maxDatetime) return null;
        return new Date(this.maxDatetime.getFullYear(), this.maxDatetime.getMonth(), this.maxDatetime.getDate(), 0, 0, 0, 0);
      },
      minTime: function minTime() {
        if (!this.minDatetime) return null;
        if (this.newValue === null || typeof this.newValue === 'undefined') return null;

        if (this.minDatetime.getFullYear() === this.newValue.getFullYear() && this.minDatetime.getMonth() === this.newValue.getMonth() && this.minDatetime.getDate() === this.newValue.getDate()) {
          return this.minDatetime;
        }
      },
      maxTime: function maxTime() {
        if (!this.maxDatetime) return null;
        if (this.newValue === null || typeof this.newValue === 'undefined') return null;

        if (this.maxDatetime.getFullYear() === this.newValue.getFullYear() && this.maxDatetime.getMonth() === this.newValue.getMonth() && this.maxDatetime.getDate() === this.newValue.getDate()) {
          return this.maxDatetime;
        }
      },
      datepickerSize: function datepickerSize() {
        return this.datepicker && this.datepicker.size ? this.datepicker.size : this.size;
      },
      timepickerSize: function timepickerSize() {
        return this.timepicker && this.timepicker.size ? this.timepicker.size : this.size;
      },
      timepickerDisabled: function timepickerDisabled() {
        return this.timepicker && this.timepicker.disabled ? this.timepicker.disabled : this.disabled;
      }
    },
    watch: {
      value: function value(_value) {
        this.newValue = _value;
      }
    },
    methods: {
      defaultDatetimeParser: function defaultDatetimeParser(date) {
        if (typeof this.datetimeParser === 'function') {
          return this.datetimeParser(date);
        } else if (typeof config$1.defaultDatetimeParser === 'function') {
          return config$1.defaultDatetimeParser(date);
        } else {
          return new Date(Date.parse(date));
        }
      },
      defaultDatetimeFormatter: function defaultDatetimeFormatter(date) {
        if (typeof this.datetimeFormatter === 'function') {
          return this.datetimeFormatter(date);
        } else if (typeof config$1.defaultDatetimeParser === 'function') {
          return config$1.defaultDatetimeParser(date);
        } else {
          if (this.$refs.timepicker) {
            var yyyyMMdd = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
            var d = new Date(yyyyMMdd);
            return d.toLocaleDateString() + ' ' + this.$refs.timepicker.timeFormatter(date, this.$refs.timepicker);
          }

          return null;
        }
      },

      /*
      * Parse date from string
      */
      onChangeNativePicker: function onChangeNativePicker(event) {
        var date = event.target.value;
        this.computedValue = date ? new Date(date) : null;
      },
      formatNative: function formatNative(value) {
        var date = new Date(value);

        if (value && !isNaN(date)) {
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var day = date.getDate();
          var hours = date.getHours();
          var minutes = date.getMinutes();
          var seconds = date.getSeconds();
          return year + '-' + ((month < 10 ? '0' : '') + month) + '-' + ((day < 10 ? '0' : '') + day) + 'T' + ((hours < 10 ? '0' : '') + hours) + ':' + ((minutes < 10 ? '0' : '') + minutes) + ':' + ((seconds < 10 ? '0' : '') + seconds);
        }

        return '';
      },
      toggle: function toggle() {
        this.$refs.datepicker.toggle();
      }
    },
    mounted: function mounted() {
      // $refs attached, it's time to refresh datepicker (input)
      if (this.newValue) {
        this.$refs.datepicker.$forceUpdate();
      }
    }
  };

  /* script */
  const __vue_script__$j = script$j;

  /* template */
  var __vue_render__$h = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (!_vm.isMobile || _vm.inline)?_c('b-datepicker',_vm._b({ref:"datepicker",attrs:{"open-on-focus":_vm.openOnFocus,"position":_vm.position,"loading":_vm.loading,"inline":_vm.inline,"editable":_vm.editable,"close-on-click":false,"date-formatter":_vm.defaultDatetimeFormatter,"date-parser":_vm.defaultDatetimeParser,"min-date":_vm.minDate,"max-date":_vm.maxDate,"icon":_vm.icon,"icon-pack":_vm.iconPack,"size":_vm.datepickerSize,"range":false,"disabled":_vm.disabled,"mobile-native":_vm.mobileNative},on:{"change-month":function($event){_vm.$emit('change-month', $event);},"change-year":function($event){_vm.$emit('change-year', $event);}},model:{value:(_vm.computedValue),callback:function ($$v) {_vm.computedValue=$$v;},expression:"computedValue"}},'b-datepicker',_vm.datepicker,false),[_c('nav',{staticClass:"level is-mobile"},[(_vm.$slots.left !== undefined)?_c('div',{staticClass:"level-item has-text-centered"},[_vm._t("left")],2):_vm._e(),_vm._v(" "),_c('div',{staticClass:"level-item has-text-centered"},[_c('b-timepicker',_vm._b({ref:"timepicker",attrs:{"inline":"","editable":_vm.editable,"min-time":_vm.minTime,"max-time":_vm.maxTime,"size":_vm.timepickerSize,"disabled":_vm.timepickerDisabled},model:{value:(_vm.computedValue),callback:function ($$v) {_vm.computedValue=$$v;},expression:"computedValue"}},'b-timepicker',_vm.timepicker,false))],1),_vm._v(" "),(_vm.$slots.right !== undefined)?_c('div',{staticClass:"level-item has-text-centered"},[_vm._t("right")],2):_vm._e()])]):_c('b-input',_vm._b({ref:"input",attrs:{"type":"datetime-local","autocomplete":"off","value":_vm.formatNative(_vm.computedValue),"placeholder":_vm.placeholder,"size":_vm.size,"icon":_vm.icon,"icon-pack":_vm.iconPack,"loading":_vm.loading,"max":_vm.formatNative(_vm.maxDate),"min":_vm.formatNative(_vm.minDate),"disabled":_vm.disabled,"readonly":false,"use-html5-validation":_vm.useHtml5Validation},on:{"focus":_vm.onFocus,"blur":_vm.onBlur},nativeOn:{"change":function($event){_vm.onChangeNativePicker($event);}}},'b-input',_vm.$attrs,false))};
  var __vue_staticRenderFns__$h = [];

    /* style */
    const __vue_inject_styles__$j = undefined;
    /* scoped */
    const __vue_scope_id__$j = undefined;
    /* module identifier */
    const __vue_module_identifier__$j = undefined;
    /* functional template */
    const __vue_is_functional_template__$j = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Datetimepicker = normalizeComponent_1(
      { render: __vue_render__$h, staticRenderFns: __vue_staticRenderFns__$h },
      __vue_inject_styles__$j,
      __vue_script__$j,
      __vue_scope_id__$j,
      __vue_is_functional_template__$j,
      __vue_module_identifier__$j,
      undefined,
      undefined
    );

  var Plugin$6 = {
    install: function install(Vue) {
      registerComponent(Vue, Datetimepicker);
    }
  };
  use(Plugin$6);

  //
  var script$k = {
    name: 'BModal',
    directives: {
      trapFocus: directive
    },
    props: {
      active: Boolean,
      component: [Object, Function],
      content: String,
      programmatic: Boolean,
      props: Object,
      events: Object,
      width: {
        type: [String, Number],
        default: 960
      },
      hasModalCard: Boolean,
      animation: {
        type: String,
        default: 'zoom-out'
      },
      canCancel: {
        type: [Array, Boolean],
        default: function _default() {
          return config$1.defaultModalCanCancel;
        }
      },
      onCancel: {
        type: Function,
        default: function _default() {}
      },
      scroll: {
        type: String,
        default: function _default() {
          return config$1.defaultModalScroll ? config$1.defaultModalScroll : 'clip';
        },
        validator: function validator(value) {
          return ['clip', 'keep'].indexOf(value) >= 0;
        }
      },
      fullScreen: Boolean,
      trapFocus: {
        type: Boolean,
        default: config$1.defaultTrapFocus
      },
      customClass: String,
      ariaRole: {
        type: String,
        validator: function validator(value) {
          return ['dialog', 'alertdialog'].indexOf(value) >= 0;
        }
      },
      ariaModal: Boolean
    },
    data: function data() {
      return {
        isActive: this.active || false,
        savedScrollTop: null,
        newWidth: typeof this.width === 'number' ? this.width + 'px' : this.width,
        animating: true
      };
    },
    computed: {
      cancelOptions: function cancelOptions() {
        return typeof this.canCancel === 'boolean' ? this.canCancel ? config$1.defaultModalCanCancel : [] : this.canCancel;
      },
      showX: function showX() {
        return this.cancelOptions.indexOf('x') >= 0;
      },
      customStyle: function customStyle() {
        if (!this.fullScreen) {
          return {
            maxWidth: this.newWidth
          };
        }

        return null;
      }
    },
    watch: {
      active: function active(value) {
        this.isActive = value;
      },
      isActive: function isActive() {
        this.handleScroll();
      }
    },
    methods: {
      handleScroll: function handleScroll() {
        if (typeof window === 'undefined') return;

        if (this.scroll === 'clip') {
          if (this.isActive) {
            document.documentElement.classList.add('is-clipped');
          } else {
            document.documentElement.classList.remove('is-clipped');
          }

          return;
        }

        this.savedScrollTop = !this.savedScrollTop ? document.documentElement.scrollTop : this.savedScrollTop;

        if (this.isActive) {
          document.body.classList.add('is-noscroll');
        } else {
          document.body.classList.remove('is-noscroll');
        }

        if (this.isActive) {
          document.body.style.top = "-".concat(this.savedScrollTop, "px");
          return;
        }

        document.documentElement.scrollTop = this.savedScrollTop;
        document.body.style.top = null;
        this.savedScrollTop = null;
      },

      /**
      * Close the Modal if canCancel and call the onCancel prop (function).
      */
      cancel: function cancel(method) {
        if (this.cancelOptions.indexOf(method) < 0) return;
        this.onCancel.apply(null, arguments);
        this.close();
      },

      /**
      * Call the onCancel prop (function).
      * Emit events, and destroy modal if it's programmatic.
      */
      close: function close() {
        var _this = this;

        this.$emit('close');
        this.$emit('update:active', false); // Timeout for the animation complete before destroying

        if (this.programmatic) {
          this.isActive = false;
          setTimeout(function () {
            _this.$destroy();

            removeElement(_this.$el);
          }, 150);
        }
      },

      /**
      * Keypress event that is bound to the document.
      */
      keyPress: function keyPress(event) {
        // Esc key
        if (this.isActive && event.keyCode === 27) this.cancel('escape');
      },

      /**
      * Transition after-enter hook
      */
      afterEnter: function afterEnter() {
        this.animating = false;
      },

      /**
      * Transition before-leave hook
      */
      beforeLeave: function beforeLeave() {
        this.animating = true;
      }
    },
    created: function created() {
      if (typeof window !== 'undefined') {
        document.addEventListener('keyup', this.keyPress);
      }
    },
    beforeMount: function beforeMount() {
      // Insert the Modal component in body tag
      // only if it's programmatic
      this.programmatic && document.body.appendChild(this.$el);
    },
    mounted: function mounted() {
      if (this.programmatic) this.isActive = true;else if (this.isActive) this.handleScroll();
    },
    beforeDestroy: function beforeDestroy() {
      if (typeof window !== 'undefined') {
        document.removeEventListener('keyup', this.keyPress); // reset scroll

        document.documentElement.classList.remove('is-clipped');
        var savedScrollTop = !this.savedScrollTop ? document.documentElement.scrollTop : this.savedScrollTop;
        document.body.classList.remove('is-noscroll');
        document.documentElement.scrollTop = savedScrollTop;
        document.body.style.top = null;
      }
    }
  };

  /* script */
  const __vue_script__$k = script$k;

  /* template */
  var __vue_render__$i = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":_vm.animation},on:{"after-enter":_vm.afterEnter,"before-leave":_vm.beforeLeave}},[(_vm.isActive)?_c('div',{directives:[{name:"trap-focus",rawName:"v-trap-focus",value:(_vm.trapFocus),expression:"trapFocus"}],staticClass:"modal is-active",class:[{'is-full-screen': _vm.fullScreen}, _vm.customClass],attrs:{"role":_vm.ariaRole,"aria-modal":_vm.ariaModal}},[_c('div',{staticClass:"modal-background",on:{"click":function($event){_vm.cancel('outside');}}}),_vm._v(" "),_c('div',{staticClass:"animation-content",class:{ 'modal-content': !_vm.hasModalCard },style:(_vm.customStyle)},[(_vm.component)?_c(_vm.component,_vm._g(_vm._b({tag:"component",on:{"close":_vm.close}},'component',_vm.props,false),_vm.events)):(_vm.content)?_c('div',{domProps:{"innerHTML":_vm._s(_vm.content)}}):_vm._t("default"),_vm._v(" "),(_vm.showX && !_vm.animating)?_c('button',{staticClass:"modal-close is-large",attrs:{"type":"button"},on:{"click":function($event){_vm.cancel('x');}}}):_vm._e()],2)]):_vm._e()])};
  var __vue_staticRenderFns__$i = [];

    /* style */
    const __vue_inject_styles__$k = undefined;
    /* scoped */
    const __vue_scope_id__$k = undefined;
    /* module identifier */
    const __vue_module_identifier__$k = undefined;
    /* functional template */
    const __vue_is_functional_template__$k = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Modal = normalizeComponent_1(
      { render: __vue_render__$i, staticRenderFns: __vue_staticRenderFns__$i },
      __vue_inject_styles__$k,
      __vue_script__$k,
      __vue_scope_id__$k,
      __vue_is_functional_template__$k,
      __vue_module_identifier__$k,
      undefined,
      undefined
    );

  var script$l = {
    name: 'BDialog',
    components: _defineProperty({}, Icon.name, Icon),
    directives: {
      trapFocus: directive
    },
    extends: Modal,
    props: {
      title: String,
      message: String,
      icon: String,
      iconPack: String,
      hasIcon: Boolean,
      type: {
        type: String,
        default: 'is-primary'
      },
      size: String,
      confirmText: {
        type: String,
        default: function _default() {
          return config$1.defaultDialogConfirmText ? config$1.defaultDialogConfirmText : 'OK';
        }
      },
      cancelText: {
        type: String,
        default: function _default() {
          return config$1.defaultDialogCancelText ? config$1.defaultDialogCancelText : 'Cancel';
        }
      },
      hasInput: Boolean,
      // Used internally to know if it's prompt
      inputAttrs: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      onConfirm: {
        type: Function,
        default: function _default() {}
      },
      focusOn: {
        type: String,
        default: 'confirm'
      },
      trapFocus: {
        type: Boolean,
        default: config$1.defaultTrapFocus
      },
      ariaRole: {
        type: String,
        validator: function validator(value) {
          return ['dialog', 'alertdialog'].indexOf(value) >= 0;
        }
      },
      ariaModal: Boolean
    },
    data: function data() {
      var prompt = this.hasInput ? this.inputAttrs.value || '' : '';
      return {
        prompt: prompt,
        isActive: false,
        validationMessage: ''
      };
    },
    computed: {
      /**
      * Icon name (MDI) based on the type.
      */
      iconByType: function iconByType() {
        switch (this.type) {
          case 'is-info':
            return 'information';

          case 'is-success':
            return 'check-circle';

          case 'is-warning':
            return 'alert';

          case 'is-danger':
            return 'alert-circle';

          default:
            return null;
        }
      },
      showCancel: function showCancel() {
        return this.cancelOptions.indexOf('button') >= 0;
      }
    },
    methods: {
      /**
      * If it's a prompt Dialog, validate the input.
      * Call the onConfirm prop (function) and close the Dialog.
      */
      confirm: function confirm() {
        var _this = this;

        if (this.$refs.input !== undefined) {
          if (!this.$refs.input.checkValidity()) {
            this.validationMessage = this.$refs.input.validationMessage;
            this.$nextTick(function () {
              return _this.$refs.input.select();
            });
            return;
          }
        }

        this.onConfirm(this.prompt);
        this.close();
      },

      /**
      * Close the Dialog.
      */
      close: function close() {
        var _this2 = this;

        this.isActive = false; // Timeout for the animation complete before destroying

        setTimeout(function () {
          _this2.$destroy();

          removeElement(_this2.$el);
        }, 150);
      }
    },
    beforeMount: function beforeMount() {
      var _this3 = this;

      // Insert the Dialog component in body tag
      if (typeof window !== 'undefined') {
        this.$nextTick(function () {
          document.body.appendChild(_this3.$el);
        });
      }
    },
    mounted: function mounted() {
      var _this4 = this;

      this.isActive = true;

      if (typeof this.inputAttrs.required === 'undefined') {
        this.$set(this.inputAttrs, 'required', true);
      }

      this.$nextTick(function () {
        // Handle which element receives focus
        if (_this4.hasInput) {
          _this4.$refs.input.focus();
        } else if (_this4.focusOn === 'cancel' && _this4.showCancel) {
          _this4.$refs.cancelButton.focus();
        } else {
          _this4.$refs.confirmButton.focus();
        }
      });
    }
  };

  /* script */
  const __vue_script__$l = script$l;

  /* template */
  var __vue_render__$j = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":_vm.animation}},[(_vm.isActive)?_c('div',{directives:[{name:"trap-focus",rawName:"v-trap-focus",value:(_vm.trapFocus),expression:"trapFocus"}],staticClass:"dialog modal is-active",class:_vm.size,attrs:{"role":_vm.ariaRole,"aria-modal":_vm.ariaModal}},[_c('div',{staticClass:"modal-background",on:{"click":function($event){_vm.cancel('outside');}}}),_vm._v(" "),_c('div',{staticClass:"modal-card animation-content"},[(_vm.title)?_c('header',{staticClass:"modal-card-head"},[_c('p',{staticClass:"modal-card-title"},[_vm._v(_vm._s(_vm.title))])]):_vm._e(),_vm._v(" "),_c('section',{staticClass:"modal-card-body",class:{ 'is-titleless': !_vm.title, 'is-flex': _vm.hasIcon }},[_c('div',{staticClass:"media"},[(_vm.hasIcon && (_vm.icon || _vm.iconByType))?_c('div',{staticClass:"media-left"},[_c('b-icon',{attrs:{"icon":_vm.icon ? _vm.icon : _vm.iconByType,"pack":_vm.iconPack,"type":_vm.type,"both":!_vm.icon,"size":"is-large"}})],1):_vm._e(),_vm._v(" "),_c('div',{staticClass:"media-content"},[_c('p',{domProps:{"innerHTML":_vm._s(_vm.message)}}),_vm._v(" "),(_vm.hasInput)?_c('div',{staticClass:"field"},[_c('div',{staticClass:"control"},[_c('input',_vm._b({directives:[{name:"model",rawName:"v-model",value:(_vm.prompt),expression:"prompt"}],ref:"input",staticClass:"input",class:{ 'is-danger': _vm.validationMessage },domProps:{"value":(_vm.prompt)},on:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }_vm.confirm($event);},"input":function($event){if($event.target.composing){ return; }_vm.prompt=$event.target.value;}}},'input',_vm.inputAttrs,false))]),_vm._v(" "),_c('p',{staticClass:"help is-danger"},[_vm._v(_vm._s(_vm.validationMessage))])]):_vm._e()])])]),_vm._v(" "),_c('footer',{staticClass:"modal-card-foot"},[(_vm.showCancel)?_c('button',{ref:"cancelButton",staticClass:"button",on:{"click":function($event){_vm.cancel('button');}}},[_vm._v("\n                    "+_vm._s(_vm.cancelText)+"\n                ")]):_vm._e(),_vm._v(" "),_c('button',{ref:"confirmButton",staticClass:"button",class:_vm.type,on:{"click":_vm.confirm}},[_vm._v("\n                    "+_vm._s(_vm.confirmText)+"\n                ")])])])]):_vm._e()])};
  var __vue_staticRenderFns__$j = [];

    /* style */
    const __vue_inject_styles__$l = undefined;
    /* scoped */
    const __vue_scope_id__$l = undefined;
    /* module identifier */
    const __vue_module_identifier__$l = undefined;
    /* functional template */
    const __vue_is_functional_template__$l = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Dialog = normalizeComponent_1(
      { render: __vue_render__$j, staticRenderFns: __vue_staticRenderFns__$j },
      __vue_inject_styles__$l,
      __vue_script__$l,
      __vue_scope_id__$l,
      __vue_is_functional_template__$l,
      __vue_module_identifier__$l,
      undefined,
      undefined
    );

  function open(propsData) {
    var vm = typeof window !== 'undefined' && window.Vue ? window.Vue : Vue;
    var DialogComponent = vm.extend(Dialog);
    return new DialogComponent({
      el: document.createElement('div'),
      propsData: propsData
    });
  }

  var DialogProgrammatic = {
    alert: function alert(params) {
      var message;
      if (typeof params === 'string') message = params;
      var defaultParam = {
        canCancel: false,
        message: message
      };
      var propsData = Object.assign(defaultParam, params);
      return open(propsData);
    },
    confirm: function confirm(params) {
      var defaultParam = {};
      var propsData = Object.assign(defaultParam, params);
      return open(propsData);
    },
    prompt: function prompt(params) {
      var defaultParam = {
        hasInput: true,
        confirmText: 'Done'
      };
      var propsData = Object.assign(defaultParam, params);
      return open(propsData);
    }
  };
  var Plugin$7 = {
    install: function install(Vue) {
      registerComponent(Vue, Dialog);
      registerComponentProgrammatic(Vue, 'dialog', DialogProgrammatic);
    }
  };
  use(Plugin$7);

  var Plugin$8 = {
    install: function install(Vue) {
      registerComponent(Vue, Dropdown);
      registerComponent(Vue, DropdownItem);
    }
  };
  use(Plugin$8);

  var Plugin$9 = {
    install: function install(Vue) {
      registerComponent(Vue, Field);
    }
  };
  use(Plugin$9);

  var Plugin$a = {
    install: function install(Vue) {
      registerComponent(Vue, Icon);
    }
  };
  use(Plugin$a);

  var Plugin$b = {
    install: function install(Vue) {
      registerComponent(Vue, Input);
    }
  };
  use(Plugin$b);

  // Polyfills for SSR
  var isSSR = typeof window === 'undefined';
  var HTMLElement = isSSR ? Object : window.HTMLElement;
  var File = isSSR ? Object : window.File;

  //
  var script$m = {
    name: 'BLoading',
    props: {
      active: Boolean,
      programmatic: Boolean,
      container: [Object, Function, HTMLElement],
      isFullPage: {
        type: Boolean,
        default: true
      },
      animation: {
        type: String,
        default: 'fade'
      },
      canCancel: {
        type: Boolean,
        default: false
      },
      onCancel: {
        type: Function,
        default: function _default() {}
      }
    },
    data: function data() {
      return {
        isActive: this.active || false
      };
    },
    watch: {
      active: function active(value) {
        this.isActive = value;
      }
    },
    methods: {
      /**
      * Close the Modal if canCancel.
      */
      cancel: function cancel() {
        if (!this.canCancel || !this.isActive) return;
        this.close();
      },

      /**
      * Emit events, and destroy modal if it's programmatic.
      */
      close: function close() {
        var _this = this;

        this.onCancel.apply(null, arguments);
        this.$emit('close');
        this.$emit('update:active', false); // Timeout for the animation complete before destroying

        if (this.programmatic) {
          this.isActive = false;
          setTimeout(function () {
            _this.$destroy();

            removeElement(_this.$el);
          }, 150);
        }
      },

      /**
      * Keypress event that is bound to the document.
      */
      keyPress: function keyPress(event) {
        // Esc key
        if (event.keyCode === 27) this.cancel();
      }
    },
    created: function created() {
      if (typeof window !== 'undefined') {
        document.addEventListener('keyup', this.keyPress);
      }
    },
    beforeMount: function beforeMount() {
      // Insert the Loading component in body tag
      // only if it's programmatic
      if (this.programmatic) {
        if (!this.container) {
          document.body.appendChild(this.$el);
        } else {
          this.isFullPage = false;
          this.container.appendChild(this.$el);
        }
      }
    },
    mounted: function mounted() {
      if (this.programmatic) this.isActive = true;
    },
    beforeDestroy: function beforeDestroy() {
      if (typeof window !== 'undefined') {
        document.removeEventListener('keyup', this.keyPress);
      }
    }
  };

  /* script */
  const __vue_script__$m = script$m;

  /* template */
  var __vue_render__$k = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":_vm.animation}},[(_vm.isActive)?_c('div',{staticClass:"loading-overlay is-active",class:{ 'is-full-page': _vm.isFullPage }},[_c('div',{staticClass:"loading-background",on:{"click":_vm.cancel}}),_vm._v(" "),_vm._t("default",[_c('div',{staticClass:"loading-icon"})])],2):_vm._e()])};
  var __vue_staticRenderFns__$k = [];

    /* style */
    const __vue_inject_styles__$m = undefined;
    /* scoped */
    const __vue_scope_id__$m = undefined;
    /* module identifier */
    const __vue_module_identifier__$m = undefined;
    /* functional template */
    const __vue_is_functional_template__$m = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Loading = normalizeComponent_1(
      { render: __vue_render__$k, staticRenderFns: __vue_staticRenderFns__$k },
      __vue_inject_styles__$m,
      __vue_script__$m,
      __vue_scope_id__$m,
      __vue_is_functional_template__$m,
      __vue_module_identifier__$m,
      undefined,
      undefined
    );

  var LoadingProgrammatic = {
    open: function open(params) {
      var defaultParam = {
        programmatic: true
      };
      var propsData = Object.assign(defaultParam, params);
      var vm = typeof window !== 'undefined' && window.Vue ? window.Vue : Vue;
      var LoadingComponent = vm.extend(Loading);
      return new LoadingComponent({
        el: document.createElement('div'),
        propsData: propsData
      });
    }
  };
  var Plugin$c = {
    install: function install(Vue) {
      registerComponent(Vue, Loading);
      registerComponentProgrammatic(Vue, 'loading', LoadingProgrammatic);
    }
  };
  use(Plugin$c);

  //
  //
  //
  //
  //
  //
  var script$n = {
    name: 'BMenu'
  };

  /* script */
  const __vue_script__$n = script$n;

  /* template */
  var __vue_render__$l = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"menu"},[_vm._t("default")],2)};
  var __vue_staticRenderFns__$l = [];

    /* style */
    const __vue_inject_styles__$n = undefined;
    /* scoped */
    const __vue_scope_id__$n = undefined;
    /* module identifier */
    const __vue_module_identifier__$n = undefined;
    /* functional template */
    const __vue_is_functional_template__$n = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Menu = normalizeComponent_1(
      { render: __vue_render__$l, staticRenderFns: __vue_staticRenderFns__$l },
      __vue_inject_styles__$n,
      __vue_script__$n,
      __vue_scope_id__$n,
      __vue_is_functional_template__$n,
      __vue_module_identifier__$n,
      undefined,
      undefined
    );

  var script$o = {
    name: 'BMenuList',
    functional: true,
    props: {
      label: String,
      icon: String,
      iconPack: String,
      ariaRole: {
        type: String,
        default: ''
      }
    },
    render: function render(createElement, context) {
      var vlabel = null;
      var slots = context.slots();

      if (context.props.label || slots.label) {
        vlabel = createElement('p', {
          attrs: {
            'class': 'menu-label'
          }
        }, context.props.label ? context.props.icon ? [createElement('b-icon', {
          props: {
            'icon': context.props.icon,
            'pack': context.props.iconPack,
            'size': 'is-small'
          }
        }), createElement('span', {}, context.props.label)] : context.props.label : slots.label);
      }

      var vnode = createElement('ul', {
        attrs: {
          'class': 'menu-list',
          'role': context.props.ariaRole === 'menu' ? context.props.ariaRole : null
        }
      }, slots.default);
      return vlabel ? [vlabel, vnode] : vnode;
    }
  };

  /* script */
  const __vue_script__$o = script$o;

  /* template */

    /* style */
    const __vue_inject_styles__$o = undefined;
    /* scoped */
    const __vue_scope_id__$o = undefined;
    /* module identifier */
    const __vue_module_identifier__$o = undefined;
    /* functional template */
    const __vue_is_functional_template__$o = undefined;
    /* style inject */
    
    /* style inject SSR */
    

    
    var MenuList = normalizeComponent_1(
      {},
      __vue_inject_styles__$o,
      __vue_script__$o,
      __vue_scope_id__$o,
      __vue_is_functional_template__$o,
      __vue_module_identifier__$o,
      undefined,
      undefined
    );

  var script$p = {
    name: 'BMenuItem',
    components: _defineProperty({}, Icon.name, Icon),
    inheritAttrs: false,
    props: {
      label: String,
      active: Boolean,
      expanded: Boolean,
      disabled: Boolean,
      iconPack: String,
      icon: String,
      animation: {
        type: String,
        default: 'fade'
      },
      tag: {
        type: String,
        default: 'a',
        validator: function validator(value) {
          return ['a', 'router-link', 'nuxt-link', 'n-link', 'NuxtLink', 'NLink'].indexOf(value) >= 0;
        }
      },
      ariaRole: {
        type: String,
        default: ''
      }
    },
    data: function data() {
      return {
        newActive: this.active,
        newExpanded: this.expanded
      };
    },
    computed: {
      ariaRoleMenu: function ariaRoleMenu() {
        return this.ariaRole === 'menuitem' ? this.ariaRole : null;
      }
    },
    watch: {
      active: function active(value) {
        this.newActive = value;
      },
      expanded: function expanded(value) {
        this.newExpanded = value;
      }
    },
    methods: {
      onClick: function onClick(event) {
        if (this.disabled) return;
        this.reset(this.$parent);
        this.newExpanded = true;
        this.$emit('update:expanded', this.newActive);
        this.newActive = true;
        this.$emit('update:active', this.newActive);
        this.$emit('click', event);
      },
      reset: function reset(parent) {
        var _this = this;

        var items = parent.$children.filter(function (c) {
          return c.name === _this.name;
        });
        items.forEach(function (item) {
          if (item !== _this) {
            _this.reset(item);

            item.newExpanded = false;
            item.$emit('update:expanded', item.newActive);
            item.newActive = false;
            item.$emit('update:active', item.newActive);
          }
        });
      }
    }
  };

  /* script */
  const __vue_script__$p = script$p;

  /* template */
  var __vue_render__$m = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('li',{attrs:{"role":_vm.ariaRoleMenu}},[_c(_vm.tag,_vm._b({tag:"component",class:{
              'is-active': _vm.newActive,
              'is-disabled': _vm.disabled
          },on:{"click":function($event){_vm.onClick($event);}},nativeOn:{"click":function($event){_vm.onClick($event);}}},'component',_vm.$attrs,false),[(_vm.icon)?_c('b-icon',{attrs:{"icon":_vm.icon,"pack":_vm.iconPack,"size":"is-small"}}):_vm._e(),_vm._v(" "),(_vm.label)?_c('span',[_vm._v(_vm._s(_vm.label))]):_vm._t("label",null,{expanded:_vm.newExpanded,active:_vm.newActive})],2),_vm._v(" "),(_vm.$slots.default)?[_c('transition',{attrs:{"name":_vm.animation}},[_c('ul',{directives:[{name:"show",rawName:"v-show",value:(_vm.newExpanded),expression:"newExpanded"}]},[_vm._t("default")],2)])]:_vm._e()],2)};
  var __vue_staticRenderFns__$m = [];

    /* style */
    const __vue_inject_styles__$p = undefined;
    /* scoped */
    const __vue_scope_id__$p = undefined;
    /* module identifier */
    const __vue_module_identifier__$p = undefined;
    /* functional template */
    const __vue_is_functional_template__$p = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var MenuItem = normalizeComponent_1(
      { render: __vue_render__$m, staticRenderFns: __vue_staticRenderFns__$m },
      __vue_inject_styles__$p,
      __vue_script__$p,
      __vue_scope_id__$p,
      __vue_is_functional_template__$p,
      __vue_module_identifier__$p,
      undefined,
      undefined
    );

  var Plugin$d = {
    install: function install(Vue) {
      registerComponent(Vue, Menu);
      registerComponent(Vue, MenuList);
      registerComponent(Vue, MenuItem);
    }
  };
  use(Plugin$d);

  var MessageMixin = {
    components: _defineProperty({}, Icon.name, Icon),
    props: {
      active: {
        type: Boolean,
        default: true
      },
      title: String,
      closable: {
        type: Boolean,
        default: true
      },
      message: String,
      type: String,
      hasIcon: Boolean,
      size: String,
      iconPack: String,
      iconSize: String,
      autoClose: {
        type: Boolean,
        default: false
      },
      duration: {
        type: Number,
        default: 2000
      }
    },
    data: function data() {
      return {
        isActive: this.active
      };
    },
    watch: {
      active: function active(value) {
        this.isActive = value;
      },
      isActive: function isActive(value) {
        if (value) {
          this.setAutoClose();
        } else {
          if (this.timer) {
            clearTimeout(this.timer);
          }
        }
      }
    },
    computed: {
      /**
       * Icon name (MDI) based on type.
       */
      icon: function icon() {
        switch (this.type) {
          case 'is-info':
            return 'information';

          case 'is-success':
            return 'check-circle';

          case 'is-warning':
            return 'alert';

          case 'is-danger':
            return 'alert-circle';

          default:
            return null;
        }
      }
    },
    methods: {
      /**
       * Close the Message and emit events.
       */
      close: function close() {
        this.isActive = false;
        this.$emit('close');
        this.$emit('update:active', false);
      },

      /**
       * Set timer to auto close message
       */
      setAutoClose: function setAutoClose() {
        var _this = this;

        if (this.autoClose) {
          this.timer = setTimeout(function () {
            if (_this.isActive) {
              _this.close();
            }
          }, this.duration);
        }
      }
    },
    mounted: function mounted() {
      this.setAutoClose();
    }
  };

  //
  var script$q = {
    name: 'BMessage',
    mixins: [MessageMixin],
    props: {
      ariaCloseLabel: String
    },
    data: function data() {
      return {
        newIconSize: this.iconSize || this.size || 'is-large'
      };
    }
  };

  /* script */
  const __vue_script__$q = script$q;

  /* template */
  var __vue_render__$n = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"fade"}},[(_vm.isActive)?_c('article',{staticClass:"message",class:[_vm.type, _vm.size]},[(_vm.title)?_c('header',{staticClass:"message-header"},[_c('p',[_vm._v(_vm._s(_vm.title))]),_vm._v(" "),(_vm.closable)?_c('button',{staticClass:"delete",attrs:{"type":"button","aria-label":_vm.ariaCloseLabel},on:{"click":_vm.close}}):_vm._e()]):_vm._e(),_vm._v(" "),_c('section',{staticClass:"message-body"},[_c('div',{staticClass:"media"},[(_vm.icon && _vm.hasIcon)?_c('div',{staticClass:"media-left"},[_c('b-icon',{class:_vm.type,attrs:{"icon":_vm.icon,"pack":_vm.iconPack,"both":"","size":_vm.newIconSize}})],1):_vm._e(),_vm._v(" "),_c('div',{staticClass:"media-content"},[_vm._t("default")],2)])])]):_vm._e()])};
  var __vue_staticRenderFns__$n = [];

    /* style */
    const __vue_inject_styles__$q = undefined;
    /* scoped */
    const __vue_scope_id__$q = undefined;
    /* module identifier */
    const __vue_module_identifier__$q = undefined;
    /* functional template */
    const __vue_is_functional_template__$q = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Message = normalizeComponent_1(
      { render: __vue_render__$n, staticRenderFns: __vue_staticRenderFns__$n },
      __vue_inject_styles__$q,
      __vue_script__$q,
      __vue_scope_id__$q,
      __vue_is_functional_template__$q,
      __vue_module_identifier__$q,
      undefined,
      undefined
    );

  var Plugin$e = {
    install: function install(Vue) {
      registerComponent(Vue, Message);
    }
  };
  use(Plugin$e);

  var ModalProgrammatic = {
    open: function open(params) {
      var content;
      var parent;
      if (typeof params === 'string') content = params;
      var defaultParam = {
        programmatic: true,
        content: content
      };

      if (params.parent) {
        parent = params.parent;
        delete params.parent;
      }

      var propsData = Object.assign(defaultParam, params);
      var vm = typeof window !== 'undefined' && window.Vue ? window.Vue : Vue;
      var ModalComponent = vm.extend(Modal);
      return new ModalComponent({
        parent: parent,
        el: document.createElement('div'),
        propsData: propsData
      });
    }
  };
  var Plugin$f = {
    install: function install(Vue) {
      registerComponent(Vue, Modal);
      registerComponentProgrammatic(Vue, 'modal', ModalProgrammatic);
    }
  };
  use(Plugin$f);

  //
  var script$r = {
    name: 'BNotification',
    mixins: [MessageMixin],
    props: {
      position: String,
      ariaCloseLabel: String
    }
  };

  /* script */
  const __vue_script__$r = script$r;

  /* template */
  var __vue_render__$o = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"fade"}},[_c('article',{directives:[{name:"show",rawName:"v-show",value:(_vm.isActive),expression:"isActive"}],staticClass:"notification",class:[_vm.type, _vm.position]},[(_vm.closable)?_c('button',{staticClass:"delete",attrs:{"type":"button","aria-label":_vm.ariaCloseLabel},on:{"click":_vm.close}}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"media"},[(_vm.icon && _vm.hasIcon)?_c('div',{staticClass:"media-left"},[_c('b-icon',{attrs:{"icon":_vm.icon,"pack":_vm.iconPack,"both":"","size":"is-large","aria-hidden":""}})],1):_vm._e(),_vm._v(" "),_c('div',{staticClass:"media-content"},[(_vm.message)?_c('p',{staticClass:"text",domProps:{"innerHTML":_vm._s(_vm.message)}}):_vm._t("default")],2)])])])};
  var __vue_staticRenderFns__$o = [];

    /* style */
    const __vue_inject_styles__$r = undefined;
    /* scoped */
    const __vue_scope_id__$r = undefined;
    /* module identifier */
    const __vue_module_identifier__$r = undefined;
    /* functional template */
    const __vue_is_functional_template__$r = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Notification = normalizeComponent_1(
      { render: __vue_render__$o, staticRenderFns: __vue_staticRenderFns__$o },
      __vue_inject_styles__$r,
      __vue_script__$r,
      __vue_scope_id__$r,
      __vue_is_functional_template__$r,
      __vue_module_identifier__$r,
      undefined,
      undefined
    );

  var NoticeMixin = {
    props: {
      type: {
        type: String,
        default: 'is-dark'
      },
      message: String,
      duration: Number,
      queue: {
        type: Boolean,
        default: undefined
      },
      position: {
        type: String,
        default: 'is-top',
        validator: function validator(value) {
          return ['is-top-right', 'is-top', 'is-top-left', 'is-bottom-right', 'is-bottom', 'is-bottom-left'].indexOf(value) > -1;
        }
      },
      container: String
    },
    data: function data() {
      return {
        isActive: false,
        parentTop: null,
        parentBottom: null,
        newContainer: this.container || config$1.defaultContainerElement
      };
    },
    computed: {
      correctParent: function correctParent() {
        switch (this.position) {
          case 'is-top-right':
          case 'is-top':
          case 'is-top-left':
            return this.parentTop;

          case 'is-bottom-right':
          case 'is-bottom':
          case 'is-bottom-left':
            return this.parentBottom;
        }
      },
      transition: function transition() {
        switch (this.position) {
          case 'is-top-right':
          case 'is-top':
          case 'is-top-left':
            return {
              enter: 'fadeInDown',
              leave: 'fadeOut'
            };

          case 'is-bottom-right':
          case 'is-bottom':
          case 'is-bottom-left':
            return {
              enter: 'fadeInUp',
              leave: 'fadeOut'
            };
        }
      }
    },
    methods: {
      shouldQueue: function shouldQueue() {
        var queue = this.queue !== undefined ? this.queue : config$1.defaultNoticeQueue;
        if (!queue) return false;
        return this.parentTop.childElementCount > 0 || this.parentBottom.childElementCount > 0;
      },
      close: function close() {
        var _this = this;

        clearTimeout(this.timer);
        this.isActive = false; // Timeout for the animation complete before destroying

        setTimeout(function () {
          _this.$destroy();

          removeElement(_this.$el);
        }, 150);
      },
      showNotice: function showNotice() {
        var _this2 = this;

        if (this.shouldQueue()) {
          // Call recursively if should queue
          setTimeout(function () {
            return _this2.showNotice();
          }, 250);
          return;
        }

        this.correctParent.insertAdjacentElement('afterbegin', this.$el);
        this.isActive = true;

        if (!this.indefinite) {
          this.timer = setTimeout(function () {
            return _this2.close();
          }, this.newDuration);
        }
      },
      setupContainer: function setupContainer() {
        this.parentTop = document.querySelector((this.newContainer ? this.newContainer : 'body') + '>.notices.is-top');
        this.parentBottom = document.querySelector((this.newContainer ? this.newContainer : 'body') + '>.notices.is-bottom');
        if (this.parentTop && this.parentBottom) return;

        if (!this.parentTop) {
          this.parentTop = document.createElement('div');
          this.parentTop.className = 'notices is-top';
        }

        if (!this.parentBottom) {
          this.parentBottom = document.createElement('div');
          this.parentBottom.className = 'notices is-bottom';
        }

        var container = document.querySelector(this.newContainer) || document.body;
        container.appendChild(this.parentTop);
        container.appendChild(this.parentBottom);

        if (this.newContainer) {
          this.parentTop.classList.add('has-custom-container');
          this.parentBottom.classList.add('has-custom-container');
        }
      }
    },
    beforeMount: function beforeMount() {
      this.setupContainer();
    },
    mounted: function mounted() {
      this.showNotice();
    }
  };

  //
  var script$s = {
    name: 'BNotificationNotice',
    mixins: [NoticeMixin],
    props: {
      indefinite: {
        type: Boolean,
        default: false
      }
    },
    data: function data() {
      return {
        newDuration: this.duration || config$1.defaultNotificationDuration
      };
    }
  };

  /* script */
  const __vue_script__$s = script$s;

  /* template */
  var __vue_render__$p = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('b-notification',_vm._b({on:{"close":_vm.close}},'b-notification',_vm.$options.propsData,false))};
  var __vue_staticRenderFns__$p = [];

    /* style */
    const __vue_inject_styles__$s = undefined;
    /* scoped */
    const __vue_scope_id__$s = undefined;
    /* module identifier */
    const __vue_module_identifier__$s = undefined;
    /* functional template */
    const __vue_is_functional_template__$s = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var NotificationNotice = normalizeComponent_1(
      { render: __vue_render__$p, staticRenderFns: __vue_staticRenderFns__$p },
      __vue_inject_styles__$s,
      __vue_script__$s,
      __vue_scope_id__$s,
      __vue_is_functional_template__$s,
      __vue_module_identifier__$s,
      undefined,
      undefined
    );

  var NotificationProgrammatic = {
    open: function open(params) {
      var message;
      var parent;
      if (typeof params === 'string') message = params;
      var defaultParam = {
        message: message,
        position: config$1.defaultNotificationPosition || 'is-top-right'
      };

      if (params.parent) {
        parent = params.parent;
        delete params.parent;
      }

      var propsData = Object.assign(defaultParam, typeof params === 'string' ? {} : params);
      var vm = typeof window !== 'undefined' && window.Vue ? window.Vue : Vue;
      var NotificationNoticeComponent = vm.extend(NotificationNotice);
      return new NotificationNoticeComponent({
        parent: parent,
        el: document.createElement('div'),
        propsData: propsData
      });
    }
  };
  var Plugin$g = {
    install: function install(Vue) {
      registerComponent(Vue, Notification);
      registerComponentProgrammatic(Vue, 'notification', NotificationProgrammatic);
    }
  };
  use(Plugin$g);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$t = {
    name: 'NavbarBurger',
    props: {
      isOpened: {
        type: Boolean,
        default: false
      }
    }
  };

  /* script */
  const __vue_script__$t = script$t;

  /* template */
  var __vue_render__$q = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('a',_vm._g({staticClass:"navbar-burger burger",class:{ 'is-active': _vm.isOpened },attrs:{"role":"button","aria-label":"menu","aria-expanded":_vm.isOpened}},_vm.$listeners),[_c('span',{attrs:{"aria-hidden":"true"}}),_vm._v(" "),_c('span',{attrs:{"aria-hidden":"true"}}),_vm._v(" "),_c('span',{attrs:{"aria-hidden":"true"}})])};
  var __vue_staticRenderFns__$q = [];

    /* style */
    const __vue_inject_styles__$t = undefined;
    /* scoped */
    const __vue_scope_id__$t = undefined;
    /* module identifier */
    const __vue_module_identifier__$t = undefined;
    /* functional template */
    const __vue_is_functional_template__$t = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var NavbarBurger = normalizeComponent_1(
      { render: __vue_render__$q, staticRenderFns: __vue_staticRenderFns__$q },
      __vue_inject_styles__$t,
      __vue_script__$t,
      __vue_scope_id__$t,
      __vue_is_functional_template__$t,
      __vue_module_identifier__$t,
      undefined,
      undefined
    );

  var isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.msMaxTouchPoints > 0);
  var events = isTouch ? ['touchstart', 'click'] : ['click'];
  var instances = [];

  function processArgs(bindingValue) {
    var isFunction = typeof bindingValue === 'function';

    if (!isFunction && _typeof(bindingValue) !== 'object') {
      throw new Error("v-click-outside: Binding value should be a function or an object, typeof ".concat(bindingValue, " given"));
    }

    return {
      handler: isFunction ? bindingValue : bindingValue.handler,
      middleware: bindingValue.middleware || function (isClickOutside) {
        return isClickOutside;
      },
      events: bindingValue.events || events
    };
  }

  function onEvent(_ref) {
    var el = _ref.el,
        event = _ref.event,
        handler = _ref.handler,
        middleware = _ref.middleware;
    var isClickOutside = event.target !== el && !el.contains(event.target);

    if (!isClickOutside) {
      return;
    }

    if (middleware(event, el)) {
      handler(event, el);
    }
  }

  function bind$1(el, _ref2) {
    var value = _ref2.value;

    var _processArgs = processArgs(value),
        _handler = _processArgs.handler,
        middleware = _processArgs.middleware,
        events = _processArgs.events;

    var instance = {
      el: el,
      eventHandlers: events.map(function (eventName) {
        return {
          event: eventName,
          handler: function handler(event) {
            return onEvent({
              event: event,
              el: el,
              handler: _handler,
              middleware: middleware
            });
          }
        };
      })
    };
    instance.eventHandlers.forEach(function (_ref3) {
      var event = _ref3.event,
          handler = _ref3.handler;
      return document.addEventListener(event, handler);
    });
    instances.push(instance);
  }

  function update(el, _ref4) {
    var value = _ref4.value;

    var _processArgs2 = processArgs(value),
        _handler2 = _processArgs2.handler,
        middleware = _processArgs2.middleware,
        events = _processArgs2.events;

    var instance = instances.find(function (instance) {
      return instance.el === el;
    });
    instance.eventHandlers.forEach(function (_ref5) {
      var event = _ref5.event,
          handler = _ref5.handler;
      return document.removeEventListener(event, handler);
    });
    instance.eventHandlers = events.map(function (eventName) {
      return {
        event: eventName,
        handler: function handler(event) {
          return onEvent({
            event: event,
            el: el,
            handler: _handler2,
            middleware: middleware
          });
        }
      };
    });
    instance.eventHandlers.forEach(function (_ref6) {
      var event = _ref6.event,
          handler = _ref6.handler;
      return document.addEventListener(event, handler);
    });
  }

  function unbind$1(el) {
    var instance = instances.find(function (instance) {
      return instance.el === el;
    });
    instance.eventHandlers.forEach(function (_ref7) {
      var event = _ref7.event,
          handler = _ref7.handler;
      return document.removeEventListener(event, handler);
    });
  }

  var directive$1 = {
    bind: bind$1,
    update: update,
    unbind: unbind$1,
    instances: instances
  };

  var FIXED_TOP_CLASS = 'is-fixed-top';
  var BODY_FIXED_TOP_CLASS = 'has-navbar-fixed-top';
  var BODY_SPACED_FIXED_TOP_CLASS = 'has-spaced-navbar-fixed-top';
  var FIXED_BOTTOM_CLASS = 'is-fixed-bottom';
  var BODY_FIXED_BOTTOM_CLASS = 'has-navbar-fixed-bottom';
  var BODY_SPACED_FIXED_BOTTOM_CLASS = 'has-spaced-navbar-fixed-bottom';

  var isFilled = function isFilled(str) {
    return !!str;
  };

  var script$u = {
    name: 'BNavbar',
    components: {
      NavbarBurger: NavbarBurger
    },
    directives: {
      clickOutside: directive$1
    },
    props: {
      type: [String, Object],
      transparent: {
        type: Boolean,
        default: false
      },
      fixedTop: {
        type: Boolean,
        default: false
      },
      fixedBottom: {
        type: Boolean,
        default: false
      },
      isActive: {
        type: Boolean,
        default: false
      },
      wrapperClass: {
        type: String
      },
      closeOnClick: {
        type: Boolean,
        default: true
      },
      mobileBurger: {
        type: Boolean,
        default: true
      },
      spaced: Boolean,
      shadow: Boolean
    },
    data: function data() {
      return {
        internalIsActive: this.isActive
      };
    },
    computed: {
      isOpened: function isOpened() {
        return this.internalIsActive;
      },
      computedClasses: function computedClasses() {
        var _ref;

        return [this.type, (_ref = {}, _defineProperty(_ref, FIXED_TOP_CLASS, this.fixedTop), _defineProperty(_ref, FIXED_BOTTOM_CLASS, this.fixedBottom), _defineProperty(_ref, 'is-spaced', this.spaced), _defineProperty(_ref, 'has-shadow', this.shadow), _defineProperty(_ref, 'is-transparent', this.transparent), _ref)];
      }
    },
    watch: {
      isActive: {
        handler: function handler(isActive) {
          this.internalIsActive = isActive;
        },
        immediate: true
      },
      fixedTop: {
        handler: function handler(isSet) {
          this.checkIfFixedPropertiesAreColliding();
          var className = this.spaced ? BODY_SPACED_FIXED_TOP_CLASS : BODY_FIXED_TOP_CLASS;

          if (isSet) {
            return this.setBodyClass(className);
          }

          this.removeBodyClass(className);
        },
        immediate: true
      },
      fixedBottom: {
        handler: function handler(isSet) {
          this.checkIfFixedPropertiesAreColliding();
          var className = this.spaced ? BODY_SPACED_FIXED_BOTTOM_CLASS : BODY_FIXED_BOTTOM_CLASS;

          if (isSet) {
            return this.setBodyClass(className);
          }

          this.removeBodyClass(className);
        },
        immediate: true
      }
    },
    methods: {
      toggleActive: function toggleActive() {
        this.internalIsActive = !this.internalIsActive;
        this.emitUpdateParentEvent();
      },
      closeMenu: function closeMenu() {
        if (this.closeOnClick) {
          this.internalIsActive = false;
          this.emitUpdateParentEvent();
        }
      },
      emitUpdateParentEvent: function emitUpdateParentEvent() {
        this.$emit('update:isActive', this.internalIsActive);
      },
      setBodyClass: function setBodyClass(className) {
        if (typeof window !== 'undefined') {
          document.body.classList.add(className);
        }
      },
      removeBodyClass: function removeBodyClass(className) {
        if (typeof window !== 'undefined') {
          document.body.classList.remove(className);
        }
      },
      checkIfFixedPropertiesAreColliding: function checkIfFixedPropertiesAreColliding() {
        var areColliding = this.fixedTop && this.fixedBottom;

        if (areColliding) {
          throw new Error('You should choose if the BNavbar is fixed bottom or fixed top, but not both');
        }
      },
      genNavbar: function genNavbar(createElement) {
        var navBarSlots = [this.genNavbarBrandNode(createElement), this.genNavbarSlotsNode(createElement)];

        if (!isFilled(this.wrapperClass)) {
          return this.genNavbarSlots(createElement, navBarSlots);
        } // It wraps the slots into a div with the provided wrapperClass prop


        var navWrapper = createElement('div', {
          class: this.wrapperClass
        }, navBarSlots);
        return this.genNavbarSlots(createElement, [navWrapper]);
      },
      genNavbarSlots: function genNavbarSlots(createElement, slots) {
        return createElement('nav', {
          staticClass: 'navbar',
          class: this.computedClasses,
          attrs: {
            role: 'navigation',
            'aria-label': 'main navigation'
          },
          directives: [{
            name: 'click-outside',
            value: this.closeMenu
          }]
        }, slots);
      },
      genNavbarBrandNode: function genNavbarBrandNode(createElement) {
        return createElement('div', {
          class: 'navbar-brand'
        }, [this.$slots.brand, this.genBurgerNode(createElement)]);
      },
      genBurgerNode: function genBurgerNode(createElement) {
        if (this.mobileBurger) {
          var defaultBurgerNode = createElement('navbar-burger', {
            props: {
              isOpened: this.isOpened
            },
            on: {
              click: this.toggleActive
            }
          });
          var hasBurgerSlot = !!this.$scopedSlots.burger;
          return hasBurgerSlot ? this.$scopedSlots.burger({
            isOpened: this.isOpened,
            toggleActive: this.toggleActive
          }) : defaultBurgerNode;
        }
      },
      genNavbarSlotsNode: function genNavbarSlotsNode(createElement) {
        return createElement('div', {
          staticClass: 'navbar-menu',
          class: {
            'is-active': this.isOpened
          }
        }, [this.genMenuPosition(createElement, 'start'), this.genMenuPosition(createElement, 'end')]);
      },
      genMenuPosition: function genMenuPosition(createElement, positionName) {
        return createElement('div', {
          staticClass: "navbar-".concat(positionName)
        }, this.$slots[positionName]);
      }
    },
    beforeDestroy: function beforeDestroy() {
      this.removeBodyClass(FIXED_BOTTOM_CLASS);
      this.removeBodyClass(FIXED_TOP_CLASS);
    },
    render: function render(createElement, fn) {
      return this.genNavbar(createElement);
    }
  };

  /* script */
  const __vue_script__$u = script$u;

  /* template */

    /* style */
    const __vue_inject_styles__$u = undefined;
    /* scoped */
    const __vue_scope_id__$u = undefined;
    /* module identifier */
    const __vue_module_identifier__$u = undefined;
    /* functional template */
    const __vue_is_functional_template__$u = undefined;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Navbar = normalizeComponent_1(
      {},
      __vue_inject_styles__$u,
      __vue_script__$u,
      __vue_scope_id__$u,
      __vue_is_functional_template__$u,
      __vue_module_identifier__$u,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var clickableWhiteList = ['div', 'span'];
  var script$v = {
    name: 'BNavbarItem',
    inheritAttrs: false,
    props: {
      tag: {
        type: String,
        default: 'a'
      },
      active: Boolean
    },
    methods: {
      /**
       * Keypress event that is bound to the document
       */
      keyPress: function keyPress(event) {
        // Esc key
        // TODO: use code instead (because keyCode is actually deprecated)
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        if (event.keyCode === 27) {
          this.$parent.closeMenu();
        }
      },

      /**
       * Close parent if clicked outside.
       */
      handleClickEvent: function handleClickEvent(event) {
        var isOnWhiteList = clickableWhiteList.some(function (item) {
          return item === event.target.localName;
        });

        if (!isOnWhiteList) {
          if (this.$parent.$data._isNavDropdown) {
            this.$parent.closeMenu();
            this.$parent.$parent.closeMenu();
          } else {
            this.$parent.closeMenu();
          }
        }
      }
    },
    mounted: function mounted() {
      if (typeof window !== 'undefined') {
        this.$el.addEventListener('click', this.handleClickEvent);
        document.addEventListener('keyup', this.keyPress);
      }
    },
    beforeDestroy: function beforeDestroy() {
      if (typeof window !== 'undefined') {
        this.$el.removeEventListener('click', this.handleClickEvent);
        document.removeEventListener('keyup', this.keyPress);
      }
    }
  };

  /* script */
  const __vue_script__$v = script$v;

  /* template */
  var __vue_render__$r = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(_vm.tag,_vm._g(_vm._b({tag:"component",staticClass:"navbar-item",class:{
          'is-active': _vm.active
      }},'component',_vm.$attrs,false),_vm.$listeners),[_vm._t("default")],2)};
  var __vue_staticRenderFns__$r = [];

    /* style */
    const __vue_inject_styles__$v = undefined;
    /* scoped */
    const __vue_scope_id__$v = undefined;
    /* module identifier */
    const __vue_module_identifier__$v = undefined;
    /* functional template */
    const __vue_is_functional_template__$v = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var NavbarItem = normalizeComponent_1(
      { render: __vue_render__$r, staticRenderFns: __vue_staticRenderFns__$r },
      __vue_inject_styles__$v,
      __vue_script__$v,
      __vue_scope_id__$v,
      __vue_is_functional_template__$v,
      __vue_module_identifier__$v,
      undefined,
      undefined
    );

  //
  var script$w = {
    name: 'BNavbarDropdown',
    directives: {
      clickOutside: directive$1
    },
    props: {
      label: String,
      hoverable: Boolean,
      active: Boolean,
      right: Boolean,
      arrowless: Boolean,
      boxed: Boolean
    },
    data: function data() {
      return {
        newActive: this.active,
        _isNavDropdown: true // Used internally by NavbarItem

      };
    },
    watch: {
      active: function active(value) {
        this.newActive = value;
      }
    },
    methods: {
      showMenu: function showMenu() {
        this.newActive = true;
      },

      /**
      * See naming convetion of navbaritem
      */
      closeMenu: function closeMenu() {
        this.newActive = false;
      }
    }
  };

  /* script */
  const __vue_script__$w = script$w;

  /* template */
  var __vue_render__$s = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"click-outside",rawName:"v-click-outside",value:(_vm.closeMenu),expression:"closeMenu"}],staticClass:"navbar-item has-dropdown",class:{
          'is-hoverable': _vm.hoverable,
          'is-active': _vm.newActive
      }},[_c('a',{staticClass:"navbar-link",class:{
              'is-arrowless': _vm.arrowless
          },on:{"click":function($event){_vm.newActive = !_vm.newActive;}}},[(_vm.label)?[_vm._v(_vm._s(_vm.label))]:_vm._t("label")],2),_vm._v(" "),_c('div',{staticClass:"navbar-dropdown",class:{
              'is-right': _vm.right,
              'is-boxed': _vm.boxed
          }},[_vm._t("default")],2)])};
  var __vue_staticRenderFns__$s = [];

    /* style */
    const __vue_inject_styles__$w = undefined;
    /* scoped */
    const __vue_scope_id__$w = undefined;
    /* module identifier */
    const __vue_module_identifier__$w = undefined;
    /* functional template */
    const __vue_is_functional_template__$w = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var NavbarDropdown = normalizeComponent_1(
      { render: __vue_render__$s, staticRenderFns: __vue_staticRenderFns__$s },
      __vue_inject_styles__$w,
      __vue_script__$w,
      __vue_scope_id__$w,
      __vue_is_functional_template__$w,
      __vue_module_identifier__$w,
      undefined,
      undefined
    );

  var Plugin$h = {
    install: function install(Vue) {
      registerComponent(Vue, Navbar);
      registerComponent(Vue, NavbarItem);
      registerComponent(Vue, NavbarDropdown);
    }
  };
  use(Plugin$h);

  var _components$4;
  var script$x = {
    name: 'BNumberinput',
    components: (_components$4 = {}, _defineProperty(_components$4, Icon.name, Icon), _defineProperty(_components$4, Input.name, Input), _components$4),
    mixins: [FormElementMixin],
    inheritAttrs: false,
    props: {
      value: Number,
      min: [Number, String],
      max: [Number, String],
      step: [Number, String],
      disabled: Boolean,
      type: {
        type: String,
        default: 'is-primary'
      },
      editable: {
        type: Boolean,
        default: true
      },
      controlsRounded: {
        type: Boolean,
        default: false
      },
      controlsPosition: String
    },
    data: function data() {
      return {
        newValue: !isNaN(this.value) ? this.value : parseFloat(this.min) || 0,
        newStep: this.step || 1,
        _elementRef: 'input'
      };
    },
    computed: {
      computedValue: {
        get: function get() {
          return this.newValue;
        },
        set: function set(value) {
          var newValue = value;

          if (value === '') {
            newValue = parseFloat(this.min) || 0;
          }

          this.newValue = newValue;
          this.$emit('input', newValue);
          !this.isValid && this.$refs.input.checkHtml5Validity();
        }
      },
      fieldClasses: function fieldClasses() {
        return [{
          'has-addons': this.controlsPosition === 'compact'
        }, {
          'is-grouped': this.controlsPosition !== 'compact'
        }, {
          'is-expanded': this.expanded
        }];
      },
      buttonClasses: function buttonClasses() {
        return [this.type, this.size, {
          'is-rounded': this.controlsRounded
        }];
      },
      minNumber: function minNumber() {
        return typeof this.min === 'string' ? parseFloat(this.min) : this.min;
      },
      maxNumber: function maxNumber() {
        return typeof this.max === 'string' ? parseFloat(this.max) : this.max;
      },
      stepNumber: function stepNumber() {
        return typeof this.newStep === 'string' ? parseFloat(this.newStep) : this.newStep;
      },
      disabledMin: function disabledMin() {
        return this.computedValue - this.stepNumber < this.minNumber;
      },
      disabledMax: function disabledMax() {
        return this.computedValue + this.stepNumber > this.maxNumber;
      },
      stepDecimals: function stepDecimals() {
        var step = this.stepNumber.toString();
        var index = step.indexOf('.');

        if (index >= 0) {
          return step.substring(index + 1).length;
        }

        return 0;
      }
    },
    watch: {
      /**
      * When v-model is changed:
      *   1. Set internal value.
      */
      value: function value(_value) {
        this.newValue = _value;
      }
    },
    methods: {
      decrement: function decrement() {
        if (typeof this.minNumber === 'undefined' || this.computedValue - this.stepNumber >= this.minNumber) {
          var value = this.computedValue - this.stepNumber;
          this.computedValue = parseFloat(value.toFixed(this.stepDecimals));
        }
      },
      increment: function increment() {
        if (typeof this.maxNumber === 'undefined' || this.computedValue + this.stepNumber <= this.maxNumber) {
          var value = this.computedValue + this.stepNumber;
          this.computedValue = parseFloat(value.toFixed(this.stepDecimals));
        }
      },
      onControlClick: function onControlClick(event, inc) {
        // IE 11 -> filter click event
        if (event.detail !== 0 || event.type === 'click') return;
        if (inc) this.increment();else this.decrement();
      },
      onStartLongPress: function onStartLongPress(event, inc) {
        var _this = this;

        if (event.button !== 0 && event.type !== 'touchstart') return;
        this._$intervalTime = new Date();
        clearInterval(this._$intervalRef);
        this._$intervalRef = setInterval(function () {
          if (inc) _this.increment();else _this.decrement();
        }, 250);
      },
      onStopLongPress: function onStopLongPress(inc) {
        if (!this._$intervalRef) return;
        var d = new Date();

        if (d - this._$intervalTime < 250) {
          if (inc) this.increment();else this.decrement();
        }

        clearInterval(this._$intervalRef);
        this._$intervalRef = null;
      }
    }
  };

  /* script */
  const __vue_script__$x = script$x;

  /* template */
  var __vue_render__$t = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"b-numberinput field",class:_vm.fieldClasses},[_c('p',{staticClass:"control",on:{"mouseup":function($event){_vm.onStopLongPress(false);},"mouseleave":function($event){_vm.onStopLongPress(false);},"touchend":function($event){_vm.onStopLongPress(false);},"touchcancel":function($event){_vm.onStopLongPress(false);}}},[_c('button',{staticClass:"button",class:_vm.buttonClasses,attrs:{"type":"button","disabled":_vm.disabled || _vm.disabledMin},on:{"mousedown":function($event){_vm.onStartLongPress($event, false);},"touchstart":function($event){$event.preventDefault();_vm.onStartLongPress($event, false);},"click":function($event){_vm.onControlClick($event, false);}}},[_c('b-icon',{attrs:{"icon":"minus","pack":_vm.iconPack,"size":_vm.iconSize}})],1)]),_vm._v(" "),_c('b-input',_vm._b({ref:"input",attrs:{"type":"number","step":_vm.newStep,"max":_vm.max,"min":_vm.min,"size":_vm.size,"disabled":_vm.disabled,"readonly":!_vm.editable,"loading":_vm.loading,"rounded":_vm.rounded,"icon":_vm.icon,"icon-pack":_vm.iconPack,"autocomplete":_vm.autocomplete,"expanded":_vm.expanded,"use-html5-validation":_vm.useHtml5Validation},on:{"focus":function($event){_vm.$emit('focus', $event);},"blur":function($event){_vm.$emit('blur', $event);}},model:{value:(_vm.computedValue),callback:function ($$v) {_vm.computedValue=_vm._n($$v);},expression:"computedValue"}},'b-input',_vm.$attrs,false)),_vm._v(" "),_c('p',{staticClass:"control",on:{"mouseup":function($event){_vm.onStopLongPress(true);},"mouseleave":function($event){_vm.onStopLongPress(true);},"touchend":function($event){_vm.onStopLongPress(true);},"touchcancel":function($event){_vm.onStopLongPress(true);}}},[_c('button',{staticClass:"button",class:_vm.buttonClasses,attrs:{"type":"button","disabled":_vm.disabled || _vm.disabledMax},on:{"mousedown":function($event){_vm.onStartLongPress($event, true);},"touchstart":function($event){$event.preventDefault();_vm.onStartLongPress($event, true);},"click":function($event){_vm.onControlClick($event, true);}}},[_c('b-icon',{attrs:{"icon":"plus","pack":_vm.iconPack,"size":_vm.iconSize}})],1)])],1)};
  var __vue_staticRenderFns__$t = [];

    /* style */
    const __vue_inject_styles__$x = undefined;
    /* scoped */
    const __vue_scope_id__$x = undefined;
    /* module identifier */
    const __vue_module_identifier__$x = undefined;
    /* functional template */
    const __vue_is_functional_template__$x = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Numberinput = normalizeComponent_1(
      { render: __vue_render__$t, staticRenderFns: __vue_staticRenderFns__$t },
      __vue_inject_styles__$x,
      __vue_script__$x,
      __vue_scope_id__$x,
      __vue_is_functional_template__$x,
      __vue_module_identifier__$x,
      undefined,
      undefined
    );

  var Plugin$i = {
    install: function install(Vue) {
      registerComponent(Vue, Numberinput);
    }
  };
  use(Plugin$i);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$y = {
    name: 'BPaginationButton',
    props: {
      page: {
        type: Object,
        required: true
      },
      tag: {
        type: String,
        default: 'a',
        validator: function validator(value) {
          return ['a', 'button', 'input', 'router-link', 'nuxt-link', 'n-link', 'NuxtLink', 'NLink'].indexOf(value) >= 0;
        }
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      href: function href() {
        if (this.tag === 'a') {
          return '#';
        }
      },
      isDisabled: function isDisabled() {
        return this.disabled || this.page.disabled;
      }
    }
  };

  /* script */
  const __vue_script__$y = script$y;

  /* template */
  var __vue_render__$u = function () {
  var _obj;
  var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(_vm.tag,_vm._b({tag:"component",staticClass:"pagination-link",class:( _obj = { 'is-current': _vm.page.isCurrent }, _obj[_vm.page.class] = true, _obj ),attrs:{"role":"button","href":_vm.href,"disabled":_vm.isDisabled,"aria-label":_vm.page['aria-label'],"aria-current":_vm.page.isCurrent},on:{"click":function($event){$event.preventDefault();_vm.page.click($event);}}},'component',_vm.$attrs,false),[_vm._t("default",[_vm._v(_vm._s(_vm.page.number))])],2)};
  var __vue_staticRenderFns__$u = [];

    /* style */
    const __vue_inject_styles__$y = undefined;
    /* scoped */
    const __vue_scope_id__$y = undefined;
    /* module identifier */
    const __vue_module_identifier__$y = undefined;
    /* functional template */
    const __vue_is_functional_template__$y = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var PaginationButton = normalizeComponent_1(
      { render: __vue_render__$u, staticRenderFns: __vue_staticRenderFns__$u },
      __vue_inject_styles__$y,
      __vue_script__$y,
      __vue_scope_id__$y,
      __vue_is_functional_template__$y,
      __vue_module_identifier__$y,
      undefined,
      undefined
    );

  var _components$5;
  var script$z = {
    name: 'BPagination',
    components: (_components$5 = {}, _defineProperty(_components$5, Icon.name, Icon), _defineProperty(_components$5, PaginationButton.name, PaginationButton), _components$5),
    props: {
      total: [Number, String],
      perPage: {
        type: [Number, String],
        default: 20
      },
      current: {
        type: [Number, String],
        default: 1
      },
      rangeBefore: {
        type: [Number, String],
        default: 1
      },
      rangeAfter: {
        type: [Number, String],
        default: 1
      },
      size: String,
      simple: Boolean,
      rounded: Boolean,
      order: String,
      iconPack: String,
      iconPrev: {
        type: String,
        default: config$1.defaultIconPrev
      },
      iconNext: {
        type: String,
        default: config$1.defaultIconNext
      },
      ariaNextLabel: String,
      ariaPreviousLabel: String,
      ariaPageLabel: String,
      ariaCurrentLabel: String
    },
    computed: {
      rootClasses: function rootClasses() {
        return [this.order, this.size, {
          'is-simple': this.simple,
          'is-rounded': this.rounded
        }];
      },
      beforeCurrent: function beforeCurrent() {
        return parseInt(this.rangeBefore);
      },
      afterCurrent: function afterCurrent() {
        return parseInt(this.rangeAfter);
      },

      /**
      * Total page size (count).
      */
      pageCount: function pageCount() {
        return Math.ceil(this.total / this.perPage);
      },

      /**
      * First item of the page (count).
      */
      firstItem: function firstItem() {
        var firstItem = this.current * this.perPage - this.perPage + 1;
        return firstItem >= 0 ? firstItem : 0;
      },

      /**
      * Check if previous button is available.
      */
      hasPrev: function hasPrev() {
        return this.current > 1;
      },

      /**
      * Check if first page button should be visible.
      */
      hasFirst: function hasFirst() {
        return this.current >= 2 + this.beforeCurrent;
      },

      /**
      * Check if first ellipsis should be visible.
      */
      hasFirstEllipsis: function hasFirstEllipsis() {
        return this.current >= this.beforeCurrent + 4;
      },

      /**
      * Check if last page button should be visible.
      */
      hasLast: function hasLast() {
        return this.current <= this.pageCount - (1 + this.afterCurrent);
      },

      /**
      * Check if last ellipsis should be visible.
      */
      hasLastEllipsis: function hasLastEllipsis() {
        return this.current < this.pageCount - (2 + this.afterCurrent);
      },

      /**
      * Check if next button is available.
      */
      hasNext: function hasNext() {
        return this.current < this.pageCount;
      },

      /**
      * Get near pages, 1 before and 1 after the current.
      * Also add the click event to the array.
      */
      pagesInRange: function pagesInRange() {
        if (this.simple) return;
        var left = Math.max(1, this.current - this.beforeCurrent);

        if (left - 1 === 2) {
          left--; // Do not show the ellipsis if there is only one to hide
        }

        var right = Math.min(this.current + this.afterCurrent, this.pageCount);

        if (this.pageCount - right === 2) {
          right++; // Do not show the ellipsis if there is only one to hide
        }

        var pages = [];

        for (var i = left; i <= right; i++) {
          pages.push(this.getPage(i));
        }

        return pages;
      }
    },
    watch: {
      /**
      * If current page is trying to be greater than page count, set to last.
      */
      pageCount: function pageCount(value) {
        if (this.current > value) this.last();
      }
    },
    methods: {
      /**
      * Previous button click listener.
      */
      prev: function prev(event) {
        this.changePage(this.current - 1, event);
      },

      /**
      * Next button click listener.
      */
      next: function next(event) {
        this.changePage(this.current + 1, event);
      },

      /**
      * First button click listener.
      */
      first: function first(event) {
        this.changePage(1, event);
      },

      /**
      * Last button click listener.
      */
      last: function last(event) {
        this.changePage(this.pageCount, event);
      },
      changePage: function changePage(num, event) {
        if (this.current === num || num < 1 || num > this.pageCount) return;
        this.$emit('change', num);
        this.$emit('update:current', num); // Set focus on element to keep tab order

        if (event && event.target) {
          this.$nextTick(function () {
            return event.target.focus();
          });
        }
      },
      getPage: function getPage(num) {
        var _this = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return {
          number: num,
          isCurrent: this.current === num,
          click: function click(event) {
            return _this.changePage(num, event);
          },
          disabled: options.disabled || false,
          class: options.class || '',
          'aria-label': options['aria-label'] || this.getAriaPageLabel(num, this.current === num)
        };
      },

      /**
      * Get text for aria-label according to page number.
      */
      getAriaPageLabel: function getAriaPageLabel(pageNumber, isCurrent) {
        if (this.ariaPageLabel && (!isCurrent || !this.ariaCurrentLabel)) {
          return this.ariaPageLabel + ' ' + pageNumber + '.';
        } else if (this.ariaPageLabel && isCurrent && this.ariaCurrentLabel) {
          return this.ariaCurrentLabel + ', ' + this.ariaPageLabel + ' ' + pageNumber + '.';
        }

        return null;
      }
    }
  };

  /* script */
  const __vue_script__$z = script$z;

  /* template */
  var __vue_render__$v = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('nav',{staticClass:"pagination",class:_vm.rootClasses},[(_vm.$scopedSlots.previous)?_vm._t("previous",[_c('b-icon',{attrs:{"icon":_vm.iconPrev,"pack":_vm.iconPack,"both":"","aria-hidden":"true"}})],{page:_vm.getPage(_vm.current - 1, {
              disabled: !_vm.hasPrev,
              class: 'pagination-previous',
              'aria-label': _vm.ariaPreviousLabel
      })}):_c('BPaginationButton',{staticClass:"pagination-previous",attrs:{"disabled":!_vm.hasPrev,"page":_vm.getPage(_vm.current - 1)}},[_c('b-icon',{attrs:{"icon":_vm.iconPrev,"pack":_vm.iconPack,"both":"","aria-hidden":"true"}})],1),_vm._v(" "),(_vm.$scopedSlots.next)?_vm._t("next",[_c('b-icon',{attrs:{"icon":_vm.iconNext,"pack":_vm.iconPack,"both":"","aria-hidden":"true"}})],{page:_vm.getPage(_vm.current + 1, {
              disabled: !_vm.hasNext,
              class: 'pagination-next',
              'aria-label': _vm.ariaNextLabel
      })}):_c('BPaginationButton',{staticClass:"pagination-next",attrs:{"disabled":!_vm.hasNext,"page":_vm.getPage(_vm.current + 1)}},[_c('b-icon',{attrs:{"icon":_vm.iconNext,"pack":_vm.iconPack,"both":"","aria-hidden":"true"}})],1),_vm._v(" "),(_vm.simple)?_c('small',{staticClass:"info"},[(_vm.perPage == 1)?[_vm._v("\n            "+_vm._s(_vm.firstItem)+" / "+_vm._s(_vm.total)+"\n        ")]:[_vm._v("\n            "+_vm._s(_vm.firstItem)+"-"+_vm._s(Math.min(_vm.current * _vm.perPage, _vm.total))+" / "+_vm._s(_vm.total)+"\n        ")]],2):_c('ul',{staticClass:"pagination-list"},[(_vm.hasFirst)?_c('li',[(_vm.$scopedSlots.default)?_vm._t("default",null,{page:_vm.getPage(1)}):_c('BPaginationButton',{attrs:{"page":_vm.getPage(1)}})],2):_vm._e(),_vm._v(" "),(_vm.hasFirstEllipsis)?_c('li',[_c('span',{staticClass:"pagination-ellipsis"},[_vm._v("…")])]):_vm._e(),_vm._v(" "),_vm._l((_vm.pagesInRange),function(page){return _c('li',{key:page.number},[(_vm.$scopedSlots.default)?_vm._t("default",null,{page:page}):_c('BPaginationButton',{attrs:{"page":page}})],2)}),_vm._v(" "),(_vm.hasLastEllipsis)?_c('li',[_c('span',{staticClass:"pagination-ellipsis"},[_vm._v("…")])]):_vm._e(),_vm._v(" "),(_vm.hasLast)?_c('li',[(_vm.$scopedSlots.default)?_vm._t("default",null,{page:_vm.getPage(_vm.pageCount)}):_c('BPaginationButton',{attrs:{"page":_vm.getPage(_vm.pageCount)}})],2):_vm._e()],2)],2)};
  var __vue_staticRenderFns__$v = [];

    /* style */
    const __vue_inject_styles__$z = undefined;
    /* scoped */
    const __vue_scope_id__$z = undefined;
    /* module identifier */
    const __vue_module_identifier__$z = undefined;
    /* functional template */
    const __vue_is_functional_template__$z = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Pagination = normalizeComponent_1(
      { render: __vue_render__$v, staticRenderFns: __vue_staticRenderFns__$v },
      __vue_inject_styles__$z,
      __vue_script__$z,
      __vue_scope_id__$z,
      __vue_is_functional_template__$z,
      __vue_module_identifier__$z,
      undefined,
      undefined
    );

  var Plugin$j = {
    install: function install(Vue) {
      registerComponent(Vue, Pagination);
      registerComponent(Vue, PaginationButton);
    }
  };
  use(Plugin$j);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$A = {
    name: 'BProgress',
    props: {
      type: {
        type: [String, Object],
        default: 'is-darkgrey'
      },
      size: String,
      value: {
        type: Number,
        default: undefined
      },
      max: {
        type: Number,
        default: 100
      },
      showValue: {
        type: Boolean,
        default: false
      },
      format: {
        type: String,
        default: 'raw',
        validator: function validator(value) {
          return ['raw', 'percent'].indexOf(value) >= 0;
        }
      },
      precision: {
        type: Number,
        default: 2
      },
      keepTrailingZeroes: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      isIndeterminate: function isIndeterminate() {
        return this.value === undefined || this.value === null;
      },
      newType: function newType() {
        return [this.size, this.type];
      },
      newValue: function newValue() {
        if (this.value === undefined || this.value === null || isNaN(this.value)) {
          return undefined;
        }

        if (this.format === 'percent') {
          var _val = this.toFixed(this.value * this.max / 100);

          return "".concat(_val, "%");
        }

        var val = this.toFixed(this.value);
        return val;
      }
    },
    watch: {
      value: function value(_value) {
        this.setValue(_value);
      }
    },
    methods: {
      /**
      * When value is changed back to undefined, value of native progress get reset to 0.
      * Need to add and remove the value attribute to have the indeterminate or not.
      */
      setValue: function setValue(value) {
        if (this.isIndeterminate) {
          this.$refs.progress.removeAttribute('value');
        } else {
          this.$refs.progress.setAttribute('value', value);
        }
      },
      // Custom function that imitate the javascript toFixed method with improved rounding
      toFixed: function toFixed(num) {
        var fixed = (+"".concat(Math.round(+"".concat(num, "e").concat(this.precision)), "e").concat(-this.precision)).toFixed(this.precision);

        if (!this.keepTrailingZeroes) {
          fixed = fixed.replace(/\.?0+$/, '');
        }

        return fixed;
      }
    },
    mounted: function mounted() {
      this.setValue(this.value);
    }
  };

  /* script */
  const __vue_script__$A = script$A;

  /* template */
  var __vue_render__$w = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"progress-wrapper"},[_c('progress',{ref:"progress",staticClass:"progress",class:_vm.newType,attrs:{"max":_vm.max}},[_vm._v(_vm._s(_vm.newValue))]),_vm._v(" "),(_vm.showValue)?_c('p',{staticClass:"progress-value"},[_vm._t("default",[_vm._v(_vm._s(_vm.newValue))])],2):_vm._e()])};
  var __vue_staticRenderFns__$w = [];

    /* style */
    const __vue_inject_styles__$A = undefined;
    /* scoped */
    const __vue_scope_id__$A = undefined;
    /* module identifier */
    const __vue_module_identifier__$A = undefined;
    /* functional template */
    const __vue_is_functional_template__$A = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Progress = normalizeComponent_1(
      { render: __vue_render__$w, staticRenderFns: __vue_staticRenderFns__$w },
      __vue_inject_styles__$A,
      __vue_script__$A,
      __vue_scope_id__$A,
      __vue_is_functional_template__$A,
      __vue_module_identifier__$A,
      undefined,
      undefined
    );

  var Plugin$k = {
    install: function install(Vue) {
      registerComponent(Vue, Progress);
    }
  };
  use(Plugin$k);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$B = {
    name: 'BRadio',
    props: {
      value: [String, Number, Boolean, Function, Object, Array],
      nativeValue: [String, Number, Boolean, Function, Object, Array],
      type: String,
      disabled: Boolean,
      required: Boolean,
      name: String,
      size: String
    },
    data: function data() {
      return {
        newValue: this.value
      };
    },
    computed: {
      computedValue: {
        get: function get() {
          return this.newValue;
        },
        set: function set(value) {
          this.newValue = value;
          this.$emit('input', value);
        }
      }
    },
    watch: {
      /**
      * When v-model change, set internal value.
      */
      value: function value(_value) {
        this.newValue = _value;
      }
    },
    methods: {
      focus: function focus() {
        // MacOS FireFox and Safari do not focus when clicked
        this.$refs.input.focus();
      }
    }
  };

  /* script */
  const __vue_script__$B = script$B;

  /* template */
  var __vue_render__$x = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('label',{ref:"label",staticClass:"b-radio radio",class:[_vm.size, { 'is-disabled': _vm.disabled }],attrs:{"disabled":_vm.disabled},on:{"click":_vm.focus,"keydown":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }$event.preventDefault();_vm.$refs.label.click();}}},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.computedValue),expression:"computedValue"}],ref:"input",attrs:{"type":"radio","disabled":_vm.disabled,"required":_vm.required,"name":_vm.name},domProps:{"value":_vm.nativeValue,"checked":_vm._q(_vm.computedValue,_vm.nativeValue)},on:{"click":function($event){$event.stopPropagation();},"change":function($event){_vm.computedValue=_vm.nativeValue;}}}),_vm._v(" "),_c('span',{staticClass:"check",class:_vm.type}),_vm._v(" "),_c('span',{staticClass:"control-label"},[_vm._t("default")],2)])};
  var __vue_staticRenderFns__$x = [];

    /* style */
    const __vue_inject_styles__$B = undefined;
    /* scoped */
    const __vue_scope_id__$B = undefined;
    /* module identifier */
    const __vue_module_identifier__$B = undefined;
    /* functional template */
    const __vue_is_functional_template__$B = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Radio = normalizeComponent_1(
      { render: __vue_render__$x, staticRenderFns: __vue_staticRenderFns__$x },
      __vue_inject_styles__$B,
      __vue_script__$B,
      __vue_scope_id__$B,
      __vue_is_functional_template__$B,
      __vue_module_identifier__$B,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$C = {
    name: 'BRadioButton',
    props: {
      value: [String, Number, Boolean, Function, Object, Array],
      nativeValue: [String, Number, Boolean, Function, Object, Array],
      type: {
        type: String,
        default: 'is-primary'
      },
      disabled: Boolean,
      required: Boolean,
      expanded: Boolean,
      name: String,
      size: String
    },
    data: function data() {
      return {
        newValue: this.value,
        isFocused: false
      };
    },
    computed: {
      computedValue: {
        get: function get() {
          return this.newValue;
        },
        set: function set(value) {
          this.newValue = value;
          this.$emit('input', value);
        }
      }
    },
    watch: {
      /**
      * When v-model change, set internal value.
      */
      value: function value(_value) {
        this.newValue = _value;
      }
    },
    methods: {
      focus: function focus() {
        // MacOS FireFox and Safari do not focus when clicked
        this.$refs.input.focus();
      }
    }
  };

  /* script */
  const __vue_script__$C = script$C;

  /* template */
  var __vue_render__$y = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"control",class:{ 'is-expanded': _vm.expanded }},[_c('label',{ref:"label",staticClass:"b-radio radio button",class:[_vm.newValue === _vm.nativeValue ? _vm.type : null, _vm.size, {
              'is-disabled': _vm.disabled,
              'is-focused': _vm.isFocused
          }],attrs:{"disabled":_vm.disabled},on:{"click":_vm.focus,"keydown":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }$event.preventDefault();_vm.$refs.label.click();}}},[_vm._t("default"),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.computedValue),expression:"computedValue"}],ref:"input",attrs:{"type":"radio","disabled":_vm.disabled,"required":_vm.required,"name":_vm.name},domProps:{"value":_vm.nativeValue,"checked":_vm._q(_vm.computedValue,_vm.nativeValue)},on:{"click":function($event){$event.stopPropagation();},"focus":function($event){_vm.isFocused = true;},"blur":function($event){_vm.isFocused = false;},"change":function($event){_vm.computedValue=_vm.nativeValue;}}})],2)])};
  var __vue_staticRenderFns__$y = [];

    /* style */
    const __vue_inject_styles__$C = undefined;
    /* scoped */
    const __vue_scope_id__$C = undefined;
    /* module identifier */
    const __vue_module_identifier__$C = undefined;
    /* functional template */
    const __vue_is_functional_template__$C = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var RadioButton = normalizeComponent_1(
      { render: __vue_render__$y, staticRenderFns: __vue_staticRenderFns__$y },
      __vue_inject_styles__$C,
      __vue_script__$C,
      __vue_scope_id__$C,
      __vue_is_functional_template__$C,
      __vue_module_identifier__$C,
      undefined,
      undefined
    );

  var Plugin$l = {
    install: function install(Vue) {
      registerComponent(Vue, Radio);
      registerComponent(Vue, RadioButton);
    }
  };
  use(Plugin$l);

  var script$D = {
    name: 'BRate',
    components: _defineProperty({}, Icon.name, Icon),
    props: {
      value: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 5
      },
      icon: {
        type: String,
        default: 'star'
      },
      iconPack: String,
      size: String,
      spaced: Boolean,
      rtl: Boolean,
      disabled: Boolean,
      showScore: Boolean,
      showText: Boolean,
      customText: String,
      texts: Array
    },
    data: function data() {
      return {
        newValue: this.value,
        hoverValue: 0
      };
    },
    computed: {
      halfStyle: function halfStyle() {
        return "width:".concat(this.valueDecimal, "%");
      },
      showMe: function showMe() {
        var result = '';

        if (this.showScore) {
          result = this.disabled ? this.value : this.newValue;
          if (result === 0) result = '';
        } else if (this.showText) {
          result = this.texts[Math.ceil(this.newValue) - 1];
        }

        return result;
      },
      valueDecimal: function valueDecimal() {
        return this.value * 100 - Math.floor(this.value) * 100;
      }
    },
    watch: {
      // When v-model is changed set the new value.
      value: function value(_value) {
        this.newValue = _value;
      }
    },
    methods: {
      resetNewValue: function resetNewValue() {
        if (this.disabled) return;
        this.hoverValue = 0;
      },
      previewRate: function previewRate(index, event) {
        if (this.disabled) return;
        this.hoverValue = index;
        event.stopPropagation();
      },
      confirmValue: function confirmValue(index) {
        if (this.disabled) return;
        this.newValue = index;
        this.$emit('change', this.newValue);
        this.$emit('input', this.newValue);
      },
      checkHalf: function checkHalf(index) {
        var showWhenDisabled = this.disabled && this.valueDecimal > 0 && index - 1 < this.value && index > this.value;
        return showWhenDisabled;
      },
      rateClass: function rateClass(index) {
        var output = '';
        var currentValue = this.hoverValue !== 0 ? this.hoverValue : this.newValue;

        if (index <= currentValue) {
          output = 'set-on';
        } else if (this.disabled && Math.ceil(this.value) === index) {
          output = 'set-half';
        }

        return output;
      }
    }
  };

  /* script */
  const __vue_script__$D = script$D;

  /* template */
  var __vue_render__$z = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"rate",class:{ 'is-disabled': _vm.disabled, 'is-spaced': _vm.spaced, 'is-rtl': _vm.rtl }},[_vm._l((_vm.max),function(item,index){return _c('div',{key:index,staticClass:"rate-item",class:_vm.rateClass(item),on:{"mousemove":function($event){_vm.previewRate(item, $event);},"mouseleave":_vm.resetNewValue,"click":function($event){$event.preventDefault();_vm.confirmValue(item);}}},[_c('b-icon',{attrs:{"pack":_vm.iconPack,"icon":_vm.icon,"size":_vm.size}}),_vm._v(" "),(_vm.checkHalf(item))?_c('b-icon',{staticClass:"is-half",style:(_vm.halfStyle),attrs:{"pack":_vm.iconPack,"icon":_vm.icon,"size":_vm.size}}):_vm._e()],1)}),_vm._v(" "),(_vm.showText || _vm.showScore || _vm.customText)?_c('div',{staticClass:"rate-text",class:_vm.size},[_c('span',[_vm._v(_vm._s(_vm.showMe))]),_vm._v(" "),(_vm.customText && !_vm.showText)?_c('span',[_vm._v(_vm._s(_vm.customText))]):_vm._e()]):_vm._e()],2)};
  var __vue_staticRenderFns__$z = [];

    /* style */
    const __vue_inject_styles__$D = undefined;
    /* scoped */
    const __vue_scope_id__$D = undefined;
    /* module identifier */
    const __vue_module_identifier__$D = undefined;
    /* functional template */
    const __vue_is_functional_template__$D = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Rate = normalizeComponent_1(
      { render: __vue_render__$z, staticRenderFns: __vue_staticRenderFns__$z },
      __vue_inject_styles__$D,
      __vue_script__$D,
      __vue_scope_id__$D,
      __vue_is_functional_template__$D,
      __vue_module_identifier__$D,
      undefined,
      undefined
    );

  var Plugin$m = {
    install: function install(Vue) {
      registerComponent(Vue, Rate);
    }
  };
  use(Plugin$m);

  var Plugin$n = {
    install: function install(Vue) {
      registerComponent(Vue, Select);
    }
  };
  use(Plugin$n);

  //
  var script$E = {
    name: 'BTooltip',
    props: {
      active: {
        type: Boolean,
        default: true
      },
      type: String,
      label: String,
      position: {
        type: String,
        default: 'is-top',
        validator: function validator(value) {
          return ['is-top', 'is-bottom', 'is-left', 'is-right'].indexOf(value) > -1;
        }
      },
      always: Boolean,
      animated: Boolean,
      square: Boolean,
      dashed: Boolean,
      multilined: Boolean,
      size: {
        type: String,
        default: 'is-medium'
      },
      delay: Number
    },
    computed: {
      newType: function newType() {
        return this.type || config$1.defaultTooltipType;
      },
      newAnimated: function newAnimated() {
        return this.animated || config$1.defaultTooltipAnimated;
      },
      newDelay: function newDelay() {
        return this.delay || config$1.defaultTooltipDelay;
      }
    }
  };

  /* script */
  const __vue_script__$E = script$E;

  /* template */
  var __vue_render__$A = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{class:[_vm.newType, _vm.position, _vm.size, {
          'b-tooltip': _vm.active,
          'is-square': _vm.square,
          'is-animated': _vm.newAnimated,
          'is-always': _vm.always,
          'is-multiline': _vm.multilined,
          'is-dashed': _vm.dashed
      }],style:({'transition-delay': (_vm.newDelay + "ms")}),attrs:{"data-label":_vm.label}},[_vm._t("default")],2)};
  var __vue_staticRenderFns__$A = [];

    /* style */
    const __vue_inject_styles__$E = undefined;
    /* scoped */
    const __vue_scope_id__$E = undefined;
    /* module identifier */
    const __vue_module_identifier__$E = undefined;
    /* functional template */
    const __vue_is_functional_template__$E = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Tooltip = normalizeComponent_1(
      { render: __vue_render__$A, staticRenderFns: __vue_staticRenderFns__$A },
      __vue_inject_styles__$E,
      __vue_script__$E,
      __vue_scope_id__$E,
      __vue_is_functional_template__$E,
      __vue_module_identifier__$E,
      undefined,
      undefined
    );

  var script$F = {
    name: 'BSliderThumb',
    components: _defineProperty({}, Tooltip.name, Tooltip),
    inheritAttrs: false,
    props: {
      value: {
        type: Number,
        default: 0
      },
      type: {
        type: String,
        default: ''
      },
      tooltip: {
        type: Boolean,
        default: true
      },
      customFormatter: Function
    },
    data: function data() {
      return {
        isFocused: false,
        dragging: false,
        startX: 0,
        startPosition: 0,
        newPosition: null,
        oldValue: this.value
      };
    },
    computed: {
      disabled: function disabled() {
        return this.$parent.disabled;
      },
      max: function max() {
        return this.$parent.max;
      },
      min: function min() {
        return this.$parent.min;
      },
      step: function step() {
        return this.$parent.step;
      },
      precision: function precision() {
        return this.$parent.precision;
      },
      currentPosition: function currentPosition() {
        return "".concat((this.value - this.min) / (this.max - this.min) * 100, "%");
      },
      wrapperStyle: function wrapperStyle() {
        return {
          left: this.currentPosition
        };
      },
      tooltipLabel: function tooltipLabel() {
        return typeof this.customFormatter !== 'undefined' ? this.customFormatter(this.value) : this.value.toString();
      }
    },
    methods: {
      onFocus: function onFocus() {
        this.isFocused = true;
      },
      onBlur: function onBlur() {
        this.isFocused = false;
      },
      onButtonDown: function onButtonDown(event) {
        if (this.disabled) return;
        event.preventDefault();
        this.onDragStart(event);

        if (typeof window !== 'undefined') {
          document.addEventListener('mousemove', this.onDragging);
          document.addEventListener('touchmove', this.onDragging);
          document.addEventListener('mouseup', this.onDragEnd);
          document.addEventListener('touchend', this.onDragEnd);
          document.addEventListener('contextmenu', this.onDragEnd);
        }
      },
      onLeftKeyDown: function onLeftKeyDown() {
        if (this.disabled || this.value === this.min) return;
        this.newPosition = parseFloat(this.currentPosition) - this.step / (this.max - this.min) * 100;
        this.setPosition(this.newPosition);
        this.$parent.emitValue('change');
      },
      onRightKeyDown: function onRightKeyDown() {
        if (this.disabled || this.value === this.max) return;
        this.newPosition = parseFloat(this.currentPosition) + this.step / (this.max - this.min) * 100;
        this.setPosition(this.newPosition);
        this.$parent.emitValue('change');
      },
      onHomeKeyDown: function onHomeKeyDown() {
        if (this.disabled || this.value === this.min) return;
        this.newPosition = 0;
        this.setPosition(this.newPosition);
        this.$parent.emitValue('change');
      },
      onEndKeyDown: function onEndKeyDown() {
        if (this.disabled || this.value === this.max) return;
        this.newPosition = 100;
        this.setPosition(this.newPosition);
        this.$parent.emitValue('change');
      },
      onDragStart: function onDragStart(event) {
        this.dragging = true;
        this.$emit('dragstart');

        if (event.type === 'touchstart') {
          event.clientX = event.touches[0].clientX;
        }

        this.startX = event.clientX;
        this.startPosition = parseFloat(this.currentPosition);
        this.newPosition = this.startPosition;
      },
      onDragging: function onDragging(event) {
        if (this.dragging) {
          if (event.type === 'touchmove') {
            event.clientX = event.touches[0].clientX;
          }

          var diff = (event.clientX - this.startX) / this.$parent.sliderSize * 100;
          this.newPosition = this.startPosition + diff;
          this.setPosition(this.newPosition);
        }
      },
      onDragEnd: function onDragEnd() {
        this.dragging = false;
        this.$emit('dragend');

        if (this.value !== this.oldValue) {
          this.$parent.emitValue('change');
        }

        this.setPosition(this.newPosition);

        if (typeof window !== 'undefined') {
          document.removeEventListener('mousemove', this.onDragging);
          document.removeEventListener('touchmove', this.onDragging);
          document.removeEventListener('mouseup', this.onDragEnd);
          document.removeEventListener('touchend', this.onDragEnd);
          document.removeEventListener('contextmenu', this.onDragEnd);
        }
      },
      setPosition: function setPosition(percent) {
        if (percent === null || isNaN(percent)) return;

        if (percent < 0) {
          percent = 0;
        } else if (percent > 100) {
          percent = 100;
        }

        var stepLength = 100 / ((this.max - this.min) / this.step);
        var steps = Math.round(percent / stepLength);
        var value = steps * stepLength / 100 * (this.max - this.min) + this.min;
        value = parseFloat(value.toFixed(this.precision));
        this.$emit('input', value);

        if (!this.dragging && value !== this.oldValue) {
          this.oldValue = value;
        }
      }
    }
  };

  /* script */
  const __vue_script__$F = script$F;

  /* template */
  var __vue_render__$B = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"b-slider-thumb-wrapper",class:{ 'is-dragging': _vm.dragging },style:(_vm.wrapperStyle)},[_c('b-tooltip',{attrs:{"label":_vm.tooltipLabel,"type":_vm.type,"always":_vm.dragging || _vm.isFocused,"active":!_vm.disabled && _vm.tooltip}},[_c('div',_vm._b({staticClass:"b-slider-thumb",attrs:{"tabindex":_vm.disabled ? false : 0},on:{"mousedown":_vm.onButtonDown,"touchstart":_vm.onButtonDown,"focus":_vm.onFocus,"blur":_vm.onBlur,"keydown":[function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"left",37,$event.key)){ return null; }if('button' in $event && $event.button !== 0){ return null; }$event.preventDefault();_vm.onLeftKeyDown($event);},function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"right",39,$event.key)){ return null; }if('button' in $event && $event.button !== 2){ return null; }$event.preventDefault();_vm.onRightKeyDown($event);},function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"down",40,$event.key)){ return null; }$event.preventDefault();_vm.onLeftKeyDown($event);},function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"up",38,$event.key)){ return null; }$event.preventDefault();_vm.onRightKeyDown($event);},function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"home",undefined,$event.key)){ return null; }$event.preventDefault();_vm.onHomeKeyDown($event);},function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"end",undefined,$event.key)){ return null; }$event.preventDefault();_vm.onEndKeyDown($event);}]}},'div',_vm.$attrs,false))])],1)};
  var __vue_staticRenderFns__$B = [];

    /* style */
    const __vue_inject_styles__$F = undefined;
    /* scoped */
    const __vue_scope_id__$F = undefined;
    /* module identifier */
    const __vue_module_identifier__$F = undefined;
    /* functional template */
    const __vue_is_functional_template__$F = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var SliderThumb = normalizeComponent_1(
      { render: __vue_render__$B, staticRenderFns: __vue_staticRenderFns__$B },
      __vue_inject_styles__$F,
      __vue_script__$F,
      __vue_scope_id__$F,
      __vue_is_functional_template__$F,
      __vue_module_identifier__$F,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$G = {
    name: 'BSliderTick',
    props: {
      value: {
        type: Number,
        default: 0
      }
    },
    computed: {
      position: function position() {
        var pos = (this.value - this.$parent.min) / (this.$parent.max - this.$parent.min) * 100;
        return pos >= 0 && pos <= 100 ? pos : 0;
      },
      hidden: function hidden() {
        return this.value === this.$parent.min || this.value === this.$parent.max;
      }
    },
    methods: {
      getTickStyle: function getTickStyle(position) {
        return {
          'left': position + '%'
        };
      }
    },
    created: function created() {
      if (!this.$parent.$data._isSlider) {
        this.$destroy();
        throw new Error('You should wrap bSliderTick on a bSlider');
      }
    }
  };

  /* script */
  const __vue_script__$G = script$G;

  /* template */
  var __vue_render__$C = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"b-slider-tick",class:{ 'is-tick-hidden': _vm.hidden },style:(_vm.getTickStyle(_vm.position))},[(_vm.$slots.default)?_c('span',{staticClass:"b-slider-tick-label"},[_vm._t("default")],2):_vm._e()])};
  var __vue_staticRenderFns__$C = [];

    /* style */
    const __vue_inject_styles__$G = undefined;
    /* scoped */
    const __vue_scope_id__$G = undefined;
    /* module identifier */
    const __vue_module_identifier__$G = undefined;
    /* functional template */
    const __vue_is_functional_template__$G = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var SliderTick = normalizeComponent_1(
      { render: __vue_render__$C, staticRenderFns: __vue_staticRenderFns__$C },
      __vue_inject_styles__$G,
      __vue_script__$G,
      __vue_scope_id__$G,
      __vue_is_functional_template__$G,
      __vue_module_identifier__$G,
      undefined,
      undefined
    );

  var _components$6;
  var script$H = {
    name: 'BSlider',
    components: (_components$6 = {}, _defineProperty(_components$6, SliderThumb.name, SliderThumb), _defineProperty(_components$6, SliderTick.name, SliderTick), _components$6),
    props: {
      value: {
        type: [Number, Array],
        default: 0
      },
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      step: {
        type: Number,
        default: 1
      },
      type: {
        type: String,
        default: 'is-primary'
      },
      size: String,
      ticks: {
        type: Boolean,
        default: false
      },
      tooltip: {
        type: Boolean,
        default: true
      },
      tooltipType: String,
      rounded: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      lazy: {
        type: Boolean,
        default: false
      },
      customFormatter: Function,
      ariaLabel: [String, Array]
    },
    data: function data() {
      return {
        value1: null,
        value2: null,
        dragging: false,
        isRange: false,
        _isSlider: true // Used by Thumb and Tick

      };
    },
    computed: {
      newTooltipType: function newTooltipType() {
        return this.tooltipType ? this.tooltipType : this.type;
      },
      tickValues: function tickValues() {
        if (!this.ticks || this.min > this.max || this.step === 0) return [];
        var result = [];

        for (var i = this.min + this.step; i < this.max; i = i + this.step) {
          result.push(i);
        }

        return result;
      },
      minValue: function minValue() {
        return Math.min(this.value1, this.value2);
      },
      maxValue: function maxValue() {
        return Math.max(this.value1, this.value2);
      },
      barSize: function barSize() {
        return this.isRange ? "".concat(100 * (this.maxValue - this.minValue) / (this.max - this.min), "%") : "".concat(100 * (this.value1 - this.min) / (this.max - this.min), "%");
      },
      barStart: function barStart() {
        return this.isRange ? "".concat(100 * (this.minValue - this.min) / (this.max - this.min), "%") : '0%';
      },
      precision: function precision() {
        var precisions = [this.min, this.max, this.step].map(function (item) {
          var decimal = ('' + item).split('.')[1];
          return decimal ? decimal.length : 0;
        });
        return Math.max.apply(Math, _toConsumableArray(precisions));
      },
      barStyle: function barStyle() {
        return {
          width: this.barSize,
          left: this.barStart
        };
      },
      sliderSize: function sliderSize() {
        return this.$refs.slider['clientWidth'];
      },
      rootClasses: function rootClasses() {
        return {
          'is-rounded': this.rounded,
          'is-dragging': this.dragging,
          'is-disabled': this.disabled
        };
      }
    },
    watch: {
      /**
      * When v-model is changed set the new active step.
      */
      value: function value(_value) {
        this.setValues(_value);
      },
      value1: function value1() {
        this.onInternalValueUpdate();
      },
      value2: function value2() {
        this.onInternalValueUpdate();
      },
      min: function min() {
        this.setValues(this.value);
      },
      max: function max() {
        this.setValues(this.value);
      }
    },
    methods: {
      setValues: function setValues(newValue) {
        if (this.min > this.max) {
          return;
        }

        if (Array.isArray(newValue)) {
          this.isRange = true;
          var smallValue = typeof newValue[0] !== 'number' || isNaN(newValue[0]) ? this.min : Math.min(Math.max(this.min, newValue[0]), this.max);
          var largeValue = typeof newValue[1] !== 'number' || isNaN(newValue[1]) ? this.max : Math.max(Math.min(this.max, newValue[1]), this.min);
          this.value1 = this.isThumbReversed ? largeValue : smallValue;
          this.value2 = this.isThumbReversed ? smallValue : largeValue;
        } else {
          this.isRange = false;
          this.value1 = isNaN(newValue) ? this.min : Math.min(this.max, Math.max(this.min, newValue));
          this.value2 = null;
        }
      },
      onInternalValueUpdate: function onInternalValueUpdate() {
        if (this.isRange) {
          this.isThumbReversed = this.value1 > this.value2;
        }

        if (!this.lazy || !this.dragging) {
          this.emitValue('input');
        }

        if (this.dragging) {
          this.emitValue('dragging');
        }
      },
      onSliderClick: function onSliderClick(event) {
        if (this.disabled || this.isTrackClickDisabled) return;
        var sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left;
        var percent = (event.clientX - sliderOffsetLeft) / this.sliderSize * 100;
        var targetValue = this.min + percent * (this.max - this.min) / 100;
        var diffFirst = Math.abs(targetValue - this.value1);

        if (!this.isRange) {
          if (diffFirst < this.step / 2) return;
          this.$refs.button1.setPosition(percent);
        } else {
          var diffSecond = Math.abs(targetValue - this.value2);

          if (diffFirst <= diffSecond) {
            if (diffFirst < this.step / 2) return;
            this.$refs['button1'].setPosition(percent);
          } else {
            if (diffSecond < this.step / 2) return;
            this.$refs['button2'].setPosition(percent);
          }
        }

        this.emitValue('change');
      },
      onDragStart: function onDragStart() {
        this.dragging = true;
        this.$emit('dragstart');
      },
      onDragEnd: function onDragEnd() {
        var _this = this;

        this.isTrackClickDisabled = true;
        setTimeout(function () {
          // avoid triggering onSliderClick after dragend
          _this.isTrackClickDisabled = false;
        }, 0);
        this.dragging = false;
        this.$emit('dragend');

        if (this.lazy) {
          this.emitValue('input');
        }
      },
      emitValue: function emitValue(type) {
        this.$emit(type, this.isRange ? [this.minValue, this.maxValue] : this.value1);
      }
    },
    created: function created() {
      this.isThumbReversed = false;
      this.isTrackClickDisabled = false;
      this.setValues(this.value);
    }
  };

  /* script */
  const __vue_script__$H = script$H;

  /* template */
  var __vue_render__$D = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"b-slider",class:[_vm.size, _vm.type, _vm.rootClasses]},[_c('div',{ref:"slider",staticClass:"b-slider-track",on:{"click":_vm.onSliderClick}},[_c('div',{staticClass:"b-slider-fill",style:(_vm.barStyle)}),_vm._v(" "),(_vm.ticks)?_vm._l((_vm.tickValues),function(val,key){return _c('b-slider-tick',{key:key,attrs:{"value":val}})}):_vm._e(),_vm._v(" "),_vm._t("default"),_vm._v(" "),_c('b-slider-thumb',{ref:"button1",attrs:{"type":_vm.newTooltipType,"tooltip":_vm.tooltip,"custom-formatter":_vm.customFormatter,"role":"slider","aria-valuenow":_vm.value1,"aria-valuemin":_vm.min,"aria-valuemax":_vm.max,"aria-orientation":"horizontal","aria-label":Array.isArray(_vm.ariaLabel) ? _vm.ariaLabel[0] : _vm.ariaLabel,"aria-disabled":_vm.disabled},on:{"dragstart":_vm.onDragStart,"dragend":_vm.onDragEnd},model:{value:(_vm.value1),callback:function ($$v) {_vm.value1=$$v;},expression:"value1"}}),_vm._v(" "),(_vm.isRange)?_c('b-slider-thumb',{ref:"button2",attrs:{"type":_vm.newTooltipType,"tooltip":_vm.tooltip,"custom-formatter":_vm.customFormatter,"role":"slider","aria-valuenow":_vm.value2,"aria-valuemin":_vm.min,"aria-valuemax":_vm.max,"aria-orientation":"horizontal","aria-label":Array.isArray(_vm.ariaLabel) ? _vm.ariaLabel[1] : '',"aria-disabled":_vm.disabled},on:{"dragstart":_vm.onDragStart,"dragend":_vm.onDragEnd},model:{value:(_vm.value2),callback:function ($$v) {_vm.value2=$$v;},expression:"value2"}}):_vm._e()],2)])};
  var __vue_staticRenderFns__$D = [];

    /* style */
    const __vue_inject_styles__$H = undefined;
    /* scoped */
    const __vue_scope_id__$H = undefined;
    /* module identifier */
    const __vue_module_identifier__$H = undefined;
    /* functional template */
    const __vue_is_functional_template__$H = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Slider = normalizeComponent_1(
      { render: __vue_render__$D, staticRenderFns: __vue_staticRenderFns__$D },
      __vue_inject_styles__$H,
      __vue_script__$H,
      __vue_scope_id__$H,
      __vue_is_functional_template__$H,
      __vue_module_identifier__$H,
      undefined,
      undefined
    );

  var Plugin$o = {
    install: function install(Vue) {
      registerComponent(Vue, Slider);
      registerComponent(Vue, SliderTick);
    }
  };
  use(Plugin$o);

  //
  var script$I = {
    name: 'BSnackbar',
    mixins: [NoticeMixin],
    props: {
      actionText: {
        type: String,
        default: 'OK'
      },
      onAction: {
        type: Function,
        default: function _default() {}
      },
      indefinite: {
        type: Boolean,
        default: false
      }
    },
    data: function data() {
      return {
        newDuration: this.duration || config$1.defaultSnackbarDuration
      };
    },
    methods: {
      /**
      * Click listener.
      * Call action prop before closing (from Mixin).
      */
      action: function action() {
        this.onAction();
        this.close();
      }
    }
  };

  /* script */
  const __vue_script__$I = script$I;

  /* template */
  var __vue_render__$E = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"enter-active-class":_vm.transition.enter,"leave-active-class":_vm.transition.leave}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.isActive),expression:"isActive"}],staticClass:"snackbar",class:[_vm.type,_vm.position]},[_c('div',{staticClass:"text",domProps:{"innerHTML":_vm._s(_vm.message)}}),_vm._v(" "),(_vm.actionText)?_c('div',{staticClass:"action",class:_vm.type,on:{"click":_vm.action}},[_c('button',{staticClass:"button"},[_vm._v(_vm._s(_vm.actionText))])]):_vm._e()])])};
  var __vue_staticRenderFns__$E = [];

    /* style */
    const __vue_inject_styles__$I = undefined;
    /* scoped */
    const __vue_scope_id__$I = undefined;
    /* module identifier */
    const __vue_module_identifier__$I = undefined;
    /* functional template */
    const __vue_is_functional_template__$I = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Snackbar = normalizeComponent_1(
      { render: __vue_render__$E, staticRenderFns: __vue_staticRenderFns__$E },
      __vue_inject_styles__$I,
      __vue_script__$I,
      __vue_scope_id__$I,
      __vue_is_functional_template__$I,
      __vue_module_identifier__$I,
      undefined,
      undefined
    );

  var SnackbarProgrammatic = {
    open: function open(params) {
      var message;
      var parent;
      if (typeof params === 'string') message = params;
      var defaultParam = {
        type: 'is-success',
        position: config$1.defaultSnackbarPosition || 'is-bottom-right',
        message: message
      };

      if (params.parent) {
        parent = params.parent;
        delete params.parent;
      }

      var propsData = Object.assign(defaultParam, params);
      var vm = typeof window !== 'undefined' && window.Vue ? window.Vue : Vue;
      var SnackbarComponent = vm.extend(Snackbar);
      return new SnackbarComponent({
        parent: parent,
        el: document.createElement('div'),
        propsData: propsData
      });
    }
  };
  var Plugin$p = {
    install: function install(Vue) {
      registerComponentProgrammatic(Vue, 'snackbar', SnackbarProgrammatic);
    }
  };
  use(Plugin$p);

  var SlotComponent = {
    name: 'BSlotComponent',
    props: {
      component: {
        type: Object,
        required: true
      },
      name: {
        type: String,
        default: 'default'
      },
      scoped: {
        type: Boolean
      },
      props: {
        type: Object
      },
      tag: {
        type: String,
        default: 'div'
      },
      event: {
        type: String,
        default: 'hook:updated'
      }
    },
    methods: {
      refresh: function refresh() {
        this.$forceUpdate();
      },
      isVueComponent: function isVueComponent() {
        return this.component && this.component._isVue;
      }
    },
    created: function created() {
      if (this.isVueComponent()) {
        this.component.$on(this.event, this.refresh);
      }
    },
    beforeDestroy: function beforeDestroy() {
      if (this.isVueComponent()) {
        this.component.$off(this.event, this.refresh);
      }
    },
    render: function render(createElement) {
      if (this.isVueComponent()) {
        return createElement(this.tag, {}, this.scoped ? this.component.$scopedSlots[this.name](this.props) : this.component.$slots[this.name]);
      }
    }
  };

  var _components$7;
  var script$J = {
    name: 'BSteps',
    components: (_components$7 = {}, _defineProperty(_components$7, Icon.name, Icon), _defineProperty(_components$7, SlotComponent.name, SlotComponent), _components$7),
    props: {
      value: Number,
      type: [String, Object],
      size: String,
      animated: {
        type: Boolean,
        default: true
      },
      destroyOnHide: {
        type: Boolean,
        default: false
      },
      iconPack: String,
      iconPrev: {
        type: String,
        default: config$1.defaultIconPrev
      },
      iconNext: {
        type: String,
        default: config$1.defaultIconNext
      },
      hasNavigation: {
        type: Boolean,
        default: true
      },
      ariaNextLabel: String,
      ariaPreviousLabel: String
    },
    data: function data() {
      return {
        activeStep: this.value || 0,
        stepItems: [],
        contentHeight: 0,
        isTransitioning: false,
        _isSteps: true // Used internally by StepItem

      };
    },
    computed: {
      mainClasses: function mainClasses() {
        return [this.type, this.size];
      },
      reversedStepItems: function reversedStepItems() {
        return this.stepItems.slice().reverse();
      },

      /**
       * Check the first visible step index.
       */
      firstVisibleStepIndex: function firstVisibleStepIndex() {
        return this.stepItems.map(function (step, idx) {
          return step.visible;
        }).indexOf(true);
      },

      /**
       * Check if previous button is available.
       */
      hasPrev: function hasPrev() {
        return this.firstVisibleStepIndex >= 0 && this.activeStep > this.firstVisibleStepIndex;
      },

      /**
       * Check the last visible step index.
       */
      lastVisibleStepIndex: function lastVisibleStepIndex() {
        var idx = this.reversedStepItems.map(function (step, idx) {
          return step.visible;
        }).indexOf(true);

        if (idx >= 0) {
          return this.stepItems.length - 1 - idx;
        }

        return idx;
      },

      /**
       * Check if next button is available.
       */
      hasNext: function hasNext() {
        return this.lastVisibleStepIndex >= 0 && this.activeStep < this.lastVisibleStepIndex;
      },
      navigationProps: function navigationProps() {
        return {
          previous: {
            disabled: !this.hasPrev,
            action: this.prev
          },
          next: {
            disabled: !this.hasNext,
            action: this.next
          }
        };
      }
    },
    watch: {
      /**
      * When v-model is changed set the new active step.
      */
      value: function value(_value) {
        this.changeStep(_value);
      },

      /**
      * When step-items are updated, set active one.
      */
      stepItems: function stepItems() {
        if (this.activeStep < this.stepItems.length) {
          this.stepItems[this.activeStep].isActive = true;
        }
      }
    },
    methods: {
      /**
      * Change the active step and emit change event.
      */
      changeStep: function changeStep(newIndex) {
        if (this.activeStep === newIndex) return;

        if (this.activeStep < this.stepItems.length) {
          this.stepItems[this.activeStep].deactivate(this.activeStep, newIndex);
        }

        this.stepItems[newIndex].activate(this.activeStep, newIndex);
        this.activeStep = newIndex;
        this.$emit('change', newIndex);
      },

      /**
          * Return if the step should be clickable or not.
          */
      isItemClickable: function isItemClickable(stepItem, index) {
        if (stepItem.clickable === undefined) {
          return this.activeStep > index;
        }

        return stepItem.clickable;
      },

      /**
      * Step click listener, emit input event and change active step.
      */
      stepClick: function stepClick(value) {
        this.$emit('input', value);
        this.changeStep(value);
      },

      /**
       * Previous button click listener.
       */
      prev: function prev() {
        var _this = this;

        if (!this.hasPrev) return;
        var prevItemIdx = this.reversedStepItems.map(function (step, idx) {
          return _this.stepItems.length - 1 - idx < _this.activeStep && step.visible;
        }).indexOf(true);

        if (prevItemIdx >= 0) {
          prevItemIdx = this.stepItems.length - 1 - prevItemIdx;
        }

        this.$emit('input', prevItemIdx);
        this.changeStep(prevItemIdx);
      },

      /**
       * Previous button click listener.
       */
      next: function next() {
        var _this2 = this;

        if (!this.hasNext) return;
        var nextItemIdx = this.stepItems.map(function (step, idx) {
          return idx > _this2.activeStep && step.visible;
        }).indexOf(true);
        this.$emit('input', nextItemIdx);
        this.changeStep(nextItemIdx);
      }
    },
    mounted: function mounted() {
      if (this.activeStep < this.stepItems.length) {
        this.stepItems[this.activeStep].isActive = true;
      }
    }
  };

  /* script */
  const __vue_script__$J = script$J;

  /* template */
  var __vue_render__$F = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"b-steps"},[_c('nav',{staticClass:"steps",class:_vm.mainClasses},[_c('ul',{staticClass:"step-items"},_vm._l((_vm.stepItems),function(stepItem,index){return _c('li',{directives:[{name:"show",rawName:"v-show",value:(stepItem.visible),expression:"stepItem.visible"}],key:index,staticClass:"step-item",class:[stepItem.type || _vm.type, {
                      'is-active': _vm.activeStep === index,
                      'is-previous': _vm.activeStep > index
              }]},[_c('a',{staticClass:"step-link",class:{'is-clickable': _vm.isItemClickable(stepItem, index)},on:{"click":function($event){_vm.isItemClickable(stepItem, index) && _vm.stepClick(index);}}},[_c('div',{staticClass:"step-marker"},[(stepItem.icon)?_c('b-icon',{attrs:{"icon":stepItem.icon,"pack":stepItem.iconPack,"size":_vm.size}}):_vm._e()],1),_vm._v(" "),_c('div',{staticClass:"step-details"},[_c('span',{staticClass:"step-title"},[_vm._v(_vm._s(stepItem.label))])])])])}))]),_vm._v(" "),_c('section',{staticClass:"step-content",class:{'is-transitioning': _vm.isTransitioning}},[_vm._t("default")],2),_vm._v(" "),_vm._t("navigation",[(_vm.hasNavigation)?_c('nav',{staticClass:"step-navigation"},[_c('a',{staticClass:"pagination-previous",attrs:{"role":"button","disabled":_vm.navigationProps.previous.disabled,"aria-label":_vm.ariaPreviousLabel},on:{"click":function($event){$event.preventDefault();_vm.navigationProps.previous.action($event);}}},[_c('b-icon',{attrs:{"icon":_vm.iconPrev,"pack":_vm.iconPack,"both":"","aria-hidden":"true"}})],1),_vm._v(" "),_c('a',{staticClass:"pagination-next",attrs:{"role":"button","disabled":_vm.navigationProps.next.disabled,"aria-label":_vm.ariaNextLabel},on:{"click":function($event){$event.preventDefault();_vm.navigationProps.next.action($event);}}},[_c('b-icon',{attrs:{"icon":_vm.iconNext,"pack":_vm.iconPack,"both":"","aria-hidden":"true"}})],1)]):_vm._e()],{previous:_vm.navigationProps.previous,next:_vm.navigationProps.next})],2)};
  var __vue_staticRenderFns__$F = [];

    /* style */
    const __vue_inject_styles__$J = undefined;
    /* scoped */
    const __vue_scope_id__$J = undefined;
    /* module identifier */
    const __vue_module_identifier__$J = undefined;
    /* functional template */
    const __vue_is_functional_template__$J = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Steps = normalizeComponent_1(
      { render: __vue_render__$F, staticRenderFns: __vue_staticRenderFns__$F },
      __vue_inject_styles__$J,
      __vue_script__$J,
      __vue_scope_id__$J,
      __vue_is_functional_template__$J,
      __vue_module_identifier__$J,
      undefined,
      undefined
    );

  var script$K = {
    name: 'BStepItem',
    props: {
      label: String,
      type: String | Object,
      icon: String,
      iconPack: String,
      clickable: {
        type: Boolean,
        default: undefined
      },
      visible: {
        type: Boolean,
        default: true
      }
    },
    data: function data() {
      return {
        isActive: false,
        transitionName: null
      };
    },
    methods: {
      /**
      * Activate step, alter animation name based on the index.
      */
      activate: function activate(oldIndex, index) {
        this.transitionName = index < oldIndex ? 'slide-next' : 'slide-prev';
        this.isActive = true;
      },

      /**
      * Deactivate step, alter animation name based on the index.
      */
      deactivate: function deactivate(oldIndex, index) {
        this.transitionName = index < oldIndex ? 'slide-next' : 'slide-prev';
        this.isActive = false;
      }
    },
    created: function created() {
      if (!this.$parent.$data._isSteps) {
        this.$destroy();
        throw new Error('You should wrap bStepItem on a bSteps');
      }

      this.$parent.stepItems.push(this);
    },
    beforeDestroy: function beforeDestroy() {
      var index = this.$parent.stepItems.indexOf(this);

      if (index >= 0) {
        this.$parent.stepItems.splice(index, 1);
      }
    },
    render: function render(createElement) {
      var _this = this;

      // if destroy apply v-if
      if (this.$parent.destroyOnHide) {
        if (!this.isActive || !this.visible) {
          return;
        }
      }

      var vnode = createElement('div', {
        directives: [{
          name: 'show',
          value: this.isActive && this.visible
        }],
        attrs: {
          'class': 'step-item'
        }
      }, this.$slots.default); // check animated prop

      if (this.$parent.animated) {
        return createElement('transition', {
          props: {
            'name': this.transitionName
          },
          on: {
            'before-enter': function beforeEnter() {
              _this.$parent.isTransitioning = true;
            },
            'after-enter': function afterEnter() {
              _this.$parent.isTransitioning = false;
            }
          }
        }, [vnode]);
      }

      return vnode;
    }
  };

  /* script */
  const __vue_script__$K = script$K;

  /* template */

    /* style */
    const __vue_inject_styles__$K = undefined;
    /* scoped */
    const __vue_scope_id__$K = undefined;
    /* module identifier */
    const __vue_module_identifier__$K = undefined;
    /* functional template */
    const __vue_is_functional_template__$K = undefined;
    /* style inject */
    
    /* style inject SSR */
    

    
    var StepItem = normalizeComponent_1(
      {},
      __vue_inject_styles__$K,
      __vue_script__$K,
      __vue_scope_id__$K,
      __vue_is_functional_template__$K,
      __vue_module_identifier__$K,
      undefined,
      undefined
    );

  var Plugin$q = {
    install: function install(Vue) {
      registerComponent(Vue, Steps);
      registerComponent(Vue, StepItem);
    }
  };
  use(Plugin$q);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$L = {
    name: 'BSwitch',
    props: {
      value: [String, Number, Boolean, Function, Object, Array],
      nativeValue: [String, Number, Boolean, Function, Object, Array],
      disabled: Boolean,
      type: String,
      name: String,
      required: Boolean,
      size: String,
      trueValue: {
        type: [String, Number, Boolean, Function, Object, Array],
        default: true
      },
      falseValue: {
        type: [String, Number, Boolean, Function, Object, Array],
        default: false
      },
      rounded: {
        type: Boolean,
        default: true
      },
      outlined: {
        type: Boolean,
        default: false
      }
    },
    data: function data() {
      return {
        newValue: this.value,
        isMouseDown: false
      };
    },
    computed: {
      computedValue: {
        get: function get() {
          return this.newValue;
        },
        set: function set(value) {
          this.newValue = value;
          this.$emit('input', value);
        }
      },
      newClass: function newClass() {
        return [this.size, {
          'is-disabled': this.disabled
        }, {
          'is-rounded': this.rounded
        }, {
          'is-outlined': this.outlined
        }];
      }
    },
    watch: {
      /**
      * When v-model change, set internal value.
      */
      value: function value(_value) {
        this.newValue = _value;
      }
    },
    methods: {
      focus: function focus() {
        // MacOS FireFox and Safari do not focus when clicked
        this.$refs.input.focus();
      }
    }
  };

  /* script */
  const __vue_script__$L = script$L;

  /* template */
  var __vue_render__$G = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('label',{ref:"label",staticClass:"switch",class:_vm.newClass,attrs:{"disabled":_vm.disabled},on:{"click":_vm.focus,"keydown":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }$event.preventDefault();_vm.$refs.label.click();},"mousedown":function($event){_vm.isMouseDown = true;},"mouseup":function($event){_vm.isMouseDown = false;},"mouseout":function($event){_vm.isMouseDown = false;},"blur":function($event){_vm.isMouseDown = false;}}},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.computedValue),expression:"computedValue"}],ref:"input",attrs:{"type":"checkbox","disabled":_vm.disabled,"name":_vm.name,"required":_vm.required,"true-value":_vm.trueValue,"false-value":_vm.falseValue},domProps:{"value":_vm.nativeValue,"checked":Array.isArray(_vm.computedValue)?_vm._i(_vm.computedValue,_vm.nativeValue)>-1:_vm._q(_vm.computedValue,_vm.trueValue)},on:{"click":function($event){$event.stopPropagation();},"change":function($event){var $$a=_vm.computedValue,$$el=$event.target,$$c=$$el.checked?(_vm.trueValue):(_vm.falseValue);if(Array.isArray($$a)){var $$v=_vm.nativeValue,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.computedValue=$$a.concat([$$v]));}else{$$i>-1&&(_vm.computedValue=$$a.slice(0,$$i).concat($$a.slice($$i+1)));}}else{_vm.computedValue=$$c;}}}}),_vm._v(" "),_c('span',{staticClass:"check",class:[{ 'is-elastic': _vm.isMouseDown && !_vm.disabled }, _vm.type]}),_vm._v(" "),_c('span',{staticClass:"control-label"},[_vm._t("default")],2)])};
  var __vue_staticRenderFns__$G = [];

    /* style */
    const __vue_inject_styles__$L = undefined;
    /* scoped */
    const __vue_scope_id__$L = undefined;
    /* module identifier */
    const __vue_module_identifier__$L = undefined;
    /* functional template */
    const __vue_is_functional_template__$L = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Switch = normalizeComponent_1(
      { render: __vue_render__$G, staticRenderFns: __vue_staticRenderFns__$G },
      __vue_inject_styles__$L,
      __vue_script__$L,
      __vue_scope_id__$L,
      __vue_is_functional_template__$L,
      __vue_module_identifier__$L,
      undefined,
      undefined
    );

  var Plugin$r = {
    install: function install(Vue) {
      registerComponent(Vue, Switch);
    }
  };
  use(Plugin$r);

  var _components$8;
  var script$M = {
    name: 'BTableMobileSort',
    components: (_components$8 = {}, _defineProperty(_components$8, Select.name, Select), _defineProperty(_components$8, Icon.name, Icon), _components$8),
    props: {
      currentSortColumn: Object,
      isAsc: Boolean,
      columns: Array,
      placeholder: String,
      iconPack: String,
      sortIcon: {
        type: String,
        default: 'arrow-up'
      },
      sortIconSize: {
        type: String,
        default: 'is-small'
      }
    },
    data: function data() {
      return {
        mobileSort: this.currentSortColumn
      };
    },
    computed: {
      showPlaceholder: function showPlaceholder() {
        var _this = this;

        return !this.columns || !this.columns.some(function (column) {
          return column === _this.mobileSort;
        });
      }
    },
    watch: {
      mobileSort: function mobileSort(column) {
        if (this.currentSortColumn === column) return;
        this.$emit('sort', column);
      },
      currentSortColumn: function currentSortColumn(column) {
        this.mobileSort = column;
      }
    },
    methods: {
      sort: function sort() {
        this.$emit('sort', this.mobileSort);
      }
    }
  };

  /* script */
  const __vue_script__$M = script$M;

  /* template */
  var __vue_render__$H = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"field table-mobile-sort"},[_c('div',{staticClass:"field has-addons"},[_c('b-select',{attrs:{"expanded":""},model:{value:(_vm.mobileSort),callback:function ($$v) {_vm.mobileSort=$$v;},expression:"mobileSort"}},[(_vm.placeholder)?[_c('option',{directives:[{name:"show",rawName:"v-show",value:(_vm.showPlaceholder),expression:"showPlaceholder"}],attrs:{"selected":"","disabled":"","hidden":""},domProps:{"value":{}}},[_vm._v("\n                    "+_vm._s(_vm.placeholder)+"\n                ")])]:_vm._e(),_vm._v(" "),_vm._l((_vm.columns),function(column,index){return (column.sortable)?_c('option',{key:index,domProps:{"value":column}},[_vm._v("\n                "+_vm._s(column.label)+"\n            ")]):_vm._e()})],2),_vm._v(" "),_c('div',{staticClass:"control"},[_c('button',{staticClass:"button is-primary",on:{"click":_vm.sort}},[_c('b-icon',{directives:[{name:"show",rawName:"v-show",value:(_vm.currentSortColumn === _vm.mobileSort),expression:"currentSortColumn === mobileSort"}],class:{ 'is-desc': !_vm.isAsc },attrs:{"icon":_vm.sortIcon,"pack":_vm.iconPack,"size":_vm.sortIconSize,"both":""}})],1)])],1)])};
  var __vue_staticRenderFns__$H = [];

    /* style */
    const __vue_inject_styles__$M = undefined;
    /* scoped */
    const __vue_scope_id__$M = undefined;
    /* module identifier */
    const __vue_module_identifier__$M = undefined;
    /* functional template */
    const __vue_is_functional_template__$M = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var TableMobileSort = normalizeComponent_1(
      { render: __vue_render__$H, staticRenderFns: __vue_staticRenderFns__$H },
      __vue_inject_styles__$M,
      __vue_script__$M,
      __vue_scope_id__$M,
      __vue_is_functional_template__$M,
      __vue_module_identifier__$M,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$N = {
    name: 'BTableColumn',
    props: {
      label: String,
      customKey: [String, Number],
      field: String,
      meta: [String, Number, Boolean, Function, Object, Array],
      width: [Number, String],
      numeric: Boolean,
      centered: Boolean,
      searchable: Boolean,
      sortable: Boolean,
      visible: {
        type: Boolean,
        default: true
      },
      customSort: Function,
      internal: Boolean // Used internally by Table

    },
    data: function data() {
      return {
        newKey: this.customKey || this.label
      };
    },
    computed: {
      rootClasses: function rootClasses() {
        return {
          'has-text-right': this.numeric && !this.centered,
          'has-text-centered': this.centered
        };
      }
    },
    methods: {
      addRefToTable: function addRefToTable() {
        var _this = this;

        if (!this.$parent.$data._isTable) {
          this.$destroy();
          throw new Error('You should wrap bTableColumn on a bTable');
        }

        if (this.internal) return; // Since we're using scoped prop the columns gonna be multiplied,
        // this finds when to stop based on the newKey property.

        var repeated = this.$parent.newColumns.some(function (column) {
          return column.newKey === _this.newKey;
        });
        !repeated && this.$parent.newColumns.push(this);
      }
    },
    beforeMount: function beforeMount() {
      this.addRefToTable();
    },
    beforeUpdate: function beforeUpdate() {
      this.addRefToTable();
    },
    beforeDestroy: function beforeDestroy() {
      var index = this.$parent.newColumns.map(function (column) {
        return column.newKey;
      }).indexOf(this.newKey);

      if (index >= 0) {
        this.$parent.newColumns.splice(index, 1);
      }
    }
  };

  /* script */
  const __vue_script__$N = script$N;

  /* template */
  var __vue_render__$I = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.visible)?_c('td',{class:_vm.rootClasses,attrs:{"data-label":_vm.label}},[_vm._t("default")],2):_vm._e()};
  var __vue_staticRenderFns__$I = [];

    /* style */
    const __vue_inject_styles__$N = undefined;
    /* scoped */
    const __vue_scope_id__$N = undefined;
    /* module identifier */
    const __vue_module_identifier__$N = undefined;
    /* functional template */
    const __vue_is_functional_template__$N = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var TableColumn = normalizeComponent_1(
      { render: __vue_render__$I, staticRenderFns: __vue_staticRenderFns__$I },
      __vue_inject_styles__$N,
      __vue_script__$N,
      __vue_scope_id__$N,
      __vue_is_functional_template__$N,
      __vue_module_identifier__$N,
      undefined,
      undefined
    );

  var _components$9;
  var script$O = {
    name: 'BTable',
    components: (_components$9 = {}, _defineProperty(_components$9, Checkbox.name, Checkbox), _defineProperty(_components$9, Icon.name, Icon), _defineProperty(_components$9, Input.name, Input), _defineProperty(_components$9, Pagination.name, Pagination), _defineProperty(_components$9, SlotComponent.name, SlotComponent), _defineProperty(_components$9, TableMobileSort.name, TableMobileSort), _defineProperty(_components$9, TableColumn.name, TableColumn), _components$9),
    props: {
      data: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      columns: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      bordered: Boolean,
      striped: Boolean,
      narrowed: Boolean,
      hoverable: Boolean,
      loading: Boolean,
      detailed: Boolean,
      checkable: Boolean,
      headerCheckable: {
        type: Boolean,
        default: true
      },
      checkboxPosition: {
        type: String,
        default: 'left',
        validator: function validator(value) {
          return ['left', 'right'].indexOf(value) >= 0;
        }
      },
      selected: Object,
      focusable: Boolean,
      customIsChecked: Function,
      isRowCheckable: {
        type: Function,
        default: function _default() {
          return true;
        }
      },
      checkedRows: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      mobileCards: {
        type: Boolean,
        default: true
      },
      defaultSort: [String, Array],
      defaultSortDirection: {
        type: String,
        default: 'asc'
      },
      sortIcon: {
        type: String,
        default: 'arrow-up'
      },
      sortIconSize: {
        type: String,
        default: 'is-small'
      },
      paginated: Boolean,
      currentPage: {
        type: Number,
        default: 1
      },
      perPage: {
        type: [Number, String],
        default: 20
      },
      showDetailIcon: {
        type: Boolean,
        default: true
      },
      paginationSimple: Boolean,
      paginationSize: String,
      paginationPosition: {
        type: String,
        default: 'bottom',
        validator: function validator(value) {
          return ['bottom', 'top', 'both'].indexOf(value) >= 0;
        }
      },
      backendSorting: Boolean,
      rowClass: {
        type: Function,
        default: function _default() {
          return '';
        }
      },
      openedDetailed: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      hasDetailedVisible: {
        type: Function,
        default: function _default() {
          return true;
        }
      },
      detailKey: {
        type: String,
        default: ''
      },
      customDetailRow: {
        type: Boolean,
        default: false
      },
      backendPagination: Boolean,
      total: {
        type: [Number, String],
        default: 0
      },
      iconPack: String,
      mobileSortPlaceholder: String,
      customRowKey: String,
      draggable: {
        type: Boolean,
        defualt: false
      },
      ariaNextLabel: String,
      ariaPreviousLabel: String,
      ariaPageLabel: String,
      ariaCurrentLabel: String
    },
    data: function data() {
      return {
        getValueByPath: getValueByPath,
        newColumns: _toConsumableArray(this.columns),
        visibleDetailRows: this.openedDetailed,
        newData: this.data,
        newDataTotal: this.backendPagination ? this.total : this.data.length,
        newCheckedRows: _toConsumableArray(this.checkedRows),
        lastCheckedRowIndex: null,
        newCurrentPage: this.currentPage,
        currentSortColumn: {},
        isAsc: true,
        filters: {},
        firstTimeSort: true,
        // Used by first time initSort
        _isTable: true // Used by TableColumn

      };
    },
    computed: {
      /**
      * return if detailed row tabled
      * will be with chevron column & icon or not
      */
      showDetailRowIcon: function showDetailRowIcon() {
        return this.detailed && this.showDetailIcon;
      },
      tableClasses: function tableClasses() {
        return {
          'is-bordered': this.bordered,
          'is-striped': this.striped,
          'is-narrow': this.narrowed,
          'has-mobile-cards': this.mobileCards,
          'is-hoverable': (this.hoverable || this.focusable) && this.visibleData.length
        };
      },

      /**
      * Splitted data based on the pagination.
      */
      visibleData: function visibleData() {
        if (!this.paginated) return this.newData;
        var currentPage = this.newCurrentPage;
        var perPage = this.perPage;

        if (this.newData.length <= perPage) {
          return this.newData;
        } else {
          var start = (currentPage - 1) * perPage;
          var end = parseInt(start, 10) + parseInt(perPage, 10);
          return this.newData.slice(start, end);
        }
      },
      visibleColumns: function visibleColumns() {
        if (!this.newColumns) return this.newColumns;
        return this.newColumns.filter(function (column) {
          return column.visible || column.visible === undefined;
        });
      },

      /**
      * Check if all rows in the page are checked.
      */
      isAllChecked: function isAllChecked() {
        var _this = this;

        var validVisibleData = this.visibleData.filter(function (row) {
          return _this.isRowCheckable(row);
        });
        if (validVisibleData.length === 0) return false;
        var isAllChecked = validVisibleData.some(function (currentVisibleRow) {
          return indexOf(_this.newCheckedRows, currentVisibleRow, _this.customIsChecked) < 0;
        });
        return !isAllChecked;
      },

      /**
      * Check if all rows in the page are checkable.
      */
      isAllUncheckable: function isAllUncheckable() {
        var _this2 = this;

        var validVisibleData = this.visibleData.filter(function (row) {
          return _this2.isRowCheckable(row);
        });
        return validVisibleData.length === 0;
      },

      /**
      * Check if has any sortable column.
      */
      hasSortablenewColumns: function hasSortablenewColumns() {
        return this.newColumns.some(function (column) {
          return column.sortable;
        });
      },

      /**
      * Check if has any searchable column.
      */
      hasSearchablenewColumns: function hasSearchablenewColumns() {
        return this.newColumns.some(function (column) {
          return column.searchable;
        });
      },

      /**
      * Return total column count based if it's checkable or expanded
      */
      columnCount: function columnCount() {
        var count = this.newColumns.length;
        count += this.checkable ? 1 : 0;
        count += this.detailed ? 1 : 0;
        return count;
      }
    },
    watch: {
      /**
      * When data prop change:
      *   1. Update internal value.
      *   2. Reset newColumns (thead), in case it's on a v-for loop.
      *   3. Sort again if it's not backend-sort.
      *   4. Set new total if it's not backend-paginated.
      */
      data: function data(value) {
        var _this3 = this;

        // Save newColumns before resetting
        var newColumns = this.newColumns;
        this.newColumns = [];
        this.newData = value; // Prevent table from being headless, data could change and created hook
        // on column might not trigger

        this.$nextTick(function () {
          if (!_this3.newColumns.length) _this3.newColumns = newColumns;
        });

        if (!this.backendSorting) {
          this.sort(this.currentSortColumn, true);
        }

        if (!this.backendPagination) {
          this.newDataTotal = value.length;
        }
      },

      /**
      * When Pagination total change, update internal total
      * only if it's backend-paginated.
      */
      total: function total(newTotal) {
        if (!this.backendPagination) return;
        this.newDataTotal = newTotal;
      },

      /**
      * When checkedRows prop change, update internal value without
      * mutating original data.
      */
      checkedRows: function checkedRows(rows) {
        this.newCheckedRows = _toConsumableArray(rows);
      },
      columns: function columns(value) {
        this.newColumns = _toConsumableArray(value);
      },
      newColumns: function newColumns(value) {
        this.checkSort();
      },
      filters: {
        handler: function handler(value) {
          var _this4 = this;

          this.newData = this.data.filter(function (row) {
            return _this4.isRowFiltered(row);
          });
        },
        deep: true
      },

      /**
      * When the user wants to control the detailed rows via props.
      * Or wants to open the details of certain row with the router for example.
      */
      openedDetailed: function openedDetailed(expandedRows) {
        this.visibleDetailRows = expandedRows;
      },
      currentPage: function currentPage(newVal) {
        this.newCurrentPage = newVal;
      }
    },
    methods: {
      /**
      * Sort an array by key without mutating original data.
      * Call the user sort function if it was passed.
      */
      sortBy: function sortBy(array, key, fn, isAsc) {
        var sorted = []; // Sorting without mutating original data

        if (fn && typeof fn === 'function') {
          sorted = _toConsumableArray(array).sort(function (a, b) {
            return fn(a, b, isAsc);
          });
        } else {
          sorted = _toConsumableArray(array).sort(function (a, b) {
            // Get nested values from objects
            var newA = getValueByPath(a, key);
            var newB = getValueByPath(b, key); // sort boolean type

            if (typeof newA === 'boolean' && typeof newB === 'boolean') {
              return isAsc ? newA - newB : newB - newA;
            }

            if (!newA && newA !== 0) return 1;
            if (!newB && newB !== 0) return -1;
            if (newA === newB) return 0;
            newA = typeof newA === 'string' ? newA.toUpperCase() : newA;
            newB = typeof newB === 'string' ? newB.toUpperCase() : newB;
            return isAsc ? newA > newB ? 1 : -1 : newA > newB ? -1 : 1;
          });
        }

        return sorted;
      },

      /**
      * Sort the column.
      * Toggle current direction on column if it's sortable
      * and not just updating the prop.
      */
      sort: function sort(column) {
        var updatingData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (!column || !column.sortable) return;

        if (!updatingData) {
          this.isAsc = column === this.currentSortColumn ? !this.isAsc : this.defaultSortDirection.toLowerCase() !== 'desc';
        }

        if (!this.firstTimeSort) {
          this.$emit('sort', column.field, this.isAsc ? 'asc' : 'desc');
        }

        if (!this.backendSorting) {
          this.newData = this.sortBy(this.newData, column.field, column.customSort, this.isAsc);
        }

        this.currentSortColumn = column;
      },

      /**
      * Check if the row is checked (is added to the array).
      */
      isRowChecked: function isRowChecked(row) {
        return indexOf(this.newCheckedRows, row, this.customIsChecked) >= 0;
      },

      /**
      * Remove a checked row from the array.
      */
      removeCheckedRow: function removeCheckedRow(row) {
        var index = indexOf(this.newCheckedRows, row, this.customIsChecked);

        if (index >= 0) {
          this.newCheckedRows.splice(index, 1);
        }
      },

      /**
      * Header checkbox click listener.
      * Add or remove all rows in current page.
      */
      checkAll: function checkAll() {
        var _this5 = this;

        var isAllChecked = this.isAllChecked;
        this.visibleData.forEach(function (currentRow) {
          _this5.removeCheckedRow(currentRow);

          if (!isAllChecked) {
            if (_this5.isRowCheckable(currentRow)) {
              _this5.newCheckedRows.push(currentRow);
            }
          }
        });
        this.$emit('check', this.newCheckedRows);
        this.$emit('check-all', this.newCheckedRows); // Emit checked rows to update user variable

        this.$emit('update:checkedRows', this.newCheckedRows);
      },

      /**
      * Row checkbox click listener.
      */
      checkRow: function checkRow(row, index, event) {
        var lastIndex = this.lastCheckedRowIndex;
        this.lastCheckedRowIndex = index;

        if (event.shiftKey && lastIndex !== null && index !== lastIndex) {
          this.shiftCheckRow(row, index, lastIndex);
        } else if (!this.isRowChecked(row)) {
          this.newCheckedRows.push(row);
        } else {
          this.removeCheckedRow(row);
        }

        this.$emit('check', this.newCheckedRows, row); // Emit checked rows to update user variable

        this.$emit('update:checkedRows', this.newCheckedRows);
      },

      /**
       * Check row when shift is pressed.
       */
      shiftCheckRow: function shiftCheckRow(row, index, lastCheckedRowIndex) {
        var _this6 = this;

        // Get the subset of the list between the two indicies
        var subset = this.visibleData.slice(Math.min(index, lastCheckedRowIndex), Math.max(index, lastCheckedRowIndex) + 1); // Determine the operation based on the state of the clicked checkbox

        var shouldCheck = !this.isRowChecked(row);
        subset.forEach(function (item) {
          _this6.removeCheckedRow(item);

          if (shouldCheck && _this6.isRowCheckable(item)) {
            _this6.newCheckedRows.push(item);
          }
        });
      },

      /**
      * Row click listener.
      * Emit all necessary events.
      */
      selectRow: function selectRow(row, index) {
        this.$emit('click', row);
        if (this.selected === row) return; // Emit new and old row

        this.$emit('select', row, this.selected); // Emit new row to update user variable

        this.$emit('update:selected', row);
      },

      /**
      * Paginator change listener.
      */
      pageChanged: function pageChanged(page) {
        this.newCurrentPage = page > 0 ? page : 1;
        this.$emit('page-change', this.newCurrentPage);
        this.$emit('update:currentPage', this.newCurrentPage);
      },

      /**
      * Toggle to show/hide details slot
      */
      toggleDetails: function toggleDetails(obj) {
        var found = this.isVisibleDetailRow(obj);

        if (found) {
          this.closeDetailRow(obj);
          this.$emit('details-close', obj);
        } else {
          this.openDetailRow(obj);
          this.$emit('details-open', obj);
        } // Syncs the detailed rows with the parent component


        this.$emit('update:openedDetailed', this.visibleDetailRows);
      },
      openDetailRow: function openDetailRow(obj) {
        var index = this.handleDetailKey(obj);
        this.visibleDetailRows.push(index);
      },
      closeDetailRow: function closeDetailRow(obj) {
        var index = this.handleDetailKey(obj);
        var i = this.visibleDetailRows.indexOf(index);
        this.visibleDetailRows.splice(i, 1);
      },
      isVisibleDetailRow: function isVisibleDetailRow(obj) {
        var index = this.handleDetailKey(obj);
        var result = this.visibleDetailRows.indexOf(index) >= 0;
        return result;
      },
      isActiveDetailRow: function isActiveDetailRow(row) {
        return this.detailed && !this.customDetailRow && this.isVisibleDetailRow(row);
      },
      isActiveCustomDetailRow: function isActiveCustomDetailRow(row) {
        return this.detailed && this.customDetailRow && this.isVisibleDetailRow(row);
      },
      isRowFiltered: function isRowFiltered(row) {
        for (var key in this.filters) {
          // remove key if empty
          if (!this.filters[key]) {
            delete this.filters[key];
            return true;
          }

          if (Number.isInteger(row[key])) {
            if (row[key] !== Number(this.filters[key])) return false;
          } else {
            var re = new RegExp(this.filters[key]);
            if (!row[key].match(re)) return false;
          }
        }

        return true;
      },

      /**
          * When the detailKey is defined we use the object[detailKey] as index.
          * If not, use the object reference by default.
          */
      handleDetailKey: function handleDetailKey(index) {
        var key = this.detailKey;
        return !key.length ? index : index[key];
      },
      checkPredefinedDetailedRows: function checkPredefinedDetailedRows() {
        var defaultExpandedRowsDefined = this.openedDetailed.length > 0;

        if (defaultExpandedRowsDefined && !this.detailKey.length) {
          throw new Error('If you set a predefined opened-detailed, you must provide a unique key using the prop "detail-key"');
        }
      },

      /**
      * Call initSort only first time (For example async data).
      */
      checkSort: function checkSort() {
        if (this.newColumns.length && this.firstTimeSort) {
          this.initSort();
          this.firstTimeSort = false;
        } else if (this.newColumns.length) {
          if (this.currentSortColumn.field) {
            for (var i = 0; i < this.newColumns.length; i++) {
              if (this.newColumns[i].field === this.currentSortColumn.field) {
                this.currentSortColumn = this.newColumns[i];
                break;
              }
            }
          }
        }
      },

      /**
      * Check if footer slot has custom content.
      */
      hasCustomFooterSlot: function hasCustomFooterSlot() {
        if (this.$slots.footer.length > 1) return true;
        var tag = this.$slots.footer[0].tag;
        if (tag !== 'th' && tag !== 'td') return false;
        return true;
      },

      /**
      * Check if bottom-left slot exists.
      */
      hasBottomLeftSlot: function hasBottomLeftSlot() {
        return typeof this.$slots['bottom-left'] !== 'undefined';
      },

      /**
      * Table arrow keys listener, change selection.
      */
      pressedArrow: function pressedArrow(pos) {
        if (!this.visibleData.length) return;
        var index = this.visibleData.indexOf(this.selected) + pos; // Prevent from going up from first and down from last

        index = index < 0 ? 0 : index > this.visibleData.length - 1 ? this.visibleData.length - 1 : index;
        this.selectRow(this.visibleData[index]);
      },

      /**
      * Focus table element if has selected prop.
      */
      focus: function focus() {
        if (!this.focusable) return;
        this.$el.querySelector('table').focus();
      },

      /**
      * Initial sorted column based on the default-sort prop.
      */
      initSort: function initSort() {
        var _this7 = this;

        if (!this.defaultSort) return;
        var sortField = '';
        var sortDirection = this.defaultSortDirection;

        if (Array.isArray(this.defaultSort)) {
          sortField = this.defaultSort[0];

          if (this.defaultSort[1]) {
            sortDirection = this.defaultSort[1];
          }
        } else {
          sortField = this.defaultSort;
        }

        this.newColumns.forEach(function (column) {
          if (column.field === sortField) {
            _this7.isAsc = sortDirection.toLowerCase() !== 'desc';

            _this7.sort(column, true);
          }
        });
      },

      /**
      * Emits drag start event
      */
      handleDragStart: function handleDragStart(event, row, index) {
        this.$emit('dragstart', {
          event: event,
          row: row,
          index: index
        });
      },

      /**
      * Emits drag leave event
      */
      handleDragEnd: function handleDragEnd(event, row, index) {
        this.$emit('dragend', {
          event: event,
          row: row,
          index: index
        });
      },

      /**
      * Emits drop event
      */
      handleDrop: function handleDrop(event, row, index) {
        this.$emit('drop', {
          event: event,
          row: row,
          index: index
        });
      },

      /**
      * Emits drag over event
      */
      handleDragOver: function handleDragOver(event, row, index) {
        this.$emit('dragover', {
          event: event,
          row: row,
          index: index
        });
      },

      /**
      * Emits drag leave event
      */
      handleDragLeave: function handleDragLeave(event, row, index) {
        this.$emit('dragleave', {
          event: event,
          row: row,
          index: index
        });
      }
    },
    mounted: function mounted() {
      this.checkPredefinedDetailedRows();
      this.checkSort();
    }
  };

  /* script */
  const __vue_script__$O = script$O;

  /* template */
  var __vue_render__$J = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"b-table",class:{ 'is-loading': _vm.loading }},[(_vm.mobileCards && _vm.hasSortablenewColumns)?_c('b-table-mobile-sort',{attrs:{"current-sort-column":_vm.currentSortColumn,"is-asc":_vm.isAsc,"columns":_vm.newColumns,"placeholder":_vm.mobileSortPlaceholder,"icon-pack":_vm.iconPack,"sort-icon":_vm.sortIcon,"sort-icon-size":_vm.sortIconSize},on:{"sort":function (column) { return _vm.sort(column); }}}):_vm._e(),_vm._v(" "),(_vm.paginated && (_vm.paginationPosition === 'top' || _vm.paginationPosition === 'both'))?_c('div',{staticClass:"top level"},[_c('div',{staticClass:"level-left"},[_vm._t("top-left")],2),_vm._v(" "),_c('div',{staticClass:"level-right"},[(_vm.paginated)?_c('div',{staticClass:"level-item"},[_c('b-pagination',{attrs:{"icon-pack":_vm.iconPack,"total":_vm.newDataTotal,"per-page":_vm.perPage,"simple":_vm.paginationSimple,"size":_vm.paginationSize,"current":_vm.newCurrentPage,"aria-next-label":_vm.ariaNextLabel,"aria-previous-label":_vm.ariaPreviousLabel,"aria-page-label":_vm.ariaPageLabel,"aria-current-label":_vm.ariaCurrentLabel},on:{"change":_vm.pageChanged}})],1):_vm._e()])]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"table-wrapper"},[_c('table',{staticClass:"table",class:_vm.tableClasses,attrs:{"tabindex":!_vm.focusable ? false : 0},on:{"keydown":[function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"up",38,$event.key)){ return null; }if($event.target !== $event.currentTarget){ return null; }$event.preventDefault();_vm.pressedArrow(-1);},function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"down",40,$event.key)){ return null; }if($event.target !== $event.currentTarget){ return null; }$event.preventDefault();_vm.pressedArrow(1);}]}},[(_vm.newColumns.length)?_c('thead',[_c('tr',[(_vm.showDetailRowIcon)?_c('th',{attrs:{"width":"40px"}}):_vm._e(),_vm._v(" "),(_vm.checkable && _vm.checkboxPosition === 'left')?_c('th',{staticClass:"checkbox-cell"},[(_vm.headerCheckable)?[_c('b-checkbox',{attrs:{"value":_vm.isAllChecked,"disabled":_vm.isAllUncheckable},nativeOn:{"change":function($event){_vm.checkAll($event);}}})]:_vm._e()],2):_vm._e(),_vm._v(" "),_vm._l((_vm.visibleColumns),function(column,index){return _c('th',{key:index,class:{
                              'is-current-sort': _vm.currentSortColumn === column,
                              'is-sortable': column.sortable
                          },style:({
                              width: column.width === undefined ? null :
                              (isNaN(column.width) ? column.width : column.width + 'px')
                          }),on:{"click":function($event){$event.stopPropagation();_vm.sort(column);}}},[_c('div',{staticClass:"th-wrap",class:{
                                  'is-numeric': column.numeric,
                                  'is-centered': column.centered
                          }},[(column.$scopedSlots && column.$scopedSlots.header)?[_c('b-slot-component',{attrs:{"component":column,"scoped":true,"name":"header","tag":"span","props":{ column: column, index: index }}})]:(_vm.$scopedSlots.header)?[_vm._t("header",null,{column:column,index:index})]:[_vm._v(_vm._s(column.label))],_vm._v(" "),_c('b-icon',{directives:[{name:"show",rawName:"v-show",value:(_vm.currentSortColumn === column),expression:"currentSortColumn === column"}],class:{ 'is-desc': !_vm.isAsc },attrs:{"icon":_vm.sortIcon,"pack":_vm.iconPack,"both":"","size":_vm.sortIconSize}})],2)])}),_vm._v(" "),(_vm.checkable && _vm.checkboxPosition === 'right')?_c('th',{staticClass:"checkbox-cell"},[(_vm.headerCheckable)?[_c('b-checkbox',{attrs:{"value":_vm.isAllChecked,"disabled":_vm.isAllUncheckable},nativeOn:{"change":function($event){_vm.checkAll($event);}}})]:_vm._e()],2):_vm._e()],2),_vm._v(" "),(_vm.hasSearchablenewColumns)?_c('tr',_vm._l((_vm.visibleColumns),function(column,index){return _c('th',{key:index,style:({
                              width: column.width === undefined ? null
                          : (isNaN(column.width) ? column.width : column.width + 'px') })},[_c('div',{staticClass:"th-wrap"},[(column.searchable)?[_c('b-input',{attrs:{"type":column.numeric ? 'number' : 'text'},model:{value:(_vm.filters[column.field]),callback:function ($$v) {_vm.$set(_vm.filters, column.field, $$v);},expression:"filters[column.field]"}})]:_vm._e()],2)])})):_vm._e()]):_vm._e(),_vm._v(" "),(_vm.visibleData.length)?_c('tbody',[_vm._l((_vm.visibleData),function(row,index){return [_c('tr',{key:_vm.customRowKey ? row[_vm.customRowKey] : index,class:[_vm.rowClass(row, index), {
                              'is-selected': row === _vm.selected,
                              'is-checked': _vm.isRowChecked(row),
                          }],attrs:{"draggable":_vm.draggable},on:{"click":function($event){_vm.selectRow(row);},"dblclick":function($event){_vm.$emit('dblclick', row);},"mouseenter":function($event){_vm.$emit('mouseenter', row);},"mouseleave":function($event){_vm.$emit('mouseleave', row);},"contextmenu":function($event){_vm.$emit('contextmenu', row, $event);},"dragstart":function($event){_vm.handleDragStart($event, row, index);},"dragend":function($event){_vm.handleDragEnd($event, row, index);},"drop":function($event){_vm.handleDrop($event, row, index);},"dragover":function($event){_vm.handleDragOver($event, row, index);},"dragleave":function($event){_vm.handleDragLeave($event, row, index);}}},[(_vm.showDetailRowIcon)?_c('td',{staticClass:"chevron-cell"},[(_vm.hasDetailedVisible(row))?_c('a',{attrs:{"role":"button"},on:{"click":function($event){$event.stopPropagation();_vm.toggleDetails(row);}}},[_c('b-icon',{class:{'is-expanded': _vm.isVisibleDetailRow(row)},attrs:{"icon":"chevron-right","pack":_vm.iconPack,"both":""}})],1):_vm._e()]):_vm._e(),_vm._v(" "),(_vm.checkable && _vm.checkboxPosition === 'left')?_c('td',{staticClass:"checkbox-cell"},[_c('b-checkbox',{attrs:{"disabled":!_vm.isRowCheckable(row),"value":_vm.isRowChecked(row)},nativeOn:{"click":function($event){$event.preventDefault();$event.stopPropagation();_vm.checkRow(row, index, $event);}}})],1):_vm._e(),_vm._v(" "),(_vm.$scopedSlots.default)?_vm._t("default",null,{row:row,index:index}):_vm._l((_vm.newColumns),function(column){return _c('BTableColumn',_vm._b({key:column.field,attrs:{"internal":""}},'BTableColumn',column,false),[(column.renderHtml)?_c('span',{domProps:{"innerHTML":_vm._s(_vm.getValueByPath(row, column.field))}}):[_vm._v("\n                                    "+_vm._s(_vm.getValueByPath(row, column.field))+"\n                                ")]],2)}),_vm._v(" "),(_vm.checkable && _vm.checkboxPosition === 'right')?_c('td',{staticClass:"checkbox-cell"},[_c('b-checkbox',{attrs:{"disabled":!_vm.isRowCheckable(row),"value":_vm.isRowChecked(row)},nativeOn:{"click":function($event){$event.preventDefault();$event.stopPropagation();_vm.checkRow(row, index, $event);}}})],1):_vm._e()],2),_vm._v(" "),(_vm.isActiveDetailRow(row))?_c('tr',{staticClass:"detail"},[_c('td',{attrs:{"colspan":_vm.columnCount}},[_c('div',{staticClass:"detail-container"},[_vm._t("detail",null,{row:row,index:index})],2)])]):_vm._e(),_vm._v(" "),(_vm.isActiveCustomDetailRow(row))?_vm._t("detail",null,{row:row,index:index}):_vm._e()]})],2):_c('tbody',[_c('tr',{staticClass:"is-empty"},[_c('td',{attrs:{"colspan":_vm.columnCount}},[_vm._t("empty")],2)])]),_vm._v(" "),(_vm.$slots.footer !== undefined)?_c('tfoot',[_c('tr',{staticClass:"table-footer"},[(_vm.hasCustomFooterSlot())?_vm._t("footer"):_c('th',{attrs:{"colspan":_vm.columnCount}},[_vm._t("footer")],2)],2)]):_vm._e()])]),_vm._v(" "),((_vm.checkable && _vm.hasBottomLeftSlot()) ||
          (_vm.paginated && (_vm.paginationPosition === 'bottom' || _vm.paginationPosition === 'both')))?_c('div',{staticClass:"level"},[_c('div',{staticClass:"level-left"},[_vm._t("bottom-left")],2),_vm._v(" "),_c('div',{staticClass:"level-right"},[(_vm.paginated)?_c('div',{staticClass:"level-item"},[_c('b-pagination',{attrs:{"icon-pack":_vm.iconPack,"total":_vm.newDataTotal,"per-page":_vm.perPage,"simple":_vm.paginationSimple,"size":_vm.paginationSize,"current":_vm.newCurrentPage,"aria-next-label":_vm.ariaNextLabel,"aria-previous-label":_vm.ariaPreviousLabel,"aria-page-label":_vm.ariaPageLabel,"aria-current-label":_vm.ariaCurrentLabel},on:{"change":_vm.pageChanged}})],1):_vm._e()])]):_vm._e()],1)};
  var __vue_staticRenderFns__$J = [];

    /* style */
    const __vue_inject_styles__$O = undefined;
    /* scoped */
    const __vue_scope_id__$O = undefined;
    /* module identifier */
    const __vue_module_identifier__$O = undefined;
    /* functional template */
    const __vue_is_functional_template__$O = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Table = normalizeComponent_1(
      { render: __vue_render__$J, staticRenderFns: __vue_staticRenderFns__$J },
      __vue_inject_styles__$O,
      __vue_script__$O,
      __vue_scope_id__$O,
      __vue_is_functional_template__$O,
      __vue_module_identifier__$O,
      undefined,
      undefined
    );

  var Plugin$s = {
    install: function install(Vue) {
      registerComponent(Vue, Table);
      registerComponent(Vue, TableColumn);
    }
  };
  use(Plugin$s);

  var _components$a;
  var script$P = {
    name: 'BTabs',
    components: (_components$a = {}, _defineProperty(_components$a, Icon.name, Icon), _defineProperty(_components$a, SlotComponent.name, SlotComponent), _components$a),
    props: {
      value: Number,
      expanded: Boolean,
      type: String,
      size: String,
      position: String,
      animated: {
        type: Boolean,
        default: true
      },
      destroyOnHide: {
        type: Boolean,
        default: false
      },
      vertical: Boolean
    },
    data: function data() {
      return {
        activeTab: this.value || 0,
        tabItems: [],
        contentHeight: 0,
        isTransitioning: false,
        _isTabs: true // Used internally by TabItem

      };
    },
    computed: {
      mainClasses: function mainClasses() {
        return _defineProperty({
          'is-fullwidth': this.expanded,
          'is-vertical': this.vertical
        }, this.position, this.position && this.vertical);
      },
      navClasses: function navClasses() {
        var _ref2;

        return [this.type, this.size, (_ref2 = {}, _defineProperty(_ref2, this.position, this.position && !this.vertical), _defineProperty(_ref2, 'is-fullwidth', this.expanded), _defineProperty(_ref2, 'is-toggle-rounded is-toggle', this.type === 'is-toggle-rounded'), _ref2)];
      }
    },
    watch: {
      /**
      * When v-model is changed set the new active tab.
      */
      value: function value(_value) {
        this.changeTab(_value);
      },

      /**
      * When tab-items are updated, set active one.
      */
      tabItems: function tabItems() {
        if (this.activeTab < this.tabItems.length) {
          this.tabItems[this.activeTab].isActive = true;
        }
      }
    },
    methods: {
      /**
      * Change the active tab and emit change event.
      */
      changeTab: function changeTab(newIndex) {
        if (this.activeTab === newIndex || this.tabItems[newIndex] === undefined) return;

        if (this.activeTab < this.tabItems.length) {
          this.tabItems[this.activeTab].deactivate(this.activeTab, newIndex);
        }

        this.tabItems[newIndex].activate(this.activeTab, newIndex);
        this.activeTab = newIndex;
        this.$emit('change', newIndex);
      },

      /**
      * Tab click listener, emit input event and change active tab.
      */
      tabClick: function tabClick(value) {
        this.$emit('input', value);
        this.changeTab(value);
      }
    },
    mounted: function mounted() {
      if (this.activeTab < this.tabItems.length) {
        this.tabItems[this.activeTab].isActive = true;
      }
    }
  };

  /* script */
  const __vue_script__$P = script$P;

  /* template */
  var __vue_render__$K = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"b-tabs",class:_vm.mainClasses},[_c('nav',{staticClass:"tabs",class:_vm.navClasses},[_c('ul',_vm._l((_vm.tabItems),function(tabItem,index){return _c('li',{directives:[{name:"show",rawName:"v-show",value:(tabItem.visible),expression:"tabItem.visible"}],key:index,class:{ 'is-active': _vm.activeTab === index, 'is-disabled': tabItem.disabled }},[_c('a',{on:{"click":function($event){_vm.tabClick(index);}}},[(tabItem.$slots.header)?[_c('b-slot-component',{attrs:{"component":tabItem,"name":"header","tag":"span"}})]:[(tabItem.icon)?_c('b-icon',{attrs:{"icon":tabItem.icon,"pack":tabItem.iconPack,"size":_vm.size}}):_vm._e(),_vm._v(" "),_c('span',[_vm._v(_vm._s(tabItem.label))])]],2)])}))]),_vm._v(" "),_c('section',{staticClass:"tab-content",class:{'is-transitioning': _vm.isTransitioning}},[_vm._t("default")],2)])};
  var __vue_staticRenderFns__$K = [];

    /* style */
    const __vue_inject_styles__$P = undefined;
    /* scoped */
    const __vue_scope_id__$P = undefined;
    /* module identifier */
    const __vue_module_identifier__$P = undefined;
    /* functional template */
    const __vue_is_functional_template__$P = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Tabs = normalizeComponent_1(
      { render: __vue_render__$K, staticRenderFns: __vue_staticRenderFns__$K },
      __vue_inject_styles__$P,
      __vue_script__$P,
      __vue_scope_id__$P,
      __vue_is_functional_template__$P,
      __vue_module_identifier__$P,
      undefined,
      undefined
    );

  var script$Q = {
    name: 'BTabItem',
    props: {
      label: String,
      icon: String,
      iconPack: String,
      disabled: Boolean,
      visible: {
        type: Boolean,
        default: true
      }
    },
    data: function data() {
      return {
        isActive: false,
        transitionName: null
      };
    },
    methods: {
      /**
      * Activate tab, alter animation name based on the index.
      */
      activate: function activate(oldIndex, index) {
        this.transitionName = index < oldIndex ? 'slide-next' : 'slide-prev';
        this.isActive = true;
      },

      /**
      * Deactivate tab, alter animation name based on the index.
      */
      deactivate: function deactivate(oldIndex, index) {
        this.transitionName = index < oldIndex ? 'slide-next' : 'slide-prev';
        this.isActive = false;
      }
    },
    created: function created() {
      if (!this.$parent.$data._isTabs) {
        this.$destroy();
        throw new Error('You should wrap bTabItem on a bTabs');
      }

      this.$parent.tabItems.push(this);
    },
    beforeDestroy: function beforeDestroy() {
      var index = this.$parent.tabItems.indexOf(this);

      if (index >= 0) {
        this.$parent.tabItems.splice(index, 1);
      }
    },
    render: function render(createElement) {
      var _this = this;

      // if destroy apply v-if
      if (this.$parent.destroyOnHide) {
        if (!this.isActive || !this.visible) {
          return;
        }
      }

      var vnode = createElement('div', {
        directives: [{
          name: 'show',
          value: this.isActive && this.visible
        }],
        class: 'tab-item'
      }, this.$slots.default); // check animated prop

      if (this.$parent.animated) {
        return createElement('transition', {
          props: {
            'name': this.transitionName
          },
          on: {
            'before-enter': function beforeEnter() {
              _this.$parent.isTransitioning = true;
            },
            'after-enter': function afterEnter() {
              _this.$parent.isTransitioning = false;
            }
          }
        }, [vnode]);
      }

      return vnode;
    }
  };

  /* script */
  const __vue_script__$Q = script$Q;

  /* template */

    /* style */
    const __vue_inject_styles__$Q = undefined;
    /* scoped */
    const __vue_scope_id__$Q = undefined;
    /* module identifier */
    const __vue_module_identifier__$Q = undefined;
    /* functional template */
    const __vue_is_functional_template__$Q = undefined;
    /* style inject */
    
    /* style inject SSR */
    

    
    var TabItem = normalizeComponent_1(
      {},
      __vue_inject_styles__$Q,
      __vue_script__$Q,
      __vue_scope_id__$Q,
      __vue_is_functional_template__$Q,
      __vue_module_identifier__$Q,
      undefined,
      undefined
    );

  var Plugin$t = {
    install: function install(Vue) {
      registerComponent(Vue, Tabs);
      registerComponent(Vue, TabItem);
    }
  };
  use(Plugin$t);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$R = {
    name: 'BTag',
    props: {
      attached: Boolean,
      closable: Boolean,
      type: String,
      size: String,
      rounded: Boolean,
      disabled: Boolean,
      ellipsis: Boolean,
      tabstop: {
        type: Boolean,
        default: true
      },
      ariaCloseLabel: String
    },
    methods: {
      /**
      * Emit close event when delete button is clicked
      * or delete key is pressed.
      */
      close: function close() {
        if (this.disabled) return;
        this.$emit('close');
      }
    }
  };

  /* script */
  const __vue_script__$R = script$R;

  /* template */
  var __vue_render__$L = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.attached && _vm.closable)?_c('div',{staticClass:"tags has-addons"},[_c('span',{staticClass:"tag",class:[_vm.type, _vm.size, { 'is-rounded': _vm.rounded }]},[_c('span',{class:{ 'has-ellipsis': _vm.ellipsis }},[_vm._t("default")],2)]),_vm._v(" "),_c('a',{staticClass:"tag is-delete",class:[_vm.size, { 'is-rounded': _vm.rounded }],attrs:{"role":"button","aria-label":_vm.ariaCloseLabel,"tabindex":_vm.tabstop ? 0 : false,"disabled":_vm.disabled},on:{"click":function($event){_vm.close();},"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"delete",[8,46],$event.key)){ return null; }$event.preventDefault();_vm.close();}}})]):_c('span',{staticClass:"tag",class:[_vm.type, _vm.size, { 'is-rounded': _vm.rounded }]},[_c('span',{class:{ 'has-ellipsis': _vm.ellipsis }},[_vm._t("default")],2),_vm._v(" "),(_vm.closable)?_c('a',{staticClass:"delete is-small",attrs:{"role":"button","aria-label":_vm.ariaCloseLabel,"disabled":_vm.disabled,"tabindex":_vm.tabstop ? 0 : false},on:{"click":function($event){_vm.close();},"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"delete",[8,46],$event.key)){ return null; }$event.preventDefault();_vm.close();}}}):_vm._e()])};
  var __vue_staticRenderFns__$L = [];

    /* style */
    const __vue_inject_styles__$R = undefined;
    /* scoped */
    const __vue_scope_id__$R = undefined;
    /* module identifier */
    const __vue_module_identifier__$R = undefined;
    /* functional template */
    const __vue_is_functional_template__$R = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Tag = normalizeComponent_1(
      { render: __vue_render__$L, staticRenderFns: __vue_staticRenderFns__$L },
      __vue_inject_styles__$R,
      __vue_script__$R,
      __vue_scope_id__$R,
      __vue_is_functional_template__$R,
      __vue_module_identifier__$R,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  var script$S = {
    name: 'BTaglist',
    props: {
      attached: Boolean
    }
  };

  /* script */
  const __vue_script__$S = script$S;

  /* template */
  var __vue_render__$M = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tags",class:{ 'has-addons': _vm.attached }},[_vm._t("default")],2)};
  var __vue_staticRenderFns__$M = [];

    /* style */
    const __vue_inject_styles__$S = undefined;
    /* scoped */
    const __vue_scope_id__$S = undefined;
    /* module identifier */
    const __vue_module_identifier__$S = undefined;
    /* functional template */
    const __vue_is_functional_template__$S = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Taglist = normalizeComponent_1(
      { render: __vue_render__$M, staticRenderFns: __vue_staticRenderFns__$M },
      __vue_inject_styles__$S,
      __vue_script__$S,
      __vue_scope_id__$S,
      __vue_is_functional_template__$S,
      __vue_module_identifier__$S,
      undefined,
      undefined
    );

  var Plugin$u = {
    install: function install(Vue) {
      registerComponent(Vue, Tag);
      registerComponent(Vue, Taglist);
    }
  };
  use(Plugin$u);

  var _components$b;
  var script$T = {
    name: 'BTaginput',
    components: (_components$b = {}, _defineProperty(_components$b, Autocomplete.name, Autocomplete), _defineProperty(_components$b, Tag.name, Tag), _components$b),
    mixins: [FormElementMixin],
    inheritAttrs: false,
    props: {
      value: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      data: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      type: String,
      rounded: {
        type: Boolean,
        default: false
      },
      attached: {
        type: Boolean,
        default: false
      },
      maxtags: {
        type: [Number, String],
        required: false
      },
      hasCounter: {
        type: Boolean,
        default: function _default() {
          return config$1.defaultTaginputHasCounter;
        }
      },
      field: {
        type: String,
        default: 'value'
      },
      autocomplete: Boolean,
      nativeAutocomplete: String,
      disabled: Boolean,
      ellipsis: Boolean,
      closable: {
        type: Boolean,
        default: true
      },
      confirmKeyCodes: {
        type: Array,
        default: function _default() {
          return [13, 188];
        }
      },
      removeOnKeys: {
        type: Array,
        default: function _default() {
          return [8];
        }
      },
      allowNew: Boolean,
      onPasteSeparators: {
        type: Array,
        default: function _default() {
          return [','];
        }
      },
      beforeAdding: {
        type: Function,
        default: function _default() {
          return true;
        }
      },
      allowDuplicates: {
        type: Boolean,
        default: false
      }
    },
    data: function data() {
      return {
        tags: Array.isArray(this.value) ? this.value.slice(0) : this.value || [],
        newTag: '',
        _elementRef: 'input',
        _isTaginput: true
      };
    },
    computed: {
      rootClasses: function rootClasses() {
        return {
          'is-expanded': this.expanded
        };
      },
      containerClasses: function containerClasses() {
        return {
          'is-focused': this.isFocused,
          'is-focusable': this.hasInput
        };
      },
      valueLength: function valueLength() {
        return this.newTag.trim().length;
      },
      defaultSlotName: function defaultSlotName() {
        return this.hasDefaultSlot ? 'default' : 'dontrender';
      },
      emptySlotName: function emptySlotName() {
        return this.hasEmptySlot ? 'empty' : 'dontrender';
      },
      headerSlotName: function headerSlotName() {
        return this.hasHeaderSlot ? 'header' : 'dontrender';
      },
      footerSlotName: function footerSlotName() {
        return this.hasFooterSlot ? 'footer' : 'dontrender';
      },
      hasDefaultSlot: function hasDefaultSlot() {
        return !!this.$scopedSlots.default;
      },
      hasEmptySlot: function hasEmptySlot() {
        return !!this.$slots.empty;
      },
      hasHeaderSlot: function hasHeaderSlot() {
        return !!this.$slots.header;
      },
      hasFooterSlot: function hasFooterSlot() {
        return !!this.$slots.footer;
      },

      /**
       * Show the input field if a maxtags hasn't been set or reached.
       */
      hasInput: function hasInput() {
        return this.maxtags == null || this.tagsLength < this.maxtags;
      },
      tagsLength: function tagsLength() {
        return this.tags.length;
      },

      /**
       * If Taginput has onPasteSeparators prop,
       * returning new RegExp used to split pasted string.
       */
      separatorsAsRegExp: function separatorsAsRegExp() {
        var sep = this.onPasteSeparators;
        return sep.length ? new RegExp(sep.map(function (s) {
          return s ? s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') : null;
        }).join('|'), 'g') : null;
      }
    },
    watch: {
      /**
       * When v-model is changed set internal value.
       */
      value: function value(_value) {
        this.tags = _value;
      },
      hasInput: function hasInput() {
        if (!this.hasInput) this.onBlur();
      }
    },
    methods: {
      addTag: function addTag(tag) {
        var tagToAdd = tag || this.newTag.trim();

        if (tagToAdd) {
          if (!this.autocomplete) {
            var reg = this.separatorsAsRegExp;

            if (reg && tagToAdd.match(reg)) {
              tagToAdd.split(reg).map(function (t) {
                return t.trim();
              }).filter(function (t) {
                return t.length !== 0;
              }).map(this.addTag);
              return;
            }
          } // Add the tag input if it is not blank
          // or previously added (if not allowDuplicates).


          var add = !this.allowDuplicates ? this.tags.indexOf(tagToAdd) === -1 : true;

          if (add && this.beforeAdding(tagToAdd)) {
            this.tags.push(tagToAdd);
            this.$emit('input', this.tags);
            this.$emit('add', tagToAdd);
          }
        }

        this.newTag = '';
      },
      getNormalizedTagText: function getNormalizedTagText(tag) {
        if (_typeof(tag) === 'object') {
          return getValueByPath(tag, this.field);
        }

        return tag;
      },
      customOnBlur: function customOnBlur($event) {
        // Add tag on-blur if not select only
        if (!this.autocomplete) this.addTag();
        this.onBlur($event);
      },
      onSelect: function onSelect(option) {
        var _this = this;

        if (!option) return;
        this.addTag(option);
        this.$nextTick(function () {
          _this.newTag = '';
        });
      },
      removeTag: function removeTag(index) {
        var tag = this.tags.splice(index, 1)[0];
        this.$emit('input', this.tags);
        this.$emit('remove', tag);
        return tag;
      },
      removeLastTag: function removeLastTag() {
        if (this.tagsLength > 0) {
          this.removeTag(this.tagsLength - 1);
        }
      },
      keydown: function keydown(event) {
        if (this.removeOnKeys.indexOf(event.keyCode) !== -1 && !this.newTag.length) {
          this.removeLastTag();
        } // Stop if is to accept select only


        if (this.autocomplete && !this.allowNew) return;

        if (this.confirmKeyCodes.indexOf(event.keyCode) >= 0) {
          event.preventDefault();
          this.addTag();
        }
      },
      onTyping: function onTyping($event) {
        this.$emit('typing', $event.trim());
      }
    }
  };

  /* script */
  const __vue_script__$T = script$T;

  /* template */
  var __vue_render__$N = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"taginput control",class:_vm.rootClasses},[_c('div',{staticClass:"taginput-container",class:[_vm.statusType, _vm.size, _vm.containerClasses],attrs:{"disabled":_vm.disabled},on:{"click":function($event){_vm.hasInput && _vm.focus($event);}}},[_vm._l((_vm.tags),function(tag,index){return _c('b-tag',{key:index,attrs:{"type":_vm.type,"size":_vm.size,"rounded":_vm.rounded,"attached":_vm.attached,"tabstop":false,"disabled":_vm.disabled,"ellipsis":_vm.ellipsis,"closable":_vm.closable,"title":_vm.ellipsis && _vm.getNormalizedTagText(tag)},on:{"close":function($event){_vm.removeTag(index);}}},[_vm._v("\n            "+_vm._s(_vm.getNormalizedTagText(tag))+"\n        ")])}),_vm._v(" "),(_vm.hasInput)?_c('b-autocomplete',_vm._b({ref:"autocomplete",attrs:{"data":_vm.data,"field":_vm.field,"icon":_vm.icon,"icon-pack":_vm.iconPack,"maxlength":_vm.maxlength,"has-counter":false,"size":_vm.size,"disabled":_vm.disabled,"loading":_vm.loading,"autocomplete":_vm.nativeAutocomplete,"keep-first":!_vm.allowNew,"use-html5-validation":_vm.useHtml5Validation},on:{"typing":_vm.onTyping,"focus":_vm.onFocus,"blur":_vm.customOnBlur,"select":_vm.onSelect},nativeOn:{"keydown":function($event){_vm.keydown($event);}},scopedSlots:_vm._u([{key:_vm.defaultSlotName,fn:function(props){return [_vm._t("default",null,{option:props.option,index:props.index})]}}]),model:{value:(_vm.newTag),callback:function ($$v) {_vm.newTag=$$v;},expression:"newTag"}},'b-autocomplete',_vm.$attrs,false),[_c('template',{slot:_vm.headerSlotName},[_vm._t("header")],2),_vm._v(" "),_c('template',{slot:_vm.emptySlotName},[_vm._t("empty")],2),_vm._v(" "),_c('template',{slot:_vm.footerSlotName},[_vm._t("footer")],2)],2):_vm._e()],2),_vm._v(" "),(_vm.hasCounter && (_vm.maxtags || _vm.maxlength))?_c('small',{staticClass:"help counter"},[(_vm.maxlength && _vm.valueLength > 0)?[_vm._v("\n            "+_vm._s(_vm.valueLength)+" / "+_vm._s(_vm.maxlength)+"\n        ")]:(_vm.maxtags)?[_vm._v("\n            "+_vm._s(_vm.tagsLength)+" / "+_vm._s(_vm.maxtags)+"\n        ")]:_vm._e()],2):_vm._e()])};
  var __vue_staticRenderFns__$N = [];

    /* style */
    const __vue_inject_styles__$T = undefined;
    /* scoped */
    const __vue_scope_id__$T = undefined;
    /* module identifier */
    const __vue_module_identifier__$T = undefined;
    /* functional template */
    const __vue_is_functional_template__$T = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Taginput = normalizeComponent_1(
      { render: __vue_render__$N, staticRenderFns: __vue_staticRenderFns__$N },
      __vue_inject_styles__$T,
      __vue_script__$T,
      __vue_scope_id__$T,
      __vue_is_functional_template__$T,
      __vue_module_identifier__$T,
      undefined,
      undefined
    );

  var Plugin$v = {
    install: function install(Vue) {
      registerComponent(Vue, Taginput);
    }
  };
  use(Plugin$v);

  var Plugin$w = {
    install: function install(Vue) {
      registerComponent(Vue, Timepicker);
    }
  };
  use(Plugin$w);

  //
  var script$U = {
    name: 'BToast',
    mixins: [NoticeMixin],
    data: function data() {
      return {
        newDuration: this.duration || config$1.defaultToastDuration
      };
    }
  };

  /* script */
  const __vue_script__$U = script$U;

  /* template */
  var __vue_render__$O = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"enter-active-class":_vm.transition.enter,"leave-active-class":_vm.transition.leave}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.isActive),expression:"isActive"}],staticClass:"toast",class:[_vm.type, _vm.position],attrs:{"aria-hidden":!_vm.isActive,"role":"alert"}},[_c('div',{domProps:{"innerHTML":_vm._s(_vm.message)}})])])};
  var __vue_staticRenderFns__$O = [];

    /* style */
    const __vue_inject_styles__$U = undefined;
    /* scoped */
    const __vue_scope_id__$U = undefined;
    /* module identifier */
    const __vue_module_identifier__$U = undefined;
    /* functional template */
    const __vue_is_functional_template__$U = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Toast = normalizeComponent_1(
      { render: __vue_render__$O, staticRenderFns: __vue_staticRenderFns__$O },
      __vue_inject_styles__$U,
      __vue_script__$U,
      __vue_scope_id__$U,
      __vue_is_functional_template__$U,
      __vue_module_identifier__$U,
      undefined,
      undefined
    );

  var ToastProgrammatic = {
    open: function open(params) {
      var message;
      var parent;
      if (typeof params === 'string') message = params;
      var defaultParam = {
        message: message,
        position: config$1.defaultToastPosition || 'is-top'
      };

      if (params.parent) {
        parent = params.parent;
        delete params.parent;
      }

      var propsData = Object.assign(defaultParam, params);
      var vm = typeof window !== 'undefined' && window.Vue ? window.Vue : Vue;
      var ToastComponent = vm.extend(Toast);
      return new ToastComponent({
        parent: parent,
        el: document.createElement('div'),
        propsData: propsData
      });
    }
  };
  var Plugin$x = {
    install: function install(Vue) {
      registerComponentProgrammatic(Vue, 'toast', ToastProgrammatic);
    }
  };
  use(Plugin$x);

  var Plugin$y = {
    install: function install(Vue) {
      registerComponent(Vue, Tooltip);
    }
  };
  use(Plugin$y);

  //
  var script$V = {
    name: 'BUpload',
    mixins: [FormElementMixin],
    inheritAttrs: false,
    props: {
      value: {
        type: [Object, Function, File, Array]
      },
      multiple: Boolean,
      disabled: Boolean,
      accept: String,
      dragDrop: Boolean,
      type: {
        type: String,
        default: 'is-primary'
      },
      native: {
        type: Boolean,
        default: false
      }
    },
    data: function data() {
      return {
        newValue: this.value,
        dragDropFocus: false,
        _elementRef: 'input'
      };
    },
    watch: {
      /**
       *   When v-model is changed:
       *   1. Get value from input file
       *   2. Set internal value.
       *   3. Reset input value if array is empty or when input file is not found in newValue
       *   4. If it's invalid, validate again.
       */
      value: function value(_value) {
        var inputFiles = this.$refs.input.files;
        this.newValue = _value;

        if (!this.newValue || Array.isArray(this.newValue) && this.newValue.length === 0 || !inputFiles[0] || Array.isArray(this.newValue) && !this.newValue.some(function (a) {
          return a.name === inputFiles[0].name;
        })) {
          this.$refs.input.value = null;
        }

        !this.isValid && !this.dragDrop && this.checkHtml5Validity();
      }
    },
    methods: {
      /**
      * Listen change event on input type 'file',
      * emit 'input' event and validate
      */
      onFileChange: function onFileChange(event) {
        if (this.disabled || this.loading) return;

        if (this.dragDrop) {
          this.updateDragDropFocus(false);
        }

        var value = event.target.files || event.dataTransfer.files;

        if (value.length === 0) {
          if (!this.newValue) {
            return;
          }

          if (this.native) {
            this.newValue = null;
          }
        } else if (!this.multiple) {
          // only one element in case drag drop mode and isn't multiple
          if (this.dragDrop && value.length !== 1) return;else {
            var file = value[0];

            if (this.checkType(file)) {
              this.newValue = file;
            } else if (this.newValue) {
              this.newValue = null;
            } else {
              return;
            }
          }
        } else {
          // always new values if native or undefined local
          var newValues = false;

          if (this.native || !this.newValue) {
            this.newValue = [];
            newValues = true;
          }

          for (var i = 0; i < value.length; i++) {
            var _file = value[i];

            if (this.checkType(_file)) {
              this.newValue.push(_file);
              newValues = true;
            }
          }

          if (!newValues) {
            return;
          }
        }

        this.$emit('input', this.newValue);
        !this.dragDrop && this.checkHtml5Validity();
      },

      /**
      * Listen drag-drop to update internal variable
      */
      updateDragDropFocus: function updateDragDropFocus(focus) {
        if (!this.disabled && !this.loading) {
          this.dragDropFocus = focus;
        }
      },

      /**
      * Check mime type of file
      */
      checkType: function checkType(file) {
        if (!this.accept) return true;
        var types = this.accept.split(',');
        if (types.length === 0) return true;
        var valid = false;

        for (var i = 0; i < types.length && !valid; i++) {
          var type = types[i].trim();

          if (type) {
            if (type.substring(0, 1) === '.') {
              // check extension
              var extIndex = file.name.lastIndexOf('.');
              var extension = extIndex >= 0 ? file.name.substring(extIndex) : '';

              if (extension.toLowerCase() === type.toLowerCase()) {
                valid = true;
              }
            } else {
              // check mime type
              if (file.type.match(type)) {
                valid = true;
              }
            }
          }
        }

        return valid;
      }
    }
  };

  /* script */
  const __vue_script__$V = script$V;

  /* template */
  var __vue_render__$P = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('label',{staticClass:"upload control"},[(!_vm.dragDrop)?[_vm._t("default")]:_c('div',{staticClass:"upload-draggable",class:[_vm.type, {
              'is-loading': _vm.loading,
              'is-disabled': _vm.disabled,
              'is-hovered': _vm.dragDropFocus
          }],on:{"dragover":function($event){$event.preventDefault();_vm.updateDragDropFocus(true);},"dragleave":function($event){$event.preventDefault();_vm.updateDragDropFocus(false);},"dragenter":function($event){$event.preventDefault();_vm.updateDragDropFocus(true);},"drop":function($event){$event.preventDefault();_vm.onFileChange($event);}}},[_vm._t("default")],2),_vm._v(" "),_c('input',_vm._b({ref:"input",attrs:{"type":"file","multiple":_vm.multiple,"accept":_vm.accept,"disabled":_vm.disabled},on:{"change":_vm.onFileChange}},'input',_vm.$attrs,false))],2)};
  var __vue_staticRenderFns__$P = [];

    /* style */
    const __vue_inject_styles__$V = undefined;
    /* scoped */
    const __vue_scope_id__$V = undefined;
    /* module identifier */
    const __vue_module_identifier__$V = undefined;
    /* functional template */
    const __vue_is_functional_template__$V = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Upload = normalizeComponent_1(
      { render: __vue_render__$P, staticRenderFns: __vue_staticRenderFns__$P },
      __vue_inject_styles__$V,
      __vue_script__$V,
      __vue_scope_id__$V,
      __vue_is_functional_template__$V,
      __vue_module_identifier__$V,
      undefined,
      undefined
    );

  var Plugin$z = {
    install: function install(Vue) {
      registerComponent(Vue, Upload);
    }
  };
  use(Plugin$z);



  var components = /*#__PURE__*/Object.freeze({
    Autocomplete: Plugin,
    Button: Plugin$1,
    Checkbox: Plugin$2,
    Clockpicker: Plugin$4,
    Collapse: Plugin$3,
    Datepicker: Plugin$5,
    Datetimepicker: Plugin$6,
    Dialog: Plugin$7,
    Dropdown: Plugin$8,
    Field: Plugin$9,
    Icon: Plugin$a,
    Input: Plugin$b,
    Loading: Plugin$c,
    Menu: Plugin$d,
    Message: Plugin$e,
    Modal: Plugin$f,
    Navbar: Plugin$h,
    Notification: Plugin$g,
    Numberinput: Plugin$i,
    Pagination: Plugin$j,
    Progress: Plugin$k,
    Radio: Plugin$l,
    Rate: Plugin$m,
    Select: Plugin$n,
    Slider: Plugin$o,
    Snackbar: Plugin$p,
    Steps: Plugin$q,
    Switch: Plugin$r,
    Table: Plugin$s,
    Tabs: Plugin$t,
    Tag: Plugin$u,
    Taginput: Plugin$v,
    Timepicker: Plugin$w,
    Toast: Plugin$x,
    Tooltip: Plugin$y,
    Upload: Plugin$z
  });

  var Buefy = {
    install: function install(Vue) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      // Options
//       console.log(options);
      setOptions(Object.assign(config$1, options)); // Components


      for (var componentKey in components) {
        Vue.use(components[componentKey]);
      } // Config component


      var BuefyProgrammatic = {
        setOptions: function setOptions$1(options) {
          setOptions(Object.assign(config$1, options));
        }
      };
      registerComponentProgrammatic(Vue, 'config', BuefyProgrammatic);
    }
  };
 // use(Buefy);

  exports.Autocomplete = Plugin;
  exports.Button = Plugin$1;
  exports.Checkbox = Plugin$2;
  exports.Clockpicker = Plugin$4;
  exports.Collapse = Plugin$3;
  exports.Datepicker = Plugin$5;
  exports.Datetimepicker = Plugin$6;
  exports.Dialog = Plugin$7;
  exports.DialogProgrammatic = DialogProgrammatic;
  exports.Dropdown = Plugin$8;
  exports.Field = Plugin$9;
  exports.Icon = Plugin$a;
  exports.Input = Plugin$b;
  exports.Loading = Plugin$c;
  exports.LoadingProgrammatic = LoadingProgrammatic;
  exports.Menu = Plugin$d;
  exports.Message = Plugin$e;
  exports.Modal = Plugin$f;
  exports.ModalProgrammatic = ModalProgrammatic;
  exports.Navbar = Plugin$h;
  exports.Notification = Plugin$g;
  exports.NotificationProgrammatic = NotificationProgrammatic;
  exports.Numberinput = Plugin$i;
  exports.Pagination = Plugin$j;
  exports.Progress = Plugin$k;
  exports.Radio = Plugin$l;
  exports.Rate = Plugin$m;
  exports.Select = Plugin$n;
  exports.Slider = Plugin$o;
  exports.Snackbar = Plugin$p;
  exports.SnackbarProgrammatic = SnackbarProgrammatic;
  exports.Steps = Plugin$q;
  exports.Switch = Plugin$r;
  exports.Table = Plugin$s;
  exports.Tabs = Plugin$t;
  exports.Tag = Plugin$u;
  exports.Taginput = Plugin$v;
  exports.Timepicker = Plugin$w;
  exports.Toast = Plugin$x;
  exports.ToastProgrammatic = ToastProgrammatic;
  exports.Tooltip = Plugin$y;
  exports.Upload = Plugin$z;
  exports.default = Buefy;

  Object.defineProperty(exports, '__esModule', { value: true });

}));

Vue.component('mx-toggle', {
	props: {value: Boolean, disabled: Boolean, trueValue: {default: 'Да'}, falseValue: {default: 'Нет'}, title: String, spaceBetween: Boolean, invert: Boolean},
	data() {
		return {
			val: false
		}
	},
	created() {
		this.val = this.invert?!this.value:this.value;
	},
	watch: {
		value(v) {
			this.val = this.invert?!v:v;
		},
		val(v) {
			if (this.invert) v = !v;
			if (this.value != v) {
				this.value = v;
				this.$emit('input', v)
			}
		}
	},
	
	template: '<div :class="{\'mx-toggle-space-between\': spaceBetween}"><label class="mx-toggle" :class="{disabled: disabled}" :data-true-value="trueValue|gettext" @click.stop><input type="checkbox" v-model="val"><div :data-false-value="falseValue|gettext"></div></label><p class="form-control-static" v-if="title" :class="{disabled: disabled}">{{title}}</p></div>'	
});

Vue.component('mx-phone', {
	data() {
		return {
			tmp: ''
		}
	},
	props: {value: String, disabled: Boolean},
	created() {
		this.tmp = this.value;
	},
	mounted() {
		$mx(this.$refs.hidden).on('change', (e, v) => {
			this.value = e.target.value;
			this.$emit('input', e.target.value)
		});
	},
	template: '<div class="form-field"><input type="tel" :data-country="$account.client.country" inputmode="tel" :value="tmp" class="input" autocorrect="off" autocapitalize="none" :disabled="disabled"><input type="hidden" ref="hidden" class="tel-code" v-model="tmp"></div>'	
});
function date_format(format, timestamp) {
  var jsdate, f
  // Keep this here (works, but for code commented-out below for file size reasons)
  // var tal= [];
  var txtWords = [
    'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  // trailing backslash -> (dropped)
  // a backslash followed by any character (including backslash) -> the character
  // empty string -> empty string
  var formatChr = /\\?(.?)/gi
  var formatChrCb = function (t, s) {
    return f[t] ? f[t]() : s
  }
  var _pad = function (n, c) {
    n = String(n)
    while (n.length < c) {
      n = '0' + n
    }
    return n
  }
  f = {
    // Day
    d: function () {
      // Day of month w/leading 0; 01..31
      return _pad(f.j(), 2)
    },
    D: function () {
      // Shorthand day name; Mon...Sun
      return f.l()
        .slice(0, 3)
    },
    j: function () {
      // Day of month; 1..31
      return jsdate.getDate()
    },
    l: function () {
      // Full day name; Monday...Sunday
      return txtWords[f.w()] + 'day'
    },
    N: function () {
      // ISO-8601 day of week; 1[Mon]..7[Sun]
      return f.w() || 7
    },
    S: function () {
      // Ordinal suffix for day of month; st, nd, rd, th
      var j = f.j()
      var i = j % 10
      if (i <= 3 && parseInt((j % 100) / 10, 10) === 1) {
        i = 0
      }
      return ['st', 'nd', 'rd'][i - 1] || 'th'
    },
    w: function () {
      // Day of week; 0[Sun]..6[Sat]
      return jsdate.getDay()
    },
    z: function () {
      // Day of year; 0..365
      var a = new Date(f.Y(), f.n() - 1, f.j())
      var b = new Date(f.Y(), 0, 1)
      return Math.round((a - b) / 864e5)
    },

    // Week
    W: function () {
      // ISO-8601 week number
      var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3)
      var b = new Date(a.getFullYear(), 0, 4)
      return _pad(1 + Math.round((a - b) / 864e5 / 7), 2)
    },

    // Month
    F: function () {
      // Full month name; January...December
      return txtWords[6 + f.n()]
    },
    m: function () {
      // Month w/leading 0; 01...12
      return _pad(f.n(), 2)
    },
    M: function () {
      // Shorthand month name; Jan...Dec
      return f.F()
        .slice(0, 3)
    },
    n: function () {
      // Month; 1...12
      return jsdate.getMonth() + 1
    },
    t: function () {
      // Days in month; 28...31
      return (new Date(f.Y(), f.n(), 0))
        .getDate()
    },

    // Year
    L: function () {
      // Is leap year?; 0 or 1
      var j = f.Y()
      return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0
    },
    o: function () {
      // ISO-8601 year
      var n = f.n()
      var W = f.W()
      var Y = f.Y()
      return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0)
    },
    Y: function () {
      // Full year; e.g. 1980...2010
      return jsdate.getFullYear()
    },
    y: function () {
      // Last two digits of year; 00...99
      return f.Y()
        .toString()
        .slice(-2)
    },

    // Time
    a: function () {
      // am or pm
      return jsdate.getHours() > 11 ? 'pm' : 'am'
    },
    A: function () {
      // AM or PM
      return f.a()
        .toUpperCase()
    },
    B: function () {
      // Swatch Internet time; 000..999
      var H = jsdate.getUTCHours() * 36e2
      // Hours
      var i = jsdate.getUTCMinutes() * 60
      // Minutes
      // Seconds
      var s = jsdate.getUTCSeconds()
      return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3)
    },
    g: function () {
      // 12-Hours; 1..12
      return f.G() % 12 || 12
    },
    G: function () {
      // 24-Hours; 0..23
      return jsdate.getHours()
    },
    h: function () {
      // 12-Hours w/leading 0; 01..12
      return _pad(f.g(), 2)
    },
    H: function () {
      // 24-Hours w/leading 0; 00..23
      return _pad(f.G(), 2)
    },
    i: function () {
      // Minutes w/leading 0; 00..59
      return _pad(jsdate.getMinutes(), 2)
    },
    s: function () {
      // Seconds w/leading 0; 00..59
      return _pad(jsdate.getSeconds(), 2)
    },
    u: function () {
      // Microseconds; 000000-999000
      return _pad(jsdate.getMilliseconds() * 1000, 6)
    },

    // Timezone
    e: function () {
      // Timezone identifier; e.g. Atlantic/Azores, ...
      // The following works, but requires inclusion of the very large
      // timezone_abbreviations_list() function.
      /*              return that.date_default_timezone_get();
       */
      var msg = 'Not supported (see source code of date() for timezone on how to add support)'
      throw new Error(msg)
    },
    I: function () {
      // DST observed?; 0 or 1
      // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
      // If they are not equal, then DST is observed.
      var a = new Date(f.Y(), 0)
      // Jan 1
      var c = Date.UTC(f.Y(), 0)
      // Jan 1 UTC
      var b = new Date(f.Y(), 6)
      // Jul 1
      // Jul 1 UTC
      var d = Date.UTC(f.Y(), 6)
      return ((a - c) !== (b - d)) ? 1 : 0
    },
    O: function () {
      // Difference to GMT in hour format; e.g. +0200
      var tzo = jsdate.getTimezoneOffset()
      var a = Math.abs(tzo)
      return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4)
    },
    P: function () {
      // Difference to GMT w/colon; e.g. +02:00
      var O = f.O()
      return (O.substr(0, 3) + ':' + O.substr(3, 2))
    },
    T: function () {
      // The following works, but requires inclusion of the very
      // large timezone_abbreviations_list() function.
      /*              var abbr, i, os, _default;
      if (!tal.length) {
        tal = that.timezone_abbreviations_list();
      }
      if ($locutus && $locutus.default_timezone) {
        _default = $locutus.default_timezone;
        for (abbr in tal) {
          for (i = 0; i < tal[abbr].length; i++) {
            if (tal[abbr][i].timezone_id === _default) {
              return abbr.toUpperCase();
            }
          }
        }
      }
      for (abbr in tal) {
        for (i = 0; i < tal[abbr].length; i++) {
          os = -jsdate.getTimezoneOffset() * 60;
          if (tal[abbr][i].offset === os) {
            return abbr.toUpperCase();
          }
        }
      }
      */
      return 'UTC'
    },
    Z: function () {
      // Timezone offset in seconds (-43200...50400)
      return -jsdate.getTimezoneOffset() * 60
    },

    // Full Date/Time
    c: function () {
      // ISO-8601 date.
      return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb)
    },
    r: function () {
      // RFC 2822
      return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb)
    },
    U: function () {
      // Seconds since UNIX epoch
      return jsdate / 1000 | 0
    }
  }

  var _date = function (format, timestamp) {
    jsdate = (timestamp === undefined ? new Date() // Not provided
      : (timestamp instanceof Date) ? new Date(timestamp) // JS Date()
      : new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
    )
    return format.replace(formatChr, formatChrCb)
  }

  return _date(format, timestamp)
}
/**
* Detect Element Resize
*
* https://github.com/sdecima/javascript-detect-element-resize
* Sebastian Decima
*
* version: 0.5.3
**/

(function () {
	var attachEvent = document.attachEvent,
		stylesCreated = false;
	
	if (!attachEvent) {
		var requestFrame = (function(){
			var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
								function(fn){ return window.setTimeout(fn, 20); };
			return function(fn){ return raf(fn); };
		})();
		
		var cancelFrame = (function(){
			var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
								   window.clearTimeout;
		  return function(id){ return cancel(id); };
		})();

		var resetTriggers = function(element){
			var triggers = element.__resizeTriggers__,
				expand = triggers.firstElementChild,
				contract = triggers.lastElementChild,
				expandChild = expand.firstElementChild;
			contract.scrollLeft = contract.scrollWidth;
			contract.scrollTop = contract.scrollHeight;
			expandChild.style.width = expand.offsetWidth + 1 + 'px';
			expandChild.style.height = expand.offsetHeight + 1 + 'px';
			expand.scrollLeft = expand.scrollWidth;
			expand.scrollTop = expand.scrollHeight;
		};

		var checkTriggers = function(element){
			return element.offsetWidth != element.__resizeLast__.width ||
						 element.offsetHeight != element.__resizeLast__.height;
		}
		
		var scrollListener = function(e){
			var element = this;
			resetTriggers(this);
			if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
			this.__resizeRAF__ = requestFrame(function(){
				if (checkTriggers(element)) {
					element.__resizeLast__.width = element.offsetWidth;
					element.__resizeLast__.height = element.offsetHeight;
					element.__resizeListeners__.forEach(function(fn){
						fn.call(element, e);
					});
				}
			});
		};
		
		/* Detect CSS Animations support to detect element display/re-attach */
		var animation = false,
			animationstring = 'animation',
			keyframeprefix = '',
			animationstartevent = 'animationstart',
			domPrefixes = 'Webkit Moz O ms'.split(' '),
			startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' '),
			pfx  = '';
		{
			var elm = document.createElement('fakeelement');
			if( elm.style.animationName !== undefined ) { animation = true; }    
			
			if( animation === false ) {
				for( var i = 0; i < domPrefixes.length; i++ ) {
					if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
						pfx = domPrefixes[ i ];
						animationstring = pfx + 'Animation';
						keyframeprefix = '-' + pfx.toLowerCase() + '-';
						animationstartevent = startEvents[ i ];
						animation = true;
						break;
					}
				}
			}
		}
		
		var animationName = 'resizeanim';
		var animationKeyframes = '@' + keyframeprefix + 'keyframes ' + animationName + ' { from { opacity: 0; } to { opacity: 0; } } ';
		var animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; ';
	}
	
	function createStyles() {
		if (!stylesCreated) {
			//opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
			var css = (animationKeyframes ? animationKeyframes : '') +
					'.resize-triggers { ' + (animationStyle ? animationStyle : '') + 'visibility: hidden; opacity: 0; } ' +
					'.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',
				head = document.head || document.getElementsByTagName('head')[0],
				style = document.createElement('style');
			
			style.type = 'text/css';
			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}

			head.appendChild(style);
			stylesCreated = true;
		}
	}
	
	window.addResizeListener = function(element, fn){
		if (attachEvent) element.attachEvent('onresize', fn);
		else {
			if (!element.__resizeTriggers__) {
				if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
				createStyles();
				element.__resizeLast__ = {};
				element.__resizeListeners__ = [];
				(element.__resizeTriggers__ = document.createElement('div')).className = 'resize-triggers';
				element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' +
																						'<div class="contract-trigger"></div>';
				element.appendChild(element.__resizeTriggers__);
				resetTriggers(element);
				element.addEventListener('scroll', scrollListener, true);
				
				/* Listen for a css animation to detect element display/re-attach */
				animationstartevent && element.__resizeTriggers__.addEventListener(animationstartevent, function(e) {
					if(e.animationName == animationName)
						resetTriggers(element);
				});
			}
			element.__resizeListeners__.push(fn);
		}
	};
	
	window.removeResizeListener = function(element, fn){
		if (attachEvent) element.detachEvent('onresize', fn);
		else {
			element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
			if (!element.__resizeListeners__.length) {
					element.removeEventListener('scroll', scrollListener);
					element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
			}
		}
	}
})();
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.VueInfiniteLoading=t():e.VueInfiniteLoading=t()}("undefined"!=typeof self?self:this,function(){return function(e){function t(n){if(i[n])return i[n].exports;var a=i[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var i={};return t.m=e,t.c=i,t.d=function(e,i,n){t.o(e,i)||Object.defineProperty(e,i,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var i=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(i,"a",i),i},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/",t(t.s=3)}([function(e,t){function i(e,t){var i=e[1]||"",a=e[3];if(!a)return i;if(t&&"function"==typeof btoa){var r=n(a);return[i].concat(a.sources.map(function(e){return"/*# sourceURL="+a.sourceRoot+e+" */"})).concat([r]).join("\n")}return[i].join("\n")}function n(e){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(e))))+" */"}e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var n=i(t,e);return t[2]?"@media "+t[2]+"{"+n+"}":n}).join("")},t.i=function(e,i){"string"==typeof e&&(e=[[null,e,""]]);for(var n={},a=0;a<this.length;a++){var r=this[a][0];"number"==typeof r&&(n[r]=!0)}for(a=0;a<e.length;a++){var o=e[a];"number"==typeof o[0]&&n[o[0]]||(i&&!o[2]?o[2]=i:i&&(o[2]="("+o[2]+") and ("+i+")"),t.push(o))}},t}},function(e,t,i){function n(e){for(var t=0;t<e.length;t++){var i=e[t],n=f[i.id];if(n){n.refs++;for(var a=0;a<n.parts.length;a++)n.parts[a](i.parts[a]);for(;a<i.parts.length;a++)n.parts.push(r(i.parts[a]));n.parts.length>i.parts.length&&(n.parts.length=i.parts.length)}else{for(var o=[],a=0;a<i.parts.length;a++)o.push(r(i.parts[a]));f[i.id]={id:i.id,refs:1,parts:o}}}}function a(){var e=document.createElement("style");return e.type="text/css",c.appendChild(e),e}function r(e){var t,i,n=document.querySelector('style[data-vue-ssr-id~="'+e.id+'"]');if(n){if(m)return h;n.parentNode.removeChild(n)}if(b){var r=p++;n=u||(u=a()),t=o.bind(null,n,r,!1),i=o.bind(null,n,r,!0)}else n=a(),t=s.bind(null,n),i=function(){n.parentNode.removeChild(n)};return t(e),function(n){if(n){if(n.css===e.css&&n.media===e.media&&n.sourceMap===e.sourceMap)return;t(e=n)}else i()}}function o(e,t,i,n){var a=i?"":n.css;if(e.styleSheet)e.styleSheet.cssText=g(t,a);else{var r=document.createTextNode(a),o=e.childNodes;o[t]&&e.removeChild(o[t]),o.length?e.insertBefore(r,o[t]):e.appendChild(r)}}function s(e,t){var i=t.css,n=t.media,a=t.sourceMap;if(n&&e.setAttribute("media",n),a&&(i+="\n/*# sourceURL="+a.sources[0]+" */",i+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(a))))+" */"),e.styleSheet)e.styleSheet.cssText=i;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(i))}}var l="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!l)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var d=i(7),f={},c=l&&(document.head||document.getElementsByTagName("head")[0]),u=null,p=0,m=!1,h=function(){},b="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());e.exports=function(e,t,i){m=i;var a=d(e,t);return n(a),function(t){for(var i=[],r=0;r<a.length;r++){var o=a[r],s=f[o.id];s.refs--,i.push(s)}t?(a=d(e,t),n(a)):a=[];for(var r=0;r<i.length;r++){var s=i[r];if(0===s.refs){for(var l=0;l<s.parts.length;l++)s.parts[l]();delete f[s.id]}}}};var g=function(){var e=[];return function(t,i){return e[t]=i,e.filter(Boolean).join("\n")}}()},function(e,t){e.exports=function(e,t,i,n,a,r){var o,s=e=e||{},l=typeof e.default;"object"!==l&&"function"!==l||(o=e,s=e.default);var d="function"==typeof s?s.options:s;t&&(d.render=t.render,d.staticRenderFns=t.staticRenderFns,d._compiled=!0),i&&(d.functional=!0),a&&(d._scopeId=a);var f;if(r?(f=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),n&&n.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(r)},d._ssrRegister=f):n&&(f=n),f){var c=d.functional,u=c?d.render:d.beforeCreate;c?(d._injectStyles=f,d.render=function(e,t){return f.call(t),u(e,t)}):d.beforeCreate=u?[].concat(u,f):[f]}return{esModule:o,exports:s,options:d}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(4);t.default=n.a,"undefined"!=typeof window&&window.Vue&&window.Vue.component("infinite-loading",n.a)},function(e,t,i){"use strict";function n(e){i(5)}var a=i(8),r=i(14),o=i(2),s=n,l=o(a.a,r.a,!1,s,"data-v-fb2c869e",null);t.a=l.exports},function(e,t,i){var n=i(6);"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);i(1)("2249d7a7",n,!0)},function(e,t,i){t=e.exports=i(0)(void 0),t.push([e.i,".infinite-loading-container[data-v-fb2c869e]{clear:both;text-align:center}.infinite-loading-container[data-v-fb2c869e] [class^=loading-]{display:inline-block;margin:15px 0;width:28px;height:28px;font-size:28px;line-height:28px;border-radius:50%}.infinite-status-prompt[data-v-fb2c869e]{color:#666;font-size:14px;text-align:center;padding:10px 0}",""])},function(e,t){e.exports=function(e,t){for(var i=[],n={},a=0;a<t.length;a++){var r=t[a],o=r[0],s=r[1],l=r[2],d=r[3],f={id:e+":"+a,css:s,media:l,sourceMap:d};n[o]?n[o].parts.push(f):i.push(n[o]={id:o,parts:[f]})}return i}},function(e,t,i){"use strict";var n=i(9),a={STATE_CHANGER:["[Vue-infinite-loading warn]: emit `loaded` and `complete` event through component instance of `$refs` may cause error, so it will be deprecated soon, please use the `$state` argument instead (`$state` just the special `$event` variable):","\ntemplate:",'<infinite-loading @infinite="infiniteHandler"></infinite-loading>',"\nscript:\n...\ninfiniteHandler($state) {\n  ajax('https://www.example.com/api/news')\n    .then((res) => {\n      if (res.data.length) {\n        $state.loaded();\n      } else {\n        $state.complete();\n      }\n    });\n}\n...","","more details: https://github.com/PeachScript/vue-infinite-loading/issues/57#issuecomment-324370549"].join("\n"),INFINITE_EVENT:"[Vue-infinite-loading warn]: `:on-infinite` property will be deprecated soon, please use `@infinite` event instead."},r={INFINITE_LOOP:["[Vue-infinite-loading error]: executed the callback function more than 10 times for a short time, it looks like searched a wrong scroll wrapper that doest not has fixed height or maximum height, please check it. If you want to force to set a element as scroll wrapper ranther than automatic searching, you can do this:",'\n\x3c!-- add a special attribute for the real scroll wrapper --\x3e\n<div infinite-wrapper>\n  ...\n  \x3c!-- set force-use-infinite-wrapper to true --\x3e\n  <infinite-loading force-use-infinite-wrapper="true"></infinite-loading>\n</div>\n    ',"more details: https://github.com/PeachScript/vue-infinite-loading/issues/55#issuecomment-316934169"].join("\n")};t.a={name:"InfiniteLoading",data:function(){return{scrollParent:null,scrollHandler:null,isLoading:!1,isComplete:!1,isFirstLoad:!0,debounceTimer:null,debounceDuration:50,infiniteLoopChecked:!1,infiniteLoopTimer:null,continuousCallTimes:0}},components:{Spinner:n.a},computed:{isNoResults:{cache:!1,get:function(){var e=this.$slots["no-results"],t=e&&e[0].elm&&""===e[0].elm.textContent;return!this.isLoading&&this.isComplete&&this.isFirstLoad&&!t}},isNoMore:{cache:!1,get:function(){var e=this.$slots["no-more"],t=e&&e[0].elm&&""===e[0].elm.textContent;return!this.isLoading&&this.isComplete&&!this.isFirstLoad&&!t}}},props:{distance:{type:Number,default:100},onInfinite:Function,spinner:String,direction:{type:String,default:"bottom"},forceUseInfiniteWrapper:null},mounted:function(){var e=this;this.scrollParent=this.getScrollParent(),this.scrollHandler=function(e){this.isLoading||(clearTimeout(this.debounceTimer),e&&e.constructor===Event?this.debounceTimer=setTimeout(this.attemptLoad,this.debounceDuration):this.attemptLoad())}.bind(this),setTimeout(this.scrollHandler,1),this.scrollParent.addEventListener("scroll",this.scrollHandler),this.$on("$InfiniteLoading:loaded",function(t){e.isFirstLoad=!1,e.isLoading&&e.$nextTick(e.attemptLoad.bind(null,!0)),t&&t.target===e||console.warn(a.STATE_CHANGER)}),this.$on("$InfiniteLoading:complete",function(t){e.isLoading=!1,e.isComplete=!0,e.$nextTick(function(){e.$forceUpdate()}),e.scrollParent.removeEventListener("scroll",e.scrollHandler),t&&t.target===e||console.warn(a.STATE_CHANGER)}),this.$on("$InfiniteLoading:reset",function(){e.isLoading=!1,e.isComplete=!1,e.isFirstLoad=!0,e.scrollParent.addEventListener("scroll",e.scrollHandler),setTimeout(e.scrollHandler,1)}),this.onInfinite&&console.warn(a.INFINITE_EVENT),this.stateChanger={loaded:function(){e.$emit("$InfiniteLoading:loaded",{target:e})},complete:function(){e.$emit("$InfiniteLoading:complete",{target:e})},reset:function(){e.$emit("$InfiniteLoading:reset",{target:e})}},this.$watch("forceUseInfiniteWrapper",function(){e.scrollParent=e.getScrollParent()})},deactivated:function(){this.isLoading=!1,this.scrollParent.removeEventListener("scroll",this.scrollHandler)},activated:function(){this.scrollParent.addEventListener("scroll",this.scrollHandler)},methods:{attemptLoad:function(e){var t=this,i=this.getCurrentDistance();!this.isComplete&&i<=this.distance&&this.$el.offsetWidth+this.$el.offsetHeight>0?(this.isLoading=!0,"function"==typeof this.onInfinite?this.onInfinite.call(null,this.stateChanger):this.$emit("infinite",this.stateChanger),!e||this.forceUseInfiniteWrapper||this.infiniteLoopChecked||(this.continuousCallTimes+=1,clearTimeout(this.infiniteLoopTimer),this.infiniteLoopTimer=setTimeout(function(){t.infiniteLoopChecked=!0},1e3),this.continuousCallTimes>10&&(console.error(r.INFINITE_LOOP),this.infiniteLoopChecked=!0))):this.isLoading=!1},getCurrentDistance:function(){var e=void 0;if("top"===this.direction)e=isNaN(this.scrollParent.scrollTop)?this.scrollParent.pageYOffset:this.scrollParent.scrollTop;else{e=this.$el.getBoundingClientRect().top-(this.scrollParent===window?window.innerHeight:this.scrollParent.getBoundingClientRect().bottom)}return e},getScrollParent:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.$el,t=void 0;return"BODY"===e.tagName?t=window:!this.forceUseInfiniteWrapper&&["scroll","auto"].indexOf(getComputedStyle(e).overflowY)>-1?t=e:(e.hasAttribute("infinite-wrapper")||e.hasAttribute("data-infinite-wrapper"))&&(t=e),t||this.getScrollParent(e.parentNode)}},destroyed:function(){this.isComplete||this.scrollParent.removeEventListener("scroll",this.scrollHandler)}}},function(e,t,i){"use strict";function n(e){i(10)}var a=i(12),r=i(13),o=i(2),s=n,l=o(a.a,r.a,!1,s,"data-v-6e1fd88f",null);t.a=l.exports},function(e,t,i){var n=i(11);"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);i(1)("29881045",n,!0)},function(e,t,i){t=e.exports=i(0)(void 0),t.push([e.i,'.loading-wave-dots[data-v-6e1fd88f]{position:relative}.loading-wave-dots[data-v-6e1fd88f] .wave-item{position:absolute;top:50%;left:50%;display:inline-block;margin-top:-4px;width:8px;height:8px;border-radius:50%;-webkit-animation:loading-wave-dots-data-v-6e1fd88f linear 2.8s infinite;animation:loading-wave-dots-data-v-6e1fd88f linear 2.8s infinite}.loading-wave-dots[data-v-6e1fd88f] .wave-item:first-child{margin-left:-36px}.loading-wave-dots[data-v-6e1fd88f] .wave-item:nth-child(2){margin-left:-20px;-webkit-animation-delay:.14s;animation-delay:.14s}.loading-wave-dots[data-v-6e1fd88f] .wave-item:nth-child(3){margin-left:-4px;-webkit-animation-delay:.28s;animation-delay:.28s}.loading-wave-dots[data-v-6e1fd88f] .wave-item:nth-child(4){margin-left:12px;-webkit-animation-delay:.42s;animation-delay:.42s}.loading-wave-dots[data-v-6e1fd88f] .wave-item:last-child{margin-left:28px;-webkit-animation-delay:.56s;animation-delay:.56s}@-webkit-keyframes loading-wave-dots-data-v-6e1fd88f{0%{-webkit-transform:translateY(0);transform:translateY(0);background:#bbb}10%{-webkit-transform:translateY(-6px);transform:translateY(-6px);background:#999}20%{-webkit-transform:translateY(0);transform:translateY(0);background:#bbb}to{-webkit-transform:translateY(0);transform:translateY(0);background:#bbb}}@keyframes loading-wave-dots-data-v-6e1fd88f{0%{-webkit-transform:translateY(0);transform:translateY(0);background:#bbb}10%{-webkit-transform:translateY(-6px);transform:translateY(-6px);background:#999}20%{-webkit-transform:translateY(0);transform:translateY(0);background:#bbb}to{-webkit-transform:translateY(0);transform:translateY(0);background:#bbb}}.loading-circles[data-v-6e1fd88f] .circle-item{width:5px;height:5px;-webkit-animation:loading-circles-data-v-6e1fd88f linear .75s infinite;animation:loading-circles-data-v-6e1fd88f linear .75s infinite}.loading-circles[data-v-6e1fd88f] .circle-item:first-child{margin-top:-14.5px;margin-left:-2.5px}.loading-circles[data-v-6e1fd88f] .circle-item:nth-child(2){margin-top:-11.26px;margin-left:6.26px}.loading-circles[data-v-6e1fd88f] .circle-item:nth-child(3){margin-top:-2.5px;margin-left:9.5px}.loading-circles[data-v-6e1fd88f] .circle-item:nth-child(4){margin-top:6.26px;margin-left:6.26px}.loading-circles[data-v-6e1fd88f] .circle-item:nth-child(5){margin-top:9.5px;margin-left:-2.5px}.loading-circles[data-v-6e1fd88f] .circle-item:nth-child(6){margin-top:6.26px;margin-left:-11.26px}.loading-circles[data-v-6e1fd88f] .circle-item:nth-child(7){margin-top:-2.5px;margin-left:-14.5px}.loading-circles[data-v-6e1fd88f] .circle-item:last-child{margin-top:-11.26px;margin-left:-11.26px}@-webkit-keyframes loading-circles-data-v-6e1fd88f{0%{background:#dfdfdf}90%{background:#505050}to{background:#dfdfdf}}@keyframes loading-circles-data-v-6e1fd88f{0%{background:#dfdfdf}90%{background:#505050}to{background:#dfdfdf}}.loading-bubbles[data-v-6e1fd88f] .bubble-item{background:#666;-webkit-animation:loading-bubbles-data-v-6e1fd88f linear .75s infinite;animation:loading-bubbles-data-v-6e1fd88f linear .75s infinite}.loading-bubbles[data-v-6e1fd88f] .bubble-item:first-child{margin-top:-12.5px;margin-left:-.5px}.loading-bubbles[data-v-6e1fd88f] .bubble-item:nth-child(2){margin-top:-9.26px;margin-left:8.26px}.loading-bubbles[data-v-6e1fd88f] .bubble-item:nth-child(3){margin-top:-.5px;margin-left:11.5px}.loading-bubbles[data-v-6e1fd88f] .bubble-item:nth-child(4){margin-top:8.26px;margin-left:8.26px}.loading-bubbles[data-v-6e1fd88f] .bubble-item:nth-child(5){margin-top:11.5px;margin-left:-.5px}.loading-bubbles[data-v-6e1fd88f] .bubble-item:nth-child(6){margin-top:8.26px;margin-left:-9.26px}.loading-bubbles[data-v-6e1fd88f] .bubble-item:nth-child(7){margin-top:-.5px;margin-left:-12.5px}.loading-bubbles[data-v-6e1fd88f] .bubble-item:last-child{margin-top:-9.26px;margin-left:-9.26px}@-webkit-keyframes loading-bubbles-data-v-6e1fd88f{0%{width:1px;height:1px;box-shadow:0 0 0 3px #666}90%{width:1px;height:1px;box-shadow:0 0 0 0 #666}to{width:1px;height:1px;box-shadow:0 0 0 3px #666}}@keyframes loading-bubbles-data-v-6e1fd88f{0%{width:1px;height:1px;box-shadow:0 0 0 3px #666}90%{width:1px;height:1px;box-shadow:0 0 0 0 #666}to{width:1px;height:1px;box-shadow:0 0 0 3px #666}}.loading-default[data-v-6e1fd88f]{position:relative;border:1px solid #999;-webkit-animation:loading-rotating-data-v-6e1fd88f ease 1.5s infinite;animation:loading-rotating-data-v-6e1fd88f ease 1.5s infinite}.loading-default[data-v-6e1fd88f]:before{content:"";position:absolute;display:block;top:0;left:50%;margin-top:-3px;margin-left:-3px;width:6px;height:6px;background-color:#999;border-radius:50%}.loading-spiral[data-v-6e1fd88f]{border:2px solid #777;border-right-color:transparent;-webkit-animation:loading-rotating-data-v-6e1fd88f linear .85s infinite;animation:loading-rotating-data-v-6e1fd88f linear .85s infinite}@-webkit-keyframes loading-rotating-data-v-6e1fd88f{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes loading-rotating-data-v-6e1fd88f{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}.loading-bubbles[data-v-6e1fd88f],.loading-circles[data-v-6e1fd88f]{position:relative}.loading-bubbles[data-v-6e1fd88f] .bubble-item,.loading-circles[data-v-6e1fd88f] .circle-item{position:absolute;top:50%;left:50%;display:inline-block;border-radius:50%}.loading-bubbles[data-v-6e1fd88f] .bubble-item:nth-child(2),.loading-circles[data-v-6e1fd88f] .circle-item:nth-child(2){-webkit-animation-delay:93ms;animation-delay:93ms}.loading-bubbles[data-v-6e1fd88f] .bubble-item:nth-child(3),.loading-circles[data-v-6e1fd88f] .circle-item:nth-child(3){-webkit-animation-delay:.186s;animation-delay:.186s}.loading-bubbles[data-v-6e1fd88f] .bubble-item:nth-child(4),.loading-circles[data-v-6e1fd88f] .circle-item:nth-child(4){-webkit-animation-delay:.279s;animation-delay:.279s}.loading-bubbles[data-v-6e1fd88f] .bubble-item:nth-child(5),.loading-circles[data-v-6e1fd88f] .circle-item:nth-child(5){-webkit-animation-delay:.372s;animation-delay:.372s}.loading-bubbles[data-v-6e1fd88f] .bubble-item:nth-child(6),.loading-circles[data-v-6e1fd88f] .circle-item:nth-child(6){-webkit-animation-delay:.465s;animation-delay:.465s}.loading-bubbles[data-v-6e1fd88f] .bubble-item:nth-child(7),.loading-circles[data-v-6e1fd88f] .circle-item:nth-child(7){-webkit-animation-delay:.558s;animation-delay:.558s}.loading-bubbles[data-v-6e1fd88f] .bubble-item:last-child,.loading-circles[data-v-6e1fd88f] .circle-item:last-child{-webkit-animation-delay:.651s;animation-delay:.651s}',""])},function(e,t,i){"use strict";var n={BUBBLES:{render:function(e){return e("span",{attrs:{class:"loading-bubbles"}},Array.apply(Array,Array(8)).map(function(){return e("span",{attrs:{class:"bubble-item"}})}))}},CIRCLES:{render:function(e){return e("span",{attrs:{class:"loading-circles"}},Array.apply(Array,Array(8)).map(function(){return e("span",{attrs:{class:"circle-item"}})}))}},DEFAULT:{render:function(e){return e("i",{attrs:{class:"loading-default"}})}},SPIRAL:{render:function(e){return e("i",{attrs:{class:"loading-spiral"}})}},WAVEDOTS:{render:function(e){return e("span",{attrs:{class:"loading-wave-dots"}},Array.apply(Array,Array(5)).map(function(){return e("span",{attrs:{class:"wave-item"}})}))}}};t.a={name:"spinner",computed:{spinnerView:function(){return n[(this.spinner||"").toUpperCase()]||n.DEFAULT}},props:{spinner:String}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)(e.spinnerView,{tag:"component"})},a=[],r={render:n,staticRenderFns:a};t.a=r},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"infinite-loading-container"},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.isLoading,expression:"isLoading"}]},[e._t("spinner",[i("spinner",{attrs:{spinner:e.spinner}})])],2),e._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:e.isNoResults,expression:"isNoResults"}],staticClass:"infinite-status-prompt"},[e._t("no-results",[e._v("No results :(")])],2),e._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:e.isNoMore,expression:"isNoMore"}],staticClass:"infinite-status-prompt"},[e._t("no-more",[e._v("No more data :)")])],2)])},a=[],r={render:n,staticRenderFns:a};t.a=r}])});
var NativeApplication = {
	setBadge(val) {
		if ('ExperimentalBadge' in window) {
			if (val) {
				try {
					window.ExperimentalBadge.set(val);
				} catch (ex) {
					window.ExperimentalBadge.set();
				}
			} else {
				window.ExperimentalBadge.clear();
			}
		}
	}
};

/*
var parseQueryString = function( queryString ) {
    var params = {}, queries, temp, i, l;
    // Split into key/value pairs
    queries = queryString.split("&");
    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
    return params;
};

var params = parseQueryString(document.location.search.substring(1));
if (params['utm_source'] == 'webapp' || window.navigator.standalone) {
	document.getElementsByTagName("html")[0].className += ' webapp';
}
*/

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
		var m = document.querySelector("link[type='text/css']").href.match(/\?([0-9\.]+)/);
		var scriptsVersion = m?m[0]:'';
	    
        navigator.serviceWorker.register('/serviceworker.js?v='+scriptsVersion).then(function(registration) {
            // Регистрация успешна
        }).catch(function(err) {
            // Регистрация не успешна
        });
    });
}
(function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.VNumber = t() : e.VNumber = t()
})(this, function() {
    return function(e) {
        function t(r) {
            if (n[r]) return n[r].exports;
            var i = n[r] = {
                i: r,
                l: !1,
                exports: {}
            };
            return e[r].call(i.exports, i, i.exports, t), i.l = !0, i.exports
        }
        var n = {};
        return t.m = e, t.c = n, t.i = function(e) {
            return e
        }, t.d = function(e, n, r) {
            t.o(e, n) || Object.defineProperty(e, n, {
                configurable: !1,
                enumerable: !0,
                get: r
            })
        }, t.n = function(e) {
            var n = e && e.__esModule ? function() {
                return e.default
            } : function() {
                return e
            };
            return t.d(n, "a", n), n
        }, t.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, t.p = ".", t(t.s = 9)
    }([function(e, t, n) {
        "use strict";
        t.a = {
            prefix: "",
            suffix: "",
            thousands: ",",
            decimal: ".",
            precision: 2
        }
    }, function(e, t, n) {
        "use strict";
        var r = n(2),
            i = n(5),
            u = n(0);
        t.a = function(e, t) {
            if (t.value) {
                var o = n.i(i.a)(u.a, t.value);
                if ("INPUT" !== e.tagName.toLocaleUpperCase()) {
                    var a = e.getElementsByTagName("input");
                    1 !== a.length || (e = a[0])
                }
                e.oninput = function() {
                    var positionFromEnd = e.value.length - e.selectionEnd;
                    //e.value = n.i(r.a)(e.value, o), 
                    
                    
                    if(e.value == 'R$ 0,0' || !e.value){
				      e.value = ''
				    }else{
				      e.value = n.i(r.a)(e.value, o)
				    }
                    
                    positionFromEnd = Math.max(positionFromEnd, o.suffix.length), 
                    positionFromEnd = e.value.length - positionFromEnd, 
                    positionFromEnd = Math.max(positionFromEnd, o.prefix.length + 1), 
                    n.i(r.b)(e, positionFromEnd), 
                    e.dispatchEvent(n.i(r.c)("change"))
                }, e.onfocus = function() {
                    n.i(r.b)(e, e.value.length - o.suffix.length)
                }, e.oninput(), e.dispatchEvent(n.i(r.c)("input"))
            }
        }
    }, function(e, t, n) {
        "use strict";
        
        function format(input, opt = defaults) {
		   if ((typeof input === 'string') && (opt.precision == 0)) {
			   let i = input.indexOf('.');
			  if (i != -1) input = input.substring(0, i);
			}
			
		  if (typeof input === 'number') {
			//  console.log('|',fixed(opt.precision));
		    input = input.toFixed(fixed(opt.precision))
//		    input = input.toString();
//	        console.log('=2:', input);
		  }
		  
		  
		  
		  var negative = input.indexOf('-') >= 0 ? '-' : ''
		
		  var numbers = onlyNumbers(input)
		  var currency = numbersToCurrency(numbers, opt.precision)
		  var parts = toStr(currency).split('.')
		  var integer = parts[0]
		  var decimal = parts[1]
		  integer = addThousandSeparator(integer, opt.thousands)



		  var v = ((opt.prefix != undefined)?opt.prefix:'') + negative + joinIntegerAndDecimal(integer, decimal, opt.decimal) + ((opt.suffix != undefined)?opt.suffix:'');
		  return v;
		}
		
		function unformat (input, precision) {
		  var negative = input.indexOf('-') >= 0 ? -1 : 1
		  var numbers = onlyNumbers(input)
		  var currency = numbersToCurrency(numbers, precision)
		  return parseFloat(currency) * negative
		}
		
		function onlyNumbers (input) {
		  return toStr(input).replace(/\D+/g, '') || '0'
		}
		
		// Uncaught RangeError: toFixed() digits argument must be between 0 and 20 at Number.toFixed
		function fixed (precision) {
		  return between(0, precision, 20)
		}
		
		function between (min, n, max) {
		  return Math.max(min, Math.min(n, max))
		}
		
		function numbersToCurrency (numbers, precision) {
		  var exp = Math.pow(10, precision)
		  var float = parseFloat(numbers) / exp
		  return float.toFixed(fixed(precision))
		}
		
		function addThousandSeparator (integer, separator) {
		  return integer.replace(/(\d)(?=(?:\d{3})+\b)/gm, `$1${separator}`)
		}
		
		function currencyToIntegerAndDecimal (float) {
		  return toStr(float).split('.')
		}
		
		function joinIntegerAndDecimal (integer, decimal, separator) {
		  return decimal ? integer + separator + decimal : integer
		}
		
		function toStr (value) {
		  return value ? value.toString() : ''
		}
		
		function setCursor (el, position) {
		  var setSelectionRange = function () { el.setSelectionRange(position, position) }
		  if (el === document.activeElement) {
		    setSelectionRange()
		    setTimeout(setSelectionRange, 1) // Android Fix
		  }
		}
		
		// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#The_old-fashioned_way
		function event (name) {
		  var evt = document.createEvent('Event')
		  evt.initEvent(name, true, true)
		  return evt
		}
        
        
        
        window.number_format = format;
        
        
        
        var m = n(0);
        n.d(t, "a", function() {
            return format
        }), n.d(t, "d", function() {
            return unformat
        }), n.d(t, "b", function() {
            return setCursor
        }), n.d(t, "c", function() {
            return event
        })
    }, function(e, t, n) {
        "use strict";

        function r(e, t) {
            t && Object.keys(t).map(function(e) {
                a.a[e] = t[e]
            }), e.directive("number", o.a), e.component("number", u.a)
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = n(6),
            u = n.n(i),
            o = n(1),
            a = n(0);
        n.d(t, "Number", function() {
            return u.a
        }), n.d(t, "VNumber", function() {
            return o.a
        }), n.d(t, "options", function() {
            return a.a
        });
        t.default = r, "undefined" != typeof window && window.Vue && window.Vue.use(r)
    }, function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = n(1),
            i = n(0),
            u = n(2);
        t.default = {
            name: "Number",
            props: {
                value: {
                    required: !0,
                    default: 0
                },
                masked: {
                    type: Boolean,
                    default: 0
                },
                precision: {
                    type: Number,
                    default: function() {
	                    return Vue.prototype.$account.number.precision;
//                         return i.a.precision
                    }
                },
                decimal: {
                    type: String,
                    default: function() {
	                    return Vue.prototype.$account.number.decimal;
//                         return i.a.decimal
                    }
                },
                thousands: {
                    type: String,
                    default: function() {
	                    return Vue.prototype.$account.number.thousands;
//                         return i.a.thousands
                    }
                },
                prefix: {
                    type: String,
                    default: function() {
                        return i.a.prefix
                    }
                },
                suffix: {
                    type: String,
                    default: function() {
                        return i.a.suffix
                    }
                }
            },
            directives: {
                number: r.a
            },
            data: function() {
                return {
                    formattedValue: ""
                }
            },
            watch: {
                value: {
                    immediate: true,
                    handler: function(newValue, oldValue) {
                        //var r = n.i(u.a)(newValue, this.$props);
                        if(newValue === null || newValue === ''){
				          var formatted = '';
				        }else{
// 					        console.log(n.i(u.a));
				          var formatted = n.i(u.a)(newValue, this.$props)
				        }
						if (formatted !== this.formattedValue) {
						          this.formattedValue = formatted
						        }	
						        
//                         r !== this.formattedValue && (this.formattedValue = r)
                    }
                }
            },
            methods: {
                change: function(e) {
					this.$emit('input', this.masked ? e.target.value : ( (!e.target.value) ? e.target.value : n.i(u.d)(e.target.value, this.precision)))
                  //this.$emit("input", this.masked ? e.target.value : n.i(u.d)(e.target.value, this.precision))
                }
            }
        }
    }, function(e, t, n) {
        "use strict";
        t.a = function(e, t) {
            return e = e || {}, t = t || {}, Object.keys(e).concat(Object.keys(t)).reduce(function(n, r) {
                return n[r] = void 0 === t[r] ? e[r] : t[r], n
            }, {})
        }
    }, function(e, t, n) {
        var r = n(7)(n(4), n(8), null, null);
        e.exports = r.exports
    }, function(e, t) {
        e.exports = function(e, t, n, r) {
            var i, u = e = e || {},
                o = typeof e.default;
            "object" !== o && "function" !== o || (i = e, u = e.default);
            var a = "function" == typeof u ? u.options : u;
            if (t && (a.render = t.render, a.staticRenderFns = t.staticRenderFns), n && (a._scopeId = n), r) {
                var c = a.computed || (a.computed = {});
                Object.keys(r).forEach(function(e) {
                    var t = r[e];
                    c[e] = function() {
                        return t
                    }
                })
            }
            return {
                esModule: i,
                exports: u,
                options: a
            }
        }
    }, function(e, t) {
        e.exports = {
            render: function() {
                var e = this,
                    t = e.$createElement;
                return (e._self._c || t)("input", {
                    directives: [{
                        name: "number",
                        rawName: "v-number",
                        value: {
                            precision: e.precision,
                            decimal: e.decimal,
                            thousands: e.thousands,
                            prefix: e.prefix,
                            suffix: e.suffix
                        },
                        expression: "{precision, decimal, thousands, prefix, suffix}"
                    }],
                    staticClass: "v-number",
                    attrs: {
                        type: "text"
                    },
                    domProps: {
                        value: e.formattedValue
                    },
                    on: {
                        change: e.change
                    }
                })
            },
            staticRenderFns: []
        }
    }, function(e, t, n) {
        e.exports = n(3)
    }])
});
/*
	Добавил $mx('html').addClass('is-dragging');
	scrollContainer prop для хака <div overflow:scroll> main-block
	//hack: r:r <-- Хак для нашей системы, когда .main-block на всю ширину это работает
*/
! function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e(t.VueSlicksort = {})
}(this, function(t) {
    "use strict";
    var e = {
            inject: ["manager"],
            props: {
                index: {
                    type: Number,
                    required: !0
                },
                collection: {
                    type: [String, Number],
                    default: "default"
                },
                disabled: {
                    type: Boolean,
                    default: !1
                }
            },
            mounted: function() {
                var t = this.$props,
                    e = t.collection,
                    i = t.disabled,
                    n = t.index;
                i || this.setDraggable(e, n)
            },
            watch: {
                index: function(t) {
                    this.$el && this.$el.sortableInfo && (this.$el.sortableInfo.index = t)
                },
                disabled: function(t) {
                    t ? this.removeDraggable(this.collection) : this.setDraggable(this.collection, this.index)
                },
                collection: function(t, e) {
                    this.removeDraggable(e), this.setDraggable(t, this.index)
                }
            },
            beforeDestroy: function() {
                var t = this.collection;
                this.disabled || this.removeDraggable(t)
            },
            methods: {
                setDraggable: function(t, e) {
                    var i = this.$el;
                    i.sortableInfo = {
                        index: e,
                        collection: t,
                        manager: this.manager
                    }, this.ref = {
                        node: i
                    }, this.manager.add(t, this.ref)
                },
                removeDraggable: function(t) {
                    this.manager.remove(t, this.ref)
                }
            }
        },
        i = function(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        },
        n = function() {
            function t(t, e) {
                for (var i = 0; i < e.length; i++) {
                    var n = e[i];
                    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                }
            }
            return function(e, i, n) {
                return i && t(e.prototype, i), n && t(e, n), e
            }
        }(),
        s = function() {
            return function(t, e) {
                if (Array.isArray(t)) return t;
                if (Symbol.iterator in Object(t)) return function(t, e) {
                    var i = [],
                        n = !0,
                        s = !1,
                        r = void 0;
                    try {
                        for (var o, a = t[Symbol.iterator](); !(n = (o = a.next()).done) && (i.push(o.value), !e || i.length !== e); n = !0);
                    } catch (t) {
                        s = !0, r = t
                    } finally {
                        try {
                            !n && a.return && a.return()
                        } finally {
                            if (s) throw r
                        }
                    }
                    return i
                }(t, e);
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }
        }(),
        r = function(t) {
            if (Array.isArray(t)) {
                for (var e = 0, i = Array(t.length); e < t.length; e++) i[e] = t[e];
                return i
            }
            return Array.from(t)
        },
        o = function() {
            function t() {
                i(this, t), this.refs = {}
            }
            return n(t, [{
                key: "add",
                value: function(t, e) {
                    this.refs[t] || (this.refs[t] = []), this.refs[t].push(e)
                }
            }, {
                key: "remove",
                value: function(t, e) {
                    var i = this.getIndex(t, e); - 1 !== i && this.refs[t].splice(i, 1)
                }
            }, {
                key: "isActive",
                value: function() {
                    return this.active
                }
            }, {
                key: "getActive",
                value: function() {
                    var t = this;
                    return this.refs[this.active.collection].find(function(e) {
                        return e.node.sortableInfo.index == t.active.index
                    })
                }
            }, {
                key: "getIndex",
                value: function(t, e) {
                    return this.refs[t].indexOf(e)
                }
            }, {
                key: "getOrderedRefs",
                value: function() {
                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.active.collection;
                    return this.refs[t].sort(function(t, e) {
                        return t.node.sortableInfo.index - e.node.sortableInfo.index
                    })
                }
            }]), t
        }();

    function a(t, e, i) {
        var n = t.slice(0);
        if (i >= n.length)
            for (var s = i - n.length; 1 + s--;) n.push(void 0);
        return n.splice(i, 0, n.splice(e, 1)[0]), n
    }
    var h = {
            start: ["touchstart", "mousedown"],
            move: ["touchmove", "mousemove"],
            end: ["touchend", "touchcancel", "mouseup"]
        },
        l = function() {
            if ("undefined" == typeof window || "undefined" == typeof document) return "";
            var t = window.getComputedStyle(document.documentElement, "") || ["-moz-hidden-iframe"],
                e = (Array.prototype.slice.call(t).join("").match(/-(moz|webkit|ms)-/) || "" === t.OLink && ["", "o"])[1];
            switch (e) {
                case "ms":
                    return "ms";
                default:
                    return e && e.length ? e[0].toUpperCase() + e.substr(1) : ""
            }
        }();

    function f(t, e) {
        for (; t;) {
            if (e(t)) return t;
            t = t.parentNode
        }
    }

    function d(t, e, i) {
        return i < t ? t : i > e ? e : i
    }

    function c(t) {
        return "px" === t.substr(-2) ? parseFloat(t) : 0
    }
    var u = {
            data: function() {
                return {
                    sorting: !1,
                    sortingIndex: null,
                    manager: new o,
                    events: {
                        start: this.handleStart,
                        move: this.handleMove,
                        end: this.handleEnd
                    }
                }
            },
            props: {
                value: {
                    type: Array,
                    required: !0
                },
                axis: {
                    type: String,
                    default: "y"
                },
                distance: {
                    type: Number,
                    default: 0
                },
                pressDelay: {
                    type: Number,
                    default: 0
                },
                pressThreshold: {
                    type: Number,
                    default: 5
                },
                useDragHandle: {
                    type: Boolean,
                    default: !1
                },
                useWindowAsScrollContainer: {
                    type: Boolean,
                    default: !1
                },
                hideSortableGhost: {
                    type: Boolean,
                    default: !0
                },
                lockToContainerEdges: {
                    type: Boolean,
                    default: !1
                },
                lockOffset: {
                    type: [String, Number, Array],
                    default: "50%"
                },
                transitionDuration: {
                    type: Number,
                    default: 300
                },
                scrollContainer: {
	                type: Object,
	                default: null
                },
                lockAxis: String,
                helperClass: String,
                contentWindow: Object,
                shouldCancelStart: {
                    type: Function,
                    default: function(t) {
                        return -1 !== ["input", "textarea", "select", "option", "button"].indexOf(t.target.tagName.toLowerCase())
                    }
                },
                getHelperDimensions: {
                    type: Function,
                    default: function(t) {
                        var e = t.node;
                        return {
                            width: e.offsetWidth,
                            height: e.offsetHeight
                        }
                    }
                }
            },
            provide: function() {
                return {
                    manager: this.manager
                }
            },
            mounted: function() {
                var t = this;
                this.container = this.$el, this.document = this.container.ownerDocument || document, this._window = this.contentWindow || window;

                if (!this.scrollContainer) {
	                this.scrollContainer = this.useWindowAsScrollContainer ? (document.scrollingElement || document.documentElement) : this.container;
                }
                var e = function(e) {
                    t.events.hasOwnProperty(e) && h[e].forEach(function(i) {
                        return t.container.addEventListener(i, t.events[e], !1)
                    })
                };
                for (var i in this.events) e(i)
            },
            beforeDestroy: function() {
                var t = this,
                    e = function(e) {
                        t.events.hasOwnProperty(e) && h[e].forEach(function(i) {
                            return t.container.removeEventListener(i, t.events[e])
                        })
                    };
                for (var i in this.events) e(i)
            },
            methods: {
                handleStart: function(t) {
                    var e = this,
                        i = this.$props,
                        n = i.distance,
                        s = i.shouldCancelStart;
                    if (2 === t.button || s(t)) return !1;
                    this._touched = !0, this._pos = {
                        x: t.pageX,
                        y: t.pageY
                    };
                    var r = f(t.target, function(t) {
                        return null != t.sortableInfo
                    });
                    if (r && r.sortableInfo && this.nodeIsChild(r) && !this.sorting) {
                        var o = this.$props.useDragHandle,
                            a = r.sortableInfo,
                            h = a.index,
                            l = a.collection;
                        if (o && !f(t.target, function(t) {
                                return null != t.sortableHandle
                            })) return;
                        this.manager.active = {
                            index: h,
                            collection: l
                        }, "a" === t.target.tagName.toLowerCase() && t.preventDefault(), n || (0 === this.$props.pressDelay ? this.handlePress(t) : this.pressTimer = setTimeout(function() {
                            return e.handlePress(t)
                        }, this.$props.pressDelay))
                    }
                },
                nodeIsChild: function(t) {
                    return t.sortableInfo.manager === this.manager
                },
                handleMove: function(t) {
                    var e = this.$props,
                        i = e.distance,
                        n = e.pressThreshold;
                    if (!this.sorting && this._touched) {
                        this._delta = {
                            x: this._pos.x - t.pageX,
                            y: this._pos.y - t.pageY
                        };
                        var s = Math.abs(this._delta.x) + Math.abs(this._delta.y);
                        i || n && !(n && s >= n) ? i && s >= i && this.manager.isActive() && this.handlePress(t) : (clearTimeout(this.cancelTimer), this.cancelTimer = setTimeout(this.cancel, 0))
                    }
                },
                handleEnd: function() {
                    var t = this.$props.distance;
                    this._touched = !1, t || this.cancel()
                },
                cancel: function() {
                    this.sorting || (clearTimeout(this.pressTimer), this.manager.active = null)
                },
                handlePress: function(t) {
                    var e, i, n = this,
                        s = this.manager.getActive();
                    if (s) {
                        var o = this.$props,
                            a = o.axis,
                            l = o.getHelperDimensions,
                            f = o.helperClass,
                            d = o.hideSortableGhost,
                            u = o.useWindowAsScrollContainer,
                            g = s.node,
                            p = s.collection,
                            x = g.sortableInfo.index,
                            y = (e = g, {
                                top: c((i = window.getComputedStyle(e)).marginTop),
                                right: c(i.marginRight),
                                bottom: c(i.marginBottom),
                                left: c(i.marginLeft)
                            }),
                            m = this.container.getBoundingClientRect(),
                            v = l({
                                index: x,
                                node: g,
                                collection: p
                            });
                        this.node = g, this.margin = y, this.width = v.width, this.height = v.height, this.marginOffset = {
                            x: this.margin.left + this.margin.right,
                            y: Math.max(this.margin.top, this.margin.bottom)
                        }, this.boundingClientRect = g.getBoundingClientRect(), this.containerBoundingRect = m, this.index = x, this.newIndex = x, this._axis = {
                            x: a.indexOf("x") >= 0,
                            y: a.indexOf("y") >= 0
                        }, this.offsetEdge = this.getEdgeOffset(g), this.initialOffset = this.getOffset(t), this.initialScroll = {
                            top: this.scrollContainer.scrollTop,
                            left: this.scrollContainer.scrollLeft
                        }, this.initialWindowScroll = {
                            top: window.pageYOffset,
                            left: window.pageXOffset
                        };
                        var w, b = g.querySelectorAll("input, textarea, select"),
                            O = g.cloneNode(!0);
                        if ([].concat(r(O.querySelectorAll("input, textarea, select"))).forEach(function(t, e) {
                                "file" !== t.type && b[e] && (t.value = b[e].value)
                            }), this.helper = this.document.body.appendChild(O), this.helper.style.position = "fixed", this.helper.style.top = this.boundingClientRect.top - y.top + "px", this.helper.style.left = this.boundingClientRect.left - y.left + "px", this.helper.style.width = this.width + "px", this.helper.style.height = this.height + "px", this.helper.style.boxSizing = "border-box", this.helper.style.zIndex = 1090, this.helper.style.pointerEvents = "none", d && (this.sortableGhost = g, g.style.visibility = "hidden", g.style.opacity = 0), this.minTranslate = {}, this.maxTranslate = {}, 
                            
                            this._axis.x && (this.minTranslate.x = (u ? 0 : m.left) - this.boundingClientRect.left - this.width / 2, 
                            this.maxTranslate.x = (u ? window.innerWidth : m.left + m.width) - this.boundingClientRect.left - this.width / 2), 
                            
                            this._axis.y && (this.minTranslate.y = (u ? 0 : m.top) - this.boundingClientRect.top - this.height / 2, 
                            this.maxTranslate.y = (u ? window.innerHeight : m.top + m.height) - this.boundingClientRect.top - this.height / 2), 
                            
                            f)(w = this.helper.classList).add.apply(w, r(f.split(" ")));
                            
                        this.listenerNode = t.touches ? g : this._window, h.move.forEach(function(t) {
                            return n.listenerNode.addEventListener(t, n.handleSortMove, !1)
                        }), h.end.forEach(function(t) {
                            return n.listenerNode.addEventListener(t, n.handleSortEnd, !1)
                        }), this.sorting = !0, this.sortingIndex = x, this.$emit("sortStart", {
                            event: t,
                            node: g,
                            index: x,
                            collection: p
                        })
                    }
                },
                handleSortMove: function(t) {
					$mx('html').addClass('is-dragging');
                    t.preventDefault(), this.updatePosition(t), this.animateNodes(), this.autoscroll(), this.$emit("sortMove", {
                        event: t
                    })
                },
                handleSortEnd: function(t) {
					$mx('html').removeClass('is-dragging');
                    var e = this,
                        i = this.manager.active.collection;
                    this.listenerNode && (h.move.forEach(function(t) {
                        return e.listenerNode.removeEventListener(t, e.handleSortMove)
                    }), h.end.forEach(function(t) {
                        return e.listenerNode.removeEventListener(t, e.handleSortEnd)
                    })), this.helper.parentNode.removeChild(this.helper), this.hideSortableGhost && this.sortableGhost && (this.sortableGhost.style.visibility = "", this.sortableGhost.style.opacity = "");
                    for (var n = this.manager.refs[i], s = 0, r = n.length; s < r; s++) {
                        var o = n[s],
                            f = o.node;
                        o.edgeOffset = null, f.style[l + "Transform"] = "", f.style[l + "TransitionDuration"] = ""
                    }
                    clearInterval(this.autoscrollInterval), this.autoscrollInterval = null, this.manager.active = null, this.sorting = !1, this.sortingIndex = null, this.$emit("sortEnd", {
                        event: t,
                        oldIndex: this.index,
                        newIndex: this.newIndex,
                        collection: i
                    }), this.$emit("input", a(this.value, this.index, this.newIndex)), this._touched = !1
                },
                getEdgeOffset: function(t) {
	                
	                var top = 0,
				    left = 0;
				    var elem = t;
				
					  while (elem && elem !== this.container) {
					    top = top + parseInt(elem.offsetTop);
					    left = left + parseInt(elem.offsetLeft);
					    elem = elem.offsetParent;
					  }
// 					  console.log('REAL: ', top);
					  return {top: top, left: left}
	                
/*
                    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
                        top: 0,
                        left: 0
                    };
                    if (t) {
                        var i = {
                            top: e.top + t.offsetTop,
                            left: e.left + t.offsetLeft
                        };
                        console.log('1: ', t);
                        console.log('2: ', t.offsetTop);
	                    console.log('3: ', $mx(t).attr('title')+': '+ 'e: '+i.top);
                                                
                        return t.parentNode !== this.container ? this.getEdgeOffset(t.parentNode, i) : i
                    }
*/
                },
                getOffset: function(t) {
                    return {
                        x: t.touches ? t.touches[0].pageX : t.pageX,
                        y: t.touches ? t.touches[0].pageY : t.pageY
                    }
                },
                getLockPixelOffsets: function() {
                    var t = this.$props.lockOffset;
                    if (Array.isArray(this.lockOffset) || (t = [t, t]), 2 !== t.length) throw new Error("lockOffset prop of SortableContainer should be a single value or an array of exactly two values. Given " + t);
                    var e = s(t, 2),
                        i = e[0],
                        n = e[1];
                    return [this.getLockPixelOffset(i), this.getLockPixelOffset(n)]
                },
                getLockPixelOffset: function(t) {
                    var e = t,
                        i = t,
                        n = "px";
                    if ("string" == typeof t) {
                        var s = /^[+-]?\d*(?:\.\d*)?(px|%)$/.exec(t);
                        if (null === s) throw new Error('lockOffset value should be a number or a string of a number followed by "px" or "%". Given ' + t);
                        e = i = parseFloat(t), n = s[1]
                    }
                    if (!isFinite(e) || !isFinite(i)) throw new Error("lockOffset value should be a finite. Given " + t);
                    return "%" === n && (e = e * this.width / 100, i = i * this.height / 100), {
                        x: e,
                        y: i
                    }
                },
                updatePosition: function(t) {
                    var e = this.$props,
                        i = e.lockAxis,
                        n = e.lockToContainerEdges,
                        r = this.getOffset(t),
                        o = {
                            x: r.x - this.initialOffset.x,
                            y: r.y - this.initialOffset.y
                        };
                    if (o.y -= window.pageYOffset - this.initialWindowScroll.top, o.x -= window.pageXOffset - this.initialWindowScroll.left, this.translate = o, n) {
                        var a = this.getLockPixelOffsets(),
                            h = s(a, 2),
                            f = h[0],
                            c = h[1],
                            u = this.width / 2 - f.x,
                            g = this.height / 2 - f.y,
                            p = this.width / 2 - c.x,
                            x = this.height / 2 - c.y;
                        o.x = d(this.minTranslate.x + u, this.maxTranslate.x - p, o.x), o.y = d(this.minTranslate.y + g, this.maxTranslate.y - x, o.y)
                    }
                    "x" === i ? o.y = 0 : "y" === i && (o.x = 0), this.helper.style[l + "Transform"] = "translate3d(" + o.x + "px," + o.y + "px, 0)"
                },
                animateNodes: function() {
                    var t = this.$props,
                        e = t.transitionDuration,
                        i = t.hideSortableGhost,
                        n = this.manager.getOrderedRefs(),
                        s = this.scrollContainer.scrollLeft - this.initialScroll.left,
                        r = this.scrollContainer.scrollTop - this.initialScroll.top,
                        o = this.offsetEdge.left + this.translate.x + (t.useWindowAsScrollContainer?0:s),
                        a = this.offsetEdge.top + this.translate.y + (t.useWindowAsScrollContainer?(window.matchMedia("(max-width: 767px)").matches?r:0):r), //hack: r:r <-- Хак для нашей системы, когда .main-block на всю ширину это работает
                        h = window.pageYOffset - this.initialWindowScroll.top,
                        f = window.pageXOffset - this.initialWindowScroll.left;
                        
//                         console.log('y: '+a+ ': '+this.offsetEdge.top);
                    this.newIndex = null;
                    for (var d = 0, c = n.length; d < c; d++) {
                        var u = n[d].node,
                            g = u.sortableInfo.index,
                            p = u.offsetWidth,
                            x = u.offsetHeight,
                            y = this.width > p ? p / 2 : this.width / 2,
                            m = this.height > x ? x / 2 : this.height / 2,
                            v = {
                                x: 0,
                                y: 0
                            },
                            w = n[d].edgeOffset;
                        w || (n[d].edgeOffset = w = this.getEdgeOffset(u));
//                         console.log(d, ': ', w);
                        var b = d < n.length - 1 && n[d + 1],
                            O = d > 0 && n[d - 1];
                        b && !b.edgeOffset && (b.edgeOffset = this.getEdgeOffset(b.node)), g !== this.index ? (e && (u.style[l + "TransitionDuration"] = e + "ms"), this._axis.x ? this._axis.y ? g < this.index && (o + f - y <= w.left && a + h <= w.top + m || a + h + m <= w.top) ? (v.x = this.width + this.marginOffset.x, w.left + v.x > this.containerBoundingRect.width - y && (v.x = b.edgeOffset.left - w.left, v.y = b.edgeOffset.top - w.top), null === this.newIndex && (this.newIndex = g)) : g > this.index && (o + f + y >= w.left && a + h + m >= w.top || a + h + m >= w.top + x) && (v.x = -(this.width + this.marginOffset.x), w.left + v.x < this.containerBoundingRect.left + y && (v.x = O.edgeOffset.left - w.left, v.y = O.edgeOffset.top - w.top), this.newIndex = g) : g > this.index && o + f + y >= w.left ? (v.x = -(this.width + this.marginOffset.x), this.newIndex = g) : g < this.index && o + f <= w.left + y && (v.x = this.width + this.marginOffset.x, null == this.newIndex && (this.newIndex = g)) : this._axis.y && (g > this.index && a + h + m >= w.top ? (v.y = -(this.height + this.marginOffset.y), this.newIndex = g) : g < this.index && a + h <= w.top + m && (v.y = this.height + this.marginOffset.y, null == this.newIndex && (this.newIndex = g))), u.style[l + "Transform"] = "translate3d(" + v.x + "px," + v.y + "px,0)") : i && (this.sortableGhost = u, u.style.visibility = "hidden", u.style.opacity = 0)
                    }
                    null == this.newIndex && (this.newIndex = this.index)
                },
                autoscroll: function() {
                    var t = this,
                        e = this.translate,
                        i = {
                            x: 0,
                            y: 0
                        },
                        n = {
                            x: 1,
                            y: 1
                        },
                        s = 10,
                        r = 10;
                        

                    e.y >= this.maxTranslate.y - this.height / 2 ? (i.y = 1, n.y = r * Math.abs((this.maxTranslate.y - this.height / 2 - e.y) / this.height)) : e.x >= this.maxTranslate.x - this.width / 2 ? (i.x = 1, n.x = s * Math.abs((this.maxTranslate.x - this.width / 2 - e.x) / this.width)) : e.y <= this.minTranslate.y + this.height / 2 ? (i.y = -1, n.y = r * Math.abs((e.y - this.height / 2 - this.minTranslate.y) / this.height)) : e.x <= this.minTranslate.x + this.width / 2 && (i.x = -1, n.x = s * Math.abs((e.x - this.width / 2 - this.minTranslate.x) / this.width)), this.autoscrollInterval && (clearInterval(this.autoscrollInterval), this.autoscrollInterval = null, this.isAutoScrolling = !1), 0 === i.x && 0 === i.y || (this.autoscrollInterval = setInterval(function() {
                        t.isAutoScrolling = !0;
                        var e = 1 * n.x * i.x,
                            s = 1 * n.y * i.y;
                        t.scrollContainer.scrollTop += s, t.scrollContainer.scrollLeft += e, t.translate.x += e, t.translate.y += s, t.animateNodes()
//                         console.log(t.scrollContainer.scrollTop);
                    }, 5))
                }
            }
        },
        g = {
            name: "slick-list",
            mixins: [u],
            render: function(t) {
                return t("div", this.$slots.default)
            }
        },
        p = {
            name: "slick-item",
            mixins: [e],
            render: function(t) {
                return t("div", this.$slots.default)
            }
        };
    t.ElementMixin = e, t.ContainerMixin = u, t.HandleDirective = {
        bind: function(t) {
            t.sortableHandle = !0
        }
    }, t.SlickList = g, t.SlickItem = p, t.arrayMove = a, Object.defineProperty(t, "__esModule", {
        value: !0
    })
});
/*!
 * Socket.IO v2.1.1
 * (c) 2014-2018 Guillermo Rauch
 * Released under the MIT License.
 */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.io=e():t.io=e()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return t[r].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict";function r(t,e){"object"===("undefined"==typeof t?"undefined":o(t))&&(e=t,t=void 0),e=e||{};var n,r=i(t),s=r.source,p=r.id,h=r.path,f=u[p]&&h in u[p].nsps,l=e.forceNew||e["force new connection"]||!1===e.multiplex||f;return l?(c("ignoring socket cache for %s",s),n=a(s,e)):(u[p]||(c("new io instance for %s",s),u[p]=a(s,e)),n=u[p]),r.query&&!e.query&&(e.query=r.query),n.socket(r.path,e)}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=n(1),s=n(7),a=n(12),c=n(3)("socket.io-client");t.exports=e=r;var u=e.managers={};e.protocol=s.protocol,e.connect=r,e.Manager=n(12),e.Socket=n(37)},function(t,e,n){(function(e){"use strict";function r(t,n){var r=t;n=n||e.location,null==t&&(t=n.protocol+"//"+n.host),"string"==typeof t&&("/"===t.charAt(0)&&(t="/"===t.charAt(1)?n.protocol+t:n.host+t),/^(https?|wss?):\/\//.test(t)||(i("protocol-less url %s",t),t="undefined"!=typeof n?n.protocol+"//"+t:"https://"+t),i("parse %s",t),r=o(t)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";var s=r.host.indexOf(":")!==-1,a=s?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+a+":"+r.port,r.href=r.protocol+"://"+a+(n&&n.port===r.port?"":":"+r.port),r}var o=n(2),i=n(3)("socket.io-client:url");t.exports=r}).call(e,function(){return this}())},function(t,e){var n=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,r=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];t.exports=function(t){var e=t,o=t.indexOf("["),i=t.indexOf("]");o!=-1&&i!=-1&&(t=t.substring(0,o)+t.substring(o,i).replace(/:/g,";")+t.substring(i,t.length));for(var s=n.exec(t||""),a={},c=14;c--;)a[r[c]]=s[c]||"";return o!=-1&&i!=-1&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,":"),a.authority=a.authority.replace("[","").replace("]","").replace(/;/g,":"),a.ipv6uri=!0),a}},function(t,e,n){(function(r){function o(){return!("undefined"==typeof window||!window.process||"renderer"!==window.process.type)||("undefined"==typeof navigator||!navigator.userAgent||!navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))&&("undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))}function i(t){var n=this.useColors;if(t[0]=(n?"%c":"")+this.namespace+(n?" %c":" ")+t[0]+(n?"%c ":" ")+"+"+e.humanize(this.diff),n){var r="color: "+this.color;t.splice(1,0,r,"color: inherit");var o=0,i=0;t[0].replace(/%[a-zA-Z%]/g,function(t){"%%"!==t&&(o++,"%c"===t&&(i=o))}),t.splice(i,0,r)}}function s(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function a(t){try{null==t?e.storage.removeItem("debug"):e.storage.debug=t}catch(n){}}function c(){var t;try{t=e.storage.debug}catch(n){}return!t&&"undefined"!=typeof r&&"env"in r&&(t=r.env.DEBUG),t}function u(){try{return window.localStorage}catch(t){}}e=t.exports=n(5),e.log=s,e.formatArgs=i,e.save=a,e.load=c,e.useColors=o,e.storage="undefined"!=typeof chrome&&"undefined"!=typeof chrome.storage?chrome.storage.local:u(),e.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"],e.formatters.j=function(t){try{return JSON.stringify(t)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}},e.enable(c())}).call(e,n(4))},function(t,e){function n(){throw new Error("setTimeout has not been defined")}function r(){throw new Error("clearTimeout has not been defined")}function o(t){if(p===setTimeout)return setTimeout(t,0);if((p===n||!p)&&setTimeout)return p=setTimeout,setTimeout(t,0);try{return p(t,0)}catch(e){try{return p.call(null,t,0)}catch(e){return p.call(this,t,0)}}}function i(t){if(h===clearTimeout)return clearTimeout(t);if((h===r||!h)&&clearTimeout)return h=clearTimeout,clearTimeout(t);try{return h(t)}catch(e){try{return h.call(null,t)}catch(e){return h.call(this,t)}}}function s(){y&&l&&(y=!1,l.length?d=l.concat(d):m=-1,d.length&&a())}function a(){if(!y){var t=o(s);y=!0;for(var e=d.length;e;){for(l=d,d=[];++m<e;)l&&l[m].run();m=-1,e=d.length}l=null,y=!1,i(t)}}function c(t,e){this.fun=t,this.array=e}function u(){}var p,h,f=t.exports={};!function(){try{p="function"==typeof setTimeout?setTimeout:n}catch(t){p=n}try{h="function"==typeof clearTimeout?clearTimeout:r}catch(t){h=r}}();var l,d=[],y=!1,m=-1;f.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];d.push(new c(t,e)),1!==d.length||y||o(a)},c.prototype.run=function(){this.fun.apply(null,this.array)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=u,f.addListener=u,f.once=u,f.off=u,f.removeListener=u,f.removeAllListeners=u,f.emit=u,f.prependListener=u,f.prependOnceListener=u,f.listeners=function(t){return[]},f.binding=function(t){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(t){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},function(t,e,n){function r(t){var n,r=0;for(n in t)r=(r<<5)-r+t.charCodeAt(n),r|=0;return e.colors[Math.abs(r)%e.colors.length]}function o(t){function n(){if(n.enabled){var t=n,r=+new Date,i=r-(o||r);t.diff=i,t.prev=o,t.curr=r,o=r;for(var s=new Array(arguments.length),a=0;a<s.length;a++)s[a]=arguments[a];s[0]=e.coerce(s[0]),"string"!=typeof s[0]&&s.unshift("%O");var c=0;s[0]=s[0].replace(/%([a-zA-Z%])/g,function(n,r){if("%%"===n)return n;c++;var o=e.formatters[r];if("function"==typeof o){var i=s[c];n=o.call(t,i),s.splice(c,1),c--}return n}),e.formatArgs.call(t,s);var u=n.log||e.log||console.log.bind(console);u.apply(t,s)}}var o;return n.namespace=t,n.enabled=e.enabled(t),n.useColors=e.useColors(),n.color=r(t),n.destroy=i,"function"==typeof e.init&&e.init(n),e.instances.push(n),n}function i(){var t=e.instances.indexOf(this);return t!==-1&&(e.instances.splice(t,1),!0)}function s(t){e.save(t),e.names=[],e.skips=[];var n,r=("string"==typeof t?t:"").split(/[\s,]+/),o=r.length;for(n=0;n<o;n++)r[n]&&(t=r[n].replace(/\*/g,".*?"),"-"===t[0]?e.skips.push(new RegExp("^"+t.substr(1)+"$")):e.names.push(new RegExp("^"+t+"$")));for(n=0;n<e.instances.length;n++){var i=e.instances[n];i.enabled=e.enabled(i.namespace)}}function a(){e.enable("")}function c(t){if("*"===t[t.length-1])return!0;var n,r;for(n=0,r=e.skips.length;n<r;n++)if(e.skips[n].test(t))return!1;for(n=0,r=e.names.length;n<r;n++)if(e.names[n].test(t))return!0;return!1}function u(t){return t instanceof Error?t.stack||t.message:t}e=t.exports=o.debug=o["default"]=o,e.coerce=u,e.disable=a,e.enable=s,e.enabled=c,e.humanize=n(6),e.instances=[],e.names=[],e.skips=[],e.formatters={}},function(t,e){function n(t){if(t=String(t),!(t.length>100)){var e=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);if(e){var n=parseFloat(e[1]),r=(e[2]||"ms").toLowerCase();switch(r){case"years":case"year":case"yrs":case"yr":case"y":return n*p;case"days":case"day":case"d":return n*u;case"hours":case"hour":case"hrs":case"hr":case"h":return n*c;case"minutes":case"minute":case"mins":case"min":case"m":return n*a;case"seconds":case"second":case"secs":case"sec":case"s":return n*s;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return n;default:return}}}}function r(t){return t>=u?Math.round(t/u)+"d":t>=c?Math.round(t/c)+"h":t>=a?Math.round(t/a)+"m":t>=s?Math.round(t/s)+"s":t+"ms"}function o(t){return i(t,u,"day")||i(t,c,"hour")||i(t,a,"minute")||i(t,s,"second")||t+" ms"}function i(t,e,n){if(!(t<e))return t<1.5*e?Math.floor(t/e)+" "+n:Math.ceil(t/e)+" "+n+"s"}var s=1e3,a=60*s,c=60*a,u=24*c,p=365.25*u;t.exports=function(t,e){e=e||{};var i=typeof t;if("string"===i&&t.length>0)return n(t);if("number"===i&&isNaN(t)===!1)return e["long"]?o(t):r(t);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(t))}},function(t,e,n){function r(){}function o(t){var n=""+t.type;if(e.BINARY_EVENT!==t.type&&e.BINARY_ACK!==t.type||(n+=t.attachments+"-"),t.nsp&&"/"!==t.nsp&&(n+=t.nsp+","),null!=t.id&&(n+=t.id),null!=t.data){var r=i(t.data);if(r===!1)return g;n+=r}return f("encoded %j as %s",t,n),n}function i(t){try{return JSON.stringify(t)}catch(e){return!1}}function s(t,e){function n(t){var n=d.deconstructPacket(t),r=o(n.packet),i=n.buffers;i.unshift(r),e(i)}d.removeBlobs(t,n)}function a(){this.reconstructor=null}function c(t){var n=0,r={type:Number(t.charAt(0))};if(null==e.types[r.type])return h("unknown packet type "+r.type);if(e.BINARY_EVENT===r.type||e.BINARY_ACK===r.type){for(var o="";"-"!==t.charAt(++n)&&(o+=t.charAt(n),n!=t.length););if(o!=Number(o)||"-"!==t.charAt(n))throw new Error("Illegal attachments");r.attachments=Number(o)}if("/"===t.charAt(n+1))for(r.nsp="";++n;){var i=t.charAt(n);if(","===i)break;if(r.nsp+=i,n===t.length)break}else r.nsp="/";var s=t.charAt(n+1);if(""!==s&&Number(s)==s){for(r.id="";++n;){var i=t.charAt(n);if(null==i||Number(i)!=i){--n;break}if(r.id+=t.charAt(n),n===t.length)break}r.id=Number(r.id)}if(t.charAt(++n)){var a=u(t.substr(n)),c=a!==!1&&(r.type===e.ERROR||y(a));if(!c)return h("invalid payload");r.data=a}return f("decoded %s as %j",t,r),r}function u(t){try{return JSON.parse(t)}catch(e){return!1}}function p(t){this.reconPack=t,this.buffers=[]}function h(t){return{type:e.ERROR,data:"parser error: "+t}}var f=n(3)("socket.io-parser"),l=n(8),d=n(9),y=n(10),m=n(11);e.protocol=4,e.types=["CONNECT","DISCONNECT","EVENT","ACK","ERROR","BINARY_EVENT","BINARY_ACK"],e.CONNECT=0,e.DISCONNECT=1,e.EVENT=2,e.ACK=3,e.ERROR=4,e.BINARY_EVENT=5,e.BINARY_ACK=6,e.Encoder=r,e.Decoder=a;var g=e.ERROR+'"encode error"';r.prototype.encode=function(t,n){if(f("encoding packet %j",t),e.BINARY_EVENT===t.type||e.BINARY_ACK===t.type)s(t,n);else{var r=o(t);n([r])}},l(a.prototype),a.prototype.add=function(t){var n;if("string"==typeof t)n=c(t),e.BINARY_EVENT===n.type||e.BINARY_ACK===n.type?(this.reconstructor=new p(n),0===this.reconstructor.reconPack.attachments&&this.emit("decoded",n)):this.emit("decoded",n);else{if(!m(t)&&!t.base64)throw new Error("Unknown type: "+t);if(!this.reconstructor)throw new Error("got binary data when not reconstructing a packet");n=this.reconstructor.takeBinaryData(t),n&&(this.reconstructor=null,this.emit("decoded",n))}},a.prototype.destroy=function(){this.reconstructor&&this.reconstructor.finishedReconstruction()},p.prototype.takeBinaryData=function(t){if(this.buffers.push(t),this.buffers.length===this.reconPack.attachments){var e=d.reconstructPacket(this.reconPack,this.buffers);return this.finishedReconstruction(),e}return null},p.prototype.finishedReconstruction=function(){this.reconPack=null,this.buffers=[]}},function(t,e,n){function r(t){if(t)return o(t)}function o(t){for(var e in r.prototype)t[e]=r.prototype[e];return t}t.exports=r,r.prototype.on=r.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},r.prototype.once=function(t,e){function n(){this.off(t,n),e.apply(this,arguments)}return n.fn=e,this.on(t,n),this},r.prototype.off=r.prototype.removeListener=r.prototype.removeAllListeners=r.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var n=this._callbacks["$"+t];if(!n)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var r,o=0;o<n.length;o++)if(r=n[o],r===e||r.fn===e){n.splice(o,1);break}return this},r.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),n=this._callbacks["$"+t];if(n){n=n.slice(0);for(var r=0,o=n.length;r<o;++r)n[r].apply(this,e)}return this},r.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},r.prototype.hasListeners=function(t){return!!this.listeners(t).length}},function(t,e,n){(function(t){function r(t,e){if(!t)return t;if(s(t)){var n={_placeholder:!0,num:e.length};return e.push(t),n}if(i(t)){for(var o=new Array(t.length),a=0;a<t.length;a++)o[a]=r(t[a],e);return o}if("object"==typeof t&&!(t instanceof Date)){var o={};for(var c in t)o[c]=r(t[c],e);return o}return t}function o(t,e){if(!t)return t;if(t&&t._placeholder)return e[t.num];if(i(t))for(var n=0;n<t.length;n++)t[n]=o(t[n],e);else if("object"==typeof t)for(var r in t)t[r]=o(t[r],e);return t}var i=n(10),s=n(11),a=Object.prototype.toString,c="function"==typeof t.Blob||"[object BlobConstructor]"===a.call(t.Blob),u="function"==typeof t.File||"[object FileConstructor]"===a.call(t.File);e.deconstructPacket=function(t){var e=[],n=t.data,o=t;return o.data=r(n,e),o.attachments=e.length,{packet:o,buffers:e}},e.reconstructPacket=function(t,e){return t.data=o(t.data,e),t.attachments=void 0,t},e.removeBlobs=function(t,e){function n(t,a,p){if(!t)return t;if(c&&t instanceof Blob||u&&t instanceof File){r++;var h=new FileReader;h.onload=function(){p?p[a]=this.result:o=this.result,--r||e(o)},h.readAsArrayBuffer(t)}else if(i(t))for(var f=0;f<t.length;f++)n(t[f],f,t);else if("object"==typeof t&&!s(t))for(var l in t)n(t[l],l,t)}var r=0,o=t;n(o),r||e(o)}}).call(e,function(){return this}())},function(t,e){var n={}.toString;t.exports=Array.isArray||function(t){return"[object Array]"==n.call(t)}},function(t,e){(function(e){function n(t){return r&&e.Buffer.isBuffer(t)||o&&(t instanceof e.ArrayBuffer||i(t))}t.exports=n;var r="function"==typeof e.Buffer&&"function"==typeof e.Buffer.isBuffer,o="function"==typeof e.ArrayBuffer,i=function(){return o&&"function"==typeof e.ArrayBuffer.isView?e.ArrayBuffer.isView:function(t){return t.buffer instanceof e.ArrayBuffer}}()}).call(e,function(){return this}())},function(t,e,n){"use strict";function r(t,e){if(!(this instanceof r))return new r(t,e);t&&"object"===("undefined"==typeof t?"undefined":o(t))&&(e=t,t=void 0),e=e||{},e.path=e.path||"/socket.io",this.nsps={},this.subs=[],this.opts=e,this.reconnection(e.reconnection!==!1),this.reconnectionAttempts(e.reconnectionAttempts||1/0),this.reconnectionDelay(e.reconnectionDelay||1e3),this.reconnectionDelayMax(e.reconnectionDelayMax||5e3),this.randomizationFactor(e.randomizationFactor||.5),this.backoff=new l({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(null==e.timeout?2e4:e.timeout),this.readyState="closed",this.uri=t,this.connecting=[],this.lastPing=null,this.encoding=!1,this.packetBuffer=[];var n=e.parser||c;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this.autoConnect=e.autoConnect!==!1,this.autoConnect&&this.open()}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=n(13),s=n(37),a=n(8),c=n(7),u=n(39),p=n(40),h=n(3)("socket.io-client:manager"),f=n(36),l=n(41),d=Object.prototype.hasOwnProperty;t.exports=r,r.prototype.emitAll=function(){this.emit.apply(this,arguments);for(var t in this.nsps)d.call(this.nsps,t)&&this.nsps[t].emit.apply(this.nsps[t],arguments)},r.prototype.updateSocketIds=function(){for(var t in this.nsps)d.call(this.nsps,t)&&(this.nsps[t].id=this.generateId(t))},r.prototype.generateId=function(t){return("/"===t?"":t+"#")+this.engine.id},a(r.prototype),r.prototype.reconnection=function(t){return arguments.length?(this._reconnection=!!t,this):this._reconnection},r.prototype.reconnectionAttempts=function(t){return arguments.length?(this._reconnectionAttempts=t,this):this._reconnectionAttempts},r.prototype.reconnectionDelay=function(t){return arguments.length?(this._reconnectionDelay=t,this.backoff&&this.backoff.setMin(t),this):this._reconnectionDelay},r.prototype.randomizationFactor=function(t){return arguments.length?(this._randomizationFactor=t,this.backoff&&this.backoff.setJitter(t),this):this._randomizationFactor},r.prototype.reconnectionDelayMax=function(t){return arguments.length?(this._reconnectionDelayMax=t,this.backoff&&this.backoff.setMax(t),this):this._reconnectionDelayMax},r.prototype.timeout=function(t){return arguments.length?(this._timeout=t,this):this._timeout},r.prototype.maybeReconnectOnOpen=function(){!this.reconnecting&&this._reconnection&&0===this.backoff.attempts&&this.reconnect()},r.prototype.open=r.prototype.connect=function(t,e){if(h("readyState %s",this.readyState),~this.readyState.indexOf("open"))return this;h("opening %s",this.uri),this.engine=i(this.uri,this.opts);var n=this.engine,r=this;this.readyState="opening",this.skipReconnect=!1;var o=u(n,"open",function(){r.onopen(),t&&t()}),s=u(n,"error",function(e){if(h("connect_error"),r.cleanup(),r.readyState="closed",r.emitAll("connect_error",e),t){var n=new Error("Connection error");n.data=e,t(n)}else r.maybeReconnectOnOpen()});if(!1!==this._timeout){var a=this._timeout;h("connect attempt will timeout after %d",a);var c=setTimeout(function(){h("connect attempt timed out after %d",a),o.destroy(),n.close(),n.emit("error","timeout"),r.emitAll("connect_timeout",a)},a);this.subs.push({destroy:function(){clearTimeout(c)}})}return this.subs.push(o),this.subs.push(s),this},r.prototype.onopen=function(){h("open"),this.cleanup(),this.readyState="open",this.emit("open");var t=this.engine;this.subs.push(u(t,"data",p(this,"ondata"))),this.subs.push(u(t,"ping",p(this,"onping"))),this.subs.push(u(t,"pong",p(this,"onpong"))),this.subs.push(u(t,"error",p(this,"onerror"))),this.subs.push(u(t,"close",p(this,"onclose"))),this.subs.push(u(this.decoder,"decoded",p(this,"ondecoded")))},r.prototype.onping=function(){this.lastPing=new Date,this.emitAll("ping")},r.prototype.onpong=function(){this.emitAll("pong",new Date-this.lastPing)},r.prototype.ondata=function(t){this.decoder.add(t)},r.prototype.ondecoded=function(t){this.emit("packet",t)},r.prototype.onerror=function(t){h("error",t),this.emitAll("error",t)},r.prototype.socket=function(t,e){function n(){~f(o.connecting,r)||o.connecting.push(r)}var r=this.nsps[t];if(!r){r=new s(this,t,e),this.nsps[t]=r;var o=this;r.on("connecting",n),r.on("connect",function(){r.id=o.generateId(t)}),this.autoConnect&&n()}return r},r.prototype.destroy=function(t){var e=f(this.connecting,t);~e&&this.connecting.splice(e,1),this.connecting.length||this.close()},r.prototype.packet=function(t){h("writing packet %j",t);var e=this;t.query&&0===t.type&&(t.nsp+="?"+t.query),e.encoding?e.packetBuffer.push(t):(e.encoding=!0,this.encoder.encode(t,function(n){for(var r=0;r<n.length;r++)e.engine.write(n[r],t.options);e.encoding=!1,e.processPacketQueue()}))},r.prototype.processPacketQueue=function(){if(this.packetBuffer.length>0&&!this.encoding){var t=this.packetBuffer.shift();this.packet(t)}},r.prototype.cleanup=function(){h("cleanup");for(var t=this.subs.length,e=0;e<t;e++){var n=this.subs.shift();n.destroy()}this.packetBuffer=[],this.encoding=!1,this.lastPing=null,this.decoder.destroy()},r.prototype.close=r.prototype.disconnect=function(){h("disconnect"),this.skipReconnect=!0,this.reconnecting=!1,"opening"===this.readyState&&this.cleanup(),this.backoff.reset(),this.readyState="closed",this.engine&&this.engine.close()},r.prototype.onclose=function(t){h("onclose"),this.cleanup(),this.backoff.reset(),this.readyState="closed",this.emit("close",t),this._reconnection&&!this.skipReconnect&&this.reconnect()},r.prototype.reconnect=function(){if(this.reconnecting||this.skipReconnect)return this;var t=this;if(this.backoff.attempts>=this._reconnectionAttempts)h("reconnect failed"),this.backoff.reset(),this.emitAll("reconnect_failed"),this.reconnecting=!1;else{var e=this.backoff.duration();h("will wait %dms before reconnect attempt",e),this.reconnecting=!0;var n=setTimeout(function(){t.skipReconnect||(h("attempting reconnect"),t.emitAll("reconnect_attempt",t.backoff.attempts),t.emitAll("reconnecting",t.backoff.attempts),t.skipReconnect||t.open(function(e){e?(h("reconnect attempt error"),t.reconnecting=!1,t.reconnect(),t.emitAll("reconnect_error",e.data)):(h("reconnect success"),t.onreconnect())}))},e);this.subs.push({destroy:function(){clearTimeout(n)}})}},r.prototype.onreconnect=function(){var t=this.backoff.attempts;this.reconnecting=!1,this.backoff.reset(),this.updateSocketIds(),this.emitAll("reconnect",t)}},function(t,e,n){t.exports=n(14),t.exports.parser=n(21)},function(t,e,n){(function(e){function r(t,n){if(!(this instanceof r))return new r(t,n);n=n||{},t&&"object"==typeof t&&(n=t,t=null),t?(t=p(t),n.hostname=t.host,n.secure="https"===t.protocol||"wss"===t.protocol,n.port=t.port,t.query&&(n.query=t.query)):n.host&&(n.hostname=p(n.host).host),this.secure=null!=n.secure?n.secure:e.location&&"https:"===location.protocol,n.hostname&&!n.port&&(n.port=this.secure?"443":"80"),this.agent=n.agent||!1,this.hostname=n.hostname||(e.location?location.hostname:"localhost"),this.port=n.port||(e.location&&location.port?location.port:this.secure?443:80),this.query=n.query||{},"string"==typeof this.query&&(this.query=h.decode(this.query)),this.upgrade=!1!==n.upgrade,this.path=(n.path||"/engine.io").replace(/\/$/,"")+"/",this.forceJSONP=!!n.forceJSONP,this.jsonp=!1!==n.jsonp,this.forceBase64=!!n.forceBase64,this.enablesXDR=!!n.enablesXDR,this.timestampParam=n.timestampParam||"t",this.timestampRequests=n.timestampRequests,this.transports=n.transports||["polling","websocket"],this.transportOptions=n.transportOptions||{},this.readyState="",this.writeBuffer=[],this.prevBufferLen=0,this.policyPort=n.policyPort||843,this.rememberUpgrade=n.rememberUpgrade||!1,this.binaryType=null,this.onlyBinaryUpgrades=n.onlyBinaryUpgrades,this.perMessageDeflate=!1!==n.perMessageDeflate&&(n.perMessageDeflate||{}),!0===this.perMessageDeflate&&(this.perMessageDeflate={}),this.perMessageDeflate&&null==this.perMessageDeflate.threshold&&(this.perMessageDeflate.threshold=1024),this.pfx=n.pfx||null,this.key=n.key||null,this.passphrase=n.passphrase||null,this.cert=n.cert||null,this.ca=n.ca||null,this.ciphers=n.ciphers||null,this.rejectUnauthorized=void 0===n.rejectUnauthorized||n.rejectUnauthorized,this.forceNode=!!n.forceNode;var o="object"==typeof e&&e;o.global===o&&(n.extraHeaders&&Object.keys(n.extraHeaders).length>0&&(this.extraHeaders=n.extraHeaders),n.localAddress&&(this.localAddress=n.localAddress)),this.id=null,this.upgrades=null,this.pingInterval=null,this.pingTimeout=null,this.pingIntervalTimer=null,this.pingTimeoutTimer=null,this.open()}function o(t){var e={};for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}var i=n(15),s=n(8),a=n(3)("engine.io-client:socket"),c=n(36),u=n(21),p=n(2),h=n(30);t.exports=r,r.priorWebsocketSuccess=!1,s(r.prototype),r.protocol=u.protocol,r.Socket=r,r.Transport=n(20),r.transports=n(15),r.parser=n(21),r.prototype.createTransport=function(t){a('creating transport "%s"',t);var e=o(this.query);e.EIO=u.protocol,e.transport=t;var n=this.transportOptions[t]||{};this.id&&(e.sid=this.id);var r=new i[t]({query:e,socket:this,agent:n.agent||this.agent,hostname:n.hostname||this.hostname,port:n.port||this.port,secure:n.secure||this.secure,path:n.path||this.path,forceJSONP:n.forceJSONP||this.forceJSONP,jsonp:n.jsonp||this.jsonp,forceBase64:n.forceBase64||this.forceBase64,enablesXDR:n.enablesXDR||this.enablesXDR,timestampRequests:n.timestampRequests||this.timestampRequests,timestampParam:n.timestampParam||this.timestampParam,policyPort:n.policyPort||this.policyPort,pfx:n.pfx||this.pfx,key:n.key||this.key,passphrase:n.passphrase||this.passphrase,cert:n.cert||this.cert,ca:n.ca||this.ca,ciphers:n.ciphers||this.ciphers,rejectUnauthorized:n.rejectUnauthorized||this.rejectUnauthorized,perMessageDeflate:n.perMessageDeflate||this.perMessageDeflate,extraHeaders:n.extraHeaders||this.extraHeaders,forceNode:n.forceNode||this.forceNode,localAddress:n.localAddress||this.localAddress,requestTimeout:n.requestTimeout||this.requestTimeout,protocols:n.protocols||void 0});return r},r.prototype.open=function(){var t;if(this.rememberUpgrade&&r.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1)t="websocket";else{if(0===this.transports.length){var e=this;return void setTimeout(function(){e.emit("error","No transports available")},0)}t=this.transports[0]}this.readyState="opening";try{t=this.createTransport(t)}catch(n){return this.transports.shift(),void this.open()}t.open(),this.setTransport(t)},r.prototype.setTransport=function(t){a("setting transport %s",t.name);var e=this;this.transport&&(a("clearing existing transport %s",this.transport.name),this.transport.removeAllListeners()),this.transport=t,t.on("drain",function(){e.onDrain()}).on("packet",function(t){e.onPacket(t)}).on("error",function(t){e.onError(t)}).on("close",function(){e.onClose("transport close")})},r.prototype.probe=function(t){function e(){if(f.onlyBinaryUpgrades){var e=!this.supportsBinary&&f.transport.supportsBinary;h=h||e}h||(a('probe transport "%s" opened',t),p.send([{type:"ping",data:"probe"}]),p.once("packet",function(e){if(!h)if("pong"===e.type&&"probe"===e.data){if(a('probe transport "%s" pong',t),f.upgrading=!0,f.emit("upgrading",p),!p)return;r.priorWebsocketSuccess="websocket"===p.name,a('pausing current transport "%s"',f.transport.name),f.transport.pause(function(){h||"closed"!==f.readyState&&(a("changing transport and sending upgrade packet"),u(),f.setTransport(p),p.send([{type:"upgrade"}]),f.emit("upgrade",p),p=null,f.upgrading=!1,f.flush())})}else{a('probe transport "%s" failed',t);var n=new Error("probe error");n.transport=p.name,f.emit("upgradeError",n)}}))}function n(){h||(h=!0,u(),p.close(),p=null)}function o(e){var r=new Error("probe error: "+e);r.transport=p.name,n(),a('probe transport "%s" failed because of error: %s',t,e),f.emit("upgradeError",r)}function i(){o("transport closed")}function s(){o("socket closed")}function c(t){p&&t.name!==p.name&&(a('"%s" works - aborting "%s"',t.name,p.name),n())}function u(){p.removeListener("open",e),p.removeListener("error",o),p.removeListener("close",i),f.removeListener("close",s),f.removeListener("upgrading",c)}a('probing transport "%s"',t);var p=this.createTransport(t,{probe:1}),h=!1,f=this;r.priorWebsocketSuccess=!1,p.once("open",e),p.once("error",o),p.once("close",i),this.once("close",s),this.once("upgrading",c),p.open()},r.prototype.onOpen=function(){if(a("socket open"),this.readyState="open",r.priorWebsocketSuccess="websocket"===this.transport.name,this.emit("open"),this.flush(),"open"===this.readyState&&this.upgrade&&this.transport.pause){a("starting upgrade probes");for(var t=0,e=this.upgrades.length;t<e;t++)this.probe(this.upgrades[t])}},r.prototype.onPacket=function(t){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState)switch(a('socket receive: type "%s", data "%s"',t.type,t.data),this.emit("packet",t),this.emit("heartbeat"),t.type){case"open":this.onHandshake(JSON.parse(t.data));break;case"pong":this.setPing(),this.emit("pong");break;case"error":var e=new Error("server error");e.code=t.data,this.onError(e);break;case"message":this.emit("data",t.data),this.emit("message",t.data)}else a('packet received with socket readyState "%s"',this.readyState)},r.prototype.onHandshake=function(t){this.emit("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this.upgrades=this.filterUpgrades(t.upgrades),this.pingInterval=t.pingInterval,this.pingTimeout=t.pingTimeout,this.onOpen(),"closed"!==this.readyState&&(this.setPing(),this.removeListener("heartbeat",this.onHeartbeat),this.on("heartbeat",this.onHeartbeat))},r.prototype.onHeartbeat=function(t){clearTimeout(this.pingTimeoutTimer);var e=this;e.pingTimeoutTimer=setTimeout(function(){"closed"!==e.readyState&&e.onClose("ping timeout")},t||e.pingInterval+e.pingTimeout)},r.prototype.setPing=function(){var t=this;clearTimeout(t.pingIntervalTimer),t.pingIntervalTimer=setTimeout(function(){a("writing ping packet - expecting pong within %sms",t.pingTimeout),t.ping(),t.onHeartbeat(t.pingTimeout)},t.pingInterval)},r.prototype.ping=function(){var t=this;this.sendPacket("ping",function(){t.emit("ping")})},r.prototype.onDrain=function(){this.writeBuffer.splice(0,this.prevBufferLen),this.prevBufferLen=0,0===this.writeBuffer.length?this.emit("drain"):this.flush()},r.prototype.flush=function(){"closed"!==this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length&&(a("flushing %d packets in socket",this.writeBuffer.length),this.transport.send(this.writeBuffer),this.prevBufferLen=this.writeBuffer.length,this.emit("flush"))},r.prototype.write=r.prototype.send=function(t,e,n){return this.sendPacket("message",t,e,n),this},r.prototype.sendPacket=function(t,e,n,r){if("function"==typeof e&&(r=e,e=void 0),"function"==typeof n&&(r=n,n=null),"closing"!==this.readyState&&"closed"!==this.readyState){n=n||{},n.compress=!1!==n.compress;var o={type:t,data:e,options:n};this.emit("packetCreate",o),this.writeBuffer.push(o),r&&this.once("flush",r),this.flush()}},r.prototype.close=function(){function t(){r.onClose("forced close"),a("socket closing - telling transport to close"),r.transport.close()}function e(){r.removeListener("upgrade",e),r.removeListener("upgradeError",e),t()}function n(){r.once("upgrade",e),r.once("upgradeError",e)}if("opening"===this.readyState||"open"===this.readyState){this.readyState="closing";var r=this;this.writeBuffer.length?this.once("drain",function(){this.upgrading?n():t()}):this.upgrading?n():t()}return this},r.prototype.onError=function(t){a("socket error %j",t),r.priorWebsocketSuccess=!1,this.emit("error",t),this.onClose("transport error",t)},r.prototype.onClose=function(t,e){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState){a('socket close with reason: "%s"',t);var n=this;clearTimeout(this.pingIntervalTimer),clearTimeout(this.pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),this.readyState="closed",this.id=null,this.emit("close",t,e),n.writeBuffer=[],n.prevBufferLen=0}},r.prototype.filterUpgrades=function(t){for(var e=[],n=0,r=t.length;n<r;n++)~c(this.transports,t[n])&&e.push(t[n]);return e}}).call(e,function(){return this}())},function(t,e,n){(function(t){function r(e){var n,r=!1,a=!1,c=!1!==e.jsonp;if(t.location){var u="https:"===location.protocol,p=location.port;
p||(p=u?443:80),r=e.hostname!==location.hostname||p!==e.port,a=e.secure!==u}if(e.xdomain=r,e.xscheme=a,n=new o(e),"open"in n&&!e.forceJSONP)return new i(e);if(!c)throw new Error("JSONP disabled");return new s(e)}var o=n(16),i=n(18),s=n(33),a=n(34);e.polling=r,e.websocket=a}).call(e,function(){return this}())},function(t,e,n){(function(e){var r=n(17);t.exports=function(t){var n=t.xdomain,o=t.xscheme,i=t.enablesXDR;try{if("undefined"!=typeof XMLHttpRequest&&(!n||r))return new XMLHttpRequest}catch(s){}try{if("undefined"!=typeof XDomainRequest&&!o&&i)return new XDomainRequest}catch(s){}if(!n)try{return new(e[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")}catch(s){}}}).call(e,function(){return this}())},function(t,e){try{t.exports="undefined"!=typeof XMLHttpRequest&&"withCredentials"in new XMLHttpRequest}catch(n){t.exports=!1}},function(t,e,n){(function(e){function r(){}function o(t){if(c.call(this,t),this.requestTimeout=t.requestTimeout,this.extraHeaders=t.extraHeaders,e.location){var n="https:"===location.protocol,r=location.port;r||(r=n?443:80),this.xd=t.hostname!==e.location.hostname||r!==t.port,this.xs=t.secure!==n}}function i(t){this.method=t.method||"GET",this.uri=t.uri,this.xd=!!t.xd,this.xs=!!t.xs,this.async=!1!==t.async,this.data=void 0!==t.data?t.data:null,this.agent=t.agent,this.isBinary=t.isBinary,this.supportsBinary=t.supportsBinary,this.enablesXDR=t.enablesXDR,this.requestTimeout=t.requestTimeout,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.extraHeaders=t.extraHeaders,this.create()}function s(){for(var t in i.requests)i.requests.hasOwnProperty(t)&&i.requests[t].abort()}var a=n(16),c=n(19),u=n(8),p=n(31),h=n(3)("engine.io-client:polling-xhr");t.exports=o,t.exports.Request=i,p(o,c),o.prototype.supportsBinary=!0,o.prototype.request=function(t){return t=t||{},t.uri=this.uri(),t.xd=this.xd,t.xs=this.xs,t.agent=this.agent||!1,t.supportsBinary=this.supportsBinary,t.enablesXDR=this.enablesXDR,t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized,t.requestTimeout=this.requestTimeout,t.extraHeaders=this.extraHeaders,new i(t)},o.prototype.doWrite=function(t,e){var n="string"!=typeof t&&void 0!==t,r=this.request({method:"POST",data:t,isBinary:n}),o=this;r.on("success",e),r.on("error",function(t){o.onError("xhr post error",t)}),this.sendXhr=r},o.prototype.doPoll=function(){h("xhr poll");var t=this.request(),e=this;t.on("data",function(t){e.onData(t)}),t.on("error",function(t){e.onError("xhr poll error",t)}),this.pollXhr=t},u(i.prototype),i.prototype.create=function(){var t={agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR};t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized;var n=this.xhr=new a(t),r=this;try{h("xhr open %s: %s",this.method,this.uri),n.open(this.method,this.uri,this.async);try{if(this.extraHeaders){n.setDisableHeaderCheck&&n.setDisableHeaderCheck(!0);for(var o in this.extraHeaders)this.extraHeaders.hasOwnProperty(o)&&n.setRequestHeader(o,this.extraHeaders[o])}}catch(s){}if("POST"===this.method)try{this.isBinary?n.setRequestHeader("Content-type","application/octet-stream"):n.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch(s){}try{n.setRequestHeader("Accept","*/*")}catch(s){}"withCredentials"in n&&(n.withCredentials=!0),this.requestTimeout&&(n.timeout=this.requestTimeout),this.hasXDR()?(n.onload=function(){r.onLoad()},n.onerror=function(){r.onError(n.responseText)}):n.onreadystatechange=function(){if(2===n.readyState)try{var t=n.getResponseHeader("Content-Type");r.supportsBinary&&"application/octet-stream"===t&&(n.responseType="arraybuffer")}catch(e){}4===n.readyState&&(200===n.status||1223===n.status?r.onLoad():setTimeout(function(){r.onError(n.status)},0))},h("xhr data %s",this.data),n.send(this.data)}catch(s){return void setTimeout(function(){r.onError(s)},0)}e.document&&(this.index=i.requestsCount++,i.requests[this.index]=this)},i.prototype.onSuccess=function(){this.emit("success"),this.cleanup()},i.prototype.onData=function(t){this.emit("data",t),this.onSuccess()},i.prototype.onError=function(t){this.emit("error",t),this.cleanup(!0)},i.prototype.cleanup=function(t){if("undefined"!=typeof this.xhr&&null!==this.xhr){if(this.hasXDR()?this.xhr.onload=this.xhr.onerror=r:this.xhr.onreadystatechange=r,t)try{this.xhr.abort()}catch(n){}e.document&&delete i.requests[this.index],this.xhr=null}},i.prototype.onLoad=function(){var t;try{var e;try{e=this.xhr.getResponseHeader("Content-Type")}catch(n){}t="application/octet-stream"===e?this.xhr.response||this.xhr.responseText:this.xhr.responseText}catch(n){this.onError(n)}null!=t&&this.onData(t)},i.prototype.hasXDR=function(){return"undefined"!=typeof e.XDomainRequest&&!this.xs&&this.enablesXDR},i.prototype.abort=function(){this.cleanup()},i.requestsCount=0,i.requests={},e.document&&(e.attachEvent?e.attachEvent("onunload",s):e.addEventListener&&e.addEventListener("beforeunload",s,!1))}).call(e,function(){return this}())},function(t,e,n){function r(t){var e=t&&t.forceBase64;p&&!e||(this.supportsBinary=!1),o.call(this,t)}var o=n(20),i=n(30),s=n(21),a=n(31),c=n(32),u=n(3)("engine.io-client:polling");t.exports=r;var p=function(){var t=n(16),e=new t({xdomain:!1});return null!=e.responseType}();a(r,o),r.prototype.name="polling",r.prototype.doOpen=function(){this.poll()},r.prototype.pause=function(t){function e(){u("paused"),n.readyState="paused",t()}var n=this;if(this.readyState="pausing",this.polling||!this.writable){var r=0;this.polling&&(u("we are currently polling - waiting to pause"),r++,this.once("pollComplete",function(){u("pre-pause polling complete"),--r||e()})),this.writable||(u("we are currently writing - waiting to pause"),r++,this.once("drain",function(){u("pre-pause writing complete"),--r||e()}))}else e()},r.prototype.poll=function(){u("polling"),this.polling=!0,this.doPoll(),this.emit("poll")},r.prototype.onData=function(t){var e=this;u("polling got data %s",t);var n=function(t,n,r){return"opening"===e.readyState&&e.onOpen(),"close"===t.type?(e.onClose(),!1):void e.onPacket(t)};s.decodePayload(t,this.socket.binaryType,n),"closed"!==this.readyState&&(this.polling=!1,this.emit("pollComplete"),"open"===this.readyState?this.poll():u('ignoring poll - transport state "%s"',this.readyState))},r.prototype.doClose=function(){function t(){u("writing close packet"),e.write([{type:"close"}])}var e=this;"open"===this.readyState?(u("transport open - closing"),t()):(u("transport not open - deferring close"),this.once("open",t))},r.prototype.write=function(t){var e=this;this.writable=!1;var n=function(){e.writable=!0,e.emit("drain")};s.encodePayload(t,this.supportsBinary,function(t){e.doWrite(t,n)})},r.prototype.uri=function(){var t=this.query||{},e=this.secure?"https":"http",n="";!1!==this.timestampRequests&&(t[this.timestampParam]=c()),this.supportsBinary||t.sid||(t.b64=1),t=i.encode(t),this.port&&("https"===e&&443!==Number(this.port)||"http"===e&&80!==Number(this.port))&&(n=":"+this.port),t.length&&(t="?"+t);var r=this.hostname.indexOf(":")!==-1;return e+"://"+(r?"["+this.hostname+"]":this.hostname)+n+this.path+t}},function(t,e,n){function r(t){this.path=t.path,this.hostname=t.hostname,this.port=t.port,this.secure=t.secure,this.query=t.query,this.timestampParam=t.timestampParam,this.timestampRequests=t.timestampRequests,this.readyState="",this.agent=t.agent||!1,this.socket=t.socket,this.enablesXDR=t.enablesXDR,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.forceNode=t.forceNode,this.extraHeaders=t.extraHeaders,this.localAddress=t.localAddress}var o=n(21),i=n(8);t.exports=r,i(r.prototype),r.prototype.onError=function(t,e){var n=new Error(t);return n.type="TransportError",n.description=e,this.emit("error",n),this},r.prototype.open=function(){return"closed"!==this.readyState&&""!==this.readyState||(this.readyState="opening",this.doOpen()),this},r.prototype.close=function(){return"opening"!==this.readyState&&"open"!==this.readyState||(this.doClose(),this.onClose()),this},r.prototype.send=function(t){if("open"!==this.readyState)throw new Error("Transport not open");this.write(t)},r.prototype.onOpen=function(){this.readyState="open",this.writable=!0,this.emit("open")},r.prototype.onData=function(t){var e=o.decodePacket(t,this.socket.binaryType);this.onPacket(e)},r.prototype.onPacket=function(t){this.emit("packet",t)},r.prototype.onClose=function(){this.readyState="closed",this.emit("close")}},function(t,e,n){(function(t){function r(t,n){var r="b"+e.packets[t.type]+t.data.data;return n(r)}function o(t,n,r){if(!n)return e.encodeBase64Packet(t,r);var o=t.data,i=new Uint8Array(o),s=new Uint8Array(1+o.byteLength);s[0]=v[t.type];for(var a=0;a<i.length;a++)s[a+1]=i[a];return r(s.buffer)}function i(t,n,r){if(!n)return e.encodeBase64Packet(t,r);var o=new FileReader;return o.onload=function(){t.data=o.result,e.encodePacket(t,n,!0,r)},o.readAsArrayBuffer(t.data)}function s(t,n,r){if(!n)return e.encodeBase64Packet(t,r);if(g)return i(t,n,r);var o=new Uint8Array(1);o[0]=v[t.type];var s=new k([o.buffer,t.data]);return r(s)}function a(t){try{t=d.decode(t,{strict:!1})}catch(e){return!1}return t}function c(t,e,n){for(var r=new Array(t.length),o=l(t.length,n),i=function(t,n,o){e(n,function(e,n){r[t]=n,o(e,r)})},s=0;s<t.length;s++)i(s,t[s],o)}var u,p=n(22),h=n(23),f=n(24),l=n(25),d=n(26);t&&t.ArrayBuffer&&(u=n(28));var y="undefined"!=typeof navigator&&/Android/i.test(navigator.userAgent),m="undefined"!=typeof navigator&&/PhantomJS/i.test(navigator.userAgent),g=y||m;e.protocol=3;var v=e.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6},b=p(v),w={type:"error",data:"parser error"},k=n(29);e.encodePacket=function(e,n,i,a){"function"==typeof n&&(a=n,n=!1),"function"==typeof i&&(a=i,i=null);var c=void 0===e.data?void 0:e.data.buffer||e.data;if(t.ArrayBuffer&&c instanceof ArrayBuffer)return o(e,n,a);if(k&&c instanceof t.Blob)return s(e,n,a);if(c&&c.base64)return r(e,a);var u=v[e.type];return void 0!==e.data&&(u+=i?d.encode(String(e.data),{strict:!1}):String(e.data)),a(""+u)},e.encodeBase64Packet=function(n,r){var o="b"+e.packets[n.type];if(k&&n.data instanceof t.Blob){var i=new FileReader;return i.onload=function(){var t=i.result.split(",")[1];r(o+t)},i.readAsDataURL(n.data)}var s;try{s=String.fromCharCode.apply(null,new Uint8Array(n.data))}catch(a){for(var c=new Uint8Array(n.data),u=new Array(c.length),p=0;p<c.length;p++)u[p]=c[p];s=String.fromCharCode.apply(null,u)}return o+=t.btoa(s),r(o)},e.decodePacket=function(t,n,r){if(void 0===t)return w;if("string"==typeof t){if("b"===t.charAt(0))return e.decodeBase64Packet(t.substr(1),n);if(r&&(t=a(t),t===!1))return w;var o=t.charAt(0);return Number(o)==o&&b[o]?t.length>1?{type:b[o],data:t.substring(1)}:{type:b[o]}:w}var i=new Uint8Array(t),o=i[0],s=f(t,1);return k&&"blob"===n&&(s=new k([s])),{type:b[o],data:s}},e.decodeBase64Packet=function(t,e){var n=b[t.charAt(0)];if(!u)return{type:n,data:{base64:!0,data:t.substr(1)}};var r=u.decode(t.substr(1));return"blob"===e&&k&&(r=new k([r])),{type:n,data:r}},e.encodePayload=function(t,n,r){function o(t){return t.length+":"+t}function i(t,r){e.encodePacket(t,!!s&&n,!1,function(t){r(null,o(t))})}"function"==typeof n&&(r=n,n=null);var s=h(t);return n&&s?k&&!g?e.encodePayloadAsBlob(t,r):e.encodePayloadAsArrayBuffer(t,r):t.length?void c(t,i,function(t,e){return r(e.join(""))}):r("0:")},e.decodePayload=function(t,n,r){if("string"!=typeof t)return e.decodePayloadAsBinary(t,n,r);"function"==typeof n&&(r=n,n=null);var o;if(""===t)return r(w,0,1);for(var i,s,a="",c=0,u=t.length;c<u;c++){var p=t.charAt(c);if(":"===p){if(""===a||a!=(i=Number(a)))return r(w,0,1);if(s=t.substr(c+1,i),a!=s.length)return r(w,0,1);if(s.length){if(o=e.decodePacket(s,n,!1),w.type===o.type&&w.data===o.data)return r(w,0,1);var h=r(o,c+i,u);if(!1===h)return}c+=i,a=""}else a+=p}return""!==a?r(w,0,1):void 0},e.encodePayloadAsArrayBuffer=function(t,n){function r(t,n){e.encodePacket(t,!0,!0,function(t){return n(null,t)})}return t.length?void c(t,r,function(t,e){var r=e.reduce(function(t,e){var n;return n="string"==typeof e?e.length:e.byteLength,t+n.toString().length+n+2},0),o=new Uint8Array(r),i=0;return e.forEach(function(t){var e="string"==typeof t,n=t;if(e){for(var r=new Uint8Array(t.length),s=0;s<t.length;s++)r[s]=t.charCodeAt(s);n=r.buffer}e?o[i++]=0:o[i++]=1;for(var a=n.byteLength.toString(),s=0;s<a.length;s++)o[i++]=parseInt(a[s]);o[i++]=255;for(var r=new Uint8Array(n),s=0;s<r.length;s++)o[i++]=r[s]}),n(o.buffer)}):n(new ArrayBuffer(0))},e.encodePayloadAsBlob=function(t,n){function r(t,n){e.encodePacket(t,!0,!0,function(t){var e=new Uint8Array(1);if(e[0]=1,"string"==typeof t){for(var r=new Uint8Array(t.length),o=0;o<t.length;o++)r[o]=t.charCodeAt(o);t=r.buffer,e[0]=0}for(var i=t instanceof ArrayBuffer?t.byteLength:t.size,s=i.toString(),a=new Uint8Array(s.length+1),o=0;o<s.length;o++)a[o]=parseInt(s[o]);if(a[s.length]=255,k){var c=new k([e.buffer,a.buffer,t]);n(null,c)}})}c(t,r,function(t,e){return n(new k(e))})},e.decodePayloadAsBinary=function(t,n,r){"function"==typeof n&&(r=n,n=null);for(var o=t,i=[];o.byteLength>0;){for(var s=new Uint8Array(o),a=0===s[0],c="",u=1;255!==s[u];u++){if(c.length>310)return r(w,0,1);c+=s[u]}o=f(o,2+c.length),c=parseInt(c);var p=f(o,0,c);if(a)try{p=String.fromCharCode.apply(null,new Uint8Array(p))}catch(h){var l=new Uint8Array(p);p="";for(var u=0;u<l.length;u++)p+=String.fromCharCode(l[u])}i.push(p),o=f(o,c)}var d=i.length;i.forEach(function(t,o){r(e.decodePacket(t,n,!0),o,d)})}}).call(e,function(){return this}())},function(t,e){t.exports=Object.keys||function(t){var e=[],n=Object.prototype.hasOwnProperty;for(var r in t)n.call(t,r)&&e.push(r);return e}},function(t,e,n){(function(e){function r(t){if(!t||"object"!=typeof t)return!1;if(o(t)){for(var n=0,i=t.length;n<i;n++)if(r(t[n]))return!0;return!1}if("function"==typeof e.Buffer&&e.Buffer.isBuffer&&e.Buffer.isBuffer(t)||"function"==typeof e.ArrayBuffer&&t instanceof ArrayBuffer||s&&t instanceof Blob||a&&t instanceof File)return!0;if(t.toJSON&&"function"==typeof t.toJSON&&1===arguments.length)return r(t.toJSON(),!0);for(var c in t)if(Object.prototype.hasOwnProperty.call(t,c)&&r(t[c]))return!0;return!1}var o=n(10),i=Object.prototype.toString,s="function"==typeof e.Blob||"[object BlobConstructor]"===i.call(e.Blob),a="function"==typeof e.File||"[object FileConstructor]"===i.call(e.File);t.exports=r}).call(e,function(){return this}())},function(t,e){t.exports=function(t,e,n){var r=t.byteLength;if(e=e||0,n=n||r,t.slice)return t.slice(e,n);if(e<0&&(e+=r),n<0&&(n+=r),n>r&&(n=r),e>=r||e>=n||0===r)return new ArrayBuffer(0);for(var o=new Uint8Array(t),i=new Uint8Array(n-e),s=e,a=0;s<n;s++,a++)i[a]=o[s];return i.buffer}},function(t,e){function n(t,e,n){function o(t,r){if(o.count<=0)throw new Error("after called too many times");--o.count,t?(i=!0,e(t),e=n):0!==o.count||i||e(null,r)}var i=!1;return n=n||r,o.count=t,0===t?e():o}function r(){}t.exports=n},function(t,e,n){var r;(function(t,o){!function(i){function s(t){for(var e,n,r=[],o=0,i=t.length;o<i;)e=t.charCodeAt(o++),e>=55296&&e<=56319&&o<i?(n=t.charCodeAt(o++),56320==(64512&n)?r.push(((1023&e)<<10)+(1023&n)+65536):(r.push(e),o--)):r.push(e);return r}function a(t){for(var e,n=t.length,r=-1,o="";++r<n;)e=t[r],e>65535&&(e-=65536,o+=w(e>>>10&1023|55296),e=56320|1023&e),o+=w(e);return o}function c(t,e){if(t>=55296&&t<=57343){if(e)throw Error("Lone surrogate U+"+t.toString(16).toUpperCase()+" is not a scalar value");return!1}return!0}function u(t,e){return w(t>>e&63|128)}function p(t,e){if(0==(4294967168&t))return w(t);var n="";return 0==(4294965248&t)?n=w(t>>6&31|192):0==(4294901760&t)?(c(t,e)||(t=65533),n=w(t>>12&15|224),n+=u(t,6)):0==(4292870144&t)&&(n=w(t>>18&7|240),n+=u(t,12),n+=u(t,6)),n+=w(63&t|128)}function h(t,e){e=e||{};for(var n,r=!1!==e.strict,o=s(t),i=o.length,a=-1,c="";++a<i;)n=o[a],c+=p(n,r);return c}function f(){if(b>=v)throw Error("Invalid byte index");var t=255&g[b];if(b++,128==(192&t))return 63&t;throw Error("Invalid continuation byte")}function l(t){var e,n,r,o,i;if(b>v)throw Error("Invalid byte index");if(b==v)return!1;if(e=255&g[b],b++,0==(128&e))return e;if(192==(224&e)){if(n=f(),i=(31&e)<<6|n,i>=128)return i;throw Error("Invalid continuation byte")}if(224==(240&e)){if(n=f(),r=f(),i=(15&e)<<12|n<<6|r,i>=2048)return c(i,t)?i:65533;throw Error("Invalid continuation byte")}if(240==(248&e)&&(n=f(),r=f(),o=f(),i=(7&e)<<18|n<<12|r<<6|o,i>=65536&&i<=1114111))return i;throw Error("Invalid UTF-8 detected")}function d(t,e){e=e||{};var n=!1!==e.strict;g=s(t),v=g.length,b=0;for(var r,o=[];(r=l(n))!==!1;)o.push(r);return a(o)}var y="object"==typeof e&&e,m=("object"==typeof t&&t&&t.exports==y&&t,"object"==typeof o&&o);m.global!==m&&m.window!==m||(i=m);var g,v,b,w=String.fromCharCode,k={version:"2.1.2",encode:h,decode:d};r=function(){return k}.call(e,n,e,t),!(void 0!==r&&(t.exports=r))}(this)}).call(e,n(27)(t),function(){return this}())},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children=[],t.webpackPolyfill=1),t}},function(t,e){!function(){"use strict";for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",n=new Uint8Array(256),r=0;r<t.length;r++)n[t.charCodeAt(r)]=r;e.encode=function(e){var n,r=new Uint8Array(e),o=r.length,i="";for(n=0;n<o;n+=3)i+=t[r[n]>>2],i+=t[(3&r[n])<<4|r[n+1]>>4],i+=t[(15&r[n+1])<<2|r[n+2]>>6],i+=t[63&r[n+2]];return o%3===2?i=i.substring(0,i.length-1)+"=":o%3===1&&(i=i.substring(0,i.length-2)+"=="),i},e.decode=function(t){var e,r,o,i,s,a=.75*t.length,c=t.length,u=0;"="===t[t.length-1]&&(a--,"="===t[t.length-2]&&a--);var p=new ArrayBuffer(a),h=new Uint8Array(p);for(e=0;e<c;e+=4)r=n[t.charCodeAt(e)],o=n[t.charCodeAt(e+1)],i=n[t.charCodeAt(e+2)],s=n[t.charCodeAt(e+3)],h[u++]=r<<2|o>>4,h[u++]=(15&o)<<4|i>>2,h[u++]=(3&i)<<6|63&s;return p}}()},function(t,e){(function(e){function n(t){for(var e=0;e<t.length;e++){var n=t[e];if(n.buffer instanceof ArrayBuffer){var r=n.buffer;if(n.byteLength!==r.byteLength){var o=new Uint8Array(n.byteLength);o.set(new Uint8Array(r,n.byteOffset,n.byteLength)),r=o.buffer}t[e]=r}}}function r(t,e){e=e||{};var r=new i;n(t);for(var o=0;o<t.length;o++)r.append(t[o]);return e.type?r.getBlob(e.type):r.getBlob()}function o(t,e){return n(t),new Blob(t,e||{})}var i=e.BlobBuilder||e.WebKitBlobBuilder||e.MSBlobBuilder||e.MozBlobBuilder,s=function(){try{var t=new Blob(["hi"]);return 2===t.size}catch(e){return!1}}(),a=s&&function(){try{var t=new Blob([new Uint8Array([1,2])]);return 2===t.size}catch(e){return!1}}(),c=i&&i.prototype.append&&i.prototype.getBlob;t.exports=function(){return s?a?e.Blob:o:c?r:void 0}()}).call(e,function(){return this}())},function(t,e){e.encode=function(t){var e="";for(var n in t)t.hasOwnProperty(n)&&(e.length&&(e+="&"),e+=encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e},e.decode=function(t){for(var e={},n=t.split("&"),r=0,o=n.length;r<o;r++){var i=n[r].split("=");e[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return e}},function(t,e){t.exports=function(t,e){var n=function(){};n.prototype=e.prototype,t.prototype=new n,t.prototype.constructor=t}},function(t,e){"use strict";function n(t){var e="";do e=s[t%a]+e,t=Math.floor(t/a);while(t>0);return e}function r(t){var e=0;for(p=0;p<t.length;p++)e=e*a+c[t.charAt(p)];return e}function o(){var t=n(+new Date);return t!==i?(u=0,i=t):t+"."+n(u++)}for(var i,s="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),a=64,c={},u=0,p=0;p<a;p++)c[s[p]]=p;o.encode=n,o.decode=r,t.exports=o},function(t,e,n){(function(e){function r(){}function o(t){i.call(this,t),this.query=this.query||{},a||(e.___eio||(e.___eio=[]),a=e.___eio),this.index=a.length;var n=this;a.push(function(t){n.onData(t)}),this.query.j=this.index,e.document&&e.addEventListener&&e.addEventListener("beforeunload",function(){n.script&&(n.script.onerror=r)},!1)}var i=n(19),s=n(31);t.exports=o;var a,c=/\n/g,u=/\\n/g;s(o,i),o.prototype.supportsBinary=!1,o.prototype.doClose=function(){this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),this.form&&(this.form.parentNode.removeChild(this.form),this.form=null,this.iframe=null),i.prototype.doClose.call(this)},o.prototype.doPoll=function(){var t=this,e=document.createElement("script");this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),e.async=!0,e.src=this.uri(),e.onerror=function(e){t.onError("jsonp poll error",e)};var n=document.getElementsByTagName("script")[0];n?n.parentNode.insertBefore(e,n):(document.head||document.body).appendChild(e),this.script=e;var r="undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent);r&&setTimeout(function(){var t=document.createElement("iframe");document.body.appendChild(t),document.body.removeChild(t)},100)},o.prototype.doWrite=function(t,e){function n(){r(),e()}function r(){if(o.iframe)try{o.form.removeChild(o.iframe)}catch(t){o.onError("jsonp polling iframe removal error",t)}try{var e='<iframe src="javascript:0" name="'+o.iframeId+'">';i=document.createElement(e)}catch(t){i=document.createElement("iframe"),i.name=o.iframeId,i.src="javascript:0"}i.id=o.iframeId,o.form.appendChild(i),o.iframe=i}var o=this;if(!this.form){var i,s=document.createElement("form"),a=document.createElement("textarea"),p=this.iframeId="eio_iframe_"+this.index;s.className="socketio",s.style.position="absolute",s.style.top="-1000px",s.style.left="-1000px",s.target=p,s.method="POST",s.setAttribute("accept-charset","utf-8"),a.name="d",s.appendChild(a),document.body.appendChild(s),this.form=s,this.area=a}this.form.action=this.uri(),r(),t=t.replace(u,"\\\n"),this.area.value=t.replace(c,"\\n");try{this.form.submit()}catch(h){}this.iframe.attachEvent?this.iframe.onreadystatechange=function(){"complete"===o.iframe.readyState&&n()}:this.iframe.onload=n}}).call(e,function(){return this}())},function(t,e,n){(function(e){function r(t){var e=t&&t.forceBase64;e&&(this.supportsBinary=!1),this.perMessageDeflate=t.perMessageDeflate,this.usingBrowserWebSocket=h&&!t.forceNode,this.protocols=t.protocols,this.usingBrowserWebSocket||(l=o),i.call(this,t)}var o,i=n(20),s=n(21),a=n(30),c=n(31),u=n(32),p=n(3)("engine.io-client:websocket"),h=e.WebSocket||e.MozWebSocket;if("undefined"==typeof window)try{o=n(35)}catch(f){}var l=h;l||"undefined"!=typeof window||(l=o),t.exports=r,c(r,i),r.prototype.name="websocket",r.prototype.supportsBinary=!0,r.prototype.doOpen=function(){if(this.check()){var t=this.uri(),e=this.protocols,n={agent:this.agent,perMessageDeflate:this.perMessageDeflate};n.pfx=this.pfx,n.key=this.key,n.passphrase=this.passphrase,n.cert=this.cert,n.ca=this.ca,n.ciphers=this.ciphers,n.rejectUnauthorized=this.rejectUnauthorized,this.extraHeaders&&(n.headers=this.extraHeaders),this.localAddress&&(n.localAddress=this.localAddress);try{this.ws=this.usingBrowserWebSocket?e?new l(t,e):new l(t):new l(t,e,n)}catch(r){return this.emit("error",r)}void 0===this.ws.binaryType&&(this.supportsBinary=!1),this.ws.supports&&this.ws.supports.binary?(this.supportsBinary=!0,this.ws.binaryType="nodebuffer"):this.ws.binaryType="arraybuffer",this.addEventListeners()}},r.prototype.addEventListeners=function(){var t=this;this.ws.onopen=function(){t.onOpen()},this.ws.onclose=function(){t.onClose()},this.ws.onmessage=function(e){t.onData(e.data)},this.ws.onerror=function(e){t.onError("websocket error",e)}},r.prototype.write=function(t){function n(){r.emit("flush"),setTimeout(function(){r.writable=!0,r.emit("drain")},0)}var r=this;this.writable=!1;for(var o=t.length,i=0,a=o;i<a;i++)!function(t){s.encodePacket(t,r.supportsBinary,function(i){if(!r.usingBrowserWebSocket){var s={};if(t.options&&(s.compress=t.options.compress),r.perMessageDeflate){var a="string"==typeof i?e.Buffer.byteLength(i):i.length;a<r.perMessageDeflate.threshold&&(s.compress=!1)}}try{r.usingBrowserWebSocket?r.ws.send(i):r.ws.send(i,s)}catch(c){p("websocket closed before onclose event")}--o||n()})}(t[i])},r.prototype.onClose=function(){i.prototype.onClose.call(this)},r.prototype.doClose=function(){"undefined"!=typeof this.ws&&this.ws.close()},r.prototype.uri=function(){var t=this.query||{},e=this.secure?"wss":"ws",n="";this.port&&("wss"===e&&443!==Number(this.port)||"ws"===e&&80!==Number(this.port))&&(n=":"+this.port),this.timestampRequests&&(t[this.timestampParam]=u()),this.supportsBinary||(t.b64=1),t=a.encode(t),t.length&&(t="?"+t);var r=this.hostname.indexOf(":")!==-1;return e+"://"+(r?"["+this.hostname+"]":this.hostname)+n+this.path+t},r.prototype.check=function(){return!(!l||"__initialize"in l&&this.name===r.prototype.name)}}).call(e,function(){return this}())},function(t,e){},function(t,e){var n=[].indexOf;t.exports=function(t,e){if(n)return t.indexOf(e);for(var r=0;r<t.length;++r)if(t[r]===e)return r;return-1}},function(t,e,n){"use strict";function r(t,e,n){this.io=t,this.nsp=e,this.json=this,this.ids=0,this.acks={},this.receiveBuffer=[],this.sendBuffer=[],this.connected=!1,this.disconnected=!0,this.flags={},n&&n.query&&(this.query=n.query),this.io.autoConnect&&this.open()}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=n(7),s=n(8),a=n(38),c=n(39),u=n(40),p=n(3)("socket.io-client:socket"),h=n(30),f=n(23);t.exports=e=r;var l={connect:1,connect_error:1,connect_timeout:1,connecting:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1,ping:1,pong:1},d=s.prototype.emit;s(r.prototype),r.prototype.subEvents=function(){if(!this.subs){var t=this.io;this.subs=[c(t,"open",u(this,"onopen")),c(t,"packet",u(this,"onpacket")),c(t,"close",u(this,"onclose"))]}},r.prototype.open=r.prototype.connect=function(){return this.connected?this:(this.subEvents(),this.io.open(),"open"===this.io.readyState&&this.onopen(),this.emit("connecting"),this)},r.prototype.send=function(){var t=a(arguments);return t.unshift("message"),this.emit.apply(this,t),this},r.prototype.emit=function(t){if(l.hasOwnProperty(t))return d.apply(this,arguments),this;var e=a(arguments),n={type:(void 0!==this.flags.binary?this.flags.binary:f(e))?i.BINARY_EVENT:i.EVENT,data:e};return n.options={},n.options.compress=!this.flags||!1!==this.flags.compress,"function"==typeof e[e.length-1]&&(p("emitting packet with ack id %d",this.ids),this.acks[this.ids]=e.pop(),n.id=this.ids++),this.connected?this.packet(n):this.sendBuffer.push(n),this.flags={},this},r.prototype.packet=function(t){t.nsp=this.nsp,this.io.packet(t)},r.prototype.onopen=function(){if(p("transport is open - connecting"),"/"!==this.nsp)if(this.query){var t="object"===o(this.query)?h.encode(this.query):this.query;p("sending connect packet with query %s",t),this.packet({type:i.CONNECT,query:t})}else this.packet({type:i.CONNECT})},r.prototype.onclose=function(t){p("close (%s)",t),this.connected=!1,this.disconnected=!0,delete this.id,this.emit("disconnect",t)},r.prototype.onpacket=function(t){var e=t.nsp===this.nsp,n=t.type===i.ERROR&&"/"===t.nsp;if(e||n)switch(t.type){case i.CONNECT:this.onconnect();break;case i.EVENT:this.onevent(t);break;case i.BINARY_EVENT:this.onevent(t);break;case i.ACK:this.onack(t);break;case i.BINARY_ACK:this.onack(t);break;case i.DISCONNECT:this.ondisconnect();break;case i.ERROR:this.emit("error",t.data)}},r.prototype.onevent=function(t){var e=t.data||[];p("emitting event %j",e),null!=t.id&&(p("attaching ack callback to event"),e.push(this.ack(t.id))),this.connected?d.apply(this,e):this.receiveBuffer.push(e)},r.prototype.ack=function(t){var e=this,n=!1;return function(){if(!n){n=!0;var r=a(arguments);p("sending ack %j",r),e.packet({type:f(r)?i.BINARY_ACK:i.ACK,id:t,data:r})}}},r.prototype.onack=function(t){var e=this.acks[t.id];"function"==typeof e?(p("calling ack %s with %j",t.id,t.data),e.apply(this,t.data),delete this.acks[t.id]):p("bad ack %s",t.id)},r.prototype.onconnect=function(){this.connected=!0,this.disconnected=!1,this.emit("connect"),this.emitBuffered()},r.prototype.emitBuffered=function(){var t;for(t=0;t<this.receiveBuffer.length;t++)d.apply(this,this.receiveBuffer[t]);for(this.receiveBuffer=[],t=0;t<this.sendBuffer.length;t++)this.packet(this.sendBuffer[t]);this.sendBuffer=[]},r.prototype.ondisconnect=function(){p("server disconnect (%s)",this.nsp),this.destroy(),this.onclose("io server disconnect")},r.prototype.destroy=function(){if(this.subs){for(var t=0;t<this.subs.length;t++)this.subs[t].destroy();this.subs=null}this.io.destroy(this)},r.prototype.close=r.prototype.disconnect=function(){return this.connected&&(p("performing disconnect (%s)",this.nsp),this.packet({type:i.DISCONNECT})),this.destroy(),this.connected&&this.onclose("io client disconnect"),this},r.prototype.compress=function(t){return this.flags.compress=t,this},r.prototype.binary=function(t){return this.flags.binary=t,this}},function(t,e){function n(t,e){var n=[];e=e||0;for(var r=e||0;r<t.length;r++)n[r-e]=t[r];return n}t.exports=n},function(t,e){"use strict";function n(t,e,n){return t.on(e,n),{destroy:function(){t.removeListener(e,n)}}}t.exports=n},function(t,e){var n=[].slice;t.exports=function(t,e){if("string"==typeof e&&(e=t[e]),"function"!=typeof e)throw new Error("bind() requires a function");var r=n.call(arguments,2);return function(){return e.apply(t,r.concat(n.call(arguments)))}}},function(t,e){function n(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}t.exports=n,n.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),n=Math.floor(e*this.jitter*t);t=0==(1&Math.floor(10*e))?t-n:t+n}return 0|Math.min(t,this.max)},n.prototype.reset=function(){this.attempts=0},n.prototype.setMin=function(t){this.ms=t},n.prototype.setMax=function(t){this.max=t},n.prototype.setJitter=function(t){this.jitter=t}}])});
const SortableTable = {
		data() {
			return {
				isSortable: !true,
				//isSortableInited: false
				draggingRow: null,
				draggingRowIndex: null
			}
		},
		
/*
		watch: {
			isSortable(v) {
				if (v) {
					this.bindSortable(this.$el, this);
				} else {
					this.unbindSortable(this.$el, this);
				}
			}
		},
		
		directives: { sortable: {
	        name: 'sortable',
	        
	        bind(el, binding, vnode) {
				if (vnode.context.isSortable) vnode.context.bindSortable(el);
	        },
	        
	        update(el, binding, vnode) {
				if (vnode.context.isSortable) vnode.context.bindSortable(el);
	        },
	        
	        unbind(el) {
				if (vnode.context.isSortable) vnode.context.unbindSortable(el);
	        }
	        
	    } },
*/

		methods: {
			rowDragStart (payload) {
				$mx('html').addClass('is-dragging');
				this.draggingRow = payload.row;
				this.draggingRowIndex = payload.index;
				payload.event.dataTransfer.effectAllowed = 'copy';
			},
        			
			rowDrop(payload) {
				payload.event.target.closest('tr').classList.remove('is-selected')
//				this.$buefy.toast.open(`Moved ${this.draggingRow.first_name} from row ${this.draggingRowIndex + 1} to ${droppedOnRowIndex + 1}`)
				
				let oldIndex = this.draggingRowIndex;
				let newIndex = payload.index;
				
				if (oldIndex != newIndex) {
					let data = this.fields;
					let itemTo = data[newIndex];
					let itemFrom = data.splice(oldIndex, 1)[0];
					data.splice(newIndex, 0, itemFrom);
	               
					this.fields = [];
					this.$nextTick(() => {
						this.fields = data;
						this.onReSort(oldIndex, newIndex, itemFrom, itemTo);
					});
				}

				$mx('html').removeClass('is-dragging');
				
/*
				let itemTo = data[evt.newIndex];
				let itemFrom = data.splice(evt.oldIndex, 1)[0];
				this.onSort(this.draggingRowIndex, payload.index, itemFrom, itemTo);
*/
			},
			
			rowDragOver(payload) {
				payload.event.dataTransfer.dropEffect = 'copy'
				payload.event.target.closest('tr').classList.add('is-selected')
				payload.event.preventDefault()
			},
			
			rowDragLeave(payload) {
				payload.event.target.closest('tr').classList.remove('is-selected')
				payload.event.preventDefault();
			},
			
			
/*
			bindSortable(el) {
				const table = el.querySelector('table')
	            this.unbindSortable(el);
	            table._sortable = Sortable.create(table.querySelector('tbody'), {
					onEnd: (evt) => {
						let data = this.fields;
						let itemTo = data[evt.newIndex];
						let itemFrom = data.splice(evt.oldIndex, 1)[0];
						data.splice(evt.newIndex, 0, itemFrom);
		               
						this.fields = [];
						this.$nextTick(() => {
							this.fields = data;
							this.onSort(evt.oldIndex, evt.newIndex, itemFrom, itemTo);
						});
		                
		            }
		        })
			},
			
			unbindSortable(el) {
	            const table = el.querySelector('table')
	            if (table._sortable != undefined) {
		            table._sortable.destroy();
		            delete table._sortable;
				}
			}
*/
		}
};
/*!
 * clipboard.js v1.7.1
 * https://zenorocha.github.io/clipboard.js
 *
 * Licensed MIT © Zeno Rocha
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Clipboard = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var DOCUMENT_NODE_TYPE = 9;

/**
 * A polyfill for Element.matches()
 */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    var proto = Element.prototype;

    proto.matches = proto.matchesSelector ||
                    proto.mozMatchesSelector ||
                    proto.msMatchesSelector ||
                    proto.oMatchesSelector ||
                    proto.webkitMatchesSelector;
}

/**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */
function closest (element, selector) {
    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
        if (typeof element.matches === 'function' &&
            element.matches(selector)) {
          return element;
        }
        element = element.parentNode;
    }
}

module.exports = closest;

},{}],2:[function(require,module,exports){
var closest = require('./closest');

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    }
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;

},{"./closest":1}],3:[function(require,module,exports){
/**
 * Check if argument is a HTML element.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.node = function(value) {
    return value !== undefined
        && value instanceof HTMLElement
        && value.nodeType === 1;
};

/**
 * Check if argument is a list of HTML elements.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.nodeList = function(value) {
    var type = Object.prototype.toString.call(value);

    return value !== undefined
        && (type === '[object NodeList]' || type === '[object HTMLCollection]')
        && ('length' in value)
        && (value.length === 0 || exports.node(value[0]));
};

/**
 * Check if argument is a string.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.string = function(value) {
    return typeof value === 'string'
        || value instanceof String;
};

/**
 * Check if argument is a function.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.fn = function(value) {
    var type = Object.prototype.toString.call(value);

    return type === '[object Function]';
};

},{}],4:[function(require,module,exports){
var is = require('./is');
var delegate = require('delegate');

/**
 * Validates all params and calls the right
 * listener function based on its target type.
 *
 * @param {String|HTMLElement|HTMLCollection|NodeList} target
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listen(target, type, callback) {
    if (!target && !type && !callback) {
        throw new Error('Missing required arguments');
    }

    if (!is.string(type)) {
        throw new TypeError('Second argument must be a String');
    }

    if (!is.fn(callback)) {
        throw new TypeError('Third argument must be a Function');
    }

    if (is.node(target)) {
        return listenNode(target, type, callback);
    }
    else if (is.nodeList(target)) {
        return listenNodeList(target, type, callback);
    }
    else if (is.string(target)) {
        return listenSelector(target, type, callback);
    }
    else {
        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
    }
}

/**
 * Adds an event listener to a HTML element
 * and returns a remove listener function.
 *
 * @param {HTMLElement} node
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNode(node, type, callback) {
    node.addEventListener(type, callback);

    return {
        destroy: function() {
            node.removeEventListener(type, callback);
        }
    }
}

/**
 * Add an event listener to a list of HTML elements
 * and returns a remove listener function.
 *
 * @param {NodeList|HTMLCollection} nodeList
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNodeList(nodeList, type, callback) {
    Array.prototype.forEach.call(nodeList, function(node) {
        node.addEventListener(type, callback);
    });

    return {
        destroy: function() {
            Array.prototype.forEach.call(nodeList, function(node) {
                node.removeEventListener(type, callback);
            });
        }
    }
}

/**
 * Add an event listener to a selector
 * and returns a remove listener function.
 *
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenSelector(selector, type, callback) {
    return delegate(document.body, selector, type, callback);
}

module.exports = listen;

},{"./is":3,"delegate":2}],5:[function(require,module,exports){
function select(element) {
    var selectedText;

    if (element.nodeName === 'SELECT') {
        element.focus();

        selectedText = element.value;
    }
    else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
        var isReadOnly = element.hasAttribute('readonly');

        if (!isReadOnly) {
            element.setAttribute('readonly', '');
        }

        element.select();
        element.setSelectionRange(0, element.value.length);

        if (!isReadOnly) {
            element.removeAttribute('readonly');
        }

        selectedText = element.value;
    }
    else {
        if (element.hasAttribute('contenteditable')) {
            element.focus();
        }

        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        selectedText = selection.toString();
    }

    return selectedText;
}

module.exports = select;

},{}],6:[function(require,module,exports){
function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;

},{}],7:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', 'select'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('select'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.select);
        global.clipboardAction = mod.exports;
    }
})(this, function (module, _select) {
    'use strict';

    var _select2 = _interopRequireDefault(_select);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var ClipboardAction = function () {
        /**
         * @param {Object} options
         */
        function ClipboardAction(options) {
            _classCallCheck(this, ClipboardAction);

            this.resolveOptions(options);
            this.initSelection();
        }

        /**
         * Defines base properties passed from constructor.
         * @param {Object} options
         */


        _createClass(ClipboardAction, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = options.action;
                this.container = options.container;
                this.emitter = options.emitter;
                this.target = options.target;
                this.text = options.text;
                this.trigger = options.trigger;

                this.selectedText = '';
            }
        }, {
            key: 'initSelection',
            value: function initSelection() {
                if (this.text) {
                    this.selectFake();
                } else if (this.target) {
                    this.selectTarget();
                }
            }
        }, {
            key: 'selectFake',
            value: function selectFake() {
                var _this = this;

                var isRTL = document.documentElement.getAttribute('dir') == 'rtl';

                this.removeFake();

                this.fakeHandlerCallback = function () {
                    return _this.removeFake();
                };
                this.fakeHandler = this.container.addEventListener('click', this.fakeHandlerCallback) || true;

                this.fakeElem = document.createElement('textarea');
                // Prevent zooming on iOS
                this.fakeElem.style.fontSize = '12pt';
                // Reset box model
                this.fakeElem.style.border = '0';
                this.fakeElem.style.padding = '0';
                this.fakeElem.style.margin = '0';
                // Move element out of screen horizontally
                this.fakeElem.style.position = 'absolute';
                this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
                // Move element to the same position vertically
                var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                this.fakeElem.style.top = yPosition + 'px';

                this.fakeElem.setAttribute('readonly', '');
                this.fakeElem.value = this.text;

                this.container.appendChild(this.fakeElem);

                this.selectedText = (0, _select2.default)(this.fakeElem);
                this.copyText();
            }
        }, {
            key: 'removeFake',
            value: function removeFake() {
                if (this.fakeHandler) {
                    this.container.removeEventListener('click', this.fakeHandlerCallback);
                    this.fakeHandler = null;
                    this.fakeHandlerCallback = null;
                }

                if (this.fakeElem) {
                    this.container.removeChild(this.fakeElem);
                    this.fakeElem = null;
                }
            }
        }, {
            key: 'selectTarget',
            value: function selectTarget() {
                this.selectedText = (0, _select2.default)(this.target);
                this.copyText();
            }
        }, {
            key: 'copyText',
            value: function copyText() {
                var succeeded = void 0;

                try {
                    succeeded = document.execCommand(this.action);
                } catch (err) {
                    succeeded = false;
                }

                this.handleResult(succeeded);
            }
        }, {
            key: 'handleResult',
            value: function handleResult(succeeded) {
                this.emitter.emit(succeeded ? 'success' : 'error', {
                    action: this.action,
                    text: this.selectedText,
                    trigger: this.trigger,
                    clearSelection: this.clearSelection.bind(this)
                });
            }
        }, {
            key: 'clearSelection',
            value: function clearSelection() {
                if (this.trigger) {
                    this.trigger.focus();
                }

                window.getSelection().removeAllRanges();
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.removeFake();
            }
        }, {
            key: 'action',
            set: function set() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'copy';

                this._action = action;

                if (this._action !== 'copy' && this._action !== 'cut') {
                    throw new Error('Invalid "action" value, use either "copy" or "cut"');
                }
            },
            get: function get() {
                return this._action;
            }
        }, {
            key: 'target',
            set: function set(target) {
                if (target !== undefined) {
                    if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target.nodeType === 1) {
                        if (this.action === 'copy' && target.hasAttribute('disabled')) {
                            throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                        }

                        if (this.action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
                            throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                        }

                        this._target = target;
                    } else {
                        throw new Error('Invalid "target" value, use a valid Element');
                    }
                }
            },
            get: function get() {
                return this._target;
            }
        }]);

        return ClipboardAction;
    }();

    module.exports = ClipboardAction;
});

},{"select":5}],8:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', './clipboard-action', 'tiny-emitter', 'good-listener'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('./clipboard-action'), require('tiny-emitter'), require('good-listener'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.clipboardAction, global.tinyEmitter, global.goodListener);
        global.clipboard = mod.exports;
    }
})(this, function (module, _clipboardAction, _tinyEmitter, _goodListener) {
    'use strict';

    var _clipboardAction2 = _interopRequireDefault(_clipboardAction);

    var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

    var _goodListener2 = _interopRequireDefault(_goodListener);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var Clipboard = function (_Emitter) {
        _inherits(Clipboard, _Emitter);

        /**
         * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
         * @param {Object} options
         */
        function Clipboard(trigger, options) {
            _classCallCheck(this, Clipboard);

            var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this));

            _this.resolveOptions(options);
            _this.listenClick(trigger);
            return _this;
        }

        /**
         * Defines if attributes would be resolved using internal setter functions
         * or custom functions that were passed in the constructor.
         * @param {Object} options
         */


        _createClass(Clipboard, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
                this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
                this.text = typeof options.text === 'function' ? options.text : this.defaultText;
                this.container = _typeof(options.container) === 'object' ? options.container : document.body;
            }
        }, {
            key: 'listenClick',
            value: function listenClick(trigger) {
                var _this2 = this;

                this.listener = (0, _goodListener2.default)(trigger, 'click', function (e) {
                    return _this2.onClick(e);
                });
            }
        }, {
            key: 'onClick',
            value: function onClick(e) {
                var trigger = e.delegateTarget || e.currentTarget;

                if (this.clipboardAction) {
                    this.clipboardAction = null;
                }

                this.clipboardAction = new _clipboardAction2.default({
                    action: this.action(trigger),
                    target: this.target(trigger),
                    text: this.text(trigger),
                    container: this.container,
                    trigger: trigger,
                    emitter: this
                });
            }
        }, {
            key: 'defaultAction',
            value: function defaultAction(trigger) {
                return getAttributeValue('action', trigger);
            }
        }, {
            key: 'defaultTarget',
            value: function defaultTarget(trigger) {
                var selector = getAttributeValue('target', trigger);

                if (selector) {
                    return document.querySelector(selector);
                }
            }
        }, {
            key: 'defaultText',
            value: function defaultText(trigger) {
                return getAttributeValue('text', trigger);
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.listener.destroy();

                if (this.clipboardAction) {
                    this.clipboardAction.destroy();
                    this.clipboardAction = null;
                }
            }
        }], [{
            key: 'isSupported',
            value: function isSupported() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];

                var actions = typeof action === 'string' ? [action] : action;
                var support = !!document.queryCommandSupported;

                actions.forEach(function (action) {
                    support = support && !!document.queryCommandSupported(action);
                });

                return support;
            }
        }]);

        return Clipboard;
    }(_tinyEmitter2.default);

    /**
     * Helper function to retrieve attribute value.
     * @param {String} suffix
     * @param {Element} element
     */
    function getAttributeValue(suffix, element) {
        var attribute = 'data-clipboard-' + suffix;

        if (!element.hasAttribute(attribute)) {
            return;
        }

        return element.getAttribute(attribute);
    }

    module.exports = Clipboard;
});

},{"./clipboard-action":7,"good-listener":4,"tiny-emitter":6}]},{},[8])(8)
});
window.modules_loaded = {};
window.components_hooks = {};
window.modules_hooks = {};


var App = {
	modules: {},
	endpoints: {},
	components: {},
	defineModuleLazy: [],
	data: [],
	
	loadModule(module) {
		window.modules_loaded[module] = true;
	    var link = document.createElement('link');
	    link.href = '/s/css/vue.'+module+'.css'+scriptsVersion;
	    link.type = 'text/css';
	    link.rel = 'stylesheet';
	    document.body.appendChild(link);	
		
		var script = document.createElement('script');
	    script.src = '/s/js/vue.'+module+'.js'+scriptsVersion;
	    script.async = true;
	    script.onload = function() {
		   window.$vue.$forceUpdate();
	    }
	    
		document.body.appendChild(script);  
	},
	
	loadComponent(name) {
		return new Promise((resolve, reject) => {
			var m = /^vue\-([^-]+)/ig;
			var t = m.exec(name);
			
			if (Vue.options.components[name] != undefined) {
		   	 	resolve(Vue.options.components[name]);
			} else {			

				if (Vue.options.components[name] == undefined) {
					Vue.component(name, function(resolve) {
						//todo: Загрузка модуля — показать спиннер, а также без этого не работают addons в блоках
						window.components_hooks[name] = resolve;
					});
				}
			
				if (t) {
					window.components_hooks[name] = resolve;

					var module = t[1];
					if (window.modules_loaded[module] == undefined) {
						this.loadModule(module);
					}
				} else {
					reject();
				}
			}
		
		});
	},
	
	
	defineComponent(module, name, options) {
		if (this.components[module] == undefined) this.components[module] = {};
		this.components[module][name] = [name, options];
		window.modules_loaded[module] = true;
		Vue.component(name, options);
	},
	
	defineModuleComplete() {
		_.each(this.defineModuleLazy, (v) => {
			this.defineModule(v[0], v[1], true);
		});
		
		this.defineModuleLazy = [];
	},
	
	defineModule(module, routes, force) {
		if (window.$vue == undefined && force == undefined) {
			this.defineModuleLazy.push([module, routes]);
			return;
		}
		
		if (module == 'index' || module == 'frontend') {
			let _walk = (routes) => {
				_.each(routes, (item) => {
					item.pathToRegexpOptions = { strict: true };
					
					if (window.account != undefined && window.account.custom_domain && ['index', 'inner'].indexOf(item.name) != -1) {
						item.path = '/';
					}

					if (typeof item.component == 'string') {
						item.componentName = item.component;
						item.component = function(resolve, reject) { App.loadComponent(item.componentName).then(resolve, reject) }
					} else if (item.component == undefined) {
						item.component = {template: '<router-view></router-view>'};
					}
					
					if (item.children != undefined && item.children.length) _walk(item.children);
				});
			}
			
			_walk(routes);
			
			router_options.routes = routes;
			
			router = new VueRouter(router_options);
			router.getRoute = function(conditions) {
				let find = (routes, conditions) => {
					r = _.find(routes, conditions);
					if (r) return r;
					
					for (let i = 0; i < routes.length; i++) {
						if (routes[i].children != undefined) r = find(routes[i].children, conditions);
						if (r) return r;
					}
					
					return null;
				}
				
				return find(this.options.routes, conditions);
			}
			
			router.beforeEach((to, from, next) => {
				window.$events.fire('beforeNavigate', from);
				next();
			});
			

			router.afterEach((to) => { 
				window.$events.fire('navigate', to);
				
/*
				let title = null;
				for (var i = to.matched.length - 1; i > 0; i--) {
					if (to.matched[i].meta != undefined && to.matched[i].meta.title != undefined) title = to.matched[i].meta.title;
				}
				
				Vue.prototype.$set(window, 'currentTitle', title);
*/

			});
			
			router.beforeResolve((to, from, next) => {
				
/*
				let title = null;
				for (var i = to.matched.length - 1; i > 0; i--) {
					if (to.matched[i].meta != undefined && to.matched[i].meta.title != undefined) title = to.matched[i].meta.title;
				}
				
				Vue.prototype.$set(this, 'currentTitle', title);
*/
				
				
				var m = /^\/[0-9]+\/([^\/]+)\//ig;
				var t = m.exec(to.path);
				
				if (t && t.length) {
					let module = t[1];
					if (window.modules_loaded[module] == undefined) {
						window.components_hooks[module] = () => { 
							next(); 
							router.replace(router.currentRoute);
						};
						
						this.loadModule(module);
					} else {
						next();
					}
				} else {
					next();
				}
			});
			
			window.vue_options.router = router;
		} else {
			$mx.get('/api/permissions/get.json', {module: module}).then(({data}) => {
				
				let endpoints = data.response.endpoints[module];
				this.endpoints[module] = endpoints;
				
				let _walk = (routes) => {
					_.each(routes, (item) => {
						item.pathToRegexpOptions = { strict: true };

						if (item.meta == undefined) item.meta = {};
						item.meta.module = module;
						
						if (typeof item.component == 'string') {
							item.componentName = item.component;
							item.component = function(resolve, reject) { App.loadComponent(item.componentName).then(resolve, reject) }
	//						item.component = Vue.options.components[item.component];
						} else if (item.component == undefined) {
							item.component = {template: '<router-view></router-view>'};
						}
						
						
						if (item.children != undefined) {
							item.children = _.filter(item.children, (o) => {
								if (o.endpoint == undefined) return true;
								let ep = o.endpoint.split('/');
								let m = this.endpoints;
								
								let allow = true;
								for (var i in ep) {
									if (m[ep[i]] == undefined) {
										allow = false;
										break;
									} else {
										m = m[ep[i]];
									}
								}
								
								return allow;
							});
							
							if (item.children != undefined && item.children.length) {
								//item.children[0].alias = item.path;
								_walk(item.children);
							}
						}
						
						if (router == null && base) {
							item.path = base + item.path.substring(1);
						}
					});
				}
				
				_walk(routes);
				
				this.modules[module] = routes;
				
				_.each(this.components[module], (c) => {
					if (window.components_hooks[c[0]] != undefined) {
						window.components_hooks[c[0]](c[1]);
					}
				});
				
				delete this.components[module];
				
				if (router != null && routes.length) {
					
					let parent = router.getRoute({name: module});
// 					routes[0].alias = parent.path;
					if (parent) parent.children = routes;
					//parent.redirect = routes[0];
					
					router_options.routes = router.options.routes;
					let tmp = new VueRouter(router_options);
					router.matcher = tmp.matcher;
// 					router.go((router.currentRoute));
					//router.replace(routes[0]);
				}
				
				if (window.components_hooks[module] != undefined) {
					window.components_hooks[module](routes);
				}
			});
		}
	},
	


/*
	defineDayNames(locale) {
		let daysNames = [];
		let date = new Date();
		date.setDate(17);
		let n = date.getDate() - date.getDay();
		date.setDate(n);
		
		for (var i = 0; i < 7; i++) {
			date.setDate(n + i);
			daysNames.push(new Intl.DateTimeFormat(locale, {
				weekday: "short"
			}).format(date).toUpperCase());
		}
		
		console.log(daysNames);
		
// 		i18n.daysNames[locale] = daysNames;
	},
	
	defineMonths(locale) {
	    var format = new Intl.DateTimeFormat(locale, { month: 'long' })
	    var months = []
	    for (var month = 0; month < 12; month++) {
	        var testDate = new Date(Date.UTC(2000, month, 1, 0, 0, 0));
	        let s = format.format(testDate);
	        s = s.charAt(0).toUpperCase() + s.slice(1);
	        months.push(s)
	    }
	    
	    console.log(months);
// 	    i18n.monthsNames[locale] = months;
	},
*/


	
	defineLanguage(locale, first_day_week, phrases) {
		i18n.phrases[locale] = phrases;
		i18n.first_day_week[locale] = first_day_week;
// 		this.defineDayNames(locale);
// 		this.defineMonths(locale);
		
		if (window.$vue) window.$vue.$forceUpdate();
	}
}
	
window.$app = App;
var i18n = {
	locale: '',
	formats: {},
	phrases: {},
/*
	daysNames: {},
	monthsNames: {},
*/
	first_day_week: {ru: 1},
	
	init(options) {
		if (options.locales != undefined) window.locales = options.locales;
		
		this.locale = options.current;
		this.formats = options.formats;
		
		if (this.phrases[this.locale] == undefined && this.locale != 'ru') {
			this.phrases[this.locale] = [];
			$mx.lazy('/s/js/locales.'+this.locale+'.js'+scriptsVersion);
/*
	        var script = document.createElement('script');
	        
	        script.src = '/s/js/locales.'+this.locale+'.js'+scriptsVersion;
	        script.async = true;
	        document.body.appendChild(script);			
*/
		}
	},
	
	extend(phrases) {
		this.phrases[this.locale] = Object.assign(this.phrases[this.locale], phrases);
	},
	
	install(Vue, options) {
		let gettext = (v, o) => {
			v = this.phrases[this.locale]?(this.phrases[this.locale][v] || v):v;
			return (typeof v == 'string')?v.split('|')[0]:v;
		}
		
		let plural = (v, i) => {
			var titles = this.phrases[this.locale]?(this.phrases[this.locale][v] || v):v;
			titles = titles.split('|');
			
			if (titles.length) {
				if (titles.length == 1) return i+' '+titles[0];
				i = Math.abs(i);
				if (i == 0) return titles[2];
				var cases = [2, 0, 1, 1, 1, 2];
		    	return i+' '+titles[((i%100>4 && i%100<20)? 2 : cases[Math.min(i%10, 5)])];
		    } else {
			    return i+' '+v;
		    }
		}
		
		let number = (v) => {
// 			return _.isNumber(v)?(new Intl.NumberFormat(this.locale).format(v)):v;
			let p = Vue.prototype.$account.number;
			return _.isNumber(v)?window.number_format(v, {decimal: p.decimal, thousands: p.thousands, precision: 0}):v;
		}
		
		let decimal = (v) => {
			return _.isNumber(v)?window.number_format(v, Vue.prototype.$account.number):v;
		}
		
		let weight = (v, with_unit) => {
			let w = Vue.prototype.$account.weight;
			return (_.isNumber(v)?window.number_format(v, w):v)+(with_unit?(' '+w.unit_title):'');
		}
		
		let currency = (v, currency) => {
			if (currency == undefined) currency = Vue.prototype.$account.currency.title;
			
			return _.isNumber(v)?(Vue.prototype.$account.currency.format.replace('%p', window.number_format(v, Vue.prototype.$account.currency)).replace('%c', currency).replace(/ /g, ' ')):v;
			
// 			return _.isNumber(v)?(new Intl.NumberFormat(this.locale, {style: 'currency', currency: currency}).format(v)):v;
		}
		
		let datetime = (v) => {
// 			.setUTCHours(Vue.prototype.$account.utc_timezone)
//			Vue.prototype.$account.utc_timezone * 3600 * 1000
			return v?date_format(this.formats.datetime, Date.parse(v) / 1000 | 0):v;
		}

		let date = (v) => {
			return v?date_format(this.formats.date, Date.parse(v) / 1000 | 0):v;
		}
		
		let sprintf = (v, format) => {
			return format.replace('%s', v);
		}
		
		let format = function() {
			var args = arguments;
			return args[0].replace(/{(\d+)}/g, function(match, number) { 
				return typeof args[number] != 'undefined' ? args[number] : match;
			});
		};
		
		let replace = function() {
			var args = arguments;
			return args[0].replace(args[1], args[2]);
		} 
		
		let nl2br = function(v) {
			return (typeof(v) == 'string')?v.replace(/\n/g, "<br>"):v;
		}
		
		let escape = function(v) {
			return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		}
		
		let nvl = function(a, b) {
			return (typeof(a) == 'undefined' || a == null || a === '')?b:a;
		}
		
		Vue.filter('gettext', gettext);
		Vue.prototype.$gettext = gettext;
		
		Vue.filter('plural', plural);
		Vue.prototype.$plural = plural;

		Vue.filter('number', number);
		Vue.filter('weight', weight);
		
		Vue.prototype.$number = number;
		
		Vue.filter('decimal', decimal);
		Vue.prototype.$decimal = decimal;

		Vue.filter('currency', currency);
		Vue.prototype.$currency = currency;
		
		Vue.filter('datetime', datetime);
		Vue.prototype.$datetime = datetime;

		Vue.filter('date', date);
		Vue.prototype.$date = date;

		Vue.filter('nvl', nvl);
		Vue.prototype.$nvl = nvl;
		
		Vue.filter('sprintf', sprintf);
		Vue.filter('replace', replace);
		Vue.filter('format', format);
		Vue.filter('nl2br', nl2br);
		Vue.filter('escape', escape);
		
		Vue.prototype.$nl2br = nl2br;
		Vue.prototype.$format = format;
		Vue.prototype.$escape = escape;
		
		Vue.prototype.$clone = (v) => {
			return JSON.parse(JSON.stringify(v));
		}
				
		Vue.filter('join', function(v, separator) {
			return v?v.join(separator):v;
		});

		Vue.prototype.$getDaysNames = () => {
			return _.map(["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"], Vue.prototype.$gettext);
// 			return this.daysNames[this.locale];
		}
		
		Vue.prototype.$getMonthsNames = () => {
			return _.map(["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"], Vue.prototype.$gettext)
// 			return this.monthsNames[this.locale];
		}

		Vue.prototype.$getFirstDayWeek = () => {
			//defaultFirstDayOfWeek
			return this.first_day_week[this.locale];
		}
	}
}

window.i18n = i18n;

Vue.use(i18n);
Vue.use(Buefy.default, { 
	defaultIconPack: 'fal',
	defaultDateFormatter: (date) => date_format(window.i18n.formats.date, Date.parse(date) / 1000 | 0),
// 	defaultDateParser: (d) => { console.log(d); return Date.parse(d)},
// 	defaultTimeParser: (date) => { console.log('>>>', date); },
// 	defaultDayNames: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
// 	defaultMonthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
//	defaultFirstDayOfWeek: 1
});

//Vue.prototype.$http = axios;
Vue.prototype.$http = $mx;

let path = document.location.pathname.split('/');

window.base_path_prefix = (/^[a-z]{2}(\-[a-z]{2})?$/.test(path[1])?('/'+path[1]):'')
window.base_path = window.base_path_prefix+'/profile/';

// var is_app = ((path[1].length == 2) && (path[2] == 'profile')) || (path[1] == 'profile');
// alert(is_app);

var router = null;
var router_options = {mode: 'history', routes: [], base: window.base_path, linkExactActiveClass: 'active', linkActiveClass: 'active'};

Vue.component('sortable-list', {
	mixins: [VueSlicksort.ContainerMixin],
	template: `<div><slot /></div>`
});

Vue.component('sortable-item', {
	mixins: [VueSlicksort.ElementMixin],
	props: ['item'],
	template: `<div><slot /></div>`
});

Vue.component('sortable-handle', {
	mixins: [VueSlicksort.ElementMixin],
});

Vue.directive('sortable-handle', VueSlicksort.HandleDirective);

/*
router = new VueRouter({mode: 'history', routes: [], base: '/app/', linkActiveClass: 'active'});
router.beforeEach((to, from, next) => {
	var module = to.path.split('/')[1];
	if (modules[module] != undefined) {
		next();
	} else {
		modules[modules] = [];

        var script = document.createElement('script');
        script.src = '/s/js/'+module+'.js';
        script.async = true;
        document.body.appendChild(script);			
		
		next();
	}
});
*/


+function (d, w) { "use strict";

	w.ListModel = {
	data() {
		return {
			fields: [],
			current: null,
            next: null,
			total: 0,
			page: 1,
			perPage: 30,
            pages: [],
			checkedRows: [],
            sortField: '',
            sortOrder: ''
		}
	},
	
	methods: {
		clearPages() {
            this.next = null;
            this.current = null;
            this.pages = [];
            this.page = 1;
		},
		
		refresh() {
			this.clearPages();
			this.fetchData();
		},
		
        onSort(field, order) {
            this.sortField = field;
            this.sortOrder = order;
            this.clearPages();
            this.fetchData(true)
        },

		onPageChange(page) {
            this.page = page;
            this.fetchData(true)
        },
        
        cachePage(data, resolve) {
	        data.current = this.next;
	        
	        this.pages[this.page] = data;
	        if (resolve != undefined) {
		        resolve(data);
			} else {
				this.fields = data.fields;
			}
	        
	        this.current = data.current;
	        this.next = data.next;
	        
			this.total = (this.perPage * this.page) + (this.next?1:0);
        },
        
        checkCache(resolve) {
	        if (this.pages[this.page] != undefined) {
		        let data = this.pages[this.page];
		        
				if (resolve != undefined) {
					resolve(data);
				} else {
					this.fields = data.fields;
				}
				
				this.current = data.current;
				this.next = data.next;
				
				return true;
			} else {
				return false;
			}
        },
		
		merge(fields, key, indexes, cb) {
			let ids = this.checkIds(fields, key, indexes);
			
			if (ids.length) {
				cb(ids, (fields_new) => {
					return _.map(fields, (o) => {
// 						return _.assign(o, _.find(fields_new, (v) => v[key] == o[key]));
						return Object.assign(o, _.find(fields_new, (v) => v[key] == o[key]));
					});
				});
			}
		},
		
		checkIds(fields, key, indexes) {
			if (!indexes) return _.map(fields, key);
			
			return _.values(_.pickBy(_.map(fields, (v) => {
				return (indexes.indexOf(v[key]) != -1)?v[key]:null;
			}), _.identity));
		},
		
		onCheckAll(o, checkedRows) {
			let obj = o.target.closest('.checkbox').querySelectorAll('input')[0];
			let t = obj.closest('.table');
			_.each(t.querySelectorAll('td [type="checkbox"]'), (v) => {
				v = parseInt(v.value);
				
				if (!obj.checked) {
					if (checkedRows.indexOf(v) == -1) checkedRows.push(v);
				} else {
					let idx = checkedRows.indexOf(v);
					if (idx != -1) checkedRows.splice(idx, 1);
				}
			});
		}
	}
}

	w.FormModel = {
		data() {
			return {
				values: {},
				variants: {},
				errors: {}
			}
		},
		
		methods: {
			checkResult(data) {
				this.errors = [];
				
				if (data.result == 'fail') {
					if (data.errors != undefined) this.errors = data.errors;
	
					let errors_form = 0;
					let errors_message = 0;
					
					_.each(data.errors, (value, key) => {
						if ((_.isNumber(key) || key.match(/^[0-9]+$/)) && (typeof value != 'object')) {
							Vue.prototype.$buefy.toast.open({
								duration: 5000,
								message: value,
								type: 'is-danger',
								position: 'is-top',
								queue: false
							});
							errors_message++;
						} else {
							errors_form++;
						}
					});
					
					if (errors_form && !errors_message && (data.message == undefined)) data.message = this.$gettext('В форме присутствуют ошибки');
				}
				
				if (data.message != undefined && data.message) {
					Vue.prototype.$buefy.toast.open({
						duration: 5000,
						message: data.message,
						type: (data.result == 'fail')?'is-danger':'is-success',
						position: 'is-top',
						queue: false
					});
				}
			}
		}
	}

	var RestAPI = {
		install: function (Vue, options) {
			Vue.prototype.$api = {
				queues: {},
				
				get(name, params, obj, queue = null) {
					return this.process('get', obj, name, params, queue);
				},
	
				post(name, params, obj, queue = null) {
					return this.process('post', obj, name, params, queue);
				},
				
				checkResult(data, obj, queue = null) {
					if (obj != undefined && obj.checkResult != undefined) obj.checkResult(data);
					
					if (queue) {
						this.queues[queue].shift();
						
						if (this.queues[queue].length) {
							let o = this.queues[queue][0];
							this.process(o[0], o[1], o[2], o[3], queue, true).then(o[4], o[5]);
						}
					}
				},
				
				process(method, obj, name, params, queue = null, queue_repeat = false) {
					// Если есть очередь и она не пустая, то добавляем в нее
					if (queue) {
						if ((this.queues[queue] != undefined) && this.queues[queue].length && !queue_repeat) {
							return new Promise((resolve, reject) => {
								this.queues[queue].push([method, obj, name, params, resolve, reject]);
							});
						} else {
							if (this.queues[queue] == undefined) this.queues[queue] = [];
							if (!queue_repeat) this.queues[queue].push(null);
						}
					}
					
					let prefix = window.base_path_prefix+'/api/';
					if (params == undefined) params = {};
					if (Vue.prototype.$account.profile_id != undefined) params._uid = Vue.prototype.$account.profile_id;
					
					if (Array.isArray(name)) {
						params._endpoints = name;
						name = 'batch';
						method = 'post';
					
						return new Promise((resolve, reject) => {
							$mx.request({url: prefix+name+'.json', method: method, json: params}).then((r) => {
								if (r.data.result == 'fail' && r.data.redirect != undefined) return router.replace(r.data.redirect);
								
								let result = {result: 'success', response: {}};
								
								_.each(r.data.batch, (f) => {
									result.response = _.merge(result.response, f.response, true);
								});
								
								this.checkResult(result, obj, queue)
								resolve(result);
							}).catch(reject);
						});
					} else {
						return new Promise((resolve, reject) => {
							$mx.request({url: prefix+name+'.json', method: method, json: params}).then((r) => {
								if (r.data.result == 'fail' && r.data.redirect != undefined) return router.replace(r.data.redirect);
								this.checkResult(r.data, obj, queue)
								resolve(r.data);
							}).catch(reject);
						});
					}
				},
			}
			
			var tmpVm = new Vue({ data : { account: {} } });
			Vue.prototype.$account = tmpVm.account;
			
			Vue.prototype.$auth = {
				
				getMenu(module) {
					return App.modules[module];
				},
				
				// Фильтрует меню проверяя access и tariff
				prepareMenu(children) {
					return _.filter(children, (m) => {
						if (m.meta != undefined && m.meta.tariff != undefined && Vue.prototype.$account.platform.tariffs.indexOf(m.meta.tariff) == -1) return null;
						if (m.meta != undefined && m.meta.access != undefined && (m.meta.access & Vue.prototype.$account.access) != m.meta.access) return null;
						if (m.meta != undefined && m.meta.feature != undefined && !this.hasFeature(m.meta.feature)) return null;
						if (m.meta != undefined && m.meta.endpoint != undefined && !Vue.prototype.$auth.isAllowEndpoint(m.meta.endpoint)) return null;
						return m;
					});
				},
				
				isAllowEndpoint(endpoint) {
					endpoint = endpoint.split('/');
					let p = window.$app.endpoints;
					for (var i = 0; i < endpoint.length-1; i++) {
						if (p[endpoint[i]] == undefined) return false;
						p = p[endpoint[i]];
					}
					
					return Object.values(p).indexOf(endpoint[endpoint.length - 1]) != -1;
// 					return _.find(p, (v) => v == endpoint[endpoint.length - 1]);
				},
				
				isAllowTariff(tariff) {
					let tariffs = ['basic', 'plus', 'pro', 'business'];
					return tariffs.indexOf(Vue.prototype.$account.tariff) >= tariffs.indexOf(tariff);
				},
				
				hasFeature(feature) {
					let result = true;
					_.each(feature.split(','), f => { result &= Vue.prototype.$account.features.indexOf(f) != -1; })
					return result;
				},
	
				
				refresh(account, cb, cb_fail) {
					let func = (r, cb) => {
						r.currency = Object.assign(_.clone(r.number), r.currency);
						r.weight = Object.assign(_.clone(r.number), r.weight);
	
						_.each(r, (v, k) => {
							Vue.prototype.$set(Vue.prototype.$account, k, v);
						})
	
	//					Vue.prototype.$account = Vue.observable(r);
	//					Vue.prototype.$account = Object.assign({}, Vue.prototype.$account, r);//tmpVm.account;
	/*
						
						var tmpVm = new Vue({data: {account: data.response}, router: router});
						Vue.prototype.$account = tmpVm.account;
	*/
						Vue.prototype.$auth.refreshStyles(() => {
							Vue.prototype.$forceUpdate();
							window.$events.fire('account:refresh', r);
							if (cb) cb();
						});
						
						Vue.prototype.$io.auth();
					}
					
					if (account) {
						func(account, cb);
					} else {
						Vue.prototype.$api.get('account/get').then((data) => {
							if (data.result == 'success') {
								func(data.response, cb);
							} else {
								cb_fail();
								window.$events.fire('account:logout');
							}
						});
					}
					
				},
				
				changeProfile(profile_id, cb) {
					Vue.prototype.$api.get('account/change', {profile_id: profile_id}).then((data) => {
						if (data.result == 'success') {
							Vue.prototype.$auth.refresh(data.response, () => {
	/*
								if (window.standalone)
								{
									document.location.href = '/profile/';
								}
								else
								{
									router.replace({name: 'pages', params: {page_id: data.response.page_id}});
								}
	*/
								router.replace({name: 'pages', params: {page_id: data.response.page_id}});
	// 							router.replace({name: router.currentRoute.name, params: {page_id: data.response.page_id}});
							});
							
							if (cb != undefined) cb();
	
							Vue.prototype.$auth.closeMenu();
							//Vue.prototype.$io.auth();
						}
					});
				},
				
				closeMenu() {
					window.$events.fire('menu:close');
// 					console.log('close');
// 					$('.projects-menu').removeClass('in');
// 					$('html').removeClass('open-menu');
				},
				
				refreshStyles(cb) {
					Vue.prototype.$account.styles = buildStyles(Vue.prototype.$account.theme, 'design');
					Vue.prototype.$events.fire('theme:refresh');
					if (cb != undefined) cb();
				}
			}
			
			Vue.prototype.$alert = (text, type) => {
				return new Promise((resolve, reject) => {
					Vue.prototype.$buefy.dialog.alert({
						message: text,
	                    confirmText: Vue.prototype.$gettext('Ok'),
	                    type: type,
	                    hasIcon: true,
	                    onConfirm: resolve
					});
				});
			}
			
			Vue.prototype.$confirm = (text, type = 'is-primary', options) => {
				options = _.merge({yes: 'Ok', no: 'Отмена'}, options);
				return new Promise((resolve, reject) => {
					Vue.prototype.$buefy.dialog.confirm({
						message: text,
	                    confirmText: Vue.prototype.$gettext(options.yes),
	                    cancelText: Vue.prototype.$gettext(options.no),
	                    type: type,
	                    hasIcon: true,
	                    onConfirm: resolve
					});
				});
			}
			
			Vue.prototype.$form = (name, props, parent) => {
				window.$app.loadComponent(name).then(() => {
					Vue.prototype.$buefy.modal.open({
		                parent: parent,
		                component: Vue.options.components[name],
		                props: props,
		                width: 'auto',
		                canCancel: ['outside'],
		                hasModalCard: true
					});
				});
			}
			
			Vue.prototype.$events = window.$events;
		}
	}

	var SocketPlugin = {
		install: function (Vue, options) {
			var $io = io();
			$io.connect();	
			
			$io.auth = function () {
				$io.emit('auth', Cookies.get());
			}
			
			$io.on('connect', function() {
				$io.auth();
			});
			
			Vue.prototype.$io = $io;
			
			$io.on('events:account.nickname:changed', (data) => {
				Vue.prototype.$account.nickname = data.nickname;
			});
			
			$io.on('events:account:refresh', (data) => {
				Vue.prototype.$auth.refresh();
			});

			$io.on('events:account:update', (data) => {
				_.each(data, (v, k) => {
					Vue.prototype.$set(Vue.prototype.$account, k, v);
				})
			});
		}
	}

	Vue.use(SocketPlugin);
	Vue.use(RestAPI);

	if (vue_components != undefined) {
		_.each(vue_components, (v, k) => {
			Vue.component(k, v);
		});
	}
	
	if (w.vue_modules != undefined) {
		_.each(vue_modules, (v, k) => {
			window.defineModule(k, v);
		})
	}
	
	Vue.config.ignoredElements = ['mx-item'];
		
	w.vue_options = {
// 		i18n
// 		router: router
	};

}(document, window);

// Trick for mobile height: 100vh
// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

function checkHeightCSS() {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', checkHeightCSS);
checkHeightCSS();
/**
 * @file postscribe
 * @description Asynchronously write javascript, even with document.write.
 * @version v2.0.8
 * @see {@link https://krux.github.io/postscribe}
 * @license MIT
 * @author Derek Brans
 * @copyright 2016 Krux Digital, Inc
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["postscribe"] = factory();
	else
		root["postscribe"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _postscribe = __webpack_require__(1);
	
	var _postscribe2 = _interopRequireDefault(_postscribe);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	module.exports = _postscribe2['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports['default'] = postscribe;
	
	var _writeStream = __webpack_require__(2);
	
	var _writeStream2 = _interopRequireDefault(_writeStream);
	
	var _utils = __webpack_require__(4);
	
	var utils = _interopRequireWildcard(_utils);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	/**
	 * A function that intentionally does nothing.
	 */
	function doNothing() {}
	
	/**
	 * Available options and defaults.
	 *
	 * @type {Object}
	 */
	var OPTIONS = {
	  /**
	   * Called when an async script has loaded.
	   */
	  afterAsync: doNothing,
	
	  /**
	   * Called immediately before removing from the write queue.
	   */
	  afterDequeue: doNothing,
	
	  /**
	   * Called sync after a stream's first thread release.
	   */
	  afterStreamStart: doNothing,
	
	  /**
	   * Called after writing buffered document.write calls.
	   */
	  afterWrite: doNothing,
	
	  /**
	   * Allows disabling the autoFix feature of prescribe
	   */
	  autoFix: true,
	
	  /**
	   * Called immediately before adding to the write queue.
	   */
	  beforeEnqueue: doNothing,
	
	  /**
	   * Called before writing a token.
	   *
	   * @param {Object} tok The token
	   */
	  beforeWriteToken: function beforeWriteToken(tok) {
	    return tok;
	  },
	
	  /**
	   * Called before writing buffered document.write calls.
	   *
	   * @param {String} str The string
	   */
	  beforeWrite: function beforeWrite(str) {
	    return str;
	  },
	
	  /**
	   * Called when evaluation is finished.
	   */
	  done: doNothing,
	
	  /**
	   * Called when a write results in an error.
	   *
	   * @param {Error} e The error
	   */
	  error: function error(e) {
	    throw new Error(e.msg);
	  },
	
	
	  /**
	   * Whether to let scripts w/ async attribute set fall out of the queue.
	   */
	  releaseAsync: false
	};
	
	var nextId = 0;
	var queue = [];
	var active = null;
	
	function nextStream() {
	  var args = queue.shift();
	  if (args) {
	    var options = utils.last(args);
	
	    options.afterDequeue();
	    args.stream = runStream.apply(undefined, args);
	    options.afterStreamStart();
	  }
	}
	
	function runStream(el, html, options) {
	  active = new _writeStream2['default'](el, options);
	
	  // Identify this stream.
	  active.id = nextId++;
	  active.name = options.name || active.id;
	  postscribe.streams[active.name] = active;
	
	  // Override document.write.
	  var doc = el.ownerDocument;
	
	  var stash = {
	    close: doc.close,
	    open: doc.open,
	    write: doc.write,
	    writeln: doc.writeln
	  };
	
	  function _write(str) {
	    str = options.beforeWrite(str);
	    active.write(str);
	    options.afterWrite(str);
	  }
	
	  _extends(doc, {
	    close: doNothing,
	    open: doNothing,
	    write: function write() {
	      for (var _len = arguments.length, str = Array(_len), _key = 0; _key < _len; _key++) {
	        str[_key] = arguments[_key];
	      }
	
	      return _write(str.join(''));
	    },
	    writeln: function writeln() {
	      for (var _len2 = arguments.length, str = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        str[_key2] = arguments[_key2];
	      }
	
	      return _write(str.join('') + '\n');
	    }
	  });
	
	  // Override window.onerror
	  var oldOnError = active.win.onerror || doNothing;
	
	  // This works together with the try/catch around WriteStream::insertScript
	  // In modern browsers, exceptions in tag scripts go directly to top level
	  active.win.onerror = function (msg, url, line) {
	    options.error({ msg: msg + ' - ' + url + ': ' + line });
	    oldOnError.apply(active.win, [msg, url, line]);
	  };
	
	  // Write to the stream
	  active.write(html, function () {
	    // restore document.write
	    _extends(doc, stash);
	
	    // restore window.onerror
	    active.win.onerror = oldOnError;
	
	    options.done();
	    active = null;
	    nextStream();
	  });
	
	  return active;
	}
	
	function postscribe(el, html, options) {
	  if (utils.isFunction(options)) {
	    options = { done: options };
	  } else if (options === 'clear') {
	    queue = [];
	    active = null;
	    nextId = 0;
	    return;
	  }
	
	  options = utils.defaults(options, OPTIONS);
	
	  // id selector
	  if (/^#/.test(el)) {
	    el = window.document.getElementById(el.substr(1));
	  } else {
	    el = el.jquery ? el[0] : el;
	  }
	
	  var args = [el, html, options];
	
	  el.postscribe = {
	    cancel: function cancel() {
	      if (args.stream) {
	        args.stream.abort();
	      } else {
	        args[1] = doNothing;
	      }
	    }
	  };
	
	  options.beforeEnqueue(args);
	  queue.push(args);
	
	  if (!active) {
	    nextStream();
	  }
	
	  return el.postscribe;
	}
	
	_extends(postscribe, {
	  // Streams by name.
	  streams: {},
	  // Queue of streams.
	  queue: queue,
	  // Expose internal classes.
	  WriteStream: _writeStream2['default']
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _prescribe = __webpack_require__(3);
	
	var _prescribe2 = _interopRequireDefault(_prescribe);
	
	var _utils = __webpack_require__(4);
	
	var utils = _interopRequireWildcard(_utils);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Turn on to debug how each chunk affected the DOM.
	 * @type {boolean}
	 */
	var DEBUG_CHUNK = false;
	
	/**
	 * Prefix for data attributes on DOM elements.
	 * @type {string}
	 */
	var BASEATTR = 'data-ps-';
	
	/**
	 * ID for the style proxy
	 * @type {string}
	 */
	var PROXY_STYLE = 'ps-style';
	
	/**
	 * ID for the script proxy
	 * @type {string}
	 */
	var PROXY_SCRIPT = 'ps-script';
	
	/**
	 * Get data attributes
	 *
	 * @param {Object} el The DOM element.
	 * @param {String} name The attribute name.
	 * @returns {String}
	 */
	function getData(el, name) {
	  var attr = BASEATTR + name;
	
	  var val = el.getAttribute(attr);
	
	  // IE 8 returns a number if it's a number
	  return !utils.existy(val) ? val : String(val);
	}
	
	/**
	 * Set data attributes
	 *
	 * @param {Object} el The DOM element.
	 * @param {String} name The attribute name.
	 * @param {null|*} value The attribute value.
	 */
	function setData(el, name) {
	  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	
	  var attr = BASEATTR + name;
	
	  if (utils.existy(value) && value !== '') {
	    el.setAttribute(attr, value);
	  } else {
	    el.removeAttribute(attr);
	  }
	}
	
	/**
	 * Stream static html to an element, where "static html" denotes "html
	 * without scripts".
	 *
	 * This class maintains a *history of writes devoid of any attributes* or
	 * "proxy history".
	 *
	 * Injecting the proxy history into a temporary div has no side-effects,
	 * other than to create proxy elements for previously written elements.
	 *
	 * Given the `staticHtml` of a new write, a `tempDiv`'s innerHTML is set to
	 * `proxy_history + staticHtml`.
	 * The *structure* of `tempDiv`'s contents, (i.e., the placement of new nodes
	 * beside or inside of proxy elements), reflects the DOM structure that would
	 * have resulted if all writes had been squashed into a single write.
	 *
	 * For each descendent `node` of `tempDiv` whose parentNode is a *proxy*,
	 * `node` is appended to the corresponding *real* element within the DOM.
	 *
	 * Proxy elements are mapped to *actual* elements in the DOM by injecting a
	 * `data-id` attribute into each start tag in `staticHtml`.
	 *
	 */
	
	var WriteStream = function () {
	  /**
	   * Constructor.
	   *
	   * @param {Object} root The root element
	   * @param {?Object} options The options
	   */
	  function WriteStream(root) {
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	    _classCallCheck(this, WriteStream);
	
	    this.root = root;
	    this.options = options;
	    this.doc = root.ownerDocument;
	    this.win = this.doc.defaultView || this.doc.parentWindow;
	    this.parser = new _prescribe2['default']('', { autoFix: options.autoFix });
	
	    // Actual elements by id.
	    this.actuals = [root];
	
	    // Embodies the "structure" of what's been written so far,
	    // devoid of attributes.
	    this.proxyHistory = '';
	
	    // Create a proxy of the root element.
	    this.proxyRoot = this.doc.createElement(root.nodeName);
	
	    this.scriptStack = [];
	    this.writeQueue = [];
	
	    setData(this.proxyRoot, 'proxyof', 0);
	  }
	
	  /**
	   * Writes the given strings.
	   *
	   * @param {...String} str The strings to write
	   */
	
	
	  WriteStream.prototype.write = function write() {
	    var _writeQueue;
	
	    (_writeQueue = this.writeQueue).push.apply(_writeQueue, arguments);
	
	    // Process writes
	    // When new script gets pushed or pending this will stop
	    // because new writeQueue gets pushed
	    while (!this.deferredRemote && this.writeQueue.length) {
	      var arg = this.writeQueue.shift();
	
	      if (utils.isFunction(arg)) {
	        this._callFunction(arg);
	      } else {
	        this._writeImpl(arg);
	      }
	    }
	  };
	
	  /**
	   * Calls the given function.
	   *
	   * @param {Function} fn The function to call
	   * @private
	   */
	
	
	  WriteStream.prototype._callFunction = function _callFunction(fn) {
	    var tok = { type: 'function', value: fn.name || fn.toString() };
	    this._onScriptStart(tok);
	    fn.call(this.win, this.doc);
	    this._onScriptDone(tok);
	  };
	
	  /**
	   * The write implementation
	   *
	   * @param {String} html The HTML to write.
	   * @private
	   */
	
	
	  WriteStream.prototype._writeImpl = function _writeImpl(html) {
	    this.parser.append(html);
	
	    var tok = void 0;
	    var script = void 0;
	    var style = void 0;
	    var tokens = [];
	
	    // stop if we see a script token
	    while ((tok = this.parser.readToken()) && !(script = utils.isScript(tok)) && !(style = utils.isStyle(tok))) {
	      tok = this.options.beforeWriteToken(tok);
	
	      if (tok) {
	        tokens.push(tok);
	      }
	    }
	
	    if (tokens.length > 0) {
	      this._writeStaticTokens(tokens);
	    }
	
	    if (script) {
	      this._handleScriptToken(tok);
	    }
	
	    if (style) {
	      this._handleStyleToken(tok);
	    }
	  };
	
	  /**
	   * Write contiguous non-script tokens (a chunk)
	   *
	   * @param {Array<Object>} tokens The tokens
	   * @returns {{tokens, raw, actual, proxy}|null}
	   * @private
	   */
	
	
	  WriteStream.prototype._writeStaticTokens = function _writeStaticTokens(tokens) {
	    var chunk = this._buildChunk(tokens);
	
	    if (!chunk.actual) {
	      // e.g., no tokens, or a noscript that got ignored
	      return null;
	    }
	
	    chunk.html = this.proxyHistory + chunk.actual;
	    this.proxyHistory += chunk.proxy;
	    this.proxyRoot.innerHTML = chunk.html;
	
	    if (DEBUG_CHUNK) {
	      chunk.proxyInnerHTML = this.proxyRoot.innerHTML;
	    }
	
	    this._walkChunk();
	
	    if (DEBUG_CHUNK) {
	      chunk.actualInnerHTML = this.root.innerHTML;
	    }
	
	    return chunk;
	  };
	
	  /**
	   * Build a chunk.
	   *
	   * @param {Array<Object>} tokens The tokens to use.
	   * @returns {{tokens: *, raw: string, actual: string, proxy: string}}
	   * @private
	   */
	
	
	  WriteStream.prototype._buildChunk = function _buildChunk(tokens) {
	    var nextId = this.actuals.length;
	
	    // The raw html of this chunk.
	    var raw = [];
	
	    // The html to create the nodes in the tokens (with id's injected).
	    var actual = [];
	
	    // Html that can later be used to proxy the nodes in the tokens.
	    var proxy = [];
	
	    var len = tokens.length;
	    for (var i = 0; i < len; i++) {
	      var tok = tokens[i];
	      var tokenRaw = tok.toString();
	
	      raw.push(tokenRaw);
	
	      if (tok.attrs) {
	        // tok.attrs <==> startTag or atomicTag or cursor
	        // Ignore noscript tags. They are atomic, so we don't have to worry about children.
	        if (!/^noscript$/i.test(tok.tagName)) {
	          var id = nextId++;
	
	          // Actual: inject id attribute: replace '>' at end of start tag with id attribute + '>'
	          actual.push(tokenRaw.replace(/(\/?>)/, ' ' + BASEATTR + 'id=' + id + ' $1'));
	
	          // Don't proxy scripts: they have no bearing on DOM structure.
	          if (tok.attrs.id !== PROXY_SCRIPT && tok.attrs.id !== PROXY_STYLE) {
	            // Proxy: strip all attributes and inject proxyof attribute
	            proxy.push(
	            // ignore atomic tags (e.g., style): they have no "structural" effect
	            tok.type === 'atomicTag' ? '' : '<' + tok.tagName + ' ' + BASEATTR + 'proxyof=' + id + (tok.unary ? ' />' : '>'));
	          }
	        }
	      } else {
	        // Visit any other type of token
	        // Actual: append.
	        actual.push(tokenRaw);
	
	        // Proxy: append endTags. Ignore everything else.
	        proxy.push(tok.type === 'endTag' ? tokenRaw : '');
	      }
	    }
	
	    return {
	      tokens: tokens,
	      raw: raw.join(''),
	      actual: actual.join(''),
	      proxy: proxy.join('')
	    };
	  };
	
	  /**
	   * Walk the chunks.
	   *
	   * @private
	   */
	
	
	  WriteStream.prototype._walkChunk = function _walkChunk() {
	    var node = void 0;
	    var stack = [this.proxyRoot];
	
	    // use shift/unshift so that children are walked in document order
	    while (utils.existy(node = stack.shift())) {
	      var isElement = node.nodeType === 1;
	      var isProxy = isElement && getData(node, 'proxyof');
	
	      // Ignore proxies
	      if (!isProxy) {
	        if (isElement) {
	          // New actual element: register it and remove the the id attr.
	          this.actuals[getData(node, 'id')] = node;
	          setData(node, 'id');
	        }
	
	        // Is node's parent a proxy?
	        var parentIsProxyOf = node.parentNode && getData(node.parentNode, 'proxyof');
	        if (parentIsProxyOf) {
	          // Move node under actual parent.
	          this.actuals[parentIsProxyOf].appendChild(node);
	        }
	      }
	
	      // prepend childNodes to stack
	      stack.unshift.apply(stack, utils.toArray(node.childNodes));
	    }
	  };
	
	  /**
	   * Handles Script tokens
	   *
	   * @param {Object} tok The token
	   */
	
	
	  WriteStream.prototype._handleScriptToken = function _handleScriptToken(tok) {
	    var _this = this;
	
	    var remainder = this.parser.clear();
	
	    if (remainder) {
	      // Write remainder immediately behind this script.
	      this.writeQueue.unshift(remainder);
	    }
	
	    tok.src = tok.attrs.src || tok.attrs.SRC;
	
	    tok = this.options.beforeWriteToken(tok);
	    if (!tok) {
	      // User has removed this token
	      return;
	    }
	
	    if (tok.src && this.scriptStack.length) {
	      // Defer this script until scriptStack is empty.
	      // Assumption 1: This script will not start executing until
	      // scriptStack is empty.
	      this.deferredRemote = tok;
	    } else {
	      this._onScriptStart(tok);
	    }
	
	    // Put the script node in the DOM.
	    this._writeScriptToken(tok, function () {
	      _this._onScriptDone(tok);
	    });
	  };
	
	  /**
	   * Handles style tokens
	   *
	   * @param {Object} tok The token
	   */
	
	
	  WriteStream.prototype._handleStyleToken = function _handleStyleToken(tok) {
	    var remainder = this.parser.clear();
	
	    if (remainder) {
	      // Write remainder immediately behind this style.
	      this.writeQueue.unshift(remainder);
	    }
	
	    tok.type = tok.attrs.type || tok.attrs.TYPE || 'text/css';
	
	    tok = this.options.beforeWriteToken(tok);
	
	    if (tok) {
	      // Put the style node in the DOM.
	      this._writeStyleToken(tok);
	    }
	
	    if (remainder) {
	      this.write();
	    }
	  };
	
	  /**
	   * Build a style and insert it into the DOM.
	   *
	   * @param {Object} tok The token
	   */
	
	
	  WriteStream.prototype._writeStyleToken = function _writeStyleToken(tok) {
	    var el = this._buildStyle(tok);
	
	    this._insertCursor(el, PROXY_STYLE);
	
	    // Set content
	    if (tok.content) {
	      if (el.styleSheet && !el.sheet) {
	        el.styleSheet.cssText = tok.content;
	      } else {
	        el.appendChild(this.doc.createTextNode(tok.content));
	      }
	    }
	  };
	
	  /**
	   * Build a style element from an atomic style token.
	   *
	   * @param {Object} tok The token
	   * @returns {Element}
	   */
	
	
	  WriteStream.prototype._buildStyle = function _buildStyle(tok) {
	    var el = this.doc.createElement(tok.tagName);
	
	    el.setAttribute('type', tok.type);
	
	    // Set attributes
	    utils.eachKey(tok.attrs, function (name, value) {
	      el.setAttribute(name, value);
	    });
	
	    return el;
	  };
	
	  /**
	   * Append a span to the stream. That span will act as a cursor
	   * (i.e. insertion point) for the element.
	   *
	   * @param {Object} el The element
	   * @param {string} which The type of proxy element
	   */
	
	
	  WriteStream.prototype._insertCursor = function _insertCursor(el, which) {
	    this._writeImpl('<span id="' + which + '"/>');
	
	    var cursor = this.doc.getElementById(which);
	
	    if (cursor) {
	      cursor.parentNode.replaceChild(el, cursor);
	    }
	  };
	
	  /**
	   * Called when a script is started.
	   *
	   * @param {Object} tok The token
	   * @private
	   */
	
	
	  WriteStream.prototype._onScriptStart = function _onScriptStart(tok) {
	    tok.outerWrites = this.writeQueue;
	    this.writeQueue = [];
	    this.scriptStack.unshift(tok);
	  };
	
	  /**
	   * Called when a script is done.
	   *
	   * @param {Object} tok The token
	   * @private
	   */
	
	
	  WriteStream.prototype._onScriptDone = function _onScriptDone(tok) {
	    // Pop script and check nesting.
	    if (tok !== this.scriptStack[0]) {
	      this.options.error({ msg: 'Bad script nesting or script finished twice' });
	      return;
	    }
	
	    this.scriptStack.shift();
	
	    // Append outer writes to queue and process them.
	    this.write.apply(this, tok.outerWrites);
	
	    // Check for pending remote
	
	    // Assumption 2: if remote_script1 writes remote_script2 then
	    // the we notice remote_script1 finishes before remote_script2 starts.
	    // I think this is equivalent to assumption 1
	    if (!this.scriptStack.length && this.deferredRemote) {
	      this._onScriptStart(this.deferredRemote);
	      this.deferredRemote = null;
	    }
	  };
	
	  /**
	   * Build a script and insert it into the DOM.
	   * Done is called once script has executed.
	   *
	   * @param {Object} tok The token
	   * @param {Function} done The callback when complete
	   */
	
	
	  WriteStream.prototype._writeScriptToken = function _writeScriptToken(tok, done) {
	    var el = this._buildScript(tok);
	    var asyncRelease = this._shouldRelease(el);
	    var afterAsync = this.options.afterAsync;
	
	    if (tok.src) {
	      // Fix for attribute "SRC" (capitalized). IE does not recognize it.
	      el.src = tok.src;
	      this._scriptLoadHandler(el, !asyncRelease ? function () {
	        done();
	        afterAsync();
	      } : afterAsync);
	    }
	
	    try {
	      this._insertCursor(el, PROXY_SCRIPT);
	      if (!el.src || asyncRelease) {
	        done();
	      }
	    } catch (e) {
	      this.options.error(e);
	      done();
	    }
	  };
	
	  /**
	   * Build a script element from an atomic script token.
	   *
	   * @param {Object} tok The token
	   * @returns {Element}
	   */
	
	
	  WriteStream.prototype._buildScript = function _buildScript(tok) {
	    var el = this.doc.createElement(tok.tagName);
	
	    // Set attributes
	    utils.eachKey(tok.attrs, function (name, value) {
	      el.setAttribute(name, value);
	    });
	
	    // Set content
	    if (tok.content) {
	      el.text = tok.content;
	    }
	
	    return el;
	  };
	
	  /**
	   * Setup the script load handler on an element.
	   *
	   * @param {Object} el The element
	   * @param {Function} done The callback
	   * @private
	   */
	
	
	  WriteStream.prototype._scriptLoadHandler = function _scriptLoadHandler(el, done) {
	    function cleanup() {
	      el = el.onload = el.onreadystatechange = el.onerror = null;
	    }
	
	    var error = this.options.error;
	
	    function success() {
	      cleanup();
	      if (done != null) {
	        done();
	      }
	      done = null;
	    }
	
	    function failure(err) {
	      cleanup();
	      error(err);
	      if (done != null) {
	        done();
	      }
	      done = null;
	    }
	
	    function reattachEventListener(el, evt) {
	      var handler = el['on' + evt];
	      if (handler != null) {
	        el['_on' + evt] = handler;
	      }
	    }
	
	    reattachEventListener(el, 'load');
	    reattachEventListener(el, 'error');
	
	    _extends(el, {
	      onload: function onload() {
	        if (el._onload) {
	          try {
	            el._onload.apply(this, Array.prototype.slice.call(arguments, 0));
	          } catch (err) {
	            failure({ msg: 'onload handler failed ' + err + ' @ ' + el.src });
	          }
	        }
	        success();
	      },
	      onerror: function onerror() {
	        if (el._onerror) {
	          try {
	            el._onerror.apply(this, Array.prototype.slice.call(arguments, 0));
	          } catch (err) {
	            failure({ msg: 'onerror handler failed ' + err + ' @ ' + el.src });
	            return;
	          }
	        }
	        failure({ msg: 'remote script failed ' + el.src });
	      },
	      onreadystatechange: function onreadystatechange() {
	        if (/^(loaded|complete)$/.test(el.readyState)) {
	          success();
	        }
	      }
	    });
	  };
	
	  /**
	   * Determines whether to release.
	   *
	   * @param {Object} el The element
	   * @returns {boolean}
	   * @private
	   */
	
	
	  WriteStream.prototype._shouldRelease = function _shouldRelease(el) {
	    var isScript = /^script$/i.test(el.nodeName);
	    return !isScript || !!(this.options.releaseAsync && el.src && el.hasAttribute('async'));
	  };
	
	  return WriteStream;
	}();
	
	exports['default'] = WriteStream;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file prescribe
	 * @description Tiny, forgiving HTML parser
	 * @version vundefined
	 * @see {@link https://github.com/krux/prescribe/}
	 * @license MIT
	 * @author Derek Brans
	 * @copyright 2016 Krux Digital, Inc
	 */
	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else if(typeof exports === 'object')
			exports["Prescribe"] = factory();
		else
			root["Prescribe"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	
	
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		var _HtmlParser = __webpack_require__(1);
	
		var _HtmlParser2 = _interopRequireDefault(_HtmlParser);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
		module.exports = _HtmlParser2['default'];
	
	/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		exports.__esModule = true;
	
		var _supports = __webpack_require__(2);
	
		var supports = _interopRequireWildcard(_supports);
	
		var _streamReaders = __webpack_require__(3);
	
		var streamReaders = _interopRequireWildcard(_streamReaders);
	
		var _fixedReadTokenFactory = __webpack_require__(6);
	
		var _fixedReadTokenFactory2 = _interopRequireDefault(_fixedReadTokenFactory);
	
		var _utils = __webpack_require__(5);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
		function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		/**
		 * Detection regular expressions.
		 *
		 * Order of detection matters: detection of one can only
		 * succeed if detection of previous didn't
	
		 * @type {Object}
		 */
		var detect = {
		  comment: /^<!--/,
		  endTag: /^<\//,
		  atomicTag: /^<\s*(script|style|noscript|iframe|textarea)[\s\/>]/i,
		  startTag: /^</,
		  chars: /^[^<]/
		};
	
		/**
		 * HtmlParser provides the capability to parse HTML and return tokens
		 * representing the tags and content.
		 */
	
		var HtmlParser = function () {
		  /**
		   * Constructor.
		   *
		   * @param {string} stream The initial parse stream contents.
		   * @param {Object} options The options
		   * @param {boolean} options.autoFix Set to true to automatically fix errors
		   */
		  function HtmlParser() {
		    var _this = this;
	
		    var stream = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
		    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
		    _classCallCheck(this, HtmlParser);
	
		    this.stream = stream;
	
		    var fix = false;
		    var fixedTokenOptions = {};
	
		    for (var key in supports) {
		      if (supports.hasOwnProperty(key)) {
		        if (options.autoFix) {
		          fixedTokenOptions[key + 'Fix'] = true; // !supports[key];
		        }
		        fix = fix || fixedTokenOptions[key + 'Fix'];
		      }
		    }
	
		    if (fix) {
		      this._readToken = (0, _fixedReadTokenFactory2['default'])(this, fixedTokenOptions, function () {
		        return _this._readTokenImpl();
		      });
		      this._peekToken = (0, _fixedReadTokenFactory2['default'])(this, fixedTokenOptions, function () {
		        return _this._peekTokenImpl();
		      });
		    } else {
		      this._readToken = this._readTokenImpl;
		      this._peekToken = this._peekTokenImpl;
		    }
		  }
	
		  /**
		   * Appends the given string to the parse stream.
		   *
		   * @param {string} str The string to append
		   */
	
	
		  HtmlParser.prototype.append = function append(str) {
		    this.stream += str;
		  };
	
		  /**
		   * Prepends the given string to the parse stream.
		   *
		   * @param {string} str The string to prepend
		   */
	
	
		  HtmlParser.prototype.prepend = function prepend(str) {
		    this.stream = str + this.stream;
		  };
	
		  /**
		   * The implementation of the token reading.
		   *
		   * @private
		   * @returns {?Token}
		   */
	
	
		  HtmlParser.prototype._readTokenImpl = function _readTokenImpl() {
		    var token = this._peekTokenImpl();
		    if (token) {
		      this.stream = this.stream.slice(token.length);
		      return token;
		    }
		  };
	
		  /**
		   * The implementation of token peeking.
		   *
		   * @returns {?Token}
		   */
	
	
		  HtmlParser.prototype._peekTokenImpl = function _peekTokenImpl() {
		    for (var type in detect) {
		      if (detect.hasOwnProperty(type)) {
		        if (detect[type].test(this.stream)) {
		          var token = streamReaders[type](this.stream);
	
		          if (token) {
		            if (token.type === 'startTag' && /script|style/i.test(token.tagName)) {
		              return null;
		            } else {
		              token.text = this.stream.substr(0, token.length);
		              return token;
		            }
		          }
		        }
		      }
		    }
		  };
	
		  /**
		   * The public token peeking interface.  Delegates to the basic token peeking
		   * or a version that performs fixups depending on the `autoFix` setting in
		   * options.
		   *
		   * @returns {object}
		   */
	
	
		  HtmlParser.prototype.peekToken = function peekToken() {
		    return this._peekToken();
		  };
	
		  /**
		   * The public token reading interface.  Delegates to the basic token reading
		   * or a version that performs fixups depending on the `autoFix` setting in
		   * options.
		   *
		   * @returns {object}
		   */
	
	
		  HtmlParser.prototype.readToken = function readToken() {
		    return this._readToken();
		  };
	
		  /**
		   * Read tokens and hand to the given handlers.
		   *
		   * @param {Object} handlers The handlers to use for the different tokens.
		   */
	
	
		  HtmlParser.prototype.readTokens = function readTokens(handlers) {
		    var tok = void 0;
		    while (tok = this.readToken()) {
		      // continue until we get an explicit "false" return
		      if (handlers[tok.type] && handlers[tok.type](tok) === false) {
		        return;
		      }
		    }
		  };
	
		  /**
		   * Clears the parse stream.
		   *
		   * @returns {string} The contents of the parse stream before clearing.
		   */
	
	
		  HtmlParser.prototype.clear = function clear() {
		    var rest = this.stream;
		    this.stream = '';
		    return rest;
		  };
	
		  /**
		   * Returns the rest of the parse stream.
		   *
		   * @returns {string} The contents of the parse stream.
		   */
	
	
		  HtmlParser.prototype.rest = function rest() {
		    return this.stream;
		  };
	
		  return HtmlParser;
		}();
	
		exports['default'] = HtmlParser;
	
	
		HtmlParser.tokenToString = function (tok) {
		  return tok.toString();
		};
	
		HtmlParser.escapeAttributes = function (attrs) {
		  var escapedAttrs = {};
	
		  for (var name in attrs) {
		    if (attrs.hasOwnProperty(name)) {
		      escapedAttrs[name] = (0, _utils.escapeQuotes)(attrs[name], null);
		    }
		  }
	
		  return escapedAttrs;
		};
	
		HtmlParser.supports = supports;
	
		for (var key in supports) {
		  if (supports.hasOwnProperty(key)) {
		    HtmlParser.browserHasFlaw = HtmlParser.browserHasFlaw || !supports[key] && key;
		  }
		}
	
	/***/ },
	/* 2 */
	/***/ function(module, exports) {
	
		'use strict';
	
		exports.__esModule = true;
		var tagSoup = false;
		var selfClose = false;
	
		var work = window.document.createElement('div');
	
		try {
		  var html = '<P><I></P></I>';
		  work.innerHTML = html;
		  exports.tagSoup = tagSoup = work.innerHTML !== html;
		} catch (e) {
		  exports.tagSoup = tagSoup = false;
		}
	
		try {
		  work.innerHTML = '<P><i><P></P></i></P>';
		  exports.selfClose = selfClose = work.childNodes.length === 2;
		} catch (e) {
		  exports.selfClose = selfClose = false;
		}
	
		work = null;
	
		exports.tagSoup = tagSoup;
		exports.selfClose = selfClose;
	
	/***/ },
	/* 3 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		exports.__esModule = true;
	
		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
		exports.comment = comment;
		exports.chars = chars;
		exports.startTag = startTag;
		exports.atomicTag = atomicTag;
		exports.endTag = endTag;
	
		var _tokens = __webpack_require__(4);
	
		/**
		 * Regular Expressions for parsing tags and attributes
		 *
		 * @type {Object}
		 */
		var REGEXES = {
		  startTag: /^<([\-A-Za-z0-9_]+)((?:\s+[\w\-]+(?:\s*=?\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
		  endTag: /^<\/([\-A-Za-z0-9_]+)[^>]*>/,
		  attr: /(?:([\-A-Za-z0-9_]+)\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))|(?:([\-A-Za-z0-9_]+)(\s|$)+)/g,
		  fillAttr: /^(checked|compact|declare|defer|disabled|ismap|multiple|nohref|noresize|noshade|nowrap|readonly|selected)$/i
		};
	
		/**
		 * Reads a comment token
		 *
		 * @param {string} stream The input stream
		 * @returns {CommentToken}
		 */
		function comment(stream) {
		  var index = stream.indexOf('-->');
		  if (index >= 0) {
		    return new _tokens.CommentToken(stream.substr(4, index - 1), index + 3);
		  }
		}
	
		/**
		 * Reads non-tag characters.
		 *
		 * @param {string} stream The input stream
		 * @returns {CharsToken}
		 */
		function chars(stream) {
		  var index = stream.indexOf('<');
		  return new _tokens.CharsToken(index >= 0 ? index : stream.length);
		}
	
		/**
		 * Reads start tag token.
		 *
		 * @param {string} stream The input stream
		 * @returns {StartTagToken}
		 */
		function startTag(stream) {
		  var endTagIndex = stream.indexOf('>');
		  if (endTagIndex !== -1) {
		    var match = stream.match(REGEXES.startTag);
		    if (match) {
		      var _ret = function () {
		        var attrs = {};
		        var booleanAttrs = {};
		        var rest = match[2];
	
		        match[2].replace(REGEXES.attr, function (match, name) {
		          if (!(arguments[2] || arguments[3] || arguments[4] || arguments[5])) {
		            attrs[name] = '';
		          } else if (arguments[5]) {
		            attrs[arguments[5]] = '';
		            booleanAttrs[arguments[5]] = true;
		          } else {
		            attrs[name] = arguments[2] || arguments[3] || arguments[4] || REGEXES.fillAttr.test(name) && name || '';
		          }
	
		          rest = rest.replace(match, '');
		        });
	
		        return {
		          v: new _tokens.StartTagToken(match[1], match[0].length, attrs, booleanAttrs, !!match[3], rest.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''))
		        };
		      }();
	
		      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
		    }
		  }
		}
	
		/**
		 * Reads atomic tag token.
		 *
		 * @param {string} stream The input stream
		 * @returns {AtomicTagToken}
		 */
		function atomicTag(stream) {
		  var start = startTag(stream);
		  if (start) {
		    var rest = stream.slice(start.length);
		    // for optimization, we check first just for the end tag
		    if (rest.match(new RegExp('<\/\\s*' + start.tagName + '\\s*>', 'i'))) {
		      // capturing the content is inefficient, so we do it inside the if
		      var match = rest.match(new RegExp('([\\s\\S]*?)<\/\\s*' + start.tagName + '\\s*>', 'i'));
		      if (match) {
		        return new _tokens.AtomicTagToken(start.tagName, match[0].length + start.length, start.attrs, start.booleanAttrs, match[1]);
		      }
		    }
		  }
		}
	
		/**
		 * Reads an end tag token.
		 *
		 * @param {string} stream The input stream
		 * @returns {EndTagToken}
		 */
		function endTag(stream) {
		  var match = stream.match(REGEXES.endTag);
		  if (match) {
		    return new _tokens.EndTagToken(match[1], match[0].length);
		  }
		}
	
	/***/ },
	/* 4 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		exports.__esModule = true;
		exports.EndTagToken = exports.AtomicTagToken = exports.StartTagToken = exports.TagToken = exports.CharsToken = exports.CommentToken = exports.Token = undefined;
	
		var _utils = __webpack_require__(5);
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		/**
		 * Token is a base class for all token types parsed.  Note we don't actually
		 * use intheritance due to IE8's non-existent ES5 support.
		 */
		var Token =
		/**
		 * Constructor.
		 *
		 * @param {string} type The type of the Token.
		 * @param {Number} length The length of the Token text.
		 */
		exports.Token = function Token(type, length) {
		  _classCallCheck(this, Token);
	
		  this.type = type;
		  this.length = length;
		  this.text = '';
		};
	
		/**
		 * CommentToken represents comment tags.
		 */
	
	
		var CommentToken = exports.CommentToken = function () {
		  /**
		   * Constructor.
		   *
		   * @param {string} content The content of the comment
		   * @param {Number} length The length of the Token text.
		   */
		  function CommentToken(content, length) {
		    _classCallCheck(this, CommentToken);
	
		    this.type = 'comment';
		    this.length = length || (content ? content.length : 0);
		    this.text = '';
		    this.content = content;
		  }
	
		  CommentToken.prototype.toString = function toString() {
		    return '<!--' + this.content;
		  };
	
		  return CommentToken;
		}();
	
		/**
		 * CharsToken represents non-tag characters.
		 */
	
	
		var CharsToken = exports.CharsToken = function () {
		  /**
		   * Constructor.
		   *
		   * @param {Number} length The length of the Token text.
		   */
		  function CharsToken(length) {
		    _classCallCheck(this, CharsToken);
	
		    this.type = 'chars';
		    this.length = length;
		    this.text = '';
		  }
	
		  CharsToken.prototype.toString = function toString() {
		    return this.text;
		  };
	
		  return CharsToken;
		}();
	
		/**
		 * TagToken is a base class for all tag-based Tokens.
		 */
	
	
		var TagToken = exports.TagToken = function () {
		  /**
		   * Constructor.
		   *
		   * @param {string} type The type of the token.
		   * @param {string} tagName The tag name.
		   * @param {Number} length The length of the Token text.
		   * @param {Object} attrs The dictionary of attributes and values
		   * @param {Object} booleanAttrs If an entry has 'true' then the attribute
		   *                              is a boolean attribute
		   */
		  function TagToken(type, tagName, length, attrs, booleanAttrs) {
		    _classCallCheck(this, TagToken);
	
		    this.type = type;
		    this.length = length;
		    this.text = '';
		    this.tagName = tagName;
		    this.attrs = attrs;
		    this.booleanAttrs = booleanAttrs;
		    this.unary = false;
		    this.html5Unary = false;
		  }
	
		  /**
		   * Formats the given token tag.
		   *
		   * @param {TagToken} tok The TagToken to format.
		   * @param {?string} [content=null] The content of the token.
		   * @returns {string} The formatted tag.
		   */
	
	
		  TagToken.formatTag = function formatTag(tok) {
		    var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	
		    var str = '<' + tok.tagName;
		    for (var key in tok.attrs) {
		      if (tok.attrs.hasOwnProperty(key)) {
		        str += ' ' + key;
	
		        var val = tok.attrs[key];
		        if (typeof tok.booleanAttrs === 'undefined' || typeof tok.booleanAttrs[key] === 'undefined') {
		          str += '="' + (0, _utils.escapeQuotes)(val) + '"';
		        }
		      }
		    }
	
		    if (tok.rest) {
		      str += ' ' + tok.rest;
		    }
	
		    if (tok.unary && !tok.html5Unary) {
		      str += '/>';
		    } else {
		      str += '>';
		    }
	
		    if (content !== undefined && content !== null) {
		      str += content + '</' + tok.tagName + '>';
		    }
	
		    return str;
		  };
	
		  return TagToken;
		}();
	
		/**
		 * StartTagToken represents a start token.
		 */
	
	
		var StartTagToken = exports.StartTagToken = function () {
		  /**
		   * Constructor.
		   *
		   * @param {string} tagName The tag name.
		   * @param {Number} length The length of the Token text
		   * @param {Object} attrs The dictionary of attributes and values
		   * @param {Object} booleanAttrs If an entry has 'true' then the attribute
		   *                              is a boolean attribute
		   * @param {boolean} unary True if the tag is a unary tag
		   * @param {string} rest The rest of the content.
		   */
		  function StartTagToken(tagName, length, attrs, booleanAttrs, unary, rest) {
		    _classCallCheck(this, StartTagToken);
	
		    this.type = 'startTag';
		    this.length = length;
		    this.text = '';
		    this.tagName = tagName;
		    this.attrs = attrs;
		    this.booleanAttrs = booleanAttrs;
		    this.html5Unary = false;
		    this.unary = unary;
		    this.rest = rest;
		  }
	
		  StartTagToken.prototype.toString = function toString() {
		    return TagToken.formatTag(this);
		  };
	
		  return StartTagToken;
		}();
	
		/**
		 * AtomicTagToken represents an atomic tag.
		 */
	
	
		var AtomicTagToken = exports.AtomicTagToken = function () {
		  /**
		   * Constructor.
		   *
		   * @param {string} tagName The name of the tag.
		   * @param {Number} length The length of the tag text.
		   * @param {Object} attrs The attributes.
		   * @param {Object} booleanAttrs If an entry has 'true' then the attribute
		   *                              is a boolean attribute
		   * @param {string} content The content of the tag.
		   */
		  function AtomicTagToken(tagName, length, attrs, booleanAttrs, content) {
		    _classCallCheck(this, AtomicTagToken);
	
		    this.type = 'atomicTag';
		    this.length = length;
		    this.text = '';
		    this.tagName = tagName;
		    this.attrs = attrs;
		    this.booleanAttrs = booleanAttrs;
		    this.unary = false;
		    this.html5Unary = false;
		    this.content = content;
		  }
	
		  AtomicTagToken.prototype.toString = function toString() {
		    return TagToken.formatTag(this, this.content);
		  };
	
		  return AtomicTagToken;
		}();
	
		/**
		 * EndTagToken represents an end tag.
		 */
	
	
		var EndTagToken = exports.EndTagToken = function () {
		  /**
		   * Constructor.
		   *
		   * @param {string} tagName The name of the tag.
		   * @param {Number} length The length of the tag text.
		   */
		  function EndTagToken(tagName, length) {
		    _classCallCheck(this, EndTagToken);
	
		    this.type = 'endTag';
		    this.length = length;
		    this.text = '';
		    this.tagName = tagName;
		  }
	
		  EndTagToken.prototype.toString = function toString() {
		    return '</' + this.tagName + '>';
		  };
	
		  return EndTagToken;
		}();
	
	/***/ },
	/* 5 */
	/***/ function(module, exports) {
	
		'use strict';
	
		exports.__esModule = true;
		exports.escapeQuotes = escapeQuotes;
	
		/**
		 * Escape quotes in the given value.
		 *
		 * @param {string} value The value to escape.
		 * @param {string} [defaultValue=''] The default value to return if value is falsy.
		 * @returns {string}
		 */
		function escapeQuotes(value) {
		  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	
		  // There's no lookback in JS, so /(^|[^\\])"/ only matches the first of two `"`s.
		  // Instead, just match anything before a double-quote and escape if it's not already escaped.
		  return !value ? defaultValue : value.replace(/([^"]*)"/g, function (_, prefix) {
		    return (/\\/.test(prefix) ? prefix + '"' : prefix + '\\"'
		    );
		  });
		}
	
	/***/ },
	/* 6 */
	/***/ function(module, exports) {
	
		'use strict';
	
		exports.__esModule = true;
		exports['default'] = fixedReadTokenFactory;
		/**
		 * Empty Elements - HTML 4.01
		 *
		 * @type {RegExp}
		 */
		var EMPTY = /^(AREA|BASE|BASEFONT|BR|COL|FRAME|HR|IMG|INPUT|ISINDEX|LINK|META|PARAM|EMBED)$/i;
	
		/**
		 * Elements that you can intentionally leave open (and which close themselves)
		 *
		 * @type {RegExp}
		 */
		var CLOSESELF = /^(COLGROUP|DD|DT|LI|OPTIONS|P|TD|TFOOT|TH|THEAD|TR)$/i;
	
		/**
		 * Corrects a token.
		 *
		 * @param {Token} tok The token to correct
		 * @returns {Token} The corrected token
		 */
		function correct(tok) {
		  if (tok && tok.type === 'startTag') {
		    tok.unary = EMPTY.test(tok.tagName) || tok.unary;
		    tok.html5Unary = !/\/>$/.test(tok.text);
		  }
		  return tok;
		}
	
		/**
		 * Peeks at the next token in the parser.
		 *
		 * @param {HtmlParser} parser The parser
		 * @param {Function} readTokenImpl The underlying readToken implementation
		 * @returns {Token} The next token
		 */
		function peekToken(parser, readTokenImpl) {
		  var tmp = parser.stream;
		  var tok = correct(readTokenImpl());
		  parser.stream = tmp;
		  return tok;
		}
	
		/**
		 * Closes the last token.
		 *
		 * @param {HtmlParser} parser The parser
		 * @param {Array<Token>} stack The stack
		 */
		function closeLast(parser, stack) {
		  var tok = stack.pop();
	
		  // prepend close tag to stream.
		  parser.prepend('</' + tok.tagName + '>');
		}
	
		/**
		 * Create a new token stack.
		 *
		 * @returns {Array<Token>}
		 */
		function newStack() {
		  var stack = [];
	
		  stack.last = function () {
		    return this[this.length - 1];
		  };
	
		  stack.lastTagNameEq = function (tagName) {
		    var last = this.last();
		    return last && last.tagName && last.tagName.toUpperCase() === tagName.toUpperCase();
		  };
	
		  stack.containsTagName = function (tagName) {
		    for (var i = 0, tok; tok = this[i]; i++) {
		      if (tok.tagName === tagName) {
		        return true;
		      }
		    }
		    return false;
		  };
	
		  return stack;
		}
	
		/**
		 * Return a readToken implementation that fixes input.
		 *
		 * @param {HtmlParser} parser The parser
		 * @param {Object} options Options for fixing
		 * @param {boolean} options.tagSoupFix True to fix tag soup scenarios
		 * @param {boolean} options.selfCloseFix True to fix self-closing tags
		 * @param {Function} readTokenImpl The underlying readToken implementation
		 * @returns {Function}
		 */
		function fixedReadTokenFactory(parser, options, readTokenImpl) {
		  var stack = newStack();
	
		  var handlers = {
		    startTag: function startTag(tok) {
		      var tagName = tok.tagName;
	
		      if (tagName.toUpperCase() === 'TR' && stack.lastTagNameEq('TABLE')) {
		        parser.prepend('<TBODY>');
		        prepareNextToken();
		      } else if (options.selfCloseFix && CLOSESELF.test(tagName) && stack.containsTagName(tagName)) {
		        if (stack.lastTagNameEq(tagName)) {
		          closeLast(parser, stack);
		        } else {
		          parser.prepend('</' + tok.tagName + '>');
		          prepareNextToken();
		        }
		      } else if (!tok.unary) {
		        stack.push(tok);
		      }
		    },
		    endTag: function endTag(tok) {
		      var last = stack.last();
		      if (last) {
		        if (options.tagSoupFix && !stack.lastTagNameEq(tok.tagName)) {
		          // cleanup tag soup
		          closeLast(parser, stack);
		        } else {
		          stack.pop();
		        }
		      } else if (options.tagSoupFix) {
		        // cleanup tag soup part 2: skip this token
		        readTokenImpl();
		        prepareNextToken();
		      }
		    }
		  };
	
		  function prepareNextToken() {
		    var tok = peekToken(parser, readTokenImpl);
		    if (tok && handlers[tok.type]) {
		      handlers[tok.type](tok);
		    }
		  }
	
		  return function fixedReadToken() {
		    prepareNextToken();
		    return correct(readTokenImpl());
		  };
		}
	
	/***/ }
	/******/ ])
	});
	;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	exports.existy = existy;
	exports.isFunction = isFunction;
	exports.each = each;
	exports.eachKey = eachKey;
	exports.defaults = defaults;
	exports.toArray = toArray;
	exports.last = last;
	exports.isTag = isTag;
	exports.isScript = isScript;
	exports.isStyle = isStyle;
	/**
	 * Determine if the thing is not undefined and not null.
	 *
	 * @param {*} thing The thing to test
	 * @returns {boolean} True if the thing is not undefined and not null.
	 */
	function existy(thing) {
	  return thing !== void 0 && thing !== null;
	}
	
	/**
	 * Is this a function?
	 *
	 * @param {*} x The variable to test
	 * @returns {boolean} True if the variable is a function
	 */
	function isFunction(x) {
	  return 'function' === typeof x;
	}
	
	/**
	 * Loop over each item in an array-like value.
	 *
	 * @param {Array<*>} arr The array to loop over
	 * @param {Function} fn The function to call
	 * @param {?Object} target The object to bind to the function
	 */
	function each(arr, fn, target) {
	  var i = void 0;
	  var len = arr && arr.length || 0;
	  for (i = 0; i < len; i++) {
	    fn.call(target, arr[i], i);
	  }
	}
	
	/**
	 * Loop over each key/value pair in a hash.
	 *
	 * @param {Object} obj The object
	 * @param {Function} fn The function to call
	 * @param {?Object} target The object to bind to the function
	 */
	function eachKey(obj, fn, target) {
	  for (var key in obj) {
	    if (obj.hasOwnProperty(key)) {
	      fn.call(target, key, obj[key]);
	    }
	  }
	}
	
	/**
	 * Set default options where some option was not specified.
	 *
	 * @param {Object} options The destination
	 * @param {Object} _defaults The defaults
	 * @returns {Object}
	 */
	function defaults(options, _defaults) {
	  options = options || {};
	  eachKey(_defaults, function (key, val) {
	    if (!existy(options[key])) {
	      options[key] = val;
	    }
	  });
	  return options;
	}
	
	/**
	 * Convert value (e.g., a NodeList) to an array.
	 *
	 * @param {*} obj The object
	 * @returns {Array<*>}
	 */
	function toArray(obj) {
	  try {
	    return Array.prototype.slice.call(obj);
	  } catch (e) {
	    var _ret = function () {
	      var ret = [];
	      each(obj, function (val) {
	        ret.push(val);
	      });
	      return {
	        v: ret
	      };
	    }();
	
	    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	  }
	}
	
	/**
	 * Get the last item in an array
	 *
	 * @param {Array<*>} array The array
	 * @returns {*} The last item in the array
	 */
	function last(array) {
	  return array[array.length - 1];
	}
	
	/**
	 * Test if token is a script tag.
	 *
	 * @param {Object} tok The token
	 * @param {String} tag The tag name
	 * @returns {boolean} True if the token is a script tag
	 */
	function isTag(tok, tag) {
	  return !tok || !(tok.type === 'startTag' || tok.type === 'atomicTag') || !('tagName' in tok) ? !1 : !!~tok.tagName.toLowerCase().indexOf(tag);
	}
	
	/**
	 * Test if token is a script tag.
	 *
	 * @param {Object} tok The token
	 * @returns {boolean} True if the token is a script tag
	 */
	function isScript(tok) {
	  return isTag(tok, 'script');
	}
	
	/**
	 * Test if token is a style tag.
	 *
	 * @param {Object} tok The token
	 * @returns {boolean} True if the token is a style tag
	 */
	function isStyle(tok) {
	  return isTag(tok, 'style');
	}

/***/ }
/******/ ])
});
;

window.$app.defineComponent("component", "vue-component-action-button", {data() {
			return {
				dropdown: ''
			}
		},

		props: {
			classname: {type: String, default: 'button is-default'},
			icon: {type: String, default: 'fa fa-ellipsis-v'},
			title: {type: String, default: 'Действие'},
			position: {type: String, default: 'is-top-right'}
		},

		methods: {
			onAction() {
				this.$emit('action', this.dropdown);

				Vue.nextTick(() => {
		            this.dropdown = null;
	            });
			}
		}, template: `<b-dropdown v-model="dropdown" @input="onAction" :position="position"> <button :class="classname" slot="trigger"><i :class="icon" class="has-mr-2"></i> {{title}}</button> <slot name="actions"></slot> </b-dropdown>`});

window.$app.defineComponent("component", "vue-component-autocomplete-collections", {data() {
			return {
				isFetchingCollections: false,
				autocompleteCollections: [],
			}
		},
		
		props: {value: String, disabled: {type: Boolean, default: false}, allowNew: {type: Boolean, default: true}, placeholder: {type: String}},

		watch: {
			value() {
				this.$emit('input', this.value);
			}
		},
		
		methods: {
			onAddingCollection(v) {
				return !_.find(this.value, ['collection_id', v.collection_id]);
			},
			
			onAddedCollection(v) {
				if (typeof v == 'string') {
					this.value.pop();
					this.value.push({collection_id: null, collection: v});
				}
			},
			
			asyncAutocompleteCollection: _.debounce(function(query) {
                if (query.trim() == '') {
	                this.autocompleteCollections = [];
	                return;
                }
                
                this.isFetchingCollections = true;
                this.$api.get('products/collections/search', {query: query}).then((data) => {
	                this.autocompleteCollections = _.differenceWith(data.response.collections.search, this.value, (a, b) => a.collection_id == b.collection_id);
	                this.isFetchingCollections = false;
				});
			}, 300)
		}, template: `<b-taginput v-model="value" :data="autocompleteCollections" :before-adding="onAddingCollection" @add="onAddedCollection" :allow-new="allowNew" confirm-key-codes='[13]' autocomplete field="collection" @typing="asyncAutocompleteCollection" :placeholder="placeholder" :disabled="disabled" :loading="isFetchingCollections" attached> <template slot-scope="props"> <strong>{{props.option.collection}}</strong> </template> <template slot="empty"> <div v-if="isFetchingCollections">{{'Идет загрузка'|gettext}}</div> <div v-else>{{'Ничего не найдено'|gettext}}</div> </template> </b-taginput>`});

window.$app.defineComponent("component", "vue-component-autocomplete-products", {data() {
			return {
				isFetchingProducts: false,
				autocompleteProducts: [],
			}
		},

		props: {value: String, disabled: {type: Boolean, default: false}, allowNew: {type: Boolean, default: true}, placeholder: {type: String}},

		watch: {
			value() {
				this.$emit('input', this.value);
			}
		},
		
		methods: {
			asyncAutocompleteProduct: _.debounce(function(query) {
                if (query.trim() == '') {
	                this.autocompleteProducts = [];
	                return;
                }
                
                this.isFetchingProducts = true;
                this.$api.get('products/search', {query: query}).then((data) => {
	                this.autocompleteProducts = _.differenceWith(data.response.products.search, this.value, (a, b) => a.product_id == b.product_id);
	                this.isFetchingProducts = false;
				});
			}, 500),
			
			
			onAddingProduct(v) {
				return !_.find(this.value, ['product_id', v.product_id]);
			},
			
			onAddProduct(v) {
				if (typeof v == 'string') {
					this.value.pop();
					this.value.push({product_id: null, product: v});
				}
			}		
		}, template: `<b-taginput v-model="value" :data="autocompleteProducts" :before-adding="onAddingProduct" @add="onAddProduct" :allow-new="allowNew" confirm-key-codes='[13]' autocomplete field="product" @typing="asyncAutocompleteProduct" :placeholder="placeholder" :disabled="disabled" :loading="isFetchingProducts" attached> <template slot-scope="props"> <strong>{{props.option.product}}</strong> </template> <template slot="empty"> <div v-if="isFetchingProducts">{{'Идет загрузка'|gettext}}</div> <div v-else>{{'Ничего не найдено'|gettext}}</div> </template> </b-taginput>`});

window.$app.defineComponent("component", "vue-component-background-editor", {props: {value: Object, disabled: Boolean},
		
		data() {
			return {
				background_types: {'solid': this.$gettext('Сплошной цвет'), 'gradient': this.$gettext('Градиент')}
			}
		},
		
		methods: {
			checkBackgroundTile(y, x) {
				let s = ['0%', '50%', '100%'];
				let o = this.value.position.split(' ');

				switch (this.value.repeat) {
					case 'repeat':
						return true;
						break;
					case 'repeat-x':
						return o[1] == s[y];
						break;
					case 'repeat-y':
						return o[0] == s[x];
						break;
					case 'no-repeat':
						return (o[1] == s[y]) && (o[0] == s[x]);
						break;
				}
			},
			
			checkBackgroundWidthPosition() {
				let o = this.value.position.split(' ');
				let s = {'0%': '-60px', '50%': '-38px', '100%': '-16px'};
				return s[o[1]];
			}
		}, template: `<div :class="{disabled: disabled}"> <div class="has-mb-2 link-styles-container"> <label class="form-control-static">{{'Тип'|gettext}}</label> <div class="select"> <select v-model="value.type" :disabled="disabled"> <option v-for="(v, i) in background_types" :value="i">{{v}}</option> </select> </div> </div> <div class="has-mb-2 link-styles-container"> <label class="form-control-static">{{'Цвет'|gettext}}</label> <div class="is-flex"> <vue-component-colorpicker v-model="value.color1" position-horizontal="left"></vue-component-colorpicker> <vue-component-colorpicker v-model="value.color2" class="has-ml-1" v-if="value.type == 'gradient'" position-horizontal="left"></vue-component-colorpicker> </div> </div> <div class="has-mb-2 link-styles-container"> <label class="form-control-static" style="font-weight: bold">{{'Картинка'|gettext}}</label> <vue-component-pictures class="theme-picture" v-model="value.picture" :button-title="'Загрузить'|gettext" button-icon="fa fal fa-cloud-upload" updatable></vue-component-pictures> </div> <div v-if="value.picture"> <div class="has-mb-2 link-styles-container link-styles-container is-tablet-fullwidth" :class="{disabled: !value.picture}"> <label class="form-control-static">{{'Размер'|gettext}}</label> <div class="theme-background-size is-background-size"> <label :class="{in: value.size == 'width'}" @click="value.size = 'width'" :data-title="'По ширине'|gettext"> <div data-value="width"> <span :style="{visibility: (['repeat-y', 'repeat'].indexOf(value.repeat) != -1)?'visible':'hidden', 'margin-top': checkBackgroundWidthPosition()}"></span> <span></span> <span :style="{visibility: (['repeat-y', 'repeat'].indexOf(value.repeat) != -1)?'visible':'hidden'}"></span> </div> </label> <label :class="{in: value.size == 'cover'}" @click="value.size = 'cover'" :data-title="'На весь экран'|gettext"><div data-value="cover"><span></span></div></label> <label :class="{in: value.size == 'tile'}" @click="value.size = 'tile'" :data-title="'Плиткой'|gettext"> <div data-value="none"> <dd v-for="dd in [0, 1, 2]"> <dt v-for="dt in [0, 1, 2]" :class="{in: checkBackgroundTile(dd, dt)}"></dt> </dd> </div> </label> </div> </div> <div class="has-mb-2 link-styles-container" :class="{disabled: !value.picture}"> <label class="form-control-static">{{'Выравнивание'|gettext}}</label> <div> <div class="theme-background-size is-background-position"> <label> <div> <dd v-for="(dd_v, dd) in {0: '0%', 1: '50%', 2: '100%'}"> <dt v-for="(dt_v, dt) in {0: '0%', 1: '50%', 2: '100%'}" :class="[$format('is-{1}{2}', dt, dd), {in: value.position == dt_v+' '+dd_v}]" @click="value.position = dt_v+' '+dd_v"> <svg width="30px" height="30px" viewBox="0 0 25 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <polygon class="is-left" fill-rule="nonzero" points="3 10 0 12.5 3 15 3 13 6 13 6 12 3 12"></polygon> <polygon class="is-bottom" fill-rule="nonzero" points="13 19 12 19 12 22 10 22 12.5 25 15 22 13 22"></polygon> <polygon class="is-right" fill-rule="nonzero" points="25 12.5 22 10 22 12 19 12 19 13 22 13 22 15"></polygon> <polygon class="is-top" fill-rule="nonzero" points="10 3 12 3 12 6 13 6 13 3 15 3 12.5 0"></polygon> <path d="M14,12.5 C14,11.7 13.3,11 12.5,11 C11.7,11 11,11.7 11,12.5 C11,13.3 11.7,14 12.5,14 C13.3,14 14,13.3 14,12.5 Z" class="is-dot" fill-rule="nonzero"></path> </g> </svg> </dt> </dd> </div> </label> </div> </div> </div> <div class="has-mb-2 link-styles-container" :class="{disabled: !value.picture}"> <label class="form-control-static">{{'Повторение'|gettext}}</label> <div> <div class="theme-background-size is-background-repeat"> <label> <div> <dd> <dt v-for="v in ['repeat', 'repeat-y', 'repeat-x', 'no-repeat']" :data-value="v" :class="{in: value.repeat == v}" @click="value.repeat = v"> <svg width="20px" height="20px" viewBox="0 0 510 510" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g fill-rule="nonzero"> <g class="is-3" transform="translate(330, 330)"> <path d="M18,180 L162,180 C171.94125,180 180,170.701442 180,159.230769 L180,20.7692308 C180,9.29855769 171.94125,0 162,0 L18,0 C8.05875,0 0,9.29855769 0,20.7692308 L0,159.230769 C0,170.701442 8.05875,180 18,180 Z"></path> </g> <g class="is-2" transform="translate(0, 330)"> <path d="M0,20.7692308 L0,159.230769 C0,170.701442 8.05875,180 18,180 L162,180 C171.94125,180 180,170.701442 180,159.230769 L180,20.7692308 C180,9.29855769 171.94125,0 162,0 L18,0 C8.05875,0 0,9.29855769 0,20.7692308 Z"></path> </g> <g class="is-1" transform="translate(330, 0)"> <path d="M18,0 L162,0 C171.94125,0 180,9.29855769 180,20.7692308 L180,159.230769 C180,170.701442 171.94125,180 162,180 L18,180 C8.05875,180 0,170.701442 0,159.230769 L0,20.7692308 C0,9.29855769 8.05875,0 18,0 Z"></path> </g> <g class="is-0" transform="translate(0, 0)"> <path d="M162,0 L18,0 C8.05875,0 0,9.29855769 0,20.7692308 L0,159.230769 C0,170.701442 8.05875,180 18,180 L162,180 C171.94125,180 180,170.701442 180,159.230769 L180,20.7692308 C180,9.29855769 171.94125,0 162,0 Z"></path> </g> </g> </g> </svg> </dt> </dd> </div> </label> </div> </div> </div> <div class="has-mb-2 link-styles-container is-tablet-fullwidth" :class="{disabled: !value.picture}"> <label class="form-control-static">{{'Прозрачность'|gettext}}</label> <b-slider v-model="value.opacity" size="is-medium" :min="0" :max="100" ticks1 type="is-success" :step="1"> <template v-for="v in [5, 20, 40, 60, 80, 95]"> <b-slider-tick :value="v" :key="v">{{ v }}%</b-slider-tick> </template> </b-slider> </div> </div> </div>`});

window.$app.defineComponent("component", "vue-component-blocks-flipclock", {data() {
			return {
				countdown: 0,
				clock: null
			}
		},
		
		watch: {
			value() {
				this.countdown = this.prepare(true);
			}
		},
		
		props: ['value', 'page_id', 'id'],
		
		mounted() {
			this.countdown = this.prepare();
		},

		methods: {
			prepare(force) {
				let tms = Math.min(this.value.tms, 8640000-1); /* 100 дней - 1 сек*/
						
				if (this.value.type == 2) {
					let key = 'timer'+this.page_id+'-'+this.id;
					let now = Math.round(new Date() / 1000);		
					let t = Cookies.get(key);
					if (t && !force) {
						tms = t - now;
					} else {
						Cookies.set(key, tms + now, { maxAge: this.value.expires, path: this.value.path?this.value.path:'/' });
					}
				}

				if (tms < 0) tms = 0;
							    
				return tms;
			}
		}, template: `<vue-blocks-flipclock-countdown :countdown="countdown"></vue-blocks-flipclock-countdown>`});

window.$app.defineComponent("component", "vue-component-blocks-html", {mounted() {
			this.refresh();
		},
		
		watch: {
			value() {
				this.refresh();
			}
		},
		
		props: ['value'],

		methods: {
			refresh() {
				this.$nextTick(() => {
					this.$el.innerHTML = '';
					let s = this.value;
					postscribe(this.$el, s, {
			            done: () => {
			                document.dispatchEvent(new Event("DOMContentLoaded", {bubbles: false}));
			            }
			        });
				});
			}
		}, template: `<div></div>`});

window.$app.defineComponent("component", "vue-component-blocks-map", {data() {
			return {
				map: null,
				icon: null,
				markers: [],
			}
		},
		
		mounted() {
			$mx.lazy('map.js', 'map.css', () => {
				let options = this.value.bounds;
				let isFixed = this.value.is_fixed;
				
				this.map = L.map(this.$refs.map, {
					dragging: !isFixed,
					doubleClickZoom: !isFixed,
					boxZoom: !isFixed,
					touchZoom: !isFixed,
					zoomControl: true,
					attributionControl: false,
				});
				
				if (options.center != undefined) this.map.setView([options.center.lat, options.center.lng], options.zoom);
				
				L.control.attribution({prefix: ''}).addTo(this.map);
				
				if (options.bounds != undefined) this.map.fitBounds(options.bounds);
		
		//'https://maps.tilehosting.com/styles/basic/{z}/{x}/{y}.png?key=V8rA6J6w5KhzV2N0rq8g'
				L.tileLayer('/maps/{z}/{x}/{y}.png', {
			        attribution: '',
			        crossOrigin: true
				}).addTo(this.map);
				
				this.icon = L.icon({
				    iconUrl: '/s/i/marker.png',
				    iconSize: [28, 37],
		// 		    iconAnchor: [22, 94],
				    popupAnchor: [0, -10],
				    shadowUrl: '/s/i/marker-shadow.png',
				    shadowSize: [40, 50],
				    shadowAnchor: [12, 31]
				});

				this.fillMarkers();
			});
/*
			$mx.lazy('//maps.googleapis.com/maps/api/js?key=AIzaSyCsYkpOHG_vddnpHQJ8kamy4RGt81HCfCU&libraries=places', () => {
				let options = this.value.bounds;
				options.fullscreenControl = false;
				options.streetViewControl = this.value.show_street;
				options.mapTypeControl = this.value.show_types;
				options.zoomControl = this.value.show_zoom;
				options.draggable = !this.value.is_fixed;
				
				this.map = new google.maps.Map(this.$refs.map, options);

				for (i = 0; i < this.value.markers.length; i++) {
					var m = this.value.markers[i];
					
					var marker = new google.maps.Marker({
						position: {lng: parseFloat(m.lng), lat: parseFloat(m.lat)},
						map: this.map
					});
					
					var infowindow = new google.maps.InfoWindow({
					    content: '<b>'+m.title+'</b><br>'+m.text
					});
					
					google.maps.event.addListener(marker, 'click', function() {
						infowindow.open(this.map, marker);
					});
				}
			});
*/
		},
		
		watch: {
			value() {
				this.refresh();
			}
		},
		
		props: ['value'],

		methods: {
			refresh() {
				let o = this.value.bounds;
				this.map.fitBounds(o.bounds);
				this.fillMarkers();
				
				this.map.options.zoomControl = true;
			},
			
			fillMarkers() {
				for(var i = 0; i < this.markers.length; i++)  this.map.removeLayer(this.markers[i]);
				
				_.each(this.value.markers, (v) => {
					this.markers.push(L.marker([parseFloat(v.lat), parseFloat(v.lng)], {icon: this.icon}).addTo(this.map));
				});
			}
		}, template: `<div class="map-container" :class="{'map-view-with-zoom-control': value.show_zoom}"> <div ref="map" class="map-view"></div> </div>`});

window.$app.defineComponent("component", "vue-component-clipboard", {data() {
			return {
				clipboard: null
			}
		},
		
		props: {text: String, successMessage: {type: String, default: 'Скопировано'}, showIcon: {type: Boolean, default: true}, withShare: Boolean},
		
		mounted() {
			this.clipboard = new Clipboard(this.$refs.button);
			this.clipboard.on('success', (e) => {
				this.$buefy.toast.open({
					duration: 3000,
					message: this.$gettext(this.successMessage),
					type: 'is-success',
					position: 'is-top',
					queue: false
				});
			});
		},
		
		methods: {
			click() {
				if (this.withShare && (navigator.share != undefined)) navigator.share({url: this.text});
			}
		},
		
		destroyed() {
			this.clipboard.destroy();
		}, template: `<span ref='button' :data-clipboard-text="text" @click.stop="click"> <i class="fas fa-copy button-clipboard" v-if="showIcon"></i><slot></slot> </span>`});

window.$app.defineComponent("component", "vue-component-codemirror", {data() {
			return {
				codeMirror: null,
				content: ''
			}
		},

		props: {value: String, disabled: Boolean, readonly: Boolean, mode: {type: String, default: "text/html"}},

		mounted() {
			$mx.lazy('codemirror.js', 'codemirror.css', () => {
				this.codeMirror = CodeMirror.fromTextArea(this.$refs.el, {
					lineNumbers: true,
					theme: 'default',
// 					htmlMode: true,
// 					matchClosing: true,
					mode: this.mode,
					readOnly: this.readonly,
// 					mode: 'xml',
					autoCloseTags: true,
					lint: true,
					styleActiveLine: true,
					gutters: ["CodeMirror-lint-markers"]
				});
				
				this.codeMirror.on('change', cm => {
					this.content = cm.getValue()
					this.$emit('input', this.content);
				})
			});
		},

		watch: {
			value(newVal) {
				if (!this.codeMirror) return;
				
				const cm_value = this.codeMirror.getValue()
				if (newVal !== cm_value) {
					const scrollInfo = this.codeMirror.getScrollInfo()
					this.codeMirror.setValue(newVal)
					this.content = newVal
					this.codeMirror.scrollTo(scrollInfo.left, scrollInfo.top)
				}
				//this.unseenLineMarkers()
			}
		},

		beforeDestroy() {
			if (this.codeMirror) {
				const element = this.codeMirror.doc.cm.getWrapperElement()
				element && element.remove && element.remove()
			}
		}, template: `<div :class="{disabled: disabled}"> <textarea ref='el' v-model="value" style="width: 100%;border: 0;resize: none" class="CodeMirror cm-s-default"></textarea> </div>`});

window.$app.defineComponent("component", "vue-component-colorpicker", {data() {
			return {
				palette: [
					['#000000', '#343a40', '#495057', '#868e96', '#adb5bd', '#ced4da', '#dee2e6', '#e9ecef', '#f1f3f5', '#ffffff'],
					['#c92a2a', '#e03131', '#f03e3e', '#fa5252', '#ff6b6b', '#ff8787', '#ffa8a8', '#ffc9c9', '#ffe3e3', '#fff5f5'],
					['#a61e4d', '#c2255c', '#d6336c', '#e64980', '#f06595', '#f783ac', '#faa2c1', '#fcc2d7', '#ffdeeb', '#fff0f6'],
					['#862e9c', '#9c36b5', '#ae3ec9', '#be4bdb', '#cc5de8', '#da77f2', '#e599f7', '#eebefa', '#f3d9fa', '#f8f0fc'],
					['#5f3dc4', '#6741d9', '#7048e8', '#7950f2', '#845ef7', '#9775fa', '#b197fc', '#d0bfff', '#e5dbff', '#f3f0ff'],
					['#364fc7', '#3b5bdb', '#4263eb', '#4c6ef5', '#5c7cfa', '#748ffc', '#91a7ff', '#bac8ff', '#dbe4ff', '#edf2ff'],
					['#1864ab', '#1971c2', '#1c7ed6', '#228be6', '#339af0', '#4dabf7', '#74c0fc', '#a5d8ff', '#d0ebff', '#e7f5ff'],
					['#0b7285', '#0c8599', '#1098ad', '#15aabf', '#22b8cf', '#3bc9db', '#66d9e8', '#99e9f2', '#c5f6fa', '#e3fafc'],
					['#087f5b', '#099268', '#0ca678', '#12b886', '#20c997', '#38d9a9', '#63e6be', '#96f2d7', '#c3fae8', '#e6fcf5'],
					//['#2b8a3e', '#2f9e44', '#37b24d', '#40c057', '#51cf66', '#69db7c', '#8ce99a', '#b2f2bb', '#d3f9d8', '#ebfbee'],
					['#5c940d', '#66a80f', '#74b816', '#82c91e', '#94d82d', '#a9e34b', '#c0eb75', '#d8f5a2', '#e9fac8', '#f4fce3'],
					['#e67700', '#f08c00', '#f59f00', '#fab005', '#fcc419', '#ffd43b', '#ffe066', '#ffec99', '#fff3bf', '#fff9db'],
					['#d9480f', '#e8590c', '#f76707', '#fd7e14', '#ff922b', '#ffa94d', '#ffc078', '#ffd8a8', '#ffe8cc', '#fff4e6'],
				],
				currentTab: 's',
				colorsPallete: [],
				oldValue: null,
				pickr: null,
				frequenty: []
			}
		},
		props: {value: String, colors: {type: Array, default: []}, disabled: Boolean, label: String, positionHorizontal: String, position: String},
		watch: {
			value(v) {
//				if (this.value != v) 
				if (this.pickr && this.value.replace('#', '').length == 6) this.pickr.setColor(this.value, true);
			},
			currentTab(v) {
				if (v == 'p' && !this.pickr) {
					this.pickr = Pickr.create({
					    el: this.$refs.picker,
					    inline: true,
					    useAsButton: true,
					    showAlways: true,
					    default: this.value,
					    sliders: 'h',
					
					    components: {
						    palette: false,
					        preview: false,
					        opacity: false,
					        hue: true
					    }
					});
					
					this.pickr.on('change', (color, instance) => {
						let v = color.toHEXA().toString().toLowerCase();
						if (this.value.toLowerCase() != v) {
							this.value = v;
							if (!this.isMobile()) this.$emit('input', v);
						}
					});
				}
			}
		},
		created() {
			this.oldValue = this.value;
			
			this.colorsPallete = (typeof(this.colors) == 'string')?this.colors.split(','):this.colors;
			if (!this.value) this.value = '#ffffff';
			
// 			if (this.colors.indexOf(this.oldValue) == -1) this.colors.unshift(this.oldValue.toString());
		},
		mounted() {
			this.checkPosition();
			$mx(window).on('resize', this.checkPosition);
		},
		destroyed() {
			$mx(window).off('resize', this.checkPosition);
			if (this.pickr) this.pickr.destroy();
		},
		methods: {
			close() {
				this.$refs.dropdown.toggle();
			},
			apply() {
				this.oldValue = this.value;
				this.close();
			},
			isMobile() {
				return window.matchMedia("(max-width: 767px)").matches;	
			},
			inputColor() {
				if ((this.value.replace('#', '').length == 6) && !this.isMobile()) this.$emit('input', this.value);
			},
			selectColor(v) {
				this.value = v;
				if (!this.isMobile()) {
					this.$emit('input', v);
					this.close();
				}
			},
			checkPosition() {
				this.position = (($mx(document.body).height() - $mx(this.$el).offset().top < 400)?'is-top-':'is-bottom-')+(this.positionHorizontal?this.positionHorizontal:(this.label?'left':'right'));
			},
			filterFrequenty(list) {
				return _.filter(list, (v) => {
					return (v && (this.colors.indexOf(v) == -1));
				})
			},
			activeChange(v) {
				if (v) {
					this.oldValue = this.value;
					this.currentTab = 's';
					this.frequenty = this.filterFrequenty(Storage.get('colors.frequenty', []));
				} else {
					if (this.isMobile()) {
						this.value = this.oldValue;
						this.$emit('input', this.value);
					}
					this.updateFrequenty(this.value);
				}
				
				$mx('html').toggleClass('is-dropdown-opened', v);
			},
			
			lightOrDark(color) {
				return lightOrDark(color);
			},
			
			updateFrequenty(color) {
				let idx = this.frequenty.indexOf(color);
				if (idx != -1) this.frequenty.splice(idx, 1);
				
				this.frequenty.unshift(color);
				this.frequenty = this.filterFrequenty(this.frequenty.slice(0, 40));
				
				Storage.set('colors.frequenty', this.frequenty);
			}
		}, template: `<div :class="['color-picker-container', {disabled: disabled, 'with-label': label}]"> <label class="form-control-static" v-if="label">{{label}}</label> <b-dropdown aria-role="list" :position="position" @active-change="activeChange" ref="dropdown"> <button class="button color-picker-button" role="button" slot="trigger"> <span :style="{background: value}"></span> <i class="fal fa-chevron-down"></i> </button> <b-dropdown-item :focusable="false" class="color-picker" custom paddingless> <div class="color-picker-tabs"> <a @click="currentTab = 'h'" :class="{in: currentTab== 'h'}"><svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="history" class="svg-inline--fa fa-history fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g class="fa-group"><path class="fa-secondary" fill="currentColor" d="M141.68 400.23a184 184 0 1 0-11.75-278.3l50.76 50.76c10.08 10.08 2.94 27.31-11.32 27.31H24a16 16 0 0 1-16-16V38.63c0-14.26 17.23-21.4 27.31-11.32l49.38 49.38A247.14 247.14 0 0 1 256 8c136.81 0 247.75 110.78 248 247.53S392.82 503.9 256.18 504a247 247 0 0 1-155.82-54.91 24 24 0 0 1-1.84-35.61l11.27-11.27a24 24 0 0 1 31.89-1.98z" opacity="0.4"></path><path class="fa-primary" fill="currentColor" d="M288 152v104.35L328.7 288a24 24 0 0 1 4.21 33.68l-9.82 12.62a24 24 0 0 1-33.68 4.21L224 287.65V152a24 24 0 0 1 24-24h16a24 24 0 0 1 24 24z"></path></g></svg></a> <a @click="currentTab = 's'" :class="{in: currentTab== 's'}"><svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="swatchbook" class="svg-inline--fa fa-swatchbook fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g class="fa-group"><path class="fa-secondary" fill="currentColor" d="M64,256h64V192H64Zm370.66-88.29h0L344.5,77.36a31.83,31.83,0,0,0-45-.07h0l-.07.07L224,152.88V424L434.66,212.9A32,32,0,0,0,434.66,167.71ZM64,128h64V64H64ZM480,320H373.09L186.68,506.51c-2.06,2.07-4.5,3.58-6.68,5.49H480a32,32,0,0,0,32-32V352A32,32,0,0,0,480,320Z" opacity="0.4"></path><path class="fa-primary" fill="currentColor" d="M160,0H32A32,32,0,0,0,0,32V416a96,96,0,0,0,192,0V32A32,32,0,0,0,160,0ZM96,440a24,24,0,1,1,24-24A24,24,0,0,1,96,440Zm32-184H64V192h64Zm0-128H64V64h64Z"></path></g></svg></a> <a @click="currentTab = 'p'" :class="{in: currentTab== 'p'}"><svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="eye-dropper" class="svg-inline--fa fa-eye-dropper fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g class="fa-group"><path class="fa-secondary" fill="currentColor" d="M32 512L0 480l32-56v-45.5c0-17 6.7-33.3 18.8-45.3l126.6-126.6 128 128-126.7 126.7c-12 12-28.3 18.7-45.2 18.7H88l-56 32z" opacity="0.4"></path><path class="fa-primary" fill="currentColor" d="M483.9 163.9L406.8 241l13.1 13.1c9.4 9.4 9.4 24.6 0 33.9l-41 41c-9.4 9.3-24.5 9.3-33.9 0L183 167c-9.4-9.4-9.4-24.6 0-33.9l41-41c9.4-9.4 24.6-9.4 33.9 0l13.1 13.2 77.1-77.1c37.5-37.5 98.3-37.5 135.8 0s37.5 98.2 0 135.7z"></path></g></svg></a> <a class="is-pulled-right is-visible-mobile" @click="close"><i class="fal fa-times" style="font-size: 30px;line-height: 20px"></i></a> </div> <div class="color-picker-swatches" v-if="currentTab == 's'"> <div> <div v-for="(l, c) in palette"> <a v-for="c in l" :class="{in: value== c}" @click="selectColor(c)"><dd :style="{'background': c}" :data-brightness="lightOrDark(c)"></dd></a> </div> </div> </div> <div class="color-picker-swatches is-horizontal" v-if="currentTab == 'h'"> <div> <span v-if="colorsPallete.length"> <a v-for="c in colorsPallete" :class="{in: value== c}" @click="selectColor(c)"><dd :style="{'background': c}" :data-brightness="lightOrDark(c)"></dd></a> </span> <span v-if="frequenty.length"> <a v-for="c in frequenty" :class="{in: value== c}" @click="selectColor(c)"><dd :style="{'background': c}" :data-brightness="lightOrDark(c)"></dd></a> </span> </div> </div> <div v-show="currentTab == 'p'" style="flex-grow: 1"> <div style="padding: .8rem .8rem 0"> <div class="pcr-color-preview"> <button type="button" class="pcr-last-color" aria-label="use previous color" :style="{color: oldValue}" @click="selectColor(oldValue)"></button> <div class="pcr-current-color" :style="{color: value}"></div> </div> </div> <div ref="picker" class="color-picker"></div> <div style="padding: .8em"><input type="text" class="input" v-model="value" @input="inputColor"></div> </div> <div class="color-picker-footer"> <button class="button is-dark" @click="close">{{'Закрыть'|gettext}}</button> <button class="button is-primary" @click="apply">{{'Применить'|gettext}}</button> </div> </b-dropdown-item> </b-dropdown> </div>`});

window.$app.defineComponent("component", "vue-component-datepicker", {data() {
			return {
				weekdays: this.$getDaysNames(),
				months: this.$getMonthsNames(),
				first_day_week: this.$getFirstDayWeek()
			}
		},
		
		props: {value: String, placeholder: String, disabled: Boolean},
		
		watch: {
			value(v) {
				this.$emit('input', v);
			}
		}, template: `<div class="has-feedback"> <b-datepicker :placeholder="placeholder" v-model="value" icon="calendar-alt" :day-names="weekdays" :month-names="months" :first-day-of-week="first_day_week" :disabled="disabled"></b-datepicker> <a class="form-control-feedback has-text-grey-light" @click="value = null" :class="{disabled: disabled}" v-if="value"><i class="fal fa-times"></i></a> </div>`});

window.$app.defineComponent("component", "vue-component-domain-attach", {data() {
			return {
				isFetching: false,
				isCheckingDNS: false,
				isAttachingDomain: false,
				domainProtocol: 'http://',
				values: {domain: '', domain_verified: false, domain_attached: false, domain_secured: false},
				errors: {}
			}
		},
		
		props: {value: Object, disabled: Boolean},
		mixins: [FormModel],
		
		created() {
			this.fetchData();
		},
		
		computed: {
			ns() {
				return (window.i18n.locale == 'ru')?['ns1.taplink.cc', 'ns2.taplink.cc']:['ns1.taplink.at', 'ns2.taplink.at'];
			},
			isSubdomain() {
				return this.values.domain.split('.').length > 2;
			}
		},
		
		methods: {
			fetchData() {
				this.isFetching = true;
				this.$api.get('settings/domain/get').then((data) => {
					this.isFetching = false;
					this.values = data.response;
				});
			},
			
			updateData(part) {
				this.isUpdating = true;
				this.$api.post('settings/domain/set', Object.assign({part: part}, this.values)	, this).then((data) => {
					this.errors = (data.result == 'fail')?data.errors:{};
					if (data.result == 'success') {
						this.fetchData();
						this.$auth.refresh();
					}
					this.isCheckingDNS = this.isAttachingDomain = this.isUpdating = false;
				}).catch(({ data }) => {
					this.isCheckingDNS = this.isAttachingDomain = this.isUpdating = false;
				});
			},
			
			onDomainAction(v) {
				switch (v) {
					case 'delete':
						this.$confirm(this.$gettext('Вы уверены что хотите открепить доменное имя?'), 'is-danger').then(() => {
							this.updateData('domain_unattach');
						});
						break;
					case 'zonemanager':
						this.$form('vue-settings-domain-zonemanager-form', null, this);
						break;
					case 'certificate':
						this.$form('vue-settings-domain-certificate-form', null, this);
						break;
				}
			},
			
			checkDomainDNS() {
				this.isCheckingDNS = true;
				this.updateData('check_dns');
			},
			
			domainAttach() {
				this.isAttachingDomain = true;	
				this.updateData('domain_attach');
			}			
		}, template: `<div> <b-field :class="{disabled: !$auth.isAllowTariff('business'), 'has-error': errors.domain}" :message="errors.domain"> <b-field class="is-marginless"> <div v-if="values.domain_attached || isAttachingDomain" class="control is-clearfix is-mouse-locked" :disabled="isFetching"> <div class="input has-text-success" disabled="on" v-if="$account.custom_domain_secured"> <i class="fas fa-lock has-text-success" style="font-size: 90%;line-height: 1rem;color: #599e4d !important"></i><span class="has-ml-1 is-hidden-mobile">HTTPS</span> </div> </div> <div v-if="values.domain_attached || isAttachingDomain" class="control is-expanded is-clearfix"> <div disabled="on" class="input is-mouse-locked has-text-black">{{values.domain}}</div> </div> <b-input type="text" v-model="values.domain" placeholder="mydomain.ru" v-else expanded :disabled="isFetching || disabled"></b-input> <p class="control"> <button class="button is-fullwidth" @click="domainAttach" v-if="!values.domain_attached" :disabled="isFetching || disabled" :class="{'is-loading': isAttachingDomain}">{{'Подключить домен'|gettext}}</button> <vue-component-action-button v-else @action="onDomainAction" :title="'Действие'|gettext" position="is-bottom-left"> <template slot="actions"> <b-dropdown-item value="zonemanager" :disabled="!values.domain_verified" v-if="!isSubdomain"><i class="fa fa-globe"></i> {{'Управление зоной'|gettext}}</b-dropdown-item> <b-dropdown-item value="certificate" :disabled="!values.domain_verified" v-if="isSubdomain"><i class="fa fa-globe"></i> {{'SSL сертификат'|gettext}}</b-dropdown-item> <hr class="dropdown-divider" aria-role="menuitem"> <b-dropdown-item value="delete" class="has-text-danger"><i class="fa fa-trash-alt"></i> {{'Отключить домен'|gettext}}</b-dropdown-item> </template> </vue-component-action-button> </p> </b-field> </b-field> <div v-if="values.domain_attached && !values.domain_verified"> <p class="has-mb-1" v-if="isSubdomain">{{'Для завершения подключения поддомена {1} нужно добавить CNAME-запись в ваш DNS-сервер'|gettext|format(values.domain)}}:</p> <p class="has-mb-1" v-else>{{'Для завершения подключения домена {1} нужно изменить DNS-сервера на'|gettext|format(values.domain)}}:</p> <table class="table is-bordered is-marginless has-mr-2" style="border-top: 1px solid #f0f0f0;border-top-color: var(--border-grey-color)" v-if="isSubdomain"> <tbody> <tr> <td><i class="fas has-mr-1" :class="{'fa-check-circle has-text-success': values.domain_verified, 'fa-exclamation-circle has-text-danger': !values.domain_verified}"></i> taplink.cc <vue-component-clipboard text="taplink.cc" class="has-ml-1"></vue-component-clipboard></td> </tr> </tbody> </table> <table class="table is-bordered is-marginless has-mr-2" style="border-top: 1px solid #f0f0f0;border-top-color: var(--border-grey-color)" v-else> <tbody> <tr> <td><i class="fas has-mr-1" :class="{'fa-check-circle has-text-success': values.domain_verified, 'fa-exclamation-circle has-text-danger': !values.domain_verified}"></i> {{ns[0]}} <vue-component-clipboard :text="ns[0]" class="has-ml-1"></vue-component-clipboard></td> </tr> <tr> <td><i class="fas has-mr-1" :class="{'fa-check-circle has-text-success': values.domain_verified, 'fa-exclamation-circle has-text-danger': !values.domain_verified}"></i> {{ns[1]}} <vue-component-clipboard :text="ns[1]" class="has-ml-1"></vue-component-clipboard></td> </tr> </tbody> </table> <button class="has-mt-2 button is-dark" @click="checkDomainDNS" :class="{'is-loading': isCheckingDNS}" v-if="!values.domain_verified">{{'Проверить DNS'|gettext}}</button> </div> <div v-if="window.i18n.locale == 'ru' && !values.domain_attached" :class="{disabled: !$auth.isAllowTariff('business')}"> Если у вас нет доменного имени вы можете зарегистрировать его в <a href="https://reg.ru?rlink=reflink-44923" target="_blank">REG.RU</a> </div> </div>`});

window.$app.defineComponent("component", "vue-component-dropdown-checklist", {data() {
			return {
				action: null
			}
		},
		
		created() {
		},
		
		props: ['list', 'value'],
		
		methods: {
            onAction() {
	            if (!this.action) return;
	            let k = this.value.indexOf(this.action);
	            
				let p = this.action.split(':');
				
				// Выключить ALL нельзя
				if (p.length > 1 && p[1] == '*' && this.value.indexOf(this.action) != -1) {
					Vue.nextTick(() => { this.action = null; });
					return;
				}

				let value = this.value;
	            
	            if (k == -1) {
		            value.push(this.action);
				} else {
					value.splice(k, 1);
				}
				
				
				// Нормализация
				if (p.length > 1) {
					if (p[1] == '*') {
						if (value.indexOf(p[0]+':*') != -1) value = _.filter(value, (v) => { return v.indexOf(p[0]+':*') != -1 || v.indexOf(p[0]+':') == -1 });
					} else {
						let found = false;
						_.each(this.list, (w) => { found |= w.items[p[0]+':*'] != undefined; });
						
						// Обработка name:true, name:false
						if (p[1] == 'true' || p[1] == 'false') {
							_.each(this.list, (w) => {
								_.each(w.items, (title, v) => {
									value = _.filter(value, (v) => { return v.indexOf(p[0]+':') == -1 || v.indexOf(':'+p[1]) != -1});
								});
							});
						}
						
						// Если есть name:* то 
						if (found) {
							let counts = {0: 0, 1:0};
							_.each(this.list, (w) => {
								_.each(w.items, (title, v) => {
									if (v.indexOf(p[0]+':') == 0 && v.indexOf(p[0]+':*') != 0) {
										counts[(value.indexOf(v) == -1)?0:1]++;
									}
								});
							});
							
							if (counts[0] == 0) {
								value = _.filter(value, (v) => { return v.indexOf(p[0]+':') == -1});
								value.push(p[0]+':*');
							} else {
								value = _.filter(value, (v) => { return v.indexOf(p[0]+':*') == -1});
							}
						}
					}
				}
	            
	            
				Vue.nextTick(() => {
					this.value = value;
					this.action = null;
					this.$emit('input', value);
				});
			}
		}, template: `<b-dropdown class="is-fullwidth" v-model="action" @input="onAction"> <button class="button is-fullwidth level" slot="trigger"> <span>{{'Фильтр'|gettext}}</span> <b-icon icon="angle-down"></b-icon> </button> <div v-for="(node, idx) in list"> <hr v-if="node.label && idx> 0" class="dropdown-divider"> <b-dropdown-item v-if="node.label" custom class="has-text-grey-light"> {{node.label|gettext}} </b-dropdown-item> <b-dropdown-item v-for="(t, k) in node.items" :value="k"><i class="fa" :class="{'fa-square': value.indexOf(k) == -1, 'fas fa-check-square': value.indexOf(k) != -1}"></i> {{t}}</b-dropdown-item> </div> </b-dropdown>`});

window.$app.defineComponent("component", "vue-component-dropdown-list", {props: {
			title: {type: String, default: 'list'}, 
			value: {type: Object, default: []}, 
			list: {type: Object, default: []},
			frozen: {type: Object, default: []},
			exclude: {type: Object, default: []}
		},
		
		methods: {
			toggle(key) {
				if ((idx = this.value.indexOf(key)) == -1) {
					this.value.push(key);
				} else {
					this.value.splice(idx, 1);
				}
			}
		}, template: `<b-dropdown aria-role="list" position="is-top-right" :close-on-click="false"><label class="b-checkbox checkbox is-marginless" slot="trigger" aria-role="listitem">{{title}}</label> <b-dropdown-item v-for="(val, key) in list" @click="toggle(key)" :disabled="frozen.indexOf(key) != -1" v-if="exclude.indexOf(key) == -1"><i class="fa fa-check has-mr-1" :class="{'is-invisible': value.indexOf(key) == -1 && frozen.indexOf(key) == -1}"></i>{{val}}</b-dropdown-item> </b-dropdown>`});

window.$app.defineComponent("component", "vue-component-editor", {props: {
		id: {
		  type: String,
		  default: "quill-container"
		},
		placeholder: {
		  type: String,
		  default: ""
		},
		value: {
		  type: String,
		  default: ""
		},
		classname: {
		  type: String,
		  default: ""
		},
		disabled: {
		  type: Boolean
		},
		editorToolbar: Array,
		editorOptions: {
		  type: Object,
		  required: false,
		  default: () => ({})
		},
		useCustomImageHandler: {
		  type: Boolean,
		  default: false
		},
		},
		data: () => ({
		quill: null
		}),
		mounted() {
			$mx.lazy('quill.js', 'quill.css', (v) => {
				this.registerPrototypes();
				this.initializeEditor();
			});
		},
		methods: {
		initializeEditor() {
		  this.setupQuillEditor();
		  this.checkForCustomImageHandler();
		  this.handleInitialContent();
		  this.registerEditorEventListeners();
		  this.$emit("ready", this.quill);
		},
		setupQuillEditor() {
		  let editorConfig = {
		    debug: false,
		    modules: this.setModules(),
		    theme: "snow",
		    placeholder: this.placeholder ? this.placeholder : "",
		    readOnly: this.disabled ? this.disabled : false
		  };
		  this.prepareEditorConfig(editorConfig);
		  
			var Block = Quill.import('blots/block');
			Block.tagName = 'div';
			Quill.register(Block);
		  
		  this.quill = new Quill(this.$refs.quillContainer, editorConfig);
		},
		setModules() {
			let defaultToolbar = [
				[{ 'header': [1, 2, 3, false] }],
				['bold', 'italic'/* , 'underline' */],      
				//['code-block'],

				[{ 'list': 'ordered'}, { 'list': 'bullet' }],
				[{ 'indent': '-1'}, { 'indent': '+1' }],


				//  [{ 'color': [] }, { 'background': [] }],    
				[{ 'align': [] }],
				//['link', 'image'],
				['clean']  
			];
			
		  let modules = {
		    toolbar: this.editorToolbar ? this.editorToolbar : defaultToolbar,
		    imageUpload: {
				parent: this
			}
		  };
		  return modules;
		},
		prepareEditorConfig(editorConfig) {
		  if (
		    Object.keys(this.editorOptions).length > 0 &&
		    this.editorOptions.constructor === Object
		  ) {
		    if (
		      this.editorOptions.modules &&
		      typeof this.editorOptions.modules.toolbar !== "undefined"
		    ) {
		      // We don't want to merge default toolbar with provided toolbar.
		      delete editorConfig.modules.toolbar;
		    }
		    merge(editorConfig, this.editorOptions);
		  }
		},
		registerPrototypes() {
		  Quill.prototype.getHTML = function() {
		    return this.container.querySelector(".ql-editor").innerHTML;
		  };
		  Quill.prototype.getWordCount = function() {
		    return this.container.querySelector(".ql-editor").innerText.length;
		  };
		},
		registerEditorEventListeners() {
		  this.quill.on("text-change", this.handleTextChange);
		  this.quill.on("selection-change", this.handleSelectionChange);
		  this.listenForEditorEvent("text-change");
		  this.listenForEditorEvent("selection-change");
		  this.listenForEditorEvent("editor-change");
		},
		listenForEditorEvent(type) {
		  this.quill.on(type, (...args) => {
		    this.$emit(type, ...args);
		  });
		},
		handleInitialContent() {
		  if (this.value) this.quill.root.innerHTML = this.value; // Set initial editor content
		},
		handleSelectionChange(range, oldRange) {
		  if (!range && oldRange) this.$emit("blur", this.quill);
		  else if (range && !oldRange) this.$emit("focus", this.quill);
		},
		handleTextChange() {
		  let editorContent =
		    this.quill.getHTML() === "<p><br></p>" ? "" : this.quill.getHTML();
		  this.$emit("input", editorContent);
		},
		checkForCustomImageHandler() {
		  this.useCustomImageHandler === true ? this.setupCustomImageHandler() : "";
		},
		setupCustomImageHandler() {
		  let toolbar = this.quill.getModule("toolbar");
		  toolbar.addHandler("image", this.customImageHandler);
		},
		customImageHandler(image, callback) {
		  this.$refs.fileInput.click();
		},
		emitImageInfo($event) {
		  const resetUploader = function() {
		    var uploader = document.getElementById("file-upload");
		    uploader.value = "";
		  };
		  let file = $event.target.files[0];
		  let Editor = this.quill;
		  let range = Editor.getSelection();
		  let cursorLocation = range.index;
		  this.$emit("imageAdded", file, Editor, cursorLocation, resetUploader);
		}
		},
		watch: {
		value(val) {
		  if (val != this.quill.root.innerHTML && !this.quill.hasFocus()) {
		    this.quill.root.innerHTML = val;
		  }
		},
		disabled(status) {
		  this.quill.enable(!status);
		}
		},
		beforeDestroy() {
		this.quill = null;
		delete this.quill;
		}, template: `<div class="quillWrapper"> <div :id="id" ref="quillContainer" class="input is-block" :class="classname" style="height:auto;min-height: 300px"></div> </div>`});

window.$app.defineComponent("component", "vue-component-emoji-picker-categories", {data: () => ({
    categories: [
      { name: "Frequenty", icon: "frequenty" },
      { name: "Peoples", icon: "peoples" },
      { name: "Nature", icon: "nature" },
      { name: "Foods", icon: "foods" },
      { name: "Activity", icon: "activity" },
      { name: "Objects", icon: "objects" },
      { name: "Places", icon: "places" },
      { name: "Symbols", icon: "symbols" },
      { name: "Flags", icon: "flags" }
    ],
    icons: {
		activity: `
		<svg style="max-height:18px" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 303.6 303.6" fill="gray">
		<path d="M291.503 11.6c-10.4-10.4-37.2-11.6-48.4-11.6-50.4 0-122.4 18.4-173.6 69.6-77.2 76.8-78.4 201.6-58.4 222 10.8 10.4 35.6 12 49.2 12 49.6 0 121.2-18.4 173.2-70 76.4-76.4 80.4-199.6 58-222zm-231.2 277.2c-24.4 0-36-4.8-38.8-7.6-5.2-5.2-8.4-24.4-6.8-49.6l57.2 56.8c-4 .4-8 .4-11.6.4zm162.8-66c-38.8 38.8-90.4 57.2-132.4 63.6l-74-73.6c6-42 24-94 63.2-133.2 38-38 88-56.4 130.8-62.8l75.6 75.6c-6 40.8-24.4 91.6-63.2 130.4zm65.2-148.8l-58.8-59.2c4.8-.4 9.2-.4 13.6-.4 24.4 0 35.6 4.8 38 7.2 5.6 5.6 9.2 25.6 7.2 52.4z"/>
		<path d="M215.103 139.6l-20.8-20.8 13.2-13.2c2.8-2.8 2.8-7.6 0-10.4s-7.6-2.8-10.4 0l-13.2 13.6-20.8-20.8c-2.8-2.8-7.6-2.8-10.4 0-2.8 2.8-2.8 7.6 0 10.4l20.8 20.8-22 22-20.8-20.8c-2.8-2.8-7.6-2.8-10.4 0s-2.8 7.6 0 10.4l20.8 20.8-22 22-20.8-20.8c-2.8-2.8-7.6-2.8-10.4 0s-2.8 7.6 0 10.4l20.8 20.8-13.2 13.2c-2.8 2.8-2.8 7.6 0 10.4 1.6 1.6 3.2 2 5.2 2s3.6-.8 5.2-2l13.2-13.2 20.8 20.8c1.6 1.6 3.2 2 5.2 2s3.6-.8 5.2-2c2.8-2.8 2.8-7.6 0-10.4l-20.8-21.2 22-22 20.8 20.8c1.6 1.6 3.2 2 5.2 2s3.6-.8 5.2-2c2.8-2.8 2.8-7.6 0-10.4l-20.8-20.8 22-22 20.8 20.8c1.6 1.6 3.2 2 5.2 2s3.6-.8 5.2-2c2.8-2.8 2.8-7.6 0-10.4zM169.103 47.6c-1.2-4-5.2-6-9.2-4.8-3.2 1.2-80.8 25.6-110.4 98-1.6 4 0 8.4 4 9.6.8.4 2 .4 2.8.4 2.8 0 5.6-1.6 6.8-4.4 27.2-66 100.4-89.6 101.2-89.6 4-1.2 6-5.2 4.8-9.2z"/>
		</svg>
		`,
		flags: `
		<svg style="max-height:18px" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="gray">
		<path d="M472.928 34.72c-4.384-2.944-9.984-3.52-14.912-1.568-1.088.448-106.528 42.176-195.168.384C186.752-2.4 102.944 14.4 64 25.76V16c0-8.832-7.168-16-16-16S32 7.168 32 16v480c0 8.832 7.168 16 16 16s16-7.168 16-16V315.296c28.352-9.248 112.384-31.232 185.184 3.168 34.592 16.352 70.784 21.792 103.648 21.792 63.2 0 114.016-20.128 117.184-21.408 6.016-2.464 9.984-8.32 9.984-14.848V48c0-5.312-2.656-10.272-7.072-13.28zM448 292.672c-28.512 9.248-112.512 31.136-185.184-3.168C186.752 253.6 102.944 270.4 64 281.76V59.328c28.352-9.248 112.384-31.232 185.184 3.168 76 35.872 159.872 19.104 198.816 7.712v222.464z"/>
		</svg>
		`,
		foods: `
		<svg style="max-height:18px" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.999 511.999" fill="gray">
		<path d="M413.949 155.583a10.153 10.153 0 0 0-3.24-2.16c-.61-.25-1.24-.44-1.87-.57-3.25-.66-6.701.41-9.03 2.73a10.093 10.093 0 0 0-2.93 7.07 10.098 10.098 0 0 0 1.69 5.56c.36.54.779 1.05 1.24 1.52 1.86 1.86 4.44 2.93 7.07 2.93.65 0 1.31-.07 1.96-.2.63-.13 1.26-.32 1.87-.57a10.146 10.146 0 0 0 3.24-2.16c.47-.47.88-.98 1.25-1.52a10.098 10.098 0 0 0 1.49-3.6 10.038 10.038 0 0 0-2.74-9.03zM115.289 385.873c-.12-.64-.32-1.27-.57-1.87-.25-.6-.55-1.18-.91-1.73-.37-.54-.79-1.06-1.25-1.52a9.57 9.57 0 0 0-1.52-1.24c-.54-.36-1.12-.67-1.72-.92-.61-.25-1.24-.44-1.88-.57a9.847 9.847 0 0 0-3.9 0c-.64.13-1.27.32-1.87.57-.61.25-1.19.56-1.73.92-.55.36-1.06.78-1.52 1.24-.46.46-.88.98-1.24 1.52-.36.55-.67 1.13-.92 1.73-.25.6-.45 1.23-.57 1.87-.13.651-.2 1.3-.2 1.96 0 .65.07 1.3.2 1.95.12.64.32 1.27.57 1.87.25.6.56 1.18.92 1.73.36.54.78 1.06 1.24 1.52.46.46.97.88 1.52 1.24.54.36 1.12.67 1.73.92.6.25 1.23.44 1.87.57s1.3.2 1.95.2c.65 0 1.31-.07 1.95-.2.64-.13 1.27-.32 1.88-.57.6-.25 1.18-.56 1.72-.92.55-.36 1.059-.78 1.52-1.24.46-.46.88-.98 1.25-1.52.36-.55.66-1.13.91-1.73.25-.6.45-1.23.57-1.87.13-.65.2-1.3.2-1.95 0-.66-.07-1.31-.2-1.96z"/>
		<path d="M511.999 222.726c0-14.215-9.228-26.315-22.007-30.624-1.628-74.155-62.456-133.978-136.994-133.978H159.002c-74.538 0-135.366 59.823-136.994 133.978C9.228 196.411 0 208.51 0 222.726a32.076 32.076 0 0 0 3.847 15.203 44.931 44.931 0 0 0-.795 8.427v.708c0 14.06 6.519 26.625 16.693 34.833-10.178 8.275-16.693 20.891-16.693 35.001 0 15.114 7.475 28.515 18.921 36.702v26.668c0 40.588 33.021 73.608 73.608 73.608h320.836c40.588 0 73.608-33.021 73.608-73.608V353.6c11.446-8.186 18.921-21.587 18.921-36.702 0-13.852-6.354-26.385-16.361-34.702 9.983-8.212 16.361-20.656 16.361-34.562v-.708c0-2.985-.294-5.944-.877-8.845a32.082 32.082 0 0 0 3.93-15.355zM44.033 173.229h322.441c5.523 0 10-4.477 10-10s-4.477-10-10-10H49.737c16.896-43.883 59.503-75.106 109.265-75.106h193.996c62.942 0 114.438 49.953 116.934 112.295H42.068c.234-5.848.9-11.588 1.965-17.189zM23.052 316.896c0-13.837 11.257-25.094 25.094-25.094h117.298l55.346 50.188H48.146c-13.837 0-25.094-11.256-25.094-25.094zm.976-62.945c.422.111.847.215 1.275.309 7.421 1.634 14.68 8.002 22.365 14.744a576.29 576.29 0 0 0 3.206 2.799h-3.081c-11.253-.001-20.774-7.551-23.765-17.852zm308.727 89.752l57.233-51.899 49.904.57-81.871 74.24-25.266-22.911zm7.861 34.126H295.12l17.467-15.839h10.563l17.466 15.839zm19.599-86.027l-82.499 74.811-82.499-74.811h164.998zm-59.529-20c.849-.842 1.677-1.675 2.49-2.493 9.531-9.587 17.059-17.16 32.89-17.16 15.832 0 23.359 7.573 32.89 17.162.812.817 1.64 1.65 2.489 2.491h-70.759zm-160.13 0a485.82 485.82 0 0 0 2.489-2.492c9.531-9.588 17.059-17.161 32.89-17.161 15.83 0 23.358 7.573 32.888 17.16.813.818 1.641 1.651 2.49 2.493h-70.757zm275.862 162.073H95.582c-29.56 0-53.608-24.049-53.608-53.608v-18.275h200.872l17.467 15.839H145.897c-5.523 0-10 4.477-10 10s4.477 10 10 10H467.07c-7.288 20.958-27.242 36.044-50.652 36.044zm53.608-56.046h-94.6l17.467-15.839h77.133v15.839zm-6.174-35.837h-48.906l54.624-49.533c11.135 2.604 19.376 12.665 19.376 24.439 0 13.836-11.257 25.094-25.094 25.094zm-2.728-70.19l.262-.227.101-.087.342-.298c.848-.738 1.682-1.469 2.501-2.187 4.105-3.601 8.089-7.095 12.04-9.819 3.446-2.375 6.868-4.164 10.326-4.925l.359-.081.04-.01.317-.076.065-.016a22.897 22.897 0 0 0 .42-.107l.196-.052a.374.374 0 0 0 .048-.012c-2.433 9.276-10.129 16.443-19.691 18.102a9.984 9.984 0 0 0-2.016-.205h-5.31zm21.271-37.073a40.746 40.746 0 0 0-4.536 1.281c-10.109 3.489-18.327 10.602-26.283 17.58l-.434.381c-9.178 8.052-17.923 15.723-29.033 17.834h-13.146c-11.249-1.93-17.833-8.552-25.823-16.591-10.213-10.275-22.923-23.062-47.074-23.062-24.15 0-36.86 12.786-47.074 23.06-7.992 8.04-14.576 14.663-25.829 16.593h-14.327c-11.253-1.93-17.837-8.553-25.829-16.593-10.213-10.274-22.923-23.06-47.072-23.06-24.151 0-36.861 12.787-47.074 23.062-7.991 8.039-14.574 14.661-25.824 16.591h-7.065c-14.134 0-24.325-8.939-35.113-18.404-9.248-8.112-18.81-16.501-31.252-19.241a12.237 12.237 0 0 1-7.025-4.453 10.027 10.027 0 0 0-1.153-1.252 12.234 12.234 0 0 1-1.428-5.727c-.001-6.788 5.52-12.309 12.307-12.309h447.384c6.787 0 12.308 5.521 12.308 12.308 0 5.729-4.039 10.776-9.605 12.002z"/>
		</svg>
		`,
		frequenty: `
		<svg style="max-height:18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 219.15 219.15" width="24" height="24" fill="gray">
		<path d="M109.575 0C49.156 0 .001 49.155.001 109.574c0 60.42 49.154 109.576 109.573 109.576 60.42 0 109.574-49.156 109.574-109.576C219.149 49.155 169.995 0 109.575 0zm0 204.15c-52.148 0-94.573-42.427-94.573-94.576C15.001 57.426 57.427 15 109.575 15c52.148 0 94.574 42.426 94.574 94.574 0 52.15-42.426 94.576-94.574 94.576z"/>
		<path d="M166.112 108.111h-52.051V51.249a7.5 7.5 0 0 0-15 0v64.362a7.5 7.5 0 0 0 7.5 7.5h59.551a7.5 7.5 0 0 0 0-15z"/>
		</svg>
		`,
		nature: `
		<svg style="max-height:18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="gray">
		<path d="M490.815 3.784C480.082 5.7 227.049 51.632 148.477 130.203c-39.153 39.153-64.259 87.884-70.694 137.218-5.881 45.081 4.347 85.929 28.878 116.708L.001 490.789 21.212 512l106.657-106.657c33.094 26.378 75.092 34.302 116.711 28.874 49.334-6.435 98.065-31.541 137.218-70.695C460.368 284.951 506.3 31.918 508.216 21.185L511.999 0l-21.184 3.784zm-43.303 39.493L309.407 181.383l-7.544-98.076c46.386-15.873 97.819-29.415 145.649-40.03zm-174.919 50.64l8.877 115.402-78.119 78.119-11.816-153.606c19.947-13.468 47.183-26.875 81.058-39.915zm-109.281 64.119l12.103 157.338-47.36 47.36c-39.246-52.892-24.821-139.885 35.257-204.698zm57.113 247.849c-26.548-.001-51.267-7.176-71.161-21.938l47.363-47.363 157.32 12.102c-40.432 37.475-89.488 57.201-133.522 57.199zm157.743-85.421l-153.605-11.816 78.118-78.118 115.403 8.877c-13.04 33.876-26.448 61.111-39.916 81.057zm50.526-110.326l-98.076-7.544L468.725 64.485c-10.589 47.717-24.147 99.232-40.031 145.653z"/>
		</svg>
		`,
		objects: `
		<svg style="max-height:18px" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 792 792" fill="gray">
		<path d="M425.512 741.214H365.58c-14.183 0-25.164 11.439-25.164 25.622S351.397 792 365.58 792h59.932c15.101 0 26.54-10.981 26.54-25.164s-11.44-25.622-26.54-25.622zM472.638 671.209H319.821c-14.183 0-26.081 10.98-26.081 25.163s11.898 25.164 26.081 25.164h152.817c14.183 0 25.164-10.981 25.164-25.164s-10.982-25.163-25.164-25.163zM639.188 138.634c-25.164-42.548-59.181-76.135-102.49-101.113C493.526 12.621 446.566 0 395.771 0 320.28 0 247.19 31.684 197.205 81.445c-49.761 49.527-81.904 121.24-81.904 196.282 0 33.861 7.779 68.629 22.879 103.866 15.1 35.228 38.565 78.614 70.005 130.396 7.448 12.269 15.764 31.205 25.623 56.271 12.104 30.757 22.87 51.713 31.566 63.602 5.027 6.872 11.899 10.063 20.596 10.063h228.766c9.605 0 16.359-4.188 21.504-11.898 6.754-10.132 13.987-27.516 22.42-51.693 8.951-25.691 16.838-43.982 23.329-55.364 30.571-53.587 54.446-99.747 70.464-137.717 16.018-37.979 24.246-74.124 24.246-107.526 0-49.878-12.347-96.545-37.511-139.093zm-35.696 232.437c-15.012 34.348-36.398 76.974-65.427 126.736-9.41 16.125-18.458 37.003-26.989 63.592-3.367 10.474-7.32 20.596-11.439 30.2H300.153c-6.862-11.439-12.26-25.837-18.761-42.089-12.718-31.801-23.338-52.621-30.2-64.061-28.824-48.043-49.868-87.39-64.051-118.957s-20.537-60.859-21.044-88.766c-2.235-121.718 106.13-228.991 229.674-226.941 41.631.693 80.527 10.063 115.765 30.659 35.227 20.586 63.134 48.043 83.729 82.812 20.586 34.768 31.108 72.748 31.108 113.47-.001 27.449-7.692 58.596-22.881 93.345z"/>
		</svg>
		`,
		peoples: `
		<svg style="max-height:18px" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 106.059 106.059" fill="gray">
		<path d="M90.544 90.542c20.687-20.684 20.685-54.341.002-75.024-20.688-20.689-54.347-20.689-75.031-.006-20.688 20.687-20.686 54.346.002 75.034 20.682 20.684 54.341 20.684 75.027-.004zM21.302 21.3c17.494-17.493 45.959-17.495 63.457.002 17.494 17.494 17.492 45.963-.002 63.455-17.494 17.494-45.96 17.496-63.455.003-17.498-17.498-17.496-45.966 0-63.46zM27 69.865s-2.958-11.438 6.705-8.874c0 0 17.144 9.295 38.651 0 9.662-2.563 6.705 8.874 6.705 8.874C73.539 86.824 53.03 85.444 53.03 85.444S32.521 86.824 27 69.865zm6.24-31.194a6.202 6.202 0 1 1 12.399.001 6.202 6.202 0 0 1-12.399-.001zm28.117 0a6.202 6.202 0 1 1 12.403.001 6.202 6.202 0 0 1-12.403-.001z"/>
		</svg>
		`,
		places: `
		<svg style="max-height:18px" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 611.999 611.998" fill="gray">
		<path d="M596.583 15.454C586.226 5.224 573.354.523 558.423.523c-15.597 0-31.901 4.906-49.452 14.599-17.296 9.551-32.851 20.574-46.458 32.524h-.665c-2.655 2.322-10.953 10.287-25.219 24.553-14.272 14.272-26.217 26.223-35.845 36.51L112.401 26.406c-6.896-1.968-12.928.014-17.593 4.645L46.687 78.839c-4.326 4.297-5.805 9.268-4.977 15.597.829 6.287 3.979 10.627 9.629 13.607L280.32 228.839 161.514 347.978l-95.91 3.32c-4.645.164-8.637 1.643-12.276 5.311L5.872 404.397c-4.312 4.34-6.641 9.289-5.643 16.262 1.657 6.967 5.31 11.611 11.618 13.602l117.142 48.787 48.787 117.148c2.421 5.812 6.634 9.621 13.607 11.279h3.313c4.977 0 9.296-1.658 12.942-5.311l47.456-47.457c3.653-3.645 5.494-7.965 5.643-12.275l3.32-95.91 118.807-118.807 121.128 228.99c2.988 5.643 7.32 8.793 13.607 9.621 6.329.836 11.271-1.316 15.597-5.643l47.456-47.457c4.978-4.977 6.945-10.697 4.978-17.586l-82.296-288.389 59.732-59.739c10.287-10.287 21.699-24.149 33.183-45.134 5.777-10.542 10.032-20.886 12.942-31.194 5.722-20.218 3.258-44.07-12.608-59.73zm-59.4 110.176l-67.039 67.372c-5.628 5.657-6.811 11.122-4.977 17.586l81.637 288.388-22.563 22.238L403.438 292.89c-2.98-5.643-7.299-8.963-12.941-9.621-6.301-1.331-11.611.325-16.263 4.977l-141.37 141.37c-2.987 2.986-4.644 6.973-5.643 11.949l-3.32 95.904-22.896 23.236-41.48-98.566c-1.331-4.645-4.553-8.184-9.629-10.287L51.338 411.03l23.229-22.895 95.578-3.654c5.643-.99 9.622-2.654 12.276-5.309l141.37-141.371c4.651-4.645 6.308-9.954 4.984-16.262-.666-5.643-3.986-9.954-9.629-12.942L90.829 87.47l22.231-22.238 288.389 81.637c6.464 1.833 11.951.666 17.587-4.977l28.545-28.539 26.217-25.884 11.278-11.285 1.331-.666c27.873-23.895 55.088-38.16 72.016-38.16 5.969 0 9.954 1.324 11.611 3.979 18.917 18.585-21.099 72.484-32.851 84.293z"/>
		</svg>
		`,
		symbols: `
		<svg style="max-height:18px" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 511.626 511.626" fill="gray">
		<path d="M475.366 71.949c-24.175-23.606-57.575-35.404-100.215-35.404-11.8 0-23.843 2.046-36.117 6.136-12.279 4.093-23.702 9.615-34.256 16.562-10.568 6.945-19.65 13.467-27.269 19.556a263.828 263.828 0 0 0-21.696 19.414 264.184 264.184 0 0 0-21.698-19.414c-7.616-6.089-16.702-12.607-27.268-19.556-10.564-6.95-21.985-12.468-34.261-16.562-12.275-4.089-24.316-6.136-36.116-6.136-42.637 0-76.039 11.801-100.211 35.404C12.087 95.55 0 128.286 0 170.16c0 12.753 2.24 25.891 6.711 39.398 4.471 13.514 9.566 25.031 15.275 34.546 5.708 9.514 12.181 18.792 19.414 27.834 7.233 9.041 12.519 15.272 15.846 18.698 3.33 3.426 5.948 5.903 7.851 7.427L243.25 469.938c3.427 3.426 7.614 5.144 12.562 5.144s9.138-1.718 12.563-5.144l177.87-171.31c43.588-43.58 65.38-86.406 65.38-128.472.001-41.877-12.085-74.61-36.259-98.207zm-53.961 199.846L255.813 431.391 89.938 271.507C54.344 235.922 36.55 202.133 36.55 170.156c0-15.415 2.046-29.026 6.136-40.824 4.093-11.8 9.327-21.177 15.703-28.124 6.377-6.949 14.132-12.607 23.268-16.988 9.141-4.377 18.086-7.328 26.84-8.85 8.754-1.52 18.079-2.281 27.978-2.281 9.896 0 20.557 2.424 31.977 7.279 11.418 4.853 21.934 10.944 31.545 18.271 9.613 7.332 17.845 14.183 24.7 20.557 6.851 6.38 12.559 12.229 17.128 17.559 3.424 4.189 8.091 6.283 13.989 6.283 5.9 0 10.562-2.094 13.99-6.283 4.568-5.33 10.28-11.182 17.131-17.559 6.852-6.374 15.085-13.222 24.694-20.557 9.613-7.327 20.129-13.418 31.553-18.271 11.416-4.854 22.08-7.279 31.977-7.279s19.219.761 27.977 2.281c8.757 1.521 17.702 4.473 26.84 8.85 9.137 4.38 16.892 10.042 23.267 16.988 6.376 6.947 11.612 16.324 15.705 28.124 4.086 11.798 6.132 25.409 6.132 40.824-.002 31.977-17.89 65.86-53.675 101.639z"/>
		</svg>
		`
		},
    active: 1
  }),
  methods: {
    onSelect(index) {
      this.active = index;

      const _category = this.categories[index];
      this.$emit("select", _category);
    }
  }, template: `<div class="emoji-picker-categories"> <div :class="['category', { active: index=== active }]" v-for="(categorie, index) in categories" :key="index" @click="onSelect(index)" v-html="icons[categorie.icon]"> </div> </div>`});

window.$app.defineComponent("component", "vue-component-emoji-picker-list", {props: {
		data: { type: Object, required: true },
		category: { type: String }
	},
	methods: {
		onSelect(emoji) {
			this.$emit("select", emoji);
		}
	},
	watch: {
		data() {
			this.$refs["container-emoji"].scrollTop = 0;
		},
		category(new_category) {
			if (this.continuousList) {
				const firstItemCategory = this.$refs[new_category][0];
				const scrollTop = firstItemCategory.offsetTop - 80;
			
				this.$refs["container-emoji"].scrollTop = scrollTop;
			}
		}
	}, template: `<div class="emoji-picker-list"> <div ref="container-emoji" class="container-emoji"> <div class="grid-emojis"> <span class="emoji" v-html="emoji" v-for="(emoji, index) in data[this.category]" :key="index" @click="onSelect(emoji)"/> </div> </div> </div>`});

window.$app.defineComponent("component", "vue-component-emoji-picker", {props: {
		value: Object,
		emojisByRow: { type: Number, default: 5 },
		continuousList: { type: Boolean, default: () => false }
	},
	data: () => ({
		mapEmojis: {},
		category: "Peoples",
		filterEmoji: "",
		show: false,
		inited: false,
		editor: null
	}),
	computed: {
		emojis() {
			return this.mapEmojis;
		}
	},
	watch: {
		show(v) {
			if (!this.inited) this.editor[0].focus();
			this.inited |= v;
		}	
	},
	created() {
		this.mapperData();
		$mx(document.body).on('click', this.onMouseDown);
	},
	mounted() {
		this.editor = $mx(this.$refs.root).find('textarea,input');
	},
	methods: {
		onMouseDown(e) {
			if (!e.target.closest('.emoji-picker-container') || ['TEXTAREA', 'INPUT'].indexOf(e.target.tagName) != -1) this.show = false;
		},
		
		onChangeCategory(category) {
			this.category = category.name;
			this.$emit("changeCategory", this.category);
		},
		
		onSelectEmoji(emoji) {
			this.updateFrequenty(emoji);

			let o = this.editor[0];

			if (document.selection) {
				//For browsers like Internet Explorer
				o.focus();
				var sel = document.selection.createRange();
				sel.text = emoji;
				o.focus();
			}
			else if (o.selectionStart || o.selectionStart == '0') {
				//For browsers like Firefox and Webkit based
				var startPos = o.selectionStart;
				var endPos = o.selectionEnd;
				var scrollTop = o.scrollTop;
				o.value = o.value.substring(0, startPos)+emoji+o.value.substring(endPos,o.value.length);
				o.focus();
				o.selectionStart = startPos + emoji.length;
				o.selectionEnd = startPos + emoji.length;
				o.scrollTop = scrollTop;
			} else {
				o.value += emoji;
				o.focus();
			}
			
			this.$emit('input', o.value);
		},
		
		updateFrequenty(emoji) {
			let frequenty = this.mapEmojis["Frequenty"];
			
			let idx = frequenty.indexOf(emoji);
			if (idx != -1) frequenty.splice(idx, 1);
			
			frequenty.unshift(emoji);
			this.mapEmojis["Frequenty"] = frequenty = frequenty.slice(0, 40);
			
			Storage.set('emoji.frequenty', frequenty);
		},
		
		mapperData() {
			let dataEmojis = {
				Frequenty: Storage.get('emoji.frequenty', []),
				Peoples: [ "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😌", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "😘", "😗", "😙", "😚", "😋", "😜", "😝", "😛", "🤑", "🤗", "🤓", "😎", "🤡", "🤠", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "😤", "😠", "😡", "😶", "😐", "😑", "😯", "😦", "😧", "😮", "😲", "😵", "😳", "😱", "😨", "😰", "😢", "😥", "🤤", "😭", "😓", "😪", "😴", "🙄", "🤔", "🤥", "😬", "🤐", "🤢", "🤧", "😷", "🤒", "🤕", "😈", "👿", "👹", "👺", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "👐", "🙌", "👏", "🙏", "🤝", "👍", "👎", "👊", "✊", "🤛", "🤜", "🤞", "✌️", "🤘", "👌", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐", "🖖", "👋", "🤙", "💪", "🖕", "✍️", "🤳", "💅", "💍", "💄", "💋", "👄", "👅", "👂", "👃", "👣", "👁", "👀", "🗣", "👤", "👥", "👶", "👦", "👧", "👨", "👩", "👱‍♀", "👱", "👴", "👵", "👲", "👳‍♀", "👳", "👮‍♀", "👮", "👷‍♀", "👷", "💂‍♀", "💂", "👩‍⚕", "👨‍⚕", "👩‍🌾", "👨‍🌾", "👩‍🍳", "👨‍🍳", "👩‍🎓", "👨‍🎓", "👩‍🎤", "👨‍🎤", "👩‍🏫", "👨‍🏫", "👩‍🏭", "👨‍🏭", "👩‍💻", "👨‍💻", "👩‍💼", "👨‍💼", "👩‍🔧", "👨‍🔧", "👩‍🔬", "👨‍🔬", "👩‍🎨", "👨‍🎨", "👩‍🚒", "👨‍🚒", "👩‍🚀", "👨‍🚀", "🤶", "🎅", "👸", "🤴", "👰", "🤵", "👼", "🤰", "🙇‍♀", "🙇", "💁", "💁‍♂", "🙅", "🙅‍♂", "🙆", "🙆‍♂", "🙋", "🙋‍♂", "🤦‍♀", "🤦‍♂", "🤷‍♀", "🤷‍♂", "🙎", "🙎‍♂", "🙍", "🙍‍♂", "💇", "💇‍♂", "💆", "💆‍♂", "🕴", "💃", "🕺", "👯", "👯‍♂", "🚶‍♀", "🚶", "🏃‍♀", "🏃", "👫", "👭", "👬", "💑", "👩‍❤️‍👩", "👨‍❤️‍👨", "💏", "👩‍❤️‍💋‍👩", "👨‍❤️‍💋‍👨", "👪", "👨‍👩‍👧", "👨‍👩‍👧‍👦", "👨‍👩‍👦‍👦", "👨‍👩‍👧‍👧", "👩‍👩‍👦", "👩‍👩‍👧", "👩‍👩‍👧‍👦", "👩‍👩‍👦‍👦", "👩‍👩‍👧‍👧", "👨‍👨‍👦", "👨‍👨‍👧", "👨‍👨‍👧‍👦", "👨‍👨‍👦‍👦", "👨‍👨‍👧‍👧", "👩‍👦", "👩‍👧", "👩‍👧‍👦", "👩‍👦‍👦", "👩‍👧‍👧", "👨‍👦", "👨‍👧", "👨‍👧‍👦", "👨‍👦‍👦", "👨‍👧‍👧", "👚", "👕", "👖", "👔", "👗", "👙", "👘", "👠", "👡", "👢", "👞", "👟", "👒", "🎩", "🎓", "👑", "⛑", "🎒", "👝", "👛", "👜", "💼", "👓", "🕶", "🌂", "☂️" ], 
				Nature: [ "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐚", "🐞", "🐜", "🕷", "🕸", "🐢", "🐍", "🦎", "🦂", "🦀", "🦑", "🐙", "🦐", "🐠", "🐟", "🐡", "🐬", "🦈", "🐳", "🐋", "🐊", "🐆", "🐅", "🐃", "🐂", "🐄", "🦌", "🐪", "🐫", "🐘", "🦏", "🦍", "🐎", "🐖", "🐐", "🐏", "🐑", "🐕", "🐩", "🐈", "🐓", "🦃", "🕊", "🐇", "🐁", "🐀", "🐿", "🐾", "🐉", "🐲", "🌵", "🎄", "🌲", "🌳", "🌴", "🌱", "🌿", "☘️", "🍀", "🎍", "🎋", "🍃", "🍂", "🍁", "🍄", "🌾", "💐", "🌷", "🌹", "🥀", "🌻", "🌼", "🌸", "🌺", "🌎", "🌍", "🌏", "🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓", "🌔", "🌚", "🌝", "🌞", "🌛", "🌜", "🌙", "💫", "⭐️", "🌟", "✨", "⚡️", "🔥", "💥", "☄", "☀️", "🌤", "⛅️", "🌥", "🌦", "🌈", "☁️", "🌧", "⛈", "🌩", "🌨", "☃️", "⛄️", "❄️", "🌬", "💨", "🌪", "🌫", "🌊", "💧", "💦", "☔️" ], 
				Foods: [ "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🍍", "🥝", "🥑", "🍅", "🍆", "🥒", "🥕", "🌽", "🌶", "🥔", "🍠", "🌰", "🥜", "🍯", "🥐", "🍞", "🥖", "🧀", "🥚", "🍳", "🥓", "🥞", "🍤", "🍗", "🍖", "🍕", "🌭", "🍔", "🍟", "🥙", "🌮", "🌯", "🥗", "🥘", "🍝", "🍜", "🍲", "🍥", "🍣", "🍱", "🍛", "🍚", "🍙", "🍘", "🍢", "🍡", "🍧", "🍨", "🍦", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🥛", "🍼", "☕️", "🍵", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹", "🍾", "🥄", "🍴", "🍽" ], 
				Activity: [ "⚽️", "🏀", "🏈", "⚾️", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🥅", "🏒", "🏑", "🏏", "⛳️", "🏹", "🎣", "🥊", "🥋", "⛸", "🎿", "⛷", "🏂", "🏋️‍♀️", "🏋", "🤺", "🤼‍♀", "🤼‍♂", "🤸‍♀", "🤸‍♂", "⛹️‍♀️", "⛹", "🤾‍♀", "🤾‍♂", "🏌️‍♀️", "🏌", "🏄‍♀", "🏄", "🏊‍♀", "🏊", "🤽‍♀", "🤽‍♂", "🚣‍♀", "🚣", "🏇", "🚴‍♀", "🚴", "🚵‍♀", "🚵", "🎽", "🏅", "🎖", "🥇", "🥈", "🥉", "🏆", "🏵", "🎗", "🎫", "🎟", "🎪", "🤹‍♀", "🤹‍♂", "🎭", "🎨", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🎷", "🎺", "🎸", "🎻", "🎲", "🎯", "🎳", "🎮", "🎰" ], 
				Places: [ "🚗", "🚕", "🚙", "🚌", "🚎", "🏎", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🛴", "🚲", "🛵", "🏍", "🚨", "🚔", "🚍", "🚘", "🚖", "🚡", "🚠", "🚟", "🚃", "🚋", "🚞", "🚝", "🚄", "🚅", "🚈", "🚂", "🚆", "🚇", "🚊", "🚉", "🚁", "🛩", "✈️", "🛫", "🛬", "🚀", "🛰", "💺", "🛶", "⛵️", "🛥", "🚤", "🛳", "⛴", "🚢", "⚓️", "🚧", "⛽️", "🚏", "🚦", "🚥", "🗺", "🗿", "🗽", "⛲️", "🗼", "🏰", "🏯", "🏟", "🎡", "🎢", "🎠", "⛱", "🏖", "🏝", "⛰", "🏔", "🗻", "🌋", "🏜", "🏕", "⛺️", "🛤", "🛣", "🏗", "🏭", "🏠", "🏡", "🏘", "🏚", "🏢", "🏬", "🏣", "🏤", "🏥", "🏦", "🏨", "🏪", "🏫", "🏩", "💒", "🏛", "⛪️", "🕌", "🕍", "🕋", "⛩", "🗾", "🎑", "🏞", "🌅", "🌄", "🌠", "🎇", "🎆", "🌇", "🌆", "🏙", "🌃", "🌌", "🌉", "🌁" ], 
				Objects: [ "⌚️", "📱", "📲", "💻", "⌨️", "🖥", "🖨", "🖱", "🖲", "🕹", "🗜", "💽", "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥", "📽", "🎞", "📞", "☎️", "📟", "📠", "📺", "📻", "🎙", "🎚", "🎛", "⏱", "⏲", "⏰", "🕰", "⌛️", "⏳", "📡", "🔋", "🔌", "💡", "🔦", "🕯", "🗑", "🛢", "💸", "💵", "💴", "💶", "💷", "💰", "💳", "💎", "⚖️", "🔧", "🔨", "⚒", "🛠", "⛏", "🔩", "⚙️", "⛓", "🔫", "💣", "🔪", "🗡", "⚔️", "🛡", "🚬", "⚰️", "⚱️", "🏺", "🔮", "📿", "💈", "⚗️", "🔭", "🔬", "🕳", "💊", "💉", "🌡", "🚽", "🚰", "🚿", "🛁", "🛀", "🛎", "🔑", "🗝", "🚪", "🛋", "🛏", "🛌", "🖼", "🛍", "🛒", "🎁", "🎈", "🎏", "🎀", "🎊", "🎉", "🎎", "🏮", "🎐", "✉️", "📩", "📨", "📧", "💌", "📥", "📤", "📦", "🏷", "📪", "📫", "📬", "📭", "📮", "📯", "📜", "📃", "📄", "📑", "📊", "📈", "📉", "🗒", "🗓", "📆", "📅", "📇", "🗃", "🗳", "🗄", "📋", "📁", "📂", "🗂", "🗞", "📰", "📓", "📔", "📒", "📕", "📗", "📘", "📙", "📚", "📖", "🔖", "🔗", "📎", "🖇", "📐", "📏", "📌", "📍", "✂️", "🖊", "🖋", "✒️", "🖌", "🖍", "📝", "✏️", "🔍", "🔎", "🔏", "🔐", "🔒", "🔓" ], 
				Symbols: [ "❤️", "💛", "💚", "💙", "💜", "🖤", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "🛐", "⛎", "♈️", "♉️", "♊️", "♋️", "♌️", "♍️", "♎️", "♏️", "♐️", "♑️", "♒️", "♓️", "🆔", "⚛️", "🉑", "☢️", "☣️", "📴", "📳", "🈶", "🈚️", "🈸", "🈺", "🈷️", "✴️", "🆚", "💮", "🉐", "㊙️", "㊗️", "🈴", "🈵", "🈹", "🈲", "🅰️", "🅱️", "🆎", "🆑", "🅾️", "🆘", "❌", "⭕️", "🛑", "⛔️", "📛", "🚫", "💯", "💢", "♨️", "🚷", "🚯", "🚳", "🚱", "🔞", "📵", "🚭", "❗️", "❕", "❓", "❔", "‼️", "⁉️", "🔅", "🔆", "〽️", "⚠️", "🚸", "🔱", "⚜️", "🔰", "♻️", "✅", "🈯️", "💹", "❇️", "✳️", "❎", "🌐", "💠", "Ⓜ️", "🌀", "💤", "🏧", "🚾", "♿️", "🅿️", "🈳", "🈂️", "🛂", "🛃", "🛄", "🛅", "🚹", "🚺", "🚼", "🚻", "🚮", "🎦", "📶", "🈁", "🔣", "ℹ️", "🔤", "🔡", "🔠", "🆖", "🆗", "🆙", "🆒", "🆕", "🆓", "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🔢", "#️⃣", "*️⃣", "▶️", "⏸", "⏯", "⏹", "⏺", "⏭", "⏮", "⏩", "⏪", "⏫", "⏬", "◀️", "🔼", "🔽", "➡️", "⬅️", "⬆️", "⬇️", "↗️", "↘️", "↙️", "↖️", "↕️", "↔️", "↪️", "↩️", "⤴️", "⤵️", "🔀", "🔁", "🔂", "🔄", "🔃", "🎵", "🎶", "➕", "➖", "➗", "✖️", "💲", "💱", "™️", "©️", "®️", "〰️", "➰", "➿", "🔚", "🔙", "🔛", "🔝", "🔜", "✔️", "☑️", "🔘", "⚪️", "⚫️", "🔴", "🔵", "🔺", "🔻", "🔸", "🔹", "🔶", "🔷", "🔳", "🔲", "▪️", "▫️", "◾️", "◽️", "◼️", "◻️", "⬛️", "⬜️", "🔈", "🔇", "🔉", "🔊", "🔔", "🔕", "📣", "📢", "👁‍🗨", "💬", "💭", "🗯", "♠️", "♣️", "♥️", "♦️", "🃏", "🎴", "🀄️", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚", "🕛", "🕜", "🕝", "🕞", "🕟", "🕠", "🕡", "🕢", "🕣", "🕤", "🕥", "🕦", "🕧" ], 
				Flags: [ "🏳️", "🏴", "🏁", "🚩", "🏳️‍🌈", "🇦🇫", "🇦🇽", "🇦🇱", "🇩🇿", "🇦🇸", "🇦🇩", "🇦🇴", "🇦🇮", "🇦🇶", "🇦🇬", "🇦🇷", "🇦🇲", "🇦🇼", "🇦🇺", "🇦🇹", "🇦🇿", "🇧🇸", "🇧🇭", "🇧🇩", "🇧🇧", "🇧🇾", "🇧🇪", "🇧🇿", "🇧🇯", "🇧🇲", "🇧🇹", "🇧🇴", "🇧🇶", "🇧🇦", "🇧🇼", "🇧🇷", "🇮🇴", "🇻🇬", "🇧🇳", "🇧🇬", "🇧🇫", "🇧🇮", "🇨🇻", "🇰🇭", "🇨🇲", "🇨🇦", "🇮🇨", "🇰🇾", "🇨🇫", "🇹🇩", "🇨🇱", "🇨🇳", "🇨🇽", "🇨🇨", "🇨🇴", "🇰🇲", "🇨🇬", "🇨🇩", "🇨🇰", "🇨🇷", "🇨🇮", "🇭🇷", "🇨🇺", "🇨🇼", "🇨🇾", "🇨🇿", "🇩🇰", "🇩🇯", "🇩🇲", "🇩🇴", "🇪🇨", "🇪🇬", "🇸🇻", "🇬🇶", "🇪🇷", "🇪🇪", "🇪🇹", "🇪🇺", "🇫🇰", "🇫🇴", "🇫🇯", "🇫🇮", "🇫🇷", "🇬🇫", "🇵🇫", "🇹🇫", "🇬🇦", "🇬🇲", "🇬🇪", "🇩🇪", "🇬🇭", "🇬🇮", "🇬🇷", "🇬🇱", "🇬🇩", "🇬🇵", "🇬🇺", "🇬🇹", "🇬🇬", "🇬🇳", "🇬🇼", "🇬🇾", "🇭🇹", "🇭🇳", "🇭🇰", "🇭🇺", "🇮🇸", "🇮🇳", "🇮🇩", "🇮🇷", "🇮🇶", "🇮🇪", "🇮🇲", "🇮🇱", "🇮🇹", "🇯🇲", "🇯🇵", "🎌", "🇯🇪", "🇯🇴", "🇰🇿", "🇰🇪", "🇰🇮", "🇽🇰", "🇰🇼", "🇰🇬", "🇱🇦", "🇱🇻", "🇱🇧", "🇱🇸", "🇱🇷", "🇱🇾", "🇱🇮", "🇱🇹", "🇱🇺", "🇲🇴", "🇲🇰", "🇲🇬", "🇲🇼", "🇲🇾", "🇲🇻", "🇲🇱", "🇲🇹", "🇲🇭", "🇲🇶", "🇲🇷", "🇲🇺", "🇾🇹", "🇲🇽", "🇫🇲", "🇲🇩", "🇲🇨", "🇲🇳", "🇲🇪", "🇲🇸", "🇲🇦", "🇲🇿", "🇲🇲", "🇳🇦", "🇳🇷", "🇳🇵", "🇳🇱", "🇳🇨", "🇳🇿", "🇳🇮", "🇳🇪", "🇳🇬", "🇳🇺", "🇳🇫", "🇲🇵", "🇰🇵", "🇳🇴", "🇴🇲", "🇵🇰", "🇵🇼", "🇵🇸", "🇵🇦", "🇵🇬", "🇵🇾", "🇵🇪", "🇵🇭", "🇵🇳", "🇵🇱", "🇵🇹", "🇵🇷", "🇶🇦", "🇷🇪", "🇷🇴", "🇷🇺", "🇷🇼", "🇧🇱", "🇸🇭", "🇰🇳", "🇱🇨", "🇵🇲", "🇻🇨", "🇼🇸", "🇸🇲", "🇸🇹", "🇸🇦", "🇸🇳", "🇷🇸", "🇸🇨", "🇸🇱", "🇸🇬", "🇸🇽", "🇸🇰", "🇸🇮", "🇸🇧", "🇸🇴", "🇿🇦", "🇬🇸", "🇰🇷", "🇸🇸", "🇪🇸", "🇱🇰", "🇸🇩", "🇸🇷", "🇸🇿", "🇸🇪", "🇨🇭", "🇸🇾", "🇹🇼", "🇹🇯", "🇹🇿", "🇹🇭", "🇹🇱", "🇹🇬", "🇹🇰", "🇹🇴", "🇹🇹", "🇹🇳", "🇹🇷", "🇹🇲", "🇹🇨", "🇹🇻", "🇺🇬", "🇺🇦", "🇦🇪", "🇬🇧", "🇺🇸", "🇻🇮", "🇺🇾", "🇺🇿", "🇻🇺", "🇻🇦", "🇻🇪", "🇻🇳", "🇼🇫", "🇪🇭", "🇾🇪", "🇿🇲", "🇿🇼" ]
			};
			
			this.mapEmojis = dataEmojis;
		}
	},
	beforeDestroy() {
		delete this.mapEmojis;
	}, template: `<div class="emoji-picker-container" ref="root"> <slot></slot> <svg viewBox="0 0 24 24" @click="show = !show" xmlns="http://www.w3.org/2000/svg" class="emoji-picker-invoker is-hidden-mobile"><path d="M0 0h24v24H0z" fill="none"></path> <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"></path></svg> <div class="emoji-picker-container-popup is-hidden-mobile" :class="{'is-hidden': !show}" v-if="inited"> <vue-component-emoji-picker-categories @select="onChangeCategory($event)"/> <vue-component-emoji-picker-list :data="emojis" :category="category" :filter="filterEmoji" :emojisByRow="emojisByRow" :continuousList="continuousList" @select="onSelectEmoji($event)"/> </div>`});

window.$app.defineComponent("component", "vue-component-filterbox", {data() {
			return {
				isFilterVisible: false,
				dropdown: '',
				action: '',
				hash: '',
				hashEmpty:'', 
				filteredTags: [],
				currentTag: '',
				isFetchingTags: false
			}
		},
		
		props: {value: Object, allowTags: Object, tagsFetch: Function, isVisible: {type: Boolean, default: true}, selected: Object, disabled: Boolean, withDropdown: {type: Boolean, default: false}, withQuery: {type: Boolean, default: true}, withFilters: {type: Boolean, default: false}, withButtons: {type: Boolean, default: false}, mode: {type: String, default: 'table'}, showToolbar: Boolean},

		mounted() {
			this.hashEmpty = this.hash = this.flatten(this.value);
		},
		
		computed: {
			hasFilter() {
				return this.hashEmpty != this.hash;
			},
			placeholder() {
				return this.currentTag?this.$gettext('Значение'):this.$gettext('Поиск');
			},
			tagAllowNew() {
				return this.currentTag?true:false;
			},
			inputIcon() {
				return this.currentTag?'equals':'search';
			},
			tagsKeys() {
				return _.map(this.value.tags, (v) => { let tmp = v.split(':'); return tmp[0]; });
			}
		},
		
		watch: {
			value: {
				handler: _.debounce(function() {
					let hash = this.flatten(this.value);
					
					if (!this.currentTag) {
						this.$emit('input', this.value);
						this.$emit('filter', this.value);
					}
					this.hash = hash;
				}, 500),
				deep: true
			}
		},

		methods: {
			flatten(xs) {
				return _.map(xs, (v, k) => {
					if (v === null) v = '';
					return (_.isObject(v) && _.isPlainObject(v))?this.flatten(v):((k == 'query')?'':v.toString());
				}).join('|');
			},
			
			onDropdown(v) {
	            if (!this.dropdown) return;
	            this.$emit('dropdown', this.dropdown);

				Vue.nextTick(() => {
		            this.dropdown = null;
	            });
			},
			
			onAction(v) {
	            if (!this.action) return;
	            this.$emit('action', this.action);

				Vue.nextTick(() => {
		            this.action = null;
	            });
			},
			
			tagTyping(text) {
				if (this.currentTag) {
					if (this.tagsFetch) {
		                this.isFetchingTags = true;
		                this.tagsFetch(this.currentTag, text, (list) => {
			                this.filteredTags = list;
			                this.isFetchingTags = false;
		                })
					}	
				} else {
					this.filteredTags = this.allowTags.filter((option) => {
	                    return option.toString().toLowerCase().indexOf(text.toLowerCase()) >= 0 && this.tagsKeys.indexOf(option) == -1;
	                });
	                
					if (!this.filteredTags.length || text.trim() == '') this.value.query = text;
				}
			},
			
			tagInput(value) {
				return false;
			},

			tagBeforeAdding(tag) {
				if (this.currentTag) {
					this.currentTag = '';
					this.value.tags.push(this.value.tags.pop()+' : '+tag);
					
					//this.$emit('filter', this.value);
					
/*
					this.$emit('input', this.value);
					this.$emit('filter', this.query);
*/
					
					this.filteredTags = [];
					return false;
				} else {
					if (this.allowTags.indexOf(tag) >= 0) {
						this.currentTag = tag;
						this.filteredTags = [];

						this.$nextTick(() => {
							this.value.query = '';
						});
						
/*
					this.$emit('input', this.value);
					this.$emit('filter', this.value);
*/
				
						return true;
					} else {
						return false;
					}
				}
	        },
	        	
        	tagRemove(v, i) {
		        let tmp = v.split(':');
		        if (tmp[0] == this.currentTag) {
					this.currentTag = '';
					this.filteredTags = [];
				}

				//this.$emit('filter', this.value);
        	}
		}, template: `<div class="table-toolbar-container" :class="{'is-mode-standalone': mode== 'standalone', 'is-mode-table': mode== 'table'}"> <div class="table-toolbar container" :class="{disabled: disabled}"> <div v-if="showToolbar" class="is-action-row"> <slot name="toolbar"></slot> </div> <div v-else> <div v-if="selected && selected.length && !showToolbar"> <div class="row row-small is-action-row" v-if="isVisible || hasFilter || value"> <div class="col-md-2 col-sm-3 col-xs"> <b-dropdown class="is-fullwidth" v-model="action" @input="onAction"> <button class="button is-dark is-fullwidth" slot="trigger" style="justify-content: space-between"> <span>{{'Действие'|gettext}}</span> <b-icon icon="angle-down"></b-icon> </button> <slot name="actions"></slot> </b-dropdown> </div> <div class="col-xs has-text-grey-light" style="align-self: center" v-if="selected"> {{'Выбрано всего'|gettext}}: {{selected.length|number}} </div> </div> </div> <div class="row row-small is-query-row" v-if="!(selected && selected.length) && !showToolbar && (isVisible || hasFilter || value)"> <div class="col-xs" v-if="withQuery"> <b-taginput v-if="allowTags" v-model="value.tags" class="is-query" :class="{'is-editing': currentTag}" attached expanded autocomplete slot="trigger" role="button" :data="filteredTags" :allow-new="tagAllowNew" :icon="inputIcon" :placeholder="placeholder" @typing="tagTyping" @input="tagInput" @remove="tagRemove" :before-adding="tagBeforeAdding" :loading="isFetchingTags"></b-taginput> <b-input v-else type="search" icon="search" v-model="value.query" class="is-query" :placeholder="placeholder" expanded slot="trigger" role="button"></b-input> </div> <div class="col-xs col-shrink" v-if="withFilters"> <a class="button is-clear is-fullwidth" style="border:0" @click="isFilterVisible = !isFilterVisible"><i class="fa-filter" :class="{fas: isFilterVisible, fa: !isFilterVisible, 'has-text-grey-light': !hasFilter, 'has-text-primary': hasFilter}"></i></a> </div> <div class="col-xs col-shrink" v-if="withDropdown"> <b-dropdown v-model="dropdown" @input="onDropdown" position="is-bottom-left"> <button class="button is-light is-fullwidth" slot="trigger"><i class="fa fa-ellipsis-h"></i></button> <slot name="dropdown"></slot> </b-dropdown> </div> <div class="col-xs" :class="{'col-shrink': withQuery}" v-if="withButtons"> <slot name="buttons"></slot> </div> </div> </div> </div> <div class="container is-filters" v-if="isFilterVisible && (!selected || !selected.length) && !showToolbar" :class="{disabled: disabled}"> <div> <slot name="filters"></slot> </div> </div> </div>`});

window.$app.defineComponent("component", "vue-component-font-chooser", {data() {
			let fonts = _.sortBy(_.map(globalFonts, (f, i) => { return {i: i, f: f}}), 'f');
			
			return {
				fonts: fonts,
				globalFonts: globalFonts
			}
		},
		
		props: {value: Number, view: {type: String, default: 'letter'}, fullwidth: Boolean},

		methods: {
			onAction(v) {
				this.value = v;
				this.$emit('input', this.value);
			},
			
			activeChange(v) {
				$mx('html').toggleClass('is-dropdown-opened', v);
			}
		}, template: `<b-dropdown v-model="value" @input="onAction" @active-change="activeChange" position="is-bottom-left" :class="{'is-fullwidth': fullwidth}"> <button class="button is-default is-fullwidth" style="justify-content:space-between" slot="trigger"><span :style="{'font-family': globalFonts[value]}"><span v-if="view == 'letter'">Aa</span><span v-if="view == 'name'">{{globalFonts[value]}}</span></span><i class="fal fa-chevron-down has-ml-1"></i></button> <b-dropdown-item :value="v.i" v-for="v in fonts"><span :style="{'font-family': v.f}"><span style="width:2rem;display: inline-block;">Aa</span><span class="has-text-grey">{{v.f}}</span></span></b-dropdown-item> </b-dropdown>`});

window.$app.defineComponent("component", "vue-component-form-blocks", {watch: {
			value() {
				this.$emit('input', this.value);
			}
		},

		props: {
			value: Object,
			variants: Object,
			disabled: {
				type: Boolean,
				default: false
			}
		},

		methods: {
			onRemove(index) {
				this.$confirm(this.$gettext('Вы уверены что хотите удалить это поле?'), 'is-danger').then(() => {
					this.value.splice(index, 1);
				});
			},
			
			openBlock(index) {
				this.$set(this.value[index], 'opened', !this.value[index].opened);
			}
		}, template: `<sortable-list class="form-fields-item-list" lockAxis="y" v-model="value" use-drag-handle> <sortable-item v-for="(f, index) in value" class="form-fields-item" :index="index" :key="index" :item="f" :disabled="disabled"> <div class="form-fields-item" :class="{in: f.opened}"> <div class="form-fields-item-title" @click="openBlock(index)"> <div v-sortable-handle class="form-fields-item-handle"></div> <a class="is-pulled-right has-text-danger" @click.stop="onRemove(index)" :class="{disabled: disabled}"><i class="fa fa-trash-alt"></i></a> <span><span v-if="f.title">{{ f.title }}</span><span v-else>{{'Без названия'|gettext}}</span><sup class="required" v-if="f.required">*</sup></span> </div> <div class="form-fields-item-options"> <div class="field"> <label>{{'Название поля'|gettext}}</label> <b-input type="text" v-model="f.title" :disabled="disabled"></b-input> </div> <div class="field"> <label>{{'Описание поля'|gettext}}</label> <b-input type="text" v-model="f.text" :disabled="disabled"></b-input> </div> <b-field :label="'Варианты'|gettext" v-if="f.type_id == 8 || f.type_id == 9"> <b-input type="textarea" v-model="f.variants" :disabled="disabled"></b-input> </b-field> <div class="level"> <div class="level-left"> <div class="level-item"><b-checkbox v-model="f.required" :disabled="disabled">{{'Обязательное поле'|gettext}}</b-checkbox></div> <div class="level-item" v-if="f.type_id == 10"><b-checkbox v-model="f.default" :disabled="disabled">{{'Выбрано по умолчанию'|gettext}}</b-checkbox></div> </div> <div class="level-right"> <div class="level-item has-text-grey-light">{{'Тип'|gettext}}: {{variants.fields_types[f.type_id]}}</div> </div> </div> </div> </div> </sortable-item> </sortable-list>`});

window.$app.defineComponent("component", "vue-component-link-editor", {data() {
			return {
				isFetchingProduct: false,
				isFetchingCollection: false,
				autocompleteProducts: [],
				autocompleteCollections: []
			}
		},
		
		props: ['values', 'variants', 'info'],
		
		methods: {
			asyncAutocompleteProduct: _.debounce(function() {
                if (!this.values.product || this.values.product.trim() == '') {
	                this.autocompleteProducts = [];
	                return;
                }
                
                this.isFetchingProduct = true;
                this.$api.get('products/search', {query: this.values.product}).then((data) => {
	                this.autocompleteProducts = data.response.products.search;
	                this.isFetchingProduct = false;
				});
			}, 500),
			
			
			asyncAutocompleteCollection: _.debounce(function() {
                if (!this.values.collection || this.values.collection.trim() == '') {
	                this.autocompleteCollection = [];
	                return;
                }

                this.isFetchingCollection = true;
                this.$api.get('products/collections/search', {query: this.values.collection}).then((data) => {
	                this.autocompleteCollections = data.response.collections.search;
	                this.isFetchingCollection = false;
				});
			}, 500),
			
			
			onSelectProduct(option) {
				this.values.product = option.title;
			},			

			onSelectCollection(option) {
				this.values.collection = option.collection;
			}			
		}, template: `<div> <label class="label" v-if="$account.tariff == 'business'">{{'Действие'|gettext}}</label> <label class="label" v-else>{{'Открыть сайт'|gettext}}</label> <div class="row row-small"> <div class="col-xs-12 col-sm-4 has-xs-mb-3"> <b-select v-model="values.type" placeholder="-- Действие --" :disabled="info.is_readonly" expanded> <option v-for="(v, k) in variants.link_type" :value="k">{{v}}</option> </b-select> </div> <div class="col-xs-12 col-sm link-editor-place"> <div v-if="values.type == 'link'"><input type='text' v-model="values.link" class='input' placeholder='http://' autocorrect="off" autocapitalize="none" :disabled="info.is_readonly"></div> <mx-phone v-if="values.type == 'phone'" v-model="values.phone" :disabled="info.is_readonly"></mx-phone> <div v-if="values.type == 'sms'"> <mx-phone v-model="values.sms" :disabled="info.is_readonly" class="has-mb-1"></mx-phone> <input type="text" maxlength="140" :disabled="info.is_readonly" class="input" v-model="values.sms_text" :placeholder="'Текст-шаблон сообщения'|gettext"> </div> <div v-if="values.type == 'email'"> <input type='text' v-model="values.email" class='input has-mb-1' placeholder='example@email.com' autocorrect="off" autocapitalize="off" spellcheck="false" :disabled="info.is_readonly"> <input type="text" maxlength="140" :disabled="info.is_readonly" class="input" v-model="values.email_subject" :placeholder="'Тема письма'|gettext"> </div> <div v-if="values.type == 'product'"><b-autocomplete v-model="values.product" :data="autocompleteProducts" :placeholder="'Начните вводить название товара'|gettext" field="product" :loading="isFetchingProduct" @input="asyncAutocompleteProduct" @select="onSelectProduct" :disabled="info.is_readonly"></b-autocomplete></div> <div v-if="values.type == 'collection'"><b-autocomplete v-model="values.collection" :data="autocompleteCollections" :placeholder="'Начните вводить название коллекции'|gettext" field="collection" :loading="isFetchingCollection" @input="asyncAutocompleteCollection" @select="onSelectCollection" :disabled="info.is_readonly"></b-autocomplete></div> <div v-if="values.type == 'page'"> <b-select v-model="values.link_page_id" :disabled="info.is_readonly" expanded> <option :value="null">{{'-- Нет страницы --'|gettext}}</option> <option v-for="(v, k) in variants.link_page_id" :value="k" :key="k">{{v}}</option> </b-select> </div> </div> </div> </div>`});

window.$app.defineComponent("component", "vue-component-locale-change", {computed: {
			currentLocale() {
				return window.locales[window.i18n.locale];
			}
		}, template: `<div> <a class='langs langs-button' href='#' data-toggle="tooltip" data-placement="top" data-trigger='click' data-html='#langsMenu' data-arrow='true' data-theme='light'><div class="iti__flag iti__flag-box" :class="'iti__'+currentLocale.flag"></div> {{currentLocale.title}}</a> <div id='langsMenu' class="is-hidden"> <a v-for="(f, lang) in window.locales" class='langs tooltip-menu' :class="{'is-active': i18n.locale == lang}" onclick="changeLocaleApp(event)" :data-multilanguage="f.multilanguage" :data-current-locale="i18n.locale" :data-lang="lang" :data-zone="f.zone"><div class="iti__flag iti__flag-box" :class="'iti__'+f.flag"></div> {{f.title}}</a> </div> </div>`});

window.$app.defineComponent("component", "vue-component-pictures", {data() {
			return {
				uploading: 0,
				uploadUrl: '/pictures/upload',
				maxFilesize: this.$account.limits.upload_max_filesize,
				dropFiles: []
			}
		},
		
		computed: {
			maxSizeBytes() {
				if (this.maxSize) {
					let m = this.maxFilesize.match(/([0-9]+)([MK])/);
					return m[1] * ((m[2] == 'M')?1048576:1024);
				} else {
					return this.maxFilesize;
				}
			}
		},
		
		props: {
			value: Object, 
			disabled: {
				type: Boolean,
				default: false
			},
			updatable: Boolean,
			multiple: Boolean,
			buttonTitle: {
				type: String,
				default: 'Добавить'
			},
			buttonIcon: {
				type: String,
				default: 'fa fas fa-camera'
			},
			alwaysDeleteButton: Boolean,
			classContainer: {
				type: String,
				default: ''
			},
			styleContainer: String,
			styleOuterContainer: String,
			maxSize: {
				type: Number,
				defaiult: 1080
			}
		},
		
		watch: {
			value() {
				this.$emit('input', this.value);
			}
		},

		methods: {
			prepareStyle(p) {
				return 'background-image:'+((p == undefined || p.progress != undefined || p.link == undefined)?'none;':('url('+p.link+');'))+this.styleContainer;
			},
			
			deletePicture(index) {
				if (this.value) {
					this.$confirm(this.$gettext('Вы уверены что хотите удалить эту картинку?'), 'is-danger').then(() => {
	                    if (this.multiple) {
		                    this.value.splice(index, 1);
						} else {
							this.value = null;
						}
						
						this.$emit('delete', {index: index, empty: false});
					});
				} else {
					this.$emit('delete', {index: index, empty: true});
				}
			},
			
			dropFilesChanged(is_updating) {
				if (window.File && window.FormData) {
					
					let errors = [];
					let files = Array.isArray(this.dropFiles)?this.dropFiles:[this.dropFiles];
					_.each(files, (file, i) => {
						if (this.maxSizeBytes && file.size > this.maxSizeBytes) {
							errors.push(this.$gettext('Максимальный размер файла: %s').replace('%s', this.maxFilesize))
// 							this.dropFiles.splice(i, 1);
							return;
						}
						
						if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
							let formData = new FormData();
							formData.append('file', file);
							
							if (is_updating && this.value.picture_id != undefined) {
								formData.append('picture_id', this.value.picture_id);
							}
							
							let picture = {progress: 0}
							let index = this.multiple?this.value.length:0;
							
							if (this.multiple) {
								this.value.push(picture);
							} else {
								this.value = picture;
							}
							
							this.uploading++;
							this.$emit('startUploading', this.uploading);
							$mx.request({url: this.uploadUrl+(this.maxSize?('?size='+this.maxSize):''), method: 'post', data: formData,/*  headers: {'Content-Type': 'multipart/form-data'}, onUploadProgress: (pe) => {
								picture.progress = pe.loaded * 100 / pe.total;
							}*/}).then(({data}) => {
// 								this.dropFiles.splice(i, 1);
								this.uploading--;
								this.$emit('stopUploading', this.uploading);
								
								if (data.result == 'success') {
									data.response.link = '//'+this.$account.storage_domain+'/p/'+data.response.filename;

									if (this.multiple) {
										this.$set(this.value, index, data.response);
									} else {
										this.value = data.response;
									}
									
									this.$emit('upload');
								} else if (data.result == 'error') {
									this.$alert(data.error, 'is-danger');
								}
							}).catch(() => {
// 								this.dropFiles.splice(i, 1);
								this.uploading--;
								this.$emit('stopUploading', this.uploading);
								
								if (this.multiple) {
									this.value.splice(index, 1);
								} else {
									this.value = null;
								}

								errors.push(this.$gettext('Во время загрузки картинки возникла ошибка'));
							});
						} else {
							errors.push(this.$gettext('Недопустимый формат файла'));
						}
					});
					
					this.dropFiles = []; 
					
					if (errors.length) {
						this.$alert(_.uniq(errors).join("<br>"), 'is-danger');
					}
					
				} else {
					alert('The File APIs are not fully supported in this browser');
				}
			}
		}, template: `<div :class="{'pictures-sortable-list': multiple}"> <sortable-list v-model="value" style="position: relative;line-height: 0" axis="xy" use-drag-handle v-if="multiple"> <sortable-item v-for="(p, i) in value" class="upload-picture upload-picture-multiple" :index="i" :key="i" :item="p" :disabled="disabled || (uploading> 0)"> <div v-sortable-handle :style="prepareStyle(p)"> <b-loading :is-full-page="false" active="true" v-if="p.progress != undefined"></b-loading> </div> <button type="button" class="button is-danger is-small" @click.prevent.stop="deletePicture(i)" v-if="!disabled" :disabled="uploading> 0"><i class="fa fa-trash-alt"></i></button> </sortable-item><b-upload v-model="dropFiles" @input="dropFilesChanged(false)" class="upload-place" :class="{'upload-picture-multiple': multiple}" :multiple="multiple" drag-drop><span><i class="fa fas fa-camera"></i>{{'Добавить'|gettext}}</span></b-upload> </sortable-list> <div style="line-height: 0" v-else> <div class="upload-picture" v-if="value" @click="$emit('click')"> <div class="upload-picture-inner" :style="styleOuterContainer"> <div class="picture-container" :class="classContainer" :style="prepareStyle(value)"> <b-loading :is-full-page="false" active="true" v-if="value.progress != undefined"></b-loading> </div> </div> <button type="button" class="button is-danger is-small" @click.prevent.stop="deletePicture" v-if="!disabled && (value || alwaysDeleteButton)"><i class="fa fa-trash-alt"></i></button> <b-upload v-model="dropFiles" @input="dropFilesChanged(true)" class="button is-small is-primary upload-place-update" :multiple="multiple" drag-drop v-if="updatable"> <span v-if="maxSize> 120"><i class="fa fas fa-arrow-up"></i>{{buttonTitle}}</span> <span v-else><i class="fa fas fa-arrow-up is-marginless"></i></span> </b-upload> </div> <div class="upload-picture" v-if="!value"> <b-upload v-model="dropFiles" @input="dropFilesChanged(false)" class="upload-place" :class="{'upload-picture-multiple': multiple}" :multiple="multiple" drag-drop> <span><i :class="buttonIcon"></i>{{buttonTitle}}</span> </b-upload> <button type="button" class="button is-danger is-small" @click.prevent.stop="deletePicture" v-if="!disabled && alwaysDeleteButton"><i class="fa fa-trash-alt"></i></button> </div> </div> </div>`});

window.$app.defineComponent("component", "vue-component-qrcode", {data() {
			return {
				isLoading: true
			}
		},
		props: ['value'],
		
		mounted() {
			$mx.lazy('qrcode.js');
		}, template: `<center> <div class="qrcode-init has-mb-2" :data-link='value' data-target-link="#qrDownloadLink"> <div class="loading-overlay is-active"><div class="loading-icon"></div></div> </div> <a id='qrDownloadLink' target='_blank' download='taplink.png' class="button is-primary disabled"><i class="fa fa-download"></i> {{'Скачать файл'|gettext}}</a> </center>`});

window.$app.defineComponent("component", "vue-component-sortable-form-fields", {props: {
			value: {type: Object, default: []},
			current: {type: Number, default: 0}
		},
		
		methods: {
			updated(v) {
				this.$emit('input', v);
			},
			sortStart(e) {
				this.$emit("sortStart", e);
			},
			sortEnd(e) {

				if (this.current != -1) {
					if (e.oldIndex > this.current) {
						if (e.newIndex <= this.current) this.current++;
					} else 
					if (e.oldIndex < this.current) {
						if (e.newIndex >= this.current) this.current--; 
					} else 
					if (e.oldIndex == this.current) this.current = e.newIndex;

					this.$emit('update:current', this.current);
				}

				this.$emit("sortEnd", e);
			},
			
			openBlock(index) {
				this.current = (this.current == index)?-1:index;
				this.$emit('update:current', this.current);
			},
		}, template: `<sortable-list class="form-fields-item-list" lockAxis="y" v-model="value" use-drag-handle @sortEnd="sortEnd" @sortStart="sortStart" @input="updated"> <sortable-item v-for="(item, index) in value" class="form-fields-item" :index="index" :key="index" :item="item"> <div class="form-fields-item" :class="{in: current== index}"> <div class="form-fields-item-title" @click="openBlock(index)"> <div v-sortable-handle class="form-fields-item-handle"></div> <slot name="action" :index="index" :item="item"></slot> <slot name="title" :index="index" :item="item"></slot> </div> <div class="form-fields-item-options"> <slot name="form" :index="index" :item="item"></slot> </div> </div> </sortable-item> </sortable-list>`});

window.$app.defineComponent("component", "vue-component-statistics", {data() {
			return {
				chart: null
			}
		},

		props: {data: Object, lineShow: Boolean, isFetching: Boolean, paddingTop: {type: Number, default: 55}, valueName: {type: String, default: 'hits'}, valueType: {type: String, default: 'number'}, period: String, period_back: Number, disabled: Boolean, title: String, titleSize: {type: Number, default: 3}, color: {type: String, default: '#94a7ff'}},
		
		mounted() {
			$mx.lazy('charts.js', () => {
				let months = this.$getMonthsNames();
								
				let params = {
					type: 'line',
					data: {
						labels: _.map(this.data, v => v.date),
						datasets: [{
							fill: true,
							backgroundColor: 'rgba(255, 255, 255, .4)',
							borderColor: 'rgba(255, 255, 255, .5)',
							pointRadius: 0,
							borderWidth: 2,
							data: _.map(this.data, v => v[this.valueName])
						}]
					},
					options: {
						line: {
							show: this.lineShow,
							value: this.period_back
						},
						aspectRatio: 2.5,
						animation: {
							duration: 0
						},
						legend: {
							display: false
						},
						layout: {
							padding: {
								top: this.paddingTop
							}
						},
						tooltips: {
							mode: 'index',
							intersect: false,
							callbacks: {
								title: (tooltipItem, data) => {
									let v = data.labels[tooltipItem[0].index];
									switch (this.period) {
										case 'day':
											return this.$date(v);
										case 'week':
											var m = v.split('-');
											
/*
											let date = new Date(m[0], 0, (1 + (m[1] - 1) * 7)); // Elle's method
											date.setDate(date.getDate() + (1 - date.getDay())); // 0 - Sunday, 1 - Monday etc											
*/
// 											return this.$date(date);
											
											return m[1]+', '+m[0];
										default:
											var m = v.split('-');
											return months[m[1]-1]+', '+m[0];
									}
								},
								label: (tooltipItem, data) => {
									return null;
								},
								beforeBody: (tooltipItem, data) => {
									let v = tooltipItem[0].yLabel;
									switch (this.valueType) {
										case 'decimal':
											return this.$decimal(v);
										case 'currency':
											return this.$currency(v);
										default:
											return this.$number(v);
									}
								}
							}	
						},
						scales: {
							xAxes: [{
								display: false
							}],
							yAxes: [{
								display: false
							}]
						}
					}
				}
				
				var ctx = this.$refs.chart.getContext('2d');
				this.chart = new Chart(ctx, params);
			});
		},
		
		destroyed() {
			if (this.chart) this.chart.destroy();
		},
		
		watch: {
			period_back() {
				if (this.chart && this.lineShow) {
					this.$nextTick(() => {
						this.chart.options.line.value = this.period_back;
						this.chart.chart.update()
					});
				}
			},
			data() {
				if (this.chart) {
					this.$nextTick(() => {
						this.chart.options.line.value = this.period_back;
						this.chart.data.labels = _.map(this.data, v => v.date);
						this.chart.data.datasets[0].data = _.map(this.data, v => v[this.valueName]);
						this.chart.chart.update()
		            });
	            }

			}
		}, template: `<div class="chart vue-statistics-chart" :class="{disabled: disabled}" :style="{background: color}"> <div class="vue-statistics-title"> <h3 class="has-text-white has-text-centered" v-if="title && titleSize== 3">{{title}}</h3> <h4 class="has-text-white has-text-centered" v-if="title && titleSize== 4">{{title}}</h4> </div> <canvas ref='chart' v-show="data && data.length"></canvas> <div class='chart-empty' v-if="data.length == 0 "> <span v-if="isFetching"> <div class="has-mt-2">{{'Загрузка данных'|gettext}}</div> </span> <span v-else> <div class="has-mt-2">{{'Недостаточно данных'|gettext}}</div> </span> </div> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("component", "vue-component-subdomain-field", {props: ['value', 'domain', 'error', 'label', 'disabled', 'domains'],
		
		watch: {
			value() {
				this.$emit('input', this.value);
			},
			
			domain() {
				this.$emit('update:domain', this.domain);
			}
		}, template: `<div class="field" :class="{'has-error': error}"> <label class="label" v-if="label">{{label}}</label> <div class="field has-addons is-marginless"> <b-input type="input" v-model="value" expanded placeholder="subdomain" :disabled="disabled"></b-input> <b-dropdown v-model="domain" position="is-bottom-left" aria-role="list" :disabled="disabled" v-if="domains"> <button class="button" slot="trigger">.{{domain}}<i class="fal fa-angle-down has-ml-1"></i></button> <b-dropdown-item aria-role="listitem" v-for="d in domains" :value="d">{{d}}</b-dropdown-item> </b-dropdown> <div class="control" v-else><span class="button is-static">.{{domain}}</span></div> </div> <p class="help" v-if="error">{{error}}</p> </div>`});

window.$app.defineComponent("component", "vue-component-tariff-badge", {props: ['value', 'theme'], template: `<span> <span class="tag is-danger" v-if="value == 'pro'" style="background:#9d82da">pro</span> <span class="tag is-danger" v-if="value == 'business'">business</span> <span class="tag" :class="{'is-dark': theme== 'dark', 'is-default': theme != 'dark'}" v-if="value == 'basic'">basic</span> </span>`});

window.$app.defineComponent("component", "vue-component-vbar", {data: () => ({
	        dragging: {
	            enable: false,
	            axis: '',
	            offset: ''
	        },
	        bars: {
	            horizontal: {
	                elm: '',
	                parent: '',
	                size: 0
	            },
	            vertical: {
	                elm: '',
	                parent: '',
	                size: 0
	            }
	        },
	        wrapperObj: {
	            elm: '',
	            scrollHeight: '',
	            scrollWidth: '',
	            scrollLeft: '',
	            scrollTop: ''
	        },
	        container: {
	            elm: '',
	            scrollHeight: '',
	            scrollWidth: ''
	        }
	    }),
	    mounted () {
	        addResizeListener(this.$refs.container, this.resize)
	        addResizeListener(this.$refs.wrapperRef.children[0], this.resize)
	        document.addEventListener('mousemove', this.onDrag)
	        document.addEventListener('touchmove', this.onDrag)
	        document.addEventListener('mouseup', this.stopDrag)
	        document.addEventListener('touchend', this.stopDrag)
	        this.getSizes()
	    },
	    beforeDestroy () {
	        removeResizeListener(this.$refs.container, this.resize)
	        removeResizeListener(this.$refs.wrapperRef.children[0], this.resize)
	        document.removeEventListener('mousemove', this.onDrag)
	        document.removeEventListener('touchmove', this.onDrag)
	        document.removeEventListener('mouseup', this.stopDrag)
	        document.removeEventListener('touchend', this.stopDrag)
	    },
	    computed: {
	        propWrapperSize () {
	            return this.wrapper ? this.wrapper : ''
	        },
	        propBarVertical () {
	            return this.vBar ? this.vBar : ''
	        },
	        propBarInternalVertical () {
	            return this.vBarInternal ? this.vBarInternal : ''
	        },
	        propBarHorizontal () {
	            return this.hBar ? this.hBar : ''
	        },
	        propBarInternalHorizontal () {
	            return this.hBarInternal ? this.hBarInternal : ''
	        },
	        barSizeVertical () {
	            if (this.bars.horizontal.size && this.bars.vertical.size) {
	                return {
	                    height: 'calc(100% - 16px)'
	                }
	            }
	        },
	        barSizeHorizontal () {
	            if (this.bars.horizontal.size && this.bars.vertical.size) {
	                return {
	                    width: 'calc(100% - 16px)'
	                }
	            }
	        },
	        barInternalVertical () {
	            let barTop = this.getBarInternal('Y')
	            return {
	                height: this.bars.vertical.size + 'px',
	                top: barTop + 'px'
	            }
	        },
	        barInternalHorizontal () {
	            let barLeft = this.getBarInternal('X')
	            return {
	                width: this.bars.horizontal.size + 'px',
	                left: barLeft + 'px'
	            }
	        },
	        validationScrolls () {
	            if (!this.bars.horizontal.size) {
	                return 'overflowX: hidden'
	            }
	            if (!this.bars.vertical.size) {
	                return 'overflowY: hidden'
	            }
	        }
	    },

		methods: {
			startScroll() {
				$mx('html').addClass('is-dragging');
			},
			stopScroll() {
				$mx('html').removeClass('is-dragging');
			},
		    shadowStyle(pl) {
				return 'background: linear-gradient(to '+((pl == 'start')?'right':'left')+', '+this.shadowColor+' 0%, '+(this.shadowColorTransparent?this.shadowColorTransparent:(this.shadowColor+'00'))+' 100%)'
// 				return 'background: -webkit-linear-gradient('+((pl == 'start')?0:180)+'deg, '+this.shadowColor+' 0%, transparent 100%);';
		    },
	        scroll (e) {
	            // console.log(e)
	            // e.preventDefault()
	            // console.log(e.touches[0].clientX,
	            //     e.touches[0].pageX,
	            //     e.touches[0].screenX)
	            // console.log(e.layerY)
	            const Y = 0,
	                X = 0
	            // let Y = e.layerX
	            //     ? e.layerX
	            //     : e.changedTouches
	            //     ? e.changedTouches[0].clientX * -1
	            //     : '',
	            //     X = e.layerY
	            //     ? e.layerY
	            //     : e.changedTouches
	            //     ? e.changedTouches[0].clientY * -1
	            //     : ''
	            this.getSizes(X, Y)
	        },
	        resize () {
	            this.getSizes()
	        },
	        getBarInternal (axis) {
	            let internalSize,
	                positionWrapper,
	                sizeWrapper,
	                sizeBar,
	                sizeContainer,
	                regulatorSize
	            if (this.bars.horizontal.size && this.bars.vertical.size) {
	                regulatorSize = 40
	            } else {
	                regulatorSize = 0 /* 32 */
	            }
	            if (axis === 'X') {
	                positionWrapper = this.wrapperObj.scrollLeft
	                sizeWrapper = this.wrapperObj.scrollWidth
	                sizeBar = this.bars.horizontal.size + regulatorSize
	                sizeContainer = this.container.scrollWidth
	            } else if (axis === 'Y') {
	                positionWrapper = this.wrapperObj.scrollTop
	                sizeWrapper = this.wrapperObj.scrollHeight
	                sizeBar = this.bars.vertical.size + regulatorSize
	                sizeContainer = this.container.scrollHeight
	            }
	            internalSize = (positionWrapper / (sizeWrapper - (sizeContainer))) * (sizeContainer - sizeBar)
	            return internalSize
	        },
	        getCoordinates (e, axis) {
	            let coordinate,
	                sizeWrapper,
	                sizeBar,
	                sizeContainer,
	                offsetContainer,
	                clientDirection
	            if (axis === 'X') {
	                sizeWrapper = this.wrapperObj.scrollWidth
	                sizeBar = this.bars.horizontal.size
	                sizeContainer = this.container.scrollWidth
	                offsetContainer = this.container.elm.offsetLeft
	                clientDirection = e.clientX - this.dragging.offset
	            } else if (axis === 'Y') {
	                sizeWrapper = this.wrapperObj.scrollHeight
	                sizeBar = this.bars.vertical.size
	                sizeContainer = this.container.scrollHeight
	                offsetContainer = this.container.elm.offsetTop - (this.bars.vertical.size * 1.4)
	                clientDirection = e.clientY - this.dragging.offset
	            }
	            coordinate = ((sizeWrapper - sizeContainer) * (clientDirection - offsetContainer)) / (sizeContainer - sizeBar)
	            return coordinate
	        },
	        startDrag (e) {
		        $mx('html').addClass('is-dragging');
	            e.preventDefault()
	            e.stopPropagation()
	            e = e.changedTouches ? e.changedTouches[0] : e
	            const axis = e.target.getAttribute('data-axis'),
	                dataDrag = e.target.getAttribute('data-drag-source')
	            let offset,
	                elementOffset
	            if (axis === 'Y') {
	                if (dataDrag === 'bar') {
	                    elementOffset = e.explicitOriginalTarget.offsetTop + (this.bars.vertical.size * 1.4)
	                } else if (dataDrag === 'internal') {
	                    elementOffset = e.clientY - this.bars.vertical.elm.offsetTop
	                }
	            } else if (axis === 'X') {
	                if (dataDrag === 'bar') {
	                    elementOffset = e.explicitOriginalTarget.offsetLeft + (this.bars.horizontal.size * 1.4)
	                } else if (dataDrag === 'internal') {
	                    elementOffset = e.clientX - this.bars.horizontal.elm.offsetLeft
	                }
	            }
	            offset = elementOffset
	            this.dragging = {
	                enable: true,
	                axis: axis,
	                offset: offset
	            }
	        },

	        scrollTo(x, y) {
                const wrapper = this.$refs.wrapperRef;
                wrapper.scrollLeft = x+'px';
                wrapper.scrollTop = y+'px';
                this.getSizes();
	        },

	        onDrag (e) {
	            if (this.dragging.enable) {
	                e.preventDefault()
	                e.stopPropagation()
	                e = e.changedTouches ? e.changedTouches[0] : e
	                const wrapper = this.$refs.wrapperRef
	                if (this.dragging.axis === 'X') {
	                    wrapper.scrollLeft = this.getCoordinates(e, 'X')
	                } else if (this.dragging.axis === 'Y') {
	                    wrapper.scrollTop = this.getCoordinates(e, 'Y')
	                }
	                this.getSizes()
	            }
	        },
	        stopDrag (e) {
	            if (this.dragging.enable) {
		            $mx('html').removeClass('is-dragging');
	                this.dragging = {
	                    enable: false,
	                    axis: ''
	                }
	            }
	        },
	        getSizes (X, Y) {
	            const wrapperRef = this.$refs.wrapperRef,
	                containerRef = this.$refs.container,
	                verticalBarRef = this.$refs.verticalBar,
	                verticalInternalBarRef = this.$refs.verticalInternalBar,
	                horizontalBarRef = this.$refs.horizontalBar,
	                horizontalInternalBarRef = this.$refs.horizontalInternalBar
	            this.wrapperObj = {
	                elm: wrapperRef,
	                scrollHeight: wrapperRef.scrollHeight,
	                scrollWidth: wrapperRef.scrollWidth,
	                scrollLeft: wrapperRef.scrollLeft,
	                scrollTop: wrapperRef.scrollTop
	            }
	            this.container = {
	                elm: containerRef,
	                scrollHeight: containerRef.scrollHeight,
	                scrollWidth: containerRef.scrollWidth
	            }
	            this.bars.horizontal.elm = horizontalInternalBarRef
	            this.bars.horizontal.parent = horizontalBarRef
	            this.bars.horizontal.size = this.wrapperObj.scrollWidth - this.container.scrollWidth > 24 &&
	                this.wrapperObj.scrollWidth - this.container.scrollWidth !== 0
	                ? (this.container.scrollWidth / this.wrapperObj.scrollWidth) * this.container.scrollWidth
	                : 0;
	            this.bars.vertical.elm = verticalInternalBarRef
	            this.bars.vertical.parent = verticalBarRef
	            this.bars.vertical.size = this.wrapperObj.scrollHeight - this.container.scrollHeight > 24 &&
	                this.wrapperObj.scrollHeight - this.container.scrollHeight !== 0
	                ? (this.container.scrollHeight / this.wrapperObj.scrollHeight) * this.container.scrollHeight
	                : 0
	        }
	    },
	    props: ['wrapper', 'vBar', 'vBarInternal', 'hBar', 'hBarInternal', 'shadow', 'shadowColor', 'shadowColorTransparent'], template: `<div id="vbar" :class="propWrapperSize"> <div class="bar--container" ref="container" @wheel="scroll" @touchmove="scroll" @touchstart="startScroll" @touchend="stopScroll"> <div class="bar--shadow bar--shadow-start" :style="shadowStyle('start')" :data-axis="shadow" v-show="wrapperObj.scrollLeft> 0"></div> <div class="bar--shadow bar--shadow-end" :style="shadowStyle('end')" :data-axis="shadow" v-show="wrapperObj.scrollLeft + container.scrollWidth != wrapperObj.scrollWidth"></div> <div class="bar--vertical" ref="verticalBar" v-show="bars.vertical.size" :style="barSizeVertical" :class="propBarVertical" @touchstart="startDrag" @mousedown="startDrag" data-axis="Y" data-drag-source="bar"> <div class="bar--vertical-internal" ref="verticalInternalBar" :style="barInternalVertical" :class="propBarInternalVertical" @touchstart="startDrag" @mousedown="startDrag" data-axis="Y" data-drag-source="internal"></div> </div> <div class="bar--horizontal" ref="horizontalBar" v-show="bars.horizontal.size" :style="barSizeHorizontal" :class="propBarHorizontal" @touchstart="startDrag" @mousedown="startDrag" data-axis="X" data-drag-source="bar"> <div class="bar--horizontal-internal" ref="horizontalInternalBar" :style="barInternalHorizontal" :class="propBarInternalHorizontal" @touchstart="startDrag" @mousedown="startDrag" data-axis="X" data-drag-source="internal"></div> </div> <div class="bar--wrapper" ref="wrapperRef" :style="validationScrolls"> <slot></slot> </div> </div> </div>`});

window.$app.defineComponent("component", "vue-component-video", {data() {
	        return {
	            player: null,
	            handlerDOM: null,
	        }
	    },

		props: ['options'],
		
		watch: {
			handler(v) {
				this.init();
			},
		
			options: {
				handler() {
					this.init();
/*
					if ((this.handler == 'player') && this.player) {
						this.player.src(this.sources);
					}
*/
				},
				deep: true
			}
		},
		
		computed: {
			handler() {
				return (this.options.handler != undefined)?this.options.handler:'embeded';	
			},
			link() {
				let isStatic = (new RegExp('[\?|\&]static=1', 'i')).test(location.search);
				return isStatic?this.options.embeded.replace('autoplay=1', ''):this.options.embeded;
			},
			sources() {
				return [{src: this.options.url, type: this.options.type}]
			}
		},
		
		beforeDestroy() {
	        if (this.player) {
	            this.player.dispose()
	        }
	    },
	    
		mounted() {
			this.init();
		},
		
		methods: {
			init() {
				let provider = VideoHelper.getProvider(this.options, false);
				
				if (provider) {
					if (provider.t != undefined) {
						this.options.handler = 'player';
			        } else {
				        this.options.embeded = provider.embeded(provider.match);
						this.options.handler = 'embeded';
					}
				} 
			
				if (this.handler == 'player') {
					let scripts = [];
					if (provider.s) scripts.push(provider.s);

					$mx.lazy('//cdn.jsdelivr.net/npm/video.js@7.1.0/dist/video.min.js', 'videoplayer.css', () => {
						$mx.lazy(scripts, [], () => {
							this.handlerDOM = this.handler;	
							
							let poster = null;
							if (this.options.poster) poster = '//'+this.$account.storage_domain+'/p/'+this.options.poster.filename;
							
							this.$nextTick(() => {
								if (this.player) {
									this.player.src(this.sources);
									this.player.poster(poster);
								} else {
									let sources = [{src: this.options.url, type: (typeof provider.t == 'function')?provider.t(provider.match[1]):provider.t}];
									let options = {/* playbackRates: [0.5, 1, 1.5, 2], */ poster: poster, controls: true, autoplay: false,  controlBar: {volumePanel: {inline: false}}, sources: sources};
									if (provider.techOrder != undefined) options.techOrder = provider.techOrder;
									
									this.player = videojs(this.$refs.videoPlayer, options)
								}
							});
						});
			        });
				} else {
					this.handlerDOM = this.handler;			
				}
			}
		}, template: `<div> <div class="video-container" v-show="handlerDOM == 'embeded'"> <iframe frameborder="0" :src="link" allowfullscreen="1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" v-if="handlerDOM == 'embeded'"></iframe> </div> <div class="video-container" v-show="handlerDOM == 'player'"> <video ref="videoPlayer" class="video-js vjs-fill" v-if="handlerDOM == 'player' || player"></video> </div> </div>`});

window.$app.defineComponent("pages", "vue-pages-blocks-form-addons", {props: {disabled: {type: Boolean, default: false}, values: Object, variants: {type: Object, default: []}, block_id: Number, block_type_id: Number, loading: {type: Boolean, default: false}, addons: {type: Object, default: null}, addonsLoadingEndpoint: {type: String, default: "pages/blocks/addons"}, addons_values: Object, parent: Object},
		
		created() {
			if (this.addonsLoadingEndpoint && (this.addons == null)) {
				this.loading = true;
				this.$api.get(this.addonsLoadingEndpoint, {block_id: this.block_id, block_type_id: this.block_type_id}).then((data) => {
					if (data.result == 'success') {
						let b = data.response.pages.block;
						this.addons = b.addons;
						this.addons_values = b.addons_values;
						this.variants = b.variants;
						
						if (b.addons.phrases) window.i18n.extend(b.addons.phrases);
						
						this.$emit('update:addons_values', this.addons_values);
					}
					this.loading = false;
				}).catch(() => {
					this.loading = false;
				})
			}
		},
		
		computed: {
			link() {
				return '/'+this.$router.currentRoute.params.page_id+'/addons/all/';
			}
		},
		
		methods: {
			loadEntry(name) {
				name = 'vue-addons-addon-'+name+'-entry';
				window.$app.loadComponent(name);
				return name;
			},
			
			getVariants(addon_name) {
				return (this.variants != undefined && this.variants.addons != undefined && this.variants.addons[addon_name] != undefined)?this.variants.addons[addon_name]:{};
			}
		}, template: `<section> <div v-if="addons && addons.addons_amount"> <div class="message is-info"> <div class="message-body"><slot name="message"></slot></div> </div> <div class="label-pro-container"> <div v-for="(f, addon_id) in addons.addons" v-if="f.addon_id != undefined" class="form-fields-item" :class="{in: (addons_values[addon_id] != undefined) && addons_values[addon_id].on, disabled: f.is_active == 0 || disabled}"> <div class="form-fields-item-title"> <span style="margin-left: 0"> <b-checkbox v-model="addons_values[addon_id].on" :disabled="f.is_active == 0 || disabled"><b>{{f.addon_title}}</b></b-checkbox> </span> </div> <div class="form-fields-item-options" v-if="f.is_has_options && (addons_values[addon_id] != undefined) && addons_values[addon_id].on && f.is_active != 0"> <component v-bind:is="loadEntry(f.addon_name)" :values="values" :addons="addons" :addon="f" :variants="getVariants(f.addon_name)" :options="addons_values[addon_id].options"></component> </div> </div> </div> </div> <div v-else class="has-pt-4 has-pb-4 has-text-centered" :class="{disabled: disabled}"> <div class="has-mb-2"><i class="fa fal fa-cog fa-5x has-text-grey-light" :class="{'is-invisible': loading}"></i></div> <div v-if="loading" class="has-text-grey">{{'Загрузка данных'|gettext}}</div> <div v-else><slot name="empty"></slot></div> <router-link v-if="!loading" :to="{path: link}" @click.native="parent.close()">{{'Посмотреть доступные модули'|gettext}}</router-link> </div> <b-loading :is-full-page="false" :active.sync="loading"></b-loading> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-form-background", {props: {value: Object, disabled: Boolean},
		
		watch: {
			value(v) {
				this.checkValue(v);
			}
		},
		
		created() {
			this.checkValue(this.value);
		},
		
		methods: {
			checkValue(v) {
				if (!v.on && _.size(v) == 1) {
					this.value = Object.assign(this.$clone(v), this.getDefault());
					this.$emit('input', this.value);
				}
			},
			
			getDefault() {
				let theme = this.$account.theme;
				return {type: 'solid', color1: theme.bg.color1, color2: '', picture: null, size: 'tile', repeat: 'repeat', position: '0% 0%'};
			},
			
			prepareValues() {
				let v = this.$clone(this.value);
				delete v.on;
				
				if (_.isEqual(v, this.getDefault())) {
					return {on: false};
				} else {
					return this.value;
				}
			}
		}, template: `<div class="label-pro-container"> <div class="tag is-pro" v-if="!$auth.isAllowTariff('pro')" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна<br>на pro тарифе'|gettext">pro</div> <div :class="{disabled: disabled || !$auth.isAllowTariff('pro')}"> <div class="has-mb-2"><mx-toggle v-model='value.on' :title="'Добавить фон к блоку'|gettext" :disabled="disabled"></mx-toggle></div> <vue-component-background-editor v-model="value" :disabled="disabled || !value.on"></vue-component-background-editor> </div> </div>`});

window.$app.defineComponent("pages", "vue-pages-blocks-form-design", {props: ['values', 'info'],
		
		created() {
			let theme = this.$account.theme;
			if (!this.values.text) this.values.text = theme.link.color;
			if (!this.values.bg) this.values.bg = theme.link.bg;
		}, template: `<div class="label-pro-container"> <div class="tag is-pro" v-if="!$auth.isAllowTariff('pro')" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна<br>на pro тарифе'|gettext">pro</div> <div :class="{disabled: !$auth.isAllowTariff('pro')}"> <div class="has-mb-2"><mx-toggle v-model='values.on' :title="'Свои настройки дизайна'|gettext" :disabled="info.is_readonly"></mx-toggle></div> <div v-if="values.on"> <div class="has-mb-2"> <vue-component-colorpicker v-model="values.bg" :label="'Цвет фона кнопки'|gettext" :disabled="info.is_readonly" :colors="[$account.theme.link.bg]"></vue-component-colorpicker> </div> <div class="has-mb-2"> <vue-component-colorpicker v-model="values.text" :label="'Цвет текста кнопки'|gettext" :disabled="info.is_readonly" :colors="[$account.theme.link.color]"></vue-component-colorpicker> </div> <slot></slot> </div> </div> </div>`});

window.$app.defineComponent("pages", "vue-pages-blocks-form-modal", {data() {
			return {
				isUpdating: false,
				isDeleting: false,
				isFetching: false,
				isFetchingBlockType: null,
				canDelete: false,
				tabs: [],
				defaultsTabs: [],
				currentTab: 'common',
				currentBlock: null,
				tariff: null,
				values: {},
				options: {},
				variants: {},
				bg: {on: false},
				block: {title: null},
				permit: {},
				archives: [],
				info: {},
				types: [],
				typesKeys: [],
				isAnimatedTariff: false,
				allowSave: true,
				block_type_id: null
			}
		},

		created() {
			if (this.block_id) {
				this.fetchData(true);
			} else {
				this.isFetching = true;
				for (var i = 0; i < 15; i++) this.types.push({icon: '<svg></svg>'});
				this.$api.get(['pages/blocks/types', 'pages/blocks/archives']).then((data) => {
					this.types = data.response.pages.blocks.types;
					this.archives = data.response.pages.blocks.archives;
					this.isFetching = false;
					this.defaultsTabs = this.tabs = (this.archives.length)?[{name: 'common', title: this.$gettext('Стандартные блоки')},{name: 'archives', title: this.$gettext('Из архива')}]:[];
					
					this.typesKeys = [];
					_.each(this.types, (o) => {
						this.typesKeys[o.block_type_id] = o;
					})
				});
			}
		},
		
		computed: {
			ratePlanLink() {
				return window.base_path_prefix+'/tariffs/';
			},
			
			isAllowTariff() {
				return this.$auth.isAllowTariff(this.tariff);
			}
		},
		
		props: ['block_id', 'page_id'],
		mixins: [FormModel],

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('pages/blocks/get', {block_id: this.block_id}).then((data) => {
					this.isFetching = false;
					let block = data.response.pages.block;
					
					this.permit = block.permit;
					this.values = block.values;
					this.bg = block.bg;
					this.options = block.options;
					
					this.variants = block.variants;
					this.tariff = block.tariff;
					this.info = block.info;
					
					this.page_id = block.page_id;
					this.block_type_id = block.block_type_id;
					
					if (!this.$auth.isAllowTariff(block.tariff))  {
						this.info.is_readonly = true;
						this.canDelete = true;
					}
					
					this.currentBlock = 'vue-pages-blocks-'+block.block_type_name;
				});
			},
			
			close() {
				this.$parent.close()
			},
			
			action(name, params) {
				return this.$api.get('pages/blocks/action', {block_id: this.block_id, name: name, params: params}, this);
			},
			
			chooseType(f) {
				this.isFetchingBlockType = f.block_type_id;
				this.$api.get('pages/blocks/info', {block_type_id: f.block_type_id}).then((data) => {
					this.isFetchingBlockType = null;
					let block = data.response.pages.block;
					
					this.variants = block.variants;
					this.values = block.defaults.values;
					this.bg = {on: false};
					this.options = block.defaults.options;
					this.block_type_id = block.block_type_id;
					
					this.info = block.info;
					this.tariff = block.tariff;
					
					if (!this.$auth.isAllowTariff(block.tariff)) this.info.is_readonly = true;
					
					this.currentBlock = 'vue-pages-blocks-'+block.block_type_name;
				});				
			},
			
			back() {
				this.currentBlock = null;
				this.currentTab = 'common'
				this.tariff = null;
				this.tabs = this.defaultsTabs;
				this.info = [];
				this.values = [];
				this.variants = {};
			},
			
			restoreBlock(block_id) {
				this.isUpdating = true;
				this.$api.get('pages/blocks/restore', {block_id: block_id, page_id: this.page_id}, this).then((response) => {
					this.isUpdating = false;
					if (response.result == 'success') {
						this.$parent.close();
					}
				}).catch(() => {
					this.isUpdating = false;
				})	
			},
			
			onAction(v) {
				switch (v) {
					case 'delete':
						this.deleteBlock('delete');
						break;
					case 'archive':
						this.deleteBlock('archive');
						break;
					case 'clone':
						this.cloneBlock();
						break;
				}
			},
			
			cloneBlock() {
				this.isUpdating = true;
				this.$api.get('pages/blocks/clone', {block_id: this.block_id}, this.$refs.model).then((response) => {
					this.isUpdating = false;
					if (response.result == 'success') {
						this.$parent.close();
					}
				});
			},
			
			deleteBlock(method) {
				this.$confirm((method == 'delete')?this.$gettext('Вы уверены что хотите удалить этот блок?'):this.$gettext('Вы уверены что хотите отправить этот блок в архив?'), (method == 'delete')?'is-danger':'is-warning').then(() => {
					this.isDeleting = true;
					
					this.$api.get('pages/blocks/'+method, {block_id: this.block_id}, this.$refs.model).then((response) => {
						this.isDeleting = false;
						if (response.result == 'success') {
							this.$parent.close();
						}
					}).catch(() => {
						this.isDeleting = false;
					})
				});
			},
			
			save() {
				this.isUpdating = true;
				
				let values = this.$refs.model.prepareValues();
				let addons_values = values.addons_values;
				let bg = this.$refs.bg.prepareValues();
				
				delete values.addons_values;
				
				this.$api.post('pages/blocks/set', {block_id: this.block_id, page_id: this.page_id, block_type_id: this.block_type_id, values: values, options: this.options, addons_values: addons_values, bg: bg}, this.$refs.model).then((response) => {
					this.isUpdating = false;
					if (response.result == 'success') {
						this.$parent.close();
					} else {
						if (this.$refs.model.showErrors != undefined) this.$refs.model.showErrors(response);
					}
				}).catch(() => {
					this.isUpdating = false;
				})	

			},
			
			scrollToTariff() {
				if (!this.isAllowTariff) {
					let m = this.$refs.tariffMessage;
					
					scrollIt(0, 'y', $mx(m).closest('.modal')[0], 400);
					
					this.isAnimatedTariff = true;
					setTimeout(() => {
						this.isAnimatedTariff = false;
					}, 1000);
				}
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title" v-if="block.title">{{block.title}}</p> <p class="modal-card-title" v-else-if="isFetching">{{'Загрузка'|gettext}}</p> <p class="modal-card-title" v-else>{{'Добавить новый блок'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <ul class="nav nav-tabs nav-tabs-scroll has-text-left" v-if="tabs.length"> <li v-for="(tab, index) in tabs" :class="{active: currentTab== tab.name}"><a @click="currentTab = tab.name">{{tab.title|gettext}}</a></li> </ul> <section class="message is-danger" style="flex-shrink: 0;flex-grow: 0" v-if="!isAllowTariff"> <div class="message-body" :class="{'shake animated': isAnimatedTariff}" ref="tariffMessage"><span v-if="tariff == 'pro' || tariff== 'plus'">{{'Доступно на pro-тарифе'|gettext}}</span><span v-if="tariff == 'business'">{{'Доступно на business-тарифе'|gettext}}</span> <a :href='ratePlanLink' target="_blank" class='is-pulled-right'>{{'Подробнее'|gettext}} <i class="fa fa-angle-right" style="margin-left: 5px"></i></a></div> </section> <component v-bind:is="currentBlock" ref='model' :values="values" :options="options" :variants="variants" :info="info" :block_id="block_id" :block_type_id="block_type_id" :block="block" :current-tab="currentTab" :tabs.sync="tabs" v-if="currentBlock" :parent="$parent" :allowSave.sync="allowSave"> <template> <section v-show="currentTab == 'system:background'"> <vue-pages-blocks-form-background v-model="bg" ref="bg" :disabled="info.is_readonly"></vue-pages-blocks-form-background> </section> </template> </component> <section class="modal-card-body" v-if="!currentBlock && currentTab== 'common'"> <div class="row row-small" style="margin-bottom: -1rem"> <div class="col-sm-4 col-xs-6 has-mb-2" v-for="f in types"><button @click="chooseType(f)" class="button is-block-button is-default btn-block" :class="{'is-loading': isFetchingBlockType && isFetchingBlockType== f.block_type_id}" :disabled="isFetching || isFetchingBlockType"> <div v-if="!$auth.isAllowTariff(f.tariff) && (f.tariff == 'pro' || f.tariff == 'plus')" class="tag is-pro" data-toggle="tooltip" data-placement="top" :data-original-title="'Этот блок доступен<br>на pro-тарифе'|gettext">pro</div> <div v-if="!$auth.isAllowTariff(f.tariff) && (f.tariff == 'business')" class="tag is-danger is-business" data-toggle="tooltip" data-placement="top" :data-original-title="'Этот блок доступен<br>на business-тарифе'|gettext">biz</div> <div v-html="f.icon"></div> <div>{{f.block_type_title|gettext}}</div> </button></div> </div> </section> <section class="modal-card-body" v-if="!currentBlock && currentTab== 'archives'"> <button class="button is-light btn-block is-fullwidth has-p-2" :class="{'has-mt-2': i}" style="justify-content: space-between" v-for="(f, i) in archives" @click="restoreBlock(f.block_id)"> <span class="has-mr-1" style="display: flex;align-items: center;overflow:hidden"> <span v-html="typesKeys[f.block_type_id].icon" class="is-block-button is-archive"></span> {{typesKeys[f.block_type_id].block_type_title|gettext}}<span class="has-ml-1" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;opacity:.4" v-if="f.title">— {{f.title}}</span></span> <span class="has-text-grey">{{f.tms_archived|date}}</span> </button> </section> <footer class="modal-card-foot level" v-if="currentBlock"> <div class="level-left"> <vue-component-action-button v-if="block_id && (!info.is_readonly || canDelete)" @action="onAction" :title="'Действие'|gettext"> <template slot="actions"> <b-dropdown-item value="clone"><i class="fa fa-clone"></i> {{'Дублировать'|gettext}}</b-dropdown-item> <hr class="dropdown-divider" aria-role="menuitem"> <b-dropdown-item value="archive" v-if="info.permit.can_archive && $auth.isAllowTariff('pro')"><i class="fa fa-archive"></i> {{'В архив'|gettext}}</b-dropdown-item> <hr class="dropdown-divider" aria-role="menuitem" v-if="info.permit.can_archive && $auth.isAllowTariff('pro')"> <b-dropdown-item value="delete" class="has-text-danger" :class="{disabled: !info.permit.can_delete}"><i class="fa fa-trash-alt"></i> {{'Удалить'|gettext}}</b-dropdown-item> </template> </vue-component-action-button> <button v-if="currentBlock && !block_id" class="button is-default is-pulled-left" @click="back"><i class="fa fa-angle-left has-mr-2"></i>{{'Назад'|gettext}}</button> </div> <div class="level-right"> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="save" :disabled="info.is_readonly || !allowSave">{{'Сохранить'|gettext}}</button> </div> </footer> <footer class="modal-card-foot" v-if="!currentBlock"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("pages", "vue-pages-blocks-form-options", {data() {
			return {
				schedule_days: [],
				date_from: null,
				date_until: null,
				time_from: null,
				time_until: null,
				allowPro: false,
				first_day_week: this.$getFirstDayWeek(),
				weekdays: this.$getDaysNames(),
			}
		},
		
		props: ['values', 'info', 'variants'],
		
		computed: {
			weekdays_schedule() {
				let r = [];
				if (!this.first_day_week) r.push({index: 6, weekday: this.weekdays[0]});
				for (var i = 1; i < 7; i++) r.push({index: i-1, weekday: this.weekdays[i]});
				if (this.first_day_week) r.push({index: 6, weekday: this.weekdays[0]});
				
				return r;
			},
			
			daysSummary() {
				let d = this.schedule_days;
				if (d.length == 7) return this.$gettext('Каждый день');
				if (d.length == 5 && (d.indexOf(5) == -1) && (d.indexOf(6) == -1)) return this.$gettext('Будние дни');
				if (d.length == 2 && (d.indexOf(5) != -1) && (d.indexOf(6) != -1)) return this.$gettext('Выходные дни');
				return '';
			}
		},
		
		watch: {
			time_from() {
				this.onInputDates();
			},

			time_until() {
				this.onInputDates();
			}
		},

		created() {
			let parse = (d) => {
				d = d.split('-');
				return new Date(d[0], d[1]-1, d[2]);
			}
			
			this.allowPro = this.$auth.isAllowTariff('pro');
			this.date_from = this.values.date_from?parse(this.values.date_from):null;
			this.date_until = this.values.date_until?parse(this.values.date_until):null;
			
			if (this.values.time_from)
			{
				let dt = this.values.time_from.split(':')
				this.time_from = new Date(0, 0, 0, dt[0], dt[1]);
			}

			if (this.values.time_until)
			{
				let dt = this.values.time_until.split(':')
				this.time_until = new Date(0, 0, 0, dt[0], dt[1]);
			}
			
			for (var i = 0; i < 7; i++) if (this.values.schedule_days & Math.pow(2, i)) this.schedule_days.push(i);
		},
		
		methods: {
			onInputDates() {
				this.values.date_from = this.date_from?date_format('Y-m-d', this.date_from):null;
				this.values.date_until = this.date_until?date_format('Y-m-d', this.date_until):null;
				
				this.values.time_from = this.time_from?date_format('H:i', this.time_from):null;
				this.values.time_until = this.time_until?date_format('H:i', this.time_until):null;
				
				this.values.schedule_days = _.reduce(this.schedule_days, (v, i) => { return v + Math.pow(2, i)}, 0);
			}
		}, template: `<div> <div class="has-mb-2"> <mx-toggle v-model="values.is_visible" :title="'Скрыть блок'|gettext" :disabled="info.is_readonly" :invert="true"></mx-toggle> </div> <div class="label-pro-container"> <div v-if="!allowPro" class="tag is-pro" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна<br>на pro тарифе'|gettext">pro</div> <div :class="{disabled: !values.is_visible}"> <div class="has-mb-2"> <mx-toggle v-model="values.is_schedule" :title="'Показывать по расписанию'|gettext" :disabled="info.is_readonly || !allowPro"></mx-toggle> </div> <div class="has-mb-2" v-if="values.is_schedule"> <div class="row row-small has-mb-1"> <label class="label col-xs-2 col-sm-1"><p class="form-control-static">{{'От'|gettext}}:</p></label> <div class="col-xs-7 col-sm-8"> <vue-component-datepicker v-model="date_from" icon="calendar-alt" @input="onInputDates" :disabled="!values.is_schedule || info.is_readonly"></vue-component-datepicker> </div> <div class="col-xs-3"> <div class="has-feedback"> <b-clockpicker icon="clock" v-model="time_from" :disabled="!values.is_schedule || info.is_readonly" hour-format="24"></b-clockpicker> <a class="form-control-feedback has-text-grey-light" @click="time_from = null" :class="{disabled: info.is_readonly}" v-if="time_from"><i class="fal fa-times"></i></a> </div> </div> </div> <div class="row row-small"> <label class="label col-xs-2 col-sm-1"><p class="form-control-static">{{'До'|gettext}}:</p></label> <div class="col-xs-7 col-sm-8"> <vue-component-datepicker v-model="date_until" @input="onInputDates" :disabled="!values.is_schedule || info.is_readonly"></vue-component-datepicker> </div> <div class="col-xs-3"> <div class="has-feedback"> <b-clockpicker icon="clock" v-model="time_until" :disabled="!values.is_schedule || info.is_readonly" hour-format="24"></b-clockpicker> <a class="form-control-feedback has-text-grey-light" @click="time_until = null" :class="{disabled: info.is_readonly}" v-if="time_until"><i class="fal fa-times"></i></a> </div> </div> </div> </div> <div> <mx-toggle v-model="values.is_schedule_days" :title="'Показывать по дням недели'|gettext" :disabled="info.is_readonly || !allowPro"></mx-toggle> </div> <div class="has-mt-2 form-horizontal" v-if="values.is_schedule_days"> <div class="row row-small"> <label class="label col-xs-2 col-sm-1 is-hidden-mobile"><p class="form-control-static">{{'Дни'|gettext}}:</p></label> <div class="col-xs-12 col-sm is-flex schedule-days-chooser"> <b-field :class="['is-marginless', {disabled: !values.is_schedule_days}]"> <b-checkbox-button v-for="w in weekdays_schedule" v-model="schedule_days" :native-value="w.index" type="is-dark" @input="onInputDates" class="choose-days">{{w.weekday|gettext}}</b-checkbox-button> </b-field> <p class="form-control-static has-text-grey has-sm-ml-1">{{daysSummary}}</p> </div> </div> </div> </div> </div> </div>`});

window.$app.defineComponent("pages", "vue-pages-blocks-form-statistics", {data() {
			return {
				period_title: '',
				clicks: [],
				chart: [],
				isFetching: false,
			}	
		},
		
		props: {page_id: Number, block_id:Number, period: {
			type: String,
			default: 'day'
		}, period_back: {
			type: Number,
			default: 0
		}, disabled: {
			type: Boolean,
			default: false
		}},
		
		watch: {
			period() {
				this.fetchData(['chart', 'clicks']);
				this.period_back = 0;
			},
			period_back() {
				this.fetchData(['clicks']);
			}
		},
		
		created() {
			this.fetchData(['chart', 'clicks']);
		},
		
		methods: {
			fetchData(scope) {
				this.isFetching = true;
				
				this.$api.get('statistics/get', {page_id: this.page_id, block_id: this.block_id, period: this.period, period_back: this.period_back, scope: scope}).then((data) => {
					if (scope.indexOf('chart') != -1) this.chart = _.map(data.response.statistics.chart, (v, k) => {
						return {date: k, hits: v};
					});

					
					this.clicks = data.response.statistics.clicks;
					this.period_title = data.response.statistics.period.title;
					this.isFetching = false;
				});
			}
		}, template: `<section> <b-field class="has-tabs-style" :class="{disabled: disabled}"> <b-radio-button v-model="period" type="active" class="is-expanded" native-value="day">{{'День'|gettext}}</b-radio-button> <b-radio-button v-model="period" type="active" class="is-expanded" native-value="week">{{'Неделя'|gettext}}</b-radio-button> <b-radio-button v-model="period" type="active" class="is-expanded" native-value="month">{{'Месяц'|gettext}}</b-radio-button> </b-field> <vue-component-statistics :data="chart" :period="period" :period_back="period_back" :line-show="true" :padding-top="30" class="has-mb-3 is-small" :disabled="disabled"></vue-component-statistics> <div class="field has-addons" :class="{disabled: disabled}"> <p class="control"><button class="button" @click="period_back++"><i class="fas fa-caret-left"></i></button></p> <p class="control is-expanded"><span class="button is-static has-background-white is-fullwidth">{{ period_title }}</span></p> <p class="control"><button class="button" :disabled="period_back == 0" @click="period_back--"><i class="fas fa-caret-right"></i></button></p> </div> <b-table :data="clicks" :loading="isFetching" :disabled="disabled"> <template slot-scope="props"> <b-table-column field="title" :label="'Заголовок'|gettext"> {{ props.row.type }} </b-table-column> <b-table-column field="clics" :label="'Клики'|gettext" :class='{"has-text-grey-light": props.row.clicks == 0}' numeric>{{ props.row.clicks | number }}</b-table-column> </template> <template slot="empty"> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="!isFetching"> <p>{{'Недостаточно данных'|gettext}}</p> </section> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="isFetching"> <p>{{'Загрузка данных'|gettext}}</p> </section> </template> </b-table> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-avatar", {data() {
			return {
				isUpdating: false,
				isUploading: false,
				instagramUpdated: false,
				file: null
			}
		},

		props: ['values', 'variants', 'block', 'block_id', 'info', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		created() {
			this.block.title = this.$gettext('Аватар');
			this.$emit('update:tabs', []);
		},
		
		methods: {
			dropFilesChanged(is_updating) {
				if (/\.(jpe?g|png|gif)$/i.test(this.file.name)) {
					let formData = new FormData();
					formData.append('file', this.file);
					formData.append('picture_id', this.$account.profile_id);
					
					this.isUploading = true;
					
					this.$http.request({url: '/pictures/upload?target=avatar', method: 'post', data: formData}).then((data) => {
						if (data.result == 'success') {
							//this.$account.avatar.url = '//'+this.$account.storage_domain+'/a/'+r.data.response.filename;
						} else if (data.result == 'error') {
							this.$alert(data.error, 'is-danger');
						}
						
						this.isUploading = false;
						this.file = null;
					}).catch(() => {
						this.isUploading = false;
						this.$alert(this.$gettext('Во время загрузки картинки возникла ошибка'));
					});				
				} else {
					this.isUploading = false;
					this.$alert(this.$gettext('Недопустимый формат файла'));
				}
			},
			
			updateAvatar() {
				this.isUpdating = true;
				this.instagramUpdated = true;
				this.$parent.action('update').then((v) => {
					this.isUpdating = false;
				})
			},
			
			prepareValues() {
				return this.values;
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="currentTab == 'common'"> <div class="media" style="align-items: center"> <img :src="$account.avatar.url" class="is-pulled-left has-mr-3" :class="$account.avatar.size|sprintf('profile-avatar profile-avatar-%s')"> <div class="media-content"> <div> <b-upload v-model="file" @input="dropFilesChanged(false)"> <a class="button is-fullwidth-mobile is-success" :class="{'is-loading': isUploading}"><span><i class="fa fas fa-arrow-from-top fa-rotate-180 has-mr-2" :disabled="info.is_readonly"></i>{{'Загрузить картинку'|gettext}}</span></a> </b-upload> <button class="button is-fullwidth-mobile is-light has-xs-mt-1" @click="updateAvatar()" :class="{'is-loading': isUpdating}" :disabled="info.is_readonly || instagramUpdated" v-if="info.has_connected_account && block_id">{{'Импортировать из Instagram'|gettext}}</button> </div> </div> </div> </section> <section :class="{disabled: info.is_readonly}"> <label class="label">{{'Размер аватара'|gettext}}</label> <div class="tabs is-toggle is-fullwidth is-avatar-size-chooser has-mb-1"> <ul> <li :class="{'is-active': values.avatar_size == k}" v-for="(v, k) in variants.avatar_size"><a @click="values.avatar_size = k"><em></em></a></li> </ul> </div> <p class="has-text-grey">{{variants.avatar_size[values.avatar_size]}}</p> </section> <section v-if="info.has_connected_account"> <mx-toggle v-model="values.is_avatar_hide_text" :title="'Скрыть имя профиля под аватаром'|gettext" :disabled="info.is_readonly"></mx-toggle> </section> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-banner", {props: ['values', 'options', 'info', 'variants', 'block', 'block_id', 'block_type_id', 'tabs', 'currentTab', 'allowSave'],
		mixins: [FormModel],
		
		data() {
			return {
				addons_values: null
			}
		},
	
		created() {
			this.block.title = this.$gettext('Баннер');
			
			let tabs = [{name: 'common', title: this.$gettext('Картинка')}, {name: 'options', title: this.$gettext('Настройки')}, {name: 'addons', title: this.$gettext('Модули')}];
			
			if (this.block_id && this.info.is_allow_statistics) tabs.push({name: 'statistics', title: this.$gettext('Статистика')});

			this.$emit('update:tabs', tabs);
		},
		
		computed: {
			pictureSizeStyle() {
				return 'padding-top: '+(this.values.p?(this.values.p.height / this.values.p.width * 100):50)+'%';
			},
			styleOuterContainer() {
				return (this.values.is_scale && this.values.width)?('width: '+this.values.width+'px !important;'):'';
			}
		},
		
		methods: {
			prepareValues() {
				console.log(this.values);
				let values = this.$clone(this.values);
				console.log(values);

				values.addons_values = this.addons_values;
				if (values.p) values.p = values.p.picture_id;
				return values;
			},
			
			startUploading() {
				this.allowSave = false;
				//this.$emit('update:allowSave', this.allowSave);
			},
			
			stopUploading() {
				this.allowSave = true;
				//this.$emit('update:allowSave', this.allowSave);
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="info.is_readonly && (currentTab == 'common')" class="message is-warning"> <div class="message-body">{{'Добавьте изображение любого размера и укажите действие при клике'|gettext}}</div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <div class="device-pictures-form"> <center> <div class="device has-shadow is-large is-hide-mobile" :class="{disabled: info.is_readonly}"> <div class="notch"></div> <div class="screen page-font"> <div class="has-sm-p-1"> <vue-component-pictures v-model="values.p" class="pictures-form-banner" class-container="picture-container picture-container-upload" :button-title="'Загрузить картинку'|gettext" :style-container="pictureSizeStyle" :style-outer-container="styleOuterContainer" button-icon="fa fal fa-cloud-upload" @startUploading="startUploading" @stopUploading="stopUploading" updatable></vue-component-pictures> </div> </div> </div> </center> <div class='form-shadow form-shadow-bottom is-hidden-mobile' style="height: 20px"></div> </div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <mx-toggle v-model="values.is_scale" :title="'Установить максимальную ширину'|gettext" :disabled="info.is_readonly || !values.p"></mx-toggle> <div class="row row-small has-mt-2" v-if="values.is_scale && values.p"> <div class="col-xs-12 col-sm-4"> <b-field> <p class="control is-expanded"><number v-model="values.width" precision="0" :disabled="info.is_readonly" class="input has-text-right" :placeholder="values.p?values.p.width:''"/></p> <p class="control"> <a class="button is-static">px</a> </p> </b-field> </div> </div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <mx-toggle v-model="values.is_link" :title="'Сделать баннер ссылкой'|gettext" :disabled="info.is_readonly"></mx-toggle> <div v-if="values.is_link"> <vue-component-link-editor :values.sync="values.link" :variants="variants" :info="info" class="has-mt-2"></vue-component-link-editor> </div> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <keep-alive> <vue-pages-blocks-form-addons :block_id="block_id" :block_type_id="block_type_id" :addons_values.sync="addons_values" :disabled="info.is_readonly" :parent="parent" v-if="currentTab == 'addons'"> <template slot="message">{{'Вы можете выбрать модули которые будут срабатывать для данной ссылки'|gettext}}</template> <template slot="empty">{{'Модули для данного блока еще не подключены'|gettext}}</template> </vue-pages-blocks-form-addons> </keep-alive> <keep-alive> <vue-pages-blocks-form-statistics :page_id="values.page_id" :block_id="block_id" v-if="currentTab == 'statistics'"></vue-pages-blocks-form-statistics> </keep-alive> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-break", {props: ['values', 'options', 'variants', 'info', 'block', 'block_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		data() {
			return {
				icons: [-1,0,1,2,3,4,5,6,7]
			}
		},
		
		created() {
			this.block.title = this.$gettext('Разделитель');

			let theme = this.$account.theme;
			if (!this.values.design.color) this.values.design.color = theme.screen.color;

			this.$emit('update:tabs', [{name: 'common', title: this.$gettext('Разделитель')},{name: 'options', title: this.$gettext('Настройки')}]);
		},
		
		methods: {
			prepareValues() {
				let values = this.$clone(this.values);
				let theme = this.$account.theme;
				
				if (values.design.color == theme.screen.color) values.design.color = '';
				
				if (!values.design.color) values.design = {on: false}

				return values;
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="currentTab == 'common'"> <b-field :label="'Размер отступа'|gettext"> <b-select v-model="values.break_size" :disabled="info.is_readonly" expanded> <option v-for="(v, k) in variants.break_size" :value="k">{{v}}</option> </b-select> </b-field> <label class="label">{{'Тип разделителя'|gettext}}</label> <div class="break-form-type-list has-mb-2 row row-small"> <div v-for="i in icons" class="col-xs-4 col-sm-2 col-md-2"> <div class="break-form-type block-break" @click="values.icon = i" :class="{in: values.icon == i}"><div class="block-break-inner" :class="{'has-icon': i, 'is-invisible': i < 0, 'is-fullwidth': values.fullwidth && i== 0, 'has-fading': values.fading}"><span><i :class="['fa fai', 'fa-'+i]" v-if="i> 0"></i></span></div></div> </div> </div> <div :class="{disabled: values.icon < 0}"> <label class="label">{{'Настройки линии'|gettext}}</label> <mx-toggle v-model="values.fullwidth" class="has-mb-2" :title="'Линия на всю ширину'|gettext" :disabled="info.is_readonly"></mx-toggle> <mx-toggle v-model="values.fading" :title="'Линия с полупрозрачными краями'|gettext" :disabled="info.is_readonly"></mx-toggle> </div> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <div class="label-pro-container"> <div class="tag is-pro" v-if="!$auth.isAllowTariff('pro')" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна<br>на pro тарифе'|gettext">pro</div> <div :class="{disabled: !$auth.isAllowTariff('pro')}"> <div class="has-mb-2"><mx-toggle v-model='values.design.on' :title="'Свои настройки дизайна'|gettext" :disabled="info.is_readonly"></mx-toggle></div> <div v-if="values.design.on"> <div class="has-mb-2"> <vue-component-colorpicker v-model="values.design.color" :label="'Цвет'|gettext" :disabled="info.is_readonly" :colors="[$account.theme.screen.color]"></vue-component-colorpicker> </div> </div> </div> </div> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-collapse", {props: ['values', 'options', 'variants', 'info', 'block', 'block_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		data() {
			return {
				current: 0
			}
		},
		
		created() {
			this.block.title = this.$gettext('Вопросы и ответы');
			let theme = this.$account.theme;

			if (!this.values.design.color) this.values.design.color = theme.screen.color;
			if (!this.values.design.font) this.values.design.font = theme.screen.font;

			this.$emit('update:tabs', [{name: 'common', title: this.block.title},{name: 'options', title: this.$gettext('Настройки')}]);
		},
		
		methods: {
			prepareValues() {
				let values = this.$clone(this.values);
				let theme = this.$account.theme;
				
				if (values.design.color == theme.screen.color) values.design.color = '';
				if (values.design.font == theme.screen.font) values.design.font = '';
				
				if (!values.design.color && !values.design.font) values.design = {on: false}

				return values;
			},
			
			onRemove(index) {
				this.$confirm(this.$gettext('Вы уверены что хотите удалить этот вопрос?'), 'is-danger').then(() => {
					this.values.fields.splice(index, 1);
				});
			},
			
			onAdd() {
				this.values.fields.push({title: '', text: '', opened: true});
				this.current = this.values.fields.length - 1;
				
				this.$nextTick(() => {
					this.$refs.fields.querySelector('.in input').focus();
				});
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="currentTab == 'common'"> <div ref="fields"> <vue-component-sortable-form-fields v-model="values.fields" :current.sync="current"> <template v-slot:title="{ item }"> <span><span v-if="item.title">{{ item.title }}</span><span v-else>{{'Заголовок'|gettext}}</span></span> </template> <template v-slot:action="{ index }"> <a class="is-pulled-right has-text-danger" @click.stop="onRemove(index)" :class="{disabled: info.is_readonly}"><i class="fa fa-trash-alt"></i></a> </template> <template v-slot:form="{ item, index }"> <div class="field"> <label>{{'Заголовок'|gettext}}</label> <b-input type="text" v-model="item.title" :disabled="info.is_readonly"></b-input> </div> <div class="field"> <label>{{'Текст'|gettext}}</label> <vue-component-emoji-picker v-model="item.text"> <textarea class="input" v-model="item.text" :disabled="info.is_readonly" v-emoji rows="6"></textarea> </vue-component-emoji-picker> </div> </template> </vue-component-sortable-form-fields> </div> </section> <section v-if="currentTab == 'common'"> <button type="button" @click="onAdd" class="button is-success" :class="{disabled: info.is_readonly}"><i class="fas fa-plus has-mr-1"></i>{{'Добавить новый пункт'|gettext}}</button> </section> <section v-if="currentTab == 'options'"> <div class="label-pro-container"> <div class="tag is-pro" v-if="!$auth.isAllowTariff('pro')" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна<br>на pro тарифе'|gettext">pro</div> <div :class="{disabled: !$auth.isAllowTariff('pro')}"> <div class="has-mb-2"><mx-toggle v-model='values.design.on' :title="'Свои настройки дизайна'|gettext" :disabled="info.is_readonly"></mx-toggle></div> <div v-if="values.design.on"> <div class="has-mb-2"> <vue-component-colorpicker v-model="values.design.color" :label="'Цвет текста'|gettext" :disabled="info.is_readonly" :colors="[$account.theme.screen.color]"></vue-component-colorpicker> </div> <div class="has-mb-2 link-styles-container"> <label class="form-control-static">{{'Шрифт'|gettext}}</label> <vue-component-font-chooser v-model="values.design.font" view="name"></vue-component-font-chooser> </div> </div> </div> </div> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-form", {props: ['values', 'options', 'parent', 'info', 'variants', 'block_type_id', 'info', 'block', 'block_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		data() {
			return {
				addons_values: null,
				action: null
			}
		},
		
		created() {
			this.block.title = this.$gettext('Форма');
			
			let tabs = [
				{name: 'common', title: this.$gettext('Поля')},
				{name: 'options', title: this.$gettext('Настройки')}
			];
				
			if (this.$account.features.indexOf('payments') != -1) tabs.push({name: 'pays', title: this.$gettext('Оплаты')});
			if (this.$account.features.indexOf('addons') != -1) tabs.push({name: 'addons', title: this.$gettext('Модули')});

/*
			let theme = this.$account.theme;
			if (!this.values.link_color) this.values.link_color = theme.link.color;
			if (!this.values.link_bg) this.values.link_bg = theme.link.bg;
*/

			this.$emit('update:tabs', tabs);
		},
		
		computed: {
			currentPaidStatus() {
				let s = '';
				for (let i = 0; i < this.variants.paid_status_id.length; i++) {
					if (this.variants.paid_status_id[i].status_id == this.values.paid_status_id) {
						s = this.variants.paid_status_id[i].status;
						break;
					}
				}
				
				return s;
			}
		},
		
		methods: {
			prepareValues() {
				let values = this.$clone(this.values);
				values.addons_values = this.addons_values;
				
				values.fields = _.map(values.fields, (v) => {
					return _.pick(v, ['default', 'required', 'text', 'title', 'type_id', 'variants', 'idx']);
				});
				
				let theme = this.$account.theme;
				if ((values.design.text == theme.link.color) && (values.design.bg == theme.link.bg)) values.design = {on: false}
				
				return values;
			},

			onAction(v) {
				if (!v) return;

				this.values.fields_idx.toString(16);
				this.values.fields.push({title: this.variants.fields_types[v], text: '', type_id: v, required: false, default: 0, variants: '', opened: true, idx: this.values.fields_idx.toString(16)});
				this.values.fields_idx++;
				
				Vue.nextTick(() => {
		            this.action = null;
	            });
			}			
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="info.is_readonly && (currentTab == 'common')" class="message is-warning"> <div class="message-body">{{'С помощью этого блока, вы сможете создать форму для сбора контактных данных и добавить прием оплаты'|gettext}}</div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <b-select :placeholder="'-- Добавить поле --'|gettext" v-model="action" @input="onAction" :disabled="info.is_readonly" expanded> <option v-for="(f, i) in variants.fields_types" :value="i">{{ f }}</option> </b-select> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <vue-component-form-blocks v-model="values.fields" :variants="variants" :disabled="info.is_readonly"></vue-component-form-blocks> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <b-field :label="'Текст на кнопке'|gettext"> <input type="text" v-model="values.form_btn" class="input" :disabled="info.is_readonly" :placeholder="'Отправить'|gettext"> </b-field> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <b-field :label="'Действие после заполнения формы'|gettext"> <b-select v-model="values.form_type" :disabled="info.is_readonly" expanded> <option v-for="(v, k) in variants.form_type" :value="k">{{v}}</option> </b-select> </b-field> <b-field v-if="values.form_type == 'link'" :class="{'has-error': errors.link}" :message="errors.link"> <input type='text' v-model='values.link' class='input' placeholder='http://' autocorrect="off" autocapitalize="none" :disabled="info.is_readonly"> </b-field> <b-field v-if="values.form_type == 'page'" :class="{'has-error': errors.link_page_id}" :message="errors.link_page_id"> <b-select v-model="values.link_page_id" :placeholder="'-- Не выбрано --'|gettext" :disabled="info.is_readonly" expanded> <option v-for="(v, k) in variants.link_page_id" :value="k">{{v}}</option> </b-select> </b-field> <b-field v-if="values.form_type == 'text'" :class="{'has-error': errors.form_text}" :message="errors.form_text"> <textarea v-model='values.form_text' class='input' style="min-height: 100px" :disabled="info.is_readonly" :placeholder="'Спасибо за вашу заявку'|gettext"></textarea> </b-field> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <vue-pages-blocks-form-design :values.sync="values.design" :info="info"></vue-pages-blocks-form-design> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <section v-if="currentTab == 'pays'" @click="$parent.scrollToTariff"> <div v-if="$auth.isAllowTariff('business') && !info.amount_payments_providers" class='message is-danger'><div class="message-body">{{'Чтобы принимать оплату, вам необходимо настроить платежные системы в разделе'|gettext}} "<a href="/profile/settings/payments/" target="_blank">{{'Настройки'|gettext}}</a>".</div></div> <div class="has-mb-2"><mx-toggle v-model='values.is_order' :title="'Принимать оплату'|gettext" :disabled="info.is_readonly"></mx-toggle></div> <div class="row" :class="{disabled: !values.is_order}"> <div class="col-sm-4 col-xs-12 has-mb-2" :class="{'has-error': errors.order_budget}"><label class="label">{{'Цена'|gettext}}</label> <div class="field has-addons"> <div class="control is-expanded"> <number v-model="values.order_budget" :precision="$account.currency.precision" class="input has-text-right" :disabled="info.is_readonly"> </div> <div class="control"><div class="button is-static">{{$account.currency.title}}</div></div> </div> </div> <div class="col-sm-8 col-xs-12" :class="{'has-error': errors.order_purpose}"> <div class="field"> <label class="label">{{'Назначение платежа'|gettext}}</label> <div class="row row-small"> <div class="col-xs-12 col-sm-4 has-mb-2"> <b-select v-model="values.payment_object_id" :disabled="info.is_readonly" expanded> <option v-for="(v, k) in variants.payment_object_id" :value="k">{{v}}</option> </b-select> </div> <div class="col-xs-12 col-sm-8 has-mb-2"><input type='text' v-model='values.order_purpose' class='input' :disabled="info.is_readonly"></div> </div> </div> </div> </div> <div :class="{disabled: !values.is_order}"> <b-checkbox v-model="values.paid_change_status" :disabled="info.is_readonly">{{'После успешной оплаты менять статус'|gettext}}:</b-checkbox> <b-dropdown aria-role="list" position="is-top-right" :disabled="!values.paid_change_status || info.is_readonly"><label :disabled="!values.paid_change_status || info.is_readonly" :class="{'has-text-primary': values.paid_change_status}" class="b-checkbox checkbox is-marginless" slot="trigger" aria-role="listitem">{{currentPaidStatus}}</label> <b-dropdown-item @click="values.paid_status_id = s.status_id;" v-for="s in variants.paid_status_id"><i class="fas fa-circle has-mr-1" :style='"color:#{1}"|format(s.color)'></i> {{s.status}}</b-dropdown-item> </b-dropdown> </div> </section> <keep-alive> <vue-pages-blocks-form-addons :block_id="block_id" :block_type_id="block_type_id" :values="values" :addons_values.sync="addons_values" :disabled="info.is_readonly" :parent="parent" v-if="currentTab == 'addons'" @click="$parent.scrollToTariff"> <template slot="message">{{'Вы можете выбрать модули которые будут срабатывать для данной формы'|gettext}}</template> <template slot="empty">{{'Модули для данного блока еще не подключены'|gettext}}</template> </vue-pages-blocks-form-addons> </keep-alive> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-html", {props: ['values', 'options', 'variants', 'info', 'block', 'block_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		created() {
			this.block.title = this.$gettext('HTML код');
			this.$emit('update:tabs', [{name: 'common', title: this.$gettext('HTML')},{name: 'options', title: this.$gettext('Настройки')}]);
		},
		
		methods: {
			prepareValues() {
				return this.values;
			}
		}, template: `<section class="modal-card-body modal-card-body-block-html modal-card-body-blocks"> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <div class="panel panel-default"> <vue-component-codemirror v-model="values.html" :disabled="info.is_readonly" style="min-height: 100px"></vue-component-codemirror> </div> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-link", {props: ['values', 'options', 'parent', 'variants', 'info', 'block', 'block_id', 'block_type_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		data() {
			return {
				addons_values: null
			}
		},
		
		created() {
			let tabs = [{name: 'common', title: this.$gettext('Ссылка')},{name: 'options', title: this.$gettext('Настройки')},{name: 'addons', title: this.$gettext('Модули')}];
			if (this.block_id && this.info.is_allow_statistics) tabs.push({name: 'statistics', title: this.$gettext('Статистика')});
			
			this.block.title = this.$gettext('Ссылка');
			this.$emit('update:tabs', tabs);
		},
		
		computed: {
			error() {
				return this.errors.link || this.errors.email || this.errors.phone || this.errors.product || this.errors.link_page_id || this.errors.collection;
			}
		},
		
		methods: {
			prepareValues() {
				let values = this.$clone(this.values);
				values.addons_values = this.addons_values;

				let theme = this.$account.theme;
				if ((values.design.text == theme.link.color) && (values.design.bg == theme.link.bg)) values.design = {on: false}
				
				return values;
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="currentTab == 'common'"> <b-field :label="'Текст ссылки'|gettext" :class="{'has-error': errors.title}" :message="errors.title"> <div> <input class="input has-mb-1" v-model="values.title" :disabled="info.is_readonly" :placeholder="'Заголовок'|gettext"></input> <input class="input" v-model="values.subtitle" :disabled="info.is_readonly" :placeholder="'Подзаголовок'|gettext"></input> </div> </b-field> <b-field :class="{'has-error': error}" :message="error"> <vue-component-link-editor :values.sync="values" :variants="variants" :info="info"></vue-component-link-editor> </b-field> </section> <section v-if="currentTab == 'options'"> <vue-pages-blocks-form-design :values.sync="values.design" :info="info"></vue-pages-blocks-form-design> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <keep-alive> <vue-pages-blocks-form-addons v-if="currentTab == 'addons'" :block_id="block_id" :block_type_id="block_type_id" :addons_values.sync="addons_values" :disabled="info.is_readonly" :parent="parent"> <template slot="message">{{'Вы можете выбрать модули которые будут срабатывать для данной ссылки'|gettext}}</template> <template slot="empty">{{'Модули для данного блока еще не подключены'|gettext}}</template> </vue-pages-blocks-form-addons> </keep-alive> <keep-alive> <vue-pages-blocks-form-statistics v-if="currentTab == 'statistics'" :page_id="values.page_id" :block_id="block_id"></vue-pages-blocks-form-statistics> </keep-alive> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-map", {props: ['values', 'options', 'variants', 'info', 'block', 'block_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		data() {
			return {
				query: '',
				isGeocoding: false,
				current: 0,
				map: null,
				markers: []
			}
		},
		
		created() {
			this.block.title = this.$gettext('Карта');
			let tabs = [
				{name: 'common', title: this.$gettext('Карта и метки')},
				{name: 'extended', title: this.$gettext('Опции карты')},
				{name: 'options', title: this.$gettext('Настройки')}
			];
			
			let theme = this.$account.theme;
			if (!this.values.link_color) this.values.link_color = theme.link.color;
			if (!this.values.link_bg) this.values.link_bg = theme.link.bg;
			
			if (this.block_id) tabs.push({name: 'statistics', title: this.$gettext('Статистика')});
			this.$emit('update:tabs', tabs);
		},
		
		mounted() {
			$mx.lazy('map.js', 'map.css', () => {
				let options = this.$clone(this.values.bounds);
				if (options.length == 0) options = {zoom: 4, center: {lat:55.5807481, lng:36.8251304}};
				
				this.map = L.map(this.$refs.map, {
					attributionControl: false,
				}).setView([options.center.lat, options.center.lng], options.zoom);
				
				L.control.attribution({prefix: ''}).addTo(this.map);
				
				//'https://maps.tilehosting.com/styles/basic/{z}/{x}/{y}.png?key=V8rA6J6w5KhzV2N0rq8g'
				L.tileLayer('/maps/{z}/{x}/{y}.png', {
			        attribution: '',
			        crossOrigin: true
				}).addTo(this.map);
				
				this.icon = L.icon({
				    iconUrl: '/s/i/marker.png',
				    iconSize: [28, 37],
		// 		    iconAnchor: [22, 94],
				    popupAnchor: [0, -10],
				    shadowUrl: '/s/i/marker-shadow.png',
				    shadowSize: [40, 50],
				    shadowAnchor: [12, 31]
				});
				
				let updated = () => {
					let b = this.map.getBounds();
					this.values.bounds = {center: this.map.getCenter(), zoom: this.map.getZoom(), bounds: [[b.getNorth(), b.getEast()], [b.getSouth(), b.getWest()]]};
				}
				
				if (this.values.bounds.length == 0) {
					navigator.geolocation.getCurrentPosition((position) => {
						var pos = {
							lat: position.coords.latitude,
							lng: position.coords.longitude
						};
					
						this.map.setView(pos, 10);
						updated();
					});
				}

				
				
				this.map.on('moveend', updated);
				this.map.on('zoomend', updated);
				
				updated();
				
				_.each(this.values.markers, this.addMarkerInternal);
			});
		},
		
		methods: {
			addMarkerInternal(v) {
				var loc = {lat: parseFloat(v.lat), lng: parseFloat(v.lng)}
				
				var marker = L.marker([loc.lat, loc.lng], {icon: this.icon, draggable: true}).addTo(this.map);
				marker.on('dragend', (e) => {
					
					let ll = marker.getLatLng();
					v.lat = ll.lat;
					v.lng = ll.lng;
				});
				
				this.markers.push(marker);			
			},
			
			addMarker() {
				if (this.query.trim() == '') return;
				this.isGeocoding = true;
				$mx.lazy('//maps.googleapis.com/maps/api/js?key=AIzaSyCsYkpOHG_vddnpHQJ8kamy4RGt81HCfCU&libraries=places', () => {
					var geocoder = new google.maps.Geocoder;
			        geocoder.geocode( { 'address': this.query}, (results, status) => {
						if (status == 'OK' && results.length && results[0].geometry) {
							var loc = results[0].geometry.location;
							 
							let v = {lng: loc.lng(), lat: loc.lat(), text: '', title: this.query};
							this.values.markers.push(v);
							this.current = this.values.markers.length - 1;
							this.addMarkerInternal(v);
							
							
							if (this.markers.length) {
								let group = new L.featureGroup(this.markers);
								this.map.fitBounds(group.getBounds());
							}
							
							this.$nextTick(() => {
								if (this.markers.length == 1) this.$refs.markers.querySelector('.in textarea').focus();
							});
							
							this.query = '';
						}
	
						this.isGeocoding = false;
					});
				});
			},
			
			deleteMarker(index) {
				this.map.removeLayer(this.markers[index]);
				this.markers.splice(index, 1);
				this.values.markers.splice(index, 1);
			},
			
			prepareValues() {
				let values = this.$clone(this.values);
			
				values.markers = _.map(values.markers, (v) => {
					return _.pick(v, ['lng', 'lat', 'title', 'text']);
				});
				
				let theme = this.$account.theme;
				if ((values.design.text == theme.link.color) && (values.design.bg == theme.link.bg)) values.design = {on: false}
				
				return values;
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="info.is_readonly && (currentTab == 'common')" class="message is-warning"> <div class="message-body">{{'Здесь вы можете добавить карту и отметить ваши адреса'|gettext}}</div> </section> <section :class="{'is-hidden': currentTab != 'common'}" @click="$parent.scrollToTariff"> <div class="map-container map-view-with-zoom-control" :class="{disabled: info.is_readonly}"> <div class="map-form" ref='map'></div> </div> </section> <section :class="{'is-hidden': currentTab != 'common'}" @click="$parent.scrollToTariff"> <div class="has-mb-2"> <div class="row row-small"> <div class="col-xs"> <b-input v-model="query" autocorrect="off" autocapitalize="off" spellcheck="false" :placeholder="'Введите адрес метки'|gettext" @keyup.native.enter="addMarker" :loading="isGeocoding" :disabled="info.is_readonly"></b-input> </div> <div class="col-xs col-shrink"> <button type='button' class="button is-success" @click="addMarker" :class="{'is-loading': isGeocoding}" :disabled="info.is_readonly">{{'Добавить метку'|gettext}}</button> </div> </div> </div> <div ref='markers'> <vue-component-sortable-form-fields v-model="values.markers" :current.sync="current"> <template v-slot:title="{ item }"> <span v-if="item.title">{{item.title}}</span> <span v-else>{{'Заголовок'|gettext}}</span> </template> <template v-slot:action="{ index }"> <a class="has-text-danger is-pulled-right" @click.stop="deleteMarker(index)" :class="{disabled: info.is_readonly}"><i class="fa fa-trash-alt"></i></a> </template> <template v-slot:form="{ item, index }"> <div class="field"> <input type="text" v-model="item.title" class="input" :placeholder="'Заголовок'|gettext" :disabled="info.is_readonly"> </div> <div class="field"> <textarea class="input" v-model="item.text" :placeholder="'Режим работы, этаж и другая полезная информация'|gettext" :disabled="info.is_readonly"></textarea> </div> </template> </vue-component-sortable-form-fields> </div> </section> <section v-if="currentTab == 'extended'" @click="$parent.scrollToTariff"> <div class="has-mb-2"><mx-toggle v-model="values.is_fixed" :title="'Зафиксировать карту'|gettext" :disabled="info.is_readonly"></mx-toggle></div> <div class="has-mb-2"><mx-toggle v-model="values.show_buttons" :title="'Добавить отдельные ссылки для каждой метки'|gettext" :disabled="info.is_readonly"></mx-toggle></div> <div><mx-toggle v-model="values.show_zoom" :title="'Показывать ползунок масштабирования'|gettext" :disabled="info.is_readonly"></mx-toggle></div> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <vue-pages-blocks-form-design :values.sync="values.design" :info="info"></vue-pages-blocks-form-design> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <keep-alive> <vue-pages-blocks-form-statistics :page_id="values.page_id" :block_id="block_id" v-if="currentTab == 'statistics'" @click="$parent.scrollToTariff"></vue-pages-blocks-form-statistics> </keep-alive> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-messenger", {props: ['values', 'options', 'parent', 'variants', 'info', 'block', 'block_id', 'block_type_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		data() {
			return {
				addons_values: null,
				platforms: {
					telegram: {placeholder: 'Например: Написать в {1}', types: {v: {label: 'Имя пользователя', type: 'input'}}},
					vk: {placeholder: 'Например: Написать в {1}', types: {v: {label: 'Имя пользователя', type: 'input'}}},
					fb: {placeholder: 'Например: Написать в {1}', types: {v: {label: 'Имя пользователя', type: 'input'}}},
					sk: {placeholder: 'Например: Позвонить в {1}', types: {v: {label: 'Имя пользователя', type: 'input'}}},
					whatsapp: {placeholder:'Например: Написать в {1}', types: {v: {label: 'Укажите ваш номер телефона', type: 'phone', check: 'Телефон'}, c: {label: 'Укажите ссылку на чат', type: 'input', check: 'Чат', placeholder: 'https://chat.whatsapp.com/****************'}}, inputs: {text: {label: 'Текст-шаблон сообщения', placeholder: 'Пример: Здравствуйте, как можно сделать заказ?', type: 'textarea'}}},
					viber: {placeholder: 'Например: Написать в {1}', types: {v: {label: 'Укажите ваш номер телефона', type: 'phone', check: 'Телефон'}, c: {label: 'Укажите ссылку на канал', type: 'input', check: 'Канал', placeholder: 'https://viber.com/****************'}}}
				}
			}
		},
				
		created() {
			this.block.title = this.$gettext('Мессенджеры');

			let tabs = [{name: 'common', title: this.$gettext('Ссылки')}, {name: 'options', title: this.$gettext('Настройки')}, {name: 'addons', title: this.$gettext('Модули')}];
			if (this.block_id && this.info.is_allow_statistics) tabs.push({name: 'statistics', title: this.$gettext('Статистика')});

			this.$emit('update:tabs', tabs);
		},
		
		computed: {
			titles() {
				return {'whatsapp': 'WhatsApp', 'telegram': 'Telegram', 'fb': 'Facebook Messenger', 'vk': this.$gettext('ВКонтакте'), 'viber': 'Viber', 'sk': 'Skype', 'ln': 'Line'}
			},
			
			textLine1() {
				return this.$gettext('Откройте Line@ > Выберите аккаунт > Найти новых друзей > Выберите URL-адрес > Копировать');
			},
			
			textLine2() {
				return this.$gettext('Откройте Line > Пригласить друзей > Пригласить > Поделиться > Выберите любой мессенджер или email > Скопируйте ссылку из сообщения');
			}
		},
		
		methods: {
			prepareValues() {
				let values = this.$clone(this.values);
				values.addons_values = this.addons_values;

				return values;
			},
			
			getError(part, val) {
				return this.errors[part]?this.errors[part][val]:null;
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <div slot="trigger"></div> <section v-if="info.is_readonly && (currentTab == 'common')" class="message is-warning"> <div class="message-body">{{'Клиенту больше не нужно будет запоминать ваш номер, сохранять, заходить в месенджер, искать вас и писать сообщение, ведь, чем сложнее с вами связаться, тем больше вероятность, что клиент отвлечется и уже забудет о вас или ему будет просто лень писать вам! Вы можете уже заранее ввести нужный текст-шаблон для клиента, чтобы ему не пришлось ничего писать!'|gettext}}</div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <b-select v-model="values.messenger_style" :disabled="info.is_readonly" expanded> <option v-for="(f, i) in variants.messenger_style" :value="i">{{ f }}</option> </b-select> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <sortable-list class="form-fields-item-list" lockAxis="y" v-model="values.items" use-drag-handle> <sortable-item v-for="(link, index) in values.items" class="form-fields-item" :class="{in: link.a}" :index="index" :key="index" :item="link" :disabled="info.is_readonly"> <div class="form-fields-item-title" @click="link.a = !link.a"> <div v-sortable-handle class="form-fields-item-handle"></div> <span>{{titles[link.n]}}</span> <mx-toggle v-model="link.a" class="pull-right"></mx-toggle> </div> <div class="form-fields-item-options" v-if="link.a"> <div v-if="platforms[link.n] != undefined"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="link.t" class="input" :placeholder="platforms[link.n].placeholder|gettext|format(titles[link.n])" :disabled="info.is_readonly"> </b-field> <div class="form-messengers-switch has-text-grey" v-if="Object.keys(platforms[link.n].types).length> 1"> <a href="#" v-for="(t, k) in platforms[link.n].types" :class="{'has-text-black': link.tp == k, 'has-text-grey': link.tp != k}" @click="link.tp = k">{{t.check|gettext}}</a> </div> <b-field v-for="(t, k) in platforms[link.n].types" v-if="(Object.keys(platforms[link.n].types).length == 1) || (link.tp == k)" :label="t.label|gettext" :message="getError(link.n, k)" :class="{'has-error': getError(link.n, k)}"> <input v-model="link[k]" v-if="t.type == 'input'" class="input" :disabled="info.is_readonly" :placeholder="t.placeholder|gettext"> <mx-phone v-model="link[k]" v-if="t.type == 'phone'" :disabled="info.is_readonly"></mx-phone> </b-field> <b-field v-for="(ipt, inm) in platforms[link.n].inputs" :label="ipt.label|gettext"> <textarea v-if="ipt.type == 'textarea'" v-model="link[inm]" :placeholder="ipt.placeholder|gettext" class="input" :disabled="info.is_readonly" style="min-height: 100px"></textarea> </b-field> </div> <div v-if="link.n == 'ln'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="link.t" class="input" :placeholder="'Например: Напишите в Line'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Имя пользователя'|gettext" :message="getError('ln', 'v')" :class="{'has-error': getError('ln', 'v')}" :disabled="info.is_readonly"> <input v-model="link.v" class="input"> </b-field> <div>{{'Как получить ссылку'|gettext}}: <b-tooltip :label="textLine1" position="is-top" animated multilined type="is-black"><span class='has-text-danger'>Line@</span></b-tooltip> / <b-tooltip :label="textLine2" position="is-top" animated multilined type="is-black"><span class='has-text-danger'>Line</span></b-tooltip> </div> </div> </div> </sortable-item> </sortable-list> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <vue-pages-blocks-form-design :values.sync="values.design" :info="info"></vue-pages-blocks-form-design> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <keep-alive> <vue-pages-blocks-form-addons :block_id="block_id" :block_type_id="block_type_id" :addons_values.sync="addons_values" :disabled="info.is_readonly" :parent="parent" v-if="currentTab == 'addons'" @click="$parent.scrollToTariff"> <template slot="message">{{'Вы можете выбрать модули которые будут срабатывать для данной ссылки'|gettext}}</template> <template slot="empty">{{'Модули для данного блока еще не подключены'|gettext}}</template> </vue-pages-blocks-form-addons> </keep-alive> <keep-alive> <vue-pages-blocks-form-statistics :page_id="values.page_id" :block_id="block_id" v-if="currentTab == 'statistics'" @click="$parent.scrollToTariff"></vue-pages-blocks-form-statistics> </keep-alive> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-page", {props: ['values', 'info', 'variants', 'block', 'block_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		created() {
			this.block.title = this.$gettext('Новая страница');
			this.$emit('update:message', this.$gettext('С помощью этого блока, вы сможете создавать множество внутренних страниц с отдельной ссылкой'));
			this.$emit('update:tabs', []);
		},
		
		methods: {
			prepareValues() {
				return this.values;
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <b-field :label="'Открыть страницу'|gettext"> <b-select v-model="values.link_page_id" :disabled="info.is_readonly" expanded> <option :value="null">{{'-- Создать новую страницу --'|gettext}}</option> <option v-for="(v, k) in variants.link_page_id" :value="k">{{v}}</option> </b-select> </b-field> <b-field :label="'Название страницы'|gettext" :message="errors.title" :class="{'has-error': errors.title}" v-if="!values.link_page_id"> <input v-model="values.title" class="input" :disabled="info.is_readonly"> </b-field> </section> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-pictures", {data() {
			return {
/*
				isFetchingProduct: false,
				isFetchingCollection: false,
				autocompleteProducts: [],
				autocompleteCollections: [],
*/
				index: 0,
				picturesUpdating: 0,
				resortMode: false,
				deviceStyle: 'margin: 0 auto;display: block;height: auto'
			}
		},
		
		props: ['values', 'options', 'variants', 'info', 'block', 'block_id', 'statistics', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		created() {
			let tabs = [{name: 'common', title: this.$gettext('Картинки')},{name: 'options', title: this.$gettext('Настройки')}];
			if (this.block_id) tabs.push({name: 'statistics', title: this.$gettext('Статистика')});
			
			let theme = this.$account.theme;
			if (!this.values.design.text) this.values.design.text = '#000000';
			if (!this.values.design.bg) this.values.design.bg = '#ffffff';
			if (!this.values.design.button_text) this.values.design.button_text = '#0383de';
			
			
			this.block.title = this.$gettext('Карусель картинок');
			this.$emit('update:tabs', tabs);
		},
		
		mounted() {
			$mx(this.$refs.device).on('changeindex', (e, idx) => {
				this.index = idx;
			})
		},
		
		destoyed() {
			$mx(this.$refs.device).off('changeindex');
		},
		
		computed: {
			link() {
				return this.values.list[this.index].link;
			},
			
			pictureSizeStyle() {
				let sizes = {
					100: 100,
					70: '70.6',
					50: 50,
					138: '141.4516'
				}
				return 'padding-top:'+sizes[this.values.picture_size]+'%';
			},
			
			stylesheetText() {
				var s = '';
				if (this.values.design.on && (this.values.design.text || this.values.design.bg)) s =  
					(this.values.design.text?('color:'+this.values.design.text+' !important;'):'') + 
					(this.values.design.bg?('background:'+this.values.design.bg+' !important;'):'');

				return s;
			},
			
			stylesheetLink() {
				var s = '';
				if (this.values.design.on && (this.values.design.button_text || this.values.design.bg)) s =
					(this.values.design.button_text?('color:'+this.values.design.button_text+' !important;'):'') + 
					(this.values.design.bg?('background:'+this.values.design.bg+' !important;'):'');
				return s;
			}
		},
		
		methods: {
			switchReorderMode() {
				this.resortMode = !this.resortMode;
				if (this.resortMode) {
					this.$nextTick(() => {
						let o = this.$refs.toolbar;
//						$mx(o).closest(window.matchMedia("(max-width: 767px)").matches?'.modal-card-body':'.modal').scrollTo(o, 400);
						scrollIt(o, 'y', $mx(o).closest(window.matchMedia("(max-width: 767px)").matches?'.modal-card-body':'.modal')[0], 400);
					});
				}
			},
			prepareResortStyle(p) {
				return (p == undefined || p.progress != undefined || p.link == undefined)?'none':('url('+p.link+')');
			},
						
			onDeletePicture(i, e) {
				if (this.values.list.length == 1) {
					if (e.empty) {
						this.$alert(this.$gettext('В карусели должна быть хотя бы одна картинка'), 'is-danger');
					}
					return;
				}
				
				if (this.index == i && i) this.setIndex(this.index - 1);
				this.values.list.splice(i, 1);
				
				if (this.values.list.length == 1) this.resortMode = false;
			},
			
			addSlide() {
				if (this.values.list.length >= 15) {
					this.$alert(this.$gettext('Максимальное количество слайдов')+': 15', 'is-danger');
                } else {
					this.values.list.push({p: null, s: '', t: '', link: {title: '', type: this.values.list[this.index].link.type, link: '', link_page_id: null, product: '', collection: ''}});
					this.setIndex(this.values.list.length - 1);
                }
			},
			
			setIndex(i) {
				this.index = i;
				this.$nextTick(() => {
					let dots = this.$refs.sliders.querySelectorAll('div');
					$mx(dots[i]).trigger('click');
				});
			},
			
			prepareValues() {
				let values = this.$clone(this.values);
				
				values.list = _.map(values.list, (item) => {
					item.p = item.p?item.p.picture_id:null;
					return item;
				});
				
				let theme = this.$account.theme;
				if ((values.design.text == '#000000') && (values.design.bg == '#ffffff') && (values.design.button_text == '#0383de')) values.design = {on: false}
				
				return values;
			},
			
			startUploading() {
				this.picturesUpdating++;
				//this.$emit('update:allowSave', this.picturesUpdating == 0);
			},
			
			stopUploading() {
				this.picturesUpdating--;
				//this.$emit('update:allowSave', this.picturesUpdating == 0);
			},
			
			showErrors(r) {
				if (r.errors['slide:position'] != undefined) {
					this.$refs.sliders.childNodes[r.errors['slide:position']].click();
					setTimeout(() => {
						$mx(this.$refs.linkEditor.$el).find('.link-editor-place input, .link-editor-place select')[0].focus();
					}, 100);
					
				}
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="info.is_readonly && (currentTab == 'common')" class="message is-warning"> <div class="message-body">{{'Здесь вы можете загрузить изображения или галерею картинок, добавить к ним описание и ссылки'|gettext}}</div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <div class="field"> <div class='device-pictures-form device-pictures-form-pictures'> <center> <div class="device has-shadow is-large is-hide-mobile" :class="{disabled: info.is_readonly}" style="margin:0 auto;min-height:auto"> <div class="notch"></div> <div class="screen page-font"> <div ref='device' class="slider slider-pictures has-pb-2" :class="{'slider-has-text': values.options.text, 'slider-has-link': values.options.link, 'slider-has-border': !values.remove_border}"> <div class="slider-inner"> <div class="slider-slide" v-for="(f, i) in values.list"> <vue-component-pictures v-model="f.p" :button-title="'Загрузить картинку'|gettext" button-icon="fa fal fa-cloud-upload" class="picture-container picture-container-upload" :style="pictureSizeStyle" @delete="onDeletePicture(i, $event)" always-delete-button updatable :disabled="info.is_readonly" @startUploading="startUploading" @stopUploading="stopUploading"></vue-component-pictures> <div class="slider-slide-text" :style="stylesheetText"> <div class="slider-slide-title" v-if="f.t">{{f.t}}</div> <div class="slider-slide-title" v-else>{{'Заголовок'|gettext}}</div> <div class="slider-slide-snippet">{{f.s}}</div> </div> <a class="slider-slide-link" :style="stylesheetLink" v-if="f.link.title">{{f.link.title}}</a> <a class="slider-slide-link" :style="stylesheetLink" v-else>{{'Открыть'|gettext}}</a> </div> </div> <div class="slider-nav" :class="{'is-hidden': values.list.length == 1}" ref='sliders'> <div v-for="(v, i) in values.list" class="slider-dot" :class="{active: index== i}" @click="index = i"></div> </div> </div> </div> </div> </center> <div class='form-shadow form-shadow-bottom is-hidden-mobile' style="height: 20px"></div> </div> <div class="has-pt-2 row row-small" ref='toolbar'> <div class="col-xs-6 col-sm-5 col-sm-offset-1"> <button type="button" class="button is-success is-fullwidth" :disabled="info.is_readonly || resortMode" @click="addSlide"><i class='fas fa-plus has-mr-1'></i>{{'Новый слайд'|gettext}}</button> </div> <div class="col-xs-6 col-sm-5"> <button type="button" :class="['button is-dark is-fullwidth', {'is-active': resortMode}]" @click="switchReorderMode" :disabled="info.is_readonly || values.list.length < 2">{{'Порядок слайдов'|gettext}}</button> </div> </div> </div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <div v-if="resortMode"> <sortable-list v-model="values.list" class="pictures-sortable-list pictures-form-resort" axis="xy" use-drag-handle v-if="resortMode"> <sortable-item v-for="(v, i) in values.list" class="upload-picture upload-picture-multiple" :index="i" :key="i" :item="v"> <div v-sortable-handle :class="['picture-container pictures-form-resort-item', {'picture-container-empty': !v.p}]" :style="{'background-image':prepareResortStyle(v.p)}"></div> </sortable-item> </sortable-list> </div> <div v-else> <mx-toggle v-model="values.options.text" :title="'Добавить описание'|gettext" :disabled="info.is_readonly"></mx-toggle> <div style="padding-top: 15px" v-if="values.options.text"> <div class="has-mb-2"> <label class="label">{{'Заголовок'|gettext}}</label> <vue-component-emoji-picker v-model="values.list[index].t"> <input type="text" v-model="values.list[index].t" class="input" maxlength="50" :disabled="info.is_readonly"> </vue-component-emoji-picker> </div> <div> <label class="label">{{'Описание'|gettext}}</label> <vue-component-emoji-picker v-model="values.list[index].s"> <textarea class="input" v-model="values.list[index].s" rows="5" id='sliderTextSnippet' maxlength="400" :disabled="info.is_readonly"></textarea> </vue-component-emoji-picker> </div> </div> </div> </section> <section v-if="currentTab == 'common' && !resortMode" @click="$parent.scrollToTariff"> <mx-toggle v-model="values.options.link" :title="'Добавить ссылку'|gettext" :disabled="info.is_readonly"></mx-toggle> <div style="padding-top: 15px" v-if="values.options.link"> <div class="has-mb-2"> <label class="label">{{'Текст ссылки'|gettext}}</label> <input type='text' class='input' v-model="link.title" :disabled="info.is_readonly"> </div> <vue-component-link-editor :values.sync="link" :variants="variants" :info="info" ref="linkEditor"></vue-component-link-editor> </section> <section v-if="currentTab == 'common' && !resortMode" @click="$parent.scrollToTariff"> <div class="row"> <div class="col-sm-12"> <label class='label'>{{'Размер картинки'|gettext}}</label> <b-select v-model="values.picture_size" :disabled="info.is_readonly" expanded> <option v-for="(v, k) in variants.picture_size" :value="k">{{v}}</option> </b-select> </div> </div> </section> <section v-if="currentTab == 'common' && !resortMode" @click="$parent.scrollToTariff"> <div class="row"> <div class="col-sm-12"> <label class='label'>{{'Автоматическая смена слайдов'|gettext}}</label> <div class="row"> <div class="col-xs-6 col-sm-4"> <div class="field has-addons"> <div class="control is-expanded"><input type='number' v-model='values.carousel_interval' class='input' :disabled="info.is_readonly || !values.carousel_ride"></div> <div class="control"><span class="button is-static">{{'сек'|gettext}}</span></div> </div> </div> <div class="col-xs-6 col-sm-8"> <b-checkbox v-model='values.carousel_ride' :disabled="info.is_readonly">{{'Включить'|gettext}}</b-checkbox> </div> </div> </div> </div> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <div class="label-pro-container"> <div class="tag is-pro" v-if="$account.tariff != 'pro' && $account.tariff != 'business'" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна<br>на pro тарифе'|gettext">pro</div> <div :class="{disabled: $account.tariff != 'pro' && $account.tariff != 'business'}"> <div class="has-mb-2"><mx-toggle v-model='values.design.on' :title="'Свои настройки дизайна'|gettext" :disabled="info.is_readonly"></mx-toggle></div> <div class="has-mb-4" v-if="values.design.on"> <div class="has-mb-2"> <vue-component-colorpicker v-model="values.design.bg" :disabled="info.is_readonly" :colors="[$account.theme.link.bg]" :label="'Цвет фона кнопки'|gettext"></vue-component-colorpicker> </div> <div class="has-mb-2"> <vue-component-colorpicker v-model="values.design.text" :disabled="info.is_readonly" :colors="[$account.theme.link.color]" :label="'Цвет текста'|gettext"></vue-component-colorpicker> </div> <div class="has-mb-2"> <vue-component-colorpicker v-model="values.design.button_text" :disabled="info.is_readonly" :colors="[$account.theme.link.color]" :label="'Цвет текста кнопки'|gettext"></vue-component-colorpicker> </div> </div> </div> </div> <div class="has-mb-2"><mx-toggle v-model='values.remove_border' :title="'Убрать бордюр'|gettext" :disabled="info.is_readonly"></mx-toggle></div> <div class="has-mb-2"><mx-toggle v-model='values.is_desktop_fullwidth' :title="'Отображать боковые слайды на ПК'|gettext" :disabled="info.is_readonly"></mx-toggle></div> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <keep-alive> <vue-pages-blocks-form-statistics :page_id="values.page_id" :block_id="block_id" :disabled="info.is_readonly" v-if="currentTab == 'statistics'" @click="$parent.scrollToTariff"></vue-pages-blocks-form-statistics> </keep-alive> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-socialnetworks", {props: ['values', 'options', 'parent', 'variants', 'info', 'block', 'block_id', 'block_type_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		data() {
			return {
				addons_values: null
			}
		},
		
		created() {
			this.block.title = this.$gettext('Социальные сети');

			let tabs = [{name: 'common', title: this.$gettext('Ссылки')},{name: 'options', title: this.$gettext('Настройки')}, {name: 'addons', title: this.$gettext('Модули')}];
			if (this.block_id && this.info.is_allow_statistics) tabs.push({name: 'statistics', title: this.$gettext('Статистика')});

			this.$emit('update:tabs', tabs);
		},
		
		computed: {
			titles() {
				return {'vk': this.$gettext('ВКонтакте'), 'fb': 'Facebook', 'youtube': 'Youtube', 'twitter': 'Twitter', 'pt': 'Pinterest', 'ig': 'Instagram', 'ok': this.$gettext('Одноклассники'), 'sn': 'Snapchat', 'bh': 'Behance', 'dr': 'Dribbble', 'in': 'LinkedIn', 'tc': 'Twitch', 'tk': 'TikTok'};
			}
		},
		
		methods: {
			prepareValues() {
				let values = this.$clone(this.values);
				values.addons_values = this.addons_values;

				return values;
			},
			
			getError(part, val) {
				return this.errors[part]?this.errors[part][val]:null;
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="info.is_readonly && (currentTab == 'common')" class="message is-warning"> <div class="message-body">{{'Добавьте кнопки на другие социальные сети'|gettext}}</div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <b-select v-model="values.socials_style" :disabled="info.is_readonly" expanded> <option v-for="(f, i) in variants.socials_style" :value="i">{{ f }}</option> </b-select> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <sortable-list class="form-fields-item-list" lockAxis="y" v-model="values.items" use-drag-handle> <sortable-item v-for="(item, index) in values.items" class="form-fields-item" :index="index" :key="index" :item="item" :disabled="info.is_readonly"> <div class="form-fields-item" :class="{in: item.a}"> <div class="form-fields-item-title" @click="item.a = !item.a"> <div v-sortable-handle class="form-fields-item-handle"></div> <span>{{titles[item.n]}}</span> <mx-toggle v-model="item.a" class="pull-right"></mx-toggle> </div> <div class="form-fields-item-options"> <div v-if="item.n == 'fb'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Моя страница в Facebook'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Ссылка Facebook'|gettext" :message="getError('fb', 'link')" :class="{'has-error': getError('fb', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'youtube'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Мой Youtube канал'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Ссылка на Youtube канал'|gettext" :message="getError('youtube', 'link')" :class="{'has-error': getError('youtube', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> <b-checkbox v-model="item.join" :disabled="info.is_readonly">{{'Ссылка ведет на действие подписки'|gettext}}</b-checkbox> </div> <div v-if="item.n == 'vk'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Моя страница в ВКонтакте'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Профиль ВКонтакте'|gettext" :message="getError('vk', 'link')" :class="{'has-error': getError('vk', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'ok'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Моя страница в Одноклассниках'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Ссылка в Одноклассники'|gettext" :message="getError('ok', 'link')" :class="{'has-error': getError('ok', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'twitter'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Моя страница в Twitter'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Ссылка Twitter'|gettext" :message="getError('twitter', 'link')" :class="{'has-error': getError('twitter', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'tc'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Моя страница в Twitch'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Ссылка Twitch'|gettext" :message="getError('tc', 'link')" :class="{'has-error': getError('tc', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'ig'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Мой Instagram'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Профиль Instagram'|gettext" :message="getError('ig', 'link')" :class="{'has-error': getError('ig', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'pt'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Мой Pinterest'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Профиль Pinterest'|gettext" :message="getError('pt', 'link')" :class="{'has-error': getError('pt', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'in'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Мой LinkedIn'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Профиль LinkedIn'|gettext" :message="getError('in', 'link')" :class="{'has-error': getError('in', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'sn'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Мой Snapchat'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Профиль Snapchat'|gettext" :message="getError('sn', 'link')" :class="{'has-error': getError('sn', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'bh'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Мой Behance'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Профиль Behance'|gettext" :message="getError('bh', 'link')" :class="{'has-error': getError('bh', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'dr'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Мой Dribbble'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Профиль Dribbble'|gettext" :message="getError('dr', 'link')" :class="{'has-error': getError('dr', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'tk'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Мой TikTok'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Ссылка TikTok'|gettext" :message="getError('tk', 'link')" :class="{'has-error': getError('tk', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> </div> </div> </sortable-item> </sortable-list> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <vue-pages-blocks-form-design :values.sync="values.design" :info="info"></vue-pages-blocks-form-design> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <keep-alive> <vue-pages-blocks-form-addons :block_id="block_id" :block_type_id="block_type_id" :addons_values.sync="addons_values" :disabled="info.is_readonly" :parent="parent" v-if="currentTab == 'addons'" @click="$parent.scrollToTariff"> <template slot="message">{{'Вы можете выбрать модули которые будут срабатывать для данной ссылки'|gettext}}</template> <template slot="empty">{{'Модули для данного блока еще не подключены'|gettext}}</template> </vue-pages-blocks-form-addons> </keep-alive> <keep-alive> <vue-pages-blocks-form-statistics :page_id="values.page_id" :block_id="block_id" v-if="currentTab == 'statistics'" @click="$parent.scrollToTariff"></vue-pages-blocks-form-statistics> </keep-alive> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-text", {props: ['values', 'options', 'info', 'variants', 'block', 'block_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		data() {
			return {
				text_sizes: {sm: '1.03', md: '1.26', lg: '1.48', h3: '1.71', h2: '2.2', h1: '3.5'},
				text_aligns: ['left', 'center', 'right', 'justify']
			}
		},
		
		computed: {
			style() {
				//((this.values.text_size[0] == 'h')?'font-weight:bold;':'')+
				//(lightOrDark(this.values.color) == 'light') &&
				let lineHeights = {h2: 1.25, h1: 1.15};
				return {'font-family': this.values.font?(globalFontsFallback[this.values.font]):null, padding: '.5rem 1rem', 'line-height': (lineHeights[this.values.text_size] == undefined)?1.4:lineHeights[this.values.text_size], 'text-align': this.values.text_align+" !important", 'font-size': this.text_sizes[this.values.text_size]+"rem !important", color: this.values.color, background: (this.values.color != this.$account.theme.bg.color1)?this.$account.theme.bg.color1:null};
				
			}
		},
		
		created() {
			this.block.title = this.$gettext('Текст');
			if (!this.values.color) this.values.color = this.$account.theme.screen.color;
			if (this.values.font == '') this.values.font = this.$account.theme.screen.font;
			
			this.$emit('update:tabs', [{name: 'common', title: this.$gettext('Текст')},{name: 'options', title: this.$gettext('Настройки')}]);
		},
		
		methods: {
			prepareValues() {
				let values = this.$clone(this.values);

				let theme = this.$account.theme;
				if (values.color == theme.screen.color) values.color = '';
				if (values.font == theme.screen.font) values.font = '';

				return values;
			}
		}, template: `<section class="modal-card-body modal-card-body-block-text modal-card-body-blocks"> <section v-if="currentTab == 'common'"> <div class="row row-small has-mb-2"> <div class="col-xs-8 col-sm has-xs-mb-2"> <b-field> <b-select v-model="values.text_size" :disabled="info.is_readonly" expanded> <optgroup :label="'Текст'|gettext"> <option value="sm">{{'Маленький текст'|gettext}}</option> <option value="md">{{'Средний текст'|gettext}}</option> <option value="lg">{{'Большой текст'|gettext}}</option> </optgroup> <optgroup :label="'Заголовок'|gettext"> <option value="h3">{{'Маленький заголовок'|gettext}}</option> <option value="h2">{{'Средний заголовок'|gettext}}</option> <option value="h1">{{'Большой заголовок'|gettext}}</option> </optgroup> </b-select> </b-field> </div> <div class="col-xs col-sm-shrink"> <vue-component-font-chooser v-model="values.font" :fullwidth="true"></vue-component-font-chooser> </div> <div class="col-xs col-sm-shrink"> <b-field> <b-radio-button v-model="values.text_align" v-for="v in text_aligns" type="is-dark" class="is-expanded" :native-value="v" :disabled="info.is_readonly"><i :class="'fa fa-align-{1}'|format(v)"></b-radio-button> </b-field> </div> <div class="col-xs col-shrink"> <vue-component-colorpicker v-model="values.color" :disabled="info.is_readonly" :colors="[$account.theme.screen.color]"></vue-component-colorpicker> </div> </div> <vue-component-emoji-picker v-model="values.text"> <textarea class="input" :placeholder="'Текст'|gettext" :style="style" v-emoji v-model="values.text" :disabled="info.is_readonly"></textarea> </vue-component-emoji-picker> </section> <section v-if="currentTab == 'options'"> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-timer", {data() {
			return {
				weekdays: this.$getDaysNames(),
				months: this.$getMonthsNames(),
				first_day_week: this.$getFirstDayWeek()
			}
		},

		props: ['values', 'options', 'variants', 'info', 'block', 'block_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		computed: {
			date: {
				get() {
					return this.values.timer[1].date?(new Date(this.values.timer[1].date)):null;
				},
				
				set(v) {
					this.values.timer[1].date = v?date_format('Y-m-d',v):null;
				}
			},
			
			time: {
				get() {
					if (this.values.timer[1].time)
					{
						let dt = this.values.timer[1].time.split(':')
						return new Date(0, 0, 0, dt[0], dt[1]);
					}
					else
					{
						return null;
					}				
				},
				
				set(v) {
					this.values.timer[1].time = v?date_format('H:i', v):null
				}
			},
			
			timeEveryday: {
				get() {
					if (this.values.timer[3].time)
					{
						let dt = this.values.timer[3].time.split(':')
						return new Date(0, 0, 0, dt[0], dt[1]);
					}
					else
					{
						return null;
					}				
				},
				
				set(v) {
					this.values.timer[3].time = v?date_format('H:i', v):null
				}

			}
		},
		
		created() {
			this.block.title = this.$gettext('Таймер обратного отсчета');
			this.$emit('update:tabs', [{name: 'common', title: this.$gettext('Таймер')},{name: 'options', title: this.$gettext('Настройки')}]);
		},
		
		methods: {
			prepareValues() {
				return this.values;
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="info.is_readonly && (currentTab == 'common')" class="message is-warning"> <div class="message-body">{{'Добавьте таймер обратного отсчета для временного ограничения — успеть поучаствовать в акции, записаться на курс и т.д.'|gettext}}</div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <b-field :label="'Тип таймера'|gettext"> <b-select v-model="values.type" :disabled="info.is_readonly" expanded> <option v-for="(v, k) in variants.type" :value="k">{{v}}</option> </b-select> </b-field> <div v-if="values.type == 1"> <div class="message is-info" v-if="!info.is_readonly"> <div class="message-body">{{'Укажите дату и время окончания отсчета'|gettext}}</div> </div> <div class="row"> <div class="col-xs-8"> <b-field :label="'Дата'|gettext" :message="errors.tms_1" :class="{'has-error': errors.tms_1}"> <div class="has-feedback"> <b-datepicker v-model="date" icon="calendar-alt" :disabled="info.is_readonly" :day-names="weekdays" :month-names="months" :first-day-of-week="first_day_week"></b-datepicker> <a class="form-control-feedback has-text-grey-light" @click="date = null" :class="{disabled: info.is_readonly}"><i class="fal fa-times"></i></a> </div> </b-field> </div> <div class="col-xs-4"> <label class="label">{{'Время'|gettext}}:</label> <div class="has-feedback"> <b-clockpicker v-model="time" :disabled="info.is_readonly" hour-format="24"></b-clockpicker> <a class="form-control-feedback has-text-grey-light" @click="time = null" :class="{disabled: info.is_readonly}"><i class="fal fa-times"></i></a> </div> </div> </div> </div> <div v-if="values.type == 2"> <div class="message is-info"><div class="message-body">{{'Таймер будет запущен при первом посещении страницы клиентом. Укажите длительность таймера.'|gettext}}</div></div> <b-field :message="errors.tms_2" :class="{'has-error': errors.tms_2}"> <div class="row has-mb-3"> <div class="col-xs-4 col-sm-3"> <label class="label">{{'Дни'|gettext}}:</label> <input type='number' v-model='values.timer[2].days' class='input' placeholder="0" maxlength="3" :disabled="info.is_readonly" min="1" max="99"> </div> <div class="col-xs-4 col-sm-3"> <label class="label">{{'Часы'|gettext}}:</label> <input type='number' v-model='values.timer[2].hours' class='input' placeholder="00" maxlength="2" :disabled="info.is_readonly" min="1" max="24"> </div> <div class="col-xs-4 col-sm-3"> <label class="label">{{'Минуты'|gettext}}:</label> <input type='number' v-model='values.timer[2].minutes' class='input' placeholder="00" maxlength="2" :disabled="info.is_readonly" min="1" max="60"> </div> </div> </b-field> <b-field :label="'Через сколько дней сбрасывать таймер'|gettext" :message="errors.expires_2" :class="{'has-error': errors.expires_2}"> <div class="row"> <div class="col-xs-4 col-sm-3"> <input type='number' v-model='values.timer[2].expires' class='input' placeholder="0" maxlength="3" :disabled="info.is_readonly"> </div> </div> </b-field> </div> <div v-if="values.type == 3"> <div class="message is-info"><div class="message-body">{{'Таймер будет перезапускаться каждый день. Укажите время окончания таймера.'|gettext}}</div></div> <b-field :label="'Время'|gettext" :message="errors.tms_3" :class="{'has-error': errors.tms_3}"> <div class="row"> <div class="col-md-3 col-sm-4 col-xs-6"> <div class="has-feedback"> <b-clockpicker v-model="timeEveryday" :disabled="info.is_readonly" hour-format="24"></b-clockpicker> <a class="form-control-feedback has-text-grey-light" @click="timeEveryday = null" :class="{disabled: info.is_readonly}"><i class="fal fa-times"></i></a> </div> </div> </div> </b-field> </div> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-video", {props: ['values', 'options', 'info', 'variants', 'block', 'block_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		created() {
			this.block.title = this.$gettext('Видео');
			this.$emit('update:tabs', [{name: 'common', title: this.block.title},{name: 'options', title: this.$gettext('Настройки')}]);
		},
		
		computed: {
			provider() {
				return VideoHelper.getProviderName(this.values.url);
			}
		},
		
		methods: {
			prepareValues() {
				let values = this.$clone(this.values);
				if (values.poster) values.poster = values.poster.picture_id;
				return values;
			},
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="info.is_readonly && (currentTab == 'common')" class="message is-warning"> <div class="message-body">{{'Вставьте видео для быстрого просмотра прямо на вашу страницу, без перехода на другой сайт'|gettext}}</div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <b-field :label="'Ссылка на видео'|gettext" :message="errors.url" :class="{'has-error': errors.url}"> <div class="control"> <input type="text" class="input" v-model="values.url" placeholder='http://' autocorrect="off" autocapitalize="none" :disabled="info.is_readonly"></input> <p class="help has-text-grey" v-if="!errors.url">{{'Поддерживается YouTube, Vimeo и видео формата mp4, m3u8 и webm'|gettext}}</p> </div> </b-field> <transition name="fade"> <vue-component-pictures v-model="values.poster" v-if="provider == 'file'" :button-title="'Загрузить обложку'|gettext" button-icon="fa fal fa-cloud-upload" updatable class="addon-opengraph-picture has-mb-2"></vue-component-pictures> </transition> <mx-toggle v-model="values.is_autoplay" :title="'Автовоспроизведение на компьютере'|gettext" class="has-mb-2" :disabled="info.is_readonly"></mx-toggle> <mx-toggle v-model="values.is_autohide" :title="'Скрыть элементы управления'|gettext" :disabled="info.is_readonly"></mx-toggle> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-choose-form", {data() {
			return {
				mainPage: null,
				isFetching: false,
				isMainpageChanging: false,
				values: {pages: []}
			}
		},
		
		props: ['is_readonly'],

		created() {
			this.fetchData(true);
		},

		methods: {
			onAction(v) {
				switch (v) {
					case 'change':
						this.mainPage = this.$account.page_id;
						this.isMainpageChanging = true;
						break;
				}
			},
			
			saveMainpage() {
				if (this.$account.page_id != this.mainPage) {
					this.$api.get('pages/changemainpage', {page_id: this.mainPage}, this).then((data) => {
						this.$account.page_id = this.mainPage;
						this.isFetching = false;
						this.isMainpageChanging = false;
					});
				} else {
					this.isMainpageChanging = false;
				}
			},
			
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('pages/list').then((data) => {
					this.isFetching = false;
					this.values.pages = data.response.pages;
				});

			},
			
			openPage(page_id) {
				this.$router.replace({name: 'pages', params: {page_id:page_id}});
				this.$parent.close();
			},
			
			newPage() {
				this.$form('vue-pages-page-form', null, this);
				this.$parent.close();
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title" v-if="isMainpageChanging">{{'Смена главной страницы'|gettext}}</p> <p class="modal-card-title" v-else>{{'Страницы'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="modal-card-body modal-card-body-blocks"> <div class="modal-pages-list"> <div v-if="isMainpageChanging"> <label class="item radio" v-for="f in values.pages"> <input type="radio" v-model="mainPage" :value="f.page_id"> <span v-if="f.title">{{f.title}}</span><span v-else class="has-text-grey">{{'Без имени'|gettext}}</span> </label> </div> <div v-else> <a class="item" @click="newPage" v-if="!is_readonly"><i class="fa fal fa-plus"></i> {{'Создать новую страницу'|gettext}}</a> <div class="modal-pages-list-hr" v-if="values.pages.length"></div> <a class="item" @click="openPage(f.page_id)" v-for="f in values.pages"> <i class="fa fal fa-mobile-android"></i> <span v-if="f.title">{{f.title}}</span><span v-else class="has-text-grey">{{'Без имени'|gettext}}</span> <span class="tag is-rounded is-success is-pulled-right" v-if="$account.page_id == f.page_id">{{'Главная страница'|gettext}}</span> </a> </div> </div> </section> <footer class="modal-card-foot level"> <div class="level-left"> <vue-component-action-button @action="onAction" v-if="!isMainpageChanging && !is_readonly" :title="'Действие'|gettext"> <template slot="actions"> <b-dropdown-item value="change"><i class="fa fa-home"></i> {{'Сменить главную страницу'|gettext}}</b-dropdown-item> </template> </vue-component-action-button> </div> <div class="level-right" v-if="isMainpageChanging"> <button class="button is-dark" type="button" @click="isMainpageChanging = false" :disabled="isFetching">{{'Отмена'|gettext}}</button> <button class="button is-primary" type="button" @click="saveMainpage" :disabled="isFetching">{{'Сохранить'|gettext}}</button> </div> <div class="level-right" v-else> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> </div> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("pages", "vue-pages-nickname-changed-form", {data() {
			return {
				isFetching: false,
				isUpdating: false,
				values: {}
			}
		},
		
		created() {
			this.fetchData(true);
		},

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('pages/nicknamechanged/get').then((data) => {
					this.isFetching = false;
					this.values = data.response.pages.nicknamechanged;
				});
			},
			
			updateData() {
				this.isUpdating = true;
				
				this.$api.post('pages/nicknamechanged/set', {}, this).then((data) => {
					if (data.result == 'success') {
						this.$auth.refresh(data.response, () => {
							this.$parent.close();
						});
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})

			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">{{'Обновление ссылки'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="modal-card-body"> <div class="message is-danger" v-if="values.is_busy"> <div class="message-body">{{'Вы не можете поменять ссылку, имя уже занято другим аккаунтом.'|gettext}}</div> </div> <div class="field"> {{'Ваш никнейм в Instagram изменился. Вам необходимо обновить ссылку в Instagram, после чего нажмите кнопку "Я обновил ссылку", чтобы зафиксировать изменения.'|gettext}} </div> <div class="field"> <label class="label">{{'Старая ссылка'|gettext}}</label> <input type="text" class="input" readonly="on" :value="values.old|sprintf('https://taplink.cc/%s')"> </div> <div class="field"> <label class="label">{{'Новая ссылка'|gettext}}</label> <div class="field has-addons"> <div class="control is-expanded"><input type="text" class="input" readonly="on" :value="values.new|sprintf('https://taplink.cc/%s')" id='pageLinkNew'></div> <div class="control"> <vue-component-clipboard :text="values.new|sprintf('https://taplink.cc/%s')" class="button is-default" :show-icon="false">{{'Скопировать'|gettext}}</vue-component-clipboard> </div> </div> </div> </section> <footer class="modal-card-foot"> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="updateData" :disabled="values.is_busy">{{'Я обновил ссылку'|gettext}}</button> <button class="button is-dark" type="button" @click="$parent.close()">{{'Пока не обновил'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("pages", "vue-pages-page-form", {data() {
			return {
				activeTab: 'common',
				isFetching: false,
				isUpdating: false,
			}
		},
		
		props: {page_id: Number, values: {
			default: {}	
		}},
		
		mixins: [FormModel],

		created() {
			if (this.page_id) {
				this.fetchData(true);
			}
		},
		
		computed: {
			pageLink() {
				return this.$account.link+'/p/'+parseInt(this.page_id).toString(16)+'/';
			},
			pageSafeLink() {
				return this.$account.link_safe+'/p/'+parseInt(this.page_id).toString(16)+'/';
			}
		},

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('pages/props/get', {page_id: this.page_id}).then((data) => {
					this.isFetching = false;
					this.values = data.response.pages.props.values;
				});
			},
			
			updateData() {
				this.isUpdating = true;
				this.$api.post('pages/props/set', this.values, this).then((data) => {
					if (data.result == 'success') {
						this.$parent.close();
						if (!this.page_id) {
							this.values.title = '';
							this.$router.replace({name:'pages', params: {page_id: data.response.values.page_id}});
						}
						this.values = {}
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})
			},
			
			deletePage() {
				this.$confirm(this.$gettext('Вы уверены что хотите удалить эту страницу? Вы не сможете её вернуть!'), 'is-danger').then(() => {
                    this.$api.get('pages/delete', {page_id: this.page_id}, this).then((data) => {
						if (data.result == 'success') {
							this.$parent.close();
							this.$router.replace({name:'pages', params: {page_id: this.$account.page_id}});
						}
					});
				});
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title" v-if="page_id">{{'Страница'|gettext}}</p> <p class="modal-card-title" v-else>{{'Новая страница'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <ul class="nav nav-tabs" v-if="page_id"> <li :class="{active: activeTab== 'common'}"><a href="#" @click="activeTab = 'common'">{{'Ссылка'|gettext}}</a></li> <li :class="{active: activeTab== 'qr'}"><a href="#" @click="activeTab = 'qr'">{{'QR-код'|gettext}}</a></li> </ul> <section class="modal-card-body" v-show="activeTab == 'common'"> <b-field :label="'Название страницы'|gettext" :message="errors.title" :class="{'has-error': errors.title}"> <input type="text" class="input" v-model="values.title"> </b-field> <div class="field" v-if="values.page_id"> <label class="label">{{'Ссылка на страницу'|gettext}}</label> <div class="field has-addons"> <div class="control is-expanded"><input type='text' class='input' readonly='on' id='pageLink' :value="pageLink"></div> <div class="control"> <vue-component-clipboard :text="pageLink" class="button is-default" :show-icon="false">{{'Скопировать'|gettext}}</vue-component-clipboard> </div> </div> </div> </section> <section class="message is-info" v-if="activeTab == 'qr'"><div class="message-body">{{'Вы можете скачать и использовать ваш QR-код на визитках или флайерах'|gettext}}</div></section> <section class="modal-card-body" v-if="activeTab == 'qr'"> <vue-component-qrcode :value="pageSafeLink"></vue-component-qrcode> </section> <footer class="modal-card-foot level"> <div class="level-left"> <button v-if="values.page_id" class="button is-default has-text-danger" @click="deletePage"><i class="fa fa-trash-alt"></i><span class="is-hidden-mobile"> {{'Удалить'|gettext}}</span></button> </div> <div class="level-right"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="updateData">{{'Сохранить'|gettext}}</button> </div> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("pages", "vue-pages-page", {data() {
			return {
				isFetching: false,
				data: {page: {is_readonly: true}, blocks: {}, blocks_order: []},
				variants: {text_sizes: {sm: '1.03', md: '1.26', lg: '1.48', h3: '1.71', h2: '2.2', h1: '3.5'}},
				tipsInited: false,
				tipsChoose: false,
				
				hasInstallBanner: false,
				hideInstallBanner: false,
				
				styles: {}
			}
		},
		
		props: ['page_id'],

		created() {
			this.fetchData(true);
			
			let s = document.location.search;
			let r = s.match(/[\?|\&]wizard/);
			if (r) {
				s = s.replace(/[\?|\&]wizard/, '');
				this.$form('vue-pages-wizard-form', {page_id: this.page_id}, this);
				this.$router.replace(document.location.pathname.substr(window.base_path.length-1) + s);
			}
		},
		
		watch: {
			page_id() {
				this.fetchData(true);
// 				this.themeChanged();
			}
		},
		
		mounted() {
			this.$io.on('events:page.blocks:refresh', this.eventRefreshBlocks);
			this.$io.on('events:page.blocks:resort', this.eventResortBlocks);
			this.$io.on('events:page.blocks:delete', this.eventDeleteBlock);
			this.$io.on('events:page.sections:update', this.eventSectionsUpdate);
			this.$io.on('events:account.username:changed', this.usernameChanged);

			//this.themeChanged();
		},
		
		computed: {
			tipsChoosePage() {
				return (!this.isFetching && (this.page_id != this.$account.page_id) && this.tipsChoose)?this.$gettext('Вы создали новую страницу, для навигации между вашими страницами нажмите тут'):'';
			},
			
			inited() {
				return (!this.isFetching && this.tipsInited);
			},
			
			linkDomain() {
				let a = this.$account;
				return (a.custom_domain_verified?((a.custom_domain_secured?'https':'http')+'://'+a.custom_domain):'https://taplink.cc');
			},
			
			linkPath() {
				return this.linkDomain+this.$account.link_path+this.data.page.link.path;
			},
			scrollContainer() {
				return window.matchMedia("(max-width: 767px)").matches?$mx('.main-block')[0]:(document.scrollingElement || document.documentElement);
			},
			sections() {
				let last_section_id = null;
				let sections = [];
				let section = {bg: null, bg_layer: null, blocks: []};
				
				for (i = 0; i < this.data.blocks_order.length; i++)  {
					let f = this.data.blocks[this.data.blocks_order[i]];
					
					if (f == undefined) continue;
					
					if (f.section_id != last_section_id) {
						if (section.blocks.length) sections.push(section);
						let bg = (this.data.sections[f.section_id] == undefined)?null:this.data.sections[f.section_id];
						section = {bg: bg?(buildStylesBackground({bg: bg}, 'html')):null, bg_layer: bg?(buildStylesBackground({bg: bg}, 'body')):null,blocks: []};
					}
					
					section.blocks.push({i: i, block_id: f.block_id});
					
					last_section_id = f.section_id;
				}
				
				if (section.blocks.length) sections.push(section);
				
				return sections;
			},

/*
			blocks() {
				let blocks = [];
				for (i = 0; i < this.data.blocks_order.length; i++)  blocks.push(this.data.blocks[this.data.blocks_order[i]]);
			}
*/
		},
		
		destroyed() {
			this.$io.off('events:page.blocks:refresh', this.eventRefreshBlocks);
			this.$io.off('events:page.blocks:resort', this.eventResortBlocks);
			this.$io.off('events:page.blocks:delete', this.deleteBlock);
			this.$io.off('events:page.sections.update', this.eventSectionsUpdate);
			this.$io.off('events:account.username:changed', this.usernameChanged);
		},

		methods: {
			bannerInnerStyle(o) {
				return o.p?('width:'+((o.is_scale && o.width)?o.width:o.p.width)+'px'):'';
			},

			usernameChanged(data) {
				this.$account.nickname_changed = true;
			},
			
			prepareData(data) {
				_.each(data.blocks, (f) => {
					switch (f.block_type_name) {
						case 'link':
							f.stylesheet = '';
							if (f.options.design.on) f.stylesheet += 'background: '+f.options.design.bg+';border-color: '+f.options.design.bg+';color: '+f.options.design.text;
							break;
						case 'banner':
							f.stylesheet_picture = 'padding-top: '+(f.options.p?(f.options.p.height / f.options.p.width * 100):50)+'%'+(f.options.p?(';background: url('+'//'+this.$account.storage_domain+'/p/'+f.options.p.filename+')  0 0 / 100%'):'');
							break;
						case 'pictures':
							let sizes = {
								100: 100,
								70: '70.6',
								50: 50,
								138: '141.4516'
							}
							_.each(f.options.list, (item) => {
								item.stylesheet_picture = ('padding-top: calc('+sizes[f.options.picture_size]+'%)')+(item.p?(';background-image: url('+item.p+')'):'');
								item.stylesheet_text = '';
								item.stylesheet_button = '';
									
								if (f.options.design.on && (f.options.design.text || f.options.design.bg)) item.stylesheet_text = 
									(f.options.design.text?('color:'+f.options.design.text+' !important;'):'') + 
									(f.options.design.bg?('background:'+f.options.design.bg+' !important;'):'');
	
								if (f.options.design.on && (f.options.design.text || f.options.design.bg)) item.stylesheet_button = 
									(f.options.design.button_text?('color:'+f.options.design.button_text+' !important;'):'') + 
									(f.options.design.bg?('background:'+f.options.design.bg+' !important;'):'');
									
									
								if (f.options.link && !item.link.title) item.link.title = this.$gettext('Открыть');
							});
							break;
						case 'socialnetworks':
							_.each(f.options.items, (v) => {
								v.classname = ((f.options.socials_style != 'default')?('btn-socials btn-socials-'+v.n):'') + ((['default', 'block'].indexOf(f.options.socials_style) != -1)?' btn-link-styled':'');
							});

							f.stylesheet = '';
							if (f.options.design.on) f.stylesheet += 'background: '+f.options.design.bg+' !important;border-color: '+f.options.design.bg+' !important;color: '+f.options.design.text+' !important';
							
/*
							if (f.options.socials_style == 'compact') {
								f.options.links = _.chunk(f.options.links, 4);
							} else {
								f.options.links = _.chunk(f.options.links, 1);
							}
*/
// 							f.options.links = [f.options.links];
							break;
						case 'messenger':
							_.each(f.options.items, (v) => {
								v.classname = 'btn-link-'+f.options.messenger_style+' '+((f.options.messenger_style != 'default')?('btn-socials btn-link-'+v.n):'') + ((['default', 'block'].indexOf(f.options.messenger_style) != -1)?' btn-link-styled':'');
							});

							f.stylesheet = '';
							if (f.options.design.on && f.options.messenger_style != 'icon') f.stylesheet += 'background: '+f.options.design.bg+' !important;border-color: '+f.options.design.bg+' !important;color: '+f.options.design.text+' !important';
							
/*
							let types = {compact: 4, circle: 4, icon: 4};
							f.options.links = _.chunk(f.options.links, (types[f.options.messenger_style] == undefined)?1:types[f.options.messenger_style]);
*/
							break;
						case 'map':
							_.each(f.options.markers, (v) => {
								if (!v.title) v.title = this.$gettext('Заголовок');
	
								v.stylesheet = '';
								if (f.options.design.on && (f.options.design.text || f.options.design.bg)) v.stylesheet = 
									(f.options.design.text?('color:'+f.options.design.text+' !important;'):'') + 
									(f.options.design.bg?('background:'+f.options.design.bg+' !important;border-color:'+f.options.design.bg+' !important;'):'');
								
							});
							break;
						case 'form':
							_.each(f.options.fields, (item) => {
								item.stylesheet = '';
								
								if (f.options.design.on && (f.options.design.text || f.options.design.bg)) item.stylesheet = 
									(f.options.design.text?('color:'+f.options.design.text+' !important;'):'') + 
									(f.options.design.bg?('background:'+f.options.design.bg+' !important;border-color:'+f.options.design.bg+' !important;'):'');
									
									
									switch (item.typename) {
										case 'paragraph':
											item.text = item.text.replace(/<a/g, '<span').replace(/<\/a>/g, '</span>');
											break;
										default:
											item.input_type = 'text';
// 											if (item.typename == 'phone') item.input_type = 'tel';
											if (item.typename == 'number') item.input_type = 'number';
											break;
									}
							});
							break;
						case 'collapse':
							f.options.texts = _.map(f.options.texts, this.$nl2br);
							break;
					}
					
					let is_visible = this.$auth.isAllowTariff(f.tariff);
					if (f.is_visible) f.is_visible = is_visible;
					
					StylesFactory.prepareStyles(f.block_id, f.block_type_name, f.options, this.styles);
					
					return f;
				});

				StylesFactory.updateCSSBlock(this.styles, this.$refs.styles);					
				
				return data;
			},
			
			eventSectionsUpdate(data) {
				if (data.page_id == this.page_id) {
					this.data.sections = Object.assign({}, this.data.sections, data.sections); //{} -- reactive official vue hack
				}
			},
			
			eventDeleteBlock(data) {
				if (data.page_id == this.page_id) {
					delete this.data.blocks[data.block_id]; 
					this.data.blocks_order.splice(this.data.blocks_order.indexOf(data.block_id), 1);
				}
			},
			
			eventRefreshBlocks(data) {
				if (data.page_id == this.page_id) {
					if (data.block_id != undefined) {
						this.$api.get('pages/blocks', {page_id: this.page_id, block_ids: [data.block_id]}).then((d) => {
							if (d.result == 'success') {
								let dt = this.prepareData(d.response.page);
								this.data.blocks = Object.assign({}, this.data.blocks, dt.blocks); //{} -- reactive official vue hack
							}
						});
					} else {
						this.fetchData();
					}
				}
			},
			
			eventResortBlocks(data) {
				if (data.page_id == this.page_id) {
					function array_diff(array1, array2) {
						return array1.filter(function(elm) {
							return array2.indexOf(elm) === -1;
						});
					}
					
					let blocks_del = array_diff(this.data.blocks_order, data.blocks_order);
					let blocks_add = array_diff(data.blocks_order, this.data.blocks_order);

					if (blocks_del.length) {
						_.each(blocks_del, (id) => { 
							delete this.data.blocks[id]; 
							this.data.blocks_order.splice(this.data.blocks_order.indexOf(id), 1);
						});
					}
					
					if (blocks_add.length) {
						this.$api.get('pages/blocks', {page_id: this.page_id, block_ids: blocks_add}).then((d) => {
							if (d.result == 'success') {
								let dt = this.prepareData(d.response.page);
								this.data.blocks = Object.assign({}, this.data.blocks, dt.blocks); //{} -- reactive official vue hack
								this.data.blocks_order = data.blocks_order;
							}
						});
					} else {
						// Если нет добавлений - обновляем сразу
						this.data.blocks_order = data.blocks_order;
					}
				}
				
				if (data.sections_changed != undefined) {
					_.each(data.sections_changed, (s, b) => {
						this.data.blocks[b].section_id = s;
					});
				}
			},

			fetchData(withLoading) {
				this.tipsChoose = this.tipsInited = false;
				this.isFetching = withLoading;
				this.$api.get('pages/get', {page_id: this.page_id}).then((data) => {
					this.styles = {};
					this.data = this.prepareData(data.response.page);
					this.isFetching = false;
					
					if ((this.$account.tips_bits & 2) == 0)
					{
						this.checkWelcomePartnerAccess();
						eventStack.push('google', 'startup');
						eventStack.push('metrika', 'startup');
						
						//$mx(document).trigger('startup');
					}
					
					if (((this.$account.tips_bits & 1) == 0) && this.$auth.isAllowTariff('business') && (this.page_id != this.$account.page_id)) //НАДО ТАК
					{
						this.tipsChoose = true;
						this.$account.tips_bits = this.$account.tips_bits | 1;
						//alert(this.$account.tips_bits);
					}
					
					if (m = document.location.hash.match('publish:?([a-z\_]+)?')) {
						this.installPage((m.length > 1)?m[1]:null);
						document.location.hash = '';
					}
				});
			},
			
			showStartupTips(cb) {
				window.initStartup({langNewblock: this.$gettext("Чтобы добавить новый блок,<br>нажмите сюда"), langSort: this.$gettext("Вы можете менять блоки местами,<br>для этого перетащите нужный вам блок"), langEditblock: this.$gettext("Чтобы отредактировать блок,<br>просто нажмите на него")/* , langLink: this.$gettext("Ваша главная ссылка, вставьте ее в Instagram") */}, cb);
			},
			/*
			updateData() {
				this.isUpdating = true;
				this.$api.post('__VALUE__', this.values, this).then((data) => {
					if (data.result == 'success') {
						this.$parent.close()
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})
			},
*/
			checkWelcomeWizard() {
				if ((this.$account.tips_bits & 2) == 0)
				{
/*
					if (window.i18n.locale != 'ru') {
						this.tipsInited = true;
						this.$form('vue-pages-wizard-form', {page_id: this.page_id}, this);
					} else {
*/
						this.$nextTick(() => { 
							this.showStartupTips(() => {
								this.$account.tips_bits = this.$account.tips_bits | 2;
							});
						});
// 					}
				}
			},
			
			checkWelcomePartnerAccess(cb) {
				if (this.$account.partner.with_message != undefined && this.$account.partner.with_message) {
					this.$form('vue-pages-partner-access-form', {}, this);
					
					//alert(this.$account.partner.welcome_message);
				} else {
					this.checkWelcomeWizard();
				}
			},
			
			openForm(block_id) {
				this.$form('vue-pages-blocks-form-modal', {block_id: block_id}, this);
			},
			
			newBlock() {
				this.$form('vue-pages-blocks-form-modal', {page_id: this.page_id}, this);
			},

			prepareText(text) {
				return text.trim()?text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\n/g, '<br>'):this.$gettext('Редактировать текст');
			},
			
			prepareTextStyle(options) {
				let lineHeights = {h2: 1.25, h1: 1.15};
				return {'font-family': options.font?(globalFontsFallback[options.font]):null, 'text-align': options.text_align, 'line-height': (lineHeights[options.text_size] == undefined)?1.4:lineHeights[options.text_size], 'font-size': this.variants.text_sizes[options.text_size]+'rem', color: options.color+'!important'};
			},
						
			addLinkPage(block_id, title) {
				this.$form('vue-pages-page-form', {values: {block_id: block_id, title: title}}, this);
			},
			
			installPage(target) {
				this.$form('vue-pages-publish-form', {is_readonly: this.data.page.is_readonly, target: target}, this);
/*
				if (!this.$account.nickname || (document.location.hostname == 'dev.taplink.ru')) {
				} else {
					this.$form('vue-pages-install-form', {is_readonly: this.data.page.is_readonly}, this);
				}
*/
//  				this.$form('vue-pages-welcome-form', {is_readonly: this.data.page.is_readonly}, this);
			},
			
			installPageBanner() {
				this.installPage();
				this.hideInstallBanner = true;
			},
						
			configurePage() {
				this.$form('vue-pages-page-form', {page_id: this.data.page.page_id}, this);
			},
			
			choosePage() {
				this.$form('vue-pages-choose-form', {is_readonly: this.data.page.is_readonly}, this);
			},
			
			changeNickname() {
				this.$form('vue-pages-nickname-changed-form', {}, this);
			},
			
			sortEnd(e) {
				if (e.oldIndex != e.newIndex) {
					let index_after = (e.oldIndex < e.newIndex)?e.newIndex:(e.newIndex?(e.newIndex-1):-1);
					let after = (index_after != -1)?this.data.blocks_order[index_after]:null;
					
					if (_.size(this.data.sections) > 0) {
						let id_last_section = this.data.blocks[this.data.blocks_order[e.oldIndex]].section_id;
						
						let id1_section = (this.data.blocks[after] != undefined)?this.data.blocks[after].section_id:null;
						let id2_section = (this.data.blocks[this.data.blocks_order[index_after+1]] != undefined)?this.data.blocks[this.data.blocks_order[index_after+1]].section_id:null;
						
						if ((id_last_section != id1_section) && (id_last_section != id2_section)) {
							if (id1_section && (id1_section == id2_section)) {
								this.data.blocks[this.data.blocks_order[e.oldIndex]].section_id = id1_section;
							} else {
								//Если в секции один блок - не удаляем
								let tmp = this.data.blocks[this.data.blocks_order[e.oldIndex]].section_id;
								let tmp_amount = 0;
								_.each(this.data.blocks, (b) => { tmp_amount += (tmp == b.section_id)?1:0; }); 
								
								// Если это не последний блок в секции - удаляем
								if (tmp_amount > 1) this.data.blocks[this.data.blocks_order[e.oldIndex]].section_id = null;
							}
						}
					}
					
					this.$api.get('pages/resort', {page_id: this.page_id, id: this.data.blocks_order[e.oldIndex], after:after}, null, 'resort').then((data) => {
						if (data.result == 'fail') this.fetchData(true);
					});
				}
			},
						
			showInstallBanner() {
				this.hasInstallBanner = true;
				this.hideInstallBanner = true;
				setTimeout(() => { this.hideInstallBanner = false; }, 1500);
			}
		}, template: `<div style="flex: 1;display: flex;flex-direction: column"> <div ref='styles'></div> <div class="footer-banner has-background-dark" v-if="hasInstallBanner" :class="{'is-closed': hideInstallBanner}"> <div class="container has-mb-2 has-mt-2"> <div>⚠️ {{'Необходимо установить ссылку в профиль Instagram'|gettext}}</div> <button class="button is-black has-ml-1" @click="installPageBanner">{{'Сделать это'|gettext}}</button> </div> </div> <div class="top-panel hero-block hero-link"> <div class="container"> <div class="row"> <div class="col-xs-12"> <div class="form-control-link is-size-5"> <div class="form-control-link-text has-text-danger" v-if="$account.ban"><i class="fa fa-exclamation-circle has-mr-1"></i>{{'Ваш аккаунт заблокирован'|gettext}}</div> <div class="form-control-link-text" v-else> <a style="margin-right: 5px" v-if="$account.nickname_changed" @click="changeNickname" :data-tips-title="'Никнейм вашего Instagram профиля изменился, нажмите тут чтобы обновить ссылку'|gettext" data-tips-placement='bottom'><i class="fas fa-exclamation-circle has-text-danger"></i></a> <span v-if="$account.nickname || $account.custom_domain_verified"> <span class='is-hidden-mobile'>{{'Моя ссылка'|gettext}}: </span><a :href="linkPath" target="_blank" v-if="!isFetching"><span :class="{'is-hidden-mobile':!$account.custom_domain || data.page.link.path}">{{linkDomain}}</span>{{$account.link_path}}{{data.page.link.path}}</a> </span> <span v-else> <span class="is-hidden-mobile">{{'Для получения ссылки нажмите кнопку "Установить"'|gettext}}</span> <span class="is-hidden-tablet">{{'Получить ссылку'|gettext}}</span> <i class="fa fa-long-arrow-right has-ml-1"></i> </span> </div> <router-link v-if="$account.tariff == 'business' && ($account.page_id != page_id) && (page_id != 0)" :to="{name: 'pages', params: {page_id: $account.page_id}}" class="button is-light link-pages"><i class="fa fa-undo has-text-grey-light"></i><span class="is-hidden-mobile"> {{'На главную'|gettext}}</span></router-link> <button v-if="$auth.isAllowTariff('business') && !tipsChoose" class="button is-success link-pages" @click="choosePage"><i class="fas fa-caret-down"></i></button> <a v-if="$auth.isAllowTariff('business') && tipsChoose" class="button is-success link-pages" @click="choosePage" :data-tips-title="tipsChoosePage" data-tips-bit='1' data-tips-placement='bottom'><i class="fas fa-caret-down"></i></a> <a v-if="$account.page_id == page_id" class="button is-primary" @click="installPage()" style="min-width:100px" :disabled="$account.ban">{{'Установить'|gettext}}</a> <a v-else class="button is-primary" :class="{disabled: data.page.is_readonly}" @click="configurePage"><i class="fa fa-cog is-visible-mobile"></i><span class="is-hidden-mobile">{{'Настройки'|gettext}}</span></a> </div> </div> </div> </div> </div> <div class='main-block1 main-block-xs-clear' style="display: flex;flex-direction: column;flex:1"> <div class="device is-large has-padding-top has-padding-bottom has-shadow is-hide-mobile page-blocks has-mt-5 has-mb-5 is-xs-marginless" style="display: flex"> <div class="screen page" :class="'is-{1}'|format($account.theme.bg.brightness)"> <div class="theme-main"> <div v-html="$account.theme.html"></div> <sortable-list class="blocks-list" style="flex-grow:1" lockAxis="y" v-model="data.blocks_order" use-drag-handle helperClass="page-blocks" @sortEnd="sortEnd" :useWindowAsScrollContainer="true" :scrollContainer="scrollContainer" :contentWindow="scrollContainer"> <div v-for="section in sections" :style="section.bg"> <div :style="section.bg_layer" class="has-pb-2 has-pt-2"> <sortable-item v-for="b in section.blocks" :class="['b-'+b.block_id, 'container block-item has-pb-1 has-pt-1', {'is-readonly': data.page.is_readonly}]" :index="b.i" :key="b.i" :item="data.blocks[b.block_id]"> <div v-if="data.blocks[b.block_id].block_type_name == 'text'" class="block-text" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)" v-html="prepareText(data.blocks[b.block_id].options.text)" :style="prepareTextStyle(data.blocks[b.block_id].options)"></a> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'avatar'" class="block-avatar" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)"> <div class="has-text-centered"><img :src="$account.avatar.url" :class="data.blocks[b.block_id].avatar.size|sprintf('profile-avatar profile-avatar-%s')"></div> <div class="has-text-centered text-avatar" v-if="!data.blocks[b.block_id].avatar.is_hide_text && $account.nickname">@{{$account.nickname}}</div> </a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'html'" class="block-html" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)"> <vue-component-blocks-html v-model="data.blocks[b.block_id].options.html"></vue-component-blocks-html> </a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'link'" :class="data.blocks[b.block_id].options.link_type|sprintf('block-link block-link-%s')" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <router-link v-if="data.blocks[b.block_id].options.link_type == 'page' && data.blocks[b.block_id].options.link_page_id" class="block-handle-link" :to="{name: 'pages', params: {page_id: data.blocks[b.block_id].options.link_page_id}}"></router-link> <a v-if="data.blocks[b.block_id].options.link_type == 'page' && !data.blocks[b.block_id].options.link_page_id" class="block-handle-link block-handle-link-plus" @click="addLinkPage(b.block_id, data.blocks[b.block_id].options.title)"></a> <a @click="openForm(b.block_id)" class="button btn-link btn-link-styled" :style="data.blocks[b.block_id].stylesheet">{{data.blocks[b.block_id].options.title}}<div v-if="data.blocks[b.block_id].options.subtitle" class="btn-link-subtitle">{{data.blocks[b.block_id].options.subtitle}}</div></a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'timer'" class="block-timer" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)" style="overflow: hidden"> <center> <vue-component-blocks-flipclock v-model="data.blocks[b.block_id].options" :page_id="data.page.page_id"></vue-component-blocks-flipclock> </center> </a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'break'" class='block-break' :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)"> <div class='block-break-inner' :class="{'has-icon': data.blocks[b.block_id].options.icon, 'is-invisible': data.blocks[b.block_id].options.icon < 0, 'is-fullwidth': data.blocks[b.block_id].options.fullwidth, 'has-fading': data.blocks[b.block_id].options.fading}" :style="{'height': data.blocks[b.block_id].options.break_size + 'px'}"><span><i :class="['fa fai', 'fa-'+data.blocks[b.block_id].options.icon]" v-if="data.blocks[b.block_id].options.icon"></i></span></div> </a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'video'" class="block-video" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)"> <vue-component-video :options="data.blocks[b.block_id].options" style="pointer-events: none"></vue-component-video> </a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'collapse'" class="block-collapse" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)" class="btn-link-block"> <div class="collapse-list"> <div class="collapse-item" v-for="v in data.blocks[b.block_id].options.fields"> <div class="a"> <span class="collapse-icon"></span> <span class="collapse-title" v-if="v.title">{{v.title}}</span> <span class="collapse-title" v-else>{{'Заголовок'|gettext}}</span> </div> </div> </div> </a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'pictures'" class="block-slider" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)"> <div class="block-slider-inner"> <div :class="{'slider-has-text': data.blocks[b.block_id].options.options.text, 'slider-has-link': data.blocks[b.block_id].options.options.link, 'slider-has-border': !data.blocks[b.block_id].options.remove_border}" class="slider slider-pictures"> <div class="slider-inner"> <div v-for="(item, i) in data.blocks[b.block_id].options.list" v-if="i < 2" class="slider-slide"><div class="picture-container" :class="{'picture-container-empty': !item.p}" :style="item.stylesheet_picture"><div></div></div> <div v-if="data.blocks[b.block_id].options.options.text" class="slider-slide-text" :style="item.stylesheet_text"><div class="slider-slide-title" v-if="item.t">{{item.t}}</div><div class="slider-slide-title" v-else>{{'Заголовок'|gettext}}</div><div class="slider-slide-snippet">{{item.s}}</div></div> <div v-if="data.blocks[b.block_id].options.options.link && item.link.title" class="slider-slide-link" :style="item.stylesheet_button">{{item.link.title}}</div> <div v-if="data.blocks[b.block_id].options.options.link && !item.link.title" class="slider-slide-link" :style="item.stylesheet_button">{{'Открыть'|gettext}}</div> </div> </div> <div class="slider-nav" v-if="data.blocks[b.block_id].options.list.length> 1"> <div v-for="(item, i) in data.blocks[b.block_id].options.list" class="slider-dot" :class="{'active': !i}"></div> </div> </div> </div> </a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'form'" class="block-form" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)"> <div v-for="field in data.blocks[b.block_id].options.fields"> <div v-if="field.typename == 'button'" class="form-field"><div class="button btn-link" :style="field.stylesheet">{{field.title}}</div></div> <div v-else-if="field.typename == 'paragraph'" class="form-field" style="font-size:1.9em !important" v-html="field.text"></div> <div v-else class="form-field"> <div v-if="field.typename == 'checkbox'" class="checkbox-list"> <label class="checkbox"> <input type="checkbox" :checked="field.default"> {{field.title}}<sup class="required" v-if="field.required">*</sup> </label> <div class="form-field-desc" v-if="field.text">{{field.text}}</div> </div> <label v-else class="label">{{field.title}}<sup class="required" v-if="field.required">*</sup></label> <div v-if="(field.typename != 'checkbox') && field.text" class="form-field-desc">{{field.text}}</div> <input v-if="['name', 'text', 'email', 'number'].indexOf(field.typename) != -1" :type="field.input_type" value=''> <div v-if="field.typename == 'phone'"><input type="tel" value='' :data-country="$account.client.country"></div> <textarea v-if="field.typename == 'textarea'" rows="4"></textarea> <input v-if="['date', 'time'].indexOf(field.typename) != -1" :type="field.input_type"> <div class="select" v-if="field.typename == 'select' || field.typename == 'country'"><select> <option value="" v-if="field.nulltitle">{{field.nulltitle}}</option> <option v-for="variant in field.variants" :value="variant">{{variant}}</option> </select></div> <div class="radio-list" v-if="field.typename == 'radio'"> <label v-for="variant in field.variants" class="radio is-block"> <input type="radio" :value="variant"> {{variant}} </label> </div> </div> </div> </a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'socialnetworks'" class="block-socialnetworks" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle block-handle-socials" v-show="!data.page.is_readonly"></div> <div class="socials"> <div class="row row-small"> <div :class="{'col-xs': (data.blocks[b.block_id].options.socials_style != 'default' && data.blocks[b.block_id].options.socials_style != 'block'), 'col-xs-12': (data.blocks[b.block_id].options.socials_style == 'default' || data.blocks[b.block_id].options.socials_style == 'block')}" v-for="l in data.blocks[b.block_id].options.items"> <a @click="openForm(b.block_id)" class="button btn-flat btn-link" :class="l.classname" :style="data.blocks[b.block_id].stylesheet"><i v-if="data.blocks[b.block_id].options.socials_style != 'default'" :class="l._icon|sprintf('fa fab fa-%s')"></i> <span v-if="data.blocks[b.block_id].options.socials_style != 'compact'">{{l.t}}</span></a> </div> </div> </div> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'messenger'" class="block-link" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle block-handle-socials" v-show="!data.page.is_readonly"></div> <div class="socials"> <div class="row row-small"> <div :class="{'col-xs': (data.blocks[b.block_id].options.messenger_style != 'default' && data.blocks[b.block_id].options.messenger_style != 'block'), 'col-xs-12': (data.blocks[b.block_id].options.messenger_style == 'default' || data.blocks[b.block_id].options.messenger_style == 'block')}" v-for="l in data.blocks[b.block_id].options.items"> <a @click="openForm(b.block_id)" class="button btn-link" :class="l.classname" :style="data.blocks[b.block_id].stylesheet"> <img :src="'/s/i/messengers/icons/{1}.svg'|format(l.n)" v-if="data.blocks[b.block_id].options.messenger_style == 'icon'"> <i :class="'fa fab fa-{1}'|format(l._icon)" v-else v-if="data.blocks[b.block_id].options.messenger_style != 'default' && data.blocks[b.block_id].options.messenger_style != 'icon'"></i> <span v-if="['default', 'block'].indexOf(data.blocks[b.block_id].options.messenger_style) != -1">{{l.t}}</span> </a> </div> </div> </div> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'map'" class="block-form" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)" class="btn-link-block"> <vue-component-blocks-map v-model="data.blocks[b.block_id].options"></vue-component-blocks-map> </a> <a v-if="data.blocks[b.block_id].options.show_buttons" v-for="m in data.blocks[b.block_id].options.markers" @click="openForm(b.block_id)" class="button btn-link btn-link-block btn-map btn-link-styled" :style="m.stylesheet"> <i class="fa fa-map-marker-alt"></i><span>{{ m.title }}</span> </a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'banner'" class="block-banner" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)" class="btn-link-block"> <div class="block-banner-inner" :style="bannerInnerStyle(data.blocks[b.block_id].options)"><div class="picture-container" :class="{'picture-container-empty': !data.blocks[b.block_id].options.p}" :style="data.blocks[b.block_id].stylesheet_picture"></div></div> </a> </div> </div> </sortable-item> </div> </div> </sortable-list> <div v-if="!data.page.is_readonly" class="has-sm-pl-2 has-sm-pr-2 has-mt-2" :class="{'has-mt-8': data.blocks_order.length == 0}"> <a @click="newBlock" class="button btn-link btn-link-empty"><i class='fa fas fa-plus fa-lg is-visible-mobile'></i> {{'Добавить новый блок'|gettext}}</a> </div> </div> </div></div> </div> </div>`});

window.$app.defineComponent("pages", "vue-pages-partner-access-form", {data() {
			return {
				isUpdating: false,
				isAllow: true
			}
		},

		created() {
			
		},

		mixins: [FormModel],

		methods: {
			update() {
				if (this.isAllow && this.$account.partner.with_access) {
					this.$api.post('access/set', {account_id: this.$account.partner.account_id, part: 'main'}).then((data) => {
						this.close();
						this.isUpdating = false;
					}).catch(({ data }) => {
						this.isUpdating = false;
					})
				} else {
					this.close();
				}
			},
			
			close() {
				this.$parent.close();
				setTimeout(() => {
					this.$parent.$parent.checkWelcomeWizard();
				}, 300)
/*
				this.isUpdating = true;
				this.$api.post('__VALUE__', this.values, this).then((data) => {
					if (data.result == 'success') {
						this.$parent.close()
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})
*/
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">{{'Добро пожаловать'|gettext}}</p> <button class="modal-close is-large" @click="update"></button> </header> <section class="modal-card-body"> <h4 class="has-mb-2">{{$account.partner.welcome_message}}</h4> <mx-toggle v-model='isAllow' v-if="$account.partner.with_access" :title="'Предоставить полный доступ'|gettext"></mx-toggle> </section> <footer class="modal-card-foot"> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="update" v-if="$account.partner.with_access">{{'Сохранить'|gettext}}</button> <button class="button is-dark" type="button" @click="close()" v-else>{{'Закрыть'|gettext}}</button> </footer> </div>`});

window.$app.defineComponent("pages", "vue-pages-publish-form", {data() {
			return {
				isUnattaching: false,
				isFetching: false,
				isUpdating: false,
				isButtonLoading: '',
				current: null,
				profiles: {},
				widget: {},
				variants: {},
				is_installed: false,
				activeTab: 'instagram',
				prepare: null
			}
		},
		
		props: {is_readonly: Boolean, target: String},

		computed: {
			widgetCode() {
				return '<script src="//taplink.cc/'+(this.$account.nickname?this.$account.nickname:('id:'+this.$account.profile_id))+'/widget/" async></script>';
			},
			
			instagramLink() {
				return 'https://taplink.cc/'+this.$account.nickname;
			}
		},
		
		created() {
			if (this.$account.custom_domain/*  && !this.$account.custom_domain_verified */) this.activeTab = 'domain';
			if (['instagram_business', 'instagram_basic'].indexOf(this.target) != -1) {
				this.activeTab = 'instagram';
			}
			
			this.fetchData(true);
		},
		
		methods: {
			attachAnotherProfile() {
				$mx('<iframe src="https://www.instagram.com/accounts/logout/" width="0" height="0"></iframe>').on('load', function() {
					document.location = '/login/instagrambasic/?method=attach';
				}).appendTo('body');
			},
			
			toggleTab(v) {
				this.activeTab = (this.activeTab == v && (window.matchMedia("(max-width: 767px)").matches))?null:v;
			},
			
			check() {
				this.isUpdating = true;
				this.$api.get('pages/publish/check', {target: this.target}).then((data) => {
					this.$parent.close();
				});
			},
			
			confirmAttach() {
				this.target = 'instagram_basic_confirm';
				this.fetchData(true);
			},
			
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('pages/publish/info', {target: this.target, prepare: this.prepare}).then((data) => {
					this.isFetching = false;
					this.widget = data.response.widget;
					this.profiles = data.response.profiles;
					this.variants = data.response.variants;
					this.is_installed = data.response.is_installed;
					
					switch (this.target) {
						case 'instagram_basic':
							this.prepare = data.response.prepare;
							break;
						case 'instagram_basic_confirm':
							this.prepare = null;
							break;
					}
					
					if (data.response.account) this.$auth.refresh(data.response.account);
					if (data.response.message) this.$alert(data.response.message, 'is-danger');
				});
			},
			
			choose(row) {
				this.isFetching = true;
				this.$api.get('pages/publish/set', {id: row.id, uniq: row.uniq}).then((data) => {
					this.isFetching = false;
					this.$auth.refresh(data.response, () => {
						this.$parent.$parent.installPage();
						this.$parent.close();
					});
				});
			},
			
			unattach() {
				this.$confirm(this.$gettext('Вы уверены что хотите отключить профиль от вашей страницы?'), 'is-danger').then(() => {
					this.isUnattaching = true;
					this.$api.get('pages/publish/unattach', {id: this.current}).then((data) => {
						this.$auth.refresh(data.response);
						this.isUnattaching = true;
					});
				});
			},
			
			onWidgetChanged: _.debounce(function() {
				if (!this.is_readonly) this.$api.get('pages/install/set', {widget: this.widget});
			}, 500)
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">{{'Установка ссылки'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="modal-card-body modal-card-body-blocks" style="display:flex"> <div class="publish-form-collapse"> <div class="is-title" @click="toggleTab('instagram')" :class="{in: activeTab== 'instagram'}"> <span><i class="fal fa-chevron-right has-mr-2"></i>Instagram</span> </div> <div> <div> <section v-if="$account.nickname"> <label class="label" v-if="is_installed">{{'Ваша ссылка'|gettext}}</label> <div class="media has-mb-2" v-else> <div class="media-left"><span class="tag is-warning">1</span></div> <div class="media-content"> <label class="label">{{'Скопируйте ссылку на страницу'|gettext}}</label> </div> </div> <div class="field has-addons is-marginless"> <div class="control is-expanded"><input type="text" class="input is-mouse-locked has-text-black" readonly="on" disabled="on" :value="instagramLink"></div> <div class="control is-hidden-mobile"> <vue-component-clipboard :text="instagramLink" class="button is-default" :show-icon="false"><i class="fal fa-copy has-mr-1"></i>{{'Скопировать ссылку'|gettext}}</vue-component-clipboard> </div> <div class="control is-hidden-mobile"> <button class="button has-text-danger" @click="unattach" :class="{'is-loading': isUnattaching}" data-toggle="tooltip" data-placement="top" :data-original-title="'Отключить профиль'|gettext"><i class="fal fa-trash-alt"></i></button> </div> </div> <div class="is-hidden-tablet has-mt-2"> <div class="row row-small"> <div class="col-xs-10"> <vue-component-clipboard :text="instagramLink" class="button is-default is-fullwidth" :show-icon="false"><i class="fal fa-copy has-mr-1"></i>{{'Скопировать ссылку'|gettext}}</vue-component-clipboard> </div> <div class="col-xs-2"> <button class="button has-text-danger is-fullwidth" @click="unattach" :class="{'is-loading': isUnattaching}"><i class="fal fa-trash-alt"></i></button> </div> </div> </div> </section> <section v-if="is_installed && $account.nickname"> <div class="field"> <span class='has-text-success'><i class="fa fas fa-check-square"></i> {{'Ссылка установлена в Instagram.'|gettext}}</span> {{'Если вы поменяли никнейм в Instagram, нажмите кнопку "Обновить информацию" для того чтобы получить новую ссылку.'|gettext}} </div> <a @click="check" class="button is-instagram btn-flat" :class="{disabled: is_readonly, 'is-loading': isUpdating}"><i class="fab fa-ig" style="margin-right: 10px"></i> {{'Обновить информацию'|gettext}}</a> </section> <section v-else> <div v-if="!$account.nickname"> <div v-if="target == 'instagram_business'"> <label class="label">{{'Выберите профиль'|gettext}}</label> <b-table :data="profiles" hoverable bordered class="table-header-hide" @click="choose" v-if="_.size(profiles)" disabled="isUpdating"> <template slot-scope="props"> <b-table-column field="name" style="vertical-align:middle"> <div class="media" style="align-items: center"> <img :src="props.row.picture" class="profile-avatar profile-avatar-48 media-left"> <div class="media-content"><b>{{props.row.name}}</b><div class="has-text-grey">@{{props.row.username}}</div></div> </div> </b-table-column> </template> </b-table> </div> <div v-else> <div v-if="prepare"> <div class="has-text-centered has-mb-3"> <img :src="prepare.picture" class="profile-avatar profile-avatar-65"> <h4>{{prepare.username}}</h4> </div> <div class="row row-small"> <div class="col-xs-12 col-sm-5 col-sm-offset-1"> <button @click="confirmAttach" class="button is-primary has-xs-mb-2 is-fullwidth">{{'Подключить этот профиль'|gettext}}</button> </div> <div class="col-xs-12 col-sm-5"> <button @click="attachAnotherProfile" class="button is-danger is-fullwidth">{{'Войти под другим профилем'|gettext}}</button> </div> </div> </div> <div v-else> <label class="label">{{'Подключить Instagram профиль'|gettext}}</label> <div class="has-mb-2"> {{'Для подключения Instagram профиля вам необходимо авторизоваться через Instagram'|gettext}} </div> <div class="has-mb-4"> <a class="button is-instagram" :class="{disabled: is_readonly, 'is-loading': isButtonLoading== 'instagram'}" @click="isButtonLoading = 'instagram'" href="/login/instagrambasic/?method=attach"><i class="fab fa-ig has-mr-2"></i>{{'Подключить через Instagram'|gettext}}</a> </div> </div> </div> </div> <div v-else> <div v-if="!is_installed"> <div class="media"> <div class="media-left"><span class="tag is-warning">2</span></div> <div class="media-content"> <label class="label has-mb-2">{{'Вставьте её в раздел "Веб-Сайт" в настройках профиля Instagram'|gettext}}</label> </div> </div> <div class='has-sm-mb-4 has-sm-pt-4 device-pictures-form marvel-device-install'> <center style="line-height:0"> <div class="device has-shadow is-large is-hide-mobile" style="margin: 0 auto"> <div class="screen page-font" style="overflow: hidden"> <img style="max-width:100%;margin:0 auto;display: block" :src="'/s/i/taplink-install.{1}.png'|format(window.i18n.locale)"> </div> </div> <div class='form-shadow form-shadow-bottom is-hidden-mobile' style="height: 20px"></div> </center> </div> <div><a href='https://www.instagram.com/accounts/edit/' target="_blank" style="display: block;padding-top: 10px;text-align: center">{{'Открыть настройки Instagram'|gettext}}</a></div> </div> </div> </section> <section class="message is-info" v-if="$account.nickname && !is_installed"> <div class="message-body"> <label class="label">{{'Если вы поменяли имя пользователя в Instagram'|gettext}}</label> <div>{{'Нажмите на ссылку'|gettext}} "<a @click="check" :class="{disabled: isUpdating}">{{'Обновить информацию'|gettext}}</a>" {{'для того чтобы обновить информацию из Instagram. Система увидит новое имя пользователя и предложит обновить ссылку.'|gettext}}</div> </div> </section> </div> </div> <div class="is-title" @click="toggleTab('domain')" :class="{in: activeTab== 'domain'}"> <span><i class="fal fa-chevron-right has-mr-2"></i>{{'Доменное имя'|gettext}}</span> </div> <div> <div> <section> <transition name="fade"> <div class="label-pro-container"> <div v-if="!$auth.isAllowTariff('business')" class="tag is-business" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна на Business тарифе'|gettext">biz</div> <label class="label has-mb-2">{{'Вы можете подключить свой домен к странице'|gettext}}</label> <vue-component-domain-attach :disabled="is_readonly"></vue-component-domain-attach> </div> </transition> </section> </div> </div> <div class="is-title" @click="toggleTab('qr')" :class="{in: activeTab== 'qr'}"> <span><i class="fal fa-chevron-right has-mr-2"></i>{{'QR-код'|gettext}}</span> </div> <div> <div> <section class="message is-info"><div class="message-body">{{'Вы можете скачать и использовать ваш QR-код на визитках или флайерах'|gettext}}</div></section> <section> <transition name="fade"> <vue-component-qrcode :value="$account.link_safe"></vue-component-qrcode> </transition> </section> </div> </div> <div class="is-title" @click="toggleTab('widget')" :class="{in: activeTab== 'widget', 'is-last-tab': activeTab != null}"> <span><i class="fal fa-chevron-right has-mr-2"></i>{{'Виджет на сайт'|gettext}}</span> </div> <div> <div> <section> <label class='label'>{{'Скопируйте код и разместите его в HTML-разметке вашего сайта'|gettext}}</label> <div class="field has-addons"> <div class="control is-expanded"><input class="input" onfocus="this.select()" readonly="on" :value="widgetCode"></div> <div class="control"> <vue-component-clipboard :text="widgetCode" class="button is-default" :show-icon="false"><i class="fal fa-copy has-mr-1"></i>{{'Скопировать'|gettext}}</vue-component-clipboard> </div> </div> <div class="field has-mb-4"> <label class='label'>{{'Цвет кнопки'|gettext}}</label> <vue-component-colorpicker colors='#F7464A,#e600a3,#1fb6ff,#1EB363,#4f5a67' v-model="widget.color" @input="onWidgetChanged" position="is-bottom-right" :disabled="is_readonly"></vue-component-colorpicker> </div> <div class="row"> <div class="col-xs-12 col-sm-6"> <div class="field"> <label class='label'>{{'Расположение кнопки'|gettext}}</label> <label class="radio is-block has-mb-1" v-for="(v, k) in variants.widget_button_placement"><input type="radio" name='widget_button_placement' :value="k" v-model="widget.placement" @change="onWidgetChanged" :disabled="is_readonly"> {{v}}</label> </div> </div> <div class="col-xs-12 col-sm-6"> <div class="field"> <label class='label'>{{'Вид окна'|gettext}}</label> <label class="radio is-block has-mb-1" v-for="(v, k) in variants.widget_button_view"><input type="radio" name='widget_button_view' :value="k" v-model="widget.view" @change="onWidgetChanged" :disabled="is_readonly"> {{v}}</label> </div> </div> </div> </section> </div> </div> </div> </section> <footer class="modal-card-foot"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("index", "vue-index-footer", {methods: {
			checkUrlPrefix(s) {
				return window.base_path_prefix + s;
			}
		}, template: `<footer class="is-hidden-mobile"> <div class="container"> <div class="level"> <div class="level-left"> <a :href="checkUrlPrefix('/guide/')">{{'Подробные инструкции'|gettext}}</a> <a :href="checkUrlPrefix('/faq/')">{{'Вопросы и ответы'|gettext}}</a> <a @click="Intercom('show')">{{'Задать вопрос'|gettext}}</a> <a :href="checkUrlPrefix('/tariffs/')">{{'Цены и тарифы'|gettext}}</a> </div> <div class="level-right"> <vue-component-locale-change></vue-component-locale-change> </div> </div> </div> </footer>`});

window.$app.defineComponent("index", "vue-index-index", {data() {
			return {
				isAuth: false,
				current: null
			}
		},
		
		computed: {
			isShow() {
				return this.current && (((this.current.name == 'main') && this.isAuth) || (this.current.name != 'main'));
			}
		},

		created() {
			window.$events.on('navigate', this.navigate);
			this.navigate(null, this.$router.currentRoute);
			
			if (this.$account.profile_id == undefined) {
				if (this.$router.currentRoute.name == 'index') {
					window.$events.one('account:refresh', () => {
						this.$router.replace({name: 'pages', params: {page_id: this.$account.page_id}});
/*
						if (this.$account.user.email || 1) {
							this.$router.replace({name: 'pages', params: {page_id: this.$account.page_id}});
						} else {
							this.$router.replace({name: 'email'});
						}
*/
					});
				}

				this.$auth.refresh(null, null, () => {
					// Если ссылка была на внутреннюю страницу - созраняем ее в куках
					let location = document.location.href;
	
					if (location.indexOf('/auth/') == -1) {
						Cookies.set('auth-redirect', location);
					} else {
						Cookies.remove('auth-redirect');
					}
				});
			} else {
				this.isAuth = true;
			}
			
			window.$events.on('account:refresh', () => {
				if (!this.$account.user.email) return this.$router.replace({name: 'email'});
				this.isAuth = true;
			});
			
			this.$io.on('events:account:logout', this.logout);
			window.$events.on('account:logout', this.logout);

			this.$io.on('events:avatar:updated', this.avatarUpdated);
			
			let mainBlock = $mx('.main-block');
			
			mainBlock.on("scroll", (e) => {
				$mx(document.body).toggleClass('is-scrolled', mainBlock[0].scrollTop > 20);
			});
		},
		
		mounted() {
			window.scrollTo(0, 1);
		},
		
		destroyed() {
			window.$events.off('navigate', this.navigate);
			this.$io.off('events:account:logout', this.logout);
			this.$io.off('events:avatar:updated', this.avatarUpdated);
		},

		methods: {
			avatarUpdated(data) {
				this.$account.avatar.url = '//'+this.$account.storage_domain+data.pathname;
			},
			
			navigate(e, to) {
				this.current = to?((to.matched.length > 1)?to.matched[1]:to):null;
			},

			logout() {
				this.isAuth = false;
				this.$account.profile_id = null;				
				if (['main', 'index'].indexOf(this.current.name) != -1) this.$router.replace({name: 'signin'});
			}
		}, template: `<router-view v-if="isShow" :class="{'has-auth':isAuth}"></router-view>`});

window.$app.defineComponent("index", "vue-index-main", {data() {
			return {
				connection: 1,
				connectionTimer: null,
				online: true,
				isMounted: false
			}
		},
		props: ['page_id'],
		
		created() {
			$mx(window).on('online offline', this.updateIndicator);
			this.$events.on('theme:refresh', this.themeRefresh);
		},
		mounted() {
			this.isMounted = true;
			this.themeRefresh();	
		},
		destroyed() {
			$mx(window).off('online offline', this.updateIndicator);
			this.$events.off('theme:refresh', this.themeRefresh);
			this.isMounted = false;
		},
		methods: {
			themeRefresh() {
				if (this.isMounted) {
					StylesFactory.updateCSSBlock(this.$account.styles/* Object.assign({_:[this.$account.styles]}, this.$account.styles )*/, this.$refs.styles);
				}
			},
			updateIndicator() {
				this.online = navigator.onLine;
				
				if (this.online) {
					if (this.connectionTimer) {
						clearInterval(this.connectionTimer);
						this.connectionTimer = null;
					}
					$mx('html').removeClass('is-clipped');
				} else {
					this.connectionTimer = setInterval(() => {
						this.connection++;
						if (this.connection == 5) this.connection = 1;
					}, 1000);
					
					$mx('html').addClass('is-clipped');
				}

			},
			navigate(e, to) {
				this.current = to?((to.matched.length > 1)?to.matched[1]:to):null;
			}
		}, template: `<div style="display: flex;flex-direction: column;flex-shrink:0;flex-grow: 1"> <div ref='styles'></div> <vue-index-menu :page_id="page_id"></vue-index-menu> <router-view style="flex-grow: 1"></router-view> <vue-index-footer></vue-index-footer> <div class="network-status" v-if="!online"> <div class="network-status-icon"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"> <g class="fa-group" v-if="connection == 1"><path class="fa-secondary" fill="currentColor" d="M634.9 154.9C457.7-9 182.2-8.9 5.1 154.9c-6.4 6-6.8 16-.9 22.5.2.2.3.4.5.5l34.2 34c6.2 6.1 16 6.2 22.4.4 145.9-133.7 371.3-133.7 517.2 0 6.4 5.9 16.2 5.7 22.4-.4l34.2-34c6.3-6.2 6.3-16.2.2-22.5 0-.2-.2-.4-.4-.5zM522.7 268.4c-115.3-101.9-290.2-101.8-405.3 0-6.5 5.8-7.1 15.8-1.4 22.3.3.3.5.6.8.8l34.4 34c6 5.9 15.6 6.3 22.1.8 83.9-72.6 209.7-72.4 293.5 0 6.4 5.5 16 5.2 22-.8l34.4-34c6.2-6.1 6.4-16.1.3-22.4-.3-.2-.5-.4-.8-.7z"></path><path class="fa-primary" fill="currentColor" d="M320 352c35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64 28.7-64 64-64z"></path></g> <g class="fa-group" v-if="connection != 1"><path :class="{'fa-secondary': connection== 2 || connection== 4, 'fa-primary': connection== 3}" fill="currentColor" d="M635.3 177.9l-34.2 34c-6.2 6.1-16 6.2-22.4.4-146-133.7-371.3-133.7-517.2 0-6.4 5.9-16.2 5.7-22.4-.4l-34.2-34-.5-.5c-6-6.4-5.6-16.5.9-22.5C182.2-8.9 457.7-9 634.9 154.9c.2.2.4.3.5.5 6.2 6.3 6.1 16.3-.1 22.5z"></path><path class="fa-primary" fill="currentColor" d="M320 352c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm203.5-82.8l-.8-.8c-115.3-101.9-290.2-101.8-405.3 0-6.5 5.8-7.1 15.8-1.4 22.3.3.3.5.6.8.8l34.4 34c6 5.9 15.6 6.3 22 .8 84-72.6 209.7-72.4 293.5 0 6.4 5.5 16 5.2 22-.8l34.4-34c6.4-6 6.5-16 .4-22.3z"></path></g> </svg> </div> <h2 class="has-mb-2 has-text-centered">{{'Отсутствует соединение'|gettext}}</h2> <h3 class="has-text-centered">{{'Убедитесь, что ваше устройство подключено к интернету'|gettext}}</h3> </div> </div>`});

window.$app.defineComponent("index", "vue-index-menu", {data() {
			return {
				favourites: [],
				standalone: window.standalone,
				title: '',
// 				kurs: false,
				currentRoute: null,
				menuOpened: false
			}
		},
		
		props: {'page_id': Number},
		
		created() {
			this.fillTitle(this.currentRoute = this.$router.currentRoute);

			
			window.$events.on('navigate', (e, to) => {
				this.fillTitle(this.currentRoute = to);
				this.moveSubmenu(to.name);
			});
			
			$mx(document.body).on('touchstart', this.onTouchStart);			
		},
		
		computed: {
			currentSubmenu() {
				if (this.currentRoute.matched.length < 3) return null;

				let submenu = this.$router.getRoute({name: this.currentRoute.matched[2].name});
				let result = (submenu && submenu.children != undefined && (submenu.meta == undefined || submenu.meta.submenu == undefined || submenu.meta.submenu))?this.$auth.prepareMenu(submenu.children):null;
				
				let findChildrens = (item) => {
					if (this.currentRoute.name == item.name) return true; 
					if (item.children && item.children.length) for (j = 0; j < item.children.length; j++) if (findChildrens(item.children[j])) return true;
					return false;
				}
				
				if (result) {
					let found = false;
					for (i = 0; i < result.length; i++) {
						if (findChildrens(result[i])) {
							found = true;
							break;
						}
					}

					if (!found) {
						this.$router.replace(result[0]);
					}
				}

				return result;
			},
			
			ratePlanLink() {
				return window.base_path_prefix+'/tariffs/';
			},
			
			tariffEndsMessage() {
				return this.$format(this.$gettext('Через {1} истекает срок действия вашего тарифа, вам необходимо <a href="{2}">продлить ваш тариф</a>'), this.$plural('день', this.$account.tariff_ends_days), this.ratePlanLink);
			}
		},

		mounted() {
			this.$io.on('events:menu.hits:changed', this.changedHits);
			this.$io.on('events:system:updated', this.updatedSystem);
			this.$io.on('events:profiles.favourites:refresh', this.refreshFavourites);
			
			NativeApplication.setBadge(this.calcHits());
			this.moveSubmenu(this.currentRoute.name, 0);
			
			window.$events.on('account:refresh', this.accountRefresh);
			window.$events.on('account:logout', this.accountLogout);
			window.$events.on('menu:close', () => {
				$mx('.projects-menu').css('pointer-events', 'none');
				this.menuOpened = false;
				setTimeout(function() { $mx('.projects-menu').css('pointer-events', 'all'); }, 50);
			});
		},
		
		destroyed() {
			this.$io.off('events:menu.hits:changed', this.changedHits);
			this.$io.off('events:system:updated', this.updatedSystem);
			this.$io.off('events:profiles.favourites:refresh', this.refreshFavourites);
			
			window.$events.off('account:refresh', this.accountRefresh);
			window.$events.off('account:logout', this.accountLogout);

			$mx(document.body).off('touchstart', this.onTouchStart);			
		},
		
		methods: {
			isActiveMenu(m) {
				for (i = this.currentRoute.matched.length - 1; i >= 0; i--) if (this.currentRoute.matched[i].name == m.name) return true;
				return false;	
			},
			moveSubmenu(name, duration = 300) {
				if (this.currentSubmenu == null) return;
				
				
				this.$nextTick(() => {
					let _walk = (list, name, i) => {
						let result = null;
						for (let k = 0; k < list.length; k++) {
							let item = list[k];
							let y = (i != undefined)?i:k;
							if (item.name == name) return y;
							if (item.children != undefined && item.children.length) {
								result = _walk(item.children, name, y);
								if (result != null) return result;
							}
						}
						
						return null;
					}
									
					let current = _walk(this.currentSubmenu, name);
					
					if (current !== null) {
						if (this.$refs.submenu != undefined) {
							let o = this.$refs.submenu.children[current];
							scrollIt(o.offsetLeft - ((this.$refs.submenu.offsetWidth - o.offsetWidth) / 2), 'x', this.$refs.submenu, duration)
						}
					}
				});
			},
			accountRefresh() {
				NativeApplication.setBadge(this.calcHits());
			},
			accountLogout() {
				NativeApplication.setBadge(null);
			},
			startTouchSubmenu() {
				$mx('html').addClass('is-dragging');
			},
			stopTouchSubmenu() {
				$mx('html').removeClass('is-dragging');
			},
			isXs() {
				return window.matchMedia("(max-width: 767px)").matches?true:false;
			},
			onTouchStart(o) {
				var t = $mx(o.target);
				if ($mx('html').is('.is-dragging') || $mx('html').is('.is-clipped') || t.closest('.b-slider').length) return;

				if (!this.isXs()) return;
				
				var resp = t.closest('.main');
				var is_stop = resp.length;
		
				var maxX = screen.width / 100 * 85;
				var startX = o.touches[0].pageX;
				var startY = o.touches[0].pageY;
				var startMenu = $mx('html').is('.open-menu')?maxX:0;
				var delta = 0;
				var startTime = 0;
				
				if (is_stop) {
					var startRespScroll = resp.data('scroll-x');
					is_stop = startRespScroll < -50;
				}
				
				var oo = $mx('.main');
				var is_started = false;
				var is_started_y = false;
				var x = 0;
			
				if (!is_stop) {
					function touchMove(e) {
						if ($mx('html').is('.is-dragging')) return;
						
						x = e.touches[0].pageX;
						y = e.touches[0].pageY;
						
						if (!is_started_y && (is_started || Math.abs(x - startX) > 45)) {
							delta = x - startX + startMenu;
			
							if (is_stop && delta > 0) is_stop = false;
							if (delta < 0 && resp.length) is_stop = true;
							
							if (!is_stop) {
								if (!is_started) {
									oo.addClass('stop-transition');
									is_started = true;
									startTime = e.timeStamp;
								}
								oo.css('transform', 'translate3d('+Math.min(Math.max(0, delta), maxX)+'px,0,0)')
							}
						}
						
						if (!is_started && Math.abs(y - startY) > 45) {
							is_started_y = true;
						}
					}
					
					t.on('touchmove', touchMove).one('touchend', (e) => {
						t.off('touchmove', touchMove);
						
						if (is_started) {
							oo.removeClass('stop-transition');
							$mx('.main-block').removeClass('disable-pointer-events')
		
							var time = e.timeStamp - startTime;
							var velocityX = Math.abs(x - startX) / time;
							var v = 0;
			
							if (velocityX > 0.4) {
								v = (x - startX) > 0;
							} else {
								v = delta > screen.width / 2;
							}
							
							setTimeout(() => {
								oo.css('transform', '')
								this.menuOpen(null, v);
							}, 0);
							
							is_started = false;
						}
						
						is_started_y = false;
					});
				}
			},
			
			fillTitle(to) {
				let title = null;
				for (var i = to.matched.length - 1; i > 0; i--) {
					if (to.matched[i].meta != undefined && to.matched[i].meta.title != undefined) title = to.matched[i].meta.title;
				}

				this.title = title;
			},
			
			changedHits(m) {
				this.$account.hits = _.merge(this.$account.hits, m);
				NativeApplication.setBadge(this.calcHits());
			},
			
			updatedSystem() {
				this.$confirm(this.$gettext('Произошло обновление системы, необходимо перезагрузить страницу'), 'is-danger').then(() => {
					document.location.reload();
				});
			},
			
			menuOpen(e, v) {
				if (v == undefined) v = !$mx('html').is('.open-menu');
				
				$mx('html').toggleClass('open-menu', v);
				
				if (v) $mx('.main').one('click', () => {
					$mx('html').removeClass('open-menu');
				});
				
/*
				let o = document.getElementsByTagName('html')[0];
				if (o.className.indexOf('open-menu') != -1) {
					o.className = o.className.replace(' open-menu', '');
				} else {
					o.className += ' open-menu';
				}
*/
			},
			
			refreshFavourites() {
				this.$api.get('account/favourites').then((data) => {
					this.$account.favourites = data.response.favourites;
				});
			},
			
			checkViewBox(m) {
				return (m.icon_viewbox == undefined)?'0 0 512 512':m.icon_viewbox;
			},
			
			prepareHits(m) {
				return (this.calcHits(m)?' menu-hits':'');
			},
			
			calcHits(m) {
				let hits = 0;

				let sum = (items) => {
					let v = 0;
					for (var i in items) {
						if (typeof items[i] == 'object') {
							v += sum(items[i]);
						} else {
							v += items[i];
						}
					}
					
					return v;
				}
				
				if (m != undefined) {
					if (this.$account.hits[m.name]) hits = sum(this.$account.hits[m.name]);
				} else {
					_.each(this.$account.hits, (v) => {
						hits += sum(v);
					});
				}
				
				return hits;
			},
			
			prepareIcon(m) {
				return m.meta.icon + this.prepareHits(m);
			},
			
			click(e) {
				if (window.standalone) go($mx(e.target).closest('a').attr('href'));
				this.$auth.closeMenu();
			},
			
			submenuClick(e) {
				let o = $mx(e.target.parentNode);
//				scrollIt(e.target.offsetLeft - ((e.target.parentNode.offsetWidth - e.target.offsetWidth) / 2), 'x', e.target.parentNode)
			},
			
			logout() {
				this.$api.get('auth/logout').then((data) => {
					if (data.result == 'success') {
						this.$auth.closeMenu();
						
						if (data.response != undefined) {
							this.$auth.refresh(data.response, () => {
								this.$router.replace({name: 'pages', params: {page_id: this.$account.page_id}});	
							});
						} else {
							this.$account.profile_id = null;
							window.$events.fire('account:logout');
						}
					}
				})
			}
		}, template: `<div> <a class="message has-text-centered" :href="ratePlanLink" v-if="!$auth.isAllowTariff('pro') && window.$promotion" style="background: #000;color: #fff;font-size: 110%;margin: 0;border-radius: 0;text-decoration:none;padding: .7rem 0;z-index:1;display:block" v-html="window.$promotion.promotion_message"></a> <header class="is-top is-auth"> <div class="container"> <div> <a @click.stop="menuOpen" class="menu-btn"><i class="fal fa-bars"></i><i :class="prepareHits()"></i></a> <span @click.stop="menuOpen" class="menu-title">{{title|gettext}}</span> <div class="scrolling-container"> <div> <div class="menu"> <router-link v-for="(m, index) in $auth.prepareMenu($router.getRoute({name: 'main'}).children)" :key="index" :to="{name: m.name, params: { page_id: page_id }}" :class="{active: isActiveMenu(m)}" v-if="m.meta && (m.meta.icon || m.meta.icon_svg)" @click.native="click"><svg :viewBox="checkViewBox(m.meta)" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" v-if="m.meta.icon_svg != undefined" v-html="m.meta.icon_svg"></svg><i :class="prepareHits(m)"></i><em :class="prepareIcon(m)" v-else></em><span>{{m.meta.title|gettext}}</span><dd :data-value="calcHits(m)" v-if="calcHits(m)"></dd></router-link> </div> </div> </div> <div class="header-choose-profile"> <div class="a projects-menu" :class="{in: menuOpened}"> <div @click.prevent.stop="menuOpened = false" class="background"></div> <div class="d" @click="if (isXs()) menuOpened=true"><img :src='$account.avatar.url' class="avatar"><i class="fa fa-angle-down is-hidden-mobile has-ml-1"></i></div> <div class="ul"> <div class="li is-first"><router-link :to="{name: 'profiles', params: {page_id: page_id}}" @click.native="click">{{'Мои профили'|gettext}}</router-link></div> <div class="li divider" v-if="$account.favourites.length"></div> <div class="menu-favourites"> <div v-for="f in $account.favourites" class="li"><a class='profile' @click="$auth.changeProfile(f.profile_id)"><i class="fa fa-share-alt" v-if="f.is_share"></i><dd>{{f.nickname}}</dd></a></div> </div> <div class="li divider"></div> <div class="li"><router-link :to="{name: 'access', params: {page_id: page_id}}" @click.native="click">{{'Совместный доступ'|gettext}}</router-link></div> <div class="li divider"></div> <div class="li"><router-link :to="{name: 'account-settings', params: {page_id: page_id}}" @click.native="click">{{'Настройки аккаунта'|gettext}}</router-link></div> <div v-if="$account.manager_id"> <div class="li divider"></div> <div class="li"><router-link :to="{name: 'manager', params: {page_id: page_id}}" @click.native="click">{{'Администрирование'|gettext}}</router-link></div> </div> <div v-if="$account.partner_id && $account.partner.percent"> <div class="li divider"></div> <div class="li"><router-link :to="{name: 'partner', params: {page_id: page_id}}" @click.native="click">{{'Партнерская программа'|gettext}}</router-link></div> </div> <div class="li divider"></div> <div><a :href="ratePlanLink">{{'Цены и тарифы'|gettext}}</a></div> <div class="li divider"></div> <div class="li is-last"><a @click="logout">{{'Выход'|gettext}}</a></div> </div> </div> </div> </div> </div> </header> <em></em> <div class="message is-warning alert-header" v-if="!$auth.isAllowTariff('pro')"><i class='fa fa-star-o'></i> {{'У вас базовый тариф'|gettext}}, <a :href='ratePlanLink' class="text-black">{{'обновить тариф'|gettext}}</a></div> <div v-else> <div class="message is-danger alert-header" v-if="$account.tariff_ends && $account.tariff_ends_days> 0 && $account.tariff_ends_days < 14"><i class='fa fa-exclamation-triangle'></i> <span v-html="tariffEndsMessage"></span></div> </div> <div class="top-panel" v-if="currentSubmenu"> <div class="container"> <div class="scrolling-container is-submenu" @touchstart="startTouchSubmenu" @touchend="stopTouchSubmenu"> <div ref="submenu" style="overflow-x: scroll"> <router-link :to="{name: m.name, params: {page_id: page_id}}" v-for="m in currentSubmenu" class="button":class="{active: isActiveMenu(m)}" @click.native="submenuClick">{{m.meta.title|gettext}}</router-link> <a class="button" style="pointer-events: none;visibility: hidden;padding-left: 70px"></a> </div> </div> </div> </div> </div>`});
window.$app.defineModule("index", [{ path: '/', component: 'vue-index-index', name: 'index', children: [ 
	
	{ path: '/auth/', redirect: 'auth/signin/', name: 'auth', children: [
		{ path: 'signin/', component: 'vue-auth-signin', name: 'signin' },
		{ path: 'email/', component: 'vue-auth-email', name: 'email' },
		{ path: 'restore/', component: 'vue-auth-restore', name: 'restore' },
		{ path: 'attach/', component: 'vue-auth-attach', name: 'attach' }
	] },
	
	{ path: '/:page_id/', props: true, component: 'vue-index-main', name: 'main', feature: 'taplink', children: [
		{ path: 'account/', redirect: 'account/settings/', name: 'account', meta: {title: 'Аккаунт'}, children: [
			{ path: 'profiles/', component: 'vue-account-profiles-list', props: true, name: 'profiles', meta: {title: 'Мои профили'}},
			{ path: 'access/', props: true, redirect: 'access/main/', name: 'access', meta: {title: 'Совместный доступ'}, children: [
				{ path: 'main/', component: 'vue-account-access-list', props: {part: 'main'}, name: 'access-main'},
				{ path: 'shared/', component: 'vue-account-access-list', props: {part: 'shared'}, name: 'access-shared'}
			]},
			{ path: 'settings/', component: 'vue-account-settings-form', props: true, name: 'account-settings', meta: {title: 'Настройки аккаунта'}}
		]},

		{ path: 'pages/', component: 'vue-pages-page', props: true, name: 'pages', meta: { title: 'Страница', icon_svg: '<path d="M76 160h40a12 12 0 0 0 12-12v-40a12 12 0 0 0-12-12H76a12 12 0 0 0-12 12v40a12 12 0 0 0 12 12zM0 224v208a48 48 0 0 0 48 48h416a48 48 0 0 0 48-48V224z" class="fa-secondary"/><path d="M464 32H48A48 48 0 0 0 0 80v144h512V80a48 48 0 0 0-48-48zM128 148a12 12 0 0 1-12 12H76a12 12 0 0 1-12-12v-40a12 12 0 0 1 12-12h40a12 12 0 0 1 12 12zm320 0a12 12 0 0 1-12 12H188a12 12 0 0 1-12-12v-40a12 12 0 0 1 12-12h248a12 12 0 0 1 12 12z"/>', tariff: 'basic', feature: 'taplink' }},
		{ path: 'statistics/', component: 'vue-statistics-list', props: true, name: 'statistics', meta: { title: 'Статистика', icon_svg: '<path d="M512 400v32a16 16 0 0 1-16 16H32a32 32 0 0 1-32-32V80a16 16 0 0 1 16-16h32a16 16 0 0 1 16 16v304h432a16 16 0 0 1 16 16z" class="fa-secondary"/><path d="M275.2 96h-38.4c-6.4 0-12.8 6.4-12.8 12.8v198.4c0 6.4 6.4 12.8 12.8 12.8h38.4c6.4 0 12.8-6.4 12.8-12.8V108.8c0-6.4-6.4-12.8-12.8-12.8zm-96 128h-38.4c-6.4 0-12.8 6.4-12.8 12.8v70.4c0 6.4 6.4 12.8 12.8 12.8h38.4c6.4 0 12.8-6.4 12.8-12.8v-70.4c0-6.4-6.4-12.8-12.8-12.8zm288-160h-38.4c-6.4 0-12.8 6.4-12.8 12.8v230.4c0 6.4 6.4 12.8 12.8 12.8h38.4c6.4 0 12.8-6.4 12.8-12.8V76.8c0-6.4-6.4-12.8-12.8-12.8zm-96 96h-38.4c-6.4 0-12.8 6.4-12.8 12.8v134.4c0 6.4 6.4 12.8 12.8 12.8h38.4c6.4 0 12.8-6.4 12.8-12.8V172.8c0-6.4-6.4-12.8-12.8-12.8z"/>', icon_viewbox: '0 0 562 512', tariff: 'basic', access: 64, feature: 'taplink' }},
		{ path: 'billing/', component: 'vue-billing-index', props: true, name: 'billing'},


		{ path: 'inbox/', component: 'vue-inbox-index', props: true, name: 'typebot-inbox', meta: {title: 'Диалоги', icon_svg: '<g class="fa-group"><path class="fa-secondary" d="M448 0H64A64.06 64.06 0 0 0 0 64v288a64.06 64.06 0 0 0 64 64h96v84a12 12 0 0 0 19.1 9.7L304 416h144a64.06 64.06 0 0 0 64-64V64a64.06 64.06 0 0 0-64-64zM128 240a32 32 0 1 1 32-32 32 32 0 0 1-32 32zm128 0a32 32 0 1 1 32-32 32 32 0 0 1-32 32zm128 0a32 32 0 1 1 32-32 32 32 0 0 1-32 32z"></path><path class="fa-primary"  d="M384 176a32 32 0 1 0 32 32 32 32 0 0 0-32-32zm-128 0a32 32 0 1 0 32 32 32 32 0 0 0-32-32zm-128 0a32 32 0 1 0 32 32 32 32 0 0 0-32-32z"></path></g>', icon_viewbox: '0 0 512 512', feature: 'typebot', submenu: false} },
		{ path: 'chatbots/', component: 'vue-chatbots-index', props: true, name: 'chatbots', meta: {title: 'Автоматизация', icon_svg: '<path class="fa-secondary" d="M149.333 56v80c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24h101.333c13.255 0 24 10.745 24 24zm181.334 240v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm32-240v80c0 13.255 10.745 24 24 24H488c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24zm-32 80V56c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm-205.334 56H24c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24zM0 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm386.667-56H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zm0 160H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zM181.333 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24z"></path>', icon_viewbox: '0 0 512 512', feature: 'typebot', submenu: false} },
		{ path: 'subscribers/', component: 'vue-subscribers-index', props: true, name: 'typebot-subscribers', meta: {title: 'Аудитория', icon_svg: '<path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path>', icon_viewbox: '0 0 640 512', feature: 'typebot1', submenu: false} },

		{ path: 'sales/', redirect: 'sales/leads/', props: true, name: 'sales', meta: {title: 'Заявки', icon_svg: '<path d="M0 432a48 48 0 0 0 48 48h480a48 48 0 0 0 48-48V256H0zm192-68a12 12 0 0 1 12-12h136a12 12 0 0 1 12 12v40a12 12 0 0 1-12 12H204a12 12 0 0 1-12-12zm-128 0a12 12 0 0 1 12-12h72a12 12 0 0 1 12 12v40a12 12 0 0 1-12 12H76a12 12 0 0 1-12-12zM528 32H48A48 48 0 0 0 0 80v48h576V80a48 48 0 0 0-48-48z" class="fa-secondary"/><path d="M576 256H0V128h576z"/>', icon_viewbox: '0 0 576 512', tariff: 'business', feature: 'crm', 'access': 4 }},
		{ path: 'products/', redirect: 'products/active/', props: true, name: 'products', meta: {title: 'Товары', icon_svg: '<path d="M551.64 286.8a102.1 102.1 0 0 0 16.4-3.6V480a32 32 0 0 1-32 32H88a32 32 0 0 1-32-32V283.2a125.76 125.76 0 0 0 16.4 3.6 134.93 134.93 0 0 0 18 1.2 132.48 132.48 0 0 0 29.5-3.8V384h384v-99.8a126.88 126.88 0 0 0 29.5 3.8 139.07 139.07 0 0 0 18.24-1.2z" class="fa-secondary"/><path d="M605.94 118.6c33.6 53.6 3.8 128-59 136.4a102.81 102.81 0 0 1-13.7.9 99.07 99.07 0 0 1-73.8-33.1 98.82 98.82 0 0 1-147.6 0 98.82 98.82 0 0 1-147.6 0 98.74 98.74 0 0 1-73.8 33.1 103.92 103.92 0 0 1-13.7-.9c-62.6-8.5-92.3-82.9-58.8-136.4L82.84 15a32 32 0 0 1 27.1-15h404A32 32 0 0 1 541 15z"/>', icon_viewbox: '0 0 618 512', tariff: 'business', feature: 'taplink,products', 'access': 16} },

		{ path: 'addons/', redirect: 'addons/all/', props: true, name: 'addons', meta: {title: 'Модули', icon_svg: '<path d="M12.41 236.31L70.51 210l161.63 73.27a57.64 57.64 0 0 0 47.72 0L441.5 210l58.09 26.33c16.55 7.5 16.55 32.5 0 40L266.64 381.9a25.68 25.68 0 0 1-21.29 0L12.41 276.31c-16.55-7.5-16.55-32.5 0-40z" class="fa-secondary"/><path d="M12.41 148l232.94 105.7a25.61 25.61 0 0 0 21.29 0L499.58 148c16.55-7.51 16.55-32.52 0-40L266.65 2.32a25.61 25.61 0 0 0-21.29 0L12.41 108c-16.55 7.5-16.55 32.52 0 40zm487.18 216.11l-57.87-26.23-161.86 73.37a57.64 57.64 0 0 1-47.72 0L70.29 337.88l-57.88 26.23c-16.55 7.5-16.55 32.5 0 40L245.35 509.7a25.68 25.68 0 0 0 21.29 0l233-105.59c16.5-7.5 16.5-32.5-.05-40z"/>', icon_viewbox: '0 0 582 512', feature: 'addons', submenu: false} },
		{ path: 'settings/', redirect: 'settings/design/', props: true, name: 'settings', meta: {title: 'Настройки', icon_svg: '<path d="M487.75 315.6l-42.6-24.6a192.62 192.62 0 0 0 0-70.2l42.6-24.6a12.11 12.11 0 0 0 5.5-14 249.2 249.2 0 0 0-54.7-94.6 12 12 0 0 0-14.8-2.3l-42.6 24.6a188.83 188.83 0 0 0-60.8-35.1V25.7A12 12 0 0 0 311 14a251.43 251.43 0 0 0-109.2 0 12 12 0 0 0-9.4 11.7v49.2a194.59 194.59 0 0 0-60.8 35.1L89.05 85.4a11.88 11.88 0 0 0-14.8 2.3 247.66 247.66 0 0 0-54.7 94.6 12 12 0 0 0 5.5 14l42.6 24.6a192.62 192.62 0 0 0 0 70.2l-42.6 24.6a12.08 12.08 0 0 0-5.5 14 249 249 0 0 0 54.7 94.6 12 12 0 0 0 14.8 2.3l42.6-24.6a188.54 188.54 0 0 0 60.8 35.1v49.2a12 12 0 0 0 9.4 11.7 251.43 251.43 0 0 0 109.2 0 12 12 0 0 0 9.4-11.7v-49.2a194.7 194.7 0 0 0 60.8-35.1l42.6 24.6a11.89 11.89 0 0 0 14.8-2.3 247.52 247.52 0 0 0 54.7-94.6 12.36 12.36 0 0 0-5.6-14.1zm-231.4 36.2a95.9 95.9 0 1 1 95.9-95.9 95.89 95.89 0 0 1-95.9 95.9z" class="fa-secondary"/><path d="M256.35 319.8a63.9 63.9 0 1 1 63.9-63.9 63.9 63.9 0 0 1-63.9 63.9z"/>', tariff: 'basic', 'access': 128}},
		{ path: 'partner/', redirect: 'partner/statistics/', component: 'vue-partner-index', props: true, name: 'partner', meta: {title: 'Партнерская программа', submenu: false}},
		{ path: 'manager/', redirect: 'manager/profiles/', props: true, name: 'manager'}
	]}
	
]}]);

window.$app.defineComponent("blocks", "vue-blocks-flipclock-countdown", {props: {countdown: Number, withDays: {type: Boolean, default: true}},
	
	data: () => ({
		timer: 0,
		time: null,
		i: 0,
		trackers: ['hours', 'minutes', 'seconds'],
		titles: {},
		numbers: [0,1],
		frame: null
	}),
	
	beforeDestroy(){
		if (window['cancelAnimationFrame']) cancelAnimationFrame(this.frame);
		if (this.timer) clearInterval(this.timer);
	},
	
	created() {
		this.titles = {days: this.$gettext('Дни'), hours: this.$gettext('Часы'), minutes: this.$gettext('Минуты'), seconds: this.$gettext('Секунды')};
		if (this.withDays) this.trackers.unshift('days');
		
		this.timer = setInterval(() => { if (this.countdown) this.countdown--; }, 1000);
		if (window['requestAnimationFrame']) this.update();
	},
	
	methods: {
		split(v) {
			return [v / 10 | 0, v % 10];
		},
	
		update() {
			this.frame = requestAnimationFrame(this.update.bind(this));
			if ( this.i++ % 10 ) { return; }
			
			
			let s = this.countdown;
			let d = Math.floor(s / (24*60*60));
			s -= d * (24*60*60);
			let h = Math.floor(s / (60*60));
			s -= h * (60*60);
			let m = Math.floor(s / (60));
			s -= m * (60);	      
			
			this.time = {
				days: this.split(d),
				hours: this.split(h),
				minutes: this.split(m),
				seconds: this.split(s)
			}
		}
	}, template: `<div class="flipclock"> <div v-for="tracker in trackers"> <span class="flipclock__slot">{{titles[tracker]}}</span> <div v-if="time"> <vue-blocks-flipclock-tracker :time="time[tracker][i]" v-ref:trackers v-for="i in numbers"></vue-blocks-flipclock-tracker> <div class="flipclock-dots"><em></em><em></em></div> </div> </div> </div>`});

window.$app.defineComponent("blocks", "vue-blocks-flipclock-tracker", {props: ['time'],
		
		data: () => ({
			current: null,
			previous: null
		}),
		
		created() {
			this.update(this.time);
		},
		
		watch: {
			time(newValue) {
				if ( newValue === undefined ) return;
				this.update(newValue);
			}
		},
		
		methods: {
			update(newValue) {
				var val = newValue;
				
				val = ( val < 0 ? 0 : val );
				
				if ( val !== this.current || this.current === null ) {
					this.previous = (this.previous === null)?val:this.current;
					this.current = val;
					
					if (this.$el) {
						this.$el.classList.remove('flip');
						void this.$el.offsetWidth;
						this.$el.classList.add('flip');
					}
				}
			}
		}, template: `<span class="flipclock__piece"> <span class="flipclock__card flip-card"> <b class="flip-card__top">{{current}}</b> <b class="flip-card__bottom" :data-value="current"></b> <b class="flip-card__back" :data-value="previous"></b> <b class="flip-card__back-bottom" :data-value="previous"></b> </span> </span>`});