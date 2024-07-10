import { createRouter, createWebHistory } from 'vue-router';
import ArtistsPage from '@/components/ArtistsPage.vue';
import AlbumDetailsPage from '@/components/AlbumDetailsPage.vue';
import ArtistDetailsPage from '@/components/ArtistDetailsPage.vue';
import SearchPage from '@/components/SearchPage.vue';

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
    path: '/artists/:artistId',
    name: 'ArtistDetailsPage',
    component: ArtistDetailsPage,
    props: true
  },
  {
    path: '/albums/:albumId',
    name: 'AlbumDetailsPage',
    component: AlbumDetailsPage,
    props: true
  },
  {
    path: '/search',
    name: 'SearchPage',
    component: SearchPage,
    props: route => ({ input: route.query.input })
  }
];

const router = createRouter({
  history: createWebHistory(process.env.API_BASE_URL),
  routes
});

export default router;
