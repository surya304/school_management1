import mixpanel from "mixpanel-browser";

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);

const Mixpanel = {
  track: (name, props) => {
    console.log("name>>>> mixpanel-browser", name);
    mixpanel.track(name, props);
  },
  identify: (id) => {
    mixpanel.identify(id);
  },
  alias: (id) => {
    mixpanel.alias(id);
  },
  people: {
    set: (props) => {
      mixpanel.people.set(props);
    },
  },
};

export default Mixpanel;