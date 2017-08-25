function resetObject(form) {
  return Object.keys(form).reduce(function(newForm, key) {
    if (form[key] === Object(form[key])) {
      if (Array.isArray(form[key])) {
        newForm[key] = resetArray(form[key])
      } else if ('value' in form[key]) {
        newForm[key] = Object.assign({}, form[key], {
          value: form[key].hasOwnProperty('defaultValue')
            ? form[key].defaultValue
            : '',
          isPristine: true,
        })
      } else {
        newForm[key] = resetObject(form[key])
      }
    }

    return newForm
  }, {})
}

function resetArray(formArray) {
  return formArray.reduce((newFormArray, form, index) => {
    newFormArray[index] = resetObject(form)
    return newFormArray
  }, [])
}

export default function resetForm(form) {
  return resetObject(form)
}
