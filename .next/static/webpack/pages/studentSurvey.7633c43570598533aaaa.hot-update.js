webpackHotUpdate_N_E("pages/studentSurvey",{

/***/ "./components/survey-components/StudentInfoForm.js":
/*!*********************************************************!*\
  !*** ./components/survey-components/StudentInfoForm.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @chakra-ui/react */ \"./node_modules/@chakra-ui/react/dist/esm/index.js\");\n/* harmony import */ var _SurveyPageData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SurveyPageData */ \"./components/survey-components/SurveyPageData.js\");\n\n\n\nvar _jsxFileName = \"/Users/armaandhanoa/Documents/Documents - Armaan\\u2019s Mac mini/Projects/ABET-Spring21/FontNew/ABET_Course_Assessment_Tool/components/survey-components/StudentInfoForm.js\",\n    _this = undefined,\n    _s = $RefreshSig$();\n\n\n\n\nvar types = [\"major\", \"classification\", \"expectedGrade\"];\n\nvar StudentInfoForm = function StudentInfoForm(_ref) {\n  _s();\n\n  var studentInformation = _ref.studentInformation,\n      setStudentInformation = _ref.setStudentInformation;\n  var context = Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useContext\"])(_SurveyPageData__WEBPACK_IMPORTED_MODULE_3__[\"PageContext\"]);\n  var questions = context.studentQuestions;\n\n  var handleChange = function handleChange(e, idx) {\n    var type = [\"major\", \"classification\", \"expectedGrade\"][idx];\n    var temp = studentInformation;\n    temp[type] = e.target.value;\n    setStudentInformation(temp);\n  };\n\n  var renderOptions = function renderOptions(options) {\n    return options.map(function (option, idx) {\n      return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__[\"jsxDEV\"])(\"option\", {\n        value: option,\n        children: option\n      }, idx, false, {\n        fileName: _jsxFileName,\n        lineNumber: 30,\n        columnNumber: 17\n      }, _this);\n    });\n  };\n\n  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__[\"jsxDEV\"])(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], {\n    children: questions.map(function (question, idx) {\n      return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__[\"jsxDEV\"])(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__[\"HStack\"], {\n        w: \"80%\",\n        justify: \"center\",\n        children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__[\"jsxDEV\"])(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__[\"Text\"], {\n          w: \"30%\",\n          fontWeight: \"bold\",\n          children: question\n        }, void 0, false, {\n          fileName: _jsxFileName,\n          lineNumber: 42,\n          columnNumber: 25\n        }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__[\"jsxDEV\"])(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__[\"Select\"], {\n          w: \"70%\",\n          placeholder: \"major\",\n          onChange: function onChange(e) {\n            return handleChange(e, idx);\n          },\n          children: renderOptions(context.majors)\n        }, void 0, false, {\n          fileName: _jsxFileName,\n          lineNumber: 43,\n          columnNumber: 25\n        }, _this)]\n      }, void 0, true, {\n        fileName: _jsxFileName,\n        lineNumber: 41,\n        columnNumber: 21\n      }, _this);\n    })\n  }, void 0, false);\n};\n\n_s(StudentInfoForm, \"b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=\");\n\n_c = StudentInfoForm;\n/* harmony default export */ __webpack_exports__[\"default\"] = (StudentInfoForm);\n\nvar _c;\n\n$RefreshReg$(_c, \"StudentInfoForm\");\n\n;\n    var _a, _b;\n    // Legacy CSS implementations will `eval` browser code in a Node.js context\n    // to extract CSS. For backwards compatibility, we need to check we're in a\n    // browser context before continuing.\n    if (typeof self !== 'undefined' &&\n        // AMP / No-JS mode does not inject these helpers:\n        '$RefreshHelpers$' in self) {\n        var currentExports = module.__proto__.exports;\n        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n        // This cannot happen in MainTemplate because the exports mismatch between\n        // templating and execution.\n        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.i);\n        // A module can be accepted automatically based on its exports, e.g. when\n        // it is a Refresh Boundary.\n        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n            // Save the previous exports on update so we can compare the boundary\n            // signatures.\n            module.hot.dispose(function (data) {\n                data.prevExports = currentExports;\n            });\n            // Unconditionally accept an update to this module, we'll check if it's\n            // still a Refresh Boundary later.\n            module.hot.accept();\n            // This field is set when the previous version of this module was a\n            // Refresh Boundary, letting us know we need to check for invalidation or\n            // enqueue an update.\n            if (prevExports !== null) {\n                // A boundary can become ineligible if its exports are incompatible\n                // with the previous exports.\n                //\n                // For example, if you add/remove/change exports, we'll want to\n                // re-execute the importing modules, and force those components to\n                // re-render. Similarly, if you convert a class component to a\n                // function, we want to invalidate the boundary.\n                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                    module.hot.invalidate();\n                }\n                else {\n                    self.$RefreshHelpers$.scheduleUpdate();\n                }\n            }\n        }\n        else {\n            // Since we just executed the code for the module, it's possible that the\n            // new exports made it ineligible for being a boundary.\n            // We only care about the case when we were _previously_ a boundary,\n            // because we already accepted this update (accidental side effect).\n            var isNoLongerABoundary = prevExports !== null;\n            if (isNoLongerABoundary) {\n                module.hot.invalidate();\n            }\n        }\n    }\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/next/dist/compiled/webpack/harmony-module.js */ \"./node_modules/next/dist/compiled/webpack/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vY29tcG9uZW50cy9zdXJ2ZXktY29tcG9uZW50cy9TdHVkZW50SW5mb0Zvcm0uanM/YjYxOCJdLCJuYW1lcyI6WyJ0eXBlcyIsIlN0dWRlbnRJbmZvRm9ybSIsInN0dWRlbnRJbmZvcm1hdGlvbiIsInNldFN0dWRlbnRJbmZvcm1hdGlvbiIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiUGFnZUNvbnRleHQiLCJxdWVzdGlvbnMiLCJzdHVkZW50UXVlc3Rpb25zIiwiaGFuZGxlQ2hhbmdlIiwiZSIsImlkeCIsInR5cGUiLCJ0ZW1wIiwidGFyZ2V0IiwidmFsdWUiLCJyZW5kZXJPcHRpb25zIiwib3B0aW9ucyIsIm1hcCIsIm9wdGlvbiIsInF1ZXN0aW9uIiwibWFqb3JzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFNQTtBQUVBLElBQU1BLEtBQUssR0FBRyxDQUNWLE9BRFUsRUFFVixnQkFGVSxFQUdWLGVBSFUsQ0FBZDs7QUFNQSxJQUFNQyxlQUFlLEdBQUcsU0FBbEJBLGVBQWtCLE9BQW1EO0FBQUE7O0FBQUEsTUFBaERDLGtCQUFnRCxRQUFoREEsa0JBQWdEO0FBQUEsTUFBNUJDLHFCQUE0QixRQUE1QkEscUJBQTRCO0FBQ3ZFLE1BQU1DLE9BQU8sR0FBR0Msd0RBQVUsQ0FBQ0MsMkRBQUQsQ0FBMUI7QUFDQSxNQUFNQyxTQUFTLEdBQUdILE9BQU8sQ0FBQ0ksZ0JBQTFCOztBQUVBLE1BQU1DLFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQUNDLENBQUQsRUFBSUMsR0FBSixFQUFZO0FBQzdCLFFBQU1DLElBQUksR0FBRyxDQUFDLE9BQUQsRUFBVSxnQkFBVixFQUE0QixlQUE1QixFQUE2Q0QsR0FBN0MsQ0FBYjtBQUNBLFFBQUlFLElBQUksR0FBR1gsa0JBQVg7QUFDQVcsUUFBSSxDQUFDRCxJQUFELENBQUosR0FBYUYsQ0FBQyxDQUFDSSxNQUFGLENBQVNDLEtBQXRCO0FBQ0FaLHlCQUFxQixDQUFDVSxJQUFELENBQXJCO0FBQ0gsR0FMRDs7QUFPQSxNQUFNRyxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLENBQUFDLE9BQU8sRUFBSTtBQUM3QixXQUFPQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxVQUFDQyxNQUFELEVBQVNSLEdBQVQsRUFBaUI7QUFDaEMsMEJBQ0k7QUFBUSxhQUFLLEVBQUVRLE1BQWY7QUFBQSxrQkFDS0E7QUFETCxTQUE0QlIsR0FBNUI7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQURKO0FBS0gsS0FOTSxDQUFQO0FBT0gsR0FSRDs7QUFVQSxzQkFDSTtBQUFBLGNBQ0tKLFNBQVMsQ0FBQ1csR0FBVixDQUFjLFVBQUNFLFFBQUQsRUFBV1QsR0FBWCxFQUFtQjtBQUM5QiwwQkFDSSxxRUFBQyx1REFBRDtBQUFRLFNBQUMsRUFBQyxLQUFWO0FBQWdCLGVBQU8sRUFBQyxRQUF4QjtBQUFBLGdDQUNJLHFFQUFDLHFEQUFEO0FBQU0sV0FBQyxFQUFDLEtBQVI7QUFBYyxvQkFBVSxFQUFDLE1BQXpCO0FBQUEsb0JBQWlDUztBQUFqQztBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQURKLGVBRUkscUVBQUMsdURBQUQ7QUFDSSxXQUFDLEVBQUMsS0FETjtBQUVJLHFCQUFXLEVBQUMsT0FGaEI7QUFHSSxrQkFBUSxFQUFFLGtCQUFDVixDQUFEO0FBQUEsbUJBQ05ELFlBQVksQ0FBQ0MsQ0FBRCxFQUFJQyxHQUFKLENBRE47QUFBQSxXQUhkO0FBQUEsb0JBT0tLLGFBQWEsQ0FBQ1osT0FBTyxDQUFDaUIsTUFBVDtBQVBsQjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUZKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQURKO0FBY0gsS0FmQTtBQURMLG1CQURKO0FBc0VILENBM0ZEOztHQUFNcEIsZTs7S0FBQUEsZTtBQTZGU0EsOEVBQWYiLCJmaWxlIjoiLi9jb21wb25lbnRzL3N1cnZleS1jb21wb25lbnRzL1N0dWRlbnRJbmZvRm9ybS5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICAgIFNlbGVjdCxcbiAgICBUZXh0LFxuICAgIEhTdGFjayxcbn0gZnJvbSBcIkBjaGFrcmEtdWkvcmVhY3RcIjtcblxuaW1wb3J0IHsgUGFnZUNvbnRleHQgfSBmcm9tICcuL1N1cnZleVBhZ2VEYXRhJztcblxuY29uc3QgdHlwZXMgPSBbXG4gICAgXCJtYWpvclwiLFxuICAgIFwiY2xhc3NpZmljYXRpb25cIixcbiAgICBcImV4cGVjdGVkR3JhZGVcIlxuXTtcblxuY29uc3QgU3R1ZGVudEluZm9Gb3JtID0gKHsgc3R1ZGVudEluZm9ybWF0aW9uLCBzZXRTdHVkZW50SW5mb3JtYXRpb24gfSkgPT4ge1xuICAgIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFBhZ2VDb250ZXh0KTtcbiAgICBjb25zdCBxdWVzdGlvbnMgPSBjb250ZXh0LnN0dWRlbnRRdWVzdGlvbnM7XG5cbiAgICBjb25zdCBoYW5kbGVDaGFuZ2UgPSAoZSwgaWR4KSA9PiB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBbXCJtYWpvclwiLCBcImNsYXNzaWZpY2F0aW9uXCIsIFwiZXhwZWN0ZWRHcmFkZVwiXVtpZHhdO1xuICAgICAgICB2YXIgdGVtcCA9IHN0dWRlbnRJbmZvcm1hdGlvbjtcbiAgICAgICAgdGVtcFt0eXBlXSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICBzZXRTdHVkZW50SW5mb3JtYXRpb24odGVtcCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHJlbmRlck9wdGlvbnMgPSBvcHRpb25zID0+IHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWFwKChvcHRpb24sIGlkeCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtvcHRpb259IGtleT17aWR4fT5cbiAgICAgICAgICAgICAgICAgICAge29wdGlvbn1cbiAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDw+XG4gICAgICAgICAgICB7cXVlc3Rpb25zLm1hcCgocXVlc3Rpb24sIGlkeCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDxIU3RhY2sgdz1cIjgwJVwiIGp1c3RpZnk9XCJjZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxUZXh0IHc9XCIzMCVcIiBmb250V2VpZ2h0PVwiYm9sZFwiPntxdWVzdGlvbn08L1RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8U2VsZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdz1cIjcwJVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJtYWpvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVDaGFuZ2UoZSwgaWR4KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cmVuZGVyT3B0aW9ucyhjb250ZXh0Lm1ham9ycyl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L1NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgPC9IU3RhY2s+XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHsvKiA8SFN0YWNrIHc9XCI4MCVcIiBqdXN0aWZ5PVwiY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgPFRleHQgdz1cIjMwJVwiIGZvbnRXZWlnaHQ9XCJib2xkXCI+V2hhdCBpcyB5b3VyIG1ham9yPzwvVGV4dD5cbiAgICAgICAgICAgICAgICA8U2VsZWN0XG4gICAgICAgICAgICAgICAgICAgIHc9XCI3MCVcIlxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIm1ham9yXCJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlQ2hhbmdlKGUsIFwibWFqb3JcIilcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge2NvbnRleHQubWFqb3JzLm1hcCgobWFqb3IsIGlkeCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXttYWpvcn0ga2V5PXtpZHh9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bWFqb3J9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICA8L1NlbGVjdD5cbiAgICAgICAgICAgIDwvSFN0YWNrPlxuXG4gICAgICAgICAgICA8SFN0YWNrIHc9XCI4MCVcIj5cbiAgICAgICAgICAgICAgICA8VGV4dCB3PVwiMzAlXCI+V2hhdCBpcyB5b3VyIGNsYXNzaWZpY2F0aW9uPzwvVGV4dD5cbiAgICAgICAgICAgICAgICA8U2VsZWN0XG4gICAgICAgICAgICAgICAgICAgIHc9XCI3MCVcIlxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImNsYXNzaWZjYXRpb25cIlxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVDaGFuZ2UoZSwgXCJjbGFzc2lmaWNhdGlvblwiKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7Y29udGV4dC55ZWFycy5tYXAoKHllYXIsIGlkeCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxvcHRpb24ga2V5PXtpZHh9Pnt5ZWFyfSA8L29wdGlvbj47XG4gICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIDwvU2VsZWN0PlxuICAgICAgICAgICAgPC9IU3RhY2s+XG5cbiAgICAgICAgICAgIDxIU3RhY2sgdz1cIjgwJVwiIG1iPVwiMmVtXCI+XG4gICAgICAgICAgICAgICAgPFRleHQgdz1cIjMwJVwiPldoYXQgZ3JhZGUgZG8geW91IGV4cGVjdD88L1RleHQ+XG4gICAgICAgICAgICAgICAgPFNlbGVjdFxuICAgICAgICAgICAgICAgICAgICB3PVwiNzAlXCJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJncmFkZVwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUNoYW5nZShlLCBcImV4cGVjdGVkR3JhZGVcIilcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge2NvbnRleHQuZ3JhZGVzLm1hcCgoeWVhciwgaWR4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gPG9wdGlvbiBrZXk9e2lkeH0+e3llYXJ9IDwvb3B0aW9uPjtcbiAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgPC9TZWxlY3Q+XG4gICAgICAgICAgICA8L0hTdGFjaz4gKi99XG4gICAgICAgIDwvPlxuICAgIClcblxufVxuXG5leHBvcnQgZGVmYXVsdCBTdHVkZW50SW5mb0Zvcm07Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./components/survey-components/StudentInfoForm.js\n");

/***/ })

})