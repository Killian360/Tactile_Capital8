export default function SLIDER_INDEXATION(state = 0, action)
 {
  switch (action.type) {
  case 'IncrementIndexation':
    return state= state+1
  case 'DecrementIndexation':
    return state= state-1
    case 'setIndex':
      return state = action.index
  default:
    return state
  }
}