import { AutorizationContainer } from "./components/autorization/container";
import { MainPageContainer } from "./components/mainPage/container";
import { SettingContainer } from "./components/settings/container";
import { ProjectListContainer } from "./components/project/container";

const AppRoutes = [
  {
        index: true,
        element: <MainPageContainer />
  },
  {
      path: '/auth',
      element: <AutorizationContainer />
    },
    {
        path: '/project',
        element: <ProjectListContainer />
    },
    {
        path: '/setting',
        element: <SettingContainer />
    }
];

export default AppRoutes;
