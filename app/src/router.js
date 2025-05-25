import {createRouter,createWebHistory} from 'vue-router';
import AddRecipe from './components/AddRecipe.vue';
import EditRecipe from './components/EditRecipe.vue';
import HomePage from './components/HomePage.vue';
import LoginPage from './components/LoginPage.vue';
import RecipesPage from './components/RecipesPage.vue';
import RecipeDetail from './components/RecipeDetail.vue';
import SignePage from './components/SignePage.vue';
import UserProfile from './components/UserProfile.vue';

const routes = [
    {   path:'/',
        name: HomePage, 
        component: HomePage,
    },
    {   path:'/recipes',
        name: RecipesPage, 
        component: RecipesPage,
    },
    {   path:'/recipes/:id',
        name: RecipeDetail,
        component: RecipeDetail,
        props: route => ({
            id:route.params.id,
        })
    },
    {   path:'/add-recipe',
        name: AddRecipe, 
        component: AddRecipe,
    },
    {   path:'/edit-recipe/:id',
        name: EditRecipe,
        component: EditRecipe,
        props: route => ({
            id:route.params.id,
        })
    },
    {   path:'/login',
        name: LoginPage, 
        component: LoginPage,
    },
    {   path:'/signup',
        name: SignePage, 
        component: SignePage,
    },
    {   path:'/profile',
        name: UserProfile, 
        component: UserProfile,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior(){
        return {top:0};
    },
});
export default router;