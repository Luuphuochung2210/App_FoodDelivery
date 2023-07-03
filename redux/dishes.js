import * as ActionTypes from './ActionTypes';

export const dishes = (
  state = { isLoading: true, errMess: null, dishes: [], filteredDishes: [] },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_DISHES:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        dishes: action.payload,
        filteredDishes: action.payload // Initialize filteredDishes with all dishes
      };
    case ActionTypes.DISHES_LOADING:
      return { ...state, isLoading: true, errMess: null, dishes: [], filteredDishes: [] };
    case ActionTypes.DISHES_FAILED:
      return { ...state, isLoading: false, errMess: action.payload, dishes: [], filteredDishes: [] };
    case ActionTypes.SEARCH_DISHES:
      const searchText = action.payload.toLowerCase().trim();
      const filteredDishes = state.dishes.filter(
        (dish) => dish.name.toLowerCase().includes(searchText)
      );
      return { ...state, filteredDishes };
    case ActionTypes.UPDATE_COUNT:
      const { dishId, count } = action.payload;
      const updatedDishes = state.dishes.map((dish) => {
        if (dish.id === dishId) {
          return { ...dish, count: count };
        } else {
          return dish;
        }
      });
      return { ...state, dishes: updatedDishes };
    default:
      return state;
  }
};
