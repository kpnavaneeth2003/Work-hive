export const INITIAL_STATE = {
  title: "",
  cat: "",
  cover: "",
  images: [],
  desc: "",
  shortTitle: "",
  shortDesc: "",
  hours: 0,
  features: [],
  price: 0,
};

const numberFields = new Set(["price", "hours"]);

export const gigReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT": {
      const { name, value } = action.payload;
      return {
        ...state,
        [name]: numberFields.has(name) ? Number(value) : value,
      };
    }

    case "ADD_IMAGES":
      return {
        ...state,
        cover: action.payload.cover,
        images: action.payload.images,
      };

    case "ADD_FEATURE":
      return {
        ...state,
        features: [...state.features, action.payload],
      };

    case "REMOVE_FEATURE":
      return {
        ...state,
        features: state.features.filter(
          (feature) => feature !== action.payload
        ),
      };

    default:
      return state;
  }
};