import { defineBoot } from "#q-app/wrappers";
import { useAuth } from "src/stores/auth-store";
import { LocalStorage } from "quasar";

export default defineBoot(({ router }) => {
  const auth = useAuth();
  router.beforeEach(async(to) => {
    if(to.meta.auth) {
      const token = LocalStorage.getItem('token');
      if(!token) {
        return '/auth';
      }
      const {
        error
      } = await auth.validateToken(token as string);
      if(error) {
        return '/auth';
      }
    }
  })
});
