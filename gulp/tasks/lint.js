const gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: ['*'],
    }),
    path = require('../settings/paths'),
    postcss = require('gulp-postcss'),
    reporter = require('postcss-reporter'),
    syntax_scss = require('postcss-scss'),
    stylelint = require('stylelint')
    argv = require('yargs').argv,
    noop = require('gulp-noop');

let dev = argv.dev === true ? true : false; 
let debug = argv.debug === true ? true : false; 


function cssLint() {

    const stylelintConfig = {
        "rules": {
            "at-rule-empty-line-before": ["always", {
                except: ["blockless-group", "first-nested"],
                ignore: ["after-comment"],
            }],
            "at-rule-name-case": "lower",
            "at-rule-name-space-after": "always-single-line",
            "at-rule-semicolon-newline-after": "always",
            "block-closing-brace-newline-after": "always",
            "block-closing-brace-newline-before": "always-multi-line",
            "block-closing-brace-space-before": "always-single-line",
            "block-no-empty": true,
            "block-opening-brace-newline-after": "always-multi-line",
            "block-opening-brace-space-after": "always-single-line",
            "block-opening-brace-space-before": "always",
            "color-hex-case": "lower",
            "color-hex-length": "short",
            "color-no-invalid-hex": true,
            "comment-empty-line-before": ["always", {
                except: ["first-nested"],
                ignore: ["stylelint-commands"],
            }],
            "comment-whitespace-inside": "always",
            "declaration-bang-space-after": "never",
            "declaration-bang-space-before": "always",
            "declaration-block-no-ignored-properties": true,
            "declaration-block-no-shorthand-property-overrides": true,
            "declaration-block-semicolon-newline-after": "always-multi-line",
            "declaration-block-semicolon-space-after": "always-single-line",
            "declaration-block-semicolon-space-before": "never",
            "declaration-block-single-line-max-declarations": 1,
            "declaration-block-trailing-semicolon": "always",
            "declaration-colon-newline-after": "always-multi-line",
            "declaration-colon-space-after": "always-single-line",
            "declaration-colon-space-before": "never",
            "function-calc-no-unspaced-operator": true,
            "function-comma-newline-after": "always-multi-line",
            "function-comma-space-after": "always-single-line",
            "function-comma-space-before": "never",
            "function-linear-gradient-no-nonstandard-direction": true,
            "function-max-empty-lines": 0,
            "function-name-case": "lower",
            "function-parentheses-newline-inside": "always-multi-line",
            "function-parentheses-space-inside": "never-single-line",
            "function-whitespace-after": "always",
            "indentation": "tab",
            "keyframe-declaration-no-important": true,
            "length-zero-no-unit": true,
            "max-empty-lines": 1,
            "media-feature-colon-space-after": "always",
            "media-feature-colon-space-before": "never",
            "media-feature-no-missing-punctuation": true,
            "media-feature-range-operator-space-after": "always",
            "media-feature-range-operator-space-before": "always",
            "media-query-list-comma-newline-after": "always-multi-line",
            "media-query-list-comma-space-after": "always-single-line",
            "media-query-list-comma-space-before": "never",
            "media-query-parentheses-space-inside": "never",
            "no-eol-whitespace": true,
            "no-extra-semicolons": true,
            "no-invalid-double-slash-comments": true,
            "no-missing-eof-newline": true,
            "number-leading-zero": "never",
            "number-no-trailing-zeros": true,
            "property-case": "lower",
            "rule-non-nested-empty-line-before": ["always-multi-line", {
                ignore: ["after-comment"],
            }],
            "selector-attribute-brackets-space-inside": "never",
            "selector-attribute-operator-space-after": "never",
            "selector-attribute-operator-space-before": "never",
            "selector-combinator-space-after": "always",
            "selector-combinator-space-before": "always",
            "selector-list-comma-newline-after": "always",
            "selector-list-comma-space-before": "never",
            "selector-max-empty-lines": 0,
            "selector-pseudo-class-case": "lower",
            "selector-pseudo-class-no-unknown": true,
            "selector-pseudo-class-parentheses-space-inside": "never",
            "selector-pseudo-element-case": "lower",
            "selector-pseudo-element-colon-notation": "double",
            "selector-pseudo-element-no-unknown": true,
            "selector-type-case": "lower",
            "selector-type-no-unknown": true,
            "shorthand-property-no-redundant-values": true,
            "string-no-newline": true,
            "unit-case": "lower",
            "unit-no-unknown": true,
            "value-list-comma-newline-after": "always-multi-line",
            "value-list-comma-space-after": "always-single-line",
            "value-list-comma-space-before": "never",
        },
    }

    const processors = [
        stylelint(stylelintConfig),
        // Pretty reporting config
        reporter({
            clearMessages: true,
            throwError: false
        })
    ];

    return gulp.src([
		path.to.sass.files,
		// EXCLUDE ANY FILES FROM BEING LINTED
        // '!' + path.to.sass.source + '/grid/**/**.*',
        // '!' + path.to.sass.source + '/**/normalize/**/**.*',
    ])
        .pipe(plugins.duration('Lint SASS Task'))
        .pipe(dev ? postcss(processors, { syntax: syntax_scss }) : noop());
}
exports.cssLint = cssLint;
