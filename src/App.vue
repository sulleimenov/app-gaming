<script setup>
import { ref, onMounted } from 'vue';

const API_URL = 'https://69c60516f272266f3eabc8e6.mockapi.io/users';
const user = ref(null);
const firstName = ref('');
const secondName = ref('');
const isLoading = ref(false);

onMounted(() => {
	const savedUser = localStorage.getItem('lesson_user');
	if (savedUser) {
		user.value = JSON.parse(savedUser);
		refreshUserData();
	}

	// Авто-обновление каждые 30 секунд для синхронизации баллов
	setInterval(refreshUserData, 30000);
});

const login = async () => {
	if (!firstName.value.trim() || !secondName.value.trim()) return;
	isLoading.value = true;
	try {
		const res = await fetch(API_URL);
		const users = await res.json();

		let existingUser = users.find(
			(u) =>
				u.firstName.toLowerCase() === firstName.value.toLowerCase() &&
				u.secondName.toLowerCase() === secondName.value.toLowerCase(),
		);

		if (!existingUser) {
			const createRes = await fetch(API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					firstName: firstName.value,
					secondName: secondName.value,
					points: 0,
					scores: 0,
					inventory: [],
					evaluated: false, // По умолчанию не проверен
				}),
			});
			existingUser = await createRes.json();
		}

		user.value = existingUser;
		localStorage.setItem('lesson_user', JSON.stringify(existingUser));
	} catch (e) {
		alert('Ошибка доступа к базе данных');
	} finally {
		isLoading.value = false;
	}
};

const refreshUserData = async () => {
	if (!user.value) return;
	try {
		const res = await fetch(`${API_URL}/${user.value.id}`);
		if (res.ok) {
			const freshData = await res.json();
			user.value = freshData;
			localStorage.setItem('lesson_user', JSON.stringify(freshData));
		}
	} catch (e) {
		console.error('Update failed');
	}
};
</script>

<template>
	<div
		class="min-h-screen bg-[#0a0e14] text-slate-300 font-sans selection:bg-orange-500/30"
	>
		<div
			class="fixed inset-0 opacity-10 pointer-events-none"
			style="
				background-image: radial-gradient(#334155 1px, transparent 1px);
				background-size: 40px 40px;
			"
		></div>

		<div v-if="user" class="relative z-10 mx-auto p-4 md:p-8">
			<nav
				class="flex p-1 bg-white/5 border border-white/10 rounded-2xl mb-8 w-full max-w-2xl mx-auto backdrop-blur-md"
			>
				<router-link
					to="/"
					class="flex-1 text-center py-3 rounded-xl text-[14px] uppercase tracking-widest text-slate-400 transition-all"
					active-class="bg-orange-600 text-white shadow-lg shadow-orange-900/20"
				>
					Магазин
				</router-link>
				<router-link
					to="/tasks"
					class="flex-1 text-center py-3 rounded-xl text-[14px] uppercase tracking-widest text-slate-400 transition-all"
					active-class="bg-orange-600 text-white shadow-lg shadow-orange-900/20"
				>
					Задания
				</router-link>
				<router-link
					to="/grade"
					class="flex-1 text-center py-3 rounded-xl text-[14px] uppercase tracking-widest text-slate-400 transition-all"
					active-class="bg-orange-600 text-white shadow-lg shadow-orange-900/20"
				>
					Оценивание
				</router-link>
				<router-link
					to="/reflection"
					class="flex-1 text-center py-3 rounded-xl text-[14px] uppercase tracking-widest text-slate-400 transition-all"
					active-class="bg-orange-600 text-white shadow-lg shadow-orange-900/20"
				>
					Рефлексия
				</router-link>
			</nav>

			<router-view :user="user" @refresh="refreshUserData" />
		</div>

		<div
			v-else
			class="relative z-10 flex items-center justify-center min-h-screen p-6"
		>
			<div
				class="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-xl"
			>
				<div class="text-center mb-10">
					<div
						class="inline-block p-4 bg-orange-600/20 rounded-3xl mb-4 text-4xl"
					>
						👨‍🚀
					</div>
					<h2 class="text-2xl font-black text-white uppercase tracking-tighter">
						Вход в платформу
					</h2>
					<p class="text-slate-500 text-xs mt-2 uppercase tracking-widest">
						Введите ваши данные
					</p>
				</div>

				<div class="space-y-4">
					<input
						v-model="firstName"
						placeholder="Игрок 1"
						class="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-600 transition-all uppercase text-sm font-bold tracking-widest placeholder:text-slate-700"
					/>
					<input
						v-model="secondName"
						placeholder="Игрок 2"
						class="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-600 transition-all uppercase text-sm font-bold tracking-widest placeholder:text-slate-700"
					/>

					<button
						@click="login"
						:disabled="isLoading"
						class="w-full bg-orange-600 hover:bg-orange-500 text-white p-5 rounded-2xl font-black uppercase text-xs tracking-[0.4em] transition-all shadow-xl shadow-orange-900/40 active:scale-95 disabled:opacity-50"
					>
						{{ isLoading ? 'Авторизация...' : 'Войти в систему' }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
