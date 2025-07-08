import { RouteObject } from "react-router-dom";
import { homeRoutes } from "./computer/homeRouter";
const Computer: RouteObject[] = [
      // 重定向
  {
    path:'/',
    element: <Navigate to='login' replace />
  },
    ...homeRoutes
];

export default Computer;