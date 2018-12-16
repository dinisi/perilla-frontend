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
  return (await Swal({
    type,
    title: i18n.t(title).toString(),
    text,
    input,
    allowEscapeKey: !permanent,
    allowOutsideClick: !permanent
  })).value
}
