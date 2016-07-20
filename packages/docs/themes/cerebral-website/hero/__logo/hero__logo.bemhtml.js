block('hero').elem('logo')(
  replace()({
    block: 'image',
    mix: { block: 'hero', elem: 'logo' },
    url: 'http://cerebraljs.com/cerebral.png'
  })
)
