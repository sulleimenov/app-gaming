<template>
	<div class="max-w-4xl mx-auto py-20 px-6 min-h-screen text-white">
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

		<div class="space-y-6">
			<div
				v-for="(task, index) in tasks"
				:key="index"
				class="group bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-orange-600/50 transition-all duration-500"
			>
				<div class="flex items-start gap-6">
					<div class="flex-grow">
						<h3
							class="text-3xl font-black text-white group-hover:text-orange-600 transition-colors mb-3"
						>
							Практическая работа №
							<span>{{ index + 1 }}</span>
						</h3>
						<p class="text-lg text-slate-400 leading-relaxed">
							{{ task.description }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const tasks = [
	{
		title: 'Настройка рассылки',
		description:
			'Установить плагин News & Newsletter и настроить основные параметры.',
	},
	{
		title: 'Генерация контента',
		description:
			'Сгенерировать текст новости с использованием инструментов ИИ и добавить не менее 1 новостной записи через административную панель CMS в соответствии с назначенной темой.',
	},
	{
		title: 'Вывод новостей',
		description:
			'Реализовать вывод новостей на главной странице сайта с использованием компонентов, кода Winter CMS.',
	},
];
</script>

<style scoped>
/* Стиль чекбокса для отметки выполнения */
input:checked::before {
	content: '✓';
	display: block;
	text-align: center;
	color: white;
	font-weight: bold;
}
</style>
