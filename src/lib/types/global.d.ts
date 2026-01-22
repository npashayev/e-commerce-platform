declare module "*.css"
declare module "*.scss"
declare module "*.png"
declare module "*.jpg"
declare module "*.jpeg"
declare module "*.gif"
declare module "*.svg"
declare module "*.webp"
declare module "*.ico"


declare global {
  type AppDispatch = typeof import('@/lib/store/store').store.dispatch;
  type RootState = ReturnType<typeof import('@/lib/store/store').store.getState>;
}