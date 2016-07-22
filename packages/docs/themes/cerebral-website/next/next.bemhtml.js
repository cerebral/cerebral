block('next')(
  content()(function () {
    var meta

    var urlParts = this.ctx.url.split('/')

    try {
      if (urlParts.length === 2) {
        meta = this._layouts[this._layout][urlParts[1].replace('.html', '')].meta
      } else {
        meta = this._layouts[urlParts[1]][urlParts[2].replace('.html', '')].meta
      }
    } catch (e) {
      console.log('failed to find meta for ' + this.ctx.url)
      meta = {}
    }

    return {
      block: 'link',
      mods: { theme: 'islands', size: 'xl' },
      url: this.ctx.url,
      content: [
        { block: 'next', elem: 'label', content: 'Next' },
        { block: 'next', elem: 'title', content: meta && meta.title }
      ] 
    }
  })
)
