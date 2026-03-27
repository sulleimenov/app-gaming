<script setup>
import { ref, onMounted, computed } from 'vue';

const props = defineProps(['user']);
const emit = defineEmits(['refresh']);

const API_URL = 'https://69c60516f272266f3eabc8e6.mockapi.io/users';

const allUsers = ref([]);
const selectedStudentId = ref('');
const isSubmitting = ref(false);
const showSuccess = ref(false);

// Критерии
const criteria = ref([
	{ id: 1, text: 'Чистота кода', checked: false, reward: 10 },
	{ id: 2, text: 'Логика роутинга', checked: false, reward: 15 },
	{ id: 3, text: 'Дизайн интерфейса', checked: false, reward: 5 },
]);

// Список студентов, которых МОЖНО оценить (не я и еще не оценены мной)
const availableStudents = computed(() => {
	return allUsers.value.filter((u) => {
		const isNotMe = u.id !== props.user.id;
		const notEvaluatedByMe = !u.evaluatedBy?.includes(props.user.id);
		return isNotMe && notEvaluatedByMe;
	});
});

const loadUsers = async () => {
	try {
		const res = await fetch(API_URL);
		allUsers.value = await res.json();
	} catch (e) {
		console.error('Ошибка загрузки');
	}
};

onMounted(loadUsers);

const submitGrade = async () => {
	const target = allUsers.value.find((u) => u.id === selectedStudentId.value);
	if (!target || isSubmitting.value) return;

	isSubmitting.value = true;
	const earnedPoints = criteria.value
		.filter((c) => c.checked)
		.reduce((s, c) => s + c.reward, 0);

	try {
		// Обновляем студента: добавляем баллы и записываем мой ID в список оценивших
		await fetch(`${API_URL}/${target.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				...target,
				points: Number(target.points) + earnedPoints,
				evaluatedBy: [...(target.evaluatedBy || []), props.user.id],
			}),
		});

		// Начисляем бонус себе
		await fetch(`${API_URL}/${props.user.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				...props.user,
				points: Number(props.user.points) + 5,
			}),
		});

		showSuccess.value = true;
		emit('refresh');
		await loadUsers(); // Обновляем локальный список
	} catch (e) {
		alert('Ошибка связи с сервером');
	} finally {
		isSubmitting.value = false;
	}
};
</script>

<template>
	<div class="page-container">
		<div v-if="!showSuccess" class="max-w-4xl mx-auto space-y-6">
			<div class="bg-white/5 border border-white/10 p-6 rounded-3xl">
				<label
					class="block text-[10px] uppercase font-black text-orange-500 mb-4 tracking-widest"
				>
					Выберите курсанта для аудита
				</label>
				<select
					v-model="selectedStudentId"
					class="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-orange-500 appearance-none cursor-pointer"
				>
					<option value="" disabled>-- Список доступных объектов --</option>
					<option v-for="s in availableStudents" :key="s.id" :value="s.id">
						{{ s.lastName }} {{ s.firstName }} (ID: {{ s.id }})
					</option>
				</select>
				<p
					v-if="availableStudents.length === 0"
					class="text-[10px] text-slate-500 mt-4 italic"
				>
					Все доступные объекты уже прошли вашу проверку.
				</p>
			</div>

			<div
				v-if="selectedStudentId"
				class="bg-white/5 border border-white/10 p-8 rounded-3xl animate-in slide-in-from-bottom-4 duration-300"
			>
				<h3 class="text-white font-bold mb-6">Протокол проверки</h3>

				<div class="grid gap-3 mb-8">
					<label
						v-for="c in criteria"
						:key="c.id"
						class="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all"
					>
						<input
							type="checkbox"
							v-model="c.checked"
							class="w-5 h-5 accent-orange-500"
						/>
						<span class="flex-grow text-sm">{{ c.text }}</span>
						<span class="text-orange-500 font-mono text-xs"
							>+{{ c.reward }}</span
						>
					</label>
				</div>

				<button
					@click="submitGrade"
					:disabled="isSubmitting"
					class="w-full bg-orange-600 p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 transition-all shadow-xl shadow-orange-900/20"
				>
					{{
						isSubmitting ? 'Запись в базу...' : 'Подтвердить и отправить баллы'
					}}
				</button>
			</div>
		</div>

		<div
			v-else
			class="text-center py-20 bg-white/5 border border-white/10 rounded-3xl max-w-lg mx-auto"
		>
			<div class="text-5xl mb-6">🚀</div>
			<h2 class="text-xl text-white font-bold mb-4">Данные синхронизированы</h2>
			<button
				@click="
					showSuccess = false;
					selectedStudentId = '';
				"
				class="border border-orange-500 text-orange-500 px-10 py-3 rounded-xl font-bold uppercase text-[10px] hover:bg-orange-500 hover:text-white transition-all"
			>
				Вернуться к списку
			</button>
		</div>
	</div>
</template>
