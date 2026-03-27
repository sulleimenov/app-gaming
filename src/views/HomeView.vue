<script setup>
import { ref, computed } from 'vue';

const props = defineProps(['user']);
const emit = defineEmits(['refresh']);

// 1. Расширенный список товаров с категориями
const shopItems = [
	{
		id: '1',
		name: 'Костюм космонавта',
		price: 20,
		icon: 'suit-1',
		category: 'clothing',
	},
	{
		id: '2',
		name: 'Шлем космонавта',
		price: 20,
		icon: 'hat-1',
		category: 'hats',
	},
	{
		id: '3',
		name: 'Сборная Казахстана',
		price: 15,
		icon: 'suit-football-1',
		category: 'clothing',
	},
];

// 2. Определение категорий
const categories = [
	{ id: 'all', name: 'Все' },
	{ id: 'hats', name: 'Головные уборы' },
	{ id: 'clothing', name: 'Одежда' },
	{ id: 'shoes', name: 'Обувь' },
	{ id: 'access', name: 'Аксессуары' },
];

const activeCategory = ref('all');
const previewId = ref(null);

// 3. Логика фильтрации (исправляет ошибку в вашем шаблоне)
const filteredItems = computed(() => {
	if (activeCategory.value === 'all') return shopItems;
	return shopItems.filter((item) => item.category === activeCategory.value);
});

const isOwned = (id) => props.user.inventory.includes(id);

const shouldShow = (item) => {
	if (previewId.value === item.id) return true;
	return isOwned(item.id);
};

const buyItem = async (item) => {
	if (props.user.points < item.price) return alert('Недостаточно кредитов');

	const updatedUser = {
		...props.user,
		points: props.user.points - item.price,
		inventory: [...props.user.inventory, item.id],
	};

	const res = await fetch(
		`https://69c60516f272266f3eabc8e6.mockapi.io/users/${props.user.id}`,
		{
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updatedUser),
		},
	);

	if (res.ok) {
		previewId.value = null;
		emit('refresh');
	}
};

const getItemStyle = (id) => {
	const styles = {
		1: 'top-0 z-10', // Костюм (базовый слой)
		2: 'top-0 z-30 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]', // Шлем (сверху)
		3: 'bottom-0 z-20', // Обувь
	};
	return styles[id] || '';
};

const selectedItem = computed(() =>
	shopItems.find((i) => i.id === previewId.value),
);
</script>

