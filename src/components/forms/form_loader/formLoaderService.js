import { Subject } from 'rxjs';

const openFormSubject = new Subject();

export const openFormService = {
    openForm: (_id) => openFormSubject.next({ id: _id }),
    openFormSub: openFormSubject.asObservable()
};

const saveClickedSubject = new Subject();

export const saveClickedService = {
    saveClicked: () => saveClickedSubject.next(true),
    saveClickedSub: saveClickedSubject.asObservable()
}

const deleteClickedSubject = new Subject();

export const deleteClickedService = {
    deleteClicked: () => deleteClickedSubject.next(true),
    deleteClickedSub: deleteClickedSubject.asObservable()
}
