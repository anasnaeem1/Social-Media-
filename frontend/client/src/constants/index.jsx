const PF = import.meta.env.VITE_PUBLIC_FOLDER || "/images";

export const navItems = {
  logo: "social",
  searchIcon: <i className="ri-search-line"></i>,

  controls: [
    { label: "Home", link: "/" },
    { label: "Timeline", link: "/" },
  ],

  controlsIcons: [
    { id: 1, name: "user", icon: <i className="ri-user-fill"></i>, link: "/" },
    {
      id: 2,
      name: "Messages",
      icon: <i className="ri-message-2-fill"></i>,
      link: "/",
    },
    {
      id: 3,
      name: "notifications",
      icon: <i className="ri-notification-2-fill"></i>,
      link: "/",
    },
  ],
};

export const Options = [
  { id: 1, label: "Feed", icon: <i className="ri-rss-fill"></i>, link: "/" },
  { id: 2, label: "Chats", icon: <i className="ri-message-2-fill"></i>, link: "/messages" },
  { id: 3, label: "Videos", icon: <i className="ri-play-circle-fill"></i>, link: "/videos" },
  { id: 4, label: "Groups", icon: <i className="ri-group-fill"></i>, link: "/groups" },
  { id: 5, label: "Bookmarks", icon: <i className="ri-bookmark-fill"></i>, link: "/bookmarks" },
  { id: 6, label: "Question", icon: <i className="ri-questionnaire-fill"></i>, link: "/questions" },
  { id: 7, label: "Jobs", icon: <i className="ri-briefcase-fill"></i>, link: "/jobs" },
  { id: 8, label: "Events", icon: <i className="ri-calendar-event-fill"></i>, link: "/events" },
  { id: 9, label: "Courses", icon: <i className="ri-graduation-cap-fill"></i>, link: "/courses" },
];


export const Friends = [
  {
    id: 1,
    pic: PF + "Person/daniyal.jpg",
    fname: "Daniyal",
    lname: "Shoaib",
    link: "/",
  },
  {
    id: 2,
    pic: PF + "Person/daniyal.jpg",
    fname: "Huzaifa ",
    lname: "Habib",

    link: "/",
  },
  {
    id: 3,
    pic: PF + "Person/daniyal.jpg",
    fname: "Tayyab",
    lname: "Shoukat",
    link: "/",
  },
  {
    id: 4,
    pic: PF + "Person/daniyal.jpg",
    fname: "Mujeeb",
    lname: "Khan",
    link: "/",
  },
  {
    id: 5,
    pic: PF + "Person/daniyal.jpg",
    fname: "talha",
    lname: "moiz",
    link: "/",
  },
  {
    id: 6,
    pic: PF + "Person/daniyal.jpg",
    fname: "Aleem",
    lname: "Khan",
    link: "/",
  },
  {
    id: 7,
    pic: PF + "Person/daniyal.jpg",
    fname: "Peter ",
    lname: "Smith",
    link: "/",
  },
  {
    id: 8,
    pic: PF + "Person/daniyal.jpg",
    fname: "mark",
    lname: "Ken",
    link: "/",
  },
  {
    id: 9,
    pic: PF + "Person/daniyal.jpg",
    fname: "yellow ",
    lname: "paul",
    link: "/",
  },
];

export const ShareOptions = [
  {
    id: 1,
    icon: <i className="ri-image-ai-fill"></i>,
    label: "Photo or Video",
    link: "/",
  },
  {
    id: 2,
    icon: <i className="ri-hashtag"></i>,
    label: "Tag",
    link: "/",
  },
  {
    id: 3,
    icon: <i className="ri-map-pin-fill"></i>,
    label: "Location",
    link: "/",
  },
  {
    id: 4,
    icon: <i className="ri-emoji-sticker-line"></i>,
    label: "Feelings",
    link: "/",
  },
];

export const Shares = [
  {
    id: 1,
    icon: <i className="ri-thumb-up-line"></i>,
    liked: <i className="ri-thumb-up-fill"></i>,
    label: "Like",
    link: "/",
  },
  {
    id: 2,
    icon: <i className="ri-chat-1-line"></i>,
    label: "Comments",
    link: "/",
  },
  {
    id: 3,
    icon: <i className="ri-hashtag"></i>,
    label: "Tag",
    link: "/",
  },
  {
    id: 4,
    icon: <i className="ri-share-forward-line"></i>,
    label: "share",
    link: "/",
  },
];