<template>
	<div
		class="flex flex-col lg:flex-row gap-6 h-[calc(100vh-250px)] min-h-[600px]"
	>
		<div
			class="lg:w-2/5 bg-gradient-to-b from-orange-500/10 to-transparent border border-white/10 rounded-3xl relative flex items-center justify-center overflow-hidden group"
		>
			<div
				class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"
			></div>

			<div
				class="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none"
			>
				<div class="flex justify-between items-start">
					<div class="border-l-2 border-t-2 border-orange-500 w-10 h-10"></div>
					<div class="border-r-2 border-t-2 border-orange-500 w-10 h-10"></div>
				</div>
				<div class="flex justify-between items-end">
					<div class="border-l-2 border-b-2 border-orange-500 w-10 h-10"></div>
					<div class="border-r-2 border-b-2 border-orange-500 w-10 h-10"></div>
				</div>
			</div>

			<div class="relative scale-[1.2] transition-transform duration-700">
				<div
					class="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-50 pointer-events-none"
				>
					<div
						class="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 px-6 py-2 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(249,115,22,0.2)]"
					>
						<span
							class="text-[20px] font-black text-white uppercase tracking-[0.2em] whitespace-nowrap"
						>
							{{ user.firstName }}
						</span>
					</div>
					<div
						class="w-px h-4 bg-gradient-to-b from-orange-500/50 to-transparent"
					></div>
				</div>

				<div
					class="text-[180px] leading-none grayscale-[0.5] contrast-125 opacity-90"
				>
					<img src="/bars.svg" alt="Logo" width="600" />
				</div>

				<div v-for="item in shopItems" :key="item.id">
					<transition name="equip">
						<div
							v-if="shouldShow(item)"
							class="absolute transition-all duration-300"
							:class="[getItemStyle(item.id), previewId === item.id ? '' : '']"
						>
							<img :src="`/${item.icon}.svg`" alt="" width="600" />
						</div>
					</transition>
				</div>
			</div>

			<div
				v-if="previewId"
				class="absolute bottom-8 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter animate-bounce"
			>
				Режим примерки активен
			</div>
		</div>

		<div class="lg:w-3/5 flex flex-col gap-6">
			<div
				class="bg-white/5 border border-white/10 rounded-3xl p-6 flex-grow overflow-y-auto flex flex-col"
			>
				<div class="flex items-center justify-between mb-6">
					<h3
						class="text-white font-black uppercase text-sm flex items-center gap-2"
					>
						<span class="w-2 h-2 bg-orange-500 rounded-full"></span>
						Магазин
					</h3>
					<span class="text-[10px] text-slate-500 font-mono italic"
						>Найдено: {{ filteredItems.length }}</span
					>
				</div>

				<div class="flex flex-wrap gap-2 mb-8">
					<button
						v-for="cat in categories"
						:key="cat.id"
						@click="activeCategory = cat.id"
						class="px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border cursor-pointer"
						:class="
							activeCategory === cat.id
								? 'bg-orange-600 border-orange-500 text-white'
								: 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30'
						"
					>
						{{ cat.name }}
					</button>
				</div>

				<div class="grid grid-cols-3 sm:grid-cols-4 gap-4">
					<div
						v-for="item in filteredItems"
						:key="item.id"
						@click="!isOwned(item.id) ? (previewId = item.id) : null"
						class="relative aspect-square bg-green/5 border rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group overflow-hidden"
						:class="[
							isOwned(item.id)
								? 'border-green-500/50 bg-green-500/5'
								: 'border-white/10 hover:border-orange-500/50',
							previewId === item.id ? 'ring-2 ring-orange-500' : '',
						]"
					>
						<div
							class="text-4xl mb-2 group-hover:scale-110 transition-transform"
						>
							<img :src="`/${item.icon}.svg`" alt="" width="200" />
						</div>
						<div
							class="text-[18px] font-bold text-white uppercase text-center px-2"
						>
							{{ item.name }}
						</div>
						<div v-if="!isOwned(item.id)" class="mt-2 text-orange-500 text-xs">
							{{ item.price }} монет
						</div>
						<div
							v-else
							class="mt-2 text-green-500 text-sm uppercase font-black"
						>
							Куплено
						</div>
						<div
							v-if="isOwned(item.id)"
							class="absolute top-4 right-4 w-4 h-4 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"
						></div>
					</div>
				</div>

				<div
					v-if="filteredItems.length === 0"
					class="flex-grow flex items-center justify-center flex-col opacity-30"
				>
					<span class="text-8xl mb-6">📦</span>
					<p class="text-[10px] uppercase font-black">
						В данной категории нет товаров
					</p>
				</div>
			</div>

			<div
				class="h-24 bg-white/5 border border-white/10 rounded-3xl p-4 flex items-center justify-between overflow-hidden"
			>
				<div
					v-if="selectedItem"
					class="flex items-center gap-4 animate-in slide-in-from-left-4 duration-300"
				>
					<div
						class="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-orange-900/40"
					>
						{{ selectedItem.icon }}
					</div>
					<div>
						<div class="text-white font-black uppercase text-xs">
							{{ selectedItem.name }}
						</div>
						<div class="text-[10px] text-slate-500 italic">
							Нажмите, чтобы подтвердить установку
						</div>
					</div>
				</div>
				<div
					v-else
					class="text-slate-500 text-[10px] uppercase tracking-[0.2em] italic"
				>
					Наведите на модуль для предварительного просмотра
				</div>

				<button
					v-if="selectedItem"
					@click="buyItem(selectedItem)"
					class="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] transition-all shadow-xl shadow-orange-900/20 active:scale-95"
				>
					Купить: {{ selectedItem.price }} монет
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Анимация надевания шмоток */
.equip-enter-active {
	transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.equip-enter-from {
	opacity: 0;
	transform: scale(2) translateY(-20px);
	filter: brightness(2) blur(10px);
}

.equip-leave-active {
	transition: all 0.2s ease;
}
.equip-leave-to {
	opacity: 0;
	transform: scale(0.5);
}

/* Скроллбар в стиле киберпанк */
::-webkit-scrollbar {
	width: 4px;
}
::-webkit-scrollbar-track {
	background: transparent;
}
::-webkit-scrollbar-thumb {
	background: rgba(249, 115, 22, 0.2);
	border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
	background: rgba(249, 115, 22, 0.5);
}
</style>
