block('tabs').elem('tab').match(function () { return this.position === 2 })(
  def()(function () {
    return applyCtx(this.extend(this.ctx, { elemMods: { active: true } }))
  })
)
