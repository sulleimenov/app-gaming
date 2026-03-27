import { createRouter, createWebHistory } from 'vue-router';
// Импортируем компоненты (предположим, они в папке views)
import HomeView from '../views/HomeView.vue';
import GradeView from '../views/GradeView.vue';
import ReflectionView from '../views/ReflectionView.vue';

const routes = [
	{ path: '/', name: 'home', component: HomeView },
	{ path: '/grade', name: 'grade', component: GradeView },
	{ path: '/reflection', name: 'reflection', component: ReflectionView },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

// Гвардия: если юзера нет в localStorage, не пускаем дальше входа (опционально)
router.beforeEach((to, from, next) => {
	const isAuthenticated = localStorage.getItem('lesson_user');
	if (to.name !== 'home' && !isAuthenticated) next({ name: 'home' });
	else next();
});

export default router;
