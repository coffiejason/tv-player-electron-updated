const reducer = (state, action) => {
    switch (action.type) {
        case "forwardVideo":
          return {...state,forwardReverse: true};
          
        case "reverseVideo":
            return {...state,forwardReverse: false};

        case "resetFR":
            return {...state,forwardReverse: null}
        
        case "markedIn":
            return {...state,markedIn: action.payload}//bool
  
        case "newMarkInTime":
          return {...state,markInTime: action.payload}//float

        case "markedOut":
            return {...state,markedOut: action.payload}//bool
  
        case "newMarkOutTime":
          return {...state,markOutTime: action.payload}//float

        
        case "setDisplayMIT":
            return {...state,displayMIT: action.payload}

        case "setDisplayMOT":
            return {...state,displayMOT: action.payload}
  
      default:
        return state;
    }
}

export {reducer}