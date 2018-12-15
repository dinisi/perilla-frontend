import Swal from 'sweetalert2'
import i18n from '@/i18n'

export const showToast = (type: 'success' | 'error' | 'warning' | 'info' | 'question', title: string, text: string) => {
  Swal({
    position: 'bottom-end',
    type,
    title: i18n.t(title).toString(),
    text,
    showConfirmButton: false,
    timer: 3000,
    toast: true
  })
}
