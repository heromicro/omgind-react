export default [
  {
    path: '/authen',
    component: '../layouts/AuthenLayout',
    routes: [
      { path: '/authen', redirect: '/authen/signin' },
      { path: '/authen/signin', component: './authen/SignIn/Index' },
      { path: '/authen/signup', component: './authen/SignUp/Index' },
    ],
  },

  {
    path: '/',
    component: '../layouts/AdminLayout',
    routes: [
      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard/Home' },
      {
        path: '/example',
        routes: [
          { path: '/example/demo', component: './Demo/DemoList.pro' },
          { path: '/example/demo.origin', component: './Demo/DemoList' },
          { path: '/example/demo.pro1', component: './Demo/DemoList.pro1' },
          { path: '/example/demo.pro2', component: './Demo/DemoList.pro2' },
        ],
      },
      {
        path: '/system',
        routes: [
          { path: '/system/role', component: './system/Role/RoleList' },
          { path: '/system/user', component: './system/User/UserList' },
          { path: '/system/dict', component: './system/Dict/DictList' },
          { path: '/system/district', component: './system/District/DistrictList' },
          { path: '/system/address', component: './system/address/addressList' },
        ],
      },
      {
        path: '/dev',
        routes: [{ path: '/dev/menu', component: './dev/Menu/MenuList' }],
      },
    ],
  },

  {
    component: '404',
  },
];
