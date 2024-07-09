import { createRouter, createWebHistory } from 'vue-router';
import ArtistsPage from '@/components/ArtistsPage.vue';
import AlbumDetailsPage from '@/components/AlbumDetailsPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/artists'
  },
  {
    path: '/artists',
    name: 'ArtistsPage',
    component: ArtistsPage
  },
  {
    path: '/album/:albumId',
    name: 'AlbumDetailsPage',
    component: AlbumDetailsPage,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(process.env.API_BASE_URL),
  routes
});

export default router;
