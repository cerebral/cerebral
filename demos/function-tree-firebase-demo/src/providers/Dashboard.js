const dashboard = require('../dashboard')

function DashboardProvider () {
  return (context) => {
    context.dashboard = {
      log (taskId, message, error) {
        dashboard.log({
          taskId,
          message,
          error
        })
      }
    }

    return context
  }
}

module.exports = DashboardProvider
