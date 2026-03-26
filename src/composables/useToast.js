import { ref } from 'vue'

const toast = ref(null)
const toastMessage = ref('')
const toastType = ref('success')
let toastTimer = null

export function useToast() {
	const showToast = (message, type = 'success', duration = 3000) => {
		// 清除之前的定时器
		if (toastTimer) {
			clearTimeout(toastTimer)
		}

		toastMessage.value = message
		toastType.value = type
		toast.value = true

		// 自动隐藏
		toastTimer = setTimeout(() => {
			toast.value = null
		}, duration)
	}

	const success = (message) => showToast(message, 'success')
	const error = (message) => showToast(message, 'error')
	const warning = (message) => showToast(message, 'warning')
	const info = (message) => showToast(message, 'info')

	return {
		toast,
		toastMessage,
		toastType,
		showToast,
		success,
		error,
		warning,
		info
	}
}
