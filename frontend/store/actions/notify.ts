
export const addNotify = () => ({ type: 'ADD_NOTIFY' } as const);

export const zeroingNotify = () => ({ type: 'ZEROING_NOTIFY' } as const);

export const setNotify = (setNumber: number) => ({ type: 'SET_NOTIFY', setNumber} as const);







