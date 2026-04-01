<template>
	<Transition name="toast">
		<div v-if="toast" class="toast-notification" :class="`toast-${toastType}`">
			<div class="toast-icon">
				<span v-if="toastType === 'success'">✓</span>
				<span v-else-if="toastType === 'error'">✕</span>
				<span v-else-if="toastType === 'warning'">⚠</span>
				<span v-else>ℹ</span>
			</div>
			<div class="toast-content">
				<p class="toast-message">{{ toastMessage }}</p>
			</div>
			<button @click="toast = null" class="toast-close">✕</button>
		</div>
	</Transition>
</template>

<script setup>
import { useToast } from '@/composables/useToast'

const { toast, toastMessage, toastType } = useToast()
</script>

<style scoped>
.toast-notification {
	position: fixed;
	top: 80px;
	right: 24px;
	min-width: 320px;
	max-width: 420px;
	background: white;
	border-radius: 12px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 16px 20px;
	z-index: 10000;
	animation: slideIn 0.3s ease;
}

.toast-notification.toast-success {
	border-left: 4px solid #10b981;
}

.toast-notification.toast-error {
	border-left: 4px solid #ef4444;
}

.toast-notification.toast-warning {
	border-left: 4px solid #f59e0b;
}

.toast-notification.toast-info {
	border-left: 4px solid #3b82f6;
}

.toast-icon {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	font-weight: bold;
	flex-shrink: 0;
}

.toast-success .toast-icon {
	background: #d1fae5;
	color: #10b981;
}

.toast-error .toast-icon {
	background: #fee2e2;
	color: #ef4444;
}

.toast-warning .toast-icon {
	background: #fef3c7;
	color: #f59e0b;
}

.toast-info .toast-icon {
	background: #dbeafe;
	color: #3b82f6;
}

.toast-content {
	flex: 1;
}

.toast-message {
	font-size: 15px;
	color: #1f2937;
	line-height: 1.5;
	margin: 0;
}

.toast-close {
	width: 24px;
	height: 24px;
	border: none;
	background: transparent;
	color: #9ca3af;
	font-size: 16px;
	cursor: pointer;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
	flex-shrink: 0;
}

.toast-close:hover {
	background: #f3f4f6;
	color: #4b5563;
}

/* 动画 */
.toast-enter-active,
.toast-leave-active {
	transition: all 0.3s ease;
}

.toast-enter-from {
	transform: translateX(100%);
	opacity: 0;
}

.toast-leave-to {
	transform: translateX(100%);
	opacity: 0;
}

@keyframes slideIn {
	from {
		transform: translateX(100%);
		opacity: 0;
	}
	to {
		transform: translateX(0);
		opacity: 1;
	}
}

/* 响应式 */
@media (max-width: 768px) {
	.toast-notification {
		right: 16px;
		left: 16px;
		min-width: auto;
		max-width: none;
	}
}
</style>
