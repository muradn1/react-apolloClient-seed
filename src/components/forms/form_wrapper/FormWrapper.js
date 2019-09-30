import React, {useRef, useEffect} from 'react';
import { Form } from 'react-final-form';
import { saveClickedService } from '../form_loader/formLoaderService';
import "./formWrapper.scss"
import _ from "lodash";
import arrayMutators from 'final-form-arrays';
import PropTypes from 'prop-types';    

FormWrapper.propTypes = {
    initialValues: PropTypes.object,
    validate: PropTypes.func,
    onSubmit: PropTypes.func,
    formBody: PropTypes.func
}

export default function FormWrapper({ initialValues = {}, validate, onSubmit, formBody }) {
    const formRef = useRef(null);

    //this effect handles "save" clicked
    useEffect(() => {
        const saveClicked = () => {
            formRef.current.dispatchEvent(new Event("submit"));
        }

        let subscription = saveClickedService.saveClickedSub.subscribe(saveClicked)
        return () => {
            subscription.unsubscribe();
        };
    }, [initialValues])


    return (
        <div>
            <Form
                initialValues={initialValues}
                mutators={{...arrayMutators}}
                onSubmit={() => { }}
                validate={validate}
                render={({ handleSubmit, values, errors, form: { mutators: { push } }, dirtyFields }) => (
                    <form
                        onSubmit={() => {
                            handleSubmit();
                            if (_.isEmpty(errors)) {
                                onSubmit({ values, dirtyFields })
                            }
                        }}
                        ref={formRef}
                        noValidate
                    >
                        {formBody({push})}
                    </form>
                )}
            />
        </div>
    )
}
