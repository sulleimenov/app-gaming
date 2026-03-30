<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps(['user']);
const emit = defineEmits(['refresh']);

const isSubmitting = ref(false);
const showSuccess = ref(false);

// Проверяем при загрузке, был ли уже выполнен аудит (через props или localStorage)
onMounted(() => {
	if (
		props.user?.evaluated
		// props.user?.evaluated ||
		// localStorage.getItem(`audit_done_${props.user?.id}`)
	) {
		showSuccess.value = true;
	}
});

const checklist = ref([
	// Задание 1
	{
		id: 1,
		task: 1,
		text: 'Установил плагин News & Newsletter в админ панель',
		checked: false,
		points: 1,
	},
	{
		id: 2,
		task: 1,
		text: 'Активировал плагин News & Newsletter в админ панель',
		checked: false,
		points: 1,
	},

	// Задание 2
	{
		id: 3,
		task: 2,
		text: 'Добавил 1 уникальную новость в админ панели',
		checked: false,
		points: 1,
	},
	{
		id: 4,
		task: 2,
		text: 'Настроил параметры публикации (даты, категории)',
		checked: false,
		points: 1,
	},
	{
		id: 5,
		task: 2,
		text: 'Текстовое содержание поста сгенерировано с помощью ИИ',
		checked: false,
		points: 2,
	},
	{
		id: 6,
		task: 2,
		text: 'Заголовок поста соответствует содержанию новости',
		checked: false,
		points: 1,
	},
	{
		id: 7,
		task: 2,
		text: 'Подобрал качественное изображение (не размыто, четко)',
		checked: false,
		points: 1,
	},
	{
		id: 8,
		task: 2,
		text: 'Контент структурирован (абзацы, заголовки)',
		checked: false,
		points: 1,
	},
	{
		id: 9,
		task: 2,
		text: 'Креативность в оформлении контента',
		checked: false,
		points: 1,
	},

	// Задание 3
	{
		id: 10,
		task: 3,
		text: 'Добавил компонент News & Newsletter на страницу',
		checked: false,
		points: 2,
	},
	{
		id: 11,
		task: 3,
		text: 'На клиенте новость отображается списком или сеткой',
		checked: false,
		points: 2,
	},
	{
		id: 12,
		task: 3,
		text: 'Реализовал переход на детальную страницу новости',
		checked: false,
		points: 3,
	},
	{
		id: 13,
		task: 3,
		text: 'На детальной странице корректно выводится новость',
		checked: false,
		points: 2,
	},
	{
		id: 14,
		task: 3,
		text: 'Валидность медиа-данных (картинки, тексты, даты)',
		checked: false,
		points: 1,
	},
]);

const totalPoints = computed(() =>
	checklist.value
		.filter((c) => c.checked)
		.reduce((sum, c) => sum + c.points, 0),
);

const submitAudit = async () => {
	if (isSubmitting.value) return;

	if (
		!confirm(
			`Зафиксировать ${totalPoints.value * 5} баллов для ${props.user.firstName} и ${props.user.secondName}? После этого изменения будут невозможны.`,
		)
	)
		return;

	isSubmitting.value = true;

	try {
		const res = await fetch(
			`https://69c60516f272266f3eabc8e6.mockapi.io/users/${props.user.id}`,
			{
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...props.user,
					points: totalPoints.value * 5,
					scores: totalPoints.value * 5,
					evaluated: true,
				}),
			},
		);

		if (res.ok) {
			// Сохраняем локально, чтобы при перезагрузке экран успеха не исчез
			// localStorage.setItem(`audit_done_${props.user.id}`, 'true');
			showSuccess.value = true;
			emit('refresh');
		}
	} catch (e) {
		alert('Ошибка связи с сервером');
	} finally {
		isSubmitting.value = false;
	}
};
</script>

<template>
	<div class="max-w-3xl mx-auto pb-20">
		<div
			v-if="!showSuccess"
			class="bg-white/5 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
		>
			<div
				class="p-8 bg-gradient-to-r from-orange-600/20 to-transparent border-b border-white/10"
			>
				<h2
					class="text-2xl font-black text-white text-center uppercase tracking-tighter"
				>
					<span class="text-orange-500"
						>{{ user.firstName }} и {{ user.secondName }}</span
					>
				</h2>
			</div>

			<div class="p-6 space-y-8 overflow-y-auto max-h-[60vh] custom-scroll">
				<div v-for="taskNum in [1, 2, 3]" :key="taskNum" class="space-y-3">
					<div class="flex items-center gap-3 px-2">
						<span
							class="text-[14px] font-black text-orange-500 uppercase tracking-[0.3em]"
							>Задание №{{ taskNum }}</span
						>
						<div class="h-px bg-white/10 flex-grow"></div>
					</div>

					<label
						v-for="item in checklist.filter((c) => c.task === taskNum)"
						:key="item.id"
						class="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-orange-500/30 transition-all group"
					>
						<div class="relative flex items-center justify-center">
							<input
								type="checkbox"
								v-model="item.checked"
								class="peer appearance-none w-5 h-5 border-2 border-white/10 rounded-lg checked:bg-orange-600 checked:border-orange-600 transition-all"
							/>
							<span
								class="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-[10px]"
								>✓</span
							>
						</div>
						<span
							class="flex-grow text-sm text-slate-400 group-hover:text-white transition-colors"
							>{{ item.text }}</span
						>
						<span class="text-orange-500 font-mono font-bold text-xs"
							>+{{ item.points }}</span
						>
					</label>
				</div>
			</div>

			<div class="p-8 bg-black/40 border-t border-white/10">
				<div class="flex justify-between items-center mb-6 px-2">
					<div class="flex flex-col">
						<span
							class="text-[10px] font-black text-slate-500 uppercase tracking-widest"
							>Итого</span
						>
						<span class="text-[10px] text-orange-500/50 uppercase font-bold"
							>Protocol Active</span
						>
					</div>
					<div class="text-4xl font-black text-white tabular-nums">
						{{ totalPoints }}
					</div>
				</div>

				<button
					@click="submitAudit"
					:disabled="isSubmitting"
					class="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.4em] transition-all shadow-xl shadow-orange-900/40 active:scale-[0.98]"
				>
					{{ isSubmitting ? 'Запись данных...' : 'Зафиксировать результат' }}
				</button>
			</div>
		</div>

		<div
			v-else
			class="bg-white/5 border border-white/10 rounded-[2.5rem] p-20 text-center animate-in zoom-in duration-500 shadow-2xl"
		>
			<div
				class="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 border border-green-500/20 shadow-[0_0_50px_rgba(34,197,94,0.1)]"
			>
				✓
			</div>
			<h2
				class="text-3xl font-black text-white uppercase tracking-tighter mb-4"
			>
				Баллы выставлены
			</h2>
			<p class="text-slate-500 text-sm mb-10 max-w-xs mx-auto italic">
				Система успешно сохранила результаты <br />
			</p>
			<div
				class="text-[10px] text-orange-500 uppercase font-black tracking-widest opacity-50"
			>
				Доступ к изменению заблокирован
			</div>
		</div>
	</div>
</template>

<style scoped>
.custom-scroll::-webkit-scrollbar {
	width: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
	background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
	background: rgba(249, 115, 22, 0.2);
	border-radius: 10px;
}
</style>
