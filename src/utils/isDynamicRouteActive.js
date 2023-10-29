import router from "@/router";

export const isDynamicRouteActive = (route) => {
  const { route: resolvedRoute } = router.resolve(route);
  return resolvedRoute.path === router.currentRoute.path;
};
