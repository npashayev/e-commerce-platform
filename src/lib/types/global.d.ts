declare module "*.css"
declare module "*.scss"


declare global {
  type AppDispatch = typeof import('@/lib/store/store').store.dispatch;
  type RootState = ReturnType<typeof import('@/lib/store/store').store.getState>;
}