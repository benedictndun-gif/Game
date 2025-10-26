import { createRouter, createWebHistory } from 'vue-router'

import Welcome from '../views/Welcome.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Panduan from '../views/Panduan.vue'
import VideoPage from '../views/Video.vue'
import Materi from '../views/Materi.vue'
import MateriDetail from '../views/MateriDetail.vue'
import Games from '../views/Games.vue'

import SusunPlanet from '../games/SusunPlanet.vue'
import PilihPlanet from '../games/PilihPlanet.vue'
import Mewarnai from '../games/Mewarnai.vue'
import Mewarnaitatasurya from '../games/Mewarnaitatasurya.vue'
import Planetimajinasi from '../games/Planetimajinasi.vue'

import Merkurius from '@/views/merkurius.vue'
import Venus from '@/views/venus.vue'
import Bumi from '@/views/bumi.vue'
import Mars from '@/views/mars.vue'
import Jupiter from '@/views/jupiter.vue'
import Saturnus from '@/views/saturnus.vue'
import Uranus from '@/views/uranus.vue'
import Neptunus from '@/views/neptunus.vue'
import Matahari from '@/views/matahari.vue'

const routes = [
  { path: '/', component: Welcome },
  { path: '/register', component: Register },
  { path: '/home', component: Home },
  { path: '/panduan', component: Panduan },
  { path: '/video', component: VideoPage },
  { path: '/materi', component: Materi },
  { path: '/materi/:planet', component: MateriDetail, props: true },
  { path: '/games', component: Games },
  { path: '/games/susun-planet', component: SusunPlanet },
  { path: '/games/pilih-planet', component: PilihPlanet },
  { path: '/games/mewarnai', component: Mewarnai },
  { path: '/games/mewarnaitatasurya', component: Mewarnaitatasurya },
  { path: '/games/Planetimajinasi', component: Planetimajinasi },

  { path: '/Materi/merkurius', component: Merkurius },
  { path: '/Materi/venus', component: Venus },
  { path: '/Materi/bumi', component: Bumi },
  { path: '/Materi/mars', component: Mars },
  { path: '/Materi/jupiter', component: Jupiter },
  { path: '/Materi/saturnus', component: Saturnus },
  { path: '/Materi/uranus', component: Uranus },
  { path: '/Materi/neptunus', component: Neptunus },
  { path: '/Materi/matahari', component: Matahari },
]

export default createRouter({
  history: createWebHistory(),
  routes
})
