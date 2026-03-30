<script setup>
import { ref, computed } from 'vue';

const props = defineProps(['user']);
const emit = defineEmits(['refresh']);

const isSubmitting = ref(false);
const showSuccess = ref(false);

// Варианты состояний
const moods = [
	{ p: 1, emoji: '😩', label: 'Очень тяжело' },
	{ p: 2, emoji: '🤨', label: 'Сложновато' },
	{ p: 3, emoji: '😐', label: 'Нормально' },
	{ p: 4, emoji: '🙂', label: 'Интересно' },
	{ p: 5, emoji: '🤩', label: 'Супер!' },
];

const selectedMood = ref(3); // По умолчанию "Нормально"
const comment = ref('');

// Расчет ранга на основе баллов из props.user
const rank = computed(() => {
	const p = props.user.points || 0;
	if (p >= 90) return { title: 'Отлично', color: 'text-green-500', icon: '🏆' };
	if (p >= 70) return { title: 'Хорошо', color: 'text-blue-400', icon: '⚔️' };
	if (p >= 50)
		return { title: 'Удовлетворительно', color: 'text-orange-400', icon: '⚔️' };
	return { title: 'Плохо', color: 'text-red-400', icon: '🛡️' };
});

const submitReflection = async () => {
	isSubmitting.value = true;
	try {
		await fetch(
			`https://69c60516f272266f3eabc8e6.mockapi.io/users/${props.user.id}`,
			{
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...props.user,
					mood: selectedMood.value,
					feedback: comment.value,
					completedAt: new Date().toISOString(),
				}),
			},
		);
		showSuccess.value = true;
		emit('refresh');
	} catch (e) {
		alert('Ошибка системы связи');
	} finally {
		isSubmitting.value = false;
	}
};
</script>
<template>
	<div class="max-w-2xl mx-auto pb-20 px-4">
		<div
			v-if="!showSuccess"
			class="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl animate-in fade-in duration-500"
		>
			<div class="text-center mb-12">
				<span
					class="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em]"
					>Рефлексия</span
				>
				<h2
					class="text-3xl font-black text-white uppercase tracking-tighter mt-2"
				>
					Как прошел урок?
				</h2>
				<p
					class="text-slate-500 text-[10px] uppercase mt-1 italic tracking-widest"
				>
					{{ user.firstName }} & {{ user.secondName }}
				</p>
			</div>

			<div class="grid grid-cols-5 gap-3 mb-12">
				<button
					v-for="mood in moods"
					:key="mood.p"
					@click="selectedMood = mood.p"
					class="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300"
					:class="
						selectedMood === mood.p
							? 'bg-orange-600/20 border-orange-500 scale-105 shadow-[0_0_20px_rgba(249,115,22,0.2)]'
							: 'bg-white/5 border-transparent opacity-40 hover:opacity-100'
					"
				>
					<span class="text-3xl md:text-4xl">{{ mood.emoji }}</span>
					<span
						class="text-[8px] font-black uppercase text-center leading-none tracking-tighter text-white"
					>
						{{ mood.label }}
					</span>
				</button>
			</div>

			<div class="space-y-3 mb-10">
				<textarea
					v-model="comment"
					placeholder="Есть что добавить экипажу?"
					class="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm text-white outline-none focus:border-orange-600/50 transition-all resize-none h-28"
				></textarea>
			</div>

			<button
				@click="submitReflection"
				:disabled="isSubmitting"
				class="w-full bg-orange-600 hover:bg-orange-500 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.4em] transition-all shadow-xl shadow-orange-900/40 active:scale-95"
			>
				{{ isSubmitting ? 'Передача данных...' : 'Завершить урок' }}
			</button>
		</div>

		<div v-else class="animate-in zoom-in-95 duration-700">
			<div
				class="bg-white/5 border border-white/10 rounded-[3rem] p-10 text-center relative overflow-hidden"
			>
				<div
					class="absolute -top-24 -right-24 w-48 h-48 bg-orange-600/10 blur-[80px] rounded-full"
				></div>

				<div class="relative z-10">
					<div class="text-7xl mb-6">{{ rank.icon }}</div>

					<h2
						class="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] mb-2"
					>
						Миссия завершена
					</h2>
					<h1
						class="text-5xl font-black text-white uppercase tracking-tighter italic mb-8"
					>
						Результат
					</h1>

					<div class="grid grid-cols-2 gap-4 mb-10">
						<div class="bg-black/40 border border-white/5 p-6 rounded-3xl">
							<div class="text-[9px] uppercase text-slate-500 font-bold mb-1">
								Ваша оценка
							</div>
							<div
								class="text-lg font-black tracking-widest"
								:class="rank.color"
							>
								{{ rank.title }}
							</div>
						</div>
						<div class="bg-black/40 border border-white/5 p-6 rounded-3xl">
							<div class="text-[9px] uppercase text-slate-500 font-bold mb-1">
								Баллы
							</div>
							<div class="text-2xl font-black text-white tracking-tighter">
								{{ user.points }}
							</div>
						</div>
					</div>

					<div class="p-6 border-t border-white/5">
						<p
							class="text-slate-500 text-[10px] uppercase tracking-widest leading-relaxed"
						>
							Отличная работа, <br />
							<span class="text-white font-bold">{{ user.firstName }}</span> и
							<span class="text-white font-bold">{{ user.secondName }}</span
							>. <br />
							Система сохранила ваш прогресс.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
