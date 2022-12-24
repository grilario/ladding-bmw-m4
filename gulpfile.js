import gulp from "gulp";
import postcss from "gulp-postcss";
import gulpSass from "gulp-sass";
import htmlmin from "gulp-htmlmin";
import imagemin from "gulp-imagemin";

import sassCompiler from "sass";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import normalize from "postcss-normalize";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminOptipng from "imagemin-optipng";
import imageminSvgo from "imagemin-svgo";

const sass = gulpSass(sassCompiler);

gulp.task("css", function () {
  const plugins = [
    autoprefixer(),
    cssnano(),
    normalize({
      forceImport: "normalize.css",
    }),
  ];
  return gulp
    .src("./src/assets/styles/*.scss")
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(gulp.dest("./dist/assets/styles"));
});

gulp.task("html", () => {
  return gulp
    .src("src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist"));
});

gulp.task("image", () => {
  return gulp
    .src("src/assets/images/*")
    .pipe(
      imagemin([
        imageminMozjpeg({ quality: 75, progressive: true }),
        imageminOptipng({ optimizationLevel: 5 }),
        imageminSvgo({
          plugins: [
            {
              name: "removeViewBox",
              active: true,
            },
            {
              name: "cleanupIDs",
              active: false,
            },
          ],
        }),
      ])
    )
    .pipe(gulp.dest("dist/assets/images"));
});

gulp.task("favicon", () => {
  return gulp.src("src/favicon.ico").pipe(gulp.dest("dist"));
});

gulp.task("public", () => {
  return gulp.src("src/public/*").pipe(gulp.dest("dist/public"))
})

export default function () {
  gulp.watch("src/assets/styles/*.scss", gulp.task("css"));
  gulp.watch("src/*.html", gulp.task("html"));
  gulp.watch("src/assets/images/*", gulp.task("image"));
  gulp.watch("src/public/*", gulp.task("public"));
}

export const build = gulp.parallel("css", "html", "image", "favicon", "public");
