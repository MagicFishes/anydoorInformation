import { RouteObject } from "react-router-dom";
import { homeRoutes } from "./computer/homeRouter";
const Computer: RouteObject[] = [
    ...homeRoutes
];

export default Computer;