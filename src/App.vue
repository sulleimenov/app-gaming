<script setup>
import { ref, onMounted } from 'vue';

const API_URL = 'https://69c60516f272266f3eabc8e6.mockapi.io/users';
const user = ref(null);
const firstName = ref('');
const lastName = ref('');
const isLoading = ref(false);

onMounted(() => {
	const savedUser = localStorage.getItem('lesson_user');
	if (savedUser) {
		user.value = JSON.parse(savedUser);
		refreshUserData();
	}
});

const login = async () => {
	if (!firstName.value || !lastName.value) return;
	isLoading.value = true;
	try {
		const res = await fetch(API_URL);
		const users = await res.json();
		let existingUser = users.find(
			(u) => u.firstName === firstName.value && u.lastName === lastName.value,
		);
		if (!existingUser) {
			const createRes = await fetch(API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					firstName: firstName.value,
					lastName: lastName.value,
					points: 50,
					inventory: [],
				}),
			});
			existingUser = await createRes.json();
		}
		user.value = existingUser;
		localStorage.setItem('lesson_user', JSON.stringify(existingUser));
	} catch (e) {
		alert('Ошибка входа');
	} finally {
		isLoading.value = false;
	}
};

const refreshUserData = async () => {
	if (!user.value) return;
	try {
		const res = await fetch(`${API_URL}/${user.value.id}`);
		if (res.ok) {
			user.value = await res.json();
			localStorage.setItem('lesson_user', JSON.stringify(user.value));
		}
	} catch (e) {
		console.error('Update failed');
	}
};
</script>

<template>
	<div class="min-h-screen bg-[#0a0e14] text-slate-300 font-sans">
		<div
			class="fixed inset-0 opacity-10 pointer-events-none"
			style="
				background-image: radial-gradient(#334155 1px, transparent 1px);
				background-size: 40px 40px;
			"
		></div>

		<div v-if="user" class="relative z-10 mx-auto p-4 md:p-8">
			<!-- <header
				class="flex flex-col md:flex-row justify-between items-stretch gap-4 mb-8"
			>
				<div
					class="relative bg-white/5 border border-white/10 p-6 rounded-2xl flex-grow flex items-center gap-6 overflow-hidden group"
				>
					<div
						class="absolute top-0 left-0 w-16 h-1 border-t-2 border-l-2 border-orange-500/50 rounded-tl-2xl"
					></div>

					<div class="relative">
						<div
							class="absolute inset-0 rounded-full bg-orange-500/20 animate-ping"
						></div>
						<div
							class="relative w-16 h-16 rounded-full border-2 border-orange-500 flex items-center justify-center text-3xl bg-black/40 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
						>
							👨‍🚀
						</div>
					</div>

					<div class="space-y-1">
						<div class="flex items-center gap-2">
							<span
								class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
							></span>
							<span
								class="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]"
								>Status: Online</span
							>
						</div>
						<h1 class="text-2xl font-light text-white uppercase tracking-tight">
							{{ user.lastName }}
							<span
								class="font-bold text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
							>
								{{ user.firstName }}
							</span>
						</h1>
						<div class="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
							<div
								class="w-2/3 h-full bg-orange-500 shadow-[0_0_5px_#f97316]"
							></div>
						</div>
					</div>
				</div>

				<div
					class="relative bg-black/40 border border-white/10 p-6 rounded-2xl flex flex-col justify-center min-w-[240px] overflow-hidden"
				>
					<div
						class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent opacity-50"
					></div>

					<div class="relative flex flex-col items-end">
						<span
							class="text-[10px] text-orange-500 font-black uppercase tracking-widest mb-1"
							>Available Credits</span
						>
						<div class="flex items-baseline gap-2">
							<span
								class="text-4xl text-white font-black tracking-tighter tabular-nums"
							>
								{{ user.points.toLocaleString() }}
							</span>
							<span class="text-orange-500 text-sm font-black italic">CR</span>
						</div>

						<div class="flex gap-1 mt-2">
							<div
								v-for="i in 5"
								:key="i"
								class="w-4 h-1 rounded-full"
								:class="i < 4 ? 'bg-orange-500' : 'bg-white/10'"
							></div>
						</div>
					</div>
				</div>
			</header> -->

			<nav
				class="flex p-1 bg-white/5 border border-white/10 rounded-2xl mb-8 w-full max-w-2xl mx-auto"
			>
				<router-link
					to="/"
					class="flex-1 text-center py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400"
					active-class="bg-orange-600 text-white"
				>
					Магазин
				</router-link>
				<router-link
					to="/grade"
					class="flex-1 text-center py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400"
					active-class="bg-orange-600 text-white"
				>
					Оценить работу
				</router-link>
				<router-link
					to="/reflection"
					class="flex-1 text-center py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400"
					active-class="bg-orange-600 text-white"
				>
					Рефлексия
				</router-link>
			</nav>

			<router-view :user="user" @refresh="refreshUserData" />
		</div>

		<div v-else class="flex items-center justify-center min-h-screen"></div>
	</div>
</template>
