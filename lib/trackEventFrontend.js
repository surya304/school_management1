import mixpanel from "mixpanel-browser";

mixpanel.init(process.env.MIXPANEL_TOKEN);

let actions = {
  identify: (id) => {
    mixpanel.identify(id);
  },
  alias: (id) => {
    mixpanel.alias(id);
  },
  track: (name, props) => {

    console.log("name>>>>", name);
    console.log("props>>>>", props);
    mixpanel.track(name, props);
  },
  people: {
    set: (props) => {
      mixpanel.people.set(props);
    },
  },
};

export let MixpanelEvent = actions;
