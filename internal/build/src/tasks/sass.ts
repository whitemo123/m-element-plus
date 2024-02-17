import { src, dest } from 'gulp'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import autoprefixer from 'gulp-autoprefixer'
import { pkgRoot, mepOutput } from '../constant'

export const buildSass = async () => {
  const sass = gulpSass(dartSass)
  return src(`${pkgRoot}/components/**/src/**/style/**.scss`)
    .pipe(sass.sync())
    .pipe(autoprefixer())
    .pipe(dest(`${mepOutput}/lib/src`))
    .pipe(dest(`${mepOutput}/es/src`))
}
