webpackHotUpdate_N_E("pages/formCompletion",{

/***/ "./pages/formCompletion.js":
/*!*********************************!*\
  !*** ./pages/formCompletion.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _Users_armaandhanoa_Documents_Documents_Armaan_s_Mac_mini_Projects_ABET_Spring21_FontNew_ABET_Course_Assessment_Tool_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/regenerator */ \"./node_modules/@babel/runtime/regenerator/index.js\");\n/* harmony import */ var _Users_armaandhanoa_Documents_Documents_Armaan_s_Mac_mini_Projects_ABET_Spring21_FontNew_ABET_Course_Assessment_Tool_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Users_armaandhanoa_Documents_Documents_Armaan_s_Mac_mini_Projects_ABET_Spring21_FontNew_ABET_Course_Assessment_Tool_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _Users_armaandhanoa_Documents_Documents_Armaan_s_Mac_mini_Projects_ABET_Spring21_FontNew_ABET_Course_Assessment_Tool_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator */ \"./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @chakra-ui/react */ \"./node_modules/@chakra-ui/react/dist/esm/index.js\");\n/* harmony import */ var _api_APIHelper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../api/APIHelper */ \"./api/APIHelper.js\");\n\n\n\n\nvar _jsxFileName = \"/Users/armaandhanoa/Documents/Documents - Armaan\\u2019s Mac mini/Projects/ABET-Spring21/FontNew/ABET_Course_Assessment_Tool/pages/formCompletion.js\",\n    _this = undefined,\n    _s = $RefreshSig$();\n\n\n\n\n\nvar formCompletion = function formCompletion(_ref) {\n  _s();\n\n  var number = _ref.number,\n      section = _ref.section,\n      semester = _ref.semester,\n      year = _ref.year,\n      id = _ref.id;\n  console.log(number, section, semester, year, id);\n\n  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_3__[\"useState\"])(),\n      form = _useState[0],\n      setForm = _useState[1];\n\n  console.log(toString(number));\n\n  var getForm = /*#__PURE__*/function () {\n    var _ref2 = Object(_Users_armaandhanoa_Documents_Documents_Armaan_s_Mac_mini_Projects_ABET_Spring21_FontNew_ABET_Course_Assessment_Tool_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__[\"default\"])( /*#__PURE__*/_Users_armaandhanoa_Documents_Documents_Armaan_s_Mac_mini_Projects_ABET_Spring21_FontNew_ABET_Course_Assessment_Tool_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee() {\n      var formData;\n      return _Users_armaandhanoa_Documents_Documents_Armaan_s_Mac_mini_Projects_ABET_Spring21_FontNew_ABET_Course_Assessment_Tool_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {\n        while (1) {\n          switch (_context.prev = _context.next) {\n            case 0:\n              formData = Object(_api_APIHelper__WEBPACK_IMPORTED_MODULE_5__[\"getFormBySection\"])(id, 2020, \"Fall\", \"CSCE\", toString(number), section);\n              setForm(formData);\n\n            case 2:\n            case \"end\":\n              return _context.stop();\n          }\n        }\n      }, _callee);\n    }));\n\n    return function getForm() {\n      return _ref2.apply(this, arguments);\n    };\n  }();\n\n  Object(react__WEBPACK_IMPORTED_MODULE_3__[\"useEffect\"])(function () {\n    getForm();\n  }, []);\n  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__[\"jsxDEV\"])(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_4__[\"Text\"], {}, void 0, false, {\n    fileName: _jsxFileName,\n    lineNumber: 35,\n    columnNumber: 9\n  }, _this);\n};\n\n_s(formCompletion, \"r8KZsrAFDmwVZQ8/B0/GPv2jaRc=\");\n\nformCompletion.getInitialProps = function (_ref3) {\n  var query = _ref3.query;\n  return {\n    number: query.number,\n    section: query.section,\n    semester: query.semester,\n    year: query.year,\n    id: 'MT2020'\n  };\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (formCompletion);\n\n;\n    var _a, _b;\n    // Legacy CSS implementations will `eval` browser code in a Node.js context\n    // to extract CSS. For backwards compatibility, we need to check we're in a\n    // browser context before continuing.\n    if (typeof self !== 'undefined' &&\n        // AMP / No-JS mode does not inject these helpers:\n        '$RefreshHelpers$' in self) {\n        var currentExports = module.__proto__.exports;\n        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n        // This cannot happen in MainTemplate because the exports mismatch between\n        // templating and execution.\n        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.i);\n        // A module can be accepted automatically based on its exports, e.g. when\n        // it is a Refresh Boundary.\n        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n            // Save the previous exports on update so we can compare the boundary\n            // signatures.\n            module.hot.dispose(function (data) {\n                data.prevExports = currentExports;\n            });\n            // Unconditionally accept an update to this module, we'll check if it's\n            // still a Refresh Boundary later.\n            module.hot.accept();\n            // This field is set when the previous version of this module was a\n            // Refresh Boundary, letting us know we need to check for invalidation or\n            // enqueue an update.\n            if (prevExports !== null) {\n                // A boundary can become ineligible if its exports are incompatible\n                // with the previous exports.\n                //\n                // For example, if you add/remove/change exports, we'll want to\n                // re-execute the importing modules, and force those components to\n                // re-render. Similarly, if you convert a class component to a\n                // function, we want to invalidate the boundary.\n                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                    module.hot.invalidate();\n                }\n                else {\n                    self.$RefreshHelpers$.scheduleUpdate();\n                }\n            }\n        }\n        else {\n            // Since we just executed the code for the module, it's possible that the\n            // new exports made it ineligible for being a boundary.\n            // We only care about the case when we were _previously_ a boundary,\n            // because we already accepted this update (accidental side effect).\n            var isNoLongerABoundary = prevExports !== null;\n            if (isNoLongerABoundary) {\n                module.hot.invalidate();\n            }\n        }\n    }\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/next/dist/compiled/webpack/harmony-module.js */ \"./node_modules/next/dist/compiled/webpack/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vcGFnZXMvZm9ybUNvbXBsZXRpb24uanM/OGEwMiJdLCJuYW1lcyI6WyJmb3JtQ29tcGxldGlvbiIsIm51bWJlciIsInNlY3Rpb24iLCJzZW1lc3RlciIsInllYXIiLCJpZCIsImNvbnNvbGUiLCJsb2ciLCJ1c2VTdGF0ZSIsImZvcm0iLCJzZXRGb3JtIiwidG9TdHJpbmciLCJnZXRGb3JtIiwiZm9ybURhdGEiLCJnZXRGb3JtQnlTZWN0aW9uIiwidXNlRWZmZWN0IiwiZ2V0SW5pdGlhbFByb3BzIiwicXVlcnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFnQkE7O0FBRUEsSUFBTUEsY0FBYyxHQUFHLFNBQWpCQSxjQUFpQixPQUE2QztBQUFBOztBQUFBLE1BQTFDQyxNQUEwQyxRQUExQ0EsTUFBMEM7QUFBQSxNQUFsQ0MsT0FBa0MsUUFBbENBLE9BQWtDO0FBQUEsTUFBekJDLFFBQXlCLFFBQXpCQSxRQUF5QjtBQUFBLE1BQWZDLElBQWUsUUFBZkEsSUFBZTtBQUFBLE1BQVRDLEVBQVMsUUFBVEEsRUFBUztBQUNoRUMsU0FBTyxDQUFDQyxHQUFSLENBQVlOLE1BQVosRUFBb0JDLE9BQXBCLEVBQTZCQyxRQUE3QixFQUF1Q0MsSUFBdkMsRUFBNkNDLEVBQTdDOztBQURnRSxrQkFFeENHLHNEQUFRLEVBRmdDO0FBQUEsTUFFekRDLElBRnlEO0FBQUEsTUFFbkRDLE9BRm1EOztBQUdoRUosU0FBTyxDQUFDQyxHQUFSLENBQVlJLFFBQVEsQ0FBQ1YsTUFBRCxDQUFwQjs7QUFDQSxNQUFNVyxPQUFPO0FBQUEsbWNBQUc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ05DLHNCQURNLEdBQ0tDLHVFQUFnQixDQUFDVCxFQUFELEVBQUssSUFBTCxFQUFXLE1BQVgsRUFBbUIsTUFBbkIsRUFBMkJNLFFBQVEsQ0FBQ1YsTUFBRCxDQUFuQyxFQUE2Q0MsT0FBN0MsQ0FEckI7QUFFWlEscUJBQU8sQ0FBQ0csUUFBRCxDQUFQOztBQUZZO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQUg7O0FBQUEsb0JBQVBELE9BQU87QUFBQTtBQUFBO0FBQUEsS0FBYjs7QUFNQUcseURBQVMsQ0FBQyxZQUFNO0FBQ1pILFdBQU87QUFDVixHQUZRLEVBRU4sRUFGTSxDQUFUO0FBSUEsc0JBQ0kscUVBQUMscURBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQURKO0FBSUgsQ0FsQkQ7O0dBQU1aLGM7O0FBb0JOQSxjQUFjLENBQUNnQixlQUFmLEdBQWlDLGlCQUFlO0FBQUEsTUFBWkMsS0FBWSxTQUFaQSxLQUFZO0FBQzVDLFNBQU87QUFDSGhCLFVBQU0sRUFBRWdCLEtBQUssQ0FBQ2hCLE1BRFg7QUFFSEMsV0FBTyxFQUFFZSxLQUFLLENBQUNmLE9BRlo7QUFHSEMsWUFBUSxFQUFFYyxLQUFLLENBQUNkLFFBSGI7QUFJSEMsUUFBSSxFQUFFYSxLQUFLLENBQUNiLElBSlQ7QUFLSEMsTUFBRSxFQUFFO0FBTEQsR0FBUDtBQU9ILENBUkQ7O0FBVWVMLDZFQUFmIiwiZmlsZSI6Ii4vcGFnZXMvZm9ybUNvbXBsZXRpb24uanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgICBUYWJsZSxcbiAgICBUaGVhZCxcbiAgICBUYm9keSxcbiAgICBUZm9vdCxcbiAgICBUcixcbiAgICBUaCxcbiAgICBUZCxcbiAgICBUYWJsZUNhcHRpb24sXG4gICAgVlN0YWNrLFxuICAgIEJ1dHRvbixcbiAgICBUZXh0LFxuICAgIEJveFxufSBmcm9tIFwiQGNoYWtyYS11aS9yZWFjdFwiO1xuXG5cbmltcG9ydCB7IGdldEZvcm1CeVNlY3Rpb24gfSBmcm9tICcuLi9hcGkvQVBJSGVscGVyJztcblxuY29uc3QgZm9ybUNvbXBsZXRpb24gPSAoeyBudW1iZXIsIHNlY3Rpb24sIHNlbWVzdGVyLCB5ZWFyLCBpZCB9KSA9PiB7XG4gICAgY29uc29sZS5sb2cobnVtYmVyLCBzZWN0aW9uLCBzZW1lc3RlciwgeWVhciwgaWQpO1xuICAgIGNvbnN0IFtmb3JtLCBzZXRGb3JtXSA9IHVzZVN0YXRlKCk7IFxuICAgIGNvbnNvbGUubG9nKHRvU3RyaW5nKG51bWJlcikpO1xuICAgIGNvbnN0IGdldEZvcm0gPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gZ2V0Rm9ybUJ5U2VjdGlvbihpZCwgMjAyMCwgXCJGYWxsXCIsIFwiQ1NDRVwiLCB0b1N0cmluZyhudW1iZXIpLCBzZWN0aW9uKTtcbiAgICAgICAgc2V0Rm9ybShmb3JtRGF0YSk7XG4gICAgfTtcblxuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgZ2V0Rm9ybSgpO1xuICAgIH0sIFtdKTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxUZXh0PlxuICAgICAgICA8L1RleHQ+XG4gICAgKVxufVxuXG5mb3JtQ29tcGxldGlvbi5nZXRJbml0aWFsUHJvcHMgPSAoeyBxdWVyeSB9KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbnVtYmVyOiBxdWVyeS5udW1iZXIsXG4gICAgICAgIHNlY3Rpb246IHF1ZXJ5LnNlY3Rpb24sXG4gICAgICAgIHNlbWVzdGVyOiBxdWVyeS5zZW1lc3RlcixcbiAgICAgICAgeWVhcjogcXVlcnkueWVhcixcbiAgICAgICAgaWQ6ICdNVDIwMjAnXG4gICAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZm9ybUNvbXBsZXRpb247Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/formCompletion.js\n");

/***/ })

})