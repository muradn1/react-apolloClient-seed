import { BehaviorSubject } from 'rxjs';


const listCardToggleSubject = new BehaviorSubject();

export const listCardToggleService = {
    toggleIsCardsView: (bool) => listCardToggleSubject.next({ isCardsView: bool }),
    IsCardsViewSub: listCardToggleSubject.asObservable()
};