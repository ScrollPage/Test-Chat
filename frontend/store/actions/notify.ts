export const addNotify = () => ({ type: 'ADD_NOTIFY' } as const);

export const addMessageNotify = () => ({ type: 'ADD_MESSAGE_NOTIFY' } as const);

export const removeMessageNotify = () => ({ type: 'REMOVE_MESSAGE_NOTIFY' } as const);

export const zeroingNotify = () => ({ type: 'ZEROING_NOTIFY' } as const);

export const setNotify = (setNumber: number) => ({ type: 'SET_NOTIFY', setNumber } as const); 

export const setMessageNotify = (setNumber: number) => ({ type: 'SET_MESSAGE_NOTIFY', setNumber} as const); 







