"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (let key of __getOwnPropNames(from2))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../node_modules/lib0/dist/map-24d263c0.cjs
var require_map_24d263c0 = __commonJS({
  "../node_modules/lib0/dist/map-24d263c0.cjs"(exports) {
    "use strict";
    var create5 = () => /* @__PURE__ */ new Map();
    var copy = (m) => {
      const r = create5();
      m.forEach((v, k) => {
        r.set(k, v);
      });
      return r;
    };
    var setIfUndefined2 = (map4, key, createT) => {
      let set2 = map4.get(key);
      if (set2 === void 0) {
        map4.set(key, set2 = createT());
      }
      return set2;
    };
    var map3 = (m, f) => {
      const res = [];
      for (const [key, value] of m) {
        res.push(f(value, key));
      }
      return res;
    };
    var any = (m, f) => {
      for (const [key, value] of m) {
        if (f(value, key)) {
          return true;
        }
      }
      return false;
    };
    var all = (m, f) => {
      for (const [key, value] of m) {
        if (!f(value, key)) {
          return false;
        }
      }
      return true;
    };
    var map$1 = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      create: create5,
      copy,
      setIfUndefined: setIfUndefined2,
      map: map3,
      any,
      all
    });
    exports.all = all;
    exports.any = any;
    exports.copy = copy;
    exports.create = create5;
    exports.map = map3;
    exports.map$1 = map$1;
    exports.setIfUndefined = setIfUndefined2;
  }
});

// ../node_modules/lib0/dist/set-5b47859e.cjs
var require_set_5b47859e = __commonJS({
  "../node_modules/lib0/dist/set-5b47859e.cjs"(exports) {
    "use strict";
    var create5 = () => /* @__PURE__ */ new Set();
    var toArray = (set3) => Array.from(set3);
    var first = (set3) => set3.values().next().value;
    var from2 = (entries) => new Set(entries);
    var set2 = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      create: create5,
      toArray,
      first,
      from: from2
    });
    exports.create = create5;
    exports.first = first;
    exports.from = from2;
    exports.set = set2;
    exports.toArray = toArray;
  }
});

// ../node_modules/lib0/dist/array-78849c95.cjs
var require_array_78849c95 = __commonJS({
  "../node_modules/lib0/dist/array-78849c95.cjs"(exports) {
    "use strict";
    var set2 = require_set_5b47859e();
    var last = (arr) => arr[arr.length - 1];
    var create5 = () => (
      /** @type {Array<C>} */
      []
    );
    var copy = (a) => (
      /** @type {Array<D>} */
      a.slice()
    );
    var appendTo = (dest, src) => {
      for (let i = 0; i < src.length; i++) {
        dest.push(src[i]);
      }
    };
    var from2 = Array.from;
    var every3 = (arr, f) => {
      for (let i = 0; i < arr.length; i++) {
        if (!f(arr[i], i, arr)) {
          return false;
        }
      }
      return true;
    };
    var some2 = (arr, f) => {
      for (let i = 0; i < arr.length; i++) {
        if (f(arr[i], i, arr)) {
          return true;
        }
      }
      return false;
    };
    var equalFlat2 = (a, b) => a.length === b.length && every3(a, (item, index) => item === b[index]);
    var flatten = (arr) => fold(
      arr,
      /** @type {Array<ELEM>} */
      [],
      (acc, val) => acc.concat(val)
    );
    var unfold2 = (len, f) => {
      const array2 = new Array(len);
      for (let i = 0; i < len; i++) {
        array2[i] = f(i, array2);
      }
      return array2;
    };
    var fold = (arr, seed, folder) => arr.reduce(folder, seed);
    var isArray2 = Array.isArray;
    var unique = (arr) => from2(set2.from(arr));
    var uniqueBy = (arr, mapper) => {
      const happened = set2.create();
      const result = [];
      for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        const mapped = mapper(el);
        if (!happened.has(mapped)) {
          happened.add(mapped);
          result.push(el);
        }
      }
      return result;
    };
    var map3 = (arr, mapper) => {
      const res = Array(arr.length);
      for (let i = 0; i < arr.length; i++) {
        res[i] = mapper(
          /** @type {any} */
          arr[i],
          i,
          /** @type {any} */
          arr
        );
      }
      return (
        /** @type {any} */
        res
      );
    };
    var bubblesortItem = (arr, i, compareFn) => {
      const n = arr[i];
      let j = i;
      while (j + 1 < arr.length && compareFn(n, arr[j + 1]) > 0) {
        arr[j] = arr[j + 1];
        arr[++j] = n;
      }
      if (i === j && j > 0) {
        while (j > 0 && compareFn(arr[j - 1], n) > 0) {
          arr[j] = arr[j - 1];
          arr[--j] = n;
        }
      }
      return j;
    };
    var array = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      last,
      create: create5,
      copy,
      appendTo,
      from: from2,
      every: every3,
      some: some2,
      equalFlat: equalFlat2,
      flatten,
      unfold: unfold2,
      fold,
      isArray: isArray2,
      unique,
      uniqueBy,
      map: map3,
      bubblesortItem
    });
    exports.appendTo = appendTo;
    exports.array = array;
    exports.bubblesortItem = bubblesortItem;
    exports.copy = copy;
    exports.create = create5;
    exports.equalFlat = equalFlat2;
    exports.every = every3;
    exports.flatten = flatten;
    exports.fold = fold;
    exports.from = from2;
    exports.isArray = isArray2;
    exports.last = last;
    exports.map = map3;
    exports.some = some2;
    exports.unfold = unfold2;
    exports.unique = unique;
    exports.uniqueBy = uniqueBy;
  }
});

// ../node_modules/lib0/dist/observable.cjs
var require_observable = __commonJS({
  "../node_modules/lib0/dist/observable.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map3 = require_map_24d263c0();
    var set2 = require_set_5b47859e();
    var array = require_array_78849c95();
    var ObservableV22 = class {
      constructor() {
        this._observers = map3.create();
      }
      /**
       * @template {keyof EVENTS & string} NAME
       * @param {NAME} name
       * @param {EVENTS[NAME]} f
       */
      on(name, f) {
        map3.setIfUndefined(
          this._observers,
          /** @type {string} */
          name,
          set2.create
        ).add(f);
        return f;
      }
      /**
       * @template {keyof EVENTS & string} NAME
       * @param {NAME} name
       * @param {EVENTS[NAME]} f
       */
      once(name, f) {
        const _f = (...args2) => {
          this.off(
            name,
            /** @type {any} */
            _f
          );
          f(...args2);
        };
        this.on(
          name,
          /** @type {any} */
          _f
        );
      }
      /**
       * @template {keyof EVENTS & string} NAME
       * @param {NAME} name
       * @param {EVENTS[NAME]} f
       */
      off(name, f) {
        const observers = this._observers.get(name);
        if (observers !== void 0) {
          observers.delete(f);
          if (observers.size === 0) {
            this._observers.delete(name);
          }
        }
      }
      /**
       * Emit a named event. All registered event listeners that listen to the
       * specified name will receive the event.
       *
       * @todo This should catch exceptions
       *
       * @template {keyof EVENTS & string} NAME
       * @param {NAME} name The event name.
       * @param {Parameters<EVENTS[NAME]>} args The arguments that are applied to the event listener.
       */
      emit(name, args2) {
        return array.from((this._observers.get(name) || map3.create()).values()).forEach((f) => f(...args2));
      }
      destroy() {
        this._observers = map3.create();
      }
    };
    var Observable2 = class {
      constructor() {
        this._observers = map3.create();
      }
      /**
       * @param {N} name
       * @param {function} f
       */
      on(name, f) {
        map3.setIfUndefined(this._observers, name, set2.create).add(f);
      }
      /**
       * @param {N} name
       * @param {function} f
       */
      once(name, f) {
        const _f = (...args2) => {
          this.off(name, _f);
          f(...args2);
        };
        this.on(name, _f);
      }
      /**
       * @param {N} name
       * @param {function} f
       */
      off(name, f) {
        const observers = this._observers.get(name);
        if (observers !== void 0) {
          observers.delete(f);
          if (observers.size === 0) {
            this._observers.delete(name);
          }
        }
      }
      /**
       * Emit a named event. All registered event listeners that listen to the
       * specified name will receive the event.
       *
       * @todo This should catch exceptions
       *
       * @param {N} name The event name.
       * @param {Array<any>} args The arguments that are applied to the event listener.
       */
      emit(name, args2) {
        return array.from((this._observers.get(name) || map3.create()).values()).forEach((f) => f(...args2));
      }
      destroy() {
        this._observers = map3.create();
      }
    };
    exports.Observable = Observable2;
    exports.ObservableV2 = ObservableV22;
  }
});

// ../node_modules/lib0/dist/array.cjs
var require_array = __commonJS({
  "../node_modules/lib0/dist/array.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require_set_5b47859e();
    var array = require_array_78849c95();
    exports.appendTo = array.appendTo;
    exports.bubblesortItem = array.bubblesortItem;
    exports.copy = array.copy;
    exports.create = array.create;
    exports.equalFlat = array.equalFlat;
    exports.every = array.every;
    exports.flatten = array.flatten;
    exports.fold = array.fold;
    exports.from = array.from;
    exports.isArray = array.isArray;
    exports.last = array.last;
    exports.map = array.map;
    exports.some = array.some;
    exports.unfold = array.unfold;
    exports.unique = array.unique;
    exports.uniqueBy = array.uniqueBy;
  }
});

// ../node_modules/lib0/dist/math-96d5e8c4.cjs
var require_math_96d5e8c4 = __commonJS({
  "../node_modules/lib0/dist/math-96d5e8c4.cjs"(exports) {
    "use strict";
    var floor2 = Math.floor;
    var ceil = Math.ceil;
    var abs2 = Math.abs;
    var imul = Math.imul;
    var round = Math.round;
    var log10 = Math.log10;
    var log2 = Math.log2;
    var log = Math.log;
    var sqrt = Math.sqrt;
    var add = (a, b) => a + b;
    var min2 = (a, b) => a < b ? a : b;
    var max2 = (a, b) => a > b ? a : b;
    var isNaN4 = Number.isNaN;
    var pow2 = Math.pow;
    var exp10 = (exp) => Math.pow(10, exp);
    var sign = Math.sign;
    var isNegativeZero2 = (n) => n !== 0 ? n < 0 : 1 / n < 0;
    var math = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      floor: floor2,
      ceil,
      abs: abs2,
      imul,
      round,
      log10,
      log2,
      log,
      sqrt,
      add,
      min: min2,
      max: max2,
      isNaN: isNaN4,
      pow: pow2,
      exp10,
      sign,
      isNegativeZero: isNegativeZero2
    });
    exports.abs = abs2;
    exports.add = add;
    exports.ceil = ceil;
    exports.exp10 = exp10;
    exports.floor = floor2;
    exports.imul = imul;
    exports.isNaN = isNaN4;
    exports.isNegativeZero = isNegativeZero2;
    exports.log = log;
    exports.log10 = log10;
    exports.log2 = log2;
    exports.math = math;
    exports.max = max2;
    exports.min = min2;
    exports.pow = pow2;
    exports.round = round;
    exports.sign = sign;
    exports.sqrt = sqrt;
  }
});

// ../node_modules/lib0/dist/math.cjs
var require_math = __commonJS({
  "../node_modules/lib0/dist/math.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var math = require_math_96d5e8c4();
    exports.abs = math.abs;
    exports.add = math.add;
    exports.ceil = math.ceil;
    exports.exp10 = math.exp10;
    exports.floor = math.floor;
    exports.imul = math.imul;
    exports.isNaN = math.isNaN;
    exports.isNegativeZero = math.isNegativeZero;
    exports.log = math.log;
    exports.log10 = math.log10;
    exports.log2 = math.log2;
    exports.max = math.max;
    exports.min = math.min;
    exports.pow = math.pow;
    exports.round = math.round;
    exports.sign = math.sign;
    exports.sqrt = math.sqrt;
  }
});

// ../node_modules/lib0/dist/map.cjs
var require_map = __commonJS({
  "../node_modules/lib0/dist/map.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map3 = require_map_24d263c0();
    exports.all = map3.all;
    exports.any = map3.any;
    exports.copy = map3.copy;
    exports.create = map3.create;
    exports.map = map3.map;
    exports.setIfUndefined = map3.setIfUndefined;
  }
});

// ../node_modules/lib0/dist/binary-ac8e39e2.cjs
var require_binary_ac8e39e2 = __commonJS({
  "../node_modules/lib0/dist/binary-ac8e39e2.cjs"(exports) {
    "use strict";
    var BIT1 = 1;
    var BIT2 = 2;
    var BIT3 = 4;
    var BIT4 = 8;
    var BIT5 = 16;
    var BIT6 = 32;
    var BIT72 = 64;
    var BIT82 = 128;
    var BIT9 = 256;
    var BIT10 = 512;
    var BIT11 = 1024;
    var BIT12 = 2048;
    var BIT13 = 4096;
    var BIT14 = 8192;
    var BIT15 = 16384;
    var BIT16 = 32768;
    var BIT17 = 65536;
    var BIT182 = 1 << 17;
    var BIT192 = 1 << 18;
    var BIT202 = 1 << 19;
    var BIT212 = 1 << 20;
    var BIT222 = 1 << 21;
    var BIT232 = 1 << 22;
    var BIT242 = 1 << 23;
    var BIT252 = 1 << 24;
    var BIT262 = 1 << 25;
    var BIT272 = 1 << 26;
    var BIT282 = 1 << 27;
    var BIT292 = 1 << 28;
    var BIT302 = 1 << 29;
    var BIT312 = 1 << 30;
    var BIT322 = 1 << 31;
    var BITS0 = 0;
    var BITS1 = 1;
    var BITS2 = 3;
    var BITS3 = 7;
    var BITS4 = 15;
    var BITS5 = 31;
    var BITS62 = 63;
    var BITS72 = 127;
    var BITS82 = 255;
    var BITS9 = 511;
    var BITS10 = 1023;
    var BITS11 = 2047;
    var BITS12 = 4095;
    var BITS13 = 8191;
    var BITS14 = 16383;
    var BITS15 = 32767;
    var BITS16 = 65535;
    var BITS172 = BIT182 - 1;
    var BITS182 = BIT192 - 1;
    var BITS192 = BIT202 - 1;
    var BITS202 = BIT212 - 1;
    var BITS212 = BIT222 - 1;
    var BITS222 = BIT232 - 1;
    var BITS232 = BIT242 - 1;
    var BITS242 = BIT252 - 1;
    var BITS252 = BIT262 - 1;
    var BITS262 = BIT272 - 1;
    var BITS272 = BIT282 - 1;
    var BITS282 = BIT292 - 1;
    var BITS292 = BIT302 - 1;
    var BITS302 = BIT312 - 1;
    var BITS312 = 2147483647;
    var BITS32 = 4294967295;
    var binary2 = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      BIT1,
      BIT2,
      BIT3,
      BIT4,
      BIT5,
      BIT6,
      BIT7: BIT72,
      BIT8: BIT82,
      BIT9,
      BIT10,
      BIT11,
      BIT12,
      BIT13,
      BIT14,
      BIT15,
      BIT16,
      BIT17,
      BIT18: BIT182,
      BIT19: BIT192,
      BIT20: BIT202,
      BIT21: BIT212,
      BIT22: BIT222,
      BIT23: BIT232,
      BIT24: BIT242,
      BIT25: BIT252,
      BIT26: BIT262,
      BIT27: BIT272,
      BIT28: BIT282,
      BIT29: BIT292,
      BIT30: BIT302,
      BIT31: BIT312,
      BIT32: BIT322,
      BITS0,
      BITS1,
      BITS2,
      BITS3,
      BITS4,
      BITS5,
      BITS6: BITS62,
      BITS7: BITS72,
      BITS8: BITS82,
      BITS9,
      BITS10,
      BITS11,
      BITS12,
      BITS13,
      BITS14,
      BITS15,
      BITS16,
      BITS17: BITS172,
      BITS18: BITS182,
      BITS19: BITS192,
      BITS20: BITS202,
      BITS21: BITS212,
      BITS22: BITS222,
      BITS23: BITS232,
      BITS24: BITS242,
      BITS25: BITS252,
      BITS26: BITS262,
      BITS27: BITS272,
      BITS28: BITS282,
      BITS29: BITS292,
      BITS30: BITS302,
      BITS31: BITS312,
      BITS32
    });
    exports.BIT1 = BIT1;
    exports.BIT10 = BIT10;
    exports.BIT11 = BIT11;
    exports.BIT12 = BIT12;
    exports.BIT13 = BIT13;
    exports.BIT14 = BIT14;
    exports.BIT15 = BIT15;
    exports.BIT16 = BIT16;
    exports.BIT17 = BIT17;
    exports.BIT18 = BIT182;
    exports.BIT19 = BIT192;
    exports.BIT2 = BIT2;
    exports.BIT20 = BIT202;
    exports.BIT21 = BIT212;
    exports.BIT22 = BIT222;
    exports.BIT23 = BIT232;
    exports.BIT24 = BIT242;
    exports.BIT25 = BIT252;
    exports.BIT26 = BIT262;
    exports.BIT27 = BIT272;
    exports.BIT28 = BIT282;
    exports.BIT29 = BIT292;
    exports.BIT3 = BIT3;
    exports.BIT30 = BIT302;
    exports.BIT31 = BIT312;
    exports.BIT32 = BIT322;
    exports.BIT4 = BIT4;
    exports.BIT5 = BIT5;
    exports.BIT6 = BIT6;
    exports.BIT7 = BIT72;
    exports.BIT8 = BIT82;
    exports.BIT9 = BIT9;
    exports.BITS0 = BITS0;
    exports.BITS1 = BITS1;
    exports.BITS10 = BITS10;
    exports.BITS11 = BITS11;
    exports.BITS12 = BITS12;
    exports.BITS13 = BITS13;
    exports.BITS14 = BITS14;
    exports.BITS15 = BITS15;
    exports.BITS16 = BITS16;
    exports.BITS17 = BITS172;
    exports.BITS18 = BITS182;
    exports.BITS19 = BITS192;
    exports.BITS2 = BITS2;
    exports.BITS20 = BITS202;
    exports.BITS21 = BITS212;
    exports.BITS22 = BITS222;
    exports.BITS23 = BITS232;
    exports.BITS24 = BITS242;
    exports.BITS25 = BITS252;
    exports.BITS26 = BITS262;
    exports.BITS27 = BITS272;
    exports.BITS28 = BITS282;
    exports.BITS29 = BITS292;
    exports.BITS3 = BITS3;
    exports.BITS30 = BITS302;
    exports.BITS31 = BITS312;
    exports.BITS32 = BITS32;
    exports.BITS4 = BITS4;
    exports.BITS5 = BITS5;
    exports.BITS6 = BITS62;
    exports.BITS7 = BITS72;
    exports.BITS8 = BITS82;
    exports.BITS9 = BITS9;
    exports.binary = binary2;
  }
});

// ../node_modules/lib0/dist/number-1fb57bba.cjs
var require_number_1fb57bba = __commonJS({
  "../node_modules/lib0/dist/number-1fb57bba.cjs"(exports) {
    "use strict";
    var math = require_math_96d5e8c4();
    var binary2 = require_binary_ac8e39e2();
    var MAX_SAFE_INTEGER2 = Number.MAX_SAFE_INTEGER;
    var MIN_SAFE_INTEGER2 = Number.MIN_SAFE_INTEGER;
    var LOWEST_INT322 = 1 << 31;
    var HIGHEST_INT32 = binary2.BITS31;
    var HIGHEST_UINT32 = binary2.BITS32;
    var isInteger2 = Number.isInteger || ((num) => typeof num === "number" && isFinite(num) && math.floor(num) === num);
    var isNaN4 = Number.isNaN;
    var parseInt3 = Number.parseInt;
    var countBits = (n) => {
      n &= binary2.BITS32;
      let count = 0;
      while (n) {
        n &= n - 1;
        count++;
      }
      return count;
    };
    var number = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      MAX_SAFE_INTEGER: MAX_SAFE_INTEGER2,
      MIN_SAFE_INTEGER: MIN_SAFE_INTEGER2,
      LOWEST_INT32: LOWEST_INT322,
      HIGHEST_INT32,
      HIGHEST_UINT32,
      isInteger: isInteger2,
      isNaN: isNaN4,
      parseInt: parseInt3,
      countBits
    });
    exports.HIGHEST_INT32 = HIGHEST_INT32;
    exports.HIGHEST_UINT32 = HIGHEST_UINT32;
    exports.LOWEST_INT32 = LOWEST_INT322;
    exports.MAX_SAFE_INTEGER = MAX_SAFE_INTEGER2;
    exports.MIN_SAFE_INTEGER = MIN_SAFE_INTEGER2;
    exports.countBits = countBits;
    exports.isInteger = isInteger2;
    exports.isNaN = isNaN4;
    exports.number = number;
    exports.parseInt = parseInt3;
  }
});

// ../node_modules/lib0/dist/string-fddc5f8b.cjs
var require_string_fddc5f8b = __commonJS({
  "../node_modules/lib0/dist/string-fddc5f8b.cjs"(exports) {
    "use strict";
    var array = require_array_78849c95();
    var fromCharCode2 = String.fromCharCode;
    var fromCodePoint2 = String.fromCodePoint;
    var MAX_UTF16_CHARACTER2 = fromCharCode2(65535);
    var toLowerCase2 = (s) => s.toLowerCase();
    var trimLeftRegex2 = /^\s*/g;
    var trimLeft2 = (s) => s.replace(trimLeftRegex2, "");
    var fromCamelCaseRegex2 = /([A-Z])/g;
    var fromCamelCase2 = (s, separator) => trimLeft2(s.replace(fromCamelCaseRegex2, (match2) => `${separator}${toLowerCase2(match2)}`));
    var utf8ByteLength = (str) => unescape(encodeURIComponent(str)).length;
    var _encodeUtf8Polyfill2 = (str) => {
      const encodedString = unescape(encodeURIComponent(str));
      const len = encodedString.length;
      const buf = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        buf[i] = /** @type {number} */
        encodedString.codePointAt(i);
      }
      return buf;
    };
    var utf8TextEncoder2 = (
      /** @type {TextEncoder} */
      typeof TextEncoder !== "undefined" ? new TextEncoder() : null
    );
    var _encodeUtf8Native2 = (str) => utf8TextEncoder2.encode(str);
    var encodeUtf82 = utf8TextEncoder2 ? _encodeUtf8Native2 : _encodeUtf8Polyfill2;
    var _decodeUtf8Polyfill = (buf) => {
      let remainingLen = buf.length;
      let encodedString = "";
      let bufPos = 0;
      while (remainingLen > 0) {
        const nextLen = remainingLen < 1e4 ? remainingLen : 1e4;
        const bytes = buf.subarray(bufPos, bufPos + nextLen);
        bufPos += nextLen;
        encodedString += String.fromCodePoint.apply(
          null,
          /** @type {any} */
          bytes
        );
        remainingLen -= nextLen;
      }
      return decodeURIComponent(escape(encodedString));
    };
    exports.utf8TextDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
    if (exports.utf8TextDecoder && exports.utf8TextDecoder.decode(new Uint8Array()).length === 1) {
      exports.utf8TextDecoder = null;
    }
    var _decodeUtf8Native = (buf) => (
      /** @type {TextDecoder} */
      exports.utf8TextDecoder.decode(buf)
    );
    var decodeUtf82 = exports.utf8TextDecoder ? _decodeUtf8Native : _decodeUtf8Polyfill;
    var splice = (str, index, remove, insert = "") => str.slice(0, index) + insert + str.slice(index + remove);
    var repeat2 = (source, n) => array.unfold(n, () => source).join("");
    var escapeHTML = (str) => str.replace(/[&<>'"]/g, (r) => (
      /** @type {string} */
      {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      }[r]
    ));
    var unescapeHTML = (str) => str.replace(/&amp;|&lt;|&gt;|&#39;|&quot;/g, (r) => (
      /** @type {string} */
      {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&#39;": "'",
        "&quot;": '"'
      }[r]
    ));
    var string2 = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      fromCharCode: fromCharCode2,
      fromCodePoint: fromCodePoint2,
      MAX_UTF16_CHARACTER: MAX_UTF16_CHARACTER2,
      trimLeft: trimLeft2,
      fromCamelCase: fromCamelCase2,
      utf8ByteLength,
      _encodeUtf8Polyfill: _encodeUtf8Polyfill2,
      utf8TextEncoder: utf8TextEncoder2,
      _encodeUtf8Native: _encodeUtf8Native2,
      encodeUtf8: encodeUtf82,
      _decodeUtf8Polyfill,
      get utf8TextDecoder() {
        return exports.utf8TextDecoder;
      },
      _decodeUtf8Native,
      decodeUtf8: decodeUtf82,
      splice,
      repeat: repeat2,
      escapeHTML,
      unescapeHTML
    });
    exports.MAX_UTF16_CHARACTER = MAX_UTF16_CHARACTER2;
    exports._decodeUtf8Native = _decodeUtf8Native;
    exports._decodeUtf8Polyfill = _decodeUtf8Polyfill;
    exports._encodeUtf8Native = _encodeUtf8Native2;
    exports._encodeUtf8Polyfill = _encodeUtf8Polyfill2;
    exports.decodeUtf8 = decodeUtf82;
    exports.encodeUtf8 = encodeUtf82;
    exports.escapeHTML = escapeHTML;
    exports.fromCamelCase = fromCamelCase2;
    exports.fromCharCode = fromCharCode2;
    exports.fromCodePoint = fromCodePoint2;
    exports.repeat = repeat2;
    exports.splice = splice;
    exports.string = string2;
    exports.trimLeft = trimLeft2;
    exports.unescapeHTML = unescapeHTML;
    exports.utf8ByteLength = utf8ByteLength;
    exports.utf8TextEncoder = utf8TextEncoder2;
  }
});

// ../node_modules/lib0/dist/encoding-1a745c43.cjs
var require_encoding_1a745c43 = __commonJS({
  "../node_modules/lib0/dist/encoding-1a745c43.cjs"(exports) {
    "use strict";
    var math = require_math_96d5e8c4();
    var number = require_number_1fb57bba();
    var binary2 = require_binary_ac8e39e2();
    var string2 = require_string_fddc5f8b();
    var array = require_array_78849c95();
    var Encoder2 = class {
      constructor() {
        this.cpos = 0;
        this.cbuf = new Uint8Array(100);
        this.bufs = [];
      }
    };
    var createEncoder2 = () => new Encoder2();
    var encode = (f) => {
      const encoder = createEncoder2();
      f(encoder);
      return toUint8Array2(encoder);
    };
    var length2 = (encoder) => {
      let len = encoder.cpos;
      for (let i = 0; i < encoder.bufs.length; i++) {
        len += encoder.bufs[i].length;
      }
      return len;
    };
    var hasContent = (encoder) => encoder.cpos > 0 || encoder.bufs.length > 0;
    var toUint8Array2 = (encoder) => {
      const uint8arr = new Uint8Array(length2(encoder));
      let curPos = 0;
      for (let i = 0; i < encoder.bufs.length; i++) {
        const d = encoder.bufs[i];
        uint8arr.set(d, curPos);
        curPos += d.length;
      }
      uint8arr.set(new Uint8Array(encoder.cbuf.buffer, 0, encoder.cpos), curPos);
      return uint8arr;
    };
    var verifyLen = (encoder, len) => {
      const bufferLen = encoder.cbuf.length;
      if (bufferLen - encoder.cpos < len) {
        encoder.bufs.push(new Uint8Array(encoder.cbuf.buffer, 0, encoder.cpos));
        encoder.cbuf = new Uint8Array(math.max(bufferLen, len) * 2);
        encoder.cpos = 0;
      }
    };
    var write2 = (encoder, num) => {
      const bufferLen = encoder.cbuf.length;
      if (encoder.cpos === bufferLen) {
        encoder.bufs.push(encoder.cbuf);
        encoder.cbuf = new Uint8Array(bufferLen * 2);
        encoder.cpos = 0;
      }
      encoder.cbuf[encoder.cpos++] = num;
    };
    var set2 = (encoder, pos, num) => {
      let buffer = null;
      for (let i = 0; i < encoder.bufs.length && buffer === null; i++) {
        const b = encoder.bufs[i];
        if (pos < b.length) {
          buffer = b;
        } else {
          pos -= b.length;
        }
      }
      if (buffer === null) {
        buffer = encoder.cbuf;
      }
      buffer[pos] = num;
    };
    var writeUint8 = write2;
    var setUint8 = set2;
    var writeUint16 = (encoder, num) => {
      write2(encoder, num & binary2.BITS8);
      write2(encoder, num >>> 8 & binary2.BITS8);
    };
    var setUint16 = (encoder, pos, num) => {
      set2(encoder, pos, num & binary2.BITS8);
      set2(encoder, pos + 1, num >>> 8 & binary2.BITS8);
    };
    var writeUint32 = (encoder, num) => {
      for (let i = 0; i < 4; i++) {
        write2(encoder, num & binary2.BITS8);
        num >>>= 8;
      }
    };
    var writeUint32BigEndian = (encoder, num) => {
      for (let i = 3; i >= 0; i--) {
        write2(encoder, num >>> 8 * i & binary2.BITS8);
      }
    };
    var setUint32 = (encoder, pos, num) => {
      for (let i = 0; i < 4; i++) {
        set2(encoder, pos + i, num & binary2.BITS8);
        num >>>= 8;
      }
    };
    var writeVarUint2 = (encoder, num) => {
      while (num > binary2.BITS7) {
        write2(encoder, binary2.BIT8 | binary2.BITS7 & num);
        num = math.floor(num / 128);
      }
      write2(encoder, binary2.BITS7 & num);
    };
    var writeVarInt = (encoder, num) => {
      const isNegative = math.isNegativeZero(num);
      if (isNegative) {
        num = -num;
      }
      write2(encoder, (num > binary2.BITS6 ? binary2.BIT8 : 0) | (isNegative ? binary2.BIT7 : 0) | binary2.BITS6 & num);
      num = math.floor(num / 64);
      while (num > 0) {
        write2(encoder, (num > binary2.BITS7 ? binary2.BIT8 : 0) | binary2.BITS7 & num);
        num = math.floor(num / 128);
      }
    };
    var _strBuffer2 = new Uint8Array(3e4);
    var _maxStrBSize2 = _strBuffer2.length / 3;
    var _writeVarStringNative2 = (encoder, str) => {
      if (str.length < _maxStrBSize2) {
        const written = string2.utf8TextEncoder.encodeInto(str, _strBuffer2).written || 0;
        writeVarUint2(encoder, written);
        for (let i = 0; i < written; i++) {
          write2(encoder, _strBuffer2[i]);
        }
      } else {
        writeVarUint8Array2(encoder, string2.encodeUtf8(str));
      }
    };
    var _writeVarStringPolyfill2 = (encoder, str) => {
      const encodedString = unescape(encodeURIComponent(str));
      const len = encodedString.length;
      writeVarUint2(encoder, len);
      for (let i = 0; i < len; i++) {
        write2(
          encoder,
          /** @type {number} */
          encodedString.codePointAt(i)
        );
      }
    };
    var writeVarString2 = string2.utf8TextEncoder && /** @type {any} */
    string2.utf8TextEncoder.encodeInto ? _writeVarStringNative2 : _writeVarStringPolyfill2;
    var writeTerminatedString = (encoder, str) => writeTerminatedUint8Array(encoder, string2.encodeUtf8(str));
    var writeTerminatedUint8Array = (encoder, buf) => {
      for (let i = 0; i < buf.length; i++) {
        const b = buf[i];
        if (b === 0 || b === 1) {
          write2(encoder, 1);
        }
        write2(encoder, buf[i]);
      }
      write2(encoder, 0);
    };
    var writeBinaryEncoder = (encoder, append2) => writeUint8Array2(encoder, toUint8Array2(append2));
    var writeUint8Array2 = (encoder, uint8Array) => {
      const bufferLen = encoder.cbuf.length;
      const cpos = encoder.cpos;
      const leftCopyLen = math.min(bufferLen - cpos, uint8Array.length);
      const rightCopyLen = uint8Array.length - leftCopyLen;
      encoder.cbuf.set(uint8Array.subarray(0, leftCopyLen), cpos);
      encoder.cpos += leftCopyLen;
      if (rightCopyLen > 0) {
        encoder.bufs.push(encoder.cbuf);
        encoder.cbuf = new Uint8Array(math.max(bufferLen * 2, rightCopyLen));
        encoder.cbuf.set(uint8Array.subarray(leftCopyLen));
        encoder.cpos = rightCopyLen;
      }
    };
    var writeVarUint8Array2 = (encoder, uint8Array) => {
      writeVarUint2(encoder, uint8Array.byteLength);
      writeUint8Array2(encoder, uint8Array);
    };
    var writeOnDataView = (encoder, len) => {
      verifyLen(encoder, len);
      const dview = new DataView(encoder.cbuf.buffer, encoder.cpos, len);
      encoder.cpos += len;
      return dview;
    };
    var writeFloat32 = (encoder, num) => writeOnDataView(encoder, 4).setFloat32(0, num, false);
    var writeFloat64 = (encoder, num) => writeOnDataView(encoder, 8).setFloat64(0, num, false);
    var writeBigInt64 = (encoder, num) => (
      /** @type {any} */
      writeOnDataView(encoder, 8).setBigInt64(0, num, false)
    );
    var writeBigUint64 = (encoder, num) => (
      /** @type {any} */
      writeOnDataView(encoder, 8).setBigUint64(0, num, false)
    );
    var floatTestBed2 = new DataView(new ArrayBuffer(4));
    var isFloat32 = (num) => {
      floatTestBed2.setFloat32(0, num);
      return floatTestBed2.getFloat32(0) === num;
    };
    var writeAny = (encoder, data) => {
      switch (typeof data) {
        case "string":
          write2(encoder, 119);
          writeVarString2(encoder, data);
          break;
        case "number":
          if (number.isInteger(data) && math.abs(data) <= binary2.BITS31) {
            write2(encoder, 125);
            writeVarInt(encoder, data);
          } else if (isFloat32(data)) {
            write2(encoder, 124);
            writeFloat32(encoder, data);
          } else {
            write2(encoder, 123);
            writeFloat64(encoder, data);
          }
          break;
        case "bigint":
          write2(encoder, 122);
          writeBigInt64(encoder, data);
          break;
        case "object":
          if (data === null) {
            write2(encoder, 126);
          } else if (array.isArray(data)) {
            write2(encoder, 117);
            writeVarUint2(encoder, data.length);
            for (let i = 0; i < data.length; i++) {
              writeAny(encoder, data[i]);
            }
          } else if (data instanceof Uint8Array) {
            write2(encoder, 116);
            writeVarUint8Array2(encoder, data);
          } else {
            write2(encoder, 118);
            const keys2 = Object.keys(data);
            writeVarUint2(encoder, keys2.length);
            for (let i = 0; i < keys2.length; i++) {
              const key = keys2[i];
              writeVarString2(encoder, key);
              writeAny(encoder, data[key]);
            }
          }
          break;
        case "boolean":
          write2(encoder, data ? 120 : 121);
          break;
        default:
          write2(encoder, 127);
      }
    };
    var RleEncoder = class extends Encoder2 {
      /**
       * @param {function(Encoder, T):void} writer
       */
      constructor(writer) {
        super();
        this.w = writer;
        this.s = null;
        this.count = 0;
      }
      /**
       * @param {T} v
       */
      write(v) {
        if (this.s === v) {
          this.count++;
        } else {
          if (this.count > 0) {
            writeVarUint2(this, this.count - 1);
          }
          this.count = 1;
          this.w(this, v);
          this.s = v;
        }
      }
    };
    var IntDiffEncoder = class extends Encoder2 {
      /**
       * @param {number} start
       */
      constructor(start) {
        super();
        this.s = start;
      }
      /**
       * @param {number} v
       */
      write(v) {
        writeVarInt(this, v - this.s);
        this.s = v;
      }
    };
    var RleIntDiffEncoder = class extends Encoder2 {
      /**
       * @param {number} start
       */
      constructor(start) {
        super();
        this.s = start;
        this.count = 0;
      }
      /**
       * @param {number} v
       */
      write(v) {
        if (this.s === v && this.count > 0) {
          this.count++;
        } else {
          if (this.count > 0) {
            writeVarUint2(this, this.count - 1);
          }
          this.count = 1;
          writeVarInt(this, v - this.s);
          this.s = v;
        }
      }
    };
    var flushUintOptRleEncoder = (encoder) => {
      if (encoder.count > 0) {
        writeVarInt(encoder.encoder, encoder.count === 1 ? encoder.s : -encoder.s);
        if (encoder.count > 1) {
          writeVarUint2(encoder.encoder, encoder.count - 2);
        }
      }
    };
    var UintOptRleEncoder = class {
      constructor() {
        this.encoder = new Encoder2();
        this.s = 0;
        this.count = 0;
      }
      /**
       * @param {number} v
       */
      write(v) {
        if (this.s === v) {
          this.count++;
        } else {
          flushUintOptRleEncoder(this);
          this.count = 1;
          this.s = v;
        }
      }
      /**
       * Flush the encoded state and transform this to a Uint8Array.
       *
       * Note that this should only be called once.
       */
      toUint8Array() {
        flushUintOptRleEncoder(this);
        return toUint8Array2(this.encoder);
      }
    };
    var IncUintOptRleEncoder = class {
      constructor() {
        this.encoder = new Encoder2();
        this.s = 0;
        this.count = 0;
      }
      /**
       * @param {number} v
       */
      write(v) {
        if (this.s + this.count === v) {
          this.count++;
        } else {
          flushUintOptRleEncoder(this);
          this.count = 1;
          this.s = v;
        }
      }
      /**
       * Flush the encoded state and transform this to a Uint8Array.
       *
       * Note that this should only be called once.
       */
      toUint8Array() {
        flushUintOptRleEncoder(this);
        return toUint8Array2(this.encoder);
      }
    };
    var flushIntDiffOptRleEncoder = (encoder) => {
      if (encoder.count > 0) {
        const encodedDiff = encoder.diff * 2 + (encoder.count === 1 ? 0 : 1);
        writeVarInt(encoder.encoder, encodedDiff);
        if (encoder.count > 1) {
          writeVarUint2(encoder.encoder, encoder.count - 2);
        }
      }
    };
    var IntDiffOptRleEncoder = class {
      constructor() {
        this.encoder = new Encoder2();
        this.s = 0;
        this.count = 0;
        this.diff = 0;
      }
      /**
       * @param {number} v
       */
      write(v) {
        if (this.diff === v - this.s) {
          this.s = v;
          this.count++;
        } else {
          flushIntDiffOptRleEncoder(this);
          this.count = 1;
          this.diff = v - this.s;
          this.s = v;
        }
      }
      /**
       * Flush the encoded state and transform this to a Uint8Array.
       *
       * Note that this should only be called once.
       */
      toUint8Array() {
        flushIntDiffOptRleEncoder(this);
        return toUint8Array2(this.encoder);
      }
    };
    var StringEncoder = class {
      constructor() {
        this.sarr = [];
        this.s = "";
        this.lensE = new UintOptRleEncoder();
      }
      /**
       * @param {string} string
       */
      write(string3) {
        this.s += string3;
        if (this.s.length > 19) {
          this.sarr.push(this.s);
          this.s = "";
        }
        this.lensE.write(string3.length);
      }
      toUint8Array() {
        const encoder = new Encoder2();
        this.sarr.push(this.s);
        this.s = "";
        writeVarString2(encoder, this.sarr.join(""));
        writeUint8Array2(encoder, this.lensE.toUint8Array());
        return toUint8Array2(encoder);
      }
    };
    var encoding = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      Encoder: Encoder2,
      createEncoder: createEncoder2,
      encode,
      length: length2,
      hasContent,
      toUint8Array: toUint8Array2,
      verifyLen,
      write: write2,
      set: set2,
      writeUint8,
      setUint8,
      writeUint16,
      setUint16,
      writeUint32,
      writeUint32BigEndian,
      setUint32,
      writeVarUint: writeVarUint2,
      writeVarInt,
      _writeVarStringNative: _writeVarStringNative2,
      _writeVarStringPolyfill: _writeVarStringPolyfill2,
      writeVarString: writeVarString2,
      writeTerminatedString,
      writeTerminatedUint8Array,
      writeBinaryEncoder,
      writeUint8Array: writeUint8Array2,
      writeVarUint8Array: writeVarUint8Array2,
      writeOnDataView,
      writeFloat32,
      writeFloat64,
      writeBigInt64,
      writeBigUint64,
      writeAny,
      RleEncoder,
      IntDiffEncoder,
      RleIntDiffEncoder,
      UintOptRleEncoder,
      IncUintOptRleEncoder,
      IntDiffOptRleEncoder,
      StringEncoder
    });
    exports.Encoder = Encoder2;
    exports.IncUintOptRleEncoder = IncUintOptRleEncoder;
    exports.IntDiffEncoder = IntDiffEncoder;
    exports.IntDiffOptRleEncoder = IntDiffOptRleEncoder;
    exports.RleEncoder = RleEncoder;
    exports.RleIntDiffEncoder = RleIntDiffEncoder;
    exports.StringEncoder = StringEncoder;
    exports.UintOptRleEncoder = UintOptRleEncoder;
    exports._writeVarStringNative = _writeVarStringNative2;
    exports._writeVarStringPolyfill = _writeVarStringPolyfill2;
    exports.createEncoder = createEncoder2;
    exports.encode = encode;
    exports.encoding = encoding;
    exports.hasContent = hasContent;
    exports.length = length2;
    exports.set = set2;
    exports.setUint16 = setUint16;
    exports.setUint32 = setUint32;
    exports.setUint8 = setUint8;
    exports.toUint8Array = toUint8Array2;
    exports.verifyLen = verifyLen;
    exports.write = write2;
    exports.writeAny = writeAny;
    exports.writeBigInt64 = writeBigInt64;
    exports.writeBigUint64 = writeBigUint64;
    exports.writeBinaryEncoder = writeBinaryEncoder;
    exports.writeFloat32 = writeFloat32;
    exports.writeFloat64 = writeFloat64;
    exports.writeOnDataView = writeOnDataView;
    exports.writeTerminatedString = writeTerminatedString;
    exports.writeTerminatedUint8Array = writeTerminatedUint8Array;
    exports.writeUint16 = writeUint16;
    exports.writeUint32 = writeUint32;
    exports.writeUint32BigEndian = writeUint32BigEndian;
    exports.writeUint8 = writeUint8;
    exports.writeUint8Array = writeUint8Array2;
    exports.writeVarInt = writeVarInt;
    exports.writeVarString = writeVarString2;
    exports.writeVarUint = writeVarUint2;
    exports.writeVarUint8Array = writeVarUint8Array2;
  }
});

// ../node_modules/lib0/dist/encoding.cjs
var require_encoding = __commonJS({
  "../node_modules/lib0/dist/encoding.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require_math_96d5e8c4();
    require_number_1fb57bba();
    require_binary_ac8e39e2();
    require_string_fddc5f8b();
    require_array_78849c95();
    var encoding = require_encoding_1a745c43();
    require_set_5b47859e();
    exports.Encoder = encoding.Encoder;
    exports.IncUintOptRleEncoder = encoding.IncUintOptRleEncoder;
    exports.IntDiffEncoder = encoding.IntDiffEncoder;
    exports.IntDiffOptRleEncoder = encoding.IntDiffOptRleEncoder;
    exports.RleEncoder = encoding.RleEncoder;
    exports.RleIntDiffEncoder = encoding.RleIntDiffEncoder;
    exports.StringEncoder = encoding.StringEncoder;
    exports.UintOptRleEncoder = encoding.UintOptRleEncoder;
    exports._writeVarStringNative = encoding._writeVarStringNative;
    exports._writeVarStringPolyfill = encoding._writeVarStringPolyfill;
    exports.createEncoder = encoding.createEncoder;
    exports.encode = encoding.encode;
    exports.hasContent = encoding.hasContent;
    exports.length = encoding.length;
    exports.set = encoding.set;
    exports.setUint16 = encoding.setUint16;
    exports.setUint32 = encoding.setUint32;
    exports.setUint8 = encoding.setUint8;
    exports.toUint8Array = encoding.toUint8Array;
    exports.verifyLen = encoding.verifyLen;
    exports.write = encoding.write;
    exports.writeAny = encoding.writeAny;
    exports.writeBigInt64 = encoding.writeBigInt64;
    exports.writeBigUint64 = encoding.writeBigUint64;
    exports.writeBinaryEncoder = encoding.writeBinaryEncoder;
    exports.writeFloat32 = encoding.writeFloat32;
    exports.writeFloat64 = encoding.writeFloat64;
    exports.writeOnDataView = encoding.writeOnDataView;
    exports.writeTerminatedString = encoding.writeTerminatedString;
    exports.writeTerminatedUint8Array = encoding.writeTerminatedUint8Array;
    exports.writeUint16 = encoding.writeUint16;
    exports.writeUint32 = encoding.writeUint32;
    exports.writeUint32BigEndian = encoding.writeUint32BigEndian;
    exports.writeUint8 = encoding.writeUint8;
    exports.writeUint8Array = encoding.writeUint8Array;
    exports.writeVarInt = encoding.writeVarInt;
    exports.writeVarString = encoding.writeVarString;
    exports.writeVarUint = encoding.writeVarUint;
    exports.writeVarUint8Array = encoding.writeVarUint8Array;
  }
});

// ../node_modules/lib0/dist/error-0c1f634f.cjs
var require_error_0c1f634f = __commonJS({
  "../node_modules/lib0/dist/error-0c1f634f.cjs"(exports) {
    "use strict";
    var create5 = (s) => new Error(s);
    var methodUnimplemented2 = () => {
      throw create5("Method unimplemented");
    };
    var unexpectedCase2 = () => {
      throw create5("Unexpected case");
    };
    var assert2 = (property) => {
      if (!property) throw create5("Assert failed");
    };
    var error = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      create: create5,
      methodUnimplemented: methodUnimplemented2,
      unexpectedCase: unexpectedCase2,
      assert: assert2
    });
    exports.assert = assert2;
    exports.create = create5;
    exports.error = error;
    exports.methodUnimplemented = methodUnimplemented2;
    exports.unexpectedCase = unexpectedCase2;
  }
});

// ../node_modules/lib0/dist/decoding-76e75827.cjs
var require_decoding_76e75827 = __commonJS({
  "../node_modules/lib0/dist/decoding-76e75827.cjs"(exports) {
    "use strict";
    var binary2 = require_binary_ac8e39e2();
    var math = require_math_96d5e8c4();
    var number = require_number_1fb57bba();
    var string2 = require_string_fddc5f8b();
    var error = require_error_0c1f634f();
    var encoding = require_encoding_1a745c43();
    var errorUnexpectedEndOfArray2 = error.create("Unexpected end of array");
    var errorIntegerOutOfRange2 = error.create("Integer out of Range");
    var Decoder2 = class {
      /**
       * @param {Uint8Array<Buf>} uint8Array Binary data to decode
       */
      constructor(uint8Array) {
        this.arr = uint8Array;
        this.pos = 0;
      }
    };
    var createDecoder2 = (uint8Array) => new Decoder2(uint8Array);
    var hasContent = (decoder) => decoder.pos !== decoder.arr.length;
    var clone = (decoder, newPos = decoder.pos) => {
      const _decoder = createDecoder2(decoder.arr);
      _decoder.pos = newPos;
      return _decoder;
    };
    var readUint8Array2 = (decoder, len) => {
      const view = new Uint8Array(decoder.arr.buffer, decoder.pos + decoder.arr.byteOffset, len);
      decoder.pos += len;
      return view;
    };
    var readVarUint8Array2 = (decoder) => readUint8Array2(decoder, readVarUint2(decoder));
    var readTailAsUint8Array = (decoder) => readUint8Array2(decoder, decoder.arr.length - decoder.pos);
    var skip8 = (decoder) => decoder.pos++;
    var readUint82 = (decoder) => decoder.arr[decoder.pos++];
    var readUint16 = (decoder) => {
      const uint = decoder.arr[decoder.pos] + (decoder.arr[decoder.pos + 1] << 8);
      decoder.pos += 2;
      return uint;
    };
    var readUint32 = (decoder) => {
      const uint = decoder.arr[decoder.pos] + (decoder.arr[decoder.pos + 1] << 8) + (decoder.arr[decoder.pos + 2] << 16) + (decoder.arr[decoder.pos + 3] << 24) >>> 0;
      decoder.pos += 4;
      return uint;
    };
    var readUint32BigEndian = (decoder) => {
      const uint = decoder.arr[decoder.pos + 3] + (decoder.arr[decoder.pos + 2] << 8) + (decoder.arr[decoder.pos + 1] << 16) + (decoder.arr[decoder.pos] << 24) >>> 0;
      decoder.pos += 4;
      return uint;
    };
    var peekUint8 = (decoder) => decoder.arr[decoder.pos];
    var peekUint16 = (decoder) => decoder.arr[decoder.pos] + (decoder.arr[decoder.pos + 1] << 8);
    var peekUint32 = (decoder) => decoder.arr[decoder.pos] + (decoder.arr[decoder.pos + 1] << 8) + (decoder.arr[decoder.pos + 2] << 16) + (decoder.arr[decoder.pos + 3] << 24) >>> 0;
    var readVarUint2 = (decoder) => {
      let num = 0;
      let mult = 1;
      const len = decoder.arr.length;
      while (decoder.pos < len) {
        const r = decoder.arr[decoder.pos++];
        num = num + (r & binary2.BITS7) * mult;
        mult *= 128;
        if (r < binary2.BIT8) {
          return num;
        }
        if (num > number.MAX_SAFE_INTEGER) {
          throw errorIntegerOutOfRange2;
        }
      }
      throw errorUnexpectedEndOfArray2;
    };
    var readVarInt = (decoder) => {
      let r = decoder.arr[decoder.pos++];
      let num = r & binary2.BITS6;
      let mult = 64;
      const sign = (r & binary2.BIT7) > 0 ? -1 : 1;
      if ((r & binary2.BIT8) === 0) {
        return sign * num;
      }
      const len = decoder.arr.length;
      while (decoder.pos < len) {
        r = decoder.arr[decoder.pos++];
        num = num + (r & binary2.BITS7) * mult;
        mult *= 128;
        if (r < binary2.BIT8) {
          return sign * num;
        }
        if (num > number.MAX_SAFE_INTEGER) {
          throw errorIntegerOutOfRange2;
        }
      }
      throw errorUnexpectedEndOfArray2;
    };
    var peekVarUint = (decoder) => {
      const pos = decoder.pos;
      const s = readVarUint2(decoder);
      decoder.pos = pos;
      return s;
    };
    var peekVarInt = (decoder) => {
      const pos = decoder.pos;
      const s = readVarInt(decoder);
      decoder.pos = pos;
      return s;
    };
    var _readVarStringPolyfill2 = (decoder) => {
      let remainingLen = readVarUint2(decoder);
      if (remainingLen === 0) {
        return "";
      } else {
        let encodedString = String.fromCodePoint(readUint82(decoder));
        if (--remainingLen < 100) {
          while (remainingLen--) {
            encodedString += String.fromCodePoint(readUint82(decoder));
          }
        } else {
          while (remainingLen > 0) {
            const nextLen = remainingLen < 1e4 ? remainingLen : 1e4;
            const bytes = decoder.arr.subarray(decoder.pos, decoder.pos + nextLen);
            decoder.pos += nextLen;
            encodedString += String.fromCodePoint.apply(
              null,
              /** @type {any} */
              bytes
            );
            remainingLen -= nextLen;
          }
        }
        return decodeURIComponent(escape(encodedString));
      }
    };
    var _readVarStringNative2 = (decoder) => (
      /** @type any */
      string2.utf8TextDecoder.decode(readVarUint8Array2(decoder))
    );
    var readVarString2 = string2.utf8TextDecoder ? _readVarStringNative2 : _readVarStringPolyfill2;
    var readTerminatedUint8Array = (decoder) => {
      const encoder = encoding.createEncoder();
      let b;
      while (true) {
        b = readUint82(decoder);
        if (b === 0) {
          return encoding.toUint8Array(encoder);
        }
        if (b === 1) {
          b = readUint82(decoder);
        }
        encoding.write(encoder, b);
      }
    };
    var readTerminatedString = (decoder) => string2.decodeUtf8(readTerminatedUint8Array(decoder));
    var peekVarString = (decoder) => {
      const pos = decoder.pos;
      const s = readVarString2(decoder);
      decoder.pos = pos;
      return s;
    };
    var readFromDataView = (decoder, len) => {
      const dv = new DataView(decoder.arr.buffer, decoder.arr.byteOffset + decoder.pos, len);
      decoder.pos += len;
      return dv;
    };
    var readFloat32 = (decoder) => readFromDataView(decoder, 4).getFloat32(0, false);
    var readFloat64 = (decoder) => readFromDataView(decoder, 8).getFloat64(0, false);
    var readBigInt64 = (decoder) => (
      /** @type {any} */
      readFromDataView(decoder, 8).getBigInt64(0, false)
    );
    var readBigUint64 = (decoder) => (
      /** @type {any} */
      readFromDataView(decoder, 8).getBigUint64(0, false)
    );
    var readAnyLookupTable = [
      (decoder) => void 0,
      // CASE 127: undefined
      (decoder) => null,
      // CASE 126: null
      readVarInt,
      // CASE 125: integer
      readFloat32,
      // CASE 124: float32
      readFloat64,
      // CASE 123: float64
      readBigInt64,
      // CASE 122: bigint
      (decoder) => false,
      // CASE 121: boolean (false)
      (decoder) => true,
      // CASE 120: boolean (true)
      readVarString2,
      // CASE 119: string
      (decoder) => {
        const len = readVarUint2(decoder);
        const obj = {};
        for (let i = 0; i < len; i++) {
          const key = readVarString2(decoder);
          obj[key] = readAny(decoder);
        }
        return obj;
      },
      (decoder) => {
        const len = readVarUint2(decoder);
        const arr = [];
        for (let i = 0; i < len; i++) {
          arr.push(readAny(decoder));
        }
        return arr;
      },
      readVarUint8Array2
      // CASE 116: Uint8Array
    ];
    var readAny = (decoder) => readAnyLookupTable[127 - readUint82(decoder)](decoder);
    var RleDecoder = class extends Decoder2 {
      /**
       * @param {Uint8Array} uint8Array
       * @param {function(Decoder):T} reader
       */
      constructor(uint8Array, reader) {
        super(uint8Array);
        this.reader = reader;
        this.s = null;
        this.count = 0;
      }
      read() {
        if (this.count === 0) {
          this.s = this.reader(this);
          if (hasContent(this)) {
            this.count = readVarUint2(this) + 1;
          } else {
            this.count = -1;
          }
        }
        this.count--;
        return (
          /** @type {T} */
          this.s
        );
      }
    };
    var IntDiffDecoder = class extends Decoder2 {
      /**
       * @param {Uint8Array} uint8Array
       * @param {number} start
       */
      constructor(uint8Array, start) {
        super(uint8Array);
        this.s = start;
      }
      /**
       * @return {number}
       */
      read() {
        this.s += readVarInt(this);
        return this.s;
      }
    };
    var RleIntDiffDecoder = class extends Decoder2 {
      /**
       * @param {Uint8Array} uint8Array
       * @param {number} start
       */
      constructor(uint8Array, start) {
        super(uint8Array);
        this.s = start;
        this.count = 0;
      }
      /**
       * @return {number}
       */
      read() {
        if (this.count === 0) {
          this.s += readVarInt(this);
          if (hasContent(this)) {
            this.count = readVarUint2(this) + 1;
          } else {
            this.count = -1;
          }
        }
        this.count--;
        return (
          /** @type {number} */
          this.s
        );
      }
    };
    var UintOptRleDecoder = class extends Decoder2 {
      /**
       * @param {Uint8Array} uint8Array
       */
      constructor(uint8Array) {
        super(uint8Array);
        this.s = 0;
        this.count = 0;
      }
      read() {
        if (this.count === 0) {
          this.s = readVarInt(this);
          const isNegative = math.isNegativeZero(this.s);
          this.count = 1;
          if (isNegative) {
            this.s = -this.s;
            this.count = readVarUint2(this) + 2;
          }
        }
        this.count--;
        return (
          /** @type {number} */
          this.s
        );
      }
    };
    var IncUintOptRleDecoder = class extends Decoder2 {
      /**
       * @param {Uint8Array} uint8Array
       */
      constructor(uint8Array) {
        super(uint8Array);
        this.s = 0;
        this.count = 0;
      }
      read() {
        if (this.count === 0) {
          this.s = readVarInt(this);
          const isNegative = math.isNegativeZero(this.s);
          this.count = 1;
          if (isNegative) {
            this.s = -this.s;
            this.count = readVarUint2(this) + 2;
          }
        }
        this.count--;
        return (
          /** @type {number} */
          this.s++
        );
      }
    };
    var IntDiffOptRleDecoder = class extends Decoder2 {
      /**
       * @param {Uint8Array} uint8Array
       */
      constructor(uint8Array) {
        super(uint8Array);
        this.s = 0;
        this.count = 0;
        this.diff = 0;
      }
      /**
       * @return {number}
       */
      read() {
        if (this.count === 0) {
          const diff = readVarInt(this);
          const hasCount = diff & 1;
          this.diff = math.floor(diff / 2);
          this.count = 1;
          if (hasCount) {
            this.count = readVarUint2(this) + 2;
          }
        }
        this.s += this.diff;
        this.count--;
        return this.s;
      }
    };
    var StringDecoder = class {
      /**
       * @param {Uint8Array} uint8Array
       */
      constructor(uint8Array) {
        this.decoder = new UintOptRleDecoder(uint8Array);
        this.str = readVarString2(this.decoder);
        this.spos = 0;
      }
      /**
       * @return {string}
       */
      read() {
        const end = this.spos + this.decoder.read();
        const res = this.str.slice(this.spos, end);
        this.spos = end;
        return res;
      }
    };
    var decoding = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      Decoder: Decoder2,
      createDecoder: createDecoder2,
      hasContent,
      clone,
      readUint8Array: readUint8Array2,
      readVarUint8Array: readVarUint8Array2,
      readTailAsUint8Array,
      skip8,
      readUint8: readUint82,
      readUint16,
      readUint32,
      readUint32BigEndian,
      peekUint8,
      peekUint16,
      peekUint32,
      readVarUint: readVarUint2,
      readVarInt,
      peekVarUint,
      peekVarInt,
      _readVarStringPolyfill: _readVarStringPolyfill2,
      _readVarStringNative: _readVarStringNative2,
      readVarString: readVarString2,
      readTerminatedUint8Array,
      readTerminatedString,
      peekVarString,
      readFromDataView,
      readFloat32,
      readFloat64,
      readBigInt64,
      readBigUint64,
      readAny,
      RleDecoder,
      IntDiffDecoder,
      RleIntDiffDecoder,
      UintOptRleDecoder,
      IncUintOptRleDecoder,
      IntDiffOptRleDecoder,
      StringDecoder
    });
    exports.Decoder = Decoder2;
    exports.IncUintOptRleDecoder = IncUintOptRleDecoder;
    exports.IntDiffDecoder = IntDiffDecoder;
    exports.IntDiffOptRleDecoder = IntDiffOptRleDecoder;
    exports.RleDecoder = RleDecoder;
    exports.RleIntDiffDecoder = RleIntDiffDecoder;
    exports.StringDecoder = StringDecoder;
    exports.UintOptRleDecoder = UintOptRleDecoder;
    exports._readVarStringNative = _readVarStringNative2;
    exports._readVarStringPolyfill = _readVarStringPolyfill2;
    exports.clone = clone;
    exports.createDecoder = createDecoder2;
    exports.decoding = decoding;
    exports.hasContent = hasContent;
    exports.peekUint16 = peekUint16;
    exports.peekUint32 = peekUint32;
    exports.peekUint8 = peekUint8;
    exports.peekVarInt = peekVarInt;
    exports.peekVarString = peekVarString;
    exports.peekVarUint = peekVarUint;
    exports.readAny = readAny;
    exports.readBigInt64 = readBigInt64;
    exports.readBigUint64 = readBigUint64;
    exports.readFloat32 = readFloat32;
    exports.readFloat64 = readFloat64;
    exports.readFromDataView = readFromDataView;
    exports.readTailAsUint8Array = readTailAsUint8Array;
    exports.readTerminatedString = readTerminatedString;
    exports.readTerminatedUint8Array = readTerminatedUint8Array;
    exports.readUint16 = readUint16;
    exports.readUint32 = readUint32;
    exports.readUint32BigEndian = readUint32BigEndian;
    exports.readUint8 = readUint82;
    exports.readUint8Array = readUint8Array2;
    exports.readVarInt = readVarInt;
    exports.readVarString = readVarString2;
    exports.readVarUint = readVarUint2;
    exports.readVarUint8Array = readVarUint8Array2;
    exports.skip8 = skip8;
  }
});

// ../node_modules/lib0/dist/decoding.cjs
var require_decoding = __commonJS({
  "../node_modules/lib0/dist/decoding.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require_binary_ac8e39e2();
    require_math_96d5e8c4();
    require_number_1fb57bba();
    require_string_fddc5f8b();
    require_error_0c1f634f();
    require_encoding_1a745c43();
    var decoding = require_decoding_76e75827();
    require_array_78849c95();
    require_set_5b47859e();
    exports.Decoder = decoding.Decoder;
    exports.IncUintOptRleDecoder = decoding.IncUintOptRleDecoder;
    exports.IntDiffDecoder = decoding.IntDiffDecoder;
    exports.IntDiffOptRleDecoder = decoding.IntDiffOptRleDecoder;
    exports.RleDecoder = decoding.RleDecoder;
    exports.RleIntDiffDecoder = decoding.RleIntDiffDecoder;
    exports.StringDecoder = decoding.StringDecoder;
    exports.UintOptRleDecoder = decoding.UintOptRleDecoder;
    exports._readVarStringNative = decoding._readVarStringNative;
    exports._readVarStringPolyfill = decoding._readVarStringPolyfill;
    exports.clone = decoding.clone;
    exports.createDecoder = decoding.createDecoder;
    exports.hasContent = decoding.hasContent;
    exports.peekUint16 = decoding.peekUint16;
    exports.peekUint32 = decoding.peekUint32;
    exports.peekUint8 = decoding.peekUint8;
    exports.peekVarInt = decoding.peekVarInt;
    exports.peekVarString = decoding.peekVarString;
    exports.peekVarUint = decoding.peekVarUint;
    exports.readAny = decoding.readAny;
    exports.readBigInt64 = decoding.readBigInt64;
    exports.readBigUint64 = decoding.readBigUint64;
    exports.readFloat32 = decoding.readFloat32;
    exports.readFloat64 = decoding.readFloat64;
    exports.readFromDataView = decoding.readFromDataView;
    exports.readTailAsUint8Array = decoding.readTailAsUint8Array;
    exports.readTerminatedString = decoding.readTerminatedString;
    exports.readTerminatedUint8Array = decoding.readTerminatedUint8Array;
    exports.readUint16 = decoding.readUint16;
    exports.readUint32 = decoding.readUint32;
    exports.readUint32BigEndian = decoding.readUint32BigEndian;
    exports.readUint8 = decoding.readUint8;
    exports.readUint8Array = decoding.readUint8Array;
    exports.readVarInt = decoding.readVarInt;
    exports.readVarString = decoding.readVarString;
    exports.readVarUint = decoding.readVarUint;
    exports.readVarUint8Array = decoding.readVarUint8Array;
    exports.skip8 = decoding.skip8;
  }
});

// ../node_modules/lib0/webcrypto.js
var webcrypto_exports = {};
__export(webcrypto_exports, {
  getRandomValues: () => getRandomValues,
  subtle: () => subtle
});
var subtle, getRandomValues;
var init_webcrypto = __esm({
  "../node_modules/lib0/webcrypto.js"() {
    subtle = crypto.subtle;
    getRandomValues = crypto.getRandomValues.bind(crypto);
  }
});

// ../node_modules/lib0/dist/random.cjs
var require_random = __commonJS({
  "../node_modules/lib0/dist/random.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var math = require_math_96d5e8c4();
    var binary2 = require_binary_ac8e39e2();
    var webcrypto = (init_webcrypto(), __toCommonJS(webcrypto_exports));
    var rand = Math.random;
    var uint32 = () => webcrypto.getRandomValues(new Uint32Array(1))[0];
    var uint53 = () => {
      const arr = webcrypto.getRandomValues(new Uint32Array(8));
      return (arr[0] & binary2.BITS21) * (binary2.BITS32 + 1) + (arr[1] >>> 0);
    };
    var oneOf2 = (arr) => arr[math.floor(rand() * arr.length)];
    var uuidv4Template = "10000000-1000-4000-8000" + -1e11;
    var uuidv4 = () => uuidv4Template.replace(
      /[018]/g,
      /** @param {number} c */
      (c) => (c ^ uint32() & 15 >> c / 4).toString(16)
    );
    exports.oneOf = oneOf2;
    exports.rand = rand;
    exports.uint32 = uint32;
    exports.uint53 = uint53;
    exports.uuidv4 = uuidv4;
  }
});

// ../node_modules/lib0/dist/metric.cjs
var require_metric = __commonJS({
  "../node_modules/lib0/dist/metric.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var math = require_math_96d5e8c4();
    var yotta = 1e24;
    var zetta = 1e21;
    var exa = 1e18;
    var peta = 1e15;
    var tera = 1e12;
    var giga = 1e9;
    var mega = 1e6;
    var kilo = 1e3;
    var hecto = 100;
    var deca = 10;
    var deci = 0.1;
    var centi = 0.01;
    var milli = 1e-3;
    var micro = 1e-6;
    var nano = 1e-9;
    var pico = 1e-12;
    var femto = 1e-15;
    var atto = 1e-18;
    var zepto = 1e-21;
    var yocto = 1e-24;
    var prefixUp = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];
    var prefixDown = ["", "m", "\u03BC", "n", "p", "f", "a", "z", "y"];
    var prefix = (n, baseMultiplier = 0) => {
      const nPow = n === 0 ? 0 : math.log10(n);
      let mult = 0;
      while (nPow < mult * 3 && baseMultiplier > -8) {
        baseMultiplier--;
        mult--;
      }
      while (nPow >= 3 + mult * 3 && baseMultiplier < 8) {
        baseMultiplier++;
        mult++;
      }
      const prefix2 = baseMultiplier < 0 ? prefixDown[-baseMultiplier] : prefixUp[baseMultiplier];
      return {
        n: math.round((mult > 0 ? n / math.exp10(mult * 3) : n * math.exp10(mult * -3)) * 1e12) / 1e12,
        prefix: prefix2
      };
    };
    exports.atto = atto;
    exports.centi = centi;
    exports.deca = deca;
    exports.deci = deci;
    exports.exa = exa;
    exports.femto = femto;
    exports.giga = giga;
    exports.hecto = hecto;
    exports.kilo = kilo;
    exports.mega = mega;
    exports.micro = micro;
    exports.milli = milli;
    exports.nano = nano;
    exports.peta = peta;
    exports.pico = pico;
    exports.prefix = prefix;
    exports.tera = tera;
    exports.yocto = yocto;
    exports.yotta = yotta;
    exports.zepto = zepto;
    exports.zetta = zetta;
  }
});

// ../node_modules/lib0/dist/time-d8438852.cjs
var require_time_d8438852 = __commonJS({
  "../node_modules/lib0/dist/time-d8438852.cjs"(exports) {
    "use strict";
    var metric = require_metric();
    var math = require_math_96d5e8c4();
    var getDate = () => /* @__PURE__ */ new Date();
    var getUnixTime2 = Date.now;
    var humanizeDuration = (d) => {
      if (d < 6e4) {
        const p = metric.prefix(d, -1);
        return math.round(p.n * 100) / 100 + p.prefix + "s";
      }
      d = math.floor(d / 1e3);
      const seconds = d % 60;
      const minutes = math.floor(d / 60) % 60;
      const hours = math.floor(d / 3600) % 24;
      const days = math.floor(d / 86400);
      if (days > 0) {
        return days + "d" + (hours > 0 || minutes > 30 ? " " + (minutes > 30 ? hours + 1 : hours) + "h" : "");
      }
      if (hours > 0) {
        return hours + "h" + (minutes > 0 || seconds > 30 ? " " + (seconds > 30 ? minutes + 1 : minutes) + "min" : "");
      }
      return minutes + "min" + (seconds > 0 ? " " + seconds + "s" : "");
    };
    var time = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      getDate,
      getUnixTime: getUnixTime2,
      humanizeDuration
    });
    exports.getDate = getDate;
    exports.getUnixTime = getUnixTime2;
    exports.humanizeDuration = humanizeDuration;
    exports.time = time;
  }
});

// ../node_modules/lib0/dist/promise-cda7b9bb.cjs
var require_promise_cda7b9bb = __commonJS({
  "../node_modules/lib0/dist/promise-cda7b9bb.cjs"(exports) {
    "use strict";
    var time = require_time_d8438852();
    var create5 = (f) => (
      /** @type {Promise<T>} */
      new Promise(f)
    );
    var createEmpty = (f) => new Promise(f);
    var all = Promise.all.bind(Promise);
    var reject = (reason) => Promise.reject(reason);
    var resolve = (res) => Promise.resolve(res);
    var resolveWith = (res) => Promise.resolve(res);
    var until = (timeout, check, intervalResolution = 10) => create5((resolve2, reject2) => {
      const startTime = time.getUnixTime();
      const hasTimeout = timeout > 0;
      const untilInterval = () => {
        if (check()) {
          clearInterval(intervalHandle);
          resolve2();
        } else if (hasTimeout) {
          if (time.getUnixTime() - startTime > timeout) {
            clearInterval(intervalHandle);
            reject2(new Error("Timeout"));
          }
        }
      };
      const intervalHandle = setInterval(untilInterval, intervalResolution);
    });
    var untilAsync = async (check, timeout = 0, intervalResolution = 10) => {
      const startTime = time.getUnixTime();
      const noTimeout = timeout <= 0;
      while (noTimeout || time.getUnixTime() - startTime <= timeout) {
        if (await check()) return;
        await wait(intervalResolution);
      }
      throw new Error("Timeout");
    };
    var wait = (timeout) => create5((resolve2, _reject) => setTimeout(resolve2, timeout));
    var isPromise = (p) => p instanceof Promise || p && p.then && p.catch && p.finally;
    var promise = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      create: create5,
      createEmpty,
      all,
      reject,
      resolve,
      resolveWith,
      until,
      untilAsync,
      wait,
      isPromise
    });
    exports.all = all;
    exports.create = create5;
    exports.createEmpty = createEmpty;
    exports.isPromise = isPromise;
    exports.promise = promise;
    exports.reject = reject;
    exports.resolve = resolve;
    exports.resolveWith = resolveWith;
    exports.until = until;
    exports.untilAsync = untilAsync;
    exports.wait = wait;
  }
});

// ../node_modules/lib0/dist/promise.cjs
var require_promise = __commonJS({
  "../node_modules/lib0/dist/promise.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require_time_d8438852();
    var promise = require_promise_cda7b9bb();
    require_metric();
    require_math_96d5e8c4();
    exports.all = promise.all;
    exports.create = promise.create;
    exports.createEmpty = promise.createEmpty;
    exports.isPromise = promise.isPromise;
    exports.reject = promise.reject;
    exports.resolve = promise.resolve;
    exports.resolveWith = promise.resolveWith;
    exports.until = promise.until;
    exports.untilAsync = promise.untilAsync;
    exports.wait = promise.wait;
  }
});

// ../node_modules/lib0/dist/conditions-f5c0c102.cjs
var require_conditions_f5c0c102 = __commonJS({
  "../node_modules/lib0/dist/conditions-f5c0c102.cjs"(exports) {
    "use strict";
    var undefinedToNull2 = (v) => v === void 0 ? null : v;
    var conditions = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      undefinedToNull: undefinedToNull2
    });
    exports.conditions = conditions;
    exports.undefinedToNull = undefinedToNull2;
  }
});

// ../node_modules/lib0/dist/storage.cjs
var require_storage = __commonJS({
  "../node_modules/lib0/dist/storage.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VarStoragePolyfill2 = class {
      constructor() {
        this.map = /* @__PURE__ */ new Map();
      }
      /**
       * @param {string} key
       * @param {any} newValue
       */
      setItem(key, newValue) {
        this.map.set(key, newValue);
      }
      /**
       * @param {string} key
       */
      getItem(key) {
        return this.map.get(key);
      }
    };
    var _localStorage2 = new VarStoragePolyfill2();
    var usePolyfill2 = true;
    try {
      if (typeof localStorage !== "undefined" && localStorage) {
        _localStorage2 = localStorage;
        usePolyfill2 = false;
      }
    } catch (e) {
    }
    var varStorage2 = _localStorage2;
    var onChange2 = (eventHandler) => usePolyfill2 || addEventListener(
      "storage",
      /** @type {any} */
      eventHandler
    );
    var offChange2 = (eventHandler) => usePolyfill2 || removeEventListener(
      "storage",
      /** @type {any} */
      eventHandler
    );
    exports.offChange = offChange2;
    exports.onChange = onChange2;
    exports.varStorage = varStorage2;
  }
});

// ../node_modules/lib0/dist/equality.cjs
var require_equality = __commonJS({
  "../node_modules/lib0/dist/equality.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EqualityTraitSymbol2 = Symbol("Equality");
    var equals2 = (a, b) => a === b || !!a?.[EqualityTraitSymbol2]?.(b) || false;
    exports.EqualityTraitSymbol = EqualityTraitSymbol2;
    exports.equals = equals2;
  }
});

// ../node_modules/lib0/dist/object-c0c9435b.cjs
var require_object_c0c9435b = __commonJS({
  "../node_modules/lib0/dist/object-c0c9435b.cjs"(exports) {
    "use strict";
    var equality = require_equality();
    var create5 = () => /* @__PURE__ */ Object.create(null);
    var isObject2 = (o) => typeof o === "object";
    var assign = Object.assign;
    var keys2 = Object.keys;
    var values = Object.values;
    var forEach2 = (obj, f) => {
      for (const key in obj) {
        f(obj[key], key);
      }
    };
    var map3 = (obj, f) => {
      const results = [];
      for (const key in obj) {
        results.push(f(obj[key], key));
      }
      return results;
    };
    var length2 = (obj) => keys2(obj).length;
    var size2 = (obj) => keys2(obj).length;
    var some2 = (obj, f) => {
      for (const key in obj) {
        if (f(obj[key], key)) {
          return true;
        }
      }
      return false;
    };
    var isEmpty2 = (obj) => {
      for (const _k in obj) {
        return false;
      }
      return true;
    };
    var every3 = (obj, f) => {
      for (const key in obj) {
        if (!f(obj[key], key)) {
          return false;
        }
      }
      return true;
    };
    var hasProperty2 = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
    var equalFlat2 = (a, b) => a === b || size2(a) === size2(b) && every3(a, (val, key) => (val !== void 0 || hasProperty2(b, key)) && equality.equals(b[key], val));
    var freeze = Object.freeze;
    var deepFreeze = (o) => {
      for (const key in o) {
        const c = o[key];
        if (typeof c === "object" || typeof c === "function") {
          deepFreeze(o[key]);
        }
      }
      return freeze(o);
    };
    var setIfUndefined2 = (o, key, createT) => hasProperty2(o, key) ? o[key] : o[key] = createT();
    var object = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      create: create5,
      isObject: isObject2,
      assign,
      keys: keys2,
      values,
      forEach: forEach2,
      map: map3,
      length: length2,
      size: size2,
      some: some2,
      isEmpty: isEmpty2,
      every: every3,
      hasProperty: hasProperty2,
      equalFlat: equalFlat2,
      freeze,
      deepFreeze,
      setIfUndefined: setIfUndefined2
    });
    exports.assign = assign;
    exports.create = create5;
    exports.deepFreeze = deepFreeze;
    exports.equalFlat = equalFlat2;
    exports.every = every3;
    exports.forEach = forEach2;
    exports.freeze = freeze;
    exports.hasProperty = hasProperty2;
    exports.isEmpty = isEmpty2;
    exports.isObject = isObject2;
    exports.keys = keys2;
    exports.length = length2;
    exports.map = map3;
    exports.object = object;
    exports.setIfUndefined = setIfUndefined2;
    exports.size = size2;
    exports.some = some2;
    exports.values = values;
  }
});

// ../node_modules/lib0/dist/function-314580f7.cjs
var require_function_314580f7 = __commonJS({
  "../node_modules/lib0/dist/function-314580f7.cjs"(exports) {
    "use strict";
    var array = require_array_78849c95();
    var object = require_object_c0c9435b();
    var equality = require_equality();
    var callAll = (fs, args2, i = 0) => {
      try {
        for (; i < fs.length; i++) {
          fs[i](...args2);
        }
      } finally {
        if (i < fs.length) {
          callAll(fs, args2, i + 1);
        }
      }
    };
    var nop = () => {
    };
    var apply = (f) => f();
    var id = (a) => a;
    var equalityStrict = (a, b) => a === b;
    var equalityFlat = (a, b) => a === b || a != null && b != null && a.constructor === b.constructor && (array.isArray(a) && array.equalFlat(
      a,
      /** @type {Array<T>} */
      b
    ) || typeof a === "object" && object.equalFlat(a, b));
    var equalityDeep2 = (a, b) => {
      if (a === b) {
        return true;
      }
      if (a == null || b == null || a.constructor !== b.constructor && (a.constructor || Object) !== (b.constructor || Object)) {
        return false;
      }
      if (a[equality.EqualityTraitSymbol] != null) {
        return a[equality.EqualityTraitSymbol](b);
      }
      switch (a.constructor) {
        case ArrayBuffer:
          a = new Uint8Array(a);
          b = new Uint8Array(b);
        // eslint-disable-next-line no-fallthrough
        case Uint8Array: {
          if (a.byteLength !== b.byteLength) {
            return false;
          }
          for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
              return false;
            }
          }
          break;
        }
        case Set: {
          if (a.size !== b.size) {
            return false;
          }
          for (const value of a) {
            if (!b.has(value)) {
              return false;
            }
          }
          break;
        }
        case Map: {
          if (a.size !== b.size) {
            return false;
          }
          for (const key of a.keys()) {
            if (!b.has(key) || !equalityDeep2(a.get(key), b.get(key))) {
              return false;
            }
          }
          break;
        }
        case void 0:
        case Object:
          if (object.size(a) !== object.size(b)) {
            return false;
          }
          for (const key in a) {
            if (!object.hasProperty(a, key) || !equalityDeep2(a[key], b[key])) {
              return false;
            }
          }
          break;
        case Array:
          if (a.length !== b.length) {
            return false;
          }
          for (let i = 0; i < a.length; i++) {
            if (!equalityDeep2(a[i], b[i])) {
              return false;
            }
          }
          break;
        default:
          return false;
      }
      return true;
    };
    var isOneOf2 = (value, options) => options.includes(value);
    var isArray2 = array.isArray;
    var isString = (s) => s && s.constructor === String;
    var isNumber = (n) => n != null && n.constructor === Number;
    var is = (n, T) => n && n.constructor === T;
    var isTemplate = (T) => (
      /**
       * @param {any} n
       * @return {n is InstanceType<TYPE>}
       **/
      (n) => n && n.constructor === T
    );
    var _function = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      callAll,
      nop,
      apply,
      id,
      equalityStrict,
      equalityFlat,
      equalityDeep: equalityDeep2,
      isOneOf: isOneOf2,
      isArray: isArray2,
      isString,
      isNumber,
      is,
      isTemplate
    });
    exports._function = _function;
    exports.apply = apply;
    exports.callAll = callAll;
    exports.equalityDeep = equalityDeep2;
    exports.equalityFlat = equalityFlat;
    exports.equalityStrict = equalityStrict;
    exports.id = id;
    exports.is = is;
    exports.isArray = isArray2;
    exports.isNumber = isNumber;
    exports.isOneOf = isOneOf2;
    exports.isString = isString;
    exports.isTemplate = isTemplate;
    exports.nop = nop;
  }
});

// ../node_modules/lib0/dist/environment-1c97264d.cjs
var require_environment_1c97264d = __commonJS({
  "../node_modules/lib0/dist/environment-1c97264d.cjs"(exports) {
    "use strict";
    var map3 = require_map_24d263c0();
    var string2 = require_string_fddc5f8b();
    var conditions = require_conditions_f5c0c102();
    var storage = require_storage();
    var _function = require_function_314580f7();
    var isNode3 = typeof process !== "undefined" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
    var isBrowser2 = typeof window !== "undefined" && typeof document !== "undefined" && !isNode3;
    var isMac2 = typeof navigator !== "undefined" ? /Mac/.test(navigator.platform) : false;
    var params2;
    var computeParams2 = () => {
      if (params2 === void 0) {
        if (isNode3) {
          params2 = map3.create();
          const pargs = process.argv;
          let currParamName = null;
          for (let i = 0; i < pargs.length; i++) {
            const parg = pargs[i];
            if (parg[0] === "-") {
              if (currParamName !== null) {
                params2.set(currParamName, "");
              }
              currParamName = parg;
            } else {
              if (currParamName !== null) {
                params2.set(currParamName, parg);
                currParamName = null;
              }
            }
          }
          if (currParamName !== null) {
            params2.set(currParamName, "");
          }
        } else if (typeof location === "object") {
          params2 = map3.create();
          (location.search || "?").slice(1).split("&").forEach((kv) => {
            if (kv.length !== 0) {
              const [key, value] = kv.split("=");
              params2.set(`--${string2.fromCamelCase(key, "-")}`, value);
              params2.set(`-${string2.fromCamelCase(key, "-")}`, value);
            }
          });
        } else {
          params2 = map3.create();
        }
      }
      return params2;
    };
    var hasParam2 = (name) => computeParams2().has(name);
    var getParam = (name, defaultVal) => computeParams2().get(name) || defaultVal;
    var getVariable2 = (name) => isNode3 ? conditions.undefinedToNull(process.env[name.toUpperCase().replaceAll("-", "_")]) : conditions.undefinedToNull(storage.varStorage.getItem(name));
    var getConf = (name) => computeParams2().get("--" + name) || getVariable2(name);
    var ensureConf = (name) => {
      const c = getConf(name);
      if (c == null) throw new Error(`Expected configuration "${name.toUpperCase().replaceAll("-", "_")}"`);
      return c;
    };
    var hasConf2 = (name) => hasParam2("--" + name) || getVariable2(name) !== null;
    var production2 = hasConf2("production");
    var forceColor2 = isNode3 && _function.isOneOf(process.env.FORCE_COLOR, ["true", "1", "2"]);
    var supportsColor2 = forceColor2 || !hasParam2("--no-colors") && // @todo deprecate --no-colors
    !hasConf2("no-color") && (!isNode3 || process.stdout.isTTY) && (!isNode3 || hasParam2("--color") || getVariable2("COLORTERM") !== null || (getVariable2("TERM") || "").includes("color"));
    var environment = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      isNode: isNode3,
      isBrowser: isBrowser2,
      isMac: isMac2,
      hasParam: hasParam2,
      getParam,
      getVariable: getVariable2,
      getConf,
      ensureConf,
      hasConf: hasConf2,
      production: production2,
      supportsColor: supportsColor2
    });
    exports.ensureConf = ensureConf;
    exports.environment = environment;
    exports.getConf = getConf;
    exports.getParam = getParam;
    exports.getVariable = getVariable2;
    exports.hasConf = hasConf2;
    exports.hasParam = hasParam2;
    exports.isBrowser = isBrowser2;
    exports.isMac = isMac2;
    exports.isNode = isNode3;
    exports.production = production2;
    exports.supportsColor = supportsColor2;
  }
});

// ../node_modules/lib0/dist/buffer-3e750729.cjs
var require_buffer_3e750729 = __commonJS({
  "../node_modules/lib0/dist/buffer-3e750729.cjs"(exports) {
    "use strict";
    var string2 = require_string_fddc5f8b();
    var environment = require_environment_1c97264d();
    var array = require_array_78849c95();
    var math = require_math_96d5e8c4();
    var encoding = require_encoding_1a745c43();
    var decoding = require_decoding_76e75827();
    var createUint8ArrayFromLen2 = (len) => new Uint8Array(len);
    var createUint8ArrayViewFromArrayBuffer2 = (buffer2, byteOffset, length2) => new Uint8Array(buffer2, byteOffset, length2);
    var createUint8ArrayFromArrayBuffer2 = (buffer2) => new Uint8Array(buffer2);
    var toBase64Browser2 = (bytes) => {
      let s = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        s += string2.fromCharCode(bytes[i]);
      }
      return btoa(s);
    };
    var toBase64Node2 = (bytes) => Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("base64");
    var fromBase64Browser2 = (s) => {
      const a = atob(s);
      const bytes = createUint8ArrayFromLen2(a.length);
      for (let i = 0; i < a.length; i++) {
        bytes[i] = a.charCodeAt(i);
      }
      return bytes;
    };
    var fromBase64Node2 = (s) => {
      const buf = Buffer.from(s, "base64");
      return createUint8ArrayViewFromArrayBuffer2(buf.buffer, buf.byteOffset, buf.byteLength);
    };
    var toBase642 = environment.isBrowser ? toBase64Browser2 : toBase64Node2;
    var fromBase642 = environment.isBrowser ? fromBase64Browser2 : fromBase64Node2;
    var toBase64UrlEncoded = (buf) => toBase642(buf).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
    var fromBase64UrlEncoded = (base64) => fromBase642(base64.replaceAll("-", "+").replaceAll("_", "/"));
    var toHexString = (buf) => array.map(buf, (b) => b.toString(16).padStart(2, "0")).join("");
    var fromHexString = (hex) => {
      const hlen = hex.length;
      const buf = new Uint8Array(math.ceil(hlen / 2));
      for (let i = 0; i < hlen; i += 2) {
        buf[buf.length - i / 2 - 1] = Number.parseInt(hex.slice(hlen - i - 2, hlen - i), 16);
      }
      return buf;
    };
    var copyUint8Array = (uint8Array) => {
      const newBuf = createUint8ArrayFromLen2(uint8Array.byteLength);
      newBuf.set(uint8Array);
      return newBuf;
    };
    var encodeAny = (data) => encoding.encode((encoder) => encoding.writeAny(encoder, data));
    var decodeAny = (buf) => decoding.readAny(decoding.createDecoder(buf));
    var shiftNBitsLeft = (bs, N) => {
      if (N === 0) return bs;
      bs = new Uint8Array(bs);
      bs[0] <<= N;
      for (let i = 1; i < bs.length; i++) {
        bs[i - 1] |= bs[i] >>> 8 - N;
        bs[i] <<= N;
      }
      return bs;
    };
    var buffer = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      createUint8ArrayFromLen: createUint8ArrayFromLen2,
      createUint8ArrayViewFromArrayBuffer: createUint8ArrayViewFromArrayBuffer2,
      createUint8ArrayFromArrayBuffer: createUint8ArrayFromArrayBuffer2,
      toBase64: toBase642,
      fromBase64: fromBase642,
      toBase64UrlEncoded,
      fromBase64UrlEncoded,
      toHexString,
      fromHexString,
      copyUint8Array,
      encodeAny,
      decodeAny,
      shiftNBitsLeft
    });
    exports.buffer = buffer;
    exports.copyUint8Array = copyUint8Array;
    exports.createUint8ArrayFromArrayBuffer = createUint8ArrayFromArrayBuffer2;
    exports.createUint8ArrayFromLen = createUint8ArrayFromLen2;
    exports.createUint8ArrayViewFromArrayBuffer = createUint8ArrayViewFromArrayBuffer2;
    exports.decodeAny = decodeAny;
    exports.encodeAny = encodeAny;
    exports.fromBase64 = fromBase642;
    exports.fromBase64UrlEncoded = fromBase64UrlEncoded;
    exports.fromHexString = fromHexString;
    exports.shiftNBitsLeft = shiftNBitsLeft;
    exports.toBase64 = toBase642;
    exports.toBase64UrlEncoded = toBase64UrlEncoded;
    exports.toHexString = toHexString;
  }
});

// ../node_modules/lib0/dist/buffer.cjs
var require_buffer = __commonJS({
  "../node_modules/lib0/dist/buffer.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require_string_fddc5f8b();
    require_environment_1c97264d();
    require_array_78849c95();
    require_math_96d5e8c4();
    require_encoding_1a745c43();
    require_decoding_76e75827();
    var buffer = require_buffer_3e750729();
    require_map_24d263c0();
    require_conditions_f5c0c102();
    require_storage();
    require_function_314580f7();
    require_object_c0c9435b();
    require_equality();
    require_set_5b47859e();
    require_number_1fb57bba();
    require_binary_ac8e39e2();
    require_error_0c1f634f();
    exports.copyUint8Array = buffer.copyUint8Array;
    exports.createUint8ArrayFromArrayBuffer = buffer.createUint8ArrayFromArrayBuffer;
    exports.createUint8ArrayFromLen = buffer.createUint8ArrayFromLen;
    exports.createUint8ArrayViewFromArrayBuffer = buffer.createUint8ArrayViewFromArrayBuffer;
    exports.decodeAny = buffer.decodeAny;
    exports.encodeAny = buffer.encodeAny;
    exports.fromBase64 = buffer.fromBase64;
    exports.fromBase64UrlEncoded = buffer.fromBase64UrlEncoded;
    exports.fromHexString = buffer.fromHexString;
    exports.shiftNBitsLeft = buffer.shiftNBitsLeft;
    exports.toBase64 = buffer.toBase64;
    exports.toBase64UrlEncoded = buffer.toBase64UrlEncoded;
    exports.toHexString = buffer.toHexString;
  }
});

// ../node_modules/lib0/dist/error.cjs
var require_error = __commonJS({
  "../node_modules/lib0/dist/error.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var error = require_error_0c1f634f();
    exports.assert = error.assert;
    exports.create = error.create;
    exports.methodUnimplemented = error.methodUnimplemented;
    exports.unexpectedCase = error.unexpectedCase;
  }
});

// ../node_modules/lib0/dist/binary.cjs
var require_binary = __commonJS({
  "../node_modules/lib0/dist/binary.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var binary2 = require_binary_ac8e39e2();
    exports.BIT1 = binary2.BIT1;
    exports.BIT10 = binary2.BIT10;
    exports.BIT11 = binary2.BIT11;
    exports.BIT12 = binary2.BIT12;
    exports.BIT13 = binary2.BIT13;
    exports.BIT14 = binary2.BIT14;
    exports.BIT15 = binary2.BIT15;
    exports.BIT16 = binary2.BIT16;
    exports.BIT17 = binary2.BIT17;
    exports.BIT18 = binary2.BIT18;
    exports.BIT19 = binary2.BIT19;
    exports.BIT2 = binary2.BIT2;
    exports.BIT20 = binary2.BIT20;
    exports.BIT21 = binary2.BIT21;
    exports.BIT22 = binary2.BIT22;
    exports.BIT23 = binary2.BIT23;
    exports.BIT24 = binary2.BIT24;
    exports.BIT25 = binary2.BIT25;
    exports.BIT26 = binary2.BIT26;
    exports.BIT27 = binary2.BIT27;
    exports.BIT28 = binary2.BIT28;
    exports.BIT29 = binary2.BIT29;
    exports.BIT3 = binary2.BIT3;
    exports.BIT30 = binary2.BIT30;
    exports.BIT31 = binary2.BIT31;
    exports.BIT32 = binary2.BIT32;
    exports.BIT4 = binary2.BIT4;
    exports.BIT5 = binary2.BIT5;
    exports.BIT6 = binary2.BIT6;
    exports.BIT7 = binary2.BIT7;
    exports.BIT8 = binary2.BIT8;
    exports.BIT9 = binary2.BIT9;
    exports.BITS0 = binary2.BITS0;
    exports.BITS1 = binary2.BITS1;
    exports.BITS10 = binary2.BITS10;
    exports.BITS11 = binary2.BITS11;
    exports.BITS12 = binary2.BITS12;
    exports.BITS13 = binary2.BITS13;
    exports.BITS14 = binary2.BITS14;
    exports.BITS15 = binary2.BITS15;
    exports.BITS16 = binary2.BITS16;
    exports.BITS17 = binary2.BITS17;
    exports.BITS18 = binary2.BITS18;
    exports.BITS19 = binary2.BITS19;
    exports.BITS2 = binary2.BITS2;
    exports.BITS20 = binary2.BITS20;
    exports.BITS21 = binary2.BITS21;
    exports.BITS22 = binary2.BITS22;
    exports.BITS23 = binary2.BITS23;
    exports.BITS24 = binary2.BITS24;
    exports.BITS25 = binary2.BITS25;
    exports.BITS26 = binary2.BITS26;
    exports.BITS27 = binary2.BITS27;
    exports.BITS28 = binary2.BITS28;
    exports.BITS29 = binary2.BITS29;
    exports.BITS3 = binary2.BITS3;
    exports.BITS30 = binary2.BITS30;
    exports.BITS31 = binary2.BITS31;
    exports.BITS32 = binary2.BITS32;
    exports.BITS4 = binary2.BITS4;
    exports.BITS5 = binary2.BITS5;
    exports.BITS6 = binary2.BITS6;
    exports.BITS7 = binary2.BITS7;
    exports.BITS8 = binary2.BITS8;
    exports.BITS9 = binary2.BITS9;
  }
});

// ../node_modules/lib0/dist/function.cjs
var require_function = __commonJS({
  "../node_modules/lib0/dist/function.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require_array_78849c95();
    require_object_c0c9435b();
    require_equality();
    var _function = require_function_314580f7();
    require_set_5b47859e();
    exports.apply = _function.apply;
    exports.callAll = _function.callAll;
    exports.equalityDeep = _function.equalityDeep;
    exports.equalityFlat = _function.equalityFlat;
    exports.equalityStrict = _function.equalityStrict;
    exports.id = _function.id;
    exports.is = _function.is;
    exports.isArray = _function.isArray;
    exports.isNumber = _function.isNumber;
    exports.isOneOf = _function.isOneOf;
    exports.isString = _function.isString;
    exports.isTemplate = _function.isTemplate;
    exports.nop = _function.nop;
  }
});

// ../node_modules/lib0/dist/set.cjs
var require_set = __commonJS({
  "../node_modules/lib0/dist/set.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var set2 = require_set_5b47859e();
    exports.create = set2.create;
    exports.first = set2.first;
    exports.from = set2.from;
    exports.toArray = set2.toArray;
  }
});

// ../node_modules/lib0/dist/pair-ab022bc3.cjs
var require_pair_ab022bc3 = __commonJS({
  "../node_modules/lib0/dist/pair-ab022bc3.cjs"(exports) {
    "use strict";
    var Pair3 = class {
      /**
       * @param {L} left
       * @param {R} right
       */
      constructor(left, right) {
        this.left = left;
        this.right = right;
      }
    };
    var create5 = (left, right) => new Pair3(left, right);
    var createReversed = (right, left) => new Pair3(left, right);
    var forEach2 = (arr, f) => arr.forEach((p) => f(p.left, p.right));
    var map3 = (arr, f) => arr.map((p) => f(p.left, p.right));
    var pair = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      Pair: Pair3,
      create: create5,
      createReversed,
      forEach: forEach2,
      map: map3
    });
    exports.Pair = Pair3;
    exports.create = create5;
    exports.createReversed = createReversed;
    exports.forEach = forEach2;
    exports.map = map3;
    exports.pair = pair;
  }
});

// ../node_modules/lib0/dist/prng-37d48618.cjs
var require_prng_37d48618 = __commonJS({
  "../node_modules/lib0/dist/prng-37d48618.cjs"(exports) {
    "use strict";
    var binary2 = require_binary_ac8e39e2();
    var string2 = require_string_fddc5f8b();
    var math = require_math_96d5e8c4();
    var buffer = require_buffer_3e750729();
    var Xorshift32 = class {
      /**
       * @param {number} seed Unsigned 32 bit number
       */
      constructor(seed) {
        this.seed = seed;
        this._state = seed;
      }
      /**
       * Generate a random signed integer.
       *
       * @return {Number} A 32 bit signed integer.
       */
      next() {
        let x = this._state;
        x ^= x << 13;
        x ^= x >> 17;
        x ^= x << 5;
        this._state = x;
        return (x >>> 0) / (binary2.BITS32 + 1);
      }
    };
    var Xoroshiro128plus = class {
      /**
       * @param {number} seed Unsigned 32 bit number
       */
      constructor(seed) {
        this.seed = seed;
        const xorshift32 = new Xorshift32(seed);
        this.state = new Uint32Array(4);
        for (let i = 0; i < 4; i++) {
          this.state[i] = xorshift32.next() * binary2.BITS32;
        }
        this._fresh = true;
      }
      /**
       * @return {number} Float/Double in [0,1)
       */
      next() {
        const state = this.state;
        if (this._fresh) {
          this._fresh = false;
          return (state[0] + state[2] >>> 0) / (binary2.BITS32 + 1);
        } else {
          this._fresh = true;
          const s0 = state[0];
          const s1 = state[1];
          const s2 = state[2] ^ s0;
          const s3 = state[3] ^ s1;
          state[0] = (s1 << 23 | s0 >>> 9) ^ s2 ^ (s2 << 14 | s3 >>> 18);
          state[1] = (s0 << 23 | s1 >>> 9) ^ s3 ^ s3 << 14;
          state[2] = s3 << 4 | s2 >>> 28;
          state[3] = s2 << 4 | s3 >>> 28;
          return (state[1] + state[3] >>> 0) / (binary2.BITS32 + 1);
        }
      }
    };
    var DefaultPRNG = Xoroshiro128plus;
    var create5 = (seed) => new DefaultPRNG(seed);
    var bool2 = (gen) => gen.next() >= 0.5;
    var int532 = (gen, min2, max2) => math.floor(gen.next() * (max2 + 1 - min2) + min2);
    var uint53 = (gen, min2, max2) => math.abs(int532(gen, min2, max2));
    var int322 = (gen, min2, max2) => math.floor(gen.next() * (max2 + 1 - min2) + min2);
    var uint32 = (gen, min2, max2) => int322(gen, min2, max2) >>> 0;
    var int312 = (gen, min2, max2) => int322(gen, min2, max2);
    var real53 = (gen) => gen.next();
    var char = (gen) => string2.fromCharCode(int312(gen, 32, 126));
    var letter2 = (gen) => string2.fromCharCode(int312(gen, 97, 122));
    var word2 = (gen, minLen = 0, maxLen = 20) => {
      const len = int312(gen, minLen, maxLen);
      let str = "";
      for (let i = 0; i < len; i++) {
        str += letter2(gen);
      }
      return str;
    };
    var utf16Rune = (gen) => {
      const codepoint = int312(gen, 0, 256);
      return string2.fromCodePoint(codepoint);
    };
    var utf16String = (gen, maxlen = 20) => {
      const len = int312(gen, 0, maxlen);
      let str = "";
      for (let i = 0; i < len; i++) {
        str += utf16Rune(gen);
      }
      return str;
    };
    var oneOf2 = (gen, array) => array[int312(gen, 0, array.length - 1)];
    var uint8Array = (gen, len) => {
      const buf = buffer.createUint8ArrayFromLen(len);
      for (let i = 0; i < buf.length; i++) {
        buf[i] = int322(gen, 0, binary2.BITS8);
      }
      return buf;
    };
    var uint16Array = (gen, len) => new Uint16Array(uint8Array(gen, len * 2).buffer);
    var uint32Array = (gen, len) => new Uint32Array(uint8Array(gen, len * 4).buffer);
    var prng = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      DefaultPRNG,
      create: create5,
      bool: bool2,
      int53: int532,
      uint53,
      int32: int322,
      uint32,
      int31: int312,
      real53,
      char,
      letter: letter2,
      word: word2,
      utf16Rune,
      utf16String,
      oneOf: oneOf2,
      uint8Array,
      uint16Array,
      uint32Array
    });
    exports.DefaultPRNG = DefaultPRNG;
    exports.bool = bool2;
    exports.char = char;
    exports.create = create5;
    exports.int31 = int312;
    exports.int32 = int322;
    exports.int53 = int532;
    exports.letter = letter2;
    exports.oneOf = oneOf2;
    exports.prng = prng;
    exports.real53 = real53;
    exports.uint16Array = uint16Array;
    exports.uint32 = uint32;
    exports.uint32Array = uint32Array;
    exports.uint53 = uint53;
    exports.uint8Array = uint8Array;
    exports.utf16Rune = utf16Rune;
    exports.utf16String = utf16String;
    exports.word = word2;
  }
});

// ../node_modules/lib0/dist/schema.cjs
var require_schema = __commonJS({
  "../node_modules/lib0/dist/schema.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var object = require_object_c0c9435b();
    var array = require_array_78849c95();
    var error = require_error_0c1f634f();
    var environment = require_environment_1c97264d();
    var equality = require_equality();
    var _function = require_function_314580f7();
    var string2 = require_string_fddc5f8b();
    var prng = require_prng_37d48618();
    var number = require_number_1fb57bba();
    require_set_5b47859e();
    require_map_24d263c0();
    require_conditions_f5c0c102();
    require_storage();
    require_binary_ac8e39e2();
    require_math_96d5e8c4();
    require_buffer_3e750729();
    require_encoding_1a745c43();
    require_decoding_76e75827();
    var schemaSymbol2 = Symbol("0schema");
    var ValidationError2 = class {
      constructor() {
        this._rerrs = [];
      }
      /**
       * @param {string?} path
       * @param {string} expected
       * @param {string} has
       * @param {string?} message
       */
      extend(path, expected, has, message = null) {
        this._rerrs.push({ path, expected, has, message });
      }
      toString() {
        const s = [];
        for (let i = this._rerrs.length - 1; i > 0; i--) {
          const r = this._rerrs[i];
          s.push(string2.repeat(" ", (this._rerrs.length - i) * 2) + `${r.path != null ? `[${r.path}] ` : ""}${r.has} doesn't match ${r.expected}. ${r.message}`);
        }
        return s.join("\n");
      }
    };
    var shapeExtends2 = (a, b) => {
      if (a === b) return true;
      if (a == null || b == null || a.constructor !== b.constructor) return false;
      if (a[equality.EqualityTraitSymbol]) return equality.equals(a, b);
      if (array.isArray(a)) {
        return array.every(
          a,
          (aitem) => array.some(b, (bitem) => shapeExtends2(aitem, bitem))
        );
      } else if (object.isObject(a)) {
        return object.every(
          a,
          (aitem, akey) => shapeExtends2(aitem, b[akey])
        );
      }
      return false;
    };
    var Schema3 = class {
      // this.shape must not be defined on Schema. Otherwise typecheck on metatypes (e.g. $$object) won't work as expected anymore
      /**
       * If true, the more things are added to the shape the more objects this schema will accept (e.g.
       * union). By default, the more objects are added, the the fewer objects this schema will accept.
       * @protected
       */
      static _dilutes = false;
      /**
       * @param {Schema<any>} other
       */
      extends(other) {
        let [a, b] = [
          /** @type {any} */
          this.shape,
          /** @type {any} */
          other.shape
        ];
        if (
          /** @type {typeof Schema<any>} */
          this.constructor._dilutes
        ) [b, a] = [a, b];
        return shapeExtends2(a, b);
      }
      /**
       * Overwrite this when necessary. By default, we only check the `shape` property which every shape
       * should have.
       * @param {Schema<any>} other
       */
      equals(other) {
        return this.constructor === other.constructor && _function.equalityDeep(this.shape, other.shape);
      }
      [schemaSymbol2]() {
        return true;
      }
      /**
       * @param {object} other
       */
      [equality.EqualityTraitSymbol](other) {
        return this.equals(
          /** @type {any} */
          other
        );
      }
      /**
       * Use `schema.validate(obj)` with a typed parameter that is already of typed to be an instance of
       * Schema. Validate will check the structure of the parameter and return true iff the instance
       * really is an instance of Schema.
       *
       * @param {T} o
       * @return {boolean}
       */
      validate(o) {
        return this.check(o);
      }
      /* c8 ignore start */
      /**
       * Similar to validate, but this method accepts untyped parameters.
       *
       * @param {any} _o
       * @param {ValidationError} [_err]
       * @return {_o is T}
       */
      check(_o, _err) {
        error.methodUnimplemented();
      }
      /* c8 ignore stop */
      /**
       * @type {Schema<T?>}
       */
      get nullable() {
        return $union2(this, $null2);
      }
      /**
       * @type {$Optional<Schema<T>>}
       */
      get optional() {
        return new $Optional2(
          /** @type {Schema<T>} */
          this
        );
      }
      /**
       * Cast a variable to a specific type. Returns the casted value, or throws an exception otherwise.
       * Use this if you know that the type is of a specific type and you just want to convince the type
       * system.
       *
       * **Do not rely on these error messages!**
       * Performs an assertion check only if not in a production environment.
       *
       * @template OO
       * @param {OO} o
       * @return {Extract<OO, T> extends never ? T : (OO extends Array<never> ? T : Extract<OO,T>)}
       */
      cast(o) {
        assert2(o, this);
        return (
          /** @type {any} */
          o
        );
      }
      /**
       * EXPECTO PATRONUM!! 🪄
       * This function protects against type errors. Though it may not work in the real world.
       *
       * "After all this time?"
       * "Always." - Snape, talking about type safety
       *
       * Ensures that a variable is a a specific type. Returns the value, or throws an exception if the assertion check failed.
       * Use this if you know that the type is of a specific type and you just want to convince the type
       * system.
       *
       * Can be useful when defining lambdas: `s.lambda(s.$number, s.$void).expect((n) => n + 1)`
       *
       * **Do not rely on these error messages!**
       * Performs an assertion check if not in a production environment.
       *
       * @param {T} o
       * @return {o extends T ? T : never}
       */
      expect(o) {
        assert2(o, this);
        return o;
      }
    };
    var $ConstructedBy2 = class extends Schema3 {
      /**
       * @param {C} c
       * @param {((o:Instance<C>)=>boolean)|null} check
       */
      constructor(c, check) {
        super();
        this.shape = c;
        this._c = check;
      }
      /**
       * @param {any} o
       * @param {ValidationError} [err]
       * @return {o is C extends ((...args:any[]) => infer T) ? T : (C extends (new (...args:any[]) => any) ? InstanceType<C> : never)} o
       */
      check(o, err = void 0) {
        const c = o?.constructor === this.shape && (this._c == null || this._c(o));
        !c && err?.extend(null, this.shape.name, o?.constructor.name, o?.constructor !== this.shape ? "Constructor match failed" : "Check failed");
        return c;
      }
    };
    var $constructedBy2 = (c, check = null) => new $ConstructedBy2(c, check);
    var $$constructedBy2 = $constructedBy2($ConstructedBy2);
    var $Custom2 = class extends Schema3 {
      /**
       * @param {(o:any) => boolean} check
       */
      constructor(check) {
        super();
        this.shape = check;
      }
      /**
       * @param {any} o
       * @param {ValidationError} err
       * @return {o is any}
       */
      check(o, err) {
        const c = this.shape(o);
        !c && err?.extend(null, "custom prop", o?.constructor.name, "failed to check custom prop");
        return c;
      }
    };
    var $custom2 = (check) => new $Custom2(check);
    var $$custom2 = $constructedBy2($Custom2);
    var $Literal2 = class extends Schema3 {
      /**
       * @param {Array<T>} literals
       */
      constructor(literals) {
        super();
        this.shape = literals;
      }
      /**
       *
       * @param {any} o
       * @param {ValidationError} [err]
       * @return {o is T}
       */
      check(o, err) {
        const c = this.shape.some((a) => a === o);
        !c && err?.extend(null, this.shape.join(" | "), o.toString());
        return c;
      }
    };
    var $literal2 = (...literals) => new $Literal2(literals);
    var $$literal2 = $constructedBy2($Literal2);
    var _regexEscape2 = (
      /** @type {any} */
      RegExp.escape || /** @type {(str:string) => string} */
      ((str) => str.replace(/[().|&,$^[\]]/g, (s) => "\\" + s))
    );
    var _schemaStringTemplateToRegex2 = (s) => {
      if ($string2.check(s)) {
        return [_regexEscape2(s)];
      }
      if ($$literal2.check(s)) {
        return (
          /** @type {Array<string|number>} */
          s.shape.map((v) => v + "")
        );
      }
      if ($$number2.check(s)) {
        return ["[+-]?\\d+.?\\d*"];
      }
      if ($$string2.check(s)) {
        return [".*"];
      }
      if ($$union2.check(s)) {
        return s.shape.map(_schemaStringTemplateToRegex2).flat(1);
      }
      error.unexpectedCase();
    };
    var $StringTemplate2 = class extends Schema3 {
      /**
       * @param {T} shape
       */
      constructor(shape) {
        super();
        this.shape = shape;
        this._r = new RegExp("^" + shape.map(_schemaStringTemplateToRegex2).map((opts) => `(${opts.join("|")})`).join("") + "$");
      }
      /**
       * @param {any} o
       * @param {ValidationError} [err]
       * @return {o is CastStringTemplateArgsToTemplate<T>}
       */
      check(o, err) {
        const c = this._r.exec(o) != null;
        !c && err?.extend(null, this._r.toString(), o.toString(), "String doesn't match string template.");
        return c;
      }
    };
    var $stringTemplate = (...literals) => new $StringTemplate2(literals);
    var $$stringTemplate2 = $constructedBy2($StringTemplate2);
    var isOptionalSymbol2 = Symbol("optional");
    var $Optional2 = class extends Schema3 {
      /**
       * @param {S} shape
       */
      constructor(shape) {
        super();
        this.shape = shape;
      }
      /**
       * @param {any} o
       * @param {ValidationError} [err]
       * @return {o is (Unwrap<S>|undefined)}
       */
      check(o, err) {
        const c = o === void 0 || this.shape.check(o);
        !c && err?.extend(null, "undefined (optional)", "()");
        return c;
      }
      get [isOptionalSymbol2]() {
        return true;
      }
    };
    var $$optional2 = $constructedBy2($Optional2);
    var $Never2 = class extends Schema3 {
      /**
       * @param {any} _o
       * @param {ValidationError} [err]
       * @return {_o is never}
       */
      check(_o, err) {
        err?.extend(null, "never", typeof _o);
        return false;
      }
    };
    var $never2 = new $Never2();
    var $$never2 = $constructedBy2($Never2);
    var $Object2 = class _$Object extends Schema3 {
      /**
       * @param {S} shape
       * @param {boolean} partial
       */
      constructor(shape, partial = false) {
        super();
        this.shape = shape;
        this._isPartial = partial;
      }
      static _dilutes = true;
      /**
       * @type {Schema<Partial<$ObjectToType<S>>>}
       */
      get partial() {
        return new _$Object(this.shape, true);
      }
      /**
       * @param {any} o
       * @param {ValidationError} err
       * @return {o is $ObjectToType<S>}
       */
      check(o, err) {
        if (o == null) {
          err?.extend(null, "object", "null");
          return false;
        }
        return object.every(this.shape, (vv, vk) => {
          const c = this._isPartial && !object.hasProperty(o, vk) || vv.check(o[vk], err);
          !c && err?.extend(vk.toString(), vv.toString(), typeof o[vk], "Object property does not match");
          return c;
        });
      }
    };
    var $object2 = (def) => (
      /** @type {any} */
      new $Object2(def)
    );
    var $$object2 = $constructedBy2($Object2);
    var $objectAny2 = $custom2((o) => o != null && (o.constructor === Object || o.constructor == null));
    var $Record2 = class extends Schema3 {
      /**
       * @param {Keys} keys
       * @param {Values} values
       */
      constructor(keys2, values) {
        super();
        this.shape = {
          keys: keys2,
          values
        };
      }
      /**
       * @param {any} o
       * @param {ValidationError} err
       * @return {o is { [key in Unwrap<Keys>]: Unwrap<Values> }}
       */
      check(o, err) {
        return o != null && object.every(o, (vv, vk) => {
          const ck = this.shape.keys.check(vk, err);
          !ck && err?.extend(vk + "", "Record", typeof o, ck ? "Key doesn't match schema" : "Value doesn't match value");
          return ck && this.shape.values.check(vv, err);
        });
      }
    };
    var $record2 = (keys2, values) => new $Record2(keys2, values);
    var $$record2 = $constructedBy2($Record2);
    var $Tuple2 = class extends Schema3 {
      /**
       * @param {S} shape
       */
      constructor(shape) {
        super();
        this.shape = shape;
      }
      /**
       * @param {any} o
       * @param {ValidationError} err
       * @return {o is { [K in keyof S]: S[K] extends Schema<infer Type> ? Type : never }}
       */
      check(o, err) {
        return o != null && object.every(this.shape, (vv, vk) => {
          const c = (
            /** @type {Schema<any>} */
            vv.check(o[vk], err)
          );
          !c && err?.extend(vk.toString(), "Tuple", typeof vv);
          return c;
        });
      }
    };
    var $tuple2 = (...def) => new $Tuple2(def);
    var $$tuple2 = $constructedBy2($Tuple2);
    var $Array2 = class extends Schema3 {
      /**
       * @param {Array<S>} v
       */
      constructor(v) {
        super();
        this.shape = v.length === 1 ? v[0] : new $Union2(v);
      }
      /**
       * @param {any} o
       * @param {ValidationError} [err]
       * @return {o is Array<S extends Schema<infer T> ? T : never>} o
       */
      check(o, err) {
        const c = array.isArray(o) && array.every(o, (oi) => this.shape.check(oi));
        !c && err?.extend(null, "Array", "");
        return c;
      }
    };
    var $array2 = (...def) => new $Array2(def);
    var $$array2 = $constructedBy2($Array2);
    var $arrayAny2 = $custom2((o) => array.isArray(o));
    var $InstanceOf2 = class extends Schema3 {
      /**
       * @param {new (...args:any) => T} constructor
       * @param {((o:T) => boolean)|null} check
       */
      constructor(constructor, check) {
        super();
        this.shape = constructor;
        this._c = check;
      }
      /**
       * @param {any} o
       * @param {ValidationError} err
       * @return {o is T}
       */
      check(o, err) {
        const c = o instanceof this.shape && (this._c == null || this._c(o));
        !c && err?.extend(null, this.shape.name, o?.constructor.name);
        return c;
      }
    };
    var $instanceOf2 = (c, check = null) => new $InstanceOf2(c, check);
    var $$instanceOf2 = $constructedBy2($InstanceOf2);
    var $$schema2 = $instanceOf2(Schema3);
    var $Lambda2 = class extends Schema3 {
      /**
       * @param {Args} args
       */
      constructor(args2) {
        super();
        this.len = args2.length - 1;
        this.args = $tuple2(...args2.slice(-1));
        this.res = args2[this.len];
      }
      /**
       * @param {any} f
       * @param {ValidationError} err
       * @return {f is _LArgsToLambdaDef<Args>}
       */
      check(f, err) {
        const c = f.constructor === Function && f.length <= this.len;
        !c && err?.extend(null, "function", typeof f);
        return c;
      }
    };
    var $lambda = (...args2) => new $Lambda2(args2.length > 0 ? args2 : [$void2]);
    var $$lambda2 = $constructedBy2($Lambda2);
    var $function2 = $custom2((o) => typeof o === "function");
    var $Intersection2 = class extends Schema3 {
      /**
       * @param {T} v
       */
      constructor(v) {
        super();
        this.shape = v;
      }
      /**
       * @param {any} o
       * @param {ValidationError} [err]
       * @return {o is Intersect<UnwrapArray<T>>}
       */
      check(o, err) {
        const c = array.every(this.shape, (check) => check.check(o, err));
        !c && err?.extend(null, "Intersectinon", typeof o);
        return c;
      }
    };
    var $intersect = (...def) => new $Intersection2(def);
    var $$intersect2 = $constructedBy2($Intersection2, (o) => o.shape.length > 0);
    var $Union2 = class extends Schema3 {
      static _dilutes = true;
      /**
       * @param {Array<Schema<S>>} v
       */
      constructor(v) {
        super();
        this.shape = v;
      }
      /**
       * @param {any} o
       * @param {ValidationError} [err]
       * @return {o is S}
       */
      check(o, err) {
        const c = array.some(this.shape, (vv) => vv.check(o, err));
        err?.extend(null, "Union", typeof o);
        return c;
      }
    };
    var $union2 = (...schemas2) => schemas2.findIndex(($s) => $$union2.check($s)) >= 0 ? $union2(...schemas2.map(($s) => $2($s)).map(($s) => $$union2.check($s) ? $s.shape : [$s]).flat(1)) : schemas2.length === 1 ? schemas2[0] : new $Union2(schemas2);
    var $$union2 = (
      /** @type {Schema<$Union<any>>} */
      $constructedBy2($Union2)
    );
    var _t2 = () => true;
    var $any2 = $custom2(_t2);
    var $$any2 = (
      /** @type {Schema<Schema<any>>} */
      $constructedBy2($Custom2, (o) => o.shape === _t2)
    );
    var $bigint2 = $custom2((o) => typeof o === "bigint");
    var $$bigint2 = (
      /** @type {Schema<Schema<BigInt>>} */
      $custom2((o) => o === $bigint2)
    );
    var $symbol2 = $custom2((o) => typeof o === "symbol");
    var $$symbol2 = (
      /** @type {Schema<Schema<Symbol>>} */
      $custom2((o) => o === $symbol2)
    );
    var $number2 = $custom2((o) => typeof o === "number");
    var $$number2 = (
      /** @type {Schema<Schema<number>>} */
      $custom2((o) => o === $number2)
    );
    var $string2 = $custom2((o) => typeof o === "string");
    var $$string2 = (
      /** @type {Schema<Schema<string>>} */
      $custom2((o) => o === $string2)
    );
    var $boolean2 = $custom2((o) => typeof o === "boolean");
    var $$boolean2 = (
      /** @type {Schema<Schema<Boolean>>} */
      $custom2((o) => o === $boolean2)
    );
    var $undefined2 = $literal2(void 0);
    var $$undefined2 = (
      /** @type {Schema<Schema<undefined>>} */
      $constructedBy2($Literal2, (o) => o.shape.length === 1 && o.shape[0] === void 0)
    );
    var $void2 = $literal2(void 0);
    var $$void = (
      /** @type {Schema<Schema<void>>} */
      $$undefined2
    );
    var $null2 = $literal2(null);
    var $$null2 = (
      /** @type {Schema<Schema<null>>} */
      $constructedBy2($Literal2, (o) => o.shape.length === 1 && o.shape[0] === null)
    );
    var $uint8Array2 = $constructedBy2(Uint8Array);
    var $$uint8Array2 = (
      /** @type {Schema<Schema<Uint8Array>>} */
      $constructedBy2($ConstructedBy2, (o) => o.shape === Uint8Array)
    );
    var $primitive2 = $union2($number2, $string2, $null2, $undefined2, $bigint2, $boolean2, $symbol2);
    var $json2 = (() => {
      const $jsonArr = (
        /** @type {$Array<$any>} */
        $array2($any2)
      );
      const $jsonRecord = (
        /** @type {$Record<$string,$any>} */
        $record2($string2, $any2)
      );
      const $json3 = $union2($number2, $string2, $null2, $boolean2, $jsonArr, $jsonRecord);
      $jsonArr.shape = $json3;
      $jsonRecord.shape.values = $json3;
      return $json3;
    })();
    var $2 = (o) => {
      if ($$schema2.check(o)) {
        return (
          /** @type {any} */
          o
        );
      } else if ($objectAny2.check(o)) {
        const o2 = {};
        for (const k in o) {
          o2[k] = $2(o[k]);
        }
        return (
          /** @type {any} */
          $object2(o2)
        );
      } else if ($arrayAny2.check(o)) {
        return (
          /** @type {any} */
          $union2(...o.map($2))
        );
      } else if ($primitive2.check(o)) {
        return (
          /** @type {any} */
          $literal2(o)
        );
      } else if ($function2.check(o)) {
        return (
          /** @type {any} */
          $constructedBy2(
            /** @type {any} */
            o
          )
        );
      }
      error.unexpectedCase();
    };
    var assert2 = environment.production ? () => {
    } : (o, schema4) => {
      const err = new ValidationError2();
      if (!schema4.check(o, err)) {
        throw error.create(`Expected value to be of type ${schema4.constructor.name}.
${err.toString()}`);
      }
    };
    var PatternMatcher2 = class {
      /**
       * @param {Schema<State>} [$state]
       */
      constructor($state) {
        this.patterns = [];
        this.$state = $state;
      }
      /**
       * @template P
       * @template R
       * @param {P} pattern
       * @param {(o:NoInfer<Unwrap<ReadSchema<P>>>,s:State)=>R} handler
       * @return {PatternMatcher<State,Patterns|Pattern<Unwrap<ReadSchema<P>>,R>>}
       */
      if(pattern, handler) {
        this.patterns.push({ if: $2(pattern), h: handler });
        return this;
      }
      /**
       * @template R
       * @param {(o:any,s:State)=>R} h
       */
      else(h) {
        return this.if($any2, h);
      }
      /**
       * @return {State extends undefined
       *   ? <In extends Unwrap<Patterns['if']>>(o:In,state?:undefined)=>PatternMatchResult<Patterns,In>
       *   : <In extends Unwrap<Patterns['if']>>(o:In,state:State)=>PatternMatchResult<Patterns,In>}
       */
      done() {
        return (
          /** @type {any} */
          (o, s) => {
            for (let i = 0; i < this.patterns.length; i++) {
              const p = this.patterns[i];
              if (p.if.check(o)) {
                return p.h(o, s);
              }
            }
            throw error.create("Unhandled pattern");
          }
        );
      }
    };
    var match2 = (state) => new PatternMatcher2(
      /** @type {any} */
      state
    );
    var _random2 = (
      /** @type {any} */
      match2(
        /** @type {Schema<prng.PRNG>} */
        $any2
      ).if($$number2, (_o, gen) => prng.int53(gen, number.MIN_SAFE_INTEGER, number.MAX_SAFE_INTEGER)).if($$string2, (_o, gen) => prng.word(gen)).if($$boolean2, (_o, gen) => prng.bool(gen)).if($$bigint2, (_o, gen) => BigInt(prng.int53(gen, number.MIN_SAFE_INTEGER, number.MAX_SAFE_INTEGER))).if($$union2, (o, gen) => random2(gen, prng.oneOf(gen, o.shape))).if($$object2, (o, gen) => {
        const res = {};
        for (const k in o.shape) {
          let prop = o.shape[k];
          if ($$optional2.check(prop)) {
            if (prng.bool(gen)) {
              continue;
            }
            prop = prop.shape;
          }
          res[k] = _random2(prop, gen);
        }
        return res;
      }).if($$array2, (o, gen) => {
        const arr = [];
        const n = prng.int32(gen, 0, 42);
        for (let i = 0; i < n; i++) {
          arr.push(random2(gen, o.shape));
        }
        return arr;
      }).if($$literal2, (o, gen) => {
        return prng.oneOf(gen, o.shape);
      }).if($$null2, (o, gen) => {
        return null;
      }).if($$lambda2, (o, gen) => {
        const res = random2(gen, o.res);
        return () => res;
      }).if($$any2, (o, gen) => random2(gen, prng.oneOf(gen, [
        $number2,
        $string2,
        $null2,
        $undefined2,
        $bigint2,
        $boolean2,
        $array2($number2),
        $record2($union2("a", "b", "c"), $number2)
      ]))).if($$record2, (o, gen) => {
        const res = {};
        const keysN = prng.int53(gen, 0, 3);
        for (let i = 0; i < keysN; i++) {
          const key = random2(gen, o.shape.keys);
          const val = random2(gen, o.shape.values);
          res[key] = val;
        }
        return res;
      }).done()
    );
    var random2 = (gen, schema4) => (
      /** @type {any} */
      _random2($2(schema4), gen)
    );
    exports.$ = $2;
    exports.$$any = $$any2;
    exports.$$array = $$array2;
    exports.$$bigint = $$bigint2;
    exports.$$boolean = $$boolean2;
    exports.$$constructedBy = $$constructedBy2;
    exports.$$custom = $$custom2;
    exports.$$instanceOf = $$instanceOf2;
    exports.$$intersect = $$intersect2;
    exports.$$lambda = $$lambda2;
    exports.$$literal = $$literal2;
    exports.$$never = $$never2;
    exports.$$null = $$null2;
    exports.$$number = $$number2;
    exports.$$object = $$object2;
    exports.$$optional = $$optional2;
    exports.$$record = $$record2;
    exports.$$schema = $$schema2;
    exports.$$string = $$string2;
    exports.$$stringTemplate = $$stringTemplate2;
    exports.$$symbol = $$symbol2;
    exports.$$tuple = $$tuple2;
    exports.$$uint8Array = $$uint8Array2;
    exports.$$undefined = $$undefined2;
    exports.$$union = $$union2;
    exports.$$void = $$void;
    exports.$Array = $Array2;
    exports.$ConstructedBy = $ConstructedBy2;
    exports.$Custom = $Custom2;
    exports.$InstanceOf = $InstanceOf2;
    exports.$Intersection = $Intersection2;
    exports.$Lambda = $Lambda2;
    exports.$Literal = $Literal2;
    exports.$Object = $Object2;
    exports.$Record = $Record2;
    exports.$StringTemplate = $StringTemplate2;
    exports.$Tuple = $Tuple2;
    exports.$Union = $Union2;
    exports.$any = $any2;
    exports.$array = $array2;
    exports.$arrayAny = $arrayAny2;
    exports.$bigint = $bigint2;
    exports.$boolean = $boolean2;
    exports.$constructedBy = $constructedBy2;
    exports.$custom = $custom2;
    exports.$function = $function2;
    exports.$instanceOf = $instanceOf2;
    exports.$intersect = $intersect;
    exports.$json = $json2;
    exports.$lambda = $lambda;
    exports.$literal = $literal2;
    exports.$never = $never2;
    exports.$null = $null2;
    exports.$number = $number2;
    exports.$object = $object2;
    exports.$objectAny = $objectAny2;
    exports.$primitive = $primitive2;
    exports.$record = $record2;
    exports.$string = $string2;
    exports.$stringTemplate = $stringTemplate;
    exports.$symbol = $symbol2;
    exports.$tuple = $tuple2;
    exports.$uint8Array = $uint8Array2;
    exports.$undefined = $undefined2;
    exports.$union = $union2;
    exports.$void = $void2;
    exports.PatternMatcher = PatternMatcher2;
    exports.Schema = Schema3;
    exports.ValidationError = ValidationError2;
    exports.assert = assert2;
    exports.match = match2;
    exports.random = random2;
  }
});

// ../node_modules/lib0/dist/dom-7e625b09.cjs
var require_dom_7e625b09 = __commonJS({
  "../node_modules/lib0/dist/dom-7e625b09.cjs"(exports) {
    "use strict";
    var pair = require_pair_ab022bc3();
    var map3 = require_map_24d263c0();
    var schema4 = require_schema();
    var doc2 = (
      /** @type {Document} */
      typeof document !== "undefined" ? document : {}
    );
    var createElement2 = (name) => doc2.createElement(name);
    var createDocumentFragment2 = () => doc2.createDocumentFragment();
    var $fragment2 = schema4.$custom((el) => el.nodeType === DOCUMENT_FRAGMENT_NODE2);
    var createTextNode2 = (text3) => doc2.createTextNode(text3);
    var domParser2 = (
      /** @type {DOMParser} */
      typeof DOMParser !== "undefined" ? new DOMParser() : null
    );
    var emitCustomEvent = (el, name, opts) => el.dispatchEvent(new CustomEvent(name, opts));
    var setAttributes2 = (el, attrs) => {
      pair.forEach(attrs, (key, value) => {
        if (value === false) {
          el.removeAttribute(key);
        } else if (value === true) {
          el.setAttribute(key, "");
        } else {
          el.setAttribute(key, value);
        }
      });
      return el;
    };
    var setAttributesMap = (el, attrs) => {
      attrs.forEach((value, key) => {
        el.setAttribute(key, value);
      });
      return el;
    };
    var fragment2 = (children) => {
      const fragment3 = createDocumentFragment2();
      for (let i = 0; i < children.length; i++) {
        appendChild2(fragment3, children[i]);
      }
      return fragment3;
    };
    var append2 = (parent, nodes) => {
      appendChild2(parent, fragment2(nodes));
      return parent;
    };
    var remove = (el) => el.remove();
    var addEventListener2 = (el, name, f) => el.addEventListener(name, f);
    var removeEventListener2 = (el, name, f) => el.removeEventListener(name, f);
    var addEventListeners = (node, listeners) => {
      pair.forEach(listeners, (name, f) => addEventListener2(node, name, f));
      return node;
    };
    var removeEventListeners = (node, listeners) => {
      pair.forEach(listeners, (name, f) => removeEventListener2(node, name, f));
      return node;
    };
    var element2 = (name, attrs = [], children = []) => append2(setAttributes2(createElement2(name), attrs), children);
    var $element2 = schema4.$custom((el) => el.nodeType === ELEMENT_NODE2);
    var canvas = (width, height) => {
      const c = (
        /** @type {HTMLCanvasElement} */
        createElement2("canvas")
      );
      c.height = height;
      c.width = width;
      return c;
    };
    var text2 = createTextNode2;
    var $text2 = schema4.$custom((el) => el.nodeType === TEXT_NODE2);
    var pairToStyleString = (pair2) => `${pair2.left}:${pair2.right};`;
    var pairsToStyleString = (pairs2) => pairs2.map(pairToStyleString).join("");
    var mapToStyleString = (m) => map3.map(m, (value, key) => `${key}:${value};`).join("");
    var querySelector = (el, query) => el.querySelector(query);
    var querySelectorAll = (el, query) => el.querySelectorAll(query);
    var getElementById = (id) => (
      /** @type {HTMLElement} */
      doc2.getElementById(id)
    );
    var _parse = (html) => domParser2.parseFromString(`<html><body>${html}</body></html>`, "text/html").body;
    var parseFragment = (html) => fragment2(
      /** @type {any} */
      _parse(html).childNodes
    );
    var parseElement = (html) => (
      /** @type HTMLElement */
      _parse(html).firstElementChild
    );
    var replaceWith = (oldEl, newEl) => oldEl.replaceWith(newEl);
    var insertBefore = (parent, el, ref) => parent.insertBefore(el, ref);
    var appendChild2 = (parent, child) => parent.appendChild(child);
    var ELEMENT_NODE2 = doc2.ELEMENT_NODE;
    var TEXT_NODE2 = doc2.TEXT_NODE;
    var CDATA_SECTION_NODE2 = doc2.CDATA_SECTION_NODE;
    var COMMENT_NODE2 = doc2.COMMENT_NODE;
    var DOCUMENT_NODE2 = doc2.DOCUMENT_NODE;
    var DOCUMENT_TYPE_NODE2 = doc2.DOCUMENT_TYPE_NODE;
    var DOCUMENT_FRAGMENT_NODE2 = doc2.DOCUMENT_FRAGMENT_NODE;
    var $node2 = schema4.$custom((el) => el.nodeType === DOCUMENT_NODE2);
    var checkNodeType = (node, type) => node.nodeType === type;
    var isParentOf = (parent, child) => {
      let p = child.parentNode;
      while (p && p !== parent) {
        p = p.parentNode;
      }
      return p === parent;
    };
    var dom = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      doc: doc2,
      createElement: createElement2,
      createDocumentFragment: createDocumentFragment2,
      $fragment: $fragment2,
      createTextNode: createTextNode2,
      domParser: domParser2,
      emitCustomEvent,
      setAttributes: setAttributes2,
      setAttributesMap,
      fragment: fragment2,
      append: append2,
      remove,
      addEventListener: addEventListener2,
      removeEventListener: removeEventListener2,
      addEventListeners,
      removeEventListeners,
      element: element2,
      $element: $element2,
      canvas,
      text: text2,
      $text: $text2,
      pairToStyleString,
      pairsToStyleString,
      mapToStyleString,
      querySelector,
      querySelectorAll,
      getElementById,
      parseFragment,
      parseElement,
      replaceWith,
      insertBefore,
      appendChild: appendChild2,
      ELEMENT_NODE: ELEMENT_NODE2,
      TEXT_NODE: TEXT_NODE2,
      CDATA_SECTION_NODE: CDATA_SECTION_NODE2,
      COMMENT_NODE: COMMENT_NODE2,
      DOCUMENT_NODE: DOCUMENT_NODE2,
      DOCUMENT_TYPE_NODE: DOCUMENT_TYPE_NODE2,
      DOCUMENT_FRAGMENT_NODE: DOCUMENT_FRAGMENT_NODE2,
      $node: $node2,
      checkNodeType,
      isParentOf
    });
    exports.$element = $element2;
    exports.$fragment = $fragment2;
    exports.$node = $node2;
    exports.$text = $text2;
    exports.CDATA_SECTION_NODE = CDATA_SECTION_NODE2;
    exports.COMMENT_NODE = COMMENT_NODE2;
    exports.DOCUMENT_FRAGMENT_NODE = DOCUMENT_FRAGMENT_NODE2;
    exports.DOCUMENT_NODE = DOCUMENT_NODE2;
    exports.DOCUMENT_TYPE_NODE = DOCUMENT_TYPE_NODE2;
    exports.ELEMENT_NODE = ELEMENT_NODE2;
    exports.TEXT_NODE = TEXT_NODE2;
    exports.addEventListener = addEventListener2;
    exports.addEventListeners = addEventListeners;
    exports.append = append2;
    exports.appendChild = appendChild2;
    exports.canvas = canvas;
    exports.checkNodeType = checkNodeType;
    exports.createDocumentFragment = createDocumentFragment2;
    exports.createElement = createElement2;
    exports.createTextNode = createTextNode2;
    exports.doc = doc2;
    exports.dom = dom;
    exports.domParser = domParser2;
    exports.element = element2;
    exports.emitCustomEvent = emitCustomEvent;
    exports.fragment = fragment2;
    exports.getElementById = getElementById;
    exports.insertBefore = insertBefore;
    exports.isParentOf = isParentOf;
    exports.mapToStyleString = mapToStyleString;
    exports.pairToStyleString = pairToStyleString;
    exports.pairsToStyleString = pairsToStyleString;
    exports.parseElement = parseElement;
    exports.parseFragment = parseFragment;
    exports.querySelector = querySelector;
    exports.querySelectorAll = querySelectorAll;
    exports.remove = remove;
    exports.removeEventListener = removeEventListener2;
    exports.removeEventListeners = removeEventListeners;
    exports.replaceWith = replaceWith;
    exports.setAttributes = setAttributes2;
    exports.setAttributesMap = setAttributesMap;
    exports.text = text2;
  }
});

// ../node_modules/lib0/dist/json-092190a1.cjs
var require_json_092190a1 = __commonJS({
  "../node_modules/lib0/dist/json-092190a1.cjs"(exports) {
    "use strict";
    var stringify4 = JSON.stringify;
    var parse2 = JSON.parse;
    var json = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      stringify: stringify4,
      parse: parse2
    });
    exports.json = json;
    exports.parse = parse2;
    exports.stringify = stringify4;
  }
});

// ../node_modules/lib0/dist/eventloop-a0168106.cjs
var require_eventloop_a0168106 = __commonJS({
  "../node_modules/lib0/dist/eventloop-a0168106.cjs"(exports) {
    "use strict";
    var time = require_time_d8438852();
    var queue = [];
    var _runQueue = () => {
      for (let i = 0; i < queue.length; i++) {
        queue[i]();
      }
      queue = [];
    };
    var enqueue = (f) => {
      queue.push(f);
      if (queue.length === 1) {
        setTimeout(_runQueue, 0);
      }
    };
    var createTimeoutClass = (clearFunction) => class TT {
      /**
       * @param {number} timeoutId
       */
      constructor(timeoutId) {
        this._ = timeoutId;
      }
      destroy() {
        clearFunction(this._);
      }
    };
    var Timeout = createTimeoutClass(clearTimeout);
    var timeout = (timeout2, callback) => new Timeout(setTimeout(callback, timeout2));
    var Interval = createTimeoutClass(clearInterval);
    var interval = (timeout2, callback) => new Interval(setInterval(callback, timeout2));
    var Animation = createTimeoutClass((arg) => typeof requestAnimationFrame !== "undefined" && cancelAnimationFrame(arg));
    var animationFrame = (cb) => typeof requestAnimationFrame === "undefined" ? timeout(0, cb) : new Animation(requestAnimationFrame(cb));
    var Idle = createTimeoutClass((arg) => typeof cancelIdleCallback !== "undefined" && cancelIdleCallback(arg));
    var idleCallback = (cb) => typeof requestIdleCallback !== "undefined" ? new Idle(requestIdleCallback(cb)) : timeout(1e3, cb);
    var createDebouncer = (timeout2, triggerAfter = -1) => {
      let timer = -1;
      let lastCall = null;
      return (cb) => {
        clearTimeout(timer);
        if (cb) {
          if (triggerAfter >= 0) {
            const now = time.getUnixTime();
            if (lastCall === null) lastCall = now;
            if (now - lastCall > triggerAfter) {
              lastCall = null;
              timer = /** @type {any} */
              setTimeout(cb, 0);
              return;
            }
          }
          timer = /** @type {any} */
          setTimeout(() => {
            lastCall = null;
            cb();
          }, timeout2);
        } else {
          lastCall = null;
        }
      };
    };
    var eventloop = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      enqueue,
      timeout,
      interval,
      Animation,
      animationFrame,
      idleCallback,
      createDebouncer
    });
    exports.Animation = Animation;
    exports.animationFrame = animationFrame;
    exports.createDebouncer = createDebouncer;
    exports.enqueue = enqueue;
    exports.eventloop = eventloop;
    exports.idleCallback = idleCallback;
    exports.interval = interval;
    exports.timeout = timeout;
  }
});

// ../node_modules/lib0/dist/symbol-9c439012.cjs
var require_symbol_9c439012 = __commonJS({
  "../node_modules/lib0/dist/symbol-9c439012.cjs"(exports) {
    "use strict";
    var create5 = Symbol;
    var isSymbol = (s) => typeof s === "symbol";
    var symbol = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      create: create5,
      isSymbol
    });
    exports.create = create5;
    exports.isSymbol = isSymbol;
    exports.symbol = symbol;
  }
});

// ../node_modules/lib0/dist/logging.common.cjs
var require_logging_common = __commonJS({
  "../node_modules/lib0/dist/logging.common.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var symbol = require_symbol_9c439012();
    var time = require_time_d8438852();
    var environment = require_environment_1c97264d();
    var _function = require_function_314580f7();
    var json = require_json_092190a1();
    require_metric();
    require_math_96d5e8c4();
    require_map_24d263c0();
    require_string_fddc5f8b();
    require_array_78849c95();
    require_set_5b47859e();
    require_conditions_f5c0c102();
    require_storage();
    require_object_c0c9435b();
    require_equality();
    var BOLD = symbol.create();
    var UNBOLD = symbol.create();
    var BLUE = symbol.create();
    var GREY = symbol.create();
    var GREEN = symbol.create();
    var RED = symbol.create();
    var PURPLE = symbol.create();
    var ORANGE = symbol.create();
    var UNCOLOR = symbol.create();
    var computeNoColorLoggingArgs = (args2) => {
      if (args2.length === 1 && args2[0]?.constructor === Function) {
        args2 = /** @type {Array<string|Symbol|Object|number>} */
        /** @type {[function]} */
        args2[0]();
      }
      const strBuilder = [];
      const logArgs = [];
      let i = 0;
      for (; i < args2.length; i++) {
        const arg = args2[i];
        if (arg === void 0) {
          break;
        } else if (arg.constructor === String || arg.constructor === Number) {
          strBuilder.push(arg);
        } else if (arg.constructor === Object) {
          break;
        }
      }
      if (i > 0) {
        logArgs.push(strBuilder.join(""));
      }
      for (; i < args2.length; i++) {
        const arg = args2[i];
        if (!(arg instanceof Symbol)) {
          logArgs.push(arg);
        }
      }
      return logArgs;
    };
    var loggingColors = [GREEN, PURPLE, ORANGE, BLUE];
    var nextColor = 0;
    var lastLoggingTime = time.getUnixTime();
    var createModuleLogger = (_print, moduleName) => {
      const color = loggingColors[nextColor];
      const debugRegexVar = environment.getVariable("log");
      const doLogging = debugRegexVar !== null && (debugRegexVar === "*" || debugRegexVar === "true" || new RegExp(debugRegexVar, "gi").test(moduleName));
      nextColor = (nextColor + 1) % loggingColors.length;
      moduleName += ": ";
      return !doLogging ? _function.nop : (...args2) => {
        if (args2.length === 1 && args2[0]?.constructor === Function) {
          args2 = args2[0]();
        }
        const timeNow = time.getUnixTime();
        const timeDiff = timeNow - lastLoggingTime;
        lastLoggingTime = timeNow;
        _print(
          color,
          moduleName,
          UNCOLOR,
          ...args2.map((arg) => {
            if (arg != null && arg.constructor === Uint8Array) {
              arg = Array.from(arg);
            }
            const t2 = typeof arg;
            switch (t2) {
              case "string":
              case "symbol":
                return arg;
              default: {
                return json.stringify(arg);
              }
            }
          }),
          color,
          " +" + timeDiff + "ms"
        );
      };
    };
    exports.BLUE = BLUE;
    exports.BOLD = BOLD;
    exports.GREEN = GREEN;
    exports.GREY = GREY;
    exports.ORANGE = ORANGE;
    exports.PURPLE = PURPLE;
    exports.RED = RED;
    exports.UNBOLD = UNBOLD;
    exports.UNCOLOR = UNCOLOR;
    exports.computeNoColorLoggingArgs = computeNoColorLoggingArgs;
    exports.createModuleLogger = createModuleLogger;
  }
});

// ../node_modules/lib0/dist/logging.cjs
var require_logging = __commonJS({
  "../node_modules/lib0/dist/logging.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var environment = require_environment_1c97264d();
    var set2 = require_set_5b47859e();
    var pair = require_pair_ab022bc3();
    var dom = require_dom_7e625b09();
    var json = require_json_092190a1();
    var map3 = require_map_24d263c0();
    var eventloop = require_eventloop_a0168106();
    var math = require_math_96d5e8c4();
    var logging_common = require_logging_common();
    require_string_fddc5f8b();
    require_array_78849c95();
    require_conditions_f5c0c102();
    require_storage();
    require_function_314580f7();
    require_object_c0c9435b();
    require_equality();
    require_schema();
    require_error_0c1f634f();
    require_prng_37d48618();
    require_binary_ac8e39e2();
    require_buffer_3e750729();
    require_encoding_1a745c43();
    require_number_1fb57bba();
    require_decoding_76e75827();
    require_time_d8438852();
    require_metric();
    require_symbol_9c439012();
    var _browserStyleMap = {
      [logging_common.BOLD]: pair.create("font-weight", "bold"),
      [logging_common.UNBOLD]: pair.create("font-weight", "normal"),
      [logging_common.BLUE]: pair.create("color", "blue"),
      [logging_common.GREEN]: pair.create("color", "green"),
      [logging_common.GREY]: pair.create("color", "grey"),
      [logging_common.RED]: pair.create("color", "red"),
      [logging_common.PURPLE]: pair.create("color", "purple"),
      [logging_common.ORANGE]: pair.create("color", "orange"),
      // not well supported in chrome when debugging node with inspector - TODO: deprecate
      [logging_common.UNCOLOR]: pair.create("color", "black")
    };
    var computeBrowserLoggingArgs = (args2) => {
      if (args2.length === 1 && args2[0]?.constructor === Function) {
        args2 = /** @type {Array<string|Symbol|Object|number>} */
        /** @type {[function]} */
        args2[0]();
      }
      const strBuilder = [];
      const styles = [];
      const currentStyle = map3.create();
      let logArgs = [];
      let i = 0;
      for (; i < args2.length; i++) {
        const arg = args2[i];
        const style = _browserStyleMap[arg];
        if (style !== void 0) {
          currentStyle.set(style.left, style.right);
        } else {
          if (arg === void 0) {
            break;
          }
          if (arg.constructor === String || arg.constructor === Number) {
            const style2 = dom.mapToStyleString(currentStyle);
            if (i > 0 || style2.length > 0) {
              strBuilder.push("%c" + arg);
              styles.push(style2);
            } else {
              strBuilder.push(arg);
            }
          } else {
            break;
          }
        }
      }
      if (i > 0) {
        logArgs = styles;
        logArgs.unshift(strBuilder.join(""));
      }
      for (; i < args2.length; i++) {
        const arg = args2[i];
        if (!(arg instanceof Symbol)) {
          logArgs.push(arg);
        }
      }
      return logArgs;
    };
    var computeLoggingArgs = environment.supportsColor ? computeBrowserLoggingArgs : logging_common.computeNoColorLoggingArgs;
    var print = (...args2) => {
      console.log(...computeLoggingArgs(args2));
      vconsoles.forEach((vc) => vc.print(args2));
    };
    var warn2 = (...args2) => {
      console.warn(...computeLoggingArgs(args2));
      args2.unshift(logging_common.ORANGE);
      vconsoles.forEach((vc) => vc.print(args2));
    };
    var printError = (err) => {
      console.error(err);
      vconsoles.forEach((vc) => vc.printError(err));
    };
    var printImg = (url, height) => {
      if (environment.isBrowser) {
        console.log(
          "%c                      ",
          `font-size: ${height}px; background-size: contain; background-repeat: no-repeat; background-image: url(${url})`
        );
      }
      vconsoles.forEach((vc) => vc.printImg(url, height));
    };
    var printImgBase64 = (base64, height) => printImg(`data:image/gif;base64,${base64}`, height);
    var group = (...args2) => {
      console.group(...computeLoggingArgs(args2));
      vconsoles.forEach((vc) => vc.group(args2));
    };
    var groupCollapsed = (...args2) => {
      console.groupCollapsed(...computeLoggingArgs(args2));
      vconsoles.forEach((vc) => vc.groupCollapsed(args2));
    };
    var groupEnd = () => {
      console.groupEnd();
      vconsoles.forEach((vc) => vc.groupEnd());
    };
    var printDom = (createNode2) => vconsoles.forEach((vc) => vc.printDom(createNode2()));
    var printCanvas = (canvas, height) => printImg(canvas.toDataURL(), height);
    var vconsoles = set2.create();
    var _computeLineSpans = (args2) => {
      const spans = [];
      const currentStyle = /* @__PURE__ */ new Map();
      let i = 0;
      for (; i < args2.length; i++) {
        let arg = args2[i];
        const style = _browserStyleMap[arg];
        if (style !== void 0) {
          currentStyle.set(style.left, style.right);
        } else {
          if (arg === void 0) {
            arg = "undefined ";
          }
          if (arg.constructor === String || arg.constructor === Number) {
            const span = dom.element("span", [
              pair.create("style", dom.mapToStyleString(currentStyle))
            ], [dom.text(arg.toString())]);
            if (span.innerHTML === "") {
              span.innerHTML = "&nbsp;";
            }
            spans.push(span);
          } else {
            break;
          }
        }
      }
      for (; i < args2.length; i++) {
        let content = args2[i];
        if (!(content instanceof Symbol)) {
          if (content.constructor !== String && content.constructor !== Number) {
            content = " " + json.stringify(content) + " ";
          }
          spans.push(
            dom.element("span", [], [dom.text(
              /** @type {string} */
              content
            )])
          );
        }
      }
      return spans;
    };
    var lineStyle = "font-family:monospace;border-bottom:1px solid #e2e2e2;padding:2px;";
    var VConsole = class {
      /**
       * @param {Element} dom
       */
      constructor(dom2) {
        this.dom = dom2;
        this.ccontainer = this.dom;
        this.depth = 0;
        vconsoles.add(this);
      }
      /**
       * @param {Array<string|Symbol|Object|number>} args
       * @param {boolean} collapsed
       */
      group(args2, collapsed = false) {
        eventloop.enqueue(() => {
          const triangleDown = dom.element("span", [
            pair.create("hidden", collapsed),
            pair.create("style", "color:grey;font-size:120%;")
          ], [dom.text("\u25BC")]);
          const triangleRight = dom.element("span", [
            pair.create("hidden", !collapsed),
            pair.create("style", "color:grey;font-size:125%;")
          ], [dom.text("\u25B6")]);
          const content = dom.element(
            "div",
            [pair.create(
              "style",
              `${lineStyle};padding-left:${this.depth * 10}px`
            )],
            [triangleDown, triangleRight, dom.text(" ")].concat(
              _computeLineSpans(args2)
            )
          );
          const nextContainer = dom.element("div", [
            pair.create("hidden", collapsed)
          ]);
          const nextLine = dom.element("div", [], [content, nextContainer]);
          dom.append(this.ccontainer, [nextLine]);
          this.ccontainer = nextContainer;
          this.depth++;
          dom.addEventListener(content, "click", (_event) => {
            nextContainer.toggleAttribute("hidden");
            triangleDown.toggleAttribute("hidden");
            triangleRight.toggleAttribute("hidden");
          });
        });
      }
      /**
       * @param {Array<string|Symbol|Object|number>} args
       */
      groupCollapsed(args2) {
        this.group(args2, true);
      }
      groupEnd() {
        eventloop.enqueue(() => {
          if (this.depth > 0) {
            this.depth--;
            this.ccontainer = this.ccontainer.parentElement.parentElement;
          }
        });
      }
      /**
       * @param {Array<string|Symbol|Object|number>} args
       */
      print(args2) {
        eventloop.enqueue(() => {
          dom.append(this.ccontainer, [
            dom.element("div", [
              pair.create(
                "style",
                `${lineStyle};padding-left:${this.depth * 10}px`
              )
            ], _computeLineSpans(args2))
          ]);
        });
      }
      /**
       * @param {Error} err
       */
      printError(err) {
        this.print([logging_common.RED, logging_common.BOLD, err.toString()]);
      }
      /**
       * @param {string} url
       * @param {number} height
       */
      printImg(url, height) {
        eventloop.enqueue(() => {
          dom.append(this.ccontainer, [
            dom.element("img", [
              pair.create("src", url),
              pair.create("height", `${math.round(height * 1.5)}px`)
            ])
          ]);
        });
      }
      /**
       * @param {Node} node
       */
      printDom(node) {
        eventloop.enqueue(() => {
          dom.append(this.ccontainer, [node]);
        });
      }
      destroy() {
        eventloop.enqueue(() => {
          vconsoles.delete(this);
        });
      }
    };
    var createVConsole = (dom2) => new VConsole(dom2);
    var createModuleLogger = (moduleName) => logging_common.createModuleLogger(print, moduleName);
    exports.BLUE = logging_common.BLUE;
    exports.BOLD = logging_common.BOLD;
    exports.GREEN = logging_common.GREEN;
    exports.GREY = logging_common.GREY;
    exports.ORANGE = logging_common.ORANGE;
    exports.PURPLE = logging_common.PURPLE;
    exports.RED = logging_common.RED;
    exports.UNBOLD = logging_common.UNBOLD;
    exports.UNCOLOR = logging_common.UNCOLOR;
    exports.VConsole = VConsole;
    exports.createModuleLogger = createModuleLogger;
    exports.createVConsole = createVConsole;
    exports.group = group;
    exports.groupCollapsed = groupCollapsed;
    exports.groupEnd = groupEnd;
    exports.print = print;
    exports.printCanvas = printCanvas;
    exports.printDom = printDom;
    exports.printError = printError;
    exports.printImg = printImg;
    exports.printImgBase64 = printImgBase64;
    exports.vconsoles = vconsoles;
    exports.warn = warn2;
  }
});

// ../node_modules/lib0/dist/time.cjs
var require_time = __commonJS({
  "../node_modules/lib0/dist/time.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require_metric();
    require_math_96d5e8c4();
    var time = require_time_d8438852();
    exports.getDate = time.getDate;
    exports.getUnixTime = time.getUnixTime;
    exports.humanizeDuration = time.humanizeDuration;
  }
});

// ../node_modules/lib0/dist/string.cjs
var require_string = __commonJS({
  "../node_modules/lib0/dist/string.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require_array_78849c95();
    var string2 = require_string_fddc5f8b();
    require_set_5b47859e();
    exports.MAX_UTF16_CHARACTER = string2.MAX_UTF16_CHARACTER;
    exports._decodeUtf8Native = string2._decodeUtf8Native;
    exports._decodeUtf8Polyfill = string2._decodeUtf8Polyfill;
    exports._encodeUtf8Native = string2._encodeUtf8Native;
    exports._encodeUtf8Polyfill = string2._encodeUtf8Polyfill;
    exports.decodeUtf8 = string2.decodeUtf8;
    exports.encodeUtf8 = string2.encodeUtf8;
    exports.escapeHTML = string2.escapeHTML;
    exports.fromCamelCase = string2.fromCamelCase;
    exports.fromCharCode = string2.fromCharCode;
    exports.fromCodePoint = string2.fromCodePoint;
    exports.repeat = string2.repeat;
    exports.splice = string2.splice;
    exports.trimLeft = string2.trimLeft;
    exports.unescapeHTML = string2.unescapeHTML;
    exports.utf8ByteLength = string2.utf8ByteLength;
    Object.defineProperty(exports, "utf8TextDecoder", {
      enumerable: true,
      get: function() {
        return string2.utf8TextDecoder;
      }
    });
    exports.utf8TextEncoder = string2.utf8TextEncoder;
  }
});

// ../node_modules/lib0/dist/iterator-9fc627c1.cjs
var require_iterator_9fc627c1 = __commonJS({
  "../node_modules/lib0/dist/iterator-9fc627c1.cjs"(exports) {
    "use strict";
    var mapIterator = (iterator2, f) => ({
      [Symbol.iterator]() {
        return this;
      },
      // @ts-ignore
      next() {
        const r = iterator2.next();
        return { value: r.done ? void 0 : f(r.value), done: r.done };
      }
    });
    var createIterator = (next) => ({
      /**
       * @return {IterableIterator<T>}
       */
      [Symbol.iterator]() {
        return this;
      },
      // @ts-ignore
      next
    });
    var iteratorFilter = (iterator2, filter) => createIterator(() => {
      let res;
      do {
        res = iterator2.next();
      } while (!res.done && !filter(res.value));
      return res;
    });
    var iteratorMap = (iterator2, fmap) => createIterator(() => {
      const { done, value } = iterator2.next();
      return { done, value: done ? void 0 : fmap(value) };
    });
    var iterator = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      mapIterator,
      createIterator,
      iteratorFilter,
      iteratorMap
    });
    exports.createIterator = createIterator;
    exports.iterator = iterator;
    exports.iteratorFilter = iteratorFilter;
    exports.iteratorMap = iteratorMap;
    exports.mapIterator = mapIterator;
  }
});

// ../node_modules/lib0/dist/iterator.cjs
var require_iterator = __commonJS({
  "../node_modules/lib0/dist/iterator.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var iterator = require_iterator_9fc627c1();
    exports.createIterator = iterator.createIterator;
    exports.iteratorFilter = iterator.iteratorFilter;
    exports.iteratorMap = iterator.iteratorMap;
    exports.mapIterator = iterator.mapIterator;
  }
});

// ../node_modules/lib0/dist/object.cjs
var require_object = __commonJS({
  "../node_modules/lib0/dist/object.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require_equality();
    var object = require_object_c0c9435b();
    exports.assign = object.assign;
    exports.create = object.create;
    exports.deepFreeze = object.deepFreeze;
    exports.equalFlat = object.equalFlat;
    exports.every = object.every;
    exports.forEach = object.forEach;
    exports.freeze = object.freeze;
    exports.hasProperty = object.hasProperty;
    exports.isEmpty = object.isEmpty;
    exports.isObject = object.isObject;
    exports.keys = object.keys;
    exports.length = object.length;
    exports.map = object.map;
    exports.setIfUndefined = object.setIfUndefined;
    exports.size = object.size;
    exports.some = object.some;
    exports.values = object.values;
  }
});

// ../node_modules/lib0/dist/environment.cjs
var require_environment = __commonJS({
  "../node_modules/lib0/dist/environment.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require_map_24d263c0();
    require_string_fddc5f8b();
    require_conditions_f5c0c102();
    require_storage();
    require_function_314580f7();
    var environment = require_environment_1c97264d();
    require_array_78849c95();
    require_set_5b47859e();
    require_object_c0c9435b();
    require_equality();
    exports.ensureConf = environment.ensureConf;
    exports.getConf = environment.getConf;
    exports.getParam = environment.getParam;
    exports.getVariable = environment.getVariable;
    exports.hasConf = environment.hasConf;
    exports.hasParam = environment.hasParam;
    exports.isBrowser = environment.isBrowser;
    exports.isMac = environment.isMac;
    exports.isNode = environment.isNode;
    exports.production = environment.production;
    exports.supportsColor = environment.supportsColor;
  }
});

// ../node_modules/yjs/dist/yjs.cjs
var require_yjs = __commonJS({
  "../node_modules/yjs/dist/yjs.cjs"(exports) {
    "use strict";
    var observable = require_observable();
    var array = require_array();
    var math = require_math();
    var map3 = require_map();
    var encoding = require_encoding();
    var decoding = require_decoding();
    var random2 = require_random();
    var promise = require_promise();
    var buffer = require_buffer();
    var error = require_error();
    var binary2 = require_binary();
    var f = require_function();
    var set2 = require_set();
    var logging = require_logging();
    var time = require_time();
    var string2 = require_string();
    var iterator = require_iterator();
    var object = require_object();
    var env = require_environment();
    function _interopNamespaceDefault(e) {
      var n = /* @__PURE__ */ Object.create(null);
      if (e) {
        Object.keys(e).forEach(function(k) {
          if (k !== "default") {
            var d = Object.getOwnPropertyDescriptor(e, k);
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: function() {
                return e[k];
              }
            });
          }
        });
      }
      n.default = e;
      return Object.freeze(n);
    }
    var array__namespace = /* @__PURE__ */ _interopNamespaceDefault(array);
    var math__namespace = /* @__PURE__ */ _interopNamespaceDefault(math);
    var map__namespace = /* @__PURE__ */ _interopNamespaceDefault(map3);
    var encoding__namespace = /* @__PURE__ */ _interopNamespaceDefault(encoding);
    var decoding__namespace = /* @__PURE__ */ _interopNamespaceDefault(decoding);
    var random__namespace = /* @__PURE__ */ _interopNamespaceDefault(random2);
    var promise__namespace = /* @__PURE__ */ _interopNamespaceDefault(promise);
    var buffer__namespace = /* @__PURE__ */ _interopNamespaceDefault(buffer);
    var error__namespace = /* @__PURE__ */ _interopNamespaceDefault(error);
    var binary__namespace = /* @__PURE__ */ _interopNamespaceDefault(binary2);
    var f__namespace = /* @__PURE__ */ _interopNamespaceDefault(f);
    var set__namespace = /* @__PURE__ */ _interopNamespaceDefault(set2);
    var logging__namespace = /* @__PURE__ */ _interopNamespaceDefault(logging);
    var time__namespace = /* @__PURE__ */ _interopNamespaceDefault(time);
    var string__namespace = /* @__PURE__ */ _interopNamespaceDefault(string2);
    var iterator__namespace = /* @__PURE__ */ _interopNamespaceDefault(iterator);
    var object__namespace = /* @__PURE__ */ _interopNamespaceDefault(object);
    var env__namespace = /* @__PURE__ */ _interopNamespaceDefault(env);
    var AbstractConnector = class extends observable.ObservableV2 {
      /**
       * @param {Doc} ydoc
       * @param {any} awareness
       */
      constructor(ydoc, awareness) {
        super();
        this.doc = ydoc;
        this.awareness = awareness;
      }
    };
    var DeleteItem = class {
      /**
       * @param {number} clock
       * @param {number} len
       */
      constructor(clock, len) {
        this.clock = clock;
        this.len = len;
      }
    };
    var DeleteSet = class {
      constructor() {
        this.clients = /* @__PURE__ */ new Map();
      }
    };
    var iterateDeletedStructs = (transaction, ds, f2) => ds.clients.forEach((deletes, clientid) => {
      const structs = (
        /** @type {Array<GC|Item>} */
        transaction.doc.store.clients.get(clientid)
      );
      if (structs != null) {
        const lastStruct = structs[structs.length - 1];
        const clockState = lastStruct.id.clock + lastStruct.length;
        for (let i = 0, del = deletes[i]; i < deletes.length && del.clock < clockState; del = deletes[++i]) {
          iterateStructs(transaction, structs, del.clock, del.len, f2);
        }
      }
    });
    var findIndexDS = (dis, clock) => {
      let left = 0;
      let right = dis.length - 1;
      while (left <= right) {
        const midindex = math__namespace.floor((left + right) / 2);
        const mid = dis[midindex];
        const midclock = mid.clock;
        if (midclock <= clock) {
          if (clock < midclock + mid.len) {
            return midindex;
          }
          left = midindex + 1;
        } else {
          right = midindex - 1;
        }
      }
      return null;
    };
    var isDeleted = (ds, id) => {
      const dis = ds.clients.get(id.client);
      return dis !== void 0 && findIndexDS(dis, id.clock) !== null;
    };
    var sortAndMergeDeleteSet = (ds) => {
      ds.clients.forEach((dels) => {
        dels.sort((a, b) => a.clock - b.clock);
        let i, j;
        for (i = 1, j = 1; i < dels.length; i++) {
          const left = dels[j - 1];
          const right = dels[i];
          if (left.clock + left.len >= right.clock) {
            dels[j - 1] = new DeleteItem(left.clock, math__namespace.max(left.len, right.clock + right.len - left.clock));
          } else {
            if (j < i) {
              dels[j] = right;
            }
            j++;
          }
        }
        dels.length = j;
      });
    };
    var mergeDeleteSets = (dss) => {
      const merged = new DeleteSet();
      for (let dssI = 0; dssI < dss.length; dssI++) {
        dss[dssI].clients.forEach((delsLeft, client) => {
          if (!merged.clients.has(client)) {
            const dels = delsLeft.slice();
            for (let i = dssI + 1; i < dss.length; i++) {
              array__namespace.appendTo(dels, dss[i].clients.get(client) || []);
            }
            merged.clients.set(client, dels);
          }
        });
      }
      sortAndMergeDeleteSet(merged);
      return merged;
    };
    var addToDeleteSet = (ds, client, clock, length2) => {
      map__namespace.setIfUndefined(ds.clients, client, () => (
        /** @type {Array<DeleteItem>} */
        []
      )).push(new DeleteItem(clock, length2));
    };
    var createDeleteSet = () => new DeleteSet();
    var createDeleteSetFromStructStore = (ss) => {
      const ds = createDeleteSet();
      ss.clients.forEach((structs, client) => {
        const dsitems = [];
        for (let i = 0; i < structs.length; i++) {
          const struct = structs[i];
          if (struct.deleted) {
            const clock = struct.id.clock;
            let len = struct.length;
            if (i + 1 < structs.length) {
              for (let next = structs[i + 1]; i + 1 < structs.length && next.deleted; next = structs[++i + 1]) {
                len += next.length;
              }
            }
            dsitems.push(new DeleteItem(clock, len));
          }
        }
        if (dsitems.length > 0) {
          ds.clients.set(client, dsitems);
        }
      });
      return ds;
    };
    var writeDeleteSet = (encoder, ds) => {
      encoding__namespace.writeVarUint(encoder.restEncoder, ds.clients.size);
      array__namespace.from(ds.clients.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, dsitems]) => {
        encoder.resetDsCurVal();
        encoding__namespace.writeVarUint(encoder.restEncoder, client);
        const len = dsitems.length;
        encoding__namespace.writeVarUint(encoder.restEncoder, len);
        for (let i = 0; i < len; i++) {
          const item = dsitems[i];
          encoder.writeDsClock(item.clock);
          encoder.writeDsLen(item.len);
        }
      });
    };
    var readDeleteSet = (decoder) => {
      const ds = new DeleteSet();
      const numClients = decoding__namespace.readVarUint(decoder.restDecoder);
      for (let i = 0; i < numClients; i++) {
        decoder.resetDsCurVal();
        const client = decoding__namespace.readVarUint(decoder.restDecoder);
        const numberOfDeletes = decoding__namespace.readVarUint(decoder.restDecoder);
        if (numberOfDeletes > 0) {
          const dsField = map__namespace.setIfUndefined(ds.clients, client, () => (
            /** @type {Array<DeleteItem>} */
            []
          ));
          for (let i2 = 0; i2 < numberOfDeletes; i2++) {
            dsField.push(new DeleteItem(decoder.readDsClock(), decoder.readDsLen()));
          }
        }
      }
      return ds;
    };
    var readAndApplyDeleteSet = (decoder, transaction, store) => {
      const unappliedDS = new DeleteSet();
      const numClients = decoding__namespace.readVarUint(decoder.restDecoder);
      for (let i = 0; i < numClients; i++) {
        decoder.resetDsCurVal();
        const client = decoding__namespace.readVarUint(decoder.restDecoder);
        const numberOfDeletes = decoding__namespace.readVarUint(decoder.restDecoder);
        const structs = store.clients.get(client) || [];
        const state = getState(store, client);
        for (let i2 = 0; i2 < numberOfDeletes; i2++) {
          const clock = decoder.readDsClock();
          const clockEnd = clock + decoder.readDsLen();
          if (clock < state) {
            if (state < clockEnd) {
              addToDeleteSet(unappliedDS, client, state, clockEnd - state);
            }
            let index = findIndexSS(structs, clock);
            let struct = structs[index];
            if (!struct.deleted && struct.id.clock < clock) {
              structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
              index++;
            }
            while (index < structs.length) {
              struct = structs[index++];
              if (struct.id.clock < clockEnd) {
                if (!struct.deleted) {
                  if (clockEnd < struct.id.clock + struct.length) {
                    structs.splice(index, 0, splitItem(transaction, struct, clockEnd - struct.id.clock));
                  }
                  struct.delete(transaction);
                }
              } else {
                break;
              }
            }
          } else {
            addToDeleteSet(unappliedDS, client, clock, clockEnd - clock);
          }
        }
      }
      if (unappliedDS.clients.size > 0) {
        const ds = new UpdateEncoderV2();
        encoding__namespace.writeVarUint(ds.restEncoder, 0);
        writeDeleteSet(ds, unappliedDS);
        return ds.toUint8Array();
      }
      return null;
    };
    var equalDeleteSets = (ds1, ds2) => {
      if (ds1.clients.size !== ds2.clients.size) return false;
      for (const [client, deleteItems1] of ds1.clients.entries()) {
        const deleteItems2 = (
          /** @type {Array<import('../internals.js').DeleteItem>} */
          ds2.clients.get(client)
        );
        if (deleteItems2 === void 0 || deleteItems1.length !== deleteItems2.length) return false;
        for (let i = 0; i < deleteItems1.length; i++) {
          const di1 = deleteItems1[i];
          const di2 = deleteItems2[i];
          if (di1.clock !== di2.clock || di1.len !== di2.len) {
            return false;
          }
        }
      }
      return true;
    };
    var generateNewClientId = random__namespace.uint32;
    var Doc2 = class _Doc extends observable.ObservableV2 {
      /**
       * @param {DocOpts} opts configuration
       */
      constructor({ guid = random__namespace.uuidv4(), collectionid = null, gc = true, gcFilter = () => true, meta = null, autoLoad = false, shouldLoad = true } = {}) {
        super();
        this.gc = gc;
        this.gcFilter = gcFilter;
        this.clientID = generateNewClientId();
        this.guid = guid;
        this.collectionid = collectionid;
        this.share = /* @__PURE__ */ new Map();
        this.store = new StructStore();
        this._transaction = null;
        this._transactionCleanups = [];
        this.subdocs = /* @__PURE__ */ new Set();
        this._item = null;
        this.shouldLoad = shouldLoad;
        this.autoLoad = autoLoad;
        this.meta = meta;
        this.isLoaded = false;
        this.isSynced = false;
        this.isDestroyed = false;
        this.whenLoaded = promise__namespace.create((resolve) => {
          this.on("load", () => {
            this.isLoaded = true;
            resolve(this);
          });
        });
        const provideSyncedPromise = () => promise__namespace.create((resolve) => {
          const eventHandler = (isSynced) => {
            if (isSynced === void 0 || isSynced === true) {
              this.off("sync", eventHandler);
              resolve();
            }
          };
          this.on("sync", eventHandler);
        });
        this.on("sync", (isSynced) => {
          if (isSynced === false && this.isSynced) {
            this.whenSynced = provideSyncedPromise();
          }
          this.isSynced = isSynced === void 0 || isSynced === true;
          if (this.isSynced && !this.isLoaded) {
            this.emit("load", [this]);
          }
        });
        this.whenSynced = provideSyncedPromise();
      }
      /**
       * Notify the parent document that you request to load data into this subdocument (if it is a subdocument).
       *
       * `load()` might be used in the future to request any provider to load the most current data.
       *
       * It is safe to call `load()` multiple times.
       */
      load() {
        const item = this._item;
        if (item !== null && !this.shouldLoad) {
          transact(
            /** @type {any} */
            item.parent.doc,
            (transaction) => {
              transaction.subdocsLoaded.add(this);
            },
            null,
            true
          );
        }
        this.shouldLoad = true;
      }
      getSubdocs() {
        return this.subdocs;
      }
      getSubdocGuids() {
        return new Set(array__namespace.from(this.subdocs).map((doc2) => doc2.guid));
      }
      /**
       * Changes that happen inside of a transaction are bundled. This means that
       * the observer fires _after_ the transaction is finished and that all changes
       * that happened inside of the transaction are sent as one message to the
       * other peers.
       *
       * @template T
       * @param {function(Transaction):T} f The function that should be executed as a transaction
       * @param {any} [origin] Origin of who started the transaction. Will be stored on transaction.origin
       * @return T
       *
       * @public
       */
      transact(f2, origin = null) {
        return transact(this, f2, origin);
      }
      /**
       * Define a shared data type.
       *
       * Multiple calls of `ydoc.get(name, TypeConstructor)` yield the same result
       * and do not overwrite each other. I.e.
       * `ydoc.get(name, Y.Array) === ydoc.get(name, Y.Array)`
       *
       * After this method is called, the type is also available on `ydoc.share.get(name)`.
       *
       * *Best Practices:*
       * Define all types right after the Y.Doc instance is created and store them in a separate object.
       * Also use the typed methods `getText(name)`, `getArray(name)`, ..
       *
       * @template {typeof AbstractType<any>} Type
       * @example
       *   const ydoc = new Y.Doc(..)
       *   const appState = {
       *     document: ydoc.getText('document')
       *     comments: ydoc.getArray('comments')
       *   }
       *
       * @param {string} name
       * @param {Type} TypeConstructor The constructor of the type definition. E.g. Y.Text, Y.Array, Y.Map, ...
       * @return {InstanceType<Type>} The created type. Constructed with TypeConstructor
       *
       * @public
       */
      get(name, TypeConstructor = (
        /** @type {any} */
        AbstractType
      )) {
        const type = map__namespace.setIfUndefined(this.share, name, () => {
          const t2 = new TypeConstructor();
          t2._integrate(this, null);
          return t2;
        });
        const Constr = type.constructor;
        if (TypeConstructor !== AbstractType && Constr !== TypeConstructor) {
          if (Constr === AbstractType) {
            const t2 = new TypeConstructor();
            t2._map = type._map;
            type._map.forEach(
              /** @param {Item?} n */
              (n) => {
                for (; n !== null; n = n.left) {
                  n.parent = t2;
                }
              }
            );
            t2._start = type._start;
            for (let n = t2._start; n !== null; n = n.right) {
              n.parent = t2;
            }
            t2._length = type._length;
            this.share.set(name, t2);
            t2._integrate(this, null);
            return (
              /** @type {InstanceType<Type>} */
              t2
            );
          } else {
            throw new Error(`Type with the name ${name} has already been defined with a different constructor`);
          }
        }
        return (
          /** @type {InstanceType<Type>} */
          type
        );
      }
      /**
       * @template T
       * @param {string} [name]
       * @return {YArray<T>}
       *
       * @public
       */
      getArray(name = "") {
        return (
          /** @type {YArray<T>} */
          this.get(name, YArray)
        );
      }
      /**
       * @param {string} [name]
       * @return {YText}
       *
       * @public
       */
      getText(name = "") {
        return this.get(name, YText);
      }
      /**
       * @template T
       * @param {string} [name]
       * @return {YMap<T>}
       *
       * @public
       */
      getMap(name = "") {
        return (
          /** @type {YMap<T>} */
          this.get(name, YMap)
        );
      }
      /**
       * @param {string} [name]
       * @return {YXmlElement}
       *
       * @public
       */
      getXmlElement(name = "") {
        return (
          /** @type {YXmlElement<{[key:string]:string}>} */
          this.get(name, YXmlElement)
        );
      }
      /**
       * @param {string} [name]
       * @return {YXmlFragment}
       *
       * @public
       */
      getXmlFragment(name = "") {
        return this.get(name, YXmlFragment);
      }
      /**
       * Converts the entire document into a js object, recursively traversing each yjs type
       * Doesn't log types that have not been defined (using ydoc.getType(..)).
       *
       * @deprecated Do not use this method and rather call toJSON directly on the shared types.
       *
       * @return {Object<string, any>}
       */
      toJSON() {
        const doc2 = {};
        this.share.forEach((value, key) => {
          doc2[key] = value.toJSON();
        });
        return doc2;
      }
      /**
       * Emit `destroy` event and unregister all event handlers.
       */
      destroy() {
        this.isDestroyed = true;
        array__namespace.from(this.subdocs).forEach((subdoc) => subdoc.destroy());
        const item = this._item;
        if (item !== null) {
          this._item = null;
          const content = (
            /** @type {ContentDoc} */
            item.content
          );
          content.doc = new _Doc({ guid: this.guid, ...content.opts, shouldLoad: false });
          content.doc._item = item;
          transact(
            /** @type {any} */
            item.parent.doc,
            (transaction) => {
              const doc2 = content.doc;
              if (!item.deleted) {
                transaction.subdocsAdded.add(doc2);
              }
              transaction.subdocsRemoved.add(this);
            },
            null,
            true
          );
        }
        this.emit("destroyed", [true]);
        this.emit("destroy", [this]);
        super.destroy();
      }
    };
    var DSDecoderV1 = class {
      /**
       * @param {decoding.Decoder} decoder
       */
      constructor(decoder) {
        this.restDecoder = decoder;
      }
      resetDsCurVal() {
      }
      /**
       * @return {number}
       */
      readDsClock() {
        return decoding__namespace.readVarUint(this.restDecoder);
      }
      /**
       * @return {number}
       */
      readDsLen() {
        return decoding__namespace.readVarUint(this.restDecoder);
      }
    };
    var UpdateDecoderV1 = class extends DSDecoderV1 {
      /**
       * @return {ID}
       */
      readLeftID() {
        return createID(decoding__namespace.readVarUint(this.restDecoder), decoding__namespace.readVarUint(this.restDecoder));
      }
      /**
       * @return {ID}
       */
      readRightID() {
        return createID(decoding__namespace.readVarUint(this.restDecoder), decoding__namespace.readVarUint(this.restDecoder));
      }
      /**
       * Read the next client id.
       * Use this in favor of readID whenever possible to reduce the number of objects created.
       */
      readClient() {
        return decoding__namespace.readVarUint(this.restDecoder);
      }
      /**
       * @return {number} info An unsigned 8-bit integer
       */
      readInfo() {
        return decoding__namespace.readUint8(this.restDecoder);
      }
      /**
       * @return {string}
       */
      readString() {
        return decoding__namespace.readVarString(this.restDecoder);
      }
      /**
       * @return {boolean} isKey
       */
      readParentInfo() {
        return decoding__namespace.readVarUint(this.restDecoder) === 1;
      }
      /**
       * @return {number} info An unsigned 8-bit integer
       */
      readTypeRef() {
        return decoding__namespace.readVarUint(this.restDecoder);
      }
      /**
       * Write len of a struct - well suited for Opt RLE encoder.
       *
       * @return {number} len
       */
      readLen() {
        return decoding__namespace.readVarUint(this.restDecoder);
      }
      /**
       * @return {any}
       */
      readAny() {
        return decoding__namespace.readAny(this.restDecoder);
      }
      /**
       * @return {Uint8Array}
       */
      readBuf() {
        return buffer__namespace.copyUint8Array(decoding__namespace.readVarUint8Array(this.restDecoder));
      }
      /**
       * Legacy implementation uses JSON parse. We use any-decoding in v2.
       *
       * @return {any}
       */
      readJSON() {
        return JSON.parse(decoding__namespace.readVarString(this.restDecoder));
      }
      /**
       * @return {string}
       */
      readKey() {
        return decoding__namespace.readVarString(this.restDecoder);
      }
    };
    var DSDecoderV2 = class {
      /**
       * @param {decoding.Decoder} decoder
       */
      constructor(decoder) {
        this.dsCurrVal = 0;
        this.restDecoder = decoder;
      }
      resetDsCurVal() {
        this.dsCurrVal = 0;
      }
      /**
       * @return {number}
       */
      readDsClock() {
        this.dsCurrVal += decoding__namespace.readVarUint(this.restDecoder);
        return this.dsCurrVal;
      }
      /**
       * @return {number}
       */
      readDsLen() {
        const diff = decoding__namespace.readVarUint(this.restDecoder) + 1;
        this.dsCurrVal += diff;
        return diff;
      }
    };
    var UpdateDecoderV2 = class extends DSDecoderV2 {
      /**
       * @param {decoding.Decoder} decoder
       */
      constructor(decoder) {
        super(decoder);
        this.keys = [];
        decoding__namespace.readVarUint(decoder);
        this.keyClockDecoder = new decoding__namespace.IntDiffOptRleDecoder(decoding__namespace.readVarUint8Array(decoder));
        this.clientDecoder = new decoding__namespace.UintOptRleDecoder(decoding__namespace.readVarUint8Array(decoder));
        this.leftClockDecoder = new decoding__namespace.IntDiffOptRleDecoder(decoding__namespace.readVarUint8Array(decoder));
        this.rightClockDecoder = new decoding__namespace.IntDiffOptRleDecoder(decoding__namespace.readVarUint8Array(decoder));
        this.infoDecoder = new decoding__namespace.RleDecoder(decoding__namespace.readVarUint8Array(decoder), decoding__namespace.readUint8);
        this.stringDecoder = new decoding__namespace.StringDecoder(decoding__namespace.readVarUint8Array(decoder));
        this.parentInfoDecoder = new decoding__namespace.RleDecoder(decoding__namespace.readVarUint8Array(decoder), decoding__namespace.readUint8);
        this.typeRefDecoder = new decoding__namespace.UintOptRleDecoder(decoding__namespace.readVarUint8Array(decoder));
        this.lenDecoder = new decoding__namespace.UintOptRleDecoder(decoding__namespace.readVarUint8Array(decoder));
      }
      /**
       * @return {ID}
       */
      readLeftID() {
        return new ID(this.clientDecoder.read(), this.leftClockDecoder.read());
      }
      /**
       * @return {ID}
       */
      readRightID() {
        return new ID(this.clientDecoder.read(), this.rightClockDecoder.read());
      }
      /**
       * Read the next client id.
       * Use this in favor of readID whenever possible to reduce the number of objects created.
       */
      readClient() {
        return this.clientDecoder.read();
      }
      /**
       * @return {number} info An unsigned 8-bit integer
       */
      readInfo() {
        return (
          /** @type {number} */
          this.infoDecoder.read()
        );
      }
      /**
       * @return {string}
       */
      readString() {
        return this.stringDecoder.read();
      }
      /**
       * @return {boolean}
       */
      readParentInfo() {
        return this.parentInfoDecoder.read() === 1;
      }
      /**
       * @return {number} An unsigned 8-bit integer
       */
      readTypeRef() {
        return this.typeRefDecoder.read();
      }
      /**
       * Write len of a struct - well suited for Opt RLE encoder.
       *
       * @return {number}
       */
      readLen() {
        return this.lenDecoder.read();
      }
      /**
       * @return {any}
       */
      readAny() {
        return decoding__namespace.readAny(this.restDecoder);
      }
      /**
       * @return {Uint8Array}
       */
      readBuf() {
        return decoding__namespace.readVarUint8Array(this.restDecoder);
      }
      /**
       * This is mainly here for legacy purposes.
       *
       * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
       *
       * @return {any}
       */
      readJSON() {
        return decoding__namespace.readAny(this.restDecoder);
      }
      /**
       * @return {string}
       */
      readKey() {
        const keyClock = this.keyClockDecoder.read();
        if (keyClock < this.keys.length) {
          return this.keys[keyClock];
        } else {
          const key = this.stringDecoder.read();
          this.keys.push(key);
          return key;
        }
      }
    };
    var DSEncoderV1 = class {
      constructor() {
        this.restEncoder = encoding__namespace.createEncoder();
      }
      toUint8Array() {
        return encoding__namespace.toUint8Array(this.restEncoder);
      }
      resetDsCurVal() {
      }
      /**
       * @param {number} clock
       */
      writeDsClock(clock) {
        encoding__namespace.writeVarUint(this.restEncoder, clock);
      }
      /**
       * @param {number} len
       */
      writeDsLen(len) {
        encoding__namespace.writeVarUint(this.restEncoder, len);
      }
    };
    var UpdateEncoderV1 = class extends DSEncoderV1 {
      /**
       * @param {ID} id
       */
      writeLeftID(id) {
        encoding__namespace.writeVarUint(this.restEncoder, id.client);
        encoding__namespace.writeVarUint(this.restEncoder, id.clock);
      }
      /**
       * @param {ID} id
       */
      writeRightID(id) {
        encoding__namespace.writeVarUint(this.restEncoder, id.client);
        encoding__namespace.writeVarUint(this.restEncoder, id.clock);
      }
      /**
       * Use writeClient and writeClock instead of writeID if possible.
       * @param {number} client
       */
      writeClient(client) {
        encoding__namespace.writeVarUint(this.restEncoder, client);
      }
      /**
       * @param {number} info An unsigned 8-bit integer
       */
      writeInfo(info) {
        encoding__namespace.writeUint8(this.restEncoder, info);
      }
      /**
       * @param {string} s
       */
      writeString(s) {
        encoding__namespace.writeVarString(this.restEncoder, s);
      }
      /**
       * @param {boolean} isYKey
       */
      writeParentInfo(isYKey) {
        encoding__namespace.writeVarUint(this.restEncoder, isYKey ? 1 : 0);
      }
      /**
       * @param {number} info An unsigned 8-bit integer
       */
      writeTypeRef(info) {
        encoding__namespace.writeVarUint(this.restEncoder, info);
      }
      /**
       * Write len of a struct - well suited for Opt RLE encoder.
       *
       * @param {number} len
       */
      writeLen(len) {
        encoding__namespace.writeVarUint(this.restEncoder, len);
      }
      /**
       * @param {any} any
       */
      writeAny(any) {
        encoding__namespace.writeAny(this.restEncoder, any);
      }
      /**
       * @param {Uint8Array} buf
       */
      writeBuf(buf) {
        encoding__namespace.writeVarUint8Array(this.restEncoder, buf);
      }
      /**
       * @param {any} embed
       */
      writeJSON(embed) {
        encoding__namespace.writeVarString(this.restEncoder, JSON.stringify(embed));
      }
      /**
       * @param {string} key
       */
      writeKey(key) {
        encoding__namespace.writeVarString(this.restEncoder, key);
      }
    };
    var DSEncoderV2 = class {
      constructor() {
        this.restEncoder = encoding__namespace.createEncoder();
        this.dsCurrVal = 0;
      }
      toUint8Array() {
        return encoding__namespace.toUint8Array(this.restEncoder);
      }
      resetDsCurVal() {
        this.dsCurrVal = 0;
      }
      /**
       * @param {number} clock
       */
      writeDsClock(clock) {
        const diff = clock - this.dsCurrVal;
        this.dsCurrVal = clock;
        encoding__namespace.writeVarUint(this.restEncoder, diff);
      }
      /**
       * @param {number} len
       */
      writeDsLen(len) {
        if (len === 0) {
          error__namespace.unexpectedCase();
        }
        encoding__namespace.writeVarUint(this.restEncoder, len - 1);
        this.dsCurrVal += len;
      }
    };
    var UpdateEncoderV2 = class extends DSEncoderV2 {
      constructor() {
        super();
        this.keyMap = /* @__PURE__ */ new Map();
        this.keyClock = 0;
        this.keyClockEncoder = new encoding__namespace.IntDiffOptRleEncoder();
        this.clientEncoder = new encoding__namespace.UintOptRleEncoder();
        this.leftClockEncoder = new encoding__namespace.IntDiffOptRleEncoder();
        this.rightClockEncoder = new encoding__namespace.IntDiffOptRleEncoder();
        this.infoEncoder = new encoding__namespace.RleEncoder(encoding__namespace.writeUint8);
        this.stringEncoder = new encoding__namespace.StringEncoder();
        this.parentInfoEncoder = new encoding__namespace.RleEncoder(encoding__namespace.writeUint8);
        this.typeRefEncoder = new encoding__namespace.UintOptRleEncoder();
        this.lenEncoder = new encoding__namespace.UintOptRleEncoder();
      }
      toUint8Array() {
        const encoder = encoding__namespace.createEncoder();
        encoding__namespace.writeVarUint(encoder, 0);
        encoding__namespace.writeVarUint8Array(encoder, this.keyClockEncoder.toUint8Array());
        encoding__namespace.writeVarUint8Array(encoder, this.clientEncoder.toUint8Array());
        encoding__namespace.writeVarUint8Array(encoder, this.leftClockEncoder.toUint8Array());
        encoding__namespace.writeVarUint8Array(encoder, this.rightClockEncoder.toUint8Array());
        encoding__namespace.writeVarUint8Array(encoder, encoding__namespace.toUint8Array(this.infoEncoder));
        encoding__namespace.writeVarUint8Array(encoder, this.stringEncoder.toUint8Array());
        encoding__namespace.writeVarUint8Array(encoder, encoding__namespace.toUint8Array(this.parentInfoEncoder));
        encoding__namespace.writeVarUint8Array(encoder, this.typeRefEncoder.toUint8Array());
        encoding__namespace.writeVarUint8Array(encoder, this.lenEncoder.toUint8Array());
        encoding__namespace.writeUint8Array(encoder, encoding__namespace.toUint8Array(this.restEncoder));
        return encoding__namespace.toUint8Array(encoder);
      }
      /**
       * @param {ID} id
       */
      writeLeftID(id) {
        this.clientEncoder.write(id.client);
        this.leftClockEncoder.write(id.clock);
      }
      /**
       * @param {ID} id
       */
      writeRightID(id) {
        this.clientEncoder.write(id.client);
        this.rightClockEncoder.write(id.clock);
      }
      /**
       * @param {number} client
       */
      writeClient(client) {
        this.clientEncoder.write(client);
      }
      /**
       * @param {number} info An unsigned 8-bit integer
       */
      writeInfo(info) {
        this.infoEncoder.write(info);
      }
      /**
       * @param {string} s
       */
      writeString(s) {
        this.stringEncoder.write(s);
      }
      /**
       * @param {boolean} isYKey
       */
      writeParentInfo(isYKey) {
        this.parentInfoEncoder.write(isYKey ? 1 : 0);
      }
      /**
       * @param {number} info An unsigned 8-bit integer
       */
      writeTypeRef(info) {
        this.typeRefEncoder.write(info);
      }
      /**
       * Write len of a struct - well suited for Opt RLE encoder.
       *
       * @param {number} len
       */
      writeLen(len) {
        this.lenEncoder.write(len);
      }
      /**
       * @param {any} any
       */
      writeAny(any) {
        encoding__namespace.writeAny(this.restEncoder, any);
      }
      /**
       * @param {Uint8Array} buf
       */
      writeBuf(buf) {
        encoding__namespace.writeVarUint8Array(this.restEncoder, buf);
      }
      /**
       * This is mainly here for legacy purposes.
       *
       * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
       *
       * @param {any} embed
       */
      writeJSON(embed) {
        encoding__namespace.writeAny(this.restEncoder, embed);
      }
      /**
       * Property keys are often reused. For example, in y-prosemirror the key `bold` might
       * occur very often. For a 3d application, the key `position` might occur very often.
       *
       * We cache these keys in a Map and refer to them via a unique number.
       *
       * @param {string} key
       */
      writeKey(key) {
        const clock = this.keyMap.get(key);
        if (clock === void 0) {
          this.keyClockEncoder.write(this.keyClock++);
          this.stringEncoder.write(key);
        } else {
          this.keyClockEncoder.write(clock);
        }
      }
    };
    var writeStructs = (encoder, structs, client, clock) => {
      clock = math__namespace.max(clock, structs[0].id.clock);
      const startNewStructs = findIndexSS(structs, clock);
      encoding__namespace.writeVarUint(encoder.restEncoder, structs.length - startNewStructs);
      encoder.writeClient(client);
      encoding__namespace.writeVarUint(encoder.restEncoder, clock);
      const firstStruct = structs[startNewStructs];
      firstStruct.write(encoder, clock - firstStruct.id.clock);
      for (let i = startNewStructs + 1; i < structs.length; i++) {
        structs[i].write(encoder, 0);
      }
    };
    var writeClientsStructs = (encoder, store, _sm) => {
      const sm = /* @__PURE__ */ new Map();
      _sm.forEach((clock, client) => {
        if (getState(store, client) > clock) {
          sm.set(client, clock);
        }
      });
      getStateVector(store).forEach((_clock, client) => {
        if (!_sm.has(client)) {
          sm.set(client, 0);
        }
      });
      encoding__namespace.writeVarUint(encoder.restEncoder, sm.size);
      array__namespace.from(sm.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
        writeStructs(
          encoder,
          /** @type {Array<GC|Item>} */
          store.clients.get(client),
          client,
          clock
        );
      });
    };
    var readClientsStructRefs = (decoder, doc2) => {
      const clientRefs = map__namespace.create();
      const numOfStateUpdates = decoding__namespace.readVarUint(decoder.restDecoder);
      for (let i = 0; i < numOfStateUpdates; i++) {
        const numberOfStructs = decoding__namespace.readVarUint(decoder.restDecoder);
        const refs = new Array(numberOfStructs);
        const client = decoder.readClient();
        let clock = decoding__namespace.readVarUint(decoder.restDecoder);
        clientRefs.set(client, { i: 0, refs });
        for (let i2 = 0; i2 < numberOfStructs; i2++) {
          const info = decoder.readInfo();
          switch (binary__namespace.BITS5 & info) {
            case 0: {
              const len = decoder.readLen();
              refs[i2] = new GC(createID(client, clock), len);
              clock += len;
              break;
            }
            case 10: {
              const len = decoding__namespace.readVarUint(decoder.restDecoder);
              refs[i2] = new Skip(createID(client, clock), len);
              clock += len;
              break;
            }
            default: {
              const cantCopyParentInfo = (info & (binary__namespace.BIT7 | binary__namespace.BIT8)) === 0;
              const struct = new Item(
                createID(client, clock),
                null,
                // left
                (info & binary__namespace.BIT8) === binary__namespace.BIT8 ? decoder.readLeftID() : null,
                // origin
                null,
                // right
                (info & binary__namespace.BIT7) === binary__namespace.BIT7 ? decoder.readRightID() : null,
                // right origin
                cantCopyParentInfo ? decoder.readParentInfo() ? doc2.get(decoder.readString()) : decoder.readLeftID() : null,
                // parent
                cantCopyParentInfo && (info & binary__namespace.BIT6) === binary__namespace.BIT6 ? decoder.readString() : null,
                // parentSub
                readItemContent(decoder, info)
                // item content
              );
              refs[i2] = struct;
              clock += struct.length;
            }
          }
        }
      }
      return clientRefs;
    };
    var integrateStructs = (transaction, store, clientsStructRefs) => {
      const stack = [];
      let clientsStructRefsIds = array__namespace.from(clientsStructRefs.keys()).sort((a, b) => a - b);
      if (clientsStructRefsIds.length === 0) {
        return null;
      }
      const getNextStructTarget = () => {
        if (clientsStructRefsIds.length === 0) {
          return null;
        }
        let nextStructsTarget = (
          /** @type {{i:number,refs:Array<GC|Item>}} */
          clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1])
        );
        while (nextStructsTarget.refs.length === nextStructsTarget.i) {
          clientsStructRefsIds.pop();
          if (clientsStructRefsIds.length > 0) {
            nextStructsTarget = /** @type {{i:number,refs:Array<GC|Item>}} */
            clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1]);
          } else {
            return null;
          }
        }
        return nextStructsTarget;
      };
      let curStructsTarget = getNextStructTarget();
      if (curStructsTarget === null) {
        return null;
      }
      const restStructs = new StructStore();
      const missingSV = /* @__PURE__ */ new Map();
      const updateMissingSv = (client, clock) => {
        const mclock = missingSV.get(client);
        if (mclock == null || mclock > clock) {
          missingSV.set(client, clock);
        }
      };
      let stackHead = (
        /** @type {any} */
        curStructsTarget.refs[
          /** @type {any} */
          curStructsTarget.i++
        ]
      );
      const state = /* @__PURE__ */ new Map();
      const addStackToRestSS = () => {
        for (const item of stack) {
          const client = item.id.client;
          const inapplicableItems = clientsStructRefs.get(client);
          if (inapplicableItems) {
            inapplicableItems.i--;
            restStructs.clients.set(client, inapplicableItems.refs.slice(inapplicableItems.i));
            clientsStructRefs.delete(client);
            inapplicableItems.i = 0;
            inapplicableItems.refs = [];
          } else {
            restStructs.clients.set(client, [item]);
          }
          clientsStructRefsIds = clientsStructRefsIds.filter((c) => c !== client);
        }
        stack.length = 0;
      };
      while (true) {
        if (stackHead.constructor !== Skip) {
          const localClock = map__namespace.setIfUndefined(state, stackHead.id.client, () => getState(store, stackHead.id.client));
          const offset = localClock - stackHead.id.clock;
          if (offset < 0) {
            stack.push(stackHead);
            updateMissingSv(stackHead.id.client, stackHead.id.clock - 1);
            addStackToRestSS();
          } else {
            const missing = stackHead.getMissing(transaction, store);
            if (missing !== null) {
              stack.push(stackHead);
              const structRefs = clientsStructRefs.get(
                /** @type {number} */
                missing
              ) || { refs: [], i: 0 };
              if (structRefs.refs.length === structRefs.i) {
                updateMissingSv(
                  /** @type {number} */
                  missing,
                  getState(store, missing)
                );
                addStackToRestSS();
              } else {
                stackHead = structRefs.refs[structRefs.i++];
                continue;
              }
            } else if (offset === 0 || offset < stackHead.length) {
              stackHead.integrate(transaction, offset);
              state.set(stackHead.id.client, stackHead.id.clock + stackHead.length);
            }
          }
        }
        if (stack.length > 0) {
          stackHead = /** @type {GC|Item} */
          stack.pop();
        } else if (curStructsTarget !== null && curStructsTarget.i < curStructsTarget.refs.length) {
          stackHead = /** @type {GC|Item} */
          curStructsTarget.refs[curStructsTarget.i++];
        } else {
          curStructsTarget = getNextStructTarget();
          if (curStructsTarget === null) {
            break;
          } else {
            stackHead = /** @type {GC|Item} */
            curStructsTarget.refs[curStructsTarget.i++];
          }
        }
      }
      if (restStructs.clients.size > 0) {
        const encoder = new UpdateEncoderV2();
        writeClientsStructs(encoder, restStructs, /* @__PURE__ */ new Map());
        encoding__namespace.writeVarUint(encoder.restEncoder, 0);
        return { missing: missingSV, update: encoder.toUint8Array() };
      }
      return null;
    };
    var writeStructsFromTransaction = (encoder, transaction) => writeClientsStructs(encoder, transaction.doc.store, transaction.beforeState);
    var readUpdateV2 = (decoder, ydoc, transactionOrigin, structDecoder = new UpdateDecoderV2(decoder)) => transact(ydoc, (transaction) => {
      transaction.local = false;
      let retry = false;
      const doc2 = transaction.doc;
      const store = doc2.store;
      const ss = readClientsStructRefs(structDecoder, doc2);
      const restStructs = integrateStructs(transaction, store, ss);
      const pending = store.pendingStructs;
      if (pending) {
        for (const [client, clock] of pending.missing) {
          if (clock < getState(store, client)) {
            retry = true;
            break;
          }
        }
        if (restStructs) {
          for (const [client, clock] of restStructs.missing) {
            const mclock = pending.missing.get(client);
            if (mclock == null || mclock > clock) {
              pending.missing.set(client, clock);
            }
          }
          pending.update = mergeUpdatesV2([pending.update, restStructs.update]);
        }
      } else {
        store.pendingStructs = restStructs;
      }
      const dsRest = readAndApplyDeleteSet(structDecoder, transaction, store);
      if (store.pendingDs) {
        const pendingDSUpdate = new UpdateDecoderV2(decoding__namespace.createDecoder(store.pendingDs));
        decoding__namespace.readVarUint(pendingDSUpdate.restDecoder);
        const dsRest2 = readAndApplyDeleteSet(pendingDSUpdate, transaction, store);
        if (dsRest && dsRest2) {
          store.pendingDs = mergeUpdatesV2([dsRest, dsRest2]);
        } else {
          store.pendingDs = dsRest || dsRest2;
        }
      } else {
        store.pendingDs = dsRest;
      }
      if (retry) {
        const update = (
          /** @type {{update: Uint8Array}} */
          store.pendingStructs.update
        );
        store.pendingStructs = null;
        applyUpdateV2(transaction.doc, update);
      }
    }, transactionOrigin, false);
    var readUpdate2 = (decoder, ydoc, transactionOrigin) => readUpdateV2(decoder, ydoc, transactionOrigin, new UpdateDecoderV1(decoder));
    var applyUpdateV2 = (ydoc, update, transactionOrigin, YDecoder = UpdateDecoderV2) => {
      const decoder = decoding__namespace.createDecoder(update);
      readUpdateV2(decoder, ydoc, transactionOrigin, new YDecoder(decoder));
    };
    var applyUpdate2 = (ydoc, update, transactionOrigin) => applyUpdateV2(ydoc, update, transactionOrigin, UpdateDecoderV1);
    var writeStateAsUpdate = (encoder, doc2, targetStateVector = /* @__PURE__ */ new Map()) => {
      writeClientsStructs(encoder, doc2.store, targetStateVector);
      writeDeleteSet(encoder, createDeleteSetFromStructStore(doc2.store));
    };
    var encodeStateAsUpdateV2 = (doc2, encodedTargetStateVector = new Uint8Array([0]), encoder = new UpdateEncoderV2()) => {
      const targetStateVector = decodeStateVector(encodedTargetStateVector);
      writeStateAsUpdate(encoder, doc2, targetStateVector);
      const updates = [encoder.toUint8Array()];
      if (doc2.store.pendingDs) {
        updates.push(doc2.store.pendingDs);
      }
      if (doc2.store.pendingStructs) {
        updates.push(diffUpdateV2(doc2.store.pendingStructs.update, encodedTargetStateVector));
      }
      if (updates.length > 1) {
        if (encoder.constructor === UpdateEncoderV1) {
          return mergeUpdates(updates.map((update, i) => i === 0 ? update : convertUpdateFormatV2ToV1(update)));
        } else if (encoder.constructor === UpdateEncoderV2) {
          return mergeUpdatesV2(updates);
        }
      }
      return updates[0];
    };
    var encodeStateAsUpdate2 = (doc2, encodedTargetStateVector) => encodeStateAsUpdateV2(doc2, encodedTargetStateVector, new UpdateEncoderV1());
    var readStateVector = (decoder) => {
      const ss = /* @__PURE__ */ new Map();
      const ssLength = decoding__namespace.readVarUint(decoder.restDecoder);
      for (let i = 0; i < ssLength; i++) {
        const client = decoding__namespace.readVarUint(decoder.restDecoder);
        const clock = decoding__namespace.readVarUint(decoder.restDecoder);
        ss.set(client, clock);
      }
      return ss;
    };
    var decodeStateVector = (decodedState) => readStateVector(new DSDecoderV1(decoding__namespace.createDecoder(decodedState)));
    var writeStateVector = (encoder, sv) => {
      encoding__namespace.writeVarUint(encoder.restEncoder, sv.size);
      array__namespace.from(sv.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
        encoding__namespace.writeVarUint(encoder.restEncoder, client);
        encoding__namespace.writeVarUint(encoder.restEncoder, clock);
      });
      return encoder;
    };
    var writeDocumentStateVector = (encoder, doc2) => writeStateVector(encoder, getStateVector(doc2.store));
    var encodeStateVectorV2 = (doc2, encoder = new DSEncoderV2()) => {
      if (doc2 instanceof Map) {
        writeStateVector(encoder, doc2);
      } else {
        writeDocumentStateVector(encoder, doc2);
      }
      return encoder.toUint8Array();
    };
    var encodeStateVector2 = (doc2) => encodeStateVectorV2(doc2, new DSEncoderV1());
    var EventHandler = class {
      constructor() {
        this.l = [];
      }
    };
    var createEventHandler = () => new EventHandler();
    var addEventHandlerListener = (eventHandler, f2) => eventHandler.l.push(f2);
    var removeEventHandlerListener = (eventHandler, f2) => {
      const l = eventHandler.l;
      const len = l.length;
      eventHandler.l = l.filter((g) => f2 !== g);
      if (len === eventHandler.l.length) {
        console.error("[yjs] Tried to remove event handler that doesn't exist.");
      }
    };
    var callEventHandlerListeners = (eventHandler, arg0, arg1) => f__namespace.callAll(eventHandler.l, [arg0, arg1]);
    var ID = class {
      /**
       * @param {number} client client id
       * @param {number} clock unique per client id, continuous number
       */
      constructor(client, clock) {
        this.client = client;
        this.clock = clock;
      }
    };
    var compareIDs = (a, b) => a === b || a !== null && b !== null && a.client === b.client && a.clock === b.clock;
    var createID = (client, clock) => new ID(client, clock);
    var writeID = (encoder, id) => {
      encoding__namespace.writeVarUint(encoder, id.client);
      encoding__namespace.writeVarUint(encoder, id.clock);
    };
    var readID = (decoder) => createID(decoding__namespace.readVarUint(decoder), decoding__namespace.readVarUint(decoder));
    var findRootTypeKey = (type) => {
      for (const [key, value] of type.doc.share.entries()) {
        if (value === type) {
          return key;
        }
      }
      throw error__namespace.unexpectedCase();
    };
    var isParentOf = (parent, child) => {
      while (child !== null) {
        if (child.parent === parent) {
          return true;
        }
        child = /** @type {AbstractType<any>} */
        child.parent._item;
      }
      return false;
    };
    var logType = (type) => {
      const res = [];
      let n = type._start;
      while (n) {
        res.push(n);
        n = n.right;
      }
      console.log("Children: ", res);
      console.log("Children content: ", res.filter((m) => !m.deleted).map((m) => m.content));
    };
    var PermanentUserData = class {
      /**
       * @param {Doc} doc
       * @param {YMap<any>} [storeType]
       */
      constructor(doc2, storeType = doc2.getMap("users")) {
        const dss = /* @__PURE__ */ new Map();
        this.yusers = storeType;
        this.doc = doc2;
        this.clients = /* @__PURE__ */ new Map();
        this.dss = dss;
        const initUser = (user, userDescription) => {
          const ds = user.get("ds");
          const ids = user.get("ids");
          const addClientId = (
            /** @param {number} clientid */
            (clientid) => this.clients.set(clientid, userDescription)
          );
          ds.observe(
            /** @param {YArrayEvent<any>} event */
            (event) => {
              event.changes.added.forEach((item) => {
                item.content.getContent().forEach((encodedDs) => {
                  if (encodedDs instanceof Uint8Array) {
                    this.dss.set(userDescription, mergeDeleteSets([this.dss.get(userDescription) || createDeleteSet(), readDeleteSet(new DSDecoderV1(decoding__namespace.createDecoder(encodedDs)))]));
                  }
                });
              });
            }
          );
          this.dss.set(userDescription, mergeDeleteSets(ds.map((encodedDs) => readDeleteSet(new DSDecoderV1(decoding__namespace.createDecoder(encodedDs))))));
          ids.observe(
            /** @param {YArrayEvent<any>} event */
            (event) => event.changes.added.forEach((item) => item.content.getContent().forEach(addClientId))
          );
          ids.forEach(addClientId);
        };
        storeType.observe((event) => {
          event.keysChanged.forEach(
            (userDescription) => initUser(storeType.get(userDescription), userDescription)
          );
        });
        storeType.forEach(initUser);
      }
      /**
       * @param {Doc} doc
       * @param {number} clientid
       * @param {string} userDescription
       * @param {Object} conf
       * @param {function(Transaction, DeleteSet):boolean} [conf.filter]
       */
      setUserMapping(doc2, clientid, userDescription, { filter = () => true } = {}) {
        const users = this.yusers;
        let user = users.get(userDescription);
        if (!user) {
          user = new YMap();
          user.set("ids", new YArray());
          user.set("ds", new YArray());
          users.set(userDescription, user);
        }
        user.get("ids").push([clientid]);
        users.observe((_event) => {
          setTimeout(() => {
            const userOverwrite = users.get(userDescription);
            if (userOverwrite !== user) {
              user = userOverwrite;
              this.clients.forEach((_userDescription, clientid2) => {
                if (userDescription === _userDescription) {
                  user.get("ids").push([clientid2]);
                }
              });
              const encoder = new DSEncoderV1();
              const ds = this.dss.get(userDescription);
              if (ds) {
                writeDeleteSet(encoder, ds);
                user.get("ds").push([encoder.toUint8Array()]);
              }
            }
          }, 0);
        });
        doc2.on(
          "afterTransaction",
          /** @param {Transaction} transaction */
          (transaction) => {
            setTimeout(() => {
              const yds = user.get("ds");
              const ds = transaction.deleteSet;
              if (transaction.local && ds.clients.size > 0 && filter(transaction, ds)) {
                const encoder = new DSEncoderV1();
                writeDeleteSet(encoder, ds);
                yds.push([encoder.toUint8Array()]);
              }
            });
          }
        );
      }
      /**
       * @param {number} clientid
       * @return {any}
       */
      getUserByClientId(clientid) {
        return this.clients.get(clientid) || null;
      }
      /**
       * @param {ID} id
       * @return {string | null}
       */
      getUserByDeletedId(id) {
        for (const [userDescription, ds] of this.dss.entries()) {
          if (isDeleted(ds, id)) {
            return userDescription;
          }
        }
        return null;
      }
    };
    var RelativePosition = class {
      /**
       * @param {ID|null} type
       * @param {string|null} tname
       * @param {ID|null} item
       * @param {number} assoc
       */
      constructor(type, tname, item, assoc = 0) {
        this.type = type;
        this.tname = tname;
        this.item = item;
        this.assoc = assoc;
      }
    };
    var relativePositionToJSON2 = (rpos) => {
      const json = {};
      if (rpos.type) {
        json.type = rpos.type;
      }
      if (rpos.tname) {
        json.tname = rpos.tname;
      }
      if (rpos.item) {
        json.item = rpos.item;
      }
      if (rpos.assoc != null) {
        json.assoc = rpos.assoc;
      }
      return json;
    };
    var createRelativePositionFromJSON4 = (json) => new RelativePosition(json.type == null ? null : createID(json.type.client, json.type.clock), json.tname ?? null, json.item == null ? null : createID(json.item.client, json.item.clock), json.assoc == null ? 0 : json.assoc);
    var AbsolutePosition = class {
      /**
       * @param {AbstractType<any>} type
       * @param {number} index
       * @param {number} [assoc]
       */
      constructor(type, index, assoc = 0) {
        this.type = type;
        this.index = index;
        this.assoc = assoc;
      }
    };
    var createAbsolutePosition = (type, index, assoc = 0) => new AbsolutePosition(type, index, assoc);
    var createRelativePosition = (type, item, assoc) => {
      let typeid = null;
      let tname = null;
      if (type._item === null) {
        tname = findRootTypeKey(type);
      } else {
        typeid = createID(type._item.id.client, type._item.id.clock);
      }
      return new RelativePosition(typeid, tname, item, assoc);
    };
    var createRelativePositionFromTypeIndex3 = (type, index, assoc = 0) => {
      let t2 = type._start;
      if (assoc < 0) {
        if (index === 0) {
          return createRelativePosition(type, null, assoc);
        }
        index--;
      }
      while (t2 !== null) {
        if (!t2.deleted && t2.countable) {
          if (t2.length > index) {
            return createRelativePosition(type, createID(t2.id.client, t2.id.clock + index), assoc);
          }
          index -= t2.length;
        }
        if (t2.right === null && assoc < 0) {
          return createRelativePosition(type, t2.lastId, assoc);
        }
        t2 = t2.right;
      }
      return createRelativePosition(type, null, assoc);
    };
    var writeRelativePosition = (encoder, rpos) => {
      const { type, tname, item, assoc } = rpos;
      if (item !== null) {
        encoding__namespace.writeVarUint(encoder, 0);
        writeID(encoder, item);
      } else if (tname !== null) {
        encoding__namespace.writeUint8(encoder, 1);
        encoding__namespace.writeVarString(encoder, tname);
      } else if (type !== null) {
        encoding__namespace.writeUint8(encoder, 2);
        writeID(encoder, type);
      } else {
        throw error__namespace.unexpectedCase();
      }
      encoding__namespace.writeVarInt(encoder, assoc);
      return encoder;
    };
    var encodeRelativePosition = (rpos) => {
      const encoder = encoding__namespace.createEncoder();
      writeRelativePosition(encoder, rpos);
      return encoding__namespace.toUint8Array(encoder);
    };
    var readRelativePosition = (decoder) => {
      let type = null;
      let tname = null;
      let itemID = null;
      switch (decoding__namespace.readVarUint(decoder)) {
        case 0:
          itemID = readID(decoder);
          break;
        case 1:
          tname = decoding__namespace.readVarString(decoder);
          break;
        case 2: {
          type = readID(decoder);
        }
      }
      const assoc = decoding__namespace.hasContent(decoder) ? decoding__namespace.readVarInt(decoder) : 0;
      return new RelativePosition(type, tname, itemID, assoc);
    };
    var decodeRelativePosition = (uint8Array) => readRelativePosition(decoding__namespace.createDecoder(uint8Array));
    var getItemWithOffset = (store, id) => {
      const item = getItem(store, id);
      const diff = id.clock - item.id.clock;
      return {
        item,
        diff
      };
    };
    var createAbsolutePositionFromRelativePosition3 = (rpos, doc2, followUndoneDeletions = true) => {
      const store = doc2.store;
      const rightID = rpos.item;
      const typeID = rpos.type;
      const tname = rpos.tname;
      const assoc = rpos.assoc;
      let type = null;
      let index = 0;
      if (rightID !== null) {
        if (getState(store, rightID.client) <= rightID.clock) {
          return null;
        }
        const res = followUndoneDeletions ? followRedone(store, rightID) : getItemWithOffset(store, rightID);
        const right = res.item;
        if (!(right instanceof Item)) {
          return null;
        }
        type = /** @type {AbstractType<any>} */
        right.parent;
        if (type._item === null || !type._item.deleted) {
          index = right.deleted || !right.countable ? 0 : res.diff + (assoc >= 0 ? 0 : 1);
          let n = right.left;
          while (n !== null) {
            if (!n.deleted && n.countable) {
              index += n.length;
            }
            n = n.left;
          }
        }
      } else {
        if (tname !== null) {
          type = doc2.get(tname);
        } else if (typeID !== null) {
          if (getState(store, typeID.client) <= typeID.clock) {
            return null;
          }
          const { item } = followUndoneDeletions ? followRedone(store, typeID) : { item: getItem(store, typeID) };
          if (item instanceof Item && item.content instanceof ContentType) {
            type = item.content.type;
          } else {
            return null;
          }
        } else {
          throw error__namespace.unexpectedCase();
        }
        if (assoc >= 0) {
          index = type._length;
        } else {
          index = 0;
        }
      }
      return createAbsolutePosition(type, index, rpos.assoc);
    };
    var compareRelativePositions2 = (a, b) => a === b || a !== null && b !== null && a.tname === b.tname && compareIDs(a.item, b.item) && compareIDs(a.type, b.type) && a.assoc === b.assoc;
    var Snapshot = class {
      /**
       * @param {DeleteSet} ds
       * @param {Map<number,number>} sv state map
       */
      constructor(ds, sv) {
        this.ds = ds;
        this.sv = sv;
      }
    };
    var equalSnapshots = (snap1, snap2) => {
      const ds1 = snap1.ds.clients;
      const ds2 = snap2.ds.clients;
      const sv1 = snap1.sv;
      const sv2 = snap2.sv;
      if (sv1.size !== sv2.size || ds1.size !== ds2.size) {
        return false;
      }
      for (const [key, value] of sv1.entries()) {
        if (sv2.get(key) !== value) {
          return false;
        }
      }
      for (const [client, dsitems1] of ds1.entries()) {
        const dsitems2 = ds2.get(client) || [];
        if (dsitems1.length !== dsitems2.length) {
          return false;
        }
        for (let i = 0; i < dsitems1.length; i++) {
          const dsitem1 = dsitems1[i];
          const dsitem2 = dsitems2[i];
          if (dsitem1.clock !== dsitem2.clock || dsitem1.len !== dsitem2.len) {
            return false;
          }
        }
      }
      return true;
    };
    var encodeSnapshotV2 = (snapshot2, encoder = new DSEncoderV2()) => {
      writeDeleteSet(encoder, snapshot2.ds);
      writeStateVector(encoder, snapshot2.sv);
      return encoder.toUint8Array();
    };
    var encodeSnapshot = (snapshot2) => encodeSnapshotV2(snapshot2, new DSEncoderV1());
    var decodeSnapshotV2 = (buf, decoder = new DSDecoderV2(decoding__namespace.createDecoder(buf))) => {
      return new Snapshot(readDeleteSet(decoder), readStateVector(decoder));
    };
    var decodeSnapshot = (buf) => decodeSnapshotV2(buf, new DSDecoderV1(decoding__namespace.createDecoder(buf)));
    var createSnapshot = (ds, sm) => new Snapshot(ds, sm);
    var emptySnapshot = createSnapshot(createDeleteSet(), /* @__PURE__ */ new Map());
    var snapshot = (doc2) => createSnapshot(createDeleteSetFromStructStore(doc2.store), getStateVector(doc2.store));
    var isVisible = (item, snapshot2) => snapshot2 === void 0 ? !item.deleted : snapshot2.sv.has(item.id.client) && (snapshot2.sv.get(item.id.client) || 0) > item.id.clock && !isDeleted(snapshot2.ds, item.id);
    var splitSnapshotAffectedStructs = (transaction, snapshot2) => {
      const meta = map__namespace.setIfUndefined(transaction.meta, splitSnapshotAffectedStructs, set__namespace.create);
      const store = transaction.doc.store;
      if (!meta.has(snapshot2)) {
        snapshot2.sv.forEach((clock, client) => {
          if (clock < getState(store, client)) {
            getItemCleanStart(transaction, createID(client, clock));
          }
        });
        iterateDeletedStructs(transaction, snapshot2.ds, (_item) => {
        });
        meta.add(snapshot2);
      }
    };
    var createDocFromSnapshot = (originDoc, snapshot2, newDoc = new Doc2()) => {
      if (originDoc.gc) {
        throw new Error("Garbage-collection must be disabled in `originDoc`!");
      }
      const { sv, ds } = snapshot2;
      const encoder = new UpdateEncoderV2();
      originDoc.transact((transaction) => {
        let size2 = 0;
        sv.forEach((clock) => {
          if (clock > 0) {
            size2++;
          }
        });
        encoding__namespace.writeVarUint(encoder.restEncoder, size2);
        for (const [client, clock] of sv) {
          if (clock === 0) {
            continue;
          }
          if (clock < getState(originDoc.store, client)) {
            getItemCleanStart(transaction, createID(client, clock));
          }
          const structs = originDoc.store.clients.get(client) || [];
          const lastStructIndex = findIndexSS(structs, clock - 1);
          encoding__namespace.writeVarUint(encoder.restEncoder, lastStructIndex + 1);
          encoder.writeClient(client);
          encoding__namespace.writeVarUint(encoder.restEncoder, 0);
          for (let i = 0; i <= lastStructIndex; i++) {
            structs[i].write(encoder, 0);
          }
        }
        writeDeleteSet(encoder, ds);
      });
      applyUpdateV2(newDoc, encoder.toUint8Array(), "snapshot");
      return newDoc;
    };
    var snapshotContainsUpdateV2 = (snapshot2, update, YDecoder = UpdateDecoderV2) => {
      const updateDecoder = new YDecoder(decoding__namespace.createDecoder(update));
      const lazyDecoder = new LazyStructReader(updateDecoder, false);
      for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
        if ((snapshot2.sv.get(curr.id.client) || 0) < curr.id.clock + curr.length) {
          return false;
        }
      }
      const mergedDS = mergeDeleteSets([snapshot2.ds, readDeleteSet(updateDecoder)]);
      return equalDeleteSets(snapshot2.ds, mergedDS);
    };
    var snapshotContainsUpdate = (snapshot2, update) => snapshotContainsUpdateV2(snapshot2, update, UpdateDecoderV1);
    var StructStore = class {
      constructor() {
        this.clients = /* @__PURE__ */ new Map();
        this.pendingStructs = null;
        this.pendingDs = null;
      }
    };
    var getStateVector = (store) => {
      const sm = /* @__PURE__ */ new Map();
      store.clients.forEach((structs, client) => {
        const struct = structs[structs.length - 1];
        sm.set(client, struct.id.clock + struct.length);
      });
      return sm;
    };
    var getState = (store, client) => {
      const structs = store.clients.get(client);
      if (structs === void 0) {
        return 0;
      }
      const lastStruct = structs[structs.length - 1];
      return lastStruct.id.clock + lastStruct.length;
    };
    var addStruct = (store, struct) => {
      let structs = store.clients.get(struct.id.client);
      if (structs === void 0) {
        structs = [];
        store.clients.set(struct.id.client, structs);
      } else {
        const lastStruct = structs[structs.length - 1];
        if (lastStruct.id.clock + lastStruct.length !== struct.id.clock) {
          throw error__namespace.unexpectedCase();
        }
      }
      structs.push(struct);
    };
    var findIndexSS = (structs, clock) => {
      let left = 0;
      let right = structs.length - 1;
      let mid = structs[right];
      let midclock = mid.id.clock;
      if (midclock === clock) {
        return right;
      }
      let midindex = math__namespace.floor(clock / (midclock + mid.length - 1) * right);
      while (left <= right) {
        mid = structs[midindex];
        midclock = mid.id.clock;
        if (midclock <= clock) {
          if (clock < midclock + mid.length) {
            return midindex;
          }
          left = midindex + 1;
        } else {
          right = midindex - 1;
        }
        midindex = math__namespace.floor((left + right) / 2);
      }
      throw error__namespace.unexpectedCase();
    };
    var find = (store, id) => {
      const structs = store.clients.get(id.client);
      return structs[findIndexSS(structs, id.clock)];
    };
    var getItem = (
      /** @type {function(StructStore,ID):Item} */
      find
    );
    var findIndexCleanStart = (transaction, structs, clock) => {
      const index = findIndexSS(structs, clock);
      const struct = structs[index];
      if (struct.id.clock < clock && struct instanceof Item) {
        structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
        return index + 1;
      }
      return index;
    };
    var getItemCleanStart = (transaction, id) => {
      const structs = (
        /** @type {Array<Item>} */
        transaction.doc.store.clients.get(id.client)
      );
      return structs[findIndexCleanStart(transaction, structs, id.clock)];
    };
    var getItemCleanEnd = (transaction, store, id) => {
      const structs = store.clients.get(id.client);
      const index = findIndexSS(structs, id.clock);
      const struct = structs[index];
      if (id.clock !== struct.id.clock + struct.length - 1 && struct.constructor !== GC) {
        structs.splice(index + 1, 0, splitItem(transaction, struct, id.clock - struct.id.clock + 1));
      }
      return struct;
    };
    var replaceStruct = (store, struct, newStruct) => {
      const structs = (
        /** @type {Array<GC|Item>} */
        store.clients.get(struct.id.client)
      );
      structs[findIndexSS(structs, struct.id.clock)] = newStruct;
    };
    var iterateStructs = (transaction, structs, clockStart, len, f2) => {
      if (len === 0) {
        return;
      }
      const clockEnd = clockStart + len;
      let index = findIndexCleanStart(transaction, structs, clockStart);
      let struct;
      do {
        struct = structs[index++];
        if (clockEnd < struct.id.clock + struct.length) {
          findIndexCleanStart(transaction, structs, clockEnd);
        }
        f2(struct);
      } while (index < structs.length && structs[index].id.clock < clockEnd);
    };
    var Transaction2 = class {
      /**
       * @param {Doc} doc
       * @param {any} origin
       * @param {boolean} local
       */
      constructor(doc2, origin, local) {
        this.doc = doc2;
        this.deleteSet = new DeleteSet();
        this.beforeState = getStateVector(doc2.store);
        this.afterState = /* @__PURE__ */ new Map();
        this.changed = /* @__PURE__ */ new Map();
        this.changedParentTypes = /* @__PURE__ */ new Map();
        this._mergeStructs = [];
        this.origin = origin;
        this.meta = /* @__PURE__ */ new Map();
        this.local = local;
        this.subdocsAdded = /* @__PURE__ */ new Set();
        this.subdocsRemoved = /* @__PURE__ */ new Set();
        this.subdocsLoaded = /* @__PURE__ */ new Set();
        this._needFormattingCleanup = false;
      }
    };
    var writeUpdateMessageFromTransaction = (encoder, transaction) => {
      if (transaction.deleteSet.clients.size === 0 && !map__namespace.any(transaction.afterState, (clock, client) => transaction.beforeState.get(client) !== clock)) {
        return false;
      }
      sortAndMergeDeleteSet(transaction.deleteSet);
      writeStructsFromTransaction(encoder, transaction);
      writeDeleteSet(encoder, transaction.deleteSet);
      return true;
    };
    var addChangedTypeToTransaction = (transaction, type, parentSub) => {
      const item = type._item;
      if (item === null || item.id.clock < (transaction.beforeState.get(item.id.client) || 0) && !item.deleted) {
        map__namespace.setIfUndefined(transaction.changed, type, set__namespace.create).add(parentSub);
      }
    };
    var tryToMergeWithLefts = (structs, pos) => {
      let right = structs[pos];
      let left = structs[pos - 1];
      let i = pos;
      for (; i > 0; right = left, left = structs[--i - 1]) {
        if (left.deleted === right.deleted && left.constructor === right.constructor) {
          if (left.mergeWith(right)) {
            if (right instanceof Item && right.parentSub !== null && /** @type {AbstractType<any>} */
            right.parent._map.get(right.parentSub) === right) {
              right.parent._map.set(
                right.parentSub,
                /** @type {Item} */
                left
              );
            }
            continue;
          }
        }
        break;
      }
      const merged = pos - i;
      if (merged) {
        structs.splice(pos + 1 - merged, merged);
      }
      return merged;
    };
    var tryGcDeleteSet = (ds, store, gcFilter) => {
      for (const [client, deleteItems] of ds.clients.entries()) {
        const structs = (
          /** @type {Array<GC|Item>} */
          store.clients.get(client)
        );
        for (let di = deleteItems.length - 1; di >= 0; di--) {
          const deleteItem = deleteItems[di];
          const endDeleteItemClock = deleteItem.clock + deleteItem.len;
          for (let si = findIndexSS(structs, deleteItem.clock), struct = structs[si]; si < structs.length && struct.id.clock < endDeleteItemClock; struct = structs[++si]) {
            const struct2 = structs[si];
            if (deleteItem.clock + deleteItem.len <= struct2.id.clock) {
              break;
            }
            if (struct2 instanceof Item && struct2.deleted && !struct2.keep && gcFilter(struct2)) {
              struct2.gc(store, false);
            }
          }
        }
      }
    };
    var tryMergeDeleteSet = (ds, store) => {
      ds.clients.forEach((deleteItems, client) => {
        const structs = (
          /** @type {Array<GC|Item>} */
          store.clients.get(client)
        );
        for (let di = deleteItems.length - 1; di >= 0; di--) {
          const deleteItem = deleteItems[di];
          const mostRightIndexToCheck = math__namespace.min(structs.length - 1, 1 + findIndexSS(structs, deleteItem.clock + deleteItem.len - 1));
          for (let si = mostRightIndexToCheck, struct = structs[si]; si > 0 && struct.id.clock >= deleteItem.clock; struct = structs[si]) {
            si -= 1 + tryToMergeWithLefts(structs, si);
          }
        }
      });
    };
    var tryGc = (ds, store, gcFilter) => {
      tryGcDeleteSet(ds, store, gcFilter);
      tryMergeDeleteSet(ds, store);
    };
    var cleanupTransactions = (transactionCleanups, i) => {
      if (i < transactionCleanups.length) {
        const transaction = transactionCleanups[i];
        const doc2 = transaction.doc;
        const store = doc2.store;
        const ds = transaction.deleteSet;
        const mergeStructs = transaction._mergeStructs;
        try {
          sortAndMergeDeleteSet(ds);
          transaction.afterState = getStateVector(transaction.doc.store);
          doc2.emit("beforeObserverCalls", [transaction, doc2]);
          const fs = [];
          transaction.changed.forEach(
            (subs, itemtype) => fs.push(() => {
              if (itemtype._item === null || !itemtype._item.deleted) {
                itemtype._callObserver(transaction, subs);
              }
            })
          );
          fs.push(() => {
            transaction.changedParentTypes.forEach((events, type) => {
              if (type._dEH.l.length > 0 && (type._item === null || !type._item.deleted)) {
                events = events.filter(
                  (event) => event.target._item === null || !event.target._item.deleted
                );
                events.forEach((event) => {
                  event.currentTarget = type;
                  event._path = null;
                });
                events.sort((event1, event2) => event1.path.length - event2.path.length);
                fs.push(() => {
                  callEventHandlerListeners(type._dEH, events, transaction);
                });
              }
            });
            fs.push(() => doc2.emit("afterTransaction", [transaction, doc2]));
            fs.push(() => {
              if (transaction._needFormattingCleanup) {
                cleanupYTextAfterTransaction(transaction);
              }
            });
          });
          f.callAll(fs, []);
        } finally {
          if (doc2.gc) {
            tryGcDeleteSet(ds, store, doc2.gcFilter);
          }
          tryMergeDeleteSet(ds, store);
          transaction.afterState.forEach((clock, client) => {
            const beforeClock = transaction.beforeState.get(client) || 0;
            if (beforeClock !== clock) {
              const structs = (
                /** @type {Array<GC|Item>} */
                store.clients.get(client)
              );
              const firstChangePos = math__namespace.max(findIndexSS(structs, beforeClock), 1);
              for (let i2 = structs.length - 1; i2 >= firstChangePos; ) {
                i2 -= 1 + tryToMergeWithLefts(structs, i2);
              }
            }
          });
          for (let i2 = mergeStructs.length - 1; i2 >= 0; i2--) {
            const { client, clock } = mergeStructs[i2].id;
            const structs = (
              /** @type {Array<GC|Item>} */
              store.clients.get(client)
            );
            const replacedStructPos = findIndexSS(structs, clock);
            if (replacedStructPos + 1 < structs.length) {
              if (tryToMergeWithLefts(structs, replacedStructPos + 1) > 1) {
                continue;
              }
            }
            if (replacedStructPos > 0) {
              tryToMergeWithLefts(structs, replacedStructPos);
            }
          }
          if (!transaction.local && transaction.afterState.get(doc2.clientID) !== transaction.beforeState.get(doc2.clientID)) {
            logging__namespace.print(logging__namespace.ORANGE, logging__namespace.BOLD, "[yjs] ", logging__namespace.UNBOLD, logging__namespace.RED, "Changed the client-id because another client seems to be using it.");
            doc2.clientID = generateNewClientId();
          }
          doc2.emit("afterTransactionCleanup", [transaction, doc2]);
          if (doc2._observers.has("update")) {
            const encoder = new UpdateEncoderV1();
            const hasContent = writeUpdateMessageFromTransaction(encoder, transaction);
            if (hasContent) {
              doc2.emit("update", [encoder.toUint8Array(), transaction.origin, doc2, transaction]);
            }
          }
          if (doc2._observers.has("updateV2")) {
            const encoder = new UpdateEncoderV2();
            const hasContent = writeUpdateMessageFromTransaction(encoder, transaction);
            if (hasContent) {
              doc2.emit("updateV2", [encoder.toUint8Array(), transaction.origin, doc2, transaction]);
            }
          }
          const { subdocsAdded, subdocsLoaded, subdocsRemoved } = transaction;
          if (subdocsAdded.size > 0 || subdocsRemoved.size > 0 || subdocsLoaded.size > 0) {
            subdocsAdded.forEach((subdoc) => {
              subdoc.clientID = doc2.clientID;
              if (subdoc.collectionid == null) {
                subdoc.collectionid = doc2.collectionid;
              }
              doc2.subdocs.add(subdoc);
            });
            subdocsRemoved.forEach((subdoc) => doc2.subdocs.delete(subdoc));
            doc2.emit("subdocs", [{ loaded: subdocsLoaded, added: subdocsAdded, removed: subdocsRemoved }, doc2, transaction]);
            subdocsRemoved.forEach((subdoc) => subdoc.destroy());
          }
          if (transactionCleanups.length <= i + 1) {
            doc2._transactionCleanups = [];
            doc2.emit("afterAllTransactions", [doc2, transactionCleanups]);
          } else {
            cleanupTransactions(transactionCleanups, i + 1);
          }
        }
      }
    };
    var transact = (doc2, f2, origin = null, local = true) => {
      const transactionCleanups = doc2._transactionCleanups;
      let initialCall = false;
      let result = null;
      if (doc2._transaction === null) {
        initialCall = true;
        doc2._transaction = new Transaction2(doc2, origin, local);
        transactionCleanups.push(doc2._transaction);
        if (transactionCleanups.length === 1) {
          doc2.emit("beforeAllTransactions", [doc2]);
        }
        doc2.emit("beforeTransaction", [doc2._transaction, doc2]);
      }
      try {
        result = f2(doc2._transaction);
      } finally {
        if (initialCall) {
          const finishCleanup = doc2._transaction === transactionCleanups[0];
          doc2._transaction = null;
          if (finishCleanup) {
            cleanupTransactions(transactionCleanups, 0);
          }
        }
      }
      return result;
    };
    var StackItem = class {
      /**
       * @param {DeleteSet} deletions
       * @param {DeleteSet} insertions
       */
      constructor(deletions, insertions) {
        this.insertions = insertions;
        this.deletions = deletions;
        this.meta = /* @__PURE__ */ new Map();
      }
    };
    var clearUndoManagerStackItem = (tr, um, stackItem) => {
      iterateDeletedStructs(tr, stackItem.deletions, (item) => {
        if (item instanceof Item && um.scope.some((type) => type === tr.doc || isParentOf(
          /** @type {AbstractType<any>} */
          type,
          item
        ))) {
          keepItem(item, false);
        }
      });
    };
    var popStackItem = (undoManager, stack, eventType) => {
      let _tr = null;
      const doc2 = undoManager.doc;
      const scope = undoManager.scope;
      transact(doc2, (transaction) => {
        while (stack.length > 0 && undoManager.currStackItem === null) {
          const store = doc2.store;
          const stackItem = (
            /** @type {StackItem} */
            stack.pop()
          );
          const itemsToRedo = /* @__PURE__ */ new Set();
          const itemsToDelete = [];
          let performedChange = false;
          iterateDeletedStructs(transaction, stackItem.insertions, (struct) => {
            if (struct instanceof Item) {
              if (struct.redone !== null) {
                let { item, diff } = followRedone(store, struct.id);
                if (diff > 0) {
                  item = getItemCleanStart(transaction, createID(item.id.client, item.id.clock + diff));
                }
                struct = item;
              }
              if (!struct.deleted && scope.some((type) => type === transaction.doc || isParentOf(
                /** @type {AbstractType<any>} */
                type,
                /** @type {Item} */
                struct
              ))) {
                itemsToDelete.push(struct);
              }
            }
          });
          iterateDeletedStructs(transaction, stackItem.deletions, (struct) => {
            if (struct instanceof Item && scope.some((type) => type === transaction.doc || isParentOf(
              /** @type {AbstractType<any>} */
              type,
              struct
            )) && // Never redo structs in stackItem.insertions because they were created and deleted in the same capture interval.
            !isDeleted(stackItem.insertions, struct.id)) {
              itemsToRedo.add(struct);
            }
          });
          itemsToRedo.forEach((struct) => {
            performedChange = redoItem(transaction, struct, itemsToRedo, stackItem.insertions, undoManager.ignoreRemoteMapChanges, undoManager) !== null || performedChange;
          });
          for (let i = itemsToDelete.length - 1; i >= 0; i--) {
            const item = itemsToDelete[i];
            if (undoManager.deleteFilter(item)) {
              item.delete(transaction);
              performedChange = true;
            }
          }
          undoManager.currStackItem = performedChange ? stackItem : null;
        }
        transaction.changed.forEach((subProps, type) => {
          if (subProps.has(null) && type._searchMarker) {
            type._searchMarker.length = 0;
          }
        });
        _tr = transaction;
      }, undoManager);
      const res = undoManager.currStackItem;
      if (res != null) {
        const changedParentTypes = _tr.changedParentTypes;
        undoManager.emit("stack-item-popped", [{ stackItem: res, type: eventType, changedParentTypes, origin: undoManager }, undoManager]);
        undoManager.currStackItem = null;
      }
      return res;
    };
    var UndoManager3 = class extends observable.ObservableV2 {
      /**
       * @param {Doc|AbstractType<any>|Array<AbstractType<any>>} typeScope Limits the scope of the UndoManager. If this is set to a ydoc instance, all changes on that ydoc will be undone. If set to a specific type, only changes on that type or its children will be undone. Also accepts an array of types.
       * @param {UndoManagerOptions} options
       */
      constructor(typeScope, {
        captureTimeout = 500,
        captureTransaction = (_tr) => true,
        deleteFilter = () => true,
        trackedOrigins = /* @__PURE__ */ new Set([null]),
        ignoreRemoteMapChanges = false,
        doc: doc2 = (
          /** @type {Doc} */
          array__namespace.isArray(typeScope) ? typeScope[0].doc : typeScope instanceof Doc2 ? typeScope : typeScope.doc
        )
      } = {}) {
        super();
        this.scope = [];
        this.doc = doc2;
        this.addToScope(typeScope);
        this.deleteFilter = deleteFilter;
        trackedOrigins.add(this);
        this.trackedOrigins = trackedOrigins;
        this.captureTransaction = captureTransaction;
        this.undoStack = [];
        this.redoStack = [];
        this.undoing = false;
        this.redoing = false;
        this.currStackItem = null;
        this.lastChange = 0;
        this.ignoreRemoteMapChanges = ignoreRemoteMapChanges;
        this.captureTimeout = captureTimeout;
        this.afterTransactionHandler = (transaction) => {
          if (!this.captureTransaction(transaction) || !this.scope.some((type) => transaction.changedParentTypes.has(
            /** @type {AbstractType<any>} */
            type
          ) || type === this.doc) || !this.trackedOrigins.has(transaction.origin) && (!transaction.origin || !this.trackedOrigins.has(transaction.origin.constructor))) {
            return;
          }
          const undoing = this.undoing;
          const redoing = this.redoing;
          const stack = undoing ? this.redoStack : this.undoStack;
          if (undoing) {
            this.stopCapturing();
          } else if (!redoing) {
            this.clear(false, true);
          }
          const insertions = new DeleteSet();
          transaction.afterState.forEach((endClock, client) => {
            const startClock = transaction.beforeState.get(client) || 0;
            const len = endClock - startClock;
            if (len > 0) {
              addToDeleteSet(insertions, client, startClock, len);
            }
          });
          const now = time__namespace.getUnixTime();
          let didAdd = false;
          if (this.lastChange > 0 && now - this.lastChange < this.captureTimeout && stack.length > 0 && !undoing && !redoing) {
            const lastOp = stack[stack.length - 1];
            lastOp.deletions = mergeDeleteSets([lastOp.deletions, transaction.deleteSet]);
            lastOp.insertions = mergeDeleteSets([lastOp.insertions, insertions]);
          } else {
            stack.push(new StackItem(transaction.deleteSet, insertions));
            didAdd = true;
          }
          if (!undoing && !redoing) {
            this.lastChange = now;
          }
          iterateDeletedStructs(
            transaction,
            transaction.deleteSet,
            /** @param {Item|GC} item */
            (item) => {
              if (item instanceof Item && this.scope.some((type) => type === transaction.doc || isParentOf(
                /** @type {AbstractType<any>} */
                type,
                item
              ))) {
                keepItem(item, true);
              }
            }
          );
          const changeEvent = [{ stackItem: stack[stack.length - 1], origin: transaction.origin, type: undoing ? "redo" : "undo", changedParentTypes: transaction.changedParentTypes }, this];
          if (didAdd) {
            this.emit("stack-item-added", changeEvent);
          } else {
            this.emit("stack-item-updated", changeEvent);
          }
        };
        this.doc.on("afterTransaction", this.afterTransactionHandler);
        this.doc.on("destroy", () => {
          this.destroy();
        });
      }
      /**
       * Extend the scope.
       *
       * @param {Array<AbstractType<any> | Doc> | AbstractType<any> | Doc} ytypes
       */
      addToScope(ytypes) {
        const tmpSet = new Set(this.scope);
        ytypes = array__namespace.isArray(ytypes) ? ytypes : [ytypes];
        ytypes.forEach((ytype) => {
          if (!tmpSet.has(ytype)) {
            tmpSet.add(ytype);
            if (ytype instanceof AbstractType ? ytype.doc !== this.doc : ytype !== this.doc) logging__namespace.warn("[yjs#509] Not same Y.Doc");
            this.scope.push(ytype);
          }
        });
      }
      /**
       * @param {any} origin
       */
      addTrackedOrigin(origin) {
        this.trackedOrigins.add(origin);
      }
      /**
       * @param {any} origin
       */
      removeTrackedOrigin(origin) {
        this.trackedOrigins.delete(origin);
      }
      clear(clearUndoStack = true, clearRedoStack = true) {
        if (clearUndoStack && this.canUndo() || clearRedoStack && this.canRedo()) {
          this.doc.transact((tr) => {
            if (clearUndoStack) {
              this.undoStack.forEach((item) => clearUndoManagerStackItem(tr, this, item));
              this.undoStack = [];
            }
            if (clearRedoStack) {
              this.redoStack.forEach((item) => clearUndoManagerStackItem(tr, this, item));
              this.redoStack = [];
            }
            this.emit("stack-cleared", [{ undoStackCleared: clearUndoStack, redoStackCleared: clearRedoStack }]);
          });
        }
      }
      /**
       * UndoManager merges Undo-StackItem if they are created within time-gap
       * smaller than `options.captureTimeout`. Call `um.stopCapturing()` so that the next
       * StackItem won't be merged.
       *
       *
       * @example
       *     // without stopCapturing
       *     ytext.insert(0, 'a')
       *     ytext.insert(1, 'b')
       *     um.undo()
       *     ytext.toString() // => '' (note that 'ab' was removed)
       *     // with stopCapturing
       *     ytext.insert(0, 'a')
       *     um.stopCapturing()
       *     ytext.insert(0, 'b')
       *     um.undo()
       *     ytext.toString() // => 'a' (note that only 'b' was removed)
       *
       */
      stopCapturing() {
        this.lastChange = 0;
      }
      /**
       * Undo last changes on type.
       *
       * @return {StackItem?} Returns StackItem if a change was applied
       */
      undo() {
        this.undoing = true;
        let res;
        try {
          res = popStackItem(this, this.undoStack, "undo");
        } finally {
          this.undoing = false;
        }
        return res;
      }
      /**
       * Redo last undo operation.
       *
       * @return {StackItem?} Returns StackItem if a change was applied
       */
      redo() {
        this.redoing = true;
        let res;
        try {
          res = popStackItem(this, this.redoStack, "redo");
        } finally {
          this.redoing = false;
        }
        return res;
      }
      /**
       * Are undo steps available?
       *
       * @return {boolean} `true` if undo is possible
       */
      canUndo() {
        return this.undoStack.length > 0;
      }
      /**
       * Are redo steps available?
       *
       * @return {boolean} `true` if redo is possible
       */
      canRedo() {
        return this.redoStack.length > 0;
      }
      destroy() {
        this.trackedOrigins.delete(this);
        this.doc.off("afterTransaction", this.afterTransactionHandler);
        super.destroy();
      }
    };
    function* lazyStructReaderGenerator(decoder) {
      const numOfStateUpdates = decoding__namespace.readVarUint(decoder.restDecoder);
      for (let i = 0; i < numOfStateUpdates; i++) {
        const numberOfStructs = decoding__namespace.readVarUint(decoder.restDecoder);
        const client = decoder.readClient();
        let clock = decoding__namespace.readVarUint(decoder.restDecoder);
        for (let i2 = 0; i2 < numberOfStructs; i2++) {
          const info = decoder.readInfo();
          if (info === 10) {
            const len = decoding__namespace.readVarUint(decoder.restDecoder);
            yield new Skip(createID(client, clock), len);
            clock += len;
          } else if ((binary__namespace.BITS5 & info) !== 0) {
            const cantCopyParentInfo = (info & (binary__namespace.BIT7 | binary__namespace.BIT8)) === 0;
            const struct = new Item(
              createID(client, clock),
              null,
              // left
              (info & binary__namespace.BIT8) === binary__namespace.BIT8 ? decoder.readLeftID() : null,
              // origin
              null,
              // right
              (info & binary__namespace.BIT7) === binary__namespace.BIT7 ? decoder.readRightID() : null,
              // right origin
              // @ts-ignore Force writing a string here.
              cantCopyParentInfo ? decoder.readParentInfo() ? decoder.readString() : decoder.readLeftID() : null,
              // parent
              cantCopyParentInfo && (info & binary__namespace.BIT6) === binary__namespace.BIT6 ? decoder.readString() : null,
              // parentSub
              readItemContent(decoder, info)
              // item content
            );
            yield struct;
            clock += struct.length;
          } else {
            const len = decoder.readLen();
            yield new GC(createID(client, clock), len);
            clock += len;
          }
        }
      }
    }
    var LazyStructReader = class {
      /**
       * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
       * @param {boolean} filterSkips
       */
      constructor(decoder, filterSkips) {
        this.gen = lazyStructReaderGenerator(decoder);
        this.curr = null;
        this.done = false;
        this.filterSkips = filterSkips;
        this.next();
      }
      /**
       * @return {Item | GC | Skip |null}
       */
      next() {
        do {
          this.curr = this.gen.next().value || null;
        } while (this.filterSkips && this.curr !== null && this.curr.constructor === Skip);
        return this.curr;
      }
    };
    var logUpdate = (update) => logUpdateV2(update, UpdateDecoderV1);
    var logUpdateV2 = (update, YDecoder = UpdateDecoderV2) => {
      const structs = [];
      const updateDecoder = new YDecoder(decoding__namespace.createDecoder(update));
      const lazyDecoder = new LazyStructReader(updateDecoder, false);
      for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
        structs.push(curr);
      }
      logging__namespace.print("Structs: ", structs);
      const ds = readDeleteSet(updateDecoder);
      logging__namespace.print("DeleteSet: ", ds);
    };
    var decodeUpdate = (update) => decodeUpdateV2(update, UpdateDecoderV1);
    var decodeUpdateV2 = (update, YDecoder = UpdateDecoderV2) => {
      const structs = [];
      const updateDecoder = new YDecoder(decoding__namespace.createDecoder(update));
      const lazyDecoder = new LazyStructReader(updateDecoder, false);
      for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
        structs.push(curr);
      }
      return {
        structs,
        ds: readDeleteSet(updateDecoder)
      };
    };
    var LazyStructWriter = class {
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       */
      constructor(encoder) {
        this.currClient = 0;
        this.startClock = 0;
        this.written = 0;
        this.encoder = encoder;
        this.clientStructs = [];
      }
    };
    var mergeUpdates = (updates) => mergeUpdatesV2(updates, UpdateDecoderV1, UpdateEncoderV1);
    var encodeStateVectorFromUpdateV2 = (update, YEncoder = DSEncoderV2, YDecoder = UpdateDecoderV2) => {
      const encoder = new YEncoder();
      const updateDecoder = new LazyStructReader(new YDecoder(decoding__namespace.createDecoder(update)), false);
      let curr = updateDecoder.curr;
      if (curr !== null) {
        let size2 = 0;
        let currClient = curr.id.client;
        let stopCounting = curr.id.clock !== 0;
        let currClock = stopCounting ? 0 : curr.id.clock + curr.length;
        for (; curr !== null; curr = updateDecoder.next()) {
          if (currClient !== curr.id.client) {
            if (currClock !== 0) {
              size2++;
              encoding__namespace.writeVarUint(encoder.restEncoder, currClient);
              encoding__namespace.writeVarUint(encoder.restEncoder, currClock);
            }
            currClient = curr.id.client;
            currClock = 0;
            stopCounting = curr.id.clock !== 0;
          }
          if (curr.constructor === Skip) {
            stopCounting = true;
          }
          if (!stopCounting) {
            currClock = curr.id.clock + curr.length;
          }
        }
        if (currClock !== 0) {
          size2++;
          encoding__namespace.writeVarUint(encoder.restEncoder, currClient);
          encoding__namespace.writeVarUint(encoder.restEncoder, currClock);
        }
        const enc = encoding__namespace.createEncoder();
        encoding__namespace.writeVarUint(enc, size2);
        encoding__namespace.writeBinaryEncoder(enc, encoder.restEncoder);
        encoder.restEncoder = enc;
        return encoder.toUint8Array();
      } else {
        encoding__namespace.writeVarUint(encoder.restEncoder, 0);
        return encoder.toUint8Array();
      }
    };
    var encodeStateVectorFromUpdate = (update) => encodeStateVectorFromUpdateV2(update, DSEncoderV1, UpdateDecoderV1);
    var parseUpdateMetaV2 = (update, YDecoder = UpdateDecoderV2) => {
      const from2 = /* @__PURE__ */ new Map();
      const to = /* @__PURE__ */ new Map();
      const updateDecoder = new LazyStructReader(new YDecoder(decoding__namespace.createDecoder(update)), false);
      let curr = updateDecoder.curr;
      if (curr !== null) {
        let currClient = curr.id.client;
        let currClock = curr.id.clock;
        from2.set(currClient, currClock);
        for (; curr !== null; curr = updateDecoder.next()) {
          if (currClient !== curr.id.client) {
            to.set(currClient, currClock);
            from2.set(curr.id.client, curr.id.clock);
            currClient = curr.id.client;
          }
          currClock = curr.id.clock + curr.length;
        }
        to.set(currClient, currClock);
      }
      return { from: from2, to };
    };
    var parseUpdateMeta = (update) => parseUpdateMetaV2(update, UpdateDecoderV1);
    var sliceStruct = (left, diff) => {
      if (left.constructor === GC) {
        const { client, clock } = left.id;
        return new GC(createID(client, clock + diff), left.length - diff);
      } else if (left.constructor === Skip) {
        const { client, clock } = left.id;
        return new Skip(createID(client, clock + diff), left.length - diff);
      } else {
        const leftItem = (
          /** @type {Item} */
          left
        );
        const { client, clock } = leftItem.id;
        return new Item(
          createID(client, clock + diff),
          null,
          createID(client, clock + diff - 1),
          null,
          leftItem.rightOrigin,
          leftItem.parent,
          leftItem.parentSub,
          leftItem.content.splice(diff)
        );
      }
    };
    var mergeUpdatesV2 = (updates, YDecoder = UpdateDecoderV2, YEncoder = UpdateEncoderV2) => {
      if (updates.length === 1) {
        return updates[0];
      }
      const updateDecoders = updates.map((update) => new YDecoder(decoding__namespace.createDecoder(update)));
      let lazyStructDecoders = updateDecoders.map((decoder) => new LazyStructReader(decoder, true));
      let currWrite = null;
      const updateEncoder = new YEncoder();
      const lazyStructEncoder = new LazyStructWriter(updateEncoder);
      while (true) {
        lazyStructDecoders = lazyStructDecoders.filter((dec) => dec.curr !== null);
        lazyStructDecoders.sort(
          /** @type {function(any,any):number} */
          (dec1, dec2) => {
            if (dec1.curr.id.client === dec2.curr.id.client) {
              const clockDiff = dec1.curr.id.clock - dec2.curr.id.clock;
              if (clockDiff === 0) {
                return dec1.curr.constructor === dec2.curr.constructor ? 0 : dec1.curr.constructor === Skip ? 1 : -1;
              } else {
                return clockDiff;
              }
            } else {
              return dec2.curr.id.client - dec1.curr.id.client;
            }
          }
        );
        if (lazyStructDecoders.length === 0) {
          break;
        }
        const currDecoder = lazyStructDecoders[0];
        const firstClient = (
          /** @type {Item | GC} */
          currDecoder.curr.id.client
        );
        if (currWrite !== null) {
          let curr = (
            /** @type {Item | GC | null} */
            currDecoder.curr
          );
          let iterated = false;
          while (curr !== null && curr.id.clock + curr.length <= currWrite.struct.id.clock + currWrite.struct.length && curr.id.client >= currWrite.struct.id.client) {
            curr = currDecoder.next();
            iterated = true;
          }
          if (curr === null || // current decoder is empty
          curr.id.client !== firstClient || // check whether there is another decoder that has has updates from `firstClient`
          iterated && curr.id.clock > currWrite.struct.id.clock + currWrite.struct.length) {
            continue;
          }
          if (firstClient !== currWrite.struct.id.client) {
            writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
            currWrite = { struct: curr, offset: 0 };
            currDecoder.next();
          } else {
            if (currWrite.struct.id.clock + currWrite.struct.length < curr.id.clock) {
              if (currWrite.struct.constructor === Skip) {
                currWrite.struct.length = curr.id.clock + curr.length - currWrite.struct.id.clock;
              } else {
                writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
                const diff = curr.id.clock - currWrite.struct.id.clock - currWrite.struct.length;
                const struct = new Skip(createID(firstClient, currWrite.struct.id.clock + currWrite.struct.length), diff);
                currWrite = { struct, offset: 0 };
              }
            } else {
              const diff = currWrite.struct.id.clock + currWrite.struct.length - curr.id.clock;
              if (diff > 0) {
                if (currWrite.struct.constructor === Skip) {
                  currWrite.struct.length -= diff;
                } else {
                  curr = sliceStruct(curr, diff);
                }
              }
              if (!currWrite.struct.mergeWith(
                /** @type {any} */
                curr
              )) {
                writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
                currWrite = { struct: curr, offset: 0 };
                currDecoder.next();
              }
            }
          }
        } else {
          currWrite = { struct: (
            /** @type {Item | GC} */
            currDecoder.curr
          ), offset: 0 };
          currDecoder.next();
        }
        for (let next = currDecoder.curr; next !== null && next.id.client === firstClient && next.id.clock === currWrite.struct.id.clock + currWrite.struct.length && next.constructor !== Skip; next = currDecoder.next()) {
          writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
          currWrite = { struct: next, offset: 0 };
        }
      }
      if (currWrite !== null) {
        writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
        currWrite = null;
      }
      finishLazyStructWriting(lazyStructEncoder);
      const dss = updateDecoders.map((decoder) => readDeleteSet(decoder));
      const ds = mergeDeleteSets(dss);
      writeDeleteSet(updateEncoder, ds);
      return updateEncoder.toUint8Array();
    };
    var diffUpdateV2 = (update, sv, YDecoder = UpdateDecoderV2, YEncoder = UpdateEncoderV2) => {
      const state = decodeStateVector(sv);
      const encoder = new YEncoder();
      const lazyStructWriter = new LazyStructWriter(encoder);
      const decoder = new YDecoder(decoding__namespace.createDecoder(update));
      const reader = new LazyStructReader(decoder, false);
      while (reader.curr) {
        const curr = reader.curr;
        const currClient = curr.id.client;
        const svClock = state.get(currClient) || 0;
        if (reader.curr.constructor === Skip) {
          reader.next();
          continue;
        }
        if (curr.id.clock + curr.length > svClock) {
          writeStructToLazyStructWriter(lazyStructWriter, curr, math__namespace.max(svClock - curr.id.clock, 0));
          reader.next();
          while (reader.curr && reader.curr.id.client === currClient) {
            writeStructToLazyStructWriter(lazyStructWriter, reader.curr, 0);
            reader.next();
          }
        } else {
          while (reader.curr && reader.curr.id.client === currClient && reader.curr.id.clock + reader.curr.length <= svClock) {
            reader.next();
          }
        }
      }
      finishLazyStructWriting(lazyStructWriter);
      const ds = readDeleteSet(decoder);
      writeDeleteSet(encoder, ds);
      return encoder.toUint8Array();
    };
    var diffUpdate = (update, sv) => diffUpdateV2(update, sv, UpdateDecoderV1, UpdateEncoderV1);
    var flushLazyStructWriter = (lazyWriter) => {
      if (lazyWriter.written > 0) {
        lazyWriter.clientStructs.push({ written: lazyWriter.written, restEncoder: encoding__namespace.toUint8Array(lazyWriter.encoder.restEncoder) });
        lazyWriter.encoder.restEncoder = encoding__namespace.createEncoder();
        lazyWriter.written = 0;
      }
    };
    var writeStructToLazyStructWriter = (lazyWriter, struct, offset) => {
      if (lazyWriter.written > 0 && lazyWriter.currClient !== struct.id.client) {
        flushLazyStructWriter(lazyWriter);
      }
      if (lazyWriter.written === 0) {
        lazyWriter.currClient = struct.id.client;
        lazyWriter.encoder.writeClient(struct.id.client);
        encoding__namespace.writeVarUint(lazyWriter.encoder.restEncoder, struct.id.clock + offset);
      }
      struct.write(lazyWriter.encoder, offset);
      lazyWriter.written++;
    };
    var finishLazyStructWriting = (lazyWriter) => {
      flushLazyStructWriter(lazyWriter);
      const restEncoder = lazyWriter.encoder.restEncoder;
      encoding__namespace.writeVarUint(restEncoder, lazyWriter.clientStructs.length);
      for (let i = 0; i < lazyWriter.clientStructs.length; i++) {
        const partStructs = lazyWriter.clientStructs[i];
        encoding__namespace.writeVarUint(restEncoder, partStructs.written);
        encoding__namespace.writeUint8Array(restEncoder, partStructs.restEncoder);
      }
    };
    var convertUpdateFormat = (update, blockTransformer, YDecoder, YEncoder) => {
      const updateDecoder = new YDecoder(decoding__namespace.createDecoder(update));
      const lazyDecoder = new LazyStructReader(updateDecoder, false);
      const updateEncoder = new YEncoder();
      const lazyWriter = new LazyStructWriter(updateEncoder);
      for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
        writeStructToLazyStructWriter(lazyWriter, blockTransformer(curr), 0);
      }
      finishLazyStructWriting(lazyWriter);
      const ds = readDeleteSet(updateDecoder);
      writeDeleteSet(updateEncoder, ds);
      return updateEncoder.toUint8Array();
    };
    var createObfuscator = ({ formatting = true, subdocs = true, yxml = true } = {}) => {
      let i = 0;
      const mapKeyCache = map__namespace.create();
      const nodeNameCache = map__namespace.create();
      const formattingKeyCache = map__namespace.create();
      const formattingValueCache = map__namespace.create();
      formattingValueCache.set(null, null);
      return (block) => {
        switch (block.constructor) {
          case GC:
          case Skip:
            return block;
          case Item: {
            const item = (
              /** @type {Item} */
              block
            );
            const content = item.content;
            switch (content.constructor) {
              case ContentDeleted:
                break;
              case ContentType: {
                if (yxml) {
                  const type = (
                    /** @type {ContentType} */
                    content.type
                  );
                  if (type instanceof YXmlElement) {
                    type.nodeName = map__namespace.setIfUndefined(nodeNameCache, type.nodeName, () => "node-" + i);
                  }
                  if (type instanceof YXmlHook) {
                    type.hookName = map__namespace.setIfUndefined(nodeNameCache, type.hookName, () => "hook-" + i);
                  }
                }
                break;
              }
              case ContentAny: {
                const c = (
                  /** @type {ContentAny} */
                  content
                );
                c.arr = c.arr.map(() => i);
                break;
              }
              case ContentBinary: {
                const c = (
                  /** @type {ContentBinary} */
                  content
                );
                c.content = new Uint8Array([i]);
                break;
              }
              case ContentDoc: {
                const c = (
                  /** @type {ContentDoc} */
                  content
                );
                if (subdocs) {
                  c.opts = {};
                  c.doc.guid = i + "";
                }
                break;
              }
              case ContentEmbed: {
                const c = (
                  /** @type {ContentEmbed} */
                  content
                );
                c.embed = {};
                break;
              }
              case ContentFormat: {
                const c = (
                  /** @type {ContentFormat} */
                  content
                );
                if (formatting) {
                  c.key = map__namespace.setIfUndefined(formattingKeyCache, c.key, () => i + "");
                  c.value = map__namespace.setIfUndefined(formattingValueCache, c.value, () => ({ i }));
                }
                break;
              }
              case ContentJSON: {
                const c = (
                  /** @type {ContentJSON} */
                  content
                );
                c.arr = c.arr.map(() => i);
                break;
              }
              case ContentString: {
                const c = (
                  /** @type {ContentString} */
                  content
                );
                c.str = string__namespace.repeat(i % 10 + "", c.str.length);
                break;
              }
              default:
                error__namespace.unexpectedCase();
            }
            if (item.parentSub) {
              item.parentSub = map__namespace.setIfUndefined(mapKeyCache, item.parentSub, () => i + "");
            }
            i++;
            return block;
          }
          default:
            error__namespace.unexpectedCase();
        }
      };
    };
    var obfuscateUpdate = (update, opts) => convertUpdateFormat(update, createObfuscator(opts), UpdateDecoderV1, UpdateEncoderV1);
    var obfuscateUpdateV2 = (update, opts) => convertUpdateFormat(update, createObfuscator(opts), UpdateDecoderV2, UpdateEncoderV2);
    var convertUpdateFormatV1ToV2 = (update) => convertUpdateFormat(update, f__namespace.id, UpdateDecoderV1, UpdateEncoderV2);
    var convertUpdateFormatV2ToV1 = (update) => convertUpdateFormat(update, f__namespace.id, UpdateDecoderV2, UpdateEncoderV1);
    var errorComputeChanges = "You must not compute changes after the event-handler fired.";
    var YEvent = class {
      /**
       * @param {T} target The changed type.
       * @param {Transaction} transaction
       */
      constructor(target, transaction) {
        this.target = target;
        this.currentTarget = target;
        this.transaction = transaction;
        this._changes = null;
        this._keys = null;
        this._delta = null;
        this._path = null;
      }
      /**
       * Computes the path from `y` to the changed type.
       *
       * @todo v14 should standardize on path: Array<{parent, index}> because that is easier to work with.
       *
       * The following property holds:
       * @example
       *   let type = y
       *   event.path.forEach(dir => {
       *     type = type.get(dir)
       *   })
       *   type === event.target // => true
       */
      get path() {
        return this._path || (this._path = getPathTo(this.currentTarget, this.target));
      }
      /**
       * Check if a struct is deleted by this event.
       *
       * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
       *
       * @param {AbstractStruct} struct
       * @return {boolean}
       */
      deletes(struct) {
        return isDeleted(this.transaction.deleteSet, struct.id);
      }
      /**
       * @type {Map<string, { action: 'add' | 'update' | 'delete', oldValue: any }>}
       */
      get keys() {
        if (this._keys === null) {
          if (this.transaction.doc._transactionCleanups.length === 0) {
            throw error__namespace.create(errorComputeChanges);
          }
          const keys2 = /* @__PURE__ */ new Map();
          const target = this.target;
          const changed = (
            /** @type Set<string|null> */
            this.transaction.changed.get(target)
          );
          changed.forEach((key) => {
            if (key !== null) {
              const item = (
                /** @type {Item} */
                target._map.get(key)
              );
              let action;
              let oldValue;
              if (this.adds(item)) {
                let prev = item.left;
                while (prev !== null && this.adds(prev)) {
                  prev = prev.left;
                }
                if (this.deletes(item)) {
                  if (prev !== null && this.deletes(prev)) {
                    action = "delete";
                    oldValue = array__namespace.last(prev.content.getContent());
                  } else {
                    return;
                  }
                } else {
                  if (prev !== null && this.deletes(prev)) {
                    action = "update";
                    oldValue = array__namespace.last(prev.content.getContent());
                  } else {
                    action = "add";
                    oldValue = void 0;
                  }
                }
              } else {
                if (this.deletes(item)) {
                  action = "delete";
                  oldValue = array__namespace.last(
                    /** @type {Item} */
                    item.content.getContent()
                  );
                } else {
                  return;
                }
              }
              keys2.set(key, { action, oldValue });
            }
          });
          this._keys = keys2;
        }
        return this._keys;
      }
      /**
       * This is a computed property. Note that this can only be safely computed during the
       * event call. Computing this property after other changes happened might result in
       * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
       * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
       *
       * @type {Array<{insert?: string | Array<any> | object | AbstractType<any>, retain?: number, delete?: number, attributes?: Object<string, any>}>}
       */
      get delta() {
        return this.changes.delta;
      }
      /**
       * Check if a struct is added by this event.
       *
       * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
       *
       * @param {AbstractStruct} struct
       * @return {boolean}
       */
      adds(struct) {
        return struct.id.clock >= (this.transaction.beforeState.get(struct.id.client) || 0);
      }
      /**
       * This is a computed property. Note that this can only be safely computed during the
       * event call. Computing this property after other changes happened might result in
       * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
       * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
       *
       * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
       */
      get changes() {
        let changes = this._changes;
        if (changes === null) {
          if (this.transaction.doc._transactionCleanups.length === 0) {
            throw error__namespace.create(errorComputeChanges);
          }
          const target = this.target;
          const added = set__namespace.create();
          const deleted = set__namespace.create();
          const delta = [];
          changes = {
            added,
            deleted,
            delta,
            keys: this.keys
          };
          const changed = (
            /** @type Set<string|null> */
            this.transaction.changed.get(target)
          );
          if (changed.has(null)) {
            let lastOp = null;
            const packOp = () => {
              if (lastOp) {
                delta.push(lastOp);
              }
            };
            for (let item = target._start; item !== null; item = item.right) {
              if (item.deleted) {
                if (this.deletes(item) && !this.adds(item)) {
                  if (lastOp === null || lastOp.delete === void 0) {
                    packOp();
                    lastOp = { delete: 0 };
                  }
                  lastOp.delete += item.length;
                  deleted.add(item);
                }
              } else {
                if (this.adds(item)) {
                  if (lastOp === null || lastOp.insert === void 0) {
                    packOp();
                    lastOp = { insert: [] };
                  }
                  lastOp.insert = lastOp.insert.concat(item.content.getContent());
                  added.add(item);
                } else {
                  if (lastOp === null || lastOp.retain === void 0) {
                    packOp();
                    lastOp = { retain: 0 };
                  }
                  lastOp.retain += item.length;
                }
              }
            }
            if (lastOp !== null && lastOp.retain === void 0) {
              packOp();
            }
          }
          this._changes = changes;
        }
        return (
          /** @type {any} */
          changes
        );
      }
    };
    var getPathTo = (parent, child) => {
      const path = [];
      while (child._item !== null && child !== parent) {
        if (child._item.parentSub !== null) {
          path.unshift(child._item.parentSub);
        } else {
          let i = 0;
          let c = (
            /** @type {AbstractType<any>} */
            child._item.parent._start
          );
          while (c !== child._item && c !== null) {
            if (!c.deleted && c.countable) {
              i += c.length;
            }
            c = c.right;
          }
          path.unshift(i);
        }
        child = /** @type {AbstractType<any>} */
        child._item.parent;
      }
      return path;
    };
    var warnPrematureAccess = () => {
      logging__namespace.warn("Invalid access: Add Yjs type to a document before reading data.");
    };
    var maxSearchMarker = 80;
    var globalSearchMarkerTimestamp = 0;
    var ArraySearchMarker = class {
      /**
       * @param {Item} p
       * @param {number} index
       */
      constructor(p, index) {
        p.marker = true;
        this.p = p;
        this.index = index;
        this.timestamp = globalSearchMarkerTimestamp++;
      }
    };
    var refreshMarkerTimestamp = (marker) => {
      marker.timestamp = globalSearchMarkerTimestamp++;
    };
    var overwriteMarker = (marker, p, index) => {
      marker.p.marker = false;
      marker.p = p;
      p.marker = true;
      marker.index = index;
      marker.timestamp = globalSearchMarkerTimestamp++;
    };
    var markPosition = (searchMarker, p, index) => {
      if (searchMarker.length >= maxSearchMarker) {
        const marker = searchMarker.reduce((a, b) => a.timestamp < b.timestamp ? a : b);
        overwriteMarker(marker, p, index);
        return marker;
      } else {
        const pm = new ArraySearchMarker(p, index);
        searchMarker.push(pm);
        return pm;
      }
    };
    var findMarker = (yarray, index) => {
      if (yarray._start === null || index === 0 || yarray._searchMarker === null) {
        return null;
      }
      const marker = yarray._searchMarker.length === 0 ? null : yarray._searchMarker.reduce((a, b) => math__namespace.abs(index - a.index) < math__namespace.abs(index - b.index) ? a : b);
      let p = yarray._start;
      let pindex = 0;
      if (marker !== null) {
        p = marker.p;
        pindex = marker.index;
        refreshMarkerTimestamp(marker);
      }
      while (p.right !== null && pindex < index) {
        if (!p.deleted && p.countable) {
          if (index < pindex + p.length) {
            break;
          }
          pindex += p.length;
        }
        p = p.right;
      }
      while (p.left !== null && pindex > index) {
        p = p.left;
        if (!p.deleted && p.countable) {
          pindex -= p.length;
        }
      }
      while (p.left !== null && p.left.id.client === p.id.client && p.left.id.clock + p.left.length === p.id.clock) {
        p = p.left;
        if (!p.deleted && p.countable) {
          pindex -= p.length;
        }
      }
      if (marker !== null && math__namespace.abs(marker.index - pindex) < /** @type {YText|YArray<any>} */
      p.parent.length / maxSearchMarker) {
        overwriteMarker(marker, p, pindex);
        return marker;
      } else {
        return markPosition(yarray._searchMarker, p, pindex);
      }
    };
    var updateMarkerChanges = (searchMarker, index, len) => {
      for (let i = searchMarker.length - 1; i >= 0; i--) {
        const m = searchMarker[i];
        if (len > 0) {
          let p = m.p;
          p.marker = false;
          while (p && (p.deleted || !p.countable)) {
            p = p.left;
            if (p && !p.deleted && p.countable) {
              m.index -= p.length;
            }
          }
          if (p === null || p.marker === true) {
            searchMarker.splice(i, 1);
            continue;
          }
          m.p = p;
          p.marker = true;
        }
        if (index < m.index || len > 0 && index === m.index) {
          m.index = math__namespace.max(index, m.index + len);
        }
      }
    };
    var getTypeChildren = (t2) => {
      t2.doc ?? warnPrematureAccess();
      let s = t2._start;
      const arr = [];
      while (s) {
        arr.push(s);
        s = s.right;
      }
      return arr;
    };
    var callTypeObservers = (type, transaction, event) => {
      const changedType = type;
      const changedParentTypes = transaction.changedParentTypes;
      while (true) {
        map__namespace.setIfUndefined(changedParentTypes, type, () => []).push(event);
        if (type._item === null) {
          break;
        }
        type = /** @type {AbstractType<any>} */
        type._item.parent;
      }
      callEventHandlerListeners(changedType._eH, event, transaction);
    };
    var AbstractType = class {
      constructor() {
        this._item = null;
        this._map = /* @__PURE__ */ new Map();
        this._start = null;
        this.doc = null;
        this._length = 0;
        this._eH = createEventHandler();
        this._dEH = createEventHandler();
        this._searchMarker = null;
      }
      /**
       * @return {AbstractType<any>|null}
       */
      get parent() {
        return this._item ? (
          /** @type {AbstractType<any>} */
          this._item.parent
        ) : null;
      }
      /**
       * Integrate this type into the Yjs instance.
       *
       * * Save this struct in the os
       * * This type is sent to other client
       * * Observer functions are fired
       *
       * @param {Doc} y The Yjs instance
       * @param {Item|null} item
       */
      _integrate(y, item) {
        this.doc = y;
        this._item = item;
      }
      /**
       * @return {AbstractType<EventType>}
       */
      _copy() {
        throw error__namespace.methodUnimplemented();
      }
      /**
       * Makes a copy of this data type that can be included somewhere else.
       *
       * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
       *
       * @return {AbstractType<EventType>}
       */
      clone() {
        throw error__namespace.methodUnimplemented();
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} _encoder
       */
      _write(_encoder) {
      }
      /**
       * The first non-deleted item
       */
      get _first() {
        let n = this._start;
        while (n !== null && n.deleted) {
          n = n.right;
        }
        return n;
      }
      /**
       * Creates YEvent and calls all type observers.
       * Must be implemented by each type.
       *
       * @param {Transaction} transaction
       * @param {Set<null|string>} _parentSubs Keys changed on this type. `null` if list was modified.
       */
      _callObserver(transaction, _parentSubs) {
        if (!transaction.local && this._searchMarker) {
          this._searchMarker.length = 0;
        }
      }
      /**
       * Observe all events that are created on this type.
       *
       * @param {function(EventType, Transaction):void} f Observer function
       */
      observe(f2) {
        addEventHandlerListener(this._eH, f2);
      }
      /**
       * Observe all events that are created by this type and its children.
       *
       * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
       */
      observeDeep(f2) {
        addEventHandlerListener(this._dEH, f2);
      }
      /**
       * Unregister an observer function.
       *
       * @param {function(EventType,Transaction):void} f Observer function
       */
      unobserve(f2) {
        removeEventHandlerListener(this._eH, f2);
      }
      /**
       * Unregister an observer function.
       *
       * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
       */
      unobserveDeep(f2) {
        removeEventHandlerListener(this._dEH, f2);
      }
      /**
       * @abstract
       * @return {any}
       */
      toJSON() {
      }
    };
    var typeListSlice = (type, start, end) => {
      type.doc ?? warnPrematureAccess();
      if (start < 0) {
        start = type._length + start;
      }
      if (end < 0) {
        end = type._length + end;
      }
      let len = end - start;
      const cs = [];
      let n = type._start;
      while (n !== null && len > 0) {
        if (n.countable && !n.deleted) {
          const c = n.content.getContent();
          if (c.length <= start) {
            start -= c.length;
          } else {
            for (let i = start; i < c.length && len > 0; i++) {
              cs.push(c[i]);
              len--;
            }
            start = 0;
          }
        }
        n = n.right;
      }
      return cs;
    };
    var typeListToArray = (type) => {
      type.doc ?? warnPrematureAccess();
      const cs = [];
      let n = type._start;
      while (n !== null) {
        if (n.countable && !n.deleted) {
          const c = n.content.getContent();
          for (let i = 0; i < c.length; i++) {
            cs.push(c[i]);
          }
        }
        n = n.right;
      }
      return cs;
    };
    var typeListToArraySnapshot = (type, snapshot2) => {
      const cs = [];
      let n = type._start;
      while (n !== null) {
        if (n.countable && isVisible(n, snapshot2)) {
          const c = n.content.getContent();
          for (let i = 0; i < c.length; i++) {
            cs.push(c[i]);
          }
        }
        n = n.right;
      }
      return cs;
    };
    var typeListForEach = (type, f2) => {
      let index = 0;
      let n = type._start;
      type.doc ?? warnPrematureAccess();
      while (n !== null) {
        if (n.countable && !n.deleted) {
          const c = n.content.getContent();
          for (let i = 0; i < c.length; i++) {
            f2(c[i], index++, type);
          }
        }
        n = n.right;
      }
    };
    var typeListMap = (type, f2) => {
      const result = [];
      typeListForEach(type, (c, i) => {
        result.push(f2(c, i, type));
      });
      return result;
    };
    var typeListCreateIterator = (type) => {
      let n = type._start;
      let currentContent = null;
      let currentContentIndex = 0;
      return {
        [Symbol.iterator]() {
          return this;
        },
        next: () => {
          if (currentContent === null) {
            while (n !== null && n.deleted) {
              n = n.right;
            }
            if (n === null) {
              return {
                done: true,
                value: void 0
              };
            }
            currentContent = n.content.getContent();
            currentContentIndex = 0;
            n = n.right;
          }
          const value = currentContent[currentContentIndex++];
          if (currentContent.length <= currentContentIndex) {
            currentContent = null;
          }
          return {
            done: false,
            value
          };
        }
      };
    };
    var typeListGet = (type, index) => {
      type.doc ?? warnPrematureAccess();
      const marker = findMarker(type, index);
      let n = type._start;
      if (marker !== null) {
        n = marker.p;
        index -= marker.index;
      }
      for (; n !== null; n = n.right) {
        if (!n.deleted && n.countable) {
          if (index < n.length) {
            return n.content.getContent()[index];
          }
          index -= n.length;
        }
      }
    };
    var typeListInsertGenericsAfter = (transaction, parent, referenceItem, content) => {
      let left = referenceItem;
      const doc2 = transaction.doc;
      const ownClientId = doc2.clientID;
      const store = doc2.store;
      const right = referenceItem === null ? parent._start : referenceItem.right;
      let jsonContent = [];
      const packJsonContent = () => {
        if (jsonContent.length > 0) {
          left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentAny(jsonContent));
          left.integrate(transaction, 0);
          jsonContent = [];
        }
      };
      content.forEach((c) => {
        if (c === null) {
          jsonContent.push(c);
        } else {
          switch (c.constructor) {
            case Number:
            case Object:
            case Boolean:
            case Array:
            case String:
              jsonContent.push(c);
              break;
            default:
              packJsonContent();
              switch (c.constructor) {
                case Uint8Array:
                case ArrayBuffer:
                  left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentBinary(new Uint8Array(
                    /** @type {Uint8Array} */
                    c
                  )));
                  left.integrate(transaction, 0);
                  break;
                case Doc2:
                  left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentDoc(
                    /** @type {Doc} */
                    c
                  ));
                  left.integrate(transaction, 0);
                  break;
                default:
                  if (c instanceof AbstractType) {
                    left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentType(c));
                    left.integrate(transaction, 0);
                  } else {
                    throw new Error("Unexpected content type in insert operation");
                  }
              }
          }
        }
      });
      packJsonContent();
    };
    var lengthExceeded = () => error__namespace.create("Length exceeded!");
    var typeListInsertGenerics = (transaction, parent, index, content) => {
      if (index > parent._length) {
        throw lengthExceeded();
      }
      if (index === 0) {
        if (parent._searchMarker) {
          updateMarkerChanges(parent._searchMarker, index, content.length);
        }
        return typeListInsertGenericsAfter(transaction, parent, null, content);
      }
      const startIndex = index;
      const marker = findMarker(parent, index);
      let n = parent._start;
      if (marker !== null) {
        n = marker.p;
        index -= marker.index;
        if (index === 0) {
          n = n.prev;
          index += n && n.countable && !n.deleted ? n.length : 0;
        }
      }
      for (; n !== null; n = n.right) {
        if (!n.deleted && n.countable) {
          if (index <= n.length) {
            if (index < n.length) {
              getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
            }
            break;
          }
          index -= n.length;
        }
      }
      if (parent._searchMarker) {
        updateMarkerChanges(parent._searchMarker, startIndex, content.length);
      }
      return typeListInsertGenericsAfter(transaction, parent, n, content);
    };
    var typeListPushGenerics = (transaction, parent, content) => {
      const marker = (parent._searchMarker || []).reduce((maxMarker, currMarker) => currMarker.index > maxMarker.index ? currMarker : maxMarker, { index: 0, p: parent._start });
      let n = marker.p;
      if (n) {
        while (n.right) {
          n = n.right;
        }
      }
      return typeListInsertGenericsAfter(transaction, parent, n, content);
    };
    var typeListDelete = (transaction, parent, index, length2) => {
      if (length2 === 0) {
        return;
      }
      const startIndex = index;
      const startLength = length2;
      const marker = findMarker(parent, index);
      let n = parent._start;
      if (marker !== null) {
        n = marker.p;
        index -= marker.index;
      }
      for (; n !== null && index > 0; n = n.right) {
        if (!n.deleted && n.countable) {
          if (index < n.length) {
            getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
          }
          index -= n.length;
        }
      }
      while (length2 > 0 && n !== null) {
        if (!n.deleted) {
          if (length2 < n.length) {
            getItemCleanStart(transaction, createID(n.id.client, n.id.clock + length2));
          }
          n.delete(transaction);
          length2 -= n.length;
        }
        n = n.right;
      }
      if (length2 > 0) {
        throw lengthExceeded();
      }
      if (parent._searchMarker) {
        updateMarkerChanges(
          parent._searchMarker,
          startIndex,
          -startLength + length2
          /* in case we remove the above exception */
        );
      }
    };
    var typeMapDelete = (transaction, parent, key) => {
      const c = parent._map.get(key);
      if (c !== void 0) {
        c.delete(transaction);
      }
    };
    var typeMapSet = (transaction, parent, key, value) => {
      const left = parent._map.get(key) || null;
      const doc2 = transaction.doc;
      const ownClientId = doc2.clientID;
      let content;
      if (value == null) {
        content = new ContentAny([value]);
      } else {
        switch (value.constructor) {
          case Number:
          case Object:
          case Boolean:
          case Array:
          case String:
          case Date:
          case BigInt:
            content = new ContentAny([value]);
            break;
          case Uint8Array:
            content = new ContentBinary(
              /** @type {Uint8Array} */
              value
            );
            break;
          case Doc2:
            content = new ContentDoc(
              /** @type {Doc} */
              value
            );
            break;
          default:
            if (value instanceof AbstractType) {
              content = new ContentType(value);
            } else {
              throw new Error("Unexpected content type");
            }
        }
      }
      new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, null, null, parent, key, content).integrate(transaction, 0);
    };
    var typeMapGet = (parent, key) => {
      parent.doc ?? warnPrematureAccess();
      const val = parent._map.get(key);
      return val !== void 0 && !val.deleted ? val.content.getContent()[val.length - 1] : void 0;
    };
    var typeMapGetAll = (parent) => {
      const res = {};
      parent.doc ?? warnPrematureAccess();
      parent._map.forEach((value, key) => {
        if (!value.deleted) {
          res[key] = value.content.getContent()[value.length - 1];
        }
      });
      return res;
    };
    var typeMapHas = (parent, key) => {
      parent.doc ?? warnPrematureAccess();
      const val = parent._map.get(key);
      return val !== void 0 && !val.deleted;
    };
    var typeMapGetSnapshot = (parent, key, snapshot2) => {
      let v = parent._map.get(key) || null;
      while (v !== null && (!snapshot2.sv.has(v.id.client) || v.id.clock >= (snapshot2.sv.get(v.id.client) || 0))) {
        v = v.left;
      }
      return v !== null && isVisible(v, snapshot2) ? v.content.getContent()[v.length - 1] : void 0;
    };
    var typeMapGetAllSnapshot = (parent, snapshot2) => {
      const res = {};
      parent._map.forEach((value, key) => {
        let v = value;
        while (v !== null && (!snapshot2.sv.has(v.id.client) || v.id.clock >= (snapshot2.sv.get(v.id.client) || 0))) {
          v = v.left;
        }
        if (v !== null && isVisible(v, snapshot2)) {
          res[key] = v.content.getContent()[v.length - 1];
        }
      });
      return res;
    };
    var createMapIterator = (type) => {
      type.doc ?? warnPrematureAccess();
      return iterator__namespace.iteratorFilter(
        type._map.entries(),
        /** @param {any} entry */
        (entry) => !entry[1].deleted
      );
    };
    var YArrayEvent = class extends YEvent {
    };
    var YArray = class _YArray extends AbstractType {
      constructor() {
        super();
        this._prelimContent = [];
        this._searchMarker = [];
      }
      /**
       * Construct a new YArray containing the specified items.
       * @template {Object<string,any>|Array<any>|number|null|string|Uint8Array} T
       * @param {Array<T>} items
       * @return {YArray<T>}
       */
      static from(items) {
        const a = new _YArray();
        a.push(items);
        return a;
      }
      /**
       * Integrate this type into the Yjs instance.
       *
       * * Save this struct in the os
       * * This type is sent to other client
       * * Observer functions are fired
       *
       * @param {Doc} y The Yjs instance
       * @param {Item} item
       */
      _integrate(y, item) {
        super._integrate(y, item);
        this.insert(
          0,
          /** @type {Array<any>} */
          this._prelimContent
        );
        this._prelimContent = null;
      }
      /**
       * @return {YArray<T>}
       */
      _copy() {
        return new _YArray();
      }
      /**
       * Makes a copy of this data type that can be included somewhere else.
       *
       * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
       *
       * @return {YArray<T>}
       */
      clone() {
        const arr = new _YArray();
        arr.insert(0, this.toArray().map(
          (el) => el instanceof AbstractType ? (
            /** @type {typeof el} */
            el.clone()
          ) : el
        ));
        return arr;
      }
      get length() {
        this.doc ?? warnPrematureAccess();
        return this._length;
      }
      /**
       * Creates YArrayEvent and calls observers.
       *
       * @param {Transaction} transaction
       * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
       */
      _callObserver(transaction, parentSubs) {
        super._callObserver(transaction, parentSubs);
        callTypeObservers(this, transaction, new YArrayEvent(this, transaction));
      }
      /**
       * Inserts new content at an index.
       *
       * Important: This function expects an array of content. Not just a content
       * object. The reason for this "weirdness" is that inserting several elements
       * is very efficient when it is done as a single operation.
       *
       * @example
       *  // Insert character 'a' at position 0
       *  yarray.insert(0, ['a'])
       *  // Insert numbers 1, 2 at position 1
       *  yarray.insert(1, [1, 2])
       *
       * @param {number} index The index to insert content at.
       * @param {Array<T>} content The array of content
       */
      insert(index, content) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeListInsertGenerics(
              transaction,
              this,
              index,
              /** @type {any} */
              content
            );
          });
        } else {
          this._prelimContent.splice(index, 0, ...content);
        }
      }
      /**
       * Appends content to this YArray.
       *
       * @param {Array<T>} content Array of content to append.
       *
       * @todo Use the following implementation in all types.
       */
      push(content) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeListPushGenerics(
              transaction,
              this,
              /** @type {any} */
              content
            );
          });
        } else {
          this._prelimContent.push(...content);
        }
      }
      /**
       * Prepends content to this YArray.
       *
       * @param {Array<T>} content Array of content to prepend.
       */
      unshift(content) {
        this.insert(0, content);
      }
      /**
       * Deletes elements starting from an index.
       *
       * @param {number} index Index at which to start deleting elements
       * @param {number} length The number of elements to remove. Defaults to 1.
       */
      delete(index, length2 = 1) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeListDelete(transaction, this, index, length2);
          });
        } else {
          this._prelimContent.splice(index, length2);
        }
      }
      /**
       * Returns the i-th element from a YArray.
       *
       * @param {number} index The index of the element to return from the YArray
       * @return {T}
       */
      get(index) {
        return typeListGet(this, index);
      }
      /**
       * Transforms this YArray to a JavaScript Array.
       *
       * @return {Array<T>}
       */
      toArray() {
        return typeListToArray(this);
      }
      /**
       * Returns a portion of this YArray into a JavaScript Array selected
       * from start to end (end not included).
       *
       * @param {number} [start]
       * @param {number} [end]
       * @return {Array<T>}
       */
      slice(start = 0, end = this.length) {
        return typeListSlice(this, start, end);
      }
      /**
       * Transforms this Shared Type to a JSON object.
       *
       * @return {Array<any>}
       */
      toJSON() {
        return this.map((c) => c instanceof AbstractType ? c.toJSON() : c);
      }
      /**
       * Returns an Array with the result of calling a provided function on every
       * element of this YArray.
       *
       * @template M
       * @param {function(T,number,YArray<T>):M} f Function that produces an element of the new Array
       * @return {Array<M>} A new array with each element being the result of the
       *                 callback function
       */
      map(f2) {
        return typeListMap(
          this,
          /** @type {any} */
          f2
        );
      }
      /**
       * Executes a provided function once on every element of this YArray.
       *
       * @param {function(T,number,YArray<T>):void} f A function to execute on every element of this YArray.
       */
      forEach(f2) {
        typeListForEach(this, f2);
      }
      /**
       * @return {IterableIterator<T>}
       */
      [Symbol.iterator]() {
        return typeListCreateIterator(this);
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       */
      _write(encoder) {
        encoder.writeTypeRef(YArrayRefID);
      }
    };
    var readYArray = (_decoder) => new YArray();
    var YMapEvent = class extends YEvent {
      /**
       * @param {YMap<T>} ymap The YArray that changed.
       * @param {Transaction} transaction
       * @param {Set<any>} subs The keys that changed.
       */
      constructor(ymap, transaction, subs) {
        super(ymap, transaction);
        this.keysChanged = subs;
      }
    };
    var YMap = class _YMap extends AbstractType {
      /**
       *
       * @param {Iterable<readonly [string, any]>=} entries - an optional iterable to initialize the YMap
       */
      constructor(entries) {
        super();
        this._prelimContent = null;
        if (entries === void 0) {
          this._prelimContent = /* @__PURE__ */ new Map();
        } else {
          this._prelimContent = new Map(entries);
        }
      }
      /**
       * Integrate this type into the Yjs instance.
       *
       * * Save this struct in the os
       * * This type is sent to other client
       * * Observer functions are fired
       *
       * @param {Doc} y The Yjs instance
       * @param {Item} item
       */
      _integrate(y, item) {
        super._integrate(y, item);
        this._prelimContent.forEach((value, key) => {
          this.set(key, value);
        });
        this._prelimContent = null;
      }
      /**
       * @return {YMap<MapType>}
       */
      _copy() {
        return new _YMap();
      }
      /**
       * Makes a copy of this data type that can be included somewhere else.
       *
       * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
       *
       * @return {YMap<MapType>}
       */
      clone() {
        const map4 = new _YMap();
        this.forEach((value, key) => {
          map4.set(key, value instanceof AbstractType ? (
            /** @type {typeof value} */
            value.clone()
          ) : value);
        });
        return map4;
      }
      /**
       * Creates YMapEvent and calls observers.
       *
       * @param {Transaction} transaction
       * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
       */
      _callObserver(transaction, parentSubs) {
        callTypeObservers(this, transaction, new YMapEvent(this, transaction, parentSubs));
      }
      /**
       * Transforms this Shared Type to a JSON object.
       *
       * @return {Object<string,any>}
       */
      toJSON() {
        this.doc ?? warnPrematureAccess();
        const map4 = {};
        this._map.forEach((item, key) => {
          if (!item.deleted) {
            const v = item.content.getContent()[item.length - 1];
            map4[key] = v instanceof AbstractType ? v.toJSON() : v;
          }
        });
        return map4;
      }
      /**
       * Returns the size of the YMap (count of key/value pairs)
       *
       * @return {number}
       */
      get size() {
        return [...createMapIterator(this)].length;
      }
      /**
       * Returns the keys for each element in the YMap Type.
       *
       * @return {IterableIterator<string>}
       */
      keys() {
        return iterator__namespace.iteratorMap(
          createMapIterator(this),
          /** @param {any} v */
          (v) => v[0]
        );
      }
      /**
       * Returns the values for each element in the YMap Type.
       *
       * @return {IterableIterator<MapType>}
       */
      values() {
        return iterator__namespace.iteratorMap(
          createMapIterator(this),
          /** @param {any} v */
          (v) => v[1].content.getContent()[v[1].length - 1]
        );
      }
      /**
       * Returns an Iterator of [key, value] pairs
       *
       * @return {IterableIterator<[string, MapType]>}
       */
      entries() {
        return iterator__namespace.iteratorMap(
          createMapIterator(this),
          /** @param {any} v */
          (v) => (
            /** @type {any} */
            [v[0], v[1].content.getContent()[v[1].length - 1]]
          )
        );
      }
      /**
       * Executes a provided function on once on every key-value pair.
       *
       * @param {function(MapType,string,YMap<MapType>):void} f A function to execute on every element of this YArray.
       */
      forEach(f2) {
        this.doc ?? warnPrematureAccess();
        this._map.forEach((item, key) => {
          if (!item.deleted) {
            f2(item.content.getContent()[item.length - 1], key, this);
          }
        });
      }
      /**
       * Returns an Iterator of [key, value] pairs
       *
       * @return {IterableIterator<[string, MapType]>}
       */
      [Symbol.iterator]() {
        return this.entries();
      }
      /**
       * Remove a specified element from this YMap.
       *
       * @param {string} key The key of the element to remove.
       */
      delete(key) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeMapDelete(transaction, this, key);
          });
        } else {
          this._prelimContent.delete(key);
        }
      }
      /**
       * Adds or updates an element with a specified key and value.
       * @template {MapType} VAL
       *
       * @param {string} key The key of the element to add to this YMap
       * @param {VAL} value The value of the element to add
       * @return {VAL}
       */
      set(key, value) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeMapSet(
              transaction,
              this,
              key,
              /** @type {any} */
              value
            );
          });
        } else {
          this._prelimContent.set(key, value);
        }
        return value;
      }
      /**
       * Returns a specified element from this YMap.
       *
       * @param {string} key
       * @return {MapType|undefined}
       */
      get(key) {
        return (
          /** @type {any} */
          typeMapGet(this, key)
        );
      }
      /**
       * Returns a boolean indicating whether the specified key exists or not.
       *
       * @param {string} key The key to test.
       * @return {boolean}
       */
      has(key) {
        return typeMapHas(this, key);
      }
      /**
       * Removes all elements from this YMap.
       */
      clear() {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            this.forEach(function(_value, key, map4) {
              typeMapDelete(transaction, map4, key);
            });
          });
        } else {
          this._prelimContent.clear();
        }
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       */
      _write(encoder) {
        encoder.writeTypeRef(YMapRefID);
      }
    };
    var readYMap = (_decoder) => new YMap();
    var equalAttrs = (a, b) => a === b || typeof a === "object" && typeof b === "object" && a && b && object__namespace.equalFlat(a, b);
    var ItemTextListPosition = class {
      /**
       * @param {Item|null} left
       * @param {Item|null} right
       * @param {number} index
       * @param {Map<string,any>} currentAttributes
       */
      constructor(left, right, index, currentAttributes) {
        this.left = left;
        this.right = right;
        this.index = index;
        this.currentAttributes = currentAttributes;
      }
      /**
       * Only call this if you know that this.right is defined
       */
      forward() {
        if (this.right === null) {
          error__namespace.unexpectedCase();
        }
        switch (this.right.content.constructor) {
          case ContentFormat:
            if (!this.right.deleted) {
              updateCurrentAttributes(
                this.currentAttributes,
                /** @type {ContentFormat} */
                this.right.content
              );
            }
            break;
          default:
            if (!this.right.deleted) {
              this.index += this.right.length;
            }
            break;
        }
        this.left = this.right;
        this.right = this.right.right;
      }
    };
    var findNextPosition = (transaction, pos, count) => {
      while (pos.right !== null && count > 0) {
        switch (pos.right.content.constructor) {
          case ContentFormat:
            if (!pos.right.deleted) {
              updateCurrentAttributes(
                pos.currentAttributes,
                /** @type {ContentFormat} */
                pos.right.content
              );
            }
            break;
          default:
            if (!pos.right.deleted) {
              if (count < pos.right.length) {
                getItemCleanStart(transaction, createID(pos.right.id.client, pos.right.id.clock + count));
              }
              pos.index += pos.right.length;
              count -= pos.right.length;
            }
            break;
        }
        pos.left = pos.right;
        pos.right = pos.right.right;
      }
      return pos;
    };
    var findPosition = (transaction, parent, index, useSearchMarker) => {
      const currentAttributes = /* @__PURE__ */ new Map();
      const marker = useSearchMarker ? findMarker(parent, index) : null;
      if (marker) {
        const pos = new ItemTextListPosition(marker.p.left, marker.p, marker.index, currentAttributes);
        return findNextPosition(transaction, pos, index - marker.index);
      } else {
        const pos = new ItemTextListPosition(null, parent._start, 0, currentAttributes);
        return findNextPosition(transaction, pos, index);
      }
    };
    var insertNegatedAttributes = (transaction, parent, currPos, negatedAttributes) => {
      while (currPos.right !== null && (currPos.right.deleted === true || currPos.right.content.constructor === ContentFormat && equalAttrs(
        negatedAttributes.get(
          /** @type {ContentFormat} */
          currPos.right.content.key
        ),
        /** @type {ContentFormat} */
        currPos.right.content.value
      ))) {
        if (!currPos.right.deleted) {
          negatedAttributes.delete(
            /** @type {ContentFormat} */
            currPos.right.content.key
          );
        }
        currPos.forward();
      }
      const doc2 = transaction.doc;
      const ownClientId = doc2.clientID;
      negatedAttributes.forEach((val, key) => {
        const left = currPos.left;
        const right = currPos.right;
        const nextFormat = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
        nextFormat.integrate(transaction, 0);
        currPos.right = nextFormat;
        currPos.forward();
      });
    };
    var updateCurrentAttributes = (currentAttributes, format) => {
      const { key, value } = format;
      if (value === null) {
        currentAttributes.delete(key);
      } else {
        currentAttributes.set(key, value);
      }
    };
    var minimizeAttributeChanges = (currPos, attributes) => {
      while (true) {
        if (currPos.right === null) {
          break;
        } else if (currPos.right.deleted || currPos.right.content.constructor === ContentFormat && equalAttrs(
          attributes[
            /** @type {ContentFormat} */
            currPos.right.content.key
          ] ?? null,
          /** @type {ContentFormat} */
          currPos.right.content.value
        )) ;
        else {
          break;
        }
        currPos.forward();
      }
    };
    var insertAttributes = (transaction, parent, currPos, attributes) => {
      const doc2 = transaction.doc;
      const ownClientId = doc2.clientID;
      const negatedAttributes = /* @__PURE__ */ new Map();
      for (const key in attributes) {
        const val = attributes[key];
        const currentVal = currPos.currentAttributes.get(key) ?? null;
        if (!equalAttrs(currentVal, val)) {
          negatedAttributes.set(key, currentVal);
          const { left, right } = currPos;
          currPos.right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
          currPos.right.integrate(transaction, 0);
          currPos.forward();
        }
      }
      return negatedAttributes;
    };
    var insertText = (transaction, parent, currPos, text2, attributes) => {
      currPos.currentAttributes.forEach((_val, key) => {
        if (attributes[key] === void 0) {
          attributes[key] = null;
        }
      });
      const doc2 = transaction.doc;
      const ownClientId = doc2.clientID;
      minimizeAttributeChanges(currPos, attributes);
      const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
      const content = text2.constructor === String ? new ContentString(
        /** @type {string} */
        text2
      ) : text2 instanceof AbstractType ? new ContentType(text2) : new ContentEmbed(text2);
      let { left, right, index } = currPos;
      if (parent._searchMarker) {
        updateMarkerChanges(parent._searchMarker, currPos.index, content.getLength());
      }
      right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, content);
      right.integrate(transaction, 0);
      currPos.right = right;
      currPos.index = index;
      currPos.forward();
      insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
    };
    var formatText = (transaction, parent, currPos, length2, attributes) => {
      const doc2 = transaction.doc;
      const ownClientId = doc2.clientID;
      minimizeAttributeChanges(currPos, attributes);
      const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
      iterationLoop: while (currPos.right !== null && (length2 > 0 || negatedAttributes.size > 0 && (currPos.right.deleted || currPos.right.content.constructor === ContentFormat))) {
        if (!currPos.right.deleted) {
          switch (currPos.right.content.constructor) {
            case ContentFormat: {
              const { key, value } = (
                /** @type {ContentFormat} */
                currPos.right.content
              );
              const attr = attributes[key];
              if (attr !== void 0) {
                if (equalAttrs(attr, value)) {
                  negatedAttributes.delete(key);
                } else {
                  if (length2 === 0) {
                    break iterationLoop;
                  }
                  negatedAttributes.set(key, value);
                }
                currPos.right.delete(transaction);
              } else {
                currPos.currentAttributes.set(key, value);
              }
              break;
            }
            default:
              if (length2 < currPos.right.length) {
                getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length2));
              }
              length2 -= currPos.right.length;
              break;
          }
        }
        currPos.forward();
      }
      if (length2 > 0) {
        let newlines = "";
        for (; length2 > 0; length2--) {
          newlines += "\n";
        }
        currPos.right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), currPos.left, currPos.left && currPos.left.lastId, currPos.right, currPos.right && currPos.right.id, parent, null, new ContentString(newlines));
        currPos.right.integrate(transaction, 0);
        currPos.forward();
      }
      insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
    };
    var cleanupFormattingGap = (transaction, start, curr, startAttributes, currAttributes) => {
      let end = start;
      const endFormats = map__namespace.create();
      while (end && (!end.countable || end.deleted)) {
        if (!end.deleted && end.content.constructor === ContentFormat) {
          const cf = (
            /** @type {ContentFormat} */
            end.content
          );
          endFormats.set(cf.key, cf);
        }
        end = end.right;
      }
      let cleanups = 0;
      let reachedCurr = false;
      while (start !== end) {
        if (curr === start) {
          reachedCurr = true;
        }
        if (!start.deleted) {
          const content = start.content;
          switch (content.constructor) {
            case ContentFormat: {
              const { key, value } = (
                /** @type {ContentFormat} */
                content
              );
              const startAttrValue = startAttributes.get(key) ?? null;
              if (endFormats.get(key) !== content || startAttrValue === value) {
                start.delete(transaction);
                cleanups++;
                if (!reachedCurr && (currAttributes.get(key) ?? null) === value && startAttrValue !== value) {
                  if (startAttrValue === null) {
                    currAttributes.delete(key);
                  } else {
                    currAttributes.set(key, startAttrValue);
                  }
                }
              }
              if (!reachedCurr && !start.deleted) {
                updateCurrentAttributes(
                  currAttributes,
                  /** @type {ContentFormat} */
                  content
                );
              }
              break;
            }
          }
        }
        start = /** @type {Item} */
        start.right;
      }
      return cleanups;
    };
    var cleanupContextlessFormattingGap = (transaction, item) => {
      while (item && item.right && (item.right.deleted || !item.right.countable)) {
        item = item.right;
      }
      const attrs = /* @__PURE__ */ new Set();
      while (item && (item.deleted || !item.countable)) {
        if (!item.deleted && item.content.constructor === ContentFormat) {
          const key = (
            /** @type {ContentFormat} */
            item.content.key
          );
          if (attrs.has(key)) {
            item.delete(transaction);
          } else {
            attrs.add(key);
          }
        }
        item = item.left;
      }
    };
    var cleanupYTextFormatting = (type) => {
      let res = 0;
      transact(
        /** @type {Doc} */
        type.doc,
        (transaction) => {
          let start = (
            /** @type {Item} */
            type._start
          );
          let end = type._start;
          let startAttributes = map__namespace.create();
          const currentAttributes = map__namespace.copy(startAttributes);
          while (end) {
            if (end.deleted === false) {
              switch (end.content.constructor) {
                case ContentFormat:
                  updateCurrentAttributes(
                    currentAttributes,
                    /** @type {ContentFormat} */
                    end.content
                  );
                  break;
                default:
                  res += cleanupFormattingGap(transaction, start, end, startAttributes, currentAttributes);
                  startAttributes = map__namespace.copy(currentAttributes);
                  start = end;
                  break;
              }
            }
            end = end.right;
          }
        }
      );
      return res;
    };
    var cleanupYTextAfterTransaction = (transaction) => {
      const needFullCleanup = /* @__PURE__ */ new Set();
      const doc2 = transaction.doc;
      for (const [client, afterClock] of transaction.afterState.entries()) {
        const clock = transaction.beforeState.get(client) || 0;
        if (afterClock === clock) {
          continue;
        }
        iterateStructs(
          transaction,
          /** @type {Array<Item|GC>} */
          doc2.store.clients.get(client),
          clock,
          afterClock,
          (item) => {
            if (!item.deleted && /** @type {Item} */
            item.content.constructor === ContentFormat && item.constructor !== GC) {
              needFullCleanup.add(
                /** @type {any} */
                item.parent
              );
            }
          }
        );
      }
      transact(doc2, (t2) => {
        iterateDeletedStructs(transaction, transaction.deleteSet, (item) => {
          if (item instanceof GC || !/** @type {YText} */
          item.parent._hasFormatting || needFullCleanup.has(
            /** @type {YText} */
            item.parent
          )) {
            return;
          }
          const parent = (
            /** @type {YText} */
            item.parent
          );
          if (item.content.constructor === ContentFormat) {
            needFullCleanup.add(parent);
          } else {
            cleanupContextlessFormattingGap(t2, item);
          }
        });
        for (const yText of needFullCleanup) {
          cleanupYTextFormatting(yText);
        }
      });
    };
    var deleteText = (transaction, currPos, length2) => {
      const startLength = length2;
      const startAttrs = map__namespace.copy(currPos.currentAttributes);
      const start = currPos.right;
      while (length2 > 0 && currPos.right !== null) {
        if (currPos.right.deleted === false) {
          switch (currPos.right.content.constructor) {
            case ContentType:
            case ContentEmbed:
            case ContentString:
              if (length2 < currPos.right.length) {
                getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length2));
              }
              length2 -= currPos.right.length;
              currPos.right.delete(transaction);
              break;
          }
        }
        currPos.forward();
      }
      if (start) {
        cleanupFormattingGap(transaction, start, currPos.right, startAttrs, currPos.currentAttributes);
      }
      const parent = (
        /** @type {AbstractType<any>} */
        /** @type {Item} */
        (currPos.left || currPos.right).parent
      );
      if (parent._searchMarker) {
        updateMarkerChanges(parent._searchMarker, currPos.index, -startLength + length2);
      }
      return currPos;
    };
    var YTextEvent = class extends YEvent {
      /**
       * @param {YText} ytext
       * @param {Transaction} transaction
       * @param {Set<any>} subs The keys that changed
       */
      constructor(ytext, transaction, subs) {
        super(ytext, transaction);
        this.childListChanged = false;
        this.keysChanged = /* @__PURE__ */ new Set();
        subs.forEach((sub) => {
          if (sub === null) {
            this.childListChanged = true;
          } else {
            this.keysChanged.add(sub);
          }
        });
      }
      /**
       * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
       */
      get changes() {
        if (this._changes === null) {
          const changes = {
            keys: this.keys,
            delta: this.delta,
            added: /* @__PURE__ */ new Set(),
            deleted: /* @__PURE__ */ new Set()
          };
          this._changes = changes;
        }
        return (
          /** @type {any} */
          this._changes
        );
      }
      /**
       * Compute the changes in the delta format.
       * A {@link https://quilljs.com/docs/delta/|Quill Delta}) that represents the changes on the document.
       *
       * @type {Array<{insert?:string|object|AbstractType<any>, delete?:number, retain?:number, attributes?: Object<string,any>}>}
       *
       * @public
       */
      get delta() {
        if (this._delta === null) {
          const y = (
            /** @type {Doc} */
            this.target.doc
          );
          const delta = [];
          transact(y, (transaction) => {
            const currentAttributes = /* @__PURE__ */ new Map();
            const oldAttributes = /* @__PURE__ */ new Map();
            let item = this.target._start;
            let action = null;
            const attributes = {};
            let insert = "";
            let retain = 0;
            let deleteLen = 0;
            const addOp = () => {
              if (action !== null) {
                let op = null;
                switch (action) {
                  case "delete":
                    if (deleteLen > 0) {
                      op = { delete: deleteLen };
                    }
                    deleteLen = 0;
                    break;
                  case "insert":
                    if (typeof insert === "object" || insert.length > 0) {
                      op = { insert };
                      if (currentAttributes.size > 0) {
                        op.attributes = {};
                        currentAttributes.forEach((value, key) => {
                          if (value !== null) {
                            op.attributes[key] = value;
                          }
                        });
                      }
                    }
                    insert = "";
                    break;
                  case "retain":
                    if (retain > 0) {
                      op = { retain };
                      if (!object__namespace.isEmpty(attributes)) {
                        op.attributes = object__namespace.assign({}, attributes);
                      }
                    }
                    retain = 0;
                    break;
                }
                if (op) delta.push(op);
                action = null;
              }
            };
            while (item !== null) {
              switch (item.content.constructor) {
                case ContentType:
                case ContentEmbed:
                  if (this.adds(item)) {
                    if (!this.deletes(item)) {
                      addOp();
                      action = "insert";
                      insert = item.content.getContent()[0];
                      addOp();
                    }
                  } else if (this.deletes(item)) {
                    if (action !== "delete") {
                      addOp();
                      action = "delete";
                    }
                    deleteLen += 1;
                  } else if (!item.deleted) {
                    if (action !== "retain") {
                      addOp();
                      action = "retain";
                    }
                    retain += 1;
                  }
                  break;
                case ContentString:
                  if (this.adds(item)) {
                    if (!this.deletes(item)) {
                      if (action !== "insert") {
                        addOp();
                        action = "insert";
                      }
                      insert += /** @type {ContentString} */
                      item.content.str;
                    }
                  } else if (this.deletes(item)) {
                    if (action !== "delete") {
                      addOp();
                      action = "delete";
                    }
                    deleteLen += item.length;
                  } else if (!item.deleted) {
                    if (action !== "retain") {
                      addOp();
                      action = "retain";
                    }
                    retain += item.length;
                  }
                  break;
                case ContentFormat: {
                  const { key, value } = (
                    /** @type {ContentFormat} */
                    item.content
                  );
                  if (this.adds(item)) {
                    if (!this.deletes(item)) {
                      const curVal = currentAttributes.get(key) ?? null;
                      if (!equalAttrs(curVal, value)) {
                        if (action === "retain") {
                          addOp();
                        }
                        if (equalAttrs(value, oldAttributes.get(key) ?? null)) {
                          delete attributes[key];
                        } else {
                          attributes[key] = value;
                        }
                      } else if (value !== null) {
                        item.delete(transaction);
                      }
                    }
                  } else if (this.deletes(item)) {
                    oldAttributes.set(key, value);
                    const curVal = currentAttributes.get(key) ?? null;
                    if (!equalAttrs(curVal, value)) {
                      if (action === "retain") {
                        addOp();
                      }
                      attributes[key] = curVal;
                    }
                  } else if (!item.deleted) {
                    oldAttributes.set(key, value);
                    const attr = attributes[key];
                    if (attr !== void 0) {
                      if (!equalAttrs(attr, value)) {
                        if (action === "retain") {
                          addOp();
                        }
                        if (value === null) {
                          delete attributes[key];
                        } else {
                          attributes[key] = value;
                        }
                      } else if (attr !== null) {
                        item.delete(transaction);
                      }
                    }
                  }
                  if (!item.deleted) {
                    if (action === "insert") {
                      addOp();
                    }
                    updateCurrentAttributes(
                      currentAttributes,
                      /** @type {ContentFormat} */
                      item.content
                    );
                  }
                  break;
                }
              }
              item = item.right;
            }
            addOp();
            while (delta.length > 0) {
              const lastOp = delta[delta.length - 1];
              if (lastOp.retain !== void 0 && lastOp.attributes === void 0) {
                delta.pop();
              } else {
                break;
              }
            }
          });
          this._delta = delta;
        }
        return (
          /** @type {any} */
          this._delta
        );
      }
    };
    var YText = class _YText extends AbstractType {
      /**
       * @param {String} [string] The initial value of the YText.
       */
      constructor(string3) {
        super();
        this._pending = string3 !== void 0 ? [() => this.insert(0, string3)] : [];
        this._searchMarker = [];
        this._hasFormatting = false;
      }
      /**
       * Number of characters of this text type.
       *
       * @type {number}
       */
      get length() {
        this.doc ?? warnPrematureAccess();
        return this._length;
      }
      /**
       * @param {Doc} y
       * @param {Item} item
       */
      _integrate(y, item) {
        super._integrate(y, item);
        try {
          this._pending.forEach((f2) => f2());
        } catch (e) {
          console.error(e);
        }
        this._pending = null;
      }
      _copy() {
        return new _YText();
      }
      /**
       * Makes a copy of this data type that can be included somewhere else.
       *
       * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
       *
       * @return {YText}
       */
      clone() {
        const text2 = new _YText();
        text2.applyDelta(this.toDelta());
        return text2;
      }
      /**
       * Creates YTextEvent and calls observers.
       *
       * @param {Transaction} transaction
       * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
       */
      _callObserver(transaction, parentSubs) {
        super._callObserver(transaction, parentSubs);
        const event = new YTextEvent(this, transaction, parentSubs);
        callTypeObservers(this, transaction, event);
        if (!transaction.local && this._hasFormatting) {
          transaction._needFormattingCleanup = true;
        }
      }
      /**
       * Returns the unformatted string representation of this YText type.
       *
       * @public
       */
      toString() {
        this.doc ?? warnPrematureAccess();
        let str = "";
        let n = this._start;
        while (n !== null) {
          if (!n.deleted && n.countable && n.content.constructor === ContentString) {
            str += /** @type {ContentString} */
            n.content.str;
          }
          n = n.right;
        }
        return str;
      }
      /**
       * Returns the unformatted string representation of this YText type.
       *
       * @return {string}
       * @public
       */
      toJSON() {
        return this.toString();
      }
      /**
       * Apply a {@link Delta} on this shared YText type.
       *
       * @param {Array<any>} delta The changes to apply on this element.
       * @param {object}  opts
       * @param {boolean} [opts.sanitize] Sanitize input delta. Removes ending newlines if set to true.
       *
       *
       * @public
       */
      applyDelta(delta, { sanitize = true } = {}) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            const currPos = new ItemTextListPosition(null, this._start, 0, /* @__PURE__ */ new Map());
            for (let i = 0; i < delta.length; i++) {
              const op = delta[i];
              if (op.insert !== void 0) {
                const ins = !sanitize && typeof op.insert === "string" && i === delta.length - 1 && currPos.right === null && op.insert.slice(-1) === "\n" ? op.insert.slice(0, -1) : op.insert;
                if (typeof ins !== "string" || ins.length > 0) {
                  insertText(transaction, this, currPos, ins, op.attributes || {});
                }
              } else if (op.retain !== void 0) {
                formatText(transaction, this, currPos, op.retain, op.attributes || {});
              } else if (op.delete !== void 0) {
                deleteText(transaction, currPos, op.delete);
              }
            }
          });
        } else {
          this._pending.push(() => this.applyDelta(delta));
        }
      }
      /**
       * Returns the Delta representation of this YText type.
       *
       * @param {Snapshot} [snapshot]
       * @param {Snapshot} [prevSnapshot]
       * @param {function('removed' | 'added', ID):any} [computeYChange]
       * @return {any} The Delta representation of this type.
       *
       * @public
       */
      toDelta(snapshot2, prevSnapshot, computeYChange) {
        this.doc ?? warnPrematureAccess();
        const ops = [];
        const currentAttributes = /* @__PURE__ */ new Map();
        const doc2 = (
          /** @type {Doc} */
          this.doc
        );
        let str = "";
        let n = this._start;
        function packStr() {
          if (str.length > 0) {
            const attributes = {};
            let addAttributes = false;
            currentAttributes.forEach((value, key) => {
              addAttributes = true;
              attributes[key] = value;
            });
            const op = { insert: str };
            if (addAttributes) {
              op.attributes = attributes;
            }
            ops.push(op);
            str = "";
          }
        }
        const computeDelta = () => {
          while (n !== null) {
            if (isVisible(n, snapshot2) || prevSnapshot !== void 0 && isVisible(n, prevSnapshot)) {
              switch (n.content.constructor) {
                case ContentString: {
                  const cur = currentAttributes.get("ychange");
                  if (snapshot2 !== void 0 && !isVisible(n, snapshot2)) {
                    if (cur === void 0 || cur.user !== n.id.client || cur.type !== "removed") {
                      packStr();
                      currentAttributes.set("ychange", computeYChange ? computeYChange("removed", n.id) : { type: "removed" });
                    }
                  } else if (prevSnapshot !== void 0 && !isVisible(n, prevSnapshot)) {
                    if (cur === void 0 || cur.user !== n.id.client || cur.type !== "added") {
                      packStr();
                      currentAttributes.set("ychange", computeYChange ? computeYChange("added", n.id) : { type: "added" });
                    }
                  } else if (cur !== void 0) {
                    packStr();
                    currentAttributes.delete("ychange");
                  }
                  str += /** @type {ContentString} */
                  n.content.str;
                  break;
                }
                case ContentType:
                case ContentEmbed: {
                  packStr();
                  const op = {
                    insert: n.content.getContent()[0]
                  };
                  if (currentAttributes.size > 0) {
                    const attrs = (
                      /** @type {Object<string,any>} */
                      {}
                    );
                    op.attributes = attrs;
                    currentAttributes.forEach((value, key) => {
                      attrs[key] = value;
                    });
                  }
                  ops.push(op);
                  break;
                }
                case ContentFormat:
                  if (isVisible(n, snapshot2)) {
                    packStr();
                    updateCurrentAttributes(
                      currentAttributes,
                      /** @type {ContentFormat} */
                      n.content
                    );
                  }
                  break;
              }
            }
            n = n.right;
          }
          packStr();
        };
        if (snapshot2 || prevSnapshot) {
          transact(doc2, (transaction) => {
            if (snapshot2) {
              splitSnapshotAffectedStructs(transaction, snapshot2);
            }
            if (prevSnapshot) {
              splitSnapshotAffectedStructs(transaction, prevSnapshot);
            }
            computeDelta();
          }, "cleanup");
        } else {
          computeDelta();
        }
        return ops;
      }
      /**
       * Insert text at a given index.
       *
       * @param {number} index The index at which to start inserting.
       * @param {String} text The text to insert at the specified position.
       * @param {TextAttributes} [attributes] Optionally define some formatting
       *                                    information to apply on the inserted
       *                                    Text.
       * @public
       */
      insert(index, text2, attributes) {
        if (text2.length <= 0) {
          return;
        }
        const y = this.doc;
        if (y !== null) {
          transact(y, (transaction) => {
            const pos = findPosition(transaction, this, index, !attributes);
            if (!attributes) {
              attributes = {};
              pos.currentAttributes.forEach((v, k) => {
                attributes[k] = v;
              });
            }
            insertText(transaction, this, pos, text2, attributes);
          });
        } else {
          this._pending.push(() => this.insert(index, text2, attributes));
        }
      }
      /**
       * Inserts an embed at a index.
       *
       * @param {number} index The index to insert the embed at.
       * @param {Object | AbstractType<any>} embed The Object that represents the embed.
       * @param {TextAttributes} [attributes] Attribute information to apply on the
       *                                    embed
       *
       * @public
       */
      insertEmbed(index, embed, attributes) {
        const y = this.doc;
        if (y !== null) {
          transact(y, (transaction) => {
            const pos = findPosition(transaction, this, index, !attributes);
            insertText(transaction, this, pos, embed, attributes || {});
          });
        } else {
          this._pending.push(() => this.insertEmbed(index, embed, attributes || {}));
        }
      }
      /**
       * Deletes text starting from an index.
       *
       * @param {number} index Index at which to start deleting.
       * @param {number} length The number of characters to remove. Defaults to 1.
       *
       * @public
       */
      delete(index, length2) {
        if (length2 === 0) {
          return;
        }
        const y = this.doc;
        if (y !== null) {
          transact(y, (transaction) => {
            deleteText(transaction, findPosition(transaction, this, index, true), length2);
          });
        } else {
          this._pending.push(() => this.delete(index, length2));
        }
      }
      /**
       * Assigns properties to a range of text.
       *
       * @param {number} index The position where to start formatting.
       * @param {number} length The amount of characters to assign properties to.
       * @param {TextAttributes} attributes Attribute information to apply on the
       *                                    text.
       *
       * @public
       */
      format(index, length2, attributes) {
        if (length2 === 0) {
          return;
        }
        const y = this.doc;
        if (y !== null) {
          transact(y, (transaction) => {
            const pos = findPosition(transaction, this, index, false);
            if (pos.right === null) {
              return;
            }
            formatText(transaction, this, pos, length2, attributes);
          });
        } else {
          this._pending.push(() => this.format(index, length2, attributes));
        }
      }
      /**
       * Removes an attribute.
       *
       * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
       *
       * @param {String} attributeName The attribute name that is to be removed.
       *
       * @public
       */
      removeAttribute(attributeName) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeMapDelete(transaction, this, attributeName);
          });
        } else {
          this._pending.push(() => this.removeAttribute(attributeName));
        }
      }
      /**
       * Sets or updates an attribute.
       *
       * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
       *
       * @param {String} attributeName The attribute name that is to be set.
       * @param {any} attributeValue The attribute value that is to be set.
       *
       * @public
       */
      setAttribute(attributeName, attributeValue) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeMapSet(transaction, this, attributeName, attributeValue);
          });
        } else {
          this._pending.push(() => this.setAttribute(attributeName, attributeValue));
        }
      }
      /**
       * Returns an attribute value that belongs to the attribute name.
       *
       * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
       *
       * @param {String} attributeName The attribute name that identifies the
       *                               queried value.
       * @return {any} The queried attribute value.
       *
       * @public
       */
      getAttribute(attributeName) {
        return (
          /** @type {any} */
          typeMapGet(this, attributeName)
        );
      }
      /**
       * Returns all attribute name/value pairs in a JSON Object.
       *
       * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
       *
       * @return {Object<string, any>} A JSON Object that describes the attributes.
       *
       * @public
       */
      getAttributes() {
        return typeMapGetAll(this);
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       */
      _write(encoder) {
        encoder.writeTypeRef(YTextRefID);
      }
    };
    var readYText = (_decoder) => new YText();
    var YXmlTreeWalker = class {
      /**
       * @param {YXmlFragment | YXmlElement} root
       * @param {function(AbstractType<any>):boolean} [f]
       */
      constructor(root, f2 = () => true) {
        this._filter = f2;
        this._root = root;
        this._currentNode = /** @type {Item} */
        root._start;
        this._firstCall = true;
        root.doc ?? warnPrematureAccess();
      }
      [Symbol.iterator]() {
        return this;
      }
      /**
       * Get the next node.
       *
       * @return {IteratorResult<YXmlElement|YXmlText|YXmlHook>} The next node.
       *
       * @public
       */
      next() {
        let n = this._currentNode;
        let type = n && n.content && /** @type {any} */
        n.content.type;
        if (n !== null && (!this._firstCall || n.deleted || !this._filter(type))) {
          do {
            type = /** @type {any} */
            n.content.type;
            if (!n.deleted && (type.constructor === YXmlElement || type.constructor === YXmlFragment) && type._start !== null) {
              n = type._start;
            } else {
              while (n !== null) {
                const nxt = n.next;
                if (nxt !== null) {
                  n = nxt;
                  break;
                } else if (n.parent === this._root) {
                  n = null;
                } else {
                  n = /** @type {AbstractType<any>} */
                  n.parent._item;
                }
              }
            }
          } while (n !== null && (n.deleted || !this._filter(
            /** @type {ContentType} */
            n.content.type
          )));
        }
        this._firstCall = false;
        if (n === null) {
          return { value: void 0, done: true };
        }
        this._currentNode = n;
        return { value: (
          /** @type {any} */
          n.content.type
        ), done: false };
      }
    };
    var YXmlFragment = class _YXmlFragment extends AbstractType {
      constructor() {
        super();
        this._prelimContent = [];
      }
      /**
       * @type {YXmlElement|YXmlText|null}
       */
      get firstChild() {
        const first = this._first;
        return first ? first.content.getContent()[0] : null;
      }
      /**
       * Integrate this type into the Yjs instance.
       *
       * * Save this struct in the os
       * * This type is sent to other client
       * * Observer functions are fired
       *
       * @param {Doc} y The Yjs instance
       * @param {Item} item
       */
      _integrate(y, item) {
        super._integrate(y, item);
        this.insert(
          0,
          /** @type {Array<any>} */
          this._prelimContent
        );
        this._prelimContent = null;
      }
      _copy() {
        return new _YXmlFragment();
      }
      /**
       * Makes a copy of this data type that can be included somewhere else.
       *
       * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
       *
       * @return {YXmlFragment}
       */
      clone() {
        const el = new _YXmlFragment();
        el.insert(0, this.toArray().map((item) => item instanceof AbstractType ? item.clone() : item));
        return el;
      }
      get length() {
        this.doc ?? warnPrematureAccess();
        return this._prelimContent === null ? this._length : this._prelimContent.length;
      }
      /**
       * Create a subtree of childNodes.
       *
       * @example
       * const walker = elem.createTreeWalker(dom => dom.nodeName === 'div')
       * for (let node in walker) {
       *   // `node` is a div node
       *   nop(node)
       * }
       *
       * @param {function(AbstractType<any>):boolean} filter Function that is called on each child element and
       *                          returns a Boolean indicating whether the child
       *                          is to be included in the subtree.
       * @return {YXmlTreeWalker} A subtree and a position within it.
       *
       * @public
       */
      createTreeWalker(filter) {
        return new YXmlTreeWalker(this, filter);
      }
      /**
       * Returns the first YXmlElement that matches the query.
       * Similar to DOM's {@link querySelector}.
       *
       * Query support:
       *   - tagname
       * TODO:
       *   - id
       *   - attribute
       *
       * @param {CSS_Selector} query The query on the children.
       * @return {YXmlElement|YXmlText|YXmlHook|null} The first element that matches the query or null.
       *
       * @public
       */
      querySelector(query) {
        query = query.toUpperCase();
        const iterator2 = new YXmlTreeWalker(this, (element2) => element2.nodeName && element2.nodeName.toUpperCase() === query);
        const next = iterator2.next();
        if (next.done) {
          return null;
        } else {
          return next.value;
        }
      }
      /**
       * Returns all YXmlElements that match the query.
       * Similar to Dom's {@link querySelectorAll}.
       *
       * @todo Does not yet support all queries. Currently only query by tagName.
       *
       * @param {CSS_Selector} query The query on the children
       * @return {Array<YXmlElement|YXmlText|YXmlHook|null>} The elements that match this query.
       *
       * @public
       */
      querySelectorAll(query) {
        query = query.toUpperCase();
        return array__namespace.from(new YXmlTreeWalker(this, (element2) => element2.nodeName && element2.nodeName.toUpperCase() === query));
      }
      /**
       * Creates YXmlEvent and calls observers.
       *
       * @param {Transaction} transaction
       * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
       */
      _callObserver(transaction, parentSubs) {
        callTypeObservers(this, transaction, new YXmlEvent(this, parentSubs, transaction));
      }
      /**
       * Get the string representation of all the children of this YXmlFragment.
       *
       * @return {string} The string representation of all children.
       */
      toString() {
        return typeListMap(this, (xml) => xml.toString()).join("");
      }
      /**
       * @return {string}
       */
      toJSON() {
        return this.toString();
      }
      /**
       * Creates a Dom Element that mirrors this YXmlElement.
       *
       * @param {Document} [_document=document] The document object (you must define
       *                                        this when calling this method in
       *                                        nodejs)
       * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
       *                                             are presented in the DOM
       * @param {any} [binding] You should not set this property. This is
       *                               used if DomBinding wants to create a
       *                               association to the created DOM type.
       * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
       *
       * @public
       */
      toDOM(_document = document, hooks = {}, binding) {
        const fragment2 = _document.createDocumentFragment();
        if (binding !== void 0) {
          binding._createAssociation(fragment2, this);
        }
        typeListForEach(this, (xmlType) => {
          fragment2.insertBefore(xmlType.toDOM(_document, hooks, binding), null);
        });
        return fragment2;
      }
      /**
       * Inserts new content at an index.
       *
       * @example
       *  // Insert character 'a' at position 0
       *  xml.insert(0, [new Y.XmlText('text')])
       *
       * @param {number} index The index to insert content at
       * @param {Array<YXmlElement|YXmlText>} content The array of content
       */
      insert(index, content) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeListInsertGenerics(transaction, this, index, content);
          });
        } else {
          this._prelimContent.splice(index, 0, ...content);
        }
      }
      /**
       * Inserts new content at an index.
       *
       * @example
       *  // Insert character 'a' at position 0
       *  xml.insert(0, [new Y.XmlText('text')])
       *
       * @param {null|Item|YXmlElement|YXmlText} ref The index to insert content at
       * @param {Array<YXmlElement|YXmlText>} content The array of content
       */
      insertAfter(ref, content) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            const refItem = ref && ref instanceof AbstractType ? ref._item : ref;
            typeListInsertGenericsAfter(transaction, this, refItem, content);
          });
        } else {
          const pc = (
            /** @type {Array<any>} */
            this._prelimContent
          );
          const index = ref === null ? 0 : pc.findIndex((el) => el === ref) + 1;
          if (index === 0 && ref !== null) {
            throw error__namespace.create("Reference item not found");
          }
          pc.splice(index, 0, ...content);
        }
      }
      /**
       * Deletes elements starting from an index.
       *
       * @param {number} index Index at which to start deleting elements
       * @param {number} [length=1] The number of elements to remove. Defaults to 1.
       */
      delete(index, length2 = 1) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeListDelete(transaction, this, index, length2);
          });
        } else {
          this._prelimContent.splice(index, length2);
        }
      }
      /**
       * Transforms this YArray to a JavaScript Array.
       *
       * @return {Array<YXmlElement|YXmlText|YXmlHook>}
       */
      toArray() {
        return typeListToArray(this);
      }
      /**
       * Appends content to this YArray.
       *
       * @param {Array<YXmlElement|YXmlText>} content Array of content to append.
       */
      push(content) {
        this.insert(this.length, content);
      }
      /**
       * Prepends content to this YArray.
       *
       * @param {Array<YXmlElement|YXmlText>} content Array of content to prepend.
       */
      unshift(content) {
        this.insert(0, content);
      }
      /**
       * Returns the i-th element from a YArray.
       *
       * @param {number} index The index of the element to return from the YArray
       * @return {YXmlElement|YXmlText}
       */
      get(index) {
        return typeListGet(this, index);
      }
      /**
       * Returns a portion of this YXmlFragment into a JavaScript Array selected
       * from start to end (end not included).
       *
       * @param {number} [start]
       * @param {number} [end]
       * @return {Array<YXmlElement|YXmlText>}
       */
      slice(start = 0, end = this.length) {
        return typeListSlice(this, start, end);
      }
      /**
       * Executes a provided function on once on every child element.
       *
       * @param {function(YXmlElement|YXmlText,number, typeof self):void} f A function to execute on every element of this YArray.
       */
      forEach(f2) {
        typeListForEach(this, f2);
      }
      /**
       * Transform the properties of this type to binary and write it to an
       * BinaryEncoder.
       *
       * This is called when this Item is sent to a remote peer.
       *
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
       */
      _write(encoder) {
        encoder.writeTypeRef(YXmlFragmentRefID);
      }
    };
    var readYXmlFragment = (_decoder) => new YXmlFragment();
    var YXmlElement = class _YXmlElement extends YXmlFragment {
      constructor(nodeName = "UNDEFINED") {
        super();
        this.nodeName = nodeName;
        this._prelimAttrs = /* @__PURE__ */ new Map();
      }
      /**
       * @type {YXmlElement|YXmlText|null}
       */
      get nextSibling() {
        const n = this._item ? this._item.next : null;
        return n ? (
          /** @type {YXmlElement|YXmlText} */
          /** @type {ContentType} */
          n.content.type
        ) : null;
      }
      /**
       * @type {YXmlElement|YXmlText|null}
       */
      get prevSibling() {
        const n = this._item ? this._item.prev : null;
        return n ? (
          /** @type {YXmlElement|YXmlText} */
          /** @type {ContentType} */
          n.content.type
        ) : null;
      }
      /**
       * Integrate this type into the Yjs instance.
       *
       * * Save this struct in the os
       * * This type is sent to other client
       * * Observer functions are fired
       *
       * @param {Doc} y The Yjs instance
       * @param {Item} item
       */
      _integrate(y, item) {
        super._integrate(y, item);
        /** @type {Map<string, any>} */
        this._prelimAttrs.forEach((value, key) => {
          this.setAttribute(key, value);
        });
        this._prelimAttrs = null;
      }
      /**
       * Creates an Item with the same effect as this Item (without position effect)
       *
       * @return {YXmlElement}
       */
      _copy() {
        return new _YXmlElement(this.nodeName);
      }
      /**
       * Makes a copy of this data type that can be included somewhere else.
       *
       * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
       *
       * @return {YXmlElement<KV>}
       */
      clone() {
        const el = new _YXmlElement(this.nodeName);
        const attrs = this.getAttributes();
        object__namespace.forEach(attrs, (value, key) => {
          el.setAttribute(
            key,
            /** @type {any} */
            value
          );
        });
        el.insert(0, this.toArray().map((v) => v instanceof AbstractType ? v.clone() : v));
        return el;
      }
      /**
       * Returns the XML serialization of this YXmlElement.
       * The attributes are ordered by attribute-name, so you can easily use this
       * method to compare YXmlElements
       *
       * @return {string} The string representation of this type.
       *
       * @public
       */
      toString() {
        const attrs = this.getAttributes();
        const stringBuilder = [];
        const keys2 = [];
        for (const key in attrs) {
          keys2.push(key);
        }
        keys2.sort();
        const keysLen = keys2.length;
        for (let i = 0; i < keysLen; i++) {
          const key = keys2[i];
          stringBuilder.push(key + '="' + attrs[key] + '"');
        }
        const nodeName = this.nodeName.toLocaleLowerCase();
        const attrsString = stringBuilder.length > 0 ? " " + stringBuilder.join(" ") : "";
        return `<${nodeName}${attrsString}>${super.toString()}</${nodeName}>`;
      }
      /**
       * Removes an attribute from this YXmlElement.
       *
       * @param {string} attributeName The attribute name that is to be removed.
       *
       * @public
       */
      removeAttribute(attributeName) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeMapDelete(transaction, this, attributeName);
          });
        } else {
          this._prelimAttrs.delete(attributeName);
        }
      }
      /**
       * Sets or updates an attribute.
       *
       * @template {keyof KV & string} KEY
       *
       * @param {KEY} attributeName The attribute name that is to be set.
       * @param {KV[KEY]} attributeValue The attribute value that is to be set.
       *
       * @public
       */
      setAttribute(attributeName, attributeValue) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeMapSet(transaction, this, attributeName, attributeValue);
          });
        } else {
          this._prelimAttrs.set(attributeName, attributeValue);
        }
      }
      /**
       * Returns an attribute value that belongs to the attribute name.
       *
       * @template {keyof KV & string} KEY
       *
       * @param {KEY} attributeName The attribute name that identifies the
       *                               queried value.
       * @return {KV[KEY]|undefined} The queried attribute value.
       *
       * @public
       */
      getAttribute(attributeName) {
        return (
          /** @type {any} */
          typeMapGet(this, attributeName)
        );
      }
      /**
       * Returns whether an attribute exists
       *
       * @param {string} attributeName The attribute name to check for existence.
       * @return {boolean} whether the attribute exists.
       *
       * @public
       */
      hasAttribute(attributeName) {
        return (
          /** @type {any} */
          typeMapHas(this, attributeName)
        );
      }
      /**
       * Returns all attribute name/value pairs in a JSON Object.
       *
       * @param {Snapshot} [snapshot]
       * @return {{ [Key in Extract<keyof KV,string>]?: KV[Key]}} A JSON Object that describes the attributes.
       *
       * @public
       */
      getAttributes(snapshot2) {
        return (
          /** @type {any} */
          snapshot2 ? typeMapGetAllSnapshot(this, snapshot2) : typeMapGetAll(this)
        );
      }
      /**
       * Creates a Dom Element that mirrors this YXmlElement.
       *
       * @param {Document} [_document=document] The document object (you must define
       *                                        this when calling this method in
       *                                        nodejs)
       * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
       *                                             are presented in the DOM
       * @param {any} [binding] You should not set this property. This is
       *                               used if DomBinding wants to create a
       *                               association to the created DOM type.
       * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
       *
       * @public
       */
      toDOM(_document = document, hooks = {}, binding) {
        const dom = _document.createElement(this.nodeName);
        const attrs = this.getAttributes();
        for (const key in attrs) {
          const value = attrs[key];
          if (typeof value === "string") {
            dom.setAttribute(key, value);
          }
        }
        typeListForEach(this, (yxml) => {
          dom.appendChild(yxml.toDOM(_document, hooks, binding));
        });
        if (binding !== void 0) {
          binding._createAssociation(dom, this);
        }
        return dom;
      }
      /**
       * Transform the properties of this type to binary and write it to an
       * BinaryEncoder.
       *
       * This is called when this Item is sent to a remote peer.
       *
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
       */
      _write(encoder) {
        encoder.writeTypeRef(YXmlElementRefID);
        encoder.writeKey(this.nodeName);
      }
    };
    var readYXmlElement = (decoder) => new YXmlElement(decoder.readKey());
    var YXmlEvent = class extends YEvent {
      /**
       * @param {YXmlElement|YXmlText|YXmlFragment} target The target on which the event is created.
       * @param {Set<string|null>} subs The set of changed attributes. `null` is included if the
       *                   child list changed.
       * @param {Transaction} transaction The transaction instance with which the
       *                                  change was created.
       */
      constructor(target, subs, transaction) {
        super(target, transaction);
        this.childListChanged = false;
        this.attributesChanged = /* @__PURE__ */ new Set();
        subs.forEach((sub) => {
          if (sub === null) {
            this.childListChanged = true;
          } else {
            this.attributesChanged.add(sub);
          }
        });
      }
    };
    var YXmlHook = class _YXmlHook extends YMap {
      /**
       * @param {string} hookName nodeName of the Dom Node.
       */
      constructor(hookName) {
        super();
        this.hookName = hookName;
      }
      /**
       * Creates an Item with the same effect as this Item (without position effect)
       */
      _copy() {
        return new _YXmlHook(this.hookName);
      }
      /**
       * Makes a copy of this data type that can be included somewhere else.
       *
       * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
       *
       * @return {YXmlHook}
       */
      clone() {
        const el = new _YXmlHook(this.hookName);
        this.forEach((value, key) => {
          el.set(key, value);
        });
        return el;
      }
      /**
       * Creates a Dom Element that mirrors this YXmlElement.
       *
       * @param {Document} [_document=document] The document object (you must define
       *                                        this when calling this method in
       *                                        nodejs)
       * @param {Object.<string, any>} [hooks] Optional property to customize how hooks
       *                                             are presented in the DOM
       * @param {any} [binding] You should not set this property. This is
       *                               used if DomBinding wants to create a
       *                               association to the created DOM type
       * @return {Element} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
       *
       * @public
       */
      toDOM(_document = document, hooks = {}, binding) {
        const hook = hooks[this.hookName];
        let dom;
        if (hook !== void 0) {
          dom = hook.createDom(this);
        } else {
          dom = document.createElement(this.hookName);
        }
        dom.setAttribute("data-yjs-hook", this.hookName);
        if (binding !== void 0) {
          binding._createAssociation(dom, this);
        }
        return dom;
      }
      /**
       * Transform the properties of this type to binary and write it to an
       * BinaryEncoder.
       *
       * This is called when this Item is sent to a remote peer.
       *
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
       */
      _write(encoder) {
        encoder.writeTypeRef(YXmlHookRefID);
        encoder.writeKey(this.hookName);
      }
    };
    var readYXmlHook = (decoder) => new YXmlHook(decoder.readKey());
    var YXmlText = class _YXmlText extends YText {
      /**
       * @type {YXmlElement|YXmlText|null}
       */
      get nextSibling() {
        const n = this._item ? this._item.next : null;
        return n ? (
          /** @type {YXmlElement|YXmlText} */
          /** @type {ContentType} */
          n.content.type
        ) : null;
      }
      /**
       * @type {YXmlElement|YXmlText|null}
       */
      get prevSibling() {
        const n = this._item ? this._item.prev : null;
        return n ? (
          /** @type {YXmlElement|YXmlText} */
          /** @type {ContentType} */
          n.content.type
        ) : null;
      }
      _copy() {
        return new _YXmlText();
      }
      /**
       * Makes a copy of this data type that can be included somewhere else.
       *
       * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
       *
       * @return {YXmlText}
       */
      clone() {
        const text2 = new _YXmlText();
        text2.applyDelta(this.toDelta());
        return text2;
      }
      /**
       * Creates a Dom Element that mirrors this YXmlText.
       *
       * @param {Document} [_document=document] The document object (you must define
       *                                        this when calling this method in
       *                                        nodejs)
       * @param {Object<string, any>} [hooks] Optional property to customize how hooks
       *                                             are presented in the DOM
       * @param {any} [binding] You should not set this property. This is
       *                               used if DomBinding wants to create a
       *                               association to the created DOM type.
       * @return {Text} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
       *
       * @public
       */
      toDOM(_document = document, hooks, binding) {
        const dom = _document.createTextNode(this.toString());
        if (binding !== void 0) {
          binding._createAssociation(dom, this);
        }
        return dom;
      }
      toString() {
        return this.toDelta().map((delta) => {
          const nestedNodes = [];
          for (const nodeName in delta.attributes) {
            const attrs = [];
            for (const key in delta.attributes[nodeName]) {
              attrs.push({ key, value: delta.attributes[nodeName][key] });
            }
            attrs.sort((a, b) => a.key < b.key ? -1 : 1);
            nestedNodes.push({ nodeName, attrs });
          }
          nestedNodes.sort((a, b) => a.nodeName < b.nodeName ? -1 : 1);
          let str = "";
          for (let i = 0; i < nestedNodes.length; i++) {
            const node = nestedNodes[i];
            str += `<${node.nodeName}`;
            for (let j = 0; j < node.attrs.length; j++) {
              const attr = node.attrs[j];
              str += ` ${attr.key}="${attr.value}"`;
            }
            str += ">";
          }
          str += delta.insert;
          for (let i = nestedNodes.length - 1; i >= 0; i--) {
            str += `</${nestedNodes[i].nodeName}>`;
          }
          return str;
        }).join("");
      }
      /**
       * @return {string}
       */
      toJSON() {
        return this.toString();
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       */
      _write(encoder) {
        encoder.writeTypeRef(YXmlTextRefID);
      }
    };
    var readYXmlText = (decoder) => new YXmlText();
    var AbstractStruct = class {
      /**
       * @param {ID} id
       * @param {number} length
       */
      constructor(id, length2) {
        this.id = id;
        this.length = length2;
      }
      /**
       * @type {boolean}
       */
      get deleted() {
        throw error__namespace.methodUnimplemented();
      }
      /**
       * Merge this struct with the item to the right.
       * This method is already assuming that `this.id.clock + this.length === this.id.clock`.
       * Also this method does *not* remove right from StructStore!
       * @param {AbstractStruct} right
       * @return {boolean} whether this merged with right
       */
      mergeWith(right) {
        return false;
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
       * @param {number} offset
       * @param {number} encodingRef
       */
      write(encoder, offset, encodingRef) {
        throw error__namespace.methodUnimplemented();
      }
      /**
       * @param {Transaction} transaction
       * @param {number} offset
       */
      integrate(transaction, offset) {
        throw error__namespace.methodUnimplemented();
      }
    };
    var structGCRefNumber = 0;
    var GC = class extends AbstractStruct {
      get deleted() {
        return true;
      }
      delete() {
      }
      /**
       * @param {GC} right
       * @return {boolean}
       */
      mergeWith(right) {
        if (this.constructor !== right.constructor) {
          return false;
        }
        this.length += right.length;
        return true;
      }
      /**
       * @param {Transaction} transaction
       * @param {number} offset
       */
      integrate(transaction, offset) {
        if (offset > 0) {
          this.id.clock += offset;
          this.length -= offset;
        }
        addStruct(transaction.doc.store, this);
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        encoder.writeInfo(structGCRefNumber);
        encoder.writeLen(this.length - offset);
      }
      /**
       * @param {Transaction} transaction
       * @param {StructStore} store
       * @return {null | number}
       */
      getMissing(transaction, store) {
        return null;
      }
    };
    var ContentBinary = class _ContentBinary {
      /**
       * @param {Uint8Array} content
       */
      constructor(content) {
        this.content = content;
      }
      /**
       * @return {number}
       */
      getLength() {
        return 1;
      }
      /**
       * @return {Array<any>}
       */
      getContent() {
        return [this.content];
      }
      /**
       * @return {boolean}
       */
      isCountable() {
        return true;
      }
      /**
       * @return {ContentBinary}
       */
      copy() {
        return new _ContentBinary(this.content);
      }
      /**
       * @param {number} offset
       * @return {ContentBinary}
       */
      splice(offset) {
        throw error__namespace.methodUnimplemented();
      }
      /**
       * @param {ContentBinary} right
       * @return {boolean}
       */
      mergeWith(right) {
        return false;
      }
      /**
       * @param {Transaction} transaction
       * @param {Item} item
       */
      integrate(transaction, item) {
      }
      /**
       * @param {Transaction} transaction
       */
      delete(transaction) {
      }
      /**
       * @param {StructStore} store
       */
      gc(store) {
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        encoder.writeBuf(this.content);
      }
      /**
       * @return {number}
       */
      getRef() {
        return 3;
      }
    };
    var readContentBinary = (decoder) => new ContentBinary(decoder.readBuf());
    var ContentDeleted = class _ContentDeleted {
      /**
       * @param {number} len
       */
      constructor(len) {
        this.len = len;
      }
      /**
       * @return {number}
       */
      getLength() {
        return this.len;
      }
      /**
       * @return {Array<any>}
       */
      getContent() {
        return [];
      }
      /**
       * @return {boolean}
       */
      isCountable() {
        return false;
      }
      /**
       * @return {ContentDeleted}
       */
      copy() {
        return new _ContentDeleted(this.len);
      }
      /**
       * @param {number} offset
       * @return {ContentDeleted}
       */
      splice(offset) {
        const right = new _ContentDeleted(this.len - offset);
        this.len = offset;
        return right;
      }
      /**
       * @param {ContentDeleted} right
       * @return {boolean}
       */
      mergeWith(right) {
        this.len += right.len;
        return true;
      }
      /**
       * @param {Transaction} transaction
       * @param {Item} item
       */
      integrate(transaction, item) {
        addToDeleteSet(transaction.deleteSet, item.id.client, item.id.clock, this.len);
        item.markDeleted();
      }
      /**
       * @param {Transaction} transaction
       */
      delete(transaction) {
      }
      /**
       * @param {StructStore} store
       */
      gc(store) {
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        encoder.writeLen(this.len - offset);
      }
      /**
       * @return {number}
       */
      getRef() {
        return 1;
      }
    };
    var readContentDeleted = (decoder) => new ContentDeleted(decoder.readLen());
    var createDocFromOpts = (guid, opts) => new Doc2({ guid, ...opts, shouldLoad: opts.shouldLoad || opts.autoLoad || false });
    var ContentDoc = class _ContentDoc {
      /**
       * @param {Doc} doc
       */
      constructor(doc2) {
        if (doc2._item) {
          console.error("This document was already integrated as a sub-document. You should create a second instance instead with the same guid.");
        }
        this.doc = doc2;
        const opts = {};
        this.opts = opts;
        if (!doc2.gc) {
          opts.gc = false;
        }
        if (doc2.autoLoad) {
          opts.autoLoad = true;
        }
        if (doc2.meta !== null) {
          opts.meta = doc2.meta;
        }
      }
      /**
       * @return {number}
       */
      getLength() {
        return 1;
      }
      /**
       * @return {Array<any>}
       */
      getContent() {
        return [this.doc];
      }
      /**
       * @return {boolean}
       */
      isCountable() {
        return true;
      }
      /**
       * @return {ContentDoc}
       */
      copy() {
        return new _ContentDoc(createDocFromOpts(this.doc.guid, this.opts));
      }
      /**
       * @param {number} offset
       * @return {ContentDoc}
       */
      splice(offset) {
        throw error__namespace.methodUnimplemented();
      }
      /**
       * @param {ContentDoc} right
       * @return {boolean}
       */
      mergeWith(right) {
        return false;
      }
      /**
       * @param {Transaction} transaction
       * @param {Item} item
       */
      integrate(transaction, item) {
        this.doc._item = item;
        transaction.subdocsAdded.add(this.doc);
        if (this.doc.shouldLoad) {
          transaction.subdocsLoaded.add(this.doc);
        }
      }
      /**
       * @param {Transaction} transaction
       */
      delete(transaction) {
        if (transaction.subdocsAdded.has(this.doc)) {
          transaction.subdocsAdded.delete(this.doc);
        } else {
          transaction.subdocsRemoved.add(this.doc);
        }
      }
      /**
       * @param {StructStore} store
       */
      gc(store) {
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        encoder.writeString(this.doc.guid);
        encoder.writeAny(this.opts);
      }
      /**
       * @return {number}
       */
      getRef() {
        return 9;
      }
    };
    var readContentDoc = (decoder) => new ContentDoc(createDocFromOpts(decoder.readString(), decoder.readAny()));
    var ContentEmbed = class _ContentEmbed {
      /**
       * @param {Object} embed
       */
      constructor(embed) {
        this.embed = embed;
      }
      /**
       * @return {number}
       */
      getLength() {
        return 1;
      }
      /**
       * @return {Array<any>}
       */
      getContent() {
        return [this.embed];
      }
      /**
       * @return {boolean}
       */
      isCountable() {
        return true;
      }
      /**
       * @return {ContentEmbed}
       */
      copy() {
        return new _ContentEmbed(this.embed);
      }
      /**
       * @param {number} offset
       * @return {ContentEmbed}
       */
      splice(offset) {
        throw error__namespace.methodUnimplemented();
      }
      /**
       * @param {ContentEmbed} right
       * @return {boolean}
       */
      mergeWith(right) {
        return false;
      }
      /**
       * @param {Transaction} transaction
       * @param {Item} item
       */
      integrate(transaction, item) {
      }
      /**
       * @param {Transaction} transaction
       */
      delete(transaction) {
      }
      /**
       * @param {StructStore} store
       */
      gc(store) {
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        encoder.writeJSON(this.embed);
      }
      /**
       * @return {number}
       */
      getRef() {
        return 5;
      }
    };
    var readContentEmbed = (decoder) => new ContentEmbed(decoder.readJSON());
    var ContentFormat = class _ContentFormat {
      /**
       * @param {string} key
       * @param {Object} value
       */
      constructor(key, value) {
        this.key = key;
        this.value = value;
      }
      /**
       * @return {number}
       */
      getLength() {
        return 1;
      }
      /**
       * @return {Array<any>}
       */
      getContent() {
        return [];
      }
      /**
       * @return {boolean}
       */
      isCountable() {
        return false;
      }
      /**
       * @return {ContentFormat}
       */
      copy() {
        return new _ContentFormat(this.key, this.value);
      }
      /**
       * @param {number} _offset
       * @return {ContentFormat}
       */
      splice(_offset) {
        throw error__namespace.methodUnimplemented();
      }
      /**
       * @param {ContentFormat} _right
       * @return {boolean}
       */
      mergeWith(_right) {
        return false;
      }
      /**
       * @param {Transaction} _transaction
       * @param {Item} item
       */
      integrate(_transaction, item) {
        const p = (
          /** @type {YText} */
          item.parent
        );
        p._searchMarker = null;
        p._hasFormatting = true;
      }
      /**
       * @param {Transaction} transaction
       */
      delete(transaction) {
      }
      /**
       * @param {StructStore} store
       */
      gc(store) {
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        encoder.writeKey(this.key);
        encoder.writeJSON(this.value);
      }
      /**
       * @return {number}
       */
      getRef() {
        return 6;
      }
    };
    var readContentFormat = (decoder) => new ContentFormat(decoder.readKey(), decoder.readJSON());
    var ContentJSON = class _ContentJSON {
      /**
       * @param {Array<any>} arr
       */
      constructor(arr) {
        this.arr = arr;
      }
      /**
       * @return {number}
       */
      getLength() {
        return this.arr.length;
      }
      /**
       * @return {Array<any>}
       */
      getContent() {
        return this.arr;
      }
      /**
       * @return {boolean}
       */
      isCountable() {
        return true;
      }
      /**
       * @return {ContentJSON}
       */
      copy() {
        return new _ContentJSON(this.arr);
      }
      /**
       * @param {number} offset
       * @return {ContentJSON}
       */
      splice(offset) {
        const right = new _ContentJSON(this.arr.slice(offset));
        this.arr = this.arr.slice(0, offset);
        return right;
      }
      /**
       * @param {ContentJSON} right
       * @return {boolean}
       */
      mergeWith(right) {
        this.arr = this.arr.concat(right.arr);
        return true;
      }
      /**
       * @param {Transaction} transaction
       * @param {Item} item
       */
      integrate(transaction, item) {
      }
      /**
       * @param {Transaction} transaction
       */
      delete(transaction) {
      }
      /**
       * @param {StructStore} store
       */
      gc(store) {
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        const len = this.arr.length;
        encoder.writeLen(len - offset);
        for (let i = offset; i < len; i++) {
          const c = this.arr[i];
          encoder.writeString(c === void 0 ? "undefined" : JSON.stringify(c));
        }
      }
      /**
       * @return {number}
       */
      getRef() {
        return 2;
      }
    };
    var readContentJSON = (decoder) => {
      const len = decoder.readLen();
      const cs = [];
      for (let i = 0; i < len; i++) {
        const c = decoder.readString();
        if (c === "undefined") {
          cs.push(void 0);
        } else {
          cs.push(JSON.parse(c));
        }
      }
      return new ContentJSON(cs);
    };
    var isDevMode = env__namespace.getVariable("node_env") === "development";
    var ContentAny = class _ContentAny {
      /**
       * @param {Array<any>} arr
       */
      constructor(arr) {
        this.arr = arr;
        isDevMode && object__namespace.deepFreeze(arr);
      }
      /**
       * @return {number}
       */
      getLength() {
        return this.arr.length;
      }
      /**
       * @return {Array<any>}
       */
      getContent() {
        return this.arr;
      }
      /**
       * @return {boolean}
       */
      isCountable() {
        return true;
      }
      /**
       * @return {ContentAny}
       */
      copy() {
        return new _ContentAny(this.arr);
      }
      /**
       * @param {number} offset
       * @return {ContentAny}
       */
      splice(offset) {
        const right = new _ContentAny(this.arr.slice(offset));
        this.arr = this.arr.slice(0, offset);
        return right;
      }
      /**
       * @param {ContentAny} right
       * @return {boolean}
       */
      mergeWith(right) {
        this.arr = this.arr.concat(right.arr);
        return true;
      }
      /**
       * @param {Transaction} transaction
       * @param {Item} item
       */
      integrate(transaction, item) {
      }
      /**
       * @param {Transaction} transaction
       */
      delete(transaction) {
      }
      /**
       * @param {StructStore} store
       */
      gc(store) {
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        const len = this.arr.length;
        encoder.writeLen(len - offset);
        for (let i = offset; i < len; i++) {
          const c = this.arr[i];
          encoder.writeAny(c);
        }
      }
      /**
       * @return {number}
       */
      getRef() {
        return 8;
      }
    };
    var readContentAny = (decoder) => {
      const len = decoder.readLen();
      const cs = [];
      for (let i = 0; i < len; i++) {
        cs.push(decoder.readAny());
      }
      return new ContentAny(cs);
    };
    var ContentString = class _ContentString {
      /**
       * @param {string} str
       */
      constructor(str) {
        this.str = str;
      }
      /**
       * @return {number}
       */
      getLength() {
        return this.str.length;
      }
      /**
       * @return {Array<any>}
       */
      getContent() {
        return this.str.split("");
      }
      /**
       * @return {boolean}
       */
      isCountable() {
        return true;
      }
      /**
       * @return {ContentString}
       */
      copy() {
        return new _ContentString(this.str);
      }
      /**
       * @param {number} offset
       * @return {ContentString}
       */
      splice(offset) {
        const right = new _ContentString(this.str.slice(offset));
        this.str = this.str.slice(0, offset);
        const firstCharCode = this.str.charCodeAt(offset - 1);
        if (firstCharCode >= 55296 && firstCharCode <= 56319) {
          this.str = this.str.slice(0, offset - 1) + "\uFFFD";
          right.str = "\uFFFD" + right.str.slice(1);
        }
        return right;
      }
      /**
       * @param {ContentString} right
       * @return {boolean}
       */
      mergeWith(right) {
        this.str += right.str;
        return true;
      }
      /**
       * @param {Transaction} transaction
       * @param {Item} item
       */
      integrate(transaction, item) {
      }
      /**
       * @param {Transaction} transaction
       */
      delete(transaction) {
      }
      /**
       * @param {StructStore} store
       */
      gc(store) {
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        encoder.writeString(offset === 0 ? this.str : this.str.slice(offset));
      }
      /**
       * @return {number}
       */
      getRef() {
        return 4;
      }
    };
    var readContentString = (decoder) => new ContentString(decoder.readString());
    var typeRefs = [
      readYArray,
      readYMap,
      readYText,
      readYXmlElement,
      readYXmlFragment,
      readYXmlHook,
      readYXmlText
    ];
    var YArrayRefID = 0;
    var YMapRefID = 1;
    var YTextRefID = 2;
    var YXmlElementRefID = 3;
    var YXmlFragmentRefID = 4;
    var YXmlHookRefID = 5;
    var YXmlTextRefID = 6;
    var ContentType = class _ContentType {
      /**
       * @param {AbstractType<any>} type
       */
      constructor(type) {
        this.type = type;
      }
      /**
       * @return {number}
       */
      getLength() {
        return 1;
      }
      /**
       * @return {Array<any>}
       */
      getContent() {
        return [this.type];
      }
      /**
       * @return {boolean}
       */
      isCountable() {
        return true;
      }
      /**
       * @return {ContentType}
       */
      copy() {
        return new _ContentType(this.type._copy());
      }
      /**
       * @param {number} offset
       * @return {ContentType}
       */
      splice(offset) {
        throw error__namespace.methodUnimplemented();
      }
      /**
       * @param {ContentType} right
       * @return {boolean}
       */
      mergeWith(right) {
        return false;
      }
      /**
       * @param {Transaction} transaction
       * @param {Item} item
       */
      integrate(transaction, item) {
        this.type._integrate(transaction.doc, item);
      }
      /**
       * @param {Transaction} transaction
       */
      delete(transaction) {
        let item = this.type._start;
        while (item !== null) {
          if (!item.deleted) {
            item.delete(transaction);
          } else if (item.id.clock < (transaction.beforeState.get(item.id.client) || 0)) {
            transaction._mergeStructs.push(item);
          }
          item = item.right;
        }
        this.type._map.forEach((item2) => {
          if (!item2.deleted) {
            item2.delete(transaction);
          } else if (item2.id.clock < (transaction.beforeState.get(item2.id.client) || 0)) {
            transaction._mergeStructs.push(item2);
          }
        });
        transaction.changed.delete(this.type);
      }
      /**
       * @param {StructStore} store
       */
      gc(store) {
        let item = this.type._start;
        while (item !== null) {
          item.gc(store, true);
          item = item.right;
        }
        this.type._start = null;
        this.type._map.forEach(
          /** @param {Item | null} item */
          (item2) => {
            while (item2 !== null) {
              item2.gc(store, true);
              item2 = item2.left;
            }
          }
        );
        this.type._map = /* @__PURE__ */ new Map();
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        this.type._write(encoder);
      }
      /**
       * @return {number}
       */
      getRef() {
        return 7;
      }
    };
    var readContentType = (decoder) => new ContentType(typeRefs[decoder.readTypeRef()](decoder));
    var followRedone = (store, id) => {
      let nextID = id;
      let diff = 0;
      let item;
      do {
        if (diff > 0) {
          nextID = createID(nextID.client, nextID.clock + diff);
        }
        item = getItem(store, nextID);
        diff = nextID.clock - item.id.clock;
        nextID = item.redone;
      } while (nextID !== null && item instanceof Item);
      return {
        item,
        diff
      };
    };
    var keepItem = (item, keep) => {
      while (item !== null && item.keep !== keep) {
        item.keep = keep;
        item = /** @type {AbstractType<any>} */
        item.parent._item;
      }
    };
    var splitItem = (transaction, leftItem, diff) => {
      const { client, clock } = leftItem.id;
      const rightItem = new Item(
        createID(client, clock + diff),
        leftItem,
        createID(client, clock + diff - 1),
        leftItem.right,
        leftItem.rightOrigin,
        leftItem.parent,
        leftItem.parentSub,
        leftItem.content.splice(diff)
      );
      if (leftItem.deleted) {
        rightItem.markDeleted();
      }
      if (leftItem.keep) {
        rightItem.keep = true;
      }
      if (leftItem.redone !== null) {
        rightItem.redone = createID(leftItem.redone.client, leftItem.redone.clock + diff);
      }
      leftItem.right = rightItem;
      if (rightItem.right !== null) {
        rightItem.right.left = rightItem;
      }
      transaction._mergeStructs.push(rightItem);
      if (rightItem.parentSub !== null && rightItem.right === null) {
        rightItem.parent._map.set(rightItem.parentSub, rightItem);
      }
      leftItem.length = diff;
      return rightItem;
    };
    var isDeletedByUndoStack = (stack, id) => array__namespace.some(
      stack,
      /** @param {StackItem} s */
      (s) => isDeleted(s.deletions, id)
    );
    var redoItem = (transaction, item, redoitems, itemsToDelete, ignoreRemoteMapChanges, um) => {
      const doc2 = transaction.doc;
      const store = doc2.store;
      const ownClientID = doc2.clientID;
      const redone = item.redone;
      if (redone !== null) {
        return getItemCleanStart(transaction, redone);
      }
      let parentItem = (
        /** @type {AbstractType<any>} */
        item.parent._item
      );
      let left = null;
      let right;
      if (parentItem !== null && parentItem.deleted === true) {
        if (parentItem.redone === null && (!redoitems.has(parentItem) || redoItem(transaction, parentItem, redoitems, itemsToDelete, ignoreRemoteMapChanges, um) === null)) {
          return null;
        }
        while (parentItem.redone !== null) {
          parentItem = getItemCleanStart(transaction, parentItem.redone);
        }
      }
      const parentType = parentItem === null ? (
        /** @type {AbstractType<any>} */
        item.parent
      ) : (
        /** @type {ContentType} */
        parentItem.content.type
      );
      if (item.parentSub === null) {
        left = item.left;
        right = item;
        while (left !== null) {
          let leftTrace = left;
          while (leftTrace !== null && /** @type {AbstractType<any>} */
          leftTrace.parent._item !== parentItem) {
            leftTrace = leftTrace.redone === null ? null : getItemCleanStart(transaction, leftTrace.redone);
          }
          if (leftTrace !== null && /** @type {AbstractType<any>} */
          leftTrace.parent._item === parentItem) {
            left = leftTrace;
            break;
          }
          left = left.left;
        }
        while (right !== null) {
          let rightTrace = right;
          while (rightTrace !== null && /** @type {AbstractType<any>} */
          rightTrace.parent._item !== parentItem) {
            rightTrace = rightTrace.redone === null ? null : getItemCleanStart(transaction, rightTrace.redone);
          }
          if (rightTrace !== null && /** @type {AbstractType<any>} */
          rightTrace.parent._item === parentItem) {
            right = rightTrace;
            break;
          }
          right = right.right;
        }
      } else {
        right = null;
        if (item.right && !ignoreRemoteMapChanges) {
          left = item;
          while (left !== null && left.right !== null && (left.right.redone || isDeleted(itemsToDelete, left.right.id) || isDeletedByUndoStack(um.undoStack, left.right.id) || isDeletedByUndoStack(um.redoStack, left.right.id))) {
            left = left.right;
            while (left.redone) left = getItemCleanStart(transaction, left.redone);
          }
          if (left && left.right !== null) {
            return null;
          }
        } else {
          left = parentType._map.get(item.parentSub) || null;
        }
      }
      const nextClock = getState(store, ownClientID);
      const nextId = createID(ownClientID, nextClock);
      const redoneItem = new Item(
        nextId,
        left,
        left && left.lastId,
        right,
        right && right.id,
        parentType,
        item.parentSub,
        item.content.copy()
      );
      item.redone = nextId;
      keepItem(redoneItem, true);
      redoneItem.integrate(transaction, 0);
      return redoneItem;
    };
    var Item = class _Item extends AbstractStruct {
      /**
       * @param {ID} id
       * @param {Item | null} left
       * @param {ID | null} origin
       * @param {Item | null} right
       * @param {ID | null} rightOrigin
       * @param {AbstractType<any>|ID|null} parent Is a type if integrated, is null if it is possible to copy parent from left or right, is ID before integration to search for it.
       * @param {string | null} parentSub
       * @param {AbstractContent} content
       */
      constructor(id, left, origin, right, rightOrigin, parent, parentSub, content) {
        super(id, content.getLength());
        this.origin = origin;
        this.left = left;
        this.right = right;
        this.rightOrigin = rightOrigin;
        this.parent = parent;
        this.parentSub = parentSub;
        this.redone = null;
        this.content = content;
        this.info = this.content.isCountable() ? binary__namespace.BIT2 : 0;
      }
      /**
       * This is used to mark the item as an indexed fast-search marker
       *
       * @type {boolean}
       */
      set marker(isMarked) {
        if ((this.info & binary__namespace.BIT4) > 0 !== isMarked) {
          this.info ^= binary__namespace.BIT4;
        }
      }
      get marker() {
        return (this.info & binary__namespace.BIT4) > 0;
      }
      /**
       * If true, do not garbage collect this Item.
       */
      get keep() {
        return (this.info & binary__namespace.BIT1) > 0;
      }
      set keep(doKeep) {
        if (this.keep !== doKeep) {
          this.info ^= binary__namespace.BIT1;
        }
      }
      get countable() {
        return (this.info & binary__namespace.BIT2) > 0;
      }
      /**
       * Whether this item was deleted or not.
       * @type {Boolean}
       */
      get deleted() {
        return (this.info & binary__namespace.BIT3) > 0;
      }
      set deleted(doDelete) {
        if (this.deleted !== doDelete) {
          this.info ^= binary__namespace.BIT3;
        }
      }
      markDeleted() {
        this.info |= binary__namespace.BIT3;
      }
      /**
       * Return the creator clientID of the missing op or define missing items and return null.
       *
       * @param {Transaction} transaction
       * @param {StructStore} store
       * @return {null | number}
       */
      getMissing(transaction, store) {
        if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= getState(store, this.origin.client)) {
          return this.origin.client;
        }
        if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= getState(store, this.rightOrigin.client)) {
          return this.rightOrigin.client;
        }
        if (this.parent && this.parent.constructor === ID && this.id.client !== this.parent.client && this.parent.clock >= getState(store, this.parent.client)) {
          return this.parent.client;
        }
        if (this.origin) {
          this.left = getItemCleanEnd(transaction, store, this.origin);
          this.origin = this.left.lastId;
        }
        if (this.rightOrigin) {
          this.right = getItemCleanStart(transaction, this.rightOrigin);
          this.rightOrigin = this.right.id;
        }
        if (this.left && this.left.constructor === GC || this.right && this.right.constructor === GC) {
          this.parent = null;
        } else if (!this.parent) {
          if (this.left && this.left.constructor === _Item) {
            this.parent = this.left.parent;
            this.parentSub = this.left.parentSub;
          } else if (this.right && this.right.constructor === _Item) {
            this.parent = this.right.parent;
            this.parentSub = this.right.parentSub;
          }
        } else if (this.parent.constructor === ID) {
          const parentItem = getItem(store, this.parent);
          if (parentItem.constructor === GC) {
            this.parent = null;
          } else {
            this.parent = /** @type {ContentType} */
            parentItem.content.type;
          }
        }
        return null;
      }
      /**
       * @param {Transaction} transaction
       * @param {number} offset
       */
      integrate(transaction, offset) {
        if (offset > 0) {
          this.id.clock += offset;
          this.left = getItemCleanEnd(transaction, transaction.doc.store, createID(this.id.client, this.id.clock - 1));
          this.origin = this.left.lastId;
          this.content = this.content.splice(offset);
          this.length -= offset;
        }
        if (this.parent) {
          if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
            let left = this.left;
            let o;
            if (left !== null) {
              o = left.right;
            } else if (this.parentSub !== null) {
              o = /** @type {AbstractType<any>} */
              this.parent._map.get(this.parentSub) || null;
              while (o !== null && o.left !== null) {
                o = o.left;
              }
            } else {
              o = /** @type {AbstractType<any>} */
              this.parent._start;
            }
            const conflictingItems = /* @__PURE__ */ new Set();
            const itemsBeforeOrigin = /* @__PURE__ */ new Set();
            while (o !== null && o !== this.right) {
              itemsBeforeOrigin.add(o);
              conflictingItems.add(o);
              if (compareIDs(this.origin, o.origin)) {
                if (o.id.client < this.id.client) {
                  left = o;
                  conflictingItems.clear();
                } else if (compareIDs(this.rightOrigin, o.rightOrigin)) {
                  break;
                }
              } else if (o.origin !== null && itemsBeforeOrigin.has(getItem(transaction.doc.store, o.origin))) {
                if (!conflictingItems.has(getItem(transaction.doc.store, o.origin))) {
                  left = o;
                  conflictingItems.clear();
                }
              } else {
                break;
              }
              o = o.right;
            }
            this.left = left;
          }
          if (this.left !== null) {
            const right = this.left.right;
            this.right = right;
            this.left.right = this;
          } else {
            let r;
            if (this.parentSub !== null) {
              r = /** @type {AbstractType<any>} */
              this.parent._map.get(this.parentSub) || null;
              while (r !== null && r.left !== null) {
                r = r.left;
              }
            } else {
              r = /** @type {AbstractType<any>} */
              this.parent._start;
              this.parent._start = this;
            }
            this.right = r;
          }
          if (this.right !== null) {
            this.right.left = this;
          } else if (this.parentSub !== null) {
            this.parent._map.set(this.parentSub, this);
            if (this.left !== null) {
              this.left.delete(transaction);
            }
          }
          if (this.parentSub === null && this.countable && !this.deleted) {
            this.parent._length += this.length;
          }
          addStruct(transaction.doc.store, this);
          this.content.integrate(transaction, this);
          addChangedTypeToTransaction(
            transaction,
            /** @type {AbstractType<any>} */
            this.parent,
            this.parentSub
          );
          if (
            /** @type {AbstractType<any>} */
            this.parent._item !== null && /** @type {AbstractType<any>} */
            this.parent._item.deleted || this.parentSub !== null && this.right !== null
          ) {
            this.delete(transaction);
          }
        } else {
          new GC(this.id, this.length).integrate(transaction, 0);
        }
      }
      /**
       * Returns the next non-deleted item
       */
      get next() {
        let n = this.right;
        while (n !== null && n.deleted) {
          n = n.right;
        }
        return n;
      }
      /**
       * Returns the previous non-deleted item
       */
      get prev() {
        let n = this.left;
        while (n !== null && n.deleted) {
          n = n.left;
        }
        return n;
      }
      /**
       * Computes the last content address of this Item.
       */
      get lastId() {
        return this.length === 1 ? this.id : createID(this.id.client, this.id.clock + this.length - 1);
      }
      /**
       * Try to merge two items
       *
       * @param {Item} right
       * @return {boolean}
       */
      mergeWith(right) {
        if (this.constructor === right.constructor && compareIDs(right.origin, this.lastId) && this.right === right && compareIDs(this.rightOrigin, right.rightOrigin) && this.id.client === right.id.client && this.id.clock + this.length === right.id.clock && this.deleted === right.deleted && this.redone === null && right.redone === null && this.content.constructor === right.content.constructor && this.content.mergeWith(right.content)) {
          const searchMarker = (
            /** @type {AbstractType<any>} */
            this.parent._searchMarker
          );
          if (searchMarker) {
            searchMarker.forEach((marker) => {
              if (marker.p === right) {
                marker.p = this;
                if (!this.deleted && this.countable) {
                  marker.index -= this.length;
                }
              }
            });
          }
          if (right.keep) {
            this.keep = true;
          }
          this.right = right.right;
          if (this.right !== null) {
            this.right.left = this;
          }
          this.length += right.length;
          return true;
        }
        return false;
      }
      /**
       * Mark this Item as deleted.
       *
       * @param {Transaction} transaction
       */
      delete(transaction) {
        if (!this.deleted) {
          const parent = (
            /** @type {AbstractType<any>} */
            this.parent
          );
          if (this.countable && this.parentSub === null) {
            parent._length -= this.length;
          }
          this.markDeleted();
          addToDeleteSet(transaction.deleteSet, this.id.client, this.id.clock, this.length);
          addChangedTypeToTransaction(transaction, parent, this.parentSub);
          this.content.delete(transaction);
        }
      }
      /**
       * @param {StructStore} store
       * @param {boolean} parentGCd
       */
      gc(store, parentGCd) {
        if (!this.deleted) {
          throw error__namespace.unexpectedCase();
        }
        this.content.gc(store);
        if (parentGCd) {
          replaceStruct(store, this, new GC(this.id, this.length));
        } else {
          this.content = new ContentDeleted(this.length);
        }
      }
      /**
       * Transform the properties of this type to binary and write it to an
       * BinaryEncoder.
       *
       * This is called when this Item is sent to a remote peer.
       *
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
       * @param {number} offset
       */
      write(encoder, offset) {
        const origin = offset > 0 ? createID(this.id.client, this.id.clock + offset - 1) : this.origin;
        const rightOrigin = this.rightOrigin;
        const parentSub = this.parentSub;
        const info = this.content.getRef() & binary__namespace.BITS5 | (origin === null ? 0 : binary__namespace.BIT8) | // origin is defined
        (rightOrigin === null ? 0 : binary__namespace.BIT7) | // right origin is defined
        (parentSub === null ? 0 : binary__namespace.BIT6);
        encoder.writeInfo(info);
        if (origin !== null) {
          encoder.writeLeftID(origin);
        }
        if (rightOrigin !== null) {
          encoder.writeRightID(rightOrigin);
        }
        if (origin === null && rightOrigin === null) {
          const parent = (
            /** @type {AbstractType<any>} */
            this.parent
          );
          if (parent._item !== void 0) {
            const parentItem = parent._item;
            if (parentItem === null) {
              const ykey = findRootTypeKey(parent);
              encoder.writeParentInfo(true);
              encoder.writeString(ykey);
            } else {
              encoder.writeParentInfo(false);
              encoder.writeLeftID(parentItem.id);
            }
          } else if (parent.constructor === String) {
            encoder.writeParentInfo(true);
            encoder.writeString(parent);
          } else if (parent.constructor === ID) {
            encoder.writeParentInfo(false);
            encoder.writeLeftID(parent);
          } else {
            error__namespace.unexpectedCase();
          }
          if (parentSub !== null) {
            encoder.writeString(parentSub);
          }
        }
        this.content.write(encoder, offset);
      }
    };
    var readItemContent = (decoder, info) => contentRefs[info & binary__namespace.BITS5](decoder);
    var contentRefs = [
      () => {
        error__namespace.unexpectedCase();
      },
      // GC is not ItemContent
      readContentDeleted,
      // 1
      readContentJSON,
      // 2
      readContentBinary,
      // 3
      readContentString,
      // 4
      readContentEmbed,
      // 5
      readContentFormat,
      // 6
      readContentType,
      // 7
      readContentAny,
      // 8
      readContentDoc,
      // 9
      () => {
        error__namespace.unexpectedCase();
      }
      // 10 - Skip is not ItemContent
    ];
    var structSkipRefNumber = 10;
    var Skip = class extends AbstractStruct {
      get deleted() {
        return true;
      }
      delete() {
      }
      /**
       * @param {Skip} right
       * @return {boolean}
       */
      mergeWith(right) {
        if (this.constructor !== right.constructor) {
          return false;
        }
        this.length += right.length;
        return true;
      }
      /**
       * @param {Transaction} transaction
       * @param {number} offset
       */
      integrate(transaction, offset) {
        error__namespace.unexpectedCase();
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        encoder.writeInfo(structSkipRefNumber);
        encoding__namespace.writeVarUint(encoder.restEncoder, this.length - offset);
      }
      /**
       * @param {Transaction} transaction
       * @param {StructStore} store
       * @return {null | number}
       */
      getMissing(transaction, store) {
        return null;
      }
    };
    var glo = (
      /** @type {any} */
      typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}
    );
    var importIdentifier = "__ $YJS$ __";
    if (glo[importIdentifier] === true) {
      console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438");
    }
    glo[importIdentifier] = true;
    exports.AbsolutePosition = AbsolutePosition;
    exports.AbstractConnector = AbstractConnector;
    exports.AbstractStruct = AbstractStruct;
    exports.AbstractType = AbstractType;
    exports.Array = YArray;
    exports.ContentAny = ContentAny;
    exports.ContentBinary = ContentBinary;
    exports.ContentDeleted = ContentDeleted;
    exports.ContentDoc = ContentDoc;
    exports.ContentEmbed = ContentEmbed;
    exports.ContentFormat = ContentFormat;
    exports.ContentJSON = ContentJSON;
    exports.ContentString = ContentString;
    exports.ContentType = ContentType;
    exports.Doc = Doc2;
    exports.GC = GC;
    exports.ID = ID;
    exports.Item = Item;
    exports.Map = YMap;
    exports.PermanentUserData = PermanentUserData;
    exports.RelativePosition = RelativePosition;
    exports.Skip = Skip;
    exports.Snapshot = Snapshot;
    exports.Text = YText;
    exports.Transaction = Transaction2;
    exports.UndoManager = UndoManager3;
    exports.UpdateDecoderV1 = UpdateDecoderV1;
    exports.UpdateDecoderV2 = UpdateDecoderV2;
    exports.UpdateEncoderV1 = UpdateEncoderV1;
    exports.UpdateEncoderV2 = UpdateEncoderV2;
    exports.XmlElement = YXmlElement;
    exports.XmlFragment = YXmlFragment;
    exports.XmlHook = YXmlHook;
    exports.XmlText = YXmlText;
    exports.YArrayEvent = YArrayEvent;
    exports.YEvent = YEvent;
    exports.YMapEvent = YMapEvent;
    exports.YTextEvent = YTextEvent;
    exports.YXmlEvent = YXmlEvent;
    exports.applyUpdate = applyUpdate2;
    exports.applyUpdateV2 = applyUpdateV2;
    exports.cleanupYTextFormatting = cleanupYTextFormatting;
    exports.compareIDs = compareIDs;
    exports.compareRelativePositions = compareRelativePositions2;
    exports.convertUpdateFormatV1ToV2 = convertUpdateFormatV1ToV2;
    exports.convertUpdateFormatV2ToV1 = convertUpdateFormatV2ToV1;
    exports.createAbsolutePositionFromRelativePosition = createAbsolutePositionFromRelativePosition3;
    exports.createDeleteSet = createDeleteSet;
    exports.createDeleteSetFromStructStore = createDeleteSetFromStructStore;
    exports.createDocFromSnapshot = createDocFromSnapshot;
    exports.createID = createID;
    exports.createRelativePositionFromJSON = createRelativePositionFromJSON4;
    exports.createRelativePositionFromTypeIndex = createRelativePositionFromTypeIndex3;
    exports.createSnapshot = createSnapshot;
    exports.decodeRelativePosition = decodeRelativePosition;
    exports.decodeSnapshot = decodeSnapshot;
    exports.decodeSnapshotV2 = decodeSnapshotV2;
    exports.decodeStateVector = decodeStateVector;
    exports.decodeUpdate = decodeUpdate;
    exports.decodeUpdateV2 = decodeUpdateV2;
    exports.diffUpdate = diffUpdate;
    exports.diffUpdateV2 = diffUpdateV2;
    exports.emptySnapshot = emptySnapshot;
    exports.encodeRelativePosition = encodeRelativePosition;
    exports.encodeSnapshot = encodeSnapshot;
    exports.encodeSnapshotV2 = encodeSnapshotV2;
    exports.encodeStateAsUpdate = encodeStateAsUpdate2;
    exports.encodeStateAsUpdateV2 = encodeStateAsUpdateV2;
    exports.encodeStateVector = encodeStateVector2;
    exports.encodeStateVectorFromUpdate = encodeStateVectorFromUpdate;
    exports.encodeStateVectorFromUpdateV2 = encodeStateVectorFromUpdateV2;
    exports.equalDeleteSets = equalDeleteSets;
    exports.equalSnapshots = equalSnapshots;
    exports.findIndexSS = findIndexSS;
    exports.findRootTypeKey = findRootTypeKey;
    exports.getItem = getItem;
    exports.getItemCleanEnd = getItemCleanEnd;
    exports.getItemCleanStart = getItemCleanStart;
    exports.getState = getState;
    exports.getTypeChildren = getTypeChildren;
    exports.isDeleted = isDeleted;
    exports.isParentOf = isParentOf;
    exports.iterateDeletedStructs = iterateDeletedStructs;
    exports.logType = logType;
    exports.logUpdate = logUpdate;
    exports.logUpdateV2 = logUpdateV2;
    exports.mergeDeleteSets = mergeDeleteSets;
    exports.mergeUpdates = mergeUpdates;
    exports.mergeUpdatesV2 = mergeUpdatesV2;
    exports.obfuscateUpdate = obfuscateUpdate;
    exports.obfuscateUpdateV2 = obfuscateUpdateV2;
    exports.parseUpdateMeta = parseUpdateMeta;
    exports.parseUpdateMetaV2 = parseUpdateMetaV2;
    exports.readUpdate = readUpdate2;
    exports.readUpdateV2 = readUpdateV2;
    exports.relativePositionToJSON = relativePositionToJSON2;
    exports.snapshot = snapshot;
    exports.snapshotContainsUpdate = snapshotContainsUpdate;
    exports.transact = transact;
    exports.tryGc = tryGc;
    exports.typeListToArraySnapshot = typeListToArraySnapshot;
    exports.typeMapGetAllSnapshot = typeMapGetAllSnapshot;
    exports.typeMapGetSnapshot = typeMapGetSnapshot;
  }
});

// ../node_modules/diff-match-patch/index.js
var require_diff_match_patch = __commonJS({
  "../node_modules/diff-match-patch/index.js"(exports, module2) {
    var diff_match_patch = function() {
      this.Diff_Timeout = 1;
      this.Diff_EditCost = 4;
      this.Match_Threshold = 0.5;
      this.Match_Distance = 1e3;
      this.Patch_DeleteThreshold = 0.5;
      this.Patch_Margin = 4;
      this.Match_MaxBits = 32;
    };
    var DIFF_DELETE = -1;
    var DIFF_INSERT = 1;
    var DIFF_EQUAL = 0;
    diff_match_patch.Diff = function(op, text2) {
      return [op, text2];
    };
    diff_match_patch.prototype.diff_main = function(text1, text2, opt_checklines, opt_deadline) {
      if (typeof opt_deadline == "undefined") {
        if (this.Diff_Timeout <= 0) {
          opt_deadline = Number.MAX_VALUE;
        } else {
          opt_deadline = (/* @__PURE__ */ new Date()).getTime() + this.Diff_Timeout * 1e3;
        }
      }
      var deadline = opt_deadline;
      if (text1 == null || text2 == null) {
        throw new Error("Null input. (diff_main)");
      }
      if (text1 == text2) {
        if (text1) {
          return [new diff_match_patch.Diff(DIFF_EQUAL, text1)];
        }
        return [];
      }
      if (typeof opt_checklines == "undefined") {
        opt_checklines = true;
      }
      var checklines = opt_checklines;
      var commonlength = this.diff_commonPrefix(text1, text2);
      var commonprefix = text1.substring(0, commonlength);
      text1 = text1.substring(commonlength);
      text2 = text2.substring(commonlength);
      commonlength = this.diff_commonSuffix(text1, text2);
      var commonsuffix = text1.substring(text1.length - commonlength);
      text1 = text1.substring(0, text1.length - commonlength);
      text2 = text2.substring(0, text2.length - commonlength);
      var diffs = this.diff_compute_(text1, text2, checklines, deadline);
      if (commonprefix) {
        diffs.unshift(new diff_match_patch.Diff(DIFF_EQUAL, commonprefix));
      }
      if (commonsuffix) {
        diffs.push(new diff_match_patch.Diff(DIFF_EQUAL, commonsuffix));
      }
      this.diff_cleanupMerge(diffs);
      return diffs;
    };
    diff_match_patch.prototype.diff_compute_ = function(text1, text2, checklines, deadline) {
      var diffs;
      if (!text1) {
        return [new diff_match_patch.Diff(DIFF_INSERT, text2)];
      }
      if (!text2) {
        return [new diff_match_patch.Diff(DIFF_DELETE, text1)];
      }
      var longtext = text1.length > text2.length ? text1 : text2;
      var shorttext = text1.length > text2.length ? text2 : text1;
      var i = longtext.indexOf(shorttext);
      if (i != -1) {
        diffs = [
          new diff_match_patch.Diff(DIFF_INSERT, longtext.substring(0, i)),
          new diff_match_patch.Diff(DIFF_EQUAL, shorttext),
          new diff_match_patch.Diff(
            DIFF_INSERT,
            longtext.substring(i + shorttext.length)
          )
        ];
        if (text1.length > text2.length) {
          diffs[0][0] = diffs[2][0] = DIFF_DELETE;
        }
        return diffs;
      }
      if (shorttext.length == 1) {
        return [
          new diff_match_patch.Diff(DIFF_DELETE, text1),
          new diff_match_patch.Diff(DIFF_INSERT, text2)
        ];
      }
      var hm = this.diff_halfMatch_(text1, text2);
      if (hm) {
        var text1_a = hm[0];
        var text1_b = hm[1];
        var text2_a = hm[2];
        var text2_b = hm[3];
        var mid_common = hm[4];
        var diffs_a = this.diff_main(text1_a, text2_a, checklines, deadline);
        var diffs_b = this.diff_main(text1_b, text2_b, checklines, deadline);
        return diffs_a.concat(
          [new diff_match_patch.Diff(DIFF_EQUAL, mid_common)],
          diffs_b
        );
      }
      if (checklines && text1.length > 100 && text2.length > 100) {
        return this.diff_lineMode_(text1, text2, deadline);
      }
      return this.diff_bisect_(text1, text2, deadline);
    };
    diff_match_patch.prototype.diff_lineMode_ = function(text1, text2, deadline) {
      var a = this.diff_linesToChars_(text1, text2);
      text1 = a.chars1;
      text2 = a.chars2;
      var linearray = a.lineArray;
      var diffs = this.diff_main(text1, text2, false, deadline);
      this.diff_charsToLines_(diffs, linearray);
      this.diff_cleanupSemantic(diffs);
      diffs.push(new diff_match_patch.Diff(DIFF_EQUAL, ""));
      var pointer = 0;
      var count_delete = 0;
      var count_insert = 0;
      var text_delete = "";
      var text_insert = "";
      while (pointer < diffs.length) {
        switch (diffs[pointer][0]) {
          case DIFF_INSERT:
            count_insert++;
            text_insert += diffs[pointer][1];
            break;
          case DIFF_DELETE:
            count_delete++;
            text_delete += diffs[pointer][1];
            break;
          case DIFF_EQUAL:
            if (count_delete >= 1 && count_insert >= 1) {
              diffs.splice(
                pointer - count_delete - count_insert,
                count_delete + count_insert
              );
              pointer = pointer - count_delete - count_insert;
              var subDiff = this.diff_main(text_delete, text_insert, false, deadline);
              for (var j = subDiff.length - 1; j >= 0; j--) {
                diffs.splice(pointer, 0, subDiff[j]);
              }
              pointer = pointer + subDiff.length;
            }
            count_insert = 0;
            count_delete = 0;
            text_delete = "";
            text_insert = "";
            break;
        }
        pointer++;
      }
      diffs.pop();
      return diffs;
    };
    diff_match_patch.prototype.diff_bisect_ = function(text1, text2, deadline) {
      var text1_length = text1.length;
      var text2_length = text2.length;
      var max_d = Math.ceil((text1_length + text2_length) / 2);
      var v_offset = max_d;
      var v_length = 2 * max_d;
      var v1 = new Array(v_length);
      var v2 = new Array(v_length);
      for (var x = 0; x < v_length; x++) {
        v1[x] = -1;
        v2[x] = -1;
      }
      v1[v_offset + 1] = 0;
      v2[v_offset + 1] = 0;
      var delta = text1_length - text2_length;
      var front = delta % 2 != 0;
      var k1start = 0;
      var k1end = 0;
      var k2start = 0;
      var k2end = 0;
      for (var d = 0; d < max_d; d++) {
        if ((/* @__PURE__ */ new Date()).getTime() > deadline) {
          break;
        }
        for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
          var k1_offset = v_offset + k1;
          var x1;
          if (k1 == -d || k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1]) {
            x1 = v1[k1_offset + 1];
          } else {
            x1 = v1[k1_offset - 1] + 1;
          }
          var y1 = x1 - k1;
          while (x1 < text1_length && y1 < text2_length && text1.charAt(x1) == text2.charAt(y1)) {
            x1++;
            y1++;
          }
          v1[k1_offset] = x1;
          if (x1 > text1_length) {
            k1end += 2;
          } else if (y1 > text2_length) {
            k1start += 2;
          } else if (front) {
            var k2_offset = v_offset + delta - k1;
            if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
              var x2 = text1_length - v2[k2_offset];
              if (x1 >= x2) {
                return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
              }
            }
          }
        }
        for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
          var k2_offset = v_offset + k2;
          var x2;
          if (k2 == -d || k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1]) {
            x2 = v2[k2_offset + 1];
          } else {
            x2 = v2[k2_offset - 1] + 1;
          }
          var y2 = x2 - k2;
          while (x2 < text1_length && y2 < text2_length && text1.charAt(text1_length - x2 - 1) == text2.charAt(text2_length - y2 - 1)) {
            x2++;
            y2++;
          }
          v2[k2_offset] = x2;
          if (x2 > text1_length) {
            k2end += 2;
          } else if (y2 > text2_length) {
            k2start += 2;
          } else if (!front) {
            var k1_offset = v_offset + delta - k2;
            if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
              var x1 = v1[k1_offset];
              var y1 = v_offset + x1 - k1_offset;
              x2 = text1_length - x2;
              if (x1 >= x2) {
                return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
              }
            }
          }
        }
      }
      return [
        new diff_match_patch.Diff(DIFF_DELETE, text1),
        new diff_match_patch.Diff(DIFF_INSERT, text2)
      ];
    };
    diff_match_patch.prototype.diff_bisectSplit_ = function(text1, text2, x, y, deadline) {
      var text1a = text1.substring(0, x);
      var text2a = text2.substring(0, y);
      var text1b = text1.substring(x);
      var text2b = text2.substring(y);
      var diffs = this.diff_main(text1a, text2a, false, deadline);
      var diffsb = this.diff_main(text1b, text2b, false, deadline);
      return diffs.concat(diffsb);
    };
    diff_match_patch.prototype.diff_linesToChars_ = function(text1, text2) {
      var lineArray = [];
      var lineHash = {};
      lineArray[0] = "";
      function diff_linesToCharsMunge_(text3) {
        var chars = "";
        var lineStart = 0;
        var lineEnd = -1;
        var lineArrayLength = lineArray.length;
        while (lineEnd < text3.length - 1) {
          lineEnd = text3.indexOf("\n", lineStart);
          if (lineEnd == -1) {
            lineEnd = text3.length - 1;
          }
          var line = text3.substring(lineStart, lineEnd + 1);
          if (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) : lineHash[line] !== void 0) {
            chars += String.fromCharCode(lineHash[line]);
          } else {
            if (lineArrayLength == maxLines) {
              line = text3.substring(lineStart);
              lineEnd = text3.length;
            }
            chars += String.fromCharCode(lineArrayLength);
            lineHash[line] = lineArrayLength;
            lineArray[lineArrayLength++] = line;
          }
          lineStart = lineEnd + 1;
        }
        return chars;
      }
      var maxLines = 4e4;
      var chars1 = diff_linesToCharsMunge_(text1);
      maxLines = 65535;
      var chars2 = diff_linesToCharsMunge_(text2);
      return { chars1, chars2, lineArray };
    };
    diff_match_patch.prototype.diff_charsToLines_ = function(diffs, lineArray) {
      for (var i = 0; i < diffs.length; i++) {
        var chars = diffs[i][1];
        var text2 = [];
        for (var j = 0; j < chars.length; j++) {
          text2[j] = lineArray[chars.charCodeAt(j)];
        }
        diffs[i][1] = text2.join("");
      }
    };
    diff_match_patch.prototype.diff_commonPrefix = function(text1, text2) {
      if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
        return 0;
      }
      var pointermin = 0;
      var pointermax = Math.min(text1.length, text2.length);
      var pointermid = pointermax;
      var pointerstart = 0;
      while (pointermin < pointermid) {
        if (text1.substring(pointerstart, pointermid) == text2.substring(pointerstart, pointermid)) {
          pointermin = pointermid;
          pointerstart = pointermin;
        } else {
          pointermax = pointermid;
        }
        pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
      }
      return pointermid;
    };
    diff_match_patch.prototype.diff_commonSuffix = function(text1, text2) {
      if (!text1 || !text2 || text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
        return 0;
      }
      var pointermin = 0;
      var pointermax = Math.min(text1.length, text2.length);
      var pointermid = pointermax;
      var pointerend = 0;
      while (pointermin < pointermid) {
        if (text1.substring(text1.length - pointermid, text1.length - pointerend) == text2.substring(text2.length - pointermid, text2.length - pointerend)) {
          pointermin = pointermid;
          pointerend = pointermin;
        } else {
          pointermax = pointermid;
        }
        pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
      }
      return pointermid;
    };
    diff_match_patch.prototype.diff_commonOverlap_ = function(text1, text2) {
      var text1_length = text1.length;
      var text2_length = text2.length;
      if (text1_length == 0 || text2_length == 0) {
        return 0;
      }
      if (text1_length > text2_length) {
        text1 = text1.substring(text1_length - text2_length);
      } else if (text1_length < text2_length) {
        text2 = text2.substring(0, text1_length);
      }
      var text_length = Math.min(text1_length, text2_length);
      if (text1 == text2) {
        return text_length;
      }
      var best = 0;
      var length2 = 1;
      while (true) {
        var pattern = text1.substring(text_length - length2);
        var found = text2.indexOf(pattern);
        if (found == -1) {
          return best;
        }
        length2 += found;
        if (found == 0 || text1.substring(text_length - length2) == text2.substring(0, length2)) {
          best = length2;
          length2++;
        }
      }
    };
    diff_match_patch.prototype.diff_halfMatch_ = function(text1, text2) {
      if (this.Diff_Timeout <= 0) {
        return null;
      }
      var longtext = text1.length > text2.length ? text1 : text2;
      var shorttext = text1.length > text2.length ? text2 : text1;
      if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
        return null;
      }
      var dmp = this;
      function diff_halfMatchI_(longtext2, shorttext2, i) {
        var seed = longtext2.substring(i, i + Math.floor(longtext2.length / 4));
        var j = -1;
        var best_common = "";
        var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
        while ((j = shorttext2.indexOf(seed, j + 1)) != -1) {
          var prefixLength = dmp.diff_commonPrefix(
            longtext2.substring(i),
            shorttext2.substring(j)
          );
          var suffixLength = dmp.diff_commonSuffix(
            longtext2.substring(0, i),
            shorttext2.substring(0, j)
          );
          if (best_common.length < suffixLength + prefixLength) {
            best_common = shorttext2.substring(j - suffixLength, j) + shorttext2.substring(j, j + prefixLength);
            best_longtext_a = longtext2.substring(0, i - suffixLength);
            best_longtext_b = longtext2.substring(i + prefixLength);
            best_shorttext_a = shorttext2.substring(0, j - suffixLength);
            best_shorttext_b = shorttext2.substring(j + prefixLength);
          }
        }
        if (best_common.length * 2 >= longtext2.length) {
          return [
            best_longtext_a,
            best_longtext_b,
            best_shorttext_a,
            best_shorttext_b,
            best_common
          ];
        } else {
          return null;
        }
      }
      var hm1 = diff_halfMatchI_(
        longtext,
        shorttext,
        Math.ceil(longtext.length / 4)
      );
      var hm2 = diff_halfMatchI_(
        longtext,
        shorttext,
        Math.ceil(longtext.length / 2)
      );
      var hm;
      if (!hm1 && !hm2) {
        return null;
      } else if (!hm2) {
        hm = hm1;
      } else if (!hm1) {
        hm = hm2;
      } else {
        hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
      }
      var text1_a, text1_b, text2_a, text2_b;
      if (text1.length > text2.length) {
        text1_a = hm[0];
        text1_b = hm[1];
        text2_a = hm[2];
        text2_b = hm[3];
      } else {
        text2_a = hm[0];
        text2_b = hm[1];
        text1_a = hm[2];
        text1_b = hm[3];
      }
      var mid_common = hm[4];
      return [text1_a, text1_b, text2_a, text2_b, mid_common];
    };
    diff_match_patch.prototype.diff_cleanupSemantic = function(diffs) {
      var changes = false;
      var equalities = [];
      var equalitiesLength = 0;
      var lastEquality = null;
      var pointer = 0;
      var length_insertions1 = 0;
      var length_deletions1 = 0;
      var length_insertions2 = 0;
      var length_deletions2 = 0;
      while (pointer < diffs.length) {
        if (diffs[pointer][0] == DIFF_EQUAL) {
          equalities[equalitiesLength++] = pointer;
          length_insertions1 = length_insertions2;
          length_deletions1 = length_deletions2;
          length_insertions2 = 0;
          length_deletions2 = 0;
          lastEquality = diffs[pointer][1];
        } else {
          if (diffs[pointer][0] == DIFF_INSERT) {
            length_insertions2 += diffs[pointer][1].length;
          } else {
            length_deletions2 += diffs[pointer][1].length;
          }
          if (lastEquality && lastEquality.length <= Math.max(length_insertions1, length_deletions1) && lastEquality.length <= Math.max(
            length_insertions2,
            length_deletions2
          )) {
            diffs.splice(
              equalities[equalitiesLength - 1],
              0,
              new diff_match_patch.Diff(DIFF_DELETE, lastEquality)
            );
            diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
            equalitiesLength--;
            equalitiesLength--;
            pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
            length_insertions1 = 0;
            length_deletions1 = 0;
            length_insertions2 = 0;
            length_deletions2 = 0;
            lastEquality = null;
            changes = true;
          }
        }
        pointer++;
      }
      if (changes) {
        this.diff_cleanupMerge(diffs);
      }
      this.diff_cleanupSemanticLossless(diffs);
      pointer = 1;
      while (pointer < diffs.length) {
        if (diffs[pointer - 1][0] == DIFF_DELETE && diffs[pointer][0] == DIFF_INSERT) {
          var deletion = diffs[pointer - 1][1];
          var insertion = diffs[pointer][1];
          var overlap_length1 = this.diff_commonOverlap_(deletion, insertion);
          var overlap_length2 = this.diff_commonOverlap_(insertion, deletion);
          if (overlap_length1 >= overlap_length2) {
            if (overlap_length1 >= deletion.length / 2 || overlap_length1 >= insertion.length / 2) {
              diffs.splice(pointer, 0, new diff_match_patch.Diff(
                DIFF_EQUAL,
                insertion.substring(0, overlap_length1)
              ));
              diffs[pointer - 1][1] = deletion.substring(0, deletion.length - overlap_length1);
              diffs[pointer + 1][1] = insertion.substring(overlap_length1);
              pointer++;
            }
          } else {
            if (overlap_length2 >= deletion.length / 2 || overlap_length2 >= insertion.length / 2) {
              diffs.splice(pointer, 0, new diff_match_patch.Diff(
                DIFF_EQUAL,
                deletion.substring(0, overlap_length2)
              ));
              diffs[pointer - 1][0] = DIFF_INSERT;
              diffs[pointer - 1][1] = insertion.substring(0, insertion.length - overlap_length2);
              diffs[pointer + 1][0] = DIFF_DELETE;
              diffs[pointer + 1][1] = deletion.substring(overlap_length2);
              pointer++;
            }
          }
          pointer++;
        }
        pointer++;
      }
    };
    diff_match_patch.prototype.diff_cleanupSemanticLossless = function(diffs) {
      function diff_cleanupSemanticScore_(one, two) {
        if (!one || !two) {
          return 6;
        }
        var char1 = one.charAt(one.length - 1);
        var char2 = two.charAt(0);
        var nonAlphaNumeric1 = char1.match(diff_match_patch.nonAlphaNumericRegex_);
        var nonAlphaNumeric2 = char2.match(diff_match_patch.nonAlphaNumericRegex_);
        var whitespace1 = nonAlphaNumeric1 && char1.match(diff_match_patch.whitespaceRegex_);
        var whitespace2 = nonAlphaNumeric2 && char2.match(diff_match_patch.whitespaceRegex_);
        var lineBreak1 = whitespace1 && char1.match(diff_match_patch.linebreakRegex_);
        var lineBreak2 = whitespace2 && char2.match(diff_match_patch.linebreakRegex_);
        var blankLine1 = lineBreak1 && one.match(diff_match_patch.blanklineEndRegex_);
        var blankLine2 = lineBreak2 && two.match(diff_match_patch.blanklineStartRegex_);
        if (blankLine1 || blankLine2) {
          return 5;
        } else if (lineBreak1 || lineBreak2) {
          return 4;
        } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
          return 3;
        } else if (whitespace1 || whitespace2) {
          return 2;
        } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
          return 1;
        }
        return 0;
      }
      var pointer = 1;
      while (pointer < diffs.length - 1) {
        if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
          var equality1 = diffs[pointer - 1][1];
          var edit = diffs[pointer][1];
          var equality2 = diffs[pointer + 1][1];
          var commonOffset = this.diff_commonSuffix(equality1, edit);
          if (commonOffset) {
            var commonString = edit.substring(edit.length - commonOffset);
            equality1 = equality1.substring(0, equality1.length - commonOffset);
            edit = commonString + edit.substring(0, edit.length - commonOffset);
            equality2 = commonString + equality2;
          }
          var bestEquality1 = equality1;
          var bestEdit = edit;
          var bestEquality2 = equality2;
          var bestScore = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
          while (edit.charAt(0) === equality2.charAt(0)) {
            equality1 += edit.charAt(0);
            edit = edit.substring(1) + equality2.charAt(0);
            equality2 = equality2.substring(1);
            var score = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
            if (score >= bestScore) {
              bestScore = score;
              bestEquality1 = equality1;
              bestEdit = edit;
              bestEquality2 = equality2;
            }
          }
          if (diffs[pointer - 1][1] != bestEquality1) {
            if (bestEquality1) {
              diffs[pointer - 1][1] = bestEquality1;
            } else {
              diffs.splice(pointer - 1, 1);
              pointer--;
            }
            diffs[pointer][1] = bestEdit;
            if (bestEquality2) {
              diffs[pointer + 1][1] = bestEquality2;
            } else {
              diffs.splice(pointer + 1, 1);
              pointer--;
            }
          }
        }
        pointer++;
      }
    };
    diff_match_patch.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
    diff_match_patch.whitespaceRegex_ = /\s/;
    diff_match_patch.linebreakRegex_ = /[\r\n]/;
    diff_match_patch.blanklineEndRegex_ = /\n\r?\n$/;
    diff_match_patch.blanklineStartRegex_ = /^\r?\n\r?\n/;
    diff_match_patch.prototype.diff_cleanupEfficiency = function(diffs) {
      var changes = false;
      var equalities = [];
      var equalitiesLength = 0;
      var lastEquality = null;
      var pointer = 0;
      var pre_ins = false;
      var pre_del = false;
      var post_ins = false;
      var post_del = false;
      while (pointer < diffs.length) {
        if (diffs[pointer][0] == DIFF_EQUAL) {
          if (diffs[pointer][1].length < this.Diff_EditCost && (post_ins || post_del)) {
            equalities[equalitiesLength++] = pointer;
            pre_ins = post_ins;
            pre_del = post_del;
            lastEquality = diffs[pointer][1];
          } else {
            equalitiesLength = 0;
            lastEquality = null;
          }
          post_ins = post_del = false;
        } else {
          if (diffs[pointer][0] == DIFF_DELETE) {
            post_del = true;
          } else {
            post_ins = true;
          }
          if (lastEquality && (pre_ins && pre_del && post_ins && post_del || lastEquality.length < this.Diff_EditCost / 2 && pre_ins + pre_del + post_ins + post_del == 3)) {
            diffs.splice(
              equalities[equalitiesLength - 1],
              0,
              new diff_match_patch.Diff(DIFF_DELETE, lastEquality)
            );
            diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
            equalitiesLength--;
            lastEquality = null;
            if (pre_ins && pre_del) {
              post_ins = post_del = true;
              equalitiesLength = 0;
            } else {
              equalitiesLength--;
              pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
              post_ins = post_del = false;
            }
            changes = true;
          }
        }
        pointer++;
      }
      if (changes) {
        this.diff_cleanupMerge(diffs);
      }
    };
    diff_match_patch.prototype.diff_cleanupMerge = function(diffs) {
      diffs.push(new diff_match_patch.Diff(DIFF_EQUAL, ""));
      var pointer = 0;
      var count_delete = 0;
      var count_insert = 0;
      var text_delete = "";
      var text_insert = "";
      var commonlength;
      while (pointer < diffs.length) {
        switch (diffs[pointer][0]) {
          case DIFF_INSERT:
            count_insert++;
            text_insert += diffs[pointer][1];
            pointer++;
            break;
          case DIFF_DELETE:
            count_delete++;
            text_delete += diffs[pointer][1];
            pointer++;
            break;
          case DIFF_EQUAL:
            if (count_delete + count_insert > 1) {
              if (count_delete !== 0 && count_insert !== 0) {
                commonlength = this.diff_commonPrefix(text_insert, text_delete);
                if (commonlength !== 0) {
                  if (pointer - count_delete - count_insert > 0 && diffs[pointer - count_delete - count_insert - 1][0] == DIFF_EQUAL) {
                    diffs[pointer - count_delete - count_insert - 1][1] += text_insert.substring(0, commonlength);
                  } else {
                    diffs.splice(0, 0, new diff_match_patch.Diff(
                      DIFF_EQUAL,
                      text_insert.substring(0, commonlength)
                    ));
                    pointer++;
                  }
                  text_insert = text_insert.substring(commonlength);
                  text_delete = text_delete.substring(commonlength);
                }
                commonlength = this.diff_commonSuffix(text_insert, text_delete);
                if (commonlength !== 0) {
                  diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
                  text_insert = text_insert.substring(0, text_insert.length - commonlength);
                  text_delete = text_delete.substring(0, text_delete.length - commonlength);
                }
              }
              pointer -= count_delete + count_insert;
              diffs.splice(pointer, count_delete + count_insert);
              if (text_delete.length) {
                diffs.splice(
                  pointer,
                  0,
                  new diff_match_patch.Diff(DIFF_DELETE, text_delete)
                );
                pointer++;
              }
              if (text_insert.length) {
                diffs.splice(
                  pointer,
                  0,
                  new diff_match_patch.Diff(DIFF_INSERT, text_insert)
                );
                pointer++;
              }
              pointer++;
            } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
              diffs[pointer - 1][1] += diffs[pointer][1];
              diffs.splice(pointer, 1);
            } else {
              pointer++;
            }
            count_insert = 0;
            count_delete = 0;
            text_delete = "";
            text_insert = "";
            break;
        }
      }
      if (diffs[diffs.length - 1][1] === "") {
        diffs.pop();
      }
      var changes = false;
      pointer = 1;
      while (pointer < diffs.length - 1) {
        if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
          if (diffs[pointer][1].substring(diffs[pointer][1].length - diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
            diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);
            diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
            diffs.splice(pointer - 1, 1);
            changes = true;
          } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) == diffs[pointer + 1][1]) {
            diffs[pointer - 1][1] += diffs[pointer + 1][1];
            diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
            diffs.splice(pointer + 1, 1);
            changes = true;
          }
        }
        pointer++;
      }
      if (changes) {
        this.diff_cleanupMerge(diffs);
      }
    };
    diff_match_patch.prototype.diff_xIndex = function(diffs, loc) {
      var chars1 = 0;
      var chars2 = 0;
      var last_chars1 = 0;
      var last_chars2 = 0;
      var x;
      for (x = 0; x < diffs.length; x++) {
        if (diffs[x][0] !== DIFF_INSERT) {
          chars1 += diffs[x][1].length;
        }
        if (diffs[x][0] !== DIFF_DELETE) {
          chars2 += diffs[x][1].length;
        }
        if (chars1 > loc) {
          break;
        }
        last_chars1 = chars1;
        last_chars2 = chars2;
      }
      if (diffs.length != x && diffs[x][0] === DIFF_DELETE) {
        return last_chars2;
      }
      return last_chars2 + (loc - last_chars1);
    };
    diff_match_patch.prototype.diff_prettyHtml = function(diffs) {
      var html = [];
      var pattern_amp = /&/g;
      var pattern_lt = /</g;
      var pattern_gt = />/g;
      var pattern_para = /\n/g;
      for (var x = 0; x < diffs.length; x++) {
        var op = diffs[x][0];
        var data = diffs[x][1];
        var text2 = data.replace(pattern_amp, "&amp;").replace(pattern_lt, "&lt;").replace(pattern_gt, "&gt;").replace(pattern_para, "&para;<br>");
        switch (op) {
          case DIFF_INSERT:
            html[x] = '<ins style="background:#e6ffe6;">' + text2 + "</ins>";
            break;
          case DIFF_DELETE:
            html[x] = '<del style="background:#ffe6e6;">' + text2 + "</del>";
            break;
          case DIFF_EQUAL:
            html[x] = "<span>" + text2 + "</span>";
            break;
        }
      }
      return html.join("");
    };
    diff_match_patch.prototype.diff_text1 = function(diffs) {
      var text2 = [];
      for (var x = 0; x < diffs.length; x++) {
        if (diffs[x][0] !== DIFF_INSERT) {
          text2[x] = diffs[x][1];
        }
      }
      return text2.join("");
    };
    diff_match_patch.prototype.diff_text2 = function(diffs) {
      var text2 = [];
      for (var x = 0; x < diffs.length; x++) {
        if (diffs[x][0] !== DIFF_DELETE) {
          text2[x] = diffs[x][1];
        }
      }
      return text2.join("");
    };
    diff_match_patch.prototype.diff_levenshtein = function(diffs) {
      var levenshtein = 0;
      var insertions = 0;
      var deletions = 0;
      for (var x = 0; x < diffs.length; x++) {
        var op = diffs[x][0];
        var data = diffs[x][1];
        switch (op) {
          case DIFF_INSERT:
            insertions += data.length;
            break;
          case DIFF_DELETE:
            deletions += data.length;
            break;
          case DIFF_EQUAL:
            levenshtein += Math.max(insertions, deletions);
            insertions = 0;
            deletions = 0;
            break;
        }
      }
      levenshtein += Math.max(insertions, deletions);
      return levenshtein;
    };
    diff_match_patch.prototype.diff_toDelta = function(diffs) {
      var text2 = [];
      for (var x = 0; x < diffs.length; x++) {
        switch (diffs[x][0]) {
          case DIFF_INSERT:
            text2[x] = "+" + encodeURI(diffs[x][1]);
            break;
          case DIFF_DELETE:
            text2[x] = "-" + diffs[x][1].length;
            break;
          case DIFF_EQUAL:
            text2[x] = "=" + diffs[x][1].length;
            break;
        }
      }
      return text2.join("	").replace(/%20/g, " ");
    };
    diff_match_patch.prototype.diff_fromDelta = function(text1, delta) {
      var diffs = [];
      var diffsLength = 0;
      var pointer = 0;
      var tokens = delta.split(/\t/g);
      for (var x = 0; x < tokens.length; x++) {
        var param = tokens[x].substring(1);
        switch (tokens[x].charAt(0)) {
          case "+":
            try {
              diffs[diffsLength++] = new diff_match_patch.Diff(DIFF_INSERT, decodeURI(param));
            } catch (ex) {
              throw new Error("Illegal escape in diff_fromDelta: " + param);
            }
            break;
          case "-":
          // Fall through.
          case "=":
            var n = parseInt(param, 10);
            if (isNaN(n) || n < 0) {
              throw new Error("Invalid number in diff_fromDelta: " + param);
            }
            var text2 = text1.substring(pointer, pointer += n);
            if (tokens[x].charAt(0) == "=") {
              diffs[diffsLength++] = new diff_match_patch.Diff(DIFF_EQUAL, text2);
            } else {
              diffs[diffsLength++] = new diff_match_patch.Diff(DIFF_DELETE, text2);
            }
            break;
          default:
            if (tokens[x]) {
              throw new Error("Invalid diff operation in diff_fromDelta: " + tokens[x]);
            }
        }
      }
      if (pointer != text1.length) {
        throw new Error("Delta length (" + pointer + ") does not equal source text length (" + text1.length + ").");
      }
      return diffs;
    };
    diff_match_patch.prototype.match_main = function(text2, pattern, loc) {
      if (text2 == null || pattern == null || loc == null) {
        throw new Error("Null input. (match_main)");
      }
      loc = Math.max(0, Math.min(loc, text2.length));
      if (text2 == pattern) {
        return 0;
      } else if (!text2.length) {
        return -1;
      } else if (text2.substring(loc, loc + pattern.length) == pattern) {
        return loc;
      } else {
        return this.match_bitap_(text2, pattern, loc);
      }
    };
    diff_match_patch.prototype.match_bitap_ = function(text2, pattern, loc) {
      if (pattern.length > this.Match_MaxBits) {
        throw new Error("Pattern too long for this browser.");
      }
      var s = this.match_alphabet_(pattern);
      var dmp = this;
      function match_bitapScore_(e, x) {
        var accuracy = e / pattern.length;
        var proximity = Math.abs(loc - x);
        if (!dmp.Match_Distance) {
          return proximity ? 1 : accuracy;
        }
        return accuracy + proximity / dmp.Match_Distance;
      }
      var score_threshold = this.Match_Threshold;
      var best_loc = text2.indexOf(pattern, loc);
      if (best_loc != -1) {
        score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
        best_loc = text2.lastIndexOf(pattern, loc + pattern.length);
        if (best_loc != -1) {
          score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
        }
      }
      var matchmask = 1 << pattern.length - 1;
      best_loc = -1;
      var bin_min, bin_mid;
      var bin_max = pattern.length + text2.length;
      var last_rd;
      for (var d = 0; d < pattern.length; d++) {
        bin_min = 0;
        bin_mid = bin_max;
        while (bin_min < bin_mid) {
          if (match_bitapScore_(d, loc + bin_mid) <= score_threshold) {
            bin_min = bin_mid;
          } else {
            bin_max = bin_mid;
          }
          bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
        }
        bin_max = bin_mid;
        var start = Math.max(1, loc - bin_mid + 1);
        var finish = Math.min(loc + bin_mid, text2.length) + pattern.length;
        var rd = Array(finish + 2);
        rd[finish + 1] = (1 << d) - 1;
        for (var j = finish; j >= start; j--) {
          var charMatch = s[text2.charAt(j - 1)];
          if (d === 0) {
            rd[j] = (rd[j + 1] << 1 | 1) & charMatch;
          } else {
            rd[j] = (rd[j + 1] << 1 | 1) & charMatch | ((last_rd[j + 1] | last_rd[j]) << 1 | 1) | last_rd[j + 1];
          }
          if (rd[j] & matchmask) {
            var score = match_bitapScore_(d, j - 1);
            if (score <= score_threshold) {
              score_threshold = score;
              best_loc = j - 1;
              if (best_loc > loc) {
                start = Math.max(1, 2 * loc - best_loc);
              } else {
                break;
              }
            }
          }
        }
        if (match_bitapScore_(d + 1, loc) > score_threshold) {
          break;
        }
        last_rd = rd;
      }
      return best_loc;
    };
    diff_match_patch.prototype.match_alphabet_ = function(pattern) {
      var s = {};
      for (var i = 0; i < pattern.length; i++) {
        s[pattern.charAt(i)] = 0;
      }
      for (var i = 0; i < pattern.length; i++) {
        s[pattern.charAt(i)] |= 1 << pattern.length - i - 1;
      }
      return s;
    };
    diff_match_patch.prototype.patch_addContext_ = function(patch, text2) {
      if (text2.length == 0) {
        return;
      }
      if (patch.start2 === null) {
        throw Error("patch not initialized");
      }
      var pattern = text2.substring(patch.start2, patch.start2 + patch.length1);
      var padding = 0;
      while (text2.indexOf(pattern) != text2.lastIndexOf(pattern) && pattern.length < this.Match_MaxBits - this.Patch_Margin - this.Patch_Margin) {
        padding += this.Patch_Margin;
        pattern = text2.substring(
          patch.start2 - padding,
          patch.start2 + patch.length1 + padding
        );
      }
      padding += this.Patch_Margin;
      var prefix = text2.substring(patch.start2 - padding, patch.start2);
      if (prefix) {
        patch.diffs.unshift(new diff_match_patch.Diff(DIFF_EQUAL, prefix));
      }
      var suffix = text2.substring(
        patch.start2 + patch.length1,
        patch.start2 + patch.length1 + padding
      );
      if (suffix) {
        patch.diffs.push(new diff_match_patch.Diff(DIFF_EQUAL, suffix));
      }
      patch.start1 -= prefix.length;
      patch.start2 -= prefix.length;
      patch.length1 += prefix.length + suffix.length;
      patch.length2 += prefix.length + suffix.length;
    };
    diff_match_patch.prototype.patch_make = function(a, opt_b, opt_c) {
      var text1, diffs;
      if (typeof a == "string" && typeof opt_b == "string" && typeof opt_c == "undefined") {
        text1 = /** @type {string} */
        a;
        diffs = this.diff_main(
          text1,
          /** @type {string} */
          opt_b,
          true
        );
        if (diffs.length > 2) {
          this.diff_cleanupSemantic(diffs);
          this.diff_cleanupEfficiency(diffs);
        }
      } else if (a && typeof a == "object" && typeof opt_b == "undefined" && typeof opt_c == "undefined") {
        diffs = /** @type {!Array.<!diff_match_patch.Diff>} */
        a;
        text1 = this.diff_text1(diffs);
      } else if (typeof a == "string" && opt_b && typeof opt_b == "object" && typeof opt_c == "undefined") {
        text1 = /** @type {string} */
        a;
        diffs = /** @type {!Array.<!diff_match_patch.Diff>} */
        opt_b;
      } else if (typeof a == "string" && typeof opt_b == "string" && opt_c && typeof opt_c == "object") {
        text1 = /** @type {string} */
        a;
        diffs = /** @type {!Array.<!diff_match_patch.Diff>} */
        opt_c;
      } else {
        throw new Error("Unknown call format to patch_make.");
      }
      if (diffs.length === 0) {
        return [];
      }
      var patches = [];
      var patch = new diff_match_patch.patch_obj();
      var patchDiffLength = 0;
      var char_count1 = 0;
      var char_count2 = 0;
      var prepatch_text = text1;
      var postpatch_text = text1;
      for (var x = 0; x < diffs.length; x++) {
        var diff_type = diffs[x][0];
        var diff_text = diffs[x][1];
        if (!patchDiffLength && diff_type !== DIFF_EQUAL) {
          patch.start1 = char_count1;
          patch.start2 = char_count2;
        }
        switch (diff_type) {
          case DIFF_INSERT:
            patch.diffs[patchDiffLength++] = diffs[x];
            patch.length2 += diff_text.length;
            postpatch_text = postpatch_text.substring(0, char_count2) + diff_text + postpatch_text.substring(char_count2);
            break;
          case DIFF_DELETE:
            patch.length1 += diff_text.length;
            patch.diffs[patchDiffLength++] = diffs[x];
            postpatch_text = postpatch_text.substring(0, char_count2) + postpatch_text.substring(char_count2 + diff_text.length);
            break;
          case DIFF_EQUAL:
            if (diff_text.length <= 2 * this.Patch_Margin && patchDiffLength && diffs.length != x + 1) {
              patch.diffs[patchDiffLength++] = diffs[x];
              patch.length1 += diff_text.length;
              patch.length2 += diff_text.length;
            } else if (diff_text.length >= 2 * this.Patch_Margin) {
              if (patchDiffLength) {
                this.patch_addContext_(patch, prepatch_text);
                patches.push(patch);
                patch = new diff_match_patch.patch_obj();
                patchDiffLength = 0;
                prepatch_text = postpatch_text;
                char_count1 = char_count2;
              }
            }
            break;
        }
        if (diff_type !== DIFF_INSERT) {
          char_count1 += diff_text.length;
        }
        if (diff_type !== DIFF_DELETE) {
          char_count2 += diff_text.length;
        }
      }
      if (patchDiffLength) {
        this.patch_addContext_(patch, prepatch_text);
        patches.push(patch);
      }
      return patches;
    };
    diff_match_patch.prototype.patch_deepCopy = function(patches) {
      var patchesCopy = [];
      for (var x = 0; x < patches.length; x++) {
        var patch = patches[x];
        var patchCopy = new diff_match_patch.patch_obj();
        patchCopy.diffs = [];
        for (var y = 0; y < patch.diffs.length; y++) {
          patchCopy.diffs[y] = new diff_match_patch.Diff(patch.diffs[y][0], patch.diffs[y][1]);
        }
        patchCopy.start1 = patch.start1;
        patchCopy.start2 = patch.start2;
        patchCopy.length1 = patch.length1;
        patchCopy.length2 = patch.length2;
        patchesCopy[x] = patchCopy;
      }
      return patchesCopy;
    };
    diff_match_patch.prototype.patch_apply = function(patches, text2) {
      if (patches.length == 0) {
        return [text2, []];
      }
      patches = this.patch_deepCopy(patches);
      var nullPadding = this.patch_addPadding(patches);
      text2 = nullPadding + text2 + nullPadding;
      this.patch_splitMax(patches);
      var delta = 0;
      var results = [];
      for (var x = 0; x < patches.length; x++) {
        var expected_loc = patches[x].start2 + delta;
        var text1 = this.diff_text1(patches[x].diffs);
        var start_loc;
        var end_loc = -1;
        if (text1.length > this.Match_MaxBits) {
          start_loc = this.match_main(
            text2,
            text1.substring(0, this.Match_MaxBits),
            expected_loc
          );
          if (start_loc != -1) {
            end_loc = this.match_main(
              text2,
              text1.substring(text1.length - this.Match_MaxBits),
              expected_loc + text1.length - this.Match_MaxBits
            );
            if (end_loc == -1 || start_loc >= end_loc) {
              start_loc = -1;
            }
          }
        } else {
          start_loc = this.match_main(text2, text1, expected_loc);
        }
        if (start_loc == -1) {
          results[x] = false;
          delta -= patches[x].length2 - patches[x].length1;
        } else {
          results[x] = true;
          delta = start_loc - expected_loc;
          var text22;
          if (end_loc == -1) {
            text22 = text2.substring(start_loc, start_loc + text1.length);
          } else {
            text22 = text2.substring(start_loc, end_loc + this.Match_MaxBits);
          }
          if (text1 == text22) {
            text2 = text2.substring(0, start_loc) + this.diff_text2(patches[x].diffs) + text2.substring(start_loc + text1.length);
          } else {
            var diffs = this.diff_main(text1, text22, false);
            if (text1.length > this.Match_MaxBits && this.diff_levenshtein(diffs) / text1.length > this.Patch_DeleteThreshold) {
              results[x] = false;
            } else {
              this.diff_cleanupSemanticLossless(diffs);
              var index1 = 0;
              var index2;
              for (var y = 0; y < patches[x].diffs.length; y++) {
                var mod = patches[x].diffs[y];
                if (mod[0] !== DIFF_EQUAL) {
                  index2 = this.diff_xIndex(diffs, index1);
                }
                if (mod[0] === DIFF_INSERT) {
                  text2 = text2.substring(0, start_loc + index2) + mod[1] + text2.substring(start_loc + index2);
                } else if (mod[0] === DIFF_DELETE) {
                  text2 = text2.substring(0, start_loc + index2) + text2.substring(start_loc + this.diff_xIndex(
                    diffs,
                    index1 + mod[1].length
                  ));
                }
                if (mod[0] !== DIFF_DELETE) {
                  index1 += mod[1].length;
                }
              }
            }
          }
        }
      }
      text2 = text2.substring(nullPadding.length, text2.length - nullPadding.length);
      return [text2, results];
    };
    diff_match_patch.prototype.patch_addPadding = function(patches) {
      var paddingLength = this.Patch_Margin;
      var nullPadding = "";
      for (var x = 1; x <= paddingLength; x++) {
        nullPadding += String.fromCharCode(x);
      }
      for (var x = 0; x < patches.length; x++) {
        patches[x].start1 += paddingLength;
        patches[x].start2 += paddingLength;
      }
      var patch = patches[0];
      var diffs = patch.diffs;
      if (diffs.length == 0 || diffs[0][0] != DIFF_EQUAL) {
        diffs.unshift(new diff_match_patch.Diff(DIFF_EQUAL, nullPadding));
        patch.start1 -= paddingLength;
        patch.start2 -= paddingLength;
        patch.length1 += paddingLength;
        patch.length2 += paddingLength;
      } else if (paddingLength > diffs[0][1].length) {
        var extraLength = paddingLength - diffs[0][1].length;
        diffs[0][1] = nullPadding.substring(diffs[0][1].length) + diffs[0][1];
        patch.start1 -= extraLength;
        patch.start2 -= extraLength;
        patch.length1 += extraLength;
        patch.length2 += extraLength;
      }
      patch = patches[patches.length - 1];
      diffs = patch.diffs;
      if (diffs.length == 0 || diffs[diffs.length - 1][0] != DIFF_EQUAL) {
        diffs.push(new diff_match_patch.Diff(DIFF_EQUAL, nullPadding));
        patch.length1 += paddingLength;
        patch.length2 += paddingLength;
      } else if (paddingLength > diffs[diffs.length - 1][1].length) {
        var extraLength = paddingLength - diffs[diffs.length - 1][1].length;
        diffs[diffs.length - 1][1] += nullPadding.substring(0, extraLength);
        patch.length1 += extraLength;
        patch.length2 += extraLength;
      }
      return nullPadding;
    };
    diff_match_patch.prototype.patch_splitMax = function(patches) {
      var patch_size = this.Match_MaxBits;
      for (var x = 0; x < patches.length; x++) {
        if (patches[x].length1 <= patch_size) {
          continue;
        }
        var bigpatch = patches[x];
        patches.splice(x--, 1);
        var start1 = bigpatch.start1;
        var start2 = bigpatch.start2;
        var precontext = "";
        while (bigpatch.diffs.length !== 0) {
          var patch = new diff_match_patch.patch_obj();
          var empty = true;
          patch.start1 = start1 - precontext.length;
          patch.start2 = start2 - precontext.length;
          if (precontext !== "") {
            patch.length1 = patch.length2 = precontext.length;
            patch.diffs.push(new diff_match_patch.Diff(DIFF_EQUAL, precontext));
          }
          while (bigpatch.diffs.length !== 0 && patch.length1 < patch_size - this.Patch_Margin) {
            var diff_type = bigpatch.diffs[0][0];
            var diff_text = bigpatch.diffs[0][1];
            if (diff_type === DIFF_INSERT) {
              patch.length2 += diff_text.length;
              start2 += diff_text.length;
              patch.diffs.push(bigpatch.diffs.shift());
              empty = false;
            } else if (diff_type === DIFF_DELETE && patch.diffs.length == 1 && patch.diffs[0][0] == DIFF_EQUAL && diff_text.length > 2 * patch_size) {
              patch.length1 += diff_text.length;
              start1 += diff_text.length;
              empty = false;
              patch.diffs.push(new diff_match_patch.Diff(diff_type, diff_text));
              bigpatch.diffs.shift();
            } else {
              diff_text = diff_text.substring(
                0,
                patch_size - patch.length1 - this.Patch_Margin
              );
              patch.length1 += diff_text.length;
              start1 += diff_text.length;
              if (diff_type === DIFF_EQUAL) {
                patch.length2 += diff_text.length;
                start2 += diff_text.length;
              } else {
                empty = false;
              }
              patch.diffs.push(new diff_match_patch.Diff(diff_type, diff_text));
              if (diff_text == bigpatch.diffs[0][1]) {
                bigpatch.diffs.shift();
              } else {
                bigpatch.diffs[0][1] = bigpatch.diffs[0][1].substring(diff_text.length);
              }
            }
          }
          precontext = this.diff_text2(patch.diffs);
          precontext = precontext.substring(precontext.length - this.Patch_Margin);
          var postcontext = this.diff_text1(bigpatch.diffs).substring(0, this.Patch_Margin);
          if (postcontext !== "") {
            patch.length1 += postcontext.length;
            patch.length2 += postcontext.length;
            if (patch.diffs.length !== 0 && patch.diffs[patch.diffs.length - 1][0] === DIFF_EQUAL) {
              patch.diffs[patch.diffs.length - 1][1] += postcontext;
            } else {
              patch.diffs.push(new diff_match_patch.Diff(DIFF_EQUAL, postcontext));
            }
          }
          if (!empty) {
            patches.splice(++x, 0, patch);
          }
        }
      }
    };
    diff_match_patch.prototype.patch_toText = function(patches) {
      var text2 = [];
      for (var x = 0; x < patches.length; x++) {
        text2[x] = patches[x];
      }
      return text2.join("");
    };
    diff_match_patch.prototype.patch_fromText = function(textline) {
      var patches = [];
      if (!textline) {
        return patches;
      }
      var text2 = textline.split("\n");
      var textPointer = 0;
      var patchHeader = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
      while (textPointer < text2.length) {
        var m = text2[textPointer].match(patchHeader);
        if (!m) {
          throw new Error("Invalid patch string: " + text2[textPointer]);
        }
        var patch = new diff_match_patch.patch_obj();
        patches.push(patch);
        patch.start1 = parseInt(m[1], 10);
        if (m[2] === "") {
          patch.start1--;
          patch.length1 = 1;
        } else if (m[2] == "0") {
          patch.length1 = 0;
        } else {
          patch.start1--;
          patch.length1 = parseInt(m[2], 10);
        }
        patch.start2 = parseInt(m[3], 10);
        if (m[4] === "") {
          patch.start2--;
          patch.length2 = 1;
        } else if (m[4] == "0") {
          patch.length2 = 0;
        } else {
          patch.start2--;
          patch.length2 = parseInt(m[4], 10);
        }
        textPointer++;
        while (textPointer < text2.length) {
          var sign = text2[textPointer].charAt(0);
          try {
            var line = decodeURI(text2[textPointer].substring(1));
          } catch (ex) {
            throw new Error("Illegal escape in patch_fromText: " + line);
          }
          if (sign == "-") {
            patch.diffs.push(new diff_match_patch.Diff(DIFF_DELETE, line));
          } else if (sign == "+") {
            patch.diffs.push(new diff_match_patch.Diff(DIFF_INSERT, line));
          } else if (sign == " ") {
            patch.diffs.push(new diff_match_patch.Diff(DIFF_EQUAL, line));
          } else if (sign == "@") {
            break;
          } else if (sign === "") {
          } else {
            throw new Error('Invalid patch mode "' + sign + '" in: ' + line);
          }
          textPointer++;
        }
      }
      return patches;
    };
    diff_match_patch.patch_obj = function() {
      this.diffs = [];
      this.start1 = null;
      this.start2 = null;
      this.length1 = 0;
      this.length2 = 0;
    };
    diff_match_patch.patch_obj.prototype.toString = function() {
      var coords1, coords2;
      if (this.length1 === 0) {
        coords1 = this.start1 + ",0";
      } else if (this.length1 == 1) {
        coords1 = this.start1 + 1;
      } else {
        coords1 = this.start1 + 1 + "," + this.length1;
      }
      if (this.length2 === 0) {
        coords2 = this.start2 + ",0";
      } else if (this.length2 == 1) {
        coords2 = this.start2 + 1;
      } else {
        coords2 = this.start2 + 1 + "," + this.length2;
      }
      var text2 = ["@@ -" + coords1 + " +" + coords2 + " @@\n"];
      var op;
      for (var x = 0; x < this.diffs.length; x++) {
        switch (this.diffs[x][0]) {
          case DIFF_INSERT:
            op = "+";
            break;
          case DIFF_DELETE:
            op = "-";
            break;
          case DIFF_EQUAL:
            op = " ";
            break;
        }
        text2[x + 1] = op + encodeURI(this.diffs[x][1]) + "\n";
      }
      return text2.join("").replace(/%20/g, " ");
    };
    module2.exports = diff_match_patch;
    module2.exports["diff_match_patch"] = diff_match_patch;
    module2.exports["DIFF_DELETE"] = DIFF_DELETE;
    module2.exports["DIFF_INSERT"] = DIFF_INSERT;
    module2.exports["DIFF_EQUAL"] = DIFF_EQUAL;
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => MarkpadPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian6 = require("obsidian");
var Y11 = __toESM(require_yjs(), 1);

// ../node_modules/y-websocket/src/y-websocket.js
var Y4 = __toESM(require_yjs(), 1);

// ../node_modules/lib0/map.js
var create = () => /* @__PURE__ */ new Map();
var setIfUndefined = (map3, key, createT) => {
  let set2 = map3.get(key);
  if (set2 === void 0) {
    map3.set(key, set2 = createT());
  }
  return set2;
};

// ../node_modules/lib0/set.js
var create2 = () => /* @__PURE__ */ new Set();

// ../node_modules/lib0/array.js
var from = Array.from;
var every = (arr, f) => {
  for (let i = 0; i < arr.length; i++) {
    if (!f(arr[i], i, arr)) {
      return false;
    }
  }
  return true;
};
var some = (arr, f) => {
  for (let i = 0; i < arr.length; i++) {
    if (f(arr[i], i, arr)) {
      return true;
    }
  }
  return false;
};
var unfold = (len, f) => {
  const array = new Array(len);
  for (let i = 0; i < len; i++) {
    array[i] = f(i, array);
  }
  return array;
};
var isArray = Array.isArray;

// ../node_modules/lib0/string.js
var fromCharCode = String.fromCharCode;
var fromCodePoint = String.fromCodePoint;
var MAX_UTF16_CHARACTER = fromCharCode(65535);
var toLowerCase = (s) => s.toLowerCase();
var trimLeftRegex = /^\s*/g;
var trimLeft = (s) => s.replace(trimLeftRegex, "");
var fromCamelCaseRegex = /([A-Z])/g;
var fromCamelCase = (s, separator) => trimLeft(s.replace(fromCamelCaseRegex, (match2) => `${separator}${toLowerCase(match2)}`));
var _encodeUtf8Polyfill = (str) => {
  const encodedString = unescape(encodeURIComponent(str));
  const len = encodedString.length;
  const buf = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buf[i] = /** @type {number} */
    encodedString.codePointAt(i);
  }
  return buf;
};
var utf8TextEncoder = (
  /** @type {TextEncoder} */
  typeof TextEncoder !== "undefined" ? new TextEncoder() : null
);
var _encodeUtf8Native = (str) => utf8TextEncoder.encode(str);
var encodeUtf8 = utf8TextEncoder ? _encodeUtf8Native : _encodeUtf8Polyfill;
var utf8TextDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
if (utf8TextDecoder && utf8TextDecoder.decode(new Uint8Array()).length === 1) {
  utf8TextDecoder = null;
}
var repeat = (source, n) => unfold(n, () => source).join("");

// ../node_modules/lib0/conditions.js
var undefinedToNull = (v) => v === void 0 ? null : v;

// ../node_modules/lib0/storage.js
var VarStoragePolyfill = class {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  /**
   * @param {string} key
   * @param {any} newValue
   */
  setItem(key, newValue) {
    this.map.set(key, newValue);
  }
  /**
   * @param {string} key
   */
  getItem(key) {
    return this.map.get(key);
  }
};
var _localStorage = new VarStoragePolyfill();
var usePolyfill = true;
try {
  if (typeof localStorage !== "undefined" && localStorage) {
    _localStorage = localStorage;
    usePolyfill = false;
  }
} catch (e) {
}
var varStorage = _localStorage;
var onChange = (eventHandler) => usePolyfill || addEventListener(
  "storage",
  /** @type {any} */
  eventHandler
);
var offChange = (eventHandler) => usePolyfill || removeEventListener(
  "storage",
  /** @type {any} */
  eventHandler
);

// ../node_modules/lib0/trait/equality.js
var EqualityTraitSymbol = Symbol("Equality");
var equals = (a, b) => a === b || !!a?.[EqualityTraitSymbol]?.(b) || false;

// ../node_modules/lib0/object.js
var isObject = (o) => typeof o === "object";
var keys = Object.keys;
var map = (obj, f) => {
  const results = [];
  for (const key in obj) {
    results.push(f(obj[key], key));
  }
  return results;
};
var size = (obj) => keys(obj).length;
var every2 = (obj, f) => {
  for (const key in obj) {
    if (!f(obj[key], key)) {
      return false;
    }
  }
  return true;
};
var hasProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

// ../node_modules/lib0/function.js
var equalityDeep = (a, b) => {
  if (a === b) {
    return true;
  }
  if (a == null || b == null || a.constructor !== b.constructor && (a.constructor || Object) !== (b.constructor || Object)) {
    return false;
  }
  if (a[EqualityTraitSymbol] != null) {
    return a[EqualityTraitSymbol](b);
  }
  switch (a.constructor) {
    case ArrayBuffer:
      a = new Uint8Array(a);
      b = new Uint8Array(b);
    // eslint-disable-next-line no-fallthrough
    case Uint8Array: {
      if (a.byteLength !== b.byteLength) {
        return false;
      }
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      break;
    }
    case Set: {
      if (a.size !== b.size) {
        return false;
      }
      for (const value of a) {
        if (!b.has(value)) {
          return false;
        }
      }
      break;
    }
    case Map: {
      if (a.size !== b.size) {
        return false;
      }
      for (const key of a.keys()) {
        if (!b.has(key) || !equalityDeep(a.get(key), b.get(key))) {
          return false;
        }
      }
      break;
    }
    case void 0:
    case Object:
      if (size(a) !== size(b)) {
        return false;
      }
      for (const key in a) {
        if (!hasProperty(a, key) || !equalityDeep(a[key], b[key])) {
          return false;
        }
      }
      break;
    case Array:
      if (a.length !== b.length) {
        return false;
      }
      for (let i = 0; i < a.length; i++) {
        if (!equalityDeep(a[i], b[i])) {
          return false;
        }
      }
      break;
    default:
      return false;
  }
  return true;
};
var isOneOf = (value, options) => options.includes(value);

// ../node_modules/lib0/environment.js
var isNode = typeof process !== "undefined" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && !isNode;
var isMac = typeof navigator !== "undefined" ? /Mac/.test(navigator.platform) : false;
var params;
var args = [];
var computeParams = () => {
  if (params === void 0) {
    if (isNode) {
      params = create();
      const pargs = process.argv;
      let currParamName = null;
      for (let i = 0; i < pargs.length; i++) {
        const parg = pargs[i];
        if (parg[0] === "-") {
          if (currParamName !== null) {
            params.set(currParamName, "");
          }
          currParamName = parg;
        } else {
          if (currParamName !== null) {
            params.set(currParamName, parg);
            currParamName = null;
          } else {
            args.push(parg);
          }
        }
      }
      if (currParamName !== null) {
        params.set(currParamName, "");
      }
    } else if (typeof location === "object") {
      params = create();
      (location.search || "?").slice(1).split("&").forEach((kv) => {
        if (kv.length !== 0) {
          const [key, value] = kv.split("=");
          params.set(`--${fromCamelCase(key, "-")}`, value);
          params.set(`-${fromCamelCase(key, "-")}`, value);
        }
      });
    } else {
      params = create();
    }
  }
  return params;
};
var hasParam = (name) => computeParams().has(name);
var getVariable = (name) => isNode ? undefinedToNull(process.env[name.toUpperCase().replaceAll("-", "_")]) : undefinedToNull(varStorage.getItem(name));
var hasConf = (name) => hasParam("--" + name) || getVariable(name) !== null;
var production = hasConf("production");
var forceColor = isNode && isOneOf(process.env.FORCE_COLOR, ["true", "1", "2"]);
var supportsColor = forceColor || !hasParam("--no-colors") && // @todo deprecate --no-colors
!hasConf("no-color") && (!isNode || process.stdout.isTTY) && (!isNode || hasParam("--color") || getVariable("COLORTERM") !== null || (getVariable("TERM") || "").includes("color"));

// ../node_modules/lib0/math.js
var floor = Math.floor;
var min = (a, b) => a < b ? a : b;
var max = (a, b) => a > b ? a : b;
var isNaN2 = Number.isNaN;
var pow = Math.pow;

// ../node_modules/lib0/binary.js
var BIT8 = 128;
var BIT18 = 1 << 17;
var BIT19 = 1 << 18;
var BIT20 = 1 << 19;
var BIT21 = 1 << 20;
var BIT22 = 1 << 21;
var BIT23 = 1 << 22;
var BIT24 = 1 << 23;
var BIT25 = 1 << 24;
var BIT26 = 1 << 25;
var BIT27 = 1 << 26;
var BIT28 = 1 << 27;
var BIT29 = 1 << 28;
var BIT30 = 1 << 29;
var BIT31 = 1 << 30;
var BIT32 = 1 << 31;
var BITS7 = 127;
var BITS17 = BIT18 - 1;
var BITS18 = BIT19 - 1;
var BITS19 = BIT20 - 1;
var BITS20 = BIT21 - 1;
var BITS21 = BIT22 - 1;
var BITS22 = BIT23 - 1;
var BITS23 = BIT24 - 1;
var BITS24 = BIT25 - 1;
var BITS25 = BIT26 - 1;
var BITS26 = BIT27 - 1;
var BITS27 = BIT28 - 1;
var BITS28 = BIT29 - 1;
var BITS29 = BIT30 - 1;
var BITS30 = BIT31 - 1;

// ../node_modules/lib0/number.js
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
var MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;
var LOWEST_INT32 = 1 << 31;
var isInteger = Number.isInteger || ((num) => typeof num === "number" && isFinite(num) && floor(num) === num);
var isNaN3 = Number.isNaN;
var parseInt2 = Number.parseInt;

// ../node_modules/lib0/encoding.js
var Encoder = class {
  constructor() {
    this.cpos = 0;
    this.cbuf = new Uint8Array(100);
    this.bufs = [];
  }
};
var createEncoder = () => new Encoder();
var length = (encoder) => {
  let len = encoder.cpos;
  for (let i = 0; i < encoder.bufs.length; i++) {
    len += encoder.bufs[i].length;
  }
  return len;
};
var toUint8Array = (encoder) => {
  const uint8arr = new Uint8Array(length(encoder));
  let curPos = 0;
  for (let i = 0; i < encoder.bufs.length; i++) {
    const d = encoder.bufs[i];
    uint8arr.set(d, curPos);
    curPos += d.length;
  }
  uint8arr.set(new Uint8Array(encoder.cbuf.buffer, 0, encoder.cpos), curPos);
  return uint8arr;
};
var write = (encoder, num) => {
  const bufferLen = encoder.cbuf.length;
  if (encoder.cpos === bufferLen) {
    encoder.bufs.push(encoder.cbuf);
    encoder.cbuf = new Uint8Array(bufferLen * 2);
    encoder.cpos = 0;
  }
  encoder.cbuf[encoder.cpos++] = num;
};
var writeVarUint = (encoder, num) => {
  while (num > BITS7) {
    write(encoder, BIT8 | BITS7 & num);
    num = floor(num / 128);
  }
  write(encoder, BITS7 & num);
};
var _strBuffer = new Uint8Array(3e4);
var _maxStrBSize = _strBuffer.length / 3;
var _writeVarStringNative = (encoder, str) => {
  if (str.length < _maxStrBSize) {
    const written = utf8TextEncoder.encodeInto(str, _strBuffer).written || 0;
    writeVarUint(encoder, written);
    for (let i = 0; i < written; i++) {
      write(encoder, _strBuffer[i]);
    }
  } else {
    writeVarUint8Array(encoder, encodeUtf8(str));
  }
};
var _writeVarStringPolyfill = (encoder, str) => {
  const encodedString = unescape(encodeURIComponent(str));
  const len = encodedString.length;
  writeVarUint(encoder, len);
  for (let i = 0; i < len; i++) {
    write(
      encoder,
      /** @type {number} */
      encodedString.codePointAt(i)
    );
  }
};
var writeVarString = utf8TextEncoder && /** @type {any} */
utf8TextEncoder.encodeInto ? _writeVarStringNative : _writeVarStringPolyfill;
var writeUint8Array = (encoder, uint8Array) => {
  const bufferLen = encoder.cbuf.length;
  const cpos = encoder.cpos;
  const leftCopyLen = min(bufferLen - cpos, uint8Array.length);
  const rightCopyLen = uint8Array.length - leftCopyLen;
  encoder.cbuf.set(uint8Array.subarray(0, leftCopyLen), cpos);
  encoder.cpos += leftCopyLen;
  if (rightCopyLen > 0) {
    encoder.bufs.push(encoder.cbuf);
    encoder.cbuf = new Uint8Array(max(bufferLen * 2, rightCopyLen));
    encoder.cbuf.set(uint8Array.subarray(leftCopyLen));
    encoder.cpos = rightCopyLen;
  }
};
var writeVarUint8Array = (encoder, uint8Array) => {
  writeVarUint(encoder, uint8Array.byteLength);
  writeUint8Array(encoder, uint8Array);
};
var floatTestBed = new DataView(new ArrayBuffer(4));

// ../node_modules/lib0/error.js
var create3 = (s) => new Error(s);
var methodUnimplemented = () => {
  throw create3("Method unimplemented");
};
var unexpectedCase = () => {
  throw create3("Unexpected case");
};

// ../node_modules/lib0/decoding.js
var errorUnexpectedEndOfArray = create3("Unexpected end of array");
var errorIntegerOutOfRange = create3("Integer out of Range");
var Decoder = class {
  /**
   * @param {Uint8Array<Buf>} uint8Array Binary data to decode
   */
  constructor(uint8Array) {
    this.arr = uint8Array;
    this.pos = 0;
  }
};
var createDecoder = (uint8Array) => new Decoder(uint8Array);
var readUint8Array = (decoder, len) => {
  const view = new Uint8Array(decoder.arr.buffer, decoder.pos + decoder.arr.byteOffset, len);
  decoder.pos += len;
  return view;
};
var readVarUint8Array = (decoder) => readUint8Array(decoder, readVarUint(decoder));
var readUint8 = (decoder) => decoder.arr[decoder.pos++];
var readVarUint = (decoder) => {
  let num = 0;
  let mult = 1;
  const len = decoder.arr.length;
  while (decoder.pos < len) {
    const r = decoder.arr[decoder.pos++];
    num = num + (r & BITS7) * mult;
    mult *= 128;
    if (r < BIT8) {
      return num;
    }
    if (num > MAX_SAFE_INTEGER) {
      throw errorIntegerOutOfRange;
    }
  }
  throw errorUnexpectedEndOfArray;
};
var _readVarStringPolyfill = (decoder) => {
  let remainingLen = readVarUint(decoder);
  if (remainingLen === 0) {
    return "";
  } else {
    let encodedString = String.fromCodePoint(readUint8(decoder));
    if (--remainingLen < 100) {
      while (remainingLen--) {
        encodedString += String.fromCodePoint(readUint8(decoder));
      }
    } else {
      while (remainingLen > 0) {
        const nextLen = remainingLen < 1e4 ? remainingLen : 1e4;
        const bytes = decoder.arr.subarray(decoder.pos, decoder.pos + nextLen);
        decoder.pos += nextLen;
        encodedString += String.fromCodePoint.apply(
          null,
          /** @type {any} */
          bytes
        );
        remainingLen -= nextLen;
      }
    }
    return decodeURIComponent(escape(encodedString));
  }
};
var _readVarStringNative = (decoder) => (
  /** @type any */
  utf8TextDecoder.decode(readVarUint8Array(decoder))
);
var readVarString = utf8TextDecoder ? _readVarStringNative : _readVarStringPolyfill;

// ../node_modules/lib0/buffer.js
var createUint8ArrayFromLen = (len) => new Uint8Array(len);
var createUint8ArrayViewFromArrayBuffer = (buffer, byteOffset, length2) => new Uint8Array(buffer, byteOffset, length2);
var createUint8ArrayFromArrayBuffer = (buffer) => new Uint8Array(buffer);
var toBase64Browser = (bytes) => {
  let s = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    s += fromCharCode(bytes[i]);
  }
  return btoa(s);
};
var toBase64Node = (bytes) => Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("base64");
var fromBase64Browser = (s) => {
  const a = atob(s);
  const bytes = createUint8ArrayFromLen(a.length);
  for (let i = 0; i < a.length; i++) {
    bytes[i] = a.charCodeAt(i);
  }
  return bytes;
};
var fromBase64Node = (s) => {
  const buf = Buffer.from(s, "base64");
  return createUint8ArrayViewFromArrayBuffer(buf.buffer, buf.byteOffset, buf.byteLength);
};
var toBase64 = isBrowser ? toBase64Browser : toBase64Node;
var fromBase64 = isBrowser ? fromBase64Browser : fromBase64Node;

// ../node_modules/lib0/broadcastchannel.js
var channels = /* @__PURE__ */ new Map();
var LocalStoragePolyfill = class {
  /**
   * @param {string} room
   */
  constructor(room) {
    this.room = room;
    this.onmessage = null;
    this._onChange = (e) => e.key === room && this.onmessage !== null && this.onmessage({ data: fromBase64(e.newValue || "") });
    onChange(this._onChange);
  }
  /**
   * @param {ArrayBuffer} buf
   */
  postMessage(buf) {
    varStorage.setItem(this.room, toBase64(createUint8ArrayFromArrayBuffer(buf)));
  }
  close() {
    offChange(this._onChange);
  }
};
var BC = typeof BroadcastChannel === "undefined" ? LocalStoragePolyfill : BroadcastChannel;
var getChannel = (room) => setIfUndefined(channels, room, () => {
  const subs = create2();
  const bc = new BC(room);
  bc.onmessage = (e) => subs.forEach((sub) => sub(e.data, "broadcastchannel"));
  return {
    bc,
    subs
  };
});
var subscribe = (room, f) => {
  getChannel(room).subs.add(f);
  return f;
};
var unsubscribe = (room, f) => {
  const channel = getChannel(room);
  const unsubscribed = channel.subs.delete(f);
  if (unsubscribed && channel.subs.size === 0) {
    channel.bc.close();
    channels.delete(room);
  }
  return unsubscribed;
};
var publish = (room, data, origin = null) => {
  const c = getChannel(room);
  c.bc.postMessage(data);
  c.subs.forEach((sub) => sub(data, origin));
};

// ../node_modules/lib0/time.js
var getUnixTime = Date.now;

// ../node_modules/y-protocols/sync.js
var Y = __toESM(require_yjs(), 1);
var messageYjsSyncStep1 = 0;
var messageYjsSyncStep2 = 1;
var messageYjsUpdate = 2;
var writeSyncStep1 = (encoder, doc2) => {
  writeVarUint(encoder, messageYjsSyncStep1);
  const sv = Y.encodeStateVector(doc2);
  writeVarUint8Array(encoder, sv);
};
var writeSyncStep2 = (encoder, doc2, encodedStateVector) => {
  writeVarUint(encoder, messageYjsSyncStep2);
  writeVarUint8Array(encoder, Y.encodeStateAsUpdate(doc2, encodedStateVector));
};
var readSyncStep1 = (decoder, encoder, doc2) => writeSyncStep2(encoder, doc2, readVarUint8Array(decoder));
var readSyncStep2 = (decoder, doc2, transactionOrigin, errorHandler) => {
  try {
    Y.applyUpdate(doc2, readVarUint8Array(decoder), transactionOrigin);
  } catch (error) {
    if (errorHandler != null) errorHandler(
      /** @type {Error} */
      error
    );
    console.error("Caught error while handling a Yjs update", error);
  }
};
var writeUpdate = (encoder, update) => {
  writeVarUint(encoder, messageYjsUpdate);
  writeVarUint8Array(encoder, update);
};
var readUpdate = readSyncStep2;
var readSyncMessage = (decoder, encoder, doc2, transactionOrigin, errorHandler) => {
  const messageType = readVarUint(decoder);
  switch (messageType) {
    case messageYjsSyncStep1:
      readSyncStep1(decoder, encoder, doc2);
      break;
    case messageYjsSyncStep2:
      readSyncStep2(decoder, doc2, transactionOrigin, errorHandler);
      break;
    case messageYjsUpdate:
      readUpdate(decoder, doc2, transactionOrigin, errorHandler);
      break;
    default:
      throw new Error("Unknown message type");
  }
  return messageType;
};

// ../node_modules/y-protocols/auth.js
var Y2 = __toESM(require_yjs(), 1);
var messagePermissionDenied = 0;
var readAuthMessage = (decoder, y, permissionDeniedHandler2) => {
  switch (readVarUint(decoder)) {
    case messagePermissionDenied:
      permissionDeniedHandler2(y, readVarString(decoder));
  }
};

// ../node_modules/lib0/observable.js
var ObservableV2 = class {
  constructor() {
    this._observers = create();
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  on(name, f) {
    setIfUndefined(
      this._observers,
      /** @type {string} */
      name,
      create2
    ).add(f);
    return f;
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  once(name, f) {
    const _f = (...args2) => {
      this.off(
        name,
        /** @type {any} */
        _f
      );
      f(...args2);
    };
    this.on(
      name,
      /** @type {any} */
      _f
    );
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  off(name, f) {
    const observers = this._observers.get(name);
    if (observers !== void 0) {
      observers.delete(f);
      if (observers.size === 0) {
        this._observers.delete(name);
      }
    }
  }
  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name The event name.
   * @param {Parameters<EVENTS[NAME]>} args The arguments that are applied to the event listener.
   */
  emit(name, args2) {
    return from((this._observers.get(name) || create()).values()).forEach((f) => f(...args2));
  }
  destroy() {
    this._observers = create();
  }
};
var Observable = class {
  constructor() {
    this._observers = create();
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  on(name, f) {
    setIfUndefined(this._observers, name, create2).add(f);
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  once(name, f) {
    const _f = (...args2) => {
      this.off(name, _f);
      f(...args2);
    };
    this.on(name, _f);
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  off(name, f) {
    const observers = this._observers.get(name);
    if (observers !== void 0) {
      observers.delete(f);
      if (observers.size === 0) {
        this._observers.delete(name);
      }
    }
  }
  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @param {N} name The event name.
   * @param {Array<any>} args The arguments that are applied to the event listener.
   */
  emit(name, args2) {
    return from((this._observers.get(name) || create()).values()).forEach((f) => f(...args2));
  }
  destroy() {
    this._observers = create();
  }
};

// ../node_modules/y-protocols/awareness.js
var Y3 = __toESM(require_yjs(), 1);
var outdatedTimeout = 3e4;
var Awareness = class extends Observable {
  /**
   * @param {Y.Doc} doc
   */
  constructor(doc2) {
    super();
    this.doc = doc2;
    this.clientID = doc2.clientID;
    this.states = /* @__PURE__ */ new Map();
    this.meta = /* @__PURE__ */ new Map();
    this._checkInterval = /** @type {any} */
    setInterval(() => {
      const now = getUnixTime();
      if (this.getLocalState() !== null && outdatedTimeout / 2 <= now - /** @type {{lastUpdated:number}} */
      this.meta.get(this.clientID).lastUpdated) {
        this.setLocalState(this.getLocalState());
      }
      const remove = [];
      this.meta.forEach((meta, clientid) => {
        if (clientid !== this.clientID && outdatedTimeout <= now - meta.lastUpdated && this.states.has(clientid)) {
          remove.push(clientid);
        }
      });
      if (remove.length > 0) {
        removeAwarenessStates(this, remove, "timeout");
      }
    }, floor(outdatedTimeout / 10));
    doc2.on("destroy", () => {
      this.destroy();
    });
    this.setLocalState({});
  }
  destroy() {
    this.emit("destroy", [this]);
    this.setLocalState(null);
    super.destroy();
    clearInterval(this._checkInterval);
  }
  /**
   * @return {Object<string,any>|null}
   */
  getLocalState() {
    return this.states.get(this.clientID) || null;
  }
  /**
   * @param {Object<string,any>|null} state
   */
  setLocalState(state) {
    const clientID = this.clientID;
    const currLocalMeta = this.meta.get(clientID);
    const clock = currLocalMeta === void 0 ? 0 : currLocalMeta.clock + 1;
    const prevState = this.states.get(clientID);
    if (state === null) {
      this.states.delete(clientID);
    } else {
      this.states.set(clientID, state);
    }
    this.meta.set(clientID, {
      clock,
      lastUpdated: getUnixTime()
    });
    const added = [];
    const updated = [];
    const filteredUpdated = [];
    const removed = [];
    if (state === null) {
      removed.push(clientID);
    } else if (prevState == null) {
      if (state != null) {
        added.push(clientID);
      }
    } else {
      updated.push(clientID);
      if (!equalityDeep(prevState, state)) {
        filteredUpdated.push(clientID);
      }
    }
    if (added.length > 0 || filteredUpdated.length > 0 || removed.length > 0) {
      this.emit("change", [{ added, updated: filteredUpdated, removed }, "local"]);
    }
    this.emit("update", [{ added, updated, removed }, "local"]);
  }
  /**
   * @param {string} field
   * @param {any} value
   */
  setLocalStateField(field, value) {
    const state = this.getLocalState();
    if (state !== null) {
      this.setLocalState({
        ...state,
        [field]: value
      });
    }
  }
  /**
   * @return {Map<number,Object<string,any>>}
   */
  getStates() {
    return this.states;
  }
};
var removeAwarenessStates = (awareness, clients, origin) => {
  const removed = [];
  for (let i = 0; i < clients.length; i++) {
    const clientID = clients[i];
    if (awareness.states.has(clientID)) {
      awareness.states.delete(clientID);
      if (clientID === awareness.clientID) {
        const curMeta = (
          /** @type {MetaClientState} */
          awareness.meta.get(clientID)
        );
        awareness.meta.set(clientID, {
          clock: curMeta.clock + 1,
          lastUpdated: getUnixTime()
        });
      }
      removed.push(clientID);
    }
  }
  if (removed.length > 0) {
    awareness.emit("change", [{ added: [], updated: [], removed }, origin]);
    awareness.emit("update", [{ added: [], updated: [], removed }, origin]);
  }
};
var encodeAwarenessUpdate = (awareness, clients, states = awareness.states) => {
  const len = clients.length;
  const encoder = createEncoder();
  writeVarUint(encoder, len);
  for (let i = 0; i < len; i++) {
    const clientID = clients[i];
    const state = states.get(clientID) || null;
    const clock = (
      /** @type {MetaClientState} */
      awareness.meta.get(clientID).clock
    );
    writeVarUint(encoder, clientID);
    writeVarUint(encoder, clock);
    writeVarString(encoder, JSON.stringify(state));
  }
  return toUint8Array(encoder);
};
var applyAwarenessUpdate = (awareness, update, origin) => {
  const decoder = createDecoder(update);
  const timestamp2 = getUnixTime();
  const added = [];
  const updated = [];
  const filteredUpdated = [];
  const removed = [];
  const len = readVarUint(decoder);
  for (let i = 0; i < len; i++) {
    const clientID = readVarUint(decoder);
    let clock = readVarUint(decoder);
    const state = JSON.parse(readVarString(decoder));
    const clientMeta = awareness.meta.get(clientID);
    const prevState = awareness.states.get(clientID);
    const currClock = clientMeta === void 0 ? 0 : clientMeta.clock;
    if (currClock < clock || currClock === clock && state === null && awareness.states.has(clientID)) {
      if (state === null) {
        if (clientID === awareness.clientID && awareness.getLocalState() != null) {
          clock++;
        } else {
          awareness.states.delete(clientID);
        }
      } else {
        awareness.states.set(clientID, state);
      }
      awareness.meta.set(clientID, {
        clock,
        lastUpdated: timestamp2
      });
      if (clientMeta === void 0 && state !== null) {
        added.push(clientID);
      } else if (clientMeta !== void 0 && state === null) {
        removed.push(clientID);
      } else if (state !== null) {
        if (!equalityDeep(state, prevState)) {
          filteredUpdated.push(clientID);
        }
        updated.push(clientID);
      }
    }
  }
  if (added.length > 0 || filteredUpdated.length > 0 || removed.length > 0) {
    awareness.emit("change", [{
      added,
      updated: filteredUpdated,
      removed
    }, origin]);
  }
  if (added.length > 0 || updated.length > 0 || removed.length > 0) {
    awareness.emit("update", [{
      added,
      updated,
      removed
    }, origin]);
  }
};

// ../node_modules/lib0/url.js
var encodeQueryParams = (params2) => map(params2, (val, key) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join("&");

// ../node_modules/y-websocket/src/y-websocket.js
var messageSync = 0;
var messageQueryAwareness = 3;
var messageAwareness = 1;
var messageAuth = 2;
var messageHandlers = [];
messageHandlers[messageSync] = (encoder, decoder, provider, emitSynced, _messageType) => {
  writeVarUint(encoder, messageSync);
  const syncMessageType = readSyncMessage(
    decoder,
    encoder,
    provider.doc,
    provider
  );
  if (emitSynced && syncMessageType === messageYjsSyncStep2 && !provider.synced) {
    provider.synced = true;
  }
};
messageHandlers[messageQueryAwareness] = (encoder, _decoder, provider, _emitSynced, _messageType) => {
  writeVarUint(encoder, messageAwareness);
  writeVarUint8Array(
    encoder,
    encodeAwarenessUpdate(
      provider.awareness,
      Array.from(provider.awareness.getStates().keys())
    )
  );
};
messageHandlers[messageAwareness] = (_encoder, decoder, provider, _emitSynced, _messageType) => {
  applyAwarenessUpdate(
    provider.awareness,
    readVarUint8Array(decoder),
    provider
  );
};
messageHandlers[messageAuth] = (_encoder, decoder, provider, _emitSynced, _messageType) => {
  readAuthMessage(
    decoder,
    provider.doc,
    (_ydoc, reason) => permissionDeniedHandler(provider, reason)
  );
};
var messageReconnectTimeout = 3e4;
var permissionDeniedHandler = (provider, reason) => console.warn(`Permission denied to access ${provider.url}.
${reason}`);
var readMessage = (provider, buf, emitSynced) => {
  const decoder = createDecoder(buf);
  const encoder = createEncoder();
  const messageType = readVarUint(decoder);
  const messageHandler = provider.messageHandlers[messageType];
  if (
    /** @type {any} */
    messageHandler
  ) {
    messageHandler(encoder, decoder, provider, emitSynced, messageType);
  } else {
    console.error("Unable to compute message");
  }
  return encoder;
};
var closeWebsocketConnection = (provider, ws, event) => {
  if (ws === provider.ws) {
    provider.emit("connection-close", [event, provider]);
    provider.ws = null;
    ws.close();
    provider.wsconnecting = false;
    if (provider.wsconnected) {
      provider.wsconnected = false;
      provider.synced = false;
      removeAwarenessStates(
        provider.awareness,
        Array.from(provider.awareness.getStates().keys()).filter(
          (client) => client !== provider.doc.clientID
        ),
        provider
      );
      provider.emit("status", [{
        status: "disconnected"
      }]);
    } else {
      provider.wsUnsuccessfulReconnects++;
    }
    setTimeout(
      setupWS,
      min(
        pow(2, provider.wsUnsuccessfulReconnects) * 100,
        provider.maxBackoffTime
      ),
      provider
    );
  }
};
var setupWS = (provider) => {
  if (provider.shouldConnect && provider.ws === null) {
    const websocket = new provider._WS(provider.url, provider.protocols);
    websocket.binaryType = "arraybuffer";
    provider.ws = websocket;
    provider.wsconnecting = true;
    provider.wsconnected = false;
    provider.synced = false;
    websocket.onmessage = (event) => {
      provider.wsLastMessageReceived = getUnixTime();
      const encoder = readMessage(provider, new Uint8Array(event.data), true);
      if (length(encoder) > 1) {
        websocket.send(toUint8Array(encoder));
      }
    };
    websocket.onerror = (event) => {
      provider.emit("connection-error", [event, provider]);
    };
    websocket.onclose = (event) => {
      closeWebsocketConnection(provider, websocket, event);
    };
    websocket.onopen = () => {
      provider.wsLastMessageReceived = getUnixTime();
      provider.wsconnecting = false;
      provider.wsconnected = true;
      provider.wsUnsuccessfulReconnects = 0;
      provider.emit("status", [{
        status: "connected"
      }]);
      const encoder = createEncoder();
      writeVarUint(encoder, messageSync);
      writeSyncStep1(encoder, provider.doc);
      websocket.send(toUint8Array(encoder));
      if (provider.awareness.getLocalState() !== null) {
        const encoderAwarenessState = createEncoder();
        writeVarUint(encoderAwarenessState, messageAwareness);
        writeVarUint8Array(
          encoderAwarenessState,
          encodeAwarenessUpdate(provider.awareness, [
            provider.doc.clientID
          ])
        );
        websocket.send(toUint8Array(encoderAwarenessState));
      }
    };
    provider.emit("status", [{
      status: "connecting"
    }]);
  }
};
var broadcastMessage = (provider, buf) => {
  const ws = provider.ws;
  if (provider.wsconnected && ws && ws.readyState === ws.OPEN) {
    ws.send(buf);
  }
  if (provider.bcconnected) {
    publish(provider.bcChannel, buf, provider);
  }
};
var WebsocketProvider = class extends ObservableV2 {
  /**
   * @param {string} serverUrl
   * @param {string} roomname
   * @param {Y.Doc} doc
   * @param {object} opts
   * @param {boolean} [opts.connect]
   * @param {awarenessProtocol.Awareness} [opts.awareness]
   * @param {Object<string,string>} [opts.params] specify url parameters
   * @param {Array<string>} [opts.protocols] specify websocket protocols
   * @param {typeof WebSocket} [opts.WebSocketPolyfill] Optionall provide a WebSocket polyfill
   * @param {number} [opts.resyncInterval] Request server state every `resyncInterval` milliseconds
   * @param {number} [opts.maxBackoffTime] Maximum amount of time to wait before trying to reconnect (we try to reconnect using exponential backoff)
   * @param {boolean} [opts.disableBc] Disable cross-tab BroadcastChannel communication
   */
  constructor(serverUrl, roomname, doc2, {
    connect = true,
    awareness = new Awareness(doc2),
    params: params2 = {},
    protocols = [],
    WebSocketPolyfill = WebSocket,
    resyncInterval = -1,
    maxBackoffTime = 2500,
    disableBc = false
  } = {}) {
    super();
    while (serverUrl[serverUrl.length - 1] === "/") {
      serverUrl = serverUrl.slice(0, serverUrl.length - 1);
    }
    this.serverUrl = serverUrl;
    this.bcChannel = serverUrl + "/" + roomname;
    this.maxBackoffTime = maxBackoffTime;
    this.params = params2;
    this.protocols = protocols;
    this.roomname = roomname;
    this.doc = doc2;
    this._WS = WebSocketPolyfill;
    this.awareness = awareness;
    this.wsconnected = false;
    this.wsconnecting = false;
    this.bcconnected = false;
    this.disableBc = disableBc;
    this.wsUnsuccessfulReconnects = 0;
    this.messageHandlers = messageHandlers.slice();
    this._synced = false;
    this.ws = null;
    this.wsLastMessageReceived = 0;
    this.shouldConnect = connect;
    this._resyncInterval = 0;
    if (resyncInterval > 0) {
      this._resyncInterval = /** @type {any} */
      setInterval(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          const encoder = createEncoder();
          writeVarUint(encoder, messageSync);
          writeSyncStep1(encoder, doc2);
          this.ws.send(toUint8Array(encoder));
        }
      }, resyncInterval);
    }
    this._bcSubscriber = (data, origin) => {
      if (origin !== this) {
        const encoder = readMessage(this, new Uint8Array(data), false);
        if (length(encoder) > 1) {
          publish(this.bcChannel, toUint8Array(encoder), this);
        }
      }
    };
    this._updateHandler = (update, origin) => {
      if (origin !== this) {
        const encoder = createEncoder();
        writeVarUint(encoder, messageSync);
        writeUpdate(encoder, update);
        broadcastMessage(this, toUint8Array(encoder));
      }
    };
    this.doc.on("update", this._updateHandler);
    this._awarenessUpdateHandler = ({ added, updated, removed }, _origin) => {
      const changedClients = added.concat(updated).concat(removed);
      const encoder = createEncoder();
      writeVarUint(encoder, messageAwareness);
      writeVarUint8Array(
        encoder,
        encodeAwarenessUpdate(awareness, changedClients)
      );
      broadcastMessage(this, toUint8Array(encoder));
    };
    this._exitHandler = () => {
      removeAwarenessStates(
        this.awareness,
        [doc2.clientID],
        "app closed"
      );
    };
    if (isNode && typeof process !== "undefined") {
      process.on("exit", this._exitHandler);
    }
    awareness.on("update", this._awarenessUpdateHandler);
    this._checkInterval = /** @type {any} */
    setInterval(() => {
      if (this.wsconnected && messageReconnectTimeout < getUnixTime() - this.wsLastMessageReceived) {
        closeWebsocketConnection(
          this,
          /** @type {WebSocket} */
          this.ws,
          null
        );
      }
    }, messageReconnectTimeout / 10);
    if (connect) {
      this.connect();
    }
  }
  get url() {
    const encodedParams = encodeQueryParams(this.params);
    return this.serverUrl + "/" + this.roomname + (encodedParams.length === 0 ? "" : "?" + encodedParams);
  }
  /**
   * @type {boolean}
   */
  get synced() {
    return this._synced;
  }
  set synced(state) {
    if (this._synced !== state) {
      this._synced = state;
      this.emit("synced", [state]);
      this.emit("sync", [state]);
    }
  }
  destroy() {
    if (this._resyncInterval !== 0) {
      clearInterval(this._resyncInterval);
    }
    clearInterval(this._checkInterval);
    this.disconnect();
    if (isNode && typeof process !== "undefined") {
      process.off("exit", this._exitHandler);
    }
    this.awareness.off("update", this._awarenessUpdateHandler);
    this.doc.off("update", this._updateHandler);
    super.destroy();
  }
  connectBc() {
    if (this.disableBc) {
      return;
    }
    if (!this.bcconnected) {
      subscribe(this.bcChannel, this._bcSubscriber);
      this.bcconnected = true;
    }
    const encoderSync = createEncoder();
    writeVarUint(encoderSync, messageSync);
    writeSyncStep1(encoderSync, this.doc);
    publish(this.bcChannel, toUint8Array(encoderSync), this);
    const encoderState = createEncoder();
    writeVarUint(encoderState, messageSync);
    writeSyncStep2(encoderState, this.doc);
    publish(this.bcChannel, toUint8Array(encoderState), this);
    const encoderAwarenessQuery = createEncoder();
    writeVarUint(encoderAwarenessQuery, messageQueryAwareness);
    publish(
      this.bcChannel,
      toUint8Array(encoderAwarenessQuery),
      this
    );
    const encoderAwarenessState = createEncoder();
    writeVarUint(encoderAwarenessState, messageAwareness);
    writeVarUint8Array(
      encoderAwarenessState,
      encodeAwarenessUpdate(this.awareness, [
        this.doc.clientID
      ])
    );
    publish(
      this.bcChannel,
      toUint8Array(encoderAwarenessState),
      this
    );
  }
  disconnectBc() {
    const encoder = createEncoder();
    writeVarUint(encoder, messageAwareness);
    writeVarUint8Array(
      encoder,
      encodeAwarenessUpdate(this.awareness, [
        this.doc.clientID
      ], /* @__PURE__ */ new Map())
    );
    broadcastMessage(this, toUint8Array(encoder));
    if (this.bcconnected) {
      unsubscribe(this.bcChannel, this._bcSubscriber);
      this.bcconnected = false;
    }
  }
  disconnect() {
    this.shouldConnect = false;
    this.disconnectBc();
    if (this.ws !== null) {
      closeWebsocketConnection(this, this.ws, null);
    }
  }
  connect() {
    this.shouldConnect = true;
    if (!this.wsconnected && this.ws === null) {
      setupWS(this);
      this.connectBc();
    }
  }
};

// ../node_modules/y-codemirror.next/src/index.js
var Y9 = __toESM(require_yjs(), 1);
var cmView4 = __toESM(require("@codemirror/view"), 1);
var cmState4 = __toESM(require("@codemirror/state"), 1);

// ../node_modules/y-codemirror.next/src/y-range.js
var Y5 = __toESM(require_yjs(), 1);
var YRange = class _YRange {
  /**
   * @param {Y.RelativePosition} yanchor
   * @param {Y.RelativePosition} yhead
   */
  constructor(yanchor, yhead) {
    this.yanchor = yanchor;
    this.yhead = yhead;
  }
  /**
   * @returns {any}
   */
  toJSON() {
    return {
      yanchor: Y5.relativePositionToJSON(this.yanchor),
      yhead: Y5.relativePositionToJSON(this.yhead)
    };
  }
  /**
   * @param {any} json
   * @return {YRange}
   */
  static fromJSON(json) {
    return new _YRange(Y5.createRelativePositionFromJSON(json.yanchor), Y5.createRelativePositionFromJSON(json.yhead));
  }
};

// ../node_modules/y-codemirror.next/src/y-sync.js
var Y6 = __toESM(require_yjs(), 1);
var cmState = __toESM(require("@codemirror/state"), 1);
var cmView = __toESM(require("@codemirror/view"), 1);
var YSyncConfig = class {
  constructor(ytext, awareness) {
    this.ytext = ytext;
    this.awareness = awareness;
    this.undoManager = new Y6.UndoManager(ytext);
  }
  /**
   * Helper function to transform an absolute index position to a Yjs-based relative position
   * (https://docs.yjs.dev/api/relative-positions).
   *
   * A relative position can be transformed back to an absolute position even after the document has changed. The position is
   * automatically adapted. This does not require any position transformations. Relative positions are computed based on
   * the internal Yjs document model. Peers that share content through Yjs are guaranteed that their positions will always
   * synced up when using relatve positions.
   *
   * ```js
   * import { ySyncFacet } from 'y-codemirror'
   *
   * ..
   * const ysync = view.state.facet(ySyncFacet)
   * // transform an absolute index position to a ypos
   * const ypos = ysync.getYPos(3)
   * // transform the ypos back to an absolute position
   * ysync.fromYPos(ypos) // => 3
   * ```
   *
   * It cannot be guaranteed that absolute index positions can be synced up between peers.
   * This might lead to undesired behavior when implementing features that require that all peers see the
   * same marked range (e.g. a comment plugin).
   *
   * @param {number} pos
   * @param {number} [assoc]
   */
  toYPos(pos, assoc = 0) {
    return Y6.createRelativePositionFromTypeIndex(this.ytext, pos, assoc);
  }
  /**
   * @param {Y.RelativePosition | Object} rpos
   */
  fromYPos(rpos) {
    const pos = Y6.createAbsolutePositionFromRelativePosition(Y6.createRelativePositionFromJSON(rpos), this.ytext.doc);
    if (pos == null || pos.type !== this.ytext) {
      throw new Error("[y-codemirror] The position you want to retrieve was created by a different document");
    }
    return {
      pos: pos.index,
      assoc: pos.assoc
    };
  }
  /**
   * @param {cmState.SelectionRange} range
   * @return {YRange}
   */
  toYRange(range) {
    const assoc = range.assoc;
    const yanchor = this.toYPos(range.anchor, assoc);
    const yhead = this.toYPos(range.head, assoc);
    return new YRange(yanchor, yhead);
  }
  /**
   * @param {YRange} yrange
   */
  fromYRange(yrange) {
    const anchor = this.fromYPos(yrange.yanchor);
    const head = this.fromYPos(yrange.yhead);
    if (anchor.pos === head.pos) {
      return cmState.EditorSelection.cursor(head.pos, head.assoc);
    }
    return cmState.EditorSelection.range(anchor.pos, head.pos);
  }
};
var ySyncFacet = cmState.Facet.define({
  combine(inputs) {
    return inputs[inputs.length - 1];
  }
});
var ySyncAnnotation = cmState.Annotation.define();
var YSyncPluginValue = class {
  /**
   * @param {cmView.EditorView} view
   */
  constructor(view) {
    this.view = view;
    this.conf = view.state.facet(ySyncFacet);
    this._observer = (event, tr) => {
      if (tr.origin !== this.conf) {
        const delta = event.delta;
        const changes = [];
        let pos = 0;
        for (let i = 0; i < delta.length; i++) {
          const d = delta[i];
          if (d.insert != null) {
            changes.push({ from: pos, to: pos, insert: d.insert });
          } else if (d.delete != null) {
            changes.push({ from: pos, to: pos + d.delete, insert: "" });
            pos += d.delete;
          } else {
            pos += d.retain;
          }
        }
        view.dispatch({ changes, annotations: [ySyncAnnotation.of(this.conf)] });
      }
    };
    this._ytext = this.conf.ytext;
    this._ytext.observe(this._observer);
  }
  /**
   * @param {cmView.ViewUpdate} update
   */
  update(update) {
    if (!update.docChanged || update.transactions.length > 0 && update.transactions[0].annotation(ySyncAnnotation) === this.conf) {
      return;
    }
    const ytext = this.conf.ytext;
    ytext.doc.transact(() => {
      let adj = 0;
      update.changes.iterChanges((fromA, toA, fromB, toB, insert) => {
        const insertText = insert.sliceString(0, insert.length, "\n");
        if (fromA !== toA) {
          ytext.delete(fromA + adj, toA - fromA);
        }
        if (insertText.length > 0) {
          ytext.insert(fromA + adj, insertText);
        }
        adj += insertText.length - (toA - fromA);
      });
    }, this.conf);
  }
  destroy() {
    this._ytext.unobserve(this._observer);
  }
};
var ySync = cmView.ViewPlugin.fromClass(YSyncPluginValue);

// ../node_modules/y-codemirror.next/src/y-remote-selections.js
var cmView2 = __toESM(require("@codemirror/view"), 1);
var cmState2 = __toESM(require("@codemirror/state"), 1);

// ../node_modules/lib0/pair.js
var Pair = class {
  /**
   * @param {L} left
   * @param {R} right
   */
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }
};
var create4 = (left, right) => new Pair(left, right);
var forEach = (arr, f) => arr.forEach((p) => f(p.left, p.right));

// ../node_modules/lib0/prng.js
var bool = (gen) => gen.next() >= 0.5;
var int53 = (gen, min2, max2) => floor(gen.next() * (max2 + 1 - min2) + min2);
var int32 = (gen, min2, max2) => floor(gen.next() * (max2 + 1 - min2) + min2);
var int31 = (gen, min2, max2) => int32(gen, min2, max2);
var letter = (gen) => fromCharCode(int31(gen, 97, 122));
var word = (gen, minLen = 0, maxLen = 20) => {
  const len = int31(gen, minLen, maxLen);
  let str = "";
  for (let i = 0; i < len; i++) {
    str += letter(gen);
  }
  return str;
};
var oneOf = (gen, array) => array[int31(gen, 0, array.length - 1)];

// ../node_modules/lib0/schema.js
var schemaSymbol = Symbol("0schema");
var ValidationError = class {
  constructor() {
    this._rerrs = [];
  }
  /**
   * @param {string?} path
   * @param {string} expected
   * @param {string} has
   * @param {string?} message
   */
  extend(path, expected, has, message = null) {
    this._rerrs.push({ path, expected, has, message });
  }
  toString() {
    const s = [];
    for (let i = this._rerrs.length - 1; i > 0; i--) {
      const r = this._rerrs[i];
      s.push(repeat(" ", (this._rerrs.length - i) * 2) + `${r.path != null ? `[${r.path}] ` : ""}${r.has} doesn't match ${r.expected}. ${r.message}`);
    }
    return s.join("\n");
  }
};
var shapeExtends = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null || a.constructor !== b.constructor) return false;
  if (a[EqualityTraitSymbol]) return equals(a, b);
  if (isArray(a)) {
    return every(
      a,
      (aitem) => some(b, (bitem) => shapeExtends(aitem, bitem))
    );
  } else if (isObject(a)) {
    return every2(
      a,
      (aitem, akey) => shapeExtends(aitem, b[akey])
    );
  }
  return false;
};
var Schema = class {
  // this.shape must not be defined on Schema. Otherwise typecheck on metatypes (e.g. $$object) won't work as expected anymore
  /**
   * If true, the more things are added to the shape the more objects this schema will accept (e.g.
   * union). By default, the more objects are added, the the fewer objects this schema will accept.
   * @protected
   */
  static _dilutes = false;
  /**
   * @param {Schema<any>} other
   */
  extends(other) {
    let [a, b] = [
      /** @type {any} */
      this.shape,
      /** @type {any} */
      other.shape
    ];
    if (
      /** @type {typeof Schema<any>} */
      this.constructor._dilutes
    ) [b, a] = [a, b];
    return shapeExtends(a, b);
  }
  /**
   * Overwrite this when necessary. By default, we only check the `shape` property which every shape
   * should have.
   * @param {Schema<any>} other
   */
  equals(other) {
    return this.constructor === other.constructor && equalityDeep(this.shape, other.shape);
  }
  [schemaSymbol]() {
    return true;
  }
  /**
   * @param {object} other
   */
  [EqualityTraitSymbol](other) {
    return this.equals(
      /** @type {any} */
      other
    );
  }
  /**
   * Use `schema.validate(obj)` with a typed parameter that is already of typed to be an instance of
   * Schema. Validate will check the structure of the parameter and return true iff the instance
   * really is an instance of Schema.
   *
   * @param {T} o
   * @return {boolean}
   */
  validate(o) {
    return this.check(o);
  }
  /* c8 ignore start */
  /**
   * Similar to validate, but this method accepts untyped parameters.
   *
   * @param {any} _o
   * @param {ValidationError} [_err]
   * @return {_o is T}
   */
  check(_o, _err) {
    methodUnimplemented();
  }
  /* c8 ignore stop */
  /**
   * @type {Schema<T?>}
   */
  get nullable() {
    return $union(this, $null);
  }
  /**
   * @type {$Optional<Schema<T>>}
   */
  get optional() {
    return new $Optional(
      /** @type {Schema<T>} */
      this
    );
  }
  /**
   * Cast a variable to a specific type. Returns the casted value, or throws an exception otherwise.
   * Use this if you know that the type is of a specific type and you just want to convince the type
   * system.
   *
   * **Do not rely on these error messages!**
   * Performs an assertion check only if not in a production environment.
   *
   * @template OO
   * @param {OO} o
   * @return {Extract<OO, T> extends never ? T : (OO extends Array<never> ? T : Extract<OO,T>)}
   */
  cast(o) {
    assert(o, this);
    return (
      /** @type {any} */
      o
    );
  }
  /**
   * EXPECTO PATRONUM!! 🪄
   * This function protects against type errors. Though it may not work in the real world.
   *
   * "After all this time?"
   * "Always." - Snape, talking about type safety
   *
   * Ensures that a variable is a a specific type. Returns the value, or throws an exception if the assertion check failed.
   * Use this if you know that the type is of a specific type and you just want to convince the type
   * system.
   *
   * Can be useful when defining lambdas: `s.lambda(s.$number, s.$void).expect((n) => n + 1)`
   *
   * **Do not rely on these error messages!**
   * Performs an assertion check if not in a production environment.
   *
   * @param {T} o
   * @return {o extends T ? T : never}
   */
  expect(o) {
    assert(o, this);
    return o;
  }
};
var $ConstructedBy = class extends Schema {
  /**
   * @param {C} c
   * @param {((o:Instance<C>)=>boolean)|null} check
   */
  constructor(c, check) {
    super();
    this.shape = c;
    this._c = check;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is C extends ((...args:any[]) => infer T) ? T : (C extends (new (...args:any[]) => any) ? InstanceType<C> : never)} o
   */
  check(o, err = void 0) {
    const c = o?.constructor === this.shape && (this._c == null || this._c(o));
    !c && err?.extend(null, this.shape.name, o?.constructor.name, o?.constructor !== this.shape ? "Constructor match failed" : "Check failed");
    return c;
  }
};
var $constructedBy = (c, check = null) => new $ConstructedBy(c, check);
var $$constructedBy = $constructedBy($ConstructedBy);
var $Custom = class extends Schema {
  /**
   * @param {(o:any) => boolean} check
   */
  constructor(check) {
    super();
    this.shape = check;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is any}
   */
  check(o, err) {
    const c = this.shape(o);
    !c && err?.extend(null, "custom prop", o?.constructor.name, "failed to check custom prop");
    return c;
  }
};
var $custom = (check) => new $Custom(check);
var $$custom = $constructedBy($Custom);
var $Literal = class extends Schema {
  /**
   * @param {Array<T>} literals
   */
  constructor(literals) {
    super();
    this.shape = literals;
  }
  /**
   *
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is T}
   */
  check(o, err) {
    const c = this.shape.some((a) => a === o);
    !c && err?.extend(null, this.shape.join(" | "), o.toString());
    return c;
  }
};
var $literal = (...literals) => new $Literal(literals);
var $$literal = $constructedBy($Literal);
var _regexEscape = (
  /** @type {any} */
  RegExp.escape || /** @type {(str:string) => string} */
  ((str) => str.replace(/[().|&,$^[\]]/g, (s) => "\\" + s))
);
var _schemaStringTemplateToRegex = (s) => {
  if ($string.check(s)) {
    return [_regexEscape(s)];
  }
  if ($$literal.check(s)) {
    return (
      /** @type {Array<string|number>} */
      s.shape.map((v) => v + "")
    );
  }
  if ($$number.check(s)) {
    return ["[+-]?\\d+.?\\d*"];
  }
  if ($$string.check(s)) {
    return [".*"];
  }
  if ($$union.check(s)) {
    return s.shape.map(_schemaStringTemplateToRegex).flat(1);
  }
  unexpectedCase();
};
var $StringTemplate = class extends Schema {
  /**
   * @param {T} shape
   */
  constructor(shape) {
    super();
    this.shape = shape;
    this._r = new RegExp("^" + shape.map(_schemaStringTemplateToRegex).map((opts) => `(${opts.join("|")})`).join("") + "$");
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is CastStringTemplateArgsToTemplate<T>}
   */
  check(o, err) {
    const c = this._r.exec(o) != null;
    !c && err?.extend(null, this._r.toString(), o.toString(), "String doesn't match string template.");
    return c;
  }
};
var $$stringTemplate = $constructedBy($StringTemplate);
var isOptionalSymbol = Symbol("optional");
var $Optional = class extends Schema {
  /**
   * @param {S} shape
   */
  constructor(shape) {
    super();
    this.shape = shape;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is (Unwrap<S>|undefined)}
   */
  check(o, err) {
    const c = o === void 0 || this.shape.check(o);
    !c && err?.extend(null, "undefined (optional)", "()");
    return c;
  }
  get [isOptionalSymbol]() {
    return true;
  }
};
var $$optional = $constructedBy($Optional);
var $Never = class extends Schema {
  /**
   * @param {any} _o
   * @param {ValidationError} [err]
   * @return {_o is never}
   */
  check(_o, err) {
    err?.extend(null, "never", typeof _o);
    return false;
  }
};
var $never = new $Never();
var $$never = $constructedBy($Never);
var $Object = class _$Object extends Schema {
  /**
   * @param {S} shape
   * @param {boolean} partial
   */
  constructor(shape, partial = false) {
    super();
    this.shape = shape;
    this._isPartial = partial;
  }
  static _dilutes = true;
  /**
   * @type {Schema<Partial<$ObjectToType<S>>>}
   */
  get partial() {
    return new _$Object(this.shape, true);
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is $ObjectToType<S>}
   */
  check(o, err) {
    if (o == null) {
      err?.extend(null, "object", "null");
      return false;
    }
    return every2(this.shape, (vv, vk) => {
      const c = this._isPartial && !hasProperty(o, vk) || vv.check(o[vk], err);
      !c && err?.extend(vk.toString(), vv.toString(), typeof o[vk], "Object property does not match");
      return c;
    });
  }
};
var $object = (def) => (
  /** @type {any} */
  new $Object(def)
);
var $$object = $constructedBy($Object);
var $objectAny = $custom((o) => o != null && (o.constructor === Object || o.constructor == null));
var $Record = class extends Schema {
  /**
   * @param {Keys} keys
   * @param {Values} values
   */
  constructor(keys2, values) {
    super();
    this.shape = {
      keys: keys2,
      values
    };
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is { [key in Unwrap<Keys>]: Unwrap<Values> }}
   */
  check(o, err) {
    return o != null && every2(o, (vv, vk) => {
      const ck = this.shape.keys.check(vk, err);
      !ck && err?.extend(vk + "", "Record", typeof o, ck ? "Key doesn't match schema" : "Value doesn't match value");
      return ck && this.shape.values.check(vv, err);
    });
  }
};
var $record = (keys2, values) => new $Record(keys2, values);
var $$record = $constructedBy($Record);
var $Tuple = class extends Schema {
  /**
   * @param {S} shape
   */
  constructor(shape) {
    super();
    this.shape = shape;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is { [K in keyof S]: S[K] extends Schema<infer Type> ? Type : never }}
   */
  check(o, err) {
    return o != null && every2(this.shape, (vv, vk) => {
      const c = (
        /** @type {Schema<any>} */
        vv.check(o[vk], err)
      );
      !c && err?.extend(vk.toString(), "Tuple", typeof vv);
      return c;
    });
  }
};
var $tuple = (...def) => new $Tuple(def);
var $$tuple = $constructedBy($Tuple);
var $Array = class extends Schema {
  /**
   * @param {Array<S>} v
   */
  constructor(v) {
    super();
    this.shape = v.length === 1 ? v[0] : new $Union(v);
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Array<S extends Schema<infer T> ? T : never>} o
   */
  check(o, err) {
    const c = isArray(o) && every(o, (oi) => this.shape.check(oi));
    !c && err?.extend(null, "Array", "");
    return c;
  }
};
var $array = (...def) => new $Array(def);
var $$array = $constructedBy($Array);
var $arrayAny = $custom((o) => isArray(o));
var $InstanceOf = class extends Schema {
  /**
   * @param {new (...args:any) => T} constructor
   * @param {((o:T) => boolean)|null} check
   */
  constructor(constructor, check) {
    super();
    this.shape = constructor;
    this._c = check;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is T}
   */
  check(o, err) {
    const c = o instanceof this.shape && (this._c == null || this._c(o));
    !c && err?.extend(null, this.shape.name, o?.constructor.name);
    return c;
  }
};
var $instanceOf = (c, check = null) => new $InstanceOf(c, check);
var $$instanceOf = $constructedBy($InstanceOf);
var $$schema = $instanceOf(Schema);
var $Lambda = class extends Schema {
  /**
   * @param {Args} args
   */
  constructor(args2) {
    super();
    this.len = args2.length - 1;
    this.args = $tuple(...args2.slice(-1));
    this.res = args2[this.len];
  }
  /**
   * @param {any} f
   * @param {ValidationError} err
   * @return {f is _LArgsToLambdaDef<Args>}
   */
  check(f, err) {
    const c = f.constructor === Function && f.length <= this.len;
    !c && err?.extend(null, "function", typeof f);
    return c;
  }
};
var $$lambda = $constructedBy($Lambda);
var $function = $custom((o) => typeof o === "function");
var $Intersection = class extends Schema {
  /**
   * @param {T} v
   */
  constructor(v) {
    super();
    this.shape = v;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Intersect<UnwrapArray<T>>}
   */
  check(o, err) {
    const c = every(this.shape, (check) => check.check(o, err));
    !c && err?.extend(null, "Intersectinon", typeof o);
    return c;
  }
};
var $$intersect = $constructedBy($Intersection, (o) => o.shape.length > 0);
var $Union = class extends Schema {
  static _dilutes = true;
  /**
   * @param {Array<Schema<S>>} v
   */
  constructor(v) {
    super();
    this.shape = v;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is S}
   */
  check(o, err) {
    const c = some(this.shape, (vv) => vv.check(o, err));
    err?.extend(null, "Union", typeof o);
    return c;
  }
};
var $union = (...schemas2) => schemas2.findIndex(($s) => $$union.check($s)) >= 0 ? $union(...schemas2.map(($s) => $($s)).map(($s) => $$union.check($s) ? $s.shape : [$s]).flat(1)) : schemas2.length === 1 ? schemas2[0] : new $Union(schemas2);
var $$union = (
  /** @type {Schema<$Union<any>>} */
  $constructedBy($Union)
);
var _t = () => true;
var $any = $custom(_t);
var $$any = (
  /** @type {Schema<Schema<any>>} */
  $constructedBy($Custom, (o) => o.shape === _t)
);
var $bigint = $custom((o) => typeof o === "bigint");
var $$bigint = (
  /** @type {Schema<Schema<BigInt>>} */
  $custom((o) => o === $bigint)
);
var $symbol = $custom((o) => typeof o === "symbol");
var $$symbol = (
  /** @type {Schema<Schema<Symbol>>} */
  $custom((o) => o === $symbol)
);
var $number = $custom((o) => typeof o === "number");
var $$number = (
  /** @type {Schema<Schema<number>>} */
  $custom((o) => o === $number)
);
var $string = $custom((o) => typeof o === "string");
var $$string = (
  /** @type {Schema<Schema<string>>} */
  $custom((o) => o === $string)
);
var $boolean = $custom((o) => typeof o === "boolean");
var $$boolean = (
  /** @type {Schema<Schema<Boolean>>} */
  $custom((o) => o === $boolean)
);
var $undefined = $literal(void 0);
var $$undefined = (
  /** @type {Schema<Schema<undefined>>} */
  $constructedBy($Literal, (o) => o.shape.length === 1 && o.shape[0] === void 0)
);
var $void = $literal(void 0);
var $null = $literal(null);
var $$null = (
  /** @type {Schema<Schema<null>>} */
  $constructedBy($Literal, (o) => o.shape.length === 1 && o.shape[0] === null)
);
var $uint8Array = $constructedBy(Uint8Array);
var $$uint8Array = (
  /** @type {Schema<Schema<Uint8Array>>} */
  $constructedBy($ConstructedBy, (o) => o.shape === Uint8Array)
);
var $primitive = $union($number, $string, $null, $undefined, $bigint, $boolean, $symbol);
var $json = (() => {
  const $jsonArr = (
    /** @type {$Array<$any>} */
    $array($any)
  );
  const $jsonRecord = (
    /** @type {$Record<$string,$any>} */
    $record($string, $any)
  );
  const $json2 = $union($number, $string, $null, $boolean, $jsonArr, $jsonRecord);
  $jsonArr.shape = $json2;
  $jsonRecord.shape.values = $json2;
  return $json2;
})();
var $ = (o) => {
  if ($$schema.check(o)) {
    return (
      /** @type {any} */
      o
    );
  } else if ($objectAny.check(o)) {
    const o2 = {};
    for (const k in o) {
      o2[k] = $(o[k]);
    }
    return (
      /** @type {any} */
      $object(o2)
    );
  } else if ($arrayAny.check(o)) {
    return (
      /** @type {any} */
      $union(...o.map($))
    );
  } else if ($primitive.check(o)) {
    return (
      /** @type {any} */
      $literal(o)
    );
  } else if ($function.check(o)) {
    return (
      /** @type {any} */
      $constructedBy(
        /** @type {any} */
        o
      )
    );
  }
  unexpectedCase();
};
var assert = production ? () => {
} : (o, schema4) => {
  const err = new ValidationError();
  if (!schema4.check(o, err)) {
    throw create3(`Expected value to be of type ${schema4.constructor.name}.
${err.toString()}`);
  }
};
var PatternMatcher = class {
  /**
   * @param {Schema<State>} [$state]
   */
  constructor($state) {
    this.patterns = [];
    this.$state = $state;
  }
  /**
   * @template P
   * @template R
   * @param {P} pattern
   * @param {(o:NoInfer<Unwrap<ReadSchema<P>>>,s:State)=>R} handler
   * @return {PatternMatcher<State,Patterns|Pattern<Unwrap<ReadSchema<P>>,R>>}
   */
  if(pattern, handler) {
    this.patterns.push({ if: $(pattern), h: handler });
    return this;
  }
  /**
   * @template R
   * @param {(o:any,s:State)=>R} h
   */
  else(h) {
    return this.if($any, h);
  }
  /**
   * @return {State extends undefined
   *   ? <In extends Unwrap<Patterns['if']>>(o:In,state?:undefined)=>PatternMatchResult<Patterns,In>
   *   : <In extends Unwrap<Patterns['if']>>(o:In,state:State)=>PatternMatchResult<Patterns,In>}
   */
  done() {
    return (
      /** @type {any} */
      (o, s) => {
        for (let i = 0; i < this.patterns.length; i++) {
          const p = this.patterns[i];
          if (p.if.check(o)) {
            return p.h(o, s);
          }
        }
        throw create3("Unhandled pattern");
      }
    );
  }
};
var match = (state) => new PatternMatcher(
  /** @type {any} */
  state
);
var _random = (
  /** @type {any} */
  match(
    /** @type {Schema<prng.PRNG>} */
    $any
  ).if($$number, (_o, gen) => int53(gen, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER)).if($$string, (_o, gen) => word(gen)).if($$boolean, (_o, gen) => bool(gen)).if($$bigint, (_o, gen) => BigInt(int53(gen, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER))).if($$union, (o, gen) => random(gen, oneOf(gen, o.shape))).if($$object, (o, gen) => {
    const res = {};
    for (const k in o.shape) {
      let prop = o.shape[k];
      if ($$optional.check(prop)) {
        if (bool(gen)) {
          continue;
        }
        prop = prop.shape;
      }
      res[k] = _random(prop, gen);
    }
    return res;
  }).if($$array, (o, gen) => {
    const arr = [];
    const n = int32(gen, 0, 42);
    for (let i = 0; i < n; i++) {
      arr.push(random(gen, o.shape));
    }
    return arr;
  }).if($$literal, (o, gen) => {
    return oneOf(gen, o.shape);
  }).if($$null, (o, gen) => {
    return null;
  }).if($$lambda, (o, gen) => {
    const res = random(gen, o.res);
    return () => res;
  }).if($$any, (o, gen) => random(gen, oneOf(gen, [
    $number,
    $string,
    $null,
    $undefined,
    $bigint,
    $boolean,
    $array($number),
    $record($union("a", "b", "c"), $number)
  ]))).if($$record, (o, gen) => {
    const res = {};
    const keysN = int53(gen, 0, 3);
    for (let i = 0; i < keysN; i++) {
      const key = random(gen, o.shape.keys);
      const val = random(gen, o.shape.values);
      res[key] = val;
    }
    return res;
  }).done()
);
var random = (gen, schema4) => (
  /** @type {any} */
  _random($(schema4), gen)
);

// ../node_modules/lib0/dom.js
var doc = (
  /** @type {Document} */
  typeof document !== "undefined" ? document : {}
);
var createElement = (name) => doc.createElement(name);
var createDocumentFragment = () => doc.createDocumentFragment();
var $fragment = $custom((el) => el.nodeType === DOCUMENT_FRAGMENT_NODE);
var createTextNode = (text2) => doc.createTextNode(text2);
var domParser = (
  /** @type {DOMParser} */
  typeof DOMParser !== "undefined" ? new DOMParser() : null
);
var setAttributes = (el, attrs) => {
  forEach(attrs, (key, value) => {
    if (value === false) {
      el.removeAttribute(key);
    } else if (value === true) {
      el.setAttribute(key, "");
    } else {
      el.setAttribute(key, value);
    }
  });
  return el;
};
var fragment = (children) => {
  const fragment2 = createDocumentFragment();
  for (let i = 0; i < children.length; i++) {
    appendChild(fragment2, children[i]);
  }
  return fragment2;
};
var append = (parent, nodes) => {
  appendChild(parent, fragment(nodes));
  return parent;
};
var element = (name, attrs = [], children = []) => append(setAttributes(createElement(name), attrs), children);
var $element = $custom((el) => el.nodeType === ELEMENT_NODE);
var text = createTextNode;
var $text = $custom((el) => el.nodeType === TEXT_NODE);
var appendChild = (parent, child) => parent.appendChild(child);
var ELEMENT_NODE = doc.ELEMENT_NODE;
var TEXT_NODE = doc.TEXT_NODE;
var CDATA_SECTION_NODE = doc.CDATA_SECTION_NODE;
var COMMENT_NODE = doc.COMMENT_NODE;
var DOCUMENT_NODE = doc.DOCUMENT_NODE;
var DOCUMENT_TYPE_NODE = doc.DOCUMENT_TYPE_NODE;
var DOCUMENT_FRAGMENT_NODE = doc.DOCUMENT_FRAGMENT_NODE;
var $node = $custom((el) => el.nodeType === DOCUMENT_NODE);

// ../node_modules/y-codemirror.next/src/y-remote-selections.js
var Y7 = __toESM(require_yjs(), 1);
var yRemoteSelectionsTheme = cmView2.EditorView.baseTheme({
  ".cm-ySelection": {},
  ".cm-yLineSelection": {
    padding: 0,
    margin: "0px 2px 0px 4px"
  },
  ".cm-ySelectionCaret": {
    position: "relative",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    marginLeft: "-1px",
    marginRight: "-1px",
    boxSizing: "border-box",
    display: "inline"
  },
  ".cm-ySelectionCaretDot": {
    borderRadius: "50%",
    position: "absolute",
    width: ".4em",
    height: ".4em",
    top: "-.2em",
    left: "-.2em",
    backgroundColor: "inherit",
    transition: "transform .3s ease-in-out",
    boxSizing: "border-box"
  },
  ".cm-ySelectionCaret:hover > .cm-ySelectionCaretDot": {
    transformOrigin: "bottom center",
    transform: "scale(0)"
  },
  ".cm-ySelectionInfo": {
    position: "absolute",
    top: "-1.05em",
    left: "-1px",
    fontSize: ".75em",
    fontFamily: "serif",
    fontStyle: "normal",
    fontWeight: "normal",
    lineHeight: "normal",
    userSelect: "none",
    color: "white",
    paddingLeft: "2px",
    paddingRight: "2px",
    zIndex: 101,
    transition: "opacity .3s ease-in-out",
    backgroundColor: "inherit",
    // these should be separate
    opacity: 0,
    transitionDelay: "0s",
    whiteSpace: "nowrap"
  },
  ".cm-ySelectionCaret:hover > .cm-ySelectionInfo": {
    opacity: 1,
    transitionDelay: "0s"
  }
});
var yRemoteSelectionsAnnotation = cmState2.Annotation.define();
var YRemoteCaretWidget = class extends cmView2.WidgetType {
  /**
   * @param {string} color
   * @param {string} name
   */
  constructor(color, name) {
    super();
    this.color = color;
    this.name = name;
  }
  toDOM() {
    return (
      /** @type {HTMLElement} */
      element("span", [create4("class", "cm-ySelectionCaret"), create4("style", `background-color: ${this.color}; border-color: ${this.color}`)], [
        text("\u2060"),
        element("div", [
          create4("class", "cm-ySelectionCaretDot")
        ]),
        text("\u2060"),
        element("div", [
          create4("class", "cm-ySelectionInfo")
        ], [
          text(this.name)
        ]),
        text("\u2060")
      ])
    );
  }
  eq(widget) {
    return widget.color === this.color;
  }
  compare(widget) {
    return widget.color === this.color;
  }
  updateDOM() {
    return false;
  }
  get estimatedHeight() {
    return -1;
  }
  ignoreEvent() {
    return true;
  }
};
var YRemoteSelectionsPluginValue = class {
  /**
   * @param {cmView.EditorView} view
   */
  constructor(view) {
    this.conf = view.state.facet(ySyncFacet);
    this._listener = ({ added, updated, removed }, s, t2) => {
      const clients = added.concat(updated).concat(removed);
      if (clients.findIndex((id) => id !== this.conf.awareness.doc.clientID) >= 0) {
        view.dispatch({ annotations: [yRemoteSelectionsAnnotation.of([])] });
      }
    };
    this._awareness = this.conf.awareness;
    this._awareness.on("change", this._listener);
    this.decorations = cmState2.RangeSet.of([]);
  }
  destroy() {
    this._awareness.off("change", this._listener);
  }
  /**
   * @param {cmView.ViewUpdate} update
   */
  update(update) {
    const ytext = this.conf.ytext;
    const ydoc = (
      /** @type {Y.Doc} */
      ytext.doc
    );
    const awareness = this.conf.awareness;
    const decorations = [];
    const localAwarenessState = this.conf.awareness.getLocalState();
    if (localAwarenessState != null) {
      const hasFocus = update.view.hasFocus && update.view.dom.ownerDocument.hasFocus();
      const sel = hasFocus ? update.state.selection.main : null;
      const currentAnchor = localAwarenessState.cursor == null ? null : Y7.createRelativePositionFromJSON(localAwarenessState.cursor.anchor);
      const currentHead = localAwarenessState.cursor == null ? null : Y7.createRelativePositionFromJSON(localAwarenessState.cursor.head);
      if (sel != null) {
        const anchor = Y7.createRelativePositionFromTypeIndex(ytext, sel.anchor);
        const head = Y7.createRelativePositionFromTypeIndex(ytext, sel.head);
        if (localAwarenessState.cursor == null || !Y7.compareRelativePositions(currentAnchor, anchor) || !Y7.compareRelativePositions(currentHead, head)) {
          awareness.setLocalStateField("cursor", {
            anchor,
            head
          });
        }
      } else if (localAwarenessState.cursor != null && hasFocus) {
        awareness.setLocalStateField("cursor", null);
      }
    }
    awareness.getStates().forEach((state, clientid) => {
      if (clientid === awareness.doc.clientID) {
        return;
      }
      const cursor = state.cursor;
      if (cursor == null || cursor.anchor == null || cursor.head == null) {
        return;
      }
      const anchor = Y7.createAbsolutePositionFromRelativePosition(cursor.anchor, ydoc);
      const head = Y7.createAbsolutePositionFromRelativePosition(cursor.head, ydoc);
      if (anchor == null || head == null || anchor.type !== ytext || head.type !== ytext) {
        return;
      }
      const { color = "#30bced", name = "Anonymous" } = state.user || {};
      const colorLight = state.user && state.user.colorLight || color + "33";
      const start = min(anchor.index, head.index);
      const end = max(anchor.index, head.index);
      const startLine = update.view.state.doc.lineAt(start);
      const endLine = update.view.state.doc.lineAt(end);
      if (startLine.number === endLine.number) {
        decorations.push({
          from: start,
          to: end,
          value: cmView2.Decoration.mark({
            attributes: { style: `background-color: ${colorLight}` },
            class: "cm-ySelection"
          })
        });
      } else {
        decorations.push({
          from: start,
          to: startLine.from + startLine.length,
          value: cmView2.Decoration.mark({
            attributes: { style: `background-color: ${colorLight}` },
            class: "cm-ySelection"
          })
        });
        decorations.push({
          from: endLine.from,
          to: end,
          value: cmView2.Decoration.mark({
            attributes: { style: `background-color: ${colorLight}` },
            class: "cm-ySelection"
          })
        });
        for (let i = startLine.number + 1; i < endLine.number; i++) {
          const linePos = update.view.state.doc.line(i).from;
          decorations.push({
            from: linePos,
            to: linePos,
            value: cmView2.Decoration.line({
              attributes: { style: `background-color: ${colorLight}`, class: "cm-yLineSelection" }
            })
          });
        }
      }
      decorations.push({
        from: head.index,
        to: head.index,
        value: cmView2.Decoration.widget({
          side: head.index - anchor.index > 0 ? -1 : 1,
          // the local cursor should be rendered outside the remote selection
          block: false,
          widget: new YRemoteCaretWidget(color, name)
        })
      });
    });
    this.decorations = cmView2.Decoration.set(decorations, true);
  }
};
var yRemoteSelections = cmView2.ViewPlugin.fromClass(YRemoteSelectionsPluginValue, {
  decorations: (v) => v.decorations
});

// ../node_modules/y-codemirror.next/src/y-undomanager.js
var Y8 = __toESM(require_yjs(), 1);
var cmState3 = __toESM(require("@codemirror/state"), 1);
var cmView3 = __toESM(require("@codemirror/view"), 1);

// ../node_modules/lib0/mutex.js
var createMutex = () => {
  let token = true;
  return (f, g) => {
    if (token) {
      token = false;
      try {
        f();
      } finally {
        token = true;
      }
    } else if (g !== void 0) {
      g();
    }
  };
};

// ../node_modules/y-codemirror.next/src/y-undomanager.js
var YUndoManagerConfig = class {
  /**
   * @param {Y.UndoManager} undoManager
   */
  constructor(undoManager) {
    this.undoManager = undoManager;
  }
  /**
   * @param {any} origin
   */
  addTrackedOrigin(origin) {
    this.undoManager.addTrackedOrigin(origin);
  }
  /**
   * @param {any} origin
   */
  removeTrackedOrigin(origin) {
    this.undoManager.removeTrackedOrigin(origin);
  }
  /**
   * @return {boolean} Whether a change was undone.
   */
  undo() {
    return this.undoManager.undo() != null;
  }
  /**
   * @return {boolean} Whether a change was redone.
   */
  redo() {
    return this.undoManager.redo() != null;
  }
};
var yUndoManagerFacet = cmState3.Facet.define({
  combine(inputs) {
    return inputs[inputs.length - 1];
  }
});
var yUndoManagerAnnotation = cmState3.Annotation.define();
var YUndoManagerPluginValue = class {
  /**
   * @param {cmView.EditorView} view
   */
  constructor(view) {
    this.view = view;
    this.conf = view.state.facet(yUndoManagerFacet);
    this._undoManager = this.conf.undoManager;
    this.syncConf = view.state.facet(ySyncFacet);
    this._beforeChangeSelection = null;
    this._mux = createMutex();
    this._onStackItemAdded = ({ stackItem, changedParentTypes }) => {
      if (changedParentTypes.has(this.syncConf.ytext) && this._beforeChangeSelection && !stackItem.meta.has(this)) {
        stackItem.meta.set(this, this._beforeChangeSelection);
      }
    };
    this._onStackItemPopped = ({ stackItem }) => {
      const sel = stackItem.meta.get(this);
      if (sel) {
        const selection = this.syncConf.fromYRange(sel);
        view.dispatch(view.state.update({
          selection,
          effects: [cmView3.EditorView.scrollIntoView(selection)]
        }));
        this._storeSelection();
      }
    };
    this._storeSelection = () => {
      this._beforeChangeSelection = this.syncConf.toYRange(this.view.state.selection.main);
    };
    this._undoManager.on("stack-item-added", this._onStackItemAdded);
    this._undoManager.on("stack-item-popped", this._onStackItemPopped);
    this._undoManager.addTrackedOrigin(this.syncConf);
  }
  /**
   * @param {cmView.ViewUpdate} update
   */
  update(update) {
    if (update.selectionSet && (update.transactions.length === 0 || update.transactions[0].annotation(ySyncAnnotation) !== this.syncConf)) {
      this._storeSelection();
    }
  }
  destroy() {
    this._undoManager.off("stack-item-added", this._onStackItemAdded);
    this._undoManager.off("stack-item-popped", this._onStackItemPopped);
    this._undoManager.removeTrackedOrigin(this.syncConf);
  }
};
var yUndoManager = cmView3.ViewPlugin.fromClass(YUndoManagerPluginValue);
var undo = ({ state, dispatch }) => state.facet(yUndoManagerFacet).undo() || true;
var redo = ({ state, dispatch }) => state.facet(yUndoManagerFacet).redo() || true;

// ../node_modules/y-codemirror.next/src/index.js
var yCollab = (ytext, awareness, { undoManager = new Y9.UndoManager(ytext) } = {}) => {
  const ySyncConfig = new YSyncConfig(ytext, awareness);
  const plugins = [
    ySyncFacet.of(ySyncConfig),
    ySync
  ];
  if (awareness) {
    plugins.push(
      yRemoteSelectionsTheme,
      yRemoteSelections
    );
  }
  if (undoManager !== false) {
    plugins.push(
      yUndoManagerFacet.of(new YUndoManagerConfig(undoManager)),
      yUndoManager,
      cmView4.EditorView.domEventHandlers({
        beforeinput(e, view) {
          if (e.inputType === "historyUndo") return undo(view);
          if (e.inputType === "historyRedo") return redo(view);
          return false;
        }
      })
    );
  }
  return plugins;
};

// src/applyMinimalYTextEdit.ts
var applyMinimalYTextEdit = (doc2, yText, before, after, origin) => {
  if (before === after) return;
  let start = 0;
  const minLen = Math.min(before.length, after.length);
  while (start < minLen && before[start] === after[start]) start += 1;
  let endA = before.length;
  let endB = after.length;
  while (endA > start && endB > start && before[endA - 1] === after[endB - 1]) {
    endA -= 1;
    endB -= 1;
  }
  const del = endA - start;
  const insert = after.slice(start, endB);
  doc2.transact(() => {
    if (del > 0) yText.delete(start, del);
    if (insert.length > 0) yText.insert(start, insert);
  }, origin);
};

// src/codemirrorBinding.ts
var import_state = require("@codemirror/state");
var import_view = require("@codemirror/view");
var import_obsidian = require("obsidian");

// ../packages/collab-note/dist/frontmatter.js
var getFrontmatterPrefixLength = (raw) => {
  let start = 0;
  if (raw.startsWith("\uFEFF"))
    start = 1;
  if (!raw.startsWith("---", start)) {
    return null;
  }
  let i = start + 3;
  if (raw[i] === "\r")
    i += 1;
  if (raw[i] !== "\n") {
    return null;
  }
  i += 1;
  while (i < raw.length) {
    const lineStart = i;
    let j = i;
    while (j < raw.length && raw[j] !== "\n" && raw[j] !== "\r")
      j += 1;
    const line = raw.slice(lineStart, j);
    if (raw[j] === "\r")
      j += 1;
    if (raw[j] === "\n")
      j += 1;
    const lineNorm = line.replace(/\r+$/g, "").trim();
    if (lineNorm === "---" || lineNorm === "...") {
      return j;
    }
    i = j;
  }
  return null;
};

// ../node_modules/yaml/browser/dist/index.js
var dist_exports = {};
__export(dist_exports, {
  Alias: () => Alias,
  CST: () => cst_exports,
  Composer: () => Composer,
  Document: () => Document,
  Lexer: () => Lexer,
  LineCounter: () => LineCounter,
  Pair: () => Pair2,
  Parser: () => Parser,
  Scalar: () => Scalar,
  Schema: () => Schema2,
  YAMLError: () => YAMLError,
  YAMLMap: () => YAMLMap,
  YAMLParseError: () => YAMLParseError,
  YAMLSeq: () => YAMLSeq,
  YAMLWarning: () => YAMLWarning,
  isAlias: () => isAlias,
  isCollection: () => isCollection,
  isDocument: () => isDocument,
  isMap: () => isMap,
  isNode: () => isNode2,
  isPair: () => isPair,
  isScalar: () => isScalar,
  isSeq: () => isSeq,
  parse: () => parse,
  parseAllDocuments: () => parseAllDocuments,
  parseDocument: () => parseDocument,
  stringify: () => stringify3,
  visit: () => visit,
  visitAsync: () => visitAsync
});

// ../node_modules/yaml/browser/dist/nodes/identity.js
var ALIAS = Symbol.for("yaml.alias");
var DOC = Symbol.for("yaml.document");
var MAP = Symbol.for("yaml.map");
var PAIR = Symbol.for("yaml.pair");
var SCALAR = Symbol.for("yaml.scalar");
var SEQ = Symbol.for("yaml.seq");
var NODE_TYPE = Symbol.for("yaml.node.type");
var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
function isCollection(node) {
  if (node && typeof node === "object")
    switch (node[NODE_TYPE]) {
      case MAP:
      case SEQ:
        return true;
    }
  return false;
}
function isNode2(node) {
  if (node && typeof node === "object")
    switch (node[NODE_TYPE]) {
      case ALIAS:
      case MAP:
      case SCALAR:
      case SEQ:
        return true;
    }
  return false;
}
var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;

// ../node_modules/yaml/browser/dist/visit.js
var BREAK = Symbol("break visit");
var SKIP = Symbol("skip children");
var REMOVE = Symbol("remove node");
function visit(node, visitor) {
  const visitor_ = initVisitor(visitor);
  if (isDocument(node)) {
    const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
    if (cd === REMOVE)
      node.contents = null;
  } else
    visit_(null, node, visitor_, Object.freeze([]));
}
visit.BREAK = BREAK;
visit.SKIP = SKIP;
visit.REMOVE = REMOVE;
function visit_(key, node, visitor, path) {
  const ctrl = callVisitor(key, node, visitor, path);
  if (isNode2(ctrl) || isPair(ctrl)) {
    replaceNode(key, path, ctrl);
    return visit_(key, ctrl, visitor, path);
  }
  if (typeof ctrl !== "symbol") {
    if (isCollection(node)) {
      path = Object.freeze(path.concat(node));
      for (let i = 0; i < node.items.length; ++i) {
        const ci = visit_(i, node.items[i], visitor, path);
        if (typeof ci === "number")
          i = ci - 1;
        else if (ci === BREAK)
          return BREAK;
        else if (ci === REMOVE) {
          node.items.splice(i, 1);
          i -= 1;
        }
      }
    } else if (isPair(node)) {
      path = Object.freeze(path.concat(node));
      const ck = visit_("key", node.key, visitor, path);
      if (ck === BREAK)
        return BREAK;
      else if (ck === REMOVE)
        node.key = null;
      const cv = visit_("value", node.value, visitor, path);
      if (cv === BREAK)
        return BREAK;
      else if (cv === REMOVE)
        node.value = null;
    }
  }
  return ctrl;
}
async function visitAsync(node, visitor) {
  const visitor_ = initVisitor(visitor);
  if (isDocument(node)) {
    const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
    if (cd === REMOVE)
      node.contents = null;
  } else
    await visitAsync_(null, node, visitor_, Object.freeze([]));
}
visitAsync.BREAK = BREAK;
visitAsync.SKIP = SKIP;
visitAsync.REMOVE = REMOVE;
async function visitAsync_(key, node, visitor, path) {
  const ctrl = await callVisitor(key, node, visitor, path);
  if (isNode2(ctrl) || isPair(ctrl)) {
    replaceNode(key, path, ctrl);
    return visitAsync_(key, ctrl, visitor, path);
  }
  if (typeof ctrl !== "symbol") {
    if (isCollection(node)) {
      path = Object.freeze(path.concat(node));
      for (let i = 0; i < node.items.length; ++i) {
        const ci = await visitAsync_(i, node.items[i], visitor, path);
        if (typeof ci === "number")
          i = ci - 1;
        else if (ci === BREAK)
          return BREAK;
        else if (ci === REMOVE) {
          node.items.splice(i, 1);
          i -= 1;
        }
      }
    } else if (isPair(node)) {
      path = Object.freeze(path.concat(node));
      const ck = await visitAsync_("key", node.key, visitor, path);
      if (ck === BREAK)
        return BREAK;
      else if (ck === REMOVE)
        node.key = null;
      const cv = await visitAsync_("value", node.value, visitor, path);
      if (cv === BREAK)
        return BREAK;
      else if (cv === REMOVE)
        node.value = null;
    }
  }
  return ctrl;
}
function initVisitor(visitor) {
  if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
    return Object.assign({
      Alias: visitor.Node,
      Map: visitor.Node,
      Scalar: visitor.Node,
      Seq: visitor.Node
    }, visitor.Value && {
      Map: visitor.Value,
      Scalar: visitor.Value,
      Seq: visitor.Value
    }, visitor.Collection && {
      Map: visitor.Collection,
      Seq: visitor.Collection
    }, visitor);
  }
  return visitor;
}
function callVisitor(key, node, visitor, path) {
  if (typeof visitor === "function")
    return visitor(key, node, path);
  if (isMap(node))
    return visitor.Map?.(key, node, path);
  if (isSeq(node))
    return visitor.Seq?.(key, node, path);
  if (isPair(node))
    return visitor.Pair?.(key, node, path);
  if (isScalar(node))
    return visitor.Scalar?.(key, node, path);
  if (isAlias(node))
    return visitor.Alias?.(key, node, path);
  return void 0;
}
function replaceNode(key, path, node) {
  const parent = path[path.length - 1];
  if (isCollection(parent)) {
    parent.items[key] = node;
  } else if (isPair(parent)) {
    if (key === "key")
      parent.key = node;
    else
      parent.value = node;
  } else if (isDocument(parent)) {
    parent.contents = node;
  } else {
    const pt = isAlias(parent) ? "alias" : "scalar";
    throw new Error(`Cannot replace node with ${pt} parent`);
  }
}

// ../node_modules/yaml/browser/dist/doc/directives.js
var escapeChars = {
  "!": "%21",
  ",": "%2C",
  "[": "%5B",
  "]": "%5D",
  "{": "%7B",
  "}": "%7D"
};
var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
var Directives = class _Directives {
  constructor(yaml, tags) {
    this.docStart = null;
    this.docEnd = false;
    this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
    this.tags = Object.assign({}, _Directives.defaultTags, tags);
  }
  clone() {
    const copy = new _Directives(this.yaml, this.tags);
    copy.docStart = this.docStart;
    return copy;
  }
  /**
   * During parsing, get a Directives instance for the current document and
   * update the stream state according to the current version's spec.
   */
  atDocument() {
    const res = new _Directives(this.yaml, this.tags);
    switch (this.yaml.version) {
      case "1.1":
        this.atNextDocument = true;
        break;
      case "1.2":
        this.atNextDocument = false;
        this.yaml = {
          explicit: _Directives.defaultYaml.explicit,
          version: "1.2"
        };
        this.tags = Object.assign({}, _Directives.defaultTags);
        break;
    }
    return res;
  }
  /**
   * @param onError - May be called even if the action was successful
   * @returns `true` on success
   */
  add(line, onError) {
    if (this.atNextDocument) {
      this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
      this.tags = Object.assign({}, _Directives.defaultTags);
      this.atNextDocument = false;
    }
    const parts = line.trim().split(/[ \t]+/);
    const name = parts.shift();
    switch (name) {
      case "%TAG": {
        if (parts.length !== 2) {
          onError(0, "%TAG directive should contain exactly two parts");
          if (parts.length < 2)
            return false;
        }
        const [handle, prefix] = parts;
        this.tags[handle] = prefix;
        return true;
      }
      case "%YAML": {
        this.yaml.explicit = true;
        if (parts.length !== 1) {
          onError(0, "%YAML directive should contain exactly one part");
          return false;
        }
        const [version] = parts;
        if (version === "1.1" || version === "1.2") {
          this.yaml.version = version;
          return true;
        } else {
          const isValid = /^\d+\.\d+$/.test(version);
          onError(6, `Unsupported YAML version ${version}`, isValid);
          return false;
        }
      }
      default:
        onError(0, `Unknown directive ${name}`, true);
        return false;
    }
  }
  /**
   * Resolves a tag, matching handles to those defined in %TAG directives.
   *
   * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
   *   `'!local'` tag, or `null` if unresolvable.
   */
  tagName(source, onError) {
    if (source === "!")
      return "!";
    if (source[0] !== "!") {
      onError(`Not a valid tag: ${source}`);
      return null;
    }
    if (source[1] === "<") {
      const verbatim = source.slice(2, -1);
      if (verbatim === "!" || verbatim === "!!") {
        onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
        return null;
      }
      if (source[source.length - 1] !== ">")
        onError("Verbatim tags must end with a >");
      return verbatim;
    }
    const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
    if (!suffix)
      onError(`The ${source} tag has no suffix`);
    const prefix = this.tags[handle];
    if (prefix) {
      try {
        return prefix + decodeURIComponent(suffix);
      } catch (error) {
        onError(String(error));
        return null;
      }
    }
    if (handle === "!")
      return source;
    onError(`Could not resolve tag: ${source}`);
    return null;
  }
  /**
   * Given a fully resolved tag, returns its printable string form,
   * taking into account current tag prefixes and defaults.
   */
  tagString(tag) {
    for (const [handle, prefix] of Object.entries(this.tags)) {
      if (tag.startsWith(prefix))
        return handle + escapeTagName(tag.substring(prefix.length));
    }
    return tag[0] === "!" ? tag : `!<${tag}>`;
  }
  toString(doc2) {
    const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
    const tagEntries = Object.entries(this.tags);
    let tagNames;
    if (doc2 && tagEntries.length > 0 && isNode2(doc2.contents)) {
      const tags = {};
      visit(doc2.contents, (_key, node) => {
        if (isNode2(node) && node.tag)
          tags[node.tag] = true;
      });
      tagNames = Object.keys(tags);
    } else
      tagNames = [];
    for (const [handle, prefix] of tagEntries) {
      if (handle === "!!" && prefix === "tag:yaml.org,2002:")
        continue;
      if (!doc2 || tagNames.some((tn) => tn.startsWith(prefix)))
        lines.push(`%TAG ${handle} ${prefix}`);
    }
    return lines.join("\n");
  }
};
Directives.defaultYaml = { explicit: false, version: "1.2" };
Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };

// ../node_modules/yaml/browser/dist/doc/anchors.js
function anchorIsValid(anchor) {
  if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
    const sa = JSON.stringify(anchor);
    const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
    throw new Error(msg);
  }
  return true;
}
function anchorNames(root) {
  const anchors = /* @__PURE__ */ new Set();
  visit(root, {
    Value(_key, node) {
      if (node.anchor)
        anchors.add(node.anchor);
    }
  });
  return anchors;
}
function findNewAnchor(prefix, exclude) {
  for (let i = 1; true; ++i) {
    const name = `${prefix}${i}`;
    if (!exclude.has(name))
      return name;
  }
}
function createNodeAnchors(doc2, prefix) {
  const aliasObjects = [];
  const sourceObjects = /* @__PURE__ */ new Map();
  let prevAnchors = null;
  return {
    onAnchor: (source) => {
      aliasObjects.push(source);
      prevAnchors ?? (prevAnchors = anchorNames(doc2));
      const anchor = findNewAnchor(prefix, prevAnchors);
      prevAnchors.add(anchor);
      return anchor;
    },
    /**
     * With circular references, the source node is only resolved after all
     * of its child nodes are. This is why anchors are set only after all of
     * the nodes have been created.
     */
    setAnchors: () => {
      for (const source of aliasObjects) {
        const ref = sourceObjects.get(source);
        if (typeof ref === "object" && ref.anchor && (isScalar(ref.node) || isCollection(ref.node))) {
          ref.node.anchor = ref.anchor;
        } else {
          const error = new Error("Failed to resolve repeated object (this should not happen)");
          error.source = source;
          throw error;
        }
      }
    },
    sourceObjects
  };
}

// ../node_modules/yaml/browser/dist/doc/applyReviver.js
function applyReviver(reviver, obj, key, val) {
  if (val && typeof val === "object") {
    if (Array.isArray(val)) {
      for (let i = 0, len = val.length; i < len; ++i) {
        const v0 = val[i];
        const v1 = applyReviver(reviver, val, String(i), v0);
        if (v1 === void 0)
          delete val[i];
        else if (v1 !== v0)
          val[i] = v1;
      }
    } else if (val instanceof Map) {
      for (const k of Array.from(val.keys())) {
        const v0 = val.get(k);
        const v1 = applyReviver(reviver, val, k, v0);
        if (v1 === void 0)
          val.delete(k);
        else if (v1 !== v0)
          val.set(k, v1);
      }
    } else if (val instanceof Set) {
      for (const v0 of Array.from(val)) {
        const v1 = applyReviver(reviver, val, v0, v0);
        if (v1 === void 0)
          val.delete(v0);
        else if (v1 !== v0) {
          val.delete(v0);
          val.add(v1);
        }
      }
    } else {
      for (const [k, v0] of Object.entries(val)) {
        const v1 = applyReviver(reviver, val, k, v0);
        if (v1 === void 0)
          delete val[k];
        else if (v1 !== v0)
          val[k] = v1;
      }
    }
  }
  return reviver.call(obj, key, val);
}

// ../node_modules/yaml/browser/dist/nodes/toJS.js
function toJS(value, arg, ctx) {
  if (Array.isArray(value))
    return value.map((v, i) => toJS(v, String(i), ctx));
  if (value && typeof value.toJSON === "function") {
    if (!ctx || !hasAnchor(value))
      return value.toJSON(arg, ctx);
    const data = { aliasCount: 0, count: 1, res: void 0 };
    ctx.anchors.set(value, data);
    ctx.onCreate = (res2) => {
      data.res = res2;
      delete ctx.onCreate;
    };
    const res = value.toJSON(arg, ctx);
    if (ctx.onCreate)
      ctx.onCreate(res);
    return res;
  }
  if (typeof value === "bigint" && !ctx?.keep)
    return Number(value);
  return value;
}

// ../node_modules/yaml/browser/dist/nodes/Node.js
var NodeBase = class {
  constructor(type) {
    Object.defineProperty(this, NODE_TYPE, { value: type });
  }
  /** Create a copy of this node.  */
  clone() {
    const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    if (this.range)
      copy.range = this.range.slice();
    return copy;
  }
  /** A plain JavaScript representation of this node. */
  toJS(doc2, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
    if (!isDocument(doc2))
      throw new TypeError("A document argument is required");
    const ctx = {
      anchors: /* @__PURE__ */ new Map(),
      doc: doc2,
      keep: true,
      mapAsMap: mapAsMap === true,
      mapKeyWarned: false,
      maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
    };
    const res = toJS(this, "", ctx);
    if (typeof onAnchor === "function")
      for (const { count, res: res2 } of ctx.anchors.values())
        onAnchor(res2, count);
    return typeof reviver === "function" ? applyReviver(reviver, { "": res }, "", res) : res;
  }
};

// ../node_modules/yaml/browser/dist/nodes/Alias.js
var Alias = class extends NodeBase {
  constructor(source) {
    super(ALIAS);
    this.source = source;
    Object.defineProperty(this, "tag", {
      set() {
        throw new Error("Alias nodes cannot have tags");
      }
    });
  }
  /**
   * Resolve the value of this alias within `doc`, finding the last
   * instance of the `source` anchor before this node.
   */
  resolve(doc2, ctx) {
    if (ctx?.maxAliasCount === 0)
      throw new ReferenceError("Alias resolution is disabled");
    let nodes;
    if (ctx?.aliasResolveCache) {
      nodes = ctx.aliasResolveCache;
    } else {
      nodes = [];
      visit(doc2, {
        Node: (_key, node) => {
          if (isAlias(node) || hasAnchor(node))
            nodes.push(node);
        }
      });
      if (ctx)
        ctx.aliasResolveCache = nodes;
    }
    let found = void 0;
    for (const node of nodes) {
      if (node === this)
        break;
      if (node.anchor === this.source)
        found = node;
    }
    return found;
  }
  toJSON(_arg, ctx) {
    if (!ctx)
      return { source: this.source };
    const { anchors, doc: doc2, maxAliasCount } = ctx;
    const source = this.resolve(doc2, ctx);
    if (!source) {
      const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
      throw new ReferenceError(msg);
    }
    let data = anchors.get(source);
    if (!data) {
      toJS(source, null, ctx);
      data = anchors.get(source);
    }
    if (data?.res === void 0) {
      const msg = "This should not happen: Alias anchor was not resolved?";
      throw new ReferenceError(msg);
    }
    if (maxAliasCount >= 0) {
      data.count += 1;
      if (data.aliasCount === 0)
        data.aliasCount = getAliasCount(doc2, source, anchors);
      if (data.count * data.aliasCount > maxAliasCount) {
        const msg = "Excessive alias count indicates a resource exhaustion attack";
        throw new ReferenceError(msg);
      }
    }
    return data.res;
  }
  toString(ctx, _onComment, _onChompKeep) {
    const src = `*${this.source}`;
    if (ctx) {
      anchorIsValid(this.source);
      if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
        const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
        throw new Error(msg);
      }
      if (ctx.implicitKey)
        return `${src} `;
    }
    return src;
  }
};
function getAliasCount(doc2, node, anchors) {
  if (isAlias(node)) {
    const source = node.resolve(doc2);
    const anchor = anchors && source && anchors.get(source);
    return anchor ? anchor.count * anchor.aliasCount : 0;
  } else if (isCollection(node)) {
    let count = 0;
    for (const item of node.items) {
      const c = getAliasCount(doc2, item, anchors);
      if (c > count)
        count = c;
    }
    return count;
  } else if (isPair(node)) {
    const kc = getAliasCount(doc2, node.key, anchors);
    const vc = getAliasCount(doc2, node.value, anchors);
    return Math.max(kc, vc);
  }
  return 1;
}

// ../node_modules/yaml/browser/dist/nodes/Scalar.js
var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
var Scalar = class extends NodeBase {
  constructor(value) {
    super(SCALAR);
    this.value = value;
  }
  toJSON(arg, ctx) {
    return ctx?.keep ? this.value : toJS(this.value, arg, ctx);
  }
  toString() {
    return String(this.value);
  }
};
Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
Scalar.PLAIN = "PLAIN";
Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";

// ../node_modules/yaml/browser/dist/doc/createNode.js
var defaultTagPrefix = "tag:yaml.org,2002:";
function findTagObject(value, tagName, tags) {
  if (tagName) {
    const match2 = tags.filter((t2) => t2.tag === tagName);
    const tagObj = match2.find((t2) => !t2.format) ?? match2[0];
    if (!tagObj)
      throw new Error(`Tag ${tagName} not found`);
    return tagObj;
  }
  return tags.find((t2) => t2.identify?.(value) && !t2.format);
}
function createNode(value, tagName, ctx) {
  if (isDocument(value))
    value = value.contents;
  if (isNode2(value))
    return value;
  if (isPair(value)) {
    const map3 = ctx.schema[MAP].createNode?.(ctx.schema, null, ctx);
    map3.items.push(value);
    return map3;
  }
  if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
    value = value.valueOf();
  }
  const { aliasDuplicateObjects, onAnchor, onTagObj, schema: schema4, sourceObjects } = ctx;
  let ref = void 0;
  if (aliasDuplicateObjects && value && typeof value === "object") {
    ref = sourceObjects.get(value);
    if (ref) {
      ref.anchor ?? (ref.anchor = onAnchor(value));
      return new Alias(ref.anchor);
    } else {
      ref = { anchor: null, node: null };
      sourceObjects.set(value, ref);
    }
  }
  if (tagName?.startsWith("!!"))
    tagName = defaultTagPrefix + tagName.slice(2);
  let tagObj = findTagObject(value, tagName, schema4.tags);
  if (!tagObj) {
    if (value && typeof value.toJSON === "function") {
      value = value.toJSON();
    }
    if (!value || typeof value !== "object") {
      const node2 = new Scalar(value);
      if (ref)
        ref.node = node2;
      return node2;
    }
    tagObj = value instanceof Map ? schema4[MAP] : Symbol.iterator in Object(value) ? schema4[SEQ] : schema4[MAP];
  }
  if (onTagObj) {
    onTagObj(tagObj);
    delete ctx.onTagObj;
  }
  const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar(value);
  if (tagName)
    node.tag = tagName;
  else if (!tagObj.default)
    node.tag = tagObj.tag;
  if (ref)
    ref.node = node;
  return node;
}

// ../node_modules/yaml/browser/dist/nodes/Collection.js
function collectionFromPath(schema4, path, value) {
  let v = value;
  for (let i = path.length - 1; i >= 0; --i) {
    const k = path[i];
    if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
      const a = [];
      a[k] = v;
      v = a;
    } else {
      v = /* @__PURE__ */ new Map([[k, v]]);
    }
  }
  return createNode(v, void 0, {
    aliasDuplicateObjects: false,
    keepUndefined: false,
    onAnchor: () => {
      throw new Error("This should not happen, please report a bug.");
    },
    schema: schema4,
    sourceObjects: /* @__PURE__ */ new Map()
  });
}
var isEmptyPath = (path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done;
var Collection = class extends NodeBase {
  constructor(type, schema4) {
    super(type);
    Object.defineProperty(this, "schema", {
      value: schema4,
      configurable: true,
      enumerable: false,
      writable: true
    });
  }
  /**
   * Create a copy of this collection.
   *
   * @param schema - If defined, overwrites the original's schema
   */
  clone(schema4) {
    const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    if (schema4)
      copy.schema = schema4;
    copy.items = copy.items.map((it) => isNode2(it) || isPair(it) ? it.clone(schema4) : it);
    if (this.range)
      copy.range = this.range.slice();
    return copy;
  }
  /**
   * Adds a value to the collection. For `!!map` and `!!omap` the value must
   * be a Pair instance or a `{ key, value }` object, which may not have a key
   * that already exists in the map.
   */
  addIn(path, value) {
    if (isEmptyPath(path))
      this.add(value);
    else {
      const [key, ...rest] = path;
      const node = this.get(key, true);
      if (isCollection(node))
        node.addIn(rest, value);
      else if (node === void 0 && this.schema)
        this.set(key, collectionFromPath(this.schema, rest, value));
      else
        throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
  }
  /**
   * Removes a value from the collection.
   * @returns `true` if the item was found and removed.
   */
  deleteIn(path) {
    const [key, ...rest] = path;
    if (rest.length === 0)
      return this.delete(key);
    const node = this.get(key, true);
    if (isCollection(node))
      return node.deleteIn(rest);
    else
      throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
  }
  /**
   * Returns item at `key`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  getIn(path, keepScalar) {
    const [key, ...rest] = path;
    const node = this.get(key, true);
    if (rest.length === 0)
      return !keepScalar && isScalar(node) ? node.value : node;
    else
      return isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
  }
  hasAllNullValues(allowScalar) {
    return this.items.every((node) => {
      if (!isPair(node))
        return false;
      const n = node.value;
      return n == null || allowScalar && isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
    });
  }
  /**
   * Checks if the collection includes a value with the key `key`.
   */
  hasIn(path) {
    const [key, ...rest] = path;
    if (rest.length === 0)
      return this.has(key);
    const node = this.get(key, true);
    return isCollection(node) ? node.hasIn(rest) : false;
  }
  /**
   * Sets a value in this collection. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  setIn(path, value) {
    const [key, ...rest] = path;
    if (rest.length === 0) {
      this.set(key, value);
    } else {
      const node = this.get(key, true);
      if (isCollection(node))
        node.setIn(rest, value);
      else if (node === void 0 && this.schema)
        this.set(key, collectionFromPath(this.schema, rest, value));
      else
        throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
  }
};

// ../node_modules/yaml/browser/dist/stringify/stringifyComment.js
var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
function indentComment(comment, indent) {
  if (/^\n+$/.test(comment))
    return comment.substring(1);
  return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
}
var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;

// ../node_modules/yaml/browser/dist/stringify/foldFlowLines.js
var FOLD_FLOW = "flow";
var FOLD_BLOCK = "block";
var FOLD_QUOTED = "quoted";
function foldFlowLines(text2, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
  if (!lineWidth || lineWidth < 0)
    return text2;
  if (lineWidth < minContentWidth)
    minContentWidth = 0;
  const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
  if (text2.length <= endStep)
    return text2;
  const folds = [];
  const escapedFolds = {};
  let end = lineWidth - indent.length;
  if (typeof indentAtStart === "number") {
    if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
      folds.push(0);
    else
      end = lineWidth - indentAtStart;
  }
  let split = void 0;
  let prev = void 0;
  let overflow = false;
  let i = -1;
  let escStart = -1;
  let escEnd = -1;
  if (mode === FOLD_BLOCK) {
    i = consumeMoreIndentedLines(text2, i, indent.length);
    if (i !== -1)
      end = i + endStep;
  }
  for (let ch; ch = text2[i += 1]; ) {
    if (mode === FOLD_QUOTED && ch === "\\") {
      escStart = i;
      switch (text2[i + 1]) {
        case "x":
          i += 3;
          break;
        case "u":
          i += 5;
          break;
        case "U":
          i += 9;
          break;
        default:
          i += 1;
      }
      escEnd = i;
    }
    if (ch === "\n") {
      if (mode === FOLD_BLOCK)
        i = consumeMoreIndentedLines(text2, i, indent.length);
      end = i + indent.length + endStep;
      split = void 0;
    } else {
      if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
        const next = text2[i + 1];
        if (next && next !== " " && next !== "\n" && next !== "	")
          split = i;
      }
      if (i >= end) {
        if (split) {
          folds.push(split);
          end = split + endStep;
          split = void 0;
        } else if (mode === FOLD_QUOTED) {
          while (prev === " " || prev === "	") {
            prev = ch;
            ch = text2[i += 1];
            overflow = true;
          }
          const j = i > escEnd + 1 ? i - 2 : escStart - 1;
          if (escapedFolds[j])
            return text2;
          folds.push(j);
          escapedFolds[j] = true;
          end = j + endStep;
          split = void 0;
        } else {
          overflow = true;
        }
      }
    }
    prev = ch;
  }
  if (overflow && onOverflow)
    onOverflow();
  if (folds.length === 0)
    return text2;
  if (onFold)
    onFold();
  let res = text2.slice(0, folds[0]);
  for (let i2 = 0; i2 < folds.length; ++i2) {
    const fold = folds[i2];
    const end2 = folds[i2 + 1] || text2.length;
    if (fold === 0)
      res = `
${indent}${text2.slice(0, end2)}`;
    else {
      if (mode === FOLD_QUOTED && escapedFolds[fold])
        res += `${text2[fold]}\\`;
      res += `
${indent}${text2.slice(fold + 1, end2)}`;
    }
  }
  return res;
}
function consumeMoreIndentedLines(text2, i, indent) {
  let end = i;
  let start = i + 1;
  let ch = text2[start];
  while (ch === " " || ch === "	") {
    if (i < start + indent) {
      ch = text2[++i];
    } else {
      do {
        ch = text2[++i];
      } while (ch && ch !== "\n");
      end = i;
      start = i + 1;
      ch = text2[start];
    }
  }
  return end;
}

// ../node_modules/yaml/browser/dist/stringify/stringifyString.js
var getFoldOptions = (ctx, isBlock2) => ({
  indentAtStart: isBlock2 ? ctx.indent.length : ctx.indentAtStart,
  lineWidth: ctx.options.lineWidth,
  minContentWidth: ctx.options.minContentWidth
});
var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
function lineLengthOverLimit(str, lineWidth, indentLength) {
  if (!lineWidth || lineWidth < 0)
    return false;
  const limit = lineWidth - indentLength;
  const strLen = str.length;
  if (strLen <= limit)
    return false;
  for (let i = 0, start = 0; i < strLen; ++i) {
    if (str[i] === "\n") {
      if (i - start > limit)
        return true;
      start = i + 1;
      if (strLen - start <= limit)
        return false;
    }
  }
  return true;
}
function doubleQuotedString(value, ctx) {
  const json = JSON.stringify(value);
  if (ctx.options.doubleQuotedAsJSON)
    return json;
  const { implicitKey } = ctx;
  const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
  const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
  let str = "";
  let start = 0;
  for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
    if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
      str += json.slice(start, i) + "\\ ";
      i += 1;
      start = i;
      ch = "\\";
    }
    if (ch === "\\")
      switch (json[i + 1]) {
        case "u":
          {
            str += json.slice(start, i);
            const code = json.substr(i + 2, 4);
            switch (code) {
              case "0000":
                str += "\\0";
                break;
              case "0007":
                str += "\\a";
                break;
              case "000b":
                str += "\\v";
                break;
              case "001b":
                str += "\\e";
                break;
              case "0085":
                str += "\\N";
                break;
              case "00a0":
                str += "\\_";
                break;
              case "2028":
                str += "\\L";
                break;
              case "2029":
                str += "\\P";
                break;
              default:
                if (code.substr(0, 2) === "00")
                  str += "\\x" + code.substr(2);
                else
                  str += json.substr(i, 6);
            }
            i += 5;
            start = i + 1;
          }
          break;
        case "n":
          if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
            i += 1;
          } else {
            str += json.slice(start, i) + "\n\n";
            while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
              str += "\n";
              i += 2;
            }
            str += indent;
            if (json[i + 2] === " ")
              str += "\\";
            i += 1;
            start = i + 1;
          }
          break;
        default:
          i += 1;
      }
  }
  str = start ? str + json.slice(start) : json;
  return implicitKey ? str : foldFlowLines(str, indent, FOLD_QUOTED, getFoldOptions(ctx, false));
}
function singleQuotedString(value, ctx) {
  if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
    return doubleQuotedString(value, ctx);
  const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
  const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
  return ctx.implicitKey ? res : foldFlowLines(res, indent, FOLD_FLOW, getFoldOptions(ctx, false));
}
function quotedString(value, ctx) {
  const { singleQuote } = ctx.options;
  let qs;
  if (singleQuote === false)
    qs = doubleQuotedString;
  else {
    const hasDouble = value.includes('"');
    const hasSingle = value.includes("'");
    if (hasDouble && !hasSingle)
      qs = singleQuotedString;
    else if (hasSingle && !hasDouble)
      qs = doubleQuotedString;
    else
      qs = singleQuote ? singleQuotedString : doubleQuotedString;
  }
  return qs(value, ctx);
}
var blockEndNewlines;
try {
  blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
} catch {
  blockEndNewlines = /\n+(?!\n|$)/g;
}
function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
  const { blockQuote, commentString, lineWidth } = ctx.options;
  if (!blockQuote || /\n[\t ]+$/.test(value)) {
    return quotedString(value, ctx);
  }
  const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
  const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.BLOCK_FOLDED ? false : type === Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
  if (!value)
    return literal ? "|\n" : ">\n";
  let chomp;
  let endStart;
  for (endStart = value.length; endStart > 0; --endStart) {
    const ch = value[endStart - 1];
    if (ch !== "\n" && ch !== "	" && ch !== " ")
      break;
  }
  let end = value.substring(endStart);
  const endNlPos = end.indexOf("\n");
  if (endNlPos === -1) {
    chomp = "-";
  } else if (value === end || endNlPos !== end.length - 1) {
    chomp = "+";
    if (onChompKeep)
      onChompKeep();
  } else {
    chomp = "";
  }
  if (end) {
    value = value.slice(0, -end.length);
    if (end[end.length - 1] === "\n")
      end = end.slice(0, -1);
    end = end.replace(blockEndNewlines, `$&${indent}`);
  }
  let startWithSpace = false;
  let startEnd;
  let startNlPos = -1;
  for (startEnd = 0; startEnd < value.length; ++startEnd) {
    const ch = value[startEnd];
    if (ch === " ")
      startWithSpace = true;
    else if (ch === "\n")
      startNlPos = startEnd;
    else
      break;
  }
  let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
  if (start) {
    value = value.substring(start.length);
    start = start.replace(/\n+/g, `$&${indent}`);
  }
  const indentSize = indent ? "2" : "1";
  let header = (startWithSpace ? indentSize : "") + chomp;
  if (comment) {
    header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
    if (onComment)
      onComment();
  }
  if (!literal) {
    const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
    let literalFallback = false;
    const foldOptions = getFoldOptions(ctx, true);
    if (blockQuote !== "folded" && type !== Scalar.BLOCK_FOLDED) {
      foldOptions.onOverflow = () => {
        literalFallback = true;
      };
    }
    const body = foldFlowLines(`${start}${foldedValue}${end}`, indent, FOLD_BLOCK, foldOptions);
    if (!literalFallback)
      return `>${header}
${indent}${body}`;
  }
  value = value.replace(/\n+/g, `$&${indent}`);
  return `|${header}
${indent}${start}${value}${end}`;
}
function plainString(item, ctx, onComment, onChompKeep) {
  const { type, value } = item;
  const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
  if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
    return quotedString(value, ctx);
  }
  if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
    return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
  }
  if (!implicitKey && !inFlow && type !== Scalar.PLAIN && value.includes("\n")) {
    return blockString(item, ctx, onComment, onChompKeep);
  }
  if (containsDocumentMarker(value)) {
    if (indent === "") {
      ctx.forceBlockIndent = true;
      return blockString(item, ctx, onComment, onChompKeep);
    } else if (implicitKey && indent === indentStep) {
      return quotedString(value, ctx);
    }
  }
  const str = value.replace(/\n+/g, `$&
${indent}`);
  if (actualString) {
    const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
    const { compat, tags } = ctx.doc.schema;
    if (tags.some(test) || compat?.some(test))
      return quotedString(value, ctx);
  }
  return implicitKey ? str : foldFlowLines(str, indent, FOLD_FLOW, getFoldOptions(ctx, false));
}
function stringifyString(item, ctx, onComment, onChompKeep) {
  const { implicitKey, inFlow } = ctx;
  const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
  let { type } = item;
  if (type !== Scalar.QUOTE_DOUBLE) {
    if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
      type = Scalar.QUOTE_DOUBLE;
  }
  const _stringify = (_type) => {
    switch (_type) {
      case Scalar.BLOCK_FOLDED:
      case Scalar.BLOCK_LITERAL:
        return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
      case Scalar.QUOTE_DOUBLE:
        return doubleQuotedString(ss.value, ctx);
      case Scalar.QUOTE_SINGLE:
        return singleQuotedString(ss.value, ctx);
      case Scalar.PLAIN:
        return plainString(ss, ctx, onComment, onChompKeep);
      default:
        return null;
    }
  };
  let res = _stringify(type);
  if (res === null) {
    const { defaultKeyType, defaultStringType } = ctx.options;
    const t2 = implicitKey && defaultKeyType || defaultStringType;
    res = _stringify(t2);
    if (res === null)
      throw new Error(`Unsupported default string type ${t2}`);
  }
  return res;
}

// ../node_modules/yaml/browser/dist/stringify/stringify.js
function createStringifyContext(doc2, options) {
  const opt = Object.assign({
    blockQuote: true,
    commentString: stringifyComment,
    defaultKeyType: null,
    defaultStringType: "PLAIN",
    directives: null,
    doubleQuotedAsJSON: false,
    doubleQuotedMinMultiLineLength: 40,
    falseStr: "false",
    flowCollectionPadding: true,
    indentSeq: true,
    lineWidth: 80,
    minContentWidth: 20,
    nullStr: "null",
    simpleKeys: false,
    singleQuote: null,
    trailingComma: false,
    trueStr: "true",
    verifyAliasOrder: true
  }, doc2.schema.toStringOptions, options);
  let inFlow;
  switch (opt.collectionStyle) {
    case "block":
      inFlow = false;
      break;
    case "flow":
      inFlow = true;
      break;
    default:
      inFlow = null;
  }
  return {
    anchors: /* @__PURE__ */ new Set(),
    doc: doc2,
    flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
    indent: "",
    indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
    inFlow,
    options: opt
  };
}
function getTagObject(tags, item) {
  if (item.tag) {
    const match2 = tags.filter((t2) => t2.tag === item.tag);
    if (match2.length > 0)
      return match2.find((t2) => t2.format === item.format) ?? match2[0];
  }
  let tagObj = void 0;
  let obj;
  if (isScalar(item)) {
    obj = item.value;
    let match2 = tags.filter((t2) => t2.identify?.(obj));
    if (match2.length > 1) {
      const testMatch = match2.filter((t2) => t2.test);
      if (testMatch.length > 0)
        match2 = testMatch;
    }
    tagObj = match2.find((t2) => t2.format === item.format) ?? match2.find((t2) => !t2.format);
  } else {
    obj = item;
    tagObj = tags.find((t2) => t2.nodeClass && obj instanceof t2.nodeClass);
  }
  if (!tagObj) {
    const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
    throw new Error(`Tag not resolved for ${name} value`);
  }
  return tagObj;
}
function stringifyProps(node, tagObj, { anchors, doc: doc2 }) {
  if (!doc2.directives)
    return "";
  const props = [];
  const anchor = (isScalar(node) || isCollection(node)) && node.anchor;
  if (anchor && anchorIsValid(anchor)) {
    anchors.add(anchor);
    props.push(`&${anchor}`);
  }
  const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
  if (tag)
    props.push(doc2.directives.tagString(tag));
  return props.join(" ");
}
function stringify(item, ctx, onComment, onChompKeep) {
  if (isPair(item))
    return item.toString(ctx, onComment, onChompKeep);
  if (isAlias(item)) {
    if (ctx.doc.directives)
      return item.toString(ctx);
    if (ctx.resolvedAliases?.has(item)) {
      throw new TypeError(`Cannot stringify circular structure without alias nodes`);
    } else {
      if (ctx.resolvedAliases)
        ctx.resolvedAliases.add(item);
      else
        ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
      item = item.resolve(ctx.doc);
    }
  }
  let tagObj = void 0;
  const node = isNode2(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
  tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
  const props = stringifyProps(node, tagObj, ctx);
  if (props.length > 0)
    ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
  const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : isScalar(node) ? stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
  if (!props)
    return str;
  return isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
}

// ../node_modules/yaml/browser/dist/stringify/stringifyPair.js
function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
  const { allNullValues, doc: doc2, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
  let keyComment = isNode2(key) && key.comment || null;
  if (simpleKeys) {
    if (keyComment) {
      throw new Error("With simple keys, key nodes cannot have comments");
    }
    if (isCollection(key) || !isNode2(key) && typeof key === "object") {
      const msg = "With simple keys, collection cannot be used as a key value";
      throw new Error(msg);
    }
  }
  let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || isCollection(key) || (isScalar(key) ? key.type === Scalar.BLOCK_FOLDED || key.type === Scalar.BLOCK_LITERAL : typeof key === "object"));
  ctx = Object.assign({}, ctx, {
    allNullValues: false,
    implicitKey: !explicitKey && (simpleKeys || !allNullValues),
    indent: indent + indentStep
  });
  let keyCommentDone = false;
  let chompKeep = false;
  let str = stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
  if (!explicitKey && !ctx.inFlow && str.length > 1024) {
    if (simpleKeys)
      throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
    explicitKey = true;
  }
  if (ctx.inFlow) {
    if (allNullValues || value == null) {
      if (keyCommentDone && onComment)
        onComment();
      return str === "" ? "?" : explicitKey ? `? ${str}` : str;
    }
  } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
    str = `? ${str}`;
    if (keyComment && !keyCommentDone) {
      str += lineComment(str, ctx.indent, commentString(keyComment));
    } else if (chompKeep && onChompKeep)
      onChompKeep();
    return str;
  }
  if (keyCommentDone)
    keyComment = null;
  if (explicitKey) {
    if (keyComment)
      str += lineComment(str, ctx.indent, commentString(keyComment));
    str = `? ${str}
${indent}:`;
  } else {
    str = `${str}:`;
    if (keyComment)
      str += lineComment(str, ctx.indent, commentString(keyComment));
  }
  let vsb, vcb, valueComment;
  if (isNode2(value)) {
    vsb = !!value.spaceBefore;
    vcb = value.commentBefore;
    valueComment = value.comment;
  } else {
    vsb = false;
    vcb = null;
    valueComment = null;
    if (value && typeof value === "object")
      value = doc2.createNode(value);
  }
  ctx.implicitKey = false;
  if (!explicitKey && !keyComment && isScalar(value))
    ctx.indentAtStart = str.length + 1;
  chompKeep = false;
  if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && isSeq(value) && !value.flow && !value.tag && !value.anchor) {
    ctx.indent = ctx.indent.substring(2);
  }
  let valueCommentDone = false;
  const valueStr = stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
  let ws = " ";
  if (keyComment || vsb || vcb) {
    ws = vsb ? "\n" : "";
    if (vcb) {
      const cs = commentString(vcb);
      ws += `
${indentComment(cs, ctx.indent)}`;
    }
    if (valueStr === "" && !ctx.inFlow) {
      if (ws === "\n" && valueComment)
        ws = "\n\n";
    } else {
      ws += `
${ctx.indent}`;
    }
  } else if (!explicitKey && isCollection(value)) {
    const vs0 = valueStr[0];
    const nl0 = valueStr.indexOf("\n");
    const hasNewline = nl0 !== -1;
    const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
    if (hasNewline || !flow) {
      let hasPropsLine = false;
      if (hasNewline && (vs0 === "&" || vs0 === "!")) {
        let sp0 = valueStr.indexOf(" ");
        if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
          sp0 = valueStr.indexOf(" ", sp0 + 1);
        }
        if (sp0 === -1 || nl0 < sp0)
          hasPropsLine = true;
      }
      if (!hasPropsLine)
        ws = `
${ctx.indent}`;
    }
  } else if (valueStr === "" || valueStr[0] === "\n") {
    ws = "";
  }
  str += ws + valueStr;
  if (ctx.inFlow) {
    if (valueCommentDone && onComment)
      onComment();
  } else if (valueComment && !valueCommentDone) {
    str += lineComment(str, ctx.indent, commentString(valueComment));
  } else if (chompKeep && onChompKeep) {
    onChompKeep();
  }
  return str;
}

// ../node_modules/yaml/browser/dist/log.js
function warn(logLevel, warning) {
  if (logLevel === "debug" || logLevel === "warn") {
    console.warn(warning);
  }
}

// ../node_modules/yaml/browser/dist/schema/yaml-1.1/merge.js
var MERGE_KEY = "<<";
var merge = {
  identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
  default: "key",
  tag: "tag:yaml.org,2002:merge",
  test: /^<<$/,
  resolve: () => Object.assign(new Scalar(Symbol(MERGE_KEY)), {
    addToJSMap: addMergeToJSMap
  }),
  stringify: () => MERGE_KEY
};
var isMergeKey = (ctx, key) => (merge.identify(key) || isScalar(key) && (!key.type || key.type === Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
function addMergeToJSMap(ctx, map3, value) {
  const source = resolveAliasValue(ctx, value);
  if (isSeq(source))
    for (const it of source.items)
      mergeValue(ctx, map3, it);
  else if (Array.isArray(source))
    for (const it of source)
      mergeValue(ctx, map3, it);
  else
    mergeValue(ctx, map3, source);
}
function mergeValue(ctx, map3, value) {
  const source = resolveAliasValue(ctx, value);
  if (!isMap(source))
    throw new Error("Merge sources must be maps or map aliases");
  const srcMap = source.toJSON(null, ctx, Map);
  for (const [key, value2] of srcMap) {
    if (map3 instanceof Map) {
      if (!map3.has(key))
        map3.set(key, value2);
    } else if (map3 instanceof Set) {
      map3.add(key);
    } else if (!Object.prototype.hasOwnProperty.call(map3, key)) {
      Object.defineProperty(map3, key, {
        value: value2,
        writable: true,
        enumerable: true,
        configurable: true
      });
    }
  }
  return map3;
}
function resolveAliasValue(ctx, value) {
  return ctx && isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
}

// ../node_modules/yaml/browser/dist/nodes/addPairToJSMap.js
function addPairToJSMap(ctx, map3, { key, value }) {
  if (isNode2(key) && key.addToJSMap)
    key.addToJSMap(ctx, map3, value);
  else if (isMergeKey(ctx, key))
    addMergeToJSMap(ctx, map3, value);
  else {
    const jsKey = toJS(key, "", ctx);
    if (map3 instanceof Map) {
      map3.set(jsKey, toJS(value, jsKey, ctx));
    } else if (map3 instanceof Set) {
      map3.add(jsKey);
    } else {
      const stringKey = stringifyKey(key, jsKey, ctx);
      const jsValue = toJS(value, stringKey, ctx);
      if (stringKey in map3)
        Object.defineProperty(map3, stringKey, {
          value: jsValue,
          writable: true,
          enumerable: true,
          configurable: true
        });
      else
        map3[stringKey] = jsValue;
    }
  }
  return map3;
}
function stringifyKey(key, jsKey, ctx) {
  if (jsKey === null)
    return "";
  if (typeof jsKey !== "object")
    return String(jsKey);
  if (isNode2(key) && ctx?.doc) {
    const strCtx = createStringifyContext(ctx.doc, {});
    strCtx.anchors = /* @__PURE__ */ new Set();
    for (const node of ctx.anchors.keys())
      strCtx.anchors.add(node.anchor);
    strCtx.inFlow = true;
    strCtx.inStringifyKey = true;
    const strKey = key.toString(strCtx);
    if (!ctx.mapKeyWarned) {
      let jsonStr = JSON.stringify(strKey);
      if (jsonStr.length > 40)
        jsonStr = jsonStr.substring(0, 36) + '..."';
      warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
      ctx.mapKeyWarned = true;
    }
    return strKey;
  }
  return JSON.stringify(jsKey);
}

// ../node_modules/yaml/browser/dist/nodes/Pair.js
function createPair(key, value, ctx) {
  const k = createNode(key, void 0, ctx);
  const v = createNode(value, void 0, ctx);
  return new Pair2(k, v);
}
var Pair2 = class _Pair {
  constructor(key, value = null) {
    Object.defineProperty(this, NODE_TYPE, { value: PAIR });
    this.key = key;
    this.value = value;
  }
  clone(schema4) {
    let { key, value } = this;
    if (isNode2(key))
      key = key.clone(schema4);
    if (isNode2(value))
      value = value.clone(schema4);
    return new _Pair(key, value);
  }
  toJSON(_, ctx) {
    const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
    return addPairToJSMap(ctx, pair, this);
  }
  toString(ctx, onComment, onChompKeep) {
    return ctx?.doc ? stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
  }
};

// ../node_modules/yaml/browser/dist/stringify/stringifyCollection.js
function stringifyCollection(collection, ctx, options) {
  const flow = ctx.inFlow ?? collection.flow;
  const stringify4 = flow ? stringifyFlowCollection : stringifyBlockCollection;
  return stringify4(collection, ctx, options);
}
function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
  const { indent, options: { commentString } } = ctx;
  const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
  let chompKeep = false;
  const lines = [];
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    let comment2 = null;
    if (isNode2(item)) {
      if (!chompKeep && item.spaceBefore)
        lines.push("");
      addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
      if (item.comment)
        comment2 = item.comment;
    } else if (isPair(item)) {
      const ik = isNode2(item.key) ? item.key : null;
      if (ik) {
        if (!chompKeep && ik.spaceBefore)
          lines.push("");
        addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
      }
    }
    chompKeep = false;
    let str2 = stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
    if (comment2)
      str2 += lineComment(str2, itemIndent, commentString(comment2));
    if (chompKeep && comment2)
      chompKeep = false;
    lines.push(blockItemPrefix + str2);
  }
  let str;
  if (lines.length === 0) {
    str = flowChars.start + flowChars.end;
  } else {
    str = lines[0];
    for (let i = 1; i < lines.length; ++i) {
      const line = lines[i];
      str += line ? `
${indent}${line}` : "\n";
    }
  }
  if (comment) {
    str += "\n" + indentComment(commentString(comment), indent);
    if (onComment)
      onComment();
  } else if (chompKeep && onChompKeep)
    onChompKeep();
  return str;
}
function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
  const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
  itemIndent += indentStep;
  const itemCtx = Object.assign({}, ctx, {
    indent: itemIndent,
    inFlow: true,
    type: null
  });
  let reqNewline = false;
  let linesAtValue = 0;
  const lines = [];
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    let comment = null;
    if (isNode2(item)) {
      if (item.spaceBefore)
        lines.push("");
      addCommentBefore(ctx, lines, item.commentBefore, false);
      if (item.comment)
        comment = item.comment;
    } else if (isPair(item)) {
      const ik = isNode2(item.key) ? item.key : null;
      if (ik) {
        if (ik.spaceBefore)
          lines.push("");
        addCommentBefore(ctx, lines, ik.commentBefore, false);
        if (ik.comment)
          reqNewline = true;
      }
      const iv = isNode2(item.value) ? item.value : null;
      if (iv) {
        if (iv.comment)
          comment = iv.comment;
        if (iv.commentBefore)
          reqNewline = true;
      } else if (item.value == null && ik?.comment) {
        comment = ik.comment;
      }
    }
    if (comment)
      reqNewline = true;
    let str = stringify(item, itemCtx, () => comment = null);
    reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
    if (i < items.length - 1) {
      str += ",";
    } else if (ctx.options.trailingComma) {
      if (ctx.options.lineWidth > 0) {
        reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
      }
      if (reqNewline) {
        str += ",";
      }
    }
    if (comment)
      str += lineComment(str, itemIndent, commentString(comment));
    lines.push(str);
    linesAtValue = lines.length;
  }
  const { start, end } = flowChars;
  if (lines.length === 0) {
    return start + end;
  } else {
    if (!reqNewline) {
      const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
      reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
    }
    if (reqNewline) {
      let str = start;
      for (const line of lines)
        str += line ? `
${indentStep}${indent}${line}` : "\n";
      return `${str}
${indent}${end}`;
    } else {
      return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
    }
  }
}
function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
  if (comment && chompKeep)
    comment = comment.replace(/^\n+/, "");
  if (comment) {
    const ic = indentComment(commentString(comment), indent);
    lines.push(ic.trimStart());
  }
}

// ../node_modules/yaml/browser/dist/nodes/YAMLMap.js
function findPair(items, key) {
  const k = isScalar(key) ? key.value : key;
  for (const it of items) {
    if (isPair(it)) {
      if (it.key === key || it.key === k)
        return it;
      if (isScalar(it.key) && it.key.value === k)
        return it;
    }
  }
  return void 0;
}
var YAMLMap = class extends Collection {
  static get tagName() {
    return "tag:yaml.org,2002:map";
  }
  constructor(schema4) {
    super(MAP, schema4);
    this.items = [];
  }
  /**
   * A generic collection parsing method that can be extended
   * to other node classes that inherit from YAMLMap
   */
  static from(schema4, obj, ctx) {
    const { keepUndefined, replacer } = ctx;
    const map3 = new this(schema4);
    const add = (key, value) => {
      if (typeof replacer === "function")
        value = replacer.call(obj, key, value);
      else if (Array.isArray(replacer) && !replacer.includes(key))
        return;
      if (value !== void 0 || keepUndefined)
        map3.items.push(createPair(key, value, ctx));
    };
    if (obj instanceof Map) {
      for (const [key, value] of obj)
        add(key, value);
    } else if (obj && typeof obj === "object") {
      for (const key of Object.keys(obj))
        add(key, obj[key]);
    }
    if (typeof schema4.sortMapEntries === "function") {
      map3.items.sort(schema4.sortMapEntries);
    }
    return map3;
  }
  /**
   * Adds a value to the collection.
   *
   * @param overwrite - If not set `true`, using a key that is already in the
   *   collection will throw. Otherwise, overwrites the previous value.
   */
  add(pair, overwrite) {
    let _pair;
    if (isPair(pair))
      _pair = pair;
    else if (!pair || typeof pair !== "object" || !("key" in pair)) {
      _pair = new Pair2(pair, pair?.value);
    } else
      _pair = new Pair2(pair.key, pair.value);
    const prev = findPair(this.items, _pair.key);
    const sortEntries = this.schema?.sortMapEntries;
    if (prev) {
      if (!overwrite)
        throw new Error(`Key ${_pair.key} already set`);
      if (isScalar(prev.value) && isScalarValue(_pair.value))
        prev.value.value = _pair.value;
      else
        prev.value = _pair.value;
    } else if (sortEntries) {
      const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
      if (i === -1)
        this.items.push(_pair);
      else
        this.items.splice(i, 0, _pair);
    } else {
      this.items.push(_pair);
    }
  }
  delete(key) {
    const it = findPair(this.items, key);
    if (!it)
      return false;
    const del = this.items.splice(this.items.indexOf(it), 1);
    return del.length > 0;
  }
  get(key, keepScalar) {
    const it = findPair(this.items, key);
    const node = it?.value;
    return (!keepScalar && isScalar(node) ? node.value : node) ?? void 0;
  }
  has(key) {
    return !!findPair(this.items, key);
  }
  set(key, value) {
    this.add(new Pair2(key, value), true);
  }
  /**
   * @param ctx - Conversion context, originally set in Document#toJS()
   * @param {Class} Type - If set, forces the returned collection type
   * @returns Instance of Type, Map, or Object
   */
  toJSON(_, ctx, Type) {
    const map3 = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
    if (ctx?.onCreate)
      ctx.onCreate(map3);
    for (const item of this.items)
      addPairToJSMap(ctx, map3, item);
    return map3;
  }
  toString(ctx, onComment, onChompKeep) {
    if (!ctx)
      return JSON.stringify(this);
    for (const item of this.items) {
      if (!isPair(item))
        throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
    }
    if (!ctx.allNullValues && this.hasAllNullValues(false))
      ctx = Object.assign({}, ctx, { allNullValues: true });
    return stringifyCollection(this, ctx, {
      blockItemPrefix: "",
      flowChars: { start: "{", end: "}" },
      itemIndent: ctx.indent || "",
      onChompKeep,
      onComment
    });
  }
};

// ../node_modules/yaml/browser/dist/schema/common/map.js
var map2 = {
  collection: "map",
  default: true,
  nodeClass: YAMLMap,
  tag: "tag:yaml.org,2002:map",
  resolve(map3, onError) {
    if (!isMap(map3))
      onError("Expected a mapping for this tag");
    return map3;
  },
  createNode: (schema4, obj, ctx) => YAMLMap.from(schema4, obj, ctx)
};

// ../node_modules/yaml/browser/dist/nodes/YAMLSeq.js
var YAMLSeq = class extends Collection {
  static get tagName() {
    return "tag:yaml.org,2002:seq";
  }
  constructor(schema4) {
    super(SEQ, schema4);
    this.items = [];
  }
  add(value) {
    this.items.push(value);
  }
  /**
   * Removes a value from the collection.
   *
   * `key` must contain a representation of an integer for this to succeed.
   * It may be wrapped in a `Scalar`.
   *
   * @returns `true` if the item was found and removed.
   */
  delete(key) {
    const idx = asItemIndex(key);
    if (typeof idx !== "number")
      return false;
    const del = this.items.splice(idx, 1);
    return del.length > 0;
  }
  get(key, keepScalar) {
    const idx = asItemIndex(key);
    if (typeof idx !== "number")
      return void 0;
    const it = this.items[idx];
    return !keepScalar && isScalar(it) ? it.value : it;
  }
  /**
   * Checks if the collection includes a value with the key `key`.
   *
   * `key` must contain a representation of an integer for this to succeed.
   * It may be wrapped in a `Scalar`.
   */
  has(key) {
    const idx = asItemIndex(key);
    return typeof idx === "number" && idx < this.items.length;
  }
  /**
   * Sets a value in this collection. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   *
   * If `key` does not contain a representation of an integer, this will throw.
   * It may be wrapped in a `Scalar`.
   */
  set(key, value) {
    const idx = asItemIndex(key);
    if (typeof idx !== "number")
      throw new Error(`Expected a valid index, not ${key}.`);
    const prev = this.items[idx];
    if (isScalar(prev) && isScalarValue(value))
      prev.value = value;
    else
      this.items[idx] = value;
  }
  toJSON(_, ctx) {
    const seq2 = [];
    if (ctx?.onCreate)
      ctx.onCreate(seq2);
    let i = 0;
    for (const item of this.items)
      seq2.push(toJS(item, String(i++), ctx));
    return seq2;
  }
  toString(ctx, onComment, onChompKeep) {
    if (!ctx)
      return JSON.stringify(this);
    return stringifyCollection(this, ctx, {
      blockItemPrefix: "- ",
      flowChars: { start: "[", end: "]" },
      itemIndent: (ctx.indent || "") + "  ",
      onChompKeep,
      onComment
    });
  }
  static from(schema4, obj, ctx) {
    const { replacer } = ctx;
    const seq2 = new this(schema4);
    if (obj && Symbol.iterator in Object(obj)) {
      let i = 0;
      for (let it of obj) {
        if (typeof replacer === "function") {
          const key = obj instanceof Set ? it : String(i++);
          it = replacer.call(obj, key, it);
        }
        seq2.items.push(createNode(it, void 0, ctx));
      }
    }
    return seq2;
  }
};
function asItemIndex(key) {
  let idx = isScalar(key) ? key.value : key;
  if (idx && typeof idx === "string")
    idx = Number(idx);
  return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
}

// ../node_modules/yaml/browser/dist/schema/common/seq.js
var seq = {
  collection: "seq",
  default: true,
  nodeClass: YAMLSeq,
  tag: "tag:yaml.org,2002:seq",
  resolve(seq2, onError) {
    if (!isSeq(seq2))
      onError("Expected a sequence for this tag");
    return seq2;
  },
  createNode: (schema4, obj, ctx) => YAMLSeq.from(schema4, obj, ctx)
};

// ../node_modules/yaml/browser/dist/schema/common/string.js
var string = {
  identify: (value) => typeof value === "string",
  default: true,
  tag: "tag:yaml.org,2002:str",
  resolve: (str) => str,
  stringify(item, ctx, onComment, onChompKeep) {
    ctx = Object.assign({ actualString: true }, ctx);
    return stringifyString(item, ctx, onComment, onChompKeep);
  }
};

// ../node_modules/yaml/browser/dist/schema/common/null.js
var nullTag = {
  identify: (value) => value == null,
  createNode: () => new Scalar(null),
  default: true,
  tag: "tag:yaml.org,2002:null",
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => new Scalar(null),
  stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
};

// ../node_modules/yaml/browser/dist/schema/core/bool.js
var boolTag = {
  identify: (value) => typeof value === "boolean",
  default: true,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
  resolve: (str) => new Scalar(str[0] === "t" || str[0] === "T"),
  stringify({ source, value }, ctx) {
    if (source && boolTag.test.test(source)) {
      const sv = source[0] === "t" || source[0] === "T";
      if (value === sv)
        return source;
    }
    return value ? ctx.options.trueStr : ctx.options.falseStr;
  }
};

// ../node_modules/yaml/browser/dist/stringify/stringifyNumber.js
function stringifyNumber({ format, minFractionDigits, tag, value }) {
  if (typeof value === "bigint")
    return String(value);
  const num = typeof value === "number" ? value : Number(value);
  if (!isFinite(num))
    return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
  let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
  if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
    let i = n.indexOf(".");
    if (i < 0) {
      i = n.length;
      n += ".";
    }
    let d = minFractionDigits - (n.length - i - 1);
    while (d-- > 0)
      n += "0";
  }
  return n;
}

// ../node_modules/yaml/browser/dist/schema/core/float.js
var floatNaN = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: stringifyNumber
};
var floatExp = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
  resolve: (str) => parseFloat(str),
  stringify(node) {
    const num = Number(node.value);
    return isFinite(num) ? num.toExponential() : stringifyNumber(node);
  }
};
var float = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
  resolve(str) {
    const node = new Scalar(parseFloat(str));
    const dot = str.indexOf(".");
    if (dot !== -1 && str[str.length - 1] === "0")
      node.minFractionDigits = str.length - dot - 1;
    return node;
  },
  stringify: stringifyNumber
};

// ../node_modules/yaml/browser/dist/schema/core/int.js
var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
function intStringify(node, radix, prefix) {
  const { value } = node;
  if (intIdentify(value) && value >= 0)
    return prefix + value.toString(radix);
  return stringifyNumber(node);
}
var intOct = {
  identify: (value) => intIdentify(value) && value >= 0,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^0o[0-7]+$/,
  resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
  stringify: (node) => intStringify(node, 8, "0o")
};
var int = {
  identify: intIdentify,
  default: true,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9]+$/,
  resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
  stringify: stringifyNumber
};
var intHex = {
  identify: (value) => intIdentify(value) && value >= 0,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^0x[0-9a-fA-F]+$/,
  resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
  stringify: (node) => intStringify(node, 16, "0x")
};

// ../node_modules/yaml/browser/dist/schema/core/schema.js
var schema = [
  map2,
  seq,
  string,
  nullTag,
  boolTag,
  intOct,
  int,
  intHex,
  floatNaN,
  floatExp,
  float
];

// ../node_modules/yaml/browser/dist/schema/json/schema.js
function intIdentify2(value) {
  return typeof value === "bigint" || Number.isInteger(value);
}
var stringifyJSON = ({ value }) => JSON.stringify(value);
var jsonScalars = [
  {
    identify: (value) => typeof value === "string",
    default: true,
    tag: "tag:yaml.org,2002:str",
    resolve: (str) => str,
    stringify: stringifyJSON
  },
  {
    identify: (value) => value == null,
    createNode: () => new Scalar(null),
    default: true,
    tag: "tag:yaml.org,2002:null",
    test: /^null$/,
    resolve: () => null,
    stringify: stringifyJSON
  },
  {
    identify: (value) => typeof value === "boolean",
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^true$|^false$/,
    resolve: (str) => str === "true",
    stringify: stringifyJSON
  },
  {
    identify: intIdentify2,
    default: true,
    tag: "tag:yaml.org,2002:int",
    test: /^-?(?:0|[1-9][0-9]*)$/,
    resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
    stringify: ({ value }) => intIdentify2(value) ? value.toString() : JSON.stringify(value)
  },
  {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
    resolve: (str) => parseFloat(str),
    stringify: stringifyJSON
  }
];
var jsonError = {
  default: true,
  tag: "",
  test: /^/,
  resolve(str, onError) {
    onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
    return str;
  }
};
var schema2 = [map2, seq].concat(jsonScalars, jsonError);

// ../node_modules/yaml/browser/dist/schema/yaml-1.1/binary.js
var binary = {
  identify: (value) => value instanceof Uint8Array,
  // Buffer inherits from Uint8Array
  default: false,
  tag: "tag:yaml.org,2002:binary",
  /**
   * Returns a Buffer in node and an Uint8Array in browsers
   *
   * To use the resulting buffer as an image, you'll want to do something like:
   *
   *   const blob = new Blob([buffer], { type: 'image/jpeg' })
   *   document.querySelector('#photo').src = URL.createObjectURL(blob)
   */
  resolve(src, onError) {
    if (typeof atob === "function") {
      const str = atob(src.replace(/[\n\r]/g, ""));
      const buffer = new Uint8Array(str.length);
      for (let i = 0; i < str.length; ++i)
        buffer[i] = str.charCodeAt(i);
      return buffer;
    } else {
      onError("This environment does not support reading binary tags; either Buffer or atob is required");
      return src;
    }
  },
  stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
    if (!value)
      return "";
    const buf = value;
    let str;
    if (typeof btoa === "function") {
      let s = "";
      for (let i = 0; i < buf.length; ++i)
        s += String.fromCharCode(buf[i]);
      str = btoa(s);
    } else {
      throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
    }
    type ?? (type = Scalar.BLOCK_LITERAL);
    if (type !== Scalar.QUOTE_DOUBLE) {
      const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
      const n = Math.ceil(str.length / lineWidth);
      const lines = new Array(n);
      for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
        lines[i] = str.substr(o, lineWidth);
      }
      str = lines.join(type === Scalar.BLOCK_LITERAL ? "\n" : " ");
    }
    return stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
  }
};

// ../node_modules/yaml/browser/dist/schema/yaml-1.1/pairs.js
function resolvePairs(seq2, onError) {
  if (isSeq(seq2)) {
    for (let i = 0; i < seq2.items.length; ++i) {
      let item = seq2.items[i];
      if (isPair(item))
        continue;
      else if (isMap(item)) {
        if (item.items.length > 1)
          onError("Each pair must have its own sequence indicator");
        const pair = item.items[0] || new Pair2(new Scalar(null));
        if (item.commentBefore)
          pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
        if (item.comment) {
          const cn = pair.value ?? pair.key;
          cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
        }
        item = pair;
      }
      seq2.items[i] = isPair(item) ? item : new Pair2(item);
    }
  } else
    onError("Expected a sequence for this tag");
  return seq2;
}
function createPairs(schema4, iterable, ctx) {
  const { replacer } = ctx;
  const pairs2 = new YAMLSeq(schema4);
  pairs2.tag = "tag:yaml.org,2002:pairs";
  let i = 0;
  if (iterable && Symbol.iterator in Object(iterable))
    for (let it of iterable) {
      if (typeof replacer === "function")
        it = replacer.call(iterable, String(i++), it);
      let key, value;
      if (Array.isArray(it)) {
        if (it.length === 2) {
          key = it[0];
          value = it[1];
        } else
          throw new TypeError(`Expected [key, value] tuple: ${it}`);
      } else if (it && it instanceof Object) {
        const keys2 = Object.keys(it);
        if (keys2.length === 1) {
          key = keys2[0];
          value = it[key];
        } else {
          throw new TypeError(`Expected tuple with one key, not ${keys2.length} keys`);
        }
      } else {
        key = it;
      }
      pairs2.items.push(createPair(key, value, ctx));
    }
  return pairs2;
}
var pairs = {
  collection: "seq",
  default: false,
  tag: "tag:yaml.org,2002:pairs",
  resolve: resolvePairs,
  createNode: createPairs
};

// ../node_modules/yaml/browser/dist/schema/yaml-1.1/omap.js
var YAMLOMap = class _YAMLOMap extends YAMLSeq {
  constructor() {
    super();
    this.add = YAMLMap.prototype.add.bind(this);
    this.delete = YAMLMap.prototype.delete.bind(this);
    this.get = YAMLMap.prototype.get.bind(this);
    this.has = YAMLMap.prototype.has.bind(this);
    this.set = YAMLMap.prototype.set.bind(this);
    this.tag = _YAMLOMap.tag;
  }
  /**
   * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
   * but TypeScript won't allow widening the signature of a child method.
   */
  toJSON(_, ctx) {
    if (!ctx)
      return super.toJSON(_);
    const map3 = /* @__PURE__ */ new Map();
    if (ctx?.onCreate)
      ctx.onCreate(map3);
    for (const pair of this.items) {
      let key, value;
      if (isPair(pair)) {
        key = toJS(pair.key, "", ctx);
        value = toJS(pair.value, key, ctx);
      } else {
        key = toJS(pair, "", ctx);
      }
      if (map3.has(key))
        throw new Error("Ordered maps must not include duplicate keys");
      map3.set(key, value);
    }
    return map3;
  }
  static from(schema4, iterable, ctx) {
    const pairs2 = createPairs(schema4, iterable, ctx);
    const omap2 = new this();
    omap2.items = pairs2.items;
    return omap2;
  }
};
YAMLOMap.tag = "tag:yaml.org,2002:omap";
var omap = {
  collection: "seq",
  identify: (value) => value instanceof Map,
  nodeClass: YAMLOMap,
  default: false,
  tag: "tag:yaml.org,2002:omap",
  resolve(seq2, onError) {
    const pairs2 = resolvePairs(seq2, onError);
    const seenKeys = [];
    for (const { key } of pairs2.items) {
      if (isScalar(key)) {
        if (seenKeys.includes(key.value)) {
          onError(`Ordered maps must not include duplicate keys: ${key.value}`);
        } else {
          seenKeys.push(key.value);
        }
      }
    }
    return Object.assign(new YAMLOMap(), pairs2);
  },
  createNode: (schema4, iterable, ctx) => YAMLOMap.from(schema4, iterable, ctx)
};

// ../node_modules/yaml/browser/dist/schema/yaml-1.1/bool.js
function boolStringify({ value, source }, ctx) {
  const boolObj = value ? trueTag : falseTag;
  if (source && boolObj.test.test(source))
    return source;
  return value ? ctx.options.trueStr : ctx.options.falseStr;
}
var trueTag = {
  identify: (value) => value === true,
  default: true,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
  resolve: () => new Scalar(true),
  stringify: boolStringify
};
var falseTag = {
  identify: (value) => value === false,
  default: true,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
  resolve: () => new Scalar(false),
  stringify: boolStringify
};

// ../node_modules/yaml/browser/dist/schema/yaml-1.1/float.js
var floatNaN2 = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: stringifyNumber
};
var floatExp2 = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
  resolve: (str) => parseFloat(str.replace(/_/g, "")),
  stringify(node) {
    const num = Number(node.value);
    return isFinite(num) ? num.toExponential() : stringifyNumber(node);
  }
};
var float2 = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
  resolve(str) {
    const node = new Scalar(parseFloat(str.replace(/_/g, "")));
    const dot = str.indexOf(".");
    if (dot !== -1) {
      const f = str.substring(dot + 1).replace(/_/g, "");
      if (f[f.length - 1] === "0")
        node.minFractionDigits = f.length;
    }
    return node;
  },
  stringify: stringifyNumber
};

// ../node_modules/yaml/browser/dist/schema/yaml-1.1/int.js
var intIdentify3 = (value) => typeof value === "bigint" || Number.isInteger(value);
function intResolve2(str, offset, radix, { intAsBigInt }) {
  const sign = str[0];
  if (sign === "-" || sign === "+")
    offset += 1;
  str = str.substring(offset).replace(/_/g, "");
  if (intAsBigInt) {
    switch (radix) {
      case 2:
        str = `0b${str}`;
        break;
      case 8:
        str = `0o${str}`;
        break;
      case 16:
        str = `0x${str}`;
        break;
    }
    const n2 = BigInt(str);
    return sign === "-" ? BigInt(-1) * n2 : n2;
  }
  const n = parseInt(str, radix);
  return sign === "-" ? -1 * n : n;
}
function intStringify2(node, radix, prefix) {
  const { value } = node;
  if (intIdentify3(value)) {
    const str = value.toString(radix);
    return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
  }
  return stringifyNumber(node);
}
var intBin = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "BIN",
  test: /^[-+]?0b[0-1_]+$/,
  resolve: (str, _onError, opt) => intResolve2(str, 2, 2, opt),
  stringify: (node) => intStringify2(node, 2, "0b")
};
var intOct2 = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^[-+]?0[0-7_]+$/,
  resolve: (str, _onError, opt) => intResolve2(str, 1, 8, opt),
  stringify: (node) => intStringify2(node, 8, "0")
};
var int2 = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9][0-9_]*$/,
  resolve: (str, _onError, opt) => intResolve2(str, 0, 10, opt),
  stringify: stringifyNumber
};
var intHex2 = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^[-+]?0x[0-9a-fA-F_]+$/,
  resolve: (str, _onError, opt) => intResolve2(str, 2, 16, opt),
  stringify: (node) => intStringify2(node, 16, "0x")
};

// ../node_modules/yaml/browser/dist/schema/yaml-1.1/set.js
var YAMLSet = class _YAMLSet extends YAMLMap {
  constructor(schema4) {
    super(schema4);
    this.tag = _YAMLSet.tag;
  }
  add(key) {
    let pair;
    if (isPair(key))
      pair = key;
    else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
      pair = new Pair2(key.key, null);
    else
      pair = new Pair2(key, null);
    const prev = findPair(this.items, pair.key);
    if (!prev)
      this.items.push(pair);
  }
  /**
   * If `keepPair` is `true`, returns the Pair matching `key`.
   * Otherwise, returns the value of that Pair's key.
   */
  get(key, keepPair) {
    const pair = findPair(this.items, key);
    return !keepPair && isPair(pair) ? isScalar(pair.key) ? pair.key.value : pair.key : pair;
  }
  set(key, value) {
    if (typeof value !== "boolean")
      throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
    const prev = findPair(this.items, key);
    if (prev && !value) {
      this.items.splice(this.items.indexOf(prev), 1);
    } else if (!prev && value) {
      this.items.push(new Pair2(key));
    }
  }
  toJSON(_, ctx) {
    return super.toJSON(_, ctx, Set);
  }
  toString(ctx, onComment, onChompKeep) {
    if (!ctx)
      return JSON.stringify(this);
    if (this.hasAllNullValues(true))
      return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
    else
      throw new Error("Set items must all have null values");
  }
  static from(schema4, iterable, ctx) {
    const { replacer } = ctx;
    const set2 = new this(schema4);
    if (iterable && Symbol.iterator in Object(iterable))
      for (let value of iterable) {
        if (typeof replacer === "function")
          value = replacer.call(iterable, value, value);
        set2.items.push(createPair(value, null, ctx));
      }
    return set2;
  }
};
YAMLSet.tag = "tag:yaml.org,2002:set";
var set = {
  collection: "map",
  identify: (value) => value instanceof Set,
  nodeClass: YAMLSet,
  default: false,
  tag: "tag:yaml.org,2002:set",
  createNode: (schema4, iterable, ctx) => YAMLSet.from(schema4, iterable, ctx),
  resolve(map3, onError) {
    if (isMap(map3)) {
      if (map3.hasAllNullValues(true))
        return Object.assign(new YAMLSet(), map3);
      else
        onError("Set items must all have null values");
    } else
      onError("Expected a mapping for this tag");
    return map3;
  }
};

// ../node_modules/yaml/browser/dist/schema/yaml-1.1/timestamp.js
function parseSexagesimal(str, asBigInt) {
  const sign = str[0];
  const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
  const num = (n) => asBigInt ? BigInt(n) : Number(n);
  const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
  return sign === "-" ? num(-1) * res : res;
}
function stringifySexagesimal(node) {
  let { value } = node;
  let num = (n) => n;
  if (typeof value === "bigint")
    num = (n) => BigInt(n);
  else if (isNaN(value) || !isFinite(value))
    return stringifyNumber(node);
  let sign = "";
  if (value < 0) {
    sign = "-";
    value *= num(-1);
  }
  const _60 = num(60);
  const parts = [value % _60];
  if (value < 60) {
    parts.unshift(0);
  } else {
    value = (value - parts[0]) / _60;
    parts.unshift(value % _60);
    if (value >= 60) {
      value = (value - parts[0]) / _60;
      parts.unshift(value);
    }
  }
  return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
}
var intTime = {
  identify: (value) => typeof value === "bigint" || Number.isInteger(value),
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
  resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
  stringify: stringifySexagesimal
};
var floatTime = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
  resolve: (str) => parseSexagesimal(str, false),
  stringify: stringifySexagesimal
};
var timestamp = {
  identify: (value) => value instanceof Date,
  default: true,
  tag: "tag:yaml.org,2002:timestamp",
  // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
  // may be omitted altogether, resulting in a date format. In such a case, the time part is
  // assumed to be 00:00:00Z (start of day, UTC).
  test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
  resolve(str) {
    const match2 = str.match(timestamp.test);
    if (!match2)
      throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
    const [, year, month, day, hour, minute, second] = match2.map(Number);
    const millisec = match2[7] ? Number((match2[7] + "00").substr(1, 3)) : 0;
    let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
    const tz = match2[8];
    if (tz && tz !== "Z") {
      let d = parseSexagesimal(tz, false);
      if (Math.abs(d) < 30)
        d *= 60;
      date -= 6e4 * d;
    }
    return new Date(date);
  },
  stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
};

// ../node_modules/yaml/browser/dist/schema/yaml-1.1/schema.js
var schema3 = [
  map2,
  seq,
  string,
  nullTag,
  trueTag,
  falseTag,
  intBin,
  intOct2,
  int2,
  intHex2,
  floatNaN2,
  floatExp2,
  float2,
  binary,
  merge,
  omap,
  pairs,
  set,
  intTime,
  floatTime,
  timestamp
];

// ../node_modules/yaml/browser/dist/schema/tags.js
var schemas = /* @__PURE__ */ new Map([
  ["core", schema],
  ["failsafe", [map2, seq, string]],
  ["json", schema2],
  ["yaml11", schema3],
  ["yaml-1.1", schema3]
]);
var tagsByName = {
  binary,
  bool: boolTag,
  float,
  floatExp,
  floatNaN,
  floatTime,
  int,
  intHex,
  intOct,
  intTime,
  map: map2,
  merge,
  null: nullTag,
  omap,
  pairs,
  seq,
  set,
  timestamp
};
var coreKnownTags = {
  "tag:yaml.org,2002:binary": binary,
  "tag:yaml.org,2002:merge": merge,
  "tag:yaml.org,2002:omap": omap,
  "tag:yaml.org,2002:pairs": pairs,
  "tag:yaml.org,2002:set": set,
  "tag:yaml.org,2002:timestamp": timestamp
};
function getTags(customTags, schemaName, addMergeTag) {
  const schemaTags = schemas.get(schemaName);
  if (schemaTags && !customTags) {
    return addMergeTag && !schemaTags.includes(merge) ? schemaTags.concat(merge) : schemaTags.slice();
  }
  let tags = schemaTags;
  if (!tags) {
    if (Array.isArray(customTags))
      tags = [];
    else {
      const keys2 = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
      throw new Error(`Unknown schema "${schemaName}"; use one of ${keys2} or define customTags array`);
    }
  }
  if (Array.isArray(customTags)) {
    for (const tag of customTags)
      tags = tags.concat(tag);
  } else if (typeof customTags === "function") {
    tags = customTags(tags.slice());
  }
  if (addMergeTag)
    tags = tags.concat(merge);
  return tags.reduce((tags2, tag) => {
    const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
    if (!tagObj) {
      const tagName = JSON.stringify(tag);
      const keys2 = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
      throw new Error(`Unknown custom tag ${tagName}; use one of ${keys2}`);
    }
    if (!tags2.includes(tagObj))
      tags2.push(tagObj);
    return tags2;
  }, []);
}

// ../node_modules/yaml/browser/dist/schema/Schema.js
var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
var Schema2 = class _Schema {
  constructor({ compat, customTags, merge: merge2, resolveKnownTags, schema: schema4, sortMapEntries, toStringDefaults }) {
    this.compat = Array.isArray(compat) ? getTags(compat, "compat") : compat ? getTags(null, compat) : null;
    this.name = typeof schema4 === "string" && schema4 || "core";
    this.knownTags = resolveKnownTags ? coreKnownTags : {};
    this.tags = getTags(customTags, this.name, merge2);
    this.toStringOptions = toStringDefaults ?? null;
    Object.defineProperty(this, MAP, { value: map2 });
    Object.defineProperty(this, SCALAR, { value: string });
    Object.defineProperty(this, SEQ, { value: seq });
    this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
  }
  clone() {
    const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
    copy.tags = this.tags.slice();
    return copy;
  }
};

// ../node_modules/yaml/browser/dist/stringify/stringifyDocument.js
function stringifyDocument(doc2, options) {
  const lines = [];
  let hasDirectives = options.directives === true;
  if (options.directives !== false && doc2.directives) {
    const dir = doc2.directives.toString(doc2);
    if (dir) {
      lines.push(dir);
      hasDirectives = true;
    } else if (doc2.directives.docStart)
      hasDirectives = true;
  }
  if (hasDirectives)
    lines.push("---");
  const ctx = createStringifyContext(doc2, options);
  const { commentString } = ctx.options;
  if (doc2.commentBefore) {
    if (lines.length !== 1)
      lines.unshift("");
    const cs = commentString(doc2.commentBefore);
    lines.unshift(indentComment(cs, ""));
  }
  let chompKeep = false;
  let contentComment = null;
  if (doc2.contents) {
    if (isNode2(doc2.contents)) {
      if (doc2.contents.spaceBefore && hasDirectives)
        lines.push("");
      if (doc2.contents.commentBefore) {
        const cs = commentString(doc2.contents.commentBefore);
        lines.push(indentComment(cs, ""));
      }
      ctx.forceBlockIndent = !!doc2.comment;
      contentComment = doc2.contents.comment;
    }
    const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
    let body = stringify(doc2.contents, ctx, () => contentComment = null, onChompKeep);
    if (contentComment)
      body += lineComment(body, "", commentString(contentComment));
    if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
      lines[lines.length - 1] = `--- ${body}`;
    } else
      lines.push(body);
  } else {
    lines.push(stringify(doc2.contents, ctx));
  }
  if (doc2.directives?.docEnd) {
    if (doc2.comment) {
      const cs = commentString(doc2.comment);
      if (cs.includes("\n")) {
        lines.push("...");
        lines.push(indentComment(cs, ""));
      } else {
        lines.push(`... ${cs}`);
      }
    } else {
      lines.push("...");
    }
  } else {
    let dc = doc2.comment;
    if (dc && chompKeep)
      dc = dc.replace(/^\n+/, "");
    if (dc) {
      if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
        lines.push("");
      lines.push(indentComment(commentString(dc), ""));
    }
  }
  return lines.join("\n") + "\n";
}

// ../node_modules/yaml/browser/dist/doc/Document.js
var Document = class _Document {
  constructor(value, replacer, options) {
    this.commentBefore = null;
    this.comment = null;
    this.errors = [];
    this.warnings = [];
    Object.defineProperty(this, NODE_TYPE, { value: DOC });
    let _replacer = null;
    if (typeof replacer === "function" || Array.isArray(replacer)) {
      _replacer = replacer;
    } else if (options === void 0 && replacer) {
      options = replacer;
      replacer = void 0;
    }
    const opt = Object.assign({
      intAsBigInt: false,
      keepSourceTokens: false,
      logLevel: "warn",
      prettyErrors: true,
      strict: true,
      stringKeys: false,
      uniqueKeys: true,
      version: "1.2"
    }, options);
    this.options = opt;
    let { version } = opt;
    if (options?._directives) {
      this.directives = options._directives.atDocument();
      if (this.directives.yaml.explicit)
        version = this.directives.yaml.version;
    } else
      this.directives = new Directives({ version });
    this.setSchema(version, options);
    this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
  }
  /**
   * Create a deep copy of this Document and its contents.
   *
   * Custom Node values that inherit from `Object` still refer to their original instances.
   */
  clone() {
    const copy = Object.create(_Document.prototype, {
      [NODE_TYPE]: { value: DOC }
    });
    copy.commentBefore = this.commentBefore;
    copy.comment = this.comment;
    copy.errors = this.errors.slice();
    copy.warnings = this.warnings.slice();
    copy.options = Object.assign({}, this.options);
    if (this.directives)
      copy.directives = this.directives.clone();
    copy.schema = this.schema.clone();
    copy.contents = isNode2(this.contents) ? this.contents.clone(copy.schema) : this.contents;
    if (this.range)
      copy.range = this.range.slice();
    return copy;
  }
  /** Adds a value to the document. */
  add(value) {
    if (assertCollection(this.contents))
      this.contents.add(value);
  }
  /** Adds a value to the document. */
  addIn(path, value) {
    if (assertCollection(this.contents))
      this.contents.addIn(path, value);
  }
  /**
   * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
   *
   * If `node` already has an anchor, `name` is ignored.
   * Otherwise, the `node.anchor` value will be set to `name`,
   * or if an anchor with that name is already present in the document,
   * `name` will be used as a prefix for a new unique anchor.
   * If `name` is undefined, the generated anchor will use 'a' as a prefix.
   */
  createAlias(node, name) {
    if (!node.anchor) {
      const prev = anchorNames(this);
      node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      !name || prev.has(name) ? findNewAnchor(name || "a", prev) : name;
    }
    return new Alias(node.anchor);
  }
  createNode(value, replacer, options) {
    let _replacer = void 0;
    if (typeof replacer === "function") {
      value = replacer.call({ "": value }, "", value);
      _replacer = replacer;
    } else if (Array.isArray(replacer)) {
      const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
      const asStr = replacer.filter(keyToStr).map(String);
      if (asStr.length > 0)
        replacer = replacer.concat(asStr);
      _replacer = replacer;
    } else if (options === void 0 && replacer) {
      options = replacer;
      replacer = void 0;
    }
    const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
    const { onAnchor, setAnchors, sourceObjects } = createNodeAnchors(
      this,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      anchorPrefix || "a"
    );
    const ctx = {
      aliasDuplicateObjects: aliasDuplicateObjects ?? true,
      keepUndefined: keepUndefined ?? false,
      onAnchor,
      onTagObj,
      replacer: _replacer,
      schema: this.schema,
      sourceObjects
    };
    const node = createNode(value, tag, ctx);
    if (flow && isCollection(node))
      node.flow = true;
    setAnchors();
    return node;
  }
  /**
   * Convert a key and a value into a `Pair` using the current schema,
   * recursively wrapping all values as `Scalar` or `Collection` nodes.
   */
  createPair(key, value, options = {}) {
    const k = this.createNode(key, null, options);
    const v = this.createNode(value, null, options);
    return new Pair2(k, v);
  }
  /**
   * Removes a value from the document.
   * @returns `true` if the item was found and removed.
   */
  delete(key) {
    return assertCollection(this.contents) ? this.contents.delete(key) : false;
  }
  /**
   * Removes a value from the document.
   * @returns `true` if the item was found and removed.
   */
  deleteIn(path) {
    if (isEmptyPath(path)) {
      if (this.contents == null)
        return false;
      this.contents = null;
      return true;
    }
    return assertCollection(this.contents) ? this.contents.deleteIn(path) : false;
  }
  /**
   * Returns item at `key`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  get(key, keepScalar) {
    return isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
  }
  /**
   * Returns item at `path`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  getIn(path, keepScalar) {
    if (isEmptyPath(path))
      return !keepScalar && isScalar(this.contents) ? this.contents.value : this.contents;
    return isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : void 0;
  }
  /**
   * Checks if the document includes a value with the key `key`.
   */
  has(key) {
    return isCollection(this.contents) ? this.contents.has(key) : false;
  }
  /**
   * Checks if the document includes a value at `path`.
   */
  hasIn(path) {
    if (isEmptyPath(path))
      return this.contents !== void 0;
    return isCollection(this.contents) ? this.contents.hasIn(path) : false;
  }
  /**
   * Sets a value in this document. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  set(key, value) {
    if (this.contents == null) {
      this.contents = collectionFromPath(this.schema, [key], value);
    } else if (assertCollection(this.contents)) {
      this.contents.set(key, value);
    }
  }
  /**
   * Sets a value in this document. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  setIn(path, value) {
    if (isEmptyPath(path)) {
      this.contents = value;
    } else if (this.contents == null) {
      this.contents = collectionFromPath(this.schema, Array.from(path), value);
    } else if (assertCollection(this.contents)) {
      this.contents.setIn(path, value);
    }
  }
  /**
   * Change the YAML version and schema used by the document.
   * A `null` version disables support for directives, explicit tags, anchors, and aliases.
   * It also requires the `schema` option to be given as a `Schema` instance value.
   *
   * Overrides all previously set schema options.
   */
  setSchema(version, options = {}) {
    if (typeof version === "number")
      version = String(version);
    let opt;
    switch (version) {
      case "1.1":
        if (this.directives)
          this.directives.yaml.version = "1.1";
        else
          this.directives = new Directives({ version: "1.1" });
        opt = { resolveKnownTags: false, schema: "yaml-1.1" };
        break;
      case "1.2":
      case "next":
        if (this.directives)
          this.directives.yaml.version = version;
        else
          this.directives = new Directives({ version });
        opt = { resolveKnownTags: true, schema: "core" };
        break;
      case null:
        if (this.directives)
          delete this.directives;
        opt = null;
        break;
      default: {
        const sv = JSON.stringify(version);
        throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
      }
    }
    if (options.schema instanceof Object)
      this.schema = options.schema;
    else if (opt)
      this.schema = new Schema2(Object.assign(opt, options));
    else
      throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
  }
  // json & jsonArg are only used from toJSON()
  toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
    const ctx = {
      anchors: /* @__PURE__ */ new Map(),
      doc: this,
      keep: !json,
      mapAsMap: mapAsMap === true,
      mapKeyWarned: false,
      maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
    };
    const res = toJS(this.contents, jsonArg ?? "", ctx);
    if (typeof onAnchor === "function")
      for (const { count, res: res2 } of ctx.anchors.values())
        onAnchor(res2, count);
    return typeof reviver === "function" ? applyReviver(reviver, { "": res }, "", res) : res;
  }
  /**
   * A JSON representation of the document `contents`.
   *
   * @param jsonArg Used by `JSON.stringify` to indicate the array index or
   *   property name.
   */
  toJSON(jsonArg, onAnchor) {
    return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
  }
  /** A YAML representation of the document. */
  toString(options = {}) {
    if (this.errors.length > 0)
      throw new Error("Document with errors cannot be stringified");
    if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
      const s = JSON.stringify(options.indent);
      throw new Error(`"indent" option must be a positive integer, not ${s}`);
    }
    return stringifyDocument(this, options);
  }
};
function assertCollection(contents) {
  if (isCollection(contents))
    return true;
  throw new Error("Expected a YAML collection as document contents");
}

// ../node_modules/yaml/browser/dist/errors.js
var YAMLError = class extends Error {
  constructor(name, pos, code, message) {
    super();
    this.name = name;
    this.code = code;
    this.message = message;
    this.pos = pos;
  }
};
var YAMLParseError = class extends YAMLError {
  constructor(pos, code, message) {
    super("YAMLParseError", pos, code, message);
  }
};
var YAMLWarning = class extends YAMLError {
  constructor(pos, code, message) {
    super("YAMLWarning", pos, code, message);
  }
};
var prettifyError = (src, lc) => (error) => {
  if (error.pos[0] === -1)
    return;
  error.linePos = error.pos.map((pos) => lc.linePos(pos));
  const { line, col } = error.linePos[0];
  error.message += ` at line ${line}, column ${col}`;
  let ci = col - 1;
  let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
  if (ci >= 60 && lineStr.length > 80) {
    const trimStart = Math.min(ci - 39, lineStr.length - 79);
    lineStr = "\u2026" + lineStr.substring(trimStart);
    ci -= trimStart - 1;
  }
  if (lineStr.length > 80)
    lineStr = lineStr.substring(0, 79) + "\u2026";
  if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
    let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
    if (prev.length > 80)
      prev = prev.substring(0, 79) + "\u2026\n";
    lineStr = prev + lineStr;
  }
  if (/[^ ]/.test(lineStr)) {
    let count = 1;
    const end = error.linePos[1];
    if (end?.line === line && end.col > col) {
      count = Math.max(1, Math.min(end.col - col, 80 - ci));
    }
    const pointer = " ".repeat(ci) + "^".repeat(count);
    error.message += `:

${lineStr}
${pointer}
`;
  }
};

// ../node_modules/yaml/browser/dist/compose/resolve-props.js
function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
  let spaceBefore = false;
  let atNewline = startOnNewline;
  let hasSpace = startOnNewline;
  let comment = "";
  let commentSep = "";
  let hasNewline = false;
  let reqSpace = false;
  let tab = null;
  let anchor = null;
  let tag = null;
  let newlineAfterProp = null;
  let comma = null;
  let found = null;
  let start = null;
  for (const token of tokens) {
    if (reqSpace) {
      if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
        onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      reqSpace = false;
    }
    if (tab) {
      if (atNewline && token.type !== "comment" && token.type !== "newline") {
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      }
      tab = null;
    }
    switch (token.type) {
      case "space":
        if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
          tab = token;
        }
        hasSpace = true;
        break;
      case "comment": {
        if (!hasSpace)
          onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
        const cb = token.source.substring(1) || " ";
        if (!comment)
          comment = cb;
        else
          comment += commentSep + cb;
        commentSep = "";
        atNewline = false;
        break;
      }
      case "newline":
        if (atNewline) {
          if (comment)
            comment += token.source;
          else if (!found || indicator !== "seq-item-ind")
            spaceBefore = true;
        } else
          commentSep += token.source;
        atNewline = true;
        hasNewline = true;
        if (anchor || tag)
          newlineAfterProp = token;
        hasSpace = true;
        break;
      case "anchor":
        if (anchor)
          onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
        if (token.source.endsWith(":"))
          onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
        anchor = token;
        start ?? (start = token.offset);
        atNewline = false;
        hasSpace = false;
        reqSpace = true;
        break;
      case "tag": {
        if (tag)
          onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
        tag = token;
        start ?? (start = token.offset);
        atNewline = false;
        hasSpace = false;
        reqSpace = true;
        break;
      }
      case indicator:
        if (anchor || tag)
          onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
        if (found)
          onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
        found = token;
        atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
        hasSpace = false;
        break;
      case "comma":
        if (flow) {
          if (comma)
            onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
          comma = token;
          atNewline = false;
          hasSpace = false;
          break;
        }
      // else fallthrough
      default:
        onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
        atNewline = false;
        hasSpace = false;
    }
  }
  const last = tokens[tokens.length - 1];
  const end = last ? last.offset + last.source.length : offset;
  if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
    onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
  }
  if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
    onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
  return {
    comma,
    found,
    spaceBefore,
    comment,
    hasNewline,
    anchor,
    tag,
    newlineAfterProp,
    end,
    start: start ?? end
  };
}

// ../node_modules/yaml/browser/dist/compose/util-contains-newline.js
function containsNewline(key) {
  if (!key)
    return null;
  switch (key.type) {
    case "alias":
    case "scalar":
    case "double-quoted-scalar":
    case "single-quoted-scalar":
      if (key.source.includes("\n"))
        return true;
      if (key.end) {
        for (const st of key.end)
          if (st.type === "newline")
            return true;
      }
      return false;
    case "flow-collection":
      for (const it of key.items) {
        for (const st of it.start)
          if (st.type === "newline")
            return true;
        if (it.sep) {
          for (const st of it.sep)
            if (st.type === "newline")
              return true;
        }
        if (containsNewline(it.key) || containsNewline(it.value))
          return true;
      }
      return false;
    default:
      return true;
  }
}

// ../node_modules/yaml/browser/dist/compose/util-flow-indent-check.js
function flowIndentCheck(indent, fc, onError) {
  if (fc?.type === "flow-collection") {
    const end = fc.end[0];
    if (end.indent === indent && (end.source === "]" || end.source === "}") && containsNewline(fc)) {
      const msg = "Flow end indicator should be more indented than parent";
      onError(end, "BAD_INDENT", msg, true);
    }
  }
}

// ../node_modules/yaml/browser/dist/compose/util-map-includes.js
function mapIncludes(ctx, items, search) {
  const { uniqueKeys } = ctx.options;
  if (uniqueKeys === false)
    return false;
  const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || isScalar(a) && isScalar(b) && a.value === b.value;
  return items.some((pair) => isEqual(pair.key, search));
}

// ../node_modules/yaml/browser/dist/compose/resolve-block-map.js
var startColMsg = "All mapping items must start at the same column";
function resolveBlockMap({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, bm, onError, tag) {
  const NodeClass = tag?.nodeClass ?? YAMLMap;
  const map3 = new NodeClass(ctx.schema);
  if (ctx.atRoot)
    ctx.atRoot = false;
  let offset = bm.offset;
  let commentEnd = null;
  for (const collItem of bm.items) {
    const { start, key, sep, value } = collItem;
    const keyProps = resolveProps(start, {
      indicator: "explicit-key-ind",
      next: key ?? sep?.[0],
      offset,
      onError,
      parentIndent: bm.indent,
      startOnNewline: true
    });
    const implicitKey = !keyProps.found;
    if (implicitKey) {
      if (key) {
        if (key.type === "block-seq")
          onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
        else if ("indent" in key && key.indent !== bm.indent)
          onError(offset, "BAD_INDENT", startColMsg);
      }
      if (!keyProps.anchor && !keyProps.tag && !sep) {
        commentEnd = keyProps.end;
        if (keyProps.comment) {
          if (map3.comment)
            map3.comment += "\n" + keyProps.comment;
          else
            map3.comment = keyProps.comment;
        }
        continue;
      }
      if (keyProps.newlineAfterProp || containsNewline(key)) {
        onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
      }
    } else if (keyProps.found?.indent !== bm.indent) {
      onError(offset, "BAD_INDENT", startColMsg);
    }
    ctx.atKey = true;
    const keyStart = keyProps.end;
    const keyNode = key ? composeNode2(ctx, key, keyProps, onError) : composeEmptyNode2(ctx, keyStart, start, null, keyProps, onError);
    if (ctx.schema.compat)
      flowIndentCheck(bm.indent, key, onError);
    ctx.atKey = false;
    if (mapIncludes(ctx, map3.items, keyNode))
      onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
    const valueProps = resolveProps(sep ?? [], {
      indicator: "map-value-ind",
      next: value,
      offset: keyNode.range[2],
      onError,
      parentIndent: bm.indent,
      startOnNewline: !key || key.type === "block-scalar"
    });
    offset = valueProps.end;
    if (valueProps.found) {
      if (implicitKey) {
        if (value?.type === "block-map" && !valueProps.hasNewline)
          onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
        if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
          onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
      }
      const valueNode = value ? composeNode2(ctx, value, valueProps, onError) : composeEmptyNode2(ctx, offset, sep, null, valueProps, onError);
      if (ctx.schema.compat)
        flowIndentCheck(bm.indent, value, onError);
      offset = valueNode.range[2];
      const pair = new Pair2(keyNode, valueNode);
      if (ctx.options.keepSourceTokens)
        pair.srcToken = collItem;
      map3.items.push(pair);
    } else {
      if (implicitKey)
        onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
      if (valueProps.comment) {
        if (keyNode.comment)
          keyNode.comment += "\n" + valueProps.comment;
        else
          keyNode.comment = valueProps.comment;
      }
      const pair = new Pair2(keyNode);
      if (ctx.options.keepSourceTokens)
        pair.srcToken = collItem;
      map3.items.push(pair);
    }
  }
  if (commentEnd && commentEnd < offset)
    onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
  map3.range = [bm.offset, offset, commentEnd ?? offset];
  return map3;
}

// ../node_modules/yaml/browser/dist/compose/resolve-block-seq.js
function resolveBlockSeq({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, bs, onError, tag) {
  const NodeClass = tag?.nodeClass ?? YAMLSeq;
  const seq2 = new NodeClass(ctx.schema);
  if (ctx.atRoot)
    ctx.atRoot = false;
  if (ctx.atKey)
    ctx.atKey = false;
  let offset = bs.offset;
  let commentEnd = null;
  for (const { start, value } of bs.items) {
    const props = resolveProps(start, {
      indicator: "seq-item-ind",
      next: value,
      offset,
      onError,
      parentIndent: bs.indent,
      startOnNewline: true
    });
    if (!props.found) {
      if (props.anchor || props.tag || value) {
        if (value?.type === "block-seq")
          onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
        else
          onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
      } else {
        commentEnd = props.end;
        if (props.comment)
          seq2.comment = props.comment;
        continue;
      }
    }
    const node = value ? composeNode2(ctx, value, props, onError) : composeEmptyNode2(ctx, props.end, start, null, props, onError);
    if (ctx.schema.compat)
      flowIndentCheck(bs.indent, value, onError);
    offset = node.range[2];
    seq2.items.push(node);
  }
  seq2.range = [bs.offset, offset, commentEnd ?? offset];
  return seq2;
}

// ../node_modules/yaml/browser/dist/compose/resolve-end.js
function resolveEnd(end, offset, reqSpace, onError) {
  let comment = "";
  if (end) {
    let hasSpace = false;
    let sep = "";
    for (const token of end) {
      const { source, type } = token;
      switch (type) {
        case "space":
          hasSpace = true;
          break;
        case "comment": {
          if (reqSpace && !hasSpace)
            onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          const cb = source.substring(1) || " ";
          if (!comment)
            comment = cb;
          else
            comment += sep + cb;
          sep = "";
          break;
        }
        case "newline":
          if (comment)
            sep += source;
          hasSpace = true;
          break;
        default:
          onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
      }
      offset += source.length;
    }
  }
  return { comment, offset };
}

// ../node_modules/yaml/browser/dist/compose/resolve-flow-collection.js
var blockMsg = "Block collections are not allowed within flow collections";
var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
function resolveFlowCollection({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, fc, onError, tag) {
  const isMap2 = fc.start.source === "{";
  const fcName = isMap2 ? "flow map" : "flow sequence";
  const NodeClass = tag?.nodeClass ?? (isMap2 ? YAMLMap : YAMLSeq);
  const coll = new NodeClass(ctx.schema);
  coll.flow = true;
  const atRoot = ctx.atRoot;
  if (atRoot)
    ctx.atRoot = false;
  if (ctx.atKey)
    ctx.atKey = false;
  let offset = fc.offset + fc.start.source.length;
  for (let i = 0; i < fc.items.length; ++i) {
    const collItem = fc.items[i];
    const { start, key, sep, value } = collItem;
    const props = resolveProps(start, {
      flow: fcName,
      indicator: "explicit-key-ind",
      next: key ?? sep?.[0],
      offset,
      onError,
      parentIndent: fc.indent,
      startOnNewline: false
    });
    if (!props.found) {
      if (!props.anchor && !props.tag && !sep && !value) {
        if (i === 0 && props.comma)
          onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        else if (i < fc.items.length - 1)
          onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
        if (props.comment) {
          if (coll.comment)
            coll.comment += "\n" + props.comment;
          else
            coll.comment = props.comment;
        }
        offset = props.end;
        continue;
      }
      if (!isMap2 && ctx.options.strict && containsNewline(key))
        onError(
          key,
          // checked by containsNewline()
          "MULTILINE_IMPLICIT_KEY",
          "Implicit keys of flow sequence pairs need to be on a single line"
        );
    }
    if (i === 0) {
      if (props.comma)
        onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
    } else {
      if (!props.comma)
        onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
      if (props.comment) {
        let prevItemComment = "";
        loop: for (const st of start) {
          switch (st.type) {
            case "comma":
            case "space":
              break;
            case "comment":
              prevItemComment = st.source.substring(1);
              break loop;
            default:
              break loop;
          }
        }
        if (prevItemComment) {
          let prev = coll.items[coll.items.length - 1];
          if (isPair(prev))
            prev = prev.value ?? prev.key;
          if (prev.comment)
            prev.comment += "\n" + prevItemComment;
          else
            prev.comment = prevItemComment;
          props.comment = props.comment.substring(prevItemComment.length + 1);
        }
      }
    }
    if (!isMap2 && !sep && !props.found) {
      const valueNode = value ? composeNode2(ctx, value, props, onError) : composeEmptyNode2(ctx, props.end, sep, null, props, onError);
      coll.items.push(valueNode);
      offset = valueNode.range[2];
      if (isBlock(value))
        onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
    } else {
      ctx.atKey = true;
      const keyStart = props.end;
      const keyNode = key ? composeNode2(ctx, key, props, onError) : composeEmptyNode2(ctx, keyStart, start, null, props, onError);
      if (isBlock(key))
        onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
      ctx.atKey = false;
      const valueProps = resolveProps(sep ?? [], {
        flow: fcName,
        indicator: "map-value-ind",
        next: value,
        offset: keyNode.range[2],
        onError,
        parentIndent: fc.indent,
        startOnNewline: false
      });
      if (valueProps.found) {
        if (!isMap2 && !props.found && ctx.options.strict) {
          if (sep)
            for (const st of sep) {
              if (st === valueProps.found)
                break;
              if (st.type === "newline") {
                onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                break;
              }
            }
          if (props.start < valueProps.found.offset - 1024)
            onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
        }
      } else if (value) {
        if ("source" in value && value.source?.[0] === ":")
          onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
        else
          onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
      }
      const valueNode = value ? composeNode2(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode2(ctx, valueProps.end, sep, null, valueProps, onError) : null;
      if (valueNode) {
        if (isBlock(value))
          onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
      } else if (valueProps.comment) {
        if (keyNode.comment)
          keyNode.comment += "\n" + valueProps.comment;
        else
          keyNode.comment = valueProps.comment;
      }
      const pair = new Pair2(keyNode, valueNode);
      if (ctx.options.keepSourceTokens)
        pair.srcToken = collItem;
      if (isMap2) {
        const map3 = coll;
        if (mapIncludes(ctx, map3.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        map3.items.push(pair);
      } else {
        const map3 = new YAMLMap(ctx.schema);
        map3.flow = true;
        map3.items.push(pair);
        const endRange = (valueNode ?? keyNode).range;
        map3.range = [keyNode.range[0], endRange[1], endRange[2]];
        coll.items.push(map3);
      }
      offset = valueNode ? valueNode.range[2] : valueProps.end;
    }
  }
  const expectedEnd = isMap2 ? "}" : "]";
  const [ce, ...ee] = fc.end;
  let cePos = offset;
  if (ce?.source === expectedEnd)
    cePos = ce.offset + ce.source.length;
  else {
    const name = fcName[0].toUpperCase() + fcName.substring(1);
    const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
    onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
    if (ce && ce.source.length !== 1)
      ee.unshift(ce);
  }
  if (ee.length > 0) {
    const end = resolveEnd(ee, cePos, ctx.options.strict, onError);
    if (end.comment) {
      if (coll.comment)
        coll.comment += "\n" + end.comment;
      else
        coll.comment = end.comment;
    }
    coll.range = [fc.offset, cePos, end.offset];
  } else {
    coll.range = [fc.offset, cePos, cePos];
  }
  return coll;
}

// ../node_modules/yaml/browser/dist/compose/compose-collection.js
function resolveCollection(CN2, ctx, token, onError, tagName, tag) {
  const coll = token.type === "block-map" ? resolveBlockMap(CN2, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq(CN2, ctx, token, onError, tag) : resolveFlowCollection(CN2, ctx, token, onError, tag);
  const Coll = coll.constructor;
  if (tagName === "!" || tagName === Coll.tagName) {
    coll.tag = Coll.tagName;
    return coll;
  }
  if (tagName)
    coll.tag = tagName;
  return coll;
}
function composeCollection(CN2, ctx, token, props, onError) {
  const tagToken = props.tag;
  const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
  if (token.type === "block-seq") {
    const { anchor, newlineAfterProp: nl } = props;
    const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
    if (lastProp && (!nl || nl.offset < lastProp.offset)) {
      const message = "Missing newline after block sequence props";
      onError(lastProp, "MISSING_CHAR", message);
    }
  }
  const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
  if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.tagName && expType === "seq") {
    return resolveCollection(CN2, ctx, token, onError, tagName);
  }
  let tag = ctx.schema.tags.find((t2) => t2.tag === tagName && t2.collection === expType);
  if (!tag) {
    const kt = ctx.schema.knownTags[tagName];
    if (kt?.collection === expType) {
      ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
      tag = kt;
    } else {
      if (kt) {
        onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
      } else {
        onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
      }
      return resolveCollection(CN2, ctx, token, onError, tagName);
    }
  }
  const coll = resolveCollection(CN2, ctx, token, onError, tagName, tag);
  const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
  const node = isNode2(res) ? res : new Scalar(res);
  node.range = coll.range;
  node.tag = tagName;
  if (tag?.format)
    node.format = tag.format;
  return node;
}

// ../node_modules/yaml/browser/dist/compose/resolve-block-scalar.js
function resolveBlockScalar(ctx, scalar, onError) {
  const start = scalar.offset;
  const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
  if (!header)
    return { value: "", type: null, comment: "", range: [start, start, start] };
  const type = header.mode === ">" ? Scalar.BLOCK_FOLDED : Scalar.BLOCK_LITERAL;
  const lines = scalar.source ? splitLines(scalar.source) : [];
  let chompStart = lines.length;
  for (let i = lines.length - 1; i >= 0; --i) {
    const content = lines[i][1];
    if (content === "" || content === "\r")
      chompStart = i;
    else
      break;
  }
  if (chompStart === 0) {
    const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
    let end2 = start + header.length;
    if (scalar.source)
      end2 += scalar.source.length;
    return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
  }
  let trimIndent = scalar.indent + header.indent;
  let offset = scalar.offset + header.length;
  let contentStart = 0;
  for (let i = 0; i < chompStart; ++i) {
    const [indent, content] = lines[i];
    if (content === "" || content === "\r") {
      if (header.indent === 0 && indent.length > trimIndent)
        trimIndent = indent.length;
    } else {
      if (indent.length < trimIndent) {
        const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
        onError(offset + indent.length, "MISSING_CHAR", message);
      }
      if (header.indent === 0)
        trimIndent = indent.length;
      contentStart = i;
      if (trimIndent === 0 && !ctx.atRoot) {
        const message = "Block scalar values in collections must be indented";
        onError(offset, "BAD_INDENT", message);
      }
      break;
    }
    offset += indent.length + content.length + 1;
  }
  for (let i = lines.length - 1; i >= chompStart; --i) {
    if (lines[i][0].length > trimIndent)
      chompStart = i + 1;
  }
  let value = "";
  let sep = "";
  let prevMoreIndented = false;
  for (let i = 0; i < contentStart; ++i)
    value += lines[i][0].slice(trimIndent) + "\n";
  for (let i = contentStart; i < chompStart; ++i) {
    let [indent, content] = lines[i];
    offset += indent.length + content.length + 1;
    const crlf = content[content.length - 1] === "\r";
    if (crlf)
      content = content.slice(0, -1);
    if (content && indent.length < trimIndent) {
      const src = header.indent ? "explicit indentation indicator" : "first line";
      const message = `Block scalar lines must not be less indented than their ${src}`;
      onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
      indent = "";
    }
    if (type === Scalar.BLOCK_LITERAL) {
      value += sep + indent.slice(trimIndent) + content;
      sep = "\n";
    } else if (indent.length > trimIndent || content[0] === "	") {
      if (sep === " ")
        sep = "\n";
      else if (!prevMoreIndented && sep === "\n")
        sep = "\n\n";
      value += sep + indent.slice(trimIndent) + content;
      sep = "\n";
      prevMoreIndented = true;
    } else if (content === "") {
      if (sep === "\n")
        value += "\n";
      else
        sep = "\n";
    } else {
      value += sep + content;
      sep = " ";
      prevMoreIndented = false;
    }
  }
  switch (header.chomp) {
    case "-":
      break;
    case "+":
      for (let i = chompStart; i < lines.length; ++i)
        value += "\n" + lines[i][0].slice(trimIndent);
      if (value[value.length - 1] !== "\n")
        value += "\n";
      break;
    default:
      value += "\n";
  }
  const end = start + header.length + scalar.source.length;
  return { value, type, comment: header.comment, range: [start, end, end] };
}
function parseBlockScalarHeader({ offset, props }, strict, onError) {
  if (props[0].type !== "block-scalar-header") {
    onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
    return null;
  }
  const { source } = props[0];
  const mode = source[0];
  let indent = 0;
  let chomp = "";
  let error = -1;
  for (let i = 1; i < source.length; ++i) {
    const ch = source[i];
    if (!chomp && (ch === "-" || ch === "+"))
      chomp = ch;
    else {
      const n = Number(ch);
      if (!indent && n)
        indent = n;
      else if (error === -1)
        error = offset + i;
    }
  }
  if (error !== -1)
    onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
  let hasSpace = false;
  let comment = "";
  let length2 = source.length;
  for (let i = 1; i < props.length; ++i) {
    const token = props[i];
    switch (token.type) {
      case "space":
        hasSpace = true;
      // fallthrough
      case "newline":
        length2 += token.source.length;
        break;
      case "comment":
        if (strict && !hasSpace) {
          const message = "Comments must be separated from other tokens by white space characters";
          onError(token, "MISSING_CHAR", message);
        }
        length2 += token.source.length;
        comment = token.source.substring(1);
        break;
      case "error":
        onError(token, "UNEXPECTED_TOKEN", token.message);
        length2 += token.source.length;
        break;
      /* istanbul ignore next should not happen */
      default: {
        const message = `Unexpected token in block scalar header: ${token.type}`;
        onError(token, "UNEXPECTED_TOKEN", message);
        const ts = token.source;
        if (ts && typeof ts === "string")
          length2 += ts.length;
      }
    }
  }
  return { mode, indent, chomp, comment, length: length2 };
}
function splitLines(source) {
  const split = source.split(/\n( *)/);
  const first = split[0];
  const m = first.match(/^( *)/);
  const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
  const lines = [line0];
  for (let i = 1; i < split.length; i += 2)
    lines.push([split[i], split[i + 1]]);
  return lines;
}

// ../node_modules/yaml/browser/dist/compose/resolve-flow-scalar.js
function resolveFlowScalar(scalar, strict, onError) {
  const { offset, type, source, end } = scalar;
  let _type;
  let value;
  const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
  switch (type) {
    case "scalar":
      _type = Scalar.PLAIN;
      value = plainValue(source, _onError);
      break;
    case "single-quoted-scalar":
      _type = Scalar.QUOTE_SINGLE;
      value = singleQuotedValue(source, _onError);
      break;
    case "double-quoted-scalar":
      _type = Scalar.QUOTE_DOUBLE;
      value = doubleQuotedValue(source, _onError);
      break;
    /* istanbul ignore next should not happen */
    default:
      onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
      return {
        value: "",
        type: null,
        comment: "",
        range: [offset, offset + source.length, offset + source.length]
      };
  }
  const valueEnd = offset + source.length;
  const re = resolveEnd(end, valueEnd, strict, onError);
  return {
    value,
    type: _type,
    comment: re.comment,
    range: [offset, valueEnd, re.offset]
  };
}
function plainValue(source, onError) {
  let badChar = "";
  switch (source[0]) {
    /* istanbul ignore next should not happen */
    case "	":
      badChar = "a tab character";
      break;
    case ",":
      badChar = "flow indicator character ,";
      break;
    case "%":
      badChar = "directive indicator character %";
      break;
    case "|":
    case ">": {
      badChar = `block scalar indicator ${source[0]}`;
      break;
    }
    case "@":
    case "`": {
      badChar = `reserved character ${source[0]}`;
      break;
    }
  }
  if (badChar)
    onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
  return foldLines(source);
}
function singleQuotedValue(source, onError) {
  if (source[source.length - 1] !== "'" || source.length === 1)
    onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
  return foldLines(source.slice(1, -1)).replace(/''/g, "'");
}
function foldLines(source) {
  let first, line;
  try {
    first = new RegExp("(.*?)(?<![ 	])[ 	]*\r?\n", "sy");
    line = new RegExp("[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?\n", "sy");
  } catch {
    first = /(.*?)[ \t]*\r?\n/sy;
    line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
  }
  let match2 = first.exec(source);
  if (!match2)
    return source;
  let res = match2[1];
  let sep = " ";
  let pos = first.lastIndex;
  line.lastIndex = pos;
  while (match2 = line.exec(source)) {
    if (match2[1] === "") {
      if (sep === "\n")
        res += sep;
      else
        sep = "\n";
    } else {
      res += sep + match2[1];
      sep = " ";
    }
    pos = line.lastIndex;
  }
  const last = /[ \t]*(.*)/sy;
  last.lastIndex = pos;
  match2 = last.exec(source);
  return res + sep + (match2?.[1] ?? "");
}
function doubleQuotedValue(source, onError) {
  let res = "";
  for (let i = 1; i < source.length - 1; ++i) {
    const ch = source[i];
    if (ch === "\r" && source[i + 1] === "\n")
      continue;
    if (ch === "\n") {
      const { fold, offset } = foldNewline(source, i);
      res += fold;
      i = offset;
    } else if (ch === "\\") {
      let next = source[++i];
      const cc = escapeCodes[next];
      if (cc)
        res += cc;
      else if (next === "\n") {
        next = source[i + 1];
        while (next === " " || next === "	")
          next = source[++i + 1];
      } else if (next === "\r" && source[i + 1] === "\n") {
        next = source[++i + 1];
        while (next === " " || next === "	")
          next = source[++i + 1];
      } else if (next === "x" || next === "u" || next === "U") {
        const length2 = next === "x" ? 2 : next === "u" ? 4 : 8;
        res += parseCharCode(source, i + 1, length2, onError);
        i += length2;
      } else {
        const raw = source.substr(i - 1, 2);
        onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        res += raw;
      }
    } else if (ch === " " || ch === "	") {
      const wsStart = i;
      let next = source[i + 1];
      while (next === " " || next === "	")
        next = source[++i + 1];
      if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
        res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
    } else {
      res += ch;
    }
  }
  if (source[source.length - 1] !== '"' || source.length === 1)
    onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
  return res;
}
function foldNewline(source, offset) {
  let fold = "";
  let ch = source[offset + 1];
  while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
    if (ch === "\r" && source[offset + 2] !== "\n")
      break;
    if (ch === "\n")
      fold += "\n";
    offset += 1;
    ch = source[offset + 1];
  }
  if (!fold)
    fold = " ";
  return { fold, offset };
}
var escapeCodes = {
  "0": "\0",
  // null character
  a: "\x07",
  // bell character
  b: "\b",
  // backspace
  e: "\x1B",
  // escape character
  f: "\f",
  // form feed
  n: "\n",
  // line feed
  r: "\r",
  // carriage return
  t: "	",
  // horizontal tab
  v: "\v",
  // vertical tab
  N: "\x85",
  // Unicode next line
  _: "\xA0",
  // Unicode non-breaking space
  L: "\u2028",
  // Unicode line separator
  P: "\u2029",
  // Unicode paragraph separator
  " ": " ",
  '"': '"',
  "/": "/",
  "\\": "\\",
  "	": "	"
};
function parseCharCode(source, offset, length2, onError) {
  const cc = source.substr(offset, length2);
  const ok = cc.length === length2 && /^[0-9a-fA-F]+$/.test(cc);
  const code = ok ? parseInt(cc, 16) : NaN;
  try {
    return String.fromCodePoint(code);
  } catch {
    const raw = source.substr(offset - 2, length2 + 2);
    onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
    return raw;
  }
}

// ../node_modules/yaml/browser/dist/compose/compose-scalar.js
function composeScalar(ctx, token, tagToken, onError) {
  const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar(ctx, token, onError) : resolveFlowScalar(token, ctx.options.strict, onError);
  const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
  let tag;
  if (ctx.options.stringKeys && ctx.atKey) {
    tag = ctx.schema[SCALAR];
  } else if (tagName)
    tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
  else if (token.type === "scalar")
    tag = findScalarTagByTest(ctx, value, token, onError);
  else
    tag = ctx.schema[SCALAR];
  let scalar;
  try {
    const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
    scalar = isScalar(res) ? res : new Scalar(res);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
    scalar = new Scalar(value);
  }
  scalar.range = range;
  scalar.source = value;
  if (type)
    scalar.type = type;
  if (tagName)
    scalar.tag = tagName;
  if (tag.format)
    scalar.format = tag.format;
  if (comment)
    scalar.comment = comment;
  return scalar;
}
function findScalarTagByName(schema4, value, tagName, tagToken, onError) {
  if (tagName === "!")
    return schema4[SCALAR];
  const matchWithTest = [];
  for (const tag of schema4.tags) {
    if (!tag.collection && tag.tag === tagName) {
      if (tag.default && tag.test)
        matchWithTest.push(tag);
      else
        return tag;
    }
  }
  for (const tag of matchWithTest)
    if (tag.test?.test(value))
      return tag;
  const kt = schema4.knownTags[tagName];
  if (kt && !kt.collection) {
    schema4.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
    return kt;
  }
  onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
  return schema4[SCALAR];
}
function findScalarTagByTest({ atKey, directives, schema: schema4 }, value, token, onError) {
  const tag = schema4.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema4[SCALAR];
  if (schema4.compat) {
    const compat = schema4.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema4[SCALAR];
    if (tag.tag !== compat.tag) {
      const ts = directives.tagString(tag.tag);
      const cs = directives.tagString(compat.tag);
      const msg = `Value may be parsed as either ${ts} or ${cs}`;
      onError(token, "TAG_RESOLVE_FAILED", msg, true);
    }
  }
  return tag;
}

// ../node_modules/yaml/browser/dist/compose/util-empty-scalar-position.js
function emptyScalarPosition(offset, before, pos) {
  if (before) {
    pos ?? (pos = before.length);
    for (let i = pos - 1; i >= 0; --i) {
      let st = before[i];
      switch (st.type) {
        case "space":
        case "comment":
        case "newline":
          offset -= st.source.length;
          continue;
      }
      st = before[++i];
      while (st?.type === "space") {
        offset += st.source.length;
        st = before[++i];
      }
      break;
    }
  }
  return offset;
}

// ../node_modules/yaml/browser/dist/compose/compose-node.js
var CN = { composeNode, composeEmptyNode };
function composeNode(ctx, token, props, onError) {
  const atKey = ctx.atKey;
  const { spaceBefore, comment, anchor, tag } = props;
  let node;
  let isSrcToken = true;
  switch (token.type) {
    case "alias":
      node = composeAlias(ctx, token, onError);
      if (anchor || tag)
        onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
      break;
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "block-scalar":
      node = composeScalar(ctx, token, tag, onError);
      if (anchor)
        node.anchor = anchor.source.substring(1);
      break;
    case "block-map":
    case "block-seq":
    case "flow-collection":
      try {
        node = composeCollection(CN, ctx, token, props, onError);
        if (anchor)
          node.anchor = anchor.source.substring(1);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        onError(token, "RESOURCE_EXHAUSTION", message);
      }
      break;
    default: {
      const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
      onError(token, "UNEXPECTED_TOKEN", message);
      isSrcToken = false;
    }
  }
  node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
  if (anchor && node.anchor === "")
    onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
  if (atKey && ctx.options.stringKeys && (!isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
    const msg = "With stringKeys, all keys must be strings";
    onError(tag ?? token, "NON_STRING_KEY", msg);
  }
  if (spaceBefore)
    node.spaceBefore = true;
  if (comment) {
    if (token.type === "scalar" && token.source === "")
      node.comment = comment;
    else
      node.commentBefore = comment;
  }
  if (ctx.options.keepSourceTokens && isSrcToken)
    node.srcToken = token;
  return node;
}
function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
  const token = {
    type: "scalar",
    offset: emptyScalarPosition(offset, before, pos),
    indent: -1,
    source: ""
  };
  const node = composeScalar(ctx, token, tag, onError);
  if (anchor) {
    node.anchor = anchor.source.substring(1);
    if (node.anchor === "")
      onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
  }
  if (spaceBefore)
    node.spaceBefore = true;
  if (comment) {
    node.comment = comment;
    node.range[2] = end;
  }
  return node;
}
function composeAlias({ options }, { offset, source, end }, onError) {
  const alias = new Alias(source.substring(1));
  if (alias.source === "")
    onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
  if (alias.source.endsWith(":"))
    onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
  const valueEnd = offset + source.length;
  const re = resolveEnd(end, valueEnd, options.strict, onError);
  alias.range = [offset, valueEnd, re.offset];
  if (re.comment)
    alias.comment = re.comment;
  return alias;
}

// ../node_modules/yaml/browser/dist/compose/compose-doc.js
function composeDoc(options, directives, { offset, start, value, end }, onError) {
  const opts = Object.assign({ _directives: directives }, options);
  const doc2 = new Document(void 0, opts);
  const ctx = {
    atKey: false,
    atRoot: true,
    directives: doc2.directives,
    options: doc2.options,
    schema: doc2.schema
  };
  const props = resolveProps(start, {
    indicator: "doc-start",
    next: value ?? end?.[0],
    offset,
    onError,
    parentIndent: 0,
    startOnNewline: true
  });
  if (props.found) {
    doc2.directives.docStart = true;
    if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
      onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
  }
  doc2.contents = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
  const contentEnd = doc2.contents.range[2];
  const re = resolveEnd(end, contentEnd, false, onError);
  if (re.comment)
    doc2.comment = re.comment;
  doc2.range = [offset, contentEnd, re.offset];
  return doc2;
}

// ../node_modules/yaml/browser/dist/compose/composer.js
function getErrorPos(src) {
  if (typeof src === "number")
    return [src, src + 1];
  if (Array.isArray(src))
    return src.length === 2 ? src : [src[0], src[1]];
  const { offset, source } = src;
  return [offset, offset + (typeof source === "string" ? source.length : 1)];
}
function parsePrelude(prelude) {
  let comment = "";
  let atComment = false;
  let afterEmptyLine = false;
  for (let i = 0; i < prelude.length; ++i) {
    const source = prelude[i];
    switch (source[0]) {
      case "#":
        comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
        atComment = true;
        afterEmptyLine = false;
        break;
      case "%":
        if (prelude[i + 1]?.[0] !== "#")
          i += 1;
        atComment = false;
        break;
      default:
        if (!atComment)
          afterEmptyLine = true;
        atComment = false;
    }
  }
  return { comment, afterEmptyLine };
}
var Composer = class {
  constructor(options = {}) {
    this.doc = null;
    this.atDirectives = false;
    this.prelude = [];
    this.errors = [];
    this.warnings = [];
    this.onError = (source, code, message, warning) => {
      const pos = getErrorPos(source);
      if (warning)
        this.warnings.push(new YAMLWarning(pos, code, message));
      else
        this.errors.push(new YAMLParseError(pos, code, message));
    };
    this.directives = new Directives({ version: options.version || "1.2" });
    this.options = options;
  }
  decorate(doc2, afterDoc) {
    const { comment, afterEmptyLine } = parsePrelude(this.prelude);
    if (comment) {
      const dc = doc2.contents;
      if (afterDoc) {
        doc2.comment = doc2.comment ? `${doc2.comment}
${comment}` : comment;
      } else if (afterEmptyLine || doc2.directives.docStart || !dc) {
        doc2.commentBefore = comment;
      } else if (isCollection(dc) && !dc.flow && dc.items.length > 0) {
        let it = dc.items[0];
        if (isPair(it))
          it = it.key;
        const cb = it.commentBefore;
        it.commentBefore = cb ? `${comment}
${cb}` : comment;
      } else {
        const cb = dc.commentBefore;
        dc.commentBefore = cb ? `${comment}
${cb}` : comment;
      }
    }
    if (afterDoc) {
      for (let i = 0; i < this.errors.length; ++i)
        doc2.errors.push(this.errors[i]);
      for (let i = 0; i < this.warnings.length; ++i)
        doc2.warnings.push(this.warnings[i]);
    } else {
      doc2.errors = this.errors;
      doc2.warnings = this.warnings;
    }
    this.prelude = [];
    this.errors = [];
    this.warnings = [];
  }
  /**
   * Current stream status information.
   *
   * Mostly useful at the end of input for an empty stream.
   */
  streamInfo() {
    return {
      comment: parsePrelude(this.prelude).comment,
      directives: this.directives,
      errors: this.errors,
      warnings: this.warnings
    };
  }
  /**
   * Compose tokens into documents.
   *
   * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
   * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
   */
  *compose(tokens, forceDoc = false, endOffset = -1) {
    for (const token of tokens)
      yield* this.next(token);
    yield* this.end(forceDoc, endOffset);
  }
  /** Advance the composer by one CST token. */
  *next(token) {
    switch (token.type) {
      case "directive":
        this.directives.add(token.source, (offset, message, warning) => {
          const pos = getErrorPos(token);
          pos[0] += offset;
          this.onError(pos, "BAD_DIRECTIVE", message, warning);
        });
        this.prelude.push(token.source);
        this.atDirectives = true;
        break;
      case "document": {
        const doc2 = composeDoc(this.options, this.directives, token, this.onError);
        if (this.atDirectives && !doc2.directives.docStart)
          this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
        this.decorate(doc2, false);
        if (this.doc)
          yield this.doc;
        this.doc = doc2;
        this.atDirectives = false;
        break;
      }
      case "byte-order-mark":
      case "space":
        break;
      case "comment":
      case "newline":
        this.prelude.push(token.source);
        break;
      case "error": {
        const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
        const error = new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
        if (this.atDirectives || !this.doc)
          this.errors.push(error);
        else
          this.doc.errors.push(error);
        break;
      }
      case "doc-end": {
        if (!this.doc) {
          const msg = "Unexpected doc-end without preceding document";
          this.errors.push(new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
          break;
        }
        this.doc.directives.docEnd = true;
        const end = resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
        this.decorate(this.doc, true);
        if (end.comment) {
          const dc = this.doc.comment;
          this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
        }
        this.doc.range[2] = end.offset;
        break;
      }
      default:
        this.errors.push(new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
    }
  }
  /**
   * Call at end of input to yield any remaining document.
   *
   * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
   * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
   */
  *end(forceDoc = false, endOffset = -1) {
    if (this.doc) {
      this.decorate(this.doc, true);
      yield this.doc;
      this.doc = null;
    } else if (forceDoc) {
      const opts = Object.assign({ _directives: this.directives }, this.options);
      const doc2 = new Document(void 0, opts);
      if (this.atDirectives)
        this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
      doc2.range = [0, endOffset, endOffset];
      this.decorate(doc2, false);
      yield doc2;
    }
  }
};

// ../node_modules/yaml/browser/dist/parse/cst.js
var cst_exports = {};
__export(cst_exports, {
  BOM: () => BOM,
  DOCUMENT: () => DOCUMENT,
  FLOW_END: () => FLOW_END,
  SCALAR: () => SCALAR2,
  createScalarToken: () => createScalarToken,
  isCollection: () => isCollection2,
  isScalar: () => isScalar2,
  prettyToken: () => prettyToken,
  resolveAsScalar: () => resolveAsScalar,
  setScalarValue: () => setScalarValue,
  stringify: () => stringify2,
  tokenType: () => tokenType,
  visit: () => visit2
});

// ../node_modules/yaml/browser/dist/parse/cst-scalar.js
function resolveAsScalar(token, strict = true, onError) {
  if (token) {
    const _onError = (pos, code, message) => {
      const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
      if (onError)
        onError(offset, code, message);
      else
        throw new YAMLParseError([offset, offset + 1], code, message);
    };
    switch (token.type) {
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return resolveFlowScalar(token, strict, _onError);
      case "block-scalar":
        return resolveBlockScalar({ options: { strict } }, token, _onError);
    }
  }
  return null;
}
function createScalarToken(value, context) {
  const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
  const source = stringifyString({ type, value }, {
    implicitKey,
    indent: indent > 0 ? " ".repeat(indent) : "",
    inFlow,
    options: { blockQuote: true, lineWidth: -1 }
  });
  const end = context.end ?? [
    { type: "newline", offset: -1, indent, source: "\n" }
  ];
  switch (source[0]) {
    case "|":
    case ">": {
      const he = source.indexOf("\n");
      const head = source.substring(0, he);
      const body = source.substring(he + 1) + "\n";
      const props = [
        { type: "block-scalar-header", offset, indent, source: head }
      ];
      if (!addEndtoBlockProps(props, end))
        props.push({ type: "newline", offset: -1, indent, source: "\n" });
      return { type: "block-scalar", offset, indent, props, source: body };
    }
    case '"':
      return { type: "double-quoted-scalar", offset, indent, source, end };
    case "'":
      return { type: "single-quoted-scalar", offset, indent, source, end };
    default:
      return { type: "scalar", offset, indent, source, end };
  }
}
function setScalarValue(token, value, context = {}) {
  let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
  let indent = "indent" in token ? token.indent : null;
  if (afterKey && typeof indent === "number")
    indent += 2;
  if (!type)
    switch (token.type) {
      case "single-quoted-scalar":
        type = "QUOTE_SINGLE";
        break;
      case "double-quoted-scalar":
        type = "QUOTE_DOUBLE";
        break;
      case "block-scalar": {
        const header = token.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
        break;
      }
      default:
        type = "PLAIN";
    }
  const source = stringifyString({ type, value }, {
    implicitKey: implicitKey || indent === null,
    indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
    inFlow,
    options: { blockQuote: true, lineWidth: -1 }
  });
  switch (source[0]) {
    case "|":
    case ">":
      setBlockScalarValue(token, source);
      break;
    case '"':
      setFlowScalarValue(token, source, "double-quoted-scalar");
      break;
    case "'":
      setFlowScalarValue(token, source, "single-quoted-scalar");
      break;
    default:
      setFlowScalarValue(token, source, "scalar");
  }
}
function setBlockScalarValue(token, source) {
  const he = source.indexOf("\n");
  const head = source.substring(0, he);
  const body = source.substring(he + 1) + "\n";
  if (token.type === "block-scalar") {
    const header = token.props[0];
    if (header.type !== "block-scalar-header")
      throw new Error("Invalid block scalar header");
    header.source = head;
    token.source = body;
  } else {
    const { offset } = token;
    const indent = "indent" in token ? token.indent : -1;
    const props = [
      { type: "block-scalar-header", offset, indent, source: head }
    ];
    if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
      props.push({ type: "newline", offset: -1, indent, source: "\n" });
    for (const key of Object.keys(token))
      if (key !== "type" && key !== "offset")
        delete token[key];
    Object.assign(token, { type: "block-scalar", indent, props, source: body });
  }
}
function addEndtoBlockProps(props, end) {
  if (end)
    for (const st of end)
      switch (st.type) {
        case "space":
        case "comment":
          props.push(st);
          break;
        case "newline":
          props.push(st);
          return true;
      }
  return false;
}
function setFlowScalarValue(token, source, type) {
  switch (token.type) {
    case "scalar":
    case "double-quoted-scalar":
    case "single-quoted-scalar":
      token.type = type;
      token.source = source;
      break;
    case "block-scalar": {
      const end = token.props.slice(1);
      let oa = source.length;
      if (token.props[0].type === "block-scalar-header")
        oa -= token.props[0].source.length;
      for (const tok of end)
        tok.offset += oa;
      delete token.props;
      Object.assign(token, { type, source, end });
      break;
    }
    case "block-map":
    case "block-seq": {
      const offset = token.offset + source.length;
      const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
      delete token.items;
      Object.assign(token, { type, source, end: [nl] });
      break;
    }
    default: {
      const indent = "indent" in token ? token.indent : -1;
      const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
      for (const key of Object.keys(token))
        if (key !== "type" && key !== "offset")
          delete token[key];
      Object.assign(token, { type, indent, source, end });
    }
  }
}

// ../node_modules/yaml/browser/dist/parse/cst-stringify.js
var stringify2 = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
function stringifyToken(token) {
  switch (token.type) {
    case "block-scalar": {
      let res = "";
      for (const tok of token.props)
        res += stringifyToken(tok);
      return res + token.source;
    }
    case "block-map":
    case "block-seq": {
      let res = "";
      for (const item of token.items)
        res += stringifyItem(item);
      return res;
    }
    case "flow-collection": {
      let res = token.start.source;
      for (const item of token.items)
        res += stringifyItem(item);
      for (const st of token.end)
        res += st.source;
      return res;
    }
    case "document": {
      let res = stringifyItem(token);
      if (token.end)
        for (const st of token.end)
          res += st.source;
      return res;
    }
    default: {
      let res = token.source;
      if ("end" in token && token.end)
        for (const st of token.end)
          res += st.source;
      return res;
    }
  }
}
function stringifyItem({ start, key, sep, value }) {
  let res = "";
  for (const st of start)
    res += st.source;
  if (key)
    res += stringifyToken(key);
  if (sep)
    for (const st of sep)
      res += st.source;
  if (value)
    res += stringifyToken(value);
  return res;
}

// ../node_modules/yaml/browser/dist/parse/cst-visit.js
var BREAK2 = Symbol("break visit");
var SKIP2 = Symbol("skip children");
var REMOVE2 = Symbol("remove item");
function visit2(cst, visitor) {
  if ("type" in cst && cst.type === "document")
    cst = { start: cst.start, value: cst.value };
  _visit(Object.freeze([]), cst, visitor);
}
visit2.BREAK = BREAK2;
visit2.SKIP = SKIP2;
visit2.REMOVE = REMOVE2;
visit2.itemAtPath = (cst, path) => {
  let item = cst;
  for (const [field, index] of path) {
    const tok = item?.[field];
    if (tok && "items" in tok) {
      item = tok.items[index];
    } else
      return void 0;
  }
  return item;
};
visit2.parentCollection = (cst, path) => {
  const parent = visit2.itemAtPath(cst, path.slice(0, -1));
  const field = path[path.length - 1][0];
  const coll = parent?.[field];
  if (coll && "items" in coll)
    return coll;
  throw new Error("Parent collection not found");
};
function _visit(path, item, visitor) {
  let ctrl = visitor(item, path);
  if (typeof ctrl === "symbol")
    return ctrl;
  for (const field of ["key", "value"]) {
    const token = item[field];
    if (token && "items" in token) {
      for (let i = 0; i < token.items.length; ++i) {
        const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
        if (typeof ci === "number")
          i = ci - 1;
        else if (ci === BREAK2)
          return BREAK2;
        else if (ci === REMOVE2) {
          token.items.splice(i, 1);
          i -= 1;
        }
      }
      if (typeof ctrl === "function" && field === "key")
        ctrl = ctrl(item, path);
    }
  }
  return typeof ctrl === "function" ? ctrl(item, path) : ctrl;
}

// ../node_modules/yaml/browser/dist/parse/cst.js
var BOM = "\uFEFF";
var DOCUMENT = "";
var FLOW_END = "";
var SCALAR2 = "";
var isCollection2 = (token) => !!token && "items" in token;
var isScalar2 = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
function prettyToken(token) {
  switch (token) {
    case BOM:
      return "<BOM>";
    case DOCUMENT:
      return "<DOC>";
    case FLOW_END:
      return "<FLOW_END>";
    case SCALAR2:
      return "<SCALAR>";
    default:
      return JSON.stringify(token);
  }
}
function tokenType(source) {
  switch (source) {
    case BOM:
      return "byte-order-mark";
    case DOCUMENT:
      return "doc-mode";
    case FLOW_END:
      return "flow-error-end";
    case SCALAR2:
      return "scalar";
    case "---":
      return "doc-start";
    case "...":
      return "doc-end";
    case "":
    case "\n":
    case "\r\n":
      return "newline";
    case "-":
      return "seq-item-ind";
    case "?":
      return "explicit-key-ind";
    case ":":
      return "map-value-ind";
    case "{":
      return "flow-map-start";
    case "}":
      return "flow-map-end";
    case "[":
      return "flow-seq-start";
    case "]":
      return "flow-seq-end";
    case ",":
      return "comma";
  }
  switch (source[0]) {
    case " ":
    case "	":
      return "space";
    case "#":
      return "comment";
    case "%":
      return "directive-line";
    case "*":
      return "alias";
    case "&":
      return "anchor";
    case "!":
      return "tag";
    case "'":
      return "single-quoted-scalar";
    case '"':
      return "double-quoted-scalar";
    case "|":
    case ">":
      return "block-scalar-header";
  }
  return null;
}

// ../node_modules/yaml/browser/dist/parse/lexer.js
function isEmpty(ch) {
  switch (ch) {
    case void 0:
    case " ":
    case "\n":
    case "\r":
    case "	":
      return true;
    default:
      return false;
  }
}
var hexDigits = new Set("0123456789ABCDEFabcdef");
var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
var flowIndicatorChars = new Set(",[]{}");
var invalidAnchorChars = new Set(" ,[]{}\n\r	");
var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
var Lexer = class {
  constructor() {
    this.atEnd = false;
    this.blockScalarIndent = -1;
    this.blockScalarKeep = false;
    this.buffer = "";
    this.flowKey = false;
    this.flowLevel = 0;
    this.indentNext = 0;
    this.indentValue = 0;
    this.lineEndPos = null;
    this.next = null;
    this.pos = 0;
  }
  /**
   * Generate YAML tokens from the `source` string. If `incomplete`,
   * a part of the last line may be left as a buffer for the next call.
   *
   * @returns A generator of lexical tokens
   */
  *lex(source, incomplete = false) {
    if (source) {
      if (typeof source !== "string")
        throw TypeError("source is not a string");
      this.buffer = this.buffer ? this.buffer + source : source;
      this.lineEndPos = null;
    }
    this.atEnd = !incomplete;
    let next = this.next ?? "stream";
    while (next && (incomplete || this.hasChars(1)))
      next = yield* this.parseNext(next);
  }
  atLineEnd() {
    let i = this.pos;
    let ch = this.buffer[i];
    while (ch === " " || ch === "	")
      ch = this.buffer[++i];
    if (!ch || ch === "#" || ch === "\n")
      return true;
    if (ch === "\r")
      return this.buffer[i + 1] === "\n";
    return false;
  }
  charAt(n) {
    return this.buffer[this.pos + n];
  }
  continueScalar(offset) {
    let ch = this.buffer[offset];
    if (this.indentNext > 0) {
      let indent = 0;
      while (ch === " ")
        ch = this.buffer[++indent + offset];
      if (ch === "\r") {
        const next = this.buffer[indent + offset + 1];
        if (next === "\n" || !next && !this.atEnd)
          return offset + indent + 1;
      }
      return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
    }
    if (ch === "-" || ch === ".") {
      const dt = this.buffer.substr(offset, 3);
      if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
        return -1;
    }
    return offset;
  }
  getLine() {
    let end = this.lineEndPos;
    if (typeof end !== "number" || end !== -1 && end < this.pos) {
      end = this.buffer.indexOf("\n", this.pos);
      this.lineEndPos = end;
    }
    if (end === -1)
      return this.atEnd ? this.buffer.substring(this.pos) : null;
    if (this.buffer[end - 1] === "\r")
      end -= 1;
    return this.buffer.substring(this.pos, end);
  }
  hasChars(n) {
    return this.pos + n <= this.buffer.length;
  }
  setNext(state) {
    this.buffer = this.buffer.substring(this.pos);
    this.pos = 0;
    this.lineEndPos = null;
    this.next = state;
    return null;
  }
  peek(n) {
    return this.buffer.substr(this.pos, n);
  }
  *parseNext(next) {
    switch (next) {
      case "stream":
        return yield* this.parseStream();
      case "line-start":
        return yield* this.parseLineStart();
      case "block-start":
        return yield* this.parseBlockStart();
      case "doc":
        return yield* this.parseDocument();
      case "flow":
        return yield* this.parseFlowCollection();
      case "quoted-scalar":
        return yield* this.parseQuotedScalar();
      case "block-scalar":
        return yield* this.parseBlockScalar();
      case "plain-scalar":
        return yield* this.parsePlainScalar();
    }
  }
  *parseStream() {
    let line = this.getLine();
    if (line === null)
      return this.setNext("stream");
    if (line[0] === BOM) {
      yield* this.pushCount(1);
      line = line.substring(1);
    }
    if (line[0] === "%") {
      let dirEnd = line.length;
      let cs = line.indexOf("#");
      while (cs !== -1) {
        const ch = line[cs - 1];
        if (ch === " " || ch === "	") {
          dirEnd = cs - 1;
          break;
        } else {
          cs = line.indexOf("#", cs + 1);
        }
      }
      while (true) {
        const ch = line[dirEnd - 1];
        if (ch === " " || ch === "	")
          dirEnd -= 1;
        else
          break;
      }
      const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
      yield* this.pushCount(line.length - n);
      this.pushNewline();
      return "stream";
    }
    if (this.atLineEnd()) {
      const sp = yield* this.pushSpaces(true);
      yield* this.pushCount(line.length - sp);
      yield* this.pushNewline();
      return "stream";
    }
    yield DOCUMENT;
    return yield* this.parseLineStart();
  }
  *parseLineStart() {
    const ch = this.charAt(0);
    if (!ch && !this.atEnd)
      return this.setNext("line-start");
    if (ch === "-" || ch === ".") {
      if (!this.atEnd && !this.hasChars(4))
        return this.setNext("line-start");
      const s = this.peek(3);
      if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
        yield* this.pushCount(3);
        this.indentValue = 0;
        this.indentNext = 0;
        return s === "---" ? "doc" : "stream";
      }
    }
    this.indentValue = yield* this.pushSpaces(false);
    if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
      this.indentNext = this.indentValue;
    return yield* this.parseBlockStart();
  }
  *parseBlockStart() {
    const [ch0, ch1] = this.peek(2);
    if (!ch1 && !this.atEnd)
      return this.setNext("block-start");
    if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
      const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
      this.indentNext = this.indentValue + 1;
      this.indentValue += n;
      return "block-start";
    }
    return "doc";
  }
  *parseDocument() {
    yield* this.pushSpaces(true);
    const line = this.getLine();
    if (line === null)
      return this.setNext("doc");
    let n = yield* this.pushIndicators();
    switch (line[n]) {
      case "#":
        yield* this.pushCount(line.length - n);
      // fallthrough
      case void 0:
        yield* this.pushNewline();
        return yield* this.parseLineStart();
      case "{":
      case "[":
        yield* this.pushCount(1);
        this.flowKey = false;
        this.flowLevel = 1;
        return "flow";
      case "}":
      case "]":
        yield* this.pushCount(1);
        return "doc";
      case "*":
        yield* this.pushUntil(isNotAnchorChar);
        return "doc";
      case '"':
      case "'":
        return yield* this.parseQuotedScalar();
      case "|":
      case ">":
        n += yield* this.parseBlockScalarHeader();
        n += yield* this.pushSpaces(true);
        yield* this.pushCount(line.length - n);
        yield* this.pushNewline();
        return yield* this.parseBlockScalar();
      default:
        return yield* this.parsePlainScalar();
    }
  }
  *parseFlowCollection() {
    let nl, sp;
    let indent = -1;
    do {
      nl = yield* this.pushNewline();
      if (nl > 0) {
        sp = yield* this.pushSpaces(false);
        this.indentValue = indent = sp;
      } else {
        sp = 0;
      }
      sp += yield* this.pushSpaces(true);
    } while (nl + sp > 0);
    const line = this.getLine();
    if (line === null)
      return this.setNext("flow");
    if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
      const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
      if (!atFlowEndMarker) {
        this.flowLevel = 0;
        yield FLOW_END;
        return yield* this.parseLineStart();
      }
    }
    let n = 0;
    while (line[n] === ",") {
      n += yield* this.pushCount(1);
      n += yield* this.pushSpaces(true);
      this.flowKey = false;
    }
    n += yield* this.pushIndicators();
    switch (line[n]) {
      case void 0:
        return "flow";
      case "#":
        yield* this.pushCount(line.length - n);
        return "flow";
      case "{":
      case "[":
        yield* this.pushCount(1);
        this.flowKey = false;
        this.flowLevel += 1;
        return "flow";
      case "}":
      case "]":
        yield* this.pushCount(1);
        this.flowKey = true;
        this.flowLevel -= 1;
        return this.flowLevel ? "flow" : "doc";
      case "*":
        yield* this.pushUntil(isNotAnchorChar);
        return "flow";
      case '"':
      case "'":
        this.flowKey = true;
        return yield* this.parseQuotedScalar();
      case ":": {
        const next = this.charAt(1);
        if (this.flowKey || isEmpty(next) || next === ",") {
          this.flowKey = false;
          yield* this.pushCount(1);
          yield* this.pushSpaces(true);
          return "flow";
        }
      }
      // fallthrough
      default:
        this.flowKey = false;
        return yield* this.parsePlainScalar();
    }
  }
  *parseQuotedScalar() {
    const quote = this.charAt(0);
    let end = this.buffer.indexOf(quote, this.pos + 1);
    if (quote === "'") {
      while (end !== -1 && this.buffer[end + 1] === "'")
        end = this.buffer.indexOf("'", end + 2);
    } else {
      while (end !== -1) {
        let n = 0;
        while (this.buffer[end - 1 - n] === "\\")
          n += 1;
        if (n % 2 === 0)
          break;
        end = this.buffer.indexOf('"', end + 1);
      }
    }
    const qb = this.buffer.substring(0, end);
    let nl = qb.indexOf("\n", this.pos);
    if (nl !== -1) {
      while (nl !== -1) {
        const cs = this.continueScalar(nl + 1);
        if (cs === -1)
          break;
        nl = qb.indexOf("\n", cs);
      }
      if (nl !== -1) {
        end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
      }
    }
    if (end === -1) {
      if (!this.atEnd)
        return this.setNext("quoted-scalar");
      end = this.buffer.length;
    }
    yield* this.pushToIndex(end + 1, false);
    return this.flowLevel ? "flow" : "doc";
  }
  *parseBlockScalarHeader() {
    this.blockScalarIndent = -1;
    this.blockScalarKeep = false;
    let i = this.pos;
    while (true) {
      const ch = this.buffer[++i];
      if (ch === "+")
        this.blockScalarKeep = true;
      else if (ch > "0" && ch <= "9")
        this.blockScalarIndent = Number(ch) - 1;
      else if (ch !== "-")
        break;
    }
    return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
  }
  *parseBlockScalar() {
    let nl = this.pos - 1;
    let indent = 0;
    let ch;
    loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
      switch (ch) {
        case " ":
          indent += 1;
          break;
        case "\n":
          nl = i2;
          indent = 0;
          break;
        case "\r": {
          const next = this.buffer[i2 + 1];
          if (!next && !this.atEnd)
            return this.setNext("block-scalar");
          if (next === "\n")
            break;
        }
        // fallthrough
        default:
          break loop;
      }
    }
    if (!ch && !this.atEnd)
      return this.setNext("block-scalar");
    if (indent >= this.indentNext) {
      if (this.blockScalarIndent === -1)
        this.indentNext = indent;
      else {
        this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
      }
      do {
        const cs = this.continueScalar(nl + 1);
        if (cs === -1)
          break;
        nl = this.buffer.indexOf("\n", cs);
      } while (nl !== -1);
      if (nl === -1) {
        if (!this.atEnd)
          return this.setNext("block-scalar");
        nl = this.buffer.length;
      }
    }
    let i = nl + 1;
    ch = this.buffer[i];
    while (ch === " ")
      ch = this.buffer[++i];
    if (ch === "	") {
      while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
        ch = this.buffer[++i];
      nl = i - 1;
    } else if (!this.blockScalarKeep) {
      do {
        let i2 = nl - 1;
        let ch2 = this.buffer[i2];
        if (ch2 === "\r")
          ch2 = this.buffer[--i2];
        const lastChar = i2;
        while (ch2 === " ")
          ch2 = this.buffer[--i2];
        if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
          nl = i2;
        else
          break;
      } while (true);
    }
    yield SCALAR2;
    yield* this.pushToIndex(nl + 1, true);
    return yield* this.parseLineStart();
  }
  *parsePlainScalar() {
    const inFlow = this.flowLevel > 0;
    let end = this.pos - 1;
    let i = this.pos - 1;
    let ch;
    while (ch = this.buffer[++i]) {
      if (ch === ":") {
        const next = this.buffer[i + 1];
        if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
          break;
        end = i;
      } else if (isEmpty(ch)) {
        let next = this.buffer[i + 1];
        if (ch === "\r") {
          if (next === "\n") {
            i += 1;
            ch = "\n";
            next = this.buffer[i + 1];
          } else
            end = i;
        }
        if (next === "#" || inFlow && flowIndicatorChars.has(next))
          break;
        if (ch === "\n") {
          const cs = this.continueScalar(i + 1);
          if (cs === -1)
            break;
          i = Math.max(i, cs - 2);
        }
      } else {
        if (inFlow && flowIndicatorChars.has(ch))
          break;
        end = i;
      }
    }
    if (!ch && !this.atEnd)
      return this.setNext("plain-scalar");
    yield SCALAR2;
    yield* this.pushToIndex(end + 1, true);
    return inFlow ? "flow" : "doc";
  }
  *pushCount(n) {
    if (n > 0) {
      yield this.buffer.substr(this.pos, n);
      this.pos += n;
      return n;
    }
    return 0;
  }
  *pushToIndex(i, allowEmpty) {
    const s = this.buffer.slice(this.pos, i);
    if (s) {
      yield s;
      this.pos += s.length;
      return s.length;
    } else if (allowEmpty)
      yield "";
    return 0;
  }
  *pushIndicators() {
    let n = 0;
    loop: while (true) {
      switch (this.charAt(0)) {
        case "!":
          n += yield* this.pushTag();
          n += yield* this.pushSpaces(true);
          continue loop;
        case "&":
          n += yield* this.pushUntil(isNotAnchorChar);
          n += yield* this.pushSpaces(true);
          continue loop;
        case "-":
        // this is an error
        case "?":
        // this is an error outside flow collections
        case ":": {
          const inFlow = this.flowLevel > 0;
          const ch1 = this.charAt(1);
          if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
            if (!inFlow)
              this.indentNext = this.indentValue + 1;
            else if (this.flowKey)
              this.flowKey = false;
            n += yield* this.pushCount(1);
            n += yield* this.pushSpaces(true);
            continue loop;
          }
        }
      }
      break loop;
    }
    return n;
  }
  *pushTag() {
    if (this.charAt(1) === "<") {
      let i = this.pos + 2;
      let ch = this.buffer[i];
      while (!isEmpty(ch) && ch !== ">")
        ch = this.buffer[++i];
      return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
    } else {
      let i = this.pos + 1;
      let ch = this.buffer[i];
      while (ch) {
        if (tagChars.has(ch))
          ch = this.buffer[++i];
        else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
          ch = this.buffer[i += 3];
        } else
          break;
      }
      return yield* this.pushToIndex(i, false);
    }
  }
  *pushNewline() {
    const ch = this.buffer[this.pos];
    if (ch === "\n")
      return yield* this.pushCount(1);
    else if (ch === "\r" && this.charAt(1) === "\n")
      return yield* this.pushCount(2);
    else
      return 0;
  }
  *pushSpaces(allowTabs) {
    let i = this.pos - 1;
    let ch;
    do {
      ch = this.buffer[++i];
    } while (ch === " " || allowTabs && ch === "	");
    const n = i - this.pos;
    if (n > 0) {
      yield this.buffer.substr(this.pos, n);
      this.pos = i;
    }
    return n;
  }
  *pushUntil(test) {
    let i = this.pos;
    let ch = this.buffer[i];
    while (!test(ch))
      ch = this.buffer[++i];
    return yield* this.pushToIndex(i, false);
  }
};

// ../node_modules/yaml/browser/dist/parse/line-counter.js
var LineCounter = class {
  constructor() {
    this.lineStarts = [];
    this.addNewLine = (offset) => this.lineStarts.push(offset);
    this.linePos = (offset) => {
      let low = 0;
      let high = this.lineStarts.length;
      while (low < high) {
        const mid = low + high >> 1;
        if (this.lineStarts[mid] < offset)
          low = mid + 1;
        else
          high = mid;
      }
      if (this.lineStarts[low] === offset)
        return { line: low + 1, col: 1 };
      if (low === 0)
        return { line: 0, col: offset };
      const start = this.lineStarts[low - 1];
      return { line: low, col: offset - start + 1 };
    };
  }
};

// ../node_modules/yaml/browser/dist/parse/parser.js
function includesToken(list, type) {
  for (let i = 0; i < list.length; ++i)
    if (list[i].type === type)
      return true;
  return false;
}
function findNonEmptyIndex(list) {
  for (let i = 0; i < list.length; ++i) {
    switch (list[i].type) {
      case "space":
      case "comment":
      case "newline":
        break;
      default:
        return i;
    }
  }
  return -1;
}
function isFlowToken(token) {
  switch (token?.type) {
    case "alias":
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "flow-collection":
      return true;
    default:
      return false;
  }
}
function getPrevProps(parent) {
  switch (parent.type) {
    case "document":
      return parent.start;
    case "block-map": {
      const it = parent.items[parent.items.length - 1];
      return it.sep ?? it.start;
    }
    case "block-seq":
      return parent.items[parent.items.length - 1].start;
    /* istanbul ignore next should not happen */
    default:
      return [];
  }
}
function getFirstKeyStartProps(prev) {
  if (prev.length === 0)
    return [];
  let i = prev.length;
  loop: while (--i >= 0) {
    switch (prev[i].type) {
      case "doc-start":
      case "explicit-key-ind":
      case "map-value-ind":
      case "seq-item-ind":
      case "newline":
        break loop;
    }
  }
  while (prev[++i]?.type === "space") {
  }
  return prev.splice(i, prev.length);
}
function arrayPushArray(target, source) {
  if (source.length < 1e5)
    Array.prototype.push.apply(target, source);
  else
    for (let i = 0; i < source.length; ++i)
      target.push(source[i]);
}
function fixFlowSeqItems(fc) {
  if (fc.start.type === "flow-seq-start") {
    for (const it of fc.items) {
      if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
        if (it.key)
          it.value = it.key;
        delete it.key;
        if (isFlowToken(it.value)) {
          if (it.value.end)
            arrayPushArray(it.value.end, it.sep);
          else
            it.value.end = it.sep;
        } else
          arrayPushArray(it.start, it.sep);
        delete it.sep;
      }
    }
  }
}
var Parser = class {
  /**
   * @param onNewLine - If defined, called separately with the start position of
   *   each new line (in `parse()`, including the start of input).
   */
  constructor(onNewLine) {
    this.atNewLine = true;
    this.atScalar = false;
    this.indent = 0;
    this.offset = 0;
    this.onKeyLine = false;
    this.stack = [];
    this.source = "";
    this.type = "";
    this.lexer = new Lexer();
    this.onNewLine = onNewLine;
  }
  /**
   * Parse `source` as a YAML stream.
   * If `incomplete`, a part of the last line may be left as a buffer for the next call.
   *
   * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
   *
   * @returns A generator of tokens representing each directive, document, and other structure.
   */
  *parse(source, incomplete = false) {
    if (this.onNewLine && this.offset === 0)
      this.onNewLine(0);
    for (const lexeme of this.lexer.lex(source, incomplete))
      yield* this.next(lexeme);
    if (!incomplete)
      yield* this.end();
  }
  /**
   * Advance the parser by the `source` of one lexical token.
   */
  *next(source) {
    this.source = source;
    if (this.atScalar) {
      this.atScalar = false;
      yield* this.step();
      this.offset += source.length;
      return;
    }
    const type = tokenType(source);
    if (!type) {
      const message = `Not a YAML token: ${source}`;
      yield* this.pop({ type: "error", offset: this.offset, message, source });
      this.offset += source.length;
    } else if (type === "scalar") {
      this.atNewLine = false;
      this.atScalar = true;
      this.type = "scalar";
    } else {
      this.type = type;
      yield* this.step();
      switch (type) {
        case "newline":
          this.atNewLine = true;
          this.indent = 0;
          if (this.onNewLine)
            this.onNewLine(this.offset + source.length);
          break;
        case "space":
          if (this.atNewLine && source[0] === " ")
            this.indent += source.length;
          break;
        case "explicit-key-ind":
        case "map-value-ind":
        case "seq-item-ind":
          if (this.atNewLine)
            this.indent += source.length;
          break;
        case "doc-mode":
        case "flow-error-end":
          return;
        default:
          this.atNewLine = false;
      }
      this.offset += source.length;
    }
  }
  /** Call at end of input to push out any remaining constructions */
  *end() {
    while (this.stack.length > 0)
      yield* this.pop();
  }
  get sourceToken() {
    const st = {
      type: this.type,
      offset: this.offset,
      indent: this.indent,
      source: this.source
    };
    return st;
  }
  *step() {
    const top = this.peek(1);
    if (this.type === "doc-end" && top?.type !== "doc-end") {
      while (this.stack.length > 0)
        yield* this.pop();
      this.stack.push({
        type: "doc-end",
        offset: this.offset,
        source: this.source
      });
      return;
    }
    if (!top)
      return yield* this.stream();
    switch (top.type) {
      case "document":
        return yield* this.document(top);
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return yield* this.scalar(top);
      case "block-scalar":
        return yield* this.blockScalar(top);
      case "block-map":
        return yield* this.blockMap(top);
      case "block-seq":
        return yield* this.blockSequence(top);
      case "flow-collection":
        return yield* this.flowCollection(top);
      case "doc-end":
        return yield* this.documentEnd(top);
    }
    yield* this.pop();
  }
  peek(n) {
    return this.stack[this.stack.length - n];
  }
  *pop(error) {
    const token = error ?? this.stack.pop();
    if (!token) {
      const message = "Tried to pop an empty stack";
      yield { type: "error", offset: this.offset, source: "", message };
    } else if (this.stack.length === 0) {
      yield token;
    } else {
      const top = this.peek(1);
      if (token.type === "block-scalar") {
        token.indent = "indent" in top ? top.indent : 0;
      } else if (token.type === "flow-collection" && top.type === "document") {
        token.indent = 0;
      }
      if (token.type === "flow-collection")
        fixFlowSeqItems(token);
      switch (top.type) {
        case "document":
          top.value = token;
          break;
        case "block-scalar":
          top.props.push(token);
          break;
        case "block-map": {
          const it = top.items[top.items.length - 1];
          if (it.value) {
            top.items.push({ start: [], key: token, sep: [] });
            this.onKeyLine = true;
            return;
          } else if (it.sep) {
            it.value = token;
          } else {
            Object.assign(it, { key: token, sep: [] });
            this.onKeyLine = !it.explicitKey;
            return;
          }
          break;
        }
        case "block-seq": {
          const it = top.items[top.items.length - 1];
          if (it.value)
            top.items.push({ start: [], value: token });
          else
            it.value = token;
          break;
        }
        case "flow-collection": {
          const it = top.items[top.items.length - 1];
          if (!it || it.value)
            top.items.push({ start: [], key: token, sep: [] });
          else if (it.sep)
            it.value = token;
          else
            Object.assign(it, { key: token, sep: [] });
          return;
        }
        /* istanbul ignore next should not happen */
        default:
          yield* this.pop();
          yield* this.pop(token);
      }
      if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
        const last = token.items[token.items.length - 1];
        if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
          if (top.type === "document")
            top.end = last.start;
          else
            top.items.push({ start: last.start });
          token.items.splice(-1, 1);
        }
      }
    }
  }
  *stream() {
    switch (this.type) {
      case "directive-line":
        yield { type: "directive", offset: this.offset, source: this.source };
        return;
      case "byte-order-mark":
      case "space":
      case "comment":
      case "newline":
        yield this.sourceToken;
        return;
      case "doc-mode":
      case "doc-start": {
        const doc2 = {
          type: "document",
          offset: this.offset,
          start: []
        };
        if (this.type === "doc-start")
          doc2.start.push(this.sourceToken);
        this.stack.push(doc2);
        return;
      }
    }
    yield {
      type: "error",
      offset: this.offset,
      message: `Unexpected ${this.type} token in YAML stream`,
      source: this.source
    };
  }
  *document(doc2) {
    if (doc2.value)
      return yield* this.lineEnd(doc2);
    switch (this.type) {
      case "doc-start": {
        if (findNonEmptyIndex(doc2.start) !== -1) {
          yield* this.pop();
          yield* this.step();
        } else
          doc2.start.push(this.sourceToken);
        return;
      }
      case "anchor":
      case "tag":
      case "space":
      case "comment":
      case "newline":
        doc2.start.push(this.sourceToken);
        return;
    }
    const bv = this.startBlockValue(doc2);
    if (bv)
      this.stack.push(bv);
    else {
      yield {
        type: "error",
        offset: this.offset,
        message: `Unexpected ${this.type} token in YAML document`,
        source: this.source
      };
    }
  }
  *scalar(scalar) {
    if (this.type === "map-value-ind") {
      const prev = getPrevProps(this.peek(2));
      const start = getFirstKeyStartProps(prev);
      let sep;
      if (scalar.end) {
        sep = scalar.end;
        sep.push(this.sourceToken);
        delete scalar.end;
      } else
        sep = [this.sourceToken];
      const map3 = {
        type: "block-map",
        offset: scalar.offset,
        indent: scalar.indent,
        items: [{ start, key: scalar, sep }]
      };
      this.onKeyLine = true;
      this.stack[this.stack.length - 1] = map3;
    } else
      yield* this.lineEnd(scalar);
  }
  *blockScalar(scalar) {
    switch (this.type) {
      case "space":
      case "comment":
      case "newline":
        scalar.props.push(this.sourceToken);
        return;
      case "scalar":
        scalar.source = this.source;
        this.atNewLine = true;
        this.indent = 0;
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        yield* this.pop();
        break;
      /* istanbul ignore next should not happen */
      default:
        yield* this.pop();
        yield* this.step();
    }
  }
  *blockMap(map3) {
    const it = map3.items[map3.items.length - 1];
    switch (this.type) {
      case "newline":
        this.onKeyLine = false;
        if (it.value) {
          const end = "end" in it.value ? it.value.end : void 0;
          const last = Array.isArray(end) ? end[end.length - 1] : void 0;
          if (last?.type === "comment")
            end?.push(this.sourceToken);
          else
            map3.items.push({ start: [this.sourceToken] });
        } else if (it.sep) {
          it.sep.push(this.sourceToken);
        } else {
          it.start.push(this.sourceToken);
        }
        return;
      case "space":
      case "comment":
        if (it.value) {
          map3.items.push({ start: [this.sourceToken] });
        } else if (it.sep) {
          it.sep.push(this.sourceToken);
        } else {
          if (this.atIndentedComment(it.start, map3.indent)) {
            const prev = map3.items[map3.items.length - 2];
            const end = prev?.value?.end;
            if (Array.isArray(end)) {
              arrayPushArray(end, it.start);
              end.push(this.sourceToken);
              map3.items.pop();
              return;
            }
          }
          it.start.push(this.sourceToken);
        }
        return;
    }
    if (this.indent >= map3.indent) {
      const atMapIndent = !this.onKeyLine && this.indent === map3.indent;
      const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
      let start = [];
      if (atNextItem && it.sep && !it.value) {
        const nl = [];
        for (let i = 0; i < it.sep.length; ++i) {
          const st = it.sep[i];
          switch (st.type) {
            case "newline":
              nl.push(i);
              break;
            case "space":
              break;
            case "comment":
              if (st.indent > map3.indent)
                nl.length = 0;
              break;
            default:
              nl.length = 0;
          }
        }
        if (nl.length >= 2)
          start = it.sep.splice(nl[1]);
      }
      switch (this.type) {
        case "anchor":
        case "tag":
          if (atNextItem || it.value) {
            start.push(this.sourceToken);
            map3.items.push({ start });
            this.onKeyLine = true;
          } else if (it.sep) {
            it.sep.push(this.sourceToken);
          } else {
            it.start.push(this.sourceToken);
          }
          return;
        case "explicit-key-ind":
          if (!it.sep && !it.explicitKey) {
            it.start.push(this.sourceToken);
            it.explicitKey = true;
          } else if (atNextItem || it.value) {
            start.push(this.sourceToken);
            map3.items.push({ start, explicitKey: true });
          } else {
            this.stack.push({
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken], explicitKey: true }]
            });
          }
          this.onKeyLine = true;
          return;
        case "map-value-ind":
          if (it.explicitKey) {
            if (!it.sep) {
              if (includesToken(it.start, "newline")) {
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              } else {
                const start2 = getFirstKeyStartProps(it.start);
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                });
              }
            } else if (it.value) {
              map3.items.push({ start: [], key: null, sep: [this.sourceToken] });
            } else if (includesToken(it.sep, "map-value-ind")) {
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start, key: null, sep: [this.sourceToken] }]
              });
            } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
              const start2 = getFirstKeyStartProps(it.start);
              const key = it.key;
              const sep = it.sep;
              sep.push(this.sourceToken);
              delete it.key;
              delete it.sep;
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: start2, key, sep }]
              });
            } else if (start.length > 0) {
              it.sep = it.sep.concat(start, this.sourceToken);
            } else {
              it.sep.push(this.sourceToken);
            }
          } else {
            if (!it.sep) {
              Object.assign(it, { key: null, sep: [this.sourceToken] });
            } else if (it.value || atNextItem) {
              map3.items.push({ start, key: null, sep: [this.sourceToken] });
            } else if (includesToken(it.sep, "map-value-ind")) {
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: [], key: null, sep: [this.sourceToken] }]
              });
            } else {
              it.sep.push(this.sourceToken);
            }
          }
          this.onKeyLine = true;
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const fs = this.flowScalar(this.type);
          if (atNextItem || it.value) {
            map3.items.push({ start, key: fs, sep: [] });
            this.onKeyLine = true;
          } else if (it.sep) {
            this.stack.push(fs);
          } else {
            Object.assign(it, { key: fs, sep: [] });
            this.onKeyLine = true;
          }
          return;
        }
        default: {
          const bv = this.startBlockValue(map3);
          if (bv) {
            if (bv.type === "block-seq") {
              if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                yield* this.pop({
                  type: "error",
                  offset: this.offset,
                  message: "Unexpected block-seq-ind on same line with key",
                  source: this.source
                });
                return;
              }
            } else if (atMapIndent) {
              map3.items.push({ start });
            }
            this.stack.push(bv);
            return;
          }
        }
      }
    }
    yield* this.pop();
    yield* this.step();
  }
  *blockSequence(seq2) {
    const it = seq2.items[seq2.items.length - 1];
    switch (this.type) {
      case "newline":
        if (it.value) {
          const end = "end" in it.value ? it.value.end : void 0;
          const last = Array.isArray(end) ? end[end.length - 1] : void 0;
          if (last?.type === "comment")
            end?.push(this.sourceToken);
          else
            seq2.items.push({ start: [this.sourceToken] });
        } else
          it.start.push(this.sourceToken);
        return;
      case "space":
      case "comment":
        if (it.value)
          seq2.items.push({ start: [this.sourceToken] });
        else {
          if (this.atIndentedComment(it.start, seq2.indent)) {
            const prev = seq2.items[seq2.items.length - 2];
            const end = prev?.value?.end;
            if (Array.isArray(end)) {
              arrayPushArray(end, it.start);
              end.push(this.sourceToken);
              seq2.items.pop();
              return;
            }
          }
          it.start.push(this.sourceToken);
        }
        return;
      case "anchor":
      case "tag":
        if (it.value || this.indent <= seq2.indent)
          break;
        it.start.push(this.sourceToken);
        return;
      case "seq-item-ind":
        if (this.indent !== seq2.indent)
          break;
        if (it.value || includesToken(it.start, "seq-item-ind"))
          seq2.items.push({ start: [this.sourceToken] });
        else
          it.start.push(this.sourceToken);
        return;
    }
    if (this.indent > seq2.indent) {
      const bv = this.startBlockValue(seq2);
      if (bv) {
        this.stack.push(bv);
        return;
      }
    }
    yield* this.pop();
    yield* this.step();
  }
  *flowCollection(fc) {
    const it = fc.items[fc.items.length - 1];
    if (this.type === "flow-error-end") {
      let top;
      do {
        yield* this.pop();
        top = this.peek(1);
      } while (top?.type === "flow-collection");
    } else if (fc.end.length === 0) {
      switch (this.type) {
        case "comma":
        case "explicit-key-ind":
          if (!it || it.sep)
            fc.items.push({ start: [this.sourceToken] });
          else
            it.start.push(this.sourceToken);
          return;
        case "map-value-ind":
          if (!it || it.value)
            fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
          else if (it.sep)
            it.sep.push(this.sourceToken);
          else
            Object.assign(it, { key: null, sep: [this.sourceToken] });
          return;
        case "space":
        case "comment":
        case "newline":
        case "anchor":
        case "tag":
          if (!it || it.value)
            fc.items.push({ start: [this.sourceToken] });
          else if (it.sep)
            it.sep.push(this.sourceToken);
          else
            it.start.push(this.sourceToken);
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const fs = this.flowScalar(this.type);
          if (!it || it.value)
            fc.items.push({ start: [], key: fs, sep: [] });
          else if (it.sep)
            this.stack.push(fs);
          else
            Object.assign(it, { key: fs, sep: [] });
          return;
        }
        case "flow-map-end":
        case "flow-seq-end":
          fc.end.push(this.sourceToken);
          return;
      }
      const bv = this.startBlockValue(fc);
      if (bv)
        this.stack.push(bv);
      else {
        yield* this.pop();
        yield* this.step();
      }
    } else {
      const parent = this.peek(2);
      if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
        yield* this.pop();
        yield* this.step();
      } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
        const prev = getPrevProps(parent);
        const start = getFirstKeyStartProps(prev);
        fixFlowSeqItems(fc);
        const sep = fc.end.splice(1, fc.end.length);
        sep.push(this.sourceToken);
        const map3 = {
          type: "block-map",
          offset: fc.offset,
          indent: fc.indent,
          items: [{ start, key: fc, sep }]
        };
        this.onKeyLine = true;
        this.stack[this.stack.length - 1] = map3;
      } else {
        yield* this.lineEnd(fc);
      }
    }
  }
  flowScalar(type) {
    if (this.onNewLine) {
      let nl = this.source.indexOf("\n") + 1;
      while (nl !== 0) {
        this.onNewLine(this.offset + nl);
        nl = this.source.indexOf("\n", nl) + 1;
      }
    }
    return {
      type,
      offset: this.offset,
      indent: this.indent,
      source: this.source
    };
  }
  startBlockValue(parent) {
    switch (this.type) {
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return this.flowScalar(this.type);
      case "block-scalar-header":
        return {
          type: "block-scalar",
          offset: this.offset,
          indent: this.indent,
          props: [this.sourceToken],
          source: ""
        };
      case "flow-map-start":
      case "flow-seq-start":
        return {
          type: "flow-collection",
          offset: this.offset,
          indent: this.indent,
          start: this.sourceToken,
          items: [],
          end: []
        };
      case "seq-item-ind":
        return {
          type: "block-seq",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: [this.sourceToken] }]
        };
      case "explicit-key-ind": {
        this.onKeyLine = true;
        const prev = getPrevProps(parent);
        const start = getFirstKeyStartProps(prev);
        start.push(this.sourceToken);
        return {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{ start, explicitKey: true }]
        };
      }
      case "map-value-ind": {
        this.onKeyLine = true;
        const prev = getPrevProps(parent);
        const start = getFirstKeyStartProps(prev);
        return {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{ start, key: null, sep: [this.sourceToken] }]
        };
      }
    }
    return null;
  }
  atIndentedComment(start, indent) {
    if (this.type !== "comment")
      return false;
    if (this.indent <= indent)
      return false;
    return start.every((st) => st.type === "newline" || st.type === "space");
  }
  *documentEnd(docEnd) {
    if (this.type !== "doc-mode") {
      if (docEnd.end)
        docEnd.end.push(this.sourceToken);
      else
        docEnd.end = [this.sourceToken];
      if (this.type === "newline")
        yield* this.pop();
    }
  }
  *lineEnd(token) {
    switch (this.type) {
      case "comma":
      case "doc-start":
      case "doc-end":
      case "flow-seq-end":
      case "flow-map-end":
      case "map-value-ind":
        yield* this.pop();
        yield* this.step();
        break;
      case "newline":
        this.onKeyLine = false;
      // fallthrough
      case "space":
      case "comment":
      default:
        if (token.end)
          token.end.push(this.sourceToken);
        else
          token.end = [this.sourceToken];
        if (this.type === "newline")
          yield* this.pop();
    }
  }
};

// ../node_modules/yaml/browser/dist/public-api.js
function parseOptions(options) {
  const prettyErrors = options.prettyErrors !== false;
  const lineCounter = options.lineCounter || prettyErrors && new LineCounter() || null;
  return { lineCounter, prettyErrors };
}
function parseAllDocuments(source, options = {}) {
  const { lineCounter, prettyErrors } = parseOptions(options);
  const parser = new Parser(lineCounter?.addNewLine);
  const composer = new Composer(options);
  const docs = Array.from(composer.compose(parser.parse(source)));
  if (prettyErrors && lineCounter)
    for (const doc2 of docs) {
      doc2.errors.forEach(prettifyError(source, lineCounter));
      doc2.warnings.forEach(prettifyError(source, lineCounter));
    }
  if (docs.length > 0)
    return docs;
  return Object.assign([], { empty: true }, composer.streamInfo());
}
function parseDocument(source, options = {}) {
  const { lineCounter, prettyErrors } = parseOptions(options);
  const parser = new Parser(lineCounter?.addNewLine);
  const composer = new Composer(options);
  let doc2 = null;
  for (const _doc of composer.compose(parser.parse(source), true, source.length)) {
    if (!doc2)
      doc2 = _doc;
    else if (doc2.options.logLevel !== "silent") {
      doc2.errors.push(new YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
      break;
    }
  }
  if (prettyErrors && lineCounter) {
    doc2.errors.forEach(prettifyError(source, lineCounter));
    doc2.warnings.forEach(prettifyError(source, lineCounter));
  }
  return doc2;
}
function parse(src, reviver, options) {
  let _reviver = void 0;
  if (typeof reviver === "function") {
    _reviver = reviver;
  } else if (options === void 0 && reviver && typeof reviver === "object") {
    options = reviver;
  }
  const doc2 = parseDocument(src, options);
  if (!doc2)
    return null;
  doc2.warnings.forEach((warning) => warn(doc2.options.logLevel, warning));
  if (doc2.errors.length > 0) {
    if (doc2.options.logLevel !== "silent")
      throw doc2.errors[0];
    else
      doc2.errors = [];
  }
  return doc2.toJS(Object.assign({ reviver: _reviver }, options));
}
function stringify3(value, replacer, options) {
  let _replacer = null;
  if (typeof replacer === "function" || Array.isArray(replacer)) {
    _replacer = replacer;
  } else if (options === void 0 && replacer) {
    options = replacer;
  }
  if (typeof options === "string")
    options = options.length;
  if (typeof options === "number") {
    const indent = Math.round(options);
    options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
  }
  if (value === void 0) {
    const { keepUndefined } = options ?? replacer ?? {};
    if (!keepUndefined)
      return void 0;
  }
  if (isDocument(value) && !_replacer)
    return value.toString(options);
  return new Document(value, _replacer, options).toString(options);
}

// ../node_modules/yaml/browser/index.js
var browser_default = dist_exports;

// ../packages/collab-note/dist/sanitizeBody.js
var EMBEDDED_FM_BLOCK = /(?:^|\n)---\r?\n([\s\S]*?)\r?\n---\r?\n?/g;
var looksLikeYamlFrontmatter = (inner) => /^[\w.-]+\s*:/m.test(inner.trim());
function stripEmbeddedFrontmatterFromBody(body) {
  let s = body;
  let pass = 0;
  while (pass < 8) {
    pass += 1;
    let changed = false;
    s = s.replace(/[^\n]---\r?\n([\s\S]*?)\r?\n---\r?\n?/g, (match2, inner) => {
      if (!looksLikeYamlFrontmatter(inner))
        return match2;
      changed = true;
      return match2[0];
    });
    s = s.replace(EMBEDDED_FM_BLOCK, (_match, inner) => {
      if (!looksLikeYamlFrontmatter(inner))
        return _match;
      changed = true;
      return "\n";
    });
    if (!changed)
      break;
  }
  return s.replace(/^\n+/, "");
}

// ../packages/collab-note/dist/noteDocument.js
var YAML_READ_OPTS = { strict: false, uniqueKeys: false };
var OBSIDIAN_ONLY_META_KEYS = /* @__PURE__ */ new Set(["markpadShare", "markpadFolderShare"]);
function parseFrontmatterRecord(raw) {
  const len = getFrontmatterPrefixLength(raw);
  if (len == null)
    return null;
  const block = raw.slice(0, len);
  const inner = block.replace(/^\ufeff?---\r?\n/, "").replace(/\r?\n(?:---|\.\.\.)\s*\r?\n?$/, "");
  try {
    const rec = browser_default.parse(inner, YAML_READ_OPTS);
    return rec && typeof rec === "object" && !Array.isArray(rec) ? rec : null;
  } catch {
    return null;
  }
}
function parseNoteFromMarkdown(raw) {
  const fmLen = getFrontmatterPrefixLength(raw);
  if (fmLen == null) {
    return { meta: {}, body: stripEmbeddedFrontmatterFromBody(raw) };
  }
  const full = parseFrontmatterRecord(raw) ?? {};
  const meta = {};
  for (const [k, v] of Object.entries(full)) {
    if (OBSIDIAN_ONLY_META_KEYS.has(k))
      continue;
    meta[k] = v;
  }
  const body = stripEmbeddedFrontmatterFromBody(raw.slice(fmLen).replace(/^\n+/, ""));
  return { meta, body };
}
function assembleNoteToMarkdown(body, meta) {
  const cleanBody = stripEmbeddedFrontmatterFromBody(body.replace(/^\n+/, ""));
  const keys2 = Object.keys(meta).filter((k) => !OBSIDIAN_ONLY_META_KEYS.has(k));
  if (keys2.length === 0) {
    return cleanBody;
  }
  const dump = browser_default.stringify(meta, { lineWidth: 120 }).trimEnd();
  if (!cleanBody)
    return `---
${dump}
---
`;
  const bodyOut = cleanBody.endsWith("\n") ? cleanBody : `${cleanBody}
`;
  return `---
${dump}
---
${bodyOut}`;
}

// ../packages/collab-note/dist/meta.js
function patchMetaRecord(meta, patch) {
  const next = { ...meta };
  for (const [k, v] of Object.entries(patch)) {
    if (v === void 0)
      delete next[k];
    else
      next[k] = v;
  }
  return next;
}

// ../packages/collab-note/dist/yjsNote.js
var Y10 = __toESM(require_yjs(), 1);
var FILES_MAP_KEY = "files";
var NOTE_ROOT_KEY = "note";
var KEY_BODY = "body";
var KEY_META = "meta";
function metaMapToRecord(metaMap) {
  const out = {};
  metaMap.forEach((value, key) => {
    if (typeof key !== "string")
      return;
    out[key] = value;
  });
  return out;
}
function recordToMetaMap(doc2, meta, target, origin) {
  doc2.transact(() => {
    const keys2 = /* @__PURE__ */ new Set();
    for (const [k, v] of Object.entries(meta)) {
      keys2.add(k);
      target.set(k, v);
    }
    for (const k of [...target.keys()]) {
      if (typeof k === "string" && !keys2.has(k)) {
        target.delete(k);
      }
    }
  }, origin);
}
function hasNoteFileShape(value) {
  return value instanceof Y10.Map && value.get(KEY_BODY) instanceof Y10.Text;
}
function isNoteFileEntry(value) {
  return hasNoteFileShape(value);
}
function upgradeLegacyFileEntry(doc2, path, legacy, origin) {
  const parsed = parseNoteFromMarkdown(legacy.toString());
  const fileMap = new Y10.Map();
  const body = new Y10.Text();
  const meta = new Y10.Map();
  fileMap.set(KEY_BODY, body);
  fileMap.set(KEY_META, meta);
  doc2.transact(() => {
    doc2.getMap(FILES_MAP_KEY).set(path, fileMap);
    if (parsed.body.length > 0)
      body.insert(0, parsed.body);
    recordToMetaMap(doc2, parsed.meta, meta);
  }, origin);
  return fileMap;
}
function getOrCreateFileEntry(doc2, path) {
  const files = doc2.getMap(FILES_MAP_KEY);
  const entry = files.get(path);
  if (isNoteFileEntry(entry))
    return entry;
  if (entry instanceof Y10.Text) {
    return upgradeLegacyFileEntry(doc2, path, entry, "markpad-upgrade-legacy");
  }
  const fileMap = new Y10.Map();
  fileMap.set(KEY_BODY, new Y10.Text());
  fileMap.set(KEY_META, new Y10.Map());
  doc2.transact(() => {
    files.set(path, fileMap);
  });
  return fileMap;
}
function migrateFilesMapLegacyToV2(doc2, origin) {
  const files = doc2.getMap(FILES_MAP_KEY);
  let n = 0;
  for (const [path, value] of files.entries()) {
    if (typeof path !== "string")
      continue;
    if (value instanceof Y10.Text) {
      upgradeLegacyFileEntry(doc2, path, value, origin);
      n += 1;
    }
  }
  return n;
}
function getFileEntry(doc2, path) {
  const entry = doc2.getMap(FILES_MAP_KEY).get(path);
  return isNoteFileEntry(entry) ? entry : null;
}
function getBodyYText(fileEntry) {
  return fileEntry.get(KEY_BODY);
}
function getMetaYMap(fileEntry) {
  const m = fileEntry.get(KEY_META);
  if (m instanceof Y10.Map)
    return m;
  const created = new Y10.Map();
  fileEntry.set(KEY_META, created);
  return created;
}
function seedFileEntryFromMarkdown(doc2, path, markdown, origin) {
  const parsed = parseNoteFromMarkdown(markdown);
  const fileMap = getOrCreateFileEntry(doc2, path);
  doc2.transact(() => {
    const body = getBodyYText(fileMap);
    const bodyStr = parsed.body;
    if (body.length > 0)
      body.delete(0, body.length);
    if (bodyStr.length > 0)
      body.insert(0, bodyStr);
    recordToMetaMap(doc2, parsed.meta, getMetaYMap(fileMap));
  }, origin);
  return fileMap;
}
function getOrCreateNoteRoot(doc2) {
  const root = doc2.getMap(NOTE_ROOT_KEY);
  if (!hasNoteFileShape(root)) {
    doc2.transact(() => {
      root.set(KEY_BODY, new Y10.Text());
      root.set(KEY_META, new Y10.Map());
    });
  }
  return root;
}
function getNoteBodyYText(doc2) {
  return getBodyYText(getOrCreateNoteRoot(doc2));
}
function getNoteMetaYMap(doc2) {
  return getMetaYMap(getOrCreateNoteRoot(doc2));
}
function seedNoteRootFromMarkdown(doc2, markdown, origin) {
  const parsed = parseNoteFromMarkdown(markdown);
  const root = getOrCreateNoteRoot(doc2);
  doc2.transact(() => {
    const body = getBodyYText(root);
    if (body.length > 0)
      body.delete(0, body.length);
    if (parsed.body.length > 0)
      body.insert(0, parsed.body);
    recordToMetaMap(doc2, parsed.meta, getMetaYMap(root));
  }, origin);
}
function readFileEntryAsParsed(fileEntry) {
  return {
    body: stripEmbeddedFrontmatterFromBody(getBodyYText(fileEntry).toString()),
    meta: metaMapToRecord(getMetaYMap(fileEntry))
  };
}
function healBodyYTextIfPolluted(doc2, body, origin) {
  const raw = body.toString();
  const clean = stripEmbeddedFrontmatterFromBody(raw);
  if (clean === raw)
    return false;
  setBodyYTextContent(doc2, body, clean, origin);
  return true;
}
function assembleFileEntry(fileEntry) {
  const { body, meta } = readFileEntryAsParsed(fileEntry);
  return assembleNoteToMarkdown(body, meta);
}
function setBodyYTextContent(doc2, body, content, origin) {
  doc2.transact(() => {
    if (body.length > 0)
      body.delete(0, body.length);
    if (content.length > 0)
      body.insert(0, content);
  }, origin);
}
function mergeMetaFromParsed(doc2, metaMap, parsedMeta, origin) {
  const next = patchMetaRecord(metaMapToRecord(metaMap), parsedMeta);
  recordToMetaMap(doc2, next, metaMap, origin);
}

// src/markpadDebug.ts
var collabDebugEnabled = false;
var setMarkpadCollabDebug = (enabled) => {
  collabDebugEnabled = enabled;
};
var markpadCollabDebug = (...args2) => {
  if (!collabDebugEnabled) return;
  const ts = (/* @__PURE__ */ new Date()).toISOString();
  console.log(`[${ts}] [Markpad:collab]`, ...args2);
};
var debugOriginLabel = (origin) => {
  if (origin === null) return "null";
  if (origin === void 0) return "undefined";
  if (typeof origin === "string") return `str:${origin.slice(0, 40)}`;
  if (typeof origin === "number" || typeof origin === "boolean") return String(origin);
  if (typeof origin === "object") {
    const o = origin;
    const n = o.constructor?.name ?? "Object";
    if (n === "YSyncConfig" || n === "Object") {
      const keys2 = Object.keys(origin).slice(0, 4).join(",");
      return `${n}{${keys2}}`;
    }
    return n;
  }
  return typeof origin;
};

// src/codemirrorBinding.ts
var compartmentByView = /* @__PURE__ */ new WeakMap();
var editableCompartmentByView = /* @__PURE__ */ new WeakMap();
var readonlyBannerByView = /* @__PURE__ */ new WeakMap();
var awarenessByView = /* @__PURE__ */ new WeakMap();
var resolveBridgeBodyYText = (facetY) => {
  const d = facetY.doc;
  if (!d || d.getMap(FILES_MAP_KEY).size > 0) return facetY;
  const root = d.getMap(NOTE_ROOT_KEY);
  if (!hasNoteFileShape(root)) return facetY;
  const fresh = getBodyYText(root);
  return fresh !== facetY ? fresh : facetY;
};
var resolveObsidianEditorView = (markdownView) => {
  const editor = markdownView.editor;
  if (editor.cm instanceof import_view.EditorView) {
    markpadCollabDebug("resolveCM \u2192 editor.cm");
    return editor.cm;
  }
  if (editor.editorComponent?.cm instanceof import_view.EditorView) {
    markpadCollabDebug("resolveCM \u2192 editor.editorComponent.cm");
    return editor.editorComponent.cm;
  }
  const mode = markdownView.currentMode;
  if (mode?.cm instanceof import_view.EditorView) {
    markpadCollabDebug("resolveCM \u2192 currentMode.cm");
    return mode.cm;
  }
  if (mode?.editor?.cm instanceof import_view.EditorView) {
    markpadCollabDebug("resolveCM \u2192 currentMode.editor.cm");
    return mode.editor.cm;
  }
  const mv = markdownView;
  if (mv.editMode?.cm instanceof import_view.EditorView) {
    markpadCollabDebug("resolveCM \u2192 editMode.cm");
    return mv.editMode.cm;
  }
  if (mv.editMode?.editor?.cm instanceof import_view.EditorView) {
    markpadCollabDebug("resolveCM \u2192 editMode.editor.cm");
    return mv.editMode.editor.cm;
  }
  markpadCollabDebug("resolveCM \u2192 \xE9chec (aucune EditorView)");
  return null;
};
var MarkpadCmYBridge = class {
  /**
   * Positionner à true avant un dispatch Y→CM explicite (via `applyYTextToCm`) pour
   * empêcher ce pont de pousser CM→Y sur cette mise à jour. Y.Text a DÉJÀ le bon
   * contenu ; repousser CM (= Y) vers Y créerait des opérations Y.js inutiles.
   */
  skipNextUpdate = false;
  update(update) {
    if (!update.docChanged) return;
    if (this.skipNextUpdate) {
      this.skipNextUpdate = false;
      return;
    }
    const hasUserEvent = update.transactions.some(
      (tr) => tr.annotation(import_state.Transaction.userEvent) != null
    );
    if (!hasUserEvent) return;
    const conf = update.state.facet(ySyncFacet);
    let ytext = conf.ytext;
    const resolved = resolveBridgeBodyYText(ytext);
    if (resolved !== ytext) {
      const awareness = awarenessByView.get(update.view);
      markpadCollabDebug("pont CM\u2192Y: facet Y.Text p\xE9rim\xE9 \u2192 re-montage", {
        facetLen: ytext.toString().length,
        freshLen: resolved.toString().length
      });
      if (awareness) {
        remountCollabExtensionForYText(update.view, resolved, awareness);
      }
      ytext = resolved;
    }
    const cm = update.state.doc.toString();
    const y = ytext.toString();
    const txCount = update.transactions.length;
    const firstUserFacing = txCount > 0 ? update.transactions[0].isUserEvent("input.type") : false;
    markpadCollabDebug("CM ViewUpdate (pont)", {
      txCount,
      firstTxIsInputType: firstUserFacing,
      cmLen: cm.length,
      yLen: y.length,
      aligned: cm === y
    });
    if (cm === y) return;
    markpadCollabDebug("pont CM\u2192Y: application diff minimal", {
      yHead: y.slice(0, 80).replace(/\n/g, "\\n"),
      cmHead: cm.slice(0, 80).replace(/\n/g, "\\n")
    });
    applyMinimalYTextEdit(ytext.doc, ytext, y, cm, conf);
    let yAfter = ytext.toString();
    if (yAfter !== cm) {
      applyMinimalYTextEdit(ytext.doc, ytext, yAfter, cm, "markpad-cm-bridge");
      yAfter = ytext.toString();
      if (yAfter !== cm) {
        markpadCollabDebug("pont CM\u2192Y: \xE9chec alignement", {
          cmLen: cm.length,
          yLen: yAfter.length,
          facetDoc: ytext.doc?.guid,
          ytextId: ytext.toString().slice(0, 20)
        });
      }
    }
    markpadCollabDebug("pont CM\u2192Y: apr\xE8s apply", { yLen: yAfter.length });
  }
};
var markpadCmYBridge = import_view.ViewPlugin.fromClass(MarkpadCmYBridge);
var createCollabExtensionForYText = (yText, awareness) => {
  const base = yCollab(yText, awareness, {
    drawSelection: true,
    getUserColor: (user) => user.color ?? "#7c3aed",
    getUserName: (user) => user.name ?? "Anonymous"
  });
  const flat = Array.isArray(base) ? base : [base];
  return [...flat, markpadCmYBridge];
};
var mountCollabExtensionWithYText = (view, yText, awareness) => {
  awarenessByView.set(view, awareness);
  const ext = createCollabExtensionForYText(yText, awareness);
  let compartment = compartmentByView.get(view);
  if (compartment && !isCollabMounted(view)) {
    compartmentByView.delete(view);
    compartment = void 0;
  }
  if (!compartment) {
    compartment = new import_state.Compartment();
    compartmentByView.set(view, compartment);
    view.dispatch({
      effects: import_state.StateEffect.appendConfig.of(compartment.of(ext))
    });
    return;
  }
  try {
    view.dispatch({
      effects: compartment.reconfigure(ext)
    });
  } catch {
    const fresh = new import_state.Compartment();
    compartmentByView.set(view, fresh);
    view.dispatch({
      effects: import_state.StateEffect.appendConfig.of(fresh.of(ext))
    });
  }
};
var unmountCollabExtension = (view) => {
  const compartment = compartmentByView.get(view);
  if (!compartment) return;
  try {
    view.dispatch({
      effects: compartment.reconfigure([])
    });
  } finally {
    compartmentByView.delete(view);
  }
};
var blockUserEditsFilter = import_state.EditorState.transactionFilter.of((tr) => {
  if (!tr.docChanged) return tr;
  if (tr.annotation(import_state.Transaction.userEvent)) return [];
  return tr;
});
var editableExtensions = (editable) => editable ? [import_view.EditorView.editable.of(true)] : [import_view.EditorView.editable.of(false), blockUserEditsFilter];
var showReadonlyBanner = (view) => {
  if (readonlyBannerByView.has(view)) return;
  const banner = document.createElement("div");
  banner.className = "markpad-readonly-banner";
  const iconEl = banner.createSpan();
  (0, import_obsidian.setIcon)(iconEl, "lock");
  banner.createSpan({ text: "Note en lecture seule \u2014 reconnexion en cours\u2026" });
  view.dom.prepend(banner);
  readonlyBannerByView.set(view, banner);
};
var hideReadonlyBanner = (view) => {
  const banner = readonlyBannerByView.get(view);
  if (!banner) return;
  banner.remove();
  readonlyBannerByView.delete(view);
};
var mountCollabEditable = (view, editable) => {
  if (editable) hideReadonlyBanner(view);
  else showReadonlyBanner(view);
  let compartment = editableCompartmentByView.get(view);
  if (!compartment) {
    compartment = new import_state.Compartment();
    editableCompartmentByView.set(view, compartment);
    view.dispatch({
      effects: import_state.StateEffect.appendConfig.of(compartment.of(editableExtensions(editable)))
    });
    return;
  }
  view.dispatch({ effects: compartment.reconfigure(editableExtensions(editable)) });
};
var setCollabEditable = (view, editable) => {
  if (editable) hideReadonlyBanner(view);
  else showReadonlyBanner(view);
  const compartment = editableCompartmentByView.get(view);
  if (!compartment) {
    mountCollabEditable(view, editable);
    return;
  }
  view.dispatch({ effects: compartment.reconfigure(editableExtensions(editable)) });
};
var unmountCollabEditable = (view) => {
  hideReadonlyBanner(view);
  const compartment = editableCompartmentByView.get(view);
  if (!compartment) return;
  try {
    view.dispatch({ effects: compartment.reconfigure([]) });
  } finally {
    editableCompartmentByView.delete(view);
  }
};
var isCollabMounted = (view) => {
  try {
    const conf = view.state.facet(ySyncFacet);
    return conf != null && conf.ytext != null;
  } catch {
    return false;
  }
};
var remountCollabExtensionForYText = (view, yText, awareness) => {
  if (!isCollabMounted(view)) {
    compartmentByView.delete(view);
    editableCompartmentByView.delete(view);
  }
  mountCollabExtensionWithYText(view, yText, awareness);
};
var applyYTextToCm = (view, yText) => {
  const conf = view.state.facet(ySyncFacet);
  if (!conf?.ytext) return false;
  const ySource = conf.ytext === yText ? yText : conf.ytext;
  if (conf.ytext !== yText) {
    markpadCollabDebug("applyYTextToCm: yText mismatch, usage du facet courant", {
      expectedLen: yText.toString().length,
      facetLen: conf.ytext.toString().length
    });
  }
  const yContent = ySource.toString();
  const cmContent = view.state.doc.toString();
  if (yContent === cmContent) return false;
  if (yContent.length === 0 && cmContent.length > 0) {
    markpadCollabDebug("applyYTextToCm: ignor\xE9 (Y vide, CM non vide)", {
      cmLen: cmContent.length
    });
    return false;
  }
  const sel = view.state.selection.main;
  const preserveEnd = sel.empty && sel.anchor === cmContent.length && yContent.startsWith(cmContent);
  const bridge = view.plugin(markpadCmYBridge);
  if (bridge) bridge.skipNextUpdate = true;
  view.dispatch({
    changes: { from: 0, to: cmContent.length, insert: yContent },
    annotations: [import_state.Transaction.addToHistory.of(false)],
    selection: preserveEnd ? import_state.EditorSelection.cursor(yContent.length) : void 0
  });
  return true;
};

// src/patchYWebsocketProviderOutbound.ts
var MESSAGE_SYNC = 0;
var broadcastMessage2 = (provider, buf) => {
  const ws = provider.ws;
  if (provider.wsconnected && ws && ws.readyState === ws.OPEN) {
    ws.send(buf);
  }
  const p = provider;
  if (p.bcconnected) {
    publish(p.bcChannel, buf, provider);
  }
};
var patchYWebsocketProviderOutbound = (provider) => {
  const doc2 = provider.doc;
  const provAny = provider;
  const old = provAny._updateHandler;
  if (!old) return false;
  doc2.off("update", old);
  const fixed = (update, origin) => {
    if (origin !== provider) {
      const encoder = createEncoder();
      writeVarUint(encoder, MESSAGE_SYNC);
      writeUpdate(encoder, update);
      broadcastMessage2(provider, toUint8Array(encoder));
    }
  };
  doc2.on("update", fixed);
  provAny._updateHandler = fixed;
  return true;
};

// src/jwt.ts
var normalizeAuthToken = (raw) => {
  let t2 = raw.trim();
  if (t2.startsWith('"') && t2.endsWith('"') || t2.startsWith("'") && t2.endsWith("'")) {
    t2 = t2.slice(1, -1).trim();
  }
  return t2.replace(/^Bearer\s+/i, "").trim();
};
var jwtPayloadSub = (token) => {
  const trimmed = normalizeAuthToken(token);
  if (!trimmed) return null;
  const parts = trimmed.split(".");
  if (parts.length < 2) return null;
  try {
    const part = parts[1];
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const pad = (4 - b64.length % 4) % 4;
    const json = JSON.parse(atob(b64 + "=".repeat(pad)));
    return typeof json.sub === "string" && json.sub.length > 0 ? json.sub : null;
  } catch {
    return null;
  }
};
var isJwtShape = (token) => normalizeAuthToken(token).split(".").length === 3;
var resolveAccountUserId = (authToken) => jwtPayloadSub(authToken);
var resolveAwarenessUserId = (authToken, displayName, legacyUserId) => {
  const fromToken = jwtPayloadSub(authToken);
  if (fromToken) return fromToken;
  const legacy = legacyUserId?.trim();
  if (legacy) return legacy;
  const name = displayName.trim();
  return name || "obsidian-user";
};
var diagnoseAuthToken = (authToken) => {
  const token = normalizeAuthToken(authToken);
  if (!token) return "missing";
  if (!isJwtShape(token)) return "legacy_api_key";
  if (!jwtPayloadSub(token)) return "invalid_jwt";
  return null;
};

// src/reconcile.ts
var import_diff_match_patch = __toESM(require_diff_match_patch(), 1);
var RECONCILE_ORIGIN = "markpad-reconcile";
var reconcileLocalBodyIntoY = (doc2, yText, localBody) => {
  const yStr = yText.toString();
  if (localBody === yStr) return "noop";
  if (yStr.length === 0 && localBody.length > 0) {
    doc2.transact(() => yText.insert(0, localBody), RECONCILE_ORIGIN);
    return "seeded";
  }
  if (localBody.length === 0) return "noop";
  const dmp = new import_diff_match_patch.default();
  const patches = dmp.patch_make(yStr, localBody);
  const [merged, results] = dmp.patch_apply(patches, yStr);
  if (!results.every(Boolean)) {
    return "conflict";
  }
  if (merged === yStr) return "noop";
  doc2.transact(() => {
    yText.delete(0, yText.length);
    yText.insert(0, merged);
  }, RECONCILE_ORIGIN);
  return "merged";
};

// src/shareSession.ts
var import_obsidian2 = require("obsidian");
var parseSessionErrorBody = (response) => {
  try {
    const j = response.json;
    return typeof j?.error === "string" ? j.error : void 0;
  } catch {
    return void 0;
  }
};
var requireAccountUserId = (settings) => {
  const userId = resolveAccountUserId(settings.authToken);
  if (!userId) {
    throw new Error("auth_token_invalid_or_missing");
  }
  return userId;
};
var createShareSession = async (payload) => {
  const userId = requireAccountUserId(payload.settings);
  const endpoint = `${payload.serverUrl}/sessions`;
  const response = await (0, import_obsidian2.requestUrl)({
    url: endpoint,
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${normalizeAuthToken(payload.settings.authToken)}`
    },
    body: JSON.stringify({
      noteId: payload.noteId,
      userId,
      roomPassword: payload.roomPassword
    })
  });
  if (response.status < 200 || response.status > 299) {
    const err = parseSessionErrorBody(response);
    throw new Error(
      err ? `session_create_failed (${response.status}):${err}` : `session_create_failed (${response.status})`
    );
  }
  const json = response.json;
  return {
    roomId: json.roomId,
    shareUrl: json.shareUrl
  };
};
var createFolderShareSession = async (payload) => {
  const userId = requireAccountUserId(payload.settings);
  const endpoint = `${payload.serverUrl}/sessions`;
  const response = await (0, import_obsidian2.requestUrl)({
    url: endpoint,
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${normalizeAuthToken(payload.settings.authToken)}`
    },
    body: JSON.stringify({
      noteId: payload.noteId,
      userId,
      roomPassword: payload.roomPassword,
      kind: "folder",
      folderPath: payload.folderPath,
      filePaths: payload.filePaths
    })
  });
  if (response.status < 200 || response.status > 299) {
    const err = parseSessionErrorBody(response);
    throw new Error(
      err ? `session_create_failed (${response.status}):${err}` : `session_create_failed (${response.status})`
    );
  }
  const json = response.json;
  return {
    roomId: json.roomId,
    shareUrl: json.shareUrl
  };
};
var endShareSession = async (payload) => {
  const userId = requireAccountUserId(payload.settings);
  const endpoint = `${payload.serverUrl}/sessions/${payload.roomId}`;
  const response = await (0, import_obsidian2.requestUrl)({
    url: endpoint,
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${normalizeAuthToken(payload.settings.authToken)}`
    },
    body: JSON.stringify({ userId })
  });
  if (response.status < 200 || response.status > 299) {
    throw new Error(`session_delete_failed (${response.status})`);
  }
};
var validateShareSession = async (payload) => {
  const endpoint = `${payload.serverUrl}/sessions/${payload.roomId}/validate`;
  const response = await (0, import_obsidian2.requestUrl)({
    url: endpoint,
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      roomPassword: payload.roomPassword
    })
  });
  if (response.status < 200 || response.status > 299) {
    throw new Error(`session_validate_failed (${response.status})`);
  }
  const json = response.json;
  return {
    roomId: json.roomId ?? payload.roomId,
    kind: json.kind === "folder" ? "folder" : "note",
    filePaths: Array.isArray(json.filePaths) ? json.filePaths : []
  };
};

// src/locale.ts
var STRINGS = {
  fr: {
    serverUrl: "URL du serveur",
    authToken: "Jeton de connexion",
    authTokenDesc: "Copiez-le depuis la page Mon compte du serveur Markpad, apr\xE8s connexion par e-mail (bouton \xAB Copier le jeton \xBB). Il identifie votre compte pour cr\xE9er et supprimer vos partages.",
    displayName: "Nom affich\xE9",
    cursorColor: "Couleur du curseur",
    defaultRoomPassword: "Mot de passe room par d\xE9faut",
    autoReconnect: "Reconnexion auto",
    debugLogs: "Logs diagnostic (console)",
    language: "Langue",
    cmdStartSharing: "D\xE9marrer le partage",
    cmdJoinShared: "Rejoindre une note/dossier partag\xE9",
    cmdCopyLink: "Copier le lien de partage",
    cmdStopSharing: "Arr\xEAter le partage (note courante)",
    ribbonStart: "Markpad : d\xE9marrer le partage",
    folderShareMenu: "Markpad : partager ce dossier",
    folderCopyLink: "Markpad : copier le lien du dossier",
    folderStopSharing: "Markpad : arr\xEAter le partage du dossier",
    cmdSharesPanel: "Ouvrir le panneau des partages"
  },
  en: {
    serverUrl: "Server URL",
    authToken: "Sign-in token",
    authTokenDesc: "Copy it from the Markpad server's My account page after email sign-in (Copy token button). It identifies your account to create and delete your shares.",
    displayName: "Display name",
    cursorColor: "Cursor color",
    defaultRoomPassword: "Default room password",
    autoReconnect: "Auto reconnect",
    debugLogs: "Diagnostic logs (console)",
    language: "Language",
    cmdStartSharing: "Start sharing",
    cmdJoinShared: "Join shared note/folder",
    cmdCopyLink: "Copy share link",
    cmdStopSharing: "Stop sharing (current note)",
    ribbonStart: "Markpad: Start sharing",
    folderShareMenu: "Markpad: Share this folder",
    folderCopyLink: "Markpad: Copy folder share link",
    folderStopSharing: "Markpad: Stop sharing folder",
    cmdSharesPanel: "Open shares panel"
  },
  es: {
    serverUrl: "URL del servidor",
    authToken: "Token de conexi\xF3n",
    authTokenDesc: "C\xF3pialo desde Mi cuenta en el servidor Markpad, tras iniciar sesi\xF3n por correo (bot\xF3n \xABCopiar token\xBB). Identifica tu cuenta para crear y eliminar tus compartidos.",
    displayName: "Nombre mostrado",
    cursorColor: "Color del cursor",
    defaultRoomPassword: "Contrase\xF1a de sala por defecto",
    autoReconnect: "Reconexi\xF3n autom\xE1tica",
    debugLogs: "Registros de diagn\xF3stico (consola)",
    language: "Idioma",
    cmdStartSharing: "Iniciar uso compartido",
    cmdJoinShared: "Unirse a nota/carpeta compartida",
    cmdCopyLink: "Copiar enlace",
    cmdStopSharing: "Detener uso compartido (nota actual)",
    ribbonStart: "Markpad: Iniciar uso compartido",
    folderShareMenu: "Markpad: Compartir esta carpeta",
    folderCopyLink: "Markpad: Copiar enlace de la carpeta",
    folderStopSharing: "Markpad: Dejar de compartir carpeta",
    cmdSharesPanel: "Abrir panel de enlaces compartidos"
  },
  de: {
    serverUrl: "Server-URL",
    authToken: "Anmeldetoken",
    authTokenDesc: "Aus \u201EMein Konto\u201C auf dem Markpad-Server nach E-Mail-Anmeldung kopieren (Schaltfl\xE4che \u201EToken kopieren\u201C). Identifiziert Ihr Konto zum Erstellen und L\xF6schen von Freigaben.",
    displayName: "Anzeigename",
    cursorColor: "Cursorfarbe",
    defaultRoomPassword: "Standard-Raumpasswort",
    autoReconnect: "Automatisch neu verbinden",
    debugLogs: "Diagnoseprotokoll (Konsole)",
    language: "Sprache",
    cmdStartSharing: "Freigabe starten",
    cmdJoinShared: "Geteilte Notiz/Ordner beitreten",
    cmdCopyLink: "Freigabelink kopieren",
    cmdStopSharing: "Freigabe beenden (aktuelle Notiz)",
    ribbonStart: "Markpad: Freigabe starten",
    folderShareMenu: "Markpad: Diesen Ordner teilen",
    folderCopyLink: "Markpad: Ordner-Freigabelink kopieren",
    folderStopSharing: "Markpad: Ordnerfreigabe beenden",
    cmdSharesPanel: "Freigaben-Panel \xF6ffnen"
  }
};
var t = (locale, key) => STRINGS[locale]?.[key] ?? STRINGS.en[key] ?? key;

// src/settings.ts
var import_obsidian3 = require("obsidian");
var DEFAULT_SETTINGS = {
  serverUrl: "http://localhost:1234",
  authToken: "",
  displayName: "Obsidian User",
  color: "#7c3aed",
  locale: "fr",
  defaultRoomPassword: "",
  autoReconnect: true,
  debugCollab: false
};
var MarkpadSettingTab = class extends import_obsidian3.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    const L = this.plugin.settings.locale;
    new import_obsidian3.Setting(containerEl).setName(t(L, "language")).setDesc("Interface du plugin (r\xE9glages et noms de commandes).").addDropdown(
      (drop) => drop.addOption("fr", "Fran\xE7ais").addOption("en", "English").addOption("es", "Espa\xF1ol").addOption("de", "Deutsch").setValue(this.plugin.settings.locale).onChange(async (value) => {
        this.plugin.settings.locale = value;
        await this.plugin.saveSettings();
        this.display();
      })
    );
    new import_obsidian3.Setting(containerEl).setName(t(L, "serverUrl")).setDesc("Adresse du serveur Markpad.").addText(
      (text2) => text2.setValue(this.plugin.settings.serverUrl).onChange(async (value) => {
        this.plugin.settings.serverUrl = value.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName(t(L, "authToken")).setDesc(t(L, "authTokenDesc")).addText(
      (text2) => text2.setValue(this.plugin.settings.authToken).onChange(async (value) => {
        this.plugin.settings.authToken = normalizeAuthToken(value);
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName(t(L, "displayName")).setDesc("Nom affich\xE9 pour les curseurs distants.").addText(
      (text2) => text2.setValue(this.plugin.settings.displayName).onChange(async (value) => {
        this.plugin.settings.displayName = value.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName(t(L, "cursorColor")).setDesc("Couleur utilis\xE9e pour le curseur local.").addText(
      (text2) => text2.setValue(this.plugin.settings.color).onChange(async (value) => {
        this.plugin.settings.color = value.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName(t(L, "defaultRoomPassword")).setDesc("Mot de passe optionnel appliqu\xE9 par d\xE9faut aux partages.").addText(
      (text2) => text2.setPlaceholder("laisser vide pour aucune protection").setValue(this.plugin.settings.defaultRoomPassword).onChange(async (value) => {
        this.plugin.settings.defaultRoomPassword = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName(t(L, "autoReconnect")).setDesc(
      "Si une note contient markpadShare dans le frontmatter, reconnecter le WebSocket \xE0 l\u2019ouverture (mot de passe = d\xE9faut ci-dessus)."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoReconnect).onChange(async (value) => {
        this.plugin.settings.autoReconnect = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName(t(L, "debugLogs")).setDesc(
      "Affiche dans la console d\xE9veloppeur (Ctrl+Shift+I) des messages horodat\xE9s : r\xE9solution CodeMirror, pont CM\u2192Y, mises \xE0 jour Y.Doc, sync WebSocket. D\xE9sactive quand tu as fini de d\xE9boguer."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.debugCollab).onChange(async (value) => {
        this.plugin.settings.debugCollab = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Purger les ancres de partage dossier").setDesc(
      "Arr\xEAte tous les partages dossier actifs, supprime les fichiers `.markpad-folder-share.md` restants et r\xE9initialise l\u2019\xE9tat local (sessions serveur termin\xE9es si possible)."
    ).addButton(
      (btn) => btn.setButtonText("Purger\u2026").onClick(() => {
        new MarkpadConfirmModal(
          this.app,
          "Supprimer les ancres .markpad-folder-share.md et r\xE9initialiser les partages dossier ?",
          () => {
            void this.plugin.purgeFolderShareAnchors();
          }
        ).open();
      })
    );
  }
};
var MarkpadConfirmModal = class extends import_obsidian3.Modal {
  constructor(app, message, onConfirm) {
    super(app);
    this.message = message;
    this.onConfirm = onConfirm;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("p", { text: this.message });
    const row = contentEl.createDiv({ cls: "modal-button-container" });
    row.createEl("button", { text: "Annuler" }).addEventListener("click", () => this.close());
    const confirmBtn = row.createEl("button", {
      text: "Confirmer",
      cls: "mod-warning"
    });
    confirmBtn.addEventListener("click", () => {
      this.close();
      this.onConfirm();
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/sharesView.ts
var import_obsidian4 = require("obsidian");
var MARKPAD_SHARES_VIEW_TYPE = "markpad-shares";
var MarkpadSharesView = class extends import_obsidian4.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() {
    return MARKPAD_SHARES_VIEW_TYPE;
  }
  getDisplayText() {
    return this.plugin.settings.locale === "en" ? "Markpad shares" : "Partages Markpad";
  }
  getIcon() {
    return "share-2";
  }
  async onOpen() {
    this.render();
  }
  async onClose() {
  }
  refresh() {
    this.render();
  }
  render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("markpad-shares-view");
    contentEl.style.padding = "10px";
    contentEl.style.overflow = "auto";
    const rows = this.plugin.getSharesForPanel();
    if (rows.length === 0) {
      contentEl.createDiv({
        text: this.plugin.settings.locale === "en" ? "No active shares." : "Aucun partage actif."
      });
      return;
    }
    for (const row of rows) {
      const wrap = contentEl.createDiv();
      wrap.style.marginBottom = "12px";
      wrap.style.paddingBottom = "8px";
      wrap.style.borderBottom = "1px solid var(--background-modifier-border)";
      const title = wrap.createDiv();
      title.style.fontSize = "12px";
      title.style.fontWeight = "600";
      title.style.wordBreak = "break-all";
      title.setText(
        row.kind === "folder" ? `\u{1F4C1} ${row.label}` : `\u{1F4C4} ${row.label}`
      );
      const link = wrap.createEl("a", {
        href: row.shareUrl,
        cls: "external-link"
      });
      link.setText(row.shareUrl);
      link.style.display = "block";
      link.style.fontSize = "11px";
      link.style.marginTop = "4px";
      link.style.opacity = "0.85";
      const actions = wrap.createDiv();
      actions.style.display = "flex";
      actions.style.gap = "8px";
      actions.style.marginTop = "8px";
      const copyBtn = actions.createEl("button", { text: "Copier le lien", cls: "mod-cta" });
      copyBtn.addEventListener("click", () => {
        void navigator.clipboard.writeText(row.shareUrl);
        new import_obsidian4.Notice("Lien copi\xE9.");
      });
      const delBtn = actions.createEl("button", { text: "Supprimer le partage" });
      delBtn.addEventListener("click", () => {
        void (async () => {
          await this.plugin.deleteShareFromPanel(row);
          this.refresh();
        })();
      });
    }
  }
};

// src/historyView.ts
var import_diff_match_patch2 = __toESM(require_diff_match_patch(), 1);
var import_obsidian5 = require("obsidian");
var MARKPAD_HISTORY_VIEW_TYPE = "markpad-history";
var MARKPAD_HISTORY_VIEW_STYLE_ID = "markpad-history-view-style";
var MARKPAD_HISTORY_VIEW_CSS = `
.markpad-history-view {
  padding: 10px;
  overflow: auto;
}

.markpad-history-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.markpad-history-title {
  margin: 0;
  font-size: 0.95em;
  font-weight: 600;
  flex: 1;
  min-width: 0;
}

.markpad-history-refresh {
  flex-shrink: 0;
}

.markpad-history-status,
.markpad-history-empty {
  font-size: 13px;
  opacity: 0.75;
  margin: 0;
}

.markpad-history-entries {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.markpad-history-row {
  width: 100%;
  text-align: left;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--text-normal);
  padding: 8px 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font: inherit;
}

.markpad-history-row:hover {
  background: color-mix(in srgb, var(--background-modifier-hover) 60%, transparent);
}

.markpad-history-row--active {
  border-color: var(--interactive-accent);
  background: color-mix(in srgb, var(--interactive-accent) 12%, transparent);
}

.markpad-history-row__date {
  font-weight: 600;
  font-size: 13px;
}

.markpad-history-row__meta {
  font-size: 11px;
  opacity: 0.65;
}

.markpad-history-row__file {
  font-size: 11px;
  opacity: 0.6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.markpad-history-preview {
  margin-top: 6px;
  padding-left: 6px;
  border-left: 2px solid color-mix(in srgb, var(--interactive-accent) 45%, transparent);
}

.markpad-history-diff-legend {
  margin: 0 0 6px;
  font-size: 11px;
  opacity: 0.7;
  line-height: 1.35;
}

.markpad-history-diff-scroll {
  max-height: 300px;
  overflow: auto;
  border-radius: 8px;
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  padding: 8px 10px;
}

.markpad-history-diff-body {
  font-family: var(--font-monospace);
  font-size: 11px;
  line-height: 1.45;
  word-break: break-word;
}

.markpad-history-diff-removed {
  background: rgba(239, 68, 68, 0.18);
  border-radius: 2px;
}
`;
var formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};
var MarkpadHistoryView = class extends import_obsidian5.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  selectedId = null;
  snapshots = [];
  fullSnapshot = null;
  lastRoomKey = null;
  previewContainerEl = null;
  pendingUpdateTimer = null;
  ensureStyles() {
    if (document.getElementById(MARKPAD_HISTORY_VIEW_STYLE_ID)) return;
    const styleEl = document.createElement("style");
    styleEl.id = MARKPAD_HISTORY_VIEW_STYLE_ID;
    styleEl.textContent = MARKPAD_HISTORY_VIEW_CSS;
    document.head.appendChild(styleEl);
  }
  computeRoomKey() {
    const room = this.plugin.getActiveSharedRoom();
    if (!room) return "none";
    return `${room.kind}:${room.roomId}:${room.filePath ?? ""}`;
  }
  getViewType() {
    return MARKPAD_HISTORY_VIEW_TYPE;
  }
  getDisplayText() {
    return this.plugin.settings.locale === "en" ? "Markpad history" : "Historique Markpad";
  }
  getIcon() {
    return "clock";
  }
  async onOpen() {
    this.ensureStyles();
    this.lastRoomKey = this.computeRoomKey();
    await this.loadAndRender();
    this.registerEvent(
      this.app.workspace.on("file-open", () => {
        if (this.pendingUpdateTimer) window.clearTimeout(this.pendingUpdateTimer);
        this.pendingUpdateTimer = window.setTimeout(() => void this.handleActiveRoomChange(), 520);
      })
    );
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => {
        if (this.pendingUpdateTimer) window.clearTimeout(this.pendingUpdateTimer);
        this.pendingUpdateTimer = window.setTimeout(() => void this.handleActiveRoomChange(), 520);
      })
    );
  }
  async onClose() {
    if (this.pendingUpdateTimer) window.clearTimeout(this.pendingUpdateTimer);
    this.pendingUpdateTimer = null;
  }
  async refresh() {
    this.selectedId = null;
    this.fullSnapshot = null;
    this.previewContainerEl = null;
    await this.loadAndRender();
  }
  async loadAndRender() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("markpad-history-view");
    this.previewContainerEl = null;
    const isEn = this.plugin.settings.locale === "en";
    const room = this.plugin.getActiveSharedRoom();
    this.lastRoomKey = this.computeRoomKey();
    if (!room) {
      contentEl.createDiv({
        cls: "markpad-history-empty",
        text: isEn ? "No active shared note. Open a Markpad-shared note to see its history." : "Aucune note partag\xE9e active. Ouvrez une note partag\xE9e Markpad pour voir son historique."
      });
      return;
    }
    const serverUrl = this.plugin.settings.serverUrl.replace(/\/$/, "");
    let url = `${serverUrl}/sessions/${encodeURIComponent(room.roomId)}/history`;
    if (room.kind === "folder" && room.filePath) {
      url += `?filePath=${encodeURIComponent(room.filePath)}`;
    }
    const head = contentEl.createDiv({ cls: "markpad-history-head" });
    head.createEl("h3", {
      cls: "markpad-history-title",
      text: isEn ? "History" : "Historique"
    });
    const refreshBtn = head.createEl("button", {
      cls: "clickable-icon markpad-history-refresh",
      attr: { "aria-label": isEn ? "Refresh" : "Rafra\xEEchir" }
    });
    (0, import_obsidian5.setIcon)(refreshBtn, "refresh-cw");
    refreshBtn.addEventListener("click", () => void this.refresh());
    const statusEl = contentEl.createDiv({ cls: "markpad-history-status" });
    statusEl.setText(isEn ? "Loading\u2026" : "Chargement\u2026");
    try {
      const res = await fetch(url);
      if (!res.ok) {
        statusEl.setText(isEn ? "Failed to load history." : "Impossible de charger l'historique.");
        return;
      }
      const data = await res.json();
      this.snapshots = data.snapshots;
    } catch {
      statusEl.setText(isEn ? "Network error." : "Erreur r\xE9seau.");
      return;
    }
    statusEl.remove();
    if (this.snapshots.length === 0) {
      contentEl.createDiv({
        cls: "markpad-history-empty",
        text: isEn ? "No snapshots yet." : "Aucun snapshot disponible."
      });
      return;
    }
    const entries = contentEl.createDiv({ cls: "markpad-history-entries" });
    for (const snap of this.snapshots) {
      const block = entries.createDiv({ cls: "markpad-history-block" });
      const btn = block.createEl("button", {
        cls: "markpad-history-row",
        attr: { type: "button" }
      });
      if (this.selectedId === snap.id) {
        btn.addClass("markpad-history-row--active");
      }
      btn.createSpan({ cls: "markpad-history-row__date", text: formatDate(snap.snapshot_at) });
      const charLabel = isEn ? "characters" : "caract\xE8res";
      btn.createSpan({
        cls: "markpad-history-row__meta",
        text: `${snap.content_length} ${charLabel}`
      });
      if (snap.file_path) {
        btn.createSpan({
          cls: "markpad-history-row__file",
          attr: { title: snap.file_path },
          text: snap.file_path.split("/").pop() ?? snap.file_path
        });
      }
      const contentContainer = block.createDiv({ cls: "markpad-history-preview" });
      contentContainer.style.display = "none";
      if (this.selectedId === snap.id && this.fullSnapshot) {
        contentContainer.style.display = "block";
        this.previewContainerEl = contentContainer;
        this.renderDiffContent(contentContainer, this.fullSnapshot.content, isEn);
      }
      btn.addEventListener("click", () => {
        void (async () => {
          if (this.selectedId === snap.id) {
            this.selectedId = null;
            this.fullSnapshot = null;
            this.previewContainerEl = null;
            contentContainer.style.display = "none";
            btn.removeClass("markpad-history-row--active");
            return;
          }
          this.selectedId = snap.id;
          btn.addClass("markpad-history-row--active");
          for (const other of entries.querySelectorAll(".markpad-history-row")) {
            if (other !== btn) other.classList.remove("markpad-history-row--active");
          }
          contentContainer.style.display = "block";
          contentContainer.empty();
          const loadingEl = contentContainer.createEl("p", { cls: "markpad-history-status" });
          loadingEl.setText(isEn ? "Loading\u2026" : "Chargement\u2026");
          try {
            const res = await fetch(
              `${serverUrl}/sessions/${encodeURIComponent(room.roomId)}/history/${snap.id}`
            );
            if (!res.ok) {
              contentContainer.empty();
              contentContainer.createEl("p").setText(
                isEn ? "Failed to load snapshot." : "Impossible de charger ce snapshot."
              );
              return;
            }
            const full = await res.json();
            this.fullSnapshot = full;
            contentContainer.empty();
            this.previewContainerEl = contentContainer;
            this.renderDiffContent(contentContainer, full.content, isEn);
          } catch {
            contentContainer.empty();
            contentContainer.createEl("p").setText(isEn ? "Network error." : "Erreur r\xE9seau.");
          }
        })();
      });
    }
  }
  async handleActiveRoomChange() {
    const newKey = this.computeRoomKey();
    if (newKey !== this.lastRoomKey) {
      this.selectedId = null;
      this.fullSnapshot = null;
      this.previewContainerEl = null;
      this.lastRoomKey = newKey;
      await this.loadAndRender();
      return;
    }
    if (this.selectedId != null && this.fullSnapshot && this.previewContainerEl) {
      const isEn = this.plugin.settings.locale === "en";
      this.renderDiffContent(this.previewContainerEl, this.fullSnapshot.content, isEn);
    }
  }
  renderDiffContent(container, snapshotContent, isEn) {
    container.empty();
    const current = this.plugin.getActiveSharedDocumentText() ?? "";
    const dmp = new import_diff_match_patch2.default();
    const diffs = dmp.diff_main(snapshotContent, current);
    dmp.diff_cleanupSemantic(diffs);
    const legend = container.createDiv({ cls: "markpad-history-diff-legend" });
    legend.setText(
      isEn ? "Compared to the current document \u2014 highlights show what differs." : "Par rapport au document actuel \u2014 le surlignage indique ce qui diff\xE8re."
    );
    const scroll = container.createDiv({ cls: "markpad-history-diff-scroll" });
    const body = scroll.createDiv({ cls: "markpad-history-diff-body" });
    const DIFF_DELETE = -1;
    const DIFF_INSERT = 1;
    for (const d of diffs) {
      const op = d[0];
      const text2 = d[1];
      if (op === DIFF_INSERT) continue;
      const span = body.createSpan({
        cls: op === DIFF_DELETE ? "markpad-history-diff-removed" : "markpad-history-diff-equal",
        text: text2
      });
      span.style.whiteSpace = "pre-wrap";
    }
  }
};

// src/main.ts
var SHARE_FRONTMATTER_KEY = "markpadShare";
var FOLDER_SHARE_FILENAME = ".markpad-folder-share.md";
var isFolderSharePath = (vaultPath) => {
  const p = vaultPath.toLowerCase();
  return p.endsWith(".md") || p.endsWith(".base");
};
var FOLDER_SHARE_FM = "markpadFolderShare";
var MARKPAD_INDICATOR_CSS = `
.markpad-shared-indicator,
.markpad-folder-shared-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  margin-left: 4px;
  flex-shrink: 0;
}
.markpad-shared-indicator svg,
.markpad-folder-shared-indicator svg {
  width: 14px;
  height: 14px;
  opacity: 0.85;
}
`;
var parentPathOf = (path) => {
  const idx = path.lastIndexOf("/");
  return idx <= 0 ? "" : path.slice(0, idx);
};
var isPathInFolder = (path, folderRoot) => folderRoot === "" ? true : path === folderRoot || path.startsWith(`${folderRoot}/`);
var folderPartOf = (path) => {
  const idx = path.lastIndexOf("/");
  return idx <= 0 ? "" : path.slice(0, idx);
};
var splitFolderSegments = (path) => path.split("/").map((s) => s.trim()).filter((s) => s.length > 0);
var commonFolderRootOf = (paths) => {
  if (paths.length === 0) return "";
  const split = paths.map((p) => folderPartOf(p).split("/").filter(Boolean)).filter((parts) => parts.length > 0);
  if (split.length === 0) return "";
  const first = split[0];
  const out = [];
  for (let i = 0; i < first.length; i += 1) {
    const segment = first[i];
    if (split.every((parts) => parts[i] === segment)) out.push(segment);
    else break;
  }
  return out.join("/");
};
var JoinShareModal = class extends import_obsidian6.Modal {
  resolveFn = null;
  shareInput = "";
  roomPassword = "";
  constructor(app, options) {
    super(app);
    this.shareInput = options.initialShareInput ?? "";
    this.roomPassword = options.initialPassword ?? "";
  }
  openAndWait() {
    return new Promise((resolve) => {
      this.resolveFn = resolve;
      this.open();
    });
  }
  onOpen() {
    const { contentEl, titleEl } = this;
    titleEl.setText("Rejoindre un partage Markpad");
    contentEl.empty();
    contentEl.createEl("p", {
      text: "Collez l\u2019URL de partage (ou directement le room ID)."
    });
    const shareInput = contentEl.createEl("input", {
      type: "text",
      placeholder: "http://localhost:8081/share/\u2026"
    });
    shareInput.value = this.shareInput;
    shareInput.style.width = "100%";
    shareInput.style.marginBottom = "10px";
    const passLabel = contentEl.createEl("label", { text: "Mot de passe (optionnel)" });
    passLabel.style.display = "block";
    passLabel.style.marginBottom = "4px";
    const passInput = contentEl.createEl("input", { type: "password" });
    passInput.value = this.roomPassword;
    passInput.style.width = "100%";
    const actions = contentEl.createDiv();
    actions.style.display = "flex";
    actions.style.justifyContent = "flex-end";
    actions.style.gap = "8px";
    actions.style.marginTop = "12px";
    const cancelBtn = actions.createEl("button", { text: "Annuler" });
    const joinBtn = actions.createEl("button", { text: "Rejoindre" });
    joinBtn.addClass("mod-cta");
    const submit = () => {
      this.shareInput = shareInput.value.trim();
      this.roomPassword = passInput.value;
      if (!this.shareInput) {
        new import_obsidian6.Notice("Colle un lien de partage ou un room ID.");
        shareInput.focus();
        return;
      }
      this.resolveFn?.({
        shareInput: this.shareInput,
        roomPassword: this.roomPassword
      });
      this.resolveFn = null;
      this.close();
    };
    joinBtn.addEventListener("click", submit);
    cancelBtn.addEventListener("click", () => {
      this.resolveFn?.(null);
      this.resolveFn = null;
      this.close();
    });
    shareInput.addEventListener("keydown", (evt) => {
      if (evt.key === "Enter") {
        evt.preventDefault();
        submit();
      }
    });
    passInput.addEventListener("keydown", (evt) => {
      if (evt.key === "Enter") {
        evt.preventDefault();
        submit();
      }
    });
    window.setTimeout(() => shareInput.focus(), 10);
  }
  onClose() {
    if (this.resolveFn) {
      this.resolveFn(null);
      this.resolveFn = null;
    }
    this.contentEl.empty();
  }
};
var MarkpadPlugin = class extends import_obsidian6.Plugin {
  settings = DEFAULT_SETTINGS;
  /** Ancien réglage « User ID » (migration) — utilisé pour la collab si pas encore de jeton. */
  legacyUserId = "";
  activeRuntime = null;
  statusBarEl = null;
  decoratedEls = /* @__PURE__ */ new Set();
  sharedNotes = /* @__PURE__ */ new Map();
  /** Clé = chemin du dossier parent du fichier ancre. */
  folderSharesMeta = /* @__PURE__ */ new Map();
  /** File ancre dossier : file d’attente par chemin pour éviter courses create/modify. */
  folderAnchorWriteQueue = /* @__PURE__ */ new Map();
  autoConnectTimer = null;
  /** Délai avant passage en lecture seule après une coupure WS (évite le flash sur reconnects brefs). */
  collabReadonlyTimer = null;
  /** Vrai dès que le WS s'est connecté au moins une fois dans la session courante. */
  collabHasEverConnected = false;
  /** Vrai si la note est actuellement en lecture seule (WS perdu). */
  collabIsReadonly = false;
  /** Évite de répéter la Notice de patch WebSocket échoué à chaque reconnexion. */
  patchFailedNoticeShown = false;
  /** État WS pour l’icône de la session active (connecting / connected / disconnected). */
  collabWsStatus = "disconnected";
  /** Reconcile post-sync note en cours (affiche une icône « chargement »). */
  postSyncReconcileRunning = false;
  /** Débounce disque → Y pour les fichiers partagés (vault modify). */
  vaultSyncTimers = /* @__PURE__ */ new Map();
  /** Évite une boucle vault.modify ↔ syncFolderFilesFromY. */
  suppressVaultToY = false;
  /** Évite la réentrance Y.Map observe / sync dossier (stack overflow). */
  folderSyncInProgress = false;
  folderSyncQueued = false;
  /** Débounce sync vault après updates Y distants (évite FM/cursor toutes les ~200 ms). */
  folderRemoteSyncTimer = null;
  /** Débounce meta Y → frontmatter vault (fichier actif dossier). */
  activeFileMetaToVaultTimer = null;
  /** Bloque tryAutoConnect pendant startSharing / attach explicite (évite un 2e attach seed=false). */
  collabAttachInProgress = false;
  /** Après un attach réussi : pas de disconnect sur flicker UI / auto-connect agressif. */
  attachGraceUntil = 0;
  attachGracePath = "";
  attachGraceFolderRoot = "";
  /** Ajouts/suppressions vault en attente quand la room dossier n’est pas connectée. */
  pendingFolderYOpsByRoom = /* @__PURE__ */ new Map();
  applyBodyYToCmHealed(cm, doc2, body) {
    healBodyYTextIfPolluted(doc2, body, "markpad-heal-before-cm");
    return applyYTextToCm(cm, body);
  }
  /**
   * Après un update Y distant, le Y.Text du facet CM peut être périmé (référence détachée).
   * Re-monte la liaison et réinjecte le corps CM→Y si Y est vide.
   */
  healNoteCollabCmBinding(doc2, cm, awareness, reason) {
    const fresh = getNoteBodyYText(doc2);
    let facetY;
    try {
      facetY = cm.state.facet(ySyncFacet)?.ytext;
    } catch {
      facetY = void 0;
    }
    if (!facetY || facetY !== fresh) {
      markpadCollabDebug("note: heal binding \u2192 re-montage CM\u2194Y", { reason, facetStale: facetY !== fresh });
      remountCollabExtensionForYText(cm, fresh, awareness);
    }
    const cmStr = cm.state.doc.toString();
    let yStr = fresh.toString();
    if (yStr.length === 0 && cmStr.length > 0) {
      applyMinimalYTextEdit(doc2, fresh, yStr, cmStr, "markpad-heal-y-empty");
      yStr = fresh.toString();
      markpadCollabDebug("note: heal binding \u2192 Y r\xE9inject\xE9 depuis CM", { reason, yLen: yStr.length });
    } else if (yStr.length > 0 && cmStr.length === 0) {
      this.applyBodyYToCmHealed(cm, doc2, fresh);
    }
    return fresh;
  }
  fileExplorerObserver = null;
  fileExplorerObservedEl = null;
  /** Débounce : la liste virtualisée mutate en continu (~chaque frame) ; sans délai on saturerait le CPU. */
  explorerMutateDebounceTimer = null;
  /** Évite la réentrance : sync Yjs / layout peuvent rappeler decorate pendant un decorate. */
  decorateSharedUiRunning = false;
  decorateSharedUiCoalesce = false;
  constructor(app, manifest) {
    super(app, manifest);
  }
  async onload() {
    await this.loadSettings();
    setMarkpadCollabDebug(this.settings.debugCollab);
    this.addSettingTab(new MarkpadSettingTab(this.app, this));
    this.registerView(MARKPAD_SHARES_VIEW_TYPE, (leaf) => new MarkpadSharesView(leaf, this));
    this.registerView(MARKPAD_HISTORY_VIEW_TYPE, (leaf) => new MarkpadHistoryView(leaf, this));
    this.statusBarEl = this.addStatusBarItem();
    this.updateStatusBar("off");
    const styleEl = document.createElement("style");
    styleEl.textContent = MARKPAD_INDICATOR_CSS;
    document.head.appendChild(styleEl);
    this.register(() => styleEl.remove());
    const L = this.settings.locale;
    this.addCommand({
      id: "markpad-start-sharing",
      name: t(L, "cmdStartSharing"),
      callback: () => void this.startSharing()
    });
    this.addCommand({
      id: "markpad-join-shared-note",
      name: t(L, "cmdJoinShared"),
      callback: () => void this.joinSharedNote()
    });
    this.addRibbonIcon("share-2", t(L, "ribbonStart"), () => {
      void this.startSharing();
    });
    this.addCommand({
      id: "markpad-copy-share-link",
      name: t(L, "cmdCopyLink"),
      callback: () => void this.copyShareLink()
    });
    this.addCommand({
      id: "markpad-stop-sharing-current-note",
      name: t(L, "cmdStopSharing"),
      callback: () => void this.stopSharingCurrentNote()
    });
    this.addCommand({
      id: "markpad-open-shares-panel",
      name: t(L, "cmdSharesPanel"),
      callback: () => void this.openSharesPanel()
    });
    this.addCommand({
      id: "markpad-open-history-panel",
      name: L === "en" ? "Open history panel" : "Ouvrir le panneau historique",
      callback: () => void this.openHistoryPanel()
    });
    this.registerEvent(
      this.app.workspace.on("editor-change", (editor, info) => {
        if (!this.settings.debugCollab || !this.activeRuntime) return;
        const path = info.file?.path;
        if (path !== this.activeRuntime.filePath) return;
        const cmText = this.activeRuntime.mode === "folder" && this.activeRuntime.cmView ? this.activeRuntime.cmView.state.doc.toString() : editor.getValue();
        const yText = this.activeRuntime.yText.toString();
        markpadCollabDebug("workspace editor-change", {
          cmLen: cmText.length,
          yLen: yText.length,
          same: cmText === yText
        });
      })
    );
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        if (file instanceof import_obsidian6.TFolder) {
          menu.addItem(
            (item) => item.setTitle(t(this.settings.locale, "folderShareMenu")).setIcon("share-2").onClick(() => void this.startSharingFolder(file))
          );
          const folderMeta = this.folderSharesMeta.get(file.path);
          if (folderMeta) {
            menu.addItem(
              (item) => item.setTitle(t(this.settings.locale, "folderCopyLink")).setIcon("copy").onClick(() => void this.copyShareLinkForFolder(file.path))
            );
            menu.addItem(
              (item) => item.setTitle(t(this.settings.locale, "folderStopSharing")).setIcon("x-circle").onClick(() => void this.stopSharingFolderByPath(file.path))
            );
          }
          return;
        }
        if (!(file instanceof import_obsidian6.TFile)) return;
        if (this.isMarkdownFile(file)) {
          menu.addItem(
            (item) => item.setTitle("Markpad: Start sharing this note").setIcon("share-2").onClick(() => void this.startSharingFromFile(file))
          );
        }
        const share = this.sharedNotes.get(file.path);
        if (!share) return;
        menu.addItem(
          (item) => item.setTitle("Markpad: Copy share link").setIcon("copy").onClick(() => void this.copyShareLinkForPath(file.path))
        );
        menu.addItem(
          (item) => item.setTitle("Markpad: Stop sharing").setIcon("x-circle").onClick(() => void this.stopSharingPath(file.path))
        );
      })
    );
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => this.decorateSharedUi())
    );
    this.registerEvent(
      this.app.workspace.on("layout-change", () => {
        this.scheduleDecorateSharedUiSoon();
        this.ensureFileExplorerDecorationObserver();
      })
    );
    this.registerEvent(
      this.app.workspace.on("file-open", (file) => {
        this.decorateSharedUi();
        if (!file || !this.activeRuntime || this.activeRuntime.filePath !== file.path || this.activeRuntime.mode !== "note") {
          const activeView = this.app.workspace.getActiveViewOfType(import_obsidian6.MarkdownView);
          if (activeView) {
            const cm = resolveObsidianEditorView(activeView);
            if (cm) hideReadonlyBanner(cm);
          }
        }
        if (file instanceof import_obsidian6.TFile && this.isMarkdownFile(file)) {
          void this.onFileOpenReattach(file);
          if (this.activeRuntime?.mode === "folder") {
            window.setTimeout(() => {
              void this.ensureFolderCollabForOpenedFile(file);
            }, 80);
          }
        }
      })
    );
    this.registerDomEvent(document, "click", (event) => {
      const trigger = event.target?.closest(
        ".markpad-shared-indicator, .markpad-folder-shared-indicator"
      );
      if (!trigger) return;
      event.preventDefault();
      const host = trigger.closest("[data-path]");
      const path = host?.getAttribute("data-path");
      if (!path) return;
      if (trigger.classList.contains("markpad-folder-shared-indicator")) {
        void this.copyShareLinkForFolder(path);
      } else {
        void this.copyShareLinkForPath(path);
      }
    });
    this.statusBarEl?.addEventListener("click", () => this.showConnectedUsers());
    this.rebuildSharedNotesFromFrontmatter();
    this.registerEvent(
      this.app.vault.on("modify", (file) => {
        if (!this.isMarkdownFile(file)) return;
        const before = this.getSharesPanelSignature();
        this.syncShareFromFileFrontmatter(file);
        this.queueVaultSyncToY(file);
        this.decorateSharedUi();
        if (this.getSharesPanelSignature() !== before) {
          this.refreshSharesPanel();
        }
      })
    );
    this.registerEvent(
      this.app.vault.on("delete", (file) => {
        void this.handleVaultDelete(file);
      })
    );
    this.registerEvent(
      this.app.vault.on("rename", (file, oldPath) => {
        if (file instanceof import_obsidian6.TFolder) {
          void this.applyFolderShareAfterFolderRename(oldPath, file.path);
          return;
        }
        if (!(file instanceof import_obsidian6.TFile)) return;
        const share = this.sharedNotes.get(oldPath);
        if (share) {
          this.sharedNotes.delete(oldPath);
          this.sharedNotes.set(file.path, share);
        } else if (this.isMarkdownFile(file)) {
          window.setTimeout(() => {
            const before = this.getSharesPanelSignature();
            this.syncShareFromFileFrontmatter(file);
            this.decorateSharedUi();
            if (this.getSharesPanelSignature() !== before) {
              this.refreshSharesPanel();
            }
          }, 120);
        }
        for (const [root, meta] of Array.from(this.folderSharesMeta.entries())) {
          let changed = false;
          meta.paths = meta.paths.map((p) => {
            if (p !== oldPath) return p;
            changed = true;
            return file.path;
          });
          if (meta.anchorPath === oldPath) {
            meta.anchorPath = file.path;
            changed = true;
          }
          if (changed) {
            const nextRoot = parentPathOf(meta.anchorPath);
            if (nextRoot !== root) {
              this.folderSharesMeta.delete(root);
              this.folderSharesMeta.set(nextRoot, meta);
            } else {
              this.folderSharesMeta.set(root, meta);
            }
            this.migrateYMapKeyAfterFileRename(oldPath, file.path, meta.roomId);
          }
        }
        if (this.isFolderShareSyncFile(file)) {
          for (const [root, meta] of this.folderSharesMeta) {
            if (!isPathInFolder(file.path, root)) continue;
            if (meta.paths.includes(file.path)) continue;
            void this.registerFileInFolderShare(file, root, meta);
          }
        }
        for (const [root, meta] of Array.from(this.folderSharesMeta.entries())) {
          if (!meta.paths.includes(oldPath)) continue;
          if (isPathInFolder(file.path, root)) continue;
          void this.removeSingleFileFromFolderShare(oldPath, root, meta, { silent: true });
        }
        if (this.activeRuntime?.filePath === oldPath) {
          this.activeRuntime.filePath = file.path;
        }
        this.decorateSharedUi();
        this.refreshSharesPanel();
      })
    );
    this.decorateSharedUi();
    this.app.workspace.onLayoutReady(() => {
      this.ensureFileExplorerDecorationObserver();
      this.rebuildSharedNotesFromFrontmatter();
      void this.rebuildFolderSharesFromFiles().then(() => {
        this.queueAutoConnect();
      });
    });
    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        this.syncShareFromFileFrontmatter(file);
      })
    );
    this.registerEvent(
      this.app.metadataCache.on("resolved", () => {
        this.refreshSharesPanel();
        this.queueAutoConnect();
      })
    );
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        this.queueAutoConnect();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    this.register(() => document.removeEventListener("visibilitychange", onVisibilityChange));
    this.registerEvent(
      this.app.vault.on("create", (file) => {
        if (!(file instanceof import_obsidian6.TFile) || !this.isFolderShareSyncFile(file)) return;
        void this.onMarkdownCreated(file);
      })
    );
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => {
        this.queueAutoConnect();
        void this.onFolderLeafChange();
      })
    );
  }
  onunload() {
    if (this.autoConnectTimer != null) {
      window.clearTimeout(this.autoConnectTimer);
      this.autoConnectTimer = null;
    }
    this.teardownFileExplorerDecorationObserver();
    this.disconnect();
  }
  async saveSettings() {
    await this.saveData(this.settings);
    setMarkpadCollabDebug(this.settings.debugCollab);
  }
  async loadSettings() {
    const loaded = await this.loadData();
    const merged = { ...DEFAULT_SETTINGS, ...loaded ?? {} };
    if (!merged.authToken && loaded?.apiKey) {
      merged.authToken = String(loaded.apiKey).trim();
    }
    merged.authToken = normalizeAuthToken(merged.authToken);
    this.legacyUserId = String(loaded?.userId ?? "").trim();
    this.settings = merged;
  }
  awarenessUserId() {
    return resolveAwarenessUserId(
      this.settings.authToken,
      this.settings.displayName,
      this.legacyUserId
    );
  }
  noticeAuthTokenIssue() {
    const issue = diagnoseAuthToken(this.settings.authToken);
    if (issue === "legacy_api_key") {
      new import_obsidian6.Notice(
        "Markpad : l\u2019ancienne cl\xE9 API (ex. dev-key) ne fonctionne plus. Connectez-vous sur Mon compte (web) et copiez le jeton JWT."
      );
      return;
    }
    if (issue === "invalid_jwt") {
      new import_obsidian6.Notice(
        "Markpad : jeton illisible ou incomplet. Sur Mon compte, cliquez \xAB Copier le jeton \xBB et recollez-le enti\xE8rement dans Obsidian."
      );
      return;
    }
    new import_obsidian6.Notice("Configurez le jeton de connexion (Mon compte) avant de partager.");
  }
  getActiveMarkdownFileAndView() {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian6.MarkdownView);
    if (!view) return void 0;
    const file = view.file;
    if (!file) return void 0;
    return { file, view };
  }
  /** Inclut les « rogue leaf » (ex. modale du plugin Base Board). */
  findMarkdownViewForPath(path) {
    let found = null;
    this.app.workspace.iterateAllLeaves((leaf) => {
      const view = leaf.view;
      if (view instanceof import_obsidian6.MarkdownView && view.file?.path === path) {
        found = view;
      }
    });
    return found;
  }
  isMarkdownFile(file) {
    return file instanceof import_obsidian6.TFile && file.extension.toLowerCase() === "md";
  }
  /** Markdown ou fichier `.base` (Obsidian Bases / Kanban web). */
  isFolderShareSyncFile(file) {
    if (!(file instanceof import_obsidian6.TFile)) return false;
    const ext = file.extension.toLowerCase();
    return ext === "md" || ext === "base";
  }
  /** Laisse Obsidian mettre à jour le buffer après une écriture disque (ex. frontmatter). */
  async flushEditorAfterVaultWrite() {
    await new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => resolve());
      });
    });
  }
  queueAutoConnect() {
    if (this.autoConnectTimer != null) {
      window.clearTimeout(this.autoConnectTimer);
    }
    this.autoConnectTimer = window.setTimeout(() => {
      this.autoConnectTimer = null;
      void this.tryAutoConnectActiveFile();
    }, 450);
  }
  isAttachGraceActive(filePath) {
    if (Date.now() >= this.attachGraceUntil) return false;
    if (!filePath) {
      return this.attachGracePath !== "" || this.attachGraceFolderRoot !== "";
    }
    if (this.attachGracePath && filePath === this.attachGracePath) return true;
    if (this.attachGraceFolderRoot) {
      const root = this.attachGraceFolderRoot;
      return filePath === root || filePath.startsWith(`${root}/`);
    }
    return false;
  }
  markAttachGrace(filePath, ms = 3e4) {
    this.attachGraceUntil = Date.now() + ms;
    this.attachGracePath = filePath;
    this.attachGraceFolderRoot = "";
  }
  markAttachGraceFolder(folderRoot, ms = 3e4) {
    this.attachGraceUntil = Date.now() + ms;
    this.attachGraceFolderRoot = folderRoot;
    this.attachGracePath = "";
  }
  async tryAutoConnectActiveFile() {
    if (!this.settings.autoReconnect) return;
    if (this.collabAttachInProgress) return;
    const active = this.getActiveMarkdownFileAndView();
    if (!active) {
      if (this.activeRuntime) {
        if (this.isAttachGraceActive(this.activeRuntime.filePath)) {
          markpadCollabDebug("tryAutoConnect: pas de disconnect (grace, pas de vue MD transitoire)");
          return;
        }
        this.disconnect();
      }
      return;
    }
    const noteShare = this.getNoteShareForFile(active.file);
    if (noteShare) {
      if (this.activeRuntime?.mode === "note" && this.activeRuntime.filePath === active.file.path && this.activeRuntime.roomId === noteShare.roomId) {
        const currentCm = resolveObsidianEditorView(active.view);
        if (currentCm) {
          const cmChanged = currentCm !== this.activeRuntime.cmView;
          const notMounted = !isCollabMounted(currentCm);
          if (cmChanged || notMounted) {
            markpadCollabDebug("note:re-mount apr\xE8s navigation", {
              cmChanged,
              notMounted,
              yLen: this.activeRuntime.yText.toString().length
            });
            if (cmChanged) {
              try {
                unmountCollabExtension(this.activeRuntime.cmView);
              } catch {
              }
              this.activeRuntime.cmView = currentCm;
            }
            remountCollabExtensionForYText(
              currentCm,
              this.activeRuntime.yText,
              this.activeRuntime.provider.awareness
            );
            this.applyBodyYToCmHealed(
              currentCm,
              this.activeRuntime.doc,
              this.activeRuntime.yText
            );
          }
        }
        if (!this.activeRuntime.provider.wsconnected) {
          this.activeRuntime.provider.connect();
        }
        return;
      }
      if (this.activeRuntime) {
        if (this.activeRuntime.mode === "note" && this.activeRuntime.filePath === active.file.path && this.activeRuntime.roomId === noteShare.roomId) {
          if (!this.activeRuntime.provider.wsconnected) {
            this.activeRuntime.provider.connect();
          }
          return;
        }
        if (this.isAttachGraceActive(active.file.path)) {
          markpadCollabDebug("tryAutoConnect: pas de disconnect (grace, re-attach \xE9vit\xE9)");
          return;
        }
        this.disconnect();
      }
      const editorHasContent = await this.activeFileHasShareableContent(active.file, active.view);
      try {
        await this.attachSharedSession(active.file, active.view, noteShare.roomId, noteShare.shareUrl, {
          roomPassword: this.settings.defaultRoomPassword || void 0,
          seedFullFromEditor: editorHasContent,
          reconcileLocalOnFirstSync: editorHasContent
        });
      } catch (error) {
        const msg = error.message;
        if (msg === "folder_mode_required") {
          for (const [root, meta] of this.folderSharesMeta) {
            if (!meta.paths.includes(active.file.path) && !isPathInFolder(active.file.path, root)) {
              continue;
            }
            if (!meta.paths.includes(active.file.path)) {
              await this.registerFileInFolderShare(active.file, root, meta);
            }
            try {
              await this.attachFolderSharedSession(active.file, active.view, meta, {
                seedLocalFiles: true
              });
            } catch (e2) {
              const m2 = e2.message;
              if (m2 !== "no_cm") new import_obsidian6.Notice(`Markpad auto-connect: ${m2}`);
            }
            return;
          }
        }
        if (msg !== "no_cm") {
          new import_obsidian6.Notice(`Markpad auto-connect: ${msg}`);
        }
      }
      return;
    }
    for (const [root, meta] of this.folderSharesMeta) {
      const inFolderShare = meta.paths.includes(active.file.path) || isPathInFolder(active.file.path, root);
      if (!inFolderShare) continue;
      if (!meta.paths.includes(active.file.path)) {
        await this.registerFileInFolderShare(active.file, root, meta);
      }
      if (this.activeRuntime?.mode === "folder" && this.activeRuntime.roomId === meta.roomId) {
        if (this.activeRuntime.filePath !== active.file.path) {
          await this.switchFolderActiveFile(active.file);
        } else {
          const currentCm = resolveObsidianEditorView(active.view);
          if (currentCm) {
            const cmChanged = currentCm !== this.activeRuntime.cmView;
            const notMounted = !isCollabMounted(currentCm);
            if (cmChanged || notMounted) {
              markpadCollabDebug("folder:re-mount apr\xE8s navigation", { cmChanged, notMounted });
              if (cmChanged) {
                try {
                  unmountCollabEditable(this.activeRuntime.cmView);
                } catch {
                }
                try {
                  unmountCollabExtension(this.activeRuntime.cmView);
                } catch {
                }
                this.activeRuntime.cmView = currentCm;
              }
              remountCollabExtensionForYText(currentCm, this.activeRuntime.yText, this.activeRuntime.provider.awareness);
              this.applyBodyYToCmHealed(
                currentCm,
                this.activeRuntime.doc,
                this.activeRuntime.yText
              );
              mountCollabEditable(currentCm, !this.collabIsReadonly);
            }
          }
          if (!this.activeRuntime.provider.wsconnected) {
            this.activeRuntime.provider.connect();
          }
        }
        return;
      }
      if (this.activeRuntime) {
        if (this.activeRuntime.mode === "folder" && this.activeRuntime.roomId === meta.roomId) {
          if (this.activeRuntime.filePath !== active.file.path) {
            await this.switchFolderActiveFile(active.file);
          } else if (!this.activeRuntime.provider.wsconnected) {
            this.activeRuntime.provider.connect();
          }
          return;
        }
        if (this.isAttachGraceActive(active.file.path)) {
          markpadCollabDebug("tryAutoConnect: pas de disconnect dossier (grace)");
          return;
        }
        this.disconnect();
      }
      try {
        await this.attachFolderSharedSession(active.file, active.view, meta, {
          seedLocalFiles: true
        });
      } catch (error) {
        const msg = error.message;
        if (msg !== "no_cm") {
          new import_obsidian6.Notice(`Markpad auto-connect: ${msg}`);
        }
      }
      return;
    }
    if (this.activeRuntime) {
      if (this.activeRuntime.mode === "note" && this.sharedNotes.has(this.activeRuntime.filePath)) {
        markpadCollabDebug("tryAutoConnect: session note conserv\xE9e (sharedNotes, cache FM en retard)");
        return;
      }
      if (this.activeRuntime.mode === "folder") {
        for (const meta of this.folderSharesMeta.values()) {
          if (meta.paths.includes(this.activeRuntime.filePath)) {
            markpadCollabDebug("tryAutoConnect: session dossier conserv\xE9e (meta.paths)");
            return;
          }
        }
      }
      if (this.isAttachGraceActive(active.file.path)) {
        markpadCollabDebug("tryAutoConnect: pas de disconnect (grace, pas de partage d\xE9tect\xE9)");
        return;
      }
      if (this.activeRuntime.mode === "folder") {
        const folderRoot = this.activeRuntime.folderRoot ?? "";
        const path = active.file.path;
        const withinFolderRoot = folderRoot.length > 0 && (path === folderRoot || path.startsWith(`${folderRoot}/`));
        if (!withinFolderRoot) this.disconnect();
      } else {
        this.disconnect();
      }
    }
  }
  /**
   * Re-monte la collab extension immédiatement à l'ouverture d'un fichier,
   * sans attendre le debounce de 450ms de `queueAutoConnect`.
   * Si la note partagée vient d'être (re)ouverte, yCollab pousse Y → CM dès maintenant,
   * appliquant tous les changements distants reçus pendant que la note était fermée.
   */
  async onFileOpenReattach(file) {
    if (!this.activeRuntime) return;
    if (this.activeRuntime.mode === "folder") {
      if (!this.activeRuntime.sharedPaths?.includes(file.path)) return;
      await new Promise((resolve) => window.setTimeout(resolve, 0));
      await this.ensureFolderCollabForOpenedFile(file);
      return;
    }
    if (this.activeRuntime.filePath !== file.path || this.activeRuntime.mode !== "note") return;
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    const view = this.app.workspace.getActiveViewOfType(import_obsidian6.MarkdownView);
    if (!view || view.file?.path !== file.path) return;
    const currentCm = resolveObsidianEditorView(view);
    if (!currentCm) return;
    const cmChanged = currentCm !== this.activeRuntime.cmView;
    const notMounted = !isCollabMounted(currentCm);
    if (!cmChanged && !notMounted) return;
    markpadCollabDebug("file-open: re-mount imm\xE9diat", {
      cmChanged,
      notMounted,
      yLen: this.activeRuntime.yText.toString().length
    });
    if (cmChanged) {
      try {
        unmountCollabExtension(this.activeRuntime.cmView);
      } catch {
      }
      this.activeRuntime.cmView = currentCm;
    }
    remountCollabExtensionForYText(
      currentCm,
      this.activeRuntime.yText,
      this.activeRuntime.provider.awareness
    );
    const synced = this.applyBodyYToCmHealed(
      currentCm,
      this.activeRuntime.doc,
      this.activeRuntime.yText
    );
    markpadCollabDebug("file-open: sync Y\u2192CM initial", {
      synced,
      yLen: this.activeRuntime.yText.toString().length,
      cmLen: currentCm.state.doc.toString().length
    });
    const editable = !this.collabIsReadonly;
    mountCollabEditable(currentCm, editable);
    if (!this.activeRuntime.provider.wsconnected) {
      this.activeRuntime.provider.connect();
    }
  }
  /** Met à jour Y depuis le vault (meta toujours ; corps si fichier non actif dans l’éditeur). */
  /** Éditeur Obsidian souvent vide au 1er frame ; repli sur le disque. */
  async readMarkdownForSeed(file, view) {
    const fromEditor = view.editor.getValue();
    if (fromEditor.trim().length > 0) return fromEditor;
    try {
      return await this.app.vault.read(file);
    } catch {
      return "";
    }
  }
  async activeFileHasShareableContent(file, view) {
    return (await this.readMarkdownForSeed(file, view)).trim().length > 0;
  }
  fileInActiveCollabRoom(file) {
    if (!this.activeRuntime) return false;
    if (this.activeRuntime.roomId) {
      const share = this.sharedNotes.get(file.path);
      if (share?.roomId === this.activeRuntime.roomId) return true;
      const folder = this.getFolderShareMetaForFile(file);
      if (folder?.meta.roomId === this.activeRuntime.roomId) return true;
    }
    return false;
  }
  queueVaultSyncToY(file) {
    if (!this.activeRuntime) return;
    if (!this.fileInActiveCollabRoom(file)) return;
    const prev = this.vaultSyncTimers.get(file.path);
    if (prev != null) window.clearTimeout(prev);
    this.vaultSyncTimers.set(
      file.path,
      window.setTimeout(() => {
        this.vaultSyncTimers.delete(file.path);
        void this.syncVaultFileIntoY(file);
      }, 400)
    );
  }
  collabMetaKeys(meta) {
    return Object.keys(meta).filter((k) => !OBSIDIAN_ONLY_META_KEYS.has(k));
  }
  collabMetaEquals(a, b) {
    const keys2 = /* @__PURE__ */ new Set([...this.collabMetaKeys(a), ...this.collabMetaKeys(b)]);
    for (const k of keys2) {
      if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) return false;
    }
    return true;
  }
  /**
   * Réécrit le frontmatter vault depuis Y.meta sans toucher au corps CM/Y
   * (évite la perte de YAML quand Obsidian autosave le buffer corps seul).
   */
  async syncActiveFileVaultFrontmatterFromY(file, metaMap, bodyY) {
    const yMeta = metaMapToRecord(metaMap);
    if (this.collabMetaKeys(yMeta).length === 0) return false;
    let raw;
    try {
      raw = await this.app.vault.read(file);
    } catch {
      return false;
    }
    const parsed = parseNoteFromMarkdown(raw);
    if (this.collabMetaEquals(parsed.meta, yMeta)) return false;
    const yBody = stripEmbeddedFrontmatterFromBody(bodyY.toString());
    if (parsed.body.trim() !== yBody.trim()) {
      markpadCollabDebug("folder:sync meta\u2192FM ignor\xE9 (corps disque \u2260 Y)", file.path);
      return false;
    }
    this.suppressVaultToY = true;
    try {
      await this.app.fileManager.processFrontMatter(file, (fm) => {
        for (const k of Object.keys(fm)) {
          if (OBSIDIAN_ONLY_META_KEYS.has(k)) continue;
          if (!(k in yMeta)) delete fm[k];
        }
        for (const [k, v] of Object.entries(yMeta)) {
          if (!OBSIDIAN_ONLY_META_KEYS.has(k)) fm[k] = v;
        }
      });
      markpadCollabDebug("folder:sync meta\u2192FM (fichier actif, corps inchang\xE9)", file.path);
      return true;
    } catch (e) {
      markpadCollabDebug("folder:sync meta\u2192FM \xE9chou\xE9e", file.path, e);
      return false;
    } finally {
      this.suppressVaultToY = false;
    }
  }
  queueActiveFileMetaToVault(file) {
    if (this.activeFileMetaToVaultTimer != null) {
      window.clearTimeout(this.activeFileMetaToVaultTimer);
    }
    this.activeFileMetaToVaultTimer = window.setTimeout(() => {
      this.activeFileMetaToVaultTimer = null;
      void this.flushActiveFileMetaToVault(file);
    }, 800);
  }
  async flushActiveFileMetaToVault(file) {
    if (!this.activeRuntime || this.activeRuntime.mode !== "folder") return;
    if (this.activeRuntime.filePath !== file.path) return;
    const entry = getFileEntry(this.activeRuntime.doc, file.path);
    if (!entry) return;
    await this.syncActiveFileVaultFrontmatterFromY(file, getMetaYMap(entry), getBodyYText(entry));
  }
  bindFolderActiveMetaObserve(file, doc2) {
    if (!this.activeRuntime || this.activeRuntime.mode !== "folder") return;
    this.activeRuntime.folderMetaObserveUnload?.();
    const entry = getFileEntry(doc2, file.path);
    if (!entry) return;
    const metaMap = getMetaYMap(entry);
    const onChange2 = () => {
      if (!this.activeRuntime || this.activeRuntime.doc !== doc2 || this.activeRuntime.mode !== "folder") {
        return;
      }
      if (this.activeRuntime.filePath !== file.path) return;
      this.queueActiveFileMetaToVault(file);
    };
    metaMap.observe(onChange2);
    this.activeRuntime.folderMetaObserveUnload = () => metaMap.unobserve(onChange2);
  }
  async syncVaultFileIntoY(file) {
    if (!this.activeRuntime || this.suppressVaultToY) return;
    if (!this.fileInActiveCollabRoom(file)) return;
    try {
      const raw = await this.app.vault.read(file);
      const parsed = parseNoteFromMarkdown(raw);
      const { doc: doc2, mode, filePath } = this.activeRuntime;
      if (mode === "note") {
        const noteMeta = getNoteMetaYMap(doc2);
        const yMeta = metaMapToRecord(noteMeta);
        const diskHasFm = getFrontmatterPrefixLength(raw) != null;
        const yHasMeta = this.collabMetaKeys(yMeta).length > 0;
        if (filePath === file.path && !diskHasFm && yHasMeta) {
          await this.syncActiveFileVaultFrontmatterFromY(
            file,
            noteMeta,
            getNoteBodyYText(doc2)
          );
          return;
        }
        mergeMetaFromParsed(doc2, noteMeta, parsed.meta, "markpad-vault-meta");
        if (filePath !== file.path) return;
        return;
      }
      let entry = getFileEntry(doc2, file.path);
      const files = doc2.getMap("files");
      const legacy = files.get(file.path);
      if (!entry && legacy instanceof Y11.Text) {
        entry = upgradeLegacyFileEntry(doc2, file.path, legacy, "markpad-vault-upgrade");
      }
      const isActive = filePath === file.path;
      if (isActive && entry) {
        const bodyY = getBodyYText(entry);
        const yBody = stripEmbeddedFrontmatterFromBody(bodyY.toString());
        const cmBody = this.activeRuntime.cmView.state.doc.toString();
        const vaultBody = stripEmbeddedFrontmatterFromBody(parsed.body);
        const externalEditor = vaultBody.trim() !== yBody.trim() && vaultBody.trim() !== cmBody.trim();
        if (externalEditor) {
          reconcileLocalBodyIntoY(doc2, bodyY, parsed.body);
          mergeMetaFromParsed(doc2, getMetaYMap(entry), parsed.meta, "markpad-vault-external");
          markpadCollabDebug("vault\u2192Y corps+meta (\xE9diteur externe / modal)", file.path);
          void this.ensureFolderCollabForOpenedFile(file);
          return;
        }
        const metaMap = getMetaYMap(entry);
        const yMeta = metaMapToRecord(metaMap);
        const diskHasFm = getFrontmatterPrefixLength(raw) != null;
        const yHasMeta = this.collabMetaKeys(yMeta).length > 0;
        if (!diskHasFm && yHasMeta) {
          await this.syncActiveFileVaultFrontmatterFromY(
            file,
            metaMap,
            bodyY
          );
          return;
        }
        mergeMetaFromParsed(doc2, metaMap, parsed.meta, "markpad-vault-meta");
        return;
      }
      seedFileEntryFromMarkdown(doc2, file.path, raw, "markpad-vault-sync");
    } catch (e) {
      markpadCollabDebug("vault\u2192Y sync \xE9chou\xE9e", file.path, e);
    }
  }
  schedulePostSyncReconcile(file, doc2, provider) {
    let ran = false;
    const run = async () => {
      if (ran) return;
      ran = true;
      this.postSyncReconcileRunning = true;
      this.decorateSharedUi();
      this.updateStatusBar("syncing");
      markpadCollabDebug("postSync reconcile: d\xE9marrage", { path: file.path });
      try {
        const local = await this.app.vault.read(file);
        const parsed = parseNoteFromMarkdown(local);
        const bodyYText = getNoteBodyYText(doc2);
        const metaMap = getNoteMetaYMap(doc2);
        const yBefore = bodyYText.toString().length;
        let status = reconcileLocalBodyIntoY(doc2, bodyYText, parsed.body);
        if (status === "noop" && yBefore === 0 && parsed.body.length > 0) {
          status = reconcileLocalBodyIntoY(doc2, bodyYText, parsed.body);
        }
        if (status === "noop" && parsed.body.length > 0 && bodyYText.toString().length < parsed.body.length) {
          doc2.transact(() => {
            if (bodyYText.length > 0) bodyYText.delete(0, bodyYText.length);
            if (parsed.body.length > 0) bodyYText.insert(0, parsed.body);
          }, RECONCILE_ORIGIN);
          status = "seeded";
        }
        mergeMetaFromParsed(doc2, metaMap, parsed.meta, RECONCILE_ORIGIN);
        const yAfter = bodyYText.toString().length;
        markpadCollabDebug("postSync reconcile: fin", {
          status,
          localLen: local.length,
          yLenBefore: yBefore,
          yLenAfter: yAfter
        });
        if (status === "conflict") {
          await this.handleReconcileConflict(file, local);
        }
      } catch (e) {
        markpadCollabDebug("postSync reconcile: erreur", e);
      } finally {
        this.postSyncReconcileRunning = false;
        this.decorateSharedUi();
        if (this.activeRuntime?.provider === provider) {
          this.updatePresenceInStatusBar(provider);
        }
      }
    };
    const onSync = (synced) => {
      markpadCollabDebug("WebsocketProvider sync", {
        synced,
        wsconnected: provider.wsconnected
      });
      if (synced) void run();
    };
    provider.on("sync", onSync);
    if (provider.synced) void run();
  }
  /**
   * Quand le reconcile détecte un conflit (zones modifiées en même temps côté local
   * et côté collaboratif distant), on :
   * 1. Sauvegarde la version locale dans un fichier `.conflict.md`
   * 2. Laisse Y.Text intact (la version collaborative fait foi)
   * 3. Notifie l'utilisateur
   */
  async handleReconcileConflict(file, localContent) {
    const conflictPath = file.path.replace(/\.md$/, ".conflict.md");
    markpadCollabDebug("postSync reconcile: conflit \u2192 sauvegarde", { conflictPath });
    try {
      const existing = this.app.vault.getAbstractFileByPath(conflictPath);
      if (existing instanceof import_obsidian6.TFile) {
        await this.app.vault.modify(existing, localContent);
      } else {
        await this.app.vault.create(conflictPath, localContent);
      }
      new import_obsidian6.Notice(
        `Markpad: conflits d\xE9tect\xE9s sur \xAB ${file.name} \xBB.
Vos modifications locales hors-ligne ont \xE9t\xE9 sauvegard\xE9es dans \xAB ${conflictPath} \xBB.
Le contenu collaboratif est conserv\xE9 dans la note d'origine.`,
        12e3
      );
    } catch (err) {
      markpadCollabDebug("handleReconcileConflict: \xE9chec sauvegarde", err);
      new import_obsidian6.Notice(
        `Markpad: conflits d\xE9tect\xE9s sur \xAB ${file.name} \xBB mais impossible de cr\xE9er le fichier de sauvegarde. Vos modifications locales hors-ligne ont \xE9t\xE9 perdues.`
      );
    }
  }
  async attachSharedSession(file, view, roomId, shareUrl, options) {
    if (this.isFileListedInFolderShare(file) && !this.hasExplicitNoteShareFrontmatter(file)) {
      markpadCollabDebug(
        "attachSharedSession: refus \u2014 fichier d\u2019un partage dossier (utiliser mode dossier)",
        { path: file.path }
      );
      throw new Error("folder_mode_required");
    }
    const wsBase = this.settings.serverUrl.replace(/^http/i, "ws");
    const doc2 = new Y11.Doc();
    if (options.seedFullFromEditor) {
      const full = await this.readMarkdownForSeed(file, view);
      if (full.length > 0) {
        seedNoteRootFromMarkdown(doc2, full, "markpad-seed-note");
      }
    }
    let yText = getNoteBodyYText(doc2);
    const provider = new WebsocketProvider(`${wsBase}/ws`, roomId, doc2, {
      connect: false,
      params: {
        userId: this.awarenessUserId(),
        name: this.settings.displayName,
        color: this.settings.color,
        password: options.roomPassword ?? ""
      }
    });
    const patchNote = patchYWebsocketProviderOutbound(provider);
    markpadCollabDebug(
      patchNote ? "patchYWebsocketProviderOutbound OK (note)" : "patchYWebsocketProviderOutbound \xC9CHOU\xC9 (note) \u2014 _updateHandler absent",
      { patchNote }
    );
    if (!patchNote && !this.patchFailedNoticeShown) {
      this.patchFailedNoticeShown = true;
      new import_obsidian6.Notice(
        "Markpad: optimisation WebSocket indisponible sur cette version d'Obsidian.\nLa synchronisation peut g\xE9n\xE9rer du trafic r\xE9seau suppl\xE9mentaire.",
        8e3
      );
    }
    provider.awareness.setLocalStateField("user", {
      name: this.settings.displayName,
      color: this.settings.color
    });
    provider.awareness.on("change", () => this.updatePresenceInStatusBar(provider));
    let mountedCm = null;
    const requireInitialSyncBeforeEdit = !options.seedFullFromEditor;
    let initialRemoteApplied = false;
    const applyInitialRemoteState = () => {
      if (initialRemoteApplied) return;
      initialRemoteApplied = true;
      void (async () => {
        try {
          const targetCm = this.activeRuntime?.provider === provider && this.activeRuntime.mode === "note" ? this.activeRuntime.cmView : mountedCm;
          if (!targetCm) {
            initialRemoteApplied = false;
            return;
          }
          yText = getNoteBodyYText(doc2);
          if (this.activeRuntime?.provider === provider && this.activeRuntime.mode === "note") {
            this.activeRuntime.yText = yText;
          }
          const yLen = yText.toString().length;
          const cmLen = targetCm.state.doc.toString().length;
          if (yLen === 0 && cmLen > 0) {
            yText = this.healNoteCollabCmBinding(doc2, targetCm, provider.awareness, "post-sync-empty-y");
            if (this.activeRuntime?.provider === provider && this.activeRuntime.mode === "note") {
              this.activeRuntime.yText = yText;
            }
            markpadCollabDebug("note: Y vide apr\xE8s sync \u2192 CM r\xE9inject\xE9 dans Y", {
              yLenAfter: yText.toString().length,
              cmLen
            });
          } else if (yLen === 0 && cmLen === 0) {
            markpadCollabDebug("note: Y et CM vides apr\xE8s sync, pas d'apply Y\u2192CM");
          } else {
            const synced = this.applyBodyYToCmHealed(targetCm, doc2, yText);
            markpadCollabDebug("note: sync Y\u2192CM apr\xE8s premier sync provider", {
              synced,
              yLen: yText.toString().length,
              cmLen: targetCm.state.doc.toString().length
            });
          }
        } catch (error) {
          markpadCollabDebug("note: erreur applyYTextToCm (post-sync)", error);
        }
        if (this.activeRuntime?.provider === provider && this.activeRuntime.mode === "note" && provider.wsconnected && !this.collabIsReadonly) {
          setCollabEditable(this.activeRuntime.cmView, true);
          markpadCollabDebug("note: \xE9ditable (premier sync termin\xE9)");
        }
      })();
    };
    const onProviderSync = (synced) => {
      markpadCollabDebug("note:provider sync", { synced, wsconnected: provider.wsconnected });
      if (!synced) return;
      const targetCm = this.activeRuntime?.provider === provider && this.activeRuntime.mode === "note" ? this.activeRuntime.cmView : mountedCm;
      if (targetCm) {
        yText = this.healNoteCollabCmBinding(doc2, targetCm, provider.awareness, "provider-sync");
        if (this.activeRuntime?.provider === provider && this.activeRuntime.mode === "note") {
          this.activeRuntime.yText = yText;
        }
      } else if (options.seedFullFromEditor && getNoteBodyYText(doc2).toString().length === 0) {
        void this.readMarkdownForSeed(file, view).then((full) => {
          if (full.length > 0) {
            seedNoteRootFromMarkdown(doc2, full, "markpad-reseed-after-sync");
            yText = getNoteBodyYText(doc2);
            markpadCollabDebug("note: Y vid\xE9 par sync serveur \u2192 re-seed depuis \xE9diteur", {
              yLenAfter: yText.toString().length
            });
          }
        });
      }
      if (requireInitialSyncBeforeEdit) applyInitialRemoteState();
      provider.off("sync", onProviderSync);
    };
    provider.on("sync", onProviderSync);
    provider.on("status", (event) => {
      markpadCollabDebug("WebsocketProvider status", event);
      if (event.status === "connected") {
        this.collabHasEverConnected = true;
        this.collabIsReadonly = false;
        this.collabWsStatus = "connected";
        this.updatePresenceInStatusBar(provider);
        this.decorateSharedUi();
        if (this.collabReadonlyTimer !== null) {
          window.clearTimeout(this.collabReadonlyTimer);
          this.collabReadonlyTimer = null;
        }
        if (this.activeRuntime?.mode === "note" && this.activeRuntime.cmView) {
          const canEditNow = !requireInitialSyncBeforeEdit || provider.synced;
          setCollabEditable(this.activeRuntime.cmView, canEditNow);
          markpadCollabDebug(
            canEditNow ? "note: \xE9ditable (WS reconnect\xE9)" : "note: connect\xE9, attente sync initial (lecture seule)"
          );
        }
        return;
      }
      if (event.status === "connecting") {
        this.collabWsStatus = "connecting";
        this.updateStatusBar("connecting");
        this.decorateSharedUi();
        this.startCollabReadonlyTimerIfNeeded(provider);
        return;
      }
      this.collabWsStatus = "disconnected";
      this.updateStatusBar("offline");
      this.decorateSharedUi();
      this.startCollabReadonlyTimerIfNeeded(provider);
    });
    markpadCollabDebug("attachSharedSession", {
      roomId,
      seedFullFromEditor: options.seedFullFromEditor,
      editorValueLen: view.editor.getValue().length,
      getMode: view.getMode?.()
    });
    const cm = resolveObsidianEditorView(view);
    if (!cm) {
      provider.destroy();
      doc2.destroy();
      new import_obsidian6.Notice("Impossible de lier CodeMirror pour cette vue.");
      throw new Error("no_cm");
    }
    mountCollabExtensionWithYText(cm, yText, provider.awareness);
    mountedCm = cm;
    if (options.seedFullFromEditor) {
      try {
        this.applyBodyYToCmHealed(cm, doc2, yText);
      } catch (error) {
        markpadCollabDebug("note: erreur applyYTextToCm (seed local)", error);
      }
    }
    provider.connect();
    const initialEditable = options.seedFullFromEditor || provider.wsconnected && !requireInitialSyncBeforeEdit;
    mountCollabEditable(cm, initialEditable);
    markpadCollabDebug("collab mont\xE9e sur EditorView", {
      cmDocLen: cm.state.doc.toString().length,
      yLen: yText.toString().length
    });
    const onDocRemoteUpdate = (_update, origin) => {
      if (origin !== provider) return;
      const targetCm = this.activeRuntime?.provider === provider && this.activeRuntime.mode === "note" ? this.activeRuntime.cmView : mountedCm;
      if (!targetCm) return;
      yText = this.healNoteCollabCmBinding(doc2, targetCm, provider.awareness, "remote-doc-update");
      if (this.activeRuntime?.provider === provider && this.activeRuntime.mode === "note") {
        this.activeRuntime.yText = yText;
      }
    };
    doc2.on("update", onDocRemoteUpdate);
    let debugUnload;
    if (this.settings.debugCollab) {
      const onYUpdate = (update, origin) => {
        markpadCollabDebug("Y.Doc update (encode)", {
          updateBytes: update.length,
          origin: debugOriginLabel(origin),
          originIsProvider: origin === provider,
          ywebsocketWouldSkipSend: origin === provider
        });
      };
      doc2.on("update", onYUpdate);
      debugUnload = () => {
        doc2.off("update", onYUpdate);
      };
    }
    const priorDebugUnload = debugUnload;
    debugUnload = () => {
      doc2.off("update", onDocRemoteUpdate);
      priorDebugUnload?.();
    };
    this.collabWsStatus = provider.wsconnected ? "connected" : "connecting";
    this.activeRuntime = {
      mode: "note",
      filePath: file.path,
      shareUrl,
      roomId,
      roomPassword: options.roomPassword,
      doc: doc2,
      provider,
      cmView: cm,
      yText,
      debugUnload
    };
    this.sharedNotes.set(file.path, { roomId, shareUrl });
    this.markAttachGrace(file.path);
    if (requireInitialSyncBeforeEdit && provider.synced) {
      applyInitialRemoteState();
      provider.off("sync", onProviderSync);
    }
    if (options.reconcileLocalOnFirstSync !== false) {
      this.schedulePostSyncReconcile(file, doc2, provider);
    }
    this.decorateSharedUi();
    this.updatePresenceInStatusBar(provider);
  }
  async startSharingFromFile(file) {
    if (!this.isMarkdownFile(file)) {
      new import_obsidian6.Notice("Markpad: ce fichier n'est pas un Markdown.");
      return;
    }
    await this.app.workspace.getLeaf(false).openFile(file);
    await this.startSharing();
  }
  async startSharing() {
    if (diagnoseAuthToken(this.settings.authToken)) {
      this.noticeAuthTokenIssue();
      return;
    }
    const active = this.getActiveMarkdownFileAndView();
    if (!active) {
      new import_obsidian6.Notice("Ouvre une note Markdown pour d\xE9marrer Markpad.");
      return;
    }
    this.disconnect();
    if (this.autoConnectTimer != null) {
      window.clearTimeout(this.autoConnectTimer);
      this.autoConnectTimer = null;
    }
    this.collabAttachInProgress = true;
    try {
      const created = await createShareSession({
        serverUrl: this.settings.serverUrl,
        settings: this.settings,
        noteId: active.file.path,
        roomPassword: this.settings.defaultRoomPassword || void 0
      });
      this.sharedNotes.set(active.file.path, {
        roomId: created.roomId,
        shareUrl: created.shareUrl
      });
      await this.writeShareFrontmatter(active.file, {
        roomId: created.roomId,
        shareUrl: created.shareUrl
      });
      await this.flushEditorAfterVaultWrite();
      await this.attachSharedSession(
        active.file,
        active.view,
        created.roomId,
        created.shareUrl,
        {
          roomPassword: this.settings.defaultRoomPassword || void 0,
          seedFullFromEditor: true,
          reconcileLocalOnFirstSync: true
        }
      );
      await this.writeClipboardSafe(created.shareUrl, `Lien copi\xE9: ${created.shareUrl}`);
      this.refreshSharesPanel();
    } catch (error) {
      this.updateStatusBar("error");
      new import_obsidian6.Notice(this.humanizeShareError(error));
    } finally {
      this.collabAttachInProgress = false;
    }
  }
  async joinSharedNote() {
    let initialShareInput = "";
    try {
      initialShareInput = await navigator.clipboard.readText();
    } catch {
    }
    const picked = await new JoinShareModal(this.app, {
      initialShareInput,
      initialPassword: this.settings.defaultRoomPassword
    }).openAndWait();
    if (!picked) return;
    let roomId = "";
    try {
      const url = new URL(picked.shareInput);
      roomId = url.pathname.split("/").filter(Boolean).at(-1) ?? "";
    } catch {
      roomId = picked.shareInput.trim();
    }
    if (!roomId) {
      new import_obsidian6.Notice("Lien ou roomId invalide.");
      return;
    }
    const roomPassword = picked.roomPassword ?? "";
    this.disconnect();
    try {
      const shareUrl = `${this.settings.serverUrl.replace(/\/$/, "")}/share/${roomId}`;
      const validated = await validateShareSession({
        serverUrl: this.settings.serverUrl,
        roomId,
        roomPassword: roomPassword || void 0
      });
      if (validated.kind === "folder") {
        const filePaths = validated.filePaths.filter((p) => isFolderSharePath(p));
        if (filePaths.length === 0) {
          throw new Error("folder_share_without_syncable_files");
        }
        const folderRoot = commonFolderRootOf(filePaths);
        const anchorPath = (0, import_obsidian6.normalizePath)(
          folderRoot ? `${folderRoot}/${FOLDER_SHARE_FILENAME}` : FOLDER_SHARE_FILENAME
        );
        const meta = {
          roomId,
          shareUrl,
          paths: [...filePaths],
          anchorPath
        };
        await this.ensureFolderAnchorFile(anchorPath, meta, meta.paths);
        this.folderSharesMeta.set(folderRoot, meta);
        for (const p of meta.paths) {
          this.sharedNotes.set(p, { roomId: meta.roomId, shareUrl: meta.shareUrl });
        }
        const openPath = meta.paths.find((p) => p.toLowerCase().endsWith(".md")) ?? meta.paths[0];
        const openedFile = await this.ensureMarkdownFileExists(openPath);
        await this.app.workspace.getLeaf(false).openFile(openedFile);
        const active = this.getActiveMarkdownFileAndView();
        if (!active || active.file.path !== openedFile.path) {
          throw new Error("impossible_d_ouvrir_la_note_du_dossier");
        }
        await this.attachFolderSharedSession(active.file, active.view, meta, {
          seedLocalFiles: false
        });
      } else {
        const joinedFile = await this.createJoinedNoteFile(roomId);
        await this.app.workspace.getLeaf(false).openFile(joinedFile);
        const active = this.getActiveMarkdownFileAndView();
        if (!active || active.file.path !== joinedFile.path) {
          throw new Error("impossible_d_ouvrir_la_note_creee");
        }
        await this.writeShareFrontmatter(active.file, { roomId, shareUrl });
        await this.flushEditorAfterVaultWrite();
        await this.attachSharedSession(active.file, active.view, roomId, shareUrl, {
          roomPassword: roomPassword || void 0,
          seedFullFromEditor: false,
          reconcileLocalOnFirstSync: false
        });
      }
      new import_obsidian6.Notice("Markpad: session rejointe depuis Obsidian.");
      this.refreshSharesPanel();
    } catch (error) {
      this.updateStatusBar("error");
      new import_obsidian6.Notice(this.humanizeShareError(error));
    }
  }
  humanizeShareError(error) {
    const msg = error.message ?? String(error);
    const match2 = msg.match(/\((\d{3})\)/);
    const status = match2?.[1] ?? "";
    if (status === "401") {
      return "Markpad: authentification refus\xE9e (401). V\xE9rifie le jeton de connexion dans les r\xE9glages Obsidian (Mon compte).";
    }
    if (status === "403") {
      return "Markpad: refus\xE9 (403). V\xE9rifie que le jeton de connexion correspond \xE0 votre compte.";
    }
    if (msg.includes("auth_token_invalid_or_missing")) {
      return "Markpad: jeton invalide ou manquant. Copiez-le depuis Mon compte (apr\xE8s connexion par e-mail).";
    }
    if (status === "429" || msg.includes("share_limit_reached")) {
      return "Markpad: nombre maximum de partages atteint pour ce compte (limite serveur).";
    }
    if (msg.includes("folder_create_failed:")) {
      return `Markpad: impossible de cr\xE9er le dossier local (${msg.split(":").slice(1).join(":")}).`;
    }
    if (msg.includes("session_validate_failed (401)")) {
      return "Markpad: mot de passe de room invalide (401).";
    }
    if (msg.includes("session_validate_failed (404)")) {
      return "Markpad: room introuvable (404).";
    }
    if (msg.includes("folder_share_without_markdown_files") || msg.includes("folder_share_without_syncable_files")) {
      return "Markpad: ce dossier partag\xE9 ne contient aucun fichier syncable (Markdown ou .base).";
    }
    if (/already exists/i.test(msg)) {
      return "Markpad: conflit de fichier (\xAB already exists \xBB). Ferme les autres op\xE9rations sur ce vault et r\xE9essaie ; si \xE7a persiste, red\xE9marre Obsidian.";
    }
    return `Markpad erreur: ${msg}`;
  }
  /** Crée une note dédiée au partage sans jamais écraser un fichier existant. */
  async createJoinedNoteFile(roomId) {
    const active = this.getActiveMarkdownFileAndView();
    const folderPath = active?.file.parent?.path ?? "";
    const base = `Markpad share ${roomId.slice(0, 8)}`.trim();
    const targetPath = this.nextUniqueMarkdownPath(folderPath, base);
    return this.app.vault.create(targetPath, "");
  }
  async ensureMarkdownFileExists(path) {
    const existing = this.app.vault.getAbstractFileByPath(path);
    if (existing instanceof import_obsidian6.TFile) return existing;
    const dir = folderPartOf(path);
    if (dir) {
      await this.ensureFolderTree(dir);
    }
    return this.app.vault.create(path, "");
  }
  async ensureFolderTree(folderPath) {
    const segs = splitFolderSegments(folderPath);
    let current = "";
    for (const seg of segs) {
      current = current ? `${current}/${seg}` : seg;
      if (this.app.vault.getAbstractFileByPath(current)) continue;
      try {
        await this.app.vault.createFolder(current);
      } catch {
        if (!this.app.vault.getAbstractFileByPath(current)) {
          throw new Error(`folder_create_failed:${current}`);
        }
      }
    }
  }
  /** Retourne un chemin libre, suffixé "(2)", "(3)", ... si nécessaire. */
  nextUniqueMarkdownPath(folderPath, baseName) {
    const cleanBase = baseName.replace(/[\\/:*?"<>|]/g, "_").trim() || "Markpad share";
    const build = (n) => {
      const suffix = n <= 1 ? "" : ` (${n})`;
      const fileName = `${cleanBase}${suffix}.md`;
      return folderPath ? `${folderPath}/${fileName}` : fileName;
    };
    let idx = 1;
    let candidate = build(idx);
    while (this.app.vault.getAbstractFileByPath(candidate)) {
      idx += 1;
      candidate = build(idx);
    }
    return candidate;
  }
  /**
   * Démarre le timer de passage en lecture seule (3 s après coupure WS).
   * Partagé entre le mode note et le mode dossier.
   */
  startCollabReadonlyTimerIfNeeded(provider) {
    if (this.collabIsReadonly) return;
    if (this.collabReadonlyTimer !== null) return;
    this.collabReadonlyTimer = window.setTimeout(() => {
      this.collabReadonlyTimer = null;
      if (this.activeRuntime?.provider === provider && !provider.wsconnected && this.activeRuntime.cmView) {
        this.collabIsReadonly = true;
        setCollabEditable(this.activeRuntime.cmView, false);
        markpadCollabDebug("lecture seule (WS d\xE9connect\xE9 > 3 s)");
        new import_obsidian6.Notice(
          "Markpad: connexion perdue \u2014 note en lecture seule.\nVos modifications seront appliqu\xE9es au reconnect.",
          8e3
        );
      }
    }, 3e3);
  }
  disconnect() {
    if (!this.activeRuntime) return;
    if (this.collabReadonlyTimer !== null) {
      window.clearTimeout(this.collabReadonlyTimer);
      this.collabReadonlyTimer = null;
    }
    this.collabHasEverConnected = false;
    this.collabIsReadonly = false;
    try {
      this.activeRuntime.debugUnload?.();
    } catch {
    }
    try {
      this.activeRuntime.folderFilesUnload?.();
    } catch {
    }
    try {
      unmountCollabEditable(this.activeRuntime.cmView);
    } catch {
    }
    try {
      unmountCollabExtension(this.activeRuntime.cmView);
    } catch {
    }
    markpadCollabDebug("disconnect()");
    this.activeRuntime.provider.destroy();
    this.activeRuntime.doc.destroy();
    this.activeRuntime = null;
    this.clearDecorations();
    this.collabWsStatus = "disconnected";
    this.updateStatusBar("off");
  }
  updatePresenceInStatusBar(provider) {
    const localId = provider.awareness.doc.clientID;
    let others = 0;
    for (const [clientId, state] of provider.awareness.getStates()) {
      if (clientId === localId) continue;
      const u = state?.user;
      const hasName = typeof u?.name === "string" && u.name.trim().length > 0;
      const hasCursor = state != null && typeof state === "object" && state.cursor != null;
      if (!hasName && !hasCursor) continue;
      others += 1;
    }
    this.updateStatusBar("connected", others);
  }
  updateStatusBar(status, remoteCount = 0) {
    if (!this.statusBarEl) return;
    switch (status) {
      case "off":
        this.statusBarEl.setText("Markpad: off");
        break;
      case "connecting":
        this.statusBarEl.setText("Markpad: connexion...");
        break;
      case "syncing":
        this.statusBarEl.setText("Markpad: synchronisation\u2026");
        break;
      case "connected":
        this.statusBarEl.setText(`Markpad: en ligne (${remoteCount + 1})`);
        break;
      case "offline":
        this.statusBarEl.setText("Markpad: hors-ligne");
        break;
      case "error":
        this.statusBarEl.setText("Markpad: erreur");
        break;
    }
  }
  /**
   * Tente de copier `text` dans le presse-papiers.
   * Sur Android (WebView restrictif), clipboard.writeText peut lever une exception :
   * dans ce cas on affiche le lien dans une Notice longue pour copie manuelle.
   */
  async writeClipboardSafe(text2, successMsg) {
    try {
      await navigator.clipboard.writeText(text2);
      new import_obsidian6.Notice(successMsg);
    } catch {
      new import_obsidian6.Notice(`${successMsg}

${text2}`, 1e4);
    }
  }
  async copyShareLink() {
    if (!this.activeRuntime) {
      new import_obsidian6.Notice("Aucune session Markpad active.");
      return;
    }
    await this.writeClipboardSafe(this.activeRuntime.shareUrl, "Lien de partage copi\xE9.");
  }
  async copyShareLinkForPath(filePath) {
    const share = this.sharedNotes.get(filePath);
    if (!share) {
      new import_obsidian6.Notice("Aucun lien de partage pour cette note.");
      return;
    }
    await this.writeClipboardSafe(share.shareUrl, "Lien de partage copi\xE9.");
  }
  async stopSharingCurrentNote() {
    const active = this.getActiveMarkdownFileAndView();
    if (!active) {
      new import_obsidian6.Notice("Ouvre une note partag\xE9e.");
      return;
    }
    await this.stopSharingPath(active.file.path);
  }
  async stopSharingPath(filePath) {
    for (const [root, meta] of this.folderSharesMeta) {
      if (meta.paths.includes(filePath)) {
        await this.removeSingleFileFromFolderShare(filePath, root, meta);
        return;
      }
    }
    const share = this.sharedNotes.get(filePath);
    if (!share) {
      new import_obsidian6.Notice("Cette note n'est pas marqu\xE9e comme partag\xE9e.");
      return;
    }
    try {
      await endShareSession({
        serverUrl: this.settings.serverUrl,
        settings: this.settings,
        roomId: share.roomId
      });
    } catch {
    }
    this.sharedNotes.delete(filePath);
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (file instanceof import_obsidian6.TFile) {
      await this.writeShareFrontmatter(file, null);
    }
    if (this.activeRuntime?.filePath === filePath) {
      this.disconnect();
    } else {
      this.decorateSharedUi();
    }
    this.refreshSharesPanel();
    new import_obsidian6.Notice("Partage rompu pour cette note.");
  }
  showConnectedUsers() {
    if (!this.activeRuntime) {
      new import_obsidian6.Notice("Markpad: aucun partage actif.");
      return;
    }
    const localId = this.activeRuntime.provider.awareness.doc.clientID;
    const names = [];
    for (const [clientId, state] of this.activeRuntime.provider.awareness.getStates()) {
      if (clientId === localId) continue;
      const u = state?.user;
      const hasName = typeof u?.name === "string" && u.name.trim().length > 0;
      const hasCursor = state != null && typeof state === "object" && state.cursor != null;
      if (!hasName && !hasCursor) continue;
      names.push(hasName ? u.name.trim() : "Invit\xE9");
    }
    const unique = names.filter((n, i, a) => a.indexOf(n) === i);
    if (unique.length === 0) {
      new import_obsidian6.Notice("Markpad: aucun autre participant connect\xE9.");
      return;
    }
    new import_obsidian6.Notice(`Autres connect\xE9s: ${unique.join(", ")}`);
  }
  clearDecorations() {
    for (const el of this.decoratedEls) {
      el.remove();
    }
    this.decoratedEls.clear();
  }
  /** Double frame : l’explorateur virtualisé monte souvent le DOM après `layout-change`. */
  scheduleDecorateSharedUiSoon() {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => this.decorateSharedUi());
    });
  }
  teardownFileExplorerDecorationObserver() {
    if (this.explorerMutateDebounceTimer != null) {
      window.clearTimeout(this.explorerMutateDebounceTimer);
      this.explorerMutateDebounceTimer = null;
    }
    this.fileExplorerObserver?.disconnect();
    this.fileExplorerObserver = null;
    this.fileExplorerObservedEl = null;
  }
  /**
   * Recolle un MutationObserver sur le conteneur de l’explorateur de fichiers
   * (listes virtualisées : les lignes dossier n’existent pas au premier paint).
   */
  ensureFileExplorerDecorationObserver() {
    if (this.folderSharesMeta.size === 0) {
      this.teardownFileExplorerDecorationObserver();
      return;
    }
    const leaves = this.app.workspace.getLeavesOfType("file-explorer");
    const leaf = leaves[0];
    if (!leaf) return;
    const view = leaf.view;
    const root = view?.containerEl;
    if (!root || root === this.fileExplorerObservedEl) return;
    this.teardownFileExplorerDecorationObserver();
    this.fileExplorerObservedEl = root;
    this.fileExplorerObserver = new MutationObserver(() => {
      if (this.decorateSharedUiRunning) return;
      if (this.explorerMutateDebounceTimer != null) {
        window.clearTimeout(this.explorerMutateDebounceTimer);
      }
      this.explorerMutateDebounceTimer = window.setTimeout(() => {
        this.explorerMutateDebounceTimer = null;
        if (this.decorateSharedUiRunning) return;
        this.decorateSharedUi();
      }, 400);
    });
    this.fileExplorerObserver.observe(root, { childList: true, subtree: true });
  }
  /** Clé `folderSharesMeta` correspondant au chemin affiché dans le DOM (normalisation). */
  resolveFolderShareMetaKey(domPath) {
    if (this.folderSharesMeta.has(domPath)) return domPath;
    const n = (0, import_obsidian6.normalizePath)(domPath);
    if (this.folderSharesMeta.has(n)) return n;
    for (const k of this.folderSharesMeta.keys()) {
      if ((0, import_obsidian6.normalizePath)(k) === n) return k;
    }
    return null;
  }
  collectFolderDecorationMounts() {
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    const push = (rawPath, mount) => {
      if (!rawPath || !mount) return;
      const key = this.resolveFolderShareMetaKey(rawPath);
      if (!key || seen.has(key)) return;
      seen.add(key);
      out.push({ metaKey: key, mount });
    };
    document.querySelectorAll(".tree-item.nav-folder .tree-item-self[data-path]").forEach((self) => {
      push(self.getAttribute("data-path"), self);
    });
    document.querySelectorAll(".nav-folder[data-path]").forEach((folderEl) => {
      push(
        folderEl.getAttribute("data-path"),
        folderEl.querySelector(".nav-folder-title") ?? folderEl
      );
    });
    document.querySelectorAll(".nav-folder-title[data-path]").forEach((title) => {
      push(title.getAttribute("data-path"), title);
    });
    document.querySelectorAll(".nav-folder").forEach((folderEl) => {
      const p = folderEl.getAttribute("data-path") ?? folderEl.querySelector(".tree-item-self[data-path]")?.getAttribute("data-path") ?? folderEl.querySelector("[data-path]")?.getAttribute("data-path") ?? null;
      const mount = folderEl.querySelector(".tree-item-self") ?? folderEl.querySelector(".nav-folder-title") ?? folderEl.querySelector(".tree-item-inner") ?? folderEl;
      push(p, mount);
    });
    return out;
  }
  decorateSharedUi() {
    if (this.decorateSharedUiRunning) {
      this.decorateSharedUiCoalesce = true;
      return;
    }
    this.decorateSharedUiRunning = true;
    let explorerWasObserving = false;
    if (this.fileExplorerObserver && this.fileExplorerObservedEl) {
      this.fileExplorerObserver.disconnect();
      explorerWasObserving = true;
    }
    try {
      this.clearDecorations();
      if (this.sharedNotes.size === 0 && this.folderSharesMeta.size === 0) return;
      const fileTitles = document.querySelectorAll(".nav-file-title[data-path]");
      fileTitles.forEach((title) => {
        const path = title.getAttribute("data-path");
        if (!path || !this.sharedNotes.has(path)) return;
        const icon = this.buildNoteSharedIndicator(path);
        title.appendChild(icon);
        this.decoratedEls.add(icon);
      });
      const tabHeaders = document.querySelectorAll(
        ".workspace-tab-header[data-path]"
      );
      tabHeaders.forEach((tab) => {
        const path = tab.getAttribute("data-path");
        if (!path || !this.sharedNotes.has(path)) return;
        const titleEl = tab.querySelector(".workspace-tab-header-inner-title") ?? tab;
        const icon = this.buildNoteSharedIndicator(path);
        titleEl.appendChild(icon);
        this.decoratedEls.add(icon);
      });
      for (const { metaKey, mount } of this.collectFolderDecorationMounts()) {
        const icon = this.buildFolderSharedIndicator(metaKey);
        mount.appendChild(icon);
        this.decoratedEls.add(icon);
      }
      if (this.folderSharesMeta.size > 0) {
        this.ensureFileExplorerDecorationObserver();
      }
    } finally {
      if (explorerWasObserving && this.fileExplorerObserver && this.fileExplorerObservedEl) {
        this.fileExplorerObserver.observe(this.fileExplorerObservedEl, {
          childList: true,
          subtree: true
        });
      }
      this.decorateSharedUiRunning = false;
      if (this.decorateSharedUiCoalesce) {
        this.decorateSharedUiCoalesce = false;
        queueMicrotask(() => this.decorateSharedUi());
      }
    }
  }
  /** Icône Lucide pour la session active (sync / WS / reconcile). */
  getActiveSessionIconName() {
    if (!this.activeRuntime) return "link-2";
    const p = this.activeRuntime.provider;
    if (this.postSyncReconcileRunning) return "loader-2";
    if (this.collabWsStatus === "connecting") return "loader-2";
    if (!p.wsconnected) return "wifi-off";
    if (!p.synced) return "refresh-cw";
    return "link-2";
  }
  buildNoteSharedIndicator(filePath) {
    const indicator = document.createElement("span");
    indicator.className = "markpad-shared-indicator";
    const active = this.activeRuntime?.filePath === filePath;
    (0, import_obsidian6.setIcon)(indicator, active ? this.getActiveSessionIconName() : "link-2");
    indicator.title = "Markpad partag\xE9 (clic pour copier le lien)";
    return indicator;
  }
  buildFolderSharedIndicator(folderRootPath) {
    const indicator = document.createElement("span");
    indicator.className = "markpad-folder-shared-indicator";
    const active = this.activeRuntime?.mode === "folder" && this.activeRuntime.folderRoot === folderRootPath;
    (0, import_obsidian6.setIcon)(indicator, active ? this.getActiveSessionIconName() : "folders");
    indicator.title = "Dossier Markpad partag\xE9 (clic pour copier le lien)";
    return indicator;
  }
  /** Signature compacte de la liste des partages (panneau latéral). */
  getSharesPanelSignature() {
    return this.getSharesForPanel().map((r) => `${r.kind}:${r.pathKey}:${r.roomId}`).sort().join("|");
  }
  folderYRoomActive(roomId) {
    return this.activeRuntime?.mode === "folder" && this.activeRuntime.roomId === roomId;
  }
  getPendingFolderYOps(roomId) {
    let ops = this.pendingFolderYOpsByRoom.get(roomId);
    if (!ops) {
      ops = { adds: /* @__PURE__ */ new Set(), dels: /* @__PURE__ */ new Set() };
      this.pendingFolderYOpsByRoom.set(roomId, ops);
    }
    return ops;
  }
  async flushPendingFolderYOps(meta, doc2) {
    const pending = this.pendingFolderYOpsByRoom.get(meta.roomId);
    if (!pending) return;
    const { adds, dels } = pending;
    if (dels.size === 0 && adds.size === 0) return;
    doc2.transact(() => {
      const files = doc2.getMap("files");
      for (const p of dels) {
        files.delete(p);
      }
    }, "markpad-folder-flush-del");
    for (const p of adds) {
      const f = this.app.vault.getAbstractFileByPath(p);
      if (!(f instanceof import_obsidian6.TFile)) continue;
      try {
        const raw = await this.app.vault.read(f);
        seedFileEntryFromMarkdown(doc2, p, raw, "markpad-folder-flush-add");
      } catch (e) {
        markpadCollabDebug("folder:flush-add \xE9chou\xE9", p, e);
      }
    }
    this.pendingFolderYOpsByRoom.delete(meta.roomId);
    markpadCollabDebug("folder:pending Y ops flushed", {
      roomId: meta.roomId,
      dels: dels.size,
      adds: adds.size
    });
  }
  deleteFolderFileFromY(meta, path) {
    if (this.folderYRoomActive(meta.roomId)) {
      this.activeRuntime.doc.transact(() => {
        this.activeRuntime.doc.getMap("files").delete(path);
      }, "markpad-folder-remove");
      return;
    }
    const pending = this.getPendingFolderYOps(meta.roomId);
    pending.adds.delete(path);
    pending.dels.add(path);
    this.queueAutoConnect();
  }
  async pushFolderFileToY(meta, path, origin = "markpad-folder-add") {
    if (this.folderYRoomActive(meta.roomId)) {
      const doc2 = this.activeRuntime.doc;
      const files = doc2.getMap("files");
      const cur = files.get(path);
      if (cur instanceof Y11.Text) {
        upgradeLegacyFileEntry(doc2, path, cur, origin);
      } else if (!isNoteFileEntry(cur)) {
        const f = this.app.vault.getAbstractFileByPath(path);
        if (!(f instanceof import_obsidian6.TFile)) return;
        const raw = await this.app.vault.read(f);
        seedFileEntryFromMarkdown(doc2, path, raw, origin);
      }
      const folderRoot = this.activeRuntime.folderRoot ?? parentPathOf(path);
      this.queueFolderSyncFromY(meta, folderRoot, doc2);
      return;
    }
    const pending = this.getPendingFolderYOps(meta.roomId);
    pending.dels.delete(path);
    pending.adds.add(path);
    this.queueAutoConnect();
  }
  migrateYMapKeyAfterFileRename(oldPath, newPath, roomId) {
    if (!this.folderYRoomActive(roomId)) {
      const pending = this.getPendingFolderYOps(roomId);
      if (pending.adds.has(oldPath)) pending.adds.delete(oldPath);
      if (pending.dels.has(oldPath)) pending.dels.delete(oldPath);
      pending.dels.add(oldPath);
      pending.adds.add(newPath);
      this.queueAutoConnect();
      return;
    }
    const runtime = this.activeRuntime;
    const doc2 = runtime.doc;
    const files = doc2.getMap("files");
    let entry = getFileEntry(doc2, oldPath);
    const legacy = files.get(oldPath);
    if (!entry && legacy instanceof Y11.Text) {
      entry = upgradeLegacyFileEntry(doc2, oldPath, legacy, "markpad-rename-file-key");
    }
    if (!entry) return;
    const bodyStr = getBodyYText(entry).toString();
    const metaRecord = metaMapToRecord(getMetaYMap(entry));
    try {
      doc2.transact(() => {
        files.delete(oldPath);
        const existing = files.get(newPath);
        if (existing instanceof Y11.Text || getFileEntry(doc2, newPath)) {
          files.delete(newPath);
        }
        const newEntry = getOrCreateFileEntry(doc2, newPath);
        const body = getBodyYText(newEntry);
        if (body.length > 0) body.delete(0, body.length);
        if (bodyStr.length > 0) body.insert(0, bodyStr);
        recordToMetaMap(doc2, metaRecord, getMetaYMap(newEntry), "markpad-rename-file-key");
      }, "markpad-rename-file-key");
    } catch (e) {
      markpadCollabDebug("migrateYMapKeyAfterFileRename \xE9chou\xE9", { oldPath, newPath, e });
    }
  }
  migrateFolderKeysInYDoc(oldRoot, newRoot, roomId) {
    if (!this.activeRuntime || this.activeRuntime.mode !== "folder") return;
    if (this.activeRuntime.roomId !== roomId) return;
    const files = this.activeRuntime.doc.getMap("files");
    const entries = Array.from(files.entries());
    for (const [k, v] of entries) {
      if (!isNoteFileEntry(v)) continue;
      let newKey = null;
      if (k.startsWith(`${oldRoot}/`)) {
        newKey = `${newRoot}/${k.slice(oldRoot.length + 1)}`;
      } else if (k === oldRoot) {
        newKey = newRoot;
      }
      if (newKey == null || newKey === k) continue;
      this.activeRuntime.doc.transact(() => {
        files.delete(k);
        files.set(newKey, v);
      }, "markpad-rename-folder-keys");
    }
  }
  async applyFolderShareAfterFolderRename(oldPath, newPath) {
    const remap = (p) => {
      if (p === oldPath) return newPath;
      if (p.startsWith(`${oldPath}/`)) return `${newPath}/${p.slice(oldPath.length + 1)}`;
      return p;
    };
    for (const [root, meta] of Array.from(this.folderSharesMeta.entries())) {
      if (root !== oldPath && !root.startsWith(`${oldPath}/`)) continue;
      const newRoot = remap(root);
      this.folderSharesMeta.delete(root);
      meta.paths = [...new Set(meta.paths.map(remap))];
      meta.anchorPath = remap(meta.anchorPath);
      this.folderSharesMeta.set(newRoot, meta);
      for (const p of meta.paths) {
        this.sharedNotes.set(p, { roomId: meta.roomId, shareUrl: meta.shareUrl });
      }
      this.migrateFolderKeysInYDoc(root, newRoot, meta.roomId);
      if (this.activeRuntime?.mode === "folder" && this.activeRuntime.roomId === meta.roomId) {
        this.activeRuntime.folderRoot = newRoot;
        this.activeRuntime.sharedPaths = meta.paths;
        this.activeRuntime.filePath = remap(this.activeRuntime.filePath);
      }
      try {
        await this.ensureFolderAnchorFile(meta.anchorPath, meta, meta.paths);
      } catch {
      }
    }
    this.rebuildSharedNotesFromFrontmatter();
    this.decorateSharedUi();
    this.refreshSharesPanel();
  }
  async handleVaultDelete(file) {
    if (file instanceof import_obsidian6.TFolder) {
      for (const [root] of Array.from(this.folderSharesMeta.entries())) {
        if (root === file.path || root.startsWith(`${file.path}/`)) {
          await this.stopSharingFolderByPath(root);
        }
      }
      return;
    }
    if (!(file instanceof import_obsidian6.TFile)) return;
    if (file.name === FOLDER_SHARE_FILENAME) {
      const root = file.parent?.path ?? "";
      const meta = this.folderSharesMeta.get(root);
      if (meta && (0, import_obsidian6.normalizePath)(meta.anchorPath) === (0, import_obsidian6.normalizePath)(file.path)) {
        await this.stopSharingFolderByPath(root);
      }
      return;
    }
    for (const [root, meta] of this.folderSharesMeta) {
      if (!meta.paths.includes(file.path)) continue;
      await this.removeSingleFileFromFolderShare(file.path, root, meta);
      return;
    }
    const share = this.sharedNotes.get(file.path);
    if (!share) return;
    try {
      await endShareSession({
        serverUrl: this.settings.serverUrl,
        settings: this.settings,
        roomId: share.roomId
      });
    } catch {
    }
    this.sharedNotes.delete(file.path);
    if (this.activeRuntime?.filePath === file.path) {
      this.disconnect();
    } else {
      this.decorateSharedUi();
    }
    this.refreshSharesPanel();
  }
  /** Retire un fichier du partage dossier (room conservée s’il reste des fichiers). */
  async removeSingleFileFromFolderShare(filePath, folderRoot, meta, options) {
    if (!meta.paths.includes(filePath)) return;
    this.deleteFolderFileFromY(meta, filePath);
    if (this.activeRuntime?.mode === "folder" && this.activeRuntime.roomId === meta.roomId && this.activeRuntime.filePath === filePath) {
      this.disconnect();
    }
    meta.paths = meta.paths.filter((p) => p !== filePath);
    this.sharedNotes.delete(filePath);
    this.folderSharesMeta.set(folderRoot, meta);
    if (this.activeRuntime?.mode === "folder" && this.activeRuntime.roomId === meta.roomId) {
      this.activeRuntime.sharedPaths = meta.paths;
    }
    if (meta.paths.length === 0) {
      try {
        await endShareSession({
          serverUrl: this.settings.serverUrl,
          settings: this.settings,
          roomId: meta.roomId
        });
      } catch {
      }
      this.folderSharesMeta.delete(folderRoot);
      await this.deleteFolderShareAnchorAtPath(meta.anchorPath);
    } else {
      try {
        await this.ensureFolderAnchorFile(meta.anchorPath, meta, meta.paths);
      } catch {
      }
    }
    this.decorateSharedUi();
    this.refreshSharesPanel();
    if (!options?.silent) {
      new import_obsidian6.Notice("Fichier retir\xE9 du partage dossier Markpad.");
    }
  }
  rebuildSharedNotesFromFrontmatter() {
    this.sharedNotes.clear();
    for (const file of this.app.vault.getMarkdownFiles()) {
      if (file.name === FOLDER_SHARE_FILENAME) continue;
      this.syncShareFromFileFrontmatter(file);
    }
  }
  /**
   * Reconstruit folderSharesMeta depuis le vault en lisant directement les fichiers ancres.
   * Les fichiers dont le nom commence par '.' ne sont pas indexés par le metadataCache d'Obsidian,
   * donc on ne peut pas compter sur getFileCache(). On lit le fichier et on parse le YAML manuellement.
   */
  /**
   * Liste les chemins `.markpad-folder-share.md` via vault.adapter (fichiers `.*` souvent absents de getFiles()).
   */
  async collectFolderShareAnchorPaths() {
    const anchorPaths = [];
    const scanDir = async (dir) => {
      try {
        const listed = await this.app.vault.adapter.list(dir);
        for (const fp of listed.files) {
          const name = fp.includes("/") ? fp.slice(fp.lastIndexOf("/") + 1) : fp;
          if (name === FOLDER_SHARE_FILENAME) anchorPaths.push(fp);
        }
        for (const fd of listed.folders) {
          const name = fd.includes("/") ? fd.slice(fd.lastIndexOf("/") + 1) : fd;
          if (name === ".obsidian") continue;
          await scanDir(fd);
        }
      } catch {
      }
    };
    await scanDir("");
    return anchorPaths;
  }
  /**
   * Supprime le fichier ancre de partage dossier (vault + adaptateur).
   * Les fichiers commençant par '.' ne sont pas toujours des TFile : sans adapter.remove,
   * rebuildFolderSharesFromFiles les recharge au prochain démarrage.
   */
  async deleteFolderShareAnchorAtPath(anchorPath) {
    const pathNorm = (0, import_obsidian6.normalizePath)(anchorPath);
    const anchor = this.app.vault.getAbstractFileByPath(pathNorm);
    if (anchor instanceof import_obsidian6.TFile) {
      try {
        await this.app.vault.delete(anchor);
        return;
      } catch {
      }
    }
    try {
      if (await this.app.vault.adapter.exists(pathNorm)) {
        await this.app.vault.adapter.remove(pathNorm);
        return;
      }
    } catch {
    }
    try {
      if (await this.app.vault.adapter.exists(pathNorm)) {
        await this.app.vault.adapter.write(pathNorm, "---\n---\n");
        return;
      }
    } catch {
    }
    if (anchor instanceof import_obsidian6.TFile) {
      try {
        await this.app.fileManager.processFrontMatter(anchor, (fm) => {
          delete fm[FOLDER_SHARE_FM];
        });
      } catch {
      }
    }
  }
  /**
   * Reconstruit folderSharesMeta en scannant le système de fichiers via vault.adapter.list().
   * vault.getFiles() peut exclure les fichiers dont le nom commence par '.' ;
   * l'adapter contourne cette restriction en lisant directement le disque.
   */
  async rebuildFolderSharesFromFiles() {
    this.folderSharesMeta.clear();
    const anchorPaths = await this.collectFolderShareAnchorPaths();
    for (const anchorPath of anchorPaths) {
      try {
        let raw;
        const tfile = this.app.vault.getAbstractFileByPath(anchorPath);
        if (tfile instanceof import_obsidian6.TFile) {
          raw = this.app.metadataCache.getFileCache(tfile)?.frontmatter?.[FOLDER_SHARE_FM];
        }
        if (!raw) {
          const content = await this.app.vault.adapter.read(anchorPath);
          const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
          if (fmMatch) {
            const parsed = (0, import_obsidian6.parseYaml)(fmMatch[1]);
            raw = parsed?.[FOLDER_SHARE_FM];
          }
        }
        if (!raw?.roomId || !raw?.shareUrl || !Array.isArray(raw.filePaths)) continue;
        const lastSlash = anchorPath.lastIndexOf("/");
        const root = lastSlash > 0 ? anchorPath.slice(0, lastSlash) : "";
        const meta = {
          roomId: raw.roomId,
          shareUrl: raw.shareUrl,
          paths: raw.filePaths,
          anchorPath
        };
        this.folderSharesMeta.set(root, meta);
        for (const p of raw.filePaths) {
          this.sharedNotes.set(p, { roomId: raw.roomId, shareUrl: raw.shareUrl });
        }
      } catch {
        continue;
      }
    }
    markpadCollabDebug("rebuildFolderSharesFromFiles", {
      scanned: anchorPaths.length,
      folderCount: this.folderSharesMeta.size,
      totalPaths: [...this.folderSharesMeta.values()].flatMap((m) => m.paths).length
    });
    this.refreshSharesPanel();
  }
  syncShareFromFileFrontmatter(file) {
    if (file.name === FOLDER_SHARE_FILENAME) {
      this.syncFolderAnchorFromFile(file);
      return;
    }
    const cache = this.app.metadataCache.getFileCache(file);
    const raw = cache?.frontmatter?.[SHARE_FRONTMATTER_KEY];
    if (raw && typeof raw.roomId === "string" && typeof raw.shareUrl === "string") {
      this.sharedNotes.set(file.path, { roomId: raw.roomId, shareUrl: raw.shareUrl });
      return;
    }
    if (this.sharedNotes.has(file.path)) {
      return;
    }
    const isInFolder = [...this.folderSharesMeta.values()].some((m) => m.paths.includes(file.path));
    if (!isInFolder) {
      if (this.activeRuntime?.mode === "note" && this.activeRuntime.filePath === file.path) {
        return;
      }
      this.sharedNotes.delete(file.path);
    }
  }
  /** Fichier explicitement listé dans un partage dossier (pas tout le sous-arbre). */
  isFileListedInFolderShare(file) {
    for (const meta of this.folderSharesMeta.values()) {
      if (meta.paths.includes(file.path)) return true;
    }
    return false;
  }
  getFolderShareMetaForFile(file) {
    for (const [root, meta] of this.folderSharesMeta) {
      if (meta.paths.includes(file.path)) return { root, meta };
    }
    return null;
  }
  hasExplicitNoteShareFrontmatter(file) {
    const cache = this.app.metadataCache.getFileCache(file);
    const raw = cache?.frontmatter?.[SHARE_FRONTMATTER_KEY];
    return !!(raw && typeof raw.roomId === "string" && typeof raw.shareUrl === "string");
  }
  /**
   * Partage note seule (markpadShare dans le frontmatter).
   * Les fichiers d’un partage dossier utilisent Y.Map(files) — pas la racine note,
   * même si sharedNotes contient une entrée miroir (roomId dossier).
   */
  getNoteShareForFile(file) {
    const cache = this.app.metadataCache.getFileCache(file);
    const explicit = cache?.frontmatter?.[SHARE_FRONTMATTER_KEY];
    if (explicit && typeof explicit.roomId === "string" && typeof explicit.shareUrl === "string") {
      return { roomId: explicit.roomId, shareUrl: explicit.shareUrl };
    }
    if (this.isFileListedInFolderShare(file)) return null;
    const fromMap = this.sharedNotes.get(file.path);
    if (fromMap) return fromMap;
    return null;
  }
  syncFolderAnchorFromFile(file) {
    const cache = this.app.metadataCache.getFileCache(file);
    const raw = cache?.frontmatter?.[FOLDER_SHARE_FM];
    const parent = file.parent;
    const root = parent?.path ?? "";
    if (!raw?.roomId || !raw?.shareUrl || !Array.isArray(raw.filePaths)) {
      for (const [k, meta2] of this.folderSharesMeta) {
        if (meta2.anchorPath === file.path) {
          for (const p of meta2.paths) {
            this.sharedNotes.delete(p);
          }
          this.folderSharesMeta.delete(k);
        }
      }
      return;
    }
    const meta = {
      roomId: raw.roomId,
      shareUrl: raw.shareUrl,
      paths: raw.filePaths,
      anchorPath: file.path
    };
    this.folderSharesMeta.set(root, meta);
    for (const p of raw.filePaths) {
      this.sharedNotes.set(p, { roomId: raw.roomId, shareUrl: raw.shareUrl });
    }
  }
  collectFolderShareSyncPathsInFolder(folder) {
    const out = [];
    const walk = (f) => {
      if (f instanceof import_obsidian6.TFile && this.isFolderShareSyncFile(f)) {
        if (f.name === FOLDER_SHARE_FILENAME) return;
        out.push(f.path);
      } else if (f instanceof import_obsidian6.TFolder) {
        for (const c of f.children) {
          walk(c);
        }
      }
    };
    walk(folder);
    return out;
  }
  async startSharingFolder(folder) {
    if (diagnoseAuthToken(this.settings.authToken)) {
      this.noticeAuthTokenIssue();
      return;
    }
    const paths = this.collectFolderShareSyncPathsInFolder(folder);
    if (paths.length === 0) {
      new import_obsidian6.Notice("Aucun fichier Markdown ni .base dans ce dossier.");
      return;
    }
    const openMarkdownPath = paths.find((p) => p.toLowerCase().endsWith(".md"));
    if (!openMarkdownPath) {
      new import_obsidian6.Notice(
        "Markpad : ajoutez au moins une note .md pour lancer le partage depuis Obsidian (les fichiers .base sont inclus pour le web)."
      );
      return;
    }
    this.disconnect();
    if (this.autoConnectTimer != null) {
      window.clearTimeout(this.autoConnectTimer);
      this.autoConnectTimer = null;
    }
    this.collabAttachInProgress = true;
    const anchorPath = (0, import_obsidian6.normalizePath)(`${folder.path}/${FOLDER_SHARE_FILENAME}`);
    markpadCollabDebug("folder:startSharing", {
      folderPath: folder.path,
      anchorPath,
      mdFiles: paths.length,
      pathsPreview: paths.slice(0, 8)
    });
    try {
      const created = await createFolderShareSession({
        serverUrl: this.settings.serverUrl,
        settings: this.settings,
        noteId: anchorPath,
        folderPath: folder.path,
        filePaths: paths,
        roomPassword: this.settings.defaultRoomPassword || void 0
      });
      await this.ensureFolderAnchorFile(anchorPath, created, paths);
      await this.flushEditorAfterVaultWrite();
      const meta = {
        roomId: created.roomId,
        shareUrl: created.shareUrl,
        paths,
        anchorPath
      };
      this.folderSharesMeta.set(folder.path, meta);
      for (const p of paths) {
        this.sharedNotes.set(p, { roomId: created.roomId, shareUrl: created.shareUrl });
      }
      let active = this.getActiveMarkdownFileAndView();
      if (!active || !paths.includes(active.file.path)) {
        const first = this.app.vault.getAbstractFileByPath(openMarkdownPath);
        if (first instanceof import_obsidian6.TFile) {
          await this.app.workspace.getLeaf(false).openFile(first);
        }
      }
      active = this.getActiveMarkdownFileAndView();
      if (!active) {
        new import_obsidian6.Notice("Impossible d'ouvrir une note du dossier.");
        return;
      }
      await this.attachFolderSharedSession(active.file, active.view, meta, {
        seedLocalFiles: true
      });
      await this.writeClipboardSafe(created.shareUrl, `Dossier partag\xE9 \u2014 lien copi\xE9 : ${created.shareUrl}`);
      this.refreshSharesPanel();
    } catch (error) {
      this.updateStatusBar("error");
      new import_obsidian6.Notice(`Markpad erreur: ${error.message}`);
    } finally {
      this.collabAttachInProgress = false;
    }
  }
  async ensureFolderAnchorFile(anchorPath, created, paths) {
    const key = (0, import_obsidian6.normalizePath)(anchorPath);
    const prev = this.folderAnchorWriteQueue.get(key) ?? Promise.resolve();
    const job = prev.then(() => this.writeFolderAnchorFileContent(key, created, paths)).catch((e) => {
      throw e;
    });
    this.folderAnchorWriteQueue.set(
      key,
      job.then(
        () => void 0,
        () => void 0
      )
    );
    await job;
  }
  async writeFolderAnchorFileContent(anchorPath, created, paths) {
    const lines = [
      "---",
      `${FOLDER_SHARE_FM}:`,
      `  roomId: ${JSON.stringify(created.roomId)}`,
      `  shareUrl: ${JSON.stringify(created.shareUrl)}`,
      "  filePaths:"
    ];
    for (const p of paths) {
      lines.push(`    - ${JSON.stringify(p)}`);
    }
    lines.push("---", "");
    const body = lines.join("\n");
    const pathNorm = (0, import_obsidian6.normalizePath)(anchorPath);
    const anchorDir = folderPartOf(pathNorm);
    if (anchorDir) {
      await this.ensureFolderTree(anchorDir);
    }
    const existing = this.app.vault.getAbstractFileByPath(pathNorm);
    if (existing instanceof import_obsidian6.TFile) {
      await this.app.vault.modify(existing, body);
      return;
    }
    let onDisk = false;
    try {
      onDisk = await this.app.vault.adapter.exists(pathNorm);
    } catch {
      onDisk = false;
    }
    if (onDisk) {
      await this.app.vault.adapter.write(pathNorm, body);
      return;
    }
    try {
      await this.app.vault.create(pathNorm, body);
    } catch (error) {
      const msg = String(error?.message ?? error);
      let current = this.app.vault.getAbstractFileByPath(pathNorm);
      if (current instanceof import_obsidian6.TFile) {
        await this.app.vault.modify(current, body);
        return;
      }
      if (/already exists/i.test(msg)) {
        await new Promise((r) => window.setTimeout(r, 0));
        current = this.app.vault.getAbstractFileByPath(pathNorm);
        if (current instanceof import_obsidian6.TFile) {
          await this.app.vault.modify(current, body);
          return;
        }
        try {
          await this.app.vault.adapter.write(pathNorm, body);
        } catch (e2) {
          throw e2 instanceof Error ? e2 : error;
        }
        return;
      }
      try {
        if (await this.app.vault.adapter.exists(pathNorm)) {
          await this.app.vault.adapter.write(pathNorm, body);
          return;
        }
      } catch {
      }
      throw error;
    }
  }
  async seedFolderFilesFromVault(doc2, paths, origin) {
    let count = 0;
    for (const p of paths) {
      const f = this.app.vault.getAbstractFileByPath(p);
      if (!(f instanceof import_obsidian6.TFile)) continue;
      const raw = await this.app.vault.read(f);
      seedFileEntryFromMarkdown(doc2, p, raw, origin);
      count++;
    }
    return count;
  }
  async attachFolderSharedSession(file, view, meta, options) {
    const wsBase = this.settings.serverUrl.replace(/^http/i, "ws");
    const doc2 = new Y11.Doc();
    const files = doc2.getMap("files");
    const anchorF = this.app.vault.getAbstractFileByPath(meta.anchorPath);
    let folderRoot = anchorF instanceof import_obsidian6.TFile ? anchorF.parent?.path ?? "" : parentPathOf((0, import_obsidian6.normalizePath)(meta.anchorPath));
    if (!folderRoot && meta.paths[0]) {
      folderRoot = parentPathOf(meta.paths[0]);
    }
    if (options.seedLocalFiles) {
      await this.seedFolderFilesFromVault(doc2, meta.paths, "markpad-seed-folder");
    }
    await this.flushPendingFolderYOps(meta, doc2);
    const provider = new WebsocketProvider(`${wsBase}/ws`, meta.roomId, doc2, {
      connect: false,
      params: {
        userId: this.awarenessUserId(),
        name: this.settings.displayName,
        color: this.settings.color,
        password: this.settings.defaultRoomPassword ?? ""
      }
    });
    const patchFolder = patchYWebsocketProviderOutbound(provider);
    markpadCollabDebug(
      patchFolder ? "folder:patchYWebsocket OK" : "folder:patchYWebsocket \xC9CHOU\xC9 \u2014 _updateHandler absent (sortie WS cass\xE9e ?)",
      { patchFolder, roomId: meta.roomId, seedLocalFiles: options.seedLocalFiles }
    );
    if (!patchFolder && !this.patchFailedNoticeShown) {
      this.patchFailedNoticeShown = true;
      new import_obsidian6.Notice(
        "Markpad: optimisation WebSocket indisponible sur cette version d'Obsidian.\nLa synchronisation peut g\xE9n\xE9rer du trafic r\xE9seau suppl\xE9mentaire.",
        8e3
      );
    }
    provider.awareness.setLocalStateField("user", {
      name: this.settings.displayName,
      color: this.settings.color
    });
    provider.awareness.setLocalStateField("cursor", null);
    provider.awareness.on("change", () => this.updatePresenceInStatusBar(provider));
    provider.on("status", (event) => {
      markpadCollabDebug("folder:provider status", event);
      if (event.status === "connected") {
        this.collabHasEverConnected = true;
        this.collabIsReadonly = false;
        this.collabWsStatus = "connected";
        this.updatePresenceInStatusBar(provider);
        this.decorateSharedUi();
        if (this.collabReadonlyTimer !== null) {
          window.clearTimeout(this.collabReadonlyTimer);
          this.collabReadonlyTimer = null;
        }
        if (this.activeRuntime?.provider === provider && this.activeRuntime.cmView) {
          setCollabEditable(this.activeRuntime.cmView, true);
          markpadCollabDebug("folder: \xE9ditable (WS reconnect\xE9)");
        }
        return;
      }
      if (event.status === "connecting") {
        this.collabWsStatus = "connecting";
        this.updateStatusBar("connecting");
        this.decorateSharedUi();
        this.startCollabReadonlyTimerIfNeeded(provider);
        return;
      }
      this.collabWsStatus = "disconnected";
      this.updateStatusBar("offline");
      this.decorateSharedUi();
      this.startCollabReadonlyTimerIfNeeded(provider);
    });
    const onFolderProviderSync = (synced) => {
      markpadCollabDebug("folder:provider sync", { synced, wsconnected: provider.wsconnected });
      if (!synced) return;
      const map3 = doc2.getMap("files");
      if (options.seedLocalFiles && map3.size === 0 && meta.paths.length > 0) {
        void this.seedFolderFilesFromVault(doc2, meta.paths, "markpad-reseed-folder-after-sync").then(
          (n) => {
            markpadCollabDebug("folder: Y.Map vide apr\xE8s sync \u2192 re-seed depuis vault", { fileCount: n });
            if (this.activeRuntime?.doc === doc2 && this.activeRuntime.mode === "folder") {
              this.queueFolderSyncFromY(meta, folderRoot, doc2);
            }
          }
        );
      }
    };
    provider.on("sync", onFolderProviderSync);
    let fileEntry = getFileEntry(doc2, file.path);
    if (!fileEntry) {
      const raw = await this.app.vault.read(file);
      fileEntry = seedFileEntryFromMarkdown(doc2, file.path, raw, "markpad-folder-open");
    }
    const yText = getBodyYText(fileEntry);
    const cm = resolveObsidianEditorView(view);
    if (!cm) {
      provider.destroy();
      doc2.destroy();
      new import_obsidian6.Notice("Impossible de lier CodeMirror pour cette vue.");
      throw new Error("no_cm");
    }
    mountCollabExtensionWithYText(cm, yText, provider.awareness);
    this.applyBodyYToCmHealed(cm, doc2, yText);
    mountCollabEditable(cm, true);
    provider.connect();
    let debugUnload;
    if (this.settings.debugCollab) {
      const onYUpdate = (update, origin) => {
        markpadCollabDebug("Y.Doc update (encode)", {
          updateBytes: update.length,
          origin: debugOriginLabel(origin),
          originIsProvider: origin === provider,
          ywebsocketWouldSkipSend: origin === provider
        });
      };
      doc2.on("update", onYUpdate);
      debugUnload = () => {
        doc2.off("update", onYUpdate);
      };
    }
    if (!folderRoot && meta.paths[0]) {
      folderRoot = parentPathOf(meta.paths[0]);
      markpadCollabDebug("folder:attach folderRoot d\xE9riv\xE9 de meta.paths[0] (ancre absente du cache)", {
        folderRoot,
        firstPath: meta.paths[0]
      });
    }
    markpadCollabDebug("folder:attach computed", {
      folderRoot,
      anchorPath: meta.anchorPath,
      activeFile: file.path,
      yMapKeys: [...files.keys()],
      metaPathsCount: meta.paths.length,
      wsconnected: provider.wsconnected,
      synced: provider.synced
    });
    const filesMap = doc2.getMap("files");
    const onFilesChange = () => {
      if (!this.activeRuntime || this.activeRuntime.doc !== doc2 || this.activeRuntime.mode !== "folder") {
        return;
      }
      markpadCollabDebug("folder:Y.Map(files) observe \u2192 syncFolderFilesFromY");
      this.queueFolderSyncFromY(meta, folderRoot, doc2);
    };
    filesMap.observe(onFilesChange);
    const onDocUpdateFromRemote = (update, origin) => {
      if (!this.activeRuntime || this.activeRuntime.doc !== doc2 || this.activeRuntime.mode !== "folder") {
        return;
      }
      if (origin !== provider) return;
      markpadCollabDebug("folder:doc update (remote) \u2192 sync vault (d\xE9bounc\xE9)", {
        updateBytes: update.length
      });
      this.queueFolderSyncFromRemote(meta, folderRoot, doc2);
    };
    doc2.on("update", onDocUpdateFromRemote);
    this.collabWsStatus = provider.wsconnected ? "connected" : "connecting";
    this.activeRuntime = {
      mode: "folder",
      filePath: file.path,
      shareUrl: meta.shareUrl,
      roomId: meta.roomId,
      roomPassword: this.settings.defaultRoomPassword || void 0,
      doc: doc2,
      provider,
      cmView: cm,
      yText,
      folderRoot,
      sharedPaths: meta.paths,
      debugUnload,
      folderFilesUnload: () => {
        filesMap.unobserve(onFilesChange);
        this.activeRuntime?.folderMetaObserveUnload?.();
        if (this.activeRuntime) this.activeRuntime.folderMetaObserveUnload = void 0;
        doc2.off("update", onDocUpdateFromRemote);
        if (this.folderRemoteSyncTimer != null) {
          window.clearTimeout(this.folderRemoteSyncTimer);
          this.folderRemoteSyncTimer = null;
        }
        if (this.activeFileMetaToVaultTimer != null) {
          window.clearTimeout(this.activeFileMetaToVaultTimer);
          this.activeFileMetaToVaultTimer = null;
        }
      }
    };
    this.decorateSharedUi();
    const upgraded = migrateFilesMapLegacyToV2(doc2, "markpad-folder-migrate-v2");
    if (upgraded > 0) {
      markpadCollabDebug("folder:migration Y.Text \u2192 body+meta", { upgraded });
    }
    for (const [, raw] of files.entries()) {
      if (isNoteFileEntry(raw)) {
        healBodyYTextIfPolluted(doc2, getBodyYText(raw), "markpad-folder-heal-all");
      }
    }
    this.markAttachGraceFolder(folderRoot);
    this.bindFolderActiveMetaObserve(file, doc2);
    this.queueFolderSyncFromY(meta, folderRoot, doc2);
    this.updatePresenceInStatusBar(provider);
    if (provider.synced) {
      onFolderProviderSync(true);
    }
  }
  queueFolderSyncFromY(meta, folderRoot, doc2) {
    if (this.folderSyncInProgress) {
      this.folderSyncQueued = true;
      return;
    }
    void this.syncFolderFilesFromY(meta, folderRoot, doc2);
  }
  /** Sync vault dossier après changements Y distants (corps des fichiers non ouverts). */
  queueFolderSyncFromRemote(meta, folderRoot, doc2) {
    if (this.folderRemoteSyncTimer != null) {
      window.clearTimeout(this.folderRemoteSyncTimer);
    }
    this.folderRemoteSyncTimer = window.setTimeout(() => {
      this.folderRemoteSyncTimer = null;
      this.queueFolderSyncFromY(meta, folderRoot, doc2);
    }, 600);
  }
  async registerFileInFolderShare(file, folderRoot, meta) {
    if (meta.paths.includes(file.path)) return;
    meta.paths.push(file.path);
    this.sharedNotes.set(file.path, { roomId: meta.roomId, shareUrl: meta.shareUrl });
    this.folderSharesMeta.set(folderRoot, meta);
    await this.pushFolderFileToY(meta, file.path, "markpad-folder-new-file");
    await this.ensureFolderAnchorFile(meta.anchorPath, meta, meta.paths);
    this.decorateSharedUi();
    this.refreshSharesPanel();
  }
  async onMarkdownCreated(file) {
    if (file.name === FOLDER_SHARE_FILENAME) return;
    if (!this.isFolderShareSyncFile(file)) return;
    for (const [root, meta] of this.folderSharesMeta) {
      if (!isPathInFolder(file.path, root)) continue;
      await this.registerFileInFolderShare(file, root, meta);
      break;
    }
  }
  async syncFolderFilesFromY(meta, folderRoot, doc2) {
    if (this.folderSyncInProgress) {
      this.folderSyncQueued = true;
      return;
    }
    if (!this.activeRuntime || this.activeRuntime.doc !== doc2 || this.activeRuntime.mode !== "folder") {
      markpadCollabDebug("folder:syncFolderFilesFromY skip (pas de runtime dossier actif)");
      return;
    }
    this.folderSyncInProgress = true;
    const files = doc2.getMap("files");
    markpadCollabDebug("folder:syncFolderFilesFromY enter", {
      folderRoot,
      mapEntries: files.size,
      metaPaths: meta.paths.length
    });
    const activePath = this.activeRuntime.filePath;
    const yPaths = /* @__PURE__ */ new Set();
    let changed = false;
    this.suppressVaultToY = true;
    try {
      for (const [path, rawValue] of files.entries()) {
        if (typeof path !== "string") continue;
        let value = rawValue;
        if (value instanceof Y11.Text) {
          value = upgradeLegacyFileEntry(doc2, path, value, "markpad-folder-sync-upgrade");
        }
        if (!isNoteFileEntry(value)) {
          markpadCollabDebug("folder:sync skip (entr\xE9e non v2 body+meta)", path);
          continue;
        }
        if (!isFolderSharePath(path)) continue;
        if (!isPathInFolder(path, folderRoot)) continue;
        if (path.endsWith(`/${FOLDER_SHARE_FILENAME}`)) continue;
        yPaths.add(path);
        if (!meta.paths.includes(path)) {
          meta.paths.push(path);
          this.sharedNotes.set(path, { roomId: meta.roomId, shareUrl: meta.shareUrl });
          changed = true;
          markpadCollabDebug("folder:sync nouvelle entr\xE9e meta depuis Y", path);
        }
        healBodyYTextIfPolluted(doc2, getBodyYText(value), "markpad-folder-sync-heal");
        const markdown = assembleFileEntry(value);
        const existing = this.app.vault.getAbstractFileByPath(path);
        if (!existing) {
          try {
            const dir = folderPartOf(path);
            if (dir) await this.ensureFolderTree(dir);
            await this.app.vault.create(path, markdown);
            changed = true;
            markpadCollabDebug("folder:sync fichier cr\xE9\xE9 sur le vault depuis Y", path);
          } catch (e) {
            markpadCollabDebug("folder:sync cr\xE9ation vault \xE9chou\xE9e", path, e);
          }
        } else if (existing instanceof import_obsidian6.TFile && path !== activePath) {
          try {
            const onDisk = await this.app.vault.read(existing);
            if (onDisk !== markdown) {
              await this.app.vault.modify(existing, markdown);
              changed = true;
              markpadCollabDebug("folder:sync fichier mis \xE0 jour depuis Y", path);
            }
          } catch (e) {
            markpadCollabDebug("folder:sync modify vault \xE9chou\xE9e", path, e);
          }
        } else if (existing instanceof import_obsidian6.TFile && path === activePath) {
          const syncedMeta = await this.syncActiveFileVaultFrontmatterFromY(
            existing,
            getMetaYMap(value),
            getBodyYText(value)
          );
          if (syncedMeta) changed = true;
          else markpadCollabDebug("folder:sync skip fichier actif (CM\u2194Y)", path);
        }
      }
      const removedFromY = meta.paths.filter(
        (p) => isFolderSharePath(p) && isPathInFolder(p, folderRoot) && !p.endsWith(`/${FOLDER_SHARE_FILENAME}`) && !yPaths.has(p)
      );
      for (const path of removedFromY) {
        meta.paths = meta.paths.filter((p) => p !== path);
        this.sharedNotes.delete(path);
        changed = true;
        const existing = this.app.vault.getAbstractFileByPath(path);
        if (existing instanceof import_obsidian6.TFile) {
          try {
            await this.app.vault.delete(existing);
            markpadCollabDebug("folder:sync fichier supprim\xE9 du vault (absent de Y)", path);
          } catch (e) {
            markpadCollabDebug("folder:sync suppression vault \xE9chou\xE9e", path, e);
          }
        }
        if (activePath === path) {
          this.disconnect();
        }
      }
      for (const path of meta.paths) {
        if (!isFolderSharePath(path)) continue;
        if (!isPathInFolder(path, folderRoot)) continue;
        if (path.endsWith(`/${FOLDER_SHARE_FILENAME}`)) continue;
        if (yPaths.has(path)) continue;
        const tfile = this.app.vault.getAbstractFileByPath(path);
        if (!(tfile instanceof import_obsidian6.TFile)) continue;
        try {
          const raw = await this.app.vault.read(tfile);
          seedFileEntryFromMarkdown(doc2, path, raw, "markpad-folder-vault-seed");
          yPaths.add(path);
          changed = true;
          markpadCollabDebug("folder:sync entr\xE9e Y depuis nouveau fichier vault", path);
        } catch (e) {
          markpadCollabDebug("folder:sync seed vault\u2192Y \xE9chou\xE9", path, e);
        }
      }
    } finally {
      this.suppressVaultToY = false;
      this.folderSyncInProgress = false;
      if (this.folderSyncQueued) {
        this.folderSyncQueued = false;
        void this.syncFolderFilesFromY(meta, folderRoot, doc2);
      }
    }
    if (changed) {
      this.folderSharesMeta.set(folderRoot, meta);
      if (this.activeRuntime.sharedPaths) {
        this.activeRuntime.sharedPaths = meta.paths;
      }
      await this.ensureFolderAnchorFile(meta.anchorPath, meta, meta.paths);
      this.decorateSharedUi();
      this.refreshSharesPanel();
    }
  }
  /**
   * Monte la collab sur la vue qui édite réellement le fichier (onglet actif ou modale Base Board).
   */
  async ensureFolderCollabForOpenedFile(file) {
    if (!this.activeRuntime || this.activeRuntime.mode !== "folder") return;
    if (!this.activeRuntime.sharedPaths?.includes(file.path)) return;
    const view = this.findMarkdownViewForPath(file.path) ?? this.app.workspace.getActiveViewOfType(import_obsidian6.MarkdownView);
    if (!view || view.file?.path !== file.path) return;
    const cm = resolveObsidianEditorView(view);
    if (!cm) return;
    const sameFile = this.activeRuntime.filePath === file.path;
    const cmChanged = cm !== this.activeRuntime.cmView;
    const notMounted = !isCollabMounted(cm);
    if (!sameFile) {
      await this.switchFolderActiveFile(file, view);
      return;
    }
    if (!cmChanged && !notMounted) return;
    markpadCollabDebug("folder: collab sur \xE9diteur secondaire (modal Base Board, etc.)", {
      path: file.path,
      cmChanged,
      notMounted
    });
    try {
      unmountCollabEditable(this.activeRuntime.cmView);
    } catch {
    }
    try {
      unmountCollabExtension(this.activeRuntime.cmView);
    } catch {
    }
    this.activeRuntime.cmView = cm;
    remountCollabExtensionForYText(
      cm,
      this.activeRuntime.yText,
      this.activeRuntime.provider.awareness
    );
    this.applyBodyYToCmHealed(cm, this.activeRuntime.doc, this.activeRuntime.yText);
    mountCollabEditable(cm, !this.collabIsReadonly);
    this.bindFolderActiveMetaObserve(file, this.activeRuntime.doc);
    if (!this.activeRuntime.provider.wsconnected) {
      this.activeRuntime.provider.connect();
    }
  }
  async switchFolderActiveFile(file, view) {
    if (!this.activeRuntime || this.activeRuntime.mode !== "folder") return;
    if (this.activeRuntime.filePath === file.path) {
      if (view) await this.ensureFolderCollabForOpenedFile(file);
      return;
    }
    const files = this.activeRuntime.doc.getMap("files");
    let fileEntry = getFileEntry(this.activeRuntime.doc, file.path);
    const legacy = files.get(file.path);
    if (!fileEntry && legacy instanceof Y11.Text) {
      fileEntry = upgradeLegacyFileEntry(
        this.activeRuntime.doc,
        file.path,
        legacy,
        "markpad-folder-switch"
      );
    } else if (!fileEntry) {
      const raw = await this.app.vault.read(file);
      fileEntry = seedFileEntryFromMarkdown(
        this.activeRuntime.doc,
        file.path,
        raw,
        "markpad-folder-switch"
      );
    }
    const yText = getBodyYText(fileEntry);
    const targetView = view ?? this.findMarkdownViewForPath(file.path) ?? this.app.workspace.getActiveViewOfType(import_obsidian6.MarkdownView);
    let cm = null;
    if (targetView && targetView.file?.path === file.path) {
      cm = resolveObsidianEditorView(targetView);
    }
    if (!cm) {
      markpadCollabDebug("folder:switch sans vue MD, Y.Text pr\xEAt pour vault\u2192Y", file.path);
      this.activeRuntime.yText = yText;
      this.activeRuntime.filePath = file.path;
      this.bindFolderActiveMetaObserve(file, this.activeRuntime.doc);
      this.decorateSharedUi();
      return;
    }
    try {
      unmountCollabEditable(this.activeRuntime.cmView);
    } catch {
    }
    try {
      unmountCollabExtension(this.activeRuntime.cmView);
    } catch {
    }
    this.activeRuntime.cmView = cm;
    this.activeRuntime.yText = yText;
    this.activeRuntime.filePath = file.path;
    mountCollabExtensionWithYText(cm, yText, this.activeRuntime.provider.awareness);
    this.applyBodyYToCmHealed(cm, this.activeRuntime.doc, yText);
    mountCollabEditable(cm, !this.collabIsReadonly);
    this.bindFolderActiveMetaObserve(file, this.activeRuntime.doc);
    this.decorateSharedUi();
  }
  async onFolderLeafChange() {
    if (!this.activeRuntime || this.activeRuntime.mode !== "folder") return;
    const active = this.getActiveMarkdownFileAndView();
    if (!active) return;
    if (active.file.path === this.activeRuntime.filePath) return;
    if (!this.activeRuntime.sharedPaths?.includes(active.file.path)) return;
    await this.switchFolderActiveFile(active.file);
  }
  getSharesForPanel() {
    const out = [];
    for (const [root, meta] of this.folderSharesMeta) {
      out.push({
        kind: "folder",
        label: root,
        pathKey: root,
        shareUrl: meta.shareUrl,
        roomId: meta.roomId
      });
    }
    const inFolder = /* @__PURE__ */ new Set();
    for (const m of this.folderSharesMeta.values()) {
      for (const p of m.paths) {
        inFolder.add(p);
      }
    }
    for (const [path, share] of this.sharedNotes) {
      if (inFolder.has(path)) continue;
      out.push({
        kind: "note",
        label: path,
        pathKey: path,
        shareUrl: share.shareUrl,
        roomId: share.roomId
      });
    }
    return out;
  }
  async deleteShareFromPanel(row) {
    if (row.kind === "folder") {
      await this.stopSharingFolderByPath(row.pathKey);
    } else {
      await this.stopSharingPath(row.pathKey);
    }
  }
  /** Supprime les fichiers ancre `.markpad-folder-share.md`, arrête les sessions côté serveur (meilleur effort) et réinitialise l’état local. */
  async purgeFolderShareAnchors() {
    const roots = Array.from(this.folderSharesMeta.keys());
    for (const root of roots) {
      await this.stopSharingFolderByPath(root);
    }
    for (const anchorPath of await this.collectFolderShareAnchorPaths()) {
      await this.deleteFolderShareAnchorAtPath(anchorPath);
    }
    this.folderSharesMeta.clear();
    this.rebuildSharedNotesFromFrontmatter();
    this.disconnect();
    this.decorateSharedUi();
    this.refreshSharesPanel();
    new import_obsidian6.Notice("Fichiers .markpad-folder-share.md supprim\xE9s et m\xE9tadonn\xE9es dossier r\xE9initialis\xE9es.");
  }
  refreshSharesPanel() {
    for (const leaf of this.app.workspace.getLeavesOfType(MARKPAD_SHARES_VIEW_TYPE)) {
      const v = leaf.view;
      if (v instanceof MarkpadSharesView) {
        v.refresh();
      }
    }
  }
  async openSharesPanel() {
    const existing = this.app.workspace.getLeavesOfType(MARKPAD_SHARES_VIEW_TYPE);
    if (existing.length > 0) {
      this.app.workspace.revealLeaf(existing[0]);
      existing[0].view.refresh();
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false) ?? this.app.workspace.getLeaf("tab");
    await leaf.setViewState({ type: MARKPAD_SHARES_VIEW_TYPE, active: true });
    this.app.workspace.revealLeaf(leaf);
  }
  getActiveSharedRoom() {
    if (!this.activeRuntime) return null;
    return {
      roomId: this.activeRuntime.roomId,
      filePath: this.activeRuntime.mode === "folder" ? this.activeRuntime.filePath ?? null : null,
      kind: this.activeRuntime.mode
    };
  }
  getActiveSharedDocumentText() {
    if (!this.activeRuntime) return null;
    const { doc: doc2, mode, filePath } = this.activeRuntime;
    if (mode === "folder") {
      const entry = getFileEntry(doc2, filePath);
      if (entry) return assembleFileEntry(entry);
    } else {
      const root = doc2.getMap("note");
      if (hasNoteFileShape(root)) return assembleFileEntry(root);
    }
    return this.activeRuntime.yText.toString();
  }
  async openHistoryPanel() {
    const existing = this.app.workspace.getLeavesOfType(MARKPAD_HISTORY_VIEW_TYPE);
    if (existing.length > 0) {
      this.app.workspace.revealLeaf(existing[0]);
      void existing[0].view.refresh();
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false) ?? this.app.workspace.getLeaf("tab");
    await leaf.setViewState({ type: MARKPAD_HISTORY_VIEW_TYPE, active: true });
    this.app.workspace.revealLeaf(leaf);
  }
  async copyShareLinkForFolder(folderRootPath) {
    const meta = this.folderSharesMeta.get(folderRootPath);
    if (!meta) {
      new import_obsidian6.Notice("Ce dossier n'a pas de partage Markpad.");
      return;
    }
    await this.writeClipboardSafe(meta.shareUrl, "Lien du dossier copi\xE9.");
  }
  async stopSharingFolderByPath(folderRootPath) {
    const meta = this.folderSharesMeta.get(folderRootPath);
    if (!meta) {
      new import_obsidian6.Notice("Ce dossier n'est pas partag\xE9.");
      return;
    }
    try {
      if (this.activeRuntime?.mode === "folder" && this.activeRuntime.roomId === meta.roomId) {
        this.disconnect();
      }
      try {
        await endShareSession({
          serverUrl: this.settings.serverUrl,
          settings: this.settings,
          roomId: meta.roomId
        });
      } catch {
      }
      for (const p of meta.paths) {
        this.sharedNotes.delete(p);
      }
      this.folderSharesMeta.delete(folderRootPath);
      try {
        await this.deleteFolderShareAnchorAtPath(meta.anchorPath);
      } catch (e2) {
        new import_obsidian6.Notice(`Markpad: nettoyage du fichier ancre impossible \u2014 ${e2.message}`);
      }
      this.decorateSharedUi();
      this.refreshSharesPanel();
      new import_obsidian6.Notice("Partage du dossier arr\xEAt\xE9.");
    } catch (error) {
      new import_obsidian6.Notice(this.humanizeShareError(error));
    }
  }
  async writeShareFrontmatter(file, share) {
    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      if (share) {
        frontmatter[SHARE_FRONTMATTER_KEY] = {
          roomId: share.roomId,
          shareUrl: share.shareUrl
        };
      } else {
        delete frontmatter[SHARE_FRONTMATTER_KEY];
      }
    });
    this.syncShareFromFileFrontmatter(file);
  }
};
