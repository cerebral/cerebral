export default function Container (controller) {
  return {
    provide: {
      cerebral_controller: controller
    },
    template: `<div><slot></slot></div>`
  }
}
