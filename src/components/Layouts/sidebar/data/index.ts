import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "Details",
            url: "/admin",
          },
        ],
      },
      {
        title: "Users",
        url: "/admin/users",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Profile",
        url: "/admin/profile",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Appointments",
        url: "/admin/appointments",
        icon: Icons.Calendar,
        items: [
          {
            title: "Tables",
            url: "/admin/appointments",
          },
        ],
      },
      {
        title: "Pages",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Settings",
            url: "/admin/pages/settings",
          },
        ],
      },
    ],
  },
  {
    label: "OTHERS",
    items: [
      {
        title: "Clinic-Info",
        icon: Icons.PieChart,
        items: [
          {
            title: "Details",
            url: "/admin/clinic-info",
          },
        ],
      },
      // {
      //   title: "UI Elements",
      //   icon: Icons.FourCircle,
      //   items: [
      //     {
      //       title: "Alerts",
      //       url: "/ui-elements/alerts",
      //     },
      //     {
      //       title: "Buttons",
      //       url: "/ui-elements/buttons",
      //     },
      //   ],
      // },
      // {
      //   title: "Authentication",
      //   icon: Icons.Authentication,
      //   items: [
      //     {
      //       title: "Sign In",
      //       url: "/auth/login",
      //     },
      //   ],
      // },
    ],
  },
];
