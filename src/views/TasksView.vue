<script setup>
import { ref, onMounted } from 'vue';

const users = ref([]);
const teamTopics = ref([]);
const showTopics = ref(false);
const isLoading = ref(true);

const API_URL = 'https://69c60516f272266f3eabc8e6.mockapi.io/users';

const tasks = [
	{
		description:
			'Установить плагин News & Newsletter и настроить основные параметры.',
	},
	{
		description:
			'Сгенерировать текст новости с использованием инструментов ИИ и добавить не менее 1 новостной записи через административную панель CMS в соответствии с назначенной темой.',
	},
	{
		description:
			'Реализовать вывод новостей на главной странице сайта с использованием компонентов, кода Winter CMS.',
	},
];

const availableTopics = [
	'Костанайский колледж цифровой индустрии',
	'Мероприятия, посвященные празднику Наурыз',
	'Студенты обучаются с помощью ИИ',
	'Виртуальная экскурсия по колледжу',
	'Свободный выбор темы', // Индекс 4 в твоем списке
	'Экологический десант',
	'Экскурсия студентов на предприятие',
];

const fetchUsers = async () => {
	try {
		const res = await fetch(API_URL);
		const data = await res.json();
		// Сортируем так же, как на дашборде, чтобы порядок экипажей совпадал
		users.value = data.sort((a, b) => (b.points || 0) - (a.points || 0));
	} catch (e) {
		console.error('Ошибка загрузки данных');
	} finally {
		isLoading.value = false;
	}
};

const assignTopics = () => {
	const freeChoiceTopic = 'Свободный выбор темы';
	// Берем все темы, кроме "Свободного выбора"
	const specificTopics = availableTopics.filter((t) => t !== freeChoiceTopic);

	// Перемешиваем специфические темы
	const shuffledSpecific = [...specificTopics].sort(() => Math.random() - 0.5);

	teamTopics.value = users.value.map((user, index) => {
		let assignedTopic = '';

		// Если индекс меньше количества уникальных тем, даем уникальную
		if (index < shuffledSpecific.length) {
			assignedTopic = shuffledSpecific[index];
		} else {
			// Все, кто не влез в первые 6 тем, получают свободный выбор
			assignedTopic = freeChoiceTopic;
		}

		return {
			userName: `${user.firstName} & ${user.secondName}`,
			topic: assignedTopic,
		};
	});

	showTopics.value = true;
};

onMounted(fetchUsers);
</script>

<template>
	<div class="max-w-6xl mx-auto py-20 px-6 min-h-screen text-white">
		<div class="mb-16">
			<h1
				class="text-3xl text-center font-black uppercase tracking-tighter italic"
			>
				Управление новостями с помощью плагина News & Newsletter
			</h1>
			<div class="h-1 w-40 bg-orange-600 mt-4 mx-auto"></div>
			<p
				class="mt-4 text-center text-slate-500 uppercase text-[10px] tracking-[0.3em]"
			>
				Тема урока
			</p>
		</div>

		<div
			class="mb-20 bg-white/5 border border-white/10 rounded-[3.5rem] p-10 relative overflow-hidden shadow-2xl"
		>
			<div
				class="absolute -top-24 -right-24 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full"
			></div>

			<div class="relative z-10 flex flex-col items-center">
				<h2
					class="text-[10px] font-black uppercase tracking-[0.5em] text-orange-500 mb-8"
				>
					Распределение тем новостей по командам
				</h2>

				<div
					v-if="isLoading"
					class="text-orange-500 animate-pulse font-black text-xs uppercase tracking-widest"
				>
					Подключение к нейросети...
				</div>

				<button
					v-else-if="!showTopics"
					@click="assignTopics"
					class="group relative px-14 py-5 bg-orange-600 text-black font-black uppercase italic tracking-tighter hover:bg-white transition-all duration-500 rounded-xl"
				>
					Назначить темы
					<div
						class="absolute -inset-2 border border-orange-600/30 group-hover:scale-110 transition-transform rounded-xl"
					></div>
				</button>

				<div v-else class="grid grid-cols-1 gap-4 w-full animate-fade-in">
					<div
						v-for="(item, idx) in teamTopics"
						:key="idx"
						class="bg-black/40 border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-4 group transition-all"
						:class="
							item.topic === 'Свободный выбор темы'
								? 'border-blue-500/20'
								: 'hover:border-orange-600/40'
						"
					>
						<div class="flex flex-col">
							<span
								class="text-[12px] text-orange-500 font-black uppercase tracking-widest mb-1"
								>Команда #{{ idx + 1 }}</span
							>
							<span
								class="text-white font-black uppercase tracking-widest text-[16px]"
								>{{ item.userName }}</span
							>
						</div>

						<div
							class="hidden md:block flex-grow mx-8 border-b border-dashed border-white/10 opacity-20"
						></div>

						<div class="flex flex-col md:text-right">
							<span
								class="text-[12px] text-slate-500 font-black uppercase tracking-widest mb-1"
								>Тема записи</span
							>
							<span
								class="font-bold italic text-sm transition-colors text-[18px]"
								:class="
									item.topic === 'Свободный выбор темы'
										? 'text-blue-400'
										: 'text-orange-500'
								"
							>
								{{ item.topic }}
							</span>
						</div>
					</div>

					<button
						@click="showTopics = false"
						class="mt-6 text-[8px] uppercase tracking-[0.4em] text-slate-600 hover:text-orange-500 transition-colors"
					>
						Перераспределить темы
					</button>
				</div>
			</div>
		</div>

		<div class="space-y-6">
			<div
				v-for="(task, index) in tasks"
				:key="index"
				class="group bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:border-orange-600/30 transition-all duration-700"
			>
				<h3
					class="text-3xl font-black text-white group-hover:text-orange-600 transition-colors mb-4 italic uppercase tracking-tighter"
				>
					Задание №{{ index + 1 }}
				</h3>
				<p class="text-lg text-slate-400 leading-relaxed font-medium">
					{{ task.description }}
				</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
.animate-fade-in {
	animation: fadeIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) both;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(15px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

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
