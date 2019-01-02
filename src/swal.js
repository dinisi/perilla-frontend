import Swal from 'sweetalert2'
import * as iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.css'
import i18n from '@/i18n'

export const showToast = (type, title, message) => {
  iziToast[type]({
    title: i18n.t(title).toString(),
    message: message || ''
  })
}

export const showDialog = async (type, title, text, permanent, input) => {
  const option = {
    type,
    title: i18n.t(title).toString(),
    text,
    allowEscapeKey: !permanent,
    allowOutsideClick: !permanent
  }
  if (input) {
    option.input = input
  }
  return (await Swal(option)).value
}
