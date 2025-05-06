const { src, dest, series, watch } = require(`gulp`),
    //dev tasks
    htmlValidator = require(`gulp-html`),
    browserSync = require(`browser-sync`),
    reload = browserSync.reload,
    CSSValidator = require(`gulp-stylelint`),
    JSValidator = require(`gulp-eslint`),
    JSTranspiler = require(`gulp-babel`),
    //prod tasks
    htmlCompressor = require(`gulp-htmlmin`),
    CSSCompressor = require(`gulp-clean-css`),
    JSCompressor = require(`gulp-uglify`);

let browserChoice = `default`;

let validateHTML = () => {
    return src([`app/html/*.html`])
        .pipe(htmlValidator(undefined));
};

let validateCSS = () => {
    return src(`app/css/*.css`)
        .pipe(CSSValidator({
            failAfterError: false,
            reporters: [
                {formatter: `string`, console: true}
            ]
        }));
};

let validateJS = () => {
    return src(`app/js/*.js`)
        .pipe(JSValidator())
        .pipe(JSValidator.formatEach(`compact`));
};

let transpileJSForDev = () => {
    return src(`app/js/*.js`)
        .pipe(JSTranspiler())
        .pipe(dest(`temp/app/js`));
};

let transpileJSForProd = () => {
    return src(`app/js/*.js`)
        .pipe(JSTranspiler())
        .pipe(JSCompressor())
        .pipe(dest(`prod/app/js`));
};

let compressHTML = ()=> {
    return src(`app/html/*.html`)
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod/app/html`));

};

let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 50,
        browser: browserChoice,
        server: {
            baseDir: [
                'app'
            ]
        },
        startPath: '/html/index.html'
    });

    watch(`app/js/*.js`, validateJS)
        .on(`change`, () => reload());
    watch(`app/css/*.css`, validateCSS)
        .on(`change`, () => reload());
    watch(`app/html/*.html`, validateHTML)
        .on(`change`, () => reload());
};

let compressCSS = () => {
    return src(`app/css/*.css`)
        .pipe(CSSCompressor())
        .pipe(dest(`prod/app/css`));
};

let compressJS = () => {
    return src(`app/js/*.js`)
        .pipe(JSTranspiler())
        .pipe(JSCompressor())
        .pipe(dest(`prod/app/js`));
};

exports.validateHTML = validateHTML;
exports.validateCSS = validateCSS;
exports.validateJS = validateJS;
exports.transpileJSForDev = transpileJSForDev;

exports.compressHTML = compressHTML;
exports.compressCSS = compressCSS;
exports.compressJS = compressJS;
exports.transpileJSForProd = transpileJSForProd

exports.default = series(
    validateHTML,
    validateCSS,
    validateJS,
    transpileJSForDev,
    serve
);
exports.build = series(
    compressHTML,
    compressCSS,
    compressJS
);
