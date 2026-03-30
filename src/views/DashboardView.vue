<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps(['user']);
const users = ref([]);
const isLoading = ref(true);

const API_URL = 'https://69c60516f272266f3eabc8e6.mockapi.io/users';

const shopItems = [
	{ id: '1', name: 'Костюм космонавта', icon: 'suit-1', category: 'clothing' },
	{ id: '2', name: 'Шлем космонавта', icon: 'hat-1', category: 'hats' },
	{
		id: '3',
		name: 'Сборная Казахстана',
		icon: 'suit-football-1',
		category: 'clothing',
	},
];

const moodMap = {
	1: { emoji: '😩', label: 'Тяжело' },
	2: { emoji: '🤨', label: 'Сложно' },
	3: { emoji: '😐', label: 'Норм' },
	4: { emoji: '🙂', label: 'Ок' },
	5: { emoji: '🤩', label: 'Топ' },
};

const getItemStyle = (id) => {
	const styles = {};
	return styles[id] || '';
};

const fetchResults = async () => {
	try {
		const res = await fetch(API_URL);
		const data = await res.json();
		users.value = data.sort((a, b) => (b.points || 0) - (a.points || 0));
	} catch (e) {
		console.error('Ошибка сети');
	} finally {
		isLoading.value = false;
	}
};

const getGlowColor = (index) => {
	const colors = [
		'rgba(249, 115, 22, 0.4)', // 1 место: Оранжевый/Золотой
		'rgba(59, 130, 246, 0.4)', // 2 место: Синий
		'rgba(168, 85, 247, 0.4)', // 3 место: Фиолетовый
		'rgba(34, 197, 94, 0.4)', // 4 место: Зеленый
		'rgba(236, 72, 153, 0.4)', // Остальные: Розовый
	];
	return colors[index] || colors[4];
};

const showPoints = ref(false);

onMounted(() => {
	// Через 5 секунд текст "Мои баллы..." сменится на число
	setTimeout(() => {
		showPoints.value = true;
	}, 5000);
});

onMounted(fetchResults);
</script>

<template>
	<div class="mx-auto pb-40 px-4 bg-transparent min-h-screen">
		<!-- <div class="text-center py-20">
			<h1
				class="text-5xl font-black text-white uppercase tracking-tighter italic"
			>
				Ваши достижения
			</h1>
			<div class="h-1 w-20 bg-orange-600 mx-auto mt-4"></div>
		</div> -->

		<div
			v-if="isLoading"
			class="text-center py-20 text-orange-500 font-black animate-pulse uppercase tracking-[0.3em]"
		>
			Подключение к нейросети...
		</div>

		<div
			v-else
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-32 gap-x-10 mt-40"
		>
			<div
				v-for="team in users"
				:key="team.id"
				class="relative group flex flex-col items-center"
			>
				<div class="absolute bottom-55 right-35 text-[50px]">
					{{ moodMap[team.mood]?.emoji || '😶' }}
				</div>

				<div
					class="absolute right-31 top-15 z-60 text-center w-32 translate-x-1/2"
				>
					<transition name="fade-slide" mode="out-in">
						<div
							v-if="!showPoints"
							key="text"
							class="text-[12px] pt-2 text-center font-black text-orange-500 uppercase tracking-widest animate-pulse"
						>
							{{ team.feedback || '...' }}
						</div>

						<div
							v-else
							key="points"
							class="text-[45px] font-bold text-orange-600 leading-none drop-shadow-[0_0_15px_rgba(234,88,12,0.4)] italic"
						>
							{{ team.scores }}
						</div>
					</transition>
				</div>

				<div class="absolute right-15 top-6">
					<img src="/thoughts.svg" alt="" width="150" />
				</div>

				<div
					class="relative w-72 h-96 flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
				>
					<div
						class="absolute inset-0 rounded-full blur-[80px] transition-opacity duration-700 pointer-events-none"
						:style="{ backgroundColor: getGlowColor(index) }"
					></div>

					<div
						class="absolute w-40 h-60 rounded-full blur-[40px] opacity-30 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none"
						:style="{ backgroundColor: getGlowColor(index) }"
					></div>

					<img
						src="/bars.svg"
						alt="Base"
						class="absolute w-full h-auto opacity-90 z-10"
					/>

					<img
						v-for="itemId in team.inventory || []"
						:key="itemId"
						:src="`/${shopItems.find((i) => i.id === itemId.toString())?.icon}.svg`"
						class="absolute w-full h-auto z-20"
						:class="getItemStyle(itemId.toString())"
					/>

					<div
						class="absolute bottom-0 w-32 h-4 blur-xl rounded-full transition-opacity z-0"
						:style="{ backgroundColor: getGlowColor(index) }"
					></div>
				</div>

				<div class="mt-8 text-center">
					<div class="flex items-center justify-center gap-2">
						<span
							class="text-white font-black uppercase tracking-widest text-xl"
							>{{ team.firstName }}</span
						>
						<span class="text-orange-600 font-black">&</span>
						<span
							class="text-white font-black uppercase tracking-widest text-xl"
							>{{ team.secondName }}</span
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Анимация плавного появления */
.grid {
	animation: fade-in-up 1s ease-out;
}

@keyframes fade-in-up {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* Персонажи немного "левитируют" */
@keyframes float {
	0% {
		transform: translateY(0px);
	}
	50% {
		transform: translateY(-5px);
	}
	100% {
		transform: translateY(0px);
	}
}

.group:hover .relative.w-72 {
	animation: float 3s ease-in-out infinite;
}
/* Анимация смены текста на число */
.fade-slide-enter-active,
.fade-slide-leave-active {
	transition: all 0.5s ease;
}

.fade-slide-enter-from {
	opacity: 0;
	transform: translateY(10px);
}

.fade-slide-leave-to {
	opacity: 0;
	transform: translateY(-5px);
}

/* Пульсация для надписи ожидания */
.animate-pulse {
	animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
}
</style>
