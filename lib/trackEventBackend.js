const Mixpanel = require("mixpanel");
const mixpanel = Mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN);

let env_check = process.env.NODE_ENV === "development";

let actions = {
  identify: (id) => {
    if (env_check) mixpanel.identify(id);
  },
  alias: (id) => {
    if (env_check) mixpanel.alias(id);
  },
  track: (name, props) => {
    if (env_check) mixpanel.track(name, props);
  },
  people: {
    set: (id, props) => {
      if (env_check) mixpanel.people.set(id, props);
    },
  },
};

export let MixpanelEvent = actions;
